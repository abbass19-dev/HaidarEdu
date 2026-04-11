# HAIDAREDU - Premium Trading Education Platform

HAIDAREDU is a state-of-the-art, premium trading education and community platform built using Next.js 14. Designed with maximum immersion in mind, it features a highly polished dark-mode aesthetic with interactive glassmorphism, 3D scroll animations, and fluid transitions.

It serves as both a high-converting landing page for prospective students and a robust, fully-featured e-learning platform complete with an administrative dashboard and an admin-gated course enrollment system.

## 🌟 Key Features

### 🎓 Student E-Learning Dashboard (`/my-learning`)
* **Personalized Dashboard**: Students get immediate access to their approved courses in a clean, distraction-free environment.
* **Enrollment Request System**: Instead of open access, users must request enrollment to a course. Their dashboard tracks the status of their requests (Pending, Approved, Rejected).
* **Immersive Course Viewer**: A dedicated playback interface for course content, supporting videos, PDFs, and images directly delivered via Cloudinary.

### 🛡️ Comprehensive Admin Panel (`/admin`)
* **Analytics Overview**: Top-level metrics on active users, total enrollments, and platform health.
* **Enrollment Management**: Complete control over who gets access to what. Admins can view pending requests, approve students into courses, or revoke access with a click.
* **Course Content Management**: Create and edit courses, including uploading large video files, PDFs, and high-res banner images using **secure, backend-signed Cloudinary uploads** (bypassing Vercel/NextJS payload limits).
* **User Management**: Role-based access control. Admins can promote users, view specific student details, and revoke platform access.

### 🔐 Authentication & Roles
* **Firebase Auth**: Secure Email/Password and Google OAuth integrations.
* **Smart Routing**: Upon login, true Administrators are instantly routed to the Admin panel, while standard students are pushed straight to their personalized `/my-learning` dashboard.
* **Protected Routes**: Strict server and client-side guards preventing unauthorized access to course content or admin pages.

### 🎨 Premium Aesthetics & UI/UX
* **Dark Mode Native**: Deep dark backgrounds (`#050505`) contrasted with vibrant, glowing primary accents (Lime Green and Cyan).
* **Glassmorphism**: Transparent, frosted-glass layering (`backdrop-filter`) for cards and navigation to create depth.
* **Framer Motion**: Complex scroll reveals, smooth page transitions, and micro-interactions on hover.
* **Vanilla CSS Modules**: Highly optimized, granular CSS avoiding the clutter of utility classes, maintaining strict design tokens.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Library**: [React 18](https://reactjs.org/) (Client & Server Components)
* **Database**: [Firebase Firestore](https://firebase.google.com/) (NoSQL Document Store)
* **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
* **Media & Storage**: [Cloudinary](https://cloudinary.com/) (Direct API Signed Uploads)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18+ installed. You will also need active accounts on Firebase and Cloudinary.

### 1. Environment Variables

Create a `.env.local` file in the root of your project and add the following keys:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Note:** The Cloudinary integrations utilize Next.js server-side API routes to generate secure upload signatures. No `upload_preset` or insecure unsigned uploads are required.

### 2. Installation

Install the project dependencies:

```bash
npm install
```

### 3. Run the Development Server

Start up the local dev server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the application.

---

## 🏗️ Architecture & Database Design

The Firestore database follows a normalized NoSQL structure for scalability:

* **`users`**: Stores user profiles and role references (`admin` | `user`).
* **`courses`**: Stores standard course metadata (title, price, level, banner images).
* **`courses/{courseId}/content`**: A sub-collection storing the actual video/media assets for the course.
* **`enrollments`**: A top-level collection tying users to courses, tracking dynamic statuses (`pending`, `approved`, `rejected`) allowing admins granular control over requests without mutating massive array structures inside the user document.

---

## 🛡️ Firestore Security Rules

To ensure platform security, ensure your Firestore Rules enforce role checks across the `enrollments` and `courses` collections, permitting writes to `courses` and updates to `enrollments` only by users whose email matches the admin configuration.

---

Built with precision for the modern trading community.
