<template>
    <v-row align-content="end" justify="end" no-gutters>
        <v-col cols="4">
            <v-select v-model="select" :items="props.selectItems" @change="onSearch" />
        </v-col>
        <v-col>
            <!-- <v-text-field
            v-model="message2"
            label="Contained"
            variant="contained"
            clearable
            clear-icon="mdi-delete"
          ></v-text-field> -->
            <v-text-field
                v-model="search.value"
                label="Search Address, Tx, Block"
                clearable
                dense
                :error-messages="errorMes"
                :loading="props.isLoading"
                @click:clear="resetValues"
                @update:modelValue="onSearch"
            ></v-text-field>
            <!-- <v-combobox
                v-model=""
                :loading="isLoading"
                :items="props.items"
                label=""
                item-value="contract"
                item-text="keyword"
                :error="true"
                hide-no-data
                clearable
                @keyup.enter="onSearch"
                @click:clear="search.value = ''"
            ></v-combobox> -->
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { PropType } from 'vue'
import { defineProps, defineEmits, reactive, computed, ref, watch } from 'vue'

const props = defineProps({
    selectItems: {
        type: Array as PropType<string[]>,
        required: true
    },
    isLoading: {
        type: Boolean,
        default: true
    },
    hasError: {
        type: Boolean
    }
})

const emit = defineEmits<{
    (e: 'onSearch', searchValue: string, filterValue: string | undefined): void
    // (e: 'onSearchWithFilter', searchValue: string, filterValue): void
    // (e: 'routeTo', page: string, value: string): void
}>()
/*
  ===================================================================================
    Props
  ===================================================================================
  */
/*
  ===================================================================================
    Select
  ===================================================================================
  */

// const selectTypes = ['all', 'token-detail']

const select = ref(props.selectItems[0])

/*
  ===================================================================================
    Search
  ===================================================================================
  */
interface Search {
    autocomplete: string
    timeout: number
    value: string
}

const search: Search = reactive({ autocomplete: '', timeout: 0, value: '' })

// watch(
//     () => search.autocomplete,
//     newVal => {
//         onSearch()
//         console.log(select.value)
//     }
// )

/**
 * Emits received value to parent
 * @param param {Any}
 */
const onSearch = (): void => {
    search.timeout = window.setTimeout(() => {
        emit('onSearch', search.value, select.value)
    }, 500)
}

/**
 * Resets search
 */
const resetValues = (): void => {
    clearTimeout(search.timeout)
    emit('onSearch', search.value, select.value)
}

/*
  ===================================================================================
    Computed Values
  ===================================================================================
  */
const getIcon = computed<string>(() => {
    return ''
    // return !props.hasError ? 'fa fa-search grey--text text--lighten-1 pr-4 pl-4' : 'fa fa-search error--text pr-4 pl-4'
})

/* TEMP SOLUTIONS: SINCE VUETIFY ERROR STATE IS BROKEN */
const errorMes = computed<string>(() => {
    return props.hasError ? 'ERROR: INVALID SEARCH' : ''
})
</script>
<style lang="scss"></style>
