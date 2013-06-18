/**
 * All the rest of the classes in this file extend from Block class as the
 * parent class
 */

function Block(x, y) {
	// cell width and height in pixels
	this.width = 40;
	this.height = 40;

	// initial position in terms of number of grids
	this.x = x;
	this.y = y;

	// uid for this object
	this.id = 0;

	// interface: create a block on the view and in the model
	this.createBlock = function() {
	}

	// deletes this block from the view and model
	this.deleteBlock = function() {
		var div = document.getElementById(x + "" + y);
		div.removeChild(div.childNodes[0]);
		landMap[x, y] = LAND;
	}

}

function Brick(x, y) {
	Block.apply(this, [ x, y ]);
	/*
	 * create a dom with brick image, position it according to x and y, and set
	 * its size according to defined fixed grid width
	 */
	this.createBlock = function() {
		var brick = document.createElement('div');
		document.getElementById(x + "" + y).appendChild(brick);
		brick.className = "brick";
		brick.style.position = "absolute";
		brick.style.width = this.width + "px";
		brick.style.height = this.height + "px";
		brick.style.left = (this.x) * this.width + "px";
		brick.style.top = (this.y) * this.height + "px";
	}
}

function Steel(x, y) {
	Block.apply(this, [ x, y ]);

	/*
	 * create a dom with steel image, position it according to x and y, and set
	 * its size according to defined fixed grid width
	 */
	this.createBlock = function() {
		var steel = document.createElement('div');
		document.getElementById(x + "" + y).appendChild(steel);
		steel.className = "steel";
		steel.style.position = "absolute";
		steel.style.width = this.width + "px";
		steel.style.height = this.height + "px";
		steel.style.left = (this.x) * this.width + "px";
		steel.style.top = (this.y) * this.height + "px";
	}

}
function River(x, y) {
	Block.apply(this, [ x, y ]);

	/*
	 * create a dom with river image, position it according to x and y, and set
	 * its size according to defined fixed grid width
	 */
	this.createBlock = function() {
		var steel = document.createElement('div');
		document.getElementById(x + "" + y).appendChild(steel);
		steel.className = "river";
		steel.style.position = "absolute";
		steel.style.width = this.width + "px";
		steel.style.height = this.height + "px";
		steel.style.left = (this.x) * this.width + "px";
		steel.style.top = (this.y) * this.height + "px";
	}
}

function Grass(x, y) {
	Block.apply(this, [ x, y ]);

	/*
	 * create a dom with grass image, position it according to x and y, and set
	 * its size according to defined fixed grid width
	 */
	this.createBlock = function() {
		var steel = document.createElement('div');
		document.getElementById(x + "" + y).appendChild(steel);
		steel.className = "grass";
		steel.style.position = "absolute";
		steel.style.width = this.width + "px";
		steel.style.height = this.height + "px";
		steel.style.left = (this.x) * this.width + "px";
		steel.style.top = (this.y) * this.height + "px";
	}

}
function Land(x, y) {
	Block.apply(this, [ x, y ]);
}

function Eagle(x, y) {
	Block.apply(this, [ x, y ]);
	/*
	 * create a dom with eagle image, position it according to x and y, and set
	 * its size according to defined fixed grid width
	 */
	this.createBlock = function() {
		var steel = document.createElement('div');
		document.getElementById(x + "" + y).appendChild(steel);
		steel.className = "eagle";
		steel.style.position = "absolute";
		steel.style.width = this.width + "px";
		steel.style.height = this.height + "px";
		steel.style.left = (this.x) * this.width + "px";
		steel.style.top = (this.y) * this.height + "px";
	}

}