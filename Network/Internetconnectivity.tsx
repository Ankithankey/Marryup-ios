import { StyleSheet, Text, View, ImageBackground, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const Internetconnectivity = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState<any>(true);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    if (!isConnected) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ImageBackground source={require('../assets/images/nointer.png')} style={styles.img} >
                    <Text style={styles.text}> Oops!! No Internet Connection </Text>
                </ImageBackground>
            </View>
        )
    }
    return <>{children}</>;
};
export default Internetconnectivity

const styles = StyleSheet.create({
    text: {
        color: '#111', fontSize: 20, marginTop: 550, alignSelf: 'center', fontWeight: 500, fontStyle: 'italic'
    },
    img: {
        height: '80%', width: '100%'
    }
})