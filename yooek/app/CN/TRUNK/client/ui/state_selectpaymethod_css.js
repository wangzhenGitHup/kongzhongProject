//首充
this.loadAboveAllRechargeCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var titleBgH = 60;
	
	if((sh - 900) >= 200)
	{
		titleBgH = 80;
	}
	else if((sh - 900) >= 300)
	{
		titleBgH = 90;
	}
	
	var priceTxt = (vo.rebateprice * vo.buycount) + textLib.txtYuanTip;
	var priceTxtSize = appEnv.getTextSize(priceTxt, 30, 0, sw);
	
	var rechargeTypeTxt = vo.productname;
	var rechargeTypeTxtSize = appEnv.getTextSize(rechargeTypeTxt, 30, 1, sw - priceTxtSize.w - 80);
	
	var buyCountTip = textLib.txtCountTip + ":";
	var buyCountTipSize = appEnv.getTextSize(buyCountTip, 30, 0, sw);
	
	var detailBuyCounts = "" + vo.buycount;
	var detailBuyCountsSize = appEnv.getTextSize(detailBuyCounts, 36, 0, sw);
	
	var gameNameTip = textLib.txtGameNameTip + ":";
	var gameNameTxt = appEnv.gameName;
	var gameNameTxtSize = appEnv.getTextSize(gameNameTxt, 30, 0, sw);
	
	var businessTip = textLib.txtBusinessTip + ":";
	var businessName = vo.agentstr;
	var businessNameSize = appEnv.getTextSize(businessName, 30, sw);
	
	var serverNameTip = textLib.txtServiceTip1 + ":";
	var serverNameTipSize = appEnv.getTextSize(serverNameTip, 30, 0, sw);
	
	var serverTxt = vo.zoneOrServerName;//vo.zonestr + "/" + vo.serverstr;
	var serverTxtSize = appEnv.getTextSize(serverTxt, 30, 0, sw);
	
	var unselectOneIcon = "unselect1";
	var unselectOneIconW = 42;
	var unselectOneIconH = 42;

	var balanceTip = appEnv.userInfoObj.validcoin + textLib.txtYuanTip;
	var balanceTipSize = appEnv.getTextSize(balanceTip, 30, 0, sw);
	
	var leftBalanceTip = textLib.txtShouldPayForTip + ":";
	var leftBalance;
	if((vo.rebateprice * vo.buycount) > appEnv.userInfoObj.validcoin)
	{
		leftBalance = ((vo.rebateprice * vo.buycount) - appEnv.userInfoObj.validcoin) + textLib.txtYuanTip;
	}
	else
	{
		leftBalance = 0 + textLib.txtYuanTip;
	}
	var leftBalanceSize = appEnv.getTextSize(leftBalance, 36, 0, sw);
	
	return{
		"type":"item", "id":"loadConfirmPayMethodItem","pos":[0, 0, 0], "w":sw, "h":sh - topH, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("loadCustomOrderTop", sw, topH, textLib.txtConfirmOrderTip, this, this.onBackClk)},
			
			{
				"type":"icon", "pos":[0, topH, 0], "w":sw, "h":titleBgH , "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, (titleBgH >> 1), 0], "rechargeType", [sw - priceTxtSize.w - 80, rechargeTypeTxtSize.h], rechargeTypeTxt, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1})},
					{css:cssLib["stdText"]([sw - priceTxtSize.w - 20, (titleBgH >> 1), 0], "priceTxt1", [priceTxtSize.w, priceTxtSize.h], priceTxt, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH + 1, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "butCount", [buyCountTipSize.w, buyCountTipSize.h], buyCountTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - detailBuyCountsSize.w - 20, titleBgH >> 1, 0], "priceTxt2", [detailBuyCountsSize.w, detailBuyCountsSize.h], detailBuyCounts, {tColor:[0, 0, 0, 0.2], tSize:36, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + (titleBgH << 1) + 2, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "totalCount", [textLib.txtTotalPriceTip.length * 30, 30], textLib.txtTotalPriceTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - priceTxtSize.w - 20, titleBgH >> 1, 0], "priceTxt3", [priceTxtSize.w, priceTxtSize.h], priceTxt, {tColor:[1, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH *  3 + 3, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "gameName", [gameNameTip.length * 30, 30], gameNameTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - gameNameTxtSize.w - 20, titleBgH >> 1, 0], "gameTitle", [gameNameTxtSize.w, gameNameTxtSize.h], gameNameTxt, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + (titleBgH << 2) + 4, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "businessName", [businessTip.length * 30, 30], businessTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - businessNameSize.w - 20, titleBgH >> 1, 0], "businessName", [businessNameSize.w, businessNameSize.h], businessName, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH *  5 + 5, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "serverName", [serverNameTipSize.w, serverNameTipSize.h], serverNameTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - serverTxtSize.w - 20, titleBgH >> 1, 0], "server", [serverTxtSize.w, serverTxtSize.h], serverTxt, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH *  6 + 15, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "rechargeType", [sw - 20, rechargeTypeTxtSize.h], rechargeTypeTxt, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH *  7 + 16, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "canUseBalanceTip", [textLib.txtCanUseBalance.length * 30, 30], textLib.txtCanUseBalance, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdPngIcon"]([sw - unselectOneIconW - 20, titleBgH >> 1, 0], "selectBalancePayForItem", [unselectOneIconW, unselectOneIconH], unselectOneIcon, {anchor_h:0, anchor_v:1, ui_event:1, display:1,}, this.onSelectBalancePayForClk, this, 0)},
					{css:cssLib["stdText"]([sw -balanceTipSize.w - unselectOneIconW - 20, titleBgH >> 1, 0], "canUseBalance", [balanceTipSize.w, balanceTipSize.h], balanceTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH *  8 + 17, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "totalCount", [leftBalanceTip.length * 30, 30], leftBalanceTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - leftBalanceSize.w - 20, titleBgH >> 1, 0], "priceTxt", [leftBalanceSize.w, leftBalanceSize.h], leftBalance, {tColor:[1, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 9 + 18, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.5]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "payforTitle", [textLib.txtSelectPayForTip.length * 30, 30], textLib.txtSelectPayForTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{css:cssLib["scrollBox"]([0, topH + titleBgH * 10 + 19, 0], sw, sh - 10 * titleBgH - 19 - topH, this)},
		],
	};
};

//其他充值
this.loadOtherRechargeCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var titleBgH = 60;
	if((sh - 900) >= 200)
	{
		titleBgH = 80;
	}
	else if((sh - 900) >= 300)
	{
		titleBgH = 90;
	}
	var priceTxt = (vo.buycount * vo.rebateprice) + textLib.txtYuanTip;
	var priceTxtSize = appEnv.getTextSize(priceTxt, 30, 0, sw);
	
	var rechargeTypeTxt = vo.productname;
	var rechargeTypeTxtSize = appEnv.getTextSize(rechargeTypeTxt, 30, 1, sw - priceTxtSize.w - 80);
	
	var buyCountTip = textLib.txtCountTip + ":";
	var detailBuyCounts = "" + vo.buycount;
	var detailBuyCountsSize = appEnv.getTextSize(detailBuyCounts, 36, 0, sw);
	
	var gameNameTip = textLib.txtGameNameTip + ":";
	var gameNameTxt = appEnv.gameName;
	var gameNameTxtSize = appEnv.getTextSize(gameNameTxt, 30, 0, sw);
	
	var serverNameTip = textLib.txtServiceTip1 + ":";
	var serverNameTipSize = appEnv.getTextSize(serverNameTip, 30, 0, sw);
	
	var serverTxt = vo.zoneOrServerName;//vo.zonestr + "/" + vo.serverstr;
	var serverTxtSize = appEnv.getTextSize(serverTxt, 30, 0, sw);
	
	var accountTip = textLib.txtAccountTip + ":";
	var accountTipSize = appEnv.getTextSize(accountTip, 30, 0, sw);
	
	var accountName = "" + vo.accountname;
	var accounNameSize = appEnv.getTextSize(accountName, 30, 0, sw);

	var unselectOneIcon = "unselect1";
	var unselectOneIconW = 42;
	var unselectOneIconH = 42;
	
	var balanceTip = appEnv.userInfoObj.validcoin + textLib.txtYuanTip;
	var balanceTipSize = appEnv.getTextSize(balanceTip, 30, 0, sw);
	
	var leftBalanceTip = textLib.txtShouldPayForTip + ":";
	var leftBalance;
	if((vo.rebateprice * vo.buycount) > (appEnv.userInfoObj.sumcoin - appEnv.userInfoObj.validcoin))
	{
		leftBalance = ((vo.rebateprice * vo.buycount) - (appEnv.userInfoObj.sumcoin - appEnv.userInfoObj.validcoin)) + textLib.txtYuanTip;
	}
	else
	{
		leftBalance = 0 + textLib.txtYuanTip;
	}
	var leftBalanceSize = appEnv.getTextSize(leftBalance, 36, 0, sw);
	
	return{
		"type":"item", "id":"loadConfirmPayMethodItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("loadCustomOrderTop", sw, topH, textLib.txtConfirmOrderTip, this, this.onBackClk)},
			{
				"type":"icon", "pos":[0, topH, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, (titleBgH >> 1), 0], "rechargeType", [sw - priceTxtSize.w - 80, rechargeTypeTxtSize.h], rechargeTypeTxt, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1})},
					{css:cssLib["stdText"]([sw - priceTxtSize.w - 20, (titleBgH >> 1), 0], "priceTxt1", [priceTxtSize.w, priceTxtSize.h], priceTxt, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH + 1, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "butCount", [buyCountTip.length * 30, 30], buyCountTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - detailBuyCountsSize.w - 20, titleBgH >> 1, 0], "priceTxt2", [detailBuyCountsSize.w, detailBuyCountsSize.h], detailBuyCounts, {tColor:[0, 0, 0, 0.2], tSize:36, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + (titleBgH << 1) + 2, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "totalCount", [textLib.txtTotalPriceTip.length * 30, 30], textLib.txtTotalPriceTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - priceTxtSize.w - 20, titleBgH >> 1, 0], "priceTxt2", [priceTxtSize.w, priceTxtSize.h], priceTxt, {tColor:[1, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 3 + 3, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "gameName", [gameNameTip.length * 30, 30], gameNameTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - gameNameTxtSize.w - 20, titleBgH >> 1, 0], "gameTitle", [gameNameTxtSize.w, gameNameTxtSize.h], gameNameTxt, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + (titleBgH << 2) + 4, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "serverName", [serverNameTipSize.w, serverNameTipSize.h], serverNameTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - serverTxtSize.w - 20, titleBgH >> 1, 0], "serverTxt", [serverTxtSize.w, serverTxtSize.h], serverTxt, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 5 + 5, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "accountTip", [accountTipSize.w, accountTipSize.h], accountTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - accounNameSize.w - 20, titleBgH >> 1, 0], "accountName", [accounNameSize.w, accounNameSize.h], accountName, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 6 + 15, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "rechargeType", [sw - 10, rechargeTypeTxtSize.h], rechargeTypeTxt, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 7 + 16, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "canUseBalance", [textLib.txtCanUseBalance.length * 30, 30], textLib.txtCanUseBalance, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdPngIcon"]([sw - unselectOneIconW - 20, titleBgH >> 1, 0], "selectBalancePayForItem", [unselectOneIconW, unselectOneIconH], unselectOneIcon, {anchor_h:0, anchor_v:1, ui_event:1, display:1,}, this.onSelectBalancePayForClk, this, 0)},
					{css:cssLib["stdText"]([sw - balanceTipSize.w - unselectOneIconW - 20, titleBgH >> 1, 0], "priceTxt", [balanceTipSize.w, balanceTipSize.h], balanceTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 8 + 17, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "totalCount", [leftBalanceTip.length * 30, 30], leftBalanceTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([sw - leftBalanceSize.w - 20, titleBgH >> 1, 0], "priceTxt", [leftBalanceSize.w, leftBalanceSize.h], leftBalance, {tColor:[1, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},

			{
				"type":"icon", "pos":[0, topH + titleBgH * 9 + 18, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.5]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "payforTitle", [textLib.txtSelectPayForTip.length * 30, 30], textLib.txtSelectPayForTip, {tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{css:cssLib["scrollBox"]([0, topH + titleBgH * 10 + 19, 0], sw, sh - 10 * titleBgH - 19 - topH, this)},
		],
	};
};

//确认支付  
this.loadConfirmPayCSS = function()
{
	var appEnv = this.appEnv;
	var page = this.page;
	var sw = appEnv.scrSize[0];
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var keyImg = "btn2";
	var keyImgW = sw - 60;
	var keyImgH = 60;
	var params = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
	
	return {css:cssLib["key_icon_txt"]([sw >> 1, 30 + (keyImgH >> 1), 0], "submitOrder", keyImg, keyImg, textLib.txtConfirmPayTip, keyImgW, keyImgH, params, this, this.onConfirmPayForClk)};
};

this.loadSelectBankCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var leftBarImg = cssLib.genIconPath("left_select_bar");
	var rightBarImg = cssLib.genIconPath("right_unselect_bar");
	var itemParameter1 = {tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:0, anchor_v:1, wrap:0};
	var itemParameter2 = {tColor:[0, 0.71, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
	var leftBarX = 20;
	var barW = (sw - 40) >> 1
	var size = [barW, 50];
	
	return{
		"type":"item", "id":"loadSelectBankItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("loadSelectBankTop", sw, topH, textLib.txtSelectBankTip, this, this.onBackClk)},
		/*	{
				"type":"icon", "id":"bg","pos":[0, topH, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.6]},
				items:[
					{css:cssLib["stdBtn"]([leftBarX, 30, 0], "leftBar", size, leftBarImg, leftBarImg, textLib.txtCreditCard, itemParameter1, this.onOpenBankPayTypeClk, this, 0)},
					{css:cssLib["stdBtn"]([sw - leftBarX - size[0] / 2, 30, 0], "rightBar", size, rightBarImg, rightBarImg, textLib.txtSaveCard, itemParameter2, this.onOpenBankPayTypeClk, this, 1)},
				],
			},*/
			
			{
				"type":"icon", "id":"bg","pos":[0, topH, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
			},
			{css:cssLib["scrollBox"]([0, topH + 20, 0], sw - 50, sh)},
			{css:cssLib["word_state_bar"]([sw - 14, topH, 0], 28, sh, [1, 1, 1, 1])},
		],
	};
};

this.loadBankOfTypePageCSS = function(img, cbobj, cb, isLocal, type)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var sh = 109;
	var bgW = appEnv.scrSize[0] - 30;
	var bgH = sh;
	var imgW = 629;
	var imgH = bgH;
	var upImg;
	var downImg;
	if(isLocal)
	{
		upImg = cssLib.genIconPath(img);
		downImg = cssLib.genIconPath(img);
	}
	else
	{
		upImg = img;
		downImg = img;
	}
	if(bgW < imgW)
	{
		imgW = bgW;
	}
	return{
		"type":"icon", "pos":[0, 0, 0], "w":bgW, "h":sh, "anchor_h":0, "anchor_v":0,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{
				"type":"key", "id":"bankcard","pos":[bgW >> 1, sh >> 1, 0],"w":imgW,"h":bgH,"ui_event":1,"key":0, "anchor_h":1,"anchor_v":1,"down_scale":0.98,
				"state_up":{"type":"image", "id":"upSpl", "tex":upImg, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1,},
				state_disabled:{"type":"image", "id":"downSpl", "tex":downImg, "tex_u":0, "tex_v":0, "tex_uw":1,"w":imgW,"h":imgH,"tex_vh":1, },
				OnClick:function(msg, extra)
				{
					if(!cb)
					{
						return;
					}
					cb.call(cbobj, msg, extra, type);
				},
			},
			
			{
				"type":"icon", "pos":[0, sh - 1, 0], "w":bgW, "h":1, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[0, 0, 0, 0.2]},
			},
		],
	};
};

//选择支付方式 
this.loadPayForMethodCSS = function(vo, id)
{
	var appEnv = this.appEnv;
	var sw = appEnv.scrSize[0];
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var sh = 242;
	var titleBgH = 80;
	var unselectIcon = "unselect2";
	var unselectIconW = 42;
	var unselectIconH = 42;
	var imgW = 66;
	var imgH = 66;
	var cssImg;
	var tip = " ";
	
	if(1 == vo.flag)
	{
		if(1 == vo.sysno)//textLib.txtPayBaoTip == vo.paytypename
		{
			img = "pay_bao";
			tip = textLib.txtPayBaoPayTip2;
			cssImg = {css:cssLib["simpleIcon"]([10, titleBgH >> 1, 0], "title", img, imgW, imgH, 0, 1)};
		}
		else if(22 == vo.sysno)//textLib.txtWeiXinPayTip == vo.paytypename
		{
			img = "wei_xin";
			tip = textLib.txtWeiXinPayTip2;
			cssImg = {css:cssLib["simpleIcon"]([10, titleBgH >> 1, 0], "title", img, imgW, imgH, 0, 1)};
		}
		else
		{
			//如果没有支付方式的图片地址，就用银行卡的图标
			if(!vo.imageurl)
			{
				 cssImg = {css:cssLib["simpleIcon"]([10, titleBgH >> 1, 0], "title", "bank_card", imgW, imgH, 0, 1)};
			}
			else
			{
				cssImg = {css:cssLib["url_icon"]([10, titleBgH >> 1, 0], "title", vo.imageurl, imgW, imgH, 0, 1)};
			}
		}
	}
	else if(0 == vo.flag)
	{
		img = "bank_card";
		tip = textLib.txtBankCardPayTip2;
		cssImg = {css:cssLib["simpleIcon"]([10, titleBgH >> 1, 0], "title", img, imgW, imgH, 0, 1)};
	}
	
	return 	{
		"type":"item", "id":"payForMethod" + id, "pos":[0, 0, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{
				"type":"icon", "pos":[0, 0, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					cssImg,
					{css:cssLib["stdText"]([20 + imgW, 5, 0], "payname", [vo.paytypename.length * 30, 30], vo.paytypename, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
					{css:cssLib["stdText"]([20 + imgW, 45, 0], "tip2", [tip.length * 20, 20], tip, {tColor:[0, 0, 0, 0.3], tSize:20, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
					{css:cssLib["stdPngIcon"]([sw - unselectIconW - 20, titleBgH >> 1, 0], "selectFlag", [unselectIconW, unselectIconH], unselectIcon, {anchor_h:0, anchor_v:1, ui_event:1, display:1,}, this.onSelectPayForClk, this, id)},
				
				],
			},
		],
	};
};
