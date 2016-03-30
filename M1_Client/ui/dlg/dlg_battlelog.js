if(!__Page.dlgLog)
{
	__Page.dlgLog=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgLog;
	__Page.dlgLog.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;

		var pic=imgLib.getImg("btn_blue_u");
		var topListX=this.toplistX=this.closeBtnW+10;
		var topListY=this.toplistY=this.closeBtnY;
		var topListW=this.topListW=this.dlgW-this.closeBtnW-topListX-10;
		var topListH=this.topListH=this.closeBtnH;
		var menuW=this.menuW=pic.w+10;
		var menuH=this.menuH=pic.h;
		var menuX=this.menuX=menuW/2;
		var menuY=this.menuY=menuH/2;
		this.lbxMenuCSS={type:"listbox",id:"lbx-menu",pos:[topListX,topListY,0],w:topListW,h:topListH,anchor_h:0,anchor_v:1,ui_event:1,sub_event:1,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:menuW,item_h:menuH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,
		};
		this.curStateId=-1;

		var listX=this.listX=this.contentInner[0];
		var listY=this.listY=this.contentInner[1];
		var listW=this.listW=this.contentW-this.contentInner[0]*2;
		var listH=this.listH=this.contentH-this.contentInner[1]*2;
		var itemW=this.itemW=listW;
		var itemH=this.itemH=210;
		this.listCSS={type:"listbox",id:"lbx-log",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=this.itemX=itemW/2;
		var itemY=this.itemY=itemH/2;
		var pic=imgLib.getImg("box_achieve");
		var centerW=this.centerW=itemW;
		var centerH=this.centerH=202;
		var centerX=this.centerX=-centerW/2;
		var centerY=this.centerY=-centerH/2;
		var centerInner=this.centerInner=[pic.mgL,pic.mgU];

		var iconSize=this.iconSize=40;
		pic=imgLib.getIcon("medal",64);
		var resultW=this.resultW=pic.w+40;
		var resultH=this.resultH=centerH;
		var resultX=this.resultX=resultW/2;;
		var resultY=this.resultY=0;
		var rTextW=this.rTextW=resultW;
		var rTextH=this.rTextH=32;
		var rTextX=this.rTextX=resultX;
		var rTextY=this.rTextY=rTextH/2;
		var starW=this.starW=20;
		var starH=this.starH=20;
		var starY=this.starY=rTextH+this.dt+starH/2;
		var starX_m=this.starX_m=resultX;//中间的星星
		var starX_l=this.starX_l=starX_m-starW-2;//左边的星星
		var starX_r=this.starX_r=starX_m+starW+2;//右边的星星
		this.starCSS=imgLib.getImg("pic_star");
		this.starDarkCSS=imgLib.getImg("pic_star_dark");
		pic=imgLib.getIcon("medal",64);
		var medalX=this.medalX=resultX;
		var medalY=this.medalY=starY+starH/2+this.dt;
		this.iconCSS_medal=pic;
		var scoreW=this.scoreW=resultW;
		var scoreH=this.scoreH=40;
		var scoreX=this.scoreX=resultX;
		var scoreY=this.scoreY=resultH-scoreH/2;

		pic=imgLib.getImg("btn_green_u");
		var btnBoxW=this.btnBoxW=pic.w+20;
		var btnBoxH=this.btnBoxH=centerH;
		var btnBoxX=this.btnBoxX=centerW-btnBoxW/2;
		var btnBoxY=this.btnBoxY=0;
		var timeW=this.timeW=btnBoxW;
		var timeH=this.timeH=32;
		var timeX=this.timeX=btnBoxX;
		var timeY=this.timeY=timeH/2;
		var btnW=this.btnW=136
		var btnH=this.btnH=58;
		var replayX=this.replayX=btnBoxX;
		var replayY=this.replayY=timeH+btnH/2;
		var revengeX=this.revengeX=btnBoxX;
		var revengeY=this.revengeY=replayY+btnH+this.dt;

		var infoBoxW=this.infoBoxW=centerW-resultW-btnBoxW;
		var infoBoxH=this.infoBoxH=centerH;
		var infoBoxX=this.infoBoxX=resultW;
		var infoBoxY=this.infoBoxY=0;
		pic=imgLib.getIcon("level",64);
		pic.w=pic.h=44;
		var blankW=10;
		var expW=this.expW=pic.w;
		var expH=this.expH=pic.h;
		var expX=this.expX=infoBoxX+blankW;
		var expY=this.expY=expH/2;
		this.iconCSS_exp=pic;
		blankW=blankW*2+expW;
		var detailX=this.detailX=infoBoxX+blankW;
		var nameW=this.nameW=100;
		var nameH=this.nameH=36;
		var nameY=this.nameY=nameH/2;
		this.iconCSS_info=imgLib.getImg("pic_info");
		pic=imgLib.getIcon("medal",64);
		pic.w=pic.h=iconSize;
		var medalsX=this.medalsX=infoBoxW-100;
		var medalsY=this.medalsY=pic.h/2+this.dt;
		this.iconCSS_medals=pic;
		this.foeX=medalsX+150, this.foeY=medalsY;
		var clanY=this.clanY=nameY+nameH/2+this.dt*2;
		var clanW=this.clanW=100;
		var clanH=this.clanH=16;
		pic=imgLib.getIcon("Unit1",128);
		var lbxTroopY=this.lbxTroopY=clanY+clanH;
		var lbxTroopW=this.lbxTroopW=infoBoxW-blankW*2;
		var lbxTroopH=this.lbxTroopH=62;//50,6
		var subW=this.subW=52;
		var subH=this.subH=lbxTroopH;
		var subCW=this.subCW=46;
		this.lbxTroopCSS={type:"listbox",id:"lbx-troop",pos:[detailX,lbxTroopY,0],w:lbxTroopW-40,h:lbxTroopH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:2,show_align:0,//hot_check:1,
			item_w:subW,item_h:subH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,
		};
		
		this.resIconText={
			createCSS:function(pos,pic,text,color,font,offsetY)
			{	
				var css;
				var icon=pic;
				if(!font)
					font=20;
				var w=120;
				css={
					type:"shape",id:"iconText",pos:pos,w:w,h:icon.h,anhcor_h:0,anchor_v:1,items:[
						{type:"icon",id:"icon",pos:[w-icon.w/2,0,0],anchor_h:1,anchor_v:1,css:icon},
						{id:"text",css:cssLib.textFineSmall.createCSS([w-icon.w,0+offsetY,0],text+"",w-icon.w,icon.h,2,1,2,1,color?color:null),font_size:font}
					]
				};
				return css;
			},
		};
		
		var tipW=this.tipW=48;
		var tipH=this.tipH=iconSize+this.dt*2;
		var tipY=this.tipY=infoBoxH-tipH-20;
		this.levelMsgY=infoBoxH-tipH/2;
		var goldX=this.goldX=detailX;//+tipW+this.dt*2
		var goldY=this.goldY=tipY;
		css=imgLib.getIcon("res_gold",64);
		css.w=css.h=iconSize;
		this.iconCSS_gold=css;
		var oilX=this.oilX=detailX+tipW+70;
		var oilY=this.oilY=tipY;
		css=imgLib.getIcon("res_oil",64);
		css.w=css.h=iconSize;
		this.iconCSS_oil=css;
		var darkOilX=this.darkOilX=detailX+(tipW+70)*2;
		var darkOilY=this.darkOilY=tipY;
		css=imgLib.getIcon("res_cube",64);
		css.w=css.h=iconSize;
		this.iconCSS_darkOil=css;
		var rewardItemX=this.rewardItemX=detailX+tipW*3+206;
		var rewardItemY=this.rewardItemY=tipY;
		this.tipTextCSS={type:"text",anchor_h:1,anchor_v:1,align_h:1,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:160};

		this.lineY=this.centerInner[1]/2;
		this.lineH=centerH-this.lineY*2;
		this.lineX_l=resultW;
		this.lineX_r=resultW+infoBoxW;
	};
	__Page.dlgLog.init=function(appEnv)
	{
		this.name="dlgLog";
		this.viewId="dlgLog";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.LogDefence=0;
		this.LogAttack=1;

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMenuClk);
		this.lbxMenu=this.dlgFrame.appendNewChild({css:this.lbxMenuCSS,key:keyid});

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onLogClk);
		this.lbxLog=this.cntBox.appendNewChild({css:this.listCSS,key:keyid});

		this.descTxt=this.cntBox.appendNewChild({css:cssLib.textFineBig.createCSS([this.contentW/2,this.contentH/2,0],textLib["NoLog"],200,50,1,1,1,1,[192,192,192,255]),display:0});

		this.initFoeBox();
	};

	__Page.dlgLog.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var city=window.aisGame.curCity;
	//	if(!city.foeVO)
	//		city.foeVO=[{oppUserId:"1015231",nickName:"balabala",vipLevel:6,clanId:3001,clanFlag:30,clanName:"xxClan",attackTimeMS:"",battleTotalTimes:20,battleWinTimes:12},{}];
		if(!city.enemys)
			city.enemys=[{}];
		this.foeVO=city.enemys;
	//	DBOut("=== foeVO:"+toJSON(this.foeVO)+"\n "+typeof(this.foeVO)+" "+this.foeVO.length);
		this.states=["Defence","Attack","Foe"];
		var i,item,keyid=0,items=[];
		for(i=0; i<this.states.length; i++)
		{
		//	keyid=appEnv.hudKeys.getKey(this);
		//	this.regKeyVO(keyid,this,this["onClk_"+this.states[i]]);
			item=cssLib.normalBtn.createCSS([this.menuX,this.menuY,0],keyid,2,textLib["Log"+this.states[i]]);
			this.lbxMenu.addItem(item);
		}

		this.dlgTitle.setDisplay(0);
		this.dlgTitle._setText(textLib["SetFoeTitle"]);
		this.defenceLogs=city.raidedRecord;
		this.attackLogs=[];
		this.attackLogs=this.getAtkLog();
		this.lbxMenu.itemAt(0).setEnabled(0);
	//	this.timer=setFrameout(window.DelayLoad,function(){
		appEnv.setDlgAniCall(function(){
			this.onMenuClk(2,0,1,0);
			this.timer=null;
		},this);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgLog.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgLog.getAtkLog=function()
	{
		var cookie=this.page.getCookie("M1Replay"+this.appEnv.getServerID()+window.USERID,"SelfBattleReplay");
	//	DBOut("atkLog:"+cookie);
	//	this.page.setCookie("M1Replay","SelfBattleReplay"+window.USERID,toJSON([]),0);return [];
		if(cookie){
			return fromJSON(cookie);
		}else{
			cookie=this.page.getCookie("M1","SelfBattleReplay"+window.USERID);
			if(cookie){
				return fromJSON(cookie);
			}
			return [];
		}
	};

	__Page.dlgLog.showUI=function(extra)
	{
		var vo;
		if(0==extra){
			this.curLog=this.LogDefence;
			vo=this.defenceLogs;
			this.hideFoeBox();
		}else if(1==extra){
			this.curLog=this.LogAttack;
			vo=this.attackLogs;
			this.hideFoeBox();
		}else if(2==extra){
			this.curLog=-1;
			this.showFoeBox();
			return;
		}

		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var i,j,k,info,unit,spell,clanIcon,scoreColor,armyItems=[],items=[],replayShow,item1,hud1,gold1,oil1,cube1,x1,y1,vo1,css1,name1;
		var goldLost=oilLost=darkLost=0;
		var dt=this.dt,dt2=this.dt*2;

		this.lbxLog.clearItems();
		//根据VO初始化界面:
	//	Dialogs.alert(toJSON(vo));
	//	DBOut(vo);
	//	DBOut(toJSON(vo));
//		if(!vo)
//		vo=[
//			{id:0,attackerId:0,attackerName:"lalh",attackerLevel:30,attackerHonor:999,star:2,rewardHonor:-23,revenge:0,//是否可以复仇, 0:可以复仇 1:不可以复仇
//				time:1367473124717,replayVersion:1,alliance:{id:0,flag:1,name:"TaiChi"},
//				res:[{type:"Gold",num:1536},{type:"Elixir",num:2013},{type:"BlackElixir",num:87}],
//				units:[{codename:"UntMarine",num:52,level:3},{codename:"UntSniper",num:52,level:3},{codename:"UntHacker",num:52,level:3},{codename:"UntCyber",num:52,level:3}],
//				spells:[{codename:"Lightning",num:1,level:3},{codename:"Heal",num:1,level:3},{codename:"VVirus",num:1,level:3},{codename:"ZGravity",num:1,level:3}],
//			},
//		];
		this.infoVO=vo;
		this.replayKeys={};
		this.shareKeys={};
		this.revengeKeys={};
		this.foeKeys={};
		this.lbxResponse=0;
		// DBOut("dlgLog showUI, "+toJSON(vo));
		if(vo && vo.length)
		{
			this.descTxt.setDisplay(0);
			var lbxUnits, replayCSS, revengeCSS, keyid, foeCSS, shareCSS, typeCSS;
			var scale=2/3;
			var lvPic=imgLib.getImg("pic_lv1");
			var lvW=lvPic.w*scale, lvH=lvPic.h*scale;
			var uv3x3=[25/1024,20/1024,22/1024,24/1024], size3x3=[12,10,12,10];
			var thIcon=imgLib.getIcon("goldcard",64);
			thIcon.w=thIcon.h=28;
			var cubeCardIcon=imgLib.getIcon("cubecard",64);
			cubeCardIcon.w=cubeCardIcon.h=28;
			var nameIcon, exNum;
			var rewardItemIcon;
			for(i=0; i<vo.length; i++)
			{
				if(this.LogDefence==this.curLog)
					info=vo[i];
				else if(this.LogAttack==this.curLog)
					info=vo[i].uiInfo;
			//	DBOut("logs["+i+"]="+toJSON(vo[i]));
				armyItems=[], replayShow=0;
				if(info.units)
				{
					for(j=0; j<info.units.length; j++)
					{
						unit=info.units[j];
						armyItems.push({type:"div3x3",id:"unit-"+unit.codename,pos:[0,0,0],w:this.subCW,h:this.subH,css:imgLib["box_unit_dark"],items:[//face_r:0,face_g:0,face_b:0,face_a:160
							{type:"icon",id:"icon",pos:[0,this.subH-this.subCW,0],w:this.subCW,h:this.subCW,css:imgLib.getIcon((unit.codename.indexOf("Unt")>-1?"chr_":"spell_")+unit.codename,128),},
						//	{type:"text",id:"num",pos:[0,0,0],text:"x"+unit.num,w:this.subCW,h:this.subH-this.subCW,anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:14},
						//	{type:"text",id:"lv",pos:[0,this.subCW,0],text:"Lv"+unit.level,w:this.subCW,h:this.subH-this.subCW,anchor_h:0,anchor_v:0,align_h:1,align_v:0,font_size:14},
							{id:"num",css:cssLib.textFineSmall.createCSS([0,0,0],"x"+unit.num,this.subCW,this.subH-this.subCW,0,0,0,0)},
						//	{id:"lv",css:cssLib.textFineSmall.createCSS([0,this.subCW,0],"Lv"+unit.level,this.subCW,this.subH-this.subCW,0,0,1,0)},
							{type:"icon",id:"LvIcon",pos:[lvW/2,this.subH-lvH/2,0],w:lvW,h:lvH,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_lv"+(unit.level))},
						]});
					}
				}
				if(info.spells)
				{
					for(j=0; j<info.spells.length; j++)
					{
						spell=info.spells[j];
						armyItems.push({type:"div3x3",id:"spell-"+spell.codename,pos:[0,0,0],w:this.subCW,h:this.subH,css:imgLib["box_unit_dark"],items:[//face_r:0,face_g:0,face_b:0,face_a:160,
							{type:"icon",id:"icon",pos:[0,this.subH-this.subCW,0],w:this.subCW,h:this.subCW,css:imgLib.getIcon("spell_"+spell.codename,128),},
						//	{type:"text",id:"num",pos:[0,0,0],text:"x"+spell.num,w:this.subCW,h:this.subH-this.subCW,anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:14},
						//	{type:"text",id:"lv",pos:[0,this.subCW,0],text:"Lv"+spell.level,w:this.subCW,h:this.subH-this.subCW,anchor_h:0,anchor_v:0,align_h:1,align_v:0,font_size:14},
							{id:"num",css:cssLib.textFineSmall.createCSS([0,0,0],"x"+spell.num,this.subCW,this.subH-this.subCW,0,0,0,0)},
						//	{id:"lv",css:cssLib.textFineSmall.createCSS([0,this.subCW,0],"Lv"+spell.level,this.subCW,this.subH-this.subCW,0,0,1,0)},
							{type:"icon",id:"LvIcon",pos:[lvW/2,this.subH-lvH/2,0],w:lvW,h:lvH,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_lv"+(spell.level))},
						]});
					}
				}
				if(info.mechs)
				{
					var mechIcon, mechBg, mechCSS, up, down;
					var picBody=imgLib.getImg("pic_part_body"), picLeg=imgLib.getImg("pic_part_leg");
					var partX=2, partY=2, partW=picBody.w, partH=picBody.h, plvX=partX+partW, plvY=partY, plvW=this.subCW-partX-partW, plvH=partH, gap=partH+2;
					for(j=0; j<info.mechs.length; j++)
					{
						spell=info.mechs[j].up?info.mechs[j].up:info.mechs[j];
						up=info.mechs[j].up?info.mechs[j].up:info.mechs[j];
						down=info.mechs[j].down?info.mechs[j].down:"";
						mechCSS=this.getMechIcon(spell.codename);
						armyItems.push({type:"div3x3",id:"mech-"+spell.codename,pos:[0,0,0],w:this.subCW,h:this.subH,css:imgLib["box_unit_dark"],items:[//face_r:0,face_g:0,face_b:0,face_a:160,
							{type:"icon",id:"bg",pos:[0,0,0],w:this.subCW,h:this.subH,css:mechCSS.bg,},
							{type:"icon",id:"icon",pos:[0,this.subH-this.subCW,0],w:this.subCW,h:this.subCW,css:mechCSS.icon},
							{id:"num",css:cssLib.textFineSmall.createCSS([0,0,0],"x"+spell.num,this.subCW,this.subH-this.subCW,0,0,0,0),display:0},
							{type:"icon",id:"body",pos:[partX,partY,0],css:picBody,display:up?1:0},
							{id:"body-lv",css:cssLib.textFineSmall.createCSS([plvX,plvY,0],up?(up.level):"",plvW,plvH,0,0,0,1)},
							{type:"icon",id:"leg",pos:[partX,partY+gap,0],css:picLeg,display:down?1:0},
							{id:"leg-lv",css:cssLib.textFineSmall.createCSS([plvX,plvY+gap,0],down?(down.level):"",plvW,plvH,0,0,0,1)},
						]});
					}
				}
				if((info.clanFlag || info.isClanFlag) && ((this.LogDefence==this.curLog && info.alliance) || this.LogAttack==this.curLog))
				{
					if(this.LogDefence==this.curLog)
						clanIcon=info.alliance.flag;
					else
						clanIcon=page.getCookie("Runtime","ClanFlag");
					armyItems.push({type:"div3x3",id:"clanFlag",pos:[0,0,0],w:this.subCW,h:this.subH,css:imgLib["box_unit_dark"],items:[//face_r:0,face_g:0,face_b:0,face_a:160,
						{type:"icon",id:"icon",pos:[0,this.subH-this.subCW,0],w:this.subCW,h:this.subCW,css:imgLib.getIcon("badge"+clanIcon,64),},
					]});
				}
				lbxUnits={type:"listbox",css:this.lbxTroopCSS,line_items:armyItems};
			//	DBOut("replayVersion:"+info.replayVersion+", gVersion:"+window.aisEnv.defLib.globals["BATTLE_REPLAY_DEF_VERSION"]);
				if(((window.KernelVersion && info.replayVersion2==window.KernelVersion) || !window.KernelVersion) &&
					(info.replayVersion==window.aisEnv.defLib.globals["BATTLE_REPLAY_DEF_VERSION"])
				)
				{
					replayShow=1;
					keyid=appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.onReplayClk);
					this.replayKeys[""+keyid]=vo[i];//info;
					replayCSS={id:"replay",css:cssLib.normalBtn.createCSS([this.replayX,this.replayY,0],keyid,0,textLib["Replay"],this.btnW,this.btnH),button:1};
				}
				if(!info.revenge)
				{
					keyid=appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.onRevengeClk);
					this.revengeKeys[""+keyid]={userId:info.id, forceFlag:0, gemNum:0};//info.attackerId
					revengeCSS={id:"revenge",css:cssLib.normalBtn.createCSS([this.revengeX,this.revengeY,0],keyid,1,textLib["Revenge"],this.btnW,this.btnH),button:1};
				}
				if(this.checkIsFoe(info.attackerId))
					info.isFoe=1;
				else
					info.isFoe=0;
				foeCSS={type:"icon"};
				// shareCSS={type:"icon"};
				var pic=imgLib.getImg("btn_green_u");
				var pic_video=imgLib.getImg("pic_video");
				var btnW=pic.w, btnH=pic.h;
			//	if(!info.isFoe)
				{
					keyid=appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.onSetFoeClk);
					this.foeKeys[""+keyid]=info;
					foeCSS=cssLib.normalBtn.createCSS([this.foeX-10,this.foeY+10,0],keyid,0,textLib["SetFoe"],108,48,FS.M);
					foeCSS.state_up.uv3x3=foeCSS.state_down.uv3x3=foeCSS.state_gray.uv3x3=uv3x3;
					foeCSS.state_up.size3x3=foeCSS.state_down.size3x3=foeCSS.state_gray.size3x3=size3x3;

					//分享视频按钮
					keyid=appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.onSetShareVideo);
					this.shareKeys[""+keyid]=vo[i];//info;
					shareCSS=cssLib.normalBtn.createCSS([this.foeX-10,this.foeY+63,0],keyid,0,textLib["ShareVideo"],108,48,FS.M);
					shareCSS.items[0]={css:cssLib.textFineMid.createCSS([0,0,0],textLib["Share"],108,48,2,1,2,1,null,0),font_size:18};
					shareCSS.items[1]={type:"icon",pos:[5,0,0],css:pic_video,anchor_h:0,anchor_v:1,display:1};

					shareCSS.state_up.uv3x3=shareCSS.state_down.uv3x3=shareCSS.state_gray.uv3x3=uv3x3;
					shareCSS.state_up.size3x3=shareCSS.state_down.size3x3=shareCSS.state_gray.size3x3=size3x3;
				}
				if(info.rewardHonor>0){
					scoreColor=[0,200,0,255];
				}else{
					scoreColor=[200,0,0,255];
				}
				for(k=0; k<info.res.length; k++)
				{
					if("Gold"==info.res[k].type || "Res_Gold"==info.res[k].type)
						goldLost=info.res[k].num;
					else if("Elixir"==info.res[k].type || "Res_Oil"==info.res[k].type)
						oilLost=info.res[k].num;
					else if("Cube"==info.res[k].type || "Res_Cube"==info.res[k].type)
						darkLost=info.res[k].num;
				}
				clanIcon=info.alliance?imgLib.getIcon("badge"+info.alliance.flag,64):imgLib.getIcon("badge0",64);
				//clanIcon=imgLib.getIcon("btn_friend",64);
				clanIcon.w=clanIcon.h=28;
				if(!info.raidType){
					typeCSS=imgLib.getImg("pic_atk_normal");
				}else if(1==info.raidType){
					typeCSS=imgLib.getImg("pic_atk_revenge");
				}else if(2==info.raidType){
					typeCSS=imgLib.getImg("pic_atk_force");
				}else if(3==info.raidType){
					typeCSS=imgLib.getImg("pic_atk_foe");
				}
				nameIcon=this.iconCSS_info;
				var cubeCardDisplay=0;
				if(this.LogDefence==this.curLog)
				{
					if(info.advMC15Attack && info.buffBCCAttack)
					{
						nameIcon=thIcon;
						cubeCardDisplay=1;
					}
					else if(info.buffBCCAttack)
						nameIcon=cubeCardIcon;
					else if(info.advMC15Attack)
						nameIcon=thIcon;
				}else if(this.LogAttack==this.curLog)
				{
					if(info.oppMC15Flag && info.oppBCCFlag)
					{
						nameIcon=thIcon;
						cubeCardDisplay=1;
					}
					else if(info.oppBCCFlag)
						nameIcon=cubeCardIcon;
					else if(info.oppMC15Flag)
						nameIcon=thIcon;
				}
				if(info.rewardItem)
				{
					rewardItemIcon=imgLib.getIcon("icon_"+info.rewardItem+"_32");
				}else
					rewardItemIcon=imgLib.getIcon("icon_itm_token_1_32");
				rewardItemIcon.w=this.iconSize;
				rewardItemIcon.h=this.iconSize;
				item1=
				//	{type:"icon",id:"item",pos:[this.itemX,this.itemY,0],w:this.itemW,h:this.itemH,anchor_h:1,anchor_v:1,ui_event:1,
				//	items:[
						{type:"div3x3",id:"center",pos:[this.centerX+this.itemX,this.centerY+this.itemY,0],w:this.centerW,h:this.centerH,ui_event:1,css:imgLib.getImg("box_achieve"),info:info,
							items:[
								{id:"result",css:cssLib.textFineMid.createCSS([this.rTextX,this.rTextY,0],textLib[(this.LogDefence==this.curLog?"Def":"Atk")+"Result"+info.star],this.rTextW,this.rTextH,1,1,1,1,scoreColor)},
								{type:"icon",id:"starDarkL",pos:[this.starX_l,this.starY,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:this.starDarkCSS},
								{type:"icon",id:"starDarkM",pos:[this.starX_m,this.starY,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:this.starDarkCSS},
								{type:"icon",id:"starDarkR",pos:[this.starX_r,this.starY,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:this.starDarkCSS},
								{type:"icon",id:"starL",pos:[this.starX_l,this.starY,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:this.starCSS,display:info.star>0?1:0},
								{type:"icon",id:"starM",pos:[this.starX_m,this.starY,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:this.starCSS,display:info.star>1?1:0},
								{type:"icon",id:"starR",pos:[this.starX_r,this.starY,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:this.starCSS,display:info.star>2?1:0},
								{type:"icon",id:"medal",pos:[this.medalX,this.medalY,0],anchor_h:1,anchor_v:0,css:this.iconCSS_medal},
								{id:"foe_btn",css:foeCSS,display:(!info.isFoe)?1:0},//this.LogDefence==this.curLog &&
								{id:"share_btn",css:shareCSS,display:(replayShow&&(this.LogDefence==this.curLog))?1:0},
								{type:"icon",id:"foe_pic",pos:[this.foeX,this.foeY,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_foe"),display:(info.isFoe)?1:0},//this.LogDefence==this.curLog &&
								{id:"score",css:cssLib.textFineMid.createCSS([this.scoreX,this.scoreY,0],""+info.rewardHonor,this.scoreW,this.scoreH,1,1,1,1,scoreColor)},
								{type:"div3x3",id:"line_l",pos:[this.lineX_l,this.lineY,0],css:imgLib.getImg("box_line"),h:this.lineH},
								{id:"level",css:cssLib.iconText.createCSS([this.expX,this.expY,0],this.iconCSS_exp,info.attackerLevel,1,null,0,-2)},
								{id:"name",css:cssLib.iconText.createCSS([this.detailX,this.nameY,0],nameIcon,info.attackerName,2)},
								{id:"medals",css:cssLib.iconText.createCSS([this.medalsX,this.medalsY,0],this.iconCSS_medals,info.attackerHonor,0),display:0==extra?1:0},
								{id:"clan",css:cssLib.iconText.createCSS([this.detailX,this.clanY,0],clanIcon,info.alliance?info.alliance.name:"",0,"",16),display:info.alliance?1:0},
								{type:"text",id:"troopTip",pos:[this.detailX-10,this.lbxTroopY+this.lbxTroopH-10,0],w:this.tipW,h:this.tipH,text:textLib["Army"]+":",anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200},
								{id:"troops",css:lbxUnits},
								{type:"text",id:"tip",pos:[this.detailX-10,this.tipY,0],w:this.tipW,h:this.tipH,text:(this.LogDefence==this.curLog?textLib["Lost"]:textLib["Gain"])+":",anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200},
								{id:"levelMsg",css:cssLib.textFineMid.createCSS([this.detailX-54,this.levelMsgY,0],vo[i].words?vo[i].words:"",this.tipW*10,this.tipH,0,1,0,1,[200,0,0,255])},
								{id:"gold",css:this.resIconText.createCSS([this.goldX,this.goldY,0],this.iconCSS_gold,goldLost)},
								{id:"oil",css:this.resIconText.createCSS([this.oilX,this.oilY,0],this.iconCSS_oil,oilLost)},
								{id:"dark",css:this.resIconText.createCSS([this.darkOilX,this.darkOilY,0],this.iconCSS_darkOil,darkLost)},
								{id:"item",css:cssLib.iconText.createCSS([this.rewardItemX,this.rewardItemY,0],rewardItemIcon,"1",2),display:info.rewardItem?1:0},
								{type:"icon",id:"atk_type",pos:[this.foeX,this.darkOilY,0],anchor_h:1,anchor_v:1,css:typeCSS,display:this.LogDefence==this.curLog?1:0},
								{type:"div3x3",id:"line_r",pos:[this.lineX_r,this.lineY,0],css:imgLib.getImg("box_line"),h:this.lineH},
								{id:"time",css:cssLib.textFineSmall.createCSS([this.timeX,this.timeY,0],textLib.getTimeDistance(info.time),this.timeW,this.timeH,1,1,1,1)},
								{css:replayCSS,display:replayShow?1:0},
								{id:"expired",pos:[this.replayX,this.replayY,0],w:this.btnW,h:this.btnH,css:this.tipTextCSS,text:textLib["Expired"],display:replayShow?0:1},
								{css:revengeCSS,display:info.revenge?0:1},
								{id:"revenged",pos:[this.revengeX,this.revengeY,0],w:this.btnW,h:this.btnH,css:this.tipTextCSS,text:textLib["Revenged"+info.revenge],display:(info.revenge && this.LogDefence==this.curLog)?1:0},
							]
						}
				//	]}
				items.push(item1);
				hud1=this.lbxLog.addItem(item1);
				if(cubeCardDisplay==1)
				{
					name1=this.lbxLog.itemAt(hud1).getItemById("name");
					x1=appEnv.getTextSize(info.attackerName,20,0).w+thIcon.w+6+cubeCardIcon.w/2;
					y1=0;
					name1.appendNewChild({type:"icon",id:"cubeCard",pos:[x1,y1,0],anchor_h:1,anchor_v:1,css:cubeCardIcon});
				}
				exNum=0;
				if(info.advMC15Res && info.advMC15Res.length)
				{
					hud1=this.lbxLog.itemAt(hud1);
					gold1=hud1.getItemById("gold");
					oil1=hud1.getItemById("oil");
					cube1=hud1.getItemById("dark");
					x1=appEnv.getTextSize("999999",20).w+42+5;
					for(j=0; j<info.advMC15Res.length; j++)
					{
						vo1=info.advMC15Res[j];
						if(!vo1.num)
							continue;
						exNum=vo1.num;
						if(this.LogDefence==this.curLog)
						{
							if(vo1.num<0)
								continue;
							exNum*=-1;
						}
						if("Res_Gold"==vo1.type || "Gold"==vo1.type)
						{
							css1=gold1;
							x1=appEnv.getTextSize(goldLost+"",20).w+42+5;
						}
						else if("Res_Oil"==vo1.type || "Oil"==vo1.type || "Elixir"==vo1.type)
						{
							css1=oil1;
							x1=appEnv.getTextSize(oilLost+"",20).w+42+5;
						}
						else if("Res_Cube"==vo1.type || "Cube"==vo1.type)
						{
							css1=cube1;
						}
						css1.appendNewChild({css:cssLib.textFineSmall.createCSS([80-1,20,0],exNum<0?exNum:("+"+exNum),10,10,2,1,2,1,exNum<0?[255,0,0,255]:[0,255,0,255]),
							font_size:20,display:(exNum && (this.curLog==this.LogAttack || (this.curLog==this.LogDefence && exNum<0)))?1:0});
					}
				}
			}
		//	this.lbxLog.addItems(items);
//			for(i=0; i<vo.length; i++)
//			{
//				this.lbxLog.itemAt(i).getItemById("name").resetPos();
//			}
		}
		else
		{
			this.descTxt.setDisplay(1);
		}
	};

	__Page.dlgLog.doRevenge=function(ok,info)
	{
		if(ok)
		{
			this.appEnv.closeDlg(null,null,0);
			this.page.stateHome.onRevengeClick(info);
		}
	};

	__Page.dlgLog.getMechIcon=function(icon)
	{
		var imgLib=this.page.imgLib;
		var list, tier={}, iconCSS={};
		if(icon && icon.indexOf("par")>-1)
		{
			list=icon.split("_");
			list[2]=list[2].replace("0","");
			tier=imgLib.getIcon("bg_tier"+list[2]+"_32");
			iconCSS=imgLib.getIcon(list[0]+"_"+list[1]+"_32");
			return {bg:tier, icon:iconCSS};
		}
	};

	__Page.dlgLog.updateLogFoeStatus=function(userId,clear)
	{
		var i, item, btn, pic;
		for(i=0; i<this.lbxLog.getItemNum(); i++)
		{
			item=this.lbxLog.itemAt(i);
			if(userId==item.info.attackerId)
			{
				btn=item.getItemById("foe_btn");
				pic=item.getItemById("foe_pic");
				if(clear)
				{
					item.info.isFoe=0;
					btn.setDisplay(1);
					pic.setDisplay(0);
				}
				else
				{
					btn.setDisplay(0);
					pic.setDisplay(1);
				}
			}
		}
	};

	__Page.dlgLog.checkIsFoe=function(userId)
	{
		var i;
		for(i=0; i<this.foeVO.length; i++)
		{
			if(this.foeVO[i].oppUserId==userId)
			{
				return 1;
			}
		}
		return 0;
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgLog.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//点击顶部菜单
		__Page.dlgLog.onMenuClk=function(msg,key,way,extra)
		{
		//	DBOut("onMenuClk, way="+way+", msg="+msg);
			if(1==way && 2==msg)
			{
			//	DBOut("onMenuClk");
				if(extra==this.curStateId)return;
				this.lbxMenu.itemAt(extra).setEnabled(0);
				if(this.curStateId>-1)
				{
					this.lbxMenu.itemAt(this.curStateId).setEnabled(1);
				}
				this.showUI(extra);
				this.curStateId=extra;
			}
		};

		//日志列表被点击
		__Page.dlgLog.onLogClk=function(msg,key,way,extra)
		{
			if(1==way)
			{
				if(0==msg)
				{
				//	DBOut("onLogClk down");
					this.lbxResponse=1;
					this.curSelItem=extra;
				}
				else if(2==msg)
				{
				//	DBOut("onLogClk check");
					if(this.lbxResponse)
					{
						DBOut("Do lbx reponse!");
						DBOut("this.onLogClk:"+extra);
						var info=this.lbxLog.itemAt(extra).info;
						if(info.userId==window.USERID)
							return;
						var appEnv=this.appEnv;
						var textLib=appEnv.textLib;
						appEnv.showPmtDlg(this.page.pmtChoose,0,
							{
								title:textLib["ConfirmVisit"],info:textLib["ConfirmVisitDesc"](info.attackerName),
								pmtFunc:function(ok,info){
									if(ok)
									{
										this.appEnv.closeDlg(null,null,0);
										this.page.stateHome.onVisitClick(info.attackerId);
									}
								},pmtObj:this,pmtParam:info
							}
						);
					}
					this.lbxResponse=0;
				}
			}
		};

		//replay按钮被点击
		__Page.dlgLog.onReplayClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onReplayClk: "+this.curLog);
				var info=this.replayKeys[key];
				this.appEnv.closeDlg(null,null,0);
				this.page.setCookie("Runtime","ReplayStageId","null",0);
				if(this.LogDefence==this.curLog)
				{
					if((((window.KernelVersion && info.replayVersion2==window.KernelVersion) || !window.KernelVersion) &&
						(info.replayVersion==window.aisEnv.defLib.globals["BATTLE_REPLAY_DEF_VERSION"])
					)&&(this.LogDefence==this.curLog))
					{
						this.page.setCookie("Runtime","ReplayStageId",toJSON(info),0);
					}
					this.page.stateHome.onReplayClick(info.id);
				}
				else if(this.LogAttack==this.curLog)
					this.page.stateHome.go2Replay(info);
			}
		};

		//revenge按钮被点击
		__Page.dlgLog.onRevengeClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onRevengeClk");
				var info=this.revengeKeys[key];

				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var city=aisGame.curCity;
				if(city.getBuff("Shield"))
				{
					this.appEnv.showPmtDlg(this.page.pmtChoose,0,
						{
							title:textLib["InShield"],info:textLib["InShieldDesc"],
							pmtFunc:this.doRevenge,pmtObj:this,pmtParam:info
						}
					);
				}
				else
					this.doRevenge(1,info);
			}
		};

		//设为仇敌按钮被点击
		__Page.dlgLog.onSetFoeClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onSetFoeClk");
				var info=this.foeKeys[key];
				var item=this.lbxLog.itemAt(this.curSelItem);
				var foeBtn=item.getItemById("foe_btn");
				var foePic=item.getItemById("foe_pic")

				var page=this.page;
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var city=window.aisGame.curCity;
				if(this.getEmptyFoe()>-1)
				{
					appEnv.showPmtDlg(this.page.pmtChoose,0,
						{
							title:textLib["ConfirmSetFoe"],info:textLib.getTextEx("ConfirmSetFoeDesc",{name:info.attackerName}),
							pmtFunc:function(ok,info){
								if(ok)
								{
									foeBtn.setDisplay(0);
									foePic.setDisplay(1);
									info.isFoe=1;
									this.updateFoeVO(info);
								}
							},pmtObj:this,pmtParam:info
						}
					);
				}
				else
				{
					this.showFoeBox(1,info);
					this.lbxMenu.setDisplay(0);
					this.dlgTitle.setDisplay(1);
					this.btnBack.setDisplay(1);
				}
			}
		};

		//设为分享视频按钮被点击
		__Page.dlgLog.onSetShareVideo=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				var info=this.shareKeys[key];
				var item=this.lbxLog.itemAt(this.curSelItem);

				var page=this.page;
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var city=window.aisGame.curCity;
				var canShare=false;
				if(true)//确定有录像ID
				{
					var nowTime = Date.now(),starTime;
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
						appEnv.showPmtDlg(this.page.pmtShare,0,
							{
								title:textLib["ShareVideo"],info:"",
								ui:"share",
								pmtFunc:function(ok,info){
									if(ok)
									{
										if(city.allianceId)
										{
											this.appEnv.stateLogs.showLog(textLib["ShareOk"]);
											this.page.setCookie(cookieDomain,"ShareWords",this.page.pmtShare.txtMsg,0);
											this.page.setCookie("M1","ShareVideoTime",toJSON(nowTime),0);
											window.aisGame.king.execFakeCmd(window.aisGame.king,"GameShareBattle",{battleId:info.id,words:this.page.pmtShare.txtMsg},window.aisGame.king);
										}else
											this.appEnv.stateLogs.showLog(textLib["ShareBattleError"]);
									}
								},
								pmtObj:this,
								pmtParam:info
							}
						);
					}else
					{
						var cdTime = 600000 -(nowTime-starTime);
						this.appEnv.stateLogs.showLog(textLib["ShareCDTime"](cdTime));
					}
				}
			}
		};

		//返回按钮被点击
		__Page.dlgLog.onBackClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.hideFoeBox();
				this.lbxMenu.setDisplay(1);
				this.dlgTitle.setDisplay(0);
				this.btnBack.setDisplay(0);
			}
		};
	}
}
