import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Màn hình HomeScreen (API_Screen_01)
const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleGetStarted = () => {
    navigation.navigate('TaskList', { name });
  };

  return (
    <View style={styles.container}>
      <Image source={require('sticky-note-pencil.jpg')} style={styles.image} />
      <Text style={styles.title}>MANAGE YOUR TASK</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
};

// Màn hình TaskListScreen (API_Screen_02)
const TaskListScreen = ({ route, navigation }) => {
  const { name } = route.params;
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch('https://your-api-url.com/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.log(error));
  }, []);

  const handleEditTask = (task) => {
    navigation.navigate('AddTask', { task });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {name}, Have a great day ahead!</Text>
        <Image source={require('boy.png')} style={styles.avatar} />
      </View>
      <TextInput 
        style={styles.searchInput} 
        placeholder="Search"
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList 
        data={tasks.filter(task => task.title.includes(searchText))}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleEditTask(item)}>
              <Image source={require('sticky-note-pencil.jpg')} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Màn hình AddTaskScreen (API_Screen_03)
const AddTaskScreen = ({ route, navigation }) => {
  const [task, setTask] = useState(route.params?.task || { title: '' });

  const handleFinish = () => {
    const method = task.id ? 'PUT' : 'POST';
    const url = task.id 
      ? `https://your-api-url.com/tasks/${task.id}` 
      : 'https://your-api-url.com/tasks';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    .then(() => navigation.goBack())
    .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ADD YOUR JOB</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Input your job"
        value={task.title}
        onChangeText={text => setTask({ ...task, title: text })}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>FINISH</Text>
      </TouchableOpacity>
    </View>
  );
};

// Điều hướng giữa các màn hình
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#6B47DC',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  greeting: {
    fontSize: 18,
    color: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00BFFF',
    borderRadius: 50,
    padding: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default App;
