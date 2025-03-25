import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { rMs, rs, rVs } from '@/Styles/Responsive';
import { Profileapi } from '@/Network/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const UserAboutDetails = ({ route, navigation }) => {
    const [Hobbies, setHobbies] = useState('');
    const [Aboutyou, setAboutyou] = useState('');
    const [Error, setError] = useState<any>(null);
    const { isEdit, age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, HigestEdu, University, martialStatus, Selectheight, SelectWeight, selectedimage, password, email, streetAddress } = route.params || {};

    const handleNext = () => {
        if (isEdit) {
            const update = async () => {
                const formData = { HobbiesAndInterests: Hobbies, AboutMe: Aboutyou, };
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

                    if (result.status === 200) {
                        navigation.goBack();
                    } else {
                        console.error("Update failed:", result);
                        Alert.alert('Update failed', 'error while updating', [
                            { text: 'ok', onPress: () => navigation.goBack() }
                        ])
                    }
                } catch (error) {
                    console.log('Error while updating', error);
                    Alert.alert('Update failed', 'error while updating', [
                        { text: 'ok', onPress: () => navigation.goBack() }
                    ])
                    setError(true);
                }
            };

            update();
        } else {
            navigation.navigate('UserProfileImage', { age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, HigestEdu, University, martialStatus, Selectheight, SelectWeight, Hobbies, password, email, Aboutyou, selectedimage, streetAddress });
        }
    };

    const handleSkip = () => {
        console.log('hello')
        navigation.navigate('UserProfileImage', { age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, HigestEdu, University, martialStatus, Selectheight, SelectWeight, Hobbies: "N/A", Aboutyou: "N/A", password, email, selectedimage, streetAddress });
    };

    return (
        <>
            <KeyboardAvoidingView style={styles.flexstyle} behavior="padding" enabled={true}>
                <SafeAreaView>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <View style={styles.headerContainer}>
                        <StatusBar backgroundColor="#FFA600" barStyle="dark-content" />
                            <LinearGradient
                                colors={['#FFA600', '#FFD27F', 'white']} 
                                style={styles.gradientStyle}
                            >
                                {!isEdit&&
                                <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
                                    <Text style={styles.skipText}>SKIP</Text>
                                </TouchableOpacity>}

                                <View style={styles.img}>
                                    <Image
                                        source={require('../../assets/images/idea.png')}
                                        style={{ marginTop: rVs(20), height: rs(70), width: rs(80), tintColor: 'white' }}
                                    />
                                </View>
                                <Text style={styles.headerTitle}>Something Interesting!</Text>
                            </LinearGradient>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>Hobbies</Text>
                            <TextInput
                                editable
                                multiline
                                textAlignVertical="top"
                                numberOfLines={10}
                                inputMode="text"
                                style={styles.input}
                                value={Hobbies}
                                onChangeText={setHobbies}
                                placeholder="Tell us about your hobbies"
                                onFocus={() => setError(null)}
                                maxLength={200}
                            />
                            <Text style={styles.label}>About You</Text>
                            <TextInput
                                editable
                                multiline
                                textAlignVertical="top"
                                numberOfLines={10}
                                inputMode="text"
                                style={styles.input}
                                value={Aboutyou}
                                onChangeText={setAboutyou}
                                placeholder="Let your Partner know about you"
                                maxLength={500}
                            />
                            {Error && <Text style={{ color: 'red', fontSize: rs(12), fontWeight: '600', textAlign: 'center' }}>{Error}</Text>}
                            <TouchableOpacity style={styles.btn} onPress={handleNext}>
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: rs(12), color: 'white', width: 80 }}> {isEdit?"Update":"Continue"} </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );


}

export default UserAboutDetails;

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
    container: {
        padding: rMs(20),
        justifyContent: 'center',
        marginTop: rVs(30),
    },
    label: {
        marginBottom: rVs(10),
        fontSize: rs(26),
        marginLeft: rMs(1),
        marginTop: rVs(5),
    },
    input: {
        height: rVs(120),
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: rVs(10),
        paddingHorizontal: rMs(10),
        borderRadius: 8,
        marginTop: rVs(5),
        padding: rMs(15),
        fontSize: rMs(12),
    },
    img: {

        alignItems: 'center',
    },
    btn: {
        width: '50%',
        padding: rVs(15),
        backgroundColor: '#FFA600',
        borderRadius: 99,
        textAlign: 'center',
        alignItems: 'center',
        marginTop: rVs(40),
        marginLeft: rMs(80),
        fontFamily: "Montserrat"
    },
    flexstyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    skipButton: {
        position: 'absolute',
        top: rVs(5),
        right: rMs(4),
        paddingVertical: rVs(5),
        paddingHorizontal: rMs(15),
        borderRadius: 15,
        shadowColor: '#FFA600',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
        zIndex: 10,
    },

    skipText: {
        fontSize: rs(14),
        color: 'white',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});
