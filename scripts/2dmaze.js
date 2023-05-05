const WALL = true;
const PATH = false;
const DIRECTIONS = [
	[1,0],
	[0,1],
	[-1,0],
	[0,-1]
	];

Object.defineProperty(Array.prototype,'shuffle',{
	value:function(){
		for(let i = this.length-1; i>0;i--){
			const j = Math.floor(Math.random()*(i+1));
			[this[i],this[j]]=[this[j],this[i]];
		}
		return this;
	}
});

function cellDistance(A,B){
	return Math.sqrt(Math.pow(A[0]-B[0],2)+Math.pow(A[1]-B[1],2));
}

class TwoDimensionalOrthogonalMaze{
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.cells = [];
		for(let x =0;x<this.width;x++){
			if(this.cells[x]===undefined) this.cells[x]=[];
			for(let y=0;y<this.height;y++){
				this.setWall(x,y);
			}
		}
	}

	randomDirection(){
		return DIRECTIONS.shuffle()[0];
	}

	setPath(x,y){
		this.cells[x][y] = PATH;
	}

	setWall(x,y){
		this.cells[x][y] = WALL;
	}

	tunnel(A,B){

	}

	generateMaze(){
		const path_stack = [];
		const edgeCells = [];
		for(let x = 0;x<this.width;x++){
			edgeCells.push([x,0]);
			edgeCells.push([x,this.height-1]);
		}
		for(let y = 1;y<this.height-1;y++){
			edgeCells.push([0,y]);
			edgeCells.push([this.width-1,y]);
		}
		const start = edgeCells.shuffle().pop();
		let end = edgeCells.pop();
		while(cellDistance(start,end)<2){
			end = edgeCells.pop();
		}

		path_stack.push(start)
		while(path_stack.length>0){

		}
	}
}