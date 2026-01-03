import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from "../firebase.js";

const db = getFirestore(app);
const auth = getAuth(app);

// Back to Dashboard
window.goBack = function () {
  window.location.href = "dashboard.html";
};

// Load user profile + trips
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // User details
  document.getElementById("userName").textContent = user.displayName || "User";
  document.getElementById("userEmail").textContent = user.email;

  // Fetch trips
  const tripsRef = collection(db, "trips");
  const q = query(tripsRef, where("user_id", "==", user.uid));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const trip = doc.data();
    const card = createTripCard(doc.id, trip);

    if (trip.status === "completed") {
      document.getElementById("completed-trips").appendChild(card);
    } else {
      document.getElementById("planned-trips").appendChild(card);
    }
  });
});

function createTripCard(tripId, trip) {
  const div = document.createElement("div");
  div.className = "trip-card";

  div.innerHTML = `
    <strong>${trip.trip_name}</strong>
    <p>${trip.primary_place}</p>
    <button class="secondary-btn">View</button>
  `;

  const mode = trip.status === "completed" ? "view" : "edit";
  div.querySelector("button").onclick = () => {
    window.location.href = `itinerary.html?tripId=${tripId}&mode=${mode}`;
  };

  return div;
}
