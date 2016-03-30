﻿if(window.aisEnv.defLib && window.aisEnv.defLib.waveBattle && !window.aisEnv.defLib.waveBattle.inited)
{
	(function()
	{
		var defLib=window.aisEnv.defLib.waveBattle;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		defLib["stage1"]={
		 codeName:"stage1",FreeTimes:3,TotalTimes:100000000,name:textLib.waveBattleName["stage1"],desc:textLib.waveBattleInfo["stage1"],
		 Star:1,factors:{TownHallLevel:4,MechFactoryLevel:1,MechUpLevel:1,MechDownLevel:1,HangarNum:1,Honor:1},
		 loots:[
		  {type:"plu_comup_01",num:1},
		  {type:"plu_L9_06",num:1},
		 ],
		 stageLoots:[
		  {type:"plu_comup_03",num:1},
		  {type:"plu_L9_06",num:1},
		 ]
		};
		defLib["stage2"]={
		 codeName:"stage2",FreeTimes:1,TotalTimes:100000000,name:textLib.waveBattleName["stage2"],desc:textLib.waveBattleInfo["stage2"],
		 Star:2,factors:{TownHallLevel:7,MechFactoryLevel:1,MechUpLevel:1,MechDownLevel:1,HangarNum:1,Honor:1},
		 loots:[
		  {type:"plu_comup_01",num:1},
		  {type:"plu_L9_06",num:1},
		 ],
		 stageLoots:[
		  {type:"plu_comup_03",num:1},
		  {type:"plu_L9_06",num:1},
		 ]
		};
		defLib["stage3"]={
		 codeName:"stage3",FreeTimes:1,TotalTimes:100000000,name:textLib.waveBattleName["stage3"],desc:textLib.waveBattleInfo["stage3"],
		 Star:3,factors:{TownHallLevel:9,MechFactoryLevel:1,MechUpLevel:1,MechDownLevel:1,HangarNum:1,Honor:1},
		 loots:[
		  {type:"plu_comup_01",num:1},
		  {type:"plu_L9_06",num:1},
		 ],
		 stageLoots:[
		  {type:"plu_comup_03",num:1},
		  {type:"plu_L9_06",num:1},
		 ]
		};
	})();
}
