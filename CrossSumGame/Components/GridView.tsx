import React from "react";
import { View, StyleSheet, Text, Dimensions, Alert } from "react-native";

interface GridViewProps {
  rows: number; // Number of regular rows (excluding sum row)
  cols: number; // Number of regular columns (excluding sum column)
}

const GridView: React.FC<GridViewProps> = ({ rows, cols }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Calculate cell size dynamically
  const cellSize = Math.min(screenWidth, screenHeight) / (Math.min(rows, cols) + 1);
  const bigFontSize = 0.4 * cellSize;
  const smallFontSize = 0.2 * cellSize;

  // Mock data for sums (replace with real logic)
  const rowSums = Array(rows).fill(120); 
  const colSums = Array(cols).fill(150); 
  const addUpRows = Array(rows).fill(55);
  const addUpCols = Array(cols).fill(99);
  Alert.alert(cellSize.toString());
  return (
    <View>
      {/* Render Header Row */}
      <View style={styles.row}>
        {/* Empty corner cell */}
        <View style={[styles.corner, { width: cellSize, height: cellSize, backgroundColor: "white" }]}>
          <Text style={styles.text}></Text>
        </View>
        {/* Column sums */}
        {colSums.map((sum, colIndex) => (
          <View
            key={`col-sum-${colIndex}`}
            style={[styles.sumCell, { width: cellSize, height: cellSize }]}
          >
            <Text style={[styles.text,{fontSize:bigFontSize}]}>{sum}</Text>
            <Text style={[styles.addUp,{left:cellSize/20, top:cellSize/20, fontSize:smallFontSize}]}>{addUpCols[colIndex]}</Text>
          </View>
        ))}
      </View>

      {/* Render Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {/* Row sum */}
          <View
            style={[styles.sumCell, { width: cellSize, height: cellSize }]}
          >
            <Text style={[styles.text,{fontSize:bigFontSize}]}>{rowSums[rowIndex]}</Text>
            <Text style={[styles.addUp,{left:cellSize/20, top:cellSize/20, fontSize:smallFontSize}]}>{addUpRows[rowIndex]}</Text>
          </View>
          {/* Regular cells */}
          {Array.from({ length: cols }).map((_, colIndex) => (
            <View
              key={`cell-${rowIndex}-${colIndex}`}
              style={[styles.cell, { width: cellSize, height: cellSize }]}
            >
              <Text style={styles.text}> </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

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
    backgroundColor: "#0068ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius:10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  corner:{
    borderLeftWidth:0,
  },
  addUp:{
    position:'absolute',
    fontSize:10,
  }
});

export default GridView;
