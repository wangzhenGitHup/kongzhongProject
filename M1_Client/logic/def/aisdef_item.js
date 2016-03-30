﻿if(window.aisEnv.defLib && window.aisEnv.defLib.item && !window.aisEnv.defLib.item.inited)
{
	(function()
	{
		var defLib=window.aisEnv.defLib.item;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		defLib["itm_token_1"]={
		codeName:"itm_token_1",Icon:"icon_itm_token_1_32",UseType:"",storageSize:1,
		ItemName:textLib.itemName["itm_token_1"],ItemDesc:textLib.itemInfo["itm_token_1"],
		};
		defLib["itm_token_2"]={
		codeName:"itm_token_2",Icon:"icon_itm_token_2_32",UseType:"",storageSize:1,
		ItemName:textLib.itemName["itm_token_2"],ItemDesc:textLib.itemInfo["itm_token_2"],
		};
		defLib["itm_token_3"]={
		codeName:"itm_token_3",Icon:"icon_itm_token_3_32",UseType:"",storageSize:1,
		ItemName:textLib.itemName["itm_token_3"],ItemDesc:textLib.itemInfo["itm_token_3"],
		};
		defLib["itm_token_4"]={
		codeName:"itm_token_4",Icon:"icon_itm_token_4_32",UseType:"",storageSize:1,
		ItemName:textLib.itemName["itm_token_4"],ItemDesc:textLib.itemInfo["itm_token_4"],
		};
		defLib["itm_paper"]={
		codeName:"itm_paper",Icon:"icon_itm_paper_32",UseType:"",storageSize:1,
		ItemName:textLib.itemName["itm_paper"],ItemDesc:textLib.itemInfo["itm_paper"],
		};
		defLib["itm_gift_1"]={
		codeName:"itm_gift_1",Icon:"icon_badge2764_32",UseType:"box",storageSize:1,
		ItemName:textLib.itemName["itm_gift_1"],ItemDesc:textLib.itemInfo["itm_gift_1"],
		cost:{time:0,cash:0,gem:0,storage:[{store:"Item",type:"itm_token_1",num:1},]},
		};
		defLib["itm_gift_2"]={
		codeName:"itm_gift_2",Icon:"icon_badge2864_32",UseType:"reward",storageSize:1,
		ItemName:textLib.itemName["itm_gift_2"],ItemDesc:textLib.itemInfo["itm_gift_2"],
		cost:{time:0,cash:0,gem:0,storage:[{store:"Item",type:"itm_token_2",num:1},]},
		};
	})();
}
