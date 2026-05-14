export type BadgeId = 'pioneer' | 'first_here' | 'trending' | 'rare'

export interface BadgeDefinition {
  id: BadgeId
  label: string
  /** Accent color (hex) for pill border/text */
  color: string
}

export const BADGE_DEFINITIONS: Record<BadgeId, BadgeDefinition> = {
  pioneer: { id: 'pioneer', label: 'First find', color: '#52B788' },
  first_here: { id: 'first_here', label: 'First here', color: '#F2CC60' },
  trending: { id: 'trending', label: 'Trending', color: '#E07A5F' },
  rare: { id: 'rare', label: 'Rare find', color: '#F2CC60' },
}

/** Static badges persisted on `finds.badges`; `trending` is merged at read time. */
export const STATIC_BADGE_IDS: BadgeId[] = ['pioneer', 'first_here', 'rare']

export const isBadgeId = (id: string): id is BadgeId => id in BADGE_DEFINITIONS

export const getBadgeDefinition = (id: string): BadgeDefinition | null =>
  isBadgeId(id) ? BADGE_DEFINITIONS[id] : null

/** Display order when multiple badges apply */
export const BADGE_DISPLAY_ORDER: BadgeId[] = ['rare', 'pioneer', 'first_here', 'trending']
