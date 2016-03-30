__Page.appEnv.runSnow = function()
{
	DBOut("***:runSnow");
	var img=this.page.imgLib;
	this.snowImgS = img.getImg("snow_s");
	this.snowImgM = img.getImg("snow_m");
	this.snowImgL = img.getImg("snow_l");
	this.wholeMapW = ScreenW;
	this.wholeMapH = ScreenH;
	this.offset_X = 80;//改变方向时候，x偏移量
	this.allFrame =3;//下降过程中改变方向的次数
//	this.act2Layer.setDisplay(1);
	this.gLayerBaseSnow=this.layer.addHudItem({id:"snow-box",type:"icon",pos:[0,0,0],w:ScreenW,h:ScreenH,face_r:0,face_g:0,face_b:0,face_a:100});//act2Layer
	this.startInitSnow();
}
__Page.appEnv.startInitSnow = function()
{
	//小雪效果
	//var fromPos=[],toPos=[],totalSnowNum = 70,snowSpeed =180;
	//大雪效果
	var fromPos=[],toPos=[],totalSnowNum = 120,snowSpeed = 60;
	var i, x, y, tempSpeed, rmd;
	for(i=0;i<totalSnowNum;i++)
	{
		x = Math.random()*this.wholeMapW;
		y = Math.random()*this.wholeMapH;
		tempSpeed =snowSpeed*(this.wholeMapH-y)/this.wholeMapH;
		fromPos = [x,y,0];
		toPos = [x,this.wholeMapH,0];
		tempSpeed = Math.floor(tempSpeed);
		if(tempSpeed<=0)tempSpeed = 1;
		
		rmd = Math.floor(Math.random()*3)+1;
		if(rmd==1)tempSpeed = tempSpeed*3*this.allFrame;
		else if(rmd==2)tempSpeed = tempSpeed*2*this.allFrame;
		else if(rmd==3)tempSpeed = tempSpeed*this.allFrame;
		this.initSnow(rmd,tempSpeed,fromPos,toPos,snowSpeed);
	}
}
__Page.appEnv.initSnow = function(rmd,initSpeed,fromPos,toPos,speed)
{
	var imgW,imgH;
	if(rmd==1){imgH=imgW = 5;}
	else if(rmd==2){imgH=imgW = 10;}
	else if(rmd==3){imgH=imgW = 15;}
	
	var snowObj=this.gLayerBaseSnow.appendNewChild(
		{type:"icon",id:"ground-layer-snow",css:this.snowImgS,w:imgW,h:imgH,
			pos:toPos,display:1, fade:1, fade_size:1, fade_alpha:1, 
			fade_pos:fromPos});
	snowObj.fadeIn(initSpeed,0);
	var self = this;
	snowObj.onFadeDone = function(){setFrameout(0,function(){self.resetSnow(snowObj,2,speed,fromPos,toPos);},this)};
}
__Page.appEnv.resetSnow = function(objChild,next,speed,fromPos,toPos)
{
	objChild.setDisplay(1);
	var pos = [];
	var fadePos = [];
	objChild.getPos(pos);
	pos[0] = Math.floor(pos[0]);
	pos[1] = Math.floor(pos[1]);
	if(pos[1]<(this.wholeMapH*(this.allFrame-1)/this.allFrame)+10)//判断雪花 形状大小 不变 
	{
		var rmd = Math.floor(Math.random()*3)+1;
		var offsetX = 0;
		fadePos =pos;
		objChild.setFadePos(fadePos);
		// DBOut("***fadePos:"+fadePos);
		pos[1] =pos[1]+this.wholeMapH/this.allFrame; 
		if(pos[0]<0)pos[0] = 0;
		if(pos[0]>this.wholeMapW)pos[0] = this.wholeMapW;
		if(rmd == 1)offsetX = this.offset_X;
		else if(rmd == 2)offsetX =-this.offset_X;
		pos[0]+=offsetX;
		objChild.setShowPos(pos);
		var speedModify;
		if(objChild.getW()==5)speedModify=3;
		else if(objChild.getW()==10)speedModify=2;
		else if(objChild.getW()==15)speedModify=1;
		objChild.fadeIn(Math.floor(speed*speedModify), 0);
	}
	else{
	//判断雪花大 小形状
		var mode = Math.floor(Math.random()*3)+1;
		switch(mode){
			case 1:
				var rmd = Math.floor(Math.random()*3)+1;
				var offsetX = 0;
				fadePos =[Math.random()*this.wholeMapW,0,0]
				objChild.setFadePos(fadePos);
				pos = [fadePos[0],this.wholeMapH/this.allFrame,0];
				if(pos[0]<0)pos[0] = 0;
				if(pos[0]>this.wholeMapW)pos[0] = this.wholeMapW;
				if(rmd == 1)offsetX = this.offset_X;
				else if(rmd == 2)offsetX =-this.offset_X;
				pos[0]+=offsetX;
				objChild.setShowPos(pos);
				objChild.setW(5);
				objChild.setH(5);
				objChild.fadeIn(Math.floor(speed*3), 0);
				break;
			case 2:
				var rmd = Math.floor(Math.random()*3)+1;
				var offsetX = 0;
				fadePos =[Math.random()*this.wholeMapW,0,0]
				objChild.setFadePos(fadePos);
				pos = [fadePos[0],this.wholeMapH/this.allFrame,0];
				if(pos[0]<0)pos[0] = 0;
				if(pos[0]>this.wholeMapW)pos[0] = this.wholeMapW;
				if(rmd == 1)offsetX = this.offset_X;
				else if(rmd == 2)offsetX = -this.offset_X;
				pos[0]+=offsetX;
				objChild.setShowPos(pos);
				objChild.setW(10);
				objChild.setH(10);
				objChild.fadeIn(Math.floor(speed*2), 0);
				break;
			case 3:
				var rmd = Math.floor(Math.random()*3)+1;
				var offsetX = 0;
				fadePos =[Math.random()*this.wholeMapW,0,0]
				objChild.setFadePos(fadePos);
				pos = [fadePos[0],this.wholeMapH/this.allFrame,0];
				if(pos[0]<0)pos[0] = 0;
				if(pos[0]>this.wholeMapW)pos[0] = this.wholeMapW;
				if(rmd == 1)offsetX =  this.offset_X;
				else if(rmd == 2)offsetX = -this.offset_X;
				pos[0]+=offsetX;
				objChild.setShowPos(pos);
				objChild.setW(15);
				objChild.setH(15);
				objChild.fadeIn(speed,0);
				break;
			default:
				break;
		}
	}
}