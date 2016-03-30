{//军团排行
	__Page.dlgRank.Clan_loadUI=function(state,param)
	{
		if(!this.state_Clan)
			this.state_Clan={name:"Clan"};
		if(!state)
			state=this.state_Clan;
		if(state.loaded)return;
		state.loaded=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
	};
	__Page.dlgRank.Clan_loadUI();

	__Page.dlgRank.Clan_initUI=function(state,param)
	{
		if(!state)
			state=this.state_Clan;
		if(state.inited)return;
		state.inited=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		var cntBox=state.cntBox=this.cntBox.appendNewChild({id:"rank-clan",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		var clanBox=state.clanBox=cntBox.appendNewChild({id:"box-clan",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		var memberBox=state.memberBox=cntBox.appendNewChild({id:"box-member",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		this.addClanBox(state,clanBox);
		this.addMemberBox(state,memberBox);
	};

	__Page.dlgRank.Clan_enter=function(state,param)
	{
		if(!state)
		{
			state=this.state_Clan;
			this.curState=state;
		}
		state.cntBox.fadeIn(5,0);

		state.clanBox.setDisplay(1);
		state.memberBox.setDisplay(0);
	//	this.addClans(state,state.lbxClan);
		this.getClanRanking(window.aisGame.curCity.allianceId);
	};

	__Page.dlgRank.Clan_leave=function(isHide)
	{
		var state=this.state_Clan;
		this.appEnv.hudOut(state.cntBox,5,function(){
			if(!isHide)
			{
				state.lbxClan.clearItems();
				state.lbxMember.clearItems();
			}
		},this);
		if(state.status=="Edit")
			this["Create_leave"]();
	};

	__Page.dlgRank.getClanRanking=function(clanId)
	{
		var state=this.state_Clan;
		DBOut("getClanRanking");
		if(this.dwrObj)
			return;
		this.txtLoading.setText(this.appEnv.textLib["IsLoading"]);
		this.txtLoading.setDisplay(1);
		this.dwrObj=this.appEnv.newMsg(["ClanDwr","getClanRanking",clanId?clanId:-1],{cb:function(vo){
			//DBOut("getClanRanking: "+toJSON(vo));
			this.txtLoading.setDisplay(0);
			this.dwrObj=null;
			state.rankResult=vo.top;
			state.lbxClan.clearItems();
			this.addClans(state,state.lbxClan,vo.top,0);
		},cbobj:this,eh:function(){this.dwrObj=null;this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);},ehobj:this},window.ClanDWRUrl);
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgRank.Clan_onBackClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("Clan_onBackClk");
				var state=this.state_Clan;
				this.btnBack.setDisplay(0);
				state.clanBox.setDisplay(1);
				state.memberBox.setDisplay(0);
				state.lbxMember.clearItems();
			}
		};
	}
}