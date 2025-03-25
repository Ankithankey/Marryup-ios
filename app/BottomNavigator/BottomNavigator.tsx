import { View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import DrawerNavigator from '../Navigators/DrawerNavigator/DrawerNavigator';
import UserMatches from '../Screen6/UserMatches';
import UserProfileDetails from '../Screen8(profiles)/UserProfileDetails';
import Likes from '../Screen9/Likes';
import SearchFilters from '../Screen6/SearchFilters';
import UIDesign from '../Screen3(UserDetails)/UIDesign';
import Home from '../Screen7(Home)/Home';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
    initialRouteName='For You'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#A02334',
        tabBarInactiveTintColor: '#D3D3D3', 
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
          fontWeight: '600',
          
        },
        tabBarStyle: {
           backgroundColor: '#F5F5F5',
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
        },
        
      }}
    >
      <Tab.Screen
        name="Profile"
        component={DrawerNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <AntDesign
                name="user"
                size={24}
                color={focused ? '#A02334' : '#D3D3D3'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="People"
        component={SearchFilters}
        options={{
          title: 'people',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <AntDesign
                name="clockcircleo"
                size={24}
                color={focused ? '#A02334' : '#D3D3D3'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="For You"
        component={Home}
        options={{
          title: 'For You',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Entypo
                name="menu"
                size={24}
                color={focused ? '#A02334' : '#D3D3D3'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Liked You"
        component={Likes}
        options={{
          title: 'Liked You',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <AntDesign
                name="hearto"
                size={24}
                color={focused ? '#A02334' : '#D3D3D3'}
              />
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Chats"
        component={re}
        options={{
          title: 'Chats',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <AntDesign
                name="message1"
                size={24}
                color={focused ? '#006D70' : '#D3D3D3'}
              />
            </View>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default BottomNavigator;

