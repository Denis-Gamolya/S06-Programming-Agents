// Shared economy types and formatting. Every purchase, effect, and number
// shown to the player funnels through here so the rules stay in one place.
// Spores are floats internally; display floors them so the counter ticks
// in whole spores.

import type { GameState } from "./state.ts";
import { PURCHASABLES } from "./content.ts";

export type Effect =
  /** +value spores per click, per copy owned. */
  | { kind: "clickAdd"; value: number }
  /** Clicks are multiplied by value, per copy owned. */
  | { kind: "clickMult"; value: number }
  /** +value spores per second, per copy owned. */
  | { kind: "rateAdd"; value: number }
  /** Production is multiplied by value, per copy owned. */
  | { kind: "rateMult"; value: number };

export interface Purchasable {
  id: string;
  name: string;
  flavor: string;
  /** Inline SVG markup, 48x48 viewBox, drawn from scratch. */
  icon: string;
  baseCost: number;
  /** Cost multiplier applied per already-owned copy. */
  costGrowth: number;
  /** One-shot upgrades are buyable once; everything else repeats forever. */
  repeatable: boolean;
  effects: Effect[];
}

export interface Rates {
  clickPower: number;
  sporesPerSecond: number;
}

/** Every garden drips a few spores: the dormant mycelium grows on its own. */
export const BASE_SPORES_PER_SECOND = 0.2;

/** Additive effects stack first, then every multiplier applies once. */
export function derive(owned: Record<string, number>): Rates {
  let clickAdd = 1;
  let clickMult = 1;
  let rateAdd = 0;
  let rateMult = 1;
  for (const item of PURCHASABLES) {
    const count = owned[item.id] ?? 0;
    if (count === 0) continue;
    for (const effect of item.effects) {
      if (effect.kind === "clickAdd") clickAdd += effect.value * count;
      else if (effect.kind === "clickMult") clickMult *= effect.value ** count;
      else if (effect.kind === "rateAdd") rateAdd += effect.value * count;
      else rateMult *= effect.value ** count;
    }
  }
  return {
    clickPower: clickAdd * clickMult,
    sporesPerSecond: (BASE_SPORES_PER_SECOND + rateAdd) * rateMult,
  };
}

const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi"];

/** 1234.5 -> "1.23K". Values under 1000 render as whole numbers. */
export function formatSpores(n: number): string {
  if (n < 1000) return String(Math.floor(n));
  const tier = Math.min(Math.floor(Math.log10(n) / 3), SUFFIXES.length - 1);
  const scaled = n / 10 ** (tier * 3);
  const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return `${scaled.toFixed(digits)}${SUFFIXES[tier]}`;
}

/** Rates keep one decimal below 100/s so "+0.2/s" does not read as "+0/s". */
export function formatRate(n: number): string {
  if (n < 100) return n.toFixed(1);
  return formatSpores(n);
}

/** Price of the next copy: every owned copy multiplies the base. */
export function costOf(item: Purchasable, owned: number): number {
  return Math.ceil(item.baseCost * item.costGrowth ** owned);
}

/** Human-readable summary of what one copy of the item contributes. */
export function describe(item: Purchasable): string {
  const parts: string[] = [];
  for (const effect of item.effects) {
    if (effect.kind === "clickAdd") {
      parts.push(`+${formatSpores(effect.value)} per click`);
    } else if (effect.kind === "clickMult") {
      parts.push(`clicks ×${effect.value}`);
    } else if (effect.kind === "rateAdd") {
      parts.push(`+${formatRate(effect.value)}/s each`);
    } else {
      parts.push(`production ×${effect.value}`);
    }
  }
  return parts.join(", ");
}

/** Try to buy the next copy. False when too dear or already installed. */
export function purchase(state: GameState, item: Purchasable): boolean {
  const owned = state.owned[item.id] ?? 0;
  if (!item.repeatable && owned > 0) return false;
  const price = costOf(item, owned);
  if (state.spores < price) return false;
  state.spores -= price;
  state.owned[item.id] = owned + 1;
  return true;
}
