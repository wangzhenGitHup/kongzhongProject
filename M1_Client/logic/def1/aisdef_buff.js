﻿if(window.aisEnv.defLib && window.aisEnv.defLib.buff && !window.aisEnv.defLib.buff.inited)
{
	(function()
	{
		var defLib=window.aisEnv.defLib.buff;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		defLib["Shield"]={
			codeName:"Shield",name:textLib.buffName[""],desc:textLib.buffInfo[""],
			icon:"",durTime:0,
			cost:{cash:0,gem:0,storage:[]},
			shareName:"Shield",type:"Shield",
			factors:[
			]
		};

		defLib["Shield1D"]={
			codeName:"Shield1D",name:textLib.buffName["Shield1D"],desc:textLib.buffInfo["Shield1D"],
			icon:"buf_Shield1D",durTime:86400000,cooldown:259200000,
			cost:{cash:0,gem:50,storage:[]},
			shareName:"Shield",type:"Shield",
			factors:[
			]
		};

		defLib["Shield3D"]={
			codeName:"Shield3D",name:textLib.buffName["Shield3D"],desc:textLib.buffInfo["Shield3D"],
			icon:"buf_Shield3D",durTime:259200000,cooldown:604800000,
			cost:{cash:0,gem:100,storage:[]},
			shareName:"Shield",type:"Shield",
			factors:[
			]
		};

		defLib["Shield7D"]={
			codeName:"Shield7D",name:textLib.buffName["Shield7D"],desc:textLib.buffInfo["Shield7D"],
			icon:"buf_Shield7D",durTime:604800000,cooldown:1296000000,
			cost:{cash:0,gem:200,storage:[]},
			shareName:"Shield",type:"Shield",
			factors:[
			]
		};

		defLib["OilRush1"]={
			codeName:"OilRush1",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:3,storage:[]},
			shareName:"OilRush1",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush1"]);

		defLib["OilRush2"]={
			codeName:"OilRush2",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:3,storage:[]},
			shareName:"OilRush2",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush2"]);

		defLib["OilRush3"]={
			codeName:"OilRush3",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:4,storage:[]},
			shareName:"OilRush3",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush3"]);

		defLib["OilRush4"]={
			codeName:"OilRush4",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:4,storage:[]},
			shareName:"OilRush4",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush4"]);

		defLib["OilRush5"]={
			codeName:"OilRush5",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:5,storage:[]},
			shareName:"OilRush5",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush5"]);

		defLib["OilRush6"]={
			codeName:"OilRush6",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:5,storage:[]},
			shareName:"OilRush6",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush6"]);

		defLib["OilRush7"]={
			codeName:"OilRush7",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:6,storage:[]},
			shareName:"OilRush7",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush7"]);

		defLib["OilRush8"]={
			codeName:"OilRush8",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:6,storage:[]},
			shareName:"OilRush8",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush8"]);

		defLib["OilRush9"]={
			codeName:"OilRush9",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:7,storage:[]},
			shareName:"OilRush9",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush9"]);

		defLib["OilRush10"]={
			codeName:"OilRush10",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:7,storage:[]},
			shareName:"OilRush10",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush10"]);

		defLib["OilRush11"]={
			codeName:"OilRush11",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:8,storage:[]},
			shareName:"OilRush11",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush11"]);

		defLib["OilRush12"]={
			codeName:"OilRush12",name:textLib.buffName["oilrush"],desc:textLib.buffInfo["oilrush"],
			icon:"buf_oil",durTime:21600000,
			cost:{cash:0,gem:9,storage:[]},
			shareName:"OilRush12",type:"BldBoost",
			factors:[
				{scope:"Building",name:"OilWellSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["OilRush12"]);

		defLib["GoldRush1"]={
			codeName:"GoldRush1",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:3,storage:[]},
			shareName:"GoldRush1",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush1"]);

		defLib["GoldRush2"]={
			codeName:"GoldRush2",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:3,storage:[]},
			shareName:"GoldRush2",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush2"]);

		defLib["GoldRush3"]={
			codeName:"GoldRush3",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:4,storage:[]},
			shareName:"GoldRush3",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush3"]);

		defLib["GoldRush4"]={
			codeName:"GoldRush4",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:4,storage:[]},
			shareName:"GoldRush4",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush4"]);

		defLib["GoldRush5"]={
			codeName:"GoldRush5",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:5,storage:[]},
			shareName:"GoldRush5",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush5"]);

		defLib["GoldRush6"]={
			codeName:"GoldRush6",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:5,storage:[]},
			shareName:"GoldRush6",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush6"]);

		defLib["GoldRush7"]={
			codeName:"GoldRush7",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:6,storage:[]},
			shareName:"GoldRush7",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush7"]);

		defLib["GoldRush8"]={
			codeName:"GoldRush8",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:6,storage:[]},
			shareName:"GoldRush8",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush8"]);

		defLib["GoldRush9"]={
			codeName:"GoldRush9",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:7,storage:[]},
			shareName:"GoldRush9",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush9"]);

		defLib["GoldRush10"]={
			codeName:"GoldRush10",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:7,storage:[]},
			shareName:"GoldRush10",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush10"]);

		defLib["GoldRush11"]={
			codeName:"GoldRush11",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:8,storage:[]},
			shareName:"GoldRush11",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush11"]);

		defLib["GoldRush12"]={
			codeName:"GoldRush12",name:textLib.buffName["goldrush"],desc:textLib.buffInfo["goldrush"],
			icon:"buf_gold",durTime:21600000,
			cost:{cash:0,gem:9,storage:[]},
			shareName:"GoldRush12",type:"BldBoost",
			factors:[
				{scope:"Building",name:"GoldMineSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["GoldRush12"]);

		defLib["CubeRush1"]={
			codeName:"CubeRush1",name:textLib.buffName["cuberush"],desc:textLib.buffInfo["cuberush"],
			icon:"buf_cube",durTime:21600000,
			cost:{cash:0,gem:20,storage:[]},
			shareName:"CubeRush1",type:"BldBoost",
			factors:[
				{scope:"Building",name:"CubeWorkSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["CubeRush1"]);

		defLib["CubeRush2"]={
			codeName:"CubeRush2",name:textLib.buffName["cuberush"],desc:textLib.buffInfo["cuberush"],
			icon:"buf_cube",durTime:21600000,
			cost:{cash:0,gem:35,storage:[]},
			shareName:"CubeRush2",type:"BldBoost",
			factors:[
				{scope:"Building",name:"CubeWorkSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["CubeRush2"]);

		defLib["CubeRush3"]={
			codeName:"CubeRush3",name:textLib.buffName["cuberush"],desc:textLib.buffInfo["cuberush"],
			icon:"buf_cube",durTime:21600000,
			cost:{cash:0,gem:50,storage:[]},
			shareName:"CubeRush3",type:"BldBoost",
			factors:[
				{scope:"Building",name:"CubeWorkSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["CubeRush3"]);

		defLib["CubeRush4"]={
			codeName:"CubeRush4",name:textLib.buffName["cuberush"],desc:textLib.buffInfo["cuberush"],
			icon:"buf_cube",durTime:21600000,
			cost:{cash:0,gem:65,storage:[]},
			shareName:"CubeRush4",type:"BldBoost",
			factors:[
				{scope:"Building",name:"CubeWorkSpeed",mbf:2},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["CubeRush4"]);

		defLib["UnitRush1"]={
			codeName:"UnitRush1",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush1",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush1"]);

		defLib["UnitRush2"]={
			codeName:"UnitRush2",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush2",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush2"]);

		defLib["UnitRush3"]={
			codeName:"UnitRush3",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush3",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush3"]);

		defLib["UnitRush4"]={
			codeName:"UnitRush4",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush4",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush4"]);

		defLib["UnitRush5"]={
			codeName:"UnitRush5",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush5",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush5"]);

		defLib["UnitRush6"]={
			codeName:"UnitRush6",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush6",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush6"]);

		defLib["UnitRush7"]={
			codeName:"UnitRush7",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush7",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush7"]);

		defLib["UnitRush8"]={
			codeName:"UnitRush8",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush8",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush8"]);

		defLib["UnitRush9"]={
			codeName:"UnitRush9",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush9",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush9"]);

		defLib["UnitRush10"]={
			codeName:"UnitRush10",name:textLib.buffName["unitrush"],desc:textLib.buffInfo["unitrush"],
			icon:"buf_unit",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"UnitRush10",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["UnitRush10"]);

		defLib["SpellRush1"]={
			codeName:"SpellRush1",name:textLib.buffName["spellrush"],desc:textLib.buffInfo["spellrush"],
			icon:"buf_spell",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"SpellRush1",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["SpellRush1"]);

		defLib["SpellRush2"]={
			codeName:"SpellRush2",name:textLib.buffName["spellrush"],desc:textLib.buffInfo["spellrush"],
			icon:"buf_spell",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"SpellRush2",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["SpellRush2"]);

		defLib["SpellRush3"]={
			codeName:"SpellRush3",name:textLib.buffName["spellrush"],desc:textLib.buffInfo["spellrush"],
			icon:"buf_spell",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"SpellRush3",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["SpellRush3"]);

		defLib["SpellRush4"]={
			codeName:"SpellRush4",name:textLib.buffName["spellrush"],desc:textLib.buffInfo["spellrush"],
			icon:"buf_spell",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"SpellRush4",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["SpellRush4"]);
		defLib["SpellRush5"]={
			codeName:"SpellRush5",name:textLib.buffName["spellrush"],desc:textLib.buffInfo["spellrush"],
			icon:"buf_spell",durTime:2700000,
			cost:{cash:0,gem:10,storage:[]},
			shareName:"SpellRush5",type:"BldBoost",
			factors:[
				{scope:"Building",name:"MFCSpeed",mbf:4},
			]
		};
		window.aisEnv.defLib.hashFactors(defLib["SpellRush5"]);

		defLib["GemRush"]={
			codeName:"GemRush",name:textLib.buffName["gemrush"],desc:textLib.buffInfo["gemrush"],
			icon:"buf_gem",durTime:0,
			cost:{cash:0,gem:100,storage:[]},
			shareName:"GemRush",type:"BldBoost",
			factors:[
				{scope:"Building",name:"DiamondMineSpeed",add:0},
			]
		};

		defLib.catalogShields=["Shield1D","Shield3D","Shield7D",];
	})();
}
