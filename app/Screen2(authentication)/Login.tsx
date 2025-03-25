import { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, StatusBar, Animated, Modal, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { rMs, rs, rVs } from '@/Styles/Responsive';
import { Loginapi, ForgotPasswordApi } from "@/Network/Api"; 
import CustomLoader from "../Screen11/CustomLoader";



const Login = ({ navigation }) => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState<string | null | false>(null);
  const [emailError, setEmailError] = useState<any>(false);
  const [passwordError, setPasswordError] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);


  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailFocus] = useState(new Animated.Value(1));
  const [passwordFocus] = useState(new Animated.Value(1));

  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  // otp verficition
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newpasssec, setnewpasssec] = useState(false);
  const [merr, setmerr] = useState<any>(false)


  const handleFocus = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setError(null);
  };

  const handleBlur = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handelLogin = async () => {
    setError(null);
    setEmailError(false);
    setPasswordError(false);

    if (!email && !password) {
      setEmailError('Please enter your email address.');
      setPasswordError('Please enter your password.');
      resetErrorStates();
      return;
    }
    if (!email) {
      setEmailError('Please enter your email address.');
      resetErrorStates();
      return;
    }
    if (!password) {
      setPasswordError('Please enter your password.');
      resetErrorStates();
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(Loginapi, {
        email,
        password,
      });

      const { token, userId } = response.data;
      console.log(response.data)
      await AsyncStorage.setItem('UserId', String(userId))
      await AsyncStorage.setItem('jwtToken', token);
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomNavigator' }],
      });
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log(error.response.data.message)
          setError(error.response.data.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(ForgotPasswordApi, {
        email: forgotEmail,
      });
      setIsLoading(false);
    
      Alert.alert('MarryUp','OTP has been sent to your email to reset your password.');
      setIsOtpVerified(true)
      // setForgotPasswordModalVisible(false); 

    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setmerr('An error occurred. Please try again.');
      } else {
        setmerr('An unexpected error occurred.');
      }
    }
  };
  // fun
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://nrimarriage.in/api/v1/users/VerifyOTP', {
        email: forgotEmail,
        otp,
      });
      setIsLoading(false);
      Alert.alert('OTP verified. You can now reset your password.')
      setServerResponse('OTP verified. You can now reset your password.');
      setnewpasssec(true)
    } catch (err) {
      setIsLoading(false);
      console.log(err.response.data.message)
      setmerr('Error verifying OTP. Please try again.');
    }


  };

  // Function
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setmerr('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('https://nrimarriage.in/api/v1/users/ResetPassword', {
        email: forgotEmail,
        otp,
        newPassword,
      });
      setIsLoading(false);
      Alert.alert('Password reset successful!')
      setServerResponse('Password reset successful!');
      console.log(response.data.success)
      setmerr('');
      setIsOtpVerified(false);
      setnewpasssec(false);
      setForgotPasswordModalVisible(false);
      setOtp('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setIsLoading(false);
      setmerr('Error resetting password. Please try again.');
      console.log(err.response.data.message)
    }
    console.log(forgotEmail, otp, newPassword)
  }
  const resetErrorStates = () => {
    setTimeout(() => {
      setEmailError(false);
      setPasswordError(false);
      setError(false);
      setmerr(false)
      setIsOtpVerified(false)
    }, 2000);
  };

  const handelregister = () => {
    navigation.navigate('Register');
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        {isLoading && <CustomLoader visible={isLoading} />}
        <StatusBar backgroundColor="#FFB900" barStyle="light-content" />
        <LinearGradient
          colors={['#FFB900', '#A02334']}
          style={styles.mainContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.subcontain}>
            <Text style={styles.headingText}>Welcome back</Text>
            <Text style={styles.subHeadingText}>Login to your account</Text>

            {/* Email Input */}
            <View style={[styles.inputContainer, emailError && styles.errorBorder]}>
              <Animated.View style={{ transform: [{ scale: emailFocus }] }}>
                <MaterialIcons name="email" size={rs(16)} color="#fff" />
              </Animated.View>
              <TextInput
                inputMode="email"
                keyboardType="email-address"
                onChangeText={setemail}
                placeholder={emailError || "Email"}
                placeholderTextColor={emailError ? '#FF4C4C' : '#fff'}
                style={styles.textInput}
                value={email}
                onFocus={() => handleFocus(emailFocus)}
                onBlur={() => handleBlur(emailFocus)}
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputContainer, passwordError && styles.errorBorder]}>
              <Animated.View style={{ transform: [{ scale: passwordFocus }] }}>
                <MaterialIcons name="lock" size={rs(16)} color="#fff" />
              </Animated.View>
              <TextInput
                onChangeText={setpassword}
                placeholder={passwordError || "Password"}
                placeholderTextColor={passwordError ? '#FF4C4C' : '#fff'}
                secureTextEntry={!passwordVisible}
                style={styles.textInput}
                value={password}
                maxLength={20}
                onFocus={() => handleFocus(passwordFocus)}
                onBlur={() => handleBlur(passwordFocus)}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{ paddingHorizontal: 5 }}
              >
                <MaterialIcons
                  name={passwordVisible ? "visibility" : "visibility-off"}
                  size={16}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            {/* Forgot Password Link */}
            <TouchableOpacity onPress={() => setForgotPasswordModalVisible(true)}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.btn} onPress={handelLogin}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          <Text onPress={handelregister} style={styles.registerText}>
            Don’t have an account? <Text style={styles.registerLink}> Sign Up </Text>
          </Text>

          {/* Forgot Password Modal */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={forgotPasswordModalVisible}
          // onRequestClose={onclose}
          >
            <StatusBar barStyle="dark-content" />
            <View style={styles.modalOverlay}>
              <LinearGradient
                colors={['#FFB900', '#A02334']}
                style={styles.modalContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalHeading}>Reset Your Password</Text>

                  {/* Email Input (visible first) */}
                  {!isOtpVerified ? (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChangeText={setForgotEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      {merr && <Text style={styles.errorText}>{merr}</Text>}
                      <TouchableOpacity onPress={handleForgotPassword} style={styles.actionButton}>
                        <Text style={styles.actionButtonText}> Reset Password </Text>
                      </TouchableOpacity>
                      {/* {serverResponse && <Text style={styles.successText}>{serverResponse}</Text>} */}
                    </>
                  ) : (
                    <>
                      {/* OTP Input */}
                      <TextInput
                        style={styles.input}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                        maxLength={6}
                      />
                      <TouchableOpacity onPress={handleVerifyOtp} style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Verify OTP</Text>
                      </TouchableOpacity>
                      {/* {serverResponse && <Text style={styles.successMessage}> {serverResponse} </Text>} */}
                    </>
                  )}

                  {/* new pass */}
                  {newpasssec ? (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={true}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                      />
                      <TouchableOpacity onPress={handleResetPassword} style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Reset Password</Text>
                      </TouchableOpacity>
                    </>
                  ) : null}

                  {/* Close Button */}
                  <TouchableOpacity onPress={() => setForgotPasswordModalVisible(false)} style={styles.closeButton}>
                    <MaterialIcons name="close" size={28} color="white" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </Modal>
        </LinearGradient>
      </View>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcontain: {
    width: '100%',
    height: '60%',
    marginTop: rMs(80),
    borderTopLeftRadius: rMs(30),
    borderTopRightRadius: rMs(30),
    padding: rMs(20),
    justifyContent: 'flex-end',
  },
  headingText: {
    fontSize: rs(30),
    color: '#FFA600',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'BodoniModa',
    marginBottom: rVs(10),
    textShadowColor: '#B76E79',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subHeadingText: {
    fontSize: rs(16),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: rVs(2),
    fontFamily: 'OpenSans',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: rMs(8),
    marginVertical: rVs(15),
    paddingHorizontal: rMs(8),
    width: rs(320),
    height: rVs(40),
  },
  errorBorder: {
    borderColor: '#FF4C4C',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: rMs(8),
    height: rVs(20),
    fontSize: rs(13),
    color: '#fff',
  },
  errorText: {
    color: '#FF4C4C',
    fontSize: rs(12),
    fontWeight: '600',
  },
  btn: {
    padding: rMs(15),
    backgroundColor: '#FFA600',
    borderRadius: rMs(30),
    marginTop: rVs(25),
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnText: {
    textAlign: 'center',
    fontSize: rs(14),
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  forgotPasswordText: {
    fontSize: rs(12),
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans',
    marginLeft: rVs(220),
  },
  frgtbtn: {
    padding: rMs(15),
    backgroundColor: '#FFA600',
    borderRadius: rMs(30),
    marginTop: rVs(20),
    width: '60%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  frgtbtnText: {
    textAlign: 'center',
    fontSize: rs(10),
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  registerText: {
    fontSize: rs(12),
    color: 'white',
    textAlign: 'center',
    marginTop: rVs(80),
    fontFamily: 'OpenSans',
  },
  registerLink: {
    fontWeight: 'bold',
    color: '#FFA600',
    fontSize: rs(14),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  modalContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    marginTop: 30
  },
  actionButton: {
    backgroundColor: '#FFB900',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: -280,
    right: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },

  successMessage: {
    color: '#fff',
    marginTop: 20,
  },
});

