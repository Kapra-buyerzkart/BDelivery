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
import AlertComponent from './AlertComponent';
import { AppColors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
// import { db } from '../services/firebase';


const DrawerContent = ({ navigation, closeDrawer }) => {
    const [showNoAccessTokenFoundAlert, setShowNoAccessTokenFoundAlert] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('9605913522');
    const [name, setName] = useState('JITHIN KM');
    const [loading, setLoading] = useState(false);
    const [isOnDuty, setIsOnDuty] = useState(false); // State for the switch

    // const handleLogout = async (): Promise<void> => {
    //     try {
    //         const refreshToken = await AsyncStorage.getItem('refreshToken');
    //         if (refreshToken) {
    //             // Assuming revokeToken is defined elsewhere
    //             await revokeToken(refreshToken);
    //             await CookieManager.clearAll();
    //             navigation.replace('LoginScreen');
    //         } else {
    //             setShowNoAccessTokenFoundAlert(true);
    //         }
    //     } catch (error) {
    //         console.error('Error during logout:', error);
    //     }
    // };

    // const onWalletClick = (): void => {
    //     navigation.navigate('WalletScreen');
    // };

    // const fetchData = async (): Promise<void> => {
    //     try {
    //         const mobileNo = await AsyncStorage.getItem('mobileNo');
    //         if (!mobileNo) {
    //             console.error('No phone number found');
    //             return;
    //         }
    //         setPhoneNumber(mobileNo);

    //         const usersDoc = await getDoc(doc(db, 'users', mobileNo));
    //         if (usersDoc.exists()) {
    //             const userName = usersDoc.data()?.name || ' ';
    //             setName(userName);
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
            {loading ? (
                <ActivityIndicator
                    style={styles.loaderStyle}
                    size={'small'}
                    color={AppColors.primaryColor}
                />
            ) : (
                <View style={styles.profileView}>
                    <Image
                        style={styles.image}
                        source={require('../assets/images/logo.png')}
                    />
                    <View style={styles.subView}>
                        <Text style={styles.nameText}>{name}</Text>
                        <Text style={[styles.nameText, { marginTop: 5 }]}>{phoneNumber}</Text>
                    </View>
                </View>
            )}

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
                navigation.navigate("Wallet")
                closeDrawer()
            }} style={styles.logOut}>
                <AntDesign name={'wallet'} color={AppColors.primaryColor} size={19} />
                <Text style={styles.logoutText}>WALLET</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logOut}>
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
