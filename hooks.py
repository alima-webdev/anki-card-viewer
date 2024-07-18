# Imports
# External Libraries
import json
import math

# Anki
from aqt import QObject, pyqtSlot
from aqt import mw

# Internal
from .consts import HOOKS_PREFIX
from .utils import (
    sortCardsIdsByTags,
    getCardsInfo
)

# Devtools
from .devtools import log

class Backend(QObject):
    def __init__(self):
        super(Backend, self).__init__()

        # cardsJSON = json.dumps(cards).replace("#", "!").replace("&", "n")
        # return cardsJSON


    # Find Cards
    # @pyqtSlot(str, result=str)
    # def findCards(self, query):
    #     cards = []
    #     cardIds = mw.col.find_cards(query)
    #     for cardId in cardIds:
    #         card = {}
    #         tags = mw.col.get_card(cardId).note().tags
    #         card["cardId"] = cardId
    #         card["tags"] = tags
    #         cards.append(card)

    #     return json.dumps(cards).replace("#", "!").replace("&", "n")
    
            
    # const parseTag = (tag: string) => {
    #     return tag
    #         .replace(new RegExp(`${ANKI.BASE_CATEGORY_TAG}`, "g"), "")
    #         .replace(new RegExp('^::+|::+$', 'g'), '')
    #         .replace(/["_"]/g, " ")
    #         .split("::")
    # }

    # let processedCards = cards.map((card, index) => {
    #     const tagsOfInterest = card.tags.map(tag => {
    #         // If is a tag of interest
    #         if (tag.includes(ANKI.BASE_CATEGORY_TAG)) {
    #             return parseTag(tag)
    #         }
    #     }).filter(Boolean)

    #     card.tagsOfInterest = tagsOfInterest
    #     return card
    # })
    # log(Object.keys(processedCards[0]))
    # return processedCards
        
    # Find Cards
    @pyqtSlot(str, result=str)
    def getQueryPage(self, options):
        log("getQueryPage")
        # log(options)
        options = json.loads(options)
        query = options['query']
        currentPage = options['currentPage']
        cardsPerPage = options['cardsPerPage']
        baseTag = options['baseTag']
        
        ids = mw.col.find_cards(query)
        ids = sorted(ids, key=lambda cid: mw.col.get_card(cid).note().fields[0])
        
        basicCardInfo = sortCardsIdsByTags(ids, baseTag) # returns {cardId, tagsOfInterest}
        
        startIndex = currentPage * cardsPerPage
        endIndex = (currentPage + 1) * cardsPerPage
        if(endIndex > len(basicCardInfo)):
            endIndex = len(basicCardInfo)
        
        # log("Card Indices")
        # log(startIndex)
        # log(endIndex)
        
        pageCardsIds = list(map(lambda x: x["cardId"], basicCardInfo))
        # log(pageCardsIds)
        # log("CARDS INFO")
        cards = getCardsInfo(pageCardsIds[startIndex:endIndex], baseTag)
        # log(cards)
        
        returnObject = {}
        returnObject["cards"] = cards
        returnObject["totalPages"] = math.ceil(len(ids) / cardsPerPage)
        
        return json.dumps(returnObject) #.replace("#", "!")

    # Get Tags
    @pyqtSlot(result=list)
    def getAllTags(self):
        tags = mw.col.tags.all()
        return tags

    # Get Cards Info
    # @pyqtSlot(list, result=str)
    # def getCardsInfo(self, ids):

    #     cards = []
    #     for id in ids:
    #         cardInfo = mw.col.get_card(id)

    #         card = {}
    #         card["cardId"] = id
    #         card["question"] = cardInfo.question()
    #         card["answer"] = cardInfo.answer()
    #         card["isSuspended"] = cardInfo.queue == -1
    #         card["tags"] = cardInfo.note().tags

    #         # log(card['tags'])
    #         cards.append(card)

    #     cardsJSON = json.dumps(cards).replace("#", "!").replace("&", "n")
    #     return cardsJSON

    # Suspend
    @pyqtSlot(str, result=bool)
    def suspend(self, cardId):
        try:
            log(f"Looking for a card with ID {cardId}...")
            # Get the card from the collection by card id
            card = mw.col.get_card(int(cardId))
            log(f"Card with ID {cardId} found.")

            if card:
                # Suspend the card
                card.queue = -1  # Set queue to -1 to suspend

                # Update the card in the collection
                mw.col.updateCard(card)

                log(f"Card with ID {cardId} suspended.")
            else:
                log(f"Card with ID {cardId} not found.")
        finally:
            log(f"Finally.")
            return True
        # aqt.operations.scheduling.suspend_cards(parent=mw, card_ids=[cardId]).run_in_background()
        # mw.requireReset()

        # return True

    # Unsuspend
    @pyqtSlot(str, result=bool)
    def unsuspend(self, cardId):
        # anki.scheduler.BuryOrSuspend(card_ids=cardId, notes_id=[], mode=anki.scheduler.BuryOrSuspend.SUSPEND)
        # log("Backend Fn: unsuspend")
        try:
            log(f"Looking for a card with ID {cardId}...")
            # Get the card from the collection by card id
            card = mw.col.get_card(int(cardId))
            log(f"Card with ID {cardId} found.")

            if card:
                # Suspend the card
                card.queue = 0  # Set queue to -1 to suspend

                # Update the card in the collection
                mw.col.update_card(card)

                log(f"Card with ID {cardId} unsuspended.")
                return True
            else:
                log(f"Card with ID {cardId} not found.")
                return False
        except:
            log(f"Exception")
            return False