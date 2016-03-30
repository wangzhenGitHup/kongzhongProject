this.initMainCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;

	var img = "background";
	var imgW = sw;
	var imgH = sh;
	var upBtnImg = "buttonNormal";
	var downBtnImg = "buttonSelect";
	var btnImgW = 100;
	var btnImgH = 40;
	var params = {anchor_h:0, anchor_v:0, scale:1, align_h:1, align_v:1, edge:0, edgeColor:[0, 0, 0, 0], tSize:24, tColor:[0, 0, 0, 1]};
	
	var title = "五子棋";
	var itemParameter = {tColor:[0, 0, 0, 1], tSize:32, edge:0, edgeColor:[0, 0, 0, 0], align_h:0, align_v:0, anchor_h: 0, anchor_v:0, wrap:0};
	var titleSize = appEnv.getTextSize(title, 32, 0, sw);
	
	return {
		"type":"item", "id":"mainItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			/*{css:cssLib["icon"]([0, 0, 0], "mainPage", img, sw, sh, {av:0, ah:0})},
			{css:cssLib["stdText"]([(sw - titleSize.w) >> 1, 30, 0], "title", titleSize, title, itemParameter)},
			{css:cssLib["key_icon_txt"]([(sw - btnImgW) >> 1, (sh - btnImgH) / 2 + 60, 0], "startGame",
				upBtnImg, downBtnImg, "开始游戏", btnImgW, btnImgH, params, this, this.startGame, 0)},*/
		],//End of: items
	};
};

