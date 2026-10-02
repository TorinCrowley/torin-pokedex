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
  <main class="team">
    <div class="header">
      <h1>My Team ({{ team.members.length }}/{{ MAX_TEAM_SIZE }})</h1>
      <button v-if="team.members.length" class="clear" @click="confirmClear">Clear Team</button>
    </div>

    <p v-if="team.members.length === 0" class="empty">
      Your team is empty. <RouterLink to="/">Browse the Pokédex</RouterLink> and add some Pokémon!
    </p>

    <div v-else class="grid">
      <div v-for="pokemon in team.members" :key="pokemon.id" class="slot">
        <PokemonCard :pokemon="pokemon" :show-team-badge="false" />
        <button class="remove" @click="team.removePokemon(pokemon.id)">Remove</button>
      </div>
    </div>
    <TypeCoverage v-if="team.members.length" :members="team.members" />
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.clear {
  background: #c0392b;
}
.clear:hover {
  background: #a93226;
}
</style>
