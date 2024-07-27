from aqt import gui_hooks
from . import main

gui_hooks.profile_did_open.append(main.init)