//Board:
var boardSize = 8;
var tileSize = 50; //in pixels
let pieces = new Array();

let wk, wq, wr1, wr2, wn1, wn2, wb1, wb2;// vars for white pieces

let bk, bq, br1, br2, bn1, bn2, bb1, bb2;// vars for black pieces

let holdingPiece = undefined;

var tiles = new Array(boardSize);
for(let i = 0; i < tiles.length; i++){
  tiles[i] = new Array(boardSize);
  for(let j = 0; j < tiles[i].length; j++){
    tiles[i][j] = {
      cell: undefined,
      piece: undefined,
    }
  }
} //2d array of length boardSize

//- Display
function makeBoard(){
  let boardTable = document.getElementById("board");
  for(let y = 0; y < boardSize; y++){
    let row = boardTable.insertRow(y);
    for(let x = 0; x < boardSize; x++){
      let cell = row.insertCell(x);
      tiles[x][y].cell = cell;
      if(x%2 == y%2){cell.classList.add('white');}else{cell.classList.add('black');}
      cell.id = x+','+y;
      cell.onclick = function(){tileClicked(x,y)};
    }
  }
}
//- Piece Data:
function Piece(points, img, row, column, side, id){
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
}

function King(column, row, side){ //create king class
  let img = new Image();
  img.src = 'images/'+side+'k.png';
  Piece.call(this, 0, img, row, column, side, 'k'); //inherit from Piece
}
King.prototype = Object.create(Piece.prototype); //base prototype off of Piece
King.prototype.constructor = King; //make constructor
King.prototype.checkMove = function(){ //move check
    let available = new Array(); //array of possible moves
    for(let y = -1; y <= 1; y++){
      for(let x = -1; x <= 1; x++){
        let c = this.column + y;
        let r = this.row + x;

        if (y != 0 || x != 0){
          try{
            let piece = tiles[c][r].piece;
            if (piece == undefined){
              available.push([c,r]);
            }else{
              console.log(piece);
            }
          }catch(e){/*checking outside of board*/}
        }
      }
    }
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
  return available;
}

function Pawn(column, row, side){ //create pawn class
  let img = new Image();
  img.src = 'images/'+side+'p.png';
  Piece.call(this, 1, img, row, column, side, 'p'); //inherit from Piece
}
Pawn.prototype = Object.create(Pawn.prototype); //base prototype off of Piece
Pawn.prototype.constructor = Pawn; //make constructor
Pawn.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves
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

  bk = new King(4, 7, "b"); pieces.push(bk);
  bq = new Queen(3, 7, "b"); pieces.push(bq);
  br1 = new Rook(7, 7, "b"); pieces.push(br1);
  br2 = new Rook(0, 7, "b"); pieces.push(br2);
  bn1 = new Knight(6, 7, "b"); pieces.push(bn1);
  bn2 = new Knight(1, 7, "b"); pieces.push(bn2);
  bb1 = new Bishop(5, 7, "b"); pieces.push(bb1);
  bb2 = new Bishop(2, 7, "b"); pieces.push(bb2);

}

function replaceImages(){
  for(let i = 0; i < pieces.length; i++){
    tiles[pieces[i].column][pieces[i].row].piece = pieces[i]; //add the piece to the tile object
    let tile = tiles[pieces[i].column][pieces[i].row].cell; //html element

    while(tile.hasChildNodes()){ //get rid of all current elements to add image
      tile.removeChild(tile.lastChild);
    }
    if(tiles[pieces[i].column][pieces[i].row].piece.visible == true){
      tile.appendChild(pieces[i].img); //add the current piece image to the tile
    }
  }
}
function movePiece(piece, newX, newY){
  let oldX = piece.column;
  let oldY = piece.row;

  tiles[piece.column][piece.row].piece = undefined; //get rid of old piece
  tiles[newX][newY].piece = piece; //add piece in new location

  piece.row = newY;
  piece.column = newX; //set position of piece
}

function tileClicked(x,y){
  let tile = tiles[x][y];
  if (holdingPiece == undefined){ //true if a piece hasn't already been selected
    if (tile.piece != undefined){ // make sure theres a piece on the tile
      holdingPiece = tile.piece;//store hold piece
      holdingPiece.visible = false;
    }
  }else{
    movePiece(holdingPiece, x,y); //move piece to desired location if a piece is being held
    tile.piece.visible = true; //make piece in new location visible
    holdingPiece = undefined; //stop holding piece
  }
  replaceImages();
}

function asciiPrint(){ //terrible formatting, gotta learn how to ascii
  console.log('-abcdefg');
  for(let y = 0; y < 8; y++){
    let str = y+1;
    for(let x = 0; x < 8; x++){
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
