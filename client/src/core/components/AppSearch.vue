<template>
    <v-row align-content="end" justify="end" no-gutters>
        <v-col cols="3">
            <v-select v-model="select" :items="props.selectItems" />
        </v-col>
        {{ hel }}
        <v-col>
            <v-combobox
                v-model="search.value"
                :loading="isLoading"
                :items="props.items"
                label="Search for an option"
                item-value="contract"
                item-text="keyword"
                hide-no-data
                clearable
                @keyup.enter="onSearch"
                @click:clear="search.value = ''"
                @change="onSelect"
            ></v-combobox>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { PropType } from 'vue'
import { defineProps, defineEmits, reactive, computed, ref, watch } from 'vue'

interface SearchProps {
    // selectItems: any[]
    // items?: any[]
    isLoading: boolean
    // hasError: boolean
}
interface Hello {
    hello: string
}
// const {
//     // selectItems = ['All', 'Address', 'Transaction', 'Transaction', 'Token', 'Block'],
//     // items = [],
//     isLoading = true,

//     hasError = false
// } = defineProps()
const props = defineProps({
    // selectItems = ['All', 'Address', 'Transaction', 'Transaction', 'Token', 'Block'],
    // items = [],
    isLoading: {
        type: Boolean,
        default: true
    },
    b: {
        type: Array as PropType<number[]>,
        required: true,
        default: () => ['hello']
    }
})
//     // hasError = false
// })

const a: Hello = {}
// const { isLoading = 65 } = defineProps<SearchProps>()

const emit = defineEmits<{
    (e: 'getAllSearch', value: string): void
    (e: 'onSelectChange', value: string): void
    (e: 'routeTo', page: string, value: string): void
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

const selectTypes = ['all', 'token-detail']

const select: Ref<string> = ref(selectTypes[0])
/**
 * Emits received value to parent
 * @param param {Any}
 */
const onSelect = (param: string): void => {
    emit('onSelectChange', param)
}
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

watch(
    () => search.autocomplete,
    newVal => {
        if (newVal && (search.value === selectTypes[0] || search.value === selectTypes[1])) {
            emit('getAllSearch', newVal)
        }
    }
)

/**
 * Emits received value to parent
 * @param param {Any}
 */
const onSearch = (param: string): void => {
    if (select.value === selectTypes[0]) {
        clearTimeout(search.timeout)
        search.timeout = window.setTimeout(() => {
            emit('getAllSearch', search.value)
        }, 500)
    } else {
        search.timeout = window.setTimeout(() => {
            emit('routeTo', select.value, search.value)
        }, 500)
    }
}

/**
 * Resets search and selected values
 */
const resetValues = (): void => {
    search.value = ''
    select.value = selectTypes[0]
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
</script>
<style lang="scss">
.module-search {
    .search-input-container {
        height: 48px;
        .search-select {
            height: 100%;
            max-width: 117px;
            padding-top: 0;

            .v-input__control {
                .v-input__slot {
                    border: 1px solid #b5c0d3 !important;
                    border-radius: 2px 0 0 2px;
                    min-height: 48px;
                    padding-left: 20px;

                    .v-icon {
                        font-size: 12px;
                        padding-right: 15px;
                    }
                }
                .v-input__slot:before {
                    border: none;
                }

                .v-select__slot {
                    .v-label {
                        font-size: 14px;
                    }
                }
            }
        }

        .v-text-field {
            .v-input__slot {
                border-bottom: 1px solid #b5c0d3 !important;
                border-top: 1px solid #b5c0d3 !important;
                border-right: 1px solid #b5c0d3 !important;
                border-radius: 0;
                font-size: 14px;

                .v-icon {
                    font-size: 16px;
                }
            }
        }
    }

    .search-button-container {
        max-width: 115px !important;

        .search-button {
            border-radius: 0 2px 2px 0;
        }
    }
}
</style>
