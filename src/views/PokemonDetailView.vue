<script setup>
import { ref, watch } from 'vue'
import { getPokemon } from '@/services/pokeapi.js'
import { getTypeColor } from '@/utils/typeColors.js'

const props = defineProps({
  name: { type: String, required: true },
})

const pokemon = ref(null)
const isLoading = ref(false)
const error = ref(null)
const MAX_STAT = 255 // highest possible base stat, used to size the bars

async function loadPokemon() {
  isLoading.value = true
  error.value = null
  pokemon.value = null
  try {
    pokemon.value = await getPokemon(props.name)
  } catch (err) {
    error.value =
      err.message === 'not-found'
        ? `No Pokémon called "${props.name}" was found.`
        : 'Could not load this Pokémon. Please try again.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Runs once right away, then again any time the :name in the URL changes
watch(() => props.name, loadPokemon, { immediate: true })
</script>

<template>
  <main class="detail">
    <RouterLink to="/" class="back">← Back to Pokédex</RouterLink>

    <p v-if="isLoading">Loading...</p>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadPokemon">Try Again</button>
    </div>

    <article v-else-if="pokemon" class="pokemon">
      <img :src="pokemon.image" :alt="pokemon.name" />
      <div class="info">
        <div class="prev-next">
          <RouterLink v-if="pokemon.id > 1" :to="'/pokemon/' + (pokemon.id - 1)">
            <button>↑ Previous</button>
          </RouterLink>
          <RouterLink v-if="pokemon.id < 1025" :to="'/pokemon/' + (pokemon.id + 1)">
            <button>↓ Next</button>
          </RouterLink>
        </div>
        <p class="number">#{{ String(pokemon.id).padStart(3, '0') }}</p>

        <h1 class="name">{{ pokemon.name }}</h1>

        <div class="types">
          <span
            v-for="type in pokemon.types"
            :key="type"
            class="type"
            :style="{ backgroundColor: getTypeColor(type) }"
          >
            {{ type }}
          </span>
        </div>

        <p>Height: {{ pokemon.height }} m · Weight: {{ pokemon.weight }} kg</p>

        <h2>Abilities</h2>
        <ul>
          <li v-for="ability in pokemon.abilities" :key="ability.name">
            {{ ability.name }} <em v-if="ability.hidden">(hidden)</em>
          </li>
        </ul>

        <h2>Base Stats</h2>
        <div v-for="stat in pokemon.stats" :key="stat.name" class="stat">
          <span class="stat-name">{{ stat.name }}</span>
          <span class="stat-value">{{ stat.value }}</span>
          <div class="bar">
            <div class="bar-fill" :style="{ width: (stat.value / MAX_STAT) * 100 + '%' }"></div>
          </div>
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>
.detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.back {
  color: #3498db;
  text-decoration: none;
}
.pokemon {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 2rem;
  align-items: start;
  margin-top: 1.5rem;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.pokemon img {
  width: 100%;
  max-width: 320px;
}
.number {
  color: #888;
  margin: 0;
}
.name,
.type,
li,
.stat-name {
  text-transform: capitalize;
}
.name {
  margin: 0.25rem 0 0.5rem;
}
.types {
  display: flex;
  gap: 0.5rem;
}
.type {
  background: #777;
  color: #fff;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  font-weight: 600;
}
h2 {
  font-size: 1.1rem;
  margin-top: 1.5rem;
}
.stat {
  display: grid;
  grid-template-columns: 130px 40px 1fr;
  align-items: center;
  gap: 0.5rem;
  margin: 0.35rem 0;
}
.stat-value {
  text-align: right;
  font-weight: 600;
}
.bar {
  background: #e5e7eb;
  border-radius: 999px;
  height: 8px;
  overflow: hidden;
}
.bar-fill {
  background: #3498db;
  height: 100%;
}
.error {
  color: #c0392b;
}
@media (max-width: 640px) {
  .pokemon {
    grid-template-columns: 1fr;
  }
}
.prev-next {
  display: flex inline;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
