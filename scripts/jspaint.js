class JSPaint{
	constructor(canvasID){
		this.canvas= document.getElementById(canvasID);
		this.ctx = this.canvas.getContext('2d');
		this.isPainting=false;
		this.lineWidth=3;
		this.rgba = 'rgba(100,0,0,1)';
		this.x = 0;
		this.y = 0;

		this.canvas.addEventListener("pointermove",this.penPosition.bind(this));
		this.canvas.addEventListener("pointerdown",this.startPainting.bind(this));
		this.canvas.addEventListener("pointerup",this.stopPainting.bind(this));

		}

	handleKeyEvent(e){
		console.log(`${e.keyCode}, ${e.key}`);
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
		this.ctx.strokeStyle=this.ctx.createPattern(chalkCanvas(this.lineWidth,this.rgba),'repeat');
		this.ctx.lineWidth=this.lineWidth;
		this.ctx.lineCap='round';
		this.ctx.lineTo(this.x,this.y);
		this.ctx.stroke();
	}
}

function chalkCanvas(size,rgba='rgba(0,0,0,1)'){
	const patternCanvas = document.createElement('canvas');
	const patternContext = patternCanvas.getContext('2d');

	patternCanvas.width=Math.floor(size*1.05);
	patternCanvas.height=Math.floor(size*1.05);

	patternContext.fillStyle='rgba(255,255,255,0)';
	patternContext.fillRect(0,0,patternCanvas.width,patternCanvas.height);
	patternContext.fillStyle=rgba;

	for(let i = 0;i<size;i++){
		for(let j = 0;j<size;j++){
			if(Math.random()>0.45)
				patternContext.fillRect(i,j,1,1);
		}
	}
	patternContext.stroke();
	return patternCanvas;
	

}


function main(canvasID){
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
