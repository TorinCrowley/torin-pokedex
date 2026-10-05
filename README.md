# Torin's Pokédex

A very basic Pokémon Pokédex and team builder built with Vue 3, using data from [PokeAPI](https://pokeapi.co).

**Live site:** https://torin-pokedex.netlify.app

## Features

- **Browse & search** every Pokémon by name or number, and filter by type
- **Detail pages** with artwork, types, abilities, and base stats
- **Team builder** — save up to 6 Pokémon (kept between visits with localStorage)
- **Type coverage analysis** — see which types your team hits super-effectively,
  and which attacking types your team is weak to

## Tech stack

- [Vue 3](https://vuejs.org) (Composition API, `<script setup>`)
- [Vue Router](https://router.vuejs.org) for page navigation
- [Pinia](https://pinia.vuejs.org) for the team store
- [Vite](https://vite.dev) for development and builds
- Deployed on [Netlify](https://torin-pokedex.netlify.app)

## How it works

- **Search without loading everything:** the app loads the full list of names once
  (one small request), filters it in the browser, and only fetches details for the
  Pokémon currently on screen. Details are cached so nothing is fetched twice.
- **Type coverage:** type matchups come from PokeAPI's `damage_relations`. Dual types
  are handled by multiplying effectiveness (e.g. Rock vs. Fire/Flying = 2 × 2 = 4×).
  The math lives in plain functions in `src/utils/typeCoverage.js`, separate from the UI.

## Running locally

Requires Node.js 22.18 or newer.

```sh
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Project structure

```
src/
├── components/   Reusable pieces (PokemonCard, TypeBadge, SpriteList, TypeCoverage)
├── views/        One file per page (Home, Detail, Team, NotFound)
├── services/     All PokeAPI requests
├── stores/       Pinia team store
├── utils/        Type colors and coverage math
└── router/       Routes
```

## Possible improvements

- Debounce the search box to reduce requests while typing
- Account for each Pokémon's actual moves in type coverage, not just its own types
- Tests for the type coverage math
