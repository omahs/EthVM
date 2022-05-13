<template>
    <block-stats-module />
    <recent-blocks :max-items="10" page-type="blocks" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import BlockStatsModule from '@module/block/BlockStatsModule.vue'
import RecentBlocks from '@module/block/RecentBlocks.vue'

const routeName = computed(() => {
    return useRoute().name
})
</script>
