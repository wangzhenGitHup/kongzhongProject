if(!__Page.pmtLandToday)
{
	__Page.pmtLandToday=new __Page.gamePage.pmtBase(__Page,__Page.gamePage.appEnv,9,0);
	__Page.pmtLandToday.loadConfig=function()
	{
		this.dlgPage.gamePage.pmtBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;
		var page=this.page;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var pic=imgLib.getImg("box_unit_bg");
		var topFieldX=this.contentInner[0];
		var topFieldY=this.contentInner[1];
		var topFieldW=this.contentW-topFieldX*2;
		var topFieldH=(this.contentH>>1)-20;
		var topFieldCSS=this.topFieldCSS={id:"top",type:"div3x3",pos:[topFieldX,topFieldY,0],css:pic,w:topFieldW,h:topFieldH,size3x3:[10,10,10,10]};
		
		var titleLineX=0;
		var titleLineY=5;
		var titleLineW=topFieldW;
		var titleLineH=90;
		var iconFieldW=120;
		var iconFieldH=120;
		var iconPos=[iconFieldW>>1,titleLineH>>1,0];
		var nameTxtPos=[iconFieldW+10,titleLineY,0];
		var nameTxtW=iconFieldW;
		var nameTxtH=30;
		var membersTxtPos=[nameTxtPos[0],nameTxtPos[1]+nameTxtH,0];
		var membersTxtW=nameTxtW;
		var membersTxtH=20;
		var membersNumW=150;
		var membersNumPos=[membersTxtPos[0]+membersTxtW,membersTxtPos[1],0];
		var clanrankTxtPos=[nameTxtPos[0],membersTxtPos[1]+membersTxtH,0];
		var clanrankTxtW=nameTxtW;
		var clanrankTxtH=membersTxtH;
		var clanRankNumW=membersNumW;
		var clanRankNumPos=[membersNumPos[0],clanrankTxtPos[1],0]
		var titleLineCSS=this.titleLineCSS={
			createCSS:function(vo){
				var clanIcon,name,members,rank;
				clanIcon=vo.flag?"badge"+vo.flag:"";
				name=vo.name?vo.name:"--";
				// members=vo.membersnum?vo.membersnum:"0";
				members=vo.members?vo.members.length:"--";
				rank=vo.ranknum?vo.ranknum:"--";
				return {type:"icon",id:"title-line",pos:[titleLineX,titleLineY,0],w:titleLineW,h:titleLineH,
					items:[
						{id:"icon-bg",type:"icon",pos:iconPos,css:imgLib.getImg("pic_backlight"),w:iconFieldW,h:iconFieldH,anchor_h:1,anchor_v:1},
						{id:"icon",type:"icon",pos:iconPos,css:imgLib.getIcon(clanIcon,64),anchor_h:1,anchor_v:1},
						{id:"clan-name",type:"text",css:cssLib.textFineMid.createCSS(nameTxtPos,name,nameTxtW,nameTxtH,0,0,0,0)},
						{id:"clan-members",type:"text",css:cssLib.textFineSmall.createCSS(membersTxtPos,textLib.ClanMembers+":",membersTxtW,membersTxtH,0,0,0,0)},
						{id:"clan-members-num",type:"text",css:cssLib.textFineSmall.createCSS(membersNumPos,members,membersNumW,membersTxtH,0,0,2,0)},
						{id:"clan-name",type:"text",css:cssLib.textFineSmall.createCSS(clanrankTxtPos,textLib.ClanRank+":",clanrankTxtW,clanrankTxtH,0,0,0,0)},
						{id:"clan-rank-num",type:"text",css:cssLib.textFineSmall.createCSS(clanRankNumPos,rank,clanRankNumW,clanrankTxtH,0,0,2,0)},
					]
				};
			}
		};
		var infoLineW=titleLineW;
		var infoLineH=topFieldH-titleLineH-10;
		var infoLinePos=[titleLineX,titleLineY+titleLineH,0];
		var infoItemW=infoLineW-20;
		var infoItemH=Math.floor(infoLineH/4);
		var infoItemX=20;
		var infoItemLineX=10;
		var infoItemTxtW=120;
		var infoItemInfoX=infoItemX+infoItemTxtW;
		var infoItemInfoTxtW=infoItemW-20-infoItemTxtW;
		var textCSS=this.textCSS={
			cssLib:this.cssLib,
			imgLib:this.imgLib,
			createCSS:function(pos,text,w,h,kh,kv,ah,av,color,wrap)
			{
				var imgLib=this.imgLib;
				return {
					type:"text",pos:pos,font_size:18,anchor_h:kh,anchor_v:kv,align_h:ah,align_v:av,w:w,h:h,wrap:wrap,
					edge:0,edge_r:0,edge_g:0,edge_b:0,edge_a:100,color_r:color?color[0]:255,color_g:color?color[1]:255,color_b:color?color[2]:255,color_a:255,text:text,
					display:1,fade:1,fade_size:1,fade_alpha:0,
				};
			},
			_setText:function(text)
			{
				this.setText(text);
			},
		};
		var infoLineCSS=this.infoLineCSS={
			createCSS:function(vo){
				var targetDomain,targatScore,ownerDomains,curScore,curMaxScore,selfScore;
				targetDomain=vo.targetDomain?vo.targetDomain+"":"--";
				targatScore=vo.targatScore?vo.targatScore+"":"--";
				// ownerDomains=vo.ownerDomains&&vo.ownerDomains.length>0?vo.ownerDomains+"":"--";
				// curMaxScore=vo.curMaxScore?vo.curMaxScore+"":"--";
				curScore=vo.curScore?vo.curScore+"":"--";
				selfScore=vo.selfScore?vo.selfScore+"":"--";
				return {type:"icon",id:"info-line",pos:infoLinePos,w:infoLineW,h:infoLineH,
					items:[
						{id:"obj-txt",type:"text",css:textCSS.createCSS([infoItemX,0,0],textLib.TargetDomain+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
						{id:"obj-info",type:"text",css:textCSS.createCSS([infoItemInfoX,0,0,],targetDomain,infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
						{type:"icon",pos:[infoItemLineX,infoItemH,0],w:infoItemW,anchor_h:0,anchor_v:1,css:page.imgLib.getImg("box_blue_line")},
						{id:"obj-score-txt",type:"text",css:textCSS.createCSS([infoItemX,infoItemH,0],textLib.TargatMinScore+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
						{id:"obj-score-info",type:"text",css:textCSS.createCSS([infoItemInfoX,infoItemH,0,],targatScore,infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
						{type:"icon",pos:[infoItemLineX,infoItemH*2,0],w:infoItemW,anchor_h:0,anchor_v:1,css:page.imgLib.getImg("box_blue_line")},
						// {id:"ownerDomains-txt",type:"text",css:textCSS.createCSS([infoItemX,infoItemH*2,0],textLib.OwnerDomains+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
						// {id:"obj-ownerDomains-info",type:"text",css:textCSS.createCSS([infoItemInfoX,infoItemH*2,0,],ownerDomains,infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
						// {type:"icon",pos:[infoItemLineX,infoItemH*3,0],w:infoItemW,anchor_h:0,anchor_v:1,css:page.imgLib.getImg("box_blue_line")},
						{id:"curscore-txt",type:"text",css:textCSS.createCSS([infoItemX,infoItemH*2,0],textLib.ClanCurScore+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
						{id:"obj-curscore-info",type:"text",css:textCSS.createCSS([infoItemInfoX,infoItemH*2,0,],curScore,infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
						{type:"icon",pos:[infoItemLineX,infoItemH*3,0],w:infoItemW,anchor_h:0,anchor_v:1,css:page.imgLib.getImg("box_blue_line")},
						// {id:"ownerDomains-score-txt",type:"text",css:textCSS.createCSS([infoItemX,infoItemH*3,0],textLib.CurMaxScore+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
						// {id:"ownerDomains-score-info",type:"text",css:textCSS.createCSS([infoItemInfoX,infoItemH*3,0,],curMaxScore,infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
						// {type:"icon",pos:[infoItemLineX,infoItemH*4,0],w:infoItemW,anchor_h:0,anchor_v:1,css:page.imgLib.getImg("box_blue_line")},
						{id:"personal-score-txt",type:"text",css:textCSS.createCSS([infoItemX,infoItemH*3,0],textLib.SelfScore+":",infoItemTxtW,infoItemH,0,0,0,1,[0,0,0])},
						{id:"personal-score-info",type:"text",css:textCSS.createCSS([infoItemInfoX,infoItemH*3,0,],selfScore,infoItemInfoTxtW,infoItemH,0,0,2,1,[0,0,0])},
						{type:"icon",pos:[infoItemLineX,infoItemH*4,0],w:infoItemW,anchor_h:0,anchor_v:1,css:page.imgLib.getImg("box_blue_line")},
					]
				};
			}
		};
		
		var rankTxtW=topFieldW;
		var rankTxtH=20;
		var rankTxtPos=[topFieldX,topFieldY+topFieldH+15];
		var rankTxtCSS=this.rankTxtCSS={id:"rank-txt",type:"text",css:this.textCSS.createCSS(rankTxtPos,textLib.ClanMembersScoreRank,rankTxtW,rankTxtH,0,0,0,0,[0,0,0])};
		var membersFieldCSS=this.membersFieldCSS={id:"members",type:"icon",pos:[rankTxtPos[0],rankTxtPos[1]+rankTxtH,0],w:topFieldW,h:this.contentH-rankTxtPos[1]-rankTxtH-10,ui_event:1};
		
		//*************
		var listW=membersFieldCSS.w;
		var listH=membersFieldCSS.h;
		var itemW=listW;
		var itemH=66;
		this.lbxMembersCSS={type:"listbox",id:"lbx-members",pos:[0,0,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW.h,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
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

		// var udSize=36;
		// var udX=rankX+rankW/2+this.dt*2+udSize/2;
		// var udY=rankY;

		var iconSize=48;
		var iconX=rankX+rankW/2+this.dt*2;//rankX+rankW/2+this.dt*2;
		var iconY=rankY;

		var nameX=iconX+iconSize+this.dt*2;
		var nameY=15;//centerH/3;
		var nameW=340;
		var nameH=centerH*2/3;
		var positionX=nameX;
		var positionY=centerH*5/6-7;
		var positionW=nameW;
		var positionH=centerH*2/6;

		var medalW=136;
		var medalX=centerW-centerInner[0]-medalW;
		var medalY=centerH/2;

		this.playerLineCSS={
			w:centerW,h:centerH,
			createCSS:function(vo,rank)//diamond
			{
				//{allianceFlag:0,allianceId:0,exp:0,move:0,rank:0,score:0,userId:0,userName:"name"+i}
				//DBOut("playerLineCSS, vo:"+toJSON(vo)+", rank:"+rank);
				// if(1!=rankType)
					// rank=vo.rank+1;
				var rankCSS, iconCSS, clanCSS, udCSS;
				if(rank<4){
					rankCSS=imgLib.getImg("box_clan_rank"+(rank));
				}else{
					rankCSS=imgLib.getImg("box_clan_rank4");
				}

				// udCSS=imgLib.getImg("icon_rank_up");
				// if(vo.move<0)
					// udCSS=imgLib.getImg("icon_rank_down");
				// else if(0==vo.move)
					// udCSS=imgLib.getImg("icon_rank_draw");

				var bgCSS=(vo.userId==window.USERID)?imgLib.getImg("box_self"):imgLib.getImg("box_achieve");
				iconCSS=imgLib.getIcon("level",64);
				iconCSS.w=iconCSS.h=iconSize;
				clanCSS=imgLib.getIcon("badge1",64);
				DBOut("allianceFlag=="+vo.allianceFlag)
				if(vo.allianceFlag)
					clanCSS=imgLib.getIcon("badge"+vo.allianceFlag,64);
				clanCSS.w=clanCSS.h=22;
				var position=textLib["ClanPosition"+vo.rankLevel];
				var vip=vo.vipLevel, vipScale=0.5, vipPic=imgLib.getImg("pic_VIP"+vip);
				var vipW=Math.floor(vipPic.w*vipScale), vipH=Math.floor(vipPic.h*vipScale);
				var vipCSS={css:vipPic,w:vipW,h:vipH};
				if(!vip)vipCSS={w:0,h:0};

				var lineW=this.w, lineH=this.h;
				return {type:"div3x3",pos:[0,0,0],w:lineW,h:lineH,anchor_h:0,anchor_v:0,css:bgCSS,items:[
					{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:1,anchor_v:1,items:[cssLib.textFineMid.createCSS([0,0,0],rank,rankW,rankH,1,1,1,1)]},
					
					// {type:"icon",pos:[udX,udY,0],anchor_h:1,anchor_v:1,css:udCSS,display:vo.move?0:1},
					// {type:"icon",pos:[udX,udY-11,0],anchor_h:1,anchor_v:1,css:udCSS,display:vo.move?1:0},
					// {css:cssLib.textFineMid.createCSS([udX,udY+11,0],Math.abs(vo.move),udCSS.w,udCSS.h,1,1,1,1,vo.move>0?[117,183,10,255]:[231,68,42,255]),font_size:FS.M,display:vo.move?1:0},
					
					{css:cssLib.iconText.createCSS([iconX,iconY,0],iconCSS,appEnv.getLevelByExp(vo.userExp),1,null,0,-2)},
				//	{css:cssLib.textFineMid.createCSS([nameX,nameY,0],vo.userName?vo.userName:(vo.userId+""),nameW,nameH,0,1,0,1,(vo.userId==window.USERID)?[10,200,255,255]:null)},
					{css:cssLib.iconText.createCSS([nameX,nameY,0],vipCSS,vo.name?vo.name:(vo.userId+""),2,(vo.userId==window.USERID)?[10,200,255,255]:null,FS.FM)},
					{id:"position",css:cssLib.textFineSmall.createCSS([positionX,positionY,0],position,positionW,positionH,0,1,0,1)},
					{type:"div3x3",pos:[medalX,medalY,0],w:medalW,h:lineH-12*2,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
						{type:"text",pos:[5,0,0],text:vo.curClanCupScore+"",anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.S},
						{type:"icon",pos:[medalW-36,0,0],anchor_h:1,anchor_v:1,w:40,h:40,css:imgLib.getIcon("res_clanpoint",64)}
					]},
					///////////////测试用
					{id:"view",css:cssLib.normalBtn.createCSS([lineW-200,lineH/2,0],0,0,textLib["ViewClan"],90,40),display:0},
				]};
			}
		};
	};
	__Page.pmtLandToday.init=function(appEnv)
	{
		this.name="pmtLandToday";
	};

	__Page.pmtLandToday.enter=function(preState,vo)
	{
		//TODO:code this:
		// this.dlgPage.gamePage.pmtBase.prototype.init.call(this,this.appEnv);
		this.page.pmtBase.prototype.init.call(this,appEnv);
		this.dlgPage.gamePage.pmtBase.prototype.enter.call(this,preState,vo);
		this.infoText.setDisplay(0);
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;
		this.pmtTitle.setText(textLib["ClanTodayInfo"]);
		//根据VO初始化界面:
	//	if(!vo)vo={clanId:9};
		// this.infoVO=vo;
		this.clanVO=window.aisGame.curCity.clanVO;
		DBOut("this.clanVO=="+toJSON(this.clanVO))
		this.topField=this.contentField.appendNewChild({css:this.topFieldCSS});
		this.clantitleLine=this.topField.appendNewChild({css:this.titleLineCSS.createCSS(this.clanVO?this.clanVO:{})});
		this.rankingTxt = this.topField.getItemById("clan-rank-num");
		this.clanInfoLine=this.topField.appendNewChild({css:this.infoLineCSS.createCSS({})});
		this.rankTxt=this.contentField.appendNewChild({css:this.rankTxtCSS});
		this.membersField=this.contentField.appendNewChild({css:this.membersFieldCSS});
		// this.showUI(vo);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMemberClk);
		this.lbxMembers=this.membersField.appendNewChild({css:this.lbxMembersCSS,key:keyid});
		this.txtLoading=this.membersField.appendNewChild({css:cssLib.textFineBig.createCSS([this.lbxMembersCSS.w/2,this.lbxMembersCSS.h/2,0],textLib["IsLoading"],200,30,1,1,1,1,[192,192,192,255]),display:0,flash:2});
		if(!this.clanVO)
		{
			// this.txtLoading=this.contentField.appendNewChild({css:cssLib.textFineBig.createCSS([this.contentW/2,this.contentH/2,0],textLib["ClanNotJoin"],200,30,1,1,1,1,[192,192,192,255]),display:1,flash:2});
			this.rankTxt.setDisplay(0);
			return;
		}
		this.getRankList();
	};

	__Page.pmtLandToday.leave=function(nextState)
	{
		this.pmtFrame.getItemById("dlgCloseKey").setKey(0);
		this.btnClose.setKey(0);
		var appEnv=this.appEnv;
		appEnv.hudOut(this.pmtFrame,0,function(){
			this.pmtFrame.getFather().removeChild(this.pmtFrame);
		},this);
	};

	__Page.pmtLandToday.setTopData=function(vo)
	{
		// if(!vo)
			// return;
		if(this.rankingTxt)
		{
			this.rankingTxt.setText(vo.ranking+1);
			DBOut("rankingTxt"+vo.ranking)
		}
		if(this.clanInfoLine)
		{
			this.topField.removeChild(this.clanInfoLine);
			var defLib=window.aisEnv.defLib.clanCupDomains;
			var domains=[];
			if(vo.ownerDomains&&vo.ownerDomains.length>0)
			{
				var i,n;
				n=vo.ownerDomains.length;
				for(i=0;i<n;i++)
				{
					var domain=vo.ownerDomains[i];
					domains.push(defLib[domain].name);
				}
			}
			var curScore=0;
			if(vo.mem&&vo.mem.length>0)
			{
				var i,n;
				n=vo.mem.length
				for(i=0;i<n;i++)
				{
					if(vo.mem[i].curClanCupScore)
						curScore+=vo.mem[i].curClanCupScore;
				}
			}
			this.clanInfoLine=this.topField.appendNewChild({css:this.infoLineCSS.createCSS(
				{
					targetDomain:vo.targetDomain?defLib[vo.targetDomain].name:"",
					// targatScore:vo.targatScore,
					targatScore:vo.targatScore,
					curScore:curScore,
					curMaxScore:vo.curMaxScore,
					ownerDomains:domains,
					selfScore:vo.selfScore,
				}
			)});
		}
	};
	__Page.pmtLandToday.getRankList=function()
	{
		if(this.dwrObj)
			return;
		var clanId=window.aisGame.curCity.allianceId;
		var param=["ClanDwr","getClanCupCurReport",clanId?clanId:-1,window.USERID];
		this.lbxMembers.clearItems();
		this.txtLoading.setText(this.appEnv.textLib["IsLoading"]);
		this.txtLoading.setDisplay(1);
//		this.dwrObj=this.appEnv.newMsg(param,{cb:function(vo){
//			// var vo1={"curMaxScore": 10, "mem": [{"curClanCupScore": 0, "donateUnits": 0, "donateUnits2SelfVOs": [], "hisClanCupScore": 0, "joinClanTime": 0, "name": "wzg", "rankLevel": 1, "score": 0, "totalUnitPlace": 10, "units": [], "userExp": 443, "userId": 1015361, "vipLevel": 0}], "ownerDomains": ["haha","haha1","haha2"], "ranking": 49, "selfScore": 1, "targatScore": 1};
//			DBOut("getRankList: "+toJSON(vo));
//			this.onGetRank(vo);
//		},cbobj:this,eh:function(err,msg){this.dwrObj=null;this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);DBOut("msg="+msg);},ehobj:this},window.ClanDWRUrl);

//		if(this.appEnv.landWarDetail)
//		{
//			this.onGetRank(this.appEnv.landWarDetail);
//		}
//		else
		{
			this.page.stateHome.getClanLandWarToday(function(vo){
				this.onGetRank(vo);
			},this,function(){
				this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);
			},this);
		}
	};
	__Page.pmtLandToday.onGetRank=function(vo)
	{
		if(!vo)
		{
			this.txtLoading.setText(this.appEnv.textLib["GetInfoEh"]);
			return;
		}
		this.pmtVO.pmtObj.infoBox.getItemById("score")._setText(this.appEnv.getClanLandWarScore());
		this.addPlayersList(vo);
		this.setTopData(vo);
	};
	__Page.pmtLandToday.addPlayersList=function(vo)
	{
		if(!vo)
			return;
		this.txtLoading.setDisplay(0);
		this.dwrObj=null;
		this.lbxMembers.clearItems();
		vo.mem.sort(function(a,b){return b.curClanCupScore-a.curClanCupScore;});
		this.addPlayers(this.lbxMembers,vo.mem);
	};
	__Page.pmtLandToday.addPlayers=function(lbx,vo,rankType)
	{
		var i,item,css,items=[],keyid;
		if(!vo)
		{
		}
		else
		{
			//DBOut("addPlayers:"+toJSON(vo));
			var players=vo;
			if(!this.viewKeys)
				this.viewKeys={};
			this.logKeys={};
			//	DBOut("position:"+this.clanInitVO.rankLevel+", leader:"+this.msgObj.CLAN_RANK_LEADER+", selfCID:"+this.clanInitVO.clanVO.id+", viewCID:"+vo.id);
			for(i=0; i<players.length; i++)
			{
				if("blank"==players[i])
					item={type:"icon"};
				else
				{
					players[i].allianceFlag=this.clanVO.flag;
					players[i].allianceName=this.clanVO.name;			
					item=this.playerLineCSS.createCSS(players[i],i+1,rankType);//0==rankType?1:0
				}
				item.info=players[i];
				var idx=lbx.addItem(item);
			}
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtLandToday.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.pmtBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//点击顶部菜单
		__Page.pmtLandToday.onMemberClk=function(msg,key,way,extra)
		{
			if(1==way)
			{
				if(0==msg)
				{
				//	DBOut("onLogClk down");
					this.lbxResponse=1;
				}
				else if(2==msg)
				{
					DBOut("this.onPlayerClk");
					if(this.lbxResponse)
					{
						var lbx=this.lbxMembers;
						var item=lbx.itemAt(extra);
						var info=item.info;
						DBOut("visit:"+toJSON(info));
						if(!info.userId || info.userId==window.USERID)
							return;
						var appEnv=this.appEnv;
						var textLib=appEnv.textLib;
						appEnv.showPmtDlg(this.page.pmtChoose,0,
							{
								title:textLib["ConfirmVisit"],info:textLib["ConfirmVisitDesc"](info.name),
								pmtFunc:function(ok,info){
									if(ok)
									{
										this.appEnv.closeDlg(null,null,0);
										this.page.stateHome.onVisitClick(info.userId);
									}
								},pmtObj:this,pmtParam:info
							}
						);
					}
					this.lbxResponse=0;
				}
			}
		};
	}
}
