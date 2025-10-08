import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, FlatList, Switch, Platform, Modal } from 'react-native';
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
import { fetchAgentDetails } from '../redux/slices/agentSlice';
import { fetchStoreDetails } from '../redux/slices/storeSlice';
import { fetchHolidays } from '../redux/slices/holidaysSlice';
import { fetchIncentives } from '../redux/slices/incentivesSlice';
import { assignedOrders } from '../services/api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route, navigation }) => {

    const [loading, setLoading] = useState(false)
    const [agentId, setAgentId] = useState(null)
    const [isOnDuty, setIsOnDuty] = useState(false); // State for the switch
    const [orders, setOrders] = useState([]);
    const [orderAlreadyAccepted, setOrderAlreadyAccepted] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [orderNo, setOrderNo] = useState(null);

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

    const handleOrderAccepted = (value, orderNo) => {
        setOrderAlreadyAccepted(value)
        setModalVisible(value)
        setOrderNo(orderNo)
    }
    // console.log('ppppp', Platform.Version)

    const agent = useSelector((state) => state.agent);
    const holidays = useSelector((state) => state.holidays)

    // console.log("agggg", agent)

    // useEffect(() => {
    //     const fetchAgentId = async () => {
    //         const id = await AsyncStorage.getItem('id');
    //         setAgentId(id);
    //     };
    //     fetchAgentId();
    // }, []);


    useEffect(() => {
        const fetchAssignedOrders = async () => {
            try {
                // Get agentId from AsyncStorage (if stored)
                const agentId = await AsyncStorage.getItem("agentId");
                if (!agentId) {
                    console.warn("No agent ID found in storage");
                    setLoading(false);
                    return;

                }

                const response = await assignedOrders(agentId);
                const filteredOrders = response.data.filter(
                    (order) => order.status !== "Order Delivered"
                );
                console.log("Assigned Orders:", response.data);
                setOrders(filteredOrders);
            } catch (error) {
                console.error("Error fetching assigned orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedOrders();
    }, []);

    useEffect(() => {
        console.log('Agent from Redux:', agent);
    }, [agent]);

    // useEffect(() => {
    //     setLoading(true);
    //     console.log("agent.storeId", agent?.storeId)
    //     const unsubscribe = firestore()
    //         .collection('tasks')
    //         .where('deliveryCompleted', '==', false)
    //         .onSnapshot(snapshot => {
    //             const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //             // Filter orders by storeId matching agent's storeId
    //             const filteredOrders = agent?.storeId
    //                 ? fetchedOrders.filter(order => order.storeId === agent.storeId)
    //                 : [];
    //             console.log('filteredOrders', filteredOrders)
    //             setOrders(filteredOrders.reverse());
    //             setLoading(false);
    //         }, error => {
    //             console.error("Error fetching orders:", error);
    //             setLoading(false);
    //         });

    //     return () => unsubscribe();
    // }, [agent?.storeId]);


    useEffect(() => {
        const loadDutyStatus = async () => {
            // if (!agentId) return;
            console.log('agentIduf', agentId)

            try {
                const doc = await firestore()
                    .collection('deliveryAgents')
                    .doc(agent.agentId)
                    .get();

                if (doc.exists) {
                    const data = doc.data();
                    if (data?.onDuty !== undefined) {
                        setIsOnDuty(data.onDuty);
                    }
                } else {
                    console.warn('No such document found for agentId:', agent.agentId);
                }
            } catch (error) {
                console.error('Failed to load duty status from Firestore:', error);
            }
        };

        loadDutyStatus();
    }, [agent.agentId]);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAgentDetails()); // Replace with real ID
        dispatch(fetchStoreDetails());
        dispatch(fetchHolidays());
        dispatch(fetchIncentives());
    }, [dispatch]);

    const toggleDutyStatus = async () => {
        console.log("ggg", agent.agentId)
        try {
            const newStatus = !isOnDuty;
            setIsOnDuty(newStatus);

            // Update Firestore
            await firestore()
                .collection('deliveryAgents')
                .doc(agent.agentId)
                .update({
                    onDuty: newStatus,
                });

            console.log('Duty status updated in Firestore:', newStatus);
        } catch (error) {
            console.error('Failed to update duty status in Firestore:', error);
        }
    };

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
            <SafeAreaView style={styles.container}>
                {/* {console.log("loading", loading)}
                {console.log("holidays", holidays)} */}
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Order <Text style={styles.orderNoText}>{orderNo} </Text>already taken</Text>
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.topView}>
                    <TouchableOpacity onPress={openDrawer}>
                        <Entypo name="menu" size={33} color={AppColors.whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.ordersText}>ORDERS</Text>
                    <View style={styles.switchView}>
                        <Text style={[styles.switchText, isOnDuty ?
                            { color: AppColors.green } :
                            { color: AppColors.red }
                        ]}>ON DUTY</Text>
                        <Switch
                            // trackColor={{ false: '#767577', true: '#81b0ff' }}
                            // thumbColor={isOnDuty ? '#f5dd4b' : '#f4f3f4'}
                            trackColor={{ false: AppColors.lightRed, true: AppColors.lightGreen }}
                            thumbColor={isOnDuty ? AppColors.green : AppColors.red}
                            onValueChange={toggleDutyStatus}
                            value={isOnDuty}
                        />
                    </View>
                </View>
                {loading ? (
                    <LoaderComponent />
                ) : (
                    <>
                        {/* {isOnDuty ? (
                            <FlatList
                                data={orders}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <OrderCard
                                        task_no={item.taskNo}
                                        // onDecline={() => onDecline(item.id)}
                                        navigation={navigation}
                                        id={item.id}
                                        handleOrderAccepted={handleOrderAccepted}
                                    />
                                )}
                                ListEmptyComponent={<EmptyComponent text='NO ORDERS' />}
                            />

                        ) : (
                            <View style={styles.noDutyView}>
                                <Text style={styles.noDutyText}>You are not on duty right now.</Text>
                            </View>
                        )} */}
                        {/* {isOnDuty ? ( */}
                        <FlatList
                            data={orders}
                            keyExtractor={(item) => item.orderId}
                            renderItem={({ item }) => (
                                <OrderCard
                                    task_no={item.orderNumber}
                                    // onDecline={() => onDecline(item.id)}
                                    navigation={navigation}
                                    id={item.orderId}
                                    handleOrderAccepted={handleOrderAccepted}
                                    status={item.status}
                                    agentId={item.delAgentId}
                                />
                            )}
                            ListEmptyComponent={<EmptyComponent text='NO ORDERS' />}
                        />

                        {/* ) : (
                            <View style={styles.noDutyView}>
                                <Text style={styles.noDutyText}>You are not on duty right now.</Text>
                            </View>
                        )} */}
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
        color: AppColors.red,
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
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20
    },
    modalContent: {
        backgroundColor: AppColors.whiteColor,
        padding: 25,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: Fonts.OpenSansRegular,
        color: AppColors.black
    },
    okButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: AppColors.red,
        borderRadius: 8
    },
    okButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Fonts.OpenSansBold
    },
    orderNoText: {
        fontFamily: Fonts.OpenSansBold,
        color: AppColors.black,
        fontSize: 17
    }
});

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    // main: { paddingLeft: 3 },
};

export default HomeScreen;
