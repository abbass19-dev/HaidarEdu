import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAElK8o5N1lSH14S6FMF7KH6K_owVDyWUI",
    authDomain: "haidar-b018b.firebaseapp.com",
    projectId: "haidar-b018b",
    storageBucket: "haidar-b018b.firebasestorage.app",
    messagingSenderId: "459000252108",
    appId: "1:459000252108:web:3dd3ac6d2e833534a72469",
    measurementId: "G-E2X7Y25JC9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION_NAME = "knowledge_base";

const seeds = [
    {
        type: 'announcement',
        title: 'Welcome to Haidar Edu',
        content: 'Haidar Edu is a professional trading education platform dedicated to transforming aspiring traders into funded professionals. We provide institutional-grade tools, expert-led courses, and access to capital up to $200k.'
    },
    {
        type: 'service',
        title: 'Professional Funding Program ($50K)',
        content: 'Get access to $50,000 of institutional capital with our Professional Program. Price: $299. Features: 85% Profit Split, 1-Step Evaluation, Daily Profit Targets, and Professional Tools included.'
    },
    {
        type: 'service',
        title: 'Elite Mentorship Program',
        content: 'Join our most exclusive learning path for $99/month. Includes Live Trading Sessions, Private VIP Group Access, Weekly Strategy Breakdowns, Direct Q&A with Mentors, and Priority Support.'
    },
    {
        type: 'service',
        title: 'Free Community Group',
        content: 'Start your journey for free. Join our Telegram group for Daily Market Updates, Community Chat, Basic Trading Education, and Weekly Analysis. Link: https://t.me/+eKf0Kl6m0N00ZGE0'
    },
    {
        type: 'qa',
        question: 'How do I get funded?',
        answer: 'To get funded, you can select one of our funding programs like the "Professional" ($50k) path. You will undergo a 1-step evaluation to prove your trading skills, after which you get access to the capital with an 85% profit split.'
    },
    {
        type: 'qa',
        question: 'How do I contact support or admin?',
        answer: 'You can contact our lead admin, Abbass, directly on Telegram at @abbasshij for any inquiries about programs, enrollment, or support.'
    },
    {
        type: 'qa',
        question: 'What is the profit split?',
        answer: 'We offer a highly competitive 85% profit split for our funded traders in the Professional Funding Program.'
    }
];

export async function seedKnowledge() {
    console.log("Checking for existing knowledge...");
    const ref = collection(db, COLLECTION_NAME);
    const q = query(ref, limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        console.log("Knowledge base already seeded.");
        return;
    }

    console.log("Seeding initial knowledge base...");
    for (const data of seeds) {
        await addDoc(ref, {
            ...data,
            createdAt: serverTimestamp()
        });
        console.log(`Added: ${data.title || data.question}`);
    }
    console.log("Seeding complete!");
}
