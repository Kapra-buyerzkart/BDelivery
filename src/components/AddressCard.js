import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { StyleSheet } from 'react-native';


const AddressCard = (props) => {

    const onAccept = () => {
        props.navigation.navigate("Map")
    }

    return (
        <View style={styles.card}>
            <View style={{
            }}>
                <Text style={styles.cardHeading}>{props.addressHeading}</Text>
                <Text style={styles.addressText}>{props.name}</Text>
                <Text style={styles.addressText}>{props.addressLineOne}</Text>
                <Text style={styles.addressText}>{props.addressLineTwo}</Text>
                <Text style={styles.addressText}>{props.addressLineThree}</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: "space-evenly",
                marginTop: 10
            }}>
                <TouchableOpacity onPress={onAccept} style={{
                    padding: 10,
                    backgroundColor: AppColors.green,
                    borderRadius: 5,
                    width: '36%',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        color: AppColors.whiteColor,
                        // fontWeight: 'bold',
                        fontSize: 13,
                        fontFamily: Fonts.OpenSansBold,

                    }}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    padding: 10,
                    backgroundColor: AppColors.red,
                    borderRadius: 5,
                    width: '36%',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        color: AppColors.whiteColor,
                        // fontWeight: 'bold',
                        fontSize: 13,
                        fontFamily: Fonts.OpenSansBold,

                    }}>Decline</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        marginVertical: 10
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


export default AddressCard