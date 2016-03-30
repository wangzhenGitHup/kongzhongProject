if(!__Page.vwBattleStage)
{
//********************************************************************
//玩家自己基地的舞台对象
__Page.vwBattleStage={
	page:__Page,
	appEnv:null,//JS的App环境对象
	layer:null,
	gameHud:null,//CoC游戏3DHud控件
	navBox:null,//用于拖动地图的控件
	gameDefVO:null,
	game:null,//CoC游戏GameMode对象
	level:null,//CoC游戏逻辑Level对象
	curUnitIdx:-1,
	curUnitGroup:-1,
	curUnitUnits:null,
	allObjs:[],
	allRes:[0,0,0,0],
	feildW:44,
	feildH:44,

	deadsTraps:[],
	curUnitNum:0,
	unitIdx:[],
	deads:[],//死去对象数组（发消息会清除）
	alldeads:[],
	deadNum:0,//死去对象个数
	oppDeads:[],
	unitNum:0,//总共带兵数量
	deadRate:0,//完成百分比
	scoreBldNum:0,//参与记分的建筑
	curDeadBld:0,//当前死去对象个数
	state:0,//0游戏未开始,1战斗中,2战斗结束
	resIdx:{"Gold":0,"Elixir":1,"Oil":1,"Cube":2},
	star:0,//0,1,2,3星级
	cmdUnits:{},//放出的兵
	logcmds:[],
	putUnitNum:0,
	storageBlds:[],
	hdTIME:400,

	actorIdx:{
		farmer:-1,
		worker:-1,
	},
	toolIdx:{
		clanFlag:-1,
	},
	layerIdx:{
	},
};
/************************************************
	监听者对象接口函数：
	stageOnGameLoad();//CoC游戏引擎加载完成
	stageOnBldInited(bld);//某个建筑初始化成功，根据当前状态添加HudTool、特效之类的东西
	stageOnBldTouch(bld);//某个建筑被点击，决定是否可以选中，选中后是否可以移动
	stageOnBldMoved(bld);//某个建筑被玩家移动，通知新的位置
	stageOnNewBldOK(bld,def);//玩家确定创建某个建筑，通知位置，更新状态
	stageOnNewBldAbort(bld,def);//玩家放弃创建某个建筑
***************************************************/

//---------------------------------------------------------------------------
//初始化舞台对象
__Page.vwBattleStage.initStage=function()
{
	this.appEnv=this.page.appEnv;
	this.game=null;
	this.layer=null;
	this.level=null;
	this.hudTools=null;
	this.tileMap=null;
	this.gameHud=null;
	this.navBox=null;

	this.initGameHud();
};

//***************************************************************************
//用户触屏消息, 建筑选择/取消选择函数
//***************************************************************************
{
	//---------------------------------------------------------------------------
	//舞台的触屏消息处理函数,this为舞台Hud控件
	__Page.vwBattleStage.onLevelTouch=function(msg,x,y,way)
	{
		return this.battleStage.onTouch(msg,x,y,way);
	};

	//---------------------------------------------------------------------------
	//舞台的触屏消息处理函数
	__Page.vwBattleStage.onTouch=function(msg,x,y,way)
	{
		if(!this.isGameLoaded)return 0;
		if(this.state>=2)return 0;
		var page=this.page;
		var level=this.level;
		var game=this.game;
		var bld,bldGame,toolItem,w,aisBld;
		var dx,dy,pos,group;

		return 0;

		if(msg==0 && way==1)//按下,:
		{
			this.dx=x;
			this.dy=y;
			if(this.holdTimer)
			{
				this.appEnv.layer.clearTimeout(this.holdTimer);
			}
			this.putDown=0;
			this.hTime=this.hdTIME;
			this.holdTimer=this.appEnv.layer.setTimeout(this.hTime,this.onUnitHold,this);
		}
		else if(msg==1 && way==0)//移动,
		{
			this.dx=x;
			this.dy=y;
			if (this.putDown)
				this.navBox.setDragEnabled(0);
		}
		else if(msg==2 && way==1)//鼠标抬起
		{
			this.navBox.setDragEnabled(1);
			this.dx=x;
			this.dy=y;
			if(this.navBox.isInPinching)
			{
				if(!this.navBox.isInPinching())
				{
					this.putDownUnit();
				}
			}
			else
				this.putDownUnit();

			if(this.holdTimer)
			{
				this.appEnv.layer.clearTimeout(this.holdTimer);
				this.holdTimer=null;
				this.putDown=0;
				this.hTime=this.hdTIME;
			}
		}
		else if(msg==3 && way==1)//鼠标取消
		{
			if(this.holdTimer)
			{
				this.appEnv.layer.clearTimeout(this.holdTimer);
				this.holdTimer=null;
				this.putDown=0;
				this.hTime=this.hdTIME;
			}
		}
		return 0;
	};

	__Page.vwBattleStage.onUnitHold=function()
	{
		if(this.holdTimer)
		{
			this.appEnv.layer.clearTimeout(this.holdTimer);
			this.holdTimer=null;
		}
		this.putDown=1;
		this.putDownUnit();
		if(!this.holdTimer)
		{
			this.holdTimer=this.appEnv.layer.setTimeout(this.hTime,this.onUnitHold,this);
		}
		if(this.hTime==this.hdTIME){
			this.hTime-=200;
		}else
			this.hTime=100;
	};
	__Page.vwBattleStage.putDownUnit2=function()
	{
		if(this.state>=2)return;
		var page=this.page;
		var level=this.level;
		var game=this.game;
		var textLib=page.appEnv.textLib;
		var bld,bldGame,toolItem,w,aisBld;
		var x,y,pos;
		x=this.dx;
		y=this.dy;
		if(x<0)x=0;
		if(y<0)y=0;
		if(x>this.feildW)x=this.feildW-1;
		if(y>this.feildH)y=this.feildH-1;

		if (-1 != this.curUnitIdx && this.curUnitNum)
		{
			if((this.curUnitGroup==1 || this.curUnitGroup==0)&& level.isInAlermRange && level.isInAlermRange(x,y))
			{
				this.setAlarmRange(null,null,5);
				this.appEnv.stateLogs.showLog(textLib.NotPut);
				return 0;
			}
			this.putUnitNum++;
			if(this.curUnitUnits && this.curUnitUnits.length)
			{
				level.addCommand(1,-1,x,y,this.curUnitIdx,this.curUnitGroup,{bunker:{units:this.curUnitUnits}});
				this.page.audioObject.playSound("alli_effect");
			}else
				level.addCommand(1,-1,x,y,this.curUnitIdx,this.curUnitGroup);

		}else{
			this.appEnv.stateLogs.showLog(textLib.DontHaveSoldiers);
		}
	};
	__Page.vwBattleStage.putDownUnit=function(cmd,focusOrigin)
	{
		var level=this.level;
		var x,y,z,pos,obj;
		x=cmd.x;
		y=cmd.y;
		z=(cmd.z)?cmd.z:0;
		if(x<0)x=0;
		if(y<0)y=0;
		if(x>this.feildW)x=this.feildW-1;
		if(y>this.feildH)y=this.feildH-1;

		if((cmd.group==1 || cmd.group==0)&& level.isInAlermRange && level.isInAlermRange(x,y))
		{
			this.setAlarmRange(null,null,5);
			return 0;
		}
		this.putUnitNum++;
		//obj=level.addCommand(1,-1,x,y,cmd.idx,cmd.group);
		obj=level.addObjectJS(cmd.idx,-1,cmd.group,[x,y,z],0);
		if(cmd.focus)
		{
			this.gameHud.focusObj(obj);
			setFrameout(10,function(){
			this.page.appEnv.addScale2(this.anchorHud,[1,1,1],[1.5,1.5,1.5],0);
			this.setNavBoxRangeByScale(1.5,1);
			},this);
			setFrameout(60,function(){
				this.page.appEnv.addScale2(this.anchorHud,[1.5,1.5,1.5],[1.0,1.0,1.0],0);
				this.setNavBoxRangeByScale(1,1);
			},this);
			if(focusOrigin)
			{
				setFrameout(80,function(){
					if(this.originBld)this.gameHud.focusObj(this.originBld);
				},this);
			}
		}
	};

	__Page.vwBattleStage.startPutDownUnits=function(vo,focusOrigin)
	{
		if(!vo)return;
		var i,j,k,x,y,z,t,cmd,idx,group,ff=0;
		this.units=[];
		for(i=0;i<vo.length;i++)
		{
			cmd=vo[i];
			idx=this.level.getObjDefIdx(cmd.type+cmd.level);
			if(idx==-1)continue;
			k=(this.feildW>>2)+Math.random()*(this.feildW>>1);
			if(cmd.pos)
			{
				x=cmd.pos[0];
				y=cmd.pos[1];
				z=cmd.pos[2];
			}else if(cmd.edge==0)
			{
				x=this.feildW-2;
				y=k;
			}else if(cmd.edge==1){
				x=k;
				y=this.feildH-2;
			}else if(cmd.edge==2){
				x=0;
				y=k;
			}else if(cmd.edge==3){
				x=k;
				y=0;
			}else continue;
			DBOut("+++++units="+x+","+y);
			group=(cmd.type=="UntHealer")?10:1;
			if(cmd.group)group=cmd.group;
			t=cmd.delaytime;

			for(j=0;j<cmd.num;j++)
			{
				if(j==0 && cmd.focus)
					this.units.push({time:t,x:x,y:y,z:z,idx:idx,group:group,focus:cmd.focus});
				else
					this.units.push({time:t,x:x,y:y,z:z,idx:idx,group:group});
				t+=100;
			}
			if(group!=10 && group!=1)
			ff+=cmd.num;
		}
		this.units.sort(function(a,b){return a.time-b.time;});

		this.putIndex=0;
		this.deadNum=0;
		this.unitNum=this.units.length;
		this.unitNum-=ff;
		for(i=0;i< this.units.length;i++)
		{
			cmd=this.units[i];
			this.appEnv.layer.setFrameout(Math.floor(cmd.time*0.04),function(){this.putDownUnit(this.units[this.putIndex],focusOrigin);this.putIndex++;},this);
		}
	};
}

//***************************************************************************
//新增建筑, 建筑升级等
//***************************************************************************
{
}

//***************************************************************************
//初始化舞台, 界面
//***************************************************************************
{
	//初始化CoC游戏的Hud
	__Page.vwBattleStage.initGameHud=function()
	{
		var page;
		var layer,appEnv;
		var scale,css,w,h;

		page=this.page;
		appEnv=page.appEnv;
		this.layer=layer=page.getElementById("ui-layer");
		scale=0.6;

		//创建触屏操作底板,TODO: min/max_pos需要正确的初始化
		this.navBox=layer.addHudItem({
			"type":"nav_box",id:"navBox","pos":[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],ui_event:1,display:1,csm_pos:0,edge_factor:0,
			min_pos:[0,0,0],max_pos:[0,0,0],key:appEnv.appKeys.navBox,inertia_damping:3,
		});
		this.setNavBoxRangeByScale(scale);

		//初始化CoC游戏控件的Hud的Def对象
		var anchorCss={type:"shape",id:"anchor",pos:[appEnv.scrSize[0]>>1,appEnv.scrSize[1]>>1,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],anchor_h:1,anchor_v:1};
		var anchor2Css={type:"shape",id:"anchor2",pos:[-(appEnv.scrSize[0]>>1),-(appEnv.scrSize[1]>>1),0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],anchor_h:0,anchor_v:0};
		this.hudDef={
			type:"coc_game",pos:[appEnv.scrSize[0]>>1,-((54*40))>>1,0],w:this.feildW,h:this.feildH,scale:scale,ui_event:1,
			//type:"coc_game",pos:[0,-((54*44)-appEnv.scrSize[1])>>1,0],w:this.feildW,h:this.feildH,scale:scale,ui_event:1,
			scale_min:Math.max(appEnv.scrSize[0]/3500,0.5),display:0,
			game:this.genGameDefVO(),
			page:this.page,battleStage:this,
			onTouch:this.onLevelTouch
		};
		//初始化CoC游戏控件
		this.anchorHud=layer.addHudItem(anchorCss);
		this.anchor2Hud=this.anchorHud.appendNewChild(anchor2Css);
		this.gameHud=this.anchor2Hud.appendNewChild(this.hudDef);
		this.gameHud.setFocusBound(-2000,-4000,2000,0);
		//this.gameHud=layer.addHudItem(this.hudDef);
		this.game=this.gameHud.getGameMode();
		this.game.battleStage=this;
		this.game.page=page;
		this.game.layer=layer;
		this.game.effects=this.game.getEffects();
		this.game.hudTools=this.game.getHudTools();
		this.game.onGameLoaded=this.onGameLoaded;
		this.objDefs=this.hudDef.game.level.obj_defs;

	};

	//设置navbox的范围
	__Page.vwBattleStage.setNavBoxRangeByScale=function(scale,flag)
	{
		var w,h,appEnv=this.page.appEnv;
		var scrSize=appEnv.scrSize;
		w=72;h=54;
		this.navBox.setMinNavPos([scrSize[0]-(3000/2)*scale,scrSize[1]-(2500)*scale+8,0]);
		this.navBox.setMaxNavPos([(3000/2)*scale,-8,0]);
		if(this.gameHud && !flag)
		this.gameHud.setScale(scale);
	};

	//---------------------------------------------------------------------------
	//CoC游戏初始化完成的回调:
	__Page.vwBattleStage.onGameLoaded=function()
	{
		var self,game,w,h,css,page;
		self=this.battleStage;
		game=self.game;
		page=self.page;

		//在这里初始化底部文本
		w=Math.floor(page.stateBattle.hudBCBox.getW()/2);
		h=page.stateBattle.hudBCBox.getH()-page.imgLib.btn_btminfo.h-12;
		css={
			type:"text",css:page.cssLib.textFineMid.createCSS([w,h,0],"Bottom Text (Level XX)",100,20,1,1,1,1,[255,241,211]),
			display:0,fade:1,fade_size:1,fade_alpha:0
		};
		self.hudBtmText=page.stateBattle.hudBCBox.appendNewChild(css);


		self.level=self.game.level=self.game.getLevel();
		//DBOut("Level: "+self.level);
		self.level.page=self.page;
		self.level.owner=self;
		self.level.onUnitDead=self.onUnitDead;
		self.game.tileMap=self.level.getTileMap();
		//self.navBox.setNavItem(self.gameHud);

		self.toolIdx.clanFlag=game.hudTools.getHudToolDef("clan_flag");

		page.stateBattle.onGameLoaded();
		//初始化已有的建筑
		//self.initCityBlds();

		self.layerIdx.selBldBg=self.game.getLayerByName("gnd_shadow");

		//启动游戏?
		self.startGame();
		//self.layer.setFrameout(0,self.startGame,self);
		self.isGameLoaded=1;

		//设置所有图都读完了的回调：
		game.onGameTexLoaded=self.onGameTexLoaded;
		//这个是为了兼容旧的不支持“onGameTexLoaded”客户端版本添加的，正式版可以去掉
		self.layer.setTimeout(3000,self.onGameTexLoaded,game);
	};

	//---------------------------------------------------------------------------
	//启动当前的CoC游戏引擎逻辑更新
	__Page.vwBattleStage.startGame=function()
	{
		this.game.setGameState(JGXCoCGameMode.STATE_RUNNING);
	};

	__Page.vwBattleStage.onGameTexLoaded=function()
	{
		var self,game,w,h,css,page;
		self=this.battleStage;
		if(self.gameHud.getDisplay())return;
		//取消回调
		this.onGameTexLoaded=null;
		self.gameHud.setDisplay(1);
		self.page.appEnv.layer.setDisplay(1);
		self.page.appEnv.delSearchAni(0);
		//self.page.appEnv.addScale2(self.anchorHud,[0.8,0.8,1],[1,1,1],0);
	};

	//---------------------------------------------------------------------------
	//根据当前的AISGame/King/City创建已有的建筑
	__Page.vwBattleStage.initCityBlds=function()
	{
		var i,j,k,n,id,idx,vo,levels,list,svrCity,cocBld,res,_res=[],rate,clan,curRes=[],fillRate,gameBld;
		var bld,storage,res,gold,oil;
		levels=this.level;

		if(!this.battleInfo)return;
		svrCity=this.battleInfo.oppCity;

		idx=this.resIdx.Gold;
		this.allRes[idx]=svrCity.Gold;

		idx=this.resIdx.Elixir;
		this.allRes[idx]=svrCity.Oil;

		idx=this.resIdx.Cube;
		this.allRes[idx]=svrCity.Cube;
		res=[0,0,0];

		list=svrCity.instances.objs;
		n=list.length;
		//遍历存放各种资源有多少个建筑物
		for(i=0;i<n;i++)
		{
			vo=list[i];
			if(this.bSBF(vo.def))
				this.scoreBldNum++;
			if(!this.levelVO.obj_defs[vo.def])continue;
			storage=this.levelVO.obj_defs[vo.def].storage;
			if(storage)
			{
				for(j=0;j<storage.length;j++)
				{
					res[storage[j].type]++;
				}
			}
		}
		//各种资源在每个建筑平均放多少
		for(i=0;i<this.allRes.length;i++)
		{
			if(!res[i])continue;
			_res[i]=this.allRes[i]%res[i];
			res[i]=Math.floor(this.allRes[i]/res[i]);
			//if(res[i]<1)res[i]=1;
			curRes[i]=this.allRes[i];
		}
		//初始每个建筑存放的资源及其上限
		for(i=0;i<n;i++)
		{
			vo=list[i];
			storage=this.levelVO.obj_defs[vo.def].storage;
			if(storage)
			{
				vo.sg=[];
				for(j=0;j<storage.length;j++)
				{
					if(curRes[storage[j].type])
					{
						if(!vo.sg[storage[j].type])vo.sg[storage[j].type]={t:storage[j].type,m:0,c:storage[j].max};
						vo.sg[storage[j].type].m+=res[storage[j].type];
						curRes[storage[j].type]-=res[storage[j].type];
						if(_res[storage[j].type])
						{
							vo.sg[storage[j].type].m+=_res[storage[j].type];
							curRes[storage[j].type]-=_res[storage[j].type];
							_res[storage[j].type]=0;
						}
					}
				}
			}
		}

		rate=100/this.scoreBldNum;
		id=0;
		//创建各个建筑，并且初始资源建筑
		for(i=0;i<n;i++)
		{
			vo=list[i];
			id++;
			if(vo.codename=="RGunTower" && vo.attackType)vo.def=levels.getObjDefIdx("Alt"+vo.codename+vo.level);
			cocBld=levels.addObjectJS(vo.def,id,vo.group,[vo.x,vo.y,0],45);
			gameBld=this.game.lgcObj2GameObj(cocBld);
			if(vo.focus)
			{
				this.gameHud.focusObj(cocBld);
				this.originBld=cocBld;
			}
			if(this.bSBF(vo.def))
				cocBld.rate=rate;
			if(vo.defName.indexOf("TownHall")!=-1 || vo.defName.indexOf("GoblinMainBuilding")!=-1)cocBld.bMainBase=1;
			if(vo.sg && vo.sg.length)
			{
				for(j=0;j<vo.sg.length;j++)
				{
					res=vo.sg[j];
					if(!res)continue;
					idx=res.t;
					DBOut("---defName="+vo.defName);
					DBOut("------------res.t="+idx+"  res.m="+res.m+" res.c="+(res.m>res.c?res.m:res.c));
					cocBld.setStorage(idx,res.m);
					cocBld.setMaxStorage(idx,res.m>res.c?res.m:res.c);

					fillRate=res.m/(res.m>res.c?res.m:res.c);
					if(fillRate>0.8)
					{
						gameBld.setAniAction(0,ActDef.bld.ACT_STORE3);
					}
					else if(fillRate>0.4)
					{
						gameBld.setAniAction(0,ActDef.bld.ACT_STORE2);
					}
					else
					{
						gameBld.setAniAction(0,ActDef.bld.ACT_STORE1);
					}
				}
			}
		}
	};

	__Page.vwBattleStage.bSBF=function(idx)
	{
		var def;
		def=this.levelVO.obj_defs[idx];
		if(def)
		{
			if(def.group!="Wall" && def.group!="Decorate" && def.group!="Obstacle" && def.group!="Traps")
				return 1;
		}
		return 0;
	};

	__Page.vwBattleStage.onUnitDead=function(list)
	{
		DBOut("--------------onUnitDead");
		var i,unit,rate,self,x,y,idx,def;
		var game,gameBld;
		self=this.owner;
		game=self.game;
		if(self.state>=2)return;
		for(i=0;i<list.length;i++)
		{
			unit=list[i];
			if((unit.getGroup()==2) && (unit.rate>0))
			{
				gameBld=game.lgcObj2GameObj(unit);
				gameBld.setAniLayer(1,self.layerIdx.selBldBg);

				self.curDeadBld++;
				var oldRate=self.deadRate;
				self.deadRate+=unit.rate;
				if(unit.bMainBase)self.giveStar();
				if(oldRate<50 && self.deadRate>=50)self.giveStar();
				DBOut("------oldRate="+oldRate+" deadRate="+self.deadRate);
				DBOut("------curDeadBld="+self.curDeadBld+" scoreBldNum="+self.scoreBldNum);
				if(self.curDeadBld==self.scoreBldNum)
				{
					//self.page.stateBattle.roundOver(1);
					//*
					self.tpf=self.page.appEnv.layer.getTPF();
					DBOut("++++++++tpf="+self.tpf);
					self.gameHud.focusObj(unit);
					self.page.appEnv.addScale2(self.anchorHud,[1,1,1],[1.5,1.5,1.5],0);
					setFrameout(12,function(){
						self.page.appEnv.layer.setTPF(1000/10);
						//self.page.appEnv.addScale2(self.anchorHud,[0.75,0.75,0.75],[1.5,1.5,1],0);
					},self);
					setFrameout(80,function(){
						self.page.appEnv.layer.setTPF(self.tpf);
						self.page.appEnv.addScale2(self.anchorHud,[1.5,1.5,1.5],[1,1,1],0);
						self.page.stateBattle.roundOver(1);
					},self);
					//*/
					if(self.state<2)
					{
						self.giveStar();
						self.deadRate=100;
						//self.page.stateBattle.refreshDmgRate();
						//self.page.stateBattle.endCountDown();
					}
				}
				if(self.state<2)
				{
					//self.page.stateBattle.refreshDmgRate();
				}
			}else if(unit.getGroup()==2){
				idx=unit.getDefIdx();
				def=self.objDefs[idx];
				if(def && def.group=="Traps")
				{
					self.deadsTraps.push({"uid": unit.getId(), "hp": 0, "rate": 0});
				}
			}else if(unit.getGroup()==1 || unit.getGroup()==10){//自己的兵
				self.deadNum++;
				x=unit.getMidX();
				y=unit.getMidY();
				self.creatGrave(x,y);
				DBOut("++++++++++++++self.deadNum="+self.deadNum+" self.unitNum="+self.unitNum+" self.state="+self.state);
				if(self.deadNum>=self.unitNum)
				{
					//self.page.appEnv.addScale2(self.anchorHud,[1.5,1.5,1],[1,1,1],0);
					self.page.stateBattle.roundOver();
				}
			}else if(unit.getGroup()==3 || unit.getGroup()==11){//敌人的兵
				idx=unit.getDefIdx();
				def=self.objDefs[idx];
				if(def)
				{
					self.oppDeads.push({codename:def.codename,level:def.level,num:1});
				}
			}
		}
	};
	__Page.vwBattleStage.creatGrave=function(x,y)
	{
		var i,idx,cocBld;
		idx=this.level.getObjDefIdx("Grave1");
		for(i=0;i<this.alldeads.length;i++)
		{
			if(this.alldeads[i][0]==x && this.alldeads[i][1]==y)
			return;
		}
		if(!this.game.tileMap.isPosGoodForBuildingDef([x,y,0],1,1))
		{
			return;
		}
		this.alldeads.push([x,y]);
		this.deads.push([x,y]);
		this.level.addCommand(1,-1,x,y,idx,0);
	};
	//---------------------------------------------------------------------------
	//创建游戏初始化VO对象
	__Page.vwBattleStage.genGameDefVO=function()
	{
		var gameDefVO
		var page=this.page;
		var ext=window.DeviceType=="IPHONE"?"pvr":"png";
		gameDefVO={
			grid_size:72,
			render_core:{
				max_stub:3600,
				//       0                        1                        2                          3                                                4                          5                      6        7          8         9                      10
				layers:[{name:"bld_base",sort:0},{name:"bld_dock",sort:0},{name:"gnd_shadow",sort:0},{name:"gnd_objs",sort:1,col:1,row:54,tile_w:3168,tile_h:44,grid_x:-1584,grid_y:0},{name:"sky_shadow",sort:0},{name:"gnd_fxs",sort:0},"gnd_ui","sky_objs","sky_ui",{name:"sky_fx",sort:0},"top"]
			},
			//stage:{"gnd_tex":page.genPageURL(window.imgPath+"/gnd/gnd_back_32.png"),"env_tex_1":page.genPageURL(window.imgPath+"/gnd/pic_env_01_32.pvr"),"env_tex_2":page.genPageURL(window.imgPath+"/gnd/pic_env_02_32.pvr")},
			stage:{
				"gnd_tex":page.genPageURL(window.imgPath+"/gnd/gnd_back_32.png"),"env_tex_1":page.genPageURL(window.imgPath+"/gnd/pic_env_01_32."+ext),"env_tex_2":page.genPageURL(window.imgPath+"/gnd/pic_env_02_32."+ext),
				env_offset_x:0,env_offset_y:2*54,
			},
			splib:[{lib:page.genPageURL(window.imgPath+"/fx/fx2.spl"),auto_res:0},{lib:page.genPageURL(window.imgPath+"/ui/ui.spl"),auto_res:0},],
			anis:[
				<include check="0">"ani/ani_buildings.js"</include>
				<include check="0">"ani/ani_characters.js"</include>
				<include check="0">"ani/ani_part.js"</include>
				<include check="0">"ani/ani_uis.js"</include>
				<include check="0">"ani/ani_projectiles.js"</include>
				<include check="0">"ani/ani_effects.js"</include>
			],
			effects:[
				<include check="0">"eft/eft_uis.js"</include>
				<include check="0">"eft/eft_buildings.js"</include>
				<include check="0">"eft/eft_characters.js"</include>
				<include check="0">"eft/eft_battles.js"</include>
			],
			hudtools:[
				<include check="0">"htl/htl_home.js"</include>
			],
			level:this.genLevelDefVO(),
		};
		return gameDefVO;
	};

	//---------------------------------------------------------------------------
	//创建游戏Level初始化VO对象
	__Page.vwBattleStage.genLevelDefVO=function()
	{
		var list,i,n;
		var page=this.page;
		this.levelVO={
			map_w:this.feildW,map_h:this.feildH,map_bolder:2,
			max_search_pre_tick:-1,//每帧最大寻径的次数
			ground_search_count:3,//地面部队N选1
			air_search_count:3,//空中部队N选1
			ground_near_threshold:2,//地面和最近目标相比最大距离差
			air_near_threshold:2,//空中和最近目标相比最大距离差
			ground_disperse_angle_max:64,//地面远程攻击者最大分散的最大角度，64为90度，128为180度，0为不分散
			air_disperse_angle_max:90,//空中攻击者最大分散的最大角度，64为90度，128为180度，0为不分散
			groups:[
				<include check="0">"def/def_groups.js"</include>
			],
			prjtl_defs:[
				<include check="0">"def/def_projectiles.js"</include>
			],
			obj_defs:[
				<include check="0">"def/def_buildings.js"</include>
				<include check="0">"def/def_characters.js"</include>
				<include check="0">"def/def_spells.js"</include>
				<include check="0">"def/def_add.js"</include>
				<include check="0">"def/def_mech.js"</include>
				<include check="0">"def/def_addon.js"</include>
				//TODO: 增加障碍物, 村民, 装饰等
			],
		};
		this.defsVO={};
		//修正战斗单位的combat属性:
		list=this.levelVO.obj_defs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.defsVO[list[i].def_name]=i;

			if(list[i].hp)
			{
				list[i].hp.recover_speed=0;
			}
			if(list[i]._combat)
			{
				list[i].combat=list[i]._combat;
			}
			if(list[i]._summon)
			{
				list[i].summon=list[i]._summon;
			}
			if(list[i]._empower)
			{
				list[i].empower=list[i]._empower;
			}
			if(list[i]._multi_target)
			{
				list[i].multi_target=list[i]._multi_target;
			}
			if(list[i]._trigger)
			{
				list[i].trigger=list[i]._trigger;
			}
			if(list[i].storage && list[i].storage.length)
				this.storageBlds[i]=list[i].storage;
			if(list[i].codename=="Hangar")
			{
				list[i].core_w=1;
				list[i].core_h=1;
			}
		}
		return this.levelVO;
	};

	__Page.vwBattleStage.proxyBattle=function(svrVO)
	{
		if(!svrVO)return;
		var i,j,k,n,idx,vo,levels,list,svrCity,city,objs,cocBld,res,rate,clan,group;
		levels=this.level;
		this.battleInfo={oppCity:{},units:[],clanUnits:[]};

		this.unitIdx=[];
		list=svrVO.selfAttackUnits;
		n=list?list.length:0;
		for(i=0;i<n;i++)
		{
			vo=list[i];
			group=(vo.codename=="UntHealer")?10:1;
			this.battleInfo.units[i]={icon:"",codename:vo.codename+vo.level,num:vo.num,level:vo.level,group:group};
			idx=levels.getObjDefIdx(vo.codename+vo.level);
			this.unitIdx[idx]={codename:vo.codename,level:vo.level,type:"unit"};
			this.unitNum+=vo.num;
		}
		list=svrVO.selfSpellUnits;
		n=list?list.length:0;
		for(i=0;i<n;i++)
		{
			vo=list[i];
			group=(vo.codename=="Lightning")?4:5;
			this.battleInfo.units.push({icon:"",codename:vo.codename+vo.level,num:vo.num,level:vo.level,group:group});
			idx=levels.getObjDefIdx(vo.codename+vo.level);
			this.unitIdx[idx]={codename:vo.codename,level:vo.level,type:"spell"};
		}

		list=svrVO.clanUnits;
		n=list?list.length:0;
		if(n)
		{
			var units=[];
			for(i=0;i<n;i++)
			{
				vo=list[i];
				group=(vo.codename=="UntHealer")?10:1;
				this.battleInfo.clanUnits[i]={icon:"",codename:vo.codename+vo.level,num:vo.num,level:vo.level,group:group};
				idx=levels.getObjDefIdx(vo.codename+vo.level);
				for(j=0;j<vo.num;j++)
					units.push({def:idx,group:group,id:-1,jump:this.objDefs[idx].move.jump});
				this.unitNum+=vo.num;
			}
			idx=levels.getObjDefIdx("ClanHud1");
			this.unitIdx[idx]={codename:"ClanHud",level:1,type:"clan"};
			this.battleInfo.units.push({icon:"",codename:"ClanHud1",num:1,level:1,group:0,units:units});
		}

		this.battleInfo.oppCity=svrVO.oppCity;

		list=svrVO.oppCity.instances.objs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			vo=list[i];
			if(typeof(this.defsVO[vo.defName])!="undefined")
				vo.def=this.defsVO[vo.defName];
			else
				DBOut("+++++not find def+++");
		}

	};
	__Page.vwBattleStage.setResultStage=function(group)
	{
		var i,win,gameObj,unit=this.level.getObjectsByGroup(group);
		if(!unit.length)return;
		win=this.star?1:0;
		for(i=0;i<unit.length;i++)
		{
			if(win){
				gameObj=this.game.lgcObj2GameObj(unit[i]);
				gameObj.setAniAction(0,ActDef.chr.ACT_CHEER);
				unit[i].setCombatEnabled(0);
			}else{
				unit[i].setCrashed(1);
			}
		}
	};
	__Page.vwBattleStage.reSet=function()
	{
		this.level.reset();
		this.battleInfo=null;
		this.curUnitIdx=-1;
		this.curUnitGroup=-1;
		this.curUnitUnits=null;
		this.allObjs=[];
		this.allRes=[0,0,0,0];

		this.deadsTraps=[];
		this.curUnitNum=0;
		this.unitIdx=[];
		this.deads=[];
		this.alldeads=[];
		this.deadNum=0;
		this.oppDeads=[];
		this.deadRate=0;
		this.scoreBldNum=0;
		this.curDeadBld=0;
		this.state=0;
		this.star=0;
		this.unitNum=0;
		this.cmdUnits={};
		this.logcmds=[];
		this.putUnitNum=0;
	};

	__Page.vwBattleStage.setAlarmRange=function(c,bc,time)
	{
		this.game.setARColor(128,0,0,32);
		this.game.setARBolderColor(90,0,0,200);
		if(this.game.showAlarmRange)this.game.showAlarmRange(time);
	};

	__Page.vwBattleStage.giveStar=function()
	{
		this.star++;
		if(this.star>3)this.star=3;
		//this.page.stateBattle.giveStar();
	};
	__Page.vwBattleStage.getHonor=function()
	{
		if(!this.battleInfo)return 0;
		if(!this.putUnitNum)return 0;
		if(this.star==0)
		{
			return -this.battleInfo.oppCity.honor.fail;

		}else{
			return Math.floor(this.battleInfo.oppCity.honor.win*this.star/3);
		}

	};
}
}