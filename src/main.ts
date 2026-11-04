// Mycelia — a mushroom-garden clicker. Bootstrap the state, wire the
// controls, and hand everything else to render.

import "./style.css";
import { BASE_SPORES_PER_SECOND, formatSpores, type Rates } from "./economy.ts";
import { bump, mount, spawnFloater, update } from "./render.ts";
import { initialState } from "./state.ts";

// The patch starts dormant: passive growth is just the mycelium until the
// player plants something (a later step reshapes this into derived rates).
const RATES: Rates = {
  clickPower: 1,
  sporesPerSecond: BASE_SPORES_PER_SECOND,
};

const state = initialState();

mount();
update(state, RATES);

const clicker = document.querySelector<HTMLButtonElement>("#clicker")!;

// Passive growth runs on animation frames, not a timer: each frame adds
// rate x seconds-elapsed, so the counter moves smoothly and survives tab
// switches (a paused rAF catches up with one big delta on return).
let last = performance.now();
function frame(now: number): void {
  const seconds = (now - last) / 1000;
  last = now;
  const grown = RATES.sporesPerSecond * seconds;
  state.spores += grown;
  state.totalSpores += grown;
  update(state, RATES);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

clicker.addEventListener("click", (event) => {
  state.spores += RATES.clickPower;
  state.totalSpores += RATES.clickPower;
  state.totalClicks += 1;

  // Keyboard clicks land at (0, 0); float from the mushroom's heart instead.
  const rect = clicker.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;
  spawnFloater(x, y, `+${formatSpores(RATES.clickPower)}`);
  bump(clicker);
  update(state, RATES);
});
