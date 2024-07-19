// Imports
// Internal
import { ANKI } from "../globals";
import { getContent, processTags } from "./utils"

// Devtools
import { isDevelopment, log } from "../devtools"
import { currentCards, refreshCardGrid } from "../signals";

/**
 * Variable used to communicate with the backend API (QWebChannel backend)
 */
export let nativeBackend;
export let nativeChannel;

/**
 * Initiate the API and QWebChannel connection
 * Set APIReady to true when initialization is finished
 */
export async function initConnection() {
    return new Promise((resolve, reject) => {
        //@ts-ignore: Missing type defitions for QWebChannel
        new QWebChannel(qt.webChannelTransport, (channel) => {
            nativeBackend = channel.objects.backend;

            // Connect to a signal:
            channel.objects.backend.triggerReload.connect(function (card) {

                let newCard = JSON.parse(card)

                if (isDevelopment()) {
                    console.info("Fn: Native - triggerReload (card info edited)")
                    console.info(newCard.cardId, newCard.answer)
                }
                const arrayIndex = currentCards.findIndex(card => {
                    return card.cardId == newCard.cardId
                })
                if (arrayIndex >= 0) {
                    console.warn("change card info")
                    currentCards[arrayIndex].question = newCard.question
                    currentCards[arrayIndex].answer = newCard.answer
                    // currentCards = [...updatedCards]
                    refreshCardGrid()
                }
            });

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
export async function getCardsFromQuery(query: string, currentPage: number, cardsPerPage: number): Promise<QueryResults> {
    let payload = {
        query: query,
        currentPage: currentPage,
        cardsPerPage: cardsPerPage,
        baseTag: ANKI.BASE_CATEGORY_TAG
    }
    if (isDevelopment()) {
        console.info("Fn: Native - getCardsFromQuery")
        console.info(payload)
    }
    let queryResults = await new Promise((resolve, reject) => {
        nativeBackend.getQueryPage(JSON.stringify(payload), (response) => {
            resolve(JSON.parse(response))
        })
    }) as QueryResults

    return queryResults
}

/**
 * Edit the card
 * @async
 * @param {cardId} number - Card Id
 * @returns {boolean}
 */
export async function editCard(cardId: number) {
    return await new Promise((resolve, reject) => {
        nativeBackend.editCard(cardId, (response) => {
            resolve(response)
        })
    }) as boolean
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
    initConnection, getCardsFromQuery, getCardsInfo, suspend, unsuspend, editCard
}