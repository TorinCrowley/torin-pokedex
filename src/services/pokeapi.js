const BASE_URL = 'https://pokeapi.co/api/v2'
const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

// export async function getPokemonList(limit = 20, offset = 0) {
//   const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
//   if (!response.ok) {
//     throw new Error(`PokeAPI error: ${response.status}`)
//   }
//   const data = await response.json()

//   // Each result looks like { name: 'pikachu', url: '.../pokemon/25/' }
//   return data.results.map((pokemon) => {
//     const id = pokemon.url.split('/').filter(Boolean).pop() // grabs the "25"
//     return {
//       id: Number(id),
//       name: pokemon.name,
//       image: `${ARTWORK_URL}/${id}.png`,
//     }
//   })
// }

export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status}`)
  }
  const data = await response.json()

  // The list only gives names, so fetch every Pokémon's details at the same time
  return Promise.all(data.results.map((pokemon) => getPokemon(pokemon.name)))
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
