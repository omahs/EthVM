<template>
    <div class="pb-1 pt-1">
        <v-layout align-center justify-start class="pa-1">
            <v-card-title align-center justify-start class="title font-weight-bold pl-4"> Transaction Details </v-card-title>
            <app-tooltip :text="status" :icon-color="statusColor" :spin="statusSpin" :icon-type="statusIcon" />
        </v-layout>
        <v-divider class="lineGrey mt-1 mb-1" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppTooltip from '@/core/components/ui/AppTooltip.vue'
import { TxStatus } from '@/modules/txs/models/ErrorMessagesForTx'

const props = defineProps({
    status: {
        type: String,
        default: 'Success'
    }
})

/*
===================================================================================
  Computed Values
===================================================================================
*/

const statusIcon = computed<string>(() => {
    switch (props.status) {
        case TxStatus.success:
            return 'mdi-check-circle'
        case TxStatus.failed:
            return 'fa fa-times-circle'
        case TxStatus.pending:
            return 'fas fa-circle-notch'
        default:
            return 'fa fa-retweet'
    }
})

const statusColor = computed<string>(() => {
    switch (props.status) {
        case TxStatus.success:
            return 'green'
        case TxStatus.failed:
            return 'txFail'
        case TxStatus.pending:
            return 'txPen'
        default:
            return 'info'
    }
})

const statusSpin = computed<boolean>(() => {
    return props.status === TxStatus.pending
})
</script>

<style scoped lang="css">
.chip {
    height: 28px;
    border-radius: 14px;
    border: solid 1px;
    padding: 5px 10px;
}

.status-success {
    border-color: #40ce9c;
    color: #40ce9c;
}
.status-fail {
    border-color: #fe1377;
    color: #fe1377;
}

.status-replaced {
    border-color: #8391a8;
    color: #8391a8;
}
.status-pending {
    border-color: #eea66b;
    color: #eea66b;
}
</style>
