
	
	
	var canvas;
	var ctx;
	var ball;
	var paddle;
	//D - Default, Old - Old position, no suffix - current
	var paddleXD = 512;
	var paddleYD = 655;
	var paddleX = 0;
	var paddleXOld = 0;
	
	//ball params
	var ballx = 612;
	var bally = 610;
	
	//moving speed
	var moveX = 2;
	var moveY = 2;
	
	var WIDTH;
	var LENGTH;
	
	var brickBottom = 235;
	
	var appConfig = {
    'initX': 10,
    'initY': 10,
	'initBrickY' : 50,
	'blockSizeX': 100,
	'blockSizeY': 20	
  	};
	
	var ColourList = {
	1:1212,
	2:3232,
	3:4544
	};
	
	function init(){
		canva = $('#game')[0];
		ctx = canva.getContext('2d');
		WIDTH = canva.width;
		LENGTH = canva.height;
		ctx.font = '20px system';
		ctx.fillText("Score:",10,20);
		ctx.fillText("Level:",450,20);
		ctx.fillText("Life:",910,20);
		
		paddle = $('#paddle')[0];	
		ctx.drawImage(paddle,paddleXD,paddleYD);		
		
		//keep moving the balls, it never stops ! 
		return setInterval(drawBall, 10);	
	}
	
	function clear(){
		ctx.clearRect(0,brickBottom,WIDTH,LENGTH-brickBottom - 108);
	}
	
	function drawBall(){
		clear();
		
		ball = $('#ball')[0];
		
		//if go out of boundary, go opposite direction
		
		if(ballx> (WIDTH-30) || ballx<0){
			moveX = 0 - moveX;
		}
		if(bally>(paddleYD-45) || bally<brickBottom){
			moveY = 0 - moveY;
		}
		
		ctx.drawImage(ball,ballx,bally);
		
		ballx += moveX;
		bally -= moveY;
	}

	
	function drawBricks(){
		var i;
		for (i = 1; i <= 10; i++) { //row
			var yCord = appConfig['initBrickY'] * i;
			var n;
			for(n=1;n<=10;n++){ //column
				var xCord = appConfig['initX'] * n;
			}
		}
	}
	
	function MovePaddle(e){
		paddleXOld = paddleX;
		paddleYOld = paddleY;
		switch (e.keyCode) {
			case 37: //left arrowkey
			  	paddleX = paddleX - 5;
				break;
			case 38: //right arrowkey
				paddleY = paddleX + 5;
				break;
		}
		
	}