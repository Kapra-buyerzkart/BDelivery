import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Modal, Switch,
    Alert
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import Drawer from 'react-native-drawer';
import DrawerContent from '../components/DrawerContent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderComponent from '../components/LoaderComponent';
import EmptyComponent from '../components/EmptyComponent';
import OrderCard from '../components/OrderCard';
import { getAllOrders, fetchDeliveryAgentAcceptedOrders, fetchDeliveredOrders, modifyOrderStatus } from '../services/api/api';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAgentDetails } from '../redux/slices/agentSlice';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('PENDING');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agentId, setAgentId] = useState(null);
    const [isOnDuty, setIsOnDuty] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const drawerRef = useRef(null);
    const dispatch = useDispatch();
    const agent = useSelector((state) => state.agent);

    // Fetch agent ID once
    useEffect(() => {
        (async () => {
            const id = await AsyncStorage.getItem('agentId');
            setAgentId(id);
        })();
    }, []);

    // Fetch agent details from Redux
    useEffect(() => {
        dispatch(fetchAgentDetails());
    }, [dispatch]);

    // Fetch orders based on tab
    const fetchOrders = async () => {
        // console.log("agentId", agentId)
        if (!agentId) return;
        setLoading(true);
        try {
            let response;
            if (activeTab === 'PENDING') {
                response = await getAllOrders(agentId);
            } else if (activeTab === 'DELIVERING') {
                response = await fetchDeliveryAgentAcceptedOrders(agentId);
            } else if (activeTab === 'DELIVERED') {
                response = await fetchDeliveredOrders(agentId);
                console.log('response', response)
            }
            setOrders(response?.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchOrders();
    // }, [activeTab, agentId]);

    useFocusEffect(
        useCallback(() => {
            // This will run every time the screen comes into focus
            fetchOrders();
        }, [activeTab, agentId])
    );

    // Accept Order Handler
    const handleAcceptPress = (order) => {
        setSelectedOrder(order);
        setConfirmModalVisible(true);
    };

    const handleOkPress = async () => {
        try {
            setConfirmModalVisible(false);
            setLoading(true);
            const res = await modifyOrderStatus(
                selectedOrder.orderId,
                selectedOrder.agentId,
                "Delivery Agent Accepted"
            );
            console.log("acceptres", res)
            if (res.status === 200) {
                navigation.navigate("OrderDetails", { orderId: selectedOrder.orderId });
            } else {
                Alert.alert("Something went wrong")
            }
            // fetchOrders(); // refresh list
        } catch (error) {
            console.error("Error accepting order:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDutyStatus = async () => {
        try {
            const newStatus = !isOnDuty;
            setIsOnDuty(newStatus);
            await firestore()
                .collection('deliveryAgents')
                .doc(agent.agentId)
                .update({ onDuty: newStatus });
        } catch (error) {
            console.error('Failed to update duty status in Firestore:', error);
        }
    };

    const renderOrderCard = ({ item }) => {
        if (activeTab === 'PENDING') {
            console.log("ppppitem", item)
            return (
                <OrderCard
                    task_no={item.orderNumber}
                    navigation={navigation}
                    id={item.orderId}
                    status={item.status}
                    agentId={item.delAgentId}
                    pincode={item.shippingAddress?.pincode}
                    area={item.shippingAddress?.area}
                    onAccept={() => handleAcceptPress(item)}
                    type="PENDING"
                />
            );
        } else if (activeTab === 'DELIVERING') {
            console.log("DELIVERINGitem", item)
            return (
                <OrderCard
                    task_no={item.orderNumber}
                    navigation={navigation}
                    id={item.orderId}
                    status={item.status}
                    pincode={item.shippingAddress?.pincode}
                    area={item.shippingAddress?.areaName}
                    type="DELIVERING"
                />
            );
        } else {
            return (
                <OrderCard
                    task_no={item.orderNumber}
                    deliveredItems={item.deliveredItems || 0}
                    deliveredDate={item.assignedDate}
                    navigation={navigation}
                    id={item.orderId}
                    pincode={item.shippingAddress?.pincode}
                    area={item.shippingAddress?.areaName}
                    type="DELIVERED"
                />
            );
        }
    };

    if (loading) return <LoaderComponent />;

    return (
        <Drawer
            ref={drawerRef}
            type="overlay"
            content={<DrawerContent navigation={navigation} closeDrawer={() => drawerRef.current?.close()} />}
            tapToClose
            openDrawerOffset={0.3}
            styles={drawerStyles}
        >
            <SafeAreaView style={styles.container}>

                {/* Top Bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => drawerRef.current?.open()}>
                        <Entypo name="menu" size={33} color={AppColors.whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>ORDERS</Text>
                    <View style={styles.switchView}>
                        <Text style={[styles.switchText, isOnDuty ? { color: AppColors.green } : { color: AppColors.red }]}>ON DUTY</Text>
                        <Switch
                            trackColor={{ false: AppColors.lightRed, true: AppColors.lightGreen }}
                            thumbColor={isOnDuty ? AppColors.green : AppColors.red}
                            onValueChange={toggleDutyStatus}
                            value={isOnDuty}
                        />
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    {['PENDING', 'DELIVERING', 'DELIVERED'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                            onPress={() => {
                                setOrders([]);
                                setActiveTab(tab)
                            }}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Orders List */}
                <FlatList
                    data={orders}
                    keyExtractor={(item) => `${activeTab}-${item.orderId}`}
                    renderItem={renderOrderCard}
                    ListEmptyComponent={<EmptyComponent text="NO ORDERS FOUND" />}
                    onRefresh={fetchOrders}
                    refreshing={loading}
                />

                {/* Confirm Accept Modal */}
                <Modal
                    transparent
                    visible={confirmModalVisible}
                    animationType="fade"
                    onRequestClose={() => setConfirmModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>
                                Do you want to accept order{" "}
                                <Text style={styles.orderNoText}>{selectedOrder?.orderNumber}?</Text>
                            </Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: AppColors.green }]} onPress={handleOkPress}>
                                    <Text style={styles.okButtonText}>OK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: AppColors.red }]} onPress={() => setConfirmModalVisible(false)}>
                                    <Text style={styles.okButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        </Drawer>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppColors.appBackgroundColor },
    topBar: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', backgroundColor: AppColors.primaryColor,
        paddingHorizontal: 10, height: 55
    },
    headerText: { color: AppColors.whiteColor, fontFamily: Fonts.OpenSansBold, fontSize: 16 },
    switchView: { alignItems: 'center', opacity: 0 },
    switchText: { fontSize: 10, fontFamily: Fonts.OpenSansBold },
    tabContainer: {
        flexDirection: 'row', justifyContent: 'space-around',
        backgroundColor: AppColors.whiteColor, paddingVertical: 8, elevation: 3
    },
    tabButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
    activeTab: { backgroundColor: AppColors.primaryColor },
    tabText: { color: AppColors.black, fontFamily: Fonts.OpenSansSemiBold, fontSize: 13 },
    activeTabText: { color: AppColors.whiteColor },
    modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '85%', backgroundColor: AppColors.whiteColor, padding: 20, borderRadius: 10 },
    modalText: { textAlign: 'center', fontFamily: Fonts.OpenSansRegular, color: AppColors.black },
    orderNoText: { fontFamily: Fonts.OpenSansBold, color: AppColors.black },
    modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    modalButton: { flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    okButtonText: { color: AppColors.whiteColor, fontFamily: Fonts.OpenSansBold }
});

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
};

export default HomeScreen;
