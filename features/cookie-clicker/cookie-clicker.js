"use strict";
import { PLAYER_TWO } from "../../constants/player.js"; 

const p1CookiesEl = document.querySelector("#p1-cookies");
const p2CookiesEl = document.querySelector("#p2-cookies");
const p1HealthEl = document.querySelector("#p1-health");
const p2HealthEl = document.querySelector("#p2-health");
const playerNameEl = document.querySelector("#player-name");
const characterImgEl = document.querySelector(".character-icon img");
const audio = new Audio("./assets/bart-haha.mp3");

const selectedPlayer = JSON.parse(localStorage.getItem("selectedPlayer"));

function updateUI() {
  // Player 1
  p1CookiesEl.textContent = selectedPlayer.totalScore;
  p1HealthEl.style.width = selectedPlayer.totalHealth + "%";
  p1HealthEl.className = `health-bar ${healthColorClass(selectedPlayer.totalHealth)}`;
  // Player 2
  p2CookiesEl.textContent = PLAYER_TWO.totalScore;
  p2HealthEl.style.width = PLAYER_TWO.totalHealth + "%";
  p2HealthEl.className = `health-bar ${healthColorClass(PLAYER_TWO.totalHealth)}`;
  console.log(selectedPlayer.totalScore)
}

function healthColorClass(health) {
  if (health > 50) return "health-green";
  if (health > 20) return "health-orange";
  return "health-red";
}
function resetGame() {
  selectedPlayer.totalScore = 0;
  PLAYER_TWO.totalScore = 0;
  selectedPlayer.totalHealth = 100;
  PLAYER_TWO.totalHealth = 100;
  updateUI();
}

function bake(player) {
  player.totalScore += 1;
  updateUI();
}

function smack(attacker, defender) {
  if (attacker.totalScore >= 1) {
    attacker.totalScore -= 1;
    defender.totalHealth = Math.max(0, defender.totalHealth - 10);
    updateUI();
  }
}

function consume(player) {
  if (player.totalScore >= 2 && player.totalHealth < 100) {
    player.totalScore -= 2;
    player.totalHealth = Math.min(100, player.totalHealth + 20);
    updateUI();
  }
}


document.querySelector("#player1 .bake").addEventListener("click", () => bake(selectedPlayer));
document.querySelector("#player1 .smack").addEventListener("click", () => smack(selectedPlayer, PLAYER_TWO));
document.querySelector("#player1 .consume").addEventListener("click", () => consume(selectedPlayer));

document.querySelector("#player2 .bake").addEventListener("click", () => bake(PLAYER_TWO));
document.querySelector("#player2 .smack").addEventListener("click", () => smack(PLAYER_TWO, selectedPlayer));
document.querySelector("#player2 .consume").addEventListener("click", () => consume(PLAYER_TWO));


function checkGameOver() {
  if (selectedPlayer.totalHealth <= 0 ||
      (selectedPlayer.totalScore > PLAYER_TWO.totalScore * 3 && PLAYER_TWO.totalScore > 0) ||
      (PLAYER_TWO.totalScore === 0 && selectedPlayer.totalScore > 2)) {
    audio.play();
    alert(`${selectedPlayer.playerId} Wins!`);
    resetGame();
    return;
  }

  if (PLAYER_TWO.totalHealth <= 0 ||
      (PLAYER_TWO.totalScore > selectedPlayer.totalScore * 3 && selectedPlayer.totalScore > 0) ||
      (selectedPlayer.totalScore === 0 && PLAYER_TWO.totalScore > 2)) {
    audio.play();
    alert("Player Two Wins!");
    resetGame();
  }
}
playerNameEl.textContent = selectedPlayer.playerId;
characterImgEl.src = selectedPlayer.imagesrc;
updateUI();
setInterval(checkGameOver, 500);
