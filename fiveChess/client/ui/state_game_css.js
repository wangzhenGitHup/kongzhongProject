this.initCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;

	var img = "chessbox3";
	var imgW = 480;
	var imgH = 480;
	
	var upExitImg = "btn_u_exit";
	var downExitImg = "btn_d_exit";
	var btnImgW = 126;
	var btnImgH = 54;
	
	var upBackImg = "btn_u_back";
	var downBackImg = "btn_d_back";
	
	var upResetImg = "btn_u_reset";
	var downResetImg = "btn_d_reset";
	
	var params = {tColor:[1, 1, 1, 1], anchor_h:0, anchor_v:0, scale:1, tSize:24, align_h:1, align_v:1, edge:0, edgeColor:[0, 0, 0, 1]};
	
	var itemParameter = {tColor:[1, 0, 0, 1], anchor_h:0, anchor_v:0, tSize:20, wrap:0, edge:1, edgeColor:[0, 0, 0, 1], 
		align_h:0, align_v:0,};
		
	var robotTxt = "电脑下棋中....";
	var robotTxtSize = appEnv.getTextSize(robotTxt, 24, 0, sw);
	
	var tipText = "总共下了0局，您赢了0局，输了0局";
	var tipTextSize = appEnv.getTextSize(tipText, 20, 0, sw);
	
	return {
		"type":"item", "id":"gameItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{css:cssLib["icon"]([0, 0, 0], "title", "title", imgW, 160, {av:0, ah:0})},

			{css:cssLib["key_icon"]([10, 10, 0], "exitBtn", upExitImg, downExitImg, btnImgW, btnImgH, params, this, this.exitGameClk, 0)},
			
			{css:cssLib["key_icon"]([10, 20 + btnImgH, 0], "backChessBtn", upBackImg, downBackImg, btnImgW, btnImgH, params, this, this.recallPreStepClk, 1)},
			
			{css:cssLib["key_icon"]([sw - btnImgW - 10, 10, 0], "exitBtn", upResetImg, downResetImg, btnImgW, btnImgH, params, this, this.resetGameClk, 2)},
			
			{css:cssLib["icon"]([0, 160, 0], "gamePage", img, imgW, imgH, {av:0, ah:0})},
			
			{css:cssLib["stdText"]([(sw - tipTextSize.w) >> 1, 135, 0], "tip", tipTextSize, tipText, itemParameter)},
			//{css:cssLib["stdText"]([(sw - robotTxtSize.w) >> 1, 135, 0], "tip", robotTxtSize, robotTxt, itemParameter), display:0},
		],//End of: items
	};
};

