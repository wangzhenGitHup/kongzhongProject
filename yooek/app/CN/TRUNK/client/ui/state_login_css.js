this.initLoginCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var img;// = cssLib.genIconPath("main");
	var itemParameter = {
			tColor:[0.93, 0.51, 0.93, 1],
			tSize:60,
			edge:1,
			edgeColor:[0, 0, 0, 1],
			align_h:1, align_v:1,
			anchor_h:1, anchor_v:1,
			wrap:0,
	};
	
	if(sw < 640)
	{
		img = cssLib.genIconPath("guide_640x960");
	}
	else if(sw >= 640 && sw < 750)
	{
		if(sh <= 960)
		{
			img = cssLib.genIconPath("guide_640x960");
		}
		else
		{
			img = cssLib.genIconPath("guide_640x1136");
		}
	}
	else if(sw >= 750 && sw < 1242)
	{
		img = cssLib.genIconPath("guide_750x1334");
	}
	else
	{
		img = cssLib.genIconPath("guide_1242x2208");
	}
	/*	img = cssLib.genIconPath("guide_640x960");

	if(sw > 640)
	{
		if(sw / sh > 640 / 960)
		{
			sw = sw;
			sh = Math.floor(sw * 640 / 960);
		}
		else
		{
			sh = sh;
			sw = Math.floor(sh * 960 / 640);
		}
	}*/
	
	return {
		"type":"item", "id":"homeItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{
				"type":"icon","id":"bg", "w":sw, "h":sh, "ui_event":1, "pos":[0, 0, 0],
				obj:{"type":"image", "tex":img, "tex_u":0, "tex_v":0, "tex_uw":1,"tex_vh":1,},
			},
			{css:cssLib["stdText"]([sw >> 1, sh >> 1, 0], "processTip", [300, 60], "0%", itemParameter),
				ani:[{"type": "std", "fade": 1, "fade_pos": [sw >> 1, sh >> 1, 0], "fade_alpha": 0.2, "fade_size":1}]},
		],//End of: items
	};
};


