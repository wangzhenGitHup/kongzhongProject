/*
	消息界面
*/
if(!__Page.stateMessage)
{
	__Page.stateMessage = {
		page:__Page,
		name:"JGXUI_stateMessage",
		prjFilePath:null,
		messageVoObjs:{List:[], hasnext:false}, //消息对象数组 
		pageno:1, //页码 
		sendcustomersysno:1, //发送人主键 
		messageIdx:0, //消息索引值 
		isRefreshFlag:false, //是否刷新标志 
	};

	__Page.stateMessage.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		
		page.keyStateUtil.call(this);

		this.stateMessageLayer = stateMain.getEditorLayer();

		<include check="0">"ui/state_message_css.js"</include>
		this.stateMessageItem = this.stateMessageLayer.appendNewChild(this.initMessageCSS(appEnv.scrSize[0], appEnv.scrSize[1]));
		this.scrollBoxItem = this.stateMessageItem.findItemById("scrollBox");
		
		this.stateMessageLayer.setUIEvent(1);
	};

	//界面被激活的响应函数:
	__Page.stateMessage.enter = function(preState, vo)
	{
		//TODO:code this:

		DBOut("+++++ stateMessage enter!: " + preState);
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
		this.getMessageList();
	};

	//界面被切走的响应函数:
	__Page.stateMessage.leave = function(nextState)
	{
		//TODO:code this:
		this.clearMessageObj();
		this.stateMessageLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateMessage.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateMessage.onKey = function(msg, key, way, extra)
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
	
	//清除消息对象数组
	__Page.stateMessage.clearMessageObj = function()
	{
		var len = this.messageVoObjs.List.length;
		this.messageVoObjs.hasnext = false; 
		this.messageVoObjs.List.splice(0, len);
		this.isRefreshFlag = false;
		this.pageno = 1;
		this.sendcustomersysno = 1;
		this.messageIdx = 0;
	};
	
	//获取消息列表
	__Page.stateMessage.getMessageList = function()
	{	
		/*
			customersysno	n	客户主键
			pageno	N	页码(取值范围:大于零的整数;)
			pagesize	N	取值范围:大于零的整;最大值:100（建议使用10~20，可以提高成功率，减少超时数量）
		*/
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var pageno = this.pageno;
		var pagesize = 15;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.getmsglist"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"sendcustomersysno", "value":"" + appEnv.userInfoObj.customersysno}, 
						{"key":"pageno", "value":"" + pageno},
						{"key":"pagesize", "value":"" + pagesize}
					];
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.getMessageListCallBack, paramObjs, cipherText);
		appEnv.showLoadingPageSecond(this.stateMessageLayer);
	};
	
	//获取消息列表的回调函数
	__Page.stateMessage.getMessageListCallBack = function(vo, isSuccess)
	{
		/*
			sendcustomersysno	n	客户主键
			qq:客服QQ
			message:消息内容
			indate:回复时间
			flag:1:客服回复，0 代表客户询问
			receivecustomersysno	y	接收人ID
			inuser	y	插入人主键
			inusernme	y	插入人
			msgsysno	y	回复消息主键
			receivecustomersysno	y	接收人主键
			receivename	y	接收人
			sendname	y	发送人
			sysno	y	主键
		*/
	
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateMessageLayer);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.getMessageList();
			}, this);
			return;
		}
		if(vo.Errors.length)
		{
			setTimeout(5, function(){
				appEnv.showNetErrorMessage(vo.Errors);
				this.getMessageList();
			}, this);
			return;
		}
		if(!vo || !vo.msglist)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtNetTip1);
				this.getMessageList();
			}, this);
			return;
		}
		if(!vo.msglist.length)
		{
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtNoHaveBackDataTip);}, this);
			return;
		}
		
		if(this.isRefreshFlag)
		{
			this.messageVoObjs.List.splice(0, this.messageVoObjs.List.length);
		}
		this.messageVoObjs.hasnext = vo.hasnext;
		if(vo.hasnext)
		{
			this.pageno++;
		}
		
		var len = vo.msglist.length;
		for(var i = 0; i < len; i++)
		{
			this.messageVoObjs.List.push(vo.msglist[i]);
		}

		this.initMessageData();
	};
	
	//更新消息列表的状态 
	__Page.stateMessage.updateMessageListStatus = function()
	{	
		/*
			customersysno	n	客户主键
			pageno	N	页码(取值范围:大于零的整数;)
			pagesize	N	取值范围:大于零的整;最大值:100（建议使用10~20，可以提高成功率，减少超时数量）
		*/
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var status = 1;
		var receivecustomersysno = appEnv.userInfoObj.customersysno;
		var sendcustomersysno = this.sendcustomersysno;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.updatemsgstatus"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"receivecustomersysno", "value":"" + receivecustomersysno}, 
						{"key":"sendcustomersysno", "value":"" + sendcustomersysno},
						{"key":"status", "value":"" + status}
					];
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.updateMessageListStatusCallBack, paramObjs, cipherText);
		appEnv.showLoadingPageSecond(this.stateMessageLayer);
	};
	
	// 更新消息列表的状态回调函数
	__Page.stateMessage.updateMessageListStatusCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateMessageLayer);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.updateMessageListStatus();
			}, this);
			return;
		}
		if(vo.Errors.length)
		{
			setTimeout(5, function(){
				appEnv.showNetErrorMessage(vo.Errors);
			}, this);
			return;
		}
		if(!vo)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtNetTip1);
				this.updateMessageListStatus();
			}, this);
			return;
		}
	
		var paramObj = {specialFlag:2, dataObj:this.messageVoObjs.List[this.messageIdx]};
		this.appEnv.switchState(this.page.stateTalk, 1, paramObj);
		/*if(1 == vo.value)
		{
			var paramObj = {specialFlag:0, dataObj:this.messageVoObjs.List[this.messageIdx]};
			this.appEnv.switchState(this.page.stateTalk, 1, paramObj);
			return;
		}
		setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtEnterTalkListTip);}, this);*/
	};
	
	//初始化消息数据  
	__Page.stateMessage.initMessageData = function()
	{
		var appEnv = this.appEnv;
		var len = this.messageVoObjs.List.length;
		var css;
		
		this.isRefreshFlag = false;
		this.scrollBoxItem.clearItems();
		
		for(var i = 0; i < len; i++)
		{
			css = this.loadDetailMessageData(this.messageVoObjs.List[i], i);
			this.scrollBoxItem.insertItem(css);
		}
		if(len == 0)
		{
			return;
		}
		if(!this.messageVoObjs.hasnext)
		{
			return;
		}
		this.scrollBoxItem.insertItem(this.page.loadReFreshModel(this, appEnv.scrSize[0]));
		this.scrollBoxItem.removeChild(this.refreshBarItem);
		this.refreshBarItem = this.scrollBoxItem.findItemById("loadRefreshItem").findItemById("tip");
		this.scrollBoxItem.setTrigger(80, 1);
		this.scrollBoxItem.setTrigger(30, 2);
	};
	
	//上拉刷新事件
	__Page.stateMessage.OnTrigger = function(tag, dit, touch)
	{
		DBOut("======上拉刷新事件======");
		
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
					this.startRefreshMessage();
				}
			}
		}
	};
	
	//开始刷新消息事件
	__Page.stateMessage.startRefreshMessage = function()
	{
		var appEnv = this.appEnv;
		if(this.messageVoObjs.hasnext)
		{
			this.isRefreshFlag = true;
			this.getMessageList();
		}
		else
		{
			this.refreshBarItem._setText(this.appEnv.textLib.txtDataFullTip);
		}
	};
	
	//返回事件 
	__Page.stateMessage.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			stateMain.changeBottomState(1, 2);
			this.appEnv.switchState(page.stateHome, 1, null);
		}
	};
	
	//触发单个消息的事件 
	__Page.stateMessage.onOpenMessageClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("====触发单个消息的事件=====");
			this.sendcustomersysno = this.messageVoObjs.List[btnMsg].sendcustomersysno;
			this.messageIdx = btnMsg;
			this.updateMessageListStatus();
		}
	};
}