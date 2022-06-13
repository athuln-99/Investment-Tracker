import React, { useContext, useState, useEffect, createContext } from 'react'
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from '../components/Firebase/firebase'

export const AuthContext = createContext()

// “useContext” hook is used to create common data that can be accessed
// throughout the component hierarchy without passing the props down manually to each level
export function useAuth() {
  return useContext(AuthContext)
}

// The Provider component accepts a value prop to be passed to consuming components that are descendants of this Provider.
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  const auth = getAuth()

  // useEffect runs on every render
  useEffect(() => {
    // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
    // if auth state changes, it sets the user as the current user and sets loading as false
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // creates a user using the provided email and password
  // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  // logins using the provided email and password
  // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithemailandpassword
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // logouts the current user from the application
  // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signout
  function logout() {
    return signOut(auth)
  }

  // sends a password reset email to the provided email
  // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#sendpasswordresetemail
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  // all components that will be passed to the descendants of this provider
  const value = {
    auth,
    currentUser,
    signUp,
    login,
    logout,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
