//*********************************************************
//推荐的游戏
//*********************************************************
{
	//用于检索首字母下的游戏数据
	__Page.appEnv.findGameData = function(dataObj)
	{
		var find_initial = dataObj.initial.toUpperCase();
		var pos = this.wordlist[find_initial];
		this.posFlag = pos;
		this.gameDetailObj[pos].gamelist.push(dataObj);
	};
	
	//由首字母获取相应位置
	__Page.appEnv.accordingWordToGetPos = function(word)
	{
		word = word.toUpperCase();
		return this.wordlist[word];
	};
	
	//清除具体的首字母所含有的游戏列表对象数组
	__Page.appEnv.clearGameDetailObj = function()
	{
		var len = 0;
		for(var i = 0; i < 26; i++)
		{
			len = this.gameDetailObj[i].gamelist.length;
			this.gameDetailObj[i].gamelist.splice(0, len);
			
			len = this.gameDetailObj[i].isCollect.length;
			this.gameDetailObj[i].isCollect.splice(0, len);
		}
	};
	
	//清除搜索的游戏
	__Page.appEnv.clearSearchGameList = function()
	{
		var len = 0;
		
		for(var i = 0; i < 26; i++)
		{
			len = this.searchGameDetailObj[i].gamelist.length;
			this.searchGameDetailObj[i].gamelist.splice(0, len);
		}
	};
	
	//删除收藏的游戏
	__Page.appEnv.deleteCollectGameObjList = function(btnMsg)
	{
		this.collectGameListObjs.splice(btnMsg, 1);
		this.page.setCookie(CookieFlag, collectGameObj, toJSON(this.collectGameListObjs), 0);
	};
	
	//清除收藏的游戏对象数组 貌似用不上
	__Page.appEnv.clearCollectGameObjList = function()
	{
		var len = this.collectGameListObjs.length;
		this.collectGameListObjs.splice(0, len);
	};
	
	//增加最近搜索条目
	__Page.appEnv.addLastSeareachGameRecord = function(txt)
	{
		//空格还管个啥了
		var isGoOn = false;
		for(var i = 0; i < txt.length; i++)
		{
			if(txt[i] != " ")
			{
				isGoOn = true;
				break;
			}
			//isGoOn = false;
		}
		if(!isGoOn)
		{
			return;
		}
		var len = this.lastSeareachGameList.length;
		for(var i = 0; i < len; i++)
		{
			if(this.textFilter.checkChinese(txt))//不是汉字
			{
				if(txt.toUpperCase() == this.lastSeareachGameList[i].toUpperCase())
				{
					return;
				}
			}
			else
			{
				if(txt == this.lastSeareachGameList[i])
				{
					return;
				}
			}
		}
		if(len > 2)
		{
			this.lastSeareachGameList.splice(0, 1);
			this.lastSeareachGameList.push(txt);
		}
		else
		{
			this.lastSeareachGameList.push(txt);
		}
		this.page.setCookie(CookieFlag, lastSearchKey, toJSON(this.lastSeareachGameList), 0);
	};
	
	//清除最近搜索的游戏记录
	__Page.appEnv.clearLastSeareachGameRecord = function()
	{
		var len = this.lastSeareachGameList.length;
		this.lastSeareachGameList.splice(0, len);
		this.page.setCookie(CookieFlag, lastSearchKey, toJSON(this.lastSeareachGameList), 0);
	};
	
	//清除充值分类列表
	__Page.appEnv.clearCategoryListObj = function()
	{
		var len = this.categoryListObj.categorylist.length;
		this.categoryListObj.categorylist.splice(0, len);
	};
}
