/*
	选择充值方式界面  
*/
if(!__Page.stateRecharge)
{
	__Page.stateRecharge = {
		page:__Page,
		name:"JGXUI_stateRecharge",
		prjFilePath:null,
		//=========常量=================
		toolBarOne:2,//价格排序的箭头方向控制
		toolBarTwo:2,//折扣排序的箭头方向控制
		toolBarThree:2,//销量排序的箭头方向控制
		STATE_DOWN:1,//箭头朝下
		STATE_UP:2,//箭头朝上 
		FIRST_RECHARGE_TYPE:"10",//首充类型 
		SECOND_RECHARGE_TYPE:"11",//首充续充类型 
		//PAGE_SEAREACH_MODEL:1, //搜索游戏界面 
		PAGE_FILTER:1, //筛选界面 
		DECREASE:0, //递减
		INCREASE:1, //递增
		SORT_PRICE:0, //价格排序
		SORT_DISACCOUNT:1, //折扣排序
		SORT_SELLCOUNT:2, //销量排序
		
		//===========变量=============
		firstBtn:true,//首充类型控制
		secondBtn:false,//续充类型控制
		thridBtn:false,//苹果代充控制 
		isSelectSortOne:true,//价格排序控制 
		isSelectSortTwo:false,//折扣排序控制
		isSelectSortThree:false,//销量排序控制
		textBarItem:[], //分类文本数组 
		btnkeys:[], //按下充值按钮 
		goodsObjs:{productlist:[], hasnext:false}, //商品对象数组 
		searchAccount:null, //查询的账号 
		
		btnLeftState:true,
		btnRightState:false,
		scrollBoxSubItem:[],
		labelType:0, //标签类型  
		selectPrice:-1, //所选择的价格 
		selectBusiness:"", //所选择的运营商 
		goodsPriceObjs:{pricelist:[], hasnext:false}, //商品价格对象数组 
		goodsBusinessObjs:{agentlist:[], hasnext:false}, //运营商对象数组
		isRefreshFlag:false, //是否刷新的标志 
		goods_pageno:1, //商品页码 
		price_pageno:1, //价格页码 
		business_pageno:1, //运营商页码
		
		curPage:0, //当前的界面是什么 
	};

	__Page.stateRecharge.init = function(appEnv)
	{
		var page = this.page;
		var item;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;
		
		this.appEnv = appEnv;
		this.type = "" + appEnv.stateType;

		this.vo = appEnv.stateDataObj;
		
		page.keyStateUtil.call(this);
		
		this.stateRechargeLayer =  stateMain.getEditorLayer();
		<include check="0">"ui/state_recharge_css.js"</include>

		this.loadGoodsPage();

		this.stateRechargeLayer.setUIEvent(1);
	};

	//加载商品列表界面
	__Page.stateRecharge.loadGoodsPage = function()
	{
		var appEnv = this.appEnv;
		this.stateRechargeMethodItem = this.stateRechargeLayer.appendNewChild(this.loadRechargeCSS(appEnv.scrSize[0]));
		var areaH = 120 + (appEnv.scaleFactorY - 1) * 15 + 1;
		this.stateRechargeGoodsItem = this.stateRechargeLayer.appendNewChild(this.loadGoodsDataCSS(appEnv.scrSize[0],
			appEnv.scrSize[1] - areaH, appEnv.gameName));
		item = this.stateRechargeGoodsItem.findItemById("stateRechargeItem");

	//======================续充时会出现的区域====================
		this.queryItem = item.findItemById("queryBg");
		this.resultArrowOne = item.findItemById("nextArrow1");
		this.resultArrowTwo = item.findItemById("nextArrow2");
		this.resultTextTip = item.findItemById("queryResult");
		this.resultBg = item.findItemById("queryResultBg");
		this.editItem = item.findItemById("inputBoxBgseareachAccount");
	//================具体的3个排序按键key和筛选key===================
		this.toolBarOneItem = item.findItemById("toolBar1");
		this.toolBarTwoItem = item.findItemById("toolBar2");
		this.toolBarThreeItem = item.findItemById("toolBar3");
		this.toolBarFourItem = item.findItemById("toolBar4");
	//============排序的3个key区域===================================
		this.toolBarOneKey = item.findItemById("toolBar1key");
		this.toolBarTwoKey = item.findItemById("toolBar2key");
		this.toolBarThreeKey = item.findItemById("toolBar3key");
		this.toolBarFourKey = item.findItemById("toolBar4key");
	//========================具体的商品信息区域===================
		this.bgItem = item.findItemById("bg1");
		this.goodsScrollBoxItem = item.findItemById("scrollBox");
	//===========================================================
		this.rechargeMethodListBoxItem = this.stateRechargeMethodItem.findItemById("listBoxpayMethod");
		this.loadRechargeMethod();
	};
	
	//加载各种支付方式界面
	__Page.stateRecharge.loadRechargeMethod = function()
	{
		var appEnv = this.appEnv;
		var cssLib = this.page.cssLib;
		var len = appEnv.categoryListObj.categorylist.length;
		var css;
		var clr1 = [0.99, 0.51, 0.03, 1];
		var clr2 = [0, 0, 0, 1];
		var clr = null;
		var icon = null;
		var text = null;
		var isLocal = false;
		var cc1;
		for(var i = 0; i < len; i++)
		{
			if(appEnv.categoryListObj.categorylist[i].sysno == this.type)
			{
				clr = clr1;
				this.btnkeys[i] = true;
			}
			else
			{
				clr = clr2;
				this.btnkeys[i] = false;
			}
			icon = appEnv.categoryListObj.categorylist[i].imageurl;
			text = appEnv.categoryListObj.categorylist[i].categoryname;
			isLocal = appEnv.categoryListObj.categorylist[i].isLocal;
			css = {css:cssLib["recharge_type_key"]("rechargeMethod" + i, icon, text, clr, isLocal, this, this.onPayMethodClk, i)};
			this.rechargeMethodListBoxItem.insertItem(css);
			this.textBarItem[i] = this.rechargeMethodListBoxItem.findItemById("rechargeMethod" + i);
		}
		this.jumpAdjustRechargeMethod();
	};
	
	//界面被激活的响应函数:
	__Page.stateRecharge.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateRecharge enter!");
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		this.initPage();
	};
	
	//界面被切走的响应函数:
	__Page.stateRecharge.leave = function(nextState)
	{
		//TODO:code this:
		this.goods_pageno = 1;
		this.isRefreshFlag = false;
		this.appEnv.isHaveAccount = false;
		this.clearListObj();
		this.stateRechargeLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateRecharge.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateRecharge.onKey = function(msg, key, way, extra)
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
	
	//初始化界面
	__Page.stateRecharge.initPage = function()
	{
		var appEnv = this.appEnv;
		if(this.type == this.SECOND_RECHARGE_TYPE)
		{
			if(appEnv.isHaveAccount || !appEnv.isSearchFlag)
			{
				this.showGoodsDataArea();
				appEnv.isSearchFlag = true;
				this.getGoodsData();
				return;
			}
		
			this.firstBtn = false;
			this.thridBtn = false;
			this.hideGoodsDataArea();
		}
		else
		{
			this.showGoodsDataArea();
			this.getGoodsData();
		}

		var whoMethod;
		var len = appEnv.categoryListObj.categorylist.length;
		for(var i = 0; i < len; i++)
		{
			if(this.type == appEnv.categoryListObj.categorylist[i].sysno)
			{
				whoMethod = i;
				break;
			}
		}
		this.changeTextColor(whoMethod);
	};
	
	//隐藏商品数据区域 
	__Page.stateRecharge.hideGoodsDataArea = function()
	{
		this.goodsScrollBoxItem.setDisplay(0);
		if(this.bgItem)
		{
			this.bgItem.setDisplay(0);
		}
		this.toolBarOneKey.setDisplay(0);
		this.toolBarTwoKey.setDisplay(0);
		this.toolBarThreeKey.setDisplay(0);
		this.toolBarFourKey.setDisplay(0);
		this.queryItem.setDisplay(1);
	};
	
	//开启商品数据区域 
	__Page.stateRecharge.showGoodsDataArea = function()
	{
		this.goodsScrollBoxItem.setDisplay(1);
		if(this.bgItem)
		{
			this.bgItem.setDisplay(1);
		}
		this.toolBarOneKey.setDisplay(1);
		this.toolBarTwoKey.setDisplay(1);
		this.toolBarThreeKey.setDisplay(1);
		this.toolBarFourKey.setDisplay(1);
		
		this.resultArrowOne.setDisplay(0);
		this.resultArrowTwo.setDisplay(0);
		this.resultTextTip.setDisplay(0);
		this.resultBg.setDisplay(0);
		this.queryItem.setDisplay(0);
	};
	
	//获取商品数据
	__Page.stateRecharge.getGoodsData = function()
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		var gamesysno = appEnv.gameSysno;
		var categorysysno = this.type;
		var pageno = this.goods_pageno;
		var pagesize = 15;
		var plainText = ""; //明文
		var cipherText = ""; //密文	
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.product.searchlist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"pageno", "value":"" + pageno}, 
						{"key":"pagesize", "value":"" + pagesize},
						{"key":"categorysysno", "value":"" + categorysysno},
						{"key":"gamesysno", "value":"" + gamesysno},
						{"key":"statuslist", "value":"1"},
						{"key":"upshelflist", "value":"1"},
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		stateMain.hideBottomRect();
		this.txtLoading = appEnv.showLoadingPage(this.stateRechargeLayer, this.stateRechargeGoodsItem);
		this.stateRechargeMethodItem.setDisplay(0);
		appEnv.getFromServerData(this, this.getGoodsDataCallBack, paramObjs, cipherText);
	};
	
	//获取商品数据的回调函数
	__Page.stateRecharge.getGoodsDataCallBack = function(vo, isSuccess)
	{
		/*
			productsysno:商品主键
			productid:商品ID
			productname:商品名
			price:商品原价
			sellname:卖家名
			discount:折扣
			rebateprice:优惠价
			ordernumber:销量
			sellflag:卖家类型  1=C2C  2=B2C 3 游易客自营 默认C2C
			selllevelImage:卖家等级
			agentstr:运营商
			zonestr:大区
			serverstr:服务器
			gameimageurl:图片地址
		*/
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		
		appEnv.hideLoadingPage(this.stateRechargeLayer, this.txtLoading, this.stateRechargeGoodsItem);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getGoodsData();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getGoodsData();
			return;
		}
		if(!vo || !vo.productlist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getGoodsData();
			return;
		}
		if(!vo.productlist.length)
		{
			stateMain.showBottomRect();
			this.stateRechargeMethodItem.setDisplay(1);
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtNoHaveSearchTip);}, this);
			return;
		}
		//this.goodsObjs.productlist.splice(0, this.goodsObjs.productlist.length);

		if(vo.hasnext && this.isRefreshFlag)
		{
			this.goods_pageno++;
			this.isRefreshFlag = false;
		}
		var len = vo.productlist.length;
		for(var i = 0; i < len; i++)
		{
			this.goodsObjs.productlist.push(vo.productlist[i]);
		}
		this.goodsObjs.hasnext = vo.hasnext;
		
		stateMain.showBottomRect();
		this.stateRechargeMethodItem.setDisplay(1);
		this.shellSort(this.SORT_PRICE, this.INCREASE);
		this.loadRechargeGoodsData();
	};
	
	//加载商品数据 
	__Page.stateRecharge.loadRechargeGoodsData = function()
	{
		this.curPage = 0;
		var appEnv = this.appEnv;
		var sw = appEnv.scrSize[0];
		var page = this.page;
		var cssLib = page.cssLib;
		var textLib = appEnv.textLib;
		var gameIcon = "";
		var goodsDesTxt = "";
		var gameUseSer = "";
		var ordernumber = "";
		
		var curPriceTxt = "";
		var previousPriceTxt = "";
		var discountTxt = "";
		var css = [];
		var productListObj = this.goodsObjs.productlist;
		var len = productListObj.length;
		
		if(len == 0)
		{
			return;
		}
		for(var i = 0; i < len; i++)
		{
			gameIcon = productListObj[i].gameimageurl;
			goodsDesTxt = productListObj[i].productname;
			gameUseSer = textLib.txtGameServerTip + ":" + productListObj[i].zonestr + "/" + productListObj[i].serverstr;
			ordernumber = productListObj[i].ordernumber;
			previousPriceTxt = textLib.txtPriceTip1 + ":" + productListObj[i].price + textLib.txtYuanTip;
			curPriceTxt = "" + productListObj[i].rebateprice;
			if(productListObj[i].discount <= 0)
			{
				discountTxt = null;
			}
			else
			{
				discountTxt = productListObj[i].discount + textLib.txtDiscountTip1;
			}
			var textArr = [goodsDesTxt, gameUseSer, ordernumber, discountTxt, curPriceTxt, previousPriceTxt];
			css[i] = {css:cssLib["sales_goods_info"](gameIcon, textArr, this, this.onEnterGoodsClk, i)};
		}
		this.goodsScrollBoxItem.insertItems(css);
		
		if(!this.goodsObjs.hasnext)
		{
			return;
		}
		this.goodsScrollBoxItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0]));
		this.goodsScrollBoxItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.goodsScrollBoxItem.findItemById("loadRefreshItem").findItemById("tip");
		this.goodsScrollBoxItem.setTrigger(80, 1);
		this.goodsScrollBoxItem.setTrigger(30, 2);
	};
	
	//跳转到相应的充值方式
	__Page.stateRecharge.jumpAdjustRechargeMethod = function()
	{
		var appEnv = this.appEnv;
		var flag = 0;
		var len = appEnv.categoryListObj.categorylist.length;
		for(var i = 0; i < len; i++)
		{
			if(this.type == appEnv.categoryListObj.categorylist[i].sysno)
			{
				flag = i;
				break;
			}
		}
		this.rechargeMethodListBoxItem.showListBoxItem(flag, false);
		this.changeTextColor(flag);
		this.btnkeys[flag] = true;
	};
	
	//上拉刷新事件
	__Page.stateRecharge.OnTrigger = function(tag, dit, touch)
	{
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
					if(this.curPage == this.PAGE_FILTER)
					{
						this.startRefreshFilterData();
					}
					else
					{
						this.startRefreshGoodsData();
					}
				}
			}
		}
	};
	
	//开始刷新商品数据
	__Page.stateRecharge.startRefreshGoodsData = function()
	{
		if(this.goodsObjs.hasnext)
		{
			this.isRefreshFlag = true;
			this.getGoodsData();
		}
		else
		{
			this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
		}
	};
	
	//输入查询账号 
	__Page.stateRecharge.inputEvent = function(txt)
	{
		this.searchAccount = txt;
	};
	
	//首充续充下一步事件 
	__Page.stateRecharge.onNextStepClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			//btnMsg = 0:去充值
			//btnMsg = 1:购买首充号 
			DBOut("=====首充续充下一步事件====");
			this.appEnv.isHaveAccount = false;
			if(0 == btnMsg)
			{
				this.type = this.SECOND_RECHARGE_TYPE;
				this.showGoodsDataArea();
				this.getGoodsData();
			}
			else
			{
				//TODO:
				this.type = this.FIRST_RECHARGE_TYPE;
				this.btnkeys[0] = true;
				this.goodsScrollBoxItem.clearItems();
				this.showGoodsDataArea();
				this.getGoodsData();
				this.changeTextColor(0);
			}
		}
	};
	
	//查询事件 
	__Page.stateRecharge.onQueryClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====查询事件======");
			this.checkSearchAccountIsRight();
		}
	};
	
	//验证所查询的账号是否正确 this.searchAccount
	__Page.stateRecharge.checkSearchAccountIsRight = function()
	{
		this.closeEditHud();
		
		var appEnv = this.appEnv;
		var positionid = 901;
		var pagetype = 90;
		var plainText;
		var ciphertext;
		var customersysno = appEnv.userInfoObj.customersysno?appEnv.userInfoObj.customersysno:1;
		var firstbuyaccount = this.searchAccount;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.order.checkbuyaccount"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno}, 
						{"key":"firstbuyaccount", "value":"" + firstbuyaccount},
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		ciphertext = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.checkSearchAccountIsRightCallBack, paramObjs, ciphertext);
		appEnv.showLoadingPageSecond(this.stateRechargeLayer);
	};
	
	//验证所查询的账号是否正确的回调函数
	__Page.stateRecharge.checkSearchAccountIsRightCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateRechargeLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.checkSearchAccountIsRight();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			//this.checkSearchAccountIsRight();
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.checkSearchAccountIsRight();
			return;
		}
		
		if(1 == vo.value)
		{
			this.resultArrowOne.setDisplay(1);
			this.resultArrowTwo.setDisplay(0);
			this.resultTextTip.setDisplay(1);
			this.resultBg.setDisplay(1);
			this.resultTextTip._setText(appEnv.textLib.txtAccountTip1 + vo.agentstr + appEnv.textLib.txtAccountTip2);
			this.appEnv.isHaveAccount = true;
			return;
		}
		this.btnkeys[1] = false;
		this.resultArrowOne.setDisplay(0);
		this.resultArrowTwo.setDisplay(1);
		this.resultTextTip.setDisplay(1);
		this.resultBg.setDisplay(1);
		this.resultTextTip._setText(appEnv.textLib.txtNoHaveAccountTip);
		this.appEnv.isHaveAccount = false;
	};
	
	//进入商品 
	__Page.stateRecharge.onEnterGoodsClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====进入商品======: " + this.goodsObjs.productlist[btnMsg].productsysno);
			//paramObj:{type:界面类型, dataObj:数据对象, name:名称, specialFlag:特定标志},
			var appEnv = this.appEnv;
			var paramObj = {type:this.type, dataObj:this.goodsObjs.productlist[btnMsg], name:appEnv.gameName,
				specialFlag:appEnv.stateJumpFlag};
			this.appEnv.switchState(this.page.stateBuyGoods, 1, paramObj);
		}
	};
	
	//搜索 
	__Page.stateRecharge.onSeareachClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====搜索====");
			this.closeEditHud();
			this.appEnv.switchState(this.page.stateSearch, 1, null);
		}
	};
	
	//改变字体颜色 
	__Page.stateRecharge.changeTextColor = function(who)
	{
		var len = this.textBarItem.length;
		for(var i = 0; i < len; i++)
		{
			if(i == who)
			{
				this.textBarItem[i].setColor([0.99, 0.51, 0.03, 1]);
			}
			else
			{
				this.textBarItem[i].setColor([0, 0, 0, 1]);
			}
		}
	};
	
	//充值类型 
	__Page.stateRecharge.onPayMethodClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====充值类型=======: " + extra);
			var appEnv = this.appEnv;
			this.type = appEnv.categoryListObj.categorylist[extra].sysno;
			
			if(!this.btnkeys[extra])
			{
				var len = this.btnkeys.length;
				for(var i = 0; i < len; i++)
				{
					if(i == extra)
					{
						this.btnkeys[i] = true;
					}
					else
					{
						this.btnkeys[i] = false;
					}
				}
				this.changeTextColor(extra);
				
				this.goodsScrollBoxItem.clearItems();
				this.goods_pageno = 1;
				if(1 == extra)
				{
					if(this.appEnv.isHaveAccount)
					{
						this.showGoodsDataArea();
						this.type = appEnv.categoryListObj.categorylist[extra].sysno;
						this.clearListObj();
						this.getGoodsData();
						return;
					}
					this.hideGoodsDataArea();
				}
				else
				{
					this.goodsScrollBoxItem.clearItems();
					this.showGoodsDataArea();
					this.type = appEnv.categoryListObj.categorylist[extra].sysno;
					this.clearListObj();
					this.getGoodsData();
				}
			}
		}
	};
	
	//根据价格排序 
	__Page.stateRecharge.accordingPriceToSort = function(type)
	{
		if(this.DECREASE == type)//递减
		{
			this.shellSort(this.SORT_PRICE, this.DECREASE);
		}
		else//递增
		{
			this.shellSort(this.SORT_PRICE, this.INCREASE);
		}
		this.loadRechargeGoodsData();
	};
	
	//根据销量排序 
	__Page.stateRecharge.accordingSaleCountsToSort = function(type)
	{
		if(this.DECREASE == type)//递减
		{
			this.shellSort(this.SORT_SELLCOUNT, this.DECREASE);
		}
		else//递增
		{
			this.shellSort(this.SORT_SELLCOUNT, this.INCREASE);
		}
		this.loadRechargeGoodsData();
	};
	
	//根据折扣排序 
	__Page.stateRecharge.accordingDiscountToSort = function(type)
	{
		if(this.DECREASE == type)//递减
		{
			this.shellSort(this.SORT_DISACCOUNT, this.DECREASE);
		}
		else//递增
		{
			this.shellSort(this.SORT_DISACCOUNT, this.INCREASE);
		}
		this.loadRechargeGoodsData();
	};
	
	//排序算法,此处采用希尔排序
	__Page.stateRecharge.shellSort = function(type, dir)
	{
		var i = 0;
		var j = 0;
		var tmp = 0;
		var len = this.goodsObjs.productlist.length;
		var gap = len >> 1;
		var tmpObj;
		var tmpKey;
		
		while(gap > 0)
		{
			for(i = gap; i < len; i++)
			{
				j = i - gap;
				tmpObj = this.goodsObjs.productlist[i];
				if(this.SORT_PRICE == type)//价格排序
				{
					tmpKey = tmpObj.rebateprice;
					if(this.DECREASE == dir)//递减
					{
						while(j >= 0 && tmpKey > this.goodsObjs.productlist[j].rebateprice)
						{
							this.goodsObjs.productlist[j + gap] = this.goodsObjs.productlist[j];
							j -= gap;
						}
					}
					else//递增
					{
						while(j >= 0 && tmpKey < this.goodsObjs.productlist[j].rebateprice)
						{
							this.goodsObjs.productlist[j + gap] = this.goodsObjs.productlist[j];
							j -= gap;
						}
					}
				}
				else if(this.SORT_DISACCOUNT == type)//折扣排序
				{
					tmpKey = tmpObj.discount;
					if(this.DECREASE == dir)//递减
					{
						while(j >= 0 && tmpKey > this.goodsObjs.productlist[j].discount)
						{
							this.goodsObjs.productlist[j + gap] = this.goodsObjs.productlist[j];
							j -= gap;
						}
					}
					else//递增
					{
						while(j >= 0 && tmpKey < this.goodsObjs.productlist[j].discount)
						{
							this.goodsObjs.productlist[j + gap] = this.goodsObjs.productlist[j];
							j -= gap;
						}
					}
				}
				else if(this.SORT_SELLCOUNT == type)//销量排序
				{
					tmpKey = tmpObj.ordernumber;
					if(this.DECREASE == dir)//递减
					{
						while(j >= 0 && tmpKey > parseInt(this.goodsObjs.productlist[j].ordernumber))
						{
							this.goodsObjs.productlist[j + gap] = this.goodsObjs.productlist[j];
							j -= gap;
						}
					}
					else//递增
					{
						while(j >= 0 && tmpKey < parseInt(this.goodsObjs.productlist[j].ordernumber))
						{
							this.goodsObjs.productlist[j + gap] = this.goodsObjs.productlist[j];
							j -= gap;
						}
					}
				}
				
				this.goodsObjs.productlist[j + gap] = tmpObj;
			}
			gap >>= 1;
		}
	};
	
	//改变图标 
	__Page.stateRecharge.changeSortIcon = function(item, icon)
	{
		item._setIcon(icon);
	};
	
	//不同方式不同形式的改变图标 
	__Page.stateRecharge.sortTypeChangIcon = function(type, state)
	{
		if(this.SORT_PRICE == type)
		{
			if(state == this.STATE_DOWN)
			{
				this.changeSortIcon(this.toolBarOneItem, "down_arrow2");
			}
			else if(state == this.STATE_UP)
			{
				this.changeSortIcon(this.toolBarOneItem, "up_arrow2");
			}
		}
		else if(this.SORT_DISACCOUNT == type)
		{
			if(state == this.STATE_DOWN)
			{
				this.changeSortIcon(this.toolBarTwoItem, "down_arrow2");
			}
			else if(state == this.STATE_UP)
			{
				this.changeSortIcon(this.toolBarTwoItem, "up_arrow2");
			}
		}
		else if(this.SORT_SELLCOUNT == type)
		{
			if(state == this.STATE_DOWN)
			{
				this.changeSortIcon(this.toolBarThreeItem, "down_arrow2");
			}
			else if(state == this.STATE_UP)
			{
				this.changeSortIcon(this.toolBarThreeItem, "up_arrow2");
			}
		}
	};
	
	//改变排序事件 
	__Page.stateRecharge.onChangeSortClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("====改变排序事件====");
			if(0 == btnMsg)//价格
			{	
				this.isSelectSortTwo = false;
				this.isSelectSortThree = false;
				if(this.toolBarOne == this.STATE_DOWN)
				{
					if(!this.isSelectSortOne)
					{
						this.toolBarOneItem._setIcon("down_arrow1");
						this.changeSortIcon(this.toolBarOneItem, "down_arrow1");
						this.isSelectSortOne = true;
						this.accordingPriceToSort(this.DECREASE);
					}
					else
					{
						this.changeSortIcon(this.toolBarOneItem, "up_arrow1");
						this.toolBarOne = this.STATE_UP;
						this.accordingPriceToSort(this.INCREASE);
					}
					
					this.sortTypeChangIcon(this.SORT_DISACCOUNT, this.toolBarTwo);
					this.sortTypeChangIcon(this.SORT_SELLCOUNT, this.toolBarThree);
				}
				else if(this.toolBarOne = this.STATE_UP)
				{
					if(!this.isSelectSortOne)
					{
						this.changeSortIcon(this.toolBarOneItem, "up_arrow1");
						this.isSelectSortOne = true;
						this.accordingPriceToSort(this.INCREASE);
					}
					else
					{
						this.changeSortIcon(this.toolBarOneItem, "down_arrow1");
						this.toolBarOne = this.STATE_DOWN;
						this.accordingPriceToSort(this.DECREASE);
					}
					
					this.sortTypeChangIcon(this.SORT_DISACCOUNT, this.toolBarTwo);
					this.sortTypeChangIcon(this.SORT_SELLCOUNT, this.toolBarThree);
				}
				
			}
			else if(1 == btnMsg)//折扣
			{	
				this.isSelectSortOne = false;
				this.isSelectSortThree = false;
				if(this.toolBarTwo == this.STATE_DOWN)
				{
					if(!this.isSelectSortTwo)
					{
						this.changeSortIcon(this.toolBarTwoItem, "down_arrow1");
						this.isSelectSortTwo = true;
						this.accordingDiscountToSort(this.DECREASE);
					}
					else
					{
						this.changeSortIcon(this.toolBarTwoItem, "up_arrow1");
						this.toolBarTwo = this.STATE_UP;
						this.accordingDiscountToSort(this.INCREASE);
					}
					
					this.sortTypeChangIcon(this.SORT_PRICE, this.toolBarOne);
					this.sortTypeChangIcon(this.SORT_SELLCOUNT, this.toolBarThree);
				}
				else if(this.toolBarTwo = this.STATE_UP)
				{
					if(!this.isSelectSortTwo)
					{
						this.changeSortIcon(this.toolBarTwoItem, "up_arrow1");
						this.isSelectSortTwo = true;
						this.accordingDiscountToSort(this.INCREASE);
					}
					else
					{
						this.changeSortIcon(this.toolBarTwoItem, "down_arrow1");
						this.toolBarTwo = this.STATE_DOWN;
						this.accordingDiscountToSort(this.DECREASE);
					}
		
					this.sortTypeChangIcon(this.SORT_PRICE, this.toolBarOne);
					this.sortTypeChangIcon(this.SORT_SELLCOUNT, this.toolBarThree);
				}
			}
			else if(2 == btnMsg)//销量
			{
				this.isSelectSortOne = false;
				this.isSelectSortTwo = false;
				if(this.toolBarThree == this.STATE_DOWN)
				{
					if(!this.isSelectSortThree)
					{
						this.changeSortIcon(this.toolBarThreeItem, "down_arrow1");
						this.isSelectSortThree = true;
						this.accordingSaleCountsToSort(this.DECREASE);
					}
					else
					{
						this.changeSortIcon(this.toolBarThreeItem, "up_arrow1");
						this.toolBarThree = this.STATE_UP;
						this.accordingSaleCountsToSort(this.INCREASE);
					}
		
					this.sortTypeChangIcon(this.SORT_PRICE, this.toolBarOne);
					this.sortTypeChangIcon(this.SORT_DISACCOUNT, this.toolBarTwo);
				}
				else if(this.toolBarThree = this.STATE_UP)
				{
					if(!this.isSelectSortThree)
					{
						this.changeSortIcon(this.toolBarThreeItem, "up_arrow1");
						this.isSelectSortThree = true;
						this.accordingSaleCountsToSort(this.INCREASE);
					}
					else
					{
						this.changeSortIcon(this.toolBarThreeItem, "down_arrow1");
						this.toolBarThree = this.STATE_DOWN;
						this.accordingSaleCountsToSort(this.DECREASE);
					}
					
					this.sortTypeChangIcon(this.SORT_PRICE, this.toolBarOne);
					this.sortTypeChangIcon(this.SORT_DISACCOUNT, this.toolBarTwo);
				}
			}
		}
	};
	
	//清除该界面所有的对象数组
	__Page.stateRecharge.clearListObj = function()
	{
		var len = this.goodsObjs.productlist.length;
		this.goodsObjs.productlist.splice(0, len);
		this.goodsObjs.hasnext = false;
		this.clearFilterListObj();
	};
	
	//返回到商品主页
	__Page.stateRecharge.backGoodsMainPage = function()
	{
		var page = this.page;
		var stateMain = page.stateMain;
		
		this.curPage = 0;
		stateMain.showBottomRect();
		this.stateRechargeGoodsItem.setDisplay(1);
		this.stateRechargeMethodItem.setDisplay(1);
		this.clearFilterListObj();
		this.stateRechargeLayer.removeChild(this.stateFilterItem);
		this.loadRechargeGoodsData();
	};
	
	//返回事件 
	__Page.stateRecharge.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
			if(this.curPage == this.PAGE_FILTER)
			{
				this.backGoodsMainPage();
				return;
			}
			
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			this.appEnv.switchState(page.stateHome, 1, null);
		}
	};
	
	//取消搜索事件 
	__Page.stateRecharge.onCancelClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
			this.backGoodsMainPage();
		}
	};
	
	//关闭输入框
	__Page.stateRecharge.closeEditHud = function()
	{
		this.editItem.OnCloseEdit();
	};
}