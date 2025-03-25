import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { rMs, rs, rVs } from '@/Styles/Responsive';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Profileapi } from "@/Network/Api";
import { LinearGradient } from "expo-linear-gradient";

const martialStatusdata = [
    { label: "Single", martialvalue: "Single" },
    { label: "Divorced", martialvalue: "Divorced" },
    { label: "Widower", martialvalue: "Widower" },
    { label: "Widow", martialvalue: "Widow" },
    { label: "Never married", martialvalue: "Never married" },
    { label: "Separated", martialvalue: "Separated" },
    { label: "Registered partnership", martialvalue: "Registered partnership" },
];

const UserMartialDetails = ({ route, navigation }) => {
    const [martialStatus, setmartialStatus] = useState<any>(null);
    const [Selectheight, setSelectheight] = useState("");
    const [SelectWeight, setSelectWeight] = useState("");
    const [error, seterror] = useState(false);

    const {isEdit, age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, HigestEdu, University, password, email, streetAddress } = route.params || {};

    const handleNext = () => {
        setTimeout(() => {
            seterror(false);
        }, 2000);
        if (!Selectheight) {
            seterror(true);
        } else {
            setSelectheight('');
            setSelectWeight('');
            if (isEdit) {
                const update = async () => {
                    const formData = { maritalStatus: martialStatus, Height: Selectheight, Weight: SelectWeight };
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
                        seterror(true);
                    }
                };
    
                update();
              } else {
                navigation.navigate('UserAboutDetails', { age, MotherTongue, Religionvalue, Countryvalue, subcaste, caste, PhoneNumber, SelectCity, SelectState, Selectpassport, AnnualIncomeValue, WorksIn, WorksAs, CompanyName, HigestEdu, University, martialStatus, Selectheight, SelectWeight, password, email, streetAddress });
              }
            }
    }

    return (
        <>
            <KeyboardAvoidingView style={styles.flexstyle} behavior="padding" enabled={true}>
                <SafeAreaView>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <StatusBar backgroundColor="#FFA600" barStyle="light-content" />
                    <View style={styles.headerContainer}>
                        <StatusBar backgroundColor="#FFA600" barStyle="dark-content" />
                            <LinearGradient
                                colors={['#FFA600', '#FFD27F', 'white']} 
                                style={styles.gradientStyle}
                            >
                                <View style={styles.img}>
                                <Image
                                    source={require("../../assets/images/martial.png")}
                                    style={{ marginTop: rVs(20), height: rs(80), width: rs(80),tintColor:'#fff' }}
                                />
                            </View>
                            <Text style={styles.headerTitle}>
                                Let Us Know
                            </Text>
                            </LinearGradient>
                        </View>
                        <View>
                            {/* Marital Status Dropdown */}
                            <View style={styles.container}>
                                <Text style={{ marginTop: rVs(20), fontSize: rs(26), fontWeight: "600", marginLeft: rMs(10) }}>
                                    Marital status
                                </Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    iconStyle={styles.iconStyle}
                                    data={martialStatusdata}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="martialvalue"
                                    placeholder={"Martial Status ?"}
                                    value={martialStatus}
                                    onChange={(item) => {
                                        setmartialStatus(item.martialvalue);
                                    }}
                                />
                            </View>

                            <Text style={{ marginTop: rVs(40), fontSize: rs(26), fontWeight: "600", marginLeft: rMs(20) }}>
                                Height
                            </Text>
                            <TextInput
                                inputMode="numeric"
                                maxLength={3}
                                keyboardType="number-pad"
                                style={styles.input}
                                value={Selectheight}
                                onChangeText={setSelectheight}
                                placeholder={"Height in cm "}
                            />

                            {Selectheight && (
                                <>
                                    <Text style={{ marginTop: rVs(40), fontSize: rs(26), fontWeight: "600", marginLeft: rMs(20) }}>
                                        Weight
                                    </Text>
                                    <TextInput
                                        inputMode="numeric"
                                        maxLength={4}
                                        keyboardType="number-pad"
                                        style={styles.input}
                                        value={SelectWeight}
                                        onChangeText={setSelectWeight}
                                        placeholder={"Weight in kg (optional)"}
                                    />

                                    {error && <Text style={styles.errortext}>Please Enter the above field</Text>}
                                    
                                    <TouchableOpacity style={styles.btn} onPress={handleNext}>
                                        <Text style={{ textAlign: "center", fontSize: rs(12), color: "white", width: 80 }}>
                                        {isEdit ? "Update" : "Continue"}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
}

export default UserMartialDetails;

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
        alignItems: "center",
    },
    container: {
        backgroundColor: "white",
        padding: rMs(16),
        justifyContent: "center",
        alignContent: "center",
    },
    dropdown: {
        height: rVs(40),
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: rVs(10),
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: rs(12),
        fontWeight: '400'
    },
    selectedTextStyle: {
        fontSize: rs(12),
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    input: {
        height: rVs(40),
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: rVs(5),
        paddingHorizontal: rMs(10),
        borderRadius: 8,
        marginTop: rVs(25),
        width: '90%',
        marginLeft: rMs(20),
    },
    btn: {
        width: "50%",
        padding: rVs(15),
        backgroundColor: "#FFA600",
        borderRadius: 99,
        textAlign: "center",
        alignItems: "center",
        marginTop: rVs(50),
        marginLeft: rMs(90),
        fontFamily: 'Montserrat'
    },
    errortext: {
        color: "red",
        textAlign: "center",
    },
    flexstyle: {
        flex: 1,
        backgroundColor: 'white',
        height: '100%',
    }
});
