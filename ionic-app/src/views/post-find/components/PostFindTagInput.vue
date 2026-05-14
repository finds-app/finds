<script setup lang="ts">
import { ref } from 'vue'
import { MAX_TAGS_PER_FIND, normalizeTag } from '@/services/tags.service'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const input = ref('')

const addTag = (raw: string) => {
  const next = normalizeTag(raw)
  if (!next) {
    input.value = ''
    return
  }
  if (props.modelValue.length >= MAX_TAGS_PER_FIND) {
    input.value = ''
    return
  }
  if (props.modelValue.includes(next)) {
    input.value = ''
    return
  }
  emit('update:modelValue', [...props.modelValue, next])
  input.value = ''
}

const removeTag = (tag: string) => {
  emit(
    'update:modelValue',
    props.modelValue.filter((t) => t !== tag),
  )
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag(input.value)
  } else if (e.key === 'Backspace' && !input.value && props.modelValue.length > 0) {
    removeTag(props.modelValue[props.modelValue.length - 1])
  }
}
</script>

<template>
  <div class="py-3">
    <p class="text-white/35 text-[10px] font-body uppercase tracking-wider mb-2 m-0">Tags (optional, max 3)</p>
    <div class="flex flex-wrap gap-2 items-center min-h-[2.25rem]">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 rounded-full bg-white/[0.08] pl-2.5 pr-1 py-1 text-xs font-body text-white/70"
      >
        #{{ tag }}
        <button
          type="button"
          class="m-0 p-0.5 border-0 bg-transparent text-white/35 rounded-full active:text-white/60"
          aria-label="Remove tag"
          @click="removeTag(tag)"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </span>
      <input
        v-if="modelValue.length < MAX_TAGS_PER_FIND"
        v-model="input"
        type="text"
        maxlength="48"
        placeholder="Add a tag…"
        class="flex-1 min-w-[6rem] bg-transparent border-0 outline-none text-sm font-body text-white/70 placeholder:text-white/20 py-1"
        @keydown="onKeydown"
        @blur="() => { if (input.trim()) addTag(input) }"
      />
    </div>
    <p class="text-white/20 text-[11px] font-body mt-2 m-0">Letters, numbers, dashes. Press enter or comma to add.</p>
  </div>
</template>
