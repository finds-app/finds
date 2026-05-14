import type { Collection } from '@/types'

export const COLLECTIONS: Collection[] = [
  {
    id: 'rare_bizarre',
    label: 'Rare & bizarre',
    color: '#F2CC60',
    description: 'Genuinely weird, genuinely rare — things most people never see.',
  },
  {
    id: 'everyday_beauty',
    label: 'Everyday beauty',
    color: '#52B788',
    description: 'A satisfying shadow, a perfect reflection — not rare, just noticed.',
  },
  {
    id: 'hyperlocal',
    label: 'Hyperlocal',
    color: '#AFA9EC',
    description: 'What makes a place itself — the corner sign, the landmark tree.',
  },
  {
    id: 'before_its_gone',
    label: "Before it's gone",
    color: '#E07A5F',
    description: 'Closing shops, old signs, things being demolished — documentation as care.',
  },
  {
    id: 'patterns',
    label: 'Patterns',
    color: '#85B7EB',
    description: 'Same tile in two cities — the pleasure of noticing connections across distance.',
  },
  {
    id: 'human_traces',
    label: 'Human traces',
    color: '#ED93B1',
    description: 'Worn paths, notes on lampposts — left behind, unseen.',
  },
  {
    id: 'overlooked_ordinary',
    label: 'Overlooked ordinary',
    color: '#97C459',
    description: 'Not weird — just unnoticed. Attention is the point.',
  },
]

export const COLLECTION_COLORS = COLLECTIONS.map((collection) => collection.color)

export const getCollectionColor = (id: string | null): string =>
  COLLECTIONS.find((c) => c.id === id)?.color ?? '#52B788'

export const getCollectionLabel = (id: string | null): string | null =>
  COLLECTIONS.find((c) => c.id === id)?.label ?? null
