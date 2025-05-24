import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TaskScreen from '../screens/TaskScreen';
import WalletScreen from '../screens/WalletScreen';
import MapScreen from '../screens/MapScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderComponent from '../components/LoaderComponent';
import HistoryScreen from '../screens/HistoryScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import EarningsScreen from '../screens/EarningsScreen';


const Stack = createNativeStackNavigator();

const Container = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedInValue = JSON.parse(
        await AsyncStorage.getItem('isLoggedIn'),
      );
      setIsLoggedIn(isLoggedInValue);
      setLoading(false); // Stop loading once token is checked
    };

    checkLogin();
  }, []);

  if (loading) {
    // Show loader while checking token
    return <LoaderComponent />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={
        isLoggedIn
          ? 'Home'
          : 'Login'
      }>
        <Stack.Screen name="Login" component={LoginScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Task" component={TaskScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Wallet" component={WalletScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Earnings" component={EarningsScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Details" component={TaskDetailsScreen} options={{
          headerShown: false
        }} />
        <Stack.Screen name="Map" component={MapScreen} options={{
          headerShown: false
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Container;
