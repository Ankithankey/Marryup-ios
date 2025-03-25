import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale as rMs, scale as rs, verticalScale as rVs } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = ({ navigation }) => {
  const checkIfLoggedIn = async () => {
    const dataToken = await AsyncStorage.getItem('jwtToken');
    if (!dataToken) {
      return navigation.navigate('GetStarted');
    }
   navigation.navigate('BottomNavigator');
  };
  

  useEffect(() => {
    setTimeout(() => {
      checkIfLoggedIn();
    }, 2000);
  }, []);

  return (
    <LinearGradient
      colors={['#FFB900', '#A02334']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar backgroundColor="#FFB900" barStyle="light-content" />
      <Animatable.Text
        style={styles.welcomeText}
        duration={2000}
        animation="zoomIn"
      >
        MarryUp
      </Animatable.Text>
      <Animatable.Text
        style={styles.tagline}
        duration={2000}
        animation="fadeIn"
        delay={500}
      >
        Find your perfect match
      </Animatable.Text>
      <Text style={styles.footerText}>
        © 2025 MarryUp. All Rights Reserved.
      </Text>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: rs(30),
    fontWeight: 'bold',
    color: '#FFA600',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: "BodoniModa",
    textShadowColor: '#B76E79',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    width: rs(500),
  },
  tagline: {
    fontSize: rs(12),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: rVs(8),
    width: rs(500),
  },
  footerText: {     
    fontSize: rs(10),     
    color: '#FFFFFF',     
    textAlign: 'center',     
    position: 'absolute',  
    bottom: rVs(20),  
    width: '100%',  
    paddingHorizontal: rs(20),
  }
});
