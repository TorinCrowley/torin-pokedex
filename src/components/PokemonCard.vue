<script setup>
import TypeBadge from '@/components/TypeBadge.vue'
import { useTeamStore } from '@/stores/team.js'
import { computed } from 'vue'

const props = defineProps({
  pokemon: { type: Object, required: true },
  showTeamBadge: { type: Boolean, default: true },
})

const team = useTeamStore()
const showBadge = computed(() => props.showTeamBadge && team.isOnTeam(props.pokemon.id))
</script>

<template>
  <RouterLink
    :to="{ name: 'pokemon-detail', params: { name: pokemon.name } }"
    class="card"
    :class="{ 'on-team': showBadge }"
  >
    <span v-if="showBadge" class="team-badge" title="On your team">★</span>
    <img :src="pokemon.image" :alt="pokemon.name" loading="lazy" />
    <p class="number">#{{ String(pokemon.id).padStart(3, '0') }}</p>
    <h3 class="name">{{ pokemon.name }}</h3>
    <div class="types">
      <TypeBadge v-for="type in pokemon.types" :key="type" :type="type" />
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s;
  display: block;
  text-decoration: none;
  color: inherit;
  position: relative;
}
.card.on-team {
  box-shadow:
    0 0 0 3px #f1c40f,
    0 2px 6px rgba(0, 0, 0, 0.1);
}
.team-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.6rem;
  color: #f1c40f;
  font-size: 1.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.card:hover {
  transform: translateY(-4px);
}
.card img {
  width: 100%;
  max-width: 120px;
  aspect-ratio: 1;
}
.number {
  color: #888;
  font-size: 0.85rem;
  margin: 0.25rem 0 0;
}
.name {
  text-transform: capitalize;
  margin: 0.25rem 0 0;
}
.types {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 0.5rem;
}
</style>
