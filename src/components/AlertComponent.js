import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';


const AlertComponent = ({ visible, title, message, okClick, showTitle }) => {
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.completionModalContainer}>
                <View style={styles.completionModalContent}>
                    {showTitle && <Text style={styles.title}>{title}</Text>}
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={okClick}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    completionModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    completionModalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: AppColors.whiteColor,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        // fontWeight: 'bold',
        marginBottom: 20,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansBold,
    },
    message: {
        fontSize: 15,
        marginBottom: 20,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansRegular,
    },
    button: {
        padding: 10,
        backgroundColor: AppColors.orange,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: AppColors.whiteColor,
        // fontWeight: 'bold',
        fontSize: 13,
        fontFamily: Fonts.OpenSansBold,
    },
});

export default AlertComponent;
