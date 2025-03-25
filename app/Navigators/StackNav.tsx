import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../Screen1/SplashScreen';
import GetStarted from '../Screen1/GetStarted';
import Login from '../Screen2(authentication)/Login';
import Register from '../Screen2(authentication)/Register';
import Religion from '../Screen3(UserDetails)/Religion';
import UserState from '../Screen3(UserDetails)/UserState';
import UserWorkDetails from '../Screen3(UserDetails)/UserWorkDetails';
import UserEducationDetails from '../Screen3(UserDetails)/UserEducationDetails';
import UserMartialDetails from '../Screen3(UserDetails)/UserMartialDetails';
import UserAboutDetails from '../Screen3(UserDetails)/UserAboutDetails';
import UserProfileImage from '../Screen4(profileImage)/UserProfileImage';
import BottomNavigator from '../BottomNavigator/BottomNavigator';
import DisplaySearchedProfiles from '../Screen6/DisplaySearchedProfiles';
import EditUserProfileDetails from '../Screen8(profiles)/EditUserProfileDetails';
import Partners_Details from '../Screen5(partner_reference)/Partners_Details';
import UserMatches from '../Screen6/UserMatches';
import SearchFilters from '../Screen6/SearchFilters';
import Home from '../Screen7(Home)/Home';
import ContactUs from '../Screen10/ContactUs';
import Saveprofile from '../Screen9/Saveprofile';
import DeleteAccount from '../Screen10/DeleteAccount';


const StackNav = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='splashscreen' screenOptions={{ headerShown: false }}>
        {/* screen 1 */}
        <Stack.Screen name="splashscreen" component={SplashScreen} />
        <Stack.Screen name="GetStarted" component={GetStarted}  />
        {/* screen 2 */}
        <Stack.Screen name="Login" component={Login}  />
        <Stack.Screen name="Register" component={Register}  />
        {/* Screen 3 */}
        <Stack.Screen name="Religion" component={Religion}  />
        <Stack.Screen name="UserState" component={UserState}  />
        <Stack.Screen name="UserWorkDetails" component={UserWorkDetails}  />
        <Stack.Screen name="UserEducationDetails" component={UserEducationDetails}  />
        <Stack.Screen name="UserMartialDetails" component={UserMartialDetails}  />
        <Stack.Screen name="UserAboutDetails" component={UserAboutDetails}  />
        {/* Screen 4 */}
        <Stack.Screen name="UserProfileImage" component={UserProfileImage}  />
         {/* Screen 5 */}
         <Stack.Screen name="Partners_Details" component={Partners_Details}  />
        {/* Bottom Navigator */}
        <Stack.Screen name="BottomNavigator" component={BottomNavigator}  />
        {/* screen 6 */}
        <Stack.Screen name="DisplaySearchedProfiles" component={DisplaySearchedProfiles}  />
        {/* screen 8 */}
        <Stack.Screen name="EditUserProfileDetails" component={EditUserProfileDetails}  />
        {/* Screen search filter */}
        <Stack.Screen name="Search" component={SearchFilters}  />
        {/*  */}
        <Stack.Screen name="ContactUs" component={ContactUs}  />
        {/*  */}
        <Stack.Screen name="Saveprofile" component={Saveprofile}  />
        {/*  */}
        <Stack.Screen name="DeleteAccount" component={DeleteAccount}  />
    </Stack.Navigator>
  )
}

export default StackNav

const styles = StyleSheet.create({})