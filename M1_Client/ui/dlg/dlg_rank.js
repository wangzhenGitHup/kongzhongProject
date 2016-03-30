if(!__Page.dlgRank)
{
	__Page.dlgRank=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,8);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgRank;
	__Page.dlgRank.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;

		var pic=imgLib.getImg("btn_blue_u");
		var topListX=this.toplistX=this.closeBtnW+10;
		var topListY=this.toplistY=this.closeBtnY;
		var topListW=this.topListW=this.dlgW-this.closeBtnW-topListX-16;
		var topListH=this.topListH=this.closeBtnH;
		var menuW=this.menuW=pic.w+10;
		var menuH=this.menuH=pic.h;
		var menuX=this.menuX=menuW/2;
		var menuY=this.menuY=menuH/2;
		this.lbxMenuCSS={type:"listbox",id:"lbx-menu",pos:[topListX,topListY,0],w:topListW,h:topListH,anchor_h:0,anchor_v:1,ui_event:1,sub_event:1,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:menuW,item_h:menuH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		this.curStateId=-1;
		<include check=0>"dlg_css_members.js"</include>//成员列表
		<include check=0>"dlg_css_clans.js"</include>//联盟列表
		<include check=0>"dlg_css_players.js"</include>//玩家列表
		<include check=0>"dlg_css_res.js"</include>//资源排行
		<include check=0>"dlg_css_mac.js"</include>//生死排行

		<include check=0>"dlg_clan_search.js"</include>//搜索
		<include check=0>"dlg_rank_clans.js"</include>//联盟排行
		<include check=0>"dlg_rank_players.js"</include>//玩家排行
		<include check=0>"dlg_rank_res.js"</include>//资源排行
		<include check=0>"dlg_rank_resA.js"</include>//资源排行
		<include check=0>"dlg_rank_mac.js"</include>//生死排行
//		for(var i=0; i<this.states.length; i++)
//		{
//			this[this.states[i]+"_loadUI"]();
//		}
	};
	__Page.dlgRank.init=function(appEnv)
	{
		this.name="dlgRank";
		this.viewId="dlgRank";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMenuClk);
		this.lbxMenu=this.dlgFrame.appendNewChild({css:this.lbxMenuCSS,key:keyid});
		this.txtLoading=this.dlgFrame.appendNewChild({css:cssLib.textFineBig.createCSS([this.boxW/2,this.boxH/2,0],textLib["IsLoading"],200,30,1,1,1,1,[192,192,192,255]),display:0,flash:2});
	};

	__Page.dlgRank.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		//根据VO初始化界面:
	//	if(!vo)vo={clanId:9};
		this.infoVO=vo;
		this.clanInitVO=vo;
		//DBOut("dlgRank, infoVO:"+this.infoVO);

		this.states=["Clan","Player","MacPve","ResSingle","ResAverage","Search"];

		var i,item,items=[];
		for(i=0; i<this.states.length; i++)
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this["onClk_"+this.states[i]]);
			item=cssLib.normalBtn.createCSS([this.menuX,this.menuY,0],keyid,2,textLib["Rank"+this.states[i]]);
			this.lbxMenu.addItem(item);
		}

		this.dlgTitle.setDisplay(0);
		this.lbxMenu.itemAt(0).setEnabled(0);
	//	this.timer=setFrameout(window.DelayLoad,function(){
		appEnv.setDlgAniCall(function(){
			this.onMenuClk(2,0,1,0);
			this.timer=null;
		},this);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgRank.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgRank.showUI=function(ui,state,param)
	{
		if(this.curStateId>-1)
		{
			this[this.states[this.curStateId]+"_leave"]();
		}
		if(this.dwrObj)
		{
			DWREngine.cancel(this.dwrObj);
			this.dwrObj=null;
		}
		this[ui+"_loadUI"](state,param);
		this[ui+"_initUI"](state,param);
		this[ui+"_enter"](state,param);
	};

	__Page.dlgRank.joinClan=function(clanVO)//加入
	{
		if(!this.page.vwHomeStage.checkClan())
		{
			return;
		}
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		if(window.aisGame.curCity.honor<clanVO.honorScore)
		{
			this.appEnv.stateLogs.showLog(textLib["NotMeetMedal"]);
			return;
		}
		if(2==clanVO.clanType)
		{
			this.appEnv.stateLogs.showLog(textLib["ClanNotOpen"]);
			return;
		}
		if(clanVO.members.length>=appEnv.getClanMemberMax(clanVO.level))//window.aisEnv.defLib.globals["MAX_CLAN_MEMBERS"]
		{
			this.appEnv.stateLogs.showLog(textLib["ClanIsFull"]);
			return;
		}
		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:textLib["AskJoinClan"],info:textLib["AskJoinClanInfo"](clanVO.name),
				pmtFunc:function(ok,clanVO)
				{
					if(ok)
					{
						window.aisGame.king.sendNTCmd(window.aisGame.king,"ClanJoin",{clanId:clanVO.id},window.aisGame.king);
						this.appEnv.closeDlg(null,null,0);
						setFrameout(1,function(){this.appEnv.prePmtLayer=this.appEnv.layer;},this);
					}
				},pmtObj:this,pmtParam:clanVO
			}
		);
	};

	__Page.dlgRank.leaveClan=function()//离开
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:textLib["AskLeaveClan"],info:textLib["AskLeaveClanInfo"],
				pmtFunc:function(ok)
				{
					if(ok)
					{
						window.aisGame.king.sendNTCmd(window.aisGame.king,"ClanLeave",{},window.aisGame.king);
						this.appEnv.closeDlg(null,null,0);
						setFrameout(1,function(){this.appEnv.prePmtLayer=this.appEnv.layer;},this);
					}
				},pmtObj:this
			}
		);
	};

	__Page.dlgRank.kickClan=function(keyVO)//踢出   kickedUserId,kickedUserName,vo
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:textLib["AskKick"],info:textLib["AskKickInfo"](keyVO.name),
				pmtFunc:function(ok,vo)
				{
					if(ok)
					{
						window.aisGame.king.sendNTCmd(window.aisGame.king,"ClanKick",{kickedUserId:vo.id},window.aisGame.king);
						vo.lbx.removeItem(vo.idx);
					}
				},pmtObj:this,pmtParam:keyVO
			}
		);
	};

	__Page.dlgRank.appointClan=function(keyVO)//委任   userId,userName,vo
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		this.appEnv.showPmtDlg(this.page.pmtChoose,0,
			{
				title:textLib["AskPromote"],info:textLib["AskPromoteInfo"](keyVO.name),
				pmtFunc:function(ok,vo)
				{
					if(ok)
					{
						window.aisGame.king.sendNTCmd(window.aisGame.king,"ClanAppoint",{userId:vo.id},window.aisGame.king);
						vo.lbx.itemAt(vo.idx).getItemById("position")._setText(textLib["ClanPosition"+(vo.rankLevel+1)]);
					}
				},pmtObj:this,pmtParam:keyVO
			}
		);
	};

	__Page.dlgRank.editClan=function()
	{

	};

	__Page.dlgRank.visitMember=function()
	{

	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgRank.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//点击顶部菜单
		__Page.dlgRank.onMenuClk=function(msg,key,way,extra)
		{
			if(1==way && 2==msg)
			{
				DBOut("onMenuClk");
				if(extra==this.curStateId)return;
				this.lbxMenu.itemAt(extra).setEnabled(0);
				if(this.curStateId>-1)
				{
					this.lbxMenu.itemAt(this.curStateId).setEnabled(1);
				}
				this.showUI(this.states[extra],null,this.clanInitVO);
				this.curStateId=extra;
				this.btnBack.setDisplay(0);
			}
		};
	}
}
