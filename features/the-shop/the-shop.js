"use strict";
import { ITEMS } from "../../constants/items.js";

let selectedPlayer = JSON.parse(localStorage.getItem("selectedPlayer"));
let fullGameState = JSON.parse(localStorage.getItem("fullGameState"));
$(".character-icon img").attr("src", selectedPlayer.imagesrc);

ITEMS.forEach((item) => {
  const stars = "★★★★★".slice(0, Math.round(item.rating.rate)) +
                "☆☆☆☆☆".slice(0, 5 - Math.round(item.rating.rate));

  $("#product-container").append(`
    <section class="product" data-price="${item.price}">
      <div class="info">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
      </div>

      <div class="image">
        <img data-src="${item.image}" alt="${item.title}">
      </div>

      <div class="purchase">
        <p class="price">$${item.price}</p>
        <div class="rating">
          <span>${stars}</span> <small>(${item.rating.count})</small>
        </div>
        <button class="purchase-btn">Purchase</button>
      </div>
    </section>
  `);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const product = $(entry.target);
    const img = product.find("img");
    const info = product.find(".info");
    const purchase = product.find(".purchase");
    const ratio = entry.intersectionRatio;

    if (entry.isIntersecting) {
      const src = img.data("src");
      if (src && !img.attr("src")) img.attr("src", src);

      img.addClass("visible");

      setTimeout(() => {
        if (ratio >= 0.25) {
          info.addClass("visible").removeClass("fadeout");
          purchase.addClass("visible").removeClass("fadeout");
        } else {
          info.addClass("fadeout").removeClass("visible");
          purchase.addClass("fadeout").removeClass("visible");
        }
      }, 250);
    }
  });
}, {
  threshold: Array.from({ length: 101 }, (_, i) => i / 100)
});

$(".product").each(function () {
  observer.observe(this);
});

$("#player-score").text(`${selectedPlayer.playerId}'s money: $${fullGameState.funds}`);

function updateAllButtons() {
  $(".product").each(function () {
    const price = parseFloat($(this).data("price"));
    const button = $(this).find(".purchase-btn");

    if (button.hasClass("owned")) return;

    if (selectedPlayer.totalScore >= price) {
      button.prop("disabled", false)
            .text("Purchase")
            .removeClass("disabled");
    } else {
      button.prop("disabled", true)
            .text("Not enough score")
            .addClass("disabled");
    }
  });
}

updateAllButtons();

$("#product-container").on("click", ".purchase-btn", function () {
  const section = $(this).closest(".product");
  const price = parseFloat(section.data("price"));
  const button = $(this);

  if (selectedPlayer.totalScore < price) return;

  // Deduct money
  fullGameState.funds -= price;
  $("#player-score").text(`${selectedPlayer.playerId}'s money: $${selectedPlayer.totalScore}`);

  // Mark as purchased
  button.text("Owned")
        .prop("disabled", true)
        .addClass("owned");
  section.addClass("purchased");

  // Save
  localStorage.setItem("selectedPlayer", JSON.stringify(selectedPlayer));

  // Update remaining buttons
  updateAllButtons();
});
