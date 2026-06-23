import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './src/screens/LandingScreen';
import HomeSetupScreen from './src/screens/HomeSetupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#131419' }
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="HomeSetup" component={HomeSetupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
