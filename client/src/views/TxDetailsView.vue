<template>
    <v-container grid-list-lg class="mb-0">
        <app-error v-if="hasError" :has-error="hasError" :message="error" />
        <!--
        =====================================================================================
          TX DETAILS LIST
        =====================================================================================
        -->
        <tx-details v-if="isValid && !hasError" :tx-ref="txRef" @errorDetails="setError" />
    </v-container>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import AppError from '@app/core/components/ui/AppError.vue'
import { eth } from '@/core/helper'
import TxDetails from '@/modules/txs/TxDetails.vue'
import { ErrorMessageTx } from '@/modules/txs/models/ErrorMessagesForTx'

interface Reactive {
    errorMessages: ErrorMessageTx[]
    error: string
}

const state: Reactive = reactive({
    errorMessages: [],
    error: '',
})

const props = defineProps({
    txRef: String
})

const isValid = computed<boolean>(() => {
    return eth.isValidHash(props.txRef)
})

const hasError = computed<boolean>(() => {
    return state.error !== ''
})

if (!isValid.value) {
    state.error = 'This is not a valid transaction hash'
    window.scrollTo(0, 0)
}

/**
 * Sets error if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageToken}
 */
const setError = (hasError: boolean, message: ErrorMessageTx): void => {
    if (hasError) {
        if (message === ErrorMessageTx.notFound) {
            state.error = message.toString()
        } else {
            if (!state.errorMessages.includes(message)) {
                state.errorMessages.push(message)
            }
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
