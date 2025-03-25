import React, { useEffect, useState, useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SearchFilters from './SearchFilters';
import NewUsers from './NewUsers';

const ScreenWidth = Dimensions.get('window').width;

const ProfileList = ({ title }) => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true); 

  const URL = "https://nrimarriage.in/api/v1/Users/GetUsers";

  const getdata = useCallback(async (page: number, type: string) => {
    const datatoken = await AsyncStorage.getItem('jwtToken');
    console.log(datatoken);
    if (!datatoken) {
      console.log('error');
      Alert.alert('Token Not Found', 'Please Login Again');
      setIsLoading(false); 
      return;
    }
    
    try {
      const response = await axios.get(URL, {
        params:{
          pageNumber: page,
          pageSize: 10,  
          type: type, 
        },
        headers: {
          'Authorization': `Bearer ${datatoken}`,
          'Content-Type': 'application/json'
        }
      });
      setData(response.data); 
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Alert.alert('Session Expired', 'Your session has expired. Please login again.', [
          //   {
          //     text: 'OK',
          //     // onPress: () => navigation.navigate('Login') // Navigate to the Login page
          //   }
          // ]);
        }
      } else {
        // Handling unexpected errors
        Alert.alert('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getdata();
  }, [getdata]);

  const handleViewDetails = (item: any) => {
    console.log(item);
  };

  if (isLoading) {
    return <Text style={{textAlign:'center',alignItems:'center',justifyContent:'center',fontSize:18,marginTop:300}}>Loading...</Text>; 
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E40000" barStyle="light-content" />
      <Text style={styles.title}>{title}</Text>
      <Text style={{fontSize:30,marginTop:300,alignItems:'center',justifyContent:'center',marginLeft:40}}>Will Keep You Updated.</Text>
    </View>
  );
};

const SearchScreen = () => <ProfileList title="Search Results"  />;
const NewScreen = () => <ProfileList title="New Members" />;
const DailyScreen = () => <ProfileList title="Daily Recommendations"  />;
const MatchesScreen = () => <ProfileList title=" My Matches" />;

const Tab = createMaterialTopTabNavigator();

const UserMatches = () => {
  return (
    <Tab.Navigator initialRouteName='New'  screenOptions={{tabBarLabelStyle:{fontSize:14,width:'100%',textAlign:'center',justifyContent:'center',height:40,paddingTop:10}}}>
      <Tab.Screen name="Search" component={SearchFilters}/>
      <Tab.Screen name="New" component={NewUsers} />
      <Tab.Screen name="Daily" component={DailyScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
    </Tab.Navigator>
  );
};

export default UserMatches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardcontainer: {
    height: 450,
    backgroundColor: '#D3D3D3',
    width: ScreenWidth - 500,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D3D3D3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    marginTop: 5,
  },
  btn: {
    width: '60%',
    padding: 15,
    backgroundColor: '#006D70',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

