//sombody toucha my spaghettcode
let BOARD_SIZE = 8;
let pieces = new Array(); //list of all pieces

let wk, wq, wr1, wr2, wn1, wn2, wb1, wb2;// vars for white pieces, wp1-8 are added in defaultBoardInit

let bk, bq, br1, br2, bn1, bn2, bb1, bb2;// vars for black pieces, wp1-8 are added in defaultBoardInit

let turns = 0;
let side = 'w';
let state = 'pickKeyholder';// 'pickKeyholder', 'game', 'gameOver', 'promotePawn'
let gamemode; //'traditional', 'coldWar'

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
  this.isLocked = true;
}

let whitePlayer = new Player('w');
let blackPlayer = new Player('b');
let players = [whitePlayer, blackPlayer];

function resetPlayers(){
  whitePlayer = new Player('w');
  blackPlayer = new Player('b');
}

let tiles = new Array(BOARD_SIZE);
for(let i = 0; i < tiles.length; i++){
  tiles[i] = new Array(BOARD_SIZE);
  for(let j = 0; j < tiles[i].length; j++){
    tiles[i][j] = {
      cell: undefined,
      piece: undefined,
    }
  }
} //2d array of length boardSize for holding the tile and piece in each position
function resetTiles(){
  for(let i = 0; i < tiles.length; i++){
    for(let j = 0; j < tiles[i].length; j++){
      tiles[i][j].piece = undefined;
      //tiles[i][j].cell.
      while(tiles[i][j].cell.hasChildNodes()){ //remove images
        tiles[i][j].cell.removeChild(tiles[i][j].cell.lastChild);
      }
    }
  } //2d array of length boardSize for holding the tile and piece in each position
}
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
  resetTiles();
  resetPlayers();
  document.getElementById('left-sidebar').innerHTML = '';
  document.getElementById('turn').innerHTML = 'pick key - white turn';
  if(gamemode == 'coldWar'){
    state = 'pickKeyholder';
  }else if(gamemode == 'traditional'){
    state = 'game';
  }


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
  replaceImages();
}

function replaceImages(){
  //let circles = document.getElementsByTagName("span"), index;

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

  document.getElementById('left-sidebar').innerHTML += '<br>' +side+" move: "+ piece.id +" to x:" +newX + ", y:"+newY;

  if(tiles[newX][newY].piece != undefined){
    players[turns%2].points += tiles[newX][newY].piece.points; //add points to player
    console.log('piece captured');
    if(tiles[newX][newY].piece == players[(turns+1)%2].keyHolder){
      removeKeyholder((turns+1)%2);
    }else if(tiles[newX][newY].piece.id == 'k'){
      state = 'gameOver';
    }else{
      if(gamemode == 'coldWar'){
        createHint((turns+1)%2); //create hint of colors of opposing player's keyholder
      }
    }
    removePiece(tiles[newX][newY].piece);
  }
  tiles[newX][newY].piece = piece; //add piece in new location

  piece.row = newY;
  piece.column = newX; //set position of piece

  while(tiles[oldX][oldY].cell.hasChildNodes()){ //get rid of circles
    tiles[oldX][oldY].cell.removeChild(tiles[oldX][oldY].cell.lastChild);
  }

  if(piece.id == "p"){
    piece.hasMoved = true;
    if(newY == 0 || newY == 7){ //promote pawn
      state = 'promotePawn';
      holdingPiece = piece;
    }
  }
}
function removeKeyholder(cside){
  console.log('keyholder ded');
  players[cside].isLocked = false;
  console.log(players[cside].side)
  document.getElementById('left-sidebar').innerHTML+= '<br>'+side+' captured keyholder';
  eval(players[cside].side+'k').unlock();
}
function removePiece(piece){
  pieces.splice(pieces.indexOf(piece), 1);
}
function holdPiece(piece){
  highlightedCells = holdingPiece.checkMove();//possible moves
  if(highlightedCells.length != 0){
    //tile.piece.visible = false
    for(let i = 0; i < highlightedCells.length; i++){
      let cellPiece = tiles[highlightedCells[i][0]][highlightedCells[i][1]].piece;
      if(cellPiece != undefined){ //check if locked king
        if(cellPiece.isLocked){
          highlightedCells.splice(i,1);
          i--;
        }
      }
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

function swapPiece(piece, newid){
  let colors = piece.colors;
  let newPiece = new pieceConstructor[newid](piece.column, piece.row, piece.side);
  newPiece.colors = colors;
  pieces[pieces.findIndex(x => x == piece)] = newPiece;
  piece = newPiece;
  tiles[piece.row][piece.column].piece = piece;
  replaceImages();
}

function tileClicked(x,y){
  if(turns%2 == 0){side = 'w'}else{side = 'b'}
  if(state == 'pickKeyholder'){
    gameSetup(x,y);
  }else if(state == 'game'){
    inGameProcess(x,y);
  }
  replaceImages();
}
function promotionClicked(p){
  if(state == 'promotePawn'){
    swapPiece(holdingPiece, p);
    holdingPiece = undefined;
    state = 'game';
    nextTurn();
  }
}
function gameSetup(x,y){ //picking keyholder
  let tile = tiles[x][y];
  if(tile.piece != undefined){
    if(tile.piece.side == side && tile.piece.id != 'k'){
      players[turns%2].keyHolder = tile.piece;
      //console.log(side+' keyholder is '+tile.piece.constructor.name);
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
        nextTurn();
      }
    }
  }
}
function nextTurn(){
  if(state == 'gameOver'){
    document.getElementById('turn').innerHTML = side + ' side wins!';
  }else{
    if(state != 'promotePawn'){
      holdingPiece = undefined; //stop holding piece
      turns++;
      if(turns >= 2){
        state = 'game';
      }
    }
    if(state == 'pickKeyholder'){
      document.getElementById('turn').innerHTML = 'pick key - ';
    }else if(state == 'game'){
      document.getElementById('turn').innerHTML = 'play game - ';
    }else{
      document.getElementById('turn').innerHTML = 'promote pawn - ';
    }

    if(turns%2 == 0){
      document.getElementById('turn').innerHTML += 'white turn';
    }else{
      document.getElementById('turn').innerHTML += 'black turn';
    }
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

function getFEN(){
  let string = '';

  // Piece placement
  for(let row = 0; row < 8; row++){
    for(let column = 0; column < 8; column++){
      if(tiles[column][row].piece != undefined){
        if(tiles[column][row].piece.side == 'w'){
          string += tiles[column][row].piece.id;
        }else{
          string += tiles[column][row].piece.id.toUpperCase();
        }
      }else{
        let emptyTiles = 0;
        for(column; column < 8 && tiles[column][row].piece == undefined; column++){
          emptyTiles++;
        }
        string += emptyTiles;
        column--;
      }
    }
    if(row<7){string += '/'}
  }
  //active color
  string += ' '+side;
  //castling ability (no castling)
  string += ' -';
  //en passant target square (no)
  string += ' -';
  //halfmove clock (wtf i dont get this)
  string += ' 0';
  //fullmove number
  string += ' '+(turns - (turns%2)+1);
  return string;
}

function createHint(nside){
  if(!players[nside].isLocked){
    return;
  }
  let rColor = players[nside].keyHolder.colors[Math.floor(Math.random()*players[nside].keyHolder.colors.length)];
  document.getElementById('left-sidebar').innerHTML += '<br>' +side+" hint: <span style='color:"+colors[rColor] +"'>"+ rColor +"</span>";
  console.log(rColor);
}
window.onload = function(){
  document.getElementById('coldWarChess').onclick = function(){enterGameScreen('coldWar');}
  document.getElementById('regularChess').onclick = function(){enterGameScreen('traditional');}
}

function enterGameScreen(mode){
  document.getElementById('startScreenOverlay').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  gamemode = mode;

  makeBoard();
  defaultBoardInit();
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

/*todo
key mechanic:
  - make hints non repeatable / what color it isnt
  - win state

UI:
  - aspect ratio / resizing
  - log
  - captured pieces
  - hints
*/
