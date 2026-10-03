const BASE_URL = 'https://pokeapi.co/api/v2'
const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

async function fetchJson(path) {
  const response = await fetch(`${BASE_URL}${path}`)
  if (response.status === 404) throw new Error('not-found')
  if (!response.ok) throw new Error(`PokeAPI error: ${response.status}`)
  return response.json()
}

// Every Pokémon URL ends in its ID: '.../pokemon/25/' → 25
function idFromUrl(url) {
  return Number(url.split('/').filter(Boolean).pop())
}

// Small pixel-art sprite for a Pokémon, e.g. 25 → Pikachu's sprite
export function getSpriteUrl(id) {
  return `${SPRITE_URL}/${id}.png`
}

// Every Pokémon's name + ID in ONE request (no images or types)
export async function getAllPokemonNames() {
  const data = await fetchJson(`/pokemon?limit=2000`)
  return data.results
    .map((pokemon) => ({ name: pokemon.name, id: idFromUrl(pokemon.url) }))
    .filter((pokemon) => pokemon.id < 10000) // IDs 10001+ are alternate forms (megas etc.)
}

// Names of every Pokémon with a given type, e.g. 'fire'
export async function getPokemonNamesByType(type) {
  const data = await fetchJson(`/type/${type}`)
  return data.pokemon.map((entry) => entry.pokemon.name)
}

export async function getPokemon(nameOrId) {
  const data = await fetchJson(`/pokemon/${String(nameOrId).toLowerCase()}`)

  // The raw response is huge, so keep only what the page needs
  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other['official-artwork'].front_default,
    height: data.height / 10, // API gives decimetres → metres
    weight: data.weight / 10, // API gives hectograms → kg
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => ({ name: a.ability.name, hidden: a.is_hidden })),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  }
}

// How a type interacts with other types, e.g. fire is weak to water
export async function getTypeRelations(type) {
  const data = await fetchJson(`/type/${type}`)
  const relations = data.damage_relations
  const names = (list) => list.map((t) => t.name) // [{ name, url }] → ['name']

  return {
    doubleFrom: names(relations.double_damage_from), // attacks that hit this type for 2×
    halfFrom: names(relations.half_damage_from), // attacks that hit this type for ½×
    noFrom: names(relations.no_damage_from), // attacks this type is immune to
    doubleTo: names(relations.double_damage_to), // types this type hits for 2×
  }
}
