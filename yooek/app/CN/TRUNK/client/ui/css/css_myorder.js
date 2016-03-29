//=================================订单管理======================================
this.loadOrderManagerCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var orderImgArr = ["all_order", "wait_pay", "wait_takeover", "already_takeover", "trade_failed"];
	
	var orderTipArr = [textLib.txtAllOrderTip, textLib.txtWaitPayOrderTip, textLib.txtWaitTakeOverOrderTip,
		textLib.txtTradeSuccessTip, textLib.txtTradeFailedOrderTip, textLib.txtWaitDeliverGoods];
		
	var imgW = (sw - 320) / 3;
	var imgH = imgW;
	
	return{
		"type":"icon", "id":"orderManagerItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		
		items:[
			{css:cssLib["modelTopBgFirst"]("orderManagerTop", sw, topH, textLib.txtOrderManagerTip, obj, obj.onBackClk, 0)},
			
			//全部订单 
			{css:cssLib["order_icon"]([80 + (imgH >> 1), topH + 50, 0], "orderKey1", orderImgArr[0], imgW, imgH,
				orderTipArr[0], obj, obj.onOrderTypeClk, 1)},
				
			//待付款
			{css:cssLib["order_icon"]([160 + imgH + (imgH >> 1), topH + 50, 0], "orderKey2", orderImgArr[1],
				imgW, imgH, orderTipArr[1], obj, obj.onOrderTypeClk, 2)},
				
			//待收货
			{css:cssLib["order_icon"]([240 + (imgH << 1) + (imgH >> 1), topH + 50, 0], "orderKey3", orderImgArr[2],
				imgW, imgH, orderTipArr[2], obj, obj.onOrderTypeClk, 3)},
			
			//已收货
			{css:cssLib["order_icon"]([80 + (imgH >> 1), topH + imgH + 120, 0], "orderKey4", orderImgArr[3],
				imgW, imgH, orderTipArr[3], obj, obj.onOrderTypeClk, 4)},
				
			//交易失败
			{css:cssLib["order_icon"]([160 + imgH + (imgH >> 1), topH + imgH + 120, 0], "orderKey5", orderImgArr[4],
				imgW, imgH, orderTipArr[4], obj, obj.onOrderTypeClk, 5)},
			
			//待发货
			{css:cssLib["order_icon"]([240 + (imgH << 1) + (imgH >> 1), topH + imgH + 120, 0], "orderKey6", orderImgArr[2],
				imgW, imgH, orderTipArr[5], obj, obj.onOrderTypeClk, 6)},
		],
	};
};

//==============全部订单===========================
this.loadAllOrderCSS = function(obj, sw, sh, orderNum)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return{
		"type":"item", "id":"loadAllOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("loadAllOrderTopBar", sw, topH, textLib.txtAllOrderTip, obj, obj.onBackClk, 0)},
			{css:cssLib["scrollBox"]([0, topH, 0], sw, sh, obj)},
		],
	};
};

//================待付款============================
this.loadWaitPayOrderCSS = function(obj, sw, sh, orderNum)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return{
		"type":"item", "id":"waitPayOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("waitPayOrderTop", sw, topH, textLib.txtWaitPayOrderTitle, obj, obj.onBackClk, 0)},
			{css:cssLib["scrollBox"]([0, topH, 0], sw, sh, obj)},
		],
	};
};

//==================具体订单付款的项=============================
this.loadPayForOrderCSS = function(obj, sw, sh, vo, gamename)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var talkImg = "talk_flag";
	var btn1Img = "btn2";
	var btn1ImgW = sw - 40;
	var btn1ImgH = 60;
	var itemParameter = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1,
		anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
	var curPriceTxt = vo.rebateprice;
	var beforePriceTxt = vo.price + textLib.txtYuanTip;
	var goodsImg = vo.gameimageurl;
	var goodsImgW = 100;
	var goodsImgH = 100;
	var goodsDes = vo.productname;
	var goodsType = textLib.txtGoodsTypeTip + ":" + vo.categoryname;
	var number = textLib.txtGoodsNumberTip + vo.productid;
	var btnCopyImg = "btn1";
	var btnCopyImgW = 70;
	var btnCopyImgH = 40;
	var gameSer = gamename + "/" + vo.zonestr + "/" + vo.serverstr;
	var remarkImg = cssLib.genIconPath("arrow2");
	var remarkImgW = 80;
	var remarkImgH = 30;
	var itemParameter2 = {tColor:[1, 1, 1, 1], tSize:28, edge:1, edgeColor:[1, 1, 1, 0.2], align_h:1,
		align_v:1, anchor_h:1, anchor_v:1, wrap:0};
	var remarkDes = vo.description;
	var creditTxt = textLib.txtCreditTip + ":";
	var saleManNameTxt = textLib.txtSaleManTip + ":" + vo.sellname;
	var identiImg = "sale_identi";
	var identiImgW = 121;
	var identiImgH = 34;
	var imgArr = [btn1Img, goodsImg, btnCopyImg, remarkImg, identiImg];
	var imgWArr = [btn1ImgW, goodsImgW, btnCopyImgW, remarkImgW, identiImgW];
	var imgHArr = [btn1ImgH, goodsImgH, btnCopyImgH, remarkImgH, identiImgH];
	var textArr = [curPriceTxt, beforePriceTxt, goodsDes, goodsType, number, textLib.txtCopyTip, gameSer,
		textLib.txtRemarksTip, remarkDes, saleManNameTxt, textLib.txtIdentiSaleTip, creditTxt];
	
		
	return{
		"type":"item", "id":"payforOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgThrid"]("payforOrderTop", sw, topH, textLib.txtGoodsInfoTip, talkImg, talkImg,
				70, 60, {ah:0, av:1, scale:0.98}, obj, [obj.onBackClk, obj.onOpenTalkClk])},
			{
				"type":"icon", "pos":[sw >> 1, topH + 60, 0], "w":sw, "h":120, "anchor_h":1, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["key_icon_txt"]([0, 0, 0], "immediatelyPayItem", btn1Img, btn1Img,
						textLib.txtImmediatelyTip, btn1ImgW, btn1ImgH, itemParameter, obj, obj.onImmediatelyClk, 0)},
				],
			},
			{css:cssLib["goods_information"]([0, topH + 60, 0], sw, sh, imgArr, imgWArr, imgHArr, textArr,
				vo.ordernumber, obj, obj.onCopyOrderNumberClk, 0)},
		],
	};
};

//================待收货============================
this.loadWaitTakeOverOrderCSS = function(obj, sw, sh, orderNum)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return{
		"type":"item", "id":"waitTakeOverItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("waitTakeOverTop", sw, topH, textLib.txtWaitTakeOverOrderTipText, obj, obj.onBackClk, 0)},
			{css:cssLib["scrollBox"]([0, topH, 0], sw, sh, obj)},
		],
	};
};

//====================交易失败的订单===========================
this.loadTradeFailedOrderCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return{
		"type":"item", "id":"tradeFailedItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("tradeFailedTop", sw, topH, textLib.txtTradeFailedTipText, obj, obj.onBackClk, 0)},
			{css:cssLib["scrollBox"]([0, topH, 0], sw, sh, obj)},
		],
	};
};

//================待发货============================
this.loadWaitSendOrderCSS = function(obj, sw, sh, orderNum)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return{
		"type":"item", "id":"waitPayOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("waitSendOrderTop", sw, topH, textLib.txtWaitSendOrderTitleTip, obj, obj.onBackClk, 0)},
			{css:cssLib["scrollBox"]([0, topH, 0], sw, sh, obj)},
		],
	};
};

//========================交易失败原因=========================
this.loadOrderFailedReasonCSS = function(obj, sw, sh, vo, failedReasonText, gamename)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var failedTitle = textLib.txtTradeFailedOrderTip + "!";
	var failedTitleSize = appEnv.getTextSize(failedTitle, 30, 0, sw);
	
	var failedReasonTxt = textLib.txtFailedReasonTip + ":" + failedReasonText;
	var failedReasonTxtSize = appEnv.getTextSize(failedReasonTxt, 30, 0, sw);
	
	var talkImg = "talk_flag";
	var itemParameter = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1,
		anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
		
	var curPriceTxt = vo.rebateprice;
	var beforePriceTxt = vo.price + textLib.txtYuanTip;
	var goodsImg = vo.gameimageurl;
	var goodsImgW = 100;
	var goodsImgH = 100;
	var goodsDes = vo.productname;
	var goodsType = textLib.txtGoodsTypeTip + ":" + vo.categoryname;
	var number = textLib.txtGoodsNumberTip + ":" + vo.productid;
	var btnCopyImg = "btn1";
	var btnCopyImgW = 70;
	var btnCopyImgH = 40;
	var gameSer = gamename + "/" + vo.zonestr + "/" + vo.serverstr;
	var remarkImg = cssLib.genIconPath("arrow2");
	var remarkImgW = 80;
	var remarkImgH = 30;
	var itemParameter2 = {tColor:[1, 1, 1, 1], tSize:28, edge:1, edgeColor:[1, 1, 1, 0.2], align_h:1,
		align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var remarkDes = vo.description;
	var creditTxt = textLib.txtCreditTip + "：";
	var saleManNameTxt = textLib.txtSaleManTip + ":" + vo.sellname;
	var identiImg = "sale_identi";
	var identiImgW = 121;
	var identiImgH = 34;
	var imgArr = [null, goodsImg , btnCopyImg, remarkImg, identiImg];
	var imgWArr = [0, goodsImgW, btnCopyImgW, remarkImgW, identiImgW];
	var imgHArr = [0, goodsImgH, btnCopyImgH, remarkImgH, identiImgH];
	var textArr = [curPriceTxt, beforePriceTxt, goodsDes, goodsType, number, textLib.txtCopyTip,
		gameSer, textLib.txtRemarksTip, remarkDes, saleManNameTxt, textLib.txtIdentiSaleTip, creditTxt];
	
	return{
		"type":"item", "id":"payforOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgThrid"]("failedOrderTop", sw, topH, textLib.txtGoodsInfoTip, talkImg, talkImg, 70, 60,
				{ah:0, av:1, scale:0.98}, obj, [obj.onBackClk, obj.onOpenTalkClk])},
			{
				"type":"icon", "pos":[sw >> 1, topH + 60, 0], "w":sw, "h":120, "anchor_h":1, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([-sw / 2 + 20, -40, 0], "tradeFailedTitle", [failedTitleSize.w, failedTitleSize.h],
						failedTitle, {tColor:[0, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
							anchor_h:0, anchor_v:1, wrap:0})},
							
					{css:cssLib["stdText"]([-sw / 2 + 20, 0, 0], "failedReasonTip",
						[failedReasonTxtSize.w, failedReasonTxtSize.h], failedReasonTxt,
						{tColor:[0, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
							anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			{css:cssLib["goods_information"]([0, topH + 60, 0], sw, sh, imgArr, imgWArr, imgHArr, textArr,
				vo.ordernumber, obj, obj.onCopyOrderNumberClk)},
		],
	};
};

//=================已收货=============================
this.loadAlreadyTakeOverCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return{
		"type":"item", "id":"tradeFailedItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("tradeFailedTop", sw, topH, textLib.txtTradeSuccessOrderTip, obj, obj.onBackClk, 0)},
			{css:cssLib["scrollBox"]([0, topH, 0], sw, sh, obj)},
		],
	};
};

//==============交易成功=================================
this.loadTradeSuccessTipCSS = function(obj, sw, sh, vo, gamename)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var talkImg = "talk_flag";
	
	var curPriceTxt = vo.rebateprice;
	var beforePriceTxt = vo.price + textLib.txtYuanTip;
	
	var goodsImg = vo.gameimageurl;
	var goodsImgW = 100;
	var goodsImgH = 100;
	var goodsDes = vo.productname;
	var goodsType = textLib.txtGoodsTypeTip + ":" + vo.categoryname;
	var number = textLib.txtGoodsNumberTip + vo.productid;
	var btnCopyImg = "btn1";
	var btnCopyImgW = 70;
	var btnCopyImgH = 40;
	var gameSer = gamename + "/" + vo.zonestr + "/" + vo.serverstr;
	var remarkImg = cssLib.genIconPath("arrow2");
	var remarkImgW = 80;
	var remarkImgH = 30;

	var remarkDes = vo.description.substring(0, 62);
	var creditTxt = textLib.txtCreditTip + ":";
	var saleManNameTxt = textLib.txtSaleManTip + ":" + vo.sellname;
	var identiImg = "sale_identi";
	var identiImgW = 121;
	var identiImgH = 34;
	var imgArr = [null, goodsImg , btnCopyImg, remarkImg, identiImg];
	var imgWArr = [0, goodsImgW, btnCopyImgW, remarkImgW, identiImgW];
	var imgHArr = [0, goodsImgH, btnCopyImgH, remarkImgH, identiImgH];
	var textArr = [curPriceTxt, beforePriceTxt, goodsDes, goodsType, number, textLib.txtCopyTip,
		gameSer, textLib.txtRemarksTip, remarkDes, saleManNameTxt, textLib.txtIdentiSaleTip, creditTxt];
		
	return{
		"type":"icon", "id":"payforOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 0.1]},
		items:[
			{css:cssLib["modelTopBgThrid"]("payforOrderTop", sw, topH, textLib.txtGoodsInfoTip, talkImg, talkImg, 70, 60,
				{ah:0, av:1, scale:0.98}, obj, [obj.onBackClk, obj.onOpenTalkClk])},
			{
				"type":"icon", "pos":[sw >> 1, topH + 60, 0], "w":sw, "h":120, "anchor_h":1, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([0, 0, 0], "tradeSuccessTip", [textLib.txtTradeSuccessOrderTip2.length * 30, 30],
						textLib.txtTradeSuccessOrderTip2, {tColor:[0, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1],
							align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0})},
				],
			},
			{css:cssLib["goods_information"]([0, topH + 60, 0], sw, sh, imgArr, imgWArr, imgHArr, textArr,
				vo.ordernumber, obj, obj.onCopyOrderNumberClk)},
		],
	};
};

//==============交易成功2=================================
this.loadFirstTradeSuccessCSS = function(obj, sw, sh, vo, gameAccount, gamePwd, gamename)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var talkImg = "talk_flag";
	var gameAccountTxt = textLib.txtGameAccountTip + ":" + gameAccount;
	var gameAccountTxtSize = appEnv.getTextSize(gameAccountTxt, 28, 0, sw);
	
	var gamePasswordTxt = textLib.txtGamePwdTip + ":" + gamePwd;
	var gamePasswordTxtSize = appEnv.getTextSize(gamePasswordTxt, 28, 0, sw);
	
	var itemParameter = {tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1,
		align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
		
	var curPriceTxt = vo.rebateprice;
	var beforePriceTxt = vo.price + textLib.txtYuanTip;
	var goodsImg = vo.gameimageurl;
	var goodsImgW = 100;
	var goodsImgH = 100;
	var goodsDes = vo.productname;
	var goodsType = textLib.txtGoodsTypeTip + ":" + vo.categoryname;
	var number = textLib.txtGoodsNumberTip + vo.productid;
	var btnCopyImg = "btn1";
	var btnCopyImgW = 70;
	var btnCopyImgH = 40;
	var gameSer = gamename + "/" + vo.zonestr + "/" + vo.serverstr;
	var remarkImg = cssLib.genIconPath("arrow2");
	var remarkImgW = 80;
	var remarkImgH = 30;
	var itemParameter2 = {tColor:[1, 1, 1, 1], tSize:28, edge:1, edgeColor:[1, 1, 1, 0.2], align_h:1,
		align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var remarkDes = vo.description.substring(0, 62);
	var creditTxt = textLib.txtCreditTip + "：";
	var saleManNameTxt = textLib.txtSaleManTip + ":" + vo.sellname;
	var identiImg = "sale_identi";
	var identiImgW = 121;
	var identiImgH = 34;
	var imgArr = [null, goodsImg , btnCopyImg, remarkImg, identiImg];
	var imgWArr = [0, goodsImgW, btnCopyImgW, remarkImgW, identiImgW];
	var imgHArr = [0, goodsImgH, btnCopyImgH, remarkImgH, identiImgH];
	var textArr = [curPriceTxt, beforePriceTxt, goodsDes, goodsType, number, textLib.txtCopyTip,
		gameSer, textLib.txtRemarksTip, remarkDes, saleManNameTxt, textLib.txtIdentiSaleTip, creditTxt];
	
	return{
		"type":"icon", "id":"payforOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 0.1]},
		items:[
			{css:cssLib["modelTopBgThrid"]("tradeSuccess2Top", sw, topH, textLib.txtGoodsInfoTip, talkImg, talkImg,
				70, 60, {ah:0, av:1, scale:0.98}, obj, [obj.onBackClk, obj.onOpenTalkClk])},
			{
				"type":"icon", "pos":[0, topH, 0], "w":sw, "h":120, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([20, 10, 0], "gameAccount", [gameAccountTxtSize.w, gameAccountTxtSize.h],
						gameAccountTxt, {tColor:[0, 0, 0, 0.6], tSize:28, edge:0, edgeColor:[0, 0, 0, 1], align_h:0,
							align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
							
					{css:cssLib["stdText"]([20, 70, 0], "gamePassword", [gamePasswordTxtSize.w, gamePasswordTxtSize.h],
						gamePasswordTxt, {tColor:[0, 0, 0, 0.6], tSize:28, edge:0, edgeColor:[0, 0, 0, 1], align_h:0,
							align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
							
					{css:cssLib["key_icon_txt"]([sw - (btnCopyImgW >> 1) - 20, 10 + (btnCopyImgH >> 1), 0], "btnCopy1",
						btnCopyImg, btnCopyImg, textArr[5], btnCopyImgW, btnCopyImgH, itemParameter,
						obj, obj.onCopyOrderNumberClk, 0)},
						
					{css:cssLib["key_icon_txt"]([sw - (btnCopyImgW >> 1) - 20, 70 + (btnCopyImgH >> 1), 0], "btnCopy2",
						btnCopyImg, btnCopyImg, textArr[5], btnCopyImgW, btnCopyImgH, itemParameter,
						obj, obj.onCopyOrderNumberClk, 0)},
				],
			},
			{css:cssLib["goods_information"]([0, topH + 60, 0], sw, sh, imgArr, imgWArr, imgHArr, textArr,
				vo.ordernumber, obj, obj.onCopyOrderNumberClk)},
		],
	};
};

//=======================后续代充====================================
this.loadGoOnAgentRechargeCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var seareachImg = "sereach_unselect";
	var seareachImgW = 64;
	var seareachImgH = 64;
	
	return{
		"type":"item", "id":"goOnAgentRechargeItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgThrid"]("goOnAgentRechargeTop", sw, topH, "刀塔传奇", seareachImg,
				seareachImg, seareachImgW, seareachImgH, {ah:0, av:1, scale:0.98}, obj, [obj.onBackClk, obj.onSeareachClk])},
				
			{css:cssLib["scrollBox"]([0, topH, 0], sw, sh, obj)},
		],
	};
};