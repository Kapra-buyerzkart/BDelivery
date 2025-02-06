import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

const EmptyComponent = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.appBackgroundColor,
    },
    text: {
        fontSize: 15,
        color: AppColors.black,
        // fontWeight: 'bold',
        marginTop: 10,
        fontFamily: Fonts.OpenSansBold,
    },
});

export default EmptyComponent;
