import os
import logging
from aqt import mw

# print(mw.pm.profileFolder(False))
# log_path = os.path.join(mw.pm.profileFolder(False), "my_addon.log")
# logging.basicConfig(
#     filename=log_path,
#     filemode="a",  # or "a" to append
#     level=logging.DEBUG,
#     format="%(asctime)s - %(levelname)s - %(message)s"
# )

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    
def log(object):

    logger = logging.getLogger()
    logger.debug("TEST")
    # logger.debug(object)
    # if(isDevelopment()):
    #     print(f"{bcolors.HEADER}{object}{bcolors.ENDC}")

        
def isDevelopment():
    return os.environ.get("DEVELOPMENT", "0") == "1"