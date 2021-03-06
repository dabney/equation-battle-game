
//(function() {
var DEBUG = false;
var MAXNUMBER = 5; // the max number of the grid
var MAXGRAPHSIZE = 640 //766
var GRAPHSIZE = MAXGRAPHSIZE; // the width and height in pixels of the graph - recalculated later based on window size
var GRAPHLOCX = 0; // the x value upper left corner of the graph
var GRAPHLOCY = 0; // the y value of the upper left corner of the graph
var TICKMARKSIZE = 5; // length of the tickmarks on the graph
var NUMEQUATIONPOINTS = 20;
var NUMEQUATIONPOINTSFORANIMATION = 300;
var XCOEFFPIECEWIDTH = 82;
var XCOEFFPOSITIONX = 150;
var XCOEFFPOSITIONY = GRAPHSIZE+120;
var XEXPONENTPIECEWIDTH = 63;
var XEXPONENTPOSITIONX = XCOEFFPOSITIONX + XCOEFFPIECEWIDTH/2;
var XEXPONENTPOSITIONY = GRAPHSIZE+120;
var CONSTANTPOSITIONX = XEXPONENTPOSITIONX + XEXPONENTPIECEWIDTH/2;
var CONSTANTPOSITIONY = GRAPHSIZE+120;
var SCOREPOSITIONY = 50;
var COLLISIONDISTANCE = 15;
var equationFontStyle = { font: "italic 34px Palatino", fill: "#000000"};
var exponentFontStyle = { font: "italic 24px Palatino", fill: "#000000"};

var validXCoefficients = [-3, -2, -1, 0, 1, 2, 3];
var validXExponents = [0, 1, 2, 3];
var validConstants = [-3, -2, -1, 0, 1, 2, 3];

var playerXArray = [];
var playerYArray = [];
var playerRotationArray = [0];

var playerArrayPosition = 0;
var playerTraversing = false;


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fisher-Yates shuffle; implementation by Mike Bostock
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

TextGamePiece = function(game, originX, originY, value, destinationX, destinationY, spritefile) {
  
    Phaser.Sprite.call(this, game, originX, originY, 'equationBattleImages', spritefile);
                    this.anchor.setTo(0.5, 0.5);
                      game.add.existing(this);
  this.textOffsetX = 0;
  this.textOffsetY = 0;

    this.createTextObject(originX + this.textOffsetX, originY + this.textOffsetY, value);

    this.value = value;
        this.inputEnabled = true;
        this.input.enableDrag(true, true, true, 1, null, null);
       //this.input.useHandCursor = true;
              this.finalPositionX = destinationX;
        this.finalPositionY = destinationY;
        this.originX = originX;
        this.originY = originY;
                this.events.onDragStart.add(this.dragStart, this);
        this.events.onDragStop.add(this.dragRelease, this);
};
TextGamePiece.prototype = Object.create(Phaser.Sprite.prototype);
TextGamePiece.prototype.constructor = TextGamePiece;
TextGamePiece.prototype.createTextObject = function(textLocationX, textLocationY, value) {
   this.textObject = this.game.add.text(textLocationX, textLocationY, String(value), equationFontStyle);
                 this.textObject.anchor.setTo(0.5, 0.5);
               };
TextGamePiece.prototype.resetValue = function(newValue) {
  this.value = newValue;
  this.textObject.text = String(newValue);
  this.x = this.originX;
    this.y = this.originY;
};
TextGamePiece.prototype.update = function() {
  this.textObject.x = this.x + this.textOffsetX;
  this.textObject.y = this.y + this.textOffsetY;
};
TextGamePiece.prototype.dragStart = function(draggedObject) {
        console.log('drag started:');
      console.dir(draggedObject);
 
};

TextGamePiece.prototype.dragRelease = function(item) {
        // If the distance from final position is less than 50 then tween to final position else tween back to initial position
   if (this.game.physics.arcade.distanceToXY( item , item.finalPositionX, item.finalPositionY) < 50) {
  
            this.game.add.tween(item).to({x: item.finalPositionX, y: item.finalPositionY }, 500, Phaser.Easing.Back.Out, true);
}
else {
            this.game.add.tween(item).to({x: item.originX, y: item.originY }, 500, Phaser.Easing.Back.Out, true);

}
        };

function xCoefficientGamePiece(game, originX, originY, value, destinationX, destinationY) {
 TextGamePiece.call(this, game, originX, originY, value, destinationX, destinationY, 'puzzle1.png');
 this.textOffsetX = 0;
 this.textOffsetY = 12;
};
xCoefficientGamePiece.prototype = Object.create(TextGamePiece.prototype);
xCoefficientGamePiece.prototype.constructor = xCoefficientGamePiece;
xCoefficientGamePiece.prototype.createTextObject = function(textLocationX, textLocationY, value) {
   this.textObject = this.game.add.text(textLocationX, textLocationY, String(value + 'x'), equationFontStyle);
                 this.textObject.anchor.setTo(0.5, 0.5);
               };
xCoefficientGamePiece.prototype.resetValue = function(newValue) {
  this.value = newValue;
  this.textObject.text = String(newValue + 'x');
  this.x = this.originX;
    this.y = this.originY;
};

xCoefficientGamePiece.prototype.dragRelease = function(item) {
  this.game.currentXCoefficient = item.value;
     if (this.game.physics.arcade.distanceToXY( item , item.finalPositionX, item.finalPositionY) < 50) {
           this.game.add.tween(item).to({x: item.finalPositionX, y: item.finalPositionY }, 500, Phaser.Easing.Back.Out, true);
}
else {
            this.game.add.tween(item).to({x: item.originX, y: item.originY }, 500, Phaser.Easing.Back.Out, true);
}
};

function xExponentGamePiece(game, originX, originY, value, destinationX, destinationY) {
  TextGamePiece.call(this, game, originX, originY, value, destinationX, destinationY, 'puzzle2.png');
   this.textOffsetX = -14;
 this.textOffsetY = -4;
};
xExponentGamePiece.prototype = Object.create(TextGamePiece.prototype);
xExponentGamePiece.prototype.constructor = xExponentGamePiece;
xExponentGamePiece.prototype.createTextObject = function(textLocationX, textLocationY, value) {
   this.textObject = this.game.add.text(textLocationX, textLocationY, String(value), exponentFontStyle);
                 this.textObject.anchor.setTo(0.5, 0.5);
               };
xExponentGamePiece.prototype.resetValue = function(newValue) {
  this.value = newValue;
  this.textObject.text = String(newValue);
  this.x = this.originX;
    this.y = this.originY;

};
xExponentGamePiece.prototype.dragRelease = function(item) {
  this.game.currentXExponent = item.value;
     if (this.game.physics.arcade.distanceToXY( item , item.finalPositionX, item.finalPositionY) < 50) {
           this.game.add.tween(item).to({x: item.finalPositionX, y: item.finalPositionY }, 500, Phaser.Easing.Back.Out, true);
}
else {
            this.game.add.tween(item).to({x: item.originX, y: item.originY }, 500, Phaser.Easing.Back.Out, true);
}
};

function constantGamePiece(game, originX, originY, value, destinationX, destinationY) {
  TextGamePiece.call(this, game, originX, originY, value, destinationX, destinationY, 'puzzle3.png');
  this.textOffsetX = -4;
 this.textOffsetY = 12;
};
constantGamePiece.prototype = Object.create(TextGamePiece.prototype);
constantGamePiece.prototype.constructor = constantGamePiece;
constantGamePiece.prototype.createTextObject = function(textLocationX, textLocationY, value) {
  var valueString;
  if (value >= 0) {
    valueString = '+ ' + value;
  }
  else {
        valueString = '- ' + Math.abs(value);

  }
   this.textObject = this.game.add.text(textLocationX, textLocationY, valueString, equationFontStyle);
                 this.textObject.anchor.setTo(0.5, 0.5);
   };
constantGamePiece.prototype.resetValue = function(newValue) {
  this.value = newValue;
    var valueString;
  if (newValue >= 0) {
    valueString = '+ ' + newValue;
  }
  else {
        valueString = '- ' + Math.abs(newValue);

  }
  this.textObject.text = valueString;
  this.x = this.originX;
    this.y = this.originY;

};
 
constantGamePiece.prototype.dragRelease = function(item) {
  this.game.currentConstant = item.value;
     if (this.game.physics.arcade.distanceToXY( item , item.finalPositionX, item.finalPositionY) < 50) {
           this.game.add.tween(item).to({x: item.finalPositionX, y: item.finalPositionY }, 500, Phaser.Easing.Back.Out, true);
}
else {
            this.game.add.tween(item).to({x: item.originX, y: item.originY }, 500, Phaser.Easing.Back.Out, true);
}
};


BasicGame.Game = function (game) {
  var gridBMD;
  var playerBMD;
  var equationGameGraphic;
  var xCoefficientGamePieces = null;
  var xCoefficientBox = null;
    var xExponentBox = null;

  var constantBox = null;

  var currentXCoefficient = null;
  var currentXExponent = null;
  var currentConstant = null;
this.pickupPiece = [];



	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

	create: function () {
var currentGamePiece;

var backgroundSprite = this.add.sprite(0,0, 'equationBattleImages', 'background.png');
backgroundSprite.scale.y = 2;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

	this.gridBMD = this.game.make.bitmapData(GRAPHSIZE, GRAPHSIZE);
				this.gridBMD.dirty = true;
				this.gridBMD.addToWorld();
this.drawGrid(this.gridBMD.ctx);

  this.playerBMD = this.game.make.bitmapData(GRAPHSIZE, GRAPHSIZE);
        this.playerBMD.dirty = true;
        this.playerBMD.addToWorld();
this.playerBMD.strokeStyle = '#ffffff';



this.equationGameGraphic = this.game.add.graphics(0, 0);
//this.userEquation = new EquationEntity();
this.userEquation = Object.create(EquationEntity.prototype);

console.dir(this.userEquation);

this.userEquation.initializeEquationSettings(getRandomInt(-3, 3), getRandomInt(0, 3), getRandomInt(-3, 3), NUMEQUATIONPOINTS);

//	this.userEquation.initializeEquationSettings(getRandomInt(-3, 3), getRandomInt(0, 3), getRandomInt(-3, 3), 60);
		this.userEquation.draw(this.gridBMD.ctx);
    for (var i=0; i < this.userEquation.pointsArray.length; i++) {
                this.pickupPiece[i] = this.game.add.sprite(this.userEquation.pointsArray[i].x, this.userEquation.pointsArray[i].y, 'equationBattleImages', 'starGold.png');
            this.pickupPiece[i].anchor.setTo(0.5, 0.5);
                        this.pickupPiece[i].scale.x = 0.5;
                                                this.pickupPiece[i].scale.y = 0.5;
                                                this.pickupPiece[i].collected = false;

    }

        this.xCoefficientBox = this.add.sprite(XCOEFFPOSITIONX, XCOEFFPOSITIONY, 'equationBattleImages', 'boxsmall.png');
        this.xCoefficientBox.anchor.setTo(0.5, 0.5);
        this.currentXExponent = this.add.sprite(XEXPONENTPOSITIONX, XEXPONENTPOSITIONY, 'equationBattleImages', 'boxsmall.png');
        this.currentXExponent.anchor.setTo(0.5, 0.5);
        this.constantBox = this.add.sprite(CONSTANTPOSITIONX, CONSTANTPOSITIONY, 'equationBattleImages', 'boxsmall.png');
        this.constantBox.anchor.setTo(0.5, 0.5);

        this.xCoefficientGamePieces = this.add.group();
        console.dir('xCoefficientGamePieces: ' + this.game.xCoefficientGamePieces);
        this.xExponentGamePieces = this.add.group();
        this.constantGamePieces = this.add.group();

 shuffle(validXCoefficients);
 shuffle(validXExponents);
 shuffle(validConstants);

      for (var i = 0; i < 2; i++) {
       currentGamePiece = new xCoefficientGamePiece(this, i*XCOEFFPIECEWIDTH + 100, GRAPHSIZE + 20, validXCoefficients[i], XCOEFFPOSITIONX, XCOEFFPOSITIONY);
        this.xCoefficientGamePieces.add(currentGamePiece);
        console.log('created game piece');
        console.dir(this);
              currentGamePiece = new xExponentGamePiece(this, i*XCOEFFPIECEWIDTH + 300, GRAPHSIZE + 20, validXExponents[i], XEXPONENTPOSITIONX, XEXPONENTPOSITIONY);
        this.xExponentGamePieces.add(currentGamePiece);
              currentGamePiece = new constantGamePiece(this, i*XCOEFFPIECEWIDTH + 500, GRAPHSIZE + 20, validConstants[i], CONSTANTPOSITIONX, CONSTANTPOSITIONY);
        this.constantGamePieces.add(currentGamePiece);
       };
console.dir(this.xCoefficientGamePieces);
  this.commitButton = this.add.button(320, XCOEFFPOSITIONY - 10, 'equationBattleImages', this.commitToMove, this, 'buttonOver.png', 'buttonOut.png', 'buttonOver.png');
    this.commitButton.input.useHandCursor = true;

  if (DEBUG) {
  this.resetButton = this.add.button(600, GRAPHSIZE + 100, 'equationBattleImages', this.reset, this, 'repeat_1.png', 'repeat_1.png', 'repeat_1.png');
    this.resetButton.input.useHandCursor = true;
                this.resetButton.anchor.setTo(0.5, 0.5);
                                this.resetButton.scale.setTo(0.5, 0.5);
  }

    this.airplane = this.game.add.sprite(100, 180, 'equationBattleImages', 'planeRed1.png');
            this.airplane.anchor.setTo(0.5, 0.5);
                                    this.airplane.scale.x = 0.5;
                                                this.airplane.scale.y = 0.5;

    // add animation phases
    this.airplane.animations.add('fly', [
        'planeRed2.png',
        'planeRed3.png'
    ], 10, true, false);

    // play animation
    this.airplane.animations.play('fly');
           this.game.physics.enable([this.airplane], Phaser.Physics.ARCADE);
           this.game.physics.enable([playerXArray], Phaser.Physics.ARCADE);
            this.game.physics.enable([playerYArray], Phaser.Physics.ARCADE);


           this.game.score = 0;

           this.game.scoreTextObject = this.game.add.text(600, SCOREPOSITIONY,  String(this.game.score), equationFontStyle);
	},

  reset: function() {
    shuffle(validXCoefficients);
    shuffle(validXExponents);
    shuffle(validConstants);
      for (var i = 0; i < 2; i++) {
        this.xCoefficientGamePieces.children[i].resetValue(validXCoefficients[i]);
        this.xExponentGamePieces.children[i].resetValue(validXExponents[i]);
        this.constantGamePieces.children[i].resetValue(validConstants[i]);
       };
  this.userEquation.initializeEquationSettings(getRandomInt(-3, 3), getRandomInt(0, 3), getRandomInt(-3, 3), NUMEQUATIONPOINTS);
  this.gridBMD.clear();
  this.drawGrid(this.gridBMD.ctx);

      this.userEquation.draw(this.gridBMD.ctx);

    for (var i=0; i < this.userEquation.pointsArray.length; i++) {
                      this.pickupPiece[i].x = this.userEquation.pointsArray[i].x;

                this.pickupPiece[i].y = this.userEquation.pointsArray[i].y;
                                                this.pickupPiece[i].collected = false;

    }

  //  this.userEquation2.draw(bmd.ctx);
  this.equationGameGraphic.clear();
  },

  commitToMove: function() {
  var bmd = this.game.make.bitmapData(GRAPHSIZE, GRAPHSIZE);

bmd.dirty = true;
bmd.addToWorld();
if (!this.userEquation2) {
          this.userEquation2 = Object.create(EquationEntity.prototype);;
      };
  this.userEquation2.initializeEquationSettings(this.currentXCoefficient , this.currentXExponent, this.currentConstant, NUMEQUATIONPOINTSFORANIMATION);
  console.dir(this.userEquation2);
  //  this.userEquation2.draw(bmd.ctx);
  this.drawEquationWithGameGraphics(this.userEquation2, this.equationGameGraphic);
console.dir(this.game);

  for (var i = 0; i < this.userEquation2.pointsArray.length; i++) {
    if (this.userEquation2.pointsArray[i].visible) {
  // console.log('visible point ' + i + ':' + this.userEquation2.pointsArray[i].x + ', ' + this.userEquation2.pointsArray[i].y);

    playerXArray[i] = this.userEquation2.pointsArray[i].x;
    playerYArray[i] = this.userEquation2.pointsArray[i].y;
if (i > 0) {
  console.log('setting rotationArray: i=' + i);
    playerRotationArray[i] = Math.atan2(playerYArray[i] - playerYArray[i-1], playerXArray[i] - playerXArray[i-1]);
   //     if (player.rotation < 0) {
     //     player.rotation += 2*Math.PI;
          }
   //    console.log('player Array ' + i + ':' + playerXArray[i].x + ', ' + playerYArray[i].y);

 }
}
  
  playerTraversing = true;


/*
     tweenXArray.push(this.userEquation2.pointsArray[i].x);
    tweenYArray.push(this.userEquation2.pointsArray[i].y);
      }
      console.log('tweenXArray: ' + tweenXArray);
      console.log('tweenXArray: ' + tweenXArray);

      var tween = this.game.add.tween(this.commitButton).to({
    x: [300, 800,  900, 0],
    y: [600,  600, 200, 0],
    angle: [360]
}, 5000).interpolation(function(v, k){
    return Phaser.Math.catmullRomInterpolation(v, k);
});
*/
 //     Phaser.Math.linearInterpolation
 //     this.animateSpriteAlongPoints(this.commitButton, tweenXArray, tweenYArray);

 //   var equationTween = this.game.add.tween(this.commitButton).to( { 'x': tweenXArray, 'y': tweenYArray }, 4000, Phaser.Math.linearInterpolation, true);
 //this.game.add.tween(this.commitButton).to({x: this.userEquation2.pointsArray[i-1].x, y: this.userEquation2.pointsArray[i-1].y },5000, Phaser.Easing.Back.Out, true); 
// this.game.add.tween(this.commitButton).to({x: tweenXArray, y: tweenYArray },5000, Phaser.Easing.Linear.None, true); 
 //this.game.add.tween(this.commitButton).to({x: this.userEquation2.pointsArray[i-1].x, y: this.userEquation2.pointsArray[i-1].y },5000, Phaser.Easing.Linear.None, true); 

    console.dir(playerXArray); 
  },

  animateSpriteAlongPoints: function(theSprite, theXPoints, theYPoints) {
//console.log('in animate Sprite');
//var tempTimer = this.game.time.create(false);
for (var i=0; i < theXPoints.length; i++) {
  this.game.time.events.add(Phaser.Timer.SECOND * .1, this.moveSpriteTo(theSprite, theXPoints[i], theYPoints[i]), this);

 // tempTimer.loop(2000, this.moveSpriteTo(theSprite, theXPoints[i], theYPoints[i]));
 // tempTimer.start();

}
  },

  moveSpriteTo: function(theSprite, x, y) {
 //   console.log('moving sprite');
    theSprite.x = x;
    theSprite.y = y;
  },

  drawEquationWithGameGraphics: function(currentEquation, currentGameGraphic) {
        if (currentEquation.pointsArray) {
    currentGameGraphic.lineStyle(3, 0x33FF00);
      currentGameGraphic.moveTo(currentEquation.pointsArray[0].x, currentEquation.pointsArray[0].y);
      for (var i=1; i < currentEquation.pointsArray.length; i++) {
      if (currentEquation.pointsArray[i].visible) {
      currentGameGraphic.lineTo(currentEquation.pointsArray[i].x, currentEquation.pointsArray[i].y);
    }
    }
    }
  },
//////
// draw the coordinate grid 
drawGrid: function(gridContext) {
  var graphTotalNumbersPlusBorder = (MAXNUMBER + 1) * 2;
  //  console.log('in drawGrid: ' + GRAPHLOCX + ', ' +GRAPHLOCY + ', ' + GRAPHSIZE)
	gridContext.save();
	gridContext.translate(GRAPHLOCX, GRAPHLOCY);
	//gridContext.fillStyle = "rgba(0, 256, 0, .5)";
	gridContext.strokeStyle = "rgba(0, 0, 0, .5)";
	gridContext.beginPath();
	//draw y axis
	gridContext.moveTo(GRAPHSIZE/2, 0);
	gridContext.lineTo(GRAPHSIZE/2, GRAPHSIZE);
	//draw x axis
	gridContext.moveTo(0, 0 + GRAPHSIZE/2);
	gridContext.lineTo(GRAPHSIZE, GRAPHSIZE/2);
	for (var i=2; i <= MAXNUMBER*2; i++) {
		gridContext.moveTo( (GRAPHSIZE/graphTotalNumbersPlusBorder) -TICKMARKSIZE, i*(GRAPHSIZE/graphTotalNumbersPlusBorder));
		gridContext.lineTo((GRAPHSIZE/graphTotalNumbersPlusBorder) + TICKMARKSIZE, i * (GRAPHSIZE/graphTotalNumbersPlusBorder));
		gridContext.moveTo( (GRAPHSIZE/2) -TICKMARKSIZE, i*(GRAPHSIZE/graphTotalNumbersPlusBorder));
		gridContext.lineTo((GRAPHSIZE/2) + TICKMARKSIZE, i * (GRAPHSIZE/graphTotalNumbersPlusBorder));
		gridContext.moveTo( GRAPHSIZE-(GRAPHSIZE/graphTotalNumbersPlusBorder) -TICKMARKSIZE, i*(GRAPHSIZE/graphTotalNumbersPlusBorder));
		gridContext.lineTo(GRAPHSIZE - (GRAPHSIZE/graphTotalNumbersPlusBorder) + TICKMARKSIZE, i * (GRAPHSIZE/graphTotalNumbersPlusBorder));
		gridContext.moveTo(i * (GRAPHSIZE/graphTotalNumbersPlusBorder), (GRAPHSIZE/2)-TICKMARKSIZE);
		gridContext.lineTo(i * (GRAPHSIZE/graphTotalNumbersPlusBorder), (GRAPHSIZE/2)+TICKMARKSIZE);
		gridContext.moveTo(i * (GRAPHSIZE/graphTotalNumbersPlusBorder), (GRAPHSIZE/graphTotalNumbersPlusBorder)-TICKMARKSIZE);
		gridContext.lineTo(i * (GRAPHSIZE/graphTotalNumbersPlusBorder), (GRAPHSIZE/graphTotalNumbersPlusBorder)+TICKMARKSIZE);
		gridContext.moveTo(i * (GRAPHSIZE/graphTotalNumbersPlusBorder), GRAPHSIZE -(GRAPHSIZE/graphTotalNumbersPlusBorder)-TICKMARKSIZE);
		gridContext.lineTo(i * (GRAPHSIZE/graphTotalNumbersPlusBorder), GRAPHSIZE - (GRAPHSIZE/graphTotalNumbersPlusBorder)+TICKMARKSIZE);
		}
	gridContext.rect(GRAPHSIZE/graphTotalNumbersPlusBorder, GRAPHSIZE/graphTotalNumbersPlusBorder, GRAPHSIZE-2*(GRAPHSIZE/graphTotalNumbersPlusBorder), GRAPHSIZE-2*GRAPHSIZE/graphTotalNumbersPlusBorder);

	gridContext.fillText(String(MAXNUMBER), GRAPHSIZE-GRAPHSIZE/graphTotalNumbersPlusBorder +2, GRAPHSIZE/2 + 17);
	gridContext.fillText(String(MAXNUMBER), GRAPHSIZE/2 + 2, GRAPHSIZE/graphTotalNumbersPlusBorder+17);
	gridContext.fillText(String(-MAXNUMBER), GRAPHSIZE/graphTotalNumbersPlusBorder -20, GRAPHSIZE/2 +17);
	gridContext.fillText(String(-MAXNUMBER), GRAPHSIZE/2 +2, GRAPHSIZE-GRAPHSIZE/graphTotalNumbersPlusBorder+17);
	gridContext.stroke();
		gridContext.restore();
},
//////



	update: function () {
    //console.log('in update: ' + this.playerArrayPosition, this.playerXArray.length );
    if (playerTraversing) {
 
 //this.game.physics.arcade.collide(this.airplane, playerXArray[playerArrayPosition], this.collisionCallback, this.processCallback, this);
         // game.physics.arcade.collide(this.alien, sprite2, collisionCallback, processCallback, this);
      //console.log('updating button position');
   //      console.log('button position of ' + playerArrayPosition + ':' + playerXArray[playerArrayPosition] + ', ' + playerYArray[playerArrayPosition]);

             this.airplane.x = playerXArray[playerArrayPosition];
            this.airplane.y = playerYArray[playerArrayPosition];
            this.airplane.rotation = playerRotationArray[playerArrayPosition];
            for (var i = 0; i < this.pickupPiece.length; i++) {
              if (!this.pickupPiece[i].collected) {
            if (this.game.physics.arcade.distanceToXY(this.airplane, this.pickupPiece[i].x, this.pickupPiece[i].y) < COLLISIONDISTANCE) {
              this.collisionCallback(this.airplane, this.pickupPiece[i]);
            }
          }
          }
            playerArrayPosition++;
            if (playerArrayPosition > playerXArray.length) {
              playerArrayPosition = 0;
              playerTraversing = false;
              this.reset();

}
          }
    
	},

 processCallback: function(sprite1, sprite2) {
    console.log('in processCallback');
  },

  collisionCallback: function(sprite1, sprite2) {
    var tempTween;
    console.log('in collisionCallback');
   // sprite2.x = 600;
   // sprite2.y = 700;
   this.game.score++;
   this.game.scoreTextObject.text = String(this.game.score);
   sprite2.collected = true;
//sprite2.kill();
    tempTween = this.game.add.tween(sprite2).to({x: 600, y: SCOREPOSITIONY }, 500, Phaser.Easing.Back.Out, true);
    tempTween.onComplete.add(function() {
      //sprite2.kill();
    });
  },

    backToMenu: function (pointer) {

        this.state.start('MainMenu');

    }

};
//}());