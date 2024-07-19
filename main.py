import os

from aqt import mw
from aqt import QAction
from .devtools import isDevelopment

from .cardviewer import CardViewerDialog

mw.addonManager.setWebExports(__name__, r"web/.*")

cardViewerDialog = CardViewerDialog()
def init():
    # Add action to Anki's tools menu
    action = QAction("Open the Card Viewer", mw)
    action.triggered.connect(openDialog)
    mw.form.menuTools.addAction(action)
    if isDevelopment():
        openDialog()

def openDialog():
    # Clear the terminal screen
    if isDevelopment():
        os.system('cls' if os.name == 'nt' else 'clear')
    
    cardViewerDialog.open()

def editNote(noteId, cardId):
    cardViewerDialog.editNote(noteId, cardId)