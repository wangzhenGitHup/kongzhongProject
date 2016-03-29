/*
	搜索界面
*/
if(!__Page.stateSearch)
{
	__Page.stateSearch={
		page:__Page,
		name:"JGXUI_stateSearch",
		prjFilePath:null,
		searchGameKey:"", //搜索的关键字 
		gameNameArr:[], //游戏名字
		gamesysnoArr:[], //游戏主键 
		searchGameListObj:{gamelist:[], hasnext:false}, //搜索后的游戏对象 
		curPage:0, //当前页面
		PAGE_GAME_MAIN:0, //首页
		PAGE_SEARCH_GAME:1, //搜索游戏页 
		recommendgame_pageno:1, //推荐游戏页码
		searchgame_pageno:1, //搜索游戏页码 
		recordOwnerWord:[], //记录所拥有的开头字母列表 
	};

	__Page.stateSearch.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		this.type = appEnv.stateType;

		page.keyStateUtil.call(this);
	
		this.stateSearchLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_search_css.js"</include>
		
		var areaH = 90 + (appEnv.scaleFactorY - 1) * 15;
		this.collectGameTopItem = this.stateSearchLayer.appendNewChild(this.initTopBarCSS(appEnv.scrSize[0], areaH));
		
		this.searchItem = this.stateSearchLayer.appendNewChild(this.initSearchModelCSS(appEnv.scrSize[0], 90));
		this.inputBoxItem = this.searchItem.findItemById("inputBoxBgsearchEdit");
		this.lastSearchItem = this.stateSearchLayer.appendNewChild(this.initLastSearchModelCSS(appEnv.scrSize[0]));
		this.lastBarItem = [this.lastSearchItem.findItemById("lastSeareach0"),
			this.lastSearchItem.findItemById("lastSeareach1"), this.lastSearchItem.findItemById("lastSeareach2")];
		
		var len = appEnv.lastSeareachGameList.length;
		for(var i = 0; i < len; i++)
		{
			this.lastBarItem[i].setDisplay(1);
		}
		//如果最近搜索的记录为空，则不显示最近搜索栏 
		var totalH, posY;
		if(len == 0)
		{
			this.lastSearchItem.setDisplay(0);
			totalH = 0;
		}
		else
		{
			totalH = len * 80 + 60 + len * 1;
		}
		posY = totalH + areaH + 91;
		var leftH = appEnv.scrSize[1] - areaH - 91 - totalH;
		this.gameScrollBoxItem  = this.stateSearchLayer.appendNewChild(this.loadScrollBoxCSS(appEnv.scrSize[0], leftH, posY));
		this.scrollBoxGameListItem = this.gameScrollBoxItem.findItemById("scrollBox");
		
		this.stateSearchLayer.setUIEvent(1);
	};
	
	//界面被激活的响应函数:
	__Page.stateSearch.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateSearch enter!");
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
		this.curPage = this.PAGE_GAME_MAIN;
		this.initRecommanderGameList();
	};
	
	//界面被切走的响应函数:
	__Page.stateSearch.leave = function(nextState)
	{
		//TODO:code this:
		this.searchgame_pageno = 1;
		this.recommendgame_pageno = 1;
		this.clearGameObj();
		this.appEnv.clearSearchGameList();
		this.stateSearchLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateSearch.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateSearch.onKey = function(msg, key, way, extra)
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
	
	//清除游戏对象相关数组
	__Page.stateSearch.clearGameObj = function()
	{
		var len = this.gameNameArr.length;
		this.gameNameArr.splice(0, len);
		
		len = this.gamesysnoArr.length;
		this.gamesysnoArr.splice(0, len);
		
		len = this.recordOwnerWord.length;
		this.recordOwnerWord.splice(0, len);
		
		this.clearSearchGameList();
		
		this.searchGameKey = null;
		this.curPage = 0;
	};
	
	//清除搜索游戏列表
	__Page.stateSearch.clearSearchGameList = function()
	{
		var len = this.searchGameListObj.gamelist.length;
		this.searchGameListObj.hasnext = false;
		this.searchGameListObj.gamelist.splice(0, len);
		this.appEnv.clearSearchGameList();
	};
	
	//初始化推荐游戏的游戏列表
	__Page.stateSearch.initRecommanderGameList = function()
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var cssLib = page.cssLib;
		var css = [];
		var totalH = 0;
		var k = 0;
		var itemIndex = 0;
		var len;
		var gameNameArr = [];
		
		len = this.gameNameArr.length;
		this.gameNameArr.splice(0, len);
		
		len = this.recordOwnerWord.length;
		this.recordOwnerWord.splice(0, len);
		
		len = this.gamesysnoArr.length;
		this.gamesysnoArr.splice(0, len);

		for(var i = 0; i < 26; i++)
		{
			var len1 = appEnv.gameDetailObj[i].gamelist.length;
			if(len1 <= 0)
			{
				continue;
			}
			len = gameNameArr.length;
			gameNameArr.splice(0, len);
			
			for(var j = 0; j < len1; j++)
			{
				 this.gameNameArr.push(appEnv.gameDetailObj[i].gamelist[j].gamename);
				 this.gamesysnoArr.push(appEnv.gameDetailObj[i].gamelist[j].gamesysno);
				 gameNameArr.push(appEnv.gameDetailObj[i].gamelist[j].gamename);
			}
			var len2 = gameNameArr.length;
			totalH = len2 * 80 + 60;
			css[k] = {css:cssLib["view_arrange_listbox2"](totalH, appEnv.gameDetailObj[i].word, gameNameArr,
				this, this.onConfirmRecommandGameClk, itemIndex)};
			this.recordOwnerWord.push(appEnv.gameDetailObj[i].word);
			k++;
			itemIndex += len2;
		}
		this.scrollBoxGameListItem.insertItems(css);
		
		if(!appEnv.gameDetailObj.hasnext)
		{
			return;
		}
		this.scrollBoxGameListItem.removeChild(this.refreshBarItem);
		this.scrollBoxGameListItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0] - 30));
		this.refreshBarItem = this.scrollBoxGameListItem.findItemById("loadRefreshItem").findItemById("tip");
		this.scrollBoxGameListItem.setTrigger(80, 1);
		this.scrollBoxGameListItem.setTrigger(30, 2);
	};
	
	//刷新所搜索的游戏列表,或者叫只展示搜索的游戏
	__Page.stateSearch.showSearchGameList = function()
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var cssLib = page.cssLib;
		var css = [];
		var totalH = 0;
		var k = 0;
		var itemIndex = 0;
		var len;
		var gameNameArr = [];

		len = this.gameNameArr.length;
		this.gameNameArr.splice(0, len);
		
		len = this.recordOwnerWord.length;
		this.recordOwnerWord.splice(0, len);
		
		len = this.gamesysnoArr.length;
		this.gamesysnoArr.splice(0, len);

		var len = this.searchGameListObj.gamelist.length;
		
		for(var i = 0; i < 26; i++)
		{
			for(var j = 0; j < len; j++)
			{
				if(appEnv.searchGameDetailObj[i].word == this.searchGameListObj.gamelist[j].initial.toUpperCase())
				{
					appEnv.searchGameDetailObj[i].gamelist.push(this.searchGameListObj.gamelist[j]);
				}
			}
		}
		
		for(var i = 0; i < 26; i++)
		{
			len = appEnv.searchGameDetailObj[i].gamelist.length;
			if(len <= 0)
			{
				continue;
			}
			var len1 = gameNameArr.length;
			gameNameArr.splice(0, len1);
			
			for(var j = 0; j < len; j++)
			{
				 this.gameNameArr.push(appEnv.searchGameDetailObj[i].gamelist[j].gamename);
				 this.gamesysnoArr.push(appEnv.searchGameDetailObj[i].gamelist[j].gamesysno);
				 gameNameArr.push(appEnv.searchGameDetailObj[i].gamelist[j].gamename);
			}
			var len2 = gameNameArr.length;
			totalH = len2 * 80 + 60;
			css[k] = {css:cssLib["view_arrange_listbox2"](totalH, appEnv.searchGameDetailObj[i].word, gameNameArr,
				this, this.onConfirmRecommandGameClk, itemIndex)};

			this.recordOwnerWord.push(appEnv.searchGameDetailObj[i].word);
			k++;
			itemIndex += len2;
		}
		this.scrollBoxGameListItem.insertItems(css);
		
		if(!this.searchGameListObj.hasnext)
		{
			return;
		}
		this.scrollBoxGameListItem.removeChild(this.refreshBarItem);
		this.scrollBoxGameListItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0] - 30));
		this.refreshBarItem = this.scrollBoxGameListItem.findItemById("loadRefreshItem").findItemById("tip");
		this.scrollBoxGameListItem.setTrigger(80, 1);
		this.scrollBoxGameListItem.setTrigger(30, 2);
	};
	
	//上拉刷新事件
	__Page.stateSearch.OnTrigger = function(tag, dit, touch)
	{
		DBOut("======上拉刷新事件=====");
		
		if(tag == 2 && dit == 0)
		{
			if(touch)
			{
				this.refreshBarItem._setText(this.appEnv.textLib.txtReleaseRefreshTip);
				this.aboutToRefresh = 1;
			}
		}
		else if(tag == 2 && dit == 1)
		{
			if(touch == 1)
			{
				this.refreshBarItem._setText("Drag down to refresh.");
			}
			else
			{
				if(this.aboutToRefresh)
				{
					this.aboutToRefresh = 0;
					this.refreshBarItem._setText(this.appEnv.textLib.txtRefreshIngTip);
					if(this.curPage == this.PAGE_GAME_MAIN)
					{
						this.startRefreshGameListData();
					}
					else
					{
						this.startRefreshSearchGameListData();
					}
				}
			}
		}
	};
	
	//开始刷新推荐游戏列表 
	__Page.stateSearch.startRefreshGameListData = function()
	{
		var appEnv = this.appEnv;
		if(appEnv.gameDetailObj.hasnext)
		{
			appEnv.getRecommendGameListData(this.recommendgame_pageno, this, this.getGameListDataCallBack);
		}
		else
		{
			this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
		}
	};
	
	//获取推荐游戏数据的回调函数
	__Page.stateSearch.getGameListDataCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			appEnv.getRecommendGameListData(this.recommendgame_pageno, this, this.getGameListDataCallBack);
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			appEnv.getRecommendGameListData(this.recommendgame_pageno, this, this.getGameListDataCallBack);
			return;
		}
		if(!vo || !vo.gamelist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			appEnv.getRecommendGameListData(this.recommendgame_pageno, this, this.getGameListDataCallBack);
			return;
		}
		
		if(vo.hasnext)
		{
			this.recommendgame_pageno++;
		}
		for(var i = 0; i < 26; i++)
		{
			appEnv.gameDetailObj[i].gamelist.splice(0, appEnv.gameDetailObj[i].gamelist.length);
		}
		appEnv.gameDetailObj.hasnext = vo.hasnext;
		var len = vo.gamelist.length;

		for(var i = 0; i < len; i++)
		{
			appEnv.findGameData(vo.gamelist[i]);
		}
		this.curPage = this.PAGE_GAME_MAIN;
		this.initRecommanderGameList();
	};
	
	//开始刷新搜索的游戏列表
	__Page.stateSearch.startRefreshSearchGameListData = function()
	{
		if(this.searchGameListObj.hasnext)
		{
			this.getSearchGameListData();
		}
		else
		{
			this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
		}
	};
	
	//确定触摸的推荐游戏事件
	__Page.stateSearch.onConfirmRecommandGameClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====确定触摸的推荐游戏事件=====: " + btnMsg);
			this.closeEditHud();
			var gameName = this.gameNameArr[btnMsg];
			this.appEnv.addLastSeareachGameRecord(gameName);
			this.appEnv.gameSysno = this.gamesysnoArr[btnMsg];
			var paramObj = {type:this.type, dataObj:null, name:gameName, specialFlag:1};
			this.appEnv.switchState(this.page.stateRecharge, 1, paramObj);
		}
	};

	//搜索游戏数据
	__Page.stateSearch.getSearchGameListData = function()
	{
		this.closeEditHud();
		
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var pageno = this.searchgame_pageno;
		var pagesize = 15;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.searchgamelist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"},  
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"pageno", "value":"" + pageno}, 
						{"key":"pagesize", "value":"" + pagesize},
					];

		if(this.searchGameKey)
		{
			paramObjs.push({"key":"gamename", "value":"" + this.searchGameKey});
		}
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.getSearchGameListDataCallBack, paramObjs, cipherText);
	};
	
	//搜索游戏的回调函数
	__Page.stateSearch.getSearchGameListDataCallBack = function(vo, isSuccess)
	{
		//gamelist []	N	游戏信息列表
		//hasnext	N	是否存在下一页(是否存在下一页；true为存在下一页)
		//gamesysno	N	游戏主键
		//gamename	N	游戏名字
		//gametype	N	游戏类型 网络游戏:1 手机游戏:2 网页游戏:3
		//description	N	描述
		//ordernumber	N	已购买商品数
		
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getSearchGameListData();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getSearchGameListData();
			return;
		}
		if(!vo || !vo.gamelist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getSearchGameListData();
			return;
		}
		if(!vo.gamelist.length)
		{
			Dialogs.alert(appEnv.textLib.txtNoHaveSearchTip);
			return;
		}
		
		if(vo.hasnext)
		{
			this.searchgame_pageno++;
		}
		
		var len = vo.gamelist.length;
		if(len <= 0)
		{
			//Dialogs.alert(appEnv.textLib.txtNetTip1);
			return;
		}
		
		this.clearSearchGameList();
		for(var i = 0; i < len; i++)
		{
			this.searchGameListObj.gamelist.push(vo.gamelist[i]);
		}
		
		this.curPage = this.PAGE_SEARCH_GAME;
		this.showSearchGameList();
	};
	
	//搜索游戏关键字的输入框
	__Page.stateSearch.getSearchGameKeyClk = function(txt)
	{
		this.searchGameKey = txt;
		if(!this.searchGameKey || this.searchGameKey.length == 0)
		{
			return;
		}
		this.appEnv.addLastSeareachGameRecord(txt);
		//this.clearSearchGameList();
		this.getSearchGameListData();
	};
	
	//确定最近搜索的游戏
	__Page.stateSearch.onConfirmSeareachClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====确定最近搜索的游戏=====");
			
			var text = this.appEnv.lastSeareachGameList[btnMsg];
			this.searchGameKey = text;
			this.getSearchGameListData();
		}
	};
	
	//返回事件
	__Page.stateSearch.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
			
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			stateMain.changeBottomState(1, 3);
			this.appEnv.switchState(page.stateHome, 1, null);
		}
	};
	
	//确定搜索事件
	__Page.stateSearch.onSearchClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=======确定搜索事件=======");
			if(!this.searchGameKey || this.searchGameKey.length == 0)
			{
				return;
			}
			this.closeEditHud();
			//this.clearSearchGameList();
			this.getSearchGameListData();
		}
	};
	
	//清除关键字
	__Page.stateSearch.onClearKeyClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("======清除关键字=====");
			this.searchGameKey = "";
			this.inputBoxItem.setText("");
			this.closeEditHud();
			this.curPage = this.PAGE_GAME_MAIN;
			this.initRecommanderGameList();
		}
	};
	
	//取消搜索 
	__Page.stateSearch.onCancelClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====取消搜索=====");
			this.closeEditHud();
			
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			stateMain.changeBottomState(1, 3);
			this.appEnv.switchState(page.stateHome, 1, null);
		}
	};
	
	//关闭输入框 
	__Page.stateSearch.closeEditHud = function()
	{
		this.inputBoxItem.OnCloseEdit();
	};
	
	//计算相应字母所在的序号
	__Page.stateSearch.getWordInListIndex = function(word)
	{
		var len = this.recordOwnerWord.length;

		for(var i = 0; i < len; i++)
		{
			if(word == this.recordOwnerWord[i])
			{
				return i;
			}
		}
		return -1;
	};
	
	//字母搜索事件
	__Page.stateSearch.wordSearchEvent = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			var appEnv = this.appEnv;
			var word = appEnv.gameDetailObj[btnMsg].word;
			var index = this.getWordInListIndex(word);
			
			if(-1 == index)
			{
				return;
			}
			this.scrollBoxGameListItem.setShowItem(index);
		}
	};
}