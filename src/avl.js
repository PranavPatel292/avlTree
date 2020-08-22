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
	async insert(value, node, x, y, minWidth, maxWidth){
		if(node == null){

			return new BST(value, x, y, minWidth, maxWidth, 1)
		}else if(value < node.value){
			current_x = node.x;
			current_y = node.y;
			//draw(node.x, node.y, node.value, 0, 0);  color;
			node.left = await this.insert(value, node.left, 0, 0, 0, 0)

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
					draw(node.left.x, node.left.y, node.left.value, node.x, node.y, "white")
					flag = false;
				}
		

		}else if(value > node.value){
			current_x = node.x
			current_y = node.y;
			node.right = await this.insert(value, node.right, x, y, minWidth, maxWidth)

			if(flag){
				node.right.minWidth = node.x;
				node.right.maxWidth = node.maxWidth;
				node.right.x = Math.floor(node.right.maxWidth + node.right.minWidth) / 2;
				node.right.y = current_y + distance_y;
				parentX = current_x;
				parentY = current_y
				current_x = node.right.x
				current_y = node.right.y
				draw(node.right.x, node.right.y, node.right.value, node.x, node.y, "white")
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
			
			let v = await this.rightBalance(node);

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

			let v = await this.leftBalance(node);
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
			node.left = await this.leftBalance(node.left)
			let v = await this.rightBalance(node);
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
			node.right = await this.rightBalance(node.right)
			let v = await this.leftBalance(node);
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
		draw(node.x, node.y, node.value, pX, pY, "white") //this is actual draw function.!
		this.travel_preOrder_draw(node.left, node.x, node.y);
		this.travel_preOrder_draw(node.right, node.x, node.y)
	}

	async rightBalance(n){
		await draw_delay(n.x, n.y, n.value, "#f5f10a")
		
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

	async leftBalance(n){
		await draw_delay(n.x, n.y, n.value, "#f5f10a")

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

async function enterNumber() {
	let value = parseInt(document.getElementById("number").value);
	if(nodes == null){
		nodes = await tree.insert(value, nodes, root_x, root_y, 0, canvas_width)
	}else{
		nodes = await tree.insert(value, nodes, current_x, current_y)
		flag = true;
	}
	ctx.clearRect(0, 0, canvas_width, canvas_height)
	tree.travel_preOrder_draw(nodes, 0, 0)
	document.getElementById("number").value = ""
}

function draw(x, y, value, pX, pY, color){
		
		ctx.beginPath()
		ctx.lineWidth = 5;
		ctx.arc(x, y, 20, 0, 2 * Math.PI, true)
		ctx.fillStyle = color;
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

async function draw_delay(x, y, value, color){
		
		ctx.beginPath()
		ctx.lineWidth = 5;
		ctx.arc(x, y, 20, 0, 2 * Math.PI, true)
		ctx.fillStyle = color;
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
		await sleep1(1000)
}

let firstNodeVisual = true;
//reset

function resetAll(){
	node = new BST();
	ctx.clearRect(0, 0 ,canvas_width, canvas_height)
	document.getElementById("number").value = ""
	document.getElementById("comp").innerHTML = "You can see the current status of the Binary Search here.!"
}

//search element
async function findEle(){
	reset_Tree_Visual(reset_nodes)
	let value = (document.getElementById("number").value)
	if(!value == ""){
		if(await contains(nodes, parseInt(value))){alert("Found")} else{
		alert("Not found!")
		}
	}else{
		alert("Cannot search for the blank value!")
	}
	firstNodeVisual = true;
	document.getElementById("number").value = ""
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}


function sleep1(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}


function reset_Tree_Visual(reset_nodes){
	if(reset_nodes.length > 0){
		for(let i = 0; i < reset_nodes.length; ++i){
			ctx.beginPath()
			ctx.lineWidth = 5;
			ctx.arc(reset_nodes[i][0], reset_nodes[i][1], 20, 0, 2 * Math.PI, true)
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.stroke()

			//this if for the text

			ctx.beginPath()
			ctx.font = "15px Arial"
			ctx.fillStyle = "black";
			ctx.fill();
			ctx.textAlign = "center";
			ctx.fillText(reset_nodes[i][2], reset_nodes[i][0], reset_nodes[i][1] + 5)
			ctx.stroke();
		}
		reset_nodes = [];
	}
}



async function contains(demo, value) {
    // Write your code here.
    document.getElementById("comp").innerHTML = "Comparing the value: - " + value + " and " + demo.value
    if(firstNodeVisual){
    	firstNodeVisual = false;
    	ctx.beginPath()
		ctx.lineWidth = 5;
		ctx.arc(demo.x, demo.y, 20, 0, 2 * Math.PI, true)
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.stroke()

		//this if for the text
		ctx.beginPath()
		ctx.font = "15px Arial"
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.textAlign = "center";
		ctx.fillText(demo.value, demo.x, demo.y + 5)
		ctx.stroke();
		reset_nodes.push([demo.x, demo.y, demo.value])
    }
    await sleep(1500)
		if(value < demo.value){
			if(demo.left == null){
				ctx.beginPath()
				ctx.lineWidth = 5;
				ctx.arc(demo.x, demo.y, 20, 0, 2 * Math.PI, true)
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.stroke()

				//this if for the text

				ctx.beginPath()
				ctx.font = "15px Arial"
				ctx.fillStyle = "white";
				ctx.fill();
				ctx.textAlign = "center";
				ctx.fillText(demo.value, demo.x, demo.y + 5)
				ctx.stroke();
				reset_nodes.push([demo.x, demo.y, demo.value])
				document.getElementById("comp").innerHTML = value + " is not found in this tree.!"
				return false
			}else{
				ctx.beginPath()
				ctx.lineWidth = 5;
				ctx.arc(demo.left.x, demo.left.y, 20, 0, 2 * Math.PI, true)
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.stroke()

				//this if for the text

				ctx.beginPath()
				ctx.font = "15px Arial"
				ctx.fillStyle = "white";
				ctx.fill();
				ctx.textAlign = "center";
				ctx.fillText(demo.left.value, demo.left.x, demo.left.y + 5)
				ctx.stroke();
				reset_nodes.push([demo.left.x, demo.left.y, demo.left.value])
				return await contains(demo.left, value)
			}
		}else if (value > demo.value){
			if (demo.right == null){
				ctx.beginPath()
				ctx.lineWidth = 5;
				ctx.arc(demo.x, demo.y, 20, 0, 2 * Math.PI, true)
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.stroke()

				//this if for the text

				ctx.beginPath()
				ctx.font = "15px Arial"
				ctx.fillStyle = "white";
				ctx.fill();
				ctx.textAlign = "center";
				ctx.fillText(demo.value, demo.x, demo.y + 5)
				ctx.stroke();
				reset_nodes.push([demo.x, demo.y, demo.value])
				document.getElementById("comp").innerHTML = value + " is not found in this tree.!"
				return false
			}else{
				ctx.beginPath()
				ctx.lineWidth = 5;
				ctx.arc(demo.right.x, demo.right.y, 20, 0, 2 * Math.PI, true)
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.stroke()

				//this if for the text

				ctx.beginPath()
				ctx.font = "15px Arial"
				ctx.fillStyle = "white";
				ctx.fill();
				ctx.textAlign = "center";
				ctx.fillText(demo.right.value, demo.right.x, demo.right.y + 5)
				ctx.stroke();
				reset_nodes.push([demo.right.x, demo.right.y, demo.right.value])
				return await contains(demo.right, value)
			}
		}else{
			ctx.lineWidth = 5;
			ctx.arc(demo.x, demo.y, 20, 0, 2 * Math.PI, true)
			ctx.fillStyle = "green";
			ctx.fill();
			ctx.stroke()

			//this is for the text
			ctx.beginPath()
			ctx.font = "15px Arial"
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.textAlign = "center";
			ctx.fillText(demo.value, demo.x, demo.y + 5)
			ctx.stroke();
			document.getElementById("comp").innerHTML = value + " is found in this tree.!"
			return true
		}
}