this.initBuyGoodsCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var collectIcon = "star_white";
	var imgW = 56 + (appEnv.scaleFactorY - 1) * 15;
	var imgH = 48 + (appEnv.scaleFactorY - 1) * 15;
	var messageIcon = "talk_flag";
	var goodsInof = textLib.txtGoodsInfoTip;
	var btnBuyBgH = 80;
	
	//商品优惠价 
	var curPriceTxt = "" + vo.rebateprice;
	var curPriceSize = appEnv.getTextSize(curPriceTxt, 40, 0, sw);
	var yuanSize = appEnv.getTextSize(textLib.txtYuanTip, 24, 0, sw);
	
	//商品原价
	var prePriceTxt = vo.price + textLib.txtYuanTip;
	var prePriceSize = appEnv.getTextSize(prePriceTxt, 20, 0, sw);
	
	var btnBuyIcon = "btn_checkcode";
	var btnBuyIconW = 174;
	var btnBuyIconH = 51;
	var itemParameter = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
	var itemParameter1 = {tColor:[1, 1, 1, 1], tSize:36, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
	var goodsTypeBgH = 130;
	var goodsTypeY = topH + btnBuyBgH + 1;
	var goodsIcon = vo.gameimageurl;
	var goodsIconW = 109;
	var goodsIconH = 109;
	
	var goodsTypeTip = textLib.txtGoodsTypeTip + ":" + vo.categoryname;
	var goodsTypeTipSize = appEnv.getTextSize(goodsTypeTip, 24, 0, sw);
	
	var goodsTypeName = vo.productname;
	var leftW = sw - 40 - goodsIconW;
	var typeY = 0;
	var goodsTypeNameSize = appEnv.getTextSize(goodsTypeName, 30, 0, leftW);
	if(goodsTypeNameSize.w <= leftW)
	{
		typeY = goodsTypeBgH - goodsTypeTipSize.h - 10;
	}
	else
	{
		typeY = goodsTypeBgH - goodsTypeTipSize.h;
		goodsTypeNameSize = appEnv.getTextSize(goodsTypeName, 30, 1, leftW);
	}

	var goodsNumberTip = textLib.txtGoodsNumberTip + ":" + vo.productid;
	var goodsNumberTipSize = appEnv.getTextSize(goodsNumberTip, 30, 0, sw);
	
	var goodsNumberBgH = 60;
	var goodsNumberBgY = goodsTypeBgH + goodsTypeY + 1;
	var btnCopyIcon = "btn1";
	var btnCopyIconW = 92;
	var btnCopyIconH = 40;
	var serverBgH = 60;
	
	var serverTip = textLib.txtGameServerTip + ":" + appEnv.gameName + "/" + vo.agentstr + "/" + vo.zonestr + "/" + vo.serverstr;
	var serverTipSize = appEnv.getTextSize(serverTip, 24, 0, sw);
	
	var serverBgY = goodsNumberBgY + goodsNumberBgH + 1;
	var saleManInfoBgH = 110;
	var saleManInfoY = serverBgY + serverBgH + 11;
	var saleManName = textLib.txtSaleManNameTip + ":" + vo.sellname;
	var saleManNameSize = appEnv.getTextSize(saleManName, 30, 0, sw);
	
	var identiIcon = "sale_identi";
	var identiIconW = 121;
	var identiIconH = 34;
	var identiTxt = textLib.txtIdentiSaleTip;
	var identiTxtSize = appEnv.getTextSize(identiTxt, 20, 0, sw);
	
	var creditTxt = textLib.txtCreditTip + ":";
	var creditTxtSize = appEnv.getTextSize(creditTxt, 30, 0, sw);
	
	var starImg;
	var imgUrl;
	var starImgW = 30;
	var starImgH = 30;
	var creditType = appEnv.computerSellerLevel(vo.ordernumber);
	imgUrl = appEnv.getSellerCreditIcon(creditType);
	starImg = cssLib.genIconPath(imgUrl);
	var gap = starImgW * creditType + (creditType - 1) * 2;
	var starImgX = 0;
	var starCSS = [];
	for(var i = 0; i < creditType; i++)
	{
		starCSS[i] = {"type":"icon", "id":"star", "pos":[starImgX, 0, 0], "w":starImgW, "h":starImgH, "anchor_h":0,"anchor_v":0,
			obj:{"type":"image", "tex":starImg, "tex_u":0, "tex_v":0, "tex_uw":1,"pos":[0, 0, 0],"tex_vh":1,},
		};
		starImgX += starImgW + 2;
	}
	
	var bakBgH = 150;
	var bakBgY = saleManInfoY + saleManInfoBgH + 9;
	var desTxt = vo.description.substring(0, 100);
	var desTxtSize = appEnv.getTextSize(desTxt, 24, 1, sw - 40);
	
	var safeTipTxt = textLib.txtSafeTip2 + ":" + (!vo.note?textLib.txtNoHave:vo.note);
	var safeTipSize = appEnv.getTextSize(safeTipTxt, 24, 1, sw);
	
	var bakIcon = cssLib.genIconPath("arrow2");
	var bakIconW = 57;
	var bakIconH = 22;
	var itemParameter2 = {tColor:[1, 1, 1, 1], tSize:20, edge:0, edgeColor:[1, 1, 1, 0.2], align_h:1, align_v:1, anchor_h:1,
		anchor_v:1, wrap:0};
		
	var otherBgH = sh - topH - btnBuyBgH - goodsTypeBgH - goodsNumberBgH - serverBgH - saleManInfoBgH - bakBgH - 25;
	var otherBgY = bakBgY + bakBgH + 1;
	
	return{
		"type":"item", "id":"buyGoodsItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgThrid"]("stateRechargeTop", sw, topH, goodsInof, messageIcon, messageIcon, imgW, imgH,
				{ah:0, av:1, scale:0.98}, this, [this.onBackClk, this.onOpenTalkClk])},
				
			{
				"type":"icon", "pos":[0, topH, 0], "id":"priceBg", "w":sw, "h":btnBuyBgH, "anchor_h":0, 
				"anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([20, btnBuyBgH >> 1, 0], "curPrice", [curPriceSize.w, curPriceSize.h], curPriceTxt,
						{tColor:[0.50, 0.75, 0.06, 1], tSize:40, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, 
							anchor_h:0, anchor_v:1, wrap:0})},
					
					{css:cssLib["stdText"]([20 + curPriceSize.w, btnBuyBgH >> 1, 0], "tip", [yuanSize.w, yuanSize.h], textLib.txtYuanTip,
						{tColor:[0, 0, 0, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
					
					{css:cssLib["stdText"]([curPriceSize.w + yuanSize.w + 50, btnBuyBgH >> 1, 0], "prePrice", [prePriceSize.w, prePriceSize.h],
						prePriceTxt, {tColor:[0, 0, 0, 0.3], tSize:20, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
							anchor_h:0, anchor_v:1, wrap:0})},
					
					{
						"type":"icon", "id":"line", "pos":[curPriceSize.w + yuanSize.w + 40, btnBuyBgH >> 1, 0], "w":prePriceSize.w + 20,
						"h":1, "anchor_h":0, "anchor_v":1,
						obj:{"type":"box", "color":[0, 0, 0, 0.3]},
					},
					
					{css:cssLib["key_icon_txt"]([sw - 20 - (btnBuyIconW >> 1), btnBuyBgH >> 1, 0], "immediatelyBuy", btnBuyIcon, btnBuyIcon,
						textLib.txtImmeditaleyBuyTip, btnBuyIconW, btnBuyIconH, itemParameter, this, this.onBuyClk)},
				],
			},
			
			{
				"type":"icon", "pos":[0, goodsTypeY, 0], "id":"goodsInfoBg", "w":sw, "h":goodsTypeBgH, "anchor_h":0, "anchor_v":0,
				"ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["url_icon"]([20, goodsTypeBgH >> 1, 0], "icon", goodsIcon, goodsIconW, goodsIconH, 0, 1)},
					{css:cssLib["stdText"]([30 + goodsIconW, 30, 0], "goodsTypeName", [sw - 30 - goodsIconW, goodsTypeNameSize.h], goodsTypeName, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1})},
					{css:cssLib["stdText"]([30 + goodsIconW, typeY, 0], "goodsTypeTip", [goodsTypeTipSize.w, goodsTypeTipSize.h],
						goodsTypeTip, {tColor:[0, 0, 0, 0.4], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
						anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, goodsNumberBgY, 0], "id":"goodsNumberBg", "w":sw, "h":goodsNumberBgH, "anchor_h":0,
				"anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.5]},
				items:[
					{css:cssLib["stdText"]([20, goodsNumberBgH >> 1, 0], "goodsNumber", [goodsNumberTipSize.w, goodsNumberTipSize.h], goodsNumberTip,
						{tColor:[0, 0, 0, 0.5], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1,
							wrap:0})},
							
					{css:cssLib["key_icon_txt"]([sw - btnCopyIconW - 20, goodsNumberBgH >> 1, 0], "btnCopy", btnCopyIcon, btnCopyIcon,
						textLib.txtCopyTip, btnCopyIconW, btnCopyIconH, itemParameter1, this, this.onCopyClk)},
				],
			},
			
			{
				"type":"icon", "pos":[0, serverBgY, 0], "id":"serverBg", "w":sw, "h":serverBgH, "anchor_h":0, "anchor_v":0,
				"ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([20, serverBgH >> 1, 0], "title", [serverTipSize.w, serverTipSize.h], serverTip,
						{tColor:[0, 0, 0, 0.7], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, saleManInfoY, 0], "id":"saleManInfo", "w":sw, "h":saleManInfoBgH, "anchor_h":0,
				"anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([20, 10, 0], "saleManName", [saleManNameSize.w, saleManNameSize.h], saleManName,
						{tColor:[0, 0, 0, 0.8], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
							anchor_v:0, wrap:1})},
							
					{css:cssLib["simpleIcon"]([30 + saleManNameSize.w, 10, 0], "flag", identiIcon, identiIconW, identiIconH, 0, 0)},
					
					{css:cssLib["stdText"]([65 + saleManNameSize.w, 17, 0], "identiTxt", [identiTxtSize.w, identiTxtSize.h],
						identiTxt, {tColor:[1, 1, 1, 1], tSize:20, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0,
							anchor_h:0, anchor_v:0, wrap:1})},
							
					{css:cssLib["stdText"]([20, 50, 0], "credit", [creditTxtSize.w, creditTxtSize.h], creditTxt,
						{tColor:[0, 0, 0, 0.8], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
							anchor_v:0, wrap:1})},
					{
						"type":"icon", "id":"star", "pos":[20 + creditTxtSize.w, 50, 0], "w":starImgW, "h":starImgH, "anchor_h":0,
						"anchor_v":0,
						items:starCSS,
					},
				],
			},
			
			{
				"type":"icon", "pos":[0, bakBgY, 0], "id":"bakBg", "w":sw, "h":bakBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdBtn"] ([20 + bakIconW / 2, 10 + bakIconH / 2, 0], "titleBg", [bakIconW, bakIconH], bakIcon,
						bakIcon, textLib.txtRemarksTip, itemParameter2, null, null)},
					{css:cssLib["stdText"]([20, 30 + bakIconH / 2, 0], "title", [sw - 40, desTxtSize.h], desTxt,
						{tColor:[0, 0, 0, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
							anchor_v:0, wrap:1})},
				],
			},
			
			{
				"type":"icon", "pos":[0, otherBgY, 0], "id":"bakBg", "w":sw, "h":otherBgH, "anchor_h":0, "anchor_v":0,
				"ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([20, 10, 0], "title", [safeTipSize.w, safeTipSize.h], safeTipTxt,
						{tColor:[0.99, 0.51, 0.03, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0,
							anchor_h:0, anchor_v:0, wrap:1})},
				],
			},
		],
	};
};