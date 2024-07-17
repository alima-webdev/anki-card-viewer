import { computed, effect, signal, useComputed } from "@preact/signals";
import { ANKI } from "./globals"
import { APIReady, performQuery,get getCardsInfo, initAPI } from "./api/api";
import { Search } from "lucide-react";
import { log } from "./devtools";
import { SearchQuery, SearchResults } from "./components/search";

// Tags
export let tags;

// Mutable Signals
// Pagination
type PaginationSignal = {
	current: number,
	total: number
}
export let Pagination = signal({
	current: 0,
	total: 1
} as PaginationSignal)

// Search Query
// export let SearchResults = signal([])
export let SearchPages = signal([])

export async function initSignals() {
	// Get all tags
	// if (!tags) tags = await getUserTags()
	// log(tags)

	const query = SearchQuery.value
	let { cardIds, pages } = await performQuery(query)

	// Get tags for each note
	// for (let id in cardIds) {
		// console.log(getNoteTags(id))
	// }
	SearchResults.value = cardIds
	SearchPages.value = pages
	Pagination.value = { current: 0, total: pages.length }
	await updateCards()
}
// computed(async () => {
// 	const query = SearchQuery.value
// 	let { cardIds, pages } = await performQuery(query)

// 	// Get tags for each note
// 	for (let id in cardIds) {
// 		// console.log(getNoteTags(id))
// 	}
// 	SearchResults.value = cardIds
// })

computed(() => {
	initSignals()
	/*
	log("effect")
	log(APIReady)

	// const performEffect = async () => {
	log("performEffect")

	// Get all tags
	if (!tags) tags = await getUserTags()
	log(tags)

	const query = SearchQuery.value
	let { cardIds, pages } = await performQuery(query)

	// Get tags for each note
	for (let id in cardIds) {
		// console.log(getNoteTags(id))
	}
	SearchResults.value = cardIds
	SearchPages.value = pages
	Pagination.value = { current: 0, total: pages.length }
	await updateCards()
	// }
	// if (!APIReady) {
	// 	initAPI(async () => {
	// 		log("initAPI Callback")
	// 		await performEffect()
	// 	})
	// } else {
	// performEffect()
	// }
	*/
})

// effect(() => {
// 	log("effect2")
// 	log(APIReady)
// 	if (!APIReady) return

// 	const performEffect = async () => {
// 		updateCards()
// 	}
// 	performEffect()
// })

// Calculated Variables
// Loaded Cards
type AnkiCard = {
	cardId: string,
	question: string,
	answer: string,
	isSuspended: boolean,
	tags: string[],
}

export let Cards = signal([] as AnkiCard[]);

async function updateCards() {
	const cardIds = SearchPages.value[Pagination.value.current]
	const info = (await getCardsInfo(cardIds)) as AnkiCard[]
	Cards.value = info
}
