﻿{//复仇者战轰-1
	name:"chr_UntAvenger_01",type:"node",node:page.genPageURL("mesh/hellfire.j3d"),scale:1.8,
	actions:[
		{name:"stay",subani:[{name:"stay_1",weight:10,loop:1,frame_start:0,frame_num:1},],rot_mode:1,rot_factor:0.125},
		null,//crashed
		{name:"move",subani:[{name:"move_1",weight:10,loop:1,frame_start:0,frame_num:1},],rot_mode:1,rot_factor:0.125},
		{name:"attack",subani:[{name:"attack_1",weight:10,loop:1,frame_start:0,frame_num:1},],rot_mode:1,rot_factor:0.125},
		null,//work
		{name:"cheer",subani:[{name:"cheer_1",weight:10,loop:1,frame_start:0,frame_num:1},],rot_mode:1,rot_factor:0.125},
	]
},
{//复仇者战轰-2
	name:"chr_UntAvenger_02",type:"sprite",libs:[page.genPageURL(window.imgPath+"/units/chr_UntAvenger.spl")],
	actions:[
		{name:"stay",subani:[{name:"stay_1",weight:10,loop:1,dit_mode:0,sprite:"chr_UntAvenger_02_stay001"},]},
		null,//crashed
		{name:"move",subani:[{name:"move_1",weight:10,loop:1,dit_mode:4,sprite:"chr_UntAvenger_02_walk001"},]},
		{name:"attack",subani:[{name:"attack_1",weight:10,loop:1,dit_mode:7,sprite:"chr_UntAvenger_02_attack1001"},]},
		null,//work
		{name:"cheer",subani:[{name:"cheer_1",weight:10,loop:1,dit_mode:0,sprite:"chr_UntAvenger_02_cheer1001"},]},
	]
},
{//复仇者战轰-3
	name:"chr_UntAvenger_03",type:"sprite",libs:[page.genPageURL(window.imgPath+"/units/chr_UntAvenger.spl")],
	actions:[
		{name:"stay",subani:[{name:"stay_1",weight:10,loop:1,dit_mode:0,sprite:"chr_UntAvenger_03_stay001"},]},
		null,//crashed
		{name:"move",subani:[{name:"move_1",weight:10,loop:1,dit_mode:4,sprite:"chr_UntAvenger_03_walk001"},]},
		{name:"attack",subani:[{name:"attack_1",weight:10,loop:1,dit_mode:7,sprite:"chr_UntAvenger_03_attack1001"},]},
		null,//work
		{name:"cheer",subani:[{name:"cheer_1",weight:10,loop:1,dit_mode:0,sprite:"chr_UntAvenger_03_cheer1001"},]},
	]
},
