<template>
    <module-txs :max-items="10" page-type="txs" />
</template>

<script setup lang="ts">
import ModuleTxs from '@module/txs/ModuleTxs.vue'
import { onMounted } from 'vue'
onMounted(() => {
    window.scrollTo(0, 0)
})
</script>
