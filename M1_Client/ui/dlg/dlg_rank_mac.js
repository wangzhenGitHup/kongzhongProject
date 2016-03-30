{//玩家排行
	__Page.dlgRank.MacPve_loadUI=function(state,param)
	{
		if(!this.state_MacPve)
			this.state_MacPve={name:"MacPve"};
		if(!state)
			state=this.state_MacPve;
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
		state.rankBoxY=0;
	};
	__Page.dlgRank.MacPve_loadUI();

	__Page.dlgRank.MacPve_initUI=function(state,param)
	{
		if(!state)
			state=this.state_MacPve;
		if(state.inited)return;
		state.inited=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		var cntBox=state.cntBox=this.cntBox;//.appendNewChild({id:"rank-MacPve",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		var clanBox=state.clanBox=cntBox.appendNewChild({id:"box-MacPve",type:"icon",pos:[0,0,0],w:this.contentW,h:0,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});

//		clanBox.appendNewChild({type:"div3x3",pos:[this.topTipX,this.topTipY,0],w:this.topTipW,h:this.topTipH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
//			{type:"text",pos:[0,0,0],w:this.topTipW,h:this.topTipH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,
//				text:textLib["MacPveTip"],font_size:FS.M,wrap:1}
//		]});
DBOut("MacPve_initUI");
		this.addMacBox(state,clanBox,state.rankBoxY);
	};

	__Page.dlgRank.MacPve_enter=function(state,param)
	{
		if(!state)
		{
			state=this.state_MacPve;
			this.curState=state;
		}
	//	state.cntBox.fadeIn(5,0);
		state.lbxPlayer.fadeIn(5,0);

		this.getMacRankList(5);
	};

	__Page.dlgRank.MacPve_leave=function()
	{
		var state=this.state_MacPve;
		this.appEnv.hudOut(state.lbxPlayer,5,function(){state.lbxPlayer.clearItems();},this);
	};

	__Page.dlgRank.getMacRankList=function(type)
	{
	//	var stateName=this.states[this.curStateId];
	//	var state=this["state_"+stateName];
		var state=this.state_MacPve;
		DBOut("getRankList");

		var dvo=[
			{
				totleScore:999,
				mechs:[
					{up:{codename:"par_body01_01",level:20,num:1},down:{codename:"",level:16,num:1},plug:{codename:"",num:1},state:0}
				],
				loots:[
					{waveId:2,type:"",num:3,extend1:""}
				],
				battleLogId:""
			},
			{
				totleScore:999,
				mechs:[
					{up:{codename:"par_body01_01",level:20,num:1},down:{codename:"",level:16,num:1},plug:{codename:"",num:1},state:0}
				],
				loots:[
					{waveId:2,type:"",num:3,extend1:""}
				],
				battleLogId:""
			},
			{
				totleScore:999,
				mechs:[
					{up:{codename:"par_body01_01",level:20,num:1},down:{codename:"",level:16,num:1},plug:{codename:"",num:1},state:0}
				],
				loots:[
					{waveId:2,type:"",num:3,extend1:""}
				],
				battleLogId:""
			},
			{
				totleScore:999,
				mechs:[
					{up:{codename:"par_body01_01",level:20,num:1},down:{codename:"",level:16,num:1},plug:{codename:"",num:1},state:0}
				],
				loots:[
					{waveId:2,type:"",num:3,extend1:""}
				],
				battleLogId:""
			},
			{
				totleScore:999,
				mechs:[
					{up:{codename:"par_body01_01",level:20,num:1},down:{codename:"",level:16,num:1},plug:{codename:"",num:1},state:0}
				],
				loots:[
					{waveId:2,type:"",num:3,extend1:""}
				],
				battleLogId:""
			},
			{
				totleScore:999,
				mechs:[
					{up:{codename:"par_body01_01",level:20,num:1},down:{codename:"",level:16,num:1},plug:{codename:"",num:1},state:0}
				],
				loots:[
					{waveId:2,type:"",num:3,extend1:""}
				],
				battleLogId:""
			},
			{
				totleScore:999,
				mechs:[
					{up:{codename:"par_body01_01",level:20,num:1},down:{codename:"",level:16,num:1},plug:{codename:"",num:1},state:0}
				],
				loots:[
					{waveId:2,type:"",num:3,extend1:""}
				],
				battleLogId:""
			},
			{
				totleScore:999,
				mechs:[
					{up:{codename:"par_body01_01",level:20,num:1},down:{codename:"",level:16,num:1},plug:{codename:"",num:1},state:0}
				],
				loots:[
					{waveId:2,type:"",num:3,extend1:""}
				],
				battleLogId:""
			},
		];
	//	setFrameout(0,function(){this.onGetMacRank(dvo,5);},this)
	//	return;

		if(this.dwrObj)
			return;
		var param, bean, method;
		if(5==type)//资源排行-单次
		{
			param=["M1UserCenterDwr","getRankWaveBattle",window.USERID];
		}
		state.lbxPlayer.clearItems();
		this.txtLoading.setText(this.appEnv.textLib["IsLoading"]);
		this.txtLoading.setDisplay(1);
		this.dwrObj=this.appEnv.newMsg(param,{cb:function(vo){
			DBOut("getMacRankList: "+toJSON(vo));
			this.onGetMacRank(vo,type);
		},cbobj:this,eh:function(){this.dwrObj=null;this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);},ehobj:this},window.UserCenter);
	};

	__Page.dlgRank.onGetMacRank=function(vo,rankType)
	{
		if(!vo)
		{
			this.txtLoading.setText(this.appEnv.textLib["GetInfoEh"]);
			return;
		}
		if(!vo.length)
		{
			this.txtLoading.setText(this.appEnv.textLib["NoRankData"]);
			return;
		}
		var state=this.state_MacPve;
		var stateStr=this.states[this.curStateId];
		var curState=this["state_"+stateStr];
		DBOut("stateStr:"+stateStr+", curState:"+curState);

		state=curState;
		DBOut("onGetRank: "+state.name);
		this.txtLoading.setDisplay(0);
		this.dwrObj=null;
		state.clanBox.setDisplay(1);
		state.lbxPlayer.clearItems();
		this.addPlayers(state,state.lbxPlayer,vo,rankType);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgRank.MacPve_onBackClk=__Page.dlgRank.Player_onBackClk;

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