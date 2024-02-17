import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import MyShifts from './screens/MyShifts';
import AvailableShifts from './screens/AvailableShifts';
import Icon from 'react-native-vector-icons/AntDesign';
import IconWork from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

const BottomTabNavigator = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <BottomTabNavigator.Navigator>
          <BottomTabNavigator.Screen
            name="myShifts"
            component={MyShifts}
            options={{
              headerShown: false,
              tabBarIcon: ({focused, color, size}) => (
                <Icon
                  name="user"
                  size={25}
                  color={focused ? '#004FB4' : 'grey'}
                />
              ),
              tabBarLabel: ({focused, color}) => (
                <Text style={{color, fontSize: focused ? 14 : 14}}>
                  My Shifts
                </Text>
              ),
            }}
          />

          <BottomTabNavigator.Screen
            name="availableShifts"
            component={AvailableShifts}
            options={{
              headerShown: false,
              tabBarIcon: ({focused, color, size}) => (
                <IconWork
                  name="work-outline"
                  size={25}
                  color={focused ? '#004FB4' : 'grey'}
                />
              ),
              tabBarLabel: ({focused, color}) => (
                <Text style={{color, fontSize: focused ? 14 : 14}}>
                  Available Shifts
                </Text>
              ),
            }}
          />
        </BottomTabNavigator.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
