// Central game state. All mutable numbers live in one plain object so the
// animation-frame loop, clicks, and saves all read the same source of truth.

export interface GameState {
  /** Spores in the basket right now. Float internally, whole when shown. */
  spores: number;
  /** Lifetime spores harvested, clicks and passive growth combined. */
  totalSpores: number;
  /** Lifetime taps of the big mushroom. */
  totalClicks: number;
  /** Owned count per purchasable id, e.g. { "button-mushroom": 3 }. */
  owned: Record<string, number>;
}

export const initialState = (): GameState => ({
  spores: 0,
  totalSpores: 0,
  totalClicks: 0,
  owned: {},
});
