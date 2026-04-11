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
    orderBy,
    arrayUnion,
    increment,
    where
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

// Helper for Admin Enrollment Management
export const requestEnrollment = async (userId: string, userEmail: string, userName: string, courseId: string, courseTitle: string) => {
    return await addDoc(collection(db, "enrollments"), {
        userId,
        userEmail,
        userName,
        courseId,
        courseTitle,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
};

export const getUserEnrollments = async (userId: string) => {
    const q = query(collection(db, "enrollments"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserEnrollmentStatus = async (userId: string, courseId: string) => {
    const q = query(collection(db, "enrollments"), where("userId", "==", userId), where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        // Return latest enrollment status (in case of multiple for some reason, though there shouldn't be)
        const doc = querySnapshot.docs.sort((a, b) => 
            new Date(b.data().createdAt).getTime() - new Date(a.data().createdAt).getTime()
        )[0];
        return doc.data().status; // "pending" | "approved" | "rejected"
    }
    return null;
};

export const getCourseEnrollments = async (courseId: string) => {
    const q = query(collection(db, "enrollments"), where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllPendingEnrollments = async () => {
    const q = query(collection(db, "enrollments"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllEnrollments = async (): Promise<any[]> => {
    const q = query(collection(db, "enrollments"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateEnrollmentStatus = async (enrollmentId: string, status: "approved" | "rejected" | "pending") => {
    const enrollmentRef = doc(db, "enrollments", enrollmentId);
    
    // If approving, we might also want to increment course student count if it's the first time
    // But for simplicity, we just update the enrollment document
    await updateDoc(enrollmentRef, {
        status,
        updatedAt: new Date().toISOString()
    });
};

export const deleteEnrollment = async (enrollmentId: string) => {
    return await deleteDoc(doc(db, "enrollments", enrollmentId));
};

// Helper for Course Content (subcollection: courses/{courseId}/content)
export const addCourseContent = async (courseId: string, content: any) => {
    return await addDoc(collection(db, "courses", courseId, "content"), {
        ...content,
        createdAt: new Date().toISOString()
    });
};

export const getCourseContent = async (courseId: string) => {
    const q = query(
        collection(db, "courses", courseId, "content"),
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteCourseContent = async (courseId: string, contentId: string) => {
    return await deleteDoc(doc(db, "courses", courseId, "content", contentId));
};
