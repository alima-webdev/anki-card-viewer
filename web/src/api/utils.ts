// Imports
// Globals
import { ANKI } from "../globals"

// Devtools
import { log } from "../devtools";
import { currentBaseTag } from "../signals";

// Get Text Content

/**
 * DOM parser used in the getContent function, which strips out the HTML code from a string
 */
const parser = new DOMParser();

/**
 * Strips out the HTML code from a string
 *
 * @param {htmlString} string - HTML string to be processed
 * @param {querySelector} string - The querySelector property of the element from which the function will obtain the textContent value
 * @returns {string}
 */
export function getContent(htmlString: string, querySelector: string = "#text") {

    let content = ""

    // Parse the string
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Remove all <img> tags
    let imgTags = doc.getElementsByTagName('img');
    while (imgTags.length > 0) {
        imgTags[0].parentNode.removeChild(imgTags[0]);
    }

    // Remove all <video> tags
    let videoTags = doc.getElementsByTagName('video');
    while (videoTags.length > 0) {
        videoTags[0].parentNode.removeChild(videoTags[0]);
    }

    // Get the querySelector tag
    if (doc.body.querySelector(querySelector)) {
        content = ((doc.body.querySelector(querySelector) as HTMLElement).innerHTML || "").trim();
    }

    return content;
}


/**
 * Parse tag making it more readable
 *
 * @param {tag} string - Tag
 * @returns {string}
 */
export function parseTag(tag: string, stripBaseTag = true) {
    let newTag = tag
    if (stripBaseTag == true) {
        newTag = newTag.replace(new RegExp(`${currentBaseTag}`, "g"), "")
    }
    newTag = newTag
        .replace(new RegExp('^::+|::+$', 'g'), '')
        .replace(/["_"]/g, " ")
        .replace(/::/g, " → ")
    return newTag
}

/**
 * Parse the card content (e.g., images)
 *
 * @param {content} string - HTML content
 * @returns {string}
 */
export function parseCardContent(content: string) {
<<<<<<< HEAD
    // return content.replaceAll(/<img.*?src="([^"]*)"[^>]*>(?:<\/img>)?/gmi, )
=======
    // return content.replaceAll(/<img.*?src="([^"]*)"[^>]*>(?:<\/img>)?/gmi, "IMG")
    // return content.replace(/\<|\>/gmi, "")
>>>>>>> f7dfa4d (Stable)
    return content
}

/**
 * Process the card tags, including minor string-based adjustments and obtaining the tags of interest to be used in the card grid
 *
 * @param {cards} string - Cards to be processed
 * @param {querySelector} string - The querySelector property of the element from which the function will obtain the textContent value
 * @returns {string}
 */
export function processTags(cards) {

    const parseTag = (tag: string) => {
        return tag
            .replace(new RegExp(`${currentBaseTag}`, "g"), "")
            .replace(new RegExp('^::+|::+$', 'g'), '')
            .replace(/["_"]/g, " ")
            .split("::")
    }

    let processedCards = cards.map((card, index) => {
        const tagsOfInterest = card.tags.map(tag => {
            // If is a tag of interest
            if (tag.includes(currentBaseTag)) {
                return parseTag(tag)
            }
        }).filter(Boolean)

        card.tagsOfInterest = tagsOfInterest
        return card
    })
    // log(Object.keys(processedCards[0]))
    return processedCards
}

/**
 * Sort cards by the tags of interest
 *
 * @param {cards} string - Cards to be processed
 * @returns {BasicCardInfoWithTagsOfInterest[]}
 */
export function sortCardsByTags(cards: BasicCardInfo[]) {

    // Process the cards
    let processedCards = processTags(cards) as BasicCardInfoWithTagsOfInterest[]

    // Sort cards
    processedCards.sort((a: BasicCardInfoWithTagsOfInterest, b: BasicCardInfoWithTagsOfInterest) => {
        const comparison = a.tagsOfInterest[0].join(" → ").localeCompare(b.tagsOfInterest[0].join(" → "))
        return comparison
    })

    return processedCards as BasicCardInfoWithTagsOfInterest[]
}