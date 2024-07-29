# Imports
# External Libraries
import asyncio
import ctypes
import json
import math
import threading
import time

# Anki
from aqt import QObject, pyqtSignal, pyqtSlot
from aqt import mw

# Internal
from .consts import HOOKS_PREFIX, BASE_TAG
from .cache import data as cache

# import consts
from .utils import (
    estimateTagsOfInterest,
    extractTagsOfInterest,
    processHTML,
)

# Devtools
from .devtools import log

# from .test import testReturn


class Backend(QObject):
    # Signals to the browser
    finishedEditing = pyqtSignal(str)
    queryFinished = pyqtSignal(str)
    
    queryThread = None

    def __init__(self):
        super(Backend, self).__init__()
    
    # Perform query
    @pyqtSlot(str, result=str)
    def query(self, options):
        global BASE_TAG

        if(Backend.queryThread is not None):
            ctypes.pythonapi.PyThreadState_SetAsyncExc(Backend.queryThread.native_id,
              ctypes.py_object(SystemExit))

        returnObject = {}

        self.queryThread = threading.Thread(
            target=self.queryFunction,
            args=(
                options,
                returnObject,
            )
        )
        self.queryThread.setDaemon(True)
        self.queryThread.start()
        
    # def queryFinished():
    #     log("QUERY FINISHED")

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
    
    @pyqtSlot(result=bool)
    def applyGeneratedTags(self):
        # print(cache["query"]["results"])
        # Get the notes for update
        cards = list(filter(lambda card: card["tagsOfInterestEstimated"] == True, cache["query"]["results"]["cards"]))
        notes = []
        lastNoteId = None
        for card in cards:
            # New note
            if(card["noteId"] != lastNoteId):
                # notes.append(card)
                note = mw.col.get_note(card["noteId"])
                if(note is not None):
                    note.add_tag(card["tagsOfInterest"][0])
                    note.flush()
                lastNoteId = card["noteId"]
        
        return True

    # When the user performs a query, changes page, etc.
    def queryFunction(self, options, returnObject):
        global BASE_TAG
        
        try:

            # Options
            options = json.loads(options)
            
            # print(options)

            # Make sure all the required information has been given
            if (
                options["query"] == None
                or options["currentPage"] == None
                or options["cardsPerPage"] == None
                or options["baseTag"] == None
                or options["categorizeMisc"] == None
                or options["categorizeMiscDepth"] == None
            ):
                return json.dumps({})

            # Required variables
            query = options["query"]
            currentPage = int(options["currentPage"])
            cardsPerPage = int(options["cardsPerPage"])
            baseTag = options["baseTag"]

            # Set the new base tag
            BASE_TAG = baseTag

            # Get card ids
            ids = mw.col.find_cards(query)

            # Save all tags of interest
            tagsOfInterest = []

            # Get additional basic information (excluding the answer field)
            def prepareNote(id):
                nonlocal tagsOfInterest

                cardInfo = mw.col.get_card(id)
                note = cardInfo.note()

                card = {}
                card["cardId"] = id
                card["noteId"] = note.id
                card["cardOrder"] = cardInfo.ord
                card["isSuspended"] = cardInfo.queue == -1
                card["tags"] = note.tags
                card["tagsOfInterest"] = extractTagsOfInterest(note.tags, baseTag)
                card["tagsOfInterestEstimated"] = False

                tagsOfInterest.extend(card["tagsOfInterest"])

                return card
            cards = list(map(prepareNote, ids))

            tagsOfInterest = list(set(tagsOfInterest))

            # miscCardsCount = 0

            def processMiscCards(card):
                # nonlocal miscCardsCount
                # TEST
                # if miscCardsCount > 100:
                #     return card
                if len(card["tagsOfInterest"]) == 0:
                    card["tagsOfInterest"] = estimateTagsOfInterest(
                        card["tags"], tagsOfInterest, card["noteId"], int(options["categorizeMiscDepth"])
                    )
                    card["tagsOfInterestEstimated"] = True
                    # print(estimateTagsOfInterest(card["tags"], tagsOfInterest))
                    # miscCardsCount += 1

                return card

            if(options["categorizeMisc"] == True):
                cards = list(map(processMiscCards, cards))

            # Order by tags of interest
            def sortByTagsOfInterest(card):
                isNone = True
                field = ""
                if len(card["tagsOfInterest"]) > 0:
                    field = card["tagsOfInterest"][0]
                    isNone = False
                return (isNone, field, card["tagsOfInterestEstimated"], card["noteId"], card["cardOrder"])

            cards = sorted(cards, key=sortByTagsOfInterest)

            # Page index boundaries
            startIndex = currentPage * cardsPerPage
            endIndex = (currentPage + 1) * cardsPerPage
            if endIndex > len(cards):
                endIndex = len(cards)

            # Get the cards in the page
            cards = list(cards[startIndex:endIndex])

            # Get the answer/content of the card
            def getCardAnswer(card):
                card["answer"] = processHTML(
                    mw.col.get_note(card["noteId"]).fields[0], card["cardOrder"]
                )
                return card
            cards = list(map(getCardAnswer, cards))

            # Create the return object
            returnObject["cards"] = cards
            returnObject["totalPages"] = math.ceil(len(ids) / cardsPerPage)

            # Cache the query
            cache["query"]["request"] = options
            cache["query"]["results"] = returnObject

            # Emit the signal
            self.queryFinished.emit(json.dumps(returnObject))
        finally: 
            print("THREAD DONE")