# Imports
# External Libraries
import asyncio
import json
import math
import threading
import time

# Anki
from aqt import QObject, pyqtSignal, pyqtSlot
from aqt import mw

# Internal
from .consts import HOOKS_PREFIX, BASE_TAG
# import consts
from .utils import (
    extractTagsOfInterest,
    processHTML,
)

# Devtools
from .devtools import log
# from .test import testReturn

class Backend(QObject):
    finishedEditing = pyqtSignal(str)
    queryFinished = pyqtSignal(str)
    
    def __init__(self):
        super(Backend, self).__init__()
        
    # Find Cards
    @pyqtSlot(str, result=str)
    def getQueryPage(self, options):
        global BASE_TAG
        
        # Options
        options = json.loads(options)
        
        # Make sure all the required information has been given
        if(options['query'] == None or options['currentPage'] == None or options['cardsPerPage'] == None or options['baseTag'] == None):
            return json.dumps({})
        
        # Required variables
        query = options['query']
        currentPage = int(options['currentPage'])
        cardsPerPage = int(options['cardsPerPage'])
        baseTag = options['baseTag']
        
        # Set the new base tag
        BASE_TAG = baseTag
        
        # Get card ids
        ids = mw.col.find_cards(query)
        
        # Get additional basic information (excluding the answer field)
        def prepareNote(id):
            cardInfo = mw.col.get_card(id)
            note = cardInfo.note()
            card = {}
            
            card = {}
            card["cardId"] = id
            card["noteId"] = note.id
            card["isSuspended"] = cardInfo.queue == -1
            card["tags"] = note.tags
            card["tagsOfInterest"] = extractTagsOfInterest(note.tags, baseTag)
            return card
        cards = list(map(prepareNote, ids))
        
        # Order by tags of interest
        def sortByTagsOfInterest(card):
            isNone = True
            field = ""
            if(len(card["tagsOfInterest"]) > 0):
                field = card["tagsOfInterest"][0]
                isNone = False
            return (isNone, field, card["noteId"])
        cards = sorted(cards, key=sortByTagsOfInterest)
        
        # Page index boundaries
        startIndex = currentPage * cardsPerPage
        endIndex = (currentPage + 1) * cardsPerPage
        if(endIndex > len(cards)):
            endIndex = len(cards)
        
        # Get the cards in the page
        cards = list(cards[startIndex:endIndex])
        def getCardAnswer(card):
            card["answer"] = processHTML(mw.col.get_note(card["noteId"]).fields[0])
            return card
        cards = list(map(getCardAnswer, cards))
        
        returnObject = {}
        returnObject["cards"] = cards
        returnObject["totalPages"] = math.ceil(len(ids) / cardsPerPage)
        
        return json.dumps(returnObject)
        # self.queryFinished.emit(json.dumps(returnObject))
        
        # t2 = time.perf_counter(), time.process_time()
        # print(f" Real time: {t2[0] - t1[0]:.2f} seconds")
        # print(f" CPU time: {t2[1] - t1[1]:.2f} seconds")

    # Edit Card
    @pyqtSlot(str, result=bool)
    def editCard(self, noteId):
        from .main import editNote
        # noteId = mw.col.get_card(int(cardId)).note()
        editNote(int(noteId))
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