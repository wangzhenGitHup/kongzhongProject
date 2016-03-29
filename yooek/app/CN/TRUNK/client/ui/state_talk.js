/*
	聊天界面
*/
if(!__Page.stateTalk)
{
	__Page.stateTalk = {
		page:__Page,
		name:"JGXUI_stateTalk",
		prjFilePath:null,
		talkContent:"",//用户自己输入的聊天内容 
		timer:0, 
		isConnect:false, //是否可以再次联网 
		messageVoObjs:{List:[], hasnext:false}, //消息对象数组 
		whatJump:0, //跳转 
		preMessageListLength:0, //前一个消息列表的长度 
		pageno:1, //页码 
		whatMethod:0, //用于区别查看聊天记录和普通刷新页面数组的插入方式 
		
		PAGE_MAIN:0, //从首页过来的 
		PAGE_GOODS:1, //从商品过来的 
	};

	__Page.stateTalk.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;

		this.appEnv = appEnv;
		this.whatJump = appEnv.stateJumpFlag;
		this.vo = appEnv.stateDataObj;
		
		page.keyStateUtil.call(this);
		
		this.stateTalkLayer = stateMain.getEditorLayer();

		<include check="0">"ui/state_talk_css.js"</include>
		this.stateTalkItem = this.stateTalkLayer.appendNewChild(this.initMessageCSS(appEnv.scrSize[0], appEnv.scrSize[1], this.vo));
		this.scrollBoxItem = this.stateTalkItem.findItemById("scrollBox");
		this.editBoxItem = this.stateTalkItem.findItemById("inputBoxBgtalkinput");
		//this.sendBtnItem = this.stateTalkItem.findItemById("sendBtn");
		
		this.stateTalkLayer.setUIEvent(1);
	};

	//界面被激活的响应函数:
	__Page.stateTalk.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateTalk enter!: " + preState);
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
		
		this.refreshTalkPage();
	};
	
	//界面被切走的响应函数:
	__Page.stateTalk.leave = function(nextState)
	{
		//TODO:code this:
		this.clearMessageObj();
		this.appEnv.form.clearTimeout(this.messageTimerOut);
		this.messageTimerOut = null;
		this.stateTalkLayer.removeAllChild();
		this.stateTalkItem = null;
		this.scrollBoxItem = null;
		this.editBoxItem = null;
		this.sendBtnItem = null;
		this.isConnect = false;
		this.timer = 0;
		this.pageno = 1;
		this.whatMethod = 0;
		this.whatJump = 0;
		this.preMessageListLength = 0;
		this.talkContent = null;
		nextState.init(this.page.appEnv, 1);
	};

	__Page.stateTalk.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateTalk.onKey = function(msg, key, way, extra)
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
	__Page.stateTalk.clearMessageObj = function()
	{
		var len = this.messageVoObjs.List.length;
		this.messageVoObjs.hasnext = false; 
		this.messageVoObjs.List.splice(0, len);
	};
	
	//初始化消息界面
	__Page.stateTalk.initMessageData = function()
	{
		var page = this.page;
		var appEnv = this.appEnv;
		var cssLib = page.cssLib;
		var size;
		var css;
		var objs;
		var len = this.messageVoObjs.List.length;
		//this.scrollBoxItem.clearItems();

		for(var i = this.preMessageListLength; i < len; i++)
		{
			objs = this.messageVoObjs.List[i];
			size = appEnv.getTextSize(objs.message, 24, 1, 200);
			//objs.sendcustomersysno = 1;
			if(objs.sendcustomersysno == appEnv.userInfoObj.customersysno)
			{
				css = {css:cssLib["owner_talk_frame"](size.w + 20, size.h + 20, objs.message)};
			}
			else
			{
				css = {css:cssLib["opponent_talk_frame"](size.w + 20, size.h + 20, objs.message)};
			}
			this.scrollBoxItem.insertItem(css);
		}
		
		this.preMessageListLength = len;
	};
	
	//刷新聊天界面  
	__Page.stateTalk.refreshTalkPage = function()
	{
		this.messageTimerOut = this.appEnv.form.setTimeout(this.timer, function(){
			this.appEnv.form.clearTimeout(this.messageTimerOut);
			this.messageTimerOut = null;
			//清除
			this.clearMessageObj();
			this.getMessageListData();
			this.timer = 5000;
			this.whatMethod = 0;
			this.refreshTalkPage();
		}, this);
	};
	
	//获取消息列表内容
	__Page.stateTalk.getMessageListData = function()
	{
		/*
			customersysno	n	客户主键
			pageno	N	页码(取值范围:大于零的整数;)
			pagesize	N	取值范围:大于零的整;最大值:100（建议使用10~20，可以提高成功率，减少超时数量）
		*/
		if(this.isConnect)
		{
			return;
		}
		var appEnv = this.appEnv;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var pageno = this.pageno;
		var receivecustomersysno = 0;
		var pagesize = 15;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		if(this.PAGE_GOODS == this.whatJump)
		{
			//从订单过来的
			receivecustomersysno = this.vo.sellcustomersysno;
		}
		else
		{
			//从消息列表过来的 
			if(appEnv.userInfoObj.customersysno == this.vo.sendcustomersysno)
			{
				receivecustomersysno = this.vo.receivecustomersysno;
			}
			else
			{
				receivecustomersysno = this.vo.sendcustomersysno;
			}
		}
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.getmsg"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"sendcustomersysno", "value":"" + appEnv.userInfoObj.customersysno}, 
						{"key":"receivecustomersysno", "value":"" + receivecustomersysno}, 
						{"key":"pageno", "value":"" + pageno},
						{"key":"pagesize", "value":"" + pagesize}
					];
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		appEnv.getFromServerData(this, this.getMessageListCallBack, paramObjs, cipherText);
		appEnv.showLoadingPageSecond(this.stateTalkLayer);
	};
	
	//获取消息列表的回调函数
	__Page.stateTalk.getMessageListCallBack = function(vo, isSuccess)
	{
		/*
			sendcustomersysno	n	客户主键
			qq:客服QQ
			msg:消息内容
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
		appEnv.hideLoadingPageSecond(this.stateTalkLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.getMessageListData();
			return;
		}
		if(vo.Errors.length)
		{
			appEnv.showNetErrorMessage(vo.Errors);
			//this.getMessageListData();
			return;
		}
		if(!vo || !vo.msglist)
		{
			Dialogs.alert(appEnv.textLib.txtNetTip1);
			this.getMessageListData();
			return;
		}
		
		var len = vo.msglist.length;
		this.messageVoObjs.hasnext = vo.hasnext;
		
		if(this.whatMethod == 0)
		{
			for(var i = 0; i < len; i++)
			{
				this.messageVoObjs.List.unshift(vo.msglist[i]);
			}
		}
		else
		{
			if(vo.hasnext)
			{
				this.pageno++;
			}
			for(var i = 0; i < len; i++)
			{
				this.messageVoObjs.List.unshift(vo.msglist[i]);
			}
		}
		this.initMessageData();
	};
	
	//返回事件 
	__Page.stateTalk.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			var appEnv = this.appEnv;
			if(appEnv.talkPrePageState == appEnv.FROM_BUYGOODS_TO_TALK)//从购买界面过来的 
			{
				appEnv.talkPrePageState = 0;
				var paramObj = {type:this.type, dataObj:{productsysno:appEnv.productSysno}, name:appEnv.gameName,
					specialFlag:appEnv.stateJumpFlag};
				this.appEnv.switchState(this.page.stateBuyGoods, 1, paramObj);
				return;
			}
			
			if(appEnv.talkPrePageState == appEnv.FROM_ORDER_TO_TALK)//从订单界面过来的 
			{
				var paramObj = {pagestate:1,};
				var page = this.page;
				var stateMain = page.stateMain;
				appEnv.talkPrePageState = 0;
				
				var curObj = stateMain.menuItemObj.findItemById("bottom1");
				curObj.setEnable(1);
				
				var nextObj = stateMain.menuItemObj.findItemById("bottom4");
				nextObj.setEnable(0);
				stateMain.preBtnId = 4;
			
				appEnv.switchState(page.stateMy, 1, paramObj);
				return;
			}
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			this.appEnv.switchState(page.stateMessage, 1, null);
		}
	};
	
	//发送消息事件  
	__Page.stateTalk.onSendMessageClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("===发送消息事件======");
			if(!this.talkContent)
			{
				return;
			}
			this.isConnect = true;
			//this.sendBtnItem.setUIEvent(0);
			this.sendMessageNet();
		}
	};
	
	//发送消息请求
	__Page.stateTalk.sendMessageNet = function()
	{
		var appEnv = this.appEnv;
		var plainText;
		var ciphertext;
		var customersysno = appEnv.userInfoObj.customersysno;
		var receivecustomersysno;
		if(this.PAGE_GOODS == this.whatJump)
		{
			//从订单过来的
			receivecustomersysno = this.vo.sellcustomersysno;
		}
		else
		{
			//从消息列表过来的 
			if(appEnv.userInfoObj.customersysno == this.vo.sendcustomersysno)
			{
				receivecustomersysno = this.vo.receivecustomersysno;
			}
			else
			{
				receivecustomersysno = this.vo.sendcustomersysno;
			}
		}
 
		var msg = this.talkContent;
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.baseinfo.insertmsg"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"},  
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"sendcustomersysno", "value":"" + customersysno}, 
						{"key":"msg", "value":"" + msg},
						{"key":"receivecustomersysno", "value":receivecustomersysno},
					];
		
			plainText = appEnv.getPlainTextMethod(paramObjs);
			ciphertext = appEnv.getCipherTextMethod(plainText);
			appEnv.getFromServerData(this, this.sendMessageNetCallBack, paramObjs, ciphertext);
			appEnv.showLoadingPageSecond(this.stateTalkLayer);
	};
	
	//发送消息请求的回调函数
	__Page.stateTalk.sendMessageNetCallBack = function(vo, isSuccess)
	{
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateTalkLayer);
		if(!isSuccess)
		{
			Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
			this.sendMessageNet();
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
			this.sendMessageNet();
			return;
		}
		
		//this.sendBtnItem.setUIEvent(1);
		if(1 == vo.value)
		{
			/*var page = this.page;
			var cssLib = page.cssLib;
			var text = this.talkContent;
			var size = page.appEnv.getTextSize(text, 24, 1, 200);
			var css = {css:cssLib["owner_talk_frame"](size.w + 20, size.h + 20, text)};
			this.scrollBoxItem.insertItem(css);*/
			this.editBoxItem.setText("");
			this.talkContent = null;
			this.isConnect = false;
			return;
		}
	
		Dialogs.alert("发送失败");
		this.isConnect = false;
	};
	
	//发送商品信息事件  
	__Page.stateTalk.onSendGoodsInfoClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====发送商品信息事件=======");
			var appEnv = this.appEnv;
			var textLib = appEnv.textLib;
			
			this.talkContent = textLib.txtGoodsNameTip + ":" + this.vo.productname + "," + textLib.txtGoodsNumberTip + ":" + this.vo.productid + ","
				+ textLib.txtGoodsPriceTip + ":" + this.vo.rebateprice + ", " + textLib.txtGameServerTip + ":" + this.vo.agentstr + "/" + this.vo.zonestr + "/" + this.vo.serverstr;
			if(!this.talkContent)
			{
				return;
			}
			this.isConnect = true;
			//this.sendBtnItem.setUIEvent(0);
			this.sendMessageNet();
		}
	};
	
	//查看更多的聊天内容
	__Page.stateTalk.onLookMoreTalkContentClk = function(msg, extra)
	{
		if(1 == msg)
		{
			if(!this.messageVoObjs.hasnext)
			{
				var appEnv = this.appEnv;
				Dialogs.alert(appEnv.textLib.txtNoHaveMoreTalkContentTip);
				return;
			}
			this.whatMethod = 1;
			this.getMessageListData();
		}
	};
	
	//获取聊天内容
	__Page.stateTalk.getSendTalkContent = function(txt)
	{
		this.talkContent = txt;
	};
}