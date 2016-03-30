if(!window.pxyCommand)
{
	window.pxyCommand={
		stage:null,
		init:function(stage)
		{
			this.stage=stage;

			this.res2SvrRes={"Res_Gold":"Gold","Res_Oil":"Elixir",Res_Cube:"Cube","ResGold":"Gold","ResOil":"Elixir",ResCube:"Cube",cash:"tok1",cashNum:"tok1",Gem:"Gem",TH:"TH",CubeCard:"CubeCard"};
			this.curMsgType=-1;

			this.C2SType=10000;

			this.C2S_Search_opponents=this.C2SType+100;
			this.C2S_Revenge=this.C2SType+101;
			this.C2S_Battle_Log=this.C2SType+102;
			this.C2S_Return_Home=this.C2SType+103;
			this.C2S_Replay=this.C2S_Return_Home+1;
			this.C2S_PVE_InitUnit=this.C2S_Replay+1;
			this.C2S_PVE_Result=this.C2S_PVE_InitUnit+1;
			this.C2S_PVE2_Result=this.C2S_PVE_Result+1;				//C2S_PVE2_Result

			this.C2S_GetBtReward=this.C2SType+126;						//C2S_Get_Reward_Gem

			this.C2S_MacDefense_init=this.C2SType+130;						//C2S_Wave_Battle_Init
			this.C2S_MacDefense_Log=this.C2S_MacDefense_init+1;		//C2S_Wave_Battle_Log
			this.C2S_MacDefense_UseSkill=this.C2S_MacDefense_Log+1;		//C2S_Wave_Battle_Use_Magic
			this.C2S_MacDefense_GoHome=this.C2S_MacDefense_UseSkill+1;		//C2S_Wave_Battle_Return_Home
			this.C2S_BattleEnemy=this.C2S_MacDefense_GoHome+1;				//C2S_Battle_Enemy
			this.C2S_RecoveryEnemy=this.C2S_BattleEnemy+1;				//C2S_Instant_Recovery

			this.C2S_AtkWords=this.C2SType+138;//C2S_Attack_Words
			this.C2S_AtkShareBattle=this.C2S_AtkWords+1;//C2S_Attack_Share_Battle

			//---------S2C------------------------
			this.S2CTypeBase=20000;
			this.C2S_Error_Message=this.S2CTypeBase+1;
			this.C2S_Get_Info=this.C2S_Error_Message+1;
			this.C2S_Product_Res=this.C2S_Get_Info+1;
			this.C2S_Clan_msg=this.C2S_Product_Res+1;
			this.C2S_Charge=this.C2S_Clan_msg+1;
			this.C2S_Gift_Send=this.C2S_Charge+1;
			this.C2S_PMD=this.C2S_Gift_Send+1;
			this.C2S_CompoundResult=this.C2S_PMD+1;								//C2S_Compound_Result
			this.C2S_LootResult=this.C2S_CompoundResult+1;        //C2S_Loot_Result
			//---------Inner------------------------
			this.InnerTypeBase=40000;
			this.C2S_GameShareBattle=this.InnerTypeBase+1;//INNER_GAME_SHARE_BATTLE_REPORT

			this.C2S_Bind_FaceBook=this.C2SType + 300; //绑定FaceBook
			this.C2S_Invite_FaceBook=this.C2SType + 301; //邀请FaceBook好友
			this.C2S_Invited_FaceBookList=this.C2SType + 302; //已经邀请过得FaceBook好友名单

		},
		//将AIS的消息VO转换为服务器的消息字符串
		convert:function(msgVO)
		{
			var msgBuf,bodyBuf,func,instanceId;
			msgBuf=[window.USERID,this["C2S_"+msgVO.com]];
			this.curMsgType=this["C2S_"+msgVO.com];
			bodyBuf=[];
			func=this["comFunc_"+msgVO.com];
			if(func)
			{
				var bldHash,bld;

				func.call(this,msgVO,bodyBuf);

				var group;
				if(msgVO.com=="GameShareBattle")
					group="ClanBld"
				else
					group="TownHall";
				msgBuf.push.apply(msgBuf,[group,0,msgVO.time,bodyBuf.length]);

				msgBuf.push.apply(msgBuf,bodyBuf);
			}
			else
			{
				DBOut("Can't find converter: "+msgVO.com);
				return null;
			}
			return msgBuf.join("!#");
		},
		getMsgType:function()
		{
			return this.curMsgType;
		}
	}

	window.pxyCommand.comFunc_Search_opponents=function(msgVO,msgBuf)
	{
		var bld,comVO;
		bld=msgVO.comObj;
		comVO=msgVO.comVO;

		msgBuf.push(comVO.userId);//rewardResCodename
	};
	window.pxyCommand.comFunc_Battle_Log=function(msgVO,msgBuf)
	{
		var bld,comVO;
		bld=msgVO.comObj;
		comVO=msgVO.comVO;
		msgBuf.push(comVO.overFlag);//0：战斗中，1：战斗结束
		msgBuf.push(toJSON(comVO.log));//每单位时间产生的战斗日志
	};

	window.pxyCommand.comFunc_PVE_Result=function(msgVO,msgBuf)
	{
		var i,n,type,bld,comVO;
		bld=msgVO.comObj;
		comVO=msgVO.comVO;
		msgBuf.push(toJSON(comVO.cmds));
		msgBuf.push(toJSON(comVO.mech));
		msgBuf.push(comVO.star);

		n=comVO.res.length;
		msgBuf.push(n);
		for(i=0;i<n;i++)
		{
			msgBuf.push(this.res2SvrRes[comVO.res[i].type]);
			msgBuf.push(comVO.res[i].num);
		}
	};
	window.pxyCommand.comFunc_Return_Home=function(msgVO,msgBuf)
	{
		//无参数
	};
	window.pxyCommand.comFunc_PVE2_Result=function(msgVO,msgBuf)
	{

		var comVO;
		comVO=msgVO.comVO;
		msgBuf.push(comVO.stageId);//关卡id
		msgBuf.push(comVO.result);//守城结果1守城成功，-1守城失败
	};

	window.pxyCommand.comFunc_GetBtReward=function(msgVO,msgBuf)
	{
		var comVO;
		comVO=msgVO.comVO;
		msgBuf.push(comVO.gem);//costGem
	};


	window.pxyCommand.comFunc_MacDefense_Log=function(msgVO,msgBuf)
	{
		var bld,comVO;
		bld=msgVO.comObj;
		comVO=msgVO.comVO;
		msgBuf.push(comVO.overFlag);//0：战斗中，1：战斗结束
		msgBuf.push(toJSON(comVO.log));//每单位时间产生的战斗日志
	};

	window.pxyCommand.comFunc_MacDefense_UseSkill=function(msgVO,msgBuf)
	{
		var bld,comVO;
		bld=msgVO.comObj;
		comVO=msgVO.comVO;
		msgBuf.push(comVO.codename);//技能codename
		msgBuf.push(comVO.gemNum);//花费
	};
	window.pxyCommand.comFunc_MacDefense_GoHome=function(msgVO,msgBuf)
	{
		//无参数
	};

	window.pxyCommand.comFunc_RecoveryEnemy=function(msgVO,msgBuf)
	{
		var bld,comVO,cost=[],i;
		bld=msgVO.comObj;
		comVO=msgVO.comVO;
		cost.push({type:"Gem",num:comVO.gemNum});
		for(i in comVO.cost)
		{
			if(comVO.cost[i])
			cost.push({type:this.res2SvrRes[i],num:comVO.cost[i]});
		}

		msgBuf.push(cost.length);//resTypeNum
		for(i=0;i<cost.length;i++)
		{
			msgBuf.push(cost[i].type);//restype
			msgBuf.push(cost[i].num);//restnum
		}
	};
	window.pxyCommand.comFunc_AtkShareBattle=
	window.pxyCommand.comFunc_AtkWords=function(msgVO,msgBuf)
	{
		var bld,comVO;
		bld=msgVO.comObj;
		comVO=msgVO.comVO;
		msgBuf.push(comVO.words);//words
	};
	window.pxyCommand.comFunc_GameShareBattle=function(msgVO,msgBuf)
	{
		var bld,comVO;
		bld=msgVO.comObj;
		comVO=msgVO.comVO;
		msgBuf.push(comVO.battleId);//battleId
		msgBuf.push(comVO.words);//words
	};

}
