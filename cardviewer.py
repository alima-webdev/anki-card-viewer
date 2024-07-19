import json
import os
from aqt.qt import (
    Qt,
    QVBoxLayout,
    QDialog,
    QUrl,
    QWebEngineView,
    pyqtSignal
)
from aqt import QSize, QSplitter, QWebChannel, QWidget, mw, editor, QApplication
from aqt.editor import Editor, EditorMode
from .utils import getCardsInfo
from .hooks import Backend
from .consts import ADDON_NAME, HOST, PORT, BASE_TAG
from anki.hooks import addHook

from .devtools import log

class CardViewerDialog(QDialog):
    editor: Editor
    editorCardId: int
    editorNoteId: int
    editorLastCardId: int
    editorLastNoteId: int
    layout: QVBoxLayout
    splitter: QSplitter

    def __init__(self):
        super().__init__()

        self.setWindowTitle("Card Viewer")
        self.layout = QVBoxLayout()
        self.setWindowFlags(Qt.WindowType.Dialog)

        # Splitter
        self.splitter = QSplitter()
        self.splitter.setOrientation(Qt.Orientation.Horizontal)
        self.splitter.setStyleSheet(
            "QSplitter::handle {  image: url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='); }"
        )

        # Webview
        self.webview = QWebEngineView()

        # Webview Channel for Hooks
        self.backend = Backend()
        self.channel = QWebChannel()
        self.channel.registerObject("backend", self.backend)

        # Navigate
        self.navigate("web/dist/index.html")

        # Editor
        self.editorWidget = QWidget()
        self.editor = Editor(
            mw,
            self.editorWidget,
            self,
            editor_mode=EditorMode.EDIT_CURRENT,
        )
        self.editorWidget.setMinimumWidth(200)
        self.editorWidget.setMaximumWidth(400)
        
        self.splitter.insertWidget(1, self.webview)
        self.splitter.insertWidget(2, self.editorWidget)

        self.splitter.setStretchFactor(1, 4)
        self.splitter.setStretchFactor(2, 1)
        
        self.layout.addWidget(self.splitter)
        self.setLayout(self.layout)

        # Connect signal for resizing
        self.resized.connect(self.resizeWebView)
        
        # Resize the window
        self.resize(1439, 800)

    # Signal emitted when the dialog is resized
    resized = pyqtSignal()

    def editNote(self, noteId, cardId):
        
        # Set the last card and node ids to be used in the callback function
        if('editorCardId' in self.__dict__):
            self.editorLastCardId = self.editorCardId
            self.editorLastNoteId = self.editorNoteId
        
        # Set the current card and note ids
        self.editorCardId = cardId
        self.editorNoteId = noteId
        # Set the editor note
        self.editor.set_note(noteId)

        # Callback function for when the editing is done
        def editNoteCallback():
            if('editorLastCardId' in self.__dict__):
                card = getCardsInfo([self.editorLastCardId], BASE_TAG)
                self.backend.triggerReload.emit(json.dumps(card[0]))
            
        # Event binding
        self.editor.call_after_note_saved(editNoteCallback)

    def open(self):
        self.show()
        self.exec()

    # Navigate to the game interface URL
    def navigate(self, path):
        url = f"""http://{HOST}:{PORT}/_addons/{ADDON_NAME}/{path}"""
        if os.environ.get("DEVELOPMENT", "0") == "1":
            url = "http://localhost:5173/index.html"

        self.webview.load(QUrl(url))

        self.webview.page().setWebChannel(self.channel)
        return False

    # Resize the QWebEngineView to match the dialog size
    def resizeWebView(self):
        self.webview.resize(self.size())
