/*
	搜索模块
*/
this.initTopBarCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var cbArr = [this.onBackClk, this.onCancelClk];
	
	return{
		"type":"item", "id":"gameListTopBarItem", "pos":[0, 0, 0], "w":sw, "h":sh, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgSecond"]("gameListTopBar", sw, sh, textLib.txtSearchTip, textLib.txtCancelTip,
				80, 80, 40, this, cbArr)},
		],
	};
},

this.initSearchModelCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var param = {anchor_h:0, anchor_v:0};
	var cbArr = [this.onSearchClk, this.getSearchGameKeyClk, this.onClearKeyClk];
	
	return{
		"type":"item", "id":"searchItem", "pos":[0, topH + (sh >> 1), 0], "w":sw, "h":sh, "ui_event":1,
		"anchor_h":0, "anchor_v":1,
		items:[
			{css:cssLib["search_model"]([0, 0, 0], sw, sh, param, this, cbArr)},
		],
	};
},

this.initLastSearchModelCSS = function(sw)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	var tip = textLib.txtLastSearchTip;
	var tipSize = page.appEnv.getTextSize(tip, 36, 0, sw);

	return{
		"type":"item", "id":"lastsearchmodelItem", "pos":[0, topH + 90, 0], "w":sw, "h":303, "ui_event":1, "anchor_v":0,
		items:[
			{
				"type":"icon", "pos":[0, 30, 0], "w":sw, "h":60, "anchor_h":0, "anchor_v":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([10, 0, 0], "tip", [tipSize.w, tipSize.h], tip, {tColor:[0, 0, 0, 1],
						tSize:36, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
				],
			},

			//{css:cssLib["scrollBox"]([0, 80, 0], sw, 120)},
			{css:cssLib["last_search"](61, "lastSeareach0", appEnv.lastSeareachGameList[0], this, this.onConfirmSeareachClk, 0),
				display:0},
			
			{css:cssLib["last_search"](142, "lastSeareach1", appEnv.lastSeareachGameList[1], this, this.onConfirmSeareachClk, 1),
				display:0},
			
			{css:cssLib["last_search"](223, "lastSeareach2", appEnv.lastSeareachGameList[2], this, this.onConfirmSeareachClk, 2),
				display:0},
		],
	};
},

this.loadScrollBoxCSS = function(sw, sh, posY)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	
	return{
		"type":"icon", "id":"gameListItem","pos":[0, posY, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["scrollBox"]([0, 10, 0], sw, sh - 10, this)},
			{css:cssLib["word_state_bar"]([sw - 15, 0, 0], 60, sh, [1, 1, 1, 1], 24, this, this.wordSearchEvent)},
		],
	};
};


