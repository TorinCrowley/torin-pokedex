import { POKEMON_TYPES } from '@/utils/typeColors.js'

// How much damage one attacking type does to a Pokémon with the given types
// e.g. ('rock', ['fire', 'flying']) → 4
export function damageMultiplier(attackType, defenderTypes, relations) {
  return defenderTypes.reduce((multiplier, defenderType) => {
    const rel = relations[defenderType]
    if (rel.noFrom.includes(attackType)) return multiplier * 0
    if (rel.doubleFrom.includes(attackType)) return multiplier * 2
    if (rel.halfFrom.includes(attackType)) return multiplier * 0.5
    return multiplier
  }, 1)
}

// For each attacking type: which team members are weak to it, resist it, or are immune
export function getDefensiveSummary(members, relations) {
  return POKEMON_TYPES.map((attackType) => {
    const weak = []
    const resist = []
    const immune = []
    for (const member of members) {
      const multiplier = damageMultiplier(attackType, member.types, relations)
      if (multiplier === 0) immune.push(member)
      else if (multiplier > 1) weak.push(member)
      else if (multiplier < 1) resist.push(member)
    }
    const isThreat = weak.length >= 2 && weak.length >= resist.length + immune.length
    return { type: attackType, weak, resist, immune, isThreat }
  })
}

// For each type: can at least one team member hit it super-effectively?
export function getOffensiveCoverage(members, relations) {
  const covered = new Set()
  for (const member of members) {
    for (const type of member.types) {
      relations[type].doubleTo.forEach((target) => covered.add(target))
    }
  }
  return POKEMON_TYPES.map((type) => ({ type, covered: covered.has(type) }))
}
