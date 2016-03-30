if(!__Page.stateHome)
{
	__Page.stateHome={
		page:__Page,
		name:"HomeState",
		lastLUDT:0,
		lockLUDT:1,
		timerLUDT:null,
		pushMsgs:[],
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateHome);

	//初始化State
	__Page.stateHome.init=function(appEnv)
	{
		var page;
		var imgLib;
		var cssLib;
		var city;
		var layer,keyid;

		this.appEnv=appEnv;
		appEnv.stateHome=this;
		page=this.page;
		imgLib=page.imgLib;
		cssLib=page.cssLib;
		if(window.aisGame)
		{
			if(aisGame.king)
			{
				this.king=aisGame.king;
				city=this.city=aisGame.curCity;
			}
		}
		page.keyStateUtil.call(this);
		page.vwHomeStage.initStage();

		//创建State专署UI控件:
		{
			layer=this.appEnv.layer;
			appEnv.hudBaseBox=this.hudBaseBox=layer.addHudItem({type:"shape",id:"hudBaseBox",pos:[0,0,0],w:20,h:20,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudTLBox=this.hudBaseBox.appendNewChild({
				type:"shape",ch_align:0,cv_align:0,pos:[0,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
				fade:1,fade_size:1,fade_alpha:0
			});
			this.hudTCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudTRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[appEnv.scrSize[0]-300,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			this.hudBLBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[0,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});

			this.hudBRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300),appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
			if(window.aisGame && window.aisGame.bVisit)
			{
				keyId=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyId,this,this.onHomeClk);
				var pic=imgLib.getImg("btn_backhome");
				this.homeBtn=this.hudBLBox.appendNewChild({type:"key",pos:[pic.w/2+5,this.hudBLBox.getH()-pic.h/2-5,0],css:pic,anchor_h:1,anchor_v:1,key:keyId,ui_event:1,button:1,down_scale:0.95,
					audio:this.page.audioObject.genFileURL("btn_click"),});

				var dt=10, iconBtnW=64;;
				var keyBG=imgLib.getImg("btn_shop");

				var rankX=appEnv.scrSize[0]-(dt+iconBtnW/2);
				var rankY=appEnv.scrSize[1]-dt-keyBG.h-dt-iconBtnW/2;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnRank=cssLib.btnMain.create(this.hudBaseBox,[rankX,rankY,0],keyid,"btn_rank_32");
				this.regKeyVO(keyid,this,this.onRankClick);
			}else{
				var dt=10, iconBtnW=64;;
				var keyBG=imgLib.getImg("btn_shop");

				var shopX=dt+keyBG.w/2;
				var shopY=appEnv.scrSize[1]-dt-keyBG.h/2;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnShop=cssLib.btnMain.create(this.hudBaseBox,[shopX,shopY,0],keyid,"btn_attack");
				this.regKeyVO(keyid,this,this.onAttackClick);

				var settingX=shopX+keyBG.w/2+dt+iconBtnW/2;
				var settingY=appEnv.scrSize[1]-dt-iconBtnW/2;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnSetting=cssLib.btnMain.create(this.hudBaseBox,[settingX,settingY,0],keyid,"btn_setting_32");
				this.regKeyVO(keyid,this,this.onSettingClick);

				var friendX=dt+iconBtnW/2;
				var friendY=shopY-keyBG.w/2-dt-iconBtnW/2;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnFriend=cssLib.btnMain.create(this.hudBaseBox,[friendX,friendY,0],keyid,"btn_friend_32");
				this.regKeyVO(keyid,this,this.onFriendClick);
				this.btnFriend.setDisplay(0);
				this.btnSetting.setPos([friendX,friendY,0]);
				this.settingX=friendX;
				this.settingY=friendY;

				var achievementX=friendX;
				var achievementY=friendY-dt-iconBtnW;
				keyid=appEnv.hudKeys.getKey(this);
			//	this.btnAch=cssLib.btnMain.create(this.hudBaseBox,[achievementX,achievementY,0],keyid,"btn_blueBG","icon_achievement_64");
				this.achvmntBtn=cssLib.btnAchvmnt.create(this.hudBaseBox,[achievementX,achievementY,0],keyid);
				this.regKeyVO(keyid,this,this.onAchvClick);

				var attackX=appEnv.scrSize[0]-shopX;
				var attackY=shopY;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnAttack=cssLib.btnMain.create(this.hudBaseBox,[attackX,attackY,0],keyid,"btn_shop");
				this.regKeyVO(keyid,this,this.onShopClick);

				var noteX=appEnv.scrSize[0]-settingX;
				var noteY=settingY;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnNote=cssLib.btnMain.create(this.hudBaseBox,[noteX,noteY,0],keyid,"btn_note_32");
				this.markNewNote=this.btnNote.appendNewChild(
					{type:"icon",id:"NewMark",pos:[20,20,0],css:imgLib.mark_newchvmnt,anchor_h:1,anchor_v:1,display:0}
				);
				this.regKeyVO(keyid,this,this.onLogClick);

				if(window.BaiduTieba)
				{
					var tiebaX=appEnv.scrSize[0]-settingX;
					var noteY=settingY-68;
					keyid=appEnv.hudKeys.getKey(this);
					this.btnTieba=cssLib.btnMain.create(this.hudBaseBox,[noteX,noteY,0],keyid,"btn_tieba_32");
					this.regKeyVO(keyid,this,this.onTiebaClick);
				}

				var prgs=window.aisGame.king.dailytasks.getProgress();
			//	DBOut("daily progress: "+toJSON(prgs));
				var dailyX=settingX;
				var dailyY=settingY;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnDaily=cssLib.btnMain.create(this.hudBaseBox,[dailyX,dailyY,0],keyid,"btn_daily_32");
				this.markNewDaily=this.btnDaily.appendNewChild(
					{type:"icon",id:"NewMark",pos:[20,20,0],css:imgLib.mark_newchvmnt,anchor_h:1,anchor_v:1,display:0}
				);
				this.dailyPrgs=this.btnDaily.appendNewChild(
					{css:cssLib.textFineMid.createCSS([4,14,0],prgs.cur+"/"+prgs.total,64,64,1,1,1,1,prgs.cur==prgs.total?[255,255,255,255]:[255,38,38,255])}//[0,20,0],[10,200,200,255]
				);
				this.regKeyVO(keyid,this,this.onDailyClick);

/****************临时添加主城大于3级才显示每日任务****************/
				this.btnDaily.setDisplay(0);
				this.btnDaily.viewId="btnDaily";
				this.btnDaily.aisUpdateView=function()
				{
					DBOut("===== btnDaily.aisUpdateView "+this.aisObj.level);
					if(this.aisObj.level>3)
					//	this.setDisplay(1);
						appEnv.hudIn(this,10);
				};
/*****************************************************************/
				//window.aisGame.king.dailytasks

				//**
				keyid=appEnv.appKeys.bldMakeBox;
				this.btnBox=cssLib.btnMain.create(this.hudBaseBox,[dailyX,dailyY-68,0],keyid,"btn_box_32");
				this.btnBox.setDisplay(0);
				/**/


				var rankX=appEnv.scrSize[0]-friendX;
				var rankY=friendY;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnRank=cssLib.btnMain.create(this.hudBaseBox,[rankX,rankY,0],keyid,"btn_rank_32");
				this.regKeyVO(keyid,this,this.onRankClick);

				var allianceX=appEnv.scrSize[0]-achievementX;
				var allianceY=achievementY;
				keyid=appEnv.hudKeys.getKey(this);
				this.btnClan=cssLib.btnMain.create(this.hudBaseBox,[allianceX,allianceY,0],keyid,"btn_clan_32");
				this.regKeyVO(keyid,this,this.onAllianceClick);

				this.RX=rankX;
				this.noticeY=allianceY-dt-iconBtnW;
				this.giftY=this.noticeY-dt-iconBtnW;
			}

			this.hudBCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});

			//调试控件底盘:
			this.hudDBDock=this.hudBaseBox.appendNewChild({
				type:"shape",id:"debug-bock",ch_align:0,cv_align:0,pos:[-200,0,0],w:200,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
				fade:1,fade_size:1,fade_alpha:0,display:window.DEBUGMODE?1:0
			});
			this.hudDBBox=this.hudDBDock.appendNewChild({
				type:"shape",id:"debug-box",ch_align:0,cv_align:0,pos:[0,0,0],w:200,h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:64,border_a:0,ui_event:1,
				display:0,fade:1,fade_size:1,fade_alpha:0
			});

		}
		this.appEnv.layer.setDisplay(0);
		//DBOut("stateHome.init: "+appEnv);
	};

	__Page.stateHome.enter=function(preState)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		DBOut("StateHome: Enter");
		this.page.setCookie("Runtime","replayVer",window.aisEnv.defLib.globals["BATTLE_REPLAY_DEF_VERSION"]+"",0);
		if(window.PUR)
			PUR.startPurchase();

		if(this.page.DWRBase)
		{
			appEnv.dwr = new this.page.DWRBase(window.GameDWRUrl);
			appEnv.dwr.setPage(this.page);
		}

		if(window.aisEnv.defLib.pay)
		{
			var defPay=window.aisEnv.defLib.pay
			var i, ct, catalog={};
			for(i in defPay)
			{
				if(defPay[i]["PayID"])
				{
					ct=defPay[i]["ChannelType"];
					if(!catalog[ct])
					{
						catalog[ct]={};
					}
					catalog[ct][i]=defPay[i];
				}
			}
			defPay.catalog=catalog;
		//	DBOut("********** "+toJSON(defPay.catalog));
		//	for(i in defPay.catalog)
		//		DBOut(i+"======"+toJSON(defPay.catalog[i]));
		}

		if(window.aisGame)
		{
			this.resumeLUDT();
			aisGame.king.addListener(this);
		}
	};

	__Page.stateHome.leave=function(nextState)
	{
		//TODO:code this:
		if(window.aisGame)
		{
			this.pauseLUDT();
			aisGame.king.removeListener(this);
		}
	};

	//当King执行命令后,会调用这个函数:
	__Page.stateHome.onKingExecCom=function(comObj,com,comVO,caller)
	{
		DBOut("StateHome on com: "+com);
		this.updateLUDTTimer();
	};

	__Page.stateHome.onKingUpdate=function()
	{
		var king;
		king=aisGame.king;
		if(this.debugTime)
		{
			var kingTime,timeText;
			kingTime=king.lastUpdate;
			timeText=this.appEnv.textLib.getDebugTimeText(kingTime-king.createTime);
			this.debugTime.setText(timeText);
		}
	};

	__Page.stateHome.onGameLoaded=function()
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var keyid,keyid1,keyid2,keyid3;
		keyid=keyid1=keyid2=keyid3=0;

	//	appEnv.runSnow();
		appEnv.initPlayTime(1,1);
		appEnv.getShieldTime();
		if(!(window.aisGame && window.aisGame.bVisit)){
			keyid1=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid1,this,this.onAddGemClick);

			this.resBoxGold=cssLib.boxResBar.create(this.hudTRBox,[175,/*40*/34,0],aisGame.curCity.goldStorage,aisEnv.defLib.prdct.ResGold,[255,240,80]);
			this.resBoxOil=cssLib.boxResBar.create(this.hudTRBox,[175,/*100*/87,0],aisGame.curCity.oilStorage,aisEnv.defLib.prdct.ResOil,[55,100,30]);

			this.tokenBox=cssLib.boxResBar.create(this.hudTRBox,[175,140,0],aisGame.curCity.cubeStorage,aisEnv.defLib.prdct.ResCube,[236,233,216]);
			//this.tokenBox=cssLib.tokenGem.create(this.hudTRBox,[220,140,0],aisGame.curCity,"",0,keyid1);
			this.gemBox=cssLib.boxGem.create(this.hudTRBox,[220,/*160*/193,0],aisGame.curCity,"",0,keyid1);
			if(window.CUTTIMESW)
			this.cutTimeBox=cssLib.boxCutTime.create(this.hudTLBox,[80,140,0],aisGame.curCity.cuttimeStorage,aisEnv.defLib.prdct.CutTime,[255,240,80]);

			this.btnNotice=cssLib.btnMain.create(this.hudBaseBox,[this.RX,this.noticeY,0],appEnv.appKeys.bldNotice,"icon_ui_notice64_32");
			this.btnGift=cssLib.btnMain.create(this.hudBaseBox,[this.RX,this.giftY,0],appEnv.appKeys.bldGift,"icon_ui_gift64_32");
			var iconSize=64, tx=Math.floor(iconSize/2)-2, ty=Math.floor(-iconSize/2)+2;
			this.txtGift=this.btnGift.appendNewChild({css:cssLib.textFineMid.createCSS([tx,ty],"x0",68,16,2,0,2,0,[255,255,255]),});
			this.btnNotice.setDisplay(0);
			this.btnGift.setDisplay(0);
			this.btnBox.setDisplay((this.city.aisMacShop && this.city.aisMacShop.level)?1:0);
		}

//		this.city.vipLevel=8;
//		this.city.charge=860000;
//		this.city.vipExp=860000;
//		DBOut("======||||| "+this.city.vipBuyGold+" "+this.city.vipBuyOil+" "+this.city.resetDailyTasksTime);
		if(this.city.vipLevel>=0)
		{
			keyid=appEnv.hudKeys.getKey(this);
			if(!(window.aisGame && window.aisGame.bVisit))
				this.regKeyVO(keyid,this,this.onVipClick);
			this.btnVip=cssLib.btnMain.create(this.hudTLBox,[200,/*97*/84,0],keyid,"pic_VIP"+this.city.vipLevel);
		}
		this.addCardIcon("TH");
		this.addCardIcon("CubeCard");

		keyid2=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid2,this,this.onTechCountClick);
		this.expBox=cssLib.boxExpBar.create(this.hudTLBox,[125,/*40*/34,0],[255,240,80],keyid2);
		//this.achvmntBtn=cssLib.btnAchvmnt.create(this.hudTLBox,[40,160,0]);
		this.medalBox=cssLib.boxMedal.create(this.hudTLBox,[80,/*100*/87,0],aisGame.curCity);
		if(window.aisGame && window.aisGame.bVisit)
		{

		}
		else
		{
			if(window.aisGame.curCity.aisMacShop && window.aisGame.curCity.aisMacShop.level && (window.aisEnv.defLib.part.numOnSale && window.aisEnv.defLib.addon.numOnSale))
			{
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onLimitSellClick);
				var sellPic=imgLib.getImg("pic_limitsell"), sellW=sellPic.w, sellH=sellPic.h, sellX=this.settingX+32+6+sellW/2, sellY=this.settingY+10;//hudTLBox --- sellW/2+6,118+sellH/2
				this.limitSell=this.hudBaseBox.appendNewChild({type:"key",pos:[sellX,sellY,0],anchor_h:1,anchor_v:1,css:sellPic,ui_event:1,key:keyid,diwn_scale:0.95,
					state_up:sellPic,state_down:sellPic,state_grage:sellPic,audio:this.page.audioObject.genFileURL("btn_click"),flash:2,display:1});
			//	appEnv.addLoopScale(this.limitSell,0.1,{minX:0.95,maxX:1.05,minY:0.95,maxY:1.05});
			}
			/**/
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onLandClick);
			var warPic=imgLib.getImg("pic_landwar"), warW=Math.floor(warPic.w*0.9), warH=Math.floor(warPic.h*0.9);
			warPic=cloneToObj(warPic);
			warPic.w=warW, warPic.h=warH;
			this.btnLand=this.hudTLBox.appendNewChild({type:"key",pos:[warW/2+6,118+warH/2,0],anchor_h:1,anchor_v:1,css:warPic,ui_event:1,key:keyid,diwn_scale:0.95,
				state_up:warPic,state_down:warPic,state_grage:warPic,audio:this.page.audioObject.genFileURL("btn_click"),button:1,
				startScale:function()
				{
					appEnv.addLoopScale(this,0.1,{minX:0.95,maxX:1.05,minY:0.95,maxY:1.05});
				},
				stopScale:function()
				{
					if(this.scaleAni)
					{
						this.scaleAni.setCurValue([1,1,1]);
						this.scaleAni.stop();
					}
				}
			});
		//	this.btnLand.startScale();

			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onAddWorkerClick);
			this.workerBox=cssLib.boxWorkers.create(this.hudTCBox,[45,/*40*/34,0],aisGame.curCity,keyid);
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onAddShieldClick);
			this.shieldBox=cssLib.boxShield.create(this.hudTCBox,[255,/*40*/34,0],aisGame.curCity,keyid);

			appEnv.setBoxTimes();
			if(page.stateChat)
			{
				page.stateChat.init(appEnv);
			}
			if(page.stateLantern)
			{
			//	page.stateLantern.init(appEnv);
				page.stateLantern.showLantern();
			}

			if(this.city && this.city.leaveAttacked && this.city.leaveAttacked.length)
			{
				DBOut("***** show defense info");
				var cookie=this.page.getCookie("M1NoticeReaded","NoticeReaded");
				if(!cookie)
				{
					this.page.setCookie("M1NoticeReaded","NoticeReaded","1",60*60*6);
				}
				this.beAtk=1;
				this.markNewNote.setDisplay(1);
				var url=this.page.genPageURL("ui/dlg/dlg_defense_info.jml");
				setFrameout(1,function(){
					this.appEnv.openPageDlg(url,this.city.leaveAttacked);
				},this)
			}
			this.loginClan();
/*********************免费钻石***********************/
			if(window.Adways)
			{
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onAdwaysClick);
				var pic=imgLib.getImg("pic_adways1"), warW=Math.floor(pic.w*0.9), warH=Math.floor(pic.h*0.9);
				pic=cloneToObj(pic);
				pic.w=warW, pic.h=warH;
				this.btnAdways=this.hudTRBox.appendNewChild({type:"key",pos:[50+warW/2,160+warH/2,0],anchor_h:1,anchor_v:1,css:pic,ui_event:1,key:keyid,diwn_scale:0.95,
					state_up:pic,state_down:pic,state_grage:pic,audio:this.page.audioObject.genFileURL("btn_click"),button:1,
					startScale:function()
					{
						appEnv.addLoopScale(this,0.1,{minX:0.95,maxX:1.05,minY:0.95,maxY:1.05});
					},
					stopScale:function()
					{
						if(this.scaleAni)
						{
							this.scaleAni.setCurValue([1,1,1]);
							this.scaleAni.stop();
						}
					}
				});
				this.btnAdways.startScale();
			}
			//下面这些按钮是为调试增加的:
			this.dbBtnOpen=cssLib.btnDebug.create(this.hudDBDock,">",[224,appEnv.scrSize[1]/2,0],50,appEnv.appKeys.debugSwitch);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Save",[100,50,0],180,appEnv.appKeys.debugSave);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Time>>30s",[100,100,0],180,appEnv.appKeys.debugTimeGap1);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Time>>5m",[100,150,0],180,appEnv.appKeys.debugTimeGap2);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Time>>30m",[100,200,0],180,appEnv.appKeys.debugTimeGap3);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Time>>6h",[100,250,0],180,appEnv.appKeys.debugTimeGap4);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Fake Donated",[100,350,0],180,appEnv.appKeys.debugDonated);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Fake Donate",[100,400,0],180,appEnv.appKeys.debugDonate);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Up",[100,500,0],180,appEnv.appKeys.debugScaleU);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Down",[100,550,0],180,appEnv.appKeys.debugScaleD);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.debugExit);

			this.debugTime=cssLib.textMid.create(this.hudDBBox,[100,20,0],"0d 0h 0m 0s",180,20,1,1,0,1,[255,128,0]);

			//------初始化一些推送消息--------
			if(window.MP)
			{
				window.MP.addPushList("oneDay",4,24*60*60);
				window.MP.addPushList("threeDay",5,72*60*60);

				var buff=aisGame.curCity.buffs["Shield"];
				if(buff)
				{
					var dt=Math.floor((buff.endTime-aisGame.curCity.env.dateTime())/1000)-30*60;
					if(dt>=0)
						window.MP.addPushList("shieldOut",6,dt);
				}
				if(this.city)
				{
					this.city.addTrainFinishPushMsg();
					this.city.addTrainFullPushMsg();
					this.city.addDiamondminePushMsg();
				}
			}
			//--------------------------------
			this.city.updateGifts();

			this.city.loadReadNotice();
			this.appEnv.getSysNotice(this.onSysNotice,this);
			this.checkExGift();
		}
	};

	__Page.stateHome.addCardIcon = function(codename)
	{
		var cssLib=this.page.cssLib;
		if(codename=="TH")
		{
			if(!this.thBox){
				var keyid=this.appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onAddGemClick);
				this.thBox=cssLib.boxTH.create(this.hudTLBox,[280,84,0],aisGame.curCity,keyid,codename);

			}else
				this.thBox.update();
		}else if(codename=="CubeCard")
		{
			if(!this.cubecardBox){
				var keyid=this.appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onAddGemClick);
				this.cubecardBox=cssLib.boxTH.create(this.hudTLBox,[280+100,84,0],aisGame.curCity,keyid,codename);

			}else
				this.cubecardBox.update();
		}
	};

	__Page.stateHome.onSysNotice = function(vo)
	{
		DBOut("*** onSysNotice:"+vo);
		this.city.cbGetSysNotice(vo);

		var appEnv=this.appEnv;
		DBOut("appEnv.curDlg="+appEnv.curDlg);
		var noticeList=this.city.noticeList;
		if(noticeList && noticeList.length)
		{
			var cookie=this.page.getCookie("M1NoticeReaded","NoticeReaded");
			if((!noticeList[0].state || !cookie) && !this.beAtk && !appEnv.curDlg)//如果没有被攻击提示，并且有公告，就会走到这里
			{
				this.page.setCookie("M1NoticeReaded","NoticeReaded","1",60*60*6);
				this.onKey(1,appEnv.appKeys.bldNotice,1,-2);
			}
		}
		this.updateNGBtns();
//		else if(this.city && this.city.leaveAttacked && this.city.leaveAttacked.length)
//		{
//			this.markNewNote.setDisplay(1);
//			var url=this.page.genPageURL("ui/dlg/dlg_defense_info.jml");
//			setFrameout(1,function(){
//				this.appEnv.openPageDlg(url,this.city.leaveAttacked);
//			},this)
//		}
	};

	__Page.stateHome.updateNGBtns = function()
	{
		DBOut("updateNGBtns *** ");
		if(!(window.aisGame && window.aisGame.bVisit))
		{
			this.updateNoticeBtn();
			this.updateGiftBtn();
		}
	};

	__Page.stateHome.updateNoticeBtn = function()
	{
		if(window.aisGame.curCity.noticeList && window.aisGame.curCity.noticeList.length)// && !window.aisGame.curCity.noticeList[0].state
			this.btnNotice.setDisplay(1);
		else
			this.btnNotice.setDisplay(0);
	};

	__Page.stateHome.updateGiftBtn = function()
	{
		if(window.aisGame.curCity.gifts && window.aisGame.curCity.gifts.length){
			this.btnGift.setDisplay(1);
			this.txtGift._setText("x"+window.aisGame.curCity.gifts.length);
		}else
			this.btnGift.setDisplay(0);
	};

	__Page.stateHome.checkExGift = function()
	{
		if(window.aisGame.curCity.gifts && window.aisGame.curCity.gifts.length)
		{
			var i, gifts=window.aisGame.curCity.gifts;
			for(i=0; i<gifts.length; i++)
			{
				if(6==gifts[i].type)
				{
					this.DOUBLEVIP=1;
					return;
				}
			}
		}
	};

	//--------------------------------------------------------------------------
	//逻辑更新相关的函数
	//--------------------------------------------------------------------------
	{
		//启动逻辑更新机制
		__Page.stateHome.resumeLUDT=function()
		{
			this.lockLUDT-=1;
			if(this.lockLUDT<=0)
			{
				this.timerLUDT=this.appEnv.layer.setFrameout(0,this._logicUpdate,this);
			}
			DBOut("resumeLUDT: "+this.lockLUDT);
		};

		//暂停逻辑更新机制
		__Page.stateHome.pauseLUDT=function()
		{
			this.lockLUDT+=1;
			if(this.timerLUDT)
			{
				this.appEnv.layer.clearTimeout(this.timerLUDT);
				this.timerLUDT=null;
			}
			DBOut("pauseLUDT: "+this.lockLUDT);
		};

		//建议进行逻辑更新
		__Page.stateHome.aboutLUDT=function()
		{
			if(this.lockLUDT<=0)
			{
				if(this.timerLUDT)
				{
					this.appEnv.layer.clearTimeout(this.timerLUDT);
					this.timerLUDT=null;
				}
				this.timerLUDT=this.appEnv.layer.setFrameout(0,this._logicUpdate,this);
			}
			DBOut("aboutLUDT: "+this.lockLUDT);
		};

		//执行一次逻辑更新
		__Page.stateHome._logicUpdate=function()
		{
			var curTime,trgTime,gapTime;
			var king;
			var pushMsg=null;
			king=this.king;

		//	DBOut("Logic update by cityState!");
			//TODO: 检查是否有需要处理的Push消息.
			if(this.lockLUDT<=0)
			{
				pushMsg=this.king.getPushMsg();
				if(pushMsg)
				{
					//DBOut("Found a push message1: "+toJSON(pushMsg));
					this.appEnv.handlePushMsg(pushMsg);
				}
			}
			if(this.lockLUDT<=0)
			{
				//Update the king
				king.miniUpdate();

				//检查是否有需要处理的Push消息.
				if(!pushMsg)
				{
					pushMsg=this.king.getPushMsg();
					if(pushMsg)
					{
						//DBOut("Found a push message2: "+toJSON(pushMsg));
						this.appEnv.handlePushMsg(pushMsg);
					}
				}

				//部署下一次更新时间.
				if(this.lockLUDT<=0)
				{
					gapTime=1000*10;//默认10秒一次Update
					curTime=king.env.dateTime()+king.debugTimeGap;
					trgTime=king.triggerTime;
					if(trgTime)
					{
						//DBOut("TriggerTime: "+trgTime);
						//DBOut("curTime: "+curTime);
						//DBOut("DebugTime: "+king.debugTimeGap);
						gapTime=trgTime-(curTime);
						if(gapTime>0)
						{
							gapTime+=200;//向后扩一些时间.
						}
					}
					gapTime=gapTime<200?200:gapTime;
					if(gapTime>10000)
					{
						gapTime=10000;
					}
			//		DBOut("gapTime: "+gapTime);
					this.timerLUDT=this.appEnv.layer.setTimeout(gapTime,this._logicUpdate,this);
				}
			}
		};

		//更新下次逻辑更新的时间
		__Page.stateHome.updateLUDTTimer=function()
		{
			var curTime,trgTime,gapTime;
			var king;
			king=this.king;
			//部署下一次更新时间.
			if(this.timerLUDT)
			{
				this.appEnv.layer.clearTimeout(this.timerLUDT);
				this.timerLUDT=null;
			}
			if(this.lockLUDT<=0)
			{
				gapTime=1000*10;//默认10秒一次Update
				curTime=king.env.dateTime()+king.debugTimeGap;
				trgTime=king.triggerTime;
				if(trgTime)
				{
					gapTime=trgTime-curTime;
					if(gapTime>0)
					{
						gapTime+=200;//向后扩一些时间.
					}
				}
				if(gapTime>10000)
				{
					gapTime=10000;
				}
				this.timerLUDT=this.appEnv.layer.setTimeout(gapTime,this._logicUpdate,this);
			}
		};
	}

	//--------------------------------------------------------------------------
	//改变模式状态的函数
	//--------------------------------------------------------------------------
	{
		__Page.stateHome.showBldMenu=function(hotId)
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

		__Page.stateHome.hideBldMenu=function(hotId)
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

		__Page.stateHome.newPosBld=function(def,level)
		{
		};

		__Page.stateHome.endChooseBldPos=function(def,level,pos)
		{
		};
	}

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.stateHome.onKey=function(msg,key,way,extra)
		{
			var ret,appEnv,url,selBld;
			appEnv=this.appEnv;
			var textLib=appEnv.textLib;
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
				//确认新建建筑位置:
				if(key==appEnv.appKeys.confirmNewBld)
				{
					DBOut("Build pos confirmed!")
					this.page.vwHomeStage.confirmNewBld();
					return 1;
				}
				//取消新建建筑:
				if(key==appEnv.appKeys.abortNewBld)
				{
					DBOut("Will abort new building!!");
					this.page.vwHomeStage.abortNewBld();
					return 1;
				}
				//升级建筑:
				if(key==appEnv.appKeys.bldUpgrade)
				{
					DBOut("Will upgrade cur bld!");
				//	this.page.vwHomeStage.upgradeBld();
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_bld_upgrade.jml");
					this.appEnv.openPageDlg(url,this.page.vwHomeStage.selBld);
					return 1;
				}
				//建筑信息【zz】:
				if(key==appEnv.appKeys.bldInfo)
				{
					DBOut("Will show cur bld info!");
					this.aboutLUDT();
					selBld=this.page.vwHomeStage.selBld;
					url=this.page.genPageURL("ui/dlg/dlg_bld_info.jml");
					if(selBld && selBld.aisBld && selBld.aisBld.boxInfo)
					{
						url=this.page.genPageURL("ui/dlg/dlg_bld_obsbox.jml");
					}
					this.appEnv.openPageDlg(url,this.page.vwHomeStage.selBld);
					return 1;
				}
				//开启障碍物宝箱
				if(key==appEnv.appKeys.bldOpenBox)
				{
					DBOut("Will open obsbox!");
					this.aboutLUDT();
					selBld=this.page.vwHomeStage.selBld;
					this.page.vwHomeStage.openObsBox();
					return 1;
				}

				//减少建筑物建造/升级时间
				if(key==appEnv.appKeys.bldCutConstructTime)
				{
					this.page.vwHomeStage.bldCutConstructTime();
					return 1;
				}
				//用钻减少建筑物建造/升级时间
				if(key==appEnv.appKeys.bldCutCstTime)
				{
					var time=(window.aisGame.curCity.timeButtonCoolDown)-window.aisGame.king.kingTime();
					if(time<=0)
						this.page.vwHomeStage.bldCutConstructTimeByGem();

					return 1;
				}

				//收取资源：
				if(key==appEnv.appKeys.bldHarvest)
				{
					this.page.vwHomeStage.bldHarvest();
					return 1;
				}

				//打开训练单位对话框:
				if(key==appEnv.appKeys.bldTrain)
				{
					var bld=this.page.vwHomeStage.selBld;
					DBOut("Will show train dialog!");
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_train.jml");
					this.appEnv.openPageDlg(url,{cocBld:bld, aisBld:bld.aisBld});
					return 1;
				}
				//打开制造Spell对话框
				if(key==appEnv.appKeys.bldMakeSpell)
				{
					DBOut("Will show spell dialog!");
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_spell.jml");
					this.appEnv.openPageDlg(url,this.page.vwHomeStage.selBld);
					return 1;
				}
				//打开科研对话框:
				if(key==appEnv.appKeys.bldResearch)
				{
					var bld;
					DBOut("Will show research dialog!");
					this.aboutLUDT();
					bld=this.page.vwHomeStage.selBld;
					if(bld.aisBld)
					{
						if(bld.aisBld.working)
						{
							url=this.page.genPageURL("ui/dlg/dlg_case_info.jml");
							this.appEnv.openPageDlg(url,bld);
						}
						else
						{
							url=this.page.genPageURL("ui/dlg/dlg_research.jml");
							this.appEnv.openPageDlg(url,bld);
						}
					}
					return 1;
				}
				//打开制造机甲零件模块对话框
				if(key==appEnv.appKeys.bldMakePart)
				{
					DBOut("Will show part dialog!");
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_part.jml");
					var macBld=window.aisGame.curCity.aisMacShop;
					this.appEnv.openPageDlg(url,{bld:this.page.vwHomeStage.selBld});
					return 1;
				}
				//打开购买模块对话框
				if(key==appEnv.appKeys.bldMakeAddOn)
				{
					DBOut("Will show buy addon dialog!");
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_addon.jml");
					this.appEnv.openPageDlg(url,this.page.vwHomeStage.selBld);
					return 1;
				}
				//打开组装机甲对话框
				if(key==appEnv.appKeys.bldAssemble)
				{
					DBOut("Will show assemble dialog!");
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_garage.jml");
					this.appEnv.openPageDlg(url,this.page.vwHomeStage.selBld);
					return 1;
				}
				//打开宝箱对话框
				if(key==appEnv.appKeys.bldMakeBox)
				{
					var macShop=window.aisGame.curCity.aisMacShop;
					if(macShop)
					{
						DBOut("Will show box dialog!");
						this.aboutLUDT();
						url=this.page.genPageURL("ui/dlg/dlg_box.jml");
					//	var bldc=this.page.vwHomeStage.selBld;
					//	bldc=bldc?bldc.aisBld:macShop;
						var bldc=macShop;
						this.appEnv.openPageDlg(url,bldc);
						return 1;
					}
					else
					{
						appEnv.stateLogs.showLog(textLib["NeedMacFactory"]);
					}
				}

				//防御哨岗-驻扎：
				if(key==appEnv.appKeys.bldResidence)
				{
					var aisBld,homeBld,url;
					homeBld=this.page.vwHomeStage.selBld;
					aisBld=homeBld.aisBld;
					if(aisBld.def.groupId=="ClanBld")
					{
						if(!window.aisGame.curCity.allianceId)return;
						//联盟城堡的自己捐兵
						url=this.page.genPageURL("ui/dlg/dlg_unitstore.jml");
						this.appEnv.openPageDlg(url,{storage:window.aisGame.curCity.clanStorage,info:"clan"});
					}else{
						//防御哨岗的驻扎
						url=this.page.genPageURL("ui/dlg/dlg_unitstore.jml");
						this.appEnv.openPageDlg(url,{storage:window.aisGame.curCity.fortStorage,info:"fort"});
					}
					return 1;
				}

				if(key==appEnv.appKeys.bldMacMode)
				{
					if(appEnv.bMech2Attack()<=0)
					{
						this.showMechNo2Attack();
					}else
						this.page.vwHomeStage.statusMac();
					return 1;
				}

				if(key==appEnv.appKeys.btnMechNo2Atk)
				{
					this.showMechNo2Attack();
					return 1;
				}

				if(key==appEnv.appKeys.bldGemFix)
				{
					var aisBld=this.page.vwHomeStage.selBld.aisBld;
					var time=aisBld.workTask.getRemainTime();
					var gemNum=window.aisGame.king.convertTime2Gem(time);
					var body=aisBld.craft.slots.body;
					var bdef=window.aisEnv.defLib.part[body.type];
					var rate=bdef.levels[body.level].RepairCoefficient;
					gemNum=Math.floor(gemNum*rate);
					this.appEnv.showPmtDlg(this.page.pmtChoose,0,
						{
							title:textLib["ConfirmRepair"],info:textLib["ConfirmRepairDesc"](gemNum),
							pmtFunc:function(ok)
							{
								if(ok)
								{
									this.page.vwHomeStage.gemFixDoneMac();
								}
							},pmtObj:this,pmtParam:null
						}
					);
					return 1;
				}
				//打开物品背包
				if(key==appEnv.appKeys.bldMakeItem)
				{
					this.aboutLUDT();
					DBOut("bldMakeItem")
					url=this.page.genPageURL("ui/dlg/dlg_item.jml");
					this.appEnv.openPageDlg(url);
					return 1;
				}

				//取消建筑升级
				if(key==appEnv.appKeys.abortBuild)
				{
					DBOut("Will abort construction!");
					this.page.vwHomeStage.abortConstuction();
					return 1;
				}
				//加速按钮
				if(key==appEnv.appKeys.bldBoost)
				{
					DBOut("Will boost!!");
					this.page.vwHomeStage.boostBld();
					return 1;
				}
				//移除按钮
				if(key==appEnv.appKeys.bldRemove)
				{
					DBOut("Will remove!!");
					var bld=this.page.vwHomeStage.selBld;
					//for(i in bld)DBOut(i+":"+bld[i]);
					if("Decorate"==bld.cocDef["group"])
					{
						var cost=bld.aisBld.def.levels[bld.aisBld.level].removeResult;
						store=cost.storage[0];
						var store,res;
						if(store)
						{
							cost=store.num;
							if("Oil"==store.store)
								res=window.aisEnv.textLib.prdctName["oil"];
							else if("Gold"==store.store)
								res=window.aisEnv.textLib.prdctName["gold"];
							else if("Cube"==store.store)
								res=window.aisEnv.textLib.prdctName["cube"];
						}
						else if(cost.gem)
						{
							cost=cost.gem;
							res=textLib["Gem"];
						}
						else if(cost.cash)
						{
							cost=cost.cash;
							res=textLib["TokenName"];
						}
					//	DBOut("cost===="+toJSON(cost));
						this.appEnv.showPmtDlg(this.page.pmtChoose,0,
							{
								title:textLib["ConfirmSell"],info:textLib.getText(textLib["ConfirmSellDesc"],{num:cost,res:res}),//textLib.getText(textLib["ConfirmGemFinish"],{gem:gemNum}),
								pmtFunc:function(ok)
								{
									if(ok)
									{
										this.page.vwHomeStage.removeBld();
									}
								},pmtObj:this,pmtParam:null
							}
						);
					}
					else
						this.page.vwHomeStage.removeBld();
					return 1;
				}
				if(key==appEnv.appKeys.bldReset)
				{
					this.page.vwHomeStage.resetTraps();
					return 1;
				}
				if(key==appEnv.appKeys.bldResetAll)
				{
					this.page.vwHomeStage.resetTraps(1);
					return 1;
				}
				if(key==appEnv.appKeys.bldGraveRemove)
				{
					this.page.vwHomeStage.removeGraveBld();
					return 1;
				}
				//钻石加速完成建造:
				if(key==appEnv.appKeys.bldGemDone)
				{
					DBOut("Will gem finish!!");
					this.page.vwHomeStage.gemFinBld();
					return 1;
				}

				//请求增援：
				if(key==appEnv.appKeys.bldRequsetUnit)
				{
					var selBld=this.page.vwHomeStage.selBld;
					if(selBld)
					{
						if(!window.aisGame.curCity.allianceId)return;
						DBOut("selBld.aisBld.working="+selBld.aisBld.working);
						if(selBld.aisBld.working)
							this.page.vwHomeStage.gemFinRqstCD();
						else{
							url=this.page.genPageURL("ui/dlg/dlg_reinforce.jml");
							this.appEnv.openPageDlg(url,null);
						}
					}
					return 1;
				}

				//联盟成员信息：
				if(key==appEnv.appKeys.bldClanInfo)
				{
					this.onAllianceClick(msg,key,way,extra);
//					var city=aisGame.curCity;
//					if(!city.allianceId)
//					{
//						//没有入盟
//					}else{
//
//					}
					return 1;
				}
				//装载弹药
				if(key==appEnv.appKeys.bldAmmoRelod)
				{
					this.page.vwHomeStage.bldAmmoRelod();
					return 1;
				}

				//切换防守模式
				if(key==appEnv.appKeys.bldSwitchMode)
				{
					this.page.vwHomeStage.bldSwitchMode();
					return 1;
				}

				//成就测试:
				if(key==appEnv.appKeys.uiAchvmnt)
				{
					var king;
					king=aisGame.king;
					DBOut("Will get Achvmnt bonus!!");
					king.execCmd(king,"GetAvhmntBonus",{codeName:"GoldStorage"},king);
					return 1;
				}
				//选择一排墙:
				if(key==appEnv.appKeys.btnSelRow)
				{
					DBOut("Will select row!!");
					this.page.vwHomeStage.selectRow();
					return 1;
				}
				//公告
				if(key==appEnv.appKeys.bldNotice)
				{
					this.aboutLUDT();

					var noticeList=this.city.noticeList;
					if(noticeList && noticeList.length)
					{
						if(noticeList[0].contents && noticeList[0].contents.indexOf("http://")>-1)
						{
							var lvo=noticeList[0].contents.split("#$#");
							if(Dialogs.openWebDialog)
							{
								Dialogs.openWebDialog(lvo[0]);
								if(this.city)this.city.readNoticeById(noticeList[0].id);
								return;
							}
							else if(lvo[1])
							{
								noticeList[0].contents=lvo[1];
							}
						}
					}

					url=this.page.genPageURL("ui/dlg/dlg_notice.jml");
					if(-1==extra)
					{
						this.appEnv.nextPageDlgURL=url;
						this.appEnv.nextPageDlgParam=this.city;
						return;
					}
					this.appEnv.openPageDlg(url,this.city);
					return 1;
				}
				//礼包
				if(key==appEnv.appKeys.bldGift)
				{
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_gifts.jml");
					this.appEnv.openPageDlg(url,window.aisGame.curCity.gifts);
					return 1;
				}

				//持久化存盘
				if(key==appEnv.appKeys.debugSave)
				{
					DBOut("Will save king!");
					var king,city,vo,saveTxt;
					king=aisGame.king;
					vo={};
					king.saveToVO(vo);
					saveTxt=toJSON(vo);
					//this.page.setCookie("Runtime","Save",saveTxt,0);
					this.appEnv.saveCityVO(svrvo,"Save");
					DBOut("King VO:");
					DBOut(saveTxt);
					//存贮战斗快照:
					vo={};
					city=aisGame.curCity;
					city.saveCoCVO(vo);
					saveTxt=toJSON(vo);
				//	Dialogs.saveToFile(saveTxt,"*.js");
					this.page.setCookie("COC","Snap",saveTxt,0);
					DBOut("City Snap VO:");
					DBOut(saveTxt);
					//存储战斗Units:
					vo={};
					city=aisGame.curCity;
					city.saveCoCUnitVO(vo,this.page.vwHomeStage.level);
					saveTxt=toJSON(vo);
					this.page.setCookie("COC","BattleUnits",saveTxt,0);
					DBOut("City Battle Units VO:");
					DBOut(saveTxt);
					return 1;
				}
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
					this.onKingUpdate();
					return 1;
				}
				//时间增量:
				{
					if(key==appEnv.appKeys.debugTimeGap1)
					{
						var king;
						king=aisGame.king;
						king.execCmd(king,"AddDebugTime",{time:30*1000},king);
						return 1;
					}
					if(key==appEnv.appKeys.debugTimeGap2)
					{
						var king;
						king=aisGame.king;
						king.execCmd(king,"AddDebugTime",{time:5*60*1000},king);
						return 1;
					}
					if(key==appEnv.appKeys.debugTimeGap3)
					{
						var king;
						king=aisGame.king;
						king.execCmd(king,"AddDebugTime",{time:30*60*1000},king);
						return 1;
					}
					if(key==appEnv.appKeys.debugTimeGap4)
					{
						var king;
						king=aisGame.king;
						king.execCmd(king,"AddDebugTime",{time:6*60*60*1000},king);
						return 1;
					}
				}
				{
					if(key==appEnv.appKeys.debugDonated)
					{
						var city;
						city=aisGame.curCity;
						//模拟捐赠消息:
						aisGame.king.execCmd(city,"GetDonated",{owner:"Avdpro",units:[{type:"UntMarine",num:5,level:1},{type:"UntMarine",num:2,level:2},{type:"UntSniper",num:5,level:1}]},city);
						return 1;
					}
					if(key==appEnv.appKeys.debugDonate)
					{
						var city;
						city=aisGame.curCity;
						//模拟捐赠消息:
						aisGame.king.execCmd(city,"DonateClan",{owner:"YPP",units:[{type:"UntMarine",num:2},{type:"UntSniper",num:1}]},city);
						return 1;
					}
				}
				{
					if(key==appEnv.appKeys.debugScaleU)
					{
						var scale;
						scale=this.page.vwHomeStage.gameHud.getScale();
						this.page.vwHomeStage.gameHud.setScale(scale+0.1);
						return 1;
					}
					if(key==appEnv.appKeys.debugScaleD)
					{
						var scale;
						scale=this.page.vwHomeStage.gameHud.getScale();
						this.page.vwHomeStage.gameHud.setScale(scale-0.1);
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
		//	DBOut("stateHome.onKey: "+msg+", "+key);
			if(ret)
				return ret;
		};

		__Page.stateHome.onShopClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will open shop!");
				url=this.page.genPageURL("ui/dlg/dlg_shop.jml");
				this.appEnv.openPageDlg(url,null);
			}
		};

		__Page.stateHome.onTechCountClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will open TechCount!");
				url=this.page.genPageURL("ui/dlg/dlg_techcount.jml");
				this.appEnv.openPageDlg(url,window.aisGame.curCity.record);
			}
		};

		__Page.stateHome.onAddWorkerClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will open shop - worker!");
				url=this.page.genPageURL("ui/dlg/dlg_shop.jml");
				this.appEnv.openPageDlg(url,{title:"Worker",catalog:"Worker"});
			}
		};

		__Page.stateHome.onAddShieldClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will open shop - shield!");
				url=this.page.genPageURL("ui/dlg/dlg_shop.jml");
				this.appEnv.openPageDlg(url,{title:"Shield",catalog:"Shields"});
			}
		};

		__Page.stateHome.onAddGemClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will open shop - gem!");
				url=this.page.genPageURL("ui/dlg/dlg_shop.jml");
				this.appEnv.openPageDlg(url,{title:"SpecialSupply",catalog:"Gem"});
			}
		};

		__Page.stateHome.onAttackClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				var king;
				king=aisGame.king;
				if(!aisGame.curCity.allStorages["Unit"].getUsedCap())
				{
					this.appEnv.stateLogs.showLog(this.page.appEnv.textLib.NotUnit);
					return;
				}
			//	this.aboutLUDT();
				url=this.page.genPageURL("ui/dlg/dlg_worldmap.jml");
				this.appEnv.openPageDlg(url,this);
				return 1;
			}
//			var url;
//			if(msg==1 && way==1)
//			{
//				var city;
//				city=aisGame.curCity;
//				aisGame.king.execFakeCmd(city,"Search_opponents",{userId:-1,callBack:this.go2Battle,callObj:this},city);
//				return 1;
//			}
		};
		__Page.stateHome.SearchOpponents=function(comVO)
		{
			DBOut("SearchOpponents");
			this.page.vwHomeStage.setNavBoxRangeByScale(1);
			this.page.appEnv.addScale(this.page.vwHomeStage.gameHud,[1,1,1],[0.8,0.8,1]);
			this.appEnv.showSearchAni(function(){
				var city=aisGame.curCity;
				window.aisGame.king.execFakeCmd(city,"Search_opponents",{userId:comVO.userId,callBack:this.go2Battle,callObj:this},city);
			},this);
			if(this.page.audioObject && this.page.audioObject._init)
			{
				this.page.audioObject.playMp3("search",-1);
			}
		};
		__Page.stateHome.go2Battle=function(data,error)
		{
			DBOut("++++++++++go2Battle");
			if(data)
			{
				var global=window.aisEnv.defLib.globals;
				var times=global["BATTLE_BET_TIMES"];
				var list=[],num;
				for(var i=0; i<times; i++)
				{
					num=global["BATTLE_BET_COST_GEM_"+(i+1)];
					if(num)
						list.push(num);
					else
						Dialogs.alert("BATTLE_BET_COST_GEM error!!!");
				}
				var city=window.aisGame.curCity;
				var thLv=0, mfLv=0, medalReq=0, isFormal=1;
				if(city.aisTownHall)
					thLv=city.aisTownHall.level;
				if(city.aisMacShop)
					mfLv=city.aisMacShop.level;
				if(thLv)
					medalReq=global["TOWHALL_LEVLE_HONOR_LOOT"+thLv];
				if(this.clanInitVO && window.aisGame.curCity.clanMsgs.CLAN_RANK_NON_MEMBER==this.clanInitVO.rankLevel)
					isFormal=0;
				this.page.setCookie("GlobalInfo","info",toJSON({times:times, price:list, gemNum:window.aisGame.king.gemNum, thLv:thLv, medalReq:medalReq, medal:city.honor, mfLv:mfLv, isFormal:isFormal}),0);

				var city=aisGame.curCity;
				//if(city.vipLevel)
				{
					var defLib=window.aisEnv.defLib.vipPrivilege;
					var def=defLib["vipBattleWaitTime"].levels[city.vipLevel];
					if(def && def.modifyValue)
						this.page.setCookie("Runtime","BattleWaitTime",def.modifyValue+"",0);
				}
				if(data)DBOut("+++++++++hava data+++");
				var stage=toJSON(data);
				DBOut("+++++++++setCookie+go2Battle+++="+stage);
				this.page.setCookie("Runtime","BattleStage",stage,0);

				var allianceId=city.allianceId;
				this.page.setCookie("Runtime","CityAllianceId",allianceId+"",0);
				switchApp(this.page.genPageURL("ui_battle.jml"));
			}
		};
		__Page.stateHome.go2Pve=function(data,error,vo)
		{
			if(data)
			{
				this.page.vwHomeStage.setNavBoxRangeByScale(1);
				this.page.appEnv.addScale(this.page.vwHomeStage.gameHud,[1,1,1],[0.8,0.8,1]);
				this.appEnv.showSearchAni(function(){
					this.page.appEnv.loadFile(UIBody.genPageURL("levels/"+vo.LevelFile+".json"),function(levelVO){
						data.oppCity={Gold:vo.resRemainGold,Oil:vo.resRemainOil,Cube:vo.resRemainCube,level:vo.ExpLevel,name:vo.name,instances:levelVO};
						this.page.setCookie("Runtime","PveStage",toJSON(data),0);
						switchApp(this.page.genPageURL("ui_pve.jml"));
					},this);
				},this);
				if(this.page.audioObject && this.page.audioObject._init)
				{
					this.page.audioObject.playMp3("search",-1);
				}
			}
		};

		__Page.stateHome.go2Replay=function(data,error)
		{
			//DBOut("++++++++++go2Replay="+toJSON(data));
			if(data)
			{
				var city=window.aisGame.curCity;
				var allianceId=city.allianceId;
				this.page.setCookie("Runtime","CityAllianceId",allianceId+"",0);
				this.page.vwHomeStage.setNavBoxRangeByScale(1);
				this.page.appEnv.addScale(this.page.vwHomeStage.gameHud,[1,1,1],[0.8,0.8,1]);
				this.appEnv.showSearchAni(function(){
					this.page.setCookie("Runtime","ReplayStage",toJSON(data),0);
					switchApp(this.page.genPageURL("ui_replay.jml"));
				},this);
				if(this.page.audioObject && this.page.audioObject._init)
				{
					this.page.audioObject.playMp3("search",-1);
				}
			}
		};

		__Page.stateHome.go2Onslaught=function(lv,max)
		{
			this.page.vwHomeStage.setNavBoxRangeByScale(1);
			this.page.appEnv.addScale(this.page.vwHomeStage.gameHud,[1,1,1],[0.8,0.8,1]);

			this.appEnv.showSearchAni(function(){
				this.page.appEnv.loadFile(UIBody.genPageURL("onslaught/olt"+lv+".json"),function(levelVO){

					var data={cityInfo:toJSON(aisGame.curCity.getOnslaughtCityInfo()),cmds:levelVO,stageId:lv,maxStage:max};
					this.page.setCookie("Runtime","OnslaughtStage",toJSON(data),0);
					switchApp(this.page.genPageURL("ui_onslaught.jml"));
				},this);
			},this);

			if(this.page.audioObject && this.page.audioObject._init)
			{
				this.page.audioObject.playMp3("search",-1);
			}
		};

		__Page.stateHome.onSettingClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				url=this.page.genPageURL("ui/dlg/dlg_setting.jml");
			//	this.appEnv.showPmtDlg(this.page.pmtCheck,0);
			//	return;
			//	url=this.page.genPageURL("ui/dlg/dlg_open_obsbox.jml");
				this.appEnv.openPageDlg(url,null);
				return 1;
			}
		};

		__Page.stateHome.onLimitSellClick=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var url=this.page.genPageURL("ui/dlg/dlg_part.jml");
				var macBld=window.aisGame.curCity.aisMacShop;
				this.appEnv.openPageDlg(url,{bld:this.page.vwHomeStage.selBld,info:1});
			}
		};

		__Page.stateHome.onLandClick=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var url=this.page.genPageURL("ui/dlg/dlg_landgrave.jml");
				this.appEnv.openPageDlg(url,null);
			}
		};

		__Page.stateHome.onAdwaysClick=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var defLib=window.aisEnv.defLib.pay;
				var vo=defLib.AdWays;
				if(vo)
				{
					this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["AdwaysTitle"],info:textLib["AdwaysInfo"],align:1,force:1,
					pmtFunc:function(){
						DBOut("showAdways")
							window.PUR.showAdways(vo);
					},pmtObj:this,pmtParam:null});
				}
			}
		};

		__Page.stateHome.onFriendClick=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{

			}
		};

		__Page.stateHome.onReplayClick=function(logId)
		{
		//	logId="1-f4f52b03e8de435c9d8b06a52147240b";
			this.appEnv.newMsg(["M1Dwr","getBattleLog",logId],{cb:function(svrVO){
				this.go2Replay(svrVO);
			},cbobj:this},window.ReplayDWRUrl);
		};

		__Page.stateHome.onRevengeClick=function(comVO)
		{
			//------复仇----
			if(!aisGame.curCity.allStorages["Unit"].getUsedCap())
			{
				this.appEnv.stateLogs.showLog(this.page.appEnv.textLib.NotUnit);
				return;
			}
			this.tmpRevengeInfo=comVO;
			var userId=comVO.userId;//玩家ID
			var city;
			city=aisGame.curCity;
			aisGame.king.execFakeCmd(city,"Revenge",{userId:userId,forceFlag:comVO.forceFlag,gemNum:comVO.gemNum,callBack:this.go2Revenge,callObj:this},city);
		};
		__Page.stateHome.go2Revenge=function(data,error,exInfo)
		{
			if(error==-5)
			{
				var page=this.page;
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var txt="";
				if(exInfo=="0")//不存在
					txt=textLib.NotUser;
				else if(exInfo=="-1")//在线
					txt=textLib.UserOnline;
				else if(exInfo=="-2")//被保护
				{
					txt=textLib.UserProtected;
					this.tmpRevengeInfo.forceFlag=1;
					this.tmpRevengeInfo.gemNum=window.aisEnv.defLib.globals["FORCE_REVENGE_ATTACK_GEM"];
					var tmp=this.tmpRevengeInfo;
					appEnv.layer.setFrameout(11,function(){
						this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["ForceRevenge"],info:textLib["ForceRevengeDesc"],svo:tmp,ui:"gem2force"});
					},this);
				}
				else if(exInfo=="-3")//被攻击
					txt=textLib.UserAttack;
				else if(exInfo=="-4")//同盟
					txt=textLib.UserClan;
				else
					txt=textLib.NotUser;
				this.appEnv.stateLogs.showLog(txt);
			}else{
				this.page.vwHomeStage.setNavBoxRangeByScale(1);
				this.page.appEnv.addScale(this.page.vwHomeStage.gameHud,[1,1,1],[0.8,0.8,1]);
				this.appEnv.showSearchAni(function(){
					this.page.setCookie("Runtime","Revenge","1",0);
					this.go2Battle(data);
				},this);
				if(this.page.audioObject && this.page.audioObject._init)
				{
					this.page.audioObject.playMp3("search",-1);
				}
			}
			this.tmpRevengeInfo=null;
		};

		__Page.stateHome.onBuildingClk=function(msg,key,way,extra)
		{
		};

		//管理Power，目前暂时用作Update。。。
		__Page.stateHome.onPowerClk=function(msg,key,way,extra)
		{
		};

		//管理库存，目前暂时用作测试建造建筑
		__Page.stateHome.onStoreClk=function(msg,key,way,extra)
		{
		};

		__Page.stateHome.onCaravanClk=function(msg,key,way,extra)
		{
		};

		__Page.stateHome.onAchvClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				var king;
				king=aisGame.king;
			//	this.aboutLUDT();
				url=this.page.genPageURL("ui/dlg/dlg_achieve.jml");
				this.appEnv.openPageDlg(url,king.achvmnts);
				return 1;
			}
		};

		__Page.stateHome.onDailyClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				this.markNewDaily.setDisplay(0);
				var king=window.aisGame.king;
				url=this.page.genPageURL("ui/dlg/dlg_daily.jml");
				this.appEnv.openPageDlg(url,king.dailytasks);
				return 1;
			}
		};

		__Page.stateHome.onLogClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will open log!");
				this.markNewNote.setDisplay(0);
				url=this.page.genPageURL("ui/dlg/dlg_battlelog.jml");
				this.appEnv.openPageDlg(url,null);
			}
		};

		__Page.stateHome.onResultClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will show result!");
				url=this.page.genPageURL("ui/dlg/dlg_battleover.jml");
				this.appEnv.openPageDlg(url,null);
			}
		};

		__Page.stateHome.onAllianceClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will show alliance!");
				if(!this.page.vwHomeStage.checkClan())
				{
					return;
				}
				url=this.page.genPageURL("ui/dlg/dlg_clan.jml");
				this.appEnv.openPageDlg(url,this.clanInitVO);
			}
		};

		__Page.stateHome.onRankClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will show rank!");
				url=this.page.genPageURL("ui/dlg/dlg_rank.jml");
				this.appEnv.openPageDlg(url,null);
			}
		};

		__Page.stateHome.onVipClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will show vip!");
				url=this.page.genPageURL("ui/dlg/dlg_vip.jml");
				this.appEnv.openPageDlg(url,null);
			}
		};

		__Page.stateHome.onTiebaClick=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				window.BaiduTieba.openBar();
			}
		};

		__Page.stateHome.onVisitClick=function(userId)
		{
			this.appEnv.newMsg(["M1Dwr","visitPlayer",userId,this.appEnv.getServerID()],{cb:function(svrVO){
				this.go2Visit(svrVO);
			},cbobj:this},window.ReplayDWRUrl);
		};
		__Page.stateHome.go2Visit=function(data,error)
		{
			//DBOut("++++++++++go2Visit="+toJSON(data));
			if(data)
			{
				this.page.vwHomeStage.setNavBoxRangeByScale(1);
				this.page.appEnv.addScale(this.page.vwHomeStage.gameHud,[1,1,1],[0.8,0.8,1]);
				this.appEnv.showSearchAni(function(){
					startMode=this.page.setCookie("Runtime","StartGame","VisitStage",0);
					//this.page.setCookie("Runtime","VisitStage",data,0);
					this.appEnv.saveCityVO(fromJSON(data),"VisitStage");
					switchApp(this.page.genPageURL("ui_visit.jml"));
				},this);
			}
		};

		__Page.stateHome.onHomeClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var stage=this.page.vwHomeStage;
				stage.setNavBoxRangeByScale(1);
				this.appEnv.addScale(stage.gameHud,[1,1,1],[0.8,0.8,1]);
				this.appEnv.showSearchAni(function(){
					this.appEnv.go2Home();
				},this);
			}
		};

		__Page.stateHome.loginClan=function()
		{
			DBOut("---------- stateHome.loginClan, id:"+this.city.allianceId+", city:"+this.city);
			if(!this.city)return;
			if(!this.city.allianceId)return;
			if(!this.page.vwHomeStage.checkClan())
			{
				this.appEnv.stateLogs.showLog(this.appEnv.textLib["ClanException"]);
				return;
			}
			this.king.sendNTCmd(this.king,"LoginClan",{callBack:function(vo){
				//DBOut("LoginClan: vo="+toJSON(vo));
				this.page.setCookie("Runtime","ClanFlag",vo.clanVO.flag+"",0);
				this.page.setCookie("Runtime","ClanCookie",toJSON({userId:window.USERID, clanFlag:vo.clanVO.flag}),0);
				//登录clan回调
				//ChatMsgVO msgs;
				//String clanName;
				//int clanFlag;
				//[] untis;	{codename:"",num:0,level:0}
				//int rankLevel;
				//int responseStatusCode;//0:正常; -1:不在指定联盟中
				vo.signIn=window.aisGame.king.getHashObj("Obj0").signIn;
				window.aisGame.curCity.allianceFlag=vo.clanVO.flag;
				this.clanInitVO=vo;
				window.aisGame.curCity.clanLoginVO=vo;
				window.aisGame.curCity.clanVO=vo.clanVO;
				if(!vo.clanVO.techs)vo.clanVO.techs=[];
				window.aisGame.curCity.initClanTechs();
				this.appEnv.remainDays=vo.clanCupRemainDays;

				if(vo.clanCupRemainDays>0)
					this.btnLand.startScale();
				else if(vo.clanCupRemainDays<0)
					this.btnLand.setDisplay(0);
				if(vo.units && vo.units.length)
				{
					this.page.vwHomeStage.resetClanUnits(vo.units);
				}
				var i, j, msgObj=window.aisGame.curCity.clanMsgs;
				if(vo.msgs && vo.msgs.length)
				{
					for(i=0; i<vo.msgs.lengh; i++)
					{
						if(vo.msgs[i].type==msgObj.CHAT_MSG_LEAVE || vo.msgs[i].type==msgObj.CHAT_MSG_KICK)
						{
							for(j=0; j<vo.msgs.length; j++)
							{
								if((vo.msgs[j].type=msgObj.CHAT_MSG_REINFORCE || vo.msgs[j].type==msgObj.CHAT_MSG_DONATE) && vo.msgs[j].userId==vo.msgs[i].userId)
								{
									vo.msgs.splice(j,1);
									j--;
									break;
								}
							}
						}
					}
					for(i=0; i<vo.msgs.length; i++)
					{
					//	DBOut("loginClan.addMessage:"+toJSON({clanId:vo.clanVO.id,msg:vo.msgs[i]}));
						this.city.clanMsgs.addMessage({clanId:vo.clanVO.id,msg:vo.msgs[i]},this.page,1);
					}
				}
				if(this.appEnv.chatInited)
				{
					this.appEnv.stateChat.aisUpdateView();
				}
				var bld=this.king.getHashObj("Obj0");
				if(bld)
				{
					this.page.vwHomeStage.updateBld(bld.homeBld,1);
				}
			//	this.getDomains();
			//	this.getClanLandWarToday();
				this.appEnv.getMembersDevote();
				//this.clearClanCupInfo();
			},callObj:this},this.king);
		};
		__Page.stateHome.createClan=function(comVO)
		{
			//clanType 如梦方式 0：自由加入 1：只邀请 2：关闭
			//honorScore 需要荣誉值
			//DBOut("stateHome.createClan: "+toJSON(comVO));
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;
			this.king.sendNTCmd(this.king,"ClanCreate",{clanName:comVO.clanName,flag:comVO.clanFlag,description:comVO.clanDeclare,clanType:comVO.joinMode,honorScore:comVO.joinMedal,callBack:function(vo){
				//DBOut("ClanCreate: vo="+toJSON(vo));
//				this.clanInitVO={
//					clanVO:{
//						clanType:comVO.joinMode,description:comVO.clanDeclare,flag:comVO.clanFlag,honorScore:comVO.joinMedal,id:vo.clanId,lastDonateTime:0,location:"",
//						members:[
//							{donateUnits:0,name:window.aisGame.king.name,rankLevel:window.aisGame.curCity.clanMsgs.CLAN_RANK_LEADER,
//							score:0,totalUnitPlace:50,units:[],userExp:window.aisGame.king.achvmnts.exp,userId:window.USERID}
//						],
//						name:comVO.clanName
//					},
//					msgs:[vo.msg],
//					rankLevel:window.aisGame.curCity.clanMsgs.CLAN_RANK_LEADER,responseStatusCode:0,sessionId:0,units:[],userId:window.USERID
//				};
				if(0==vo.responseStatusCode)
				{
					this.city.useCost({storage:[{store:"Gold",type:"ResGold",num:aisEnv.defLib.globals.CREATE_CLAN_RES}]},1,0);
					this.city.makeViewsDirty();
					window.aisGame.king.miniUpdate();
					this.city.allianceId=vo.clanId;
					this.loginClan();
					var bld=this.king.getHashObj("Obj0");
					if(bld)
					{
						this.page.vwHomeStage.updateBld(bld.homeBld,1);
					}
					appEnv.stateLogs.showLog(textLib["UCreateClan"]);
				}
				else if(-1==vo.responseStatusCode)
				{
					appEnv.stateLogs.showLog(textLib["ParamError"]);
				}
				else if(-2==vo.responseStatusCode)
				{
					appEnv.stateLogs.showLog(textLib["ClanSameName"]);
				}
				//int clanId;
				//ChatMsgVO msgs;
				//int responseStatusCode;//-1: 接收参数时S2SReqeust封装错误     -2: 重名 0：成功
			},callObj:this},this.king);
		};
		__Page.stateHome.editClan=function(comVO)
		{
			//DBOut("stateHome.editClan: "+toJSON(comVO));
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;
			this.king.sendNTCmd(this.king,"ClanEdit",{flag:comVO.clanFlag,description:comVO.clanDeclare,clanType:comVO.joinMode,honorScore:comVO.joinMedal,callBack:function(vo){
				//DBOut("ClanEdit: vo="+toJSON(vo));
				if(0==vo.responseStatusCode)
				{
					appEnv.stateLogs.showLog(textLib["EditSuccess"]);
					this.clanInitVO.clanVO.flag=comVO.clanFlag;
					this.clanInitVO.clanVO.description=comVO.clanDeclare;
					this.clanInitVO.clanVO.clanType=comVO.joinMode;
					this.clanInitVO.clanVO.honorScore=comVO.joinMedal;
				}
				else if(-1==vo.responseStatusCode)
				{
					appEnv.stateLogs.showLog(textLib["EditFailed"]);
				}
				else if(-2==vo.responseStatusCode)
				{
					appEnv.stateLogs.showLog(textLib["ClanSameName"]);
				}
				var bld=this.king.getHashObj("Obj0");
				if(bld)
				{
					this.page.vwHomeStage.updateBld(bld.homeBld,1);
				}
			},callObj:this},this.king);
		};
		__Page.stateHome.showMechNo2Attack=function()
		{
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;
			var num=appEnv.getMech2AttackHonor();
			this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["MechNo2AtkTitle"],info:textLib.getText(textLib["MechNo2AtkInfo"],{num:num}),align:1,
			pmtFunc:function(){
			},pmtObj:this,pmtParam:null});
		};
		__Page.stateHome.onGameTexLoaded=function()
		{
			this.medalBox.updateMeth();
		};
		__Page.stateHome.clearClanCupInfo=function()
		{
			var time,nowTime;
			nowTime=this.city.env.dateTime();
			time=nowTime-Math.floor(nowTime%(24*3600*1000));
			time+=window.aisEnv.defLib.globals["CLAN_CUP_REFRESH_PER_DATE_TIME"]*3600*1000;
			time-=nowTime;
			DBOut("++++ClanCupTime="+time);
			if(time<=0)return;
			this.appEnv.layer.setTimeout(time,function(){
				this.appEnv.landWarInfo=null;
				this.appEnv.landWarDetail=null;
				if(this.city.clanLoginVO)
					this.city.clanLoginVO.targetDomainId="";
					this.appEnv.stateLogs.showLog(this.appEnv.textLib.ClearClanCupInfo);
				//	this.getDomains(function(){
						if(this.appEnv.curDlg && this.appEnv.curDlg.name=="dlgLandgrave")
						{
							this.appEnv.closePmtDlg(null,null,0);
						//	this.appEnv.closeDlg(null,null,0);
							var url=this.page.genPageURL("ui/dlg/dlg_landgrave.jml");
							this.appEnv.openPageDlg(url,null);
						}
				//	},this);
				//	this.getClanLandWarToday();
			},this);
		};
		//留言
		//this.king.sendNTCmd(this.king,"ClanWords",{words:""},this.king);
		__Page.stateHome.getDomains=function(cb,cbobj)//获取领土战大地图信息，包含领土战剩余天数、联盟钻石
		{
			DBOut("*** getDomains ***");
			var clanId=window.aisGame.curCity.allianceId;
			this.appEnv.newMsg(["ClanDwr","getDomains",null,clanId?clanId:-1],{cb:function(svrVO){
				DBOut("---getDomains: "+toJSON(svrVO));
				if(svrVO)
				{
//private Vector<DomainVO> domains;
//private Vector<ResVO> clanStorage;
//private int remainDays
					this.appEnv.landWarInfo=svrVO.domains;
					this.appEnv.remainDays=svrVO.remainDays;
					if(!(this.appEnv.remainDays>0))
						this.page.stateHome.btnLand.stopScale();
				}
				if(cb && cbobj)cb.call(cbobj,svrVO);
			},cbobj:this,eh:function(err){DBOut("---getDomains err: "+err);},ehobj:this},window.ClanDWRUrl);
		};
		__Page.stateHome.getClanLandWarToday=function(cb,cbobj,eh,ehobj)//获取联盟当前领土战信息
		{
			var clanId=window.aisGame.curCity.allianceId;
			var param=["ClanDwr","getClanCupCurReport",clanId?clanId:-1,window.USERID];
			this.appEnv.newMsg(param,{cb:function(vo){
				DBOut("getClanCupCurReport: "+toJSON(vo));
				this.appEnv.landWarDetail=vo;
				if(vo && vo.members && this.clanInitVO)
				{
					this.clanInitVO.clanVO.members=vo.members;
					this.appEnv.getMembersDevote();
				}
				if(cb && cbobj)cb.call(cbobj,vo);
			},cbobj:this,eh:function(err,msg){
				DBOut("getClanCupCurReport err msg: "+err+" | "+msg);
				if(eh && ehobj)eh.call(ehobj,msg);
			},ehobj:this},window.ClanDWRUrl);
			if(this.getLandTimer)
			{
				clearTimeout(this.getLandTimer);
				this.getLandTimer=null;
			}
		//	this.getLandTimer=this.appEnv.layer.setTimeout(1000*60*10,function(){
		//		this.getClanLandWarToday();
		//	},this);
		};
	}
}
