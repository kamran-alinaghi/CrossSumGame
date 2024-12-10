import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

interface HomeScreenProps {
  navigation: StackNavigationProp<any>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [rows, setRows] = useState<number>(6);
  const [cols, setCols] = useState<number>(6);

  const handleGenerate = () => {
    navigation.navigate("Grid", { rows, cols });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Rows"
        value={rows.toString()}
        onChangeText={(text: string) => setRows(Number(text))}
      />
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Columns"
        value={cols.toString()}
        onChangeText={(text: string) => setCols(Number(text))}
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
