// Imports
// Preact
import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { effect, useSignal } from '@preact/signals';

// Styles
import './styles/styles.css';

// UI
import { PaginationComponent } from "./components/pagination"
import { CardGridComponent } from "./components/cardgrid"
import { SearchComponent } from "./components/search"

// Internal
import { ANKI } from './globals';
import { initAPI, performQuery, getCardsInfo } from './api/api';

// Devtools
import { log } from './devtools';

export function Cloze({ children }) {
	return (
		<span class="bg-black">{children}</span>
	)
}

/**
 * Main app component
 *
 * @returns {Component}
 */
export function App() {

	// Init the signals and start the API
	useEffect(() => {
		const performEffect = async () => {
			await initAPI()
			searchQuery.value = ANKI.DEFAULT_SEARCH_QUERY
		}
		performEffect()
	}, [])

	// Signals
	// - Search
	let searchQuery = useSignal("")
	let searchResults = useSignal([])
	let resultsPages = useSignal([])
	let currentCards = useSignal([])

	// - Pagination
	let paginationSignal = useSignal({ current: 0, total: 1 })

	// - Modifiers
	// -- Search
	effect(() => {
		const performEffect = async () => {
			// Get the search results
			let { cardsBasicInfo, pages }: any = await performQuery(searchQuery.value)

			// Save them to their respective signals
			searchResults.value = cardsBasicInfo
			resultsPages.value = pages

			// Setup the pagination signal
			paginationSignal.value = { current: 0, total: pages.length }
		}
		performEffect()
	})
	
	// -- Pagination
	effect(() => {
		const performEffect = async () => {
			// Get full card info for the cards to be shown in the page
			currentCards.value = (await getCardsInfo(resultsPages.value[paginationSignal.value.current])) as []
		}
		performEffect()
	})

	// Event: Search Form Submission
	const querySubmitEvent = (event: SubmitEvent) => {
		// Get the form data
		const data = new FormData(event.currentTarget as HTMLFormElement);
		// Save the query string to the searchQuery signal, which will trigger the query process
		searchQuery.value = data.get("query") as string
		event.preventDefault()
	}

	return (
		<main className="grid grid-rows gap-4 m-4">
			<SearchComponent onSubmit={querySubmitEvent} />
			<CardGridComponent currentCards={currentCards} paginationSignal={paginationSignal} />
			<PaginationComponent paginationSignal={paginationSignal} />
		</main>
	);
}

// Render the preact app
render(<App />, document.getElementById('app'));
