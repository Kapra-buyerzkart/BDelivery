import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Fonts } from '../constants/Fonts'
import { TouchableOpacity } from 'react-native'
import { AppColors } from '../constants/Colors'

const OrderCard = ({ order_no, onDecline, navigation }) => {

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
                    {order_no}
                </Text>
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[
                        styles.button,
                    ]}
                    onPress={() => navigation.navigate("Task", {
                        orderNo: order_no
                    })}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: AppColors.red }]}
                    onPress={onDecline}
                >
                    <Text style={styles.buttonText}>Decline</Text>
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

export default OrderCard