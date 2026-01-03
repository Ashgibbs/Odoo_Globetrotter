import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "../firebase.js";

const db = getFirestore(app);

// Params
const params = new URLSearchParams(window.location.search);
const tripId = params.get("tripId");

if (!tripId) {
  alert("Invalid Trip");
  window.location.href = "dashboard.html";
}

// Navigation
window.goBack = () => window.location.href = "user-trips.html";
window.goToProfile = () => window.location.href = "user-profile.html";

// Load itinerary
async function loadItinerary() {
  const container = document.getElementById("itinerary-container");
  container.innerHTML = "";

  let totalCost = 0;

  const q = query(
    collection(db, "trip_activities"),
    where("trip_id", "==", tripId)
  );

  const snapshot = await getDocs(q);

  const days = {};

  snapshot.forEach(doc => {
    const a = doc.data();
    const day = a.day_number || 1;

    if (!days[day]) days[day] = [];
    days[day].push(a);

    totalCost += Number(a.cost || 0);
  });

  Object.keys(days).sort().forEach(day => {
    const section = document.createElement("div");
    section.className = "day-section";

    section.innerHTML = `<div class="day-header">Day ${day}</div>`;

    days[day].forEach(act => {
      const row = document.createElement("div");
      row.className = "activity-row";
      row.innerHTML = `
        <span>${act.name}</span>
        <span>₹ ${act.cost}</span>
      `;
      section.appendChild(row);
    });

    container.appendChild(section);
  });

  document.getElementById("totalCost").textContent = `₹ ${totalCost}`;
}

loadItinerary();
