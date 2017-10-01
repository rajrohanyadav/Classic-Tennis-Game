//global variables...
var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var paddle1Y = 250;
var paddle2Y = 250;
var player1Score = 0;
var player2Score = 0;
var gameEnd = false;

//all the constant declared...
const NET_WIDTH=2;
const NET_HEIGHT=20;
const BALL_RADIUS=7;
const PAD_HEIGHT = 100;
const PAD_WIDTH = 10;
const WINNING_SCORE = 15;

//main program to run when window loads...
window.onload = function () {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	var framePerSecond = 30;
	setInterval(function () {
		drawEverything();
		moveEverything();
	},1000/framePerSecond);
	canvas.addEventListener('mousedown',handleClickEvent);
	canvas.addEventListener('mousemove',
		function(evt){
			var mousePos = getMousePos(evt);
			paddle1Y = mousePos.y-(PAD_HEIGHT/2);
		});
}

//Handle the click event...
function handleClickEvent(evt){
	if(gameEnd){
		player1Score = 0;
		player2Score = 0;
		gameEnd = false;
	}
}

//function for getting the mouse coordinates...
function getMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{
		x:mouseX,
		y:mouseY
	}
}

//function for ball reset...
function ballReset(){
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
		gameEnd = true;
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

//function for drawing all the shapes on the window...
function drawEverything () {
	//black background...
	colorRect(0,0,canvas.width,canvas.height,'black');
	
	if(gameEnd){
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE){
			canvasContext.fillText('Left Player Won',350,200);
		}else if(player2Score >= WINNING_SCORE){
			canvasContext.fillText('Right Player Won',350,200);
		}
		canvasContext.fillText('click to continue',350,500);
		return;
	}
	
	//drawing the net...
	for (var i=0;i<canvas.height;i+=(NET_HEIGHT+7)) {
		colorRect((canvas.width/2)-(NET_WIDTH/2),i,NET_WIDTH,NET_HEIGHT,'white');
	}
	
	//drawing the ball...
	colorCircle(ballX,ballY,BALL_RADIUS,'white');
	
	//drawing the paddles...
	colorRect(0,paddle1Y,PAD_WIDTH,PAD_HEIGHT,'white');
	colorRect(canvas.width-PAD_WIDTH,paddle2Y,PAD_WIDTH,PAD_HEIGHT,'white');
	
	//Displaying the scores on the screen...
	canvasContext.fillText(player1Score,100,100);
	canvasContext.fillText(player2Score,canvas.width-100,100);
}

//function for the movement of the right paddle...
function computerMovement(){
	var paddleCenter = paddle2Y + (PAD_HEIGHT/2);
	if(paddleCenter < ballY-35){
		paddle2Y += 6;
	}else if(paddleCenter > ballY+35){
		paddle2Y -= 6;
	}
}

//function for moving everything on the window...
function moveEverything () {
	if(gameEnd){
		return;
	}
	//computer movement for the right paddle...
	computerMovement();
	
	//For the movement of the ball
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	if (ballX<0) {
		if(ballY>paddle1Y && ballY<paddle1Y+PAD_HEIGHT){
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle1Y + PAD_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		}else{
			player2Score++;
			ballReset();
		}
	}
	if(ballX>canvas.width){
		if(ballY>paddle2Y && ballY<paddle2Y+PAD_HEIGHT){
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle2Y + PAD_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		}else{
			player1Score++;
			ballReset();
		}
	}
	if (ballY<0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY>canvas.height){
		ballSpeedY = -ballSpeedY;
	}
}

//function to draw colored rectangles...
function colorRect (pointX, pointY, rectWidth, rectHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(pointX, pointY, rectWidth, rectHeight);
}

//function for drawing colored circle...
function colorCircle (centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}