import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { View, Text } from "react-native";
import * as SecureStore from 'expo-secure-store';
import SignIn from "./screens/SignIn";
import Credit from "./screens/Credit";
import Main from "./screens/Main";
import { PaperProvider } from "react-native-paper";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync('userToken'); // ลบ Token
    props.navigation.reset({ 
      index: 0,
      routes: [{ name: 'SignIn' }]
    });
  };

  return (
    <View style={{ paddingTop: 50 }}>
      <DrawerItem
        label="Main"
        onPress={() => props.navigation.navigate('Main')}
      />
      <DrawerItem
        label="Credit"
        onPress={() => props.navigation.navigate('Credit')}
      />
      <DrawerItem
        label="Sign Out"
        onPress={handleSignOut}
        labelStyle={{ color: 'red' }}
      />
    </View>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Main" component={Main} />
      <Drawer.Screen name="Credit" component={Credit} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="SignIn" 
          component={SignIn} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainDrawer" 
          component={MainDrawer} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}