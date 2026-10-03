<script setup>
import { getTypeColor } from '@/utils/typeColors.js'

defineProps({
  type: { type: String, required: true },
  muted: { type: Boolean, default: false }, // gray version, e.g. "not covered"
})
</script>

<template>
  <span
    class="type-badge"
    :class="{ muted }"
    :style="muted ? null : { background: getTypeColor(type) }"
  >
    {{ type }}
  </span>
</template>

<style scoped>
.type-badge {
  display: inline-block;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  text-transform: capitalize;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
.type-badge.muted {
  background: #e0e0e0;
  color: #999;
  text-shadow: none;
}
</style>
