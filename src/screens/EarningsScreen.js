import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { useSelector } from 'react-redux';

const EarningsScreen = ({ navigation }) => {
    const [selectedWeek, setSelectedWeek] = useState(() => {
        const today = moment();
        const startOfWeek = today.clone().startOf('isoWeek'); // Monday
        const endOfWeek = today.clone().endOf('isoWeek');     // Sunday
        return {
            startDate: startOfWeek.format('YYYY-MM-DD'),
            endDate: endOfWeek.format('YYYY-MM-DD'),
        };
    });
    const [earnings, setEarnings] = useState({
        distance: 0,
        tasks: 0,
        petrol: 0,
        target: 0,
        attendance: 0,
        specialAttendance: 0,
        overtime: 0,
    });
    const [todayEarnings, setTodayEarnings] = useState({
        distance: 0,
        petrol: 0,
        overtime: 0,
        tasks: 0,
    });

    const agent = useSelector((state) => state.agent);
    const holidays = useSelector((state) => state.holidays.data);
    const incentives = useSelector((state) => state.incentives.data);
    const todayDate = moment().format('DD-MM-YYYY');

    useEffect(() => {
        if (agent.agentId && selectedWeek.startDate && selectedWeek.endDate) {
            fetchEarnings(selectedWeek.startDate, selectedWeek.endDate);
            fetchTodayEarnings();
        }
    }, [selectedWeek, agent.agentId]);

    // const getTargetIncentive = (count) => {
    //     if (count >= 150) return 6000;
    //     if (count >= 110) return 3850;
    //     if (count >= 75) return 2400;
    //     if (count >= 60) return 1800;
    //     if (count >= 50) return 1400;
    //     if (count >= 35) return 700;
    //     if (count >= 25) return 300;
    //     return 0;
    // };

    const getTargetIncentive = (count) => {
        if (!incentives?.weeklyTargetIncentives) return 0;

        // Convert keys to numbers and sort ascending
        const thresholds = Object.keys(incentives.weeklyTargetIncentives)
            .map(Number)
            .sort((a, b) => a - b);

        let incentive = 0;
        thresholds.forEach((threshold) => {
            if (count >= threshold) {
                incentive = incentives.weeklyTargetIncentives[threshold];
            }
        });

        return incentive;
    };

    const fetchEarnings = async (startDate, endDate) => {
        try {
            const doc = await firestore().collection('deliveryAgents').doc(agent.agentId).get();
            const data = doc.data();
            if (!data?.completedOrders) return;

            let tasks = data.completedOrders.filter(task => {
                const taskDate = moment(task.deliveryAddress.date, 'DD MMM YYYY');
                return taskDate.isBetween(moment(startDate), moment(endDate), undefined, '[]');
            });

            const totalDistance = tasks.reduce((sum, task) => sum + parseFloat(task.kilometers || 0), 0);
            const totalPetrol = totalDistance * incentives.petrolAllowance;
            const totalTarget = getTargetIncentive(tasks.length);

            // Attendance Incentives
            const attendanceDates = (agent.attendance || []).map(t => moment(t.date, 'DD-MM-YYYY'));
            const filteredDates = attendanceDates.filter(date =>
                date.isBetween(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD'), undefined, '[]')
            );
            // console.log("filteredDates", filteredDates)
            const saturdays = new Set(filteredDates.filter(date => date.format('dddd') === 'Saturday').map(d => d.format('DD-MM-YYYY')));
            const sundays = new Set(filteredDates.filter(date => date.format('dddd') === 'Sunday').map(d => d.format('DD-MM-YYYY')));
            // console.log("incentives.attendanceIncentives.Saturday", incentives.attendanceIncentives.Saturday)
            const attendanceIncentive = (saturdays.size * incentives.attendanceIncentives.Saturday) + (sundays.size * incentives.attendanceIncentives.Sunday);
            // console.log("saturdays", saturdays.size)
            // const attendanceIncentive = (saturdays.size * 100) + (sundays.size * 100);

            // const fullTimeSalary = 10000;
            // const partTimeSalary = 7000;
            // const dailySalary = agent.type === 'FULL TIME' ? fullTimeSalary / 30 : partTimeSalary / 30;

            // const specialAttendanceIncentive = filteredDates
            //     .filter(date => holidays.includes(date.format('DD-MM-YYYY')))
            //     .reduce((sum) => {
            //         return sum + (dailySalary * 2 + 150);
            //     }, 0);
            // const isFullTime = agent.type === 'FULL TIME';
            // const monthlySalary = isFullTime ? 10000 : 7000;

            // // Use any date in the selected week to determine the correct month
            // const anyDate = filteredDates.length > 0 ? filteredDates[0] : moment();
            // const totalDaysInMonth = moment(anyDate).daysInMonth();

            // const dailySalary = monthlySalary / totalDaysInMonth;

            // // Now calculate the special attendance incentive
            // const specialAttendanceIncentive = filteredDates
            //     .filter(date => holidays.includes(date.format('DD-MM-YYYY')))
            //     .reduce((sum) => {
            //         return sum + (dailySalary * 2 + 150);
            //     }, 0);
            const isFullTime = agent.type === 'FULL TIME';
            // const monthlySalary = isFullTime ? 10000 : 7000;
            const monthlySalary = Number(incentives?.monthlySalary?.[agent.type?.toUpperCase()?.includes('FULL') ? 'Full Time' : 'Part Time'] || 0)
            // console.log('holidays', holidays)
            // console.log('filteredDates', filteredDates)
            const holidayDates = holidays.map(h => h.date); // ["2025-08-15", "2025-10-02"]

            const specialAttendanceIncentive = filteredDates
                .filter(date => holidayDates.includes(date.format('YYYY-MM-DD')))
                .reduce((sum, date) => {
                    const daysInMonth = moment(date).daysInMonth();
                    const dailySalary = monthlySalary / daysInMonth;

                    return sum + (dailySalary * 2 + 150);
                }, 0);

            const calculateOvertime = (attendance) => {
                // const required = agent.type === 'FULL TIME' ? 9 : 6;
                const required = Number(
                    incentives?.compulsoryLoginHours?.[agent.type?.toUpperCase()?.includes('FULL') ? 'Full Time' : 'Part Time'] || 0
                );
                // const rate = agent.type === 'FULL TIME' ? 40 : 30;
                const rate = Number(
                    incentives?.overtimeBonus?.[agent.type?.toUpperCase()?.includes('FULL') ? 'Per Hour (Full Time)' : 'Per Hour (Part Time)'] || 0
                );

                return attendance.reduce((sum, entry) => {
                    if (!entry.date || !entry.punchIn?.time || !entry.punchOut?.time) return sum;
                    const format = 'DD-MM-YYYY hh:mm:ss A';
                    const inTime = moment(`${entry.date} ${entry.punchIn.time}`, format);
                    const outTime = moment(`${entry.date} ${entry.punchOut.time}`, format);
                    if (!inTime.isValid() || !outTime.isValid()) return sum;
                    const workedHours = moment.duration(outTime.diff(inTime)).asHours();
                    const extra = Math.max(0, workedHours - required);
                    return sum + (extra * rate);
                }, 0);
            };

            const filteredAttendance = (agent.attendance || []).filter(entry =>
                moment(entry.date, 'DD-MM-YYYY').isBetween(moment(startDate), moment(endDate), undefined, '[]')
            );

            const totalOvertime = calculateOvertime(filteredAttendance);

            setEarnings({
                distance: totalDistance,
                tasks: tasks.length,
                petrol: totalPetrol,
                target: totalTarget,
                attendance: attendanceIncentive,
                specialAttendance: specialAttendanceIncentive,
                overtime: totalOvertime
            });

        } catch (err) {
            console.error(err);
        }
    };

    const fetchTodayEarnings = async () => {
        try {
            const doc = await firestore().collection('deliveryAgents').doc(agent.agentId).get();
            const data = doc.data();
            if (!data?.completedOrders) return;

            const todayTasks = data.completedOrders.filter(task => {
                // console.log('task.deliveryAddress.date', task.deliveryAddress.date)
                // console.log('moment().format', moment().format('DD MMM YYYY'))
                return task.deliveryAddress.date === moment().format('DD MMM YYYY')
            }
            );

            // console.log('todayTasks', todayTasks)

            const distance = todayTasks.reduce((sum, task) => sum + parseFloat(task.kilometers || 0), 0);
            const petrol = distance * incentives.petrolAllowance;

            const todayAttendance = (agent.attendance || []).find(att => att.date === todayDate);
            let overtime = 0;

            if (todayAttendance?.punchIn?.time && todayAttendance?.punchOut?.time) {
                const format = 'DD-MM-YYYY hh:mm:ss A';
                const inTime = moment(`${todayDate} ${todayAttendance.punchIn.time}`, format);
                const outTime = moment(`${todayDate} ${todayAttendance.punchOut.time}`, format);
                const workedHours = moment.duration(outTime.diff(inTime)).asHours();
                const required = agent.type === 'FULL TIME' ? 9 : 6;
                const rate = agent.type === 'FULL TIME' ? 40 : 30;
                overtime = Math.max(0, workedHours - required) * rate;
            }

            setTodayEarnings({
                distance,
                petrol,
                overtime,
                tasks: todayTasks.length
            });
        } catch (err) {
            console.error(err);
        }
    };

    const onDayPress = (day) => {
        const selectedDate = moment(day.dateString);
        const startOfWeek = selectedDate.clone().startOf('isoWeek');
        const endOfWeek = selectedDate.clone().endOf('isoWeek');
        setSelectedWeek({
            startDate: startOfWeek.format('YYYY-MM-DD'),
            endDate: endOfWeek.format('YYYY-MM-DD')
        });
    };

    const getWeekMarkedDates = (start, end) => {
        const range = {};
        let current = moment(start);
        while (current.isSameOrBefore(end)) {
            range[current.format('YYYY-MM-DD')] = {
                color: AppColors.primaryColor,
                textColor: 'white'
            };
            current.add(1, 'day');
        }
        return range;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* {console.log('incentives', incentives)} */}
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
                    markedDates={getWeekMarkedDates(selectedWeek.startDate, selectedWeek.endDate)}
                    markingType={'period'}
                />

                {/* Today's Earnings */}
                <View style={styles.earningsContainer}>
                    <Text style={styles.earningsTextTwo}>Today's Earnings ({todayDate})</Text>
                    <Text style={styles.label}>Tasks: <Text style={styles.value}>{todayEarnings.tasks}</Text></Text>
                    <Text style={styles.label}>Distance: <Text style={styles.value}>{todayEarnings.distance.toFixed(2)} km</Text></Text>
                    <Text style={styles.label}>Petrol Allowance: <Text style={styles.value}>₹{todayEarnings.petrol.toFixed(2)}</Text></Text>
                    {/* <Text style={styles.label}>Overtime: <Text style={styles.value}>₹{todayEarnings.overtime.toFixed(2)}</Text></Text> */}
                </View>

                {/* Weekly Earnings */}
                <View style={styles.earningsContainer}>
                    <Text style={styles.earningsTextTwo}>
                        Weekly Earnings ({moment(selectedWeek.startDate).format('DD-MM-YYYY')} → {moment(selectedWeek.endDate).format('DD-MM-YYYY')})
                    </Text>
                    <Text style={styles.label}>Total Tasks: <Text style={styles.value}>{earnings.tasks}</Text></Text>
                    <Text style={styles.label}>Total Distance: <Text style={styles.value}>{earnings.distance.toFixed(2)} km</Text></Text>
                    <Text style={styles.label}>Petrol Allowance: <Text style={styles.value}>₹{earnings.petrol.toFixed(2)}</Text></Text>
                    <Text style={styles.label}>Target Incentives: <Text style={styles.value}>₹{earnings.target.toFixed(2)}</Text></Text>
                    <Text style={styles.label}>Attendance Incentives: <Text style={styles.value}>₹{earnings.attendance.toFixed(2)}</Text></Text>
                    <Text style={styles.label}>Special Holiday Incentives: <Text style={styles.value}>₹{earnings.specialAttendance.toFixed(2)}</Text></Text>
                    <Text style={styles.label}>Overtime Bonus: <Text style={styles.value}>₹{earnings.overtime.toFixed(2)}</Text></Text>
                </View>

                <View style={styles.earningsContainer}>
                    <Text style={styles.earningsTextTwo}>Refer, Join and Earn</Text>
                    <Text style={styles.label}>Referral Bonus: <Text style={styles.value}>{incentives.referJoinEarn.joiningBonus}</Text></Text>
                    <Text style={styles.label}>Joining Bonus: <Text style={styles.value}>{incentives.referJoinEarn.referralBonus}</Text></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
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
        width: 24,
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
    earningsTextTwo: {
        fontSize: 14,
        fontFamily: Fonts.OpenSansSemiBold,
        color: AppColors.black,
        marginBottom: 10,
    },
});

export default EarningsScreen;
