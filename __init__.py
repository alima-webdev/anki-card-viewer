from aqt import gui_hooks


import subprocess
import sys

def install_package(package):
    """Install a package using pip."""
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import thefuzz
except ImportError:
    print("The 'thefuzz' package not found. Installing...")
    install_package("thefuzz")

def init():
    from . import main
    gui_hooks.profile_did_open.append(main.init)
    
init()