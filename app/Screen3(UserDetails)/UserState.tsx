import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Dropdown } from 'react-native-element-dropdown';
import { rMs, rs, rVs } from '@/Styles/Responsive';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Profileapi } from '@/Network/Api';
import CustomLoader from '../Screen11/CustomLoader';

const passportdata = [
    { label: 'Yes', passportvalue: 'Yes' },
    { label: 'No', passportvalue: 'No' },
];

const UserState = ({ route, navigation }) => {
    const [isFocus, setIsFocus] = useState<any>(false);
    const [streetAddress, setStreetAddress] = useState<any>('');
    const [Selectpassport, setSelectpassport] = useState<any>('');
    const [SelectCity, setCity] = useState<any>('');
    const [Country, setCountry] = useState<any>('');
    const [SelectState, setstate] = useState<any>('');
    const [error, setError] = useState<any>(false);
    const [location, setLocation] = useState<any>(null);
    const [address, setAddress] = useState<any>('');
    const [errorMsg, setErrorMsg] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<any>(true);
    const [permissionDenied, setPermissionDenied] = useState(false); 

    const {isEdit, age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, password, email } = route.params || {};

    useEffect(() => {
        const getuserlocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setPermissionDenied(true);
                setIsLoading(false);
                return;
            }

            setPermissionDenied(false);
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            const [geocode] = await Location.reverseGeocodeAsync(currentLocation.coords);

            if (geocode && !address) {
                const addressParts = [
                    geocode.city,
                    geocode.region,
                    geocode.country,
                    geocode.postalCode,
                ].filter(Boolean);
                const fullAddress = addressParts.join(', ');
                setAddress(fullAddress);
                setCity(geocode.city);
                setstate(geocode.region);
                setCountry(geocode.country)
            }

            setIsLoading(false);
        };

        getuserlocation();
    }, []);

    const handleNext = () => {
        setTimeout(() => {
            setError(false);
        }, 2000);
        if (!Selectpassport || !location) {
            setError(true);
        } else {
            setStreetAddress('');
            setSelectpassport('');
            if (isEdit) {
                const update = async () => {
                    const formData = { address: streetAddress, City: SelectCity,State: SelectState, country:Country};
                    setIsLoading(true)
                    try {
                        const token = await AsyncStorage.getItem('jwtToken');
                        if (!token) {
                            console.error("Token not found");
                            return;
                        }
                        const result = await axios.put(Profileapi, formData, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        setIsLoading(false)
                        if (result.status === 200) {
                            navigation.goBack();
                        } else {
                            setIsLoading(false)
                            console.error("Update failed:", result);
                            Alert.alert('Update failed','error while updating',[
                                {text:'ok',onPress:()=>navigation.goBack()}
                            ])
                        }
                    } catch (error) {
                        setIsLoading(false)
                        console.log('Error while updating', error);
                        Alert.alert('Update failed','error while updating',[
                            {text:'ok',onPress:()=>navigation.goBack()}
                        ])

                    }
                };
    
                update();
            }else{
            navigation.navigate('UserWorkDetails', { age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, streetAddress, Selectpassport, password, email, SelectCity, SelectState });
            console.log(password, email);
        }}
    };

    const handleGetLocation = async () => {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            setPermissionDenied(true);
            setIsLoading(false);
            return;
        }
        setPermissionDenied(false); 
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        const [geocode] = await Location.reverseGeocodeAsync(location.coords);

        if (geocode && !address) {
            const fullAddress = `${geocode.street}, ${geocode.city}, ${geocode.region}, ${geocode.country}`;
            setAddress(fullAddress);
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <CustomLoader  visible={isLoading} message='Fetching Your Current Location..,Please wait'/>
        );
    }

    if (permissionDenied) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <Text style={{ fontSize: rs(14), color: 'red' }}>
                    Permission to access location was denied. Please enable location services for this app.
                </Text>
                <TouchableOpacity onPress={handleGetLocation} style={styles.btn}>
                    <Text style={{ textAlign: 'center', fontSize: rs(12), color: 'white' }}>
                        Retry Location Access
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.flexstyle} behavior="padding" enabled={true}>
            <SafeAreaView>
                <StatusBar backgroundColor="#FFA600" barStyle="light-content" />
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.headerContainer}>
                        <StatusBar backgroundColor="#FFA600" barStyle="dark-content" />
                            <LinearGradient
                                colors={['#FFA600', '#FFD27F', 'white']} 
                                style={styles.gradientStyle}
                            >
                                <View style={styles.img}>
                            <Image
                                source={require('../../assets/images/location.png')}
                                style={{ marginTop: rVs(20), height: rs(80), width: rs(80),tintColor:'#fff' }}
                            />
                        </View>
                        <Text style={styles.headerTitle}>
                            Let Us Know
                        </Text>
                            </LinearGradient>
                        </View>
                    <View>
                        {/* Street Address Input */}
                        <View style={styles.container}>
                            <Text style={{ marginTop: rVs(30), fontSize: rs(26), fontWeight: '600', marginLeft: rMs(20) }}>
                                Location
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={address}
                                onChangeText={setStreetAddress}
                                placeholder="Enter your street address"
                                editable={false}
                            />
                            <Pressable onPress={handleGetLocation}>
                                <Text style={styles.getLocationButtonText}>Current Location? Click Here</Text>
                            </Pressable>

                            {/* Passport Dropdown */}
                            <Text style={{ marginTop: rVs(40), fontSize: rs(18), fontWeight: '600', marginLeft: rMs(20) }}>
                                Do you have a passport?
                            </Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={passportdata}
                                maxHeight={300}
                                labelField="label"
                                valueField="passportvalue"
                                placeholder={'...'}
                                value={Selectpassport}
                                onChange={(item) => {
                                    setSelectpassport(item.passportvalue);
                                    setIsFocus(false);
                                }}
                            />

                            {error && <Text style={styles.errortext}>Please Enter the above field</Text>}

                            <TouchableOpacity style={styles.btn} onPress={handleNext}>
                                <Text style={{ textAlign: 'center', fontSize: rs(12), color: 'white', width: 80 }}>
                                   {isEdit ? "Update" : "Continue"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default UserState;

const styles = StyleSheet.create({
    headerContainer: {
        overflow: 'hidden',
    },

    headerTitle: {
        marginTop: rVs(10),
        fontSize: rs(18),
        fontWeight: '900',
        textAlign: 'center',
        color: 'black',  
    },
    gradientStyle: {
        paddingVertical: rVs(20),
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    img: {
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        padding: rMs(16),
        justifyContent: 'center',
        alignContent: 'center',
    },
    dropdown: {
        height: rVs(40),
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: rVs(20),
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: rs(12),
    },
    selectedTextStyle: {
        fontSize: rs(12),
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: rs(12),
    },
    input: {
        height: rVs(40),
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: rVs(5),
        paddingHorizontal: rMs(10),
        borderRadius: 8,
        marginTop: rVs(20),
    },
    btn: {
        width: '50%',
        padding: rVs(15),
        backgroundColor: '#FFA600',
        borderRadius: 99,
        textAlign: 'center',
        alignItems: 'center',
        marginTop: rVs(130),
        marginLeft: rMs(80),
        fontFamily: 'Montserrat'
    },
    getLocationButton: {
        backgroundColor: '#452c63',
        padding: rVs(10),
        borderRadius: 8,
        marginTop: rVs(20),
    },
    getLocationButtonText: {
        color: 'blue',
        fontSize: rs(10),
        paddingLeft: 10,
    },
    errortext: {
        color: 'red',
        textAlign: 'center',
    },
    flexstyle: {
        flex: 1,
        backgroundColor: 'white',
        height: '100%',
    },
});
