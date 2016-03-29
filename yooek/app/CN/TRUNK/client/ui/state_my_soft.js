{	
	//============================软件自身部分====================================
	//向服务器提交反馈意见
	__Page.stateMy.submitAdviseToServer = function()
	{
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var customersysno = appEnv.userInfoObj.customersysno;
		var message = this.adviseRestroactionText;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.order.addadvise"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"},
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno},
						{"key":"message", "value":"" + message},
						{"key":"messagetype", "value":"3"}, 
					];

		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.submitAdviseToServerCallBack, paramObjs, cipherText);
		
	};
	
	//提交反馈意见的回调函数
	__Page.stateMy.submitAdviseToServerCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.submitAdviseToServer();
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
			this.submitAdviseToServer();
			return;
		}
		
		if(1 == vo.value)
		{
			Dialogs.alert(appEnv.textLib.txtAdverSuccessTip);
			this.curSubPage = 0;
			this.page.stateMain.showBottomRect();
			this.stateMyLayer.removeChild(this.stateAdviseRetroactionItem);
			this.scrollBox.setDisplay(1);
			this.stateMyTopItem.setDisplay(1);
			return;
		}

		Dialogs.alert(appEnv.textLib.txtAdverFailTip);
	};
	
	//设置用户头像图标 
	__Page.stateMy.onSetUserIcon = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====设置用户头像图标=====");
			var appEnv = this.appEnv;
			Dialogs.alert(appEnv.textLib.txtNoFunctionTip);
		}
	};
	
	//设置用户姓名 
	__Page.stateMy.onSetUserName = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====设置用户姓名====");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_EDITOR_USER_NAME;
			this.stateSetUserName = this.stateMyLayer.appendNewChild(this.loadEditorCustomName(appEnv.scrSize[0],
				appEnv.scrSize[1]));
			this.editorUserNameItem = this.stateSetUserName.findItemById("inputBoxBguserName");
		}
	};
	
	//进入我的账户界面 
	__Page.stateMy.onEnterMyAccount = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("======进入我的账户界面=====");
			var appEnv = this.appEnv;
			if(!appEnv.isLogin)
			{
				this.appEnv.switchState(this.page.stateUserLogin, 1, null);
				return;
			}
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_MY_ACCOUNT;
			
			var areaH = 120 + (appEnv.scaleFactorY - 1) * 15;
			this.stateAccountItem = this.stateMyLayer.appendNewChild(this.loadMyAccountCSS(appEnv.scrSize[0],
				appEnv.scrSize[1] - areaH, appEnv.userInfoObj));
		}
	};
	
	//升级软件事件 
	__Page.stateMy.onUpdateSoftClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====升级软件事件=====");
		}
	};
	
	//打开聊天界面 
	__Page.stateMy.onOpenTalkClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("========打开聊天界面========");
			var appEnv = this.appEnv;
			var paramObj = {specialFlag:1, dataObj:this.goodsInformationObj};
			appEnv.talkPrePageState = appEnv.FROM_ORDER_TO_TALK;
			appEnv.switchState(this.page.stateTalk, 1, paramObj);
		}
	};
	
	//更新登录密码的回调函数
	__Page.stateMy.checkUpdateLoginPasswordCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateMyLayer);
		if(!isSuccess)
		{
			if(Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip))
			{
				appEnv.sendUpdatePassword(this.inputOldLoginPassword, this.loginPassword,
					appEnv.userInfoObj.customersysno, this, this.checkUpdateLoginPasswordCallBack);
			}
			return;
		}
		if(vo.Errors.length)
		{
			setTimeout(5, function(){appEnv.showNetErrorMessage(vo.Errors);}, this);
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			appEnv.sendUpdatePassword(this.inputOldLoginPassword, this.loginPassword, appEnv.userInfoObj.customersysno,
				this, this.checkUpdateLoginPasswordCallBack);
			return;
		}
		
		if(1 == vo.value)
		{
			Dialogs.alert(appEnv.textLib.txtLoginPasswordAlertSuccessTip);
			var page = this.page;
			appEnv.isLogin = false;
			page.setCookie(CookieFlag, isLogin, toJSON(appEnv.isLogin), 0);
			appEnv.switchState(page.stateUserLogin, 1, null);
			return;
		}

		DBOut("更新密码失败");
		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtUpdatePasswordFailedTip);
	};
	
	//更新支付密码的回调函数
	__Page.stateMy.checkUpdatePayPasswordCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			if(Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip))
			{
				appEnv.sendUpdatePassword(this.inputOldPayForPassword, this.payForPassword, appEnv.userInfoObj.customersysno,
					this, this.checkUpdatePayPasswordCallBack);
			}
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.hideLoadingPage(this.stateMyLayer, this.txtLoading, this.stateSetPayPwdItem);
			setTimeout(5, function(){appEnv.showNetErrorMessage(vo.Errors);}, this);
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			appEnv.sendUpdatePassword(this.inputOldPayForPassword, this.payForPassword, appEnv.userInfoObj.customersysno,
				this, this.checkUpdatePayPasswordCallBack);
			return;
		}
		
		if(1 == vo.value)
		{
			var page = this.page;
			var stateMain = page.stateMain;
			this.curSubPage = 0;
			stateMain.showBottomRect();
			this.stateMyLayer.removeChild(this.stateSetPayPwdItem);
			this.scrollBox.setDisplay(1);
			this.stateMyTopItem.setDisplay(1);
			return;
		}

		DBOut("更新密码失败");
		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtUpdatePasswordFailedTip);
	};
		
	//设置支付密码的回调函数
	__Page.stateMy.setPayPasswordCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateMyLayer);
		if(!isSuccess)
		{
			if(Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip))
			{
				appEnv.sendSetPayPassword(appEnv.userInfoObj.customersysno, this.payForPassword, this.inputVerifyCode,
					appEnv.userInfoObj.phone, this, this.setPayPasswordCallBack);
			}
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
			appEnv.sendSetPayPassword(appEnv.userInfoObj.customersysno, this.payForPassword, this.inputVerifyCode,
				appEnv.userInfoObj.phone, this, this.setPayPasswordCallBack);
			return;
		}
		
		if(1 == vo.value)
		{
			Dialogs.alert(appEnv.textLib.txtSubmitTip);
			var page = this.page;
			var appEnv = this.appEnv;
			var textLib = appEnv.textLib;
			var stateMain = page.stateMain;
			this.curSubPage = 0;
			stateMain.showBottomRect();
			this.stateMyLayer.removeChild(this.stateSetPayPwdItem);
			this.stateMyTopItem.setDisplay(1);
			appEnv.userInfoObj.paypwdstatus = 1;
			this.page.setCookie(CookieFlag, userInfoObj, toJSON(appEnv.userInfoObj), 0);
			appEnv.userInfoObj = page.getCookie(CookieFlag, userInfoObj);
			appEnv.userInfoObj = fromJSON(appEnv.userInfoObj);
			
			this.scrollBox.setDisplay(1);
			this.scrollBox.clearItems();
			this.initScrollBoxItem();
			//this.payPasswordItem._setText(textLib.txtAlert);
			return;
		}

		DBOut("设置支付密码错误");
		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtSetPayoutPasswordErrorTip);
	};
	
	//绑定新手机事件
	__Page.stateMy.updateNewPhoneNumber = function()
	{
		/*
			customersysno	N	用户主键
			oldphone	N	老绑定手机
			oldverifycode	N	验证码
			newphone	N	新绑定手机
			newverifycode	N	验证码
		*/
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.customer.updatebindphone"}, 
					{"key":"version", "value":ClientVersion}, 
					{"key":"channel_id", "value":"" + ChannelID}, 
					{"key":"tokenid", "value":"" + tokenid}, 
					{"key":"format", "value":"json"}, 
					{"key":"ifverifytokenid", "value":"true"}, 
					{"key":"customersysno", "value":"" + appEnv.userInfoObj.customersysno},
					{"key":"oldphone", "value":"" + this.oldPhoneNumber},
					{"key":"oldverifycode", "value":this.inputVerifyCode},
					{"key":"newphone", "value":"" + this.newPhoneNumber},
					{"key":"newverifycode", "value":"" + this.bindNewPhoneNumVerifyCode}
				];
					
		plainText = appEnv.getPlainTextMethod(paramObjs);
		ciphertext = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.updateNewPhoneNumberCallBack, paramObjs, ciphertext);
	};		
	
	//绑定新手机的回调函数
	__Page.stateMy.updateNewPhoneNumberCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateMyLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.updateNewPhoneNumber();
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
			this.updateNewPhoneNumber();
			return;
		}
		
		if(1 == vo.value)
		{
			DBOut("绑定新手机成功");
			var page = this.page;
			var stateMain = page.stateMain;
			this.curSubPage = 0;
			stateMain.showBottomRect();
			this.stateMyLayer.removeChild(this.stateNewBindPhoneItem);
			this.scrollBox.setDisplay(1);
			this.stateMyTopItem.setDisplay(1);
			
			appEnv.userInfoObj.phone = this.newPhoneNumber;
			page.setCookie(CookieFlag, userInfoObj, toJSON(appEnv.userInfoObj), 0);
			var phoneNumber = appEnv.changePhoneNumnberToStar(this.newPhoneNumber);
			this.bindPhoneNumberTip._setText(phoneNumber);
			return;
		}

		appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtBindPhoneNumberFailedTip);
	};
	
	//登录事件
	__Page.stateMy.onLoginClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.appEnv.switchState(this.page.stateUserLogin, 1, null);
		}
	};
	
	//退出账号 
	__Page.stateMy.onExitAccountClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("===退出账号====");
			var page = this.page;
			var appEnv =  this.appEnv;
			if(!appEnv.isLogin)
			{
				appEnv.playFadeOutEffect(this.pmtShowItem, this.stateMyLayer, this, appEnv.textLib.txtNotLoginTip);
				return;
			}
			appEnv.isLogin = false;
			this.page.setCookie(CookieFlag, isLogin, toJSON(appEnv.isLogin), 0);
			appEnv.switchState(page.stateHome, 1, null);
		}
	};
	
	//使用帮助 
	__Page.stateMy.onUseHelpClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("===使用帮助====");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_USE_HELP;
			this.stateUseHelpItem = this.stateMyLayer.appendNewChild(this.page.loadUseHelpCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1]));
				
			this.leftBarItem = this.stateUseHelpItem.findItemById("leftBar");
			this.rightBarItem = this.stateUseHelpItem.findItemById("rightBar");
			this.stateSoftHelpItem = this.stateMyLayer.appendNewChild(this.page.loadSoftHelpCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1]));
				
			this.stateCustomHelpItem = this.stateMyLayer.appendNewChild(this.page.loadCustomHelpCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1]));
				
			this.stateCustomHelpItem.setDisplay(0);
			this.openTipOneItem = this.stateCustomHelpItem.findItemById("openTip1");
			this.openTipTwoItem = this.stateCustomHelpItem.findItemById("openTip2");
			this.openTipThreeItem = this.stateCustomHelpItem.findItemById("openTip3");
			
			this.lineOneItem = this.stateCustomHelpItem.findItemById("grayLine1");
			this.lineTwoItem = this.stateCustomHelpItem.findItemById("grayLine2");
			this.lineThreeItem = this.stateCustomHelpItem.findItemById("grayLine3");
			
			this.openTipTxtOneItem = this.stateCustomHelpItem.findItemById("openTipTxt1");
			this.openTipTxtTwoItem = this.stateCustomHelpItem.findItemById("openTipTxt2");
			this.openTipTxtThreeItem = this.stateCustomHelpItem.findItemById("openTipTxt3");
			
			this.openTipDesOneItem = this.stateCustomHelpItem.findItemById("openTipDes1");
			this.openTipDesOneItem.setDisplay(0);
			this.openTipDesTwoItem = this.stateCustomHelpItem.findItemById("openTipDes2");
			this.openTipDesTwoItem.setDisplay(0);
			this.openTipDesThreeItem = this.stateCustomHelpItem.findItemById("openTipDes3");
			this.openTipDesThreeItem.setDisplay(0);
			
			this.lineOneToOneItem = this.stateCustomHelpItem.findItemById("grayLine1-1");
			this.lineOneToOneItem.setDisplay(0);
			this.lineTwoToTwoItem = this.stateCustomHelpItem.findItemById("grayLine2-2");
			this.lineTwoToTwoItem.setDisplay(0);
			this.lineThreeToThreeItem = this.stateCustomHelpItem.findItemById("grayLine3-3");
			this.lineThreeToThreeItem.setDisplay(0);
		}
	};
	
	//意见反馈 
	__Page.stateMy.onAdviseRetroactionClk = function(msg, extra)
	{
		if(1 == msg)
		{
			
			DBOut("=====意见反馈====");
			var page = this.page;
			var appEnv = this.appEnv;
		
			if(!appEnv.isLogin)
			{
				Dialogs.alert(appEnv.textLib.txtPleaseLoginTip);
				return;
			}
			
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_ADVISE_RETROACTION;
			this.stateAdviseRetroactionItem = this.stateMyLayer.appendNewChild(this.page.adviseRetroaction(this,
				appEnv.scrSize[0], appEnv.scrSize[1]));
				
			this.btnOneTxtItem = this.stateAdviseRetroactionItem.findItemById("btn1");
			this.btnTwoTxtItem = this.stateAdviseRetroactionItem.findItemById("btn2");
			this.btnTwoTxtItem.setDisplay(0);
			this.btnThreeTxtItem = this.stateAdviseRetroactionItem.findItemById("btn3");
			this.btnThreeTxtItem.setDisplay(0);
			var bgBox = this.stateAdviseRetroactionItem.findItemById("inputBoxBg");
			this.adviseTextDesItem = bgBox.findItemById("adviseTxt");
			this.adviseEditItem = bgBox.findItemById("inputBoxBgadviseInputFrame");
		}
	};
	
	//联系客服 
	__Page.stateMy.onContactCustomServiceClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====联系客服======");
			var page = this.page;
		}
	};
	
	//关于我们  
	__Page.stateMy.onAboutOurClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====关于我们====");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_ABOUT_OUR;
			this.stateAboutOurItem = this.stateMyLayer.appendNewChild(this.page.loadAboutOurCSS(this, appEnv.scrSize[0],
				appEnv.scrSize[1]));
		}
	};
	
	//客服协议   
	__Page.stateMy.onCustomProtocolClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("======客服协议======");
			var page = this.page;
			var appEnv = this.appEnv;
			var paramObj = {specialFlag:4};
			
			appEnv.switchState(page.stateServiceProtocol, 1, paramObj);
		}
	};
	
	//特别说明    
	__Page.stateMy.onSpecialVersionClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====特别说明=====");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_SPECIAL_DESCRIPTION;
			this.stateSpecialDesItem = this.stateMyLayer.appendNewChild(this.page.loadSpecialDesCSS(this,
				appEnv.scrSize[0], appEnv.scrSize[1]));
			//this.specialDesTxtItem = this.stateSpecialDesItem.findItemById("des");
			//this.specialDesTxtItem.setLine
		}
	};
	
	//设置支付密码 	
	__Page.stateMy.onSetPayPasswordClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====设置支付密码====");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			
			this.curSubPage = this.PAGE_SET_PAYPASSWORD;
			if(appEnv.userInfoObj.paypwdstatus)
			{
				this.curSubPage = this.PAGE_ALERT_PAYPASSWORD;
			}
			
			var phoneNumber = appEnv.userInfoObj.phone;
			this.stateSetPayPwdItem = this.stateMyLayer.appendNewChild(this.setPayPasswordCSS(appEnv.scrSize[0],
				appEnv.scrSize[1], phoneNumber));
				
			this.inputCodeItem = this.stateSetPayPwdItem.findItemById("inputBoxBgcheckCode1");
			this.inputPwdOneItem = this.stateSetPayPwdItem.findItemById("inputBoxBgpwd1");
			this.inputPwdTwoItem = this.stateSetPayPwdItem.findItemById("inputBoxBgpwd2");
		}
	};
	
	//修改登录密码  	
	__Page.stateMy.onAlertLoginPasswordClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("=====修改登录密码=====");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_ALERT_LOGINPASSWORD;
			this.stateAlertLoginPwdItem = this.stateMyLayer.appendNewChild(this.alertLoginPwdCSS(appEnv.scrSize[0],
				appEnv.scrSize[1]));
				
			this.oldPwdInputItem = this.stateAlertLoginPwdItem.findItemById("inputBoxBgoldPwdInput");
			this.newPwdInputItem = this.stateAlertLoginPwdItem.findItemById("inputBoxBgnewPwdInput");
			this.confirmPwdInputItem = this.stateAlertLoginPwdItem.findItemById("inputBoxBgconfirmPwdInput");
		}
	};
	
	//绑定手机 
	__Page.stateMy.onOldBindPhoneClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("======绑定手机=======");
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			stateMain.hideBottomRect();
			this.scrollBox.setDisplay(0);
			this.stateMyTopItem.setDisplay(0);
			this.curSubPage = this.PAGE_OLDBIND_PHONE;
			this.stateOldBindPhoneItem = this.stateMyLayer.appendNewChild(this.oldBindPhoneCSS(appEnv.scrSize[0],
				appEnv.scrSize[1]));
				
			this.oldBindPhoneCodeItem = this.stateOldBindPhoneItem.findItemById("inputBoxBgcheckCode");
		}
	};
	
	//帮助切换事件 
	__Page.stateMy.onHelpKindsClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("======帮助切换事件======: " + btnMsg);
			if(btnMsg == 0 && !this.btnHelpStateOne)
			{
				var page = this.page;
				var cssLib = page.cssLib;
				var leftIcon = "left_select_bar";
				var rightIcon = "right_unselect_bar";
		
				this.btnHelpStateOne = true;
				this.btnHelpStateTwo = false;
				this.leftBarItem._setIcon(leftIcon);
				this.leftBarItem._setTextColor([1, 1, 1, 1]);
				this.rightBarItem._setIcon(rightIcon);
				this.rightBarItem._setTextColor([0, 0.71, 1, 1]);
				this.stateSoftHelpItem.setDisplay(1);
				this.stateCustomHelpItem.setDisplay(0);
				
				this.isOpenCustomHelpOne = false;
				this.openTipOneItem.setDisplay(1);
				this.openTipTxtOneItem.setDisplay(1);
				this.lineOneItem.setDisplay(1);
				this.openTipDesOneItem.setDisplay(0);
				this.openTipOneItem._setIcon("down_close")
				this.lineOneToOneItem.setDisplay(0);
				this.openTipTxtOneItem._setColor([0, 0, 0, 1]);
				
				this.isOpenCustomHelpTwo = false;
				this.openTipTwoItem.setDisplay(1);
				this.openTipTxtTwoItem.setDisplay(1);
				this.lineTwoItem.setDisplay(1);
				this.openTipDesTwoItem.setDisplay(0);
				this.openTipTwoItem._setIcon("down_close")
				this.lineTwoToTwoItem.setDisplay(0);
				this.openTipTxtTwoItem._setColor([0, 0, 0, 1]);
				
				this.isOpenCustomHelpThree = false;
				this.openTipThreeItem.setDisplay(1);
				this.openTipTxtThreeItem.setDisplay(1);
				this.lineThreeItem.setDisplay(1);
				this.openTipDesThreeItem.setDisplay(0);
				this.openTipThreeItem._setIcon("down_close")
				this.lineThreeToThreeItem.setDisplay(0);
				this.openTipTxtThreeItem._setColor([0, 0, 0, 1]);
			}
			
			if(btnMsg == 1 && !this.btnHelpStateTwo)
			{
				var page = this.page;
				var cssLib = page.cssLib;
				var leftIcon = "left_unselect_bar";
				var rightIcon = "right_select_bar";
				
				this.btnHelpStateOne = false;
				this.btnHelpStateTwo = true;
				this.rightBarItem._setIcon(rightIcon);
				this.rightBarItem._setTextColor([1, 1, 1, 1]);
				this.leftBarItem._setIcon(leftIcon);
				this.leftBarItem._setTextColor([0, 0.71, 1, 1]);
				this.stateSoftHelpItem.setDisplay(0);
				this.stateCustomHelpItem.setDisplay(1);
			}
		}
	};
	
	//打开买家帮助界面 
	__Page.stateMy.openCustomHelpPage = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====打开买家帮助界面====");
			if(0 == btnMsg)
			{	
				if(this.isOpenCustomHelpOne)
				{
					this.isOpenCustomHelpOne = false;
					this.openTipOneItem._setIcon("down_close");
					this.openTipDesOneItem.setDisplay(0);
					this.lineOneToOneItem.setDisplay(0);
					this.openTipTxtOneItem._setColor([0, 0, 0, 1]);
					
					this.openTipTwoItem.setDisplay(1);
					this.lineTwoItem.setDisplay(1);
					this.openTipTxtTwoItem.setDisplay(1);
					this.openTipTxtTwoItem._setColor([0, 0, 0, 1]);
					
					this.openTipThreeItem.setDisplay(1);
					this.lineThreeItem.setDisplay(1);
					this.openTipTxtThreeItem.setDisplay(1);
					this.openTipTxtThreeItem._setColor([0, 0, 0, 1]);
					return;
				}
				
				this.isOpenCustomHelpOne = true;
				this.openTipOneItem._setIcon("up_open");
				this.openTipDesOneItem.setDisplay(1);
				this.lineOneToOneItem.setDisplay(1);
				this.openTipTxtOneItem._setColor([0, 0.71, 1, 1]);
				
				this.openTipTwoItem.setDisplay(0);
				this.lineTwoItem.setDisplay(0);
				this.openTipTxtTwoItem.setDisplay(0);
				this.isOpenCustomHelpTwo = false;
				this.lineTwoToTwoItem.setDisplay(0);
				this.openTipDesTwoItem.setDisplay(0);
				this.openTipTwoItem._setIcon("down_close");
				
				this.openTipThreeItem.setDisplay(0);
				this.lineThreeItem.setDisplay(0);
				this.openTipTxtThreeItem.setDisplay(0);
				this.isOpenCustomHelpThree = false;
				this.lineThreeToThreeItem.setDisplay(0);
				this.openTipDesThreeItem.setDisplay(0);
				this.openTipThreeItem._setIcon("down_close");
			}
			else if(1 == btnMsg)
			{	
				if(this.isOpenCustomHelpTwo)
				{
					this.isOpenCustomHelpTwo = false;
					this.openTipTwoItem._setIcon("down_close");
					this.lineTwoToTwoItem.setDisplay(0);
					this.openTipDesTwoItem.setDisplay(0);
					this.openTipTxtTwoItem._setColor([0, 0, 0, 1]);
					
					this.openTipThreeItem.setDisplay(1);
					this.lineThreeItem.setDisplay(1);
					this.openTipTxtThreeItem.setDisplay(1);
					this.openTipTxtThreeItem._setColor([0, 0, 0, 1]);
					return;
				}
				
				this.isOpenCustomHelpTwo = true;
				this.openTipTwoItem._setIcon("up_open");
				this.lineTwoToTwoItem.setDisplay(1);
				this.openTipDesTwoItem.setDisplay(1);
				this.openTipTxtTwoItem._setColor([0, 0.71, 1, 1]);
				
				this.openTipThreeItem.setDisplay(0);
				this.lineThreeItem.setDisplay(0);
				this.openTipTxtThreeItem.setDisplay(0);
				this.isOpenCustomHelpThree = false;
				this.lineThreeToThreeItem.setDisplay(0);
				this.openTipDesThreeItem.setDisplay(0);
				this.openTipThreeItem._setIcon("down_close");
			}
			else if(2 == btnMsg)
			{	
				if(this.isOpenCustomHelpThree)
				{
					this.isOpenCustomHelpThree = false;
					this.openTipThreeItem._setIcon("down_close");
					this.lineThreeToThreeItem.setDisplay(0);
					this.openTipDesThreeItem.setDisplay(0);
					this.openTipTxtThreeItem._setColor([0, 0, 0, 1]);
					return;
				}
				
				this.isOpenCustomHelpThree = true;
				this.openTipThreeItem._setIcon("up_open");
				this.lineThreeToThreeItem.setDisplay(1);
				this.openTipDesThreeItem.setDisplay(1);
				this.openTipTxtThreeItem._setColor([0, 0.71, 1, 1]);
			}
		}
	};
	
	//选择意见反馈类型的下拉按钮 
	__Page.stateMy.onSelectAdviseTypeClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.adviseEditItem.OnCloseEdit();
			
			this.changeAdviseTypeShowMethod();
		}
	};
	
	//改变意见反馈类型的显示方式,就是是展开还是折叠 
	__Page.stateMy.changeAdviseTypeShowMethod = function()
	{
		if(!this.isOpenAdviseType)
		{
			this.btnTwoTxtItem.setDisplay(1);
			this.btnThreeTxtItem.setDisplay(1);
		}
		else
		{
			this.btnTwoTxtItem.setDisplay(0);
			this.btnThreeTxtItem.setDisplay(0);
		}
		this.isOpenAdviseType = this.isOpenAdviseType ? false : true;
	};
	
	//意见反馈类型事件 
	__Page.stateMy.onAdviseRetroactionTypeClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====意见反馈类型事件======");
			this.adviseEditItem.OnCloseEdit();
			
			var selectAdviseTypeText;
			var theFirstShowText;
			this.selectAdviseTypeNum = btnMsg;
			if(0 == btnMsg)
			{
				//selectAdviseTypeText = this.btnOneTxtItem._getText();
			}
			else if(1 == btnMsg)
			{
				theFirstShowText = this.btnOneTxtItem._getText();
				selectAdviseTypeText = this.btnTwoTxtItem._getText();
				this.btnOneTxtItem._setText(selectAdviseTypeText);
				this.btnTwoTxtItem._setText(theFirstShowText);
			}
			else if(2 == btnMsg)
			{
				theFirstShowText = this.btnOneTxtItem._getText();
				selectAdviseTypeText = this.btnThreeTxtItem._getText();
				this.btnOneTxtItem._setText(selectAdviseTypeText);
				this.btnThreeTxtItem._setText(theFirstShowText);
			}
			this.btnTwoTxtItem.setDisplay(0);
			this.btnThreeTxtItem.setDisplay(0);
		}
	};
	
	//意见反馈输入框 
	__Page.stateMy.adviseRestroactionInputFrame = function(txt)
	{
		var len = txt.length > 200 ? 200 : txt.length;

		var limitText = txt.substring(0, len);
		this.adviseRestroactionText = limitText;
		//this.adviseTextDesItem._setText("");
		//this.adviseEditItem.setText("");
		//this.adviseTextDesItem._setText(this.adviseRestroactionText);
		this.adviseTextDesItem._setText("");
		this.adviseEditItem.setText(limitText);
	};
	
	//编辑用户昵称后保存事件 
	__Page.stateMy.onSaveNameClk = function(msg ,extra)
	{
		if(1 == msg)
		{
			DBOut("========编辑用户昵称后保存事件=======");
			this.editorUserNameItem.OnCloseEdit();
			
			var page = this.page;
			var appEnv = this.appEnv;
			var stateMain = page.stateMain;
			
			this.curSubPage = 0;
			stateMain.showBottomRect();
			this.stateMyLayer.removeChild(this.stateSetUserName);
			this.scrollBox.setDisplay(1);
			this.stateMyTopItem.setDisplay(1);
			if(!this.userName)
			{
				return;
			}

			this.alertUserNick();
		}
	};
	
	//更改用户昵称
	__Page.stateMy.alertUserNick = function()
	{
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var pageno = this.pageno;
		var receivecustomersysno = 0;
		var pagesize = 15;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var customersysno = appEnv.userInfoObj.customersysno;
		var paramObjs = [{"key":"method", "value":"yooek.customer.updateusernickname"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno},
						{"key":"nickname", "value":this.userName},
					];
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		appEnv.getFromServerData(this, this.alertUserNickCallBack, paramObjs, cipherText);
		appEnv.showLoadingPageSecond(this.stateMyLayer);
	};
	
	//更改用户昵称的回调函数
	__Page.stateMy.alertUserNickCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateMyLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.alertUserNick();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			return;
		}
		
		if(1 == vo.value)
		{
			this.customNameItem._setText(this.userName);
			var sw = appEnv.scrSize[0];
			var size = appEnv.getTextSize(this.userName, 30, 0, sw);
			this.btnEditorNickNameItem._setPos([190 + size.w, -15, 0]); //设置编辑昵称按钮位置
			this.starBgItem._setPos(size.w); //设置星星位置 
			
			//保存下用户名 
			appEnv.userInfoObj.nickname = this.userName;
			this.page.setCookie(CookieFlag, userInfoObj, toJSON(appEnv.userInfoObj), 0);
			return;
		}
		Dialogs.alert(appEnv.textLib.txtAlertNickFailedTip);
	};
}