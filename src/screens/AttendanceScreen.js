import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as mime from 'react-native-mime-types'; // helps with content-type
import { useSelector } from 'react-redux';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import LoaderComponent from '../components/LoaderComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import AlertComponent from '../components/AlertComponent';

const storeLat = 9.991115246645776;
const storeLon = 76.31722005310512;

// 🔐 Replace these with your actual Cloudinary credentials
const CLOUD_NAME = 'dgjrhnxgj';
const UPLOAD_PRESET = 'Attendance';

export default function AttendanceScreen() {
    const route = useRoute();
    const { agentId } = route.params;
    const camera = useRef(null);
    const device = useCameraDevice('front');
    const [hasPermission, setHasPermission] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showOutOfRangeAlert, setShowOutOfRangeAlert] = useState(false);
    const [showLocationErrorAlert, setShowLocationErrorAlert] = useState(false);
    const [punchType, setPunchType] = useState(null);
    const store = useSelector((state) => state.store);
    const navigation = useNavigation();
    useEffect(() => {
        (async () => {
            const camStatus = await Camera.requestCameraPermission();
            setHasPermission(camStatus === 'granted');

            if (Platform.OS === 'android') {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            }
            const now = new Date();
            const today = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
            const agentDoc = await firestore().collection('deliveryAgents').doc(agentId).get();
            const attendanceRecords = agentDoc.data()?.attendance || [];
            const todayRecord = attendanceRecords.find(record => record.date === today);
            if (!todayRecord) {
                setPunchType('punchIn');
            } else if (todayRecord && !todayRecord.punchOut) {
                setPunchType('punchOut');
            } else {
                setPunchType('done');
            }
        })();
    }, []);

    const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
        const toRad = (val) => (val * Math.PI) / 180;
        const R = 6371e3;
        const φ1 = toRad(lat1), φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
        const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const uploadToCloudinary = async (fileUri) => {
        const data = new FormData();
        data.append('file', {
            uri: fileUri,
            name: `${uuid.v4()}.jpg`,
            type: mime.lookup(fileUri) || 'image/jpeg'
        });
        data.append('upload_preset', UPLOAD_PRESET);

        const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const res = await axios.post(cloudUrl, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return res.data.secure_url;
    };

    const takeAttendance = async () => {
        setLoading(true);
        try {
            Geolocation.getCurrentPosition(
                async (pos) => {
                    const now = new Date();
                    const time = now.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    });
                    const day = String(now.getDate()).padStart(2, '0');
                    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                    const year = now.getFullYear();
                    const date = `${day}-${month}-${year}`;
                    const photo = await camera.current.takePhoto({ flash: 'off' });
                    const { latitude, longitude } = pos.coords;

                    const distance = getDistanceInMeters(latitude, longitude, store.storeDetails.latitude, store.storeDetails.longitude);
                    if (distance > 500) {
                        setLoading(false);
                        return setShowOutOfRangeAlert(true);
                    }

                    const photoUrl = await uploadToCloudinary('file://' + photo.path);
                    const attendanceRef = firestore().collection('deliveryAgents').doc(agentId);

                    const agentDoc = await attendanceRef.get();
                    const attendanceRecords = agentDoc.data()?.attendance || [];
                    const todayRecordIndex = attendanceRecords.findIndex(rec => rec.date === date);

                    if (punchType === 'punchIn') {
                        const newEntry = {
                            date,
                            punchIn: {
                                time,
                                location: { latitude, longitude },
                                photo: photoUrl
                            }
                        };
                        await attendanceRef.update({
                            attendance: firestore.FieldValue.arrayUnion(newEntry)
                        });
                    } else if (punchType === 'punchOut' && todayRecordIndex > -1) {
                        attendanceRecords[todayRecordIndex].punchOut = {
                            time,
                            location: { latitude, longitude },
                            photo: photoUrl
                        };
                        await attendanceRef.update({ attendance: attendanceRecords });
                    }

                    setLoading(false);
                    setShowSuccessAlert(true);
                    setPunchType('done'); // Mark done to disable further punches
                },
                (err) => {
                    setLoading(false);
                    console.error(err);
                    setShowLocationErrorAlert(true);
                },
                { enableHighAccuracy: true, timeout: 15000 }
            );
        } catch (e) {
            setLoading(false);
            console.error(e);
            setShowErrorAlert(true);
        }
    };

    if (!device || !hasPermission) return <LoaderComponent />;

    return (
        <View style={styles.container}>
            <AlertComponent
                visible={showSuccessAlert}
                showTitle={true}
                title={"Success"}
                message={"Attendance marked successfully!"}
                okClick={() => {
                    setShowSuccessAlert(false)
                    navigation.goBack()
                }}
            />
            <AlertComponent
                visible={showOutOfRangeAlert}
                showTitle={true}
                title={"Out of Range"}
                message={"You must be within 500m of the store to mark attendance."}
                okClick={() => setShowOutOfRangeAlert(false)}
            />
            <AlertComponent
                visible={showLocationErrorAlert}
                showTitle={true}
                title={"Location Error"}
                message={"Failed to get location. Please enable GPS."}
                okClick={() => setShowLocationErrorAlert(false)}

            />
            <AlertComponent
                visible={showErrorAlert}
                showTitle={true}
                title={"Error"}
                message={"Something went wrong during attendance."}
                okClick={() => setShowErrorAlert(false)}
            />
            <Camera
                ref={camera}
                style={styles.camera}
                device={device}
                isActive={true}
                photo={true}
            />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color={AppColors.whiteColor} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={takeAttendance}
                disabled={loading || punchType === 'done'}
            >
                {loading ? (
                    <ActivityIndicator color={AppColors.whiteColor} />
                ) : (
                    <Text style={styles.buttonText}>
                        {punchType === 'punchIn' ? 'Punch In' : punchType === 'punchOut' ? 'Punch Out' : 'Attendance Marked'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    button: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: AppColors.primaryColor,
        padding: 15,
        borderRadius: 10
    },
    buttonText: {
        color: AppColors.whiteColor,
        fontSize: 13,
        fontFamily: Fonts.OpenSansSemiBold
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: AppColors.primaryColor,
        borderRadius: 10,
        padding: 6
    }
});
