if(!__Page.stateHome)
{
	__Page.stateHome = {
		page:__Page,
		name:"JGXUI_stateHome",
		prjFilePath:null,
		adsCount:0,                //当前有的广告数量
		TOTAL_ADS:10,             //总共展示的广告数量超过10个
		preAds:0,               //上一个广告序号 
		nextAds:0,             //下一个广告序号 
		listAds:[],           //拥有的广告 
		listPayMethod:[],   //支付CSS对象 
		listGameCSS:[],   //拥有的游戏对象CSS 
		advertsObjs:[], //广告对象数组 
		advertIcon:[], //广告图标 
		recommendGameObjList:[], //推荐游戏对象数组 
		pageno:1, //页码 
		timer:0, 
		isRefreshFlag:false, //是否刷新游戏标志 
	};
	
	//__Page.appEnv.dynaStates.push(__Page.stateHome);
	//__Page.appEnv.entryState = __Page.stateHome;
	
	__Page.stateHome.init = function(appEnv, state)
	{
		var page,layer,stateMain;
		this.appEnv = appEnv;
		page = this.page;
		var cssLib = page.cssLib;
		stateMain = page.stateMain;
		page.keyStateUtil.call(this);
		
		this.stateHomeLayer = layer = stateMain.getEditorLayer();

		<include check="0">"ui/state_home_css.js"</include>
		
		var bottomBtnH = 120 + (appEnv.scaleFactorY - 1) * 15 + 1;
		this.stateHomeItem = layer.appendNewChild(this.initHomeCSS(appEnv.scrSize[0], appEnv.scrSize[1] - bottomBtnH));
		
		this.homeItemObj = this.stateHomeItem.findItemById("homeItem");
		this.homeAdsItemObj = this.homeItemObj.findItemById("mainAdsItem");
		this.listBoxAdsItemObj = this.homeItemObj.findItemById("listBoxmainAds");
		this.listBoxPayItemObj = this.homeItemObj.findItemById("listBoxmainPay");
		this.listBoxGameItemObj = this.homeItemObj.findItemById("scrollBox");
	
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
		this.txtLoading = appEnv.showLoadingPage(this.stateHomeLayer, this.stateHomeItem);
		//测试用
		//appEnv.clearLastSeareachGameRecord();

		layer.setUIEvent(1);
	};
	
	__Page.stateHome.enter = function(preState)
	{
		var appEnv = this.appEnv;
		appEnv.clearGameDetailObj();
		appEnv.clearCategoryListObj();
	//	appEnv.userInfoObj = this.page.getCookie(CookieFlag, userInfoObj); 
	//	appEnv.userInfoObj = fromJSON(appEnv.userInfoObj);

		this.getAdvertsFromServer();
		if(appEnv.isLogin)
		{
			this.refreshMessageList();
		}
	};
	
	//清除数据部分
	__Page.stateHome.clearData = function()
	{
		var len = 0;
		
		len = this.listAds.length;
		this.listAds.splice(0, len);
		
		len = this.listPayMethod.length;
		this.listPayMethod.splice(0, len);
		
		len = this.listGameCSS.length;
		this.listGameCSS.splice(0, len);
		
		len = this.advertsObjs.length;
		this.advertsObjs.splice(0, len);
	
		len = this.advertIcon.length;
		this.advertIcon.splice(0, len);
		
		len = this.recommendGameObjList.length;
		this.recommendGameObjList.splice(0, len);

		this.pageno = 1;
		this.preAds = 0;
		this.nextAds = 0;
		this.timer = 0;
		this.isRefreshFlag = false;
	};
	
	__Page.stateHome.leave = function(nextState)
	{
		var page = this.page;
		var stateMain = page.stateMain;
		this.appEnv.form.clearTimeout(this.adsTimerOut);
		this.adsTimerOut = null;
		
		this.appEnv.form.clearTimeout(this.messageTimerOut);
		this.mesageTimerOut = null;
		
		this.pageno = 1;
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
	
	//启动数据信息
	__Page.stateHome.startDataPage = function()
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		
		this.initListBoxAdsData();
		this.initPayMethod();
		this.initGameData();
		this.initAllListBoxData();
		appEnv.hideLoadingPage(this.stateHomeLayer, this.txtLoading, this.stateHomeItem);
		stateMain.showTopRect(0);
		stateMain.showBottomRect(0);
		this.autoPlayAds(250);
	};
	
	//初始化该界面所有列表中的数据
	__Page.stateHome.initAllListBoxData = function()
	{
		this.listBoxAdsItemObj.update(this.listAds);
		this.listBoxPayItemObj.update(this.listPayMethod);
		this.listBoxGameItemObj.insertItems(this.listGameCSS);
		this.insertRefreshHud();
	};
	
	//初始化广告数据
	__Page.stateHome.initListBoxAdsData = function()
	{
		var i = 0;
		var itemcss = null;
		var appEnv = this.appEnv;
		var sw = appEnv.scrSize[0];
		var sh = appEnv.scrSize[1];
		var cssLib = this.page.cssLib;
		var imgW = this.appEnv.scrSize[0];
		var imgH = 300 + (appEnv.scaleFactorY - 1) * 40;
		var len = this.listAds.length;
		this.listAds.splice(0, len);

		var rollSelectW = 19;
		var rollSelectH = 19;
		var gap = 15;
		var rollSelectY = imgH - 20;
		var rollSelectTotalW = (rollSelectW * this.adsCount + gap * (this.adsCount - 1));
		var rollSelectX = (sw - rollSelectTotalW) >> 1;
		
		for(i = 0; i < this.adsCount; i++)
		{
			itemcss = {css:cssLib["url_icon"]([0, 0, 0], "main_ads" + i, this.advertsObjs[i].url, imgW, imgH)};
			this.listAds.push(itemcss);
		}
		
		for(i = this.adsCount; i < this.TOTAL_ADS; i++)
		{
			this.homeAdsItemObj.showCircleIcon(i);
		}
		
		rollSelectX += 200;
		var x = 0;
		for(i = 0; i < this.adsCount; i++)
		{
			x = i * (gap + rollSelectW) + rollSelectX;
			this.homeAdsItemObj.setCirclePos([x, rollSelectY, 0], i);
		}
	};
	
	//初始化支付方式
	__Page.stateHome.initPayMethod = function()
	{
		var itemcss = null;
		var appEnv = this.appEnv;
		var cssLib = this.page.cssLib;
		var textLib = this.appEnv.textLib;
		var imgUrl = null;
		var isLocal = false;
		var payTxt;
		var len = appEnv.categoryListObj.categorylist.length;

		this.listPayMethod.splice(0, this.listPayMethod.length);
		
		for(var i = 0; i < len; i++)
		{
			payTxt = appEnv.categoryListObj.categorylist[i].categoryname;
			imgUrl = appEnv.categoryListObj.categorylist[i].imageurl;
			isLocal = appEnv.categoryListObj.categorylist[i].isLocal;
			itemcss = cssLib["main_payItemIcon"]("payMethod" + i , imgUrl, payTxt, isLocal);
			this.listPayMethod.push(itemcss);
		}
	};
	
	//初始化游戏数据
	__Page.stateHome.initGameData = function()
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var cssLib = page.cssLib;
		var css;
		var itemIndex = 0;
		var isHave = false;
		var offset = 0;
		this.clearRecommandGameObj();
		this.listGameCSS.splice(0, this.listGameCSS.length);
		
		for(var i = 0; i < 26; i++)
		{
			var len = appEnv.gameDetailObj[i].gamelist.length;
			var len1 = appEnv.collectGameListObjs.length;
			if(len <= 0)
			{
				continue;
			}

			for(var j = 0; j < len; j++)
			{
				isHave = false;
				this.recommendGameObjList.push(appEnv.gameDetailObj[i].gamelist[j]);
				
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
				offset++;
				css = {css:cssLib["main_gameItem"](offset, i, appEnv.gameDetailObj[i].gamelist[j].imageurl, appEnv.gameDetailObj[i].isCollect[j],
				appEnv.gameDetailObj[i].gamelist[j].gamename, appEnv.gameDetailObj[i].gamelist[j].description,
				appEnv.gameDetailObj[i].gamelist[j].ordernumber, this, [this.onOpenGameGoodsListClk, this.onCollectGameClk], itemIndex + j)};
				this.listGameCSS.push(css);
			}
			itemIndex += len;
		}
	};
	
	//清除推荐游戏对象数组
	__Page.stateHome.clearRecommandGameObj = function()
	{
		var len = this.recommendGameObjList.length;
		this.recommendGameObjList.splice(0, len);
	};
	
	//上拉刷新事件
	__Page.stateHome.OnTrigger = function(tag, dit, touch)
	{
		DBOut("=====上拉刷新事件====");
		
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
					this.startRefreshGameListData();
				}
			}
		}
	};
	
	//开始刷新推荐游戏列表 
	__Page.stateHome.startRefreshGameListData = function()
	{
		this.isRefreshFlag = true;
		var appEnv = this.appEnv;
		if(appEnv.gameDetailObj.hasnext)
		{
			//this.getRecommendGameListFromServer();
			appEnv.getRecommendGameListData(this.pageno, this, this.getGameListDataCallBack);
		}
		else
		{
			this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
		}
	};
	
	//获取推荐游戏数据的回调函数
	__Page.stateHome.getGameListDataCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getGameListData();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getGameListData();
			return;
		}
		if(!vo || !vo.gamelist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			//this.getRecommendGameListFromServer();
			appEnv.getRecommendGameListData(this.pageno, this, this.getGameListDataCallBack);
			return;
		}
		
		appEnv.gameDetailObj.hasnext = vo.hasnext;
		var len = vo.gamelist.length;
		if(vo.hasnext)
		{
			this.pageno++;
			this.isRefreshFlag = false;
		}
		for(var i = 0; i < len; i++)
		{
			appEnv.findGameData(vo.gamelist[i]);
		}
		
		this.initGameData();
		this.listBoxGameItemObj.insertItems(this.listGameCSS);
		this.insertRefreshHud();
	};
	
	//打开广告
	__Page.stateHome.openAdsClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("打开广告");
			if(this.advertsObjs[extra].linkurl)
			{
				//TODO:
				//跳转到浏览器打开广告
				jgx.App.shellExec(this.advertsObjs[extra].linkurl);
			}
		}
	};
	
	//改变选中状态
	__Page.stateHome.changeSelectState = function(idx)
	{
		this.nextAds = idx;
		this.homeAdsItemObj.updateSelectIcon(idx, this.preAds);
		this.preAds = idx;
	};
	
	//支付方式 
	__Page.stateHome.payMethodClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("========pay: " + extra);
			var appEnv = this.appEnv;
			if(0 == appEnv.categoryListObj.categorylist[extra].status)
			{
				Dialogs.alert(appEnv.textLib.txtNoFunctionTip);
				return;
			}
			var paramObj = {type:appEnv.categoryListObj.categorylist[extra].sysno};
			this.appEnv.switchState(this.page.stateSearch, 1, paramObj);
		}
	};
	
	//打开游戏商品列表
	__Page.stateHome.onOpenGameGoodsListClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			//paramObj:{type:界面类型, dataObj:数据对象, name:名称},
			var gameName = this.recommendGameObjList[btnMsg].gamename;
			this.appEnv.gameSysno = this.recommendGameObjList[btnMsg].gamesysno;
			var paramObj = {type:10, dataObj:this.recommendGameObjList[btnMsg].gamesysno, name:gameName};
			this.appEnv.switchState(this.page.stateRecharge, 1, paramObj);
		}
	};
	
	//收藏游戏 
	__Page.stateHome.onCollectGameClk = function(msg ,extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====收藏事件=====: " + btnMsg);
			var appEnv = this.appEnv;
			//var word = this.recommendGameObjList[btnMsg].initial.toUpperCase();
			var len = appEnv.collectGameListObjs.length;
			var isCollect = false;
			
			if(0 == len)
			{
				this.recommendGameObjList[btnMsg].isCollect = true;
				appEnv.collectGameListObjs.push(this.recommendGameObjList[btnMsg]);
				this.page.setCookie(CookieFlag, collectGameObj, toJSON(appEnv.collectGameListObjs), 0);
				this.initGameData();
				this.listBoxGameItemObj.insertItems(this.listGameCSS);
				this.insertRefreshHud();
				return;
			}
			for(var i = 0; i < len; i++)
			{
				if(this.recommendGameObjList[btnMsg].gamename == appEnv.collectGameListObjs[i].gamename)
				{
					//已经收藏了就直接退出了
					isCollect = true;
					return;
				}
			}
			if(!isCollect)
			{
				this.recommendGameObjList[btnMsg].isCollect = true;
				appEnv.collectGameListObjs.push(this.recommendGameObjList[btnMsg]);
				this.page.setCookie(CookieFlag, collectGameObj, toJSON(appEnv.collectGameListObjs), 0);
				this.initGameData();
				this.listBoxGameItemObj.insertItems(this.listGameCSS);
				this.insertRefreshHud();
			}
		}
	};
	
	//插入上拉刷新控件
	__Page.stateHome.insertRefreshHud = function()
	{
		var page = this.page;
		var appEnv = this.appEnv;

		if(!appEnv.gameDetailObj.hasnext)
		{
			return;
		}
		this.listBoxGameItemObj.insertItem(page.loadReFreshModel(this, appEnv.scrSize[0]));
		this.listBoxGameItemObj.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.listBoxGameItemObj.findItemById("loadRefreshItem").findItemById("tip");
		this.listBoxGameItemObj.setTrigger(80, 1);
		this.listBoxGameItemObj.setTrigger(30, 2);
	};
	
	//自动播放广告 
	__Page.stateHome.autoPlayAds = function(timer)
	{
		this.adsTimerOut = this.appEnv.form.setFrameout(timer, function(){
			this.appEnv.form.clearTimeout(this.adsTimerOut);
			this.adsTimerOut = null;
			this.autoAddAdsIndex();
			this.listBoxAdsItemObj.showListBoxItem(this.nextAds, false);
			this.autoPlayAds(timer);
		}, this);
	};
	
	__Page.stateHome.autoAddAdsIndex = function()
	{
		this.nextAds++;
		if(this.nextAds > this.adsCount - 1)
		{
			this.nextAds = 0;
		}
		this.changeSelectState(this.nextAds);
	};
	
	//获取广告列表 
	__Page.stateHome.getAdvertsFromServer = function()
	{
		var appEnv = this.appEnv;
		var plainText;
		var ciphertext;
		var tokenid = 1;//appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		//positionid	N	需要新增页面位置，暂定901
		//pagetype	N	页面ID，APP首页暂定90
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.advertisement"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"positionid", "value":"901"}, 
						{"key":"pagetype", "value":"90"},
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		ciphertext = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.getAdvertisementDataCallBack, paramObjs, ciphertext);
	};
	
	//获取广告列表的回调函数
	__Page.stateHome.getAdvertisementDataCallBack = function(vo, isSuccess)
	{
		/*
			vo.title;//广告标题
			vo.adtype;
			vo.url;//资源地址
			vo.startdate; //开始时间
			vo.enddate; //结束时间
			vo.priority;//等级，数值越高级别越大
			vo.status;//状态:0 无效 1 有效
			vo.locationsysno;//需要新增页面位置，暂定401
			vo.pageid;//页面ID，APP首页暂定40
			vo.linkurl;//广告跳转页面
		*/
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getAdvertsFromServer();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getAdvertsFromServer();
			return;
		}
		if(!vo || !vo.adlist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getAdvertsFromServer();
			return;
		}
		
		var len = vo.adlist.length;
		this.adsCount = vo.Total;
		this.advertsObjs.splice(0, this.advertsObjs.length);
		
		for(var i = 0; i < len; i++)
		{
			this.advertsObjs.push(vo.adlist[i]);
		}
		
		var func;
		var pageno = 1;
		if(this.isRefreshFlag)
		{
			func = this.getGameListDataCallBack;
			pageno = this.pageno;
		}
		else
		{
			func = this.getRecommendGameDataCallBack;
		}
		appEnv.getRecommendGameListData(pageno, this, func);
	};
	
	//获取推荐游戏的回调函数
	__Page.stateHome.getRecommendGameDataCallBack = function(vo, isSuccess)
	{
		/*
			gamesysno:游戏主键
			gamename:游戏名字
			gametype:游戏类型 网络游戏:1 手机游戏:2 网页游戏:3
			initial:首字母
			pinyin:拼音
			startdate:开始时间
			enddate:结束时间
			priority:等级，数值越高级别越大
			status:状态:0 无效 1 有效
			locationsysno:游戏推荐位置暂定9
			imageurl:图片地址
			description:描述
			ordernumber:订单数
			positionId:游戏推荐位置，暂定902
		*/

		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			if(Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip))
			{
				//this.getRecommendGameListFromServer();
				appEnv.getRecommendGameListData(1, this, this.getRecommendGameDataCallBack);
			}
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			//this.getRecommendGameListFromServer();
			appEnv.getRecommendGameListData(1, this, this.getRecommendGameDataCallBack);
			return;
		}
		if(!vo || !vo.gamelist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			//this.getRecommendGameListFromServer();
			appEnv.getRecommendGameListData(1, this, this.getRecommendGameDataCallBack);
			return;
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
		
		this.getCategoryListFromServer();
	};

	//获取游戏分类数据
	__Page.stateHome.getCategoryListFromServer = function()
	{
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var tokenid = 1;//appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.categorylist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"},
						{"key":"ifverifytokenid", "value":"true"}, 
					];

		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.getCategoryListFromServerCallBack, paramObjs, cipherText);
	};
	
	//获取游戏分类数据的回调函数
	__Page.stateHome.getCategoryListFromServerCallBack = function(vo, isSuccess)
	{
		//categorylist []	N	游戏分类列表
		/*
			categoryname	N	分类名
			priority	N	等级，数值越高级别越大
			imageurl	Y	图片地址,如果有值就加载，没值就取客户端
			status	N	状态:0 无效 1 有效
			sysno	N	分类主键
		*/
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			if(Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip))
			{
				this.getCategoryListFromServer();
			}
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getCategoryListFromServer();
			return;
		}
		if(!vo || !vo.categorylist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getCategoryListFromServer();
			return;
		}
		
		appEnv.categoryListObj.categorylist.splice(0, appEnv.categoryListObj.categorylist.length);
		var j = 0;
		var len = vo.categorylist.length;
		for(var i = 0; i < len; i++)
		{
			j = i;
			if(!vo.categorylist[i].imageurl)
			{
				if(j > 2)
				{
					j = 0;
				}
				if("10" == vo.categorylist[i].sysno)
				{
					vo.categorylist[i].imageurl = "paymethod_0";
				}
				else if("11" == vo.categorylist[i].sysno)
				{
					vo.categorylist[i].imageurl = "paymethod_1";
				}
				else if("9" == vo.categorylist[i].sysno)
				{
					vo.categorylist[i].imageurl = "paymethod_2";
				}
				else
				{
					vo.categorylist[i].imageurl = "paymethod_" + j;
				}
				vo.categorylist[i].isLocal = true;
			}
			appEnv.categoryListObj.categorylist.push(vo.categorylist[i]);
		}
		
		//以下步骤只是为了将首充和首充续充排在1、2、3位置
		var tmp1;
		var tmp2;
		var tmp3;
		var flag1;
		var flag2;
		var flag3;
		var tmp;
		
		//先找找这3个老大的位置，给记录下
		for(var i = 0; i < len; i++)
		{
			if(appEnv.categoryListObj.categorylist[i].sysno == "10")
			{
				tmp1 = appEnv.categoryListObj.categorylist[i];
				flag1 = i;
				continue;
			}
			
			if(appEnv.categoryListObj.categorylist[i].sysno == "11")
			{
				tmp2 = appEnv.categoryListObj.categorylist[i];
				flag2 = i;
				continue;
			}
			
			if(appEnv.categoryListObj.categorylist[i].sysno == "9")
			{
				tmp3 = appEnv.categoryListObj.categorylist[i];
				flag3 = i;
				continue;
			}
		}
		
		tmp = appEnv.categoryListObj.categorylist[0];
		appEnv.categoryListObj.categorylist[0] = tmp1;
		appEnv.categoryListObj.categorylist[flag1] = tmp;
		
		tmp = appEnv.categoryListObj.categorylist[1];
		appEnv.categoryListObj.categorylist[1] = tmp2;
		appEnv.categoryListObj.categorylist[flag2] = tmp;
		
		tmp = appEnv.categoryListObj.categorylist[2];
		appEnv.categoryListObj.categorylist[2] = tmp3;
		appEnv.categoryListObj.categorylist[3] = tmp;
		//==============end==================================
		//开启界面
		this.startDataPage();
	};
	
	//获取消息列表
	__Page.stateHome.getMessageList = function()
	{	
		/*
			customersysno	n	客户主键
		*/
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.getmsgcountlist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"sendcustomersysno", "value":"" + appEnv.userInfoObj.customersysno}, 
					];
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.getMessageListCallBack, paramObjs, cipherText);
	};
	
	//获取消息列表的回调函数
	__Page.stateHome.getMessageListCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		if(!isSuccess)
		{
			this.getMessageList();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getMessageList();
			return;
		}
		if(!vo || !vo.msglist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getMessageList();
			return;
		}
		
		var count = 0;
		for(var i = 0; i < vo.msglist.length; i++)
		{
			count += vo.msglist[i].msgcount;
		}
		stateMain.messageCnt = parseInt(count);
		stateMain.changeMessageState();
	};
	
	//定期请求消息列表
	__Page.stateHome.refreshMessageList = function()
	{
		this.messageTimerOut = this.appEnv.form.setTimeout(this.timer, function(){
			this.appEnv.form.clearTimeout(this.messageTimerOut);
			this.messageTimerOut = null;
			this.timer = 8000;
			this.getMessageList();
		}, this);
	};
}