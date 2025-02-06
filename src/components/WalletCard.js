import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Fonts } from '../constants/Fonts'
import { TouchableOpacity } from 'react-native'
import { AppColors } from '../constants/Colors'

const WalletCard = ({ order_no, earnings, collection }) => {

    return (
        <View style={styles.orderContainer}>
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
            <View style={styles.bottomView}>
                <View style={styles.earningsView}>
                    <Text style={styles.earningsText}>Earnings:</Text>
                    <Text style={styles.earningAmountText}>{earnings}</Text>
                </View>

                <View style={[styles.earningsView, { marginLeft: 10 }]}>
                    <Text style={styles.earningsText}>Collection:</Text>
                    <Text style={styles.earningAmountText}>{collection}</Text>
                </View>
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
    bottomView: {
        flexDirection: "row",
    },
    earningsView: {
        flexDirection: 'row',
        backgroundColor: AppColors.orange,
        // padding: 5,
        borderRadius: 5,
        width: 115,
        height: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    earningsText: {
        color: AppColors.whiteColor,
        fontFamily: Fonts.OpenSansSemiBold,
        fontSize: 12
    },
    earningAmountText: {
        marginLeft: 5,
        color: AppColors.whiteColor,
        fontFamily: Fonts.OpenSansBold,
        fontSize: 12
    }
})

export default WalletCard