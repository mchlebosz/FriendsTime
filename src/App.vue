<template>
  <main
    class="max-w-4xl mx-auto p-4 space-y-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 shadow-lg h-full rounded-md">
    <div class="flex justify-between items-center">
      <img src="./assets/logo.png" alt="Logo" class="w-16 h-16 mr-2 rounded-full" />
      <h1 class="text-3xl font-bold">Friends Time</h1>
      <ThemeSwitch />
    </div>
    <ClockForm @add="addClock" />
    <div class="flex flex-wrap gap-4 justify-center">
      <ClockCard v-for="clock in clocks" :key="clock.id" :id="clock.id" :zone="clock.zone" :tags="clock.tags"
        @remove="removeClock" @update-tags="updateTags" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ClockForm from '@/components/ClockForm.vue'
import ClockCard from '@/components/ClockCard.vue'
import ThemeSwitch from '@/components/ThemeSwitcher.vue'
import type { ClockEntry } from '@/db'
import { getClocks, saveClock, deleteClock } from '@/db'

const isDark = ref(false)
const clocks = ref<ClockEntry[]>([])

// Watch for system preference changes
watch(isDark, (newVal) => {
  document.documentElement.classList.toggle('dark', newVal)
  localStorage.setItem('theme', newVal ? 'dark' : 'light')
})

onMounted(async () => {
  clocks.value = await getClocks()
})

const addClock = async (zone: string) => {
  if (clocks.value.some((c) => c.zone === zone)) return

  const clock: ClockEntry = {
    id: zone,
    zone,
    tags: []
  }
  clocks.value.push(clock)
  await saveClock(clock)
}

const updateTags = async (id: string, tags: string[]) => {
  const clock = clocks.value.find((c) => c.id === id)
  if (!clock) return

  const updatedClock = {
    id: clock.id,
    zone: clock.zone,
    tags: [...tags]
  }

  clock.tags = updatedClock.tags
  await saveClock(updatedClock)
}

const removeClock = async (id: string) => {
  clocks.value = clocks.value.filter((c) => c.id !== id)
  await deleteClock(id)
}
</script>