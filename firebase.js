import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPz8tFKYOV6mj1hrjuhGMq3LZh9BCBexw",
  authDomain: "globetrotter-77117.firebaseapp.com",
  projectId: "globetrotter-77117",
  storageBucket: "globetrotter-77117.firebasestorage.app",
  messagingSenderId: "279054044650",
  appId: "1:279054044650:web:74b18e1163e7c81652b693"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
