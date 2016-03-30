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

		page.keyStateUtil.call(this);
		this.stage=page.vwReplayStage;
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
			this.battleLevelHud=cssLib.textFineBig.create(this.hudTCBox,[this.hudTCBox.getW()>>1,30,0],textLib.getText(textLib.OnslaughtLevel,{level:2}),150,20,1,1,1,1);
			this.replayText=cssLib.textFineMid.create(this.hudTRBox,[(this.hudTRBox.getW()>>1)+70,50-22,0],textLib.OnslaughtMode,this.hudTRBox.getW(),20,1,1,1,1,[255,255,255]);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onReplayClk);
			this.replayBtn=cssLib.normalBtn.create(this.hudBCBox,[this.hudBCBox.getW()>>1,(this.hudBCBox.getH()-80),0],keyId,0,textLib.ReplayAgain);
			this.replayBtn.setDisplay(0);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onSpeedClk);
			this.speedBtn=cssLib.normalBtn.create(this.hudBCBox,[this.hudBCBox.getW()>>1,this.hudBCBox.getH()-80,0],keyId,0,textLib.X1);
			this.speedBtn.setDisplay(0);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onHomeClk);
		//	this.homeBtn=cssLib.normalBtn.create(this.hudBLBox,[this.hudBLBox.getW()>>1,this.hudBLBox.getH()>>1,0],keyId,1,textLib.BackHome);
			var pic=imgLib.getImg("btn_backhome");
			this.homeBtn=this.hudBLBox.appendNewChild({type:"key",pos:[pic.w/2+5,this.hudBLBox.getH()-pic.h/2-5,0],css:pic,anchor_h:1,anchor_v:1,key:keyId,ui_event:1,button:1,down_scale:0.95,
				audio:this.page.audioObject.genFileURL("btn_click"),});

			var dw=200, dh=110, s=48;
			/*
			this.dmgRateBox=this.hudTLBox.appendNewChild({type:"shape",id:"dmgRateBox",pos:[0,10,0],w:dw,h:dh,items:[
				{id:"tip",type:"text",css:cssLib.textFineMid.createCSS([0,0,0],textLib["TotalDmg"],dw,20,0,0,1,1)},
				{id:"sd1",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2-s,(dh-55)/2,0]},
				{id:"sd2",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2,(dh-55)/2,0]},
				{id:"sd3",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2+s,(dh-55)/2,0]},
				{id:"s1",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2-s,(dh-55)/2,0]},
				{id:"s2",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2,(dh-55)/2,0]},
				{id:"s3",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2+s,(dh-55)/2,0]},
				{id:"num",type:"text",css:cssLib.textFineBig.createCSS([0,dh-30,0],"0%",dw,35,0,0,1,1)},
			]});
			*/
			dh=64;
			this.dmgRateBox=this.hudTLBox.appendNewChild({type:"shape",id:"dmgRateBox",pos:[0,6,0],w:dw,h:dh,items:[
				{type:"icon",pos:[10+64,dh>>1,0],tex:page.genPageURL(window.imgPath+"/icon/icon_cap_hp64_32.png"),tex_u:0,tex_v:0,tex_w:1,tex_h:1,w:64,h:64,anchor_h:2,anchor_v:1},
				//{id:"num",type:"text",css:cssLib.textFineBig.createCSS([10+64,dh>>1,0],"70",dw,35,0,1,0,1,[255,0,0])},
				{id:"num",type:"txt_score",css:cssLib.textScoreBig.createCSS([10+64,dh>>1,0],"70",dw,35,0,1,0,1,[255,0,0])},
			]});
			this.oltTipHud=this.hudBaseBox.appendNewChild({type:"icon",pos:[appEnv.scrSize[0]>>1,appEnv.scrSize[1]>>1,0],css:imgLib.getImg("olt_tip"),w:520,h:133,fade:1,fade_size:1,fade_pos:[appEnv.scrSize[0]>>1,-150,0],anchor_h:1,anchor_v:1});


			//下面这些按钮是为调试增加的:
			this.dbBtnOpen=cssLib.btnDebug.create(this.hudDBDock,">",[224,appEnv.scrSize[1]/2,0],50,appEnv.appKeys.debugSwitch);

			this.dbBtnLoadStage=cssLib.btnDebug.create(this.hudDBBox,"Load stage",[100,50,0],180,appEnv.appKeys.debugLoadStage);
			this.dbBtnLoadCookieStage=cssLib.btnDebug.create(this.hudDBBox,"Load cookie stage",[100,100,0],180,appEnv.appKeys.debugLoadCookieStage);
			cssLib.btnDebug.create(this.hudDBBox,"LoadLevel",[100,250,0],180,appEnv.appKeys.editLoadLevel);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Up",[100,500,0],180,appEnv.appKeys.debugScaleU);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Down",[100,550,0],180,appEnv.appKeys.debugScaleD);

			this.dbBtnExit=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.debugExit);

			this.debugTime=cssLib.textMid.create(this.hudDBBox,[100,20,0],"0d 0h 0m 0s",180,20,1,1,0,1,[255,128,0]);
		}

		var gameVO,list,i,n,css,keyId,savedTxt;
		var stage,level;
		stage=this.page.vwReplayStage;
		level=stage.level;
		level.onReplayDone=null;

		savedTxt=page.getCookie("Runtime","OnslaughtStage");
/*
		savedTxt=
		{
			cityInfo:toJSON({"instances": [{id:1,c:"TownHall",l:1,s:0,sg:[{t:"Gold",m:1000,c:1000}],u:[],pos:{x:15,y:15},sbf:0}],scoreBuildingNum:1}),
			"cmds":[
				{wave:1,delaytime:100,edge:0,type:"UntMarine",level:1,num:3},
				{wave:2,delaytime:103,edge:1,type:"UntSniper",level:1,num:3},
			],
		};
		savedTxt=toJSON(savedTxt);
//*/
		if(savedTxt)
		{
			gameVO=fromJSON(savedTxt);
			if(gameVO)
			{
				stage.proxyOnslaught(gameVO);
				this.stageId=gameVO.stageId;
				this.maxStage=gameVO.maxStage;
			}
		}
		this.battleLevelHud.setText(textLib.getText(textLib.OnslaughtLevel,{level:this.stageId}));
		//this.battleLevelHud.start(0);
		//this.battleLevelHud.setDisplay(0);
		this.hudShapeBox.setDisplay(0);

		this.oltTipHud.setDisplay(1);
		this.oltTipHud.fadeIn(0,0);
		this.appEnv.addZoomScale(this.oltTipHud,[0,0,0],[1.5,1.5,1],0.5);
		if(this.timerLUDT)
		{
			this.appEnv.layer.clearTimeout(this.timerLUDT);
			this.timerLUDT=null;
		}
		this.timerLUDT=this.appEnv.layer.setFrameout(80,function(){
			this.timerLUDT=null;
			this.oltTipHud.fadeOut(15,0);
		},this);

		this.onlineTime();
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
						this.reSet();
						savedVO=fromJSON(savedVO);
						this.page.vwReplayStage.scoreBldNum=savedVO.objs.length;
						this.page.vwReplayStage.level.load(savedVO);
					}
					return 1;
				};
				if(key==appEnv.appKeys.editLoadLevel)
				{
					var text=Dialogs.getText("Input Level:");
					this.page.onLoadLevel.call(this,UIBody.genPageURL("onslaught/olt"+text+".json"),function(levelVO){
						this.page.vwReplayStage.proxyOnslaught({cmds:levelVO});
						this.page.vwReplayStage.startGame();
					},this);

					return 1;
				}
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

				if(key==appEnv.appKeys.debugScaleU)
				{
					var scale;
					scale=this.page.vwReplayStage.gameHud.getScale();
					this.page.vwReplayStage.gameHud.setScale(scale+0.1);
					return 1;
				}
				if(key==appEnv.appKeys.debugScaleD)
				{
					var scale;
					scale=this.page.vwReplayStage.gameHud.getScale();
					this.page.vwReplayStage.gameHud.setScale(scale-0.1);
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

		__Page.onLoadLevel=function(path,fun,obj)
		{
			var stub;
			stub=this.page.loadFileText(path);
			stub.onLoad=this.page.onLoadLevelText;
			stub.state=this;
			stub.state.fun=fun;
			stub.state.obj=obj;
		};
		__Page.onLoadLevelText=function()
		{
			var self=this.state;
			var text;
			text="(function(page){return "+this.getText()+";})()";
			text=eval(text);
			DBOut("====text="+text);
			if(self.fun && self.obj)
				self.fun.call(self.obj,text);
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
			/*
			var stage=this.page.vwReplayStage;
			this.appEnv.layer.setUPF(this.upf);
			this.endTimer=0;
			this.battleLevelHud.setDisplay(0);

			this.replayText.setDisplay(0);
			this.replayBtn.setDisplay(1);
			this.speedBtn.setDisplay(0);

			this.hudShapeBox.setDisplay(1);
			this.dmgRateBox.setDisplay(0);
			*/
		};

		__Page.stateReplay.reSet=function()
		{
			var textLib=this.page.appEnv.textLib;
			var spd,stage=this.page.vwReplayStage;
			this.endTimer=0;
			this.battleLevelHud.setDisplay(1);

			this.appEnv.delSearchAni(0);
			this.appEnv.addScale(stage.gameHud,[0.8,0.8,1],[1,1,1]);

			this.dmgRateBox.setDisplay(1);
			//this.dmgRateBox.getItemById("s1").setDisplay(0);
			//this.dmgRateBox.getItemById("s2").setDisplay(0);
			//this.dmgRateBox.getItemById("s3").setDisplay(0);
			//this.dmgRateBox.getItemById("num")._setText("0%");
			//this.dmgRateBox.getItemById("num")._setText("70");
			this.dmgRateBox.getItemById("num")._setScore(70);
			this.replayText.setDisplay(1);
			this.replayBtn.setDisplay(0);
			//this.speedBtn.setDisplay(1);
			this.curSpeed=0;
			spd=this.speed[this.curSpeed];
			this.speedBtn.setText(textLib["X"+spd]);
			stage.reSet();
			this.onGameLoaded(1);
			this.appEnv.layer.setUPF(this.upf);
			stage.initCityBlds();
			stage.startGame();
			if(this.page.audioObject && this.page.audioObject._init)
			{
				this.page.audioObject.playMp3("battle_1",-1);
			}
		};

		__Page.stateReplay.giveStar=function()
		{
			var star,stage=this.page.vwReplayStage;
			star=stage.star;
			/*
			if(star>0){
				this.dmgRateBox.getItemById("s1").setDisplay(1);
			}
			if(star>1){
				this.dmgRateBox.getItemById("s2").setDisplay(1);
			}
			if(star>2){
				this.dmgRateBox.getItemById("s3").setDisplay(1);
			}
			*/
			return star;
		};

		__Page.stateReplay.refreshDmgRate=function()
		{
			var rate,stage=this.page.vwReplayStage;
			rate=Math.floor(stage.deadRate);
			//this.dmgRateBox.getItemById("num")._setText(rate+"%");
			//this.dmgRateBox.getItemById("num")._setText(Math.max(0,70-rate)+"");
			this.dmgRateBox.getItemById("num")._setScore(Math.max(0,70-rate));
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
			}

		};
		__Page.stateReplay.onHomeClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{


				var textLib=this.page.appEnv.textLib;
				this.appEnv.showPmtDlg(this.page.pmtChoose,0,
				{
					title:textLib.ConfirmEndOnslaught,info:textLib.sureEndOnslaught,//修改修改离开的网络消息
					pmtFunc:this._onHomeClk,pmtObj:this,
				});
			}
		};
		__Page.stateReplay._onHomeClk=function(abort)
		{
			if(!abort)
			return;
			this.onFail();
		};

		__Page.stateReplay.go2Home=function()
		{
			if(window.aisNTEngine)
			{
				var time=0;
				window.aisNTEngine.execFakeCmd(null,"Return_Home",{callBack:this._go2Home,callObj:this},null,time);
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

		__Page.stateReplay.onUnitDead=function()
		{
			var stage=this.page.vwReplayStage;
			var textLib=this.page.appEnv.textLib;

			if(stage.deadRate >= 70)//失败
			{
				stage.setResultStage(1);
				stage.setResultStage(10);
				setTimeout(2000,function(){
					this.appEnv.showPmtDlg(this.page.pmtInfo,0,
					{
						title:textLib.OnslaughtFail,info:textLib.sureOnslaught,//修改修改离开的网络消息
						pmtFunc:this.onFail,pmtObj:this,force:1,
					});
					if(this.page.audioObject && this.page.audioObject._init)
					{
						this.page.audioObject.playMp3("battle_lost",0);
					}
				},this);
				return;
			}
			if(stage.deadNum>=stage.unitNum)//胜利
			{
				stage.setResultStage(1);
				stage.setResultStage(10);
				setTimeout(2000,function(){
					this.appEnv.showPmtDlg(this.page.pmtChoose,0,
					{
						title:textLib.OnslaughtWin,info:textLib.sureOnslaughtNext,//修改修改离开的网络消息
						pmtFunc:this.onWin,pmtObj:this,force:1,
					});
					if(this.page.audioObject && this.page.audioObject._init)
					{
						this.page.audioObject.playMp3("winwinwin",0);
					}
				},this);
				return;
			}
		};

		__Page.stateReplay.endClk=function(fun,stageId,result)
		{
			var stage=this.page.vwReplayStage;
			stage.setNavBoxRangeByScale(1);
			this.appEnv.addScale(stage.gameHud,[1,1,1],[0.8,0.8,1]);
			this.appEnv.showSearchAni(function(){
				if(window.aisNTEngine)
				{
					var time=0;
					window.aisNTEngine.execFakeCmd(null,"PVE2_Result",{stageId:stageId,result:result},null,time);
				}
				if(fun)fun.call(this);
			},this);
		};

		__Page.stateReplay.onFail=function()
		{
			this.clearOnlineTM();
			this.endClk(this.go2Home,this.stageId,-1);
		};

		__Page.stateReplay.onWin=function(abort)
		{
			this.clearOnlineTM();
			var time=0;
			if(!abort)//取消
			{
				this.endClk(this.go2Home,this.stageId,1);
			}else{//确定
				this.endClk(this.go2Next,this.stageId,1);
			}
		};

		__Page.stateReplay.go2Next=function()
		{
			if(this.stageId<this.maxStage)
			this.stageId++;
			this.page.appEnv.loadFile(UIBody.genPageURL("onslaught/olt"+this.stageId+".json"),function(levelVO){

				var savedTxt=this.page.getCookie("Runtime","OnslaughtStage");
				savedTxt=fromJSON(savedTxt);
				var data={cityInfo:savedTxt.cityInfo,cmds:levelVO,stageId:this.stageId,maxStage:this.maxStage};
				this.page.setCookie("Runtime","OnslaughtStage",toJSON(data),0);
				this.reSet();
			},this);

		};

		__Page.stateReplay.onlineTime=function()
		{
			if(window.aisNTEngine)
			{
				var time=0;
				window.aisNTEngine.execFakeCmd(null,"PVE2_Result",{stageId:this.stageId,result:-1},null,time);
			}
			this.onlineTM=this.appEnv.layer.setTimeout(2*60*1000,this.onlineTime,this);
		};
		__Page.stateReplay.clearOnlineTM=function()
		{
			if(this.onlineTM)
			{
				this.appEnv.layer.clearTimeout(this.onlineTM);
				this.onlineTM=null;
			}
		};
	}
}
