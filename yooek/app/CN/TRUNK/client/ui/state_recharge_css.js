//充值方式 
this.loadRechargeCSS = function(sw)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var scrollBoxH = 155 + (appEnv.scaleFactorX - 1) * 15;
	var listBoxItemW = 104 + (appEnv.scaleFactorX - 1) * 15 + 40;
	var listBoxW = listBoxItemW * 4 - 40;
	return{
		"type":"icon", "id":"rechargeMethodItem","pos":[0, topH, 0], "w":sw, "h":scrollBoxH,
		"anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["css_listbox"]([(sw - listBoxW) >> 1, 0, 0], "payMethod", 1, [listBoxW, scrollBoxH], [listBoxItemW, scrollBoxH], 1,
				this, [this.onPayMethodClk, null])},
		],
	};
};

//具体的数据区域
this.loadGoodsDataCSS = function(sw, sh, gamename)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var seareachImg = "sereach_unselect";
	var seareachImgW = 60 + (appEnv.scaleFactorY - 1) * 15;
	var seareachImgH = 58 + (appEnv.scaleFactorY - 1) * 15;
	var gameName = gamename;
	var typeBgH = 155 + (appEnv.scaleFactorX - 1) * 15;
	var payMethodOneIcon = "paymethod_0";
	var payMethodTwoIcon = "paymethod_1";
	var payMethodThreeIcon = "paymethod_2";
	var payMethodIconW = 88;
	var payMethodIconH = 88;
	var gap = (sw - 2) / 3;
	var toolBarH = 60;
	var toolBarW = sw >> 2;

	var upArrowIcon1 = "up_arrow2";
	var upArrowIcon2 = "up_arrow1";
	var upArrowIconW = 40;
	var upArrowIconH = 40;
	var choiceIcon = "open_flag";
	var queryBgH = 80;
	var tipBgH = sh - topH - typeBgH - queryBgH - 1;
	var inputBoxW = sw - 210;
	var inputBoxH = 50;
	var btnIcon = "btn7";
	var btnIconW = 140;
	var btnIconH = 50;
	var itemParameter = {tColor:[1, 1, 1, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], 
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
	var queryResultBgH = 120;
	var arrowIcon = "arrow3";
	var arrowIconW = 31;
	var arrowIconH = 51;
	var cbobj = this;
	var cb = this.onNextStepClk;
	var scrollBoxY = topH + typeBgH + toolBarH + 10;
	var scrollBoxH = sh - scrollBoxY;
	
	return{
		"type":"item", "id":"stateRechargeItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgThrid"]("stateRechargeTop", sw, topH, gameName, seareachImg,
				seareachImg, seareachImgW, seareachImgH, {ah:0, av:1, scale:0.98}, this, [this.onBackClk, this.onSeareachClk])},
			
			{
				"type":"icon", "id":"queryBg","pos":[0, topH + typeBgH + (queryBgH >> 1), 0], "w":sw, "h":queryBgH,
				"anchor_h":0, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.5]},
				items:[

					{css:cssLib["showTextEdit"]([30,  -inputBoxH / 2, 0], "seareachAccount", inputBoxW, inputBoxH,
						"", textLib.txtInputAccountTip, 30, 0, this.inputEvent, this, 0)},
						
					{css:cssLib["key_icon_txt"]([sw - 30 - btnIconW / 2, 0, 0], "query", btnIcon, btnIcon,
						textLib.txtQueryTip, btnIconW, btnIconH, itemParameter, this, this.onQueryClk, 0)},
					
					{
						"type":"icon", "id":"","pos":[0, (queryBgH + tipBgH) >> 1, 0], "w":sw, "h":tipBgH,
						"anchor_h":0, "anchor_v":1, "ui_event":1,
						obj:{"type":"box", "color":[1, 1, 1, 0.6]},
						items:[
							{
								"type":"icon", "id":"queryResultBg","pos":[0, -tipBgH / 2 + 40 + queryResultBgH / 2, 0],
								"w":sw, "h":queryResultBgH, "anchor_h":0, "anchor_v":1, "ui_event":1,
								obj:{"type":"box", "color":[1, 1, 1, 1]}, "display":0,
								items:[
									{css:cssLib["key_boxgray_txt2"]("nextArrow1", [0, 0, 0], sw, queryResultBgH, cbobj, cb, 0)},
									{css:cssLib["key_boxgray_txt2"]("nextArrow2", [0, 0, 0], sw, queryResultBgH, cbobj, cb, 1)},
									
									{css:cssLib["stdText"]([30, 0, 0], "queryResult", [sw - 80 - arrowIconW, 30], "",
										{tColor:[0.99, 0.51, 0.03, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0,
											align_v:1, anchor_h:0, anchor_v:1, wrap:1}), display:0},
											
									/*{css:cssLib["key_icon"]([sw - arrowIconW / 2 - 30, 0, 0], "nextArrow1", arrowIcon,
										arrowIcon, arrowIconW, arrowIconH, {ah:1, av:1, scale:0.9}, this, this.onNextStepClk, 0),
										display:0},
									
									{css:cssLib["key_icon"]([sw - arrowIconW / 2 - 30, 0, 0], "nextArrow2", arrowIcon,
										arrowIcon, arrowIconW, arrowIconH, {ah:1, av:1, scale:0.9}, this, this.onNextStepClk, 1),
										display:0},*/
								],
							},
						],
					},
				],
			},
			
			{css:cssLib["recharge_type_toolbar"]([toolBarW >> 1, topH + typeBgH + (toolBarH >> 1), 0], "toolBar1", toolBarW,
				toolBarH, upArrowIcon2, upArrowIconW, upArrowIconH, textLib.txtPriceTip, this, this.onChangeSortClk, 0)},
				
			{css:cssLib["recharge_type_toolbar"]([toolBarW + (toolBarW >> 1), topH + typeBgH + (toolBarH >> 1), 0], "toolBar2",
				toolBarW, toolBarH, upArrowIcon1, upArrowIconW, upArrowIconH, textLib.txtDiscountTip, this,
				this.onChangeSortClk, 1)},
			
			{css:cssLib["recharge_type_toolbar"]([(toolBarW << 1) + (toolBarW >> 1), topH + typeBgH + (toolBarH >> 1), 0],
				"toolBar3", toolBarW, toolBarH, upArrowIcon1, upArrowIconW, upArrowIconH, textLib.txtSaleCountTip,
				this, this.onChangeSortClk, 2)},
			
			{css:cssLib["recharge_type_toolbar"]([(toolBarW << 1) + toolBarW + (toolBarW >> 1), topH + typeBgH + (toolBarH >> 1), 0], "toolBar4", toolBarW, toolBarH, choiceIcon, 21, 15, textLib.txtFilterTip, this, this.onOpenChoiceClk)},
			
			{
				"type":"icon", "id":"bg1","pos":[0, topH + typeBgH + toolBarH, 0], "w":sw, "h":10, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.2]},
			},
			{css:cssLib["scrollBox"]([0, scrollBoxY], sw, scrollBoxH, this)},
		],
	};
};


this.loadFilterCSS = function(sw, sh, type)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var leftBarImg = cssLib.genIconPath("left_select_bar");
	var rightBarImg = cssLib.genIconPath("right_unselect_bar");
	var itemParameter1 = {tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1,
		anchor_h:0, anchor_v:1, wrap:0};
		
	var itemParameter2 = {tColor:[0, 0.71, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
		
	var itemParameter3 = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1],
		align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
		
	var leftBarX = 20;
	var barW = (sw - 40) >> 1
	var size = [barW, 50];
	var btnFinishIcon = "btn3";
	var btnFinishIconW = 138;
	var btnFinishIconH = 60;
	var scrollBoxH = sh - topH - 181;
	var titleTxt = textLib.txtAgentRechargeTip;
	/*if(1 == type)
	{
		titleTxt += textLib.txtFirstRechargeAganistTip;
	}
	else if(2 == type)
	{
		titleTxt += textLib.txtPriceTip;
	}
	else if(3 == type)
	{
		titleTxt += textLib.txtAgentRechargeTip;
	}*/
	
	return{
		"type":"item", "id":"loadFilterItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgSecond"]("loadFilterTop", sw, topH, textLib.txtFilterTip, textLib.txtCancelTip,
				80, 40, 40, this, [this.onBackClk, this.onCancelClk])},
			
			{
				"type":"icon", "id":"bg","pos":[0, topH, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.6]},
				items:[
					{css:cssLib["stdBtn"]([leftBarX, 30, 0], "leftBar", size, leftBarImg, leftBarImg, textLib.txtBusinessTip,
						itemParameter1, this.onOpenLabelTypeClk, this, 0), display:(10 == type) ? 1 : 0},
						
					{css:cssLib["stdBtn"]([sw - leftBarX - size[0] / 2, 30, 0], "rightBar", size, rightBarImg, rightBarImg,
						textLib.txtFirstRechargeMoneyTip, itemParameter2, this.onOpenLabelTypeClk, this, 1),
							display:(10 == type) ? 1 : 0},
					
					{css:cssLib["stdText"]([sw >> 1, 30, 0], "title", [titleTxt.length * 40, 40], titleTxt,
						{tColor:[0, 0, 0, 1], tSize:40, edge:0, edgeColor:[1, 1, 1, 1], align_h:1, align_v:1,
							anchor_h:1, anchor_v:1, wrap:0}), display:(10 == type) ? 0 : 1},
				],
			},
		
			/*{
				"type":"icon", "id":"bg","pos":[0, topH + 60, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([30, 30, 0], "userName", [textLib.txtAllTip.length * 40, 40], textLib.txtAllTip + ";",
						{tColor:[0, 0, 0, 1], tSize:40, edge:0, edgeColor:[1, 1, 1, 1], align_h:0, align_v:1, anchor_h:0,
							anchor_v:1, wrap:0})},
				],
			},*/
			
			{
				"type":"icon", "id":"bg","pos":[0, topH + 60, 0], "w":sw, "h":scrollBoxH + 20, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["scrollBox"]([0, 20, 0], sw, scrollBoxH, this)},
				],
			},
			
			{
				"type":"icon", "id":"bg","pos":[0, sh - 100, 0], "w":sw, "h":100, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["key_icon_txt"]([sw - btnFinishIconW / 2 - 20, 50, 0], "btnFinish", btnFinishIcon,
						btnFinishIcon, textLib.txtFinishTip, btnFinishIconW, btnFinishIconH, itemParameter3,
						this, this.onFinishClk, 0)},
				],
			},
			
			
		],
	};
};

this.loadDataCSS = function(text, btnMsg)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var sw = appEnv.scrSize[0];
	var img = "select_yellow";
	var imgW = 49;
	var imgH = 49;
	//var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var sh = 60;
	var textSize = appEnv.getTextSize(text, 40, 0, sw);
	var cbobj = this;
	var cb = this.onConfirmFilterClk;

	return{
		"type":"key", "id":"cancel", "pos":[0, 0, 0], "w":sw, "h":sh, "ui_event":1, "key":0,
		"anchor_h":0, "anchor_v":0, "down_scale":1,
		"state_up":{"type":"box", "color":[1, 1, 1, 1], },
		"state_down":{"type":"box", "color":[0, 0, 0, 0.1],  },
		OnClick:function(msg, extra)
		{
			if(!cb)
			{
				return;
			}
			cb.call(cbobj, msg, extra, btnMsg);
		},
		
		items:[	
			{css:cssLib["stdText"]([30, 30, 0], "", [textSize.w, textSize.h], text,
				{tColor:[0, 0, 0, 1], tSize:40, edge:0, edgeColor:[1, 1, 1, 1], align_h:0, align_v:1,
					anchor_h:0, anchor_v:1, wrap:0})},
					
			{css:cssLib["simpleIcon"]([sw - imgW - 30, sh >> 1, 0], "selectFlag" + btnMsg, img, imgW, imgH, 0, 1), display:0},
			{
				"type":"icon", "id":"bg","pos":[0, sh - 1, 0], "w":sw, "h":1, "anchor_h":0, "anchor_v":0, 
				obj:{"type":"box", "color":[0, 0, 0, 0.2]},
			},
		],
	};
};
