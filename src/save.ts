// Persistence: the patch survives reloads. Saves are validated on load so a
// corrupted or stale entry can never break the boot sequence.

import { PURCHASABLES } from "./content.ts";
import { type GameState, initialState } from "./state.ts";

const SAVE_KEY = "mycelia-save-v1";

const isFiniteNumber = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n) && n >= 0;

/** Round-trip state through localStorage. False when nothing was stored. */
export function load(): GameState | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(SAVE_KEY);
  } catch {
    return null; // Storage can be blocked (private mode); play fresh instead.
  }
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const data = parsed as Record<string, unknown>;
    if (!isFiniteNumber(data.spores)) return null;
    if (!isFiniteNumber(data.totalSpores)) return null;
    if (!isFiniteNumber(data.totalClicks)) return null;
    if (typeof data.owned !== "object" || data.owned === null) return null;
    const owned: Record<string, number> = {};
    for (const [id, count] of Object.entries(data.owned)) {
      // Unknown ids are dropped; they belong to a newer version of the game.
      if (!PURCHASABLES.some((item) => item.id === id)) continue;
      if (!isFiniteNumber(count)) continue;
      owned[id] = Math.floor(count);
    }
    return {
      ...initialState(),
      spores: data.spores,
      totalSpores: data.totalSpores,
      totalClicks: data.totalClicks,
      owned,
    };
  } catch {
    return null;
  }
}

export function save(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Unwritable storage is not fatal; the game simply stops persisting.
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}
