const BASE_URL = 'https://pokeapi.co/api/v2'
const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status}`)
  }
  const data = await response.json()

  // Each result looks like { name: 'pikachu', url: '.../pokemon/25/' }
  return data.results.map((pokemon) => {
    const id = pokemon.url.split('/').filter(Boolean).pop() // grabs the "25"
    return {
      id: Number(id),
      name: pokemon.name,
      image: `${ARTWORK_URL}/${id}.png`,
    }
  })
}
