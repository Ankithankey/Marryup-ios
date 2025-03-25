import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const Likes = ({navigation}) => {
  return (
    <>
    <View style={styles.maincontainer}>
      <Text style={styles.headerTitle}>Liked You</Text>
      <Text style={styles.subHeader}>
        When people are into you, they’ll appear here. Enjoy.
      </Text>
    </View>
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/Likes.webp')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.mainMessage}> You're turning heads, catching attention! </Text>
      <Text style={styles.secondaryMessage}>
      It seems everyone who likes you is already here. 
      But don’t worry, more admirers are just around the 
      corner—your charm never goes unnoticed!
      </Text>
      <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('People')}}>
        <Text style={styles.buttonText}>See more people</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};

export default Likes;

const styles = StyleSheet.create({
    maincontainer:{
        backgroundColor: '#F5F5F5', 
        paddingTop:20,
        paddingLeft:20
    },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#B76E79',
  },
  subHeader: {
    fontSize: 16,
    color: '#555555', 
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius:99
  },
  mainMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  secondaryMessage: {
    fontSize: 14,
    color: '#555555', 
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#B76E79', 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
