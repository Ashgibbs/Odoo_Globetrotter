import { createUserWithEmailAndPassword, onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth } from "./firebase.js";

const db = getFirestore();

window.registerUser = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const errorMsg = document.getElementById("signup-error");
  const registerBtn = document.getElementById("registerBtn");

  errorMsg.style.color = "red";
  errorMsg.textContent = "";

  if (password !== confirmPassword) {
    errorMsg.textContent = "Password and Confirm Password mismatch";
    return;
  }

  registerBtn.disabled = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      createdAt: new Date()
    });

    errorMsg.style.color = "green";
    errorMsg.textContent = "Registration successful. Redirecting to login...";

    // 🔒 WAIT for auth state, then redirect
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setTimeout(() => {
          window.location.replace("login.html");
        }, 1000);
      }
    });

  } catch (error) {
    registerBtn.disabled = false;

    if (error.code === "auth/email-already-in-use") {
      errorMsg.innerHTML =
        'User already registered. <a href="login.html" style="color:#1e88e5;font-weight:bold;">Try Login</a>';
    } else {
      errorMsg.textContent = error.message;
    }
  }
};
