this.initTopBarCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var cbArr = [this.onBackClk, this.onCancelClk];
	
	return{
		"type":"item", "id":"gameListTopBarItem", "pos":[0, 0, 0], "w":sw, "h":sh, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgFirst"]("gameListTopBar", sw, sh, textLib.txtAllGameTip, this, this.onBackClk, 0)},
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
	
	return{
		"type":"item", "id":"seareachItem", "pos":[0, topH + (sh >> 1), 0], "w":sw, "h":sh, "ui_event":1,
		"anchor_h":0, "anchor_v":1,
		items:[
			{css:cssLib["search_model"]([0, 0, 0], sw, sh, param, this, [this.onSearchClk, this.getSearchGameKeyClk,
				this.onCancelClk])},
		],
	};
},

this.loadScrollBoxCSS = function(sw, sh)
{
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var posY = topH + 90;//topH + 121;
	
	return{
		"type":"icon", "id":"initMessageItem","pos":[0, posY, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		obj:{"type":"box", "color":[1, 1, 1, 1]},
		items:[
			{css:cssLib["scrollBox"]([0, 20, 0], sw, sh - 20, this)},
			{css:cssLib["word_state_bar"]([sw - 15, 0, 0], 60, sh, [1, 1, 1, 1], 24, this, this.wordSearchEvent)},
		],
	};
};


