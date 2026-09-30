<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import PokemonCard from '@/components/PokemonCard.vue'
import { getAllPokemonNames, getPokemon, getPokemonNamesByType } from '@/services/pokeapi.js'
import { POKEMON_TYPES } from '@/utils/typeColors.js'

const PAGE_SIZE = 20

const allPokemon = ref([]) // [{ name, id }] for every Pokémon, loaded once
const detailsCache = reactive(new Map()) // name → full details, filled in as needed
const searchQuery = ref('')
const selectedType = ref('')
const namesOfSelectedType = ref(null) // a Set of names, or null = no type filter
const displayCount = ref(PAGE_SIZE)
const isLoading = ref(false)
const error = ref(null)

// --- The three filtering steps ---
const matches = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return allPokemon.value.filter((pokemon) => {
    const matchesSearch = pokemon.name.includes(query) || String(pokemon.id) === query
    const matchesType = !namesOfSelectedType.value || namesOfSelectedType.value.has(pokemon.name)
    return matchesSearch && matchesType
  })
})

const visibleMatches = computed(() => matches.value.slice(0, displayCount.value))

const visiblePokemon = computed(() =>
  visibleMatches.value.map((pokemon) => detailsCache.get(pokemon.name)).filter(Boolean),
)

// --- Loading data ---
async function loadIndex() {
  isLoading.value = true
  error.value = null
  try {
    allPokemon.value = await getAllPokemonNames()
  } catch (err) {
    error.value = 'Could not load the Pokédex. Please try again.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function loadVisibleDetails() {
  const missing = visibleMatches.value.filter((pokemon) => !detailsCache.has(pokemon.name))
  if (missing.length === 0) return // everything on screen is already cached

  isLoading.value = true
  error.value = null
  try {
    const details = await Promise.all(missing.map((pokemon) => getPokemon(pokemon.name)))
    details.forEach((pokemon) => detailsCache.set(pokemon.name, pokemon))
  } catch (err) {
    error.value = 'Could not load Pokémon. Please try again.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function loadTypeFilter(type) {
  if (!type) {
    namesOfSelectedType.value = null
    return
  }
  namesOfSelectedType.value = new Set() // show nothing while the type list loads
  try {
    namesOfSelectedType.value = new Set(await getPokemonNamesByType(type))
  } catch (err) {
    error.value = 'Could not load that type. Please try again.'
    console.error(err)
  }
}

async function retry() {
  if (allPokemon.value.length === 0) await loadIndex()
  if (selectedType.value) await loadTypeFilter(selectedType.value)
  await loadVisibleDetails()
}

function loadMore() {
  displayCount.value += PAGE_SIZE
}

// --- Reacting to changes ---
watch(visibleMatches, loadVisibleDetails) // whenever what's on screen changes, fetch any missing details

watch(searchQuery, () => {
  displayCount.value = PAGE_SIZE // new search → start back at the first 20
})

watch(selectedType, (type) => {
  displayCount.value = PAGE_SIZE
  loadTypeFilter(type)
})

onMounted(loadIndex)
</script>

<template>
  <main class="home">
    <h1>Pokédex</h1>

    <div class="filters">
      <button
        :disabled="!searchQuery && !selectedType"
        @click="((searchQuery = ''), (selectedType = ''))"
      >
        Clear Filters
      </button>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search for a Pokémon by it's name or number..."
      />
      <select v-model="selectedType">
        <option value="">All types</option>
        <option v-for="type in POKEMON_TYPES" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <p v-if="allPokemon.length" class="result-count">{{ matches.length }} Pokémon found</p>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="retry">Try Again</button>
    </div>

    <div class="grid">
      <PokemonCard v-for="pokemon in visiblePokemon" :key="pokemon.id" :pokemon="pokemon" />
    </div>

    <p v-if="isLoading" class="status">Loading...</p>
    <p v-else-if="!error && allPokemon.length && matches.length === 0" class="status">
      No Pokémon match your search.
    </p>

    <button
      v-if="!error && visibleMatches.length < matches.length"
      class="load-more"
      :disabled="isLoading"
      @click="loadMore"
    >
      Load More
    </button>
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
.load-more {
  margin: 1.5rem auto 0;
  display: block;
}
.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.filters input {
  flex: 1;
}
.filters input,
.filters select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.result-count,
.status {
  color: #666;
}
</style>
