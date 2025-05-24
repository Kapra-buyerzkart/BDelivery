import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Container';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddressCard from '../components/AddressCard';
import firestore from '@react-native-firebase/firestore';
import LoaderComponent from '../components/LoaderComponent';

const TaskScreen = ({ navigation }) => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pickupCompleted, setPickupCompleted] = useState(false);
    const route = useRoute();
    const { taskNo, taskId } = route.params;

    const fetchTaskById = async (taskId) => {
        try {
            const taskDoc = await firestore().collection('tasks').doc(taskId).get();

            if (taskDoc.exists) {
                return { id: taskDoc.id, ...taskDoc.data() };
            } else {
                // console.log('No such task!');
                return null;
            }
        } catch (error) {
            console.error('Error fetching task:', error);
            return null;
        }
        // finally {
        //     setLoading(false)
        // }
    };

    useFocusEffect(
        useCallback(() => {
            const loadTask = async () => {
                const data = await fetchTaskById(taskId);
                setTask(data);
                setPickupCompleted(data.pickupCompleted);
                setLoading(false); // Move this here
            };
            loadTask();
        }, [taskId])
    )

    // if (loading) {
    //     <LoaderComponent />
    // }

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <LoaderComponent />
            ) : task ? (
                <>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color={AppColors.whiteColor} />
                    </TouchableOpacity>

                    <View style={styles.orderNoView}>
                        <Text style={styles.orderNoKey}>Task Number:</Text>
                        <Text style={styles.orderNoValue}>{taskNo}</Text>
                    </View>

                    {!pickupCompleted && (
                        <AddressCard
                            name={task.microStoreName}
                            addressHeading='Pickup Address'
                            navigation={navigation}
                            address={task.pickupAddress}
                            type={task.type}
                            amount={task.amount}
                            taskId={taskId}
                            task={task}
                            taskNo={taskNo}
                        />
                    )}

                    <AddressCard
                        name={task.customerName}
                        addressHeading='Delivery Address'
                        navigation={navigation}
                        address={task.deliveryAddress}
                        type={task.type}
                        // {...(task.type === "COD" ? { amount: task.amount } : {})}
                        amount={task.amount}
                        taskId={taskId}
                        task={task}
                        taskNo={taskNo}
                    />
                </>
            ) : (
                <Text style={{ color: 'red', fontSize: 16 }}>Task not found.</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.appBackgroundColor,
        justifyContent: "center",
        alignItems: "center"
    },
    topView: {
        flexDirection: 'row',
        marginHorizontal: 12,
        marginTop: 15,
        marginBottom: 10
    },
    backButton: {
        backgroundColor: AppColors.primaryColor,
        padding: 5,
        borderRadius: 7,
        position: 'absolute',
        top: 20,
        left: 20
    },
    orderNoView: {
        flexDirection: 'row',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },
    orderNoKey: {
        fontSize: 15,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansSemiBold,
    },
    orderNoValue: {
        fontSize: 16,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansBold,
        marginLeft: 5,
    },
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

export default TaskScreen;
