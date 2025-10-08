import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { USE_DEV_FIREBASE } from '@env';

const firebaseConfigDev = {
    apiKey: "AIzaSyBmwh5SPrkF3pj2wMeGDgVHDNNHzcvOVls",
    authDomain: "bdeliverydev.firebaseapp.com",
    projectId: "bdeliverydev",
    storageBucket: "bdeliverydev.firebasestorage.app",
    messagingSenderId: "959806247625",
    appId: "1:959806247625:web:eca9dff56dc9cbad357318",
    measurementId: "G-RJ5TN3DNJ8"
};

const firebaseConfigProd = {
    apiKey: "AIzaSyAvoKR56EZWCdDFFzo32hkc80ErnpgsINc",
    authDomain: "bdelivery-450104.firebaseapp.com",
    projectId: "bdelivery-450104",
    storageBucket: "bdelivery-450104.firebasestorage.app",
    messagingSenderId: "74919787230",
    appId: "1:74919787230:web:eb2fe1b1c7bf2a2fa3604f",
    measurementId: "G-ZR3QKFVJJ0"
};


// Initialize Firebase
const devApp = initializeApp(firebaseConfigDev);
const prodApp = initializeApp(firebaseConfigProd);

export const devDb = getFirestore(devApp);
export const prodDb = getFirestore(prodApp);



