// All shop content lives here as pure data. Every entry shares the same
// Purchasable pipeline in economy.ts, so adding a producer or upgrade is a
// new entry — never new code. Icons are hand-drawn inline SVG (48x48).

import type { Purchasable } from "./economy.ts";

const BUTTON_MUSHROOM: Purchasable = {
  id: "button-mushroom",
  name: "Button Mushroom",
  flavor: "The humble starter of every patch.",
  icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 7c-10.5 0-17 7-17 14 0 3 3 4.5 6.5 4.5h21c3.5 0 6.5-1.5 6.5-4.5 0-7-6.5-14-17-14z" fill="#c14f39"/>
  <circle cx="16" cy="15" r="3" fill="#f2e8cf"/>
  <circle cx="27" cy="12" r="2" fill="#f2e8cf"/>
  <circle cx="31" cy="17" r="2.5" fill="#f2e8cf"/>
  <path d="M19 25.5h10v11a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" fill="#efe3c8"/>
</svg>`,
  baseCost: 15,
  costGrowth: 1.15,
  repeatable: true,
  effects: [{ kind: "rateAdd", value: 0.1 }],
};

const OYSTER_MUSHROOM: Purchasable = {
  id: "oyster-mushroom",
  name: "Oyster Mushroom",
  flavor: "Fans out across dead wood, politely.",
  icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="26" width="36" height="7" rx="3" fill="#6b4f35"/>
  <path d="M24 10c-7 2-13 8-15 16 5 2 11 1 15-2 4-3 5-9 0-14z" fill="#d8b4a0"/>
  <path d="M27 12c1 6-1 12-6 15 5 3 12 2 15-4 2-5-1-10-9-11z" fill="#e0c6b4"/>
  <circle cx="20" cy="24" r="2" fill="#c39c88"/>
</svg>`,
  baseCost: 100,
  costGrowth: 1.15,
  repeatable: true,
  effects: [{ kind: "rateAdd", value: 1 }],
};

const CHANTERELLE: Purchasable = {
  id: "chanterelle",
  name: "Chanterelle",
  flavor: "Smells of apricots and ambition.",
  icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 8c-5 8-11 14-12 19-1 6 5 9 12 9s13-3 12-9c-1-5-7-11-12-19z" fill="#e8a33d"/>
  <ellipse cx="24" cy="29" rx="9" ry="6" fill="#c77f2a"/>
</svg>`,
  baseCost: 1_100,
  costGrowth: 1.15,
  repeatable: true,
  effects: [{ kind: "rateAdd", value: 8 }],
};

const RICH_COMPOST: Purchasable = {
  id: "rich-compost",
  name: "Rich Compost",
  flavor: "Rotten bananas, premium clicks.",
  icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 38c0-7 7-11 16-11s16 4 16 11z" fill="#6b4f35"/>
  <path d="M14 32c2-4 6-6 10-6" stroke="#7f5f42" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M34 12l1.8 4.7L40.5 18l-4.7 1.8L34 24.5l-1.8-4.7L27.5 18l4.7-1.3z" fill="#e8b04b"/>
</svg>`,
  baseCost: 25,
  costGrowth: 1.7,
  repeatable: true,
  effects: [{ kind: "clickAdd", value: 1 }],
};

const SPORE_VENTS: Purchasable = {
  id: "spore-vents",
  name: "Spore Vents",
  flavor: "A gentle updraft spreads every spore.",
  icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 27c0-8 5-13 10-13s10 5 10 13z" fill="#c14f39"/>
  <path d="M20 27h8v9a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3z" fill="#efe3c8"/>
  <g fill="#e8b04b">
    <circle cx="11" cy="14" r="2"/>
    <circle cx="20" cy="7" r="2"/>
    <circle cx="29" cy="5" r="2"/>
    <circle cx="38" cy="12" r="2"/>
  </g>
</svg>`,
  baseCost: 250,
  costGrowth: 2.2,
  repeatable: true,
  effects: [{ kind: "rateMult", value: 1.1 }],
};

const MYCELIUM_NETWORK: Purchasable = {
  id: "mycelium-network",
  name: "Mycelium Network",
  flavor: "One mind, ten thousand threads.",
  icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#e8b04b" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M24 42V22M24 32c-6-2-10-7-10-13M24 32c6-2 10-7 10-13M24 22c-3-4-3-9 0-13M24 22c3-4 3-9 0-13M14 19l-4-2M34 19l4-2"/>
  </g>
  <circle cx="24" cy="9" r="3" fill="#f2e8cf"/>
</svg>`,
  baseCost: 50_000,
  costGrowth: 1,
  repeatable: false,
  effects: [{ kind: "rateMult", value: 2 }, { kind: "clickMult", value: 2 }],
};

/** Shop order is display order; the cheapest thing to buy comes first. */
export const PURCHASABLES: Purchasable[] = [
  BUTTON_MUSHROOM,
  RICH_COMPOST,
  OYSTER_MUSHROOM,
  SPORE_VENTS,
  CHANTERELLE,
  MYCELIUM_NETWORK,
];
