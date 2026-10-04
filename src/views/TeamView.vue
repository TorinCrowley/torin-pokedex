<script setup>
import PokemonCard from '@/components/PokemonCard.vue'
import { useTeamStore, MAX_TEAM_SIZE } from '@/stores/team.js'
import TypeCoverage from '@/components/TypeCoverage.vue'

const team = useTeamStore()

function confirmClear() {
  if (confirm('Remove all Pokémon from your team?')) {
    team.clearTeam()
  }
}
</script>

<template>
  <main class="page">
    <div class="header">
      <h1>My Team ({{ team.members.length }}/{{ MAX_TEAM_SIZE }})</h1>
      <button v-if="team.members.length" class="danger" @click="confirmClear">Clear Team</button>
    </div>

    <p v-if="team.members.length === 0" class="empty">
      Your team is empty. <RouterLink to="/">Browse the Pokédex</RouterLink> and add some Pokémon!
    </p>

    <div v-else class="pokemon-grid">
      <div v-for="pokemon in team.members" :key="pokemon.id" class="slot">
        <PokemonCard :pokemon="pokemon" :show-team-badge="false" />
        <button class="danger remove" @click="team.removePokemon(pokemon.id)">Remove</button>
      </div>
    </div>
    <TypeCoverage v-if="team.members.length" :members="team.members" />
  </main>
</template>

<style scoped>
.slot .remove {
  width: 100%;
  margin-top: 0.5rem;
}
.empty {
  color: #666;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
