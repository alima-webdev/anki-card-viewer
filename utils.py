# Imports
from functools import reduce
import re
from bs4 import BeautifulSoup

# Anki
from aqt import mw

from .consts import HOST, PORT

# Devtools
from .devtools import log


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
        card["question"] = getSubElementInnerHTML(cardInfo.note().fields[0], "#text")
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


# HTML Parser
def getSubElementInnerHTML(
    html_string, selector
):  # Create a BeautifulSoup object from the HTML string
    soup = BeautifulSoup(html_string, "html.parser")

    # Use select_one to find the first element matching the selector
    sub_element = soup.select_one(selector)

    # Check if sub_element is found
    if sub_element:
        
        # Find all img tags
        img_tags = soup.find_all('img')

        # Prepend "http://" to src attribute of each img tag
        for img in img_tags:
            if img.has_attr('src'):
                img['src'] = 'http://' + HOST + ":" + str(PORT) + "/" + img['src']
                
        # Return the inner HTML of the subelement
        return str(sub_element)
    else:
        # Return None or handle the case where subelement is not found
        return None
