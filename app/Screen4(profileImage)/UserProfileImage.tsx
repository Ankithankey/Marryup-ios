import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity, Alert, Modal, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import * as FileSystem from 'expo-file-system';
import { Profileapi } from '@/Network/Api';
import CustomLoader from '../Screen11/CustomLoader';

const MaxImageSize = 2;

const UserProfileImage = ({ route, navigation }) => {
    const [selectedimage, setselectedImage] = useState<any>(null);
    const [imgError, setimgError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [openModal, setOpenModal] = useState(false);
    const { isEdit, age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, HigestEdu, University, martialStatus, Selectheight, SelectWeight, Aboutyou, Hobbies, streetAddress } = route.params || {};
    const pickimage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.5,
                aspect: [3, 3],
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const fileInfo = await FileSystem.getInfoAsync(imageUri);

                if (fileInfo.exists && fileInfo.size) {
                    const fileSizeInMB = fileInfo.size / (1024 * 1024);

                    if (fileSizeInMB > MaxImageSize) {
                        Alert.alert('MarryUp', 'Image size should be less than 2MB.');
                        return;
                    }

                    setselectedImage(imageUri);
                } else {
                    Alert.alert('MarryUp', 'Could not retrieve image information.');
                }
            }
        }
    };

    const savedata = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const formData = new FormData();

            if (isEdit) {
                if (selectedimage) {
                    formData.append('ProfileImage', {
                        uri: selectedimage,
                        name: 'profile.jpg',
                        type: 'image/jpeg',
                    });
                    setIsLoading(false);
                } else {
                    Alert.alert('Error', 'Please select an image.');
                    return;
                }
            } else {
                const data = {
                    MotherTongue: MotherTongue,
                    // Religion: Religionvalue,
                    // Country: Countryvalue,
                    ProfilePictureUrl: selectedimage,
                    ProfileImage: selectedimage,
                    City: SelectCity,
                    State: SelectState,
                    Address: streetAddress,
                    Height: Selectheight,
                    MaritalStatus: martialStatus,
                    Occupation: WorksAs,
                    AnnualIncome: AnnualIncomeValue,
                    Weight: SelectWeight,
                    Education: HigestEdu,
                    HobbiesAndInterests: Hobbies,
                    AboutMe: Aboutyou,
                    // Age: age
                };
                console.log('data sending', data)
                Object.keys(data).forEach((key) => formData.append(key, data[key]));
                if (selectedimage) {
                    formData.append('ProfileImage', {
                        uri: selectedimage,
                        name: 'profile.jpg',
                        type: 'image/jpeg',
                    });
                }
            }
            setIsLoading(true);
            const result = await axios.put(Profileapi, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsLoading(false);
            Alert.alert('Success', 'Profile updated successfully!');
            navigation.navigate('BottomNavigator');
        } catch (error) {
            console.log('Error updating profile:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
    };

    const handelNext = () => {
        if (!selectedimage && !isEdit) {
            setimgError(true);
        } else {
            setimgError(false);
            savedata();
        }
    };

    return (
        <View style={styles.contain}>
            {isLoading && <CustomLoader visible={isLoading} message='Uploading' />}
            <StatusBar backgroundColor="#FFA600" barStyle="light-content" />
            {selectedimage ? (
                <Image source={{ uri: selectedimage }} style={styles.myimg} />
            ) : (
                <TouchableOpacity onPress={pickimage}>
                    <View style={styles.img}>
                        <Image source={require('../../assets/images/addphoto.png')} style={{ height: 140, width: 180, tintColor: 'gray' }} />
                    </View>
                    {imgError ? (
                        <Text style={{ fontSize: 18, marginTop: 10, fontWeight: '200', textAlign: 'center', color: 'red' }}>Add your photo here</Text>
                    ) : (
                        <Text style={{ fontSize: 18, marginTop: 10, fontWeight: '200', textAlign: 'center' }}>Add your photo here</Text>
                    )}
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.btn} onPress={handelNext}>
                <View><Text style={{ textAlign: 'center', fontSize: 17, color: 'white', width: 80 }}> Upload </Text></View>
            </TouchableOpacity>
            <Pressable style={styles.btns} onPress={pickimage}>
                <Text style={styles.btnsText}>Click here to select another image </Text>
            </Pressable>
            {/* <Modal visible={openModal} animationType='none' transparent={true}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: 'white', padding: 15, width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                        <Animatable.Image source={require('../../assets/images/checked.png')} style={{ height: 80, width: 80 }} animation='zoomIn' />
                        <Animatable.Text style={{ width: "100%", textAlign: 'center', marginVertical: 20, fontSize: 23 }} animation='zoomIn'>Profile Created Successfully</Animatable.Text>
                        <TouchableOpacity style={styles.btn} onPress={() => setOpenModal(false)}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 18 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> */}
        </View>
    );
};

export default UserProfileImage;

const styles = StyleSheet.create({
    contain: {
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    myimg: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        borderRadius: 100,
        borderColor: 'black'
    },
    btn: {
        backgroundColor: '#FFA600',
        width: 150,
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    img: {
        alignItems: 'center',
    },
    btns: {
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnsText: {
        color: 'black',
        fontSize: 18,
        width: '100%',
        marginTop: 10,
        fontFamily: 'Montserrat'
    },
});

