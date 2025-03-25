import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { rMs, rs, rVs } from '@/Styles/Responsive'; 
import { LinearGradient } from 'expo-linear-gradient';

const GetStarted = ({ navigation }) => {
  const nav = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#FFB900" barStyle="light-content" />
      {/* Gradient background */}
      <LinearGradient
        colors={['#FFB900', '#A02334']}
        style={styles.mainContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.subcontain}>
          <Text style={styles.headingText}>Find your Special Someone </Text>
          <Text style={styles.subHeadingText}>Best App To Find Your Loved Ones </Text>
          <TouchableOpacity style={styles.btn} onPress={nav}>
            <Text style={styles.btnText}> Let's Get Started </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcontain: {
    width: '100%',
    height: '70%',
    marginTop: rMs(100), 
    borderTopLeftRadius: rMs(30),
    borderTopRightRadius: rMs(30),
    padding: rMs(20),
    justifyContent: 'flex-end',
   
  },
  headingText: {
    fontSize: rs(32),
    color: '#F1C27D', 
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
    marginTop: rVs(10),
    fontFamily: 'OpenSans', 
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
});
