from aqt import mw
from .cardviewer import CardViewerDialog
from aqt import QAction

mw.addonManager.setWebExports(__name__, r"web/.*")

def init():
    # Add action to Anki's tools menu
    action = QAction("Open the Card Viewer", mw)
    action.triggered.connect(openDialog)
    mw.form.menuTools.addAction(action)


def openDialog():
    CardViewerDialog().open()
