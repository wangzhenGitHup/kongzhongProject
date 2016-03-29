this.initMyGame = function(obj, sw, sh, isHaveCollectGames)
{
	var appEnv = obj.appEnv;
	var page = obj.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var seareachImg = "sereach_unselect";
	var seareachImgW = 60 + (appEnv.scaleFactorY - 1) * 15;
	var seareachImgH = 58 + (appEnv.scaleFactorY - 1) * 15;
	var collectGameBgH = 80;
	var collectIcon = "collect_flag";
	var collectIconW = 39;
	var collectIconH = 38;
	var btnEditorIcon = "btn3";
	var btnEditorIconW = 92 + (appEnv.scaleFactorY - 1) * 15;
	var btnEditorIconH = 60 + (appEnv.scaleFactorY - 1) * 15;
	var params = {tColor:[1, 1, 1, 1], tSize:30 + (appEnv.scaleFactorY - 1) * 2, edge:0, edgeColor:[0, 0, 0, 1], align_h:1, align_v:1, anchor_h:0, 
		anchor_v:1, wrap:0, scale:0.98};
		
	var btnFinishIcon = "btn5";
	var css1 = null;
	var css2 = null;
	var gamesBgY = topH + collectGameBgH + 1;
	var gamesBgH = sh - gamesBgY;
	var btnCollectIcon = "btn_collect_game";
	var btnCollectIconW = 80;
	var btnCollectIconH = 80;

//===================================================
	var gridBoxListItemW = 132;
	var gridBoxListItemH = 152;
	var gridBoxListW = sw - 40;
	var gridBoxListH = sh - btnCollectIconH * 2 - topH - collectGameBgH;//280;
//===================================================
	//if(isHaveCollectGames)
	{
		css1 = {css:cssLib["gird_box"]([20, 20, 0], gridBoxListW, gridBoxListH, gridBoxListItemW, gridBoxListItemH),
			display:isHaveCollectGames};
	}
	//else
	{
		var noGameIcon = "nohave_game_flag";
		var noGameIconW = 249;
		var noGameIconH = 301;
		css2 = {css:cssLib["logo_undeline_txt"]([sw >> 1, (gamesBgH >> 1) - 50, 0], "noGameTip", noGameIcon, noGameIconW,
			noGameIconH, textLib.txtNoHaveGamesTip, 40, [0, 0, 0, 1], 0, []), display:isHaveCollectGames?0:1};
	}
	
	return{
		"type":"item", "id":"myGameItem","pos":[0, 0, 0], "w":sw, "h":sh, "anchor_h":0, "anchor_v":0, "ui_event":1,
		items:[
			{css:cssLib["modelTopBgThrid"]("myGameTop", sw, topH, textLib.txtMyGame, seareachImg, seareachImg,
				seareachImgW, seareachImgH, {ah:0, av:1, scale:0.98}, obj, [obj.onBackClk, obj.onSeareachClk])},
				
			{
				"type":"icon", "pos":[0, topH + (collectGameBgH >> 1), 0], "id":"collectGameBg", "w":sw, "h":collectGameBgH,
				"anchor_h":0, "anchor_v":1, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					{css:cssLib["simpleIcon"]([20, 0, 0], "flag", collectIcon, collectIconW, collectIconH, 0, 1)},
					
					{css:cssLib["stdText"]([collectIconW + 30, 0, 0], "tip", [textLib.txtCollectGameTip.length * 30, 30],
						textLib.txtCollectGameTip, {tColor:[0, 0, 0, 1], tSize:30, edge:0, edgeColor:[0, 0, 0, 1], align_h:0, align_v:1, anchor_h:0, anchor_v:1, wrap:0})},
					
					{css:cssLib["key_icon_txt"]([sw - btnEditorIconW - 10, 0, 0], "editorGame", btnEditorIcon, btnEditorIcon,
						textLib.txtEditorTip, btnEditorIconW, btnEditorIconH, params, obj, obj.onEditorGameClk, 0), "display":isHaveCollectGames},
					
					{css:cssLib["key_icon_txt"]([sw - btnEditorIconW - 10, 0, 0], "finishGame", btnFinishIcon, btnFinishIcon,
						textLib.txtFinishTip, btnEditorIconW, btnEditorIconH, params, obj, obj.onFinishEditorGameClk, 0), "display":0},
				],
			},
			
			{
				"type":"icon", "pos":[0, gamesBgY, 0], "id":"gamesBg", "w":sw, "h":gamesBgH,
				"anchor_h":0, "anchor_v":0, "ui_event":1,
				obj:{"type":"box", "color":[1, 1, 1, 1]},
				items:[
					css1,
					css2,
					{css:cssLib["key_icon"]([sw - 20 - btnCollectIconW, gamesBgH - btnCollectIconH, 0], "btnCollect",
						btnCollectIcon, btnCollectIcon, btnCollectIconW, btnCollectIconH, {ah:0, av:1, scale:0.98},
						obj, obj.onOpenCollectGamePageClk, 0)},
				],
			},
		],
	};
};