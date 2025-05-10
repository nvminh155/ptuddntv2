import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAC0ag__jZV4BEzgFZMcZncrqNkIU17y5U",
  authDomain: "ptuddnt-30390.firebaseapp.com",
  projectId: "ptuddnt-30390",
  storageBucket: "ptuddnt-30390.firebasestorage.app",
  messagingSenderId: "718271067681",
  appId: "1:718271067681:web:2084ca5c40e95c0d301560"
};

// ✅ initializeApp should be called once
const app = initializeApp(firebaseConfig);

// Export initialized services
const db = getFirestore(app);

export { app, db };

