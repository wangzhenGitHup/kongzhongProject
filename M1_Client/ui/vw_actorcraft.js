if(!__Page.actorCraft)
{
	//--------------------------------------------------------------------------
	__Page.actorCraft=function(appEnv,homeStage,x,y)
	{
		if(appEnv)
		{
			this.appEnv=appEnv;
			this.homeStage=homeStage;
			this.page=homeStage.page;
			this.game=homeStage.game;
			this.cocDefIdx=-1;
			this.cocDef=null;
			this.cocObj=null;
			this.hostBld=null;
			this.job=0;
			this.birthPos=[x,y,0];
		}
	};

	__Page.actorCraft.prototype=new Object();

	//--------------------------------------------------------------------------
	//初始化,将演员放到舞台上:
	__Page.actorCraft.prototype.addToStage=function(defIdx,x,y,uid,group)
	{
		var stage;
		var game;
		var level;
		var obj;

		stage=this.homeStage;
		game=stage.game;
		level=game.level;
		this.cocDefIdx=defIdx;
		this.uid=uid;
		this.lgcObj=level.addObjectJS(defIdx,uid,group?group:9,[x,y,0],45);
		this.lgcObj.actor=this;
		this.lgcObj.OnMoveDone=this.onMoveDone;
		this.lgcObj.OnTimer=this.OnTimer;
		this.cocObj=game.lgcObj2GameObj(this.lgcObj);
		this.cocDefIdx=defIdx;
		this.cocDef=stage.objDefs[defIdx];
	};

	__Page.actorCraft.prototype.addCommandToStage=function(defIdx,x,y,uid,group,bodyLv,legLv,lvx,lvy)
	{
		var stage;
		var game;
		var level;
		var obj,g,unit;

		g=group?group:9;
		stage=this.homeStage;
		game=stage.game;
		level=game.level;
		this.cocDefIdx=defIdx;
		level.addCommand(1,-1,x,y,defIdx,g,{uid:uid,fixpos:1});
		stage.layer.setFrameout(1,function(){
			this.lgcObj=level.getObject(g,uid);
			this.lgcObj.actor=this;
			//this.lgcObj.OnMoveDone=this.onMoveDone;
			//this.lgcObj.OnTimer=this.OnTimer;
			this.cocObj=game.lgcObj2GameObj(this.lgcObj);
			this.cocDefIdx=defIdx;
			this.cocDef=stage.objDefs[defIdx];
			//this.moveToNextBld();
			this.addLvTool(bodyLv,legLv);
			this.setLvToolPos(lvx,lvy);
		},this);
	};

	//--------------------------------------------------------------------------
	//初始化,将演员放到舞台上:
	__Page.actorCraft.prototype.addByCoCBld=function(defIdx,cocBld,uid)
	{
		var stage;
		var game;
		var level;
		var obj;
		var x,y,bldW,bldH,rx,ry,rs;
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

		this.lgcObj=level.addObjectJS(defIdx,uid,9,[x,y,0],45);
		this.lgcObj.actor=this;
		this.lgcObj.OnMoveDone=this.onMoveDone;
		this.lgcObj.OnTimer=this.OnTimer;
		this.cocObj=game.lgcObj2GameObj(this.lgcObj);
		DBOut("Worker: "+this.cocObj);
		this.cocDefIdx=defIdx;
		this.cocDef=stage.objDefs[defIdx];
	};

	//--------------------------------------------------------------------------
	//到达移动目的地
	__Page.actorCraft.prototype.onMoveDone=function()
	{
		switch(this.actor.job)
		{
		case 0://闲逛
			{
				this.addTimerCall(100,1);
			}
			break;
		}
	};

	//--------------------------------------------------------------------------
	//记时器触发回调
	__Page.actorCraft.prototype.OnTimer=function(tag)
	{
		var idx,retry;
		var stage,n;
		var self=this.actor;

		stage=self.homeStage;
		switch(tag)
		{
		case 1:
			{
				if(this.actor.job==0)
				{
					stage.layer.setFrameout(0,self.moveToNextBld,self);
				}
			}
			break;
		}
	}

	//--------------------------------------------------------------------------
	//消除演员:
	__Page.actorCraft.prototype.signAsDead=function()
	{
		if(this.lgcObj.lvTool)
		{
			this.game.hudTools.freeTool(this.lgcObj.lvTool);
			this.lgcObj.lvTool=null;
		}
		this.lgcObj.signAsDead();
		this.lgcObj=null;
		this.cocObj=null;
	};

	//--------------------------------------------------------------------------
	//让演员移动到某个特定位置:
	__Page.actorCraft.prototype.moveToPos=function(x,y,job)
	{
		if(!this.lgcObj)
			return;
		this.job=job?job:0;
		this.lgcObj.actMoveTo(x,y,1,0);
	};

	//--------------------------------------------------------------------------
	//让演员停止移动
	__Page.actorCraft.prototype.stopMove=function(job)
	{
		if(!this.lgcObj)
			return;
		this.job=1;
		this.lgcObj.actStopMove();
	};

	//--------------------------------------------------------------------------
	//让演员移动到某个Bld的门口:
	__Page.actorCraft.prototype.moveToNextBld=function()
	{
		var retry;
		var stage,x,y,level;
		retry=0;
		stage=this.homeStage;
		level=stage.level;
		x=this.birthPos[0];
		y=this.birthPos[1];
		while(retry<10)
		{
			x+=(Math.random()-0.5)*8;//16
			y+=(Math.random()-0.5)*8;//16
			if(!level.getBuildingAt(x,y))
				break;
			retry++;
		}
		this.job=0;
		this.moveToPos(x,y);
		//DBOut("Picked new homeBld: "+homeBld+", "+homeBld.deadOut);
	};

	//--------------------------------------------------------------------------
	//让演员移动到某个Bld的门口:
	__Page.actorCraft.prototype.moveToBldDoor=function(homeBld)
	{
		var x,y,pos,cocBld,aisBld;
		if(!this.lgcObj)
			return;
		aisBld=homeBld.aisBld;
		pos=aisBld.pos;
		x=pos[0]+homeBld.tileW;
		y=pos[1]+(homeBld.tileH)/2;
		this.job=0;
		this.lgcObj.actMoveTo(x,y,1,0);
		this.doorHomeBld=homeBld;
	};

	//--------------------------------------------------------------------------
	//让演员移动到某个Bld的里面:
	__Page.actorCraft.prototype.moveInToBld=function(homeBld)
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

	__Page.actorCraft.prototype.addLvTool=function(body,leg)
	{
		var idx;
		idx=this.game.hudTools.getHudToolDef("mac_LvBar");
		DBOut("+++++idx="+idx);
		if(idx!=-1)
		{
			this.bodyLv=body;
			this.legLv=leg;
			this.lgcObj.lvTool=this.game.hudTools.addToolOn(idx,this.cocObj);
			this.lgcObj.lvTool.fadeIn(0.2);
			var tool=this.lgcObj.lvTool.getSubItem(0).getHudItem();
			tool.getItemById("body")._setText(body+"");
			tool.getItemById("leg")._setText(leg+"");
		}
	};
	__Page.actorCraft.prototype.setLvToolPos=function(x,y)
	{
		if(this.lgcObj && this.lgcObj.lvTool)
		{
			var tool=this.lgcObj.lvTool.getSubItem(0).getHudItem();
			tool.setPos([x,y,0]);
		}
	};
};