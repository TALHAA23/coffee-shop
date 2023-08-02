// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";
import {
    getAnalytics
} from "firebase/analytics";
import {
    getFirestore,
    collection
} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBx_3CwFDhHGzc3QcbrzPkV3CnC_MFSczE",
    authDomain: "coffee-shop-f0d7e.firebaseapp.com",
    projectId: "coffee-shop-f0d7e",
    storageBucket: "coffee-shop-f0d7e.appspot.com",
    messagingSenderId: "705774787261",
    appId: "1:705774787261:web:6e3843a5ddb3bf02ccf5d4",
    measurementId: "G-MRNMX6K8YQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const usersCollection = collection(db, "users");
export const productsCollection = collection(db, "products");
export const ordersCollection = collection(db, "orders");
export const receiptsCollection = collection(db, "receipts");