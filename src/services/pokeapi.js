const BASE_URL = 'https://pokeapi.co/api/v2'

// export async function getPokemonList(limit = 20, offset = 0) {
//   const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
//   if (!response.ok) {
//     throw new Error(`PokeAPI error: ${response.status}`)
//   }
//   const data = await response.json()

//   // The list only gives names, so fetch every Pokémon's details at the same time
//   return Promise.all(data.results.map((pokemon) => getPokemon(pokemon.name)))
// }

// Every Pokémon URL ends in its ID: '.../pokemon/25/' → 25
function idFromUrl(url) {
  return Number(url.split('/').filter(Boolean).pop())
}

// Every Pokémon's name + ID in ONE request (no images or types)
export async function getAllPokemonNames() {
  const response = await fetch(`${BASE_URL}/pokemon?limit=2000`)
  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status}`)
  }
  const data = await response.json()
  return data.results
    .map((pokemon) => ({ name: pokemon.name, id: idFromUrl(pokemon.url) }))
    .filter((pokemon) => pokemon.id < 10000) // IDs 10001+ are alternate forms (megas etc.)
}

// Names of every Pokémon with a given type, e.g. 'fire'
export async function getPokemonNamesByType(type) {
  const response = await fetch(`${BASE_URL}/type/${type}`)
  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status}`)
  }
  const data = await response.json()
  return data.pokemon.map((entry) => entry.pokemon.name)
}

export async function getPokemon(nameOrId) {
  const response = await fetch(`${BASE_URL}/pokemon/${String(nameOrId).toLowerCase()}`)
  if (response.status === 404) {
    throw new Error('not-found')
  }
  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status}`)
  }
  const data = await response.json()

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
