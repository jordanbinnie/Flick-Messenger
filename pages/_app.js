import { useEffect, useState } from 'react'
import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth, db} from '../firebase'
import Login from './login'
import Loading from '../components/loading/Loading'
import firebase from 'firebase'
import AppContextProvider from '../context/AppContextProvider'


function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)
  const [routeEmail, setRouteEmail] = useState('')

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set(
        {
          email: user.email,
          name: user.displayName,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      )
      setRouteEmail(user.email)
    }
  
  }, [user])

  if (loading){ return <Loading/> }
  if (!user){ return <Login /> }

  return (
    <AppContextProvider>
      <Component {...pageProps} routeEmail={routeEmail} />
    </AppContextProvider>

  )
}

export default MyApp
