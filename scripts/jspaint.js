class JSPaint{
	constructor(canvasID){
		this.canvas= document.getElementById(canvasID);
		this.ctx = this.canvas.getContext('2d');
		this.isPainting=false;
		this.lineWidth=10;

		this.x = 0;
		this.y = 0;

		this.canvas.addEventListener("pointermove",this.penPosition);
		this.canvas.addEventListener("pointerdown",this.startPainting);
		this.canvas.addEventListener("pointerup",this.stopPainting);

	}

	penPosition(e){
		console.log(this);
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
	const paintApp = new JSPaint(canvasID);
	
	function JSPaintLoop(){
		paintApp.update();
		requestAnimationFrame(JSPaintLoop);
	}
	JSPaintLoop();
}

//Kick off the loop
main("jspaint");
