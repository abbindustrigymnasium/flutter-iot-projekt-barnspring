// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyByWlTlXpwcQGDu6nZ-UW3Ctx3cyO7LFCA",

  authDomain: "barnrun-k.firebaseapp.com",

  projectId: "barnrun-k",

  storageBucket: "barnrun-k.appspot.com",

  messagingSenderId: "332058505282",

  appId: "1:332058505282:web:c3638ae6f5c3e16986fddb"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const auth = getAuth(app);

export const addUser = async ({username}) => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
          userName: username,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}