import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXOCJJXhF-WyzU9DB7RsUQ05byfSF2zUc",
    authDomain: "pets-8278e.firebaseapp.com",
    projectId: "pets-8278e",
    storageBucket: "pets-8278e.appspot.com",
    messagingSenderId: "839955171671",
    appId: "1:839955171671:web:d638bfb21b9daa00725612",
    measurementId: "G-1G3ZW2V5BB"
  };
  
  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);


  export { auth, db, storage };