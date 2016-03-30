﻿{//农民
	def_name:"chr_Farmer",type:2,sub_type:1,id:0,tile_w:0,tile_h:0,core_w:1,core_h:1,
	ed_size:0.5,ed_r:0,ed_attack:1,
	ani_body:"chr_Farmer",ani_bg:"chr_Farmer_shadow",
	layer_bg:"gnd_shadow",layer_body:"gnd_objs",layer_ui:"gnd_ui",
	layer_jump_bg:"sky_shadow",layer_jump_body:"sky_objs",
	hp:{full:100,cur:100,recover_speed:0},
	move:{speed:0.03,attack_range_max:0.7,fly:0,jump:1},
	effect_jumpon:"jump_on",effect_jumpoff:"jump_off",
},
{//工人
	def_name:"chr_Worker",type:2,sub_type:1,id:0,tile_w:0,tile_h:0,core_w:1,core_h:1,
	ed_size:0.5,ed_r:0,ed_attack:1,
	ani_body:"chr_Worker",ani_bg:"chr_Worker_shadow",
	layer_bg:"gnd_shadow",layer_body:"gnd_objs",layer_ui:"gnd_ui",
	layer_jump_bg:"sky_shadow",layer_jump_body:"sky_objs",
	hp:{full:100,cur:100,recover_speed:0},
	move:{speed:0.05,attack_range_max:0.7,fly:0,jump:1},
	effect_jumpon:"jump_on",effect_jumpoff:"jump_off",
},
{//海盗:
	def_name:"chr_Pirate",type:2,sub_type:1,id:0,tile_w:0,tile_h:0,core_w:1,core_h:1,
	attack:1,
	ani_body:"chr_Pirate_01",ani_bg:"chr_UntMarine_shadow",
	layer_bg:"gnd_shadow",layer_body:"gnd_objs",layer_ui:"gnd_ui",
	hp:{full:35,cur:35,recover_speed:0},
	move:{speed:0.05,attack_range_max:0.7,fly:0,jump:0},
	combat:{reload_time:30,attack_range_max:0.4,damage:10,perfer_dmg_mod:1.0,perfer_target:9,attack_air:0,attack_gnd:1},
	efts_depoly:["unit_deploy_UntMarine_1","unit_deploy_UntMarine_2","unit_deploy_UntMarine_3"],efts_crash:["unit_humankill_UntMarine"],
	efts_attack:["unit_UntMarine_fire_1","unit_UntMarine_fire_2","unit_UntMarine_fire_3"],efts_hit:[],efts_onhit:["unit_hit"]
},