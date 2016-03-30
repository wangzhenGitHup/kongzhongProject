if(!__Page.pmtLandAreaInfo)
{
	__Page.pmtLandAreaInfo=new __Page.gamePage.pmtBase(__Page,__Page.gamePage.appEnv,9);
	__Page.pmtLandAreaInfo.loadConfig=function()
	{
		this.dlgPage.gamePage.pmtBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var page=this.page;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var pic=imgLib.getImg("box_unit_bg");
		var topFieldX=this.contentInner[0];
		var topFieldY=this.contentInner[1];
		var topFieldW=this.contentW-topFieldX*2;
		var topFieldH=120;
		var topFieldCSS=this.topFieldCSS={id:"top",type:"div3x3",pos:[topFieldX,topFieldY,0],css:pic,w:topFieldW,h:topFieldH,size3x3:[10,10,10,10]};

		var infoLineW=topFieldW;
		var infoLineH=100;
		var infoLinePos=[0,5,0];
		var infoItemW=infoLineW-20;
		var infoItemH=this.infoItemH=infoLineH/4;
		var infoItemX=20;
		var infoItemLineX=10;
		var infoItemTxtW=120;
		var infoItemInfoX=this.infoItemInfoX=infoItemX+infoItemTxtW;
		var infoItemInfoTxtW=this.infoItemInfoTxtW=infoItemW-20-infoItemTxtW;
		var infoLineCSS=this.infoLineCSS={type:"icon",id:"info-line",pos:infoLinePos,w:infoLineW,h:infoLineH,
			items:[
				{id:"occupyclan-txt",type:"text",css:cssLib.textMid.createCSS([infoItemX,0,0],textLib.OccupyClan+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
				{id:"occupyclan-info",type:"text",css:cssLib.textMid.createCSS([infoItemInfoX,0,0,],"--",infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
				{id:"occupyclan-icon",type:"icon",pos:[infoItemInfoX+infoItemInfoTxtW-page.appEnv.getTextSize("--",20,0).w-5,infoItemH/2,0],css:imgLib.getIcon("",64),w:24,h:24,anchor_h:2,anchor_v:1},
				{type:"icon",pos:[infoItemLineX,infoItemH,0],w:infoItemW,anchor_h:0,anchor_v:1,css:this.page.imgLib.getImg("box_blue_line")},
				{id:"occupyclanleader-txt",type:"text",css:cssLib.textMid.createCSS([infoItemX,infoItemH,0],textLib.OccupyClanLeader+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
				{id:"occupyclanleader-info",type:"text",css:cssLib.textMid.createCSS([infoItemInfoX,infoItemH,0,],"--",infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
				{type:"icon",pos:[infoItemLineX,infoItemH*2,0],w:infoItemW,anchor_h:0,anchor_v:1,css:this.page.imgLib.getImg("box_blue_line")},
				{id:"score-txt",type:"text",css:cssLib.textMid.createCSS([infoItemX,infoItemH*2,0],textLib.OccupyScore+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
				{id:"score-info",type:"text",css:cssLib.textMid.createCSS([infoItemInfoX,infoItemH*2,0,],"--",infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
				{type:"icon",pos:[infoItemLineX,infoItemH*3,0],w:infoItemW,anchor_h:0,anchor_v:1,css:this.page.imgLib.getImg("box_blue_line")},
				{id:"output-txt",type:"text",css:cssLib.textMid.createCSS([infoItemX,infoItemH*3,0],textLib.DiamondOutput+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
				{id:"output-info",type:"text",css:cssLib.textMid.createCSS([infoItemInfoX,infoItemH*3,0,],"--",infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
				{type:"icon",pos:[infoItemLineX,infoItemH*4,0],w:infoItemW,anchor_h:0,anchor_v:1,css:this.page.imgLib.getImg("box_blue_line")},
			]
		};

		var rankTxtW=topFieldW;
		var rankTxtH=20;
		var rankTxtPos=[topFieldX,topFieldY+topFieldH+5];
		var rankTxtCSS=this.rankTxtCSS={id:"rank-txt",type:"text",css:cssLib.textMid.createCSS(rankTxtPos,textLib.getTextEx("AreaAttacker",{num:0}),rankTxtW,rankTxtH,0,0,0,0,[0,0,0])};
		var clansFieldCSS=this.clansFieldCSS={id:"clans",type:"icon",pos:[rankTxtPos[0],rankTxtPos[1]+rankTxtH,0],w:topFieldW,h:this.contentH-rankTxtPos[1]-rankTxtH,ui_event:1};

		//*************
		var listX=0;
		var listY=0;
		var listW=clansFieldCSS.w;
		var listH=clansFieldCSS.h-10;
		var itemW=listW;
		var itemH=66;
		this.lbxClansCSS={type:"listbox",id:"lbx-clan",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=itemW/2;
		var itemY=itemH/2;
		var pic=imgLib.getImg("box_achieve");
		var centerW=itemW;
		var centerH=56;
		var centerX=-centerW/2;
		var centerY=-centerH/2;
		var centerInner=[pic.mgL,pic.mgU];

		var rankW=92;
		var rankH=centerH-16;
		var rankX=centerInner[0]/2+rankW/2;
		var rankY=centerH/2-2;

		var iconSize=48;
		var iconX=centerInner[0]+iconSize/2;
		var iconY=centerH/2;
		var nameX=iconX+iconSize/2+this.dt*2;
		var nameY=iconY;

		var medalW=136;
		var medalX=centerW-centerInner[0]-medalW;
		var medalY=centerH/2;

		var modeX=medalX-110;
		var modeY=centerH/4+3;
		var numX=modeX;
		var numY=centerH*3/4-5;

		this.clanLineCSS={
			w:centerW,h:centerH,
			createCSS:function(vo,rank,needRank)
			{
				var rankCSS, dtX=needRank?(rankX+rankW/2):0;
				//rank=vo.ranking+1;
				if(rank<4){
					rankCSS=imgLib.getImg("box_clan_rank"+(rank));
				}else{
					rankCSS=imgLib.getImg("box_clan_rank4");
				}

				var bgCSS=(vo.id==window.aisGame.curCity.allianceId)?imgLib.getImg("box_self"):imgLib.getImg("box_achieve");
				var iconCSS=imgLib.getIcon("badge"+vo.flag,64);
			//	iconCSS=imgLib.getIcon("level",64);
				iconCSS.w=iconCSS.h=iconSize;
				var diamondCSS=imgLib.getIcon("res_gem",64);
				var diamondSize=0;
				if(1==rank)
					diamondSize=48;
				else if(2==rank)
					diamondSize=42;
				else if(3==rank)
					diamondSize=36;
				var lineW=this.w, lineH=this.h;
			//	var time=window.aisEnv.dateTime()%(24*60*60*1000);
			//	var gTime=18*60*60*1000;
				var score;
			//	if(time>gTime&&vo.clanCupScore)
				if(appEnv.getTodayScoreDisplay()){
					score=vo.clanCupScore+"";
				}else
					score="--";
				return {type:"div3x3",pos:[0,0,0],w:lineW,h:lineH,anchor_h:0,anchor_v:0,css:bgCSS,items:[
					{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:1,anchor_v:1,items:[
					//	{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:diamondCSS,w:diamondSize,h:diamondSize,display:(needRank && rank<4)?1:0},
						cssLib.textFineMid.createCSS([0,0,0],rank,rankW,rankH,1,1,1,1)],display:needRank?1:0
					},

					{type:"icon",pos:[iconX+dtX,iconY,0],css:iconCSS,anchor_h:1,anchor_v:1},
					{css:cssLib.textFineMid.createCSS([nameX+dtX,nameY,0],vo.name,lineW,lineH,0,1,0,1)},
					// {css:cssLib.textFineSmall.createCSS([modeX,modeY,0],textLib["ClanType"+vo.clanType],120,lineH,1,1,1,1)},
					// {css:cssLib.textFineSmall.createCSS([numX,numY,0],vo.memberNum+"/"+appEnv.getClanMemberMax(vo.level?vo.level:0),120,lineH,1,1,1,1)},//window.aisEnv.defLib.globals["MAX_CLAN_MEMBERS"]
					{type:"div3x3",pos:[medalX,medalY,0],w:medalW,h:lineH-12*2,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
						{type:"text",pos:[5,0,0],text:score,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.S},
						{type:"icon",pos:[medalW-36,0,0],anchor_h:1,anchor_v:1,w:40,h:40,css:imgLib.getIcon("res_clanpoint",64)}
					]}
				]};
			}
		};
	};
	__Page.pmtLandAreaInfo.init=function(appEnv)
	{
		this.name="pmtLandAreaInfo";
	};

	__Page.pmtLandAreaInfo.enter=function(preState,vo)
	{
		this.page.pmtBase.prototype.init.call(this,appEnv);
		this.dlgPage.gamePage.pmtBase.prototype.enter.call(this,preState,vo);

		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		this.pmtTitle.setText(textLib["AreaInfo"]);
		this.pmtTitle.setText(this.pmtVO.domainDef["name"]);
		var keyid=0;
		var domainDef=vo.domainDef;
		this.domainId=domainDef.codeName;
		this.topField=this.contentField.appendNewChild({css:this.topFieldCSS});
		this.clanInfoLine=this.topField.appendNewChild({css:this.infoLineCSS});
		this.loadsName=this.clanInfoLine.getItemById("occupyclan-info");
		this.loadsIcon=this.clanInfoLine.getItemById("occupyclan-icon");
		this.loadsLeadername=this.clanInfoLine.getItemById("occupyclanleader-info");
		this.loadsScore=this.clanInfoLine.getItemById("score-info");
		this.outputTxt=this.clanInfoLine.getItemById("output-txt");
		this.output=this.clanInfoLine.getItemById("output-info");
		this.rankTxt=this.contentField.appendNewChild({css:this.rankTxtCSS});
		this.clansField=this.contentField.appendNewChild({css:this.clansFieldCSS});
		// this.showUI(vo);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onclanClk);
		this.lbxClans=this.clansField.appendNewChild({css:this.lbxClansCSS,key:keyid});
		this.txtLoading=this.clansField.appendNewChild({css:cssLib.textFineBig.createCSS([this.lbxClansCSS.w/2,this.lbxClansCSS.h/2,0],textLib["IsLoading"],200,30,1,1,1,1,[192,192,192,255]),display:0,flash:2});
		//根据VO初始化界面:
	//	if(!vo)vo={clanId:9};
		// this.infoVO=vo;
		this.getClanRanking(window.aisGame.curCity.allianceId);
	};

	__Page.pmtLandAreaInfo.leave=function(nextState)
	{
		this.pmtFrame.getItemById("dlgCloseKey").setKey(0);
		this.btnClose.setKey(0);
		var appEnv=this.appEnv;
		appEnv.hudOut(this.pmtFrame,0,function(){
			this.pmtFrame.getFather().removeChild(this.pmtFrame);
		},this);
	};

	__Page.pmtLandAreaInfo.setInfoData=function(vo)
	{
		if(!vo)
			return;
		if(this.clanInfoLine)
		{
			if(vo.loadsName)
				this.loadsName.setText(vo.loadsName);
			var textW = this.page.appEnv.getTextSize(vo.loadsName,20,0).w;
			this.clanInfoLine.removeChild(this.loadsIcon);
			this.loadsIcon=this.clanInfoLine.appendNewChild(
				{id:"occupyclan-icon",type:"icon",pos:[this.infoItemInfoX+this.infoItemInfoTxtW-textW-5,this.infoItemH/2,0],css:imgLib.getIcon("badge"+vo.loadsFlag,64),w:24,h:24,anchor_h:2,anchor_v:1}
			);
			if(vo.loadsLeadername)
				this.loadsLeadername.setText(vo.loadsLeadername);
			if(vo.loadsScore)
				this.loadsScore.setText(vo.loadsScore);
			if(vo.output)
			{
				this.outputTxt.setText(this.appEnv.textLib["Res"+vo.output.type]+this.appEnv.textLib.DiamondOutput+":");
				DBOut("output="+toJSON(vo.output.num))
				this.output.setText(vo.output.num);
			}
		}
	};
	__Page.pmtLandAreaInfo.getClanRanking=function(clanId)
	{
		if(this.dwrObj)
			return;
		var param=["ClanDwr","getDomainInfo",this.domainId];
		this.lbxClans.clearItems();
		this.txtLoading.setText(this.appEnv.textLib["IsLoading"]);
		this.txtLoading.setDisplay(1);
		this.dwrObj=this.appEnv.newMsg(param,{cb:function(vo){
			DBOut("getClanRanking: "+toJSON(vo));
			this.txtLoading.setDisplay(0);
			this.dwrObj=null;
			this.lbxClans.clearItems();
			this.addClans(this.lbxClans,vo.declearClans);
			// this.infoVO=vo;
			this.setInfoData(vo);
		},cbobj:this,eh:function(){this.dwrObj=null;this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);},ehobj:this},window.ClanDWRUrl);
	};
	__Page.pmtLandAreaInfo.addClans=function(lbx,vo)
	{
		var page=this.page;
		if(!vo||vo.length==0)
		{
			this.rankTxt.setDisplay(0);
			this.txtLoading.setText(this.appEnv.textLib["NoClans"]);
			this.txtLoading.setDisplay(1);
			return;
		}
		this.rankTxt.setText(this.appEnv.textLib.getTextEx("AreaAttacker",{num:vo.length}));
		lbx.setDisplay(1);
		var i,item,items=[];
		if(vo)
		{
			vo.sort(function(a,b){return b.clanCupScore-a.clanCupScore;});
			for(i=0; i<vo.length; i++)
			{
				if(i>100)break;
				item=this.clanLineCSS.createCSS(vo[i],i+1,1);
				lbx.addItem(item);
			}
		}
		this.clansVO=vo;
	};
	__Page.pmtLandAreaInfo.getClanById=function(clanId)
	{
		// if(this.dwrObj)
			// return;
		// this.dwrObj=this.appEnv.newMsg(["ClanDwr","getClanById",clanId],{cb:function(vo){
			// DBOut("getClanById: "+toJSON(vo));
			// this.dwrObj=null;
			// if(!vo){
				// this.appEnv.stateLogs.showLog(this.appEnv.textLib["ClanInfoError"]);
				// return;
			// }
			// this.visitClanVO=vo;
			// var keyid=this.appEnv.hudKeys.getKey(this);
			// this.regKeyVO(keyid,this,this[stateName+"_onBackClk"]);
			// this.btnBack.setKey(keyid);
			// this.btnBack.setDisplay(1);
			// state.clanBox.setDisplay(0);
			// state.memberBox.setDisplay(1);
			// this.setClanInfo(state,vo);
			// this.addMembers(state,state.lbxMember,vo);
		// },cbobj:this,eh:function(){this.dwrObj=null;},ehobj:this},window.ClanDWRUrl);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtLandAreaInfo.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.pmtBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//点击顶部菜单
		__Page.pmtLandAreaInfo.onclanClk=function(msg,key,way,extra)
		{
			if(1==way && 2==msg)
			{
				var clanVO=this.clansVO[extra];
				//DBOut("this.onClanClk, clanVO:"+toJSON(clanVO));
				this.getClanById(clanVO.id);
			}
		};
	}

}
