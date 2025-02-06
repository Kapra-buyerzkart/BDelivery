import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TaskScreen from '../screens/TaskScreen';
import WalletScreen from '../screens/WalletScreen';
import MapScreen from '../screens/MapScreen';


const Stack = createNativeStackNavigator();

const Container = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
        <Stack.Screen name="Map" component={MapScreen} options={{
          headerShown: false
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Container;
