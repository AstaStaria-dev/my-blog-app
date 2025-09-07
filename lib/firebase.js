// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvL1-4jGAroCOyIBo_Eap-RQ8__un-K_I",
  authDomain: "my-blog-app-8bed6.firebaseapp.com",
  projectId: "my-blog-app-8bed6",
  storageBucket: "my-blog-app-8bed6.firebasestorage.app",
  messagingSenderId: "755620018436",
  appId: "1:755620018436:web:0e5fa247874187fc83b851"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);