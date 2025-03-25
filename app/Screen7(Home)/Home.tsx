import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Animated,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Share,
  Modal,
  Button,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { GetUsersapi } from '@/Network/Api';
import { rs, rVs } from '@/Styles/Responsive';
import { StatusBar } from 'expo-status-bar';
import emailjs from 'emailjs-com';
import CustomLoader from '../Screen11/CustomLoader';

const { width, height } = Dimensions.get('window');

const Home = ({ route, navigation }) => {
  const { USERID,results } = route.params || {}
  const [userData, setUserData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [likedProfiles, setLikedProfiles] = useState<any>({});
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<any>(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [comments, setComments] = useState<any>([]);
  const [newComment, setNewComment] = useState<any>('');

  // refresh
  const [refreshing, setRefreshing] = useState(false);

  // Report Modal
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReports, setSelectedReports] = useState<any>([]);
  const [checkboxStates, setCheckboxStates] = useState<any>({
    harssing: false,
    spamming: false,
    fraud: false,
  });

  // Flip Animation State
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Flip Animation
  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  // Flip Interpolation
  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const getData = useCallback(async (page) => {
    const datatoken = await AsyncStorage.getItem('jwtToken');

    if (!datatoken) {
      Alert.alert('Token Not Found', 'Please Login Again');
      return;
    }

    try {
      const response = await axios.get(GetUsersapi, {
        params: {
          pageNumber: page,
          pageSize: 1,
        },
        headers: {
          Authorization: `Bearer ${datatoken}`,
          'Content-Type': 'application/json',
        },
      });

      const fetchedData = response.data.results;
      console.log('Fetched Data:', fetchedData);
      setTotalPages(response.data.totalPages);
      setUserData((prevData: any[]) => {
        const existingIds = new Set(prevData.map((profile) => profile.userId)); 
        const newProfiles = fetchedData.filter((profile: { id: any; }) => !existingIds.has(profile.userId)); 
        return [...prevData, ...newProfiles]; 
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      Alert.alert('MarryUp','Please come back later.')
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getData(currentPage);
    }, [currentPage, getData])
  );

  const handleEndReached = () => {
    if (currentPage < totalPages) {
      console.log(`Current Page: ${currentPage}, Total Pages: ${totalPages}`);
      setCurrentPage((prev) => prev + 1);
    }
  };
  // 
  const handleLike = async (userId) => {
    const isLiked = likedProfiles[userId] || false;
    setLikedProfiles({ ...likedProfiles, [userId]: !isLiked });
    console.log(userId)
    // try {
    //   await axios.post(`https://yourapi.com/profile/${userId}/like`, { liked: !isLiked });
    // } catch (error) {
    //   console.error('Error updating like:', error);
    // }  
  };

  const handleSave = async (profile) => {
    if (!profile || !profile.userId) {
      Alert.alert('Error', 'Invalid profile data');
      console.log('Invalid profile data:', profile);
      return;
    }
    // 
    setSavedProfiles((prev) =>
      prev.some((saved) => saved.userId === profile.userId)
        ? prev.filter((saved) => saved.userId !== profile.userId)
        : [...prev, profile]
    );
    
    // 
    try {
      let storedProfiles = await AsyncStorage.getItem('savedProfiles');
      console.log('Stored Profiles from AsyncStorage:', storedProfiles);

      let profiles = storedProfiles ? JSON.parse(storedProfiles) : [];
      if (Array.isArray(profiles)) {
        if (!profiles.some((savedProfile) => savedProfile.userId === profile.userId)) {
          profiles.push(profile);
          await AsyncStorage.setItem('savedProfiles', JSON.stringify(profiles));
          Alert.alert('Success', 'Profile saved successfully!');
        } else {
          Alert.alert('Already Saved', 'This profile is already in your saved list.');
        }
      } else {
        console.error('Error: storedProfiles is not an array. Resetting to empty array.');
        await AsyncStorage.setItem('savedProfiles', JSON.stringify([profile]));
        Alert.alert('Success', 'Profile saved successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Check the console for more details.');
    }
    // try {
    //   await axios.post(`https://yourapi.com/profile/${userId}/save`, { saved: !isSaved });
    // } catch (error) {
    //   console.error('Error updating save:', error);
    // }
  };


  const openCommentBox = async (profile: { id: any; }) => {
    setCurrentProfile(profile);
    setCommentBoxVisible(true);
    try {
      const response = await axios.get(`https://yourapi.com/profile/${profile.id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    const commentData = { text: newComment, profileId: currentProfile.id };

    try {
      await axios.post(`https://yourapi.com/profile/${currentProfile.id}/comment`, commentData);
      setComments([...comments, commentData]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  const filteredProfiles = !USERID ? userData:userData.filter((profile) => profile.userId === USERID) ;
  // const filteredProfiles = USERID && !refreshing ? userData.filter((profile) => profile.userId === USERID) : userData;

  // refreshing
  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setCurrentPage(15);
    setUserData([]);
    await getData(currentPage);
    setRefreshing(false);
  };
  const handleShare = async (profile) => {
    try {
      const result = await Share.share({
        message: ` 
        Check out I found a profile for you on MarryUp App:
        Name: ${profile.firstName} ${profile.lastName}
        Age: ${profile.age || 'N/A'}
        Location: ${profile.city}, ${profile.state || 'N/A'}
        Occupation: ${profile.occupation || 'N/A'}
        About Me: ${profile.aboutMe || 'N/A'}
        
        Download the app to see the profile!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Profile shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleReport = (profile: any) => {
    setReportModalVisible(true);
    setCurrentProfile(profile);

  };

  const sendReport = () => {
    const templateParams = {
      user_id: currentProfile,
      report_category: selectedReports,
    };


    emailjs
      .send('service_zrp7n08', 'template_7hvlx9l', templateParams, 'xngP_o5K8s1_S5hap')
      .then((response) => {
        console.log('Email sent successfully!', response);
        Alert.alert("Report Sent" ,`Thank you for reporting ,we'll review your report and remove the profile if its voilating the guidelines`);
        setSelectedReports([]);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        Alert.alert('Error', 'Failed to send the report.');
      });
    
    setReportModalVisible(false);
    
  };

  const handleCheckboxChange = (report: string) => {
    setCheckboxStates((prevState) => {
      const newState = { ...prevState, [report]: !prevState[report] };
      const newSelectedReports = newState[report]
        ? [...selectedReports, report]
        : selectedReports.filter((item) => item !== report);
      setSelectedReports(newSelectedReports);
      return newState;
    });
    console.log(selectedReports)
  };
  if (isLoading) {
    return (
      <CustomLoader  visible={isLoading} message='Fetching Users'/>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='black' style="dark"/>
      <FlatList
        data={filteredProfiles}
        removeClippedSubviews={true}
        windowSize={5}
        keyExtractor={(item, index) => `user-${index}`}
        renderItem={({ item }) => (
          <><TouchableWithoutFeedback onPress={flipCard}>
            <View style={styles.profileCard}>
              {/* Front View (Profile Image) */}
              <Animated.View style={[styles.cardFront, frontAnimatedStyle]}>
                <ImageBackground
                  source={item.profilePictureUrl
                    ? { uri: item.profilePictureUrl }
                    : require('@/assets/images/Default.jpeg')}
                  style={styles.profileImage}
                  resizeMode="cover"
                  progressiveRenderingEnabled={true}
                  onLoad={isLoading}
                >
                  <View style={styles.overlay}>
                    <View style={styles.namecard}>
                    <Text style={styles.name}>{item.firstName}, {item.age || 'N/A'}</Text>
                    <Text style={styles.detail}>{item.gender || 'N/A'}</Text>
                    <Text style={styles.detail}>{item.education || 'N/A'}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </Animated.View>

              {/* Back View (Detailed Profile Info) */}
              <Animated.View style={[styles.cardBack, backAnimatedStyle]}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                  <Text style={styles.sectionDetail}>Height: {item.height || 'N/A'}</Text>
                  <Text style={styles.sectionDetail}>Religion: {item.religion || 'N/A'}</Text>
                  <Text style={styles.sectionDetail}>Primary language: {item.motherTongue || 'N/A'}</Text>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Hobbies and Interests</Text>
                  <Text style={styles.sectionDetail}>{item.hobbiesAndInterests || 'No hobbies shared'}</Text>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Family Background</Text>
                  <Text style={styles.sectionDetail}>{item.familyDetails || 'N/A'}</Text>
                  {/* <Text style={styles.sectionDetail}>Mother: {userData.motherOccupation || 'N/A'}</Text>
                    <Text style={styles.sectionDetail}>Siblings: {userData.siblings || 'N/A'}</Text> */}
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Partner Preferences</Text>
                  <Text style={styles.sectionDetail}>Location Preference: {item.preferredPartnerLocation || 'N/A'}</Text>
                  <Text style={styles.sectionDetail}>Religion Preference : {item.preferredPartnerReligion || 'N/A'}</Text>
                  <Text style={styles.sectionDetail}>Other Preferences: {item.preferredPartnerAgeRange || 'No specific preferences shared'}
                  </Text>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
            <View style={styles.buttonsContainer}>
              {/* Like Button */}
              <TouchableOpacity onPress={() => handleLike(item.userId)} style={{ marginBottom: 15 }}>
                <Ionicons name={likedProfiles[item.userId] ? 'heart' : 'heart-outline'} size={35} color={likedProfiles[item.userId] ? 'red' : 'white'} />
              </TouchableOpacity>

              {/* Comment Button */}
              <TouchableOpacity onPress={() => openCommentBox(item)} style={{ marginBottom: 15 }}>
                <Feather name="message-circle" size={34} color="white" />
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity onPress={() => handleSave(item)} style={{ marginBottom: 15 }}>
                <FontAwesome name={savedProfiles[item.userId] ? 'bookmark' : 'bookmark-o'} size={32} color="white" />
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity onPress={() => handleShare(item)} style={{ marginBottom: 15 }}>
                <FontAwesome name="share" size={28} color="white" />
              </TouchableOpacity>

              {/* Report Button */}
              <TouchableOpacity onPress={() => handleReport(item.userId)} style={{ marginBottom: 15 }}>
                <Feather name="alert-triangle" size={28} color="red" />
              </TouchableOpacity>
            </View>
          </>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#FFA600" /> : null}
        contentContainerStyle={{ paddingBottom: 10 }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Modal screen*/}
      <Modal
        visible={reportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}> Report this Profile </Text>
            <View>
              {['Harmful Content ', 'Sexual Content ', 'Spam or Fraud ','Harassment or Bullying '].map((report) => (
                <View key={report} style={styles.checkboxContainer}>
                  <TouchableOpacity
                    onPress={() => handleCheckboxChange(report)}
                    style={styles.checkbox}
                  >
                    {checkboxStates[report] ? (
                      <MaterialIcons name="check-box" size={24} color="black" />
                    ) : (
                      <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.checkboxText}>{ report.charAt(0).toUpperCase() + report.slice(1)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.sendButton,{ opacity: selectedReports.length === 0 ? 0.5 : 1 }]}
          onPress={sendReport}
          disabled={selectedReports.length === 0 }
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setReportModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    fontSize: rs(14),
    fontWeight: 'bold',
    color: '#555',
  },
  profileCard: {
    width: width,
    height: height * 0.9,
    marginBottom: 5,
    overflow: 'hidden',
    flex: 1,

  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: width * 0.05,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  namecard:{
    marginBottom:20
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  detail: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  cardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between',
    // alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileDetails: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA600',
  },
  sectionDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  buttonsContainer: {
    position: 'absolute',
    right: 20,
    bottom: height*-0.0,
    alignItems: 'center',
    height:'40%',
    justifyContent:'space-evenly',
    marginBottom:30
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    maxHeight: '70%',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  checkboxWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'flex-start', 
  },
  checkbox: {
    marginRight: 15,
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '45%',
  },
  sendButton: {
    backgroundColor: '#0095f6', 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e1e1e1', 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Home;
