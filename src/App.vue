<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useTeamStore } from '@/stores/team.js'

const team = useTeamStore()
</script>

<template>
  <header class="navbar">
    <RouterLink to="/" class="brand">Torin's Pokédex</RouterLink>
    <nav>
      <RouterLink to="/">Pokédex</RouterLink>
      <RouterLink to="/team">My Team ({{ team.members.length }})</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f2f4f8;
  color: #222;
}
button {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
button:hover:not(:disabled) {
  background: #2980b9;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.navbar a {
  color: #444;
  text-decoration: none;
  font-weight: 600;
}
.navbar nav {
  display: flex;
  gap: 1.25rem;
}
.navbar nav a.router-link-exact-active {
  color: #3498db;
}
</style>
