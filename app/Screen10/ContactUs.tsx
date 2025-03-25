import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Linking, Image } from 'react-native';
import emailjs from 'emailjs-com';

const ContactUs = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const serviceID = 'service_zrp7n08';
  const templateID = 'template_y62t6k9';
  const userID = 'xngP_o5K8s1_S5hap';

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !subject || !message) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const templateParams = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      subject: subject,
      message: message,
    };

    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then(
        (response) => {
          Alert.alert('Success', 'Your message has been sent!');
          
          setFirstName('');
          setLastName('');
          setEmail('');
          setSubject('');
          setMessage('');
        },
        (error) => {
          Alert.alert('Error', `Error sending message: ${error.text}`);
        }
      );
  };

  const handleSocialLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Error opening URL", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}> Send </Text>
      </TouchableOpacity>

      <Text style={styles.socialText}> Visit our website  </Text>
      <TouchableOpacity onPress={() => handleSocialLink('https://www.nrimarriage.in' )}>
          <Text style={styles.websiteLink}>www.nrimarriage.in </Text>
       </TouchableOpacity>

      {/* <View style={styles.socialContainer}>
      <TouchableOpacity onPress={() => handleSocialLink('https://www.facebook.com/yourpage')}>
          <Image source={require('./assets/facebook-icon.png')} style={styles.socialIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSocialLink('https://www.instagram.com/yourpage')}>
          <Image source={require('./assets/instagram-icon.png')} style={styles.socialIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSocialLink('https://twitter.com/yourpage')}>
          <Image source={require('./assets/twitter-icon.png')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View> */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}> © 2025 MarryUp. All Rights Reserved. </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 45,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#FFA600',
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  socialText: {
    fontSize: 18,
    marginTop: 0,
    // marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 40,
    height: 40,
    // margin: 10,
  },
  footerContainer: {
    width:'100%',
    alignItems: 'center',
    marginTop: 0,  
    marginBottom: -45,
    marginLeft:180
  },
  footerText: {
    width:'100%',
    fontSize: 12,
    color: '#aaa',
  },
  websiteLink: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default ContactUs;
