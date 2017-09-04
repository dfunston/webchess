# webchess
A web based chess game using Javascript and HTML5 canvas.
Current implementation is local multiplayer only, but a websocket server is planned.
Additionally, while game will verify whether the kings are in check, currently checkmate is not implemented, and no win state has been implemented, allowing for an king to be captured and the game to continue.

TODO:
* Server implementation
* Checkmate
* Game creation
* Account system (considering using Wordpress to avoid custom implementation for this).


Information about this project:

This was built as a challenge to myself.  The main file that acted as the inspiration for this project (chess.html) was built using a very basic toolset.  I only had notepad.exe and Internet Explorer with no outside internet access available to me as tools, so this project was very much a demonstration of what I can do without access to references or programs that aid in writing or debugging code.  The only development tool I had available was Internet Explorer's developer mode.

When I first started the project, I was using jQuery, but I quickly realized that I was only using it to locate the canvas in the DOM, so I removed it to cut the project's size.  This reduced the file size from 50 KB to 4 KB.
