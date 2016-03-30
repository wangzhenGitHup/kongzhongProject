if(!__Page.dlgClanTech)
{
	__Page.dlgClanTech=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgClanTech;
	__Page.dlgClanTech.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;

		var tbX=13, tbY=10, tbW=cntW-tbX*2, tbH=48;
		this.topBoxCSS={id:"top",type:"div3x3",pos:[tbX,tbY,0],w:tbW,h:tbH,css:imgLib.getImg("box_dark"),items:[
			{id:"desc",css:cssLib.textFineSmall.createCSS([tbW/2,tbH/2,0],textLib["TechDesc"],descW,descH,1,1,1,1)},
		]};
		var listX=tbX, listY=tbY+tbH+10, listW=cntW-listX*2, listH=cntH-listY-10;
		var itemW=listW, itemH=126, centerW=itemW, centerH=112, centerX=0, centerY=(itemH-centerH)/2;
		this.listCSS={type:"listbox",id:"lbx-tech",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var lightSize=100, lightX=lightSize/2, lightY=centerH/2;
		var iconSize=64, iconX=lightX, iconY=lightY;
		var lvX=iconX+iconSize/2, lvY=iconY+iconSize/2;
		var btnW=132, btnH=43, btnX=centerW-56-btnW/2, btnY1=10+btnH/2, btnY2=centerH-10-btnH/2, statusY=centerH/2;
		var resX=btnW/2-6, resSize=48, numX=resX-resSize-3;
		var uvInfo={uv3x3:[25/1024,20/1024,22/1024,24/1024],size3x3:[18,15,18,15]};
		var nameX=lightX+lightSize/2+30, nameY=10, nameW=btnX-btnW/2-nameX, nameH=38;
		var descX=nameX, descY=nameY+nameH, descW=nameW, descH=28;
		var timeX=nameX, timeY=descY+descH, timeW=nameW, timeH=22;
		var keyid=0, keyid1=0, keyid2=0, self=this;
		this.gemKeys={};
		this.callKeys={};
	//	window.aisGame.king.gemNum=0;
		this.techLineCSS={
			createCSS:function(vo,svo)
			{
				keyid1=appEnv.hudKeys.getKey(self);
				self.regKeyVO(keyid1,self,self.onGemDoneClk);
				self.gemKeys[keyid1+""]={info:vo};
				keyid2=appEnv.hudKeys.getKey(self);
				self.callKeys[keyid2+""]={info:vo};
				self.regKeyVO(keyid2,self,self.onCallTechClk);
				var status=appEnv.getClanTechStatus(vo["codeName"]);
				var techLv=appEnv.getClanTechLv(vo["codeName"]);
				var levelVO=window.aisEnv.defLib.clanTec[vo["codeName"]]["levels"];
			//	DBOut("******** techLv="+techLv);
				if(techLv)
					levelVO=levelVO[techLv-1];
				else
					levelVO=levelVO[0];
				var statusStr="", timeStr="", color=[255,255,255,255];
				if(-1==status)//未解锁  !techLv
				{
					status=-1;
					statusStr=textLib["Unlocked"];
					color=[255,0,0,255];
					timeStr=textLib["ValidTime"]+textLib.getTimeText(levelVO["expireTime"]*60*60*1000);
				}
				else if(0==status)//号召中
				{
					statusStr=textLib["InCall"];
					color=[255,255,255,255];
					timeStr=textLib["ValidTime"]+textLib.getTimeText(levelVO["expireTime"]*60*60*1000);
				}
				else if(1==status)//已开启  1==status && levelVO.expireTime>window.aisEnv.dateTime()
				{
					statusStr=textLib["InUse"];
					color=[255,255,255,255];
					timeStr=textLib["RemainTime"]+textLib.getTimeText(svo.expireTimes-window.aisEnv.dateTime()+window.aisGame.king.debugTime);
				}
				else if(2==status)//未开启  1==status && levelVO.expireTime<=window.aisEnv.dateTime()
				{
					status=2;
					statusStr="";
					color=[255,255,255,255];
					timeStr=textLib["ValidTime"]+textLib.getTimeText(levelVO["expireTime"]*60*60*1000);
				}
				var statusDisp = 2==status?0:1;
				var btnDisp = 2==status?1:0;
				var bad=0;
				var cost=levelVO["cost"]["gem"];
				var comVO={codeName:vo["codeName"],techLevel:techLv,gem:cost};
				self.gemKeys[keyid1+""]=comVO;
				self.callKeys[keyid2+""]=comVO;
				var gemColor=[255,255,255,255];
				if(cost>window.aisGame.king.gemNum)
				{
					bad=1;
					gemColor=[255,0,0,255];
				}
				var css={type:"icon",pos:[centerX,centerY,0],w:centerW,h:centerH,css:imgLib.getImg("pic_clan_tech"),items:[
					{id:"light",type:"icon",pos:[lightX,lightY,0],w:lightSize,h:lightSize,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_backlight")},
					{id:"icon",type:"icon",pos:[iconX,iconY,0],w:iconSize,h:iconSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon(vo["codeName"],64)},
					{id:"lv",css:cssLib.textFineSmall.createCSS([lvX,lvY,0],"Lv"+(techLv?techLv:1),10,10,2,2,2,2)},
					{id:"name",css:cssLib.textFineMid.createCSS([nameX,nameY,0],levelVO["name"],nameW,nameH,0,0,0,0)},
					{id:"desc",css:cssLib.textFineSmall.createCSS([descX,38,0],levelVO["desc"],descW,38,0,0,0,1),wrap:1,font_size:FS.M},
					{id:"time",css:cssLib.textFineSmall.createCSS([timeX,82,0],timeStr,timeW,timeH,0,0,0,0),font_size:FS.M},
					{id:"mask",type:"div3x3",pos:[0,0,0],w:centerW,h:centerH,css:imgLib.getImg("box_dark"),face_r:0,face_g:0,face_b:0,face_a:160,display:techLv?0:1},
					{id:"status",css:cssLib.textFineMid.createCSS([btnX,statusY,0],statusStr,10,10,1,1,1,1,color),display:statusDisp},
					{id:"gemDone",css:cssLib.normalBtn.createCSS([btnX,btnY1,0],keyid1,0,"",btnW,btnH,0,uvInfo),display:btnDisp,items:[
						{id:"gem",type:"icon",pos:[resX,0,0],w:resSize,h:resSize,anchor_h:2,anchor_v:1,css:imgLib.getIcon("res_gem",64)},
						{id:"num",css:cssLib.textFineMid.createCSS([numX,0,0],cost,10,10,2,1,2,1,gemColor)}
					]},
					{id:"callTech",css:cssLib.normalBtn.createCSS([btnX,btnY2,0],keyid2,0,textLib["CallTech"],btnW,btnH,0,uvInfo),display:btnDisp}
				]};
				return css;
			},
		};
	};
	__Page.dlgClanTech.init=function(appEnv)
	{
		this.name="dlgClanTech";
		this.viewId="dlgClanTech";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.topBox=this.cntBox.appendNewChild({css:this.topBoxCSS});
		this.lbxTech=this.cntBox.appendNewChild({css:this.listCSS});
	};

	__Page.dlgClanTech.initUI=function()
	{
		var appEnv=this.appEnv;
		var defLib=window.aisEnv.defLib.clanTec;
		var i, item;
		for(i in defLib)
		{
			if(defLib[i]["codeName"])
			{
				item=this.techLineCSS.createCSS(defLib[i],appEnv.getClanTech(i));
				this.lbxTech.addItem(item);
			}
		}
	};

	__Page.dlgClanTech.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.dlgTitle._setText(textLib["ClanTech"]);
		//根据VO初始化界面:
		this.infoVO=vo;
		vo=[{},{},{},{}];
		var i, item;
		appEnv.setDlgAniCall(function(){
		//	if(vo)
			{
				this.initUI();
			}
		},this);
	};

	__Page.dlgClanTech.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		appEnv.clearDlgAniCall();
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgClanTech.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//钻秒科技
		__Page.dlgClanTech.onGemDoneClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				DBOut("onGemDoneClk");
				var keyVO=this.gemKeys[key+""];
				DBOut(toJSON(keyVO));
				var status=this.appEnv.getClanTechStatus(keyVO.codeName);
				if(0==status)
				{
					appEnv.stateLogs.showLog(textLib["TechInCall"]);
					return;
				}
				else if(1==status)
				{
					appEnv.stateLogs.showLog(textLib["TechInUse"]);
					return;
				}
				var msgObj=window.aisGame.curCity.clanMsgs;
				var rankLevel=-1;
				var cvo=this.page.stateHome.clanInitVO;
				if(cvo)
				{
					rankLevel=cvo.rankLevel;
				}
				if(rankLevel!=msgObj.CLAN_RANK_LEADER && rankLevel!=msgObj.CLAN_RANK_DEPUTY_LEADER)
				{
					appEnv.stateLogs.showLog(textLib["OnlyLeaderCanUse"]);
					return;
				}
				this.page.vwHomeStage.clanTechGemDone(keyVO);
				this.appEnv.closeDlg(null,null,0);
			}
		};

		//号召
		__Page.dlgClanTech.onCallTechClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				DBOut("onCallTechClk");
				var keyVO=this.callKeys[key+""];
				DBOut(toJSON(keyVO));
				var status=this.appEnv.getClanTechStatus(keyVO.codeName);
				if(0==status)
				{
					appEnv.stateLogs.showLog(textLib["TechInCall"]);
					return;
				}
				else if(1==status)
				{
					appEnv.stateLogs.showLog(textLib["TechInUse"]);
					return;
				}
				var msgObj=window.aisGame.curCity.clanMsgs;
				var rankLevel=-1;
				var cvo=this.page.stateHome.clanInitVO;
				if(cvo)
				{
					rankLevel=cvo.rankLevel;
				}
				if(rankLevel!=msgObj.CLAN_RANK_LEADER && rankLevel!=msgObj.CLAN_RANK_DEPUTY_LEADER)
				{
					appEnv.stateLogs.showLog(textLib["OnlyLeaderCanUse"]);
					return;
				}
				var comVO=keyVO;
				var king=window.aisGame.king, city=window.aisGame.curCity;
				king.sendNTCmd(city,"ClanCallOn",comVO,city);
				this.appEnv.closeDlg(null,null,0);
			}
		};
	}
}
