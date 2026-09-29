<script setup>
defineProps({
  pokemon: { type: Object, required: true },
})
</script>

<template>
  <div class="card">
    <img :src="pokemon.image" :alt="pokemon.name" loading="lazy" />
    <p class="number">#{{ String(pokemon.id).padStart(3, '0') }}</p>
    <h3 class="name">{{ pokemon.name }}</h3>
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s;
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
</style>
