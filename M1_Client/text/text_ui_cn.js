if(__Page.appEnv && !__Page.appEnv.textLib)
{
	__Page.appEnv.textLib={
		getText:function(text,args){
			var i;
			for(i in args){
				text = text.replace("<"+i+">",  args[i]);
			}
			return text;
		},
		getTextEx:function(text,args){
			var textEx = this[text];
			var i;
			for(i in args){
				textEx = textEx.replace("<"+i+">",  args[i]);
			}
			return textEx;
		},
		"_Builder":"工人:",
		"_Shield":"隐形力场:",
		"_Max":"上限:",
		"Battle Shop":"战地卖场",
		"Treasure":"特别补给",
		"Resources":"资源",
		"Decorations":"装饰",
		"Army":"军队",
		"Defense":"防御",
		"Shield":"隐形力场",
		"Special":"神秘商店",
		"GlobalTimes":"全服抢购",
		"PersonalDailyTimes":"每日限量",
		"PersonalTimes":"帐号限量",
		"SpecialSupply":"特殊补给",
		"Built":"已建造",
		"Choose position":"选择建筑位置",
		"Level Text":function(level){return level+" 级";},
		"Constructing":"建造中...",
		"Time_NONE":"立即",
		"BadBuildMaxCap":"此类建筑数目达到上限, 升级指挥中心可以增加建筑上限。",
		"BadBuildMaxCap_WorkerHud":"建筑数目达到上限。",
		"ReqNeedForBld":"建造条件未满足。",
		"ResNeedForUnit":"物资不足, 无法组建指定部队。",
		"TrainTip":"要训练作战单位, 点击或按住单位图标不放。",
		"TrainCampFull":"训练场已爆满! 建造或升级训练场来容纳更多单位, 或者通过作战消耗单位。",
		"NoResTitle":"缺少资源!",
		"AskBoost":"启动时空加速?",
		"AskGemFin":"立刻完成工程!",
	//	"Tech Lab":"研究所",
		"TechCount":"战绩统计",
		"TrainNum":"训练数",
		"ActiveRate":"使用率",
		"NetError":"服务器与客户端数据同步异常，敌人可能干扰了我们的系统，请重新登录！",
		"NetDisconnect":"我们与作战总部的网络连接被中断，请确保我们拥有通畅的网络环境！",
		"SysFull":"作战总部网络繁忙，请稍后再试！",
		"TimeOut":"与作战总部网络连接超时，请确保我们拥有通畅的网络环境.",
		"OK":"确认",
		"Cancel":"取消",
		"EnterShop":"进入商店",
		"OverflowStorage":"仓库容量不足",
		"OverflowRes":function(resType)
		{
			var codeName="";
			if("ResGold"==resType)
				codeName="GoldVault";
			else if("ResOil"==resType)
				codeName="OilTank";
			else if("ResCube"==resType)
				codeName="CubeCan";
			var name=window.aisEnv.textLib.bldName[codeName];
			return "所需的资源超出了仓储容量的上限，请先升级您的 "+name;
		},
		"IsBoosting":"建筑正在加速",
		"IsBoostingDesc":"建筑正在加速，如果现在升级的话加速将被取消！是否继续？",
		"IsBuilding":"取消建造?",
		"IsBuildingDesc":"取消建造将只返还一半的资源，是否继续？",
		"IsBld":"取消拆除？",
		"IsBldDesc":"确认取消拆除建筑？",
		"IsMaking":"取消制造支援卫星?",
		"IsMakingDesc":"取消制造支援卫星将只返还一半的资源，是否继续？",
		"IsMaxLv":"已达最高等级",
		"NotOpen":"暂未开放此功能",
		"TrainStucked":"训练场已满，停止造兵",
		"Unlock":"解锁",
		"UpgradeTime":"升级时间",
		"NoLog":"暂无记录",
		"IsLoading":"正在获取信息……",
		"GetInfoError":"获取信息失败",
		"NoFreeWorker":"没有空闲的工人",
		"NoFreeWorkerDesc":"没有空闲的工人，是否立刻完成之前的建造来空出一个工人？",
		"ShieldCD":"隐形力场冷却中",
		"ShieldCDTime":function(cdTime)
		{
			return "隐形力场冷却中，剩余时间 "+this.getTimeText(cdTime);
		},
		"ShareCDTime":function(cdTime)
		{
			return "您已分享了一段视频回放，请在"+this.getTimeText(cdTime)+"后再次分享";
		},
		"GetCDTime":function(cdTime)
		{
			return "冷却时间: "+this.getTimeText(cdTime);
		},

		"Achieve":"成就",
		"AchieveComplete":"获得成就！",
		"ReceiveReward":"领取奖励",
		"BattleLog":"战斗记录",
		"BeyondRewardLimit":"今日碎片掠夺数已达上限",
		"DefResult0":"完胜",
		"DefResult1":"小败",
		"DefResult2":"大败",
		"DefResult3":"完败",
		"AtkResult0":"完败",
		"AtkResult1":"小胜",
		"AtkResult2":"大胜",
		"AtkResult3":"完胜",
		"Lost":"损失",
		"Gain":"获得",
		"Replay":"战斗回放",
		"ReplayAgain":"再次播放",
		"OnslaughtMode":"守城模式",
		"OnslaughtLevel":"第 <level> 关",
		"Expired":"回放已过期",
		"Revenge":"复仇",
		"Revenged1":"已复仇",
		"Revenged2":"不可复仇",
		"TotalRecord":"总体战绩",
		"TotalCount":"战斗次数",
		"WinRate":"胜率",
		"AtkRecord":"进攻战绩",
		"AtkCount":"进攻次数",
		"AtkWinRate":"攻击胜率",
		"DefRecord":"防守战绩",
		"DefCount":"防守次数",
		"DefWinRate":"防守胜率",
		"WinningStreak":"最高连胜",
		"HighestRank":"最高排名",
		"TotalKill":"击杀敌人",
		"TotalDestroy":"摧毁建筑",
		"TotalRob":"总共掠夺",
		"HighestRob":"单场最高掠夺",
	//	"":"",
		"BattleFailed":"进攻失败",
		"BattleWin":"防守成功",
		"ConfirmGemBuy":"购买确认",
		"ConfirmBuyItem":function(gem,resType,resNum,resName)
		{
			var resName;
			if("Gold"==resType){
				resName=this["ResGold"];
			}else if("Oil"==resType || "Exriler"==resType){
				resName=this["ResOil"];
			}else if("Shield"==resType){
			//	resName="隐形力场";
				resNum="1个";
			}else if("cash"==resType){
				resName=this["ResCash"];
			}else if("Cube"==resType){
				resName=this["ResCube"];
			}
			return "确认花费 "+gem+" 钻石，购买" +resNum+resName+" ？";
		},
		"Setting":"设置",
		"SetSound":function(on)
		{
			if(on)
				return "音效：开";
			else
				return "音效：关";
		},
		"SetMusic":function(on)
		{
			if(on)
				return "音乐：开";
			else
				return "音乐：关";
		},
		"About":"关于",
		"Help":"帮助",
		"MoreGames":"更多游戏",
		"QuitGame":"退出游戏",
		"AboutDesc":"开发商：北京空中信使信息技术有限公司\n\n客服邮件：serice@kongzhong.com\n\n客服电话：010-68083018\n\n北京空中信使信息技术有限公司为《口袋战争》游戏的软件著作权人。北京空中信使信息技术有限公司同时处理本游戏运营的相关客户服务及技术支持。",
		"HelpDesc":"    当玩家不知该如何进行游戏时，只需按游戏任务流程的提示即可顺利游戏。",
		"BandEmail":"绑定邮箱",
		"InputEmail":"请输入要绑定的邮箱",
		"InputEmailError":"请输入正确的邮箱地址",
		"InputPwd":"请输入密码",
		"InputPwdError":"密码过短，小于5位",
		"BindEmailSuccess":"激活邮件已发送，请打开发送给您的激活地址以完成激活。",
		"YourEmail":"您已绑定邮箱：",
		"ServiceEmail":"联系客服",
		"OfficialWebsite":"访问官网",
		"UserId":"用户ID",
		"UserName":"用户昵称",
		"ServerName":"服务器名",
		"ConfirmVisit":"访问要塞",
		"ConfirmVisitDesc":function(name)
		{
			return "您确定要访问 "+name+" 的要塞吗？";
		},
		"AccountManage":"账号管理",
		"IllegalInput":"包含非法字符或文字，请重新输入！",
		"Copyright":"版权信息",
		"Feedback":"用户反馈",
		"CopyrightDesc":"\r\n 口袋战争 \r\n\r\n 口袋战争©2013 KongZhong Group Companies \r\n\r\n A game developed and published by KongZhong Group Companies \r\n\r\n All rights reserved.\r\n\r\n Info and Customer Care\r\n http://kdzz.kongzhong.com \r\n kdzz_kefu@Kongzhong.com",
		"BandAccount":"账号绑定",
		"ChangeUser":"更改用户",
	//	"MailLogin":"邮箱登陆",
		"ResetPssaword":"重置密码",
		"Logout":"注销",
		"BandDesc":"绑定说明：\n1.用户首次绑定帐号需要输入一个邮箱地址及设置一个密码。\n2.请确认邮箱真实有效（我们将会发送激活邮件到该邮箱）。\n3.用户绑定邮箱后可在不同设备通过输入用户名（邮箱）及密码进行登陆。",
		"BandedDesc":"\n\n帐号：<id>\n\n绑定邮箱：<email>",
		"InputPwdTip":"请输入密码：（长度6~20位）",//（包含6~20位英文或数字）
		"RepeatPwd":"请再次输入密码",
		"PwdErrorLen":"密码长度不合法",
		"PwdErrorStr":"密码含有非法字符",
		"PwdErrorRe":"两次输入的密码不一致",
		"LoginMail":"登陆帐号（已绑定的邮箱）",
		"LoginPwd":"登录密码",
		"Login":"登陆",
		"ResetPwdSuccess":"重置密码邮件已发送，请到邮箱打开发送给您的地址以完成密码重置。",
		"MailPwdErr":"邮箱或者密码不正确，请确认后重新输入。",
		"LoginEh":"邮箱登陆发生异常，请稍后再试。",
		"ResetPwdEh":"重置密码发生异常，请确认您输入的邮箱无误，并且已绑定过游戏帐号。",
		"ResetPwdEh1055":"邮箱地址无效，请确认您输入的邮箱无误，并且已绑定过游戏帐号。",
		"BandEmaildEh":"账号绑定发生异常，请稍后再试。",
		"BandEmaildEh1054":"该邮箱已经被绑定过，请尝试其它邮箱。",
		"BandEmaildEh1058":"账号绑定发生异常，用户信息验证不合法，如有疑问，请联系客服。",
		"ResetPwdTip":"重置密码需要您输入一个已经绑定过游戏的邮箱，系统将会发送重置邮件到该邮箱。",
		"SwitchServer":"切换服务器",
		"Switch":"切换",
		"SwitchServerTip":"点击切换可选择服务器，不同服务器之间数据并不通用",
		"ServerDown":"维护中",
		"CurServer":"当前",
		"DonateCnt":"支援数",
		"DailyTasks":"今日作战任务",
		"CurRank":"当前排名",
		"RankResSingle":"单次掠夺",
		"RankResAverage":"掠夺效率",
		"GetDiamondMine":"获得钻石熔压器！",
		"GetDiamondGift":"您通过购买钻石，完成了“钻石达人”成就，并获得了“钻石熔压器”礼包的奖励，请点击屏幕右侧礼包按钮进行领取。",
		"GetEmailAch":"获得邮箱绑定奖励！",
		"GetEmailAchGift":"您已经完成账户邮箱绑定，海量资源奖励将通过礼包形式发放，请点击屏幕右侧礼包按钮进行领取。",
		"EmailAch":"邮箱绑定礼包x1",
		"Bld_X1":function(codeName){
			return window.aisEnv.textLib.bldName[codeName]+"x1"
		},
		"SpecialItem":"成就专属",
		"SpecialItemDesc":"该建筑为成就专属，不可购买",
		"Global":"全球",
		"Local":"本地",
		"ResSingleTip":"昨日玩家单次掠夺最大值排行榜(金矿+能源)\r\n排行榜于凌晨0点刷新",
		"ResAverageTip":"昨日掠夺的金矿总量除以掠夺次数为掠夺效率，每天掠夺次数至少为3次以上才可列入排行。\r\n排行榜于凌晨0点进行刷新",
		"GetInfoEh":"获取信息异常",
		"Gem":"钻石",
		"PrdctRate24":"每天产出",//"产出率",
		"NeedReinforce":"我需要支援",
		"DontWorshipMe":"别崇拜我，哥只是个传说",
		"DialyTaskTip":"今日作战任务每完成一颗星，系统将会自动发放任务的礼包奖励。\r\n礼包有一定时效，请及时到“指挥中心”的礼包界面领取。",
		"EmailLogin":"邮箱登陆",

		"ClanRankNum":"联盟排名",
		"VipGold":"VIP限购5折金矿",
		"VipOil":"VIP限购5折能源",
		"VipCube":"VIP限购5折能量块",
		"ConfirmVipBuy":"VIP限购资源",
		"ConfirmVipBuyItem":"您所购买的是VIP限购5折资源，请注意每天只可购买一次，并且超出仓库部分会被系统回收。",
		"VipResFull":"该VIP限购资源已达购买次数上限，请明日再购买。",
		"VipResDesc":"VIP 贵宾专享\n每日限购一次",
		"VipOnly":"VIP专享",
		"VipSpecial":"贵宾专享",
		"CurVipLv":"当前VIP等级：",
		"VipExp":"累计VIP贡献：",
		"ToNextLv":"距离下一等级：",
		"VipPrivilege":"VIP<level>特权：",
		"QuickRecharge":"极速充值",
		"SuperVip":"豪华贵宾礼遇",
		"LvRearch":"已晋级",
		"None":"无",
		"ViewGift":"查看详情",
		"GiftInfo":"详情",
		"VipDoubleGift":"可获得一次充值双倍的机会！",

		"Part":"生产",
		"PartStorage":"仓库",
		"PartEnhance":"强化",
		"AddOn":"模块",
		"AddOnBuy":"制造",
		"AddOnJoint":"熔接",
		"AddOnStorage":"仓库",
		"AssembleMech":"组装机甲",
		"ChipNotEnough":"能量块不足",
		"NeedChipNum":"缺少 <num> 能量块，是否立刻使用钻石兑换？",
		"Lottery":"抽取特殊补给",
		"Again":"再来一次",
		"NoMatchAddOn":"没有可以熔接的模块!",
		"PrdSeq":"生产队列：",
		"StorageCap":"仓库容量：",
		"StorageRemainCap":"生产完成后仓库剩余容量:",
		"Name":"名称",
		"Weight":"重量",
		"WeightCap":"承重",
		"EnhanceCost":"强化花费",
		"Tier":"Tier",
		"MakeCost":"生产花费",
		"MakeTime":"生产时间",
		"Tier1":"普通组件",
		"Tier2":"高级组件",
		"Tier3":"超级组件",
		"AddOnName":"模块名称: ",
		"AddOnEffect":"模块功能: ",
		"AddOnLevel":"所属等级: ",
		"AddOnDesc":"功能描述: ",
		"MechPart":"机甲组件: ",
		"SelMechToRemove":"请选择需要销毁的组件",
		"ChooseBody":"选择攻击组件",
		"ChooseLeg":"选择移动组件",
		"ChooseAddOn":"添加火控模块",
		"ChooseAddOn1":"添加\n火控模块",
		"Confirm":"确定",
		"Remove":"移除",
		"Delete":"销毁",
		"MajorAddOn":"主模块",
		"SecondaryAddOn":"副模块",
		"CrystalAddOn":"水晶",
		"PartInfo":"组件信息",
		"ExNeed":"生产额外消耗: ",
		"TierLevel":"分类",
		"WeightUnit":"吨",
		"Assemble":"组装",
		"Demolish":"拆卸",
		"NeedBody":"请选择一个攻击组件！",
		"NeedLeg":"请选择一个移动组件！",
		"WeightNotMatch":"组件重量不符，移动组件承重值不能小于攻击组件重量!",
		"Unload":"卸下",
		"Level":"等级",
		"ChoosePart":"您可以选择不同的机甲组件进行组装或拆卸",
		"SeqFull":"生产队列已满",
		"ConfirmDelPart":"销毁确认",
		"ConfirmDelPartDesc":"长官，确认销毁当前组件<name>？销毁组件不会返还任何资源。",
		"GetLevel":" <lv>级",
		"JointInfo":"通过对模块进行熔接可获得新模块。\n主副模块级别相同，将进行升级熔接！熔接成功将获得高一等级的任意模块。\n副模块级别小于主模块，将进行转换熔接！熔接成功将获得主模块等级的任意模块。\n在熔接过程中添加稀有晶体，会提高熔接成功率。\n模块等级依次为 F-< F< E< D< C< B< A< S< SS。",
		"TokenName":"能量块",
		"TokenName0":"少量能量块",
		"TokenName1":"一堆能量块",
		"TokenName2":"海量能量块",
		"AtkPart":"攻击组件",
		"MovePart":"移动组件",
		"CanNotLottery":"无法使用特殊补给",
		"CityLvNotMatch":"指挥中心等级不足",
		"NeedMechFactory":"需要建造机甲工厂",
		"EnhanceSuccess":"组件强化成功",
		"StorageNotEnough":"仓库剩余空间不足",
		"SelAddOn":"选择模块",
		"Joint":"熔接",
		"Reset":"重置",
		"AddOnLvMax":"主模块已达最大等级，无法再次进行熔接！",
		"Used":"使用中",
		"Empty":"空置",
		"PrtCanNotCancel":"组件生产无法取消",
		"SelPrtToEnhance":"请选择要进行强化的组件",
		"MakeAddOnDesc":"请选择需要制造的模块，点击制造消耗按钮完成制造。",
		"JointTitle":"模块熔接中",
		"JointDesc":"模块正在进行熔接",
		"JointSuccessTitle":"熔接成功",
		"JointSuccessDesc":"成功完成模块熔接，获得新模块！",
		"JointLostTitle":"熔接失败",
		"JointLostDesc":"模块熔接失败，主模块没有发生改变。在熔接过程中可添加水晶来提高熔接成功率",
		"AssembleDesc":"请注意移动组件的承载能力不能小于攻击组件重量，否则不能进行组装。",
		"MaxRepairTime":"最大维修时间: ",
		"ClanException":"联盟城堡与联盟信息不匹配，请火速联系客服为您解决问题！",
		"CanNotMakeDif":"不能同时制造消耗不同资源的模块",
		"MakeAddOnCost":"制造消耗: ",
		"RepairTime":"维修时间",
		"RemoveInfo":"您可以选择对低级机甲组件进行销毁处理，从而获得空余的仓库空间，存放更高级更先进的新型组件。",
		"EnhancePart":"强化组件: ",
		"EnhanceInfo":"通过对机甲组件进行强化升级，可以获得组件能力的提升，使机甲战士在战斗中发挥更大的作用。",
		"BodyPart":"攻击组件: ",
		"LegPart":"移动组件: ",
		"Wait":"请稍候",
		"JointFailed":"",
		"ConnectTimeout":"连接超时",
		"ConnectTimeoutDesc":"抱歉，我们与服务器的连接已经超时，请您稍后重试。",
		"WayToGetToken":"制造需要的能量块资源可在多人模式战斗胜利后抽奖获得。",
		"UniquePart":"同一个攻击组件不能同时拥有多个。",
		"Owned":"已拥有",
		"AllBuild":"全部",
		"AllAddOn":"全部模块",
		"OwnedAddOn":"已有模块",
		"AskGemBuyBox":"重新选择特殊补给",
		"AskGemBuyBoxDesc":"重新选择会放弃当前补给结果，是否继续？",
		"LotteryErr":"特殊补给结果异常",
		"LotteryErr1":"特殊补给结果异常，没有可以选择的特殊补给。",
		"HowToLottery":"提升勋章或者建造机甲工厂可以抽取特殊补给哦。",
		"LootNeedMedal":"<level>级指挥中心达到<medal>勋章后可以抽取特殊补给哦。",
		"LootNeedMechFactory":"建造机甲工厂后可以抽取特殊补给哦。",
		"LootNeedWin":"战斗获胜后才可使用战后抽奖功能，请再接再厉。",
		"MFConstructing":"机甲工厂正在升级，无法进行组件生产。",
		"CanNotSearch":"指挥官，您还处于新手保护阶段，请先发展我们的基地提升实力。",
		"HaveRest":"休息一会儿",
		"GoOnPlay":"接着玩儿",
		"SuperSupply":"超时空补给",
		"SuperSupplyDesc":"使用超时空补给将有概率获得海量爆仓资源，请随时关注您的资源存量。此装置需要钻石作为动力能源，但是总部有时会传送给我们特别的稀有补给哦！",
		"SelBox":"选择不同类型的超时空补给装置，点击信息按钮查看详情",
		"SuperSupply1":"普通补给",
		"SuperSupply2":"高级补给",
		"SuperSupply3":"超级补给",
		"SupplyCost":"补给消耗: ",
		"WillOpen":"即将开启",
		"WillOpenDesc":"即将开启，敬请期待。",
		"TodayFreeTimes":"今日免费次数: ",
		"RareSupply":"稀有补给品",
		"GetTimes":function(times){
			return times+"次";
		},
		"ResGold":"黄金",
		"ResOil":"能源",
		"ResGem":"钻石",
		"ResCash":"能量块",
		"ResCube":"能量块",
		"WaitingRadonm":"开启超时空传送，\n请耐心等待…",
		"GetItem":"获得: ",
		"ForFree":"本次免费",
		"OpenBoxOK":"成功获得补给物资，\n已添加到您的要塞。",
		"OpenBoxErr":"超时空补给异常",
		"OpenBoxErrDesc":"首长，超时空补给装置出现异常，请稍后重试，本次使用没有产生钻石消耗。",
		"OpenBoxTimeout":"超时空补给连接超时",
		"OpenBoxTimeoutDesc":"首长，超时空补给连接已超时，请稍后重试，本次使用没有产生钻石消耗。",
		"BoxGetPart":"恭喜获得机甲组件，\n稍后将以礼包发送。",
		"OpenBox":function(name)
		{
			return "使用"+name;
		},
		"OpenBoxDesc":function(name,free,cost)
		{
			var txt="即将开启"+name+"。";
			if(free>0)
				txt+="剩余免费次数: "+free;
			else
				txt+="补给消耗: "+cost+this["ResGem"];
			return txt;
		},
		"ConfirmRepair":"确认修复机甲？",
		"ConfirmRepairDesc":function(num)
		{
			return "确认花费 "+num+"钻石 来修复该机甲？";
		},
		"GetMonthCardTime":function(cdTime)
		{
			return "月卡剩余: "+this.getTimeText(cdTime);
		},
		"MonthReward":"30天钻石返利",
		"BuyMonthCard":"购买钻石月卡",
		"BuyMonthCardDesc":"每次购买可获得30天钻石返利有效期。\n每日首次上线可获得一个60钻的返利礼包。\n30天全部登陆可获得1800钻！\n多次购买返利有效期自动累加。\n每日零点，有效期减少一天。\n购买钻石月卡不享受首冲双倍奖励。\n并且购买后将失去首冲双倍的权利。",
		"BeginOpenBox":"点击绿色按钮开始使用超时空传送",
		"NeedMacFactory":"抱歉，您需要先建造完成机甲工厂，才可以使用超时空补给。",
		"Mac":"机甲",
		"Reward":"奖励",
		"TotalPoints":"总得分",
		"RankMacPve":"生死之间",
		"UnitDrop":"普通掉落",
		"ClearReward":"通关奖励",
		"DayRemainTimes":"今日剩余次数: ",
		"Difficulty":"难度",
		"EnterReqire":"进入条件: ",
		"TotalScore1":"总得分",
		"TotalKill1":"击杀总数",
		"KillScore":"击杀得分",
		"HPScore":"血量得分",
		"TimeScore":"时间得分",
		"GetRes":"获得资源",
		"MacDefenseDesc":"asdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfxxxxx",
		"NeedBldLv":function(codeName,level)
		{
			return window.aisEnv.textLib.bldName[codeName]+level+"级";
		},
		"NeedBldNum":function(codeName,num)
		{
			return window.aisEnv.textLib.bldName[codeName]+num+"个";
		},
		"NeedMechUpLevel":"攻击组件强化<level>级",
		"NeedMechDownLevel":"移动组件强化<level>级",
		"EnterReqNotMeet":"进入条件不满足",
		"NoRankData":"暂无该项排行数据",
		"LogFoe":"劲敌",
		"SetFoe":"设为劲敌",
		"SetFoeTitle":"设置劲敌",
		"FoeTitle":"首长，我们已经在您的劲敌要塞安插卧底，一旦时机成熟，您便可以对他们发动进攻，虽然这需要花费一定数量的钻石，但这是一笔超值的投资。",
		"SelFoeBeat":"请选择一个劲敌展开宣战",
		"SelFoeChange":"选择要替换的劲敌",
		"RemainBattleCD":"距离下次宣战",
		"CDReady":"内应准备完毕",
		"NeedSetFoe":"此位置还未添加劲敌，请在防御标签内添加。",
		"NeedUnlockFoe":"此劲敌位置还未解锁。",
		"BattleCDOK":"内应准备完毕",
		"FireFoe":"宣战",
		"Replace":"替换",
		"ForceRevenge":"强攻复仇",
		"ForceRevengeDesc":"对方处于隐形力场的保护之下，是否使用强攻复仇？",
		"OneClickRepair":"恢复军队",
		"ConfirmSetFoe":"设置劲敌",
		"ConfirmSetFoeDesc":"确定设置<name>为劲敌？",
		"ConfirmReplaceFoe":"替换劲敌",
		"ConfirmReplaceFoeDesc":"确定把劲敌<name1>替换为<name2>？",
		"ConfirmUnlock":"解锁劲敌位置",
		"ConfirmUnlockDesc":"确认解锁此劲敌位置？",
		"ConfirmForce":"强制攻打",
		"ConfirmForceDesc":"确认展开强攻复仇<name>？",
		"OLCkeck":"防挂机验证",
		"OLCkeckDesc":"请按照顺序输入4位数字验证码，倒计时结束或5次输入不正确，游戏将自动退出。",
		"OLCkeckErr":"输入错误！您还有<num>次机会。",
		"Refresh":"刷新",
		"LackGem":"缺少<num>钻石。",
		"GoldCardAddition":"土豪资源加成",
		"CubeCardAddition":"额外能量块",
		"SAttacker":"攻方",
		"SDefender":"守方",
		"STotal":"共计",
		"SelCard":"选一张牌试试运气？仅需<num>钻就可能获得数倍资源奖励！",
		"InputPhoneNum":"请输入本机号码",
		"PhoneNumErr":"手机号码不正确",
		"BuyGoldCard":"小资包月",
		"GoldCardDesc":"购买此服务后，每天玩家首次登陆后返给玩家超值钻石，每天36个钻，更超值。\r\n需确保输入手机号正确，订购由空中信使提供的短信包月产品，每月接收8-15条口袋资讯短信，15元/月信息费，由运营商代收。",
		"GoldCardEh":"很遗憾，您所在的地区尚未开通此业务。",
		"URTuHao":"您已经订购了小资包月，请不要重复订购。",
		"GoldCardOnBuy":"小资包月订购中，该特权为包月模式，请保持手机能正常接收口袋资讯短信，退订短信包月服务或扣费不成功，则卡功能即刻终止。15元/月，不含通信费。",
		"WillBeKick":"由于您连续5次输入验证码错误，游戏将自动关闭。",
		"WillBeKick1":"验证码输入超时，游戏将自动关闭。",
		"BuyThCard":"购买土豪金卡",
		"BuyThCardDesc":"土豪逆天特权：\r\n进攻可多获得15%至100%的金矿和能源。\r\n防守可减少15%至100%的金矿和能源损失。\r\n每次购买将获得特权时间3小时。\r\n连续购买后特权总时间将累加。",
		"BuyCubeCard":"购买高端能量卡",
		"BuyCubeCardDesc":"土豪逆天特权：\r\n进攻可多获得15%至100%的能量块。\r\n防守可减少15%至100%的能量块损失。\r\n每次购买将获得特权时间3小时。\r\n连续购买后特权总时间将累加。",
		"GetCardTime":function(cdTime)
		{
			return "剩余时间: "+this.getTimeText(cdTime);
		},
		"ChipReq":"战斗胜利且勋章达到\n<num>即可获能量块奖励",
		"ShareBattle":"分享战斗",
		"ViewReplay":"播放",
		"ShowpTh":"土豪金卡",
		"ShowpThDesc":"只需20钻，即刻拥有土豪逆天特权！\r\n\r\nPVP战斗多获得15%至100%的黄金能源奖励！\r\n遭到攻击时减少15%至100%的资源损失！\r\n\r\n每次购买土豪金卡将获得3小时特权，连续购买可累计您的特权时间！不要犹豫，机不可失。",
		"ShowpCubeCard":"高端能量卡",
		"ShowpCubeCardDesc":"只需50钻，即刻拥有土豪逆天特权！\r\n\r\nPVP战斗多获得15%至100%的能量块奖励！\r\n遭到攻击时减少15%至100%能量块损失！\r\n\r\n每次购买高端能量卡将获得3小时特权，连续购买可累计您的特权时间！不要犹豫，机不可失。",
		"TroopStation":"兵力驻扎",
		"TroopCapNum":"驻扎数量",
		"NoRemain":"无剩余",
		"NotEnoughSpace":"驻扎空间不足",
		"ClanTroopDesc":"要驻扎作战单位，点击或按住单位图标不放并消耗钻石。",
		"FortTroopDesc":"要驻扎作战单位，点击或按住单位图标不放。",
		"MayGain":"有机会获得",
		"SurpriseObs":"惊喜圣诞树",
		"GainSurprise":"恭喜获得！",
		"GainSurpriseDesc":"恭喜，您找到了一件宝物！",
		"ClickToAddTroop":"点击单位图标即可完成驻扎",
		"ClickToAddTroopByGem":"点击单位图标消耗一定钻石即可完成驻扎",
		"WantAgain":"不满意这个结果？要不要再试试自己的手气？",
		"SameClanNoReward":"与盟友的战斗不可使用该功能！",
		"MonthCardNotAvailable":"很抱歉，该商品已停止售卖。",
		"CurScore":"当期积分",
	//	"CurRank":"阶段排名",
		"ContinueWin":"连胜场次",
		"ReadyMagic":"已准备好的卫星: ",
		"MakePower":"制造强大的卫星来支援你的战斗",

		"GiveGem":"分配钻石",
		"GiveLeader":"移交盟主",
		"SubLeader":"副盟主",
		"GiveOfficer":"任命官员",
		"NormalMember":"普通成员",
		"NewMember":"见习成员",
		"MedalNeed":"勋章要求",
		"DonateClan":"捐献",
		"SignClan":"签到",
		"GemStorage":"钻石仓库",
		"ClanTech":"联盟科技",
		"AllotGem":"分配钻石",
		"MakeLeader":"移交盟主",
		"MakeSubLeader":"副盟主",
		"MakeOffical":"官员",
		"MakeMember":"普通成员",
		"GemRemain":"仓库剩余：<num>颗钻石",
		"AllotGemDesc":"您即将向【<name>】分配联盟库存钻石。\n请输入要分配的钻石数量并确认。",
		"AllotGemTip":"说明：分配详细记录可以到钻石仓库中查看",
		"AllotGemTitle":"分配钻石",
		"InputErrorIllegal":"输入的数字不正确",
		"GemStorageTitle":"钻石仓库",
		"ClanGemGetTip":"获得方式：通过联盟各位将士在领土争夺战中的努力，获得胜利并占领相应领土，可获得大量钻石。",
		"AllotRecord":"分配记录",
		"Time":"时间",
		"AllotGemDetail":"盟主分配给<position>【<name>】<num>钻石",
		"GetGemDetail":"在领土争夺战中力夺<area>，获得<num>钻石",
		"Kick":"踢出",
		"Manage":"管理",
		"InputAllotGemNum":"输入要分配的钻石数量",
		"ClanDonate":"联盟捐献",
		"DonateDesc":"通过联盟成员捐赠，获得联盟点数。联盟点数可用于提升联盟等级、升级联盟科技。",
		"DonateResLack":"您的捐赠资源不足",
		"DonateResNum":"捐献50W金矿+50W能源",
		"DonateClanPoint":"联盟点数+<num>",
		"DonateClanGem":"力赠",
		"DonateClanDesc":"说明：联盟免费捐赠每天仅能捐献一次",
		"UpgrageClanToLv":"<lv>级联盟",
		"ClanMemberNum":"联盟人数",
		"UnlockTeck":"解锁科技",
		"ValidTime":"有效时间:",
		"Unlocked":"未解锁",
		"InCall":"号召中",
		"InUse":"已开启",
		"CallTech":"号召",
		"TechDesc":"提升联盟等级可以解锁高级科技，盟主或副盟主可以随时开启科技，有两种方式可供选择。\n1、盟主或副盟主花钻直接开启。2、盟主或副盟主号召联盟成员支援钻石开启。",
		"ReqClanTech":"发起联盟科技 \"<tech>\" 号召。",
		"ClanSigned":"已签到",
		"InputGemNum":"请输入正确的钻石数量",
		"NoClanDonateTimes":"今日免费捐献次数已用完，您可以使用钻石捐献，或明日再次捐献。",
		"ClanDonateSuccess":"捐献成功，联盟点数增加<num>",
		"ClanPointNotEnough":"联盟点数不足，需要联盟成员积极捐献以获得点数。",
		"ClanUpgradeOK":"联盟已升为<level>级，您的联盟更加强大了！",
		"DonateClanByRes":"向联盟捐献资源。",
		"DonateClanByGem":"为联盟成长做出巨大贡献，消耗<gem>钻石向联盟捐献资源！",
		"ClanPoint":"联盟点数",
		"ClanLevelUp":"联盟升级至<level>级。",
		"ClanAllotGemTo":"向<name>分配<gem>钻石。",
		"AgreeJoinClan":"<name1> 批准 <name2> 加入联盟。",
		"RefuseJoinClan":"<name1> 拒绝 <name2> 加入联盟。",
		"ClanJoinReqSend":"加入联盟的申请已发送，请等待批准，在此期间您可以申请加入其他联盟。",
		"BuyResCard1":"购买财富金卡",
		"BuyResCardDesc1":"每次购买可获得7天有效期。\r\n每日首次上线可获得双200万资源礼包。\r\n7天全部登陆可获得双1400万资源！\r\n每日零点，有效期减少一天。\r\n购买财富金卡不享受首冲双倍奖励。\r\n并且购买后将失去首冲双倍的权利。",
		"BuyResCard2":"购买财富银卡",
		"BuyResCardDesc2":"每次购买可获得7天有效期。\r\n每日首次上线可获得双30万资源礼包。\r\n7天全部登陆可获得双210万资源！\r\n每日零点，有效期减少一天。\r\n购买财富银卡不享受首冲双倍奖励。\r\n并且购买后将失去首冲双倍的权利。",
		"BuyResCard3":"购买超级能量卡",
		"BuyResCardDesc3":"每次购买可获得7天有效期。\r\n每日首次上线可获得5000能量块资源礼包。\r\n7天全部登陆可获得35000能量块资源！\r\n每日零点，有效期减少一天。\r\n购买超级能量卡不享受首冲双倍奖励。\r\n并且购买后将失去首冲双倍的权利。",
		"WeekResCardReward":"7天资源礼包",
		"ResCardInCD":"财富卡在有效期内不可重复购买。",
		"ResCardInProcess":"服务器正在处理该物品的购买请求，请耐心等待。",
		"YesterdayInfo":"昨日战报",
		"TodayInfo":"今日战绩",
		"TechInCall":"该科技已经被号召，请到联盟科技中响应号召。",
		"TechInUse":"该科技已经开启。",
		"ClanDeclareWar":"本盟已经向 \"<area>\" 地区发起宣战，请大家齐心协力，夺下这块领地。",
		"ClanCallTech":"发起联盟科技 \"<tech>\" 号召。请大家积极响应，尽快开启联盟科技。",
		"ClanTechResponse":"响应了联盟科技 \"<tech>\"。",
		"ClanTechGemDone":"使用钻石开启了联盟科技 \"<tech>\"。",
		"ClanTechExpired":"已过期",
		"LandWar":"领土争夺战",
		"OnlyLeaderCanUse":"只有你所在联盟的盟主和副盟主可以使用此功能。",
		"ClanDeclared":"联盟每天只能向一块领土宣战。",
		"UserJoinedClan":"该玩家已经加入其他联盟。",
		"UHaveNoJurisdiction":"您没有权限进行此操作。",
		"TechGem":"科技花费",
		"ContributionGem":"捐献花费",
		"TechTimes":"科技响应",
		"ContributionTimes":"捐献次数",
		"DeclareLand":"联盟已经向 <area> 宣战。",
		"LandWarTarget":"领土争夺战目标",
		"LandWarSelfScore":"个人当前积分",
		"ClanJoinRefuse":"入盟申请被拒绝。",
		"CurDeclareLand":"当前宣战领地",
		"CurLandScore":"当前联盟积分",
		"AllotGemSuccess":"分配钻石成功。",
		"YesterdayAtkRpt":"昨日进攻总结",
		"YesterdayDefRpt":"昨日防守总结",
		"AtkWinDesc":"太棒了，在大家的努力下，我们夺得了这块战略要地，请大家再接再厉，在明天取得新的战果！",
		"AtkLoseDesc":"很遗憾，我们遇到了棘手的敌人，没能取得这块阵地。我们需要继续努力，打一个翻身仗！",
		"DefWinDesc":"太棒勒，没有人能够超越我们在这块阵地创造的战果，领地防守成功，它依然属于我们的联盟！",
		"DefLoseDesc":"很遗憾，我们的领地遭受敌人的猛烈进攻，阵地已经沦陷，快集结部队展开反击吧！",
		"SignOk":"签到成功，联盟点数增加1点，感谢您对联盟成长做出的贡献！\r\n您刚刚获得一枚神秘徽章，请您在礼包中进行领取。",
		"CallTechOk":"您已经成功号召联盟科技\"<tech>\"。",
		"ResponseTechOk":"您响应了联盟科技\"<tech>\"的号召，为联盟做出了贡献。",
		"GemDoneTechOk":"您已经成功开启联盟科技\"<tech>\"。",
		"ClanGemRemain":"仓库剩余：",
		"TryJoinClan":"想要加入联盟。",
		"ClanJoinClosed":"对方已关闭联盟加入。",
		"ClanMembersMax":"联盟成员已满。",
		"SubLeaderMax":"副盟主数量已达上限，无法继续委任。",
		"YouHaveClan":"您已经加入联盟，不需要创建新联盟。",
		"LandWarHelp":"领土争夺战说明",
		"LandWarDesc":"领土争夺战开启期间，联盟每天可指定一块区域作为攻击目标。联盟成员在PVP模式中获胜，将获得个人领土争夺战积分。\r\n\r\n联盟攻打无主区域，总积分最高者将获得该领土所有权。攻占已被占领的区域，需要总积分最高且大于昨日占领分数。\r\n\r\n领土战于每日22时将进行结算并产出钻石到归属联盟。结算后联盟需重新选择进攻的区域。\r\n\r\n领土战结束后，占领区域将不再产出钻石。",
		"LandWarTip":"领土争夺战将在每天22点进行积分结算！",
		"LandWarEnd":"领土争夺战已经结束。",
		"LandWarRewardDesc":"攻打领地 \"<area>\" 获胜，奖励<num>钻石。",
		"SupportCnt":"受援数",
		"BuyGiftCard":"购买机甲福袋",
		"BuyGiftCardDesc":"机甲福袋！内含：\r\n黄金幽灵  20级\r\n黄金天行者  20级\r\n霸王龙模块  A级\r\n1000000金矿",
		"GiftCardTitle":"机甲福袋",
		"Once4NewYear":"活动期间限购一次",
		"TroopsRepaired":"您的兵已恢复。",
		"ItemOnlyBuyOnce":"该商品不可重复购买。",
		"TrainOil":"普通兵种",
		"TrainCube":"高级兵种",
		"ResearchOil":"普通兵种",
		"ResearchCube":"高级兵种",
		"":"",
		"":"",
		"":"",
		"":"",
		"":"",

		"hjys":"合金要塞",
		"ClanYesterdayInfo":"联盟昨日战报",
		"YesterdayFight":"昨日作战目标",
		"YesterdayFightScore":"昨日作战总积分",
		"TargetVesting":"目标最终归属",
		"TargetVestingScore":"目标最终归属时的积分",

		"HP":"血量",
		"Cap":"容量",
		"CapStorage":"存储量",
		"CapTroop":"兵力",
		"CapTotalTroop":"总兵力",
		"CapClan":"联盟兵力",
		"CapSpell":"卫星数量",
		"PrdctRate":"每小时产出",//"产出率",
		"PerHour":"每小时",
		"DmgPerSec":"每秒伤害",
		"HealPerSec":"每秒治疗",
		"DmgRange":"攻击范围",
		"Tiles":"单位距离",
		"DmgFavor":"首选目标",
		"DmgType":"伤害类型",//单体、群伤
		"DmgTarget":"攻击目标",//对地、对空
		"HousingSpace":"占用空间",
		"TrainingTime":"训练时间",
		"TrainingCost":"训练花费",
		"MaxRecruitNum":"最大招募数量",
		"MovementSpeed":"移动速度",
		"TimeToCreate":"制造时间",
		"Heal":"治疗量",
		"HealType":"治疗类型",
		"TotalDmg":"总伤害",
		"TotalHeal":"治疗总量",
		"Cost":"花费",
		"AddHP":"血量加成",
		"AddSpd":"移动速度加成",
		"AddAtk":"攻击加成",
		"HealType":"治疗类型",
		"EffectType":"生效类型",

		"RemainTime":"剩余时间:",
		"FinishNow":"立刻完成:",
		"ConfirmGemFinish":"确认花费 <gem> 钻石来立刻完成这次升级？",
		"ConfirmSell":"出售物品",
		"ConfirmSellDesc":"您确认出售该物品以换取 <num> <res>吗？",
		"RemainTroopCap":function(cur,max,bld)
		{
			var codeName="Camp";
			if(bld)
				codeName=bld.def.codeName;
			return "训练完成后"+window.aisEnv.textLib.bldName[codeName]+"剩余容量:"+cur+"/"+max;
		},

		"Battle":"战斗",
		"Match":"搜寻对手",
		"PveBtn":"剿灭海盗",
		"OltBtn":"开始防守",
		"OltLevel":"关卡 <cur>/<max>",
		"RemainRes":"剩余资源",
		"Dungeon":"关卡",
		"Challenge":"挑战关卡",
		"YouGain":"您获得:",
		"ArmyConsume":"军队花费:",
//		"Facebook":"Victory in Pocket Fort! I looted <gold_num> gold and <energy_num> energy in battle. Match that!",
//		"Twitter":"Victory in Pocket Fort! I looted <gold_num> gold and <energy_num> energy in battle. Match that!",

		"BattleTips":"点击空地可派出部队进行战斗\n请确认是否开战",
		"NotPut":"这个区域不能放置部队！",
		"NotPutByMedal":"使用机甲战士失败，您需要提高勋章总数量！",
		"DontHaveSoldiers":"该兵种已全部使用，请选择其他兵种!",
		"MayGainItems":"可能获得代币",
		"Next":"下一个",
		"Defeat":"胜利/失败",
		"EndBattle":"结束战斗",
		"BattleStartIn":"距离战斗开始：",
		"BattleEndIn":"距离战斗结束：",
		"ReplayEndIn":"距离播放结束：",
		"ReserchLevelNotMatch":"研究所等级不够",
		"MechLevelNotMatch":"机甲工厂等级不够",
		"NotEnough":"剩余空间不足",
		"NotEnoughGold":"没有足够黄金！！",
		"NotEnoughStorage":"您的仓库已经没有足够的剩余空间！！",
		"NotEnoughItem":"额外消耗不足!",
		"NotUser":"未找到玩家！",
		"UserOnline":"玩家处于在线状态，无法攻击！",
		"UserProtected":"玩家当前正处于隐形力场的保护下！",
		"UserAttack":"玩家当前正遭受攻击！",
		"UserClan":"玩家是您的盟友，无法攻击！",
		"ConfirmEndBattle":"结束战斗？",
		"sureEndBattle":"您是否要结束这场战斗？",
		"ConfirmEndOnslaught":"离开守城模式",
		"sureEndOnslaught":"现在离开，当前关卡挑战失败，确认离开？",
		"OnslaughtWin":"防守胜利",
		"sureOnslaughtNext":"长官，我们成功抵御了敌人的攻击，继续挑战下一关吗？",
		"OnslaughtFail":"防守失败",
		"sureOnslaught":"很遗憾,我们的防线被敌人突破了。请重新部署再来挑战!",
		"NotEnougGem":"钻石不足",
		"NeedGemNum":function(num)
		{
			return "缺少 "+num+" 钻石，是否现在进入商店购买？";
		},
		"NotEnougRes":"资源不足",
		"NeedResNum":function(resType,resName,num)
		{
			return "缺少 "+num+" "+resName+"，是否立刻使用钻石兑换？";
		},
		"NumberLimited":"已经超出建造上限！",
	//	"Replay":"重放中",
		"X1":"1X",
		"X2":"2X",
		"X3":"3X",
		"X4":"4X",
		"BackHome":"返回要塞",
		"Day":"天",
		"Hour":"时",
		"Minute":"分",
		"Second":"秒",
		"NotUnit":"没有作战单位可以出征！！！",
		"InputName":"请输入玩家名：",
		"SameName":"此用户名已经存在！！",
		"NotExistName":"用户不存在！！",
		"IllName":"非法用户名！！",
		"SignFailed":"登陆验证失败！！",
		"NullName":"用户名不能为空！！",
		"NoShield":"无保护",
		"Notice":"公告",
		"Gift":"礼包",
		"Worker":"建设工人",

		"PushMsgTrainFull":"哇哦，训练场已经塞满了我们的部队，找个人掠一把？",
		"PushMsgBuild":"包工头报告，建设工作已经完工，工人先洗洗睡了！",
		"PushMsgTrainFinish":"士官长报告，所有生产训练完成，等待下一步指示！",
		"PushMsgTech":"研究所报告，升级工作已经完成，我们越来越NB了！",
		"PushMsgOneDay":"今天大家都非常松散，快带领大家找个人来干一仗吧！",
		"PushMsgThreeDay":"大家已经放羊3天了，这样下去可不行啊！",
		"PushMsgShield":"注意，隐形立场的保护将在30分钟后失效。",
		"PushMsgDiamond":"别忘了来收取刚刚出炉的免费钻石哦！",

		"ClanCreate":"创建联盟",
		"ClanRecommend":"推荐",
		"ClanSearch":"搜索联盟",
		"ClanSelf":"我的联盟",
		"ClanRank":"联盟排行",
		"ClanName":"联盟名称",
		"ClanBadge":"联盟徽章",
		"ClanDeclare":"联盟宣言",
		"ClanContribution":"联盟贡献",
		//********今日战报界面****
		"ClanTodayInfo":"联盟今日战报",
		"TargetDomain":"今日作战目标",
		"TargatMinScore":"目标最低积分",
		"OwnerDomains":"联盟已经占领的领地",
		"CurMaxScore":"当前最高分",
		"ClanCurScore":"联盟总积分",
		"SelfScore":"个人当日积分",
		"ClanMembersScoreRank":"联盟成员积分排行",
		//*******可掠夺区域信息界面****
		"AreaInfo":"可掠夺区域的信息",
		"OccupyClan":"占领联盟",
		"OccupyClanLeader":"占领联盟盟主",
		"OccupyScore":"占领积分",
		"DiamondOutput":"产出量",
		"AreaAttacker":"正在进攻该区域的联盟（共<num>个）",
		"NoClans":"没有正在进攻该区域的联盟",

		"JoinMode":"加入方式",
		"ScoreRequire":"勋章条件",
		"ClanModify":"修改",
		"ClanScore":"联盟勋章",
		"ClanMembers":"成员数量",
		"JoinRequire":"加入条件",
		"Join":"加入",
		"Leave":"离开",
		"Edit":"编辑",
		"EditSuccess":"联盟信息修改成功",
		"EditFailed":"联盟信息修改失败",
		"Submit":"提交",
		"Search":"搜索",
		"SearchTip":"请输入要搜索的联盟名称或其中的某个字符",
		"SearchError":function(name)
		{
			return "没有找到名字包含 "+name+" 的联盟";
		},
		"InputClanName":"请输入联盟名称",
		"InputClanDeclare":"请输入您的宣言",
		"InputSearchName":"请输入要搜索的联盟名称",
		"InputChatMsg":"请输入您要发送的内容",
		"ClanInfoError":"联盟信息异常",
		"ClanType0":"自由加入",
		"ClanType1":"邀请加入",
		"ClanType2":"关闭加入",
		"ClanType3":"申请加入",
		"ClanLeave":"离开了联盟",
		"ClanJoin":"加入了联盟",
		"ClanCreated":"创建了联盟",
		"ClanKicked":"被踢出了联盟",
		"ClanPromoted":"成为 <position>",//"官职提升",
		"ClanReqTroops":"请求援军",
		"ShareVideo":"分享视频",
		"ShareOk":"分享成功",
		"LevelMsgOk":"留言成功",
		"Share":"分享",
		"EnterToInputForLoser":"战后留言",
		"SeniorCorps":"高级兵",
		"LevelMsg1Star":"就算你复仇打回来，我依然会是赢家，哈哈",
		"LevelMsg2Star":"就算你复仇打回来，我依然会是赢家，哈哈",
		"LevelMsg3Star":"就算你复仇打回来，我依然会是赢家，哈哈",
		"ClanReqJoin":"申请入盟",
		"ClanPosition0":"成员",
		"ClanPosition1":"盟主",
		"ClanPosition2":"官员",
		"ClanPosition3":"副盟主",
		"ClanPosition4":"见习成员",
		"Donate":"支援",
		"ClanKick":"踢出",
		"ClanPromote":"委任",
		"ClanNotLogin":"联盟未登录",
		"ClanNotJoin":"还未加入联盟",
		"ClanMsg":"联盟消息",
		"ClanSameName":"联盟名称重复",
		"SltBadge":"请选择联盟徽章",
		"UBePromote":"您的联盟职位已经提升",
		"UBeKick":"您被踢出了联盟",
		"UJoinClan":"您已成功加入联盟",
		"UCreateClan":"创建联盟成功",
		"JoinClanError":"加入联盟失败",
		"NotMeetMedal":"您的勋章不足",
		"ClanNotOpen":"该联盟未开放成员加入",
		"ClanIsFull":"联盟成员已满",
		"ULeaveClan":"您已离开联盟",

		"LeaderLeaveClan":function(name)
		{
			return "盟主 "+name+" 离开了联盟";
		},
		"UBeLeader":"您被提升为了盟主",
		"NewLeader":function(name)
		{
			return name+" 被提升为了盟主";
		},
		"RankClan":"联盟排行",
		"RankPlayer":"玩家排行",
		"RankSearch":"搜索",
		"ViewClan":"联盟",
		"SearchCost":"搜索花费:",
		"MultMode":"多人模式",
		"SingleMode":"单人模式",
		"CurMedal":"当前勋章:",
		"CurStar":"当前星数:",
		"InShield":"处于保护",
		"InShieldDesc":"您正处于保护状态，攻击他人将使隐形力场立即失效，是否继续？",
		"NoReduce":"不会减少兵力",
		"NeedMedal":function(num)
		{
			return num+" 勋章以上";
		},
		"DonateNum":function(cur,max)
		{
			return "支援数量: ("+cur+"/"+max+")";
		},

		"ParamError":"参数错误",
		"AskJoinClan":"加入联盟",
		"AskJoinClanInfo":function(clanName)
		{
			return "确认加入 "+clanName+" 联盟？";
		},
		"AskLeaveClan":"退出联盟",
		"AskLeaveClanInfo":"确定退出联盟？",
		"AskKick":"踢出联盟",
		"AskKickInfo":function(userName)
		{
			return "确认将 "+userName+" 踢出联盟？";
		},
		"AskPromote":"委任",
		"AskPromoteInfo":function(userName,rank)
		{
			return "确认将 "+userName+" 设为"+this["ClanPosition"+rank]+"？";
		},

		"Refuse":"拒绝",
		"Agree":"同意",
		"World":"世界",
		"Clan":"联盟",

		"UBeAttack":"要塞遭到攻击!",
		"UBeAttackDesc":"首长，在您离开这段时间内，我们的要塞遭到进攻，您可在战斗记录中查询详情",
		"TotalScore":"总计",

		"LogDefence":"防御",
		"LogAttack":"进攻",

		"StrDay":"天",
		"StrHour":"时",
		"StrMin":"分",
		"StrSec":"秒",
		//代币相关
		"ItemStorage":"物品仓库",
		"ItemName":"物品名称",
		"ItemDesc":"功能描述",
		"AllItems":"全部物品",
		"UseItem":"使用",
		"ConditionNotEnough":"使用条件不满足",
		"TimesOver":"次数受限",
/********特别补给相关**********/
		"FirstCharge":"首充双倍！",
		"FirstChargeReward":function(name,num)
		{
			return "欢迎参加首充双倍活动。您本次购买的礼包【"+name+"】在双倍后将获得【"+(num*2)+"】颗钻石。\r\n\r\n首充双倍，充值即送，充多送多！仅限首次充值！";
		},
		"DoubleVip":"VIP升级充值福利！",
		"DoubleVipReward":function(name,num)
		{
			return "尊享VIP福利，您本次购买的礼包【"+name+"】在双倍后将获得【"+(num*2)+"】颗钻石。\r\n\r\n更高等级VIP将获得更高福利！";
		},
		"PayDCSY":"手机网银",
		"PayDCSZX":"话费卡",
		"PayDCZFB":"支付宝",
		"PayMO9":"先玩后付MO9",
		"PayCMGC":"购买",
		"PaySMS":"短信支付",
		"buyItem":"充值",
		"buyTip":"充值申请提交时，服务器需要一定时间来处理，请耐心等待。",//您是否要购买 <number> 的钻石？
		"buyokTip":"充值成功，你将获得 <number> 的钻石！",
		"buyResTip":"您是否要使用钻石购买 <number> 的<res>？",
		"FillGold10":"补充10%金库资源",//Fill Gold Storages by 10%
		"FillGold50":"补充50%金库资源",//Fill Gold Storages by Half
		"FillGold100":"补满金库",//Fill Gold Storages
		"FillOil10":"补充10%能源罐资源",//Fill Oil Storages by 10%
		"FillOil50":"补充50%能源罐资源",//Fill Oil Storages by Half
		"FillOil100":"补满能源罐",//Fill Oil Storages
		"FillCube10":"补充10%能量库资源",
		"FillCube50":"补充50%能量库资源",
		"FillCube100":"补满能量库",
		"FillRes":function(res,rate)
		{
			var codeName="";
			if("Gold"==res){
				codeName="GoldVault";
			}else if("Oil"==res){
				codeName="OilTank";
			}else if("Cube"==res){
				codeName="CubeCan";
			}
			if(10==rate || 50==rate)
				return "补充"+rate+"%"+window.aisEnv.textLib.bldName[codeName]+"资源";
			else if(100==rate)
				return "补满"+window.aisEnv.textLib.bldName[codeName];
		},
/****************************/
		getGemTip:"您成功获得了 <number> 枚钻石！",
		DeadRate40:"对方获得4小时的隐形力场",
		DeadRate90:"对方获得6小时的隐形力场",
		DeadRate100:"对方获得8小时的隐形力场",

		VipUpgradeNeedReload:"恭喜您已经荣升至VIP<lv>了，需要重新打开游戏，才能享受新的VIP贵宾待遇",
		GemBoostNeedReload:"钻石熔压器加速充值成功，请点击确定重新登录，以启动加速效果。",
		MonthCardNeedReload:"钻石月卡购买成功，获得30天有效期！恭喜您的VIP等级提升！请重新加载游戏。",
		MonthCardBuyOk:"钻石月卡购买成功，获得30天有效期！",
		MonthCard15NeedReload:"小资包月购买成功，恭喜您的VIP等级提升！请重新加载游戏。",
		THNeedReload:"土豪金卡购买成功，恭喜您的VIP等级提升！请重新加载游戏。",
		WeekCardRes12NeedReload:"财富银卡购买成功，获得7天有效期！恭喜您的VIP等级提升！请重新加载游戏。",
		WeekCardRes68NeedReload:"财富金卡购买成功，获得7天有效期！恭喜您的VIP等级提升！请重新加载游戏。",
		WeekCardCube68NeedReload:"超级能量卡购买成功，获得7天有效期！恭喜您的VIP等级提升！请重新加载游戏。",
		MonthCard15BuyOk:"小资包月购买成功！",
		THBuyOk:"土豪金卡购买成功！",
		WeekCardRes12BuyOk:"财富银卡购买成功，获得7天有效期！",
		WeekCardRes68BuyOk:"财富金卡购买成功，获得7天有效期！",
		WeekCardCube68BuyOk:"超级能量卡购买成功，获得7天有效期！",
		GiftNeedReload:"机甲福袋购买成功！请查收礼包。恭喜您的VIP等级提升！请重新加载游戏。",
		GiftBuyOk:"恭喜您获得机甲福袋！礼品将以礼包形式发放，请注意查收。",
		Gift2NeedReload:"中国好机甲购买成功！请查收礼包。恭喜您的VIP等级提升！请重新加载游戏。",
		Gift2BuyOk:"恭喜您获得中国好机甲！礼品将以礼包形式发放，请注意查收。",
		CubeCardNeedReload:"高端能量卡购买成功，恭喜您的VIP等级提升！请重新加载游戏。",
		CubeCardBuyOk:"高端能量卡购买成功！",

		SpecialBuy:"购买商品",
		SureSpecialBuy:"确认购买？",
		SpecialBuyFail:"购买失败！",
		SpecialBuyOk:function(name)
		{
			return name+"购买成功！";
		},
		SpecialGiftBuyOk:function(name)
		{
			return name+"购买成功，请查收礼包！"
		},
		AskGemFinInfo:function(gemNum)
		{
			return "首长,使用 "+gemNum+" 钻石就可以立刻完成这项工程, 请您批准.";
		},
		"AskExit":"是否要退出游戏？",
		"QuitContent":"更多精彩游戏尽在游戏频道\ng.10086.cn",
		AskBoostInfo:function(buffDef)
		{
			if(buffDef.codeName.indexOf("Oil")>-1 || buffDef.codeName.indexOf("Gold")>-1 || buffDef.codeName.indexOf("Cube")>-1)
				return "您是否确定使用"+buffDef.cost.gem+" 钻石，提升资源产量 "+buffDef.factors[0].mbf+" 倍，该效果持续 "+this.getTimeText(buffDef.durTime)+" ？";
			else if(buffDef.codeName.indexOf("Unit")>-1)
				return "您是否确定使用"+buffDef.cost.gem+" 钻石，提升训练士兵的速度 "+buffDef.factors[0].mbf+" 倍，该效果持续 "+this.getTimeText(buffDef.durTime)+" ？";
			else if(buffDef.codeName.indexOf("Spell")>-1)
				return "您是否确定使用"+buffDef.cost.gem+" 钻石，提升生产卫星的速度 "+buffDef.factors[0].mbf+" 倍，该效果持续 "+this.getTimeText(buffDef.durTime)+" ？";
			else if(buffDef.codeName.indexOf("Gem")>-1)
				return "您是否确定使用"+buffDef.cost.gem+" 钻石，将钻石熔压器产量提升为 "+buffDef.factors[0].add+" 个/天，该效果持续 "+this.getTimeText(buffDef.durTime)+" ？";
		//	return "首长, 使用"+buffDef.cost.gem+" 钻石可以开启为期"+this.getTimeText(buffDef.durTime)+"的时空加速, 请您批准.";
		},
		NoResBuildInfo:function(shortVO)
		{
			var text,list,i,n,def;
			if(shortVO)
			{
				text=" (";
				if(shortVO.gem)
				{
					text+="钻石: "+shortVO.gem+"/ ";
				}
				if(shortVO.cash)
				{
					text+="现金: "+shortVO.cash+"/ ";
				}
				if(shortVO.storage)
				{
					list=shortVO.storage;
					n=list.length;
					for(i=0;i<n;i++)
					{
						text+=list[i].name+": "+list[i].num;
						if(i<n-1)
							text+="/ "
					}
				}
				text+=")";
				return "首长, 由于缺少必要的资源 "+text+", 我们无法现在执行建造设施任务, 请收集更多资源."
			}
			return "首长, 由于缺少必要的资源, 我们无法现在执行建造设施任务, 请收集更多资源.";
		},
		NoResUpgradeInfo:function(shortVO)
		{
			var text,list,i,n,def;
			if(shortVO)
			{
				text=" (";
				if(shortVO.gem)
				{
					text+="钻石: "+shortVO.gem+"/ ";
				}
				if(shortVO.cash)
				{
					text+="现金: "+shortVO.cash+"/ ";
				}
				if(shortVO.storage)
				{
					list=shortVO.storage;
					n=list.length;
					for(i=0;i<n;i++)
					{
						text+=list[i].name+": "+list[i].num;
						if(i<n-1)
							text+="/ "
					}
				}
				text+=")";
				return "首长, 由于缺少必要的资源"+text+", 我们无法现在执行升级建设施务, 请收集更多资源."
			}
			return "首长, 由于缺少必要的资源, 我们无法现在执行升级建设施务, 请收集更多资源.";
		},
		barracksDlgTitle:function(bld)
		{
			var cap;
			cap=bld.getValue("mfcCap");
		//	return "兵工厂 ("+bld.slotCap+"/"+cap+")";
			return window.aisEnv.textLib.bldName[bld.def.codeName]+" ("+bld.slotCap+"/"+cap+")";
		},
		partDlgTitle:function(bld)
		{
			return "机甲零件";
		},
		unitNeedBldLevel:function(level,bld)
		{
			var codeName="Barrack";
			if(bld)
				codeName=bld.def.codeName;
			return "训练需要:\n"+window.aisEnv.textLib.bldName[codeName]+level+"级.";
		},
		mechNeedBldLevel:function(level,bld)
		{
			var codeName="MechFactory";
			if(bld)
				codeName=bld.def.codeName;
			return "生产需要:\n"+window.aisEnv.textLib.bldName[codeName]+level+"级.";
		},
		mdwDlgTitle:function(bld)
		{
			var cap;
			cap=bld.getValue("mfcCap");
		//	return "核武中心 ("+bld.slotCap+"/"+cap+")";
			return window.aisEnv.textLib.bldName[bld.def.codeName]+" ("+(bld.slotCap+bld.tgtStorage.getUsedCap())+"/"+cap+")";
		},
		spellNeedBldLevel:function(level,bld)
		{
			var codeName="SpellLab";
			if(bld)
				codeName=bld.def.codeName;
			return "训练需要:\n"+window.aisEnv.textLib.bldName[codeName]+level+"级.";
		},
		researchNeedBldLevel:function(level,bld)
		{
			var codeName="TechLab";
			if(bld)
				codeName=bld.def.codeName;
			return "研究需要:\n"+window.aisEnv.textLib.bldName[codeName]+level+"级.";
		},
		BldNeedFeature:function(list)
		{
			return "该建筑需要: "+window.aisEnv.defLib.feature[list[0]].name;
		},
		ReqNotMeet:function(name)
		{
			return "条件不满足: 需要"+name;
		},
		AchNeed:function(str,num)
		{
			if(!str)return "???";
			return str.replace("<number>",num);
		},
		digiGapText:function(score){
			var len;
			score=""+score;
			len=score.length;
			//DBOut(">>>>>>>>>Len: "+len);
			while(len>3)
			{
				len-=3;
				score=score.substring(0,len)+","+score.substring(len);
			}
			//DBOut(">>>>>>>>>score: "+score);
			return score;
		},
		getTimeText:function(time){
			var d,h,m,s,str;
			d=Math.floor(time/(1000*60*60*24));
			time-=d*(1000*60*60*24);
			h=Math.floor(time/(1000*60*60));
			time-=h*(1000*60*60);
			m=Math.floor(time/(1000*60));
			time-=m*(1000*60);
			s=Math.floor(time/(1000));
			if(d)
			{
				str=""+d+"天 ";
				if(h)str+=(h+"小时 ")
			//	return ""+d+"天 "+h+"小时 ";
			}
			else if(h)
			{
				str=""+h+"小时 ";
				if(m)str+=(m+"分 ")
			//	return ""+h+"小时 "+m+"分 ";
			}
			else if(m)
			{
				str=""+m+"分 ";
				if(s)str+=(s+"秒 ")
			//	return ""+m+"分 "+s+"秒";
			}
			else
			{
				str=""+s+"秒 ";
			//	return ""+s+"秒";
			}
			return str;
		},
		getDebugTimeText:function(time){
			var d,h,m,s;
			d=Math.floor(time/(1000*60*60*24));
			time-=d*(1000*60*60*24);
			h=Math.floor(time/(1000*60*60));
			time-=h*(1000*60*60);
			m=Math.floor(time/(1000*60));
			time-=m*(1000*60);
			s=Math.floor(time/(1000));
			return ""+d+"d "+h+"h "+m+"m "+s+"s";
		},
		Donate2U:function(username,unitname,unitlevel){
			return username+" 给你捐了一个 "+unitname+"("+this.getLevel(unitlevel)+")"+"。";
		},
		getLevel:function(level)
		{
			return level+" 级";
		},
		getTimeDistance:function(time){
			time=window.aisEnv.dateTime()-time;
			time=time<0?0:time;
			var str=this.getTimeText(time);
			return str+"之前";
		},
		getRemainNum:function(num){
			return "剩余 "+num;
		},
		ClanNeedBld:function()
		{
			return "需要建立 "+window.aisEnv.textLib.bldName["ClanBld"];
		},
		askBuyGemBoost:"花费<rmb>元可加速生产，将钻石熔压器产量提升为每天<num>颗，效果持续<day>天（充值成功时开始计算），服务器处理充值申请需要一定时间，请耐心等待。\n确认充值？",
		ConfirmJumpGuide:"继续新手指引",
		sureJumpGuide:"下面将指导您怎样建设要塞，是否继续？点击确认继续，点击取消跳过新手指引。",
//		GPEvaluate:"Like this game?",
//		GPEvaluateInfo:"We appreciate your rating us a 5-star.",
//		GPCancel:"Later",
//		GPOk:"Yes",
		MechNo2AtkTitle:"勋章数不高啊...",
		MechNo2AtkInfo:"长官，您的勋章数量低于总部当前考核分数。请提升勋章数量至<num>，以获得机甲战士的使用权限。",
		getMechOk:"机甲组件领取成功，请点击按钮重新进入游戏。",
		getMechFull:"抱歉，机甲工厂内的组件仓库空间不足，无法领取机甲组件。升级机甲工厂或选择销毁低级组件可获得空余的仓库空间。",
		noHaveMacshop:"您需要首先建造机甲工厂,才能领取存放机甲组件和火控模块。",
		CutTimeTitle:"时间碎片：",
		MedalTitle:"勋章：",
		MacDefenseMode:"生死之间",
		ShareBattleError:"加入联盟后才能分享视频",
		AskGemFinRqstCD:"立刻请求支援！",
		AskGemFinRqstCDInfo:function(gemNum)
		{
			return "首长,使用 "+gemNum+" 钻石就可以立即请求支援，请您批准。";
		},
		ClearClanCupInfo:"本日领土争夺战已完成战况统计，请于昨日战报中查看详情。",
		BattleClantecLabel:"守方联盟科技",
		DeclarewarError:"抱歉，无法进行攻打，领土争夺战已经结束。",
		AdwaysTitle:"免费钻石提示",
		AdwaysInfo:"通过下载其他软件并完成对应需求，您可以获得免费钻石礼包，礼包发放受第三方影响存在滞后性，请您谅解。软件列表会适时刷新，记得常来看看有没有新下载哦！",
	};
}
