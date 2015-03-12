// a prototype game object; note that the x and y values represent the center of the object not the upper left corner (draw function adjusts for this)
var gameItem = {
	x: 0, // x value of center of object
	y: 0,  // y value of center of object
	width: 0, // width of object
	height: 0, // height of object
	visible: true,
	imageSrc: null, // place to store name of image source file
	imageSrcXOffset: 0, // the x location of the upper left corner of the image in the atlas
	imageSrcYOffset: 0, // the y location of the upper left corner of the image in the atlas
	imageSrcWidth: 0, // the width of the image in the atlas
	imageSrcHeight: 0, // the height of the image in the atlas
	lastImageSrcX: 0, // the x value of the last image of this type in the atlas
	imageObj: null, // the atlas image object
	physicsBody: null,
	type: null, // type of item e.g. TARGET, OBSTACLE, PLAYER
	// a method to initialize the values
	initialize: function(x, y, width, height, imageObj, imageSrcXOffset, imageSrcYOffset, imageSrcWidth, imageSrcHeight, lastImageSrcX) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.imageObj = imageObj;
		this.imageSrcXOffset = imageSrcXOffset;
		this.imageSrcYOffset = imageSrcYOffset;
		this.imageSrcWidth = imageSrcWidth;
		this.imageSrcHeight = imageSrcHeight;
		this.lastImageSrcX = lastImageSrcX;
		},
	// a method to draw the object - adjusts x, y to upper left corner
	draw: function(gameContext) {
	if (this.visible) {
	gameContext.drawImage(this.imageObj, this.imageSrcXOffset, this.imageSrcYOffset, this.imageSrcWidth, this.imageSrcHeight, this.x-(this.width/2), this.y - (this.height/2), this.width, this.height);
	}
	}
	};
// A prototype to handle univariate equations in the form f(x) = xCoeff*x^xExponent + b	
var equationEntity = {
	xCoeff: 0, // the coefficient of x
	xExponent: 0, // the exponent of x
	b: 0, // the b value
	numPoints: 0, // the number of points to be plotted or displayed as images, used as a path, etc.
	pointsArray: null, // the array of the points
	minX: 0, // the boundaries
	maxX: 0,
	maxY: 0,
	
	initializeEquationSettings: function(xCoeff, xExponent, b, numPoints) {
	this.xCoeff = xCoeff;
	this.xExponent = xExponent;
	this.b = b;
	this.numPoints = numPoints;
	this.calculatePoints();
	},
	
	calculatePoints: function() {
	var xAtYMin;
	var xAtYMax;
	if (this.xExponent === 0 || this.xCoeff === 0) {
		this.maxX = MAXNUMBER;
		this.minX = -MAXNUMBER;
	}
	else
	{
	// find x value where f(x) reaches max and min values that can be displayed based on the maximum displayable number on the graph
	//	added workaround for odd roots of negative numbers since Math.pow returns NaN for those
	// 
	if (((this.xExponent % 2) !== 0) && (((MAXNUMBER-this.b)/this.xCoeff) < 0)) {
		xAtYMax = -Math.pow(Math.abs((MAXNUMBER-this.b)/this.xCoeff), 1/this.xExponent);
	}
	else {
		xAtYMax = Math.pow((MAXNUMBER-this.b)/this.xCoeff, 1/this.xExponent);
	}
	if (((this.xExponent % 2) !== 0) && (((-MAXNUMBER-this.b)/this.xCoeff) < 0)) {
		xAtYMin = -Math.pow(Math.abs((-MAXNUMBER-this.b)/this.xCoeff), 1/this.xExponent);
		}
	else {
		xAtYMin = Math.pow((-MAXNUMBER-this.b)/this.xCoeff, 1/this.xExponent);
	}
	
		if (isNaN(xAtYMin)  && isNaN(xAtYMax)) { 
			this.maxX = MAXNUMBER;
			this.minX = -MAXNUMBER;}
		else if (isNaN(xAtYMin)) { 
			this.minX = -Math.abs(xAtYMax);
			this.maxX = Math.abs(xAtYMax);}
		else if (isNaN(xAtYMax)) {
			this.minX = -Math.abs(xAtYMin);
			this.maxX = Math.abs(xAtYMin);}
		else if (xAtYMin < xAtYMax) {
			this.minX = -Math.abs(xAtYMin);
			this.maxX = Math.abs(xAtYMax);
		}
		else {
			this.minX = xAtYMax;
			this.maxX = xAtYMin;
		}
	}
	//If f(x) reaches MAXNUMBER of grid when x is out of bounds, set maxX to MAXNUMBER
			if (this.maxX > MAXNUMBER) {
			this.maxX = MAXNUMBER;}
			if (this.minX < -MAXNUMBER) {
			this.minX = -MAXNUMBER;}
			if ((this.xExponent === 0)  && (Math.abs(this.xCoeff + this.b) > MAXNUMBER)) {
				OUTSIDEGRAPHLIMITS = true;
				}
			else {
				OUTSIDEGRAPHLIMITS = false;
			}
		var currentx = this.minX;
		// scaleFactor calculation adds one to provide deadspace beyond MAXNUMBER; is doubled because range will be -MAXNUMBER to +MAXNUMBER
		var scaleFactor = GRAPHSIZE/((MAXNUMBER + 1)*2);
		// how much to increment x when calculating each point
		var xStep = (this.maxX - this.minX)/(this.numPoints-1);
		this.maxY = 0;
	if (!this.pointsArray) {
		this.pointsArray = new Array(this.numPoints); // only create a new array first time, otherwise pointsArray is recycled
		}
	// set values for x and y
		for (var i=0; i < this.numPoints; i++) {
			if (!this.pointsArray[i]) {
				this.pointsArray[i] = Object.create(gameItem); // only create first time; after that, recycle
				}
			this.pointsArray[i].x = currentx * scaleFactor + (GRAPHSIZE)/2 + GRAPHLOCX;
			this.pointsArray[i].y =  (GRAPHSIZE)/2 -(this.xCoeff*(Math.pow(currentx, this.xExponent)) + this.b) * scaleFactor + GRAPHLOCY;
			this.pointsArray[i].visible = true;
			currentx = currentx + xStep;
		}
	},
// plots the equation in red	
	draw: function(equationContext) {
	console.log('in draw: ' + this.xCoeff + 'x^' + this.xExponent + ' + ' + this.b);
		if (this.pointsArray) {
			equationContext.strokeStyle = "rgb(256, 0, 0)";
			equationContext.beginPath();
			equationContext.moveTo(this.pointsArray[0].x,this.pointsArray[0].y);
			for (var i=0; i < this.pointsArray.length; i++) {
			if (this.pointsArray[i].visible) {
			equationContext.lineTo(this.pointsArray[i].x, this.pointsArray[i].y);
		}
		}
		equationContext.stroke();
		}
	},

// add physics to the points of the equation
	addPhysics: function(entityType) {
	var equationPointFixture = new b2FixtureDef();
	equationPointFixture.density = 1.0;
	equationPointFixture.friction = 0.0;
	equationPointFixture.restitution = 1.0;
	equationPointFixture.filter.categoryBits = TARGET;
	equationPointFixture.filter.maskBits = PLAYER;
	var equationPointBodyDef = new b2BodyDef();
	equationPointBodyDef.type = b2Body.b2_dynamicBody;
	equationPointFixture.shape = new b2CircleShape((TARGETIMAGEWIDTH/2)/PHYSICSSCALEFACTOR);
	equationPointFixture.isSensor = true;
	for (var i=0; i < this.numPoints; i++) {
		equationPointBodyDef.position.x = this.pointsArray[i].x/PHYSICSSCALEFACTOR;
	equationPointBodyDef.position.y = this.pointsArray[i].y/PHYSICSSCALEFACTOR;
	equationPointBody = physicsWorld.CreateBody(equationPointBodyDef);
	equationPointBody.CreateFixture(equationPointFixture);
	equationPointBody.SetUserData(this.pointsArray[i]);
	this.pointsArray[i].physicsBody = equationPointBody;
	this.pointsArray[i].type = entityType;
		}

	},
	//update the physics positions based on values in the pointsArray
		updatePhysicsPositions: function() {
		for (var i=0; i < this.numPoints; i++) {
		this.pointsArray[i].physicsBody.SetPosition({x: this.pointsArray[i].x/PHYSICSSCALEFACTOR, y: this.pointsArray[i].y/PHYSICSSCALEFACTOR});
		}
		}
	};
	