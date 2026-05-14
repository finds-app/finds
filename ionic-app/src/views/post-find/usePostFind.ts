import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/constants'
import type { CollectionId } from '@/types'
import * as findsService from '@/services/finds.service'
import * as storageService from '@/services/storage.service'
import * as achievementsService from '@/services/achievements.service'
import * as chainsService from '@/services/chains.service'
import { useAchievementCelebration } from '@/composables/useAchievementCelebration'

interface UsePostFindOptions {
  imageBlob: Ref<Blob | null>
  locationName: Ref<string>
  lat: Ref<number | null>
  lng: Ref<number | null>
  linkToFindId: Ref<string | null>
}

export const usePostFind = ({ imageBlob, locationName, lat, lng, linkToFindId }: UsePostFindOptions) => {
  const router = useRouter()
  const auth = useAuthStore()
  const { celebrateSequence } = useAchievementCelebration()

  const caption = ref('')
  const collection = ref<CollectionId | null>(null)
  const tags = ref<string[]>([])
  const posting = ref(false)
  const postError = ref('')

  const canPost = computed(() => !!imageBlob.value && !!locationName.value && lat.value !== null && lng.value !== null && !posting.value)

  const toggleCollection = (id: CollectionId) => {
    collection.value = collection.value === id ? null : id
  }

  const post = async (): Promise<void> => {
    if (!canPost.value || !imageBlob.value || !auth.user) return

    posting.value = true
    postError.value = ''
    const parentId = linkToFindId.value
    try {
      const path = storageService.buildFindImagePath(auth.user.id)
      const uploadedImage = await storageService.uploadImage(path, imageBlob.value)
      const newFind = await findsService.createFind({
        userId: auth.user.id,
        imageUrl: uploadedImage.publicUrl,
        caption: caption.value.trim() || null,
        locationName: locationName.value || null,
        lat: lat.value,
        lng: lng.value,
        collection: collection.value,
        tags: tags.value,
      })
      if (parentId) {
        try {
          await chainsService.createLink({
            findId: parentId,
            linkedFindId: newFind.id,
            createdBy: auth.user.id,
          })
        } catch {
          /* find still created; fix find_links RLS if link fails */
        }
      }
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

  return { caption, collection, tags, canPost, posting, postError, toggleCollection, post }
}
