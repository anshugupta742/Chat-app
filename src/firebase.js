import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCAi0Pa_aM_HotEhiib_ebAoWTRkOdPTmo",
  authDomain: "chat-app-a0964.firebaseapp.com",
  projectId: "chat-app-a0964",
  storageBucket: "chat-app-a0964.appspot.com",
  messagingSenderId: "204086600159",
  appId: "1:204086600159:web:6032d59c6e2f5db1e0246a",
  //measurementId: "G-89ZSZPEVBZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);