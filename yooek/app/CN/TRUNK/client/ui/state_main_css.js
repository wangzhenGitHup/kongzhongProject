this.initMainCSS = function(sw, sh, text){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (page.appEnv.scaleFactorY - 1) * 15;
	
	var bottomBgH = 120 + (appEnv.scaleFactorY - 1) * 15;
	var bottomBtnW = 80 + (appEnv.scaleFactorY - 1) * 15;
	var bottomBtnH = 80 + (appEnv.scaleFactorY - 1) * 15;
	var bottomGap = (sw - bottomBtnW * 4) / 3;
	var bottomBtnImgs = ["main", "message", "game", "my"];
	var img = "message_tip";
	var imgW = 32;
	var imgH = 22;
	var messageX = bottomGap + bottomBtnW;
	
	return {
		"type":"item", "id":"mainItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{
				"type":"item", "id":"mainTopRect", "pos":[0, 0, 0],"w":sw, "h":topH, "ui_event":1,
				items:[
					{css:cssLib["mainTopBarBeforeLogin"](sw, topH, this, [this.loginAndRegisterClk, this.sereachClk],
						textLib.txtLoginAndRegisterTip, 36),},//顶部  
				],
			},
			
			{
				"type":"item", "id":"mainTopRectLogin", "pos":[0, 0, 0],"w":sw, "h":topH, "ui_event":1,"display":0,
				items:[
					{css:cssLib["mainTopBarAfterLogin"](sw, topH, this, [this.onEnterMyGameClk, this.onEnterMyOrderClk,
						this.sereachClk], textLib.txtMyGame, textLib.txtOrderTip, 36),},//顶部  
				],
			},
			
			{
				"type":"icon", "id":"mainBottomRect", "pos":[0, sh - (bottomBgH >> 1), 0],"w":sw,"h":bottomBgH,"anchor_h":0,"anchor_v":1,"ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["mainBottom"]([0, -15, 0], bottomBtnW, bottomBtnH, this, this.switchMainPage, 1, bottomBtnImgs[0],
						30, textLib.txtMainPageTip)},//底部 
					
					{css:cssLib["mainBottom"]([bottomGap + bottomBtnW, -15, 0], bottomBtnW, bottomBtnH, this, this.switchMainPage,
						2, bottomBtnImgs[1], 30, textLib.txtMessageTip)},//底部 
					
					{css:cssLib["mainBottom"]([(bottomGap + bottomBtnW) << 1, -15, 0], bottomBtnW, bottomBtnH, this,
						this.switchMainPage, 3, bottomBtnImgs[2], 30, textLib.txtMainGameTip)},//底部 
					
					{css:cssLib["mainBottom"]([(bottomGap + bottomBtnW) * 3, -15, 0], bottomBtnW, bottomBtnH, this,
						this.switchMainPage, 4, bottomBtnImgs[3], 30, textLib.txtMainMeTip)},//底部 
					
					{css:cssLib["icon_number"]([bottomGap + bottomBtnW + bottomBtnW - imgW + 20, (imgH -bottomBgH) >> 1, 0],
						"messageTip", img, imgW, imgH, text, 16, [1, 1, 1, 1], 1, [1, 0, 0, 1])},
				],
			},
		],//End of: items
	};
};

