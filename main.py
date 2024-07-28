import os

from aqt import mw
from aqt import QAction
from .devtools import isDevelopment

from .cardviewer import CardViewerDialog
from .devtools import log

mw.addonManager.setWebExports(__name__, r"web/.*")


cardViewerDialog = CardViewerDialog()
def init():
    # Add action to Anki's tools menu
    action = QAction("Open the Card Viewer", mw)
    action.triggered.connect(openDialog)
    action.setShortcut("V")
    mw.form.menuTools.addAction(action)
    
    # Open the dialog automatically if developing
    if isDevelopment():
        openDialog()

def openDialog():
    # Clear the terminal screen
    # if isDevelopment():
    #     os.system('cls' if os.name == 'nt' else 'clear')
    
    cardViewerDialog.open()

def editNote(noteId):
    cardViewerDialog.editNote(noteId)
    
def exit():
    cardViewerDialog.webview.deleteLater()
    cardViewerDialog.deleteLater()