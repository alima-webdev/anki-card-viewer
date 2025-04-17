# import threading

# class QueryThread():
#     isRunning: bool = False
#     queryThread: threading.Thread
    
#     # Create a threading event
#     stopEvent = threading.Event()
    
#     def threadFunction(self, target: function, args: tuple):
        
#         while not self.stopEvent.is_set():
#             target(**args)
    
#     def exec(self, options):
#         if(self.isRunning == True):
#             self.stopEvent.set()
        
#         self.queryThread = threading.Thread(
#             target=self.threadFunction,
#             args=(
#                 options
#             )
#         )
#         self.queryThread.setDaemon(True)
#         self.queryThread.start()
        