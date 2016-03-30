{//我的军团
	__Page.dlgClan.Self_loadUI=function(state,param)
	{
		if(!this.state_Self)
			this.state_Self={name:"Self"};
		if(!state)
			state=this.state_Self;
		if(state.loaded)return;
		state.loaded=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

	};
	__Page.dlgClan.Self_loadUI();

	__Page.dlgClan.Self_initUI=function(state,param)
	{
		if(!state)
			state=this.state_Self;
		if(state.inited)return;
		state.inited=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		var cntBox=state.cntBox=this.cntBox.appendNewChild({id:"clanSelf",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		this.addMemberBox(state,cntBox);
	};

	__Page.dlgClan.Self_enter=function(state,param)
	{
		if(!state)
		{
			state=this.state_Self;
			this.curState=state;
			param={members:[]};
			if(this.clanInitVO)
			{
				param=this.clanInitVO.clanVO;
			}
		}
		state.cntBox.fadeIn(5,0);

		this.setClanInfo(state,param);
		this.addMembers(state,state.lbxMember,param);
	};
	
	__Page.dlgClan.Self_leave=function(isHide)
	{
		var state=this.state_Self;
		this.appEnv.hudOut(state.cntBox,5,function(){
			if(!isHide)
			{
				state.lbxMember.clearItems();
			}
		},this);
		if(state.status=="Edit")
			this["Create_leave"]();
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{

	}
}