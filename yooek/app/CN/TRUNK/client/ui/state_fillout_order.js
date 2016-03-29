/*
	填写提交订单界面 
*/
if(!__Page.stateFillOutOrder)
{
	__Page.stateFillOutOrder = {
		page:__Page,
		name:"JGXUI_stateFillOutOrder",
		prjFilePath:null,
		buyGoodsCount:1, //购买数量
		zoneOrServerName:null, //大区或者服务器名称 
		roleName:null, //角色名称 
		bakRoleName:null, //备份角色名称 
		accountName:null, //账号名称 
		writePwd:null, //填写的密码 
		confirmPwd:null, //再次填写的密码 
		bakInfo:null, //备注信息 
		FIRST_RECHARGE:"10", //首充 
	};

	__Page.stateFillOutOrder.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;
		
		this.type = "" + appEnv.stateType;
		this.vo = appEnv.stateDataObj;
		this.appEnv = appEnv;
		page.keyStateUtil.call(this);

		this.stateFillOutOrderLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_fillout_order_css.js"</include>
		
		if(this.FIRST_RECHARGE == this.type)
		{
			this.stateFillOutOrderItem = this.stateFillOutOrderLayer.appendNewChild(this.loadFirstRechargeCSS(appEnv.scrSize[0],
				appEnv.scrSize[1], this.vo));
				
			this.inputRoleItem = this.stateFillOutOrderItem .findItemById("inputBoxBgroleName");
			this.inputBakRoleItem = this.stateFillOutOrderItem .findItemById("inputBoxBgroleNameBak");
		}
		else
		{
			this.stateFillOutOrderItem = this.stateFillOutOrderLayer.appendNewChild(this.loadOtherRechargeCSS(appEnv.scrSize[0],
				appEnv.scrSize[1], this.vo));
				
			this.inputAccountNameItem = this.stateFillOutOrderItem .findItemById("inputBoxBgaccountName");
			this.inputWritePwdItem = this.stateFillOutOrderItem .findItemById("inputBoxBgwritePwd");
			this.inputConfirmPwdItem = this.stateFillOutOrderItem .findItemById("inputBoxBgconfirmPwd");
			this.inputActorNameItem = this.stateFillOutOrderItem .findItemById("inputBoxBgactorName");
		}
		
		this.inputServerItem = this.stateFillOutOrderItem .findItemById("inputBoxBgserver");
		
		this.bakInfoItem = this.stateFillOutOrderItem.findItemById("inputBoxBgbakInfo");
		//this.bakInfoItem = this.stateFillOutOrderItem.findItemById("bakInfo");
		this.bakInfoFrameItem = this.stateFillOutOrderItem.findItemById("bakInfoFrame");
		
		if(this.type != this.FIRST_RECHARGE)
		{
			this.buyCountItem = this.stateFillOutOrderItem.findItemById("boxFrame").firstChild();
			this.addButtonItem = this.stateFillOutOrderItem.findItemById("add");
			this.subButtonItem = this.stateFillOutOrderItem.findItemById("sub");
			this.totalPriceTextItem = this.stateFillOutOrderItem.findItemById("totalPriceTxt");
		}
		
		this.stateFillOutOrderLayer.setUIEvent(1);
	};

	//界面被激活的响应函数:
	__Page.stateFillOutOrder.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateFillOutOrder enter!: " + preState);
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
		if(this.type != this.FIRST_RECHARGE)
		{
			this.changeAddSubIcon();
		}
	};

	//界面被切走的响应函数:
	__Page.stateFillOutOrder.leave = function(nextState)
	{
		//TODO:code this:
		this.buyGoodsCount = 1;
		this.zoneOrServerName = null;
		this.roleName = null;
		this.bakRoleName = null;
		this.accountName = null;
		this.writePwd = null;
		this.confirmPwd = null;
		this.bakInfo = null;
		this.stateFillOutOrderLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateFillOutOrder.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateFillOutOrder.onKey = function(msg, key, way, extra)
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
	
	__Page.stateFillOutOrder.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
			
			var appEnv = this.appEnv;
			var paramObj = {type:this.type, dataObj:this.vo, name:appEnv.gameName, specialFlag:1};
			this.appEnv.switchState(this.page.stateBuyGoods, 1, paramObj);
		}
	};
	
	//创建订单 
	__Page.stateFillOutOrder.createOrderData = function()
	{
		this.closeEditHud();
		
		var appEnv = this.appEnv;
		var plainText;
		var ciphertext;
		var zonesysno = this.vo.zonesysno;
		var customersysno = appEnv.userInfoObj.customersysno;
		var customernote = this.bakInfo;
		var sellcustomersysno = this.vo.sellcustomersysno;
		var gamesysno = appEnv.gameSysno;
		var serversysno = this.vo.serversysno;
		var orderdetailviewlist = [{productsysno:this.vo.productsysno, quantity:this.buyGoodsCount}];
		orderdetailviewlist = toJSON(orderdetailviewlist);
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.order.createorder"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"customersysno", "value":"" + customersysno}, 
						{"key":"sellcustomersysno", "value":"" + sellcustomersysno}, 
						{"key":"gamesysno", "value":"" + gamesysno}, 
						{"key":"serversysno", "value":"" + serversysno}, 
						{"key":"zonesysno", "value":"" + zonesysno}, 
						{"key":"orderdetailviewlist", "value":orderdetailviewlist},
		];
		
		if(this.FIRST_RECHARGE == this.type)
		{
			var rolename = this.roleName;
			var backuprolename = this.bakRoleName;
			if(rolename && rolename.length > 0)
			{
				paramObjs.push({"key":"rolename", "value":"" + rolename});
			}
			if(customernote && customernote.length > 0)
			{
				paramObjs.push({"key":"customernote", "value":"" + customernote});
			}
			if(backuprolename && backuprolename.length > 0)
			{
				paramObjs.push({"key":"backuprolename", "value":"" + backuprolename});
			}
			/*if(this.zoneOrServerName && this.zoneOrServerName.length > 0)
			{
				paramObjs.push({"key":"backuprolename", "value":"" + backuprolename});
			}*/
		}
		else
		{
			var gameaccount = this.accountName;
			var gamepwd = appEnv.Base64(this.writePwd);
			if(customernote && customernote.length > 0)
			{
				paramObjs.push({"key":"customernote", "value":"" + customernote});
			}
			paramObjs.push({"key":"gameaccount", "value":"" + gameaccount});
			paramObjs.push({"key":"gamepwd", "value":"" + gamepwd});
		}
		plainText = appEnv.getPlainTextMethod(paramObjs);
		ciphertext = appEnv.getCipherTextMethod(plainText);
		appEnv.getFromServerData(this, this.createOrderDataCallBack, paramObjs, ciphertext);
		appEnv.showLoadingPageSecond(this.stateFillOutOrderLayer);
	};
	
	//创建订单的回调函数
	__Page.stateFillOutOrder.createOrderDataCallBack = function(vo, isSuccess)
	{
		//value	N	是否生成订单(1生成成功，0 失败)
		//ordersysno	N	订单编号
		var appEnv = this.appEnv;
		appEnv.hideLoadingPageSecond(this.stateFillOutOrderLayer);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.createOrderData();
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
				this.createOrderData();
			}, this);
			return;
		}

		if(!vo.value)
		{
			setTimeout(5, function(){Dialogs.alert(appEnv.textLib.txtCreateOrderFailedTip);}, this);
			return;
		}
		
		this.vo.buycount = this.buyGoodsCount;
		this.vo.accountname = this.accountName;
		this.vo.ordersysno = vo.ordersysno;
		this.vo.zoneOrServerName = this.zoneOrServerName;
		var paramObj = {type:this.type, dataObj:this.vo, name:appEnv.gameName};
		appEnv.switchState(this.page.stateSelectPayMethod, 1, paramObj);
	};
	
	//提交订单 
	__Page.stateFillOutOrder.onSubmitOrderClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====提交订单====");
			this.closeEditHud();
			
			var appEnv = this.appEnv;
			if(this.vo.stock < this.buyGoodsCount)
			{
				Dialogs.alert(appEnv.textLib.txtBuyGoodsTip3);
				return;
			}
			
			if(this.FIRST_RECHARGE == this.type)
			{
				if(!this.zoneOrServerName || this.zoneOrServerName.length == 0 ||
					!this.roleName || this.roleName.length == 0)
				{
					Dialogs.alert(appEnv.textLib.txtWriteErrorTip);
					return;
				}
		
				//提交给服务器
				this.createOrderData();
			}
			else
			{
				if(!this.zoneOrServerName || this.zoneOrServerName.length == 0 || 
					!this.accountName || this.accountName.length == 0 || 
					!this.writePwd || this.writePwd.length == 0 || 
					!this.confirmPwd || this.confirmPwd.length == 0 ||
					!this.roleName || this.roleName.length == 0)
				{
					Dialogs.alert(appEnv.textLib.txtWriteErrorTip);
					return;
				}
				
				if(!appEnv.isCheckAccording(this.writePwd, this.confirmPwd))
				{
					Dialogs.alert(appEnv.textLib.PwdErrorRe);
					return;
				}

				//提交给服务器
				this.createOrderData();
			}
		}
	};
	
	//输入框 
	__Page.stateFillOutOrder.inputBoxEvent = function(txt, btnMsg)
	{
	//=========首充时
		//type = 0:大区服务
		//type = 1:角色名称
		//type = 2:角色备份名称
		//type = 3:客户填写的建议 

		
	//=========其他
		//type = 0:大区服务
		//type = 1:账号名称
		//type = 2:密码
		//type = 3:密码确认 
		//type = 4:当前钻石余额 
		//type = 5:客户填写的建议 
		
		if(this.FIRST_RECHARGE == this.type)
		{
			switch(btnMsg)
			{
				case 0:
					this.zoneOrServerName = txt;
				break;
				
				case 1:
					this.roleName = txt;
				break;
				
				case 2:
					this.bakRoleName = txt;
				break;
				
				case 3:
					var len = txt.length > 100 ? 100 : txt.length;
					var limitText = txt.substring(0, len);
					this.bakInfo = limitText;
					this.bakInfoFrameItem._setText("");
					//this.bakInfoFrameItem._setText(this.bakInfo);
				break;
			}
		}
		else
		{
			switch(btnMsg)
			{
				case 0:
					this.zoneOrServerName = txt;
				break;
				
				case 1:
					this.accountName = txt;
				break;
				
				case 2:
					this.writePwd = txt;
				break;
				
				case 3:
					this.confirmPwd = txt;
				break;
				
				case 4:
					this.roleName = txt;
				break;
				
				case 5:
					var len = txt.length > 100 ? 100 : txt.length;
					var limitText = txt.substring(0, len);
					this.bakInfo = limitText;
					this.bakInfoFrameItem._setText("");
					//this.bakInfoFrameItem._setText(this.bakInfo);
				break;
			}
		}
	};
	
	//改变加减按钮图标
	__Page.stateFillOutOrder.changeAddSubIcon = function()
	{
		this.closeEditHud();
		
		if(this.buyGoodsCount > 1 && this.buyGoodsCount < 10)
		{
			this.subButtonItem.setEnable(1);
			this.addButtonItem.setEnable(1);
		}
		if(this.buyGoodsCount >= 10)
		{
			this.addButtonItem.setEnable(0);
		}
		if(this.buyGoodsCount <= 1)
		{
			this.subButtonItem.setEnable(0);
			this.addButtonItem.setEnable(1);
		}
	};
	
	//增加购买数量事件 
	__Page.stateFillOutOrder.onAddBuyCountClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
			
			DBOut("=====增加购买数量事件====");
			this.buyGoodsCount += 1;
			if(this.buyGoodsCount > 10)
			{
				this.buyGoodsCount = 10;
			}
			this.changeAddSubIcon();
			this.buyCountItem._setText("" + this.buyGoodsCount);
			this.totalPriceTextItem._setText((this.vo.rebateprice * this.buyGoodsCount) + this.appEnv.textLib.txtYuanTip);
		}
	};
	
	//减少购买数量事件 
	__Page.stateFillOutOrder.onSubBuyCountClk = function(msg, extra)
	{
		if(1 == msg)
		{
			this.closeEditHud();
			
			DBOut("=====减少购买数量事件======");
			this.buyGoodsCount -= 1;
			if(this.buyGoodsCount <= 1)
			{
				this.buyGoodsCount = 1;
			}
			this.changeAddSubIcon();
			this.buyCountItem._setText("" + this.buyGoodsCount);
			this.totalPriceTextItem._setText((this.vo.rebateprice * this.buyGoodsCount) + this.appEnv.textLib.txtYuanTip);
		}
	};
	
	//关闭输入框
	__Page.stateFillOutOrder.closeEditHud = function()
	{
		//关闭对话框 
		if(this.FIRST_RECHARGE == this.type)
		{
			this.inputRoleItem.OnCloseEdit();
			this.inputBakRoleItem.OnCloseEdit();
		}
		else
		{
			this.inputAccountNameItem.OnCloseEdit();
			this.inputWritePwdItem.OnCloseEdit();
			this.inputConfirmPwdItem.OnCloseEdit();
			this.inputActorNameItem.OnCloseEdit();
		}
		this.inputServerItem.OnCloseEdit();
		this.bakInfoItem.OnCloseEdit();
	};
}