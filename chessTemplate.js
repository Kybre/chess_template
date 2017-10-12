//Board:
var boardSize = 8;
var tileSize = 50; //in pixels

var tiles = new Array(boardSize);
for(let i = 0; i < tiles.length; i++){
  tiles[i] = new Array;
} //2d array of length boardSize

let canvas = this.document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

for(let x=0; x<boardSize; x++){ //alternate between colors on board
  for(let y=0; y<boardSize; y++){

    let colourSwitch = false;
    if(x%2 == y%2){
      colourSwitch = true;
    }
    tiles[x][y] = {
      invert: colourSwitch,
    }

  }
}

//- Display
function drawBoard(){
  for(let x=0; x<boardSize; x++) {
    for(let y=0; y<boardSize; y++) {
      if(tiles[x][y].invert){
        ctx.fillStyle ='white';
      }else{
        ctx.fillStyle = 'grey';
      }
      ctx.fillRect(x*50,y*50,tileSize,tileSize); //draw alternating colors
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

function setPosition(object, row, column, side){
  object.row = row;
  object.column = column;
  object.side = side;
}

function king(row, column, side){
  let k = piece(100,undefined,
    function(newRow, newColumn){ //move check
        let distX = Math.abs(newRow-row);
        let distY = Math.abs(newColumn-column);

        if(distX <= 1 && distY <= 1){ //Check if move is only 1 block away
          if(!(distX == 0 && distY == 0)){ //make sure the new position is actually new
            return true;
          }
        }
        return false;
      }
  );

  setPosition(k, row, column, side);
  return k;
}
function queen(row, column, side){
  let q = piece(9, undefined,
    function(newRow, newColumn){ //move check
      if(newRow == row && newColumn == column){return false;} //make sure new position is different

      if(newRow == row || newColumn == column){return true;}//x y check

      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column); //diagonal check
      if(distY == distX){return true;}
      return false;
    }
  );

  setPosition(q, row, column, side)
  return q;
}
function rook(row, column, side){
  let r = piece(5, undefined,
    function(newRow, newColumn){ //move check
      if(newRow == row && newColumn == column){return false;} //make sure new position is different
      if(newRow == row || newColumn == column){return true;}//x y check
      return false;
    }
  );

  setPosition(r, row, column, side)
  return r;
}
function knight(row, column, side){
  let kn = piece(5, undefined,
    function(newRow, newColumn){ //move check
      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column);
      if((distX == 1 && distY == 2)||(distX == 2 && distY == 1)){ //2 steps 1 way, 1 step the other
        return true;
      }
      return false;
    }
  );

  setPosition(kn, row, column, side);
  return kn;
}
function bishop(row, column, side){
  let b = piece(5, undefined,
    function(newRow, newColumn){ //move check
      if(newRow == row && newColumn == column){return false;} //make sure new position is different

      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column); //diagonal check
      if(distY == distX){return true;}
      return false;
    }
  );

  setPosition(b, row, column, side);
  return b;
}
function pawn(){
  // too complicated for what we have now
}


function drawPiece(piece){
  ctx.drawImage(piece.img, piece.row*tileSize, piece.column*tileSize);
}

function defaultBoard(){
  //White side
  let wk = king(boardSize, 4, "white");
  let wq = queen(boardSize, 5, "white");
  let wr1 = rook(boardSize, 1, "white");
  let wr2 = rook(boardSize, 8, "white");
  let wkn1 = knight(boardSize, 2, "white");
  let wkn2 = knight(boardSize, 7, "white");
  let wb1 = bishop(boardSize, 3, "white");
  let wb2 = bishop(boardSize, 6, "white");
  let wp = new Array(boardSize);
  for(i=0; i < wp.length; i++){
    wp[i] = pawn(boardSize - 1, i, "white");
  }
  //Black side
  let bk = king(1, 4, "black");
  let bq = queen(1, 5, "black");
  let br1 = rook(1, 1, "black");
  let br2 = rook(1, 8, "black");
  let bkn1 = knight(1, 2, "black");
  let bkn2 = knight(1, 7, "black");
  let bb1 = bishop(1, 3, "black");
  let bb2 = bishop(1, 6, "black");
  let bp = new Array(boardSize);
  for(i=0; i < bp.length; i++){
    bp[i] = pawn(1, i, "black");
  }
}

window.onload = function(){
  drawBoard();
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

