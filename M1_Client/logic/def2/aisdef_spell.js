if(window.aisEnv.defLib && window.aisEnv.defLib.spell && !window.aisEnv.defLib.spell.inited)
{
	(function()
	{
		var defLib=window.aisEnv.defLib.spell;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		defLib["Lightning"]={
		 codeName:"Lightning",type:"Spell",name:textLib.spellName["Lightning"],desc:textLib.spellInfo["Lightning"],svrCodeName:"Lightning",
		 icon:"spell_Lightning",storageSize:1,storageSave:1,bldLvReq:1,levelTech:"tchSpell1",
		 target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:2000}]},attack:50,hp:0,cocDefName:"Lightning1"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:4000}]},attack:55,hp:0,cocDefName:"Lightning2"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:6000}]},attack:60,hp:0,cocDefName:"Lightning3"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:8000}]},attack:65,hp:0,cocDefName:"Lightning4"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:10000}]},attack:70,hp:0,cocDefName:"Lightning5"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:25000}]},attack:80,hp:0,cocDefName:"Lightning6"},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["Lightning"]);

		defLib["Heal"]={
		 codeName:"Heal",type:"Spell",name:textLib.spellName["Heal"],desc:textLib.spellInfo["Heal"],svrCodeName:"Heal",
		 icon:"spell_Heal",storageSize:1,storageSave:1,bldLvReq:2,levelTech:"tchSpell2",
		 target:textLib.bldInfo["target_all"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:5000}]},attack:-10,hp:0,cocDefName:"Heal1"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:10000}]},attack:-15,hp:0,cocDefName:"Heal2"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:15000}]},attack:-20,hp:0,cocDefName:"Heal3"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:20000}]},attack:-25,hp:0,cocDefName:"Heal4"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:25000}]},attack:-30,hp:0,cocDefName:"Heal5"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:30000}]},attack:-40,hp:0,cocDefName:"Heal6"},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["Heal"]);

		defLib["VVirus"]={
		 codeName:"VVirus",type:"Spell",name:textLib.spellName["VVirus"],desc:textLib.spellInfo["VVirus"],svrCodeName:"VVirus",
		 icon:"spell_VVirus",storageSize:1,storageSave:1,bldLvReq:3,levelTech:"tchSpell3",
		 target:textLib.bldInfo["target_all"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:10000}]},attack:0,hp:0,cocDefName:"VVirus1"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:20000}]},attack:0,hp:0,cocDefName:"VVirus2"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:30000}]},attack:0,hp:0,cocDefName:"VVirus3"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:40000}]},attack:0,hp:0,cocDefName:"VVirus4"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:50000}]},attack:0,hp:0,cocDefName:"VVirus5"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:60000}]},attack:0,hp:0,cocDefName:"VVirus6"},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["VVirus"]);

		defLib["ZGravity"]={
		 codeName:"ZGravity",type:"Spell",name:textLib.spellName["ZGravity"],desc:textLib.spellInfo["ZGravity"],svrCodeName:"ZGravity",
		 icon:"spell_ZGravity",storageSize:1,storageSave:1,bldLvReq:4,levelTech:"tchSpell4",
		 target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:40000}]},attack:0,hp:0,cocDefName:"ZGravity1"},
				{cost:{time:3600000,storage:[{store:"Gold",type:"ResGold",num:60000}]},attack:0,hp:0,cocDefName:"ZGravity2"},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["ZGravity"]);

		defLib.allSpells=["Lightning","Heal","VVirus","ZGravity",];
	})();
}
