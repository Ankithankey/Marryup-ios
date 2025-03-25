import { SetStateAction, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Animated, SafeAreaView, Dimensions, StatusBar, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, ScrollView, Platform, Keyboard, Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { rMs, rs, rVs } from '@/Styles/Responsive';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import PhoneInput from 'react-native-international-phone-number';
import { Registrationapi } from "@/Network/Api";
import CustomLoader from "../Screen11/CustomLoader";


const Genderr = [
  { label: 'Male', GenderValue: 'Male' },
  { label: 'Female', GenderValue: 'Female' },
  { label: 'Prefer not to say', GenderValue: 'Prefer not to say' }
];
const Reg = [
  { label: 'Guardian',RegValue: 'Guardian' },
  { label: 'Self',RegValue: 'Self' },
 
];

const width = Dimensions.get('window').width
const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [Firstname, setFirstname] = useState('');
  const [Lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null | false>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [Gender, setGender] = useState<any>(null);
  const [age, setAge] = useState<number | null>(null);
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [country, setcountry] = useState('');
  const [Religion, setReligion] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>({
    callingCode: "+91",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ReG, setReG] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  // password visible
  const [passwordVisible, setPasswordVisible] = useState(false);
  // Animation states
  const [firstNameFocus] = useState(new Animated.Value(1));
  const [lastNameFocus] = useState(new Animated.Value(1));
  const [emailFocus] = useState(new Animated.Value(1));
  const [passwordFocus] = useState(new Animated.Value(1));
  const [PhoneNumberFocus] = useState(new Animated.Value(1));
  const [countryFocus] = useState(new Animated.Value(1));
  const [ReligionFocus] = useState(new Animated.Value(1));
  const [GenderFocus] = useState(new Animated.Value(1));
  const [RegFocus] = useState(new Animated.Value(1));
  //  focus animation
  const handleFocus = (animatedValue: Animated.Value | Animated.ValueXY) => {
    Animated.timing(animatedValue, {
      toValue: 1.5,
      duration: 300,
      useNativeDriver: false
    }).start();
    setError(null);
  };

  //  blur animation
  const handleBlur = (animatedValue: Animated.Value | Animated.ValueXY) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false
    }).start();
  };
  // ===========PhoneNumber======
  function handleSelectedCountry(country: any) {
    setSelectedCountry(country);
  };
  const fullPhoneNumber = `${selectedCountry.callingCode}${PhoneNumber}`;

  // ========================================================
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  // coverting date object to string 
  const formattedDate = dob.toDateString();

  // Function to calculate age
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };
  //  date change
  const formattedDob = dob.toISOString().split('T')[0]; 
  const handleDateChange = (event: { type: string }, selectedDate?: Date) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || dob;
      setDob(currentDate);
      setShowDatePicker(false);
      const newAge = calculateAge(currentDate);
      setAge(newAge);
    } else {
      setShowDatePicker(false);
    }
  };

  //  date picker
  const showDateSelector = () => {
    setShowDatePicker(true);
  };

  const handleRegister = async () => {

    setError(null);

    if (!Firstname || !Lastname || !email || !password || !PhoneNumber || !dob || !Gender || !Religion || !country||!ReG) {
      setError("Please fill in all the required fields.");
      return;
    }

    const namePattern = /^[a-zA-Z\s-]+$/;
    if (!namePattern.test(Firstname) || !namePattern.test(Lastname)) {
      setError("Invalid Firstname or Lastname");
      return;
    }

    const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailValidate.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const passwordValidate = /^.{8,15}$/;
    if (!passwordValidate.test(password)) {
      setError("Password must be between 8 and 15 characters.");
      return;
    }

    const PhoneNumberValidate = /^.{12}$/;
    if (!PhoneNumberValidate.test(PhoneNumber)) {
      setError("Incorrect phone number.");
      return;
    }
    if (age === null || age < 18) {
      Alert.alert('Failed to Register', "You must be at least 18 years old to register.")
      return;
    }

    const data = {
      Email: email,
      Password: password,
      FirstName: Firstname,
      LastName: Lastname,
      Gender: Gender,
      DateOfBirth: formattedDob,
      phoneNumber: fullPhoneNumber,
      Country: country,
      Religion: Religion,
      RegisteredBy:ReG

    };

    console.log(data);
    setIsLoading(true);
    try {
      const response = await axios.post(Registrationapi, data);
   
      console.log(response.data);
      setIsLoading(false);
      Alert.alert('Registerionsucess', response.data.message, [
        {
          text: 'Login',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const errorMessage = error.response.data.message;
          setError(errorMessage);
          console.log(error.response.data);
        } else {
          setError("No response from the server. Please try again later.");
          
        }
      } else {
        setError("An unknown error occurred.");
        
      }
    }
    setTimeout(() => {
      setError(null);
    }, 2000);
  };
  const openTermsOfService = () => {
    // navigation.navigate('PrivacyPolicy')
    Linking.openURL('https://nrimarriage.in/terms');
  };
  const handleCheckboxChange = () => {
    setTermsAccepted(!termsAccepted);
  };
  const goToLogin = () => {
    navigation.navigate('Login');
  };
  return (
    <LinearGradient
      colors={['#FFB900', '#A02334']}
      style={styles.mainContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior="padding"
      >
      {isLoading&&<CustomLoader  visible={isLoading}/>}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <SafeAreaView>
              <StatusBar backgroundColor="#FFB900" barStyle="light-content" />
              <View>
                <View style={styles.subcontain}>
                  <Text style={styles.headingText}>REGISTER</Text>
                  <Text style={styles.subHeadingText}> Create your account </Text>
                  {/* First Name Input */}
                  <View style={styles.mainInputContainer}>

                    <View style={[styles.inputContainer]}>
                      <Animated.View style={{ transform: [{ scale: firstNameFocus }] }}>
                        <MaterialIcons name="person" size={16} color="black" />
                      </Animated.View>
                      <TextInput
                        inputMode="text"
                        maxLength={15}
                        onChangeText={setFirstname}
                        placeholder="FirstName"
                        style={styles.TextInput}
                        value={Firstname}
                        placeholderTextColor='black'
                        onFocus={() => handleFocus(firstNameFocus)}
                        onBlur={() => handleBlur(firstNameFocus)}
                      />
                    </View>

                    {/* Last Name Input */}
                    <View style={styles.inputContainer}>
                      <Animated.View style={{ transform: [{ scale: lastNameFocus }] }}>
                        <MaterialIcons name="person" size={16} color="black" />
                      </Animated.View>
                      <TextInput
                        inputMode="text"
                        maxLength={15}
                        onChangeText={setLastname}
                        placeholder="Lastname"
                        placeholderTextColor='black'
                        style={styles.TextInput}
                        value={Lastname}
                        onFocus={() => handleFocus(lastNameFocus)}
                        onBlur={() => handleBlur(lastNameFocus)}

                      />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                      <Animated.View style={{ transform: [{ scale: emailFocus }] }}>
                        <MaterialIcons name="email" size={16} color="black" />
                      </Animated.View>
                      <TextInput
                        inputMode="email"
                        keyboardType="email-address"
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor='black'
                        style={styles.TextInput}
                        value={email}
                        onFocus={() => handleFocus(emailFocus)}
                        onBlur={() => handleBlur(emailFocus)}
                        autoCapitalize="none"
                      />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                      <Animated.View style={{ transform: [{ scale: passwordFocus }] }}>
                        <MaterialIcons name="lock" size={16} color="black" />
                      </Animated.View>
                      <TextInput
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry={!passwordVisible}
                        style={styles.TextInput}
                        value={password}
                        inputMode="text"
                        placeholderTextColor='black'
                        maxLength={20}
                        onFocus={() => handleFocus(passwordFocus)}
                        onBlur={() => handleBlur(passwordFocus)}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={{ paddingHorizontal: 10 }}
                      >
                        <MaterialIcons
                          name={passwordVisible ? "visibility" : "visibility-off"}
                          size={16}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Phone Input */}
                    <PhoneInput
                      value={PhoneNumber}
                      placeholder="PhoneNumber"
                      onChangePhoneNumber={setPhoneNumber}
                      selectedCountry={selectedCountry}
                      onChangeSelectedCountry={handleSelectedCountry}
                      style={styles.TextInput}
                      placeholderTextColor='black'
                      defaultCountry="IN"
                      allowZeroAfterCallingCode={false}
                      phoneInputStyles={{
                        container: {
                          alignItems: 'center',
                          backgroundColor: '#fff',
                          paddingVertical: 5,
                          paddingLeft: 15,
                          marginBottom: 15,
                          borderRadius: 5,
                          elevation: 3,
                          width: width - 40,
                          height: rVs(38),
                        },
                        flagContainer: {
                          height: 30,
                          width: 100,
                          backgroundColor: 'white',
                        },
                        flag: {
                          fontSize: 16
                        },
                        caret: {
                          fontSize: 16,
                        },
                        callingCode: {
                          fontSize: 16,
                          fontWeight: 'bold',
                        },
                        input: {
                          fontSize: 16,
                        },
                      }}
                    />

                    {/* Country Input */}
                    <View style={styles.inputContainer}>
                      <Animated.View style={{ transform: [{ scale: countryFocus }] }}>
                        <MaterialIcons name="map" size={16} color="black" />
                      </Animated.View>
                      <TextInput
                        inputMode="text"
                        keyboardType="default"
                        onChangeText={setcountry}
                        placeholder="Country"
                        placeholderTextColor='black'
                        style={styles.TextInput}
                        value={country}
                        onFocus={() => handleFocus(countryFocus)}
                        onBlur={() => handleBlur(countryFocus)}


                      />
                    </View>
                    {/* Religion Input */}
                    <View style={styles.inputContainer}>
                      <Animated.View style={{ transform: [{ scale: ReligionFocus }] }}>
                        <MaterialIcons name="church" size={16} color="black" />
                      </Animated.View>
                      <TextInput
                        inputMode="text"
                        keyboardType="email-address"
                        onChangeText={setReligion}
                        placeholder="Religion"
                        placeholderTextColor='black'
                        style={styles.TextInput}
                        value={Religion}
                        onFocus={() => handleFocus(ReligionFocus)}
                        onBlur={() => handleBlur(ReligionFocus)}
                       
                      />
                    </View>
                    {/* Gender */}
                    <View>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        dropdownPosition='auto'
                        data={Genderr}
                        maxHeight={300}
                        labelField="label"
                        valueField="GenderValue"
                        placeholder={!isFocus ? 'Gender' : '...'}
                        value={Gender}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setGender(item.GenderValue);
                          setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                          <Animated.View style={{ transform: [{ scale: GenderFocus }] }}>
                            <MaterialIcons name="people" size={16} color="black" />
                          </Animated.View>
                        )}
                        renderRightIcon={() => (
                          <Animated.View style={{ transform: [{ scale: GenderFocus }] }}>
                            <MaterialIcons name="arrow-drop-down" size={25} color="black" />
                          </Animated.View>)}

                      />
                    </View>
                    {/* Date of birth */}
                    <View style={{ width: '100%' }}>
                      <TouchableOpacity style={styles.DobBtn} onPress={showDateSelector}>
                        <Feather name="calendar" size={16} color='black' />
                        <Text style={{ fontSize: rs(12), paddingLeft: rMs(10), color: 'black', width: rMs(200) }}> {age ? formattedDate : 'Date of birth'} </Text>
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={dob}
                          mode="date"
                          display="inline"
                          onChange={handleDateChange}
                          maximumDate={new Date()}

                        />
                      )}
                    </View>
                    <View>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}

                        dropdownPosition='auto'

                        data={Reg}
                        maxHeight={300}
                        labelField="label"
                        valueField="RegValue"
                        placeholder={!isFocus ? 'Registered by' : '...'}
                        value={ReG}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setReG(item.RegValue);
                          setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                          <Animated.View style={{ transform: [{ scale: RegFocus }] }}>
                            <MaterialIcons name="app-registration" size={16} color="black" />
                          </Animated.View>
                        )}
                        renderRightIcon={() => (
                          <Animated.View style={{ transform: [{ scale: RegFocus }] }}>
                            <MaterialIcons name="arrow-drop-down" size={25} color="black" />
                          </Animated.View>)}

                      />
                    </View>
                    {/*  */}
                  </View>
                  {/* Terms of Service Checkbox */}
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={handleCheckboxChange} style={styles.checkbox}>
                      {termsAccepted && <MaterialIcons name="check-box" size={24} color="white" />}
                      {!termsAccepted && <MaterialIcons name="check-box-outline-blank" size={24} color="white" />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}>
                      By signing up, you agree to our <Text style={styles.term} onPress={openTermsOfService}>Terms of services</Text> and that you have read our <Text style={styles.term} onPress={openTermsOfService}>Privacy Policy</Text> and <Text style={styles.term} onPress={openTermsOfService}> End Users Licence Agreement.</Text>
                    </Text>
                  </View>
                  {error && <Text style={{ color: 'red', fontSize: rs(14), fontWeight: '600', marginTop: rVs(20) }}>{error}</Text>}
                  <TouchableOpacity style={[
                    styles.btn,
                    { backgroundColor: termsAccepted ? '#FFA600' : 'gray' }, 
                  ]} onPress={handleRegister} disabled={!termsAccepted}>
                    <Text style={{ textAlign: 'center', fontSize: rs(14), color: 'white', width: rs(80) }}>REGISTER</Text>
                  </TouchableOpacity>
                  <View style={{ marginTop: rVs(35) }}>
                    <Text onPress={goToLogin} style={styles.loginText}>
                      Already Have an Account? <Text style={styles.loginLink}>Login Here</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

export default Register

const styles = StyleSheet.create({
  mainInputContainer: {
    width: '100%',
    marginTop: 30
  },
  headingText: {
    color: 'white',
    fontSize: rVs(30),
    fontFamily: 'BodoniModa',
    // marginBottom: 10,
  },
  subHeadingText: {
    color: '#fff',
    fontSize: rVs(12),
    // marginBottom: 10,
    fontFamily: 'OpenSans',
  },
  inputContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: '#fff',
    // paddingVertical:rs(0),
    paddingLeft: 15,
    // marginBottom: 15,
    borderRadius: 5,
    elevation: 3,
    width: width - 40,
    height: rVs(38),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rVs(8),
    borderBottomWidth: rs(1),
    borderBottomColor: '#000',
    paddingBottom: rVs(5),
  },
  TextInput: {
    flex: 1,
    marginLeft: rs(10),
    color: '#0C2340',
    paddingVertical: rVs(8),
    // textAlignVertical: 'center'
  },
  btn: {
    width: '40%',
    padding: rVs(12),
    backgroundColor: '#FFA600',
    borderRadius: rMs(99),
    marginTop: rVs(10),
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: 'Montserrat'
  },
  mainimg: {
    // flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#E40000'
  },
  subcontain: {
    paddingHorizontal: rMs(12),
    paddingVertical: rVs(10),
    alignItems: 'center',
    borderRadius: rMs(20),
  },
  dropdown: {
    height: rVs(38),
    // width: '100%',
    padding: rs(5),
    marginBottom: rVs(16),
    borderBottomWidth: rs(1),
    borderBottomColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingLeft: 15,
    // marginBottom: 15,
    borderRadius: 5,
    elevation: 3,
    width: width - 40,
  },
  label: {
    position: 'absolute',
    left: rs(22),
    top: rVs(8),
    zIndex: 999,
    paddingHorizontal: rs(8),
    fontSize: rs(14),
  },
  placeholderStyle: {
    fontSize: rs(12),
    color: '#0C2340',
    paddingLeft: rs(8),
  },
  selectedTextStyle: {
    fontSize: rs(12),
    paddingLeft: rs(10),
  },
  DobBtn: {
    borderBottomWidth: rs(1),
    borderColor: '#0C2340',
    height: rVs(38),
    paddingLeft: rs(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    marginBottom: 15,
    borderRadius: 5,
    elevation: 3,
    width: width - 40,
  },
  flexstyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  loginText: {
    fontSize: rs(12),
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans'
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#FFA600',
    fontSize: rs(14),
    fontFamily: 'OpenSans'
  },

  keycontainer: {
    // flex: 1,
    height: '100%',
    // backgroundColor: '#E40000'

  },
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: 'center',
    // paddingHorizontal: 16,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 5,
  },
  checkboxText: {
    fontSize: rVs(10),
    color: 'white',
  },
  term: {
    fontWeight: 'bold',
    color: '#FFA600',
    fontSize: rs(10),
    fontFamily: 'OpenSans'
  }

});
