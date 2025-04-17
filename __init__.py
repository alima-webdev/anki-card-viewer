# import subprocess
# import sys
# import os
# import threading

# def install_package(package):
#     """Install a package using pip."""
#     subprocess.run(["pip", "install", package])

# def installDependencies():
    
#     # Specify the path to your vendor packages folder
#     vendor_packages_path = os.path.join(os.path.dirname(__file__), 'vendors')

#     # Add the vendor packages path to sys.path
#     sys.path.insert(0, vendor_packages_path)
    
#     try:
#         import thefuzz
#     except ImportError:
#         print("The 'thefuzz' package not found. Installing...")
#         install_package("thefuzz")

# installThread = threading.Thread(
#     target=installDependencies,
# )
# installThread.setDaemon(True)
# installThread.start()
# installThread.join()

def init():
    from . import main
    from aqt import gui_hooks

    gui_hooks.profile_did_open.append(main.init)
    gui_hooks.profile_will_close.append(main.exit)

init()
