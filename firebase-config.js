// Firebase is loaded via CDN scripts in HTML files
// DO NOT use import statements here

const firebaseConfig = {
  apiKey: "AIzaSyBi4Udgz97OJo1sei1pAmCJ9oiBT4BSGMw",
  authDomain: "btech-vault.firebaseapp.com",
  projectId: "btech-vault",
  storageBucket: "btech-vault.firebasestorage.app",
  messagingSenderId: "8508597620",
  appId: "1:8508597620:web:f36418f8c702e8a21c3821"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const googleProvider = new firebase.auth.GoogleAuthProvider();

async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
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
