import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, Text, View, StyleSheet, Pressable, TextInput } from 'react-native';
import { addUser, auth } from './utils/firebase';
import Swiper from 'react-native-swiper'
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';

function epochToTimeString(epoch) {
  const date = new Date(epoch);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function App() {
  const [location, setLocation] = useState(null);
  const [currentUser, setCurrentUser] = useState();
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
        updateProfile(user,{displayName: username})
        // sendEmailVerification(user)
        // .then(() => {
        //   console.log("Sent Verification Email")
        //   // Show "Check Email"
        // })
        console.log(user)
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
    //   (async () => {
        
    //     let { status } = await Location.requestForegroundPermissionsAsync();
    //     if (status !== 'granted') {
    //       setErrorMsg('Permission to access location was denied');
    //       return;
    //     }
    
    //     let location = await Location.getCurrentPositionAsync({
    //       accuracy: Location.Accuracy.Highest
    //     });
    //     setLocation(location);
    //   })();
    // }, []);
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
          console.log(user)
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
      
      // useEffect(() => {
      //   (async () => {
          
      //     let { status } = await Location.requestForegroundPermissionsAsync();
      //     if (status !== 'granted') {
      //       setErrorMsg('Permission to access location was denied');
      //       return;
      //     }
      
      //     let location = await Location.getCurrentPositionAsync({
      //       accuracy: Location.Accuracy.Highest
      //     });
      //     setLocation(location);
      //   })();
      // }, []);
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
              </View>
            </View>
        )
      }
  

  if(currentUser)
  {
    console.log(currentUser)
    const handleSignOut = () => {
      signOut(auth).then(() => {
        console.log("success")
        setCurrentUser("")
      })
      .catch((err) => {
        console.log(err)
      })
    }
    return (
      <Swiper
      className="bg-[#0A0A1C] flex justify-center items-center"
      loop={false}
      showsPagination={false}
      index={0}>
      <View className="flex h-full pt-12 px-4 w-full">
        <Text className="text-white font-bold text-[28px]">Hey {currentUser.displayName}, looking great!</Text>
        <View style={{borderWidth: "1px", borderColor: "rgba(124,124,255,0.15)" }} className="mt-4 rounded-[20px] bg-[#10102C] w-[400px] h-[300px]">
          <Swiper
          loop
          activeDotColor='white'
          dotColor='rgba(255,255,255,0.15)'
          
          showsPagination={true}
          index={0}
          >
            <View className="w-full mt-2 flex items-center justify-center">
              <Text className="text-white w-full text-center font-semibold text-xl">Todays Goal</Text>
            </View>
            <View>
              <Text>Hej</Text>
            </View>
          </Swiper>
        </View>
        <Pressable onPress={handleSignOut} className="bg-[#0085FF] flex w-fit p-4 justify-center items-center rounded-lg">
          <Text className="font-semibold text-lg text-white">
            Log out
          </Text>
        </Pressable>
      </View>
      <View className="flex justify-center items-center h-full">
        <Text className="text-white">Heil hitler</Text>
      </View>
      <View className="flex justify-center items-center h-full">
        <Text className="text-white">Skrunk</Text>
      </View>
    </Swiper> 
    )
  }
  else
  {
    return(
      <LogIn/>
    )
  }
}
