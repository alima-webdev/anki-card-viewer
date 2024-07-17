from . import main
from aqt import gui_hooks

gui_hooks.profile_did_open.append(main.init)