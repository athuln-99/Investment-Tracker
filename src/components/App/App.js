import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navigation from '../Navigation'
import Home from '../Home'
import LogIn from '../LogIn'
import SignUp from '../SignUp'
import Landing from '../Landing'
import ResetPassword from '../ResetPassword'
import * as URI from '../../constants/uri'

import { FirebaseProvider } from '../../contexts/FirebaseContext'
import { AuthProvider } from '../../contexts/AuthContext'

// App Component is the main component that acts as a container for all other components.
function App() {
  return (
    <>
      <AuthProvider>
        <FirebaseProvider>
          <Router>
            <Navigation />
            <Routes>
              <Route path={URI.LANDING} element={<Landing />} />
              <Route path={URI.HOME} element={<Home />} />
              <Route path={URI.LOG_IN} element={<LogIn />} />
              <Route path={URI.SIGN_UP} element={<SignUp />} />
              <Route path={URI.PASSWORD_RESET} element={<ResetPassword />} />
            </Routes>
          </Router>
        </FirebaseProvider>
      </AuthProvider>
    </>
  )
}

export default App
