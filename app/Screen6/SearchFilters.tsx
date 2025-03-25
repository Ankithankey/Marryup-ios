import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import {

  countryOptions,
  languageOptions,
  maritalStatusOptions,
} from '@/components/SearchfilterData';
import { SearchProfilesapi } from '@/Network/Api';
import DisplaySearchedProfiles from './DisplaySearchedProfiles';
import CustomLoader from '../Screen11/CustomLoader';

const SearchFilters = ({ navigation }) => {
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(30);
  const [minHeight, setMinHeight] = useState(5);
  const [maxHeight, setMaxHeight] = useState(6);
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [motherTongue, setMotherTongue] = useState('');
  const [country, setCountry] = useState('India');
  const [search, SetSearch] = useState('');
  const [result, setResults] = useState('');
  const [loading, setLoading] = useState(false);

  const minHeightCm = Math.round(minHeight * 30.48);
  const maxHeightCm = Math.round(maxHeight * 30.48);
  const handleSearch = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      console.log(token)
      if (!token) {
        setLoading(false);
        Alert.alert('Error', 'User is not authenticated. Please log in.');
        return;
      }

      const requestBody = {
        PageNumber: "1",
        PageSize: "10",
        AgeRange: `${minAge}-${maxAge}`,
        height: `${minHeightCm}-${maxHeightCm}`,
        Country: country,
        MaritalStatus: maritalStatus,
      };

      console.log('Request Body:', requestBody);

      const response = await fetch(SearchProfilesapi, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('API Response search:', data);

        // Ensure results array exists
        // if (!data.Results || data.Results.length === 0) {
        //   setLoading(false);
        //   Alert.alert('No Results', 'No profiles found matching the criteria.');
        //   return;
        // }
        setResults(data); 
        console.log('joshva',result)
        setLoading(false);
        navigation.navigate('For You', {
          results: data.results,
          totalPages: data.pageSize,
        });
        console.log('ankith',data.results)
      } else {
        console.error('Error Response:', data);
        setLoading(false);
        Alert.alert('Error', data.title || 'Something went wrong with the search.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      Alert.alert('Error', 'We could not fetch results at this time.');
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
       {loading&&<CustomLoader  visible={loading} message='only For you'/>}
      <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" backgroundColor='black' translucent = {true}/>
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Refine Your Search</Text>

          {/* Search Input */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              value={search}
              onChangeText={SetSearch}
              placeholder="Search by Name or Keyword"
              placeholderTextColor="#bbb"
            />
          </View>

          {/* Age Range */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Age Range</Text>
            <View style={styles.rangeWrapper}>
              <Text style={styles.rangeText}>Min: {minAge} yrs</Text>

            </View>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={100}
              step={1}
              value={minAge}
              minimumTrackTintColor="#FFA600"
              thumbTintColor="#FFA600"
              onValueChange={(val) => setMinAge(val)}
            />
            <Text style={styles.rangeText}>Max: {maxAge} yrs</Text>
            <Slider
              style={styles.slider}
              minimumValue={minAge}
              maximumValue={100}
              step={1}
              value={maxAge}
              minimumTrackTintColor="#FFA600"
              thumbTintColor="#FFA600"
              onValueChange={(val) => setMaxAge(val)}
            />
          </View>

          {/* Height Range */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Height Range</Text>
            <Text style={styles.rangeText}>Min Height: {minHeight} ft</Text>
            <Slider
              style={styles.slider}
              minimumValue={4.9}
              maximumValue={9.8}
              step={0.1}
              value={minHeight}
              onValueChange={(val) => setMinHeight(parseFloat(val.toFixed(1)))}
              minimumTrackTintColor="#FFA600"
              thumbTintColor="#FFA600"
            />

            {/* Max Height Slider */}
            <Text style={styles.rangeText}>Max Height: {maxHeight} ft</Text>
            <Slider
              style={styles.slider}
              minimumValue={4.9}
              maximumValue={9.8}
              step={0.1}
              value={maxHeight}
              onValueChange={(val) => setMaxHeight(parseFloat(val.toFixed(1)))}
              minimumTrackTintColor="#FFA600"
              thumbTintColor="#FFA600"
            />
          </View>
          {/*  */}
          {[
            { label: 'Marital Status', value: maritalStatus, setValue: setMaritalStatus, options: maritalStatusOptions },
            // { label: 'Religion', value: religion, setValue: setReligion, options: religionOptions },
            // { label: 'Community', value: community, setValue: setCommunity, options: communityOptions },
            { label: 'Prefered language', value: motherTongue, setValue: setMotherTongue, options: languageOptions },
            { label: 'Country', value: country, setValue: setCountry, options: countryOptions },
          ].map((picker, index) => (
            <View style={styles.card} key={index}>
              <Text style={styles.cardTitle}>{picker.label}</Text>
              <Picker
                selectedValue={picker.value}
                onValueChange={(itemValue) => picker.setValue(itemValue)}
                style={styles.picker}
              >
                {picker.options.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          ))}
          {/*  */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default SearchFilters;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    // fontWeight: 'bold',
    color: '#A02334',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: "BodoniModa"
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    height:'auto'
  },
  cardTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'OpenSans'
  },
  rangeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rangeText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat'
  },
  slider: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'OpenSans'
  },
  picker: {
    height: '15%',
    width: '80%',
    // justifyContent:'center',
    // alignItems:'center'
    paddingTop:10,
    paddingLeft:50

  },
  searchButton: {
    backgroundColor: '#FFA600',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  searchButtonText: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat'
  },
});


