import { MEDICATION_TERMS } from './medicationVocabulary'
import { normalize } from './search'

// Levenshtein edit distance between two strings (number of single-character
// insertions, deletions or substitutions to turn a into b). Small strings only,
// so the simple O(a*b) DP is fine.
function editDistance(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  let curr = new Array<number>(b.length + 1)

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(
        prev[j] + 1,      // deletion
        curr[j - 1] + 1,  // insertion
        prev[j - 1] + cost // substitution
      )
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[b.length]
}

// Precomputed normalized (accent-free) form of every vocabulary term, paired with
// its display form. Built once at module load.
const NORMALIZED_TERMS: { display: string; norm: string }[] = MEDICATION_TERMS.map(
  (display) => ({ display, norm: normalize(display) })
)

/**
 * Returns the closest known medication name when the query looks like a misspelling
 * of it, or null when the query is already correct / too far from anything known.
 *
 * Used to power a "¿Quisiste decir X?" hint. Conservative on purpose: a wrong
 * suggestion is worse than none, so it only fires for close typos.
 */
export function suggestCorrection(query: string): string | null {
  const q = normalize(query).trim()
  if (q.length < 3) return null

  let best: { display: string; norm: string } | null = null
  let bestDist = Infinity

  for (const term of NORMALIZED_TERMS) {
    // Already an exact known term (or contains it as a whole word): no correction.
    if (term.norm === q) return null
    const d = editDistance(q, term.norm)
    if (d < bestDist) {
      bestDist = d
      best = term
      if (d === 1) break // can't get closer without being exact
    }
  }

  if (!best || bestDist === 0) return null

  // Accept only genuinely close matches; stricter for short words where one edit is
  // already a big change. Also cap by ratio so long words don't over-trigger.
  const len = Math.max(q.length, best.norm.length)
  const maxDist = len <= 4 ? 1 : len <= 7 ? 2 : 3
  if (bestDist <= maxDist && bestDist / len <= 0.34) return best.display

  return null
}

// Capitalizes the first letter for display ("acetaminofén" -> "Acetaminofén",
// "dolex" -> "Dolex"). Leaves the rest untouched.
export function capitalizeFirst(s: string): string {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
