// Imports
// Internal
import { ANKI } from "../globals";
import { getContent, processTags } from "./utils"

// Devtools
import { isDevelopment, log } from "../devtools"
import { currentCards, lastSearchResultsReceived, refreshCardGrid } from "../signals";

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
            channel.objects.backend.finishedEditing.connect(function (note) {
                console.log("Fn: Native - finishedEditing (card info edited)")

                let updatedNote = JSON.parse(note)

                if (isDevelopment()) {
                    console.log("Fn: Native - finishedEditing (card info edited)")
                    console.info(updatedNote)
                    console.info(updatedNote.noteId, updatedNote.answer)
                }
                const arrayIndexes = currentCards.map((card, index) => {
                    if (card.noteId == updatedNote.noteId) {
                        return index
                    }
                }).filter(Number.isInteger)
                console.info(arrayIndexes)
                if (arrayIndexes.length >= 0) {
                    console.warn("change card info")
                    for (let index of arrayIndexes) {
                        console.log(index)
                        currentCards[index].question = updatedNote.question
                        currentCards[index].answer = updatedNote.answer
                    }
                    // currentCards = [...updatedCards]
                    refreshCardGrid()
                }
            });


            channel.objects.backend.queryFinished.connect((response) => {
                lastSearchResultsReceived(JSON.parse(response))
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
export async function getCardsFromQuery(query: string, currentPage: number, cardsPerPage: number, baseTag: string): Promise<QueryResults> {
    let payload = {
        query: query,
        currentPage: currentPage,
        cardsPerPage: cardsPerPage,
        baseTag: baseTag
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
 * @param {noteId} number - Note Id
 * @returns {boolean}
 */
export async function editCard(noteId: number) {
    return await new Promise((resolve, reject) => {
        nativeBackend.editCard(noteId, (response) => {
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