<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
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
</style>
