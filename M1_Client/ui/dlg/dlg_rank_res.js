{//玩家排行
	__Page.dlgRank.ResSingle_loadUI=function(state,param)
	{
		if(!this.state_ResSingle)
			this.state_ResSingle={name:"ResSingle"};
		if(!state)
			state=this.state_ResSingle;
		if(state.loaded)return;
		state.loaded=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		this.topTipW=this.resLineCSS.w;
		this.topTipH=48;
		this.topTipX=this.contentW/2;
		this.topTipY=35;
		state.rankBoxY=this.topTipH;
	};
	__Page.dlgRank.ResSingle_loadUI();

	__Page.dlgRank.ResSingle_initUI=function(state,param)
	{
		if(!state)
			state=this.state_ResSingle;
		if(state.inited)return;
		state.inited=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		var cntBox=state.cntBox=this.cntBox.appendNewChild({id:"rank-ResSingle",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		var clanBox=state.clanBox=cntBox.appendNewChild({id:"box-ResSingle",type:"icon",pos:[0,0,0],w:this.contentW,h:0,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});

		clanBox.appendNewChild({type:"div3x3",pos:[this.topTipX,this.topTipY,0],w:this.topTipW,h:this.topTipH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
			{type:"text",pos:[0,0,0],w:this.topTipW,h:this.topTipH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,
				text:textLib["ResSingleTip"],font_size:FS.M,wrap:1}
		]});

		var memberBox=state.memberBox=cntBox.appendNewChild({id:"box-member",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		this.addPlayerBox(state,clanBox,state.rankBoxY);
		this.addMemberBox(state,memberBox);
	};

	__Page.dlgRank.ResSingle_enter=function(state,param)
	{
		if(!state)
		{
			state=this.state_ResSingle;
			this.curState=state;
		}
		state.cntBox.fadeIn(5,0);

		this.getResRankListS(2);
	};

	__Page.dlgRank.ResSingle_leave=function()
	{
		var state=this.state_ResSingle;
		this.appEnv.hudOut(state.cntBox,5,function(){state.lbxPlayer.clearItems();},this);
	};

	__Page.dlgRank.getResRankListS=function(type)
	{
	//	var stateName=this.states[this.curStateId];
	//	var state=this["state_"+stateName];
		var state=this.state_ResSingle;
		DBOut("getRankList");
		if(this.dwrObj)
			return;
		var param, bean, method;
		if(2==type)//资源排行-单次
		{
			param=["M1UserCenterDwr","getRankLootSingle",window.USERID];
		}
		state.lbxPlayer.clearItems();
		this.txtLoading.setText(this.appEnv.textLib["IsLoading"]);
		this.txtLoading.setDisplay(1);
		this.dwrObj=this.appEnv.newMsg(param,{cb:function(vo){
		//	DBOut("getResRankList: "+toJSON(vo));
			this.onGetRank(vo,type);//2==type?"resSingle":"resAvg"
		},cbobj:this,eh:function(){this.dwrObj=null;this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);},ehobj:this},window.UserCenter);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgRank.ResSingle_onBackClk=__Page.dlgRank.Player_onBackClk;

		this.onLogClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("this.onLogClk");
				var keyVO=this.logKeys[key];
				DBOut("keyVO:"+toJSON(keyVO));
				this.appEnv.closeDlg(null,null,0);
				this.page.stateHome.onReplayClick(keyVO.id);
			}
		};
	}
}