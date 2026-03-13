import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from './config';

const googleProvider = new GoogleAuthProvider();

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export const signupWithEmail = async ( name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const role = user.email === ADMIN_EMAIL ? 'admin' : 'user';

    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: name,
        role: role,
        password: password,
        createdAt: new Date().toISOString()
    });
    return user;
};

export const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const role = user.email === ADMIN_EMAIL ? 'admin' : 'user';

        await setDoc(userRef, {
            email: user.email,
            firstName: user.displayName,
            role: role,
            createdAt: new Date().toISOString()
        });
    }

    return result;
};

export const logout = () => {
    return signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
