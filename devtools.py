import os

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
    if(isDevelopment()):
        print(f"{bcolors.HEADER}{object}{bcolors.ENDC}")
        
def isDevelopment():
<<<<<<< HEAD
    return os.environ.get("DEVELOPMENT", "0") == "1"
=======
    # return os.environ.get("DEVELOPMENT", "0") == "1"
    return True
>>>>>>> f7dfa4d (Stable)
