import {
    redirect
} from "react-router-dom";
import {
    batch,
    usersCollection,
    productsCollection,
    ordersCollection,
    receiptsCollection,
    reviewsCollection,
    db
} from "./firebase";



import {
    addDoc,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    query as Query,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import {
    deleteApp
} from "firebase/app";

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
    await sleep();
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
    await sleep();
    // return {
    //     title: "some title",
    //     price: {
    //         originalPrice: 23,
    //         salePrice: 10
    //     },
    //     imgUrl: '/coffee-images/caffe-mocha.png',
    //     origin: 'non-coffee',
    //     rating: 3.4,
    //     desc: 'this is a long desc that your are reading right know'
    // };
    await calculateAverageRating(id)
    const docRef = doc(productsCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists())
        return docSnap.data();
    else throw new Error("Prodcut Doesn't exist")
}

export async function saveOrder(creds) {
    // await sleep();
    // return '000120324'
    try {
        const docRef = await addDoc(ordersCollection, creds);
        return docRef.id;
    } catch (err) {
        return err;
    }
}

export async function getOrderById(id) {
    if (!id) return null;
    // await sleep();
    const docRef = doc(ordersCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists())
        return docSnap.data();
    else throw new Error("Order Doesn't exist")
}

export async function getMyCheckouts(id) {
    const checkoutQuery = query(ordersCollection, where("id", "==", id));
    const querySnapshot = await getDocs(checkoutQuery);
    const checkouts = [];

    querySnapshot.forEach(snapShot => {
        checkouts.push(snapShot.data())
    })


    if (querySnapshot.empty)
        throw new Error('No Checkout exist on the Id!')

    return checkouts
}

export async function deleteCheckouts(id) {
    console.log(id)
    const query = Query(ordersCollection, where('id', '==', id));
    const querySnapshot = await getDocs(query);


    querySnapshot.forEach(async snapshot => {
        console.log(snapshot.data())
        await deleteDoc(snapshot.ref)
    })
}

export async function saveReceipt(creds) {
    try {
        const receiptRef = await addDoc(receiptsCollection, creds);
        await deleteCheckouts('33333')
        return receiptRef.id
    } catch (err) {
        throw err
    }
}

export async function getReceiptById(id) {
    // await sleep();
    const docRef = doc(receiptsCollection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return {
            id: docSnap.id,
            ...docSnap.data()
        };
    else
        throw new Error('Receipt Not Found');

}

export async function getAllReceipt(auth) {
    const query = Query(receiptsCollection, where('auth', '==', auth));
    const querySnapshot = await getDocs(query);
    const receipts = [];

    querySnapshot.forEach(snapshot => {
        receipts.push({
            id: snapshot.id,
            ...snapshot.data()
        })
    })

    return receipts;
}

export async function addReview(creds) {
    const docRef = await addDoc(reviewsCollection, creds)
    await redirectReview(creds); //update products
    return docRef.id;
}

export async function isReviewDone(receiptId, productId) {
    const query = Query(reviewsCollection, where('from', '==', receiptId), where('to', '==', productId));
    const querySnapshot = await getDocs(query);
    return {
        docRef: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
    };
}
export async function updateReview(ref, creds) {
    console.log('updating..')
    const docRef = doc(reviewsCollection, ref);
    await updateDoc(docRef, {
        ...creds
    })
    await redirectUpdatedReview(creds);
    return {
        message: 'review Updated'
    }
}
async function redirectReview(creds) {
    const docRef = doc(productsCollection, creds.to);

    const newReview = {
        rating: creds.rating,
        review: creds.review,
        receiptRef: creds.from
    }

    await updateDoc(docRef, {
        reviews: arrayUnion(newReview),
        rating: await calculateAverageRating(creds.to)
    })

}

async function redirectUpdatedReview(creds) {
    const docRef = doc(productsCollection, creds.to);
    const reviews = (await getDoc(docRef)).data().reviews;
    let oldReview = null;

    for (let review of reviews) {
        if (review.receiptRef == creds.from) {
            oldReview = review
            break;
        }
    }

    const newReview = {
        rating: creds.rating,
        review: creds.review,
        receiptRef: creds.from
    }

    batch.update(docRef, {
        reviews: arrayRemove(oldReview)
    });
    batch.update(docRef, {
        reviews: arrayUnion(newReview)
    });
    await batch.commit();

    await updateDoc(docRef, {
        rating: await calculateAverageRating(creds.to)
    })

}

async function calculateAverageRating(productId) {
    const docRef = doc(productsCollection, productId);
    const docReviews = (await getDoc(docRef)).get('reviews');
    const rating = docReviews.map(review => review.rating);
    const sumOfRating = rating.reduce((partialSum, rate) => parseInt(partialSum) + parseInt(rate), 0);
    const averageRating = sumOfRating / rating.length;

    return averageRating.toFixed(1)
}

export async function getAllReviewsTo() {
    const reviews = (await getDocs(reviewsCollection)).docs;
    const reviewTo = reviews.map(review => ({
        from: review.data().from,
        to: review.data().to
    }));
    return reviewTo
}