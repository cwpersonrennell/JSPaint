class JSPaint{
	constructor(canvasID){
		this.canvas= document.getElementById(canvasID);
		this.ctx = this.canvas.getContext('2d');
		this.isPainting=false;
		this.lineWidth=10;

		this.x = 0;
		this.y = 0;

		this.canvas.addEventListener("pointermove",this.penPosition.bind(this));
		this.canvas.addEventListener("pointerdown",this.startPainting.bind(this));
		this.canvas.addEventListener("pointerup",this.stopPainting.bind(this));

		this.ctx.strokeStyle=this.ctx.createPattern(chalkCanvas(10),'repeat');
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

function chalkCanvas(size,rgba='rgba(0,0,0,1)'){
	const patternCanvas = document.createElement('canvas');
	const patternContext = patternCanvas.getContext('2d');

	patternCanvas.width=size;
	patternCanvas.height=size;

	patternContext.fillStyle='rgba(255,255,255,0)';
	patternContext.fillRect(0,0,patternCanvas.width,patternCanvas.height);
	patternContext.fillStyle=rgba;

	patternContext.fillRect(0,0,size,size);
	patternContext.stroke();
	return patternCanvas;
	

}


function main(canvasID){
	const paintApp = new JSPaint(canvasID);
	
	function JSPaintLoop(){
		paintApp.update();
		requestAnimationFrame(JSPaintLoop);
	}
	JSPaintLoop();
}

//Kick off the loop
main("jspaint");
