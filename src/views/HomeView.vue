<script setup>
import { ref, onMounted } from 'vue'
import PokemonCard from '@/components/PokemonCard.vue'
import { getPokemonList } from '@/services/pokeapi.js'

const pokemonList = ref([])
const isLoading = ref(false)
const error = ref(null)

async function loadPokemon() {
  isLoading.value = true
  error.value = null
  try {
    // offset = how many we already have, so calling this again loads the NEXT 20
    const newPokemon = await getPokemonList(20, pokemonList.value.length)
    pokemonList.value.push(...newPokemon)
  } catch (err) {
    error.value = 'Could not load Pokémon. Please try again.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPokemon)
</script>

<template>
  <main class="home">
    <h1>Pokédex</h1>
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadPokemon">Try Again</button>
    </div>
    <div class="grid">
      <PokemonCard v-for="pokemon in pokemonList" :key="pokemon.id" :pokemon="pokemon" />
    </div>

    <button @click="loadPokemon" :disabled="isLoading">
      {{ isLoading ? 'Loading...' : 'Load More' }}
    </button>

    <p v-if="isLoading">Loading...</p>
  </main>
</template>

<style scoped>
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
.error {
  color: #c0392b;
}
button {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #2980b9;
}
</style>
