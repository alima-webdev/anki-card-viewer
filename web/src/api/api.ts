// Imports
// Globals
import { ANKI } from "../globals"

// Backend Connector
import Connector from "./native"

// Utility Functions
import { sortCardsByTags } from "./utils"

// Devtools
import { log } from "../devtools"
import { currentQuery, loading, paginationInfo } from "../signals"

/**
 * Initiate the API and QWebChannel connection
 * Set APIReady to true when initialization is finished
 */
export async function initAPI() {
    // await Connector.initConnection()
    await Connector.init()
}

/**
 * Perform the query based on the string provided in the search field
 *
 * @param {query} string - Search criteria
 * @returns {QueryResults}
 */
export async function performQuery(query: string, currentPage: number, cardsPerPage: number, baseTag: string, categorizeMisc: Boolean = false, categorizeMiscDepth: number = 4) {
    return (await Connector.query(query, currentPage, cardsPerPage, baseTag, categorizeMisc, categorizeMiscDepth))
}

/**
 * Edit the card
 *
 * @param {noteId} string - Note Id
 * @returns {QueryResults}
 */
export async function editCard(noteId: number) {
    return (await Connector.editCard(noteId))
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

export async function applyGeneratedTags() {
    return await Connector.applyGeneratedTags()
}

export {
    Connector
}