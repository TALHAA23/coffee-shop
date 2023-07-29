import {
    redirect
} from "react-router-dom";
import {
    usersCollection,
    productsCollection,
    db
} from "./firebase";

import {
    addDoc,
    query,
    where,
    getDocs,
    getDoc,
    doc
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

export async function getProducts(productOrigin) {
    // await sleep();
    // console.log(productOrigin)
    // const data = [{
    //     title: "some title",
    //     price: {
    //         originalPrice: 23,
    //         salePrice: 10
    //     },
    //     imgUrl: '/coffee-images/caffe-mocha.png',
    //     origin: 'non-coffee',
    //     rating: 3.4,
    //     desc: 'this is a long desc that your are reading right know'
    // }];
    // if (data.origin != productOrigin) return [];
    // return data;

    const data = [];

    try {
        await getDocs(productsCollection).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                if (docData.origin == productOrigin)
                    data.push({
                        id: doc.id,
                        ...docData
                    });
            });
        })
    } catch (err) {
        throw err
    }
    return data;
}

export async function getProductById(id) {
    // await sleep();
    return {
        title: "some title",
        price: {
            originalPrice: 23,
            salePrice: 10
        },
        imgUrl: '/coffee-images/caffe-mocha.png',
        origin: 'non-coffee',
        rating: 3.4,
        desc: 'this is a long desc that your are reading right know'
    };
    const docRef = doc(productsCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists())
        return docSnap.data();
    else throw new Error("Prodcut Doesn't exist")
}