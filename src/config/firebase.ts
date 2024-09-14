import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCsLTMXheOaOzAIzoVx2GPQIoDbpd0IkWk",
  authDomain: "portfolio-74159.firebaseapp.com",
  projectId: "portfolio-74159",
  storageBucket: "portfolio-74159.appspot.com",
  messagingSenderId: "232397653430",
  appId: "1:232397653430:web:b57bc9791842cbe1f7ed17"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app);