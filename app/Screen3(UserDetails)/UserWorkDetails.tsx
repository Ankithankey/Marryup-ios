import { StyleSheet, Text, View, StatusBar, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { rMs, rs, rVs } from '@/Styles/Responsive';
import { annualIncomeOptionsInINR, companySectors, professionsList } from '@/components/UsersOPtionsData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Profileapi } from '@/Network/Api';
import { LinearGradient } from 'expo-linear-gradient';

const UserWorkDetails = ({ navigation, route }) => {
    const [isFocus, setIsFocus] = useState(false);
    const [AnnualIncomeValue, setAnnualIncomevalue] = useState<any>(null);
    const [WorksIn, setWorksIn] = useState<any>(null);
    const [WorksAs, setWorksAs] = useState<any>(null);
    const [CompanyName, setCompanyName] = useState<any>(null);
    const {isEdit, age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, password, email, streetAddress } = route.params || {};

    const handleNext = () => {

        if (isEdit) {
            const update = async () => {
                const formData = {  AnnualIncome: AnnualIncomeValue, Occupation: WorksAs, };
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
                        Alert.alert('Update failed','error while updating',[
                            {text:'ok',onPress:()=>navigation.goBack()}
                        ])
                    }
                } catch (error) {
                    console.log('Error while updating', error);
                    Alert.alert('Update failed','error while updating',[
                        {text:'ok',onPress:()=>navigation.goBack()}
                    ])
                }
            };

            update();
        }else{
        navigation.navigate('UserEducationDetails', { age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, password, email, streetAddress });
        }
    };
    const handleSkip = ()=>{
            navigation.navigate('UserEducationDetails', { age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue:'N/A', WorksIn:'N/A', WorksAs:'N/A', CompanyName:'N/A', password, email, streetAddress });
    }
    return (
        <>
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
                                {!isEdit&&
                                <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
                                    <Text style={styles.skipText}>SKIP</Text>
                                </TouchableOpacity>}

                                <View style={styles.img}>
                                <Image
                                    source={require('../../assets/images/work.png')}
                                    style={{ marginTop: rVs(20), height: rs(80), width: rs(80), tintColor: '#fff' }}
                                />
                            </View>
                            <Text style={styles.headerTitle}>
                                Work Details
                            </Text>
                            </LinearGradient>
                        </View>
                        <View>
                            {/* Annual Income Input */}
                            <Text style={{ marginTop: rVs(20), fontSize: rs(26), fontWeight: '600', marginLeft: rMs(20) }}>
                                Annual Income
                            </Text>
                            <View style={styles.container}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={annualIncomeOptionsInINR}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'Annual Income'}
                                    value={AnnualIncomeValue}
                                    onChange={item => setAnnualIncomevalue(item.value)}
                                />
                            </View>

                            {/* Work Details Dropdown */}
                            <View style={styles.container}>
                                <Text style={{ marginTop: -10, fontSize: rs(26), fontWeight: '600', marginLeft: rMs(10) }}>
                                    Work Details
                                </Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={companySectors}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'He/She works with'}
                                    searchPlaceholder="Search..."
                                    value={WorksIn}
                                    onChange={item => setWorksIn(item.value)}
                                />
                            </View>

                            {/* Additional Work Details */}
                            <View style={styles.container}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={professionsList}
                                    placeholder={'Select your Profession'}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    searchPlaceholder="Search..."
                                    value={WorksAs}
                                    onChange={item => setWorksAs(item.value)}
                                />
                            </View>

                            <View style={styles.container}>
                                <TextInput
                                    inputMode="text"
                                    maxLength={20}
                                    style={styles.input}
                                    value={CompanyName}
                                    onChangeText={setCompanyName}
                                    placeholder="Enter Current Company name"
                                />
                            </View>
                            
                            <TouchableOpacity style={styles.btn} onPress={handleNext}>
                                <Text style={{ textAlign: 'center', fontSize: rs(12), color: 'white', width: 80 }}>
                                {isEdit ? "Update" : "Continue"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
}

export default UserWorkDetails;

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
        width: '99%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: rMs(10),
        marginTop: rVs(20),
        marginLeft: rMs(2),
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
        height: rVs(40),
        fontSize: rs(12),
    },
    input: {
        height: rVs(40),
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: rVs(5),
        paddingHorizontal: rMs(10),
        borderRadius: 8,
        marginTop: rVs(5),
        color: 'black',
        width: '99%',

    },
    btn: {
        width: '50%',
        padding: rVs(15),
        backgroundColor: '#FFA600',
        borderRadius: 99,
        textAlign: 'center',
        alignItems: 'center',
        marginTop: rVs(10),
        marginLeft: rMs(100),
        fontFamily: 'Montserrat'
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
