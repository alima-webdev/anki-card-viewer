# Imports
from functools import reduce
import re
from bs4 import BeautifulSoup
from lxml import objectify, etree, html
from pprint import pprint
from lxml_html_clean import Cleaner

# Anki
from aqt import mw

from .consts import HOST, PORT

# Devtools
from .devtools import log

def extractTagsOfInterest(tags, baseTag):
    return list(filter(lambda x: x.startswith(baseTag), tags))


def parseTag(tag, baseTag):
    tag = tag.replace(baseTag, "")
    tag = re.sub(
        r"^::+|::+$",
        "",
    )


# 1550770886906
def sortCardsIdsByTags(ids, baseTag):
    cards = []
    for id in ids:
        # mw.col.get_card(id).rev
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
    
    # let miscCards = []
    miscCardsCount = 0
    for card in cards:
        if(len(card["tagsOfInterest"]) == 0):
            # miscCards.push(card)
            miscCardsCount += 1

    miscCards = cards[0:miscCardsCount]
    cards = cards[miscCardsCount:] + miscCards

    return cards


def getCardsInfo(ids, baseTag):

    cards = []
    for id in ids:
        cardInfo = mw.col.get_card(id)

        card = {}
        card["cardId"] = id
        # card["question"] = getSubElementInnerHTML(cardInfo.note().fields[0], "#text")
        card["answer"] = getSubElementInnerHTML(cardInfo.answer(), "#text")
        card["isSuspended"] = cardInfo.queue == -1
        card["tags"] = cardInfo.note().tags

        tagsOfInterest = []
        for tag in card["tags"]:
            if baseTag in tag:
                tagsOfInterest.append(tag)
        card["tagsOfInterest"] = tagsOfInterest

        cards.append(card)

    return cards


def getNotesInfo(ids, baseTag):

    notes = []
    for id in ids:
        noteInfo = mw.col.get_note(id)

        note = {}
        note["noteId"] = id
        # card["question"] = getSubElementInnerHTML(cardInfo.note().fields[0], "#text")
        note["answer"] = getSubElementInnerHTML(noteInfo.fields[0], "#text")
        # note["isSuspended"] = noteInfo.queue == -1
        note["tags"] = noteInfo.tags
        
        note["tagsOfInterest"] = extractTagsOfInterest(note["tags"], baseTag)

        # tagsOfInterest = []
        # for tag in note["tags"]:
        #     if baseTag in tag:
        #         tagsOfInterest.append(tag)
        # note["tagsOfInterest"] = tagsOfInterest

        notes.append(note)

    return notes


def elementToHTML(elements):
    # Function to convert an element to HTML string
    def performConversion(element):
        # Serialize the element to a string and return it
        return etree.tostring(element, encoding='unicode', method='html')

    # Generate HTML strings for selected elements
    output = [performConversion(element) for element in elements]

    # Join HTML strings into a single string
    output = ''.join(output)
    
    return output


cleaner = Cleaner()
cleaner.scripts = True # This is True because we want to activate the javascript filter
cleaner.style = True      # This is True because we want to activate the styles & stylesheet filter

# HTML Parser
def getSubElementInnerHTML(input, id):
    htmlString = input
    
    htmlString = cleaner.clean_html(htmlString)
    root = html.fromstring(htmlString)
    # etree.strip_tags(root, 'script, style')
    
    results = root.xpath("//div[@id = '%s']" % id)
    if not results:
        return elementToHTML(root)
    
    return elementToHTML(results[0])