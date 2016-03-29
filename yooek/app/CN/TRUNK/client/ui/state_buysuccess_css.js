//首充购买成功界面 
/*this.loadFirstBuySuccessCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 100;
	var resultBgH = 200;
	var icon = "green_select";
	var iconW = 49;
	var iconH = 49;
	var goodsNameTxt = textLib.txtGoodsNameTip + ":";
	var goodsNameTxtSize = appEnv.getTextSize(goodsNameTxt, 30, 0, sw);
	
	var rechargeTypeName = "首充6元代充奖励";
	var rechargeTypeNameSize = appEnv.getTextSize(rechargeTypeName, 28, 0, sw);
	
	var gameAccountTxt = textLib.txtGameAccountTip + ":" + 434343;
	var gameAccountTxtSize = appEnv.getTextSize(gameAccountTxt, 30, 0, sw);
	
	var gamePwdTxt = textLib.txtGamePwdTip + ":" + 4342;
	var gamePwdTxtSize = appEnv.getTextSize(gamePwdTxt, 30, 0, sw);
	
	var btnIcon = "btn5";
	var btnIconW = 115;
	var btnIconH = 50;
	var params = {scale:0.98, tSize:36, tColor:[1, 1, 1, 1], align_h:1, align_v:1, edge:0, edgeColor:[]};
	var bigBtnIcon = "btn6";
	var bigBtnIconW = sw - 60;
	var bigBtnIconH = 50;
	
	return{
		"type":"item", "id":"buySuccessItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{css:cssLib["modelTopBgZero"]("buySuccessTop", sw, topH, textLib.txtBuySuccessTip)},
			{
				"type":"icon", "pos":[sw >> 1, topH + (resultBgH >> 1), 0], "w":sw, "h":resultBgH, "anchor_h":1, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([-resultBgH/2 - 50, 0, 0], "flag", icon, iconW, iconH, 1, 1)},
					{css:cssLib["stdText"]([30, 0, 0], "buyResultTip", [textLib.txtBuySuccessTip2.length * 36, 36], textLib.txtBuySuccessTip2, {tColor:[0, 0, 0, 0.4], tSize:36, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + resultBgH + 30, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.7]},
				items:[
					{css:cssLib["stdText"]([30, 0, 0], "tip1", [goodsNameTxtSize.w, goodsNameTxtSize.h], goodsNameTxt, {tColor:[0, 0, 0, 0.4], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					{css:cssLib["stdText"]([30 + goodsNameTxtSize.w, 0, 0], "rechargeTypeName", [rechargeTypeNameSize.w, rechargeTypeNameSize.h], rechargeTypeName, {tColor:[0, 0, 0, 1], tSize:28, edge:0, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + resultBgH + 70, 0], "w":sw, "h":120, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([30, 10, 0], "gameName", [gameAccountTxtSize.w, gameAccountTxtSize.h], gameAccountTxt, {tColor:[0, 0, 0, 0.4], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
					{css:cssLib["key_icon_txt"]([sw - btnIconW - 30, 30, 0], "copyBtn1", btnIcon, btnIcon, textLib.txtCopyTip, btnIconW, btnIconH, params, this, this.onCopyClk, 0)},
					{
						"type":"icon", "pos":[0, 60, 0], "w":sw, "h":1, "anchor_h":0, "anchor_v":0,
						obj:{"type":"box", "color":[0, 0, 0, 0.2]},
					},
					{css:cssLib["stdText"]([30, 70, 0], "gamePwd", [gamePwdTxtSize.w, gamePwdTxtSize.h], gamePwdTxt, {tColor:[0, 0, 0, 0.4], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
					{css:cssLib["key_icon_txt"]([sw - btnIconW - 30, 90, 0], "copyBtn2", btnIcon, btnIcon, textLib.txtCopyTip, btnIconW, btnIconH, params, this, this.onCopyClk, 1)},
				],
			},
			
			{
				"type":"icon", "pos":[30, topH + resultBgH + 280, 0], "w":sw - 60, "h":120, "anchor_h":0, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 0.95, 0.80, 1]},
				items:[
					{css:cssLib["stdText"]([10, 0, 0], "safeTip", [sw - 80, 30], textLib.txtSafeTip1, {tColor:[0.97, 0.52, 0.02, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1})},
				],
			},
			
			{css:cssLib["key_icon_txt"]([30, topH + resultBgH + 400, 0], "alertBtn", bigBtnIcon, bigBtnIcon, textLib.txtAlertTip, bigBtnIconW, bigBtnIconH, params, this, this.onAlertClk, 0)},
		],
	};
};*/

//其他购买成功界面
this.loadOtherBuySuccessCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var resultBgH = 200;
	var icon = "green_select";
	var iconW = 49;
	var iconH = 49;
	var goodsNameTxt = textLib.txtGoodsNameTip + ":";
	var goodsNameTxtSize = appEnv.getTextSize(goodsNameTxt, 30, 0, sw);
	
	var rechargeTypeName = vo.productname;
	var rechargeTypeNameSize = appEnv.getTextSize(rechargeTypeName, 28, 0, sw);
	
	var btnIcon = "btn5";
	var btnIconW = 115;
	var btnIconH = 50;
	var params = {scale:1, tSize:36, tColor:[1, 1, 1, 1], align_h:1, align_v:1, edge:1, edgeColor:[0, 0, 0, 0.2]};
	var bigBtnIcon = "btn6";
	var bigBtnIconW = sw - 60;
	var bigBtnIconH = 50;
	var getGoodsTimeTxt = textLib.txtGetGoodsTimeTip + ":";
	var getGoodsTimeTxtSize = appEnv.getTextSize(getGoodsTimeTxt, 30, 0, sw);
	
	var timerTxt = 30 + textLib.txtTimeMinTip;
	var timerTxtSize = appEnv.getTextSize(timerTxt, 30, 0, sw);
	
	return{
		"type":"icon", "id":"buySuccessItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 0.4]},
		items:[
			{css:cssLib["modelTopBgZero"]("buySuccessTop", sw, topH, textLib.txtBuySuccessTip)},
			
			{
				"type":"icon", "pos":[sw >> 1, topH + (resultBgH >> 1), 0], "w":sw, "h":resultBgH, "anchor_h":1, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([-resultBgH/2 - 50, 0, 0], "flag", icon, iconW, iconH, 1, 1)},
					{css:cssLib["stdText"]([30, 0, 0], "buyResultTip", [textLib.txtBuySuccessTip2.length * 36, 36],
						textLib.txtBuySuccessTip2, {tColor:[0, 0, 0, 0.4], tSize:36, edge:1, edgeColor:[0, 0, 0, 0.1],
							align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + resultBgH + 30, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.7]},
				items:[
					{css:cssLib["stdText"]([30, 0, 0], "tip1", [goodsNameTxtSize.w, goodsNameTxtSize.h], goodsNameTxt,
						{tColor:[0, 0, 0, 0.4], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
							
					{css:cssLib["stdText"]([30 + goodsNameTxtSize.w, 0, 0], "rechargeTypeName", 
						[rechargeTypeNameSize.w, rechargeTypeNameSize.h], rechargeTypeName,
						{tColor:[0, 0, 0, 1], tSize:28, edge:0, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + resultBgH + 70, 0], "w":sw, "h":160, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([sw >> 1, 20, 0], "getgoodsTip", [textLib.txtBuySuccessTip3.length * 40, 40],
						textLib.txtBuySuccessTip3,
						{tColor:[0, 0, 0, 0.4], tSize:40, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:1, align_v:0, anchor_h:1,
							anchor_v:0, wrap:0})},
							
					{css:cssLib["stdText"]([(sw - getGoodsTimeTxtSize.w) / 2 - 70, 80, 0], "getgoodsTimeTip",
						[getGoodsTimeTxtSize.w, getGoodsTimeTxtSize.h], getGoodsTimeTxt,
						{tColor:[0, 0, 0, 0.2], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0, anchor_h:0,
							anchor_v:0, wrap:0})},
							
					{css:cssLib["stdText"]([(sw - getGoodsTimeTxtSize.w) / 2 - 70 + getGoodsTimeTxtSize.w, 80, 0], "timer",
						[timerTxtSize.w, timerTxtSize.h], timerTxt,
						{tColor:[1, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 0.1], align_h:0, align_v:0, anchor_h:0,
							anchor_v:0, wrap:0})},
				],
			},
			
			{css:cssLib["key_icon_txt"]([30, topH + resultBgH + 280, 0], "look", bigBtnIcon, bigBtnIcon,
				textLib.txtLookMyOrderTip, bigBtnIconW, bigBtnIconH, params, this, this.onLookOrderClk, 0)},
		],
	};
};