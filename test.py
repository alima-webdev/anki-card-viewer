import os
print(os.environ.get("DEVELOPMENT", "0") == "1")