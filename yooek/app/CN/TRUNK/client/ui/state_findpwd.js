/*
	找回密码界面
*/
if(!__Page.stateFindPwd)
{
	__Page.stateFindPwd = {
		page:__Page,
		name:"JGXUI_stateFindPwd",
		prjFilePath:null,
		status:0,
		FIRST_PAGE:1,
		SECOND_PAGE:2,
		phoneNumber:null, //手机号
		inputVerifyCode:null, //输入的验证码
		firstPwd:null, //第一次的输入密码
		confirmPwd:null, //确认输入的密码 
	};

	__Page.stateFindPwd.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		this.textLib = appEnv.textLib;
		page.keyStateUtil.call(this);

		this.stateFindPwdLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_findpwd_css.js"</include>
		
		this.stateFindPwdTopItem = this.stateFindPwdLayer.appendNewChild(this.initFindPwdTopCSS(appEnv.scrSize[0],
			appEnv.scrSize[1]));
		this.initFirstPage();
		
		this.stateFindPwdLayer.setUIEvent(1);
	};
	
	//界面被激活的响应函数:
	__Page.stateFindPwd.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateFindPwd enter!");
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
	};

	//清空数据
	__Page.stateFindPwd.clearData = function()
	{
		this.phoneNumber = null;
		this.inputVerifyCode = null;
		this.firstPwd = null;
		this.confirmPwd = null;
	};
	
	//界面被切走的响应函数:
	__Page.stateFindPwd.leave = function(nextState)
	{
		//TODO:code this:
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showTopRect();
		stateMain.showBottomRect();
		this.clearData();
		this.stateFindPwdLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};
	
	__Page.stateFindPwd.onTouch = function(pen, msg, x, y, pass)
	{
		//TODO:
	};
	
	__Page.stateFindPwd.onKey = function(msg, key, way, extra)
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
	
	//初始化初始界面 
	__Page.stateFindPwd.initFirstPage = function()
	{
		var appEnv = this.appEnv; 
		this.stateFindPwdFirstItem = this.stateFindPwdLayer.appendNewChild(this.initFindPwdFirstCSS(appEnv.scrSize[0],
			appEnv.scrSize[1]));
			
		this.inputPhoneItem = this.stateFindPwdFirstItem.findItemById("inputBoxBginputPhone");
		this.status = this.FIRST_PAGE;
	};
	
	//初始化第二界面
	__Page.stateFindPwd.initSecondPage = function()
	{
		var appEnv = this.appEnv; 
		this.stateFindPwdSecondItem = this.stateFindPwdLayer.appendNewChild(this.initFindPwdSecondCSS(appEnv.scrSize[0],
			appEnv.scrSize[1], this.phoneNumber));
		
		this.inputCodeItem = this.stateFindPwdSecondItem.findItemById("inputBoxBgcodeNum");
		this.inputPwdOneItem = this.stateFindPwdSecondItem.findItemById("inputBoxBgpwd1");
		this.inputPwdTwoItem = this.stateFindPwdSecondItem.findItemById("inputBoxBgpwd2");

		this.status = this.SECOND_PAGE;
	};
	
	//返回事件
	__Page.stateFindPwd.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			if(this.status == this.FIRST_PAGE)
			{
				this.inputPhoneItem.OnCloseEdit();
				var page = this.page;
				this.appEnv.switchState(this.page.stateUserLogin, 1, null);
			}
			else
			{
				this.closeEditHud();
				this.stateFindPwdLayer.removeChild(this.stateFindPwdSecondItem);
				this.initFirstPage();
			}
		}
	};
	
	//登录链接网站
	__Page.stateFindPwd.onLoginWebSite = function(msg, extra)
	{
		if(1 == msg)
		{
			this.inputPhoneItem.OnCloseEdit();
			DBOut("======登录链接网站=======");
			jgx.App.shellExec(Website);
		}
	};
	
	//获取输入框中的内容
	__Page.stateFindPwd.getInputBoxContent = function(text, btnMsg)
	{
		DBOut("===获取输入框中的内容====: " + btnMsg);
		//btnMsg = 0:手机号
		//btnMsg = 1:验证码
		//btnMsg = 2:新密码
		//btnMsg = 3:再次输入密码
		var appEnv = this.appEnv;
		switch(btnMsg)
		{
			case 0:
				this.phoneNumber = text;

				break;
			case 1:
				this.inputVerifyCode = text;
				break;
			case 2:
				if(!appEnv.warningInputError(text))
				{
					return;
				}
				this.firstPwd = text;
				break;
			case 3:
				if(!appEnv.warningInputError(text))
				{
					return;
				}
				this.confirmPwd = text;
				break;
		}
	};
	
	//获取验证码事件
	__Page.stateFindPwd.onGetCheckCodeClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====获取验证码事件====");
			this.closeEditHud();
			
			var appEnv = this.appEnv;
			appEnv.sendCheckCode(this.phoneNumber, appEnv.userInfoObj.customersysno, this, this.getCheckCodeCallBack);
			appEnv.showLoadingPageSecond(this.stateFindPwdLayer);
		}
	};
	
	//获取验证码接口的回调函数
	__Page.stateFindPwd.getCheckCodeCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateFindPwdLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			appEnv.sendCheckCode(this.phoneNumber, appEnv.userInfoObj.customersysno, this, this.getCheckCodeCallBack);
			appEnv.showLoadingPageSecond(this.stateFindPwdLayer);
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
			appEnv.sendCheckCode(this.phoneNumber, appEnv.userInfoObj.customersysno, this, this.getCheckCodeCallBack);
			appEnv.showLoadingPageSecond(this.stateFindPwdLayer);
			return;
		}
		
		if(1 == vo.value)
		{
			DBOut("获取验证码发送成功");
			appEnv.playFadeOutEffect(this.pmtShowItem, this.stateFindPwdLayer, this, appEnv.textLib.txtSendVerifyCodeSuccess);
			return;
		}

		DBOut("获取验证码发送失败");
		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateFindPwdLayer, this, appEnv.textLib.txtSendVerifyCodeFailed);
	};
	
	//下一步事件
	__Page.stateFindPwd.onNextStepInClk = function(msg, extra)
	{
		if(1 == msg)
		{	
			this.inputPhoneItem.OnCloseEdit();
			
			var appEnv = this.appEnv;
			DBOut("=====下一步事件====: " + this.phoneNumber);

			if(!this.appEnv.textFilter.checkPhoneNumber(this.phoneNumber))
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateFindPwdLayer, this, appEnv.textLib.txtPhoneNumberErrorTip);
				return;
			}

			this.stateFindPwdLayer.removeChild(this.stateFindPwdFirstItem);
			this.initSecondPage();
		}
	};
	
	//提交修改的新密码
	__Page.stateFindPwd.onSubmitClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====提交修改的新密码====");
			this.closeEditHud();
			
			var appEnv = this.appEnv;

			if(!this.inputVerifyCode || !this.inputVerifyCode.length)
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateFindPwdLayer, this, appEnv.textLib.txtVerifycodeWarningTip);
				return;
			}
			
			if(!appEnv.isCheckPassword(this.firstPwd, true) ||
				!appEnv.isCheckPassword(this.confirmPwd, true))
			{
				Dialogs.alert(appEnv.textLib.txtPasswordErrorTip3);
				return;
			}
			
			if(!appEnv.isCheckAccording(this.firstPwd, this.confirmPwd))
			{
				DBOut("===2次输入的密码不一致====");
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateFindPwdLayer, this, appEnv.textLib.PwdErrorRe);
				return;
			}
			
			this.sendFindPassword();
		}
	};
	
	//发送找回密码的信息
	__Page.stateFindPwd.sendFindPassword = function()
	{
		var appEnv = this.appEnv;
		var customersysno = appEnv.userInfoObj.customersysno ? appEnv.userInfoObj.customersysno : 1;
	
		appEnv.sendFindBackPassword(this.phoneNumber, this.firstPwd, this.inputVerifyCode, 
			customersysno, this, this.sendFindPasswordCallBack);
		appEnv.showLoadingPageSecond(this.stateFindPwdLayer);
	};
	
	//找回密码的回调函数
	__Page.stateFindPwd.sendFindPasswordCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateFindPwdLayer);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.sendFindPassword();
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
				this.sendFindPassword();
			}, this);
			return;
		}
		
		if(1 == vo.value)
		{
			Dialogs.alert(appEnv.textLib.txtAlertPwdSuccessTip);
			appEnv.switchState(this.page.stateUserLogin, 1, null);
			return;
		}
		DBOut("密码修改失败");
		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateFindPwdLayer, this, appEnv.textLib.txtAlertPasswordFailedTip);
	};
	
	//显示输入的字符过长的警示
	__Page.stateFindPwd.editWarning = function()
	{
		var appEnv =  this.appEnv;
		Dialogs.alert(appEnv.textLib.txtStringErrorTip5);
	};
	
	//关闭输入框
	__Page.stateFindPwd.closeEditHud = function()
	{
		this.inputCodeItem.OnCloseEdit();
		this.inputPwdOneItem.OnCloseEdit();
		this.inputPwdTwoItem.OnCloseEdit();
	};
}