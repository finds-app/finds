import type { Community } from '@/types'

export const COMMUNITIES: Community[] = [
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

export const COMMUNITY_COLORS = COMMUNITIES.map((community) => community.color)

export const getCommunityColor = (id: string | null): string =>
  COMMUNITIES.find((c) => c.id === id)?.color ?? '#52B788'

export const getCommunityLabel = (id: string | null): string | null =>
  COMMUNITIES.find((c) => c.id === id)?.label ?? null
