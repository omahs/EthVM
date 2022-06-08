<template>
    <div>
        <!--
    =====================================================================================
      BASIC VIEW

      Will show details if URL does NOT include query param "holder"
      Shows details pertinent to the token as a whole, with no holder-specific information
    =====================================================================================
    -->
        <div v-if="!isHolder">
            <token-details-list
                :holder-details="null"
                :address-ref="addressRef"
                :token-details="tokenDetails"
                :is-nft="isNft"
                :is-loading="loadingTokenDetails || hasError"
                @errorDetails="emitErrorState"
            />
        </div>
        <!--
    =====================================================================================
      HOLDER VIEW

      Will show details if the URL DOES include query param "holder"
      Shows holder details pertaining to particular token contract
    =====================================================================================
    -->
        <div v-if="isHolder">
            <token-details-list
                :address-ref="addressRef"
                :holder-details="tokenDetails"
                :token-details="tokenDetails ? tokenDetails['tokenInfo'] : {}"
                :is-loading="loadingTokenDetails || hasError"
                @errorDetails="emitErrorState"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { reactive, computed, onMounted, ref } from 'vue'
import TokenDetailsList from '@module/tokens/components/TokenDetailsList.vue'
import BigNumber from 'bignumber.js'
import { getTokenInfoByContract, getERC20TokenBalance } from '@app/modules/tokens/handlers/tokenDetails/tokenDetails.graphql'
import { GetErc20TokenBalanceQuery as TokenOwnerInfo, GetTokenInfoByContractQuery as TokenInfo, useGetErc20TokenBalanceQuery, useGetTokenInfoByContractQuery } from '@module/tokens/apollo/tokenDetails.generated'
import { eth } from '@core/helper'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'

const MAX_ITEMS = 10

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    isHolder: {
        type: Boolean,
        required: true
    },
    holderAddress: {
        type: String,
        required: true
    }
})

interface ComponentState {
    address: string
    hasError: boolean
    isNft: boolean
}

const state: ComponentState = reactive({
    address: '',
    hasError: false,
    isNft: true,
})

const emit = defineEmits(['errorDetails'])

onMounted(() => {
    if (!isValid.value) {
        state.hasError = true
        emitErrorState(true, ErrorMessageToken.invalid)
        return
    }
    window.scrollTo(0, 0)
})

const { loading: loadingTokenDetails, onError: onTokenDetailsError, result } = props.isHolder ? useGetErc20TokenBalanceQuery({
    contract: props.addressRef,
    owner: props.holderAddress
}) : useGetTokenInfoByContractQuery({
    contract: props.addressRef
})

onTokenDetailsError((error) => {
    const newError = JSON.stringify(error.message)
    if (newError.includes('Token not found')) {
        emitErrorState(true, ErrorMessageToken.notFound)
    } else {
        emitErrorState(true, ErrorMessageToken.details)
    }
})

const tokenDetails = computed<TokenOwnerInfo | TokenInfo | null>(() => {
    if (result && result.value) {
        return result.value
    }
    return null
})

/*
===================================================================================
COMPUTED PROPERTIES:
===================================================================================
*/

const isValid = computed<boolean>(() => {
    return eth.isValidAddress(props.addressRef)
})

const totalSupply = computed<BigNumber | undefined>(() => {
    if (props.isHolder) {
        return tokenDetails.value?.tokenInfo.totalSupply
    }
    return tokenDetails.value?.tokenInfo ? tokenDetails.value?.tokenInfo.totalSupply : tokenDetails.value?.totalSupply
})

const tokenLabel = computed<string>(() => {
    if (!tokenDetails.value) {
        return tokenLabelDefault.value
    }
    if (symbol.value) {
        return symbol.value.toUpperCase()
    } else if (name.value) {
        return name.value.toUpperCase()
    }
    return tokenLabelDefault.value
})

const tokenLabelDefault = computed<string>(() => {
    const n = props.addressRef.length
    return `Token: ${props.addressRef.slice(0, 4)}...${props.addressRef.slice(n - 4, n)}`
})

const decimals = computed<number | null>(() => {
    return tokenDetails.value?.tokenInfo ? tokenDetails.value?.tokenInfo.decimals : tokenDetails.value?.decimals
})

const symbol = computed<string | null>(() => {
    return tokenDetails.value?.tokenInfo ? tokenDetails.value?.tokenInfo.symbol : tokenDetails.value?.symbol
})

const name = computed<string | null>(() => {
    return tokenDetails.value?.tokenInfo ? tokenDetails.value?.tokenInfo.name : tokenDetails.value?.name
})

/*
===================================================================================
METHODS:
===================================================================================
*/

/**
 * Sets error messages if any
 * @param hasError {Boolean}
 * @param message {ErrorMessageBlock}
 */
const emitErrorState = (val: boolean, message: ErrorMessageToken): void => {
    state.hasError = val
    emit('errorDetails', val, message)
}

const getTokenType = (val: boolean) => {
    state.isNft = val
}
</script>
