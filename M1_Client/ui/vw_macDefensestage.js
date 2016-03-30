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
	curUnitExvo:null,
	curUnitGroup:-1,
	curUnitUnits:null,
	allObjs:[],
	allRes:[0,0,0,0],
	feildW:44,
	feildH:44,

	curUnitNum:0,
	unitIdx:[],
	deads:[],//死去对象数组（发消息会清除）
	alldeads:[],
	deadNum:0,//死去对象个数
	unitNum:0,//总共带兵数量
	allFoeNum:0,//敌人总数量
	curDeadFoe:0,//当前死去敌人个数
	state:0,//0游戏未开始,1战斗中,2战斗结束
	resIdx:{"Gold":0,"Elixir":1,"Oil":1},
	star:0,//0,1,2,3星级
	foeDeads:{},//击杀敌人的种类和数量
	logcmds:[],
	putUnitNum:0,
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
	allObjId:[0],//所有要计算血量的obj的instanceId集合
	userMechId:[],//玩家机甲在allObjId里的下标
	userMechObj:[],//敌人机甲actorCraft实例数组
	foeMechId:[],//敌人机甲在allObjId里的下标
	foeMechObj:[],//敌人机甲actorCraft实例数组
	mechSkillId:[],//玩家机甲释放的技能在allObjId里的下标
	foeLoot:[],//整场战斗敌人掉落的物品
	allfoeLoot:[],//敌人掉落物品，下标为兵的id
	curLoot:[],//此轮掉落每20秒重置一次
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
	__Page.vwBattleStage.putDownUnit=function()
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

		DBOut("+++this.curUnitIdx="+this.curUnitIdx+" this.curUnitNum="+this.curUnitNum);
		if (-1 != this.curUnitIdx && this.curUnitNum)
		{
			if((this.curUnitGroup==1 || this.curUnitGroup==0 || this.curUnitGroup==12)&& level.isInAlermRange && level.isInAlermRange(x,y))
			{
				this.setAlarmRange(null,null,5);
				this.appEnv.stateLogs.showLog(textLib.NotPut);
				return 0;
			}

			if(this.curUnitGroup==5 || this.curUnitGroup==4)
			{
				if(!page.stateBattle.checkSklCD())return;
				page.stateBattle.resetSkillCD();
			}

			this.putUnitNum++;
			if(this.curUnitUnits && this.curUnitUnits.length)
			{
				level.addCommand(1,-1,x,y,this.curUnitIdx,this.curUnitGroup,{bunker:{units:this.curUnitUnits}});
				this.page.audioObject.playSound("alli_effect");
			}else if(this.curUnitExvo && this.curUnitExvo.instanceId){
				if(this.curUnitExvo.state>1)
				{
					this.appEnv.stateLogs.showLog(textLib.NotPutByMedal);
					return;
				}
				var k=this.allObjId.length;
				this.allObjId.push(this.curUnitExvo.instanceId+1);
				this.userMechId.push(k);
				this.curUnitExvo.uid=k;
				level.addCommand(1,-1,x,y,this.curUnitIdx,this.curUnitGroup,{uid:k});
				this.layer.setFrameout(1,function(){
					var lgcObj=this.getLogicObjByGroupUId(this.curUnitGroup,k);
					this.addLvTool(lgcObj,this.curUnitExvo.bodyLv,this.curUnitExvo.legLv,0,-110);
					this.setMechColorFlash(k,1);
				},this);
			}else{
				level.addCommand(1,-1,x,y,this.curUnitIdx,this.curUnitGroup);
			}

			page.stateBattle.putDownUnit();
			this.resetUserMechObj();
			if(this.state==0)
			{
				//this.layer.setFrameout(1,function(){
					if(this.page.audioObject && this.page.audioObject._init)
					{
						this.page.audioObject.playMp3("battle_1",-1);
					}
					this.setAlarmRange(null,null,0);
					//this.appEnv.layer.setTimeout(0,page.stateBattle.startCountDown,page.stateBattle);
					page.stateBattle.aboutTimerLUDT(0,null);
					page.stateBattle.Timer3mHud.setDisplay(0);
					page.stateBattle.startCountDown();
					page.stateBattle.endBattleBtn.getItemById("NoReduce").setDisplay(0);
					var pos=[],item=page.stateBattle.endBattleBtn.getItemById("EndBattle");
					item.setPos([0,0,0]);
				//},this);
			}
		}else{
			if(this.state<1)return;
			DBOut("+++this.curUnitExvo="+toJSON(this.curUnitExvo));
			if(this.curUnitExvo && this.curUnitExvo.instanceId)
			{
				if(this.curUnitExvo.control)
				{
					if(!page.stateBattle.checkControlCD())return;
					level.addCommand(2,-1,this.curUnitGroup,this.curUnitExvo.uid,x,y);
					var eft=this.game.effects.getEffectDef("unit_deploy_UntMarine_1");
					if(eft>=0)this.game.effects.addEffect(eft,[x,y,0],[x,y,0]);
					page.stateBattle.resetControlCD();
					this.getMechScore();
					return;
				}
			}
			this.appEnv.stateLogs.showLog(textLib.DontHaveSoldiers);
		}
	};

	__Page.vwBattleStage.putDownMechSkill=function(skill,lv)
	{
		if(this.curUnitExvo && this.curUnitExvo.instanceId)
		{
			if(!this.curUnitExvo.skill)return;
			var i,n,k,id,obj;
			n=this.curUnitExvo.skill.length;
			for(i=0;i<n;i++)
			{
				if(this.curUnitExvo.skill[i].codename==skill)
				{
					k=1;
					break;
				}
			}
			if(!k)return;
			k=this.curUnitExvo.uid;
			if(!k)return;

			var pos=[0,0,0],idx,group;
			var level=this.level;

			obj=level.getObject(12,k);
			if(!obj)return;
			idx=level.getObjDefIdx(skill+lv);
			group=skill=="Lightning"?4:5;
			obj.getPos(pos);

			k=this.allObjId.length;
			this.allObjId.push(0);
			this.mechSkillId.push(k);
			level.addCommand(1,-1,pos[0],pos[1],idx,group,{uid:k});
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
		scale=1;

		//创建触屏操作底板,TODO: min/max_pos需要正确的初始化
		this.navBox=layer.addHudItem({
			"type":"nav_box",id:"navBox","pos":[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],ui_event:1,display:1,csm_pos:0,edge_factor:0,
			min_pos:[0,0,0],max_pos:[0,0,0],key:appEnv.appKeys.navBox,inertia_damping:3,
		});
		this.setNavBoxRangeByScale(scale);

		//初始化CoC游戏控件的Hud的Def对象
		this.hudDef={
			type:"coc_game",pos:[appEnv.scrSize[0]>>1,-((54*40))>>1,0],w:this.feildW,h:this.feildH,scale:scale,ui_event:1,
			scale_min:Math.max(appEnv.scrSize[0]/3500,0.5),display:0,
			game:this.genGameDefVO(),
			page:this.page,battleStage:this,
			onTouch:this.onLevelTouch
		};
		//初始化CoC游戏控件
		this.gameHud=layer.addHudItem(this.hudDef);
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
	__Page.vwBattleStage.setNavBoxRangeByScale=function(scale)
	{
		var w,h,appEnv=this.page.appEnv;
		var scrSize=appEnv.scrSize;
		w=72;h=54;
		this.navBox.setMinNavPos([scrSize[0]-(3000/2)*scale,scrSize[1]-(2500)*scale+8,0]);
		this.navBox.setMaxNavPos([(3000/2)*scale,-8,0]);
		if(this.gameHud)
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
		self.level.OnStartAttack=self.OnStartAttack;
		self.game.tileMap=self.level.getTileMap();
		self.navBox.setNavItem(self.gameHud);

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
		self.page.appEnv.addScale(self.gameHud,[0.8,0.8,1],[1,1,1]);
	};

	//---------------------------------------------------------------------------
	//根据当前的AISGame/King/City创建已有的建筑
	__Page.vwBattleStage.initCityBlds=function(bMacDefense)
	{
		var i,j,k,n,idx,vo,levels,list,svrCity,cocBld,res,rate,clan,gp,group,fillRate,gameBld,def;
		levels=this.level;

		if(!this.battleInfo)return;
		svrCity=this.battleInfo.stage;
		list=svrCity.instances;
		n=list.length;
		gp=bMacDefense?0:2;

		var id=0;
		//创建各个建筑，并且初始资源建筑
		for(i=0;i<n;i++)
		{
			vo=list[i];
			id++;
			idx=levels.getObjDefIdx(vo.defName);
			def=this.objDefs[idx];
			cocBld=levels.addObjectJS(vo.def,-1,gp,[vo.x,vo.y,0],45);
			gameBld=this.game.lgcObj2GameObj(cocBld);

			if(vo.defName.indexOf("TownHall")!=-1 || vo.defName.indexOf("GoblinMainBuilding")!=-1)cocBld.bMainBase=1;

			if(vo.defName.indexOf("Hangar")!=-1)
			{
				var mech,craft,x,y;
				for(j=0;j<this.battleInfo.mechs.length;j++)
				{
					mech=this.battleInfo.mechs[j];
					if(mech.instanceId==vo.id)
					{
						idx=levels.getObjDefIdx(mech.codename);
						x=vo.x+(def.tile_w/2)+0.1;
						y=vo.y+(def.tile_h/2)+0.1;
						//var s=this.allObjId.length;
						//this.allObjId.push(vo.id+1);
						//this.userMechId.push(s);
						craft=new this.page.actorCraft(this.appEnv,this,x,y);
						craft.addToStage(idx,x,y,mech.uid,9);
						craft.addLvTool(mech.bodyLv,mech.legLv);
						craft.setLvToolPos(0,-110);
						craft.moveToNextBld();
						this.userMechObj.push(craft);
						break;
					}
				}
			}
		}
	};

	__Page.vwBattleStage.resetUserMechObj=function()
	{
		if(this.bResetFoeMech)return;
		var i,n,x,y,obj,craft,mechs=[];
		n=this.userMechObj.length;
		for(i=0;i<n;i++)
		{
			obj=this.userMechObj[i];
			craft=new this.page.actorCraft(this.appEnv,this,obj.birthPos[0],obj.birthPos[1]);
			craft.addCommandToStage(obj.cocDefIdx,obj.birthPos[0],obj.birthPos[1],obj.uid,12,obj.bodyLv,obj.legLv,0,-110);
			obj.signAsDead();
		}
		this.bResetFoeMech=1;
	};

	__Page.vwBattleStage.onUnitDead=function(list)
	{
		DBOut("--------------onUnitDead");
		var i,unit,rate,self,x,y,idx,def,pos,uid,obj;
		var game,gameBld;
		self=this.owner;
		game=self.game;
		if(self.state>=2)
		{
			for(i=0;i<list.length;i++)
			{
				unit=list[i];
				if(unit.getGroup()==12){//自己的机甲
					self.onMechDead(unit);
				}else if(unit.getGroup()==13){//敌人的机甲
					self.onMechDead(unit);
				}
			}
			return;
		}
		for(i=0;i<list.length;i++)
		{
			unit=list[i];
			if(unit.getGroup()==3 || unit.getGroup()==11)
			{//敌人的兵
				self.curDeadFoe++;

				x=unit.getMidX();
				y=unit.getMidY();
				idx=self.level.getObjDefIdx("Grave1");
				obj=self.level.addObjectJS(idx,-1,9,[x,y,0],45);

				idx=unit.getDefIdx();
				uid=unit.getId();
				def=self.objDefs[idx];
				if(def)
				{
					self.page.stateBattle.refreshOppDeads({codename:def.codename,level:def.level,num:1});
					self.addFoeScore(obj,Math.floor(def.WaveBattleScore*self.unitScoreC));
				}

				if(uid!=-1)
				{
					if(self.allfoeLoot[uid])
					{
						self.curLoot.push(self.allfoeLoot[uid].waveId);
						self.foeLoot.push(self.allfoeLoot[uid]);
						self.onUnitLoot(obj);
						DBOut("+++++++++wave loot+++++="+toJSON(self.allfoeLoot[uid]));
					}
				}
				if(self.curDeadFoe==self.allFoeNum)
				{
					if(self.state<2)
					{
						self.page.stateBattle.endCountDown();
					}
				}
			}
			else if(unit.getGroup()==12)
			{//自己的机甲
				self.onSelfUnitDead(unit,1);
				self.onMechDead(unit);
			}
		}
	};

	__Page.vwBattleStage.addFoeScore=function(obj,num)
	{
		var idx;
		idx=this.game.hudTools.getHudToolDef("bld_resNum");
		if(idx!=-1)
		{
			var gameObj=this.game.lgcObj2GameObj(obj);
			obj.scoreTool=this.game.hudTools.addToolOn(idx,gameObj);
			var tool=obj.scoreTool.getSubItem(0).getHudItem();
			tool._setText("+"+num);
			tool.startAniEx([0,-100,0],1.5,1,20,0);
			tool.tool=obj.scoreTool;
			tool.onAniDone=function()
			{
				this.fadeOut(20,0);
				this.tool.fadeOut(0.1,1);
			};
		}
	};

	__Page.vwBattleStage.onUnitLoot=function(obj)
	{
		var idx,gobj;
		var eft=this.game.effects.getEffectDef("unit_drop");
		gobj=this.game.lgcObj2GameObj(obj);
		gobj.playEffect(eft);
	};
	__Page.vwBattleStage.onMechDead=function(unit)
	{
		var idx,x,y,def;

		this.removeLvTool(unit);

		idx=unit.getDefIdx();
		x=unit.getMidX();
		y=unit.getMidY();
		def=this.objDefs[idx];
		if(def.combat)
		{
			def._combat=def.combat;
		}
		if(def)
		{
			var obj=this.level.addObjectJS(idx,-1,9,[x,y,0],45);
			var eft=this.game.effects.getEffectDef("par_destroied2");
			obj=this.game.lgcObj2GameObj(obj);
			obj.playEffect(eft);
		}
	};

	__Page.vwBattleStage.onSelfUnitDead=function(unit,bMech)
	{
		var x,y;
		this.deadNum++;
		if(!bMech)
		{
			x=unit.getMidX();
			y=unit.getMidY();
			this.creatGrave(x,y);
		}
		DBOut("++++++++++++deadNum="+this.deadNum+" unitNum="+this.unitNum+" state="+this.state);
		if(this.deadNum>=this.unitNum)
		{
			if(this.state<2)
			{
				this.page.stateBattle.endCountDown();
			}
		}
	};

	__Page.vwBattleStage.OnStartAttack=function(obj)
	{
		obj.setSight(40);
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
		var levelVO,list,i,n;
		var page=this.page;
		levelVO=this.levelVO={
			map_w:this.feildW,map_h:this.feildH,map_bolder:2,
			max_search_pre_tick:-1,//每帧最大寻径的次数
			ground_search_count:3,//地面部队N选1
			air_search_count:3,//空中部队N选1
			ground_near_threshold:2,//地面和最近目标相比最大距离差
			air_near_threshold:2,//空中和最近目标相比最大距离差
			ground_disperse_angle_max:64,//地面远程攻击者最大分散的最大角度，64为90度，128为180度，0为不分散
			air_disperse_angle_max:90,//空中攻击者最大分散的最大角度，64为90度，128为180度，0为不分散
			groups:[
				<include check="0">"def/def_macdefense_groups.js"</include>
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

		this.mechHPC=this.page.stateBattle.gameVO.mechHPC;
		//修正战斗单位的combat属性:
		list=levelVO.obj_defs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.defsVO[list[i].def_name]=i;

			if(this.mechHPC>1)
			{
				if(list[i].type==1 && list[i].hp)
				{
					list[i].hp.full=list[i].hp.full/this.mechHPC;
					list[i].hp.cur=list[i].hp.full;
				}
				if(list[i].type==2 && list[i].sub_type==1 && list[i]._combat)
				{
					list[i]._combat.damage=list[i]._combat.damage/this.mechHPC;
				}
			}
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
			if(list[i].codename=="Hangar")
			{
				list[i].core_w=1;
				list[i].core_h=1;
			}
		}

		return levelVO;
	};

	__Page.vwBattleStage.proxyMacDefense=function(svrVO)
	{
		if(!svrVO)return;
		var i,j,k,n,idx,vo,levels,list,svrCity,city,objs,cocBld,res,rate,clan,group,codename,skl,loot;
		levels=this.level;
		this.battleInfo={stage:{},units:[],skllist:[],mechs:[],waveLoots:[]};

		this.unitIdx=[];

		this.battleInfo.stage=svrVO.stage;

		this.unitScoreC=svrVO.unitScoreC;
		this.remainTimesScoreC=svrVO.remainTimesScoreC;
		this.treatC=svrVO.treatC;
		this.mechHPC=svrVO.mechHPC;
		this.mechScoreC=svrVO.mechScoreC;
		this.resRewardC=svrVO.rewardResModfiy;
		this.resRewardCodename=svrVO.rewardResType
		this.battleInfo.waveLoots=svrVO.waveLoots;
		this.battleInfo.stageBonus=svrVO.stageBonus;

		this.battleInfo.oppunits=svrVO.stage.oppunits;
		this.controlCD=svrVO.stage.controlCD;
		this.allskillCD=svrVO.stage.allskillCD;
		this.gemNum=svrVO.gemNum;


		list=svrVO.mechs;
		this.mechsVO=svrVO.mechs;
		if(list)
		{
			n=list.length;
			if(n)
			{
				var body,leg,plug,parts={};
				for(i=0;i<n;i++)
				{
					vo=list[i];
					group=12;
					codename="UserMac"+(i+1);
					this.battleInfo.mechs[i]={icon:"",codename:codename,num:1,level:vo.up.level,group:group,instanceId:vo.instanceId,bodyLv:vo.up.level,legLv:vo.down.level};

					idx=levels.getObjDefIdx(vo.up.codename+vo.up.level);
					body=idx!=-1?this.objDefs[idx]:null;
					idx=levels.getObjDefIdx(vo.down.codename+vo.down.level);
					leg=idx!=-1?this.objDefs[idx]:null;
					if(vo.plug && vo.plug.codename)
					{
						idx=levels.getObjDefIdx(vo.plug.codename);
						plug=idx!=-1?this.objDefs[idx]:null;
					}else
						plug=null;
					var exvo=this.replaceObjDef(codename,body,leg,plug);
					exvo.state=vo.state;
					exvo.instanceId=vo.instanceId;
					exvo.control=1;

					var k=this.allObjId.length;
					this.allObjId.push(exvo.instanceId+1);
					this.userMechId.push(k);
					exvo.uid=k;
					this.battleInfo.mechs[i].uid=k;

					idx=levels.getObjDefIdx(codename);
					this.unitIdx[idx]={fullcodename:codename,codename:codename,level:vo.up.level,icon:vo.up.codename,type:"mech"};
					this.battleInfo.units.push({icon:vo.up.codename,codename:codename,num:0,level:vo.up.level,group:group,instanceId:vo.instanceId,exvo:exvo});
					if(!(vo.state>1))
						this.unitNum++;
				}

				var m,bld;
				k=0;
				m=svrVO.stage.instances.length;
				for(i=0;i<m;i++)
				{
					if(k>=n)break;
					bld=svrVO.stage.instances[i];
					if(bld.codename!="Hangar")continue;
					bld.id=list[k].instanceId;
					k++;
				}
			}
		}

		list=svrVO.magicLevel;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				vo=list[i];
				if(vo.level<1)continue;
				group=(vo.unitCodename=="Lightning")?4:5;
				skl=svrVO.stage.skill[vo.unitCodename];
				this.battleInfo.skllist.push({codename:vo.unitCodename,fullcodename:vo.unitCodename+vo.level,num:1000,level:vo.level,group:group,exvo:{baseGem:skl.baseGem,incGem:skl.incGem,skillCD:skl.skillCD}});
			}
		}

		list=svrVO.waveLoots;
		loot=[];
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				vo=list[i];
				loot[vo.waveId]=vo;
			}
		}

		list=svrVO.stage.oppunits;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				vo=list[i];
				this.allFoeNum+=vo.num;
				vo.loot=loot[vo.wave];
				idx=levels.getObjDefIdx(vo.type+vo.level);
				if(idx!=-1)
					this.unitIdx[idx]={fullcodename:vo.type+vo.level,codename:vo.type,level:vo.level,type:"foeunit",score:Math.floor(this.objDefs[idx].WaveBattleScore*this.unitScoreC)};
			}
		}

		if(this.treatC>1)
		{
			i=1;
			idx=levels.getObjDefIdx("Heal"+i);
			while(idx!=-1)
			{
				vo=this.levelVO.obj_defs[idx];
				vo.combat.damage=-Math.floor(-vo.combat.damage*this.treatC);
				vo.combat.damage_min=vo.combat.damage;
				levels.replaceObjDef(idx,vo);
				i++;
				idx=levels.getObjDefIdx("Heal"+i);
			}
		}

		list=svrVO.stage.instances;
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

	__Page.vwBattleStage.startDefense=function()
	{
		this.resetUserMechObj();
		var vo,cmd;
		vo=this.battleInfo.oppunits;
		this.wave=0;
		cmd=vo[this.wave];
		if(cmd)
			this.layer.setFrameout(cmd.delaytime,this.putDownWave,this);
	};
	__Page.vwBattleStage.putDownWave=function()
	{
		var i,j,k,t,x,y,vo,cmd,idx,group,uid;
		vo=this.battleInfo.oppunits;
		cmd=vo[this.wave];
		if(!cmd)return;

		this.wave++;
		t=cmd.delaytime;
		if(vo[this.wave])
		{
			this.layer.setFrameout(vo[this.wave].delaytime-t,this.putDownWave,this);
		}

		idx=this.level.getObjDefIdx(cmd.type+cmd.level);
		if(idx==-1)return;
		k=(this.feildW>>2)+Math.random()*(this.feildW>>1);
		if(cmd.edge==-1)
		cmd.edge=Math.floor(Math.random()*4);
		if(cmd.pos)
		{
			x=cmd.pos[0];
			y=cmd.pos[1];
		}else if(cmd.edge==0)
		{
			x=this.feildW-2;
			y=k;
		}else if(cmd.edge==1){
			x=k;
			y=this.feildH-2;
		}else if(cmd.edge==2){
			x=0.01;
			y=k;
		}else if(cmd.edge==3){
			x=k;
			y=0.01;
		}else return;

		group=(cmd.type=="UntHealer")?11:3;

		t=0;
		for(j=0;j<cmd.num;j++)
		{
			this.layer.setFrameout(t,function(){
				uid=this.self.allObjId.length;
				this.self.allObjId.push(idx);
				if(cmd.loot && this.index==cmd.num-1)
				{
					this.self.allfoeLoot[uid]=cmd.loot;
				}
				this.self.level.addCommand(1,-1,x,y,idx,group,{uid:uid});
			},{self:this,index:j});
			t+=40;
		}
	};

	__Page.vwBattleStage.replaceObjDef=function(def_name,body,leg,plug,bfoe)
	{
		if(!body || !leg)return;
		var i,defVO,idx,defIdx,hp,exvo={};
		hp=body.hp.full+leg.hp.full;
		defVO={
			def_name:def_name,type:2,sub_type:11,id:0,tile_w:0,tile_h:0,core_w:1,core_h:1,hpbar_y:36,
			ed_size:0.5,ed_r:0,ed_attack:1,
			ani_body:leg.ani_body,ani_head:body.ani_head,ani_bg:"chr_tank_bg",
			layer_bg:"gnd_shadow",layer_body:"gnd_objs",layer_ui:"gnd_ui",
			layer_jump_bg:"sky_shadow",layer_jump_body:"sky_objs",
			hp:{full:hp,cur:hp,recover_speed:0},
			move:{speed:leg.move.speed,fly:0,jump:body.move.jump},
			combat:{
				delay_time: body._combat.delay_time,
				reload_time: body._combat.reload_time,
				damage_per_sec: body._combat.damage_per_sec,
				damage: body._combat.damage,
				damage_range: body._combat.damage_range,
				attack_range_max: body._combat.attack_range_max,
				sight: body._combat.sight,
				ignore_target_out_of_sight:bfoe?1:0,
				notify_attack:bfoe?1:0,
				perfer_target: body._combat.perfer_target,
				perfer_dmg_mod: body._combat.perfer_dmg_mod,
				projectile: body._combat.projectile,
				attack_air: body._combat.attack_air,
				attack_gnd: body._combat.attack_gnd,
				pos:body._combat.pos?body._combat.pos:[0,0,0],
			},
			onhit_cdtime:body.onhit_cdtime,
			effect_jumpon:"jump_on",effect_jumpoff:"jump_off",
			efts_depoly:body.efts_depoly,
			efts_crash:body.efts_crash,
			efts_onhit:body.efts_onhit,
			efts_hit:body.efts_hit,
			efts_attack:body.efts_attack,
			efts_start_attack:body.efts_start_attack?body.efts_start_attack:[],
		};
		exvo.control=body.move.control;
		if(plug && plug.effect)
		{
			for(i in plug.effect)
			{
				if(i=="damage")
					defVO.combat.damage=Math.floor(defVO.combat.damage*(1+plug.effect[i]));
				else if(i=="hp"){
					defVO.hp.full=Math.floor(defVO.hp.full*(1+plug.effect[i]));
					defVO.hp.cur=Math.floor(defVO.hp.cur*(1+plug.effect[i]));
				}else if(i=="speed")
					defVO.move.speed=defVO.move.speed+plug.effect[i];
				else if(i=="reload_time")
					defVO.combat.reload_time=Math.floor(defVO.combat.reload_time*(1+plug.effect[i]));
				else if(i=="perfer_target"){
					if(plug.effect[i]==1)//喜好资源
						defVO.combat.perfer_target=10;
					else if(plug.effect[i]==2)//喜好防御
						defVO.combat.perfer_target=9;
					else if(plug.effect[i]==3)//喜好机甲
						defVO.combat.perfer_target=11;
				}else if(i=="damage_range")
					defVO.combat.damage_range+=plug.effect[i];
				else if(i=="jump"){
					if(plug.effect[i])defVO.move.jump=1;
				}else if(i=="control"){
					if(plug.effect[i])exvo.control=1;
				}else if(i=="skill"){
					exvo.skill=[{codename:plug.effect[i].codename,icon:"spell_"+plug.effect[i].codename,level:plug.effect[i].level,num:1}];
				}
			}
		}

		//if(bfoe)
		defVO.move.jump=1;
		defIdx=this.level.getObjDefIdx(def_name);
		this.objDefs[defIdx].hp.full=defVO.hp.full;
		this.level.replaceObjDef(defIdx,defVO);
		exvo.bodyLv=body.level;
		exvo.legLv=leg.level;
		return exvo;
	};

	__Page.vwBattleStage.getBattleLog=function()
	{
		var i,j,k,n,list,log,cmd,obj,def,time,overFlag,units={},bldHps=[],userMechHps=[],foeMechHps=[],ammo=[];
		log=this.level.getBattleLog();
		//DBOut("----log="+toJSON(log));
		DBOut("----this.state="+this.state);

		this.logcmds.push.apply(this.logcmds,log.cmds);

		list=log.cmds;
		n=list.length;
		for(i=0;i<n;i++)
		{
			cmd=list[i];
			if(cmd[0]==2)continue;
			if(cmd.length >=7 && cmd[6])
			{
				k=0;
				for(j=0;j<this.mechSkillId.length;j++)
				{
					if(this.mechSkillId[j]==cmd[6].uid)
					{
						k=1;
						break;
					}
				}
				if(k)continue;
			}

			def=this.unitIdx[cmd[4]];
			if(def)
			{
				if(def.type=="mech")
				{
					userMechHps.push({uid:this.allObjId[cmd[6].uid]-1,hp:1,rate:1});
					continue;
				}
			}
		}

		list=log.hps;
		n=list.length;
		for(i=0;i<n;i++)
		{
			obj=list[i];
			if(this.allObjId[obj.uid])
			{
				k=0;
				for(j=0;j<this.userMechId.length;j++)
				{
					if(this.userMechId[j]==obj.uid)
					{
						userMechHps.push({uid:this.allObjId[obj.uid]-1,hp:obj.hp,rate:obj.rate});
						k=1;
						break;
					}
				}
				if(k)continue;
				k=0;
				for(j=0;j<this.foeMechId.length;j++)
				{
					if(this.foeMechId[j]==obj.uid)
					{
						foeMechHps.push({uid:this.allObjId[obj.uid]-1,hp:obj.hp,rate:obj.rate});
						k=1;
						break;
					}
				}
				if(k)continue;
				//bldHps.push({uid:this.allObjId[obj.uid]-1,hp:obj.hp,rate:obj.rate});
				if(!obj.hp)
				{
					def=this.unitIdx[this.allObjId[obj.uid]];
					if(def)
					{
						if(!this.foeDeads[def.codename])this.foeDeads[def.codename]={codename:def.codename,num:0,level:def.level,type:def.type,icon:def.icon,score:0};
						this.foeDeads[def.codename].num++;
						this.foeDeads[def.codename].score+=def.score;
						if(!units[def.fullcodename])units[def.fullcodename]={codename:def.codename,num:0,level:def.level,score:0};
						units[def.fullcodename].num++;
						units[def.fullcodename].score+=def.score;
					}
				}
			}
		};
		//log.hps=bldHps;
		log.mechs=userMechHps;
		log.oppMechs=foeMechHps;
		log.waveLoots=this.curLoot;
		log.remainTimeS=this.page.stateBattle.remainTime();

		if(this.curDeadFoe>=this.allFoeNum)
			this.timeScore=Math.floor(log.remainTimeS*this.remainTimesScoreC);
		else
			this.timeScore=0;
		this.foeScore=this.page.stateBattle.remainUnitScore();
		this.getMechScore();

		log.battleScore=this.timeScore+this.foeScore+this.macScore;
		this.curLoot=[];

		log.dead=[];
		if(this.deads.length)
		{
			log.dead=this.deads;
			this.deads=[];
		}

		if((this.deadNum>=this.unitNum) || (this.curDeadFoe>=this.allFoeNum) || this.state==2)
		{

			this.foeDeadNum=this.page.stateBattle.remainDeadUnits();
			this.stageReward={codename:this.resRewardCodename,num:Math.floor((this.timeScore+this.foeScore+this.macScore)*this.resRewardC)};
			if(this.curDeadFoe>=this.allFoeNum)
			{
				this.winner=1;
				log.waveLoots.push(this.battleInfo.stageBonus.waveId);
				this.stageLoot=this.battleInfo.stageBonus;
			}
			overFlag=1;
			this.state=2;
		}else
			overFlag=0;
		if(window.aisNTEngine)
		{
			log.cmdUnits=[];
			for(i in units)
			{
				log.cmdUnits.push({codename:units[i].codename,level:units[i].level,num:units[i].num});
			}
			time=0;
			window.aisNTEngine.execFakeCmd(null,"MacDefense_Log",{overFlag:overFlag,log:log},null,time);
		}
		if(this.state==2)
		{
			this.state=3;
			this.setResultStage(1);
			this.setResultStage(10);
			this.setResultStage(12);
			this.setCombatEnabledByGroup(2);
			this.setResultStage(3,1);
			this.setResultStage(11,1);
			this.setResultStage(13,1);
			this.appEnv.layer.setTimeout(3000,function()
			{
				this.page.stateBattle.showSettlement();
			},this);
		}

	};
	__Page.vwBattleStage.setResultStage=function(group,bfoe)
	{
		var i,win,gameObj,unit=this.level.getObjectsByGroup(group);
		if(!unit.length)return;
		win=(this.curDeadFoe>=this.allFoeNum)?1:0;
		if(bfoe)win=1-win;
		for(i=0;i<unit.length;i++)
		{
			if(win){
				gameObj=this.game.lgcObj2GameObj(unit[i]);
				if(!bfoe)
					gameObj.setAniAction(0,ActDef.chr.ACT_CHEER);
				unit[i].setCombatEnabled(0);
			}else{
				unit[i].setCrashed(1);
			}
		}
	};
	__Page.vwBattleStage.setCombatEnabledByGroup=function(group)
	{
		var i,unit;

		unit=this.level.getObjectsByGroup(group);
		if(!unit || !unit.length)return;

		for(i=0;i<unit.length;i++)
		{
			unit[i].setCombatEnabled(0);
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

		this.curUnitNum=0;
		this.unitIdx=[];
		this.deads=[];
		this.alldeads=[];
		this.deadNum=0;
		this.allFoeNum=0;
		this.curDeadFoe=0;
		this.state=0;
		this.star=0;
		this.unitNum=0;
		this.foeDeads={};
		this.logcmds=[];
		this.putUnitNum=0;

		this.allObjId=[0];
		this.userMechId=[];
		this.userMechObj=[];
		this.foeMechId=[];
		this.foeMechObj=[];
		this.mechSkillId=[];
		this.allfoeLoot=[];
		this.foeLoot=[];
		this.bResetFoeMech=0;
	};

	__Page.vwBattleStage.setAlarmRange=function(c,bc,time)
	{
		this.game.setARColor(128,0,0,32);
		this.game.setARBolderColor(90,0,0,200);
		if(this.game.showAlarmRange)this.game.showAlarmRange(time);
	};

	__Page.vwBattleStage.addLvTool=function(mechObj,body,leg,x,y)
	{
		var idx;
		idx=this.game.hudTools.getHudToolDef("mac_LvBar");
		DBOut("+++++idx="+idx);
		if(idx!=-1)
		{
			var gameObj=this.game.lgcObj2GameObj(mechObj);
			mechObj.lvTool=this.game.hudTools.addToolOn(idx,gameObj);
			mechObj.lvTool.fadeIn(0.2);
			var tool=mechObj.lvTool.getSubItem(0).getHudItem();
			tool.getItemById("body")._setText(body+"");
			tool.getItemById("leg")._setText(leg+"");
			tool.setPos([x,y,0]);
		}
	};
	__Page.vwBattleStage.getGameObjByGroupUId=function(g,uid)
	{
		var lgcObj=this.level.getObject(g,uid);
		return this.game.lgcObj2GameObj(lgcObj);
	};
	__Page.vwBattleStage.getLogicObjByGroupUId=function(g,uid)
	{
		return this.level.getObject(g,uid);
	};
	__Page.vwBattleStage.removeLvTool=function(mechObj)
	{
		if(mechObj && mechObj.lvTool)
		{
			this.game.hudTools.freeTool(mechObj.lvTool);
			mechObj.lvTool=null;
		}
	};
	__Page.vwBattleStage.setMechColorFlash=function(uid,f,cr,cg,cb,ca)
	{
		if(!uid)return;
		var lgcObj,gameObj;
		lgcObj=this.level.getObject(12,uid);
		if(lgcObj)
		{
			gameObj=this.game.lgcObj2GameObj(lgcObj);
			if(f)
				gameObj.setColorFlash(f,180,255,180,128);
			else
				gameObj.setColorFlash(f,255,255,255,255);
		}
	};
	__Page.vwBattleStage.getMechScore=function()
	{
		var i,unit,gameObj,idx,def,hp;
		unit=this.level.getObjectsByGroup(12);
		this.macScore=0;
		if(this.curDeadFoe>=this.allFoeNum)
		for(i=0;i<unit.length;i++)
		{
			//gameObj=this.game.lgcObj2GameObj(unit[i]);
			idx=unit[i].getDefIdx();
			def=this.objDefs[idx];
			hp=def.hp.full;
			this.macScore+=Math.floor((unit[i].getCurHP()/hp)*this.mechScoreC);
		}
	};
	//this.timeScore 剩余时间得分
	//this.macScore  机甲剩余血量得分
}
}