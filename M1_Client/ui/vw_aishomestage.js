if(!__Page.vwHomeStage)
{
//********************************************************************
//玩家自己基地的舞台对象
__Page.vwHomeStage={
	page:__Page,
	appEnv:null,//JS的App环境对象
	layer:null,
	gameHud:null,//CoC游戏3DHud控件
	navBox:null,//用于拖动地图的控件
	gameDefVO:null,
	game:null,//CoC游戏GameMode对象
	level:null,//CoC游戏逻辑Level对象
	selBld:null,//当前选中的建筑的逻辑对象
	badPosBld:null,//当前位置错误的建筑的逻辑对象
	newPosBld:null,//当前正在获取创建位置的建筑的逻辑对象
	isDraging:0,//当前是否在拖拽某个建筑
	dragStartPenX:0,//拖拽开始的时候的鼠标位置X
	dragStartPenY:0,//拖拽开始的时候的鼠标位置Y
	dragStartBldX:0,//拖拽开始的时候的建筑物位置X
	dragStartBldY:0,//拖拽开始的时候的建筑物位置Y
	dragCurBldX:0,//拖拽过程中建筑物当前的位置X
	dragCurBldY:0,//拖拽过程中建筑物当前的位置Y

	feildW:44,
	feildH:44,

	multiSelBld:[],
	multiSelX1:0,
	multiSelX2:0,
	multiSelY1:0,
	multiSelY2:0,
	multiSelBadPos:0,
	batchPos:null,

	curBldUid:10,

	keyBlds:[],
	walls:[],//城墙列表
	wallList:[],//城墙二维有序列表
	wallEftMoveTime:30,
	bldTownHall:null,//主基地的建筑HomeBld

	btmBtns:[],//底部的按钮列表

	allFarmers:[],

	actorIdx:{
		farmer:-1,
		worker:-1,
	},
	toolIdx:{
		selBld:-1,			//选中建筑物的HudTool的定义ID
		newBld:-1,			//新建建筑物的HudTool的定义ID
		harvestGold:-1,		//金矿可以收取的HudTool的定义ID
		harvestGoldFull:-1,	//金矿满仓的HudTool的定义ID
		harvestOil:-1,		//油井可以收取的HudTool的定义ID
		harvestOilFull:-1,	//油井满仓的HudTool的定义ID
		harvestCube:-1,		//能量矿可以收取的HudTool的定义ID
		harvestCubeFull:-1,	//能量矿满仓的HudTool的定义ID
		harvestGem:-1,		//钻石矿可以收取的HudTool的定义ID
		harvestGemFull:-1,	//钻石矿满仓的HudTool的定义ID
		busyBar:-1,			//建筑物正在建造/升级的HudTool的定义ID
		mfcBar:-1,			//建筑物正在生产/研制的HudTool的定义ID
		mfcFull:-1,			//建筑物生产停滞
		rangeMax:-1,		//炮塔最大射程
		rangeMin:-1,		//炮塔最小射程
		resNum:-1,			//收矿的数值
		resVipNum:-1,   //收矿vip数值
		barrackFree:-1,			//兵营空闲
		spellFree:-1,			//大锅空闲
		techFree:-1,			//实验室空闲
		clanFree:-1,			//联盟城堡空闲
		prdFull:-1,
		haveGifts:-1,
		haveNotices:-1,
		clanFlag:-1,
		fakeFlag:-1,//伪装库的标志
		chargeFalg:-1,//充能标志
		residenceFalg:-1,
		emptyFlag:-1,//充能建筑物空状态
	},
	layerIdx:{
		selBldDock:-1,
		selBldBody:-1,
	},
	eftIdx:{
		bldMove:-1,
		bldBadPos:-1,
		bldStartBld:-1,
		bldTrainDone:-1,
	}
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
__Page.vwHomeStage.initStage=function()
{
	this.appEnv=this.page.appEnv;
	this.game=null;
	this.layer=null;
	this.level=null;
	this.hudTools=null;
	this.tileMap=null;
	this.gameHud=null;
	this.navBox=null;
	this.selBld=null;
	this.badPosBld=null;
	this.isDraging=0;
	this.dragStartPenX=0;
	this.dragStartPenY=0;
	this.dragStartBldX=0;
	this.dragStartBldY=0;
	this.dragCurBldX=0;
	this.dragCurBldY=0;

	this.curBldUid=10;

	this.initGameHud();
};

//***************************************************************************
//用户触屏消息, 建筑选择/取消选择函数
//***************************************************************************
{
	//---------------------------------------------------------------------------
	//舞台的触屏消息处理函数,this为舞台Hud控件
	__Page.vwHomeStage.onLevelTouch=function(msg,x,y,way)
	{
		return this.homeStage.onTouch(msg,x,y,way);
	};

	//---------------------------------------------------------------------------
	//舞台的触屏消息处理函数
	__Page.vwHomeStage.onTouch=function(msg,x,y,way)
	{
		if(!this.isGameLoaded)return 0;
		var page=this.page;
		var level=this.level;
		var game=this.game;
		var cocBld,bldGame,homeBld,toolItem,w,aisBld,list,i,n;
		var dx,dy,pos,posBad;

		if(msg==0 && way==1)
		{
			DBOut("Touch at: "+x+", "+y);
			if(this.selBld)//如果当前有选中的建筑（也可能是位置错误的建筑）
			{
				homeBld=this.selBld;
				cocBld=homeBld.cocBld;
				pos=[0,0,0];
				cocBld.getPos(pos);
				dx=x-pos[0];
				dy=y-pos[1];
				list=this.multiSelBld;
				n=list.length;
				if(n && dx>=this.multiSelX1*homeBld.tileW &&dx<(this.multiSelX2+1)*homeBld.tileW &&
					dy>=this.multiSelY1*homeBld.tileW &&dy<(this.multiSelY2+1)*homeBld.tileW)
				{
					DBOut("Multi-Sel Start Draging!!");
					this.isDraging=1;
					this.dragStartPenX=x;
					this.dragStartPenY=y;
					this.dragCurBldX=this.dragStartBldX=Math.floor(pos[0]);
					this.dragCurBldY=this.dragStartBldY=Math.floor(pos[1]);
					this.navBox.setNavItem(null);
					this.selBld.dragMoved=0;
					if(!this.badPosBld)
					{
						game.tileMap.startDrag(cocBld);
						for(i=0;i<n;i++)
						{
							game.tileMap.startDrag(list[i].cocBld);
						}
					}
					//this.multiSelBadPos=0;
					return 1;
				}
				else if(homeBld.canMove && dx>=0 && dx<homeBld.tileW && dy>=0 && dy<homeBld.tileH)//点击在建筑身上，如果当前建筑可以移动，开始拖拽
				{
					if(window.aisGame && window.aisGame.bVisit)return 1;
					this.isDraging=1;
					this.dragStartPenX=x;
					this.dragStartPenY=y;
					this.dragCurBldX=this.dragStartBldX=Math.floor(pos[0]);
					this.dragCurBldY=this.dragStartBldY=Math.floor(pos[1]);
					this.navBox.setNavItem(null);
					this.selBld.dragMoved=0;
					if(!this.badPosBld)
					{
						game.tileMap.startDrag(cocBld);
					}
					return 1;
				}
			}
		}
		else if(msg==1 && way==0)
		{
			if(this.isDraging)//如果正在拖拽，是否要更新当前拖拽建筑的位置？
			{
				dx=x-this.dragStartPenX;
				dy=y-this.dragStartPenY;
				dx=Math.floor(this.dragStartBldX+dx);
				dy=Math.floor(this.dragStartBldY+dy);
				if(dx!=this.dragCurBldX || dy!=this.dragCurBldY)//位置需要更新
				{
					this.dragCurBldX=dx;
					this.dragCurBldY=dy;
					dx=dx<0?0:dx;
					dy=dy<0?0:dy;
					dx=dx>=(this.feildW-this.selBld.tileW)?(this.feildW-this.selBld.tileW):dx;
					dy=dy>=(this.feildH-this.selBld.tileH)?(this.feildH-this.selBld.tileH):dy;
					this.selBld.cocBld.setPos([dx,dy,0]);
					if(this.selBld.isTurret)
					{
						this.selBld.updateTurretDit(dx,dy);
					}
					else if(this.selBld==this.bldTownHall)
					{
						this.updateAllTurret();
					}
					this.selBld.dragMoved=1;
					//新位置是否合法？
					list=this.multiSelBld;
					n=list.length;
					if(n)
					{
						posBad=0;
						posBad|=!game.tileMap.isPosGoodForBuilding(this.selBld.cocBld);
						for(i=0;i<n;i++)
						{
							homeBld=list[i];
							homeBld.cocBld.setPos([dx+homeBld.multiDx,dy+homeBld.multiDy,0]);
							posBad|=!game.tileMap.isPosGoodForBuilding(homeBld.cocBld);
						}
						if(posBad)
						{
							this.multiSelBadPos=1;
							this.selBld.updateHudPad(1,1);
							for(i=0;i<n;i++)
							{
								list[i].updateHudPad(1,1);
							}
						}
						else
						{
							this.multiSelBadPos=0;
							this.selBld.updateHudPad(1,0);
							for(i=0;i<n;i++)
							{
								list[i].updateHudPad(1,0);
							}
						}
					}
					else
					{
						this.selBld.updateHudPad();
					}
					this.selBld.gameBld.playEffect(this.eftIdx.bldMove);
					this.appEnv.hudOut(page.stateHome.hudBaseBox,3);
				}
			}
		}
		else if(this.isDraging && msg==2 && way==1)//如果正在拖拽，且玩家释放鼠标
		{
			if(this.navBox.isInPinching)
			{
				if(!this.navBox.isInPinching())
					this.onDraging();
			}else
				this.onDraging();
		}
		else if(msg==2 && way==1)//没有拖拽的时候，鼠标抬起
		{
			if(this.navBox.isInPinching)
			{
				if(!this.navBox.isInPinching())
					this.onNoDraging(x,y,dx,dy);
			}else
				this.onNoDraging(x,y,dx,dy);
		}
		return 0;
	};
	__Page.vwHomeStage.onDraging=function()
	{
		var i,n,list,homeBld,aisBld,bldGame,pos=[0,0,0];
		var page=this.page;
		var game=this.game;
		if(!this.newPosBld)
		{
			//新位置是否合法？
			list=this.multiSelBld;
			n=list.length;
			if(n)
			{
				if(!this.multiSelBadPos)//多重选择位置合法
				{
					pos=[0,0,0];
					game.tileMap.endDrag(this.selBld.cocBld);//通知底层建筑停止拖拽
					this.selBld.cocBld.getPos(pos);
					this.selBld.oldGoodX=pos[0];
					this.selBld.oldGoodY=pos[1];
					for(i=0;i<n;i++)
					{
						homeBld=list[i];
						game.tileMap.endDrag(homeBld.cocBld);
						homeBld.cocBld.getPos(pos);
						homeBld.oldGoodX=pos[0];
						homeBld.oldGoodY=pos[1];
					}
					game.refreshAllWalls();
					//使用消息模式更新建筑物位置:
					aisBld=this.selBld.aisBld;
					if(aisBld)
					{
						this.selBld.cocBld.getPos(pos);
						if(aisBld.pos[0]!=pos[0] || aisBld.pos[1]!=pos[1])
						{
							window.aisGame.king.execCmd(aisBld,"MovePos",{x:pos[0],y:pos[1],z:0},aisBld);
							for(i=0;i<n;i++)
							{
								list[i].cocBld.getPos(pos);
								window.aisGame.king.execCmd(list[i].aisBld,"MovePos",{x:pos[0],y:pos[1],z:0},list[i].aisBld);
							}
						}
					}
					this.selBld.playDefEft("place");
					this.appEnv.hudIn(page.stateHome.hudBaseBox,3);
				}
				else//多重选择位置非法
				{
					this.badPosBld=this.selBld;
					this.selBld.gameBld.playEffect(this.eftIdx.bldBadPos);
				}
			}
			else
			{
				//是否是合法的建筑物位置？
				if(game.tileMap.isPosGoodForBuilding(this.selBld.cocBld))//合法
				{
					game.tileMap.endDrag(this.selBld.cocBld);//通知底层建筑停止拖拽
					if(this.selBld.isWall)//如果是墙的话，需要更新墙的连接性
					{
						bldGame=this.selBld.gameBld;
						bldGame.refreshWallConnection();
					}
					//更新当前建筑的“最近合法停留位置”
					pos=[0,0,0];
					this.selBld.cocBld.getPos(pos);
					this.selBld.oldGoodX=pos[0];
					this.selBld.oldGoodY=pos[1];
					this.selBld.playDefEft("place");

					//使用消息模式更新建筑物位置:
					aisBld=this.selBld.aisBld;
					if(aisBld)
					{
						DBOut("Move Bld to: "+pos[0]+", "+pos[1]);
						if(aisBld.pos[0]!=pos[0] || aisBld.pos[1]!=pos[1])
							window.aisGame.king.execCmd(aisBld,"MovePos",{x:pos[0],y:pos[1],z:0},aisBld);
					}

					if(pos[0]==this.dragStartBldX && pos[1]==this.dragStartBldY)//如果建筑位置未改变，释放当前的建筑选择
					{
						this.clearSelBld();
					}
					else//建筑物位置有改变, 需要通知绑定在这个建筑物上的跟随单位移动
					{
						this.selBld.updateActors();
					}
					this.appEnv.hudIn(page.stateHome.hudBaseBox,3);
				}
				else//非法位置，设置非法位置为当前建筑
				{
					this.badPosBld=this.selBld;
					this.selBld.gameBld.playEffect(this.eftIdx.bldBadPos);
				}
			}
		}
		else//新建筑
		{
			if(game.tileMap.isPosGoodForBuilding(this.selBld.cocBld))//合法
				this.appEnv.hudIn(page.stateHome.hudBaseBox,3);
		}
		this.isDraging=0;
		if(page.stateHome.name!="GuideState")
		this.navBox.setNavItem(this.gameHud);
	};

	__Page.vwHomeStage.onNoDraging=function(x,y,dx,dy)
	{
		var i,n,list,cocBld,pos=[0,0,0];
		var level=this.level;
		var page=this.page;
		var game=this.game;
		if(x>=0 && x<this.feildW && y>=0 && y<this.feildH && !this.newPosBld)
		{
			if(this.badPosBld)//检查选择还是复位旧的错位建筑
			{
				pos=[0,0,0];
				this.badPosBld.cocBld.getPos(pos);
				dx=x-pos[0];
				dy=y-pos[1];
				if(dx>=0 && dx<this.badPosBld.tileW && dy>=0 && dy<this.badPosBld.tileH)
				{
					//应该执行不到这里
				}
				else
				{
					list=this.multiSelBld;
					n=list.length;
					if(n)
					{
						pos=[this.badPosBld.oldGoodX,this.badPosBld.oldGoodY,0];
						this.badPosBld.cocBld.setPos(pos);
						game.tileMap.endDrag(this.badPosBld.cocBld);
						for(i=0;i<n;i++)
						{
							list[i].cocBld.setPos(pos);
							game.tileMap.endDrag(list[i].cocBld);
						}
						game.refreshAllWalls();
					}
					else
					{
						pos=[this.badPosBld.oldGoodX,this.badPosBld.oldGoodY,0];
						this.badPosBld.cocBld.setPos(pos);
						if(this.badPosBld.isTurret)
						{
							this.badPosBld.updateTurretDit(dx,dy);
						}
						else if(this.badPosBld==this.bldTownHall)
						{
							this.updateAllTurret();
						}
						game.tileMap.endDrag(this.badPosBld.cocBld);
						if(this.badPosBld.cocBld.isWall())
						{
							this.badPosBld.gameBld.refreshWallConnection();
						}
					}
					this.clearSelBld();
				}
			}
			//是否选择一个（新的）建筑
			{
				cocBld=level.getDockBuildingAt(x,y);
				if(cocBld)//当前鼠标抬起位置有一个建筑
				{
					if(cocBld.homeBld==this.selBld)//当前鼠标位置的建筑就是当前选中的建筑，取消当前选中建筑
					{
						this.clearSelBld();
					}
					else//选中了一个新建筑
					{
						this.selectBld(cocBld.homeBld);
					}
					return 1;
				}
				else//点击位置没有建筑,如果当前有选中建筑,取消选择
				{
					if(this.selBld)
					{
						this.clearSelBld();
					}
				}
			}
		}
	};
	//---------------------------------------------------------------------------
	//收取资源
	__Page.vwHomeStage.bldHarvest=function()
	{
		if(!this.selBld)return;
		var bld=this.selBld;
		bld.getRes();
	};

	//---------------------------------------------------------------------------
	//选中一个建筑
	__Page.vwHomeStage.selectBld=function(newBld)
	{
		var game=this.game;
		var canMov,pos,toolItem;
		var bldGame,aisBld;
		var king,vo;
		var appEnv,page;
		var list,i,n,css,cssLib,box,btn,w,h,imgLib,cmlist;
		var oldBld,homeBld;

		//this.appEnv.stateLogs.showLog("Select Bld: "+newBld);

		page=this.page;
		appEnv=this.appEnv;
		cssLib=page.cssLib;
		imgLib=page.imgLib;

		//DBOut("Will select bld: "+page.stateHome.curGuide);
		if(page.stateHome.curGuide && page.stateHome.curGuide.lockSelBld)
		{
			return;
		}
		if(newBld && newBld.aisBld.bCrashed==1 && newBld.aisBld.def.groupId!="Traps" && !(window.aisGame && window.aisGame.bVisit))
			return;

		if(newBld==this.selBld)
			return;

		king=aisGame.king;

		if(!(window.aisGame && window.aisGame.bVisit) && newBld && newBld.aisDef && newBld.aisDef.codeName=="Grave")
		{
			DBOut("****************** remove grave");
			this.selBld=newBld;
			this.removeGraveBld();
			king.miniUpdate();
			return;
		}

		if(this.selBld)//当前有被选中的建筑:
		{
			this.clearSelBld();
		}

		oldBld=this.selBld;
		this.selBld=null;


		//根据AIS对象决定行为
		aisBld=newBld.aisBld;

		//确定移动方式
		canMov=aisBld.def.posFixed?2:1;
		canMov=aisGame.guideMode?2:canMov;
		king.miniUpdate();//这里有可能会导致newBld失效....
		if(newBld.showState==5 || newBld.showState==6)//如果是需要收获的建筑, 收取资源
		{
			if(window.aisGame && window.aisGame.bVisit)
			{
			}else{
				newBld.getRes();
				this.clearSelBld();
				return;
			}
		}

		this.selBld=newBld;
		homeBld=newBld;

		if(window.aisGame && window.aisGame.bVisit)
				if(homeBld.cocDef.trigger && homeBld.cocDef.trigger.sight)return;

		homeBld.selectBld(canMov);

		//添加底部按钮:
		if(oldBld!=this.selBld)
		{
			this.addBtmBtns();
		}
	};

	//---------------------------------------------------------------------------
	//添加底部按钮
	__Page.vwHomeStage.addBtmBtns=function()
	{
		if(!this.selBld)
		{
			DBOut("addBtmBtns error: No selBld!");
			return;
		}
		var game=this.game;
		var canMov,pos,toolItem;
		var bldGame,aisBld;
		var king,vo;
		var appEnv,page;
		var list,i,n,css,cssLib,box,btn,w,h,imgLib,cmlist;

		page=this.page;
		appEnv=this.appEnv;
		cssLib=page.cssLib;
		imgLib=page.imgLib;

		//清除旧的按钮:
		this.clearBtmBtns();

		aisBld=this.selBld.aisBld;

		//添加的按钮:
		if(aisBld && aisBld.def.codeName!="Grave")
		{
			box=page.stateHome.hudBCBox;
			list=aisBld.def.levels[aisBld.level].cocBtns;
			//对于不需要等级的建筑(如花坛,如障碍物)专门处理
			if(window.aisGame.bVisit && (aisBld.def.codeName=="FakeGoldVault" || aisBld.def.codeName=="FakeOilTank"))
			{
				var def=window.aisEnv.defLib.bld[aisBld.def.pretend];
				this.hudBtmText._setText(def.levels[aisBld.level].name);
			}else
				this.hudBtmText._setText(aisBld.def.levels[aisBld.level].name);
			appEnv.hudIn(this.hudBtmText,5);
			//DBOut("CoCBtns: "+list);
			cmlist=["btnBtmInfo","btnBtmUpgrade","btnBtmGemDone","btnBtmAbortBuild"];
			list=list?cmlist.concat(list):cmlist;
			if(window.aisGame && window.aisGame.bVisit)list=["btnBtmInfo"];
			n=list.length;
			for(i=0;i<n;i++)
			{
				css=cssLib[list[i]];
				if(css && css.createCSS)
				{
					if((!css.isOK2Show) ||(css.isOK2Show(aisBld)))
					{
						css=css.createCSS(aisBld);
						btn=box.appendNewChild(css);
						if(btn.postCreate)
							btn.postCreate();
						this.btmBtns.push(btn);
						if(btn.aisUpdateView)
						{
							aisBld.addUIView(btn);
						}
					}
				}
			}
			list=this.btmBtns;
			n=list.length;
			h=Math.floor(box.getH()-(imgLib.btn_btminfo.h/2));
			w=Math.floor(-box.getW()/2+(n*104+(n-1)*6)/2-imgLib.btn_btminfo.w/2);
			for(i=0;i<n;i++)
			{
				btn=list[i];
				btn.setShowPos([-w+i*110,h,0]);
				btn.setFadePos([-w+i*110,h+200,0]);
				appEnv.hudIn(btn,10);
			}
		}
	};

	//---------------------------------------------------------------------------
	//清除当前的选中建筑,如果当前建筑位置非法，重置为合法位置
	__Page.vwHomeStage.clearSelBld=function(force)
	{
		var pos,uid;
		var game=this.game;
		var page=this.page;
		var appEnv=this.appEnv;
		var i,n,list;

		if(!force && (page.stateHome.curGuide && page.stateHome.curGuide.lockSelBld))
		{
			return;
		}

		if(this.selBld)
		{
			if(this.newPosBld)
			{
				//如果有位置未定的新建筑，取消这个建筑的创建
				uid=this.newPosBld.bldUID;
				if(uid>0 && uid<1000)
				{
					//回收uid:
					if(uid==this.curBldUid-1)
					{
						this.curBldUid=uid;
					}
				}
				this.newPosBld.abortNewBld();
				this.newPosBld=null;
			}
			else if(this.badPosBld)
			{
				if(this.badPosBld==this.selBld)//这个是必须的吧?
				{
					list=this.multiSelBld;
					n=list.length;
					if(n)
					{
						//复位建筑位置到“最近合法停留位置”
						pos=[this.badPosBld.oldGoodX,this.badPosBld.oldGoodY,0];
						this.badPosBld.cocBld.setPos(pos);
						game.tileMap.endDrag(this.badPosBld.cocBld);
						for(i=0;i<n;i++)
						{
							pos=[list[i].oldGoodX,list[i].oldGoodY,0];
							list[i].cocBld.setPos(pos);
							game.tileMap.endDrag(list[i].cocBld);
						}
						game.refreshAllWalls();
					}
					else
					{
						if(!game.tileMap.isPosGoodForBuilding(this.badPosBld.cocBld))
						{
							//复位建筑位置到“最近合法停留位置”
							pos=[this.badPosBld.oldGoodX,this.badPosBld.oldGoodY,0];
							this.badPosBld.cocBld.setPos(pos);
							if(this.badPosBld.isTurret)
							{
								this.badPosBld.updateTurretDit(pos[0],pos[1]);
							}
							else if(this.badPosBld==this.bldTownHall)
							{
								this.updateAllTurret();
							}
						}
						game.tileMap.endDrag(this.badPosBld.cocBld);
					}
				}
				this.badPosBld=null;
			}
			this.selBld.deselectBld();
			this.selBld=null;
			this.badPosBld=null;
			this.newPosBld=null;
		}
		list=this.multiSelBld;
		n=list.length;
		for(i=0;i<n;i++)
		{
			list[i].deselectBld();
		}
		list.splice(0,n);

		this.isDraging=0;
		if(this.page.stateHome.name!="GuideState")
		this.navBox.setNavItem(this.gameHud);

		//Clear Bottom Buttons:
		this.clearBtmBtns();

		this.isDraging=0;
		if(this.page.stateHome.name!="GuideState")
		this.navBox.setNavItem(this.gameHud);
	};

	//---------------------------------------------------------------------------
	//清除底部按钮
	__Page.vwHomeStage.clearBtmBtns=function()
	{
		var list,i,n;
		var appEnv=this.appEnv;
		list=this.btmBtns;
		n=list.length;
		for(i=0;i<n;i++)
		{
			appEnv.hudOut(list[i],10);
		}
		list.splice(0,n);
		if(this.hudBtmText && "function"==typeof(this.hudBtmText.setDisplay))
			this.hudBtmText.setDisplay(0);
	}

	//---------------------------------------------------------------------------
	//更新所有炮塔的方向:
	__Page.vwHomeStage.selectRow=function()
	{
		var curBld,x,y,xstart,xend,ystart,yend,i,lowBld,hiBld;
		var level,done;
		var xlist,ylist;
		level=this.level;
		curBld=this.selBld;
		x=curBld.aisBld.pos[0];
		y=curBld.aisBld.pos[1];
		xstart=x;
		xend=x;
		ystart=y;
		yend=y;
		this.multiSelBld.splice(0,this.multiSelBld.length);
		//首先考察X方向
		{
			xlist=[];
			done=0;
			for(i=1;i<40&&!done;i++)
			{
				done=1;
				lowBld=level.getDockBuildingAt(x-i,y);
				if(lowBld && lowBld.isWall())
				{
					xstart=x-i;
					done=0;
					xlist.push(lowBld.homeBld);
				}
			}
			done=0;
			for(i=1;i<40&&!done;i++)
			{
				done=1;
				hiBld=level.getDockBuildingAt(x+i,y);
				if(hiBld && hiBld.isWall())
				{
					xend=x+i;
					done=0;
					xlist.push(hiBld.homeBld);
				}
			}
		}
		/*if(xend-xstart>1)
		{
			//显示底板
			curBld.updateHudPad(1,0);
			this.multiSelX1=xstart-x;
			this.multiSelX2=xend-x;
			this.multiSelY1=0;
			this.multiSelY2=0;
			curBld.updateMultiSelMark(0,this.multiSelX1,this.multiSelY1,this.multiSelX2,this.multiSelY2);
			this.clearBtmBtns();
			return;
		}*/
		//Y方向
		{
			done=0;
			ylist=[];
			for(i=1;i<40&&!done;i++)
			{
				done=1;
				lowBld=level.getDockBuildingAt(x,y-i);
				if(lowBld && lowBld.isWall())
				{
					ystart=y-i;
					done=0;
					ylist.push(lowBld.homeBld);
				}
			}
			done=0;
			for(i=1;i<40&&!done;i++)
			{
				done=1;
				hiBld=level.getDockBuildingAt(x,y+i);
				if(hiBld && hiBld.isWall())
				{
					yend=y+i;
					done=0;
					ylist.push(hiBld.homeBld);
				}
			}
		}
		if((yend-ystart)>(xend-xstart) && (yend-ystart)>0)
		{
			//显示底板
			curBld.updateHudPad(1,0);
			this.multiSelY1=ystart-y;
			this.multiSelY2=yend-y;
			this.multiSelX1=0;
			this.multiSelX2=0;
			curBld.updateMultiSelMark(1,this.multiSelX1,this.multiSelY1,this.multiSelX2,this.multiSelY2);
			this.multiSelBld=ylist;
			n=ylist.length;
			for(i=0;i<n;i++)
			{
				ylist[i].multiSelectBld(ylist[i].aisBld.pos[0]-x,ylist[i].aisBld.pos[1]-y);
			}
		}
		else if(xend-xstart>0)
		{
			curBld.updateHudPad(1,0);
			this.multiSelX1=xstart-x;
			this.multiSelX2=xend-x;
			this.multiSelY1=0;
			this.multiSelY2=0;
			curBld.updateMultiSelMark(0,this.multiSelX1,this.multiSelY1,this.multiSelX2,this.multiSelY2);
			this.multiSelBld=xlist;
			n=xlist.length;
			for(i=0;i<n;i++)
			{
				xlist[i].multiSelectBld(xlist[i].aisBld.pos[0]-x,xlist[i].aisBld.pos[1]-y);
			}
		}
		if(this.multiSelBld && this.multiSelBld.length)
		{
			this.multiSelBadPos=0;
			this.clearBtmBtns();
		}
	};

	//---------------------------------------------------------------------------
	//更新所有炮塔的方向:
	__Page.vwHomeStage.updateAllTurret=function()
	{
		var list,i,n,bld;
		list=this.keyBlds;
		n=list.length;
		for(i=0;i<n;i++)
		{
			bld=list[i];
			if(bld.isTurret)
			{
				bld.updateTurretDit(bld.aisBld.pos[0],bld.aisBld.pos[1]);
			}
		}
	};
}

//***************************************************************************
//新增建筑, 建筑升级等
//***************************************************************************
{
	//---------------------------------------------------------------------------
	//新增一个建筑，让玩家选位置
	__Page.vwHomeStage.askNewBldPos=function(defIdx,uid,group,askPos)
	{
		var bld,w,h,bldGame,x,y,homeBld,page,appEnv;
		var pos;
		var game=this.game;
		var level=this.level;
		var toolItem,objDef,aisDef,tryPos,goodX,goodY,goodDis,dis,ww;
		if(this.page.stateHome.name=="GuideState")
		{
			askPos=null;
			ww=4;
		}else
			ww=3;

		page=this.page;
		appEnv=this.appEnv;
		this.clearSelBld();
		if(uid<=0)
		{
			uid=this.curBldUid++;
		}
		objDef=this.objDefs[defIdx];
		aisDef=window.aisEnv.defLib.bld[objDef.aisCodeName];
		if(!askPos)
		{
			//尽量在屏幕中间位置上“预创建”建筑
			pos=[this.page.getW()/2,this.page.getH()/2,0];
			this.gameHud.scrPos2Game(pos);
			pos[0]=Math.floor(pos[0]);
			pos[1]=Math.floor(pos[1]);

			//如果建筑的尺寸比较小,尽量在屏幕中间找到一个合适的位置
			if(objDef.tile_w<ww)//
			{
				w=objDef.tile_w;
				h=objDef.tile_h;
				goodX=pos[0];
				goodY=pos[1];
				tryPos=[0,0,0];
				goodDis=1000;
				for(y=-10;y<10;y++)
				{
					for(x=-10;x<10;x++)
					{
						tryPos[0]=pos[0]+x;
						tryPos[1]=pos[1]+y;
						if(game.tileMap.isPosGoodForBuildingDef(tryPos,w,h))
						{
							dis=(x<0?-x:x)+(y<0?-y:y);
							if(dis<goodDis)
							{
								goodDis=dis;
								goodX=pos[0]+x;
								goodY=pos[1]+y;
							}
						}
					}
				}
				pos[0]=goodX;
				pos[1]=goodY;
			}
		}
		else
		{
			pos=[askPos[0],askPos[1]];
		}

		if("WorkerHut"==objDef.codename && window.InMobiAnalytics && window.InMobiAnalytics.tagEvent)
		{
			InMobiAnalytics.tagEvent("BuyWorker");
		}

		homeBld=new page.vwHomeBld(appEnv,this);
		homeBld.initNewBld(defIdx,pos[0],pos[1],group,uid);
		this.newPosBld=this.selBld=homeBld;
		return homeBld;
	};

	//---------------------------------------------------------------------------
	//确认新建建筑的位置
	__Page.vwHomeStage.confirmNewBld=function()
	{
		//TODO: Code this
		var homeBld,aisBld,aisDef,bldView,def,tryPos,w,h,city,numCap,bldNum,cost;
		var game,page,pos,dx,dy;
		var defName,homeBld,appEnv,textLib,svo;

		if(!this.newPosBld)
			return;
		page=this.page;
		game=this.game;
		city=aisGame.curCity;

		homeBld=this.newPosBld;
		aisDef=homeBld.aisDef;

		if(!aisDef.buildNotNeedWorker && !city.freeBldWorkerNum>=1)
		{
		//	this.appEnv.stateLogs.showLog("No worker, will show dialog!!");
			if(!this.checkWorker(this.confirmNewBld,this));
				return;
		}

		cost=aisDef.levels[0].cost;
		if("WorkerHut"==aisDef.codeName)
		{
			cost.gem=aisEnv.defLib.globals["WORKER_COST_"+(aisGame.curCity.bldWorkers.length+1)];
		}
		if("Hangar"==aisDef.codeName)
		{
			var num=city.getValue("numBld"+aisDef.codeName);
			cost=aisDef.levels[0].costs[num];
			aisDef.levels[0].cost=cost;
		}
		if(!homeBld.giftId && !this.checkCost(cost,1,this.confirmNewBld,this))
		{
			return;
		}

		this.newPosBld=null;
		this.clearSelBld();

		homeBld.confirmNewBld();
		aisBld=homeBld.aisBld;

		def=aisDef;
	//	cost=def.levels[0].cost;
		if(def.batchBuild)//继续下一个
		{
			//TODO: 检查建筑种类上限是否达到,资源是否足够?
			numCap=window.aisGame.curCity.getValue("maxCap"+def.codeName);
			bldNum=window.aisGame.curCity.getValue("numBld"+def.codeName);
			if(numCap>bldNum)
			{
				if(this.checkCost(cost,0))
				{
					pos=[aisBld.pos[0],aisBld.pos[1],0];
					tryPos=[0,0,0];
					w=homeBld.cocDef.tile_w;
					h=homeBld.cocDef.tile_h;
					if(this.batchPos)
					{
						dx=pos[0]-this.batchPos[0];
						dy=pos[1]-this.batchPos[1];
						dx=dx?(dx/(dx<0?-dx:dx)*w):0;
						dy=dy?(dy/(dy<0?-dy:dy)*h):0;
						dy=dx?0:dy;//不能同时有值
						tryPos[0]=pos[0]+dx;
						tryPos[1]=pos[1]+dy;
						if(game.tileMap.isPosGoodForBuildingDef(tryPos,w,h))
						{
							this.askNewBldPos(homeBld.cocDefIdx,0,homeBld.objGroup,tryPos);
							this.batchPos=pos;
							return;
						}
					}

					tryPos[0]=pos[0]-w;
					tryPos[1]=pos[1];
					if(game.tileMap.isPosGoodForBuildingDef(tryPos,w,h))
					{
						this.askNewBldPos(homeBld.cocDefIdx,0,homeBld.objGroup,tryPos);
						this.batchPos=pos;
						return;
					}
					tryPos[0]=pos[0]+w;
					tryPos[1]=pos[1];
					if(game.tileMap.isPosGoodForBuildingDef(tryPos,w,h))
					{
						this.askNewBldPos(homeBld.cocDefIdx,0,homeBld.objGroup,tryPos);
						this.batchPos=pos;
						return;
					}
					tryPos[0]=pos[0];
					tryPos[1]=pos[1]-h;
					if(game.tileMap.isPosGoodForBuildingDef(tryPos,w,h))
					{
						this.askNewBldPos(homeBld.cocDefIdx,0,homeBld.objGroup,tryPos);
						this.batchPos=pos;
						return;
					}
					tryPos[0]=pos[0];
					tryPos[1]=pos[1]+h;
					if(game.tileMap.isPosGoodForBuildingDef(tryPos,w,h))
					{
						this.askNewBldPos(homeBld.cocDefIdx,0,homeBld.objGroup,tryPos);
						this.batchPos=pos;
						return;
					}
					//DBOut("Warning: batch build can't find next pos!");
					this.askNewBldPos(homeBld.cocDefIdx,0,homeBld.objGroup);
					this.batchPos=pos;
				}
			}
			else
			{
				//TODO:使用字符串表:
				this.appEnv.stateLogs.showLog(this.page.appEnv.textLib.NumberLimited);
			}
		}
		else//选中当前建筑
		{
			this.selectBld(homeBld);
		}
	};

	//---------------------------------------------------------------------------
	//取消新建建筑
	__Page.vwHomeStage.abortNewBld=function()
	{
		if(!this.newPosBld)
			return;
		this.clearSelBld();
	};

	//---------------------------------------------------------------------------
	//升级建筑
	__Page.vwHomeStage.upgradeBld=function()
	{
		var homeBld,city,cost,svo,appEnv,textLib,level,aisBld,def;
		textLib=this.appEnv.textLib;
		var list;
		homeBld=this.selBld;
		if(!homeBld || !homeBld.aisBld)
			return;
		aisBld=homeBld.aisBld;
		city=aisGame.curCity;
		list=aisBld.def.levels[aisBld.level].req.features;
		if(list.length)
		{
			//DBOut("Upgrade req: "+list);
			list=city.getMissingFeatures(list,1);
			if(list && list.length>0)
			{
				//TODO: 换成字符串表
				def=aisEnv.defLib.feature[list[0]];
				this.appEnv.stateLogs.showLog(textLib["ReqNotMeet"](def.name));
				return;
			}
		}

		var buffCodeName=homeBld.aisDef.levels[aisBld.level].boostBuff;
		if(buffCodeName && aisBld.getBuff(buffCodeName))
		{
			this.appEnv.showPmtDlg(this.page.pmtChoose,0,
				{
					title:textLib["IsBoosting"],info:textLib["IsBoostingDesc"],
					pmtFunc:this._upgradeBld,pmtObj:this
				}
			);
			return;
		}
		this._upgradeBld(1);
	};

	__Page.vwHomeStage._upgradeBld=function(ok)
	{
		if(!ok)return;
		var homeBld=this.selBld;
		var aisBld=homeBld.aisBld;
		if(!this.checkWorker(this._upgradeBld,this,[ok]))
			return;
//		if(!city.freeBldWorkerNum>=1)
//		{
//			//TODO: 换成对话框+换成字符串表
//			this.appEnv.stateLogs.showLog("No worker, will show dialog!!");
//			return;
//		}

		var cost=aisBld.def.levels[aisBld.level].cost;
		if(!this.checkCost(cost,1,this.upgradeBld,this))
		{
			return;
		}

		homeBld.upgrade();
	//	this.clearSelBld();
	};

	//---------------------------------------------------------------------------
	//取消建造
	__Page.vwHomeStage.abortConstuction=function()
	{
		var homeBld,aisBld,textLib;
		homeBld=this.selBld;
		if(!homeBld || !homeBld.aisBld)
			return;
		textLib=this.appEnv.textLib;
		var bldName=homeBld.aisBld.name;
		var backFull = "DecoBld"==bldName?1:0;
		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:backFull?textLib["IsBld"]:textLib["IsBuilding"],info:backFull?textLib["IsBldDesc"]:textLib["IsBuildingDesc"],
				pmtFunc:this._abortConstuction,pmtObj:this
			}
		);
	};

	__Page.vwHomeStage._abortConstuction=function(abort)
	{
		var homeBld,aisBld;
		//DBOut("_abortConstuction: "+abort+", "+this.selBld);
		if(!abort)
			return;
		homeBld=this.selBld;
		if(!homeBld || !homeBld.aisBld)
			return;
		aisBld=homeBld.aisBld;
		if(!aisBld.constructing)
			return;
		//DBOut("Will stop constructiong!!");
		homeBld.abortConstuction();
		this.clearSelBld();
		if(aisBld.deadOut)//房子被删了
		{
			homeBld.abortNewBld();
		}
		//遣散工人:
		homeBld.freeWorker();
	};

	//---------------------------------------------------------------------------
	//变型（升级）一个建筑，实际上就是删除后再添加
	__Page.vwHomeStage.morphBld=function(homeBld,newDefIdx,bSwitchMode)
	{
		var sel,homeBld;
		var pos,level,uid,group,aisBld,bldView,oldState,oldBld,list,i,n;

		//DBOut("Morph homeBld: "+this.selBld);
		sel=(homeBld==this.selBld);
		if(sel && "Wall"!=homeBld.aisDef.codeName)
		{
			this.clearSelBld();
		}
		homeBld=homeBld;
		homeBld.morphBld(newDefIdx,bSwitchMode);
	};

	//---------------------------------------------------------------------------
	//删除一个建筑
	__Page.vwHomeStage.removeBld=function()
	{
		//TODO: Code this
		var uid,list,i,n,homeBld,aisBld,city,svo,cost,appEnv;

		homeBld=this.selBld;
		if(!homeBld)
			return;
		if(!homeBld)
			return;
		aisBld=homeBld.aisBld;
		city=aisBld.city;
		if(!this.checkWorker(this.removeBld,this))
			return;
//		if(!city.freeBldWorkerNum>=1)
//		{
//			this.appEnv.stateLogs.showLog("No worker, will show dialog!!");
//			return;
//		}

		cost=aisBld.def.levels[aisBld.level].cost;
		if(!this.checkCost(cost,1,this.removeBld,this))
		{
			return;
		}
		this.clearSelBld();
		aisGame.king.execCmd(aisBld,"Remove",{},aisBld);
	};

	//---------------------------------------------------------------------------
	//删除墓碑
	__Page.vwHomeStage.removeGraveBld=function()
	{
		//TODO: Code this
		var uid,list,i,n,homeBld,aisBld,city,svo,cost,appEnv;

		homeBld=this.selBld;
		if(!homeBld)
			return;
		this.clearSelBld();
		aisBld=homeBld.aisBld;
		city=aisBld.city;
//		if(!this.checkWorker(this.removeBld,this))
//			return;

		aisGame.king.execCmd(aisBld,"RemoveAll",{},aisBld);

		if(this.page.audioObject && this.page.audioObject._init)
		{
			this.page.audioObject.playSound("bld_gettomb");
		}
	};

	//---------------------------------------------------------------------------
	//钻石矿花钱买加速
	__Page.vwHomeStage.buyGemBoost=function()
		{
			var homeBld,aisBld,boostDef,textLib;
			var appEnv=this.appEnv;
			var page=this.page;
			textLib=appEnv.textLib;
			var defLib=window.aisEnv.defLib.pay.catalog;
			var info,i,j,boostDef;
			homeBld=this.selBld;

			for(i in defLib)
			{
				if(PUR._purchase[i])
				{
					for(j in defLib[i])
					{
						if(defLib[i][j].Action=="GemBoost")
						{
							info=defLib[i][j];
							break;
						}
					}
				}
			}
			if(!info)return;

			boostDef=aisEnv.defLib.buff[homeBld.aisDef.levels[homeBld.aisBld.level].boostBuff];

			this.appEnv.showPmtDlg(this.page.pmtChoose,0,
				{
					title:textLib["AskBoost"],info:textLib.getText(textLib["askBuyGemBoost"],{rmb:PUR.forDight(info.CostNumber/100,2),num:boostDef.factors[0].add,day:textLib.getTimeText(boostDef.durTime)}),
					pmtFunc:function(ok,info){
						if(ok)
						{
							PUR.buyItem(info);
						}
						else
							DBOut("no pay");
					},pmtObj:this,pmtParam:info
				}
			);
		};
	//---------------------------------------------------------------------------
	//加速当前建筑
	__Page.vwHomeStage.boostBld=function()
	{
		var homeBld,aisBld,boostDef,textLib;
		homeBld=this.selBld;
		if(!homeBld || !homeBld.aisBld)
			return;

		if(homeBld.aisDef.groupId =="DiamondMine")
		{
			this.buyGemBoost();
			return;
		}

		textLib=this.appEnv.textLib;
		boostDef=aisEnv.defLib.buff[homeBld.aisDef.levels[homeBld.aisBld.level].boostBuff];

		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:textLib["AskBoost"],info:textLib["AskBoostInfo"](boostDef),
				pmtFunc:this._boostBld,pmtObj:this
			}
		);
	};

	__Page.vwHomeStage._boostBld=function(boost)
	{
		//TODO: Boost!!!
		if(!boost)
			return;
		DBOut("Will boost!!!");
		var homeBld=this.selBld;
		if(homeBld)
		{
			var comName,boostBuff=homeBld.aisDef.levels[homeBld.aisBld.level].boostBuff;
			comName=(boostBuff && (boostBuff.indexOf("UnitRush")!=-1 || boostBuff.indexOf("SpellRush")!=-1))?"AddBuffTrain":"AddBuff";

			var def=window.aisEnv.defLib.buff[boostBuff];
			if(!def)
			{
				DBOut("vwHomeStage._boostBld Error 2: can't find Buff: "+boostBuff);
				return;
			}

			var cost=def.cost;//{gem:def.cost};
			if(!this.checkCost(cost,1,this._boostBld,this,boost))
			{
				return;
			}

			aisGame.king.execCmd(homeBld.aisBld,comName,{codeName:boostBuff},homeBld.aisBld);
			this.clearSelBld();
		}
	}

	//---------------------------------------------------------------------------
	//工人检测
	__Page.vwHomeStage.checkWorker=function(callFun,callObj,callParam)
	{
		var city=aisGame.curCity;
		var i,worker,time,timeTmp,aisBld,gemNum;
		if(!city.freeBldWorkerNum>=1)//没有空闲的工人
		{
			for(i=0; i<city.bldWorkers.length; i++)
			{
				worker=city.bldWorkers[i];
			//	DBOut(i+":"+city.bldWorkers[i].workBld);//constructTask.getRemainTime?
				timeTmp=worker.workBld.constructTask.getRemainTime();
				if(!time || !aisBld || timeTmp<time)
				{
					time=timeTmp;
					aisBld=worker.workBld;
				}
			}
			var textLib=this.appEnv.textLib;
			gemNum=window.aisGame.king.convertTime2Gem(time);
			this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["NoFreeWorker"],info:textLib["NoFreeWorkerDesc"],svo:{gem:gemNum,aisBld:aisBld},ui:"gem2freeWorker",
				pmtFunc:callFun,pmtObj:callObj,pmtParam:callParam});
			return 0;
		}
		return 1;
	};

	//---------------------------------------------------------------------------
	//钻石秒完一个工人的work
	__Page.vwHomeStage.gemFinWorker=function(aisBld,gemNum,callFun,callObj,callParam)
	{
		if(!aisBld)
		{
			return;
		}
		if(!aisBld.constructing)
			return;
		time=aisBld.constructTask.getRemainTime();
		gemNum=aisGame.king.convertTime2Gem(time);

		var comVO={};
		var city=window.aisGame.curCity;
		//if(city.vipLevel)
		{
			var defLib=window.aisEnv.defLib.vipPrivilege;
			var def=defLib["vipBLDTimeDiscount"];
			if(def && def.levels[city.vipLevel])
			{
				gemNum=Math.round(gemNum*def.levels[city.vipLevel].modifyValue/100);
				comVO.discountGemNum=gemNum;
			}
		}

		var cost={gem:gemNum};
		if(!this.checkCost(cost,1,this.gemFinWorker,this,[aisBld,gemNum,callFun,callObj,callParam]))
		{
			return;
		}
		if(aisBld.com_Remove)
			window.aisGame.king.execCmd(aisBld,"GemRemoveDone",comVO,aisBld);
		else
			window.aisGame.king.execCmd(aisBld,"GemConstructDone",comVO,aisBld);
		if(callFun && callObj)
		{
			callFun.apply(callObj,callParam);
		}
	};

	//---------------------------------------------------------------------------
	//钻石秒完一个建筑
	__Page.vwHomeStage.gemFinBld=function(aisBld)
	{
		var homeBld,aisBld,boostDef,textLib,time,gemNum;
		if(!aisBld)
		{
			homeBld=this.selBld;
			if(!homeBld || !homeBld.aisBld)
				return;
			aisBld=homeBld.aisBld;
		}
		if(!aisBld)
		{
			return;
		}
		if(!aisBld.constructing)
			return;
		time=aisBld.constructTask.getRemainTime();
		gemNum=aisGame.king.convertTime2Gem(time);

		var city=window.aisGame.curCity;
		//if(city.vipLevel)
		{
			var defLib=window.aisEnv.defLib.vipPrivilege;
			var def=defLib["vipBLDTimeDiscount"];
			if(def && def.levels[city.vipLevel])
			gemNum=Math.round(gemNum*def.levels[city.vipLevel].modifyValue/100);
		}

		var cost={gem:gemNum};
		if(!this.checkCost(cost,1,this.gemFinBld,this))
		{
			return;
		}

		textLib=this.appEnv.textLib;
		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:textLib["AskGemFin"],info:textLib["AskGemFinInfo"](gemNum),
				pmtFunc:this._gemFinBld,pmtObj:this,pmtParam:aisBld
			}
		);
	};

	__Page.vwHomeStage._gemFinBld=function(fin,aisBld)
	{
		if(!fin)
			return;
		if(aisBld)
		{
			var time=aisBld.constructTask.getRemainTime();
			var gemNum=aisGame.king.convertTime2Gem(time);

			var comVO={};
			var city=window.aisGame.curCity;
			//if(city.vipLevel)
			{
				var defLib=window.aisEnv.defLib.vipPrivilege;
				var def=defLib["vipBLDTimeDiscount"];
				if(def && def.levels[city.vipLevel])
				{
					gemNum=Math.round(gemNum*def.levels[city.vipLevel].modifyValue/100);
					comVO.discountGemNum=gemNum;
				}
			}

			aisGame.king.execCmd(aisBld,"GemConstructDone",comVO,aisBld);
		}
	};

	__Page.vwHomeStage.checkClan=function(show)
	{
		var bld=window.aisGame.king.getHashObj("Obj0");
		if(bld)
		{
//			if(bld.constructing)
			if(0==bld.level)
			{
				if(0!=show)
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["ClanNeedBld"]());
				return 0;
			}
			return 1;
		}
		else
		{
			DBOut("have no clan castle");
			if(0!=show)
				this.appEnv.stateLogs.showLog(this.appEnv.textLib["ClanNeedBld"]());
			return 0;
		}
	};
}

//***************************************************************************
//兵种训练，研究魔法, 研究升级，钻买资源等
//***************************************************************************
{
	//---------------------------------------------------------------------------
	//检测创造某个东西需要的物资消耗是否满足
	__Page.vwHomeStage.checkCost=function(cost,num,callFun,callObj,callParam)//num为0时只检测，不做ui处理
	{
		//cost={time:3600000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2500},{store:"Gold",type:"ResGold",num:80000}]}
		//svo={time:3600000,cash:0,gem:0,storage:[{name:"ResOil/name",type:"ResOil",num:2500},{store:"ResGold/name",type:"ResGold",num:80000}]}
		var city=window.aisGame.curCity;
		var i,maxcnt,cstore,sotre,storage;
		var showUI=1;
		if(0==num)
			showUI=0;
		cstore=cost.storage;
		var textLib=this.appEnv.textLib;
		if(cstore && cstore.length)
		{
			for(i=0; i<cstore.length; i++)
			{
				store=cstore[i];
				storage=city.allStorages[store.store];
				if(store.num>storage.getTotalCap())
				{
					if(showUI){
						this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["OverflowStorage"],info:textLib["OverflowRes"](store.type)});
					}
					return 0;
				}
			}
		}
		if(!(num>0))
			num=1;
		if(!cost.storage)
			cost.storage=[];
		var svo={};//短缺vo，cash、gem为正，storage的num为负
		maxcnt=city.checkCost(cost,num,svo);
		if(svo.cash)
		{
			if(showUI){
			//	this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["ChipNotEnough"],info:textLib.getTextEx("NeedChipNum",{num:svo.cash})});
				this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["ChipNotEnough"],info:textLib.getTextEx("NeedChipNum",{num:svo.cash}),svo:svo,ui:"gem2token",
					pmtFunc:callFun,pmtObj:callObj,pmtParam:callParam});
			}
			return 0;
		}
		if(svo.gem)
		{
			if(showUI){
				this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["NotEnougGem"],info:textLib["NeedGemNum"](svo.gem),ui:"go2shop"});
			}
			return 0;
		}
		cstore=svo.storage;
		if(cstore && cstore.length)
		{
			for(i=0; i<cstore.length; i++)
			{
				maxcnt=0;
				store=cstore[i];
				if(showUI){
					this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["NotEnougRes"],info:textLib["NeedResNum"](store.type,store.name,store.num*-1),svo:svo,ui:"gem2res",
						pmtFunc:callFun,pmtObj:callObj,pmtParam:callParam});
				}
			//	appEnv.showPmtDlg(page.pmtInfo,0,{title:textLib["NoResTitle"],info:textLib["NoResBuildInfo"](svo),svo:svo}
				return 0;
			}
		}
		return maxcnt;
	};

	//---------------------------------------------------------------------------
	//钻买资源
	__Page.vwHomeStage.gemTrade=function(comVO,callFun,callObj,callParam)
	{
		var city=window.aisGame.curCity;
		var gem=comVO.gem;
		var cost={gem:gem};
		if(!this.checkCost(cost,1,this.gemTrade,this,comVO))
		{
			DBOut("Not enough gem: "+gem);
			return;
		}
		//TODO:改写这个, 支持多种Storage
		var store
		if(comVO.store)
		{
			store=city.allStorages[comVO.store];
			if(!store)
			{
				DBOut("Can't find storage: "+comVO.store);
				return;
			}
		}
		/**
		//爆仓检测，应该不会执刑到这里，在checkCost里面已经在消耗前进行了判断【++++++商店里还需要判断++++++】
		DBOut(store.getUsedCap()+"/"+store.getTotalCap());
		if(store.getUsedCap()+comVO.num > store.getTotalCap())
		{
			DBOut("storage will overflow!!!");
			var textLib=this.appEnv.textLib;
			this.page.pmtInfo.showInfo(textLib["OverflowStorage"],textLib["Overflow"+comVO.store]);
			return;
		}
		**/
		var fun="GemTrade";
		if("ResCube"==comVO.codeName)fun="GemBuyTokens";
		window.aisGame.king.execCmd(city,fun,comVO,city);
		if(comVO.vip)
		{
			if("ResGold"==comVO.codeName)
				city.vipBuyGold=1;
			else if("ResOil"==comVO.codeName)
				city.vipBuyOil=1;
			else if("ResCube"==comVO.codeName)
				city.vipBuyCube=1;
		}
		if(callFun && callObj)
		{
		//	DBOut("callFun="+callFun+", callObj="+callObj+", callParam="+callParam);
			callFun.apply(callObj,callParam);
		}
	};

	//---------------------------------------------------------------------------
	//钻买黑水
	__Page.vwHomeStage.gem2token=function(comVO,callFun,callObj,callParam)
	{
		var city=window.aisGame.curCity;
		var gem=comVO.gem;
		var cost={gem:gem};
		if(!this.checkCost(cost,1,this.gem2token,this,comVO))
		{
			DBOut("Not enough gem: "+gem);
			return;
		}
		//TODO:改写这个, 支持多种Storage
		if(!comVO.num)
		{
			DBOut("error cash num: "+toJSON(comVO));
			return;
		}
		window.aisGame.king.execCmd(city,"GemBuyTokens",comVO,city);
		if(comVO.vip)
		{
			city.vipBuyToken=1;
		}
		if(callFun && callObj)
		{
			callFun.apply(callObj,callParam);
		}
	};

	//---------------------------------------------------------------------------
	//钻买护盾
	__Page.vwHomeStage.buyShield=function(comVO,callFun,callObj,callParam)
	{
		var city=window.aisGame.curCity;
		var gem=comVO.gem;
		var cost={gem:gem};
		if(!this.checkCost(cost,1,this.buyShield,this,comVO))
		{
			DBOut("Not enough gem: "+gem);
			return;
		}
		window.aisGame.king.execCmd(city,"BuyShield",comVO,city);
	//	DBOut(city.cooldownTime+" "+comVO.cooldown);
	//	if(!city.cooldownTime || city.cooldownTime<city.env.dateTime())
	//		city.cooldownTime=comVO.cooldown+city.env.dateTime();
		var shieldTime=city.shieldTime;
		if(shieldTime && shieldTime.length)
		{
			for(var i=0; i<shieldTime.length; i++)
			{
				if(comVO.codeName==shieldTime[i].codename)
				{
					if(shieldTime[i].cooldownTime>city.env.dateTime())
						shieldTime[i].cooldownTime+=comVO.cooldown;
					else
						shieldTime[i].cooldownTime=comVO.cooldown+city.env.dateTime();
				}
			}
		}
		if(callFun && callObj)
		{
		//	DBOut("callFun="+callFun+", callObj="+callObj+", callParam="+callParam);
			callFun.apply(callObj,callParam);
		}
	};

	//---------------------------------------------------------------------------
	//开始制造（造兵、魔法）
	__Page.vwHomeStage.newMfc=function(comVO,callFun,callObj)
	{
		DBOut("vwHomeStage.newMfc");
		var bld=this.selBld.aisBld;
		if(comVO.bld)bld=comVO.bld;
		var def,task,prdct,cost,time,speed,level;
		var fpow,wpow,num,list,i,n,slot;
		//DBOut("Will start a new Mfc: "+toJSON(comVO));
		if(bld.constructing)
		{
			DBOut("vwHomeStage.newMfc Error 2: Can't start research, lab is busy!");
			return;
		}
		def=bld.productDefList[comVO.codeName];
		num=comVO.num;
		if(!def)
		{
			DBOut("vwHomeStage.newMfc Error 3: Can't find prdct! "+comVO.codeName);
			return;
		}
		comVO.svrCodeName=def.svrCodeName;
		level=comVO.level?comVO.level:0;

		fpow=bld.city.power.getCurFreePower();
		wpow=bld.getValue("powCostPerRate")*100;
		if(fpow<wpow)
		{
			DBOut("vwHomeStage.newMfc Error 4: No power to start research!");
			return;
		}

		cost=def.levels[level].cost;
		//TODO:需要检测req和cost?


		//调整当前的建造容量:
		//DBOut("Slot Cap: "+bld.slotCap+"="+def.storageSize+"*"+num);
		if(bld.slotCap+def.storageSize*num > bld.getValue("mfcCap"))
		{
			//DBOut("vwHomeStage.newMfc Error 5: No cap to start MFC! "+bld.slotCap+"/"+bld.getValue("mfcCap"));
			return;
		}

		if(!this.checkCost(cost,1,this.newMfc,this,[comVO,callFun,callObj]))
		{
			DBOut("newMfc: not enough res!");
			return 0;
		}

	//	if(!bld.working)//启动制造!
		{
			window.aisGame.king.execCmd(bld,"NewMfc",comVO,bld);
			if(callFun && callObj)
				callFun.call(callObj);
		}
	};

	//---------------------------------------------------------------------------
	//钻秒制造（造兵、魔法）
	__Page.vwHomeStage.gemMfcDone=function(aisBld)
	{
		DBOut("vwHomeStage.gemMfcDone");
		var bld=this.selBld.aisBld;
		var gem,time,gemNum;
		if(aisBld)bld=aisBld;
		if(!bld.working)
		{
			DBOut("vwHomeStage.gemMfcDone Error 1: Building is not working!!");
			return;
		}
		if(!bld.workTask)
		{
			DBOut("vwHomeStage.gemMfcDone Error 2: Can't find construction task!");
			return;
		}
		var rate=window.aisGame.curCity.getClanTecReviseRate(bld,"Barrack","TrainingTime");
		//time=bld.workTask.getRemainTime()+(bld.slotWorkVal/bld.getValue("mfcSpeed"));
		time=bld.workTask.getRemainTimeByReviseRate(rate)+(bld.slotWorkVal*rate/bld.getValue("mfcSpeed"));
		gemNum=bld.king.convertTime2Gem(time);

		var comVO={};
		var city=window.aisGame.curCity;
		//if(city.vipLevel)
		{
			var defLib=window.aisEnv.defLib.vipPrivilege;
			var def=defLib["vipTrainTimeDiscount"];
			if(def && def.levels[city.vipLevel])
			{
				gemNum=Math.round(gemNum* def.levels[city.vipLevel].modifyValue/100);
				comVO.discountGemNum=gemNum;
			}
		}

		var cost={gem:gemNum};
		if(!this.checkCost(cost,1,this.gemMfcDone))
		{
			DBOut("gemMfcDone: not enough gem!");
			return;
		}

		if(gemNum>0)
		{
			if(bld.king.gemNum<gemNum)
			{
				//DBOut("vwHomeStage.gemMfcDone Error 3: Not enough gems: "+gemNum+" vs "+bld.king.gemNum);
				return;
			}
		}
		window.aisGame.king.execCmd(bld,"GemMfcDone",comVO,bld);
	};

	//---------------------------------------------------------------------------
	//花钻强制复仇
	__Page.vwHomeStage.gemForceRevenge=function(comVO)
	{
		var cost={gem:comVO.gemNum,storage:[]};
		if(!this.checkCost(cost,1))
		{
			return;
		}
		DBOut("gemForceRevenge: "+toJSON(comVO));
		this.page.stateHome.onRevengeClick(comVO);
	};

//	//---------------------------------------------------------------------------
//	//花钻解锁敌槽
//	__Page.vwHomeStage.gemUnlockFoe=function(gemNum)
//	{
//		var city, king;
//		city=window.aisGame.curCity;
//		king=window.aisGame.king;
//		king.execFakeCmd(city,"UnlockEnemySlot",{gemNum:gemNum,callBack:function(){},callObj:this},city);
//	};
//
//	//---------------------------------------------------------------------------
//	//花钻攻击仇敌
//	__Page.vwHomeStage.gemFireFoe=function()
//	{
//		var city, king;
//		city=window.aisGame.curCity;
//		king=window.aisGame.king;
//		king.execFakeCmd(city,"BattleEnemy",{userId:userId,gemNum:gemNum,callBack:function(){},callObj:this},city);
//	};

	//---------------------------------------------------------------------------
	//取消魔法
	__Page.vwHomeStage.abortSpell=function(vo)
	{
		var homeBld,aisBld,textLib;
		homeBld=this.selBld;
		if(!homeBld || !homeBld.aisBld)
			return;
		textLib=this.appEnv.textLib;
		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:textLib["IsMaking"],info:textLib["IsMakingDesc"],
				pmtFunc:this._abortSpell,pmtObj:this,pmtParam:vo
			}
		);
	};

	__Page.vwHomeStage._abortSpell=function(abort,vo)
	{
		var homeBld,aisBld;
		//DBOut("_abortConstuction: "+abort+", "+this.selBld);
		if(!abort)
			return;
		homeBld=this.selBld;
		if(!homeBld || !homeBld.aisBld)
			return;
		aisBld=homeBld.aisBld;
		DBOut(" Will _abortSpell!");
		window.aisGame.king.execCmd(aisBld,"AbortMfc",vo.comVO,aisBld);
		if(vo.fun && vo.obj)
			vo.fun.call(vo.obj);
	};

	//---------------------------------------------------------------------------
	//开始研究（升级兵、升级魔法）
	__Page.vwHomeStage.newCase=function(comVO)
	{
		DBOut("vwHomeStage.newCase");
		var bld=this.selBld.aisBld;
		var def,task,tech,cost,time,speed,level;
		var fpow,wpow;
		//DBOut("Will start a new case: "+toJSON(comVO));
		if(bld.working)
		{
			DBOut("vwHomeStage.newCase Error 1: Can't research more!");
			return;
		}
		if(bld.constructing)
		{
			DBOut("vwHomeStage.newCase Error 2: Can't start research, lab is busy!");
			return;
		}
		def=aisEnv.defLib.tech[comVO.tech];
		if(!def)
		{
			DBOut("vwHomeStage.newCase Error 3: Can't find tech!");
			return;
		}
		//TODO:正常操作会出现下面这个异常，应该是研究对话框没有仔细看。
		fpow=bld.city.power.getCurFreePower();
		wpow=bld.getValue("powCostPerRate")*100;
		if(fpow<wpow)
		{
			DBOut("vwHomeStage.newCase Error 4: No power to start research!");
			return;
		}

		//TODO:需要检测req和cost?

		tech=bld.king.getTech(def.codeName);
		if(tech)//这是一个升级的研究
		{
			cost=def.levels[tech.level].cost;
		}
		else//这是一个全新的研究
		{
			cost=def.levels[0].cost;
		}

		if(!this.checkCost(cost,1,this.newCase,this,[comVO]))
		{
			DBOut("newCase: not enough res!");
			return;
		}
		window.aisGame.king.execCmd(bld,"NewCase",comVO,bld);
	};

	//---------------------------------------------------------------------------
	//钻秒研究
	__Page.vwHomeStage.gemCaseDone=function()
	{
		DBOut("vwHomeStage.gemCaseDone");
		var bld=this.selBld.aisBld;
		var gem,time,gemNum;
		if(!bld.working)
		{
			DBOut("vwHomeStage.gemCaseDone Error 1: Building is not working!!");
			return;
			//throw aisBuilding.ERR_NoWorkTask;
		}
		if(!bld.workTask)
		{
			DBOut("vwHomeStage.gemCaseDone Error 2: Can't find construction task!");
			return;
			//throw aisBuilding.ERR_NoWorkTask;
		}
		if(bld.workTask.isDone())
		{
			DBOut("vwHomeStage.gemCaseDone Error 3!");
			//throw aisTechLab.ERR_CaseNotPause;
			return;
		}
		time=bld.workTask.getRemainTime();
		gemNum=bld.king.convertTime2Gem(time);

		var comVO={};
		var city=window.aisGame.curCity;
		//if(city.vipLevel)
		{
			var defLib=window.aisEnv.defLib.vipPrivilege;
			var def=defLib["vipBLDTimeDiscount"];
			if(def && def.levels[city.vipLevel])
			{
				gemNum=Math.round(gemNum*def.levels[city.vipLevel].modifyValue/100);
				comVO.discountGemNum=gemNum;
			}
		}

		var cost={gem:gemNum};
		if(!this.checkCost(cost,1,this.gemCaseDone))
		{
			DBOut("gemCaseDone: not enough gem!");
			return;
		}

		if(bld.king.gemNum<gemNum)
		{
			DBOut("vwHomeStage.gemCaseDone Error 3: Not enough gems: "+gemNum+" vs "+window.aisGame.king.gemNum);
			return;
		}
		window.aisGame.king.execCmd(bld,"GemCaseDone",comVO,bld);
	};
	//---------------------------------------------------------------------------
	//联盟贡献
	__Page.vwHomeStage.clanDonate=function(pay,callFun,callObj)
	{
		DBOut("vwHomeStage.clanDonate");
		var bld=window.aisGame.king.getHashObj("Obj0");
		var defLib=window.aisEnv.defLib.clan;
		var cost;
		if(pay)//钻石贡献
			cost=defLib["powerDonate"]["cost"];
		else//免费贡献
			cost=defLib["genDonate"]["cost"];
		if(!this.checkCost(cost,1,this.clanDonate,this,[pay,callFun,callObj]))
		{
			return 0;
		}
		var comVO={type:pay};
		var king=window.aisGame.king, city=window.aisGame.curCity;
		king.sendNTCmd(city,"ClanDonatePoints",comVO,city);
		if(callFun && callObj)
			callFun.call(callObj);
		return 1;
		//bld.dailyDonateTimes  //普通捐赠的次数
	};
	//---------------------------------------------------------------------------
	//钻秒联盟科技
	__Page.vwHomeStage.clanTechGemDone=function(comVO,callFun,callObj)
	{
		DBOut("vwHomeStage.clanTechGemDone");
		var bld=window.aisGame.king.getHashObj("Obj0");
		var defLib=window.aisEnv.defLib.clanTec;
		var def=defLib[comVO.codeName];
		var lv=comVO.techLevel;
		var cost=def["levels"][lv-1]["cost"];
		if(!this.checkCost(cost,1,this.clanTechGemDone,this,[comVO,callFun,callObj]))
		{
			return 0;
		}
		comVO.gem=cost["gem"];
		var king=window.aisGame.king, city=window.aisGame.curCity;
		king.sendNTCmd(city,"ClanCallGem",comVO,city);
		if(callFun && callObj)
			callFun.call(callObj);
		return 1;
	};
	//---------------------------------------------------------------------------
	//响应联盟科技号召
	__Page.vwHomeStage.clanTechDonate=function(comVO,callFun,callObj)
	{
		DBOut("vwHomeStage.clanTechDonate");
		var bld=window.aisGame.king.getHashObj("Obj0");
		var defLib=window.aisEnv.defLib.clanTec;
		var def=defLib[comVO.codeName];
		var lv=comVO.techLevel;
		var cost=def["levels"][lv-1]["callCost"];
		if(!this.checkCost(cost,1,this.clanTechDonate,this,[comVO,callFun,callObj]))
		{
			return 0;
		}
		comVO.gem=cost["gem"];
		var king=window.aisGame.king, city=window.aisGame.curCity;
		king.sendNTCmd(city,"ClanRespondCall",comVO,city);
		if(callFun && callObj)
			callFun.call(callObj);
		return 1;
	};
}

//***************************************************************************
//初始化舞台, 界面
//***************************************************************************
{
	//初始化CoC游戏的Hud
	__Page.vwHomeStage.initGameHud=function()
	{
		var page;
		var layer,appEnv;
		var scale,css,w,h,scrSize;

		page=this.page;
		appEnv=page.appEnv;
		scrSize=appEnv.scrSize;
		this.layer=layer=page.getElementById("ui-layer");
		scale=1;

		//创建触屏操作底板,TODO: min/max_pos需要正确的初始化
		this.navBox=layer.addHudItem({
			"type":"nav_box",id:"navBox","pos":[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],ui_event:1,display:1,csm_pos:0,edge_factor:0,
			min_pos:[0,0,0],max_pos:[0,0,0],key:appEnv.appKeys.navBox,inertia_damping:3,
			//inertia_damping:1.8,inertia_maxspeed:3
		});
		this.setNavBoxRangeByScale(scale);

		//初始化CoC游戏控件的Hud的Def对象
		this.hudDef={//3500x2500
			type:"coc_game",pos:[appEnv.scrSize[0]>>1,-((54*40))>>1,0],w:this.feildW,h:this.feildH,scale:scale,ui_event:1,
			scale_min:Math.max(appEnv.scrSize[0]/3500,0.5),display:0,
			game:this.genGameDefVO(),
			page:this.page,homeStage:this,
			onTouch:this.onLevelTouch
		};
		//初始化CoC游戏控件
		this.gameHud=layer.addHudItem(this.hudDef);
		this.game=this.gameHud.getGameMode();
		appEnv.cocGameMode=this.game;
		this.game.homeStage=this;
		this.game.page=page;
		this.game.layer=layer;
		this.game.effects=this.game.getEffects();
		this.game.hudTools=this.game.getHudTools();
		this.game.onGameLoaded=this.onGameLoaded;
		this.objDefs=this.hudDef.game.level.obj_defs;


	};


	//设置navbox的范围
	__Page.vwHomeStage.setNavBoxRangeByScale=function(scale)
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
	__Page.vwHomeStage.onGameLoaded=function()
	{
		var self,game,w,h,css,page;
		self=this.homeStage;
		game=self.game;
		page=self.page;

		//在这里初始化底部文本
		w=Math.floor(page.stateHome.hudBCBox.getW()/2);
		h=page.stateHome.hudBCBox.getH()-page.imgLib.btn_btminfo.h-12;
		css={
			type:"text",css:page.cssLib.textFineMid.createCSS([w,h,0],"Bottom Text (Level XX)",100,20,1,1,1,1,[255,241,211]),
			display:0,fade:1,fade_size:1,fade_alpha:0
		};
		self.hudBtmText=page.stateHome.hudBCBox.appendNewChild(css);

		page.stateHome.onGameLoaded();

		self.level=self.game.level=self.game.getLevel();
		//DBOut("Level: "+self.level);
		self.level.page=self.page;
		self.game.tileMap=self.level.getTileMap();
		self.navBox.setNavItem(self.gameHud);
		self.effects=self.game.effects=self.game.getEffects();

		//确定使用哪个HudTool
		self.toolIdx.selBld=game.hudTools.getHudToolDef("bld_selected");
		self.toolIdx.newBld=game.hudTools.getHudToolDef("bld_getNewPos");

		self.toolIdx.busyBar=game.hudTools.getHudToolDef("bld_busyBar");
		self.toolIdx.mfcBar=game.hudTools.getHudToolDef("bld_mfcBar");
		self.toolIdx.mfcFull=game.hudTools.getHudToolDef("bld_mfcFull");
		self.toolIdx.harvestGold=game.hudTools.getHudToolDef("bld_harvestGold");
		self.toolIdx.harvestGoldFull=game.hudTools.getHudToolDef("bld_harvestGoldFull");
		self.toolIdx.harvestOil=game.hudTools.getHudToolDef("bld_harvestOil");
		self.toolIdx.harvestOilFull=game.hudTools.getHudToolDef("bld_harvestOilFull");
		self.toolIdx.harvestCube=game.hudTools.getHudToolDef("bld_harvestCube");
		self.toolIdx.harvestCubeFull=game.hudTools.getHudToolDef("bld_harvestCubeFull");
		self.toolIdx.harvestGem=game.hudTools.getHudToolDef("bld_harvestGem");
		self.toolIdx.harvestGemFull=game.hudTools.getHudToolDef("bld_harvestGemFull");
		self.toolIdx.rangeMax=game.hudTools.getHudToolDef("bld_range");
		self.toolIdx.rangeMin=game.hudTools.getHudToolDef("bld_range");
		self.toolIdx.resNum=game.hudTools.getHudToolDef("bld_resNum");
		self.toolIdx.resVipNum=game.hudTools.getHudToolDef("bld_resVipNum");
		self.toolIdx.barrackFree=game.hudTools.getHudToolDef("bld_barrackFree");
		self.toolIdx.spellFree=game.hudTools.getHudToolDef("bld_spellFree");
		self.toolIdx.techFree=game.hudTools.getHudToolDef("bld_techFree");
		self.toolIdx.clanFree=game.hudTools.getHudToolDef("bld_clanFree");
		self.toolIdx.prdFull=game.hudTools.getHudToolDef("bld_prdFull");
		self.toolIdx.haveGifts=game.hudTools.getHudToolDef("bld_haveGifts");
		self.toolIdx.haveNotices=game.hudTools.getHudToolDef("bld_haveNotices");
		self.toolIdx.clanFlag=game.hudTools.getHudToolDef("clan_flag");
		self.toolIdx.fakeFlag=game.hudTools.getHudToolDef("fakeflag");
		self.toolIdx.chargeFalg=game.hudTools.getHudToolDef("chargefalg");
		self.toolIdx.emptyFlag=game.hudTools.getHudToolDef("emptyflag");
		self.toolIdx.residenceFalg=game.hudTools.getHudToolDef("residencefalg");


		self.layerIdx.selBldDock=self.game.getLayerByName("sky_shadow");
		self.layerIdx.selBldBody=self.game.getLayerByName("gnd_fxs");

		self.actorIdx.farmer=game.level.getObjDefIdx("chr_Farmer");
		self.actorIdx.worker=game.level.getObjDefIdx("chr_Worker");

		//特效:
		self.eftIdx.bldMove=game.effects.getEffectDef("bld_moving");
		self.eftIdx.bldBadPos=game.effects.getEffectDef("bld_badmoving");
		self.eftIdx.bldStartBld=game.effects.getEffectDef("bld_StartBld");
		self.eftIdx.bldTrainDone=game.effects.getEffectDef("bld_traing_finished");//bld_TrainDone


		//初始化已有的建筑
		self.initCityBlds();
		//启动游戏?
		self.layer.setFrameout(0,self.startGame,self);
		self.isGameLoaded=1;

		//设置所有图都读完了的回调：
		game.onGameTexLoaded=self.onGameTexLoaded;
		//这个是为了兼容旧的不支持“onGameTexLoaded”客户端版本添加的，正式版可以去掉
		self.layer.setTimeout(3000,self.onGameTexLoaded,game);
		self.addWallEffect();
	};

	//---------------------------------------------------------------------------
	//启动当前的CoC游戏引擎逻辑更新
	__Page.vwHomeStage.startGame=function()
	{
		this.game.setGameState(JGXCoCGameMode.STATE_RUNNING);
	};

	__Page.vwHomeStage.onGameTexLoaded=function()
	{
		var self,game,w,h,css,page;
		self=this.homeStage;
		if(self.gameHud.getDisplay())return;
		//取消回调
		this.onGameTexLoaded=null;
		self.gameHud.setDisplay(1);
		self.page.appEnv.layer.setDisplay(1);
		self.page.appEnv.delSearchAni(0);
		self.page.appEnv.addScale(self.gameHud,[0.8,0.8,1],[1,1,1]);

		if(self.page.stateHome.onGameTexLoaded)self.page.stateHome.onGameTexLoaded();

/****************临时添加主城大于3级才显示每日任务****************/
		if(self.page.stateHome.btnDaily && window.aisGame && window.aisGame.curCity && window.aisGame.curCity.aisTownHall)
		{
			DBOut("======= TownHall lv:"+window.aisGame.curCity.aisTownHall.level);
			self.page.stateHome.btnDaily.aisObj=window.aisGame.curCity.aisTownHall;
			window.aisGame.curCity.aisTownHall.addUIView(self.page.stateHome.btnDaily);
			if(window.aisGame.curCity.aisTownHall.level>3)
				self.page.stateHome.btnDaily.setDisplay(1);
		}
/*****************************************************************/
	};

	//---------------------------------------------------------------------------
	//根据当前的AISGame/King/City创建已有的建筑
	__Page.vwHomeStage.initCityBlds=function()
	{
		var city;
		var game,level;
		var list,i,n,m,aisBld,bldDef,defIdx,group;
		var uid,cocBld,bldView,homeBld;
		var actor,pos,page,appEnv;

		page=this.page;
		game=this.game;
		level=game.level;
		appEnv=this.appEnv;
		this.curBldUid=0;
		group=2;//TODO:设置正确的group?
		city=window.aisGame.curCity;
		list=city.buildings;
		n=list.length;
		for(i=0;i<n;i++)
		{
			aisBld=list[i];
			//Add build to stage
			bldDef=aisBld.def.levels[aisBld.level].cocDefName;
			//DBOut("Will add building: "+bldDef);
			defIdx=level.getObjDefIdx(bldDef);
			if(defIdx>=0)
			{
				homeBld=new page.vwHomeBld(appEnv,this);
				homeBld.initByAISBld(aisBld,group);
			}
			else
				DBOut("Can't find COC building: "+bldDef+"/ "+aisBld.def.codeName);
		}

		//添加群众演员:
		m=this.keyBlds.length;
		n=Math.floor(m/3);
		n=n<3?3:n;
		n=n>10?10:n;
		pos=[0,0,0];
		//n=1;
		for(i=0;i<n;i++)
		{
			//TODO: 除去这里关于CoCBld的关联:
			uid=Math.floor(Math.random()*m);
			cocBld=this.keyBlds[uid].cocBld;
			actor=new page.actorFarmer(appEnv,this);
			cocBld.getPos(pos);
			pos[0]+=cocBld.getTileW();
			pos[1]+=cocBld.getTileH()/2;
			actor.addToStage(this.actorIdx.farmer,pos[0],pos[1],0);
			uid=Math.floor(Math.random()*m);
			actor.moveToBldDoor(this.keyBlds[uid].cocBld.homeBld);
			this.allFarmers.push(actor);
		}
	};
	//城墙效果
	__Page.vwHomeStage.addWallEffect=function(idx)
	{
		// this.wallList = this.getWallList();
		this.WallEftState = 0;
		if(this.fo2)
		{
			clearTimeout(this.fo2);
			this.fo2=null;
		}
		if(this.fo1)
		{
			clearTimeout(this.fo1);
			this.fo1=null;
		}
		this.refreshWallList();
		if(!this.wallList)
			return;
		var idx=0;
		var n=this.wallList.length;
		if(n>=10)
			this.showWallEffect(idx)
		DBOut("NNNNN=="+n)
		var self=this;
		if(n>=40)
			this.fo3=setFrameout(n*this.wallEftMoveTime/2,function(){self.showWallEffect(idx);},this);
	};
	__Page.vwHomeStage.showWallEffect=function(idx)
	{
		var list=this.wallList[idx];
		if(!list)
		{DBOut("NO list")
			return;
		}
		if(this.wallList.length<40)
		{
			if(this.fo3)
			{
				clearTimeout(this.fo3);
				this.fo3=null;
			}
		}
		if(this.wallList.length>=10)
			this.WallEftState = 1;
		else
		{
			if(this.fo1)
			{
				clearTimeout(this.fo1);
				this.fo1=null;
			}
			if(this.fo2)
			{
				clearTimeout(this.fo2);
				this.fo2=null;
			}
			this.WallEftState = 0;
			return;
		}
		var i;
		for(i=0;i<list.length;i++)
		{
			if(list[i])
				list[i].showFireEft(list[i].dir,list[i].neighbor);
		}
		var self = this;
		var next = idx+1;
		if(this.wallList[next]&&this.wallList[next].length>0)
		{
			this.fo1 = setFrameout(this.wallEftMoveTime,function(){
				self.showWallEffect(next);
			},this);
		}else
		{
			var time;
			var n = this.wallList.length;
			time=n>20?0:(20-n)*this.wallEftMoveTime;
			this.fo2 = setFrameout(time,function(){
				// self.addWallEffect();
				self.showWallEffect(0);
				},this);
		}
	};
	__Page.vwHomeStage.refreshWallList=function()
	{
		this.wallList = this.getWallList();
	};
	__Page.vwHomeStage.getWallList=function()
	{
		if(this.walls.length==0)
			return;
		var i,bld,pos,bld_x,bld_y,dir,list=[];
		for(i=0;i<this.walls.length;i++)
		{
			bld = this.walls[i];
			pos = [0,0,0];
			bld.cocBld.getPos(pos);
			var idx = pos[0] + pos[1];
			if(!list[idx])
				list[idx] = [];
			dir = "";
			bld_x = this.level.getDockBuildingAt(pos[0]-1,pos[1]);
			bld.neighbor = {};
			if(bld_x && bld_x.isWall())
			{
				dir += "x";
				bld.neighbor.x = bld_x;
			}
			bld_y = this.level.getDockBuildingAt(pos[0],pos[1]-1);
			if(bld_y && bld_y.isWall())
			{
				dir += "y";
				bld.neighbor.y = bld_y;
			}
			bld.dir = dir;
			var eft=bld.cocDef.effect.firex;
			// if(eft)
			// {
				// DBOut(eft=="")
				// if(eft)
				if(eft || eft==0)
					list[idx].push(bld);
				// else if(eft>=0)
					// {
						// list[idx].push(bld);
					// }
			// }
		}
		var n=list.length;
		var tempList=[];
		for(i=0;i<n;i++)
		{
			if(list[i] && list[i].length>0)
			{
				tempList.push(list[i]);
			}
		}
		return tempList;
	};
	//---------------------------------------------------------------------------
	//创建游戏初始化VO对象
	__Page.vwHomeStage.genGameDefVO=function()
	{
		var gameDefVO
		var page=this.page;
		var appEnv=this.appEnv;
		var ext=window.DeviceType=="IPHONE"?"pvr":"png";
		gameDefVO={
			grid_size:72,
			render_core:{
				max_stub:2000,
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
	__Page.vwHomeStage.genLevelDefVO=function()
	{
		var levelVO,list,i,n;
		var page=this.page;
		levelVO={
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
		if(page.stateHome.name=="HomeState")//修正单位的efts_depoly属性:
		{
			list=levelVO.obj_defs;
			n=list.length;
			for(i=0;i<n;i++)
			{
				if(list[i].efts_depoly)list[i].efts_depoly=[];
				if(window.aisGame && window.aisGame.bVisit && list[i]._trigger)
					list[i].trigger=list[i]._trigger;
			}
		}
		else if(page.stateHome.name=="GuideState")//修正战斗单位的combat属性:
		{
			list=levelVO.obj_defs;
			n=list.length;
			for(i=0;i<n;i++)
			{
				if(list[i].def_name=="Test_Tank")
				{
					list[i].hp.recover_speed=0;
				}
				if(list[i].group!="Defense")continue;
				if(list[i].hp)
				{
					//list[i].hp.recover_speed=0;
				}
				if(list[i]._combat)
				{
					list[i].combat=list[i]._combat;
				}
			}
		}
		return levelVO;
	};

	//---------------------------------------------------------------------------
	//回收全部农民：
	__Page.vwHomeStage.callbackActors=function()
	{
		var i,n,actor;
		var list=this.allFarmers;
		n=list.length;
		for(i=0;i<n;i++)
		{
			actor=list[i];
			actor.job=2;//到达目的地后销毁
			actor.moveToBldDoor(this.bldTownHall);
			actor.lgcObj.addBuff(1,0,2.5,10000,0);
		}
		list.splice(0,n);
	}
}

//***************************************************************************
//根据AIS逻辑变化更新
//***************************************************************************
{
	//--------------------------------------------------------------------------
	//于更新建筑物状态
	__Page.vwHomeStage.updateBld=function(homeBld,forceUpdate)
	{
		var aisBld,bldGame,state,game,level,eft,bldGame,cocBld;
		var hudItem,time,fullTime,defIdx,oldState,bldDef,homeBld,idx;

		game=this.game;
		level=this.level;
		cocBld=homeBld.cocBld;
		aisBld=homeBld.aisBld;
		state=0;//无事可做状态
		bldDef=homeBld.aisDef;
		if(aisBld.bCrashed==1)//被摧毁状态
			state=10;
		else if(aisBld.working==1)//正在工作
			state=1;
		else if(aisBld.working==4)//生产停滞
			state=7;
		if(state!=10 && aisBld.constructing==1)//建造中
			state=3;
		if(state!=10 && state==0 && bldDef.mineRes)//矿产，可以增加Harvest状态
		{
			if(aisBld.harvestable==1)//可以收获资源
				state=5;
			else if(aisBld.harvestable==2)//资源已满可以收获资源
				state=6;
		}
	//	DBOut(bldDef.codeName+" Bld's old state: "+homeBld.showState+" vs "+state);
		oldState=homeBld.showState;
		bldGame=homeBld.gameBld;
		if(state!=homeBld.showState || forceUpdate)
		{
			switch(state)
			{
			case 0://stay
				bldGame.setAniAction(0,ActDef.bld.ACT_STAY);//参数1：对应sprite的部位，0身体，1炮台，2底座；参数2：行为
				bldGame.setAniAction(1,ActDef.bld.ACT_STAY);
				if(homeBld.cocBld.isWall())
				{
					bldGame.refreshWallConnection();
				}
				if(bldDef.codeName=="Hangar")
					this.clearSelBld(1);
				break;
			case 1://work
				bldGame.setAniAction(0,ActDef.bld.ACT_WORKING);
				break;
			case 2://ACT_CONSTRUCTING
				bldGame.setAniAction(0,ActDef.bld.ACT_CONSTRUCTING);
				break;
			case 3://build
				bldGame.setAniAction(0,ActDef.bld.ACT_STAY);
				bldGame.setAniAction(1,ActDef.bld.ACT_STAY);
				break;
			case 4://ACT_ATTACK
				bldGame.setAniAction(0,ActDef.bld.ACT_ATTACK);
				break;
			case 5://res2
				bldGame.setAniAction(0,ActDef.bld.ACT_STORE2);
				break;
			case 6://res3
				bldGame.setAniAction(0,ActDef.bld.ACT_STORE3);
				break;
			case 7://stop
				bldGame.setAniAction(0,ActDef.bld.ACT_STAY);
				break;
			case 10://ACT_CRASHED
				bldGame.setAniAction(0,ActDef.bld.ACT_CRASHED);
				bldGame.setAniAction(1,ActDef.bld.ACT_CRASHED);
				break;
			default:
				bldGame.setAniAction(0,ActDef.bld.ACT_STAY);
				bldGame.setAniAction(1,ActDef.bld.ACT_STAY);
				break;
			}
			if(homeBld.stateTool)//移除旧的状态Tool
			{
				game.hudTools.freeTool(homeBld.stateTool);
				homeBld.stateTool=null;
			}
			if(homeBld.tipTool)//移除旧的提示Tool
			{
				//DBOut("Remove tipTool");
				game.hudTools.freeTool(homeBld.tipTool);
				homeBld.tipTool=null;
			}

			if((aisBld.name=="AmmoGun") && window.aisGame.bVisit && !aisBld.curAmmo && state!=3 && state!=10)
			{
				homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.emptyFlag,bldGame);
				homeBld.tipTool.fadeIn(0.2);
			}

			homeBld.showState=state;
			if(window.aisGame && window.aisGame.bVisit && state!=3 && !aisBld.subStorage && !(homeBld.aisDef.codeName=="FakeOilTank" || homeBld.aisDef.codeName=="FakeGoldVault"))return;
			switch(state)
			{
			case 0://空闲状态
				{
					if(window.aisGame.bVisit)break;

					bldGame=homeBld.gameBld;
					idx=-1;
					if(bldDef.codeName=="Barrack")
						idx=this.toolIdx.barrackFree;
					else if(bldDef.codeName=="SpellLab")
					{
						if(!window.aisGame.curCity.spellStorage.getFreeCap())
							idx=this.toolIdx.prdFull;
						else
							idx=this.toolIdx.spellFree;
					}else if(bldDef.codeName=="TechLab")
					{
						if(window.aisGame.king.isTechFull(aisBld.level))
							idx=this.toolIdx.prdFull;
						else
							idx=this.toolIdx.techFree;
					}else if(bldDef.codeName=="ClanBld")
					{

					}
					if(idx!=-1)
					{
						homeBld.tipTool=game.hudTools.addToolOn(idx,bldGame);
						homeBld.tipTool.fadeIn(0.2);
					}
				}
				break;
			case 1://正在工作
				{
					if(window.aisGame.bVisit)break;

					//if("ClanBld"!=bldDef.codeName)
					{
						bldGame=homeBld.gameBld;
						homeBld.stateTool=game.hudTools.addToolOn(this.toolIdx.mfcBar,bldGame);
						homeBld.stateTool.fadeIn(0.2);
						//设置Timer:
						hudItem=homeBld.stateTool.getSubItem(0).getHudItem();
						hudItem.aisBld=aisBld;
						hudItem.update();
						//注册需要随着建筑物更新的对象
						homeBld.stateTool.updateItem=hudItem;
						//调整位置
						hudItem.setPos([18,-21*(bldDef.sizeW+1),0]);
					}
					//else
					if("ClanBld"==bldDef.codeName)
					{
						if(window.aisGame.curCity.allianceId)
						{
							if(!window.aisGame.curCity.clanStorage.getFreeCap())
							{
								homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.prdFull,bldGame);
								homeBld.tipTool.fadeIn(0.2);
							}
						}
					}
				}
				break;
			case 2://工作完成, 等待点击
				break;
			case 3://正在建造
				{
					bldGame=homeBld.gameBld;
					homeBld.stateTool=game.hudTools.addToolOn(this.toolIdx.busyBar,bldGame);
					homeBld.stateTool.fadeIn(0.2);
					//设置Timer:
					fullTime=Math.floor(aisBld.constructTask.getTotalTime());
					time=Math.floor(aisBld.constructTask.getRemainTime());
					hudItem=homeBld.stateTool.getSubItem(0).getHudItem();
					hudItem.setTimer(fullTime,fullTime-time);
					//调整位置
					hudItem.setPos([0,-21*(bldDef.sizeW+1),0]);
					homeBld.hireWorker(oldState!=-2);
					//播放特效:
					if(!homeBld.startBuildEft)
					{
						bldGame.playEffect(this.eftIdx.bldStartBld);
						homeBld.playConstructEft();
					}

					if(window.aisGame && window.aisGame.bVisit)hudItem.setDisplay(0);
				}
				break;
			case 4://建造完成, 等待点击
				break;
			case 5://可以收获资源
				{
					bldGame=homeBld.gameBld;
					if(bldDef.mineRes=="ResGold")
					{
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.harvestGold,bldGame);
					}
					else if(bldDef.mineRes=="ResGem")
					{
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.harvestGem,bldGame);
					}
					else if(bldDef.mineRes=="ResCube")
					{
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.harvestCube,bldGame);
					}
					else
					{
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.harvestOil,bldGame);
					}
					homeBld.tipTool.fadeIn(0.2);
				}
				break;
			case 6://可收获资源已满矿
				{
					bldGame=homeBld.gameBld;
					if(bldDef.mineRes=="ResGold")
					{
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.harvestGoldFull,bldGame);
					}
					else if(bldDef.mineRes=="ResGem")
					{
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.harvestGemFull,bldGame);
					}
					else if(bldDef.mineRes=="ResCube")
					{
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.harvestCubeFull,bldGame);
					}
					else
					{
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.harvestOilFull,bldGame);
					}
					homeBld.tipTool.fadeIn(0.2);
				}
				break;
			case 7://生产停滞
				{
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["TrainStucked"]);
					bldGame=homeBld.gameBld;
					homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.mfcFull,bldGame);
					homeBld.tipTool.fadeIn(0.2);
				}
				break;
			}
			if(this.selBld)
			{
				this.selBld.updateHudLabelText();
				this.selBld.updateHudLabelPos();
			}
		}
		else
		{
			if(homeBld.stateTool && homeBld.stateTool.updateItem)
			{
				homeBld.stateTool.updateItem.update();
			}
		}

		if(bldDef.codeName=="TownHall")
		{
			if(this.page.stateHome.updateNGBtns)this.page.stateHome.updateNGBtns();
		}
		if("Obstacle"==bldDef.groupId)
		{
			homeBld.playSmokeEft();
		}

		if(bldDef.codeName=="TownHall" && state!=3)
		{
			if(homeBld.tipTool)//移除旧的提示Tool
			{
				game.hudTools.freeTool(homeBld.tipTool);
				homeBld.tipTool=null;
			}
			idx=-1;
			if(window.aisGame.curCity.noticeList && window.aisGame.curCity.noticeList.length && !window.aisGame.curCity.noticeList[0].state)
				idx=this.toolIdx.haveNotices;
			else if(window.aisGame.curCity.gifts && window.aisGame.curCity.gifts.length)
				idx=this.toolIdx.haveGifts;
			idx=-1;
			if(idx!=-1){
				homeBld.tipTool=game.hudTools.addToolOn(idx,bldGame);
				homeBld.tipTool.fadeIn(0.2);
			}
		}
		if(bldDef.codeName=="ClanBld" && !window.aisGame.bVisit)
		{
			if(homeBld.flagTool)//移除旧的提示Tool
			{
				game.hudTools.freeTool(homeBld.flagTool);
				homeBld.flagTool=null;
			}
			homeBld.flagTool=game.hudTools.addToolOn(this.toolIdx.clanFlag,bldGame);
			homeBld.flagTool.fadeIn(0.2);
			hudItem=homeBld.flagTool.getSubItem(0).getHudItem();
			hudItem.update();

			if(window.aisGame.curCity.allianceId)
			{
				if(homeBld.tipTool)//移除旧的提示Tool
				{
					game.hudTools.freeTool(homeBld.tipTool);
					homeBld.tipTool=null;
				}
				if(homeBld.showState!=1)
				{
					if(!window.aisGame.curCity.clanStorage.getFreeCap())
						idx=this.toolIdx.prdFull;
					else
						idx=this.toolIdx.clanFree;
					homeBld.tipTool=game.hudTools.addToolOn(idx,bldGame);
					homeBld.tipTool.fadeIn(0.2);
				}
			}
		}

		if(this.selBld==homeBld && homeBld.tipTool)
		{
			DBOut("Hide tip tool");
			homeBld.tipTool.setDisplay(0);
		}

		if(state!=3 && homeBld.startBuildEft)//取消建造中栅栏特效
		{
			this.effects.endEffect(homeBld.startBuildEft,homeBld.startBuildEftTag);
			homeBld.startBuildEft=null;
			if(aisBld.level==0)
			{
				if(homeBld.tipTool)//移除旧的提示Tool
				{
					game.hudTools.freeTool(homeBld.tipTool);
					homeBld.tipTool=null;
				}
			}
		}
		if((homeBld.aisLevel!=aisBld.level)||(oldState==-1 && aisBld.level>0))//建造升级完成
		{
		//	DBOut("********** 建造升级完成: "+aisBld.level);
			if(1==aisBld.level)//新建筑建造完成
			{
				if("MechFactory"==homeBld.aisDef.codeName)
				{
				//	DBOut("aisMacShop="+window.aisGame.curCity.aisMacShop);
					this.page.stateHome.btnBox.setDisplay(1);
				}
			}
			var worker,aisHut;
			if(homeBld==this.selBld && "Wall"!=homeBld.aisDef.codeName)
			{
				this.clearSelBld(1);
			}
			homeBld.freeWorker();
			//升级CoC建筑
			if(aisBld.level>0)
			{
				var cocDefName=bldDef.levels[aisBld.level].cocDefName;
				if(aisBld.fireMode)cocDefName="Alt"+cocDefName;
				defIdx=level.getObjDefIdx(cocDefName);
				this.morphBld(homeBld,defIdx);
				this.updateBld(homeBld,1);
				return;
			}
			else if(aisBld.level==0 && aisBld.deadOut)//建筑被移除:
			{
				homeBld.removeBld();
			}
		}

		//-------------------------------------------------------------------------
		//校军场专用:
		if(aisBld.subStorage)
		{
			if(aisBld.subStorage.mainStore.storeMark=="Unit")
			{
				homeBld.addCampActors(oldState==-2);
				if(homeBld.fullTool){
					game.hudTools.freeTool(homeBld.fullTool);
					homeBld.fullTool=null;
				}
				if(!window.aisGame.curCity.unitStorage.getFreeCap())
				{
					homeBld.fullTool=game.hudTools.addToolOn(this.toolIdx.prdFull,bldGame);
					homeBld.fullTool.fadeIn(0.2);
				}
			}
			else if(aisBld.subStorage.mainStore.storeMark=="Clan")
			{
				DBOut("Update Clan!!");
				homeBld.addClanActors(oldState==-2);
			}
			else if(aisBld.subStorage.mainStore.storeMark=="Fort")
			{
				if(homeBld.tipTool)//移除旧的提示Tool
				{
					game.hudTools.freeTool(homeBld.tipTool);
					homeBld.tipTool=null;
				}
				if(aisBld.level>0 && !window.aisGame.bVisit)
				{
					if(!aisBld.subStorage.getFreeCap())
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.prdFull,bldGame);
					else
						homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.residenceFalg,bldGame);
					homeBld.tipTool.fadeIn(0.2);
				}
			}
			else//资源库
			{
				if(state==10)return;
				bldGame=homeBld.gameBld;
				var fillRate;
				fillRate=aisBld.subStorage.getUsedCap()/aisBld.subStorage.getTotalCap();
				if(fillRate>0.8)
				{
					bldGame.setAniAction(0,ActDef.bld.ACT_STORE3);
				}
				else if(fillRate>0.4)
				{
					bldGame.setAniAction(0,ActDef.bld.ACT_STORE2);
				}
				else
				{
					bldGame.setAniAction(0,ActDef.bld.ACT_STORE1);
				}
			}
		}
		//RGunTower专用
		if(aisBld.name=="AmmoGun")
		{
			if(state==10)return;
			DBOut("======================== maxAmmo="+aisBld.def.levels[aisBld.level].maxAmmo+", curAmmo="+aisBld.curAmmo);
			bldGame=homeBld.gameBld;
			if(!window.aisGame.bVisit)
			{
				if(homeBld.tipTool)
				{
					game.hudTools.freeTool(homeBld.tipTool);
					homeBld.tipTool=null;
				}
				if(aisBld.curAmmo<aisBld.def.levels[aisBld.level].maxAmmo)
				{
					homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.chargeFalg,bldGame);
					homeBld.tipTool.fadeIn(0.2);
				}
			}
			if(aisBld.curAmmo>=aisBld.def.levels[aisBld.level].maxAmmo*0.65)
			{
				bldGame.setAniAction(0,ActDef.bld.ACT_STORE2);
			}
			else
			{
				bldGame.setAniAction(0,ActDef.bld.ACT_STORE1);
			}
		}

		//-------------------------------------------------------------------------
		//Boost专用
		if(bldDef.levels[aisBld.level].boostBuff)
		{
			if(!homeBld.bstEft && aisBld.getBuff(bldDef.levels[aisBld.level].boostBuff))
			{
				//播放特效
//				eft=homeBld.playDefEft("boost");
//				homeBld.bstEft=eft;
//				eft=this.effects.getEffectTag(eft);
//				homeBld.bstEftTag=eft;
				//播放特效
				homeBld.playBoostEft();
			}
			else if(homeBld.bstEft && !aisBld.getBuff(bldDef.levels[aisBld.level].boostBuff))
			{
				//移除特效
				DBOut("End effect: "+homeBld.bstEft);
				this.effects.endEffect(homeBld.bstEft,homeBld.bstEftTag);
				homeBld.bstEft=null;
			}
		}
		if(aisBld.craft)
		{
			if(homeBld.craftMode==2)//维修完成？
			{
				if((!aisBld.working))
					homeBld.setCraftMode(aisBld.craft.state?0:1);//TODO:根据防守模式设定这里的值
			}else{
				if(aisBld.working)
					homeBld.setCraftMode(2);
			}
		}

		if(homeBld.aisDef.codeName=="FakeOilTank" || homeBld.aisDef.codeName=="FakeGoldVault")
		{
			if(aisBld.bCrashed==1)return;
			var def,codeName,storage,blds,num,n,fillRate;
			def=homeBld.aisDef;
			codeName=def.codeName;
			storage=aisGame.curCity.allStorages[def.cityStorage];

			num=window.aisGame.curCity.getValue("numBld"+def.pretend);

			n=storage.getUsedCap()/num;
			fillRate=n/def.levels[aisBld.level].maxstore;
			if(fillRate>0.8)
			{
				bldGame.setAniAction(0,ActDef.bld.ACT_STORE3);
			}
			else if(fillRate>0.4)
			{
				bldGame.setAniAction(0,ActDef.bld.ACT_STORE2);
			}
			else
			{
				bldGame.setAniAction(0,ActDef.bld.ACT_STORE1);
			}

			if(!window.aisGame.bVisit)
			{
				if(homeBld.tipTool)
				{
					game.hudTools.freeTool(homeBld.tipTool);
					homeBld.tipTool=null;
				}
				if(homeBld.showState==3 || aisBld.level>0)
				{
					homeBld.tipTool=game.hudTools.addToolOn(this.toolIdx.fakeFlag,bldGame);
					homeBld.tipTool.fadeIn(0.2);
				}
			}
		}
	};
}

__Page.vwHomeStage.requsetUnit=function(comVO)
{
	if(!this.selBld)return;
	var aisBld=this.selBld.aisBld;
	var city=aisGame.curCity;
	if(!city.allianceId || aisBld.working)return;

	//if(city.vipLevel)
	{
		var defLib=window.aisEnv.defLib.vipPrivilege;
		var def=defLib["vipRequestUnitsWaitTime"];
		if(def && def.levels[city.vipLevel] && def.levels[city.vipLevel].modifyValue)
		{
			comVO.cdRequestTime=def.levels[city.vipLevel].modifyValue*60*1000;
		}
	}

	aisGame.king.execCmd(aisBld,"ClanReinforce",comVO,aisBld);
};

//---------------------------------------------------------------------------
	//装载弹药
	__Page.vwHomeStage.bldAmmoRelod=function()
	{
		var homeBld,aisBld;
		homeBld=this.selBld;
		if(!homeBld || !homeBld.aisBld)
			return;
		aisBld=homeBld.aisBld;

		var cost,num;
		var def=aisBld.def;
		DBOut("Will reload ammo for ammoGun!");
		if(aisBld.constructing)
		{
			DBOut("vwHomeStage.bldAmmoRelod Error 1: building already under building!");
			return;
		}
		if(aisBld.level<1)
		{
			DBOut("vwHomeStage.bldAmmoRelod Error 3, level is not 1!");
			return;
		}
		num=def.levels[aisBld.level].maxAmmo-aisBld.curAmmo;
		num*=def.levels[aisBld.level].res2AmmoRate;
		if(num>0 && num<1)
			num=1;
		else
			num=Math.ceil(num);

		cost={storage:[{store:def.levels[aisBld.level].ammoRes.storage,type:def.levels[aisBld.level].ammoRes.type,num:num}]};
		if(!this.checkCost(cost,1,this.bldAmmoRelod,this))
		{
			return;
		}
		aisGame.king.execCmd(aisBld,"Reload",{},aisBld);
	};
	//弩切换模式
	__Page.vwHomeStage.bldSwitchMode=function()
	{
		var game,level,cocBld,aisBld,bldDef,defIdx,homeBld;
		game=this.game;
		level=this.level;
		homeBld=this.selBld;

		if(!homeBld || !homeBld.aisBld)
			return;

		cocBld=homeBld.cocBld;
		aisBld=homeBld.aisBld;
		bldDef=homeBld.aisDef;

		if(aisBld.constructing)
		{
			DBOut("vwHomeStage.bldAmmoRelod Error 1: building already under building!");
			return;
		}
		if(aisBld.level<1)
		{
			DBOut("vwHomeStage.bldAmmoRelod Error 3, level is not 1!");
			return;
		}
		var defName=bldDef.levels[aisBld.level].cocDefName;
		if(!aisBld.fireMode)defName="Alt"+defName;
		defIdx=level.getObjDefIdx(defName);
		this.morphBld(homeBld,defIdx,1);
		//this.updateBld(homeBld,1);
		aisGame.king.execCmd(aisBld,"SwitchMode",{},aisBld);
	};

	__Page.vwHomeStage.resetClanUnits=function(vo)//[{"codename": "UntMarine", "level": 1, "num": 1}]
	{
		DBOut("***** resetClanUnits *****");
		var store=window.aisGame.curCity.clanStorage;
		var list=store.slots;
		var i, slot, def;
		for(i in list)
		{
			slot=list[i];
			def=slot.def;
			store.takeOut({type:def.codeName,num:slot.num,subType:slot.subType});
		}
		for(i in vo)
		{
			store.putIn({type:vo[i].codename,num:vo[i].num,subType:""+(vo[i].level-1)},null,1);//客户端leve从0开始
		}
	};
	//格纳库防守状态切换
	__Page.vwHomeStage.statusMac=function()
	{
		var game,level,cocBld,aisBld,bldDef,defIdx,homeBld;
		game=this.game;
		level=this.level;
		homeBld=this.selBld;

		if(!homeBld || !homeBld.aisBld)
			return;

		cocBld=homeBld.cocBld;
		aisBld=homeBld.aisBld;
		bldDef=homeBld.aisDef;

		if(aisBld.constructing)
		{
			DBOut("vwHomeStage.bldAmmoRelod Error 1: building already under building!");
			return;
		}
		if(aisBld.level<1)
		{
			DBOut("vwHomeStage.bldAmmoRelod Error 3, level is not 1!");
			return;
		}
		var defName=bldDef.levels[aisBld.level].cocDefName;
		aisGame.king.execCmd(aisBld,"StatusMac",{},aisBld);
		homeBld.setCraftMode(aisBld.craft.state?0:1);
		this.clearSelBld();
	};
	__Page.vwHomeStage.gemFixDoneMac=function()
	{
		var game,level,cocBld,aisBld,bldDef,defIdx,homeBld;
		game=this.game;
		level=this.level;
		homeBld=this.selBld;

		if(!homeBld || !homeBld.aisBld)
			return;

		cocBld=homeBld.cocBld;
		aisBld=homeBld.aisBld;
		bldDef=homeBld.aisDef;

		var time=aisBld.workTask.getRemainTime();
		var gemNum=window.aisGame.king.convertTime2Gem(time);
		var body=aisBld.craft.slots.body;
		var bdef=window.aisEnv.defLib.part[body.type];
		var rate=bdef.levels[body.level].RepairCoefficient;
		gemNum=Math.floor(gemNum*rate);
		var cost={gem:gemNum,storage:[]};
		if(!this.checkCost(cost,1,this.gemFixDoneMac,this))
		{
			return;
		}

		if(aisBld.constructing)
		{
			DBOut("vwHomeStage.bldAmmoRelod Error 1: building already under building!");
			return;
		}
		if(aisBld.level<1)
		{
			DBOut("vwHomeStage.bldAmmoRelod Error 3, level is not 1!");
			return;
		}
		//homeBld.playCraftEft("fixed");
		aisGame.king.execCmd(aisBld,"GemFixDone",{},aisBld);
		this.clearSelBld();
	};

	__Page.vwHomeStage.bldCutConstructTime=function()
	{
		var game,level,cocBld,aisBld,bldDef,defIdx,homeBld;
		game=this.game;
		level=this.level;
		homeBld=this.selBld;

		if(!homeBld || !homeBld.aisBld)
			return;

		cocBld=homeBld.cocBld;
		aisBld=homeBld.aisBld;
		bldDef=homeBld.aisDef;
		if(!aisBld.constructing)
		{
			DBOut("vwHomeStage.bldCutConstructTime Error 1: building already under building!");
			return;
		}

		var store=window.aisGame.curCity.cuttimeStorage;
		if(store && !store.checkTakeOut({store:"CutTime",type:"CutTime",num:aisEnv.defLib.globals["MIN_TOKEN2"]}))
		{
			//资源不够
			return;
		}
		aisGame.king.execCmd(aisBld,"CutConstructTime",{time:aisEnv.defLib.globals["MIN_TOKEN2"]*60*1000},aisBld);
		this.updateBld(homeBld,1);
		this.clearSelBld();
	};

	__Page.vwHomeStage.bldCutConstructTimeByGem=function()
	{
		var game,level,cocBld,aisBld,bldDef,defIdx,homeBld;
		game=this.game;
		level=this.level;
		homeBld=this.selBld;

		if(!homeBld || !homeBld.aisBld)
			return;

		cocBld=homeBld.cocBld;
		aisBld=homeBld.aisBld;
		bldDef=homeBld.aisDef;
		if(!aisBld.constructing)
		{
			DBOut("vwHomeStage.bldCutConstructTime Error 1: building already under building!");
			return;
		}

		var num=window.aisEnv.defLib.globals["TIME_BUTTON_COST_GEM"];
		var cost={gem:num};
		if(!this.checkCost(cost,1,this.bldCutConstructTimeByGem,this))
		{
			return;
		}
		window.aisGame.curCity.timeButtonCoolDown=window.aisGame.king.kingTime()+(window.aisEnv.defLib.globals["TIME_BUTTON_COOLDOWN"]*60*1000);

		aisGame.king.execCmd(aisBld,"CutConstructTimeByGem",{time:aisEnv.defLib.globals["TIME_BUTTON_COST_TIME"]*60*1000,type:"gem",gem:num},aisBld);
		this.updateBld(homeBld,1);
		this.clearSelBld();
	};

	__Page.vwHomeStage.bldResidence=function(comVO)
	{
		var aisBld,homeBld;

		homeBld=this.selBld;
		aisBld=homeBld.aisBld;

		if(aisBld.constructing)
		{
			DBOut("vwHomeStage.bldResidence Error 1: building already under building!");
			return;
		}
		var tlist=[{type:comVO.type,num:comVO.num,store:"Unit"}];
		if(!window.aisGame.curCity.checkTakeOut(tlist))
		{
			return;
		}
		aisGame.king.execCmd(aisBld,"FortAddUnit",comVO,aisBld);
	};

	//障碍物宝箱
	__Page.vwHomeStage.openObsBox=function()
	{
		var aisBld,homeBld;

		homeBld=this.selBld;
		aisBld=homeBld.aisBld;

		var cost={gem:aisBld.openCostGem,storage:[]};
		if(!this.checkCost(cost,1,this.openObsBox,this))
		{
			DBOut("openObsBox err: gem not enough!");
			return 0;
		}
		var url=this.page.genPageURL("ui/dlg/dlg_open_obsbox.jml");
		this.appEnv.openPageDlg(url,this.selBld);
		aisGame.king.execCmd(aisBld,"ObsOpenBox",{},aisBld);
		return 1;
	};
	//钻石秒完申请援兵CD
	__Page.vwHomeStage.gemFinRqstCD=function(aisBld)
	{
		var homeBld,aisBld,boostDef,textLib,time,gemNum;
		if(!aisBld)
		{
			homeBld=this.selBld;
			if(!homeBld || !homeBld.aisBld)
				return;
			aisBld=homeBld.aisBld;
		}
		if(!aisBld)
		{
			return;
		}
		if(!aisBld.working)
			return;
		time=aisBld.workTask.getRemainTime();
		gemNum=aisGame.king.convertTime2Gem(time);

		var city=window.aisGame.curCity;
		//if(city.vipLevel)
		{
			var defLib=window.aisEnv.defLib.vipPrivilege;
			var def=defLib["vipBLDTimeDiscount"];
			if(def && def.levels[city.vipLevel])
			gemNum=Math.round(gemNum*def.levels[city.vipLevel].modifyValue/100);
		}
		gemNum=Math.round(gemNum*window.aisEnv.defLib.globals["CLAN_TIME_GEM_MODFIY"]);

		var cost={gem:gemNum};
		if(!this.checkCost(cost,1,this.gemFinBld,this))
		{
			return;
		}

		textLib=this.appEnv.textLib;
		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:textLib["AskGemFinRqstCD"],info:textLib["AskGemFinRqstCDInfo"](gemNum),
				pmtFunc:this._gemFinRqstCD,pmtObj:this,pmtParam:aisBld
			}
		);
	};

	__Page.vwHomeStage._gemFinRqstCD=function(fin,aisBld)
	{
		if(!fin)
			return;
		if(aisBld)
		{
			var time=aisBld.workTask.getRemainTime();
			var gemNum=aisGame.king.convertTime2Gem(time);

			var comVO={};
			var city=window.aisGame.curCity;
			//if(city.vipLevel)
			{
				var defLib=window.aisEnv.defLib.vipPrivilege;
				var def=defLib["vipBLDTimeDiscount"];
				if(def && def.levels[city.vipLevel])
				{
					gemNum=Math.round(gemNum*def.levels[city.vipLevel].modifyValue/100);
					comVO.gemNum=gemNum;
				}
			}
			comVO.gemNum=Math.round(gemNum*window.aisEnv.defLib.globals["CLAN_TIME_GEM_MODFIY"]);

			aisGame.king.execCmd(aisBld,"GemFinReinforce",comVO,aisBld);
		}
	};

	__Page.vwHomeStage.resetTraps=function(bAll)
	{
		var homeBld,aisBld,boostDef,textLib,time,cost;
		var city=window.aisGame.curCity;

		homeBld=this.selBld;
		if(!homeBld || !homeBld.aisBld)
			return;
		aisBld=homeBld.aisBld;
		if(!aisBld)return;
		if(aisBld.constructing || aisBld.status!=2)return;

		var i,k,bld,cost,res={storage:[{}]},resNum,list=[];
		if(!bAll)
			list.push(aisBld.hashId);
		else
			list=city.crashedTrapsHash;

		resNum=0;
		for(i=0;i<list.length;i++)
		{
			bld=window.aisGame.king.getHashObj(list[i]);
			cost=bld.def.levels[bld.level-1].cost;
			resNum+=cost.storage[0].num;
			if(list[i]==aisBld.hashId)
			{
				res.storage[0].store=cost.storage[0].store;
				res.storage[0].type=cost.storage[0].type;
			}
		}
		res.storage[0].num=resNum;

		if(!this.checkCost(res,1,function(){this.resetTraps(bAll);},this)){
			return;
		}
		aisBld.bCrashed=0;
		homeBld.aisUpdateView(homeBld.aisBld);

		aisGame.king.execCmd(aisBld,"ResetTraps",{repairType:bAll?1:0},aisBld);
		this.clearSelBld();
	};
};
