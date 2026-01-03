import { auth, db } from "../firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ← Back arrow
window.goBack = function () {
  window.location.href = "dashboard.html";
};

// Save trip
window.continueToItinerary = async function () {
  const tripName = document.getElementById("tripName").value.trim();
  const place = document.getElementById("place").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!tripName || !place || !startDate || !endDate) {
    alert("Please fill all required fields");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in");
    return;
  }

  try {
    const tripRef = await addDoc(collection(db, "trips"), {
      user_id: user.uid,
      trip_name: tripName,
      primary_place: place,
      start_date: startDate,
      end_date: endDate,
      status: "draft",
      created_at: serverTimestamp()
    });

    alert("Trip created successfully!\nTrip ID: " + tripRef.id);

    window.location.href = `itinerary.html?tripId=${tripRef.id}`;

  } catch (err) {
    console.error("Firestore error:", err);
    alert("Firestore write failed. Check console.");
  }
};
