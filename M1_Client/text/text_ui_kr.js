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
			var i,txt=this[text];
			for(i in args){
				txt =txt.replace("<"+i+">",  args[i]);
			}
			return txt;
		},
		"_Builder":"일꾼：",
		"_Shield":"투명자기장：",
		"_Max":"최대치：",
		"Battle Shop":"전쟁터 매장",
		"Treasure":"특별 보급물자",
		"Resources":"자원",
		"Decorations":"장식",
		"Army":"군대",
		"Defense":"방어",
		"Shield":"투명자기장",
		"SpecialSupply":"특별 보급물자",
		"Built":"건설됨",
		"Choose position":"건물 위치 선택",
		"Level Text":function(level){return level+"레벨";},
		"Constructing":"건설 중…",
		"Time_NONE":"즉시",
		"BadBuildMaxCap":"해당  건물 수가 최대입니다. 지휘센터를 레벨업하면 건물 최대치를 높일 수 있습니다.",
		"BadBuildMaxCap_WorkerHud":"건물 수가 최대입니다.",
		"ReqNeedForBld":"건설 조건이 부족합니다.",
		"ResNeedForUnit":"물자 부족해, 지정 부대를 만들 수 없습니다.",
		"TrainTip":"전투부대를 훈련해야 합니다. 부대 아이콘을 터치하거나 고정하세요.",
		"TrainCampFull":"캠프가 만원입니다! 훈련장을 건설, 레벨업해 더 많은 부대를 수용하거나 전투를 통해 부대를 사용하세요.",
		"NoResTitle":"자원 부족!",
		"AskBoost":"시공 가속 가동!",
		"AskGemFin":"즉시 공사 완료!",
	//	"Tech Lab":"연구소",
		"TechCount":"전적 통계",
		"TrainNum":"훈련 수",
		"ActiveRate":"사용률",
		"NetError":"서버와 클라이언트 데이터 오류입니다. 적의 시스템 교란 방지를 위해 다시 로그인 하세요!",
		"NetDisconnect":"작전본부와의 네트워크 연결이 끊겼습니다. 원활한 네트워크 환경을 유지하세요!",
		"SysFull":"작전본부 네트워크 연결이 좋지 않습니다. 잠시 후 다시 시도해주세요!",
		"TimeOut":"작전본투 네트워크 연결 시간 초과. 원활한 네트워크 환경을 유지하세요.",
		"OK":"확인",
		"Cancel":"취소",
		"EnterShop":"상점 입장",
		"OverflowStorage":"창고 부족",
		"OverflowRes":function(resType)
		{
			var codeName="ResGold"==resType?"GoldVault":"OilTank";
			var name=window.aisEnv.textLib.bldName[codeName];
			return "필요 자원이 창고 용량 한도를 초과했습니다."+name+"을 레벨업하세요";
		},
		"IsBoosting":"건물 가속 중",
		"IsBoostingDesc":"건물 가속 중입니다. 지금 레벨업하면 가속상태는 취소됩니다! 계속할까요?",
		"IsBuilding":"건설을 취소할까요?",
		"IsBuildingDesc":"건설을 취소하면 자원이 절반만 반환됩니다. 계속할까요?",
		"IsBld":"철거 취소?",
		"IsBldDesc":"건물 철거를 취소할까요?",
		"IsMaking":"지원 위성 제작을 취소할까요?",
		"IsMakingDesc":"지원 위성 제작을 취소하면 자원이 절반만 반환됩니다. 계속할까요?",
		"IsMaxLv":"최고 레벨 달성.",
		"NotOpen":"미오픈 기능입니다",
		"TrainStucked":"훈련장이 모두 찼습니다! 병사제조를 중단합니다.",
		"Unlock":"오픈",
		"UpgradeTime":"레벨업 시간",
		"NoLog":"기록 없음",
		"IsLoading":"정보 로딩 중……",
		"GetInfoError":"정보 획득 실패",
		"NoFreeWorker":"휴식 중인 일꾼 없음",
		"NoFreeWorkerDesc":"휴식 중인 일꾼 없음. 이전의 건설을 즉시 완료해 일꾼을 쉬게할까요?",
		"ShieldCD":"투명자기장 쿨타임 중",
		"ShieldCDTime":function(cdTime)
		{
			return "투명자기장 쿨타임 중. 남은 시간"+this.getTimeText(cdTime);
		},
		"GetCDTime":function(cdTime)
		{
			return "쿨타임:"+this.getTimeText(cdTime);
		},

		"Achieve":"업적",
		"AchieveComplete":"업적 획득!",
		"ReceiveReward":"보상 수령",
		"BattleLog":"전투 기록",
		"DefResult0":"완승",
		"DefResult1":"소패",
		"DefResult2":"대패",
		"DefResult3":"완패",
		"AtkResult0":"완패",
		"AtkResult1":"소승",
		"AtkResult2":"대승",
		"AtkResult3":"완승",
		"Lost":"손실",
		"Gain":"획득",
		"Replay":"전투 재생",
		"ReplayAgain":"다시 보기",
		"OnslaughtMode":"성 방어모드",
		"OnslaughtLevel":"<level>관문",
		"Expired":"재생 기간만료",
		"Revenge":"복수",
		"Revenged1":"복수함",
		"Revenged2":"복수 불가",
		"TotalRecord":"전체 전적",
		"TotalCount":"전투 횟수",
		"WinRate":"승률",
		"AtkRecord":"공격 전적",
		"AtkCount":"공격 횟수",
		"AtkWinRate":"공격 승률",
		"DefRecord":"방어 전적",
		"DefCount":"방어 횟수",
		"DefWinRate":"방어 승률",
		"WinningStreak":"최고 연승",
		"HighestRank":"최고 순위",
		"TotalKill":"적군 손실",
		"TotalDestroy":"파괴수량",
		"TotalRob":"약탈 수량",
		"HighestRob":"최고 약탈 수량",
	//	"":"",
		"BattleFailed":"공격 실패",
		"BattleWin":"방어 성공",
		"ConfirmGemBuy":"구매 확인",
		"ConfirmBuyItem":function(gem,resType,resNum,resName)
		{
			var resName;
			if("Gold"==resType){
				resName="황금";
			}else if("Oil"==resType || "Exriler"==resType){
				resName="에너지";
			}else if("Shield"==resType){
			//	resName="투명자기장:";
				resNum="1개";
			}
			return "다이아"+gem+"개를 사용하여 투명자기장"+resNum+resName+"를 구매하겠습니까?";
		},
		"Setting":"설정",
		"SetSound":function(on)
		{
			if(on)
				return "효과 음악: ON";
			else
				return "효과 음악: OFF";
		},
		"SetMusic":function(on)
		{
			if(on)
				return "배경 음악: ON";
			else
				return "배경 음악: OFF";
		},
		"BandEmail":"메일주소 바인딩",
		"InputEmail":"바인딩할 이메일 주소를 입력하세요",
		"InputEmailError":"정확한 메일 주소를 입력하세요",
		"InputPwd":"비밀 번호를 입력하세요",
		"InputPwdError":"비밀번호가 잛습니다.(문자 부호5개 이상)",
		"BindEmailSuccess":"활성화 메일이 발송했습니다. 메일 확인하고 활성화 링크를 클릭하여 활성화 완성하세요.",
		"YourEmail":"바인딩한 메일 주소：",
		"ServiceEmail":"고객서비스",
		"OfficialWebsite":"공식 사이트",
		"UserId":"사용자 ID",
		"UserName":"사용자 이름",
		"ConfirmVisit":"요새 방문",
		"ConfirmVisitDesc":function(name)
		{
			return +name+" 님의 요새을 방문하시겠습니까?";
		},
		"AccountManage":"계정관리",
		"IllegalInput":"비법 부호가 포함하여 다시 입력하세요！",
		"Copyright":"판권 정보",
		"Feedback":"사용자 피드백",
		"CopyrightDesc":"\r\n 리그 오브 워즈 \r\n\r\n 리그 오브 워즈©2013 KongZhong Group Companies \r\n\r\n A game developed and published by KongZhong Group Companies \r\n\r\n All rights reserved.\r\n\r\n Customer Care\r\n kdzz_kefu@Kongzhong.com",
		"BandAccount":"계정 귀속",
		"ChangeUser":"유저 변경",
	//"MailLogin":"메일 로그인",
		"ResetPssaword":"패스워드 재설정",
		"Logout":"로그오프",
		"BandDesc":"귀속 설명:\n1.첫 계정 귀속 시 메일주소와 패스워드를 설정합니다. \n2. 휴면 계정 여부를 확인하세요.(활성화 메일을 해당 메일로 발송합니다.) \n3.메일이 귀속되면  다른 단말기에서도 유저명(메일)과 패스워드를 입력하기만 하면 로그인할 수 있습니다.",
		"BandedDesc":"\n\n계정:<id>\n\n메일 귀속:<email>",
		"InputPwdTip":"패스워드를 입력해 주세요:(6~20자리)",//（包含6~20位英文或数字）
		"RepeatPwd":"패스워드를 다시 입력해 주세요.",
		"PwdErrorLen":"패스워드를 6~20자리로 입력하세요.",
		"PwdErrorStr":"패스워드에 사용할 수 없는 문자가 있습니다.",
		"PwdErrorRe":"패스워드가 일치하지 않습니다.",
		"LoginMail":"로그인 계정(귀속한 메일)",
		"LoginPwd":"로그인 패스워드",
		"Login":"로그인",
		"ResetPwdSuccess":"메일을 발송했습니다. 메일을 열어 링크된 주소를 통해 패스워드를 재설정하시기 바랍니다.",
		"MailPwdErr":"메일 또는 패스워드가 맞지 않습니다. 확인 후 다시 입력해 주세요.",
		"LoginEh":"메일 로그인 오류 발생. 잠시 후 다시 시도하세요.",
		"ResetPwdEh":"패스워드 재설정 오류 발생. 메일 계정과 귀속된 계정을 확인하세요.",
		"ResetPwdEh1055":"유효하지 않는 메일주소입니다. 메일 계정과 귀속된 계정을 확인하세요.",
		"BandEmaildEh":"계정 귀속 오류 발생. 잠시 후 다시 시도하세요.",
		"BandEmaildEh1054":"귀속된 메일입니다. 다른 메일로 시도하세요.",
		"BandEmaildEh1058":"계정 귀속 오류 발생. 유저 정보 인증 오류. 클라이언트 서버에 문의하세요.",
		"ResetPwdTip":"패스워드 재설정을 위해 귀속된 게임 계정이 필요합니다. 재설정 메일을 해당 메일로 발송합니다.",
		"DonateCnt":"지원 수",
		"DailyTasks":"오늘의 전투 퀘스트",
		"CurRank":"현재 랭킹",
		"RankResSingle":"1회 약탈",
		"RankResAverage":"약탈 효율",
		"GetDiamondMine":"다이아몬드 용접기 획득!",
		"GetDiamondGift":"다이아몬드를 구매해 \"다이아몬드달인\"업적을 완료해 \"다이아몬드 용접기\"선물 보상을 획득했습니다. 지휘센터의 선물 UI에서 수령하세요.",
		"Bld_X1":function(codeName){
			return window.aisEnv.textLib.bldName[codeName]+"x1"
		},
		"SpecialItem":"이벤트 전용",
		"SpecialItemDesc":"이 건물은 이벤트 전용으로 구매할 수 없습니다.",
		"Global":"전세계",
		"Local":"현지",
		"ResSingleTip":"어제의 플레이어 1회 최대 약탈 랭킹(금광+에너지)\r\n랭킹은 새벽 0시에 리셋됩니다",
		"ResAverageTip":"약탈효율은 어제 약탈한 총 금광량에서 약탈횟수로 나눕니다. 일일 약탈횟수가 3회 이상이어야 랭크될 수 있습니다.\r\n랭킹은 새벽 0시에 리셋됩니다",
		"GetInfoEh":"정보 획득 오류",
		"Gem":"다이아몬드",
		"PrdctRate24":"일일 생산량",//"생산율",
		"NeedReinforce":"지원이 필요합니다.",
		"DialyTaskTip":"오늘 전투 퀘스트 별을 완료할 때마다 퀘스트 선물 보상을 발송합니다.\r\n선물은 유효기간이 있으니, 기간 내 \"지휘센터\"의 선물 UI에서 수령하세요.",
		"EmailLogin":"메일 로그인",
		"ClanRankNum":"연합 랭킹",

		"HP":"HP",
		"Cap":"용량",
		"CapStorage":"저장량",
		"CapTroop":"병력",
		"CapTotalTroop":"총 병력",
		"CapClan":"연합 병력",
		"CapSpell":"위성 수",
		"PrdctRate":"시간당 산출",//"产出率",
		"PerHour":"시간당",
		"DmgPerSec":"초당 데미지",
		"HealPerSec":"초당 치료",
		"DmgRange":"공격 범위",
		"Tiles":"부대 거리",
		"DmgFavor":"선호 타깃",
		"DmgType":"데미지 유형",//单体、群伤
		"DmgTarget":"공격 타깃",//对地、对空
		"HousingSpace":"사용 공간",
		"TrainingTime":"훈련 시간",
		"TrainingCost":"훈령 비용",
		"MovementSpeed":"이동 속도",
		"TimeToCreate":"제작 시간",
		"Heal":"치료량",
		"HealType":"치료 유형",
		"TotalDmg":"총 데미지",
		"TotalHeal":"총 치료량",
		"Cost":"비용",
		"AddHP":"HP 보너스",
		"AddSpd":"속도 보너스",
		"AddAtk":"공격 보너스",
		"HealType":"치료 유형",
		"EffectType":"효과 유형",

		"RemainTime":"남은 시간:",
		"FinishNow":"즉시 완료:",
		"ConfirmGemFinish":" <gem> 다이아몬드를 사용해 레벨업을 즉시 완료할까요?",
		"ConfirmSell":"아이템 판매",
		"ConfirmSellDesc":"아이템을 판매해 <num> <res>로 바꾸겠습니까?",
		"RemainTroopCap":function(cur,max,bld)
		{
			var codeName="Camp";
			if(bld)
				codeName=bld.def.codeName;
			return "훈련 완료 후"+window.aisEnv.textLib.bldName[codeName]+"남은 용량:"+cur+"/"+max;
		},

		"Battle":"전투",
		"Match":"라이벌 찾기",
		"PveBtn":"해적 소탕",
		"OltBtn":"방어 시작",
		"OltLevel":"던전 <cur>/<max>",
		"RemainRes":"남은 자원",
		"Dungeon":"던전",
		"Challenge":"던전 도전",
		"YouGain":"획득:",
		"ArmyConsume":"군대 비용:",

		"BattleTips":"빈 곳을 터치하면 부대를 파견해 전투할 수 있습니다\n전투시작을 확정하세요.",
		"NotPut":"해당 구역은 부대를 배치할 수 없습니다!",
		"DontHaveSoldiers":"해당 병종을 모두 사용했습니다. 다른 병종을 선택하세요.",
		"Next":"다음",
		"Defeat":"실패 손실:",
		"EndBattle":"전투 종료",
		"BattleStartIn":"전투시작까지 남은시간:",
		"BattleEndIn":"전투종료까지 남은시간:",
		"ReplayEndIn":"전투보기 남은시간:",
		"NotEnoughGold":"황금 부족!!",
		"NotEnoughStorage":"창고 공간이 부족합니다!!",
		"NotUser":"플레이어를 찾지 못했습니다!",
		"UserOnline":"플레이어가 접속상태입니다. 공격할 수 없습니다!",
		"UserProtected":"플레이어가 투명자기장의 보호를 받고 있습니다!",
		"UserAttack":"플레이어가 공격을 받고 있습니다!",
		"UserClan":"연합군입니다. 공격할 수 없습니다!",
		"ConfirmEndBattle":"전투 종료?",
		"sureEndBattle":"이번 전투를 종료할까요?",
		"ConfirmEndOnslaught":"방어모드 종료",
		"sureEndOnslaught":"지금 퇴장하면 관문도전은 실패합니다. 떠날까요??",
		"OnslaughtWin":"방어 승리",
		"sureOnslaughtNext":"사령관님, 적의 공격을 막아냈습니다. 다음 관문에 도전할까요?",
		"OnslaughtFail":"방어 실패",
		"sureOnslaught":"안타깝게도 방어선이 뚫렸습니다.  다시 배치해 도전하세요!",
		"NotEnougGem":"다이아몬드 부족.",
		"NeedGemNum":function(num)
		{
			return "부족"+num+"다이아몬드. 상점에서 구매할까요?";
		},
		"NotEnougRes":"자원 부족",
		"NeedResNum":function(resType,resName,num)
		{
			return "부족"+num+" "+resName+"다이아몬드를 사용해 교환할까요?";
		},
		"NumberLimited":"건설 한도를 초과했습니다!",
	//	"Replay":"重放中",
		"X1":"1x",
		"X2":"2x",
		"X3":"3x",
		"X4":"4x",
		"BackHome":"요새로 귀환",
		"Day":"일",
		"Hour":"시",
		"Minute":"분",
		"Second":"초",
		"NotUnit":"출정 가능한 병사가 없습니다!!!",
		"InputName":"플레이어명 입력:",
		"SameName":"사용 중인 유저명입니다!!!",
		"NotExistName":"존재하지 않는 유저입니다!!!",
		"IllName":"잘못된 유저명입니다!!!",
		"SignFailed":"로그인 인증 실패!!!",
		"NullName":"사용자 이름 비워두면 안 됩니다!!",
		"NoShield":"보호 없음",
		"Notice":"공지",
		"Gift":"선물",
		"Worker":"건설 일꾼",

		"PushMsgTrainFull":"모든 훈련장에 부대가 집결했습니다. 지시하세요!",
		"PushMsgBuild":"사령관님, 요새에 레벨업, 건설을 완료한 건물이 있습니다.",
		"PushMsgTrainFinish":"사령관님, 병영이 생산훈련을 완료하고 휴식상태입니다.",
		"PushMsgTech":"사령관님, 기술 연구를 완료했습니다!",
		"PushMsgOneDay":"한동안 로그인 하지 않아 요새에 처리할 일이 쌓였습니다!",
		"PushMsgThreeDay":"사령관님, 요새 안의 모든 사람이 사령관님을 찾고 있습니다.",
		"PushMsgShield":"사령관님, 투명자기장이 곧 사라집니다!",
		"PushMsgDiamond":"사령관님, 다이아몬드를 제작했습니다. 수령하세요!",

		"ClanCreate":"연합 생성",
		"ClanRecommend":"추천 ",
		"ClanSearch":"연합 검색",
		"ClanSelf":"나의 연합",
		"ClanRank":"연합 랭킹",
		"ClanName":"연합명",
		"ClanBadge":"연합 휘장",
		"ClanDeclare":"연합 메시지",
		"JoinMode":"가입 방식",
		"ScoreRequire":"트로피 조건",
		"ClanModify":"수정",
		"ClanScore":"연합 트로피",
		"ClanMembers":"회원 수",
		"JoinRequire":"가입 조건",
		"Join":"가입",
		"Leave":"떠나기",
		"Edit":"편집",
		"EditSuccess":"연합 정보 수정 성공",
		"EditFailed":"연합 정보 수정 실패",
		"Submit":"제출",
		"Search":"검색",
		"SearchTip":"검색할 이름의 첫 글자를 입력해 주세요.",
		"SearchError":function(name)
		{
			return "를 찾을 수 없습니다."+name+"의 연합";
		},
		"InputClanName":"연합명을 입력해 주세요.",
		"InputClanDeclare":"메시지를 입력해 주세요.",
		"InputSearchName":"검색할 연합명을 입력해 주세요.",
		"InputChatMsg":"발송할 내용을 입력해 주세요.",
		"ClanInfoError":"연합 정보 오류",
		"ClanType0":"자유 가입",
		"ClanType1":"가입 초대",
		"ClanType2":"가입 닫기",
		"ClanLeave":"연합을 탈퇴했습니다",
		"ClanJoin":"연합에 가입했습니다",
		"ClanCreated":"연합을 생성했습니다",
		"ClanKicked":"연합에서 퇴출되었습니다",
		"ClanPromoted":"관직 상승",
		"ClanReqTroops":"원군 요청",
		"ClanReqJoin":"연합 가입 신청",
		"ClanPosition0":"회원",
		"ClanPosition1":"맹주",
		"ClanPosition2":"관료",
		"Donate":"지원",
		"ClanKick":"퇴출",
		"ClanPromote":"위임",
		"ClanNotLogin":"연합 미 등록",
		"ClanNotJoin":"연합에 가입하지 않았습니다.",
		"ClanMsg":"연합 소식",
		"ClanSameName":"연합명 중복",
		"SltBadge":"연합 휘장을 선택하세요",
		"UBePromote":"연합 직위가 향상되었습니다.",
		"UBeKick":"연합에서 쫓겨났습니다",
		"UJoinClan":"연합에 가입했습니다",
		"UCreateClan":"연합을 탈퇴했습니다",
		"JoinClanError":"연합 가입 실패",
		"NotMeetMedal":"트로피가 부족합니다.",
		"ClanNotOpen":"해당 연합은 회원가입을 오픈하지 않았습니다.",
		"ClanIsFull":"연합 회원이 모두 찼습니다.",
		"ULeaveClan":"연합을 탈퇴했습니다",
		"LeaderLeaveClan":function(name)
		{
			return "맹주 "+name+" 연합을 떠났습니다";
		},
		"UBeLeader":"맹주가 되었습니다.",
		"NewLeader":function(name)
		{
			return name+"님이 맹주가 되었습니다";
		},
		"RankClan":"연합 랭킹",
		"RankPlayer":"플레이어 랭킹",
		"RankSearch":"검색",
		"ViewClan":"연합 보기",
		"SearchCost":"검색 비용:",
		"MultMode":"멀티 모드",
		"SingleMode":"싱글 모드",
		"CurMedal":"현재 트로피:",
		"CurStar":"현재 별 수:",
		"InShield":"보호 상태",
		"InShieldDesc":"현재 보호 상태입니다. 타인을 공격하면 투명자기장이 사라집니다. 계속할까요?",
		"NoReduce":"병력이 감소하지 않습니다.",
		"NeedMedal":function(num)
		{
			return "트로픽"+num+" 이상";
		},
		"DonateNum":function(cur,max)
		{
			return "지원 수: ("+cur+"/"+max+")";
		},

		"ParamError":"변수 오류",
		"AskJoinClan":"연합 가입",
		"AskJoinClanInfo":function(clanName)
		{
			return "가입 확인"+clanName+"연합？";
		},
		"AskLeaveClan":"연합 탈퇴",
		"AskLeaveClanInfo":"연합을 탈퇴할까요?",
		"AskKick":"연합 퇴출",
		"AskKickInfo":function(userName)
		{
			return "를"+userName+"연합에서 퇴출할까요?";
		},
		"AskPromote":"위임",
		"AskPromoteInfo":function(userName)
		{
			return "를"+userName+"관료로 진급시킬까요?";
		},

		"Refuse":"거절",
		"Agree":"수락",
		"World":"세계",
		"Clan":"연합",

		"UBeAttack":"요새가 공격을 받았습니다!",
		"UBeAttackDesc":"사령관님, 안 계시던 동안 요새가 공격을 받았습니다. 전투 기록에서 상황을 조사할 수 있습니다",
		"TotalScore":"합계",

		"LogDefence":"방어",
		"LogAttack":"공격",

		"StrDay":"일",
		"StrHour":"시간",
		"StrMin":"분",
		"StrSec":"초",
/********特别补给相关**********/
		"FirstCharge":"첫 충전 2배!",
		"FirstChargeReward":function(name,num)
		{
			return "첫 충전 2배 이벤트에 참여하세요. 이번에 구매한 선물【"+name+"】(이)가 2배가 되면 다이아몬드【"+(num*2)+"】개를 획득합니다. \r\n\r\n첫 충전은 2배. 충전 즉시 증정. 충전하면 선물이 와르르! 첫 충전 한정!";
		},
		"PayDCSY":"휴대전화 인터넷뱅킹",
		"PayDCSZX":"전화 선불카드",
		"PayDCZFB":"Allipay",
		"PayMO9":"선게임 후지불 MO9",
		"buyItem":"충전",
		"buyTip":"다이아몬드 <number>개를 구매할까요? 충전 신청 시 처리시간이 필요합니다. 잠시 기다려 주세요.",
		"buyokTip":"충전 성공. 다이아몬드 <number> 개를 획득했습니다!",
		"buyResTip":"다이아몬드를 사용해서 <number> 개의 <res>를 구매할까요?",
		"FillGold10":"금고자원 10% 보충",//Fill Gold Storages by 10%
		"FillGold50":"금고자원 50% 보충",//Fill Gold Storages by Half
		"FillGold100":"금고 최대 보충",//Fill Gold Storages
		"FillOil10":"에너지 탱크 자원 10% 보충",//Fill Oil Storages by 10%
		"FillOil50":"에너지 탱크 자원 50% 보충",//Fill Oil Storages by Half
		"FillOil100":"에너지 탱크 최대 보충",//Fill Oil Storages
		"FillRes":function(res,rate)
		{
			var codeName="";
			if("Gold"==res){
				codeName="GoldVault";
			}else if("Oil"==res){
				codeName="OilTank";
			}
			if(10==rate || 50==rate)
				return "자원"+rate+"%"+window.aisEnv.textLib.bldName[codeName]+"보충";
			else if(100==rate)
				return "최대 보충"+window.aisEnv.textLib.bldName[codeName];
		},
/****************************/
		getGemTip:"다이아몬드 <number>개를 획득했습니다!",
		DeadRate40:"상대가 8시간 투명자기장을 획득합니다",
		DeadRate90:"상대가 12시간 투명자기장을 획득합니다",
		DeadRate100:"상대방이 16시간 투명자기장을 획득합니다",

		AskGemFinInfo:function(gemNum)
		{
			return "사령관님,"+gemNum+"다이아몬드(숫자)개를 사용하면 이 공사를 즉시 완료할 수 있습니다. 허가해주세요.";
		},
		"AskExit":"로그아웃 할까요?",
		AskBoostInfo:function(buffDef)
		{
			if(buffDef.codeName.indexOf("Oil")>-1 || buffDef.codeName.indexOf("Gold")>-1)
				return "다이아몬드"+buffDef.cost.gem+"개를 사용해 자원 생산량을"+buffDef.factors[0].mbf+"배로 늘리시겠습니까? 이 효과는"+this.getTimeText(buffDef.durTime)+"지속됩니다.";
			else if(buffDef.codeName.indexOf("Unit")>-1)
				return "다이아몬드"+buffDef.cost.gem+"개를 사용해 병사 훈련 속도를"+buffDef.factors[0].mbf+"배로 늘리시겠습니까? 이 효과는"+this.getTimeText(buffDef.durTime)+"지속됩니다.";
			else if(buffDef.codeName.indexOf("Spell")>-1)
				return "다이아몬드"+buffDef.cost.gem+"개를 사용해 위성 생산 속도를"+buffDef.factors[0].mbf+"배로 늘리시겠습니까? 이 효과는"+this.getTimeText(buffDef.durTime)+"지속됩니다.";
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
					text+="다이아몬드:"+shortVO.gem+"/ ";
				}
				if(shortVO.cash)
				{
					text+="현금:"+shortVO.cash+"/ ";
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
				return "사령관님, 필수 자원이 부족해"+text+"건설 퀘스트를 진행할 수 없습니다. 자원을 수집해주세요."
			}
			return "사령관님, 필수 자원이 부족해 건설 퀘스트를 진행할 수 없습니다. 자원을 수집해주세요.";
		},
		NoResUpgradeInfo:function(shortVO)
		{
			var text,list,i,n,def;
			if(shortVO)
			{
				text=" (";
				if(shortVO.gem)
				{
					text+="다이아몬드:"+shortVO.gem+"/ ";
				}
				if(shortVO.cash)
				{
					text+="현금:"+shortVO.cash+"/ ";
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
				return "사령관님, 필수 자원이 부족해"+text+"건설 퀘스트를 진행할 수 없습니다. 자원을 수집해주세요."
			}
			return "사령관님, 필수 자원이 부족해 건설 퀘스트를 진행할 수 없습니다. 자원을 수집해주세요.";
		},
		barracksDlgTitle:function(bld)
		{
			var cap;
			cap=bld.getValue("mfcCap");
		//	return "兵工厂 ("+bld.slotCap+"/"+cap+")";
			return window.aisEnv.textLib.bldName[bld.def.codeName]+" ("+bld.slotCap+"/"+cap+")";
		},
		unitNeedBldLevel:function(level,bld)
		{
			var codeName="Barrack";
			if(bld)
				codeName=bld.def.codeName;
			return "필요 훈련:\n"+window.aisEnv.textLib.bldName[codeName]+level+"레벨.";
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
			return "필요 훈련:\n"+window.aisEnv.textLib.bldName[codeName]+level+"레벨";
		},
		BldNeedFeature:function(list)
		{
			return "필요 건물:"+window.aisEnv.defLib.feature[list[0]].name;
		},
		ReqNotMeet:function(name)
		{
			return name+"조건 미달";
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
				str=""+d+"일 ";
				if(h)str+=(h+"시간")
			//	return ""+d+"天 "+h+"小时 ";
			}
			else if(h)
			{
				str=""+h+"시간";
				if(m)str+=(m+"분")
			//	return ""+h+"小时 "+m+"分 ";
			}
			else if(m)
			{
				str=""+m+"분";
				if(s)str+=(s+"초")
			//	return ""+m+"分 "+s+"秒";
			}
			else
			{
				str=""+s+"초";
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
			return username+"님이 아군"+unitname+"("+this.getLevel(unitlevel)+")"+"을 도와줍니다";
		},
		getLevel:function(level)
		{
			return level+"급";
		},
		getTimeDistance:function(time){
			time=window.aisEnv.dateTime()-time;
			time=time<0?0:time;
			var str=this.getTimeText(time);
			return str+"이전";
		},
		getRemainNum:function(num){
			return "나머지"+num;
		},
		ClanNeedBld:function()
		{
			return window.aisEnv.textLib.bldName["ClanBld"]+"필요 건설";
		},
	};
}