import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Alert, TouchableOpacity, Share, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { loggedinuserapi } from '@/Network/Api';
import { rMs, rs, rVs } from '@/Styles/Responsive';
import CustomLoader from '../Screen11/CustomLoader';
import { StatusBar } from 'expo-status-bar'

const UserProfileDetails = ({ navigation }) => {
  const [isloading, setisloading] = useState(true);
  const [UserData, SetUserData] = useState<any>('');
  const {
    firstName,
    lastName,
    city,
    state,
    age,
    maritalStatus,
    profilePictureUrl,
    phoneNumber,
    country,
    religion,
    caste,
    subCaste,
    height,
    weight,
    motherTongue,
    education,
    occupation,
    annualIncome,
    aboutMe,
    hobbiesAndInterests,
    preferredPartnerAgeRange,
    preferredPartnerReligion,
    preferredPartnerCaste,
    preferredPartnerLocation,
  } = UserData;

  const getdata = useCallback(async () => {
    const datatoken = await AsyncStorage.getItem('jwtToken');
    if (!datatoken) {
      Alert.alert('Token Not Found', 'Please Login Again');
      return;
    }
    try {
      const response = await axios.get(loggedinuserapi, {
        headers: {
          Authorization: `Bearer ${datatoken}`,
          'Content-Type': 'application/json',
        },
      });
      SetUserData(response.data);
      setisloading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Alert.alert('Session Expired', 'Your session has expired. Please login again.', [
            {
              text: 'Logout',
              onPress: () => navigation.navigate('Login'),
            },
          ]);
        }
      } else {
        Alert.alert('An unknown error occurred.');
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getdata();
    }, [getdata])
  );
  // 
  const handleShare = async () => {
    try {
      const shareMessage = `
        Check out my profile on MarryUp App:
        Name: ${firstName} ${lastName}
        Age: ${age || 'N/A'}
        Location: ${city}, ${state || 'N/A'}
        Occupation: ${occupation || 'N/A'}
        About Me: ${aboutMe || 'N/A'}
        
        Download the app to connect with me!
      `;

      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the profile at the moment.');
    }
  }

  return (
    <LinearGradient
      colors={['#FFB900', '#A02334']}
      style={styles.mainContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {isloading ? (
        <CustomLoader  visible={isloading} message='Marry Up'/>
      ) : (
        <>
           
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}>
            <StatusBar style="dark" translucent = {true}/>
            <TouchableOpacity onPress={() => navigation.navigate("UserProfileImage", { isEdit: true })}>
              <Image
                source={profilePictureUrl ? { uri: profilePictureUrl } : require('../../assets/images/noImage.png')}
                style={styles.profileImage}

              />
              <MaterialIcons name="photo-camera" size={30} color="white" style={styles.cameraIcon} />
              </TouchableOpacity>
              <Text style={styles.profileName}>
                {firstName} {lastName}
              </Text>
              <Text style={styles.occupation} onPress={() => navigation.navigate('UserWorkDetails', { isEdit: true })}>{occupation}</Text>
              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={24} color="#FF5733" />
                <Text style={styles.location} onPress={() => navigation.navigate('UserState', { isEdit: true })}>
                  {city}, {state}
                </Text>
              </View>
              {/* <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditUserProfileDetails')}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity> */}
              {/* Share Button */}
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Text style={styles.shareButtonText}>Share Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Sections */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Basic Info</Text>
              <InfoRow label="Age" value={age} onEdit={() => navigation.navigate('EditUserProfileDetails')} />
              <InfoRow label="Marital Status" value={maritalStatus} onEdit={() => navigation.navigate('UserMartialDetails', { isEdit: true })} />
              <InfoRow label="Phone Number" value={phoneNumber} onEdit={() => navigation.navigate('EditUserProfileDetails')} />
              <InfoRow label="Height" value={height} onEdit={() => navigation.navigate('UserMartialDetails', { isEdit: true })} />
              <InfoRow label="Weight" value={weight} onEdit={() => navigation.navigate('UserMartialDetails', { isEdit: true })} />
              <InfoRow label="Primary Language" value={motherTongue} onEdit={() => navigation.navigate('EditUserProfileDetails')} />
              {/* <InfoRow label="Disability" value="None" onEdit={undefined} /> */}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Religious Background</Text>
              <InfoRow label="Religion" value={religion} onEdit={() => navigation.navigate('EditUserProfileDetails')} />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>About Myself</Text>
              <TouchableOpacity onPress={() => aboutMe !== 'Enter now' &&  navigation.navigate("UserAboutDetails", { isEdit: true })}>
                <Text style={styles.aboutText}>
                  {aboutMe || 'Enter now'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Education & Career</Text>
              <InfoRow label="Country" value={country} onEdit={() => navigation.navigate(() => navigation.navigate('UserState', { isEdit: true }))} />
              <InfoRow label="Highest Qualification" value={education} onEdit={() => navigation.navigate("UserEducationDetails", { isEdit: true })} />
              <InfoRow label="Occupation" value={occupation} onEdit={() => navigation.navigate('UserWorkDetails', { isEdit: true })} />
              <InfoRow label="Annual Income" value={annualIncome} onEdit={() => navigation.navigate('UserWorkDetails', { isEdit: true })} />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Hobbies & Interests</Text>
              <TouchableOpacity onPress={() => hobbiesAndInterests !== 'Enter now' && navigation.navigate("UserAboutDetails", { isEdit: true })}>
                <Text style={styles.aboutText}>
                  {hobbiesAndInterests || 'Enter now'}
                </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Partner Preferences</Text>
              <InfoRow label="Preferred Age Range" value={preferredPartnerAgeRange} onEdit={() => navigation.navigate("Partners_Details")} />
              <InfoRow label="Religion" value={preferredPartnerReligion} onEdit={() => navigation.navigate('Partners_Details')} />
              {/* <InfoRow label="Caste" value={preferredPartnerCaste} onEdit={() => navigation.navigate('EditUserProfileDetails')} /> */}
              <InfoRow label="Location" value={preferredPartnerLocation} onEdit={() => navigation.navigate('Partners_Details')} />
            </View>
          </ScrollView>
        </>
      )}
    </LinearGradient>
  );
};

const InfoRow = ({ label, value, onEdit }) => (

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    {value && value !== 'Enter now' && value !== 'N/A' ? (
      <Text style={styles.infoValue}>{value}</Text>
    ) : (
      <Pressable onPress={onEdit} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
        <Text style={styles.enterNowLink}>Enter now</Text>
      </Pressable>
    )}
  </View>
);

export default UserProfileDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: rMs(10),
    paddingBottom: rMs(20),
    borderBottomWidth: 1,
    borderBottomColor: '#B76E79',
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#FFA600',
    marginBottom: rVs(5),
  },
  profileName: {
    fontSize: rs(28),
    color: '#FFA600',
    marginBottom: rVs(5),
    fontFamily: 'BodoniModa',
  },
  occupation: {
    fontSize: rs(18),
    color: 'white',
    marginBottom: rVs(8),
    fontFamily: 'OpenSans',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rVs(10),
  },
  location: {
    fontSize: rs(14),
    color: 'white',
    marginLeft: 5,
    fontFamily: 'OpenSans',
  },
  editButton: {
    marginTop: rMs(5),
    backgroundColor: '#FFA600',
    paddingVertical: rMs(8),
    paddingHorizontal: rMs(10),
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: rs(14),
    fontFamily: 'Montserrat',
  },
  sectionContainer: {
    paddingHorizontal: rMs(30),
    paddingVertical: rMs(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2E9',
    backgroundColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: rs(18),
    fontWeight: '600',
    color: '#E40000',
    marginBottom: rVs(10),
    fontFamily: 'OpenSans',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: rVs(10),
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: rs(14),
    color: '#777',
    fontFamily: 'OpenSans',
  },
  infoValue: {
    fontSize: rs(12),
    color: '#333',
    fontFamily: 'Montserrat',
    flexShrink: 1,
    paddingLeft: 10,
    textAlign: 'right',
  },
  aboutText: {
    fontSize: rs(13),
    color: '#333',
    lineHeight: 22,
    fontFamily: 'OpenSans',
    textAlign: 'justify',
  },
  shareButton: {
    marginTop: rVs(10),
    backgroundColor: '#FF5733',
    paddingVertical: rMs(8),
    paddingHorizontal: rMs(10),
    borderRadius: 5,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: rs(14),
    fontFamily: 'Montserrat',
  },
  enterNowLink: {
    fontSize: rs(12),
    color: '#007BFF',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat'
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFA600',
    borderRadius: 50,
    padding: 5,
  },
});
