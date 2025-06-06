import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Fonts } from '../constants/Fonts'
import { TouchableOpacity } from 'react-native'
import { AppColors } from '../constants/Colors'

const HistoryCard = ({
    taskNo,
    navigation,
    customerName,
    storeName,
    date,
    time,
    paymentType,
    amount,
    kilometers,
    deliveryAddress,
    pickupAddress,
    routeCoordinates
}) => {

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Details", {
            "taskNo": taskNo,
            "navigation": navigation,
            "customerName": customerName,
            "storeName": storeName,
            "date": date,
            "time": time,
            "paymentType": paymentType,
            "amount": amount,
            "kilometers": kilometers,
            "deliveryAddress": deliveryAddress,
            "pickupAddress": pickupAddress,
            "routeCoordinates": routeCoordinates
        })} style={styles.orderContainer}>
            <View style={styles.orderTitleView}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={[styles.orderTitle, { textAlign: "right" }]}>Task No:</Text>
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 10
                }}>
                    <Text
                        style={[
                            styles.orderTitle,
                            { fontFamily: Fonts.OpenSansBold },
                        ]}>
                        {taskNo}
                    </Text>
                </View>
            </View>

            <View style={styles.orderTitleView}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={[styles.orderTitle, { textAlign: "right" }]}>Customer Name:</Text>
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 10
                }}>
                    <Text
                        style={[
                            styles.orderTitle,
                            { fontFamily: Fonts.OpenSansBold },
                        ]}>
                        {customerName}
                    </Text>
                </View>
            </View>

            <View style={styles.orderTitleView}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={[styles.orderTitle, { textAlign: "right" }]}>Store Name:</Text>
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 10
                }}>
                    <Text
                        style={[
                            styles.orderTitle,
                            { fontFamily: Fonts.OpenSansBold },
                        ]}>
                        {storeName}
                    </Text>
                </View>
            </View>

            <View style={styles.orderTitleView}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={[styles.orderTitle, { textAlign: "right" }]}>Date:</Text>
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 10
                }}>
                    <Text
                        style={[
                            styles.orderTitle,
                            { fontFamily: Fonts.OpenSansBold },
                        ]}>
                        {date}
                    </Text>
                </View>
            </View>
            <View style={styles.orderTitleView}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={[styles.orderTitle, { textAlign: "right" }]}>Time:</Text>
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 10
                }}>
                    <Text
                        style={[
                            styles.orderTitle,
                            { fontFamily: Fonts.OpenSansBold },
                        ]}>
                        {time}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
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
        // marginBottom: 10,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansSemiBold,
        // flex: 3,
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

export default HistoryCard