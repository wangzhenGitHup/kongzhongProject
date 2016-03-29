this.loadFilterCSS = function(sw, sh, type, vo)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 100;
	
	var leftBarImg = cssLib.genIconPath("left_select_bar");
	var rightBarImg = cssLib.genIconPath("right_unselect_bar");
	var itemParameter1 = {tColor:[1, 1, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:0, anchor_v:1, wrap:0};
	var itemParameter2 = {tColor:[0, 0.71, 1, 1], tSize:24, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0};
	var itemParameter3 = {tColor:[1, 1, 1, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0, scale:0.98};
	var leftBarX = 20;
	var barW = (sw - 40) >> 1
	var size = [barW, 50];
	var btnFinishIcon = "btn3";
	var btnFinishIconW = 138;
	var btnFinishIconH = 60;
	var inputBoxH = sh - 200 - 140;
	var titleTxt = "";
	if(1 == type)
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
	}
	
	return{
		"type":"item", "id":"loadFilterItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgSecond"]("loadFilterTop", sw, topH, textLib.txtFilterTip, textLib.txtCancelTip, 80, 40, 40, this, [this.onBackClk, this.onCancel])},
			{
				"type":"icon", "id":"bg","pos":[0, topH, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 0.6]},
				items:[
					{css:cssLib["stdBtn"]([leftBarX, 30, 0], "leftBar", size, leftBarImg, leftBarImg, textLib.txtBusinessTip, itemParameter1, this.onOpenLabelTypeClk, this, 0), display:(0 == type) ? 1 : 0},
					{css:cssLib["stdBtn"]([sw - leftBarX - size[0] / 2, 30, 0], "rightBar", size, rightBarImg, rightBarImg, textLib.txtFirstRechargeMoneyTip, itemParameter2, this.onOpenLabelTypeClk, this, 1), display:(0 == type) ? 1 : 0},
					{css:cssLib["stdText"]([sw >> 1, 30, 0], "title", [titleTxt.length * 40, 40], titleTxt, {tColor:[0, 0, 0, 1], tSize:40, edge:0, edgeColor:[1, 1, 1, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0}), display:(0 == type) ? 0 : 1},
				],
			},
		
			{
				"type":"icon", "id":"bg","pos":[0, topH + 60, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([30, 30, 0], "userName", [textLib.txtAllTip.length * 40, 40], textLib.txtAllTip, {tColor:[0, 0, 0, 1], tSize:40, edge:0, edgeColor:[1, 1, 1, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},
			
			{
				"type":"icon", "id":"bg","pos":[0, topH + 121, 0], "w":sw, "h":inputBoxH + 20, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["scrollBox"]([0, 20, 0], sw, inputBoxH)},
				],
			},
			
			{
				"type":"icon", "id":"bg","pos":[0, sh - 100, 0], "w":sw, "h":100, "anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["key_icon_txt"]([sw - btnFinishIconW / 2 - 20, 50, 0], "btnFinish", btnFinishIcon, btnFinishIcon, textLib.txtFinishTip, btnFinishIconW, btnFinishIconH, itemParameter3, this, this.onFinishClk, 0)},
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
	var topH = 100;
	var sh = 60;
	var cbobj = this;
	var cb = this.onConfirmFilterClk;
	
	return{
		"type":"key", "id":"cancel", "pos":[0, 0, 0], "w":sw, "h":sh, "ui_event":1, "key":0,  "anchor_h":0, "anchor_v":0, "down_scale":1,
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
			
			{css:cssLib["stdText"]([30, 30, 0], "", [text.length * 40, 40], text, {tColor:[0, 0, 0, 1], tSize:40, edge:0, edgeColor:[1, 1, 1, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
			{css:cssLib["simpleIcon"]([sw - imgW - 30, sh >> 1, 0], "selectFlag" + btnMsg, img, imgW, imgH, 0, 1), display:0},
			{
				"type":"icon", "id":"bg","pos":[0, sh - 1, 0], "w":sw, "h":1, "anchor_h":0, "anchor_v":0, 
				obj:{"type":"box", "color":[0, 0, 0, 0.2]},
			},
		],
	};
};