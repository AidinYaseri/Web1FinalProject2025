"use strict";

// === Play Background Music ===
window.addEventListener("load", () => {
  const audio = document.querySelector("#bgMusic");
  audio.play().catch(() => console.warn("Autoplay blocked — waiting for user action..."));
});

document.addEventListener("click", (event) => {
  const btn = event.target;

  if (btn.classList.contains("cc")) {
    window.location.href = "../cookie-clicker/cookie-clicker.html";
  }
  else if (btn.classList.contains("am")) {
    window.location.href = "../absolute-monopoly/absolute-monopoly.html";
  }
  else if (btn.classList.contains("ts")) {
    window.location.href = "../the-shop/the-shop.html";
  }
  else if (btn.classList.contains("cs")) {
    window.location.href = "../character-selection/player-selection.html";
  }
});
