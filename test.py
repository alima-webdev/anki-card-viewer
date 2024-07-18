from aqt import mw, browser, editor

browser.edit

cards = [1,2,3,4,5,6]

miscCardsCount = 3
miscCards = cards[0:miscCardsCount]
cards = cards[miscCardsCount:] + miscCards

print(cards)