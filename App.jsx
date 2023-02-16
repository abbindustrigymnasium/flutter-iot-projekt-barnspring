import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import ProgressCircle from './progressCircle.jsx';
import { useFonts } from 'expo-font';

const App = () => {

  const shadowStyle = {
    shadowColor: '#0085FF',
    shadowRadius: 20,
    shadowOpacity: 1,
  };
  const borderStyle = {
    borderRadius: 100,
    overflow: 'hidden',
  };

  let [fontsLoaded] = useFonts({
    'PM': require('./assets/fonts/Poppins-Medium.ttf'),
    'PR': require('./assets/fonts/Poppins-Regular.ttf'),
    'PSB': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'PB': require('./assets/fonts/Poppins-Bold.ttf'),
  });
  const [todaysGoal, setTodaysGoal] = useState(0); // Progress bar 0-size sen repeatar den alltså size+1 = 1

  const handlePress = () => {
    setTodaysGoal(todaysGoal + 10);
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
      <View className="w-full flex justify-center items-center">
        <View className="bg-[#10102C] mt-6 flex justify-center items-center w-[95%] h-[300px] rounded-3xl border-[#20204C] border">
          <View className=" w-full h-5/6 flex items-center justify-between">
            <Text className="text-white text-xl font-[PM]">
              Todays Goal
            </Text>
            <View className="relative flex justify-center items-center w-36 h-44">
              <View className=" bg-LB w-[120px] h-[120px] absolute rounded-full">
              </View>
            <View className="absolute flex justify-center items-center">
              <Text className="text-white text-[41px] font-[PM] top-[5px]">
                3.2
              </Text>
              <Text className="text-white text-[12px] top-[-5px] opacity-50 font-[PM]">
                KM
              </Text>
              </View>
              <View className=" -rotate-90" style={[shadowStyle, borderStyle]}>
                <ProgressCircle progress={todaysGoal} size={150} strokeWidth={10} color="#0085FF" />
              </View>
            </View>
            <Text className="text-white text-xl font-[PM]">
              ...
            </Text>
              <Button title="Increase" onPress={handlePress} />
          </View>
        </View>
        </View>
      </View>
    </View>
  )
}

export default App;
