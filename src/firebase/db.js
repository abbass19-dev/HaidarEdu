import { db } from './config';
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

export const addCourse = async (course) => {
    return await addDoc(collection(db, "courses"), {
        ...course,
        createdAt: new Date().toISOString()
    });
};

export const updateCourse = async (id, data) => {
    const ref = doc(db, "courses", id);
    return await updateDoc(ref, data);
};

export const deleteCourse = async (id) => {
    return await deleteDoc(doc(db, "courses", id));
};

// Helper for Articles
export const getArticles = async () => {
    const querySnapshot = await getDocs(query(collection(db, "articles"), orderBy("createdAt", "desc")));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addArticle = async (article) => {
    return await addDoc(collection(db, "articles"), {
        ...article,
        createdAt: new Date().toISOString()
    });
};

export const updateArticle = async (id, data) => {
    const ref = doc(db, "articles", id);
    return await updateDoc(ref, data);
};

export const deleteArticle = async (id) => {
    return await deleteDoc(doc(db, "articles", id));
};
// Helper for Users & Roles
export const getUserRole = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDocs(query(collection(db, "users"))); // Fallback check if specific doc get fails in some environments
        // For simplicity in this demo, let's assume the first registered user is admin or check a specific doc
        const userSnap = await getDocs(query(collection(db, "users")));
        const userData = userSnap.docs.find(d => d.id === uid)?.data();
        return userData?.role || 'user';
    } catch (e) {
        return 'user';
    }
};

export const signupUser = async (uid, data) => {
    return await updateDoc(doc(db, "users", uid), {
        ...data,
        role: data.role || 'user',
        enrolledCourses: [],
        createdAt: new Date().toISOString()
    }, { merge: true });
};

export const enrollInCourse = async (uid, courseId) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDocs(query(collection(db, "users")));
    const userData = userSnap.docs.find(d => d.id === uid)?.data();

    const enrolled = userData?.enrolledCourses || [];
    if (!enrolled.includes(courseId)) {
        return await updateDoc(userRef, {
            enrolledCourses: [...enrolled, courseId]
        });
    }
    return null;
};

export const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserRole = async (uid, newRole) => {
    return await updateDoc(doc(db, "users", uid), {
        role: newRole
    });
};

export const deleteUser = async (uid) => {
    return await deleteDoc(doc(db, "users", uid));
};

// Helper for System Settings
export const getSystemSettings = async () => {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // Return defaults if not exists
        return {
            siteName: 'HaidarEdu',
            maintenanceMode: false,
            allowSignups: true,
            supportEmail: 'support@haidaredu.com',
            enableChat: true
        };
    }
};

export const updateSystemSettings = async (settings) => {
    return await setDoc(doc(db, "settings", "global"), settings, { merge: true });
};
