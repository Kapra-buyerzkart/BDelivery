import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, FlatList, Switch, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Container';
import { AppColors } from '../constants/Colors';
import Drawer from 'react-native-drawer';
import DrawerContent from '../components/DrawerContent';
import { TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Fonts } from '../constants/Fonts';
import OrderCard from '../components/OrderCard';
import EmptyComponent from '../components/EmptyComponent';
import firestore from '@react-native-firebase/firestore';
import { USE_DEV_FIREBASE } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderComponent from '../components/LoaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../redux/actions/taskAction';

const HomeScreen = ({ route, navigation }) => {

    const [loading, setLoading] = useState(false)

    const [isOnDuty, setIsOnDuty] = useState(false); // State for the switch

    const [orders, setOrders] = useState([]);

    // const dispatch = useDispatch();
    // const taskState = useSelector(state => state.taskState)
    // const orders = useSelector(state => state.taskState.tasks);

    // const onDecline = (id) => {
    //     setOrders(orders.filter((order) => order.id !== id));
    // }

    const drawerRef = useRef(null);

    const openDrawer = () => {
        if (drawerRef.current) {
            drawerRef.current.open();
        }
    };

    const closeDrawer = () => {
        if (drawerRef.current) {
            drawerRef.current.close();
        }
    };

    const toggleDutyStatus = async () => {
        try {
            const newStatus = !isOnDuty;
            setIsOnDuty(newStatus);
            await AsyncStorage.setItem('isOnDuty', JSON.stringify(newStatus));
        } catch (error) {
            console.error('Failed to save duty status to AsyncStorage:', error);
        }
    };
    // console.log('ppppp', Platform.Version)

    useEffect(() => {
        setLoading(true)
        const unsubscribe = firestore()
            .collection('tasks')
            .where('deliveryCompleted', '==', false)
            .onSnapshot(snapshot => {
                const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(newOrders.reverse()); // Update your state
                // dispatch(setTasks(newOrders.reverse()));
                setLoading(false)
            }, error => {
                console.error("Error fetching orders:", error);
                setLoading(false); // Also stop loading on error
            });

        return () => unsubscribe(); // Clean up
    }, []);

    useEffect(() => {
        const loadDutyStatus = async () => {
            try {
                const value = await AsyncStorage.getItem('isOnDuty');
                if (value !== null) {
                    setIsOnDuty(JSON.parse(value));
                }
            } catch (error) {
                console.error('Failed to load duty status from AsyncStorage:', error);
            }
        };

        loadDutyStatus();
    }, []);


    return (
        <Drawer
            ref={drawerRef}
            type="overlay"
            content={<DrawerContent navigation={navigation} closeDrawer={closeDrawer} />}
            tapToClose={true}
            openDrawerOffset={0.3} // 20% gap on the right
            // panCloseMask={0.2}
            // closedDrawerOffset={-3}
            styles={drawerStyles}
        // tweenHandler={ratio => ({
        //   main: { opacity: (2 - ratio) / 2 },
        // })}
        >
            {/* {console.log("taskState", taskState)} */}
            <SafeAreaView style={styles.container}>
                <View style={styles.topView}>
                    <TouchableOpacity onPress={openDrawer}>
                        <Entypo name="menu" size={33} color={AppColors.whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.ordersText}>ORDERS</Text>
                    <View style={styles.switchView}>
                        <Text style={styles.switchText}>ON DUTY</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={isOnDuty ? '#f5dd4b' : '#f4f3f4'}
                            onValueChange={toggleDutyStatus}
                            value={isOnDuty}
                        />
                    </View>
                </View>
                {loading ? (
                    <LoaderComponent />
                ) : (
                    <>
                        {isOnDuty ? (
                            <FlatList
                                data={orders}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <OrderCard
                                        task_no={item.taskNo}
                                        // onDecline={() => onDecline(item.id)}
                                        navigation={navigation}
                                        id={item.id}
                                    />
                                )}
                                ListEmptyComponent={<EmptyComponent text='NO ORDERS' />}
                            />

                        ) : (
                            <View style={styles.noDutyView}>
                                <Text style={styles.noDutyText}>You are not on duty right now.</Text>
                            </View>
                        )}
                    </>
                )}
            </SafeAreaView>
        </Drawer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.appBackgroundColor,
    },
    switchView: {
        justifyContent: "center",
        alignItems: "center",
    },
    // switchSubView: {
    //   flex: 1,
    //   alignItems: 'center',
    //   paddingVertical: 7,
    //   marginVertical: 3,
    //   marginHorizontal: 3,
    // },
    switchText: {
        fontSize: 10,
        color: AppColors.orange,
        fontFamily: Fonts.OpenSansExtraBold
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.primaryColor,
        // paddingVertical: 6,
        justifyContent: "space-between",
        paddingHorizontal: 7,
        height: 50
    },
    hideStyle: {
        height: 0
    },
    ordersText: {
        color: AppColors.whiteColor,
        fontFamily: Fonts.OpenSansBold,
        fontSize: 14
    },
    noDutyView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    noDutyText: {
        fontSize: 15,
        fontFamily: Fonts.OpenSansSemiBold,
        color: AppColors.black
    }
});

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    // main: { paddingLeft: 3 },
};

export default HomeScreen;
