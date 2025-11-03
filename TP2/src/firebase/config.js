import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyD13OWpBthNXoAsPWdd0-iXC_JjZCugUhE",
  authDomain: "tpprog3-parte2.firebaseapp.com",
  projectId: "tpprog3-parte2",
  storageBucket: "tpprog3-parte2.firebasestorage.app",
  messagingSenderId: "958538826825",
  appId: "1:958538826825:web:967d190f9d3f1c01ceab98"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();