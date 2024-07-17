// Imports
// Internal
import { getContent, processTags } from "./utils"

// Devtools
import { log } from "../devtools"

/**
 * Variable used to communicate with the backend API (QWebChannel backend)
 */
let nativeBackend;

/**
 * Initiate the API and QWebChannel connection
 * Set APIReady to true when initialization is finished
 */
export async function initConnection() {
    return new Promise((resolve, reject) => {
        //@ts-ignore: Missing type defitions for QWebChannel
        new QWebChannel(qt.webChannelTransport, (channel) => {
            nativeBackend = channel.objects.backend;
            resolve(true)
        });
    })
}

/**
 * Card Functions
 */

/**
 * Perform the query and get basic card information (ids and tags)
 * @async
 * @param {query} string - Search criteria
 * @returns {Promise<BasicCardInfo[]>}
 */
export async function getCardsFromQuery(query: string): Promise<BasicCardInfo[]> {
    let cards = await new Promise((resolve, reject) => {
        nativeBackend.findCards(query, (response) => {
            let responseObj = JSON.parse(response)
            resolve(responseObj)
        })
    })
    return cards as BasicCardInfo[]
}

/**
 * Get the "full" card information required for the addon based on the basic information (ids and tags) already retrieved
 * @async
 * @param {cards} BasicCardInfo[] - Cards
 * @returns {Promise<BasicCardInfo[]>}
 */
export async function getCardsInfo(cards: BasicCardInfo[]) {
    let ids = cards.map(card => {
        return card.cardId
    }) as number[]

    // Retrieve the card information
    let cardsInfo = await new Promise((resolve, reject) => {
        nativeBackend.getCardsInfo(ids, (response) => {
            let responseObj = JSON.parse(response)
            resolve(responseObj)
        })
    }) as CardInfo[]
    // Check if the information was successfully retrieved
    if (cardsInfo) {

        // Get the text content of the question and answer fields
        cardsInfo.map((card, index) => {
            card.question = getContent(card.question, "#text")
            card.answer = getContent(card.answer)
            return card
        })

        // Process the tags
        cardsInfo = processTags(cardsInfo)
    }

    return cardsInfo
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
    return await new Promise((resolve, reject) => {
        nativeBackend.suspend(cardId, (response) => {
            resolve(response)
        })
    }) as boolean
}

/**
 * Unsuspend the card based on its Id
 * @async
 * @param {cardId} number - Id of the card to be unsuspended
 * @returns {boolean}
 */
export async function unsuspend(cardId: number) {
    return await new Promise((resolve, reject) => {
        nativeBackend.unsuspend(cardId, (response) => {
            resolve(response)
        })
    }) as boolean
}

// Export
export default {
    initConnection, getCardsFromQuery, getCardsInfo, suspend, unsuspend
}