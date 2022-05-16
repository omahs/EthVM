<template>
    <v-card color="transparent" flat>
        <v-container grid-list-xs pa-1>
            <v-row row align="center" justify="end" fill-height class="flex-nowrap">
                <!--
                =====================================================================================
                  First Item Button
                =====================================================================================
                -->
                <v-btn
                    variant="outlined"
                    color="primary"
                    :disabled="currentPage === 0"
                    flat
                    class="bttnGrey info--text text-capitalize bttn"
                    small
                    @click="setPageOnClick('first')"
                >
                    <v-icon class="secondary--text fas fa-angle-double-left" small>mdi-chevron-double-left</v-icon>
                </v-btn>
                <!--
                =====================================================================================
                  Prev Item Button
                =====================================================================================
                -->
                <v-btn
                    variant="outlined"
                    color="primary"
                    :disabled="currentPage === 0"
                    flat
                    class="bttnGrey info--text text-capitalize bttn"
                    small
                    @click="setPageOnClick('prev')"
                >
                    <v-icon class="secondary--text fas fa-angle-left" small>mdi-chevron-left</v-icon>
                </v-btn>
                <!--
                =====================================================================================
                  Current Pages Text
                =====================================================================================
                -->
                <p class="info--text pr-1">{{ textDisplay }}</p>
                <!--
                =====================================================================================
                  Next Item Button
                =====================================================================================
                -->
                <v-btn
                    variant="outlined"
                    color="primary"
                    :disabled="disableNext"
                    flat
                    class="bttnGrey info--text text-capitalize bttn"
                    small
                    @click="setPageOnClick('next')"
                    ><v-icon class="secondary--text fas fa-angle-right" small>mdi-chevron-right</v-icon>
                </v-btn>
                <!--
                =====================================================================================
                  Last Item Button
                =====================================================================================
                -->
                <v-btn
                    v-if="state.hasLast"
                    variant="outlined"
                    color="primary"
                    :disabled="disableNext"
                    flat
                    class="bttnGrey info--text text-capitalize bttn caption"
                    small
                    @click="setPageOnClick('last')"
                    ><v-icon class="secondary--text fas fa-angle-double-right" small>mdi-chevron-double-right</v-icon>
                </v-btn>
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import BN from 'bignumber.js'
import { reactive, computed } from 'vue'

const emit = defineEmits(['newPage'])

/*
 * =======================================================
 * PROPS
 * =======================================================
 */
const props = defineProps({
    hasMore: Boolean,
    loading: Boolean,
    currentPage: Number
})

/*
 * =======================================================
 * REFS
 * =======================================================
 */
interface Reactive {
    hasLast: boolean
    lastPageLoad: number
}
const state: Reactive = reactive({
    hasLast: false,
    lastPageLoad: 0
})

/*
 * =======================================================
 * METHODS
 * =======================================================
 */

/**
 * Emit event to parent component/view with updated page number.
 *
 * @param  {Number} - Page to emit to parent
 */
const emitNewPage = (page: number): void => {
    emit('newPage', page)
}

/**
 * On pagination button click, emit updated page number to parent component/view
 *
 * @param {String} value - Name of action to perform
 */
const setPageOnClick = (value: string): void => {
    switch (value) {
        case 'first':
            emitNewPage(0)
            break
        case 'prev':
            emitNewPage(Math.max(0, props.currentPage - 1))
            break
        case 'next':
            emitNewPage(Math.min(lastPage.value, props.currentPage + 1))
            break
        case 'last':
            emitNewPage(state.lastPageLoad)
            break
        default:
            break
    }
}

/*
 * =======================================================
 * COMPUTED
 * =======================================================
 */

/**
 * Returns Text for the total pages near the input
 *
 * @returns {string}
 */
const showText = computed<string>(() => {
    return `of ${new BN(props.total).toFormat()}`
})

/**
 * Determine if an given @number is within the valid page range.
 *
 * @return {Boolean}
 */
const isValidPageDisplay = computed<boolean>(() => {
    return !state.isError
})

/**
 * Display tooltip if totalPages >= 1k
 *
 * @return {string | undefined} - string IF totalPages >= 1k, undefined otherwise
 */
const hasTotalTooltip = computed<string | undefined>(() => {
    return props.total >= 1e3 ? new BN(props.total).toFormat() : undefined
})

/**
 * Property this.total is a human-readable number/length as opposed to a zero-based number.
 * The last possible page is zero-based, so this translates the human-readable number into zero-based
 *
 * @returns {number}
 */
const lastPage = computed<number>(() => {
    return props.total - 1
})

const inputMask = computed<string>(() => {
    let mask = '#'
    while (mask.length != props.total.toString().length) {
        mask += '#'
    }
    return mask
})

/**
 * Returns Class name of the input width
 * Determines width of the input accordign to the total page size
 *
 * @returns {string}
 */
const disableNext = computed<boolean>(() => {
    if (props.loading) {
        return true
    }
    if (this.hasLast) {
        return props.currentPage === state.lastPageLoad
    }
    return false
})
</script>

<style scoped lang="scss">
.v-btn {
    height: 30px;
    min-width: 20px;
    margin: 5px;
}

.x-sm {
    max-width: 2em;
}
.sm {
    max-width: 3em;
}
.md {
    max-width: 5em;
}
.lg {
    max-width: 8em;
}

p {
    margin: 0;
    padding: 0;
}
.total-p {
    white-space: nowrap;
}
</style>
