function debug(str){
	console.log(`:\t${str}`);
}
const Instruction_Set=[
	'STROKE', 'FILL','STROKESTYLE','FILLSTYLE','BEGINPATH',
	'CLOSEPATH','MOVETO','LINETO',
	'INTEGER','FLOAT','STRING',
	'LINEWIDTH', 'LINECAP', 'LINEJOIN'
	];

const INSTRUCTIONS={};

let bytecode = 0x00;
for(let Instruction of Instruction_Set){
	INSTRUCTIONS[Instruction]=++bytecode;
}

//0 Arguments
const BEGINPATH = INSTRUCTIONS['BEGINPATH'];
const STROKE = INSTRUCTIONS['STROKE'];
const CLOSEPATH = INSTRUCTIONS['CLOSEPATH'];
const FILL = INSTRUCTIONS['FILL'];

//1 Argument
	//Literals
const FLOAT = INSTRUCTIONS['FLOAT'];
const INTEGER = INSTRUCTIONS['INTEGER'];
const STRING=INSTRUCTIONS['STRING'];
	//Line parameters
const LINEWIDTH=INSTRUCTIONS['LINEWIDTH'];
const LINECAP=INSTRUCTIONS['LINECAP'];
const LINEJOIN=INSTRUCTIONS['LINEJOIN'];

//2 Arguments
const LINETO = INSTRUCTIONS['LINETO'];
const MOVETO = INSTRUCTIONS['MOVETO'];

//4 Arguments
const STROKESTYLE=INSTRUCTIONS['STROKESTYLE'];
const FILLSTYLE=INSTRUCTIONS['FILLSTYLE'];

// 0 argument instructions
function instBEGINPATH(arr){
	arr.push(BEGINPATH);
	return arr;
}
function instSTROKE(arr){
	arr.push(STROKE);
	return arr;
}
function instCLOSEPATH(arr){
	arr.push(CLOSEPATH);
	return arr;
}
function instFILL(arr){
	arr.push(FILL);
	return arr;
}
//Literal Instructions
function instINTEGER(arr,val){
	return arr.concat([INTEGER,val]);
}
function instFLOAT(arr,val){
	return arr.concat([FLOAT,val]);
}
function instSTRING(arr,val){
	return arr.concat([STRING,val]);
}
//Convenience Functions for building Bytecode Array for instructions with parameters:
function instLINEWIDTH(arr,val){
	return arr.concat([FLOAT, val, LINEWIDTH]);
}
function instLINECAP(arr,val){
	return arr.concat([STRING,val,LINECAP]);
}
function instLINEJOIN(arr,val){
	return arr.concat([STRING,val,LINEJOIN]);
}
function instLINETO(arr,x,y){
	return arr.concat([FLOAT, x, FLOAT, y, LINETO]);
}
function instMOVETO(arr,x,y){
	return arr.concat([FLOAT,x,FLOAT,y,MOVETO]);
}
function instSTROKESTYLE(arr,r,g,b,a){
	return arr.concat([INTEGER, r, INTEGER, g, INTEGER, b, FLOAT, a, STROKESTYLE]);
}
function instFILLSTYLE(arr,r,g,b,a){
	return arr.concat([INTEGER, r, INTEGER, g, INTEGER, b, FLOAT, a, FILLSTYLE]);
}
/*********Testing**************/

let test_code = [
	FLOAT, 10.0, //[10.0]
	LINEWIDTH,   //[]
	INTEGER, 255,//[255]
	INTEGER, 0,  //[255,0]
	INTEGER, 0,  //[255,0,0]
	FLOAT, 0.5,  //[255,0,0,0.5]
	STROKESTYLE,   //[]
	BEGINPATH,  // []        Begin Path, no stack change
	INTEGER,100,// [100]     Add the x value to the stack
	INTEGER,200,// [100,200] Add the y value to the stack
	MOVETO,     // []        Consume the x, y values above
	INTEGER, 0, // [0]
	INTEGER, 0, // [0,0]
	LINETO,     // []
	STROKE      // End Drawing
	];

let test_code2 = [];
test_code2=instSTROKESTYLE(test_code2,0,255,0,1);
test_code2=instLINEWIDTH(test_code2,5);
test_code2=instBEGINPATH(test_code2);
test_code2=instMOVETO(test_code2,0,10);
test_code2=instLINETO(test_code2,500,10);
test_code2=instSTROKE(test_code2);
console.log(test_code2);


class VirtualMachine{
	constructor(ctx){
		debug("Creating Virtual Painting Machine")
		this.ctx = ctx;
		this.stack = [];
		this.max_stack_size = 255;
	}

	pop(){
		return this.stack.pop();
	}
	push(val){
		this.stack.push(val);
		if(this.stack.length>this.max_stack_size)
			throw new Error("Exceeded VM max stack!");
	}

	interpret(bytecode){
		let i = 0;
		let x,y,r,g,b,a;
		while(i<bytecode.length){
			let instruction = bytecode[i];
			switch(instruction){
				case STRING:
				case INTEGER:
				case FLOAT:
					this.push(bytecode[++i]);
					debug(`Pushed ${bytecode[i]} onto the stack`);
					break;	
				case LINEJOIN:
					x=this.pop();
					this.ctx.lineJoin=x;
					debug(`Line join set to ${x}`);
					break;
				case LINECAP:
					x=this.pop();
					this.ctx.lineCap=x;
					debug(`Line cap set to ${x}`);
					break;
				case LINEWIDTH:
					x=this.pop();
					this.ctx.lineWidth=x;
					debug(`Line width set to ${x}`);
					break;
				case STROKESTYLE:
					a=this.pop();
					b=this.pop();
					g=this.pop();
					r=this.pop();
					this.ctx.strokeStyle=`rgba(${r},${g},${b},${a})`;
					debug(`Set Stroke Style To rgba(${r},${g},${b},${a})`);
					break;
				case FILLSTYLE:
					a=this.pop();
					b=this.pop();
					g=this.pop();
					r=this.pop();
					this.ctx.fillStyle=`rgba(${r},${g},${b},${a})`;
					break;
				
				case STROKE:
					this.ctx.stroke();
					debug(`Stroke path`);
					break;
				case FILL:
					this.ctx.fill();
					debug(`Fill path`);
					break;
				case BEGINPATH:
					this.ctx.beginPath();
					debug(`Begin Path`)
					break;
				case LINETO:
					y = this.pop();
					x = this.pop();
					this.ctx.lineTo(x,y);
					debug(`Line to (${x},${y})`);
					break;
				case MOVETO:
					y = this.pop();
					x = this.pop();
					this.ctx.moveTo(x,y);
					debug(`Move To (${x},${y})`);
					break;
				case CLOSEPATH:
					this.ctx.closePath();
					debug(`Close Path`);
					break;
				default:
					break;
			}
			i++;
		}
	}
}

class JSPaint{
	constructor(canvasID){
		this.canvas= document.getElementById(canvasID);
		this.ctx = this.canvas.getContext('2d');
		this.isPainting=false;
		
		this.line_parameters={
			lineWidth:3.0,
			lineCap:'round', //butt, square,
			lineJoin:'round',//bevel, miter,
			//miterLimit:10,
			//lineDashOffset:0
		}

		this.styles={
			strokeStyle:'rgba(0,0,0,1)',
			fillStyle:'rgba(0,0,0,1)'
		}

		this.x = 0;
		this.y = 0;
		this.vm = new VirtualMachine(this.ctx);
		this.vm.interpret(test_code);
		this.vm.interpret(test_code2);
		this.drawPath=true;
		this.canvas.addEventListener("pointermove",this.penPosition.bind(this));
		this.canvas.addEventListener("pointerdown",this.startPainting.bind(this));
		this.canvas.addEventListener("pointerup",this.stopPainting.bind(this));

		}

	set lineWidth(val){
		this._lineWidth=val;
		if(this._lineWidth<=0){
			this._lineWidth=1;
		}
	}

	get lineWidth(){
		return this._lineWidth;
	}

	handleKeyEvent(e){
		switch(e.key){
			case "+":
				this.lineWidth+=1;
				break;
			case "-":
				this.lineWidth-=1;
				break;
			case " ":
				this.canvas.width=this.canvas.width;
				break;
			default:
				break;

		}
	}

	penPosition(e){
		this.x = e.clientX-this.canvas.offsetLeft;
		this.y = e.clientY-this.canvas.offsetTop;
	}

	startPainting(e){
		this.isPainting=true;
		this.ctx.beginPath();
		this.ctx.moveTo(this.x,this.y);
	}

	stopPainting(e){
		this.isPainting=false;
	}

	update(){
		if(!this.isPainting) return;
		this.draw();
	}

	draw(){
		this.ctx.lineWidth=this.lineWidth;
		this.ctx.lineCap='round';
		this.ctx.lineTo(this.x,this.y);
		this.ctx.stroke();
	}
}

function main(canvasID){
	debug("Creating Paint Application...");
	const paintApp = new JSPaint(canvasID);
	
	window.addEventListener("keyup",paintApp.handleKeyEvent.bind(paintApp));
	
	function JSPaintLoop(){
		paintApp.update();
		requestAnimationFrame(JSPaintLoop);
	}
	JSPaintLoop();

}

//Kick off the loop
main("jspaint");
