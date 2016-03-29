//首充订单 
this.loadFirstRechargeCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var titleBgH = 90;
	
	var priceTxt = vo.rebateprice + textLib.txtYuanTip;
	var priceTxtSize = appEnv.getTextSize(priceTxt, 30, 0, sw);
	
	var rechargeTypeTxt = vo.productname;
	var rechargeTypeTxtSize = appEnv.getTextSize(rechargeTypeTxt, 30, 1, sw - priceTxtSize.w - 90);
	
	var serviceNameTip = textLib.txtServiceTip1 + ":";
	var serviceNameTipSize = appEnv.getTextSize(serviceNameTip, 30, 0, sw);
	
	var roleNameTip = textLib.txtRoleNameTip1 + ":";
	var roleNameTipSize = appEnv.getTextSize(roleNameTip, 30, 0, sw);
	
	var roleNameBakTip = textLib.txtRoleNameTip2 + ":";
	var roleNameBakTipSize = appEnv.getTextSize(roleNameBakTip, 30, 0, sw);
	
	//var inputBoxW = 280;
	var inputBoxH = 70;
	var btnSubmitCSS = this.loadSubmitBtnCSS(topH + titleBgH * 4 + 263, sw);
	var bakAreaCSS = this.loadCustomAdviseAreaCSS([0, topH + titleBgH * 4 + 30, 0], sw, 3);
	
	return{
		"type":"item", "id":"loadCustomOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("loadCustomOrderTop", sw, topH, textLib.txtSubmitOrderTip, this, this.onBackClk)},
			
			{
				"type":"icon", "pos":[0, topH, 0], "w":sw, "h":sh - topH, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 0.3]},
			},
			
			{
				"type":"icon", "pos":[0, topH, 0], "w":sw, "h":titleBgH + 20, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, (titleBgH >> 1) + 10, 0], "rechargeType", [sw - priceTxtSize.w - 90, rechargeTypeTxtSize.h],
						rechargeTypeTxt, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
							anchor_h:0, anchor_v:1, wrap:1})},
					
					{css:cssLib["stdText"]([sw - priceTxtSize.w - 20, (titleBgH >> 1) + 10, 0], "priceTxt",
						[priceTxtSize.w, priceTxtSize.h], priceTxt,
							{tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
								anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH + 21, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [36, 36], "*",
						{tColor:[1, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
					
					{css:cssLib["stdText"]([46, titleBgH >> 1, 0], "", [serviceNameTipSize.w, serviceNameTipSize.h],
						serviceNameTip, {tColor:[0, 0, 0, 0.3], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0, align_v:1,
							anchor_h:0, anchor_v:1, wrap:0})},
	
					{css:cssLib["showTextEdit"]([56 + serviceNameTipSize.w, (titleBgH - inputBoxH) >> 1, 0], "server", sw - (66 + serviceNameTipSize.w), inputBoxH,
						"", " ", 30, 0, this.inputBoxEvent, this, 0, 0, true)},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 2 + 22, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [36, 36], "*",
						{tColor:[1, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
							
					{css:cssLib["stdText"]([46, titleBgH >> 1, 0], "", [roleNameTipSize.w, roleNameTipSize.h], roleNameTip,
						{tColor:[0, 0, 0, 0.3], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
							
					{css:cssLib["showTextEdit"]([56 + roleNameTipSize.w, (titleBgH - inputBoxH) >> 1, 0], "roleName", sw - (66 + roleNameTipSize.w), inputBoxH,
						"", " ", 30, 1, this.inputBoxEvent, this, 0, 0, true)},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 3 + 24, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([46, titleBgH >> 1, 0], "", [roleNameBakTipSize.w, roleNameBakTipSize.h],
						roleNameBakTip, {tColor:[0, 0, 0, 0.3], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0,
							align_v:1, anchor_h:0, anchor_v:1, wrap:0})},

					{css:cssLib["showTextEdit"]([56 + roleNameBakTipSize.w, (titleBgH - inputBoxH) >> 1, 0], "roleNameBak", sw - (66 + roleNameBakTipSize.w), inputBoxH,
						"", " ", 30, 2, this.inputBoxEvent, this, 0, 0, true)},
				],
			},
			
			bakAreaCSS,
			btnSubmitCSS,
		],
	};
};

//其他订单 
this.loadOtherRechargeCSS = function(sw, sh, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var titleBgH = 90;
	
	var priceTxt = vo.rebateprice + textLib.txtYuanTip;
	var priceTxtSize = appEnv.getTextSize(priceTxt, 30, 0, sw);
	
	var rechargeTypeTxt = vo.productname;
	var rechargeTypeTxtSize = appEnv.getTextSize(rechargeTypeTxt, 30, 1, sw - priceTxtSize.w - 90);
	
	var countTip = textLib.txtCountTip + ":";
	var countTipSize = appEnv.getTextSize(countTip, 36, 0, sw);
	
	var serviceNameTip = textLib.txtServiceTip1 + ":";
	var serviceNameTipSize = appEnv.getTextSize(serviceNameTip, 30, 0, sw);
	
	//var inputBoxW = 280;
	var inputBoxH = 70;
	var btnSubmitCSS = this.loadSubmitBtnCSS(topH + titleBgH * 8 + 265, sw);
	var bakAreaCSS = this.loadCustomAdviseAreaCSS([0, topH + titleBgH * 8 + 45, 0], sw, 5);
	
	var addIcon = "can_add";
	var addIconW = 48;
	var addIconH = 48;
	
	var boxFrameIcon = "box_frame";
	var boxFrameIconW = 125;
	var boxFrameIconH = 48;
	
	var subIcon = "can_not_sub";
	var subIconW = 48;
	var subIconH = 48;
	
	var totalPriceTip = textLib.txtTotalPriceTip;
	var totalPriceTipSize = appEnv.getTextSize(totalPriceTip, 36, 0, sw);
	
	var totalPriceTxt = vo.rebateprice + textLib.txtYuanTip;
	var totalPriceTxtSize = appEnv.getTextSize(totalPriceTxt, 30, 0, sw);
	
	var accountNameTip = textLib.txtAccountNameTip + ":";
	var accountNameTipSize = appEnv.getTextSize(accountNameTip, 30, 0, sw);
	
	var writePwdTip = textLib.txtPasswordWriteTip + ":";
	var writePwdTipSize = appEnv.getTextSize(writePwdTip, 30, 0, sw);
	
	var confirmPwdTip = textLib.txtConfirmPwdTip + ":";
	var confirmPwdTipSize = appEnv.getTextSize(confirmPwdTip, 30, 0, sw);
	
	var actorNameTip = textLib.txtRoleNameTip1 + ":";
	var actorNameTipSize = appEnv.getTextSize(actorNameTip, 30, 0, sw);
	
	return{
		"type":"item", "id":"loadCustomOrderItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("loadCustomOrderTop", sw, topH, textLib.txtSubmitOrderTip, this, this.onBackClk)},
			
			{
				"type":"icon", "pos":[0, topH, 0], "w":sw, "h":sh - topH, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 0.3]},
			},
			
			{
				"type":"icon", "pos":[0, topH, 0], "w":sw, "h":titleBgH + 20, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, (titleBgH >> 1) + 10, 0], "rechargeType", [sw - priceTxtSize.w - 90, rechargeTypeTxtSize.h], rechargeTypeTxt,
						{tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:1})},
				
					{css:cssLib["stdText"]([sw - priceTxtSize.w - 20, (titleBgH >> 1) + 10, 0], "priceTxt",
						[priceTxtSize.w, priceTxtSize.h], priceTxt, {tColor:[0, 0, 0, 1], tSize:30, edge:0,
							edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH + 21, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [countTipSize.w, countTipSize.h], countTip,
						{tColor:[0, 0, 0, 0.3], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
					
					{css:cssLib["key_icon"]([sw - (addIconW >> 1) - 20, titleBgH >> 1, 0], "add", addIcon, "can_not_add", addIconW,
						addIconH, {ah:1, av:1, scale:0.9}, this, this.onAddBuyCountClk)},
					
					{css:cssLib["icon_txt"]([sw - addIconW - boxFrameIconW / 2 - 30, titleBgH >> 1, 0], "boxFrame", boxFrameIcon,
						boxFrameIconW, boxFrameIconH, "1", 24, [0, 0, 0, 0.3])},
					
					{css:cssLib["key_icon"]([sw - addIconW - boxFrameIconW - subIconW / 2 - 40, titleBgH >> 1, 0], "sub",
						"can_sub", subIcon, subIconW, subIconH, {ah:1, av:1, scale:0.9}, this, this.onSubBuyCountClk)},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + (titleBgH << 1) + 22, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [totalPriceTipSize.w, totalPriceTipSize.h],
						totalPriceTip, {tColor:[0, 0, 0, 0.3], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1,
							anchor_h:0, anchor_v:1, wrap:0})},
					
					{css:cssLib["stdText"]([sw - totalPriceTipSize.w - 20, titleBgH >> 1, 0], "totalPriceTxt",
						[totalPriceTxtSize.w, totalPriceTxtSize.h], totalPriceTxt, {tColor:[0, 0, 0, 0.3], tSize:30, edge:0,
							edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 3 + 23, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [36, 36], "*", {tColor:[1, 0, 0, 1], tSize:36, edge:0,
						edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					
					{css:cssLib["stdText"]([46, titleBgH >> 1, 0], "", [serviceNameTipSize.w, serviceNameTipSize.h],
						serviceNameTip, {tColor:[0, 0, 0, 0.3], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0,
							align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					
					{css:cssLib["showTextEdit"]([56 + serviceNameTipSize.w, (titleBgH - inputBoxH) >> 1, 0], "server", sw - (66 + serviceNameTipSize.w), inputBoxH,
						"", " ", 30, 0, this.inputBoxEvent, this, 0, 0, true)},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + (titleBgH << 2) + 24, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [36, 36], "*", {tColor:[1, 0, 0, 1], tSize:36, edge:0,
						edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					
					{css:cssLib["stdText"]([46, titleBgH >> 1, 0], "", [accountNameTipSize.w, accountNameTipSize.h],
						accountNameTip, {tColor:[0, 0, 0, 0.3], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0,
							align_v:1, anchor_h:0, anchor_v:1, wrap:0})},

					{css:cssLib["showTextEdit"]([56 + accountNameTipSize.w, (titleBgH - inputBoxH) >> 1, 0], "accountName", sw - (66 + accountNameTipSize.w), inputBoxH,
						"", " ", 30, 1, this.inputBoxEvent, this, 0, 0, true)},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 5 + 25, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [36, 36], "*", {tColor:[1, 0, 0, 1], tSize:36, edge:0,
						edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					
					{css:cssLib["stdText"]([46, titleBgH >> 1, 0], "", [writePwdTipSize.w, writePwdTipSize.h], writePwdTip,
						{tColor:[0, 0, 0, 0.3], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},

					{css:cssLib["showTextEdit"]([56 + writePwdTipSize.w, (titleBgH - inputBoxH) >> 1, 0], "writePwd", sw - (66 + writePwdTipSize.w), inputBoxH,
						"", " ", 30, 2, this.inputBoxEvent, this, 1, 0, true)},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 6 + 26, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [36, 36], "*", {tColor:[1, 0, 0, 1], tSize:36, edge:0,
						edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					
					{css:cssLib["stdText"]([46, titleBgH >> 1, 0], "", [confirmPwdTipSize.w, confirmPwdTipSize.h], confirmPwdTip,
						{tColor:[0, 0, 0, 0.3], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},

					{css:cssLib["showTextEdit"]([56 + confirmPwdTipSize.w, (titleBgH - inputBoxH) >> 1, 0], "confirmPwd", sw - (66 + confirmPwdTipSize.w), inputBoxH,
						"", " ", 30, 3, this.inputBoxEvent, this, 1, 0, true)},
				],
			},
			
			{
				"type":"icon", "pos":[0, topH + titleBgH * 7 + 27, 0], "w":sw, "h":titleBgH, "anchor_h":0, "anchor_v":0, 
				"ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, titleBgH >> 1, 0], "", [36, 36], "*", {tColor:[1, 0, 0, 1], tSize:36, edge:0,
						edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
						
					{css:cssLib["stdText"]([46, titleBgH >> 1, 0], "", [actorNameTipSize.w, actorNameTipSize.h],
						actorNameTip, {tColor:[0, 0, 0, 0.3], tSize:30, edge:1, edgeColor:[0, 0, 0, 0.2], align_h:0,
							align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
							
					{css:cssLib["showTextEdit"]([56 + actorNameTipSize.w, (titleBgH - inputBoxH) >> 1, 0], "actorName", sw - (66 + actorNameTipSize.w), inputBoxH,
						"", " ", 30, 4, this.inputBoxEvent, this, 0, 0, true)},
				],
			},
			
			bakAreaCSS,
			btnSubmitCSS,
		],
	};
};

//客户填写备份信息 
this.loadCustomAdviseAreaCSS = function(pos, sw, btnMsg)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var itemParameter = {tColor:[0, 0, 0, 0.3], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0,
		anchor_v:0, wrap:1};
	var cbobj = this;
	var cb = this.inputBoxEvent;
	var inputBoxW = sw - 20;
	var inputBoxH = 180;
	
	return 	{
		"type":"icon", "pos":pos, "w":sw, "h":200, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["showTextEdit"]([0, 0, 0], "bakInfo", inputBoxW, inputBoxH,
						"", "", 24, btnMsg, cb, cbobj, 0, 0, true, 0)},
			/*{
				"type":"edit", "id":"bakInfo", "pos":[0, 0, 0],"w":inputBoxW,"h":inputBoxH - 20,
				"text":"", "font_size":24, 
				"color":[0, 0, 0, 1],"anchor_h":0, "ui_event":1,"anchor_h":0,"anchor_v":0,
				OnEditUpdate:function()
				{
					var txt = this.getText();
					cb.call(cbobj, txt, btnMsg);
					this.setText("");
				},
				
				OnCloseEdit:function()
				{
					this.endEdit();
				},
			},*/
			
			{css:cssLib["stdText"]([10, 10, 0], "bakInfoFrame", [inputBoxW, inputBoxH - 20],
				textLib.txtBakInfoTip + ":", itemParameter)},
		],
	};
};

//提交订单 
this.loadSubmitBtnCSS = function(posY, sw)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var keyImg = "btn2";
	var keyImgW = sw - 60;
	var keyImgH = 60;
	var params = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
	
	return {css:cssLib["key_icon_txt"]([sw >> 1, posY + (keyImgH >> 1), 0], "submitOrder", keyImg, keyImg, textLib.txtSubmit,
		keyImgW, keyImgH, params, this, this.onSubmitOrderClk)};
};