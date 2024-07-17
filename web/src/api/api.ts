// Imports
// Globals
import { ANKI } from "../globals"

// Backend Connector
import Connector from "./native"

// Utility Functions
import { sortCardsByTags } from "./utils"

// Devtools
import { log } from "../devtools"

/**
 * Variable that defines if the API has been initiate and is ready for use
 */
export let APIReady = false

/**
 * Initiate the API and QWebChannel connection
 * Set APIReady to true when initialization is finished
 */
export async function initAPI() {
    await Connector.initConnection()
    APIReady = true
}

/**
 * Perform the query based on the string provided in the search field
 *
 * @param {query} string - Search criteria
 * @returns {QueryResults}
 */
export async function performQuery(query: string = ANKI.DEFAULT_SEARCH_QUERY) {
    let cards = (await Connector.getCardsFromQuery(query))
    let cardsClone = cards.slice(0) as BasicCardInfo[]

    cards = sortCardsByTags(cards)

    // Split the ids into 20 block arrays
    let pages = [] as BasicCardInfo[][]
    while (cards.length) {
        const page = cards.splice(0, ANKI.CARDS_PER_PAGE)
        pages.push(page)
    }

    return { cardsBasicInfo: cardsClone, pages: pages } as QueryResults
}

/**
 * Get the "full" card information required for the addon based on the basic information (ids and tags) already retrieved
 * @async
 * @param {cards} BasicCardInfo[] - Cards
 * @returns {Promise<BasicCardInfo[]>}
 */
export async function getCardsInfo(cards: BasicCardInfo[]) {
    return await Connector.getCardsInfo(cards)
}

/**
 * Actions
 */

/**
 * Suspend the card based on its Id
 * @async
 * @param {cardId} number - Id of the card to be suspended
 * @returns {boolean}
 */
export async function suspend(cardId: number) {
    return (await Connector.suspend(cardId))
}
/**
 * Unsuspend the card based on its Id
 * @async
 * @param {cardId} number - Id of the card to be unsuspended
 * @returns {boolean}
 */
export async function unsuspend(cardId: number) {
    return (await Connector.unsuspend(cardId))
}