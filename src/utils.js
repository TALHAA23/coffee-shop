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

export async function getProducts() {
    await sleep();
    try {
        const products = await getDocs(productsCollection);
        const data = products.docs.map(product => ({
            id: product.id,
            ...product.data()
        }))
        if (!data.length)
            throw new Error("Coffee Shop has no product");
        return data;
    } catch (err) {
        throw new Error(err.message)
    }
}

export async function getProductById(id) {
    // await sleep();
    // return {
    //     title: "some title",
    //     price: {
    //         originalPrice: 23,
    //         salePrice: 10
    //     },
    //     imgUrl: '/coffee-images/caffe-mocha.png',
    //     origin: 'non-coffee',
    //     rating: 3.4,
    //     reviews: [],
    //     desc: 'this is a long desc that your are reading right know'
    // };

    const docRef = doc(productsCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists())
        return docSnap.data();
    else throw new Error("Prodcut Doesn't exist")
}

export async function saveOrder(creds) {
    // await sleep();
    try {
        const docRef = await addDoc(ordersCollection, creds);
        return docRef.id;
    } catch (err) {
        throw new Error('Something went wrong!')
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

export async function getMyCheckouts(userUid) {
    const checkoutQuery = query(ordersCollection, where("userUid", "==", userUid));
    const querySnapshot = await getDocs(checkoutQuery);
    const checkouts = [];

    querySnapshot.forEach(snapShot => {
        checkouts.push({
            orderNumber: snapShot.id,
            ...snapShot.data()
        })
    })

    if (querySnapshot.empty)
        throw new Error('Cart is Empty')

    return checkouts
}

export async function deleteCheckoutById(id) {
    await sleep()
    const docRef = doc(ordersCollection, id);
    await deleteDoc(docRef)
}

export async function deleteCheckouts(userUid) {
    const query = Query(ordersCollection, where('userUid', '==', userUid));
    const querySnapshot = await getDocs(query);

    querySnapshot.forEach(async snapshot => {
        console.log(snapshot.data())
        await deleteDoc(snapshot.ref)
    })
}

export async function saveReceipt(creds) {
    try {
        const receiptRef = await addDoc(receiptsCollection, creds);
        await deleteCheckouts(creds.userUid)
        return receiptRef.id
    } catch (err) {
        throw new Error('Something went wrong')
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

export async function getAllReceipt(userUid) {
    const query = Query(receiptsCollection, where('userUid', '==', userUid));

    try {
        const querySnapshot = await getDocs(query)
        const receipts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        return receipts;
    } catch (err) {
        throw new Error("Faild to Fetch Receipts")
    }
}

export async function addReview(creds) {
    const docRef = await addDoc(reviewsCollection, creds)
    await redirectReview(creds); //update products
    return docRef.id;
}

async function redirectReview(creds) {
    const docRef = doc(productsCollection, creds.to);

    const newReview = {
        rating: creds.rating,
        review: creds.review,
        receiptRef: creds.from
    }

    // await updateDoc(docRef, {
    //     reviews: arrayUnion(newReview),
    //     rating: await calculateAverageRating(creds.to).then((average) => average == 0 ? newReview.rating : average)
    // })
    await updateDoc(docRef, {
        reviews: arrayUnion(newReview),
    })

    console.log('add to:', calculateAverageRating(creds.to))

    await updateDoc(docRef, {
        rating: await calculateAverageRating(creds.to)
    })

}

export async function isReviewDone(userUid, receiptId, productId) {
    console.log(userUid)
    const query = Query(reviewsCollection, where('userUid', '==', userUid), where('from', '==', receiptId), where('to', '==', productId));
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
    await updateDoc(docRef, {
        reviews: arrayRemove(oldReview)
    })
    await updateDoc(docRef, {
        reviews: arrayUnion(newReview)
    })
    await updateDoc(docRef, {
        rating: await calculateAverageRating(creds.to)
    })
}

async function calculateAverageRating(productId) {
    const docRef = doc(productsCollection, productId);
    const docReviews = (await getDoc(docRef)).get('reviews');
    const rating = docReviews.map(review => review.rating);
    console.log('array', rating);
    const sumOfRating = rating.reduce((partialSum, rate) => parseInt(partialSum) + parseInt(rate) || 0, 0);
    console.log(sumOfRating)
    const averageRating = sumOfRating / (rating.length || 1);

    return parseInt(averageRating)
}

export async function getAllReviews() {
    const reviews = (await getDocs(reviewsCollection)).docs;
    const reviewToFrom = reviews.map(review => ({
        from: review.data().from,
        to: review.data().to
    }));
    return reviewToFrom
}