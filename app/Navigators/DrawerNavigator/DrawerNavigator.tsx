import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerContent from './DrawerContent';
import { Alert, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UserProfileDetails from '@/app/Screen8(profiles)/UserProfileDetails';
import { rs } from '@/Styles/Responsive';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({navigation}) => {
  return (
    <SafeAreaProvider>
      <Drawer.Navigator
        initialRouteName="UserProfile"
        drawerContent={(props) => <DrawerContent children={undefined} {...props} />}
        screenOptions={{
          drawerStyle: { width: '80%',backgroundColor:'#F5F5F5'},
          headerTransparent: true, 
          headerTitleStyle:{color:'white'},
          headerTitle:'',
          headerShown: true,
          headerTintColor: '#fff',
          
          headerRight: () => (
            <View style={styles.headerIconsContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  Alert.alert('Notifications', 'No Notifications. We will keep you updated.')
                }
              >
                <MaterialIcons name="notifications" size={24} color="#FF5733" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Search')}
              >
                <MaterialIcons name="find-replace" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      >
        
        <Drawer.Screen
          name="UserProfile"
          component={UserProfileDetails}
          // options={{ title: 'MarryUp'}}
        />
      </Drawer.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  headerIconsContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 90,
  },
  iconButton: {
    marginHorizontal: 8,
   
  },
});

export default DrawerNavigator;
