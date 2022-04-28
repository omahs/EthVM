import { NewBlockFeedSubscription as NewBlockFeedType } from './newBlockFeed.generated'
import newBlockFeed from './newBlockFeed.graphql'
import { useSubscription } from '@vue/apollo-composable'
import { ref } from 'vue'

export function useBlockSubscription() {
    const { onResult } = useSubscription(newBlockFeed)
    return {
        onNewBlockLoaded: onResult
    }
}
