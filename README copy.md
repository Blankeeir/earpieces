# Matching Your Earpieces — Singapore

A fun, playful site for people in Singapore to match their partially lost earpieces (e.g., left/right AirPods, Sony, etc.).
Users can browse by brand, post their half, tell the story of how they lost it, upload photos, and contact each other. Each post also has a **Report** button to flag scams.

Built with **React + Vite**, **Firebase Auth** (Google + Email/Password), **Cloud Firestore**, and **Firebase Storage**. UI uses **Tailwind CSS**, **Framer Motion** for delightful animations, and **react-hot-toast** for feedback.

---

## ✨ Features
- Browse posts by brand/category (AirPods, Sony, Samsung, Bose, Jabra, Beats, Sennheiser, Other)
- View item details with images, owner's display name and contact/socials
- Sign in with **Google or Email/Password**
- Create posts: upload photos, choose intent (looking for half / offering my half / selling / giving away), and write your story
- **Report** post interface (reason + optional details)
- Youthful, vibrant UI with micro-animations
- Sensible Firebase **Security Rules** provided

---

## 🚀 Quick Start

### 1) Clone & Install
```bash
npm i
npm run dev
```

> If you downloaded the ZIP, unzip it and `cd` into the folder first.

### 2) Create Firebase Project
- Go to Google Firebase Console → Create a project.
- Enable **Authentication**: turn on **Google** provider and **Email/Password** provider.
- Enable **Cloud Firestore** (in production or test mode).
- Enable **Storage**.

### 3) Add Web App & Copy Config
- In Firebase console → Project settings → Your apps → Web, register a new app.
- Fill `.env` as shown below.

### 4) Environment Variables
Copy `.env.example` to `.env` and fill values from Firebase:
```
cp .env.example .env
```

Edit `.env`:
```bash
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=1:xxxx:web:xxxx
```

### 5) Firebase Security Rules
Apply these rules (files included in this repo):

**Firestore rules**
```bash
firebase deploy --only firestore:rules
```
or copy/paste the file `firebase.firestore.rules` into the Firebase console Rules editor.

**Storage rules**
```bash
firebase deploy --only storage:rules
```

### 6) Run Locally
```bash
npm run dev
```

### 7) Build & Deploy
You can deploy to **Vercel**, **Netlify**, or any static host.
```bash
npm run build
# then upload /dist to your host or use your platform's CLI
```

---

## 🧱 Tech Stack
- React + Vite
- Firebase (Auth, Firestore, Storage)
- Tailwind CSS
- Framer Motion
- react-hot-toast
- react-router-dom

---

## 🔒 Firestore & Storage Rules (overview)
- Anyone can read posts.
- Only authenticated users can create posts.
- Only the post owner can edit/delete their post.
- Reports can be created by any authenticated user; reading them is restricted by default.

See `firebase.firestore.rules` and `firebase.storage.rules` for details.

---

## 🗂️ Project Structure
```
.
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  ├─ context/
│  ├─ pages/
│  ├─ utils/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ .env.example
├─ firebase.firestore.rules
├─ firebase.storage.rules
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
└─ vite.config.js
```

---

## 📝 Notes
- This app defaults to the **Singapore** audience but works anywhere.
- The "Report" feature stores report documents in Firestore (`reports` collection). Hook up moderation or email alerts later if needed (Cloud Functions not included by default).
- Make sure to set environment variables for production deploys (Vercel/Netlify settings).

Enjoy and have fun matching your earpieces! 🎧
