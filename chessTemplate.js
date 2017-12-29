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
function piece(points, img, movement, row, column, side){
  /*main pieces will only have the points, img, and movement parameters
  omitting the last 3 parameters for the main pieces will not ruin anything and will keep the location and side undefined
  use all parameters to make a really custom specific piece*/
  return{
    points: points,
    img: img,
    checkMove: movement,
    row: row,
    column: column,
    side: side,
    visible: true,
  }
}
function king(column, row, side){
  let img = new Image();
  img.src = 'images/'+side+'k.png';
  let k = piece(100,img,
    function(newRow, newColumn){ //move check
      console.log(tiles[0][0].piece)
        column = newColumn;
        row = newRow;
        let available = new Array();
        for(let i = -1; i <= 1; i++){
          for(let j = -1; j <= 1; j++){
            let c = column + i;
            let r = row + j;

            if (i != 0 || j != 0){
              try{
                let piece = tiles[c][r].piece;
                console.log(piece);
                if (piece == undefined){
                  available.push([c,r]);
                }else{
                }
              }catch(e){}
            }
          }
        }
      return available;
      }, row, column, side);
  return k;
}
function queen(column, row, side){
  let img = new Image();
  img.src = 'images/'+side+'q.png';
  let q = piece(9, img,
    function(newRow, newColumn){ //move check
      if(newRow == row && newColumn == column){return false;} //make sure new position is different

      if(newRow == row || newColumn == column){return true;}//x y check

      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column); //diagonal check
      if(distY == distX){return true;}
      return false;
    }, row, column, side)
  return q;
}
function rook(column, row, side){
  let img = new Image();
  img.src = 'images/'+side+'r.png';
  let r = piece(5, img,
    function(newRow, newColumn){ //move check
      if(newRow == row && newColumn == column){return false;} //make sure new position is different
      if(newRow == row || newColumn == column){return true;}//x y check
      return false;
    }, row, column, side)
  return r;
}
function knight(column, row, side){
  let img = new Image();
  img.src = 'images/'+side+'n.png';
  let kn = piece(5, img,
    function(newRow, newColumn){ //move check
      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column);
      if((distX == 1 && distY == 2)||(distX == 2 && distY == 1)){ //2 steps 1 way, 1 step the other
        return true;
      }
      return false;
    }, row, column, side);
  return kn;
}
function bishop(column, row, side){
  let img = new Image();
  img.src = 'images/'+side+'b.png';
  let b = piece(5, img,
    function(newRow, newColumn){ //move check
      if(newRow == row && newColumn == column){return false;} //make sure new position is different

      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column); //diagonal check
      if(distY == distX){return true;}
      return false;
    }, row, column, side);
  return b;
}
function pawn(column, row, side){
  let img = new Image();
  img.src = 'images/'+side+'p.png';
  let p = piece(5, img,function(newRow, newColumn){return false}, row, column, side);
  return p;
}

function defaultBoardInit(){
  pieces = new Array(); //array that holds all active pieces
  wk = king(3, 0, "b"); pieces.push(wk);
  wq = queen(4, 0, "b"); pieces.push(wq);
  wr1 = rook(0, 0, "b"); pieces.push(wr1);
  wr2 = rook(7, 0, "b"); pieces.push(wr2);
  wn1 = knight(1, 0, "b"); pieces.push(wn1);
  wn2 = knight(6, 0, "b"); pieces.push(wn2);
  wb1 = bishop(2, 0, "b"); pieces.push(wb1);
  wb2 = bishop(5, 0, "b"); pieces.push(wb2);

  bk = king(4, 7, "w"); pieces.push(bk);
  bq = queen(3, 7, "w"); pieces.push(bq);
  br1 = rook(7, 7, "w"); pieces.push(br1);
  br2 = rook(0, 7, "w"); pieces.push(br2);
  bn1 = knight(6, 7, "w"); pieces.push(bn1);
  bn2 = knight(1, 7, "w"); pieces.push(bn2);
  bb1 = bishop(5, 7, "w"); pieces.push(bb1);
  bb2 = bishop(2, 7, "w"); pieces.push(bb2);

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
  console.log(wk.checkMove(wk.column, wk.row));
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
