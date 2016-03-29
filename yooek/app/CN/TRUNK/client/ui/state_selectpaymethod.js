/*
	选择付款方式界面 
*/
if(!__Page.stateSelectPayMethod)
{
	__Page.stateSelectPayMethod = {
		page:__Page,
		name:"JGXUI_stateSelectPayMethod",
		prjFilePath:null,
		isSelectBalancePayFor:false, //是否选择余额支付 
		bankCardListObj:{paylist:[]}, // 银行卡列表 
		btnLeftState:true,
		btnRightState:false,
		curPage:0,
		payPassword:"", //支付密码 
		isInputPayPassword:false, //是否输入了支付密码  
		paywaitAni:[], //等待动画数组 
		preIndex:-1,
		nextIndex:0,
		isAlreadySelectBalancePayFor:false, //是否已经选了余额支付 
		payMethodList:{paylist:[]}, //支付方式列表 
		payMethodItem:[], //支付方式控件数组 
		payMethodSysno:-1, //支付方式主键 
		
		FIRST_RECHARGE:"10", //首充 
		PAGE_SELECT_BANKCARD:1, //银行卡 
	};

	__Page.stateSelectPayMethod.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		this.vo = appEnv.stateDataObj;
		this.type = ""+ appEnv.stateType;

		page.keyStateUtil.call(this);

		this.stateSelectPayMethodLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_selectpaymethod_css.js"</include>
		
		if(this.FIRST_RECHARGE == this.type)
		{
			this.stateSelectPayMethodItem = this.stateSelectPayMethodLayer.appendNewChild(this.loadAboveAllRechargeCSS(appEnv.scrSize[0], appEnv.scrSize[1], this.vo));
		}
		else
		{
			this.stateSelectPayMethodItem = this.stateSelectPayMethodLayer.appendNewChild(this.loadOtherRechargeCSS(appEnv.scrSize[0], appEnv.scrSize[1], this.vo));
		}
		var item = this.item = this.stateSelectPayMethodItem.findItemById("loadConfirmPayMethodItem");
		this.selectBalancePayForItem = item.findItemById("selectBalancePayForItem");
		
		this.scrollBoxItem = item.findItemById("scrollBox");
		this.stateSelectPayMethodLayer.setUIEvent(1);
	};

	//界面被激活的响应函数:
	__Page.stateSelectPayMethod.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateSelectPayMethod enter!: " + preState);
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
		this.getPayMethod();
	};

	//界面被切走的响应函数:
	__Page.stateSelectPayMethod.leave = function(nextState)
	{
		//TODO:code this:
		this.isSelectBalancePayFor = false;
		this.isInputPayPassword = false;
		this.btnLeftState = true;
		this.isAlreadySelectBalancePayFor = false;
		this.btnRightState = false;
		this.curPage = 0;
		this.payMethodSysno = -1;
		this.appEnv.form.clearTimeout(this.payWaitAnimationTimer);
		this.payWaitAnimationTimer = null;
			
		var len = this.bankCardListObj.paylist.length;
		this.bankCardListObj.paylist.splice(0, len);
		
		len = this.payMethodList.paylist.length;
		this.payMethodList.paylist.splice(0, len);
		
		len = this.payMethodItem.length;
		this.payMethodItem.splice(0, len);
	
		this.stateSelectPayMethodLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateSelectPayMethod.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateSelectPayMethod.onKey = function(msg, key, way, extra)
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
	
	//获取所有现有的支付方式
	__Page.stateSelectPayMethod.getPayMethod = function()
	{
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.getpaytypelist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"},  
						{"key":"ifverifytokenid", "value":"true"}, 
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);

		this.txtLoading = appEnv.showLoadingPage(this.stateSelectPayMethodLayer, this.stateSelectPayMethodItem);
		appEnv.getFromServerData(this, this.getPayMethodCallBack, paramObjs, cipherText);
	};
	
	//获取所有现有的支付方式的回调函数
	__Page.stateSelectPayMethod.getPayMethodCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPage(this.stateSelectPayMethodLayer, this.txtLoading, this.stateSelectPayMethodItem);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.getPayMethod();
			}, this);
			return;
		}
		if(vo.Errors.length)
		{
			setTimeout(5, function(){
				appEnv.showNetErrorMessage(vo.Errors);
				this.getPayMethod();
			}, this);
			return;
		}
		if(!vo || !vo.paylist)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtNetTip1);
				this.getPayMethod();
			}, this);
			return;
		}
		if(!vo.paylist.length)
		{
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtNoHaveBackDataTip);}, this);
			return;
		}
		
		this.bankCardListObj.paylist.splice(0, this.bankCardListObj.paylist.length);
		var len = vo.paylist.length;
		var len2 = payMethodSysno.length;
		for(var i = 0; i < len; i++)
		{
			if(1 == vo.paylist[i].flag)
			{
				for(var k = 0; k < len2; k++)
				{
					if(payMethodSysno[k] == vo.paylist[i].sysno)
					{
						this.payMethodList.paylist.push(vo.paylist[i]);
					}
				}
			}
			else
			{
				for(var k = 0; k < len2; k++)
				{
					if(payMethodSysno[k] == vo.paylist[i].sysno)
					{
						//if(!vo.paylist[i].imageurl)
						//{
							vo.paylist[i].imageurl = "bank_card" + vo.paylist[i].banksysno;
							vo.paylist[i].isLocal = true;
						//}
						/*else
						{
							vo.paylist[i].isLocal = false;
						}*/
						this.bankCardListObj.paylist.push(vo.paylist[i]);
					}
				}
			}
		}
		if(this.bankCardListObj.paylist.length > 0)
		{
			this.payMethodList.paylist.unshift({imageurl:null, isnet:1, isonlineshow:1,
				paytypename:appEnv.textLib.txtBankCardTip, sysno: 1, flag:0});
		}
		
		this.initPayForList();
	};
	
	//初始化支付列表
	__Page.stateSelectPayMethod.initPayForList = function()
	{
		var css;
		var len = this.payMethodList.paylist.length;
		
		for(var i = 0; i < len; i++)
		{
			css = this.loadPayForMethodCSS(this.payMethodList.paylist[i], i);
			this.scrollBoxItem.insertItem(css);
			this.payMethodItem.push({hud:this.scrollBoxItem.findItemById("payForMethod" + i).findItemById("selectFlag"),
				isSelect:false});
		}

		this.scrollBoxItem.insertItem(this.loadConfirmPayCSS());
	};
	
	//返回事件
	__Page.stateSelectPayMethod.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			if(this.curPage == this.PAGE_SELECT_BANKCARD)
			{
				this.curPage = 0;
				this.stateSelectPayMethodItem.setDisplay(1);
				this.bankCardItem = this.stateSelectPayMethodLayer.removeChild(this.bankCardItem);
				this.bankCardItem = null;
				return;
			}
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			this.appEnv.switchState(this.preState, 1, null);
		}
	};
	
	//确认支付  
	__Page.stateSelectPayMethod.onConfirmPayForClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====确认支付====");
			var appEnv = this.appEnv;
			var page = this.page;
			var stateMain = page.stateMain;
	
			//如果选择了余额支付，先看看有无设置支付密码
			//如果没有，跳转到我界面，去设置支付密码
			if(this.isSelectBalancePayFor && !this.isAlreadySelectBalancePayFor)
			{
				if(0 == appEnv.userInfoObj.paypwdstatus)
				{
					
					if(Dialogs.prompt(appEnv.textLib.txtPayTip2))
					{
						stateMain.showBottomRect();
						stateMain.changeBottomState(4, 1);
						appEnv.switchState(this.page.stateMy, 1, null);
					}
					else
					{
						Dialogs.alert(appEnv.textLib.txtPayTip3);
					}
					return;
				}
				if(this.isInputPayPassword)
				{
					return;
				}
				var sw = appEnv.scrSize[0];
				var sh = appEnv.scrSize[1];
				var cssLib = page.cssLib;
				this.stateSelectPayMethodItem.setUIEvent(0);
				this.paypwdItem = this.stateSelectPayMethodLayer.appendNewChild({css:cssLib["input_paypwd"]([sw, sh, 0],
					this, [this.getInputPayPassword, this.confirmInputPayPwd])});
				this.isInputPayPassword = true;
				return;
			}
			
			//检查有没有选择其他的支付方式
			var len = this.payMethodItem.length;
			for(var i = 0; i < len; i++)
			{
				if(this.payMethodItem[i].isSelect)
				{
					if(this.payMethodList.paylist[i].flag == 0)
					{
						//跳转到选择银行卡界面
						this.stateSelectPayMethodItem.setDisplay(0);
						this.loadBankCardPage();
						return;
					}
					this.requestPayEvent();
					return;
				}
			}
			//已经选择了余额支付，但是余额不够，而且也没选择其他的支付方式，
			//则给出提示，再去选择另外一种支付方式 
			if(this.isAlreadySelectBalancePayFor)
			{
				Dialogs.alert(appEnv.textLib.txtPayTip4);
			}
			else
			{
				Dialogs.alert(appEnv.textLib.txtSelectPayMethodTip);
			}
		}
	};
	
	//选中的支付方式
	__Page.stateSelectPayMethod.onSelectPayForClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			if(this.isSelectBalancePayFor)
			{
				var appEnv = this.appEnv;
				var textLib = appEnv.textLib;
				var balanceMoney = appEnv.userInfoObj.validcoin;
				var totalPayMoney = this.vo.rebateprice * this.vo.buycount;
				if(balanceMoney > totalPayMoney)
				{
					Dialogs.alert(textLib.txtBuyBalanceTip);
					return;
				}
			}
			var icon1 = "select2";
			var icon2 = "unselect2";
			var len = this.payMethodItem.length;
			
			for(var i = 0; i < len; i++)
			{
				if(i == btnMsg)
				{
					if(!this.payMethodItem[i].isSelect)
					{
						this.payMethodItem[i].hud._setIcon(icon1);
						this.payMethodSysno = this.payMethodList.paylist[btnMsg].sysno;
					}
					else
					{
						this.payMethodItem[i].hud._setIcon(icon2);
						this.payMethodSysno = -1;
					}
					this.payMethodItem[i].isSelect = this.payMethodItem[i].isSelect ? false : true;
				}
				else
				{
					this.payMethodItem[i].hud._setIcon(icon2);
					this.payMethodItem[i].isSelect = false;
				}
			}
		}
	};
	
	//选择余额支付   
	__Page.stateSelectPayMethod.onSelectBalancePayForClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("======选择余额支付======");
			var appEnv = this.appEnv;
			var icon1 = "select1";
			var icon2 = "unselect1";
		
			if(0 == appEnv.userInfoObj.validcoin)
			{
				return;
			}
			if(!this.isSelectBalancePayFor)
			{
				this.selectBalancePayForItem._setIcon(icon1);
			}
			else
			{
				this.selectBalancePayForItem._setIcon(icon2);
				this.isAlreadySelectBalancePayFor = false;
				this.isInputPayPassword = false;
			}
			this.isSelectBalancePayFor = this.isSelectBalancePayFor ? false : true;
			
			if(!this.isSelectBalancePayFor )
			{
				return;
			}
			var textLib = appEnv.textLib;
			var balanceMoney = appEnv.userInfoObj.validcoin;
			var totalPayMoney = this.vo.rebateprice * this.vo.buycount;
			if(balanceMoney < totalPayMoney)
			{
				return;
			}
		
			//检查是否有选中其他的支付方式
			var len = this.payMethodItem.length;
			var icon2 = "unselect2";
			for(var i = 0; i < len; i++)
			{
				if(this.payMethodItem[i].isSelect)
				{
					this.payMethodItem[i].isSelect = false;
					this.payMethodItem[i].hud._setIcon(icon2);
					this.payMethodSysno = -1;
					return;
				}
			}
		}
	};
	
	//获取输入的支付密码
	__Page.stateSelectPayMethod.getInputPayPassword = function(txt)
	{
		this.payPassword = txt;
	};
	
	//确定输入的支付密码
	__Page.stateSelectPayMethod.confirmInputPayPwd = function(msg, extra)
	{
		if(1 == msg)
		{
			var appEnv = this.appEnv;
			if(!this.payPassword || this.payPassword.length == 0)
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateSelectPayMethodLayer,
					this, appEnv.textLib.txtPasswordIllegeTip);
				return;
			}
			if(0 == appEnv.isCheckPassword(this.payPassword))
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateSelectPayMethodLayer, this, appEnv.textLib.IllegalInput);
				return;
			}
			else if(2 == appEnv.isCheckPassword(this.payPassword))
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateSelectPayMethodLayer, this, appEnv.textLib.PwdErrorLen);
				return;
			}
			
			var balanceMoney = appEnv.userInfoObj.validcoin;
			var totalPayMoney = this.vo.rebateprice * this.vo.buycount;
			var find = false;
			if(totalPayMoney > balanceMoney)
			{
				//检查有无选中其他的支付方式
				var len = this.payMethodItem.length;
				for(var i = 0; i < len; i++)
				{
					if(this.payMethodItem[i].isSelect)
					{
						find = true;
						break;
					}
				}
				if(!find)
				{
					Dialogs.alert(appEnv.textLib.txtPayTip4);
					this.stateSelectPayMethodLayer.removeChild(this.paypwdItem);
					this.paypwdItem = null;
					this.stateSelectPayMethodItem.setUIEvent(1);
					this.isAlreadySelectBalancePayFor = true;
					return;
				}
			}
			//this.paypwdItem.setUIEvent(0);
			this.stateSelectPayMethodLayer.removeChild(this.paypwdItem);
			this.paypwdItem = null;
			//请求支付事件,跳转到第三方支付界面
			this.requestPayEvent();
		}
	};
	
	//请求支付事件
	__Page.stateSelectPayMethod.requestPayEvent = function()
	{
			/*
				ordersysno	Y	订单号，此项非空表订单支付
								此项与充值提现流水号不允许同时为空，若订单号存在，以订单号为准
				isusedbalance	N	是否使用余额支付：0=不使用  1=使用余额，仅订单支付时有效
				paypwd	Y	交易密码，余额支付时必填 此字段使用Base64传输加密
				iftwodimension	Y	是否二维码支付 如果是传递0，其他是为空
				paytype	N	支付方式，默认值0，余额支付使用；在线支付时不允许为0
				redirecturl	N	前台支付成功跳转页面????
			*///要发送的数据
			var appEnv = this.appEnv;
			var plainText = ""; //明文
			var cipherText = ""; //密文
			var ordersysno = this.vo.ordersysno;
			var isusedbalance = 0;
			var paypwd;
			var paytype = 0;
			var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
			var paramObjs = [{"key":"method", "value":"yooek.baseinfo.pay"}, 
							{"key":"version", "value":ClientVersion}, 
							{"key":"channel_id", "value":"" + ChannelID}, 
							{"key":"tokenid", "value":"" + tokenid}, 
							{"key":"format", "value":"json"},  
							{"key":"ifverifytokenid", "value":"true"}, 
							{"key":"ordersysno", "value":"" + ordersysno},
							//{"key":"paytype", "value":"" + paytype},
							//{"key":"iftwodimension", "value":null},
							//{"key":"redirecturl", "value":null},
			];
		
			if(this.isSelectBalancePayFor)
			{
				isusedbalance = 1;
				paypwd = appEnv.Base64(this.payPassword);
				paytype = 0;
				paramObjs.push({"key":"paypwd", "value":paypwd});
				paramObjs.push({"key":"isusedbalance", "value":"" + isusedbalance});
			}
			else
			{
				paramObjs.push({"key":"isusedbalance", "value":"" + isusedbalance});
			}
			//小于0，说明只是选择了余额支付
			//反之表示选择了其他支付方式
			if(this.payMethodSysno < 0)
			{
				paytype = 0;
				paramObjs.push({"key":"paytype", "value":"" + paytype});
				paramObjs.push({"key":"redirecturl", "value":Redirecturl});
			}
			else
			{
				paytype = this.payMethodSysno;
				paramObjs.push({"key":"paytype", "value":"" + paytype});
			}
			plainText = appEnv.getPlainTextMethod(paramObjs);
			cipherText = appEnv.getCipherTextMethod(plainText);

			appEnv.getFromServerData(this, this.requestPayEventCallBack, paramObjs, cipherText);
			appEnv.showLoadingPageSecond(this.stateSelectPayMethodLayer);
	};
	
	//请求支付事件的回调函数
	__Page.stateSelectPayMethod.requestPayEventCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		var page = this.page;
		var cssLib = page.cssLib;
		appEnv.hideLoadingPageSecond(this.stateSelectPayMethodLayer);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				//this.requestPayEvent();
				/*if(this.paypwdItem)
				{
					this.paypwdItem.setUIEvent(1);
				}*/
				this.stateSelectPayMethodItem.setUIEvent(1);
			}, this);
			return;
		}
		if(vo.Errors.length)
		{
			setTimeout(5, function(){
				appEnv.showNetErrorMessage(vo.Errors);
				/*if(this.paypwdItem)
				{
					this.paypwdItem.setUIEvent(1);
				}*/
				this.stateSelectPayMethodItem.setUIEvent(1);
			}, this);
			return;
		}
		if(!vo)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtNetTip1);
				//this.requestPayEvent();
				/*if(this.paypwdItem)
				{
					this.paypwdItem.setUIEvent(1);
				}*/
				this.stateSelectPayMethodItem.setUIEvent(1);
			}, this);
			return;
		}
		
		jgx.App.shellExec(vo.url);
		
		this.stateSelectPayMethodLayer.removeChild(this.paypwdItem);
		this.paypwdItem = null;
		if(this.curPage == this.PAGE_SELECT_BANKCARD)
		{
			this.curPage = 0;
			this.stateSelectPayMethodLayer.removeChild(this.bankCardItem);
			this.bankCardItem = null;
			this.stateSelectPayMethodItem.setDisplay(1);
		}
		
		//加载支付结果等待界面 
		this.payWaitPage = this.stateSelectPayMethodLayer.appendNewChild({css:cssLib["trade_wait"](this, this.payFinishEvent)});
		for(var i = 0; i < 6; i++)
		{
			this.paywaitAni[i] = this.payWaitPage.findItemById("circle" + i);
		}
		this.waitPayResultTip = this.payWaitPage.findItemById("tip");
		this.execPayWaitAnimation();
	};
	
	//获取支付完成结果
	__Page.stateSelectPayMethod.getPayResult = function()
	{
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var customersysno = appEnv.userInfoObj.customersysno;
		var ordersysno = this.vo.ordersysno;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.order.checkpay"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"},  
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno}, 
						{"key":"ordersysno", "value":"" + ordersysno}, 
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);

		appEnv.getFromServerData(this, this.getPayResultCallBack, paramObjs, cipherText);
		appEnv.showLoadingPageSecond(this.stateSelectPayMethodLayer);
	};
	
	//获取支付完成结果的回调函数
	__Page.stateSelectPayMethod.getPayResultCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateSelectPayMethodLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getPayResult();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getPayResult();
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getPayResult();
			return;
		}
		
		if(1 == vo.value)
		{
			this.isInputPayPassword = false;
			var paramObj = {dataObj:this.vo};
			//交易成功后请求一次用户的余额 
			appEnv.getAccountBalanceData();
			appEnv.switchState(this.page.stateBuySuccess, 1, paramObj);
			return;
		}
	
		this.appEnv.form.clearTimeout(this.payWaitAnimationTimer);
		this.payWaitAnimationTimer = null;
		this.waitPayResultTip.setDisplay(0);
		this.stateSelectPayMethodLayer.removeChild(this.payWaitPage);
		this.payWaitPage = null;
		this.stateSelectPayMethodItem.setUIEvent(1);
		this.isInputPayPassword  = false;
		setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtTradeFailedTip2);}, this);
	};
	
	//支付完成事件 
	__Page.stateSelectPayMethod.payFinishEvent = function(msg, extra)
	{
		if(1 == msg)
		{
			this.payWaitPage.setUIEvent(0);
			this.waitPayResultTip.setDisplay(1);
			this.getPayResult();
		}
	};
	
	//执行等待动画事件
	__Page.stateSelectPayMethod.execPayWaitAnimation = function()
	{
		this.payWaitAnimationTimer = this.appEnv.form.setFrameout(3, function(){
			this.paywaitAni[this.nextIndex]._setIcon("roll_select");
			if(this.preIndex > -1)
			{
				this.paywaitAni[this.preIndex]._setIcon("roll_unselect");
			}
			this.preIndex = this.nextIndex;
			this.nextIndex++;
			if(this.nextIndex > 5)
			{
				this.nextIndex = 0;
			}
			this.appEnv.form.clearTimeout(this.payWaitAnimationTimer);
			this.payWaitAnimationTimer = null;
			this.execPayWaitAnimation();
		}, this);
	};
}