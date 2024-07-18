import os

from aqt import mw
from aqt import QAction

from .cardviewer import CardViewerDialog

mw.addonManager.setWebExports(__name__, r"web/.*")

def init():
    # Add action to Anki's tools menu
    action = QAction("Open the Card Viewer", mw)
    action.triggered.connect(openDialog)
    mw.form.menuTools.addAction(action)
    openDialog()


def openDialog():
    # Clear the terminal screen
    os.system('cls' if os.name == 'nt' else 'clear')
    
    CardViewerDialog().open()
