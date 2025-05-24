import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const EarningsScreen = ({ navigation }) => {
    const [selectedRange, setSelectedRange] = useState({});
    const [agentId, setAgentId] = useState(null);
    const [earnings, setEarnings] = useState({ distance: 0, tasks: 0, amount: 0 });

    useEffect(() => {
        const fetchAgentId = async () => {
            const id = await AsyncStorage.getItem('id');
            setAgentId(id);
        };
        fetchAgentId();
    }, []);

    useEffect(() => {
        if (agentId && selectedRange.startDate && selectedRange.endDate) {
            fetchEarnings();
        }
    }, [selectedRange, agentId]);

    const fetchEarnings = async () => {
        try {
            const doc = await firestore().collection('deliveryAgents').doc(agentId).get();
            const data = doc.data();
            if (!data?.completedOrders) return;

            const tasks = data.completedOrders.filter(task => {
                const taskDate = moment(task.date, 'DD MMM YYYY');
                return taskDate.isBetween(
                    moment(selectedRange.startDate),
                    moment(selectedRange.endDate),
                    undefined,
                    '[]'
                );
            });

            const totalDistance = tasks.reduce((sum, task) => sum + parseFloat(task.kilometers), 0);
            const totalAmount = tasks.reduce((sum, task) => sum + parseFloat(task.amount.replace(/[^0-9.-]+/g, '')), 0);

            setEarnings({ distance: totalDistance, tasks: tasks.length, amount: totalAmount });
        } catch (err) {
            console.error(err);
        }
    };

    const onDayPress = (day) => {
        if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
            setSelectedRange({ startDate: day.dateString });
        } else {
            const endDate = day.dateString;
            const startDate = selectedRange.startDate;
            if (moment(endDate).isBefore(startDate)) {
                setSelectedRange({ startDate: endDate });
            } else {
                setSelectedRange({ startDate, endDate });
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.ordersText}>EARNINGS</Text>
                <View style={styles.hideStyle} />
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Calendar
                    onDayPress={onDayPress}
                    markedDates={{
                        ...(selectedRange.startDate && {
                            [selectedRange.startDate]: { startingDay: true, color: AppColors.primaryColor, textColor: 'white' },
                        }),
                        ...(selectedRange.endDate && {
                            [selectedRange.endDate]: { endingDay: true, color: AppColors.primaryColor, textColor: 'white' },
                        }),
                        ...(selectedRange.startDate && selectedRange.endDate && getRangeDates(selectedRange.startDate, selectedRange.endDate).reduce((acc, date) => {
                            acc[date] = { color: '#d0e8ff', textColor: 'black' };
                            return acc;
                        }, {})),
                    }}
                    markingType={'period'}
                />

                <View style={styles.earningsContainer}>
                    <Text style={styles.label}>Total Distance Covered: <Text style={styles.value}>{earnings.distance.toFixed(2)} km</Text></Text>
                    <Text style={styles.label}>Total Tasks Completed: <Text style={styles.value}>{earnings.tasks}</Text></Text>
                    <Text style={styles.label}>Total Earnings: <Text style={styles.value}>₹{earnings.amount.toFixed(2)}</Text></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const getRangeDates = (start, end) => {
    const range = [];
    let current = moment(start);
    const endDate = moment(end);
    while (current.isBefore(endDate, 'day')) {
        current = current.add(1, 'day');
        range.push(current.format('YYYY-MM-DD'));
    }
    return range;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.appBackgroundColor,
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.primaryColor,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 50,
    },
    ordersText: {
        color: AppColors.whiteColor,
        fontFamily: Fonts.OpenSansBold,
        fontSize: 14,
    },
    hideStyle: {
        width: 24, // Placeholder size of icon for layout alignment
    },
    contentContainer: {
        padding: 16,
    },
    earningsContainer: {
        marginTop: 20,
        backgroundColor: AppColors.whiteColor,
        padding: 16,
        borderRadius: 8,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontFamily: Fonts.OpenSansSemiBold,
        color: AppColors.black,
        marginBottom: 10,
    },
    value: {
        fontFamily: Fonts.OpenSansBold,
        color: AppColors.primaryColor,
    },
});

export default EarningsScreen;
