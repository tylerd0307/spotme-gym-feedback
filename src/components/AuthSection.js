import React from 'react';

function AuthSection({ user, onSignOut, onSignIn }) {
  return user ? (
    <div>
      <h2>Hello, {user.displayName}</h2>
      <img src={user.photoURL} alt="Profile" />
      <button onClick={onSignOut}>Sign Out</button>
    </div>
  ) : (
    <button onClick={onSignIn}>Sign In with Google</button>
  );
}

export default AuthSection;