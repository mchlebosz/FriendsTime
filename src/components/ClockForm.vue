<template>
    <div class="flex flex-col gap-4">
        <!-- Toggle Switch -->
        <div class="flex items-center justify-center gap-2">
            <span :class="{ 'font-medium': !useCitySearch }" class="text-text">Timezone List</span>
            <button @click="useCitySearch = !useCitySearch"
                class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors"
                :class="useCitySearch ? 'bg-blue-600' : 'bg-gray-200'">
                <span class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                    :class="useCitySearch ? 'translate-x-6' : 'translate-x-1'" />
            </button>
            <span :class="{ 'font-medium': useCitySearch }" class="text-text">City Search</span>
        </div>

        <!-- Timezone List Mode -->
        <form v-if="!useCitySearch" @submit.prevent="submitTimezone" class="flex gap-2 items-center justify-center">
            <select v-model="selectedTimezone"
                class="border rounded px-3 py-2 w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <option disabled value="">Select Time Zone</option>
                <option v-for="zone in timezones" :key="zone" :value="zone">
                    {{ formatTimezoneName(zone) }}
                </option>
            </select>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                <FontAwesomeIcon :icon="faPlus" />
                Add Clock
            </button>
        </form>

        <!-- City Search Mode -->
        <form v-else @submit.prevent="submitCity" class="flex flex-col items-center justify-center gap-2">
            <div class="flex gap-2 w-full items-center justify-center">
                <input v-model="cityQuery" @input="searchCities" type="text" placeholder="Search city..."
                    class="border rounded px-3 py-2 w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    list="cityOptions" />
                <datalist id="cityOptions">
                    <option v-for="city in cityResults" :key="city.geonameId" :value="city.name">
                        {{ city.name }}, {{ city.countryName }}
                    </option>
                </datalist>
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    :disabled="!cityQuery || !cityResults.length">
                    <FontAwesomeIcon :icon="faPlus" />
                    Add Clock
                </button>
            </div>
            <small class="text-gray-500 dark:text-gray-400 text-center">e.g. "Paris" or "New York"</small>
        </form>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import moment from 'moment-timezone'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits<{
    (e: 'add', zone: string): void
}>()

// Toggle state
const useCitySearch = ref(false)

// Timezone List Mode
const timezones = moment.tz.names()
const selectedTimezone = ref('')

// City Search Mode
const cityQuery = ref('')
interface City {
    geonameId: number
    name: string
    countryName: string
    lat: number
    lng: number
}

const cityResults = ref<City[]>([])

// Format timezone names (e.g. "America/New_York" → "New York (EDT)")
const formatTimezoneName = (zone: string) => {
    const parts = zone.split('/')
    const city = parts[parts.length - 1].replace('_', ' ')
    const offset = moment.tz(zone).format('Z')
    return `${city} (UTC${offset})`
}

// City search function
const searchCities = async () => {
    if (!cityQuery.value.trim()) {
        cityResults.value = []
        return
    }

    try {
        const response = await axios.get('https://secure.geonames.org/searchJSON', {
            params: {
                username: 'ksuhiyp', // Replace with your GeoNames username
                q: cityQuery.value,
                maxRows: 10,
                featureClass: 'P' // Cities only
            }
        })
        cityResults.value = response.data.geonames || []
    } catch (error) {
        console.error('Failed to fetch cities:', error)
    }
}

// Submission handlers
const submitTimezone = () => {
    if (!selectedTimezone.value) return
    console.log('Selected timezone:', selectedTimezone.value)
    emit('add', selectedTimezone.value)
    selectedTimezone.value = ''
}

const submitCity = async () => {

    try {
        console.log('City query:', cityQuery.value)
        console.log('City results:', cityResults.value)


        if (!cityQuery.value.trim()) return
        if (!cityResults.value.length) return

        // Find the selected city in the results
        const selectedCity = cityResults.value.find(c => c.name === cityQuery.value)
        if (!selectedCity) return

        console.log('Selected city:', selectedCity)
        console.log('Selected city name:', selectedCity.name)
        console.log('Selected Lat:', selectedCity.lat)
        console.log('Selected Long:', selectedCity.lng)

        const timezone = await getTimezoneFromCoordinates(selectedCity.lat, selectedCity.lng)
        console.log('Timezone:', timezone)
        if (!timezone) return

        emit('add', timezone)
        cityQuery.value = ''
        cityResults.value = []

    } catch (error) {
        console.error('Failed to fetch timezone:', error)
    }


}

const getTimezoneFromCoordinates = async (lat: number, lng: number) => {
    try {
        const response = await axios.get('https://secure.geonames.org/timezoneJSON', {
            params: {
                username: 'ksuhiyp', // Replace with your GeoNames username
                lat,
                lng
            }
        })
        return response.data.timezoneId || ''
    } catch (error) {
        console.error('Failed to fetch timezone:', error)
        return ''
    }
}
</script>



<style scoped>
/* Smooth toggle transition */
button {
    transition: background-color 0.2s ease;
}
</style>