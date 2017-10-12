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
//King
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
//Queen
function queen(row, column, side){
  let q = piece(9, undefined,
    function(newRow, newColumn){ //move check
      if(newRow == row && newColumn == colum){return false;} //make sure new position is different

      if(newRow == row || newColumn == column){return true;}//x y check

      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column); //diagonal check
      if(distY == distX){return true;}
      return false;
    }
  );

  setPosition(q, row, column, side);
  return q;
}
//Rook
function rook(row, column, side){
  let r = piece(5, undefined,
    function(newRow, newColumn){
      if(newRow == row && newColumn == colum){return false;}
      if(newRow == row || newColumn == column){return true;}//x y check
      return false;
    }
  );

  setPosition(r, row, column, side);
  return r;
}
//Knight
function knight(row, column, side){
  let kn = piece(3, undefined,
    function(newRow, newColumn){
      if(newRow == row && newColumn == colum){return false;}//not same spot
      if(Math.abs(newRow - row) == 1 && Math.abs(newColumn - column) == 2 || Math.abs(newRow - row) == 2 && Math.abs(newColumn - column) == 2){return true;}
      //if x has a difference of 2 while y has a difference of 1, or vice versa.
      return false;
    }
  );

  setPosition(kn, row, column, side);
  return kn;
}
//Bishop
function bishop(row, column, side){
  let b = piece(3, undefined,
    function(newRow, newColumn){
      if(newRow == row && newColumn == column){return false;}//not same spot
      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column); //diagonal check
      if(distY == distX){return true;}
      return false;
    }
  );

  setPosition(b, row, column, side);
  return b;
}
//Pawn
function pawn(row, column, side){
  let p = piece(1, undefined,
    function(newRow, newColumn){
      if(newRow == row && newColumn == column){return false;}
      if(newRow - row == 2 || Math.abs(newRow - row) == 1 && newColumn == column|| Math.abs(newColumn - column) == 1 && newRow == row){return true;} //fwd 2, or 1 NESW
      return false;
    }
  );
  setPosition(p, row, column, side);
  return p;
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

