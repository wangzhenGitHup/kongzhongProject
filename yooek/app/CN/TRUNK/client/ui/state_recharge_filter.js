{
	//==============筛选部分====================
	//打开筛选事件 
	__Page.stateRecharge.onOpenChoiceClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====打开筛选事件=====");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			
			stateMain.hideBottomRect();
			this.curPage = this.PAGE_FILTER;
			this.stateRechargeGoodsItem.setDisplay(0);
			this.stateRechargeMethodItem.setDisplay(0);
			
			this.stateFilterItem = this.stateRechargeLayer.appendNewChild(this.loadFilterCSS(appEnv.scrSize[0],
				appEnv.scrSize[1], this.type));
			
			var item = this.stateFilterItem.findItemById("loadFilterItem");
			this.scrollBoxFilterItem = item.findItemById("scrollBox");
			
			this.initFilterPage();
		}
	};
	
	//初始化筛选界面 
	__Page.stateRecharge.initFilterPage = function()
	{
		if(10 == this.type)
		{
			this.labelType = 0;
			this.leftBarItem = this.stateFilterItem.findItemById("leftBar");
			this.rightBarItem = this.stateFilterItem.findItemById("rightBar");
			this.getBusinessData();
		}
		else
		{
			this.labelType = 1;
			this.getGoodsPriceInformation();
		}
	};
	
	//获取商品价格信息
	__Page.stateRecharge.getGoodsPriceInformation = function()
	{
		var appEnv = this.appEnv;
		var gamesysno = appEnv.gameSysno;
		var pageno = this.price_pageno;
		var pagesize = 15;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.product.searchpricelist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"pagesize", "value":"" + pagesize},
						{"key":"pageno", "value":"" + pageno},
						{"key":"gamesysno", "value":"" + gamesysno}
					];
					
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		this.txtLoadingPrice = appEnv.showLoadingPage(this.stateRechargeLayer, this.stateFilterItem);
		appEnv.getFromServerData(this, this.getGoodsPriceInformationCallBack, paramObjs, cipherText);
	};
	
	//获取商品价格的回调函数
	__Page.stateRecharge.getGoodsPriceInformationCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPage(this.stateRechargeLayer, this.txtLoadingPrice, this.stateFilterItem);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.getGoodsPriceInformation();
			}, this);
			return;
		}
		if(!vo || !vo.pricelist)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtNetTip1);
				this.getGoodsPriceInformation();
			}, this);
			return;
		}
		if(vo.Errors.length)
		{
			setTimeout(5, function(){
				appEnv.showNetErrorMessage(vo.Errors);
				this.getGoodsPriceInformation();
			}, this);
			return;
		}
		if(!vo.pricelist.length)
		{
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtNoHaveBackDataTip);}, this);
			return;
		}
		
		//this.goodsPriceObjs.pricelist.splice(0, this.goodsPriceObjs.pricelist.length);
		
		if(vo.hasnext && this.isRefreshFlag)
		{
			this.price_pageno++;
			this.isRefreshFlag  = false;
		}
		var len = vo.pricelist.length;
		
		this.goodsPriceObjs.pricelist.push(appEnv.textLib.txtAllTip);
		for(var i = 0; i < len; i++)
		{
			this.goodsPriceObjs.pricelist.push(vo.pricelist[i]);
		}
		this.goodsPriceObjs.hasnext = vo.hasnext;
		this.curPage = this.PAGE_FILTER;
		this.initFirstRechargeData();
	};
	
	//初始化首充金额数据
	__Page.stateRecharge.initFirstRechargeData = function()
	{
		var appEnv = this.appEnv;
		var sw = appEnv.scrSize[0];
		var page = this.page;
		var cssLib = page.cssLib;
		var textLib = appEnv.textLib;
		var len = this.goodsPriceObjs.pricelist.length;
		var css = [];
		if(len == 0)
		{
			return;
		}

		for(var i = 0; i < len; i++)
		{
			if(i == 0)
			{
				css[i] = this.loadDataCSS(this.goodsPriceObjs.pricelist[i], i);
				continue;
			}
			css[i] = this.loadDataCSS(this.goodsPriceObjs.pricelist[i].price + textLib.txtYuanTip, i);
		}
		this.scrollBoxFilterItem.insertItems(css);

		this.scrollBoxSubItem.splice(0, this.scrollBoxSubItem.length);
		for(var i = 0; i < len; i++)
		{
			this.scrollBoxSubItem[i] = this.scrollBoxFilterItem.findItemById("selectFlag" + i);
		}

		if(!this.goodsPriceObjs.hasnext)
		{
			return;
		}
		this.scrollBoxFilterItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0]));
		this.scrollBoxFilterItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.scrollBoxFilterItem.findItemById("loadRefreshItem").findItemById("tip");
		this.scrollBoxFilterItem.setTrigger(80, 1);
		this.scrollBoxFilterItem.setTrigger(30, 2);
	};

	//获取运营商数据信息
	__Page.stateRecharge.getBusinessData = function()
	{
		var appEnv = this.appEnv;
		var pageno = this.business_pageno;
		var pagesize = 10;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var gamesysno = appEnv.gameSysno;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.searchagentlist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"1"}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"gamesysno", "value":"" + gamesysno}
						//{"key":"pagesize", "value":"" + pagesize},
						//{"key":"pageno", "value":"" + pageno}
					];
					
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		this.txtLoadingBusiness = appEnv.showLoadingPage(this.stateRechargeLayer, this.stateFilterItem);
		appEnv.getFromServerData(this, this.getBusinessDataCallBack, paramObjs, cipherText);
	};
	
	//获取运营商数据的回调函数
	__Page.stateRecharge.getBusinessDataCallBack = function(vo, isSuccess)
	{
		//agentlist[]:运营商列表
		//hasnext:是否存在下一页(是否存在下一页；true为存在下一页)
		
		/*
			agentsyno:运营商主键
			agentname:运营商名字
			priority:等级，数值越高级别越大
		*/
		var appEnv = this.appEnv;
		appEnv.hideLoadingPage(this.stateRechargeLayer, this.txtLoadingBusiness, this.stateFilterItem);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.getBusinessData();
			}, this);
			return;
		}
		if(!vo || !vo.agentlist)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtNetTip1);
				this.getBusinessData();
			}, this);
			return;
		}
		if(vo.Errors.length)
		{
			setTimeout(5, function(){
				appEnv.showNetErrorMessage(vo.Errors);
				this.getBusinessData();
			}, this);
			return;
		}
		if(!vo.agentlist.length)
		{
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtNoHaveBackDataTip);}, this);
			return;
		}
		
		if(vo.hasnext && this.isRefreshFlag)
		{
			this.business_pageno++;
			this.isRefreshFlag = false;
		}
		
		//this.goodsBusinessObjs.agentlist.splice(0, this.goodsBusinessObjs.agentlist.length);
		this.goodsBusinessObjs.agentlist.push(appEnv.textLib.txtAllTip);
		var len = vo.agentlist.length;
		for(var i = 0; i < len; i++)
		{
			this.goodsBusinessObjs.agentlist.push(vo.agentlist[i]);
		}
		this.goodsBusinessObjs.hasnext = vo.hasnext;
		this.curPage = this.PAGE_FILTER;
		this.initBusinessData();
	};
	
	//初始化运营商的数据
	__Page.stateRecharge.initBusinessData = function()
	{
		var appEnv = this.appEnv;
		var sw = appEnv.scrSize[0];
		var page = this.page;
		var cssLib = page.cssLib;

		var len = this.goodsBusinessObjs.agentlist.length;
		var css = [];
		if(len == 0)
		{
			return;
		}
		for(var i = 0; i < len; i++)
		{
			if(i == 0)
			{
				css[i] = this.loadDataCSS(this.goodsBusinessObjs.agentlist[i], i);
				continue;
			}
			css[i] = this.loadDataCSS(this.goodsBusinessObjs.agentlist[i].agentname, i);
		}
		this.scrollBoxFilterItem.insertItems(css);

		this.scrollBoxSubItem.splice(0, this.scrollBoxSubItem.length);
		for(var i = 0; i < len; i++)
		{
			this.scrollBoxSubItem[i] = this.scrollBoxFilterItem.findItemById("selectFlag" + i);
		}
		
		if(!this.goodsBusinessObjs.hasnext)
		{
			return;
		}
		this.scrollBoxFilterItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0]));
		this.scrollBoxFilterItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.scrollBoxFilterItem.findItemById("loadRefreshItem").findItemById("tip");
		this.scrollBoxFilterItem.setTrigger(80, 1);
		this.scrollBoxFilterItem.setTrigger(30, 2);
	};
	
	//清除筛选所用到的变量和数组
	__Page.stateRecharge.clearFilterListObj = function()
	{
		this.btnLeftState = true;
		this.btnRightState = false;
		this.price_pageno = 1;
		this.business_pageno = 1;
		this.labelType = 0;  
		this.selectPrice = -1;
		this.selectBusiness = null;
		
		this.clearArrayList();
	};
	
	//确定筛选的具体内容 
	__Page.stateRecharge.onConfirmFilterClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====确定筛选的具体内容=====: " + btnMsg);
			if(0 == this.labelType)//运营商
			{
				var len = this.goodsBusinessObjs.agentlist.length;
				for(var i = 0; i < len; i++)
				{
					if(btnMsg == i)
					{
						this.scrollBoxSubItem[i].setDisplay(1);
					}
					else
					{
						this.scrollBoxSubItem[i].setDisplay(0);
					}
				}
				if(0 == btnMsg)
				{
					this.selectBusiness = this.goodsBusinessObjs.agentlist[btnMsg];
				}
				else
				{
					this.selectBusiness = this.goodsBusinessObjs.agentlist[btnMsg].agentname;
				}
			}
			else//价格
			{
				var len = this.goodsPriceObjs.pricelist.length;
				for(var i = 0; i < len; i++)
				{
					if(btnMsg == i)
					{
						this.scrollBoxSubItem[i].setDisplay(1);
					}
					else
					{
						this.scrollBoxSubItem[i].setDisplay(0);
					}
				}
				if(0 == btnMsg)
				{
					this.selectPrice = this.goodsPriceObjs.pricelist[btnMsg];
				}
				else
				{
					this.selectPrice = this.goodsPriceObjs.pricelist[btnMsg].price;
				}
			}
		}
	};
	
	//取消筛选 
	__Page.stateRecharge.onCancelClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====取消筛选=====");
			this.backGoodsMainPage();
		}
	};
	
	__Page.stateRecharge.clearArrayList = function()
	{
		this.goodsPriceObjs.pricelist.splice(0, this.goodsPriceObjs.pricelist.length);
		this.goodsPriceObjs.hasnext = false;
		
		this.goodsBusinessObjs.agentlist.splice(0, this.goodsBusinessObjs.agentlist.length);
		this.goodsBusinessObjs.hasnext = false;

		this.scrollBoxSubItem.splice(0, this.scrollBoxSubItem.length);
	};
	
	//打开不同类型的标签 
	__Page.stateRecharge.onOpenLabelTypeClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("======打开不同类型的标签======");
			//btnMsg = 0:运营商
			//btnMsg = 1:首充金额
			var page = this.page;
			var cssLib = page.cssLib;
			
			this.clearArrayList();
		
			if(0 == btnMsg && !this.btnLeftState)
			{
				var leftIcon = "left_select_bar";
				var rightIcon = "right_unselect_bar";
				this.btnLeftState = true;
				this.btnRightState = false;
				this.leftBarItem._setIcon(leftIcon);
				this.leftBarItem._setTextColor([1, 1, 1, 1]);
				this.rightBarItem._setIcon(rightIcon);
				this.rightBarItem._setTextColor([0, 0.71, 1, 1]);
				this.scrollBoxFilterItem.clearItems();
				this.getBusinessData();
				this.labelType = 0;
			}
			else if(1 == btnMsg && !this.btnRightState)
			{
				var leftIcon = "left_unselect_bar";
				var rightIcon = "right_select_bar";
				this.btnLeftState = false;
				this.btnRightState = true;
				this.rightBarItem._setIcon(rightIcon);
				this.rightBarItem._setTextColor([1, 1, 1, 1]);
				this.leftBarItem._setIcon(leftIcon);
				this.leftBarItem._setTextColor([0, 0.71, 1, 1]);
				this.scrollBoxFilterItem.clearItems();
				this.getGoodsPriceInformation();
				this.labelType = 1;
			}	
		}
	};
	
	//完成筛选事件 
	__Page.stateRecharge.onFinishClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("===完成筛选事件====");
			var appEnv = this.appEnv;
			if(0 == this.labelType)
			{
				if(this.selectBusiness.length == 0 || !this.selectBusiness)
				{
					return;
				}
				if(this.selectBusiness == this.appEnv.textLib.txtAllTip)
				{
					this.backGoodsMainPage();
					return;
				}
				var len = this.goodsObjs.productlist.length;
				var tmpList = [];

				for(var i = 0; i < len; i++)
				{
					if(this.goodsObjs.productlist[i].agentstr == this.selectBusiness)
					{
						tmpList.push(this.goodsObjs.productlist[i]);
					}
				}
				len = tmpList.length;
				if(len > 0)
				{
					this.goodsObjs.productlist.splice(0, this.goodsObjs.productlist.length);
					for(var j = 0; j < len; j++)
					{
						this.goodsObjs.productlist.push(tmpList[j]);
					}
				}
				else
				{
					Dialogs.alert(appEnv.textLib.txtNoHaveSearchTip);
					return;
				}
			}
			else
			{
				if(this.selectPrice == this.appEnv.textLib.txtAllTip)
				{
					this.backGoodsMainPage();
					return;
				}
				var len = this.goodsObjs.productlist.length;
				var tmpList = [];
				for(var i = 0; i < len; i++)
				{
					if(this.goodsObjs.productlist[i].rebateprice == this.selectPrice)
					{
						tmpList.push(this.goodsObjs.productlist[i]);
					}
				}
				len = tmpList.length;
				if(len > 0)
				{
					this.goodsObjs.productlist.splice(0, this.goodsObjs.productlist.length);
					for(var j = 0; j < len; j++)
					{
						this.goodsObjs.productlist.push(tmpList[j]);
					}
				}
				else
				{
					Dialogs.alert(appEnv.textLib.txtNoHaveSearchTip);
					return;
				}
			}
			this.backGoodsMainPage();
		}
	};
	
	//开始刷新筛选的数据
	__Page.stateRecharge.startRefreshFilterData = function()
	{
		if(this.labelType == 0)
		{
			if(this.goodsBusinessObjs.hasnext)
			{
				this.isRefreshFlag = true;
				this.getBusinessData();
			}
			else
			{
				this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
			}
		}
		else
		{
			if(this.goodsPriceObjs.hasnext)
			{
				this.isRefreshFlag = true;
				this.getGoodsPriceInformation();
			}
			else
			{
				this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
			}
		}
	};
}