Breakout 

Documentation
This project is a doge version of the breakout game. The whole project is based on HTML5,CSS3,Javascript,DOM and Canvas. To implement this game, we use several global variables to define the objects used in this project. 

First of all, we use two images to be the paddle and the ball, and draw them on certain position of the canvas. Then we create a bricks array,and draw the brick on the top of the canvas by this array. If we continue to draw the ball and paddle  on different position in a short time, the ball and paddle will move, it is same as the animation. Thus, the core idea of this game is using setInterval to draw the ball, paddle and bricks continuously, and update the position (change the x,y coordinate)of the ball and paddle on each drawing. Moreover, when the ball hits a brick, we update the bricks array, so this brick will change its colour or disappear. 

Players have 3 life to play this game and it has 3 level to clear, the speed of the ball becomes quicker in higher rank. The game is fixed in 1280*980 pixels.
