if(!__Page.stateMain)
{
	__Page.stateMain = {
		page:__Page,
		name:"JGXUI_stateMain",
		prjFilePath:null,
		bgAnchorLayer:null,
		menuAnchorLayer:null,
		edAnchorLayer:null,
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateMain);
	//设置为启动状态
	__Page.appEnv.entryState = __Page.stateMain;

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
			
			
		//var item = this.menuItem = this.menuAnchorLayer.appendNewChild(this.initMainCSS(appEnv.scrSize[0], appEnv.scrSize[1]));
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
		//this.bottomRect.setDisplay(0);
	};
	
	//显示底部 
	__Page.stateMain.showBottomRect = function()
	{
		//this.bottomRect.setDisplay(1);
	};
	
	//隐藏顶部 
	__Page.stateMain.hideTopRect = function()
	{
		//this.menuItem.topRect.setDisplay(0);
	};
	
	//显示顶部  
	__Page.stateMain.showTopRect = function()
	{
		//this.menuItem.topRect.setDisplay(1);
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
}