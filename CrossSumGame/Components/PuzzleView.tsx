import React, { Component, useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Button, Animated, Alert } from "react-native";
import { FillRandom } from "../assets/functions";

interface PuzzleViewProps {
    rows: number; // Number of regular rows (excluding sum row)
    cols: number; // Number of regular columns (excluding sum column)
    rowSums: number[];
    colSums: number[];
    correctAnswers: boolean[][];
    gridValues: number[][];
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class PuzzleView extends Component<PuzzleViewProps> {
    constructor(props: PuzzleViewProps) {
        super(props);
        this.state={
            buttonState: false,
        };
    }
    // Calculate cell size dynamically
    cellSize = Math.min(screenWidth * 0.95, screenHeight * 0.95) / (Math.min(this.props.rows, this.props.cols) + 1);
    bigFontSize = 0.4 * this.cellSize;
    smallFontSize = 0.2 * this.cellSize;


    addUpRows = Array(this.props.rows).fill(0);
    addUpCols = Array(this.props.cols).fill(0);
    revealedCells: boolean[][] = Array(this.props.rows).fill(null).map(() => Array(this.props.cols).fill(false));
    buttonState = false;
    tableValues = this.props.gridValues;
    rowInitialSums = this.props.rowSums;
    colInitialSums = this.props.colSums;

    render(): React.ReactNode {
        //State Variables
        //const [addUpRows, setAddUpRows] = useState<number[]>(Array(this.props.rows).fill(0));
        //const [addUpCols, setAddUpCols] = useState<number[]>(Array(this.props.cols).fill(0));
        //const [revealedCells, setRevealedCells] = useState<boolean[][]>(Array(this.props.rows).fill(null).map(() => Array(this.props.cols).fill(false)));
        //const [buttonState,setButtonState] = useState<boolean>(false);
        //const [tableValues, setTableValues] = useState<number[][]>(this.props.gridValues);
        //const [rowInitialSums, setRowInitialSums] = useState<number[]>(this.props.rowSums);
        //const [colInitialSums, setColInitialSums] = useState<number[]>(this.props.colSums);

        //Animation Values
        const alertColor: Animated.Value[][] = [];
        for (let i = 0; i < this.props.rows; i++) {
            const tempAnimatedArray: Animated.Value[] = [];
            for (let j = 0; j < this.props.cols; j++) {
                tempAnimatedArray.push(new Animated.Value(0));
            }
            alertColor.push(tempAnimatedArray);
        }

        const handleCellClick = (rowIndex: number, colIndex: number) => {
            if (this.buttonState) {
                if (this.props.correctAnswers[rowIndex][colIndex] && !this.revealedCells[rowIndex][colIndex]) {
                    ReavealAction(rowIndex, colIndex);
                    // Update addUpRows and addUpCols
                    AddUpRowAndColState(rowIndex, colIndex);
                    //Check corresponding row and column if it's solved
                    SolvedRowOrColumn(rowIndex, colIndex);
                    //End game checking
                }
                else {
                    if (this.tableValues[rowIndex][colIndex] > 0) {
                        ErrorAnimation(rowIndex, colIndex);
                    }
                }
            }
            else {
                if (!this.props.correctAnswers[rowIndex][colIndex]) {
                    RemoveAction(rowIndex, colIndex);
                }
                else {
                    if (!this.revealedCells[rowIndex][colIndex]) {
                        ErrorAnimation(rowIndex, colIndex);
                    }
                }
            }
        };

        const ReavealAction = (rowIndex: number, colIndex: number) => {
            // setRevealedCells((prev) => {
            //     const updated = prev.map((row, rIdx) =>
            //         row.map((cell, cIdx) =>
            //             rIdx === rowIndex && cIdx === colIndex ? true : cell
            //         )
            //     );
            //     return updated;
            // });
            //this.revealedCells[rowIndex][colIndex]=true;
        }

        const AddUpRowAndColState = (rowIndex: number, colIndex: number) => {
            // setAddUpRows((prev) => {
            //     const updated = prev.map<number>((value, index) => {
            //         if (index == rowIndex) { return value + this.props.gridValues[rowIndex][colIndex]; }
            //         else { return value; }
            //     });
            //     return updated;
            // });
            // setAddUpCols((prev) => {
            //     const updated = prev.map((value, index) => {
            //         if (index == colIndex) { return value + this.props.gridValues[rowIndex][colIndex]; }
            //         else { return value; }
            //     });
            //     return updated;
            // });
            // Alert.alert(addUpRows[rowIndex].toString() + "/" + rowInitialSums[rowIndex].toString());
        }

        const SolvedRowOrColumn = (rowIndex: number, colIndex: number) => {
            // if(addUpRows[rowIndex]==rowInitialSums[rowIndex]){
            //   setRowInitialSums((prev)=>{
            //     const updated=prev.map<number>((numValue,index)=>{
            //       if(index==rowIndex){return 0;}
            //       else{return numValue;}
            //     });
            //     return updated;
            //   });
            // }
        }

        const RemoveAction = (rowIndex: number, colIndex: number) => {
            // setTableValues((prev)=>{
            //   const updated = prev.map<number[]>((rowTableValue,rowTableIndex)=>{
            //     return rowTableValue.map<number>((colTableValue,colTableIndex)=>{
            //       if(rowTableIndex==rowIndex && colTableIndex==colIndex){return 0;}
            //       else{return colTableValue;}
            //     });
            //   });
            //   return updated;
            // });
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


        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    this.buttonState=!this.buttonState;
                    //Alert.alert(this.buttonState.toString());
                }}><View style={[styles.button, { backgroundColor: this.buttonState ? GreenColor : RedColor }]}>
                        <Text style={styles.text}>{this.buttonState ? 'Mark' : 'Remove'}</Text>
                    </View></TouchableOpacity>
                {/* Render Header Row */}
                <View style={styles.row}>
                    {/* Empty corner cell */}
                    <View style={[styles.corner, { width: this.cellSize, height: this.cellSize }]}>
                        <Text style={styles.text}></Text>
                    </View>
                    {/* Column sums */}
                    {this.props.colSums.map((sum, colIndex) => (
                        <View
                            key={`col-sum-${colIndex}`}
                            style={[styles.sumCell, { width: this.cellSize, height: this.cellSize, borderRadius: 0.2 * this.cellSize }]}
                        >
                            <Text style={[styles.text, { fontSize: this.bigFontSize }]}>{sum}</Text>
                            <Text style={[styles.addUp, { left: this.cellSize / 20, top: this.cellSize / 20, fontSize: this.smallFontSize }]}>{this.addUpCols[colIndex] > 0 ? this.addUpCols[colIndex] : ''}</Text>
                        </View>
                    ))}
                </View>

                {/* Render Rows */}
                {Array.from({ length: this.props.rows }).map((_, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.row}>
                        {/* Row sum */}
                        <View
                            style={[styles.sumCell, { width: this.cellSize, height: this.cellSize, borderRadius: 0.2 * this.cellSize }]}
                        >
                            <Text style={[styles.text, { fontSize: this.bigFontSize }]}>{this.rowInitialSums[rowIndex]}</Text>
                            <Text style={[styles.addUp, { left: this.cellSize / 20, top: this.cellSize / 20, fontSize: this.smallFontSize }]}>{this.addUpRows[rowIndex] > 0 ? this.addUpRows[rowIndex] : ''}</Text>
                        </View>
                        {/* Regular cells */}
                        {Array.from({ length: this.props.cols }).map((_, colIndex) => (
                            <TouchableOpacity
                                key={`cell-${rowIndex}-${colIndex}`}
                                onPress={() => handleCellClick(rowIndex, colIndex)}
                            >
                                <Animated.View
                                    style={[
                                        styles.cell,
                                        { width: this.cellSize, height: this.cellSize },
                                        {
                                            backgroundColor: this.revealedCells[rowIndex][colIndex] ? GreenColor : alertColor[rowIndex][colIndex].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['#ffffff', RedColor]
                                            }),
                                        }
                                    ]}
                                >
                                    <Text style={[styles.text, {
                                    }]}>{this.tableValues[rowIndex][colIndex] > 0 ? this.tableValues[rowIndex][colIndex] : ''}</Text>
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        );
    }
}

export default PuzzleView;



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
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: GreenColor,
        height: 40,
        justifyContent: "center",
        borderRadius: 10,
        borderColor: 'green',
        borderWidth: 2,
    }
});
