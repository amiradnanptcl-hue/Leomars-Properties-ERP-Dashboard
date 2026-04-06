import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export function useFirestoreSync(user) {
  const [properties, setProperties] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);
  const [legalCases, setLegalCases] = useState(null);
  const [backups, setBackups] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Subscribe to properties document
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'appData', 'properties'), (snap) => {
      if (snap.exists()) {
        setProperties(snap.data().items || []);
        setDeletedIds(snap.data().deletedIds || []);
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
        setLegalCases(snap.data().items || []);
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
        setBackups(snap.data().items || []);
      }
    }, (err) => {
      console.error('Firestore backups listener error:', err);
    });
    return unsub;
  }, [user]);

  // Write functions
  const saveProperties = useCallback(async (items, newDeletedIds) => {
    if (!user) return;
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
