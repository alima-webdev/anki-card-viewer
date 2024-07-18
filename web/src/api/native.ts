// Imports
// Internal
import { ANKI } from "../globals";
import { getContent, processTags } from "./utils"

// Devtools
import { log } from "../devtools"
import { searchQuery } from "../index";
import { currentCards } from "../components/cardgrid";

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
                // This callback will be invoked whenever the signal is emitted on the C++/QML side.
                let newCard = JSON.parse(card)
                let updatedCards = [...currentCards.value]
                const arrayIndex = updatedCards.findIndex(card => {
                    return card.cardId == newCard.cardId
                })
                if(arrayIndex >= 0) {
                    updatedCards[arrayIndex].question = newCard.question
                    updatedCards[arrayIndex].answer = newCard.answer
                    currentCards.value = [...updatedCards]
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
export async function getCardsFromQuery(query: string, currentPage: number): Promise<QueryResults> {
    // log("getCardsFromQuery")
    let queryResults = await new Promise((resolve, reject) => {
        nativeBackend.getQueryPage(JSON.stringify({
            query: query,
            currentPage: currentPage,
            cardsPerPage: ANKI.CARDS_PER_PAGE,
            baseTag: ANKI.BASE_CATEGORY_TAG
        }), (response) => {
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