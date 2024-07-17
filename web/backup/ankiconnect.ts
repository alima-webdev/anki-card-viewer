import { ANKI } from "../globals"
import { getTextContent } from "./utils"

// Tags
export async function getUserTags(baseTag = ANKI.BASE_CATEGORY_TAG) {
    // console.log("getUserTags")
    let tags = Array.from(new Set(
        (await sendRequest({
            action: "getTags",
            version: 6
        } as AnkiConnectRequest) as AnkiConnectResponse).result ?? []
    )).filter((tag: string) => {
        return tag.includes(baseTag)
    })
    return tags
}

export async function getNoteTags(noteId: string, baseTag = "") {
    console.log("getNoteTags")
    let tags = Array.from(new Set(
        (await sendRequest({
            action: "getNoteTags",
            version: 6,
            params: {
                note: noteId
            }
        } as AnkiConnectRequest) as AnkiConnectResponse).result ?? []
    )).filter((tag: string) => {
        return tag.includes(baseTag)
    })
    return tags
}

// Cards
// Get Cards From Query
export async function getCardsFromQuery(query: string): Promise<AnkiConnectResponse> {
    let request = {
        action: "findCards",
        version: 6,
        params: {
            "query": query
        }
    } as AnkiConnectRequest
    let response = await sendRequest(request) as AnkiConnectResponse
    return response
}

// Get Cards Info
export async function getCardsInfo(ids: number[]) {
    let cardsInfo = (await sendRequest({
        action: "cardsInfo",
        version: 6,
        params: {
            "cards": ids
        }
    } as AnkiConnectRequest) as AnkiConnectResponse).result ?? []

    let areSuspended = (await sendRequest({
        action: "areSuspended",
        version: 6,
        params: {
            "cards": ids
        }
    } as AnkiConnectRequest) as AnkiConnectResponse).result ?? []

    if (cardsInfo) {
        cardsInfo.map((card, index) => {
            card.tags = Array.from(new Set(getTextContent(card.answer, "#tags-container").split("\n").map(tag => tag.trim()).filter(tag => tag != "")))
            card.question = getTextContent(card.question, "#text")
            card.answer = getTextContent(card.answer)
            card.isSuspended = areSuspended[index]
            return card
        })
    }

    return cardsInfo
}

// Connection
// Send Request
export async function sendRequest(request: AnkiConnectRequest): Promise<AnkiConnectResponse> {
    let f = await fetch(ANKI.HOST, { method: "POST", body: JSON.stringify(request), headers: { "content-type": "application/json" } })
    return f.json()
}

// Types
export declare type AnkiConnectRequest = {
    action: string,
    version: number,
    params: any
}

export declare type AnkiConnectResponse = {
    result: Array<any>,
    error: any
}

export default {
    getUserTags, getNoteTags, getCardsFromQuery, getCardsInfo, sendRequest
}