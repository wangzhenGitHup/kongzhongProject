if(!__Page.stateBattle)
{
	__Page.stateBattle={
		page:__Page,
		name:"MacDefenseState",
		lastLUDT:0,
		lockLUDT:1,
		timerLUDT:null,
		updateLUDT:null,
		oppUserId:-1,
		oldDeadRate:0,
		pushMsgs:[],
		speed:[1,2,4],
		curSpeed:0,
		addWaitTime:0,
		/*unitTypes:[
			{type:"chr_Marine",idx:-1,icon:"unit1",num:0},
			{type:"chr_Sniper",idx:-1,icon:"unit2",num:0},
		],*/
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateBattle);

	//初始化State
	__Page.stateBattle.init=function(appEnv)
	{
		var page;
		var imgLib;
		var cssLib;
		var city;
		var layer,keyid;

		this.appEnv=appEnv;
		appEnv.stateBattle=this;
		appEnv.entryState=this;
		page=this.page;
		imgLib=page.imgLib;
		cssLib=page.cssLib;

		page.keyStateUtil.call(this);
		this.stage=page.vwBattleStage;

		var savedTxt=page.getCookie("Runtime","MacDefenseStage");
		page.setCookie("Runtime","MacDefenseStage","",0);
		if(savedTxt)
		{
			this.gameVO=fromJSON(savedTxt);
		}
		if(!window.aisNTEngine)
		{
			this.gameVO={
				stage:{
					name:"abc",
					instances:[
						{"defName": "Hangar1", "def": 157, "group": 2, "x": 22, "y": 20, "codename": "Hangar", "level": 1},
						{"defName": "Hangar1", "def": 157, "group": 2, "x": 19, "y": 22, "codename": "Hangar", "level": 1},
						{"defName": "Hangar1", "def": 157, "group": 2, "x": 19, "y": 18, "codename": "Hangar", "level": 1},
						{"defName": "Cannon6", "def": 82, "group": 2, "x": 30, "y": 25, "codename": "Cannon", "level": 6}
					],
					skill:{
						Lightning:{type:"Lightning",baseGem:5,incGem:10,skillCD:40*10},
						Heal:{type:"Heal",baseGem:5,incGem:10,skillCD:40*10},
						VVirus:{type:"VVirus",baseGem:5,incGem:10,skillCD:40*10},
					},
					oppunits:[
						{wave:1,delaytime:2*40,edge:0,type:"UntMarine",level:1,num:5},
						{wave:2,delaytime:220,edge:0,type:"UntMarine",level:2,num:3},
						{wave:3,delaytime:520,edge:0,type:"UntMarine",level:2,num:10},
						{wave:4,delaytime:1020,edge:0,type:"UntMarine",level:2,num:10},
					],
					controlCD:400,allskillCD:100,
				},

				stageID:"",
				gemNum:1000,
				unitScoreC:2.5,//战斗单位得分系数
				remainTimesScoreC:1.0,//剩余时间得分系数
				treatC:2.5,//紧急救援治疗量系数
				mechHPC:2.5,//机甲血量修正系数
				mechScoreC:1.0,//机甲得分系数
				rewardResModfiy:1.0,//战斗资源奖励系数
				rewardResType:"Gem",
				mechs:[
				{instanceId:100000,state:0,up:{codename:"par_body01_01",level:1},down:{codename:"par_leg01_01",level:1}},
				//{instanceId:100001,state:0,up:{codename:"par_body02_01",level:1},down:{codename:"par_leg01_01",level:1}},
				],
				magicLevel:[{unitCodename:"Lightning",level:1},{unitCodename:"Heal",level:1},{unitCodename:"VVirus",level:1}],
				waveLoots:[{waveId:1,type:"Gem",num:1,extend1:""}],
				stageBonus:{waveId:0,type:"Gem",num:1,extend1:""},
			};
		}
		page.vwBattleStage.initStage();

		if(window.aisNTEngine)
		{
			window.aisNTEngine.initBattleCom(page.vwBattleStage,window.GameSocketUrl);
		}

		//创建State专署UI控件:
		{
			layer=this.appEnv.layer;
			appEnv.hudBaseBox=this.hudBaseBox=layer.addHudItem({type:"shape",pos:[0,0,0],w:20,h:20,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudTLBox=this.hudBaseBox.appendNewChild({
				type:"shape",ch_align:0,cv_align:0,pos:[0,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
				fade:1,fade_size:1,fade_alpha:0
			});
			this.hudTCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudTRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[appEnv.scrSize[0]-300,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBLBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[0,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300),appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});

		//	this.hudBBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[0,appEnv.scrSize[1]-120,0],w:appEnv.scrSize[0],h:120,face_r:0,face_g:0,face_b:0,face_a:128,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBBox=this.hudBaseBox.appendNewChild({type:"div3x3",pos:[0,appEnv.scrSize[1]-120,0],w:appEnv.scrSize[0],h:120,css:imgLib.getImg("box_unit_list"),ui_event:1,fade:1,fade_size:1,fade_alpha:0});

			this.Timer3mHud=this.hudBaseBox.appendNewChild({type:"icon",id:"cd3m",pos:[appEnv.scrSize[0]>>1,(appEnv.scrSize[1]>>1)-30,0],css:this.page.imgLib.cdNum3,"anchor_h":1,"anchor_v":1,ui_event:1,display:0});

			var btnPic=imgLib.getImg("btn_bt_end");

			//技能list
			keyid=appEnv.hudKeys.getKey();
			this.skItems=this.hudBaseBox.appendNewChild({
				"type":"listbox","pos":[0,appEnv.scrSize[1]-240,0],"w":appEnv.scrSize[0]-btnPic.w-10,"h":120,"anchor_h":0,"anchor_v":0,"arrange":1,"item_w":85,"item_h":150,"item_alpha_down":0.75,ui_event:1,
				key:keyid,show_align:2,hot_check:1,"item_alpha_down":1.0,"item_alpha_dimmed":1.0,"item_size_down":1.0,"item_size_check":1.0,"end_gap":1,"sub_event":2,"move_gap":20,"fast_scroll":1,show_fx:0,
				display:0,fade:1,fade_pos:[0,appEnv.scrSize[1]-280,0],fade_size:1,fade_alpha:0,state:this,clip:1
			});
			this.regKeyVO(keyid,this,this.onSkillItemClk);

			//底部技能list
			keyid=appEnv.hudKeys.getKey();
			this.gensklItems=this.hudBaseBox.appendNewChild({
				"type":"listbox","pos":[(85+10)*3,appEnv.scrSize[1]-120-40,0],"w":(85+10)*3,"h":120+40,"anchor_h":0,"anchor_v":0,"arrange":1,"item_w":85,"item_h":150,"item_alpha_down":0.75,ui_event:1,
				key:keyid,show_align:2,hot_check:1,"item_alpha_down":1.0,"item_alpha_dimmed":1.0,"item_size_down":1.0,"item_size_check":1.0,"end_gap":1,"sub_event":1,"move_gap":20,"fast_scroll":1,show_fx:0,
				display:1,fade:1,fade_pos:[0,appEnv.scrSize[1]-280-40,0],fade_size:1,fade_alpha:0,state:this,//clip:1
			});
			this.regKeyVO(keyid,this,this.onGenSkillItemClk);

			this.gensklCD=this.hudBaseBox.appendNewChild({
				type:"cdicon",id:"cdBar",pos:[(85+10)*6,appEnv.scrSize[1]-120+10],css:imgLib.getImg("box_achieveBar_bg"),w:80,h:100,"anchor_h":0,"anchor_v":0,color_a:0,display:window.aisNTEngine?0:1,
				mode:2,val_full:100,val_cur:100,val_speed:1,
				color_dr:64,color_dg:64,color_db:64,color_lr:255,color_lg:255,color_lb:255,color_la:128,
				onValEvent:function(){this.setValSpeed(0);}
			});

			//底部的ListBox
			keyid=appEnv.hudKeys.getKey();
			this.lbItems=this.hudBaseBox.appendNewChild({
				"type":"listbox","pos":[0,appEnv.scrSize[1]-120,],"w":(85+10)*3,"h":120,"anchor_h":0,"anchor_v":0,"arrange":1,"item_w":85,"item_h":150,"item_alpha_down":0.75,ui_event:1,
				key:keyid,show_align:0,hot_check:1,"item_alpha_down":1.0,"item_alpha_dimmed":1.0,"item_size_down":1.0,"item_size_check":1.0,"end_gap":1,"sub_event":2,"move_gap":20,"fast_scroll":1,show_fx:0,
				display:1,fade:1,fade_size:1,fade_alpha:0,state:this,//clip:1
			});
			this.regKeyVO(keyid,this,this.onItemClk);

			//调试控件底盘:
			this.hudDBDock=this.hudBaseBox.appendNewChild({
				type:"shape",ch_align:0,cv_align:0,pos:[-200,0,0],w:200,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
				fade:1,fade_size:1,fade_alpha:0,display:window.DEBUGMODE?1:0
			});
			this.hudDBBox=this.hudDBDock.appendNewChild({
				type:"shape",ch_align:0,cv_align:0,pos:[0,0,0],w:200,h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:64,border_a:0,ui_event:1,
				display:0,fade:1,fade_size:1,fade_alpha:0
			});

		}
		this.appEnv.layer.setDisplay(0);
		//DBOut("stateBattle.init: "+appEnv);

	};

	__Page.stateBattle.enter=function(preState)
	{
		this.bRevenge=this.page.getCookie("Runtime","Revenge");
		if(this.bRevenge)
			this.page.setCookie("Runtime","Revenge","",0);

		var time=this.page.getCookie("Runtime","BattleWaitTime");
		if(time)
		{
			this.addWaitTime=parseInt(time,10);
			this.page.setCookie("Runtime","BattleWaitTime","",0);
		}

		this.upf=this.appEnv.layer.getUPF();

		if(!window.aisNTEngine)
		{
			var text = Dialogs.getText("input city filename:");
			if(text)
			this.page.appEnv.loadFile(UIBody.genPageURL("macdefense/"+text+".json"),function(levelVO){
				this._bldList=levelVO.objs;

				var text = Dialogs.getText("input stage config filename:");
				if(text)
				this.page.appEnv.loadFile(UIBody.genPageURL("macdefense/"+text+".json"),function(levelVO){
					this._stageconfig=levelVO;
				},this);
			},this);
		}



	};

	__Page.stateBattle.leave=function(nextState)
	{
		this.appEnv.layer.setUPF(this.upf);
		//TODO:code this:
	};

	__Page.stateBattle.onGameLoaded=function(notfirst)
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var textLib=page.appEnv.textLib;

		var gameVO,list,skllist,i,n,m,css,keyId,items,sklitems,savedTxt,vo;
		var stage,level;
		stage=this.page.vwBattleStage;
		level=stage.level;

		if(!notfirst)
		{
			this.modeText=cssLib.textFineMid.create(this.hudTRBox,[(this.hudTRBox.getW()>>1)+70,40,0],textLib.MacDefenseMode,this.hudTRBox.getW(),20,1,1,1,1,[255,255,255]);
			this.nameText=cssLib.textFineMid.create(this.hudTRBox,[(this.hudTRBox.getW()>>1)+70,80,0],"",this.hudTRBox.getW(),20,1,1,1,1,[255,255,255]);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onSpeedClk);
			this.speedBtn=cssLib.normalBtn.create(this.hudBRBox,[(this.hudBRBox.getW()>>1)+68,(this.hudBRBox.getH()>>1)-10,0],keyId,0,textLib.X1);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onEndBattleClk);
			var btnPic=imgLib.getImg("btn_bt_end");
			this.endBattleBtn=this.hudBaseBox.appendNewChild({type:"key",pos:[appEnv.scrSize[0]-btnPic.w/2-5,appEnv.scrSize[1]-60,0],css:btnPic,button:1,ui_event:1,down_scale:0.95,key:keyId,
				audio:this.page.audioObject.genFileURL("btn_click"),
				state_up:btnPic,state_down:btnPic,state_gray:btnPic,anchor_h:1,anchor_v:1,items:[
					{id:"EndBattle",css:cssLib.textFineMid.createCSS([0,-btnPic.h/4,0],textLib["EndBattle"],btnPic.w,btnPic.h/2,1,1,1,1)},
					{id:"NoReduce",css:cssLib.textFineSmall.createCSS([0,btnPic.h/6,0],textLib["NoReduce"],btnPic.w,btnPic.h/3,1,1,1,1)}
				]});

			this.battleTimeHud=cssLib.battleTime.create(this.hudTCBox,[this.hudTCBox.getW()>>1,80,0],0);

			this.unitDeadBox=cssLib.boxLootBar.create(this.hudTLBox,[60,40,0],"kill");
			this.unitScoreBox=cssLib.boxLootBar.create(this.hudTLBox,[60,80,0],"star");

			//下面这些按钮是为调试增加的:
			this.dbBtnOpen=cssLib.btnDebug.create(this.hudDBDock,">",[224,appEnv.scrSize[1]/2,0],50,appEnv.appKeys.debugSwitch);

			this.dbBtnLoadStage=cssLib.btnDebug.create(this.hudDBBox,"Load stage",[100,50,0],180,appEnv.appKeys.debugLoadStage);
			this.dbBtnLoadCookieStage=cssLib.btnDebug.create(this.hudDBBox,"Load cookie stage",[100,100,0],180,appEnv.appKeys.debugLoadCookieStage);
			this.dbBtnLoadStage=cssLib.btnDebug.create(this.hudDBBox,"Load replay",[100,150,0],180,appEnv.appKeys.debugLoadReplay);
			this.dbBtnSaveReplay=cssLib.btnDebug.create(this.hudDBBox,"Save replay",[100,200,0],180,appEnv.appKeys.debugSaveReplay);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Up",[100,500,0],180,appEnv.appKeys.debugScaleU);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Down",[100,550,0],180,appEnv.appKeys.debugScaleD);
			this.dbBtnExit=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.debugExit);

			this.debugTime=cssLib.textMid.create(this.hudDBBox,[100,20,0],"0d 0h 0m 0s",180,20,1,1,0,1,[255,128,0]);
		}
		items=[];
		sklitems=[];


		if(this.gameVO)
		{
			//*
			if(!window.aisNTEngine)
			{
				if(this._bldList)
					this.gameVO.stage.instances=this._bldList;
				if(this._stageconfig)
				{
					this.gameVO.stage.skill=this._stageconfig.skill;
					this.gameVO.stage.oppunits=this._stageconfig.oppunits;
					this.gameVO.stage.controlCD=this._stageconfig.controlCD;
					this.gameVO.stage.allskillCD=this._stageconfig.allskillCD;
				}
			}
			//*/

			this.page.vwBattleStage.proxyMacDefense(this.gameVO);
			vo=this.page.vwBattleStage.battleInfo;
			stage.initCityBlds(1);
			list=vo.units;
			this.oppUserId=vo.stage.userId;
			this.loots=this.gameVO.loots;//LootVO
			this.nameText._setText(vo.stage.name);
		}


		var seq={"UntMarine":1,"UntSniper":2,"UntHacker":3,"UntCyber":4,"UntTNTMac":5,"UntChop":6,"UntTank":7,"UntHealer":8,"UntAvenger":9,"UntPEKKA":10,
			"Lightning":11,"Heal":12,"VVirus":13,"ZGravity":14,"ClanHud":15};
		var codename,j;
		for(i=0; i<list.length; i++)
		{
			codename=list[i].codename;
			codename=codename.substr(0,codename.length-1);
			DBOut(codename);
			list[i].seqIdx=seq[codename];
		}
		list.sort(function(a,b){return a.seqIdx-b.seqIdx;});

		keyId=appEnv.hudKeys.getKey(this);
		n=list.length;
		for(i=0;i<n;i++)
		{
			css=cssLib.btnBattleUnit.createCSS(list[i].codename,list[i].icon,level.getObjDefIdx(list[i].codename),list[i].num,list[i].level,keyId,list[i].group,list[i].units,list[i].exvo);
			items.push(css);
		}

		m=stage.battleInfo.skllist.length;
		for(i=0;i<m;i++)
		{
			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onSklCDByGemClk);
			if(i==0)this.firstSklkey=keyId;
			skllist=stage.battleInfo.skllist[i];
			css=cssLib.btnDefenseSkill.createCSS(skllist.fullcodename,skllist.icon,level.getObjDefIdx(skllist.fullcodename),skllist.num,skllist.level,keyId,skllist.group,skllist.units,skllist.exvo);
			sklitems.push(css);
		}

		this.lbItems.addItems(items);
		this.lbItems.itemAt(0).getItemById("UnitSel").setDisplay(1);

		this.gensklItems.addItems(sklitems);
		this.curSklLBIdx=-1;

		if(n>0)
		{
			this.lbItems.setCheckItemId(0);
			this.curUnitLBIdx=0;
			stage.curUnitIdx=this.lbItems.itemAt(0).unitDefIdx;
			stage.curUnitExvo=this.lbItems.itemAt(0).exvo;
			stage.curUnitGroup=this.lbItems.itemAt(0).unitGroup;
			stage.curUnitNum=this.lbItems.itemAt(0).unitNum;
			stage.curUnitUnits=this.lbItems.itemAt(0).unitUnits;
		}
		else
		{
			stage.curUnitIdx=-1;
			stage.curUnitExvo=null;
		}

		this.Timer3mHud.setDisplay(0);
		this.speedBtn.setDisplay(1);
		this.battleTimeHud.setCallBack(this.onTimer,this);
		this.battleTimeHud.start(10+this.addWaitTime);
		//this.aboutTimerLUDT(30*1000,this.startCountDown,this.timerLUDT);
		this.aboutTimerLUDT((10+this.addWaitTime-3)*1000,function(){
			this.Timer3mHud.setDisplay(1);
			this.start3mCountDown(3);
		},this.timerLUDT);
		stage.setAlarmRange(null,null,-1);
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.stateBattle.onKey=function(msg,key,way,extra)
		{
			var ret,appEnv,url;
			appEnv=this.appEnv;
			if(key==-1)
			{
				if(msg==2)//Start move
				{
					this.hudBaseBox.fadeOut(3,0);
				}
				else if(msg==1)//End move
				{
					appEnv.hudIn(this.hudBaseBox,3);
				}
				return;
			}
			if(msg==1 && way==1 && key<0)
			{
				//开关调试面板:
				if(key==appEnv.appKeys.debugSwitch)
				{
					if(this.hudDBBox.getDisplay())
					{
						appEnv.hudOut(this.hudDBBox,10);
						this.hudDBDock.startAniEx([-200,0,0],1,1,0,3);
						this.dbBtnOpen.setText(">");
					}
					else
					{
						appEnv.hudIn(this.hudDBBox,10);
						this.hudDBDock.startAniEx([0,0,0],1,1,0,3);
						this.dbBtnOpen.setText("<");
					}
					return 1;
				}
				//读取场景信息
				if(key==appEnv.appKeys.debugLoadStage)
				{
					this.page.vwBattleStage.reSet();
					this.page.vwBattleStage.unitNum=this.loadstageUnitNum;
					Dialogs.openFile("Open saved scene",["*.js"],this.page.onLoadStage,this);
					return 1;
				}
				if(key==appEnv.appKeys.debugLoadCookieStage)
				{
					var savedVO;
					savedVO=this.page.getCookie("COC","SaveStage");
					if(savedVO){
						this.reSet();
						savedVO=fromJSON(savedVO);
						this.page.vwBattleStage.scoreBldNum=savedVO.objs.length;
						this.page.vwBattleStage.level.load(savedVO);
					}
					return 1;
				};
				//读取战斗回放
				if(key==appEnv.appKeys.debugLoadReplay)
				{
					Dialogs.openFile("Open saved scene",["*.js"],this.page.onLoadReplay,this);
					return 1;
				}
				//保存战斗回放
				if(key==appEnv.appKeys.debugSaveReplay)
				{
					Dialogs.saveToFile(toJSON(this.page.vwBattleStage.level.getBattleLog()),["*.js","*.*"]);
					return 1;
				}
				{
					if(key==appEnv.appKeys.debugScaleU)
					{
						var scale;
						scale=this.page.vwBattleStage.gameHud.getScale();
						this.page.vwBattleStage.gameHud.setScale(scale+0.1);
						return 1;
					}
					if(key==appEnv.appKeys.debugScaleD)
					{
						var scale;
						scale=this.page.vwBattleStage.gameHud.getScale();
						this.page.vwBattleStage.gameHud.setScale(scale-0.1);
						return 1;
					}
				}
				//退出
				if(key==appEnv.appKeys.debugExit)
				{
					switchApp(this.page.genPageURL("ui_debug.jml"));
					return 1;
				}
			}
			//Default:
			ret=this.autoOnKey(msg,key,way,extra);
			DBOut("stateBattle.onKey: "+msg+", "+key);
			if(ret)
				return ret;
		};

		__Page.stateBattle.onItemClk=function(msg,key,way,extra)
		{
			if(msg==2 && way==1 && -1!=extra)
			{
				if(this.stage.state<1)return;
				DBOut("Item Selected: "+extra);
				if(this.curUnitLBIdx!=extra)
				{
					if(this.curSklLBIdx>=0)
					{
						this.gensklItems.itemAt(this.curSklLBIdx).getItemById("UnitSel").setDisplay(0);
						this.curSklLBIdx=-1;
					}

					if(this.curUnitLBIdx>=0)
					{
						this.lbItems.itemAt(this.curUnitLBIdx).getItemById("UnitSel").setDisplay(0);

						if(this.lbItems.itemAt(this.curUnitLBIdx).exvo)
						this.stage.setMechColorFlash(this.lbItems.itemAt(this.curUnitLBIdx).exvo.uid,0);
					}
					this.lbItems.itemAt(extra).getItemById("UnitSel").setDisplay(1);
					this.curUnitLBIdx=extra;
					this.page.vwBattleStage.curUnitIdx=this.lbItems.itemAt(extra).unitDefIdx;
					this.page.vwBattleStage.curUnitExvo=this.lbItems.itemAt(extra).exvo;
					this.page.vwBattleStage.curUnitGroup=this.lbItems.itemAt(extra).unitGroup;
					this.page.vwBattleStage.curUnitNum=this.lbItems.itemAt(extra).unitNum;
					this.page.vwBattleStage.curUnitUnits=this.lbItems.itemAt(extra).unitUnits;

					if(this.lbItems.itemAt(extra).exvo && !this.stage.curUnitNum)
					{
						this.stage.setMechColorFlash(this.lbItems.itemAt(extra).exvo.uid,1);
						this.showSkill(this.lbItems.itemAt(extra).exvo.skill);
					}else
						this.showSkill();
				}
			}
		};

		__Page.stateBattle.onGenSkillItemClk=function(msg,key,way,extra)
		{
			if(msg==2 && way==1 && -1!=extra)
			{
				if(this.stage.state<1)return;
				DBOut("Item Selected: "+extra);
				if(this.curSklLBIdx!=extra)
				{
					if(this.curUnitLBIdx>=0)
					{
						this.lbItems.itemAt(this.curUnitLBIdx).getItemById("UnitSel").setDisplay(0);

						if(this.lbItems.itemAt(this.curUnitLBIdx).exvo)
						this.stage.setMechColorFlash(this.lbItems.itemAt(this.curUnitLBIdx).exvo.uid,0);
						this.curUnitLBIdx=-1;
					}

					if(this.curSklLBIdx>=0)
					{
						this.gensklItems.itemAt(this.curSklLBIdx).getItemById("UnitSel").setDisplay(0);

						if(this.gensklItems.itemAt(this.curSklLBIdx).exvo)
						this.stage.setMechColorFlash(this.gensklItems.itemAt(this.curSklLBIdx).exvo.uid,0);
					}
					this.gensklItems.itemAt(extra).getItemById("UnitSel").setDisplay(1);
					this.curSklLBIdx=extra;
					this.page.vwBattleStage.curUnitIdx=this.gensklItems.itemAt(extra).unitDefIdx;
					this.page.vwBattleStage.curUnitExvo=this.gensklItems.itemAt(extra).exvo;
					this.page.vwBattleStage.curUnitGroup=this.gensklItems.itemAt(extra).unitGroup;
					this.page.vwBattleStage.curUnitNum=this.gensklItems.itemAt(extra).unitNum;
					this.page.vwBattleStage.curUnitUnits=this.gensklItems.itemAt(extra).unitUnits;

					if(this.gensklItems.itemAt(extra).exvo && !this.stage.curUnitNum)
					{
						this.stage.setMechColorFlash(this.gensklItems.itemAt(extra).exvo.uid,1);
						this.showSkill(this.gensklItems.itemAt(extra).exvo.skill);
					}else
						this.showSkill();
				}
			}
		};


		__Page.stateBattle.showSkill=function(skl)
		{
			var i,n,css,items=[],list,picURL;
			list=this.skItems;
			if(!skl || !skl.length){
				if(list.getDisplay())list.fadeOut(10,0);
				return;
			}
			var cr,cg,cb,ca,imgLib=this.page.imgLib;
			n=skl.length;
			for(i=0;i<n;i++)
			{
				picURL=this.page.genPageURL(window.imgPath+"/icon/icon_"+skl[i].icon+"128_32.png");
				if(skl[i].num<=0)
				{
					cr=cg=cb=ca=128;
				}else{
					cr=cg=cb=ca=255;
				}
				css={
					type:"key",id:"",pos:[5+80/2,10+100/2,0],"css":imgLib["box_unit_empty"],mode3x3:1,num:skl[i].num,gray:skl[i].num<=0,
					"anchor_h":1,key:0,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
					state_up:{"css":imgLib["box_unit_empty"],w:80,h:100,mode3x3:1,},audio:this.page.audioObject.genFileURL("btn_click"),
					state_down:{"css":imgLib["box_unit_empty"],w:80,h:100,mode3x3:1,},
					state_gray:{"css":imgLib["box_unit_empty"],w:80,h:100,color_r:128,color_g:128,color_b:128,color_a:128,mode3x3:1,},
					items:[{
						type:"icon",id:"SkillIcon",pos:[0,10,0],w:64,h:64,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,ui_event:1,
						color_r:cr,color_g:cg,color_b:cb,color_a:ca,
					}],_setEnabled:function(f){
						this.setEnabled(f);
						var color=f?[255,255,255,255]:[128,128,128,128];
						this.getItemById("SkillIcon").setColor(color);
					}
				}
				items.push(css);
			}
			list.clearItems();
			list.addItems(items);
			list.fadeIn(10,0);
		};

		__Page.stateBattle.onSkillItemClk=function(msg,key,way,extra)
		{
			if(msg==2 && way==1 && -1!=extra)
			{
				var stage,item;
				stage=this.stage;
				item=this.skItems.itemAt(extra);

				if(stage.curUnitExvo && stage.curUnitExvo.skill)
				{
					if(item.num<=0)return;
					item.num--;
					stage.curUnitExvo.skill[extra].num--;
					if(!item.num)item._setEnabled(0);
					stage.putDownMechSkill(stage.curUnitExvo.skill[extra].codename,stage.curUnitExvo.skill[extra].level);
				}
			}
		};

		__Page.stateBattle.onSklCDByGemClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				if(this.stage.state<1)return;
				var i,index,item,t,val,cdHud,num,gt;
				index=key-this.firstSklkey;
				DBOut("++++on skill gem btn="+index);
				item=this.gensklItems.itemAt(index);
				if(item)
				{
					num=item.getGemCost();
					if(!this.checkCost(num))return;

					cdHud=item.getItemById("cdBar");
					t=this.stage.allskillCD;
					val=cdHud.getCurVal();
					gt=this.gensklCD.getCurVal();
					if(gt<t)
					{
						cdHud.setCurVal(0);
						cdHud.setFullVal(t-gt);
						cdHud.setValSpeed(1);
					}else if(val>=t)
					{
						cdHud.setCurVal(cdHud.getFullVal());
					}else{
						cdHud.setCurVal(0);
						cdHud.setFullVal(t-val);
						cdHud.setValSpeed(1);
					}
					item.useGemCD();
					this.useCost(num);
					if(window.aisNTEngine)
					{
						window.aisNTEngine.execFakeCmd(null,"MacDefense_UseSkill",{codename:this.stage.battleInfo.skllist[index].codename,gemNum:num},null,0);
					}

					for(i=0;i<3;i++)
					{
						item=this.gensklItems.itemAt(i);
						num=item.getGemCost();
						if(!this.checkCost(num))
							item.resetGemCDBtn(0);
					}
				}
			}
		};

		__Page.stateBattle.checkCost=function(num)
		{
			return this.stage.gemNum<num?0:1;
		};

		__Page.stateBattle.useCost=function(num)
		{
			this.stage.gemNum-=num;
		};


		__Page.stateBattle.checkControlCD=function()
		{
			var cdHud,val;
			cdHud=this.lbItems.itemAt(this.curUnitLBIdx).getItemById("cdBar");
			if(!cdHud)return 0;
			val=cdHud.getValue();
			return val?0:1;
		};

		__Page.stateBattle.resetControlCD=function()
		{
			var cdHud,val;
			cdHud=this.lbItems.itemAt(this.curUnitLBIdx).getItemById("cdBar");
			if(!cdHud)return;
			val=this.stage.controlCD;
			cdHud.setFullValue(val);
			cdHud.setValue(val);
			cdHud.setValueSpeed(-1);
		};

		__Page.stateBattle.checkSklCD=function()
		{
			var cdHud,val;
			cdHud=this.gensklItems.itemAt(this.curSklLBIdx).getItemById("cdBar");
			if(!cdHud)return 0;
			val=cdHud.getCurVal();
			DBOut("+++val="+val);
			return val<cdHud.getFullVal()?0:1;
		};

		__Page.stateBattle.resetSkillCD=function()
		{
			var cdHud,val,i,item;

			this.gensklCD.setFullVal(this.stage.allskillCD);
			this.gensklCD.setCurVal(0);
			this.gensklCD.setValSpeed(1);

			for(i=0;i<3;i++)
			{
				item=this.gensklItems.itemAt(i);
				if(!item)continue;
				cdHud=item.getItemById("cdBar");
				if(!cdHud)continue;
				var t=1;
				if(i==this.curSklLBIdx)
				{
					t=item.exvo.skillCD;
					if(this.checkCost(item.getGemCost()))
						item.resetGemCDBtn(1)
					else
						item.resetGemCDBtn(0);
				}else{
					t=this.stage.allskillCD;
					val=cdHud.getFullVal()-cdHud.getCurVal();
					if(val>=t)
					{
						continue;
					}
					item.resetGemCDBtn(0);
				}

				cdHud.setFullVal(t);
				cdHud.setCurVal(0);
				cdHud.setValSpeed(1);
			}
		};

		__Page.stateBattle.putDownUnit=function()
		{
			var item;
			if(this.curUnitLBIdx>=0)
				item=this.lbItems.itemAt(this.lbItems.getCheckItemId());
			if(this.curSklLBIdx>=0)
				item=this.gensklItems.itemAt(this.gensklItems.getCheckItemId());
			//DBOut("--------item="+item);
			if(item)
			{
				item.putDown();
				this.page.vwBattleStage.curUnitNum=item.unitNum;

				if(this.stage.curUnitExvo && !this.stage.curUnitNum)
					this.showSkill(this.stage.curUnitExvo.skill);
			}
		};

		__Page.stateBattle.onSpeedClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var spd,stage=this.page.vwBattleStage;
				var textLib=this.page.appEnv.textLib;

				this.curSpeed++;
				this.curSpeed%=this.speed.length;
				spd=this.speed[this.curSpeed];
				this.speedBtn.setText(textLib["X"+spd]);
				this.appEnv.layer.setUPF(Math.floor(this.upf*spd));
				if(this.battleTimeHud.setTimerFactor)
				this.battleTimeHud.setTimerFactor(spd);
			}

		};

		__Page.onLoadStage=function(fileVO)
		{
			var path,stub;
			path=fileVO.value;
			DBOut("Will open: "+path);
			stub=this.page.loadFileText(path);
			stub.onLoad=this.page.onLoadStageText;
			stub.state=this;
		};
		__Page.onLoadStageText=function()
		{
			var self=this.state;
			var text,savedVO;
			text="__saved=("+this.getText()+");__saved;";
			DBOut("Text: "+text);
			savedVO=eval(text);
			DBOut("VO: "+savedVO);
			self.page.vwBattleStage.level.load(savedVO);
		};
		__Page.onLoadReplay=function(fileVO)
		{
			var path,stub;
			path=fileVO.value;
			DBOut("Will open: "+path);
			stub=this.page.loadFileText(path);
			stub.onLoad=this.page.onLoadReplayText;
			stub.state=this;
		};
		__Page.onLoadReplayText=function()
		{
			var self=this.state;
			var text,savedVO;
			text="__saved=("+this.getText()+");__saved;";
			DBOut("Text: "+text);
			savedVO=eval(text);
			DBOut("VO: "+savedVO);
			self.page.vwBattleStage.level.loadReplay(savedVO);
		};
		__Page.stateBattle.logicUpdate=function()
		{
			var stage=this.page.vwBattleStage;

			stage.getBattleLog();
			if(!this.endTimer && stage.deadRate < 100)
			{
				this.aboutUpdateLUDT(20*1000,this.logicUpdate);
			}
		};
		__Page.stateBattle.aboutTimerLUDT=function(time,fun)
		{
			if(this.timerLUDT)
			{
				this.appEnv.layer.clearTimeout(this.timerLUDT);
				this.timerLUDT=null;
			}
			if(fun)
				this.timerLUDT=this.appEnv.layer.setTimeout(time,fun,this);
		};
		__Page.stateBattle.aboutUpdateLUDT=function(time,fun)
		{
			if(this.updateLUDT)
			{
				this.appEnv.layer.clearTimeout(this.updateLUDT);
				this.updateLUDT=null;
			}
			if(fun)
				this.updateLUDT=this.appEnv.layer.setTimeout(time,fun,this);
		};
		__Page.stateBattle.start3mCountDown=function(time)
		{
			if(time>0)
			{
				var img=this.page.imgLib["cdNum"+time];
				if(img)this.Timer3mHud.setTexUV([img.tex_u,img.tex_v,img.tex_w,img.tex_h]);
				this.appEnv.addZoomScale(this.Timer3mHud,[0,0,0],[2,2,1],0.5);
				this.aboutTimerLUDT(1000,function(){
					this.start3mCountDown(time-1);
				},this.timerLUDT);
				this.page.audioObject.playSound("btn_click");
			}else{
				this.Timer3mHud.setDisplay(0);
				this.stage.startDefense();
			}

		};
		__Page.stateBattle.startCountDown=function()
		{
			var stage=this.page.vwBattleStage;
			if(stage.state>0)
			{
				return;
			}
			stage.state++;
			this.battleTimeHud.setTitle(this.page.appEnv.textLib.BattleEndIn);

			this.battleTimeHud.start(3*60);
			//this.aboutTimerLUDT(3*60*1000,this.endCountDown,this.timerLUDT);
			this.endTimer=0;
			this.logicUpdate();
		};
		__Page.stateBattle.onTimer=function()
		{
			var self=this.obj;
			var stage=self.page.vwBattleStage;
			if(stage.state==0)
				self.startCountDown();
			else
				self.endCountDown();
		};
		__Page.stateBattle.endCountDown=function()
		{
			this.battleTimeHud.setCallBack(null,this);
			this.appEnv.layer.setUPF(this.upf);
			this.speedBtn.setDisplay(0);
			var stage=this.page.vwBattleStage;
			if(stage.state<2)
				stage.state=2;
			this.endTimer=1;
			this.aboutUpdateLUDT(0,null,this.updateLUDT);
			this.aboutTimerLUDT(0,null,this.timerLUDT);
			this.Timer3mHud.setDisplay(0);
			stage.getBattleLog();
		};

		__Page.stateBattle.onEndBattleClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var textLib=this.page.appEnv.textLib;
				this.appEnv.showPmtDlg(this.page.pmtChoose,0,
				{
					title:textLib.ConfirmEndBattle,info:textLib.sureEndBattle,
					pmtFunc:this._onEndBattleClk,pmtObj:this,
				});
			}
		};
		__Page.stateBattle._onEndBattleClk=function(abort)
		{
			if(!abort)
			return;
			var stage=this.page.vwBattleStage;
			if(stage.state==0 || stage.putUnitNum==0)
			{
				this.go2Home();
			}else if(stage.state==1){
				this.endCountDown();
			}
		}
		__Page.stateBattle.go2Home=function()
		{
			var stage=this.page.vwBattleStage;
			stage.setNavBoxRangeByScale(1);
			this.appEnv.addScale(stage.gameHud,[1,1,1],[0.8,0.8,1]);
			this.appEnv.showSearchAni(function(){
				if(window.aisNTEngine)
				{
					var time=0;
					window.aisNTEngine.execFakeCmd(null,"MacDefense_GoHome",{callBack:this._go2Home,callObj:this},null,time);
				}
			},this);
		};

		__Page.stateBattle._go2Home=function(svrvo)
		{
			if(svrvo)
			{
				//this.page.setCookie("Runtime","Save",toJSON(svrvo),0);
				this.appEnv.saveCityVO(svrvo,"Save");
			}
			this.page.setCookie("Runtime","StartGame","Load",0);
			switchApp(this.page.genPageURL("ui_ais.jml"));
		};

		__Page.stateBattle.reSet=function()
		{
			var stage=this.page.vwBattleStage;
			this.aboutTimerLUDT(0,null,this.timerLUDT);
			this.Timer3mHud.setDisplay(0);
			this.appEnv.delSearchAni(0);
			this.appEnv.addScale(stage.gameHud,[0.8,0.8,1],[1,1,1]);
			this.endTimer=0;
			this.battleTimeHud.setTitle(this.page.appEnv.textLib.BattleStartIn);
			this.lbItems.clearItems();
			stage.reSet();
			this.onGameLoaded(1);
			this.oldDeadRate=0;
			this.curSpeed=0;
			spd=this.speed[this.curSpeed];
			this.speedBtn.setText(this.page.appEnv.textLib["X"+spd]);
			this.appEnv.layer.setUPF(this.upf);
		};

		__Page.stateBattle.refreshOppDeads=function(unit)
		{
			var n,stage=this.page.vwBattleStage;
			var textLib=this.appEnv.textLib;

			if(!unit)return;

			this.unitDeadBox._setScore(this.unitDeadBox._getScore()+unit.num);

			var idx,def,score;
			idx=stage.level.getObjDefIdx(unit.codename+unit.level);
			if(idx!=-1)
			{
				def=stage.levelVO.obj_defs[idx];
				if(def.WaveBattleScore)
				{
					score=this.unitScoreBox._getScore()+Math.floor(def.WaveBattleScore*stage.unitScoreC);
					this.unitScoreBox._setScore(score);
				}
			}
			return;
		};

		__Page.stateBattle.remainUnitScore=function()
		{
			return this.unitScoreBox._getScore();
		};

		__Page.stateBattle.remainDeadUnits=function()
		{
			return this.unitDeadBox._getScore();
		};

		__Page.stateBattle.remainTime=function()
		{
			return Math.floor(this.battleTimeHud.getTime()/1000);
		};

		__Page.stateBattle.showSettlement=function()//结算界面
		{
			//DBOut("---------showSettlement--="+toJSON(this.remainRes()));
			this.appEnv.closePmtDlg();
			this.endBattleBtn.setDisplay(0);
			this.lbItems.setDisplay(0);
			this.hudBBox.setDisplay(0);
			this.unitScoreBox.setDisplay(0);
			this.unitDeadBox.setDisplay(0);
			this.battleTimeHud.setDisplay(0);

			var url;
			url=this.page.genPageURL("ui/dlg/dlg_battleover_mac.jml");
			this.appEnv.openPageDlg(url,this);
		//	this.go2Home();
		};
		//获得战斗结果						stage.winner    1:胜利
		//获得击杀敌人总数量 			stage.foeDeadNum
		//获得击杀兵获得的成绩  	stage.foeScore
		//获得机甲剩余血量得分 		stage.macScore
		//获得剩余时间得分 				stage.timeScore
		//获得关卡能源						stage.stageReward={codename:"",num:1}
		//获得击杀敌人种类和数量 	stage.foeDeads={"codename":{codename:"",num:1,level:1,type:"foeunit",icon:""},...}
		//获得击杀敌人获得的奖励	stage.foeLoot=[{waveId:1,type:"Gem",num:1,extend1:""},...]
		//获得通关奖励						stage.stageLoot={waveId:0,type:"Gem",num:1,extend1:""};
	}
}
