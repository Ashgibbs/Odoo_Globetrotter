import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "../firebase.js";

const db = getFirestore(app);

// Get tripId from URL
const params = new URLSearchParams(window.location.search);
const tripId = params.get("tripId");

if (!tripId) {
  alert("Invalid Trip");
  window.location.href = "dashboard.html";
}

// Back to itinerary
window.goBack = function () {
  window.location.href = `itinerary.html?tripId=${tripId}`;
};

// Load cities
window.loadCities = async function () {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const citiesRef = collection(db, "cities");
  const snapshot = await getDocs(citiesRef);

  snapshot.forEach(doc => {
    const city = doc.data();

    if (!city.city_name.toLowerCase().includes(keyword)) return;

    const card = document.createElement("div");
    card.className = "city-card";

    card.innerHTML = `
      <strong>${city.city_name}</strong>
      <div class="city-meta">
        ${city.country} • Cost Index: ${city.cost_index} • Popularity: ${city.popularity}
      </div>
      <button>Add to Trip</button>
    `;

    card.querySelector("button").onclick = () =>
      addCityToTrip(doc.id, city.city_name);

    resultsDiv.appendChild(card);
  });
};

// Add city to trip
async function addCityToTrip(cityId, cityName) {
  const tripCitiesRef = collection(db, "trip_cities");

  // Prevent duplicate add
  const q = query(
    tripCitiesRef,
    where("trip_id", "==", tripId),
    where("city_id", "==", cityId)
  );

  const existing = await getDocs(q);
  if (!existing.empty) {
    alert("City already added to this trip");
    return;
  }

  await addDoc(tripCitiesRef, {
    trip_id: tripId,
    city_id: cityId,
    city_name: cityName,
    order_index: Date.now()
  });

  window.location.href = `itinerary.html?tripId=${tripId}`;
}
