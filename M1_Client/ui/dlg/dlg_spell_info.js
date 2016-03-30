if(!__Page.dlgSpellInfo)
{
	__Page.dlgSpellInfo=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgSpellInfo.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//兵种图标区域
		pic=imgLib.getIcon("chr_UntMarine",128);
		var picW=this.picW=256;//210;//pic.w*2;
		var picH=this.picH=256;//210;//pic.h*2;
		var picX=this.picX=cntInner[0]+357/2+15;//50+picW/2;
		var picY=this.picY=cntInner[1]+357/2;//70+picH/2;
	//	pic=imgLib.getImg("bld_TownHall_b");
		this.picFieldCSS={id:"picField",type:"icon",pos:[picX,picY,0],w:picW,h:picH,anchor_h:1,anchor_v:1,//css:imgLib.getImg("box_shopitem"),
			items:[{id:"pic-obj",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic,w:picW,h:picH,filter:0}]
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
		var descH=this.descH=80;
		var descX=this.descX=cntW/2;
		var descY=this.descY=cntH-cntInner[1]-descH/2-60;
		this.descCSS={id:"descTxt",type:"text",pos:[descX,descY,0],w:descW-100,h:descH,anchor_h:1,anchor_v:1,align_h:0,align_v:1,font_size:FS.L,wrap:1,color_r:10,color_g:10,color_b:10};
		//兵种属性说明区域
		var attrW=this.attrW=statusW;
		var attrH=this.attrH=cntH-cntInner[1]*2-statusH-descH;
		var attrX=this.attrX=statusX;
		var attrY=this.attrY=statusY+statusH;
		this.attrFieldCSS={id:"attrField",type:"icon",pos:[attrX,attrY,0],w:attrW,h:attrH};
	};
	__Page.dlgSpellInfo.init=function(appEnv)
	{
		this.name="dlgSpellInfo";
		this.viewId="dlgSpellInfo";
		this.slotVsn=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgSpell;
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);

		var keyid;
		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({css:[this.contentFieldCSS],display:0});

		this.picField=this.cntBox.appendNewChild({css:[this.picFieldCSS]});
		this.picObj=this.picField.getItemById("pic-obj");
		this.statusField=this.cntBox.appendNewChild({css:[this.statusFieldCSS]});
		this.attrField=this.cntBox.appendNewChild({css:[this.attrFieldCSS]});
		this.descTxt=this.cntBox.appendNewChild({css:[this.descCSS]});
	};

	__Page.dlgSpellInfo.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg;
		var list,i,n,keyid,btn,css;
		var items,itemx,itemy,item;

		itemx=150;itemy=(appEnv.scrSize[1]-220)/2+10;
		//根据VO初始化界面:
		this.infoVO=vo;
		//DBOut("infoVO="+toJSON(this.infoVO));
		if(vo)
		{
			homeDlg.dlgTitle._setText(vo.name);
			this.descTxt.setText(vo["desc"]);

			this.picObj.setTexURL(imgLib.genIconPath(vo.icon,256));
			this.initUI();
		}
		this.appEnv.hudIn(this.cntBox,5);
	};
	__Page.dlgSpellInfo.leave=function(nextState)
	{
		var i,list,n;
		this.appEnv.hudOut(this.cntBox,5);
		this.statusField.removeAllChild();
		this.attrField.removeAllChild();
	};
	__Page.dlgSpellInfo.initUI=function()
	{
		var vo=this.infoVO, textLib=this.appEnv.textLib;
		var level=aisGame.king.getSpellLevel(vo.codeName);
		this.homeDlg.dlgTitle._setText(vo.name+textLib.getTextEx("GetLevel",{lv:level+1}));
		var curLv=vo.levels[level];
		var maxLv=vo.levels[vo.levels.length-1];
		var costTime=textLib.getTimeText(curLv.cost.time);
		var resCost={ResOil:"oil",ResGold:"gold",ResGem:"gem",ResCube:"cube"};

		var homeStage=this.page.vwHomeStage;
		var objDefs=homeStage.objDefs;
		var gameLevel=homeStage.game.level;
		var curIdx=gameLevel.getObjDefIdx(curLv.cocDefName);
		var curCocDef=objDefs[curIdx];
		var maxIdx=gameLevel.getObjDefIdx(maxLv.cocDefName);
		var maxCocDef=objDefs[maxIdx];
		DBOut(curLv.cocDefName+",curIdx="+curIdx);
		DBOut("curCocDef="+curCocDef);
		DBOut(maxLv.cocDefName+",maxIdx="+maxIdx);
		DBOut("maxCocDef="+maxCocDef);

		var dmg=curLv["attack"];
		var curDmg, maxDmg, curBuff=[], maxBuff=[];
		if(curCocDef["_combat"])
		{
			curDmg=curCocDef["_combat"]["damage"]*curCocDef["_combat"]["attack_count"];
			maxDmg=maxCocDef["_combat"]["damage"]*maxCocDef["_combat"]["attack_count"];
			if(curCocDef["_combat"]["buff"])
			{
				curBuff=curCocDef["_combat"]["buff"];
				maxBuff=maxCocDef["_combat"]["buff"];
			}
			DBOut("curDmg:"+curDmg+", maxDmg:"+maxDmg);
		}
		this.infos=[];
		if(curDmg)
			this.infos.push({name:curDmg>0?"TotalDmg":"TotalHeal", icon:curDmg>0?"cap_dmg":"cap_hp", cur:Math.abs(curDmg), max:Math.abs(maxDmg)});
//----------------------------------------------------------------------------------|
//cmpt:
// 0 为影响 hp 效果
//	slot:
//		0:被施法对象的hp加factor值
//		1:被施法对象的hp乘factor值
//----------------------------------------------------------------------------------|
// 1 为影响移动效果
//	slot:
//		0:被施法对象的速度乘factor值
//		1:被施法对象获得跳墙能力
//----------------------------------------------------------------------------------|
// 2 为影响攻击效果
//	slot:
//		0:被施法对象的攻击力加factor值
//		1:被施法对象的攻击力乘factor值
//----------------------------------------------------------------------------------|
		var cur, max;
		for(var i=0; i<curBuff.length; i++)
		{
			cur=curBuff[i], max=maxBuff[i];
			if(0==cur.cmpt)//影响 hp 效果
			{
				if(0==cur.slot)
					this.infos.push({name:"TotalHeal", icon:"cap_hp", cur:cur["factor"]*curCocDef["_combat"]["attack_count"], max:max["factor"]*maxCocDef["_combat"]["attack_count"]});
				else if(1==cur.slot)
					this.infos.push({name:"AddHP", icon:"cap_hp", cur:cur["factor"], max:max["factor"]});
			}
			else if(1==cur.cmpt)//影响移动效果
			{
				if(0==cur.slot)//加速
					this.infos.push({name:"AddSpd", icon:"cap_spd", cur:cur["factor"], max:max["factor"]});
				else if(1==cur.slot)//跳墙
					DBOut("");
			}
			else if(2==cur.cmpt)//影响攻击效果
			{
				this.infos.push({name:"AddAtk", icon:"cap_dmg", cur:cur["factor"], max:max["factor"]});
			}
		}
	//	this.infos.push({name:"HP", icon:"cap_hp", cur:curLv["hp"], max:maxLv["hp"]});
		//若造兵需要消耗多种资源，则需要修改此处
		this.infos.push({name:"Cost", icon:"res_"+resCost[curLv["cost"]["storage"][0]["type"]], cur:curLv["cost"]["storage"][0]["num"], max:maxLv["cost"]["storage"][0]["num"]});

		this.attr={};//"DmgType":vo.dmg_type, "DmgTarget":vo.target, "HousingSpace":vo.storageSize, "TimeToCreate":costTime
		if(curDmg>0)
			this.attr["DmgType"]=vo.dmg_type;
		else if(curDmg<0)
			this.attr["HealType"]=vo.dmg_type;
		else
			this.attr["EffectType"]=vo.dmg_type;
		this.attr["TimeToCreate"]=costTime;
		this.attr["DmgTarget"]=vo.target;

		this.initInfoBar();
		this.initAttrText();
	};
	__Page.dlgSpellInfo.initInfoBar=function()
	{
		var i, list=this.infos;
		var x, y, gap=2, barCSS, iconH=64;
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
	__Page.dlgSpellInfo.initAttrText=function()
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
			j++;
		}
	//	this.descTxt.setPos([this.descX,y+15+this.descY,0]);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgSpellInfo.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgSpellInfo.onCloseClk=function(msg,key,way,extra)
		{
			return this.homeDlg.onCloseClk(msg,key,way,extra);
		};
	}
}
