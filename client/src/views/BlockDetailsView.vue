<template>
    <v-container grid-list-lg class="mb-0">
        <app-error v-if="!isValid" :has-error="!isValid" message="This is not a valid block hash" />
        <app-message :messages="state.errorMessages" />
        <!--
        =====================================================================================
          Block DETAILS LIST
        =====================================================================================
        -->
        <!--        <tx-details v-if="isValid && !hasError" :tx-ref="txRef" @errorDetails="setError" />-->

        <!--
        =====================================================================================
          TX TABLE
        =====================================================================================
        -->
        <!-- TODO: Implement get block transfers by hash -->
        <block-txs
            v-if="showBlockTxs"
            :max-items="10"
            :block-ref="state.blockNumber"
            :is-hash="isHash"
            :is-mined="state.isMined"
            page-type="blockDetails"
            @errorTxs="setError"
        />
    </v-container>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import AppMessage from '@/core/components/ui/AppMessage.vue'
import AppError from '@/core/components/ui/AppError.vue'
import BlockTxs from '@module/txs/ModuleTxs.vue'
import { eth } from '@/core/helper'
import { ErrorMessageBlock } from '@/modules/block/models/ErrorMessagesForBlock'

interface ComponentState {
    errorMessages: ErrorMessageBlock[]
    blockNumber: string
    isMined: boolean
}

const state: ComponentState = reactive({
    errorMessages: [],
    blockNumber: '',
    isMined: false
})

const props = defineProps({
    blockRef: String
})

const isValid = computed<boolean>(() => {
    return isHash.value || eth.isValidBlockNumber(props.blockRef)
})

const isHash = computed<boolean>(() => {
    return eth.isValidHash(props.blockRef)
})

const showBlockTxs = computed<boolean>(() => {
    return isValid.value && state.blockNumber !== ''
})

if (!isValid.value) {
    state.error = 'This is not a valid transaction hash'
    window.scrollTo(0, 0)
}

onMounted(() => {
    if (!isHash.value) {
        state.blockNumber = props.blockRef
    }
})

/**
 * Sets isMined to true
 */
const setIsMined = (): void => {
    this.isMined = true
}

/**
 * Set block Number
 * @param value {String}
 */
const setBlockNumber = (value: string): void => {
    this.blockNumber = value
}

/**
 * Sets error if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageToken}
 */
const setError = (hasError: boolean, message: ErrorMessageBlock): void => {
    if (hasError) {
        if (!state.errorMessages.includes(message)) {
            state.errorMessages.push(message)
        }
    } else {
        if (state.errorMessages.length > 0) {
            const index = state.errorMessages.indexOf(message)
            if (index > -1) {
                state.errorMessages.splice(index, 1)
            }
        }
    }
}
</script>
