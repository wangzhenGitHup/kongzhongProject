this.initHomeCSS = function(sw, sh){
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
	var params = {anchor_h:0, anchor_v:0, scale:1, upcolor:[1, 1, 1, 0], downcolor:[1, 1, 1, 0], };
	
	
	return {
		"type":"item", "id":"homeItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{css:cssLib["icon"]([0, 0, 0], "homePage", img, sw, sh, {av:0, ah:0})},

			{css:cssLib["key_box"]([144, 185, 0], 192, 40, params, this, this.humanAttackToRobotClk, 0)},
			
			{css:cssLib["key_box"]([144, 243, 0], 192, 40, params, this, this.humanAttackToHumanClk, 0)},
			
			{css:cssLib["key_box"]([144, 300, 0], 192, 40, params, this, this.humanAttackToHumanNetClk, 0)},
			
			{css:cssLib["key_box"]([144, 357, 0], 192, 40, params, this, this.rankListClk, 0)},
			
			{css:cssLib["key_box"]([144, 414, 0], 192, 40, params, this, this.achieveClk, 0)},
			
			{css:cssLib["key_box"]([144, 471, 0], 192, 40, params, this, this.clearAdsClk, 0)},
		],//End of: items
	};
};

