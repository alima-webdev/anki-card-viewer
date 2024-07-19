import { signal } from "@preact/signals"
import { performQuery } from "./api/api"
import { ANKI } from "./globals"
import { isDevelopment } from "./devtools"

// Signals to trigger refresh
export let willRefreshCardGrid = signal(false)
export let willRefreshPagination = signal(false)

// Global variables
export let currentQuery = ""
export let currentCards = []
export let paginationInfo = {
    current: 0,
    total: 1,
    cardsPerPage: 30
}

// Actions
export const refreshCardGrid = () => {
    willRefreshCardGrid.value = !willRefreshCardGrid.value
}

export const refreshPagination = () => {
    willRefreshPagination.value = !willRefreshPagination.value
}

export const performSearch = async (query: string, cardsPerPage = ANKI.CARDS_PER_PAGE) => {
    let currentPage = 0

    // Get the current cards in the page
    let { cards, totalPages } = await performQuery(query, currentPage, cardsPerPage)

    // Set the signal variables
    currentQuery = query

    currentCards = cards

    paginationInfo.current = currentPage
    paginationInfo.total = totalPages
    paginationInfo.cardsPerPage = cardsPerPage

    if(isDevelopment()) {
        console.info("Fn: Signals - performSearch")
        console.info(cards, paginationInfo)
    }

    // Rerender the involved components
    refreshCardGrid()
    refreshPagination()
}

export const changePage = async (page: number) => {

    // Ensure the selected page is within range
    if(isNaN(page) || page < 0 || page >= paginationInfo.total) return;

    let query = currentQuery
    let currentPage = page
    let cardsPerPage = paginationInfo.cardsPerPage

    let { cards } = await performQuery(query, currentPage, cardsPerPage)

    // Set the signal variables
    currentCards = cards
    paginationInfo.current = currentPage

    if(isDevelopment()) {
        console.info("Fn: Signals - changePage")
        console.info(cards, paginationInfo)
    }

    refreshCardGrid()
    refreshPagination()
}

// export const performSearch = async (query: string, page: number = 0, cardsPerPage = ANKI.CARDS_PER_PAGE) => {
//     // Get the current cards in the page
//     let { cards, totalPages } = await performQuery(query, page)
    
//     // Setup the pagination signal
//     let currentPage = (page > totalPages ? totalPages : page)

//     // Set the signal variables
//     currentQuery = query
//     currentCards = cards
//     paginationInfo.current = currentPage
//     paginationInfo.total = totalPages

//     // Rerender the involved components
//     refreshCardGrid()
//     refreshPagination()
// }