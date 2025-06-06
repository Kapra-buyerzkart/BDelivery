import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

const TaskDetailsScreen = ({ navigation, route }) => {
    const {
        taskNo,
        customerName,
        deliveryAddress,
        storeName,
        pickupAddress,
        paymentType,
        amount,
        kilometers,
        date,
        time,
        routeCoordinates // Expected as array of { latitude: number, longitude: number }
    } = route.params;


    const renderAddress = (address) => (
        <>
            <Text style={styles.value}>{address.addressLineOne}</Text>
            <Text style={styles.value}>{address.addressLineTwo}</Text>
            <Text style={styles.value}>{address.addressLineThree}</Text>
            <Text style={styles.value}>Pincode: {address.pincode}</Text>
        </>
    );

    const getInitialRegion = () => {
        if (routeCoordinates.length > 0) {
            const { latitude, longitude } = routeCoordinates[0];
            return {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        }
        return {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            {console.log("routeCoordinates", routeCoordinates)}
            <View style={styles.topView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Task Details</Text>
                <View style={styles.hideStyle} />
            </View>

            {routeCoordinates?.length > 0 && (
                <MapView style={styles.map} initialRegion={getInitialRegion()}>
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#007bff"
                        strokeWidth={4}
                    />
                    <Marker coordinate={routeCoordinates[0]} title="Start" pinColor='blue' />
                    <Marker
                        coordinate={routeCoordinates[routeCoordinates.length - 1]}
                        title="End"
                        pinColor='red'
                    />
                </MapView>
            )}

            <ScrollView contentContainerStyle={styles.content}>
                <Section title="Task Number" value={taskNo} />
                <Section title="Customer Name" value={customerName} />
                <Section title="Delivery Address">{renderAddress(deliveryAddress)}</Section>
                <Section title="Store Name" value={storeName} />
                <Section title="Pickup Address">{renderAddress(pickupAddress)}</Section>
                <Section title="Payment Type" value={paymentType} />
                <Section title="Amount" value={amount} />
                <Section title="Kilometers Covered" value={kilometers} />
                <Section title="Date" value={date} />
                <Section title="Time" value={time} />
            </ScrollView>
        </SafeAreaView>
    );
};

const Section = ({ title, value, children }) => {
    const parsedValue = Number(value);

    return (
        <View style={styles.section}>
            <Text style={styles.label}>{title}</Text>
            {!isNaN(parsedValue) ? (
                <Text style={styles.value}>{parsedValue.toFixed(2)}</Text>
            ) : value ? (
                <Text style={styles.value}>{value}</Text>
            ) : null}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.appBackgroundColor,
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.primaryColor,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 56,
        elevation: 3,
    },
    headerText: {
        fontSize: 16,
        fontFamily: Fonts.OpenSansBold,
        color: AppColors.whiteColor,
    },
    hideStyle: {
        width: 24,
    },
    map: {
        height: 200,
        margin: 16,
        borderRadius: 10,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.OpenSansBold,
        color: AppColors.black,
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        fontFamily: Fonts.OpenSansRegular,
        color: AppColors.black,
        lineHeight: 20,
    },
});

export default TaskDetailsScreen;
