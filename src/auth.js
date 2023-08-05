import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import {
    auth
} from "./firebase";
import {
    redirect
} from "react-router-dom";


export async function registerUser(creds) {
    try {
        await createUserWithEmailAndPassword(auth, creds.email, creds.password)
            .then((userCreds) => {
                console.log(userCreds)
            })
    } catch (err) {
        throw new Error(err.message)
    }
}

export async function signInUser(creds) {
    try {
        await signInWithEmailAndPassword(auth, creds.email, creds.password)
            .then(userCreds => {
                console.log(userCreds)
            })
    } catch (err) {
        throw new Error(err.message)
    }
}

export async function getSignedInUser() {
    onAuthStateChanged(auth, user => {
        localStorage.setItem('userAuth', user.email)
    })
}