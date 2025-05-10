import { db } from "@/config/firebase";
import auth from "@react-native-firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

type ProfileUpdateData = {
  displayName?: string;
  phone?: string;
};

export async function updateProfile(data: ProfileUpdateData) {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    throw new Error("No authenticated user");
  }

  try {
    // Update Firestore user document
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      ...(data.displayName && { displayName: data.displayName }),
      ...(data.phone && { phone: data.phone }),
      updatedAt: new Date().toISOString(),
    });

    // Update Firebase Auth profile if displayName is provided
    if (data.displayName) {
      await currentUser.updateProfile({
        displayName: data.displayName,
      });
      // await firebaseUpdateProfile(currentUser, {
      //   displayName: data.displayName,
      // });
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to update profile");
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const currentUser = auth().currentUser;

  try {
    if (!currentUser || !currentUser.email) {
      throw new Error("No authenticated user");
    }

    // Re-authenticate user before changing password
    // const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
    const credential = auth.EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    // await reauthenticateWithCredential(currentUser, credential)
    await currentUser.reauthenticateWithCredential(credential);
    // Change password
    // await updatePassword(currentUser, newPassword)
    currentUser.updatePassword(newPassword);
  } catch (error: any) {
    if (error.code === "auth/wrong-password") {
      throw new Error("Current password is incorrect");
    }
    throw new Error(error.message || "Failed to change password");
  }
}
