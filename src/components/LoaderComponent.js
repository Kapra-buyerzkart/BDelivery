import React from 'react';
import {
    View,
    SafeAreaView,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { AppColors } from '../constants/Colors';

const LoaderComponent = ({ small = false }) => {
    if (small) {
        return (
            <View style={styles.smallContainer}>
                <ActivityIndicator size="small" color={AppColors.primaryColor} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.fullContainer}>
            <ActivityIndicator size="large" color={AppColors.primaryColor} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.appBackgroundColor,
    },
    smallContainer: {
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoaderComponent;
