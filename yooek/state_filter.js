/*
	筛选界面 
*/
if(!__Page.stateFilter)
{
	__Page.stateFilter = {
		page:__Page,
		name:"JGXUI_stateFilter",
		prjFilePath:null,
		btnLeftState:true,
		btnRightState:false,
		scrollBoxSubItem:[],
		labelType:0, //标签类型  
		selectPrice:-1, //所选择的价格 
		selectBusiness:"", //所选择的运营商 
		goodsPriceObjs:{pricelist:[], hasnext:false}, //商品价格对象数组 
		goodsBusinessObjs:{agentlist:[], hasnext:false}, //运营商对象数组
	};

	__Page.stateFilter.init = function(appEnv)
	{
		var page = this.page;
		var cssLib = page.cssLib;
		var stateMain = page.stateMain;
		this.type = appEnv.stateType;
		this.appEnv = appEnv;
		page.keyStateUtil.call(this);
		
		this.stateFilterLayer =  stateMain.getEditorLayer();

		<include check="0">"ui/state_filter_css.js"</include>
		//if(0 == type)//首充 
		//else if(1 == type)//首充续充 
		//else if(2 == type)//QQ 
		//else if(3 == type)//苹果代充 
		if(0 == this.type)
		{
			this.labelType = 0;
		}
		else
		{
			this.labelType = 1;
		}
		this.stateFilterItem = this.stateFilterLayer.appendNewChild(this.loadFilterCSS(appEnv.scrSize[0], appEnv.scrSize[1], this.type));
		var item = this.stateFilterItem.findItemById("loadFilterItem");
		this.scrollBoxItem = item.findItemById("scrollBox");
		
		this.stateFilterLayer.setUIEvent(1);
	};

	//界面被激活的响应函数:
	__Page.stateFilter.enter = function(preState)
	{
		//TODO:code this:
		DBOut("+++++ stateUserLogin enter!: " + preState.name);
		this.preState = preState;
		var appEnv = this.appEnv;
		var page = this.page;
		var stateMain = page.stateMain;
		stateMain.hideTopRect();
		stateMain.hideBottomRect();
	
		this.selectScrollBoxItem = this.stateFilterItem.findItemById("scrollBox");
		if(this.type == 0)
		{
			this.leftBarItem = this.stateFilterItem.findItemById("leftBar");
			this.rightBarItem = this.stateFilterItem.findItemById("rightBar");
			this.getBusinessData();
		}
		else
		{
			this.getGoodsPriceInformation();
		}
	};

	//界面被切走的响应函数:
	__Page.stateFilter.leave = function(nextState)
	{
		//TODO:code this:
		var len1 = this.scrollBoxSubItem.length;
		this.scrollBoxSubItem.splice(0, len1);
		this.clearListObj();
		this.stateFilterLayer.removeAllChild();
		nextState.init(this.page.appEnv);
	};

	__Page.stateFilter.onTouch = function(pen, msg, x, y, pass)
	{
		var downObj;
	};

	__Page.stateFilter.onKey = function(msg, key, way, extra)
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
	
	//获取商品价格信息
	__Page.stateFilter.getGoodsPriceInformation = function()
	{
		var appEnv = this.appEnv;
		var gamesysno = appEnv.gameSysno;
		var pageNo = 1;
		var pageSize = 10;
		var pageno = 1;
		var pageSize = 10;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		
		var paramObjs = [{"type":"method", "key":"yooek.product.searchpricelist", "value":null}, 
						{"type":"version", "key":"1.0", "value":null}, 
						{"type":"channel_id", "key":"2", "value":null}, 
						{"type":"tokenid", "key":"1007", "value":null}, 
						{"type":"format", "key":"json", "value":null}, 
						{"type":null, "key":"pageSize", "value":"" + pageSize},
						{"type":null, "key":"pageno", "value":"" + pageno},
						{"type":null, "key":"gamesysno", "value":"" + gamesysno}
					];
					
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		this.txtLoadingPrice = appEnv.showLoadingPage(this.stateFilterLayer, this.stateFilterItem);
		appEnv.getFromServerData(null,  this, this.getGoodsPriceInformationCallBack, paramObjs, cipherText);
	};
	
	//获取商品价格的回调函数
	__Page.stateFilter.getGoodsPriceInformationCallBack = function(vo)
	{
		var vo = {pricelist:[6, 16, 26, 36, 46, 56, 66, 76, 86], hasnext:false};
		this.goodsPriceObjs.hasnext = vo.hasnext;
		var len = vo.pricelist.length;
		var len1 = this.goodsPriceObjs.pricelist.length;
		this.goodsPriceObjs.pricelist.splice(0, len1);
		
		for(var i = 0; i < len; i++)
		{
			this.goodsPriceObjs.pricelist.push(vo.pricelist[i]);
		}
		this.appEnv.hideLoadingPage(this.stateFilterLayer, this.txtLoadingPrice, this.stateFilterItem);
		this.initFirstRechargeData();
	};
	
	//初始化首充金额数据
	__Page.stateFilter.initFirstRechargeData = function()
	{
		var appEnv = this.appEnv;
		var sw = appEnv.scrSize[0];
		var page = this.page;
		var cssLib = page.cssLib;
		var textLib = appEnv.textLib;
		var len = this.goodsPriceObjs.pricelist.length;
		var css = [];
		for(var i = 0; i < len; i++)
		{
			css[i] = this.loadDataCSS(this.goodsPriceObjs.pricelist[i] + textLib.txtYuanTip, i);
		}
		this.scrollBoxItem.insertItems(css);

		this.scrollBoxSubItem.splice(0, this.scrollBoxSubItem.length);
		for(var i = 0; i < len; i++)
		{
			this.scrollBoxSubItem[i] = this.scrollBoxItem.findItemById("selectFlag" + i);
		}
	};

	//获取运营商数据信息
	__Page.stateFilter.getBusinessData = function()
	{
		var appEnv = this.appEnv;
		var pageno = 1;
		var pageSize = 10;
		var plainText = ""; //明文
		var cipherText = ""; //密文
		
		var paramObjs = [{"type":"method", "key":"yooek.baseinfo.searchagentlist", "value":null}, 
						{"type":"version", "key":"1.0", "value":null}, 
						{"type":"channel_id", "key":"2", "value":null}, 
						{"type":"tokenid", "key":"1007", "value":null}, 
						{"type":"format", "key":"json", "value":null}, 
						{"type":null, "key":"pageSize", "value":"" + 10},
						{"type":null, "key":"pageno", "value":"" + 1}
					];
					
		plainText = appEnv.getPlainTextMethod(paramObjs);
		cipherText = appEnv.getCipherTextMethod(plainText);
		
		this.txtLoadingBusiness = appEnv.showLoadingPage(this.stateFilterLayer, this.stateFilterItem);
		appEnv.getFromServerData(null, this, this.getBusinessDataCallBack, paramObjs, cipherText);
	};
	
	//获取运营商数据的回调函数
	__Page.stateFilter.getBusinessDataCallBack = function(vo)
	{
		//agentlist[]:运营商列表
		//hasnext:是否存在下一页(是否存在下一页；true为存在下一页)
		
		/*
			agentsyno:运营商主键
			agentname:运营商名字
			priority:等级，数值越高级别越大
		*/
		var vo = {agentlist:[{agentsyno:1000, agentname:"九游", priority:9}, 
							{agentsyno:10001, agentname:"360", priority:8}, 
							{agentsyno:10002, agentname:"当乐", priority:7}, 
							{agentsynoc:10003, agentname:"豌豆荚", priority:5}, 
							{agentsyno:10004, agentname:"91安卓", priority:4}, 
							{agentsyno:10005, agentname:"91越狱", priority:3}, 
							{agentsyno:10006, agentname:"腾讯", priority:2}, 
							{agentsyno:10007, agentname:"中国移动", priority:1}, 
							{agentsyno:10008, agentname:"91助手", priority:1}
						], 
			hasnext:false};
		var len = vo.agentlist.length;
		this.goodsBusinessObjs.hasnext = vo.hasnext;
		var len1 = this.goodsBusinessObjs.agentlist.length;
		this.goodsBusinessObjs.agentlist.splice(0, len1);
		
		for(var i = 0; i < len; i++)
		{
			this.goodsBusinessObjs.agentlist.push(vo.agentlist[i]);
		}
		this.appEnv.hideLoadingPage(this.stateFilterLayer, this.txtLoadingBusiness, this.stateFilterItem);
		this.initBusinessData();
	};
	
	//初始化运营商的数据
	__Page.stateFilter.initBusinessData = function()
	{
		var appEnv = this.appEnv;
		var sw = appEnv.scrSize[0];
		var page = this.page;
		var cssLib = page.cssLib;

		var len = this.goodsBusinessObjs.agentlist.length;
		var css = [];
		for(var i = 0; i < len; i++)
		{
			css[i] = this.loadDataCSS(this.goodsBusinessObjs.agentlist[i].agentname, i);
		}
		this.scrollBoxItem.insertItems(css);

		this.scrollBoxSubItem.splice(0, this.scrollBoxSubItem.length);
		for(var i = 0; i < len; i++)
		{
			this.scrollBoxSubItem[i] = this.scrollBoxItem.findItemById("selectFlag" + i);
		}
	};
	
	//清除对象数组
	__Page.stateFilter.clearListObj = function()
	{
		var len2 = this.goodsBusinessObjs.agentlist.length;
		this.goodsBusinessObjs.agentlist.splice(0, len2);
		this.goodsBusinessObjs.hasnext = false;
		
		var len3 = this.goodsPriceObjs.pricelist.length;
		this.goodsPriceObjs.pricelist.splice(0, len3);
		this.goodsPriceObjs.hasnext = false;
	};
	
	//返回事件
	__Page.stateFilter.onBackClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("===============onBackClk==================");
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			this.appEnv.switchState(page.stateRecharge, 1, null);
		}
	};
	
	//确定筛选的具体内容 
	__Page.stateFilter.onConfirmFilterClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("===========确定筛选的具体内容=================");
			/*for(var i = 0; i < 9; i++)
			{
				if(btnMsg == i)
				{
					this.scrollBoxSubItem[i].setDisplay(1);
				}
				else
				{
					this.scrollBoxSubItem[i].setDisplay(0);
				}
			}*/

			if(0 == this.labelType)//运营商
			{
				var len = this.goodsBusinessObjs.agentlist.length;
				for(var i = 0; i < len; i++)
				{
					if(btnMsg == i)
					{
						this.scrollBoxSubItem[i].setDisplay(1);
					}
					else
					{
						this.scrollBoxSubItem[i].setDisplay(0);
					}
				}
				this.selectBusiness = this.goodsBusinessObjs.agentlist[btnMsg].agentname;
			}
			else//价格
			{
				var len = this.goodsPriceObjs.pricelist.length;
				for(var i = 0; i < len; i++)
				{
					if(btnMsg == i)
					{
						this.scrollBoxSubItem[i].setDisplay(1);
					}
					else
					{
						this.scrollBoxSubItem[i].setDisplay(0);
					}
				}
				this.selectPrice = this.goodsPriceObjs.pricelist[btnMsg];
			}
		}
	};
	
	//取消筛选 
	__Page.stateFilter.onCancel = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("============取消筛选===================");
			var page = this.page;
			var stateMain = page.stateMain;
			stateMain.showTopRect();
			stateMain.showBottomRect();
			this.appEnv.switchState(page.stateRecharge, 1, null);
		}
	};
	
	//打开不同类型的标签 
	__Page.stateFilter.onOpenLabelTypeClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("============打开不同类型的标签===================");
			//btnMsg = 0:运营商
			//btnMsg = 1:首充金额
			var page = this.page;
			var cssLib = page.cssLib;
			
			if(0 == btnMsg && !this.btnLeftState)
			{
				var leftIcon = "left_select_bar";
				var rightIcon = "right_unselect_bar";
				this.btnLeftState = true;
				this.btnRightState = false;
				this.leftBarItem._setIcon(leftIcon);
				this.leftBarItem._setTextColor([1, 1, 1, 1]);
				this.rightBarItem._setIcon(rightIcon);
				this.rightBarItem._setTextColor([0, 0.71, 1, 1]);
				this.scrollBoxItem.clearItems();
				this.getBusinessData();
				this.labelType = 0;
			}
			else if(1 == btnMsg && !this.btnRightState)
			{
				var leftIcon = "left_unselect_bar";
				var rightIcon = "right_select_bar";
				this.btnLeftState = false;
				this.btnRightState = true;
				this.rightBarItem._setIcon(rightIcon);
				this.rightBarItem._setTextColor([1, 1, 1, 1]);
				this.leftBarItem._setIcon(leftIcon);
				this.leftBarItem._setTextColor([0, 0.71, 1, 1]);
				this.scrollBoxItem.clearItems();
				this.getGoodsPriceInformation();
				this.labelType = 1;
			}	
		}
	};
	
	__Page.stateFilter.onFinishClk = function(msg, extra)
	{
		if(1 == msg)
		{
			DBOut("===============onFinishClk==================");
			//this.vo.price = this.selectPrice;
			//this.vo.businnesName = this.selectBusiness;
			//paramObj:{type:界面类型, dataObj:数据对象, name:名称, specialFlag:特定标志},
			//var paramObj = {type:this.type, dataObj:this.vo};
			//this.appEnv.switchState(this.page.stateBuyGoods, 1, paramObj);
		}
	};
}