import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/constants'
import type { CommunityId } from '@/types'
import * as findsService from '@/services/finds.service'
import * as storageService from '@/services/storage.service'
import * as achievementsService from '@/services/achievements.service'
import { useAchievementCelebration } from '@/composables/useAchievementCelebration'

interface UsePostFindOptions {
  imageBlob: Ref<Blob | null>
  locationName: Ref<string>
  lat: Ref<number | null>
  lng: Ref<number | null>
}

export const usePostFind = ({ imageBlob, locationName, lat, lng }: UsePostFindOptions) => {
  const router = useRouter()
  const auth = useAuthStore()
  const { celebrateSequence } = useAchievementCelebration()

  const caption = ref('')
  const community = ref<CommunityId | null>(null)
  const tags = ref<string[]>([])
  const posting = ref(false)
  const postError = ref('')

  const canPost = computed(() => !!imageBlob.value && !!locationName.value && lat.value !== null && lng.value !== null && !posting.value)

  const toggleCommunity = (id: CommunityId) => {
    community.value = community.value === id ? null : id
  }

  const post = async (): Promise<void> => {
    if (!canPost.value || !imageBlob.value || !auth.user) return

    posting.value = true
    postError.value = ''
    try {
      const path = storageService.buildFindImagePath(auth.user.id)
      const uploadedImage = await storageService.uploadImage(path, imageBlob.value)
      await findsService.createFind({
        userId: auth.user.id,
        imageUrl: uploadedImage.publicUrl,
        caption: caption.value.trim() || null,
        locationName: locationName.value || null,
        lat: lat.value,
        lng: lng.value,
        community: community.value,
        tags: tags.value,
      })
      try {
        const newAchievements = await achievementsService.checkAfterPost(auth.user.id)
        if (newAchievements.length > 0) {
          await celebrateSequence(newAchievements)
        }
      } catch {
        /* Post still succeeds; fix GRANT/RLS on public.achievements if trophies fail */
      }
      router.replace(ROUTES.feed)
    } catch (e: unknown) {
      postError.value = e instanceof Error ? e.message : 'Something went wrong'
    } finally {
      posting.value = false
    }
  }

  return { caption, community, tags, canPost, posting, postError, toggleCommunity, post }
}
