import { db } from "@/config/firebase";
import auth from "@react-native-firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "customer";
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signUp: (name: string, phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: userData.displayName || "",
              role: userData.role || "customer",
              phone: userData.phone || "",
            });
          } else {
            // User document doesn't exist, sign out
            await auth().signOut();
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (phone: string, password: string) => {
    try {
      // In a real app, you would query db to find the user with this phone number
      // and then use their email to sign in with Firebase Auth
      // For this example, we'll assume phone is the email for simplicity
      const userCredential = await auth().signInWithEmailAndPassword(
        `${phone}@example.com`,
        password
      );
      // Auth state change listener will handle setting the user
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in");
    }
  };

  const signUp = async (name: string, phone: string, password: string) => {
    try {
      // In a real app, you would check if the phone number is already in use
      // For this example, we'll use the phone as part of the email
      const email = `${phone}@example.com`;

      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      // Create user document in db
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: name,
        email: email,
        phone: phone,
        role: "customer", // Default role for new users
        createdAt: new Date().toISOString(),
      });

      // Auth state change listener will handle setting the user
    } catch (error: any) {
      throw new Error(error.message || "Failed to create account");
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      // Auth state change listener will handle setting the user to null
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign out");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(error.message || "Failed to send reset email");
    }
  };

  const refreshUserData = async () => {
    const currentUser = auth().currentUser;

    if (!currentUser) return;

    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          uid: currentUser.uid,
          email: currentUser.email || "",
          displayName: userData.displayName || "",
          role: userData.role || "customer",
          phone: userData.phone || "",
        });
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
