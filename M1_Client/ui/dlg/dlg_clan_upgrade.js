if(!__Page.dlgClanUpgrade)
{
	__Page.dlgClanUpgrade=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,2);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgClanUpgrade;
	__Page.dlgClanUpgrade.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//建筑图标区域
		this.picOffY=16;
		pic=imgLib.getImg("pic_backlight");
		var picW=this.picW=pic.w;
		var picH=this.picH=pic.h;
		var picX=this.picX=cntW-cntInner[0]-picW/2-30;
		var picY=this.picY=cntInner[1]+picH/2;
		icon=imgLib.getIcon("bld_TownHall",128);
		this.picFieldCSS={id:"picField",type:"icon",pos:[picX,picY-this.picOffY,0],css:pic,w:picW,h:picH,anchor_h:1,anchor_v:1,
			items:[{id:"pic-obj",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:icon,w:80,h:80}]
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
		this.subCntTxtCSS={id:"subCntTxt",type:"text",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,align_h:0,align_v:0,wrap:1,font_size:FS.M,color_r:10,color_g:10,color_b:10};
	};
	__Page.dlgClanUpgrade.init=function(appEnv)
	{
		this.name="dlgClanUpgrade";
		this.viewId="dlgClanUpgrade";
		this.page.dlgBase.prototype.init.call(this,appEnv);
	};
	__Page.dlgClanUpgrade.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;
		var list,i,n,title;
		var bld,def;

		//根据VO初始化界面:
		this.infoVO=vo;
	//	if(vo)
		{
			var defLib=window.aisEnv.defLib.clan;
			this.levels=defLib["levels"];
			this.curLv=appEnv.getClanLevel();
			this.maxLv=this.levels.length-1;

			this.curLevel=this.levels[this.curLv];
			this.maxLevel=this.levels[this.maxLv];
			if(this.curLv<this.maxLv)
				this.nextLv=this.curLv+1;
			else
				this.nextLv=this.maxLv;
			this.nextLevel=this.levels[this.nextLv];
			DBOut(this.curLv+" "+this.nextLv);

			this.dlgTitle._setText(textLib.getTextEx("UpgrageClanToLv",{lv:this.nextLv+1}));
			appEnv.setDlgAniCall(function(){
				this.picField=this.cntBox.appendNewChild({css:[this.picFieldCSS]});
				this.picObj=this.picField.getItemById("pic-obj");
				this.statusField=this.cntBox.appendNewChild({css:[this.statusFieldCSS]});
				this.subCntField=this.cntBox.appendNewChild({css:[this.subCntFieldCSS]});
				this.subText=this.subCntField.appendNewChild({css:[this.subCntTxtCSS]});

				this.initUI();
			},this,0,0);
		}
	};
	__Page.dlgClanUpgrade.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		appEnv.clearDlgAniCall();
	};
	__Page.dlgClanUpgrade.initUI=function()
	{
		var appEnv=this.appEnv;
		var cssLib=this.page.cssLib;
		var textLib=appEnv.textLib;
	//	this.subText.setText(this.curLevel.desc);
		this.picObj.setTexURL(this.page.imgLib.genIconPath("badge"+this.page.stateHome.clanInitVO.clanVO.flag,64));
		var def={};
		var timeW=200, timeH=60;
		this.timeTip=this.picObj.appendNewChild({
			type:"div3x3",id:"timeTip",pos:[0,this.picH/2-timeH/2+this.picOffY,0],w:timeW,h:timeH,anchor_h:1,anchor_v:1,css:this.page.imgLib.getImg("box_green"),
			items:[
				{css:cssLib.textFineMid.createCSS([0,-timeH/4,0],textLib["UpgradeTime"],timeW,timeH/2,1,1,1,1)},
				{css:cssLib.textFineSmall.createCSS([0,timeH/4,0],textLib["getTimeText"](0),timeW,timeH/2,1,1,1,1),font_size:22},
			]
		});
		/*********************************************/
		//取资源可能需要调整
		var cost=this.cost=this.nextLevel.exp;
		var bad=0;
		var point=appEnv.getClanPoint();
		if(point<cost)
		{
			bad=1;
		}
		this.bad=bad;
		var cssBtnGo=cssLib.btnResGo, btnW=240;
		this.reqBox=this.subCntField.appendNewChild({type:"shape",pos:[this.subCntW/2,this.subCntH-43,0],w:this.subCntW,h:cssBtnGo.h,anchor_h:1,anchor_v:1,
			face_r:200,face_g:20,face_b:20,face_a:255,display:0,items:[
			{id:"txt",css:cssLib.textFineMid.createCSS([btnW/2+10,0,0],"???",this.subCntW/2-btnW/2-30,cssBtnGo.h,0,1,1,1,[211,211,211,255],1)}
		]});
		var keyid=this.appEnv.hudKeys.getKey(this);
		this.btnGo=cssLib.btnResGo.create(this.subCntField,[this.subCntW/2,this.subCntH-43,0],btnW,"clanexp",cost,bad,keyid);
		this.regKeyVO(keyid,this,this.onGoClk);
		/*********************************************/
		this.infos=[];
		var name="ClanMemberNum";
		var icon="cap_troop";
		var cur=appEnv.getClanMemberMax(this.curLv+1);
		var next=appEnv.getClanMemberMax(this.nextLv+1);
		var max=appEnv.getClanMemberMax(this.maxLv+1);
		this.infos.push(
			{name:name, icon:icon, cur:cur, next:next, max:max}
		);
		this.initInfoBar();
		this.initTechbx();
	};
	__Page.dlgClanUpgrade.initInfoBar=function()
	{
		if(!this.infos)return;
		var i, list=this.infos;
		var x, y, gap=2, barCSS, iconH=64;
		var h=iconH+gap*2;
		var by=(this.statusH-h*3)/2+h/2;
		var barW=this.statusW=this.page.cssLib.boxStatusBar.w;
		x=barW/2+10;
		for(i=0; i<list.length; i++)
		{
			y=by+h*i;
			this.page.cssLib.boxStatusBar.create(this.statusField,[x,y,0],list[i].name,list[i].icon,list[i].cur,list[i].max,list[i].next,list[i].spd);
		}
		this.curY=y+iconH/2+16;
	};
	__Page.dlgClanUpgrade.initTechbx=function()
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var x=10, y=this.curY, w=10, h=36;
		this.unlockTxt=this.statusField.appendNewChild({id:"unlock-text",css:cssLib.textFineMid.createCSS([x,y,0],textLib["UnlockTeck"]+":"),display:0});
		y+=h;
		var iconSize=64, itemW=80, itemH=64, listW=this.statusW, listH=itemH;
		var i=0, icon, unlock=[], items=[], def, subStr="";
		unlock=this.getTechUnlock();
		for(i=0; i<unlock.length; i++)
		{
			icon=unlock[i]["codeName"];
			items.push({type:"icon",pos:[0,0,0],w:iconSize,h:iconSize,css:imgLib.getIcon(icon,64),items:[
				{css:cssLib.textFineSmall.createCSS([iconSize,iconSize,0],"Lv"+unlock[i].level,10,10,2,2,2,2)}
			]});
			def=window.aisEnv.defLib.clanTec[unlock[i].codeName]["levels"][unlock[i].level-1];
			subStr+=(def["name"]+"\n"+def["desc"]+"\n");
			this.unlockTxt.setDisplay(1);
		}
		this.subText.setText(subStr);
		this.lbxTechCSS={type:"listbox",id:"lbx-unlock",pos:[x,y,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1,line_items:items
		};
		this.lbxTech=this.statusField.appendNewChild({css:this.lbxTechCSS});
	};
	__Page.dlgClanUpgrade.getTechUnlock=function()
	{
		var appEnv=this.appEnv;
		var defLib=window.aisEnv.defLib.clan;
		var levels=defLib["levels"];
		var clanLv=appEnv.getClanLevel()+1;
		var maxLv=levels.length-1;
		clanLv=clanLv>maxLv?maxLv:clanLv;
		var levelVO=levels[clanLv];
		var unLockTech=levelVO["unlockTec"];
//		var unlockList=[];
//		unlockList.push({icon:"res_gold",lv:2});
//		unlockList.push({icon:"res_oil",lv:1});
//		unlockList.push({icon:"res_gem",lv:3});
//		unlockList.push({icon:"res_chip",lv:2});
		return unLockTech;
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgClanUpgrade.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
		//开始研究按钮被点击
		__Page.dlgClanUpgrade.onGoClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				//TODO: 开始研究
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(this.bad)
				{
					this.appEnv.stateLogs.showLog(textLib["ClanPointNotEnough"]);
					return;
				}
				var king=window.aisGame.king, city=window.aisGame.curCity;
				var comVO={point:this.cost};
				king.sendNTCmd(city,"ClanUpgrade",comVO,city);
				this.appEnv.stateLogs.showLog(textLib.getTextEx("ClanUpgradeOK",{level:this.nextLv+1}));
				this.appEnv.closeDlg(null,null,0);
			//	setFrameout(1,function(){this.appEnv.prePmtLayer=this.appEnv.layer;},this);
			}
		};
	}
}
