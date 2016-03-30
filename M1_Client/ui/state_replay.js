if(!__Page.stateReplay)
{
	__Page.stateReplay={
		page:__Page,
		name:"ReplayState",
		lastLUDT:0,
		lockLUDT:1,
		timerLUDT:null,
		updateLUDT:null,
		pushMsgs:[],
		speed:[1,2,4],
		curSpeed:0
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateReplay);

	//初始化State
	__Page.stateReplay.init=function(appEnv)
	{
		var page;
		var imgLib;
		var cssLib;
		var city;
		var layer,keyid;

		this.appEnv=appEnv;
		appEnv.stateReplay=this;
		appEnv.entryState=this;
		page=this.page;
		imgLib=page.imgLib;
		cssLib=page.cssLib;
		var textLib=page.appEnv.textLib;

		page.keyStateUtil.call(this);
		this.stage=page.vwReplayStage;

		var savedTxt=page.getCookie("Runtime","ReplayStage");
		page.setCookie("Runtime","ReplayStage","",0);
		if(savedTxt)
		{
			this.gameVO=fromJSON(savedTxt);
		}
		page.vwReplayStage.initStage();

		if(window.aisNTEngine)
		{
			window.aisNTEngine.initBattleCom(page.vwReplayStage,window.GameSocketUrl);
		}

		//创建State专署UI控件:
		{
			layer=this.appEnv.layer;
			appEnv.hudBaseBox=this.hudBaseBox=layer.addHudItem({type:"shape",pos:[0,0,0],w:20,h:20,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});

			this.hudShapeBox=this.hudBaseBox.appendNewChild({
				type:"shape",ch_align:0,cv_align:0,pos:[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:200,border_a:0,ui_event:1,
				fade:1,fade_size:1,fade_alpha:0,display:0
			});

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

			//联盟技能List
			this.clantechLabel=this.hudTRBox.appendNewChild({type:"text",css:cssLib.textFineSmall.createCSS([236,88,0],textLib["BattleClantecLabel"],150,20,1,1,1,1),display:0});
			this.clantechItems=this.hudTRBox.appendNewChild({
				"type":"listbox","pos":[300-64*6-20,88,0],"w":64*6,"h":64,"anchor_h":0,"anchor_v":0,"arrange":1,"item_w":50,"item_h":50,"item_alpha_down":0.75,ui_event:0,
				key:-1,show_align:2,hot_check:1,"item_alpha_down":1.0,"item_alpha_dimmed":1.0,"item_size_down":1.0,"item_size_check":1.0,"end_gap":1,"sub_event":2,"move_gap":20,"fast_scroll":1,show_fx:0,
				display:1,fade:1,fade_pos:[64,130,0],fade_size:1,fade_alpha:0,state:this,clip:0
			});
			//底部的ListBox
			keyid=appEnv.hudKeys.getKey();

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
		DBOut("stateReplay.init: "+appEnv);
		this.appEnv.layer.setDisplay(0);
	};

	__Page.stateReplay.enter=function(preState)
	{
		this.upf=this.appEnv.layer.getUPF();
	};

	__Page.stateReplay.leave=function(nextState)
	{
		this.appEnv.layer.setUPF(this.upf);
		this.battleId="";
		this.page.setCookie("Runtime","ReplayStageId","null",0);
		//TODO:code this:
	};

	__Page.stateReplay.onGameLoaded=function(notfirst)
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var textLib=page.appEnv.textLib;
		var keyId;


		if(!notfirst)
		{
			appEnv.initPlayTime(1,0);
			this.battleTimeHud=cssLib.battleTime.create(this.hudTCBox,[this.hudTCBox.getW()>>1,60,0],0);
			this.battleTimeHud.setTitle(textLib.ReplayEndIn);
			this.replayText=cssLib.textFineMid.create(this.hudTRBox,[(this.hudTRBox.getW()>>1)+70,50-22,0],textLib.Replay,this.hudTRBox.getW(),20,1,1,1,1,[255,0,0]);

			this.mc15Icon=this.hudTLBox.appendNewChild({type:"icon",pos:[30,160,0],tex:page.genURL(window.imgPath+"/icon/icon_goldcard64_32.png"),tex_u:0, tex_v:0, tex_w:1, tex_h:1,w:64,h:64,anchor_h:1,anchor_v:1,display:0});
			this.cubeCardIcon=this.hudTLBox.appendNewChild({type:"icon",pos:[30+100,160,0],tex:page.genURL(window.imgPath+"/icon/icon_cubecard64_32.png"),tex_u:0, tex_v:0, tex_w:1, tex_h:1,w:64,h:64,anchor_h:1,anchor_v:1,display:0});

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onReplayClk);
			this.replayBtn=cssLib.normalBtn.create(this.hudBCBox,[(this.hudBCBox.getW()>>1),(this.hudBCBox.getH()-80),0],keyId,0,textLib.ReplayAgain);
			this.replayBtn.setDisplay(0);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onShareClk);
			this.shareBtn=cssLib.normalBtn.create(this.hudBCBox,[(this.hudBCBox.getW()>>1),(this.hudBCBox.getH()-80),0],keyId,0,textLib.ShareVideo);
			this.shareBtn.setDisplay(0);


			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onSpeedClk);
			this.speedBtn=cssLib.normalBtn.create(this.hudBCBox,[(this.hudBCBox.getW()>>1),this.hudBCBox.getH()-80,0],keyId,0,textLib.X1);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onHomeClk);
		//	this.homeBtn=cssLib.normalBtn.create(this.hudBLBox,[this.hudBLBox.getW()>>1,this.hudBLBox.getH()>>1,0],keyId,1,textLib.BackHome);
			var pic=imgLib.getImg("btn_backhome");
			this.homeBtn=this.hudBLBox.appendNewChild({type:"key",pos:[pic.w/2+5,this.hudBLBox.getH()-pic.h/2-5,0],css:pic,anchor_h:1,anchor_v:1,key:keyId,ui_event:1,button:1,down_scale:0.95,
				audio:this.page.audioObject.genFileURL("btn_click"),});

			var dw=200, dh=110, s=48;
			this.dmgRateBox=this.hudTLBox.appendNewChild({type:"shape",id:"dmgRateBox",pos:[0,10+5,0],w:dw,h:dh,items:[
				{id:"tip",type:"text",css:cssLib.textFineMid.createCSS([0,0,0],textLib["TotalDmg"],dw,20,0,0,1,1)},
				{id:"sd1",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2-s,(dh-55)/2,0]},
				{id:"sd2",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2,(dh-55)/2,0]},
				{id:"sd3",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2+s,(dh-55)/2,0]},
				{id:"s1",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2-s,(dh-55)/2,0]},
				{id:"s2",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2,(dh-55)/2,0]},
				{id:"s3",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2+s,(dh-55)/2,0]},
				{id:"num",type:"text",css:cssLib.textFineBig.createCSS([0,dh-30,0],"0%",dw,35,0,0,1,1)},
			]});


			//下面这些按钮是为调试增加的:
			this.dbBtnOpen=cssLib.btnDebug.create(this.hudDBDock,">",[224,appEnv.scrSize[1]/2,0],50,appEnv.appKeys.debugSwitch);

			this.dbBtnLoadStage=cssLib.btnDebug.create(this.hudDBBox,"Load stage",[100,50,0],180,appEnv.appKeys.debugLoadStage);
			this.dbBtnLoadCookieStage=cssLib.btnDebug.create(this.hudDBBox,"Load cookie stage",[100,100,0],180,appEnv.appKeys.debugLoadCookieStage);
			this.dbBtnLoadStage=cssLib.btnDebug.create(this.hudDBBox,"Load replay",[100,150,0],180,appEnv.appKeys.debugLoadReplay);
			this.dbBtnSaveReplay=cssLib.btnDebug.create(this.hudDBBox,"Save replay",[100,200,0],180,appEnv.appKeys.debugSaveReplay);
			this.dbBtnExit=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.debugExit);

			this.debugTime=cssLib.textMid.create(this.hudDBBox,[100,20,0],"0d 0h 0m 0s",180,20,1,1,0,1,[255,128,0]);
		}

		var gameVO,list,i,n,css,keyId,savedTxt;
		var stage,level;
		stage=this.page.vwReplayStage;
		level=stage.level;

		if(page.getCookie("Runtime","ReplayStageId")&&(page.getCookie("Runtime","ReplayStageId")!="null"))
		{
			this.battleId=fromJSON(page.getCookie("Runtime","ReplayStageId")).id;
		}
		else
			this.battleId="";
/*
		savedTxt=
		{
			cityInfo:{name:"Mark",level:13,honor:{win:100,fail:10},"instances": [{id:1,c:"TownHall",l:1,s:0,sg:[{t:"Gold",m:1000,c:1000}],u:[],pos:{x:15,y:15},sbf:0}],scoreBuildingNum:1},

			"endTick": 1629,
			"cmds": [[2, 50, 14.731475830078125, 22.34259033203125, 165, 1], [2, 52, 21.740737915039062, 15.296295166015625, 165, 1], [2, 60, 15.6851806640625, 10.907394409179688, 165, 1]], "hps": [{"uid": 0, "hp": 34, "rate": 0.34}]
		};
		savedTxt=toJSON(savedTxt);
*/
		if(this.gameVO)
		{
			stage.proxyBattle(this.gameVO);
			this.mc15Icon.setDisplay(this.gameVO.advMC15Defense?1:0);
			this.cubeCardIcon.setDisplay(this.gameVO.buffBCCDefense?1:0);

			if(stage.battleInfo.oppCity)
			{
				items=[];
				var tech,techLib,clanDef,lv,j,k=0;
				tech=stage.battleInfo.oppCity.clanTechs;
				techLib=window.aisEnv.defLib.clanTec;
				clanDef=window.aisEnv.defLib.clan.levels[stage.battleInfo.oppCity.clanLevel-1];
				if(tech && clanDef)
				{
					for(i=0; i<tech.length; i++)
					{
						if(!techLib[tech[i].codename] || techLib[tech[i].codename].showType!=1)continue;
						k++;
						lv=1;
						for(j=0;j<clanDef.tec.length;j++)
						{
							if(clanDef.tec[j].codeName==tech[i].codename)
							{
								lv=clanDef.tec[j].level;
								break;
							}
						}
						items.push({
							type:"icon",pos:[32,32,0],w:50,h:50,tex:this.page.genPageURL(window.imgPath+"/icon/icon_"+tech[i].codename+"64_32.png"),
							tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,
							items:[
								{type:"text",css:cssLib.textFineSmall.createCSS([15,10,0],"Lv."+lv,80,20,1,1,1,1)}
							]
						});
					}
				}
				this.clantechItems.clearItems();
				this.clantechItems.addItems(items);
				this.clantechItems.setDisplay(1);
				if(k)
					this.clantechLabel.setDisplay(1);
			}
		}
		if(this.battleId)
		{
			this.replayBtn.setPos([(this.hudBCBox.getW()>>1)-150,(this.hudBCBox.getH()-80),0]);
			this.speedBtn.setPos([(this.hudBCBox.getW()>>1)-150,(this.hudBCBox.getH()-80),0]);
			this.shareBtn.setPos([(this.hudBCBox.getW()>>1)+150,(this.hudBCBox.getH()-80),0]);
			this.shareBtn.setDisplay(1);
		}
		//this.battleTimeHud.start(0);
		//this.battleTimeHud.setDisplay(0);
		this.hudShapeBox.setDisplay(0);
	};

	//--------------------------------------------------------------------------
	//改变模式状态的函数
	//--------------------------------------------------------------------------
	{
		__Page.stateReplay.showBldMenu=function(hotId)
		{
			var i,n,list;
			var appEnv=this.appEnv;
			list=this.menuBtns;
			n=list.length;
			for(i=0;i<n;i++)
			{
				appEnv.hudIn(list[i],5+Math.abs((i-hotId)*1));
			}
		};

		__Page.stateReplay.hideBldMenu=function(hotId)
		{
			var i,n,list;
			var appEnv=this.appEnv;
			list=this.menuBtns;
			n=list.length;
			for(i=0;i<n;i++)
			{
				appEnv.hudOut(list[i],5+Math.abs((i-hotId)*1));
			}
		};
	}

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.stateReplay.onKey=function(msg,key,way,extra)
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
					Dialogs.openFile("Open saved scene",["*.js"],this.page.onLoadStage,this);
					return 1;
				}
				if(key==appEnv.appKeys.debugLoadCookieStage)
				{
					var savedVO;
					savedVO=this.page.getCookie("COC","SaveStage");
					if(savedVO){
						savedVO=fromJSON(savedVO);

						this.page.vwReplayStage.level.load(savedVO);
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
					Dialogs.saveToFile(toJSON(this.page.vwReplayStage.level.getBattleLog()),["*.js","*.*"]);
					return 1;
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
			DBOut("stateReplay.onKey: "+msg+", "+key);
			if(ret)
				return ret;
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
			self.page.vwReplayStage.level.load(savedVO);
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
			self.page.vwReplayStage.level.loadReplay(savedVO);
		};

		__Page.stateReplay.onReplayClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.reSet();
			}
		};

		__Page.stateReplay.onReplayDone=function()
		{
			var stage=this.page.vwReplayStage;
			this.appEnv.layer.setUPF(this.upf);
			this.endTimer=0;
			this.battleTimeHud.setDisplay(0);
			if(this.battleTimeHud.setTimerFactor)
				this.battleTimeHud.setTimerFactor(1);

			this.replayText.setDisplay(0);
			this.replayBtn.setDisplay(1);
			this.speedBtn.setDisplay(0);

			this.hudShapeBox.setDisplay(1);
			this.dmgRateBox.setDisplay(0);

			this.clantechItems.setDisplay(0);
			this.clantechLabel.setDisplay(0);

			this.appEnv.showPlayTimeCheck(1);
		};

		__Page.stateReplay.reSet=function()
		{
			var textLib=this.page.appEnv.textLib;
			var spd,stage=this.page.vwReplayStage;
			this.endTimer=0;
			this.battleTimeHud.setDisplay(1);

			this.dmgRateBox.setDisplay(1);
			this.dmgRateBox.getItemById("s1").setDisplay(0);
			this.dmgRateBox.getItemById("s2").setDisplay(0);
			this.dmgRateBox.getItemById("s3").setDisplay(0);
			this.dmgRateBox.getItemById("num")._setText("0%");
			this.replayText.setDisplay(1);
			this.replayBtn.setDisplay(0);
			this.speedBtn.setDisplay(1);


			this.shareBtn.setDisplay(1);
			this.curSpeed=0;
			spd=this.speed[this.curSpeed];
			this.speedBtn.setText(textLib["X"+spd]);
			stage.reSet();
			this.onGameLoaded(1);
			this.appEnv.layer.setUPF(this.upf);
			if(this.battleTimeHud.setTimerFactor)
				this.battleTimeHud.setTimerFactor(spd);
			stage.initCityBlds();
			stage.startGame();
		};

		__Page.stateReplay.giveStar=function()
		{
			var star,stage=this.page.vwReplayStage;
			star=stage.star;
			if(star>0){
				this.dmgRateBox.getItemById("s1").setDisplay(1);
			}
			if(star>1){
				this.dmgRateBox.getItemById("s2").setDisplay(1);
			}
			if(star>2){
				this.dmgRateBox.getItemById("s3").setDisplay(1);
			}
			return star;
		};

		__Page.stateReplay.refreshDmgRate=function()
		{
			var rate,stage=this.page.vwReplayStage;
			rate=Math.floor(stage.deadRate);
			this.dmgRateBox.getItemById("num")._setText(rate+"%");
			return rate;
		};

		__Page.stateReplay.onSpeedClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var spd,stage=this.page.vwReplayStage;
				var textLib=this.page.appEnv.textLib;

				this.curSpeed++;
				this.curSpeed%=this.speed.length;
				spd=this.speed[this.curSpeed];
				this.speedBtn.setText(textLib["X"+spd]);
				this.appEnv.layer.setUPF(this.upf*spd);
				if(this.battleTimeHud.setTimerFactor)
				this.battleTimeHud.setTimerFactor(spd);
			}

		};

		__Page.stateReplay.onShareClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var textLib=this.appEnv.textLib;
				var nowTime = Date.now(),starTime;
				var page=this.page;
				var canShare=false;
				if(page.getCookie("M1","ShareVideoTime"))
				{
					starTime=fromJSON(page.getCookie("M1","ShareVideoTime"));
					if((nowTime - starTime)>600000)
					{
						canShare=true;
					}
				}
				else
				{
					canShare=true;
				}
				if(canShare)
				{
					this.appEnv.showPmtDlg(this.page.pmtShare,0,
						{
							title:textLib["ShareVideo"],info:"",
							ui:"share",
							pmtFunc:function(ok,battleId){
								if(ok)//
								{
									if(page.getCookie("Runtime","CityAllianceId")!="0")
									{
										this.appEnv.stateLogs.showLog(textLib["ShareOk"]);
										this.page.setCookie(cookieDomain,"ShareWords",this.page.pmtShare.txtMsg,0);
										this.page.setCookie("M1","ShareVideoTime",toJSON(nowTime),0);
										window.aisNTEngine.execFakeCmd(null,"GameShareBattle",{battleId:battleId,words:this.page.pmtShare.txtMsg},null,0);
									}else
										this.appEnv.stateLogs.showLog(textLib["ShareBattleError"]);
								}
							},pmtObj:this,pmtParam:this.battleId?this.battleId:0
						}
					);
				}else
				{
					var cdTime = 600000 -(nowTime-starTime);
					this.appEnv.stateLogs.showLog(textLib["ShareCDTime"](cdTime));
				}
			}

		};
		__Page.stateReplay.onHomeClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var stage=this.page.vwReplayStage;
				this.battleId="";
				this.page.setCookie("Runtime","ReplayStageId","null",0);
				stage.setNavBoxRangeByScale(1);
				this.appEnv.addScale(stage.gameHud,[1,1,1],[0.8,0.8,1]);
				this.appEnv.showSearchAni(function(){
					if(window.aisNTEngine)
					{
						var time=0;
						window.aisNTEngine.execFakeCmd(null,"Return_Home",{callBack:this._go2Home,callObj:this},null,time);
					}
				},this);
			}
		};

		__Page.stateReplay._go2Home=function(svrvo)
		{
			if(svrvo)
			{
				//this.page.setCookie("Runtime","Save",toJSON(svrvo),0);
				this.appEnv.saveCityVO(svrvo,"Save");
			}
			this.page.setCookie("Runtime","StartGame","Load",0);
			switchApp(this.page.genPageURL("ui_ais.jml"));
		};
	}
}
if(!window.aisEnv)
{
	window.aisEnv={defLib:{globals:{},clanTec:{},clan:{},buff:{}},textLib:{clantecName:{},clantecInfo:{}}};
}
