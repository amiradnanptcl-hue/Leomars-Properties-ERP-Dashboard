import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext(null);

// Cache role in sessionStorage so refresh is instant
const ROLE_CACHE_KEY = 'leomars_auth_cache';

function getCachedAuth() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(ROLE_CACHE_KEY));
    if (cached && cached.uid && cached.role) return cached;
  } catch {}
  return null;
}

function setCachedAuth(uid, role, name) {
  try { sessionStorage.setItem(ROLE_CACHE_KEY, JSON.stringify({ uid, role, name })); } catch {}
}

function clearCachedAuth() {
  try { sessionStorage.removeItem(ROLE_CACHE_KEY); } catch {}
}

export function AuthProvider({ children }) {
  // Use cached auth for instant load on refresh
  const cached = getCachedAuth();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(cached?.role || null);
  const [userName, setUserName] = useState(cached?.name || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have cached auth, show the app immediately while Firebase verifies in background
    if (cached) {
      setLoading(false);
    }

    // Safety timeout — max 2s wait for Firebase
    const timeout = setTimeout(() => setLoading(false), 2000);

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      if (firebaseUser) {
        setUser(firebaseUser);

        // If cache matches, skip Firestore fetch (instant)
        if (cached && cached.uid === firebaseUser.uid) {
          setRole(cached.role);
          setUserName(cached.name);
          setLoading(false);
          return;
        }

        // No cache or different user — fetch from Firestore
        try {
          const roleDoc = await getDoc(doc(db, 'userRoles', firebaseUser.uid));
          if (roleDoc.exists()) {
            const r = roleDoc.data().role;
            const n = roleDoc.data().name;
            setRole(r);
            setUserName(n);
            setCachedAuth(firebaseUser.uid, r, n);
          } else {
            setRole('viewer');
            setUserName(firebaseUser.email?.split('@')[0] || 'User');
            setCachedAuth(firebaseUser.uid, 'viewer', firebaseUser.email?.split('@')[0] || 'User');
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
        clearCachedAuth();
      }
      setLoading(false);
    });
    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => { clearCachedAuth(); return signOut(auth); };
  const isAdmin = role === 'admin';
  const isViewer = role === 'viewer';

  return (
    <AuthContext.Provider value={{ user, role, userName, loading, login, logout, isAdmin, isViewer }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
