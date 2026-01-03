import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "../firebase.js";

const db = getFirestore(app);

// Get tripId
const params = new URLSearchParams(window.location.search);
const tripId = params.get("tripId");

console.log("Trip ID:", tripId);

// Back arrow
window.goBack = function () {
  window.location.href = "createtrip.html";
};

// Add section
document.querySelector(".add-btn")?.addEventListener("click", () => {
  const container = document.getElementById("sections-container");
  const count = container.children.length + 1;

  const section = document.createElement("div");
  section.className = "itinerary-section";
  section.innerHTML = `
    <h4>Section ${count}</h4>
    <p>Travel / Hotel / Activity</p>
    <div class="inline">
      <input class="date-range" placeholder="Date range">
      <input class="budget" placeholder="Budget">
    </div>
  `;

  container.appendChild(section);
});

// Save itinerary
window.saveItinerary = async function () {
  console.log("Save button clicked");

  if (!tripId) {
    alert("Trip ID missing. Please go back and create the trip again.");
    return;
  }

  const sections = document.querySelectorAll(".itinerary-section");
  console.log("Sections found:", sections.length);

  try {
    for (let i = 0; i < sections.length; i++) {
      const dateRange = sections[i].querySelector(".date-range").value;
      const budget = sections[i].querySelector(".budget").value;

      console.log(`Saving section ${i + 1}`, dateRange, budget);

      await addDoc(collection(db, "trip_sections"), {
        trip_id: tripId,
        description: `Section ${i + 1}`,
        date_range: dateRange,
        budget: budget,
        order_index: i + 1,
        created_at: serverTimestamp()
      });
    }

    alert("Itinerary saved successfully!");

  } catch (error) {
    console.error("SAVE ERROR:", error);
    alert("Failed to save itinerary. Check console.");
  }
};
