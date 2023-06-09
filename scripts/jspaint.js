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

		this.pen = chalkCanvas(this.lineWidth,this.rgba);
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
		}
	}

	penPosition(e){
		this.x = e.clientX-this.canvas.offsetLeft;
		this.y = e.clientY-this.canvas.offsetTop;
	}

	startPainting(e){
		this.pen = chalkCanvas(this.lineWidth,this.rgba);
		this.isPainting=true;
		
		if(this.drawPath){
			this.ctx.beginPath();
			this.ctx.moveTo(this.x,this.y);
		}
	}

	stopPainting(e){
		this.isPainting=false;
	}

	update(){
		if(!this.isPainting) return;
		this.draw();
	}

	draw(){
		if(this.drawPath){
			this.ctx.lineWidth=this.lineWidth;
			this.ctx.lineCap='round';
			this.ctx.lineTo(this.x,this.y);
			this.ctx.stroke();
		}else{
			this.ctx.drawImage(this.pen,this.x,this.y);
		}
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

	const ss = size*size;
	const s2 = size/2.0;
	for(let i = 0;i<size;i++){
		for(let j = 0;j<size;j++){
			if(Math.pow(i-s2,2)+Math.pow(j-s2,2)<=ss/4)
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
