import { doc } from 'firebase/firestore'
import React, { useContext, createContext } from 'react'
import {
  db,
  collection,
  getDocs,
  where,
  query,
  setDoc,
} from '../components/Firebase/firebase'

export const FirebaseContext = createContext()

// “useContext” hook is used to create common data that can be accessed
// throughout the component hierarchy without passing the props down manually to each level
export function useFirebase() {
  return useContext(FirebaseContext)
}

// The Provider component accepts a value prop to be passed to consuming components that are descendants of this Provider.
export function FirebaseProvider({ children }) {
  // https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
  // adds data in the database with specified location (collection name with user id and document name with coin id)
  async function addData(id, coins, purchasedPrice, totalPrice, uid) {
    try {
      const docRef = await setDoc(doc(db, uid, id), {
        id: id,
        totalCoins: coins,
        purchasedPrice: purchasedPrice,
        totalPrice: totalPrice,
      })
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  // https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
  // retrieve all user's data from database
  async function getAllData(uid) {
    const querySnapshot = await getDocs(collection(db, uid))
    return querySnapshot
  }

  // https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
  // retrieve all user's data that equals to the provided id
  async function getData(id, uid) {
    const q = await query(collection(db, uid), where('id', '==', id))
    return getDocs(q)
  }

  // https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
  // updates data in the database with specified location (collection name with user id and document name with coin id)
  async function updateData(id, coins, purchasedPrice, totalPrice, uid) {
    try {
      const docRef = await setDoc(doc(db, uid, id), {
        id: id,
        totalCoins: coins,
        purchasedPrice: purchasedPrice,
        totalPrice: totalPrice,
      })
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const value = {
    addData,
    getData,
    updateData,
    getAllData,
  }
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}
