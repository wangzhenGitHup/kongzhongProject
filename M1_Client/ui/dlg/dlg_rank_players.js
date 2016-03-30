{//玩家排行
	__Page.dlgRank.Player_loadUI=function(state,param)
	{
		if(!this.state_Player)
			this.state_Player={name:"Player"};
		if(!state)
			state=this.state_Player;
		if(state.loaded)return;
		state.loaded=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		this.topBtnW=328;
		this.topBtnH=48;
		this.topDt=10;
		this.topBtnX_l=this.contentW/2-this.topDt-this.topBtnW/2;
		this.topBtnX_r=this.contentW/2+this.topDt+this.topBtnW/2;
		this.topBtnY=35;
		this.rankBoxY=this.topBtnH;
		this.rankBoxH=this.contentH-this.rankBoxY;
		this.curRankType=-1;
	};
	__Page.dlgRank.Player_loadUI();

	__Page.dlgRank.Player_initUI=function(state,param)
	{
		if(!state)
			state=this.state_Player;
		if(state.inited)return;
		state.inited=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		var cntBox=state.cntBox=this.cntBox.appendNewChild({id:"rank-player",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		var clanBox=state.clanBox=cntBox.appendNewChild({id:"box-player",type:"icon",pos:[0,0,0],w:this.contentW,h:0,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});

		var boxU=imgLib.getImg("box_btn_u"), boxD=imgLib.getImg("box_btn_d"), iconFlag=imgLib.getImg("icon_earth"), iconX=-(this.topBtnW/2-iconFlag.w-8);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onTopBtnClk_l);
		this.btnWorld=clanBox.appendNewChild({type:"key",pos:[this.topBtnX_l,this.topBtnY,0],w:this.topBtnW,h:this.topBtnH,css:boxU,ui_event:1,key:keyid,down_scale:0.99,anchor_h:1,anchor_v:1,
			state_up:{css:boxU,w:this.topBtnW,h:this.topBtnH},state_down:{css:boxD,w:this.topBtnW,h:this.topBtnH},state_gray:{css:boxD,w:this.topBtnW,h:this.topBtnH},items:[
				{type:"icon",pos:[iconX,0,0],anchor_h:1,anchor_v:1,css:iconFlag},
				{css:cssLib.textFineMid.createCSS([0,0,0],textLib["Global"],this.topBtnW,this.topBtnH,1,1,1,1)}
			]
		});
		iconFlag=imgLib.getImg("icon_local");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onTopBtnClk_r);
		var localStr=textLib["Local"];
		if("cn"==window.LanguageStr && window.Locality)
			localStr+=("（"+window.Locality+"）");
		this.btnLocal=clanBox.appendNewChild({type:"key",pos:[this.topBtnX_r,this.topBtnY,0],w:this.topBtnW,h:this.topBtnH,css:boxU,ui_event:1,key:keyid,down_scale:0.99,anchor_h:1,anchor_v:1,
			state_up:{css:boxU,w:this.topBtnW,h:this.topBtnH},state_down:{css:boxD,w:this.topBtnW,h:this.topBtnH},state_gray:{css:boxD,w:this.topBtnW,h:this.topBtnH},items:[
				{type:"icon",pos:[iconX,0,0],anchor_h:1,anchor_v:1,css:iconFlag},
				{css:cssLib.textFineMid.createCSS([0,0,0],localStr,this.topBtnW,this.topBtnH,1,1,1,1)}
			]
		});

		var memberBox=state.memberBox=cntBox.appendNewChild({id:"box-member",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		this.addPlayerBox(state,clanBox,this.rankBoxY);
		this.addMemberBox(state,memberBox);
	};

	__Page.dlgRank.Player_enter=function(state,param)
	{
		if(!state)
		{
			state=this.state_Player;
			this.curState=state;
			param={members:[]};
			if(this.clanInitVO)
			{
				param=this.clanInitVO.clanVO;
			}
		}
		state.cntBox.fadeIn(5,0);

	//	this.addMembers(state,state.lbxMember,param);
		this.onTopBtnClk_l(1,1,1,0);
	//	this.getRankList();
	};

	__Page.dlgRank.Player_leave=function()
	{
		var state=this.state_Player;
		this.appEnv.hudOut(state.cntBox,5,function(){state.lbxPlayer.clearItems();},this);
	};

	__Page.dlgRank.getRankList=function(type)
	{
	//	var stateName=this.states[this.curStateId];
	//	var state=this["state_"+stateName];
		var state=this.state_Player;
		DBOut("getRankList");
		if(this.dwrObj)
			return;
		var param, bean, method;
		if(0==type)//世界排行
		{
			this.btnWorld.setEnabled(0);
			this.btnLocal.setEnabled(1);
			param=["M1UserCenterDwr","getRankList",window.USERID];
		}
		else if(1==type)//地区排行
		{
			this.btnWorld.setEnabled(1);
			this.btnLocal.setEnabled(0);
			param=["M1UserCenterDwr","getRankLocation",window.Locality,window.USERID];
		}
		else if(2==type)//资源排行-单次
		{
			
		}
		else if(3==type)//资源排行-效率
		{
			
		}
		state.lbxPlayer.clearItems();
		this.txtLoading.setText(this.appEnv.textLib["IsLoading"]);
		this.txtLoading.setDisplay(1);
		this.dwrObj=this.appEnv.newMsg(param,{cb:function(vo){
		//	DBOut("getRankList: "+toJSON(vo));
			this.onGetRank(vo,type);
		},cbobj:this,eh:function(err,msg){this.dwrObj=null;this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);DBOut("msg="+msg);},ehobj:this},window.UserCenter);
	};

	__Page.dlgRank.onGetRank=function(vo,rankType)
	{
		if(!vo)
		{
			this.txtLoading.setText(this.appEnv.textLib["GetInfoEh"]);
			return;
		}
		var state=this.state_Player;
		var stateStr=this.states[this.curStateId];
		var curState=this["state_"+stateStr];
		DBOut("stateStr:"+stateStr+", curState:"+curState);

		state=curState;
		DBOut("onGetRank:"+state.name);
		this.txtLoading.setDisplay(0);
		this.dwrObj=null;
		state.clanBox.setDisplay(1);
		state.memberBox.setDisplay(0);
		state.lbxPlayer.clearItems();
/**********给袁政打的补丁************/
		if(!rankType)
		{
			var i,list,beIn,first;
			if(vo.top)
			{
				list=vo.top;
				for(i=0; i<list.length; i++)
				{
					list[i].rank=i;
					if(list[i].userId==window.USERID)
					{
						beIn=1;
					}
				}
				list=[];
				if(beIn)
					vo.self=null;
				else
				{
					if(vo.self)
					{
						if(vo.selfUp && vo.selfUp.length)
							list=list.concat(vo.selfUp);
						list.push(vo.self);
						if(vo.selfDown && vo.selfDown.length)
							list=list.concat(vo.selfDown);
						first=list[0].rank;
						for(i=0; i<list.length; i++)
						{
							list[i].rank = first++;
						}
					}
				}
			}
		}
/************************************/
		this.addPlayers(state,state.lbxPlayer,vo.top,rankType);
		if(vo.self)
		{
			this.addPlayers(state,state.lbxPlayer,["blank"]);
			this.addPlayers(state,state.lbxPlayer,vo.selfUp?vo.selfUp:[],rankType);
			this.addPlayers(state,state.lbxPlayer,[vo.self],rankType);
			this.addPlayers(state,state.lbxPlayer,vo.selfDown?vo.selfDown:[],rankType);
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgRank.onTopBtnClk_l=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onTopBtnClk_l");
				var state=this.state_Player;
				this.getRankList(0);
			}
		};

		__Page.dlgRank.onTopBtnClk_r=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onTopBtnClk_r");
				var state=this.state_Player;
				this.getRankList(1);
			}
		};

		__Page.dlgRank.Player_onBackClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("Player_onBackClk");
				var stateStr=this.states[this.curStateId];
				var curState=this["state_"+stateStr];
				DBOut("stateStr:"+stateStr+", curState:"+curState);

				state=curState;
				this.btnBack.setDisplay(0);
				state.clanBox.setDisplay(1);
				state.memberBox.setDisplay(0);
				state.lbxMember.clearItems();
			}
		};
	}
}