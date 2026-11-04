// Mycelia — a mushroom-garden clicker. Bootstrap the state, wire the
// controls, and hand everything else to render.

import "./style.css";
import { formatSpores, type Rates } from "./economy.ts";
import { bump, mount, spawnFloater, update } from "./render.ts";
import { initialState } from "./state.ts";

// No content has been planted yet; the loop in a later step grows these.
const RATES: Rates = { clickPower: 1, sporesPerSecond: 0 };

const state = initialState();

mount();
update(state, RATES);

const clicker = document.querySelector<HTMLButtonElement>("#clicker")!;

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
