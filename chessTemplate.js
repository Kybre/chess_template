
//Board:
var boardSize = 8;
var tileSize = 50;
var tiles = new Array(8);
for(let i = 0; i < tiles.length; i++){
  tiles[i] = new Array;
}
//- Generation

let canvas = this.document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

for(let x=0; x<boardSize; x++){
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
function drawBoard(){
  for(let x=0; x<boardSize; x++) {
    for(let y=0; y<boardSize; y++) {
      //console.log(tiles[x,y]);
      if(tiles[x][y].invert){
        ctx.fillStyle ='white';
      }else{
        ctx.fillStyle = 'grey';
      }
      ctx.fillRect(x*50,y*50,tileSize,tileSize);
    }
  }
}
drawBoard();

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
