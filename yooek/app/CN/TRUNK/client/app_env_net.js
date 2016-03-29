{
	//联网部分 
	__Page.appEnv.getFromServerData = function(cbobj, cb, paramObjs, sign)
	{
		var len = paramObjs.length;
		var sendString = "";
		
		for(var i = 0; i < len; i++)
		{
			if(0 != i)
			{
				sendString += "&";
			}
			if(paramObjs[i]["type"] == "method")
			{
				sendString += "method=" + paramObjs[i]["value"];
			}
			else if(paramObjs[i]["type"] == "version")
			{
				sendString += "version=" + paramObjs[i]["value"];
			}
			else if(paramObjs[i]["type"] == "channel_id")
			{
				sendString += "channel_id=" + paramObjs[i]["value"];
			}
			else if(paramObjs[i]["type"] == "tokenid")
			{
				sendString += "tokenid=" + paramObjs[i]["value"];
			}
			else if(paramObjs[i]["type"] == "format")
			{
				sendString += "format=" + paramObjs[i]["value"];
			}
			else if(paramObjs[i]["type"] == "ifverifytokenid")
			{
				sendString += "ifverifytokenid=" + paramObjs[i]["value"];
			}
			else if(!paramObjs[i]["type"])
			{
				sendString += paramObjs[i]["key"] + "=" + paramObjs[i]["value"];
			}
		}
		sendString += "&sign=" + sign;
		sendString += "&sign_type=md5";
		DBOut("$$$$$$$$$$: " + sendString);
		var url = SeviceURL;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.state = this;
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function(){
			DBOut("responseText:" + xhr.responseText);
			DBOut("xhr.readyState: " + xhr.readyState);
			DBOut("xhr.status :" + xhr.status);
			cb.call(cbobj, fromJSON(xhr.responseText), (4 == xhr.readyState) ? 1 : 0);
		};
		xhr.send(sendString);
	};
	
	//发送验证码接口 
	__Page.appEnv.sendCheckCode = function(phone, customersysno, cbobj, cb)
	{
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		var tokenid = this.userInfoObj.tokenid ? this.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.customer.sendverifycode"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"phone", "value":"" + phone}, 
					];
		if(customersysno)
		{
			paramObjs.push({"key":"customersysno", "value":"" + customersysno});
		}
		plainText = this.getPlainTextMethod(paramObjs);
		ciphertext = this.getCipherTextMethod(plainText);
		this.getFromServerData(cbobj, cb, paramObjs, ciphertext);
	};
	
	//验证验证码是否正确接口
	__Page.appEnv.isCheckVerifycodeRight = function(phone, verifycode, customersysno, cbobj, cb)
	{
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		var tokenid = this.userInfoObj.tokenid ? this.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.customer.checkverifycode"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"phone", "value":"" + phone}, 
						{"key":"verifycode", "value":verifycode},
					];
		if(customersysno)
		{
			paramObjs.push({"key":"customersysno", "value":"" + customersysno});
		}
		
		plainText = this.getPlainTextMethod(paramObjs);
		ciphertext = this.getCipherTextMethod(plainText);
		this.getFromServerData(cbobj, cb, paramObjs, ciphertext);
	};
	
	//更改密码
	__Page.appEnv.sendUpdatePassword = function(oldpwd, newpwd, customersysno, cbobj, cb)
	{
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		oldpwd = this.Base64(oldpwd);
		newpwd = this.Base64(newpwd);
		var tokenid = this.userInfoObj.tokenid ? this.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.customer.updatepwd"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"oldpwd", "value":"" + oldpwd}, 
						{"key":"customersysno", "value":"" + customersysno},
						{"key":"newpwd", "value":"" + newpwd},
					];
					
		plainText = this.getPlainTextMethod(paramObjs);
		ciphertext = this.getCipherTextMethod(plainText);
		
		this.getFromServerData(cbobj, cb, paramObjs, ciphertext);
	};
	
	//找回密码
	__Page.appEnv.sendFindBackPassword = function(phone, newpwd, verifycode, customersysno, cbobj, cb)
	{
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		newpwd = this.Base64(newpwd);
		var tokenid = this.userInfoObj.tokenid ? this.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.customer.resetpwd"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"phone", "value":"" + phone}, 
						{"key":"newpwd", "value":"" + newpwd},
						{"key":"verifycode", "value":"" + verifycode},
						{"key":"customersysno", "value":"" + customersysno}
					];
					
		plainText = this.getPlainTextMethod(paramObjs);
		ciphertext = this.getCipherTextMethod(plainText);
		
		this.getFromServerData(cbobj, cb, paramObjs, ciphertext);
	};
	
	//设置支付密码
	__Page.appEnv.sendSetPayPassword = function(customersysno, paypwd, verifycode, phone, cbobj, cb)
	{
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		paypwd = this.Base64(paypwd);
		var tokenid = this.userInfoObj.tokenid ? this.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.customer.setpaypwd"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno},
						{"key":"paypwd", "value":"" + paypwd}, 
						{"key":"verifycode", "value":verifycode},
						{"key":"phone", "value":"" + phone}
					];
					
		plainText = this.getPlainTextMethod(paramObjs);
		ciphertext = this.getCipherTextMethod(plainText);
		
		this.getFromServerData(cbobj, cb, paramObjs, ciphertext);
	};
	
	//获取用户账号余额
	__Page.appEnv.getAccountBalanceData = function()
	{
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		var phone = this.userInfoObj.phone;
		var customersysno = this.userInfoObj.customersysno;
		var tokenid = this.userInfoObj.tokenid;
		var paramObjs = [{"key":"method", "value":"yooek.customer.getcustomercoin"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"phone", "value":"" + phone}, 
						{"key":"customersysno", "value":"" + customersysno}
					];
					
		plainText = this.getPlainTextMethod(paramObjs);
		ciphertext = this.getCipherTextMethod(plainText);
		
		this.getFromServerData(this, this.getAccountBalanceDataCallBack, paramObjs, ciphertext);
	};
	
	//获取用户账号余额的回调函数
	__Page.appEnv.getAccountBalanceDataCallBack = function(vo, isSuccess)
	{
		/*
			sumcoin	N	总余额
			validcoin	N	冻结余额
			customersysno	N	用户主键
		*/
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			if(Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip))
			{
				this.getAccountBalanceData();
			}
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getVersionInformationData();
			return;
		}
		if(vo.Errors.length)
		{
			this.showNetErrorMessage(vo.Errors);
			return;
		}
		
		this.userInfoObj.sumcoin = vo.sumcoin;
		this.userInfoObj.validcoin = vo.validcoin;
		//this.userInfoObj.customersysno = vo.customersysno;
		//保存
		this.page.setCookie(CookieFlag, userInfoObj, toJSON(this.userInfoObj), 0);
		//读取
		this.userInfoObj = this.page.getCookie(CookieFlag, userInfoObj); 
		this.userInfoObj = fromJSON(this.userInfoObj);
	};
	
	//获取用户信息
	__Page.appEnv.getUserInformationData = function()
	{
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		var phone = this.userInfoObj.phone;
		var customersysno = this.userInfoObj.customersysno;
		var tokenid = this.userInfoObj.tokenid;
		var paramObjs = [{"key":"method", "value":"yooek.customer.getcustomerInfo"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"phone", "value":"" + phone}, 
						{"key":"customersysno", "value":"" + customersysno}
					];
					
		plainText = this.getPlainTextMethod(paramObjs);
		ciphertext = this.getCipherTextMethod(plainText);
		
		this.getFromServerData(this, this.getUserInformationDataCallBack, paramObjs, ciphertext);
	};
	
	//获取用户信息的回调函数
	__Page.appEnv.getUserInformationDataCallBack = function(vo, isSuccess)
	{
		/*
			customersysno	N	用户主键
			customerid	N	登录ID
			phone	Y	绑定手机
			email	Y	邮件
			qq	N	Qq
			buyerlevel	N	买家等级
			sellerlevel	N	卖家等级
			headurl	N	头像URL
			tokenid 
			nickname	Y	昵称
			status	N	状态1：锁定 0 正常
			paypwdstatus	N	支付密码状态
			sumcoin	N	总余额
			validcoin	N	冻结余额
		*/
		var appEnv = this.appEnv;
		if(!isSuccess)
		{
			if(Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip))
			{
				this.getUserInformationData();
			}
			return;
		}
		if(!vo)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getUserInformationData();
			return;
		}
		if(vo.Errors.length)
		{
			this.showNetErrorMessage(vo.Errors);
			return;
		}
	
		this.userInfoObj = vo;
		//保存
		this.page.setCookie(CookieFlag, userInfoObj, toJSON(this.userInfoObj), 0);
		//读取
		this.userInfoObj = this.page.getCookie(CookieFlag, userInfoObj); 
		this.userInfoObj = fromJSON(this.userInfoObj);
	};
	
	//获取推荐游戏的数据
	__Page.appEnv.getRecommendGameListData = function(pageno, cbobj, cb)
	{
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var positionId = 902;
		var pagesize = 15;
		var tokenid = 1;//this.userInfoObj.tokenid ? this.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.recommendgamelist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"positionId", "value":"" + positionId}, 
						{"key":"pageno", "value":"" + pageno},
						{"key":"pagesize", "value":"" + pagesize}
					];

		plainText = this.getPlainTextMethod(paramObjs);
		cipherText = this.getCipherTextMethod(plainText);
		this.getFromServerData(cbobj, cb, paramObjs, cipherText);
	};
	
	//联网等候
	__Page.appEnv.showLoadingPage = function(hud, item)
	{
		var textLib = this.textLib;
		var cssLib = this.page.cssLib;

		if(item)
		{
			item.setDisplay(0);
		}
		return hud.appendNewChild({css:cssLib["textFineBig"](textLib.txtLoadingTip, 1, 1, 1, 1), display:1, flash:2});
	};
	
	//隐藏联网等候界面
	__Page.appEnv.hideLoadingPage = function(layer, hud, item)
	{
		hud.setDisplay(0);
		layer.removeChild(hud);
		hud = null;

		if(item)
		{
			item.setDisplay(1);
		}
	};
	
	//联网报错 
	__Page.appEnv.showNetErrorMessage = function(msg)
	{
		if(msg[0].Code == this.textLib.txtCheckIsLoginTip2)
		{
			Dialogs.alert(this.textLib.txtCheckIsLoginTip3);
			this.page.setCookie(CookieFlag, userInfoObj, toJSON(null), 0);
			this.page.setCookie(CookieFlag, isLogin, toJSON(false), 0);
			jgx.App.switchApp(this.page.genPageURL("main.jml"));
			return;
		}
		var len = msg.length;
		var text = "";
		for(var i = 0; i < len; i++)
		{
			text = text + msg[i].Message;
		}
		Dialogs.alert(text);
	};
	
	//联网加载的第二种形式 
	__Page.appEnv.showLoadingPageSecond = function(hudItem)
	{
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.tipLayerItem.setDisplay(1);
		hudItem.setUIEvent(0);
		this.loadingPageTimeout = this.form.setTimeout(50, function(){
			this.form.clearTimeout(this.loadingPageTimeout);
			this.loadingPageTimeout = null;
			for(var i = 0; i < 8; i++)
			{
				if(i == this.loadingPageIndex)
				{
					stateMain.loadObjs[i]._setIconWH(40, 40);
				}
				else
				{
					stateMain.loadObjs[i]._setIconWH(26, 26);
				}
			}
			this.loadingPageIndex++;
			if(this.loadingPageIndex >= 8)
			{
				this.loadingPageIndex = 0;
			}
			this.showLoadingPageSecond(hudItem);
		}, this);
	};
	
	__Page.appEnv.hideLoadingPageSecond = function(hudItem)
	{
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.tipLayerItem.setDisplay(0);
		this.form.clearTimeout(this.loadingPageTimeout);
		this.loadingPageTimeout = null;
		hudItem.setUIEvent(1);
	};
}
