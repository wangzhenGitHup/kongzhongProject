/*
	服务协议
*/
if(!__Page.stateServiceProtocol)
{
	__Page.stateServiceProtocol = {
		page:__Page,
		name:"JGXUI_stateServiceProtocol",
		prjFilePath:null,
		protocolTxt:[], //协议文本内容 
		preState:null, //前一个界面 
		
		PAGE_MY:4, //我的界面
		PAGE_REGISTER:3, //注册界面
	};

	__Page.stateServiceProtocol.init = function(appEnv)
	{
		var layer;
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;
		
		this.prePage = appEnv.stateJumpFlag;
		this.appEnv = appEnv;
		page.keyStateUtil.call(this);

		this.stateServiceProtocolLayer = layer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_serviceprotocol_css.js"</include>
		var item = this.stateServiceProtocolItem = layer.appendNewChild(this.initServiceProtocolCSS(appEnv.scrSize[0], appEnv.scrSize[1], this, this.setScrollBarPos));
		this.stateServiceProtocolObj = item.findItemById("serviceItem");
		this.scrollBox = this.stateServiceProtocolObj.findItemById("scrollBox");
		this.initScrollBoxData();
		
		layer.setUIEvent(1);
	};

	__Page.stateServiceProtocol.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateServiceProtocol enter!");
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		this.preState = preState;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
	};

	__Page.stateServiceProtocol.leave = function(nextState)
	{
		//TODO:code this:
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showTopRect();
		stateMain.showBottomRect();
		
		this.prePage = -1;
		appEnv.stateJumpFlag = -1;
		this.stateServiceProtocolLayer.removeAllChild();
		nextState.init(appEnv);
	};

	__Page.stateServiceProtocol.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateServiceProtocol.onKey = function(msg, key, way, extra)
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
	
	//切割文本 
	/*__Page.stateServiceProtocol.spliceText = function()
	{
		var text = "欢迎阅读服务条款协议，";
					
		var len = text.length;
		var sw = this.appEnv.scrSize[0];
		var flag = 0;
		var mark = 0;
		var j = 0;
		var textArr = [];
		var onceNum = (this.appEnv.scrSize[0] -  50) / 18;
		onceNum = Math.floor(onceNum);
	
		for(var i = 0; i < len; i++)
		{
			flag++;
			if(flag % onceNum == 0)
			{	
				textArr[j] = text.substr(mark, onceNum);
				mark = flag;
				j++;
			}
		}
		textArr[j] = text.substr(mark);
		return textArr;
	};*/
	
	__Page.stateServiceProtocol.initScrollBoxData = function()
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;
		var text = textLib.txtServerProtocolTip;
		var textSize = appEnv.getTextSize(text, 24, 1, appEnv.scrSize[0] - 20);
		var itemParameter = {
			tColor:[0, 0, 0, 0.5], tSize: 24,
			edge: 0, edgeColor:[0, 0, 0, 0.2],
			align_h:0, align_v: 0,
			anchor_h:0, anchor_v:0,
			wrap:1, l_space:3, p_space:0,
		};
		
		var css = {css:cssLib["stdText"]([10, 0, 0], "", [textSize.w, textSize.h], text, itemParameter), };
		this.scrollBox.insertItem(css);
	};
	
	__Page.stateServiceProtocol.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			
			if(this.PAGE_MY == this.prePage)
			{
				appEnv.switchState(page.stateMy, 1, null);
				stateMain.changeBottomState(4, 1);
			}
			else
			{
				appEnv.switchState(page.stateUserRegister, 1, null);
			}
		}
	};
}