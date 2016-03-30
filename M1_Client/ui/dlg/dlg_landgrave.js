if(!__Page.dlgLandgrave)
{
	__Page.dlgLandgrave=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,0);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgLandgrave;
	__Page.dlgLandgrave.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var cntW=this.contentW, cntH=this.contentH, cInner=this.contentInner, dlgW=this.dlgW, dlgH=this.dlgH;
		var pic, keyid=0, dlg=this;
		var boxW=dlgW, boxH=dlgH;

		//左上联盟信息
		var txtH=24, infoW=238-30, infoH=80-10+txtH;
		this.infoBoxCSS={
			createCSS:function(pos,area,score)
			{
				var dt=6, th=txtH, totalH=infoH, tip=textLib["LandWarEnd"];
				var lx=dt, rx=infoW-dt, y1=dt+6, y2=y1+th, y3=y2+th, tw=infoW-lx;
				if(appEnv.remainDays>0)
				{
					totalH+=txtH;
					y2+=txtH;
					y3+=txtH;
					tip=textLib["LandWarTip"];
				}
				var css={id:"info",type:"div3x3",pos:pos,w:infoW,h:totalH,css:imgLib.getImg("box_dark"),items:[
					{id:"tip",css:cssLib.textFineMid.createCSS([lx,y1,0],tip,tw,10,0,0,0,0),font_size:FS.M,wrap:1},
					{css:cssLib.textFineMid.createCSS([lx,y2,0],textLib["CurDeclareLand"]+":",tw,10,0,0,0,0),font_size:FS.M},
					{id:"area",css:cssLib.textFineMid.createCSS([rx,y2,0],area,tw,10,2,0,2,0),font_size:FS.M},
					{css:cssLib.textFineMid.createCSS([lx,y3,0],textLib["CurLandScore"]+":",tw,10,0,0,0,0),font_size:FS.M},
					{id:"score",css:cssLib.textFineMid.createCSS([rx,y3,0],score,tw,10,2,0,2,0),font_size:FS.M},
				]};
				return css;
			}
		};
		//左下按钮区域
		var menuBoxW=298, menuBoxH=90, menuBoxX=0, menuBoxY=boxH-menuBoxH;
		var btnW=132, btnH=52, btnY=30+btnH/2, btnX1=6+btnW/2, btnX2=btnX1+btnW+6;
		var menuBoxCSS=this.menuBoxCSS={id:"menu-box",type:"icon",pos:[menuBoxX,menuBoxY,0],w:menuBoxW,h:menuBoxH,css:imgLib.getImg("pic_land_menu"),ui_event:1,
			items:[]
		};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onYesterdayClk);
		menuBoxCSS.items.push({id:"yesterday",css:cssLib.normalBtn.createCSS([btnX1,btnY,0],keyid,2,textLib["YesterdayInfo"],btnW,btnH)});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onTodayClk);
		menuBoxCSS.items.push({id:"today",css:cssLib.normalBtn.createCSS([btnX2,btnY,0],keyid,2,textLib["TodayInfo"],btnW,btnH)});
		//中间按钮区域
		pic=imgLib.getImg("btn_btminfo");
		btnW=pic.w, btnH=pic.h, btnY=btnH/2, btnX2=6+btnW/2, btnX1=-btnX2;
		var btmW=boxW, btmH=btnH, btmX=boxW/2, btmY=boxH-btmH;
		var nameX=0, nameY=0, nameW=btmW, nameH=10;
		var btmBoxCSS=this.btmBoxCSS={id:"btm-box",type:"icon",pos:[btmX,btmY,0],w:btmW,h:btmH,anchor_h:1,anchor_v:0,ui_event:1,
			display:0,fade:1,fade_alpha:0,fade_size:1,fade_pos:[btmX,boxH,0],
			items:[{id:"name",css:cssLib.textFineMid.createCSS([nameX,nameY,0],"Area Name",nameW,nameH,1,2,1,2)}]
		};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInfoClk);
		btmBoxCSS.items.push({id:"info",css:cssLib.picBtn.createCSS([btnX1,btnY,0],keyid,pic,"")});
		pic=imgLib.getImg("btn_btmatk");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onAttackClk);
		btmBoxCSS.items.push({id:"attack",css:cssLib.picBtn.createCSS([btnX2,btnY,0],keyid,pic,"")});
		//地图点css
		var self=this;
		this.areaKeys={};
		var picLand=imgLib.getImg("btn_land");
		var picLandSelf=imgLib.getImg("btn_land_own");
		var minW=60, minH=30, maxW=106, clanSize=28, flagSize=48, fsArea=FS.FM, fsClan=FS.M, maxClanW=180;
		this.pointCSS={
			page:this.page,
			createCSS:function(vo,def,keyid)
			{
				var atkDisp=0, flagDisp=0, clanDisp=0;
			//	DBOut(toJSON(vo));
				if(page.stateHome.clanInitVO)
				{
					if(vo.lords==page.stateHome.clanInitVO.clanVO.id)
						flagDisp=1;
				//	if(vo.codename==page.stateHome.clanInitVO.targetDomainId)
					if(def["codeName"]==page.stateHome.clanInitVO.targetDomainId)
						atkDisp=1;
				}
				var scale=self.scale, dt=8;
				var areaSize=appEnv.getTextSize(def["name"],fsArea);
				var areaW=areaSize.w+dt*2, areaH=areaSize.h+dt;
				areaW=areaW<minW?minW:areaW;
				areaW=areaW>maxW?maxW:areaW;
				areaH=areaH<minH?minH:areaH;
				var landBG={};
				if(flagDisp)
					landBG=picLandSelf;
				else
					landBG=picLand;
				areaW=landBG.w, areaH=landBG.h;
				var areaX=areaW/2, areaY=areaH/2;
				var boxX=def["x"]*scale-areaW/2, boxY=def["y"]*scale-areaH/2, boxW=areaW, boxH=areaH;
				var clanNameSize=appEnv.getTextSize(vo.lordName,fsClan);
				var clanNameW=clanNameSize.w, clanNameH=clanNameSize.h;
				clanNameW=clanNameW>maxClanW?maxClanW:clanNameW;
				var clanDt=2;
				var clanW=clanSize+clanDt+clanNameW, clanH=clanSize, clanY=boxH-12+clanSize/2;
				var clanIconX=(boxW-clanW)/2, clanNameX=clanIconX+clanSize+clanDt;
				var atkX=0, atkY=areaY, flagX=boxW, flagY=areaY;
				if(vo.lords)
					clanDisp=1;
				var css={id:"bg",type:"icon",pos:[boxX,boxY,0],w:boxW,h:boxH,ui_event:1,
					items:[
						{id:"btn",type:"key",pos:[areaX,areaY,0],w:areaW,h:areaH,anchor_h:1,anchor_v:1,ui_event:1,key:keyid,down_scale:0.9,
							state_up:{w:areaW,h:areaH},state_down:{w:areaW,h:areaH},state_gray:{w:areaW,h:areaH},audio:page.audioObject.genFileURL("btn_click"),
						},
						{id:"area",type:"icon",pos:[areaX,areaY,0],w:areaW,h:areaH,anchor_h:1,anchor_v:1,items:[
							{id:"area-frame",type:"icon",pos:[0,2,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_land_own"),display:flagDisp},
							{id:"area-bg",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:landBG},
							{id:"area-name",css:cssLib.textFineMid.createCSS([0,-5,0],def["name"],areaW,areaH,1,1,1,1,null,1),font_size:fsArea},
							//{id:"area-atar",type:"icon",pos:[0,-30,0],w:32,h:29,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_star"),display:flagDisp},
						]},
						{id:"clan-icon",type:"icon",pos:[clanIconX,clanY,0],w:clanSize,h:clanSize,anchor_v:1,css:imgLib.getIcon("badge"+vo.lordFlag,64),display:clanDisp},
						{id:"clan-name",css:cssLib.textFineMid.createCSS([clanNameX,clanY,0],vo.lordName,maxClanW,clanNameH,0,1,0,1,null,0),font_size:fsClan,dotcut:1,display:clanDisp},
						{id:"icon-atk",type:"icon",pos:[areaX,areaY-5,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_aim"),fade:1,display:atkDisp,flash:2},
					//	{id:"icon-atk",type:"icon",pos:[atkX,atkY,0],w:flagSize,h:flagSize,anchor_h:2,anchor_v:1,css:imgLib.getIcon("landwar",64),fade:1,display:atkDisp},
					//	{id:"icon-flag",type:"icon",pos:[flagX,flagY,0],w:flagSize,h:flagSize,anchor_h:0,anchor_v:1,css:imgLib.getIcon("landown",64),display:flagDisp},
					],
					setSelStatus:function(sel)
					{
						var hud=this.getItemById("area");
						if(sel)
						{
							appEnv.addLoopScale(hud,0.09,{maxX:1.08,minX:0.96,maxY:1.08,miniY:0.96});
						}
						else
						{
							if(hud.scaleAni)
							{
								hud.scaleAni.setCurValue([1,1,1]);
								hud.scaleAni.stop();
							}
						}
					},
					update:function()
					{

					}
				};
				var i,x,y,url;
				x=(boxW>>1)-((def["star"]-1)*16/2)-16;
				y=-20;
				if(vo.lords==-1)
					url=this.page.genURL(window.imgPath+"/icon/icon_starmt64_32.png");
				else
					url=this.page.genURL(window.imgPath+"/icon/icon_star64_32.png");
				for(i=0;i<def["star"];i++)
				{
					css.items.push({type:"icon",pos:[x,y,0],tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,w:32,h:32,filter:1});
					x+=16;
				}
				return css;
			}
		};
		//其他界面pmt
		<include check=0>"pmt_land_yesterday.js"</include>//搜索
		<include check=0>"pmt_land_today.js"</include>//搜索
		<include check=0>"pmt_land_area.js"</include>//搜索
	};

	__Page.dlgLandgrave.init=function(appEnv)
	{
		this.name="dlgLandgrave";
		this.viewId="dlgLandgrave";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=this.dlgBox.appendNewChild({
			type:"div3x3",id:"dlgFrame",pos:[0,0,0],w:this.boxW,h:this.boxH,css:imgLib.getImg("box_dlgcontent"),ui_event:1,
		});

		var scale=this.scale=2;
		var mapW=1024*scale, mapH=1024*scale, boxW=this.dlgW, boxH=this.dlgH;
		var defPos=[-mapW/2,-mapH/2,0];
		if(appEnv.defLandPos)
			defPos=appEnv.defLandPos;
		var minPos=[boxW-mapW,boxH-mapH,0], maxPos=[0,0,0];
		if(defPos[0]<minPos[0])defPos[0]=minPos[0];
		if(defPos[0]>maxPos[0])defPos[0]=maxPos[0];
		if(defPos[1]<minPos[1])defPos[1]=minPos[1];
		if(defPos[1]>maxPos[1])defPos[1]=maxPos[1];
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onCloseBtmClk);
		this.navBox=this.dlgFrame.appendNewChild({type:"nav_box",id:"navBox",pos:[0,0,0],w:this.dlgW,h:this.dlgH,ui_event:1,display:1,csm_pos:0,edge_factor:0,
			min_pos:minPos,max_pos:maxPos,drag_enabled:1,pinch_enabled:0,key:keyid,
		})
		this.navBox.setMinNavPos(minPos);
		this.navBox.setMaxNavPos(maxPos);

		this.mapW=this.dlgW, this.mapH=this.dlgH;
		this.mapBox=this.dlgFrame.appendNewChild({id:"map-box",type:"icon",pos:[0,0,0],w:mapW,h:mapH,css:imgLib.getIcon("land",1024),ui_event:1});
		this.navBox.setNavItem(this.mapBox);
	//	this.navBox.setNavItem(null);
		this.mapBox.setPos(defPos);

		this.uiW=this.dlgW, this.uiH=this.dlgH;
		this.uiBox=this.dlgFrame.appendNewChild({id:"ui-box",type:"icon",pos:[0,0,0],w:this.uiW,h:this.uiH,ui_event:1});

		var titlePic=imgLib.getImg("box_dlgtitle");
		var boxY=titlePic.h/2;
		//对话框标题栏:
		this.titleBox=this.uiBox.appendNewChild({type:"icon",id:"TitleBox",pos:[0,boxY,0],w:this.boxW,anchor_v:1,ui_event:1,css:cssLib.dlgTitleBox,});
		//对话框标题:
		this.dlgTitle=this.titleBox.appendNewChild({id:"title",css:cssLib.textFineBig.createCSS([this.boxW/2,0,0],"Title",this.boxW,100,1,1,1,1)});
		if(page.stateHome.clanInitVO)
		{
			//联盟信息
			var infoX=6, infoY=titlePic.h+6;
			var area=textLib["None"];
			if(page.stateHome.clanInitVO && page.stateHome.clanInitVO.targetDomainId)
			{
				area=window.aisEnv.defLib.clanCupDomains[page.stateHome.clanInitVO.targetDomainId]["name"];
			}
			this.infoBox=this.uiBox.appendNewChild({css:this.infoBoxCSS.createCSS([infoX,infoY,0],area,appEnv.getClanLandWarScore())});
		}
		//关闭对话框的按钮:
		var btnPic=imgLib.getImg("btn_close_u");
		var btnX=titlePic.mgR/2+btnPic.w/2;
		this.btnCloseKeyId=keyid=appEnv.appKeys.btnClose;
		this.btnClose=cssLib.btnCloseDlg.create(this.titleBox,[this.boxW-btnX,0,0],keyid);
		this.regKeyVO(keyid,this,this.onCloseClk);
		//帮助对话框的按钮:
		btnX+=btnPic.w+10;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onHelpClk);
		this.btnClose=cssLib.btnCloseDlg.create(this.titleBox,[this.boxW-btnX,0,0],keyid,"btn_question");
	};

	__Page.dlgLandgrave.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		//根据VO初始化界面:
		this.infoVO=vo;
		appEnv.setDlgAniCall(function(){
		//	if(vo)
			{
				this.inited=1;
				this.initUI();
			}
		},this);
		this.dlgTitle._setText(textLib["LandWar"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgLandgrave.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var pos=[];
		this.mapBox.getPos(pos);
		appEnv.defLandPos=pos;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgLandgrave.initUI=function()
	{
		this.menuBox=this.uiBox.appendNewChild({css:this.menuBoxCSS});
		this.btmBox=this.uiBox.appendNewChild({css:this.btmBoxCSS});
		this.btmName=this.btmBox.getItemById("name");
		var appEnv=this.appEnv;
		var page=this.page;
		var home=page.stateHome;
		if(appEnv.landWarInfo)
		{
			this.addMapPoints();
		}
		else
		{
			home.getDomains(this.addMapPoints,this);
		}
	};

	__Page.dlgLandgrave.addMapPoints=function()
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var defLib=window.aisEnv.defLib.clanCupDomains;
		var i, j=0, keyid=0, css, hud;
		if(this.infoBox)
		{
			var tip=textLib["LandWarEnd"];
			if(appEnv.remainDays>0)
				tip=textLib["LandWarTip"];
			this.infoBox.getItemById("tip")._setText(tip);
		}
		for(i in defLib)
		{
			if(defLib[i]["codeName"])
			{
				j++;
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onAreaClk);
				css=this.pointCSS.createCSS(appEnv.getDomainInfo(defLib[i]["codeName"]),defLib[i],keyid);
				hud=this.mapBox.appendNewChild({id:"area-i",css:css});
				this.areaKeys[keyid+""]={hud:hud, def:defLib[i]};
			}
		}
	};

	__Page.dlgLandgrave.setAtkBtnStatus=function()
	{
		var btn=this.btmBox.getItemById("attack");
		var cvo=this.page.stateHome.clanInitVO;
		if(cvo && cvo.targetDomainId)
		{
			btn.setStateStyle(0,{color_a:128});
			btn.setStateStyle(1,{color_a:128});
		}
		else
		{
			btn.setStateStyle(0,{color_a:255});
			btn.setStateStyle(1,{color_a:255});
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgLandgrave.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//昨日战报
		__Page.dlgLandgrave.onYesterdayClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onYesterdayClk");
				this.appEnv.showPmtDlg(this.dlgPage.pmtLandYesterday,0,{
					title:"aha",ui:"",align:1,
					pmtFunc:function(){},pmtObj:this,pmtParam:null
				});
			}
		};

		//今日战绩
		__Page.dlgLandgrave.onTodayClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onTodayClk");
				this.appEnv.showPmtDlg(this.dlgPage.pmtLandToday,0,{
					title:"aha",ui:"",align:1,
					pmtFunc:function(){},pmtObj:this,pmtParam:null
				});
			}
		};

		//区域信息
		__Page.dlgLandgrave.onInfoClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onInfoClk");
				var keyVO=this.curSel;
				DBOut(toJSON(keyVO.def));
				this.appEnv.showPmtDlg(this.dlgPage.pmtLandAreaInfo,0,{
					title:"aha",ui:"",align:1,domainDef:keyVO.def,
					pmtFunc:function(){},pmtObj:this,pmtParam:null
				});
			}
		};

		//攻打
		__Page.dlgLandgrave.onAttackClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onAttackClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(!(appEnv.remainDays>0))
				{
					appEnv.stateLogs.showLog(textLib["LandWarEnd"]);
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
				if(cvo && cvo.targetDomainId)
				{
					appEnv.stateLogs.showLog(textLib["ClanDeclared"]);
					return;
				}
				var keyVO=this.curSel;
				var comVO={codeName:keyVO.def["codeName"]};
				var king=window.aisGame.king, city=window.aisGame.curCity;
				king.sendNTCmd(city,"ClanDeclareWar",comVO,city);
			//	appEnv.stateLogs.showLog(textLib.getTextEx("DeclareLand",{area:keyVO.def["name"]}));
				keyVO.hud.getItemById("icon-atk").fadeIn(5,0);
				keyVO.hud.setSelStatus(0);
				this.infoBox.getItemById("area")._setText(keyVO.def["name"]);
				this.curSel=null;
				this.btmBox.fadeOut(5,0);
			}
		};

		//地图点击
		__Page.dlgLandgrave.onAreaClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onAreaClk");
				var keyVO=this.areaKeys[key+""];
				if(this.curSel && this.curSel.hud==keyVO.hud)
					return;
				if(this.curSel)
				{
					this.curSel.hud.setSelStatus(0);
				}
				this.curSel=keyVO;
				this.curSel.hud.setSelStatus(1);
				this.btmBox.fadeIn(10,0);
				this.btmName._setText(keyVO.def["name"]);
				this.setAtkBtnStatus();
			}
		};

		//地图空白区域点击
		__Page.dlgLandgrave.onCloseBtmClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onCloseBtmClk");
				if(!this.inited)return;
				var appEnv=this.appEnv;
				var keyVO=this.curSel;
				if(this.curSel)
				{
					this.curSel.hud.setSelStatus(0);
				}
				this.curSel=null;
				appEnv.hudOut(this.btmBox,6);
			}
		};

		//帮助按钮点击
		__Page.dlgLandgrave.onHelpClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onHelpClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var page=this.page;
				appEnv.showPmtDlg(page.pmtInfo,0,{title:textLib["LandWarHelp"],info:textLib["LandWarDesc"]});
			}
		};
	}
}
