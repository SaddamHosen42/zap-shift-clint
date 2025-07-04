import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const provider = new GoogleAuthProvider();
  //   creat user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const updateUser = (userInfo) => {
    return updateProfile(auth.currentUser, userInfo);
  };
  //console.log(user);
  //   log out
  const logOut = () => {
    return signOut(auth);
  };
  //   log in
  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  // log in with google
  const logInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setEmail(currentUser.email);
      } else {
        setEmail("");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authData = {
    createUser,
    updateUser,
    logIn,
    logOut,
    logInWithGoogle,
    loading,
    setLoading,
    user,
    setUser,
    email,
  };
  return <AuthContext value={authData}>{children}</AuthContext>;
};
export default AuthProvider;
