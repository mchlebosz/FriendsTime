<template>
    <button @click="toggleTheme"
        class="p-2 rounded-full focus:outline-none bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle dark mode">
        <FontAwesomeIcon v-if="isDark" :icon="faSun" class="h-6 w-6 text-gray-200 dark:text-gray-800" />
        <FontAwesomeIcon v-else :icon="faMoon" class="h-6 w-6 text-gray-800 dark:text-gray-200" />
    </button>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

import { inject } from 'vue'

const isDark = inject<Ref<boolean>>('isDark')

if (!isDark) {
    throw new Error("Injection 'isDark' not found")
}

const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark');

}
</script>