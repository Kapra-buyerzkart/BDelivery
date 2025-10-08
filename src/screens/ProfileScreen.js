import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import LoaderComponent from '../components/LoaderComponent';
import AlertComponent from '../components/AlertComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchProfileDetails } from '../services/api/api';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const [agentId, setAgentId] = useState(null);
    const [agentName, setAgentName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const agent = useSelector((state) => state.agent);

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const id = await AsyncStorage.getItem('agentId');
    //             console.log("id", agentId)
    //             if (!id) {
    //                 setAlertMessage('Agent not logged in');
    //                 setShowAlert(true);
    //                 return;
    //             }

    //             setAgentId(id);
    //             setLoading(true);

    //             const response = await fetchProfileDetails(id)

    //             const res = response.data;

    //             if (res?.Data) {
    //                 const { agentName, emailId, phoneNo } = res.Data;
    //                 setAgentName(agentName);
    //                 setEmailId(emailId);
    //                 setPhoneNo(phoneNo);
    //             } else {
    //                 setAlertMessage(res?.Message || 'Failed to load profile');
    //                 setShowAlert(true);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching profile:', error);
    //             setAlertMessage('Something went wrong while loading profile');
    //             setShowAlert(true);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProfile();
    // }, []);

    // if (loading) {
    //     return <LoaderComponent />;
    // }

    return (
        <SafeAreaView style={styles.container}>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color={AppColors.primaryColor} />
            </TouchableOpacity>

            <AlertComponent
                visible={showAlert}
                message={alertMessage}
                okClick={() => setShowAlert(false)}
            />
            <Text style={styles.title}>My Profile</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Agent Name"
                    value={agent.name}
                    editable={false}
                    placeholderTextColor={AppColors.gray}
                />
                <MaterialIcons
                    name="person"
                    size={22}
                    color={AppColors.darkBlue}
                    style={styles.icon}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email ID"
                    value={agent.email}
                    editable={false}
                    placeholderTextColor={AppColors.gray}
                />
                <Entypo
                    name="email"
                    size={22}
                    color={AppColors.darkBlue}
                    style={styles.icon}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={agent.phoneNo}
                    editable={false}
                    placeholderTextColor={AppColors.gray}
                />
                <Entypo
                    name="mobile"
                    size={22}
                    color={AppColors.darkBlue}
                    style={styles.icon}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Super Market Name"
                    value={agent.superMarketName}
                    editable={false}
                    placeholderTextColor={AppColors.gray}
                />
                <Entypo
                    name="mobile"
                    size={22}
                    color={AppColors.darkBlue}
                    style={styles.icon}
                />
            </View>

            {/* <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButtonView}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.1,
        backgroundColor: AppColors.primaryColor,
    },
    title: {
        fontSize: 17,
        textAlign: 'center',
        color: AppColors.whiteColor,
        fontFamily: Fonts.OpenSansBold,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: AppColors.darkBlue,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: AppColors.whiteColor,
    },
    input: {
        flex: 1,
        height: 50,
        paddingLeft: 10,
        fontSize: 14,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansRegular,
    },
    icon: {
        paddingHorizontal: 10,
    },
    backButtonView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    backButtonText: {
        color: AppColors.whiteColor,
        fontSize: 13,
        fontFamily: Fonts.OpenSansBold,
    },
    backButton: {
        backgroundColor: AppColors.whiteColor,
        padding: 8,
        borderRadius: 20,
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 10,
        elevation: 3,
    },
});

export default ProfileScreen;
