# Mycelia

A mushroom-garden clicker. Tap the big mushroom to harvest spores, then let
your patch do the work: everything in the Forager's Stand keeps growing after
you buy it, and multipliers stack on top of the whole garden.

Built for CMPM 121 (D1) with TypeScript and Vite. Every sprite is hand-drawn
inline SVG — the game fetches nothing from the network at runtime.

## Play

The dev server and production build both run through Deno:

    deno task dev      # dev server on http://localhost:3000
    deno task build    # production build in dist/
    deno task preview  # serve the production build

Progress saves to your browser's local storage every few seconds (and whenever
the tab sleeps or closes); "start over" in the footer wipes it.

## Credits

Tooling adapted from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. The D1 scaffold and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies retain their respective licenses.
