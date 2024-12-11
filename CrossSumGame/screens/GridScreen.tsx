import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import GridView from "../Components/GridView";
import { FillRandom, generateCorrectAnswers, GetColSums, GetCorrectAnswersMatrix, GetRevealedArray, GetRowSums } from "../assets/functions";

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
  const answersBool=GetCorrectAnswersMatrix(rows,cols,answers);
  const rowSums=GetRowSums(answersBool,values);
  const colSums=GetColSums(answersBool,values);
  return (
    <View style={styles.container}>
      <GridView rows={rows} cols={cols} rowSums={rowSums} colSums={colSums} gridValues={values} correctAnswers={answersBool} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#98bef5",
    padding: 10,
  },
});

export default GridScreen;
