this.initServiceProtocolCSS = function(sw, sh, cbobj, cb){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	
	return{
		"type":"icon", "id":"serviceItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1, "anchor_h":0, "anchor_v":0,
		obj:{"type":"box", "color":[1, 1, 1, 1], },
		items:[
			{css:cssLib["modelTopBgFirst"]("serviceTop", sw, topH, textLib.txtCustomServiceProtocol, this, this.onBackClk, 0)},
			{css:cssLib["scrollBox"]([0, topH + 20, 0], sw - 10, sh - topH - 20)},
		],
	};
}





