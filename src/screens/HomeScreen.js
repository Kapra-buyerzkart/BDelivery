import React, { useRef, useState } from 'react';
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

const HomeScreen = ({ route, navigation }) => {

    const [isOnDuty, setIsOnDuty] = useState(false); // State for the switch

    const [orders, setOrders] = useState([
        {
            id: 1,
            order_no: 'S0-00917'
        },
        {
            id: 2,
            order_no: 'S0-00918'
        },
        {
            id: 3,
            order_no: 'S0-00919'
        },
        {
            id: 4,
            order_no: 'S0-00920'
        },
        {
            id: 5,
            order_no: 'S0-00921'
        },
        {
            id: 6,
            order_no: 'S0-00922'
        },
        {
            id: 7,
            order_no: 'S0-00923'
        },
        {
            id: 8,
            order_no: 'S0-00924'
        },
        {
            id: 9,
            order_no: 'S0-00925'
        },
        {
            id: 10,
            order_no: 'S0-00926'
        },
        {
            id: 11,
            order_no: 'S0-00927'
        },
    ]);

    const onDecline = (id) => {
        setOrders(orders.filter((order) => order.id !== id));
    }

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

    const toggleDutyStatus = () => {
        setIsOnDuty(previousState => !previousState);
    };

    console.log('ppppp',Platform.Version)

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
                <View style={styles.topView}>
                    <TouchableOpacity onPress={openDrawer}>
                        <Entypo name="menu" size={33} color={AppColors.whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.ordersText}>ORDERS</Text>
                    {/* <TouchableOpacity style={styles.hideStyle} onPress={openDrawer}>
            <Entypo name="menu" size={33} color={AppColors.whiteColor} />
          </TouchableOpacity> */}
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
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <OrderCard order_no={item.order_no} onDecline={() => onDecline(item.id)} navigation={navigation} />
                    )}
                    ListEmptyComponent={<EmptyComponent text='NO ORDERS' />}
                />
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
});

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    // main: { paddingLeft: 3 },
};

export default HomeScreen;
