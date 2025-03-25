import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ActivityIndicator, SafeAreaView, ScrollView, TextInput, StatusBar } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { rMs, rs, rVs } from '@/Styles/Responsive';
import { loggedinuserapi } from '@/Network/Api';
import CustomLoader from '../Screen11/CustomLoader';

const EditUserProfileDetails = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [EditedUserdata, SetEditedUserData] = useState<any>({
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    age: '',
    maritalStatus: '',
    email: '',
    profilePictureUrl: selectedImage,
    phoneNumber: '',
    address: '',
    country: '',
    religion: '',
    caste: '',
    subCaste: '',
    height: '',
    weight: '',
    motherTongue: '',
    education: '',
    occupation: '',
    annualIncome: '',
    familyDetails: '',
    preferredPartnerAgeRange: '',
    preferredPartnerReligion: '',
    preferredPartnerCaste: '',
    preferredPartnerLocation: '',
    aboutMe: '',
    hobbiesAndInterests: '',
    profileStatus: '',
    socialMediaLinks: ''
  });

  const excludedKeys = ['profilePictureUrl', 'userId', "isActive", 'isVerified', 'profileStatus', 'modifiedOn', 'lastLogin', 'createdOn', 'email',  'socialMediaLinks', 'caste', 'subCaste','phoneNumber'];
  const filteredKeys = Object.keys(EditedUserdata).filter(key => !excludedKeys.includes(key));

  const pickimage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        aspect: [3, 3]
      });
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    }
  };

  const getdata = useCallback(async () => {
    const datatoken = await AsyncStorage.getItem('jwtToken');
    if (!datatoken) {
      console.log('error');
    } else {
      setIsLoading(true);
      try {
        const response = await axios.get(loggedinuserapi, {
          headers: {
            'Authorization': `Bearer ${datatoken}`,
            'Content-Type': 'application/json'
          }
        });
        SetEditedUserData({
          ...response.data,
          height: response.data.height?.toString() || '',
          weight: response.data.weight?.toString() || '',
        });
        setSelectedImage(response.data.profilePictureUrl);
        setIsLoading(false);
      } catch (err) {
        console.error('error fetching data', err);
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getdata();
    }, [getdata])
  );

  const handleInputChange = (field: any, value: any) => {
    SetEditedUserData((prevState: any) => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    const datatoken = await AsyncStorage.getItem('jwtToken');

    const formData = new FormData();

    if (selectedImage) {
      formData.append('ProfileImage', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'profile_image.jpg',
        size: 2048
      });
    }

    Object.keys(EditedUserdata).forEach(key => {
      if (EditedUserdata[key] !== null && EditedUserdata[key] !== '') {
        formData.append(key, EditedUserdata[key]);
      }
    });
    setIsLoading(true)
    try {
      const response = await axios.put(loggedinuserapi, formData, {
        headers: {
          'Authorization': `Bearer ${datatoken}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setIsLoading(false)
      Alert.alert('Success', 'Profile updated successfully');
      navigation.navigate('BottomNavigator');
    } catch (error) {
      setIsLoading(false)
      console.error('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update profile');
    }
  };
  console.log('hellosns', EditedUserdata)

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FFA600" barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <CustomLoader  visible={isLoading}/>
          ) : (
            <>
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={pickimage}>
                  <Image
                    source={{ uri: selectedImage || EditedUserdata.profilePictureUrl }}
                    style={styles.image}
                  />
                  <MaterialIcons name="photo-camera" size={30} color="white" style={styles.cameraIcon} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}> Update </Text>
              </TouchableOpacity>
              {filteredKeys.map((key) => (
                <View key={key} style={styles.inputContainer}>
                  <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <TextInput
                    value={EditedUserdata[key]}
                    onChangeText={(value) => handleInputChange(key, value)}
                    style={styles.textInput}
                    editable={true}
                    placeholder={'Enter Now'}
                  />
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditUserProfileDetails;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#FFA600',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFA600',
    borderRadius: 50,
    padding: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#800020',
    fontFamily: 'OpenSans',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    color: 'black',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: 'OpenSans',
  },
  updateButton: {
    backgroundColor: '#FFA600',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    width: '30%',
    marginLeft: rMs(120),
    fontFamily: 'Montserrat'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
});
