import type { AchievementTemplateId, CollectionId } from '@/types'

export type AchievementCategory = 'general' | 'engagement' | 'collection'

export interface AchievementTemplate {
  id: AchievementTemplateId
  label: string
  description: string
  icon: string
  /** Target for progress bar (1 = binary) */
  goal: number
  category: AchievementCategory
  /** Optional collection lens for per-collection trophies */
  collectionId?: CollectionId
}

export const ACHIEVEMENT_TEMPLATES: AchievementTemplate[] = [
  // General — sorted rarest last
  {
    id: 'first_find',
    label: 'First notice',
    description: 'Post your first find',
    icon: '✦',
    goal: 1,
    category: 'general',
  },
  {
    id: 'globe_trotter',
    label: 'Globe trotter',
    description: 'Post finds in 3 different countries',
    icon: '🌍',
    goal: 3,
    category: 'general',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    description: 'Post 5 finds',
    icon: '🧭',
    goal: 5,
    category: 'general',
  },
  {
    id: 'city_explorer',
    label: 'City explorer',
    description: 'Post finds in 5 different cities',
    icon: '🏙️',
    goal: 5,
    category: 'general',
  },
  {
    id: 'world_traveler',
    label: 'World traveler',
    description: 'Post finds in 7 different countries',
    icon: '🌐',
    goal: 7,
    category: 'general',
  },
  {
    id: 'renaissance',
    label: 'Renaissance',
    description: 'Post in all 7 collections',
    icon: '🎨',
    goal: 7,
    category: 'general',
  },
  {
    id: 'dedicated',
    label: 'Dedicated',
    description: 'Post 25 finds',
    icon: '📍',
    goal: 25,
    category: 'general',
  },
  // Engagement — sorted rarest last
  {
    id: 'first_follower',
    label: 'Seen',
    description: 'Get your first follower',
    icon: '👀',
    goal: 1,
    category: 'engagement',
  },
  {
    id: 'curator',
    label: 'Curator',
    description: 'Get 10 hearts on a single find',
    icon: '💛',
    goal: 10,
    category: 'engagement',
  },
  {
    id: 'beloved',
    label: 'Beloved',
    description: 'Get 50 hearts on a single find',
    icon: '💚',
    goal: 50,
    category: 'engagement',
  },
  // Collection — sorted rarest last
  {
    id: 'rare_eye',
    label: 'Rare eye',
    description: '5 finds in Rare & bizarre',
    icon: '🔮',
    goal: 5,
    category: 'collection',
    collectionId: 'rare_bizarre',
  },
  {
    id: 'preservationist',
    label: 'Preservationist',
    description: "5 finds in Before it's gone",
    icon: '🏛️',
    goal: 5,
    category: 'collection',
    collectionId: 'before_its_gone',
  },
  {
    id: 'pattern_spotter',
    label: 'Pattern spotter',
    description: '5 finds in Patterns',
    icon: '🔷',
    goal: 5,
    category: 'collection',
    collectionId: 'patterns',
  },
  {
    id: 'local_expert',
    label: 'Local expert',
    description: '10 finds in Hyperlocal',
    icon: '📌',
    goal: 10,
    category: 'collection',
    collectionId: 'hyperlocal',
  },
  {
    id: 'beauty_seeker',
    label: 'Beauty seeker',
    description: '10 finds in Everyday beauty',
    icon: '✿',
    goal: 10,
    category: 'collection',
    collectionId: 'everyday_beauty',
  },
]

export const ACHIEVEMENT_TEMPLATE_BY_ID: Record<AchievementTemplateId, AchievementTemplate> =
  ACHIEVEMENT_TEMPLATES.reduce(
    (acc, t) => {
      acc[t.id] = t
      return acc
    },
    {} as Record<AchievementTemplateId, AchievementTemplate>,
  )

export const isAchievementTemplateId = (id: string): id is AchievementTemplateId =>
  id in ACHIEVEMENT_TEMPLATE_BY_ID
