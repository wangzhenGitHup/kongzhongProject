//*********************************************************
//游戏界面环境*********************************************
//*********************************************************
if(!__Page.appEnv)
{
	__Page.appEnv={
		page:__Page,backLayer:null,layer:null,dlgLayer:null,pmtLayer:null,prePmtLayer:null,
		dlgBox:null,
		curState:null,nextState:null,stateParam:null,//States
		curDlg:null,nextDlg:null,dlgParam:null,pageDlgParam:null,//一级对话框
		curPmt:null,nextPmt:null,pmtParam:null,pagePmtParam:null,//二级对话框
		liveStates:[],//需要自动初始化的States
		dynaStates:[],//需要自动初始化的States,用途?
		subDlgPages:[],
		entryState:null,//启动进入的State
		pushMsgs:[],
		//键值、消息管理对象:
		hudKeys:{
			curValue:128,used:[],ref:{},
			getKey:function(obj)
			{
				var key;
				if (this.used.length) {
					key = this.used.pop();
				} else {
					this.curValue++;
					key = this.curValue;
				}
				this.ref[key] = null;//obj;
				return key;
			},
			delKey:function(key)
			{
				//this.ref[key] = null;
				//this.used.push(key);
			}
		},
		appKeys:
		{
			navBox:-1,
			confirmNewBld:-3,
			abortNewBld:-4,

			dlgBack:-6,
			dlgClose:-7,

			bldUpgrade:-15,
			bldInfo:-16,
			bldHarvest:-17,
			bldTrain:-18,
			bldMakeSpell:-19,
			bldResearch:-20,
			bldRequsetUnit:-21,
			bldClanInfo:-22,
			bldBoost:-23,
			bldSell:-24,
			bldRemove:-25,
			bldGraveRemove:-26,
			abortBuild:-27,
			bldGemDone:-28,
			uiAchvmnt:-29,
			uiGuideMask:-30,
			btnShop:-31,
			btnClose:-32,
			btnNext:-33,
			lbShopItems:-34,
			pmtOk:-35,
			pmtCancel:-36,
			btnGemFin:-37,
			btnSelRow:-38,
			bldAmmoRelod:-39,
			btnAttack:-40,
			btnPve1:-41,
			btnAttackPve:-42,
			bldGift:-43,
			bldNotice:-44,
			btnAchievement:-45,
			btnPve:-46,
			bldSwitchMode:-47,
			bldMakePart:-48,
			bldMakeAddOn:-49,
			bldAssemble:-50,
			bldGemFix:-51,
			bldMacMode:-52,
			btnMechNo2Atk:-53,
			bldMakeBox:-54,
			bldCutConstructTime:-55,
			bldCutCstTime:-56,
			bldResidence:-57,
			bldOpenBox:-58,
			bldReset:-59,
			bldResetAll:-60,
			bldMakeItem:-61,

			bldTrainUnit_1:-100,
			bldTrainUnit_2:-102,
			bldTrainUnit_3:-104,
			bldTrainUnit_4:-106,
			bldTrainUnit_5:-108,
			bldTrainUnit_6:-110,
			bldTrainUnit_7:-112,
			bldTrainUnit_8:-114,
			bldTrainUnit_9:-116,
			bldTrainUnit_10:-118,

			debugSave:-201,
			debugSwitch:-202,
			debugTimeGap1:-203,
			debugTimeGap2:-204,
			debugTimeGap3:-205,
			debugTimeGap4:-206,
			debugDonated:-207,
			debugDonate:-208,
			debugLoadStage:-209,
			debugLoadCookieStage:-210,
			debugLoadReplay:-211,
			debugSaveReplay:-212,
			debugScaleU:-213,
			debugScaleD:-214,
			debugExit:-300,

			editBlds:-500,
			editFxs:-501,
			editPrjs:-502,
			editSave:-503,
			editSaveCookie:-504,
			editLoad:-505,
			editLoadLevel:-506,
			editExit:-507,
			bldShopType_1:-600,
			bldShopType_2:-602,
			bldShopType_3:-604,
			bldShopType_4:-606,
			bldShopType_5:-608,
			bldShopType_6:-610,

			btnTraining_1:-701,
			btnTraining_2:-702,
			btnTraining_3:-703,
			btnTraining_4:-704,
			btnTraining_5:-705,

		}
	};

<include check="0">"audio_base.jml"</include>
<include check="0">"text/text_filter.js"</include>
<include check="0">"MapPath.js"</include>
<include check="0">"app_envx.js"</include>
<include check="0">"snow.js"</include>

	//初始化界面环境对象
	__Page.appEnv.init=function(flag)
	{
		//TODO:Complete this!
		var i,n,list;
		var scrSize;
		var page=this.page;
		this.name="appEnv";
		this.layer=this.page.getElementById("ui-layer");
		this.dlgLayer=this.page.getElementById("dlg-layer");
		this.pmtLayer=this.page.getElementById("dlg-layer2");
		this.actLayer=this.page.getElementById("act-layer");
		this.act2Layer=this.page.getElementById("act2-layer");
		this.advSpSys=this.actLayer.getAdvSpSys();
		this.advSpSys.owner=this;
		this.advSpSys.loadFmURL(this.page.genURL(window.imgPath+"/buildings/search3.spl"));
		scrSize=this.scrSize=[__Page.getW(),__Page.getH()];
		if(flag)
		{
			this._init(flag);
			return;
		}
		this.advSpSys.onLoadDone=function(){
			var self=this.owner;
			self._init();
		};

		if(this.page.audioObject && !this.page.audioObject._init)
		{
			this.page.audioObject.init(this);
		}
	};
	__Page.appEnv._init=function(flag)
	{
		var i,n,list;
		var page=this.page;
		var scrSize;
		scrSize=this.scrSize=[this.page.getW(),this.page.getH()];
		if(!flag)this.delSearchAni(1);
		if(window.aisEnv)
		{
			window.aisEnv.appEnv=this;
			if(window.aisTestGame)
			{
				this.userKing=aisTestGame.testKing;
			}
		}
		this.payingObj={};

		//Load fonts here:
		if(System.loadFont)
		{
			/*System.loadFont(0,"gxfont3_24",32,"s","","m");
			System.loadFont(1,"gxfont_24",32,"s","","m");
			System.loadFont(2,"gxfont1_16",32,"s","","m");
			System.loadFont(3,"vgame16",32,"s","","m");
			System.loadFont(4,"vgame16",32,"s","","m");*/
		}

		//一级对话框用来用来遮挡下面界面的蒙板
		this.dlgMask=this.dlgLayer.addHudItem({
			type:"shape",id:"dlgMask",pos:[0,0,0],w:scrSize[0],h:scrSize[1],border_a:0,face_r:0,face_g:0,face_b:0,face_a:128,
			display:0,fade_pos:[0,0,0],fade_size:1,fade:1,fade_alpha:0
		});

		//一级对话框用来做动画的底板
		this.dlgBoxDock=this.dlgLayer.addHudItem({
			type:"shape",id:"dlgDock",pos:[Math.floor(scrSize[0]/2),Math.floor(scrSize[1]/2),0],w:scrSize[0],h:scrSize[1],border_a:0,face_g:0,face_a:0,anchor_h:1,anchor_v:1,ui_event:1,
			display:1,fade:1,fade_alpha:0,fade_pos:[0,0,0],fade_size:1.0
		});
		//为一级对话框动画底板增加动画Mover
		this.dlgBoxDock.adRot=this.dlgBoxDock.addAdTMFirst("rotate");
		this.dlgBoxDock.adRot.setCurValue([-3.1415926535*0.52,0,0]);
		this.dlgBoxDock.adRot.setUpdate(1,this.dlgLayer);
		this.dlgBoxDock.adSize=this.dlgBoxDock.addAdTMLast("scale");
		this.dlgBoxDock.adSize.setCurValue([1,1,1]);
		this.dlgBoxDock.adSize.setUpdate(1,this.dlgLayer);

		//一级对话框的控件底板,0,0在左上角
		this.dlgBox=this.dlgBoxDock.appendNewChild({
			type:"shape",id:"dlgBox",pos:[-Math.floor(scrSize[0]/2),-Math.floor(scrSize[1]/2)],w:scrSize[0],h:scrSize[1],border_a:0,face_r:0,face_a:0,ui_event:1,
			display:0
		});

		//二级对话框用来遮挡底层界面的蒙板:
		this.pmtMask=this.pmtLayer.addHudItem({
			type:"shape",id:"pmtMask",pos:[0,0,0],w:scrSize[0],h:scrSize[1],border_a:0,face_r:0,face_g:0,face_b:0,face_a:128,
			display:0,fade_pos:[0,0,0],fade_size:1,fade:1,fade_alpha:0
		});
		//二级对话框用来做动画的底板:
		this.pmtBoxDock=this.pmtLayer.addHudItem({
			type:"shape",id:"pmtDock",pos:[Math.floor(scrSize[0]/2),Math.floor(scrSize[1]/2),0],w:scrSize[0],h:scrSize[1],border_a:0,face_g:255,face_a:0,anchor_h:1,anchor_v:1,ui_event:1,
			display:0,fade:1,fade_alpha:0,fade_pos:[0,0,0],fade_size:1.0
		});
		//为2级对话框动画底板增加动画Mover
		this.pmtBoxDock.adRot=this.pmtBoxDock.addAdTMFirst("rotate");
		this.pmtBoxDock.adRot.setCurValue([-3.1415926535*0.52,0,0]);
		this.pmtBoxDock.adRot.setFactor(0,0.5);
		this.pmtBoxDock.adRot.setUpdate(1,this.pmtLayer);
		this.pmtBoxDock.adSize=this.pmtBoxDock.addAdTMLast("scale");
		this.pmtBoxDock.adSize.setFactor(0,0.5);
		this.pmtBoxDock.adSize.setCurValue([1,1,1]);
		this.pmtBoxDock.adSize.setUpdate(1,this.pmtLayer);

		//2级对话框的控件底板,0,0在左上角
		this.pmtBox=this.pmtBoxDock.appendNewChild({
			type:"shape",id:"pmtBox",pos:[-Math.floor(scrSize[0]/2),-Math.floor(scrSize[1]/2),0],w:scrSize[0],h:scrSize[1],border_a:0,face_r:80,face_a:0,ui_event:1,
			display:1
		});

		//几种对话框的参数【zz】
		this.dlgInfos=[
			{size:[this.scrSize[0],this.scrSize[1]],box:this.dlgBox,frame:"box_dlginner"},//0---全屏，商店用-dlg
			{size:[880,620],box:this.dlgBox,frame:"dlgbox"},//1---大框，联盟用-dlg	960*540/854*480
			{size:[700,560],box:this.dlgBox,frame:"dlgbox"},//2---中框，建筑用-dlg
			{size:[560,400],box:this.pmtBox,frame:"dlgbox"},//3---小框，提示、确认用-pmt
			{size:[510,636],box:this.dlgBox,frame:"dlgBox"},//4---设置界面
			{size:[670,510],box:this.dlgBox,frame:"dlgBox"},//5---升级中界面
			{size:[520,400],box:this.dlgBox,frame:"dlgBox"},//6---要兵界面
			{size:[476,352],box:this.dlgBox,frame:"dlgBox"},//7---开启圣诞树
			{size:[960,640],box:this.dlgBox,frame:"dlgBox"},//8---联盟、排行榜
			{size:[700,560],box:this.pmtBox,frame:"dlgbox"},//9---大框-pmt
		];

		DBOut("Init appEnv="+System.getUserId());
		window.USERID=parseInt(System.getUserId(),10);
		if (window.ErrorReporter)
		{
		  ErrorReporter.setExtraInfo("uid", window.USERID+"");
		}
		this.initAisGame();

		//*******************************************************
		//Init game states:
		list=this.liveStates;
		n=list.length;
		for(i=0;i<n;i++)
		{
			DBOut("Init live-state: "+list[i].name);
			list[i].init(this);
		}

		list=this.dynaStates;
		n=list.length;
		for(i=0;i<n;i++)
		{
			list[i].init(this);
		}

		list=this.liveStates;
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i].postInit)
				list[i].postInit(this);
		}

		list=this.dynaStates;
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i].postInit)
				list[i].postInit(this);
		}
		//在这里制定启动到什么状态去
		if(!this.entryState)
		{
			this.entryState=page.stateHome;
		}

		//*******************************************************
		//Init Audio items:

		//*******************************************************
		//Enter MainUI state
		DBOut("Will enter state: "+this.entryState);
		//this.layer.setDisplay(1);
		if(this.entryState)
		{
			this.switchState(this.entryState,1,null);
		}

		window.PriceStr="";
		if("cn"==window.LanguageStr)
			PriceStr="￥";
		else if("tw"==window.LanguageStr)
			PriceStr="NT$";
		else if("en"==window.LanguageStr)
			PriceStr="$";
		else if("kr"==window.LanguageStr)
		{
			if("TS"==window.ChannelType)
				PriceStr="₩";
			else
				PriceStr="$";
		}
	};

	__Page.appEnv.free=function()
	{
		//TODO:
	};

	__Page.appEnv.initAisGame=function(vo)
	{
		var startMode,saveTxt,saveVO;
		startMode=this.page.getCookie("Runtime","StartGame");
		if(window.aisGame)
		{
			window.aisGame.init(this);

			if(window.aisNTEngine)
			{
				window.GameSocketUrl=this.page.getCookie("Runtime","GameSocketUrl");
				window.aisNTEngine.init(window.aisGame.king,window.GameSocketUrl);
			}


			if(startMode=="Clean")
			{
				window.aisGame.initNewKing();
			}
			else if(startMode=="Load" || startMode=="VisitStage")
			{
				if(startMode=="Load")
					//saveTxt=this.page.getCookie("Runtime","Save");
					saveTxt=this.getCityVO("Save");
				else
					//saveTxt=this.page.getCookie("Runtime","VisitStage");
					saveTxt=this.getCityVO("VisitStage");
				DBOut("Saved cookie: "+saveTxt);
				if(saveTxt)
				{
					//saveVO=fromJSON(saveTxt);
					saveVO=saveTxt;
					if(window.pxyLogin)
					{
						saveVO=pxyLogin.convert(saveVO);//----
					}
					//DBOut("--convertloginvo="+toJSON(saveVO));
					if(saveVO)
					{
						if(window.aisEnv)window.aisEnv.reviseTime(saveVO.lastUpdate);
						window.aisGame.loadFromVO(saveVO);
						if(startMode=="VisitStage")
							window.aisGame.bVisit=1;
					}
					else
					{
						DBOut("Saved data Error 2!!");
					}
				}
				else
				{
					DBOut("Saved data Error 1!!");
				}
			}
			else if(startMode=="Resume")
			{
				var lastUpdate,curTime;
				//saveTxt=this.page.getCookie("Runtime","Save");
				saveTxt=this.getCityVO("Save");
				DBOut("Saved cookie: "+saveTxt);
				if(saveTxt)
				{
					//saveVO=fromJSON(saveTxt);
					saveVO=saveTxt;
					if(saveVO)
					{
						window.aisGame.loadFromVO(saveVO,1);
					}
					else
					{
						DBOut("Saved data Error 2!!");
					}
				}
				else
				{
					DBOut("Saved data Error 1!!");
				}
			}
			else if(startMode=="GuideLoad")
			{
				saveTxt=this.page.getCookie("COC","SaveGuideLoad");
				this.page.stateHome.initGuide=this.page.getCookie("COC","NextGuide");
				DBOut("Saved cookie: "+saveTxt);
				if(saveTxt)
				{
					saveVO=fromJSON(saveTxt);
					if(saveVO)
					{
						window.aisGame.loadFromVO(saveVO);
					}
					else
					{
						DBOut("Saved data Error 2!!");
					}
				}
				else
				{
					window.aisGame.initNewKing();
					DBOut("Saved data Error 1!!");
				}
			}
		}else{
			if(startMode=="GuideBattle")
			{
				this.entryState=this.page.stateBattle;
			}
		}
	};

	//*******************************************************
	//切换当前界面状态
	//*******************************************************
	{
		__Page.appEnv.switchState=function(state,now,param)
		{
			DBOut("Will switch state: " + state.name);
			if(this.nextState==state)
				return;
			if(this.curState==state)
				return;
			this.nextState=state;
			this.stateParam=param;
			if(now)
			{
				this._switchState();
			}
			else
			{
				setTimeout(0,this._switchState,this);
			}
		};

		//实际执行操作的切换当前界面状态的函数
		__Page.appEnv._switchState=function()
		{
			if(this.curState)
				DBOut("SwitchState curState: "+this.curState.name);
			DBOut("SwitchState nextState: "+this.nextState.name);
			var old=this.curState;
			var state=this.nextState;
			if(old)
			{
				old.leave(state);
			}
			this.curState=state;
			state.enter(old,this.stateParam);
			this.nextState=null;
		};
	}

	//--------------------------------------------------------------------------
	//与对1级话框相关的函数
	//--------------------------------------------------------------------------
	{
		//显示、切换至指定对话框
		__Page.appEnv.switchDlg=function(dlg,now,param)
		{
			DBOut("appEnv.switchDlg:"+(dlg?dlg.name:"null"));
			if(dlg && this.nextDlg==dlg)
				return;
			if(this.curDlg==dlg)
				return;
			this.nextDlg=dlg;
			this.dlgParam=param;
			if(now)
			{
				this._switchDlg();
			}
			else
			{
				this._switchDlg();
			//	this.layer.setTimeout(0,this._switchDlg,this);
			}
		};

		//关闭对话框并切换至指定的State
		__Page.appEnv.closeDlg=function(state,param,now)
		{
			var str="appEnv.closeDlg";
			if(this.curDlg)
			{
				str+=(", name:"+this.curDlg.name);
				if(this.curDlg.homeDlg)
					str+=(", homeDlg:"+this.curDlg.homeDlg.name)
			}
			DBOut(str);
			if(this.curDlg && this.curDlg.closeItem)
				this.curDlg.closeItem.setEnabled(0);
			if(this.curDlg && this.curDlg.homeDlg && this.curDlg.homeDlg.closeItem)
				this.curDlg.homeDlg.closeItem.setEnabled(0);
			if(this.curDlg && this.curDlg.homeDlg  && this.curDlg.homeDlg.homeDlg && this.curDlg.homeDlg.homeDlg.closeItem)
				this.curDlg.homeDlg.homeDlg.closeItem.setEnabled(0);
			this.switchDlg(null,now,null);
			if(state)
			{
				this.switchState(state,now,param);
			}
		};

		__Page.appEnv._switchDlg=function()
		{
			DBOut("appEnv._switchDlg, cur:"+(this.curDlg?this.curDlg.name:"null")+", next:"+(this.nextDlg?this.nextDlg.name:"null"));
			var old=this.curDlg;
			var dlg=this.nextDlg;
			if(old)
			{
				old.leave(dlg);
				if(old.dlgPage)
				{
					old.dlgPage.dlgUsage=0;
				}
			}
			else
			{
				if(!this.curDlg)
				{
					DBOut("will de-maketop dlgLayer");
					//if(this.page.stateCity && !this.dlgLayer.isTop())
					if(!this.dlgLayer.isTop())
					{
						//this.page.stateCity.pauseLUDT();
						this.dlgLayer.makeTop();
					}
					this.dlgLayer.setDisplay(1);
					this.dlgBox.setDisplay(1);
					this.dlgBoxDock.adRot.setCurValue([-3.1415926535*0.52,0,0]);
					this.dlgBoxDock.adSize.setCurValue([1,1,1]);
					this.dlgBoxDock.adRot.startAni(1,[0,0,0],0);
					this.dlgBoxDock.adSize.startAni(1,[1,1,1],0);
					this.hudIn(this.dlgMask,10);
				}
			}
			this.curDlg=dlg;
			if(dlg)
			{
				dlg.enter(old,this.dlgParam);
				this.nextDlg=null;
			}
			else
			{
				setFrameout(0,function(){
					if(!this.curDlg && !this.curPmt && this.page.vwHomeStage && this.page.vwHomeStage.addBtmBtns)
						this.page.vwHomeStage.addBtmBtns();
				},this)
				this.dlgBoxDock.adSize.startAni(1,[1,0,1],0);
				this.dlgLayer.setFrameout(10,function(){this.dlgBoxDock.adSize.startAni(1,[0,0,1],0);},this);
				this.dlgLayer.setFrameout(20,this._dlgClosed,this);
				this.dlgMask.fadeOut(10,0);
			}
		};

		__Page.appEnv._dlgClosed=function()
		{
			var i,n,list;
			if(this.nextPageDlgURL)
			{
				this.openPageDlg(this.nextPageDlgURL,this.nextPageDlgParam);
				this.nextPageDlgURL=null;
				this.nextPageDlgParam=null;
			}
			else
			{
				if(!this.curPmt)//【zz】添加判断
					this.layer.makeTop();
				else
					this.pmtLayer.makeTop();
				this.dlgLayer.setDisplay(0);
				this.dlgBox.setDisplay(0);
				if(this.page.stateCity)
				{
					this.page.stateCity.resumeLUDT();
				}
			}
			if(this.dlgBox)//【zz】修改
			{
//				this.dlgBoxDock.removeChild(this.dlgBox);
				this.dlgBox.removeAllChild();
			}
//			this.dlgBox=this.dlgBoxDock.appendNewChild({
//				type:"shape",id:"dlgBox",pos:[-this.scrSize[0]/2,-this.scrSize[1]/2,0],w:this.scrSize[0],h:this.scrSize[1],border_a:0,face_a:0,ui_event:1,
//				display:0
//			});
			list=this.subDlgPages;
			n=list.length;
			for(i=0;i<n;i++)
			{
				DBOut("Will close dialog's page");
				if(list[i].dlgUsage<1)
				{
					this.page.removeChild(list[i]);
					list.splice(i,1);
					i--;n--;
				}
			}
		};

		//打开一个以Page形式存在JML文件里的对话框
		__Page.appEnv.openPageDlg=function(url,param)
		{
			var subpage;
			var page;
			if(this.curDlg)//当前已经打开了一个对话框了……
			{
				this.nextPageDlgURL=url;
				this.nextPageDlgParam=param;
				this.closeDlg();
				return;
			}
			page=this.page;
			subpage=createItemByType("page");
			page.appendChild(subpage);
			subpage.gamePage=page;
			this.pageDlgParam=param;
			this.subDlgPages.push(subpage);
			subpage.openURL(url);
			subpage.dlgUsage=1;
			this.hudIn(this.dlgMask,10);
			if(this.page.vwHomeStage && this.page.vwHomeStage.clearBtmBtns)
				this.page.vwHomeStage.clearBtmBtns();
			//TOOD: Show loading mark:
		};

		__Page.appEnv.onPageDlgOpen=function(subpage)
		{
			var dlg;
			DBOut("subPageOpened!");
			dlg=subpage.pageDialog;
			if(dlg)
			{
				dlg.dlgPage=subpage;
				dlg.init(this);
				this.nextDlg=dlg;
				this.dlgParam=this.pageDlgParam;
				this.layer.setTimeout(0,this._switchDlg,this);
			}
			//TODO: Hide loading mark:
		}
	}
/**
	//--------------------------------------------------------------------------
	//与2级对话框相关的函数
	//--------------------------------------------------------------------------
	{
		//显示一个2级对话框
		__Page.appEnv.showPmtDlg=function(dlg,now,param)
		{
			DBOut("appEnv.showPmtDlg:"+(dlg?dlg.name:"null"));
			if(dlg && (this.nextPmt==dlg || this.curPmt==dlg))
			{
				DBOut("same pmt, next:"+(this.nextPmt==dlg)+", cur:"+(this.curPmt==dlg));
			//	return;
			}
			this.nextPmt=dlg;
			this.pmtParam=param;
			if(now)
			{
				this._showPmtDlg();
			}
			else
			{
				this._showPmtDlg();
			//	this.layer.setTimeout(0,this._showPmtDlg,this);
			}
			if(this.page.vwHomeStage && this.page.vwHomeStage.clearBtmBtns)
				this.page.vwHomeStage.clearBtmBtns();
		};

		//关闭对话框
		__Page.appEnv.closePmtDlg=function()
		{
			DBOut("appEnv.closePmtDlg");
			if(!this.curPmt)return;
			if(this.curPmt && this.curPmt.closeItem)
				this.curPmt.closeItem.setEnabled(0);
			this.showPmtDlg(null,0,null);
		};

		__Page.appEnv._showPmtDlg=function()
		{
			var preLayer;
			DBOut("appEnv._showPmtDlg, cur:"+(this.curPmt?this.curPmt.name:"null")+", next:"+(this.nextPmt?this.nextPmt.name:"null"));
			var old=this.curPmt;
			var pmt=this.nextPmt;
			if(old)
			{
				old.leave(pmt);
				if(old.pmtPage)
				{
					old.pmtPage.pmtUsage=0;
				}
			}
			else
			{
				if(!this.curPmt)//show new pmt
				{
					DBOut("will de-maketop dlgLayer");
					preLayer=this.pmtLayer.getTopLayer();
					if(preLayer!=this.prePmtLayer)
					{
						this.prePmtLayer=preLayer;
					}
					else
					{
						this.prePmtLayer=this.layer;
					}
					if(this.page.stateCity)
					{
						this.page.stateCity.pauseLUDT();
					}
					this.pmtLayer.makeTop();
					//this.pmtLayer.setDisplay(1);
					this.pmtBoxDock.setDisplay(1);
					this.pmtBoxDock.adRot.setCurValue([-3.1415926535*0.52,0,0]);
					this.pmtBoxDock.adSize.setCurValue([1,1,1]);
					this.pmtBoxDock.adRot.startAni(1,[0,0,0],0);
					this.pmtBoxDock.adSize.startAni(1,[1,1,1],0);
					this.pmtMask.fadeIn(10,0);
				}
			}
			this.curPmt=pmt;
			if(pmt)
			{
			//	DBOut("*** set closePmt 0");
				this.closePmt=0;
				pmt.enter(old,this.pmtParam);
				this.nextPmt=null;
			}
			else//close pmt
			{
			//	DBOut("*** set closePmt 1");
				this.closePmt=1;
				setFrameout(0,function(){
					if(!this.curDlg && !this.curPmt && this.page.vwHomeStage && this.page.vwHomeStage.addBtmBtns)
						this.page.vwHomeStage.addBtmBtns();
			//		DBOut("*** check closePmt:"+this.closePmt);
					if(!this.closePmt)return;
					this.pmtBoxDock.adSize.startAni(1,[1,0,1],0);
					this.pmtLayer.setFrameout(5,function(){this.pmtBoxDock.adSize.startAni(1,[0,0,1],0);},this);
					this.pmtLayer.setFrameout(10,this._pmtClosed,this);
					this.pmtMask.fadeOut(10,0);
				},this);
			}
		};

		__Page.appEnv._pmtClosed=function()
		{
			var i,n,list;
			if(this.nextPagePmtURL)
			{
				this.openPagePmt(this.nextPagePmtURL,this.nextPagePmtParam);
				this.nextPagePmtURL=null;
				this.nextPagePmtParam=null;
			}
			else
			{
				if(!this.curDlg)//【zz】添加判断
				{
					this.layer.makeTop();
				}
				else
				{
					this.dlgLayer.makeTop();
				}
				//this.pmtLayer.setDisplay(0);
				this.pmtBoxDock.setDisplay(0);
				this.prePmtLayer=null;
				if(this.page.stateCity)
				{
					this.page.stateCity.resumeLUDT();
				}
			}
//			if(this.pmtBox)
//			{
//			//	this.pmtBoxDock.removeChild(this.pmtBox);
//				this.pmtBox.removeAllChild();
//			}
//			this.pmtBox=this.pmtBoxDock.appendNewChild({
//				type:"shape",id:"pmtBox",pos:[-450,-260,0],w:960,h:640,border_a:0,face_a:0,ui_event:1,
//				display:0
//			});
			list=this.subPmtPages;
			if(list)
			{
				n=list.length;
				for(i=0;i<n;i++)
				{
					DBOut("Will close dialog's page");
					if(list[i].pmtUsage<1)
					{
						this.page.removeChild(list[i]);
						list.splice(i,1);
						i--;n--;
					}
				}
			}
		};
	}
/**/
	//--------------------------------------------------------------------------
	//--------------------------------------------------------------------------
	//常用工具函数：
	{
		//-------------------------------------------------------------------------
		//控件淡入函数
		__Page.appEnv.hudIn=function(hud,t,func,obj)
		{
			if(!hud.getDisplay() || hud.isFading()!=1)
			{
				hud.fadeIn(t,0);
			}
			if(func)
			{
				hud.onFadeDone=function(fade)
				{
					if(fade && func && obj)
					{
						setFrameout(0,function(){func.call(obj,fade);func=null;obj=null;},this);
					}
					else
						return;
				}
			}
		};

		//-------------------------------------------------------------------------
		//控件淡出函数
		__Page.appEnv.hudOut=function(hud,t,func,obj)
		{
			if(hud.getDisplay())
			{
				if(hud.isFading()!=2)
				{
					hud.fadeOut(t,0);
				}
			}
			if(func)
			{
				hud.onFadeDone=function(fade)
				{
					if(!fade && func && obj)
					{
						setFrameout(0,function(){func.call(obj,fade);func=null;obj=null;},this);
					}
					else
						return;
				}
			}
		};
	}

	//--------------------------------------------------------------------------
	//按键处理函数
	__Page.appEnv.guideOnKey=function(msg,key,pass,extra)
	{
		//DBOut("msg="+msg+", key="+key+", pass="+pass+", extra="+extra);
		if(this.curState && this.curState.curGuide)
		{
			if(!this.curState.guideOnKey(msg,key,pass,extra))
				return 0;
		}
		if(this.curPmt)
		{
			return this.curPmt.onKey(msg, key, pass, extra);
		}
		if (this.curDlg)
		{
			return this.curDlg.onKey(msg, key, pass, extra);
		}
		if(this.curState)
		{
			if(this.curState.onKey(msg,key,pass,extra))
			{
				return 1;
			}
		}
		return 0;
	};

	__Page.appEnv.onKey=function(msg,key,way,extra)
	{
		//DBOut("msg="+msg+", key="+key+", way="+way+", extra="+extra);
		if(1==way && 1==msg)
		{
			if(this.appKeys.dlgClose==key)
			{
				if(this.curPmt){
					if(!this.curPmt.hold)
						this.curPmt.onCloseClk(1,0,1,0);
				}else if(this.curDlg){
				//	this.closeDlg(null,null,0);
					if(!this.curDlg.hold)
						this.curDlg.onCloseClk(1,0,1,0);
				}else{
					if(window.PUR)
					{
						if(PUR.exitGame())
							return 1;
					}
					if(Dialogs.prompt(this.textLib.AskExit))
					{
						if(ChannelType=="CMGC"){

							exitApp();
							shellExec("http://g.10086.cn/a/");
						}
						if(ChannelType=="SMS"){

							exitApp();
						}
						if(window.aisNTEngine)window.aisNTEngine.onFree(1);
						exitApp();
					}
				}
				return 1;
			}
		}
		if (this.curPmt)
		{
			return this.curPmt.onKey(msg, key, way, extra);
		}
		if (this.curDlg)
		{
			return this.curDlg.onKey(msg, key, way, extra);
		}
		if(this.stateLantern)
		{
			this.stateLantern.onKey(msg,key,way,extra);
		}
		if(this.curState)
		{
			if(this.curState.onKey(msg,key,way,extra))
			{
				return 1;
			}
		}
		if(this.chatInited)
		{
			return this.stateChat.onKey(msg, key, way, extra);
		}
		return 0;
	};

	//--------------------------------------------------------------------------
	//触摸消息函数
	__Page.appEnv.onMouse=function(msg,key,x,y,penSize,way)
	{
		//msg总是0，penSize总是1，way总是0和1
		//key：移动时为1、摁下为0、抬起为2变1
		/**
		if(x<0 || x>this.scrSize[0] || y<0 || y>this.scrSize[1])
			return;
	//	DBOut("key="+key+", x="+x+", y="+y+", way="+way+", msg="+msg+", penSize="+penSize);
		if(1==way && 2==key)
		{
			if(this.touchTimer)
			{
				clearTimeout(this.touchTimer);
				this.touchTimer=null;
			}
			this.touchTimer=setTimeout(1000*60*5,function(){
				if(window.aisNTEngine)
					window.aisNTEngine.onFree();
				this.page.setCookie("Runtime","UserVO","",1,1);
				this.page.setCookie("Runtime","GameDWRUrl","",0);
				Dialogs.alert("由于您长时间没有任何操作，已经失去了和指挥部的联系，请您重新登陆。");
				this.sureReloadGame();
			},this);
		}
		/**/
		if(this.mainState)
		{
			if(this.mainState.onMouse)
				return this.mainState.onMouse(msg,key,x,y,penSize,way);
		}
		if(this.curState)
		{
			if(this.curState.onMouse)
				return this.curState.onMouse(msg,key,x,y,penSize,way);
		}
		if(this.curDlg)
		{
			if(this.curDlg.onMouse)
				return this.curDlg.onMouse(msg,key,x,y,penSize,way);
		}
		return 0;
	};

	__Page.appEnv.playAudio=function(item,vol)
	{
		if(this.saveInfo && this.saveInfo.audio_fx)
		{
			if(!vol)
				vol=256;
			audio.playItem(item,vol);
		}
	};
	__Page.appEnv.reStartGame=function(state)
	{
		var txt=this.textLib.NetDisconnect;
		if(state==-1)
			txt=this.textLib.NetError;
		else if(state==3)
			txt=this.textLib.TimeOut;

		if(window.aisNTEngine)
			window.aisNTEngine.onFree(1);
		if("ChangeUser"!=state)
			Dialogs.alert(txt);
		this.page.setCookie("Runtime","UserVO","",1,1);
		this.page.setCookie("Runtime","GameDWRUrl","",0);
		switchApp(window.mainPath);
	};
	__Page.appEnv.newMsg = function(params,meta,url)
	{
		var _dwr;
		if(url && this.page.DWRBase){
			_dwr = new this.page.DWRBase(url);
			_dwr.setPage(this.page);
		}else{
			_dwr=this.dwr;
		}
		if(_dwr)
		{
			if(meta&&meta.retryTime&&!meta.storeParams)
			{
				meta.curr = 1;
				meta.storeParams = [];
				meta.storeParams = meta.storeParams.concat(params);
			}
			params.push(this.normalMeta(meta));
			return _dwr.DWRCall.apply(_dwr,params);
		}
	};
	__Page.appEnv.normalMeta = function(meta)
	{
		var self = this;
		return {
			callback:function(backinfo)
			{
				if(meta&&meta.cb&&typeof(backinfo)!="undefined")
				{
					var vo;

					if(backinfo && backinfo.vojson)
						vo = fromJSON(backinfo.vojson);
					else
						vo = backinfo;
					meta.cb.call(meta.cbobj?meta.cbobj:this,vo);
				}
			},
			exceptionHandler:function(err,msg)
			{
				if(meta)
				{
					if(meta.retryTime)
					{
						if(meta.curr<=meta.retryTime)
						{
							meta.curr++;
							setFrameout(0,
								function()
								{
									var params = [];
									params = params.concat(meta.storeParams);
									var newdwr = this.newMsg(params,meta);
									if(meta.rtcb)
										meta.rtcb.call(meta.rtcbobj?meta.rtcbobj:this,newdwr);
								}
							,self);
							return;
						}
					}
					else if(meta.eh)
					{
						meta.eh.call(meta.ehobj?meta.ehobj:this,err,msg);
						return;
					}
				}
				DBOut("Error:("+msg+")");
				var txt=(self.page)?self.page.appEnv.textLib.NetDisconnect:"";
				Dialogs.alert(txt);
				self.sureReloadGame();
			}
		};
	};
	__Page.appEnv.sureReloadGame = function()
	{
		if(window.aisNTEngine)
			window.aisNTEngine.onFree(1);
		this.page.setCookie("Runtime","UserVO","",1,1);
		this.page.setCookie("Runtime","GameDWRUrl","",0);
		switchApp(mainPath);
	};

	__Page.appEnv.updateNickName=function(name,fun,obj)
	{
		if(!this.page.DWRBase)return;
		var oUserVO = this.page.getCookie("Runtime","UserVO");
		if(oUserVO)
			oUserVO = fromJSON(oUserVO);
		if(!oUserVO){
			Dialogs.alert(this.textLib.NetDisconnect);
			this.sureReloadGame();
			return;
		}
		window.USERID=oUserVO.userId;

		if (window.ErrorReporter)
		{
		  ErrorReporter.setExtraInfo("uid", window.USERID+"");
		}

		this.dwr = new this.page.DWRBase(window.UserDWRUrl);
		this.dwr.setPage(this.page);
		DBOut("--------updateNickNameById oUserVO.userId="+oUserVO.userId+" name="+name+" oUserVO.checkId="+oUserVO.checkId);
		this.newMsg(["UserBean","updateNickNameById",oUserVO.userId,name,oUserVO.checkId],{cb:function(flag){
			if(fun && obj)fun.call(obj,flag);
		},cbobj:this});
	};
	__Page.appEnv.loginGameServer = function(name)
	{
		var oUserVO = this.page.getCookie("Runtime","UserVO");
		DBOut("+++oUserVO="+oUserVO);
		if(oUserVO)
			oUserVO = fromJSON(oUserVO);
		if(!oUserVO){
			Dialogs.alert(this.textLib.NetDisconnect);
			this.sureReloadGame();
			return;
		}

		this.dwr = new this.page.DWRBase(window.UserCenter);
		this.dwr.setPage(this.page);
		this.newMsg(["M1UserCenterDwr","login",window.USERID,name,oUserVO.checkId?oUserVO.checkId:"",1],{cb:function(svrVO){
			if(!svrVO)
			{
				Dialogs.alert(this.textLib.SysFull);
				this.sureReloadGame();
				return;
			}else
				this.loginGame(svrVO);
		},cbobj:this});
	};
	__Page.appEnv.loginGame = function(svrVO)
	{
		if(!svrVO)
		{
			DBOut("++++loginGameServer error!!!");
			return;
		}
		window.GameSocketUrl=svrVO.host+":"+svrVO.port;
		window.GameDWRUrl=window.GameDWRUrl.replace(/host/,svrVO.host);
		window.GameDWRUrl=window.GameDWRUrl.replace(/port/,svrVO.port);
		this.page.setCookie("Runtime","GameDWRUrl",window.GameDWRUrl,0);
		this.page.setCookie("Runtime","GameSocketUrl",window.GameSocketUrl,0);
		DBOut("+++game host:"+(svrVO.host+":"+svrVO.port));
		this.dwr = new this.page.DWRBase(svrVO.host+":"+svrVO.port);
		this.dwr.setPage(this.page);

		var city = this.page.getCookie("Runtime","GuideCity");
		if(city){
			city=fromJSON(city);
		}
		if(!city){
			Dialogs.alert(this.textLib.NetDisconnect);
			this.sureReloadGame();
			return;
		}
		this.cityInfos=[city.name,city.exp,city.gem,"Gold",city.gold,"Elixir",city.oil,city.bld.length];
		var i,bld;
		for(i=0;i<city.bld.length;i++)
		{
			bld=city.bld[i];
			this.cityInfos.push(bld.instanceId);
			this.cityInfos.push(bld.codename);
			this.cityInfos.push(bld.level);
			this.cityInfos.push(bld.x);
			this.cityInfos.push(bld.y);
		}
		/* String name
		 * int exp
		 * int gem
		 * String gold
		 * int goldNum
		 * String oil
		 * int oilNum
		 * int instanceCount
		 * long instanceId
		 * String codename
		 * int level
		 * int x
		 * int y
		 */
		var reqvo=[window.USERID,2,0,0,0,this.cityInfos.length];
		reqvo.push.apply(reqvo,this.cityInfos);

		this.dwr.initSocket();
		this.dwr.login(reqvo.join("!#"),this.startGame,this,2);
	};
	__Page.appEnv.startGame = function(vo)
	{
		//this.page.setCookie("Runtime","Save",toJSON(vo),0);
		this.saveCityVO(vo,"Save");
		//this.page.setCookie("Runtime","StartGame","Load",0);
		//switchApp(this.page.genPageURL("ui_ais.jml"));
		this.page.setCookie("Runtime","UserVO","",1,1);
		this.page.setCookie("Runtime","GameDWRUrl","",0);
		switchApp(window.mainPath);
	};

	__Page.appEnv.getSysNotice = function(fun,obj)
	{
		if(!this.dwr && this.page.DWRBase)
		{
			this.dwr = new this.page.DWRBase(window.UserCenter);
			this.dwr.setPage(this.page);
		}
		this.newMsg(["UserBean","getSysNoticeByServer",this.getServerID()],{cb:function(svrVO){
			if(fun&&obj)fun.call(obj,svrVO);
		},cbobj:this},window.NoticeDWRUrl);
	};

	__Page.appEnv.go2Home=function()
		{
			if(window.aisNTEngine)
			{
				var time=0;
				window.aisNTEngine.execFakeCmd(null,"Return_Home",{callBack:this._go2Home,callObj:this},null,time);
			}
		};

	__Page.appEnv._go2Home=function(svrvo)
	{
		if(svrvo)
		{
			//this.page.setCookie("Runtime","Save",toJSON(svrvo),0);
			this.saveCityVO(svrvo,"Save");
		}
		this.page.setCookie("Runtime","StartGame","Load",0);
		switchApp(this.page.genPageURL("ui_ais.jml"));
	};

	__Page.appEnv.loadFile=function(path,fun,obj)
		{
			var path,stub;
			stub=this.page.loadFileText(path);
			stub.onLoad=this.includeFile;
			stub.onError=this.includeFileError;
			stub.state=this;
			stub.state.path=path;
			stub.state.fun=fun;
			stub.state.obj=obj;
		};

	__Page.appEnv.includeFile=function()
	{
		var self=this.state;
		var text;
		text="(function(page){return "+this.getText()+";})()";
		text=eval(text);
		DBOut("====text="+text);
		if(self.fun && self.obj)
			self.fun.call(self.obj,text);

	};
	__Page.appEnv.includeFileError=function()
	{
		var self=this.state;
		DBOut("+++++loadFile error:"+self.path);
	};

	__Page.appEnv.showSearchAni=function(fun,obj)
	{
		var appEnv=this;
		if(!this.cloudAdd)
		{
			this.preLayer=appEnv.pmtLayer.getTopLayer();
			var layer=appEnv.actLayer;
			var layer2=appEnv.act2Layer;
			layer.makeTop();
			var box=layer.addHudItem({
				type:"shape",id:"search",pos:[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0,
				items:{type:"key",id:"blocker",pos:[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],key:0,ui_event:1,}
			});
			this.cloudL=box.appendNewChild({type:"sprite",id:"item_sp",exsp:"fog",pos:[960>>1,640>>1,0],onSpEvent:this.onEvent,owner:this,w:Screen.w+100,h:Screen.h+100});
			this.uav=box.appendNewChild({type:"sprite",id:"item_sp",exsp:"uav4putong",pos:[1270+160,320,0],fade:1,fade_alpha:1,fade_size:1,fade_pos:[0,320,0],display:0});
			this.cloudAdd=1;
			this.uav.onFadeDone=function()
			{
				//if(appEnv.cloudL)appEnv.cloudL.setDisplay(0);
				appEnv.cloudAdd=0;
				if(fun && obj)fun.call(obj);
			};
			var imgLib=this.page.imgLib;
			if(!this.loadBgHud)
			{
				var box2=layer2.addHudItem({
					type:"shape",id:"search",pos:[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0,
					items:{type:"key",id:"blocker",pos:[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],key:0,ui_event:1,}
				});
				this.loadBgHud=box2.appendNewChild({type:"icon",css:imgLib.pic_radar,pos:[appEnv.scrSize[0]>>1,appEnv.scrSize[1]-imgLib.pic_radar.h-10,0],anchor_v:1,anchor_h:1,filter:1,display:0,
					fade:1,fade_size:1,fade_alpha:0,fade_pos:[appEnv.scrSize[0]>>1,appEnv.scrSize[1]-imgLib.pic_radar.h-10+3,0],//w:Math.floor(imgLib.pic_radar.w*960/Screen.w),h:Math.floor(imgLib.pic_radar.h*640/Screen.h),
					items:[
					{type:"icon",id:"load",css:imgLib.pic_radar_light,anchor_v:1,anchor_h:1,filter:1,},//w:Math.floor(imgLib.pic_radar_light.w*960/Screen.w),h:Math.floor(imgLib.pic_radar_light.h*640/Screen.h)
					{type:"icon",css:imgLib.pic_wreaths,anchor_v:1,anchor_h:1,filter:1,display:1}
					]});
				this.loadHud=this.loadBgHud.getItemById("load");
				this.addRotate_z(this.loadHud);
			}
		}
		this.loadBgHud.setDisplay(0);
		var t=20;
		setFrameout(t-5,function(){
			this.uav.fadeIn(60+80,0);
			setFrameout(5,function(){
				//this.loadBgHud.setDisplay(1);
				this.loadBgHud.fadeIn(46);
			},this);
		},this)
	};
	__Page.appEnv.onEvent=function(event, frame)
	{
		if(event==-6)
		{
			var self=this.owner;
			if(self.curDlg){
				self.dlgLayer.makeTop();
			}else
				self.layer.makeTop();
			this.setAutoFrame(0);
			if(this.loadBgHud)this.loadBgHud.setDisplay(0);
		}
	};

	__Page.appEnv.delSearchAni=function(f,fun,obj)
	{
		var appEnv=this;
		//if(!this.cloudAdd)
		{
			var layer=appEnv.actLayer;
			var layer2=appEnv.act2Layer;
			if(this.cloudL)
				this.cloudL.getFather().removeChild(this.cloudL);
			if(this.uav)
				this.uav.getFather().removeChild(this.uav);
			if(this.loadBgHud)
			{
				this.loadBgHud.getFather().removeChild(this.loadBgHud);
				this.loadBgHud=null;
			}
			var box=layer.addHudItem({
				type:"shape",id:"search",pos:[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0,
				items:{type:"key",id:"blocker",pos:[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],key:0,ui_event:1,}
			});
			this.cloudL=box.appendNewChild({type:"sprite",id:"item_sp",exsp:"fadeout",pos:[960>>1,640>>1,0],onSpEvent:this.onEvent,owner:this});
			if(f)
			{
				this.cloudL.setAutoFrame(0);
			}else{
				this.preLayer=appEnv.pmtLayer.getTopLayer();
				if(this.curDlg)
					this.dlgLayer.makeTop();
				else
					layer.makeTop();
			}
		}
	};

	__Page.appEnv.getTextSize=function(text,font,wrap,w,h)
	{
		var hud=this.pmtLayer.addHudItem({type:"text",pos:[0,0,0],w:w?w:100,h:h?h:100,text:text,font_size:font,wrap:wrap?wrap:0,display:0});
		var size={w:hud.getTextW(),h:hud.getTextH()};
		this.pmtLayer.removeHudItem(hud);
		return size;
	};

	__Page.appEnv.getLevelByExp=function(exp)
	{
		var i,list,n,lv;
		list=aisEnv.defLib.achvmnt.EXPLevels;
		n=list.length;
		lv=0;
		for(i=0;i<n;i++)
		{
			if(exp<list[i].exp)
			{
				lv=i+1;
				break;
			}
		}
		if(!lv)lv=n;
		return lv;
	};

	__Page.appEnv.checkStrLenght=function(chars,max)
	{
	    var i = 0, sum = 0, c;
	    for (i = 0; i < chars.length; i++)
	    {
	        if(sum == max)
	        	return chars.substring (0, i);
	        else if(sum > max)
	        	return chars.substring (0, i-1);
	        c = chars.charCodeAt(i);
	        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
	            sum++;
	        } else {
	            sum += 2;
	        }
	    }
	    return chars;
	    //return sum;
	    //return chars.replace(/[^/x00-/xff]/ig, "aa").length;
	};

	__Page.appEnv.addScale=function(div,bsize,esize,speed)
	{
		if(!div)return;

		if(!div.scaleAni)div.scaleAni = div.addAdTMFirst("scale");
		if(!speed)speed=0.1;
		div.scaleAni.setFactor(0,speed);
		div.scaleAni.setFactor(1,0);
		div.scaleAni.setCurValue(bsize);
		div.scaleAni.startAni(5,esize, 0);
		div.setPos([this.scrSize[0]>>1,-((54*40))>>1,0]);
		//var pos=[0,0,0];
		//div.getPos(pos);
		//div.startAniEx([this.scrSize[0]>>1,-((54*40))>>1,0],1,1,1,1);
	};
	__Page.appEnv.addScale2=function(div,bsize,esize,speed,pos)
	{
		if(!div)return;

		if(!div.scaleAni)div.scaleAni = div.addAdTMFirst("scale");
		if(!speed)speed=0.05;
		div.scaleAni.setFactor(0,speed);
		div.scaleAni.setFactor(1,speed);
		div.scaleAni.setCurValue(bsize);
		div.scaleAni.startAni(1,esize, 0);
		//if(pos)
		//div.setPos(pos);
	};
	__Page.appEnv.addZoomScale=function(div,bsize,maxsize,speed)
	{
		if(!div)return;
		if(!div.scaleAni)div.scaleAni = div.addAdTMFirst("scale");
		if(!speed)speed=0.5;
		div.scaleAni.setFactor(0,speed);
		div.scaleAni.setFactor(1,speed);
		div.scaleAni.setCurValue(bsize);
		div.scaleAni.startAni(5, maxsize, 0);
	};
	__Page.appEnv.addRotate_z=function(div,s)
	{
		if(!div)return;
		if(!div.rotatezAni)div.rotatezAni = div.addAdTMFirst("rotate");
		if(!s)s=0.2;
		div.rotatezAni.startAni(2,[0,0,s],0);
	};
	__Page.appEnv.addLoopScale=function(div,s,loopInfo)
	{
		if(!div)return;
		if(!div.scaleAni)div.scaleAni = div.addAdTMFirst("scale");
		if(!s)s=0.2;
		var minX = 0.9;
		var maxX = 1.3;
		var minY = 0.9;
		var maxY = 1.3;
		if(loopInfo)
		{
			if(loopInfo.minX)
				minX = loopInfo.minX;
			if(loopInfo.maxX)
				maxX = loopInfo.maxX;
			if(loopInfo.minY)
				minY = loopInfo.minY;
			if(loopInfo.maxY)
				maxY = loopInfo.maxY;
		}
		div.scaleAni.setMaxLimit(0,[maxX,maxY,0]);
		div.scaleAni.setMinLimit(0,[minX,minY,0]);
		div.scaleAni.setCurValue([0,0,0]);
		div.scaleAni.setFilter(1);
		div.scaleAni.startAni(2,[s,s,0],0);
	};

	//---------------------------------------------------------------------------
	//handle服务器主动发过来的消息和没处理的返回消息
	__Page.appEnv.handleMessage=function(messageType,data,error,exInfo)
	{
		var net,city,king,codename;
		if(window.aisGame)
		{
			king=window.aisGame.king;
			city=window.aisGame.curCity;
		}
		net=window.pxyCommand;
		if(messageType==net.C2S_Clan_msg)
		{
			if(data!="-10000")
			{
				if(city && city.clanMsgs.addMessage)city.clanMsgs.addMessage(data,this.page);
				if(king)king.miniUpdate();
			}
		}else if(messageType==net.C2S_Charge){//收到加钱处理
			var textLib=this.textLib;
			var temp=data.split("##");
			if(parseInt(temp[0],10))
				this.stateLogs.showLog(textLib.getText(textLib.buyokTip,{number:temp[0]}));
			if(city && temp)
			{
				this.beingPaid=0;

				city.returnCost({gem:temp[0]},1);
				if(king.achvmnts)//city.charge<=0 &&
				{
					king.achvmnts.onExecCom(city,"Charge",{});
				}
				if(temp[1])
				{
					var lv,old=city.vipLevel;
					city.charge+=parseInt(temp[1],10);
					city.vipExp+=parseInt(temp[1],10);
					lv=window.pxyLogin.initVIPLevel(city.vipExp);
					city.vipLevel=lv;
					if(temp[2]=="-6")
					{
						if(this.textLib[temp[3]+"NeedReload"])
							Dialogs.alert(this.textLib.getText(this.textLib[temp[3]+"NeedReload"],{lv:lv}));
						this.sureReloadGame();
					}else if(temp[2]=="4")
					{
						if(city)city.com_GiftUses({giftId:parseInt(temp[3],10)});
						this.page.stateHome.updateNGBtns();
					}else if(temp[2]=="5"){
						if(temp[3]=="MonthCard")
						{
							this.stateLogs.showLog(textLib.MonthCardBuyOk);
							if(city && city.monthCardVO)
							{
								var monthMS=30*24*60*60*1000;
								var expire=city.monthCardVO.expire;
								var nowTime=city.env.dateTime();
								if(!expire || expire<nowTime)
									city.monthCardVO.expire=nowTime+monthMS;
								else
									city.monthCardVO.expire=expire+monthMS;
							}
						}else if(temp[3]=="TH" || temp[3]=="CubeCard" || temp[3]=="MonthCard15" || temp[3]=="WeekCardRes12" || temp[3]=="WeekCardRes68" || temp[3]=="WeekCardCube68"){
							if(temp[3]=="WeekCardRes12" || temp[3]=="WeekCardRes68" || temp[3]=="WeekCardCube68")this.payingObj[temp[3]]=0;
							this.stateLogs.showLog(textLib[temp[3]+"BuyOk"]);
							if(city)
							{
								codename=temp[3];
								var buff=city.getBuff(codename);
								if(!buff)
								{
									city.bindBuff(codename);
								}
								buff=city.buffs[codename];
								buff.endTime=parseInt(temp[4],10);
								if(temp[3]=="MonthCard15")buff.endTime=city.env.dateTime()+30*24*60*60*1000;

								if(temp[3]=="CubeCard" || temp[3]=="TH")
								if(this.page.stateHome.addCardIcon)this.page.stateHome.addCardIcon(temp[3]);
							}
						}else if(temp[3]=="Gift" || temp[3]=="Gift2"){
							if(this.textLib[temp[3]+"BuyOk"])
								this.stateLogs.showLog(this.textLib[temp[3]+"BuyOk"]);
							if(city)
							{
								if(!city.opFlags)city.opFlags=[];
								city.opFlags.push(temp[4]);
							}
						}
					}
					if(this.page.stateHome && this.page.stateHome.DOUBLEVIP)
					{
						this.page.stateHome.DOUBLEVIP=0;
						if(window.aisGame.curCity.gifts && window.aisGame.curCity.gifts.length)
						{
							var i, gifts=window.aisGame.curCity.gifts;
							for(i=0; i<gifts.length; i++)
							{
								if(6==gifts[i].type)
								{
									gifts.splice(i,1);
									return;
								}
							}
						}
					}
				}

			}
		}else if(messageType==net.C2S_Gift_Send){//收到礼包
			if(!city)return;
			if(!city.gifts)city.gifts=[];
			city.gifts.unshift(data);
			city.makeViewsDirty();
			if(city.aisTownHall)
			{
				city.aisTownHall.makeViewsDirty();
			}
		}else if(messageType==net.C2S_PMD){//跑马灯
			this.addPMD(data);
		}else if(messageType==net.C2S_CompoundResult){//机甲工厂合成副件
			if(this.curDlg && this.curDlg.name=="dlgAddOnJoint")
				this.curDlg.onJoint(data); //ResponseCompoundVO
		}else if(messageType==net.C2S_LootResult){//战斗结束后抽奖结果
			if(this.curDlg && this.curDlg.name=="dlgBattleOver")
			{
				this.curDlg.onSvrOK(data,error);
			}
			//fun(data); //index值
		}else if(messageType==net.C2S_LOGIN && error==-4){
				//此账户重复登录
		}else if(messageType==net.C2S_ClanCupStatus){
			this.settlementClanCup(data);
		}
	};
	//-------绑定邮箱--------------------
	__Page.appEnv.callBindEmail=function(email,passwd,fun,obj)
	{
		this.newMsg(["UserBean","bindEmailNew",window.USERID,window.Imei,email,passwd,window.Imei,window.OpenUdid,window.AppToken],{cb:function(flag){
			DBOut("bindEmailNew ok!");
			this.stateLogs.showLog(this.textLib["BindEmailSuccess"]);
			if(fun && obj)fun.call(obj,flag);
		},cbobj:this,eh:function(err,msg){
			if(msg.indexOf("1054")>-1)
				this.stateLogs.showLog(this.textLib["BandEmaildEh1054"]);
			else if(msg.indexOf("1058")>-1)
				this.stateLogs.showLog(this.textLib["BandEmaildEh1058"]);
			else
				this.stateLogs.showLog(this.textLib["BandEmaildEh"]);
		},ehobj:this},window.UserDWRUrl);
	};
	__Page.appEnv.getBindEmail=function()
	{
		var cookie=this.page.getCookie(cookieDomain,"email");
		if(cookie)
			return cookie;
		else
			return null;
	};
	__Page.appEnv.addPMD=function(msg)
	{
		if(!msg)return;
		if(!this.pmdList)
		{
			/*
			var txt=this.page.getCookie("M1PMD","pmd"+window.USERID);
			if(!txt)
				this.pmdList=[];
			else
				this.pmdList=fromJSON(txt);
			if(this.pmdList && this.pmdList.constructor==Array){
			}else
				this.pmdList=[];
				*/
				this.pmdList=[];
		}
		this.pmdList.push(msg);
		//this.page.setCookie("M1PMD","pmd"+window.USERID,toJSON(this.pmdList),0);

		if(this.page.stateLantern && this.page.stateLantern.inited)
			this.page.stateLantern.showLantern();
	};
	__Page.appEnv.getPMD=function()
	{
		if(!this.pmdList)
		{
			/*
			var txt=this.page.getCookie("M1PMD","pmd"+window.USERID);
			if(!txt)
			{
				this.pmdList=[];
				return null;
			}else
				this.pmdList=fromJSON(txt);
			if(this.pmdList && this.pmdList.constructor==Array){
			}else
				this.pmdList=[];
			*/
			this.pmdList=[];
		}
		if(!this.pmdList.length)return null;
		var txt=this.pmdList.shift();
		//this.page.setCookie("M1PMD","pmd"+window.USERID,toJSON(this.pmdList),0);
		return txt;
	};
	__Page.appEnv.saveGuideStep = function(step)
	{

		if(!this.dwr && this.page.DWRBase)
		{
			this.dwr = new this.page.DWRBase(window.UserDWRUrl);
			this.dwr.setPage(this.page);
		}
		this.newMsg(["UserBean","updateGuideStep",window.USERID,step],{cb:function(svrVO){

		},cbobj:this,eh:function(err,msg){},ehobj:this},window.UserDWRUrl);
	};

	//获取vip特权
	__Page.appEnv.getVipBldNum=function(codename)//建筑数量上限
	{
		var def=window.aisEnv.defLib.vipPrivilege;
		var lv=window.aisGame.curCity.vipLevel;
		if(!lv)return 0;
		var i, j, levels, add=0;
		for(i in def)
		{
			if(i.indexOf(codename)>-1)
			{
				add=def[i]["levels"][lv]["modifyValue"];
				break;
			}
		}
		return add;
	};
	__Page.appEnv.getVipTrainGem=function(gem)//秒钻打折-造兵、造魔法
	{
		var def=window.aisEnv.defLib.vipPrivilege;
		var lv=window.aisGame.curCity.vipLevel;
		if(!lv)return gem;
		var lvVO=def["vipTrainTimeDiscount"]["levels"][lv];
		var mdy=lvVO["modifyValue"];
		if(!mdy)mdy=1;
		gem=Math.round(gem*mdy/100);
		if(gem<1)gem=1;
		return gem;
	};
	__Page.appEnv.getVipBuildGem=function(gem)//秒钻打折-升级建筑、研究
	{
		var def=window.aisEnv.defLib.vipPrivilege;
		var lv=window.aisGame.curCity.vipLevel;
		if(!lv)return gem;
		var lvVO=def["vipBLDTimeDiscount"]["levels"][lv];
		var mdy=lvVO["modifyValue"];
		if(!mdy)mdy=1;
		gem=Math.round(gem*mdy/100);
		if(gem<1)gem=1;
		return gem;
	};
	__Page.appEnv.getVipReinforce=function()//要兵时间缩短
	{
		var def=window.aisEnv.defLib.vipPrivilege;
		var lv=window.aisGame.curCity.vipLevel;
		if(!lv)return 0;
		var lvVO=def["vipRequestUnitsWaitTime"]["levels"][lv];
	};
	__Page.appEnv.getVipRes=function(res)//限购打折资源
	{
		var def=window.aisEnv.defLib.vipPrivilege;
		var lv=window.aisGame.curCity.vipLevel;
		if(!lv)return 0;
		var lvVO;
		if("gold"==res)
			lvVO=def["vipLimitedSalesGold"]["levels"][lv];
		else if("oil"==res)
			lvVO=def["vipLimitedSalesElixir"]["levels"][lv];
		else if("cube"==res)
			lvVO=def["vipLimitedSalesCube"]["levels"][lv];
		return lvVO["modifyValueEx"];
	};
	__Page.appEnv.getVipCapStatus=function(codename,lv)//vip功能是否开启
	{
		var def=window.aisEnv.defLib.vipPrivilege;
		if(!lv)lv=window.aisGame.curCity.vipLevel;
		if(!lv)return 0;
		var lvVO=def[codename];
		if(!lvVO)return 0;
		lvVO=lvVO["levels"][lv];
		if("vipResCrit"==codename || "vipLimitedSalesGold"==codename || "vipLimitedSalesElixir"==codename || "vipDiamonBoost"==codename)
		{
			if(lvVO["modifyValue"] && lvVO["modifyValueEx"])
				return 1;
			else
				return 0;
		}
		else if("vipTrainTimeDiscount"==codename || "vipBLDTimeDiscount"==codename)
		{
			if(lvVO["modifyValue"]<100)
				return 1;
			else
				return 0;
		}
		else
		{
			if(lvVO["modifyValue"])
				return 1;
			else
				return 0;
		}
	};
	__Page.appEnv.checkVipResBuy=function(res)//限购5折资源购买时间
	{
		var city=window.aisGame.curCity;
		var lastTime=city.resetDailyTasksTime;
		var timeGap=window.aisEnv.dateTime()-lastTime;
		var over=0, vipBuyTimes=0;
		if(timeGap>1000*60*60*24+1000*30)
			over=1;
		if(over)
		{
			city.vipBuyGold=0;
			city.vipBuyOil=0;
			city.vipBuyCube=0;
			return 1;
		}
		if("gold"==res)
		{
			vipBuyTimes=city.vipBuyGold;
		}
		else if("oil"==res)
		{
			vipBuyTimes=city.vipBuyOil;
		}
		else if("cube"==res)
		{
			vipBuyTimes=city.vipBuyCube;
		}
		if(vipBuyTimes && !over)
			return 0;
		else
			return 1;
	};
	__Page.appEnv.getVipExp=function(lv)//获取vip经验
	{
		var def=window.aisEnv.defLib.vipPrivilege;
		if(!lv)lv=window.aisGame.curCity.vipLevel;
		if(!lv)lv=0;
		var realExp=window.aisGame.curCity.vipExp;
		if(!realExp)realExp=0;
		var curExp=realExp;
		var levels=def["VIPLevels"];
		var maxLv=levels.length-1;
		maxLv=levels[maxLv]["title"];
		var maxExp=levels[maxLv]["charge"];
		if(curExp>maxExp)curExp=maxExp;
		var nextExp=0;
		if(lv<maxLv)
		{
			nextExp=levels[lv+1]["charge"];
		}
		else if(lv==maxLv)
		{
			nextExp=levels[maxLv]["charge"];
		}
		realExp/=100;
		curExp/=100;
		nextExp/=100;
		if(curExp!=Math.floor(curExp) && nextExp!=Math.floor(nextExp))
		{
		//	curExp=curExp.toFixed(2);
		//	nextExp=nextExp.toFixed(2);
		}
		return {real:realExp,cur:curExp,next:nextExp};
	};
	__Page.appEnv.getVipInfo=function(lv)
	{
		var def=window.aisEnv.defLib.vipPrivilege;
		//lv-=1;
		var txt="",icon=[];
		var i,j,info,lvVO,desc,mdy,have;
		if(5==lv || 7==lv || 9==lv)
		{
			txt+=(this.textLib["VipDoubleGift"]);
			icon.push("icon_gift764_32");
		}
		for(i in def)
		{
			info=def[i];
			if(info["levels"])
			{
				desc=info["desc"];
				if(!desc)
					continue;
				have=0;
				lvVO=info["levels"][lv];
			//	DBOut(i+"=="+lvVO+"==="+lv);
			//	DBOut("===== "+desc+"\r\n"+lvVO["modifyValue"]+"\r\n"+lvVO["modifyValueEx"]);
				if(lvVO["modifyValue"])
				{
					mdy=lvVO["modifyValue"];
					if("vipTrainTimeDiscount"==i || "vipBLDTimeDiscount"==i)
						mdy/=10;
					desc=desc.replace("<num1>",mdy);
				}
				if(lvVO["modifyValueEx"])
				{
					mdy=lvVO["modifyValueEx"];
					desc=desc.replace("<num2>",mdy);
				}
				if( (("vipLimitedSalesGold"==i || "vipLimitedSalesElixir"==i) && !lvVO["modifyValueEx"]) ||
					(("vipTrainTimeDiscount"==i || "vipBLDTimeDiscount"==i) && 100==lvVO["modifyValue"]) ||
					(!lvVO["modifyValue"] && !lvVO["modifyValueEx"])
				)
				{
					continue;
				}
				else
				{
					if(!txt)
						txt+=desc;
					else
						txt+=("\n"+desc);
				//	DBOut("===== "+desc);
					for(j=0; j<icon.length; j++)
					{
						if(icon[j]==info["icon"])
							have=1;
					}
					if(!have)
						icon.push(info["icon"]);
				}
			}
		}
		return {txt:txt,icon:icon};
	};

	//检测用户名是否含有非法字符
	__Page.appEnv.isNameValid4CJK=function(str,type)
	{
		//^					不包含
		//\\u2e80-\\u2eff	CJK部首
		//\\u3000-\\u303f	CJK标点
		//\\u31c0-\\u31ef	CJK笔划
		//\\u3400-\\u4db5	CJK扩展
		//\\u4e00-\\u9fbb	CJK标准
		//\\uac00-\\ud7ff   韓文拼音組合字區
		//\\uf900-\\ufaff   中日韓兼容表意文字區
		//\\u0400-\\u052f  俄文兼容字符区
		//\\w				所有数字以及26个英文字母
	//	var reg = "[^\\u2e80-\\u9fbb|\\u0030-\\u0039|\\u0040-\\u005a|\\u0061-\\u007a|\\u00a1-\\u00ff|\\uac00-\\ud7ff|\\uf900-\\ufaff]";
		var reg = "[^\\u2e80-\\u9fbb|\\u0020-\\u0021|\\u0023-\\u0026|\\u0028-\\u0039|\\u0040-\\u005a|\\u0061-\\u007a|\\u00a1-\\u00ff|\\uac00-\\ud7ff|\\uf900-\\ufaff|\\u0400-\\u052f]";
		if("chat"==type)
		{
			var exReg, strA, strB, i, j, list, have;
			//过滤特殊分隔符 #!#
			exReg = /#!#/g;
			str = str.replace(exReg, "***");
			//过滤非法字符
			reg = /[^\u2e80-\u9fbb\u0021-\u007e\u00a1-\u00ff\uac00-\ud7ff\uf900-\ufaff]/g;//\u4E00-\u9FA5\uFE30-\uFFA0
			reg = /[^\u2e80-\u9fbb\u0021-\u007e\u00a1-\u00ff\uac00-\ud7ff\uf900-\ufaff\u4E00-\u9FA5\uFE30-\uFFA0\uffe5-\uffe5]/g;
			str = str.replace(reg, "*");
			DBOut(str);
			//把过滤后的*去除，再去匹配屏蔽字
			exReg = new RegExp("\\*","g");///\*/g
			strA = str.replace(exReg,"");
			//过滤屏蔽字
			have=0;
			list=this.textFilter.textLib;
			for(i=0; i<list.length; i++)
			{
				strB="";
				for(j=0; j<list[i].length; j++)
				{
					strB+="*";
				}
				exReg = new RegExp(list[i],"g");
				if(strA.match(exReg))
				{
					have++;
					strA = strA.replace(exReg, strB);
				}
			}
			DBOut(strA);
			if(have)
			{
				DBOut("有屏蔽字");
				return strA;
			}
			return str;
		}
	//	Pattern p = Pattern.compile(reg);
	//	Matcher m = p.matcher(str);
	//	return !m.find();
		if(!str.match(reg) && !this.textFilter.check(str))//合法
			return false;
		return true;//非法
	};

	__Page.appEnv.saveCityVO=function(vo,name)
	{
		var bld=vo.instances;
		vo.instances=[];
		this.page.setCookie("Runtime",name,toJSON(vo),0);
		this.page.setCookie("Runtime",name+"Bld",toJSON(bld),0);
		vo.instances=bld;
	};

	__Page.appEnv.getCityVO=function(name)
	{
		var saveTxt=this.page.getCookie("Runtime",name);
		if(saveTxt)
		{
			saveTxt=fromJSON(saveTxt);
			var bld=this.page.getCookie("Runtime",name+"Bld");
			if(bld)
			{
				bld=fromJSON(bld);
			}
			saveTxt.instances=bld;
		}else{
			saveTxt=this.page.getCookie("COC",name);
			if(saveTxt)
			{
				saveTxt=fromJSON(saveTxt);
			}
		}
		return saveTxt;
	};


	__Page.appEnv.setDlgAniCall=function(fun,obj,keep,now)
	{
		if(fun && obj)
		{
			if(now)
			{
				fun.call(obj);
			}
			else
			{
				this.dlgBoxDock.adRot.callFun=fun;
				this.dlgBoxDock.adRot.callObj=obj;
				this.dlgBoxDock.adRot.onAniDone=function()
				{
					setFrameout(0,function(){
						if(this.callFun && this.callObj)
							this.callFun.call(this.callObj);
						if(!keep)
						{
							this.callFun=null;
							this.callObj=null;
						}
					},this);
				}
			};
		}
	};

	__Page.appEnv.clearDlgAniCall=function()
	{
		this.dlgBoxDock.adRot.callFun=null;
		this.dlgBoxDock.adRot.callObj=null;
		this.dlgBoxDock.adRot.onAniDone=function()
		{

		}
	};

	__Page.appEnv.setPmtAniCall=function(fun,obj,keep,now)
	{
		if(fun && obj)
		{
			if(now)
			{
				fun.call(obj);
			}
			else
			{
				this.pmtBoxDock.adRot.callFun=fun;
				this.pmtBoxDock.adRot.callObj=obj;
				this.pmtBoxDock.adRot.onAniDone=function()
				{
					setFrameout(0,function(){
						if(this.callFun && this.callObj)
							this.callFun.call(this.callObj);
						if(!keep)
						{
							this.callFun=null;
							this.callObj=null;
						}
					},this);
				}
			};
		}
	};

	__Page.appEnv.clearPmtAniCall=function()
	{
		this.pmtBoxDock.adRot.callFun=null;
		this.pmtBoxDock.adRot.callObj=null;
		this.pmtBoxDock.adRot.onAniDone=function()
		{

		}
	};

	__Page.appEnv.bMech2Attack=function()
	{
		if(window.aisGame && window.aisGame.bVisit)return 1;
		var defLib=window.aisEnv.defLib.globals;
		var lv=window.aisGame.curCity.aisTownHall?window.aisGame.curCity.aisTownHall.level:1;
		if(lv<4)return -1;
		var res=defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK"+lv];
		if(!res)return 0;
		if(window.aisGame.curCity.honor>=res)
			return 1;
		return 0;
	};
	__Page.appEnv.getMech2AttackHonor=function()
	{
		var defLib=window.aisEnv.defLib.globals;
		var lv=window.aisGame.curCity.aisTownHall.level;
		var res=defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK"+lv];
		return res;
	};
	__Page.appEnv.bShowBtmCutCstTime=function()
	{
		if(window.aisGame && window.aisGame.bVisit)return 1;
		var defLib=window.aisEnv.defLib.globals;
		var lv=window.aisGame.curCity.aisTownHall?window.aisGame.curCity.aisTownHall.level:1;

		if(lv>=defLib["TIME_BUTTON_TOWNHALL_LEVEL_LIMIT"])//window.aisGame.king.kingTime()>(window.aisGame.curCity.timeButtonCoolDown)
			return 1;
		return 0;
	};
	__Page.appEnv.getAddOnLv=function(qulity)
	{
		var qList=["F-","F","E","D","C","B","A","S","SS"];
		return qList[qulity-1];
	};
	__Page.appEnv.setBoxTimes=function(codename)
	{
		var i, j, box=[];
		var defLib=window.aisEnv.defLib.box;
		if(codename)//开宝箱，次数+1
		{
			defLib[codename].dailyTimes++;
			return defLib[codename];
		}
		else if(0==codename)//重置宝箱次数
		{

		}
		else//根据服务器信息初始化宝箱次数
		{
			var tVo=window.aisGame.curCity.openBoxTimesDaily;
			if(!tVo)return;
			for(i=0; i<tVo.length; i++)
			{
				DBOut("=====*** svo:"+tVo);
				defLib[tVo[i].boxId].dailyTimes=tVo[i].dailyTimes;
			}
			for(i in defLib)
			{
				if(defLib[i]["codeName"] && defLib[i]["IsShow"])
				{
					if(!defLib[i].dailyTimes)
					{
						defLib[i].dailyTimes=0;
					}
				}
			}
			var svrTime=window.aisEnv.dateTime();
			var dayMS=1000*60*60*24;
			var tail=svrTime%dayMS;
			var refreshTime=dayMS-tail;
			this.layer.setTimeout(refreshTime,this.resetBoxTimes,this);
		}
	};
	__Page.appEnv.resetBoxTimes=function()
	{
		this.setBoxTimes(0);
		if(this.curDlg && "dlgBox"==this.curDlg.name)
		{
			this.curDlg.updateView();
		}
	};
	__Page.appEnv.getItemIcon=function(codename,size)
	{
		if(!codename)
			return {};
		var page=this.page;
		var imgLib=page.imgLib;
		var tail, url, css;
		codename=codename.toLowerCase();
		if(codename.indexOf("oil")>-1)
		{//genIconPath
			size=size?size:64;
			css=imgLib.getIcon("res_oil",size);
		}
		else if(codename.indexOf("gold")>-1)
		{
			size=size?size:64;
			css=imgLib.getIcon("res_gold",size);
		}
		else if(codename.indexOf("gem")>-1)
		{
			size=size?size:64;
			css=imgLib.getIcon("res_gem",size);
		}
		else if(codename.indexOf("tok1")>-1)
		{
			size=size?size:64;
			css=imgLib.getIcon("res_chip",size);
		}
		else if(codename.indexOf("cube")>-1 || codename.indexOf("Cube")>-1)
		{
			size=size?size:64;
			css=imgLib.getIcon("res_cube",size);
		}
		else if(codename.indexOf("tok2")>-1)
		{
			size=size?size:64;
			css=imgLib.getIcon("res_cuttime",size);
		}
		else if(codename.indexOf("plu")>-1)
		{
			css=imgLib.getIcon(codename+"_32");
		}
		else if(codename.indexOf("par")>-1)
		{
			size=size?size:"m";
			css=imgLib.getIcon(codename+"_"+size+"_32");
		}
		url=css.tex;
		return css;
	};
	__Page.appEnv.getItemInfo=function(vo)
	{
		var appEnv=this;
		var textLib=appEnv.textLib;
		var page=appEnv.page;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		if(vo)
		{
			var resURL, name, q=0;
			if("ResGold"==vo.type || "Gold"==vo.type)
			{
				resURL=imgLib.genIconPath("res_gold",128);
				name=textLib["ResGold"];
			}
			else if("ResOil"==vo.type || "Oil"==vo.type || "Elixir"==vo.type)
			{
				resURL=imgLib.genIconPath("res_oil",128);
				name=textLib["ResOil"];
			}
			else if("gem"==vo.type || "Gem"==vo.type)
			{
				resURL=imgLib.genIconPath("res_gem",128);
				name=textLib["ResGem"];
			}
			else if("cash"==vo.type || "tok1"==vo.type)
			{
				resURL=imgLib.genIconPath("res_chip",128);
				name=textLib["ResCash"];
			}
			else if("cube"==vo.type || "Cube"==vo.type || "ResCube"==vo.type)
			{
				resURL=imgLib.genIconPath("res_cube",128);
				name=textLib["ResCube"];
			}
			else if(vo.type.indexOf("par")>-1)
			{
				resURL=imgLib.genIconPath(vo.type+"_m_32");
				name=window.aisEnv.defLib.part[vo.type].name;
			}
			else if(vo.type.indexOf("plu")>-1)
			{
				resURL=imgLib.genIconPath(vo.type+"_32");
				name=window.aisEnv.defLib.addon[vo.type].name;
				q=window.aisEnv.defLib.addon[vo.type].quality;
			}else if("Item"==vo.catalog || vo.type.indexOf("itm")>-1)
			{
				resURL=imgLib.genIconPath("icon_"+vo.type+"_32");
				name=window.aisEnv.defLib.item[vo.type].ItemName;
			}
			return {url:resURL, name:name, q:q}
		}
	};

	//---------------------------------------------------------------------------
	//计算加速需要钻石数的函数
	__Page.appEnv.convertTime2Gem=function(time)
	{
		var def=window.aisEnv.defLib.globals;
		var gemNum;
		time/=1000;
		var sec=60;
		if(!time || time<0){
			gemNum=0;
		}else if(time<=60){
			gemNum=def["SPEED_UP_DIAMOND_COST_60_SECOND"];
		}else if(time<=3600){
			gemNum=def["SPEED_UP_DIAMOND_COST_60_SECOND"]+Math.round((time-60)/def["SPEED_UP_DIAMOND_DIVISOR_60_SECOND"]/sec);
		}else if(time<=86400){
			gemNum=def["SPEED_UP_DIAMOND_COST_3600_SECOND"]+Math.round((time-3600)/def["SPEED_UP_DIAMOND_DIVISOR_3600_SECOND"]/sec);
		}else if(time<=604800){
			gemNum=def["SPEED_UP_DIAMOND_COST_86400_SECOND"]+Math.round((time-86400)/def["SPEED_UP_DIAMOND_DIVISOR_86400_SECOND"]/sec);
		}else{
			gemNum=def["SPEED_UP_DIAMOND_COST_604800_SECOND"]+Math.round((time-604800)/def["SPEED_UP_DIAMOND_DIVISOR_604800_SECOND"]/sec);
		}
		gemNum=(gemNum<=0)?1:gemNum;
		return gemNum;
	};

	//---------------------------------------------------------------------------
	//计算买资源需要钻石数的函数
	__Page.appEnv.convertRes2Gem=function(res)
	{
		var def=window.aisEnv.defLib.globals;
		var gemNum;
		if(!res || res<0){
			gemNum=0;
		}else if(res<=100){
			gemNum=def["RESOURCE_DIAMOND_COST_100"];
		}else if(res<=1000){
			gemNum=def["RESOURCE_DIAMOND_COST_100"]+Math.round((res-100)/def["RESOURCE_DIAMOND_DIVISOR_100"]);
		}else if(res<=10000){
			gemNum=def["RESOURCE_DIAMOND_COST_1000"]+Math.round((res-1000)/def["RESOURCE_DIAMOND_DIVISOR_1000"]);
		}else if(res<=100000){
			gemNum=def["RESOURCE_DIAMOND_COST_10000"]+Math.round((res-10000)/def["RESOURCE_DIAMOND_DIVISOR_10000"]);
		}else if(res<=1000000){
			gemNum=def["RESOURCE_DIAMOND_COST_100000"]+Math.round((res-100000)/def["RESOURCE_DIAMOND_DIVISOR_100000"]);
		}else if(res<=10000000){
			gemNum=def["RESOURCE_DIAMOND_COST_1000000"]+Math.round((res-1000000)/def["RESOURCE_DIAMOND_DIVISOR_1000000"]);
		}else{
			gemNum=def["RESOURCE_DIAMOND_COST_10000000"]+Math.round((res-10000000)/def["RESOURCE_DIAMOND_DIVISOR_10000000"]);
		}
		gemNum=(gemNum<=0)?1:gemNum;
		return gemNum;
	};

	__Page.appEnv.isAdvMonthCard=function()
	{
		var city;
		city=window.aisGame.curCity;
		var buff=city.getBuff("MonthCard15");
		if(buff)return 1;
		return 0;
	};
	__Page.appEnv.getBuffRemainTimeByName=function(codename)
	{
		if(!codename)codename="TH";
		var city=window.aisGame.curCity;
		var buff=city.getBuff(codename);
		if(buff)
		{
			buff=city.buffs[codename];
			return buff.endTime-city.env.dateTime();
		}
		return 0;
	};
	__Page.appEnv.getShieldTime=function()
	{
		var city=window.aisGame.curCity;
		var def=window.aisEnv.defLib.buff;
		if(!city.shieldTime)
			city.shieldTime=[];
		var shieldTime=city.shieldTime;
		var i, j, k;
		for(i in def)
		{
			k=0;
			if(def[i]["codeName"] && def[i]["codeName"].indexOf("Shield")>-1)
			{
				for(j=0; j<shieldTime.length; j++)
				{
					if(shieldTime[j].codename==def[i]["codeName"])
					{
						k=1;
						break;
					}
				}
				if(!k)
				{
					shieldTime.push({codename:def[i]["codeName"],cooldownTime:0});
				}
			}
		}
	};
////////////////////////////////////////
//联盟信息相关函数
////////////////////////////////////////
	__Page.appEnv.getMembersDevote=function(cvo)//获取联盟成员贡献值
	{
		if(!cvo)
		{
			var state=this.page.stateHome;
			cvo=state.clanInitVO;
			if(!cvo)return 0;
			cvo=cvo.clanVO;
		}
		var msgObj=window.aisGame.curCity.clanMsgs;
		var members=cvo.members;
		var i, j, member, devotes;
		for(j=0; j<members.length; j++)
		{
			member=members[j];
			member.tmpContributionGems = member.tmpContributionTimes = member.tmpTechGems = member.tmpTechTimes = 0;
			devotes=member.devotes;
			if(devotes && devotes.length)
			{
//	this.CLAN_DONATE_POINT = 		"0";//联盟捐赠
//	this.CLAN_TECH =				"1";//联盟科技
				for(i=0; i<devotes.length; i++)
				{
					if(msgObj.CLAN_DONATE_POINT==devotes[i].type)//联盟捐献
					{
						member.tmpContributionGems=devotes[i].num;
						member.tmpContributionTimes=devotes[i].freeTimes+devotes[i].payTimes;
					}
					else if(msgObj.CLAN_TECH==devotes[i].type)//联盟科技
					{
						member.tmpTechGems=devotes[i].num;
						member.tmpTechTimes=devotes[i].freeTimes+devotes[i].payTimes;
					}
				}
			}
			member.tmpTotalGems=member.tmpContributionGems+member.tmpTechGems;
			member.tmpTotalTimes=member.tmpContributionTimes+member.tmpTechTimes;
		}
	//	members.sort(function(a,b){return b.tmpTotalGems-a.tmpTotalGems;});
	//	members.sort(function(a,b){return b.tmpTotalTimes-a.tmpTotalTimes;});
	};
	__Page.appEnv.updateMemberDevote=function(msg)//更新联盟成员贡献值
	{
		var state=this.page.stateHome;
		var cvo=state.clanInitVO;
		if(!cvo)return 0;
		cvo=cvo.clanVO;
		DBOut("updateMemberDevote: "+toJSON(msg));
		var msgObj=window.aisGame.curCity.clanMsgs;
		var members=cvo.members;
		var i, member;
		for(i=0; i<members.length; i++)
		{
			member=members[i];
			if(member.userId==msg.userId)
			{
				break;
			}
		}
	//	DBOut(toJSON(member));
		if(msgObj.CHAT_MSG_DONATE_GET_POINTS == msg.type)//捐献
		{
			member.tmpContributionTimes++;
			member.tmpTotalTimes++;
			var defLib=window.aisEnv.defLib.clan;
			if(msg.remainPlace)//花钻
			{
				DBOut(1+": "+defLib["powerDonate"]["cost"]["gem"]);
				member.tmpContributionGems+=defLib["powerDonate"]["cost"]["gem"];
				member.tmpTotalGems+=defLib["powerDonate"]["cost"]["gem"];
			}
			else//免费
			{
				DBOut(2);
			}
		}
		else if(msgObj.CHAT_MSG_RESPOND_CALL == msg.type || msgObj.CHAT_MSG_CALL_GEM == msg.type)//响应联盟号召 || 钻石秒科技
		{
			member.tmpTechTimes++;
			member.tmpTotalTimes++;
			var defLib=window.aisEnv.defLib.clanTec;
			var appendMsg=fromJSON(msg.appendMsg);
			var codename=appendMsg.codename;
			var techDef=defLib[codename];
			var techLv=this.getClanTechLv(codename);
			var lvo=techDef["levels"][techLv-1];
			if(msgObj.CHAT_MSG_RESPOND_CALL == msg.type)//响应
			{
				DBOut(3+": "+lvo["callCost"]["gem"]);
				member.tmpTechGems+=lvo["callCost"]["gem"];
				member.tmpTotalGems+=lvo["callCost"]["gem"];
			}
			else if(msgObj.CHAT_MSG_CALL_GEM == msg.type)//钻秒
			{
				DBOut(4+": "+lvo["cost"]["gem"]);
				member.tmpTechGems+=lvo["cost"]["gem"];
				member.tmpTotalGems+=lvo["cost"]["gem"];
			}
		}
	//	DBOut(toJSON(member));
	};
	__Page.appEnv.getMemberIsFormal=function(member)//获取联盟见习成员是否已经转正
	{
		var msgObj=window.aisGame.curCity.clanMsgs;
		var curTime=window.aisEnv.dateTime()-window.aisGame.king.debugTime;
		var timeNeed=window.aisEnv.defLib.globals["CLAN_MEMBER_INTERNSHIP_HOUR"]*window.hourMS;
		var formal=1, timeLen=0, rankLevel=member.rankLevel;
		member.internshipTime=0;
		if(member.rankLevel==msgObj.CLAN_RANK_NON_MEMBER)
		{
			timeLen=curTime-member.joinClanTime;
			if(timeLen>=timeNeed)//过了见习期
			{
			//	rankLevel=msgObj.CLAN_RANK_MEMBER;
			}
			else//还在见习期
			{
				formal=0;
				member.internshipTime=timeNeed-timeLen;
				DBOut("见习成员剩余时间："+this.textLib.getTimeText(timeLen));
			}
		}
	//	DBOut(toJSON(member));
		member.rankLevel=rankLevel;
		var param=formal?0:timeLen;//正式成员返回0，见习成员返回剩余见习时间
		DBOut("getMemberIsFormal："+param);
		return param;
	};
	__Page.appEnv.getClanMemberMedal=function(member,index)//获取联盟成员转换后的勋章数
	{
		var score=member.score;
		if(!(index>=0))
		{
			score=0;
		}
		else if(index<10)
		{
			score=Math.floor(score*1);
		}
		else if(index<20)
		{
			score=Math.floor(score*0.5);
		}
		else if(index<30)
		{
			score=Math.floor(score*0.25);
		}
		else if(index<40)
		{
			score=Math.floor(score*0.15);
		}
		else
		{
			score=Math.floor(score*0.1);
		}
		DBOut("=== getClanMemberMedal："+score);
		return score;
	};
	__Page.appEnv.getClanMedal=function(cvo)//获取联盟当前勋章数
	{
		if(!cvo)
		{
			var state=this.page.stateHome;
			cvo=state.clanInitVO;
			if(!cvo)return 0;
			cvo=cvo.clanVO;
		}
		var members=cvo.members;
		members.sort(function(a,b){return b.score-a.score;});
		var i, j=0, score=0;
		for(i=0; i<members.length; i++)
		{
			if(!this.getMemberIsFormal(members[i]))
			{
				score+=this.getClanMemberMedal(members[i],j);
				j++;
			}
		}
		return score;
	};
	__Page.appEnv.getClanResNum=function(clanVO,resType)//获取联盟仓库拥有的资源数量
	{
		var state=this.page.stateHome;
		if(!clanVO)clanVO=state.clanInitVO.clanVO;
		var storage=clanVO.storage;
		var resNum=0;
		if(!resType)resType="Gem";
		if(storage && storage.length)
		{
			for(var i=0; i<storage.length; i++)
			{
				if(resType==storage[i].type)
				{
					resNum=storage[i].num;
					break;
				}
			}
		}
		return parseInt(resNum,10);
	};
	__Page.appEnv.getClanLevel=function()//获取联盟当前等级
	{
		var state=this.page.stateHome;
		var level=state.clanInitVO.clanVO.level;
		level-=1;
		//返回level的意义为数组下标
		DBOut("getClanLv: "+level);
		return parseInt(level,10);
	};
	__Page.appEnv.getClanPoint=function()//获取联盟当前经验
	{
		var state=this.page.stateHome;
		var point=state.clanInitVO.clanVO.point;
		return parseInt(point,10);
	};
	__Page.appEnv.getClanTechs=function()//获取联盟当前等级拥有的科技
	{
		var state=this.page.stateHome;
		var techs=state.clanInitVO.clanVO.techs;
		return techs;
	};
	__Page.appEnv.getClanFreeDonate=function()//获取联盟今天是否还能免费捐献
	{
		var state=this.page.stateHome;
		var defLib=window.aisEnv.defLib.clan;
		var times=defLib["genDonate"].times;
		var bld=window.aisGame.king.getHashObj("Obj0");
		var usedTimes=bld.dailyDonateTimes;
		if(!usedTimes)usedTimes=0;
		if(times>usedTimes)
			return 1;
		return 0;
	};
	__Page.appEnv.getClanMemberMax=function(level)//获取联盟当前级别最大人数上限
	{
		//参数level的意义为联盟等级，从1开始
		var state=this.page.stateHome;
		var defLib=window.aisEnv.defLib.clan;
		var levels=defLib["levels"];
		var i, max=window.aisEnv.defLib.globals["MAX_CLAN_MEMBERS"];
	//	if(!(level>=0))level=this.getClanLevel();
		if(!level)//联盟最低等级改为了1级
			level=this.getClanLevel();
		else
			level-=1;
		//返回level的意义为数组下标

		max+=levels[level]["addMen"];
//			for(i=0; i<levels.length; i++)
//			{
//				max+=levels[i]["addMen"];
//				if(i==level)
//					break;
//			}
		return parseInt(max,10);
	};
	__Page.appEnv.getClanTechLv=function(codeName)//获取联盟科技当前等级
	{
		var state=this.page.stateHome;
		var defLib=window.aisEnv.defLib.clan;
		var levels=defLib["levels"];
		var curLv=this.getClanLevel();
		var levelVO=levels[curLv];
		var techs=levelVO["tec"];
		var i=0, techLv=0, techInfo;
		for(i=0; i<techs.length; i++)
		{
			if(codeName==techs[i]["codeName"])
			{
				techLv=techs[i]["level"];
				break;
			}
		}
		return techLv;
	};
	__Page.appEnv.getClanTechStatus=function(codeName)//获取联盟科技当前状态
	{
		var state=this.page.stateHome;
		var i=0, status=2;//默认 - 解锁未启用
		if(!this.getClanTechLv(codeName))
		{
			status=-1;//未解锁
		}
		else
		{
			//旧的 --- 0:号召中 1:已开启
			//新的 --- 1:号召中 2:已开启 0:未启用
			status=2;//解锁未启用
			var techs=this.getClanTechs();
			for(i=0; i<techs.length; i++)
			{
//				DBOut(techs[i].expireTimes+" > "+window.aisEnv.dateTime()+" - "+window.aisGame.king.debugTime);
//				DBOut(
//					(2==techs[i].status)+" && "+(techs[i].expireTimes>window.aisEnv.dateTime()-window.aisGame.king.debugTime)+" = "+
//					(2==techs[i].status && techs[i].expireTimes>window.aisEnv.dateTime()-window.aisGame.king.debugTime)
//				);
				if(codeName==techs[i].codename)
				{
					if(1==techs[i].status)
						status=0;//号召中
					else if(2==techs[i].status && techs[i].expireTimes>window.aisEnv.dateTime()-window.aisGame.king.debugTime)
						status=1;//已开启
					else if(2==techs[i].status && techs[i].expireTimes<=window.aisEnv.dateTime()-window.aisGame.king.debugTime)
						status=2;//解锁未启用
					break;
				}
			}
		}
		DBOut("getClanTechStatus: "+status);
		return status;
	};
	__Page.appEnv.getClanTech=function(codeName)//获取联盟科技
	{
		var state=this.page.stateHome;
		var i=0, tech={};
		if(!this.getClanTechLv(codeName))
		{

		}
		else
		{
			var techs=this.getClanTechs();
			for(i=0; i<techs.length; i++)
			{
				if(codeName==techs[i].codename)
				{
					return techs[i];
				}
			}
		}
	};

	__Page.appEnv.getBldValueByValueName=function(bld,v,limit)
	{
		var i,n,def,_def,__def,tech,value,stage,city,level,lv,combat;

		stage=this.page.vwHomeStage;
		def=bld.def;
		var prefix="";
		if(bld.fireMode)prefix="Alt";
		i=stage.level.getObjDefIdx(prefix+def.codeName+bld.level);
		if(i==-1)return 0;
		_def=stage.objDefs[i];
		if(v=="Hitpoints")
			value=_def.hp.full;
		else if(v=="Damage")
		{
			combat=_def._combat;
			if(_def["_empower"])
				combat=_def["_empower"];
			else if(_def["_multi_target"])
				combat=_def["_multi_target"];
			value=combat.damage_per_sec;
			if("undefined"==typeof(value) && combat["phases"])
			{
				var phasesLen=combat["phases"].length;
				if("min"==limit)
					value=combat["phases"][0]["damage"];
				else if("max"==limit)
					value=combat["phases"][phasesLen-1]["damage"];
			}
		}
		else
			return 0;

		city=window.aisGame.curCity;

		if(city.clanVO)
		{
			n=city.clanVO.techs.length;
			for(i=0;i<n;i++)
			{
				tech=city.clanVO.techs[i];
				//if(tech.status!=city.clanMsgs.CLAN_TECH_STATUS_ED)continue;
				if(this.getClanTechStatus(tech.codename)!=1)continue;
				__def=window.aisEnv.defLib.clanTec[tech.codename];
				lv=this.getClanTechLv(tech.codename);
				level=__def.levels[lv-1];
				if(!__def || !level)continue;
				if(level.scopeVar==v && def.groupId==level.scope)
				{
					if(level.scopeType==2)
						value=Math.floor(value*(level.scopeValue*0.01));
				}
			}
		}
		return value;
	};

	__Page.appEnv.getClanTechLvByClanLv=function(clv,codeName)
	{
		var state=this.page.stateHome;
		var defLib=window.aisEnv.defLib.clan;
		var levels=defLib["levels"];
		var curLv=clv-1;
		var levelVO=levels[curLv];
		var techs=levelVO["tec"];
		var i=0, techLv=0, techInfo;
		for(i=0; i<techs.length; i++)
		{
			if(codeName==techs[i]["codeName"])
			{
				techLv=techs[i]["level"];
				break;
			}
		}
		return techLv;
	};

	__Page.appEnv.getSubLeaderCan=function()
	{
		var state=this.page.stateHome;
		var cvo=state.clanInitVO;
		if(!cvo)return 0;
		var members=cvo.clanVO.members;
		var msgObj=window.aisGame.curCity.clanMsgs;
		var i, num=0, max=window.aisEnv.defLib.globals["CLAN_DEPUTY_LEADER_NUM"];
		for(i=0; i<members.length; i++)
		{
			if(members[i].rankLevel==msgObj.CLAN_RANK_DEPUTY_LEADER)
				num++;
		}
		if(num>=max)
			return 0;
		else
			return 1;
	};

	__Page.appEnv.showClanTechLog=function(msg)
	{
		if(msg.userId != window.USERID)return;
		var appEnv=this;
		var textLib=appEnv.textLib;
		var msgObj=window.aisGame.curCity.clanMsgs;
		if((msg.type==msgObj.CHAT_MSG_CALL_ON || msg.type==msgObj.CHAT_MSG_RESPOND_CALL || msg.type==msgObj.CHAT_MSG_CALL_GEM) && !msg.responseStatusCode)
		{
			var defLib=window.aisEnv.defLib.clanTec;
			var appendMsg=fromJSON(msg.appendMsg);
			var codename=appendMsg.codename;
			var techDef=defLib[codename];
			var techLv=appEnv.getClanTechLv(codename);
			var lvo=techDef["levels"][techLv-1];
		//	str=str=textLib.getTextEx("ClanCallTech",{tech:lvo["name"]});
			var str, strEx;
			if(msg.type==msgObj.CHAT_MSG_CALL_ON)
			{
				strEx="CallTechOk";
			}
			else if(msg.type==msgObj.CHAT_MSG_RESPOND_CALL)
			{
				strEx="ResponseTechOk";
			}
			else if(msg.type==msgObj.CHAT_MSG_CALL_GEM)
			{
				strEx="GemDoneTechOk";
			}
			str=textLib.getTextEx(strEx,{tech:lvo["name"]});
			appEnv.stateLogs.showLog(str);
		}
	};
////////////////////////////////////////
	__Page.appEnv.getDomainInfo=function(codeName)//获取某个领地当前状态信息
	{
/**
[
	{"clanIds": [], "codename": "3", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [118], "codename": "2", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [], "codename": "10", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [], "codename": "1", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [], "codename": "7", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [], "codename": "6", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [], "codename": "5", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [], "codename": "4", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [], "codename": "9", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0},
	{"clanIds": [], "codename": "8", "lords": -1, lordFlag:3, lordName:"name", "lordsScore": 0}
]
/**/
		var landInfo=this.landWarInfo;
		if(landInfo && landInfo.length)
		{
			var attacker=[], i, j;
			for(i=0; i<landInfo.length; i++)
			{
				if(codeName==landInfo[i].codename)
					return landInfo[i];
			}
		}
		return {};
	};
	__Page.appEnv.getClanLandWarScore=function(clear)//获取联盟当前领土战总积分
	{
		var state=this.page.stateHome;
		var cvo=state.clanInitVO;
		if(!cvo)
			return 0;
		cvo=cvo.clanVO;
		var members=cvo.members;
		var i, score=0;
		if(clear)
		{
			for(i=0; i<members.length; i++)
			{
				members[i].curClanCupScore=0;
			}
		}
		else
		{
			for(i=0; i<members.length; i++)
			{
				score+=members[i].curClanCupScore;
			}
		}
		return score;
	};
	__Page.appEnv.getWarScoreByUserId=function(userId)//获取联盟成员当前领土战积分
	{
		var state=this.page.stateHome;
		var cvo=state.clanInitVO;
		if(!cvo)
			return 0;
		cvo=cvo.clanVO;
		var members=cvo.members;
		var i;
		for(i=0; i<members.length; i++)
		{
			if(members[i].userId==userId)
				return members[i].curClanCupScore;
		}
	};
	__Page.appEnv.settlementClanCup=function(data)
	{
		this.closeAnAccountFlag=data.closeAnAccountFlag;//结算完成标识 1：结算完成
		this.remainDays=data.remainDays;//领土战剩余时间

		this.landWarInfo=null;
		this.landWarDetail=null;
		this.getClanLandWarScore("clear");
		if(window.aisGame.curCity.clanLoginVO)
			window.aisGame.curCity.clanLoginVO.targetDomainId="";
		this.stateLogs.showLog(this.textLib.ClearClanCupInfo);
		if(this.curDlg && this.curDlg.name=="dlgLandgrave")
		{
			this.closePmtDlg(null,null,0);
		//	this.closeDlg(null,null,0);
			var url=this.page.genPageURL("ui/dlg/dlg_landgrave.jml");
			this.openPageDlg(url,null);
		}
		if(!(this.remainDays>0))
			this.page.stateHome.btnLand.stopScale();
	};
	__Page.appEnv.getTodayScoreDisplay=function()//获取是否显示领土战各个盟的分数
	{
		var zeroTime=window.aisGame.curCity.nextDayZeroTime;//服务器今日24点
		if(!zeroTime)return 0;
		zeroTime-=window.dayMS;//服务器今日24点 - 24小时 = 服务器今日0点
		var defLib=window.aisEnv.defLib.globals;
		var showTime=defLib["CLAN_CUP_SHOW_SCORE_TIME"];//显示分数的时间 18
		var refreshTime=defLib["CLAN_CUP_REFRESH_PER_DATE_TIME"];//领土战刷新的时间 22
		showTime=zeroTime+showTime*window.hourMS;
		refreshTime=zeroTime+refreshTime*window.hourMS;
		var curTime=window.aisEnv.dateTime()-window.aisGame.king.debugTime;
		var show=0;
		if(curTime>=showTime && curTime<=refreshTime)
		{
			show=1;
		}
		DBOut("------ scoreShow: "+show);
		return show;
	};

	__Page.appEnv.getServerID=function()
	{
		var id=this.page.getCookie("Runtime","svrId");
		id=id?parseInt(id,10):0;
		return id;
	};
	__Page.appEnv.getServerNameByID=function(svrId)
	{
		var svr=this.page.getCookie("Runtime","Servers");
		var i,name="";
		if(svr)
		{
			svr=fromJSON(svr);
			for(i=0;i<svr.length;i++)
			{
				if(svr[i] && svr[i].id==svrId)
				{
					name=svr[i].name;
					break;
				}
			}
		}
		return name;
	};
}
