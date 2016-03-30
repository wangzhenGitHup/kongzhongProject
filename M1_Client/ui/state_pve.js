if(!__Page.statePve)
{
	__Page.statePve={
		page:__Page,
		name:"PveState",
		lastLUDT:0,
		lockLUDT:1,
		timerLUDT:null,
		updateLUDT:null,
		pushMsgs:[],
		speed:[1,2,4],
		curSpeed:0
		/*unitTypes:[
			{type:"chr_Marine",idx:-1,icon:"unit1",num:0},
			{type:"chr_Sniper",idx:-1,icon:"unit2",num:0},
		],*/
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.statePve);

	//初始化State
	__Page.statePve.init=function(appEnv)
	{
		var page;
		var imgLib;
		var cssLib;
		var city;
		var layer,keyid;

		this.appEnv=appEnv;
		appEnv.statePve=this;
		appEnv.entryState=this;
		page=this.page;
		imgLib=page.imgLib;
		cssLib=page.cssLib;

		page.keyStateUtil.call(this);
		this.stage=page.vwPveStage;
		page.vwPveStage.initStage();

		this.isGuides=this.page.getCookie("Runtime","guides");
		this.page.setCookie("Runtime","guides","",0);
		this.page.vwPveStage.isGuides=this.isGuides;

		if(this.isGuides)
		{
			if(this.page.audioObject && this.page.audioObject._init)
			{
				this.page.audioObject.playMp3("battle_1",-1);
			}
		}

		if(window.aisNTEngine && !this.isGuides)
		{
			window.aisNTEngine.initBattleCom(page.vwPveStage,window.GameSocketUrl);
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

			var btnPic=imgLib.getImg("btn_bt_end");

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
		DBOut("statePve.init: "+appEnv);
		this.appEnv.layer.setDisplay(0);
	};

	__Page.statePve.enter=function(preState)
	{
		this.upf=this.appEnv.layer.getUPF();
	};

	__Page.statePve.leave=function(nextState)
	{
		this.appEnv.layer.setUPF(this.upf);
		//TODO:code this:
	};

	__Page.statePve.onGameLoaded=function(notfirst)
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var textLib=page.appEnv.textLib;

		var gameVO,list,i,n,css,keyId,items,savedTxt,vo;
		var stage,level;
		stage=this.page.vwPveStage;
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
			this.regKeyVO(keyId,this,this.onEndBattleClk);
		//	this.endBattleBtn=cssLib.normalBtn.create(this.hudTCBox,[this.hudTCBox.getW()>>1,10,0],keyId,1,textLib.EndBattle);
			var btnPic=imgLib.getImg("btn_bt_end");
			this.endBattleBtn=this.hudBaseBox.appendNewChild({type:"key",pos:[appEnv.scrSize[0]-btnPic.w/2-5,appEnv.scrSize[1]-60,0],css:btnPic,button:1,ui_event:1,down_scale:0.95,key:keyId,
				state_up:btnPic,state_down:btnPic,state_gray:btnPic,anchor_h:1,anchor_v:1,audio:this.page.audioObject.genFileURL("btn_click"),items:[
					{id:"EndBattle",css:cssLib.textFineMid.createCSS([0,-btnPic.h/4,0],textLib["EndBattle"],btnPic.w,btnPic.h/2,1,1,1,1)},
					{id:"NoReduce",css:cssLib.textFineSmall.createCSS([0,btnPic.h/6,0],textLib["NoReduce"],btnPic.w,btnPic.h/3,1,1,1,1)}
				]});

			this.lootGoldBox=cssLib.boxLootBar.create(this.hudTLBox,[60,80,0],"res_gold");
			this.lootOilBox=cssLib.boxLootBar.create(this.hudTLBox,[60,120,0],"res_oil");

			var dw=200, dh=110, s=48;
			var starImg=imgLib.getImg("pic_star_dark");
			var sw=starImg.w>>1,sh=starImg.h>>1;
			this.dmgRateBox=this.hudBLBox.appendNewChild({type:"shape",id:"dmgRateBox",pos:[0,60,0],w:dw,h:dh,items:[
				{id:"tip",type:"text",css:cssLib.textFineMid.createCSS([0,0,0],textLib["TotalDmg"],dw,20,0,0,1,1)},
				{id:"sd1",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[((dw-s)/2-s)+sw,((dh-55)/2)+sh,0],anchor_v:1,anchor_h:1},
				{id:"sd2",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[((dw-s)/2)+sw,((dh-55)/2)+sh,0],anchor_v:1,anchor_h:1},
				{id:"sd3",type:"icon",css:imgLib.getImg("pic_star_dark"),w:s,h:s,pos:[((dw-s)/2+s)+sw,((dh-55)/2)+sh,0],anchor_v:1,anchor_h:1},
				{id:"s1",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[((dw-s)/2-s)+sw,((dh-55)/2)+sh,0],anchor_v:1,anchor_h:1},
				{id:"s2",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[((dw-s)/2)+sw,((dh-55)/2)+sh,0],anchor_v:1,anchor_h:1},
				{id:"s3",type:"icon",css:imgLib.getImg("pic_star"),w:s,h:s,display:0,pos:[((dw-s)/2+s)+sw,((dh-55)/2)+sh,0],anchor_v:1,anchor_h:1},
				{id:"num",type:"text",css:cssLib.textFineBig.createCSS([0,dh-30,0],"0%",dw,35,0,0,1,1)},
			]});

			this.tipsText=cssLib.textFineMid.create(this.hudBCBox,[this.hudBCBox.getW()>>1,100,0],textLib.BattleTips,this.hudBCBox.getW(),20,1,1,1,1,[255,255,255]);


			//下面这些按钮是为调试增加的:
			this.dbBtnOpen=cssLib.btnDebug.create(this.hudDBDock,">",[224,appEnv.scrSize[1]/2,0],50,appEnv.appKeys.debugSwitch);

			this.dbBtnLoadStage=cssLib.btnDebug.create(this.hudDBBox,"Load stage",[100,50,0],180,appEnv.appKeys.debugLoadStage);
			this.dbBtnLoadCookieStage=cssLib.btnDebug.create(this.hudDBBox,"Load cookie stage",[100,100,0],180,appEnv.appKeys.debugLoadCookieStage);
			this.dbBtnLoadStage=cssLib.btnDebug.create(this.hudDBBox,"Load replay",[100,150,0],180,appEnv.appKeys.debugLoadReplay);
			this.dbBtnSaveReplay=cssLib.btnDebug.create(this.hudDBBox,"Save replay",[100,200,0],180,appEnv.appKeys.debugSaveReplay);
			this.dbBtnExit=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.debugExit);

			this.debugTime=cssLib.textMid.create(this.hudDBBox,[100,20,0],"0d 0h 0m 0s",180,20,1,1,0,1,[255,128,0]);
		}
		if(this.isGuides)
		{
			this.endBattleBtn.setDisplay(0);
		}
		items=[];

		savedTxt=page.getCookie("Runtime","PveStage");
		page.setCookie("Runtime","PveStage","",0);
		if(savedTxt)
		{
			gameVO=fromJSON(savedTxt);
			/*
			gameVO={
				oppCity:{instances:[{id:1,c:"TownHall",l:1,s:0,sg:[{t:"Gold",m:1000,c:1000}],u:[],pos:{x:15,y:15},sbf:0}],scoreBuildingNum:1},
				selfUnits:[{icon:"",codename:"UntMarine",level:1,num:999,},{icon:"",codename:"UntSniper",level:1,num:999,},{icon:"",codename:"UntHacker",level:1,num:999}],
				clanUnits:[]
			};
			*/
			if(gameVO)
			{
				this.page.vwPveStage.proxyBattle(gameVO);
				vo=this.page.vwPveStage.battleInfo;
				stage.initCityBlds();
				list=vo.units;
				this.LvBox.setLvName(vo.oppCity.level,vo.oppCity.name);
			}
		}
		if(!gameVO)
		{
			list=[
			{codename:"UntMarine1",num:100,level:1,group:1},{codename:"UntSniper1",num:100,level:1,group:1},{codename:"UntHacker1",num:999,level:1,group:1},
			{codename:"UntCyber1",num:999,level:1,group:1},{codename:"UntTNTMac1",num:999,level:1,group:1},
			{codename:"UntChop1",num:999,level:1,group:1},{codename:"UntPEKKA1",num:999,level:1,group:1},{codename:"UntTank1",num:999,level:1,group:1},{codename:"UntAvenger1",num:999,level:1,group:1}
			];
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
			this.page.vwPveStage.curUnitGroup=this.lbItems.itemAt(0).unitGroup;
			stage.curUnitNum=this.lbItems.itemAt(0).unitNum;
			stage.curUnitUnits=this.lbItems.itemAt(0).unitUnits;
		}
		else
		{
			stage.curUnitIdx=-1;
			stage.curUnitExvo=null;
		}

		this.lootGoldBox.bindValue(stage.level,stage.resIdx.Gold,0,1,": ","/"+page.appEnv.textLib.digiGapText(stage.allRes[stage.resIdx.Gold]));
		this.lootOilBox.bindValue(stage.level,stage.resIdx.Elixir,0,1,": ","/"+page.appEnv.textLib.digiGapText(stage.allRes[stage.resIdx.Elixir]));

		this.speedBtn.setDisplay(0);
		stage.setAlarmRange(null,null,-1);
	};

	//--------------------------------------------------------------------------
	//改变模式状态的函数
	//--------------------------------------------------------------------------
	{
		__Page.statePve.showBldMenu=function(hotId)
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

		__Page.statePve.hideBldMenu=function(hotId)
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
		__Page.statePve.onKey=function(msg,key,way,extra)
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

						this.page.vwPveStage.level.load(savedVO);
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
					Dialogs.saveToFile(toJSON(this.page.vwPveStage.level.getBattleLog()),["*.js","*.*"]);
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
			//DBOut("statePve.onKey: "+msg+", "+key);
			if(ret)
				return ret;
		};

		__Page.statePve.onItemClk=function(msg,key,way,extra)
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
					this.page.vwPveStage.curUnitIdx=this.lbItems.itemAt(extra).unitDefIdx;
					this.page.vwPveStage.curUnitExvo=this.lbItems.itemAt(extra).exvo;
					this.page.vwPveStage.curUnitGroup=this.lbItems.itemAt(extra).unitGroup;
					this.page.vwPveStage.curUnitNum=this.lbItems.itemAt(extra).unitNum;
					this.page.vwPveStage.curUnitUnits=this.lbItems.itemAt(extra).unitUnits;

					if(this.lbItems.itemAt(extra).exvo && !this.page.vwPveStage.curUnitNum)
					{
						this.stage.setMechColorFlash(this.lbItems.itemAt(extra).exvo.uid,1);
						this.showSkill(this.lbItems.itemAt(extra).exvo.skill);
					}else
						this.showSkill();
				}
			}
		};


		__Page.statePve.showSkill=function(skl)
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

		__Page.statePve.onSkillItemClk=function(msg,key,way,extra)
		{
			if(msg==2 && way==1 && -1!=extra)
			{
				var stage,item;
				stage=this.stage;
				item=this.skItems.itemAt(extra);

				if(stage.curUnitExvo && stage.curUnitExvo.skill)
				{
					if(item.num<=0)return;
					this.setPlayTimeShow();
					item.num--;
					stage.curUnitExvo.skill[extra].num--;
					if(!item.num)item._setEnabled(0);
					stage.putDownMechSkill(stage.curUnitExvo.skill[extra].codename,stage.curUnitExvo.skill[extra].level);
				}
			}
		};
		__Page.statePve.checkControlCD=function()
		{
			var cdHud,val;
			cdHud=this.lbItems.itemAt(this.curUnitLBIdx).getItemById("cdBar");
			if(!cdHud)return 0;
			val=cdHud.getValue();
			return val?0:1;
		};

		__Page.statePve.resetControlCD=function()
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

		__Page.statePve.putDownUnit=function()
		{
			var item;
			item=this.lbItems.itemAt(this.lbItems.getCheckItemId());
			if(item)
			{
				this.setPlayTimeShow();
				item.putDown();
				this.page.vwPveStage.curUnitNum=item.unitNum;

				if(this.stage.curUnitExvo && !this.stage.curUnitNum)
					this.showSkill(this.stage.curUnitExvo.skill);
			}
		};

		__Page.statePve.setPlayTimeShow=function()
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
				appEnv.showPlayTimeCheck(1);
			},this);
		};
		__Page.statePve.clearChecker=function()
		{
			this.appEnv.showPlayTimeCheck(0);
			if(this.checkTimer)
			{
				clearTimeout(this.checkTimer);
				this.checkTimer=null;
			}
		};

		__Page.statePve.onBuildingClk=function(msg,key,way,extra)
		{
		};

		//管理Power，目前暂时用作Update。。。
		__Page.statePve.onPowerClk=function(msg,key,way,extra)
		{
		};

		//管理库存，目前暂时用作测试建造建筑
		__Page.statePve.onStoreClk=function(msg,key,way,extra)
		{
		};

		__Page.statePve.onCaravanClk=function(msg,key,way,extra)
		{
		};

		__Page.statePve.onSpeedClk=function(msg,key,way,extra)
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
			self.page.vwPveStage.level.load(savedVO);
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
			self.page.vwPveStage.level.loadReplay(savedVO);
		};
		__Page.statePve.logicUpdate=function()
		{
			var stage=this.page.vwPveStage;

			stage.getBattleLog();
			if(!this.endTimer && stage.deadRate < 100)
			{
				this.aboutUpdateLUDT(20*1000,this.updateLUDT);
			}
		};
		__Page.statePve.aboutTimerLUDT=function(time,fun)
		{
			if(this.timerLUDT)
			{
				this.appEnv.layer.clearTimeout(this.timerLUDT);
				this.timerLUDT=null;
			}
			if(fun)
				this.timerLUDT=this.appEnv.layer.setTimeout(time,fun,this);
		};
		__Page.statePve.aboutUpdateLUDT=function(time,fun)
		{
			if(this.updateLUDT)
			{
				this.appEnv.layer.clearTimeout(this.updateLUDT);
				this.updateLUDT=null;
			}
			if(fun)
				this.updateLUDT=this.appEnv.layer.setTimeout(time,fun,this);
		};
		__Page.statePve.onEndBattleClk=function(msg,key,way,extra)
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
		__Page.statePve._onEndBattleClk=function(abort)
		{
			if(!abort)
			return;
			var stage=this.page.vwPveStage;
			if(stage.state==0)
			{
				this.go2Home();
			}else if(stage.state==1){
				stage.state=2;
				stage.getBattleLog();
			}

		};
		__Page.statePve.go2Home=function()
		{
			var stage=this.page.vwPveStage;
			stage.setNavBoxRangeByScale(1);
			this.appEnv.addScale(stage.gameHud,[1,1,1],[0.8,0.8,1]);
			this.appEnv.showSearchAni(function(){
				if(this.isGuides)
				{
					this.page.setCookie("Runtime","StartGame","GuideLoad",0);
					switchApp(this.page.genPageURL((window.aisNTEngine)?"ui_guide.jml":"ui_single_guide.jml"));
					return;
				}
				if(window.aisNTEngine)
				{
					var time=0;
					window.aisNTEngine.execFakeCmd(null,"Return_Home",{callBack:this._go2Home,callObj:this},null,time);
				}
			},this);
		};

		__Page.statePve._go2Home=function(svrvo)
		{
			if(svrvo)
			{
				//this.page.setCookie("Runtime","Save",toJSON(svrvo),0);
				this.appEnv.saveCityVO(svrvo,"Save");
			}
			this.page.setCookie("Runtime","StartGame","Load",0);
			switchApp(this.page.genPageURL("ui_ais.jml"));
		};

		__Page.statePve.reSet=function()
		{
			var stage=this.page.vwPveStage;
			this.endTimer=0;
			this.tipsText.setDisplay(1);
			this.lbItems.clearItems();

			stage.reSet();
			this.onGameLoaded(1);
		};

		__Page.statePve.giveStar=function()//展示获得星级
		{
			var star,stage=this.page.vwPveStage,hud,appEnv=this.page.appEnv;
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

		__Page.statePve.refreshDmgRate=function()//刷新完成比例
		{
			var rate,stage=this.page.vwPveStage;
			rate=Math.floor(stage.deadRate);
			this.dmgRateBox.getItemById("num")._setText(rate+"%");
			return rate;
		};

		__Page.statePve.remainRes=function()
		{
			return [{type:"Res_Gold",num:this.lootGoldBox._getScore()},{type:"Res_Oil",num:this.lootOilBox._getScore()}];
		};

		__Page.statePve.showSettlement=function()//结算界面
		{
			this.appEnv.layer.setUPF(this.upf);
			this.speedBtn.setDisplay(0);
			this.appEnv.closePmtDlg();
			this.endBattleBtn.setDisplay(0);
			this.lbItems.setDisplay(0);
			this.hudBBox.setDisplay(0);
			this.lootGoldBox.setDisplay(0);
			this.lootOilBox.setDisplay(0);
			this.dmgRateBox.setDisplay(0);

			this.clearChecker();
			var url;
			url=this.page.genPageURL("ui/dlg/dlg_battleover.jml");
			this.appEnv.openPageDlg(url,this);
		//	this.go2Home();
		};
		//获得星级  stage.star
		//获得完成百分比 Math.floor(stage.deadRate)
		//获得掠夺资源  this.remainRes()
		//获得放出去的兵 stage.cmdUnits
	}
}
