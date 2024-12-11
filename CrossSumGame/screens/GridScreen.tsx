import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import GridView from "../Components/GridView";
import { FillRandom, generateCorrectAnswers, GetRevealedArray } from "../assets/functions";

type RootStackParamList = {
  Grid: { rows: number; cols: number };
};

// Props for the GridScreen
interface GridScreenProps {
  route: RouteProp<RootStackParamList, "Grid">;
}



const GridScreen: React.FC<GridScreenProps> = ({ route }) => {
  const { rows, cols } = route.params;
  const values=FillRandom(rows,cols);
  const answers=generateCorrectAnswers(values);
  const [revealed, setReavealed] = useState(GetRevealedArray(rows, cols));
  return (
    <View style={styles.container}>
      <GridView rows={rows} cols={cols} gridValues={values} correctAnswers={answers} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
});

export default GridScreen;
