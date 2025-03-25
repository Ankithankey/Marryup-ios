import { View, Text, Image, StatusBar, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { rMs, rs, rVs } from '@/Styles/Responsive';
import { casteOptions } from '@/components/UsersOPtionsData';
import { Dropdown } from 'react-native-element-dropdown';

const UserCaste = ({ route, navigation }) => {
    const [caste, setcaste] = useState('');
    const [subcaste, setsubcaste] = useState('');
    const [error, setError] = useState<string | null | false>(null);
    const [isFocus, setIsFocus] = useState(false);
    const [casteList, setCasteList] = useState([]);
    const {age, MotherTongue, Religionvalue, Countryvalue, password, email } = route.params || {};
    console.log('Route params:', route.params);

    const handelNext = () => {
        setTimeout(() => {
            setError(false);
        }, 2000);
        if (!caste) {
            setError("Enter the caste");
            return;
        } else {
            navigation.navigate('UserState', {age, Religionvalue, MotherTongue, Countryvalue, caste, password, email, subcaste });
        }
    }
    useEffect(() => {
        // On religion change, update caste options
        if (Religionvalue && casteOptions[Religionvalue]) {
            setCasteList(casteOptions[Religionvalue]);
        }
    }, [Religionvalue]);

    return (
        <KeyboardAvoidingView style={styles.flexstyle} behavior='padding' enabled={true}>
            <SafeAreaView>
                <View>
                    <StatusBar backgroundColor="#452c63" barStyle="light-content" />
                    <View style={styles.img}>
                        <Image source={require('../../assets/images/div.png')} style={{ marginTop: rVs(20), height: rs(80), width: rs(80), tintColor: 'green' }} />
                    </View>
                    <Text style={{ marginTop: rVs(5), fontSize: rs(18), fontWeight: '900', marginLeft: rMs(5), textAlign: 'center', color: 'gray' }}>Let us know</Text>
                    <View style={{ marginTop: rVs(50), justifyContent: 'center', marginLeft: rMs(10) }}>
                        <Text style={styles.labell}>Caste</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={casteList} 
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select Caste' : '...'}
                            searchPlaceholder="Search..."
                            value={caste}
                            onChange={item => setcaste(item.value)}
                        />
                        {error && <Text style={styles.errortext}>{error}</Text>}
                        <Text style={styles.label2}>SubCaste</Text>
                        <TextInput
                            editable={true}
                            inputMode='text'
                            maxLength={15}
                            style={[styles.input, isFocus && { borderColor: 'black' }]}
                            value={subcaste}
                            onChangeText={setsubcaste}
                            placeholder="Enter SubCaste"
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                        />
                        <TouchableOpacity style={styles.btn} onPress={handelNext}>
                            <View><Text style={{ textAlign: 'center', fontSize: rs(12), color: 'white', width: 80 }}>Continue</Text></View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default UserCaste;

const styles = StyleSheet.create({
    img: {
        alignItems: 'center',
    },
    labell: {
        marginBottom: rVs(10),
        fontSize: rs(22),
        marginLeft: rMs(10),
        marginTop: rVs(5),
    },
    label2: {
        marginBottom: rVs(10),
        fontSize: rs(22),
        marginLeft: rMs(15),
        marginTop: rVs(30),
    },
    input: {
        height: rVs(40),
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: rVs(5),
        paddingHorizontal: rMs(10),
        borderRadius: 8,
        width: '99%',
        marginTop: rVs(20),
    },
    btn: {
        width: '50%',
        padding: rVs(15),
        backgroundColor: '#452c63',
        borderRadius: 99,
        textAlign: 'center',
        alignItems: 'center',
        marginTop: rVs(150),
        marginLeft: rMs(80),
        fontFamily:'Montserrat'
    },
    errortext: {
        color: 'red',
        marginLeft: rMs(10),
        fontSize:rs(12)
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
        paddingHorizontal: rs(8),
        marginTop: rVs(15),
    },
    icon: {
        marginRight: rs(5),
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: rs(22),
        top: rs(8),
        zIndex: 999,
        paddingHorizontal: rs(8),
        fontSize: rs(12),
    },
    placeholderStyle: {
        fontSize: rs(12),
    },
    selectedTextStyle: {
        fontSize: rs(12),
    },
    iconStyle: {
        width: rs(20),
        height: rs(20),
    },
    inputSearchStyle: {
        height: rVs(30),
        fontSize: rs(12),
    },
});
