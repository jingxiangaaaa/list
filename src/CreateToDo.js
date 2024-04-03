import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Battery from 'expo-battery';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'react-native';


export default function CreateToDo() {
    const [todoText, setTodoText] = useState('');
    const [image, setImage] = useState(null);
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [networkState, setNetworkState] = useState(null);
    const [locationInfo, setLocationInfo] = useState('');
    const backgroundImage = require('../assets/1.jpg');

    const handleSubmit = async () => {
        // 创建一个对象来保存待办事项的信息
        const currentBatteryLevel = await Battery.getBatteryLevelAsync();
        const todoItem = {
            id: Date.now().toString(),
            text: todoText,
            image: image,
            batteryLevel: currentBatteryLevel,
            networkState: networkState ? (networkState.isConnected ? (networkState.type === Network.NetworkStateType.WIFI ? 'Wi-Fi' : 'Mobile network') : 'Offline') : 'Detecting...',
            location: locationInfo,
            timestamp: new Date().toISOString(),
        };
        // 从 AsyncStorage 获取当前的待办事项列表
        const currentTodos = JSON.parse(await AsyncStorage.getItem('todos')) || [];
        // 将新的待办事项添加到列表中
        const updatedTodos = [...currentTodos, todoItem];
        // 将更新后的待办事项列表保存回 AsyncStorage
        await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
        Alert.alert('Publish Successful!');
        // 重置状态以清空表单
        setTodoText('');
        setImage(null);
    };

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need photo gallery access permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        console.log("Image selection result:", result);
        if (!result.cancelled && result.assets) {
            setImage(result.assets[0].uri);
            console.log("Set image URI:", result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera access permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        console.log("Photo taking result:", result);
        if (!result.cancelled && result.assets) {
            setImage(result.assets[0].uri);
            console.log("Set image URI:", result.assets[0].uri);
        }
    };

    const readBatteryLevel = async () => {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        setBatteryLevel(batteryLevel);
    };
    useEffect(() => {
        readBatteryLevel();
        checkNetwork();

        // 订阅电池电量变化事件
        const batteryLevelListener = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(batteryLevel);
        });
        return () => {
            batteryLevelListener.remove();
        };
    }, []);
    const checkNetwork = async () => {
        const networkState = await Network.getNetworkStateAsync();
        setNetworkState(networkState);
    };

    const getCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access location was denied');
            return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;

        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverseGeocode.length > 0) {
            const { city } = reverseGeocode[0];
            setLocationInfo(`City: ${city || 'Unknown'}, Longitude: ${longitude.toFixed(6)}, Latitude: ${latitude.toFixed(6)}`);
        } else {
            setLocationInfo(`Longitude: ${longitude.toFixed(6)}, Latitude: ${latitude.toFixed(6)}`);
        }
    };

    React.useEffect(() => {
        readBatteryLevel();
        checkNetwork();
    }, []);

    return (
        <ImageBackground source={backgroundImage} style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter a todo item..."
                onChangeText={setTodoText}
                value={todoText}
            />
            <Text>Battery: {batteryLevel ? `${Math.round(batteryLevel * 100)}%` : 'Fetching...'}</Text>
            <Text>Network status: {
                networkState ?
                    (networkState.isConnected ?
                        (networkState.type === Network.NetworkStateType.WIFI ? 'Wi-Fi' : 'Mobile network')
                        : 'Offline')
                    : 'Detecting...'
            }</Text>


            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} onPress={handleImagePick}>
                    <Text style={styles.buttonText}>Pick an image from gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                    <Text style={styles.buttonText}>Take a photo</Text>
                </TouchableOpacity>
            </View>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <View style={styles.locationInfo}>
                <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
                    <Text style={styles.buttonText}>Get Location</Text>
                </TouchableOpacity>
                <Text style={styles.locationText}>Location: {locationInfo || 'Location info not obtained'}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Publish</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      resizeMode: "cover", // white background color
    },
    input: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginBottom: 20,
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    image: {
      width: '100%', // take up full container width
      aspectRatio: 1, // the height will be the same as the width
      borderWidth: 1,
      borderColor: 'gray',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    locationText: {
      marginLeft: 10,
      flex: 1, // take up as much space as possible
    },
    publishButton: {
      backgroundColor: 'blue',
      color: 'white',
      padding: 15,
      borderRadius: 5,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: 'gray',
      paddingTop: 10,
    },
    footerButton: {
      fontWeight: 'bold',
    },
    button: {
        top: 5,
        backgroundColor: '#4A708B', // Bootstrap primary button color
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
      },
      buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
      },
  });
  

