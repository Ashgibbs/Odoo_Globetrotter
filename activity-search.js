import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "../firebase.js";

const db = getFirestore(app);

// Get params
const params = new URLSearchParams(window.location.search);
const tripId = params.get("tripId");
const stopId = params.get("stopId");

if (!tripId || !stopId) {
  alert("Invalid navigation");
  window.location.href = "dashboard.html";
}

// Back to itinerary
window.goBack = function () {
  window.location.href = `itinerary.html?tripId=${tripId}`;
};

// Load activities
window.loadActivities = async function () {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const activitiesRef = collection(db, "activities");
  const snapshot = await getDocs(activitiesRef);

  snapshot.forEach(docSnap => {
    const activity = docSnap.data();

    if (type && activity.type !== type) return;
    if (!activity.name.toLowerCase().includes(keyword)) return;

    const card = document.createElement("div");
    card.className = "activity-card";

    card.innerHTML = `
      <strong>${activity.name}</strong>
      <div class="activity-meta">
        ${activity.type} • ₹${activity.cost} • ${activity.duration}
      </div>
      <p>${activity.description}</p>
      <button>Add Activity</button>
    `;

    card.querySelector("button").onclick = () =>
      addActivityToTrip(docSnap.id, activity);

    resultsDiv.appendChild(card);
  });
};

// Add activity
async function addActivityToTrip(activityId, activity) {
  const tripActivitiesRef = collection(db, "trip_activities");

  // Prevent duplicate
  const q = query(
    tripActivitiesRef,
    where("trip_id", "==", tripId),
    where("stop_id", "==", stopId),
    where("activity_id", "==", activityId)
  );

  const existing = await getDocs(q);
  if (!existing.empty) {
    alert("Activity already added");
    return;
  }

  await addDoc(tripActivitiesRef, {
    trip_id: tripId,
    stop_id: stopId,
    activity_id: activityId,
    name: activity.name,
    cost: activity.cost,
    duration: activity.duration,
    type: activity.type,
    added_at: Date.now()
  });

  window.location.href = `itinerary.html?tripId=${tripId}`;
}
