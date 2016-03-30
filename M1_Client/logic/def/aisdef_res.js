if(window.aisEnv.defLib && window.aisEnv.defLib.prdct && !window.aisEnv.defLib.prdct.inited)
{
	//资源的DEF:
	(function()
	{
		var defLib=window.aisEnv.defLib.prdct;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		//金矿
		defLib["ResGold"]={
			codeName:"ResGold",type:"Res",storageSize:1,name:textLib.prdctName["gold"],desc:textLib.prdctInfo["gold"],
			icon:"res_gold",storageSave:1,
		};
		window.aisEnv.defLib.hashFactors(defLib["ResGold"]);

		//油矿
		defLib["ResOil"]={
			codeName:"ResOil",type:"Res",storageSize:1,name:textLib.prdctName["oil"],desc:textLib.prdctInfo["oil"],
			icon:"res_oil",storageSave:1,
		};
		window.aisEnv.defLib.hashFactors(defLib["ResOil"]);

		//钻石矿
		defLib["ResGem"]={
			codeName:"ResGem",type:"Res",storageSize:1,name:textLib.prdctName["gem"],desc:textLib.prdctInfo["gem"],
			icon:"res_gem",storageSave:1,
		};
		window.aisEnv.defLib.hashFactors(defLib["ResGem"]);

		//时间碎片
		defLib["CutTime"]={
			codeName:"CutTime",type:"Res",storageSize:1,name:textLib.prdctName["cuttime"],desc:textLib.prdctInfo["cuttime"],
			icon:"res_cuttime",storageSave:1,
		};
		window.aisEnv.defLib.hashFactors(defLib["CutTime"]);

		//能量块矿
		defLib["ResCube"]={
			codeName:"ResCube",type:"Res",storageSize:1,name:textLib.prdctName["cube"],desc:textLib.prdctInfo["cube"],
			icon:"res_chip",storageSave:1,
		};
		window.aisEnv.defLib.hashFactors(defLib["ResCube"]);
	})();
}
