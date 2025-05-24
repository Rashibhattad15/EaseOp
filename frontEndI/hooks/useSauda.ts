// hooks/useSaudaEntries.ts
import { useEffect, useState } from "react";
import { realtimedb } from "../firebaseConfig";
import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  off,
  get
} from "firebase/database";
import { SaudaPayload } from "../../commons/models/productConfiguration/SaudaPayload";
import httpClient from '../services/httpClient';
import { endpoints } from '../services/api';

export const useSaudaEntries = (officeId: string) => {
  const [saudaEntries, setSaudaEntries] = useState<SaudaPayload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // offices/${officeId}/
  const baseRef = ref(realtimedb, `orders/saudaEntry`);

  // Fetch entries in real-time
  useEffect(() => {
    setLoading(true);
    const listener = onValue(
      baseRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const entries = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value
        }));
        setSaudaEntries(entries);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching sauda entries:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => off(baseRef, "value", listener);
  }, [officeId]);

  // Create entry
  const addSaudaEntry = async (entry: Omit<SaudaPayload, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const saudaId = `SDA-${now}`;

    const newEntry: SaudaPayload = {
      ...entry,
      saudaId, 
      creationDate: now.toString(),
      updatedAt: now.toString()
    };

    try{

    // Push new entry to the database
    const newRef = push(baseRef);
    await set(newRef, newEntry);

     await httpClient.post(endpoints.notificationManager.notifyAdmin, {
      title: 'New Sauda Request',
      body: `${newEntry.createdBy} has requested approval.`,
      data: newEntry,
        
      });

    

    }catch(error: any){
      console.error("Error adding sauda entry:", error);
      setError(error.message);
    }



    return newEntry;
};


  // Update entry
  const updateSaudaEntry = async (id: string, updates: Partial<SaudaPayload>) => {
    const entryRef = ref(realtimedb, `offices/${officeId}/orders/saudaEntry/${id}`);
    await update(entryRef, { ...updates, updatedAt: Date.now() });
  };

  // Delete entry
  const deleteSaudaEntry = async (id: string) => {
    const entryRef = ref(realtimedb, `offices/${officeId}/orders/saudaEntry/${id}`);
    await remove(entryRef);
  };

  const fetchSaudaEntry = async (id: string): Promise<SaudaPayload | null> => {
    const entryRef = ref(realtimedb, `offices/${officeId}/orders/saudaEntry/${id}`);
    const snapshot = await get(entryRef);
    if (snapshot.exists()) {
      const entry = { id, ...snapshot.val() };
      setSaudaEntries((prev) => {
        const existing = prev.find((e) => e.saudaId === id);
        if (existing) {
          return prev.map((e) => (e.saudaId === id ? entry : e));
        } else {
          return [...prev, entry];
        }
      });
      return entry;
    }
    return null;
  };

  const fetchAllSaudaEntries = async (): Promise<SaudaPayload[]> => {
    setLoading(true);
    try {
      const snapshot = await get(baseRef);
      const data = snapshot.val() || {};
      const entries = Object.entries(data).map(([id, value]: any) => ({
        id,
        ...value,
      }));
      setSaudaEntries(entries);
      setLoading(false);
      return entries;
    } catch (err: any) {
      console.error("Error fetching all sauda entries:", err);
      setError(err.message);
      setLoading(false);
      return [];
    }
  };
  


  return {
    saudaEntries,
    loading,
    error,
    addSaudaEntry,
    updateSaudaEntry,
    deleteSaudaEntry,
    fetchSaudaEntry,
    fetchAllSaudaEntries
  };
};
