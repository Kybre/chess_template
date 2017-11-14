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

function setPosition(object, row, column, side){
  object.row = row;
  object.column = column;
  object.side = side;
}

function king(row, column, side){
  let img = new Image();
  img.src = 'images/bk.png';
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
      }
  );
  setPosition(k, row, column, side);
  return k;
}
function queen(row, column, side){
  let img = new Image();
  img.src = 'images/bq.png';
  let q = piece(9, img,
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
  let img = new Image();
  img.src = 'images/br.png';
  let r = piece(5, img,
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
  let img = new Image();
  img.src = 'images/bn.png';
  let kn = piece(5, img,
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
  let img = new Image();
  img.src = 'images/bb.png';
  let b = piece(5, img,
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

function defaultBoardInit(){
  //White side
  let wk = king(3, 0, "white"); pieces.push(wk);
  let wq = queen(4, 0, "white"); pieces.push(wq);
  let wr1 = rook(0, 0, "white"); pieces.push(wr1);
  let wr2 = rook(7, 0, "white"); pieces.push(wr2);
  let wn1 = knight(1, 0, "white"); pieces.push(wn1);
  let wn2 = knight(6, 0, "white"); pieces.push(wn2);
  let wb1 = bishop(2, 0, "white"); pieces.push(wb1);
  let wb2 = bishop(5, 0, "white"); pieces.push(wb2);

}
function replaceImages(){
  for(let i = 0; i < pieces.length; i++){
    tiles[pieces[i].row][pieces[i].column].piece = pieces[i];
    let tile = document.getElementById(pieces[i].row+','+pieces[i].column);
    while(tile.hasChildNodes()){
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
