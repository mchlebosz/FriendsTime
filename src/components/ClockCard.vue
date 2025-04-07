<template>
    <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 w-full sm:w-64 text-center flex flex-col gap-3 relative">
        <button @click="$emit('remove', id)"
            class="hover:text-600text-sm hover:underline mt-1 absolute top-2 right-2 text-red-400 hover:text-red-600 hover:cursor-pointer">
            <FontAwesomeIcon :icon="faXmark" class="text-lg" />
        </button>
        <h2 class="font-semibold text-md text-gray-800 dark:text-gray-200 truncate">{{ zone }}</h2>
        <p class="text-2xl text-gray-700 dark:text-gray-300">{{ formattedTime }}</p>

        <!-- Tags display -->
        <div class="flex flex-wrap justify-center gap-1">
            <span v-for="(tag, index) in tags" :key="index"
                class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-s font-medium px-2 py-1 rounded-full">
                {{ tag }}
                <button @click="removeTag(index)" class="ml-1 text-red-400 hover:text-red-600">
                    <FontAwesomeIcon :icon="faXmark" class="text-xs" />
                </button>
            </span>
        </div>

        <!-- Add tag input -->
        <form @submit.prevent="addTag" class="flex gap-1 justify-center">
            <input v-model="newTag" type="text" placeholder="Add name"
                class="border rounded px-2 py-1 w-2/3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
            <button type="submit"
                class="bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 text-md  rounded hover:bg-blue-600 dark:hover:bg-blue-700">
                <FontAwesomeIcon :icon="faPlus" class="text-md w-4" />
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
    id: string
    zone: string
    tags?: string[]
}>()

const emit = defineEmits<{
    (e: 'remove', id: string): void
    (e: 'update-tags', id: string, tags: string[]): void
}>()

const time = ref(new Date())
const updateInterval = ref<number>()

const formattedTime = computed(() =>
    new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: props.zone
    }).format(time.value)
)

onMounted(() => {
    updateInterval.value = window.setInterval(() => {
        time.value = new Date()
    }, 1000)
})

onBeforeUnmount(() => {
    if (updateInterval.value) {
        clearInterval(updateInterval.value)
    }
})

const tags = ref<string[]>(props.tags || [])
const newTag = ref('')

const addTag = () => {
    if (!newTag.value.trim()) return
    tags.value.push(newTag.value.trim())
    newTag.value = ''
    emit('update-tags', props.id, [...tags.value])
}

const removeTag = (index: number) => {
    tags.value.splice(index, 1)
    emit('update-tags', props.id, [...tags.value])
}
</script>