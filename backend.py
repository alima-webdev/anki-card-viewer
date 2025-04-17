# Imports
# External Libraries
import ctypes
import json
import math
import threading

# Anki
from aqt import QObject, pyqtSignal, pyqtSlot
from aqt import mw

# Internal
from .consts import BASE_TAG
from .cache import data as cache

# import consts
from .utils import extractTagsOfInterest, processHTML

# Devtools
from .devtools import log

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

        if Backend.queryThread is not None:
            ctypes.pythonapi.PyThreadState_SetAsyncExc(
                Backend.queryThread.native_id, ctypes.py_object(SystemExit)
            )

        returnObject = {}

        self.queryThread = threading.Thread(
            target=self.queryFunction,
            args=(
                options,
                returnObject,
            ),
        )
        self.queryThread.setDaemon(True)
        self.queryThread.start()

    def queryFunction(self, options, returnObject):
        global BASE_TAG

        try:
            # Load options
            options = json.loads(options)
            required_keys = [
                "query", "currentPage", "cardsPerPage",
                "baseTag", "categorizeMisc", "categorizeMiscDepth",
                "categorizeMiscThreshold",
            ]

            if not all(k in options and options[k] is not None for k in required_keys):
                return json.dumps({})

            # Extract options
            query = options["query"]
            currentPage = int(options["currentPage"])
            cardsPerPage = int(options["cardsPerPage"])
            baseTag = options["baseTag"]

            # Fetch cards and notes
            cardIds = mw.col.find_cards(query)
            noteIds = mw.col.find_notes(query)

            rawNotes = {nid: mw.col.get_note(nid) for nid in noteIds}
            rawCards = [mw.col.get_card(cid) for cid in cardIds]

            # Build card objects with required fields
            allTagsOfInterest = set()
            cards = []

            for card in rawCards:
                note = rawNotes[card.nid]
                tagsOfInterest = extractTagsOfInterest(note.tags, baseTag)

                cards.append({
                    "cardId": card.id,
                    "noteId": card.nid,
                    "cardOrder": card.ord,
                    "isSuspended": card.queue == -1,
                    "tags": note.tags,
                    "tagsOfInterest": tagsOfInterest,
                })

                allTagsOfInterest.update(tagsOfInterest)

            # Sort cards
            def sort_key(card):
                toi = card["tagsOfInterest"]
                return (
                    len(toi) == 0,
                    toi[0] if toi else "",
                    card["noteId"],
                    card["cardOrder"]
                )

            cards.sort(key=sort_key)

            # Paginate
            totalCards = len(cards)
            totalPages = math.ceil(totalCards / cardsPerPage)
            start, end = currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage
            pageCards = cards[start:end]

            # Add answer content inline
            pageCards = [
                {
                    **card,
                    "answer": processHTML(rawNotes[card["noteId"]].fields[0], card["cardOrder"])
                }
                for card in pageCards
            ]

            # Final object
            BASE_TAG = baseTag
            returnObject.update({
                "cards": pageCards,
                "totalCards": totalCards,
                "totalPages": totalPages
            })

            self.queryFinished.emit(json.dumps(returnObject))
            return json.dumps(returnObject)

        except Exception as e:
            log(f"Error in queryFunction: {e}")
            return json.dumps([])

    # Edit Card
    @pyqtSlot(str, result=bool)
    def editCard(self, noteId):
        from .main import editNote

        # noteId = mw.col.get_card(int(cardId)).note()
        editNote(int(noteId))
        return True

    # Close edit panel
    @pyqtSlot(bool, result=bool)
    def closeEditPanel(self):
        from .main import closeEditPanel

        closeEditPanel()
        
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
        # Get the notes for update
        cards = list(
            filter(
                lambda card: card["tagsOfInterestEstimated"] == True,
                cache["query"]["results"]["cards"],
            )
        )
        lastNoteId = None
        for card in cards:
            # New note
            if card["noteId"] != lastNoteId:
                # notes.append(card)
                note = mw.col.get_note(card["noteId"])
                if note is not None:
                    note.add_tag(card["tagsOfInterest"][0])
                    note.flush()
                lastNoteId = card["noteId"]

        return True

