//Board:
var boardSize = 8;
var tileSize = 50; //in pixels
let pieces = new Array();

var tiles = new Array(boardSize);
for(let i = 0; i < tiles.length; i++){
  tiles[i] = new Array(boardSize);
  for(let j = 0; j < tiles[i].length; j++){
    let color = 'beige';
    if(i%2 == j%2){color = 'peru';}
    tiles[i][j] = {
      color: color,
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
      cell.style = 'background-color:'+tiles[x][y].color;
      cell.id = x+','+y;
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
  }
}

function king(row, column, side){
  let img = new Image();
  img.src = 'images/'+side+'k.png';
  let k = piece(100,img,
    function(newRow, newColumn){ //move check
        let distX = Math.abs(newRow-row);
        let distY = Math.abs(newColumn-column);

        if(distX <= 1 && distY <= 1){ //Check if move is only 1 block away
          if(!(distX == 0 && distY == 0)){ //make sure the new position is actually new
            return true;
          }
        }
        return false;
      }, row, column, side);
  return k;
}
function queen(row, column, side){
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
function rook(row, column, side){
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
function knight(row, column, side){
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
function bishop(row, column, side){
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
function pawn(){
  // too complicated for what we have now
}

function defaultBoardInit(){
  pieces = new Array(); //array that holds all active pieces
  let wk = king(3, 0, "b"); pieces.push(wk);
  let wq = queen(4, 0, "b"); pieces.push(wq);
  let wr1 = rook(0, 0, "b"); pieces.push(wr1);
  let wr2 = rook(7, 0, "b"); pieces.push(wr2);
  let wn1 = knight(1, 0, "b"); pieces.push(wn1);
  let wn2 = knight(6, 0, "b"); pieces.push(wn2);
  let wb1 = bishop(2, 0, "b"); pieces.push(wb1);
  let wb2 = bishop(5, 0, "b"); pieces.push(wb2);

  let bk = king(4, 7, "w"); pieces.push(bk);
  let bq = queen(3, 7, "w"); pieces.push(bq);
  let br1 = rook(7, 7, "w"); pieces.push(br1);
  let br2 = rook(0, 7, "w"); pieces.push(br2);
  let bn1 = knight(6, 7, "w"); pieces.push(bn1);
  let bn2 = knight(1, 7, "w"); pieces.push(bn2);
  let bb1 = bishop(5, 7, "w"); pieces.push(bb1);
  let bb2 = bishop(2, 7, "w"); pieces.push(bb2);

}
function replaceImages(){
  for(let i = 0; i < pieces.length; i++){
    tiles[pieces[i].row][pieces[i].column].piece = pieces[i];
    let tile = tiles[pieces[i].row][pieces[i].column].cell;
    while(tile.hasChildNodes()){ //get rid of all current elements to add image
      tile.removeChild(tile.lastChild);
    }
    tile.appendChild(pieces[i].img);
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
