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
      if(newRow == row && newColumn == colum){return false;} //make sure new position is different

      if(newRow == row || newColumn == column){return true;}//vertical check

      let distX = Math.abs(newRow-row);
      let distY = Math.abs(newColumn-column); //diagonal check
      if(distY == distX){return true;}
      return false;
    }
  );

  setPosition(q, row, column, side)
  return q;
}
function rook(){
  let r = piece();
  r.points = 5;
  r.movement = function(r1,c1){
  }
  //r.img =
}
function knight(){
  let kn = piece();
  kn.points = 3;
  kn.movement = function(r1,c1){
  }
  //kn.img =
}
function bishop(){
  let b = piece();
  b.points = 3;
  b.movement = function(r1,c1){
    if(Math.abs(c1 - c) = Math.abs(r1 - r)){
      return true;
    }
    return false;
  }
  //b.img =
}
function pawn(){
  let p = piece();
  p.points = 1;
  //p.movement =
  //p.img =
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
