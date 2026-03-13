import { db } from './firebase/config';
import {
    collection,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "firebase/firestore";

// Helper for Courses
export const getCourses = async () => {
    const querySnapshot = await getDocs(query(collection(db, "courses"), orderBy("createdAt", "desc")));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addCourse = async (course: any) => {
    return await addDoc(collection(db, "courses"), {
        ...course,
        createdAt: new Date().toISOString()
    });
};

export const updateCourse = async (id: string, data: any) => {
    const ref = doc(db, "courses", id);
    return await updateDoc(ref, data);
};

export const deleteCourse = async (id: string) => {
    return await deleteDoc(doc(db, "courses", id));
};

// Helper for Articles
export const getArticles = async () => {
    const querySnapshot = await getDocs(query(collection(db, "articles"), orderBy("createdAt", "desc")));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addArticle = async (article: any) => {
    return await addDoc(collection(db, "articles"), {
        ...article,
        createdAt: new Date().toISOString()
    });
};

export const updateArticle = async (id: string, data: any) => {
    const ref = doc(db, "articles", id);
    return await updateDoc(ref, data);
};

export const deleteArticle = async (id: string) => {
    return await deleteDoc(doc(db, "articles", id));
};

// Helper for Users & Roles
export const getUserRole = async (uid: string) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().role || 'user';
        }
        return 'user';
    } catch (e) {
        return 'user';
    }
};

export const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserRole = async (uid: string, newRole: string) => {
    return await updateDoc(doc(db, "users", uid), {
        role: newRole
    });
};

export const deleteUser = async (uid: string) => {
    return await deleteDoc(doc(db, "users", uid));
};

// Helper for System Settings
export const getSystemSettings = async () => {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return {
            siteName: 'HaidarEdu',
            maintenanceMode: false,
            allowSignups: true,
            supportEmail: 'support@haidaredu.com',
            enableChat: true
        };
    }
};

export const updateSystemSettings = async (settings: any) => {
    return await setDoc(doc(db, "settings", "global"), settings, { merge: true });
};

// Helper for Chats
export const getChats = async () => {
    const querySnapshot = await getDocs(collection(db, "chats"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

