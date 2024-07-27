// Imports
// Internal
import { ANKI } from "../globals";
import { getContent, processTags } from "./utils"

// Devtools
import { isDevelopment, log } from "../devtools"
import { currentBaseTag, currentCards, currentQuery, lastSearchResultsReceived, paginationInfo, refreshCardGrid } from "../signals";

class NativeConnector {
    /**
     * Variable used to communicate with the backend API (QWebChannel backend)
     */
    private nativeBackend: QObject;
    private nativeChannel: QWebChannel;
    public ready: boolean = false;

    /**
     * Initiate the API and QWebChannel connection
     * Set APIReady to true when initialization is finished
     */
    async init() {
        // return new Promise((resolve, reject) => {
        this.nativeChannel = await new Promise((resolve, reject) => {
            // @ts-ignore: Missing type defitions for QWebChannel
            new QWebChannel(qt.webChannelTransport, (channel) => {
                this.nativeBackend = channel.objects.backend;

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

                    if (arrayIndexes.length >= 0) {
                        console.warn("change card info")
                        for (let index of arrayIndexes) {
                            currentCards[index].question = updatedNote.question
                            currentCards[index].answer = updatedNote.answer
                        }

                        refreshCardGrid()
                    }
                });

                // Query results returned
                // channel.objects.backend.queryFinished.connect(this.queryResults)
                console.log(channel.objects.backend)
                channel.objects.backend.queryFinished.connect((response) => {
                    lastSearchResultsReceived(JSON.parse(response))
                });
                this.ready = true
                console.warn("READY")
                console.log(this.nativeBackend)
                resolve(channel)
            })
        });
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
async query(query: string = currentQuery, currentPage: number = 0, cardsPerPage: number = paginationInfo.cardsPerPage, baseTag: string = currentBaseTag, categorizeMisc: Boolean = false): Promise<QueryResults> {
        // Perform checks
        if (this.ready == false) {
            console.warn("API not ready")
            return;
        }
        if (query == undefined ||
            currentPage == undefined ||
            cardsPerPage == undefined ||
            baseTag == undefined) {
            console.warn("Missing arguments for the query")
            console.warn(query, currentPage, cardsPerPage, baseTag)
            return;
        }
        
        let payload = {
            query: query,
            currentPage: currentPage,
            cardsPerPage: cardsPerPage,
            baseTag: baseTag,
            categorizeMisc: categorizeMisc
        }
        if (isDevelopment()) {
            console.log("Fn: Native - getCardsFromQuery")
            console.log("Request: ", payload)
        }
        // let queryResults = await new Promise((resolve, reject) => {
        this.nativeBackend.query(JSON.stringify(payload))
        // }) as QueryResults

        // return queryResults
    }

    // async queryResults(response: string) {
    //     lastSearchResultsReceived(JSON.parse(response))
    // }

    /**
     * Edit the card
     * @async
     * @param {noteId} number - Note Id
     * @returns {boolean}
     */
    async editCard(noteId: number) {
        return await new Promise((resolve, reject) => {
            this.nativeBackend.editCard(noteId, (response) => {
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
    async getCardsInfo(cards: BasicCardInfo[]) {
        let ids = cards.map(card => {
            return card.cardId
        }) as number[]

        // Retrieve the card information
        let cardsInfo = await new Promise((resolve, reject) => {
            this.nativeBackend.getCardsInfo(ids, (response) => {
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
    async suspend(cardId: number) {
        return await new Promise((resolve, reject) => {
            this.nativeBackend.suspend(cardId, (response) => {
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
    async unsuspend(cardId: number) {
        return await new Promise((resolve, reject) => {
            this.nativeBackend.unsuspend(cardId, (response) => {
                resolve(response)
            })
        }) as boolean
    }

    async applyGeneratedTags() {
        return await new Promise((resolve, reject) => {
            this.nativeBackend.applyGeneratedTags((response) => {
                resolve(response)
            })
        }) as boolean
    }
}

const Connector = new NativeConnector()

// Export
export default Connector