import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity, ScrollView, ImageBackground, Animated } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

const { width, height } = Dimensions.get('window');
const URL = "https://nrimarriage.in/api/v1/Users/GetUsers";

const UIDesign = ({ navigation }) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [swipeHandled, setSwipeHandled] = useState(false);

  const heartOpacity = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  const animateHeart = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heartOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(heartScale, {
          toValue: 1.5,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      heartScale.setValue(0);
    });
  };

  const getData = useCallback(async (page) => {
    const datatoken = await AsyncStorage.getItem('jwtToken');
    if (!datatoken) {
      Alert.alert('Token Not Found', 'Please Login Again');
      return;
    }

    try {
      const response = await axios.get(URL, {
        params: {
          pageNumber: page,
          pageSize: 1,
        },
        headers: {
          'Authorization': `Bearer ${datatoken}`,
          'Content-Type': 'application/json',
        },
      });

      const filteredData = response.data.results;
      if (filteredData.length > 0) {
        setUserData(filteredData[0]);
        setTotalPages(response.data.totalPages);
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert('Session Expired', 'Your session has expired. Please login again.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('An unknown error occurred.');
      }
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getData(currentPage);
    }, [currentPage, getData])
  );

  const handleGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;
  
      if (Math.abs(translationX) > 100) {
        if (translationX > 0) {
          setCurrentPage((prev) => Math.max(1, prev - 1)); 
        } else {
          setCurrentPage((prev) => Math.min(totalPages, prev + 1));
        }
      }
  };

  

  const handleCancel = () => {setCurrentPage((prev) => Math.min(totalPages, prev + 1))};
  const handleChat = () => Alert.alert('Chat', 'Upgrade to premium.');
  const handleHeart = () => {
    animateHeart();
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="red" size="large" style={{ marginTop: height / 2 }} />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noDataText}>No user data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PanGestureHandler onGestureEvent={handleGestureEvent} activeOffsetX={[-50, +50]} activeOffsetY={[-100, +1000]}>
        <View>
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.profileCard}>
              <ImageBackground
                source={
                  userData.profilePictureUrl
                    ? { uri: userData.profilePictureUrl }
                    : require('@/assets/images/Default.jpeg')
                }
                style={styles.profileImage}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={styles.name}>{userData.firstName}, {userData.age || 'N/A'} </Text>
                  <Text style={styles.detail}>{userData.gender || 'N/A'}</Text>
                  <Text style={styles.detail}>{userData.education || 'N/A'}</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.buttonopt}>
              <TouchableOpacity style={styles.optionButton} onPress={handleCancel}>
                <View style={styles.circularButton}>
                  <MaterialIcons name="close" size={28} color="red" />
                </View>
                <Text style={styles.buttonLabel}>Dislike </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={handleChat}>
                <View style={styles.circularButton}>
                  <MaterialIcons name="chat" size={28} color="#F1C27D" />
                </View>
                <Text style={styles.buttonLabel}>Chat </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={handleHeart}>
                <View style={styles.circularButtonn}>
                  <MaterialIcons name="check" size={28} color="green" />
                </View>
                <Text style={styles.buttonLabel}> Like </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <Text style={styles.sectionDetail}>Height: {userData.height || 'N/A'}</Text>
              <Text style={styles.sectionDetail}>Religion: {userData.religion || 'N/A'}</Text>
              <Text style={styles.sectionDetail}>Languages Known: {userData.motherTongue || 'N/A'}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Hobbies and Interests</Text>
              <Text style={styles.sectionDetail}>{userData.hobbies || 'No hobbies shared'}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Family Background</Text>
              <Text style={styles.sectionDetail}>Father: {userData.fatherOccupation || 'N/A'}</Text>
              <Text style={styles.sectionDetail}>Mother: {userData.motherOccupation || 'N/A'}</Text>
              <Text style={styles.sectionDetail}>Siblings: {userData.siblings || 'N/A'}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Partner Preferences</Text>
              <Text style={styles.sectionDetail}>Age Range: {userData.partnerAgeRange || 'N/A'}</Text>
              <Text style={styles.sectionDetail}>Height Preference: {userData.partnerHeight || 'N/A'}</Text>
              <Text style={styles.sectionDetail}>Other Preferences: {userData.partnerPreferences || 'No specific preferences shared'}</Text>
            </View>
          
          </ScrollView>
        </View>
      </PanGestureHandler>
      <Animated.View
        style={[
          styles.heartContainer,
          {
            opacity: heartOpacity,
            transform: [{ scale: heartScale }],
          },
        ]}
      >
        <MaterialIcons name="favorite" size={100} color="#FFB900" />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    height: '100%',
    
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  profileCard: {
    width: '100%',
    height: height * 0.7,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily:'BodoniModa'
  },
  detail: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#E40000',
    marginBottom: 8,
    fontFamily:'OpenSans'
  },
  sectionDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  buttonopt: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  circularButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor: '#E40000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularButtonn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: height / 2,
    color: 'red',
    fontSize: 18,
  },
  heartContainer: {
    position: 'absolute',
    top: height / 2 - 300,
    left: width / 2 - 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UIDesign;
