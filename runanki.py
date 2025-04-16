import subprocess
import os
import sys
import threading

# Process the arguments
args = sys.argv
args.pop(0)

## RUN NPM COMMANDS
rootArgIndex = args.index("-workspaceRoot")
root = args[rootArgIndex + 1]
args.pop(rootArgIndex + 1)
args.pop(rootArgIndex)

npmProcess = subprocess.Popen(["pnpm", "run", "dev"], cwd=root + "/web/")

## RUN ANKI
# Anki path
anki_path = "/Applications/Anki.app/Contents/MacOS/Anki"

# Environment variables
env = os.environ.copy()

# Generate the command
cmd = [anki_path]
cmd.extend(args)

# Run Anki
ankiProcess = subprocess.Popen(cmd, env=env)

# Manage processes
def watch_process(proc):
    global npmProcess, ankiProcess
    proc.wait()
    print(f"\033[34mProcess {proc.args} exited.")
    npmProcess.terminate()
    ankiProcess.terminate()
    os._exit(0)
    
threading.Thread(target=watch_process, args=(npmProcess,)).start()
threading.Thread(target=watch_process, args=(ankiProcess,)).start()