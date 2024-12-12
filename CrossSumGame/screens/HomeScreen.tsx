import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Dimensions, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

interface HomeScreenProps {
  navigation: StackNavigationProp<any>;
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [rows, setRows] = useState<number>(6);
  const [cols, setCols] = useState<number>(6);
  let maxVCells = 0;
  let maxHCells = 0;

  const CalculateCellSize=(rows:number, cols:number)=>{
    return Math.min(screenWidth * 0.95, screenHeight * 0.95) / (Math.min(rows, cols) + 1);
  }

  const CalculateMax = (cellSize: number) => {
    maxHCells = 10; // (Math.floor(screenWidth / cellSize) - 1);
    maxVCells = (Math.floor((screenHeight - 150) / cellSize) - 1);
  }
  
  let cellSize = CalculateCellSize(rows, cols);
  CalculateMax(cellSize);
  

  

  const handleGenerate = () => {
    let tempRows=rows;
    let tempCols=cols;
    if(rows<3){setRows(3);tempRows=3;}
    if(cols<3){setCols(3);tempCols=3;}
    navigation.navigate("Grid", { rows: tempRows, cols: tempCols });
  };

  const ReadValue = (str:string, max:null|number)=>{
    let tempValue = Number(str);
    if (isNaN(tempValue)) { tempValue = 0; }
    if(max){
      if (tempValue>max){tempValue=max;}
    }
    return tempValue;
  }


  return (
    <View style={styles.container}>
      <Text>Rows: (Max {maxVCells})</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Rows"
        value={rows.toString()}
        onChangeText={(text: string) => {
          let tempValue = Number(text);
          if (isNaN(tempValue)) { tempValue = 0; }
          if(tempValue>0){
            cellSize = CalculateCellSize(tempValue, cols);
            CalculateMax(cellSize);
            if(tempValue>maxVCells){tempValue=maxVCells;}
          }
          setRows(tempValue);
        }}
      />
      <Text>Columns: (Max 10)</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Columns"
        value={cols.toString()}
        onChangeText={(text: string) => {
          let tempValue = Number(text);
          if (isNaN(tempValue)) { tempValue = 0; }
          if(tempValue>0){
            cellSize = CalculateCellSize(rows, tempValue);
            CalculateMax(cellSize);
            if(tempValue>maxHCells){tempValue=maxHCells;}
          }
          setCols(tempValue);
          if(rows<tempValue){setRows(tempValue);}
          if(rows>maxVCells){setRows(maxVCells);}
        }}
      />
      <Button title="Generate Grid" onPress={handleGenerate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: 150,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default HomeScreen;
