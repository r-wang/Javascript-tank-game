/**
 * In this file, class MyTank and EnemyTank both extend from the parent class
 * Agent. Bullet class is a standalone class but it's referenced by all the tank
 * classes.
 */

Math.guid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	}).toUpperCase();
};// this guid function is from the book javascript web applications

/** ************START of class definitions in this file************************* */
/**
 * Agent based modelling. Agents include various tanks in this case
 */
function Agent(x, y) {
	this.guid = 0;// guid for the agent

	this.x = x; // x position in number of grids
	this.y = y; // y position in number of grids

	this.offsetX = 10; // horizontal offset in pixels, which is also border
	// width
	this.offsetY = 10; // vertical offset in pixels, which is also border width

	this.width = 40; // grid width
	this.height = 40; // grid height

	this.speed = 10;// the number of pixels to move upon each event
	this.facing = "up";// values range from up, right, left and down

	// check landmap on barriers to move
	this.checkCollision = function(posx, posy) {
		var gridType = landMap[posy][posx];
		if ((gridType == RIVER) || (gridType == STEEL) || (gridType == BRICK)
				|| (gridType == EAGLE)) {

			return true;
		}
	};

	this.deRender = function() {
		var div = document.getElementById(this.guid);
		div.parentNode.removeChild(div);
	}
	/*
	 * Moves agent to the right with the speed defined previously. Won't move if
	 * reaches border
	 */
	this.moveRight = function() {
		this.facing = "right";
		var div = document.getElementById(this.guid);
		div.style.backgroundPosition = "0px -40px";
		if (this.x < 12) {
			if (this.checkCollision(this.x + 1, this.y)) {
				return;
			}
			this.x = this.x + 1;
			;
			div.style.left = (this.x) * this.width + this.offsetX + "px";
		}

	};

	/*
	 * Moves agent to the left with the speed defined previously. Won't move if
	 * reaches border
	 */
	this.moveLeft = function() {
		this.facing = "left";
		var div = document.getElementById(this.guid);
		div.style.backgroundPosition = "0px -120px";

		if (this.x > 0) {
			if (this.checkCollision(this.x - 1, this.y)) {
				return;
			}
			this.x = this.x - 1;
			div.style.left = (this.x) * this.width + this.offsetX + "px";
		}
	};
	/*
	 * Moves agent upwards with the speed defined previously. Won't move if
	 * reaches border
	 */
	this.moveUp = function() {
		this.facing = "up";
		var div = document.getElementById(this.guid);
		div.style.backgroundPosition = "0px 0px";
		if (this.y > 0) {
			if (this.checkCollision(this.x, this.y - 1)) {
				return;
			}
			this.y = this.y - 1;
			;
			div.style.top = (this.y) * this.height + this.offsetY + "px";

		}
	};
	/*
	 * Moves agent downwards with the speed defined previously. Won't move if
	 * reaches border
	 */
	this.moveDown = function() {
		this.facing = "down";
		var div = document.getElementById(this.guid);
		div.style.backgroundPosition = "0px -80px";
		if (this.y < 12) {
			if (this.checkCollision(this.x, this.y + 1)) {
				return;
			}
			this.y = this.y + 1;
			;
			div.style.top = (this.y) * this.height + this.offsetY + "px";

		}
	};
	// fire bullets
	this.fire = function() {
		var bullet = new Bullet(this.x, this.y);
		bullet.direction = this.facing;
		bullet.createBullet();
		bullets.push(bullet);
	}
}

function Bullet(x, y) {
	this.guid = Math.guid;// guid for the agent

	this.direction = "up";

	this.x = x; // x position in number of grids
	this.y = y; // y position in number of grids

	this.offsetX = 10; // horizontal offset in pixels, which is also border
	// width
	this.offsetY = 10; // vertical offset in pixels, which is also border width

	this.directionOffsetX = 0;
	this.directionOffsetY = 0;

	this.width = 40; // grid width
	this.height = 40; // grid height

	this.speed = 10;// the number of pixels to move upon each event

	this.owner = null;

	this.checkCollision = function(posx, posy) {
		var gridType = landMap[posy][posx];
		if ((gridType == BRICK)) {
			var section = document.getElementById(posx + "" + posy);
			section.removeChild(section.childNodes[0]);
			landMap[posy][posx] = LAND;
			return true;
		}
		if (gridType == EAGLE) {
			var section = document.getElementById(posx + "" + posy);
			section.removeChild(section.childNodes[0]);
			landMap[posy][posx] = LAND;
			gameOver();
		}
		if (gridType == STEEL) {
			return true;
		}
		if (this.owner == "enemytank") {
			if ((myTank.x == posx) && (myTank.y == posy)) {
				myTank.deRender();
				gameOver();
				return true;
			}
		}
		if (this.owner == "mytank") {
			for ( var p = 0; p < enemyTanks.length; p++) {
				if ((enemyTanks[p].x == posx) && (enemyTanks[p].y == posy)) {
					enemyTanks[p].deRender();
					enemyTanks.splice(p, 1);
					return true;
				}
			}
			return false;
		}
		return false;
	};

	this.move = function() {
		if (this.isHit) {
			this.speed = 0;
		}
		switch (this.direction) {
		case "up":
			var bullet = document.getElementById(this.guid);
			var bullet_top = bullet.style.top;
			bullet_top = bullet_top.substring(0, bullet_top.length - 2);
			temp = parseInt(bullet_top) - this.speed;
			var left = parseInt(bullet.style.left.substring(0,
					bullet.style.left.length - 2));
			var top = parseInt(bullet.style.top.substring(0,
					bullet.style.top.length - 2));
			top = top - this.speed;
			var gridX = Math.floor(top / 40);
			var gridY = Math.floor(left / 40);
			if (gridX < 0) {
				this.explode();
				return;
			}
			if (!this.checkCollision(gridY, gridX)) {
				bullet.style.top = top + "px";
			} else {
				this.explode();
			}

			break
		case "down":
			var bullet = document.getElementById(this.guid);
			var bullet_top = bullet.style.top;
			bullet_top = bullet_top.substring(0, bullet_top.length - 2);
			temp = parseInt(bullet_top) - this.speed;
			var left = parseInt(bullet.style.left.substring(0,
					bullet.style.left.length - 2));
			var top = parseInt(bullet.style.top.substring(0,
					bullet.style.top.length - 2));
			top = top + this.speed;
			var gridX = Math.floor(top / 40);
			var gridY = Math.floor(left / 40);
			if (gridX >= 13) {
				this.explode();
				return;
			}
			if (!this.checkCollision(gridY, gridX)) {
				bullet.style.top = top + "px";
			} else {
				this.explode();
			}
			break
		case "right":
			var bullet = document.getElementById(this.guid);
			var bullet_top = bullet.style.top;
			bullet_top = bullet_top.substring(0, bullet_top.length - 2);
			temp = parseInt(bullet_top) - this.speed;
			var left = parseInt(bullet.style.left.substring(0,
					bullet.style.left.length - 2));
			var top = parseInt(bullet.style.top.substring(0,
					bullet.style.top.length - 2));
			left = left + this.speed;
			var gridX = Math.floor(top / 40);
			var gridY = Math.floor(left / 40);
			if (gridY >= 13) {
				this.explode();
				return;
			}
			if (!this.checkCollision(gridY, gridX)) {
				bullet.style.left = left + "px";
			} else {
				this.explode();
			}
			break
		break
	case "left":
		var bullet = document.getElementById(this.guid);
		var bullet_top = bullet.style.top;
		bullet_top = bullet_top.substring(0, bullet_top.length - 2);
		temp = parseInt(bullet_top) - this.speed;
		var left = parseInt(bullet.style.left.substring(0,
				bullet.style.left.length - 2));
		var top = parseInt(bullet.style.top.substring(0,
				bullet.style.top.length - 2));
		left = left - this.speed;
		var gridX = Math.floor(top / 40);
		var gridY = Math.floor(left / 40);
		if (gridY < 0) {
			this.explode();
			return;
		}
		if (!this.checkCollision(gridY, gridX)) {
			bullet.style.left = left + "px";
		} else {
			this.explode();
		}
		break
	default:
		break
	}
	this.removeBullet = function() {

		for ( var r = 0; r < bullets.length; r++) {
			if (this.guid == bullets[r].guid) {
				bullets.splice(r, 1);
			}
		}
		var div = document.getElementById(this.guid);
		// document.write(div);

		div.parentNode.removeChild(div);
	}
	this.explode = function() {
		this.removeBullet();
	}
}

	this.createBullet = function() {
		var container = document.createElement('div');
		document.body.appendChild(container);
		this.guid = Math.guid();

		var bullet = document.createElement('div');

		switch (this.direction) {
		case "up":
			bullet.style.backgroundPosition = "0px 0px";
			break
		case "down":
			bullet.style.backgroundPosition = "0px -80px";
			break
		case "right":
			bullet.style.backgroundPosition = "0px -40px";
			break
		case "left":
			bullet.style.backgroundPosition = "0px -120px";
			break
		default:
			break
		}

		container.appendChild(bullet);
		bullet.id = this.guid;
		bullet.className = "bomb";
		bullet.style.position = "absolute";
		bullet.style.left = (this.x) * this.width + this.offsetX + "px";
		bullet.style.top = (this.y) * this.height + this.offsetY + "px";
	}

}

/**
 * My tank class
 */
function MyTank(x, y) {
	Agent.call(this, x, y);
}
/**
 * Enemy tanks class
 */
function EnemyTank(x, y) {
	Agent.apply(this, [ x, y ]);
}

/*
 * create my tank with defined positions
 */
MyTank.prototype.createTank = function() {
	var container = document.createElement('div');
	document.body.appendChild(container);
	this.guid = Math.guid();

	var tank = document.createElement('div');

	container.appendChild(tank);
	tank.id = this.guid;
	tank.className = "itank";
	tank.style.position = "absolute";
	tank.style.left = (this.x) * this.width + this.offsetX + "px";
	tank.style.top = (this.y) * this.height + this.offsetY + "px";

	this.fire = function() {
		var bullet = new Bullet(this.x, this.y);
		bullet.owner = "mytank";
		bullet.direction = this.facing;
		bullet.createBullet();
		bullets.push(bullet);
	}
}

/*
 * create an enemy tank with defined positions
 */
EnemyTank.prototype.createTank = function() {
	var container = document.createElement('div');
	document.body.appendChild(container);
	this.guid = Math.guid();

	var tank = document.createElement('div');

	container.appendChild(tank);
	tank.id = this.guid;
	tank.className = "etank";
	tank.style.position = "absolute";
	tank.style.left = (this.x) * this.width + this.offsetX + "px";
	tank.style.top = (this.y) * this.height + this.offsetY + "px";

	this.fire = function() {
		var bullet = new Bullet(this.x, this.y);
		bullet.owner = "enemytank";
		bullet.direction = this.facing;
		bullet.createBullet();
		bullets.push(bullet);
	}
}

EnemyTank.prototype.moveRandomly = function() {
	var random = Math.random() * 4;
	if ((random >= 0) && random < 1) {
		this.moveRight();
	}
	if ((random >= 1) && random < 2) {
		this.moveLeft();
	}
	if ((random >= 2) && random < 3) {
		this.moveUp();
	}
	if ((random >= 3) && random < 4) {
		this.moveDown();
	}
}

/*
 * Moves agent to a certain position marked by x and y positions in pixels.
 * 
 * Note: this function is NOT currently used but kept any way for future
 * extension purposes
 */
Agent.prototype.moveTo = function(newx, newy) {
	var image = document.getElementById(this.guid);
	image.style.left = newx + "px";
	this.x = newx;
	image.style.top = newy + "px";
	this.y = newy;
}
/** ************END of class definitions in this file************************* */

/** ************START of game logic and event binding************************* */
/*
 * Manages current in-the-air bullets
 */

var bullets = new Array;
setInterval("shootBullets()", 30);
function shootBullets() {

	for ( var k = 0; k < bullets.length; k++) {
		bullets[k].move();
		if (enemyTanks.length == 0) {
			win();
		}
	}
}
function win() {
	alert("Well Done! Win! You may have another round");
	window.location.reload();
}
function gameOver() {
	alert("Game Over! But you may try another round!");
	window.location.reload();
}
/*
 * global variables myTank and enemyTanks are initialized with load methods
 * defined in map.js and the methods to initialize are invoked in main.js
 */
var myTank;// an instance of MyTank class
var enemyTanks = new Array();// array of instances of EnemyTank class

/*
 * For enemy tanks to move and fire.
 */
setInterval("randomMove()", 1000);
function randomMove() {
	for ( var p = 0; p < enemyTanks.length; p++) {
		enemyTanks[p].moveRandomly();
		enemyTanks[p].fire();
	}
}

/*
 * Listens to arrow keys movements, which would control tanks' movements.
 * 
 * NOTE: The implementation below right now ONLY supports IE and Chrome as
 * tested. It would fail on firefox and possibly other web browsers too.
 */
document.onkeydown = keylistener;
function keylistener(e) {

	e = e ? e : window.event;
	var keynum = e.which ? e.which : e.keyCode;

	var arrows = new Array();
	arrows['87'] = 'up';// key w
	arrows['83'] = 'down';// key s
	arrows['65'] = 'left';// key a
	arrows['68'] = 'right';// key d

	move(arrows[keynum]);

	if (keynum == 74) {// 74 is keycode for "j"
		myTank.fire();
	}
}

/*
 * My tank's movement function
 */
function move(direction) {
	switch (direction) {
	case 'up':
		myTank.moveUp();
		break;
	case 'down':
		myTank.moveDown();
		break;
	case 'left':
		myTank.moveLeft();
		break;
	case 'right':
		myTank.moveRight();
		break;
	}
}
