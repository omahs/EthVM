<template>
    <v-container grid-list-lg class="mb-0">
        <app-error v-if="!isValid" :has-error="!isValid" :message="state.error" />
        <template v-if="isValid">
            <module-address-tokens class="mb-4" :address-hash="props.addressRef" />
            <module-address-token-transfers :address-hash="props.addressRef" />
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, watch, onMounted } from 'vue'
import AppError from '@core/components/ui/AppError.vue'
import ModuleAddressTokens from '@module/address/ModuleAddressTokens.vue'
import ModuleAddressTokenTransfers from '@module/address/ModuleAddressTokenTransfers.vue'
import { eth } from '@core/helper'

const props = defineProps({
    addressRef: String
})

const state = {
    error: ''
}

const isValid = computed<boolean>(() => {
    return eth.isValidAddress(props.addressRef)
})

onMounted(() => {
    if (!isValid.value) {
        state.error = 'This is not a valid address hash'
    }
})
</script>
