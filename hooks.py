# Imports
# External Libraries
import json
import math

# Anki
from aqt import QObject, pyqtSignal, pyqtSlot
from aqt import mw

# Internal
from .consts import HOOKS_PREFIX, BASE_TAG
# import consts
from .utils import (
    sortCardsIdsByTags,
    getCardsInfo
)

# Devtools
from .devtools import log

class Backend(QObject):
    triggerReload = pyqtSignal(str)
    
    def __init__(self):
        super(Backend, self).__init__()
        
    # Find Cards
    @pyqtSlot(str, result=str)
    def getQueryPage(self, options):
        global BASE_TAG
        
        options = json.loads(options)
        query = options['query']
        currentPage = options['currentPage']
        cardsPerPage = options['cardsPerPage']
        baseTag = options['baseTag']
        
        BASE_TAG = baseTag
        
        ids = mw.col.find_cards(query)
        ids = sorted(ids, key=lambda cid: mw.col.get_card(cid).note().fields[0])
        
        basicCardInfo = sortCardsIdsByTags(ids, baseTag) # returns {cardId, tagsOfInterest}
        
        startIndex = currentPage * cardsPerPage
        endIndex = (currentPage + 1) * cardsPerPage
        if(endIndex > len(basicCardInfo)):
            endIndex = len(basicCardInfo)
        
        pageCardsIds = list(map(lambda x: x["cardId"], basicCardInfo))
        
        cards = getCardsInfo(pageCardsIds[startIndex:endIndex], baseTag)
        
        returnObject = {}
        returnObject["cards"] = cards
        returnObject["totalPages"] = math.ceil(len(ids) / cardsPerPage)
        
        return json.dumps(returnObject)

    # Edit Card
    @pyqtSlot(str, result=bool)
    def editCard(self, cardId):
        from .main import editNote
        noteId = mw.col.get_card(int(cardId)).note()
        editNote(noteId, int(cardId))
        return True

    # Suspend
    @pyqtSlot(str, result=bool)
    def suspend(self, cardId):
        try:
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

    # Unsuspend
    @pyqtSlot(str, result=bool)
    def unsuspend(self, cardId):
        
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