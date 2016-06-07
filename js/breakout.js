//global variables
var canvas;
var context;

var gameLoop;

var bricksPerRow = 10;								
var brickHeight = 30;
var brickWidth = 102.4;

var paddleX = 200;
var paddleY = 600;
var paddleWidth = 250;
var paddleHeight = 40;
var paddleMoveX;
var paddleSpeedX = 10;
var paddleMove;



var ballX = 200;
var ballY = 500;
var ballRadius = 10;
var ballMoveX;
var ballMoveY;
var ballMove = [4,6,8,10];

var bounce = new Audio("single-howl.wav");
var breaking = new Audio("double-bark.wav");


var score = 0;
var level = 1;
var doge = 3;

var win;
var dead;

//random pick number from a range
function randomFromTo(from,to){
	return Math.floor(Math.random()*(to-from+1)+from);
}

//check whether the bricks list is empty
function checkBricks(){
	for (var i=0; i < bricks.length; i++) {
		for (var j=0; j < bricks[i].length; j++) {
			if (bricks[i][j] != 0){
				return false;
			}
		}
	}
	return true;


}

function createBricks(){
	var bricks = [[ ],[ ], [ ], [ ]];
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 10; j++){
			
			bricks[i].push(randomFromTo(1,3));
		}
	}
	return bricks;
}
var bricks = createBricks();
//test
//var bricks = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0]];


function drawPaddle(){
	paddle = $('#paddle')[0];	
	context.drawImage(paddle,paddleX,paddleY);
}

				
function drawBall(){
	ball = $('#ball')[0];	
	context.drawImage(ball,ballX,ballY);	
}				
				
				
		
				
function genBricks(){
	for (var i=0; i < bricks.length; i++) {
		for (var j=0; j < bricks[i].length; j++) {
			drawBrick(j,i,bricks[i][j]);
		}
	}
}

				// draw a single brick
function drawBrick(x,y,color){	
	switch(color){ // if brick is still visible; three colors for three types of bricks
		case 1:
			context.fillStyle = 'orange';
			break;
		case 2:
			context.fillStyle = 'green';						
			break;
		case 3:
			context.fillStyle = 'rgba(50,100,50,.5)';
			break;								
		default:
		// clear the rectangle for 0
			context.clearRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
			break;

	}
	if (color){
		//Draw rectangle with selected color
		context.fillRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
		// Also draw blackish border around the brick
		context.strokeRect(x*brickWidth+1,y*brickHeight+1,brickWidth-2,brickHeight-2);
	} 
}	
				
				
function moveBall(){
	//reach the top the window or collison with the brick, then reverse ball's Y direction		
    if (ballY + ballMoveY - ballRadius < 0  || touchBricksY()){
		ballMoveY = -ballMoveY;
		bounce.play();
	}

	//reach the bottom of the window, game over
	if (ballY + ballMoveY + ballRadius > 620){
		stopGame();
	}


        

	
	//reach the left or right side of the window,reverse ball's X direction
	if ((ballX + ballMoveX - ballRadius < -5) || (ballX + ballMoveX + ballRadius > WIDTH - 45)
		|| touchBricksX()){  
			ballMoveX = -ballMoveX;
				bounce.play();
	}

	//reach the top of the paddle, and the ball is in paddle's range
	if (ballY + ballMoveY + ballRadius >= paddleY - 25){
					
		if (ballX + ballMoveX >= paddleX && ballX + ballMoveX <= paddleX + paddleWidth){
			ballMoveY = - ballMoveY;
	        bounce.play();
		}
	}

	//update the ball
	ballX = ballX + ballMoveX;
	ballY = ballY + ballMoveY;
}
				
function explodeBrick(i,j){
					
	bricks[i][j] --;
    if (bricks[i][j]>0){ 
		score++;
	} else {
		score += 2;		
		breaking.play();
	}
}
				

function touchBricksX(){
	var collisonX = false;	
	for (var i=0; i < bricks.length; i++) {
		for (var j=0; j < bricks[i].length; j++) {
			if (bricks[i][j]){ // if brick is still visible
				var brickX = j * brickWidth;
				var brickY = i * brickHeight;
				if (
					((ballX + ballMoveX + ballRadius >= brickX) && (ballX + ballRadius <= brickX))
					||
					((ballX + ballMoveX - ballRadius<= brickX + brickWidth)
						&&(ballX - ballRadius >= brickX + brickWidth))
				){		
					if ((ballY + ballMoveY -ballRadius<= brickY + brickHeight) &&
						(ballY + ballMoveY + ballRadius >= brickY)){													
							explodeBrick(i,j);
						    collisonX = true;
					}
				}
			}
	    }
	}
	return collisonX;
}				


function touchBricksY(){
    var collisonY = false;
	for (var i=0; i < bricks.length; i++) {
		for (var j=0; j < bricks[i].length; j++) {
			if (bricks[i][j]){ // if brick is still visible
				var brickX = j * brickWidth;
				var brickY = i * brickHeight;
				if (
					((ballY + ballMoveY - ballRadius <= brickY + brickHeight) 
						&& (ballY - ballRadius >= brickY + brickHeight))
					||
					((ballY + ballMoveY + ballRadius >= brickY) && (ballY + ballRadius <= brickY ))
				){
					if (ballX + ballMoveX + ballRadius >= brickX && 
						ballX + ballMoveX - ballRadius<= brickX + brickWidth){										
							explodeBrick(i,j);							
							collisonY = true;
					}						
				}
			}
	    }
	}
	return collisonY;
}

function movePaddle(){
	if (paddleMove == 'LEFT'){
		paddleMoveX = -paddleSpeedX;
	} else if (paddleMove == 'RIGHT'){
		paddleMoveX = paddleSpeedX;
	} else {
		paddleMoveX = 0;
	}
	//reach the side of the window, stop moving				
	if (paddleX + paddleMoveX < -20 || paddleX + paddleMoveX +paddleWidth >WIDTH + 20){
		paddleMoveX = 0; 
	}
	//update the position of the paddle
	paddleX = paddleX + paddleMoveX;
}

function displayInfo(){
	context.fillStyle = 'black';
	context.font = '40px system';
	//clear the top 30 pixels of the canvas
	context.clearRect(0,700,canvas.width,68);	
	context.fillText('Score: '+score + 
	'                         ' 
	+'Doge: ' + doge +    
    '                         ' 
	+ 'Level: ' + level,10,750);
}


				
function animate () {

	context.clearRect(0,0,WIDTH,LENGTH);
	genBricks();
	displayInfo();
					
	moveBall();
	movePaddle();
					
	drawPaddle();
	drawBall();

    if (checkBricks()){
    	clearInterval(gameLoop);
    	if (level == 3){
    		//win the game
    		win = $('#win')[0];

	    	context.drawImage(win,200,50);
			context.fillText('Wow you win the game!',290,600);
			displayInfo();	

    	}
    	else {

    		level += 1;
    		bricks = createBricks();
    		//bricks = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0]];
    		ballX = 200;
            ballY = 500;
            paddleX = 200;
            paddleY = 600;
            if (doge > 0){
            startGame(level);
        }

    	}

    }
	
					
	
    
}
				
			

function startGame(level){
	
	ballMoveY = ballMove[level];
	ballMoveX = ballMove[level-1];
	paddleMove = 'NONE';
	paddleMoveX = 0;

	gameLoop = setInterval(animate,20);

					// Start Tracking Keystokes
	$(document).keydown(function(e) {
		if (e.keyCode == 39) {
			paddleMove = 'RIGHT';
		} else if (e.keyCode == 37){
			paddleMove = 'LEFT';
			}
	});			

    $(document).keyup(function(e) {
		if (e.keyCode == 39) {
			paddleMove = 'NONE';
		} else if (e.keyCode == 37){
			paddleMove = 'NONE';
			}
	});
}



function stopGame(){
	clearInterval(gameLoop);
    doge = doge - 1;
	
	context.font="60px Arial";
	if (doge == 0){
		dead = $('#dead')[0];

	    context.drawImage(dead,360,300);
		context.fillText('Game Over',350,600);
		displayInfo();	

    }else if (doge > 0){
    	context.clearRect(0,0,WIDTH,LENGTH);
    	ballX = 200;
        ballY = 500;
        paddleX = 200;
        paddleY = 600;
        if (doge > 0){
        startGame(level);
    }
    	//context.fillText('Much bad! Press "r" to restart',350,600);

    }
}


function init(){
	canvas = $('#game')[0];
    context = canvas.getContext('2d');

    //canvas.width = 800;
    //canvas.height = 600;
    canvas.style.left = "100px";
    //canvas.style.top = "100px";
    canvas.style.position = "absolute";
	WIDTH = canvas.width;
	LENGTH = canvas.height;
	context.font = '40px system';
    context.fillText('Wow! Press "p" to pause!',180,600);
    //setTimeout(startGame(level),2000);
	//$(document).keyup(function(e){
		//if (e.keyCode == 83){
			//if (doge > 0){
			//clearInterval(gameLoop);
			//startGame(level);
		    //}
        //}
        //if (e.keyCode == 80){
			//clearInterval(gameLoop);
        //}
	//});
    startGame(level);

}
