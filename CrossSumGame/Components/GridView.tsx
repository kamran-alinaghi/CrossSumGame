import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Animated, Alert } from "react-native";
import { FillRandom, GetColSums, GetCorrectAnswersMatrix_V2, GetRowSums } from "../assets/functions";
import { WinAnimation } from "../assets/Animations";

interface GridViewProps {
  rows: number; // Number of regular rows (excluding sum row)
  cols: number; // Number of regular columns (excluding sum column)
  navigation: StackNavigationProp<any>;
}
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const GameOverOptions = ["Restart", "New Game", "Home"];

let gridValues: number[][] = [];
let correctAnswers: boolean[][] = [];
let rowSums: number[] = [];
let colSums: number[] = [];
let isNewGame: boolean = true;


//Animation Values
let alertColor: Animated.Value[][] = [];

let winTextSize = new Animated.Value(1);



function SetInitialValues(rows: number, cols: number) {
  if (isNewGame) {
    isNewGame = false;
    gridValues = FillRandom(rows, cols);
    correctAnswers = GetCorrectAnswersMatrix_V2(rows, cols);
    rowSums = GetRowSums(correctAnswers, gridValues);
    colSums = GetColSums(correctAnswers, gridValues);

    alertColor.length = 0;
    for (let i = 0; i < rows; i++) {
      const tempAnimatedArray: Animated.Value[] = [];
      for (let j = 0; j < cols; j++) {
        tempAnimatedArray.push(new Animated.Value(0));
      }
      alertColor.push(tempAnimatedArray);
    }
  }
}

const GridView: React.FC<GridViewProps> = ({ rows, cols, navigation }) => {

  const heartNumber = Math.floor(rows * cols / 12);
  let isGameOn = true;
  if (rows != rowSums.length || cols != colSums.length) { isNewGame = true; }
  SetInitialValues(rows, cols);

  // Calculate cell size dynamically
  const cellSize = Math.min(screenWidth * 0.95, screenHeight * 0.95) / (Math.min(rows, cols) + 1);
  const bigFontSize = 0.4 * cellSize;
  const smallFontSize = 0.2 * cellSize;


  //State Variables
  const [heartsNum, setHeartsNum] = useState<number>(heartNumber < 3 ? 3 : heartNumber);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [addUpRows, setAddUpRows] = useState<number[]>(Array(rows).fill(0));
  const [addUpCols, setAddUpCols] = useState<number[]>(Array(cols).fill(0));
  const [revealedCells, setRevealedCells] = useState<boolean[][]>(Array(rows).fill(null).map(() => Array(cols).fill(false)));
  const [buttonState, setButtonState] = useState<boolean>(false);
  const [tableValues, setTableValues] = useState<number[][]>(gridValues);
  const [rowInitialSums, setRowInitialSums] = useState<number[]>(rowSums);
  const [colInitialSums, setColInitialSums] = useState<number[]>(colSums);

  const RestartGame = () => {
    isGameOn = true;

    setHeartsNum(heartNumber < 3 ? 3 : heartNumber);
    setIsGameOver(false);
    setAddUpRows(Array(rows).fill(0));
    setAddUpCols(Array(cols).fill(0));
    setRevealedCells(Array(rows).fill(null).map(() => Array(cols).fill(false)));
    setButtonState(false);
    setTableValues(gridValues);
    setRowInitialSums(rowSums);
    setColInitialSums(colSums);
  }



  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (buttonState) {
      if (!revealedCells[rowIndex][colIndex]) {
        if (correctAnswers[rowIndex][colIndex]) {
          ReavealAction(rowIndex, colIndex);
          // Update addUpRows and addUpCols
          AddUpRowAndColState(rowIndex, colIndex);
        }
        else {
          if (tableValues[rowIndex][colIndex] > 0) {
            ErrorAnimation(rowIndex, colIndex);
            ReduceHeart();
          }
        }
      }
    }
    else {
      if (!correctAnswers[rowIndex][colIndex]) {
        RemoveAction(rowIndex, colIndex);
      }
      else {
        if (!revealedCells[rowIndex][colIndex]) {
          ErrorAnimation(rowIndex, colIndex);
          ReduceHeart();
        }
      }
    }
  };

  const WinGame = () => {
    if (isGameOn) {
      isGameOn = false;
      setIsWin(true);
      const winAnimation = WinAnimation(winTextSize, 1, 80);
      winAnimation.start(() => {
        setIsWin(false);
        NewGame();
      });
    }
  }

  const GameOver = () => {
    isGameOn = false;
    setIsGameOver(true);
  }

  const ReduceHeart = () => {
    setHeartsNum((prev) => {
      const tempHeart = prev - 1;
      if (tempHeart == 0) {
        GameOver();
      }
      return tempHeart;
    });
  }

  const ReavealAction = (rowIndex: number, colIndex: number) => {
    setRevealedCells((prev) => {
      const updated = prev.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? true : cell
        )
      );
      return updated;
    });
  }

  const AddUpRowAndColState = (rowIndex: number, colIndex: number) => {
    const tempRowValue = addUpRows[rowIndex] + gridValues[rowIndex][colIndex];
    const tempColValue = addUpCols[colIndex] + gridValues[rowIndex][colIndex];
    //Add the value of the correct answer to the row
    setAddUpRows((prev) => {
      const updated = prev;
      updated[rowIndex] = tempRowValue == rowInitialSums[rowIndex] ? 0 : tempRowValue;
      return updated;
    });
    //Checks if the row is completed
    if (tempRowValue == rowInitialSums[rowIndex]) {
      setRowSum(rowIndex);
      ClearTheRestOfRow(rowIndex);
    }
    //Add the value of the correct answer to the column
    setAddUpCols((prev) => {
      const updated = prev;
      updated[colIndex] = tempColValue == colInitialSums[colIndex] ? 0 : tempColValue;
      return updated;
    });
    //Checks if the column is completed
    if(tempColValue == colInitialSums[colIndex]){
      setColSum(colIndex);
      ClearTheRestOfCol(colIndex);
    }
    //Checks the Win conditions
    if (tempRowValue == rowInitialSums[rowIndex] && tempColValue == colInitialSums[colIndex]){
      let completeRow = true;
      let completeCol = true;
      for (let i = 0; i < rowInitialSums.length; i++) {
        if (i != rowIndex && rowInitialSums[i] > 0) {
          completeRow = false;
          break;
        }
      }
      for (let i = 0; i < colInitialSums.length; i++) {
        if (i != colIndex && colInitialSums[i] > 0) {
          completeCol = false;
          break;
        }
      }
      if (completeRow && completeCol) WinGame();
    }
  }

  const ClearTheRestOfRow = (rowIndex: number) => {
    setTableValues((prev) => {
      const updated = prev;
      for (let i = 0; i < updated[rowIndex].length; i++) {
        if (!correctAnswers[rowIndex][i]) {
          updated[rowIndex][i] = 0;
        }
      }
      return updated;
    });
  }

  const ClearTheRestOfCol = (colIndex: number) => {
    setTableValues((prev) => {
      const updated = prev;
      for (let i = 0; i < updated.length; i++) {
        if (!correctAnswers[i][colIndex]) {
          updated[i][colIndex] = 0;
        }
      }
      return updated;
    });
  }

  const setRowSum = (rowIndex: number) => {
    setRowInitialSums((prev) => {
      const updated = prev;
      updated[rowIndex] = 0;
      return updated;
    });
  }

  const setColSum = (colIndex: number) => {
    setColInitialSums((prev) => {
      const updated = prev;
      updated[colIndex] = 0;
      return updated;
    });
  }

  const RemoveAction = (rowIndex: number, colIndex: number) => {
    setTableValues((prev) => {
      const updated = prev.map<number[]>((rowTableValue, rowTableIndex) => {
        return rowTableValue.map<number>((colTableValue, colTableIndex) => {
          if (rowTableIndex == rowIndex && colTableIndex == colIndex) { return 0; }
          else { return colTableValue; }
        });
      });
      return updated;
    });
  }

  const ErrorAnimation = (rowIndex: number, colIndex: number) => {
    Animated.timing(alertColor[rowIndex][colIndex], {
      toValue: 1,
      useNativeDriver: false,
      duration: 150
    }).start(() => {
      Animated.timing(alertColor[rowIndex][colIndex], {
        toValue: 0,
        useNativeDriver: false,
        duration: 150
      }).start();
    });
  }

  const GameOverActions = (index: number) => {
    //Alert.alert(index.toString());
    switch (index) {
      case 0:
        RestartGame();
        break;
      case 1:
        NewGame();
        break;
      default:
        navigation.goBack();
        break;
    }
  }

  const NewGame = () => {
    isNewGame = true;
    SetInitialValues(rows, cols);
    RestartGame();
  }


  return (
    <View style={styles.container}>
      {/* Hearts */}
      <View style={[styles.hearts, {}]}>
        <Text style={[{ fontSize: 30 }]}>❤: {heartsNum}</Text>
        {/* Button */}
        <TouchableOpacity onPress={() => { setButtonState(!buttonState); }}>
          <View style={[styles.button, { width: 200, backgroundColor: buttonState ? GreenColor : RedColor }]}>
            <Text style={styles.text}>{buttonState ? 'Mark' : 'Remove'}</Text>
          </View>
        </TouchableOpacity>
      </View>


      {/* Render Header Row */}
      <View style={styles.row}>
        {/* Empty corner cell */}
        <View style={[styles.corner, { width: cellSize, height: cellSize }]}>
          <Text style={styles.text}></Text>
        </View>
        {/* Column sums */}
        {colInitialSums.map((sum, colIndex) => (
          <View
            key={`col-sum-${colIndex}`}
            style={[styles.sumCell, { width: cellSize, height: cellSize, borderRadius: 0.2 * cellSize, backgroundColor: sum > 0 ? BlueColor : PinkColor }]}
          >
            <Text style={[styles.text, { fontSize: bigFontSize }]}>{sum > 0 ? sum : '✓'}</Text>
            <Text style={[styles.addUp, { left: cellSize / 20, top: cellSize / 20, fontSize: smallFontSize }]}>{addUpCols[colIndex] > 0 ? addUpCols[colIndex] : ''}</Text>
          </View>
        ))}
      </View>

      {/* Render Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {/* Row sum */}
          <View
            style={[styles.sumCell, { width: cellSize, height: cellSize, borderRadius: 0.2 * cellSize, backgroundColor: rowInitialSums[rowIndex] > 0 ? BlueColor : PinkColor }]}
          >
            <Text style={[styles.text, { fontSize: bigFontSize }]}>{rowInitialSums[rowIndex] > 0 ? rowInitialSums[rowIndex] : '✓'}</Text>
            <Text style={[styles.addUp, { left: cellSize / 20, top: cellSize / 20, fontSize: smallFontSize }]}>{addUpRows[rowIndex] > 0 ? addUpRows[rowIndex] : ''}</Text>
          </View>
          {/* Regular cells */}
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TouchableOpacity
              key={`cell-${rowIndex}-${colIndex}`}
              onPress={() => handleCellClick(rowIndex, colIndex)}
            >
              <Animated.View
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  {
                    backgroundColor: revealedCells[rowIndex][colIndex] ? GreenColor : alertColor[rowIndex][colIndex].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#ffffff', RedColor]
                    }),
                  }
                ]}
              >
                <Text style={[styles.text, {
                }]}>{tableValues[rowIndex][colIndex] > 0 ? tableValues[rowIndex][colIndex] : ''}</Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <View style={[styles.overLayer, { display: isGameOver ? 'flex' : 'none' }]}>
        {GameOverOptions.map((option, index) => {
          return <TouchableOpacity key={index} onPress={() => { GameOverActions(index); }}>
            <View style={styles.gameOverButtons}>
              <Text style={styles.gameOverButtonText}>{option}</Text>
            </View>
          </TouchableOpacity>;
        })}
      </View>
      <View style={[styles.overLayer, { display: isWin ? 'flex' : 'none' }]}>
        <Animated.Text style={[{ color: 'yellow', fontSize: winTextSize }]}>
          You Won
        </Animated.Text>
      </View>
    </View>
  );
};

const PinkColor = '#f699f8';
const GreenColor = '#4fca3b';
const RedColor = '#fe7e7e';
const BlueColor = '#0068ff';
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
  container: {
    backgroundColor: "#98bef5",
  },
  button: {
    alignItems: 'center',
    backgroundColor: GreenColor,
    height: 50,
    justifyContent: "center",
    borderRadius: 10,
    borderColor: 'green',
    borderWidth: 2,
    marginLeft: 40,
  },
  hearts: {
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: 'center',
  },
  overLayer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: screenWidth,
    height: screenHeight - 60,
    left: -10,
    top: -10,
    justifyContent: "center",
    alignItems: 'center'

  },
  gameOverButtons: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#0000a9',
    height: 60,
    justifyContent: "center",
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    width: screenWidth / 1.5,
  },
  gameOverButtonText: {
    fontSize: 30,
    color: 'white',
  }
});

export default GridView;
