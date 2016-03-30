{//军团成员列表相关css
	this.MembersCSS_loadUI=function()
	{
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var pic=imgLib.getImg("pic_clan_top");
		var picX=this.contentInner[0]-3;
		var picY=this.contentInner[1]/2;
		var picW=this.contentW-picX*2;
		var picH=156;
		pic=imgLib.getImg("pic_backlight");
		var clanIconW=176;//pic.w;
		var clanIconH=176;//pic.h;
		var clanIconX=clanIconW/2+this.dt;
		var clanIconY=picH/2;
		var clanIconCSS={type:"icon",pos:[clanIconX,clanIconY,0],css:pic,anchor_h:1,anchor_v:1,w:140,h:140,items:[
			{type:"icon",id:"pic-obj",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon("level",64)}
		]};
		var clanNameX=clanIconW+this.dt*2;
		var clanNameY=15;
		var clanNameW=170;
		var clanNameH=30;
		var titleX=clanNameX;
		var cntX=clanNameX+202;//290;
		var txtLineH=24;
		var clanScoreY=clanNameY+clanNameH/2+txtLineH/2;
		var clanNumsY=clanScoreY+txtLineH;
		var clanRequireY=clanNumsY+txtLineH;
		var medalNeedY=clanRequireY+txtLineH;
		var clanRankY=medalNeedY+txtLineH;
		pic=imgLib.getIcon("medal",64);
		pic.w=pic.h=40;
		var clanMedalX=cntX+this.dt+pic.w/2;
		var clanMedalY=clanScoreY;
		var btnW=104;//114;
		var btnH=44;//46;
		var btnX=picW-8-btnW/2, btnX2=btnX-8-btnW;
		var btnY=picH-8-btnH/2, btnY2=btnY-btnH-6, btnY3=btnY2-btnH-6;
		var decTitleX=clanMedalX+pic.w/2+this.dt;
		var decTitleY=38;
		var decTitleW=btnX2-btnW/2-8-decTitleX;//picW-decTitleX-btnW-4;
		var decTitleH=24;
		var decCntX=decTitleX;
		var decCntY=decTitleY+decTitleH/2+this.dt;
		var decCntW=decTitleW;
		var decCntH=picH-decTitleH-decTitleH/2-this.dt*3;
		var lvW=10, lvH=22, lvX=9, lvY=clanNameY;
		var upW=92, upH=30, upX=82+upW/2, upY=lvY;
		var gemH=30, gemX=lvX, gemY=clanIconY+32+10, gemIcon=imgLib.getIcon("res_gem",64);
		var tokX=lvX, tokY=gemY+22, tokIcon=imgLib.getIcon("res_clanexp",64);
		gemIcon.w=gemIcon.h=tokIcon.w=tokIcon.h=gemH;
		var uvInfo={uv3x3:[25/1024,20/1024,22/1024,24/1024],size3x3:[18,15,18,15]};
		this.memberTopCSS={id:"topBox",type:"icon",pos:[picX,picY,0],w:picW,h:picH,css:imgLib.getImg("pic_clan_top"),ui_event:1,items:[
			{id:"badge",css:clanIconCSS},
			{id:"level",css:cssLib.textFineMid.createCSS([lvX,lvY,0],"Lv.???",lvW,lvH,0,1,0,1,[248,246,102,0],0)},
			{id:"upgrade",css:cssLib.picBtn.createCSS([upX,upY,0],0,imgLib.getImg("pic_clan_up"),""),display:0},//,upW,upH
		//	{id:"gem-line",css:cssLib.iconText.createCSS([gemX,gemY,0],gemIcon,"???",0,null,0,0)},
			{id:"gem-icon",type:"icon",pos:[gemX+gemH/2,gemY,0],anchor_h:1,anchor_v:1,css:gemIcon},
			{id:"gem-line",css:cssLib.textScoreSmall.createCSS([gemX+gemH+2,gemY,0],"0",60,30,0,1,0,1),font_size:20,num:-1},
		//	{id:"point-line",css:cssLib.iconText.createCSS([tokX,tokY,0],tokIcon,"???",0,null,0,0)},
			{id:"point-icon",type:"icon",pos:[tokX+gemH/2,tokY,0],anchor_h:1,anchor_v:1,css:tokIcon},
			{id:"point-line",css:cssLib.textScoreSmall.createCSS([tokX+gemH+2,tokY,0],"0",60,30,0,1,0,1),font_size:20,num:-1},
			{id:"name",css:cssLib.textFineMid.createCSS([clanNameX,clanNameY,0],textLib["ClanName"],clanNameW,clanNameH,0,1,0,1,[248,246,102,0],0)},
			{css:cssLib.textFineSmall.createCSS([titleX,clanScoreY,0],textLib["ClanScore"],clanNameW,txtLineH,0,1,0,1),font_size:18},
			{id:"score",css:cssLib.textFineSmall.createCSS([cntX,clanScoreY,0],"???",clanNameW,txtLineH,2,1,2,1),font_size:18},
			{type:"icon",pos:[clanMedalX,clanMedalY,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon("medal",64),w:32,h:32},
			{css:cssLib.textFineSmall.createCSS([titleX,clanNumsY,0],textLib["ClanMembers"],clanNameW,txtLineH,0,1,0,1),font_size:18},
			{id:"num",css:cssLib.textFineSmall.createCSS([cntX,clanNumsY,0],"???/???",clanNameW,txtLineH,2,1,2,1),font_size:18},
			{css:cssLib.textFineSmall.createCSS([titleX,clanRequireY,0],textLib["JoinRequire"],clanNameW,txtLineH,0,1,0,1),font_size:18},
			{id:"join-type",css:cssLib.textFineSmall.createCSS([cntX,clanRequireY,0],"自由加入",clanNameW,txtLineH,2,1,2,1),font_size:18},
			{css:cssLib.textFineSmall.createCSS([titleX,medalNeedY,0],textLib["MedalNeed"],clanNameW,txtLineH,0,1,0,1),font_size:18},
			{id:"require",css:cssLib.textFineSmall.createCSS([cntX,medalNeedY,0],"200勋章以上",clanNameW,txtLineH,2,1,2,1),font_size:18},
			{id:"rankTxt",css:cssLib.textFineSmall.createCSS([titleX,clanRankY,0],textLib["ClanRankNum"],clanNameW,txtLineH,0,1,0,1),font_size:18,display:0},
			{id:"rank",css:cssLib.textFineSmall.createCSS([cntX,clanRankY,0],"???",clanNameW,txtLineH,2,1,2,1),font_size:18,display:0},
			cssLib.textFineMid.createCSS([decTitleX,decTitleY-20,0],textLib["ClanDeclare"],decTitleW,decTitleH,0,1,0,1),
			{id:"declare",css:cssLib.textFineSmall.createCSS([decCntX,decCntY-20,0],"宣言是什么",decCntW,decCntH,0,0,0,0,null,1),font_size:18},
			{id:"join",css:cssLib.normalBtn.createCSS([btnX,btnY,0],0,0,textLib["Join"],btnW,btnH,0,uvInfo),display:0},
			{id:"leave",css:cssLib.normalBtn.createCSS([btnX,btnY,0],0,0,textLib["Leave"],btnW,btnH,0,uvInfo),display:0},
			{id:"donate",css:cssLib.normalBtn.createCSS([btnX,btnY2,0],0,0,textLib["DonateClan"],btnW,btnH,0,uvInfo),display:0},
			{id:"sign",css:cssLib.normalBtn.createCSS([btnX,btnY3,0],0,0,textLib["SignClan"],btnW,btnH,0,uvInfo),display:0},
			{id:"tech",css:cssLib.normalBtn.createCSS([btnX2,btnY,0],0,0,textLib["ClanTech"],btnW,btnH,0,uvInfo),display:0},
			{id:"gem-storage",css:cssLib.normalBtn.createCSS([btnX2,btnY2,0],0,0,textLib["GemStorage"],btnW,btnH,0,uvInfo),display:0},
			{id:"edit",css:cssLib.normalBtn.createCSS([btnX2,btnY3,0],0,0,textLib["Edit"],btnW,btnH,0,uvInfo),display:0},
		]};

		var listX=picX;
		var listY=picY+picH+this.dt;
		var listW=picW;
		var listH=this.contentH-listY;
		var itemW=listW;
		var itemH=this.lbxItemH=66;
		this.lbxMemberCSS={type:"listbox",id:"lbx-member",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,//dlg:state,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=itemW/2;
		var itemY=itemH/2;
		pic=imgLib.getImg("box_achieve");
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
		var iconX=rankX+rankW/2+this.dt*2;
		var iconY=rankY;

		var nameX=iconX+iconSize+this.dt*2;
		var nameY=centerH/3;
		var nameW=340;
		var nameH=centerH*2/3;
		var positionX=nameX;
		var positionY=centerH*5/6-7;
		var positionW=nameW;
		var positionH=centerH*2/6;

		var medalW=136-46;
		var medalX=centerW-centerInner[0]-medalW;
		var medalY=centerH/2;
		var donateW=136;
		var donateX=medalX-donateW-10;
		var supportW=136, supportX=donateX-supportW-10;
		btnW=90, btnH=40, btnX=supportX-btnW/2-10;

		this.lbxBtnX=btnX, this.lbxBtnY=centerH/2;
		this.memberLineCSS={
			w:centerW,h:centerH,
			createCSS:function(vo,rank,isSelfClan)
			{
				//DBOut("memberLineCSS, vo:"+toJSON(vo)+", rank:"+rank);
				var rankCSS, iconCSS;
			//	if(vo.rankLevel<4){
			//		rankCSS=imgLib.getImg("box_clan_rank"+vo.rankLevel);
			//	}else{
					rankCSS=imgLib.getImg("box_clan_rank4");
			//	}

				var bgCSS=(vo.userId==window.USERID)?imgLib.getImg("box_self"):imgLib.getImg("box_achieve");
				iconCSS=imgLib.getIcon("level",64);
				iconCSS.w=iconCSS.h=iconSize;

				var vip=vo.vipLevel, vipScale=0.5, vipPic=imgLib.getImg("pic_VIP"+vip);
				var vipW=Math.floor(vipPic.w*vipScale), vipH=Math.floor(vipPic.h*vipScale);
				var vipCSS={css:vipPic,w:vipW,h:vipH};
				if(!vip)vipCSS={w:0,h:0};

				var lineW=this.w, lineH=this.h;
				var position=textLib["ClanPosition"+vo.rankLevel];
				if(isSelfClan && vo.internshipTime)position=position+" ( "+textLib["RemainTime"]+textLib.getTimeText(vo.internshipTime)+" )";
				return {type:"div3x3",pos:[0,0,0],w:lineW,h:lineH,anchor_h:0,anchor_v:0,css:bgCSS,items:[
					{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:1,anchor_v:1,items:[cssLib.textFineMid.createCSS([0,0,0],rank,rankW,rankH,1,1,1,1)]},
					{css:cssLib.iconText.createCSS([iconX,iconY,0],iconCSS,appEnv.getLevelByExp(vo.userExp),1,null,0,-2)},
				//	{css:cssLib.textFineMid.createCSS([nameX,nameY,0],vo.name,nameW,nameH,0,1,0,1,(vo.userId==window.USERID)?[10,200,255,255]:null)},
					{css:cssLib.iconText.createCSS([nameX,nameY,0],vipCSS,vo.name?vo.name:(vo.userId+""),2,(vo.userId==window.USERID)?[10,200,255,255]:null,FS.FM)},
					{id:"position",css:cssLib.textFineSmall.createCSS([positionX,positionY,0],position,positionW,positionH,0,1,0,1)},
					{type:"div3x3",pos:[medalX,medalY,0],w:medalW,h:lineH-12*2,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
						{type:"text",pos:[5,0,0],text:vo.score+"",anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.L},
						{type:"icon",pos:[medalW-36+14,0,0],anchor_h:1,anchor_v:1,w:40,h:40,css:imgLib.getIcon("medal",64)}
					]},
					{type:"div3x3",pos:[donateX,medalY,0],w:donateW,h:lineH-12*2,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
						{type:"text",pos:[5,0,0],text:textLib["DonateCnt"]+"："+vo.donateUnits+"",anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.L},
					]},
					{type:"div3x3",pos:[supportX,medalY,0],w:supportW,h:lineH-12*2,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
						{type:"text",pos:[5,0,0],text:textLib["SupportCnt"]+"："+vo.receiveUnits+"",anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.L},
					]},
					///////////////测试用
					{id:"manage",css:cssLib.normalBtn.createCSS([btnX,lineH/2,0],0,0,textLib["Manage"],btnW,btnH),display:0},
					{id:"kick",css:cssLib.normalBtn.createCSS([btnX,lineH/2,0],0,0,textLib["ClanKick"],btnW,btnH),display:0},
					{id:"promote",css:cssLib.normalBtn.createCSS([btnX-btnW-10,lineH/2,0],0,0,textLib["ClanPromote"],btnW,btnH),display:0},
				]};
			}
		};
	};
	this.MembersCSS_loadUI();

	this.addMemberBox=function(state,box)
	{
		var picTop=state.picTop=box.appendNewChild({css:this.memberTopCSS});
		state.iconBadge=picTop.getItemById("badge").getItemById("pic-obj");
		state.clanLevel=picTop.getItemById("level");
		state.clanGemIcon=picTop.getItemById("gem-icon");
		state.clanGem=picTop.getItemById("gem-line");
		state.clanPointIcon=picTop.getItemById("point-icon");
		state.clanPoint=picTop.getItemById("point-line");
		state.clanName=picTop.getItemById("name");
		state.clanScore=picTop.getItemById("score");
		state.clanMembers=picTop.getItemById("num");
		state.joinType=picTop.getItemById("join-type");
		state.joinRequire=picTop.getItemById("require");
		state.clanRankTxt=picTop.getItemById("rankTxt");
		state.clanRank=picTop.getItemById("rank");
		state.clanDeclare=picTop.getItemById("declare");
		state.btnJoin=picTop.getItemById("join");
		state.btnLeave=picTop.getItemById("leave");
		state.btnEdit=picTop.getItemById("edit");
		state.btnUpgrade=picTop.getItemById("upgrade");
		state.btnDonate=picTop.getItemById("donate");
		state.btnSign=picTop.getItemById("sign");
		state.btnTech=picTop.getItemById("tech");
		state.btnGemStorage=picTop.getItemById("gem-storage");
		var appEnv=this.appEnv;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onJoinClk);
		state.btnJoin.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onLeaveClk);
		state.btnLeave.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onEditClk);
		state.btnEdit.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onUpgradeClk);
		state.btnUpgrade.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onDonateClk);
		state.btnDonate.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSignClk);
		state.btnSign.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onTechClk);
		state.btnTech.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onGemStorageClk);
		state.btnGemStorage.setKey(keyid);

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMemberClk);
		state.lbxMember=box.appendNewChild({css:this.lbxMemberCSS,key:keyid});
		appEnv.addLoopScale(state.btnUpgrade,0.1,{minX:0.95,maxX:1.05,minY:0.95,maxY:1.05});
	};

	this.addMembers=function(state,lbx,vo)
	{
	//	this.clanInitVO.rankLevel=1;
		var i,item,items=[],keyid,totalScore=0;
		if(this.clanInitVO)
		{
			var voSelf=this.clanInitVO.clanVO.members;
			//DBOut("members:"+toJSON(voSelf));
		}
		if(!vo)
		{
//			for(i=0; i<10; i++)
//			{
//				item=this.memberLineCSS.createCSS({donateUnits:9,name:"clan"+i,rankLevel:i+1,score:9999,userExp:900,userId:0},i+1);
//				lbx.addItem(item);
//			}
		}
		else
		{
			var isSelfClan=0;
			if(vo.id==window.aisGame.curCity.allianceId)
				isSelfClan=1;
			//DBOut("addMembers:"+toJSON(vo));
			var totalMedal=this.appEnv.getClanMedal(vo);
			var members=vo.members;
		//	members.sort(function(a,b){return b.score-a.score;});
			this.kickKeys={};
			this.optKeys={};
			this.promoteKeys={};
			//	DBOut("position:"+this.clanInitVO.rankLevel+", leader:"+this.msgObj.CLAN_RANK_LEADER+", selfCID:"+this.clanInitVO.clanVO.id+", viewCID:"+vo.id);
			var idx, selfRank, memberRank;
//			if(!window.fakeAdd)
//			{
//				members.push({"name": "放飞自我1", "rankLevel": 0, "score": 0, "totalUnitPlace": 10, "units": [], "userExp": 3675, "userId": 1015345, "vipLevel": 3});
//				members.push({"name": "放飞自我2", "rankLevel": 2, "score": 0, "totalUnitPlace": 10, "units": [], "userExp": 3675, "userId": 1015345, "vipLevel": 3});
//				members.push({"name": "放飞自我3", "rankLevel": 3, "score": 0, "totalUnitPlace": 10, "units": [], "userExp": 3675, "userId": 1015345, "vipLevel": 3});
//				members.push({"name": "放飞自我4", "rankLevel": 4, "score": 0, "totalUnitPlace": 10, "units": [], "userExp": 3675, "userId": 1015345, "vipLevel": 3});
//				members.push({"name": "放飞自我5", "rankLevel": 2, "score": 0, "totalUnitPlace": 10, "units": [], "userExp": 3675, "userId": 1015345, "vipLevel": 3});
//				members.push({"name": "放飞自我6", "rankLevel": 2, "score": 0, "totalUnitPlace": 10, "units": [], "userExp": 3675, "userId": 1015345, "vipLevel": 3});
//				window.fakeAdd=1;
//			}
			for(i=0; i<members.length; i++)
			{
				totalScore+=members[i].score;
				item=this.memberLineCSS.createCSS(members[i],i+1,isSelfClan);
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
							"Self"==state.name &&
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
						/*if(
							(selfRank==this.msgObj.CLAN_RANK_LEADER && memberRank!=this.msgObj.CLAN_RANK_LEADER) ||
							(selfRank==this.msgObj.CLAN_RANK_OFFICER && memberRank==this.msgObj.CLAN_RANK_MEMBER)
						)
						{
							keyid=appEnv.hudKeys.getKey(this);
							this.regKeyVO(keyid,this,this.onKickClk);
							this.kickKeys[keyid+""]={id:members[i].userId,name:members[i].name,lbx:lbx,idx:i,member:members[i]};
							lbx.itemAt(idx).getItemById("kick").setKey(keyid);
							lbx.itemAt(idx).getItemById("kick").setDisplay(1);
						}
						if(
							(selfRank==this.msgObj.CLAN_RANK_LEADER || selfRank==this.msgObj.CLAN_RANK_OFFICER) &&
							memberRank==this.msgObj.CLAN_RANK_MEMBER
						)
						{
							keyid=appEnv.hudKeys.getKey(this);
							this.regKeyVO(keyid,this,this.onPromoteClk);
							this.promoteKeys[keyid+""]={id:members[i].userId,name:members[i].name,lbx:lbx,idx:i,rankLevel:members[i].rankLevel};
							lbx.itemAt(idx).getItemById("promote").setKey(keyid);
							lbx.itemAt(idx).getItemById("promote").setDisplay(1);
						}*/
					}
				}
			}
			if(state && state.clanScore){
			//	state.clanScore._setText(totalScore+"");
				state.clanScore._setText(totalMedal);
			}else
				DBOut("set ClanScore error: no item.");
		}
	};

	this.setClanInfo=function(state,vo)
	{
		if(this.infoVO)
		{
			var voSelf=this.infoVO.clanVO;
			//DBOut("clanVO:"+toJSON(voSelf));
		}
		if(vo)
		{
			var page=this.page;
			var imgLib=this.page.imgLib;
			var cssLib=this.page.cssLib;
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;

			state.iconBadge.setTexURL(imgLib.genIconPath("badge"+vo.flag,64));
			state.clanName._setText(vo.name);
			state.clanScore._setText(vo.honorScore);
			state.clanMembers._setText(vo.members.length+"/"+appEnv.getClanMemberMax(vo.level));//window.aisEnv.defLib.globals["MAX_CLAN_MEMBERS"]
			state.joinType._setText(textLib["ClanType"+vo.clanType]);
			state.joinRequire._setText(textLib["NeedMedal"](vo.honorScore));
			state.clanDeclare._setText(vo.description);
			state.clanRankTxt.setDisplay(0);
			state.clanRank.setDisplay(0);
			state.clanLevel._setText("Lv."+(vo.level));
			state.clanGem._setScore(appEnv.getClanResNum(vo));
			state.clanPoint._setScore(vo.point);
			state.clanGem.num=appEnv.getClanResNum(vo);
			state.clanPoint.num=vo.point;
			var maxClanLevel=window.aisEnv.defLib.clan.levels.length;
			if(!window.aisGame.curCity.allianceId)
			{
				state.btnLeave.setDisplay(0);
				state.btnJoin.setDisplay(1);
				state.btnEdit.setDisplay(0);
				state.btnUpgrade.setDisplay(0);
				state.btnDonate.setDisplay(0);
				state.btnSign.setDisplay(0);
				state.btnTech.setDisplay(0);
				state.btnGemStorage.setDisplay(0);
			}
			else if(vo.id==window.aisGame.curCity.allianceId && "Self"==state.name)//!window.aisGame.bVisit
			{
				state.btnLeave.setDisplay(1);
				state.btnJoin.setDisplay(0);
				state.btnDonate.setDisplay(1);
				state.btnSign.setDisplay(1);
				state.btnTech.setDisplay(1);
				state.btnGemStorage.setDisplay(1);
				if(this.clanInitVO)
				{
					if(this.clanInitVO.signIn)
					{
						state.btnSign.setEnabled(0);
						state.btnSign.setText(textLib["ClanSigned"]);
					}
					if(this.clanInitVO.rankLevel==this.msgObj.CLAN_RANK_LEADER)
						state.btnEdit.setDisplay(1);
					if(this.clanInitVO.rankLevel==this.msgObj.CLAN_RANK_LEADER || this.clanInitVO.rankLevel==this.msgObj.CLAN_RANK_DEPUTY_LEADER)
						state.btnUpgrade.setDisplay(1);
					if(vo.level>=maxClanLevel)
						state.btnUpgrade.setDisplay(0);
				}
				else
				{
					state.btnEdit.setDisplay(0);
					state.btnUpgrade.setDisplay(0);
				}
			//	DBOut("this.clanInitVO.rank="+this.clanInitVO.rank);
				if(page.stateHome.clanInitVO && page.stateHome.clanInitVO.rank>=0)
				{
					state.clanRankTxt.setDisplay(1);
					state.clanRank.setDisplay(1);
					state.clanRank._setText(""+(page.stateHome.clanInitVO.rank+1));
				}
			}
			else
			{
				state.btnLeave.setDisplay(0);
				state.btnJoin.setDisplay(0);
				state.btnEdit.setDisplay(0);
				state.btnUpgrade.setDisplay(0);
				state.btnDonate.setDisplay(0);
				state.btnSign.setDisplay(0);
				state.btnTech.setDisplay(0);
			}
		}
	};

	this.addMenuBox=function(keyVO)
	{
		var lbxPos=[], pos=[];
		keyVO.lbx.getPos(lbxPos);
		var item=keyVO.lbx.itemAt(keyVO.idx);
		var btn=item.getItemById("manage");
		btn.getPos(pos);
		var x=lbxPos[0]+pos[0]+20;
		var y=keyVO.lbx.getCurPos();
		y+=(this.lbxItemH*keyVO.idx);
		y=lbxPos[1]+y+this.lbxItemH/2;
	//	pos=[lbxPos[0]+this.lbxBtnX+20,lbxPos[1]+y+this.lbxItemH/2,0];
		pos=[x,y,0];
		var keyid=this.appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onCloseMenuClk);
		var menuInfo=this.getMenuList(keyVO.member);
		DBOut(toJSON(menuInfo));
	//	this.menuCloseKey=cssLib.menuBox.create(this.cntBox,keyid,pos,[{key:0,text:"ViewReplay"},{key:0,text:"ViewReplay"},{key:0,text:"ViewReplay"},{key:0,text:"ViewReplay"}]);
		this.menuCloseKey=cssLib.menuBox.create(this.cntBox,keyid,pos,menuInfo);
	};

	this.getRankPrority=function(rank)
	{
		var newRank=0;
		if(rank==this.msgObj.CLAN_RANK_LEADER)//盟主
			newRank=100;
		else if(rank==this.msgObj.CLAN_RANK_DEPUTY_LEADER)//副盟主
			newRank=99;
		else if(rank==this.msgObj.CLAN_RANK_OFFICER)//官员
			newRank=98;
		else if(rank==this.msgObj.CLAN_RANK_MEMBER)//成员
			newRank=97;
		else if(rank==this.msgObj.CLAN_RANK_NON_MEMBER)//见习
			newRank=96;
		return newRank;
	};

	this.getRankCompare=function(rank1, rank2)
	{
		var newRank1=this.getRankPrority(rank1);
		var newRank2=this.getRankPrority(rank2);
		DBOut("getRankCompare: "+newRank1+" vs"+newRank2+", result:"+(newRank1>newRank2));
		if(newRank1 > newRank2)
			return 1;
		else
			return 0;
	};

	this.getMenuList=function(member)
	{
		var selfRank=this.clanInitVO.rankLevel;
		var rank=member.rankLevel;
		var menuList=[], menuInfo=[];
		if(this.msgObj.CLAN_RANK_LEADER==selfRank)
		{
			if(member.userId==window.USERID)
			{
				menuList=["AllotGem"];
			}
			else if(this.msgObj.CLAN_RANK_DEPUTY_LEADER==rank)
			{
				menuList=["AllotGem","MakeLeader","MakeOffical","MakeMember","Kick"];
			}
			else if(this.msgObj.CLAN_RANK_OFFICER==rank)
			{
				menuList=["AllotGem","MakeLeader","MakeSubLeader","MakeMember","Kick"];
			}
			else if(this.msgObj.CLAN_RANK_MEMBER==rank)
			{
				menuList=["AllotGem","MakeLeader","MakeSubLeader","MakeOffical","Kick"];
			}
			else if(this.msgObj.CLAN_RANK_NON_MEMBER==rank)
			{
				menuList=["Kick"];
			}
		}
		else if(this.msgObj.CLAN_RANK_DEPUTY_LEADER==selfRank)
		{
			if(this.msgObj.CLAN_RANK_OFFICER==rank)
			{
				menuList=["MakeMember","Kick"];
			}
			else if(this.msgObj.CLAN_RANK_MEMBER==rank)
			{
				menuList=["MakeOffical","Kick"];
			}
			else if(this.msgObj.CLAN_RANK_NON_MEMBER==rank)
			{
				menuList=["Kick"];
			}
		}
		else if(this.msgObj.CLAN_RANK_OFFICER==selfRank)
		{
			if(this.msgObj.CLAN_RANK_MEMBER==rank)
			{
				menuList=["Kick"];
			}
			else if(this.msgObj.CLAN_RANK_NON_MEMBER==rank)
			{
				menuList=["Kick"];
			}
		}
		menuInfo=this.getMenuInfo(menuList);
		return menuInfo;
	};

	this.getMenuInfo=function(menuList)
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var i, keyid, menuInfo=[];
		for(i=0;  i<menuList.length;  i++)
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this["onMenuClk_"+menuList[i]]);
			menuInfo.push({key:keyid, text:menuList[i]});
		}
		return menuInfo;
	};

	this.updateClanPoint=function(point)
	{
		var appEnv=this.appEnv;
		appEnv.dlgLayer.setTimeout(200,function(){
			if(!point>=0)
				point=this.clanInitVO.clanVO.point;
			var stateStr=this.states[this.curStateId];
			if("Self"==stateStr)
			{
				var curState=this["state_"+stateStr];
				curState.clanPoint._setScore(point);
				curState.clanGem._setScore(appEnv.getClanResNum());
				if(curState.clanPoint.num!=point)
					appEnv.addZoomScale(curState.clanPointIcon,[1,1,1],[1.5,1.5,1],0.3);
				if(curState.clanGem.num!=appEnv.getClanResNum())
					appEnv.addZoomScale(curState.clanGemIcon,[1,1,1],[1.5,1.5,1],0.3);
				curState.clanPoint.num=point;
				curState.clanGem.num=appEnv.getClanResNum();
			}
		},this);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		this.onMemberClk=function(msg,key,way,extra)
		{
			if(1==way)
			{
				if(0==msg)
				{
				//	DBOut("onMemberClk down");
					this.lbxResponse=1;
				}
				else if(2==msg)
				{
				//	DBOut("onMemberClk check");
					if(this.lbxResponse)
					{
						DBOut("this.onMemberClk:"+extra);
						var stateStr=this.states[this.curStateId];
						var curState=this["state_"+stateStr];
						DBOut("Str:"+stateStr+",State:"+curState);
						var lbx=curState.lbxMember;
						var item=lbx.itemAt(extra);
						var info=item.info;
						//DBOut("visit:"+toJSON(info));
						if(info.userId==window.USERID)
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

		//入盟
		this.onJoinClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				//DBOut("this.onJoinClk: "+toJSON(this.visitClanVO));
				if(this.visitClanVO)
					this.joinClan(this.visitClanVO);
				else
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["ClanInfoError"]);
			}
		};

		//离开
		this.onLeaveClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("this.onLeaveClk");
				this.leaveClan();
			}
		};

		//踢人
		this.onKickClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("this.onKickClk");
				var keyVO=this.kickKeys[key+""];
				//DBOut("kick user: "+toJSON(keyVO));
				if(!keyVO.id)return;
				this.kickClan(keyVO);
			}
		};

		//委任
		this.onPromoteClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("this.onPromoteClk");
				var keyVO=this.promoteKeys[key+""];
				//DBOut("promote user: "+toJSON(keyVO));
				if(!keyVO.id)return;
				this.appointClan(keyVO);
			}
		};

		//编辑
		this.onEditClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var stateStr=this.states[this.curStateId];
				var curState=this["state_"+stateStr];
				DBOut("stateStr:"+stateStr+", curState:"+curState);

				//DBOut("this.onEditClk: "+toJSON(this.clanInitVO.clanVO));
				var keyid=this.appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this["onEditBackClk"]);
				this.btnBack.setKey(keyid);
				this.btnBack.setDisplay(1);
			//	this[stateStr+"_leave"](1);
				curState.cntBox.fadeOut(5,0)
				this["Create_loadUI"]();
				this["Create_initUI"]();
				this["Create_enter"]();
				curState.status="Edit";
			}
		};

		this.onEditBackClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var stateStr=this.states[this.curStateId];
				var curState=this["state_"+stateStr];
				DBOut("stateStr:"+stateStr+", curState:"+curState);

				DBOut("onEditBackClk");
				this["Create_leave"]();
			//	this[stateStr+"_loadUI"]();
			//	this[stateStr+"_initUI"]();
			//	this[stateStr+"_enter"]();
				curState.cntBox.fadeIn(5,0);
				if(this[stateStr+"_onBackClk"])
				{
					var keyid=this.appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this[stateStr+"_onBackClk"]);
					this.btnBack.setKey(keyid);
				}
				else
				{
					this.btnBack.setDisplay(0);
				}
				curState.status="";
			}
		};

		this.onDonateClk=function(msg,key,way,extra)//捐献
		{
			if(1==way && 1==msg)
			{
				DBOut("this.onDonateClk");
				var stateStr=this.states[this.curStateId];
				var curState=this["state_"+stateStr];
				var vo=this.clanInitVO;
				this.appEnv.showPmtDlg(this.dlgPage.pmtClan,0,{
					title:"aha",ui:"Donate",align:1,state:curState,dlg:this,
					pmtFunc:function(){},pmtObj:this,pmtParam:vo
				});
			}
		};

		this.onUpgradeClk=function(msg,key,way,extra)//联盟升级
		{
			if(1==way && 1==msg)
			{
				DBOut("this.onUpgradeClk");
				var url=this.page.genPageURL("ui/dlg/dlg_clan_upgrade.jml");
				this.appEnv.openPageDlg(url);
			}
		};

		this.onSignClk=function(msg,key,way,extra)//签到
		{
			if(1==way && 1==msg)
			{
				DBOut("this.onSignClk");
				if(this.clanInitVO.signIn==1)return;
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				this.signClan();
				var stateStr=this.states[this.curStateId];
				var curState=this["state_"+stateStr];
				curState.btnSign.setEnabled(0);
				curState.btnSign.setText(textLib["ClanSigned"]);
				this.clanInitVO.signIn=1;
				this.updateClanPoint(this.clanInitVO.clanVO.point);
			//	curState.clanPoint._setText(this.clanInitVO.clanVO.point);
			}
		};

		this.onTechClk=function(msg,key,way,extra)//联盟科技
		{
			if(1==way && 1==msg)
			{
				DBOut("this.onTechClk");
				var url=this.page.genPageURL("ui/dlg/dlg_clan_tech.jml");
				this.appEnv.openPageDlg(url);
			}
		};

		this.onGemStorageClk=function(msg,key,way,extra)//钻石仓库
		{
			if(1==way && 1==msg)
			{
				DBOut("this.onGemStorageClk");
				var stateStr=this.states[this.curStateId];
				var curState=this["state_"+stateStr];
				var vo=this.clanInitVO;
				this.appEnv.showPmtDlg(this.dlgPage.pmtClan,0,{
					title:"aha",ui:"GemInfo",align:1,state:curState,dlg:this,
					pmtFunc:function(){},pmtObj:this,pmtParam:vo
				});
			}
		};

		//关闭竖排菜单
		this.onCloseMenuClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				if(this.curOptVO)
					this.curOptVO=null;
				if(this.menuCloseKey)
				{
					this.menuCloseKey.getFather().removeChild(this.menuCloseKey);
					this.menuCloseKey=null;
				}
			}
		};

		//成员管理，菜单
		this.onManageClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("this.onManageClk");
				this.curOptVO=this.optKeys[key+""];
				var keyVO=this.optKeys[key+""];
				this.addMenuBox(keyVO);
			}
		};

		//分配钻石
		this.onMenuClk_AllotGem=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onMenuClk_AllotGem");
				var stateStr=this.states[this.curStateId];
				var curState=this["state_"+stateStr];
				var vo=this.curOptVO;
				this.appEnv.showPmtDlg(this.dlgPage.pmtClan,0,{
					title:"aha",ui:"GemAllot",align:1,state:curState,dlg:this,
					pmtFunc:function(){},pmtObj:this,pmtParam:vo
				});
				this.onCloseMenuClk(msg,key,way,extra);
			}
		};

		//设为盟主
		this.onMenuClk_MakeLeader=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onMenuClk_MakeLeader");
				var vo=this.curOptVO;
				if(!vo)return;
				this.appointClan(vo,this.msgObj.CLAN_RANK_LEADER);
				this.onCloseMenuClk(msg,key,way,extra);
			}
		};

		//设为副盟主
		this.onMenuClk_MakeSubLeader=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onMenuClk_MakeSubLeader");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(!appEnv.getSubLeaderCan())
				{
					appEnv.stateLogs.showLog(textLib["SubLeaderMax"]);
					return;
				}
				var vo=this.curOptVO;
				if(!vo)return;
				this.appointClan(vo,this.msgObj.CLAN_RANK_DEPUTY_LEADER);
				this.onCloseMenuClk(msg,key,way,extra);
			}
		};

		//设为官员
		this.onMenuClk_MakeOffical=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onMenuClk_MakeOffical");
				var vo=this.curOptVO;
				if(!vo)return;
				this.appointClan(vo,this.msgObj.CLAN_RANK_OFFICER);
				this.onCloseMenuClk(msg,key,way,extra);
			}
		};

		//设为普通成员
		this.onMenuClk_MakeMember=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onMenuClk_MakeMember");
				var vo=this.curOptVO;
				if(!vo)return;
				this.appointClan(vo,this.msgObj.CLAN_RANK_MEMBER);
				this.onCloseMenuClk(msg,key,way,extra);
			}
		};

		//踢出联盟
		this.onMenuClk_Kick=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onMenuClk_Kick");
				var vo=this.curOptVO;
				this.kickClan(vo);
				this.onCloseMenuClk(msg,key,way,extra);
			}
		};
	}
}