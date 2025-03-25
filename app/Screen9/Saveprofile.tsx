import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
const Saveprofile = ({navigation}) => {
    const [savedProfiles, setSavedProfiles] = useState([]);
    useEffect(() => {
        const fetchSavedProfiles = async () => {
          const storedProfiles = await AsyncStorage.getItem('savedProfiles');
          
          if (storedProfiles) {
            let parsedProfiles = JSON.parse(storedProfiles);
            const uniqueProfiles = parsedProfiles.reduce((acc, profile) => {
              if (!acc.some(p => p.userId === profile.userId)) {
                acc.push(profile);
              }
              return acc;
            }, []);
      
            console.log("Unique Profiles:", uniqueProfiles);
            setSavedProfiles(uniqueProfiles);
          }
        };
        console.log("Unique Profiles:",savedProfiles );
        fetchSavedProfiles();
      }, []);
      
    
      const handleRemoveProfile = async (userId) => {
        const updatedProfiles = savedProfiles.filter(profile => profile.userId !== userId);
        await AsyncStorage.setItem('savedProfiles', JSON.stringify(updatedProfiles));
        setSavedProfiles(updatedProfiles);
        Alert.alert('Removed', 'Profile removed from saved list.');
      };
  return (
    <View style={{ flex: 1, padding: 20 }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Saved Profiles</Text>
    {savedProfiles.length === 0 ? (
      <Text>No saved profiles found.</Text>
    ) : (
      <FlatList
        data={savedProfiles}
        keyExtractor={(item) => item?.userId ? `profile-${item.userId}` : Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('For You', { USERID: item.userId })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            {
              item.profilePictureUrl ? (
                <Image source={{ uri: item.profilePictureUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              ):(
                <Image source={require('@/assets/images/profo.png')} style={{ width: 50, height: 50, borderRadius: 25 }} />
              )
            }
            <Text style={{ marginLeft: 10 }}> {item.firstName}{item.lastName} </Text>
            <TouchableOpacity onPress={() => handleRemoveProfile(item.userId)} style={{ marginLeft: 'auto' }}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        )}
      />
    )}
  </View>
  )
}

export default Saveprofile

const styles = StyleSheet.create({})