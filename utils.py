# Imports
import importlib
import re
import subprocess
import sys
# import textdistance
from thefuzz import fuzz

# Anki
from aqt import mw

# Internal imports
from .consts import HOST, PORT

# Devtools
from .devtools import log

# try:
#     from thefuzz import fuzz
# except ImportError:
#     subprocess.check_call([sys.executable, "-m", "pip", "install", 'thefuzz'])
# finally:
#     from thefuzz import fuzz

# {
#     "noteId": list[str]
# }
estimatedTags = {}
lastTagDepth = 4

def estimateTagsOfInterest(tags: list[str], tagsOfInterest: list[str], noteId: int, tagDepth: int = 4):
    
    # print("DEPTH " + str(tagDepth))
    
    # Look into the cache first if the variables are different
    if(tagDepth == lastTagDepth):
        if(str(noteId)in estimatedTags):
            return estimatedTags[str(noteId)]
    
    # Get the separate subcategories within each tag of interest
    processedTagsOfInterest = []
    for tagOfInterest in tagsOfInterest:
        processedTagsOfInterest = processedTagsOfInterest + tagOfInterest.split("::")
    
    # Get the separate subcategories within each tag
    processedTags: list[str] = []
    for tag in tags:
        if(tag.startswith("#AK_Step2_v12")):
            processedTags = processedTags + tag.split("::")

    # Calculate the distance of each subcategory
    distances = []
    for tag in processedTags:
        for tagOfInterest in tagsOfInterest:
            # distance = textdistance.hamming(tag, tagOfInterest)
            # distanceJaro = textdistance.jaro_winkler(tag, tagOfInterest)
            distance = fuzz.ratio(tag.lower(), tagOfInterest.lower())
            distanceObj = {}
            distanceObj["tag"] = tag
            distanceObj["tagOfInterest"] = "::".join(tagOfInterest.split("::")[0:tagDepth])
            # distanceObj["tagOfInterest"] = tagOfInterest
            # distanceObj["distanceHamming"] = distance
            distanceObj["distance"] = distance
            distances.append(distanceObj)

    # Return the closest tag of interest
    distanceObj = max(distances, key=lambda x: x["distance"])
    # Check if it is significantly similar in %
    tagsOfInterest = ["Miscellaneous"]
    # if(int(distanceObj["distance"]) >= 10):
    tagsOfInterest = [distanceObj["tagOfInterest"]]
    # print(distanceObj["distance"], tagsOfInterest)
    
    # Save the calculated tag of interest in the array
    estimatedTags[str(noteId)] = tagsOfInterest
    
    return tagsOfInterest

def extractTagsOfInterest(tags, baseTag: str):
    if(not baseTag.endswith("::")):
        baseTag = baseTag + "::"
    return list(filter(lambda x: x.startswith(baseTag), tags))


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


def processHTML(html: str, cardOrder: int = None):
    output = html

    # Cloze
    if cardOrder != None:
        mainClozeRegex = "\{\{c" + str(cardOrder + 1) + "\:\:(.*?)(::.*}}|(}}))"
        output = re.sub(mainClozeRegex, r"""<span class="cloze">\1</span>""", output)
 
    otherClozeRegex = "\{\{c[" + ("0-9" if cardOrder == None else "^" + str(cardOrder + 1)) + "]\:\:(.*?)(::.*}}|(}}))"
    output = re.sub(
        otherClozeRegex, r"""<span class="cloze-inactive">\1</span>""", output
    )

    # Image
    imgRegex = '"([^"]*?).?(jpg|png|svg|jpeg|webp)"'
    output = re.sub(imgRegex, f"http://{HOST}:{str(PORT)}" + r"""/\1.\2""", output)

    return output
