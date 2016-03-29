if(!__Page.stateMy)
{
	__Page.stateMy = {
		page:__Page,
		name:"JGXUI_stateMy",
		prjFilePath:null,

		btnHelpStateOne:true,  //帮助按钮1的状态 
		btnHelpStateTwo:false,  //帮助按钮2的状态 
		isOpenAdviseType:false, //是否打开意见反馈类型 
		//selectAdviseTypeText:null, //选择的意见反馈类型的文本内容 
		selectAdviseTypeNum:-1, //选择的意见反馈类型序号 
		isOpenCustomHelpOne:false,  //是否打开了买家帮助的那些子帮助菜单 
		isOpenCustomHelpTwo:false,
		isOpenCustomHelpThree:false,
		adviseRestroactionText:"", //意见反馈的具体文本内容 
		preSubPage:0, //上一个界面是啥 
		curSubPage:0,  //当前在什么界面 
		flagPage:0, //标记界面 
		inputOldPayForPassword:"*", //输入的旧的支付密码
		oldPayForPassword:",", //旧的支付密码 
		payForPassword:"-", //支付密码 
		confirmPayForPassword:"", //确认支付密码 
		inputVerifyCode:"", //输入的验证码 
		bindNewPhoneNumVerifyCode:"", //绑定新手机输入的验证码 
		oldLoginPassword:",", //旧的登录密码 
		inputOldLoginPassword:"*", //输入的旧的登录密码
		loginPassword:"&", //登录密码
		confirmLoginPassword:"", //再次输入的登录密码 
		newPhoneNumber:"", //新手机号
		oldPhoneNumber:"", //旧手机号
		curSoftVersionNumber:"*", //当前软件的版本号 
		newSoftVersionNumber:"", //新版本号 
		orderNumber:"", //订单编号
		isEditor:false, //是否是编辑
		seareachGameKey:"", //搜索的游戏关键字 
		getOrderDataState:-1, //获取订单数据的订单状态 
		allorder_pageno:1, //订单页码
		order_pageno:1, //单个类型订单页码
		startTalkFlag:0, //开启对话标志
		isAgainBuyFlag:false, //再次购买的标志
		allordercount:0,//订单总数
		payordercount:0,//等待付款
		alreadyreceivecount:0,//已经收货
		failordercount:0,//交易失败
		waitreceivercount:0,//等待收货
		isGoToPayForFlag:false, //是否去付款的标志 
		ordersysno:0, //订单编号 
		categorysysno:10, //分类编号
		goodsCount:0, //订单中的商品数量 
		gameAccountName:"", //游戏账号名称
		
		waitPayForOrderObjs:[], //待付款订单对象数组
		waitSendOrderObjs:[], //待发货的订单对象数组 
		waitTakeOverOrderObjs:[], //待收货订单对象数组 
		tradeFailedOrderObjs:[], //交易失败的订单对象数组
		tradeSuccessOrderObjs:[], //交易成功的订单对象数组
		allOrderObjs:[],  //所以订单对象数组
		recordGameListObjs:[], //记录推荐游戏列表
		orderListObjs:{orderlist:[], hasnext:false}, //订单对象数组
		gameIconAni:[], //收藏的游戏动画 
		isRefreshFlag:false, //是否刷新的标志
		isDeleteOrderEvent:false, //是否进行了删除订单操作 
		
		//界面常量
		PAGE_MY_ACCOUNT:1,  //我的账户界面 
		PAGE_MY_ORDER:2,  //我的订单 
		PAGE_MY_GAME:3,  //我的游戏 
		PAGE_SET_PAYPASSWORD:4,  //设置支付密码 
		PAGE_ALERT_LOGINPASSWORD:5,  //修改登录密码 
		PAGE_OLDBIND_PHONE:6,  //旧绑定手机 
		PAGE_CLEAR_CACHEPHOTO:7,  //清除缓存图片 
		PAGE_USE_HELP:8,  //使用帮助 
		PAGE_ADVISE_RETROACTION:9, //意见反馈 
		PAGE_CONTANCT_CUSTOM_SERVICE:10,  //联系客服 
		PAGE_UPDATE_VERSION:11,  //版本更新 
		PAGE_ABOUT_OUR:12,  //关于我们 
		PAGE_MY_PROTOCOL:13,  //客服协议 
		PAGE_SPECIAL_DESCRIPTION:14,  //特别说明 
		PAGE_NEWBIND_PHONE:15,  //新绑定手机 
		PAGE_EDITOR_USER_NAME:16, //设置时用户昵称 
		PAGE_WAIT_PAY_ORDER:17, //待付款订单 
		PAGE_PAY_FOR_ORDER_ONE:18,  //从待付款订单去付款 
		PAGE_WAIT_TAKEOVER_ORDER:19, //待收货 
		PAGE_TRADE_FAILED_ORDER:20, //交易失败订单
		PAGE_SEE_RESON_ORDER1:21, //查看订单失败原因 
		PAGE_ALREADY_TAKEOVER_ORDER:22, //已收货订单 
		PAGE_SUCCESS_ONE_ORDER:23, //首充号交易成功 
		PAGE_SUCCESS_TWO_ORDER:24, //交易等待联系的东东 
		PAGE_ALERT_PAYPASSWORD:25, //修改支付密码
		PAGE_ALL_ORDER:26, //全部订单
		PAGE_COLLECT_GAME:27, //收藏游戏界面 
		PAGE_PAY_FOR_ORDER_TWO:28,  //从全部订单去付款 
		PAGE_WAIT_SEND_ORDER:29, //待发货 
		PAGE_SEE_RESON_ORDER2:30, //查看订单失败原因 
		ADVISE_TYPE_DOBEST:1, //意见反馈之优化建议
		ADVISE_TYPE_QUESTION_ERROR:2, //意见反馈之问题错误 
		ADVISE_TYPE_QUESTION_RESTROACTION:3, //意见反馈之问题反馈 
	};

	__Page.stateMy.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		//this.type = appEnv.stateType;
		this.whatPage = appEnv.stateWhatPage;
		page.keyStateUtil.call(this);

		this.stateMyLayer = stateMain.getEditorLayer();

		<include check="0">"ui/state_my_css.js"</include>
		var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
		var bottomH = 120 + (appEnv.scaleFactorY - 1) * 15;
		this.stateMyTopItem = this.stateMyLayer.appendNewChild(this.initTopBarCSS(appEnv.scrSize[0], topH));
		
		var item = this.stateMyLayer.appendNewChild(this.initScrollBoxCSS(appEnv.scrSize[0], appEnv.scrSize[1] - topH - bottomH));
		this.scrollBox = item.findItemById("scrollBox");
		
		this.oldPhoneNumber = appEnv.userInfoObj.phone;
		this.initScrollBoxItem();
		
		this.stateMyLayer.setUIEvent(1);
	};

	__Page.stateMy.initScrollBoxItem = function()
	{
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;
		var css1, css2, css3, css4, css5;
		var topH = 152 + (appEnv.scaleFactorY - 1) * 40;
		if(appEnv.isLogin)
		{
			css1 = this.initLoginUserEditorCSS(appEnv.scrSize[0], topH, appEnv.userInfoObj);
			css2 = this.initUserBalanceCSS(appEnv.scrSize[0], (appEnv.scaleFactorY - 1) * 15 + 78, appEnv.userInfoObj);
		}
		else
		{
			css1 = this.noLoginUserEditorCSS(appEnv.scrSize[0], topH);
			css2 = null;
		}
		css3 = this.initUserDataCSS(appEnv.scrSize[0], appEnv.userInfoObj);
		css4 = this.page.initSoftInfoCSS(this, appEnv.scrSize[0]);
		css5 = this.loadExitAccount(appEnv.scrSize[0]);
		this.scrollBox.insertItem(css1);
		this.scrollBox.insertItem(css2);
		this.scrollBox.insertItem(css3);
		this.scrollBox.insertItem(css4);
		this.scrollBox.insertItem(css5);

		//用于更改版本号的提示语
		this.versionUpdateItem = this.scrollBox.findItemById("updateVersion");
		this.versionUpdateItem._setText(textLib.txtVersionTip + ClientVersion);
		
		if(appEnv.isLogin)
		{
			//用于更改绑定手机号提示语
			this.bindPhoneNumberTip = this.scrollBox.findItemById("bindPhone").findItemById("phoneNumTip");
			
			this.customNameItem = this.scrollBox.findItemById("userName");
			this.btnEditorNickNameItem = this.scrollBox.findItemById("userEditor");
			this.starBgItem = this.scrollBox.findItemById("starBg");
			//设置支付密码条上的字体
			this.payPasswordItem = this.scrollBox.findItemById("userDataItem").findItemById("payPwd").findItemById("statusTip");
			if(1 == appEnv.userInfoObj.paypwdstatus)
			{
				this.payPasswordItem._setText(textLib.txtAlert);
			}
		}
	};
	
	//界面被激活的响应函数:
	__Page.stateMy.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateMy enter!");
		var page = this.page;
		var stateMain = page.stateMain;
		this.preState = preState;
		stateMain.hideTopRect();
		if(1 == this.whatPage)
		{
			this.onEnterMyOrderPage();
		}
		else if(2 == this.whatPage)
		{
			this.onEnterMyGame(1);
		}
		this.whatPage = 0;
	};
	
	//界面被切走的响应函数:
	__Page.stateMy.leave = function(nextState)
	{
		//TODO:code this:
		var page = this.page;
		var stateMain = page.stateMain;
		var appEnv = this.appEnv;
		this.playCollectGameIconAnimation(0);
		this.goodsItem = null;
		this.startTalkFlag = false;
		this.isAgainBuyFlag = false;
		this.isRefreshFlag = false;
		this.isDeleteOrderEvent = false;
		this.clearOrderListObjs();
		
		this.stateMyLayer.removeAllChild();
		this.stateWaitTakeOverOrderItem = null;
		this.stateSuccessOrderItem = null;
		this.stateTradeFailedOrderItem = null;
		this.stateWaitPayOrderItem = null;
		this.stateWaitSendOrderItem = null;
		this.stateAllOrderItem = null;
		this.stateMyOrderItem = null;
		
		this.allordercount = 0;
		this.payordercount = 0;
		this.failordercount = 0;
		this.alreadyreceivecount = 0;
		this.waitreceivercount = 0;
		this.order_pageno = 1;
		this.inputVerifyCode = null;
		//================================
		this.btnHelpStateOne = true;
		this.btnHelpStateTwo = false;
		this.isOpenAdviseType = false;

		this.selectAdviseTypeNum = -1;
		this.isOpenCustomHelpOne = false;
		this.isOpenCustomHelpTwo = false;
		this.isOpenCustomHelpThree = false;
		this.adviseRestroactionText = null;
		this.preSubPage = 0;
		this.curSubPage = 0;
		this.flagPage = 0;
		this.inputOldPayForPassword = null;
		this.oldPayForPassword = null;
		this.payForPassword = null;
		this.confirmPayForPassword = null;
		this.bindNewPhoneNumVerifyCode = null;
		this.oldLoginPassword = null;
		this.inputOldLoginPassword = null;
		this.loginPassword = null;
		this.confirmLoginPassword = null;
		this.newPhoneNumber = null;
		this.oldPhoneNumber = null;
		this.curSoftVersionNumber = null;
		this.newSoftVersionNumber = null;
		this.orderNumber = null;
		this.isEditor = false;
		this.seareachGameKey = null;
		this.getOrderDataState = -1;
		this.allorder_pageno = 1;
		this.order_pageno = 1;
		this.startTalkFlag = 0;
		this.isAgainBuyFlag = false;
		this.whatPage = 0;
		appEnv.stateWhatPage = 0;
		this.isGoToPayForFlag = false;
		this.ordersysno = 0;
		this.categorysysno = 10;
		this.goodsCount = 0;
		this.gameAccountName = null;
		
		//================================
		stateMain.showBottomRect();
		stateMain.showTopRect();
		stateMain.setDisplayPage();
		stateMain.changeBottomState(1, 4);
		nextState.init(page.appEnv);
	};

	__Page.stateMy.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateMy.onKey = function(msg, key, way, extra)
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
	
	//上拉刷新事件
	__Page.stateMy.OnTrigger = function(tag, dit, touch)
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
					
					if(this.curSubPage == this.PAGE_ALL_ORDER)
					{
						if(this.orderListObjs.hasnext)
						{
							this.isRefreshFlag = true;
							this.getAllOrderDetailData(4);
						}
						else
						{
							this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
						}
					}
					else if(this.curSubPage == this.PAGE_WAIT_PAY_ORDER)
					{
						if(this.orderListObjs.hasnext)
						{
							this.isRefreshFlag = true;
							this.getKindsOfOrderDetailData(0);
						}
						else
						{
							this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
						}
					}
					else if(this.curSubPage == this.PAGE_WAIT_SEND_ORDER)
					{
						if(this.orderListObjs.hasnext)
						{
							this.isRefreshFlag = true;
							this.getKindsOfOrderDetailData(4);
						}
						else
						{
							this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
						}
					}
					else if(this.curSubPage == this.PAGE_WAIT_TAKEOVER_ORDER)
					{
						if(this.orderListObjs.hasnext)
						{
							this.isRefreshFlag = true;
							this.getKindsOfOrderDetailData(16);
						}
						else
						{
							this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
						}
					}
					else if(this.curSubPage == this.PAGE_TRADE_FAILED_ORDER)
					{
						if(this.orderListObjs.hasnext)
						{
							this.isRefreshFlag = true;
							this.getKindsOfOrderDetailData(101);
						}
						else
						{
							this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
						}
					}
					else if(this.curSubPage == this.PAGE_ALREADY_TAKEOVER_ORDER)
					{
						if(this.orderListObjs.hasnext)
						{
							this.isRefreshFlag = true;
							this.getKindsOfOrderDetailData(100);
						}
						else
						{
							this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
						}
					}
				}
			}
		}
	};
	
	//返回事件 
	__Page.stateMy.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			var page = this.page;
			var stateMain = page.stateMain;
			switch(this.curSubPage)
			{
				case 0: 
					stateMain.showTopRect();
					stateMain.showBottomRect();
					stateMain.changeBottomState(1, 4);
					this.appEnv.switchState(page.stateHome, 1, null);
					break;
					
				case this.PAGE_MY_ACCOUNT: //我的账户 
					this.curSubPage = 0;
					this.stateMyLayer.removeChild(this.stateAccountItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_ABOUT_OUR: //关于我们 
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateAboutOurItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_USE_HELP: //使用帮助 
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateUseHelpItem);
					this.stateMyLayer.removeChild(this.stateSoftHelpItem);
					this.stateMyLayer.removeChild(this.stateCustomHelpItem);
					this.btnHelpStateOne = false; 
					this.btnHelpStateTwo = false; 
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_SPECIAL_DESCRIPTION: //特别说明 
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateSpecialDesItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
				
				case this.PAGE_SET_PAYPASSWORD: //设置支付密码 
					this.inputCodeItem.OnCloseEdit();
					this.inputPwdOneItem.OnCloseEdit();
					this.inputPwdTwoItem.OnCloseEdit();
					
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateSetPayPwdItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_ALERT_PAYPASSWORD: //修改支付密码 
					this.inputCodeItem.OnCloseEdit();
					this.inputPwdOneItem.OnCloseEdit();
					this.inputPwdTwoItem.OnCloseEdit();
					
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateSetPayPwdItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_ALERT_LOGINPASSWORD: //修改登录密码 
					this.oldPwdInputItem.OnCloseEdit();
					this.newPwdInputItem.OnCloseEdit();
					this.confirmPwdInputItem.OnCloseEdit();
					
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateAlertLoginPwdItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_OLDBIND_PHONE: //绑定旧手机 
					this.oldBindPhoneCodeItem.OnCloseEdit();
					
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateOldBindPhoneItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_NEWBIND_PHONE: //绑定新手机
					this.newBindPhoneItem.OnCloseEdit();
					this.newBindPhoneCodeTwoItem.OnCloseEdit();
						
					this.curSubPage = this.PAGE_OLDBIND_PHONE;
					this.stateOldBindPhoneItem.setDisplay(1);
					this.stateMyLayer.removeChild(this.stateNewBindPhoneItem);
					break;
					
				case this.PAGE_ADVISE_RETROACTION: //意见反馈 
					this.adviseEditItem.OnCloseEdit();
					
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.isOpenAdviseType = false;
					this.stateMyLayer.removeChild(this.stateAdviseRetroactionItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_EDITOR_USER_NAME: //编辑用户昵称 
					this.editorUserNameItem.OnCloseEdit();
					
					this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateSetUserName);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					break;
					
				case this.PAGE_UPDATE_VERSION: //更新版本 
					/*this.curSubPage = 0;
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.stateUpdateVersionItem);
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);*/
					break;
					
				case this.PAGE_MY_ORDER: //我的订单 
					this.curSubPage = 0;
					this.stateMyLayer.removeChild(this.stateMyOrderItem);
					this.stateMyOrderItem = null;
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);	
					break;
					
				case this.PAGE_WAIT_PAY_ORDER: //等待支付的订单 
					this.curSubPage = this.PAGE_MY_ORDER;
					//this.stateMyOrderItem.setDisplay(1);
					this.onEnterMyOrderPage();
					this.stateMyLayer.removeChild(this.stateWaitPayOrderItem);
					this.stateWaitPayOrderItem = null;
					break;
					
				case this.PAGE_WAIT_SEND_ORDER: //待发货订单 
					this.curSubPage = this.PAGE_MY_ORDER;
					//this.stateMyOrderItem.setDisplay(1);
					this.onEnterMyOrderPage();
					this.stateMyLayer.removeChild(this.stateWaitSendOrderItem);
					this.stateWaitSendOrderItem = null;
					break;
					
				case this.PAGE_ALL_ORDER: //全部订单 
					this.curSubPage = this.PAGE_MY_ORDER;
					//this.stateMyOrderItem.setDisplay(1);
					this.onEnterMyOrderPage();
					this.stateMyLayer.removeChild(this.stateAllOrderItem);
					this.stateAllOrderItem = null;
					break;
					
				case this.PAGE_PAY_FOR_ORDER_ONE: 
					stateMain.showBottomRect();
					this.curSubPage = this.PAGE_WAIT_PAY_ORDER;
					this.stateWaitPayOrderItem.setDisplay(1);
					this.stateMyLayer.removeChild(this.payforOrderItem);
					break;
					
				case this.PAGE_PAY_FOR_ORDER_TWO:
					stateMain.showBottomRect();
					this.curSubPage = this.PAGE_ALL_ORDER;
					this.stateAllOrderItem.setDisplay(1);
					this.stateMyLayer.removeChild(this.payforOrderItem);
					break;
					
				case this.PAGE_TRADE_FAILED_ORDER: //交易失败的订单 
					this.curSubPage = this.PAGE_MY_ORDER;
					//this.stateMyOrderItem.setDisplay(1);
					this.onEnterMyOrderPage();
					this.stateMyLayer.removeChild(this.stateTradeFailedOrderItem);
					this.stateTradeFailedOrderItem = null;
					break;
					
				case this.PAGE_SEE_RESON_ORDER1: //查看交易失败订单的原因
					stateMain.showBottomRect();
					this.curSubPage = this.PAGE_TRADE_FAILED_ORDER;
					this.stateTradeFailedOrderItem.setDisplay(1);
					this.stateMyLayer.removeChild(this.orderFailedReasonItem);
					break;
					
				case this.PAGE_SEE_RESON_ORDER2: //查看交易失败订单的原因
					stateMain.showBottomRect();
					this.curSubPage = this.PAGE_ALL_ORDER;
					this.stateAllOrderItem.setDisplay(1);
					this.stateMyLayer.removeChild(this.orderFailedReasonItem);
					break;
					
				case this.PAGE_ALREADY_TAKEOVER_ORDER: //已经完成交易的订单
					this.curSubPage = this.PAGE_MY_ORDER;
					//this.stateMyOrderItem.setDisplay(1);
					this.onEnterMyOrderPage();
					this.stateMyLayer.removeChild(this.stateSuccessOrderItem);
					this.stateSuccessOrderItem = null;
					break;
					
				case this.PAGE_WAIT_TAKEOVER_ORDER: //等待收货的订单
					this.curSubPage = this.PAGE_MY_ORDER;
					//this.stateMyOrderItem.setDisplay(1);
					this.onEnterMyOrderPage();
					this.stateMyLayer.removeChild(this.stateWaitTakeOverOrderItem);
					this.stateWaitTakeOverOrderItem = null;
					break;
					
				case this.PAGE_SUCCESS_TWO_ORDER:
					if(this.flagPage == this.PAGE_ALL_ORDER)
					{
						this.stateAllOrderItem.setDisplay(1);
						this.curSubPage = this.PAGE_ALL_ORDER;
					}
					else
					{
						if(this.preSubPage == this.PAGE_WAIT_PAY_ORDER)
						{
							this.stateWaitPayOrderItem.setDisplay(1);
						}
						else if(this.preSubPage == this.PAGE_ALREADY_TAKEOVER_ORDER)
						{
							this.stateSuccessOrderItem.setDisplay(1);
						}
						else if(this.preSubPage == this.PAGE_WAIT_TAKEOVER_ORDER)
						{
							this.stateWaitTakeOverOrderItem.setDisplay(1);
						}
						else if(this.preSubPage == this.PAGE_WAIT_SEND_ORDER)
						{
							this.stateWaitSendOrderItem.setDisplay(1);
						}
						this.curSubPage = this.preSubPage;
					}
					
					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.successOrderTwoItem);
					break;
					
				case this.PAGE_SUCCESS_ONE_ORDER:
					if(this.flagPage == this.PAGE_ALL_ORDER)
					{
						this.stateAllOrderItem.setDisplay(1);
						this.curSubPage = this.PAGE_ALL_ORDER;
					}
					else
					{
						if(this.preSubPage == this.PAGE_WAIT_PAY_ORDER)
						{
							this.stateWaitPayOrderItem.setDisplay(1);
						}
						else if(this.preSubPage == this.PAGE_ALREADY_TAKEOVER_ORDER)
						{
							this.stateSuccessOrderItem.setDisplay(1);
						}
						else if(this.preSubPage == this.PAGE_WAIT_TAKEOVER_ORDER)
						{
							this.stateWaitTakeOverOrderItem.setDisplay(1);
						}
						this.curSubPage = this.preSubPage;
					}

					stateMain.showBottomRect();
					this.stateMyLayer.removeChild(this.successOrderOneItem);
					break;
					
				case this.PAGE_MY_GAME: //我的游戏 
					this.scrollBox.setDisplay(1);
					this.stateMyTopItem.setDisplay(1);
					this.curSubPage = 0;
					this.stateMyLayer.removeChild(this.stateMyGameItem);
					break;
					
				case this.PAGE_COLLECT_GAME: //收藏游戏 
					stateMain.showBottomRect();
					this.curSubPage = this.PAGE_MY_GAME;
					this.stateMyGameItem.setDisplay(1);
					this.stateMyLayer.removeChild(this.collectGameTopItem);
					this.stateMyLayer.removeChild(this.seareachItem);
					this.stateMyLayer.removeChild(this.lastSeareachItem);
					this.stateMyLayer.removeChild(this.gameScrollBoxItem);
					break;
			}
		}
	};

	//获取验证码 
	__Page.stateMy.getCheckCode = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			var appEnv = this.appEnv;
			//btnMsg = 0:获取支付验证码
			//btnMsg = 1:获取绑定旧
			//btnMsg = 2:新手机验证码
			DBOut("=======获取验证码=====");
			if(0 == btnMsg)
			{
				this.inputCodeItem.OnCloseEdit();
				this.inputPwdOneItem.OnCloseEdit();
				this.inputPwdTwoItem.OnCloseEdit();
					
				appEnv.sendCheckCode(appEnv.userInfoObj.phone, appEnv.userInfoObj.customersysno, this, this.getCheckCodeCallBack);
			}
			else if(1 == btnMsg)
			{
				this.oldBindPhoneCodeItem.OnCloseEdit();
				appEnv.sendCheckCode(appEnv.userInfoObj.phone, appEnv.userInfoObj.customersysno, this, this.getCheckCodeCallBack);
			}
			else if(2 == btnMsg)
			{
				appEnv.sendCheckCode(this.newPhoneNumber, appEnv.userInfoObj.customersysno, this, this.getCheckCodeCallBack);
			}
		}
	};
	
	//获取验证码的回调函数
	__Page.stateMy.getCheckCodeCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtSendVerifyCodeFailed);
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			return;
		}
		
		if(1 == vo.value)
		{
			DBOut("发送成功");
			appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtSendVerifyCodeSuccess);
			return;
		}
		DBOut("发送失败");
		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtSendVerifyCodeFailed);
	};
	
	//输入框事件
	__Page.stateMy.inputBoxEvent = function(txt, btnMsg)
	{
		//btnMsg = 0:输入支付密码
		//btnMsg = 1:再次输入支付密码
		//btnMsg = 2:输入支付验证码
		//btnMsg = 3;旧登录密码
		//btnMsg = 4;新登录密码
		//btnMsg = 5;再次输入新登录密码
		//btnMsg = 6:输入绑定旧手机的验证码
		//btnMsg = 7:输入新手机号
		//btnMsg = 8:输入绑定新手机的验证码
		//btnMsg = 9:输入用户昵称 
		//btnMsg = 10:旧的支付密码 
		var appEnv = this.appEnv;
		switch(btnMsg)
		{
			case 0:
				if(!appEnv.warningInputError(txt))
				{
					return;
				}
				this.payForPassword = txt;
				break;
			case 1:
				if(!appEnv.warningInputError(txt))
				{
					return;
				}
				this.confirmPayForPassword = txt;
				break;
			case 2:
				this.inputVerifyCode = txt;
				break;
			case 3:
				if(!appEnv.warningInputError(txt))
				{
					return;
				}
				this.inputOldLoginPassword = txt;
				break;
			case 4:
				if(!appEnv.warningInputError(txt))
				{
					return;
				}
				this.loginPassword = txt;
				break;
			case 5:
				if(!appEnv.warningInputError(txt))
				{
					return;
				}
				this.confirmLoginPassword = txt;
				break;
			case 6:
				break;
			case 7:
				var appEnv = this.appEnv;
				/*if(!appEnv.textFilter.checkPhoneNumber(txt))
				{
					appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtPhoneNumberErrorTip);
				}*/
				this.newPhoneNumber = txt;
				break;
			case 8:
				this.bindNewPhoneNumVerifyCode = txt;
				break;
			case 9:
				if(!txt)
				{
					return;
				}
				this.userName = txt.substring(0, 10);
				break;
			case 10:
				if(!appEnv.warningInputError(txt))
				{
					return;
				}
				this.inputOldPayForPassword = txt;
				break;
		}
	};
	
	//显示输入的字符过长的警示
	__Page.stateMy.editWarning = function()
	{
		var appEnv =  this.appEnv;
		Dialogs.alert(appEnv.textLib.txtStringErrorTip5);
	};
	
	//提交设置或修改的密码 
	__Page.stateMy.onSubmitPwdClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			var appEnv = this.appEnv;
			var textLib = appEnv.textLib;
			DBOut("=======提交设置或修改的密码=======");
			//btnMsg = 0:设置支付密码
			//btnMsg = 1:设置登录密码
			//btnMsg = 2:旧绑定手机下一步
			//btnMsg = 3;新绑定手机提交
			//btnMsg = 4;意见反馈的提交 
			//bntMsg = 5;修改支付密码
			switch(btnMsg)
			{
				case 0:
				case 5:
					this.inputCodeItem.OnCloseEdit();
					this.inputPwdOneItem.OnCloseEdit();
					this.inputPwdTwoItem.OnCloseEdit();
					//如果成功，修改前一个界面的字体 
					if(!this.inputVerifyCode || !this.inputVerifyCode.length)
					{
						appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, textLib.txtVerifycodeWarningTip);
						return;
					}

					if(!appEnv.isCheckPassword(this.payForPassword, true) ||
						!appEnv.isCheckPassword(this.confirmPayForPassword, true))
					{
						Dialogs.alert(textLib.txtPasswordErrorTip3);
						return;
					}

					if(!appEnv.isCheckAccording(this.payForPassword, this.confirmPayForPassword))
					{
						appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, textLib.PwdErrorRe);
						return;
					}
					
					appEnv.showLoadingPageSecond(this.stateMyLayer);
					appEnv.sendSetPayPassword(appEnv.userInfoObj.customersysno, this.payForPassword, this.inputVerifyCode,
						appEnv.userInfoObj.phone, this, this.setPayPasswordCallBack);
					break;
				case 1:
					this.oldPwdInputItem.OnCloseEdit();
					this.newPwdInputItem.OnCloseEdit();
					this.confirmPwdInputItem.OnCloseEdit();
					
					if(!appEnv.isCheckPassword(this.inputOldLoginPassword, true) ||
						!appEnv.isCheckPassword(this.loginPassword, true) ||
						!appEnv.isCheckPassword(this.confirmLoginPassword, true))
					{
						Dialogs.alert(textLib.txtPasswordErrorTip3);
						return;
					}
						
					if(!appEnv.isCheckAccording(this.loginPassword, this.confirmLoginPassword))
					{
						appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, textLib.PwdErrorRe);
						return;
					}

					appEnv.showLoadingPageSecond(this.stateMyLayer);
					appEnv.sendUpdatePassword(this.inputOldLoginPassword, this.loginPassword, appEnv.userInfoObj.customersysno,
						this, this.checkUpdateLoginPasswordCallBack);
					break;
				case 2:
						if(!this.inputVerifyCode || !this.inputVerifyCode.length)
						{
							Dialogs.alert(textLib.txtPleaseInputVerifycodeTip);
							return;
						}
						var appEnv = this.appEnv;
						this.stateOldBindPhoneItem.setDisplay(0);
						this.curSubPage = this.PAGE_NEWBIND_PHONE;
						this.stateNewBindPhoneItem = this.stateMyLayer.appendNewChild(this.newBindPhoneCSS(appEnv.scrSize[0],
							appEnv.scrSize[1]));
	
						this.newBindPhoneItem = this.stateNewBindPhoneItem.findItemById("inputBoxBgnewPhone");
						this.newBindPhoneCodeTwoItem = this.stateNewBindPhoneItem.findItemById("inputBoxBgnewPhoneCheckCode");
					break;
				case 3:
					this.newBindPhoneItem.OnCloseEdit();
					this.newBindPhoneCodeTwoItem.OnCloseEdit();
					
					if(!appEnv.textFilter.checkPhoneNumber(this.newPhoneNumber))
					{
						appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, textLib.txtPhoneNumberErrorTip);
						return;
					}
					appEnv.showLoadingPageSecond(this.stateMyLayer);
					this.updateNewPhoneNumber();
					break;
				case 4:
					this.adviseEditItem.OnCloseEdit();
					if(!this.adviseRestroactionText || !this.adviseRestroactionText.length)
					{
						Dialogs.alert(textLib.txtadviseRestroactionErrorTip);
						return;
					}
					this.submitAdviseToServer();
					break;
				/*case 5:
					//如果成功，修改前一个界面的字体 
					if(!appEnv.isCheckAccording(this.payForPassword, this.confirmPayForPassword))
					{
						DBOut("====2次输入的密码不一样=====");
						appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, textLib.PwdErrorRe);
						return;
					}
					if(appEnv.isCheckAccording(this.payForPassword, this.inputOldPayForPassword))
					{
						appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, textLib.txtErrorTip4);
						return;
					}
					
					this.txtLoading = appEnv.showLoadingPage(this.stateMyLayer, this.stateSetPayPwdItem);
					appEnv.sendUpdatePassword(this.inputOldPayForPassword, this.payForPassword,
						appEnv.userInfoObj.customersysno, this, this.checkUpdatePayPasswordCallBack);
					break;*/
			}
		}
	};
}