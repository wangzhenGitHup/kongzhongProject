{
	//===============================================订单部分=====================================================================
	//用于从主页左上角直接点击进入到订单部分
	__Page.stateMy.onEnterMyOrderPage = function()
	{
		this.onMyOrderClk(1, 1);
	};
	
	//我的订单 
	__Page.stateMy.onMyOrderClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====我的订单======");
			var page = this.page;
			var appEnv = this.appEnv;
			if(!appEnv.isLogin)
			{
				this.appEnv.switchState(this.page.stateUserLogin, 1, null);
				return;
			}
			var stateMain = page.stateMain;
			stateMain.showBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_MY_ORDER;
			var areaH = 121 + (appEnv.scaleFactorY - 1) * 15;
			this.stateMyOrderItem = this.stateMyLayer.appendNewChild(this.page.loadOrderManagerCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1] - areaH));
				
			var allOrderKey = this.stateMyOrderItem.findItemById("orderKey1");
			this.allOrderTip = allOrderKey.firstChild().getNextItem();
			
			var payOrderKey = this.stateMyOrderItem.findItemById("orderKey2");
			this.payOrderTip = payOrderKey.firstChild().getNextItem();
			
			var waitRecevierKey = this.stateMyOrderItem.findItemById("orderKey3");
			this.waitRecevierTip = waitRecevierKey.firstChild().getNextItem();
			
			var alreadyReceiveKey = this.stateMyOrderItem.findItemById("orderKey4");
			this.alreadyReceiveTip = alreadyReceiveKey.firstChild().getNextItem();
			
			var failOrderKey = this.stateMyOrderItem.findItemById("orderKey5");
			this.failOrderTip = failOrderKey.firstChild().getNextItem();
			
			var waitSendGoodsKey = this.stateMyOrderItem.findItemById("orderKey6");
			this.waitSendGoodsTip = waitSendGoodsKey.firstChild().getNextItem();
			
			this.getAllKindsOrderCount();
		}
	};
	
	//交互获取各个订单数目
	__Page.stateMy.getAllKindsOrderCount = function()
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var customersysno = appEnv.userInfoObj.customersysno;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.order.countorder"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID},  
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno}
					];
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);

		appEnv.getFromServerData(this, this.getAllKindsOrderCountCallBack, paramObjs, cipherText);
		appEnv.showLoadingPageSecond(this.stateMyLayer);
	};
	
	//获取各个订单数的回调函数
	__Page.stateMy.getAllKindsOrderCountCallBack = function(vo, isSuccess)
	{
		/*
			allordercount:订单总数
			payordercount:等待付款
			alreadyreceivecount:已经收货
			failordercount:交易失败
			waitreceivercount:等待收货
		*/
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateMyLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getAllKindsOrderCount();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getAllKindsOrderCount();
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getAllKindsOrderCount();
			return;
		}
		
		//设置显示各个订单数
		this.allordercount = vo.allordercount;
		this.payordercount = vo.payordercount;
		this.failordercount = vo.failordercount;
		this.alreadyreceivecount = vo.alreadyreceivecount;
		this.waitreceivercount = vo.waitreceivercount;
		this.waitoutstockquantity = vo.waitoutstockquantity;
		
		this.allOrderTip._setText("(" + this.allordercount + ")");
		this.payOrderTip._setText("(" + this.payordercount + ")");
		this.alreadyReceiveTip._setText("(" + this.alreadyreceivecount + ")");
		this.failOrderTip._setText("(" + this.failordercount + ")");
		this.waitRecevierTip._setText("(" + this.waitreceivercount + ")");
		this.waitSendGoodsTip._setText("(" + this.waitoutstockquantity + ")");
	};
	
	//获取所有订单具体数据
	__Page.stateMy.getAllOrderDetailData = function(stateValue)
	{
		this.getOrderDataState = stateValue;
		/*
			customersysno:用户主键
			(orderstatus):订单状态：买家终止 = -11,系统取消 = -4, 卖家取消 = -3,客服取消 = -2, 用户取消 = -1, 已创建 = 0, 待发货 = 4, 处理中 = 8,已完成 = 100
			(paystatus):支付状态：未支付 = 0,部分支付 = 1, 已支付 = 2, 超额支付 = 3
			(sellcustomersysno):卖家用户主键
			(ordersysno):订单号
			pageno:页码(取值范围:大于零的整数;)
			pagesize:取值范围:大于零的整;最大值:100（建议使用10~20，可以提高成功率，减少超时数量）
		*/
		if(stateValue == 101)
		{
			stateValue = "-11,-4,-3,-2,-1";
		}
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var customersysno = appEnv.userInfoObj.customersysno;
		var pageno = this.allorder_pageno;
		var pagesize = 15;
		var buyerdelete = 0;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		
		if(this.isDeleteOrderEvent)
		{
			buyerdelete = 1;
		}
		var paramObjs = [{"key":"method", "value":"yooek.order.getorderList"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno}, 
						{"key":"pageno", "value":"" + pageno}, 
						{"key":"pagesize", "value":"" + pagesize},
						{"key":"orderstatus", "value":"" + stateValue},
						{"key":"buyerdelete", "value":"" + buyerdelete},
					];
		
	
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.getAllOrderDetailDataCallBack, paramObjs, cipherText);
	};
	
	//获取所有订单具体数据的回调函数 
	__Page.stateMy.getAllOrderDetailDataCallBack = function(vo, isSuccess)
	{
		//orderlist[]:订单信息列表
		//hasnext:是否存在下一页(是否存在下一页；true为存在下一页)
		/*
			ordersysno:订单号
			ordersource:订单来源  1=网站  2=手机
			sellersysno:卖家Sysno
			buyersysno:买家Sysno
			tradetype:交易类型   1=寄售 2=担保
			ordertype:订单类型  1=虚拟 2=实物
			sellertype:卖家类型  1=C2C  2=B2C 3 游易客自营 默认C2C
			originalamount:订单初始金额 = 订单金额 + 折扣金额
			amount:订单金额
			feeamount:手续费
			seviceamount:服务费
			customernote:用户留言
			description:状态描述
			productsysno:商品主键
			productid:商品ID
			productname:商品名
			price:商品原价
			categorysysno		商品类型sysno
			categoryname		商品类型
			sellname:卖家名
			discount:折扣
			rebateprice:优惠价
			selllevelImageurl:卖家等级图片地址???数值就可以了
			gameimageurl	Y	游戏图标
			agentstr:运营商
			zonestr:大区
			serverstr:服务器
			qq:联系客服QQ
			quantity:数量
			gameaccount:游戏帐号
			gamepwd:游戏密码
			mobileaccount:手游帐号
			mobilepwd:手游密码
			iffirstaccount	N	是否首充号 1是 0 否 
			faileddescription	N	失败原因
			gamesysno	Y	游戏主键
			gamename	Y	游戏名字
		*/
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getAllOrderDetailData(this.getOrderDataState);
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getAllOrderDetailData(this.getOrderDataState);
			return;
		}
		if(!vo || !vo.orderList)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getAllOrderDetailData(this.getOrderDataState);
			return;
		}
		
		if(vo.hasnext && this.isRefreshFlag)
		{
			this.allorder_pageno++;
			this.isRefreshFlag = false;
		}
		//复制订单数据前先清空下
		this.clearOrderListObjs();
		this.orderListObjs.hasnext = vo.hasnext;
		
		var len = vo.orderList.length;
		for(var i = 0; i < len; i++)
		{
			this.orderListObjs.orderlist.push(vo.orderList[i]);
		}
		
		if(this.getOrderDataState == 0)//待付款的订单
		{
			this.initWaitPayForOrderData();
		}
		else if(this.getOrderDataState == 4) //待发货
		{
			this.initWaitSendOrderData();
		}
		else if(this.getOrderDataState == 16)//待收货的订单
		{
			this.initWaitTakeOverOrderData();
		}
		else if(this.getOrderDataState == 101)//交易失败的状态不清楚
		{
			this.initTradeFailedOrderData();
		}
		else if(this.getOrderDataState == 100)//交易成功
		{
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showBottomRect();
			this.stateAllOrderItem.setDisplay(1);
			this.initTradeSuccessOrderData();
			this.initAllOrderData();
			this.loadAllOrderData();
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingOrder, this.stateAllOrderItem);
			this.isDeleteOrderEvent = false;
		}
	};
	
	//获取每种类型的订单数据
	__Page.stateMy.getKindsOfOrderDetailData = function(stateValue)
	{
		this.getOrderDataState = stateValue;
		/*
			customersysno:用户主键
			(orderstatus):订单状态：买家终止 = -11,系统取消 = -4, 卖家取消 = -3,客服取消 = -2, 用户取消 = -1, 已创建 = 0, 待发货 = 4, 处理中 = 8,已完成 = 100
			(paystatus):支付状态：未支付 = 0,部分支付 = 1, 已支付 = 2, 超额支付 = 3
			(sellcustomersysno):卖家用户主键
			(ordersysno):订单号
			pageno:页码(取值范围:大于零的整数;)
			pagesize:取值范围:大于零的整;最大值:100（建议使用10~20，可以提高成功率，减少超时数量）
		*/
		if(stateValue == 101)
		{
			stateValue = "-11,-4,-3,-2,-1";
		}
		
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var customersysno = appEnv.userInfoObj.customersysno;
		var pageno = this.order_pageno;
		var pagesize = 10;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var item;
		var buyerdelete = 0;
		if(this.isDeleteOrderEvent)
		{
			buyerdelete = 1;
		}
		
		var paramObjs = [{"key":"method", "value":"yooek.order.getorderList"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno}, 
						{"key":"pageno", "value":"" + pageno}, 
						{"key":"pagesize", "value":"" + pagesize},
						{"key":"orderstatus", "value":"" + stateValue},
						{"key":"buyerdelete", "value":"" + buyerdelete},
					];
		
	
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideBottomRect();
		stateMain.hideTopRect();
		
		if(this.getOrderDataState == 0)//待付款的订单
		{
			item = this.stateWaitPayOrderItem;
		}
		else if(this.getOrderDataState == 4)//待发货
		{
			item = this.stateWaitSendOrderItem;
		}
		else if(this.getOrderDataState == 16)//待收货的订单
		{
			item = this.stateWaitTakeOverOrderItem;
		}
		else if(this.getOrderDataState == 101)//交易失败的状态不清楚
		{
			item = this.stateTradeFailedOrderItem;
		}
		else if(this.getOrderDataState == 100)//交易成功
		{
			item = this.stateSuccessOrderItem;
		}
		
		this.txtLoadingOrder = appEnv.showLoadingPage(this.stateMyLayer, item);
		appEnv.getFromServerData(this, this.getKindsOfOrderDetailDataCallBack, paramObjs, cipherText);
	};
	
	//获取每种订单具体数据的回调函数 
	__Page.stateMy.getKindsOfOrderDetailDataCallBack = function(vo, isSuccess)
	{
		//orderlist[]:订单信息列表
		//hasnext:是否存在下一页(是否存在下一页；true为存在下一页)
		/*
			ordersysno:订单号
			ordersource:订单来源  1=网站  2=手机
			sellersysno:卖家Sysno
			buyersysno:买家Sysno
			tradetype:交易类型   1=寄售 2=担保
			ordertype:订单类型  1=虚拟 2=实物
			sellertype:卖家类型  1=C2C  2=B2C 3 游易客自营 默认C2C
			originalamount:订单初始金额 = 订单金额 + 折扣金额
			amount:订单金额
			feeamount:手续费
			seviceamount:服务费
			customernote:用户留言
			description:状态描述
			productsysno:商品主键
			productid:商品ID
			productname:商品名
			price:商品原价
			categorysysno		商品类型sysno
			categoryname		商品类型
			sellname:卖家名
			discount:折扣
			rebateprice:优惠价
			selllevelImageurl:卖家等级图片地址???数值就可以了
			gameimageurl	Y	游戏图标
			agentstr:运营商
			zonestr:大区
			serverstr:服务器
			qq:联系客服QQ
			quantity:数量
			gameaccount:游戏帐号
			gamepwd:游戏密码
			mobileaccount:手游帐号
			mobilepwd:手游密码
			iffirstaccount	N	是否首充号 1是 0 否 
			faileddescription	N	失败原因
			gamesysno	Y	游戏主键
			gamename	Y	游戏名字
		*/
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getKindsOfOrderDetailData(this.getOrderDataState);
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getKindsOfOrderDetailData(this.getOrderDataState);
			return;
		}
		if(!vo || !vo.orderList)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getKindsOfOrderDetailData(this.getOrderDataState);
			return;
		}
		
		if(vo.hasnext && this.isRefreshFlag)
		{
			this.order_pageno++;
			this.isRefreshFlag = false;
		}
		//复制订单数据前先清空下
		this.clearOrderListObjs();
		this.orderListObjs.hasnext = vo.hasnext;

		var len = vo.orderList.length;
		for(var i = 0; i < len; i++)
		{
			this.orderListObjs.orderlist.push(vo.orderList[i]);
		}
		
		if(this.getOrderDataState == 0)//待付款的订单
		{
			this.initWaitPayForOrderData();
			this.loadWaitPayForOrderData();
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingOrder, this.stateWaitPayOrderItem);
		}
		else if(this.getOrderDataState == 4)//待发货
		{
			this.initWaitSendOrderData();
			this.loadWaitSendOrderData();
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingOrder, this.stateWaitSendOrderItem);
		}
		else if(this.getOrderDataState == 16)//待收货的订单
		{
			this.initWaitTakeOverOrderData();
			this.loadWaitTakeOverOrderData();
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingOrder, this.stateWaitTakeOverOrderItem);
		}
		else if(this.getOrderDataState == 101)//交易失败的状态不清楚
		{
			this.initTradeFailedOrderData();
			this.loadTradeFailedOrderData();
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingOrder, this.stateTradeFailedOrderItem);
		}
		else if(this.getOrderDataState == 100)//交易成功
		{
			this.initTradeSuccessOrderData();
			this.loadTradeSuccessOrderData();
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingOrder, this.stateSuccessOrderItem);
		}
		
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showBottomRect();
		this.isDeleteOrderEvent = false;
	};
	
	//清空订单对象数组
	__Page.stateMy.clearOrderListObjs = function()
	{
		var len = this.orderListObjs.orderlist.length;
		this.orderListObjs.hasnext = false;
		this.orderListObjs.orderlist.splice(0, len);
	};
	
	//相应订单事件
	__Page.stateMy.onOrderTypeClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("===相应订单事件===: " + btnMsg);
			var appEnv = this.appEnv;
			var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
			var bottomH = 120 + (appEnv.scaleFactorY - 1) * 15;
			if(1 == btnMsg)//全部订单 
			{
				if(0 == this.allordercount)
				{
					return;
				}
				
				this.curSubPage = this.PAGE_ALL_ORDER;
				//this.stateMyOrderItem.setDisplay(0);
				this.stateMyLayer.removeChild(this.stateMyOrderItem);
				this.stateMyOrderItem = null;
				
				if(!this.stateAllOrderItem)
				{
					this.stateAllOrderItem = this.stateMyLayer.appendNewChild(this.page.loadAllOrderCSS(this, appEnv.scrSize[0],
						appEnv.scrSize[1] - topH - bottomH));
					this.allOrderScrollBoxItem = this.stateAllOrderItem.findItemById("scrollBox");
				}
				
				var page = this.page;
				var stateMain = page.stateMain;
				stateMain.hideBottomRect();
				stateMain.hideTopRect();
				
				this.allorder_pageno = 1;
				this.txtLoadingOrder = appEnv.showLoadingPage(this.stateMyLayer, this.stateAllOrderItem);
				this.getAllOrderDetailData(0);
			}
			else if(2 == btnMsg)//待付款 
			{
				if(0 == this.payordercount)
				{
					return;
				}
				var appEnv = this.appEnv;
				this.curSubPage = this.PAGE_WAIT_PAY_ORDER;
				//this.stateMyOrderItem.setDisplay(0);
				this.stateMyLayer.removeChild(this.stateMyOrderItem);
				this.stateMyOrderItem = null;
				if(!this.stateWaitPayOrderItem)
				{
					this.stateWaitPayOrderItem = this.stateMyLayer.appendNewChild(this.page.loadWaitPayOrderCSS(this,
						appEnv.scrSize[0], appEnv.scrSize[1] - topH - bottomH));
					this.waitPayOrderScrollBoxItem = this.stateWaitPayOrderItem.findItemById("scrollBox");
				}
				this.stateWaitPayOrderItem.setDisplay(0);
				this.order_pageno = 1;
				this.getKindsOfOrderDetailData(0);
			}
			else if(3 == btnMsg)//待收货 
			{
				if(0 == this.waitreceivercount)
				{
					return;
				}
				var appEnv = this.appEnv;
				this.curSubPage = this.PAGE_WAIT_TAKEOVER_ORDER;
				//this.stateMyOrderItem.setDisplay(0);
				this.stateMyLayer.removeChild(this.stateMyOrderItem);
				this.stateMyOrderItem = null;
				if(!this.stateWaitTakeOverOrderItem)
				{
					this.stateWaitTakeOverOrderItem = this.stateMyLayer.appendNewChild(this.page.loadWaitTakeOverOrderCSS(this,
						appEnv.scrSize[0], appEnv.scrSize[1] - topH - bottomH));
					this.waitTakeOverOrderScrollBoxItem = this.stateWaitTakeOverOrderItem.findItemById("scrollBox");
				}
				this.stateWaitTakeOverOrderItem.setDisplay(0);
				this.order_pageno = 1;
				this.getKindsOfOrderDetailData(16);
			}
			else if(4 == btnMsg)//已收货 
			{
				if(0 == this.alreadyreceivecount)
				{
					return;
				}
				var appEnv = this.appEnv;
				this.curSubPage = this.PAGE_ALREADY_TAKEOVER_ORDER;
				//this.stateMyOrderItem.setDisplay(0);
				this.stateMyLayer.removeChild(this.stateMyOrderItem);
				this.stateMyOrderItem = null;
				if(!this.stateSuccessOrderItem)
				{
					this.stateSuccessOrderItem = this.stateMyLayer.appendNewChild(this.page.loadAlreadyTakeOverCSS(this,
						appEnv.scrSize[0], appEnv.scrSize[1] - topH - bottomH));
					this.alreadyTakeOverScrollBoxItem = this.stateSuccessOrderItem.findItemById("scrollBox");
				}
				this.stateSuccessOrderItem.setDisplay(0);
				this.order_pageno = 1;
				this.getKindsOfOrderDetailData(100);
			}
			else if(5 == btnMsg)//交易失败 
			{
				if(0 == this.failordercount)
				{
					return;
				}
				var appEnv = this.appEnv;
				this.curSubPage = this.PAGE_TRADE_FAILED_ORDER;
				//this.stateMyOrderItem.setDisplay(0);
				this.stateMyLayer.removeChild(this.stateMyOrderItem);
				this.stateMyOrderItem = null;
				if(!this.stateTradeFailedOrderItem)
				{
					this.stateTradeFailedOrderItem = this.stateMyLayer.appendNewChild(this.page.loadTradeFailedOrderCSS(this,
						appEnv.scrSize[0], appEnv.scrSize[1] - topH - bottomH));
					this.tradeFailedOrderScrollBoxItem = this.stateTradeFailedOrderItem.findItemById("scrollBox");
				}
				this.stateTradeFailedOrderItem.setDisplay(0);
				this.order_pageno = 1;
				this.getKindsOfOrderDetailData(101);
			}
			else if(6 == btnMsg)//待发货
			{
				if(0 == this.waitoutstockquantity)
				{
					return;
				}
				var appEnv = this.appEnv;
				this.curSubPage = this.PAGE_WAIT_SEND_ORDER;
				this.stateMyLayer.removeChild(this.stateMyOrderItem);
				this.stateMyOrderItem = null;
				if(!this.stateWaitSendOrderItem)
				{
					this.stateWaitSendOrderItem = this.stateMyLayer.appendNewChild(this.page.loadWaitSendOrderCSS(this,
						appEnv.scrSize[0], appEnv.scrSize[1] - topH - bottomH));
					this.waitSendOrderScrollBoxItem = this.stateWaitSendOrderItem.findItemById("scrollBox");
				}
				this.stateWaitSendOrderItem.setDisplay(0);
				this.order_pageno = 1;
				this.getKindsOfOrderDetailData(4);
			}
		}
	};
	
	//初始化全部订单数据
	__Page.stateMy.initAllOrderData = function()
	{
		var len1 = this.waitPayForOrderObjs.length;
		var len2 = this.waitTakeOverOrderObjs.length;
		var len3 = this.tradeFailedOrderObjs.length;
		var len4 = this.tradeSuccessOrderObjs.length;
		var len5 = this.waitSendOrderObjs.length;
		
		for(var i = 0; i < len1; i++)
		{
			this.allOrderObjs.push(this.waitPayForOrderObjs[i]);
		}
		
		for(var i = 0; i < len2; i++)
		{
			this.allOrderObjs.push(this.waitTakeOverOrderObjs[i]);
		}
		
		for(var i = 0; i < len3; i++)
		{
			this.allOrderObjs.push(this.tradeFailedOrderObjs[i]);
		}
		
		for(var i = 0; i < len4; i++)
		{
			this.allOrderObjs.push(this.tradeSuccessOrderObjs[i]);
		}
		
		for(var i = 0; i < len5; i++)
		{
			this.allOrderObjs.push(this.waitSendOrderObjs[i]);
		}
	};
	
	//加载全部订单
	__Page.stateMy.loadAllOrderData = function()
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;
		
		var btnCopyImg = "btn1";
		var btnAgnistBuyImg = "btn3";
		var btnGoOnPayImg = "btn5";
		var btnPayImg = "btn3";
		var btnLookOver = "btn4";
		
		var btnMsg1 = 0;
		var btnMsg2 = 0;
		var btnMsg3 = 0;
		var btnMsg4 = 0;
		var btnMsg5 = 0;
		var css = [];
		var countTxt;
		var priceTxt;
		var saleManDes;
		
		var textArr1 = [];
		var imgArr1 = [null, btnPayImg];
		var cbArr1 = [this.onCopyOrderNumberClk, this.onWaitPayForClk];
		
		var textArr2 = [];
		var imgArr2 = [null, btnPayImg, "btn7"];
		var cbArr2 = [this.onCopyOrderNumberClk, this.onWaitTakeOverClk];
		
		var textArr3 = [];
		var imgArr3 = [null, btnLookOver, btnCopyImg];
		var cbArr3 = [this.onCopyOrderNumberClk, this.onSeeReasonForOrderClk];
		
		var imgArr4 = [null, btnCopyImg, btnAgnistBuyImg];
		var imgArr5 = [null, btnCopyImg, btnAgnistBuyImg, btnGoOnPayImg];
		var textArr4 = [];
		var cbArr4 = [this.onCopyOrderNumberClk, this.onAboveAllRechargeClk];
		
		var len1 = this.waitPayForOrderObjs.length;
		for(var i = 0; i < len1; i++)
		{
			btnMsg1 = i;
			var goodsObj = this.waitPayForOrderObjs[i];
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			imgArr1[0] = this.waitPayForOrderObjs[i].gameimageurl;
			textArr1 = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, goodsObj.productname,
				goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, textLib.txtWaitPayOrderTip];
			
			css.push({css:cssLib["order_detail_info"](i * appEnv.appEnvGap, "orderDetai1" + btnMsg1, textArr1,
				imgArr1, this, cbArr1, btnMsg1, this.PAGE_WAIT_PAY_ORDER, textLib.txtPayTip, this.onPayClk)});
		}
		
		var len2 = this.waitTakeOverOrderObjs.length;
		for(var i = 0; i < len2; i++)
		{
			btnMsg2 = len1 + i;
			var goodsObj = this.waitTakeOverOrderObjs[i];
			var status = this.waitTakeOverOrderObjs[i].orderstatus;
			var statusText;
			if(4 == status)
			{
				statusText = textLib.txtWaitDeliverGoods;
			}
			else if(16 == status)
			{
				statusText = textLib.txtAlreadSendGoodsTip;
			}
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			imgArr2[0] = this.waitTakeOverOrderObjs[i].gameimageurl;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			textArr2 = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, goodsObj.productname,
				goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, statusText];
			
			css.push({css:cssLib["order_detail_info"]((i + len1) * appEnv.appEnvGap, "orderDetail" + btnMsg2, textArr2,
				imgArr2, this, cbArr2, btnMsg2, this.PAGE_WAIT_TAKEOVER_ORDER, textLib.txtContactSaleTip, this.onContactSalerClk,
				textLib.txtConfirmReceiverGoodsTip, this.onConfirmReceiverGoods)});
		}

		var len3 = this.tradeFailedOrderObjs.length;
		for(var i = 0; i < len3; i++)
		{
			btnMsg3 = len1 + len2 + i;
			var goodsObj = this.tradeFailedOrderObjs[i];
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			imgArr3[0] = this.tradeFailedOrderObjs[i].gameimageurl;
			textArr3 = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, goodsObj.productname,
				goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, textLib.txtTradeFailedOrderTip];
			
			css.push({css:cssLib["order_detail_info"]((i + len2 + len1) * appEnv.appEnvGap, "orderDetail" + btnMsg3, textArr3,
				imgArr3, this, cbArr3, btnMsg3, this.PAGE_TRADE_FAILED_ORDER, textLib.txtSeeReasonTip,
				this.onSeeReasonForOrderClk, textLib.txtDeleteOrderTip, this.onDeleteOrderClk)});
		}

		var len4 = this.tradeSuccessOrderObjs.length;
		for(var i = 0; i < len4; i++)
		{
			btnMsg4 = len1 + len2 + len3 + i;
			var goodsObj = this.tradeSuccessOrderObjs[i];
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			imgArr4[0] = this.tradeSuccessOrderObjs[i].gameimageurl;
			imgArr5[0] = this.tradeSuccessOrderObjs[i].gameimageurl;
			textArr4 = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno,
				goodsObj.productname, goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, textLib.txtTradeSuccessTip];
			
			if(0 == this.tradeSuccessOrderObjs[i].iffirstaccount)
			{
				css.push({css:cssLib["order_detail_info"]((i + len3 + len2 + len1) * appEnv.appEnvGap, "orderDetail" + btnMsg4, textArr4,
					imgArr4, this, cbArr4, btnMsg4, this.PAGE_ALREADY_TAKEOVER_ORDER, textLib.txtDeleteOrderTip,
					this.onDeleteOrderClk, textLib.txtContactSaleTip, this.onContactSalerClk)});
			}
			else
			{
				css.push({css:cssLib["order_detail_info"]((i + len3 + len2 + len1) * appEnv.appEnvGap, "orderDetail" + btnMsg4, textArr4,
					imgArr5, this, cbArr4, btnMsg4, this.PAGE_ALREADY_TAKEOVER_ORDER, textLib.txtDeleteOrderTip,
					this.onDeleteOrderClk, textLib.txtAgnistBuyTip, this.onAgnistBuyClk, textLib.txtGoOnAgentPayTip,
					this.onGoOnAgentRechargeClk)});
			}
		}
		var len5 = this.waitSendOrderObjs.length;
		for(var i = 0; i < len5; i++)
		{
			btnMsg5 = len1 + len2 + len3 + len4 + i;
			var goodsObj = this.waitSendOrderObjs[i];
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			imgArr1[0] = this.waitSendOrderObjs[i].gameimageurl;
			textArr1 = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, goodsObj.productname,
				goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, textLib.txtWaitDeliverGoods];
			
			css.push({css:cssLib["order_detail_info"]((i + len4 + len3 + len2 + len1) * appEnv.appEnvGap, "orderDetai1" + btnMsg5, textArr1,
				imgArr1, this, [this.onCopyOrderNumberClk, this.onWaitSendOrderClk], btnMsg5, this.PAGE_WAIT_SEND_ORDER, textLib.txtContactSaleTip, this.onContactSalerClk)});
			
		}
		if(css.length == 0)
		{
			return;
		}
		this.allOrderScrollBoxItem.insertItems(css);
		
		if(!this.orderListObjs.hasnext)
		{
			return;
		}
		this.allOrderScrollBoxItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0], 
			(len1 + len2 + len3 + len4 + len5) * 9));
		this.allOrderScrollBoxItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.allOrderScrollBoxItem.findItemById("loadRefreshItem").findItemById("tip");
		this.allOrderScrollBoxItem.setTrigger(80, 1);
		this.allOrderScrollBoxItem.setTrigger(30, 2);
	};
	
	//初始化待付款订单数据 
	__Page.stateMy.initWaitPayForOrderData = function()
	{
		var len = this.orderListObjs.orderlist.length;
		
		var objsLen = this.waitPayForOrderObjs.length;
		this.waitPayForOrderObjs.splice(0, objsLen);
		
		for(var i = 0; i < len; i++)
		{
			this.waitPayForOrderObjs.push(this.orderListObjs.orderlist[i]);
		}
		if(this.curSubPage == this.PAGE_ALL_ORDER)
		{
			this.getAllOrderDetailData(4);
		}
	};
	
	//加载待付款订单数据
	__Page.stateMy.loadWaitPayForOrderData = function()
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;
		var countTxt;
		var priceTxt;
		var btnPayImg = "btn3";
		var textArr = [];
		var imgArr = [null, btnPayImg];
		var cbArr = [this.onCopyOrderNumberClk, this.onWaitPayForClk];
		var css = [];
		var len = this.waitPayForOrderObjs.length;
		var goodsObj = {};
		
		if(0 == len)
		{
			return;
		}
		for(var i = 0; i < len; i++)
		{
			goodsObj = this.waitPayForOrderObjs[i];
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			imgArr[0] = this.waitPayForOrderObjs[i].gameimageurl;
			textArr = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, 
				goodsObj.productname, goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, textLib.txtWaitPayOrderTip];
			
			css.push({css:cssLib["order_detail_info"](i * appEnv.appEnvGap, "orderDetail" + i, textArr,
				imgArr, this, cbArr, i, this.PAGE_WAIT_PAY_ORDER, textLib.txtPayTip, this.onPayClk)});
		}
		
		this.waitPayOrderScrollBoxItem.insertItems(css);
		
		if(!this.orderListObjs.hasnext)
		{
			return;
		}
		this.waitPayOrderScrollBoxItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0], (len - 1) * 9));
		this.waitPayOrderScrollBoxItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.waitPayOrderScrollBoxItem.findItemById("loadRefreshItem").findItemById("tip");
		this.waitPayOrderScrollBoxItem.setTrigger(80, 1);
		this.waitPayOrderScrollBoxItem.setTrigger(30, 2);
	};

	//初始化待发货的订单数据
	__Page.stateMy.initWaitSendOrderData = function()
	{
		var len = this.orderListObjs.orderlist.length;
		var css = [];
		var objsLen = this.waitSendOrderObjs.length;
		this.waitSendOrderObjs.splice(0, objsLen);
		
		for(var i = 0; i < len; i++)
		{
			this.waitSendOrderObjs.push(this.orderListObjs.orderlist[i]);
		}
		if(this.curSubPage == this.PAGE_ALL_ORDER)
		{
			this.getAllOrderDetailData(16);
		}
	};
	
	//加载待发货订单数据
	__Page.stateMy.loadWaitSendOrderData = function()
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;
		var countTxt;
		var priceTxt;
		var btnPayImg = "btn3";
		var textArr = [];
		var imgArr = [null, btnPayImg];
		var cbArr = [this.onCopyOrderNumberClk, this.onWaitSendOrderClk];
		var css = [];
		var len = this.waitSendOrderObjs.length;
		var goodsObj = {};
		
		if(0 == len)
		{
			return;
		}
		for(var i = 0; i < len; i++)
		{
			goodsObj = this.waitSendOrderObjs[i];
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			imgArr[0] = this.waitSendOrderObjs[i].gameimageurl;
			textArr = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, 
				goodsObj.productname, goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, textLib.txtWaitDeliverGoods];
			
			css.push({css:cssLib["order_detail_info"](i * appEnv.appEnvGap, "orderDetail" + i, textArr,
				imgArr, this, cbArr, i, this.PAGE_WAIT_SEND_ORDER, textLib.txtContactSaleTip, this.onContactSalerClk)});
		}
		
		this.waitSendOrderScrollBoxItem.insertItems(css);
		
		if(!this.orderListObjs.hasnext)
		{
			return;
		}
		this.waitSendOrderScrollBoxItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0], (len - 1) * 9));
		this.waitSendOrderScrollBoxItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.waitSendOrderScrollBoxItem.findItemById("loadRefreshItem").findItemById("tip");
		this.waitSendOrderScrollBoxItem.setTrigger(80, 1);
		this.waitSendOrderScrollBoxItem.setTrigger(30, 2);
	};

	
	//初始化待收货订单数据 
	__Page.stateMy.initWaitTakeOverOrderData = function()
	{
		var len = this.orderListObjs.orderlist.length;
		var css = [];
		var objsLen = this.waitTakeOverOrderObjs.length;
		this.waitTakeOverOrderObjs.splice(0, objsLen);
		
		for(var i = 0; i < len; i++)
		{
			this.waitTakeOverOrderObjs.push(this.orderListObjs.orderlist[i]);
		}
		if(this.curSubPage == this.PAGE_ALL_ORDER)
		{
			this.getAllOrderDetailData(101);
		}
	};
	
	//加载待收货订单数据 
	__Page.stateMy.loadWaitTakeOverOrderData = function()
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;

		var countTxt;
		var priceTxt;
		var btnCopyImg = "btn7";
		var btnPayImg = "btn3";
		var textArr = [];
		var imgArr = [null, btnPayImg, btnCopyImg];
		var cbArr = [this.onCopyOrderNumberClk, this.onWaitTakeOverClk];
		
		var len = this.waitTakeOverOrderObjs.length;
		var css = [];
		
		if(0 == len)
		{
			return;
		}
		for(var i = 0; i < len; i++)
		{
			var goodsObj = this.waitTakeOverOrderObjs[i];
			var status = this.waitTakeOverOrderObjs[i].orderstatus;
			var statusText;
			if(4 == status)
			{
				statusText = textLib.txtWaitDeliverGoods;
			}
			else if(16 == status)
			{
				statusText = textLib.txtAlreadSendGoodsTip;
			}
			
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			imgArr[0] = this.waitTakeOverOrderObjs[i].gameimageurl;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			textArr = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, goodsObj.productname,
				goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, statusText];
			
			css.push({css:cssLib["order_detail_info"](i * appEnv.appEnvGap, "orderDetail" + i, textArr,
				imgArr, this, cbArr, i, this.PAGE_WAIT_TAKEOVER_ORDER, textLib.txtContactSaleTip, this.onContactSalerClk,
				textLib.txtConfirmReceiverGoodsTip, this.onConfirmReceiverGoods)});
		}
		this.waitTakeOverOrderScrollBoxItem.insertItems(css);
		
		if(!this.orderListObjs.hasnext)
		{
			return;
		}
		this.waitTakeOverOrderScrollBoxItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0], (len - 1) * 9));
		this.waitTakeOverOrderScrollBoxItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.waitTakeOverOrderScrollBoxItem.findItemById("loadRefreshItem").findItemById("tip");
		this.waitTakeOverOrderScrollBoxItem.setTrigger(80, 1);
		this.waitTakeOverOrderScrollBoxItem.setTrigger(30, 2);
	};
	
	//初始化交易失败的订单数据 
	__Page.stateMy.initTradeFailedOrderData = function()
	{
		var len = this.orderListObjs.orderlist.length;
		var objsLen = this.tradeFailedOrderObjs.length;
		this.tradeFailedOrderObjs.splice(0, objsLen);
		
		for(var i = 0; i < len; i++)
		{
			this.tradeFailedOrderObjs.push(this.orderListObjs.orderlist[i]);
		}
		if(this.curSubPage == this.PAGE_ALL_ORDER)
		{
			this.getAllOrderDetailData(100);
		}
	};
	
	//加载交易失败订单数据 
	__Page.stateMy.loadTradeFailedOrderData = function()
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;

		var countTxt;
		var priceTxt;
		var btnCopyImg = "btn1";
		var btnLookOver = "btn4";
		var textArr = [];
		var imgArr = [null, btnLookOver, btnCopyImg];
		var cbArr = [this.onCopyOrderNumberClk, this.onSeeReasonForOrderClk];
		var len = this.tradeFailedOrderObjs.length;
		var css = [];
		
		if(0 == len)
		{
			return;
		}
		for(var i = 0; i < len; i++)
		{
			var goodsObj = this.tradeFailedOrderObjs[i];
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			imgArr[0] = this.tradeFailedOrderObjs[i].gameimageurl;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			textArr = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, goodsObj.productname,
				goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, textLib.txtTradeFailedOrderTip];
			
			css.push({css:cssLib["order_detail_info"](i * appEnv.appEnvGap, "orderDetail" + i, textArr,
				imgArr, this, cbArr, i, this.PAGE_TRADE_FAILED_ORDER, textLib.txtSeeReasonTip, this.onSeeReasonForOrderClk,
				textLib.txtDeleteOrderTip, this.onDeleteOrderClk)});
		}
		this.tradeFailedOrderScrollBoxItem.insertItems(css);
		if(!this.orderListObjs.hasnext)
		{
			return;
		}
		this.tradeFailedOrderScrollBoxItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0], (len - 1) * 9));
		//this.tradeFailedOrderScrollBoxItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.tradeFailedOrderScrollBoxItem.findItemById("loadRefreshItem").findItemById("tip");
		this.tradeFailedOrderScrollBoxItem.setTrigger(80, 1);
		this.tradeFailedOrderScrollBoxItem.setTrigger(30, 2);
	};
	
	//初始化交易成功的订单数据 
	__Page.stateMy.initTradeSuccessOrderData = function()
	{
		var len = this.orderListObjs.orderlist.length;
		var objsLen = this.tradeSuccessOrderObjs.length;
		this.tradeSuccessOrderObjs.splice(0, objsLen);
		
		for(var i = 0; i < len; i++)
		{
			this.tradeSuccessOrderObjs.push(this.orderListObjs.orderlist[i]);
		}
		return len;
	};
	
	//加载交易成功订单数据 
	__Page.stateMy.loadTradeSuccessOrderData = function()
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;

		var countTxt;
		var priceTxt;
		var btnCopyImg = "btn1";
		var btnAgnistBuyImg = "btn3";
		var btnGoOnPayImg = "btn5";
		var imgArr1 = [null, btnCopyImg, btnAgnistBuyImg];
		var imgArr2 = [null, btnCopyImg, btnAgnistBuyImg, btnGoOnPayImg];
		var textArr = [];
		var cbArr = [this.onCopyOrderNumberClk, this.onAboveAllRechargeClk];
		
		var len = this.tradeSuccessOrderObjs.length;
		var css = [];
		
		if(0 == len)
		{
			return;
		}
		for(var i = 0; i < len; i++)
		{
			var goodsObj = this.tradeSuccessOrderObjs[i];
			countTxt = textLib.txtTotalTip + goodsObj.quantity + textLib.txtOnceTip;
			priceTxt = (goodsObj.price * goodsObj.quantity) + textLib.txtYuanTip;
			textArr = [textLib.txtOrderNumTip + ":" + goodsObj.ordersysno, goodsObj.productname,
				goodsObj.agentstr + "/" + goodsObj.zonestr + "/" + goodsObj.serverstr,
				textLib.txtSaleManTip + ":" + goodsObj.sellname, goodsObj.categoryname, countTxt, priceTxt, textLib.txtTradeSuccessTip];
			imgArr1[0] = this.tradeSuccessOrderObjs[i].gameimageurl;
			imgArr2[0] = this.tradeSuccessOrderObjs[i].gameimageurl;
			if(0 == this.tradeSuccessOrderObjs[i].iffirstaccount)
			{
				css.push({css:cssLib["order_detail_info"](i * appEnv.appEnvGap, "orderDetail" + i, textArr,
					imgArr1, this, cbArr, i, this.PAGE_ALREADY_TAKEOVER_ORDER, textLib.txtDeleteOrderTip,
					this.onDeleteOrderClk, textLib.txtContactSaleTip, this.onContactSalerClk)});
			}
			else
			{
				css.push({css:cssLib["order_detail_info"](i * appEnv.appEnvGap, "orderDetail", textArr,
					imgArr2, this, cbArr, i, this.PAGE_ALREADY_TAKEOVER_ORDER, textLib.txtDeleteOrderTip,
					this.onDeleteOrderClk, textLib.txtAgnistBuyTip, this.onAgnistBuyClk, textLib.txtGoOnAgentPayTip,
					this.onGoOnAgentRechargeClk)});
			}
		}
		this.alreadyTakeOverScrollBoxItem.insertItems(css);
		
		if(!this.orderListObjs.hasnext)
		{
			return;
		}
		this.alreadyTakeOverScrollBoxItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0], (len - 1) * 9));
		//this.alreadyTakeOverScrollBoxItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.alreadyTakeOverScrollBoxItem.findItemById("loadRefreshItem").findItemById("tip");
		this.alreadyTakeOverScrollBoxItem.setTrigger(80, 1);
		this.alreadyTakeOverScrollBoxItem.setTrigger(30, 2);
	};
	
	//确认收货
	__Page.stateMy.onConfirmReceiverGoods = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("======确认收货=====: " + btnMsg);
			var page =  this.page;
			var appEnv = this.appEnv;
			if(Dialogs.prompt(appEnv.textLib.txtIsConfirmReceiverGoodsTip))
			{
				this.confirmReceiverData(btnMsg);
			}
		}
	};
	
	//确认收货交互
	__Page.stateMy.confirmReceiverData = function(btnMsg)
	{
		this.btnMsg = btnMsg;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideBottomRect();
		
		var customersysno = appEnv.userInfoObj.customersysno;
		var ordersysno;
		var orderstatus = 8;
		var userloginname = appEnv.userInfoObj.customerid;
		var mac = Macaddress ? Macaddress : "fdfdsfdsf";
		var edituser = userloginname;
		var plainText;
		var ciphertext;
		
		if(this.curSubPage == this.PAGE_ALL_ORDER)
		{
			this.txtLoadingConfirmReceiverOrder = appEnv.showLoadingPage(this.stateMyLayer, this.stateAllOrderItem);
			ordersysno = this.allOrderObjs[btnMsg].ordersysno;
		}
		else if(this.curSubPage == this.PAGE_WAIT_TAKEOVER_ORDER)
		{
			this.txtLoadingConfirmReceiverOrder = appEnv.showLoadingPage(this.stateMyLayer, this.stateWaitTakeOverOrderItem);
			ordersysno = this.waitTakeOverOrderObjs[btnMsg].ordersysno;
		}

		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.order.updateorderstatus"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno}, 
						{"key":"ordersysno", "value":"" + ordersysno},
						{"key":"orderstatus", "value":"" + orderstatus},
						{"key":"userloginname", "value":"" + userloginname},
						{"key":"mac", "value":"" + mac},
						{"key":"edituser", "value":"" + edituser},
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		ciphertext = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.confirmReceiverDataCallBack, paramObjs, ciphertext);
	};
	
	//确认收货的回调函数 
	__Page.stateMy.confirmReceiverDataCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.confirmReceiverData(this.btnMsg);
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.confirmReceiverData(this.btnMsg);
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.confirmReceiverData(this.btnMsg);
			return;
		}
		
		if(1 == vo.value)
		{
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingConfirmReceiverOrder, this.stateAllOrderItem);
				stateMain.showBottomRect();
				this.getAllOrderDetailData(16);
			}
			else if(this.curSubPage == this.PAGE_WAIT_TAKEOVER_ORDER)
			{
				appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingConfirmReceiverOrder, this.stateWaitTakeOverOrderItem);
				stateMain.showBottomRect();
				this.getKindsOfOrderDetailData(16);
			}
			return;
		}

		if(this.curSubPage == this.PAGE_ALL_ORDER)
		{
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingConfirmReceiverOrder, this.stateAllOrderItem);
		}
		else if(this.curSubPage == this.PAGE_WAIT_TAKEOVER_ORDER)
		{
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingConfirmReceiverOrder, this.stateWaitTakeOverOrderItem);
		}

		stateMain.showBottomRect();
		setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtConfirmReceiverGoodsFailedTip);}, this);
	};
	
	//复制订单编号事件 
	__Page.stateMy.onCopyOrderNumberClk = function(msg, extra, btnMsg, state)
	{
		if(1 == msg)
		{
			DBOut("=====复制订单编号事件======: " + btnMsg);
			var appEnv = this.appEnv;
			/*if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				this.orderNumber = this.allOrderObjs[btnMsg].ordersysno;
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtCopySuccessTip);
				return;
			}
			if(this.PAGE_ALREADY_TAKEOVER_ORDER == state)
			{
				this.orderNumber = this.tradeSuccessOrderObjs[btnMsg].ordersysno;
			}
			else if(this.PAGE_TRADE_FAILED_ORDER == state)
			{
				this.orderNumber= this.tradeFailedOrderObjs[btnMsg].ordersysno;
			}
			else if(this.PAGE_WAIT_TAKEOVER_ORDER == state)
			{
				this.orderNumber = this.waitTakeOverOrderObjs[btnMsg].ordersysno;
			}
			else if(this.PAGE_WAIT_PAY_ORDER == state)
			{
				this.orderNumber = this.waitPayForOrderObjs[btnMsg].ordersysno;
			}
			else if(this.PAGE_WAIT_SEND_ORDER == state)
			{
				this.orderNumber = this.waitSendOrderObjs[btnMsg].ordersysno;
			}
			*/
			appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtCopySuccessTip);
		}
	};
	
	//付款事件 
	__Page.stateMy.onPayClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====付款事件===== : " + btnMsg);
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				var appEnv = this.appEnv;
				var page = this.page;
				var productsysno = this.allOrderObjs[btnMsg].productsysno;
				var stateMain = page.stateMain;
				stateMain.hideBottomRect();
				
				this.gameAccountName = this.allOrderObjs[btnMsg].gameaccount;
				this.categorysysno = this.allOrderObjs[btnMsg].categorysysno;
				this.goodsCount = this.allOrderObjs[btnMsg].quantity;
				this.gamename = this.allOrderObjs[btnMsg].gamename;
				this.ordersysno = this.allOrderObjs[btnMsg].ordersysno;
				this.isGoToPayForFlag = true;
				this.goodsItem = this.stateAllOrderItem;
				this.toProduceSysnoGetInfo(productsysno);
				return;
			}
			var appEnv = this.appEnv;
			var page = this.page;
			var productsysno = this.waitPayForOrderObjs[btnMsg].productsysno;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			
			this.gameAccountName = this.waitPayForOrderObjs[btnMsg].gameaccount;
			this.categorysysno = this.waitPayForOrderObjs[btnMsg].categorysysno;
			this.goodsCount = this.waitPayForOrderObjs[btnMsg].quantity;
			this.gamename = this.waitPayForOrderObjs[btnMsg].gamename;
			this.ordersysno = this.waitPayForOrderObjs[btnMsg].ordersysno;
	
			this.isGoToPayForFlag = true;
			this.goodsItem = this.stateWaitPayOrderItem;
			this.toProduceSysnoGetInfo(productsysno);
		}
	};
	
	//后续代充事件 
	__Page.stateMy.onGoOnAgentRechargeClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====后续代充事件====== :" + btnMsg);
			var appEnv = this.appEnv;
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				this.gamesysno = this.allOrderObjs[btnMsg].gamesysno;
				this.gamename = this.allOrderObjs[btnMsg].gamename;
				this.categorysysno = this.allOrderObjs[btnMsg].categorysysno;
			}
			else if(this.curSubPage == this.PAGE_ALREADY_TAKEOVER_ORDER)
			{
				this.gamesysno = this.tradeSuccessOrderObjs[btnMsg].gamesysno;
				this.gamename = this.tradeSuccessOrderObjs[btnMsg].gamename;
				this.categorysysno = this.tradeSuccessOrderObjs[btnMsg].categorysysno;
			}
			//需要判断该商家是否有该首充新号的”首充续充“的商品，如果有则进入首充续充商品列表页；
			//如果没有，则给予提示”该商品暂时没有首充续充商品“		
			this.goods_pageno = 1;
			this.getGoodsData();
		}
	};
	
	//再次购买事件 
	__Page.stateMy.onAgnistBuyClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("======再次购买事件======: " + btnMsg);
			var appEnv = this.appEnv;
			var productsysno;
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				productsysno = this.allOrderObjs[btnMsg].productsysno;
				this.categorysysno = this.allOrderObjs[btnMsg].categorysysno;
				this.goodsItem = this.stateAllOrderItem;
			}
			else if(this.curSubPage == this.PAGE_ALREADY_TAKEOVER_ORDER)
			{
				productsysno = this.tradeSuccessOrderObjs[btnMsg].productsysno;
				this.categorysysno = this.tradeSuccessOrderObjs[btnMsg].categorysysno;
				this.goodsItem = this.stateSuccessOrderItem;
			}
			this.isAgainBuyFlag = true;
			this.toProduceSysnoGetInfo(productsysno);
		}
	};
	
	//联系卖家
	__Page.stateMy.onContactSalerClk = function(msg, extra, btnMsg, state)
	{
		if(1 == msg)
		{
			DBOut("=====联系卖家======: " + btnMsg);
			this.startTalkFlag = true;
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				//this.allOrderObjs[btnMsg];
				this.goodsItem = this.stateAllOrderItem;
				this.toProduceSysnoGetInfo(this.allOrderObjs[btnMsg].productsysno);
				return;
			}
			
			if(this.PAGE_ALREADY_TAKEOVER_ORDER == state)
			{
				//this.tradeSuccessOrderObjs[btnMsg];
				this.goodsItem = this.stateSuccessOrderItem;
				this.toProduceSysnoGetInfo(this.tradeSuccessOrderObjs[btnMsg].productsysno);
			}
			else if(this.PAGE_WAIT_TAKEOVER_ORDER == state)
			{
				//this.waitTakeOverOrderObjs[btnMsg];
				this.goodsItem = this.stateWaitTakeOverOrderItem;
				this.toProduceSysnoGetInfo(this.waitTakeOverOrderObjs[btnMsg].productsysno);
			}
			else if(this.PAGE_WAIT_SEND_ORDER == state)
			{
				this.goodsItem = this.stateWaitSendOrderItem;
				this.toProduceSysnoGetInfo(this.waitSendOrderObjs[btnMsg].productsysno);
			}
		}
	};
	
	//立即付款
	__Page.stateMy.onImmediatelyClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("======立即付款======: " + btnMsg);
			var page = this.page;
			var appEnv = this.appEnv;
			
			this.goodsInformationObj.buycount = this.goodsCount;
			this.goodsInformationObj.accountname = this.gameAccountName;
			this.goodsInformationObj.ordersysno = this.ordersysno;
			var paramObj = {type:this.categorysysno, dataObj:this.goodsInformationObj, name:this.gamename};
			appEnv.switchState(page.stateSelectPayMethod, 1, paramObj);
		}
	};
	
	//查看订单失败原因
	__Page.stateMy.onSeeReasonForOrderClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====查看订单失败原因====");
			var appEnv = this.appEnv;
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				this.curSubPage = this.PAGE_SEE_RESON_ORDER2;
				this.goodsItem = this.stateAllOrderItem;
				this.stateAllOrderItem.setDisplay(0);
				this.failedReasonText = this.allOrderObjs[btnMsg].faileddescription;
				this.gamename = this.allOrderObjs[btnMsg].gamename;
				this.toProduceSysnoGetInfo(this.allOrderObjs[btnMsg].productsysno);
				return;
			}
			this.curSubPage = this.PAGE_SEE_RESON_ORDER1;
			this.stateTradeFailedOrderItem.setDisplay(0);
			this.failedReasonText = this.tradeFailedOrderObjs[btnMsg].faileddescription;
			this.gamename = this.tradeFailedOrderObjs[btnMsg].gamename;
			this.toProduceSysnoGetInfo(this.tradeFailedOrderObjs[btnMsg].productsysno);
			//this.orderFailedReasonItem = this.stateMyLayer.appendNewChild(page.loadOrderFailedReasonCSS(this, appEnv.scrSize[0], appEnv.scrSize[1] - 202, this.tradeFailedOrderObjs[btnMsg], this.gamename));
		}
	};
	
	//删除订单 
	__Page.stateMy.onDeleteOrderClk = function(msg, extra, btnMsg, state)
	{
		if(1 == msg)
		{
			DBOut("======删除订单=====: " + btnMsg);
			var appEnv = this.appEnv;
			if(Dialogs.prompt(appEnv.textLib.txtDeleteOrderTip2))
			{
				this.deleteOrder(btnMsg);
			}
		}
	};
	
	//删除订单交互
	__Page.stateMy.deleteOrder = function(btnMsg)
	{
		this.btnMsg = btnMsg;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		var plainText;
		var ciphertext;
		var customersysno = appEnv.userInfoObj.customersysno;
		var ordersysno;
		var flag = 0;
		
		stateMain.hideBottomRect();
		if(this.curSubPage == this.PAGE_ALL_ORDER)
		{
			this.txtLoadingDeleteOrder = appEnv.showLoadingPage(this.stateMyLayer, this.stateAllOrderItem);
			ordersysno = this.allOrderObjs[btnMsg].ordersysno;
		}
		else if(this.curSubPage == this.PAGE_TRADE_FAILED_ORDER)
		{
			this.txtLoadingDeleteOrder = appEnv.showLoadingPage(this.stateMyLayer, this.stateTradeFailedOrderItem);
			ordersysno = this.tradeFailedOrderObjs[btnMsg].ordersysno;
		}
		else if(this.curSubPage == this.PAGE_ALREADY_TAKEOVER_ORDER)
		{
			this.txtLoadingDeleteOrder = appEnv.showLoadingPage(this.stateMyLayer, this.stateSuccessOrderItem);
			ordersysno = this.tradeSuccessOrderObjs[btnMsg].ordersysno;
		}
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.order.deleteorder"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno}, 
						{"key":"ordersysno", "value":"" + ordersysno},
						{"key":"flag", "value":"" + flag},
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		ciphertext = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.deleteOrderCallBack, paramObjs, ciphertext);
	};
	
	//删除订单的回调函数
	__Page.stateMy.deleteOrderCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.deleteOrder(this.btnMsg);
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.deleteOrder(this.btnMsg);
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.deleteOrder(this.btnMsg);
			return;
		}
		
		if(1 == vo.value)
		{
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingDeleteOrder, this.stateAllOrderItem);
				stateMain.showBottomRect();
				this.getAllOrderDetailData(0);
			}
			else if(this.curSubPage == this.PAGE_TRADE_FAILED_ORDER)
			{
				appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingDeleteOrder, this.stateTradeFailedOrderItem);
				stateMain.showBottomRect();
				this.getKindsOfOrderDetailData(101);
			}
			else if(this.curSubPage == this.PAGE_ALREADY_TAKEOVER_ORDER)
			{
				appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingDeleteOrder, this.stateSuccessOrderItem);
				stateMain.showBottomRect();
				this.getKindsOfOrderDetailData(100);
			}
			this.isDeleteOrderEvent = true;
			return;
		}

		if(this.curSubPage == this.PAGE_ALL_ORDER)
		{
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingDeleteOrder, this.stateAllOrderItem);
		}
		else if(this.curSubPage == this.PAGE_TRADE_FAILED_ORDER)
		{
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingDeleteOrder, this.stateTradeFailedOrderItem);
		}
		else if(this.curSubPage == this.PAGE_ALREADY_TAKEOVER_ORDER)
		{
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingDeleteOrder, this.stateSuccessOrderItem);
		}
		stateMain.showBottomRect();
		setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtDeleteOrderFailedTip);}, this);
	};
	
	//首充号交易成功事件 
	__Page.stateMy.onAboveAllRechargeClk = function(msg, extra, btnMsg, whatPage)
	{
		if(1 == msg)
		{
			DBOut("======首充号交易成功事件======");
			var productsysno;
			var appEnv = this.appEnv;
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.preSubPage = whatPage;
			
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				this.flagPage = this.PAGE_ALL_ORDER;
				this.stateAllOrderItem.setDisplay(0);
				//this.goodsItem = this.stateAllOrderItem;
				productsysno = this.allOrderObjs[btnMsg].productsysno;
				this.gamename = this.allOrderObjs[btnMsg].gamename;
				this.gameAccount = !this.allOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.allOrderObjs[btnMsg].outstocklist[0].mobileaccount;
				//this.allOrderObjs[btnMsg].gameaccount;
				this.gamePwd = !this.allOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.allOrderObjs[btnMsg].outstocklist[0].mobilepwd;
				//this.allOrderObjs[btnMsg].gamepwd;
			}
			else
			{
				this.flagPage = 0;
				this.stateSuccessOrderItem.setDisplay(0);
				//this.goodsItem = this.stateSuccessOrderItem;
				productsysno = this.tradeSuccessOrderObjs[btnMsg].productsysno;
				this.gamename = this.tradeSuccessOrderObjs[btnMsg].gamename;
				//this.gameAccount = this.tradeSuccessOrderObjs[btnMsg].gameaccount;
				//this.gamePwd = this.tradeSuccessOrderObjs[btnMsg].gamepwd;
				this.gameAccount = !this.tradeSuccessOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.tradeSuccessOrderObjs[btnMsg].outstocklist[0].mobileaccount;
				this.gamePwd = !this.tradeSuccessOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.tradeSuccessOrderObjs[btnMsg].outstocklist[0].mobilepwd;
			}
			this.toProduceSysnoGetInfo(productsysno);
		}
	};
	
	//购买后等待收货状态事件 
	__Page.stateMy.onWaitTakeOverClk = function(msg, extra, btnMsg, whatPage)
	{
		if(1 == msg)
		{
			DBOut("========购买后等待发货状态事件=======");
			var productsysno;
			var appEnv = this.appEnv;
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.preSubPage = whatPage;
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				this.flagPage = this.PAGE_ALL_ORDER;
				this.stateAllOrderItem.setDisplay(0);
				//this.goodsItem = this.stateAllOrderItem;
				productsysno = this.allOrderObjs[btnMsg].productsysno;
				this.gamename = this.allOrderObjs[btnMsg].gamename;
				//this.gameAccount = this.allOrderObjs[btnMsg].gameaccount;
				//this.gamePwd = this.allOrderObjs[btnMsg].gamepwd;
				this.gameAccount = !this.allOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.allOrderObjs[btnMsg].outstocklist[0].mobileaccount;
				this.gamePwd = !this.allOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.allOrderObjs[btnMsg].outstocklist[0].mobilepwd;
			}
			else
			{
				this.flagPage = 0;
				this.stateWaitTakeOverOrderItem.setDisplay(0);
				//this.goodsItem = this.stateWaitTakeOverOrderItem;
				productsysno = this.waitTakeOverOrderObjs[btnMsg].productsysno;
				this.gamename = this.waitTakeOverOrderObjs[btnMsg].gamename;
				//this.gameAccount = this.waitTakeOverOrderObjs[btnMsg].gameaccount;
				//this.gamePwd = this.waitTakeOverOrderObjs[btnMsg].gamepwd;
				this.gameAccount = !this.waitTakeOverOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.waitTakeOverOrderObjs[btnMsg].outstocklist[0].mobileaccount;
				this.gamePwd = !this.waitTakeOverOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.waitTakeOverOrderObjs[btnMsg].outstocklist[0].mobilepwd;
			}
			this.toProduceSysnoGetInfo(productsysno);
		}
	};
	
	//购买后等待发货状态事件 
	__Page.stateMy.onWaitSendOrderClk = function(msg, extra, btnMsg, whatPage)
	{
		if(1 == msg)
		{
			DBOut("========购买后等待发货状态事件=======");
			var productsysno;
			var appEnv = this.appEnv;
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.preSubPage = whatPage;
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				this.flagPage = this.PAGE_ALL_ORDER;
				this.stateAllOrderItem.setDisplay(0);
				productsysno = this.allOrderObjs[btnMsg].productsysno;
				this.gamename = this.allOrderObjs[btnMsg].gamename;
				this.gameAccount = !this.allOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.allOrderObjs[btnMsg].outstocklist[0].mobileaccount;
				this.gamePwd = !this.allOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.allOrderObjs[btnMsg].outstocklist[0].mobilepwd;
			}
			else
			{
				this.flagPage = 0;
				this.stateWaitSendOrderItem.setDisplay(0);
				productsysno = this.waitSendOrderObjs[btnMsg].productsysno;
				this.gamename = this.waitSendOrderObjs[btnMsg].gamename;
				this.gameAccount = !this.waitSendOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.waitSendOrderObjs[btnMsg].outstocklist[0].mobileaccount;
				this.gamePwd = !this.waitSendOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.waitSendOrderObjs[btnMsg].outstocklist[0].mobilepwd;
			}
			this.toProduceSysnoGetInfo(productsysno);
		}
	};
	
	//购买后等待付款状态事件 
	__Page.stateMy.onWaitPayForClk = function(msg, extra, btnMsg, whatPage)
	{
		if(1 == msg)
		{
			DBOut("========购买后等待付款状态事件=======");
			var productsysno;
			var appEnv = this.appEnv;
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.preSubPage = whatPage;
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				this.flagPage = this.PAGE_ALL_ORDER;
				this.stateAllOrderItem.setDisplay(0);
				//this.goodsItem = this.stateAllOrderItem;
				productsysno = this.allOrderObjs[btnMsg].productsysno;
				this.gamename = this.allOrderObjs[btnMsg].gamename;
				//this.gameAccount = this.allOrderObjs[btnMsg].gameaccount;
				//this.gamePwd = this.allOrderObjs[btnMsg].gamepwd;
				this.gameAccount = !this.allOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.allOrderObjs[btnMsg].outstocklist[0].mobileaccount;
				this.gamePwd = !this.allOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.allOrderObjs[btnMsg].outstocklist[0].mobilepwd;
			}
			else
			{
				this.flagPage = 0;
				this.stateWaitPayOrderItem.setDisplay(0);
				//this.goodsItem = this.stateWaitPayOrderItem;
				productsysno = this.waitPayForOrderObjs[btnMsg].productsysno;
				this.gamename = this.waitPayForOrderObjs[btnMsg].gamename;
				//this.gameAccount = this.waitPayForOrderObjs[btnMsg].gameaccount;
				//this.gamePwd = this.waitPayForOrderObjs[btnMsg].gamepwd;
				this.gameAccount = !this.waitPayForOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.waitPayForOrderObjs[btnMsg].outstocklist[0].mobileaccount;
				this.gamePwd = !this.waitPayForOrderObjs[btnMsg].outstocklist.length ? appEnv.textLib.txtNoHave : this.waitPayForOrderObjs[btnMsg].outstocklist[0].mobilepwd;
			}
			this.toProduceSysnoGetInfo(productsysno);
		}
	};
	
	//根据每个订单中的商品主键去搜索商品信息
	__Page.stateMy.toProduceSysnoGetInfo = function(productsysno)
	{
		this.goodsProductsysno = productsysno;
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.product.searchbyproductid"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"productsysno", "value":productsysno}
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideBottomRect();
		this.txtLoadingGoods = appEnv.showLoadingPage(this.stateMyLayer, this.goodsItem);
		appEnv.getFromServerData(this, this.toProduceSysnoGetInfoCallBack, paramObjs, cipherText);
	};
	
	//获取商品信息的回调函数
	__Page.stateMy.toProduceSysnoGetInfoCallBack = function(vo, isSuccess)
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
			description		备注
			note		提示
			categorysysno		商品类型sysno
			categoryname		商品类型
			sellcustomersysno	n	卖家用户主键
			serverstr	N	服务器
		*/
		var appEnv = this.appEnv;
		var page = this.page;
		//var stateMain = page.stateMain;
		var areaH = 90 + (appEnv.scaleFactorY - 1) * 15;
		var bottomH = 120 + (appEnv.scaleFactorY - 1) * 15;
		
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.toProduceSysnoGetInfo(this.goodsProductsysno);
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.toProduceSysnoGetInfo(this.goodsProductsysno);
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.toProduceSysnoGetInfo(this.goodsProductsysno);
			return;
		}
		
		this.goodsInformationObj = vo;
		appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoadingGoods, null);
		if(this.isGoToPayForFlag)
		{
			this.isGoToPayForFlag = false;
			if(this.curSubPage == this.PAGE_ALL_ORDER)
			{
				this.curSubPage = this.PAGE_PAY_FOR_ORDER_TWO;
			}
			else
			{
				this.curSubPage = this.PAGE_PAY_FOR_ORDER_ONE;
			}
			
			this.payforOrderItem = this.stateMyLayer.appendNewChild(page.loadPayForOrderCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1] - areaH - bottomH, this.goodsInformationObj, this.gamename));
			return;
		}
		
		if(this.isAgainBuyFlag)
		{
			this.againBuyEvent(vo);
			return;
		}
		
		if(this.startTalkFlag)
		{
			var paramObj = {specialFlag:1, dataObj:this.goodsInformationObj};
			appEnv.talkPrePageState = appEnv.FROM_ORDER_TO_TALK;
			appEnv.switchState(page.stateTalk, 1, paramObj);
			return;
		}
		if(this.curSubPage == this.PAGE_SEE_RESON_ORDER1 || this.curSubPage == this.PAGE_SEE_RESON_ORDER2)
		{
			//stateMain.showBottomRect();
			this.orderFailedReasonItem = this.stateMyLayer.appendNewChild(page.loadOrderFailedReasonCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1] - areaH - bottomH, this.goodsInformationObj, this.failedReasonText, this.gamename));
			return;
		}
		if(this.goodsInformationObj.categorysysno == "10")
		{
			this.successOrderOneItem = this.stateMyLayer.appendNewChild(page.loadFirstTradeSuccessCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1] - areaH - bottomH, this.goodsInformationObj, this.gameAccount, this.gamePwd, this.gamename));
			this.curSubPage = this.PAGE_SUCCESS_ONE_ORDER;
		}
		else
		{
			this.successOrderTwoItem = this.stateMyLayer.appendNewChild(page.loadTradeSuccessTipCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1] - areaH - bottomH, this.goodsInformationObj, this.gamename));
			this.curSubPage = this.PAGE_SUCCESS_TWO_ORDER;
		}
	};
	
	//再次购买相关事件
	__Page.stateMy.againBuyEvent = function(vo)
	{
		this.isAgainBuyFlag = false;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showBottomRect();
		if(vo.upshelf != 1)
		{
			this.goodsItem.setDisplay(1);
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtBuyGoodsTip2);}, this);//商品下架
			return;
		}
		
		if(vo.stock < 1)
		{
			this.goodsItem.setDisplay(1);
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtBuyGoodsTip3);}, this);//库存不足
			return;
		}
		
		var objs = {productsysno:vo.productsysno};
		var paramObj = {type:this.categorysysno, dataObj:objs};
		this.appEnv.switchState(page.stateBuyGoods, 1, paramObj);
	};
	
	//查看某订单有无首充新号的首充续充商品
	__Page.stateMy.getGoodsData = function()
	{
		var appEnv = this.appEnv;
		var categorysysno = this.categorysysno;
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
						{"key":"gamesysno", "value":"" + this.gamesysno},
						{"key":"statuslist", "value":"1"},
						{"key":"upshelflist", "value":"1"},
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		appEnv.getFromServerData(this, this.getGoodsDataCallBack, paramObjs, cipherText);
		appEnv.showLoadingPageSecond(this.stateMyLayer);
	};
	
	//获取商品数据的回调函数
	__Page.stateMy.getGoodsDataCallBack = function(vo, isSuccess)
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
		appEnv.hideLoadingPageSecond(this.stateMyLayer);
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
		
		if(vo.productlist.length == 0)
		{
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtBuyGoodsTip1);}, this);
			return;
		}

		var paramObj = {type:"11", dataObj:null, name:this.gamename};
		appEnv.isSearchFlag = false;
		appEnv.gameSysno = this.gamesysno;
		this.appEnv.switchState(page.stateRecharge, 1, paramObj);
	};
}