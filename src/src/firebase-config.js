// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

const api1 = "AIzaSyBNKNUPz8OAFk";
const api2 = "YpNk7aS9N3M9iWf8O4Q1s";

const firebaseConfig = {
  apiKey: api1 + api2,
  authDomain: "siofok-kc-prod.firebaseapp.com",
  databaseURL: "https://siofok-kc-prod.firebaseio.com",
  projectId: "siofok-kc-prod",
  storageBucket: "siofok-kc-prod.appspot.com",
  messagingSenderId: "533860335896",
  appId: "1:533860335896:web:3b4b21e77e54c34d3ade6d",
  measurementId: "G-99RJXK855R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Get a list of cities from your database
export async function getNews(db) {
  const citiesCol = collection(db, "news");
  const citySnapshot = await getDocs(query(citiesCol));
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}

export async function getExperimentalNews() {
  const citiesCol = collection(db, "ExperimentalNews");
  const citySnapshot = await getDocs(query(citiesCol));
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}

export async function getExperimentalPlayers() {
  const citiesCol = collection(db, "ExperimentalPlayers");
  const citySnapshot = await getDocs(query(citiesCol));
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}

export async function getExperimentalMatches() {
  const citiesCol = collection(db, "ExperimentalMatches");
  const citySnapshot = await getDocs(query(citiesCol));
  const cityList = citySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return cityList;
}

export async function getExperimentalVoting() {
  const citiesCol = collection(db, "ExperimentalVoting");
  const citySnapshot = await getDocs(query(citiesCol));
  const cityList = citySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return cityList;
}
