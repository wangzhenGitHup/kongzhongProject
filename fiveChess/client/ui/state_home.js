if(!__Page.stateHome)
{
	__Page.stateHome = {
		page:__Page,
		name:"JGXUI_stateHome",
		prjFilePath:null,
	};
	__Page.appEnv.dynaStates.push(__Page.stateHome);
	//设置为启动状态
	__Page.appEnv.entryState = __Page.stateHome;
	__Page.stateHome.init = function(appEnv)
	{
		var page, stateMain;
		this.appEnv = appEnv;
		page = this.page;
		var cssLib = page.cssLib;
		stateMain = page.stateMain;
		page.keyStateUtil.call(this);
		
		this.stateHomeLayer = stateMain.getEditorLayer();

		<include check="0">"ui/state_home_css.js"</include>

		this.stateHomeItem = this.stateHomeLayer.appendNewChild(this.initHomeCSS(appEnv.scrSize[0], appEnv.scrSize[1]));

		this.stateHomeLayer.setUIEvent(1);
	};
	
	__Page.stateHome.enter = function(preState)
	{
		var appEnv = this.appEnv;
	};
	
	//清除数据部分
	__Page.stateHome.clearData = function()
	{

	};
	
	__Page.stateHome.leave = function(nextState)
	{
		this.clearData();
		this.stateHomeLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};
	
	__Page.stateHome.onKey = function(msg,key,way,extra)
	{
		var ret;
		ret = this.autoOnKey(msg,key,way,extra);
		if(ret)
		{
			return ret;
		}
		return 0;
	};
	__Page.stateHome.onTouch = function(pen,msg,x,y,pass)
	{
		if(1 == msg && 1 == pass)
		{
			return 1;
		}
		return 0;
	};
	
	//人机对战
	__Page.stateHome.humanAttackToRobotClk = function(msg, extra)
	{
		if(1 == msg)
		{
			if(Dialogs.prompt("是否禁手？"))
			{
				this.appEnv.Rule = true;
			}
			else
			{
				this.appEnv.Rule = false;
			}
			this.appEnv.switchState(this.page.stateGame, 1, null);
		}
	};
	
	//双人对战
	__Page.stateHome.humanAttackToHumanClk = function(msg, extra)
	{
		if(1 == msg)
		{
			Dialogs.alert("双人对战暂未开通");
		}
	};
	
	//网络对战
	__Page.stateHome.humanAttackToHumanNetClk = function(msg, extra)
	{
		if(1 == msg)
		{
			Dialogs.alert("网络对战暂未开通");
		}
	};
	
	//排行榜
	__Page.stateHome.rankListClk = function(msg, extra)
	{
		if(1 == msg)
		{
			Dialogs.alert("排行榜暂未开通");
		}
	};
	
	//成就
	__Page.stateHome.achieveClk = function(msg, extra)
	{
		if(1 == msg)
		{
			Dialogs.alert("成就暂未开通");
		}
	};
	
	//去除广告
	__Page.stateHome.clearAdsClk = function(msg, extra)
	{
		if(1 == msg)
		{
			Dialogs.alert("去除广告暂未开通");
		}
	};
}