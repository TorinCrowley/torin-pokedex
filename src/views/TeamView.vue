<script setup>
import PokemonCard from '@/components/PokemonCard.vue'
import { useTeamStore, MAX_TEAM_SIZE } from '@/stores/team.js'

const team = useTeamStore()
</script>

<template>
  <main class="team">
    <h1>My Team ({{ team.members.length }}/{{ MAX_TEAM_SIZE }})</h1>

    <p v-if="team.members.length === 0" class="empty">
      Your team is empty. <RouterLink to="/">Browse the Pokédex</RouterLink> and add some Pokémon!
    </p>

    <div v-else class="grid">
      <div v-for="pokemon in team.members" :key="pokemon.id" class="slot">
        <PokemonCard :pokemon="pokemon" />
        <button class="remove" @click="team.removePokemon(pokemon.id)">Remove</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.team {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
.slot .remove {
  width: 100%;
  margin-top: 0.5rem;
  background: #c0392b;
}
.slot .remove:hover {
  background: #a93226;
}
.empty {
  color: #666;
}
</style>
