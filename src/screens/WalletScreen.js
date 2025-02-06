import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { AppColors } from '../constants/Colors'
import { TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from '../constants/Fonts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Container';
import { RouteProp } from '@react-navigation/native';
import { FlatList } from 'react-native';
import EmptyComponent from '../components/EmptyComponent';
import WalletCard from '../components/WalletCard';

const WalletScreen = ({ navigation }) => {


    const [orders, setOrders] = useState([
        {
            id: 1,
            order_no: 'S0-00917',
            earnings: '1800.0',
            collection: '1100.0'
        },
        {
            id: 2,
            order_no: 'S0-00918',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 3,
            order_no: 'S0-00919',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 4,
            order_no: 'S0-00920',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 5,
            order_no: 'S0-00921',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 6,
            order_no: 'S0-00922',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 7,
            order_no: 'S0-00923',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 8,
            order_no: 'S0-00924',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 9,
            order_no: 'S0-00925',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 10,
            order_no: 'S0-00926',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 11,
            order_no: 'S0-00927',
            earnings: '1200.0',
            collection: '1100.0'
        },
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.ordersText}>WALLET</Text>
                <TouchableOpacity style={styles.hideStyle}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <WalletCard
                        order_no={item.order_no}
                        earnings={item.earnings}
                        collection={item.collection}
                    />
                )}
                ListEmptyComponent={<EmptyComponent text='NO ORDERS' />}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.appBackgroundColor,
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.primaryColor,
        // paddingVertical: 6,
        justifyContent: "space-between",
        paddingHorizontal: 10,
        height: 50
    },
    ordersText: {
        color: AppColors.whiteColor,
        fontFamily: Fonts.OpenSansBold,
        fontSize: 14
    },
    hideStyle: {
        opacity: 0
    },
    orderContainer: {
        padding: 15,
        marginVertical: 6,
        backgroundColor: AppColors.whiteColor,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
    },
    orderTitleView: {
        flexDirection: 'row',
    },
    orderTitle: {
        fontSize: 13,
        // fontWeight: 'bold',
        marginBottom: 10,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansSemiBold,
    },
    buttonRow: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        justifyContent: "space-evenly",
        width: '100%',
    },
    button: {
        padding: 10,
        backgroundColor: AppColors.green,
        borderRadius: 5,
        width: '35%',
        alignItems: 'center',
    },
    buttonText: {
        color: AppColors.whiteColor,
        // fontWeight: 'bold',
        fontSize: 13,
        fontFamily: Fonts.OpenSansBold,
    },
})

export default WalletScreen