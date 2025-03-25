import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScreenWidth = Dimensions.get('window').width;

const DisplaySearchedProfiles = ({ route }) => {
  const { results = {}, totalPages = 5, searchCriteria } = route.params || {};
  const { results: initialProfiles = [] } = results;
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [data, setData] = useState(initialProfiles);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [noResults, setNoResults] = useState(false);

  // Fetch profiles based on search criteria
  const fetchProfiles = async (page) => {
    if (loading) return;

    setLoading(true);
    setNoResults(false); 
    const datatoken = await AsyncStorage.getItem('jwtToken');
    try {
      const response = await axios.get(`https://nrimarriage.in/api/v1/Users/GetUsers`, {
        params: {
          pageNumber: page,
        },
        headers: {
          'Authorization': `Bearer ${datatoken}`,
          'Content-Type': 'application/json'
      }
      });
      if (response.data.results && response.data.results.length > 0) {
        setProfiles(response.data.results);
        setData(response.data.results);
      } else {
        setNoResults(true); 
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(currentPage);
  }, [currentPage, searchCriteria]);

  // const calculateAge = (dateOfBirth: string | number | Date) => {
  //   if (!dateOfBirth) return 'N/A';
  //   const birthDate = new Date(dateOfBirth);
  //   const today = new Date();
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDiff = today.getMonth() - birthDate.getMonth();
  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age;
  // };
  const renderItem = ({ item }) => {
    console.log(item)
    // const age = calculateAge(item.dateOfBirth);
    return (
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false} indicatorStyle='white'>
          <View style={styles.cardcontainer}>
            {item.profilePictureUrl ? (
              <Image source={{ uri: item.profilePictureUrl }} style={styles.profileImage} />
             
            ) : (
              <Image source={require('../../assets/images/Default.jpeg')} style={styles.profileImage} />
            )}
            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 30, color: '#001',}}>
                      {item.firstName} {item.lastName} </Text>
            <Text  style={{ fontSize: 16, textAlign: 'center', paddingTop: 4, color: '#001',}} > Age:({item.age||'N/A'}) </Text>

            <TouchableOpacity style={styles.btn} onPress={() => handleViewDetails(item)}>
              <Text style={{ textAlign: 'center', fontSize: 14, color: 'white', width: 100 }}> Connect Now </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>  
    );
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setOpenModal(true);
};
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E40000" barStyle="light-content" />
      <Text style={styles.title}> For You </Text>
      {loading && currentPage === 1 ? (
         <View style={styles.loader}>
         <ActivityIndicator size="large" color="#452c63" />
         <Text> Please wait...  </Text>
       </View>
      ) : noResults ? (
        <Text style={styles.noResults}>User not found</Text>
      ) : (
        <FlatList
          data={profiles.slice(0, currentPage * itemsPerPage)} 
          keyExtractor={(item) => item.userId.toString()}
          renderItem={renderItem}
          ListFooterComponent={loading ?  <View style={styles.loader}>
          <ActivityIndicator size="large" color="#452c63" />
          <Text> Please wait...  </Text>
        </View>: null}
        />
      )}
      {/* Pagination Controls for filtered Matches */}
      <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20,
          }}>
              <TouchableOpacity
                onPress={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }} 
                disabled={currentPage === 1}
                  style={{ padding: 10, backgroundColor: '#E40000', borderRadius: 5 ,width:80,alignItems:'center',}}
              >
                  <Text style={{color:"white"}}> Previous </Text>
              </TouchableOpacity>

              <Text> Page {currentPage} of {totalPages} </Text>

              <TouchableOpacity
                  onPress={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }} 
                  disabled={currentPage === totalPages}
                  style={{ padding: 10, backgroundColor: '#E40000', borderRadius: 5 ,width:80,alignItems:'center'}}
              >
                  <Text  style={{color:"white"}}> Next </Text>
              </TouchableOpacity>
          </View>    
          <Modal visible={openModal} animationType='slide' transparent={true}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 15, width: '100%', borderRadius: 10, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {selectedUser && (
                                <>
                                      {selectedUser.profilePictureUrl ? 
                                                    <Image
                                                        source={{ uri: selectedUser.profilePictureUrl}}
                                                        resizeMode='cover'
                                                        style={styles.images} />
                                                        :
                                                        <Image
                                                        source={require('../../assets/images/Default.jpeg')}
                                                        resizeMode='cover'
                                                        style={styles.images} />}
                                    <Text style={styles.item}>Name: {selectedUser.firstName }{selectedUser.lastName }  </Text>
                                    <Text style={styles.item}>Email: {selectedUser.email|| ''} </Text>
                                    <Text style={styles.item}>Address: {selectedUser.address|| ''} </Text>
                                    <Text style={styles.item}>State: {selectedUser.state|| ''} </Text>
                                    <Text style={styles.item}>Country: {selectedUser.country|| ''} </Text>
                                    <Text style={styles.item}>Phone: {selectedUser.phoneNumber|| ''} </Text>
                                </>
                            )}
                            <TouchableOpacity style={styles.btn} onPress={() => setOpenModal(false)}>
                                <Text style={{ textAlign: 'center', color: 'white' }}> Close </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
</View>);
};

export default DisplaySearchedProfiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign:'center',
   
  },
  noResults: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  cardcontainer: {
    height: 450,
    backgroundColor: '#D3D3D3',
    width: ScreenWidth - 60,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D3D3D3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    marginTop: 5,
    marginLeft:10,
    fontFamily:'OpenSans'
  },
  profileImage: {
    width: '80%',
    height: '50%',
    marginTop: 60,
    resizeMode:'contain'
  },
  btn: {
    width: '60%',
    padding: 15,
    backgroundColor: '#E40000',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily:"Montserrat"
  },
  item: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
},
images: {
  height: 200,
  width: 200,
  alignItems: 'center',
},
loader: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop:400
},
});






