import {
    redirect
} from "react-router-dom";
import {
    usersCollection
} from "./firebase";

import {
    addDoc,
    query,
    where,
    getDocs
} from "firebase/firestore";

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 3000))
}

export async function registerUser(creds) {

    await sleep();
    return {
        message: 'success'
    }

    try {
        addDoc(usersCollection, creds);
    } catch (e) {
        throw new Error(e)
    }
    return {
        message: "Users Registered successfully"
    }
}

export async function loginUser({
    email,
    password
}) {
    const userQuery = query(usersCollection, where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty)
        throw new Error('No User Found!')

    return {
        message: 'user exists'
    }

}