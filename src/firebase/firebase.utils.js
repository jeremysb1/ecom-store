import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyANCvAEHYR2sAh0K9123w5H6S0xuIK7Ecc",
    authDomain: "crown-clothing-db-8f460.firebaseapp.com",
    projectId: "crown-clothing-db-8f460",
    storageBucket: "crown-clothing-db-8f460.appspot.com",
    messagingSenderId: "1048461429392",
    appId: "1:1048461429392:web:0623d6879d4ed49525a615",
    measurementId: "G-EQLD9BM0M5"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if(!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if(!snapShot.exists) {
  	const { displayName, email } = userAuth;
  	const createdAt = new Date();
  	try {
  	  await userRef.set({
  	  	displayName,
  	  	email,
  	  	createdAt,
  	  	...additionalData
  	  })
  	} catch (error) {
  	  console.log('error creating user', error.message);
  	}
  }

  return userRef;
};

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach(obj => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    }
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;