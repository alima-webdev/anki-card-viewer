// Imports
// Preact
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { effect, signal } from '@preact/signals';
import { Suspense } from 'preact/compat';

// Styles
import './styles/styles.css';

// UI
import { PaginationComponent } from "./components/pagination"
import { CardGridComponent, currentCards } from "./components/cardgrid"
import { SearchComponent } from "./components/search"

// Internal
import { ANKI } from './globals';
import { initAPI, performQuery } from './api/api';

// Devtools
import { isDevelopment, log } from './devtools';
import { paginationInfo, performSearch } from './signals';

// Signals
// export let searchQuery = signal("")
// export let paginationSignal = signal({ current: 0, total: 1 })
// export let refreshPagination = signal(false)
// export let loading = signal(true)
// export let triggerSignalChange = signal(true)

// effect(() => {
// 	const performEffect = async () => {

// 		console.log("EFF")
// 		const forceSignalChange = triggerSignalChange.value

// 		loading.value = true

// 		// Get the current cards in the page
// 		let { cards, totalPages } = await performQuery(searchQuery.value, paginationSignal.value.current)
// 		currentCards.value = cards

// 		// Setup the pagination signal
// 		let currentPage = (paginationSignal.value.current > totalPages ? totalPages : paginationSignal.value.current)
// 		paginationSignal.value.current = currentPage
// 		paginationSignal.value.total = totalPages

// 		refreshPagination.value = !refreshPagination.value

// 		// Change the loading state
// 		if (loading.value === true) loading.value = false

// 	}
// 	performEffect()
// })

/**
 * Main app component
 *
 * @returns {Component}
 */
export function App() {

    // const [loading, setLoading] = useState(true)

    // Init the signals and start the API
    useEffect(() => {
        const performEffect = async () => {
            await initAPI()
            performSearch(ANKI.DEFAULT_SEARCH_QUERY, ANKI.CARDS_PER_PAGE)
        }
        performEffect()
    }, [])

    return (
        <main className="grid grid-rows gap-4 m-4 dark:dark">
            <Suspense fallback={<div>LOADING</div>}>
                <SearchComponent />
                <CardGridComponent />
                <PaginationComponent />
            </Suspense>
        </main>
    );
}

// Render the preact app
render(<App />, document.getElementById('app'));
