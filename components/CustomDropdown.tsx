import React, { useState } from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";

type Props = {
    items: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
};

const CustomDropdown: React.FC<Props> = ({ items, selectedValue, onValueChange }) => {
    const [currentValue, setCurrentValue] = useState(selectedValue);

    const handleValueChange = (value: string) => {
        setCurrentValue(value);
        onValueChange(value);
    };

    return (
        <View style={styles.container}>
            {
                items.map((item, index) => (
                    <TouchableOpacity key={item} style={[styles.choiceButton, (currentValue === item ? styles.chosenButton : {})]} onPress={() => handleValueChange(item)} activeOpacity={0.7} disabled={currentValue === item}>
                        <Text>{item}</Text>
                    </TouchableOpacity>
                ))
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        alignSelf: "flex-start",
    },
    choiceButton: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightblue",
    },
    chosenButton: {
        backgroundColor: "lightgreen",
    }
});

export default CustomDropdown;