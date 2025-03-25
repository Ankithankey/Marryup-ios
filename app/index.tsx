import { ActivityIndicator, StyleSheet, View } from "react-native";
import StackNav from "./Navigators/StackNav";
import Internetconnectivity from "@/Network/Internetconnectivity";
import { useFonts } from 'expo-font';

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'BodoniModa':require('@/assets/fonts/BodoniModa_18pt-Bold.ttf'),
    'Montserrat':require('@/assets/fonts/Montserrat-Regular.ttf'),
    'OpenSans':require('@/assets/fonts/OpenSans_Condensed-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E40000" />
      </View>
    );
  }
  return (
    <>
      <Internetconnectivity>
        <StackNav />
      </Internetconnectivity>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: 'white',
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});