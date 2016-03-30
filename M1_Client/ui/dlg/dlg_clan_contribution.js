{//联盟贡献
	__Page.dlgClan.Contribution_loadUI=function(state,param)
	{
		if(!this.state_Contribution)
			this.state_Contribution={name:"Contribution"};
		if(!state)
			state=this.state_Contribution;
		if(state.loaded)return;
		state.loaded=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner, dt=this.dt;

		var listX=cntInner[0], listY=cntInner[1], listW=cntW-cntInner[0]*2, listH=cntH-cntInner[1]*2;
		var itemW=listW, itemH=66;
		this.lbxContributionCSS={type:"listbox",id:"lbx-constribution",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,//dlg:state,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=itemW/2, itemY=itemH/2;
		pic=imgLib.getImg("box_achieve");
		var centerW=itemW, centerH=56, centerX=-centerW/2, centerY=-centerH/2, centerInner=[pic.mgL,pic.mgU];
		var rankW=92, rankH=centerH-16, rankX=centerInner[0]/2+rankW/2, rankY=centerH/2-2;
		var iconSize=48, iconX=rankX+rankW/2+dt*2, iconY=rankY;
		var nameX=iconX+iconSize+dt*2, nameY=centerH/3, nameW=340, nameH=centerH*2/3;
		var positionX=nameX, positionY=centerH*5/6-7, positionW=nameW, positionH=centerH*2/6;
		var boxW=100, boxH=44, boxY=(centerH-boxH)/2-2, boxTX=dt, boxTY=11, boxBX=boxTX, boxBY=boxH-boxTY;
		var techX=centerW-8-boxW, cbX=techX-4-boxW, techTimesX=cbX-4-boxW, cbTimesX=techTimesX-4-boxW;
		var btnW=90, btnH=40, btnX=cbTimesX-btnW/2-10;
		var gemCSS=imgLib.getIcon("res_gem",64);
		gemCSS.w=gemCSS.h=26;

		this.conbributionLineCSS={
			createCSS:function(vo,rank)
			{
				var rankCSS, iconCSS;
				rankCSS=imgLib.getImg("box_clan_rank4");

				var bgCSS=(vo.userId==window.USERID)?imgLib.getImg("box_self"):imgLib.getImg("box_achieve");
				iconCSS=imgLib.getIcon("level",64);
				iconCSS.w=iconCSS.h=iconSize;

				var vip=vo.vipLevel, vipScale=0.5, vipPic=imgLib.getImg("pic_VIP"+vip);
				var vipW=Math.floor(vipPic.w*vipScale), vipH=Math.floor(vipPic.h*vipScale);
				var vipCSS={css:vipPic,w:vipW,h:vipH};
				if(!vip)vipCSS={w:0,h:0};

				var lineW=centerW, lineH=centerH;
				return {type:"div3x3",pos:[0,0,0],w:lineW,h:lineH,anchor_h:0,anchor_v:0,css:bgCSS,items:[
					{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:1,anchor_v:1,items:[cssLib.textFineMid.createCSS([0,0,0],rank,rankW,rankH,1,1,1,1)]},
					{css:cssLib.iconText.createCSS([iconX,iconY,0],iconCSS,appEnv.getLevelByExp(vo.userExp),1,null,0,-2)},
					{css:cssLib.iconText.createCSS([nameX,nameY,0],vipCSS,vo.name?vo.name:(vo.userId+""),2,(vo.userId==window.USERID)?[10,200,255,255]:null,FS.FM)},
					{id:"position",css:cssLib.textFineSmall.createCSS([positionX,positionY,0],textLib["ClanPosition"+vo.rankLevel],positionW,positionH,0,1,0,1)},
					{type:"div3x3",pos:[techX,boxY,0],w:boxW,h:boxH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_dark"),items:[
					//	{type:"text",pos:[boxTX,boxTY,0],text:textLib["TechGem"],anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.L},
						{css:cssLib.textFineMid.createCSS([boxTX,boxTY,0],textLib["TechGem"],10,10,0,1,0,1),font_size:FS.L},
						{css:cssLib.iconText.createCSS([boxBX,boxBY,0],gemCSS,vo.tmpTechGems,2,null,FS.L)}
					]},
					{type:"div3x3",pos:[cbX,boxY,0],w:boxW,h:boxH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_dark"),items:[
					//	{type:"text",pos:[boxTX,boxTY,0],text:textLib["ContributionGem"],anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.L},
						{css:cssLib.textFineMid.createCSS([boxTX,boxTY,0],textLib["ContributionGem"],10,10,0,1,0,1),font_size:FS.L},
						{css:cssLib.iconText.createCSS([boxBX,boxBY,0],gemCSS,vo.tmpContributionGems,2,null,FS.L)}
					]},
					{type:"div3x3",pos:[techTimesX,boxY,0],w:boxW,h:boxH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_dark"),items:[
					//	{type:"text",pos:[boxTX,boxTY,0],text:textLib["TechTimes"],anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.L},
						{css:cssLib.textFineMid.createCSS([boxTX,boxTY,0],textLib["TechTimes"],10,10,0,1,0,1),font_size:FS.L},
						{css:cssLib.textFineMid.createCSS([boxBX,boxBY,0],vo.tmpTechTimes,10,10,0,1,0,1),font_size:FS.L}
					]},
					{type:"div3x3",pos:[cbTimesX,boxY,0],w:boxW,h:boxH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_dark"),items:[
					//	{type:"text",pos:[boxTX,boxTY,0],text:textLib["ContributionTimes"],anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.L},
						{css:cssLib.textFineMid.createCSS([boxTX,boxTY,0],textLib["ContributionTimes"],10,10,0,1,0,1),font_size:FS.L},
						{css:cssLib.textFineMid.createCSS([boxBX,boxBY,0],vo.tmpContributionTimes,10,10,0,1,0,1),font_size:FS.L}
					]},
					///////////////按钮
					{id:"manage",css:cssLib.normalBtn.createCSS([btnX,lineH/2,0],0,0,textLib["Manage"],btnW,btnH),display:0},
				]};
			}
		};
	};
	__Page.dlgClan.Contribution_loadUI();

	__Page.dlgClan.Contribution_initUI=function(state,param)
	{
		if(!state)
			state=this.state_Contribution;
		if(state.inited)return;
		state.inited=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		var cntBox=state.cntBox=this.cntBox.appendNewChild({id:"clanContribution",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
	//	this.addMemberBox(state,cntBox);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMemberClk);
		state.lbxMember=cntBox.appendNewChild({css:this.lbxContributionCSS,key:keyid});
	};

	__Page.dlgClan.Contribution_enter=function(state,param)
	{
		if(!state)
		{
			state=this.state_Contribution;
			this.curState=state;
			param={members:[]};
			if(this.clanInitVO)
			{
				param=this.clanInitVO.clanVO;
			}
		}
		state.cntBox.fadeIn(5,0);

	//	this.setClanInfo(state,param);
	//	this.addMembers(state,state.lbxMember,param);
		var appEnv=this.appEnv;
		var page=this.page;
		var home=page.stateHome;
		if(appEnv.landWarDetail)
		{
			this.addContributions(state,state.lbxMember,param);
		}
		else if(!this.todayGeted)
		{
			home.getClanLandWarToday(function(){
				this.todayGeted=1;
				this.addContributions(state,state.lbxMember,param);
			},this);
		}
	};
	
	__Page.dlgClan.Contribution_leave=function(isHide)
	{
		var state=this.state_Contribution;
		this.appEnv.hudOut(state.cntBox,5,function(){
			if(!isHide)
			{
				state.lbxMember.clearItems();
			}
		},this);
		if(state.status=="Edit")
			this["Create_leave"]();
	};

	__Page.dlgClan.addContributions=function(state,lbx,vo)
	{
	//	this.clanInitVO.rankLevel=1;
		var i,item,items=[],keyid,totalScore=0;
		if(this.clanInitVO)
		{
			var voSelf=this.clanInitVO.clanVO.members;
		}
		if(!vo)
		{
		}
		else
		{
			var members=vo.members;
			members.sort(function(a,b){return b.tmpTotalGems-a.tmpTotalGems;});
			this.optKeys={};
			var idx, selfRank, memberRank;
			for(i=0; i<members.length; i++)
			{
				totalScore+=members[i].score;
				item=this.conbributionLineCSS.createCSS(members[i],i+1);
				item.info=members[i];
				idx=lbx.addItem(item);

				//////////////测试用
				if(this.clanInitVO)
				{
					selfRank=this.clanInitVO.rankLevel;
					memberRank=members[i].rankLevel;
					if(this.clanInitVO && this.clanInitVO.clanVO.id==vo.id)
					{
						if(
							selfRank!=this.msgObj.CLAN_RANK_MEMBER && selfRank!=this.msgObj.CLAN_RANK_NON_MEMBER &&
							(selfRank==this.msgObj.CLAN_RANK_LEADER || this.getRankCompare(selfRank, memberRank))
						)
						{
							keyid=appEnv.hudKeys.getKey(this);
							this.regKeyVO(keyid,this,this.onManageClk);
							this.optKeys[keyid+""]={id:members[i].userId,name:members[i].name,lbx:lbx,idx:i,member:members[i],rankLevel:memberRank};
							lbx.itemAt(idx).getItemById("manage").setKey(keyid);
							lbx.itemAt(idx).getItemById("manage").setDisplay(1);
						}
					}
				}
			}
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{

	}
}