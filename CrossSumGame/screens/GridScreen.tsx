import React from "react";
import { View, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import GridView from "../Components/GridView";

type RootStackParamList = {
    Grid: { rows: number; cols: number };
  };
  
  // Props for the GridScreen
  interface GridScreenProps {
    route: RouteProp<RootStackParamList, "Grid">;
  }

const GridScreen: React.FC<GridScreenProps> = ({ route }) => {
  const { rows, cols } = route.params;

  return (
    <View style={styles.container}>
      <GridView rows={rows} cols={cols} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding:10,
  },
});

export default GridScreen;
