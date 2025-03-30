import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // Correct import
import SignIn from "./screens/SignIn";
import Credit from "./screens/Credit";
import Main from "./screens/Main";

const Stack = createStackNavigator(); // Create stack navigator

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Credit" component={Credit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}