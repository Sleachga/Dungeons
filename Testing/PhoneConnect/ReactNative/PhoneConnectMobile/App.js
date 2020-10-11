import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import io from "socket.io-client";

import LoginScreen from "./LoginScreen";
import MainScreen from "./ControllerScreen";
import ControllerScreen from "./ControllerScreen";

const Stack = createStackNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);
    global.socket = io("http://192.168.1.77:80");
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Controller" component={ControllerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
