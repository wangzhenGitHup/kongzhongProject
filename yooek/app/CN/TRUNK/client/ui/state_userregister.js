/*
	注册界面
*/
if(!__Page.stateUserRegister)
{
	__Page.stateUserRegister = {
		page:__Page,
		name:"JGXUI_stateUserRegister",
		prjFilePath:null,
		status:1,//处于什么状态
		REGISTER_STATE:1,//注册状态 
		WRITE_REGISTER_INFO_STATE:2,//填写注册信息的状态 
		phoneNumber:"", //注册的手机号
		customerId:"", //注册的登录名
		customerPassword:"",	//注册登录的密码
		confirmLoginPassword:"-", //确认登录密码
		inputVerifyCode:"", //输入的验证码 
	};

	__Page.stateUserRegister.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;
		
		this.textLib = appEnv.textLib;
		this.appEnv = appEnv;
		page.keyStateUtil.call(this);

		this.stateRegisterLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_userregister_css.js"</include>
		
		this.stateRegisterTopItem = this.stateRegisterLayer.appendNewChild(this.initRegisterTopCSS(appEnv.scrSize[0],
			appEnv.scrSize[1]));
		this.initRegister();
		
		this.stateRegisterLayer.setUIEvent(1);
	};

	__Page.stateUserRegister.initRegister = function()
	{
		var appEnv = this.appEnv; 
		this.status = this.REGISTER_STATE;
		this.stateRegisterLayerItem = this.stateRegisterLayer.appendNewChild(this.initRegisterCSS(appEnv.scrSize[0],
			appEnv.scrSize[1]));
			
		this.registerPhoneNumberItem = this.stateRegisterLayerItem.findItemById("inputBoxBgregisterPhoneNum");
		this.registerLoginNameItem = this.stateRegisterLayerItem.findItemById("inputBoxBgregisterLoginName");
		this.registerLoginPwdItem = this.stateRegisterLayerItem.findItemById("inputBoxBgregisterLoginPwd");
		this.registerConfirmLoginPwdItem = this.stateRegisterLayerItem.findItemById("inputBoxBgregisterConfirmLoginPwd");
		this.registerCodeNumberItem = this.stateRegisterLayerItem.findItemById("inputBoxBgcodeNum");
	};
	
	//界面被激活的响应函数:
	__Page.stateUserRegister.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateUserRegister enter!");
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
	};

	//清除相关数据部分
	__Page.stateUserRegister.clearData = function()
	{
		this.phoneNumber = null;
		this.customerId = null;
		this.customerPassword = null;
		this.confirmLoginPassword = null;
		this.inputVerifyCode = null;
	};
	
	//界面被切走的响应函数:
	__Page.stateUserRegister.leave = function(nextState)
	{
		//TODO:code this:
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showTopRect();
		stateMain.showBottomRect();
		
		this.clearData();
		this.stateRegisterLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateUserRegister.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateUserRegister.onKey = function(msg, key, way, extra)
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
	
	//返回事件
	__Page.stateUserRegister.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
		
			if(this.status == this.REGISTER_STATE)
			{
				this.appEnv.switchState(this.page.stateUserLogin, 1, null);
			}
			else
			{
				this.stateRegisterLayer.removeChild(this.stateRegisterInfoItem);
				this.initRegister();
			}
		}
	};
	
	//获取输入框中的文本内容
	__Page.stateUserRegister.getInputBoxContent = function(text, btnMsg)
	{
		DBOut("=====获取输入框中的文本内容===: " + text);
		//btnMsg = 0:手机号
		//btnMsg = 1:验证码
		//btnMsg = 2:登录名
		//btnMsg = 3:登录密码
		//btnMsg = 4:再次输入的登录密码
		var appEnv = this.appEnv;
		switch(btnMsg)
		{
			case 0:
				this.phoneNumber = "" + text;
			break;
				
			case 1:
				this.inputVerifyCode = "" + text;
			break;
				
			case 2:
				if(!appEnv.warningInputError(text, true))
				{
					return;
				}
				this.customerId = "" + text;
			break;
				
			case 3:
				if(!appEnv.warningInputError(text))
				{
					return;
				}
				this.customerPassword = "" + text;
			break;
				
			case 4:
				if(!appEnv.warningInputError(text))
				{
					return;
				}
				this.confirmLoginPassword = "" + text;
			break;
		}
	};
	
	//获取验证码事件
	__Page.stateUserRegister.onGetCheckCodeClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("======获取验证码事件======");
			this.closeEditHud();
			
			var appEnv = this.appEnv;
			if(!this.phoneNumber || !this.phoneNumber.length)
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateRegisterLayer, this, appEnv.textLib.txtPhoneNumberIsNullTip);
				return;
			}
			appEnv.sendCheckCode(this.phoneNumber, null, this, this.getCheckCodeCallBack);
			appEnv.showLoadingPageSecond(this.stateRegisterLayer);
		}
	};
	
	//获取验证码接口的回调函数
	__Page.stateUserRegister.getCheckCodeCallBack = function(vo)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateRegisterLayer);
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			appEnv.sendCheckCode(this.phoneNumber, null, this, this.getCheckCodeCallBack);
			appEnv.showLoadingPageSecond(this.stateRegisterLayer);
			return;
		}
		
		if(1 == vo.value)
		{
			appEnv.playFadeOutEffect(this.pmtShowItem, this.stateRegisterLayer, this, appEnv.textLib.txtSendVerifyCodeSuccess);
			return;
		}

		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateRegisterLayer, this, appEnv.textLib.txtSendVerifyCodeFailed);
	};
	
	//注册事件
	__Page.stateUserRegister.onRegisterClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("======注册事件=======");
			this.closeEditHud();
			
			var appEnv = this.appEnv;
	
			if(!appEnv.textFilter.checkPhoneNumber(this.phoneNumber))
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateRegisterLayer, this, appEnv.textLib.txtPhoneNumberErrorTip);
				return;
			}
			
			if(!appEnv.isCheckUserId(this.customerId, true))
			{
				Dialogs.alert(appEnv.textLib.txtAccountErrorTip2);
				return;
			}
	
			if(!appEnv.isCheckPassword(this.customerPassword, true) ||
				!appEnv.isCheckPassword(this.confirmLoginPassword, true))
			{
				Dialogs.alert(appEnv.textLib.txtPasswordErrorTip3);
				return;
			}
			
			if(!appEnv.isCheckAccording(this.customerPassword, this.confirmLoginPassword))
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateRegisterLayer, this, appEnv.textLib.PwdErrorRe);
				return;
			}
			this.checkVerifyCodeIsRight();
		}
	};

	//注册事件的回调函数
	__Page.stateUserRegister.onRegisterCallBack = function(vo, isSuccess)
	{
		/*
			customersysno:用户主键
			customerid:登录ID
			phone:绑定手机
			email:邮件
			qq:qq
			buyerlevel:买家等级
			sellerLevel:卖家等级
			headurl:头像URL
			nickname:昵称,
			status:状态1：锁定 0 正常
			tokenid:会话ID
			paypwdstatus:支付密码状态 1:已经设置支付密码 0 为设置
			sumcoin:总余额
			validcoin:冻结余额
		*/
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateRegisterLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.checkVerifyCodeIsRight();
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
			this.checkVerifyCodeIsRight();
			return;
		}
		
		appEnv.userInfoObj = vo;
		this.page.setCookie(CookieFlag, userInfoObj, toJSON(appEnv.userInfoObj), 0);
		
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.setDisplayPage();
		stateMain.showTopRect();
		stateMain.showBottomRect();
		appEnv.switchState(page.stateUserLogin, 1, null);
	};
	
	//验证验证码是否正确
	__Page.stateUserRegister.checkVerifyCodeIsRight = function()
	{
		var appEnv = this.appEnv;
		appEnv.isCheckVerifycodeRight(this.phoneNumber, this.inputVerifyCode, null, this, this.checkVerifyCodeIsRightCallBack);
		appEnv.showLoadingPageSecond(this.stateRegisterLayer);
	};
	
	//验证验证码是否正确的回调函数
	__Page.stateUserRegister.checkVerifyCodeIsRightCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateRegisterLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.checkVerifyCodeIsRight();
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
			this.checkVerifyCodeIsRight();
			return;
		}
		
		if(1 == vo.value)
		{
			DBOut("验证码正确");
			var plainText = ""; //明文
			var ciphertext = ""; //密文
			var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
			var customerPassword = appEnv.Base64(this.customerPassword);
			var paramObjs = [{"key":"method", "value":"yooek.customer.register"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"},  
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"phone", "value":this.phoneNumber}, 
						{"key":"customerid", "value":this.customerId},
						{"key":"pwd", "value":customerPassword},
						{"key":"verifycode", "value":this.inputVerifyCode},
						//{"key":"spreadnum", "value":"" + 4654},
					];
					
			plainText = appEnv.getPlainTextMethod(paramObjs);
			ciphertext = appEnv.getCipherTextMethod(plainText);
			appEnv.getFromServerData(this, this.onRegisterCallBack, paramObjs, ciphertext);
			appEnv.showLoadingPageSecond(this.stateRegisterLayer);
			return;
		}
		
		DBOut("验证码错误");
		appEnv.hideLoadingPageSecond(this.stateRegisterLayer);
		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateRegisterLayer, this, appEnv.textLib.txtVerifyCodeErrorTip);
	};
	
	//进入到服务协议 
	__Page.stateUserRegister.onEnterServiceProtocal = function(msg, extra)
	{
		if(1 == msg)
		{
			var page = this.page;
			var appEnv = this.appEnv;
			var paramObj = {specialFlag:3};
			appEnv.switchState(page.stateServiceProtocol, 1, paramObj);
		}
	};
	
	//显示输入的字符过长的警示
	__Page.stateUserRegister.editWarning = function()
	{
		var appEnv =  this.appEnv;
		Dialogs.alert(appEnv.textLib.txtStringErrorTip5);
	};
	
	//关闭输入框
	__Page.stateUserRegister.closeEditHud = function()
	{
		this.registerPhoneNumberItem.OnCloseEdit();
		this.registerLoginNameItem.OnCloseEdit();
		this.registerLoginPwdItem.OnCloseEdit();
		this.registerConfirmLoginPwdItem.OnCloseEdit();
		this.registerCodeNumberItem.OnCloseEdit();
	};
}