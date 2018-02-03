//Board:
let BOARD_SIZE = 8;
let pieces = new Array(); //list of all pieces

let wk, wq, wr1, wr2, wn1, wn2, wb1, wb2;// vars for white pieces, wp1-8 are added in defaultBoardInit

let bk, bq, br1, br2, bn1, bn2, bb1, bb2;// vars for black pieces, wp1-8 are added in defaultBoardInit

let turns = 0;
let side = 'w';

let holdingPiece;
let highlightedCells = new Array();

let colors = {
  Red:'hsl(0,80%, 60%)',
  Yellow:'hsl(60,80%, 60%)',
  Green:'hsl(120,80%, 60%)',
  'Light Blue':'hsl(180,80%, 60%)',
  'Dark Blue':'hsl(240,80%, 60%)',
  Pink:'hsl(300,80%, 60%)',
  Grey:'hsl(0, 0%, 50%)'
}
function Player(side){
  this.side = side;
  this.hints = new Array();
  this.points = 0;
  this.keyHolder = undefined;
}

let whitePlayer = new Player('w');
let blackPlayer = new Player('b');
let players = [whitePlayer, blackPlayer];

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

  bk = new King(3, 7, "b"); pieces.push(bk);
  bq = new Queen(4, 7, "b"); pieces.push(bq);
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
    players[turns%2].points += tiles[newX][newY].piece.points; //add points to player
    createHint((turns+1)%2); //create hint of colors of opposing player's keyholder
    removePiece(tiles[newX][newY].piece);
  }
  tiles[newX][newY].piece = piece; //add piece in new location

  piece.row = newY;
  piece.column = newX; //set position of piece

  while(tiles[oldX][oldY].cell.hasChildNodes()){ //get rid of circles
    tiles[oldX][oldY].cell.removeChild(tiles[oldX][oldY].cell.lastChild);
  }

  if(piece.constructor.name == "Pawn"){piece.hasMoved = true}
}
function removePiece(piece){
  pieces.splice(pieces.indexOf(piece), 1);
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
  if (piece.side == side){ //make sure of correct turn
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
  if(turns%2 == 0){side = 'w'}else{side = 'b'}
  if(turns < 2){
    gameSetup(x,y);
  }else{
    inGameProcess(x,y);
  }
  replaceImages();
}
function gameSetup(x,y){
  let tile = tiles[x][y];
  if(tile.piece != undefined){
    if(tile.piece.side == side){
      players[turns%2].keyHolder = tile.piece;
      nextTurn();
    }
  }
}
function inGameProcess(x,y){
  let tile = tiles[x][y];
  let isSameColor = false;
  if(tile.piece != undefined && holdingPiece != undefined){if(tile.piece.side == holdingPiece.side){isSameColor = true}}

  let isSamePiece = false;
  if(isSameColor){isSamePiece = (holdingPiece == tile.piece)}

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
        nextTurn();
      }
    }
  }
}
function nextTurn(){
  turns++;
  if(turns%2 == 0){
    document.getElementById('log').innerHTML = 'white turn';
  }else{
    document.getElementById('log').innerHTML = 'black turn';
  }
  if(turns < 2){
    document.getElementById('phase').innerHTML = 'pick key';
  }else{
    document.getElementById('phase').innerHTML = 'play game';
  }
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

function createHint(side){
  let rColor = players[side].keyHolder.colors[Math.floor(Math.random()*piece.colors.length)];
  console.log(rColor);
}
window.onload = function(){
  document.getElementById('button').onclick = function(){
    document.getElementById('startScreenOverlay').style.display = 'none';
    document.getElementById('game').style.display = 'flex';

    makeBoard();
    defaultBoardInit();

    replaceImages();
  }
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
