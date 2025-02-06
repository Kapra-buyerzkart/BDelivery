import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { AppColors } from '../constants/Colors';

const LoaderComponent = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color={AppColors.primaryColor} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.appBackgroundColor,
    },
});

export default LoaderComponent;
