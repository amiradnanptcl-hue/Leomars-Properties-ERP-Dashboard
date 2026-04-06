import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const roleDoc = await getDoc(doc(db, 'userRoles', firebaseUser.uid));
          if (roleDoc.exists()) {
            setRole(roleDoc.data().role);
            setUserName(roleDoc.data().name);
          } else {
            setRole('viewer');
            setUserName(firebaseUser.email?.split('@')[0] || 'User');
          }
        } catch (err) {
          console.error('Failed to fetch user role:', err);
          setRole('viewer');
          setUserName(firebaseUser.email?.split('@')[0] || 'User');
        }
      } else {
        setUser(null);
        setRole(null);
        setUserName('');
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const isAdmin = role === 'admin';
  const isViewer = role === 'viewer';

  return (
    <AuthContext.Provider value={{ user, role, userName, loading, login, logout, isAdmin, isViewer }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
