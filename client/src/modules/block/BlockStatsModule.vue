<template>
    <v-container>
        <v-row class="fill-height" align-content="center" justify="center">
            <v-col cols="12" sm="6" md="3">
                <v-card color="primary">
                    <v-card-title>Recent Block: {{ blockNumber }} </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
//Vue
//Apollo
import { useQuery, useResult } from '@vue/apollo-composable'
import getLatestBlockInfo from './apollo/blockStats.graphql'

const { result, error, onResult, loading } = useQuery(getLatestBlockInfo)
const blockNumber = useResult(result, null, data => data.getLatestBlockInfo.number)
</script>
