import { useNewBlockFeedSubscription } from './newBlockFeed.generated'

export function useBlockSubscription() {
    const { onResult } = useNewBlockFeedSubscription()
    return {
        onNewBlockLoaded: onResult
    }
}
