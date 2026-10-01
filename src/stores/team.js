import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'pokedex-team'
export const MAX_TEAM_SIZE = 6

// Read the saved team from the browser, or start empty
function loadSavedTeam() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : [] // anything that isn't a list → start empty
  } catch {
    return [] // saved data was corrupted or storage is blocked, so start fresh
  }
}

export const useTeamStore = defineStore('team', () => {
  // State
  const members = ref(loadSavedTeam())

  // Getters
  const isFull = computed(() => members.value.length >= MAX_TEAM_SIZE)

  function isOnTeam(id) {
    return members.value.some((member) => member.id === id)
  }

  // Actions
  function addPokemon(pokemon) {
    if (isFull.value || isOnTeam(pokemon.id)) return
    // Only store what the team page needs, not the whole detail object
    members.value.push({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.types,
    })
  }

  function removePokemon(id) {
    members.value = members.value.filter((member) => member.id !== id)
  }

  function clearTeam() {
    members.value = []
  }

  // Save to the browser whenever the team changes
  watch(
    members,
    (newMembers) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMembers))
    },
    { deep: true },
  )

  return { members, isFull, isOnTeam, addPokemon, removePokemon, clearTeam }
})
