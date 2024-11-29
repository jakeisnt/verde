# Sockets

socketActions.js provides a high level dictionary for defining socket actions and responses to be sent to all clients in the same room. You should be able to accomplish most or all of the desired functionality just by defining keys and values of this dictionary.
As of late, the actions are now parsed directly from api/, so there is no need to directly define socket actions - just configure endpoints in the right way.

socket.js is directly imported by /bin/www and provides all of the facilities for connecting websockets to clients. Don't bother with it unless you have to do something complex.
