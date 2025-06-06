import React, { useEffect, useState } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform, Button, Linking, TouchableOpacity, Text, AppState, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { AppColors } from "../constants/Colors";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Fonts } from "../constants/Fonts";
import { useRoute } from "@react-navigation/native";
import LoaderComponent from "../components/LoaderComponent";
import { useDispatch } from "react-redux";
import { updateTask } from "../redux/actions/taskAction";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocationTracking from "../hooks/useLocationTracking";
import TaskCompletedModal from "../components/TaskCompletedModal";
import dayjs from 'dayjs';

const MapScreen = ({ navigation }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [navigationCompleted, setNavigationCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [agentId, setAgentId] = useState(null);
    const [taskData, setTaskData] = useState(null);
    const [startClicked, setStartClicked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const route = useRoute();
    const dispatch = useDispatch();

    const { heading, address, name, type, taskId, amount, taskNo } = route.params;
    const [deliveryStarted, setDeliveryStarted] = useState(false);

    const { distanceTravelled, routeCoordinates } = useLocationTracking(
        taskId,
        heading,
        deliveryStarted,
        agentId
    );

    const destination = {
        latitude: parseFloat(address.latitude),
        longitude: parseFloat(address.longitude),
    };

    // const destination = {
    //     latitude: 9.97697440146752,
    //     longitude: 76.309760272405,
    // };

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getLocation();
                    } else {
                        console.warn('Location permission denied');
                        setLoading(false);
                    }
                } else {
                    getLocation();
                }
            } catch (error) {
                console.error('Permission request error:', error);
                setLoading(false);
            }
        };

        const getLocation = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setLoading(false);
                },
                (error) => {
                    console.error('Location error:', error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 30000,
                    maximumAge: 10000,
                }
            );
        };

        requestLocationPermission();
    }, []);

    useEffect(() => {
        const fetchAgentId = async () => {
            const id = await AsyncStorage.getItem('id');
            console.log('id', id)
            setAgentId(id);
        }
        // const fetchTaskData = () => {
        //     setTaskData({
        //         taskNumber: taskNo,
        //         customerName: 'Customer One',
        //         deliveryAddress: {
        //             addressLineOne: 'Address Line One',
        //             addressLineTwo: 'Address Line Two',
        //             addressLineThree: 'Palarivattom',
        //             pincode: '682025',
        //         },
        //         storeName: 'Microstore 01, Vennala',
        //         pickupAddress: {
        //             addressLineOne: '2nd floor, Nandhanam Tower',
        //             addressLineTwo: 'Kaniyapilly Rd',
        //             addressLineThree: 'Chakkaraparambu, Vennala',
        //             pincode: '682028',
        //         },
        //         paymentType: type,
        //         amount: amount,
        //         kilometers: null,
        //         date: null,
        //         time: null,
        //     })
        // }
        fetchAgentId()
        // fetchTaskData()
    }, [])

    const openGoogleMaps = () => {
        if (currentLocation) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${destination.latitude},${destination.longitude}`;
            Linking.openURL(url);
            // setDeliveryStarted(true)
        }
    };

    const onComplete = () => {
        navigation.goBack()
    }

    // if (loading) {
    //     return <LoaderComponent />;
    // }


    const updatePickupCompleted = async (taskId, status) => {
        try {
            await firestore().collection('tasks').doc(taskId).update({
                pickupCompleted: status,
            });
            console.log('pickupCompleted updated successfully');
            const agentRef = firestore().collection('deliveryAgents').doc(agentId);
            await firestore().runTransaction(async transaction => {
                const doc = await transaction.get(agentRef);

                let updatedOrders = [];
                if (doc.exists && doc.data()?.completedOrders?.length > 0) {
                    updatedOrders = [...doc.data().completedOrders];
                }

                // Add the new taskData
                updatedOrders.push({
                    taskId: taskId,
                    taskNumber: taskNo,
                    // customerName: 'Customer One',
                    // deliveryAddress: {
                    //     addressLineOne: 'Address Line One',
                    //     addressLineTwo: 'Address Line Two',
                    //     addressLineThree: 'Palarivattom',
                    //     pincode: '682025',
                    // },
                    storeName: name,
                    pickupAddress: {
                        addressLineOne: address.addressLineOne,
                        addressLineTwo: address.addressLineTwo,
                        addressLineThree: address.addressLineThree,
                        pincode: address.pincode,
                    },
                    paymentType: type,
                    amount: amount,
                    // kilometers: null,
                    // date: null,
                    // time: null,
                });

                transaction.set(agentRef, { completedOrders: updatedOrders }, { merge: true });
            });

            console.log('completedOrders updated successfully');
            setModalVisible(true)
            // navigation.goBack()
        } catch (error) {
            console.error('Error updating pickupCompleted:', error);
        }
    };

    const updateDeliveryCompleted = async (taskId, status) => {
        try {
            await firestore().collection('tasks').doc(taskId).update({
                deliveryCompleted: status,
                kiolmeters: distanceTravelled,
            });
            console.log('deliveryCompleted updated successfully');
            const agentRef = firestore().collection('deliveryAgents').doc(agentId);
            const now = dayjs();
            const dateStr = now.format('DD, MMMM YYYY');
            const timeStr = now.format('hh:mm A');
            console.log('timeStr', timeStr)
            await firestore().runTransaction(async transaction => {
                const agentDoc = await transaction.get(agentRef);

                if (!agentDoc.exists) {
                    throw new Error('Agent document not found');
                }

                let updatedOrders = agentDoc.data()?.completedOrders || [];

                // Step 3: Find the index of the task to update
                const index = updatedOrders.findIndex(order => order.taskId === taskId);

                if (index !== -1) {
                    // Step 4: Update deliveryAddress of the found task
                    updatedOrders[index].deliveryAddress = {
                        addressLineOne: address.addressLineOne,
                        addressLineTwo: address.addressLineTwo,
                        addressLineThree: address.addressLineThree,
                        pincode: address.pincode,
                        date: dateStr,
                        time: timeStr,
                    };

                    updatedOrders[index].customerName = name
                    updatedOrders[index].kilometers = distanceTravelled;

                    transaction.set(agentRef, { completedOrders: updatedOrders }, { merge: true });
                } else {
                    console.warn(`Task ID ${taskId} not found in completedOrders`);
                }
            });

            console.log('deliveryAddress updated successfully in completedOrders');
            setModalVisible(true)
            // navigation.navigate("Home")
        } catch (error) {
            console.error('Error updating deliveryCompleted:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* {console.log("curr", currentLocation)}
            {console.log("dest", destination)} */}
            {console.log('deliveryStarted', deliveryStarted)}
            {console.log("agentId", agentId)}
            {console.log("dist", distanceTravelled)}
            {console.log('route', routeCoordinates)}
            {console.log('currentLocation', currentLocation)}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
            </TouchableOpacity>
            {loading ? (<LoaderComponent />) : (
                <>
                    <TaskCompletedModal
                        visible={modalVisible}
                        onClose={() => {
                            setModalVisible(false)
                            { heading === "Pickup Address" ? navigation.goBack() : navigation.navigate("Home") }

                        }}
                        taskNo={taskNo}
                        totalKm={distanceTravelled}
                        task={heading === "Pickup Address" ? "Pick Up" : "Delivery"}
                    />
                    {currentLocation && (
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: (currentLocation.latitude + destination.latitude) / 2,
                                longitude: (currentLocation.longitude + destination.longitude) / 2,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            }}
                            showsUserLocation={true}
                        >
                            <Marker
                                coordinate={currentLocation}
                                title="Current Location"
                                pinColor="blue"
                            />
                            <Marker coordinate={destination} title="Destination" pinColor="red" />
                        </MapView>
                    )}
                    {/* <Button title="Navigate to Google Maps" onPress={openGoogleMaps} /> */}
                    <View style={styles.addressMainView}>
                        <View style={styles.addressInnerViewOne}>
                            <View style={styles.addressInnerViewTwo}>
                                <Text style={styles.addressHeadingText}>{heading}</Text>
                            </View>
                            <TouchableOpacity style={styles.mapButtonView} onPress={openGoogleMaps}>
                                <Image style={styles.mapImage} source={require('../assets/images/google-maps.png')} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.addressText}>
                            {name}
                        </Text>
                        <Text style={styles.addressText}>
                            {address.addressLineOne}
                        </Text>
                        <Text style={styles.addressText}>
                            {address.addressLineTwo}
                        </Text>
                        <Text style={styles.addressText}>
                            {address.addressLineThree}
                        </Text>
                        <Text style={styles.addressText}>
                            {address.pincode}
                        </Text>
                        <Text style={styles.codText}>Type: {type}</Text>
                        {type === "cod" && (
                            <Text style={styles.codText}>Amount: {amount}</Text>
                        )}
                        <TouchableOpacity
                            style={startClicked ?
                                [styles.completeButtonView, { backgroundColor: AppColors.blue }] :
                                [styles.completeButtonView, {
                                    backgroundColor: AppColors.green

                                }]
                            }
                            // onPress={heading === "Pickup Address" ?
                            //     () => {
                            //         updatePickupCompleted(taskId, true)
                            //     } :
                            //     () => {
                            //         updateDeliveryCompleted(taskId, true)
                            //     }
                            // }
                            // onPress={() => setStartClicked(true)}
                            onPress={() => {
                                if (!startClicked && heading === "Pickup Address") {
                                    setStartClicked(true)
                                } else if (!startClicked && heading === "Delivery Address") {
                                    setStartClicked(true)
                                    setDeliveryStarted(true)
                                } else if (startClicked && heading === "Pickup Address") {
                                    updatePickupCompleted(taskId, true)
                                } else if (startClicked && heading === "Delivery Address") {
                                    setDeliveryStarted(false)
                                    updateDeliveryCompleted(taskId, true)
                                }
                            }}
                        >
                            <Text style={styles.completeButtonText}>
                                {startClicked ? 'Complete' : 'Start'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.appBackgroundColor
    },
    map: { width: "100%", height: "55%" },
    backButton: {
        backgroundColor: AppColors.primaryColor,
        padding: 5,
        borderRadius: 7,
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1
    },
    addressMainView: {
        flex: 1,
        // backgroundColor:"yellow",
        padding: 15,
        justifyContent: 'center'
    },
    addressInnerViewOne: {
        flexDirection: "row"
    },
    addressInnerViewTwo: {
        flex: 1,
        // backgroundColor:'yellow',
        justifyContent: 'center'
    },
    addressHeadingText: {
        color: AppColors.black,
        fontFamily: Fonts.OpenSansBold,
        fontSize: 15,
    },
    mapButtonView: {
        flex: 1,
        // backgroundColor: 'green',
        alignItems: "flex-end"
    },
    mapImage: {
        height: 40,
        width: 40,
    },
    addressText: {
        fontFamily: Fonts.OpenSansRegular,
        color: AppColors.black,
        fontSize: 14
    },
    codText: {
        marginTop: 5,
        fontFamily: Fonts.OpenSansSemiBold,
        fontSize: 15
    },
    completeButtonView: {
        // backgroundColor: AppColors.blue,
        padding: 10,
        alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 5, // Optional for rounded corners
        marginTop: 10
    },
    completeButtonText: {
        color: AppColors.whiteColor,
        fontFamily: Fonts.OpenSansSemiBold,
        fontSize: 16,
    }
});

export default MapScreen;
