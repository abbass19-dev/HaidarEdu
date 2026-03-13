# HaidarEdu: Trading Education Platform

Welcome to **HaidarEdu**, a premium platform dedicated to providing comprehensive trading education. Built securely with Next.js, Firebase, and TailwindCSS, this platform offers extensive interactive courses, educational articles, active chat zones, and administrative controls.

## Features

- 👤 **User Authentication & Profiles**: Secure sign up, login, and personalized user profiles, fully integrated with Firebase Auth.
- 📚 **Interactive Courses**: Discover and track progress through structured trading courses.
- 📰 **Articles**: Read published articles relating to trading, finance, and market strategies.
- 💬 **Open Chats**: Built-in chat zones to message with other students and instructors.
- ⚙️ **Admin Dashboard**: A comprehensive admin panel to view platform statistics, users, total content, quick stats, storage usage, server health, and more.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Version 14)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & CSS Modules (`clsx`, `tailwind-merge`)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & GSAP
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore DB)

## Getting Started

### Prerequisites

Ensure you have Node.js and `npm` installed.

### Setup

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone https://github.com/abbass19-dev/HaidarEdu.git
   cd HaidarEdu
   ```

2. **Install all dependencies:**

   ```bash
   npm install
   ```

3. **Configure the Environment:**
   Set up your `.env.local` to include your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   ```

### Running the Application Local

To start the Next.js development server:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Building for Production

Compile a highly optimized production branch by running:

```bash
npm run build
```

Then you can start the built application:

```bash
npm run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

All rights reserved.
