import type { FeedItemDto, CreateReactionPayload } from '@/types'
import * as reactionsService from '@/services/reactions.service'
import * as savesService from '@/services/saves.service'

export const useReactions = () => {
  const enrichWithReactions = async (
    items: FeedItemDto[],
    userId: string
  ): Promise<FeedItemDto[]> => {
    if (items.length === 0) return items

    const findIds = items.map((item) => item.id)
    const [reactedIds, savedIds] = await Promise.all([
      reactionsService.getUserReactedFindIds(userId, findIds),
      savesService.getUserSavedFindIds(userId, findIds),
    ])

    return items.map((item) => ({
      ...item,
      hasReacted: reactedIds.has(item.id),
      hasSaved: savedIds.has(item.id),
    }))
  }

  const toggleReaction = (findId: string, userId: string, currentlyReacted: boolean) => {
    const delta = currentlyReacted ? -1 : 1

    const optimisticUpdate = (item: FeedItemDto) => {
      item.hasReacted = !currentlyReacted
      item.reactionCount = Math.max(0, item.reactionCount + delta)
    }

    const rollback = (item: FeedItemDto) => {
      item.hasReacted = currentlyReacted
      item.reactionCount = Math.max(0, item.reactionCount - delta)
    }

    const execute = async () => {
      if (currentlyReacted) {
        await reactionsService.deleteReaction(findId, userId)
      } else {
        const payload: CreateReactionPayload = { findId, userId, type: 'heart' }
        await reactionsService.createReaction(payload)
      }
    }

    return { optimisticUpdate, rollback, execute }
  }

  const toggleSave = (findId: string, userId: string, currentlySaved: boolean) => {
    const optimisticUpdate = (item: FeedItemDto) => {
      item.hasSaved = !currentlySaved
    }

    const rollback = (item: FeedItemDto) => {
      item.hasSaved = currentlySaved
    }

    const execute = async () => {
      if (currentlySaved) {
        await savesService.deleteSave(findId, userId)
      } else {
        await savesService.createSave(findId, userId)
      }
    }

    return { optimisticUpdate, rollback, execute }
  }

  return { enrichWithReactions, toggleReaction, toggleSave }
}
