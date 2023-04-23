import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Button, Text, Dimensions  } from 'react-native';
import ProgressCircle from './progressCircle.jsx';
import { useFonts } from 'expo-font';
import Swiper from 'react-native-swiper'
import { SvgXml } from 'react-native-svg';
import * as Progress from 'react-native-progress';

import allChallenges from './test_challenges.json';


import DashboardSvg from './assets/svg/Dashboard.svg';
import StatsSvg from './assets/svg/Stats.svg';
import MapSvg from './assets/svg/Map.svg';
import ProfileSvg from './assets/svg/Profile.svg';

import Map2Svg from './assets/svg/Map2.svg';
import StepsSvg from './assets/svg/Steps.svg';
import SpeedSvg from './assets/svg/Speed.svg';


const App = () => {

  const { width } = Dimensions.get('window');
  const swiperRef = useRef(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  
  const sortedChallenges = allChallenges.sort((a, b) => {
    if (a.type < b.type) {
      return -1;
    }
    if (a.type > b.type) {
      return 1;
    }
    return 0;
  });
  const topChallenges = allChallenges.sort((a, b) => {
    return b.progress / b.goal - a.progress / a.goal;
  }).slice(0, 3);

  // const [allChallenges, setChallenges] = useState([]);

  // useEffect(() => {
  //   fetch('./test_challenges.json')
  //     .then((response) => response.json())
  //     .then((json) => setChallenges(json))
  //     .catch((error) => console.error(error));
  // }, []);

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
      <Swiper
          paginationStyle={{
            bottom: -1000
          }}
          loop={false}
          ref={swiperRef}
          onIndexChanged={(e) => setCurrentPageIndex(e)}
        >
          {/* Start of page 0 */}
          <View className="w-full mt-20 flex items-center">
            <View className="w-11/12">
            <Text className="text-white text-3xl font-[PM] font-semibold">
              Dashboard
            </Text>
            <View className="w-full flex justify-center items-center">
              <View className="bg-[#10102C] mt-6 flex justify-center items-center w-full h-[300px] rounded-3xl border-[#20204C] border">
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
            <Text className="text-white text-2xl mt-6 mb-2 font-[PM] font-semibold">
              Challenges
            </Text>
            {topChallenges.map((challenge) => (
              <View key={challenge.title} className="flex justify-center h-14">
                <View className="flex flex-row w-full justify-center">
                  <SvgXml width={22} height={22} xml={challenge.type === 'speed' ? SpeedSvg : challenge.type === 'map' ? Map2Svg : challenge.type === "steps" ? StepsSvg : 'Unknown challenge'} className="fill-white"/>
                  <Text className="text-white text-base font-[PM] ml-2 max-w-[82%] h-8 overflow-hidden">{challenge.title}</Text>
                  <Text className="text-xl font-[PM] ml-auto text-[#0085FF]">{challenge.points}</Text>
                </View>
                <Progress.Bar className="w-full" color="#0085FF" unfilledColor="" borderWidth={0} progress={challenge.progress/challenge.goal} width={width*(11/12)} />
              </View>
            ))}
          </View>
          {/* End of page 0 */}
          </View>
          <View className="w-full mt-20 flex items-center">
            <View className="w-11/12">
            <Text className="text-white text-3xl mb-6 font-[PM] font-semibold">
              Challenges
            </Text>
            {sortedChallenges.map((challenge) => (
              <View key={challenge.title} className="flex justify-center">
                <View className="flex flex-row mt-4">
                  <SvgXml width={22} height={22} xml={challenge.type === 'speed' ? SpeedSvg : challenge.type === 'map' ? Map2Svg : challenge.type === "steps" ? StepsSvg : 'Unknown challenge'} className="fill-white"/>
                  <Text className="text-white text-sm font-[PM] ml-2">{challenge.type}</Text>
                </View>
                <View className="flex flex-row w-full justify-center">
                  <Text className="text-white text-lg font-[PM] max-w-[95%]">{challenge.title}</Text>
                  <Text className="text-xl font-[PM] ml-auto text-[#0085FF]">{challenge.points}</Text> 
                </View>
                <Progress.Bar className="w-full my-3" color="#0085FF" unfilledColor="" borderWidth={0} progress={challenge.progress/challenge.goal} width={width*(11/12)} height={10}/>
              </View>
            ))}
            </View>
          </View>
          <View className="w-full mt-20 flex items-center">
            <View className="w-11/12">
              <Text className="text-white text-3xl mb-6 font-[PM] font-semibold">
                Stats
              </Text>
            </View>
          </View>
          <View className="w-full mt-20 flex items-center">
            <View className="w-11/12">
              <Text className="text-white text-3xl mb-6 font-[PM] font-semibold">
                Profile
              </Text>
            </View>
          </View>
        </Swiper>
        <View className="w-full h-20 flex flex-row justify-around bg-[#10102C]">
          <TouchableOpacity className="w-1/4 flex pt-4 items-center" onPress={() => swiperRef.current?.scrollTo(0)}>
            <SvgXml width={24} height={24} xml={DashboardSvg} className={`fill-[#0085FF] opacity-${currentPageIndex == 0 ? "100" : "50" }`} />
          </TouchableOpacity>
          <TouchableOpacity className="w-1/4 flex pt-4 items-center" onPress={() => swiperRef.current?.scrollTo(1)}>
            <SvgXml width={24} height={24} xml={StatsSvg} className={`fill-[#0085FF] opacity-${currentPageIndex == 1 ? "100" : "50" }`}/>
          </TouchableOpacity>
          <TouchableOpacity className="w-1/4 flex pt-4 items-center" onPress={() => swiperRef.current?.scrollTo(2)}>
            <SvgXml width={24} height={24} xml={MapSvg} className={`fill-[#0085FF] opacity-${currentPageIndex == 2 ? "100" : "50" }`}/>
          </TouchableOpacity>
          <TouchableOpacity className="w-1/4 flex pt-4 items-center" onPress={() => swiperRef.current?.scrollTo(3)}>
            <SvgXml width={24} height={24} xml={ProfileSvg} className={`fill-[#0085FF] opacity-${currentPageIndex == 3 ? "100" : "50" }`}/>
          </TouchableOpacity>
          
        </View>
    </View>
  )
}

export default App;
