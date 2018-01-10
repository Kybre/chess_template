//Board:
let BOARD_SIZE = 8;
let pieces = new Array(); //list of all pieces

let wk, wq, wr1, wr2, wn1, wn2, wb1, wb2;// vars for white pieces, wp1-8 are added in defaultBoardInit

let bk, bq, br1, br2, bn1, bn2, bb1, bb2;// vars for black pieces, wp1-8 are added in defaultBoardInit

let turns = 0;

let holdingPiece;
let highlightedCells = new Array();

let colors = new Array();
let RED = 'hsl(0,80%, 60%)'; colors.push(RED);
let YELLOW = 'hsl(60,80%, 60%)'; colors.push(YELLOW);
let GREEN = 'hsl(120,80%, 60%)'; colors.push(GREEN);
let LIGHT_BLUE = 'hsl(180,80%, 60%)'; colors.push(LIGHT_BLUE);
let DARK_BLUE = 'hsl(240,80%, 60%)'; colors.push(DARK_BLUE);
let PINK = 'hsl(300,80%, 60%)'; colors.push(PINK);

var tiles = new Array(BOARD_SIZE);
for(let i = 0; i < tiles.length; i++){
  tiles[i] = new Array(BOARD_SIZE);
  for(let j = 0; j < tiles[i].length; j++){
    tiles[i][j] = {
      cell: undefined,
      piece: undefined,
    }
  }
} //2d array of length boardSize for holding the tile and piece in each position

//- Display
function makeBoard(){
  let boardTable = document.getElementById("board"); //currently empty table
  for(let y = 0; y < BOARD_SIZE; y++){
    let row = boardTable.insertRow(y); //create row in table
    for(let x = 0; x < BOARD_SIZE; x++){
      let cell = row.insertCell(x); //add cells to row
      tiles[x][y].cell = cell;
      if(x%2 == y%2){cell.classList.add('white');}else{cell.classList.add('black');} //set color
      cell.id = x+','+y;
      cell.onclick = function(){tileClicked(x,y)};
    }
  }
}
//- Piece Data:
function Piece(points, img, row, column, side, id){ //piece class
  /*main pieces will only have the points, img, and movement parameters
  omitting the last 3 parameters for the main pieces will not ruin anything and will keep the location and side undefined
  use all parameters to make a really custom specific piece*/
  this.points = points;
  this.img = img;
  this.row = row;
  this.column = column;
  this.side = side;
  this.id = id;

  this.visible = true;
  this.colors = [0,1,2,3,4,5];
  for(let i = 0; i < 3; i++){
    this.colors.splice(Math.floor(Math.random()*this.colors.length),1);
  }

}

function checkDirection(p, dx, dy, max){ //max optional value for maximum range
  let available = new Array();
  for(let d = -1; d <= 1; d += 2){ //positive and negative 1 direction
    let r = p.row + dy * d;
    let c = p.column + dx * d;

    //cycle through all tiles in one direction
    let i = 0;
    while(r < BOARD_SIZE && r >= 0 && c < BOARD_SIZE && c >= 0 && !(i >= max)){
      let piece = tiles[c][r].piece;
      if (piece == undefined){
        available.push([c,r]);
      }else{
        if(piece.side != p.side){
          available.push([c,r]);
        }
        break;
      }
      r += dy*d;
      c += dx*d;
      i++;
    }
  }
  return available;
}

function King(column, row, side){ //create king class
  let img = new Image();
  img.src = 'images/'+side+'k.png';
  Piece.call(this, 0, img, row, column, side, 'k'); //inherit from Piece
  this.colors = new Array(); //remove colors from king
}
King.prototype = Object.create(Piece.prototype); //base prototype off of Piece
King.prototype.constructor = King; //make constructor
King.prototype.checkMove = function(){ //move check
    let available = new Array(); //array of possible moves

    available.pushArray(checkDirection(this, 0,1, 1)); //vertical check, max distance = 1
    available.pushArray(checkDirection(this, 1,0, 1)); //horizontal check, max distance = 1

    available.pushArray(checkDirection(this, 1,1, 1)); //diagonal down, max distance = 1
    available.pushArray(checkDirection(this, 1,-1, 1)); //diagonal up, max distance = 1

  return available;
}

function Queen(column, row, side){ //create queen class
  let img = new Image();
  img.src = 'images/'+side+'q.png';
  Piece.call(this, 9, img, row, column, side, 'q'); //inherit from Piece
}
Queen.prototype = Object.create(Queen.prototype); //base prototype off of Piece
Queen.prototype.constructor = Queen; //make constructor
Queen.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves

  available.pushArray(checkDirection(this, 0,1)); //vertical check
  available.pushArray(checkDirection(this, 1,0)); //horizontal check

  available.pushArray(checkDirection(this, 1,1)); //diagonal down
  available.pushArray(checkDirection(this, 1,-1)); //diagonal up

  return available;
}

function Rook(column, row, side){ //create rook class
  let img = new Image();
  img.src = 'images/'+side+'r.png';
  Piece.call(this, 5, img, row, column, side, 'r'); //inherit from Piece
}
Rook.prototype = Object.create(Rook.prototype); //base prototype off of Piece
Rook.prototype.constructor = Rook; //make constructor
Rook.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves

  available.pushArray(checkDirection(this, 0,1)); //vertical check
  available.pushArray(checkDirection(this, 1,0)); //horizontal check

  return available;
}

function Knight(column, row, side){ //create knight class
  let img = new Image();
  img.src = 'images/'+side+'n.png';
  Piece.call(this, 3, img, row, column, side, 'n'); //inherit from Piece
}
Knight.prototype = Object.create(Knight.prototype); //base prototype off of Piece
Knight.prototype.constructor = Knight; //make constructor
Knight.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves

  available.pushArray(checkDirection(this, 1,2, 1));
  available.pushArray(checkDirection(this, 2,1, 1));
  available.pushArray(checkDirection(this, 1,-2, 1));
  available.pushArray(checkDirection(this, 2,-1, 1));

  return available;
}

function Bishop(column, row, side){ //create bishop class
  let img = new Image();
  img.src = 'images/'+side+'b.png';
  Piece.call(this, 3, img, row, column, side, 'b'); //inherit from Piece
}
Bishop.prototype = Object.create(Bishop.prototype); //base prototype off of Piece
Bishop.prototype.constructor = Bishop; //make constructor
Bishop.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves

  available.pushArray(checkDirection(this, 1,1)); //diagonal down
  available.pushArray(checkDirection(this, 1,-1)); //diagonal up

  return available;
}

function Pawn(column, row, side){ //create pawn class
  let img = new Image();
  img.src = 'images/'+side+'p.png';
  Piece.call(this, 1, img, row, column, side, 'p'); //inherit from Piece
}
Pawn.prototype = Object.create(Pawn.prototype); //base prototype off of Piece
Pawn.prototype.constructor = Pawn; //make constructor
Pawn.prototype.hasMoved = false;
Pawn.prototype.isAtEnd = false;
Pawn.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves
  let direction = 1;if(this.side == 'b'){direction = -1};

  let r = this.row+direction;
  let c = this.column
  if(r >= 0 && r < BOARD_SIZE){
    if(tiles[c][r].piece == undefined){
      available.push([c,r])
      r += direction;
      if(tiles[c][r].piece == undefined){available.push([c,r])}
      r -= direction;
    }

    for(let d = -1; d <= 1; d += 2){ //positive and negative 1 direction
      c = this.column+d;
      try{
        if(tiles[c][r].piece.side != this.side){available.push([c,r])}
      }catch(e){}
    }
  }else{this.isAtEnd = true;}

  return available;
}

function defaultBoardInit(){
  pieces = new Array(); //array that holds all active pieces
  wk = new King(3, 0, "w"); pieces.push(wk);
  wq = new Queen(4, 0, "w"); pieces.push(wq);
  wr1 = new Rook(0, 0, "w"); pieces.push(wr1);
  wr2 = new Rook(7, 0, "w"); pieces.push(wr2);
  wn1 = new Knight(1, 0, "w"); pieces.push(wn1);
  wn2 = new Knight(6, 0, "w"); pieces.push(wn2);
  wb1 = new Bishop(2, 0, "w"); pieces.push(wb1);
  wb2 = new Bishop(5, 0, "w"); pieces.push(wb2);
  for(let i = 0; i < BOARD_SIZE; i++){
    window['wp' + (i+1)] = new Pawn(i, 1, "w"); pieces.push(window['wp' + (i+1)]);
  }

  bk = new King(4, 7, "b"); pieces.push(bk);
  bq = new Queen(3, 7, "b"); pieces.push(bq);
  br1 = new Rook(7, 7, "b"); pieces.push(br1);
  br2 = new Rook(0, 7, "b"); pieces.push(br2);
  bn1 = new Knight(6, 7, "b"); pieces.push(bn1);
  bn2 = new Knight(1, 7, "b"); pieces.push(bn2);
  bb1 = new Bishop(5, 7, "b"); pieces.push(bb1);
  bb2 = new Bishop(2, 7, "b"); pieces.push(bb2);
  for(let i = 0; i < BOARD_SIZE; i++){
    window['bp' + (i+1)] = new Pawn(i, 6, "b"); pieces.push(window['bp' + (i+1)]);
  }

  turns = 0;
}

function replaceImages(){
  let circles = document.getElementsByTagName("span"), index;

  for(let i = 0; i < pieces.length; i++){
    tiles[pieces[i].column][pieces[i].row].piece = pieces[i]; //add the piece to the tile object
    let tile = tiles[pieces[i].column][pieces[i].row].cell; //html element

    while(tile.hasChildNodes()){ //get rid of all current elements to add image
      tile.removeChild(tile.lastChild);
    }
    if(tiles[pieces[i].column][pieces[i].row].piece.visible == true){
      tile.appendChild(pieces[i].img); //add the current piece image to the tile
      tile.appendChild(document.createElement('BR'));
      for(let j = 0; j < pieces[i].colors.length; j++){
        let c = document.createElement('SPAN');
        c.classList.add('circle');
        c.style['background-color'] = colors[pieces[i].colors[j]];
        tile.appendChild(c);
      }
    }
  }
}
function movePiece(piece, newX, newY){
  let oldX = piece.column;
  let oldY = piece.row;

  tiles[piece.column][piece.row].piece = undefined; //get rid of old piece

  if(tiles[newX][newY].piece != undefined){
    pieces.splice(pieces.indexOf(tiles[newX][newY].piece), 1);
  }
  tiles[newX][newY].piece = piece; //add piece in new location

  piece.row = newY;
  piece.column = newX; //set position of piece

  while(tiles[oldX][oldY].cell.hasChildNodes()){ //get rid of circles
    tiles[oldX][oldY].cell.removeChild(tiles[oldX][oldY].cell.lastChild);
  }

  if(piece.constructor.name == "Pawn"){piece.hasMoved = true}
}
function holdPiece(piece){
  highlightedCells = holdingPiece.checkMove();//possible moves
  if(highlightedCells.length != 0){
    //tile.piece.visible = false
    for(let i = 0; i < highlightedCells.length; i++){
      tiles[highlightedCells[i][0]][highlightedCells[i][1]].cell.classList.add('highlight');
    }
  }else{ //make nothing happen if there are no possible moves
    holdingPiece = undefined;
  }
}

function checkPiece(piece){
  if ((piece.side == 'b' && turns%2 == 1)||(piece.side == 'w' && turns%2 == 0)){ //make sure of correct turn
    holdingPiece = piece;//store hold piece
    holdPiece(holdingPiece);
  }
}

function removeHighlights(){
  for(let i = 0; i < highlightedCells.length; i++){
    tiles[highlightedCells[i][0]][highlightedCells[i][1]].cell.classList.remove('highlight');
  }
}
function tileClicked(x,y){
  let tile = tiles[x][y];

  let isSameColor = false;
  if(tile.piece != undefined && holdingPiece != undefined){if(tile.piece.side == holdingPiece.side){isSameColor = true}}

  let isSamePiece = false;
  if(isSameColor){if(holdingPiece == tile.piece){isSamePiece = true}}

  if (holdingPiece == undefined){ //true if a piece hasn't already been selected
    if (tile.piece != undefined){ // make sure theres a piece on the tile
      checkPiece(tile.piece);
    }
  }else{
    if(isSameColor){
      removeHighlights();
      if(isSamePiece){
        holdingPiece = undefined; //stop holding piece
      }else{
        checkPiece(tile.piece);
      }
    }else{
      if(highlightedCells.containsCoordinate(x,y)){ //make sure of new location
        removeHighlights();
        movePiece(holdingPiece, x,y); //move piece to desired location if a piece is being held
        holdingPiece = undefined; //stop holding piece
        //tile.piece.visible = true; //make piece in new location visible
        turns++;
      }
    }
  }
  replaceImages();
}

function asciiPrint(){ //terrible formatting, gotta learn how to ascii
  console.log('-abcdefg');
  for(let y = 0; y < BOARD_SIZE; y++){
    let str = y+1;
    for(let x = 0; x < BOARD_SIZE; x++){
      if(tiles[x][y].piece != undefined){
        str += tiles[x][y].piece.id;
      }else{
        str += '-';
      }
    }
    console.log(str);
  }
}

window.onload = function(){
  makeBoard();
  defaultBoardInit();

  replaceImages();
}

Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
};

Array.prototype.containsCoordinate = function(x,y){
  for(let i = 0; i < this.length; i++){
    try{
      if(this[i][0] == x && this[i][1] == y){return true}
    }catch(e){}
  }
  return false;
}

/*

- Name
- Movement Validity Setters
- Pieces as Images with Collision
- Piece Collision
- (Ability)

Piece Movement:
- (Piece Animation)
- Validity Getters

Player Input:
- Piece Selection
- Piece Placements, Validity checks with indicators

Indicicators of Movement:
- (Indication Animation)
- Validity Checks

*/
