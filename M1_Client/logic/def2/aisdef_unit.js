﻿if(window.aisEnv.defLib && window.aisEnv.defLib.unit && !window.aisEnv.defLib.unit.inited)
{
	(function()
	{
		var defLib=window.aisEnv.defLib.unit;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		defLib["UntMarine"]={
		 codeName:"UntMarine",type:"Unit",name:textLib.unitName["UntMarine"],desc:textLib.unitInfo["UntMarine"],svrCodeName:"UntMarine",
		 icon:"chr_UntMarine",storageSize:1,storageSave:1,bldLvReq:1,levelTech:"tchUnit1",move:200,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:10000,storage:[{store:"Oil",type:"ResOil",num:10}]},attack:8,hp:45,cocDefName:"UntMarine1",CostGem:1},
				{cost:{time:10000,storage:[{store:"Oil",type:"ResOil",num:20}]},attack:11,hp:54,cocDefName:"UntMarine2",CostGem:1},
				{cost:{time:10000,storage:[{store:"Oil",type:"ResOil",num:50}]},attack:14,hp:65,cocDefName:"UntMarine3",CostGem:1},
				{cost:{time:10000,storage:[{store:"Oil",type:"ResOil",num:80}]},attack:18,hp:78,cocDefName:"UntMarine4",CostGem:1},
				{cost:{time:10000,storage:[{store:"Oil",type:"ResOil",num:100}]},attack:23,hp:95,cocDefName:"UntMarine5",CostGem:1},
				{cost:{time:10000,storage:[{store:"Oil",type:"ResOil",num:150}]},attack:30,hp:110,cocDefName:"UntMarine6",CostGem:1},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntMarine"]);

		defLib["UntSniper"]={
		 codeName:"UntSniper",type:"Unit",name:textLib.unitName["UntSniper"],desc:textLib.unitInfo["UntSniper"],svrCodeName:"UntSniper",
		 icon:"chr_UntSniper",storageSize:1,storageSave:1,bldLvReq:2,levelTech:"tchUnit2",move:300,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_all"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:20}]},attack:7,hp:20,cocDefName:"UntSniper1",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:40}]},attack:9,hp:23,cocDefName:"UntSniper2",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:100}]},attack:12,hp:28,cocDefName:"UntSniper3",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:160}]},attack:16,hp:33,cocDefName:"UntSniper4",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:200}]},attack:20,hp:40,cocDefName:"UntSniper5",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:300}]},attack:25,hp:48,cocDefName:"UntSniper6",CostGem:1},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntSniper"]);

		defLib["UntHacker"]={
		 codeName:"UntHacker",type:"Unit",name:textLib.unitName["UntHacker"],desc:textLib.unitInfo["UntHacker"],svrCodeName:"UntHacker",
		 icon:"chr_UntHacker",storageSize:1,storageSave:1,bldLvReq:3,levelTech:"tchUnit3",move:400,
		 favor:textLib.bldInfo["favor_res"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:15}]},attack:11,hp:25,cocDefName:"UntHacker1",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:25}]},attack:14,hp:30,cocDefName:"UntHacker2",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:50}]},attack:19,hp:36,cocDefName:"UntHacker3",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:80}]},attack:24,hp:43,cocDefName:"UntHacker4",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:100}]},attack:32,hp:52,cocDefName:"UntHacker5",CostGem:1},
				{cost:{time:15000,storage:[{store:"Oil",type:"ResOil",num:200}]},attack:40,hp:65,cocDefName:"UntHacker6",CostGem:1},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntHacker"]);

		defLib["UntCyber"]={
		 codeName:"UntCyber",type:"Unit",name:textLib.unitName["UntCyber"],desc:textLib.unitInfo["UntCyber"],svrCodeName:"UntCyber",
		 icon:"chr_UntCyber",storageSize:5,storageSave:5,bldLvReq:4,levelTech:"tchUnit4",move:150,
		 favor:textLib.bldInfo["favor_def"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:200}]},attack:11,hp:300,cocDefName:"UntCyber1",CostGem:5},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:500}]},attack:14,hp:360,cocDefName:"UntCyber2",CostGem:5},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:1000}]},attack:19,hp:430,cocDefName:"UntCyber3",CostGem:5},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:2000}]},attack:24,hp:520,cocDefName:"UntCyber4",CostGem:5},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:2500}]},attack:31,hp:670,cocDefName:"UntCyber5",CostGem:5},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:3000}]},attack:40,hp:850,cocDefName:"UntCyber6",CostGem:5},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntCyber"]);

		defLib["UntTNTMac"]={
		 codeName:"UntTNTMac",type:"Unit",name:textLib.unitName["UntTNTMac"],desc:textLib.unitInfo["UntTNTMac"],svrCodeName:"UntTNTMac",
		 icon:"chr_UntTNTMac",storageSize:1,storageSave:1,bldLvReq:5,levelTech:"tchUnit5",move:300,
		 favor:textLib.bldInfo["favor_wall"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:500}]},attack:12,hp:20,cocDefName:"UntTNTMac1",CostGem:1},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:1000}]},attack:16,hp:24,cocDefName:"UntTNTMac2",CostGem:1},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:1500}]},attack:24,hp:29,cocDefName:"UntTNTMac3",CostGem:1},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:2500}]},attack:32,hp:35,cocDefName:"UntTNTMac4",CostGem:1},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:3000}]},attack:46,hp:42,cocDefName:"UntTNTMac5",CostGem:1},
				{cost:{time:60000,storage:[{store:"Oil",type:"ResOil",num:3500}]},attack:60,hp:54,cocDefName:"UntTNTMac6",CostGem:1},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntTNTMac"]);

		defLib["UntChop"]={
		 codeName:"UntChop",type:"Unit",name:textLib.unitName["UntChop"],desc:textLib.unitInfo["UntChop"],svrCodeName:"UntChop",
		 icon:"chr_UntChop",storageSize:5,storageSave:5,bldLvReq:6,levelTech:"tchUnit6",move:130,
		 favor:textLib.bldInfo["favor_def"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:1000}]},attack:25,hp:150,cocDefName:"UntChop1",CostGem:5},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:1500}]},attack:32,hp:180,cocDefName:"UntChop2",CostGem:5},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:2000}]},attack:48,hp:216,cocDefName:"UntChop3",CostGem:5},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:2500}]},attack:72,hp:280,cocDefName:"UntChop4",CostGem:5},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:3000}]},attack:108,hp:390,cocDefName:"UntChop5",CostGem:5},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:4000}]},attack:145,hp:545,cocDefName:"UntChop6",CostGem:5},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntChop"]);

		defLib["UntTank"]={
		 codeName:"UntTank",type:"Unit",name:textLib.unitName["UntTank"],desc:textLib.unitInfo["UntTank"],svrCodeName:"UntTank",
		 icon:"chr_UntTank",storageSize:4,storageSave:4,bldLvReq:7,levelTech:"tchUnit7",move:200,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_all"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:1500}]},attack:50,hp:75,cocDefName:"UntTank1",CostGem:4},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:2000}]},attack:70,hp:90,cocDefName:"UntTank2",CostGem:4},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:2500}]},attack:90,hp:108,cocDefName:"UntTank3",CostGem:4},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:3000}]},attack:125,hp:130,cocDefName:"UntTank4",CostGem:4},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:3500}]},attack:170,hp:156,cocDefName:"UntTank5",CostGem:4},
				{cost:{time:300000,storage:[{store:"Oil",type:"ResOil",num:4000}]},attack:190,hp:180,cocDefName:"UntTank6",CostGem:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntTank"]);

		defLib["UntHealer"]={
		 codeName:"UntHealer",type:"Unit",name:textLib.unitName["UntHealer"],desc:textLib.unitInfo["UntHealer"],svrCodeName:"UntHealer",
		 icon:"chr_UntHealer",storageSize:15,storageSave:15,bldLvReq:8,levelTech:"tchUnit8",move:800,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:600000,storage:[{store:"Oil",type:"ResOil",num:5000}]},attack:-35,hp:500,cocDefName:"UntHealer1",CostGem:15},
				{cost:{time:600000,storage:[{store:"Oil",type:"ResOil",num:7500}]},attack:-42,hp:600,cocDefName:"UntHealer2",CostGem:15},
				{cost:{time:600000,storage:[{store:"Oil",type:"ResOil",num:10000}]},attack:-50,hp:750,cocDefName:"UntHealer3",CostGem:15},
				{cost:{time:600000,storage:[{store:"Oil",type:"ResOil",num:12500}]},attack:-60,hp:900,cocDefName:"UntHealer4",CostGem:15},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntHealer"]);

		defLib["UntAvenger"]={
		 codeName:"UntAvenger",type:"Unit",name:textLib.unitName["UntAvenger"],desc:textLib.unitInfo["UntAvenger"],svrCodeName:"UntAvenger",
		 icon:"chr_UntAvenger",storageSize:20,storageSave:20,bldLvReq:9,levelTech:"tchUnit9",move:160,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_all"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:1200000,storage:[{store:"Oil",type:"ResOil",num:18000}]},attack:125,hp:1800,cocDefName:"UntAvenger1",CostGem:20},
				{cost:{time:1200000,storage:[{store:"Oil",type:"ResOil",num:22500}]},attack:150,hp:2000,cocDefName:"UntAvenger2",CostGem:20},
				{cost:{time:1200000,storage:[{store:"Oil",type:"ResOil",num:27000}]},attack:175,hp:2200,cocDefName:"UntAvenger3",CostGem:20},
				{cost:{time:1200000,storage:[{store:"Oil",type:"ResOil",num:35000}]},attack:200,hp:2400,cocDefName:"UntAvenger4",CostGem:20},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntAvenger"]);

		defLib["UntPEKKA"]={
		 codeName:"UntPEKKA",type:"Unit",name:textLib.unitName["UntPEKKA"],desc:textLib.unitInfo["UntPEKKA"],svrCodeName:"UntPEKKA",
		 icon:"chr_UntPEKKA",storageSize:25,storageSave:25,bldLvReq:10,levelTech:"tchUnit10",move:200,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:1800000,storage:[{store:"Oil",type:"ResOil",num:25000}]},attack:240,hp:2800,cocDefName:"UntPEKKA1",CostGem:25},
				{cost:{time:1800000,storage:[{store:"Oil",type:"ResOil",num:32000}]},attack:270,hp:3100,cocDefName:"UntPEKKA2",CostGem:25},
				{cost:{time:1800000,storage:[{store:"Oil",type:"ResOil",num:40000}]},attack:300,hp:3400,cocDefName:"UntPEKKA3",CostGem:25},
				{cost:{time:1800000,storage:[{store:"Oil",type:"ResOil",num:50000}]},attack:330,hp:3800,cocDefName:"UntPEKKA4",CostGem:25},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntPEKKA"]);

		defLib["UntUAV"]={
		 codeName:"UntUAV",type:"Unit",name:textLib.unitName["UntUAV"],desc:textLib.unitInfo["UntUAV"],svrCodeName:"UntUAV",
		 icon:"chr_UntUAV",storageSize:2,storageSave:2,bldLvReq:6,levelTech:"tchUnit11",move:400,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_all"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:45000,storage:[{store:"Cube",type:"ResCube",num:4}]},attack:40,hp:63,cocDefName:"UntUAV1",CostGem:2},
				{cost:{time:45000,storage:[{store:"Cube",type:"ResCube",num:6}]},attack:43,hp:69,cocDefName:"UntUAV2",CostGem:2},
				{cost:{time:45000,storage:[{store:"Cube",type:"ResCube",num:8}]},attack:48,hp:75,cocDefName:"UntUAV3",CostGem:2},
				{cost:{time:45000,storage:[{store:"Cube",type:"ResCube",num:10}]},attack:53,hp:82,cocDefName:"UntUAV4",CostGem:2},
				{cost:{time:45000,storage:[{store:"Cube",type:"ResCube",num:12}]},attack:57,hp:90,cocDefName:"UntUAV5",CostGem:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntUAV"]);

		defLib["UntRider"]={
		 codeName:"UntRider",type:"Unit",name:textLib.unitName["UntRider"],desc:textLib.unitInfo["UntRider"],svrCodeName:"UntRider",
		 icon:"chr_UntRider",storageSize:5,storageSave:5,bldLvReq:8,levelTech:"tchUnit12",move:300,
		 favor:textLib.bldInfo["favor_def"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:120000,storage:[{store:"Cube",type:"ResCube",num:20}]},attack:69,hp:345,cocDefName:"UntRider1",CostGem:5},
				{cost:{time:120000,storage:[{store:"Cube",type:"ResCube",num:24}]},attack:80,hp:396,cocDefName:"UntRider2",CostGem:5},
				{cost:{time:120000,storage:[{store:"Cube",type:"ResCube",num:28}]},attack:92,hp:460,cocDefName:"UntRider3",CostGem:5},
				{cost:{time:120000,storage:[{store:"Cube",type:"ResCube",num:32}]},attack:105,hp:529,cocDefName:"UntRider4",CostGem:5},
				{cost:{time:120000,storage:[{store:"Cube",type:"ResCube",num:40}]},attack:120,hp:603,cocDefName:"UntRider5",CostGem:5},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntRider"]);

		defLib["UntGolem"]={
		 codeName:"UntGolem",type:"Unit",name:textLib.unitName["UntGolem"],desc:textLib.unitInfo["UntGolem"],svrCodeName:"UntGolem",
		 icon:"chr_UntGolem",storageSize:30,storageSave:30,bldLvReq:10,levelTech:"tchUnit13",move:150,
		 favor:textLib.bldInfo["favor_def"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:2700000,storage:[{store:"Cube",type:"ResCube",num:260}]},attack:43,hp:5175,cocDefName:"UntGolem1",CostGem:30},
				{cost:{time:2700000,storage:[{store:"Cube",type:"ResCube",num:300}]},attack:48,hp:5750,cocDefName:"UntGolem2",CostGem:30},
				{cost:{time:2700000,storage:[{store:"Cube",type:"ResCube",num:350}]},attack:52,hp:6325,cocDefName:"UntGolem3",CostGem:30},
				{cost:{time:2700000,storage:[{store:"Cube",type:"ResCube",num:400}]},attack:57,hp:6900,cocDefName:"UntGolem4",CostGem:30},
				{cost:{time:2700000,storage:[{store:"Cube",type:"ResCube",num:450}]},attack:62,hp:7475,cocDefName:"UntGolem5",CostGem:30},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntGolem"]);

		defLib["UntGolemBomb"]={
		 codeName:"UntGolemBomb",type:"Unit",name:textLib.unitName["UntGolemBomb"],desc:textLib.unitInfo["UntGolemBomb"],svrCodeName:"UntGolemBomb",
		 icon:"chr_UntGolemBomb",move:0,
		 favor:textLib.bldInfo["favor_def"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_aoe"],
		 levels:[
				{cost:{time:1000,storage:[{store:"Cube",type:"ResCube",num:1}]},attack:345,hp:0,cocDefName:"UntGolemBomb1",CostGem:0},
				{cost:{time:1000,storage:[{store:"Cube",type:"ResCube",num:1}]},attack:460,hp:0,cocDefName:"UntGolemBomb2",CostGem:0},
				{cost:{time:1000,storage:[{store:"Cube",type:"ResCube",num:1}]},attack:575,hp:0,cocDefName:"UntGolemBomb3",CostGem:0},
				{cost:{time:1000,storage:[{store:"Cube",type:"ResCube",num:1}]},attack:690,hp:0,cocDefName:"UntGolemBomb4",CostGem:0},
				{cost:{time:1000,storage:[{store:"Cube",type:"ResCube",num:1}]},attack:805,hp:0,cocDefName:"UntGolemBomb5",CostGem:0},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntGolemBomb"]);

		defLib["UntDoctor"]={
		 codeName:"UntDoctor",type:"Unit",name:textLib.unitName["UntDoctor"],desc:textLib.unitInfo["UntDoctor"],svrCodeName:"UntDoctor",
		 icon:"chr_UntDoctor",storageSize:12,storageSave:12,bldLvReq:10,levelTech:"tchUnit14",move:150,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_all"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:1200000,storage:[{store:"Cube",type:"ResCube",num:150}]},attack:28,hp:86,cocDefName:"UntDoctor1",CostGem:12},
				{cost:{time:1200000,storage:[{store:"Cube",type:"ResCube",num:250}]},attack:34,hp:115,cocDefName:"UntDoctor2",CostGem:12},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntDoctor"]);

		defLib["UntMinion"]={
		 codeName:"UntMinion",type:"Unit",name:textLib.unitName["UntMinion"],desc:textLib.unitInfo["UntMinion"],svrCodeName:"UntMinion",
		 icon:"chr_UntMinion",move:300,
		 favor:textLib.bldInfo["favor_any"],target:textLib.bldInfo["target_gnd"],dmg_type:textLib.bldInfo["dmgtype_single"],
		 levels:[
				{cost:{time:1000,storage:[{store:"Cube",type:"ResCube",num:1}]},attack:28,hp:51,cocDefName:"UntMinion1",CostGem:0},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UntMinion"]);

		defLib.allUnits=["UntMarine","UntSniper","UntHacker","UntCyber","UntTNTMac","UntChop","UntTank","UntHealer","UntAvenger","UntPEKKA","UntUAV","UntRider","UntGolem","UntDoctor",];
		defLib.genlUnits=["UntMarine","UntSniper","UntHacker","UntCyber","UntTNTMac","UntChop","UntTank","UntHealer","UntAvenger","UntPEKKA",];
		defLib.cubeUnits=["UntUAV","UntRider","UntGolem","UntDoctor",];
	})();
}
