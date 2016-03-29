/*
	选择银行卡付款方式
*/
{	
	//加载银行卡接口界面
	__Page.stateSelectPayMethod.loadBankCardPage = function()
	{
		var appEnv = this.appEnv;
		
		this.curPage = this.PAGE_SELECT_BANKCARD;
		var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
		this.bankCardItem = this.stateSelectPayMethodLayer.appendNewChild(this.loadSelectBankCSS(appEnv.scrSize[0],
			appEnv.scrSize[1] - topH));
		//this.leftBarBankItem = this.bankCardItem.findItemById("leftBar");
		//this.rightBarBankItem = this.bankCardItem.findItemById("rightBar");
		this.selectBankScrollBoxItem = this.bankCardItem.findItemById("scrollBox");
		this.initBankCardData(0);
	};
	
	//初始化银行卡数据
	__Page.stateSelectPayMethod.initBankCardData = function(type)
	{
		var appEnv = this.appEnv;
		var sw = appEnv.scrSize[0];
		var page = this.page;
		var cssLib = page.cssLib;
		var len = this.bankCardListObj.paylist.length;
		var img;
		var css;
		var isLocal;
		for(var i = 0; i < len; i++)
		{
			img = this.bankCardListObj.paylist[i].imageurl;
			isLocal = this.bankCardListObj.paylist[i].isLocal
			css = this.loadBankOfTypePageCSS(img, this, this.onOpenPayMethodClk, isLocal, i);
			this.selectBankScrollBoxItem.insertItem(css);
		}
	};
	
	//打开银行卡支付界面 
	__Page.stateSelectPayMethod.onOpenPayMethodClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====打开银行卡支付界面=========" + btnMsg);
			this.payMethodSysno = this.bankCardListObj.paylist[btnMsg].sysno;
			this.requestPayEvent();
		}
	};
	
	//打开银行卡支付事件 
	/*__Page.stateSelectPayMethod.onOpenBankPayTypeClk = function(msg, extra, btnMsg)
	{
		if(1 == msg)
		{
			DBOut("=====打开银行卡支付事件======");
			//btnMsg = 0:信用卡
			//btnMsg = 1:储蓄卡
			var page = this.page;
			var cssLib = page.cssLib;
			
			if(0 == btnMsg && !this.btnLeftState)
			{
				var leftIcon = "left_select_bar";
				var rightIcon = "right_unselect_bar";
				this.btnLeftState = true;
				this.btnRightState = false;
				this.leftBarBankItem._setIcon(leftIcon);
				this.leftBarBankItem._setTextColor([1, 1, 1, 1]);
				this.rightBarBankItem._setIcon(rightIcon);
				this.rightBarBankItem._setTextColor([0, 0.71, 1, 1]);
			}
			else if(1 == btnMsg && !this.btnRightState)
			{
				var leftIcon = "left_unselect_bar";
				var rightIcon = "right_select_bar";
				this.btnLeftState = false;
				this.btnRightState = true;
				this.rightBarBankItem._setIcon(rightIcon);
				this.rightBarBankItem._setTextColor([1, 1, 1, 1]);
				this.leftBarBankItem._setIcon(leftIcon);
				this.leftBarBankItem._setTextColor([0, 0.71, 1, 1]);
			}	
		}
	};*/
}