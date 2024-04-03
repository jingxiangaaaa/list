import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { ImageBackground } from 'react-native';


const ToDoList = () => {
    const [todos, setTodos] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null)
    const backgroundImage = require('../assets/1.jpg');


    useEffect(() => {
        loadTodos();
    }, []);
    useFocusEffect(
        useCallback(() => {
            loadTodos();
        }, [loadTodos])
    );
    useEffect(() => {
        console.log(selectedLocation);
    }, [selectedLocation]);


    const showMapModal = (locationString) => {
        const coordsPattern = /Longitude: ([+-]?\d+(\.\d+)?), Latitude: ([+-]?\d+(\.\d+)?)/;
        const match = coordsPattern.exec(locationString);

        if (match) {
            const longitude = parseFloat(match[1]);
            const latitude = parseFloat(match[3]);
            if (!isNaN(longitude) && !isNaN(latitude)) {
                setSelectedLocation({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                setIsModalVisible(true);
            } else {
                console.error('Invalid coordinates:', match);
            }
        } else {
            console.error('Location string did not match expected format:', locationString);
        }
    };
    const loadTodos = async (useCallback) => {
        const savedTodos = JSON.parse(await AsyncStorage.getItem('todos')) || [];
        setTodos(savedTodos);
    };

    const handleDeleteTodo = async (id) => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
        Alert.alert('Todo Deleted');
    };

    const startEditTodo = (todo) => {
        setEditingTodo(todo);
        setEditingText(todo.text);
        setSelectedLocation(null); // 添加这行代码来重置selectedLocation
        setIsModalVisible(true);
    };


    const handleSaveEdit = async () => {
        const updatedTodos = todos.map(todo => {
            if (todo.id === editingTodo.id) {
                return { ...todo, text: editingText };
            }
            return todo;
        });
        await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
        setIsModalVisible(false);
        setEditingTodo(null);
        setEditingText('');
    };

    const handleCancelEdit = () => {
        setIsModalVisible(false);
        setEditingTodo(null);
        setEditingText('');
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.container}>
            <FlatList
                data={todos}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Text>Published on: {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}</Text>
                        <Text style={styles.todoText}>{item.text}</Text>
                        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                        <Text>Battery: {item.batteryLevel ? `${Math.round(item.batteryLevel * 100)}%` : 'Unknown'}</Text>
                        <Text>Network: {item.networkState}</Text>
                        <Text onPress={() => showMapModal(item.location)} style={styles.modalText}>
                            Location: {item.location ? item.location : 'Geolocation is not obtained'}
                        </Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.button} onPress={() => handleDeleteTodo(item.id)}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => startEditTodo(item)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalView}>
                    {selectedLocation && !isNaN(selectedLocation.latitude) && !isNaN(selectedLocation.longitude) ? (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={{
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            onRegionChangeComplete={(region) => console.log(region)}
                        >
                            <Marker
                                coordinate={{
                                    latitude: selectedLocation.latitude,
                                    longitude: selectedLocation.longitude,
                                }}
                            />
                        </MapView>
                    ) : (
                        <TextInput
                            style={styles.input}
                            onChangeText={setEditingText}
                            value={editingText}
                        />
                    )}
                    <TouchableOpacity style={styles.button} onPress={handleCancelEdit}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>

                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: "cover", 
    },
    todoItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0', 
        backgroundColor: '#FFFFFF', 
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10, 
        shadowColor: "#000", 
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    todoText: {
        fontSize: 20, 
        color: '#333', 
        marginBottom: 5, 
    },
    image: {
        width: '100%',
        height: 200, 
        marginBottom: 10, 
    },
    modalView: {
        marginTop: '70%', 
        marginHorizontal: '10%', 
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18, 
        marginBottom: 15, 
    },
    input: {
        width: '100%', 
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0', 
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF', 
    },
    mapStyle: {
        width: '100%',
        height: 300,
        borderRadius: 20,
    },
    buttonGroup: {
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        marginTop: 10, 
    },

    button: {
        padding: 10,
        marginVertical: 10, 
        backgroundColor: '#4A708B', 
        borderRadius: 5, 
        width: 150, 
    },
    buttonText: {
        color: 'white',
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', 
        marginBottom: 5, 
    },
    footer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0', 
        backgroundColor: '#FFFFFF', 
    },
    footerButton: {
        flex: 1, 
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9', 
        borderRadius: 5, 
        margin: 5,
    },
    footerButtonText: {
        fontWeight: 'bold',
        color: '#007AFF', 
    },
});

export default ToDoList;
