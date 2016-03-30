﻿if(window.aisEnv.defLib && window.aisEnv.defLib.globals && !window.aisEnv.defLib.globals.inited)
{
	(function()
	{
		var defLib=window.aisEnv.defLib.globals;
		var textLib=window.aisEnv.textLib;
		defLib.inited=1;
		defLib["BATTLE_REPLAY_DEF_VERSION"]=17;
		defLib["WAVE_BATTLE_REPLAY_DEF_VERSION"]=0;
		defLib["IOS_PUSH_MESSAGE_API_URL"]="http://192.168.130.116:8080/iospush/action/iospush.jsp?projectId=%s&deviceToken=%s&message=%s";
		defLib["ANDROID_PUSH_MESSAGE_API_URL"]="http://apmportal.ko.cn:8080/apm/action/pushMsg.jsp?projectId=%s&deviceId=%s&contents=%s";
		defLib["PROTECT_NEW_USER_TIME"]=24;
		defLib["RESOURCE_PRODUCTION_BOOST_MULTIPLIER"]=2;
		defLib["BARRACKS_BOOST_MULTIPLIER"]=4;
		defLib["SPELL_FACTORY_BOOST_MULTIPLIER"]=4;
		defLib["RESOURCE_PRODUCTION_BOOST_MINS"]=360;
		defLib["BARRACKS_BOOST_MINS"]=45;
		defLib["SPELL_FACTORY_BOOST_MINS"]=45;
		defLib["GEM_PER_SEC"]=0.1;
		defLib["STARTING_GEM"]=44;
		defLib["STARTING_GOLD"]=1000;
		defLib["STARTING_ELIXIR"]=1000;
		defLib["WORKER_COST_2"]=50;
		defLib["WORKER_COST_3"]=200;
		defLib["WORKER_COST_4"]=300;
		defLib["WORKER_COST_5"]=500;
		defLib["SELL_TRAPS_BUILDING"]=5;
		defLib["SOCIAL_SHARE_BONUS"]=0.5;
		defLib["SOCIAL_SHARE_COOLDOWN"]=12;
		defLib["SELL_DECORATE_BUILDING"]=10;
		defLib["SPELL_CANCEL_MULTIPLIER"]=0.5;
		defLib["OBSTACLE_RESPAWN_SECONDS"]=28800;
		defLib["OBSTACLE_COUNT_MAX"]=40;
		defLib["GEM_0"]=6500;
		defLib["GEM_1"]=2500;
		defLib["GEM_2"]=800;
		defLib["GEM_3"]=200;
		defLib["LOOT_RESOURCE_STORAGE_MAX"]=200000;
		defLib["LOOT_RESOURCE_PRODUCTION_PERCENTAGE"]=50;
		defLib["LOOT_RESOURCE_STORAGE_PERCENTAGE"]=25;
		defLib["LOOT_CUBE_WORK_PERCENTAGE"]=50;
		defLib["LOOT_CUBE_CAN_PERCENTAGE"]=10;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT-8"]=5;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT-7"]=5;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT-6"]=5;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT-5"]=5;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT-4"]=5;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT-3"]=25;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT-2"]=50;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT-1"]=90;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT0"]=100;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT1"]=110;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT2"]=150;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT3"]=200;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT4"]=200;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT5"]=200;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT6"]=200;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT7"]=200;
		defLib["LOOT_STORAGE_TOWNHALL_LEVEL_DIFF_COEFFICIENT8"]=200;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT-8"]=5;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT-7"]=5;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT-6"]=5;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT-5"]=5;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT-4"]=5;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT-3"]=40;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT-2"]=70;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT-1"]=100;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT0"]=100;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT1"]=125;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT2"]=150;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT3"]=200;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT4"]=200;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT5"]=200;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT6"]=200;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT7"]=200;
		defLib["LOOT_PRODUCTION_TOWNHALL_LEVEL_DIFF_COEFFICIENT8"]=200;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT-8"]=5;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT-7"]=5;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT-6"]=5;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT-5"]=5;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT-4"]=5;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT-3"]=25;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT-2"]=50;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT-1"]=90;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT0"]=100;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT1"]=110;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT2"]=150;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT3"]=200;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT4"]=200;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT5"]=200;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT6"]=200;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT7"]=200;
		defLib["LOOT_CUBE_CAN_TOWNHALL_LEVEL_DIFF_COEFFICIENT8"]=200;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT-8"]=5;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT-7"]=5;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT-6"]=5;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT-5"]=5;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT-4"]=5;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT-3"]=40;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT-2"]=70;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT-1"]=100;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT0"]=100;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT1"]=125;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT2"]=150;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT3"]=200;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT4"]=200;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT5"]=200;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT6"]=200;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT7"]=200;
		defLib["LOOT_CUBE_WORK_TOWNHALL_LEVEL_DIFF_COEFFICIENT8"]=200;
		defLib["BATTLE_SUCCESSFUL_1"]=50;
		defLib["BATTLE_SUCCESSFUL_3"]=100;
		defLib["CREATE_SHIELD_CONDITION_1"]=40;
		defLib["CREATE_SHIELD_CONDITION_2"]=90;
		defLib["CREATE_SHIELD_CONDITION_3"]=100;
		defLib["CREATE_SHIELD_HOUR_1"]=4;
		defLib["CREATE_SHIELD_HOUR_2"]=6;
		defLib["CREATE_SHIELD_HOUR_3"]=8;
		defLib["VECTORY_SCORE_COEFFICIENT"]=0.8;
		defLib["FAIL_SCORE_COEFFICIENT"]=0.75;
		defLib["SCORE_COEFFICIENT"]=5;
		defLib["BATTLE_LOG_NUM"]=20;
		defLib["RESOURCE_DIAMOND_COST_100"]=1;
		defLib["RESOURCE_DIAMOND_COST_1000"]=4;
		defLib["RESOURCE_DIAMOND_COST_10000"]=16;
		defLib["RESOURCE_DIAMOND_COST_100000"]=64;
		defLib["RESOURCE_DIAMOND_COST_1000000"]=300;
		defLib["RESOURCE_DIAMOND_COST_10000000"]=1500;
		defLib["RESOURCE_DIAMOND_DIVISOR_100"]=300;
		defLib["RESOURCE_DIAMOND_DIVISOR_1000"]=750;
		defLib["RESOURCE_DIAMOND_DIVISOR_10000"]=1875;
		defLib["RESOURCE_DIAMOND_DIVISOR_100000"]=3814;
		defLib["RESOURCE_DIAMOND_DIVISOR_1000000"]=7500;
		defLib["RESOURCE_DIAMOND_DIVISOR_10000000"]=15000;
		defLib["CREATE_CLAN_RES"]=50000;
		defLib["MAX_DONATE_UNITS"]=5;
		defLib["MAX_CLAN_MEMBERS"]=50;
		defLib["SPEED_UP_DIAMOND_COST_60_SECOND"]=1;
		defLib["SPEED_UP_DIAMOND_COST_3600_SECOND"]=10;
		defLib["SPEED_UP_DIAMOND_COST_86400_SECOND"]=150;
		defLib["SPEED_UP_DIAMOND_COST_604800_SECOND"]=600;
		defLib["SPEED_UP_DIAMOND_DIVISOR_60_SECOND"]=7;
		defLib["SPEED_UP_DIAMOND_DIVISOR_3600_SECOND"]=10;
		defLib["SPEED_UP_DIAMOND_DIVISOR_86400_SECOND"]=20;
		defLib["SPEED_UP_DIAMOND_DIVISOR_604800_SECOND"]=17;
		defLib["ROLL_RESET_TIME"]=8;
		defLib["ROLL_RESET_GOLD"]=50000;
		defLib["ROLL_RESET_OIL"]=50000;
		defLib["ROLL_RESET_CUBE"]=50000;
		defLib["MAX_PVE2_STAGE_ID"]=50;
		defLib["PVE_REWARD_GEM_PER_STAGE"]=1;
		defLib["RECOVER_MCTH_PART"]=30;
		defLib["HANGAR_COST_1"]="Elixir#250000";
		defLib["HANGAR_COST_2"]="Elixir#1250000";
		defLib["HANGAR_COST_3"]="Gem#510";
		defLib["BUY_TOKEN_1"]="1000#64";
		defLib["BUY_TOKEN_2"]="5000#167";
		defLib["BUY_TOKEN_3"]="20000#594";
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK1"]=0;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK2"]=0;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK3"]=0;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK4"]=200;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK5"]=300;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK6"]=400;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK7"]=400;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK8"]=400;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK9"]=400;
		defLib["TOWHALL_LEVLE_HONOR_MECH_ATTARK10"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT1"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT2"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT3"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT4"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT5"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT6"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT7"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT8"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT9"]=400;
		defLib["TOWHALL_LEVLE_HONOR_LOOT10"]=400;
		defLib["CUBE_DIAMOND_COST_1"]=1;
		defLib["CUBE_DIAMOND_COST_10"]=4;
		defLib["CUBE_DIAMOND_COST_100"]=16;
		defLib["CUBE_DIAMOND_COST_1000"]=64;
		defLib["CUBE_DIAMOND_COST_10000"]=300;
		defLib["CUBE_DIAMOND_COST_100000"]=3000;
		defLib["CUBE_DIAMOND_DIVISOR_1"]=3;
		defLib["CUBE_DIAMOND_DIVISOR_10"]=8;
		defLib["CUBE_DIAMOND_DIVISOR_100"]=19;
		defLib["CUBE_DIAMOND_DIVISOR_1000"]=39;
		defLib["CUBE_DIAMOND_DIVISOR_10000"]=34;
		defLib["CUBE_DIAMOND_DIVISOR_100000"]=34;
		defLib["BATTLE_BET_COST_GEM_1"]=2;
		defLib["BATTLE_BET_COST_GEM_2"]=4;
		defLib["BATTLE_BET_COST_GEM_3"]=5;
		defLib["BATTLE_BET_COST_GEM_4"]=5;
		defLib["BATTLE_BET_COST_GEM_5"]=5;
		defLib["BATTLE_BET_COST_GEM_6"]=5;
		defLib["BATTLE_BET_COST_GEM_7"]=5;
		defLib["BATTLE_BET_TIMES"]=2;
		defLib["BATTLE_BET_SEND_ROLLMSG_LEVEL_LIMIT"]=5;
		defLib["MECH_COMPOUND_ROLL_MSG_LEVEL_LIMIT"]=6;
		defLib["OPEN_BOX_SEND_GIFT_RES_LIMIT"]=1000000;
		defLib["PART_STRENGTHEN_TIER_LEVEL"]=2;
		defLib["PART_STRENGTHEN_LEVEL_LIMIT"]=25;
		defLib["BATTLE_MIN_PROTECTED_TIME"]=5;
		defLib["MAX_TOKEN2"]=6000;
		defLib["MIN_TOKEN2"]=60;
		defLib["MONTH_CARD_DATE"]=30;
		defLib["WEEK_CARD_RES_DATE12"]=7;
		defLib["WEEK_CARD_RES_DATE68"]=7;
		defLib["WEEK_CARD_CUBE_DATE68"]=7;
		defLib["TH_CARD_DATE"]=3;
		defLib["TH_CARD_COST_GEM"]=20;
		defLib["CUBE_CARD_DATE"]=3;
		defLib["CUBE_CARD_COST_GEM"]=50;
		defLib["TIME_BUTTON_TOWNHALL_LEVEL_LIMIT"]=4;
		defLib["TIME_BUTTON_COST_TIME"]=240;
		defLib["TIME_BUTTON_COST_GEM"]=12;
		defLib["TIME_BUTTON_COOLDOWN"]=120;
		defLib["BATTLE_PROTECT_SCORE_MODIFY"]=0.5;
		defLib["FORCE_REVENGE_ATTACK_GEM"]=150;
		defLib["PVP_MAX_ENEMY_COUNT"]=3;
		defLib["PVP_UNLOCK_ENEMY_LIST_1"]=0;
		defLib["PVP_UNLOCK_ENEMY_LIST_2"]=1000;
		defLib["PVP_UNLOCK_ENEMY_LIST_3"]=3000;
		defLib["PVP_ENEMY_BATTLE_SPACING_TIME"]=8;
		defLib["INSTANT_RECOVERY_GEM_MODIFY"]=0.5;
		defLib["CLAN_TIME_GEM_MODFIY"]=6;
		defLib["CLAN_DONATE_FREE_TIMES"]=1;
		defLib["CLAN_DONATE_COST_GEM"]=50;
		defLib["CLAN_DONATE_GOLD"]=500000;
		defLib["CLAN_DONATE_OIL"]=500000;
		defLib["CLAN_DONATE_FREE_GET_POINTS"]=10;
		defLib["CLAN_DONATE_COST_GET_POINTS"]=30;
		defLib["CLAN_SIGN_IN_GET_POINTS"]=1;
		defLib["CLAN_DOMAIN_CUP_SCORE_MODIFY_STAR_1"]=1;
		defLib["CLAN_DOMAIN_CUP_SCORE_MODIFY_STAR_2"]=1.1;
		defLib["CLAN_DOMAIN_CUP_SCORE_MODIFY_STAR_3"]=1.2;
		defLib["CLAN_MEMBER_INTERNSHIP_HOUR"]=24;
		defLib["CLAN_CUP_ID"]="-1";
		defLib["CLAN_CUP_END_TIME"]="2014#04#27&22:00:00";
		defLib["CLAN_CUP_AUTO_CALC_RESULT_INTERVAL"]=0;
		defLib["CLAN_CUP_REFRESH_PER_DATE_TIME"]=22;
		defLib["CLAN_CUP_SHOW_SCORE_TIME"]=18;
		defLib["BATTLE_SCORE_MODIFY_STAR_1"]=100;
		defLib["BATTLE_SCORE_MODIFY_STAR_2"]=110;
		defLib["BATTLE_SCORE_MODIFY_STAR_3"]=120;
		defLib["CLAN_DEPUTY_LEADER_NUM"]=2;
		defLib["TOWNHALL_DROP_ITEM_RATE"]=0.5;
		defLib["TOWNHALL_DAILY_REWARD_COUNT"]=15;
	})();
}