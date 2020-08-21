var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const canvas_width = document.getElementById("myCanvas").width;
const canvas_height = document.getElementById("myCanvas").height;

let root_x = Math.floor(canvas_width / 2)
let root_y = 50
let distance_x = 550;
let distance_y = 90;
let depth = 0;
let current_x, current_y, minX, maxX, parentX, parentY;
let reset_nodes = [];
let flag = true;
let flag_1 = true;
let noDraw = false;

class BST{
	constructor(value, x, y, minWidth, maxWidth, height){
		this.value = value;
		this.left = null;
		this.right = null;
		this.height = height;
		this.x = x;
		this.y = y;
		this.maxWidth = maxWidth;
		this.minWidth = minWidth;
	}
}

class AVL{
	insert(value, node, x, y, minWidth, maxWidth){
		if(node == null){
			return new BST(value, x, y, minWidth, maxWidth, 1)
		}else if(value < node.value){
			current_x = node.x;
			current_y = node.y;
			node.left = this.insert(value, node.left, 0, 0, 0, 0)

			//this is copied from my bst.js
				if(flag){
					node.left.minWidth = node.minWidth;
					node.left.maxWidth = node.x;
					node.left.x = node.left.minWidth + Math.floor(node.left.maxWidth - node.left.minWidth) / 2;
					node.left.y = current_y + distance_y
					parentX = current_x;
					parentY = current_y
					current_x = node.left.x;
					current_y = node.left.y;
					flag = false;
				}
		

		}else if(value > node.value){
			current_x = node.x
			current_y = node.y;
			node.right = this.insert(value, node.right, x, y, minWidth, maxWidth)

			if(flag){
				node.right.minWidth = node.x;
				node.right.maxWidth = node.maxWidth;
				node.right.x = Math.floor(node.right.maxWidth + node.right.minWidth) / 2;
				node.right.y = current_y + distance_y;
				parentX = current_x;
				parentY = current_y
				current_x = node.right.x
				current_y = node.right.y
				flag = false
			}

		}
		node.height = Math.max(this.cal_hight(node.left), this.cal_hight(node.right)) + 1;
		let balance = this.get_balance(node)
		
		let pX, pY, pMax, pMin;
		//left-left
		if(balance > 1 && value < node.left.value){
			document.getElementById("operation").innerHTML = "LEFT LEFT INSERT"
			pX = node.x;
			pY = node.y;
			pMax = node.maxWidth;
			pMin = node.minWidth;
			
			let v = this.rightBalance(node);

			v.x  = pX;
			v.y = pY;
			v.minWidth = pMin;
			v.maxWidth = pMax;
			let tempTree = new AVL();

			let temp = null;
			temp = new BST(v.value, v.x, v.y, v.minWidth, v.maxWidth, v.height);

			this.travel_preOrder(v, temp)
			noDraw = true
		
			return temp;

		} 

		//right-right
		if(balance < -1 && value > node.right.value){
			document.getElementById("operation").innerHTML = "RIGHT RIGHT INSERT"
			pX = node.x;
			pY = node.y;
			pMax = node.maxWidth;
			pMin = node.minWidth;

			let v = this.leftBalance(node);
			v.x = pX;
			v.y = pY;
			v.minWidth = pMin;
			v.maxWidth = pMax;

			let tempTree = new AVL();
			let temp = null;
			temp = new BST(v.value, v.x, v.y, v.minWidth, v.maxWidth, v.height);
			this.travel_preOrder(v, temp);

			noDraw = true;
			return temp;
		}

		//left-right insertion
		if(balance > 1 && value > node.left.value){
			document.getElementById("operation").innerHTML = "LEFT RIGHT INSERT"
			pX = node.x;
			pY = node.y;
			pMax = node.maxWidth;
			pMin = node.minWidth;
			node.left = this.leftBalance(node.left)
			let v = this.rightBalance(node);
			v.x = pX;
			v.y = pY;
			v.minWidth = pMin;
			v.maxWidth = pMax;
			let tempTree = new AVL();
			let temp = null;
			temp =  new BST(v.value, v.x, v.y, v.minWidth, v.maxWidth, v.height)
			this.travel_preOrder(v, temp);
			noDraw = true;
			return temp;
		}

		//right-left insertion
		if(balance < -1 && value < node.right.value){
			document.getElementById("operation").innerHTML = "RIGHT LEFT INSERT";
			pX = node.x;
			pY = node.y;
			pMax = node.maxWidth;
			pMin = node.minWidth;
			node.right = this.rightBalance(node.right)
			let v = this.leftBalance(node);
			v.x = pX;
			v.y = pY;
			v.minWidth = pMin;
			v.maxWidth = pMax;
			let tempTree = new AVL();
			let temp = null;
			temp =  new BST(v.value, v.x, v.y, v.minWidth, v.maxWidth, v.height)
			this.travel_preOrder(v, temp);
			noDraw = true;
			return temp;
		}
	return node;
	}

	travel_preOrder(n, node){
		if(n == null) return
	
		node = this.update_and_replace(n.value, node, 0, 0, 0, 0, n.height)
		flag_1 = true
		
		this.travel_preOrder(n.left, node)
		this.travel_preOrder(n.right, node)
	}

	travel_preOrder_draw(node, pX, pY){
		if(node == null) return ;
		draw(node.x, node.y, node.value, pX, pY) //this is actual draw function.!
		this.travel_preOrder_draw(node.left, node.x, node.y);
		this.travel_preOrder_draw(node.right, node.x, node.y)
	}

	rightBalance(n){
		let x = n.left;
		let T2 = x.right;

		x.right = n;
		n.left = T2;
		n.height = 1 + Math.max(this.cal_hight(n.left), this.cal_hight(n.right))
		x.height = 1 + Math.max(this.cal_hight(x.left), this.cal_hight(x.right))
	
		return x;
	}

	get_balance(n){
		if(n == null) return 0;
		return (this.cal_hight(n.left) - this.cal_hight(n.right))
	}

	cal_hight(n){
		if(n == null) return 0;
		return n.height;
	}

	leftBalance(n){
		let x = n.right;
		let T1  =x.left;
		let temp_x = n.x;
		let temp_y = n.y;


		x.left = n;
		n.right = T1;

		n.height = 1 + Math.max(this.cal_hight(n.left), this.cal_hight(n.right))
		x.height = 1 + Math.max(this.cal_hight(x.left), this.cal_hight(x.right))
		console.log("X=>", x)
		return x;
	}

	update_and_replace(value, node, x, y, minWidth, maxWidth, height){
		if(node == null){
			return new BST(value, x, y, minWidth, maxWidth, 1)
		}
		if(value < node.value){
			current_x = node.x;
			current_y = node.y;
			node.left = this.update_and_replace(value, node.left, 0, 0, 0, 0)

			//this is copied from my bst.js
				if(flag_1){
					node.left.minWidth = node.minWidth;
					node.left.maxWidth = node.x;
					node.left.x = node.left.minWidth + Math.floor(node.left.maxWidth - node.left.minWidth) / 2;
					node.left.y = current_y + distance_y
					flag_1 = false;
				}
		

		}else if(value > node.value){
			current_x = node.x
			current_y = node.y;
			node.right = this.update_and_replace(value, node.right, 0, 0, 0, 0)

			if(flag_1){
				node.right.minWidth = node.x;
				node.right.maxWidth = node.maxWidth;
				node.right.x = Math.floor(node.right.maxWidth + node.right.minWidth) / 2;
				node.right.y = current_y + distance_y;
				flag_1 = false
			}

		}
		node.height = Math.max(this.cal_hight(node.left), this.cal_hight(node.right)) + 1;
		return node;
	}
	
}


let tree = new AVL();
let nodes =  null;

function enterNumber() {
	let value = parseInt(document.getElementById("number").value);
	if(nodes == null){
		nodes = tree.insert(value, nodes, root_x, root_y, 0, canvas_width)
	}else{
		nodes = tree.insert(value, nodes, current_x, current_y)
		flag = true;
	}
	console.log(nodes)
	ctx.clearRect(0, 0, canvas_width, canvas_height)
	tree.travel_preOrder_draw(nodes, 0, 0)
}

function draw(x, y, value, pX, pY){
		
		ctx.beginPath()
		ctx.lineWidth = 5;
		ctx.arc(x, y, 20, 0, 2 * Math.PI, true)
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.stroke()
		//this is for the text inside the circle
		ctx.beginPath()
		ctx.font = "15px Arial"
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.textAlign = "center";
		ctx.fillText(value, x, y + 5)
		ctx.stroke();

		if(pX == 0 && pY == 0) return
		ctx.lineWidth = 5;
		ctx.moveTo(x, y - 20);
		ctx.lineTo(pX - 5, pY + 20); //parent node
		ctx.stroke()
}