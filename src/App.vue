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
