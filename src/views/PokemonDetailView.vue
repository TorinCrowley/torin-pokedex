<script setup>
import { ref, watch } from 'vue'
import { getPokemon } from '@/services/pokeapi.js'
import TypeBadge from '@/components/TypeBadge.vue'
import { useTeamStore, MAX_TEAM_SIZE } from '@/stores/team.js'

const props = defineProps({
  name: { type: String, required: true },
})

const team = useTeamStore()
const pokemon = ref(null)
const isLoading = ref(false)
const error = ref(null)
const MAX_STAT = 255 // highest possible base stat, used to size the bars
const LAST_POKEMON_ID = 1025 // assuming there are currently up to 1025 Pokémon in the database

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
  <main class="page">
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
          <RouterLink
            v-if="pokemon.id > 1"
            :to="{ name: 'pokemon-detail', params: { name: pokemon.id - 1 } }"
            class="nav-btn"
          >
            ← Previous
          </RouterLink>
          <RouterLink
            v-if="pokemon.id < LAST_POKEMON_ID"
            :to="{ name: 'pokemon-detail', params: { name: pokemon.id + 1 } }"
            class="nav-btn next"
          >
            Next →
          </RouterLink>
        </div>
        <p class="number">#{{ String(pokemon.id).padStart(3, '0') }}</p>

        <h1 class="name">{{ pokemon.name }}</h1>

        <div class="types">
          <TypeBadge v-for="type in pokemon.types" :key="type" :type="type" />
        </div>

        <div class="team-actions">
          <button
            v-if="team.isOnTeam(pokemon.id)"
            class="danger"
            @click="team.removePokemon(pokemon.id)"
          >
            Remove from Team
          </button>
          <button v-else :disabled="team.isFull" @click="team.addPokemon(pokemon)">
            Add to Team
          </button>
          <p v-if="team.isFull && !team.isOnTeam(pokemon.id)" class="hint">
            Your team is full ({{ MAX_TEAM_SIZE }}/{{ MAX_TEAM_SIZE }}). Remove someone first.
          </p>
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
.nav-btn {
  background: #3498db;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
}
.nav-btn:hover {
  background: #2980b9;
}
.prev-next {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}
.next {
  margin-left: auto;
}
.team-actions {
  margin: 1rem 0;
}
.remove {
  background: #c0392b;
}
.remove:hover {
  background: #a93226;
}
.hint {
  color: #888;
  font-size: 0.85rem;
}
</style>
