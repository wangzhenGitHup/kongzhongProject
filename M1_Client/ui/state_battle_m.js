if(!__Page.stateBattle)
{
	__Page.stateBattle={
		page:__Page,
		name:"BattleState",
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
		var textLib=page.appEnv.textLib;

		page.keyStateUtil.call(this);
		this.stage=page.vwBattleStage;

		var savedTxt=page.getCookie("Runtime","BattleStage");
		page.setCookie("Runtime","BattleStage","",0);
		if(savedTxt)
		{
			this.gameVO=fromJSON(savedTxt);
		}
		if(!window.aisNTEngine)
		{

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

			//联盟技能List
			this.clantechLabel=this.hudTRBox.appendNewChild({type:"text",css:cssLib.textFineSmall.createCSS([236,88,0],textLib["BattleClantecLabel"],150,20,1,1,1,1),display:0});
			this.clantechItems=this.hudTRBox.appendNewChild({
				"type":"listbox","pos":[300-64*6-20,88,0],"w":64*6,"h":64,"anchor_h":0,"anchor_v":0,"arrange":1,"item_w":50,"item_h":50,"item_alpha_down":0.75,ui_event:0,
				key:-1,show_align:2,hot_check:1,"item_alpha_down":1.0,"item_alpha_dimmed":1.0,"item_size_down":1.0,"item_size_check":1.0,"end_gap":1,"sub_event":2,"move_gap":20,"fast_scroll":1,show_fx:0,
				display:1,fade:1,fade_pos:[64,130,0],fade_size:1,fade_alpha:0,state:this,clip:0
			});

			//技能list
			keyid=appEnv.hudKeys.getKey();
			this.skItems=this.hudBaseBox.appendNewChild({
				"type":"listbox","pos":[0,appEnv.scrSize[1]-240,0],"w":appEnv.scrSize[0]-btnPic.w-10,"h":120,"anchor_h":0,"anchor_v":0,"arrange":1,"item_w":85,"item_h":150,"item_alpha_down":0.75,ui_event:1,
				key:keyid,show_align:2,hot_check:1,"item_alpha_down":1.0,"item_alpha_dimmed":1.0,"item_size_down":1.0,"item_size_check":1.0,"end_gap":1,"sub_event":2,"move_gap":20,"fast_scroll":1,show_fx:0,
				display:0,fade:1,fade_pos:[0,appEnv.scrSize[1]-280,0],fade_size:1,fade_alpha:0,state:this,clip:1
			});
			this.regKeyVO(keyid,this,this.onSkillItemClk);

			//底部的ListBox
			keyid=appEnv.hudKeys.getKey();
			this.lbItems=this.hudBaseBox.appendNewChild({
				"type":"listbox","pos":[0,appEnv.scrSize[1]-120,],"w":appEnv.scrSize[0]-btnPic.w-10,"h":120,"anchor_h":0,"anchor_v":0,"arrange":1,"item_w":85,"item_h":150,"item_alpha_down":0.75,ui_event:1,
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

		var gameVO,list,i,n,css,keyId,items,savedTxt,vo;
		var stage,level;
		stage=this.page.vwBattleStage;
		level=stage.level;

		this.checkTimes=0;
		if(!notfirst)
		{
			appEnv.initPlayTime(1,0);
			this.setPlayTimeShow();
			this.LvBox=cssLib.boxLvBar.create(this.hudTLBox,[30,40,0],[255,240,80]);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onSpeedClk);
			this.speedBtn=cssLib.normalBtn.create(this.hudBRBox,[(this.hudBRBox.getW()>>1)+68,(this.hudBRBox.getH()>>1)-10,0],keyId,0,textLib.X1);

			keyId=appEnv.hudKeys.getKey(this);
			DBOut("----keyId="+keyId);
			this.regKeyVO(keyId,this,this.onEndBattleClk);
		//	this.endBattleBtn=cssLib.normalBtn.create(this.hudTCBox,[this.hudTCBox.getW()>>1,10,0],keyId,1,textLib.EndBattle);
			var btnPic=imgLib.getImg("btn_bt_end");
			this.endBattleBtn=this.hudBaseBox.appendNewChild({type:"key",pos:[appEnv.scrSize[0]-btnPic.w/2-5,appEnv.scrSize[1]-60,0],css:btnPic,button:1,ui_event:1,down_scale:0.95,key:keyId,
				audio:this.page.audioObject.genFileURL("btn_click"),
				state_up:btnPic,state_down:btnPic,state_gray:btnPic,anchor_h:1,anchor_v:1,items:[
					{id:"EndBattle",css:cssLib.textFineMid.createCSS([0,-btnPic.h/4,0],textLib["EndBattle"],btnPic.w,btnPic.h/2,1,1,1,1)},
					{id:"NoReduce",css:cssLib.textFineSmall.createCSS([0,btnPic.h/6,0],textLib["NoReduce"],btnPic.w,btnPic.h/3,1,1,1,1)}
				]});

			this.battleTimeHud=cssLib.battleTime.create(this.hudTCBox,[this.hudTCBox.getW()>>1,80,0],0);

			this.lootGoldBox=cssLib.boxLootBar.create(this.hudTLBox,[60,80,0],"res_gold");
			this.lootOilBox=cssLib.boxLootBar.create(this.hudTLBox,[60,120,0],"res_oil");
			this.lootCubeBox=cssLib.boxLootBar.create(this.hudTLBox,[60,160,0],"res_cube");

			this.mc15Icon=this.hudTLBox.appendNewChild({type:"icon",pos:[36,160,0],css:imgLib.getIcon("goldcard",64),w:64,h:64,anchor_h:1,anchor_v:1,display:0});
			var clanTip=imgLib.getImg("pic_clan_tip");
			this.sameClanPic=this.hudTLBox.appendNewChild({type:"icon",pos:[0,200,0],css:clanTip,display:0,
				fade:1,fade_alpha:0,fade_size:1,fade_pos:[-clanTip.w,200,0]});

			var dw=200, dh=110, s=48;
			var starImg=imgLib.getImg("pic_star_dark");
			var sw=starImg.w>>1,sh=starImg.h>>1;
			this.dmgRateBox=this.hudBLBox.appendNewChild({type:"shape",id:"dmgRateBox",pos:[0,60,0],w:dw,h:dh,items:[
				{id:"tip",type:"text",css:cssLib.textFineMid.createCSS([0,0,0],textLib["TotalDmg"],dw,20,0,0,1,1)},
				{id:"sd1",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2-s+sw,(dh-55)/2+sh,0],anchor_v:1,anchor_h:1},
				{id:"sd2",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2+sw,(dh-55)/2+sh,0],anchor_v:1,anchor_h:1},
				{id:"sd3",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[(dw-s)/2+s+sw,(dh-55)/2+sh,0],anchor_v:1,anchor_h:1},
				{id:"s1",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2-s+sw,(dh-55)/2+sh,0],anchor_v:1,anchor_h:1},
				{id:"s2",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2+sw,(dh-55)/2+sh,0],anchor_v:1,anchor_h:1},
				{id:"s3",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[(dw-s)/2+s+sw,(dh-55)/2+sh,0],anchor_v:1,anchor_h:1},
				{id:"num",type:"text",css:cssLib.textFineBig.createCSS([0,dh-30,0],"0%",dw,35,0,0,1,1)},
			]});

			this.honorBox=cssLib.boxBtMedal.create(this.hudTRBox,[this.hudTRBox.getW()-120,40,0],textLib.Defeat);

			this.tipsText=cssLib.textFineMid.create(this.hudBCBox,[this.hudBCBox.getW()>>1,100,0],textLib.BattleTips,this.hudBCBox.getW(),20,1,1,1,1,[255,255,255]);

			keyId=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyId,this,this.onNextClk);
		//	this.nextBtn=cssLib.normalBtn.create(this.hudBRBox,[this.hudBRBox.getW()-120,100,0],keyId,1,textLib.Next);
			btnPic=imgLib.getImg("btn_bt_next");
			var radarSize=32, resSize=32;
			this.nextBtn=this.hudBaseBox.appendNewChild({type:"key",pos:[appEnv.scrSize[0]-btnPic.w/2-5,appEnv.scrSize[1]-60-130,0],css:btnPic,button:1,ui_event:1,down_scale:0.95,key:keyId,
				audio:this.page.audioObject.genFileURL("btn_click"),
				state_up:btnPic,state_down:btnPic,state_gray:btnPic,anchor_h:1,anchor_v:1,items:[
					{type:"icon",pos:[-btnPic.w/2+radarSize/2+10,0,0],css:imgLib.getImg("pic_radar"),w:radarSize,h:radarSize,anchor_h:1,anchor_v:1},
					{type:"icon",pos:[-btnPic.w/2+radarSize/2+10,0,0],css:imgLib.getImg("pic_radar_light"),w:radarSize,h:radarSize,anchor_h:1,anchor_v:1},
					{css:cssLib.textFineMid.createCSS([0,-btnPic.h/4,0],textLib["Next"],btnPic.w,btnPic.h/2,1,1,1,1)},
					{id:"cost",css:cssLib.textFineMid.createCSS([btnPic.w/2-resSize-12,btnPic.h/6,0],00,btnPic.w,btnPic.h/3,2,1,2,1)},
					{type:"icon",pos:[btnPic.w/2-resSize/2-10,btnPic.h/6,0],css:imgLib.getIcon("res_gold",64),w:resSize,h:resSize,anchor_h:1,anchor_v:1}
				]});
			this.costText=this.nextBtn.getItemById("cost");
			if(this.bRevenge)this.nextBtn.setDisplay(0);

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
		else
		{
			this.setPlayTimeShow();
		}
		items=[];

		if(this.gameVO)
		{
			this.page.vwBattleStage.proxyBattle(this.gameVO);
			vo=this.page.vwBattleStage.battleInfo;
			stage.initCityBlds();
			list=vo.units;
			DBOut("---vo.oppCity.level="+vo.oppCity.level+"  vo.oppCity.name="+vo.oppCity.name);
			this.oppUserId=vo.oppCity.userId;
			this.LvBox.setLvName(vo.oppCity.level,vo.oppCity.name);

			this.loots=this.gameVO.loots;//LootVO
			this.lootIndexs=this.gameVO.lootIndexs;
			this.doublePower=this.gameVO.doublePower;
			this.sameClanFlag=this.gameVO.sameClanFlag;
			this.sameClanPic.setDisplay(0);
			if(this.gameVO.sameClanFlag)
			{
				this.honorBox.setHonor("+0/-0");
				this.delayTimer=setFrameout(30,function(){this.sameClanPic.fadeIn(20,0);},this);
			}else
				this.honorBox.setHonor("+"+vo.oppCity.honor.win+"/-"+vo.oppCity.honor.fail);
			this.mc15Icon.setDisplay(this.gameVO.oppMC15Flag?1:0);
		}

		if(!this.gameVO)
		{
			DBOut("+++not gameVO+++");
			list=[
			{codename:"ClanHud1",num:1,level:1,group:0,units:[{def:level.getObjDefIdx("UntMarine1"),group:1,id:-1,jump:0},{def:level.getObjDefIdx("UntSniper1"),group:1,id:-1,jump:0}]},
			{codename:"UntMarine1",num:100,level:1,group:1},{codename:"UntMarine2",num:100,level:2,group:1},{codename:"UntMarine3",num:100,level:3,group:1},{codename:"UntMarine4",num:100,level:4,group:1},{codename:"UntMarine5",num:100,level:5,group:1},
			{codename:"UntSniper1",num:100,level:1,group:1},{codename:"UntSniper2",num:100,level:2,group:1},{codename:"UntSniper3",num:100,level:3,group:1},{codename:"UntSniper4",num:100,level:4,group:1},{codename:"UntSniper5",num:100,level:5,group:1},
			{codename:"UntHacker1",num:100,level:1,group:1},{codename:"UntHacker2",num:100,level:2,group:1},{codename:"UntHacker3",num:100,level:3,group:1},{codename:"UntHacker4",num:100,level:4,group:1},{codename:"UntHacker5",num:100,level:5,group:1},
			{codename:"UntCyber1",num:100,level:1,group:1},{codename:"UntCyber2",num:100,level:2,group:1},{codename:"UntCyber3",num:100,level:3,group:1},{codename:"UntCyber4",num:100,level:4,group:1},{codename:"UntCyber5",num:100,level:5,group:1},
			{codename:"UntTNTMac1",num:100,level:1,group:1},{codename:"UntTNTMac2",num:100,level:2,group:1},{codename:"UntTNTMac3",num:100,level:3,group:1},{codename:"UntTNTMac4",num:100,level:4,group:1},{codename:"UntTNTMac5",num:100,level:5,group:1},
			{codename:"UntChop1",num:100,group:1},{codename:"UntChop2",num:100,level:2,group:1},{codename:"UntChop3",num:100,level:3,group:1},{codename:"UntChop4",num:100,level:4,group:1},{codename:"UntChop5",num:100,level:5,group:1},
			{codename:"UntTank1",num:100,level:1,group:1},{codename:"UntTank2",num:100,level:2,group:1},{codename:"UntTank3",num:100,level:3,group:1},{codename:"UntTank4",num:100,level:4,group:1},{codename:"UntTank5",num:100,level:5,group:1},
			{codename:"UntHealer1",num:100,level:1,group:10},{codename:"UntHealer2",num:100,level:2,group:10},{codename:"UntHealer3",num:100,level:3,group:10},
			{codename:"UntAvenger1",num:100,level:1,group:1},{codename:"UntAvenger2",num:100,level:2,group:1},{codename:"UntAvenger3",num:100,level:3,group:1},
			{codename:"UntPEKKA1",num:100,level:1,group:1},{codename:"UntPEKKA2",num:100,level:2,group:1},{codename:"UntPEKKA3",num:100,level:3,group:1},
			{codename:"Lightning1",num:100,level:1,group:4},{codename:"Heal1",num:100,level:1,group:5},{codename:"VVirus1",num:100,level:1,group:5},{codename:"ZGravity1",num:100,level:1,group:5},//Spell
			];
			for(i=0;i<list.length;i++)
			{
				if(list[i].group==1)
				this.page.vwBattleStage.unitNum+=list[i].num;
			}
			this.loadstageUnitNum=this.page.vwBattleStage.unitNum;
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
		this.lbItems.addItems(items);
		this.lbItems.itemAt(0).getItemById("UnitSel").setDisplay(1);
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

		if(this.gameVO && this.gameVO.oppCity)
		{
			items=[];
			var tech,techLib,clanDef,lv,j,k=0;
			tech=this.gameVO.oppCity.clanTechs;
			techLib=window.aisEnv.defLib.clanTec;
			clanDef=window.aisEnv.defLib.clan.levels[this.gameVO.oppCity.clanLevel-1];
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

		if(!this.sameClanFlag)
		{
			this.lootGoldBox.bindValue(stage.level,stage.resIdx.Gold,0,1,": ","/"+page.appEnv.textLib.digiGapText(stage.allRes[stage.resIdx.Gold]));
			this.lootOilBox.bindValue(stage.level,stage.resIdx.Elixir,0,1,": ","/"+page.appEnv.textLib.digiGapText(stage.allRes[stage.resIdx.Elixir]));
			this.lootCubeBox.bindValue(stage.level,stage.resIdx.Cube,0,1,": ","/"+page.appEnv.textLib.digiGapText(stage.allRes[stage.resIdx.Cube]));
		}

		this.Timer3mHud.setDisplay(0);
		this.speedBtn.setDisplay(0);
		this.battleTimeHud.setCallBack(this.onTimer,this);
		this.battleTimeHud.start(30+this.addWaitTime);
		//this.aboutTimerLUDT(30*1000,this.startCountDown,this.timerLUDT);
		this.aboutTimerLUDT((30+this.addWaitTime-3)*1000,function(){
			this.Timer3mHud.setDisplay(1);
			this.start3mCountDown(3);
		},this.timerLUDT);
		stage.setAlarmRange(null,null,-1);
		this.setCost();
	};

	__Page.stateBattle.setCost=function()
	{
		var stage=this.page.vwBattleStage;
		var vo=stage.battleInfo;
		if(!vo)return;
		if(!vo.searchCost)return;
		var color=vo.selfCurGold<vo.searchCost ? [200,0,0,255]:[255,255,255,255];
		this.costText._setText(vo.searchCost);
		this.costText.setColor.apply(this.costText,color);
	};

	//--------------------------------------------------------------------------
	//改变模式状态的函数
	//--------------------------------------------------------------------------
	{
		__Page.stateBattle.showBldMenu=function(hotId)
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

		__Page.stateBattle.hideBldMenu=function(hotId)
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
				DBOut("Item Selected: "+extra);
				if(this.curUnitLBIdx!=extra)
				{
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
					this.clearChecker();
					item.num--;
					stage.curUnitExvo.skill[extra].num--;
					if(!item.num)item._setEnabled(0);
					stage.putDownMechSkill(stage.curUnitExvo.skill[extra].codename,stage.curUnitExvo.skill[extra].level);
				}
			}
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
			cdHud.setFullValue(1);
			cdHud.setValue(1);
			//cdHud.startTimer(1000,0);
			//cdHud.setValueFactor(1);
			cdHud.setValueSpeed(-0.005);
		};

		__Page.stateBattle.putDownUnit=function()
		{
			var item;
			item=this.lbItems.itemAt(this.lbItems.getCheckItemId());
			//DBOut("--------item="+item);
			if(item)
			{
				this.clearChecker();
				item.putDown();
				this.page.vwBattleStage.curUnitNum=item.unitNum;

				if(this.stage.curUnitExvo && !this.stage.curUnitNum)
					this.showSkill(this.stage.curUnitExvo.skill);
			}
		};

		__Page.stateBattle.setPlayTimeShow=function()
		{
			var appEnv=this.appEnv;
			var layer=appEnv.layer;
			this.clearChecker();
			this.checkTimes++;
			var time=60;
			if(this.checkTimes>1)
				time=25;
			DBOut("setPlayTimeShow: "+time+", "+this.checkTimer);
			this.checkTimer=layer.setTimeout(1000*time,function(){
				this.checkTimer=null;
			//	appEnv.showPlayTimeCheck(1);
			},this);
		};
		__Page.stateBattle.clearChecker=function()
		{
			this.appEnv.showPlayTimeCheck(0);
			if(this.checkTimer)
			{
				clearTimeout(this.checkTimer);
				this.checkTimer=null;
			}
		};

		__Page.stateBattle.onBuildingClk=function(msg,key,way,extra)
		{
		};

		//管理Power，目前暂时用作Update。。。
		__Page.stateBattle.onPowerClk=function(msg,key,way,extra)
		{
		};

		//管理库存，目前暂时用作测试建造建筑
		__Page.stateBattle.onStoreClk=function(msg,key,way,extra)
		{
		};

		__Page.stateBattle.onCaravanClk=function(msg,key,way,extra)
		{
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
				this.appEnv.layer.setUPF(this.upf*spd);
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
			}else
				this.Timer3mHud.setDisplay(0);

		};
		__Page.stateBattle.startCountDown=function()
		{
			var stage=this.page.vwBattleStage;
			if(stage.state>0)
			{
				return;
			}
			if(this.sameClanFlag)
			{
				var pic=this.page.imgLib.getImg("pic_clan_atk");
				this.sameClanPic.setTexUV([pic.tex_u, pic.tex_v, pic.tex_w, pic.tex_h]);
				this.sameClanPic.fadeIn(8,0);
				this.page.audioObject.playSound("A_break");
			}
			stage.state++;
			this.nextBtn.setDisplay(0);
			this.tipsText.setDisplay(0);
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
		__Page.stateBattle.onNextClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				if(this.delayTimer)
				{
					clearTimeout(this.delayTimer);
					this.delayTimer=null;
				}
				var stage=this.page.vwBattleStage;
				var gold=stage.battleInfo.selfCurGold-stage.battleInfo.searchCost;
				if(gold<0)
				{
					this.appEnv.stateLogs.showLog(this.page.appEnv.textLib.NotEnoughGold);
/***********************************伪造假aisEnv、假king、假vwHomeStage**************
					if(!window.aisEnv)
					{
						window.aisEnv={};
						aisGame.defLib={};
						aisGame.defLib.globals={
							"RESOURCE_DIAMOND_COST_100":1,
							"RESOURCE_DIAMOND_COST_1000":4,
							"RESOURCE_DIAMOND_COST_10000":16,
							"RESOURCE_DIAMOND_COST_100000":64,
							"RESOURCE_DIAMOND_COST_1000000":300,
							"RESOURCE_DIAMOND_COST_10000000":1500,
							"RESOURCE_DIAMOND_DIVISOR_100":300,
							"RESOURCE_DIAMOND_DIVISOR_1000":750,
							"RESOURCE_DIAMOND_DIVISOR_10000":1875,
							"RESOURCE_DIAMOND_DIVISOR_100000":3814,
							"RESOURCE_DIAMOND_DIVISOR_1000000":7500,
							"RESOURCE_DIAMOND_DIVISOR_10000000":15000,
						};
					}
					if(!window.aisGame)
					{
						window.aisGame={};
						aisGame.king={};
						aisGame.king.convertGodl2Gem=function(res)
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
					}
					if(!this.page.vwHomeStage)
					{
						this.page.vwHomeStage={};
						this.page.vwHomeStage.gemTrade=function(comVO,callFun,callObj,callParam)
						{

						};
					}

					this.appEnv.showPmtDlg(this.page.pmtInfo,0,
						{
							title:textLib["NotEnoughGold"],info:"缺 Gold "+Math.abs(gold),svo:{storage:[{"name": "Gold", "type": "ResGold", "num": Math.abs(gold)}]},ui:"gem2res",
							pmtFunc:this.onNextClk,pmtObj:this,pmtParam:[1,0,1,0]
						}
					);
/*********************************************************************/
					return;
				}
				if(stage.state==0)
				{
					if(this.timerLUDT)
					{
						this.appEnv.layer.clearTimeout(this.timerLUDT);
						this.timerLUDT=null;
					}
					if(this.updateLUDT)
					{
						this.appEnv.layer.clearTimeout(this.updateLUDT);
						this.updateLUDT=null;
					}
					this.endTimer=1;

					stage.battleInfo.selfCurGold-=stage.battleInfo.searchCost;
					stage.setNavBoxRangeByScale(1);
					this.appEnv.addScale(stage.gameHud,[1,1,1],[0.8,0.8,1]);
					this.appEnv.showSearchAni(function(){
						if(window.aisNTEngine)
						{
							var time=0;
							window.aisNTEngine.execFakeCmd(null,"Search_opponents",{userId:this.oppUserId,callBack:function(data,error){
								if(data)
								{
									this.gameVO=data;
									//this.page.setCookie("Runtime","BattleStage",toJSON(data),0);
									this.reSet();
								}
							},callObj:this},null,time);
						}
					},this);
				}
			}
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
					window.aisNTEngine.execFakeCmd(null,"Return_Home",{callBack:this._go2Home,callObj:this},null,time);
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
			this.nextBtn.setDisplay(1);
			this.tipsText.setDisplay(1);
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

		__Page.stateBattle.giveStar=function()
		{
			var star,stage=this.page.vwBattleStage,hud,appEnv=this.page.appEnv;
			star=stage.star;
			if(star>0){
				hud=this.dmgRateBox.getItemById("s1");
				if(hud.getDisplay()!=1)appEnv.addZoomScale(hud,[0,0,0],[2,2,1],0.5);
				hud.setDisplay(1);
				//appEnv.addRotate_z(hud);
				this.speedBtn.setDisplay(1);
			}
			if(star>1){
				hud=this.dmgRateBox.getItemById("s2");
				if(hud.getDisplay()!=1)appEnv.addZoomScale(hud,[0,0,0],[2,2,1],0.5);
				hud.setDisplay(1);
			}
			if(star>2){
				hud=this.dmgRateBox.getItemById("s3");
				if(hud.getDisplay()!=1)appEnv.addZoomScale(hud,[0,0,0],[2,2,1],0.5);
				hud.setDisplay(1);
			}
			return star;
		};

		__Page.stateBattle.refreshDmgRate=function()
		{
			var rate,stage=this.page.vwBattleStage;
			var textLib=this.appEnv.textLib;
			rate=Math.floor(stage.deadRate);

			if(this.oldDeadRate<40 &&rate>=40)
				this.appEnv.stateLogs.showLog(textLib.DeadRate40);
			else if(this.oldDeadRate<90 &&rate>=90)
				this.appEnv.stateLogs.showLog(textLib.DeadRate90);
			else if(this.oldDeadRate<100 && rate==100)
				this.appEnv.stateLogs.showLog(textLib.DeadRate100);
			this.oldDeadRate=rate;
			this.dmgRateBox.getItemById("num")._setText(rate+"%");
			return rate;
		};

		__Page.stateBattle.remainRes=function()
		{
			return [{type:"Res_Gold",num:this.lootGoldBox._getScore()},{type:"Res_Oil",num:this.lootOilBox._getScore()},{type:"Res_Cube",num:this.lootCubeBox._getScore()}];
		};

		__Page.stateBattle.showSettlement=function()//结算界面
		{
			//DBOut("---------showSettlement--="+toJSON(this.remainRes()));
			this.appEnv.closePmtDlg();
			this.endBattleBtn.setDisplay(0);
			this.lbItems.setDisplay(0);
			this.hudBBox.setDisplay(0);
			this.lootGoldBox.setDisplay(0);
			this.lootOilBox.setDisplay(0);
			this.lootCubeBox.setDisplay(0);
			this.battleTimeHud.setDisplay(0);
			this.honorBox.setDisplay(0);
			this.dmgRateBox.setDisplay(0);
			this.clantechItems.setDisplay(0);
			this.clantechLabel.setDisplay(0);

			this.clearChecker();
			var url;
			url=this.page.genPageURL("ui/dlg/dlg_battleover.jml");
			this.appEnv.openPageDlg(url,this);
		//	this.go2Home();
		};
		//获得星级  stage.star
		//获得完成百分比 Math.floor(stage.deadRate)
		//获得掠夺资源  this.remainRes()
		//获得荣誉值（负数为失败） stage.getHonor()
		//获得放出去的兵 stage.cmdUnits
	}
}
if(!window.aisEnv)
{
	window.aisEnv={defLib:{globals:{},clanTec:{},clan:{},buff:{}},textLib:{clantecName:{},clantecInfo:{}}};
}
