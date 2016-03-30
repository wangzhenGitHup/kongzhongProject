if(!__Page.vwReplayStage)
{
//********************************************************************
//玩家自己基地的舞台对象
__Page.vwReplayStage={
	page:__Page,
	appEnv:null,//JS的App环境对象
	layer:null,
	gameHud:null,//CoC游戏3DHud控件
	navBox:null,//用于拖动地图的控件
	gameDefVO:null,
	game:null,//CoC游戏GameMode对象
	level:null,//CoC游戏逻辑Level对象
	curUnitIdx:-1,
	allRes:[0,0,0,0],
	feildW:44,
	feildH:44,
	deads:[],//死去对象数组（发消息会清除）
	deadNum:0,//死去兵个数
	unitNum:0,//总共带兵数量
	deadRate:0,//完成百分比
	scoreBldNum:0,//参与记分的建筑
	curDeadBld:0,//当前死去对象个数
	state:0,//0游戏未开始,1战斗中,2战斗结束
	resIdx:{"Gold":0,"Elixir":1,"Oil":1,"Cube":1},
	star:0,//0,1,2,3星级

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
__Page.vwReplayStage.initStage=function()
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
	__Page.vwReplayStage.onLevelTouch=function(msg,x,y,way)
	{
		return this.battleStage.onTouch(msg,x,y,way);
	};

	//---------------------------------------------------------------------------
	//舞台的触屏消息处理函数
	__Page.vwReplayStage.onTouch=function(msg,x,y,way)
	{
		if(!this.isGameLoaded)return 0;
		var page=this.page;
		var level=this.level;
		var game=this.game;
		var bld,bldGame,toolItem,w,aisBld;
		var dx,dy,pos,group;

		if(msg==0 && way==1)//按下,:
		{
			//TODO: 出兵, 记录出兵位置
		}
		else if(msg==1 && way==0)//移动,
		{
			//TODO: 调整出兵位置
		}
		else if(msg==2 && way==1)//鼠标抬起
		{

		}
		return 0;
	};
}

//***************************************************************************
//初始化舞台, 界面
//***************************************************************************
{
	//初始化CoC游戏的Hud
	__Page.vwReplayStage.initGameHud=function()
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
	__Page.vwReplayStage.setNavBoxRangeByScale=function(scale)
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
	__Page.vwReplayStage.onGameLoaded=function()
	{
		var self,game,w,h,css,page;
		self=this.battleStage;
		game=self.game;
		page=self.page;

		//在这里初始化底部文本
		w=Math.floor(page.stateReplay.hudBCBox.getW()/2);
		h=page.stateReplay.hudBCBox.getH()-page.imgLib.btn_btminfo.h-12;
		css={
			type:"text",css:page.cssLib.textFineMid.createCSS([w,h,0],"Bottom Text (Level XX)",100,20,1,1,1,1,[255,241,211]),
			display:0,fade:1,fade_size:1,fade_alpha:0
		};
		self.hudBtmText=page.stateReplay.hudBCBox.appendNewChild(css);


		self.level=self.game.level=self.game.getLevel();
		//DBOut("Level: "+self.level);
		self.level.page=self.page;
		self.level.owner=self;
		self.level.onUnitDead=self.onUnitDead;
		self.level.OnStartAttack=self.OnStartAttack;
		self.level.onReplayDone=self.onReplayDone;
		self.game.tileMap=self.level.getTileMap();
		self.navBox.setNavItem(self.gameHud);

		self.toolIdx.clanFlag=game.hudTools.getHudToolDef("clan_flag");

		page.stateReplay.onGameLoaded();
		//初始化已有的建筑
		self.initCityBlds();

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
	__Page.vwReplayStage.startGame=function()
	{
		this.game.setGameState(JGXCoCGameMode.STATE_RUNNING);
		if(this.battleInfo)
			this.level.loadReplay(this.battleInfo.log);
	};

	__Page.vwReplayStage.onGameTexLoaded=function()
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
		if(self.page.audioObject && self.page.audioObject._init)
		{
			self.page.audioObject.playMp3("battle_1",-1);
		}
	};

	//---------------------------------------------------------------------------
	//根据当前的AISGame/King/City创建已有的建筑
	__Page.vwReplayStage.initCityBlds=function()
	{
		var i,j,k,n,idx,vo,levels,list,svrCity,cocBld,res,rate,clan,group,gameBld,def;
		levels=this.level;

		if(!this.battleInfo)return;
		svrCity=this.battleInfo.oppCity;
		list=svrCity.instances;
		n=list.length;
		this.scoreBldNum=svrCity.scoreBuildingNum;
		rate=100/this.scoreBldNum;
		for(i=0;i<n;i++)
		{
			vo=list[i];
			idx=levels.getObjDefIdx(vo.c+vo.l);
			def=this.objDefs[idx];
			if(def && def.HaveAltMode)
			{
				if(vo.attackType)
				{
					vo.c="Alt"+vo.c;
					idx=levels.getObjDefIdx(vo.c+vo.l);
					def=this.objDefs[idx];
				}
			}
			cocBld=levels.addObjectJS(levels.getObjDefIdx(vo.c+vo.l),vo.id,2,[vo.pos.x,vo.pos.y,0],45);
			gameBld=this.game.lgcObj2GameObj(cocBld);
			if(vo.sbf==0)
				cocBld.rate=rate;
			if(vo.c=="TownHall")cocBld.bMainBase=1;
			if(vo.s==1)
			{
				cocBld.setCombatEnabled(0);
				gameBld.setAniAction(0,ActDef.bld.ACT_CONSTRUCTING);

				idx=this.game.effects.getEffectDef(def.effect.startBuild);
				gameBld.playPosEffect(idx,[0,0,0],[0,0,0]);
			}
			if(vo.sg && vo.sg.length)
			{
				for(j=0;j<vo.sg.length;j++)
				{
					res=vo.sg[j];
					idx=this.resIdx[res.t];
					cocBld.setStorage(idx,res.m);
					cocBld.setMaxStorage(idx,res.c);
					this.allRes[idx]+=res.m;
				}
			}
			if(vo.u && vo.u.length)
			{
				var s,cname;
				clan=[];
				for(j=0;j<vo.u.length;j++)
				{
					if(vo.u[j].codename=="UntDoctor")
						cname="Add"+vo.u[j].codename;
					else
						cname=vo.u[j].codename;
					idx=levels.getObjDefIdx(cname+vo.u[j].level);
					if(idx==-1)continue;
					for(k=0;k<vo.u[j].num;k++)
					{
						group=(vo.u[j].codename=="UntHealer")?11:3;
						clan.push({def:idx,group:group,id:-1,jump:1});
					}
				}
				cocBld.setBunkerUnits(clan);
			}
			if(vo.c=="RGunTower" || vo.c=="AltRGunTower")
			{
				if(vo.ammo)
					gameBld.setAniAction(0,ActDef.bld.ACT_STORE2);
				else
					gameBld.setAniAction(0,ActDef.bld.ACT_STORE1);
			}
			if(vo.c=="RGunTower" || vo.c=="AltRGunTower" || vo.c=="InfernoTower" || vo.c=="AltInfernoTower" || vo.c=="InfernoMechTower")
			{
				cocBld.setAmmoCount(vo.ammo);
			}
			if(vo.c=="ClanBld" && svrCity.clanFlag)
			{
				var Tool=this.game.hudTools.addToolOn(this.toolIdx.clanFlag,gameBld);
				Tool.fadeIn(0.2);
				var hudItem=Tool.getSubItem(0).getHudItem();
				hudItem.setFalg(svrCity.clanFlag);
			}
			if(vo.c=="Hangar")
			{
				/*
				var mech,craft,x,y;
				for(j=0;j<this.battleInfo.foeMechs.length;j++)
				{
					mech=this.battleInfo.foeMechs[j];
					if(mech.instanceId==vo.id)
					{
						idx=levels.getObjDefIdx(mech.codename);
						x=vo.pos.x+(def.tile_w/2)+0.1;
						y=vo.pos.y+(def.tile_h/2)+0.1;

						craft=new this.page.actorCraft(this.appEnv,this,x,y);
						craft.addToStage(idx,x,y,0,13);
						craft.stopMove();
						//craft.moveToNextBld();
						break;
					}
				}
				*/
			}
		}
	};

	__Page.vwReplayStage.onUnitDead=function(list)
	{
		DBOut("--------------onUnitDead");
		var i,unit,rate,self,x,y,idx;
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

				if(self.curDeadBld==self.scoreBldNum)
				{
					self.state=2;
					self.giveStar();
					self.deadRate=100;
				}
				self.page.stateReplay.refreshDmgRate();
			}else if(unit.getGroup()==1 || unit.getGroup()==10){//自己的兵
				self.onSelfUnitDead(unit);
			}else if(unit.getGroup()==12){//自己的机甲
				self.onSelfUnitDead(unit,1);
				self.onMechDead(unit);
			}else if(unit.getGroup()==13){//敌人的机甲
				self.onMechDead(unit);
			}
		}
		if(self.page.stateReplay.onUnitDead)
			self.page.stateReplay.onUnitDead();
	};

	__Page.vwReplayStage.onMechDead=function(unit)
	{
		var idx,x,y,def;

		//this.removeLvTool(unit);

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

	__Page.vwReplayStage.onSelfUnitDead=function(unit,bMech)
	{
		var x,y;
		this.deadNum++;
		if(!bMech)
		{
			x=unit.getMidX();
			y=unit.getMidY();
			this.creatGrave(x,y);
		}
	};

	__Page.vwReplayStage.OnStartAttack=function(obj)
	{
		DBOut("++++OnStartAttack+++++");
		obj.setSight(40);
	};

	__Page.vwReplayStage.creatGrave=function(x,y)
	{
		var i,idx,cocBld;
		idx=this.level.getObjDefIdx("Grave1");
		for(i=0;i<this.deads.length;i++)
		{
			if(this.deads[i][0]==x && this.deads[i][1]==y)
			return;
		}
		if(!this.game.tileMap.isPosGoodForBuildingDef([x,y,0],1,1))
		{
			return;
		}
		this.deads.push([x,y]);
		//this.level.addCommand(1,-1,x,y,idx,0);
	};
	//---------------------------------------------------------------------------
	//创建游戏初始化VO对象
	__Page.vwReplayStage.genGameDefVO=function()
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
	__Page.vwReplayStage.genLevelDefVO=function()
	{
		var levelVO,list,i,n,scope={},sp,j;
		var page=this.page;
		levelVO={
			map_w:this.feildW,map_h:this.feildH,map_bolder:2,
			max_search_pre_tick:-1,//每帧最大寻径的次数
			ground_search_count:3,//地面部队N选1
			air_search_count:3,//空中部队N选1
			ground_near_threshold:1.5,//地面和最近目标相比最大距离差
			air_near_threshold:2,//空中和最近目标相比最大距离差
			ground_disperse_angle_max:50,//地面远程攻击者最大分散的最大角度，64为90度，128为180度，0为不分散
			air_disperse_angle_max:50,//空中攻击者最大分散的最大角度，64为90度，128为180度，0为不分散
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

		if(this.page.stateReplay.gameVO && this.page.stateReplay.gameVO.cityInfo)
		{
			var def,deflevel,clanDef,clanDef,j,lv;
			var defLib=window.aisEnv.defLib.clanTec;
			var city=fromJSON(this.page.stateReplay.gameVO.cityInfo);
			clanDef=window.aisEnv.defLib.clan.levels[city.clanLevel-1];
			list=city.clanTechs;
			if(list && clanDef)
			{
				n=list.length;
				for(i=0;i<n;i++)
				{
					def=defLib[list[i].codename];
					if(!def)continue;
					lv=1;
					for(j=0;j<clanDef.tec.length;j++)
					{
						if(clanDef.tec[j].codeName==list[i].codename)
						{
							lv=clanDef.tec[j].level;
							break;
						}
					}
					if(!def.levels[lv-1])continue;
					deflevel=def.levels[lv-1];
					if(deflevel.scopeVar!="Hitpoints" && deflevel.scopeVar!="Damage")continue;
					if(!scope[deflevel.scope])scope[deflevel.scope]=[];
					scope[deflevel.scope].push({scopeVar:deflevel.scopeVar,scopeType:deflevel.scopeType,scopeValue:deflevel.scopeValue});

				}
			}
		}

		//修正战斗单位的combat属性:
		list=levelVO.obj_defs;
		n=list.length;
		for(i=0;i<n;i++)
		{
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
			if(scope[list[i].group])
			{
				for(j=0;j<scope[list[i].group].length;j++)
				{
					sp=scope[list[i].group][j];
					if(sp.scopeVar=="Hitpoints")
					{
						list[i].hp.full=this.getValue(list[i].hp.full,sp.scopeValue,sp.scopeType);
						list[i].hp.cur=list[i].hp.full;
					}else if(sp.scopeVar=="Damage")
					{
						if(list[i].combat)
						list[i].combat.damage=this.getValue(list[i].combat.damage,sp.scopeValue,sp.scopeType);
					}
				}
			}
		}
		return levelVO;
	};
	__Page.vwReplayStage.getValue=function(ov,sv,type)
	{
		if(type==1)
			return sv;
		else if(type==2)
			return Math.floor(ov*(sv*0.01));
		else
			return ov;
	};

	__Page.vwReplayStage.proxyBattle=function(svrVO)
	{
		if(!svrVO)return;
		var i,j,k,n,idx,vo,levels,list,svrCity,city,objs,cocBld,res,rate,clan;
		levels=this.level;
		this.battleInfo={oppCity:{},log:{cmds:[],hps:[],endTick:0},mechs:[],foeMechs:[]};


		this.battleInfo.log.cmds=fromJSON(svrVO.cmds);
		this.battleInfo.log.endTick=svrVO.endTick;
		var beginTick=0;
		if(this.battleInfo.log.cmds && this.battleInfo.log.cmds.length)
		{
			beginTick=Math.max(this.battleInfo.log.cmds[0][1]-200,0);//往第一条cmd前推五秒
			this.unitNum=this.battleInfo.log.cmds.length;
		}
		this.battleInfo.log.beginTick=beginTick;
		this.battleInfo.oppCity=fromJSON(svrVO.cityInfo);
		//DBOut("-----info="+toJSON(this.battleInfo));

		var mechs=fromJSON(svrVO.mechs);
		list=mechs[0];
		if(list)
		{
			n=list.length;
			if(n)
			{
				var body,leg,plug,parts={};
				for(i=0;i<n;i++)
				{
					vo=list[i];
					if(!(vo.state>1))
					{
						group=12;
						codename="UserMac"+(i+1);
						this.battleInfo.mechs[i]={icon:"",codename:codename,num:1,level:1,group:group,instanceId:vo.instanceId};

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
						this.replaceObjDef(codename,body,leg,plug);
					}
				}
			}
		}

		list=mechs[1];
		if(list)
		{
			n=list.length;
			if(n)
			{
				var body,leg,plug,parts={};
				for(i=0;i<n;i++)
				{
					vo=list[i];
					if(!(vo.state>1))
					{
						group=13;
						codename="FoeMac"+(i+1);
						this.battleInfo.foeMechs[i]={icon:"",codename:codename,num:1,level:1,group:group,instanceId:vo.instanceId};

						idx=levels.getObjDefIdx(vo.up.codename+vo.up.level);
						body=idx!=-1?this.objDefs[idx]:null;
						idx=levels.getObjDefIdx(vo.down.codename+vo.down.level);
						leg=idx!=-1?this.objDefs[idx]:null;
						plug=null;//vo.plug.codename
						this.replaceObjDef(codename,body,leg,plug,1);
					}
				}
			}
		}

		if(this.page.stateReplay.battleTimeHud)
		this.page.stateReplay.battleTimeHud.start(Math.floor((svrVO.endTick-beginTick)/40));

	};

	__Page.vwReplayStage.replaceObjDef=function(def_name,body,leg,plug,bfoe)
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
		if(bfoe)defVO.move.jump=1;
		defIdx=this.level.getObjDefIdx(def_name);
		this.level.replaceObjDef(defIdx,defVO);
		exvo.bodyLv=body.level;
		exvo.legLv=leg.level;
		return exvo;
	};

	__Page.vwReplayStage.proxyOnslaught=function(svrVO)
	{
		if(!svrVO)return;
		var i,j,x,y,k,n,t,idx,cmd,levels,group;
		levels=this.level;
		this.battleInfo={oppCity:{},log:{cmds:[],hps:[],endTick:0}};


		for(i=0;i<svrVO.cmds.length;i++)
		{
			cmd=svrVO.cmds[i];
			idx=this.level.getObjDefIdx(cmd.type+cmd.level);
			if(idx==-1)continue;
			k=(this.feildW>>2)+Math.random()*(this.feildW>>1);
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
			}else continue;

			group=(cmd.type=="UntHealer")?10:1;
			t=cmd.delaytime;
			for(j=0;j<cmd.num;j++)
			{
				this.battleInfo.log.cmds.push([1,t, x, y, idx, group]);
				t+=3;
			}
		}
		this.battleInfo.log.endTick=0;
		var beginTick=0;
		if(this.battleInfo.log.cmds && this.battleInfo.log.cmds.length)
		{
			this.battleInfo.log.cmds.sort(function(a,b){return a[1]-b[1];});
			beginTick=Math.max(this.battleInfo.log.cmds[0][1]-200,0);//往第一条cmd前推五秒
			this.unitNum=this.battleInfo.log.cmds.length;
		}
		this.battleInfo.log.beginTick=beginTick;
		if(svrVO.cityInfo)
		this.battleInfo.oppCity=fromJSON(svrVO.cityInfo);
		//DBOut("-----info="+toJSON(this.battleInfo));

	};

	__Page.vwReplayStage.onReplayDone=function()
	{
		var self=this.owner;
		if(self.done)return;
		self.done=1;
		self.setResultStage(1);
		self.setResultStage(10);
		self.setResultStage(12);
		self.page.stateReplay.onReplayDone();
	};
	__Page.vwReplayStage.setResultStage=function(group)
	{
		DBOut("++++++setResultStage");
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
	__Page.vwReplayStage.reSet=function()
	{
		this.level.reset();
		this.curUnitIdx=-1;
		this.curUnitGroup=-1;
		this.allObjs=[];
		this.allRes=[0,0,0,0];

		this.curUnitNum=0;
		this.unitIdx=[];
		this.deads=[];
		this.deadRate=0;
		this.scoreBldNum=0;
		this.curDeadBld=0;
		this.state=0;
		this.star=0;
		this.unitNum=0;
		this.done=0;
		this.deadNum=0;
	};

	__Page.vwReplayStage.setAlarmRange=function(c,bc,time)
	{
		this.game.setARColor(128,0,0,32);
		this.game.setARBolderColor(90,0,0,200);
		if(this.game.showAlarmRange)this.game.showAlarmRange(time);
	};

	__Page.vwReplayStage.giveStar=function()
	{
		this.star++;
		if(this.star>3)this.star=3;
		this.page.stateReplay.giveStar();
	};
		__Page.vwReplayStage.setResultStage=function(group)
	{
		var i,win,gameObj,unit=this.level.getObjectsByGroup(group);
		if(!unit.length)return;
		for(i=0;i<unit.length;i++)
		{
			unit[i].setCrashed(1);
		}
	};
}
}