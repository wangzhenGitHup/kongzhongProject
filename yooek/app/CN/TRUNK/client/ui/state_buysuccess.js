/*
	购买成功界面  
*/
if(!__Page.stateBuySuccess)
{
	__Page.stateBuySuccess = {
		page:__Page,
		name:"JGXUI_stateBuySuccess",
		prjFilePath:null,
	};

	__Page.stateBuySuccess.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		this.vo = appEnv.stateDataObj;
		
		page.keyStateUtil.call(this);

		this.stateBuySuccessLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_buysuccess_css.js"</include>
		
		var areaH = 120 + (appEnv.scaleFactorY - 1) * 15;
		this.stateBuySuccessItem = this.stateBuySuccessLayer.appendNewChild(this.loadOtherBuySuccessCSS(appEnv.scrSize[0],
			appEnv.scrSize[1] - areaH, this.vo));
		
		this.stateBuySuccessLayer.setUIEvent(1);
	};

	//界面被激活的响应函数:
	__Page.stateBuySuccess.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateBuySuccess enter!: " + preState);
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.showBottomRect();
	};

	//界面被切走的响应函数:
	__Page.stateBuySuccess.leave = function(nextState)
	{
		//TODO:code this:
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showTopRect();
		this.stateBuySuccessLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateBuySuccess.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateBuySuccess.onKey = function(msg, key, way, extra)
	{
		var ret, appEnv, url;
		appEnv = this.appEnv;
		ret = this.autoOnKey(msg, key, way, extra);
		if(ret)
		{
			return ret;
		}
		return 0;
	};
	
	//查看自己的订单 
	__Page.stateBuySuccess.onLookOrderClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====查看自己的订单=====");
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.changeBottomState(4, 1);
			
			var paramObj = {type:1, pagestate:1,};
			this.appEnv.switchState(this.page.stateMy, 1, paramObj);
		}
	};
}