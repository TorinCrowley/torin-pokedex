<script setup>
import { ref, computed, watch } from 'vue'
import { getTypeRelations } from '@/services/pokeapi.js'
import TypeBadge from '@/components/TypeBadge.vue'
import { getDefensiveSummary, getOffensiveCoverage } from '@/utils/typeCoverage.js'
import SpriteList from '@/components/SpriteList.vue'

const props = defineProps({
  members: { type: Array, required: true },
})

const relations = ref({}) // type name → its damage relations, filled in as needed
const isLoading = ref(false)
const error = ref(null)

// Every distinct type on the team, e.g. ['fire', 'flying', 'electric']
const teamTypes = computed(() => [...new Set(props.members.flatMap((member) => member.types))])

async function loadRelations() {
  const missing = teamTypes.value.filter((type) => !relations.value[type])
  if (missing.length === 0) return

  isLoading.value = true
  error.value = null
  try {
    const results = await Promise.all(missing.map((type) => getTypeRelations(type)))
    missing.forEach((type, i) => {
      relations.value[type] = results[i]
    })
  } catch (err) {
    error.value = 'Could not load type data. Please try again.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

watch(teamTypes, loadRelations, { immediate: true })

// Only calculate once we have data for every type on the team
const isReady = computed(() => teamTypes.value.every((type) => relations.value[type]))

const offense = computed(() =>
  isReady.value ? getOffensiveCoverage(props.members, relations.value) : [],
)
const coveredCount = computed(() => offense.value.filter((item) => item.covered).length)

const defense = computed(() =>
  isReady.value ? getDefensiveSummary(props.members, relations.value) : [],
)
const threats = computed(() => defense.value.filter((row) => row.isThreat))
</script>

<template>
  <section class="coverage">
    <h2>Type Coverage</h2>

    <p v-if="isLoading">Calculating...</p>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadRelations">Try Again</button>
    </div>

    <template v-else-if="isReady">
      <h3>Offense <span class="sub">types your team hits super-effectively</span></h3>
      <p class="summary">{{ coveredCount }} / {{ offense.length }} types covered</p>
      <div class="badges">
        <TypeBadge
          v-for="item in offense"
          :key="item.type"
          :type="item.type"
          :muted="!item.covered"
        />
      </div>

      <h3>
        Defense <span class="sub">team members weak or resistant to each attacking type</span>
      </h3>
      <p v-if="threats.length" class="warning">
        ⚠ Watch out for: {{ threats.map((row) => row.type).join(', ') }}
      </p>
      <div class="table-scroll">
        <table class="defense">
          <thead>
            <tr>
              <th>Attacking type</th>
              <th>Weak</th>
              <th>Resist / immune</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in defense" :key="row.type">
              <td>
                <TypeBadge :type="row.type" />
              </td>
              <td :class="{ empty: !row.weak.length, threat: row.isThreat }">
                <SpriteList :members="row.weak" />
              </td>
              <td :class="{ empty: !row.resist.length && !row.immune.length }">
                <SpriteList :members="row.resist" :faded-members="row.immune" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="note">
        Faded sprites are immune to the corresponding attacking type. Assumes each Pokémon uses
        moves of its own types.
      </p>
    </template>
  </section>
</template>

<style scoped>
.coverage {
  margin-top: 2.5rem;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
h2 {
  margin-top: 0;
}
h3 {
  margin: 1.5rem 0 0.25rem;
  font-size: 1rem;
}
.sub {
  font-weight: normal;
  color: #888;
  font-size: 0.85rem;
  margin-left: 0.25rem;
}
.summary {
  color: #666;
  margin: 0.25rem 0 0.75rem;
}
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.warning {
  color: var(--color-danger);
  font-weight: 600;
  text-transform: capitalize;
}
.table-scroll {
  overflow-x: auto;
}
.defense {
  border-collapse: collapse;
  width: 100%;
}
.defense th,
.defense td {
  padding: 0.25rem 0.75rem;
  text-align: center;
  vertical-align: middle;
}
.defense td.empty {
  background: rgba(0, 0, 0, 0.04);
}
.defense th {
  color: #888;
  font-size: 0.85rem;
}
.defense th:not(:first-child),
.defense td:not(:first-child) {
  border-left: 1px solid #e0e0e0;
}
.defense thead th {
  border-bottom: 2px solid #ddd;
}
.defense tbody tr {
  border-bottom: 1px solid #eee;
}
.defense tbody tr:last-child {
  border-bottom: none;
}
.defense td:first-child {
  width: 1%;
  white-space: nowrap;
}
.defense td.threat {
  background: #fadbd8;
}
.note {
  color: #999;
  font-size: 0.8rem;
  margin-top: 1rem;
}
</style>
