if(!__Page.dlgTrainInfo)
{
	__Page.dlgTrainInfo=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgTrainInfo.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//兵种图标区域
		pic=imgLib.getIcon("chr_UntMarine",128);
		var picW=this.picW=pic.w*2;
		picW=357;
		var picH=this.picH=pic.h*2;
		picH=357;
		var picX=this.picX=cntInner[0]+357/2+15;
		var picY=this.picY=cntInner[1]+357/2;
	//	pic=imgLib.getImg("bld_TownHall_b");
		this.picFieldCSS={id:"picField",type:"icon",pos:[picX,picY,0],w:picW,h:picH,anchor_h:1,anchor_v:1,
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
		var descY=this.descY=cntH-cntInner[1]-descH/2;
		this.descCSS={id:"descTxt",type:"text",pos:[descX,descY,0],w:descW-100,h:descH,anchor_h:1,anchor_v:1,align_h:0,align_v:1,font_size:FS.L,wrap:1,color_r:10,color_g:10,color_b:10};
		//兵种属性说明区域
		var attrW=this.attrW=statusW;
		var attrH=this.attrH=cntH-cntInner[1]*2-statusH-descH;
		var attrX=this.attrX=statusX;
		var attrY=this.attrY=statusY+statusH;
		this.attrFieldCSS={id:"attrField",type:"icon",pos:[attrX,attrY,0],w:attrW,h:attrH};
	};
	__Page.dlgTrainInfo.init=function(appEnv)
	{
		this.name="dlgTrainInfo";
		this.viewId="dlgTrainInfo";
		this.slotVsn=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgTrain;
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
	__Page.dlgTrainInfo.enter=function(preState,vo)
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
		//DBOut(toJSON(this.infoVO));
		if(vo)
		{
			homeDlg.dlgTitle._setText(vo.name);
			this.descTxt.setText(vo["desc"]);

			this.picObj.setTexURL(imgLib.genIconPath("icon_"+vo.icon+"512_32"));
			this.initUI();
			if("UntDoctor"==vo.codeName)//Q博士添加小兵信息
			{
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onMoreInfoClk);
				this.moreInfoBtn=this.cntBox.appendNewChild({css:cssLib.btnInfo.createCSS([this.descCSS.pos[0]+this.descCSS.w/2+30,this.descCSS.pos[1],0],keyid)});
			}
		}
		this.appEnv.hudIn(this.cntBox,5);
	};
	__Page.dlgTrainInfo.leave=function(nextState)
	{
		var i,list,n;
		this.appEnv.hudOut(this.cntBox,5);
		this.statusField.removeAllChild();
		this.attrField.removeAllChild();
		if(this.moreInfoBtn)
		{
			this.cntBox.removeChild(this.moreInfoBtn);
		}
	};
	__Page.dlgTrainInfo.initUI=function()
	{
		var vo=this.infoVO, textLib=this.appEnv.textLib;
		var level=aisGame.king.getUnitLevel(vo.codeName);
		this.homeDlg.dlgTitle._setText(vo.name+textLib.getTextEx("GetLevel",{lv:level+1}));
		var curLv=vo.levels[level];
		var maxLv=vo.levels[vo.levels.length-1];
		var costTime=textLib.getTimeText(curLv.cost.time);
		var resCost={ResOil:"oil",ResGold:"gold",ResGem:"gem",ResCube:"cube"};
		var resType,num,maxNum;
		if(curLv.cost.gem)
		{
			resType="ResGem";
			num=curLv.cost.gem;
			maxNum=maxLv.cost.gem;
		}else
		{
			resType=curLv["cost"]["storage"][0]["type"];
			num=curLv["cost"]["storage"][0]["num"];
			maxNum=maxLv["cost"]["storage"][0]["num"];
		}
		var dmg=curLv["attack"];
		this.infos=[
			{name:dmg>0?"DmgPerSec":"HealPerSec", icon:"cap_dmg", cur:Math.abs(curLv["attack"]), max:Math.abs(maxLv["attack"])},
			{name:"HP", icon:"cap_hp", cur:curLv["hp"], max:maxLv["hp"], next:-1},
			//若造兵需要消耗多种资源，则需要修改此处
			{name:"TrainingCost", icon:"res_"+resCost[resType], cur:num, max:maxNum},
		];
		if("UntDoctor"==vo.codeName)//Q博士添加招募数量-目前是写死的
		{
			var curMaxNum;
			if(0==level)//目前只有两个级别 最大招募数量分别为6、8
				curMaxNum=6;
			else if(1==level)
				curMaxNum=8;
			this.infos.push({name:"MaxRecruitNum",icon:"cap_recruit",cur:curMaxNum,max:8});
		}
		this.initInfoBar();
		this.attr={"DmgFavor":vo.favor, "DmgType":vo.dmg_type, "DmgTarget":vo.target, "HousingSpace":vo.storageSize, "TrainingTime":costTime, "MovementSpeed":vo.move};
		this.initAttrText();
	};
	__Page.dlgTrainInfo.initInfoBar=function()
	{
		var i, list=this.infos;
		var x, y, gap=2, barCSS, iconH;
		iconH=list.length>=4?40:64;
		var h=iconH+gap*2;
		var by;
		by=(this.statusH-h*list.length)/2+h/2;
		var barW=this.page.cssLib.boxStatusBar.w;
		x=this.statusW-(barW/2+10);
		for(i=0; i<list.length; i++)
		{
			y=by+h*i;
			this.page.cssLib.boxStatusBar.create(this.statusField,[x,y,0],list[i].name,list[i].icon,list[i].cur,list[i].max,list[i].next,list[i].spd);
		}
	};
	__Page.dlgTrainInfo.initAttrText=function()
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
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgTrainInfo.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgTrainInfo.onCloseClk=function(msg,key,way,extra)
		{
			return this.homeDlg.onCloseClk(msg,key,way,extra);
		};
		
		__Page.dlgTrainInfo.onMoreInfoClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var level,cocDefName,game,defIdx,cocDef,defLib,def;
				level=aisGame.king.getUnitLevel(this.infoVO.codeName);
				cocDefName=this.infoVO.levels[level].cocDefName;
				game=this.page.vwHomeStage.game;
				defIdx=game.level.getObjDefIdx(cocDefName);
				cocDef=this.page.vwHomeStage.objDefs[defIdx];
				cocDefName=cocDef._summon.unit_def;
				defIdx=game.level.getObjDefIdx(cocDefName);
				cocDef=this.page.vwHomeStage.objDefs[defIdx];
				defLib=window.aisEnv.defLib.unit;
				def=defLib[cocDef.codename];
				this.appEnv.switchDlg(this.dlgPage.dlgMiniUnitInfo,0,{def:def,homeDef:this.infoVO});
			}
		};
	}
}
