import { signal } from "@preact/signals"
// import { performQuery } from "./api/api"
import { ANKI } from "./globals"
import { isDevelopment } from "./devtools"
import Connector from "./api/api"

// Signals to trigger refresh
export let willRefreshCardGrid = signal(false)
export let willRefreshPagination = signal(false)

// Global variables
export let currentQuery = ANKI.DEFAULT_SEARCH_QUERY
export let currentCards = []
export let paginationInfo = {
    current: 0,
    total: 1,
    cardsPerPage: ANKI.CARDS_PER_PAGE,
    totalCards: 0,
}
export let currentBaseTag = ANKI.BASE_CATEGORY_TAG
export let currentCategorizeMisc = ANKI.CATEGORIZE_MISC
export let currentCategorizeMiscDepth = ANKI.CATEGORIZE_MISC_DEPTH
export let currentCategorizeMiscThreshold = ANKI.CATEGORIZE_MISC_SIMILARITY

// TEST
export let loading = signal(false)
// END - TEST

// Actions
export const refreshCardGrid = () => {
    willRefreshCardGrid.value = !willRefreshCardGrid.value
}

export const refreshPagination = () => {
    willRefreshPagination.value = !willRefreshPagination.value
}

export const performSearch = async (
    query: string,
    cardsPerPage: number = paginationInfo.cardsPerPage,
    baseTag: string = currentBaseTag,
    categorizeMisc: boolean = false,
    categorizeMiscDepth: number = currentCategorizeMiscDepth,
    categorizeMiscThreshold: number = currentCategorizeMiscThreshold,
    force: boolean = false) => {
    if(isDevelopment()) {
        console.log("PERFORM SEARCH")
        console.log(query, cardsPerPage, baseTag, categorizeMisc)
    }

    // Prevent query execution if it is the same as the current query, currentPage, and cardsPerPage
    if(query == currentQuery &&
        cardsPerPage == paginationInfo.cardsPerPage &&
        baseTag == currentBaseTag &&
        categorizeMisc == currentCategorizeMisc &&
        categorizeMiscDepth == currentCategorizeMiscDepth &&
        categorizeMiscThreshold == currentCategorizeMiscThreshold &&
        force == false
    ) {
        return;
    }

    // Loading state
    loading.value = true

    let currentPage = 0

    // Set the selected signal variables
    currentQuery = query
    paginationInfo.current = currentPage
    paginationInfo.cardsPerPage = cardsPerPage
    currentBaseTag = baseTag
    currentCategorizeMisc = categorizeMisc
    currentCategorizeMiscDepth = categorizeMiscDepth
    currentCategorizeMiscThreshold = categorizeMiscThreshold

    // Get the current cards in the page
    Connector.query(query, currentPage, cardsPerPage, baseTag, categorizeMisc, categorizeMiscDepth, categorizeMiscThreshold)
}

export const lastSearchResultsReceived = ({ cards, totalPages, totalCards }) => {

    // Set the signal variables returned from the backend
    currentCards = cards
    paginationInfo.total = totalPages
    paginationInfo.totalCards = totalCards

    if(isDevelopment()) {
        console.info("Fn: Signals - lastSearchResultsReceived")
        console.info(cards, paginationInfo)
    }

    document.body.scrollTop = 0

    loading.value = false

    // Rerender the involved components
    refreshCardGrid()
    refreshPagination()
}

export const changePage = async (page: number) => {

    // Ensure the selected page is within range
    if(isNaN(page) || page < 0 || page >= paginationInfo.total) return;

    // Loading state
    loading.value = true

    let query = currentQuery
    let currentPage = page
    let cardsPerPage = paginationInfo.cardsPerPage
    let baseTag = currentBaseTag

    paginationInfo.current = currentPage

    if(isDevelopment()) {
        console.info("Fn: Signals - changePage")
        // console.info(paginationInfo)
    }
    Connector.query(query, currentPage, cardsPerPage, baseTag, currentCategorizeMisc, currentCategorizeMiscDepth)
}