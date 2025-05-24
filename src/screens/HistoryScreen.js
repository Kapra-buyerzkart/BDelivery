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

const HistoryScreen = ({ navigation }) => {

    const [agentId, setAgentId] = useState(null);
    const [completedTasks, setCompletedTasks] = useState(null);


    const [orders, setOrders] = useState([
        {
            id: 1,
            order_no: 'ORD1996141890',
            earnings: '1800.0',
            collection: '1100.0'
        },
        {
            id: 2,
            order_no: 'ORD1996141891',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 3,
            order_no: 'ORD1996141892',
            earnings: '1200.0',
            collection: '1100.0'
        },
        {
            id: 4,
            order_no: 'ORD1996141893',
            earnings: '1200.0',
            collection: '1100.0'
        }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await AsyncStorage.getItem('id');
                console.log('id', id);
                setAgentId(id);

                if (id) {
                    const agentDoc = await firestore().collection('deliveryAgents').doc(id).get();
                    if (agentDoc.exists) {
                        const completedTasks = agentDoc.data()?.completedOrders || ' ';
                        setCompletedTasks(completedTasks);
                    } else {
                        console.warn('No such document found for this ID.');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {console.log("ssss", completedTasks)}
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
                data={completedTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <HistoryCard
                        taskNo={item.taskNumber}
                        navigation={navigation}
                        customerName={item.customerName}
                        storeName={item.storeName}
                        date={item.date}
                        time={item.time}
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