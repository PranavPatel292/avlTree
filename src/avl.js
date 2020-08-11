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

	insert(value){
		if(value < this.value){
			if(this.left == null){
				this.left = new BST(value)
				
			}else{
				this.left.insert(value)
			}
		}else{
			if(this.right == null){
				this.right = new BST(value)
			}else{
				this.right.insert(value)
			}
		}
		this.height = 1 + Math.max(this.height_cal(this.left), this.height_cal(this.right));
		return this
	}

	height_cal(demo){
		if(demo == null) return 0;
		return demo.height;
	}

}

let demo;


let root = true;



function enterNumber() {
	let value = parseInt(document.getElementById("number").value);
	if(root){
		demo = new BST(value)
		root = false;
	}else{
		demo.insert(value)
	}
	
	console.log(demo)
}
