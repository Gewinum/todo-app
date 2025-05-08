import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

type Task = {
    title: string;
    description: string;
};

export default function EditTaskScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { index, task } = route.params as { index: number; task: Task };

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const saveTask = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('tasks');
            const tasks = storedTasks ? JSON.parse(storedTasks) : [];
            tasks[index] = { title, description };
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            Alert.alert('Success', 'Task updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Title</Text>
            <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
            />
            <Text>Description</Text>
            <TextInput
                style={styles.textarea}
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    textarea: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});