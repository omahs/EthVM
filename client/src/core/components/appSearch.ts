import type { Ref } from 'vue'
import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export function useAppSearch() {
    // state encapsulated and managed by the composable
    const isLoadingAppSearch: Ref<boolean> = ref(true)
    const hasErrorAppSearch: Ref<boolean> = ref(false)

    // a composable can update its managed state over time.
    //   function update(event) {
    //     x.value = event.pageX
    //     y.value = event.pageY
    //   }

    // a composable can also hook into its owner component's
    // lifecycle to setup and teardown side effects.
    //   onMounted(() => window.addEventListener('mousemove', update))
    //   onUnmounted(() => window.removeEventListener('mousemove', update))

    // expose managed state as return value
    return { isLoadingAppSearch }
}
