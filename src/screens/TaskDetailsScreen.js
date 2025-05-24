import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
    } = route.params

    const renderAddress = (address) => (
        <>
            <Text style={styles.value}>{address.addressLineOne}</Text>
            <Text style={styles.value}>{address.addressLineTwo}</Text>
            <Text style={styles.value}>{address.addressLineThree}</Text>
            <Text style={styles.value}>Pincode: {address.pincode}</Text>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Task Details</Text>
                <View style={styles.hideStyle} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Section title="Task Number" value={taskNo} />
                <Section title="Customer Name" value={customerName} />
                <Section title="Delivery Address">
                    {renderAddress(deliveryAddress)}
                </Section>
                <Section title="Store Name" value={storeName} />
                <Section title="Pickup Address">
                    {renderAddress(pickupAddress)}
                </Section>
                <Section title="Payment Type" value={paymentType} />
                <Section title="Amount" value={amount} />
                <Section title="Kilometers Covered" value={kilometers} />
                <Section title="Date" value={date} />
                <Section title="Time" value={time} />
            </ScrollView>
        </SafeAreaView>
    );
};

const Section = ({ title, value, children }) => (
    <View style={styles.section}>
        <Text style={styles.label}>{title}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
        {children}
    </View>
);

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
    content: {
        padding: 16,
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
