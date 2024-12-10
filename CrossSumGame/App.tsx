import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import GridScreen from "./screens/GridScreen";

// Root stack parameter list
type RootStackParamList = {
  Home: undefined;
  Grid: { rows: number; cols: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Grid" component={GridScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
