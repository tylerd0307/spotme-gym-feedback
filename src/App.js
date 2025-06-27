import './App.css';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useState, useEffect } from 'react';

console.log(auth);

function App() {
  const [user, setUser] = useState(null);

  // handle sign in
  const handleGoogleSignIn = () => {
    // create a new Google provider
    const provider = new GoogleAuthProvider();
  
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('User Info:', result.user);
        setUser(result.user);
      })
      .catch((error) => {
        console.error('Error during sign-in:', error)
      })
  };

  // handle sign out
  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
      console.log('User signed out');
      setUser(null);
    })
    .catch((error) => {
      console.error('Error during sign out', error);
    });

  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // update React's state
      } else {
        setUser(null);
      }
    });
  }, [])

  return (
    <div>
      <h1>Welcome to SpotMe</h1>

      {user ? (
        <div>
          <h2>Hello, {user.displayName}</h2>
          <img src={user.photoURL} alt="Profile"/>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
}



export default App;
