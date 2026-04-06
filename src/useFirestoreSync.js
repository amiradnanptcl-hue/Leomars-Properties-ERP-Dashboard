import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// ─── LOCAL CACHE for instant load on refresh ───
const CACHE_KEY = 'leomars_firestore_cache';

function getCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; }
}

function setCache(key, data) {
  try {
    const cache = getCache();
    cache[key] = data;
    cache._ts = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

export function useFirestoreSync(user) {
  // Load from cache FIRST for instant render
  const cache = getCache();

  const [properties, setProperties] = useState(cache.properties || null);
  const [deletedIds, setDeletedIds] = useState(cache.deletedIds || []);
  const [legalCases, setLegalCases] = useState(cache.legalCases || null);
  const [backups, setBackups] = useState(cache.backups || []);
  const [dataLoaded, setDataLoaded] = useState(!!cache.properties);

  // Subscribe to properties document
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'appData', 'properties'), (snap) => {
      if (snap.exists()) {
        const items = snap.data().items || [];
        const dIds = snap.data().deletedIds || [];
        setProperties(items);
        setDeletedIds(dIds);
        setCache('properties', items);
        setCache('deletedIds', dIds);
      } else {
        setProperties(null);
      }
      setDataLoaded(true);
    }, (err) => {
      console.error('Firestore properties listener error:', err);
      setDataLoaded(true);
    });
    return unsub;
  }, [user]);

  // Subscribe to legalCases document
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'appData', 'legalCases'), (snap) => {
      if (snap.exists()) {
        const items = snap.data().items || [];
        setLegalCases(items);
        setCache('legalCases', items);
      } else {
        setLegalCases(null);
      }
    }, (err) => {
      console.error('Firestore legalCases listener error:', err);
    });
    return unsub;
  }, [user]);

  // Subscribe to backups document
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'appData', 'backups'), (snap) => {
      if (snap.exists()) {
        const items = snap.data().items || [];
        setBackups(items);
        setCache('backups', items);
      }
    }, (err) => {
      console.error('Firestore backups listener error:', err);
    });
    return unsub;
  }, [user]);

  // Write functions
  const saveProperties = useCallback(async (items, newDeletedIds) => {
    if (!user) return;
    // Update local cache immediately (optimistic)
    setCache('properties', items);
    if (newDeletedIds) setCache('deletedIds', newDeletedIds);
    try {
      await setDoc(doc(db, 'appData', 'properties'), {
        items,
        deletedIds: newDeletedIds ?? deletedIds,
        lastModifiedBy: user.uid,
        lastModifiedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to save properties to Firestore:', err);
    }
  }, [user, deletedIds]);

  const saveLegalCases = useCallback(async (items) => {
    if (!user) return;
    setCache('legalCases', items);
    try {
      await setDoc(doc(db, 'appData', 'legalCases'), {
        items,
        lastModifiedBy: user.uid,
        lastModifiedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to save legal cases to Firestore:', err);
    }
  }, [user]);

  const saveBackup = useCallback(async (props, label) => {
    if (!user) return;
    try {
      const newBackup = {
        date: new Date().toISOString(),
        label,
        data: JSON.parse(JSON.stringify(props)),
      };
      const updated = [newBackup, ...backups];
      if (updated.length > 20) updated.length = 20;
      setCache('backups', updated);
      await setDoc(doc(db, 'appData', 'backups'), {
        items: updated,
        lastModifiedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to save backup to Firestore:', err);
    }
  }, [user, backups]);

  return {
    properties,
    deletedIds,
    legalCases,
    backups,
    dataLoaded,
    saveProperties,
    saveLegalCases,
    saveBackup,
  };
}
