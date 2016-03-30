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
		"_Builder":"Worker:",
		"_Shield":"Force Field:",
		"_Max":"Max:",
		"Battle Shop":"Shop",
		"Treasure":"Special Supply",
		"Resources":"Resources",
		"Decorations":"Decorations",
		"Army":"Army",
		"Defense":"Defenses",
		"Shield":"Force Field",
		"Special":"Secret Shop",
		"GlobalTimes":"Hot Sale",
		"PersonalDailyTimes":"Daily Special",
		"PersonalTimes":"Gamer Special",
		"SpecialSupply":"Special Supply",
		"Built":"Built",
		"Choose position":"Select a location",
		"Level Text":function(level){return " Lv."+level;},
		"Constructing":"Constructing…",
		"Time_NONE":"Rush",
		"BadBuildMaxCap":"Building has reached its max. Upgrade HQ to build more.",
		"BadBuildMaxCap_WorkerHud":"Upgrade HQ to build more.",
		"ReqNeedForBld":"You have not met the requirement.",
		"ResNeedForUnit":"Not enough energy! You cannot train the troop.",
		"TrainTip":"Press and hold to train troops.",
		"TrainCampFull":"Parade Ground is full! ",
		"NoResTitle":"Not enough resource!",
		"AskBoost":"Space Accelerator activated!",
		"AskGemFin":"Complete now!",
	//	"Tech Lab":"R&D Center",
		"TechCount":"Battle Info",
		"TrainNum":"Trained",
		"ActiveRate":"Usage",
		"NetError":"Game data error, please re-login!",
		"NetDisconnect":"Connection lost!",
		"SysFull":"Server is full! Please try again later.",
		"TimeOut":"The connection to the server has timed out.",
		"OK":"OK",
		"Cancel":"Cancel",
		"EnterShop":"Go to Shop",
		"OverflowStorage":"Not enough space",
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
			return "Please upgrade your "+name+".";
		},
		"IsBoosting":"The building is under booster.",
		"IsBoostingDesc":"If you upgrade the building now, the Space Accelerator will stop. Confirm to upgrade?",
		"IsBuilding":"Cancel Build?",
		"IsBuildingDesc":"Confirm to stop building the construction? Only half of the consumption will be returned.",
		"IsBld":"Cancel Demolish?",
		"IsBldDesc":"Confirm to stop the building demolition?",
		"IsMaking":"Disconnect?",
		"IsMakingDesc":"Confirm to stop the connection? Only half of the consumption will be returned.",
		"IsMaxLv":"Building has reached its max level.",
		"NotOpen":"Coming soon",
		"TrainStucked":"Training stopped! The Parade Ground is full.",
		"Unlock":"Unlock",
		"UpgradeTime":"Upgrade time",
		"NoLog":"No battle report",
		"IsLoading":"Loading…",
		"GetInfoError":"Loading failed",
		"NoFreeWorker":"All workers are busy!",
		"NoFreeWorkerDesc":"No worker is available now. Complete the previous construction and free up a worker?",
		"ShieldCD":"Force Field is not available.",
		"ShieldCDTime":function(cdTime)
		{
			return "Force Field is not available, time left "+this.getTimeText(cdTime);
		},
		"ShareCDTime":function(cdTime)
		{
			return "You have shared a video once, please try again"+this.getTimeText(cdTime)+"later";
		},
		"GetCDTime":function(cdTime)
		{
			return "Cooldown: "+this.getTimeText(cdTime);
		},

		"Achieve":"Achievements",
		"AchieveComplete":"Achievement obtained!",
		"ReceiveReward":"Claim",
		"BattleLog":"Battle Report",
		"BeyondRewardLimit":"No chances to loot more debris today.",
		"DefResult0":"Won",
		"DefResult1":"Lost",
		"DefResult2":"Lost",
		"DefResult3":"Lost",
		"AtkResult0":"Lost",
		"AtkResult1":"Won",
		"AtkResult2":"Won",
		"AtkResult3":"Won",
		"Lost":"Loss",
		"Gain":"Received",
		"Replay":"Replay",
		"ReplayAgain":"Replay",
		"OnslaughtMode":"Defense Mode",
		"OnslaughtLevel":"Stage <level>",
		"Expired":"Replay has expired.",
		"Revenge":"Revenge",
		"Revenged1":"Revenged",
		"Revenged2":"Revenge not available",
		"TotalRecord":"Overall",
		"TotalCount":"Battles",
		"WinRate":"Total Win",
		"AtkRecord":"Attack",
		"AtkCount":"Attacks",
		"AtkWinRate":"Win %",
		"DefRecord":"Defense",
		"DefCount":"Defenses",
		"DefWinRate":"Win %",
		"WinningStreak":"Winning streak",
		"HighestRank":"Best rank",
		"TotalKill":"Enemy killed",
		"TotalDestroy":"Bldg. demolished",
		"TotalRob":"Total loot",
		"HighestRob":"Best loot",
	//	"":"",
		"BattleFailed":"Failure",
		"BattleWin":"Success",
		"ConfirmGemBuy":"Confirm to purchase",
		"ConfirmBuyItem":function(gem,resType,resNum,resName)
		{
			var resName;
			if("Gold"==resType){
				resName=this["ResGold"];
			}else if("Oil"==resType || "Exriler"==resType){
				resName=this["ResOil"];
			}else if("Shield"==resType){
			//	resName="Force Field";
				resNum="1";
			}else if("cash"==resType){
				resName=this["ResCash"];
			}else if("Cube"==resType){
				resName=this["ResCube"];
			}
			return "Confirm to spend "+gem+" Gem(s) to purchase "+resNum+" "+resName+"?";
		},
		"Setting":"Settings",
		"SetSound":function(on)
		{
			if(on)
				return "Sound: On";
			else
				return "Sound: Off";
		},
		"SetMusic":function(on)
		{
			if(on)
				return "Music: On";
			else
				return "Music: Off";
		},
		"About":"About",
		"Help":"Help",
		"MoreGames":"More Games",
		"QuitGame":"Quit ",
		"AboutDesc":"Developer:  KongZhong Corp.\n\n Contact us at service@kongzhong.com \n\n +86-10-68083018\n\n KongZhong Corp. is the copyright owner of the app Pocket Fort and is responsible for its operation and technology support.",
		"HelpDesc":"If you get stuck, follow the directions in tasks.",
		"BandEmail":"Sign Up",
		"InputEmail":"Input email address",
		"InputEmailError":"Input a valid email",
		"InputPwd":"Input password",
		"InputPwdError":"Password is too short, at least 5 characters in length.",
		"BindEmailSuccess":"Verification has been emailed. Please check your email inbox and verify your account.",
		"YourEmail":"You have assigned:",
		"ServiceEmail":"Contact us",
		"OfficialWebsite":"Go to Forum",
		"UserId":"User ID",
		"UserName":"Nickname",
		"ServerName":"Server",
		"ConfirmVisit":"Visit a Fort",
		"ConfirmVisitDesc":function(name)
		{
			return "Confirm to visit "+name+"'s fort?";
		},
		"AccountManage":"Manage Account",
		"IllegalInput":"Invalid chars. ",
		"Copyright":"About",
		"Feedback":"Feedback",
		"CopyrightDesc":"\n Pocket Fort \n\nPocket Fort ©2013 KongZhong Group Companies \n\nA game developed and published by KongZhong Group Companies \n\nAll rights reserved.",
		"BandAccount":"Register",
		"ChangeUser":"Change",
	//	"MailLogin":"Email Address",
		"ResetPssaword":"Reset",
		"Logout":"Log Out",
		"BandDesc":"Notice: \r\n1. Players need to enter an email and a password to create an account. \r\n2. Make sure that your email address is valid. (We will email you the verification.) \r\n3. Players can login to their account on different devices via username (email) and password.",
		"BandedDesc":"\r\n\r\nUser ID: <id>\r\n\r\nEmail: <email>",
		"InputPwdTip":"Input password: (6-12 chars. in length)",//(6-12 chars. in length)
		"RepeatPwd":"Confirm password",
		"PwdErrorLen":"Password requires 6-12 chars.",
		"PwdErrorStr":"Password requires alphanumeric chars.",
		"PwdErrorRe":"The passwords do not match. Please try again.",
		"LoginMail":"Account (email address)",
		"LoginPwd":"Password",
		"Login":"Log In",
		"ResetPwdSuccess":"Email is being sent. Check your e-mail inbox.",
		"MailPwdErr":"Incorrect email or password. Please try again.",
		"LoginEh":"Login error. Please try again later.",
		"ResetPwdEh":"Password reset error. Please check your email address and try again.",
		"ResetPwdEh1055":"This email is invalid. Please check and try again.",
		"BandEmaildEh":"Sign up error. Please try again later.",
		"BandEmaildEh1054":"This email is taken. Please try another one.",
		"BandEmaildEh1058":"User info is invalid. Please contact us.",
		"ResetPwdTip":"Please input your account (email address) and system will send you a letter to reset your password.",
		"SwitchServer":"Server",
		"Switch":"Change",
		"SwitchServerTip":"Press switch button to change your server,current game data can't be use in different server.",
		"ServerDown":"under maintenance",
		"CurServer":"current",
		"DonateCnt":"Donate",
		"DailyTasks":"Daily Quest",
		"CurRank":"Current Rank",
		"RankResSingle":"Loot",
		"RankResAverage":"Avg. Loot",
		"GetDiamondMine":"Got Faceting Machine!",
		"GetDiamondGift":"You have completed the 'Gem Tycoon' mission and received a Faceting Machine. Go to HQ to claim the reward.",
		"GetEmailAch":"Received rewards!",
		"GetEmailAchGift":"You have assigned your account to an email address and will get rewards. Click the gift pack button on the right to claim it.",
		"EmailAch":"Assigning Account Pack*1",
		"Bld_X1":function(codeName){
			return window.aisEnv.textLib.bldName[codeName]+"x1";
		},
		"SpecialItem":"Special",
		"SpecialItemDesc":"You can only get this building from special events.",
		"Global":"Global",
		"Local":"Local",
		"ResSingleTip":"The most resources (Gold + Energy) you got in a single loot yesterday. \r\nRank will be reset at 00:00 (UTC+0).",
		"ResAverageTip":"Total looted Gold (yesterday) divided by total loots (times) equals the average Gold loot. Need to loot other players at least 3 times a day.Rank will be reset at 00:00 (UTC+0).",
		"GetInfoEh":"Loading error",
		"Gem":"Gem",
		"PrdctRate24":"Daily Output",//"Output Rate",
		"NeedReinforce":"I need reinforcement troops.",
		"DontWorshipMe":"I am beyond good!",
		"DialyTaskTip":"Complete Daily Quest to get rich resources. \r\nThe reward pack has expiration. Please claim it in HQ in time.",
		"EmailLogin":"Sign in with email",

		"ClanRankNum":"Alliance Rank",
		"VipGold":"VIP limited purchase for half price gold",
		"VipOil":"VIP limited purchase for half price energy",
		"VipCube":"VIP limited purchase for half price power cube",
		"ConfirmVipBuy":"VIP limited purchase for resources",
		"ConfirmVipBuyItem":"VIP limited purchase for resources",
		"VipResFull":"Purchase is not available, please try again tomorrow.",
		"VipResDesc":"VIP Privilege\Purchase once a day",
		"VipOnly":"VIP Only",
		"VipSpecial":"VIP Special",
		"CurVipLv":"Current VIP Lv.",
		"VipExp":"VIP EXP",
		"ToNextLv":"To next Lv.",
		"VipPrivilege":"VIP<level>Privilege",
		"QuickRecharge":"Quick Recharge",
		"SuperVip":"Super VIP",
		"LvRearch":"Level Promoted",
		"None":"None",
		"ViewGift":"Details",
		"GiftInfo":"Info",
		"VipDoubleGift":"Double Gems for VIP Purchase",

		"Part":"Produce",
		"PartStorage":"Storage",
		"PartEnhance":"Enhance",
		"AddOn":"Module",
		"AddOnBuy":"Produce",
		"AddOnJoint":"Join",
		"AddOnStorage":"Storage",
		"AssembleMech":"Assemble",
		"ChipNotEnough":"Not enough Power Cubes",
		"NeedChipNum":"You need <num> Power Cube(s), confirm to purchase with Gems?",
		"Lottery":"Lottery",
		"Again":"Again",
		"NoMatchAddOn":"No Modules available!",
		"PrdSeq":"Production List ",
		"StorageCap":"Storage Capacity: ",
		"StorageRemainCap":"Remaining Capacity:",
		"Name":"Name",
		"Weight":"Weight",
		"WeightCap":"Bearing",
		"EnhanceCost":"Enhance Cost",
		"Tier":"Tier",
		"MakeCost":"Production Cost",
		"MakeTime":"Production Time",
		"Tier1":"Regular",
		"Tier2":"Advance",
		"Tier3":"Super",
		"AddOnName":"Module Name: ",
		"AddOnEffect":"Module Effect:",
		"AddOnLevel":"Module Lv.: ",
		"AddOnDesc":"Details: ",
		"MechPart":"Mech Parts:",
		"SelMechToRemove":"Select Unit to delete",
		"ChooseBody":"Select Attack Unit",
		"ChooseLeg":"Select Mobility Unit",
		"ChooseAddOn":"Add on Module",
		"ChooseAddOn1":"Add on \nModule",
		"Confirm":"Confirm",
		"Remove":"Remove",
		"Delete":"Delete",
		"MajorAddOn":"Main Module",
		"SecondaryAddOn":"Support Module",
		"CrystalAddOn":"Crystal",
		"PartInfo":"Part info",
		"ExNeed":"Extra Cost",
		"TierLevel":"Unit Type",
		"WeightUnit":"Ton",
		"Assemble":"Combine",
		"Demolish":"Separate",
		"NeedBody":"Select an Attack Unit!",
		"NeedLeg":"Select a Mobility Unit!",
		"WeightNotMatch":"Overweight! Attack Unit cannot exceed the bearing force of Mobility Unit!",
		"Unload":"Separate",
		"Level":"Level",
		"ChoosePart":"You can combine or separate different units.",
		"SeqFull":"Production List is full",
		"ConfirmDelPart":"Delete Confirmed",
		"ConfirmDelPartDesc":"Confirm to delete the unit <name>? No resources will be returned.",
		"GetLevel":" Lv.<lv>",
		"JointInfo":"Join modules to create a new one. \nJoining the same Lv. modules to get an upgraded one. A lower support module and a higher main module can result in a new module of the same Lv. as the main module. \nRare Crystals can increase success of joining. \nModules are graded as:  F-< F< E< D< C< B< A< S< SS",
		"TokenName":"Power Cube",
		"TokenName0":"Few Power Cubes",
		"TokenName1":"Stacks of Power Cubes",
		"TokenName2":"Ample Power Cubes",
		"AtkPart":"Attack ",
		"MovePart":"Mobility ",
		"CanNotLottery":"Lottery is not available",
		"CityLvNotMatch":"Please upgrade your HQ",
		"NeedMechFactory":"You need to build an M-Works",
		"EnhanceSuccess":"Unit Upgraded",
		"StorageNotEnough":"Not enough space",
		"SelAddOn":"Select module",
		"Joint":"Join",
		"Reset":"Reset",
		"AddOnLvMax":"Main Module has reached its max level, can no longer join!",
		"Used":"Used",
		"Empty":"Empty",
		"PrtCanNotCancel":"Unit production cannot be canceled",
		"SelPrtToEnhance":"Select unit to be upgraded",
		"MakeAddOnDesc":"Select modules to make and click 'Cost' button to proceed.",
		"JointTitle":"Joining Modules",
		"JointDesc":"Modules are being joined.",
		"JointSuccessTitle":"Successfully joined",
		"JointSuccessDesc":"You got a new module!",
		"JointLostTitle":"Joining failed",
		"JointLostDesc":"Nothing happened to the main module. Use Crystals to improve the chances of success. ",
		"AssembleDesc":"The weight of Attack Unit cannot exceed the bearing force of the Mobility Unit.",
		"MaxRepairTime":"Max Repair Time:",
		"ClanException":"The Alliance information doesn't match! Please contact us! ",
		"CanNotMakeDif":"You cannot make modules with different resource cost at the same time.",
		"MakeAddOnCost":"Cost:",
		"RepairTime":"Repair Time",
		"RemoveInfo":"You can delete the lower level units in the storage to make room for more Elite units.",
		"EnhancePart":"Upgrade Units:",
		"EnhanceInfo":"Upgrade Units to get better effects in the battle.",
		"BodyPart":"ATK Unit:",
		"LegPart":"Mobile Unit:",
		"Wait":"Please wait",
		"JointFailed":"",
		"ConnectTimeout":"Time out",
		"ConnectTimeoutDesc":"Sorry, connection to server is timed out. Please try again.",
		"WayToGetToken":"Power Cube can be received in PVP battles.",
		"UniquePart":"You already have one.",
		"Owned":"N/A",
		"AllBuild":"All Units",
		"AllAddOn":"All Modules",
		"OwnedAddOn":"Owned Modules",
		"AskGemBuyBox":"Redraw",
		"AskGemBuyBoxDesc":"You will give up present loots, confirm to continue?",
		"LotteryErr":"Lottery Error",
		"LotteryErr1":"No loots to gain.",
		"HowToLottery":"You can get the chance to draw loots by increasing your medals and building an M-Works.",
		"LootNeedMedal":"HQ Lv.<level> with <medal> medals can draw loots.",
		"LootNeedMechFactory":"After building M-Works, you can draw loots in lottery.",
		"LootNeedWin":"You can draw loots after a winning battle. Come on!",
		"MFConstructing":"You cannot produce units when upgrading is ongoing.",
		"CanNotSearch":"Commander, you are still a green hand. Please build our fort first.",
		"HaveRest":"Take a break",
		"GoOnPlay":"Continue game",
		"SuperSupply":"Space-Time Supply",
		"SuperSupplyDesc":"Space-Time Supply will provide huge gold and energy supply. Check your storage capacity frequently to avoid losses. Although it cost gems, you may possibly receive rare supplies.",
		"SelBox":"Select your Space-Time Supply. Go to 'i' to see details. ",
		"SuperSupply1":"Standard",
		"SuperSupply2":"Elite",
		"SuperSupply3":"Superior",
		"SupplyCost":"Cost:",
		"WillOpen":"Coming soon",
		"WillOpenDesc":"Coming soon, please wait.",
		"TodayFreeTimes":"Daily Free:",
		"RareSupply":"Rare Supply",
		"GetTimes":function(times){
			return times+"Time(s)";
		},
		"ResGold":"Gold",
		"ResOil":"Energy",
		"ResGem":"Gem",
		"ResCash":"Power Cube",
		"ResCube":"Power Cube",
		"WaitingRadonm":"Supply is on the way, please wait...",
		"GetItem":"Received:",
		"ForFree":"Free chance",
		"OpenBoxOK":"The supply has been sent to your fort.",
		"OpenBoxErr":"Oops, some problem with Space-Time Supply. Please try again later. lt will cost nothing.",
		"OpenBoxErrDesc":"Oops, some problem with Space-Time Supply. Please try again later. It will cost nothing.",
		"OpenBoxTimeout":"Connection has timed out.",
		"OpenBoxTimeoutDesc":"Sorry, connection to S.T.Supply has timed out. Please try again later. lt will cost nothing.",
		"BoxGetPart":"You got a mech part gift pack. You will receive it later.",
		"OpenBox":function(name)
		{
			return "Use "+name;
		},
		"OpenBoxDesc":function(name,free,cost)
		{
			var txt="Use "+name+".";
			if(free>0)
				txt+="Free chance left: "+free;
			else
				txt+="It will cost: "+cost+this["ResGem"]+".";
			return txt;
		},
		"ConfirmRepair":"Confirm to repair the M-Unit?",
		"ConfirmRepairDesc":function(num)
		{
			return "Confirm to spend "+num+" Gems to repair the mech?";
		},
		"GetMonthCardTime":function(cdTime)
		{
			return "Remaining days: "+this.getTimeText(cdTime);
		},
		"MonthReward":"30-day gem supply",
		"BuyMonthCard":"Purchase Gem Service",
		"BuyMonthCardDesc":"A Gem Service will get you 60 Gems for each day you login during a 30-day period, starting the same day you purchase the card. The Gems will be sent as a daily gift.",
		"BeginOpenBox":"Click green button for S.T.Supply.",
		"NeedMacFactory":"Sorry, but you need to build an M-Works first.",
		"Mac":"Mech Unit",
		"Reward":"Rewards",
		"TotalPoints":"Total Points",
		"RankMacPve":"The Last Stand",
		"UnitDrop":"Normal Drop",
		"ClearReward":"Pass Reward",
		"DayRemainTimes":"Daily Chance Left: ",
		"Difficulty":"Difficulty",
		"EnterReqire":"Requires:",
		"TotalScore1":"Total Points",
		"TotalKill1":"Total Kill",
		"KillScore":"Kill Score",
		"HPScore":"HP Score",
		"TimeScore":"Time Score",
		"GetRes":"Resource Gain",
		"MacDefenseDesc":"asdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfxxxxx",
		"NeedBldLv":function(codeName,level)
		{
			return window.aisEnv.textLib.bldName[codeName]+level+"Level";
		},
		"NeedBldNum":function(codeName,num)
		{
			return window.aisEnv.textLib.bldName[codeName]+num+"Number";
		},
		"NeedMechUpLevel":"Enhance Attack Unit by <level> level",
		"NeedMechDownLevel":"Enhance Mobility Unit by <level> level",
		"EnterReqNotMeet":"Requirements not met",
		"NoRankData":"No ranking data",
		"LogFoe":"Rival",
		"SetFoe":"Set as rival",
		"SetFoeTitle":"Set rival",
		"FoeTitle":"Our undercovers have successfully infiltrated the rival's fort, Sir. We can defeat them later. Though it may cost gems, the result is worth it!",
		"SelFoeBeat":"select rival to declare war",
		"SelFoeChange":"select replacement rival",
		"RemainBattleCD":"next war",
		"CDReady":"undercovers ready",
		"NeedSetFoe":"Please add a rival.",
		"NeedUnlockFoe":"Site locked.",
		"BattleCDOK":"undercovers ready",
		"FireFoe":"declare war",
		"Replace":"replace",
		"ForceRevenge":"Stormed Revenge",
		"ForceRevengeDesc":"Start Raged Revenge? Your rival is protected by a Force Field.",
		"OneClickRepair":"Recover troops",
		"ConfirmSetFoe":"Set rival",
		"ConfirmSetFoeDesc":"Confirm to set <name> as your rival?",
		"ConfirmReplaceFoe":"Replace rival",
		"ConfirmReplaceFoeDesc":"Confirm to replace <name1> with <name2>?",
		"ConfirmUnlock":"Unlock site",
		"ConfirmUnlockDesc":"Confirm to unlock this site?",
		"ConfirmForce":"Raged Revenge",
		"ConfirmForceDesc":"Confirm to start Raged Revenge on <name>?",
		"OLCkeck":"Verification",
		"OLCkeckDesc":"Please input the correct code in time. You'll be forced to logoff after 5 wrong codes or when time runs out.",
		"OLCkeckErr":"Wrong code! You have <num> chance(s) left.",
		"Refresh":"Refresh",
		"LackGem":"You need <num> more Gem(s).",
		"GoldCardAddition":"Gold Card",
		"CubeCardAddition":"Extra Power Cube",
		"SAttacker":"ATK",
		"SDefender":"DEF",
		"STotal":"Total",
		"SelCard":"Test your luck! Pick a card. Spend <num> Gems to have resources multiplied!",
		"InputPhoneNum":"Please input your phone number",
		"PhoneNumErr":"Wrong phone number",
		"BuyGoldCard":"Monthly Service",
		"GoldCardDesc":"Players can get 36 Gems every day as daily login gift within the calendar month they purchase Monthly Service. \r\n Players should ensure a correct phone number input to purchase Monthly Service from KongZhong and to receive 8-15 text messages about Pocket Fort monthly. 15 RMB / month, charged by mobile operators.",
		"GoldCardEh":"Sorry, this service is not available in your region now.",
		"URTuHao":"You can't place a duplicate order.",
		"GoldCardOnBuy":"Purchasing Monthly Service.  This is a monthly payment. Please make sure your phone is charged to receive SMS about Pocket Fort. Service will be stopped immediately as we receive a text message for canceling the service or cannot  get the payment. 15 RMB / month without communication cost.",
		"WillBeKick":"You will be forced to logoff after 5 wrong input.",
		"WillBeKick1":"Input timeout. Game will close.",
		"BuyThCard":"Purchase Gold Card ",
		"BuyThCardDesc":"Gold Card Privilege: \r\n Get 15%-100% extra resources randomly after attacking other players. \r\n Recover 15%-100% resources randomly after being attacked. \r\n Enjoy the privilege for 3 hours with one purchase. \r\n A repeated purchase can add to the time period.",
		"BuyCubeCard":"Purchase Power Privilege",
		"BuyCubeCardDesc":"Power Privilege: \r\n May get 15% t0 100% bonus Power Cubes when looting others. \r\n May reduce 15% to 100% Power Cube loss when being attacked. \r\n Each purchase can enjoy the privilege for 3 hours. Repeated purchases will prolong the privilege hours!",
		"GetCardTime":function(cdTime)
		{
			return "Time Left: "+this.getTimeText(cdTime);
		},
		"ChipReq":"Players with <num> medals can get Power Cube in a winning battle",
		"ShareBattle":"Share Battle Report",
		"ViewReplay":"Replay",
		"ShowpTh":"Gold Card",
		"ShowpThDesc":"Spend only 50 Gems to enjoy privileges in PVP battles! \r\n\r\n Get 15%-100% extra resources randomly after attacking other players!\r\n Recover 15%-100% resources randomly after being attacked!\r\n\r\n Enjoy the privilege for 3 hours with one purchase. A repeated purchase can add to the time period! ",
		"ShowpCubeCard":"Power Privilege",
		"ShowpCubeCardDesc":"Spend 50 Gems and enjoy privilege about Power Cubes! \r\n\r\n May get 15% t0 100% bonus Power Cubes in PVP battles! \r\n May reduce 15% to 100% Power Cube loss when being attacked! \r\n\r\n   Each purchase can enjoy the privilege for 3 hours. Repeated purchases will prolong the privilege hours!",
		"TroopStation":"Troop Station",
		"TroopCapNum":"Troop Number",
		"NoRemain":"N/A",
		"NotEnoughSpace":"No room available",
		"ClanTroopDesc":"Press and hold to add troops with Gems deducted. ",
		"FortTroopDesc":"Press and hold to add troops.",
		"MayGain":"May gain",
		"SurpriseObs":"Treasure Tree",
		"GainSurprise":"You've gained!",
		"GainSurpriseDesc":"You found a treasure in the tree! Congratulations!",
		"ClickToAddTroop":"Press to add troops.",
		"ClickToAddTroopByGem":"Press to add troops with Gems deduction.",
		"WantAgain":"A little disappointed? How about try again?",
		"SameClanNoReward":"You can't use this to hit your alliance member!",
		"MonthCardNotAvailable":"Sorry，Gem Card is sold out.",
		"CurScore":"Current Score",
	//	"CurRank":"Stage ranking",
		"ContinueWin":"Winning streak",
		"ReadyMagic":"Stored satellites",
		"MakePower":"Produce powerful satellites for support in battles.",

		"GiveGem":"Allot Gems",
		"GiveLeader":"Pass on power",
		"SubLeader":"VP",
		"GiveOfficer":"Name Captain",
		"NormalMember":"Regular",
		"NewMember":"Probation ",
		"MedalNeed":"Requires",
		"DonateClan":"Donate",
		"SignClan":"Sign in",
		"GemStorage":"Gems",
		"ClanTech":"Tech",
		"AllotGem":"Allot Gems",
		"MakeLeader":"Pass Power",
		"MakeSubLeader":"VP",
		"MakeOffical":"Officer",
		"MakeMember":"Regular ",
		"GemRemain":"Stock: <num> Gems",
		"AllotGemDesc":"You're allocating Alliance Gems to 【<name>】. \n Please input the amount and confirm.",
		"AllotGemTip":"Note: Check alloting history in Stock for detail.",
		"AllotGemTitle":"Allocate Gems",
		"InputErrorIllegal":"Improper number",
		"GemStorageTitle":"Gem storage",
		"ClanGemGetTip":"Rules: Many gems can be obtained through winning World Domination.",
		"AllotRecord":"Alloting history",
		"Time":"Time",
		"AllotGemDetail":"Alliance leader give <position>【<name>】<num> Gems",
		"GetGemDetail":"Occupied <area> and obtained <num> Gems",
		"Kick":"Kick out",
		"Manage":"Tend",
		"InputAllotGemNum":"Please input the number of Gems to allocate",
		"ClanDonate":"Donations",
		"DonateDesc":"Alliance pts come from donations. Use them to upgrade Alliance Lvls & Tech",
		"DonateResLack":"You do not have enough energy to donate.",
		"DonateResNum":"500000 Gold+500000 Energy",
		"DonateClanPoint":"Alliance points + <num>",
		"DonateClanGem":"With",
		"DonateClanDesc":"Note: You have 1 free chance to donate per day",
		"UpgrageClanToLv":"Lv. <lv> Alliance",
		"ClanMemberNum":"Alliance population",
		"UnlockTeck":"Unlock tech",
		"ValidTime":"Valid time",
		"Unlocked":"Locked",
		"InCall":"Calling",
		"InUse":"Working",
		"CallTech":"Call for",
		"TechDesc":"Higher Alliance Levels can unlock Techs. Only Alliance leader or VP can unlock Tech. Two ways to unlock tech: \n 1. Open it directly with Gems. 2. Call on alliance members for supporting Gems to open it.",
		"ReqClanTech":"Call for Alliance Tech \"<tech>\"",
		"ClanSigned":"Signed",
		"InputGemNum":"Please input a proper Gem amount",
		"NoClanDonateTimes":"No free chance to donate today. Donate with gems or retry tomorrow.",
		"ClanDonateSuccess":"Sacrificed. Alliance points increased by <num>",
		"ClanPointNotEnough":"Insufficient points, encourage your alliance members to donate for more! ",
		"ClanUpgradeOK":"Alliance Lv.<level>! Congratulations!",
		"DonateClanByRes":"Donate Energy to Alliance.",
		"DonateClanByGem":"Made contributions to Alliance! Donated Energy with <gem> Gems!",
		"ClanPoint":"Alliance Points",
		"ClanLevelUp":"Alliance level up to <level>.",
		"ClanAllotGemTo":"Allocate <gem> Gems to <name>.",
		"AgreeJoinClan":"<name1> accepted <name2> as alliance member.",
		"RefuseJoinClan":"<name1> denied <name2> as alliance member.",
		"ClanJoinReqSend":"Application sent, please wait for approval. Apply to join others meanwhile.",
		"BuyResCard1":"Buy Fortune Card I",
		"BuyResCardDesc1":"Each purchase of Fortune Card I will get a 7-day resource reward.\r\n A Resource Pack (Gold and Energy, 2 million of each) will be sent upon first login each day.\r\n consecutive login of 7 days will get 14 million resource!\r\n The remaining reward days will be counted at 00:00 each day.\r\n Purchase Fortune Card I will not get the extra Gems for first buy.",
		"BuyResCard2":"Buy Fortune Card II",
		"BuyResCardDesc2":"Each purchase of Fortune Card I will get a 7-day resource reward.\r\n A Resource Pack (Gold and Energy, 300 thousand of each) will be sent upon first login each day.\r\n consecutive login of 7 days will get 2.1 million resource!\r\n The remaining reward days will be counted at 00:00 each day.\r\n Purchase Fortune Card I will not get the extra Gems for first buy.",
		"BuyResCard3":"Buy Power Cube Card",
		"BuyResCardDesc3":"Each purchase of Power Card will gain a 7-day Power Cube refund. \r\n 5000 Power Cubes will be rewarded upon first login every day. \r\n 7 consecutive days of login will gain 35000 Power Cubes!\r\n The remaining refund days will be counted at 00:00 each day. \r\n Purchase Power Card will not get the extra gems for first buy.",
		"WeekResCardReward":"Resource Pack",
		"ResCardInCD":"You can only hold one Fortune Card during its reward period.",
		"ResCardInProcess":"Dealing with your request, please wait.",
		"YesterdayInfo":"Yesterday",
		"TodayInfo":"Today",
		"TechInCall":"The tech has been called for, please respond to it in Alliance Tech.",
		"TechInUse":"The tech is working.",
		"ClanDeclareWar":"Our Alliance has declared war on  \"<area>\" region.  Let's take it together!",
		"ClanCallTech":"Call for opening \"<tech>\". Wish to hear an active response!",
		"ClanTechResponse":"Responded to the call for \"<tech>\".",
		"ClanTechGemDone":"Opened \"<tech>\" with Gems cost.",
		"ClanTechExpired":"",
		"LandWar":"World Domination",
		"OnlyLeaderCanUse":"Only your Alliance leader or VP can use this.",
		"ClanDeclared":"An alliance can only declare war on one land per day.",
		"UserJoinedClan":"The player had joined other alliances.",
		"UHaveNoJurisdiction":"Sorry, you need authorization to do this.",
		"TechGem":"Tech cost",
		"ContributionGem":"Don. fee",
		"TechTimes":"Tech work",
		"ContributionTimes":"Donates",
		"DeclareLand":"Alliance has declared war on <area>.",
		"LandWarTarget":"Land war target",
		"LandWarSelfScore":"Personal score",
		"ClanJoinRefuse":"Application has been declined.",
		"CurDeclareLand":"Warring land",
		"CurLandScore":"Alliance score",
		"AllotGemSuccess":"Gems have been allocated.",
		"YesterdayAtkRpt":"Attack History Yesterday",
		"YesterdayDefRpt":"Defense History Yesterday",
		"AtkWinDesc":"Well done! We have occupied this strategic land! Let's await another success tomorrow!",
		"AtkLoseDesc":"Oops, we met a tricky enemy. Let's work harder to win the land next time!",
		"DefWinDesc":"Nice defense! No one can capture the land of our alliance!",
		"DefLoseDesc":"Our land had been occupied by enemy. Call alliance members to get it back!",
		"SignOk":"Signed in. Alliance Point+1. Thank you for your support to Alliance.",
		"CallTechOk":"You've successfully called for \"<tech>\"",
		"ResponseTechOk":"You've responded to the call for \"<tech>\" .",
		"GemDoneTechOk":"You've opened \"<tech>\" successfully.",
		"ClanGemRemain":"Storage remaining:",
		"TryJoinClan":"Want to join an Alliance.",
		"ClanJoinClosed":"The alliance declines all applications to join it.",
		"ClanMembersMax":"Alliance is full.",
		"SubLeaderMax":"VP number has reached its max.",
		"YouHaveClan":"You've already joined an Alliance.",
		"LandWarHelp":"Land War Info",
		"LandWarDesc":"When Land War begins, each alliance can pick one land as a target. Alliance members can get personal score after winning battles in PVP mode.\r\n\r\n Alliance with the higher score after attacking an area at the end of Land War is the owner of it. \r\n\r\n Land War ends before 22:00 every day and system will send gift Gems to the winner after the war. Alliance need to set another target to attack after the war.\r\n\r\n The occupied land will not produce Gems after Land War.",
		"LandWarTip":"World Domination ends before 22:00 every day!",
		"LandWarEnd":"World Domination ended.",
		"LandWarRewardDesc":"Won in attacking \"<area>\", get <num> Gems.",
		"SupportCnt":"Reinforce",
		"BuyGiftCard":"Buy M-Unit Bag",
		"BuyGiftCardDesc":"M-Unit Bag containing:\r\n Gold Spirit Lv.20\r\n Gold Skywalker Lv.20\r\n Module Tyrant A\r\n 1,000,000 Gold",
		"GiftCardTitle":"M-Unit Bag",
		"Once4NewYear":"You can purchase only once during Spring Festival.",
		"TroopsRepaired":"Your troops have recovered. ",
		"ItemOnlyBuyOnce":"You cannot buy it twice.",
		"TrainOil":"Ordinary",
		"TrainCube":"Elite",
		"ResearchOil":"Ordinary",
		"ResearchCube":"Elite",
		"":"",
		"":"",
		"":"",
		"":"",
		"":"",

		"hjys":"TinyFort",
		"ClanYesterdayInfo":"World Domination info yesterday",
		"YesterdayFight":"War target yesterday",
		"YesterdayFightScore":"War score yesterday",
		"TargetVesting":"Target ownership",
		"TargetVestingScore":"Owner's score",

		"HP":"HP",
		"Cap":"Capacity",
		"CapStorage":"Storage",
		"CapTroop":"Troop",
		"CapTotalTroop":"Total troop",
		"CapClan":"Alliance troop",
		"CapSpell":"Satellite",
		"PrdctRate":"Yield per hour",//"产出率",
		"PerHour":"/h",
		"DmgPerSec":"Damage Per Sec",
		"HealPerSec":"Heal per sec.",
		"DmgRange":"Attack Range",
		"Tiles":"Distance",
		"DmgFavor":"Favorite Target",
		"DmgType":"DMG Type",//单体、群伤
		"DmgTarget":"Target",//对地、对空
		"HousingSpace":"Housing Space",
		"TrainingTime":"Training Time",
		"TrainingCost":"Training Cost",
		"MaxRecruitNum":"Max Recruit Number",
		"MovementSpeed":"Move Speed",
		"TimeToCreate":"Create Time",
		"Heal":"Heal",
		"HealType":"Heal Type",
		"TotalDmg":"Total Damage",
		"TotalHeal":"Total Heal",
		"Cost":"Consumption",
		"AddHP":"HP increased",
		"AddSpd":"Speed increased",
		"AddAtk":"Attack increased",
		"HealType":"Heal Type",
		"EffectType":"Effect Type",

		"RemainTime":"Time Left:",
		"FinishNow":"Complete Now:",
		"ConfirmGemFinish":"Confirm to spend <gem> Gem(s) to complete the upgrade?",
		"ConfirmSell":"Confirm to sell?",
		"ConfirmSellDesc":"Confirm to sell the item for <num> <res>?",
		"RemainTroopCap":function(cur,max,bld)
		{
			var codeName="Camp";
			if(bld)
				codeName=bld.def.codeName;
			return "After training "+window.aisEnv.textLib.bldName[codeName]+" Capacity left: "+cur+"/"+max;
		},

		"Battle":"Attack",
		"Match":"Match",
		"PveBtn":"Anti-piracy",
		"OltBtn":"Fort Defense",
		"OltLevel":"Stage <cur>/<max>",
		"RemainRes":"Resource Left",
		"Dungeon":"Stage",
		"Challenge":"Challenge",
		"YouGain":"You Received:",
		"ArmyConsume":"Army Consumed:",
		"Facebook":"Victory in Pocket Fort! I looted <gold_num> gold and <energy_num> energy in battle. Match that!",
		"Twitter":"Victory in Pocket Fort! I looted <gold_num> gold and <energy_num> energy in battle. Match that!",

		"BattleTips":"Deploy your troops in any empty space. \nDeploy any troops to confirm attack.",
		"NotPut":"Cannot deploy troops here!",
		"NotPutByMedal":"You don't have enough medals!",
		"DontHaveSoldiers":"Select a different troop.",
		"MayGainItems":"May gain tokens",
		"Next":"Next",
		"Defeat":"Win/Defeat",
		"EndBattle":"End Battle",
		"BattleStartIn":"Battle starts in:",
		"BattleEndIn":"Battle ends in:",
		"ReplayEndIn":"Replay ends in:",
		"NotEnoughGold":"Not enough Gold!",
		"NotEnoughStorage":"Your storage is full!",
		"NotUser":"Cannot find the player!",
		"UserOnline":"Cannot attack the target! The player is online.",
		"UserProtected":"Cannot attack the target! The player is under protection.",
		"UserAttack":"Cannot attack the target! The player is under attack.",
		"UserClan":"Cannot attack the target! The player is your ally.",
		"ConfirmEndBattle":"Confirm to end this battle?",
		"sureEndBattle":"Do you confirm to end this battle?",
		"UserAttack":"This player is being attacked now!！",
		"UserClan":"You can't attack your alliance members!",
		"ConfirmEndBattle":"End battle?",
		"sureEndBattle":"Are you sure to end the battle?",
		"ConfirmEndOnslaught":"Return to Fort",
		"sureEndOnslaught":"If you give up, it shall be counted as a defeat. Confirm return?",
		"OnslaughtWin":"Defender Won",
		"sureOnslaughtNext":"Good job, you have fended off the enemies. Confirm to start the next challenge?",
		"OnslaughtFail":"Defender Lost",
		"sureOnslaught":"Oh no, we were defeated. You may want to check your fort defense and try again!",
		"NotEnougGem":"Not enough Gems",
		"NeedGemNum":function(num)
		{
			return "You need "+num+" Gem(s) for this operation, go to shop and purchase more?";
		},
		"NotEnougRes":"Not enough resource",
		"NeedResNum":function(resType,resName,num)
		{
			return "You are missing "+num+" "+resName+", confirm to purchase more with Gems?";
		},
		"NumberLimited":"Cannot build more buildings!",
	//	"Replay":"重放中",
		"X1":"1X",
		"X2":"2X",
		"X3":"3X",
		"X4":"4X",
		"BackHome":"Return",
		"Day":"d",
		"Hour":"h",
		"Minute":"m",
		"Second":"s",
		"NotUnit":"No troop is available!",
		"InputName":"Input player's name:",
		"SameName":"The player already exists!",
		"NotExistName":"Cannot find the player!",
		"IllName":"Nickname is invalid!",
		"SignFailed":"Verification failed!",
		"NullName":"User name is required!",
		"NoShield":"None",
		"Notice":"Notice",
		"Dailysign":"Daily Consecutive Login",
		"Gift":"Gift Pack",
		"Worker":"Worker",

		"PushMsgTrainFull":"All Parade Grounds are full. We are ready for battle!",
		"PushMsgBuild":"Your new building is finished!",
		"PushMsgTrainFinish":"Troop training is finished. Let's fight!",
		"PushMsgTech":"Your research is finished. ",
		"PushMsgOneDay":"Sir, you have been missing for a day. Your fort needs to prepare for battle.",
		"PushMsgThreeDay":"Sir, your army needs a leader! We are looking forward to your return.",
		"PushMsgShield":"Force Field will stop working! Your fort will be in danger.",
		"PushMsgDiamond":"Sir, we have cut a Gem. Please collect it.",

		"ClanCreate":"Create",
		"ClanRecommend":"Suggest",
		"ClanSearch":"Search",
		"ClanSelf":"My Alliance",
		"ClanRank":"Alliance",
		"ClanName":"Name",
		"ClanBadge":"Emblem",
		"ClanDeclare":"Statement",
		"ClanContribution":"Contribution",
		//********今日战报界面****
		"ClanTodayInfo":"Alliance Report Today",
		"TargetDomain":"Target Today",
		"TargatMinScore":"Target lowest score",
		"OwnerDomains":"Occupied land of the Alliance",
		"CurMaxScore":"Current highest score",
		"ClanCurScore":"Total Alliance score",
		"SelfScore":"Personal day score ",
		"ClanMembersScoreRank":"Member Score Ranking ",
		//*******可掠夺区域信息界面****
		"AreaInfo":"Optional Area info",
		"OccupyClan":"Owner Alliance",
		"OccupyClanLeader":"Leader of the Owner Alliance",
		"OccupyScore":"Owner's score",
		"DiamondOutput":" Output",
		"AreaAttacker":"Alliances that are attacking the area (<num> in total)",
		"NoClans":"No Alliance is attacking this area.",

		"DailySignTip1":"Remember to sign in here everyday!",
		"DailySignTip2":"Sign in everyday to get gifts accordingly!",
		"DailySignTip3":"Sign in consecutively or it will restart to count from Day 1. ",
		"DailySignInfo":"Gift detail",
		"SignDays":"Consecutive days:Day ",
		"DailySignDay":"Day ",
		"DailySignSuccess":"Signed in. Reward will be sent in Giftpack.",
		"DailySignFailed":"Sign in failed.",
		"JoinMode":"Join Alliance",
		"ScoreRequire":"Medals Required",
		"ClanModify":"Edit",
		"ClanScore":"Total Medals",
		"ClanMembers":"Members",
		"JoinRequire":"Join Requires",
		"Join":"Join",
		"Leave":"Quit",
		"Edit":"Edit",
		"EditSuccess":"Alliance info has been changed.",
		"EditFailed":"Cannot change alliance info.",
		"Submit":"Submit",
		"Search":"Search",
		"SearchTip":"Input the first letter of the alliance name",
		"SearchError":function(name)
		{
			return "Cannot find Alliance "+name+".";
		},
		"InputClanName":"Input alliance name",
		"InputClanDeclare":"Input statement",
		"InputSearchName":"Input the alliance name you seek",
		"InputChatMsg":"Input content",
		"ClanInfoError":"Alliance info is invalid.",
		"ClanType0":"Anyone",
		"ClanType1":"Invite only",
		"ClanType2":"Closed",
		"ClanType3":"Apply to join",
		"ClanLeave":"has left the alliance",
		"ClanJoin":"joined the alliance",
		"ClanCreated":"created the alliance",
		"ClanKicked":"was kicked out of the alliance",
		"ClanPromoted":"was promoted",
		"ClanReqTroops":"Need reinforcements",
		"ShareVideo":"Share Video",
		"ShareOk":"Shared",
		"LevelMsgOk":"Message left",
		"Share":"Share",
		"EnterToInputForLoser":"Words to say",
		"SeniorCorps":"Senior army",
		"LevelMsg1Star":"Wow, you are beyond good!",
		"LevelMsg2Star":"Still a long way to go, buddy.",
		"LevelMsg3Star":"Try harder!",
		"ClanReqJoin":"applied to join",
		"ClanPosition0":"Member",
		"ClanPosition1":"Leader",
		"ClanPosition2":"Captain",
		"ClanPosition3":"VP",
		"ClanPosition4":"Probation member",
		"Donate":"Donate",
		"ClanKick":"Expel",
		"ClanPromote":"Assign",
		"ClanNotLogin":"You are not the member of the alliance now.",
		"ClanNotJoin":"You don't have an alliance.",
		"ClanMsg":"News",
		"ClanSameName":"Alliance name has been used.",
		"SltBadge":"Select an emblem",
		"UBePromote":"You are promoted.",
		"UBeKick":"You have been kicked out of the alliance.",
		"UJoinClan":"You are a member of the alliance.",
		"UCreateClan":"Alliance has been created.",
		"JoinClanError":"Cannot join the alliance.",
		"NotMeetMedal":"Not enough Medals",
		"ClanNotOpen":"The alliance is not available for new members now.",
		"ClanIsFull":"The alliance is full.",
		"ULeaveClan":"You quit from the alliance.",
		/*************facebook***************/
		"FirendNum Text":function(num){return "已选择 "+num+" 好友";},
		"SelectAll":"Select all",
		"Selected":"已选",
		"UnSelected":"未选",
		"Invite":"Invite",
		"FaceBookLoading":"You are popular on Facebook! \r\nPlease be patient while we load all your friends...",
		"ViewPersonClan":"访问联盟",
		"ViewPersonHome":"访问要塞",		
		"InviteInfo":"Invite your friends with Gem icons after their names to get Gems reward. 2 Gems for inviting a friend and you can get up to 600 Gems!",
		"InviteMax":function(num){return "Cumulative rewards from friend invitations: "+num+" gem(s)"},
		"InviteMaxGem":function(num){return "Reward "+num+" gem(s) for this time."},
		"loginerror":"Login failed",
		"loginerrorInfo":"Link to Facebook failed. You can retry or skip for now.",
		"loginDone":"Login succeeded",
		"loginDoneInfo":"Connected to Facebook! You can see your friends' names in the game now.",
		"loginAgain":"Retry",
		"loginSkip":"Skip",
		"NoFriend":"No friends now? That's OK. You can try later after making some.",
		"longined":"Connected",
		"unlogined":"Not Connect",
		"PlayingList":"Who is playing",
		"InviteList":"Invite others",
		"facebookTitle":"Play with your friends",
		"LoginFacebook":"Connect with Facebook",
		"FacebookCloseInfo":"Invitation is sending, please wait. \r\nPage will be refreshed automatically once \r\ninvitation succeeds. \r\nYour gems will be sent as a gift pack shortly.",
		"invited":"邀请成功",
		"invitedInfo":"Your invitations has been sent to your friends!",
		"noUserName":"The facebookname is not available",
		"InviteListSkip":"Skip this step?",
		"InviteListSkipInfo":"Confirm to stop inviting friends?",
		"LeaderLeaveClan":function(name)
		{
			return "The leader of the alliance "+name+" has left.";
		},
		"UBeLeader":"You have been promoted to Leader.",
		"NewLeader":function(name)
		{
			return name+" has been promoted to Leader.";
		},
		"RankClan":"Alliance",
		"RankPlayer":"Player",
		"RankSearch":"Search",
		"ViewClan":"Alliance",
		"SearchCost":"Search Cost:",
		"MultMode":"Multiplayer",
		"SingleMode":"Single Player",
		"CurMedal":"Medals:",
		"CurStar":"Stars:",
		"InShield":"You are under protection",
		"InShieldDesc":"You are under protection now. Attacking another player will break the Force Field, confirm to continue?",
		"NoReduce":"No troops lost",
		"NeedMedal":function(num)
		{
			return ">"+num+" Medals";
		},
		"DonateNum":function(cur,max)
		{
			return "Donate: ("+cur+"/"+max+")";
		},

		"ParamError":"Parameter error",
		"AskJoinClan":"Join Alliance",
		"AskJoinClanInfo":function(clanName)
		{
			return "Confirm to join Alliance "+clanName+"？";
		},
		"AskLeaveClan":"Quit",
		"AskLeaveClanInfo":"Confirm to quit?",
		"AskKick":"Kick Out",
		"AskKickInfo":function(userName)
		{
			return "Confirm to kick  "+userName+" out of your alliance?";
		},
		"AskPromote":"Promote",
		"AskPromoteInfo":function(userName)
		{
			return "Confirm to promote  "+userName+" to alliance councilor?";
		},

		"Refuse":"Reject",
		"Agree":"Accept",
		"World":"World",
		"Clan":"Alliance",

		"UBeAttack":"Fort was attacked!",
		"UBeAttackDesc":"Sir, your fort was attacked when you were offline. Check battle report for details.",
		"TotalScore":"Total",

		"LogDefence":"Defend",
		"LogAttack":"Attack",

		"StrDay":"d",
		"StrHour":"h",
		"StrMin":"m",
		"StrSec":"s",
		//代币相关
		"ItemStorage":"Inventory",
		"ItemName":"Name",
		"ItemDesc":"Feature",
		"AllItems":"All",
		"UseItem":"Use",
		"ConditionNotEnough":"Requirements not met",
		"TimesOver":"Frequency is limited",
/********特别补给相关**********/
		"FirstCharge":"Double Gems for 1st Buy",
		"FirstChargeReward":function(name,num)
		{
			return "Double Gems for 1st buy. You have selected 【"+name+"】 and will receive a total of 【"+(num*2)+"】 Gems. \r\n\r\nThe more Gems you purchase, the more gifts!";
		},
		"DoubleVip":"VIP Benefits Updated!",
		"DoubleVipReward":function(name,num)
		{
			return "Your purchase of pack 【"+name+"】will be rewarded 【"+(num*2)+"】Gems. \r\n\r\n More reward for higher VIP!";
		},
		"PayDCSY":"手机网银",
		"PayDCSZX":"话费卡",
		"PayDCZFB":"PayPal",
		"PayMO9":"MO9",
		"PayCMGC":"Buy",
		"PaySMS":"短信支付",
		"buyItem":"Buy",
		"buyTip":"Confirm to purchase? The server will process your transaction and credit you shortly. Thank you for your patience.",//您是否要购买 <number> 的钻石？
		"buyokTip":"Gems purchased successfully! You will receive <number> Gem(s).",
		"buyResTip":"Confirm to purchase <number> <res> with Gems?？",
		"FillGold10":"Increase Gold Vault by 10%",//Fill Gold Vault by 10%
		"FillGold50":"Increase Gold Vault by 50%",//Fill Gold Vault by Half
		"FillGold100":"Fill Gold Vault",//Fill Gold Vault
		"FillOil10":"Increase Energy Storage by 10%",//Fill Oil Storages by 10%
		"FillOil50":"Increase Energy Storage by 50%",//Fill Oil Storages by Half
		"FillOil100":"Fill Energy Storage",//Fill Oil Storages
		"FillCube10":"Increase Cube Storage by 10%",//Fill Oil Storages by 10%
		"FillCube50":"Increase Cube Storage by 50%",//Fill Oil Storages by Half
		"FillCube100":"Fill Cube Storage",//Fill Oil Storages
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
				return "Fill "+window.aisEnv.textLib.bldName[codeName]+" by "+rate+"% ";
			else if(100==rate)
				return "Fill "+window.aisEnv.textLib.bldName[codeName];
		},
/****************************/
		getGemTip:"You got <number> Gem(s)!",
		DeadRate40:"This player has activated 8 hours Force Field.",
		DeadRate90:"This player has activated 12 hours Force Field.",
		DeadRate100:"This player has activated 16 hours Force Field.",

		VipUpgradeNeedReload:"VIP<lv>! Congratulations! Relogin now to enjoy new VIP privilege!",
		GemBoostNeedReload:"Cut speed promoted! Please relogin to enjoy the effect!",
		MonthCardNeedReload:"Gem Card purchased! VIP Level Up! Please reload your game data.",
		MonthCardBuyOk:"Gem Card purchased!",
		MonthCard15NeedReload:"Gem Service purchased! VIP Level Up! Please reload your game data.",
		THNeedReload:"Gold Card purchased. VIP leveled up! Congratulations! Please reload the game.",
		WeekCardRes12NeedReload:"You have purchased Fortune Card II and get a 7-day reward privilege! VIP levels up! Please reload the game.",
		WeekCardRes68NeedReload:"You have purchased Fortune Card I and get a 7-day reward privilege! VIP levels up! Please reload the game.",
		WeekCardCube68NeedReload:"You've purchased Power Card! VIP level up! Please reload the game data.",
		MonthCard15BuyOk:"Gem Service purchased!",
		THBuyOk:"Gold Card Purchased!",
		WeekCardRes12BuyOk:"You have purchased Fortune Card II and get a 7-day reward privilege! ",
		WeekCardRes68BuyOk:"You have purchased Fortune Card I and get a 7-day reward privilege!",
		WeekCardCube68BuyOk:"You've purchased Power Card! ",
		GiftNeedReload:"You've purchased M-Unit Bag! The bag will be sent later. VIP level up! Please reload the game data.",
		GiftBuyOk:"M-Unit Bag will be sent in giftpack, please check and claim in time.",
		Gift2NeedReload:"You've purchased M-Unit Bag! VIP levels up! Please reload the game and check.",
		Gift2BuyOk:"M-Unit Bag will be sent in gift pack, please note.",
		CubeCardNeedReload:"You've got Power Privilege! VIP level up! Please reload the game data.",
		CubeCardBuyOk:"You've got Power Privilege! ",

		SpecialBuy:"Purchase",
		SureSpecialBuy:"Confirm to purchase?",
		SpecialBuyFail:"Purchase failed!",
		SpecialBuyOk:function(name)
		{
			return name+"Purchased!";
		},
		SpecialGiftBuyOk:function(name)
		{
			return name+"Purchased! Please check and accept the gift pack timely."
		},
		AskGemFinInfo:function(gemNum)
		{
			return "Sir, confirm to complete the construction by using "+gemNum+" Gem(s)?";
		},
		"AskExit":"Confirm to quit?",
		"QuitContent":"More games at\ng.10086.cn",
		AskBoostInfo:function(buffDef)
		{
			if(buffDef.codeName.indexOf("Oil")>-1 || buffDef.codeName.indexOf("Gold")>-1 || buffDef.codeName.indexOf("Cube")>-1)
				return "Confirm to boost resource production "+buffDef.factors[0].mbf+ "times for "+this.getTimeText(buffDef.durTime)+ "by using "+buffDef.cost.gem+" Gems?";
			else if(buffDef.codeName.indexOf("Unit")>-1)
				return "Confirm to boost training speed "+buffDef.factors[0].mbf+" times for "+this.getTimeText(buffDef.durTime)+" by using "+buffDef.cost.gem+ " Gems?";
			else if(buffDef.codeName.indexOf("Spell")>-1)
				return "Confirm to boost production speed "+buffDef.factors[0].mbf+" times for "+this.getTimeText(buffDef.durTime)+" by using "+buffDef.cost.gem+ " Gems?";
			else if(buffDef.codeName.indexOf("Gem")>-1)
				return "Confirm to spend "+buffDef.cost.gem+" Gems to promote cut speed to "+buffDef.factors[0].add+" Gems/Day "+this.getTimeText(buffDef.durTime)+" ？";
		//	return "Sir, we need "+buffDef.cost.gem+" Gems to activate "+this.getTimeText(buffDef.durTime)+"Space Accelerator，please approve.";
		},
		NoResBuildInfo:function(shortVO)
		{
			var text,list,i,n,def;
			if(shortVO)
			{
				text=" (";
				if(shortVO.gem)
				{
					text+="Gems: "+shortVO.gem+"/ ";
				}
				if(shortVO.cash)
				{
					text+="Amount: "+shortVO.cash+"/ ";
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
				return "Sir, you don't have enough resources "+text+" to build constructions.Consider looting more from other forts. "
			}
			return "Sir, you don't have enough resources to build constructions. Consider looting more from other forts.";
		},
		NoResUpgradeInfo:function(shortVO)
		{
			var text,list,i,n,def;
			if(shortVO)
			{
				text=" (";
				if(shortVO.gem)
				{
					text+="Gems: "+shortVO.gem+"/ ";
				}
				if(shortVO.cash)
				{
					text+="Amount: "+shortVO.cash+"/ ";
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
				return "Sir, you don't have enough resources "+text+"to upgrade constructions.Consider looting more from other forts. "
			}
			return "Sir, you don't have enough resources to build constructions. Consider looting more from other forts.";
		},
		barracksDlgTitle:function(bld)
		{
			var cap;
			cap=bld.getValue("mfcCap");
		//	return "Armory ("+bld.slotCap+"/"+cap+")";
			return window.aisEnv.textLib.bldName[bld.def.codeName]+" ("+bld.slotCap+"/"+cap+")";
		},
		partDlgTitle:function(bld)
		{
			return "Mech Parts";
		},
		unitNeedBldLevel:function(level,bld)
		{
			var codeName="Barrack";
			if(bld)
				codeName=bld.def.codeName;
			return "Training requires:\n"+window.aisEnv.textLib.bldName[codeName]+" lv."+level;
		},
		mechNeedBldLevel:function(level,bld)
		{
			var codeName="MechFactory";
			if(bld)
				codeName=bld.def.codeName;
			return "Production Cost: \n"+window.aisEnv.textLib.bldName[codeName]+" lv."+level;
		},
		mdwDlgTitle:function(bld)
		{
			var cap;
			cap=bld.getValue("mfcCap");
		//	return "Nuke center ("+bld.slotCap+"/"+cap+")";
			return window.aisEnv.textLib.bldName[bld.def.codeName]+" ("+(bld.slotCap+bld.tgtStorage.getUsedCap())+"/"+cap+")";
		},
		spellNeedBldLevel:function(level,bld)
		{
			var codeName="SpellLab";
			if(bld)
				codeName=bld.def.codeName;
			return "Training requires:\n"+window.aisEnv.textLib.bldName[codeName]+" lv."+level;
		},
		researchNeedBldLevel:function(level,bld)
		{
			var codeName="TechLab";
			if(bld)
				codeName=bld.def.codeName;
			return "Research requirement: \n"+window.aisEnv.textLib.bldName[codeName]+" lv."+level;
		},
		BldNeedFeature:function(list)
		{
			return "Building requires: "+window.aisEnv.defLib.feature[list[0]].name;
		},
		ReqNotMeet:function(name)
		{
			return "Requirement: "+name;
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
				str=""+d+"d ";
				if(h)str+=(h+"h ")
			//	return ""+d+"天 "+h+"小时 ";
			}
			else if(h)
			{
				str=""+h+"h ";
				if(m)str+=(m+"m ")
			//	return ""+h+"小时 "+m+"分 ";
			}
			else if(m)
			{
				str=""+m+"m ";
				if(s)str+=(s+"s ")
			//	return ""+m+"分 "+s+"秒";
			}
			else
			{
				str=""+s+"s ";
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
			return username+" sent you a reinforcement troop "+unitname+"("+this.getLevel(unitlevel)+")"+"。";
		},
		getLevel:function(level)
		{
			return " Lv."+level;
		},
		getTimeDistance:function(time){
			time=window.aisEnv.dateTime()-time;
			time=time<0?0:time;
			var str=this.getTimeText(time);
			return str+"before";
		},
		getRemainNum:function(num){
			return "left "+num;
		},
		ClanNeedBld:function()
		{
			return window.aisEnv.textLib.bldName["ClanBld"]+" Need to build";
		},
		askBuyGemBoost:"Spend <rmb> Gems to enhance the speed of Faceting Machine to <num> Gem(s)/day? This effect will continue for <day> day(s). It may takes a bit of time, please wait. \n Confirm to purchase?",
		ConfirmJumpGuide:"Newbie boot camp",
		sureJumpGuide:"Would you like to learn how to build a fort? Click OK to continue. Click Cancel to skip the Newbie boot camp.",
//		GPEvaluate:"Like this game?",
//		GPEvaluateInfo:"We appreciate your rating us a 5-star.",
//		GPCancel:"Later",
//		GPOk:"Yes",
		MechNo2AtkTitle:"Not enough medals.",
		MechNo2AtkInfo:"Commander, you don't have enough medals. Increase your medals to <num> by attacking other forts to enable M-Units.",
		getMechOk:"You've got the unit. Click the button to reload the game.",
		getMechFull:"Sorry, your mech storage is full.",
		noHaveMacshop:"You cannot get the module. Please build an M-Works first.",
		CutTimeTitle:"Time Chip:",
		MedalTitle:"Medal:",
		MacDefenseMode:"The Last Stand",
		ShareBattleError:"You need to join an Alliance first.",
		AskGemFinRqstCD:"Ask for support now!",
		AskGemFinRqstCDInfo:function(gemNum)
		{
			return "Sir, we need "+gemNum+" Gems to ask for support right now.";
		},
		ClearClanCupInfo:"Battle report for today's World Domination is ready. Check detail info in Battle Report. ",
		BattleClantecLabel:"Defender's Alliance Tech",
		DeclarewarError:"Sorry, World Domination has ended.",
		AdwaysTitle:"Free Gems",
		AdwaysInfo:"Free Gems can be gained by downloading other apps and meeting corresponding requirements. The gift Gems may be delayed by some reasons, thank you for your patience. The app list will refresh often, don't forget to ",
	};
}