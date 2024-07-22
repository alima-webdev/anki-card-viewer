# Imports
import re

# Anki
from aqt import mw

# Internal imports
from .consts import HOST, PORT

# Devtools
from .devtools import log


def extractTagsOfInterest(tags, baseTag):
    return list(filter(lambda x: x.startswith(baseTag), tags))


def sortCardsIdsByTags(ids, baseTag):
    cards = []
    for id in ids:
        tags = mw.col.get_card(id).note().tags
        tagsOfInterest = []
        for tag in tags:
            if baseTag in tag:
                tagsOfInterest.append(tag)

        card = {}
        card["cardId"] = id
        card["tagsOfInterest"] = tagsOfInterest
        cards.append(card)
    cards.sort(key=lambda x: x["tagsOfInterest"])

    miscCardsCount = 0
    for card in cards:
        if len(card["tagsOfInterest"]) == 0:
            # miscCards.push(card)
            miscCardsCount += 1

    miscCards = cards[0:miscCardsCount]
    cards = cards[miscCardsCount:] + miscCards

    return cards


def getNotesInfo(ids, baseTag):

    notes = []
    for id in ids:
        noteInfo = mw.col.get_note(id)

        note = {}
        note["noteId"] = id
        note["answer"] = processHTML(noteInfo.fields[0])
        note["tags"] = noteInfo.tags
        note["tagsOfInterest"] = extractTagsOfInterest(note["tags"], baseTag)

        notes.append(note)

    return notes


def processHTML(html: str):
    output = html
    
    # Cloze
    clozeRegex = "\{\{c[0-9]\:\:(.*?)(::.*}}|(}}))"
    output = re.sub(clozeRegex, r"""<span class="cloze">\1</span>""", output)
    
    # Image
    imgRegex = "\"([^\"]*?)\.?(jpg|png|svg|jpeg|webp)\""
    output = re.sub(imgRegex, f"http://{HOST}:{str(PORT)}" + r"""/\1.\2""", output)
    
    return output
