import { db } from './config';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    getDocs
} from "firebase/firestore";

// Collection structure:
// 'chats' collection -> document ID is 'userId'
//    -> 'messages' subcollection

export const sendMessage = async (userId, text, sender = 'user') => {
    if (!userId) return;

    // 1. Add message to subcollection
    const messagesRef = collection(db, "chats", userId, "messages");
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days from now

    await addDoc(messagesRef, {
        text,
        sender, // 'user' or 'admin' or 'bot'
        createdAt: serverTimestamp(),
        expiresAt: expiresAt,
        read: false
    });

    // 2. Update the main chat document with last message info (for Admin List)
    const chatRef = doc(db, "chats", userId);
    await setDoc(chatRef, {
        userId,
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        lastSender: sender,
        unreadCount: sender === 'user' ? 1 : 0, // logic can be improved locally
        userType: 'student' // placeholder
    }, { merge: true });
};

// Subscribe to a specific user's messages (For User & Admin View)
export const subscribeToChat = (userId, callback) => {
    if (!userId) return () => { };

    const messagesRef = collection(db, "chats", userId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert timestamp to Date object if exists, else null
            createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        callback(messages);
    });
};

// Subscribe to ALL chats (For Admin List)
export const subscribeToAllChats = (callback) => {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, orderBy("lastMessageTime", "desc"));

    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            lastMessageTime: doc.data().lastMessageTime?.toDate() || new Date()
        }));
        callback(chats);
    });
};

// Mark conversation as read (When Admin opens it)
export const markChatRead = async (userId) => {
    if (!userId) return;
    const chatRef = doc(db, "chats", userId);
    await updateDoc(chatRef, {
        unreadCount: 0
    });
};

// Get User Details for Admin Header
export const getChatUserDetails = async (userId) => {
    if (!userId) return null;
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) return snap.data();
    return null;
};
// Get all chats for Dashboard analysis
export const getChats = async () => {
    const chatsRef = collection(db, "chats");
    const snapshot = await getDocs(chatsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
