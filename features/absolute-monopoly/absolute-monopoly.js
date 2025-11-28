"use strict";

let selectedPlayer =
  JSON.parse(localStorage.getItem("selectedPlayer"));

const saved = JSON.parse(localStorage.getItem("fullGameState"));

let product = saved.product ?? 0;
let itemPrice = saved.itemPrice ?? 0.01;
let funds = saved.funds ?? 0;
let rawMaterial = saved.rawMaterial ?? 100;
let cps = saved.cps ?? 0;
let clickCount = saved.clickCount ?? 0;
let factories = saved.factories ?? 0;

const updateCharacterUI = (player) => {
  document.querySelector(".character-icon img").src = player.imagesrc;
  document.querySelector("#player2Id").textContent = player.playerId;
  document.querySelector("#player2Resilience").textContent = `Resilience: ${player.stats.resilience}`;
  document.querySelector("#player2Exhaustion").textContent = `Exhaustion: ${player.stats.exhaustion}`;
  document.querySelector("#player2Defense").textContent = `Defense: ${player.stats.defense}`;
  document.querySelector("#player2Avatar").src = player.imagesrc;
};
updateCharacterUI(selectedPlayer);

const $ = (selector) => document.querySelector(selector);
const makeButton = $(".main-btn");
const unsoldInventory = $("#unsold");
const priceUpButton = $("#priceUp");
const priceDownButton = $("#priceDown");
const ppi = $("#ppi");
const fundsDisplay = $("#funds");
const demandDisplay = $("#demand");
const rawMaterialDisplay = $("#rawMaterial");
const cpsDisplay = $("#cps");
const buyWireButton = $("#buyWire");
const factoriesDisplay = $("#factoriesDisplay");
const buyFactoryButton = $("#buyFactory");
const commentBox = $(".speech-bubble");

const baseDemand = 10,
  priceSensitivity = 50,
  materialPerItem = 1,
  baseWireCost = 0.01,
  factoryCost = 25,
  factoryWireCost = 20,
  factoryProduction = 4;

const npcComments = [
  "Another factory?! The skyline’s changing already!",
  "You’re hiring? My cousin needs a job!",
  "Big spender, huh? Those machines aren’t cheap!",
  "I can hear the gears turning from miles away…",
  "Local news: a new production giant is born!",
  "More factories mean more goods… and more profits!",
  "Careful! Don’t forget maintenance costs!",
  "Automation is taking over… one click at a time.",
  "People are calling you the next industrial tycoon!",
  "Investors are watching. Don’t mess this up!"
];

const updateInventory = () =>
  (unsoldInventory.textContent = `Unsold Inventory: ${product}`);

const updatePrice = () =>
  (ppi.textContent = `Price per item: $${itemPrice.toFixed(2)}`);

const updateFunds = () =>
  (fundsDisplay.textContent = `Funds: $${funds.toFixed(2)}`);

const updateDemand = () => {
  const demandRatio = baseDemand - priceSensitivity * itemPrice;
  const demandPercent = Math.max(
    0,
    Math.min(100, Math.floor((demandRatio / baseDemand) * 100))
  );
  demandDisplay.textContent = `Public Demand: ${demandPercent}%`;
  return demandPercent;
};

const updateRawMaterial = () =>
  (rawMaterialDisplay.textContent = `Raw Material Remaining: ${rawMaterial}`);

const updateCPS = () => {
  cps = clickCount + factories * factoryProduction;
  cpsDisplay.textContent = `Production per Second: ${cps}`;
  clickCount = 0;
};

const updateFactories = () => {
  factoriesDisplay.textContent = `Factories: ${factories}`;
  buyFactoryButton.textContent = `Purchase ($${factoryCost})`;
};

const updateWireCost = () => {
  const lowFactor = Math.max(1, (50 - rawMaterial) / 10);
  const amountToBuy = Math.ceil(lowFactor * 10);
  buyWireButton.textContent = `Purchase Wire ($${(amountToBuy * baseWireCost).toFixed(2)})`;
};

const showNPCComment = () =>
  (commentBox.textContent = npcComments[Math.floor(Math.random() * npcComments.length)]);

function saveGame() {
  const fullGameState = {
    product,
    itemPrice,
    funds,
    rawMaterial,
    cps,
    clickCount,
    factories,
    selectedPlayer
  };
  localStorage.setItem("fullGameState", JSON.stringify(fullGameState));
  localStorage.setItem("selectedPlayer", JSON.stringify(selectedPlayer));
}


makeButton.addEventListener("click", () => {
  if (rawMaterial >= materialPerItem) {
    product++;
    clickCount++;
    rawMaterial -= materialPerItem;
    updateInventory();
    updateRawMaterial();
    updateWireCost();
    saveGame();
  }
});

priceUpButton.addEventListener("click", () => {
  itemPrice = parseFloat((itemPrice + 0.01).toFixed(2));
  updatePrice();
  saveGame();
});

priceDownButton.addEventListener("click", () => {
  itemPrice = Math.max(0.01, parseFloat((itemPrice - 0.01).toFixed(2)));
  updatePrice();
  saveGame();
});

buyWireButton.addEventListener("click", () => {
  const lowFactor = Math.max(1, (50 - rawMaterial) / 10);
  const amountToBuy = Math.ceil(lowFactor * 10);
  const cost = amountToBuy * baseWireCost;

  if (funds >= cost) {
    rawMaterial += amountToBuy;
    funds -= cost;
    updateRawMaterial();
    updateFunds();
    updateWireCost();
    saveGame();
  } else alert("Not enough funds to buy wire!");
});

buyFactoryButton.addEventListener("click", () => {
  if (funds < factoryCost && rawMaterial < factoryWireCost)
    return alert(`Not enough funds ($${funds.toFixed(2)}) and wire (${rawMaterial}) to buy a factory!`);

  if (funds < factoryCost) return alert(`Not enough funds! You need $${factoryCost}`);
  if (rawMaterial < factoryWireCost) return alert(`Not enough wire! You need ${factoryWireCost} units`);

  funds -= factoryCost;
  rawMaterial -= factoryWireCost;
  factories++;
  updateFunds();
  updateRawMaterial();
  updateFactories();
  updateCPS();
  updateWireCost();
  showNPCComment();
  saveGame();
});

setInterval(() => {
  let totalProduction = 0;

  // Click-based production
  if (rawMaterial >= materialPerItem && clickCount > 0) {
    const clickProd = Math.min(clickCount, rawMaterial);
    totalProduction += clickProd;
    rawMaterial -= clickProd;
  }

  // Factory production
  if (factories > 0 && rawMaterial > 0) {
    const factoryProd = Math.min(factories * factoryProduction, rawMaterial);
    totalProduction += factoryProd;
    rawMaterial -= factoryProd;
  }

  product += totalProduction;

  // Item sales
  const currentDemand = updateDemand();
  if (product > 0) {
    const sold = Math.min(product, currentDemand);
    product -= sold;
    funds += sold * itemPrice;
  }

  // UI + Save
  updateInventory();
  updateFunds();
  updateRawMaterial();
  updateWireCost();
  updateCPS();
  updateFactories();
  saveGame();
}, 1000);

// INITIAL UI UPDATE 
updateInventory();
updatePrice();
updateFunds();
updateRawMaterial();
updateWireCost();
updateCPS();
updateFactories();
