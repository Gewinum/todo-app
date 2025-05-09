import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Text, View } from '@/components/Themed';
import CustomDropdown from "@/components/CustomDropdown";

export default function ModalScreen() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState('');

  const saveTask = async () => {
    try {
      if (title === '' || description === '') {
        Alert.alert('Error', 'Please fill in all fields!');
      }
      const newTask = { title, description, priority };
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      tasks.push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      Alert.alert('Success', 'Task added successfully!');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
      <View style={styles.container}>
        <Text>Title of new task</Text>
        <TextInput
            placeholder="Title"
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
        />
        <Text>Description</Text>
        <TextInput
            style={styles.textarea}
            multiline={true}
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
        />
        <Text>Priority</Text>
        <CustomDropdown items={["Low", "Medium", "High"]} selectedValue="Low" onValueChange={(value: string) => setPriority(value)} />
        <TouchableOpacity style={styles.button} onPress={saveTask}>
          <Text style={styles.buttonText}>Add new task</Text>
        </TouchableOpacity>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10,
  },
  textInput: {
    width: '95%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  textarea: {
    width: '95%',
    height: 250,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '95%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priorityButton: {
    alignSelf: "flex-start",
  }
});