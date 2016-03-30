if(!__Page.dlgResearchInfo)
{
	__Page.dlgResearchInfo=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgResearchInfo.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//兵种图标区域
		pic=imgLib.getIcon("chr_UntMarine",128);
		var picW=this.picW=357;//pic.w*2;
		var picH=this.picH=357;//pic.h*2;
		var picX=this.picX=cntInner[0]+357/2+15;
		var picY=this.picY=cntInner[1]+357/2;
		var spellW=this.spellW=256;//210;
		var spellH=this.spellH=256;//210;
	//	pic=imgLib.getImg("bld_TownHall_b");
		this.picFieldCSS={id:"picField",type:"icon",pos:[picX,picY,0],w:picW,h:picH,anchor_h:1,anchor_v:1,
			items:[
				{id:"pic-bg",type:"div3x3",pos:[0,0,0],w:spellW,h:spellH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_shopitem"),display:0},
				{id:"pic-obj",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic,w:picW,h:picH,filter:0}
			]
		};
		//兵种状态条区域
		pic=imgLib.getImg("pic_backlight");
		var statusX=this.statusX=cntInner[0]+picW+dt-35;
		var statusY=this.statusY=cntInner[1];
		var statusW=this.statusW=cntW-cntInner[0]*2-picW-dt;
		var statusH=this.statusH=pic.h;
		this.statusFieldCSS={id:"statusField",type:"icon",pos:[statusX,statusY,0],w:statusW,h:statusH};
		//兵种描述区域
		var descW=this.descW=cntW-40;
		var descH=this.descH=60;
		var descX=this.descX=cntW/2;
		var descY=this.descY=cntH-cntInner[1]-descH/2;
		this.descCSS={id:"descTxt",type:"text",pos:[descX,descY,0],w:descW,h:descH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,font_size:FS.L};
		//兵种属性说明区域
		var attrW=this.attrW=statusW;
		var attrH=this.attrH=cntH-cntInner[1]*2-statusH-descH;
		var attrX=this.attrX=statusX;
		var attrY=this.attrY=statusY+statusH;
		this.attrFieldCSS={id:"attrField",type:"icon",pos:[attrX,attrY,0],w:attrW,h:attrH};
	};
	__Page.dlgResearchInfo.init=function(appEnv)
	{
		this.name="dlgResearchInfo";
		this.viewId="dlgResearchInfo";
		this.slotVsn=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgResearch;
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);

		var keyid, w;
		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({css:[this.contentFieldCSS],display:0});

		this.picField=this.cntBox.appendNewChild({css:[this.picFieldCSS]});
		this.picObj=this.picField.getItemById("pic-obj");
		this.picBG=this.picField.getItemById("pic-bg");
		this.statusField=this.cntBox.appendNewChild({css:[this.statusFieldCSS]});
		this.attrField=this.cntBox.appendNewChild({css:[this.attrFieldCSS]});
		this.descTxt=this.cntBox.appendNewChild({css:[this.descCSS]});

		w=this.cntBox.getW()/3;
		keyid=appEnv.hudKeys.getKey(this);
		this.btnGo=cssLib.btnResListGo.create(this.cntBox,[w*2,this.cntBox.getH()-50,0],240,"gold",1000,1,keyid);
		this.regKeyVO(keyid,this,this.onGoClk);
	};
	__Page.dlgResearchInfo.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg;
		var def,level,king,city,tech,res,num,levelDef,bad,costRes;

		//根据VO初始化界面:
		this.infoVO=vo;
		//vo:{def:def,bld:bld}
		if(vo)
		{
			king=aisGame.king;
			city=aisGame.curCity;
			this.aisBld=vo.bld;
			//DBOut("Bld: "+vo.bld);
			def=this.techDef=vo.def;
			tech=king.getTech(def.codeName);
			level=tech?tech.level:0;
			levelDef=def.levels[level];
			this.objDef=king.getUnitByTechCodeName(def.codeName);
			bad=1;
			if(city.checkCost(levelDef.cost,1))
			{
				bad=0;
			}
			if(levelDef.cost.gem)
				costRes="ResGem";
			else
				costRes=levelDef.cost.storage[0].store;
			if(costRes=="Gold")res="gold";
			else if(costRes=="Oil")res="oil";
			else if(costRes=="Cube")res="cube";
			else if(costRes=="ResGem")res="gem";
			if(levelDef.cost.gem)
				num=levelDef.cost.gem;
			else
				num=levelDef.cost.storage[0].num;
			var item_bad=0;
			this.itembad=0;
			var store,costStorage,costItemList=[];
			for(var i=1;i<levelDef.cost.storage.length;i++)
			{
				costStorage=levelDef.cost.storage[i];
				store=window.aisGame.curCity.allStorages[costStorage.store];
				if(!store.checkTakeOut(costStorage))
				{
					item_bad=1;
					this.itembad=1;
				}
				costItemList.push({type:costStorage.type,num:costStorage.num,bad:item_bad});
			}
			if(levelDef.cost.gem)
			{
				if(window.aisGame.king.gemNum<levelDef.cost.gem)
				{
					item_bad=1;
					this.itembad=1;
				}
				costItemList.push({type:"ResGem",num:levelDef.cost.gem,bad:item_bad});
			}
			this.btnGo.setResNum(res,num,bad,costItemList);
			this.btnGo.bad=bad;
			homeDlg.dlgTitle._setText(def.name);

			if(def.codeName.indexOf("Unit")>-1){
				this.picObj.setTexURL(imgLib.genIconPath(def.icon,512));
				this.picObj.setW(this.picW);
				this.picObj.setH(this.picH);
				this.picBG.setDisplay(0);
			}else{
				this.picObj.setTexURL(imgLib.genIconPath(def.icon,256));
				this.picObj.setW(this.spellW);//-10
				this.picObj.setH(this.spellH);//-10
				this.picBG.setDisplay(0);
			}
			var time=levelDef.cost.time;
			var timeW=200, timeH=60;
			this.timeTip=this.picObj.appendNewChild({
				type:"div3x3",id:"timeTip",pos:[0,this.picH/2+timeH/2+20,0],w:timeW,h:timeH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green"),
				items:[
				//	{type:"text",pos:[0,-timeH/4,0],w:timeW,h:timeH/2,anchor_h:1,anchor_v:1,align_h:1,align_v:1,color_r:0,color_g:0,color_b:0,color_a:255,font_size:FS.M,text:"升级时间"},
					{css:cssLib.textFineMid.createCSS([0,-timeH/4,0],textLib["UpgradeTime"],timeW,timeH/2,1,1,1,1)},
				//	{type:"text",pos:[0,timeH/4,0],w:timeW,h:timeH/2,anchor_h:1,anchor_v:1,align_h:1,align_v:1,color_r:255,color_g:255,color_b:255,color_a:255,font_size:FS.X,text:textLib.getTimeText(time)},
					{css:cssLib.textFineSmall.createCSS([0,timeH/4,0],textLib["getTimeText"](time),timeW,timeH/2,1,1,1,1),font_size:22},
				]
			});
			this.initUI();
		}
		this.appEnv.hudIn(this.cntBox,5);
	};
	__Page.dlgResearchInfo.leave=function(nextState)
	{
		var i,list,n;
		this.appEnv.hudOut(this.cntBox,5);
		this.statusField.removeAllChild();
		this.attrField.removeAllChild();
		this.picObj.removeChild(this.timeTip);
	};
	__Page.dlgResearchInfo.initUI=function()
	{
		var vo=this.objDef, textLib=this.appEnv.textLib;
		//DBOut(toJSON(vo));
		var level;
		if("Spell"==vo.type)
			level=aisGame.king.getSpellLevel(vo.codeName);
		else if("Unit"==vo.type)
			level=aisGame.king.getUnitLevel(vo.codeName);
		var curLv,maxLv,nextLv;
		curLv=level;
		maxLv=vo.levels.length-1;
		nextLv=curLv<maxLv?curLv+1:maxLv;
		this.homeDlg.dlgTitle._setText(vo.name+textLib.getTextEx("GetLevel",{lv:nextLv+1}));

		curLv=vo.levels[curLv];
		maxLv=vo.levels[maxLv];
		nextLv=vo.levels[nextLv];

		var costTime=textLib.getTimeText(curLv.cost.time);
		var resCost={ResOil:"oil",ResGold:"gold",ResGem:"gem",ResCube:"cube"};
//		DBOut("curLv:"+toJSON(curLv));
//		DBOut("maxLv:"+toJSON(maxLv));
//		DBOut("nextLv:"+toJSON(nextLv));

		var homeStage=this.page.vwHomeStage;
		var objDefs=homeStage.objDefs;
		var gameLevel=homeStage.game.level;
		var curIdx=gameLevel.getObjDefIdx(curLv.cocDefName);
		var curCocDef=objDefs[curIdx];
		var maxIdx=gameLevel.getObjDefIdx(maxLv.cocDefName);
		var maxCocDef=objDefs[maxIdx];
		var nextIdx=gameLevel.getObjDefIdx(nextLv.cocDefName);
		var nextCocDef=objDefs[nextIdx];
//		DBOut(curLv.cocDefName+",curIdx="+curIdx);
//		DBOut("curCocDef="+curCocDef);
//		DBOut(maxLv.cocDefName+",maxIdx="+maxIdx);
//		DBOut("maxCocDef="+maxCocDef);
//		DBOut(nextLv.cocDefName+",nextIdx="+nextIdx);
//		DBOut("nextCocDef="+nextCocDef);

		var dmg=curLv["attack"];
		if("Unit"==vo.type)
		{
			this.infos=[
				{name:dmg>0?"DmgPerSec":"HealPerSec", icon:"cap_dmg", cur:Math.abs(curLv["attack"]), next:Math.abs(nextLv["attack"]), max:Math.abs(maxLv["attack"])},
				{name:"HP", icon:"cap_hp", cur:curLv["hp"], next:nextLv["hp"], max:maxLv["hp"]},
				//若造兵需要消耗多种资源，则需要修改此处
				{name:"TrainingCost", icon:"res_"+resCost[curLv["cost"]["storage"][0]["type"]], cur:curLv["cost"]["storage"][0]["num"], next:nextLv["cost"]["storage"][0]["num"], max:maxLv["cost"]["storage"][0]["num"]},
			];
			
			if("UntDoctor"==vo.codeName)//Q博士添加招募数量-目前是写死的
			{
				if(0==level)//目前只有两个级别 最大招募数量分别为6、8
					this.infos.push({name:"MaxRecruitNum",icon:"cap_recruit",cur:6,next:6+2,max:8});
				else if(1==level)
					this.infos.push({name:"MaxRecruitNum",icon:"cap_recruit",cur:8,max:8});
			}
			this.attr={"DmgFavor":vo.favor, "DmgType":vo.dmg_type, "DmgTarget":vo.target, "HousingSpace":vo.storageSize, "TrainingTime":costTime, "MovementSpeed":vo.move};
		}
		else if("Spell"==vo.type)
		{
			var curDmg, maxDmg, nextDmg, curBuff=[], maxBuff=[], nextBuff=[];
			if(curCocDef["_combat"])
			{
				curDmg=curCocDef["_combat"]["damage"]*curCocDef["_combat"]["attack_count"];
				maxDmg=maxCocDef["_combat"]["damage"]*maxCocDef["_combat"]["attack_count"];
				nextDmg=nextCocDef["_combat"]["damage"]*nextCocDef["_combat"]["attack_count"];
				if(curCocDef["_combat"]["buff"])
				{
					curBuff=curCocDef["_combat"]["buff"];
					maxBuff=maxCocDef["_combat"]["buff"];
					nextBuff=nextCocDef["_combat"]["buff"];
				}
				DBOut("curDmg:"+curDmg+", maxDmg:"+maxDmg+", nextDmg:"+nextDmg);
			}

			this.infos=[];
			if(curDmg)
				this.infos.push({name:curDmg>0?"TotalDmg":"TotalHeal", icon:curDmg>0?"cap_dmg":"cap_hp", cur:Math.abs(curDmg), max:Math.abs(maxDmg), next:Math.abs(nextDmg)});

			var cur, max, next;
			for(var i=0; i<curBuff.length; i++)
			{
				cur=curBuff[i], max=maxBuff[i], next=nextBuff[i];
				if(0==cur.cmpt)//影响 hp 效果
				{
					if(0==cur.slot)
						this.infos.push({name:"TotalHeal", icon:"cap_hp", cur:cur["factor"]*curCocDef["_combat"]["attack_count"], max:max["factor"]*maxCocDef["_combat"]["attack_count"], next:next["factor"]*nextCocDef["_combat"]["attack_count"]});
					else if(1==cur.slot)
						this.infos.push({name:"AddHP", icon:"cap_hp", cur:cur["factor"], max:max["factor"], next:next["factor"]});
				}
				else if(1==cur.cmpt)//影响移动效果
				{
					if(0==cur.slot)//加速
						this.infos.push({name:"AddSpd", icon:"cap_dmg", cur:cur["factor"], max:max["factor"], next:next["factor"]});
					else if(1==cur.slot)//跳墙
						DBOut("");
				}
				else if(2==cur.cmpt)//影响攻击效果
				{
					this.infos.push({name:"AddAtk", icon:"cap_dmg", cur:cur["factor"], max:max["factor"], next:next["factor"]});
				}
			}
		//	this.infos.push({name:"HP", icon:"cap_hp", cur:curLv["hp"], max:maxLv["hp"]});
			//若造兵需要消耗多种资源，则需要修改此处
			this.infos.push({name:"Cost", icon:"res_"+resCost[curLv["cost"]["storage"][0]["type"]], cur:curLv["cost"]["storage"][0]["num"], max:maxLv["cost"]["storage"][0]["num"], next:nextLv["cost"]["storage"][0]["num"]});

			this.attr={};//"DmgType":vo.dmg_type, "DmgTarget":vo.target, "HousingSpace":vo.storageSize, "TimeToCreate":costTime
			if(curDmg>0)
				this.attr["DmgType"]=vo.dmg_type;
			else if(curDmg<0)
				this.attr["HealType"]=vo.dmg_type;
			else
				this.attr["EffectType"]=vo.dmg_type;
			this.attr["TimeToCreate"]=costTime;
			this.attr["DmgTarget"]=vo.target;
		}
		this.initInfoBar();
		this.initAttrText();
	};
	__Page.dlgResearchInfo.initInfoBar=function()
	{
		var i, list=this.infos;
		var x, y, gap=2, barCSS, iconH;
		iconH=list.length>=4?40:64;
		var h=iconH+gap*2;
		var by=(this.statusH-h*list.length)/2+h/2;
		var barW=this.page.cssLib.boxStatusBar.w;
		x=this.statusW-(barW/2+10);
		for(i=0; i<list.length; i++)
		{
			y=by+h*i;
			this.page.cssLib.boxStatusBar.create(this.statusField,[x,y,0],list[i].name,list[i].icon,list[i].cur,list[i].max,list[i].next,list[i].spd);
		}
	};
	__Page.dlgResearchInfo.initAttrText=function()
	{
		var i, j=0, list=this.attr, textLib=this.appEnv.textLib;
		var gap=2, iconH=64, cnt=6;
		var w=this.page.cssLib.boxStatusBar.w, h=20;
		var by=6;
		var x=this.attrW-w, y;
		for(i in list)
		{
			y=by+h*j;
			this.attrField.appendNewChild({
				type:"icon",id:"attr-"+i,pos:[x,y,0],w:w,h:h,
				items:[
					{type:"text",id:"attr-name",pos:[0,y,0],w:w/2,h:h,anchor_h:0,anchor_v:0,align_h:2,align_v:1,text:textLib[i]+": ",font_size:FS.FM,color_r:76,color_g:117,color_b:4,color_a:255},
					{type:"text",id:"attr-info",pos:[w/2,y,0],w:w/2,h:h,anchor_h:0,anchor_v:0,align_h:0,align_v:1,text:list[i]+"",font_size:FS.FM,color_r:0,color_g:0,color_b:0,color_a:255},
					{type:"div3x3",pos:[w/2,y+30-6,0],w:w-100,anchor_h:1,anchor_v:1,css:this.page.imgLib.getImg("box_green_line")}
				]
			});
		//	this.attrField.appendNewChild();
			j++;
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgResearchInfo.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
		//开始研究按钮被点击
		__Page.dlgResearchInfo.onGoClk=function(msg,key,way,extra)
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
				this.page.vwHomeStage.newCase({tech:this.techDef.codeName});
			}
		};
	}
}
