// Shared economy types and formatting. Every purchase, effect, and number
// shown to the player funnels through here so the rules stay in one place.
// Spores are floats internally; display floors them so the counter ticks
// in whole spores.

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
