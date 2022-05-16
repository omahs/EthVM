<template>
    <block-stats-module />
    <recent-blocks :max-items="10" page-type="blocks" />
</template>

<script setup lang="ts">
import BlockStatsModule from '@module/block/BlockStatsModule.vue'
import RecentBlocks from '@module/block/RecentBlocks.vue'
</script>
