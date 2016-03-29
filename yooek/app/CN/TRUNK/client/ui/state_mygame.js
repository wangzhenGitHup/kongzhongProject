if(!__Page.stateMyGame)
{
	__Page.stateMyGame={
		page:__Page,
		name:"JGXUI_stateMyGame",
		prjFilePath:null,
		remarkGameListObjs:[], //顺序标记游戏对象的数组 
		gameKey:"", //搜索的关键字 
		searchGameListObj:{gamelist:[], hasnext:false}, //搜索游戏时暂存的对象 
		curPage:0, //当前页面
		recommendgame_pageno:1, //推荐游戏页码 
		searchgame_pageno:1, //搜索游戏页码 
		recordOwnerWord:[], //记录所拥有的开头字母列表  
		
		PAGE_GAME_MAIN:0, //首页
		PAGE_SEARCH_GAME:1, //搜索游戏页
	};

	__Page.stateMyGame.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		page.keyStateUtil.call(this);

		this.stateMyGameLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_mygame_css.js"</include>
		
		var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
		this.stateMyGameTopItem = this.stateMyGameLayer.appendNewChild(this.initTopBarCSS(appEnv.scrSize[0], topH));
		this.stateMyGameSearchModelItem = this.stateMyGameLayer.appendNewChild(this.initSearchModelCSS(appEnv.scrSize[0], 90));
		this.scrollBoxItem = this.stateMyGameLayer.appendNewChild(this.loadScrollBoxCSS(appEnv.scrSize[0],
			appEnv.scrSize[1] - topH - 91));
		this.scrollBoxAreaItem = this.scrollBoxItem.findItemById("scrollBox");
		this.editorBox = this.stateMyGameSearchModelItem.findItemById("inputBoxBgsearchEdit");
		this.stateMyGameLayer.setUIEvent(1);
	};
	
	//界面被激活的响应函数:
	__Page.stateMyGame.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateMyGame enter!");
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;

		stateMain.hideTopRect();
		stateMain.hideBottomRect();
		this.curPage = this.PAGE_GAME_MAIN;
		this.initGameData();
	};
	
	//清除游戏对象相关数组
	__Page.stateMyGame.clearGameObj = function()
	{
		var len = this.remarkGameListObjs.length;
		this.remarkGameListObjs.splice(0, len);
		
		len = this.recordOwnerWord.length;
		this.recordOwnerWord.splice(0, len);
		
		this.clearSearchList();
	};

	//清除搜索游戏列表
	__Page.stateMyGame.clearSearchList = function()
	{
		var len = this.searchGameListObj.gamelist.length;
		this.searchGameListObj.gamelist.splice(0, len);
		this.searchGameListObj.hasnext = false;
		
		this.appEnv.clearSearchGameList();
	};
	
	//界面被切走的响应函数:
	__Page.stateMyGame.leave = function(nextState)
	{
		//TODO:code this:
		this.clearGameObj();
		this.recommendgame_pageno = 1;
		this.appEnv.myGameJumpPage = 0;
		this.stateMyGameLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateMyGame.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateMyGame.onKey = function(msg, key, way, extra)
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
	
	//初始游戏数据
	__Page.stateMyGame.initGameData = function()
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var cssLib = page.cssLib;
		var css = [];
		var totalH = 0;
		var k = 0;
		var itemIndex = 0;
		var gameNameArr = [];
		var isHave = false;
		
		this.clearGameObj();
		for(var i = 0; i < 26; i++)
		{
			var len = appEnv.gameDetailObj[i].gamelist.length;
			var len1 = appEnv.collectGameListObjs.length;
			if(len <= 0)
			{
				continue;
			}
			gameNameArr.splice(0, gameNameArr.length);

			for(var j = 0; j < len; j++)
			{
				isHave = false;
				gameNameArr.push(appEnv.gameDetailObj[i].gamelist[j].gamename);
				this.remarkGameListObjs.push(appEnv.gameDetailObj[i].gamelist[j]);
				for(var index = 0; index < len1; index++)
				{
					if(appEnv.gameDetailObj[i].gamelist[j].gamename == appEnv.collectGameListObjs[index].gamename)
					{
						isHave = true;
						break;
					}
				}
				
				if(isHave)
				{
					appEnv.gameDetailObj[i].isCollect[j] = true;
				}
				else
				{
					appEnv.gameDetailObj[i].isCollect[j] = false;
				}
			}
			
			totalH = gameNameArr.length * 80 + 60;
			css[k] = {css:cssLib["view_arrange_listbox"](totalH, appEnv.gameDetailObj[i].word, gameNameArr,
				this, this.onCollectClk, appEnv.gameDetailObj[i].isCollect, itemIndex)};
			this.recordOwnerWord.push(appEnv.gameDetailObj[i].word);
			k++;
			itemIndex += len;
		}
		this.scrollBoxAreaItem.insertItems(css);
		if(!appEnv.gameDetailObj.hasnext)
		{
			return;
		}
		this.scrollBoxAreaItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0] - 30));
		this.scrollBoxAreaItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.scrollBoxAreaItem.findItemById("loadRefreshItem").findItemById("tip");
		this.scrollBoxAreaItem.setTrigger(80, 1);
		this.scrollBoxAreaItem.setTrigger(30, 2);
	};
	
	//刷新所搜索的游戏列表,或者叫只展示搜索的游戏
	__Page.stateMyGame.showSearchGameList = function()
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
		var isHave = false;
		var isCollect = [];

		this.scrollBoxAreaItem.clearItems();
		this.remarkGameListObjs.splice(0, this.remarkGameListObjs.length);
		var len1 = appEnv.collectGameListObjs.length;
		var len = this.searchGameListObj.gamelist.length;

		this.recordOwnerWord.splice(0, this.recordOwnerWord.length);
		
		//添加搜索的游戏
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
	
		//判断游戏有么有收藏
		for(var i = 0; i < 26; i++)
		{
			len = appEnv.searchGameDetailObj[i].gamelist.length;
			if(len <= 0)
			{
				continue;
			}
			gameNameArr.splice(0, gameNameArr.length);

			for(var j = 0; j < len; j++)
			{
				 gameNameArr.push(appEnv.searchGameDetailObj[i].gamelist[j].gamename);
				 this.remarkGameListObjs.push(appEnv.searchGameDetailObj[i].gamelist[j]);
			}
			
			var len1 = appEnv.collectGameListObjs.length;
			for(var j = 0; j < len; j++)
			{
			//================================================
				isHave = false;
				for(var index = 0; index < len1; index++)
				{
					if(appEnv.searchGameDetailObj[i].gamelist[j].gamename == appEnv.collectGameListObjs[index].gamename)
					{
						isHave = true;
						break;
					}
				}
				
				if(isHave)
				{
					appEnv.searchGameDetailObj[i].isCollect[j] = true;
				}
				else
				{
					appEnv.searchGameDetailObj[i].isCollect[j] = false;
				}
			//================================================
			}
			var len2 = gameNameArr.length;
			totalH = len2 * 80 + 60;
			css[k] = {css:cssLib["view_arrange_listbox"](totalH, appEnv.searchGameDetailObj[i].word, gameNameArr, this,
				this.onCollectClk, appEnv.searchGameDetailObj[i].isCollect, itemIndex)};
			this.recordOwnerWord.push(appEnv.gameDetailObj[i].word);
			k++;
			itemIndex += len2;
		}
		this.scrollBoxAreaItem.insertItems(css);

		if(!this.searchGameListObj.hasnext)
		{
			return;
		}
		this.scrollBoxAreaItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = null;
		this.scrollBoxAreaItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0] - 30));
		this.refreshBarItem = this.scrollBoxAreaItem.findItemById("loadRefreshItem").findItemById("tip");
		this.scrollBoxAreaItem.setTrigger(80, 1);
		this.scrollBoxAreaItem.setTrigger(30, 2);
	};
	
	//上拉刷新事件
	__Page.stateMyGame.OnTrigger = function(tag, dit, touch)
	{
		DBOut("=====上拉刷新事件=====");
		
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
					this.aboutToRefresh=0;
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
	__Page.stateMyGame.startRefreshGameListData = function()
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
	__Page.stateMyGame.getGameListDataCallBack = function(vo, isSuccess)
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
		
		appEnv.gameDetailObj.hasnext = vo.hasnext;
		if(vo.hasnext)
		{
			this.recommendgame_pageno++;
		}
		
		var len = vo.gamelist.length;
		for(var i = 0; i < len; i++)
		{
			appEnv.findGameData(vo.gamelist[i]);
		}
		this.curPage = this.PAGE_GAME_MAIN;
		this.initGameData();
	};
	
	//开始刷新搜索的游戏列表
	__Page.stateMyGame.startRefreshSearchGameListData = function()
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
	
	//收藏事件 
	__Page.stateMyGame.onCollectClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====收藏事件=====: " + this.remarkGameListObjs[btnMsg].gamename);
			
			var appEnv = this.appEnv;
			var word = this.remarkGameListObjs[btnMsg].initial.toUpperCase();
			var len = appEnv.collectGameListObjs.length;
			var isCollect = false;
			if(0 == len)
			{
				this.remarkGameListObjs[btnMsg].isCollect = true;
				appEnv.collectGameListObjs.push(this.remarkGameListObjs[btnMsg]);
				this.page.setCookie(CookieFlag, collectGameObj, toJSON(appEnv.collectGameListObjs), 0);
				this.curPage = this.PAGE_GAME_MAIN;
				this.initGameData();
				this.clearSearchList();
				return;
			}
			for(var i = 0; i < len; i++)
			{
				if(this.remarkGameListObjs[btnMsg].gamename == appEnv.collectGameListObjs[i].gamename)
				{	
					//已经收藏了就直接退出了
					isCollect = true;
					return;
				}
			}
			if(!isCollect)
			{
				this.remarkGameListObjs[btnMsg].isCollect = true;
				appEnv.collectGameListObjs.push(this.remarkGameListObjs[btnMsg]);
				this.page.setCookie(CookieFlag, collectGameObj, toJSON(appEnv.collectGameListObjs), 0);
				this.curPage = this.PAGE_GAME_MAIN;
				this.initGameData();
				this.clearSearchList();
			}
		}
	};
	
	//返回事件
	__Page.stateMyGame.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
			if(0 == this.appEnv.myGameJumpPage)
			{
				var page = this.page;
				var stateMain = page.stateMain;
				stateMain.showTopRect();
				stateMain.showBottomRect();
				stateMain.changeBottomState(1, 3);
				this.appEnv.switchState(page.stateHome, 1, null);
				return;
			}
			var paramObj = {type:1, pagestate:2,};
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			stateMain.changeBottomState(4, 1);
			this.appEnv.switchState(this.page.stateMy, 1, paramObj);
		}
	};
	
	//确定搜索事件
	__Page.stateMyGame.onSearchClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====确定搜索事件====");
			this.clearSearchList();
			this.getSearchGameListData();
		}
	};
	
	//搜索游戏数据
	__Page.stateMyGame.getSearchGameListData = function()
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
						{"key":"gamename", "value":this.gameKey}, 
						{"key":"pageno", "value":"" + pageno}, 
						{"key":"pagesize", "value":"" + pagesize}
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.getSearchGameListDataCallBack, paramObjs, cipherText);
	};
	
	//搜索游戏的回调函数
	__Page.stateMyGame.getSearchGameListDataCallBack = function(vo, isSuccess)
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
		for(var i = 0; i < len; i++)
		{
			this.searchGameListObj.gamelist.push(vo.gamelist[i]);
		}
		
		this.curPage = this.PAGE_SEARCH_GAME;
		this.showSearchGameList();
	};
	
	//获取搜索的关键字 
	__Page.stateMyGame.getSearchGameKeyClk = function(txt)
	{
		DBOut("======获取搜索的关键字=====");
		this.gameKey = txt;
		if(this.gameKey.length == 0 || !this.gameKey)
		{
			return;
		}
		this.appEnv.addLastSeareachGameRecord(txt);
		this.clearSearchList();

		this.getSearchGameListData();
	};
	
	//删除关键字搜索 
	__Page.stateMyGame.onCancelClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====删除关键字搜索====");
			this.editorBox.setText("");
			this.closeEditHud();
			this.curPage = this.PAGE_GAME_MAIN;
			this.initGameData();
			this.clearSearchList();
		}
	};
	
	//关闭输入框
	__Page.stateMyGame.closeEditHud = function()
	{
		this.editorBox.OnCloseEdit();
	};
	
	//计算相应字母所在的序号
	__Page.stateMyGame.getWordInListIndex = function(word)
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
	__Page.stateMyGame.wordSearchEvent = function(msg, extra, btnMsg)
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
			this.scrollBoxAreaItem.setShowItem(index);
		}
	};
}