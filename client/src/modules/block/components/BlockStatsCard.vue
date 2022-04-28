<template>
    <v-card :color="getColor" :class="getBackground" flat class="mt-1 pr-1 white--text info-card" height="150px">
        <v-container wrap fill-height row>
            <v-row v-if="!isLoading" xs="12" class="my-0 text-white">
                <v-layout align-end row pr-2>
                    <p v-if="!isDate" class="text-h4 text-truncate font-weight-medium pb-0 pl-1 mb-0">{{ value }}</p>
                    <p v-else class="text-h4 text-truncate font-weight-medium pb-0 pl-1 mb-0">{{ timeFrom }}</p>
                    <!-- <vue-time-ticker v-else :value="value" format="SECONDS" class="display-1 text-truncate font-weight-medium pb-0 pl-1 mb-0" /> -->
                    <p v-if="metrics" class="headline pl-1 mb-0">{{ metrics }}</p>
                </v-layout>
            </v-row>
            <v-row v-else xs="12" class="my-0">
                <v-layout align-end row pr-4 pl-2>
                    <v-progress-linear
                        :color="colorLoading"
                        background-color="white"
                        background-opacity="0.3"
                        value="40"
                        indeterminate
                        height="21"
                        class="ma-0"
                    />
                </v-layout>
            </v-row>
            <v-row xs="12" class="my-0">
                <v-card-text class="text-uppercase pt-0 pl-1 mt-4 text-white">{{ title }}</v-card-text>
            </v-row>
        </v-container>
    </v-card>
</template>
<script setup lang="ts">
import { defineProps, computed, onMounted, ref, watch } from 'vue'
import { log } from 'util'

// refs
const currentDate = ref(new Date())
const timeFrom = ref(0)

const props = defineProps({
    value: [String, Number],
    title: String,
    colorType: String,
    metrics: String,
    backType: String,
    isDate: {
        type: Boolean,
        default: false
    },
    isLoading: Boolean
})

const getColor = computed(() => {
    return props.colorType
})

const colorLoading = computed(() => {
    return `${props.colorType}Light`
})

const getBackground = computed(() => {
    return props.backType
})

watch(
    () => props.value,
    () => {
        if (props.isDate) {
            timeFrom.value = 0
        }
    }
)

onMounted(() => {
    timeFrom.value = parseInt((new Date().getTime() - new Date(props.value).getTime()) / 1000)
    setInterval(() => {
        timeFrom.value += 1
    }, 1000)
})
</script>
