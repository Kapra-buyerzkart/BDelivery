import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '../constants/Colors'
import { TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from '../constants/Fonts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Container';
import { RouteProp } from '@react-navigation/native';
import { FlatList } from 'react-native';
import EmptyComponent from '../components/EmptyComponent';
import HistoryCard from '../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const HistoryScreen = ({ navigation }) => {

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const id = await AsyncStorage.getItem('id');
    //             console.log('id', id);
    //             setAgentId(id);

    //             if (id) {
    //                 const agentDoc = await firestore().collection('deliveryAgents').doc(id).get();
    //                 if (agentDoc.exists) {
    //                     const completedTasks = agentDoc.data()?.completedOrders || ' ';
    //                     setCompletedTasks(completedTasks);
    //                 } else {
    //                     console.warn('No such document found for this ID.');
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    const agent = useSelector((state) => state.agent);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.ordersText}>HISTORY</Text>
                <TouchableOpacity style={styles.hideStyle}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={agent.completedOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <HistoryCard
                        taskNo={item.taskNumber}
                        navigation={navigation}
                        customerName={item.customerName}
                        storeName={item.storeName}
                        date={item.date}
                        time={item.time}
                        paymentType={item.paymentType}
                        amount={item.amount}
                        kilometers={item.kilometers}
                        deliveryAddress={item.deliveryAddress}
                        pickupAddress={item.pickupAddress}
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

export default HistoryScreen