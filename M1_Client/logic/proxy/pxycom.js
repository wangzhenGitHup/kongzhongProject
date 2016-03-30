if(!window.pxyCommand)
{
	window.pxyCommand={
		king:null,
		city:null,
		init:function(king,city)
		{
			this.king=king;
			this.city=city;
			this.curMsgType=-1;
			this.res2SvrRes={"Res_Gold":"Gold","Res_Oil":"Elixir",Res_Cube:"Cube","ResGold":"Gold","ResOil":"Elixir",ResCube:"Cube",cash:"tok1",cashNum:"tok1",Gem:"Gem",TH:"TH",CubeCard:"CubeCard"};
			//---------C2S------------------------
			this.C2S_LOGIN=1;
			this.C2SType=10000;
			this.C2S_AddDebugTime=this.C2SType+0;												 //C2S_Modify_DebugTime
			this.C2S_NewBuilding=this.C2SType+1;                         //C2S_Building_Create
			this.C2S_Upgrade=this.C2S_NewBuilding+1;                     //C2S_Building_Upgrade
			this.C2S_AbortConstruct=this.C2S_Upgrade+1;                  //C2S_Building_Create_Upgrade_Cancel
			this.C2S_ConstructDone=this.C2S_AbortConstruct+1;            //C2S_Building_Complete
			this.C2S_GemConstructDone=this.C2S_ConstructDone+1;     		 //C2S_Building_Complete_Gem
			this.C2S_MovePos=this.C2S_GemConstructDone+1;           		 //C2S_Building_Move
			this.C2S_Building_Sell=this.C2S_MovePos+1;                   //C2S_Building_Sell

			this.C2S_Harvest=this.C2S_Building_Sell+1;                   //C2S_Collect_Resource
			this.C2S_AddBuff=this.C2S_Harvest+1;          							 //C2S_Boost_Product_Resource

			this.C2S_NewMfc=this.C2S_AddBuff+1;           							 //C2S_Train_Unit
			this.C2S_AbortMfc=this.C2S_NewMfc+1;                         //C2S_Train_Unit_Cancel
			this.C2S_MfcDone=this.C2S_AbortMfc+1;                        //C2S_Train_Complete
			this.C2S_GemMfcDone=this.C2S_MfcDone+1;              				 //C2S_Train_Complete_Gem
			this.C2S_AddBuffTrain=this.C2S_GemMfcDone+1;     				 		 //C2S_Boost_Train_Unit

			this.C2S_NewCase=this.C2S_AddBuffTrain+1;               		 //C2S_Upgrade_Unit
			this.C2S_CaseDone=this.C2S_NewCase+1;                        //C2S_Upgrade_Unit_Complete
			this.C2S_GemCaseDone=this.C2S_CaseDone+1;      							 //C2S_Upgrade_Unit_Complete_Gem

			this.C2S_GemTrade=this.C2S_GemCaseDone+1;										//C2S_Gem_Buy_Res

			this.C2S_Building_Decos=this.C2S_GemTrade+1;								//C2S_Building_Decos
			this.C2S_Building_Decos_Sell=this.C2S_Building_Decos+1;			//C2S_Building_Decos_Sell

			this.C2S_Remove=this.C2S_Building_Decos_Sell+1;							//C2S_Obstacle_Remove
			this.C2S_RemoveDone=this.C2S_Remove+1;  										//C2S_Obstacle_Complete

			this.C2S_GetAvhmntBonus=this.C2S_RemoveDone+1;							//C2S_Achievement_Receive
			this.C2S_Building_Decos_Complete=this.C2S_GetAvhmntBonus+1; //C2S_Building_Decos_Complete
			this.C2S_Building_Decos_Move=this.C2S_Building_Decos_Complete+1;			//C2S_Building_Decos_Move
			this.C2S_GemRemoveDone=this.C2S_Building_Decos_Move+1;			//C2S_Obstacle_Gem_Complete
			this.C2S_AbortRemove=this.C2S_GemRemoveDone+1;							//C2S_Obstacle_Remove_Cancel

			this.C2S_BuyShield=this.C2S_AbortRemove+1;									//C2S_Gem_Buy_Shield

			this.C2S_Reload=this.C2S_BuyShield+1;												//C2S_Add_Ammo

			this.C2S_Search_opponents=this.C2SType+100;									//C2S_Search_opponents
			this.C2S_Revenge=this.C2S_Search_opponents+1;								//C2S_Revenge
			this.C2S_Battle_Log=this.C2S_Revenge+1;											//C2S_Battle_Log
			this.C2S_Return_Home=this.C2S_Battle_Log+1;									//C2S_Return_Home
			this.C2S_Replay=this.C2S_Return_Home+1;											//C2S_Replay
			this.C2S_PVE_InitUnit=this.C2S_Replay+1;										//C2S_PVE_InitUnit
			this.C2S_PVE_Result=this.C2S_PVE_InitUnit+1;								//C2S_PVE_Result
			this.C2S_PVE2_Result=this.C2S_PVE_Result+1;									//C2S_PVE2_Result

			this.C2S_AddGemBuff=this.C2SType+108;											//C2S_Boost_Product_Gem
			this.C2S_CutConstructTime=this.C2S_AddGemBuff+1;					//C2S_Building_Complete_Time

			this.C2S_ProducePart=this.C2SType+110;										//C2S_MechFactory_Produce_Part
			this.C2S_ProducePartDone=this.C2S_ProducePart+1;					//C2S_MechFactory_Complete_Part
			this.C2S_GemProducePartDone=this.C2S_ProducePartDone+1;		//C2S_MethFactory_Complete_Part_Gem
			this.C2S_JointAddOn=this.C2S_GemProducePartDone+1;				//C2S_MechFactory_Produce_Plug
			this.C2S_AbortPart=this.C2S_JointAddOn+1;									//C2S_MechFactory_Cancel_Part
			this.C2S_RemovePart=this.C2S_AbortPart+1;									//C2S_MethFactory_Recover

			this.C2S_NewMac=this.C2S_RemovePart+1;										//C2S_Hanger_Install
			this.C2S_DismissMac=this.C2S_NewMac+1;										//C2S_Hanger_Dismantle
			this.C2S_RepairMac=this.C2S_DismissMac+1;									//C2S_Hanger_Repair
			this.C2S_FixDone=this.C2S_RepairMac+1;										//C2S_Hanger_Repair_Complete
			this.C2S_GemFixDone=this.C2S_FixDone+1;										//C2S_Hanger_Repair_Complete_Gem
			this.C2S_StatusMac=this.C2S_GemFixDone+1;									//C2S_Hanger_Mech_Status
			this.C2S_ChangeMac=this.C2S_StatusMac+1;									//C2S_Hanger_Equip_Modify

			this.C2S_BuyAddOn=this.C2S_ChangeMac+1;									  //C2S_MechFactory_Buy
			this.C2S_EnhancePart=this.C2S_BuyAddOn+1;									//C2S_MechFactory_Strengthen

			this.C2S_GemBuyTokens=this.C2S_EnhancePart+1;             //C2S_Gem_Buy_Tokens
			this.C2S_GetBtReward=this.C2S_GemBuyTokens+1;							//C2S_Get_Reward_Gem
			this.C2S_GetBoxReward=this.C2S_GetBtReward+1;							//C2S_Get_BOX_GEM
			this.C2S_CommitBoxReward=this.C2S_GetBoxReward+1;					//

			this.C2S_CutConstructTimeByGem=this.C2SType+129;					//C2S_Building_Time_Button

			this.C2S_MacDefense_init=this.C2SType+130;						    //C2S_Wave_Battle_Init
			this.C2S_MacDefense_Log=this.C2S_MacDefense_init+1;		    //C2S_Wave_Battle_Log
			this.C2S_MacDefense_UseSkill=this.C2S_MacDefense_Log+1;		//C2S_Wave_Battle_Use_Magic
			this.C2S_MacDefense_GoHome=this.C2S_MacDefense_UseSkill+1;//C2S_Wave_Battle_Return_Home
			this.C2S_BattleEnemy=this.C2S_MacDefense_GoHome+1;				//C2S_Battle_Enemy
			this.C2S_RecoveryEnemy=this.C2S_BattleEnemy+1;				    //C2S_Instant_Recovery
			this.C2S_AddEnemy=this.C2S_RecoveryEnemy+1;			          //C2S_Add_Enemy
			this.C2S_UnlockEnemySlot=this.C2S_AddEnemy+1;			        //C2S_Unlock_Enemy_List

			this.C2S_FortAddUnit=this.C2SType+140;                    //C2S_Building_Fort_Add_Unit
			this.C2S_ObsOpenBox=this.C2S_FortAddUnit+1;               //C2S_Obstacle_Open_Box
			this.C2S_ResetTraps=this.C2S_ObsOpenBox+1;                //C2S_Building_Repair_Traps

			this.C2S_ClanCreate=this.C2SType+200;											//C2S_Clan_Create
			this.C2S_LoginClan=this.C2S_ClanCreate+1;									//C2S_Login_Clan
			this.C2S_ClanWords=this.C2S_LoginClan+1;									//C2S_Clan_Words
			this.C2S_ClanReinforce=this.C2S_ClanWords+1;							//C2S_Clan_Reinforce
			this.C2S_ClanDonate=this.C2S_ClanReinforce+1;							//C2S_Clan_Donate
			this.C2S_ClanJoin=this.C2S_ClanDonate+1;									//C2S_Clan_Join
			this.C2S_ClanLeave=this.C2S_ClanJoin+1;										//C2S_Clan_Leave
			this.C2S_ClanKick=this.C2S_ClanLeave+1;										//C2S_Clan_Kick
			this.C2S_ClanAppoint=this.C2S_ClanKick+1;									//C2S_Clan_Appoint
			this.C2S_ClanEdit=this.C2S_ClanAppoint+1;									//C2S_Clan_Edit
			this.C2S_CollectGem=this.C2S_ClanEdit+1;									//C2S_Collect_Gem
			this.C2S_SwitchMode=this.C2S_CollectGem+1;								//C2S_RGunTower_Attack_Type
			this.C2S_DonateSelf2Self=this.C2S_SwitchMode+1;						//C2S_Clan_Donate_Self2Self
			this.C2S_GiftUses=this.C2SType+213;		                    //C2S_Gift_Uses

			this.C2S_GemFinReinforce=this.C2SType+220;                //C2S_Clan_Reinforce_Time_Gem
			this.C2S_ClanJoin4Approval=this.C2SType+221;		          //C2S_Clan_Join_Result
			this.C2S_ClanDonatePoints=this.C2S_ClanJoin4Approval+1;		//C2S_Clan_Donate_Get_Points
			this.C2S_ClanSignIn=this.C2S_ClanDonatePoints+1;		      //C2S_Clan_Sign_In
			this.C2S_ClanUpgrade=this.C2S_ClanSignIn+1;		       			//Clan_Upgrade
			this.C2S_ClanAllotRes=this.C2S_ClanUpgrade+1;		       		//C2S_Clan_Allot_Res
			this.C2S_ClanCallOn=this.C2S_ClanAllotRes+1;		       		//C2S_Clan_Call_On
			this.C2S_ClanRespondCall=this.C2S_ClanCallOn+1;		       	//C2S_Clan_Respond_Call
			this.C2S_ClanDeclareWar=this.C2S_ClanRespondCall+1;		    //C2S_Clan_Declare_War
			this.C2S_ClanCallGem=this.C2S_ClanDeclareWar+1;		        //C2S_Clan_Call_Gem

			this.C2S_PackageOpenBox = this.C2SType + 230;             //C2S_Package_Open_Box 背包-开宝箱
			this.C2S_ShopSpecialMall = this.C2S_PackageOpenBox+1;     //C2S_ShopSpecial_Mall 特殊商店-购买物品


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

			this.S2STypeBase=30000;
			this.C2S_ClanCupStatus=this.S2STypeBase+12;          //S2S_GAME_CLANCUP_STATUS
			//---------Inner------------------------
			this.InnerTypeBase=40000;
			this.C2S_GameShareBattle=this.InnerTypeBase+1;//INNER_GAME_SHARE_BATTLE_REPORT

		},
		//将AIS的消息VO转换为服务器的消息字符串
		convert:function(msgVO)
		{
			var msgBuf,bodyBuf,func,instanceId;

			msgVO.com=this.convertCom(msgVO);
			if(!msgVO.com)return null;

			msgBuf=[window.USERID,this["C2S_"+msgVO.com]];
			this.curMsgType=this["C2S_"+msgVO.com];
			bodyBuf=[];
			func=this["comFunc_"+msgVO.com];
			if(func)
			{
				var bldHash,bld;
				if(msgVO.com=="NewBuilding" || msgVO.com=="Building_Decos")
				{
					bldHash=msgVO.comVO.newBldHashId;
					bld=this.king.getHashObj(bldHash);
					instanceId=bld.hashId;
				}else if(msgVO.com=="AbortConstruct" || msgVO.com=="AbortRemove" || msgVO.com=="Remove" || msgVO.com=="Building_Sell" || msgVO.com=="Building_Decos_Sell" || msgVO.com=="RemoveDone" || msgVO.com=="GemRemoveDone" || msgVO.com=="ObsOpenBox"){
					bld=msgVO.comObj;
					instanceId=msgVO.comVO.hashId;
				}else if(this.curMsgType>=this.C2S_ClanCreate && this.curMsgType<this.C2S_ClanEdit+1 || this.curMsgType>=this.C2S_ClanJoin4Approval && this.curMsgType<this.C2S_ClanCallGem+1){
					bld=this.king.getHashObj("Obj0");
					instanceId=bld.hashId;
				}else{
					bld=msgVO.comObj;
					instanceId=bld.hashId;
				}
				//msgBuf.push(this["C2S"+msgVO.com]);//MsgId
				//msgBuf.push("");//GroupId
				//msgBuf.push(bld.hashId);//BldId
				//msgBuf.push(msgVO.time);//MessageTime
				func.call(this,msgVO,bodyBuf);

				if(msgVO.com=="AddDebugTime" || msgVO.com=="GemTrade" ||msgVO.com=="GetAvhmntBonus" || msgVO.com=="BuyShield" || msgVO.com=="GemBuyTokens")
					msgBuf.push.apply(msgBuf,[0,0,msgVO.time,bodyBuf.length]);
				else if(msgVO.com=="Search_opponents" || msgVO.com=="PVE_InitUnit"|| msgVO.com=="Revenge" || msgVO.com=="GiftUses" || msgVO.com=="MacDefense_init" || msgVO.com=="BattleEnemy" || msgVO.com=="AddEnemy" || msgVO.com=="UnlockEnemySlot" || msgVO.com=="ShopSpecialMall" || msgVO.com=="PackageOpenBox")
					msgBuf.push.apply(msgBuf,["TownHall",0,msgVO.time,bodyBuf.length]);
				else if(msgVO.com=="GameShareBattle")
					msgBuf.push.apply(msgBuf,["ClanBld",0,msgVO.time,bodyBuf.length]);
				else
					msgBuf.push.apply(msgBuf,[bld.def.groupId,parseInt(instanceId.substring(3),10),msgVO.time,bodyBuf.length]);

				msgBuf.push.apply(msgBuf,bodyBuf);
			}
			else
			{
				DBOut("Can't find converter: "+msgVO.com);
				return null;
			}
			//return {userId:window.USERID,messageType:this["C2S_"+msgVO.com],groupId:bld.def.groupId,instanceId:parseInt(instanceId.substring(3),10),messageTime:msgVO.time,bodyNum:msgBuf.length,body:msgBuf};
			return msgBuf.join("!#");
		},
		convertCom:function(msgVO)
		{
			var bld,group,com=msgVO.com;
			if(com=="NewBuilding")
			{
				bldHash=msgVO.comVO.newBldHashId;
				bld=this.king.getHashObj(bldHash);
				group=bld.def.groupId;
				if(group=="Decorate")
					com="Building_Decos";
			}else{
				bld=msgVO.comObj;
				if(bld.def)
					group=bld.def.groupId;
			 	if(com=="ConstructDone"){
					if(group=="Decorate")
						com="Building_Decos_Complete";
				}else if(com=="Remove"){
					if(group=="Decorate")
						com="Building_Decos_Sell";
					else if(group=="Traps")
						com="Building_Sell";
				}else if(com=="RemoveDone"){
					if(group=="Decorate")
						com="";
					else if(group=="Traps")
						com="";
				}else if(com=="MovePos"){
					if(group=="Decorate")
						com="Building_Decos_Move";
				}else if(com=="AbortConstruct"){
					if(group=="Obstacle")
						com="AbortRemove";
				}else if(com=="RemoveAll"){
					com="RemoveDone";
				}else if(com=="Harvest"){
					if(group=="DiamondMine")
						com="CollectGem";
				}else if(com=="AddBuff"){
					if(group=="DiamondMine")
						com="AddGemBuff";
				}else if(com=="NewMfc"){
					if(group=="MechFactory")
						com="ProducePart";
						//com="";
				}else if(com=="MfcDone"){
					if(group=="MechFactory")
						com="ProducePartDone";
						//com="";
				}else if(com=="GemMfcDone"){
					if(group=="MechFactory")
						com="GemProducePartDone";
						//com="";
				}else if(com=="AbortMfc"){
					if(group=="MechFactory")
						com="AbortPart";
						//com="";
				}else if(com=="FortAddUnit"){
					if(group=="ClanBld")
						com="DonateSelf2Self";
				}
			}
			return com;
		},
		getMsgType:function()
		{
			return this.curMsgType;
		}
	}
	//-------------------------------------------------------------------------

		//转换AddDebugTime
		window.pxyCommand.comFunc_AddDebugTime=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.time);//time
		};
	//建筑建造相关:
	{
		//-------------------------------------------------------------------------
		//转换NewBuilding
		window.pxyCommand.comFunc_NewBuilding=function(msgVO,msgBuf)
		{
			var bldHash,bld,hut,comVO;
			comVO=msgVO.comVO;
			bldHash=msgVO.comVO.newBldHashId;
			bld=this.king.getHashObj(bldHash);

			msgBuf.push(bld.def.svrCodeName);//CodeName
			msgBuf.push(bld.hashId.substring(3));//BldId
			msgBuf.push("1");//TaskId
			hut=(comVO.wokerId)?comVO.wokerId.substring(3):-1;
			msgBuf.push(hut);//builderInstanceId
			msgBuf.push(""+(bld.pos[0]));//X
			msgBuf.push(""+(bld.pos[1]));//Y
			msgBuf.push(""+comVO.giftId);//giftId
		};

		window.pxyCommand.comFunc_Building_Decos=function(msgVO,msgBuf)
		{
			var bldHash,bld,hut,comVO;
			comVO=msgVO.comVO;
			bldHash=msgVO.comVO.newBldHashId;
			bld=this.king.getHashObj(bldHash);

			msgBuf.push(bld.def.svrCodeName);//CodeName
			msgBuf.push(bld.hashId.substring(3));//BldId
			msgBuf.push(""+(bld.pos[0]));//X
			msgBuf.push(""+(bld.pos[1]));//Y
			msgBuf.push(""+comVO.giftId);//giftId
		};

		//-------------------------------------------------------------------------
		//转换Upgrade
		window.pxyCommand.comFunc_Upgrade=function(msgVO,msgBuf)
		{
			var bld,hut,comVO;
			comVO=msgVO.comVO;
			bld=msgVO.comObj;

			msgBuf.push("1");//TaskId
			hut=(comVO.wokerId)?comVO.wokerId.substring(3):-1;
			msgBuf.push(hut);//builderInstanceId
			msgBuf.push(""+(comVO.level+1));//builderInstanceId
		};

		//-------------------------------------------------------------------------
		//转换AbortConstruct
		window.pxyCommand.comFunc_AbortConstruct=
		window.pxyCommand.comFunc_AbortRemove=function(msgVO,msgBuf)
		{
			var bld,worker,hut;
			bld=msgVO.comObj;
			msgBuf.push(msgVO.comVO.hashId.substring(3));//BldId
			msgBuf.push("1");//TaskId
		};

		//-------------------------------------------------------------------------
		//转换ConstructDone
		window.pxyCommand.comFunc_ConstructDone=
		window.pxyCommand.comFunc_Building_Decos_Complete=function(msgVO,msgBuf)
		{
			var bld,worker,hut;
			bld=msgVO.comObj;

			msgBuf.push(bld.hashId.substring(3));//BldId
			msgBuf.push("1");//TaskId
		};

		//-------------------------------------------------------------------------
		//转换GemConstructDone
		window.pxyCommand.comFunc_GemConstructDone=function(msgVO,msgBuf)
		{
			var bld,comVO,hut;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(bld.hashId.substring(3));//BldId
			msgBuf.push("1");//TaskId
			msgBuf.push(comVO.gemNum);//costGem
		};

		//-------------------------------------------------------------------------
		//转换MovePos
		window.pxyCommand.comFunc_MovePos=
		window.pxyCommand.comFunc_Building_Decos_Move=function(msgVO,msgBuf)
		{
			var bld,worker,hut;
			bld=msgVO.comObj;

			msgBuf.push(bld.pos[0]);//x
			msgBuf.push(bld.pos[1]);//y
		};

		//-------------------------------------------------------------------------
		//转换Remove
		window.pxyCommand.comFunc_Remove=function(msgVO,msgBuf)
		{
			var bld,worker,comVO,hut;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.hashId.substring(3));//BldId
			hut=(comVO.wokerId)?comVO.wokerId.substring(3):-1;
			msgBuf.push(hut);
			msgBuf.push(1);

		};

		window.pxyCommand.comFunc_Building_Decos_Sell=
		window.pxyCommand.comFunc_Building_Sell=function(msgVO,msgBuf)
		{
			var bld,worker,comVO,hut,cost;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.hashId.substring(3));//BldId
			cost=comVO.removeResult;
			if(cost)
			{
				if(cost.gem)
				{
					msgBuf.push("Gem");
					msgBuf.push(cost.gem);
				}
				else if(cost.cash)
				{
					msgBuf.push("tok1");
					msgBuf.push(cost.cash);
				}
				if(cost.storage)
				{
					var cstore=cost.storage;
					var n=cstore.length;
					for(var i=0;i<n;i++)
					{
						var item=cstore[i];
						msgBuf.push(this.res2SvrRes[item.type]);
						msgBuf.push(item.num);
					}
				}
			}else{
				msgBuf.push("");
				msgBuf.push(0);
			}
		};

		window.pxyCommand.comFunc_RemoveDone=function(msgVO,msgBuf)
		{
			var bld,worker,hut;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.hashId.substring(3));//BldId
			msgBuf.push(1);//tskId
		};

		//-------------------------------------------------------------------------
		//转换GemRemoveDone
		window.pxyCommand.comFunc_GemRemoveDone=function(msgVO,msgBuf)
		{
			var bld,worker,hut;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.hashId.substring(3));//BldId
			msgBuf.push(1);//tskId
			msgBuf.push(comVO.gemNum);
		};


		//-------------------------------------------------------------------------
		//转换CollectGem
		window.pxyCommand.comFunc_CollectGem=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(bld.hashId.substring(3));//TaskId
			//msgBuf.push("");//resType
			msgBuf.push(comVO.harvestNum);//resNum
		};

		//-------------------------------------------------------------------------
		//转换Harvest
		window.pxyCommand.comFunc_Harvest=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(bld.hashId.substring(3));//TaskId
			//msgBuf.push("");//resType
			msgBuf.push(comVO.harvestNum);//resNum
			msgBuf.push(comVO.critRate?1:0);//critRate
		};

		//-------------------------------------------------------------------------
		//转换AddBuff
		window.pxyCommand.comFunc_AddGemBuff=
		window.pxyCommand.comFunc_AddBuff=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(bld.hashId.substring(3));//TaskId
			msgBuf.push(bld.hashId.substring(3));//BuffId
			msgBuf.push(comVO.gemNum);//CostGem
		};


		//-------------------------------------------------------------------------
		//转换NewMfc
		window.pxyCommand.comFunc_NewMfc=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.slotIdx);//TaskId
			msgBuf.push(comVO.svrCodeName);//unitType
			msgBuf.push(comVO.num);//trainNum
		};

		//-------------------------------------------------------------------------
		//转换AbortMfc
		window.pxyCommand.comFunc_AbortMfc=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.slotIdx);//TaskId
			msgBuf.push(comVO.svrCodeName);//unitType
			msgBuf.push(comVO.num);//unitNum
			//msgBuf.push("");//rewardResType
			//msgBuf.push("");//rewardResNum
		};

		//-------------------------------------------------------------------------
		//转换MfcDone
		window.pxyCommand.comFunc_ProducePartDone=
		window.pxyCommand.comFunc_MfcDone=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.slotIdx);//TaskId
			msgBuf.push(comVO.svrCodeName);//unitType

		};

		//-------------------------------------------------------------------------
		//转换GemMfcDone
		window.pxyCommand.comFunc_GemProducePartDone=
		window.pxyCommand.comFunc_GemMfcDone=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.gemNum);//CostGem

		};

		//-------------------------------------------------------------------------
		//转换AddBuffTrain
		window.pxyCommand.comFunc_AddBuffTrain=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(bld.hashId.substring(3));//BuffId
			msgBuf.push(comVO.gemNum);//CostGem
		};


		//-------------------------------------------------------------------------
		//转换NewCase
		window.pxyCommand.comFunc_NewCase=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push("1");//TaskId
			msgBuf.push(comVO.unitSvrCodeName);//unitType
			msgBuf.push(comVO.techLevel);//targetLevel
		};

		//-------------------------------------------------------------------------
		//转换CaseDone
		window.pxyCommand.comFunc_CaseDone=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push("1");//TaskId
		};

		//-------------------------------------------------------------------------
		//转换GemCaseDone
		window.pxyCommand.comFunc_GemCaseDone=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push("1");//TaskId
			msgBuf.push(comVO.gemNum);//CostGem
		};

		//-------------------------------------------------------------------------
		//转换GemTrade
		window.pxyCommand.comFunc_GemBuyTokens=
		window.pxyCommand.comFunc_GemTrade=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(this.res2SvrRes[comVO.codeName]);//rewardResCodename
			msgBuf.push(comVO.num);//rewardResNum
			msgBuf.push(comVO.gem);//CostGem
			msgBuf.push(comVO.vip?1:0);//CostGem
		};

		//-------------------------------------------------------------------------
		//转换GetBoxReward
		window.pxyCommand.comFunc_GetBoxReward=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.boxId);//boxid
			msgBuf.push(comVO.isFree);//isFree
			if(comVO.isFree && comVO.cost)
			{
				var i,n,k,cost,type;
				cost=comVO.cost.storage;
				n=cost.length;
				k=n;
				if(comVO.cost.cash)k++;
				if(comVO.cost.gem)k++;
				//msgBuf.push(k);//reqNum
				if(comVO.cost.cash)
				{
					type=this.res2SvrRes["cash"];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(comVO.cost.cash);//resNum/
					}
				}
				if(comVO.cost.gem)
				{
					type=this.res2SvrRes["Gem"];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(comVO.cost.gem);//resNum/
					}
				}
				for(i=0;i<n;i++)
				{
					type=this.res2SvrRes[cost[i].type];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(cost[i].num);//resNum/
					}else{
						msgBuf.push(cost[i].type);//type
						msgBuf.push(cost[i].num);//resNum/
					}
				}
			}
			msgBuf.push(comVO.messageSign);//messageSign
		};


		//-------------------------------------------------------------------------
		//转换GetAvhmntBonus
		window.pxyCommand.comFunc_GetAvhmntBonus=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.codeName);//rewardResCodename
		};

		//-------------------------------------------------------------------------
		//转换BuyShield
		window.pxyCommand.comFunc_BuyShield=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(1);//buffInstanceId
			msgBuf.push(comVO.codeName);//codeName
		};

		//-------------------------------------------------------------------------
		//转换Reload
		window.pxyCommand.comFunc_Reload=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(bld.hashId.substring(3));//hashId
			msgBuf.push(this.res2SvrRes[comVO.resType]);//resType
			msgBuf.push(comVO.resNum);//resNum
		};
		//转换SwitchMode
		window.pxyCommand.comFunc_SwitchMode=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(bld.hashId.substring(3));//hashId
			msgBuf.push(comVO.fireMode);//fireMode
		};

		window.pxyCommand.comFunc_Search_opponents=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.userId);//userId
		};

		window.pxyCommand.comFunc_Revenge=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.userId);//userId
			msgBuf.push(comVO.forceFlag);//强制攻击标识 0：非  1：是
			msgBuf.push(comVO.gemNum);//强制攻击消耗钻石数

		};

		window.pxyCommand.comFunc_PVE_InitUnit=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.stageId);//stageId
		};
		//-----------------------Clan-----------------------------------------
		//联盟-建盟
		window.pxyCommand.comFunc_ClanCreate=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.clanName);//clanName
			msgBuf.push(comVO.flag);//flag
			msgBuf.push(comVO.description);//description
			msgBuf.push(comVO.clanType);//clanType
			msgBuf.push(comVO.honorScore);//honorScore
		};
		//联盟-客户端登录联盟服务器
		window.pxyCommand.comFunc_LoginClan=function(msgVO,msgBuf)
		{

		};
		//联盟-聊天信息
		window.pxyCommand.comFunc_ClanWords=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.words);//words
		};
		//联盟-增援申请
		window.pxyCommand.comFunc_ClanReinforce=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.words);//words
		};
		//联盟-捐赠
		window.pxyCommand.comFunc_ClanDonate=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.reinforceMsgId);//reinforceMsgId
			msgBuf.push(comVO.unitCodename);//unitCodename
		};
		//联盟-加入
		window.pxyCommand.comFunc_ClanJoin=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.clanId);//clanId
		};
		//联盟-加入审批
		window.pxyCommand.comFunc_ClanJoin4Approval=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.clanId);//clanId
			msgBuf.push(comVO.result);//result0：拒绝	1：同意
			msgBuf.push(comVO.msgId);//msgId
		};
		//联盟-离开
		window.pxyCommand.comFunc_ClanLeave=function(msgVO,msgBuf)
		{

		};
		//联盟-踢人
		window.pxyCommand.comFunc_ClanKick=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.kickedUserId);//kickedUserId
		};
		//委任
		window.pxyCommand.comFunc_ClanAppoint=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.userId);//userId
			msgBuf.push(comVO.job);//job
		};
		//联盟-编辑盟
		window.pxyCommand.comFunc_ClanEdit=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.flag);//flag
			msgBuf.push(comVO.description);//description
			msgBuf.push(comVO.clanType);//clanType
			msgBuf.push(comVO.honorScore);//honorScore
		};
		//联盟-捐赠联盟点
		window.pxyCommand.comFunc_ClanDonatePoints=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.type);//type 0:free 1:pay
		};
		//联盟-签到
		//联盟-升级
		window.pxyCommand.comFunc_ClanSignIn=
		window.pxyCommand.comFunc_ClanUpgrade=function(msgVO,msgBuf)
		{

		};
		//联盟-联盟分配资源
		window.pxyCommand.comFunc_ClanAllotRes=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.receiveUid);//receiveUid
			msgBuf.push(comVO.resType);//resType
			msgBuf.push(comVO.resNum);//resNum
		};
		//联盟-号召联盟科技
		window.pxyCommand.comFunc_ClanCallOn=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.codeName);//codeName
			msgBuf.push(comVO.techLevel);//techLevel
		};
		//联盟-响应号召联盟科技
		window.pxyCommand.comFunc_ClanRespondCall=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.codeName);//codeName
			msgBuf.push(comVO.techLevel);//techLevel
		};
		//联盟-领土争夺宣战
		window.pxyCommand.comFunc_ClanDeclareWar=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.codeName);//codeName
		};
		//联盟-钻秒联盟科技
		window.pxyCommand.comFunc_ClanCallGem=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.codeName);//codeName
			msgBuf.push(comVO.techLevel);//techLevel
			msgBuf.push(comVO.gem);//gem
		};

		window.pxyCommand.comFunc_GiftUses=function(msgVO,msgBuf)
		{
			var comVO;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.giftId);//giftId
		};

		//-------------------------------------------------------------------------
		//转换ProducePart
		window.pxyCommand.comFunc_ProducePart=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.slotIdx);//TaskId
			msgBuf.push(comVO.slotIdx);//partInstanceId
			msgBuf.push(comVO.svrCodeName);//unitType
			if(comVO.cost)
			{
				var i,n,k,cost,type;
				cost=comVO.cost.storage;
				n=cost.length;
				k=n;
				if(comVO.cost.cash)k++;
				if(comVO.cost.gem)k++;
				msgBuf.push(k);//reqNum
				if(comVO.cost.cash)
				{
					type=this.res2SvrRes["cash"];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(comVO.cost.cash);//resNum/consumPartInstance
					}
				}
				if(comVO.cost.gem)
				{
					type=this.res2SvrRes["Gem"];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(comVO.cost.gem);//resNum/consumPartInstance
					}
				}
				for(i=0;i<n;i++)
				{
					type=this.res2SvrRes[cost[i].type];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(cost[i].num);//resNum/consumPartInstance
					}else{
						msgBuf.push(cost[i].type);//type
						msgBuf.push(cost[i].num);//resNum/consumPartInstance					}
					}
				}
			}else
				msgBuf.push(0);//reqNum
		};

		//-------------------------------------------------------------------------
		//转换AbortPart
		window.pxyCommand.comFunc_AbortPart=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.slotIdx);//TaskId
			msgBuf.push(comVO.svrCodeName);//unitType
		};

		//-------------------------------------------------------------------------
		//转换BuyAddOn
		window.pxyCommand.comFunc_BuyAddOn=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(1);//type addon num
			msgBuf.push(comVO.codeName);//codeName
			msgBuf.push(comVO.num);//num
			DBOut("+++ BuyAddOn comVO.cost="+toJSON(comVO.cost));
			if(comVO.cost)
			{
				var i,n,k,cost,type;
				cost=comVO.cost.storage;
				n=cost.length;
				k=n;
				if(comVO.cost.cash)k++;
				if(comVO.cost.gem)k++;
				msgBuf.push(k);//reqNum
				if(comVO.cost.cash)
				{
					type=this.res2SvrRes["cash"];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(comVO.cost.cash*comVO.num);//resNum/consumPartInstance
					}
				}
				if(comVO.cost.gem)
				{
					type=this.res2SvrRes["Gem"];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(comVO.cost.gem*comVO.num);//resNum/consumPartInstance
					}
				}
				for(i=0;i<n;i++)
				{
					type=this.res2SvrRes[cost[i].type];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(cost[i].num*comVO.num);//resNum/consumPartInstance
					}else{
						msgBuf.push(cost[i].type);//type
						msgBuf.push(cost[i].num*comVO.num);//resNum/consumPartInstance					}
					}
				}
			}else
				msgBuf.push(0);//reqNum
		};

		//-------------------------------------------------------------------------
		//转换RemovePart
		window.pxyCommand.comFunc_RemovePart=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.subType);//partInstanceId
		};

		//-------------------------------------------------------------------------
		//转换NewMac
		window.pxyCommand.comFunc_NewMac=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.body.subType);//body
			msgBuf.push(comVO.leg.subType);//leg
			msgBuf.push(comVO.addOn?comVO.addOn:"-1");//num
		};

		//-------------------------------------------------------------------------
		//转换DismissMac
		window.pxyCommand.comFunc_DismissMac=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
		};

		//-------------------------------------------------------------------------
		//转换FixDone
		window.pxyCommand.comFunc_FixDone=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.taskHashId.substring(3));//taskid
		};

		//-------------------------------------------------------------------------
		//转换GemFixDone
		window.pxyCommand.comFunc_GemFixDone=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.taskHashId.substring(3));//taskid
			msgBuf.push(comVO.gemNum);//gemNum
		};

		//-------------------------------------------------------------------------
		//转换StatusMac
		window.pxyCommand.comFunc_StatusMac=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.state);//status
		};

		//-------------------------------------------------------------------------
		//转换EnhancePart
		window.pxyCommand.comFunc_EnhancePart=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.subType);//instanceId
			msgBuf.push(comVO.level);//instanceId
			if(comVO.cost)
			{
				var i,n,k,cost,type;
				cost=comVO.cost.storage;
				n=cost.length;
				k=n;
				if(comVO.cost.cash)k++;
				if(comVO.cost.gem)k++;
				msgBuf.push(k);//reqNum
				if(comVO.cost.cash)
				{
					type=this.res2SvrRes["cash"];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(comVO.cost.cash);//resNum/consumPartInstance
					}
				}
				if(comVO.cost.gem)
				{
					type=this.res2SvrRes["Gem"];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(comVO.cost.gem);//resNum/consumPartInstance
					}
				}
				for(i=0;i<n;i++)
				{
					type=this.res2SvrRes[cost[i].type];
					if(type)
					{
						msgBuf.push(type);//type
						msgBuf.push(cost[i].num);//resNum/consumPartInstance
					}else{
						msgBuf.push(cost[i].type);//type
						msgBuf.push(cost[i].num);//resNum/consumPartInstance					}
					}
				}
			}else
				msgBuf.push(0);//reqNum
		};

		//-------------------------------------------------------------------------
		//转换JointAddOn
		window.pxyCommand.comFunc_JointAddOn=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.mainCodeName);//主副件codename
			msgBuf.push(comVO.subCodeName);//辅副件codename
			if(comVO.specialCodeName)
				msgBuf.push(comVO.specialCodeName);//特殊附件codename，合成专用，提升合成概率
		};

		//-------------------------------------------------------------------------
		//转换ChangeMac
		window.pxyCommand.comFunc_ChangeMac=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.addOn.type?comVO.addOn.type:"null");//副件codename
			msgBuf.push(comVO.addOn.type?1:0);//num

		};

		//-------------------------------------------------------------------------
		//转换CutConstructTime
		window.pxyCommand.comFunc_CutConstructTime=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.hashId.substring(3));//hashId
			msgBuf.push("1");//taskInstanceId
			msgBuf.push(comVO.flag);//flag
			msgBuf.push(Math.floor(comVO.time/60000));//num

		};

		//-------------------------------------------------------------------------
		//转换CutConstructTimeByGem
		window.pxyCommand.comFunc_CutConstructTimeByGem=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;

			msgBuf.push(comVO.hashId.substring(3));//hashId
			msgBuf.push("1");//taskInstanceId
			msgBuf.push(comVO.flag);//flag
			msgBuf.push(Math.floor(comVO.time/60000));//num
			msgBuf.push(comVO.gem);//gem

		};

		//-------------------------------------------------------------------------
		//转换CommitBoxReward
		window.pxyCommand.comFunc_CommitBoxReward=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.resType);//resType
			msgBuf.push(comVO.resNum);//resNum
			msgBuf.push(comVO.messageSign);//messageSign
		};

		//-------------------------------------------------------------------------
		//转换MacDefense_init
		window.pxyCommand.comFunc_MacDefense_init=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.stageID);//stageID
		};

		//-------------------------------------------------------------------------
		//转换BattleEnemy
		window.pxyCommand.comFunc_BattleEnemy=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.pos);//pos
			msgBuf.push(comVO.gemNum);//gemNum
		};

		//-------------------------------------------------------------------------
		//转换AddEnemy
		window.pxyCommand.comFunc_AddEnemy=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.userId);//userId
			msgBuf.push(comVO.pos);//pos
		};

		//-------------------------------------------------------------------------
		//转换UnlockEnemySlot
		window.pxyCommand.comFunc_UnlockEnemySlot=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.gemNum);//gemNum
		};

		//-------------------------------------------------------------------------
		//转换FortAddUnit
		window.pxyCommand.comFunc_FortAddUnit=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(bld.hashId.substring(3));//BldId
			msgBuf.push(comVO.type);//unitType
		};
		//-------------------------------------------------------------------------
		//转换DonateSelf2Self
		window.pxyCommand.comFunc_DonateSelf2Self=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.type);//unitType
			msgBuf.push(comVO.gem);//gem
		};

		window.pxyCommand.comFunc_GameShareBattle=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.battleId);//battleId
			msgBuf.push(comVO.words);//words
		};

		window.pxyCommand.comFunc_ObsOpenBox=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.hashId.substring(3));//BldId
			msgBuf.push(comVO.gem);//gem
		};

		window.pxyCommand.comFunc_GemFinReinforce=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(bld.hashId.substring(3));//BldId
			msgBuf.push(comVO.gemNum);//gem
		};

		window.pxyCommand.comFunc_ResetTraps=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.repairType);//repairType 修理类型 0：单个修理	1：全部修理
			msgBuf.push(comVO.resNum);//resNum
			msgBuf.push(bld.hashId.substring(3));//BldId
		};

		window.pxyCommand.comFunc_PackageOpenBox=
		window.pxyCommand.comFunc_ShopSpecialMall=function(msgVO,msgBuf)
		{
			var bld,comVO;
			bld=msgVO.comObj;
			comVO=msgVO.comVO;
			msgBuf.push(comVO.itemId);//物品codename
		};

	}
}
