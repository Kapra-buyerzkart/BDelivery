import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CookieManager from '@react-native-cookies/cookies';
// import { doc, getDoc } from 'firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AlertComponent from './AlertComponent';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
// import { db } from '../services/firebase';


const DrawerContent = ({ navigation, closeDrawer }) => {
    const [showNoAccessTokenFoundAlert, setShowNoAccessTokenFoundAlert] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOnDuty, setIsOnDuty] = useState(false); // State for the switch
    const [id, setId] = useState(null);

    const agent = useSelector((state) => state.agent);
    console.log('redid', agent.agentId)
    const handleLogout = async () => {
        try {
            console.log("11111")
            await firestore()
                .collection('deliveryAgents')
                .doc(agent.agentId)
                .update({
                    onDuty: false,
                });

            await AsyncStorage.removeItem('isLoggedIn');
            await AsyncStorage.removeItem('id');
            // await AsyncStorage.removeItem('isOnDuty');
            console.log("logout")
            navigation.replace("Login")
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // const onWalletClick = (): void => {
    //     navigation.navigate('WalletScreen');
    // };

    // const fetchData = async () => {
    //     try {
    //         const id = await AsyncStorage.getItem('id');
    //         if (!id) {
    //             console.error('No id found');
    //             return;
    //         }
    //         setId(id);

    //         const usersDoc = await firestore().collection('deliveryAgents').doc(id).get();
    //         if (usersDoc.exists) {
    //             const agentName = usersDoc.data()?.name || ' ';
    //             const agentPhone = usersDoc.data()?.mobile || ' ';
    //             setName(agentName);
    //             setPhoneNumber(agentPhone);
    //         } else {
    //             console.warn('No such document found for this phone number.');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const toggleDutyStatus = () => {
        setIsOnDuty(previousState => !previousState);
    };



    return (
        <SafeAreaView style={styles.drawerContent}>
            <AlertComponent
                message={'No access token found'}
                visible={showNoAccessTokenFoundAlert}
                okClick={() => setShowNoAccessTokenFoundAlert(false)}
                showTitle={true}
                title={'ERROR'}
            />
            {/* {loading ? (
                <ActivityIndicator
                    style={styles.loaderStyle}
                    size={'small'}
                    color={AppColors.primaryColor}
                />
            ) : ( */}
            <View style={styles.profileView}>
                <Image
                    style={styles.image}
                    source={require('../assets/images/logo.png')}
                />
                <View style={styles.subView}>
                    <Text style={styles.nameText}>{agent.name}</Text>
                    <Text style={[styles.nameText, { marginTop: 5 }]}>{agent.mobile}</Text>
                </View>
            </View>
            {/* )} */}

            {/* ON DUTY Switch */}
            {/* <View style={styles.dutyStatusContainer}>
                <Text style={styles.dutyStatusText}>ON DUTY</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isOnDuty ? '#f5dd4b' : '#f4f3f4'}
                    onValueChange={toggleDutyStatus}
                    value={isOnDuty}
                />
            </View> */}

            <TouchableOpacity onPress={() => {
                navigation.navigate("History")
                closeDrawer()
            }} style={styles.logOut}>
                <AntDesign name={'wallet'} color={AppColors.primaryColor} size={19} />
                <Text style={styles.logoutText}>HISTORY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Earnings")
                closeDrawer()
            }} style={styles.logOut}>
                <FontAwesome name={'money'} color={AppColors.primaryColor} size={19} />
                <Text style={styles.logoutText}>EARNINGS</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logOut}>
                <MaterialIcons
                    name={'logout'}
                    color={AppColors.primaryColor}
                    size={19}
                />
                <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: AppColors.whiteColor,
        padding: 20,
    },
    logoutText: {
        color: AppColors.primaryColor,
        fontSize: 14,
        marginLeft: 10,
        fontFamily: Fonts.OpenSansBold,
    },
    logOut: {
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        height: 40,
        width: 40,
    },
    subView: {
        marginLeft: 10,
    },
    nameText: {
        fontSize: 14,
        fontFamily: Fonts.OpenSansBold,
        color: AppColors.darkGray,
    },
    loaderStyle: {
        marginBottom: 20,
    },
    dutyStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dutyStatusText: {
        fontSize: 14,
        fontFamily: Fonts.OpenSansBold,
        color: AppColors.darkGray,
        marginRight: 10,
    },
});

export default DrawerContent;
