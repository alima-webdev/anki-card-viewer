// Imports
// Preact
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { effect, useSignal, signal } from '@preact/signals';

// Styles
import './styles/styles.css';

// UI
import { PaginationComponent } from "./components/pagination"
import { CardGridComponent, currentCards } from "./components/cardgrid"
import { SearchComponent } from "./components/search"

// Internal
import { ANKI } from './globals';
import { initAPI, performQuery, getCardsInfo, Connector } from './api/api';

// Devtools
import { log } from './devtools';
import { Skeleton } from '@/components/ui/skeleton';
import { EllipsisIcon } from 'lucide-react';
import { Pagination as PaginationElement, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { useWorker, useWorkerAsync } from './api/worker';

export let searchQuery = signal("")
// - Pagination
export let paginationSignal = signal({ current: 0, total: 1 })
export let loading = signal(true)

effect(() => {
	const performEffect = async () => {
		log("signalEffect")
		// Get the search results


		// if (window.Worker) {
		// const myWorker = new Worker("./worker.ts");
		// // }
		// let { cards, totalPages } = await performQuery(searchQuery.value, paginationSignal.value.current)
		// const performQueryOnWorker = (query, currentPage) => {
		// 	return new Promise(async (resolve, reject) => {
		// 		let results = (await Connector.getCardsFromQuery(query, currentPage))
		// 		console.error(results)
		// 		resolve(results)
		// 		// return await performQuery(query, currentPage)
		// 	})
		// }
		// let { cards, totalPages } = await useWorkerAsync(performQueryOnWorker, { Connector: Connector, query: searchQuery.value, currentPage: paginationSignal.value.current })
		// useWorker(performQueryOnWorker, { query: searchQuery.value, currentPage: paginationSignal.value.current }, ({ cards, totalPages }) => {
		// Set the current cards in the page

		let { cards, totalPages } = await performQuery(searchQuery.value, paginationSignal.value.current)
		currentCards.value = cards

		// Setup the pagination signal
		let currentPage = (paginationSignal.value.current > totalPages ? totalPages : paginationSignal.value.current)
		paginationSignal.value.current = currentPage
		paginationSignal.value.total = totalPages

		// Change the loading state
		if (loading.value === true) loading.value = false
		// })

	}
	performEffect()
})

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
	// let searchResults = useSignal([])
	// let resultsPages = useSignal([])
	// let currentCards = useSignal([])
	// let currentCards = []


	// - Modifiers
	// -- Search

	// -- Pagination
	// effect(() => {
	// 	const performEffect = async () => {
	// 		// Get full card info for the cards to be shown in the page
	// 		// Get the search results
	// 		let { cards, totalPages } = await performQuery(searchQuery.value, paginationSignal.value.current)
	// 		currentCards = cards
	// 		// paginationSignal.value = {current: paginationSignal.value.current, total: totalPages }
	// 	}
	// 	performEffect()
	// })

	// Event: Search Form Submission
	const querySubmitEvent = (event: SubmitEvent) => {
		// Get the form data
		const data = new FormData(event.currentTarget as HTMLFormElement);
		// Save the query string to the searchQuery signal, which will trigger the query process
		searchQuery.value = data.get("query") as string
		event.preventDefault()
	}

	// const [loading, setLoading] = useState(true)

	return (
		<main className="grid grid-rows gap-4 m-4">
			{(loading.value ? (
				<>
					<SearchComponent onSubmit={querySubmitEvent} />
					{/* Card Grid Skeleton */}
					<div className="grid grid-cols-3 gap-4">
						<Skeleton className="h-[125px] rounded-xl" />
						<Skeleton className="h-[125px] rounded-xl" />
						<Skeleton className="h-[125px] rounded-xl" />
						<Skeleton className="h-[125px] rounded-xl" />
						<Skeleton className="h-[125px] rounded-xl" />
						<Skeleton className="h-[125px] rounded-xl" />
					</div>
					{/* Pagination Skeleton */}
					<PaginationElement>
						<PaginationContent>

							{/* Current */}
							<PaginationItem>
								<PaginationLink isActive>
									<EllipsisIcon></EllipsisIcon>
								</PaginationLink>
							</PaginationItem>
							
						</PaginationContent>
					</PaginationElement>
				</>
			) : (
				<>
					<SearchComponent onSubmit={querySubmitEvent} />
					<CardGridComponent paginationSignal={paginationSignal} />
					<PaginationComponent paginationSignal={paginationSignal} />
				</>
			))}
		</main>
	);
}

// Render the preact app
render(<App />, document.getElementById('app'));
