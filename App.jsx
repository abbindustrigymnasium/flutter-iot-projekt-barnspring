import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import ProgressCircle from './progressCircle.jsx';
import { useFonts } from 'expo-font';

const App = () => {
  const [todaysGoal, setTodaysGoal] = useState(3.6);

  let [fontsLoaded] = useFonts({
    'PM': require('./assets/fonts/Poppins-Medium.ttf'),
    'PR': require('./assets/fonts/Poppins-Regular.ttf'),
    'PSB': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'PB': require('./assets/fonts/Poppins-Bold.ttf'),
  });
  const [progress, setProgress] = useState(0); // Progress bar 0-100 sen repeatar den alltså 101 = 1

  const handlePress = () => {
    setProgress(progress + 10);
  };

  if (!fontsLoaded) {
    // loading screen
    return;
  }
  return (
    <View className="w-full h-full flex flex-col items-center bg-[#0A0A1C]">
      <View className="w-11/12 mt-10 flex items-start">
        <Text className="text-white text-3xl font-[PM] font-semibold">
          Dashboard
        </Text>
      <View className=" w-full h-36 bg-[#10102C] mt-6 flex justify-center items-center">
        <View className=" w-full h-5/6 flex items-center justify-between">
          <Text className="text-white text-xl font-[PM]">
            Todays Goal
          </Text>
          <View className=" w-[100px] h-[100px] bg-white">
            <Text className="text-white text-xl font-[PM]">{todaysGoal}</Text>
          </View>
          <Text className="text-white text-xl font-[PM]">
            ...
          </Text>
          <View className=" -rotate-90">
            <ProgressCircle progress={progress} size={100} strokeWidth={10} color="#007AFF" />
          </View>
            <Button title="Increase" onPress={handlePress} />
        </View>
      </View>
      </View>
    </View>
  )
}

export default App;
