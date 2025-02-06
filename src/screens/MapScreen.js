import React, { useEffect, useState } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform, Button, Linking, TouchableOpacity, Text, AppState, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { AppColors } from "../constants/Colors";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Fonts } from "../constants/Fonts";

const App = ({ navigation }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [navigationCompleted, setNavigationCompleted] = useState(false);

    const destination = {
        latitude: 9.9312, // Example: Cochin, Kerala
        longitude: 76.2673,
    };

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === "android") {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getLocation();
                }
            } else {
                getLocation();
            }
        };

        const getLocation = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log("pos", position);
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => console.error(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        requestLocationPermission();
    }, []);

    const openGoogleMaps = () => {
        if (currentLocation) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${destination.latitude},${destination.longitude}`;
            Linking.openURL(url);
        }
    };

    const onComplete = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            {console.log("curr", currentLocation)}
            {console.log("dest", destination)}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
            </TouchableOpacity>
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
            <View style={{
                flex: 1,
                // backgroundColor:"yellow",
                padding: 15,
                justifyContent: 'center'
            }}>
                <View style={{
                    flexDirection: "row"
                }}>
                    <View style={{
                        flex: 1,
                        // backgroundColor:'yellow',
                        justifyContent:'center'
                    }}>
                        <Text style={{
                            color: AppColors.black,
                            fontFamily: Fonts.OpenSansBold,
                            fontSize: 15,
                        }}>Pickup Address</Text>

                    </View>
                    <TouchableOpacity style={{
                        flex: 1,
                        // backgroundColor: 'green',
                        alignItems:"flex-end"
                    }} onPress={openGoogleMaps}>
                        <Image style={{
                            height: 40,
                            width: 40,
                        }} source={require('../assets/images/google-maps.png')} />
                    </TouchableOpacity>
                </View>

                <Text style={{
                    fontFamily: Fonts.OpenSansRegular,
                    color: AppColors.black,
                    fontSize: 14
                }}>
                    Microstore Chakkarapparambu
                </Text>
                <Text style={{
                    marginTop: 5,
                    fontFamily: Fonts.OpenSansRegular,
                    color: AppColors.black,
                    fontSize: 14
                }}>
                    2nd floor, Nandhanam Tower, Kaniyapilly Rd, Chakkaraparambu, Vennala, Kochi, Ernakulam, Kerala 682028
                </Text>
                <Text style={{
                    marginTop: 5,
                    fontFamily: Fonts.OpenSansSemiBold,
                    fontSize: 15
                }}>COD: Yes</Text>
                <Text style={{
                    marginTop: 5,
                    fontFamily: Fonts.OpenSansSemiBold,
                    fontSize: 15
                }}>Amount: 200.00</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: AppColors.blue,
                        padding: 10,
                        alignItems: 'center',
                        // justifyContent: 'center',
                        borderRadius: 5, // Optional for rounded corners
                        marginTop: 10
                    }}
                    onPress={onComplete} // Make sure to add this to trigger the function
                >
                    <Text style={{
                        color: AppColors.whiteColor,
                        fontFamily: Fonts.OpenSansSemiBold,
                        fontSize: 16,
                    }}>
                        Complete
                    </Text>
                </TouchableOpacity>

            </View>
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
});

export default App;
