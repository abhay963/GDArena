// Import Firebase authentication methods
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Import Firebase auth instance
import { auth } from "../firebase/firebase";

// Login with email & password
export async function login(email, password) {
  const response = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return response.user;
}

// Signup with email & password
export async function signup(email, password) {
  const response = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return response.user;
}

// Login with Google
export async function googleLogin() {
  const provider = new GoogleAuthProvider();

  const response = await signInWithPopup(
    auth,
    provider
  );

  return response.user;
}

// Logout current user
export async function logout() {
  await signOut(auth);
}