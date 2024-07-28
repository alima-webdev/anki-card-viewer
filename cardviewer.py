import json
from aqt.qt import (
    Qt,
    QVBoxLayout,
    QDialog,
    QUrl,
    QWebEngineView,
    pyqtSignal,
    QApplication
)
from aqt import QCloseEvent, QKeyEvent, QSettings, QSplitter, QWebChannel, QWebEnginePage, QWebEngineSettings, QWidget, mw, gui_hooks

from aqt.browser.previewer import BrowserPreviewer as PreviewDialog

from aqt.editor import Editor, EditorMode
from .utils import getNotesInfo
from .hooks import Backend
from .consts import ADDON_NAME, HOST, PORT, BASE_TAG

from .devtools import isDevelopment, log

QApplication.primaryScreen().size()

class CardViewerDialog(QDialog):
    editor: Editor
    editorNoteId: int
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
        #     "QSplitter::handle {  image: url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='); }"
        # self.splitter.setStyleSheet(
        #     """QSplitter::handle: {
        #         width: 100%;
        #     }"""
        # )

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
        
        self.splitter.insertWidget(1, self.webview)
        self.splitter.insertWidget(2, self.editorWidget)

        self.splitter.setSizes([10,0])
        
        self.layout.addWidget(self.splitter)
        self.layout.setContentsMargins(0,0,0,0)
        self.setLayout(self.layout)

        # Connect signal for resizing
        self.resized.connect(self.resizeWebView)
        
        # Resize the window
        width = QApplication.primaryScreen().size().width()
        height = QApplication.primaryScreen().size().height()
        self.resize(width, height)

    # Signal emitted when the dialog is resized
    resized = pyqtSignal()

    def editNote(self, noteId):
        
        # Set the last card and node ids to be used in the callback function
        if('editorNoteId' in self.__dict__):
            self.editorLastNoteId = self.editorNoteId
        
        # Set the current card and note ids
        self.editorNoteId = noteId
        # Set the editor note
        self.editor.set_note(mw.col.get_note(noteId))
        
        # Open up the sidebar if closed
        if(self.editorWidget.size().width() < 200):
            self.splitter.setSizes([10,3])

        # Callback function for when the editing is done
        def editNoteCallback():
            if('editorLastNoteId' in self.__dict__):
                note = getNotesInfo([self.editorLastNoteId], BASE_TAG)[0]
                
                self.backend.finishedEditing.emit(json.dumps(note))
            
        # Event binding
        self.editor.call_after_note_saved(editNoteCallback)

    def open(self):
        self.show()
        self.exec()

    # Navigate to the game interface URL
    def navigate(self, path):
        url = f"""http://{HOST}:{PORT}/_addons/{ADDON_NAME}/{path}"""
        if isDevelopment():
            url = "http://localhost:5173/index.html"

        self.webview.load(QUrl(url))

        self.webview.page().setWebChannel(self.channel)
        settings = self.webview.page().profile().settings()
        settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptCanAccessClipboard, True)
        return False

    # Resize the QWebEngineView to match the dialog size
    def resizeWebView(self):
        self.webview.resize(self.size())