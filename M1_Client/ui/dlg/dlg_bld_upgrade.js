if(!__Page.dlgBldUpgrade)
{
	__Page.dlgBldUpgrade=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,2);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgBldUpgrade;
	__Page.dlgBldUpgrade.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//建筑图标区域
		pic=imgLib.getImg("pic_backlight");
		var picW=this.picW=pic.w;
		var picH=this.picH=pic.h;
		var picX=this.picX=cntW-cntInner[0]-picW/2-30;
		var picY=this.picY=cntInner[1]+picH/2;
	//	icon=imgLib.getImg("bld_TownHall_b");
		icon=imgLib.getIcon("bld_TownHall",128);
		this.picFieldCSS={id:"picField",type:"icon",pos:[picX,picY,0],css:pic,w:picW,h:picH,anchor_h:1,anchor_v:1,
			items:[{id:"pic-obj",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,}]
		};
		//建筑状态条区域
		var statusX=this.statusX=cntInner[0]+30;
		var statusY=this.statusY=cntInner[1];
		var statusW=this.statusW=cntW-cntInner[0]*2-picW-dt;
		var statusH=this.statusH=picH;
		this.statusFieldCSS={id:"statusField",type:"icon",pos:[statusX,statusY,0],w:statusW,h:statusH};
		//信息区域
		pic=imgLib.getImg("box_dlgcontent");
		var subCntX=this.subCntX=cntInner[0];
		var subCntY=this.subCntY=cntInner[1]+statusH+dt;
		var subCntW=this.subCntW=cntW-cntInner[0]*2;
		var subCntH=this.subCntH=cntH-cntInner[1]*2-statusH-dt;
		this.subCntFieldCSS={id:"subCntField",type:"div3x3",pos:[subCntX,subCntY,0],w:subCntW,h:subCntH,css:pic,ui_event:1,items:[]};
		var subCntInner=this.subCntInner=[pic.mgL,pic.mgU];
		//信息区域内的文字
		var subCntTxtX=this.subCntTxtX=subCntInner[0];
		var subCntTxtY=this.subCntTxtY=subCntInner[1];
		var subCntTxtW=this.subCntTxtW=subCntW-subCntInner[0]*2;
	//	var subCntTxtH=this.subCntTxtH=subCntH-subCntInner[1]*2;
		var subCntTxtH=this.subCntTxtH=10;
		this.subCntTxtCSS={id:"subCntTxt",type:"text",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,align_h:1,align_v:0,wrap:1,font_size:FS.M,color_r:10,color_g:10,color_b:10};
	};
	__Page.dlgBldUpgrade.init=function(appEnv)
	{
		this.name="dlgBldUpgrade";
		this.viewId="dlgBldUpgrade";
		this.page.dlgBase.prototype.init.call(this,appEnv);
	};
	__Page.dlgBldUpgrade.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;
		textLib=aisEnv.textLib;
		var list,i,n,title;
		var bld,def;

		//根据VO初始化界面:
		this.infoVO=vo;
//		for(var i in vo)DBOut(i+"---"+vo[i]);
//		for(var i in vo.cocBld)DBOut(i+"==="+vo.cocBld[i]);
//		for(var i in vo.homeStage.objDefs)DBOut(i+"+++"+vo.homeStage.objDefs[i]);//cocDef集合
//		for(var i in vo.aisBld)DBOut(i+"***"+vo.aisBld);
//		DBOut("vo.aisDef="+toJSON(vo.aisDef));
//		DBOut("vo.cocDef="+toJSON(vo.cocDef));
DBOut("cityStorage:"+vo.aisBld.cityStorage);//仓库、操场、联盟
DBOut("subStorage:"+vo.aisBld.subStorage);//仓库、操场、联盟
DBOut("tgtStorage:"+vo.aisBld.tgtStorage);//矿场、兵工厂、实验室
//if(vo.aisBld.cityStorage){
//	for(i in vo.aisBld.cityStorage)DBOut("111  "+i+":"+vo.aisBld.cityStorage[i]);
//}
//if(vo.aisBld.subStorage){
//	for(i in vo.aisBld.subStorage)DBOut("222  "+i+":"+vo.aisBld.subStorage[i]);
//}
//if(vo.aisBld.tgtStorage){
//	for(i in vo.aisBld.tgtStorage)DBOut("333  "+i+":"+vo.aisBld.tgtStorage[i]);
//}
//DBOut(vo.aisBld.subStorage.getUsedCap());
//DBOut(vo.aisBld.subStorage.getTotalCap());
//DBOut(vo.aisBld.slotVsn);
//DBOut(vo.aisBld.mfcSlots);
		if(vo)
		{
			var prefix="";
			this.aisBld=vo.aisBld;
			this.slotVsn=-1;

			this.cocDef=vo.cocDef;
			this.aisDef=vo.aisDef;
			this.bldLevel=vo.aisLevel;
			this.levels=vo.aisDef.levels;

			var len=this.levels.length;
			this.curLevel=this.levels[this.bldLevel];
			this.maxLevel=this.levels[len-1];
			if(this.curLevel.level<this.maxLevel.level)
				this.nextLevel=this.levels[this.bldLevel+1];
			else
				this.nextLevel=this.maxLevel;

			if(this.aisBld.fireMode)prefix="Alt";
			//homeStage:vw_aishomestage
			var objDefs=vo.homeStage.objDefs;
			var gameLevel=vo.homeStage.game.level;
			var nextIdx=gameLevel.getObjDefIdx(prefix+this.nextLevel.cocDefName);
			this.nextCocDef=objDefs[nextIdx];
			var maxIdx=gameLevel.getObjDefIdx(prefix+this.maxLevel.cocDefName);
			this.maxCocDef=objDefs[maxIdx];
		}
		if(this.aisBld)
		{
			bld=this.aisBld;
			bld.addUIView(this);
			this.cityStorage=bld.cityStorage;
			this.subStorage=bld.subStorage;
			this.tgtStorage=bld.tgtStorage;
			if(this.cityStorage){//"Camp","OilTank","GoldVault","ClanBld","Fort","CubeCan"
				this.storage=this.cityStorage;
			}else if(this.tgtStorage){//"OilWell","GoldMine" | "SpellLab" | "Barrack" | "CubeWork"
				this.storage=this.tgtStorage;
			}
			this.dlgTitle._setText(this.nextLevel.name);
		//	this.timer=setFrameout(window.DelayLoad,function(){
			appEnv.setDlgAniCall(function(){
				this.picField=this.cntBox.appendNewChild({css:[this.picFieldCSS]});
				this.picObj=this.picField.getItemById("pic-obj");
				this.statusField=this.cntBox.appendNewChild({css:[this.statusFieldCSS]});
				this.subCntField=this.cntBox.appendNewChild({css:[this.subCntFieldCSS]});
				this.subText=this.subCntField.appendNewChild({css:[this.subCntTxtCSS]});

				this.initUI();
				this.checkBldReq();
				this.timer=null;
			},this,0,"Wall"==this.aisDef["codeName"]?1:0);
		}
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};
	__Page.dlgBldUpgrade.leave=function(nextState)
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
			bld.removeUIView(this);
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};
	__Page.dlgBldUpgrade.initUI=function()
	{
		var appEnv=this.appEnv;
		var cssLib=this.page.cssLib;
		var textLib=this.appEnv.textLib;
		this.dlgTitle._setText(this.nextLevel.name);
	//	this.subText.setText(this.curLevel.desc);
	//	this.picObj.setTexURL(this.page.imgLib.getIcon("bld_"+this.aisDef.codeName,128).tex);
		var def=this.aisDef;
		var lv=this.bldLevel+1;
		if(lv>this.levels.length){
			lv=this.levels.length;
		}
		if(lv<10){
			lv="0"+lv;
		}
		var codeName=def.codeName;
		if("FakeOilTank"==codeName)
			codeName="OilTank";
		else if("FakeGoldVault"==codeName)
			codeName="GoldVault";
		var sprite=def.sprite?def.sprite:("bld_"+codeName+"_"+lv+"_stay001");
		DBOut("sprite="+sprite);
		this.picObj.appendNewChild({type:"coc_sp",id:"item_sp",pos:[0,0,0],game:this.appEnv.cocGameMode,sprite:sprite});
		var time=this.curLevel.cost.time;
		var timeW=200, timeH=60;
		this.timeTip=this.picObj.appendNewChild({
			type:"div3x3",id:"timeTip",pos:[0,this.picH/2-timeH/2,0],w:timeW,h:timeH,anchor_h:1,anchor_v:1,css:this.page.imgLib.getImg("box_green"),
			items:[
			//	{type:"text",pos:[0,-timeH/4,0],w:timeW,h:timeH/2,anchor_h:1,anchor_v:1,align_h:1,align_v:1,color_r:0,color_g:0,color_b:0,color_a:255,font_size:FS.M,text:textLib["UpgradeTime"]},
				{css:cssLib.textFineMid.createCSS([0,-timeH/4,0],textLib["UpgradeTime"],timeW,timeH/2,1,1,1,1)},
			//	{type:"text",pos:[0,timeH/4,0],w:timeW,h:timeH/2,anchor_h:1,anchor_v:1,align_h:1,align_v:1,color_r:255,color_g:255,color_b:255,color_a:255,font_size:FS.X,text:textLib.getTimeText(time)},
				{css:cssLib.textFineSmall.createCSS([0,timeH/4,0],textLib["getTimeText"](time),timeW,timeH/2,1,1,1,1),font_size:22},
			]
		});
		/*********************************************/
		//取资源可能需要调整
		var cost=this.curLevel.cost;
		var costResList=[];
		var costStorage;//cost.storage[0];
		var bad=0,item_bad=0, costRes, costNum;
		this.itembad=0;
		for(var i=0;i<cost.storage.length;i++)
		{
			costStorage=cost.storage[i];
			if(costStorage)
			{
				var store=window.aisGame.curCity.allStorages[costStorage.store];
				/**
				if(store)
				{
					if(!store.checkTakeOut(costStorage))
					{
						bad=1;
					}
				}
				/**/
				if("Item"==costStorage.store)
				{
					costRes=costStorage.type;
					if(!store.checkTakeOut(costStorage))
					{
						this.itembad=1;
						item_bad=1;
					}
				}else
					costRes=nameFormat(costStorage.store);
				costNum=costStorage.num;
			}
			if(!this.page.vwHomeStage.checkCost(cost,0))
			{
				bad=1;
			}
			costResList.push({type:costRes,num:costNum,bad:item_bad});
		}
		if(cost.cash)
		{
			costRes="chip";
			costNum=cost.cash;
		}
		else if(cost.gem)
		{
			costRes="gem";
			costNum=cost.gem;
		}else if(cost.storage[0])
		{
			costRes=costResList[0].type;
			costNum=costResList[0].num;
			costResList.shift();
		}
		var cssBtnGo=cssLib.btnResGo, btnW=240;
		this.reqBox=this.subCntField.appendNewChild({type:"shape",pos:[this.subCntW/2,this.subCntH-43,0],w:this.subCntW,h:cssBtnGo.h,anchor_h:1,anchor_v:1,
			face_r:200,face_g:20,face_b:20,face_a:255,display:0,items:[
			{id:"txt",css:cssLib.textFineMid.createCSS([btnW/2+10,0,0],"???",this.subCntW/2-btnW/2-30,cssBtnGo.h,0,1,1,1,[211,211,211,255],1)}
		]});
		var keyid=this.appEnv.hudKeys.getKey(this);
		this.btnGo=cssLib.btnResListGo.create(this.subCntField,[this.subCntW/2,this.subCntH-43,0],btnW,costRes,costNum,bad,keyid);
		this.btnGo.setResNum(costRes,costNum,bad,costResList)
		this.regKeyVO(keyid,this,this.onGoClk);
		/*********************************************/
		var resCost={ResOil:"oil",ResGold:"gold",ResGem:"gem"};
		var curCoc=this.cocDef, nextCoc=this.nextCocDef, maxCoc=this.maxCocDef;
		var curLevel=this.curLevel, nextLevel=this.nextLevel, maxLevel=this.maxLevel;
		var aisDef=this.aisDef;
		{
			var curCombat, nextCombat, maxCombat, name, icon, cur, next, max, mdyCur, add, combatStr="_combat";
			this.infos=[];
			if(curCoc["_empower"])
				combatStr="_empower";
			else if(curCoc["_multi_target"])
				combatStr="_multi_target";
			curCombat=curCoc[combatStr];
			nextCombat=nextCoc[combatStr];
			maxCombat=maxCoc[combatStr];
			if(curCombat && (curCombat["damage"] || curCombat["phases"]))//"Cannon","Tower","Motar","RocketTower","AATower","LaserTower","RGunTower"
			{
				name="DmgPerSec";
				icon="cap_dmg";
				cur=curCombat["damage_per_sec"];
				next=nextCombat["damage_per_sec"];
				max=maxCombat["damage_per_sec"];
				mdyCur=appEnv.getBldValueByValueName(this.aisBld,"Damage");
				add=mdyCur-cur;
				var curEx=0, nextEx=0, maxEx=0, mdyCurEx=0, addEx=0, phasesLen=0, times=1;
				if(curCombat["phases"])
				{
					times=40/curCombat["reload_time"];
					phasesLen=curCombat["phases"].length;
					cur=curCombat["phases"][0]["damage"]*times;
					next=nextCombat["phases"][0]["damage"]*times;
					max=maxCombat["phases"][0]["damage"]*times;
					mdyCur=appEnv.getBldValueByValueName(this.aisBld,"Damage","min")*times;
					add=mdyCur-cur;
					curEx=curCombat["phases"][phasesLen-1]["damage"]*times;
					nextEx=nextCombat["phases"][phasesLen-1]["damage"]*times;
					maxEx=maxCombat["phases"][phasesLen-1]["damage"]*times;
					mdyCurEx=appEnv.getBldValueByValueName(this.aisBld,"Damage","max")*times;
					addEx=mdyCurEx-curEx;
				}
				cur+=add;
				max+=add;
				next+=add;
				curEx+=addEx;
				maxEx+=addEx;
				nextEx+=addEx;
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max, curEx:curEx, nextEx:nextEx, maxEx:maxEx, addEx:addEx});
				this.attr={"DmgRange":curCombat["attack_range_min"]?(curCombat["attack_range_min"]+"-"+curCombat["attack_range_max"]+" "+textLib["Tiles"]):(curCombat["attack_range_max"]+" "+textLib["Tiles"]),
					"DmgType":aisDef["dmg_type"], "DmgTarget":aisDef["target"], "DmgFavor":aisDef["favor"],};
			}
			else if(aisDef["mineRes"])//[mineStorage] | "OilWell","GoldMine","CubeWork,"CubeWork"
			{
				name="Cap";
				if("ResOil"==aisDef["mineRes"]){
					icon="cap_oil";
				}else if("ResGold"==aisDef["mineRes"]){
					icon="cap_gold";
				}else if("ResCube"==aisDef["mineRes"]){
					icon="cap_cube";
				}
				cur=curLevel["mineMaxNum"];
				next=nextLevel["mineMaxNum"];
				max=maxLevel["mineMaxNum"];
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
				name="PrdctRate"
				if("ResOil"==aisDef["mineRes"]){
					icon="cap_oilrate";
				}else if("ResGold"==aisDef["mineRes"]){
					icon="cap_goldrate";
				}else if("ResCube"==aisDef["mineRes"]){
					icon="cap_cuberate";
				}
				cur=Math.round(curLevel["mineSpeed"]*60*60);
				next=Math.round(nextLevel["mineSpeed"]*60*60);
				max=Math.round(maxLevel["mineSpeed"]*60*60);
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
			}
			else if(aisDef["codeName"]=="SpellLab")//"SpellLab"
			{
				name="CapSpell";
				icon="cap_spell";
				//这里需要修改
				cur=curLevel["factors"][2]["add"];
				next=nextLevel["factors"][2]["add"];
				max=maxLevel["factors"][2]["add"];
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
			}
			else if(aisDef["cityStorage"] && "FakeOilTank"!=def.codeName && "FakeGoldVault"!=def.codeName)//"Camp","OilTank","GoldVault","ClanBld","Fort","CubeCan"
			{
				if("Oil"==aisDef["cityStorage"]){
					name="CapStorage";
					icon="cap_oil";
					cur=curLevel["factors"][2]["add"];
					next=nextLevel["factors"][2]["add"];
					max=maxLevel["factors"][2]["add"];
				}else if("Gold"==aisDef["cityStorage"]){
					name="CapStorage";
					icon="cap_gold";
					cur=curLevel["factors"][2]["add"];
					next=nextLevel["factors"][2]["add"];
					max=maxLevel["factors"][2]["add"];
				}else if("Unit"==aisDef["cityStorage"]){
					name="CapTotalTroop";
					icon="cap_troop";
					cur=curLevel["factors"][2]["add"];
					next=nextLevel["factors"][2]["add"];
					max=maxLevel["factors"][2]["add"];
				}else if("Clan"==aisDef["cityStorage"]){
					name="CapClan";
					icon="cap_troop";
					cur=curLevel["factors"][2]["add"];
					next=nextLevel["factors"][2]["add"];
					max=maxLevel["factors"][2]["add"];
				}else if("Fort"==aisDef["cityStorage"]){
					name="CapTotalTroop";
					icon="cap_troop";
					cur=curLevel["factors"][2]["add"];
					next=nextLevel["factors"][2]["add"];
					max=maxLevel["factors"][2]["add"];
				}else if("Cube"==aisDef["cityStorage"]){
					name="CapStorage";
					icon="cap_cube";
					cur=curLevel["factors"][2]["add"];
					next=nextLevel["factors"][2]["add"];
					max=maxLevel["factors"][2]["add"];
				}
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
			}
			/**
			else if("TownHall"==aisDef["codeName"])//"TownHall"
			{
				name="CapStorage";
				icon="cap_oil";
				cur=1000;
				next=0;
				max=1000;
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
				icon="cap_gold";
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
			}
			/**/
			name="HP";
			icon="cap_hp";
			cur=curCoc["hp"]["full"];
			next=nextCoc["hp"]["full"];
			max=maxCoc["hp"]["full"];
			mdyCur=appEnv.getBldValueByValueName(this.aisBld,"Hitpoints");
			add=mdyCur-cur;
			cur+=add;
			max+=add;
			next+=add;
			this.infos.push(//"Wall","Barrack","WorkerHut",TechLab
				{name:name, icon:icon, cur:cur, next:next, max:max}
			);
			//"TownHall","Barrack","SpellLab","TechLab"?需要unlock slot
		}
		this.initInfoBar();
		this.initAttrText();
		this.initStoreLbx();
	};
	__Page.dlgBldUpgrade.initInfoBar=function()
	{
		if(!this.infos)return;
		var i, list=this.infos;
		var x, y, gap=2, barCSS, iconH=64;
		var h=iconH+gap*2;
		var by=(this.statusH-h*3)/2+h/2;
		var barW=this.page.cssLib.boxStatusBar.w;
		x=barW/2+10;
		for(i=0; i<list.length; i++)
		{
			y=by+h*i;
			this.page.cssLib.boxStatusBar.create(this.statusField,[x,y,0],list[i].name,list[i].icon,list[i].cur,list[i].max,list[i].next,list[i].spd,
				list[i].curEx,list[i].nextEx,list[i].maxEx,list[i].addEx);
		}
	};
	__Page.dlgBldUpgrade.initAttrText=function()
	{
		if(!this.attr)return;
		var i, j=0, list=this.attr, textLib=this.appEnv.textLib;
		var w=this.subCntW, h=40, lineW=300;
		var by=this.subCntInner[1]/2+6;
		var x=(w-lineW)/2, y;
		for(i in list)
		{
			y=by+h*j+h/2;
			this.subCntField.appendNewChild({
				type:"icon",id:"attr-"+i,pos:[x,y,0],w:lineW,h:h,anchor_h:0,anchor_v:0,
				items:[
					{type:"text",id:"attr-name",pos:[0,0,0],w:lineW,h:h,anchor_h:0,anchor_v:1,align_h:0,align_v:1,text:textLib[i]+": ",font_size:FS.FM,color_r:76,color_g:117,color_b:4,color_a:255},
					{type:"text",id:"attr-info",pos:[lineW,0,0],w:lineW,h:h,anchor_h:2,anchor_v:1,align_h:2,align_v:1,text:list[i]+"",font_size:FS.FM,color_r:0,color_g:0,color_b:0,color_a:255},
					{type:"div3x3",pos:[lineW/2,20-6,0],w:lineW,anchor_h:1,anchor_v:1,css:this.page.imgLib.getImg("box_green_line")}
				]
			});
			j++;
		}
		this.subText.setPos([this.subCntTxtX,y+h+this.subCntTxtY,0]);
	};
	__Page.dlgBldUpgrade.initStoreLbx=function()
	{
		this.getUnlockStorage();
		if(!this.unlockStorage || !this.unlockStorage.slots.length)return;
		var x=this.subCntInner[0]/2, y=this.subCntInner[1], w=this.subCntW-this.subCntInner[0]/2*2, h=100;
		//初始化仓库信息控件:
		this.lbStoreInfo=this.page.cssLib.boxUnlock.create(this.subCntField,[x,y,0],w,this.unlockStorage);
		this.subText.setPos([this.subCntTxtX,y+h+this.subCntTxtY,0]);
	};
	__Page.dlgBldUpgrade.aisUpdateView=function()
	{

	};
	__Page.dlgBldUpgrade.checkBldReq=function()
	{
		var city=window.aisGame.curCity, appEnv=this.appEnv, def;
		var list=this.aisBld.def.levels[this.aisBld.level].req.features;
		if(list.length)
		{
			//DBOut("Upgrade req: "+list);
			list=city.getMissingFeatures(list,1);
			if(list && list.length>0)
			{
				//TODO: 换成字符串表
				def=window.aisEnv.defLib.feature[list[0]];
			//	appEnv.stateLogs.showLog(this.appEnv.textLib["ReqNotMeet"](def.name));
				this.reqBox.setDisplay(1);
				this.reqBox.getItemById("txt").setText(this.appEnv.textLib["ReqNotMeet"](def.name));
				this.btnGo.setEnabled(0);
				this.btnGo.getItemById("ResIcon").setColor([211,211,211,255]);
				return;
			}
		}
	};
	__Page.dlgBldUpgrade.getUnlockStorage=function()
	{
		this.unlockStorage={slots:[]};//{def:aisDef, perSize:1, num:1, slotIdx:"Lightning"}
		//"TownHall","Barrack","SpellLab","TechLab"?需要unlock slot
		var aisDef=this.aisDef, defs;
		if("Barrack"==aisDef["codeName"]){
			defs=aisEnv.defLib.unit;
			this.getUnitUnlock(defs);
		}else if("SpellLab"==aisDef["codeName"]){
			defs=aisEnv.defLib.spell;
			this.getSpellUnlock(defs);
		}else if("TechLab"==aisDef["codeName"]){
		//	defs=aisEnv.defLib.tech;
		}else if("TownHall"==aisDef["codeName"]){
			defs=aisEnv.defLib.bld;
			this.getBldUnlock(defs);
		}
	};
	__Page.dlgBldUpgrade.getUnitUnlock=function(defs)
	{
		var i;
		for(i in defs)
		{
			if("UntMinion"==defs[i]["codeName"] || "UntGolemBomb"==defs[i]["codeName"])
				continue;
			if(defs[i]["bldLvReq"]==this.bldLevel+1)
			{
				this.unlockStorage.slots.push({def:defs[i], num:-1});
			}
		}
	};
	__Page.dlgBldUpgrade.getSpellUnlock=__Page.dlgBldUpgrade.getUnitUnlock;
	__Page.dlgBldUpgrade.getBldUnlock=function(defs)
	{
		var i, j, have, curFactors=this.curLevel["factors"], nextFactors=this.nextLevel["factors"], str="MaxCap", codename, def;
		for(i=0; i<nextFactors.length; i++)
		{
			if(-1==nextFactors[i]["name"].indexOf(str))
				continue;
			have=0;
			codename=nextFactors[i]["name"].substring(str.length);
			//DBOut(codename);
			for(j=0; j<curFactors.length; j++)
			{
				if(nextFactors[i]["name"]==curFactors[j]["name"])
				{
					have=1;
					if(defs[codename])
						this.unlockStorage.slots.push({def:defs[codename], num:nextFactors[i]["add"]-curFactors[j]["add"], isSp:1});
					break;
				}
			}
			if(!have)
			{
				if(defs[codename])
					this.unlockStorage.slots.push({def:defs[codename], num:nextFactors[i]["add"], isSp:1, isNew:1});
			}
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgBldUpgrade.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
		//开始研究按钮被点击
		__Page.dlgBldUpgrade.onGoClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				//TODO: 开始研究
				if(this.itembad)
				{
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["NotEnoughItem"]);
					return;
				}
				this.appEnv.closeDlg(null,null,0);
				setFrameout(1,function(){this.appEnv.prePmtLayer=this.appEnv.layer;},this);
				this.page.vwHomeStage.upgradeBld();
			}
		};
	}
}
