<template>
    <app-new-update icon-only text="New blocks" :update-count="state.valueString" @reload="onReload" />
</template>

<script setup lang="ts">
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import { reactive } from 'vue'
import { useBlockSubscription } from '@core/composables/NewBlock/newBlock.composable'

const props = defineProps({
    pageId: {
        type: String,
        default: 'block'
    }
})

const emit = defineEmits(['reload'])

interface ComponentState {
    display: boolean
    countTotal: number
    newTxsCount: number
    newUncles: number
    validID: string[]
    valueString: number
}

const state: ComponentState = reactive({
    display: false,
    countTotal: 0,
    newTxsCount: 0,
    newUncles: 0,
    validID: ['block', 'tx', 'pending', 'uncle'],
    valueString: 0
})

const { onNewBlockLoaded, newBlockNumber, newTxs } = useBlockSubscription()

onNewBlockLoaded(() => {
    if (props.pageId === state.validID[0] && newBlockNumber.value) {
        state.display = true
        state.countTotal++
        state.valueString = state.countTotal
    }
    if (props.pageId === state.validID[1] && newTxs.value && newTxs.value > 0) {
        state.display = true
        state.newTxsCount += newTxs.value
        state.valueString = newTxs.value
    }
    if (props.pageId === state.validID[3] && state.newUncles > 0) {
        state.display = true
        state.valueString = state.newUncles
    }
})

const onReload = () => {
    emit('reload')
    state.display = false
    state.countTotal = 0
    state.newTxsCount = 0
    state.newUncles = 0
    state.valueString = 0
}
</script>

<style scoped></style>
