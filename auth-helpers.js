// js/auth-helpers.js
import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

export async function getUserRole() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return { uid: user.uid, email: user.email, ...snap.data() };
    }

    // First time login → create as sales
    const defaultData = {
      email: user.email,
      role: "sales",
      name: user.email.split("@")[0],
      createdAt: serverTimestamp()
    };
    await setDoc(userRef, defaultData);
    return { uid: user.uid, ...defaultData };
  } catch (error) {
    console.error("Error getting user role:", error);
    return {
      uid: user.uid,
      email: user.email,
      role: "sales",
      name: user.email.split("@")[0]
    };
  }
}

export function protectPage(allowedRoles = ["admin"]) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "index.html";
        return;
      }

      try {
        const profile = await getUserRole();

        if (!profile || !allowedRoles.includes(profile.role)) {
          // Redirect based on role
          if (profile?.role === "admin") {
            window.location.href = "dashboard.html";
          } else if (profile?.role === "hr") {
            window.location.href = "hr.html";
          } else if (profile?.role === "finance") {
            window.location.href = "invoices.html";
          } else {
            // Default to sales
            if (!window.location.pathname.includes("sales.html")) {
              window.location.href = "sales.html";
            }
          }
          return;
        }

        resolve(profile);
      } catch (err) {
        console.error("Role check failed:", err);
        // Prevent infinite loop - just stay or go to sales
        if (!window.location.pathname.includes("sales.html")) {
          window.location.href = "sales.html";
        }
      }
    });
  });
}

export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

export function goTo(page) {
  window.location.href = page;
}
