// ============================================
// FIREBASE CONFIG - Replace with your own!
// ============================================
// Steps:
// 1. Go to https://console.firebase.google.com
// 2. Create new project
// 3. Add Web App
// 4. Copy config below and replace

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// ============================================
// AUTH FUNCTIONS
// ============================================

async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    // Create user doc if first time
    await db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function signOut() {
  await auth.signOut();
  window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(resolve);
  });
}
