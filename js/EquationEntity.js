// a prototype game object; note that the x and y values represent the center of the object not the upper left corner (draw function adjusts for this)
var equationPoint = {
	x: 0, // x value of center of object
	y: 0,  // y value of center of object
	visible: true,
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
	pointsArray: [], // the array of the points
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
	// set values for x and y
		for (var i=0; i < this.numPoints; i++) {
			if (!this.pointsArray[i]) {
				console.log('creating new point');
				this.pointsArray[i] = Object.create(equationPoint); // only create first time; after that, recycle
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
	}
	};
	