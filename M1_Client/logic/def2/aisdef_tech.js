﻿if(window.aisEnv.defLib && window.aisEnv.defLib.tech && !window.aisEnv.defLib.tech.inited)
{
	(function()
	{
		var defLib=window.aisEnv.defLib.tech;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		defLib["tchUnit1"]={
		 codeName:"tchUnit1",name:textLib.unitName["UntMarine"],icon:"chr_UntMarine",
		 levels:[
			{
				level:0,name:textLib.unitName["UntMarine"],icon:"chr_UntMarine",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv1"],storage:[],bldLv:1},
				cost:{time:21600000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:50000}]},
			},
			{
				level:1,name:textLib.unitName["UntMarine_lv1"],icon:"chr_UntMarine",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv1"],storage:[],bldLv:3},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:200000}]},
			},
			{
				level:2,name:textLib.unitName["UntMarine_lv2"],icon:"chr_UntMarine",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv1"],storage:[],bldLv:5},
				cost:{time:172800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:600000}]},
			},
			{
				level:3,name:textLib.unitName["UntMarine_lv3"],icon:"chr_UntMarine",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv1"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1800000}]},
			},
			{
				level:4,name:textLib.unitName["UntMarine_lv4"],icon:"chr_UntMarine",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv1"],storage:[],bldLv:7},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:4500000}]},
			},
			{
				level:5,name:textLib.unitName["UntMarine_lv5"],icon:"chr_UntMarine",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit2"]={
		 codeName:"tchUnit2",name:textLib.unitName["UntSniper"],icon:"chr_UntSniper",
		 levels:[
			{
				level:0,name:textLib.unitName["UntSniper"],icon:"chr_UntSniper",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv2"],storage:[],bldLv:1},
				cost:{time:43200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:80000}]},
			},
			{
				level:1,name:textLib.unitName["UntSniper_lv1"],icon:"chr_UntSniper",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv2"],storage:[],bldLv:3},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:300000}]},
			},
			{
				level:2,name:textLib.unitName["UntSniper_lv2"],icon:"chr_UntSniper",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv2"],storage:[],bldLv:5},
				cost:{time:259200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1000000}]},
			},
			{
				level:3,name:textLib.unitName["UntSniper_lv3"],icon:"chr_UntSniper",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv2"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2500000}]},
			},
			{
				level:4,name:textLib.unitName["UntSniper_lv4"],icon:"chr_UntSniper",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv2"],storage:[],bldLv:7},
				cost:{time:1036800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:7500000}]},
			},
			{
				level:5,name:textLib.unitName["UntSniper_lv5"],icon:"chr_UntSniper",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit3"]={
		 codeName:"tchUnit3",name:textLib.unitName["UntHacker"],icon:"chr_UntHacker",
		 levels:[
			{
				level:0,name:textLib.unitName["UntHacker"],icon:"chr_UntHacker",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv3"],storage:[],bldLv:1},
				cost:{time:43200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:50000}]},
			},
			{
				level:1,name:textLib.unitName["UntHacker_lv1"],icon:"chr_UntHacker",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv3"],storage:[],bldLv:3},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:300000}]},
			},
			{
				level:2,name:textLib.unitName["UntHacker_lv2"],icon:"chr_UntHacker",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv3"],storage:[],bldLv:5},
				cost:{time:259200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1000000}]},
			},
			{
				level:3,name:textLib.unitName["UntHacker_lv3"],icon:"chr_UntHacker",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv3"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2000000}]},
			},
			{
				level:4,name:textLib.unitName["UntHacker_lv4"],icon:"chr_UntHacker",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv3"],storage:[],bldLv:7},
				cost:{time:1209600000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:6000000}]},
			},
			{
				level:5,name:textLib.unitName["UntHacker_lv5"],icon:"chr_UntHacker",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit4"]={
		 codeName:"tchUnit4",name:textLib.unitName["UntCyber"],icon:"chr_UntCyber",
		 levels:[
			{
				level:0,name:textLib.unitName["UntCyber"],icon:"chr_UntCyber",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv4"],storage:[],bldLv:2},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:100000}]},
			},
			{
				level:1,name:textLib.unitName["UntCyber_lv1"],icon:"chr_UntCyber",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv4"],storage:[],bldLv:4},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:400000}]},
			},
			{
				level:2,name:textLib.unitName["UntCyber_lv2"],icon:"chr_UntCyber",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv4"],storage:[],bldLv:5},
				cost:{time:259200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1000000}]},
			},
			{
				level:3,name:textLib.unitName["UntCyber_lv3"],icon:"chr_UntCyber",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv4"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2750000}]},
			},
			{
				level:4,name:textLib.unitName["UntCyber_lv4"],icon:"chr_UntCyber",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv4"],storage:[],bldLv:7},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:6000000}]},
			},
			{
				level:5,name:textLib.unitName["UntCyber_lv5"],icon:"chr_UntCyber",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit5"]={
		 codeName:"tchUnit5",name:textLib.unitName["UntTNTMac"],icon:"chr_UntTNTMac",
		 levels:[
			{
				level:0,name:textLib.unitName["UntTNTMac"],icon:"chr_UntTNTMac",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv5"],storage:[],bldLv:2},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:100000}]},
			},
			{
				level:1,name:textLib.unitName["UntTNTMac_lv1"],icon:"chr_UntTNTMac",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv5"],storage:[],bldLv:4},
				cost:{time:172800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:400000}]},
			},
			{
				level:2,name:textLib.unitName["UntTNTMac_lv2"],icon:"chr_UntTNTMac",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv5"],storage:[],bldLv:5},
				cost:{time:259200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1000000}]},
			},
			{
				level:3,name:textLib.unitName["UntTNTMac_lv3"],icon:"chr_UntTNTMac",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv5"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2750000}]},
			},
			{
				level:4,name:textLib.unitName["UntTNTMac_lv4"],icon:"chr_UntTNTMac",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv5"],storage:[],bldLv:7},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:6500000}]},
			},
			{
				level:5,name:textLib.unitName["UntTNTMac_lv5"],icon:"chr_UntTNTMac",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit6"]={
		 codeName:"tchUnit6",name:textLib.unitName["UntChop"],icon:"chr_UntChop",
		 levels:[
			{
				level:0,name:textLib.unitName["UntChop"],icon:"chr_UntChop",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:2},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:100000}]},
			},
			{
				level:1,name:textLib.unitName["UntChop_lv1"],icon:"chr_UntChop",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:4},
				cost:{time:172800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:400000}]},
			},
			{
				level:2,name:textLib.unitName["UntChop_lv2"],icon:"chr_UntChop",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:5},
				cost:{time:259200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1000000}]},
			},
			{
				level:3,name:textLib.unitName["UntChop_lv3"],icon:"chr_UntChop",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2750000}]},
			},
			{
				level:4,name:textLib.unitName["UntChop_lv4"],icon:"chr_UntChop",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:7},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:6000000}]},
			},
			{
				level:5,name:textLib.unitName["UntChop_lv5"],icon:"chr_UntChop",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit7"]={
		 codeName:"tchUnit7",name:textLib.unitName["UntTank"],icon:"chr_UntTank",
		 levels:[
			{
				level:0,name:textLib.unitName["UntTank"],icon:"chr_UntTank",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv7"],storage:[],bldLv:3},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:150000}]},
			},
			{
				level:1,name:textLib.unitName["UntTank_lv1"],icon:"chr_UntTank",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv7"],storage:[],bldLv:4},
				cost:{time:172800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:500000}]},
			},
			{
				level:2,name:textLib.unitName["UntTank_lv2"],icon:"chr_UntTank",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv7"],storage:[],bldLv:5},
				cost:{time:259200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1500000}]},
			},
			{
				level:3,name:textLib.unitName["UntTank_lv3"],icon:"chr_UntTank",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv7"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:3000000}]},
			},
			{
				level:4,name:textLib.unitName["UntTank_lv4"],icon:"chr_UntTank",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv7"],storage:[],bldLv:7},
				cost:{time:1036800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:7000000}]},
			},
			{
				level:5,name:textLib.unitName["UntTank_lv5"],icon:"chr_UntTank",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit8"]={
		 codeName:"tchUnit8",name:textLib.unitName["UntHealer"],icon:"chr_UntHealer",
		 levels:[
			{
				level:0,name:textLib.unitName["UntHealer"],icon:"chr_UntHealer",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv8"],storage:[],bldLv:5},
				cost:{time:259200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1000000}]},
			},
			{
				level:1,name:textLib.unitName["UntHealer_lv1"],icon:"chr_UntHealer",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv8"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:3000000}]},
			},
			{
				level:2,name:textLib.unitName["UntHealer_lv2"],icon:"chr_UntHealer",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv8"],storage:[],bldLv:8},
				cost:{time:691200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:5000000}]},
			},
			{
				level:3,name:textLib.unitName["UntHealer_lv3"],icon:"chr_UntHealer",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit9"]={
		 codeName:"tchUnit9",name:textLib.unitName["UntAvenger"],icon:"chr_UntAvenger",
		 levels:[
			{
				level:0,name:textLib.unitName["UntAvenger"],icon:"chr_UntAvenger",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv9"],storage:[],bldLv:5},
				cost:{time:432000000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2000000}]},
			},
			{
				level:1,name:textLib.unitName["UntAvenger_lv1"],icon:"chr_UntAvenger",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv9"],storage:[],bldLv:6},
				cost:{time:1036800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:4500000}]},
			},
			{
				level:2,name:textLib.unitName["UntAvenger_lv2"],icon:"chr_UntAvenger",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv9"],storage:[],bldLv:8},
				cost:{time:1209600000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:7500000}]},
			},
			{
				level:3,name:textLib.unitName["UntAvenger_lv3"],icon:"chr_UntAvenger",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit10"]={
		 codeName:"tchUnit10",name:textLib.unitName["UntPEKKA"],icon:"chr_UntPEKKA",
		 levels:[
			{
				level:0,name:textLib.unitName["UntPEKKA"],icon:"chr_UntPEKKA",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv10"],storage:[],bldLv:6},
				cost:{time:691200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2500000}]},
			},
			{
				level:1,name:textLib.unitName["UntPEKKA_lv1"],icon:"chr_UntPEKKA",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv10"],storage:[],bldLv:6},
				cost:{time:1296000000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:6000000}]},
			},
			{
				level:2,name:textLib.unitName["UntPEKKA_lv2"],icon:"chr_UntPEKKA",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv10"],storage:[],bldLv:8},
				cost:{time:1296000000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:8000000}]},
			},
			{
				level:3,name:textLib.unitName["UntPEKKA_lv3"],icon:"chr_UntPEKKA",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit11"]={
		 codeName:"tchUnit11",name:textLib.unitName["UntUAV"],icon:"chr_UntUAV",
		 levels:[
			{
				level:0,name:textLib.unitName["UntUAV"],icon:"chr_UntUAV",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:3},
				cost:{time:432000000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:15000}]},
			},
			{
				level:1,name:textLib.unitName["UntUAV_lv1"],icon:"chr_UntUAV",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:4},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:30000}]},
			},
			{
				level:2,name:textLib.unitName["UntUAV_lv2"],icon:"chr_UntUAV",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:5},
				cost:{time:604800000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:50000}]},
			},
			{
				level:3,name:textLib.unitName["UntUAV_lv3"],icon:"chr_UntUAV",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv6"],storage:[],bldLv:6},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:70000}]},
			},
			{
				level:4,name:textLib.unitName["UntUAV_lv4"],icon:"chr_UntUAV",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit12"]={
		 codeName:"tchUnit12",name:textLib.unitName["UntRider"],icon:"chr_UntRider",
		 levels:[
			{
				level:0,name:textLib.unitName["UntRider"],icon:"chr_UntRider",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv8"],storage:[],bldLv:3},
				cost:{time:691200000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:20000}]},
			},
			{
				level:1,name:textLib.unitName["UntRider_lv1"],icon:"chr_UntRider",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv8"],storage:[],bldLv:4},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:40000}]},
			},
			{
				level:2,name:textLib.unitName["UntRider_lv2"],icon:"chr_UntRider",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv8"],storage:[],bldLv:5},
				cost:{time:1036800000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:75000}]},
			},
			{
				level:3,name:textLib.unitName["UntRider_lv3"],icon:"chr_UntRider",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv8"],storage:[],bldLv:6},
				cost:{time:1209600000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:100000}]},
			},
			{
				level:4,name:textLib.unitName["UntRider_lv4"],icon:"chr_UntRider",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit13"]={
		 codeName:"tchUnit13",name:textLib.unitName["UntGolem"],icon:"chr_UntGolem",
		 levels:[
			{
				level:0,name:textLib.unitName["UntGolem"],icon:"chr_UntGolem",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv10"],storage:[],bldLv:6},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:60000}]},
			},
			{
				level:1,name:textLib.unitName["UntGolem_lv1"],icon:"chr_UntGolem",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv10"],storage:[],bldLv:7},
				cost:{time:1036800000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:80000}]},
			},
			{
				level:2,name:textLib.unitName["UntGolem_lv2"],icon:"chr_UntGolem",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv10"],storage:[],bldLv:7},
				cost:{time:1209600000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:100000}]},
			},
			{
				level:3,name:textLib.unitName["UntGolem_lv3"],icon:"chr_UntGolem",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv10"],storage:[],bldLv:8},
				cost:{time:1209600000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:120000}]},
			},
			{
				level:4,name:textLib.unitName["UntGolem_lv4"],icon:"chr_UntGolem",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchUnit14"]={
		 codeName:"tchUnit14",name:textLib.unitName["UntDoctor"],icon:"chr_UntDoctor",
		 levels:[
			{
				level:0,name:textLib.unitName["UntDoctor"],icon:"chr_UntDoctor",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["Barrack_Lv10"],storage:[],bldLv:7},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Cube",type:"ResCube",num:90000}]},
			},
			{
				level:1,name:textLib.unitName["UntDoctor_lv1"],icon:"chr_UntDoctor",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchSpell1"]={
		 codeName:"tchSpell1",name:textLib.spellName["Lightning"],icon:"spell_Lightning",
		 levels:[
			{
				level:0,name:textLib.spellName["Lightning"],icon:"spell_Lightning",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv1"],storage:[],bldLv:2},
				cost:{time:43200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:100000}]},
			},
			{
				level:1,name:textLib.spellName["Lightning_lv1"],icon:"spell_Lightning",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv1"],storage:[],bldLv:3},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:250000}]},
			},
			{
				level:2,name:textLib.spellName["Lightning_lv2"],icon:"spell_Lightning",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv1"],storage:[],bldLv:4},
				cost:{time:172800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:500000}]},
			},
			{
				level:3,name:textLib.spellName["Lightning_lv3"],icon:"spell_Lightning",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv1"],storage:[],bldLv:5},
				cost:{time:345600000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1000000}]},
			},
			{
				level:4,name:textLib.spellName["Lightning_lv4"],icon:"spell_Lightning",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv1"],storage:[],bldLv:8},
				cost:{time:864000000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:6000000}]},
			},
			{
				level:5,name:textLib.spellName["Lightning_lv5"],icon:"spell_Lightning",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchSpell2"]={
		 codeName:"tchSpell2",name:textLib.spellName["Heal"],icon:"spell_Heal",
		 levels:[
			{
				level:0,name:textLib.spellName["Heal"],icon:"spell_Heal",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv2"],storage:[],bldLv:3},
				cost:{time:43200000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:100000}]},
			},
			{
				level:1,name:textLib.spellName["Heal_lv1"],icon:"spell_Heal",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv2"],storage:[],bldLv:4},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:250000}]},
			},
			{
				level:2,name:textLib.spellName["Heal_lv2"],icon:"spell_Heal",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv2"],storage:[],bldLv:5},
				cost:{time:172800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:500000}]},
			},
			{
				level:3,name:textLib.spellName["Heal_lv3"],icon:"spell_Heal",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv2"],storage:[],bldLv:6},
				cost:{time:345600000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1000000}]},
			},
			{
				level:4,name:textLib.spellName["Heal_lv4"],icon:"spell_Heal",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv2"],storage:[],bldLv:7},
				cost:{time:604800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:4800000}]},
			},
			{
				level:5,name:textLib.spellName["Heal_lv5"],icon:"spell_Heal",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchSpell3"]={
		 codeName:"tchSpell3",name:textLib.spellName["VVirus"],icon:"spell_VVirus",
		 levels:[
			{
				level:0,name:textLib.spellName["VVirus"],icon:"spell_VVirus",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv3"],storage:[],bldLv:3},
				cost:{time:86400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:200000}]},
			},
			{
				level:1,name:textLib.spellName["VVirus_lv1"],icon:"spell_VVirus",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv3"],storage:[],bldLv:4},
				cost:{time:172800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:800000}]},
			},
			{
				level:2,name:textLib.spellName["VVirus_lv2"],icon:"spell_VVirus",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv3"],storage:[],bldLv:5},
				cost:{time:345600000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:1500000}]},
			},
			{
				level:3,name:textLib.spellName["VVirus_lv3"],icon:"spell_VVirus",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv3"],storage:[],bldLv:6},
				cost:{time:518400000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:4500000}]},
			},
			{
				level:4,name:textLib.spellName["VVirus_lv4"],icon:"spell_VVirus",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv3"],storage:[],bldLv:8},
				cost:{time:1036800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:7250000}]},
			},
			{
				level:5,name:textLib.spellName["VVirus_lv5"],icon:"spell_VVirus",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib["tchSpell4"]={
		 codeName:"tchSpell4",name:textLib.spellName["ZGravity"],icon:"spell_ZGravity",
		 levels:[
			{
				level:0,name:textLib.spellName["ZGravity"],icon:"spell_ZGravity",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
				req:{features:["SpellLab_Lv4"],storage:[],bldLv:5},
				cost:{time:172800000,cash:0,gem:0,storage:[{store:"Oil",type:"ResOil",num:2000000}]},
			},
			{
				level:1,name:textLib.spellName["ZGravity_lv1"],icon:"spell_ZGravity",
				features:[],cityFeatures:[],kingFeatures:[],
				unlockVsb:{tech:[],bld:[],mfc:[]},
			},
			]
		};
		defLib.allTechs=["tchUnit1","tchUnit2","tchUnit3","tchUnit4","tchUnit5","tchUnit6","tchUnit7","tchUnit8","tchUnit9","tchUnit10","tchUnit11","tchUnit12","tchUnit13","tchUnit14","tchSpell1","tchSpell2","tchSpell3","tchSpell4",];
		defLib.genlTechs=["tchUnit1","tchUnit2","tchUnit3","tchUnit4","tchUnit5","tchUnit6","tchUnit7","tchUnit8","tchUnit9","tchUnit10","tchSpell1","tchSpell2","tchSpell3","tchSpell4",];
		defLib.cubeTechs=["tchUnit11","tchUnit12","tchUnit13","tchUnit14",];
	})();
}
