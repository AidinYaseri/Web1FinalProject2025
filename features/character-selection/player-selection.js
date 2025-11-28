"use strict";
import { SIMPSONS_CHARACTERS } from "../../services/character-api.js";

let selectedPlayer = null;

// === Play Background Music ===
window.addEventListener("load", () => {
  const audio = document.querySelector("#bgMusic");
  audio.play().catch(() => console.warn("Autoplay blocked — waiting for user action..."));
});

const normalizeId = str => str.replace(/\s+/g, "");

const validateGuest = ({ name, age, res, exh, def, file }) => {
  if (!name) return "Enter a name.";
  if (!age || age < 16 || age > 120) return "Age must be between 16 and 120.";
  if ([res, exh, def].some(v => isNaN(v))) return "Select all stats.";
  if (!file) return "Upload an image.";
  return null;
};

const container = document.querySelector(".fighter-container");
SIMPSONS_CHARACTERS.forEach(player => {
  const cleanId = normalizeId(player.playerId);
  container.insertAdjacentHTML("beforeend", `
    <div class="fighter-card" data-player="${cleanId}">
      <img class="avatar" src="${player.imagesrc}" alt="${player.playerId} Avatar" />
      <h2>${player.playerId}</h2>
      <div class="stats">
        <ul>
          <li>Resilience: ${player.stats.resilience}</li>
          <li>Exhaustion: ${player.stats.exhaustion}</li>
          <li>Defense: ${player.stats.defense}</li>
        </ul>
      </div>
    </div>
  `);
});

const cards = document.querySelectorAll(".fighter-card");
cards.forEach(card => {
  card.addEventListener("click", () => {
    cards.forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");

    const playerId = card.dataset.player;
    selectedPlayer = SIMPSONS_CHARACTERS.find(p => normalizeId(p.playerId) === playerId) || { playerId: "guest" };
  });
});

const imageUpload = document.querySelector("#imageUpload");
const preview = document.querySelector("#preview");
imageUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => preview.style.backgroundImage = `url(${reader.result})`;
  reader.readAsDataURL(file);
});

document.querySelector("#fighterForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!selectedPlayer) return alert("Please select a fighter before starting the game.");

  let playerData;

  if (selectedPlayer.playerId.toLowerCase() === "guest") {
    const name = document.querySelector("#guestName").value.trim();
    const age = parseInt(document.querySelector("#guestAge").value);
    const res = parseInt(document.querySelector("#resilience").value);
    const exh = parseInt(document.querySelector("#exhaustion").value);
    const def = parseInt(document.querySelector("#defense").value);
    const file = imageUpload.files[0];

    const error = validateGuest({ name, age, res, exh, def, file });
    if (error) return alert(error);

    const bgImage = preview.style.backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");

    playerData = {
      playerId: name,
      totalScore: 0,
      totalHealth: 100,
      stats: { resilience: res, exhaustion: exh, defense: def },
      imagesrc: bgImage
    };
  } else {
    playerData = selectedPlayer;
  }

  localStorage.setItem("selectedPlayer", JSON.stringify(playerData));

  window.location.href = "../main-menu/main-menu.html";
});
