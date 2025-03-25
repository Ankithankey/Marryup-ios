import React from 'react';
import { View, Text, Modal,StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const CustomLoader = ({ visible, message = 'Loading...' }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.loaderContainer}>
        <LottieView source={require('../../assets/loader.json')} autoPlay loop style={styles.loader} />
        <Text style={styles.loaderText}>{message} </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  loader: { width: 120, height: 120, },
  loaderText: { color: '#FFF', fontSize: 18, marginTop: 10, fontWeight: 'bold' },
});

export default CustomLoader;
