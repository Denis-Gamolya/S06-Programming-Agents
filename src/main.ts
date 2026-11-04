// Mycelia — a mushroom-garden clicker. Bootstrap the state, wire the
// controls, run the animation-frame loop, and hand every DOM write to
// render.

import "./style.css";
import { PURCHASABLES } from "./content.ts";
import { derive, formatSpores, purchase } from "./economy.ts";
import {
  bump,
  flashPurchased,
  mount,
  spawnFloater,
  update,
  updatePatch,
  updateShop,
} from "./render.ts";
import { initialState } from "./state.ts";

const state = initialState();
// Derived rates change only when the garden changes, never per frame.
let rates = derive(state.owned);

mount();
update(state, rates);
updateShop(state);
updatePatch(state);

const clicker = document.querySelector<HTMLButtonElement>("#clicker")!;

clicker.addEventListener("click", (event) => {
  state.spores += rates.clickPower;
  state.totalSpores += rates.clickPower;
  state.totalClicks += 1;

  // Keyboard clicks land at (0, 0); float from the mushroom's heart instead.
  const rect = clicker.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;
  spawnFloater(x, y, `+${formatSpores(rates.clickPower)}`);
  bump(clicker);
  update(state, rates);
});

const cardList = document.querySelector<HTMLElement>("#cards")!;

cardList.addEventListener("click", (event) => {
  const card = (event.target as HTMLElement).closest<HTMLElement>(".card");
  if (!card) return;
  const item = PURCHASABLES.find((p) => p.id === card.dataset.id);
  if (!item || !purchase(state, item)) return;
  rates = derive(state.owned);
  flashPurchased(card);
  update(state, rates);
});

// Passive growth runs on animation frames, not a timer: each frame adds
// rate x seconds-elapsed, so the counter moves smoothly and survives tab
// switches (a paused rAF catches up with one big delta on return).
let last = performance.now();
function frame(now: number): void {
  const seconds = (now - last) / 1000;
  last = now;
  const grown = rates.sporesPerSecond * seconds;
  state.spores += grown;
  state.totalSpores += grown;
  update(state, rates);
  updateShop(state);
  updatePatch(state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
