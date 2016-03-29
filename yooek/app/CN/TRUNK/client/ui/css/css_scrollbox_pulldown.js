
this.loadReFreshModel = function(obj, sw, posY)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;

	posY = posY ? posY : 0;
	return{
		"type":"item", "id":"loadRefreshItem", "pos":[0, 0, 0], "w":sw, "h":120, "ui_event":1, "anchor_v":0,
		items:[
			{
				"type":"icon", "pos":[0, posY, 0], "w":sw, "h":120, "anchor_h":0, "anchor_v":0,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["stdText"]([sw >> 1, 30, 0], "tip", [120, 30], textLib.txtPullDownFreshTip,
						{tColor:[0, 0, 0, 0.6], tSize:30, edge:0, edgeColor:[1, 1, 1, 1], align_h:1, align_v:1, anchor_h:1, anchor_v:1, wrap:0})},
				],
			},
		],
	};
};


