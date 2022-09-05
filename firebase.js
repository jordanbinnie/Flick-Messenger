import firebase from 'firebase'
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBWV0HdWZEWe-Q653UiiONBZmBgrg8Ds-Q",
    authDomain: "messenger-app-15113.firebaseapp.com",
    projectId: "messenger-app-15113",
    storageBucket: "messenger-app-15113.appspot.com",
    messagingSenderId: "190159323216",
    appId: "1:190159323216:web:f26c28c72a6150fbd29155"
  };

    const app = !firebase.apps.length 
        ? firebase.initializeApp(firebaseConfig)
        : firebase.app()

    const db = app.firestore()
    const auth = app.auth()
    const storage = firebase.storage()

    const provider = new firebase.auth.GoogleAuthProvider()

    export { db, auth, storage, provider }
