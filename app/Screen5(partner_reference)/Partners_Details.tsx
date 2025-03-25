import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Alert, KeyboardAvoidingView, } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profileapi } from '@/Network/Api';
import { LinearGradient } from 'expo-linear-gradient';
import { rs, rVs } from '@/Styles/Responsive';

const Partners_Details = ({ navigation }) => {
  const [pAge, setpAge] = useState('');
  const [preligion, setpreligion] = useState('');
  const [pcaste, setpcaste] = useState('');
  const [plocation, setplocation] = useState('');
  const [Error, setError] = useState<any>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await axios.get(Profileapi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setpAge(data.preferredPartnerAgeRange || '');
        setpreligion(data.preferredPartnerReligion || '');
        setpcaste(data.preferredPartnerCaste || '');
        setplocation(data.preferredPartnerLocation || '');
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch partner details.');
        console.log('Error fetching data:', error.message);
      }
    };

    fetchPartnerDetails();
  }, []);

  const handleNext = async () => {
    const data = {
      PreferredPartnerAgeRange: pAge,
      PreferredPartnerReligion: preligion,
      PreferredPartnerCaste: pcaste,
      PreferredPartnerLocation: plocation,
    };

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      await axios.put(Profileapi, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Updated successfully');
      navigation.navigate('People');
    } catch (error) {
      Alert.alert('Error', `Error sending data: ${error.message}`);
      console.log('Error updating profile:', error.response?.data?.message || error.message);
    }

    if (!pAge || !preligion || !pcaste || !plocation) {
      setError('Please enter all fields to update.');
    } else {
      setError(null);
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={styles.flexstyle} behavior="padding" enabled={true}>
        <SafeAreaView>
          <StatusBar backgroundColor="#FFA600" barStyle="default" />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.headerContainer}>
              <StatusBar backgroundColor="#FFA600" barStyle="dark-content" />
              <LinearGradient
                colors={['#FFA600', '#FFD27F', 'white']}
                style={styles.gradientStyle}
              >
                <View style={styles.img}>
                  <Image
                    source={require('@/assets/images/div.png')}
                    style={{ marginTop: 40, height: 80, width: 80 }}
                  />
                </View>

                <Text style={styles.headerTitle}>
                  Partner Preference
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.container}>
              {/* Age Input */}
              <Text style={styles.label}>Age</Text>
              <TextInput
                editable
                inputMode="tel"
                keyboardType="number-pad"
                style={styles.input}
                value={pAge}
                onChangeText={(text) => {
                  setpAge(text);
                  setError(null); // Clear error when user starts typing
                }}
                placeholder="Enter Age you prefer"
                maxLength={2}
              />
              {Error && <Text style={styles.errorText}>{Error}</Text>}

              {/* Religion Input */}
              <Text style={styles.labeldob}>Religion</Text>
              <TextInput
                editable
                keyboardType="default"
                style={styles.input}
                value={preligion}
                onChangeText={(text) => {
                  setpreligion(text);
                  setError(null);
                }}
                placeholder="Enter Religion you prefer"
              />
              {Error && <Text style={styles.errorText}>{Error}</Text>}

              {/* Caste Input */}
              {/* <Text style={styles.labeldob}>Caste</Text>
        <TextInput
          editable
          keyboardType="default"
          style={styles.input}
          value={pcaste}
          onChangeText={(text) => {
            setpcaste(text);
            setError(null);
          }}
          placeholder="Enter Caste you prefer"
        /> */}
              {/* {Error && <Text style={styles.errorText}>{Error}</Text>} */}

              {/* Location Input */}
              <Text style={styles.labeldob}>Location</Text>
              <TextInput
                editable
                keyboardType="default"
                style={styles.input}
                value={plocation}
                onChangeText={(text) => {
                  setplocation(text);
                  setError(null);
                }}
                placeholder="Enter Preferred Location"
              />
              {Error && <Text style={styles.errorText}>{Error}</Text>}

              {/* Update Button */}
              <TouchableOpacity style={styles.btn} onPress={handleNext}>
                <Text style={{ textAlign: 'center', fontSize: 17, color: 'white', width: 80 }}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

    </>
  );
};

export default Partners_Details;

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
  container: {
    padding: 20,
    justifyContent: 'center',
    marginTop: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 26,
    marginLeft: 1,
    marginTop: 10,
  },
  labeldob: {
    marginBottom: 10,
    fontSize: 30,
    marginLeft: 1,
    marginTop: 50,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 20,
    padding: 10,
    fontSize: 14,
  },
  img: {
    height: 150,
    alignItems: 'center',
  },
  btn: {
    width: '50%',
    padding: 10,
    backgroundColor: '#FFA600',
    borderRadius: 99,
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 100,
  },
  flexstyle: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
  },
  errorText: {
    color: "red"
  }
});
