import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Button, Text, Dimensions, Pressable, TextInput, ScrollView } from 'react-native';
import ProgressCircle from './progressCircle.jsx';
// import Chart from './chart.jsx';
import { useFonts } from 'expo-font';
import Swiper from 'react-native-swiper'
// Consult "https://github.com/leecade/react-native-swiper" for more info on swiper
import { SvgXml } from 'react-native-svg';
import * as Progress from 'react-native-progress';
import { addToDistance, auth, getDistance } from './utils/firebase';
// Consult "https://github.com/oblador/react-native-progress" for more info on progress bars (line not circle)
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import { getUserExtraInfo, addUserExtraInfo } from './utils/firebase';

import allChallenges from './test_challenges.json';
// Host challenges on db in future


// SVG imports
import DashboardSvg from './assets/svg/Dashboard.svg';
import StatsSvg from './assets/svg/Stats.svg';
import MapSvg from './assets/svg/Map.svg';
import ProfileSvg from './assets/svg/Profile.svg';

import Map2Svg from './assets/svg/Map2.svg';
import StepsSvg from './assets/svg/Steps.svg';
import SpeedSvg from './assets/svg/Speed.svg';

import * as Location from 'expo-location';
import haversine from 'haversine-distance';
// Consult "https://docs.expo.dev/versions/latest/sdk/location/" for info on location tracking

function epochToTimeString(epoch) {
  const date = new Date(epoch);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function epochToDate(epoch) {
  const date = new Date(epoch);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const App = () => {

  const { width } = Dimensions.get('window');
  const swiperRef = useRef(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState();
  const [location, setLocation] = useState();
  const [currentDistance, setCurrentDistance] = useState();
  const [distanceDiff, setDistanceDiff] = useState();
  const [prevCoords, setPrevCoords] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setCurrentUser(user);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, [])

  // useEffect(() => {
  //   const distance = async () => {
  //     if (location) {
  //       const date = epochToDate(location.timestamp);
  //       const dist = await getDistance(currentUser.uid, date);
  //       setCurrentDistance(dist)
  //     }
  //   }
  //   distance();
  // }, [distanceDiff])

  useEffect(() => {
    if (currentUser) {
      let pprevCoords;
      let trackingCount = 0;
      const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log("Please grant location permissions.");
          return;
        }
        
        await Location.watchPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 0.1,
        },
        async (loc) => {
          setLocation(loc);
          let coords = [loc?.coords.latitude, loc?.coords.longitude];
          if (pprevCoords) { 
            console.log(trackingCount)
            if (trackingCount % 10 === 0) { 
              let dist = Math.round(haversine(pprevCoords, coords));
              let date = epochToDate(loc?.timestamp)
              const added = await addToDistance(currentUser.uid, dist, date)
              if (added) {
                console.log(added)
                setCurrentDistance(added)
              }
              else {
                const dist = await getDistance(currentUser.uid, date);
                setCurrentDistance(dist)
              }
              console.log("DISTANCE ADDED: ", dist, "meter");
            }
          }
          pprevCoords = coords;
          trackingCount++;
          console.log("Location:", "\n", loc);
        });
      }
      getLocation()
    }
  }, [currentUser])
  // Display login (true) or signup (false)
  const [displayLogin, setDisplayLogin] = useState(false);
  

  // Sorts challenges to its types
  const speedChallenges = allChallenges.filter((challenge) => challenge.type === 'speed');
  const stepsChallenges = allChallenges.filter((challenge) => challenge.type === 'steps');
  const mapChallenges = allChallenges.filter((challenge) => challenge.type === 'map');


  // The challenges that are the closest to completio
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

  // Custom style for "glow-effect" on the progress circle
  const shadowStyle = {
    shadowColor: '#0085FF',
    shadowRadius: 20,
    shadowOpacity: 1,
  };
  const borderStyle = {
    borderRadius: 100,
    overflow: 'hidden',
  };

  // Loads custom font "Poppins"
  let [fontsLoaded] = useFonts({
    'PM': require('./assets/fonts/Poppins-Medium.ttf'),
    'PR': require('./assets/fonts/Poppins-Regular.ttf'),
    'PSB': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'PB': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  // Variable that controlls todays goal bar
  const [todaysGoal, setTodaysGoal] = useState(0); // Progress bar 0-size sen repeatar den alltså size+1 = 1

  // Test button to test the progress bar (not needed in final product)
  const handlePress = () => {
    setTodaysGoal(todaysGoal + 10);
  };

  const SignUp = () => {
    const [errorMsg, setErrorMsg] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleCreateUser = () => {
      if(password !== confirmPassword){
        setErrorMsg("Passwords do not match.")
        return setTimeout(() => setErrorMsg(""), 3000)
      }
    
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const userId = user.uid;
        updateProfile(user, { displayName: username })
        addUserExtraInfo(userId, {
          userName: username,
        })
        // sendEmailVerification(user)
        // .then(() => {
        //   console.log("Sent Verification Email")
        // })
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        setErrorMsg(errorMessage)
        setTimeout(() => setErrorMsg(""), 3000)
        // ..
      });
    }
    
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
        }
      });
    }, [])
      return(
          <View className="h-full w-full flex px-4 justify-center items-center bg-[#0A0A1C]">
            <View className="flex flex-col gap-3 w-full focus:bottom-[132px] transition-all">
            <Text className="text-rose-600">{errorMsg}</Text>
            <Text className="w-full text-3xl font-bold text-white">Create your account</Text>
              <View className="w-full flex flex-col">
                <Text className="text-white text-base font-semibold">Username</Text>
                <TextInput style={{borderWidth: "1px", borderColor: "rgba(255,255,255,0.15)"}} className="align-text-top flex font-semibold bg-[#10102C] text-base w-full justify-center items-center text-white rounded-lg py-4 px-4" placeholderTextColor="rgba(255,255,255,0.35)" placeholder='Enter username...' 
                value={username} onChangeText={text => setUsername(text)} keyboardAppearance='dark'/>
              </View>
              <View className="w-full flex flex-col">
                <Text className="text-white text-base font-semibold">Email</Text>
                <TextInput style={{borderWidth: "1px", borderColor: "rgba(255,255,255,0.15)"}} className="align-text-top flex font-semibold bg-[#10102C] text-base w-full justify-center items-center text-white rounded-lg py-4 px-4" placeholderTextColor="rgba(255,255,255,0.35)" placeholder='Enter email address...' 
                value={email} keyboardType='email-address' onChangeText={text => setEmail(text)} keyboardAppearance='dark'/>
              </View>
              <View className="w-full flex flex-col">
                <Text className="text-white text-base font-semibold">Password</Text>
                <TextInput style={{borderWidth: "1px", borderColor: "rgba(255,255,255,0.15)"}} className="flex font-semibold bg-[#10102C] text-base w-full justify-center items-center text-white rounded-lg py-4 px-4" placeholderTextColor="rgba(255,255,255,0.35)" placeholder='Enter password...' 
                value={password} textContentType='newPassword' secureTextEntry onChangeText={text => setPassword(text)} keyboardAppearance='dark'/>
              </View>
              <View className="w-full flex flex-col">
                <Text className="text-white text-base font-semibold">Confirm Password</Text>
                <TextInput style={{borderWidth: "1px", borderColor: "rgba(255,255,255,0.15)"}} className="flex font-semibold bg-[#10102C] text-base w-full justify-center items-center text-white rounded-lg py-4 px-4" placeholderTextColor="rgba(255,255,255,0.35)" placeholder='Confirm password...' 
                value={confirmPassword} secureTextEntry textContentType='newPassword' onChangeText={text => setConfirmPassword(text)} keyboardAppearance='dark'/>
              </View>
    
            <Pressable className="bg-[#0085FF] w-full rounded-lg px-4 py-4" onPress={() => handleCreateUser({email, password})}>
              <Text className="text-lg font-semibold text-center text-white">
                Sign up
              </Text>
            </Pressable>
            <Pressable className="bg-transparent w-full rounded-lg" onPress={() => setDisplayLogin(true)}>
                <Text className="text-lg underline font-medium text-center text-white">
                  Already have an account?
                </Text>
              </Pressable>
            </View>
          </View>
      )
    }

  const LogIn = () => {
      const [errorMsg, setErrorMsg] = useState(null);
      const [username, setUsername] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage)
          setErrorMsg(errorMessage)
          setTimeout(() => setErrorMsg(""), 3000)
        });
      }
      
      useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            setCurrentUser(user);
            // ...
          } else {
            // User is signed out
            // ...
          }
        });
      }, [])
        return(
            <View className="h-full w-full flex px-4 justify-center items-center bg-[#0A0A1C]">
              {/* {
                (location)?
                <View>
                <Text className="text-white">Longitude: {location?.coords.longitude}</Text>
                  <Text className="text-white">Latitude: {location?.coords.latitude}</Text>
                  <Text className="text-white">Timestamp: {epochToTimeString(location?.timestamp)}</Text>
                  </View>
                :""
              } */}
              <View className="flex flex-col gap-3 w-full focus:bottom-[132px] transition-all">
              <Text className="text-rose-600">{errorMsg}</Text>
              <Text className="w-full text-3xl font-bold text-white">Log in to your account</Text>
                <View className="w-full flex flex-col">
                  <Text className="text-white text-base font-semibold">Email</Text>
                  <TextInput style={{borderWidth: "1px", borderColor: "rgba(255,255,255,0.15)"}} className="align-text-top flex font-semibold bg-[#10102C] text-base w-full justify-center items-center text-white rounded-lg py-4 px-4" placeholderTextColor="rgba(255,255,255,0.35)" placeholder='Enter email address...' 
                  value={email} keyboardType='email-address' onChangeText={text => setEmail(text)} keyboardAppearance='dark'/>
                </View>
                <View className="w-full flex flex-col">
                  <Text className="text-white text-base font-semibold">Password</Text>
                  <TextInput style={{borderWidth: "1px", borderColor: "rgba(255,255,255,0.15)"}} className="flex font-semibold bg-[#10102C] text-base w-full justify-center items-center text-white rounded-lg py-4 px-4" placeholderTextColor="rgba(255,255,255,0.35)" placeholder='Enter password...' 
                  value={password} textContentType='newPassword' secureTextEntry onChangeText={text => setPassword(text)} keyboardAppearance='dark'/>
                </View>
      
              <Pressable className="bg-[#0085FF] w-full rounded-lg px-4 py-4" onPress={() => handleLogin({email, password})}>
                <Text className="text-lg font-semibold text-center text-white">
                  Log in
                </Text>
              </Pressable>
              <Pressable className="bg-transparent w-full rounded-lg" onPress={() => setDisplayLogin(false)}>
                <Text className="text-lg underline font-medium text-center text-white">
                  Need an account?
                </Text>
              </Pressable>
              </View>
            </View>
        )
      }
  
  if (!fontsLoaded) {
    // Here you can return a loadingscreen if fonts are not loaded in
    return;
  }
  if(currentUser)
  {
    const handleSignOut = () => {
      signOut(auth).then(() => {
        console.log("success")
        setCurrentUser(null)
      })
      .catch((err) => {
        console.log(err)
      })
    }
    return (
      <View className="w-full h-full flex flex-col items-center bg-[#0A0A1C]">
      <ScrollView>
      <Swiper
          paginationStyle={{
            bottom: -1000
          }}
          loop={false}
          onIndexChanged={(e) => setCurrentPageIndex(e)}
          ref={swiperRef}
        >
          {/* Start of Dashboard */}
          <View className="w-full mt-20 flex items-center">
            <View className="w-11/12">
              <Text className="text-white uppercase font-bold opacity-50">
                {currentUser.displayName} - {epochToDate(location?.timestamp)}
              </Text>
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
                      <ProgressCircle progress={((currentDistance/1000)/3.2)*150} size={150} strokeWidth={10} color="#0085FF" />
                    </View>
                  </View>
                  <Text className="text-white text-xl font-[PM]">
                  </Text>
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
                  <Text className="text-xl font-[PM] ml-auto text-[#0085FF]">+{challenge.points}</Text>
                </View>
                <Progress.Bar className="w-10/12 ml-8" color="#0085FF" unfilledColor="#16163C" borderWidth={0} progress={challenge.progress/challenge.goal} width={width*(10/12)} />
              </View>
            ))}
          </View>
          {/* Start of Challenges */}
          </View>
          <View className="w-full mt-20 flex items-center">
            <View className="w-11/12">
            <Text className="text-white text-3xl mb-6 font-[PM] font-semibold">
              Challenges
            </Text>
            <View className="flex flex-row">
            <SvgXml width={22} height={22} xml={StepsSvg} className="fill-white"/>
              <Text className="text-white text-xl ml-2 mb-2 font-[PM] font-semibold">
                Steps
              </Text>
            </View>
            {stepsChallenges.map((challenge) => (
              <View key={challenge.title} className="flex justify-center items-center">
                <View className="w-10/12 flex flex-row">
                  <View className="flex">
                    <Text className={`text-white ${(challenge.progress === challenge.goal) ? "line-through opacity-50":""} text-base font-[PM]`}>{challenge.title}</Text>
                    {challenge.progress === challenge.goal ? 
                    <View></View>
                    :
                    <Text className="text-white opacity-50 text-xs font-[PM]">{challenge.progress}/{challenge.goal}</Text>
                    }
                  </View>
                  <Text className="text-xl font-[PM] ml-auto text-[#0085FF]">+{challenge.points}</Text> 
                </View>
                <Progress.Bar className="w-10/12 my-3" color="#0085FF" unfilledColor="#16163C" borderWidth={0} progress={challenge.progress/challenge.goal} width={width*(10/12)} height={10}/>
              </View>
            ))}
            <View className="flex flex-row mt-4">
            <SvgXml width={22} height={22} xml={Map2Svg} className="fill-white"/>
              <Text className="text-white text-xl ml-2 mb-2 font-[PM] font-semibold">
                Map
              </Text>
            </View>
            {mapChallenges.map((challenge) => (
              <View key={challenge.title} className="flex justify-center items-center">
                <View className="w-10/12 flex flex-row">
                  <View className="flex">
                    <Text className={`text-white ${(challenge.progress === challenge.goal) ? "line-through opacity-50":""} text-base font-[PM]`}>{challenge.title}</Text>
                    {challenge.progress === challenge.goal ? 
                    <View></View>
                    :
                    <Text className="text-white opacity-50 text-xs font-[PM]">{challenge.progress}/{challenge.goal}</Text>
                    }
                  </View>
                  <Text className="text-xl font-[PM] ml-auto text-[#0085FF]">+{challenge.points}</Text> 
                </View>
                <Progress.Bar className="w-10/12 my-3" color="#0085FF" unfilledColor="#16163C" borderWidth={0} progress={challenge.progress/challenge.goal} width={width*(10/12)} height={10}/>
              </View>
            ))}
            <View className="flex flex-row mt-4">
            <SvgXml width={22} height={22} xml={SpeedSvg} className="fill-white"/>
              <Text className="text-white text-xl ml-2 mb-2 font-[PM] font-semibold">
                Speed
              </Text>
            </View>
            {speedChallenges.map((challenge) => (
              <View key={challenge.title} className="flex justify-center items-center">
                <View className="w-10/12 flex flex-row">
                  <View className="flex">
                    <Text className={`text-white ${(challenge.progress === challenge.goal) ? "line-through opacity-50":""} text-base font-[PM]`}>{challenge.title}</Text>
                    {challenge.progress === challenge.goal ? 
                    <View></View>
                    :
                    <Text className="text-white opacity-50 text-xs font-[PM]">{challenge.progress}/{challenge.goal}</Text>
                    }
                  </View>
                  <Text className="text-xl font-[PM] ml-auto text-[#0085FF]">+{challenge.points}</Text> 
                </View>
                <Progress.Bar className="w-10/12 my-3" color="#0085FF" unfilledColor="#16163C" borderWidth={0} progress={challenge.progress/challenge.goal} width={width*(10/12)} height={10}/>
              </View>
            ))}
            </View>
          </View>
          {/* Start of Stats */}
          <View className="w-full mt-20 flex items-center">
            <View className="w-11/12">
              <Text className="text-white text-3xl mb-6 font-[PM] font-semibold">
                Stats
              </Text>
              {/* <Chart/> */}
              <View className="bg-[#10102C] mt-6 py-3 flex flex-row justify-around items-center w-full rounded-3xl border-[#20204C] border">
                <View className="flex items-center">
                  <Text className="text-white text-lg font-[PM]">
                    {currentDistance/1000} km
                  </Text>
                  <Text className="text-white opacity-50 text-xs font-[PM]">
                    Running
                  </Text>
                </View>
                <View className="flex items-center">
                  <Text className="text-white text-lg font-[PM]">
                    {Math.round(currentDistance/1000)}h {Math.round(((currentDistance/1000)%1)*10)/10*60}min
                  </Text>
                  <Text className="text-white opacity-50 text-xs font-[PM]">
                    Screentime
                  </Text>
                </View>
                <View className="flex items-center">
                  <Text className="text-white text-lg font-[PM]">
                    {Math.round(location?.coords.altitude)}m
                  </Text>
                  <Text className="text-white opacity-50 text-xs font-[PM]">
                    Altitude
                  </Text>
                </View>
                </View>
                {
              (location)?
                <View className="bg-[#10102C] mt-6 py-3 flex flex-col items-center w-full rounded-3xl border-[#20204C] border">
                      <View className="flex flex-row p-1 justify-center w-full ">
                        <Text className="text-[#0085FF] text-lg font-semibold">{location?.coords.latitude}</Text>
                      </View>
                      <View className="flex flex-row p-1 justify-center w-full ">
                        <Text className="text-[#0085FF] text-lg font-semibold">{location?.coords.longitude}</Text>
                      </View>
                <Text className="text-white opacity-50 font-[PM]">{epochToTimeString(location?.timestamp)}</Text>
                </View>
              :""
            }
            </View>
          </View>
          {/* Start of Profile */}
          <View className="w-full mt-20 flex items-center">
            <View className="w-11/12">
              <Text className="text-white text-3xl mb-6 font-[PM] font-semibold">
                Profile
              </Text>
              <Pressable onPress={handleSignOut} className="bg-[#0085FF] flex w-fit p-4 justify-center items-center rounded-lg">
                <Text className="font-semibold text-lg text-white">
                  Log out
                </Text> 
              </Pressable>
            </View>
          </View>
        </Swiper>
        </ScrollView>
        {/* Start of Navbar */}
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
  else
  {
    if (displayLogin) {
      return(
        <LogIn/>
        )
    } else {
      return (
        <SignUp/>
      )
    }
  }
}

export default App;
