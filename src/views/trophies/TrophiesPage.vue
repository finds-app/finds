<script setup lang="ts">
import { computed } from 'vue'
import { IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue'
import type { AchievementCategory } from '@/constants/achievements'
import { ACHIEVEMENT_TEMPLATES } from '@/constants/achievements'
import { useTrophies } from './useTrophies'
import TrophiesHeader from './components/TrophiesHeader.vue'
import TrophyCard from './components/TrophyCard.vue'

const SECTIONS: { category: AchievementCategory; kicker: string; title: string; blurb: string }[] = [
  {
    category: 'general',
    kicker: 'Habits',
    title: 'Out in the world',
    blurb: 'Volume, places, and showing up.',
  },
  {
    category: 'engagement',
    kicker: 'Ripples',
    title: 'Seen & saved',
    blurb: 'When others pause on your finds.',
  },
  {
    category: 'collection',
    kicker: 'Seven lenses',
    title: 'Where you belong',
    blurb: 'The collections you feed.',
  },
]

const { templates, progressById, loading, error, earnedCount, load } = useTrophies()

const totalCount = templates.length

const sectionLists = computed(() =>
  SECTIONS.map((s) => ({
    ...s,
    templates: ACHIEVEMENT_TEMPLATES.filter((t) => t.category === s.category),
    earnedHere: ACHIEVEMENT_TEMPLATES.filter(
      (t) => t.category === s.category && progressById.value.get(t.id)?.unlocked,
    ).length,
  })),
)

const handleRefresh = async (event: CustomEvent) => {
  await load()
  ;(event.target as HTMLIonRefresherElement).complete()
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="trophies-surface [--background:#0E1F1A]">
      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content pulling-icon="crescent" refreshing-spinner="crescent" />
      </ion-refresher>

      <div class="relative min-h-full pb-28">
        <div class="trophies-noise pointer-events-none fixed inset-0 opacity-[0.04]" aria-hidden="true" />

        <TrophiesHeader :earned="earnedCount" :total="totalCount" />

        <p v-if="error" class="relative mx-4 rounded-xl border border-ember/25 bg-ember/10 px-4 py-3 font-body text-sm text-ember">
          {{ error }}
        </p>

        <div v-if="loading" class="relative space-y-6 px-4 py-2">
          <div v-for="s in 3" :key="s" class="space-y-3">
            <div class="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div class="h-4 w-40 animate-pulse rounded bg-white/[0.07]" />
            <div class="grid gap-3 sm:grid-cols-2">
              <div v-for="n in 4" :key="`${s}-${n}`" class="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
            </div>
          </div>
        </div>

        <div v-else class="relative space-y-10 px-4 pt-2">
          <section
            v-for="block in sectionLists"
            :key="block.category"
            class="scroll-mt-4"
          >
            <div class="flex flex-col gap-1 border-b border-white/[0.06] pb-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-sage/80">
                  {{ block.kicker }}
                </p>
                <h2 class="mt-1 font-display text-xl font-bold italic text-cream sm:text-2xl">
                  {{ block.title }}
                </h2>
                <p class="mt-1 max-w-md font-body text-xs font-light leading-relaxed text-white/38">
                  {{ block.blurb }}
                </p>
              </div>
              <p class="mt-2 shrink-0 font-body text-[11px] tabular-nums text-white/30 sm:mt-0">
                {{ block.earnedHere }}/{{ block.templates.length }} here
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <TrophyCard
                v-for="t in block.templates"
                :key="t.id"
                :template="t"
                :progress="progressById.get(t.id)"
              />
            </div>
          </section>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.trophies-surface {
  --padding-bottom: env(safe-area-inset-bottom, 0px);
}

.trophies-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}
</style>
