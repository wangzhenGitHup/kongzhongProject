/*
	搜索模块
*/

this.initTopBarCSS = function(obj, sw, sh, vo){
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var cbArr = [obj.onBackClk, obj.onCancelClk];
	var gameName = "游戏名称";//vo.gameName;
	
	return{
		"type":"item", "id":"gameListTopBarItem", "pos":[0, 0, 0], "w":sw, "h":sh, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgSecond"]("gameListTopBar", sw, sh, gameName, textLib.txtCancelTip, 72, 36, 36, obj, cbArr)},
		],
	};
},

this.initSeareachModelCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var topH = 100;
	var param = {anchor_h:0, anchor_v:1};
	
	return{
		"type":"item", "id":"seareachItem", "pos":[0, topH + (sh >> 1), 0], "w":sw, "h":sh, "ui_event":1, "anchor_h":0, "anchor_v":1,
		items:[
			{css:cssLib["sereach_model"]([0, 0, 0], sw, sh, param, obj, [obj.onSereachClk, this.getSereachGameKeyClk, this.onCancelClk])},
		],
	};
},

this.initLastSeareacheModelCSS = function(obj, sw)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 100;
	
	var tip = textLib.txtLastSeareachTip;
	var tipSize = page.appEnv.getTextSize(tip, 36, 0, sw);
	/*var scrollBoxH = appEnv.lastSeareachGameList.length;
	
	if(scrollBoxH > (sh - 20))
	{
		scrollBoxH = sh - 20;
	}
	else
	{
		scrollBoxH *= 60;
	}*/
	return{
		"type":"item", "id":"lastseareachmodelItem", "pos":[0, topH + 60, 0], "w":sw, "h":200, "ui_event":1, "anchor_v":0,
		items:[
			{
				"type":"icon", "pos":[0, 30, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, 0, 0], "tip", [tipSize.w, tipSize.h], tip, {tColor:[0, 0, 0, 1], tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},

			{
				"type":"icon", "pos":[0, 69, 0], "w":sw, "h":19, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
			},
			
			{css:cssLib["scrollBox"]([0, 80, 0], sw, 120)},
		],
	};
},

this.loadScrollBoxCSS = function(obj, sw, sh)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 100;
	var posY = topH + 260;
	
	return{
		"type":"icon", "id":"gameListItem","pos":[0, posY, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["word_state_bar"]([sw + 15, 0, 0], 30, sh - 20, [1, 1, 1, 1], 24)},
			{css:cssLib["scrollBox"]([0, 20, 0], sw, sh - 20)},
		],
	};
};


