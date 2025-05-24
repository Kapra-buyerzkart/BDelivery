import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

const TaskDetailsScreen = ({ navigation }) => {
    const taskData = {
        taskNumber: 'ORD1996141890',
        customerName: 'Customer One',
        deliveryAddress: {
            addressLineOne: 'Address Line One',
            addressLineTwo: 'Address Line Two',
            addressLineThree: 'Palarivattom',
            pincode: '682025',
        },
        storeName: 'Microstore 01, Vennala',
        pickupAddress: {
            addressLineOne: '2nd floor, Nandhanam Tower',
            addressLineTwo: 'Kaniyapilly Rd',
            addressLineThree: 'Chakkaraparambu, Vennala',
            pincode: '682028',
        },
        paymentType: 'COD',
        amount: '₹200.00',
        kilometers: '100 km',
        date: '13 May 2025',
        time: '11:00 AM',
    };

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
                <Section title="Task Number" value={taskData.taskNumber} />
                <Section title="Customer Name" value={taskData.customerName} />
                <Section title="Delivery Address">
                    {renderAddress(taskData.deliveryAddress)}
                </Section>
                <Section title="Store Name" value={taskData.storeName} />
                <Section title="Pickup Address">
                    {renderAddress(taskData.pickupAddress)}
                </Section>
                <Section title="Payment Type" value={taskData.paymentType} />
                <Section title="Amount" value={taskData.amount} />
                <Section title="Kilometers Covered" value={taskData.kilometers} />
                <Section title="Date" value={taskData.date} />
                <Section title="Time" value={taskData.time} />
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
