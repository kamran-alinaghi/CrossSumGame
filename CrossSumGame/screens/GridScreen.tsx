import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { RouteProp } from "@react-navigation/native";
import GridView from "../Components/GridView";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Grid: { rows: number; cols: number };
};

// Props for the GridScreen
interface GridScreenProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<RootStackParamList, "Grid">;
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const GridScreen: React.FC<GridScreenProps> = ({ route, navigation }) => {
  const { rows, cols } = route.params;

  return (
    <View style={styles.container}>
      <GridView rows={rows} cols={cols} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#98bef5",
    padding: 10,
  },
});

export default GridScreen;
