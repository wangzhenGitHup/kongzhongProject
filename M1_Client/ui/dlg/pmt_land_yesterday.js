if(!__Page.pmtLandYesterday)
{
	__Page.pmtLandYesterday=new __Page.gamePage.pmtBase(__Page,__Page.gamePage.appEnv,9,0);
	__Page.pmtLandYesterday.loadConfig=function()
	{
		this.dlgPage.gamePage.pmtBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//建筑图标区域
		this.pic=pic=imgLib.getImg("pic_backlight");
		this.pic_line=imgLib.getImg("box_blue_line");
		//设置当前联盟图标
		// this.picl=imgLib.getIcon("badge14",64);
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
		pic=imgLib.getImg("box_achieve");
		var subCntX=this.subCntX=cntInner[0];
		var subCntY=this.subCntY=cntInner[1]+statusH+dt;
		var subCntW=this.subCntW=cntW-cntInner[0]*2;
		var subCntH=this.subCntH=cntH-cntInner[1]*2-statusH-dt;
		this.subCntFieldCSS={id:"subCntField",type:"div3x3",pos:[subCntX,subCntY+40,0],w:subCntW,h:subCntH-40,css:pic,ui_event:1,items:[]};
		this.subCntFieldCSS_up={id:"subCntField",type:"div3x3",pos:[subCntX,subCntY-200,0],w:subCntW,h:subCntH-20,css:pic,ui_event:1,items:[]};
		var subCntInner=this.subCntInner=[pic.mgL,pic.mgU];
		//信息区域内的文字
		var subCntTxtX=this.subCntTxtX=subCntInner[0];
		var subCntTxtY=this.subCntTxtY=subCntInner[1];
		var subCntTxtW=this.subCntTxtW=subCntW-subCntInner[0]*2;
	//	var subCntTxtH=this.subCntTxtH=subCntH-subCntInner[1]*2;
		var subCntTxtH=this.subCntTxtH=10;
		// this.subCntTxtCSS={id:"subCntTxt",type:"text",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,anchor_v:1,align_h:0,align_v:0,wrap:1,font_size:FS.M,color_r:10,color_g:10,color_b:10};
		this.subCntTxtCSS={id:"subCntTxt",type:"memo",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntH-60,align_h:0,align_v:0,wrap:1,font_size:FS.XL,color_r:10,color_g:10,color_b:10,font_size:14};
		this.subCntTxtCSS_up={id:"subCntTxt_up",type:"text",pos:[subCntTxtX,subCntTxtY+100,0],w:subCntTxtW,h:30,anchor_v:1,align_h:0,align_v:0,wrap:1,font_size:FS.M,color_r:10,color_g:10,color_b:10};
		this.subCntTxtCSS_upr={id:"subCntTxt_upr",type:"text",pos:[subCntTxtX,subCntTxtY+100,0],w:subCntTxtW,h:30,anchor_h:2,anchor_v:1,align_h:2,align_v:0,wrap:1,font_size:FS.M,color_r:10,color_g:10,color_b:10};
		//
		pic=imgLib.getImg("arrow_up");
		var sx=subCntTxtW-pic.w+20;
		this.sIconCSS_u={type:"icon",pos:[sx,0,0],anchor_h:2,anchor_v:0,css:pic};
		pic=imgLib.getImg("arrow_down");
		this.sIconCSS_d={type:"icon",pos:[sx,subCntH-66,0],anchor_h:2,anchor_v:2,css:pic};
	};
	__Page.pmtLandYesterday.init=function(appEnv)
	{
		this.name="pmtLandYesterday";
	};
	__Page.pmtLandYesterday.getVo=function(vo){
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var clanInitVO=page.stateHome.clanInitVO?page.stateHome.clanInitVO:null;
		var clanName="", clanFlag="";
		if(clanInitVO)
		{
			clanName=clanInitVO.clanVO.name;
			clanFlag=clanInitVO.clanVO.flag;
			clanFlag=imgLib.genIconPath("badge"+clanFlag,64);
		}
		this.clanName=clanName;
		this.clanFlag=clanFlag;
		if(!vo)vo={};
		if(vo){
			var defLib=window.aisEnv.defLib.clanCupDomains;
			this.YesterdayFight=vo.targetDomain?defLib[vo.targetDomain]["name"]:"--  "; //攻击目标
			this.LordsFlag=(vo.lordsFlag&&vo.lordsName)?vo.lordsFlag:0; //领地归属联盟标识(头像)
			this.YesterdayFightScore=(vo.score)?vo.score+"":"--  "; //分数
			this.TargetVesting=vo.lordsName?vo.lordsName:"--  "; //领地归属联盟 nickname
			this.TargetVestingScore=(vo.lordsScore)?vo.lordsScore+"":"--  "; //领主最终得分
			this.memCount=vo.memCount?vo.memCount:"--";//成员数量，包括见习成员
			this.ranking=(vo.ranking+1)?(vo.ranking+1):"--";//联盟当前排行
			this.ReportDetail=vo.reportDetail?vo.reportDetail:"--";//战斗详情
			var i, rvo, str="", atkStr="", defStr="";
			if(vo.reportDetail && vo.reportDetail.length)
			{
				for(i=0; i<vo.reportDetail.length; i++)
				{
					rvo=vo.reportDetail[i];
					if(0==rvo.type)//进攻
					{
						atkStr+=defLib[rvo.targetDomain]["name"]+": ";
						if(0==rvo.flag)//胜利
						{
							atkStr+=textLib["AtkWinDesc"];
						}
						else if(-1==rvo.flag)//失败
						{
							atkStr+=textLib["AtkLoseDesc"];
						}
						atkStr+="\n";
					}
					else if(1==rvo.type)//防守
					{
						defStr+=defLib[rvo.targetDomain]["name"]+": ";
						if(0==rvo.flag)//胜利
						{
							defStr+=textLib["DefWinDesc"];
						}
						else if(-1==rvo.flag)//失败
						{
							defStr+=textLib["DefLoseDesc"];
						}
						defStr+="\n";
					}
				}
			}
			str=textLib["YesterdayAtkRpt"]+": \n";
			str+=(atkStr?atkStr:"--");
			str+="\n";
			str+=textLib["YesterdayDefRpt"]+": \n";
			str+=(defStr?defStr:"--");
			this.ReportDetail=str;
		}
	}
	__Page.pmtLandYesterday.setVO=function(vo){
		//根据VO初始化界面: 
		this.getVo(vo);
		this.infoVO=vo; 
		{
			this.dlgTitle._setText(textLib.ClanYesterdayInfo);//this.curLevel.name);
		//	this.timer=setFrameout(window.DelayLoad,function(){
		//	appEnv.setDlgAniCall(function(){
				this.picField=this.cntBox.appendNewChild({css:[this.picFieldCSS]});
				this.picObj=this.picField.getItemById("pic-obj");
				this.statusField=this.cntBox.appendNewChild({css:[this.statusFieldCSS]});
				this.subCntField=this.cntBox.appendNewChild({css:[this.subCntFieldCSS]});
				this.subCntField_up=this.cntBox.appendNewChild({css:[this.subCntFieldCSS_up]});
				
				this.subText=this.subCntField.appendNewChild({css:this.subCntTxtCSS,line_h:28,ui_event:1,show_fx:1,end_gap:0,font_size:FS.S});
				this.sIconU=this.subText.appendNewChild({css:this.sIconCSS_u});
				this.sIconD=this.subText.appendNewChild({css:this.sIconCSS_d});
				this.subText.setSideIcon(0,this.sIconU);
				this.subText.setSideIcon(1,this.sIconD);
				// this.subText_up=this.subCntField_up.appendNewChild({css:[this.subCntTxtCSS_up]});
				this.subCntField_up.appendNewChild([
					//
					{type:"icon",anchor_h:1,anchor_v:1,css:this.pic ,pos:[60,50,0],w:120,h:120},
					{type:"icon",anchor_h:1,anchor_v:1,tex_u:0,tex_v:0,tex_w:1,tex_h:1,tex:this.clanFlag,w:64,h:64,pos:[60,50,0]},
					////
					{css:[this.page.cssLib.textFineMid.createCSS([this.subCntTxtCSS_up.pos[0]+92+30,this.subCntTxtCSS_up.pos[1]-100,0],this.clanName,10,10,0,0,0,0)]},
					{css:[this.page.cssLib.textFineSmall.createCSS([this.subCntTxtCSS_up.pos[0]+122,this.subCntTxtCSS_up.pos[1]-70,0],textLib.ClanMembers+":")]},
					{css:[this.page.cssLib.textFineSmall.createCSS([this.subCntTxtCSS_up.pos[0]+372,this.subCntTxtCSS_up.pos[1]-70,0])],text:this.memCount+""},
					{css:[this.page.cssLib.textFineSmall.createCSS([this.subCntTxtCSS_up.pos[0]+122,this.subCntTxtCSS_up.pos[1]-50,0])],text:textLib.ClanRankNum+":"},
					{css:[this.page.cssLib.textFineSmall.createCSS([this.subCntTxtCSS_up.pos[0]+372,this.subCntTxtCSS_up.pos[1]-50,0])],text:this.ranking+""},
					//
					{css:[this.subCntTxtCSS_up],text:textLib.YesterdayFight},
					{type:"icon",anchor_h:1,anchor_v:1,css:this.pic_line,pos:[this.subCntTxtCSS_up.pos[0]+310,this.subCntTxtCSS_up.pos[1]+5,0],w:this.subCntTxtCSS_up.w},
					{css:[this.subCntTxtCSS_upr],pos:[this.subCntTxtCSS_up.pos[0]+this.subCntTxtCSS_up.w,this.subCntTxtCSS_up.pos[1],0],text:this.YesterdayFight},
					//
					{css:[this.subCntTxtCSS_up],pos:[this.subCntTxtCSS_up.pos[0],this.subCntTxtCSS_up.pos[1]+30,0],	text:textLib.YesterdayFightScore},
					{type:"icon",anchor_h:1,anchor_v:1,css:this.pic_line,pos:[this.subCntTxtCSS_up.pos[0]+310,this.subCntTxtCSS_up.pos[1]+35,0],w:this.subCntTxtCSS_up.w},
					{css:[this.subCntTxtCSS_upr],pos:[this.subCntTxtCSS_up.pos[0]+this.subCntTxtCSS_up.w,this.subCntTxtCSS_up.pos[1]+30,0],text:this.YesterdayFightScore},
					//
					{css:[this.subCntTxtCSS_up],pos:[this.subCntTxtCSS_up.pos[0],this.subCntTxtCSS_up.pos[1]+60,0],	text:textLib.TargetVesting},
					{type:"icon",anchor_h:1,anchor_v:1,css:this.pic_line,pos:[this.subCntTxtCSS_up.pos[0]+310,this.subCntTxtCSS_up.pos[1]+65,0],w:this.subCntTxtCSS_up.w},
					{css:[this.subCntTxtCSS_upr],pos:[this.subCntTxtCSS_up.pos[0]+this.subCntTxtCSS_up.w,this.subCntTxtCSS_up.pos[1]+60,0],	text:this.TargetVesting},
					//
					{css:[this.subCntTxtCSS_up],pos:[this.subCntTxtCSS_up.pos[0],this.subCntTxtCSS_up.pos[1]+90,0],	text:textLib.TargetVestingScore},
					{type:"icon",anchor_h:1,anchor_v:1,css:this.pic_line,pos:[this.subCntTxtCSS_up.pos[0]+310,this.subCntTxtCSS_up.pos[1]+95,0],w:this.subCntTxtCSS_up.w},
					{css:[this.subCntTxtCSS_upr],pos:[this.subCntTxtCSS_up.pos[0]+this.subCntTxtCSS_up.w,this.subCntTxtCSS_up.pos[1]+90,0],	text:this.TargetVestingScore},
				]);
				/*if(this.LordsFlag){
					this.picl=imgLib.getIcon("badge"+this.LordsFlag,64);
					this.subCntField_up.appendNewChild([{type:"icon",anchor_h:1,anchor_v:1,css:this.picl,pos:[this.subCntTxtCSS_up.pos[0]+this.subCntTxtCSS_up.w-this.TargetVesting.length*16-48,this.subCntTxtCSS_up.pos[1]+50,0],w:32,h:32}
					]);
				}*/
				this.initUI();
				this.timer=null;
		//	},this,0,"Wall"==this.aisDef?1:0);
		}
	}
	__Page.pmtLandYesterday.enter=function(preState,vo)
	{
		this.dlgPage.gamePage.pmtBase.prototype.init.call(this,this.appEnv);
		this.dlgPage.gamePage.pmtBase.prototype.enter.call(this,preState,vo);
		//TODO:code this:
		this.infoText.setDisplay(0);
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib,clanId=window.aisGame.curCity.allianceId;
		this.dlgTitle._setText(textLib.ClanYesterdayInfo);
		var param=["ClanDwr","getClanCupHisReport",clanId?clanId:-1];
		DBOut("param : "+param);
		this.dwrObj=this.appEnv.newMsg(param,{cb:function(vo){
			DBOut("getClanCupHisReport: : "+toJSON(vo));
			this.setVO(vo);
		},cbobj:this,eh:function(err){DBOut("err: "+err);},ehobj:this},window.ClanDWRUrl);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};
	__Page.pmtLandYesterday.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		this.pmtFrame.getItemById("dlgCloseKey").setKey(0);
		this.btnClose.setKey(0);
		var appEnv=this.appEnv;
		appEnv.hudOut(this.pmtFrame,0,function(){
			this.pmtFrame.getFather().removeChild(this.pmtFrame);
		},this);
	//	appEnv.clearDlgAniCall();
	};
	__Page.pmtLandYesterday.initUI=function()
	{
		var textLib=this.appEnv.textLib;
		var lVo={name:textLib.ClanYesterdayInfo,desc:this.ReportDetail};//this.curLevel;
		var name=lVo.name, desc=lVo.desc;
		this.dlgTitle._setText(name);
		this.subText.setText(desc);
		// this.subText.setTextEx(desc);
	//	this.picObj.setTexURL(this.page.imgLib.getIcon("bld_"+this.aisDef.codeName,128).tex);
		// var def=this.aisDef;
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtLandYesterday.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.dlgPage.gamePage.pmtBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
	}
}
