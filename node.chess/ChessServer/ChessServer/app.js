'use strict';

// PIECE MAP
// A text map that sets up the board.  Expand upon later, but good implementation overall
//var pieceMap = "ttttyttttttttttteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeevvvvvvvvvvvvbvvv";
var pieceMap = {
	"BoardSize": 8,
	"Map": "qwrtyrwquuuuuuuueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeennnnnnnnzxcvbcxz"};

//Variables
//TODO: Figure out which are drawing vars and which are data vars
var boardFill = {};
var boardX = {};
var boardY = {};
var boardContains = {};
var boardHighlight = {};
var boardCoord = {};
var coordBoard = {};
var captured = {};
var capturedIndex = 0;
var lastClick = 0;
var turnWhite = true;
var boardRight = 700;
var whiteKingMoved = false;
var blackKingMoved = false;
var checkTriggerWhite = false;
var checkTriggerBlack = false;
var checkWhite = false;
var checkBlack = false;
var checkMateWhite = false;
var checkMateBlack = false;

for (x = 1; x <= 8; x++) {
	boardCoord[x] = {};
	for (y = 1; y <= 8; y++) {
		boardCoord[x][y] = 0;
	}
}

function loadGame() {

	//set up board
	var currentX = 20;
	var currentY = 20;
	var tickTock = false;
	var boardTotal = 1;
	//Fills in the board.  Drawing code, useless for server
	for (y = 1; y <= 8; y++) {
		for (x = 1; x <= 8; x++) {
			/*if (tickTock == false) {
				boardFill[boardTotal] = "#AAA";
			} else {
				boardFill[boardTotal] = "#888";
			}
			tickTock = !tickTock;*/
			boardCoord[x][y] = boardTotal;
			coordBoard[boardTotal] = { x: x, y: y };
			boardX[boardTotal] = currentX;
			boardY[boardTotal] = currentY;
			boardHighlight[boardTotal] = false;
			setBoard(boardTotal);
			currentX += 80;
			boardTotal++;
		}
		tickTock = !tickTock;
		currentX = 20;
		currentY += 80;
	}
	
	//resizeCanvas();


	/*canvas.addEventListener("mousedown", function (event) {
		var rect = canvas.getBoundingClientRect();
		x = Math.round((event.clientX - rect.left) * 100) / 100;
		y = Math.round((event.clientY - rect.top) * 100) / 100;
		for (i in boardContains) {
			if (x > boardX[i] && x < boardX[i] + 80) {
				if (y > boardY[i] && y < boardY[i] + 80) {
					//Robust debugging
					//boardHighlight[i] = !boardHighlight[i];
					clickHandle(i);
				}
			}
		}
		drawBoard();
	}, false);*/
}

function resizeCanvas() {
	context.canvas.width = window.innerWidth - 10;
	context.canvas.height = window.innerHeight - 10;
	drawBoard();
}

function setBoard(i) {
	//TODO: look up pieces by x, y coordinate of board
	//Piece map:
	//(defined above)
	//Piece map can be used to make custom board layouts
	//Here's a fun one:
	// "ttttyttttttttttteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeevvvvvvvvvvvvbvvv"
	var piece = pieceMap.substr(i - 1, 1);
	switch (piece) {
		case "q":
			//Black rook
			boardContains[i] = 1;
			break;
		case "w":
			//black knight
			boardContains[i] = 2;
			break;
		case "r":
			//black bishop
			boardContains[i] = 3;
			break;
		case "t":
			//black queen
			boardContains[i] = 4;
			break;
		case "y":
			//black king
			boardContains[i] = 5;
			break;
		case "u":
			//black pawn
			boardContains[i] = 6;
			break;
		case "e":
			//empty space
			boardContains[i] = 0;
			break;
		case "n":
			//white pawn
			boardContains[i] = 7;
			break;
		case "z":
			//white rook
			boardContains[i] = 8;
			break;
		case "x":
			//white knight
			boardContains[i] = 9;
			break;
		case "c":
			//white bishop
			boardContains[i] = 10;
			break;
		case "v":
			//white queen
			boardContains[i] = 11;
			break;
		case "b":
			//white king
			boardContains[i] = 12;
			break;
		default:
			//Error
			boardContains[i] = 111;
			break;
	}
	//console.log(boardContains[i]);
}

function clickHandle(i) {
	if (boardHighlight[i] == true) {
		//Move unit to highlighted space
		moveUnit(isWhite(lastClick), i);
	} else {
		switch (boardContains[i]) {
			case 1:
				//Rook
				if (turnWhite == false) rookMove(false, i);
				break;
			case 2:
				//Knight
				if (turnWhite == false) knightMove(false, i);
				break;
			case 3:
				//Bishop
				if (turnWhite == false) bishopMove(false, i);
				break;
			case 4:
				//Queen
				if (turnWhite == false) queenMove(false, i);
				break;
			case 5:
				//King
				if (turnWhite == false) kingMove(false, i);
				break;
			case 6:
				//Pawn
				if (turnWhite == false) pawnMove(false, i);
				break;
			case 7:
				//Pawn
				if (turnWhite == true) pawnMove(true, i);
				break;
			case 8:
				//Rook
				if (turnWhite == true) rookMove(true, i);
				break;
			case 9:
				//Knight
				if (turnWhite == true) knightMove(true, i);
				break;
			case 10:
				//Bishop
				if (turnWhite == true) bishopMove(true, i);
				break;
			case 11:
				//Queen
				if (turnWhite == true) queenMove(true, i);
				break;
			case 12:
				//King
				if (turnWhite == true) kingMove(true, i);
				break;
			default:
				//Empty, do nothing
				break;
		}
	}
}

function clearLastClick() {
	for (i in boardHighlight) {
		boardHighlight[i] = false;
	}
	drawBoard();
	lastClick = 0;
}

function highlightSpace(white, x, y) {
	if (x < 1 || x > 8 || y < 1 || y > 8) {
		return false;
	}
	if (boardContains[boardCoord[x][y]] == 0) {
		boardHighlight[boardCoord[x][y]] = !boardHighlight[boardCoord[x][y]];
		return true;
	} else {
		if (isWhite(boardCoord[x][y]) != white) {
			boardHighlight[boardCoord[x][y]] = !boardHighlight[boardCoord[x][y]];
		}
		return false;
	}
}

function pawnMove(white, i) {
	//move forward one space at a time, attack diagonally.  Cannot move forward if space blocked
	//Can move forward two spaces on first turn
	//Upgrade to other unit if it reaches opposite side
	if (lastClick != 0 && lastClick != i) {
		clearLastClick();
	}
	var pawnX = coordBoard[i].x;
	var pawnY = coordBoard[i].y;

	if (white == false) var d = 1, s = 2;
	else var d = -1, s = 7;


	if (boardContains[boardCoord[pawnX][pawnY + (d * 1)]] == 0) {
		highlightSpace(white, pawnX, pawnY + (d * 1));
		if (pawnY == s && boardContains[boardCoord[pawnX][pawnY + (d * 2)]] == 0) {
			//Move two spaces
			highlightSpace(white, pawnX, pawnY + (d * 2));
		}
	}
	if ((pawnX - 1 > 0) && boardContains[boardCoord[pawnX - 1][pawnY + (d * 1)]] != 0
		&& isWhite(boardCoord[pawnX - 1][pawnY + (d * 1)]) == !white) {
		highlightSpace(white, pawnX - 1, pawnY + (d * 1));
	}
	if ((pawnX + 1 <= 8) && boardContains[boardCoord[pawnX + 1][pawnY + (d * 1)]] != 0
		&& isWhite(boardCoord[pawnX + 1][pawnY + (d * 1)]) == !white) {
		highlightSpace(white, pawnX + 1, pawnY + (d * 1));
	}

	/*if(white == false){
		if(boardContains[boardCoord[pawnX][pawnY + 1]] == 0){ 
			highlightSpace(white, pawnX, pawnY + 1);
			if(pawnY == 2 && boardContains[boardCoord[pawnX][pawnY + 2]] == 0){
			//Move two spaces
				highlightSpace(white, pawnX, pawnY + 2);
			}
		}
		if((pawnX - 1 > 0) && boardContains[boardCoord[pawnX - 1][pawnY + 1]] != 0 
		&& isWhite(boardCoord[pawnX - 1][pawnY + 1]) == true){
			highlightSpace(white, pawnX - 1, pawnY + 1);
			//if(pawnY == 2) highlightSpace(white, pawnX, pawnY + 2);
		}
		if((pawnX + 1 <= 8) && boardContains[boardCoord[pawnX + 1][pawnY + 1]] != 0 
		&& isWhite(boardCoord[pawnX + 1][pawnY + 1]) == true){
			highlightSpace(white, pawnX + 1, pawnY + 1);
			//if(pawnY == 2) highlightSpace(white, pawnX, pawnY + 2);
		}
	}else{
		if(boardContains[boardCoord[pawnX][pawnY - 1]] == 0){
			highlightSpace(white, pawnX, pawnY - 1);
			if(pawnY == 7 && boardContains[boardCoord[pawnX][pawnY - 2]] == 0){
				//Move two spaces
				highlightSpace(white, pawnX, pawnY - 2);
			}
		}
		if((pawnX - 1 > 0) && boardContains[boardCoord[pawnX - 1][pawnY - 1]] != 0 
		&& isWhite(boardCoord[pawnX - 1][pawnY - 1]) == false){
			highlightSpace(white, pawnX - 1, pawnY - 1);
			//if(pawnY == 7) highlightSpace(white, pawnX, pawnY - 2);
		}
		if((pawnX + 1 <= 8) && boardContains[boardCoord[pawnX + 1][pawnY - 1]] != 0 
		&& isWhite(boardCoord[pawnX + 1][pawnY - 1]) == false){
			highlightSpace(white, pawnX + 1, pawnY - 1);
			//if(pawnY == 7) highlightSpace(white, pawnX, pawnY - 2);
		}
	}*/
	if (lastClick != i) { lastClick = i; } else { lastClick = 0; }
}

function rookMove(white, i) {
	//Can move left, right, up, or down until it hits a unit
	if (lastClick != 0 && lastClick != i) {
		clearLastClick();
	}
	var rookX = coordBoard[i].x;
	var rookY = coordBoard[i].y;
	var blockXPlus = false, blockXMinus = false, blockYPlus = false, blockYMinus = false;

	for (x = 1; x < 9; x++) {
		if (blockXPlus == false && highlightSpace(white, rookX + x, rookY) == false) blockXPlus = true;
		if (blockXMinus == false && highlightSpace(white, rookX - x, rookY) == false) blockXMinus = true;
		if (blockYPlus == false && highlightSpace(white, rookX, rookY + x) == false) blockYPlus = true;
		if (blockYMinus == false && highlightSpace(white, rookX, rookY - x) == false) blockYMinus = true;
	}

	if (lastClick != i) { lastClick = i; } else { lastClick = 0; }
}

function knightMove(white, i) {
	//Moves in L pattern (two spaces left/right/up/down, one space left/right/up/down at a 90 degree angle to first move)
	if (lastClick != 0 && lastClick != i) {
		clearLastClick();
	}
	var knightX = coordBoard[i].x;
	var knightY = coordBoard[i].y;

	highlightSpace(white, knightX - 1, knightY - 2);
	highlightSpace(white, knightX + 1, knightY - 2);
	highlightSpace(white, knightX - 2, knightY - 1);
	highlightSpace(white, knightX + 2, knightY - 1);
	highlightSpace(white, knightX - 2, knightY + 1);
	highlightSpace(white, knightX + 2, knightY + 1);
	highlightSpace(white, knightX - 1, knightY + 2);
	highlightSpace(white, knightX + 1, knightY + 2);

	if (lastClick != i) { lastClick = i; } else { lastClick = 0; }
}

function bishopMove(white, i) {
	//Moves diagonally until it hits a unit
	if (lastClick != 0 && lastClick != i) {
		clearLastClick();
	}
	var bishX = coordBoard[i].x;
	var bishY = coordBoard[i].y;
	var xPlusyPlus = false, xPlusyMinus = false, xMinusyPlus = false, xMinusyMinus = false;
	for (x = 1; x < 8; x++) {
		if (xPlusyPlus == false && highlightSpace(white, bishX + x, bishY + x) == false) xPlusyPlus = true;
		if (xPlusyMinus == false && highlightSpace(white, bishX + x, bishY - x) == false) xPlusyMinus = true;
		if (xMinusyPlus == false && highlightSpace(white, bishX - x, bishY + x) == false) xMinusyPlus = true;
		if (xMinusyMinus == false && highlightSpace(white, bishX - x, bishY - x) == false) xMinusyMinus = true;
	}

	if (lastClick != i) { lastClick = i; } else { lastClick = 0; }
}

function queenMove(white, i) {
	//Moves left, right, up, down, and diagonally until it hits a unit
	if (lastClick != 0 && lastClick != i) {
		clearLastClick();
	}
	var queenX = coordBoard[i].x;
	var queenY = coordBoard[i].y;

	var blockXPlus = false, blockXMinus = false, blockYPlus = false, blockYMinus = false;
	var xPlusyPlus = false, xPlusyMinus = false, xMinusyPlus = false, xMinusyMinus = false;
	for (x = 1; x < 9; x++) {
		if (blockXPlus == false && highlightSpace(white, queenX + x, queenY) == false) blockXPlus = true;
		if (blockXMinus == false && highlightSpace(white, queenX - x, queenY) == false) blockXMinus = true;
		if (blockYPlus == false && highlightSpace(white, queenX, queenY + x) == false) blockYPlus = true;
		if (blockYMinus == false && highlightSpace(white, queenX, queenY - x) == false) blockYMinus = true;
		if (xPlusyPlus == false && highlightSpace(white, queenX + x, queenY + x) == false) xPlusyPlus = true;
		if (xPlusyMinus == false && highlightSpace(white, queenX + x, queenY - x) == false) xPlusyMinus = true;
		if (xMinusyPlus == false && highlightSpace(white, queenX - x, queenY + x) == false) xMinusyPlus = true;
		if (xMinusyMinus == false && highlightSpace(white, queenX - x, queenY - x) == false) xMinusyMinus = true;
	}

	if (lastClick != i) { lastClick = i; } else { lastClick = 0; }
}

function kingMove(white, i) {
	//Moves left, right, up, down, and diagonally one space at a time.
	//First move may be two spaces toward closest Rook (castle move).  Rook moves two spaces in opposite direction.
	if (lastClick != 0 && lastClick != i) {
		clearLastClick();
	}
	var kingX = coordBoard[i].x;
	var kingY = coordBoard[i].y;

	//CASTLE CHECK
	if (white == false && blackKingMoved == false && boardContains[boardCoord[kingX + 1][kingY]] == 0
		&& boardContains[boardCoord[kingX + 2][kingY]] == 0) highlightSpace(white, kingX + 2, kingY);
	if (white == true && whiteKingMoved == false && boardContains[boardCoord[kingX + 1][kingY]] == 0
		&& boardContains[boardCoord[kingX + 2][kingY]] == 0) highlightSpace(white, kingX + 2, kingY);

	//Regular move
	highlightSpace(white, kingX - 1, kingY - 1);
	highlightSpace(white, kingX - 1, kingY);
	highlightSpace(white, kingX - 1, kingY + 1);

	highlightSpace(white, kingX, kingY - 1);
	highlightSpace(white, kingX, kingY);
	highlightSpace(white, kingX, kingY + 1);

	highlightSpace(white, kingX + 1, kingY - 1);
	highlightSpace(white, kingX + 1, kingY);
	highlightSpace(white, kingX + 1, kingY + 1);

	if (lastClick != i) { lastClick = i; } else { lastClick = 0; }
}

function isWhite(i) {
	switch (boardContains[i]) {
		case 1:
			return false;
			break;
		case 2:
			return false;
			break;
		case 3:
			return false;
			break;
		case 4:
			return false;
			break;
		case 5:
			return false;
			break;
		case 6:
			return false;
			break;
		case 7:
			return true;
			break;
		case 8:
			return true;
			break;
		case 9:
			return true;
			break;
		case 10:
			return true;
			break;
		case 11:
			return true;
			break;
		case 12:
			return true;
			break;
		default:
			break;
	}
}

function moveUnit(white, i) {
	if (checkBlack == true || checkWhite == true) {
		var buffer = boardContains[i];
		boardContains[i] = boardContains[lastClick];
		checkCheck(white);
		if (checkBlack == true || checkWhite == true) boardContains[i] = buffer;
	}
	if (boardContains[i] != 0) {
		captured[capturedIndex] = boardContains[i];
		capturedIndex++;
	}
	boardContains[i] = boardContains[lastClick];

	//Castle move
	if (boardContains[i] == 5) {
		if (white == false && blackKingMoved == false && i == boardCoord[7][1] && boardContains[boardCoord[8][1]] == 1) {
			//Move rook
			boardContains[boardCoord[6][1]] = boardContains[boardCoord[8][1]];
			boardContains[boardCoord[8][1]] = 0;
			blackKingMoved = true;
		} else if (white == false && blackKingMoved == false) {
			blackKingMoved = true;
		}
	} else if (boardContains[i] == 12) {
		if (white == true && whiteKingMoved == false && i == boardCoord[7][8] && boardContains[boardCoord[8][8]] == 8) {
			//Move rook
			boardContains[boardCoord[6][8]] = boardContains[boardCoord[8][8]];
			boardContains[boardCoord[8][8]] = 0;
			whiteKingMoved = true;
		} else if (white == true && whiteKingMoved == true) {
			whiteKingMoved = true;
		}
	}

	//Pawn upgrade
	if (boardContains[i] == 6 && coordBoard[i].y == 8 && white == false) boardContains[i] = 4;
	if (boardContains[i] == 7 && coordBoard[i].y == 1 && white == true) boardContains[i] = 11;

	boardContains[lastClick] = 0;
	for (i in boardHighlight) {
		boardHighlight[i] = false;
	}
	lastClick = 0;
	//Check for Check and Mate
	checkCheck(white);
	if (checkWhite == true || checkBlack == true) {
		checkMate();
	}
	turnWhite = !turnWhite;
}

function checkCheck(white) {
	for (i in boardContains) {
		switch (boardContains[i]) {
			case 1:
				rookCheck(false, i);
				break;
			case 2:
				knightCheck(false, i);
				break;
			case 3:
				bishCheck(false, i);
				break;
			case 4:
				queenCheck(false, i);
				break;
			case 5:
				kingCheck(false, i);
				break;
			case 6:
				pawnCheck(false, i);
				break;
			case 7:
				pawnCheck(true, i);
				break;
			case 8:
				rookCheck(true, i);
				break;
			case 9:
				knightCheck(true, i);
				break;
			case 10:
				bishCheck(true, i);
				break;
			case 11:
				queenCheck(true, i);
				break;
			case 12:
				kingCheck(true, i);
				break;
			default:
				break;
		}
	}
	if (checkTriggerWhite == true) {
		checkWhite = true;
	} else {
		checkWhite = false;
	}
	if (checkTriggerBlack == true) {
		checkBlack = true;
	} else {
		checkBlack = false;
	}
	if (checkBlack == true && blackKingMoved == false) blackKingMoved = true;
	if (checkWhite == true && whiteKingMoved == false) whiteKingMoved = true;
	checkTriggerWhite = false;
	checkTriggerBlack = false;
}

function checkSpace(white, x, y) {
	if (white == true) {
		var enKing = 5;
	} else {
		var enKing = 12;
	}
	if (x > 0 && y > 0 && x < 9 && y < 9) {
		if (boardContains[boardCoord[x][y]] == enKing) {
			if (white == true) { checkTriggerWhite = true; } else { checkTriggerBlack = true; }
			return false;
		} else if (boardContains[boardCoord[x][y]] != 0) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
}

function rookCheck(white, i) {
	var blockXPlus = false, blockXMinus = false, blockYPlus = false, blockYMinus = false;
	var rookX = coordBoard[i].x;
	var rookY = coordBoard[i].y;
	for (i = 1; i < 9; i++) {
		if (blockXPlus == false && checkSpace(white, rookX + i, rookY) == false) blockXPlus = true;
		if (blockXMinus == false && checkSpace(white, rookX - i, rookY) == false) blockXMinus = true;
		if (blockYPlus == false && checkSpace(white, rookX, rookY + i) == false) blockYPlus = true;
		if (blockYMinus == false && checkSpace(white, rookX, rookY - i) == false) blockYMinus = true;
	}
}

function knightCheck(white, i) {
	var knightX = coordBoard[i].x;
	var knightY = coordBoard[i].y;
	checkSpace(white, knightX - 1, knightY - 2);
	checkSpace(white, knightX + 1, knightY - 2);
	checkSpace(white, knightX - 2, knightY - 1);
	checkSpace(white, knightX + 2, knightY - 1);
	checkSpace(white, knightX - 2, knightY + 1);
	checkSpace(white, knightX + 2, knightY + 1);
	checkSpace(white, knightX - 1, knightY + 2);
	checkSpace(white, knightX + 1, knightY + 2);

}

function bishCheck(white, i) {
	var bishX = coordBoard[i].x;
	var bishY = coordBoard[i].y;
	var xPlusyPlus = false, xPlusyMinus = false, xMinusyPlus = false, xMinusyMinus = false;
	for (i = 1; i < 8; i++) {
		if (xPlusyPlus == false && checkSpace(white, bishX + i, bishY + i) == false) xPlusyPlus = true;
		if (xPlusyMinus == false && checkSpace(white, bishX + i, bishY - i) == false) xPlusyMinus = true;
		if (xMinusyPlus == false && checkSpace(white, bishX - i, bishY + i) == false) xMinusyPlus = true;
		if (xMinusyMinus == false && checkSpace(white, bishX - i, bishY - i) == false) xMinusyMinus = true;
	}
}

function queenCheck(white, i) {
	var queenX = coordBoard[i].x;
	var queenY = coordBoard[i].y;
	var blockXPlus = false, blockXMinus = false, blockYPlus = false, blockYMinus = false;
	var xPlusyPlus = false, xPlusyMinus = false, xMinusyPlus = false, xMinusyMinus = false;
	for (i = 1; i < 9; i++) {
		if (blockXPlus == false && checkSpace(white, queenX + i, queenY) == false) blockXPlus = true;
		if (blockXMinus == false && checkSpace(white, queenX - i, queenY) == false) blockXMinus = true;
		if (blockYPlus == false && checkSpace(white, queenX, queenY + i) == false) blockYPlus = true;
		if (blockYMinus == false && checkSpace(white, queenX, queenY - i) == false) blockYMinus = true;
		if (xPlusyPlus == false && checkSpace(white, queenX + i, queenY + i) == false) xPlusyPlus = true;
		if (xPlusyMinus == false && checkSpace(white, queenX + i, queenY - i) == false) xPlusyMinus = true;
		if (xMinusyPlus == false && checkSpace(white, queenX - i, queenY + i) == false) xMinusyPlus = true;
		if (xMinusyMinus == false && checkSpace(white, queenX - i, queenY - i) == false) xMinusyMinus = true;
	}
}

function kingCheck(white, i) {
	var kingX = coordBoard[i].x;
	var kingY = coordBoard[i].y;

	checkSpace(white, kingX - 1, kingY - 1);
	checkSpace(white, kingX - 1, kingY);
	checkSpace(white, kingX - 1, kingY + 1);

	checkSpace(white, kingX, kingY - 1);
	checkSpace(white, kingX, kingY);
	checkSpace(white, kingX, kingY + 1);

	checkSpace(white, kingX + 1, kingY - 1);
	checkSpace(white, kingX + 1, kingY);
	checkSpace(white, kingX + 1, kingY + 1);
}

function pawnCheck(white, i) {
	var pawnX = coordBoard[i].x;
	var pawnY = coordBoard[i].y;
	if (white == false) {
		checkSpace(white, pawnX - 1, pawnY + 1);
		checkSpace(white, pawnX + 1, pawnY + 1);
	} else {
		checkSpace(white, pawnX - 1, pawnY - 1);
		checkSpace(white, pawnX + 1, pawnY - 1);
	}
}

function checkMate() {

}

function drawBoard() {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	for (i in boardFill) {
		context.fillStyle = boardFill[i];
		context.fillRect(boardX[i], boardY[i], 80, 80);
	}
	for (i in boardHighlight) {
		if (boardHighlight[i] == true) {
			context.strokeStyle = "#00DDFF";
			for (x = 0; x <= 3; x++) context.strokeRect(boardX[i], boardY[i], 80, 80);
		}
	}
	context.font = "16pt Helvetica";
	context.fillStyle = "#000";
	if (turnWhite == true) {
		context.fillText("White's turn", boardRight, 40);
	} else {
		context.fillText("Black's turn", boardRight, 40);
	}
	if (checkWhite == true) {
		if (checkMateWhite == true) {
			context.fillStyle = "#F00";
			context.fillText("Checkmate!", boardRight, 80);
		} else {
			context.fillText("Check Black!", boardRight, 80);
		}
	}
	if (checkBlack == true) {
		if (checkMateBlack == true) {
			context.fillStyle = "#F00";
			context.fillText("Checkmate!", boardRight, 80);
		} else {
			context.fillText("Check White!", boardRight, 80);
		}
	}
	context.fillText("Captured:", boardRight, 120);
	var capLoop = 0;
	for (i in captured) {
		switch (captured[i]) {
			case 1:
				text = "Rook";
				context.fillStyle = "#000";
				break;
			case 2:
				text = "Knight";
				context.fillStyle = "#000";
				break;
			case 3:
				text = "Bish";
				context.fillStyle = "#000";
				break;
			case 4:
				text = "Queen";
				context.fillStyle = "#000";
				break;
			case 5:
				text = "King";
				context.fillStyle = "#000";
				break;
			case 6:
				text = "Pawn";
				context.fillStyle = "#000";
				break;
			case 7:
				text = "Pawn";
				context.fillStyle = "#FFF";
				break;
			case 8:
				text = "Rook";
				context.fillStyle = "#FFF";
				break;
			case 9:
				text = "Knight";
				context.fillStyle = "#FFF";
				break;
			case 10:
				text = "Bish";
				context.fillStyle = "#FFF";
				break;
			case 11:
				text = "Queen";
				context.fillStyle = "#FFF";
				break;
			case 12:
				text = "King";
				context.fillStyle = "#FFF";
				break;
			default:
				text = "";
				break;
		}
		context.fillText(text, boardRight, 140 + capLoop * 20);
		capLoop++;
	}
	for (i in boardContains) {
		var text;
		switch (boardContains[i]) {
			case 1:
				text = "Rook";
				context.fillStyle = "#000";
				break;
			case 2:
				text = "Knight";
				context.fillStyle = "#000";
				break;
			case 3:
				text = "Bish";
				context.fillStyle = "#000";
				break;
			case 4:
				text = "Queen";
				context.fillStyle = "#000";
				break;
			case 5:
				text = "King";
				context.fillStyle = "#000";
				break;
			case 6:
				text = "Pawn";
				context.fillStyle = "#000";
				break;
			case 7:
				text = "Pawn";
				context.fillStyle = "#FFF";
				break;
			case 8:
				text = "Rook";
				context.fillStyle = "#FFF";
				break;
			case 9:
				text = "Knight";
				context.fillStyle = "#FFF";
				break;
			case 10:
				text = "Bish";
				context.fillStyle = "#FFF";
				break;
			case 11:
				text = "Queen";
				context.fillStyle = "#FFF";
				break;
			case 12:
				text = "King";
				context.fillStyle = "#FFF";
				break;
			default:
				text = "";
				break;
		}
		context.fillText(text, boardX[i], boardY[i] + 70);
	}
}

loadGame();