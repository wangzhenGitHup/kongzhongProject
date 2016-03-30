{
	//开始登陆
	__Page.appEnv.startLogin = function()
	{
		window.AppUdid = (window.PushService && window.PushService.getRemoteToken) ? PushService.getRemoteToken() : "";
		this.version = this.page.getCookie(cookieDomain,"version");
		if(this.version)
		{
			this.version = parseInt(this.version);
		}
		else
		{
			this.version = 1000;//第一次发布时候的jml版本号
		}

		//请求服务器获取文件版本号和底层客户端版本号
		this.getVersionInformationData();
	};
	
	//获取版本升级信息
	__Page.appEnv.getVersionInformationData = function()
	{
		var plainText = ""; //明文
		var ciphertext = ""; //密文
		var tokenid = 1;//this.userInfoObj.tokenid;
		var packageversion = 1;//window.AppVersion + "0000000000000000";//底层版本号
		var packagechannel = ChannelID;
		var fileversion = 1;//this.version;
		
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.checkvesion"}, 
						{"key":"version", "value":"1.0"}, 
						{"key":"channel_id", "value":"2"}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"packageversion", "value":"" + packageversion}, 
						{"key":"packagechannel", "value":"" + packagechannel},
						{"key":"fileversion", "value":"" + fileversion}
					];
					
		plainText = this.getPlainTextMethod(paramObjs);
		ciphertext = this.getCipherTextMethod(plainText);
		this.getFromServerData(this, this.getVersionInformationDataCallBack, paramObjs, ciphertext);
	};
	
	//获取版本升级信息的回调函数
	__Page.appEnv.getVersionInformationDataCallBack = function(vo, isSuccess)
	{
		/*
			relativeurl	n	相对路径
			flag	n	1：非强制更新 2:强制更新，
			currentpackageversion	n	包版本号
			packagechannel	N	包渠道号
			currentfileversion	N	文件版本号
		*/
		var appEnv = this;
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getVersionInformationData();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			this.getVersionInformationData();
			return;
		}
		if(!vo || !vo.filelist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getVersionInformationData();
			return;
		}
		
		if(!vo.filelist.length)
		{
			//Dialogs.alert(appEnv.textLib.txtNoUpdateTip);
			this.startSoft();
			return;
		}
		this.onChargeLogin(vo);
	};
	
	__Page.appEnv.onChargeLogin = function(vo)
	{
		//检测客户端版本是否需要强制升级
		var version = window.AppVersion + "0000000000000000";
		//这块服务器返回的应该是appStore下载地址,用于下载新的软件客户端版本 
		if(vo.filelist[0].maxpackageversion && version < vo.filelist[0].maxpackageversion)
		{
			//强制升级
			if(vo.filelist[0].flag >= 1)
			{
				Dialogs.alert(this.page.STR.VersionLow);
				jgx.App.shellExec(vo.relativeurl);
				return;
			}
			
			//非强制升级
			var choose = Dialogs.prompt(this.page.STR.SuggestUpgrade);
			if(choose)
			{
				jgx.App.shellExec(vo.filelist[0].relativeurl);
				return;
			}
		}
		
		this.onCheckVersion(vo);
	};
	
	//检查文件版本号
	__Page.appEnv.onCheckVersion = function(vo)
	{
		var STR = this.page.STR;
		this.needReload = false;
		vo.coreFiles = []
		this.checkVo = vo;
		this.clearNum = 0;
		
		//调用登录页面，执行登录检查版本号等一系列过程
		//获取需要更新的文件内容 
		this.page.stateLogin.loading(
			{
				preTxt:STR.Cleaning,
				list:vo.filelist[0],
				cb:this.clearCache,
				cbobj:this,
				minpercent:6,
				maxpercent:18
			}
		);
	};

	//删除jml文件
	__Page.appEnv.clearCache = function(jmlURL)
	{
		//需要清除的jml文件
		if(jmlURL)
		{
			//调用系统函数清除指定的jml文件 
			System.clearCache(this.page.genPageURL(jmlURL));
			//查找下清除的jml文件是不是核心文件
			//如果是，则标志下需要重新下载
			//如果不是，那么将此文件名保存到vo的核心文件列表中，在此之前要判断下软件有没有这个文件
			if(this.arrayContains(coreList, jmlURL) >= 0)
			{
				this.needReload = true;
			}
			else
			{
				var index = this.arrayContains(coreList2, jmlURL);
				if(index >= 0)
				{
					this.checkVo.coreFiles[index] = this.page.genPageURL(jmlURL);
				}
			}
			//再次执行清除jml文件
			setTimeout(0, this.page.stateLogin.stepIn, this.page.stateLogin);
		}
		else
		{
			//没有清除的，则将当前的版本号保存下
			if(this.checkVo.filelist[0].maxfileversion > this.version)
			{
				this.page.setCookie(cookieDomain, "version", "" + this.checkVo.filelist[0].maxfileversion, 10000000);
			}
			var i;
			//检查下vo中的核心文件列表中是不是有空的位置，有就去掉空的 
			//这个貌似没用
			for(i = this.checkVo.coreFiles.length - 1; i >= 0; i--)
			{
				if(!this.checkVo.coreFiles[i])
				{
					this.checkVo.coreFiles.splice(i, 1);
				}
			}
			//执行下载新文件过程
			setFrameout(0, this.DownLoadCore, this);
		}
		setFrameout(0, this.DownLoadCore, this);
	};
	
		
	__Page.appEnv.arrayContains = function(array, obj)
	{
		var i;
		for(i = 0;i < array.length; i++)
		{
			if(array[i] == obj)
			{
				return i;
			}
		}
		return -1;
	};
	
	__Page.appEnv.startSoft = function()
	{
		this.switchState(this.page.stateHome, 1, null);
	};
}