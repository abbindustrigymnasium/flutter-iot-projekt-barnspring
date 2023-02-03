import React, { useState } from 'react';
import { Button, View, StyleSheet, Text} from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

function epochToTimeString(epoch) {
  const date = new Date(epoch);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

const App = () => {
  return(
    <View className="w-full h-full flex flex-col justify-center items-center">
      <Text className="text-black text-3xl font-bold">
        smex
      </Text>
    </View>
  )
}

export default App;
