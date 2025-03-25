import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ScrollViewProps } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { MaterialCommunityIcons  as Icon } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { loggedinuserapi } from '@/Network/Api';

const DrawerContent = (props: React.JSX.IntrinsicAttributes & ScrollViewProps & { children: React.ReactNode; } & React.RefAttributes<ScrollView>) => {
    const [Userdata, SetUserData] = useState<any>('');
    const { firstName, lastName, profilePictureUrl, email } = Userdata;
    const getdata = useCallback(async () => {
        const datatoken = await AsyncStorage.getItem('jwtToken');
        if (!datatoken) {
            console.log('error');
        } else {
            await axios.get(loggedinuserapi, {
                headers: {
                    'Authorization': `Bearer ${datatoken}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                SetUserData(res.data);
                console.log(res.data);
            })
            .catch(err => console.log('error fetching data' + err));
        }
    }, []);
    useFocusEffect(
        useCallback(() => {
            getdata();
        }, [getdata])
    )
  return (
    <DrawerContentScrollView {...props}>
        {/* <StatusBar backgroundColor='#FFA600'/> */}
        <LinearGradient
          colors={['#FFB900', '#A02334']}
          style={styles.profileSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
        <Image source={ { uri:profilePictureUrl }||require('../../../assets/images/noImage.png') } style={styles.profileImage} />
        <Text style={styles.profileName}> {firstName} {lastName}</Text>
        <Text style={styles.profileId}> {email} </Text>
        </LinearGradient>

    <View style={styles.items}>
        <DrawerItem
            label="View and Edit your Profile"
            icon={({ color, size }) => <Icon name="account-edit" color={color} size={size} />}
            onPress={() => props.navigation.navigate('EditUserProfileDetails')}
        />
        <DrawerItem
            label="Saved Profiles"
            icon={({ color, size }) => <Icon name="book-marker" color={color} size={size} />}
            onPress={() =>  props.navigation.navigate('Saveprofile')}
        />
        <DrawerItem
            label="Upgrade to Premium"
            icon={({ color, size }) => <Icon name="star" color={color} size={size} />}
            onPress={() => {}}
            
        />
    </View>

    <View style={styles.items}>
        <Text style={styles.sectionTitle}>Discover Your Matches</Text>
        <DrawerItem
            label="Matches"
            icon={({ color, size }) => <Icon name="heart" color={color} size={size} />}
            onPress={() => props.navigation.navigate('Matches')}
        />
        <DrawerItem
            label="Inbox"
            icon={({ color, size }) => <Icon name="inbox" color={color} size={size} />}
            onPress={() => props.navigation.navigate('Inbox')}
        />
        <DrawerItem
            label="Chat"
            icon={({ color, size }) => <Icon name="chat" color={color} size={size} />}
            onPress={() => props.navigation.navigate('Chat')}
        />
    </View>
    <View style={styles.items}>
    <Text style={styles.sectionTitle}>Options & Settings</Text>
    <DrawerItem
        label="Partner Preferences"
        icon={({ color, size }) => <Icon name="head-heart" color={color} size={size} />}
        onPress={() => {props.navigation.navigate('Partners_Details')}}
    />
    <DrawerItem
        label="Account Settings"
        icon={({ color, size }) => <Icon name="cogs" color={color} size={size} />}
        onPress={() => {props.navigation.navigate('DeleteAccount')}}
    />
    <DrawerItem
        label="Support"
        icon={({ color, size }) => <Icon name="contacts" color={color} size={size} />}
        onPress={() => {props.navigation.navigate('ContactUs')}}
    />
    <DrawerItem
        label="Logout"
        icon={({ color, size }) => <Icon name="logout" color={color} size={size} />}
        onPress={async () => {
            await AsyncStorage.removeItem('jwtToken');
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }}
    />
    </View>
</DrawerContentScrollView>
  )
}

export default DrawerContent

const styles = StyleSheet.create({
    profileSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        marginTop:-4
    },
    profileImage: {
        height: 150,
        width: 150,
        borderRadius: 75,
        marginVertical: 20,
        borderColor: "#F1C27D",
        borderWidth: 3,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F1C27D',
    },
    profileId: {
        fontSize: 14,
        color: '#fff',
        marginTop:10
    },
    sectionTitle: {
        marginVertical: 10,
        marginLeft: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A02334',
        backgroundColor:'#F5F5F5'
    },
    items: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor:'#F5F5F5'
    }
})