import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

/* ===========================
   GOOGLE PROVIDER
=========================== */

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

/* ===========================
   LOGIN
=========================== */

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email and Password are required.");
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    return userCredential.user;
  } catch (err) {
    console.error("Login Error:", err);

    throw new Error(getFirebaseError(err.code));
  }
};

/* ===========================
   SIGNUP
=========================== */

export const signup = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email and Password are required.");
    }

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    return userCredential.user;
  } catch (err) {
    console.error("Signup Error:", err);

    throw new Error(getFirebaseError(err.code));
  }
};

/* ===========================
   GOOGLE LOGIN
=========================== */

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      provider
    );

    return result.user;
  } catch (err) {
    console.error("Google Login Error:", err);

    throw new Error(getFirebaseError(err.code));
  }
};

/* ===========================
   FORGOT PASSWORD
=========================== */

export const forgotPassword = async (email) => {
  try {
    if (!email) {
      throw new Error("Enter your email first.");
    }

    await sendPasswordResetEmail(
      auth,
      email.trim()
    );

    return true;
  } catch (err) {
    console.error("Reset Password Error:", err);

    throw new Error(getFirebaseError(err.code));
  }
};

/* ===========================
   LOGOUT
=========================== */

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout Error:", err);

    throw err;
  }
};

/* ===========================
   FIREBASE ERROR HANDLER
=========================== */

function getFirebaseError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email already exists.";

    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/user-not-found":
      return "User not found.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    case "auth/network-request-failed":
      return "No internet connection.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/popup-closed-by-user":
      return "Google sign in cancelled.";

    case "auth/popup-blocked":
      return "Popup blocked by browser.";

    case "auth/cancelled-popup-request":
      return "Popup request cancelled.";

    case "auth/operation-not-allowed":
      return "Enable Email/Password Authentication in Firebase.";

    default:
      return code || "Something went wrong.";
  }
}