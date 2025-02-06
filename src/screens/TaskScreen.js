import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Container';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddressCard from '../components/AddressCard';

const TaskScreen = ({ navigation }) => {
    const route = useRoute();
    const { orderNo } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.topView}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
                <View style={styles.orderNoView}>
                    <Text style={styles.orderNoKey}>Order Number:</Text>
                    <Text style={styles.orderNoValue}>{orderNo}</Text>
                </View>
                <TouchableOpacity style={[styles.backButton, { opacity: 0 }]}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
            </View> */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
            </TouchableOpacity>

            <View style={styles.orderNoView}>
                <Text style={styles.orderNoKey}>Order Number:</Text>
                <Text style={styles.orderNoValue}>{orderNo}</Text>
            </View>
            <AddressCard
                addressHeading='Pickup Address'
                name='Jithin KM'
                addressLineOne='Koottumannil House'
                addressLineTwo='Ambalavattom'
                addressLineThree='Edarikode PO'
                navigation={navigation}
            />
            <AddressCard
                addressHeading='Delivery Address'
                name='Jithin KM'
                addressLineOne='Koottumannil House'
                addressLineTwo='Ambalavattom'
                addressLineThree='Edarikode PO'
                navigation={navigation}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.appBackgroundColor,
        justifyContent: "center",
        alignItems: "center"
    },
    topView: {
        flexDirection: 'row',
        marginHorizontal: 12,
        marginTop: 15,
        marginBottom: 10
    },
    backButton: {
        backgroundColor: AppColors.primaryColor,
        padding: 5,
        borderRadius: 7,
        position: 'absolute',
        top: 20,
        left: 20
    },
    orderNoView: {
        flexDirection: 'row',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },
    orderNoKey: {
        fontSize: 15,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansSemiBold,
    },
    orderNoValue: {
        fontSize: 16,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansBold,
        marginLeft: 5,
    },
    card: {
        backgroundColor: AppColors.whiteColor,
        paddingVertical: 12,
        marginHorizontal: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    cardHeading: {
        color: AppColors.black,
        fontSize: 14,
        fontFamily: Fonts.OpenSansBold,
        marginBottom: 3,
        textAlign: 'center'
    },
    addressText: {
        color: AppColors.black,
        fontSize: 13,
        fontFamily: Fonts.OpenSansRegular,
        textAlign: "center"
    }
});

export default TaskScreen;
