var MAXNUMBER = 4; // the max number of the grid
var MAXGRAPHSIZE = 640;
var GRAPHSIZE = MAXGRAPHSIZE; // the width and height in pixels of the graph - recalculated later based on window size
var GRAPHLOCX = 0; // the x value upper left corner of the graph
var GRAPHLOCY = 0; // the y value of the upper left corner of the graph
var TICKMARKSIZE = 5; // length of the tickmarks on the graph
var XCOEFFPOSITIONX = 100;
var XCOEFFPOSITIONY = GRAPHSIZE+100;
var XEXPONENTPOSITIONX = 100 + 100;
var XEXPONENTPOSITIONY = GRAPHSIZE+100;
var BPOSITIONX = 100 + 100+ 100;
var BPOSITIONY = GRAPHSIZE+100;

BasicGame.Game = function (game) {
  var draggingInProgress = false;
  var currentDraggedItem = null;
  var xCoefficientBox = null;
    var xExponentBox = null;

  var BTermBox = null;

  var currentXCoefficient = null;
  var currentXExponent = null;
  var currentBTerm = null;

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

        this.piecesleft = 9;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

	this.bmd = this.game.make.bitmapData(GRAPHSIZE, GRAPHSIZE);
				this.bmd.dirty = true;
				this.bmd.addToWorld();
this.bmd.strokeStyle = '#f00';
this.drawGrid(this.bmd.ctx);
this.userEquation = Object.create(equationEntity);
	this.userEquation.initializeEquationSettings(3 , 2, -2, 60);
		this.userEquation.draw(this.bmd.ctx);
        this.xCoefficientBox = this.add.sprite(XCOEFFPOSITIONX, XCOEFFPOSITIONY, 'equationBattleImages', 'boxsmall.png');
        this.xCoefficientBox.anchor.setTo(0.5, 0.5);
        this.currentXExponent = this.add.sprite(XEXPONENTPOSITIONX, XEXPONENTPOSITIONY, 'equationBattleImages', 'boxsmall.png');
        this.currentXExponent.anchor.setTo(0.5, 0.5);
        this.BTermBox = this.add.sprite(BPOSITIONX, BPOSITIONY, 'equationBattleImages', 'boxsmall.png');
        this.BTermBox.anchor.setTo(0.5, 0.5);

this.gamePieces = this.add.group();
			for (var i = 0; i < 9; i++) {
				newGamePiece = this.gamePieces.create(i*54, GRAPHSIZE + 20, 'equationBattleImages', 'woodtile.png');
				newGamePiece.value = i;
                newGamePiece.anchor.setTo(0.5, 0.5);
				newGamePiece.inputEnabled = true;
				newGamePiece.input.enableDrag(true, true, true, 1, null, null);
				newGamePiece.finalPositionX = XCOEFFPOSITIONX;
				newGamePiece.finalPositionY = XCOEFFPOSITIONY;
				newGamePiece.originX = newGamePiece.x;
				newGamePiece.originY = newGamePiece.y;
				newGamePiece.input.useHandCursor = true;
                newGamePiece.textObject = this.add.text(newGamePiece.x, newGamePiece.y, i +' x ', { font: "italic 24px Palatino", fill: "#000000", align: "center" });
	           newGamePiece.textObject.anchor.setTo(0.5, 0.5);
                newGamePiece.events.onDragStart.add(this.dragStarted, this);
				newGamePiece.events.onDragStop.add(this.dragReleased, this);
			};
console.log('length of gamePieces group: ' + this.gamePieces.length);
//        this.bmdsprite = this.add.sprite(240, 240, this.bmd);
//		this.bmdsprite.anchor.setTo(0.5, 0.5);
     
	},
//////
// draw the coordinate grid 
drawGrid: function(gridContext) {
    console.log('in drawGrid: ' + GRAPHLOCX + ', ' +GRAPHLOCY + ', ' + GRAPHSIZE)
	gridContext.save();
	gridContext.translate(GRAPHLOCX, GRAPHLOCY);
	gridContext.fillStyle = "rgba(0, 256, 0, .5)";
	gridContext.strokeStyle = "rgba(0, 256, 0, .5)";
	gridContext.beginPath();
	//draw y axis
	gridContext.moveTo(GRAPHSIZE/2, 0);
	gridContext.lineTo(GRAPHSIZE/2, GRAPHSIZE);
	//draw x axis
	gridContext.moveTo(0, 0 + GRAPHSIZE/2);
	gridContext.lineTo(GRAPHSIZE, GRAPHSIZE/2);
	for (var i=2; i < 9; i++) {
		gridContext.moveTo( (GRAPHSIZE/10) -TICKMARKSIZE, i*(GRAPHSIZE/10));
		gridContext.lineTo((GRAPHSIZE/10) + TICKMARKSIZE, i * (GRAPHSIZE/10));
		gridContext.moveTo( (GRAPHSIZE/2) -TICKMARKSIZE, i*(GRAPHSIZE/10));
		gridContext.lineTo((GRAPHSIZE/2) + TICKMARKSIZE, i * (GRAPHSIZE/10));
		gridContext.moveTo( GRAPHSIZE-(GRAPHSIZE/10) -TICKMARKSIZE, i*(GRAPHSIZE/10));
		gridContext.lineTo(GRAPHSIZE - (GRAPHSIZE/10) + TICKMARKSIZE, i * (GRAPHSIZE/10));
		gridContext.moveTo(i * (GRAPHSIZE/10), (GRAPHSIZE/2)-TICKMARKSIZE);
		gridContext.lineTo(i * (GRAPHSIZE/10), (GRAPHSIZE/2)+TICKMARKSIZE);
		gridContext.moveTo(i * (GRAPHSIZE/10), (GRAPHSIZE/10)-TICKMARKSIZE);
		gridContext.lineTo(i * (GRAPHSIZE/10), (GRAPHSIZE/10)+TICKMARKSIZE);
		gridContext.moveTo(i * (GRAPHSIZE/10), GRAPHSIZE -(GRAPHSIZE/10)-TICKMARKSIZE);
		gridContext.lineTo(i * (GRAPHSIZE/10), GRAPHSIZE - (GRAPHSIZE/10)+TICKMARKSIZE);
		}
	gridContext.rect(GRAPHSIZE/10, GRAPHSIZE/10, GRAPHSIZE-2*(GRAPHSIZE/10), GRAPHSIZE-2*GRAPHSIZE/10);
	gridContext.fillText('4', GRAPHSIZE-GRAPHSIZE/10 +2, GRAPHSIZE/2 + 17);
	gridContext.fillText('4', GRAPHSIZE/2 + 2, GRAPHSIZE/10+17);
	gridContext.fillText('-4', GRAPHSIZE/10 -20, GRAPHSIZE/2 +17);
	gridContext.fillText('-4', GRAPHSIZE/2 +2, GRAPHSIZE-GRAPHSIZE/10+17);
	gridContext.stroke();
		gridContext.restore();
},
//////

    dragStarted: function (draggedObject) {
        this.draggingInProgress = true;
        this.currentDraggedItem = draggedObject;
    },

    dragReleased: function(item) {
        // If the distance from final position is less than 50 then tween to final position else tween back to initial position
        if (this.game.physics.arcade.distanceToXY( item , item.finalPositionX, item.finalPositionY) < 50) {
			item.bmd = this.game.make.bitmapData(GRAPHSIZE, GRAPHSIZE);
				item.bmd.dirty = true;
				item.bmd.addToWorld();
        	this.userEquation2 = Object.create(equationEntity);
	this.userEquation2.initializeEquationSettings(item.value , 2, -2, 60);
		this.userEquation2.draw(item.bmd.ctx);	   
            this.game.add.tween(item).to({x: item.finalPositionX, y: item.finalPositionY }, 500, Phaser.Easing.Back.Out, true);
}
else {
//		var target_angle = this.bmdsprite.angle - 180;
//		this.game.add.tween(this.bmdsprite).to({angle: this.bmdsprite.angle - 180}, 1000).start();
//this.bmdsprite.rotation = this.bmdsprite.rotation + 3.141519;
            this.game.add.tween(item).to({x: item.originX, y: item.originY }, 500, Phaser.Easing.Back.Out, true);
//item.bmd.clear();
}
    },

	update: function () {
         if (this.draggingInProgress == true && this.currentDraggedItem) {
             //console.log('dragging');
             //this.currentDraggedItem.textObject.reset(this.currentDraggedItem.x - 5, this.currentDraggedItem.y);
             this.currentDraggedItem.textObject.x = this.currentDraggedItem.x;
             this.currentDraggedItem.textObject.y = this.currentDraggedItem.y;
            // this.currentDraggedItem.zIndex = 0;

        }
    
	},

    backToMenu: function (pointer) {

        this.state.start('MainMenu');

    }

};
