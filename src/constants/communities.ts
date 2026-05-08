import type { Community } from '@/types'

export const COMMUNITIES: Community[] = [
  { id: 'rare_bizarre', label: 'Rare & bizarre', color: '#F2CC60' },
  { id: 'everyday_beauty', label: 'Everyday beauty', color: '#52B788' },
  { id: 'hyperlocal', label: 'Hyperlocal', color: '#AFA9EC' },
  { id: 'before_its_gone', label: "Before it's gone", color: '#E07A5F' },
  { id: 'patterns', label: 'Patterns', color: '#85B7EB' },
  { id: 'human_traces', label: 'Human traces', color: '#ED93B1' },
  { id: 'overlooked_ordinary', label: 'Overlooked ordinary', color: '#97C459' },
]

export const COMMUNITY_COLORS = COMMUNITIES.map((community) => community.color)
