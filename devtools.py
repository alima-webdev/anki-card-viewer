import os
    
def log(object):
    print(object)

def isDevelopment():
    return os.environ.get("DEVELOPMENT", "0") == "1"