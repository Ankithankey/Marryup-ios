import React from 'react';
import { View, Button, Alert, TouchableOpacity,StyleSheet,Text} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/build/Ionicons';


const DeleteAccount = ({ navigation }) => {

  const handleDeleteAccount = async() => {
    const datatoken = await AsyncStorage.getItem('jwtToken');
    const UserId = await AsyncStorage.getItem('UserId');
    console.log('ank',UserId)
    Alert.alert(
      "Are you sure?",
      "Do you really want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
             
              const response = await axios.delete(
                `https://nrimarriage.in/api/v1/users/DeleteUser/${UserId}`, {
                  headers: {
                    Authorization: `Bearer ${datatoken}`,
                  },
                });

              if (response.status === 200) {
                console.log('deleted')
                await AsyncStorage.removeItem('jwtToken');
                navigation.navigate('Login');
              } else {
                console.error("Error deleting account", response.data);
              }
            } catch (error) {
              console.error("Error deleting account", error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.iconContainer}>
    <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteContainer}>
      <Ionicons name="trash-bin-outline" size={30} color="red" />
      <Text style={styles.deleteText}> Delete account </Text>
    </TouchableOpacity>
  </View>
  );
};

export default DeleteAccount;
const styles = StyleSheet.create({
    iconContainer: {
        flex: 1,
        padding: 10,
        marginTop:30
      },
      deleteContainer: {
        flexDirection: 'row', 
        alignItems: 'center',  
      },
      deleteText: {
        marginLeft: 10,  
        fontSize: 16,   
        color: 'black',  
      },
  });
