if(!__Page.actorFarmer)
{
	//--------------------------------------------------------------------------
	__Page.actorFarmer=function(appEnv,homeStage)
	{
		if(appEnv)
		{
			this.appEnv=appEnv;
			this.homeStage=homeStage;
			this.page=homeStage.page;
			this.cocDefIdx=-1;
			this.cocDef=null;
			this.cocObj=null;
			this.hostBld=null;
			this.job=0;
		}
	};

	__Page.actorFarmer.prototype=new Object();

	//--------------------------------------------------------------------------
	//初始化,将演员放到舞台上:
	__Page.actorFarmer.prototype.addToStage=function(defIdx,x,y,uid)
	{
		var stage;
		var game;
		var level;
		var obj;

		stage=this.homeStage;
		game=stage.game;
		level=game.level;
		this.lgcObj=level.addObjectJS(defIdx,uid,9,[x,y,0],45);
		this.lgcObj.actor=this;
		this.lgcObj.OnMoveDone=this.onMoveDone;
		this.lgcObj.OnTimer=this.OnTimer;
		this.cocObj=game.lgcObj2GameObj(this.lgcObj);
		this.objDefIdx=defIdx;
		this.objDef=stage.objDefs[defIdx];
	};

	//--------------------------------------------------------------------------
	//初始化,将演员放到舞台上:
	__Page.actorFarmer.prototype.addByCoCBld=function(defIdx,cocBld,uid)
	{
		var stage;
		var game;
		var level;
		var obj;
		var x,y,z,bldW,bldH,rx,ry,rs;
		var pos=[0,0,0];

		stage=this.homeStage;
		game=stage.game;
		level=game.level;
		cocBld.getPos(pos);
		bldW=cocBld.getTileW();
		bldH=cocBld.getTileW();
		rx=Math.random()*(bldW-0.5)+0.25;
		ry=Math.random()*0.5+0.25;
		rs=Math.random()*0.5+0.5;
		if(rs<0.25)//Top Line
		{
			x=pos[0]+rx;
			y=pos[1]+ry;
		}
		else if(rs<0.5)//Left Side
		{
			x=pos[0]+ry;
			y=pos[1]+rx;
		}
		else if(rs<0.75)//Right Side
		{
			x=pos[0]+bldW-ry;
			y=pos[1]+rx;
		}
		else//Bottom Side:
		{
			x=pos[0]+rx;
			y=pos[1]+bldH-ry;
		}
		if(stage.objDefs[defIdx] && stage.objDefs[defIdx].pos)
			z=stage.objDefs[defIdx].pos[2];
		else
			z=0;

		this.lgcObj=level.addObjectJS(defIdx,uid,9,[x,y,z],45);
		this.lgcObj.actor=this;
		this.lgcObj.OnMoveDone=this.onMoveDone;
		this.lgcObj.OnTimer=this.OnTimer;
		this.cocObj=game.lgcObj2GameObj(this.lgcObj);
		this.objDefIdx=defIdx;
		this.objDef=stage.objDefs[defIdx];
	};

	//--------------------------------------------------------------------------
	//到达移动目的地
	__Page.actorFarmer.prototype.onMoveDone=function()
	{
		switch(this.actor.job)
		{
		case 0://闲逛
			{
				this.addTimerCall(100,1);
			}
			break;
		case 1://建造工作
			{
				//恢复原来的速度:
				this.clearBuff(1,0);
				//在当前位置上干活:
				//TODO:设置动画
				DBOut("Will work!!");
				this.actor.cocObj.setAniAction(0,ActDef.chr.ACT_WORK);
				this.setQDit(256);
				this.addTimerCall(150,2);
			}
			break;
		case 2://回家,消失:
			{
				this.clearBuff(1,0);
				this.actor.signAsDead();
			}
		case 3://呆在校军场
			{
			}
			break;
		}
	};

	//--------------------------------------------------------------------------
	//记时器触发回调
	__Page.actorFarmer.prototype.OnTimer=function(tag)
	{
		var idx,retry;
		var stage,n;
		var self=this.actor;

		stage=self.homeStage;
		switch(tag)
		{
		case 1:
			{
				stage.layer.setFrameout(0,self.moveToNextBld,self);
			}
			break;
		case 2:
			{
				stage.layer.setFrameout(0,self.workMovePos,self);
			}
			break;
		}
	}

	//--------------------------------------------------------------------------
	//消除演员:
	__Page.actorFarmer.prototype.signAsDead=function()
	{
		this.lgcObj.signAsDead();
		this.lgcObj=null;
		this.cocObj=null;
		//DBOut("Will delete worker: "+this.aisWorker);
		if(this.aisWorker)//是工人
		{
			//DBOut("Delete worker's cocWorker: "+this.aisWorker.cocWorker);
			this.aisWorker.cocWorker=null;
		}
	};

	//--------------------------------------------------------------------------
	//让演员移动到某个特定位置:
	__Page.actorFarmer.prototype.moveToPos=function(x,y)
	{
		if(!this.lgcObj)
			return;
		this.lgcObj.actMoveTo(x,y,1,0);
	};

	//--------------------------------------------------------------------------
	//让演员移动到某个Bld的门口:
	__Page.actorFarmer.prototype.moveToNextBld=function()
	{
		var homeBld,idx,retry;
		var stage,n;
		retry=0;
		stage=this.homeStage;
		n=stage.keyBlds.length;
		while(!homeBld && retry<10)
		{
			idx=Math.floor(Math.random()*n);
			homeBld=stage.keyBlds[idx];
			retry++;
		}
		//DBOut("Picked new homeBld: "+homeBld+", "+homeBld.deadOut);
		if(homeBld)
		{
			this.moveToBldDoor(homeBld);
		}
	};

	//--------------------------------------------------------------------------
	//让演员移动到某个Bld的门口:
	__Page.actorFarmer.prototype.moveToBldDoor=function(homeBld)
	{
		var x,y,pos,cocBld,aisBld;
		if(!this.lgcObj)
			return;
		//pos=[0,0,0];
		//cocBld=homeBld.cocBld;
		//cocBld.getPos(pos);
		aisBld=homeBld.aisBld;
		pos=aisBld.pos;
		x=pos[0]+homeBld.tileW;
		y=pos[1]+(homeBld.tileH)/2;
		this.lgcObj.actMoveTo(x,y,1,0);
		this.doorHomeBld=homeBld;
	};

	//--------------------------------------------------------------------------
	//让演员移动到某个Bld的里面:
	__Page.actorFarmer.prototype.moveInToBld=function(homeBld)
	{
		var x,y,pos,subx,suby,bldW,bldH,bldCW,bldCH,cocBld;
		if(!this.lgcObj)
			return;
		cocBld=homeBld.cocBld;
		bldW=homeBld.tileW;
		bldH=homeBld.tileH;
		bldCW=homeBld.coreW;
		bldCH=homeBld.coreH;
		subx=Math.random()*bldW;
		suby=Math.random()*bldH;
		//DBOut("Sub Pos: "+subx+", "+suby);
		if(suby>=(bldH-bldCH)/2 && suby<=(bldH-bldCH)/2+bldCH)
		{
			//DBOut("Fix Sub Pos!");
			if(subx>0.5*bldW)
			{
				subx=(subx/bldW)*(bldW-bldCW)+bldCW;
				//DBOut("Fixed SubX1: "+subx);
			}
			else
			{
				subx=(subx/bldW)*(bldW-bldCW);
				//DBOut("Fixed SubX2: "+subx);
			}
		}
		pos=[0,0,0];
		cocBld.getPos(pos);
		x=pos[0]+subx;
		y=pos[1]+suby;
		this.lgcObj.actMoveTo(x,y,1,0);
	};

	__Page.actorFarmer.prototype.workMovePos=function()
	{
		var pos=[0,0,0],x,y,homeBld,cocBld;
		homeBld=this.doorHomeBld;
		if(this.job==1 && homeBld)//是在工作中
		{
			cocBld=homeBld.cocBld;
			x=Math.random();
			DBOut("x: "+x);
			if(1)//x>0.5)
			{
				y=(homeBld.tileW-1)*(x)+0.5;
				x=homeBld.tileW-0.5;
			}
			else
			{
				y=(homeBld.tileW-1)*x*2+0.5;
				x=homeBld.tileW-0.5;
			}
			cocBld.getPos(pos);
			DBOut("Move to new work pos: "+(pos[0]+x)+", "+(pos[1]+y));
			this.lgcObj.actMoveTo(pos[0]+x,pos[1]+y,1,0);
		}
	};
};