/*
	购买成功界面  
*/
if(!__Page.stateBuyGoods)
{
	__Page.stateBuyGoods = {
		page:__Page,
		name:"JGXUI_stateBuyGoods",
		prjFilePath:null,
		goodsNumber:null, //商品编号 
		goodsInformationObj:{}, //商品信息对象 
	};

	__Page.stateBuyGoods.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;
		
		this.appEnv = appEnv;
		this.vo = appEnv.stateDataObj;
		this.type = "" + appEnv.stateType;
		
		page.keyStateUtil.call(this);

		this.stateBuyGoodsLayer =  stateMain.getEditorLayer();
		
		this.stateBuyGoodsLayer.setUIEvent(1);
	};

	//界面被激活的响应函数:
	__Page.stateBuyGoods.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateBuyGoods enter!: " + preState.name);
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		
		this.getGoodsInformation();
	};

	//加载界面
	__Page.stateBuyGoods.loadPage = function()
	{
		<include check="0">"ui/state_buygoods_css.js"</include>
		var appEnv = this.appEnv;
		var areaH = 120 + (appEnv.scaleFactorY - 1) * 15 + 1;
		this.stateBuyGoodsItem = this.stateBuyGoodsLayer.appendNewChild(this.initBuyGoodsCSS(appEnv.scrSize[0],
			appEnv.scrSize[1] - areaH, this.goodsInformationObj));
	};
	
	//界面被切走的响应函数:
	__Page.stateBuyGoods.leave = function(nextState)
	{
		//TODO:code this:
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showTopRect();
		
		this.goodsInformationObj = null;
		this.stateBuyGoodsLayer.removeAllChild();
		nextState.init(page.appEnv);
	};

	__Page.stateBuyGoods.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateBuyGoods.onKey = function(msg, key, way, extra)
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
	
	//获取商品信息
	__Page.stateBuyGoods.getGoodsInformation = function()
	{
		var appEnv = this.appEnv;
		var productsysno = this.vo.productsysno;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		var tokenid = appEnv.userInfoObj.tokenid ? appEnv.userInfoObj.tokenid : 1;
		var paramObjs = [{"key":"method", "value":"yooek.product.searchbyproductid"}, 
						{"key":"version", "value":ClientVersion}, 
						{"key":"channel_id", "value":"" + ChannelID}, 
						{"key":"tokenid", "value":"" + tokenid}, 
						{"key":"format", "value":"json"}, 
						{"key":"ifverifytokenid", "value":"true"}, 
						{"key":"productsysno", "value":"" + productsysno}
					];
		
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideBottomRect();
		this.txtLoading = appEnv.showLoadingPage(this.stateBuyGoodsLayer, null);
		appEnv.getFromServerData(this, this.getGoodsInformationCallBack, paramObjs, cipherText);
	};
	
	//获取商品信息的回调函数
	__Page.stateBuyGoods.getGoodsInformationCallBack = function(vo, isSuccess)
	{
			/*
			productsysno:商品主键
			productid:商品ID
			productname:商品名
			price:商品原价
			sellname:卖家名
			discount:折扣
			rebateprice:优惠价
			ordernumber:销量
			sellflag:卖家类型  1=C2C  2=B2C 3 游易客自营 默认C2C
			selllevelImage:卖家等级
			agentstr:运营商
			zonestr:大区
			description		备注
			note		提示
			categorysysno		商品类型sysno
			categoryname		商品类型
			serverstr	N	服务器
			sellcustomersysno	n	卖家用户主键
		*/
		var appEnv = this.appEnv;
		appEnv.hideLoadingPage(this.stateBuyGoodsLayer, this.txtLoading, null);
		if(!isSuccess)
		{
			setTimeout(5, function(){
				Dialogs.alert(appEnv.textLib.txtConnectNetErrorTip);
				this.getGoodsInformation();
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
				this.getGoodsInformation();
			}, this);
			return;
		}
		
		this.goodsInformationObj = vo;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.showBottomRect();
		this.loadPage();
	};
	
	//复制 
	__Page.stateBuyGoods.onCopyClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			var appEnv = this.appEnv;
			//this.goodsNumber = this.goodsInformationObj.goodsNumber;
			appEnv.playFadeOutEffect(this.pmtShowItem, this.stateBuyGoodsLayer, this, appEnv.textLib.txtCopySuccessTip);
		}
	};
	
	__Page.stateBuyGoods.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			this.appEnv.switchState(page.stateRecharge, 1, null);
		}
	};
	
	//对话   
	__Page.stateBuyGoods.onOpenTalkClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====对话====");
			var appEnv = this.appEnv;
			if(!appEnv.isLogin)
			{
				appEnv.switchState(this.page.stateUserLogin, 1, null);
				return;
			}
			var paramObj = {specialFlag:1, dataObj:this.goodsInformationObj};
			appEnv.productSysno = this.vo.productsysno;
			appEnv.talkPrePageState = appEnv.FROM_BUYGOODS_TO_TALK;
			appEnv.switchState(this.page.stateTalk, 1, paramObj);
		}
	};
	
	//立刻购买
	__Page.stateBuyGoods.onBuyClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("====立刻购买====");
			var appEnv = this.appEnv;
			var page = this.page;
			if(!appEnv.isLogin)
			{
				this.appEnv.switchState(page.stateUserLogin, 1, null);
				return;
			}
			
			//paramObj:{type:界面类型, dataObj:数据对象, name:名称, specialFlag:特定标志},
			var paramObj = {type:this.type, dataObj:this.goodsInformationObj, name:appEnv.gameName};
			appEnv.switchState(page.stateFillOutOrder, 1, paramObj);
		}
	};
}