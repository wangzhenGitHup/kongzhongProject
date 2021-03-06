﻿if(window.aisEnv.textLib)
{
	(function()
	{
		var textLib=window.aisEnv.textLib;
		textLib.addOnName={
			plu_L1_01:"白羊",
			plu_L1_02:"山猫",
			plu_L1_03:"体验版控制模块",
			plu_L2_01:"斑马",
			plu_L2_02:"斗牛犬",
			plu_L2_03:"响尾蛇",
			plu_L3_01:"大水牛",
			plu_L3_02:"鬣狗",
			plu_L3_03:"野兔",
			plu_L3_04:"野马",
			plu_L3_05:"海豹",
			plu_L3_06:"狐狸",
			plu_L3_07:"独角仙",
			plu_L4_01:"公牛",
			plu_L4_02:"食人鱼",
			plu_L4_03:"狐蝠",
			plu_L4_04:"浣熊",
			plu_L4_05:"驯鹿",
			plu_L4_06:"猫头鹰",
			plu_L4_07:"龙卷风",
			plu_L4_08:"月光",
			plu_L5_01:"非洲象",
			plu_L5_02:"眼镜蛇",
			plu_L5_03:"鹰眼",
			plu_L5_04:"犀牛",
			plu_L5_05:"短吻鳄",
			plu_L5_06:"野猪",
			plu_L5_07:"袋鼠",
			plu_L5_08:"蜻蜓",
			plu_L6_01:"北极熊",
			plu_L6_02:"美洲狮",
			plu_L6_03:"黑豹",
			plu_L6_04:"科莫多",
			plu_L6_05:"魔鬼鱼",
			plu_L6_06:"虎王",
			plu_L6_07:"大白鲨",
			plu_L6_08:"鬃狼",
			plu_L6_09:"先驱者",
			plu_L6_10:"启明星",
			plu_L7_01:"猛犸象",
			plu_L7_02:"剑齿虎",
			plu_L7_03:"翼龙",
			plu_L7_04:"蛇颈龙",
			plu_L7_05:"鹦鹉螺",
			plu_L7_06:"霸王龙",
			plu_L7_07:"暴风雪",
			plu_L7_08:"太阳光",
			plu_L7_09:"毒蝎",
			plu_L8_01:"不死鸟",
			plu_L8_02:"地狱犬",
			plu_L8_03:"天马",
			plu_L8_04:"魔龙",
			plu_L8_05:"狮鹫",
			plu_L8_06:"九头蛇",
			plu_L8_07:"独角兽",
			plu_L8_08:"玄武",
			plu_L8_09:"羊驼",
			plu_L9_07:"控制模块",
			plu_L9_01:"金牛座",
			plu_L9_02:"狮子座",
			plu_L9_03:"人马座",
			plu_L9_04:"巨蟹座",
			plu_L9_05:"摩羯座",
			plu_L9_06:"天蝎座",
			plu_L9_08:"阿波罗",
			plu_L9_09:"波塞冬",
			plu_L9_10:"雅典娜",
			plu_L9_11:"阿基米德",
			plu_L9_12:"斐波那契",
			plu_L9_13:"莫比乌斯",
			plu_L9_14:"祖冲之",
			plu_comup_01:"绿色水晶",
			plu_comup_04:"红色水晶",
			plu_comup_02:"蓝色水晶",
			plu_comup_03:"紫色水晶",
		};
		textLib.addOnInfo={
			plu_L1_01:"机甲血量+2%",
			plu_L1_02:"机甲每秒伤害+2%",
			plu_L1_03:"可在战斗中控制机甲的移动\n控制功能仅在国庆活动期间有效\n该模块无法通过熔接获得",
			plu_L2_01:"机甲血量+4%",
			plu_L2_02:"机甲每秒伤害+4%",
			plu_L2_03:"机甲血量+2%\n机甲每秒伤害+2%",
			plu_L3_01:"机甲血量+8%",
			plu_L3_02:"机甲每秒伤害+8%",
			plu_L3_03:"机甲移动速度+20",
			plu_L3_04:"机甲血量+4%\n机甲每秒伤害+4%",
			plu_L3_05:"机甲血量+4%\n机甲移动速度+10",
			plu_L3_06:"机甲每秒伤害+4%\n机甲移动速度+10",
			plu_L3_07:"可在熔接过程中充当E级模块",
			plu_L4_01:"机甲血量+12%",
			plu_L4_02:"机甲每秒伤害+12%",
			plu_L4_03:"机甲移动速度+30",
			plu_L4_04:"机甲血量+6%\n机甲每秒伤害+6%",
			plu_L4_05:"机甲血量+4%\n机甲移动速度+15",
			plu_L4_06:"机甲每秒伤害+4%\n机甲移动速度+15",
			plu_L4_07:"机甲拥有使用枪林弹雨(lv3)支援的能力",
			plu_L4_08:"机甲拥有使用振奋号角(lv3)支援的能力",
			plu_L5_01:"机甲血量+16%",
			plu_L5_02:"机甲每秒伤害+16%",
			plu_L5_03:"机甲移动速度+40",
			plu_L5_04:"机甲血量+8%\n机甲每秒伤害+8%",
			plu_L5_05:"机甲血量+8%\n机甲移动速度+20",
			plu_L5_06:"机甲每秒伤害+8%\n机甲移动速度+20",
			plu_L5_07:"机甲拥有跳跃围墙的能力",
			plu_L5_08:"可在模块熔接过程中充当C级模块",
			plu_L6_01:"机甲血量+20%",
			plu_L6_02:"机甲每秒伤害+20%",
			plu_L6_03:"机甲移动速度+50",
			plu_L6_04:"机甲血量+10%\n机甲每秒伤害+10%",
			plu_L6_05:"机甲血量+10%\n机甲移动速度+25",
			plu_L6_06:"机甲每秒伤害+10%\n机甲移动速度+25",
			plu_L6_07:"机甲优先攻击资源类建筑\n机甲移动速度+25",
			plu_L6_08:"机甲优先攻击防御类建筑\n机甲每秒伤害+10%",
			plu_L6_09:"用于生产机甲攻击组件(超级组件)",
			plu_L6_10:"用于生产机甲移动组件(超级组件)",
			plu_L7_01:"机甲血量+25%",
			plu_L7_02:"机甲每秒伤害+25%",
			plu_L7_03:"机甲移动速度+60",
			plu_L7_04:"机甲血量+12%\n机甲每秒伤害+12%",
			plu_L7_05:"机甲血量+12%\n机甲移动速度+30",
			plu_L7_06:"机甲每秒伤害+12%\n机甲移动速度+30",
			plu_L7_07:"机甲拥有使用枪林弹雨(lv5)支援的能力",
			plu_L7_08:"机甲拥有使用振奋号角(lv5)支援的能力",
			plu_L7_09:"可在模块熔接过程中充当A级模块",
			plu_L8_01:"机甲血量+30%",
			plu_L8_02:"机甲每秒伤害+30%",
			plu_L8_03:"机甲移动速度+70",
			plu_L8_04:"机甲血量+15%\n机甲每秒伤害+15%",
			plu_L8_05:"机甲血量+15%\n机甲移动速度+35",
			plu_L8_06:"机甲每秒伤害+15%\n机甲移动速度+35",
			plu_L8_07:"机甲优先攻击资源类建筑\n机甲移动速度+35",
			plu_L8_08:"机甲优先攻击防御类建筑\n机甲每秒伤害+15%",
			plu_L8_09:"机甲拥有跳跃围墙的能力\n机甲血量+10%\n机甲每秒伤害+10%",
			plu_L9_07:"可在战斗中控制机甲的移动",
			plu_L9_01:"可在战斗中控制机甲的移动\n机甲血量+30%",
			plu_L9_02:"可在战斗中控制机甲的移动\n机甲每秒伤害+30%",
			plu_L9_03:"可在战斗中控制机甲的移动\n机甲移动速度+80",
			plu_L9_04:"可在战斗中控制机甲的移动\n机甲血量+15%\n机甲每秒伤害+15%",
			plu_L9_05:"可在战斗中控制机甲的移动\n机甲血量+15%\n机甲移动速度+40",
			plu_L9_06:"可在战斗中控制机甲的移动\n机甲每秒伤害+15%\n机甲移动速度+40",
			plu_L9_08:"机甲血量+60%",
			plu_L9_09:"机甲每秒伤害+60%",
			plu_L9_10:"机甲血量+30%\n机甲每秒伤害+30%",
			plu_L9_11:"机甲每秒伤害+60%\n机甲移动速度+100",
			plu_L9_12:"机甲每秒伤害+60%\n机甲优先攻击防御类建筑",
			plu_L9_13:"机甲血量+60%\n机甲移动速度+100",
			plu_L9_14:"机甲血量+60%\n机甲优先攻击防御类建筑",
			plu_comup_01:"模块熔接成功率+15%",
			plu_comup_04:"模块熔接成功率+5%",
			plu_comup_02:"模块熔接成功率+25%",
			plu_comup_03:"模块熔接成功率+100%",
		};
	})();
}
