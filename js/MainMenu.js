
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		 //this.music = this.add.audio('titleMusic');
		 //this.music.play();

		// this.add.sprite(0, 0, 'titlepage');

		// Add Main Menu Graphics
	    		

	    // Add "Click here to Play" Button
    this.add.sprite(0,0, 'equationBattleImages', 'background.png');
		this.playButton = this.add.button(160, 210, 'equationBattleImages', this.startGame, this, 'buttonOver.png', 'buttonOut.png', 'buttonOver.png');
		this.playButton.input.useHandCursor = true;

	},

	update: function () {

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		// this.music.stop();

		// And start the actual game
		this.state.start('Game');

	}

};
