# Python imports
import os

# Anki imports
from aqt import mw
from aqt.theme import theme_manager
from pathlib import Path

# Globals
global ADDON_NAME, ADDON_TITLE, ADDON_PATH, HOST, MEDIA_SERVER, DARK_MODE, PANEL_WIDTH, PATH_TO_HTML, PATH_TO_DATAFILE, CONFIG

ADDON_NAME = os.getcwd().split(os.sep)[-1]
ADDON_TITLE = mw.addonManager.addon_meta(ADDON_NAME).provided_name
ADDON_PATH = Path(__file__).parent.absolute().as_posix()

MEDIA_SERVER = mw.mediaServer
HOST = "localhost"
PORT = MEDIA_SERVER.getPort()

PATH_TO_HTML = f"""web/dist/index.html"""

CONFIG = mw.addonManager.getConfig(ADDON_NAME)

HOOKS_PREFIX = "CardViewer."

BASE_TAG = ""