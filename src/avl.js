var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const canvas_width = document.getElementById("myCanvas").width;
const canvas_height = document.getElementById("myCanvas").height;

let root_x = Math.floor(canvas_width / 2)
let root_y = 50
let distance_x = 550;
let distance_y = 90;
// let depth = 0;
let current_x, current_y, minX, maxX, parentX, parentY;
// let reset_nodes = [];


class BST{
	constructor(value){
		this.value = value;
		this.left = null;
		this.right = null;
		this.height = 1;
	}
}


function insert(value, node){
		if(value < node.value){
			if(node.left == null){
				node.left = new BST(value)
			}else{
				insert(value, node.left)
			}
		}else{
			if(node.right == null){
				node.right = new BST(value)
			}else{
				insert(value, node.right)
			}
		}
	node.height = Math.max(height_cal(node.left), height_cal(node.right)) + 1;
	let balance  = getBalance(node);
	console.log(balance)
	if(balance > 1 && node.left.value > value){
		return rightRoate(node)
	}

	if(balance < -1 && node.right.value < value){
		return leftRoatye(node)
	}
	return node;
}

function height_cal(demo){
		if(demo == null) return 0;
		return demo.height;
	}

function getBalance(demo){
		if(demo == null) return 0;
		return (height_cal(demo.left) - height_cal(demo.right))
}

function leftRoatye(demo){

	let x = demo.right;
	let T1  =x.left;

	x.left = demo;
	demo.right = T1;

	demo.height = Math.max(height_cal(demo.left), height_cal(demo.right))
	x.height = Math.max(height_cal(x.left), height_cal(x.right))

	return x;
}
 function rightRoate(demo){
		let x = demo.left;
		let T2 = x.right;

		x.right = demo;
		demo.left = T2;

		demo.height = Math.max(height_cal(demo.left), height_cal(demo.right)) + 1;
		x.height = Math.max(height_cal(x.left), height_cal(x.right)) + 1;
		console.log(x)
		return x;
}


let demo;
//9824780745
//dinesh mod

let root = true;



function enterNumber() {
	let value = parseInt(document.getElementById("number").value);
	if(root){
		demo = new BST(value)
		root = false;
	}else{
		insert(value, demo)
	}
	console.log(demo)
}
