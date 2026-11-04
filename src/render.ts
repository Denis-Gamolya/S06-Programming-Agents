// All DOM writes live here so game logic never touches the document.
// Everything shown is built once at mount, then only mutated.

import { BIG_MUSHROOM_SVG } from "./art.ts";
import { formatRate, formatSpores, type Rates } from "./economy.ts";
import type { GameState } from "./state.ts";

let sporesEl: HTMLElement;
let rateEl: HTMLElement;
let lifelineEl: HTMLElement;

/** Wire the dynamic parts into the static index.html skeleton. */
export function mount(): void {
  sporesEl = document.querySelector<HTMLElement>("#spores")!;
  rateEl = document.querySelector<HTMLElement>("#rate")!;
  lifelineEl = document.querySelector<HTMLElement>("#lifeline")!;

  const clicker = document.querySelector<HTMLButtonElement>("#clicker")!;
  clicker.innerHTML = BIG_MUSHROOM_SVG;
}

/** Refresh every readout. Cheap enough to call on every animation frame. */
export function update(state: GameState, rates: Rates): void {
  setText(sporesEl, formatSpores(state.spores));
  setText(rateEl, `+${formatRate(rates.sporesPerSecond)}/s`);
  setText(
    lifelineEl,
    `${state.totalClicks} clicks · ${
      formatSpores(state.totalSpores)
    } spores harvested`,
  );
}

/** A little "+N" that drifts up from wherever the player clicked. */
export function spawnFloater(x: number, y: number, text: string): void {
  const floater = document.createElement("span");
  floater.className = "floater";
  floater.textContent = text;
  floater.style.left = `${x}px`;
  floater.style.top = `${y}px`;
  document.body.append(floater);
  floater.addEventListener("animationend", () => floater.remove());
}

/** Restart the squash-and-stretch animation on the big mushroom. */
export function bump(clicker: HTMLElement): void {
  clicker.classList.remove("bumping");
  // Force a reflow so removing and re-adding the class restarts the keyframe.
  void clicker.offsetWidth;
  clicker.classList.add("bumping");
}

function setText(el: HTMLElement, text: string): void {
  if (el.textContent !== text) el.textContent = text;
}
