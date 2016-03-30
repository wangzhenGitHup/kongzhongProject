if(!__Page.vwHomeBld)
{
	//--------------------------------------------------------------------------
	__Page.vwHomeBld=function(appEnv,homeStage)
	{
		if(appEnv)
		{
			this.appEnv=appEnv;
			this.homeStage=homeStage;
			this.page=homeStage.page;
			this.cocDefIdx=-1;
			this.aisDef=null;
			this.cocDef=null;
			this.cocBld=null;
			this.gameBld=null;
			this.aisBld=null;
			this.hudTool=null;
			this.viewId="CoCBldView";
			this.bindedActors=null;
			this.fancyActorTimer=null;
			this.tileW=0;
			this.tileH=0;
			this.coreW=0;
			this.coreH=0;
		}
	};

	__Page.vwHomeBld.prototype=new Object();

	//**************************************************************************
	//初始化/创建/取消创建/升级建筑
	//**************************************************************************
	{
		//--------------------------------------------------------------------------
		//根据AISBld初始化,用于city整体初始化的时候:
		__Page.vwHomeBld.prototype.initByAISBld=function(aisBld,group)
		{
			var home,game,level;
			var uid,cocBld,cocDefName,pos,defIdx,crashIdx;

			home=this.homeStage;
			game=home.game;
			level=game.level;

			//创建CoCBld:
			uid=home.curBldUid++;
			this.bldUID=uid;
			this.aisDef=aisBld.def;
			this.aisLevel=aisBld.level;
			cocDefName=aisBld.def.levels[aisBld.level].cocDefName;
			if(aisBld.fireMode)cocDefName="Alt"+cocDefName
			this.cocDefIdx=defIdx=level.getObjDefIdx(cocDefName);
			this.cocDef=home.objDefs[defIdx];
			this.aisBld=aisBld;
			pos=[aisBld.pos[0],aisBld[1]];

			this.cocBld=cocBld=level.addObjectJS(defIdx,uid,group,aisBld.pos,45);
			this.gameBld=game.lgcObj2GameObj(cocBld);
			this.cocBld.OnTimer=this.rotTurret;

			if(aisBld.status)
			{
				if(window.aisGame && window.aisGame.bVisit)
				{
				}else
					cocBld.setCurHP(0);//破损

				if(this.cocDef && this.cocDef.hp)
				{
					this.gameBld.setAniAction(0,ActDef.bld.ACT_CRASHED);
					this.gameBld.setAniAction(1,ActDef.bld.ACT_CRASHED);
					aisBld.bCrashed=1;
					if(window.aisGame && window.aisGame.bVisit)
					{
					}else
						this.cocBld.addTimerCall(Math.floor(this.cocDef.hp.full/5/this.cocDef.hp.recover_speed)+1,4);//恢复时间改为原来的1/5
				}else if(this.cocDef && this.cocDef.group=="Traps"){
					if(window.aisGame && window.aisGame.bVisit)
						cocBld.setDisplay(0);
					else
						aisBld.bCrashed=1;
				}
			}

			//增加炮塔动画:
			if(this.gameBld.hasTurret() && (!aisGame.guideMode))
			{
				//TODO: 增加炮塔动画
				if(this.homeStage.bldTownHall)
				{
					var ang,dx,dy;
					dx=this.homeStage.bldTownHall.aisBld.pos[0]-this.aisBld.pos[0];
					dy=this.homeStage.bldTownHall.aisBld.pos[1]-this.aisBld.pos[1];
					if(dx || dy)
					{
						ang=Math.atan2(dy,dx);
						ang=(Math.floor(ang/3.1415926535*256)+256)&511;
						this.cocBld.setQDit(ang);
					}
				}
				this.isTurret=1;
				this.cocBld.addTimerCall(200,1);
			}

			this.objGroup=group;

			//增加信息:
			cocBld.homeBld=this;
			cocBld.aisBld=aisBld;
			this.aisLevel=aisBld.level;
			this.showState=-2;
			this.cocDef=home.objDefs[defIdx];
			this.tileW=this.cocDef.tile_w;
			this.tileH=this.cocDef.tile_h;
			this.coreW=this.cocDef.core_w;
			this.coreH=this.cocDef.core_h;
			this.isWall=this.cocDef.wall?1:0;
			if(!this.isWall)
			{
				this.keyBldIdx=home.keyBlds.length;
				home.keyBlds.push(this);
			}else
			{
				this.wallIdx=home.walls.length;
				home.walls.push(this);
				// if(1==home.walls.length)
				// var eft = this.cocDef.effect.firex;
				// if(eft || eft==0)
				// {
					// if(!home.WallEftState)
						// home.addWallEffect();
					// else
						// home.refreshWallList();
				// }
			}
			if(this.aisDef.codeName=="TownHall")
			{
				this.homeStage.bldTownHall=this;
				aisGame.curCity.aisTownHall=aisBld;
			}

			//TODO: 是否在这里初始化群众演员?
			aisBld.cocBld=cocBld;
			aisBld.homeBld=this;
			aisBld.addUIView(this);
			this.addBldUIView();

			if(aisBld.craft)
			{
				var body,leg,mode;
				body=aisEnv.defLib.part[aisBld.craft.slots.body.type];
				leg=aisEnv.defLib.part[aisBld.craft.slots.leg.type];
				if(aisBld.working)
					mode=2;
				else if(aisBld.craft.state)
					mode=0;
				else
					mode=1;
				this.addCraft(body.coc_ani,leg.coc_ani,mode,aisBld.craft.slots.body.level,aisBld.craft.slots.leg.level);
			}

		};
		__Page.vwHomeBld.prototype.addBldUIView=function()
		{
			if(//this.aisDef.codeName=="Barrack" || this.aisDef.codeName=="TechLab" ||
			 this.aisDef.codeName=="Camp")
			{
				aisGame.curCity.unitStorage.addUIView(this,this.aisBld.hashId);
			}
			if(this.aisDef.codeName=="ClanBld")
				aisGame.curCity.clanStorage.addUIView(this);
			if(this.aisDef.codeName=="SpellLab")
				aisGame.curCity.spellStorage.addUIView(this);
			//if(this.aisDef.codeName=="TownHall")
			//	aisGame.curCity.addUIView(this);
		};
		//--------------------------------------------------------------------------
		//根据Def新建CoCBld, 还未绑定初始化,用于新建建筑:
		__Page.vwHomeBld.prototype.initNewBld=function(defIdx,x,y,group,uid)
		{
			var home,game,level;
			var cocBld,objDef;
			var bldGame,toolItem,w;

			home=this.homeStage;
			game=home.game;
			level=game.level;

			this.bldUID=uid;
			this.cocDefIdx=defIdx;
			this.cocDef=objDef=home.objDefs[defIdx];
			this.tileW=this.cocDef.tile_w;
			this.tileH=this.cocDef.tile_h;
			this.coreW=this.cocDef.core_w;
			this.coreH=this.cocDef.core_h;
			this.isWall=this.cocDef.wall?1:0;
			this.aisDef=window.aisEnv.defLib.bld[objDef.aisCodeName];
			this.aisBld=null;
			this.aisLevel=0;

			this.cocBld=cocBld=level.aboutAddObjectJS(defIdx,uid,group,[x,y,0],45);
			this.cocBld.OnTimer=this.rotTurret;
			this.gameBld=bldGame=game.lgcObj2GameObj(cocBld);
			cocBld.homeBld=this;
			this.objGroup=group;
			//TODO: 确定是否可以移动
			this.canMove=1;

			if(this.gameBld.hasTurret() && (!aisGame.guideMode))
			{
				//TODO: 增加炮塔动画
				if(this.homeStage.bldTownHall)
				{
					var ang,dx,dy;
					dx=this.homeStage.bldTownHall.aisBld.pos[0]-x;
					dy=this.homeStage.bldTownHall.aisBld.pos[1]-y;
					if(dx || dy)
					{
						ang=Math.atan2(dy,dx);
						ang=(Math.floor(ang/3.1415926535*256)+256)&511;
						this.cocBld.setQDit(ang);
					}
				}
				this.isTurret=1;
				this.cocBld.addTimerCall(200,1);
			}

			//TODO: 增加Tool!
			if(this.aisBld && this.aisBld.def.codeName!="Hangar")
				bldGame.setAniLayer(1,home.layerIdx.selBldBody);
			//为当前选中的建筑增加HudTool
			this.hudTool=game.hudTools.addToolOn(home.toolIdx.newBld,bldGame);
			toolItem=this.hudTool.getSubItem(0);
			toolItem.setDisplay(0);

			w=this.tileW/2;
			toolItem=this.hudTool.getSubItem(1);
			toolItem.setOffset([-w,0,0]);

			toolItem=this.hudTool.getSubItem(2);
			toolItem.setOffset([0,-w,0]);

			toolItem=this.hudTool.getSubItem(3);
			toolItem.setOffset([w,0,0]);

			toolItem=this.hudTool.getSubItem(4);
			toolItem.setOffset([0,w,0]);

			home.newPosBld=this;
			this.updateHudLabelText();
			this.updateHudPad();
			this.updateHudLabelPos();
		};

		//--------------------------------------------------------------------------
		//确认建造新建筑
		__Page.vwHomeBld.prototype.confirmNewBld=function()
		{
			var page,home,game,level,city;
			var cocBld,pos,defName,aisBld;

			home=this.homeStage;
			game=home.game;
			level=game.level;
			city=aisGame.curCity;
			page=home.page;

			cocBld=this.cocBld;
			//将建筑物放进TileMap里, 从而可以影响其它寻径等
			game.tileMap.endDrag(cocBld);

			//向AISGame发送建造建筑物的消息
			pos=[0,0,0];
			cocBld.getPos(pos);
			defName=this.cocDef.aisCodeName;
			if(!this.isWall)
			{
				this.keyBldIdx=home.keyBlds.length;
				home.keyBlds.push(this);
			}else
			{
				this.wallIdx=home.walls.length;
				home.walls.push(this);
				var eft = this.cocDef.effect.firex;
				// if(!(eft<0))
				if(eft || eft==0)
				{
					if(!home.WallEftState)
						home.addWallEffect();
					else
						home.refreshWallList();
				}
			}

			if(this.giftId)
			{
				window.aisGame.king.execCmd(aisGame.curCity,"NewBuilding",{def:defName,x:pos[0],y:pos[1],noNeedCost:1,giftId:this.giftId},aisGame.curCity);
				city.com_GiftUses({giftId:this.giftId});
			}else{
				window.aisGame.king.execCmd(aisGame.curCity,"NewBuilding",{def:defName,x:pos[0],y:pos[1],giftId:-1},aisGame.curCity);
			}

			aisBld=window.aisGame.curCity.getBuilding(pos[0],pos[1]);
			DBOut("+++++aisBld="+aisBld+" pos:"+pos);
			cocBld.aisBld=aisBld;
			this.aisLevel=aisBld.level;
			this.showState=-1;
			aisBld.cocBld=cocBld;
			aisBld.homeBld=this;
			this.aisBld=aisBld;
			aisBld.addUIView(this);
			this.addBldUIView();
		};

		//-------------------------------------------------------------------------
		//取消新建筑,貌似没啥可写的...
		__Page.vwHomeBld.prototype.abortNewBld=function()
		{
			var home=this.homeStage;
			var game=home.game;
			if(this.hudTool)
			{
				this.hudTool.fadeOut(0.2,1);
				this.hudTool=null;
			}
			if(this.tipTool)
			{
				this.tipTool.fadeIn(0.5);
			}
			if(this.fullTool)
			{
				game.hudTools.freeTool(this.fullTool);
				this.fullTool=null;
			}
			if(this.flagTool)
			{
				game.hudTools.freeTool(this.flagTool);
				this.flagTool=null;
			}
			if(this.cocBld)
			{
				this.cocBld.signAsDead();
				this.cocBld.deadOut=1;
			}
			this.cocDefIdx=-1;
			this.aisDef=null;
			this.cocDef=null;
			this.cocBld=null;
			this.gameBld=null;
			this.aisBld=null;
			this.aisLevel=0;
			this.hudTool=null;
			this.deadOut=-1;
		};

		//-------------------------------------------------------------------------
		//改变当前建筑,通常是因为建筑升级导致
		__Page.vwHomeBld.prototype.morphBld=function(newDefIdx,bSwitchMode)
		{
			var home,game,level,cocBld,eft,bldGame;
			var pos,level,uid,group,aisBld,aisLevel,bldView,list,i,n;

			home=this.homeStage;
			game=home.game;
			level=game.level;
			cocBld=this.cocBld;

			//记录旧建筑信息
			pos=[0,0,0];
			uid=this.bldUID;
			group=this.objGroup;
			cocBld.getPos(pos);
			cocBld.deadOut=1;
			game.tileMap.startDrag(cocBld);
			aisBld=this.aisBld;
			aisLevel=this.aisLevel;

			if(this.tipTool)
			{
				game.hudTools.freeTool(this.tipTool);
				this.tipTool=null;
			}
			if(this.fullTool)
			{
				game.hudTools.freeTool(this.fullTool);
				this.fullTool=null;
			}
			if(this.flagTool)
			{
				game.hudTools.freeTool(this.flagTool);
				this.flagTool=null;
			}

			//消除旧cocBld
			cocBld.signAsDead();

			//创建新cocBld
			cocBld=level.addObjectJS(newDefIdx,uid,group,pos,45);
			this.cocBld=cocBld;
			this.gameBld=game.lgcObj2GameObj(cocBld);
			cocBld.homeBld=this;
			cocBld.aisBld=aisBld;
			aisBld.cocBld=cocBld;
			this.cocDefIdx=newDefIdx;
			this.cocDef=objDef=home.objDefs[newDefIdx];
			//这个addUIView将通知UI建筑升级/建造完成
			this.aisLevel=aisBld.level;
			aisBld.addUIView(this);
			this.cocBld.OnTimer=this.rotTurret;

			if(this.gameBld.hasTurret() && (!aisGame.guideMode))
			{
				//TODO: 增加炮塔动画
				if(this.homeStage.bldTownHall)
				{
					var ang,dx,dy;
					dx=this.homeStage.bldTownHall.aisBld.pos[0]-this.aisBld.pos[0];
					dy=this.homeStage.bldTownHall.aisBld.pos[1]-this.aisBld.pos[1];
					if(dx || dy)
					{
						ang=Math.atan2(dy,dx);
						ang=(Math.floor(ang/3.1415926535*256)+256)&511;
						this.cocBld.setQDit(ang);
					}
				}
				this.isTurret=1;
				this.cocBld.addTimerCall(200,1);
			}
			if(this.cocDef.wall)
				{
					var eft = this.cocDef.effect.firex;
					if(eft || eft==0)
					{
						if(!this.homeStage.WallEftState)
							this.homeStage.addWallEffect();
						else
							this.homeStage.refreshWallList();
					}
				}
			this.playDefEft(bSwitchMode?"switchmode":"upgrade");
		};

		//-------------------------------------------------------------------------
		//改变当前建筑,通常是因为建筑升级导致
		__Page.vwHomeBld.prototype.removeBld=function()
		{
			var home,game,level,cocBld,bldGame;
			var keyid,wallid,eft,list,i,n;

			home=this.homeStage;
			game=home.game;
			level=game.level;
			cocBld=this.cocBld;
			cocBld.deadOut=1;
			game.tileMap.startDrag(cocBld);
			keyid=this.keyBldIdx;
			if(keyid>=0)
			{
				list=home.keyBlds;
				n=list.length;
				for(i=keyid;i<n;i++)
				{
					list[i].keyBldIdx--;
				}
				list.splice(keyid,1);
			}
			wallid=this.wallIdx;
			if(wallid>=0)
			{
				list=home.walls;
				n=list.length;
				for(i=wallid;i<n;i++)
				{
					list[i].wallIdx--;
				}
				list.splice(wallid,1);
			}
			cocBld.signAsDead();
			this.playDefEft("remove");
		};
	}

	//**************************************************************************
	//更新建筑Hud
	//**************************************************************************
	{
		//在建筑上播放一个def里的特效
		__Page.vwHomeBld.prototype.playDefEft=function(eftName)
		{
			var eft;
			eft=this.cocDef.effect[eftName];
			if(!(eft<0))
			{
				// DBOut("Will play effect: "+eft);
				if(!(eft>=0))
				{
					eft=this.homeStage.game.effects.getEffectDef(eft);
					this.cocDef.effect[eftName]=eft;
				}
				if(eft>=0)
				{
					return this.gameBld.playEffect(eft);
				}
			}
			return 0;
		};

		//在建筑的坐标上播放一个def里的特效
		__Page.vwHomeBld.prototype.playPosDefEft=function(eftName)
		{
			var eft;
			eft=this.cocDef.effect[eftName];
			if(!(eft<0))
			{
				if(!(eft>=0))
				{
					eft=this.homeStage.game.effects.getEffectDef(eft);
					this.cocDef.effect[eftName]=eft;
				}
				if(eft>=0)
				{
					return this.homeStage.game.effects.addEffect(eft,this.aisBld.pos,this.aisBld.pos);
				}
			}
			return 0;
		};

		__Page.vwHomeBld.prototype.playCraftEft=function(eftName)
		{
			var eft;
			var craft;
			craft=this.craftObj;
			if(!craft)
				return -1;
			eft=craft.cocDef.effect[eftName];
			if(!(eft<0))
			{
				if(!(eft>=0))
				{
					eft=this.homeStage.game.effects.getEffectDef(eft);
					craft.cocDef.effect[eftName]=eft;
				}
				if(eft>=0)
				{
					return craft.cocObj.playEffect(eft);
				}
			}
			return -1;
		};

		__Page.vwHomeBld.prototype.playCraftPosEft=function(eftName)
		{
			var eft;
			var craft,pos=[0,0,0];
			craft=this.craftObj;
			if(!craft)
				return -1;
			eft=craft.cocDef.effect[eftName];
			if(!(eft<0))
			{
				if(!(eft>=0))
				{
					eft=this.homeStage.game.effects.getEffectDef(eft);
					craft.cocDef.effect[eftName]=eft;
				}
				if(eft>=0)
				{
					craft.lgcObj.getPos(pos);
					return this.homeStage.game.effects.addEffect(eft,pos,pos);
				}
			}
			return -1;
		};

		__Page.vwHomeBld.prototype.updateTurretDit=function(x,y)
		{
			if(!this.isTurret)
				return;
			if(this.homeStage.bldTownHall)
			{
				var ang,dx,dy;
				dx=this.homeStage.bldTownHall.aisBld.pos[0]-x;
				dy=this.homeStage.bldTownHall.aisBld.pos[1]-y;
				if(dx || dy)
				{
					ang=Math.atan2(dy,dx);
					ang=(Math.floor(ang/3.1415926535*256)+256)&511;
					this.cocBld.setQDit(ang);
				}
			}
		};

		__Page.vwHomeBld.prototype.rotTurret=function(tag)
		{
			switch(tag)
			{
			case 0:
				{
					return 0;
				}
			case 1:
				{
					this.homeBld.gameBld.rotTurretTo((Math.random()-0.5)*3.1415926*0.7);
					this.addTimerCall(200+Math.floor(Math.random()*200),1);
					return 0;
				}
			case 2:
				{
					if(this.homeBld.startBuildEft)
					{
						this.homeBld.playDefEft("building");
						this.addTimerCall(400+Math.floor(Math.random()*50),2);
					}
					return 0;
				}
			case 3:
				{
					if(this.homeBld.bstEft)
					{
						this.homeBld.playDefEft("boosting");
						this.addTimerCall(300+Math.floor(Math.random()*50),3);
					}
					return 0;
				}
			case 4://从废墟状态恢复
				{
					this.homeBld.aisBld.bCrashed=0;
					this.homeBld.aisUpdateView(this.homeBld.aisBld);
					return 0;
				}
			case 5://障碍物的特效，bld对象清除时，timerCall会自动撤销
				{
//					var idx=this.homeBld.homeStage.game.effects.getEffectDef("bld_smoke");
//					this.homeBld.gameBld.playEffect(idx);
					this.homeBld.playDefEft("smoke");
					this.addTimerCall(300+Math.floor(Math.random()*200),5);
					return 0;
				}
			case 6://机甲维修
				{
					if(this.homeBld.aisBld.craft && this.homeBld.craftMode==2)
					{
						this.homeBld.playCraftPosEft("fix");
						this.addTimerCall(100+Math.floor(Math.random()*50),6);
						return 0;
					}
					this.homeBld.playCraftPosEft("fixed");
				}
			}
		};

		//收取资源
		__Page.vwHomeBld.prototype.getRes=function()
		{
			if(window.aisGame && window.aisGame.bVisit)return;
			var king,city,eft,aisBld,num,maxNum,vo,bldGame,home,game,tool,toolItem,com,toolHud;

			home=this.homeStage;
			game=home.game;
			king=aisGame.king;
			city=window.aisGame.curCity;
			aisBld=this.aisBld;

			vo=aisBld.isHarvestOverload();
			if(vo)
			{
				//警告玩家仓库容量不够
				DBOut("Warning: harvest overload: "+vo.gap);
				//TODO: 改为字符串列表模式:
				this.appEnv.stateLogs.showLog(this.page.appEnv.textLib.NotEnoughStorage);
			}

			num=aisBld.getValue("mineCurNum");
			maxNum=aisBld.getValue("mineMaxNum");

			var critRate=0;
			if(this.aisDef.groupId !="DiamondMine")
			{
				var rdm;
				var defLib=window.aisEnv.defLib.vipPrivilege;
				var def=defLib["vipResCrit"].levels[city.vipLevel];
				if(def)
				{
					rdm=Math.random()*100;
					if(rdm<=def.modifyValueEx)
						critRate=def.modifyValue;
				}
			}

			com={critRate:critRate};
			king.execCmd(this.aisBld,"Harvest",com,this.aisBld);

			bldGame=this.gameBld;

			//添加显示文字的tool:
			tool=game.hudTools.addToolOn(home.toolIdx.resNum,bldGame);
			toolItem=tool.getSubItem(0);
			toolHud=toolItem.getHudItem();
			if(critRate)
			{
				toolHud._setText(""+(com.harvestNum-com.critNum));
			}else
				toolHud._setText(""+com.harvestNum);
			//tool.fadeOut(0.1,1);
			//this.appEnv.hudOut(toolHud,20);
			toolHud.startAniEx([0,-100,0],1.5,1,10,0);
			toolHud.tool=tool;
			toolHud.onAniDone=function()
			{
				this.fadeOut(20,0);
				this.tool.fadeOut(0.1,1);
			};

			//播放特效
			eft=this.cocDef.effect.getRes;
			if(!(eft<0))
			{
				if(!(eft>=0))
				{
					eft=this.homeStage.game.effects.getEffectDef(eft);
					this.cocDef.effect.getRes=eft;
				}
				if(eft>=0)
				{
					if(aisBld.def.mineRes=="ResGem")
					{
						if(num==1)
							bldGame.playEffect(eft);
						else
							bldGame.playEffect(eft+1);
					}else if(num<=maxNum*0.25)
					{
						bldGame.playEffect(eft);
					}
					else if(num<=maxNum*0.75)
					{
						bldGame.playEffect(eft+1);
					}
					else
					{
						bldGame.playEffect(eft+2);
					}
				}
			}

			if(critRate)
			{
				tool=game.hudTools.addToolOn(home.toolIdx.resVipNum,bldGame);
				toolItem=tool.getSubItem(0);
				toolHud=toolItem.getHudItem();
				toolHud._setText("+"+com.critNum);
				toolHud.startAniEx([0,-60,0],1.5,1,10,0);
				toolHud.tool=tool;
				toolHud.onAniDone=function()
				{
					this.fadeOut(22,0);
					this.tool.fadeOut(0.1,1);
				};
				eft=this.homeStage.game.effects.getEffectDef("bld_getresource_cri");
				if(eft>=0)bldGame.playEffect(eft);
			}
		};

		//升级
		__Page.vwHomeBld.prototype.upgrade=function()
		{
			var king,aisBld,eft,bldGame,buffCodeName;
			king=aisGame.king;
			aisBld=this.aisBld;

			//取消加速Buff:
			buffCodeName=this.aisDef.levels[this.aisBld.level].boostBuff;
			if(buffCodeName && aisBld.getBuff(buffCodeName))
			{
				king.execCmd(aisBld,"RemoveBuff",{codeName:buffCodeName},aisBld);
			}
			king.execCmd(aisBld,"Upgrade",{},aisBld);
		};

		__Page.vwHomeBld.prototype.abortConstuction=function()
		{
			var king,aisBld,home,keyid,wallid,list,i,n;
			king=aisGame.king;
			home=this.homeStage;
			aisBld=this.aisBld;
			if(aisBld.constructing)
			{
				DBOut("Will send stop constructiong command!!");
				king.execCmd(aisBld,"AbortConstruct",{},aisBld);
			}
			keyid=this.keyBldIdx;
			if(keyid>=0)
			{
				list=home.keyBlds;
				n=list.length;
				for(i=keyid;i<n;i++)
				{
					list[i].keyBldIdx--;
				}
				list.splice(keyid,1);
			}
			wallid=this.wallIdx;
			if(wallid>=0)
			{
				list=home.walls;
				n=list.length;
				for(i=wallid;i<n;i++)
				{
					list[i].wallIdx--;
				}
				list.splice(wallid,1);
			}
		};

		__Page.vwHomeBld.prototype.playConstructEft=function()
		{
			var eft=this.playDefEft("startBuild");
			this.startBuildEft=eft;
			eft=this.homeStage.effects.getEffectTag(eft);
			this.startBuildEftTag=eft;
			this.playDefEft("building");
			this.cocBld.addTimerCall(10,2);
		};
		__Page.vwHomeBld.prototype.playBoostEft=function()
		{
			var eft=this.playDefEft("boost");
			this.bstEft=eft;
			eft=this.homeStage.effects.getEffectTag(eft);
			this.bstEftTag=eft;
			this.playDefEft("boosting");
			this.cocBld.addTimerCall(10,3);
		};
		__Page.vwHomeBld.prototype.playSmokeEft=function()
		{
			this.cocBld.addTimerCall(Math.floor(Math.random()*300),5);
		};
		//城墙喷火效果
		__Page.vwHomeBld.prototype.showFireEft=function(dir,neighbor)
		{
			if(!dir)
				return;
			if(this.cocBld.isSelected)
				return;
			if("x"==dir)
			{
				if(neighbor.x && neighbor.x.isSelected)
					return;
				else
					this.playDefEft("firex");
			}else if("y"==dir)
			{
				if(neighbor.y && neighbor.y.isSelected)
					return;
				else
					this.playDefEft("firey");
			}else
			{
				if(neighbor.x && neighbor.x.isSelected)
					this.playDefEft("firey");
				else if(neighbor.y && neighbor.y.isSelected)
					this.playDefEft("firex");
				else
					this.playDefEft("firexy");
			}
				// this.playDefEft("fire"+dir);
		};
		//建筑被选择
		__Page.vwHomeBld.prototype.selectBld=function(canMov)
		{
			var home,game,level,eft;
			var bldGame,cocBld,tool,pos,toolItem;

			home=this.homeStage;
			game=home.game;
			level=game.level;
			cocBld=this.cocBld;

			if(canMov)//可以选择
			{
				bldGame=this.gameBld;//获取与LgcGameObject对应的GameObject
				//bldGame.setAniLayer(0,home.layerIdx.selBldDock);
				if(this.aisBld.def.codeName!="Hangar")
					bldGame.setAniLayer(1,home.layerIdx.selBldBody);
				bldGame.setColorFlash(1,0,0,0,76);
				this.cocBld.isSelected = 1;

				//为当前选中的建筑增加HudTool
				this.hudTool=tool=game.hudTools.addToolOn(home.toolIdx.selBld,bldGame);
				this.hudTool.fadeIn(0.2);

				this.updateHudLabelPos();
				this.updateHudLabelText();

				//播放选中特效:
				this.playDefEft("select");
				if(this.tipTool)
				{
					//DBOut("Hide Tip Tool");
					this.tipTool.setDisplay(0);
				}

				if(canMov==1)//可以移动
				{
					toolItem=tool.getSubItem(0);
					toolItem.setDisplay(0);

					toolItem=tool.getSubItem(1);
					toolItem.setOffset([-this.tileW/2,0,0]);

					toolItem=tool.getSubItem(2);
					toolItem.setOffset([0,-this.tileW/2,0]);

					toolItem=tool.getSubItem(3);
					toolItem.setOffset([this.tileW/2,0,0]);

					toolItem=tool.getSubItem(4);
					toolItem.setOffset([0,this.tileW/2,0]);

					this.canMove=1;
					pos=[0,0,0];
					cocBld.getPos(pos);
					this.oldGoodX=pos[0];
					this.oldGoodY=pos[1];
				}
				else
				{
					toolItem=tool.getSubItem(0);
					toolItem.setDisplay(0);
					toolItem=tool.getSubItem(1);
					toolItem.setDisplay(0);
					toolItem=tool.getSubItem(2);
					toolItem.setDisplay(0);
					toolItem=tool.getSubItem(3);
					toolItem.setDisplay(0);
					toolItem=tool.getSubItem(4);
					toolItem.setDisplay(0);

					this.canMove=0;
					pos=[0,0,0];
					cocBld.getPos(pos);
					this.oldGoodX=pos[0];
					this.oldGoodY=pos[1];
				}
				//添加射程Tool:
				//DBOut("Combat:"+this.cocDef._combat+", "+this.cocDef._combat.attack_range_max);
				var combatStr="_combat";
				if(this.cocDef["_empower"])
					combatStr="_empower";
				else if(this.cocDef["_multi_target"])
					combatStr="_multi_target";
				var combat=this.cocDef[combatStr];
				if(combat && combat.attack_range_max)
				{
					this.hudRangeMax=tool=game.hudTools.addToolOn(home.toolIdx.rangeMax,bldGame);
					this.hudRangeMax.fadeIn(0.2);
					toolItem=tool.getSubItem(0).getHudItem();
					toolItem.setW(combat.attack_range_max*56*2);
					toolItem.setH(combat.attack_range_max*42*2);
				//	toolItem.setColor([128,255,128,128]);
					toolItem.setColor([255,255,255,128]);
				}
				if(combat && combat.attack_range_min)
				{
					this.hudRangeMin=tool=game.hudTools.addToolOn(home.toolIdx.rangeMax,bldGame);
					this.hudRangeMin.fadeIn(0.2);
					toolItem=tool.getSubItem(0).getHudItem();
					toolItem.setW(combat.attack_range_min*56*2);
					toolItem.setH(combat.attack_range_min*42*2);
					toolItem.setColor([255,0,0,128]);
				}
				if(this.cocDef.bunker && this.cocDef.bunker.sight)
				{
					this.hudRangeMax=tool=game.hudTools.addToolOn(home.toolIdx.rangeMax,bldGame);
					this.hudRangeMax.fadeIn(0.2);
					toolItem=tool.getSubItem(0).getHudItem();
					toolItem.setW(this.cocDef.bunker.sight*56*2);
					toolItem.setH(this.cocDef.bunker.sight*42*2);
				//	toolItem.setColor([128,255,128,128]);
					toolItem.setColor([255,255,255,128]);
				}
			}
		};

		__Page.vwHomeBld.prototype.multiSelectBld=function(dx,dy)
		{
			var home,game,level,eft;
			var bldGame,cocBld,tool,pos,toolItem;

			home=this.homeStage;
			game=home.game;
			level=game.level;
			cocBld=this.cocBld;

			this.multiDx=dx;
			this.multiDy=dy;

			bldGame=this.gameBld;//获取与LgcGameObject对应的GameObject
			//bldGame.setAniLayer(0,home.layerIdx.selBldDock);
			if(this.aisBld.def.codeName!="Hangar")
				bldGame.setAniLayer(1,home.layerIdx.selBldBody);
			bldGame.setColorFlash(1,255,255,180,128);
			this.cocBld.isSelected = 1;

			//为当前选中的建筑增加HudTool
			this.hudTool=tool=game.hudTools.addToolOn(home.toolIdx.selBld,bldGame);
			this.hudTool.fadeIn(0.2);

			toolItem=tool.getSubItem(0);
			toolItem.setDisplay(1);
			toolItem=tool.getSubItem(1);
			toolItem.setDisplay(0);
			toolItem=tool.getSubItem(2);
			toolItem.setDisplay(0);
			toolItem=tool.getSubItem(3);
			toolItem.setDisplay(0);
			toolItem=tool.getSubItem(4);
			toolItem.setDisplay(0);
			toolItem=this.hudTool.getSubItem(5);
			toolItem.setDisplay(0);

			this.updateHudPad(1,0);

			pos=[0,0,0];
			cocBld.getPos(pos);
			this.oldGoodX=pos[0];
			this.oldGoodY=pos[1];
		};

		//取消当前建筑的选择
		__Page.vwHomeBld.prototype.deselectBld=function()
		{
			var cocBld,bldGame;
			cocBld=this.cocBld;
			if(this.hudTool)
			{
				this.hudTool.fadeOut(0.2,1);
				this.hudTool=null;
			}
			if(this.hudRangeMax)
			{
				this.hudRangeMax.fadeOut(0.3,1);
				this.hudRangeMax=null;
			}
			if(this.hudRangeMin)
			{
				this.hudRangeMin.fadeOut(0.3,1);
				this.hudRangeMin=null;
			}
			if(cocBld)
			{
				bldGame=this.gameBld;//获取与LgcGameObject对应的GameObject
				bldGame.restoreAniLayer(1);
				bldGame.setFlash(0);
				this.cocBld.isSelected = 0;
				if(this.isWall)
				{
					var eft = this.cocDef.effect.firex;

					if(eft || eft==0)
					{
						if(!this.homeStage.WallEftState)
							this.homeStage.addWallEffect();
						else
							this.homeStage.refreshWallList();
					}
				}
				if(this.tipTool)
					this.tipTool.fadeIn(0.5);
			}
		};

		//-------------------------------------------------------------------------
		//更新HudTool的文本:
		__Page.vwHomeBld.prototype.updateHudLabelText=function()
		{
			var home;
			var toolItem;
			var def,level;

			home=this.homeStage;

			//设置名称/等级位置:
			if(this.hudTool)
			{
				def=this.aisDef;
				if(window.aisGame.bVisit && (def.codeName=="FakeGoldVault" || def.codeName=="FakeOilTank"))
				{
					def=window.aisEnv.defLib.bld[def.pretend];
				}

				toolItem=this.hudTool.getSubItem(5);
				if(this.aisBld)
				{
					level=this.aisBld.level;
					if(def.createFunc=="aisDecoBld" || def.createFunc=="aisBldWorkerHut")
					{
						toolItem.getHudItem().setText(def.name,"");
					}else if(level>0)
					{
						toolItem.getHudItem().setText(def.name,this.appEnv.textLib["Level Text"](level));
					}
					else
					{
						toolItem.getHudItem().setText(def.name,this.appEnv.textLib["Constructing"]);
					}
				}
				else
				{
					toolItem.getHudItem().setText(def.name,this.appEnv.textLib["Choose position"]);
				}
			}
		};

		//-------------------------------------------------------------------------
		//更新HudTool的建筑物底板:
		__Page.vwHomeBld.prototype.updateHudLabelPos=function()
		{
			var toolItem;
			var home=this.homeStage;
			//设置名称/等级位置:
			if(this.hudTool)
			{
				toolItem=this.hudTool.getSubItem(5);
				if(this.stateTool)
				{
					toolItem.getHudItem().setPos([0,-21*(this.tileW+1)-40,0]);
				}
				else
				{
					toolItem.getHudItem().setPos([0,-21*(this.tileW+1),0]);
				}
			}
		};

		//-------------------------------------------------------------------------
		//更新HudTool的建筑物底板:
		__Page.vwHomeBld.prototype.updateHudPad=function(forceShow,forceBad)
		{
			var game;
			var toolItem,w,hudItem,keyItem,w;
			var home;

			home=this.homeStage;
			game=home.game;
			if(!this.hudTool)
			{
				return;
			}

			this.updateHudLabelPos();
			if((!forceBad) && game.tileMap.isPosGoodForBuilding(this.cocBld))//合法的位置
			{
				toolItem=this.hudTool.getSubItem(0);
				toolItem.setDisplay(this.dragMoved||forceShow);
				w=this.tileW;
				switch(w)
				{
				case 1:
				default:
					toolItem.setAction(0);
					break;
				case 2:
					toolItem.setAction(1);
					break;
				case 3:
					toolItem.setAction(2);
					break;
				case 4:
					toolItem.setAction(3);
					break;
				case 5:
					toolItem.setAction(4);
					break;
				}
				if(home.newPosBld)//这个是新增建筑Tool
				{
					toolItem=this.hudTool.getSubItem(5);
					hudItem=toolItem.getHudItem();
					keyItem=hudItem.getItemById("BtnBldOK");
					keyItem.setEnabled(1);
				}
			}
			else//非法的位置
			{
				//DBOut("Bad Pos!!");
				toolItem=this.hudTool.getSubItem(0);
				toolItem.setDisplay(1);
				w=this.tileW;
				switch(w)
				{
				case 1:
				default:
					toolItem.setAction(5);
					break;
				case 2:
					toolItem.setAction(6);
					break;
				case 3:
					toolItem.setAction(7);
					break;
				case 4:
					toolItem.setAction(8);
					break;
				case 5:
					toolItem.setAction(9);
					break;
				}
				if(home.newPosBld)
				{
					toolItem=this.hudTool.getSubItem(5);
					hudItem=toolItem.getHudItem();
					keyItem=hudItem.getItemById("BtnBldOK");
					keyItem.setEnabled(0);
				}
			}
		};

		//-------------------------------------------------------------------------
		//更新多重选择时HudTool的底板箭头位置:
		__Page.vwHomeBld.prototype.updateMultiSelMark=function(mode,xstart,ystart,xend,yend)
		{
			var tool,toolItem;
			tool=this.hudTool;
			if(tool)
			{
				//DBOut("Cur Mode: "+mode+", rect: "+xstart+", "+ystart+", "+xend+", "+yend);
				if(mode==0)//X:
				{
					toolItem=tool.getSubItem(1);
					toolItem.setOffset([(xstart-0.5)*this.tileW,0,0]);

					toolItem=tool.getSubItem(2);
					toolItem.setOffset([(xend+xstart)*this.tileW/2,(ystart-0.5)*this.tileW,0]);

					toolItem=tool.getSubItem(3);
					toolItem.setOffset([(xend+0.5)*this.tileW,0,0]);

					toolItem=tool.getSubItem(4);
					toolItem.setOffset([(xend+xstart)*this.tileW/2,(yend+0.5)*this.tileW,0]);
				}
				else
				{
					toolItem=tool.getSubItem(1);
					toolItem.setOffset([(xstart-0.5)*this.tileW,(ystart+yend)*this.tileW/2,0]);

					toolItem=tool.getSubItem(2);
					toolItem.setOffset([0,(ystart-0.5)*this.tileW,0]);

					toolItem=tool.getSubItem(3);
					toolItem.setOffset([(xend+0.5)*this.tileW,(ystart+yend)*this.tileW/2,0]);

					toolItem=tool.getSubItem(4);
					toolItem.setOffset([0,(yend+0.5)*this.tileW,0]);
				}
			}
		};
	}

	//**************************************************************************
	//更新建筑显示状态
	//**************************************************************************
	{
		//--------------------------------------------------------------------------
		//根据AISBld的内容更新当前建筑:
		__Page.vwHomeBld.prototype.aisUpdateView=function(aisBld)
		{
			//暂时先用这个, 后面把这个的功能移过来:)
			this.homeStage.updateBld(this);
		};
	}

	//**************************************************************************
	//群众演员相关:
	//**************************************************************************
	{
		//-------------------------------------------------------------------------
		//雇佣一个工人用来建造
		__Page.vwHomeBld.prototype.hireWorker=function(fromHut)
		{
			var aisBld,home,aisWorker,cocWorker,aisHut,cocHut,pos,cocBld;
			aisBld=this.aisBld;
			if(!this.worker && this.aisBld.constructWorker)
			{
				home=this.homeStage;
				aisWorker=aisBld.constructWorker;
				cocBld=this.cocBld;
				if(!aisWorker.cocWorker)
				{
					aisHut=aisWorker.owner;
					cocHut=aisHut.cocBld;
					cocWorker=new this.page.actorFarmer(this.appEnv,this.homeStage);
					this.worker=cocWorker;
					cocWorker.job=1;//到达目的地后工作
					aisWorker.cocWorker=cocWorker;
					cocWorker.aisWorker=aisWorker;
					pos=[0,0,0];
					if(!fromHut)
					{
						cocBld.getPos(pos);
						pos[0]+=this.tileW;
						pos[1]+=this.tileH/2;
					}
					else
					{
						cocHut.getPos(pos);
						pos[0]+=cocHut.getTileW();
						pos[1]+=cocHut.getTileH()/2;
					}
					cocWorker.addToStage(home.actorIdx.worker,pos[0],pos[1],0);
					cocWorker.moveToBldDoor(this);
					//this.addActor(cocWorker);
				}
				else
				{
					cocWorker=aisWorker.cocWorker;
					this.worker=cocWorker;
					cocWorker.moveToBldDoor(this);
					cocWorker.job=1;//到达目的地后工作
					//this.addActor(cocWorker);
				}
				cocWorker.lgcObj.addBuff(1,0,2.5,10000,0);
			}
		};

		//-------------------------------------------------------------------------
		//遣散用来建造的工人
		__Page.vwHomeBld.prototype.freeWorker=function()
		{
			var worker,aisHut,cocHut;
			worker=this.worker;
			if(worker)
			{
				aisHut=worker.aisWorker.owner;
				cocHut=aisHut.cocBld;
				worker.job=2;//到达目的地后销毁
				worker.moveToBldDoor(cocHut.homeBld);
				//this.removeActor(worker);
				this.worker=null;
			}
		};

		//-------------------------------------------------------------------------
		//根据仓库(校军场)的情况添加群众演员:
		__Page.vwHomeBld.prototype.addCampActors=function(newInit)
		{
			var level,aisBld,list,slist,i,n,def,lv,slot,objDef,num,j,cocUnit,defIdx,x,y,go2aisBld;
			level=this.homeStage.game.level;
			aisBld=this.aisBld;

			//先处理需要增加的群众演员:
			if(newInit)
			{
				//读出数据后的第一次初始化
				//TODO: Code this:
				list=aisBld.subStorage.newSlots;
				if(list)
				{
					list.splice(0,list.length);
				}

				slist=aisBld.subStorage.slots;
				list=[];
				for(i in slist)
				{
					list.push(slist[i]);
				}
			}
			else
			{
				list=aisBld.subStorage.newSlots;
			}
			if(list)
			{
				cocUnit=null;
				n=list.length;
				for(i=0;i<n;i++)
				{
					slot=list[i];
					def=slot.def;
					//lv=slot.level?slot.level:0;
					lv=aisGame.king.getUnitLevel(def.codeName);
					//DBOut("Add Actor with level: "+(lv+1));
					if(def.levels)
					{
						objDef=def.levels[lv].cocDefName;
						//DBOut("Add new item: "+objDef+"x"+slot.num);
						defIdx=level.getObjDefIdx(objDef);
						if(defIdx>=0)
						{
							num=slot.num;
							for(j=0;j<num*1;j++)
							{
								//TODO: 添加群众演员:
								cocUnit=new this.page.actorFarmer(this.appEnv,this.homeStage);
								cocUnit.job=3;//到达目的地后停留在建筑内
								cocUnit.aisType=def.codeName;
								if(slot.fromBld)
								{
									cocUnit.addByCoCBld(defIdx,slot.fromBld.cocBld,0);
								}
								else
								{
									cocUnit.addByCoCBld(defIdx,this.cocBld,0);
								}
								cocUnit.moveInToBld(this);
								this.addActor(cocUnit);
							}
						}
					}
				}
				if(cocUnit)
				{
					this.gameBld.playEffect(this.homeStage.eftIdx.bldTrainDone);
				}
				list.splice(0,n);
			}

			//处理需要离开的群众演员:
			list=aisBld.subStorage.takenSlots;
			if(list)
			{
				n=list.length;
				if(!newInit)
				{
					for(i=0;i<n;i++)
					{
						//寻找对应的群众演员, 要求其离开:
						slot=list[i];
						num=slot.num;
						def=slot.def;
						for(j=0;j<num;j++)
						{
							cocUnit=this.findActorByType(slot.type);
							if(cocUnit)//找到了
							{
								this.removeActor(cocUnit);
								cocUnit.job=2;//到达删除
								if(!slot.go2aisBld)
									cocUnit.moveToPos(38.5,38.5);
								else{
									go2aisBld=slot.go2aisBld;
									x=go2aisBld.pos[0]+go2aisBld.homeBld.tileW;
									y=go2aisBld.pos[1]+(go2aisBld.homeBld.tileH)/2;
									cocUnit.moveToPos(x,y);
								}
							}
						}
					}
				}
				list.splice(0,n);
			}

		};

		//-------------------------------------------------------------------------
		//根据仓库(校军场)的情况添加群众演员:
		__Page.vwHomeBld.prototype.addClanActors=function(newInit)
		{
			var level,aisBld,list,slist,i,n,def,lv,slot,objDef,num,j,cocUnit,defIdx;
			var x,y;
			level=this.homeStage.game.level;
			aisBld=this.aisBld;
			if(newInit)
			{
				if(aisBld.subStorage.newSlots)
				{
					aisBld.subStorage.newSlots.splice(0,aisBld.subStorage.newSlots.length);
				}
				list=aisBld.subStorage.takenSlots;
				if(list)
				{
					list.splice(0,list.length);
				}
				list=null;
			}
			else
			{
				list=aisBld.subStorage.newSlots;
			}
			if(list)
			{
				n=list.length;
				for(i=0;i<n;i++)
				{
					slot=list[i];
					def=slot.def;
					lv=parseInt(slot.subType);
					//DBOut("Add Actor with level: "+(lv+1));
					if(def.levels)
					{
						objDef=def.levels[lv].cocDefName;
						//DBOut("Add new item: "+objDef+"x"+slot.num);
						defIdx=level.getObjDefIdx(objDef);
						if(defIdx>=0)
						{
							num=slot.num;
							for(j=0;j<num*1;j++)
							{
								//TODO: 添加群众演员:
								x=Math.random();
								//DBOut("X: "+x);
								if(x<0.5)
								{
									x=0.5+x*5;
									y=0.5;
								}
								else
								{
									y=0.5+(x-0.5)*5;
									x=0.5;
								}
								cocUnit=new this.page.actorFarmer(this.appEnv,this.homeStage);
								cocUnit.job=2;//到达目的地后停留在建筑内
								//DBOut("Add actor at: "+x+", "+y);
								cocUnit.addToStage(defIdx,x,y,0);
								cocUnit.moveToBldDoor(this);
							}
						}
					}
				}
				list.splice(0,n);
			}
		};

		//-------------------------------------------------------------------------
		//将一个群众演员绑定到当前建筑上
		__Page.vwHomeBld.prototype.addActor=function(actor)
		{
			if(actor.bindedBld)
			{
				//TODO: Code this:
				actor.bindedBld.removeActor(actor);
			}
			if(!this.bindedActors)
			{
				this.bindedActors=[];
			}
			this.bindedActors.push(actor);
			actor.bindedBld=this;
			if(!this.fancyActorTimer)
			{
				this.fancyActorTimer=this.homeStage.layer.setFrameout(120,this.onFancyActorTimer,this);
			}
		};

		//-------------------------------------------------------------------------
		//取消一个群众演的绑定
		__Page.vwHomeBld.prototype.removeActor=function(actor)
		{
			var homeBld,list,i,n;
			homeBld=actor.bindedBld;
			if(homeBld==this)
			{
				list=this.bindedActors;
				if(list)
				{
					n=list.length;
					for(i=0;i<n;i++)
					{
						if(list[i]==actor)
						{
							list.splice(i,1);
							actor.bindedBld=null;
							return;
						}
					}
				}
			}
		};

		//-------------------------------------------------------------------------
		//根据AIS的Type来寻找一个Actor
		__Page.vwHomeBld.prototype.findActorByType=function(type)
		{
			var list,i,n;
			list=this.bindedActors;
			if(list)
			{
				n=list.length;
				for(i=0;i<n;i++)
				{
					if(list[i].aisType==type)
					{
						return list[i];
					}
				}
			}
		};

		//-------------------------------------------------------------------------
		//更新建筑绑定的群众演员的位置, 让他们能跟着建筑跑
		__Page.vwHomeBld.prototype.updateActors=function()
		{
			var list,i,n;
			var pos=[0,0,0];
			list=this.bindedActors;
			if(list)
			{
				n=list.length;
				for(i=0;i<n;i++)
				{
					switch(list[i].job)
					{
					case 1://建造中:
						list[i].moveToBldDoor(this);
						break;
					case 3://集结,呆在校军场:
						list[i].moveInToBld(this);
						break;
					}
				}
			}
			if(this.worker)
			{
				switch(this.worker.job)
				{
				case 1://建造中:
					this.worker.moveToBldDoor(this);
					break;
				case 3://集结,呆在校军场:
					this.worker.moveInToBld(this);
					break;
				}
			}
			if(this.craftObj && this.craftMode>0)
			{
				pos[0]=this.aisBld.pos[0]+this.tileW/2+0.1;
				pos[1]=this.aisBld.pos[1]+this.tileW/2+0.1;
				this.playCraftPosEft("hide");
				this.homeStage.layer.setFrameout(6,function(){
					this.craftObj.lgcObj.setPos(pos);
					this.playCraftEft("show");
				},this);
			}
		};

		//-------------------------------------------------------------------------
		//更新建筑绑定的群众演员的位置, 让他们能跟着建筑跑
		__Page.vwHomeBld.prototype.onFancyActorTimer=function()
		{
			var idx,list,actor,time;
			this.fancyActorTimer=null;
			list=this.bindedActors;
			if(list && list.length)
			{
				idx=Math.floor(Math.random()*list.length);
				actor=list[idx];
				if(actor)
				{
					actor.moveInToBld(this);
				}
				time=Math.floor(120/list.length);
				time=time<20?20:time;
				this.fancyActorTimer=this.homeStage.layer.setFrameout(time,this.onFancyActorTimer,this);
			}
		};

		//-------------------------------------------------------------------------
		//增加一个建筑上的机器人
		__Page.vwHomeBld.prototype.addCraft=function(body,leg,mode,bodyLv,legLv)
		{
			var defVO;
			var homeStage,craft;
			var idx,tag,defIdx,x,y;
			var pos=[0,0,0];
			idx=this.aisBld.craftIdx;
			tag="UserMac"+idx;
			defVO={
				def_name:tag,type:2,sub_type:1,id:0,tile_w:0,tile_h:0,core_w:1,core_h:1,
				ed_size:0.5,ed_r:0,ed_attack:1,
				//ani_body:"chr_farmer",ani_bg:"chr_tank_bg",
				ani_body:leg,ani_head:body,ani_bg:"chr_tank_bg",
				layer_bg:"gnd_shadow",layer_body:"gnd_objs",layer_ui:"gnd_ui",
				layer_jump_bg:"sky_shadow",layer_jump_body:"sky_objs",
				hp:{full:100,cur:100,recover_speed:0},
				move:{speed:0.05,attack_range_max:0.7,fly:0,jump:1},
				effect_jumpon:"jump_on",effect_jumpoff:"jump_off",
				effect:{hide:"par_shining",show:"bld_select",fix:"par_repairing",fixed:"par_repairing_done"},
			};
			homeStage=this.homeStage;
			defIdx=homeStage.level.getObjDefIdx(tag);
			homeStage.level.replaceObjDef(defIdx,defVO);
			homeStage.objDefs[defIdx]=defVO;
			pos[0]=this.aisBld.pos[0]+0.1;
			pos[1]=this.aisBld.pos[1]+0.1;
			//defIdx=homeStage.level.getObjDefIdx("chr_Farmer");
			//this.craftObj=homeStage.level.addObjectJS(defIdx,0,9,pos,45);
			//this.craftObj.actMoveTo(pos[0]+0.1,pos[1]+0.1,1,0);
			//this.craftObj.homeBld=this;
			craft=new this.page.actorCraft(this.appEnv,this.homeStage,pos[0],pos[1]);
			if(mode==0)//新创建，溜达
			{
				craft.addToStage(defIdx,pos[0],pos[1],0);
				craft.moveToNextBld(this);
			}
			else if(mode==1)//不防守，静止
			{
				pos[0]+=this.tileW/2+0.1;
				pos[1]+=this.tileW/2+0.1;
				craft.addToStage(defIdx,pos[0],pos[1],0);
			}
			else if(mode==2)//维修
			{
				pos[0]+=this.tileW/2+0.1;
				pos[1]+=this.tileW/2+0.1;
				craft.addToStage(defIdx,pos[0],pos[1],0);
				//TODO: add fix effect
				this.cocBld.addTimerCall(10,6);
				craft.cocObj.setColorFlash(1,180,255,180,128);
			}
			this.craftMode=mode?mode:0;
			this.craftObj=craft;
			this.playCraftEft("show");
			if(window.aisGame.bVisit)
				craft.addLvTool(bodyLv,legLv);
		};

		//-------------------------------------------------------------------------
		//删除一个建筑上的机器人
		__Page.vwHomeBld.prototype.delCraft=function()
		{
			if(this.craftObj)
			{
				//TODO: Play effect:
				this.playCraftPosEft("hide");
				this.craftObj.signAsDead();
				this.craftObj=null;
			}
		}

		//-------------------------------------------------------------------------
		//改变建筑上的机器人的状态
		__Page.vwHomeBld.prototype.setCraftMode=function(mode)
		{
			var pos=[0,0,0];
			var craft;
			craft=this.craftObj;
			if(this.craftObj)
			{
				switch(mode)
				{
				case 0:
				default:
					if(this.craftMode!=0)
					{
						this.playCraftPosEft("hide");
						pos[0]=this.aisBld.pos[0]+this.tileW-0.5;
						pos[1]=this.aisBld.pos[1]+(this.tileH/2)+0.1;
						craft.lgcObj.setPos(pos);
						this.playCraftPosEft("show");
						craft.moveToNextBld();
						craft.cocObj.setFlash(0);
					}
					break;
				case 1:
					if(this.craftMode==0)
					{
						this.playCraftPosEft("hide");
						pos[0]=this.aisBld.pos[0]+(this.tileW/2)+0.1;
						pos[1]=this.aisBld.pos[1]+(this.tileH/2)+0.1;
						craft.lgcObj.setPos(pos);
						//Stop craft movement
						//TODO: Change to better version:
						craft.stopMove();
						craft.lgcObj.setQDit(0);
						this.playCraftPosEft("show");
					}
					craft.cocObj.setFlash(0);
					break;
				case 2:
					if(this.craftMode==0)
					{
						this.playCraftPosEft("hide");
						pos[0]=this.aisBld.pos[0]+(this.tileW/2)+0.1;
						pos[1]=this.aisBld.pos[1]+(this.tileH/2)+0.1;
						craft.lgcObj.setPos(pos);
						//Stop craft movement
						//TODO: Change to better version:
						craft.stopMove();
						craft.lgcObj.setQDit(0);
						this.playCraftPosEft("show");
					}
					craft.cocObj.setColorFlash(1,180,255,180,128);
					break;
				}
				this.craftMode=mode?mode:0;
			}
		};
	}
};
