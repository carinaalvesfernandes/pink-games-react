import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  // Your web app's Firebase configuration
  apiKey: "AIzaSyCifZWVj1gQq--dyIV-aBtPxXyaQMHgUzQ",
  authDomain: "pink-games-react.firebaseapp.com",
  databaseURL: "https://pink-games-react.firebaseio.com",
  projectId: "pink-games-react",
  storageBucket: "pink-games-react.appspot.com",
  messagingSenderId: "534957800178",
  appId: "1:534957800178:web:1bf3e8398cd2cb4abd6e6b",
  measurementId: "G-SYQ2YQKXCG",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById("app"));
