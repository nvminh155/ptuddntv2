import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the shape of our auth context
interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  updateEmail: (email: string, password: string) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  initializing: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  updateEmail: async () => {},
  updatePassword: async () => {},
});

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // Subscribe to auth state changes
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      router.push("/home")
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    setError(null);
    try {
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      // Add user profile to Firestore
      await firestore().collection("users").doc(userCredential.user.uid).set({
        username,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Update display name
      await userCredential.user.updateProfile({
        displayName: username,
      });
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await auth().signOut();
      router.push("/(auth)/sign-in");
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("No user logged in");
      await user.updateProfile(data);

      // Update Firestore user document if displayName is changed
      if (data.displayName) {
        await firestore().collection("users").doc(user.uid).update({
          username: data.displayName,
        });
      }

      // Force refresh the user object
      setUser({ ...user });
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update email
  const updateEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("No user logged in");

      // Re-authenticate user before changing email
      const credential = auth.EmailAuthProvider.credential(
        user.email!,
        password
      );
      await user.reauthenticateWithCredential(credential);

      // Update email
      await user.updateEmail(email);

      // Update Firestore user document
      await firestore().collection("users").doc(user.uid).update({
        email,
      });

      // Force refresh the user object
      setUser({ ...user });
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("No user logged in");

      // Re-authenticate user before changing password
      const credential = auth.EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await user.reauthenticateWithCredential(credential);

      // Update password
      await user.updatePassword(newPassword);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    initializing,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updateEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
