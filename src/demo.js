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

class BST{
	constructor(value, x, y, minWidth, maxWidth){
		this.value = value;
		this.left = null;
		this.right = null;
		this.height = 1;
		this.x = x;
		this.y = y;
		this.maxWidth = maxWidth;
		this.minWidth = minWidth;
	}
}

class AVL{
	insert(value, node, x, y, minWidth, maxWidth){
		if(node == null){
			return new BST(value, x, y, minWidth, maxWidth)
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
					console.log(current_x, current_y)
					flag = false;
				}
				

		}else{
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
		
		//left-left
		// if(balance > 1 && value < node.left.value){
		// 	return this.rightBalance(node);
		// }

		// //left-right
		// if(balance > 1 && value > node.left.value){
		// 	node.left = this.leftBalance(node.left)
		// 	return this.rightBalance(node);
		// }

		// //right-right
		// if(balance < -1 && node.right.value < value){
		// return this.leftBalance(node);
		// }

		// //right-left
		// if(balance < -1 && node.right.value > value){
		// 	node.right = this.rightBalance(node.right);
		// 	return this.rightBalance(node);
		// }

	return node;
	}

	rightBalance(n){
		let x = n.left;
		let T2 = x.right;

		x.right = n;
		n.left = T2;

		n.height = Math.max(this.cal_hight(n.left), this.cal_hight(n.right)) + 1;
		x.height = Math.max(this.cal_hight(x.left), this.cal_hight(x.right)) + 1;
		
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

		x.left = n;
		n.right = T1;

		n.height = Math.max(this.cal_hight(n.left), this.cal_hight(n.right))
		x.height = Math.max(this.cal_hight(x.left), this.cal_hight(x.right))

		return x;
	}
}


let tree = new AVL();
let nodes =  null;

function enterNumber() {
	let value = parseInt(document.getElementById("number").value);
	if(nodes == null){
		nodes = tree.insert(value, nodes, root_x, root_y, 0, canvas_width)
		draw_circle(root_x, root_y, value, 0, 0)
	}else{
		nodes = tree.insert(value, nodes, current_x, current_y)
		flag = true;
		console.log(current_x, current_y)
		draw_circle(current_x, current_y, value, parentX, parentY)
	}
	console.log(nodes)
}


function draw_circle(x, y, value, pX, pY){
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
