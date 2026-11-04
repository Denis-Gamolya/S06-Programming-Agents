// All DOM writes live here so game logic never touches the document.
// Cards and clumps are built once, then only mutated — update functions
// diff the cheap bits so every-frame refreshes stay trivial.

import { BIG_MUSHROOM_SVG } from "./art.ts";
import { PURCHASABLES } from "./content.ts";
import {
  costOf,
  describe,
  formatRate,
  formatSpores,
  type Purchasable,
  type Rates,
} from "./economy.ts";
import type { GameState } from "./state.ts";

let sporesEl: HTMLElement;
let rateEl: HTMLElement;
let lifelineEl: HTMLElement;
let patchEl: HTMLElement;

interface CardRefs {
  item: Purchasable;
  root: HTMLButtonElement;
  costEl: HTMLElement;
  ownedEl: HTMLElement;
}

interface ClumpRefs {
  root: HTMLElement;
  spriteEl: HTMLElement;
  countEl: HTMLElement;
  lastCount: number;
}

const cards: CardRefs[] = [];
const clumps = new Map<string, ClumpRefs>();

/** Wire the dynamic parts into the static index.html skeleton. */
export function mount(): void {
  sporesEl = document.querySelector<HTMLElement>("#spores")!;
  rateEl = document.querySelector<HTMLElement>("#rate")!;
  lifelineEl = document.querySelector<HTMLElement>("#lifeline")!;
  patchEl = document.querySelector<HTMLElement>("#patch")!;

  const clicker = document.querySelector<HTMLButtonElement>("#clicker")!;
  clicker.innerHTML = BIG_MUSHROOM_SVG;

  // The patch now grows on its own, so the per-second readout goes live.
  rateEl.hidden = false;

  const cardList = document.querySelector<HTMLElement>("#cards")!;
  const byPrice = [...PURCHASABLES].sort((a, b) => a.baseCost - b.baseCost);
  for (const item of byPrice) cardList.append(buildCard(item));
}

function buildCard(item: Purchasable): HTMLButtonElement {
  const root = document.createElement("button");
  root.type = "button";
  root.className = "card";
  root.dataset.id = item.id;
  root.setAttribute("aria-label", `${item.name}. ${item.flavor}`);

  const icon = document.createElement("span");
  icon.className = "icon";
  icon.innerHTML = item.icon;

  const info = document.createElement("span");
  const name = document.createElement("span");
  name.className = "name";
  name.textContent = item.name;
  const effect = document.createElement("span");
  effect.className = "effect";
  effect.textContent = describe(item);
  info.append(name, effect);

  const buy = document.createElement("span");
  buy.className = "buy";
  const costEl = document.createElement("span");
  costEl.className = "cost";
  const ownedEl = document.createElement("span");
  ownedEl.className = "owned";
  buy.append(costEl, ownedEl);

  root.append(icon, info, buy);
  cards.push({ item, root, costEl, ownedEl });
  return root;
}

/** Refresh prices, owned counts, and affordability of every shop card. */
export function updateShop(state: GameState): void {
  for (const card of cards) {
    const owned = state.owned[card.item.id] ?? 0;
    const soldOut = !card.item.repeatable && owned > 0;
    const price = costOf(card.item, owned);
    setText(card.costEl, soldOut ? "✓" : formatSpores(price));
    setText(card.ownedEl, owned === 0 ? "" : `owned ×${owned}`);
    card.root.classList.toggle("owned-out", soldOut);
    card.root.classList.toggle(
      "affordable",
      !soldOut && state.spores >= price,
    );
  }
}

/** Sync the soil with what is planted: one sprite clump per kind. */
export function updatePatch(state: GameState): void {
  for (const item of PURCHASABLES) {
    const grows = item.effects.some((e) =>
      e.kind === "rateAdd" || e.kind === "rateMult"
    );
    const owned = state.owned[item.id] ?? 0;
    let clump = clumps.get(item.id);

    if (owned === 0 || !grows) {
      if (clump) {
        clump.root.remove();
        clumps.delete(item.id);
      }
      continue;
    }
    if (!clump) {
      clump = buildClump(item);
      clumps.set(item.id, clump);
      patchEl.append(clump.root);
    }

    setText(clump.countEl, `×${owned}`);
    if (clump.lastCount !== owned) {
      clump.lastCount = owned;
      retrigger(clump.spriteEl, "pop");
      retrigger(clump.countEl, "bump");
    }
  }
}

function buildClump(item: Purchasable): ClumpRefs {
  const root = document.createElement("div");
  root.className = "clump";
  const spriteEl = document.createElement("div");
  spriteEl.className = "sprite";
  spriteEl.innerHTML = item.icon;
  const countEl = document.createElement("span");
  countEl.className = "count";
  root.append(spriteEl, countEl);
  return { root, spriteEl, countEl, lastCount: 0 };
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

/** Flash a card that just sold, and pop the sprite it planted. */
export function flashPurchased(card: HTMLElement): void {
  retrigger(card, "bought");
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
  retrigger(clicker, "bumping");
}

/** Re-add a class after a reflow so its keyframe animation restarts. */
function retrigger(el: HTMLElement, className: string): void {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function setText(el: HTMLElement, text: string): void {
  if (el.textContent !== text) el.textContent = text;
}
