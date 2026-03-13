import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/config";

const googleProvider = new GoogleAuthProvider();
const ADMIN_EMAIL = 'abbashijazi657@gmail.com';

export const loginWithEmail = (email: string, pass: string) =>
    signInWithEmailAndPassword(auth, email, pass);

export const signupWithEmail = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const role = user.email === ADMIN_EMAIL ? 'admin' : 'user';
    const firstName = user.email?.split('@')[0] || 'User';

    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName,
        role,
        enrolledCourses: [],
        createdAt: new Date().toISOString()
    });
    return user;
};

export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const role = user.email === ADMIN_EMAIL ? 'admin' : 'user';
        const firstName = user.email?.split('@')[0] || 'User';

        await setDoc(userRef, {
            email: user.email,
            firstName,
            role,
            enrolledCourses: [],
            createdAt: new Date().toISOString()
        });
    }
    return result;
};

export const logout = () => signOut(auth);

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

