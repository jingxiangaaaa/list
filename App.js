import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateToDo from './src/CreateToDo';
import ToDoList from './src/ToDoList';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Create ToDo') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'ToDo List') {
              iconName = focused ? 'list' : 'list-alt';
            }
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: [{ display: "flex" }, null],
        })}
      >
        <Tab.Screen name="Create ToDo" component={CreateToDo} />
        <Tab.Screen name="ToDo List" component={ToDoList} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
