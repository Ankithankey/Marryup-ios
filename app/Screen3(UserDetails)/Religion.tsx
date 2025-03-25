import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { rMs, rs, rVs } from '@/Styles/Responsive'; // Assuming you've defined these scaling functions

const URL = "https://nrimarriage.in/api/v1/Users/GetUsers";

const UIDesign = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelToken, setCancelToken] = useState(null);  // To hold cancel token

  const getData = useCallback(async (page) => {
    const datatoken = await AsyncStorage.getItem('jwtToken');
    const loggedInUserName = await AsyncStorage.getItem('loggedInUserName');
    
    if (!datatoken) {
      Alert.alert('Token Not Found', 'Please Login Again');
      return;
    }

    // Cancel any previous API request
    if (cancelToken) {
      cancelToken.cancel('Request canceled due to a new request.');
    }

    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken);

    try {
      const response = await axios.get(URL, {
        params: {
          pageNumber: page,
          pageSize: 1, // Fetch one profile at a time
        },
        headers: {
          'Authorization': `Bearer ${datatoken}`,
          'Content-Type': 'application/json',
        },
        cancelToken: newCancelToken.token, // Attach the cancel token
      });

      const filteredData = response.data.results.filter(
        (user) => `${user.firstName} ${user.lastName}` !== loggedInUserName
      );

      if (filteredData.length > 0) {
        setUserData(filteredData[0]);
        setTotalPages(response.data.totalPages);
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Alert.alert('Session Expired', 'Your session has expired. Please login again.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
          ]);
        } else if (axios.isCancel(error)) {
          // Handle request cancellation (do nothing)
        } else {
          Alert.alert('An unknown error occurred.');
        }
      } else {
        Alert.alert('An error occurred.');
      }
    }
  }, [cancelToken, navigation]);

  // Fetch the first profile when the component mounts or page changes
  useEffect(() => {
    if (currentPage <= totalPages && currentPage > 0) {
      getData(currentPage);
    } else {
      Alert.alert('Invalid Page', 'The requested page number is out of bounds.');
    }
  }, [currentPage, getData, totalPages]);

  const handleGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;
    if (Math.abs(translationX) > 100) {
      if (translationX > 0) {
        setCurrentPage(prev => Math.max(1, prev - 1)); // Swipe right
      } else {
        setCurrentPage(prev => Math.min(totalPages, prev + 1)); // Swipe left
      }
    }
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Reset gesture state when the swipe ends
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="red" size="large" style={{ marginTop: rVs(200) }} />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No user data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <View style={[styles.profileCard, { width: rMs(350) }]}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={userData.profilePictureUrl ? { uri: userData.profilePictureUrl } : require('@/assets/images/noImage.png')}
              style={[styles.profileImage, { width: rMs(350), height: rMs(420) }]}
            />

            {/* Name and Age Overlay on the Profile Image */}
            <View style={styles.profileNameAgeContainer}>
              <Text style={[styles.name, { fontSize: rs(18) }]}>
                {userData.firstName}, {userData.age || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Profile Details */}
          <View style={styles.detailsContainer}>
            <Text style={[styles.subDetails, { fontSize: rs(14) }]}>{userData.gender || 'N/A'}</Text>
            <Text style={[styles.subDetails, { fontSize: rs(14) }]}>{userData.education || 'N/A'}</Text>
          </View>

          {/* About Me Section */}
          <View style={styles.aboutMeContainer}>
            <Text style={[styles.aboutMeHeader, { fontSize: rs(18) }]}>About me</Text>
            <View style={styles.tagsContainer}>
              {userData.tags && userData.tags.length > 0 ? (
                userData.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))
              ) : (
                <Text>No tags available</Text>
              )}
            </View>
          </View>

          {/* Know More Button at the bottom of the profile card */}
          <TouchableOpacity style={[styles.knowMoreButton, { width: rMs(350) }]} onPress={openModal}>
            <Text style={[styles.knowMoreText, { fontSize: rs(16) }]}>Know More</Text>
          </TouchableOpacity>
        </View>
      </PanGestureHandler>

      {/* Modal to Show User Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, { width: rMs(360) }]}>
            <ScrollView>
              <Text style={[styles.modalTitle, { fontSize: rs(24) }]}>
                {userData.firstName} {userData.lastName}
              </Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Age: {userData.age}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Gender: {userData.gender}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Religion: {userData.religion}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Caste: {userData.caste}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>City: {userData.city}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Country: {userData.country}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Email: {userData.email}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Phone Number: {userData.phoneNumber || 'N/A'}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Occupation: {userData.occupation}</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Height: {userData.height} cm</Text>
              <Text style={[styles.modalDetail, { fontSize: rs(16) }]}>Annual Income: {userData.annualIncome}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.smallKnowMoreButton} onPress={closeModal}>
              <Text style={styles.knowMoreText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: rMs(16),
  },
  profileCard: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: rVs(2) },
    shadowOpacity: 0.1,
    shadowRadius: rVs(6),
    elevation: 5,
    marginTop: rVs(20),
  },
  imageContainer: {
    position: 'relative',
    height: rVs(420),
  },
  profileImage: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  profileNameAgeContainer: {
    position: 'absolute',
    bottom: rVs(10),
    left: rMs(10),
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: rMs(10),
  },
  subDetails: {
    color: '#333',
    marginBottom: rVs(4),
  },
  aboutMeContainer: {
    padding: rMs(10),
  },
  aboutMeHeader: {
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    padding: rMs(5),
    margin: rMs(4),
    borderRadius: rMs(12),
  },
  tagText: {
    fontSize: rs(14),
  },
  knowMoreButton: {
    backgroundColor: '#007BFF',
    paddingVertical: rVs(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rMs(8),
  },
  knowMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: rMs(10),
    padding: rMs(20),
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: rVs(10),
  },
  modalDetail: {
    marginVertical: rVs(4),
  },
  smallKnowMoreButton: {
    backgroundColor: '#ff6347',
    paddingVertical: rVs(12),
    borderRadius: rMs(8),
    marginTop: rVs(20),
    alignItems: 'center',
  },
});

export default UIDesign;
