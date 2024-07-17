import os
from aqt.qt import (
    Qt,
    QVBoxLayout,
    QDialog,
    QUrl,
    QWebEngineView,
    pyqtSignal
)
from aqt import QWebChannel, mw
from .hooks import Backend
from .consts import (
    ADDON_NAME,
    HOST,
    PORT
    
)

from .devtools import log

class CardViewerDialog(QDialog):

    def __init__(self):
        super().__init__()

        self.setWindowTitle("Card Viewer")
        self.layout = QVBoxLayout()
        self.setWindowFlags(Qt.WindowType.Dialog)

        # Webview
        self.webview = QWebEngineView()
        
        # Webview Channel for Hooks
        self.backend = Backend()
        self.channel = QWebChannel()
        self.channel.registerObject("backend", self.backend)
        
        # Navigate
        self.navigate("web/dist/index.html")
        
        self.layout.addWidget(self.webview)
        self.setLayout(self.layout)
        
        # Connect signal for resizing
        self.resized.connect(self.resizeWebView)

    # Signal emitted when the dialog is resized
    resized = pyqtSignal()

    # Resize the QWebEngineView to match the dialog size
    def resizeWebView(self):
        self.webview.resize(self.size())

    def open(self):
        self.show()
        self.exec()
        
    # Navigate to the game interface URL
    def navigate(self, path):
        url = (
            f"""http://{HOST}:{PORT}/_addons/{ADDON_NAME}/{path}"""
        )
        if(os.environ.get('DEVELOPMENT', '0') == '1'):
            url = "http://localhost:5173/index.html"
        
        # log("Fn: game.navigate | Path: " + path + " | URL: " + url)
        self.webview.load(QUrl(url))
        
        self.webview.page().setWebChannel(self.channel)
        return False