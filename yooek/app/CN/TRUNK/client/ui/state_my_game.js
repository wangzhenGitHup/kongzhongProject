{	
	//============================我的游戏部分========================================================
	__Page.stateMy.onEnterMyGame = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=======进入我的游戏界面========");
			var appEnv = this.appEnv;
			if(!appEnv.isLogin)
			{
				this.appEnv.switchState(this.page.stateUserLogin, 1, null);
				return;
			}
			var isHaveCollectGame = 1;
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_MY_GAME;
			
			if(appEnv.collectGameListObjs.length == 0)
			{
				isHaveCollectGame = 0;
			}
			
			var bottomH = 120 + (appEnv.scaleFactorY - 1) * 15 + 1;
			this.stateMyGameItem = this.stateMyLayer.appendNewChild(this.page.initMyGame(this, appEnv.scrSize[0],
				appEnv.scrSize[1] - bottomH, isHaveCollectGame));
				
			this.stateMyGameGridBoxItem = this.stateMyGameItem.findItemById("myGameItem").findItemById("gridBox");
			this.gridBoxBg = this.stateMyGameItem.findItemById("girdBoxBg");
			this.editorBtn = this.stateMyGameItem.findItemById("editorGame");
			this.finishBtn = this.stateMyGameItem.findItemById("finishGame");
			this.noGameItem = this.stateMyGameItem.findItemById("noGameTip");
			if(!isHaveCollectGame)
			{
				this.noGameItem.setDisplay(1);
				this.gridBoxBg.setDisplay(0);
				this.editorBtn.setDisplay(0);
				return;
			}
			this.loadGameData(0, 0);
		}
	};
	
	//加载游戏:state1:表示是否打开删除按钮, state2:表示是否打开置顶按钮 
	__Page.stateMy.loadGameData = function(state1, state2)
	{
		var page = this.page;
		var appEnv = this.appEnv;
		var cssLib = page.cssLib;
		var gameIcon;
		var gameName;
		var css = [];
		var len = appEnv.collectGameListObjs.length;
		for(var i = 0; i < len; i++)
		{
			gameIcon = appEnv.collectGameListObjs[i].imageurl;
			gameName = appEnv.collectGameListObjs[i].gamename;
			if(i == 0)
			{
				css[i] = {css:cssLib["my_game_icon"](i, gameIcon, gameName, 18, [0, 0, 0, 1], this,
					[this.onDeleteCollectGameClk, this.onPullTopClk], state1, 0)};
			}
			else
			{
				css[i] = {css:cssLib["my_game_icon"](i, gameIcon, gameName, 18, [0, 0, 0, 1], this,
					[this.onDeleteCollectGameClk, this.onPullTopClk], state1, state2)};
			}
		}

		this.stateMyGameGridBoxItem.updateNewList(css);
		/*for(var i = 0; i < len; i++)
		{
			this.gameIconAni.push(this.stateMyGameGridBoxItem.findItemById("gameicon" + i).getAni(0));
		}*/
	};
	
	//播放收藏的游戏图标动画
	__Page.stateMy.playCollectGameIconAnimation = function(isPlay)
	{
		/*var len = this.gameIconAni.length;
		for(var i = 0; i < len; i++)
		{
			if(isPlay)
			{
				this.appEnv.flashItem(30, this.gameIconAni[i]);
			}
			else
			{
				this.appEnv.stopFlash(this.gameIconAni[i]);
			}
		}*/
	};
	
	//将收藏中的某选中游戏置顶 
	__Page.stateMy.onPullTopClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("===将某选中游戏置顶===");
			var appEnv = this.appEnv;
			var tmpGame = appEnv.collectGameListObjs[0];
			appEnv.collectGameListObjs[0] = appEnv.collectGameListObjs[btnMsg];
			appEnv.collectGameListObjs[btnMsg] = tmpGame;
			this.loadGameData(1, 1);
			this.playCollectGameIconAnimation(1);
		}
	};
	
	//删除收藏的游戏 
	__Page.stateMy.onDeleteCollectGameClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("===删除游戏====: " + btnMsg);
			var appEnv = this.appEnv;
			appEnv.deleteCollectGameObjList(btnMsg);
			//appEnv.collectGameListObjs.splice(btnMsg, 1);
			this.loadGameData(1, 1);
			this.playCollectGameIconAnimation(1);
		}
	};
	
	//编辑游戏事件 
	__Page.stateMy.onEditorGameClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("===编辑游戏事件===");
			if(!this.isEditor)
			{
				this.editorBtn.setDisplay(0);
				this.finishBtn.setDisplay(1);
				this.loadGameData(1, 1);
				this.playCollectGameIconAnimation(1);
			}
			else
			{
				this.editorBtn.setDisplay(1);
				this.finishBtn.setDisplay(0);
				this.loadGameData(0, 0);
				this.playCollectGameIconAnimation(0);
			}
			this.isEditor = this.isEditor ? false : true;
		}
	};
	
	//完成游戏编辑事件 
	__Page.stateMy.onFinishEditorGameClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====完成游戏编辑事件=====");
			this.isEditor = false;
			this.editorBtn.setDisplay(1);
			this.finishBtn.setDisplay(0);
			this.loadGameData(0, 0);
			this.playCollectGameIconAnimation(0);
		}
	};
	
	//搜索游戏 
	__Page.stateMy.onSeareachClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.appEnv.myGameJumpPage = 1;
			this.appEnv.switchState(this.page.stateMyGame, 1, null);
		}
	};
	
	//打开收藏游戏界面 
	__Page.stateMy.onOpenCollectGamePageClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====打开收藏游戏界面====");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			stateMain.showBottomRect();
			stateMain.showTopRect();
			this.appEnv.myGameJumpPage = 1;
			this.appEnv.switchState(page.stateMyGame, 1, null);
		}
	};
}