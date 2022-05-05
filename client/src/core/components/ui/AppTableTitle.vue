<template>
    <div>
        <v-layout v-if="isHome" align-center justify-space-between row wrap fill-height pb-1 pr-2 pl-2>
            <v-flex xs6>
                <v-card-title class="title font-weight-bold pl-1">{{ title }}</v-card-title>
            </v-flex>
            <v-spacer />
            <v-flex shrink>
                <v-btn :to="pageLink" outline color="secondary" class="text-capitalize ma-0">View All</v-btn>
            </v-flex>
        </v-layout>
        <v-layout v-else align-center row wrap fill-height pa-2>
            <v-flex grow class="title-live">
                <v-layout align-center justify-start row wrap pa-1>
                    <v-card-title class="title font-weight-bold pl-1">{{ title }} </v-card-title>
                    <p v-if="hasCaption" class="info--text pl-1">{{ titleCaption }}</p>
                    <slot name="update" />
                </v-layout>
            </v-flex>
            <v-spacer />
            <v-flex v-if="hasPagination" shrink hidden-sm-and-down>
                <slot name="pagination" />
            </v-flex>
            <v-flex xs12 hidden-md-and-up>
                <v-layout align-center justify-center pa-2>
                    <slot name="filter" />
                </v-layout>
            </v-flex>
            <v-flex v-if="hasPagination" xs12 hidden-md-and-up>
                <v-layout align-center justify-center pa-2>
                    <slot name="pagination" />
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    title: String,
    pageLink: String,
    titleCaption: {
        type: String,
        default: ''
    },
    pageType: {
        type: String,
        default: 'home'
    },
    hasPagination: {
        type: Boolean,
        default: false
    }
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

const hasCaption = computed<boolean>(() => {
    return props.titleCaption !== ''
})
</script>
