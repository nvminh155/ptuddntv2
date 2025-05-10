import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export async function isAdmin(): Promise<boolean> {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    return false;
  }

  try {
    const userDoc = await firestore().collection("users").doc(currentUser.uid).get();
    return userDoc.exists() && userDoc.data()?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function checkAdminPermission(): Promise<void> {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("You don't have permission to perform this action");
  }
}
