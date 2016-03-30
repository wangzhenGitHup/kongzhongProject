if(!window.aisTypes.aisClanMessages)
{
//---------------------------------------------------------------------------
//拥有Achvmnt的对象
window.aisTypes.aisClanMessages=function(env,owner)
{
	//联盟官阶========================================================
	this.CLAN_RANK_MEMBER = 	    0;//成员
	this.CLAN_RANK_LEADER = 	    1;//盟主
	this.CLAN_RANK_OFFICER = 	    2;//官员
	this.CLAN_RANK_DEPUTY_LEADER =	3;//副盟主
	this.CLAN_RANK_NON_MEMBER = 	4;//见习成员

	//聊天信息类型======================================================
	this.CHAT_MSG_CREATE = 		        0;//创建联盟
	this.CHAT_MSG_WORDS = 		        1;//聊天信息
	this.CHAT_MSG_REINFORCE =			2;//增援申请
	this.CHAT_MSG_DONATE =				3;//捐兵
	this.CHAT_MSG_JOIN =				4;//申请加入、自由加入
	this.CHAT_MSG_LEAVE =				5;//离开
	this.CHAT_MSG_KICK =				6;//踢人
	this.CHAT_MSG_APPOINT = 	        7;//委任
	this.CHAT_MSG_DISMISE = 	        8;//禅让
	this.CHAT_MSG_EDIT =				9;//编辑
	this.CHAT_MSG_ShareBattleReport =	10;//分享战报
	this.CHAT_MSG_DONATE_TO_SELF =	 	11;//给自己联盟捐兵
	this.CHAT_MSG_JOIN_RESULT =			12;//加入结果	0：拒绝	1：同意
	this.CHAT_MSG_DONATE_GET_POINTS =	13;//联盟捐赠
	this.CHAT_MSG_SIGN_IN =				14;//联盟签到
	this.CHAT_MSG_DECLAREWAR = 			15;//联盟领土争夺战，对领地宣战
	this.CHAT_MSG_AWARD= 				16;//联盟分配资源 盟主发奖
	this.CHAT_MSG_UPGRADE = 			17;//联盟升级
	this.CHAT_MSG_CALL_ON= 				18;//联盟号召
	this.CHAT_MSG_RESPOND_CALL= 		19;//响应联盟号召
	this.CHAT_MSG_CALL_GEM= 			20;//钻石秒科技


//	//申请、自由加入==============================================
//	this.CLAN_REINFORCE_JOIN = 	"0";//申请
//	this.CLAN_FREE_JOIN =	"1";//自由加入

	//加入方式==============================================CHAT_MSG_JOIN
	this.JOIN_CLAN_TYPE_ANYONE = 		0;//自由加入
	this.JOIN_CLAN_TYPE_INVITE =		1;//只邀请
	this.JOIN_CLAN_TYPE_CLOSE  = 		2;//关闭（不允许任何人加入）
	this.JOIN_CLAN_TYPE_APPLY  = 		3;//申请加入


	//每个联盟保留消息记录最大数==============================================
	this.MAX_LOG_NUM = 					50;

	//最大联盟人数==============================================
	this.MAX_MEMBER_NUM = 				50;

	//联盟成员功绩==============================================
	this.CLAN_DONATE_POINT = 		"0";//联盟捐赠
	this.CLAN_TECH =				"1";//联盟科技

	//联盟科技状态==============================================
	this.CLAN_TECH_STATUS_NON = 		0;//未启用
	this.CLAN_TECH_STATUS_ING = 		1;//号召中
	this.CLAN_TECH_STATUS_ED =			2;//已开启

	this.CLAN_MSG_STATUS_CODE_SUCC =				0;		//成功
	this.CLAN_MSG_STATUS_CODE_ERROR_COMMON = 		-1;		//接收参数时S2SReqeust封装错误 / 逻辑异常
	this.CLAN_MSG_STATUS_CODE_ERROR_REPEAT_NAME = 	-2;		//重名 / 申请加入联盟的用户已经有联盟
	this.CLAN_MSG_STATUS_CODE_ERROR_CLAN_CUP_OVER = -3;		//联盟赛结束


	if(env)
	{
		this.env=env;
		this.owner=owner;
		this.city=owner;
		this.appEnv=window.aisGame.appEnv;
		this.msgs=[];
		aisTypes.applyType(this,aisTypes.aisViewConnect);
	}
};
window.aisTypes.aisClanMessages.prototype=new Object();
window.aisTypes.aisClanMessages.prototype.addMessage=function(vo,page,bInit)
{
	var i,n,unit;
	var textLib=this.appEnv.textLib;
	var msg=vo.msg;
	msg.responseStatusCode=vo.responseStatusCode;
	if(msg.type==this.CHAT_MSG_DONATE)//捐兵
	{
		var king=window.aisGame.king;
		king.miniUpdate();
		if(msg.userId==window.USERID)//别人给自己捐兵
		{
			unit=msg.donateUnit;
			this.city.com_GetDonated({units:[{type:unit.codename,num:1,level:unit.level-1}]});

			var king=window.aisGame.king;
			var bld=king.getHashObj("Obj0");
			if(bld)
			{
				if(page.vwHomeStage)
				page.vwHomeStage.updateBld(bld.homeBld,1);
			}
		}else if(msg.donateUserId==window.USERID){//自己给别人捐兵
			unit=msg.donateUnit;
			this.city.com_DonateClan({units:[{type:unit.codename,num:1,level:unit.level-1}]});
		}
	}
	else if(msg.type==this.CHAT_MSG_JOIN && !vo.responseStatusCode && !bInit)//加入联盟
	{
		if(msg.userId==window.USERID && msg.appendMsg==this.JOIN_CLAN_TYPE_ANYONE)//自由加入
		{
			this.city.allianceId=vo.clanId;
		}
		else if(msg.userId==window.USERID && msg.appendMsg==this.JOIN_CLAN_TYPE_CLOSE)//关闭加入
		{
			this.appEnv.stateLogs.showLog(textLib["ClanJoinClosed"]);
		}
	}
	else if(msg.type==this.CHAT_MSG_JOIN_RESULT && !vo.responseStatusCode && !bInit)//入盟结果
	{
		if(msg.userId==window.USERID && msg.appendMsg==1)//msg.rankLevel==1
		{
			this.city.allianceId=vo.clanId;
		}
		else if(msg.userId==window.USERID && msg.appendMsg==0)
		{
			this.appEnv.stateLogs.showLog(textLib["ClanJoinRefuse"]);
		}
	}
	else if(msg.type==this.CHAT_MSG_LEAVE || msg.type==this.CHAT_MSG_KICK)//离开联盟、被踢
	{
		if(!bInit)
		{
			if(msg.userId==window.USERID)
			{
				this.city.allianceId=0;
				this.city.removeClanTechsBuff();
				this.city.clanVO=null;
				this.city.clanLoginVO=null;
				var king=window.aisGame.king;
				var bld=king.getHashObj("Obj0");
				if(bld)
				{
					if(page.vwHomeStage)
					page.vwHomeStage.updateBld(bld.homeBld,1);
				}
				this.msgs=[];
			}
			else
			{
				for(i=0; i<this.msgs.length; i++)
				{
					if((this.msgs[i].type==this.CHAT_MSG_REINFORCE || this.msgs[i].type==this.CHAT_MSG_DONATE || this.msgs[i].type==this.CHAT_MSG_DONATE_TO_SELF) &&
						msg.userId==this.msgs[i].userId)
					{
						this.msgs.splice(i,1);
						i--;
						break;
					}
				}
			}
		}
	}
	else if(msg.type==this.CHAT_MSG_DONATE_TO_SELF)//自捐
	{
		if(msg.responseStatusCode!=0)
		{
			unit=msg.donateUnit;
			if(this.city.unitStorage.checkPutIn({type:unit.codename,num:unit.num}))
				this.city.unitStorage.putItemsIn([{type:unit.codename,num:unit.num,store:"Unit"}]);
		}
	}
	else if(msg.type==this.CHAT_MSG_DONATE_GET_POINTS && !bInit)//捐献
	{
		//if(msg.responseStatusCode==0)
		{
			this.city.com_ClanDonatePoints_PS({type:msg.remainPlace,bSelf:msg.userId==window.USERID,bSucceed:msg.responseStatusCode==0?1:0});
		}
	}
	else if(msg.type==this.CHAT_MSG_SIGN_IN && !bInit)//签到
	{
		if(msg.responseStatusCode==0 && !bInit)
		{
			this.city.com_ClanSignIn_PS({bSelf:msg.userId==window.USERID});
		}
	}
	else if(msg.type==this.CHAT_MSG_UPGRADE && !bInit)//升级
	{
		if(msg.responseStatusCode==0)
		{
			this.city.com_ClanUpgrade_PS({point:msg.remainPlace});
		}
	}
	else if(msg.type==this.CHAT_MSG_AWARD && !bInit)//分配钻石
	{
		if(msg.responseStatusCode==0)
		{
			this.city.com_ClanAllotRes_PS({resType:"Gem",resNum:msg.remainPlace,bSelf:msg.donateUserId==window.USERID});
		}
	}
	else if(msg.type==this.CHAT_MSG_DECLAREWAR && !bInit)//宣战
	{
		if(msg.responseStatusCode==0)
		{
			this.city.com_ClanDeclareWar_PS({domainId:msg.appendMsg});
		}
		else if(msg.responseStatusCode==this.CLAN_MSG_STATUS_CODE_ERROR_CLAN_CUP_OVER)
		{
			if(msg.userId==window.USERID)
				this.appEnv.stateLogs.showLog(textLib["DeclarewarError"]);
			return;
		}
	}
	else if(msg.type==this.CHAT_MSG_CALL_ON && !bInit)//号召科技
	{
		if(msg.responseStatusCode==0)
		{
			this.city.com_ClanCallOn_PS({tecvo:fromJSON(msg.appendMsg)});
		}
	}
	else if(msg.type==this.CHAT_MSG_RESPOND_CALL && !bInit)//响应科技
	{
		if(msg.responseStatusCode==0)
		{
			this.city.com_ClanRespondCall_PS({tecvo:fromJSON(msg.appendMsg),bSelf:msg.userId==window.USERID});
		}
	}
	else if(msg.type==this.CHAT_MSG_CALL_GEM && !bInit)//钻秒科技
	{
		if(msg.responseStatusCode==0)
		{
			this.city.com_ClanCallGem_PS({tecvo:fromJSON(msg.appendMsg),bSelf:msg.userId==window.USERID});
		}
	}
	//签到和分配钻石不做界面更新
	if(msg.type==this.CHAT_MSG_SIGN_IN || msg.type==this.CHAT_MSG_AWARD)
		return;
	n=this.msgs.length;
	if(n>=this.MAX_LOG_NUM)
	{
		for(i=0;i<n-this.MAX_LOG_NUM;i++)
			this.msgs.pop();
	}
//	DBOut("newMsg:"+toJSON(msg));
	var asked=0;
	for(i=0; i<this.msgs.length; i++)
	{
//		DBOut("msgs["+i+"]:"+toJSON(this.msgs[i]));
		if(msg.type==this.CHAT_MSG_DONATE_TO_SELF && msg.id==this.msgs[i].id)
			asked=1;
		if(this.checkMessage(msg, this.msgs[i]))
		{
//			DBOut("splice "+i);
			this.msgs.splice(i,1);
			break;
		}
	}
	if(msg.type==this.CHAT_MSG_DONATE_TO_SELF && !asked)
		return;
	this.msgs.unshift(msg);
//	DBOut("after add:"+toJSON(this.msgs));
	this.makeViewsDirty();
};
window.aisTypes.aisClanMessages.prototype.checkMessage=function(msg1,msg2)
{
	if(!msg1 || !msg2)return 0;
	//申请入盟和批准、拒绝入盟只留一个
	if(
		(msg2.type==this.CHAT_MSG_JOIN && msg2.appendMsg==this.JOIN_CLAN_TYPE_APPLY) && //旧消息为申请入盟消息
		(msg1.type==this.CHAT_MSG_JOIN_RESULT || (msg1.type==this.CHAT_MSG_JOIN && msg1.appendMsg==this.JOIN_CLAN_TYPE_APPLY)) && //新消息为批准、拒绝消息 || 重复申请入盟消息
		msg1.userId==msg2.userId
	)
	{
		return 1;
	}
	//要兵和捐兵只留一个
	if( (msg1.type==this.CHAT_MSG_REINFORCE || msg1.type==this.CHAT_MSG_DONATE || msg1.type==this.CHAT_MSG_DONATE_TO_SELF) &&
		(msg2.type==this.CHAT_MSG_REINFORCE || msg2.type==this.CHAT_MSG_DONATE || msg2.type==this.CHAT_MSG_DONATE_TO_SELF) &&
		msg1.userId==msg2.userId
	)
	{
		return 1;
	}
//	if(msg1.id==msg2.id)return 1;
	return 0;
};
}