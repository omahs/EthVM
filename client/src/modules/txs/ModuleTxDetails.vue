<template>
    <!--
    =====================================================================================
      TX DETAILS LIST
    =====================================================================================
    -->
    <v-row justify="start" class="mb-4">
        <v-col xs="12">
            <app-details-list has-title title="Transaction Details" :details="txDetails" :is-loading="isLoading" :max-items="7">
                <template v-if="!isLoading" #title>
                    <tx-details-title :status="titleStatus" />
                </template>
            </app-details-list>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue'
import BN from 'bignumber.js'
import AppDetailsList from '@/core/components/ui/AppDetailsList.vue'
import TxDetailsTitle from '@/modules/txs/components/ModuleTxDetailsTitle.vue'
import { Detail } from '@/core/components/props'
import { TxDetailsFragment as TxDetailsType, useGetTransactionByHashQuery, useTransactionEventSubscription } from './apollo/TxDetails.generated'
import { ErrorMessageTx, TxStatus } from '@/modules/txs/models/ErrorMessagesForTx'
import { excpTxDoNotExists } from '@/apollo/errorExceptions'
import { FormattedNumber, FormattedNumberUnit, formatNumber, formatVariableUnitEthValue, formatNonVariableGWeiValue } from '@/core/helper/number-format-helper'

interface Reactive {
    transaction: TxDetailsType
    hasError: boolean
    subscribed: boolean
}

const state: Reactive = reactive({
    hasError: false,
    transaction: [],
    subscribed: false
})

const props = defineProps({
    txRef: String
})

const emit = defineEmits(['errorDetails'])

const txAmount = computed<FormattedNumber>(() => {
    return formatVariableUnitEthValue(new BN(state.transaction.value))
})

const gasPrice = computed<FormattedNumber>(() => {
    return formatNonVariableGWeiValue(new BN(state.transaction.gasPrice))
})

const isReplaced = computed<boolean>(() => {
    return state.transaction && state.transaction.replacedBy !== null
})

const txStatus = computed<string>(() => {
    if (isReplaced.value) {
        return 'Replace Tx'
    }
    const statuses = ['0x0', '0x1']
    if (state.transaction && state.transaction.status === statuses[0]) {
        return 'Failed Tx'
    }
    if (state.transaction && state.transaction.status === statuses[1]) {
        return 'Successful Tx'
    }
    return 'Pending Transactions'
})

const titleStatus = computed<TxStatus>(() => {
    if (!isReplaced.value && state.transaction) {
        switch (state.transaction.status) {
            case '0x0':
                return TxStatus.failed
            case '0x1':
                return TxStatus.success
            default:
                return TxStatus.pending
        }
    }
    return TxStatus.replaced
})

const txFee = computed<FormattedNumber>(() => {
    if (state.transaction && state.transaction.gasUsed) {
        const price = new BN(state.transaction.gasPrice)
        const used = new BN(state.transaction.gasUsed)
        const fee = price.times(used)
        return formatVariableUnitEthValue(fee)
    }
    if (!isReplaced.value && txStatus.value === 'pending') {
        const fee = new BN(state.transaction.gas).multipliedBy(state.transaction.gasPrice)
        return formatVariableUnitEthValue(fee)
    }
    return { value: '0', unit: FormattedNumberUnit.ETH }
})

const pendingString = computed<string>(() => {
    return !isReplaced.value && txStatus.value === 'pending' ? 'Estimated Fee' : 'Tx Fee'
})

const txDetails = computed<Detail[]>(() => {
    const isNotContractCreation = typeof state.transaction.contractAddress !== 'string'
    const details: Detail[] = [
        {
            title: 'Hash',
            detail: state.transaction.hash,
            copy: true,
            mono: true
        },
        {
            title: 'From',
            detail: state.transaction.from,
            copy: true,
            link: `/address/${state.transaction.from}`,
            mono: true,
            toChecksum: true
        },
        {
            title: isNotContractCreation ? 'To' : 'Contract Creation',
            detail: isNotContractCreation ? state.transaction.to : state.transaction.contractAddress,
            copy: state.transaction.to !== null,
            link: state.transaction.to !== null ? `/address/${state.transaction.to!}` : `/address/${state.transaction.contractAddress}`,
            mono: state.transaction.to !== null,
            toChecksum: true
        },
        {
            title: 'Amount',
            detail: `${txAmount.value.value} ${txAmount.value.unit?.toUpperCase()}`,
            tooltip: txAmount.value.tooltipText ? `${txAmount.value.tooltipText} ETH` : undefined
        },

        {
            title: pendingString.value,
            detail: `${txFee.value.value} ${txFee.value.unit?.toUpperCase()}`,
            tooltip: txFee.value.tooltipText ? `${txFee.value.tooltipText} ETH` : undefined
        },
        {
            title: 'Status',
            detail: txStatus.value
        },
        {
            title: 'Gas limit',
            detail: formatNumber(new BN(state.transaction.gas).toNumber())
        },

        {
            title: 'Gas Price',
            detail: `${gasPrice.value.value} ${gasPrice.value.unit?.toUpperCase()}`,
            tooltip: gasPrice.value.tooltipText ? `${gasPrice.value.tooltipText} ETH` : undefined
        },
        {
            title: 'Gas Used',
            detail: formatNumber(new BN(state.transaction.gasUsed || 0).toNumber()) // TODO genesis block txs can have no receipt
        },
        {
            title: 'Nonce',
            detail: state.transaction.nonce
        },

        {
            title: 'Input Data',
            detail: state.transaction.input
            // txInput: this.inputFormatted
        }
    ]
    if (txStatus.value !== 'Pending Transactions' && !isReplaced.value) {
        const time = {
            title: 'Timestamp',
            detail: state.transaction.timestamp !== null ? new Date(state.transaction.timestamp * 1e3).toString() : ''
        }
        details.splice(1, 0, time)
    }

    if (txStatus.value !== 'pending' && !isReplaced.value) {
        const block = {
            title: 'Block #',
            detail: formatNumber(state.transaction.blockNumber || 0),
            link: `/block/number/${state.transaction.blockNumber}`
        }
        details.splice(0, 0, block)
    }
    if (state.transaction.replacedBy !== null) {
        const replaced = {
            title: 'Replaced By',
            detail: state.transaction.replacedBy,
            copy: true,
            link: state.transaction.replacedBy,
            mono: true
        }
        details.splice(1, 0, replaced)
    }
    return details
})

/**
 * Emit error to Sentry
 * @param val {Boolean}
 * @param hashNotFound {Boolean}
 */
const emitErrorState = (val: boolean, hashNotFound = false): void => {
    state.hasError = val
    const mess = hashNotFound ? ErrorMessageTx.notFound : ErrorMessageTx.details
    emit('errorDetails', state.hasError, mess)
}

/**
 * Start apollo subscription
 */
const {
    result,
    onResult: onTransactionHashLoaded,
    onError: onTransactionHashError,
    loading: loadingTransactionHash,
    refetch: refetchTransactionHash
} = useGetTransactionByHashQuery({ hash: props.txRef }, { notifyOnNetworkStatusChange: true })

onTransactionHashLoaded(({ data }) => {
    if (data && data.getTransactionByHash) {
        state.transaction = data.getTransactionByHash
        if (!isReplaced.value && txStatus.value === 'pending' && !state.subscribed) {
            // this.startSubscription()
        }
        emitErrorState(false)
    }
})

onTransactionHashError(error => {
    const newError = JSON.stringify(error.message)
    if (newError.toLowerCase().includes(excpTxDoNotExists)) {
        emitErrorState(true, true)
    } else {
        emitErrorState(true)
    }
})

const isLoading = computed<boolean | undefined>(() => {
    return loadingTransactionHash.value || state.hasError
})

const subscriptionEnabled = ref(false)

const { onResult: onNewTransactionEvent, onError: onNewTransactionEventError } = useTransactionEventSubscription(
    { hash: state.transaction.hash },
    {
        enabled: subscriptionEnabled.value
    }
)

onNewTransactionEvent(({ data }) => {
    console.log(data)
    refetchTransactionHash()
})

onNewTransactionEventError(error => {
    emitErrorState(true)
})

onMounted(() => {
    console.log('Refetching')
    refetchTransactionHash()
})

// startSubscription(): void {
//     const _hash = this.transaction.hash
//     const observer = this.$apollo.subscribe({
//         query: transactionEvent,
//         variables: {
//             hash: _hash
//         }
//     })
//     const a = observer.subscribe({
//         next: data => {
//             a.unsubscribe()
//             this.$apollo.queries.transaction.refetch()
//         },
//         error: error => {
//             this.emitErrorState(true)
//         }
//     })
// }
</script>
