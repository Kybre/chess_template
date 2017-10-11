
//Board:
var boardSizeX = 8;
var boardSizeY = 8;
var tileSize = 100;
var colourSwitch = false;
var tiles = [];
//- Generation
for(x=0, x<boardSizeX, x++){
  tiles[x] = [];
  for(y=0, y<boardSizeY, y++){
    if (colourSwitch === false){
      colourSwitch = true;
    }
    else {
      colourSwitch = false;
    }
    tiles[x][y] = {
      invert: colourSwitch,
      x: 0,
      y: 0
    }
  }
}

function drawBoard(){
  for(x=0, x<boardSizeX, x++) {
      for(y=0, y<boardSizeY, y++) {
        var tileX = x * tileSize;
        var tileY = y * tileSize;
        tiles[c][r].x = tileX;
        tiles[c][r].y = tileY;
          if(tiles[c][r].invert === false) {
              ctx.beginPath();
              ctx.rect(tileX, tileY, tileSize, tileSize);
              ctx.fillStyle = "#FCFED0";
              ctx.fill();
              ctx.closePath();
          }
          else {
            ctx.beginPath();
            ctx.rect(tileX, tileY, tileSize, tileSize);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.closePath();
          }
      }
  }
}

//Piece Data:
function piece(){
  return{
    r: undefined,
    c: undefined,
    points: undefined,
    img: undefined,
    movement: undefined,
    side: undefined
  }
}

function king(){
  let k = piece();
  k.points = 100;
  k.movement = function(r1,c1){
    if(r1 - k.r = 1|| c1 = c){
      return true;
    }
    return false;
  }
  //k.img =
}
function queen(){
  let q = piece();
  q.points = 9;
  //q.movement =
  //q.img =
}
function rook(){
  let r = piece();
  r.points = 5;
  r.movement = function(r1,c1){
    if(r1 = r || c1 = c){
      return true;
    }
    return false;
  }
  //r.img =
}
function knight(){
  let kn = piece();
  kn.points = 3;
  kn.movement = function(r1,c1){
    if(r1 = r || c1 = c){
      return true;
    }
    return false;
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
