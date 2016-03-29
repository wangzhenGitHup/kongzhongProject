if(!__Page.stateMain)
{
	__Page.stateMain = {
		page:__Page,
		name:"JGXUI_stateMain",
		prjFilePath:null,
		bgAnchorLayer:null,
		menuAnchorLayer:null,
		edAnchorLayer:null,
		messageCnt:0,		//消息数 
		preBtnId:1,      	//底部按钮序号 
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateMain);
	//设置为启动状态
	//__Page.appEnv.entryState = __Page.stateMain;

	__Page.stateMain.init = function(appEnv)
	{
		var layer, item;
		var page = this.page;
		var cssLib = page.cssLib;
		this.appEnv = appEnv;

		page.keyStateUtil.call(this);
		
		layer = appEnv.bgLayer;
		layer.setUIEvent(1);
		this.bgAnchorLayer = layer.addHudItem({
			type:"icon", id:"bg", pos:[0, 0, 0], w:appEnv.scrSize[0], h:appEnv.scrSize[1],
			ui_event:1, display:1,
			obj:{type:"box", color:[1, 1, 1, 1]},
			items:[
				{
					type:"icon", pos:[0, 0, 0], w:appEnv.scrSize[0], h:appEnv.scrSize[1],
					ui_event:1, display:1,
					obj:{type:"box", color:[0, 0, 0, 0.2]},
				},
			],
		});
		
		<include check="0">"ui/state_main_css.js"</include>
		
		layer = appEnv.menuLayer;
		layer.setUIEvent(1);
		this.menuAnchorLayer = layer.addHudItem({
			type:"item", id:"menuItem", pos:[0, 0, 0], w:appEnv.scrSize[0], h:appEnv.scrSize[1],ui_event:1, display:1});
			
		layer = appEnv.edLayer;
		layer.setUIEvent(1);
		
		this.edAnchorLayer = layer.addHudItem({
			"type":"item", "id":"curEditorLayer","pos":[0, 0, 0],"w":appEnv.scrSize[0],"h":appEnv.scrSize[1],ui_event:1, 
			display:1,});
		
		this.tipLayer = layer.addHudItem({
			"type":"item", "id":"curEditorLayer","pos":[0, 0, 0],"w":appEnv.scrSize[0],"h":appEnv.scrSize[1],ui_event:1, 
			display:1,});
		
		this.tipLayerItem = this.tipLayer.appendNewChild({css:cssLib["loading"]()});
		this.tipLayerItem.setDisplay(0);
		this.loadObjs  = [];
		for(var i = 0; i < 8; i++)
		{
			this.loadObjs[i] = this.tipLayerItem.findItemById("load" + (i + 1));
		}
		
		this.pageStates = [this.page.stateHome, this.page.stateMessage, this.page.stateMyGame, this.page.stateMy],
		this.initMainItem();
			
		if(appEnv.isLogin)
		{
			appEnv.userInfoObj = this.page.getCookie(CookieFlag, userInfoObj); 
			appEnv.userInfoObj = fromJSON(appEnv.userInfoObj);
			appEnv.getUserInformationData();
		}
	};
	
	//界面被激活的响应函数:
	__Page.stateMain.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateMain enter!: ");
		var appEnv = this.appEnv;
	};

	//界面被切走的响应函数:
	__Page.stateMain.leave = function(nextState)
	{
		//TODO:code this:
		var appEnv = this.appEnv;
		appEnv.bgLayer.removeHudItem(this.bgAnchorLayer);
		appEnv.menuLayer.removeHudItem(this.menuAnchorLayer);
		appEnv.edLayer.removeHudItem(this.edAnchorLayer);
	};
	
	//清除编辑层 
	__Page.stateMain.clearEditorLayer = function()
	{
		this.edAnchorLayer.removeAllChild();
	};
	
	//清除菜单层 
	__Page.stateMain.clearMenuLayer = function()
	{
		this.menuAnchorLayer.removeAllChild();
	};
	
	//清除背景层 
	__Page.stateMain.clearbgLayer = function()
	{
		this.bgAnchorLayer.removeAllChild();
	};
	
	//隐藏底部 
	__Page.stateMain.hideBottomRect = function()
	{
		this.bottomRect.setDisplay(0);
	};
	
	//显示底部 
	__Page.stateMain.showBottomRect = function()
	{
		this.bottomRect.setDisplay(1);
	};
	
	//隐藏顶部 
	__Page.stateMain.hideTopRect = function()
	{
		this.menuItem.topRect.setDisplay(0);
	};
	
	//显示顶部  
	__Page.stateMain.showTopRect = function()
	{
		this.menuItem.topRect.setDisplay(1);
	};
	
	//获取编辑层 
	__Page.stateMain.getEditorLayer = function()
	{
		var edAhcor;
		this.edAnchorLayer.removeAllChild();
		edAhcor = this.edAnchorLayer;
		return edAhcor;
	};
	
	__Page.stateMain.onTouch = function(pen, msg, x, y, pass)
	{
		//TODO:
	};
	
	__Page.stateMain.onKey = function(msg, key, way, extra)
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
	
	__Page.stateMain.initMainItem = function()
	{
		var item = this.menuItem = this.menuAnchorLayer.appendNewChild(this.initMainCSS(this.appEnv.scrSize[0],
			this.appEnv.scrSize[1], this.messageCnt));
			
		this.menuItemObj = item.findItemById("mainItem");
		this.bottomRect = item.findItemById("mainBottomRect");
		this.messageObj = this.bottomRect.findItemById("messageTip");
		var bottom1 = this.bottomRect.findItemById("bottom1");
		var tip1 = this.bottomRect.findItemById("tip1");
		bottom1.setEnable(0);
		tip1._setColor([0, 0.71, 1, 1]);
		
		this.appEnv.isLogin = this.page.getCookie(CookieFlag, isLogin); 
		this.appEnv.isLogin = fromJSON(this.appEnv.isLogin);

		this.setDisplayPage();
	};
	
	__Page.stateMain.changeTextColor = function(id1, id2)
	{
		
	};
	
	__Page.stateMain.setDisplayPage = function()
	{
		var beforeLogin = this.menuItemObj.findItemById("mainTopRect");
		var afterLogin = this.menuItemObj.findItemById("mainTopRectLogin");
		if(this.appEnv.isLogin)
		{
			afterLogin.setDisplay(1);
			beforeLogin.setDisplay(0);
			this.menuItem.topRect = this.menuItem.findItemById("mainTopRectLogin");
		}
		else
		{
			beforeLogin.setDisplay(1);
			afterLogin.setDisplay(0);
			this.menuItem.topRect = this.menuItem.findItemById("mainTopRect");
		}
	};
	
	//登录/注册
	__Page.stateMain.loginAndRegisterClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====登录/注册====");
			this.appEnv.switchState(this.page.stateUserLogin, 1, null);
		}
	};
	
	//搜索游戏
	__Page.stateMain.sereachClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====搜索游戏======");
			var paramObj = {type:10};
			this.appEnv.switchState(this.page.stateSearch, 1, paramObj);
		}
	};
	
	//进入我的游戏 
	__Page.stateMain.onEnterMyGameClk = function(msg ,extra)
	{
		if(1 == msg)
		{
			DBOut("====进入我的游戏======");
			//this.appEnv.switchState(this.page.stateMyGame, 1, null);
			var paramObj = {type:1, pagestate:2,};
			var curObj = this.menuItemObj.findItemById("bottom1");
			var curTip = this.menuItemObj.findItemById("tip1");
			curObj.setEnable(1);
			curTip._setColor([0, 0, 0, 0.6]);
			
			var nextObj = this.menuItemObj.findItemById("bottom4");
			var nextTip = this.menuItemObj.findItemById("tip4");
			nextObj.setEnable(0);
			nextTip._setColor([0, 0.71, 1, 1]);
			
			this.preBtnId = 4;
			this.appEnv.switchState(this.page.stateMy, 1, paramObj);
		}
	};
	
	//订单 
	__Page.stateMain.onEnterMyOrderClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====orderClk=====");
			var paramObj = {pagestate:1,};
			var curObj = this.menuItemObj.findItemById("bottom1");
			var curTip = this.menuItemObj.findItemById("tip1");
			curObj.setEnable(1);
			curTip._setColor([0, 0, 0, 0.6]);
			
			var nextObj = this.menuItemObj.findItemById("bottom4");
			var nextTip = this.menuItemObj.findItemById("tip4");
			nextObj.setEnable(0);
			nextTip._setColor([0, 0.71, 1, 1]);
			
			this.preBtnId = 4;
			this.appEnv.switchState(this.page.stateMy, 1, paramObj);
		}
	};
	
	//改变底部的选中状态
	__Page.stateMain.changeBottomState = function(nextId, curId)
	{
		var curObj = this.menuItemObj.findItemById("bottom" + curId);
		var curTip = this.menuItemObj.findItemById("tip" + curId);
		curObj.setEnable(1);
		curTip._setColor([0, 0, 0, 0.6]);
		
		var nextObj = this.menuItemObj.findItemById("bottom" + nextId);
		var nextTip = this.menuItemObj.findItemById("tip" + nextId);
		nextObj.setEnable(0);
		nextTip._setColor([0, 0.71, 1, 1]);
		
		this.preBtnId = nextId;//1;
	};
	
	//切换界面
	__Page.stateMain.switchMainPage = function(msg, extra, btnId)
	{
		if(1 == msg)
		{
			DBOut("=====切换界面====: " + btnId);
			if(this.preBtnId != btnId)
			{
				if(!this.appEnv.isLogin && (btnId <= 2))
				{
					this.appEnv.switchState(this.page.stateUserLogin, 1, null);
					return;
				}
				var curObj = this.menuItemObj.findItemById("bottom" + btnId);
				var curTip = this.menuItemObj.findItemById("tip" + btnId);
				curObj.setEnable(0);
				curTip._setColor([0, 0.71, 1, 1]);
	
				var preObj = this.menuItemObj.findItemById("bottom" + this.preBtnId);
				var preTip = this.menuItemObj.findItemById("tip" + this.preBtnId);
				preObj.setEnable(1);
				preTip._setColor([0, 0, 0, 0.6]);

				this.preBtnId = btnId;
				if(btnId == 1)
				{
					this.showTopRect();
				}
				
				this.appEnv.switchState(this.pageStates[btnId - 1], 1, null);
			}
		}
	};
	
	//改变消息数的提醒 
	__Page.stateMain.changeMessageState = function()
	{
		if(this.messageCnt > 0)
		{
			this.messageObj.setDisplay(1);
			if(this.messageCnt > 9999)
			{
				this.messageObj._setIconW(40);
			}

			this.messageObj.findItemById("iconTxt").setText(this.messageCnt);
		}
	};
}