import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

type Task = {
  title: string;
  description: string;
  priority?: string;
};

export default function TabOneScreen() {
  const navigation = useNavigation();
  const { getItem, setItem } = useAsyncStorage('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const storedTasks = await getItem();
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [getItem]);

  useEffect(() => {
    navigation.addListener('focus', loadTasks);
    loadTasks();
  }, [navigation]);

  const deleteTask = async (index: number) => {
    try {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      await setItem(JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      Alert.alert('Success', 'Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
    );
  }

  const createPriorityStyles = (priority: string) => {
    const initialStyle = styles.taskPriority;

    switch (priority) {
      case 'Low':
        return [initialStyle, styles.lowPriority];
      case 'Medium':
        return [initialStyle, styles.mediumPriority];
      case 'High':
        return [initialStyle, styles.highPriority];
      default:
    }
  }

  return (
      <View style={styles.container}>
        <Button title="New Task" onPress={() => navigation.navigate('newTask')} />
        <FlatList
            style={{ width: '90%' }}
            data={tasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
                <View style={styles.taskItem}>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text style={styles.taskDescription}>{item.description}</Text>
                  <Text style={createPriorityStyles(item.priority ?? "Low")}>{item.priority ?? "Low"}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('editTask', { index, task: item })}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteTask(index)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskItem: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskPriority: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  lowPriority: {
    backgroundColor: '#007BFF',
  },
  mediumPriority: {
    backgroundColor: '#FFA500',
  },
  highPriority: {
    backgroundColor: '#FF0000',
  },
});