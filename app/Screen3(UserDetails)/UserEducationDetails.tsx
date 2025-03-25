import { StyleSheet, Text, View, StatusBar, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { rMs, rs, rVs } from '@/Styles/Responsive';
import { Dropdown } from 'react-native-element-dropdown';
import { highestQualifications } from '@/components/UsersOPtionsData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Profileapi } from '@/Network/Api';
import { LinearGradient } from 'expo-linear-gradient';

const UserEducationDetails = ({ navigation, route }) => {
    const [HigestEdu, setHigestEdu] = useState<any>('');
    const [University, setUniversity] = useState('');
    const [workerr, setworkerr] = useState(false);
    const {isEdit, age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, password, email, streetAddress } = route.params || {}

    const handleNext = () => {
        setTimeout(() => {
            setworkerr(false);
        }, 2000);
        if (!University) {
            setworkerr(true);
        } else {
            setHigestEdu('');
            setUniversity('');
            if (isEdit) {
                const update = async () => {
                    const formData = { Education: HigestEdu, };
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
                        setworkerr(true);
                    }
                };
    
                update();
            }else{
            navigation.navigate('UserMartialDetails', { age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, HigestEdu, University, password, email, streetAddress });
            console.log(password, email);
            }
        }
    }
    const handleSkip = () => {
        navigation.navigate('UserMartialDetails', { age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, HigestEdu:"N/A", University, password, email, streetAddress });
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
                                <Image source={require('../../assets/images/edu.png')} style={{ marginTop: rVs(20), height: rs(80), width: rs(80), tintColor: '#fff' }} />
                            </View>
                            <Text style={{ marginTop: rVs(10), fontSize: rs(18), fontWeight: '900', marginLeft: rMs(5), textAlign: 'center', color: 'black' }}>
                                Great! Few more details
                            </Text>
                            </LinearGradient>
                        </View>
                        <View>
                            <View style={styles.container}>
                                <Text style={{ marginTop: rVs(40), fontSize: rs(26), fontWeight: '600', marginLeft: rMs(20) }}>Highest qualification</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={highestQualifications}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'Education'}
                                    value={HigestEdu}
                                    onChange={(item) => {
                                        setHigestEdu(item.value);
                                    }}
                                />

                                {HigestEdu && (
                                    <>
                                        <Text style={{ marginTop: rVs(40), fontSize: rs(26), fontWeight: '600', marginLeft: rMs(20) }}>University</Text>
                                        <TextInput
                                            inputMode="text"
                                            maxLength={30}
                                            style={styles.input}
                                            value={University}
                                            onChangeText={setUniversity}
                                            placeholder={'University name'}
                                        />

                                        {workerr ? <Text style={styles.errortext}>Please enter the above field</Text> : null}

                                        <TouchableOpacity style={styles.btn} onPress={handleNext}>
                                            <Text style={{ textAlign: 'center', fontSize: rs(12), color: 'white', width: 80 }}>{isEdit?"Update":"Continue"}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>

        </>
    )
}

export default UserEducationDetails;

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
    input: {
        height: rVs(40),
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: rVs(5),
        paddingHorizontal: rMs(10),
        borderRadius: 8,
        marginTop: rVs(25),
    },
    btn: {
        width: '50%',
        padding: rVs(15),
        backgroundColor: '#FFA600',
        borderRadius: 99,
        textAlign: 'center',
        alignItems: 'center',
        marginTop: rVs(140),
        marginLeft: rMs(80),
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
