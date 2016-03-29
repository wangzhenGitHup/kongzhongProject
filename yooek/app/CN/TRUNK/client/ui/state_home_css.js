this.initHomeCSS = function(sw, sh){
	var appEnv = this.appEnv;
	var page = this.page;
	var cssLib = page.cssLib;
	var textLib = appEnv.textLib;
	
	var topH = 90 + (appEnv.scaleFactorY - 1) * 15;
	var bottomBtnH = 0;//120 + (appEnv.scaleFactorY - 1) * 15;
	var adsH = 300 + (page.appEnv.scaleFactorY - 1) * 40;
	var listBoxAdsItemSize = [sw, adsH - 20];
	var adsItemSize = listBoxAdsItemSize;

	var paySh = 152 + (appEnv.scaleFactorX - 1) * 15;
	var gameItemY = topH + paySh + adsH;

	var remainItemH = sh - bottomBtnH - gameItemY;
	var cbArr = [this.openAdsClk, this.changeSelectState];
	var listBoxItemW = 104 + (appEnv.scaleFactorX * 15) + 40;
	var listBoxW = listBoxItemW * 4 - 40;
	
	return {
		"type":"item", "id":"homeItem","pos":[0, 0, 0], "w":sw,"h":sh,"ui_event":1,
		items:[
			{css:cssLib["mainAds"]([0, topH, 0], sw, adsH, 1, listBoxAdsItemSize, adsItemSize, this, cbArr),},//广告栏 
			
			{css:cssLib["main_pay"]([0, topH + adsH, 0], sw, paySh, 1, [listBoxW, paySh], [listBoxItemW, paySh], 
				this, [this.payMethodClk, null])},//充值栏 
			
			{css:cssLib["main_game"]([0, gameItemY, 0], sw, remainItemH, this, [this.onOpenGameGoodsListClk],
				[0.06, 0.47, 0.8, 1])},//游戏栏 
		],//End of: items
	};
};

