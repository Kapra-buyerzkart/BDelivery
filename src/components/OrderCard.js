import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Fonts } from '../constants/Fonts'
import { TouchableOpacity } from 'react-native'
import { AppColors } from '../constants/Colors'
import firestore from '@react-native-firebase/firestore';
import { modifyOrderStatus } from '../services/api/api'

const OrderCard = ({ task_no, onDecline, navigation, id, handleOrderAccepted, status, agentId, onAccept, pincode, area }) => {

    // const handleAccept = async () => {
    //     const docRef = firestore().collection('tasks').doc(id);
    //     const docSnap = await docRef.get();

    //     if (docSnap.exists) {
    //         const data = docSnap.data();

    //         if (data.selectedByDeliveryAgent === true) {
    //             handleOrderAccepted(true, task_no)
    //             // console.log('Task is already selected by another delivery agent.');
    //         } else {
    //             // console.log('Task successfully selected by this delivery agent.');
    //             await docRef.update({ selectedByDeliveryAgent: true });
    //             navigation.navigate("Task", {
    //                 taskNo: task_no,
    //                 taskId: id
    //             })
    //         }

    //     } else {
    //         // console.log('Task not found.');
    //     }
    // }

    const handleAccept = async () => {
        try {
            const response = await modifyOrderStatus(id, agentId, "Delivery Agent Accepted");
            if (response.data.Message === "Order Status Updated") {
                console.log("✅ Success:", response.data.Message);
                // You can also show a toast or update UI here
            } else {
                console.warn("⚠️ Unexpected response:", response.data);
            }
        } catch (error) {
            console.error("❌ Error updating order status:", error);
        }
    }

    const handleAccepted = () => {
        navigation.navigate("Task", {
            taskNo: task_no,
            taskId: id
        })
    }

    return (
        <View style={styles.orderContainer}>
            {/* <Text style={styles.orderTitle}>
                Order No: {item.salesorder_number}
              </Text> */}
            <View style={styles.orderTitleView}>
                <Text style={styles.orderTitle}>Order No:</Text>
                <Text
                    style={[
                        styles.orderTitle,
                        { fontFamily: Fonts.OpenSansBold },
                    ]}>
                    {' '}
                    {task_no}
                </Text>
            </View>
            <View style={styles.orderTitleView}>
                <Text style={styles.orderTitle}>Pincode:</Text>
                <Text
                    style={[
                        styles.orderTitle,
                        { fontFamily: Fonts.OpenSansBold },
                    ]}>
                    {' '}
                    {pincode}
                </Text>
            </View>
            <View style={styles.orderTitleView}>
                <Text style={styles.orderTitle}>Area:</Text>
                <Text
                    style={[
                        styles.orderTitle,
                        { fontFamily: Fonts.OpenSansBold },
                    ]}>
                    {' '}
                    {area}
                </Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onAccept && onAccept({ orderId: id, taskNo: task_no, agentId })}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        marginBottom: 5,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansSemiBold,
    },
    buttonRow: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        justifyContent: "space-evenly",
        width: '100%',
        marginTop: 5
    },
    button: {
        padding: 10,
        backgroundColor: AppColors.green,
        borderRadius: 5,
        width: '35%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        // fontWeight: 'bold',
        fontSize: 13,
        fontFamily: Fonts.OpenSansBold,
    },
})

export default OrderCard