import { db } from './config';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    deleteDoc,
    updateDoc
} from "firebase/firestore";

const COLLECTION_NAME = "knowledge_base";

// Add a new entry (QA, Service, Announcement)
export const addKnowledgeBaseEntry = async (data) => {
    // data should contain { type, question/title, answer/content }
    const ref = collection(db, COLLECTION_NAME);
    await addDoc(ref, {
        ...data,
        createdAt: serverTimestamp()
    });
};

// Subscribe to all KB entries (for Admin UI)
export const subscribeToKnowledgeBase = (callback) => {
    const ref = collection(db, COLLECTION_NAME);
    const q = query(ref, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(entries);
    });
};

// Update an entry
export const updateKnowledgeBaseEntry = async (id, data) => {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

// Delete an entry
export const deleteKnowledgeBaseEntry = async (id) => {
    const ref = doc(db, COLLECTION_NAME, id);
    await deleteDoc(ref);
};
