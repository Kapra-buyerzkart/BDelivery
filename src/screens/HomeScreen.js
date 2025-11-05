import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Switch,
    Alert, LayoutAnimation, UIManager, Platform, ScrollView, RefreshControl,
    FlatList
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
import { getAllOrders, modifyOrderStatus } from '../services/api/api';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAgentDetails } from '../redux/slices/agentSlice';
import { useFocusEffect } from '@react-navigation/native';

// Enable layout animation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('PENDING');
    const [ordersByArea, setOrdersByArea] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [agentId, setAgentId] = useState(null);
    const [isOnDuty, setIsOnDuty] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [expandedAreas, setExpandedAreas] = useState([]);
    const [startConfirmModalVisible, setStartConfirmModalVisible] = useState(false);
    const [loadingArea, setLoadingArea] = useState(null);

    const drawerRef = useRef(null);
    const dispatch = useDispatch();
    const agent = useSelector((state) => state.agent);

    useEffect(() => {
        (async () => {
            const id = await AsyncStorage.getItem('agentId');
            setAgentId(id);
        })();
    }, []);

    useEffect(() => {
        dispatch(fetchAgentDetails());
    }, [dispatch]);

    const getStatus = () => {
        switch (activeTab) {
            case 'PENDING': return 'Order Packed';
            case 'DELIVERING': return 'Delivery Agent Accepted';
            case 'DELIVERED': return 'Order Delivered';
            default: return '';
        }
    };

    const fetchOrders = async (showLoader = true) => {
        if (!agentId) return;
        if (showLoader) setLoading(true);
        try {
            const res = await getAllOrders(agentId, getStatus());
            setOrdersByArea(res?.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [activeTab, agentId])
    );

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
            if (res.status === 200) {
                navigation.navigate("OrderDetails", { orderId: selectedOrder.orderId });
            } else {
                Alert.alert("Something went wrong");
            }
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

    const toggleAreaExpand = async (area) => {
        const isExpanded = expandedAreas.includes(area);
        if (isExpanded) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpandedAreas(expandedAreas.filter(a => a !== area));
            return;
        }
        setLoadingArea(area);
        await new Promise(resolve => setTimeout(resolve, 100));

        // Apply layout animation and expand
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedAreas(prev => [...prev, area]);
        setLoadingArea(null);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders(false); // avoid showing main loader when refreshing
    }, [activeTab, agentId]);

    if (loading && !refreshing) return <LoaderComponent />;

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
                    <TouchableOpacity onPress={() => fetchOrders()}>
                        <Entypo name="cycle" size={26} color={AppColors.whiteColor} />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    {['PENDING', 'DELIVERING', 'DELIVERED'].map(tab => {
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabButton, isActive && styles.activeTab]}
                                disabled={isActive} // ✅ disable tap for current tab
                                onPress={() => {
                                    if (!isActive) {
                                        setOrdersByArea([]);
                                        setActiveTab(tab);
                                        setExpandedAreas([]);
                                    }
                                }}
                            >
                                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Area + Orders */}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[AppColors.primaryColor]}
                        />
                    }
                >
                    {ordersByArea.length === 0 ? (
                        <EmptyComponent text="NO ORDERS FOUND" />
                    ) : (
                        ordersByArea.map((areaGroup) => (
                            <View key={areaGroup.area} style={styles.areaSection}>
                                <TouchableOpacity
                                    style={styles.areaCard}
                                    onPress={() => toggleAreaExpand(areaGroup.area)}
                                >
                                    <Text style={styles.areaTitle}>{areaGroup.area}</Text>
                                    <Entypo
                                        name={expandedAreas.includes(areaGroup.area) ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={AppColors.black}
                                    />
                                </TouchableOpacity>

                                {loadingArea === areaGroup.area ? (
                                    <View style={{ paddingVertical: 15 }}>
                                        <LoaderComponent small /> {/* 👈 make sure LoaderComponent supports small loader */}
                                    </View>
                                ) : expandedAreas.includes(areaGroup.area) ? (
                                    <FlatList
                                        data={areaGroup.orders}
                                        keyExtractor={(item) => item.orderId.toString()}
                                        renderItem={({ item }) => (
                                            <OrderCard
                                                // key={order.orderId}
                                                // task_no={order.orderNumber}
                                                navigation={navigation}
                                                // id={order.orderId}
                                                // status={order.status}
                                                // agentId={order.delAgentId}
                                                // pincode={order.pincode}
                                                // area={order.area}
                                                onAccept={() => handleAcceptPress(item)}
                                                type={activeTab}
                                                order={item}
                                            />
                                        )}
                                        scrollEnabled={false} // keeps it nested properly
                                        initialNumToRender={10} // render only a few initially
                                        maxToRenderPerBatch={10}
                                        updateCellsBatchingPeriod={30}
                                        windowSize={5}
                                    />


                                ) : null}
                            </View>
                        ))
                    )}
                </ScrollView>

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
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: AppColors.green }]}
                                    onPress={handleOkPress}
                                >
                                    <Text style={styles.okButtonText}>OK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: AppColors.red }]}
                                    onPress={() => setConfirmModalVisible(false)}
                                >
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
    refreshButton: {
        padding: 5,
    },
    switchText: { fontSize: 10, fontFamily: Fonts.OpenSansBold },
    tabContainer: {
        flexDirection: 'row', justifyContent: 'space-around',
        backgroundColor: AppColors.whiteColor, paddingVertical: 8, elevation: 3
    },
    tabButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
    activeTab: { backgroundColor: AppColors.primaryColor },
    tabText: { color: AppColors.black, fontFamily: Fonts.OpenSansSemiBold, fontSize: 13 },
    activeTabText: { color: AppColors.whiteColor },
    areaSection: { marginVertical: 8 },
    areaCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: AppColors.whiteColor,
        padding: 12,
        marginHorizontal: 15,
        borderRadius: 10,
        elevation: 3
    },
    areaTitle: {
        fontSize: 15,
        fontFamily: Fonts.OpenSansBold,
        color: AppColors.black
    },
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
