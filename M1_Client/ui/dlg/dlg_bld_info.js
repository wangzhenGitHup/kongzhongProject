if(!__Page.dlgBldInfo)
{
	__Page.dlgBldInfo=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,2);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgBldInfo;
	__Page.dlgBldInfo.loadConfig=function()
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
		this.subCntTxtCSS={id:"subCntTxt",type:"text",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,anchor_v:1,align_h:0,align_v:0,wrap:1,font_size:FS.M,color_r:10,color_g:10,color_b:10};
	};
	__Page.dlgBldInfo.init=function(appEnv)
	{
		this.name="dlgBldInfo";
		this.viewId="dlgBldInfo";
		this.page.dlgBase.prototype.init.call(this,appEnv);
	};
	__Page.dlgBldInfo.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;
		textLib=aisEnv.textLib;
		var list,i,n,title;
		var bld,def;

//		window.aisGame.king.gemNum=9999999;
		//根据VO初始化界面:
		this.infoVO=vo;
//		for(var i in vo)DBOut(i+"---"+vo[i]);
//		for(var i in vo.cocBld)DBOut(i+"==="+vo.cocBld[i]);//homeBld,aisBld
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
			if(this.cityStorage){//"Camp","OilTank","GoldVault","CubeCan
				this.storage=this.cityStorage;
			}else if(this.tgtStorage){//"OilWell","GoldMine" | "SpellLab" | "Barrack" | "CubeWork"
				this.storage=this.tgtStorage;
			}else{//"ClanBld","Fort"
				this.storage=window.aisGame.curCity.clanStorage;
			}
			this.dlgTitle._setText(this.curLevel.name);
			if(window.aisGame.bVisit)
				this.dlgTitle._setText("");
		//	this.timer=setFrameout(window.DelayLoad,function(){
			appEnv.setDlgAniCall(function(){
				this.picField=this.cntBox.appendNewChild({css:[this.picFieldCSS]});
				this.picObj=this.picField.getItemById("pic-obj");
				this.statusField=this.cntBox.appendNewChild({css:[this.statusFieldCSS]});
				this.subCntField=this.cntBox.appendNewChild({css:[this.subCntFieldCSS]});
				this.subText=this.subCntField.appendNewChild({css:[this.subCntTxtCSS]});

				this.initUI();
				this.timer=null;
			},this,0,"Wall"==this.aisDef["codeName"]?1:0);
		}
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};
	__Page.dlgBldInfo.leave=function(nextState)
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
	/*__Page.dlgBldInfo.initUI=function()
	{
		this.infos = {gas:999, gold:888, hp:111,};
		this.initStatus();
		var spd = 60/(60*60*1000);
		var grow = 1;
		var t = this.subCntField.appendNewChild(
				{
					id:"BarText",type:"txt_score",pos:[100,100,0],anchor_h:0,anchor_v:1,align_h:0,align_v:1,w:100,h:20,font_size:12,
					score:0,digit:1,grow:1/25,prefix:"前缀",postfix:"后缀",value_type:1,
					edge:1,egde_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:241,color_b:211,
				//	timer:6,time_pause:0,time_val:100000,count_down:1,msec:0,symb_d:"天",symb_dm:"天",symb_h:"小时",symb_m:"分",symb_s:"秒"
				}
		);
		DBOut(t.getGrowFactor());
		t.setGrowFactor(1);
		t.setScore(1000);
	};*/
	__Page.dlgBldInfo.initUI=function()
	{
		var appEnv=this.appEnv;
		var textLib=this.appEnv.textLib;
		var lVo=this.curLevel;
		if(window.aisGame.bVisit)
		{
			if("FakeOilTank"==this.aisDef.codeName)
			{
				lVo=window.aisEnv.defLib.bld["OilTank"].levels[this.bldLevel];
			}
			else if("FakeGoldVault"==this.aisDef.codeName)
			{
				lVo=window.aisEnv.defLib.bld["GoldVault"].levels[this.bldLevel];
			}
		}
		var name=lVo.name, desc=lVo.desc;
		this.dlgTitle._setText(name);
		this.subText.setText(desc);
	//	this.picObj.setTexURL(this.page.imgLib.getIcon("bld_"+this.aisDef.codeName,128).tex);
		var def=this.aisDef;
		var lv=this.bldLevel;
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
		else if("InfernoMechTower"==codeName)
			codeName="InfernoTower";
		var sprite=def.sprite?def.sprite:("bld_"+codeName+"_"+lv+"_stay001");
		DBOut("sprite="+sprite);
		this.picObj.appendNewChild({type:"coc_sp",id:"item_sp",pos:[0,0,0],game:this.appEnv.cocGameMode,sprite:sprite});

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
				next=0;
				max=maxCombat["damage_per_sec"];
				mdyCur=appEnv.getBldValueByValueName(this.aisBld,"Damage");
				add=mdyCur-cur;
				var curEx=0, nextEx=0, maxEx=0, mdyCurEx=0, addEx=0, phasesLen=0, times=1;
				if(curCombat["phases"])
				{
					times=40/curCombat["reload_time"];
					phasesLen=curCombat["phases"].length;
					cur=curCombat["phases"][0]["damage"]*times;
					next=0*times;
					max=maxCombat["phases"][0]["damage"]*times;
					mdyCur=appEnv.getBldValueByValueName(this.aisBld,"Damage","min")*times;
					add=mdyCur-cur;
					curEx=curCombat["phases"][phasesLen-1]["damage"]*times;
					nextEx=0*times;
					maxEx=maxCombat["phases"][phasesLen-1]["damage"]*times;
					mdyCurEx=appEnv.getBldValueByValueName(this.aisBld,"Damage","max")*times;
					addEx=mdyCurEx-curEx;
				}
				cur+=add;
				max+=add;
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max, curEx:curEx, nextEx:nextEx, maxEx:maxEx, addEx:addEx});
				this.attr={"DmgRange":curCombat["attack_range_min"]?(curCombat["attack_range_min"]+"-"+curCombat["attack_range_max"]+" "+textLib["Tiles"]):(curCombat["attack_range_max"]+" "+textLib["Tiles"]),
					"DmgType":aisDef["dmg_type"], "DmgTarget":aisDef["target"], "DmgFavor":aisDef["favor"],};
			}
			else if(aisDef["mineRes"])//[mineStorage] | "OilWell","GoldMine","CubeWork"
			{
				name="Cap";
				if("ResOil"==aisDef["mineRes"]){
					icon="cap_oil";
				}else if("ResGold"==aisDef["mineRes"]){
					icon="cap_gold";
				}else if("ResGem"==aisDef["mineRes"]){
					icon="cap_gem";
				}else if("ResCube"==aisDef["mineRes"]){
					icon="cap_cube";
				}
				cur=Math.floor(this.aisBld.getValue("mineCurNum"));//this.tgtStorage.getUsedCap();
				next=0;
				max=this.aisBld.getValue("mineMaxNum");//this.tgtStorage.getTotalCap();
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
				name="PrdctRate"
				if("ResOil"==aisDef["mineRes"]){
					icon="cap_oilrate";
				}else if("ResGold"==aisDef["mineRes"]){
					icon="cap_goldrate";
				}else if("ResGem"==aisDef["mineRes"]){
					icon="cap_gemrate";
				}else if("ResCube"==aisDef["mineRes"]){
					icon="cap_cuberate";
				}
				var mult=1;
				if("ResGem"==aisDef["mineRes"]){
					name="PrdctRate24";
					mult=24;
				}
				cur=Math.round(curLevel["mineSpeed"]*60*60*mult);
				next=0*mult;
				max=Math.round(maxLevel["mineSpeed"]*60*60*mult);
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
			}
			else if(aisDef["codeName"]=="SpellLab")//"SpellLab"
			{
				name="CapSpell";
				icon="cap_spell";
				cur=this.tgtStorage.getUsedCap();
				next=0;
				max=this.tgtStorage.getTotalCap();
				this.infos.push({name:name, icon:icon, cur:cur, next:next, max:max});
			}
			else if(aisDef["cityStorage"])//"Camp","OilTank","GoldVault","ClanBld","Fort","CubeCan"
			{
				if("Oil"==aisDef["cityStorage"]){
					name="CapStorage";
					icon="cap_oil";
				}else if("Gold"==aisDef["cityStorage"]){
					name="CapStorage";
					icon="cap_gold";
				}else if("Unit"==aisDef["cityStorage"]){
					name="CapTotalTroop";
					icon="cap_troop";
				}else if("Clan"==aisDef["cityStorage"]){
					name="CapClan";
					icon="cap_troop";
				}else if("Fort"==aisDef["cityStorage"]){
					name="CapTotalTroop";
					icon="cap_troop";
				}else if("Cube"==aisDef["cityStorage"]){
					name="CapStorage";
					icon="cap_cube";
				}
				cur=this.storage.getUsedCap();
				next=0;
				max=this.storage.getTotalCap();
				var showStore=1;
				if("FakeOilTank"==def.codeName || "FakeGoldVault"==def.codeName)
				{
					cur=window.aisGame.curCity.allStorages[aisDef["cityStorage"]].getUsedCap();
					max=window.aisGame.curCity.allStorages[aisDef["cityStorage"]].getTotalCap();
					if(!window.aisGame.bVisit)
						showStore=0;
				}
				if("CubeCan"==def.codeName)
				{
					cur=this.storage.getUsedBaseCap();
				}
				if(showStore)
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
			next=0;
			max=curCoc["hp"]["full"];
			mdyCur=appEnv.getBldValueByValueName(this.aisBld,"Hitpoints");
			add=mdyCur-cur;
			cur+=add;
			max+=add;
			this.infos.push(//"Wall","Barrack","WorkerHut",TechLab
				{name:name, cur:cur, icon:icon, next:next, max:max, spd:curCoc["hp"]["recover_speed"]}
			);
			//"Clan","SpellLab","Camp"需要slot
		}
		this.initInfoBar();
		this.initAttrText();
		this.initStoreLbx();
	};
	__Page.dlgBldInfo.initInfoBar=function()
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
	__Page.dlgBldInfo.initAttrText=function()
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
		this.subText.setPos([this.subCntTxtX,y+15+this.subCntTxtY,0]);
	};
	__Page.dlgBldInfo.initStoreLbx=function()
	{
		if("SpellLab"!=this.aisDef.codeName && "Camp"!=this.aisDef.codeName && "ClanBld"!=this.aisDef.codeName && "Fort"!=this.aisDef.codeName)return;
		var x=this.subCntInner[0], y=this.subCntInner[1], w=this.subCntW-this.subCntInner[0]*2, h=100;
		//初始化仓库信息控件:
		var control=("ClanBld"==this.aisDef.codeName || "Fort"==this.aisDef.codeName)?"boxStorageClan":"boxStorage";
		this.lbStoreInfo=this.page.cssLib[control].create(this.subCntField,[x,y,0],w,this.storage);
		this.subText.setPos([this.subCntTxtX,y+h+this.subCntTxtY,0]);
	};
	__Page.dlgBldInfo.aisUpdateView=function()
	{

	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgBldInfo.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
	}
}
