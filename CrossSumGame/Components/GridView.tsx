import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Button } from "react-native";
import { green } from "react-native-reanimated/lib/typescript/Colors";

interface GridViewProps {
  rows: number; // Number of regular rows (excluding sum row)
  cols: number; // Number of regular columns (excluding sum column)
  rowSums:number[];
  colSums:number[];
  correctAnswers: boolean[][];
  gridValues: number[][];
}

const GridView: React.FC<GridViewProps> = ({ rows, cols, rowSums, colSums, gridValues, correctAnswers }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Calculate cell size dynamically
  const cellSize = Math.min(screenWidth * 0.95, screenHeight * 0.95) / (Math.min(rows, cols) + 1);
  const bigFontSize = 0.4 * cellSize;
  const smallFontSize = 0.2 * cellSize;

  const [addUpRows, setAddUpRows] = useState<number[]>(Array(rows).fill(0));
  const [addUpCols, setAddUpCols] = useState<number[]>(Array(cols).fill(0));
  const [revealedCells, setRevealedCells] = useState<boolean[][]>(
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false))
  );
  const [buttonState,setButtonState] = useState<boolean>(false);



  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (correctAnswers[rowIndex][colIndex]) {
      setRevealedCells((prev) => {
        const updated = prev.map((row, rIdx) =>
          row.map((cell, cIdx) =>
            rIdx === rowIndex && cIdx === colIndex ? true : cell
          )
        );
        return updated;
      });

      // Update addUpRows and addUpCols
      setAddUpRows((prev) => {
        const updated = prev.map<number>((value, index) => {
          if (index == rowIndex) { return value + gridValues[rowIndex][colIndex]; }
          else { return value; }
        });
        return updated;
      });

      setAddUpCols((prev) => {
        const updated = prev.map((value, index) => {
          if (index == colIndex) { return value + gridValues[rowIndex][colIndex]; }
          else { return value; }
        });
        return updated;
      });
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>{
        setButtonState(!buttonState);
      }}><View style={[styles.button,{backgroundColor:buttonState?GreenColor:RedColor}]}>
        <Text style={styles.text}>{buttonState?'Mark':'Remove'}</Text>  
      </View></TouchableOpacity>
      {/* Render Header Row */}
      <View style={styles.row}>
        {/* Empty corner cell */}
        <View style={[styles.corner, { width: cellSize, height: cellSize }]}>
          <Text style={styles.text}></Text>
        </View>
        {/* Column sums */}
        {colSums.map((sum, colIndex) => (
          <View
            key={`col-sum-${colIndex}`}
            style={[styles.sumCell, { width: cellSize, height: cellSize, borderRadius: 0.2 * cellSize }]}
          >
            <Text style={[styles.text, { fontSize: bigFontSize }]}>{sum}</Text>
            <Text style={[styles.addUp, { left: cellSize / 20, top: cellSize / 20, fontSize: smallFontSize }]}>{addUpCols[colIndex] > 0 ? addUpCols[colIndex] : ''}</Text>
          </View>
        ))}
      </View>

      {/* Render Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {/* Row sum */}
          <View
            style={[styles.sumCell, { width: cellSize, height: cellSize, borderRadius: 0.2 * cellSize }]}
          >
            <Text style={[styles.text, { fontSize: bigFontSize }]}>{rowSums[rowIndex]}</Text>
            <Text style={[styles.addUp, { left: cellSize / 20, top: cellSize / 20, fontSize: smallFontSize }]}>{addUpRows[rowIndex] > 0 ? addUpRows[rowIndex] : ''}</Text>
          </View>
          {/* Regular cells */}
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TouchableOpacity
              key={`cell-${rowIndex}-${colIndex}`}
              onPress={() => handleCellClick(rowIndex, colIndex)}
            >
              <View
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  { backgroundColor: revealedCells[rowIndex][colIndex] ? GreenColor : 'white', }
                ]}
              >
                <Text style={[styles.text, {
                }]}>{gridValues[rowIndex][colIndex]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const GreenColor='#4fca3b';
const RedColor='#fe7e7e';
const BlueColor='#0068ff';
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  sumCell: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: BlueColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  corner: {
    borderLeftWidth: 0,
  },
  addUp: {
    position: 'absolute',
    fontSize: 10,
  },
  container:{
    backgroundColor:"#98bef5",
  },
  button:{
    marginBottom:20,
    alignItems:'center',
    backgroundColor:GreenColor,
    height:40,
    justifyContent: "center",
    borderRadius:10,
    borderColor:'green',
    borderWidth:2,
  }
});

export default GridView;
