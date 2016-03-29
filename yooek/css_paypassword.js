/*this.pmtChoiceCSS = function(obj, sw, sh, text){
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	
	var frameW = 400;
	var frameH = 200;

	var textSize = appEnv.getTextSize(text, 30, 0, sw);
	
	var icon = "btn5";
	var iconW = 115;
	var iconH = 50;
	var params = {anchor_h:0, anchor_v:0, tColor:[0, 0, 0, 1], tSize:30, align_h:1, align_v:1, edge:0, edgeClr:[]};
	
	return{
		"type":"icon", "id":"pmtChoiceItem","pos":[(sw - frameW) >> 1, (sh - frameH) >> 1, 0],"w":frameW,"h":frameH,"anchor_h":0,"anchor_v":0,
		"ui_event":1,
		obj:{"type":"box", "color":[0, 1, 0, 0.2], },
		items:[
			{css:cssLib["stdText"]([(frameW - textSize.w) >> 1, 20, 0], "tip", [textSize.w, textSize.h], text, {tColor:[0, 0, 0, 1], tSize:40, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:0, anchor_h:0, anchor_v:0, wrap:0})},
			{css:cssLib["key_icon_txt"]([30,  frameH - iconH - 10, 0], "", icon, icon, textLib.txtConfirmTip, iconW, iconH, params, obj, obj.onConfirmPmtClk)},
			{css:cssLib["key_icon_txt"]([frameW - iconW - 30,  frameH - iconH - 10, 0], "", icon, icon, textLib.txtCancelTip, iconW, iconH, params, obj, obj.onCancelPmtClk)},
		],
	};
},*/

this.pmtShowCSS = function(obj, sw, sh, text)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	
	var frameW = 400;
	var frameH = 200;
	
	var frameW = 400;
	var frameH = 200;

	var textSize = appEnv.getTextSize(text, 30, 0, sw);
	
	return {
		"type":"item", "id":"pmtShowItem","pos":[(sw - frameW) >> 1, (sh - frameH) >> 1, 0], "w":frameW, "h":frameH,
		"ui_event":1,
		ani: [
				{"type": "std", "fade": 1, "fade_pos": [(sw - frameW) >> 1, (sh - frameH) >> 1, 0],
				"fade_alpha": 0.0, "fade_size": 1},
				
				{"type": "std", "fade": 1, "fade_pos": [(sw - frameW) >> 1, -(sh - frameH) / 2, 0],
					"fade_alpha": 0.0, "fade_size": 1},
		],
		items:[
			{css:cssLib["stdText"]([(frameW - textSize.w) >> 1, 20, 0], "tip", [textSize.w, textSize.h],
				text, {tColor:[1, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:1,
					align_v:1, anchor_h:0, anchor_v:0, wrap:0})},
		],
	};
};