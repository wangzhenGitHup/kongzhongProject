/*
	登录界面
*/
if(!__Page.stateUserLogin)
{
	__Page.stateUserLogin = {
		page:__Page,
		name:"JGXUI_stateUserLogin",
		prjFilePath:null,
		//isFlagAutoLogin: false,//是否是自动登录状态 
		customerId:"", //登录名文本 
		customerPassword:"", //登录密码文本 
	};

	__Page.stateUserLogin.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		page.keyStateUtil.call(this);

		this.stateUserLoginLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_userlogin_css.js"</include>
		
		this.stateLoginItem = this.stateUserLoginLayer.appendNewChild(this.initLoginCSS(appEnv.scrSize[0], appEnv.scrSize[1]));
		this.loginMainItem = this.stateLoginItem.findItemById("loginItem");
		this.autoLoginKeyObj = this.loginMainItem.findItemById("autoLoginKey");
		this.inputUserIdItem = this.loginMainItem.findItemById("inputBoxBginputUserName");
		this.inputPwdItem = this.loginMainItem.findItemById("inputBoxBginputPwd");
		this.stateUserLoginLayer.setUIEvent(1);
	};

	//界面被激活的响应函数:
	__Page.stateUserLogin.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateUserLogin enter!");
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
	};

	//清除相关数据部分
	__Page.stateUserLogin.clearData = function()
	{
		this.customerId = null;
		this.customerPassword = null;
	};
	
	//界面被切走的响应函数:
	__Page.stateUserLogin.leave = function(nextState)
	{
		//TODO:code this:
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showTopRect();
		stateMain.showBottomRect();
		this.clearData();
		this.stateUserLoginLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateUserLogin.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateUserLogin.onKey = function(msg, key, way, extra)
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
	__Page.stateUserLogin.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
		
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			this.appEnv.switchState(this.page.stateHome, 1, null);
		}
	};
	
	//注册事件 
	__Page.stateUserLogin.onRegisterClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("======注册事件=====");
			this.closeEditHud();
			
			var page = this.page;
			this.appEnv.switchState(page.stateUserRegister, 1, null);
		}
	};
	
	//获取输入框中的文本内容 
	__Page.stateUserLogin.getInputBoxText = function(text, btnMsg)
	{
		DBOut("====获取输入框中的文本内容====");
		//btnMsg = 0:用户名
		//btnMsg = 1:密码
		var appEnv = this.appEnv;
		var textLib = appEnv.textLib;
		if(0 == btnMsg)
		{
			if(!appEnv.warningInputError(text, true))
			{
				return;
			}
			this.customerId = text;
		}
		else if(1 == btnMsg)
		{
			if(!appEnv.warningInputError(text))
			{
				return;
			}
			this.customerPassword = text;
		}
	};

	//登录事件 
	__Page.stateUserLogin.onLoginClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
		
			DBOut("=====登录事件====");
			var appEnv = this.appEnv;
			var textLib = appEnv.textLib;
		
			if(!appEnv.isCheckUserId(this.customerId, true))
			{
				Dialogs.alert(textLib.txtAccountErrorTip2);
				return;
			}
			
			if(!appEnv.isCheckPassword(this.customerPassword, true))
			{
				Dialogs.alert(textLib.txtPasswordErrorTip3);
				return;
			}

			this.loginNetEntrance();
		}
	};
	
	//找回密码事件
	__Page.stateUserLogin.onFindPwdClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====找回密码事件====");
			this.closeEditHud();
			
			var page = this.page;
			var appEnv = this.appEnv;
			appEnv.switchState(page.stateFindPwd, 1, null);
		}
	};
	
	//第三方登录 
	__Page.stateUserLogin.onTheThridLoginMethodClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====第三方登录=====");
			//调用第三方界面
			Dialogs.alert(this.appEnv.textLib.txtNoFunctionTip);
		}
	};
	
	//登录联网入口
	__Page.stateUserLogin.loginNetEntrance = function()
	{
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var customerPassword = appEnv.Base64(this.customerPassword);	
		var paramObjs = [{"key":"method", "value":"yooek.customer.login"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + 1}, 
						{"key":"format", "value":"json"},  
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customerid", "value":"" + this.customerId}, 
						{"key":"pwd", "value":"" + customerPassword}
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.getUserInformation, paramObjs, cipherText);
		appEnv.showLoadingPageSecond(this.stateUserLoginLayer);
	};
	
	//获取用户信息
	__Page.stateUserLogin.getUserInformation = function(vo, isSuccess)
	{
		/*customersysno:用户主键;
		customerid:登录ID
		phone:绑定手机
		email:邮件
		qq:Qq
		buyerlevel:买家等级
		sellerlevel:卖家等级
		headurl:头像URL,我们这边返回全部url，如果有值取该值，为空去客户端默认头像
		nickname:昵称
		status:状态1：锁定 0 正常
		tokenid:会话ID
		paypwdstatus:支付密码状态 1:已经设置支付密码 0 为设置
		sumcoin:总余额
		validcoin:冻结余额*/
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateUserLoginLayer);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.loginNetEntrance();
			}, this);
			return;
		}
		if(vo.Errors.length)
		{
			setTimeout(5, function(){appEnv.showNetErrorMessage(vo.Errors);}, this);
			return;
		}
		if(!vo)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtNetTip1);
				this.loginNetEntrance();
			}, this);
			return;
		}
		
		appEnv.userInfoObj = vo;
		appEnv.isLogin = true;
		var page = this.page;
		page.setCookie(CookieFlag, userInfoObj, toJSON(appEnv.userInfoObj), 0);
		page.setCookie(CookieFlag, isLogin, toJSON(appEnv.isLogin), 0);
		
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.setDisplayPage();
		stateMain.showTopRect();
		stateMain.showBottomRect();
		appEnv.switchState(page.stateHome, 1, null);
	};
	
	//显示输入的字符过长的警示
	__Page.stateUserLogin.editWarning = function()
	{
		var appEnv =  this.appEnv;
		Dialogs.alert(appEnv.textLib.txtStringErrorTip5);
	};
	
	//关闭输入框
	__Page.stateUserLogin.closeEditHud = function()
	{
		this.inputUserIdItem.OnCloseEdit();
		this.inputPwdItem.OnCloseEdit();
	};
}