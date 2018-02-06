function Piece(points, img, row, column, side, id){ //piece class
  /*main pieces will only have the points, img, and movement parameters
  omitting the last 3 parameters for the main pieces will not ruin anything and will keep the location and side undefined
  use all parameters to make a really custom specific piece*/
  this.points = points;
  this.img = img;
  this.row = row;
  this.column = column;
  this.side = side;
  this.id = id;

  this.visible = true;
  this.colors = ['Red', 'Yellow', 'Green', 'Light Blue', 'Dark Blue', 'Pink'];
  for(let i = 0; i < 3; i++){
    this.colors.splice(Math.floor(Math.random()*this.colors.length),1);
  }

}

function checkDirection(p, dx, dy, max){ //max optional value for maximum range
  let available = new Array();
  for(let d = -1; d <= 1; d += 2){ //positive and negative 1 direction
    let r = p.row + dy * d;
    let c = p.column + dx * d;

    //cycle through all tiles in one direction
    let i = 0;
    while(r < BOARD_SIZE && r >= 0 && c < BOARD_SIZE && c >= 0 && !(i >= max)){
      let piece = tiles[c][r].piece;
      if (piece == undefined){
        available.push([c,r]);
      }else{
        if(piece.side != p.side){
          available.push([c,r]);
        }
        break;
      }
      r += dy*d;
      c += dx*d;
      i++;
    }
  }
  return available;
}

function King(column, row, side){ //create king class
  let img = new Image();
  img.src = 'images/'+side+'k.png';
  Piece.call(this, 0, img, row, column, side, 'k'); //inherit from Piece
  this.colors = ['Grey']; //remove colors from king
}
King.prototype = Object.create(Piece.prototype); //base prototype off of Piece
King.prototype.constructor = King; //make constructor
King.prototype.isLocked = true;
King.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves
  if(!this.isLocked){
    available.pushArray(checkDirection(this, 0,1, 1)); //vertical check, max distance = 1
    available.pushArray(checkDirection(this, 1,0, 1)); //horizontal check, max distance = 1

    available.pushArray(checkDirection(this, 1,1, 1)); //diagonal down, max distance = 1
    available.pushArray(checkDirection(this, 1,-1, 1)); //diagonal up, max distance = 1
  }
  return available;
}
King.prototype.unlock = function(){
  this.isLocked = false;
  this.colors = [];
}

function Queen(column, row, side){ //create queen class
  let img = new Image();
  img.src = 'images/'+side+'q.png';
  Piece.call(this, 9, img, row, column, side, 'q'); //inherit from Piece
}
Queen.prototype = Object.create(Queen.prototype); //base prototype off of Piece
Queen.prototype.constructor = Queen; //make constructor
Queen.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves

  available.pushArray(checkDirection(this, 0,1)); //vertical check
  available.pushArray(checkDirection(this, 1,0)); //horizontal check

  available.pushArray(checkDirection(this, 1,1)); //diagonal down
  available.pushArray(checkDirection(this, 1,-1)); //diagonal up

  return available;
}

function Rook(column, row, side){ //create rook class
  let img = new Image();
  img.src = 'images/'+side+'r.png';
  Piece.call(this, 5, img, row, column, side, 'r'); //inherit from Piece
}
Rook.prototype = Object.create(Rook.prototype); //base prototype off of Piece
Rook.prototype.constructor = Rook; //make constructor
Rook.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves

  available.pushArray(checkDirection(this, 0,1)); //vertical check
  available.pushArray(checkDirection(this, 1,0)); //horizontal check

  return available;
}

function Knight(column, row, side){ //create knight class
  let img = new Image();
  img.src = 'images/'+side+'n.png';
  Piece.call(this, 3, img, row, column, side, 'n'); //inherit from Piece
}
Knight.prototype = Object.create(Knight.prototype); //base prototype off of Piece
Knight.prototype.constructor = Knight; //make constructor
Knight.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves

  available.pushArray(checkDirection(this, 1,2, 1));
  available.pushArray(checkDirection(this, 2,1, 1));
  available.pushArray(checkDirection(this, 1,-2, 1));
  available.pushArray(checkDirection(this, 2,-1, 1));

  return available;
}

function Bishop(column, row, side){ //create bishop class
  let img = new Image();
  img.src = 'images/'+side+'b.png';
  Piece.call(this, 3, img, row, column, side, 'b'); //inherit from Piece
}
Bishop.prototype = Object.create(Bishop.prototype); //base prototype off of Piece
Bishop.prototype.constructor = Bishop; //make constructor
Bishop.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves

  available.pushArray(checkDirection(this, 1,1)); //diagonal down
  available.pushArray(checkDirection(this, 1,-1)); //diagonal up

  return available;
}

function Pawn(column, row, side){ //create pawn class
  let img = new Image();
  img.src = 'images/'+side+'p.png';
  Piece.call(this, 1, img, row, column, side, 'p'); //inherit from Piece
}
Pawn.prototype = Object.create(Pawn.prototype); //base prototype off of Piece
Pawn.prototype.constructor = Pawn; //make constructor
Pawn.prototype.hasMoved = false;
Pawn.prototype.isAtEnd = false;
Pawn.prototype.checkMove = function(){ //move check
  let available = new Array(); //array of possible moves
  let direction = 1;if(this.side == 'b'){direction = -1};

  let r = this.row+direction;
  let c = this.column
  if(r >= 0 && r < BOARD_SIZE){
    if(tiles[c][r].piece == undefined){
      available.push([c,r])
      r += direction;
      if(!this.hasMoved){if(tiles[c][r].piece == undefined){available.push([c,r])}}
      r -= direction;
    }

    for(let d = -1; d <= 1; d += 2){ //positive and negative 1 direction
      c = this.column+d;
      try{
        if(tiles[c][r].piece.side != this.side){available.push([c,r])}
      }catch(e){}
    }
  }else{this.isAtEnd = true;}

  return available;
}
