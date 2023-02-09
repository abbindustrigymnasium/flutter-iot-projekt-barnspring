import React, { useState } from 'react';
import { Button, View, StyleSheet, Text} from 'react-native';
import { useFonts } from 'expo-font';

const App = () => {

  let [fontsLoaded] = useFonts({
    'PM': require('./assets/fonts/Poppins-Medium.ttf'),
    'PR': require('./assets/fonts/Poppins-Regular.ttf'),
    'PSB': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'PB': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    // loading screen
    return;
  }
  return (
    <View className="w-full h-full flex flex-col items-center bg-[#0A0A1C]">
      <View className="w-11/12 mt-10 flex items-start">
        <Text className="text-white text-3xl font-poppins font-semibold">
          Dashboard
        </Text>
      <View className=" w-full h-36 bg-[#10102C] mt-6 flex justify-center items-center">
        <View className=" w-full h-5/6 flex items-center justify-center">
          <Text className="text-white text-xl font-[PM]">
            Todays Goal
          </Text>
          <Text className="text-white text-xl font-[PB]">
            Todays Goal
          </Text>
        </View>
      </View>
      </View>
    </View>
  )
}

export default App;
