<script setup>
import { computed } from 'vue'
import { getSpriteUrl } from '@/services/pokeapi.js'

const props = defineProps({
  members: { type: Array, required: true },
  fadedMembers: { type: Array, default: () => [] }, // shown faded, e.g. immune
})

// One combined list, so the <img> markup only has to be written once
const sprites = computed(() => [
  ...props.members.map((member) => ({ member, faded: false })),
  ...props.fadedMembers.map((member) => ({ member, faded: true })),
])
</script>

<template>
  <div class="sprites">
    <img
      v-for="{ member, faded } in sprites"
      :key="member.id"
      :src="getSpriteUrl(member.id)"
      :alt="member.name"
      :title="faded ? `${member.name} (immune)` : member.name"
      class="sprite"
      :class="{ faded }"
      @error="$event.target.src = member.image"
    />
    <span v-if="sprites.length === 0" class="none">–</span>
  </div>
</template>

<style scoped>
.sprites {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 48px;
}
.sprite {
  width: 48px;
  height: 48px;
}
.sprite.faded {
  opacity: 0.45;
  filter: grayscale(1);
}
.none {
  color: #bbb;
}
</style>
