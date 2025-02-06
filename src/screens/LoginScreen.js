import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    Platform,
} from 'react-native';
import { AppColors } from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AlertComponent from '../components/AlertComponent';
import LoaderComponent from '../components/LoaderComponent';
import { Fonts } from '../constants/Fonts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Container';


const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [mobileNo, setMobileNo] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showPasswordIncorrectAlert, setShowPasswordIncorrectAlert] =
        useState(false);
    const [showUserNotExistAlert, setShowUserNotExistAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMobileNoEmptyAlert, setShowMobileNoEmptyAlert] = useState(false);
    const [showPwdEmptyAlert, setShowPwdEmptyAlert] = useState(false);
    const [showMobnoAndPwdEmptyAlert, setShowMobnoAndPwdEmptyAlert] =
        useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <AlertComponent
                visible={showPasswordIncorrectAlert}
                message={'Incorrect password'}
                okClick={() => setShowPasswordIncorrectAlert(false)}
            />
            <AlertComponent
                visible={showUserNotExistAlert}
                message={'User does not exist'}
                okClick={() => setShowUserNotExistAlert(false)}
            />
            <AlertComponent
                visible={showMobileNoEmptyAlert}
                message={'Please enter Mobile number'}
                okClick={() => setShowMobileNoEmptyAlert(false)}
            />
            <AlertComponent
                visible={showPwdEmptyAlert}
                message={'Please enter Password'}
                okClick={() => setShowPwdEmptyAlert(false)}
            />
            <AlertComponent
                visible={showMobnoAndPwdEmptyAlert}
                message={'Please enter Mobile number and Password'}
                okClick={() => setShowMobnoAndPwdEmptyAlert(false)}
            />
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    value={mobileNo}
                    onChangeText={setMobileNo}
                    placeholderTextColor={AppColors.gray}
                />
                <Entypo
                    name="mobile"
                    size={24}
                    color={AppColors.darkGray}
                    style={styles.icon}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={AppColors.gray}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <MaterialIcons
                        name={passwordVisible ? 'visibility' : 'visibility-off'}
                        size={24}
                        color={AppColors.darkGray}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate("Home")
                }}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.1,
        backgroundColor: AppColors.appBackgroundColor,
    },
    title: {
        fontSize: 17,
        // fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: AppColors.black,
        fontFamily: Fonts.OpenSansBold,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: AppColors.primaryColor,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: AppColors.whiteColor,
    },
    input: {
        flex: 1,
        height: 50,
        paddingLeft: 10,
        fontSize: 14,
        color: AppColors.black,
        fontFamily: Fonts.OpenSansRegular,
    },
    icon: {
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: AppColors.primaryColor,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: AppColors.whiteColor,
        fontSize: 15,
        // fontWeight: 'bold',
        fontFamily: Fonts.OpenSansBold,
    },
});

export default LoginScreen;
