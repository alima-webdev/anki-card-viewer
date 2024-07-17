declare global {
    type BasicCardInfo = {
        cardId: number,
        tags: string[]
    }

    type BasicCardInfoWithTagsOfInterest = {
        cardId: number,
        tags: string[],
        tagsOfInterest: string[][],
    }

    type CardInfo = {
        cardId: number,
        question: string,
        answer: string,
        isSuspended: boolean,
        tags: string[],
    }
    type CardInfoWithTagsOfInterest = {
        cardId: number,
        question: string,
        answer: string,
        isSuspended: boolean,
        tags: string[],
        tagsOfInterest: string[][],
    }
    type QueryResults = {
        cardsBasicInfo: BasicCardInfo[], pages: BasicCardInfo[][]
    }
}
export { };