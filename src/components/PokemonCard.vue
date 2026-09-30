<script setup>
import { getTypeColor } from '@/utils/typeColors.js'
defineProps({
  pokemon: { type: Object, required: true },
})
</script>

<template>
  <RouterLink :to="{ name: 'pokemon-detail', params: { name: pokemon.name } }" class="card">
    <img :src="pokemon.image" :alt="pokemon.name" loading="lazy" />
    <p class="number">#{{ String(pokemon.id).padStart(3, '0') }}</p>
    <h3 class="name">{{ pokemon.name }}</h3>
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
.type {
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  text-transform: capitalize;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
</style>
