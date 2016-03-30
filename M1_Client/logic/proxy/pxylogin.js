if(!window.pxyLogin)
{
	window.pxyLogin={
		updateTime:0,
		bldHash:null,
		tombStoneHash:null,
		nextWorkerId:50,
		unit2tech:{
			//unit
			"UntMarine":"tchUnit1","UntSniper":"tchUnit2","UntHacker":"tchUnit3","UntCyber":"tchUnit4","UntTNTMac":"tchUnit5",
			"UntChop":"tchUnit6","UntTank":"tchUnit7","UntHealer":"tchUnit8","UntAvenger":"tchUnit9","UntPEKKA":"tchUnit10",
			"UntUAV":"tchUnit11","UntRider":"tchUnit12","UntGolem":"tchUnit13","UntDoctor":"tchUnit14",
			//spell
			"Lightning":"tchSpell1","Heal":"tchSpell2","VVirus":"tchSpell3","ZGravity":"tchSpell4","EMPSpell":"tchSpell5",
		},
		//将服务器的VO
		convert:function(svrVO)
		{
			var i,n,list,kingVO,cityVO;

			this.bldHash={};
			this.tombStoneHash=[];//存放墓碑
			this.crashedTrapsHash=[];//存放损坏的陷阱

			this.tokens={cash:0,cutTime:0};
			if(svrVO.tokens && svrVO.tokens.length)
			{
				for(i=0;i<svrVO.tokens.length;i++)
				{
					if(svrVO.tokens[i].type=="tok1")
						this.tokens.cash+=svrVO.tokens[i].num;
					else if(svrVO.tokens[i].type=="tok2")
						this.tokens.cutTime+=svrVO.tokens[i].num;
				}
			}
			//TODO:明确这个:
			this.updateTime=svrVO.loginTime;//+svrVO.debugTime
			this.vipLevel=this.initVIPLevel(svrVO.vipExp);
			kingVO=this.initBaseVO(svrVO);

			cityVO=this.initCityVO(svrVO);
			kingVO.citys.push(cityVO);

			kingVO.achvmnts=this.initAchvmnts(svrVO.achievements,aisEnv.defLib.achvmnt);
			kingVO.dailyTasks=this.initAchvmnts(svrVO.dailyTasks,aisEnv.defLib.dailytasks);

			this.initBlds(svrVO.instances,cityVO.buildings,cityVO,kingVO);

			cityVO.tombStoneHash=this.tombStoneHash;
			cityVO.crashedTrapsHash=this.crashedTrapsHash;

			this.addItemStorages(cityVO,svrVO);
			if(this.tokens.cash)
			{
				cityVO.storages["Cube"].slots.ResCube.num+=this.tokens.cash;
			}

			this.nextWorkerId=50;
			return kingVO;
		},
		//-------------------------------------------------------------------------
		//创建kingVO的框架, 不包括具体的建筑:
		initBaseVO:function(svrVO)
		{
			var kingVO,i,n,list,lv;

			list=aisEnv.defLib.achvmnt.EXPLevels;
			n=list.length;
			lv=0;
			for(i=0;i<n;i++)
			{
				if(svrVO.exp<list[i].exp)
				{
					lv=i+1;
					break;
				}
			}
			if(!lv)lv=n;
			if(window.aisGame && window.aisGame.env)
			{
				window.aisGame.env.svrTime=svrVO.loginTime-svrVO.debugTime;
			}
			kingVO={
				"hashId": "Obj100","createTime": svrVO.createTime, "name": svrVO.name, "gemNum": svrVO.gem, "cashNum": 0,expPoints:svrVO.exp,expLevel:lv,
				//这两个属性loginVO应该提供:
				"userName": "NewUser", "lastUpdate": this.updateTime,debugTime:svrVO.debugTime,
				"triggerTime": 0, "debugTimeGap": 0, "nextHashId":svrVO.maxInstanceId+1,
				"techs":{},"techCases":{},
				//城信息, 稍候填:
				citys:[],achvmnts:{},
				//下面这些应该没有用:
				"buffs": {}, "pushMsgs": [], "pushMsgIdx": 0, "vsbBlds": {}, "vsbTechs": {"tchSolar": 1}, "vsbMfcs": {}
			};
			return kingVO;
		},
		initAchvmnts:function(list,defLib)
		{
			var i,k,n,amt,def,lv,achvmntVO;
			if(!list)return {};
			n=list.length;

			achvmntVO={};
			for(i=0;i<n;i++)
			{
				amt=list[i];
				def=defLib[amt.codename];
				if(!def)continue;
				lv=-1;
				for(k=0;k<def.levels.length;k++)
				{
					if(amt.actionCount<def.levels[k].score)
					{
						lv=k;
						break;
					}
				}
				if(lv==-1)lv=def.levels.length;
				if((amt.codename=="chargemoney" || amt.codename=="bindemail")&& lv>0 && !amt.star)
				{
					amt.star=2;
				}
				achvmntVO[amt.codename]={codeName:amt.codename,level:lv,score:amt.actionCount,bonusRcved:amt.star};

			}
			return achvmntVO;
		},
		//-------------------------------------------------------------------------
		//vip等级初始化
		initVIPLevel:function(charge)
		{
			var i,n,list,lv;

			list=aisEnv.defLib.vipPrivilege.VIPLevels;
			n=list.length;
			lv=0;
			if(charge)
			{
				if(n)lv=-1;
				for(i=0;i<n;i++)
				{
					if(charge<list[i].charge)
					{
						lv=i-1;
						break;
					}
				}
				if(lv<0)lv=n-1;
			}
			return lv;
		},
		//-------------------------------------------------------------------------
		//创建cityVO:
		initCityVO:function(svrVO)
		{
			var cityVO;
			cityVO={
				"hashId": "Obj"+svrVO.instanceId, "createTime": svrVO.createTime, "name": svrVO.name,
				honor:svrVO.honor,raidedRecord:svrVO.raidedRecord,pveVOs:svrVO.pveVOs,allianceId:svrVO.allianceId,leaveAttacked:svrVO.leaveAttacked,
				gifts:svrVO.giftList,record:svrVO.record,cooldownTime:svrVO.cooldownTime,allianceFlag:svrVO.allianceFlag,allianceLevel:svrVO.allianceLevel,charge:svrVO.charge,vipLevel:this.vipLevel,
				resetDailyTasksTime:svrVO.resetDailyTasksTime,vipBuyGold:svrVO.vipBuyGold,vipBuyOil:svrVO.vipBuyOil,vipBuyCube:svrVO.vipBuyCube,vipExp:svrVO.vipExp,openBoxTimesDaily:svrVO.openBoxTimesDaily,
				monthCardVO:svrVO.monthCardVO,timeButtonCoolDown:svrVO.timeButtonCoolDown,enemys:svrVO.enemys,shieldTime:svrVO.shieldTime,nextDayZeroTime:svrVO.nextDayZeroTime,opFlags:svrVO.opFlags,
				times:svrVO.times,
				"buildings":[],
				"bldWorkers": [],
				"storages":{
					"Gold": {"createTime": svrVO.createTime, "slots": {"ResGold": {"type": "ResGold", "num": 0}}},
					"Oil": {"createTime": svrVO.createTime, "slots": {"ResOil": {"type": "ResOil", "num": 0}}},
					"Cube": {"createTime": svrVO.createTime, "slots": {"ResCube": {"type": "ResCube", "num": 0}}},
					"Unit": {"createTime": svrVO.createTime, "slots": {}},
					"Spell": {"createTime": svrVO.createTime, "slots": {}},
					"Clan": {"createTime": svrVO.createTime,"slots":{}},
					"Fort": {"createTime": svrVO.createTime,"slots":{}},
					"Part":{"createTime": svrVO.createTime,"slots":{}},
					"AddOn":{"createTime": svrVO.createTime,"slots":{}},
					"CutTime":{"createTime": svrVO.createTime,"slots":{"CutTime": {"type": "CutTime", "num": 0}}},
					"Item":{"createTime": svrVO.createTime, "slots": {}},
				},
				//下面这些应该没有用:
				"floors": [],"fleets": [],"events":[],"buffs":{},attackCost:0,
			};
			if(svrVO.pve2VO)
			{
				cityVO.pve2VO={stageId:svrVO.pve2VO.stageId,result:svrVO.pve2VO.result};
			}
			var i,svrBuff,buffname;
			if(svrVO.buffs && svrVO.buffs.length)
			{
				for(i=0;i<svrVO.buffs.length;i++)
				{
					svrBuff=svrVO.buffs[i];
					buffname=svrBuff.codename;
					cityVO.buffs[buffname]={"codeName":buffname,"startTime": svrBuff.startTime, "endTime": svrBuff.endTime};
					if(buffname=="MonthCard15")cityVO.buffs[buffname].endTime=this.updateTime+30*24*60*60*1000;
				}
			}

			if(this.vipLevel)
			{
				var def,defLib=window.aisEnv.defLib.vipPrivilege;
				var lv=this.vipLevel;
				var DAY2=(48*3600*1000);
				for(i in defLib)
				{
					def=defLib[i];
					if(def.type=="buff" && def.levels[lv].buff)
					{
						buffname=def.levels[lv].buff;
						cityVO.buffs[buffname]={"codeName":buffname,"startTime": this.updateTime, "endTime": this.updateTime+DAY2};
					}
				}
			}

			cityVO.storages["CutTime"].slots.CutTime.num+=this.tokens.cutTime;

			return cityVO;
		},
		//-------------------------------------------------------------------------
		//转换所有的建筑VO:
		initBlds:function(svrList,aisList,cityVO,kingVO)
		{
			var i,n,svrBld,aisBld,func,hut,worker,def;
			n=svrList.length;
			for(i=0;i<n;i++)
			{
				svrBld=svrList[i];
				func=this["bldFunc_"+svrBld.codename];
				if(func)
				{
					aisBld=func.call(this,svrBld,cityVO,kingVO);
					aisList.push(aisBld);
					this.bldHash[aisBld.hashId]=aisBld;
				}
				else
				{
					def=aisEnv.defLib.bld[svrBld.codename];
					if(def.groupId=="Obstacle" || def.groupId=="Decorate")
					{
						this.initDeco(svrBld,cityVO.buildings,cityVO,kingVO);
					}else{
						aisBld=this.bldFunc_Base.call(this,svrBld,cityVO,kingVO);
						aisList.push(aisBld);
						this.bldHash[aisBld.hashId]=aisBld;
					}
					//TODO: Report Error:
					//DBOut("Can't find building convert function for: "+svrBld.codename);
				}
			}
			//添加/转换建筑工人:
			n=aisList.length;
			for(i=0;i<n;i++)
			{
				aisBld=aisList[i];
				if(aisBld.workerHutId)
				{
					hut=this.bldHash[aisBld.workerHutId];
					if(hut)
					{
						//找到关联的工人,设置工作地点:
						worker=cityVO.bldWorkers[hut.hutWorkerIdx];
						worker.busy=1;
						worker.workBld=aisBld.hashId;
					}
				}
			}
		},
		initDeco:function(svrBld,aisList,cityVO,kingVO)
		{
			var i,n,func,hut,worker,svrTask,def,cost,aisTask,vo;

			var aisBld={
				"codeName":svrBld.codename,"hashId":"Obj"+svrBld.instanceId,"createTime":0,pos:[svrBld.pos.x,svrBld.pos.y,0],level:svrBld.level,
				removeResultVO:{},boxInfo:[],boxReward:{storage:[]},constructing:0,working:0,buffs:{},openCostGem:svrBld.openCostGem,
			};

			if(svrBld.gem)
				aisBld.removeResultVO["gem"]=svrBld.gem;
			if(svrBld.exp)
				aisBld.removeResultVO["exp"]=svrBld.exp;//exp的codename需要确定

			aisBld.boxId=svrBld.boxId;
			if(svrBld.box)
			{
				aisBld.boxInfo=svrBld.box;
			}
			if(svrBld.rewardReq)
			{
				aisBld.rewardReq=svrBld.rewardReq;
				for(i=0;i<svrBld.rewardReq.length;i++)
				{
					vo=svrBld.rewardReq[i];
					if(vo.type=="Gem")
						aisBld.boxReward.gem=vo.num;
					else if(vo.type=="tok1")
						aisBld.boxReward.cash=vo.num;
					else if(vo.type=="Gold")
						aisBld.boxReward.storage.push({store:"Gold",type:"ResGold",num:vo.num});
					else if(vo.type=="Elixir")
						aisBld.boxReward.storage.push({store:"Oil",type:"ResOil",num:vo.num});
					else if(vo.type=="Cube")
						aisBld.boxReward.storage.push({store:"Cube",type:"ResCube",num:vo.num});
					else if(vo.type.indexOf("plu_")!=-1)
						aisBld.boxReward.storage.push({store:"AddOn",type:vo.type,num:vo.num});
					else if(vo.type.indexOf("par_")!=-1)
						aisBld.boxReward.storage.push({store:"Part",type:vo.type,num:vo.num});
				}
			}

			if(svrBld.taskList && svrBld.taskList.length)
			{
				svrTask=svrBld.taskList[0];
				if(svrTask.codename=="TaskRemove")//正在建造/升级:
				{
					def=aisEnv.defLib.bld[svrBld.codename];
					cost=def.levels[aisBld.level].cost;
					aisTask={
						hashId:svrTask.instanceId,startTime:svrTask.startTime,createTime:svrTask.startTime,
						//以下这些从def中读取
						"tgtValue": cost.time, "taskCost":cost,
						//以下这些计算?
						"endTime":cost.time+svrTask.startTime, "curValue": this.updateTime-svrTask.startTime,
						//TODO:一下这些为常量?
						"valuePerMS": 1, "workRate": 1, "state": 1, "overFunc": "cbk_removeOver","timeTrigger": 0,
					}
					aisBld.constructing=1;
					aisBld.constructTask=aisTask;
					aisBld.workerHutId="Obj"+svrTask.builderInstanceId;
				}
			}

			aisList.push(aisBld);
			this.bldHash[aisBld.hashId]=aisBld;

			def=aisEnv.defLib.bld[svrBld.codename];
			if(def)
			{
				if(def.bGrave)
					this.tombStoneHash.push(aisBld.hashId);
			}

		}
	};
	//-------------------------------------------------------------------------
	//转换bld的函数
	{
		//转换基础参数:
		window.pxyLogin.genBaseBldVO=function(svrBld,cityVO,codeName)
		{
			var i,aisBld,svrTask,aisTask,svrBuff,aisBuff,def,cost,time,buffname;
			aisBld={
				"codeName":codeName,"hashId":"Obj"+svrBld.instanceId,"createTime":0,pos:[svrBld.pos.x,svrBld.pos.y,0],level:svrBld.level,
				constructing:0,working:0,buffs:{}
			};

			aisBld.status=svrBld.status;
			def=aisEnv.defLib.bld[codeName];
			//建筑物是否在建造/升级?
			if(svrBld.taskList && svrBld.taskList.length)
			{
				svrTask=svrBld.taskList[0];
				if(svrTask.codename=="TaskBuilding")//正在建造/升级:
				{
					if(svrTask.targetLevel==1)
						aisBld.level=0;

					cost=def.levels[aisBld.level].cost;
					aisTask={
						hashId:svrTask.instanceId,startTime:svrTask.startTime,createTime:svrTask.startTime,
						//以下这些从def中读取
						"tgtValue": cost.time, "taskCost":cost,
						//以下这些计算?
						"endTime":cost.time+svrTask.startTime, "curValue": this.updateTime-svrTask.startTime,
						//TODO:一下这些为常量?
						"valuePerMS": 1, "workRate": 1, "state": 1, "overFunc": "cbk_constructOver","timeTrigger": 0,
					}
					aisBld.constructing=1;
					aisBld.constructTask=aisTask;
					aisBld.workerHutId="Obj"+svrTask.builderInstanceId;
				}
			}

			if(svrBld.buffs && svrBld.buffs.length)
			{
				for(i=0;i<svrBld.buffs.length;i++)
				{
					svrBuff=svrBld.buffs[i];

					if(svrBuff.codename=="BoostProduceRes" || svrBuff.codename=="BoostTrainUnit")
					{
						buffname=def.levels[aisBld.level].boostBuff;
					}

					if(svrBuff.codename=="BoostProduceGem")
					{
						var vipdef=window.aisEnv.defLib.vipPrivilege["vipDiamonBoost"].levels[svrBuff.vipLevel];
						if(vipdef)
						{
							buffname=vipdef.buff
						}else continue;
					}
					aisBld.buffs[buffname]={"codeName":buffname,"startTime": svrBuff.startTime, "endTime": svrBuff.endTime};
				}
			}
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换BaseBuilding
		window.pxyLogin.bldFunc_Base=function(svrBld,cityVO)
		{
			var aisBld,def;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,svrBld.codename);

			def=aisEnv.defLib.bld[svrBld.codename];
			if(def.groupId=="Traps" && aisBld.status==2)
					this.crashedTrapsHash.push(aisBld.hashId);
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换TownHall
		window.pxyLogin.bldFunc_TownHall=function(svrBld,cityVO)
		{
			var aisBld,def;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"TownHall");
			def=aisEnv.defLib.bld[svrBld.codename];

			cityVO.attackCost=def.levels[svrBld.level].attackCost;//查找对手的花费
			//资源:
			if(svrBld.elixir)
			{
				cityVO.storages["Oil"].slots.ResOil.num+=svrBld.elixir;
			}
			if(svrBld.gold)
			{
				cityVO.storages["Gold"].slots.ResGold.num+=svrBld.gold;
			}

			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换WorkerHut
		window.pxyLogin.bldFunc_WorkerHut=function(svrBld,cityVO)
		{
			var aisBld,worker,idx;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"WorkerHut");
			//创建关联的工人:
			worker={"busy": 0, "owner": aisBld.hashId, "workBld": null}
			aisBld.hutWorkerIdx=cityVO.bldWorkers.length;
			cityVO.bldWorkers.push(worker);
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换OilWell
		window.pxyLogin.bldFunc_OilWell=function(svrBld,cityVO)
		{
			var aisBld,def,resNum;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"OilWell");

			//计算油井内容量:这个比较复杂
			//def=aisEnv.defLib.bld["OilWell"];
			//resNum=this.updateTime-(svrBld.taskList[0].startTime-svrBld.taskList[0].passTime);
			//resNum*=def.levels[aisBld.level].mineSpeed;
			//resNum/=1000;
			resNum=svrBld.tmpStorageValue;
			aisBld.values={
				"powCurCostRate": {"cur": 0, "base": 0},
				"mineCurNum": {"cur": resNum, "base": resNum}
			};
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换OilTank
		window.pxyLogin.bldFunc_OilTank=function(svrBld,cityVO)
		{
			var aisBld,def,resNum;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"OilTank");

			//增加资源:
			cityVO.storages["Oil"].slots.ResOil.num+=svrBld.num;
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换GoldMine
		window.pxyLogin.bldFunc_GoldMine=function(svrBld,cityVO)
		{
			var aisBld,def,resNum;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"GoldMine");

			//计算油井内容量:这个比较复杂
			//def=aisEnv.defLib.bld["GoldMine"];
			//resNum=this.updateTime-(svrBld.taskList[0].startTime-svrBld.taskList[0].passTime);
			//resNum*=def.levels[aisBld.level].mineSpeed;
			//resNum/=1000;
			resNum=svrBld.tmpStorageValue;
			aisBld.values={
				"powCurCostRate": {"cur": 0, "base": 0},
				"mineCurNum": {"cur": resNum, "base": resNum}
			};
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换GoldVault
		window.pxyLogin.bldFunc_GoldVault=function(svrBld,cityVO)
		{
			var aisBld,def,resNum;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"GoldVault");

			//增加资源:
			cityVO.storages["Gold"].slots.ResGold.num+=svrBld.num;
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换CubeWork
		window.pxyLogin.bldFunc_CubeWork=function(svrBld,cityVO)
		{
			var aisBld,def,resNum;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"CubeWork");

			//计算油井内容量:这个比较复杂
			//def=aisEnv.defLib.bld["OilWell"];
			//resNum=this.updateTime-(svrBld.taskList[0].startTime-svrBld.taskList[0].passTime);
			//resNum*=def.levels[aisBld.level].mineSpeed;
			//resNum/=1000;
			resNum=svrBld.tmpStorageValue;
			aisBld.values={
				"powCurCostRate": {"cur": 0, "base": 0},
				"mineCurNum": {"cur": resNum, "base": resNum}
			};
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换CubeCan
		window.pxyLogin.bldFunc_CubeCan=function(svrBld,cityVO)
		{
			var aisBld,def,resNum;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"CubeCan");

			//增加资源:
			cityVO.storages["Cube"].slots.ResCube.num+=svrBld.num;
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换Camp
		window.pxyLogin.bldFunc_Camp=function(svrBld,cityVO)
		{
			var aisBld,def,list,i,n,slot;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"Camp");

			//增加单位
			list=svrBld.units;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				if(!cityVO.storages["Unit"].slots[slot.codename])
					cityVO.storages["Unit"].slots[slot.codename]={type:slot.codename,num:slot.num};
				else
					cityVO.storages["Unit"].slots[slot.codename].num+=slot.num;
			}
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换Barrack
		window.pxyLogin.bldFunc_Barrack=function(svrBld,cityVO)
		{
			var aisBld,def,list,i,n,slot,mfcSlots,codeName,svrTask,slotNextIdx,unitCodename,aisTask;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"Barrack");
			aisBld.slotWorkVal=0;
			aisBld.slotCap=0;

			slotNextIdx=1;
			//TODO: 增加训练槽和
			mfcSlots=aisBld.mfcSlots=[];
			list=svrBld.taskList;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				if(slot.codename=="TaskTrain")
				{
					unitCodename=slot.unitCodename;
					def=aisEnv.defLib.unit[unitCodename];
					cost=def.levels[slot.unitLevel-1].cost;
					mfcSlots.push({codeName:unitCodename,num:slot.num,level:slot.unitLevel-1,slotIdx:slot.instanceId,svrIdx:i});
					if(slot.instanceId>=slotNextIdx)slotNextIdx=slot.instanceId+1;

					aisBld.slotWorkVal+=cost.time*slot.num;
					aisBld.slotCap+=slot.num*def.storageSize;
				}
			}
			//设置调整当前任务:
			if(mfcSlots[0])
			{
				codeName=mfcSlots[0].codeName;
				def=aisEnv.defLib.unit[codeName];
				cost=def.levels[mfcSlots[0].level].cost;
				svrTask=list[mfcSlots[0].svrIdx];
				aisTask={
					hashId:"Mfc"+mfcSlots[0].slotIdx,startTime:svrTask.startTime,createTime:svrTask.startTime,
					prdctCodeName:def.codeName,
					//以下这些从def中读取
					"tgtValue": cost.time, "taskCost":cost,
					//以下这些计算?
					"endTime":cost.time+svrTask.startTime, "curValue": cost.time-svrTask.unitRemainMs,
					//TODO:一下这些为常量?
					"valuePerMS": 1, "workRate": 1, "state": 1, "overFunc": "cbk_MfcOver","timeTrigger": 0,
				}
				aisBld.workTask=aisTask;
				if(aisTask.curValue>aisTask.tgtValue)
				{
					aisBld.working=4;
					aisTask.curValue=aisTask.tgtValue;
					aisTask.state=3;//Task is over, but not done.
				}
				else
				{
					aisBld.working=1;
				}
				aisBld.slotWorkVal-=cost.time;
			}
			aisBld.slotNextIdx=slotNextIdx;
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换TechLab
		window.pxyLogin.bldFunc_TechLab=function(svrBld,cityVO,kingVO)
		{
			var aisBld,def,cost,resNum,n,list,slot,svrTask,aisTask,unitCodename,techCodename,i;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"TechLab");

			//增加单位和魔法瓶的等级信息
			list=svrBld.unitLevels;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				unitCodename=slot.unitCodename;
				techCodename=this.unit2tech[unitCodename];
				if(!techCodename)continue;
				kingVO.techs[techCodename]={"codeName":techCodename, "createTime":0,"startTime": 0, "level": slot.level-1};
			}

			//TODO: 增加升级中Task
			list=svrBld.taskList;
			n=list.length;
			for(i=0;i<n;i++)
			{
				svrTask=list[i];
				if(svrTask.codename=="TaskUpgrade")
				{
					unitCodename=svrTask.unitCodeName;
					techCodename=this.unit2tech[unitCodename];

					def=aisEnv.defLib.tech[techCodename];
					if(!def)continue;

					cost=def.levels[svrTask.targetLevel-2].cost;

					aisTask={
						hashId:"Mfc"+svrTask.instanceId,startTime:svrTask.startTime,createTime:svrTask.startTime,
						//以下这些从def中读取
						"tgtValue": cost.time, "taskCost":cost,
						//以下这些计算?
						"endTime":cost.time+svrTask.startTime, "curValue": this.updateTime-svrTask.startTime,
						"techCodeName": techCodename, "techLevel": svrTask.targetLevel-1,
						//TODO:一下这些为常量?
						"valuePerMS": 1, "workRate": 1, "state": 1, "overFunc": "cbk_caseOver","timeTrigger": 0,
					};
					aisBld.workTask=aisTask;
					{
						aisBld.working=1;
					}

					//往kingVO里添加techCases信息
					kingVO.techCases[techCodename]={};
					kingVO.techCases[techCodename][techCodename]={"tech": techCodename, "level": svrTask.targetLevel-2};
					break;
				}
			}
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换SpellLab
		window.pxyLogin.bldFunc_SpellLab=function(svrBld,cityVO)
		{
			var aisBld,def,list,i,n,slot,mfcSlots,codeName,aisTask,svrTask,slotNextIdx,unitCodename,techCodename;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"SpellLab");
			aisBld.slotWorkVal=0;
			aisBld.slotCap=0;

			slotNextIdx=1;
			//TODO: 增加训练槽和
			mfcSlots=aisBld.mfcSlots=[];
			list=svrBld.taskList;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				if(slot.codename=="TaskTrain")
				{
					unitCodename=slot.unitCodename;
					def=aisEnv.defLib.spell[unitCodename];
					cost=def.levels[slot.unitLevel-1].cost;

					mfcSlots.push({codeName:unitCodename,num:slot.num,level:slot.unitLevel-1,slotIdx:slot.instanceId,svrIdx:i});
					if(slot.instanceId>=slotNextIdx)slotNextIdx=slot.instanceId+1;

					aisBld.slotWorkVal+=cost.time*slot.num;
					aisBld.slotCap+=slot.num*def.storageSize;
				}
			}
			//设置调整当前任务:
			if(mfcSlots[0])
			{
				codeName=mfcSlots[0].codeName;
				def=aisEnv.defLib.spell[codeName];
				cost=def.levels[mfcSlots[0].level].cost;
				svrTask=list[mfcSlots[0].svrIdx];
				aisTask={
					hashId:"Mfc"+mfcSlots[0].slotIdx,startTime:svrTask.startTime,createTime:svrTask.startTime,
					prdctCodeName:def.codeName,
					//以下这些从def中读取
					"tgtValue": cost.time, "taskCost":cost,
					//以下这些计算?
					"endTime":cost.time+svrTask.startTime, "curValue": cost.time-svrTask.unitRemainMs,
					//TODO:一下这些为常量?
					"valuePerMS": 1, "workRate": 1, "state": 1, "overFunc": "cbk_MfcOver","timeTrigger": 0,
				}
				aisBld.workTask=aisTask;
				if(aisTask.curValue>aisTask.tgtValue)
				{
					aisBld.working=4;
					aisTask.curValue=aisTask.tgtValue;
					aisTask.state=3;//Task is over, but not done.
				}
				else
				{
					aisBld.working=1;
				}
				aisBld.slotWorkVal-=cost.time;
			}

			//增加魔法瓶
			list=svrBld.units;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				unitCodename=slot.codename;
				if(!cityVO.storages["Spell"].slots[unitCodename])
					cityVO.storages["Spell"].slots[unitCodename]={type:unitCodename,num:slot.num};
				else
					cityVO.storages["Spell"].slots[unitCodename].num+=slot.num;
			}

			aisBld.slotNextIdx=slotNextIdx;
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换Cannon
		window.pxyLogin.bldFunc_Cannon=function(svrBld,cityVO)
		{
			var aisBld,def,resNum,n;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"Cannon");

			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换RGunTower
		window.pxyLogin.bldFunc_RGunTower=function(svrBld,cityVO)
		{
			var aisBld,def,resNum,n;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"RGunTower");
			aisBld.curAmmo=svrBld.storageAmmoNum;
			aisBld.fireMode=svrBld.attackType;

			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换InfernoTower
		window.pxyLogin.bldFunc_InfernoTower=function(svrBld,cityVO)
		{
			var aisBld,def,resNum,n;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"InfernoTower");
			aisBld.curAmmo=svrBld.storageAmmoNum;
			aisBld.fireMode=svrBld.attackType;

			return aisBld;
		};
		//-------------------------------------------------------------------------
		//转换InfernoMechTower
		window.pxyLogin.bldFunc_InfernoMechTower=function(svrBld,cityVO)
		{
			var aisBld,def,resNum,n;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"InfernoMechTower");
			aisBld.curAmmo=svrBld.storageAmmoNum;
			aisBld.fireMode=svrBld.attackType;

			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换ClanBld
		window.pxyLogin.bldFunc_ClanBld=function(svrBld,cityVO)
		{
			var aisBld,def,list,i,n,slot,mfcSlots,codeName,aisTask,svrTask,slotNextIdx,unitCodename,techCodename;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"ClanBld");
			def=aisEnv.defLib.bld[svrBld.codename].levels[svrBld.level];

			list=svrBld.taskList;
			n=list.length;
			for(i=0;i<n;i++)
			{
				svrTask=list[i];
				if(svrTask.codename=="TaskClan")
				{
					var cdRequestTime=0;
					//if(this.vipLevel)
					{
						var rdm;
						var defLib=window.aisEnv.defLib.vipPrivilege;
						var vipdef=defLib["vipRequestUnitsWaitTime"].levels[this.vipLevel];
						if(vipdef && vipdef.modifyValue)
						{
							cdRequestTime=vipdef.modifyValue*60*1000;
						}
					}
					aisTask={
						hashId:svrTask.instanceId,startTime:svrTask.startTime,createTime:svrTask.startTime,
						//以下这些从def中读取
						"tgtValue": def.reinforceTime-cdRequestTime,
						//以下这些计算?
						"endTime":def.reinforceTime-cdRequestTime+svrTask.startTime, "curValue": this.updateTime-svrTask.startTime,
						//TODO:一下这些为常量?
						"valuePerMS": 1, "workRate": 1, "state": 1, "overFunc": "cbk_ReinforceOver","timeTrigger": 0,
					}
					aisBld.workTask=aisTask;
					{
						aisBld.working=1;
					}
				}
			}

			list=svrBld.units;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				unitCodename=(slot.level-1)+"@"+slot.codename;
				if(!cityVO.storages["Clan"].slots[unitCodename])
					cityVO.storages["Clan"].slots[unitCodename]={type:slot.codename,subType:(slot.level-1)+"",num:slot.num};
				else
					cityVO.storages["Clan"].slots[unitCodename].num+=slot.num;
			}

			aisBld.signIn=svrBld.signIn;
			aisBld.dailyDonateTimes=svrBld.dailyDonateTimes;
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换DiamondMine
		window.pxyLogin.bldFunc_DiamondMine=function(svrBld,cityVO)
		{
			var aisBld,def,resNum,i;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"DiamondMine");
			/*
			def=aisEnv.defLib.bld["DiamondMine"];
			if(this.vipLevel)
			{
				var vipdef=window.aisEnv.defLib.vipPrivilege["vipDiamonBoost"].levels[this.vipLevel];
				if(vipdef)
				{
					for(i=0;i<def.levels.length;i++)
					{
						if(def.levels[i].boostBuff)
						{
							def.levels[i].boostBuff=vipdef.buff;
						}
					}
				}
			}
			*/
			resNum=svrBld.storageValue;
			aisBld.values={
				"powCurCostRate": {"cur": 0, "base": 0},
				"mineCurNum": {"cur": resNum, "base": resNum}
			};
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换Hangar
		window.pxyLogin.bldFunc_Hangar=function(svrBld,cityVO)
		{
			var aisBld,def,resNum,i,n,part,list,svrTask,aisTask;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"Hangar");

			if(svrBld.parts && svrBld.parts.length)
			{
				aisBld.craft={};
				aisBld.craft.slots={};
				for(i=0;i<svrBld.parts.length;i++)
				{
					part=svrBld.parts[i];
					if(part.position==0)
						aisBld.craft.slots.body={type:part.codename, subType:part.instanceId,level:part.level};
					else if(part.position==1)
						aisBld.craft.slots.leg={type:part.codename, subType:part.instanceId,level:part.level};
				}
			}
			if(svrBld.plugs && svrBld.plugs.length)
			{
				part=svrBld.plugs[0];
				if(aisBld.craft)
				aisBld.craft.addOn=part.codename;
			}
			if(aisBld.craft)
			{
				aisBld.craft.hp=svrBld.hp;
				aisBld.craft.state=svrBld.state;
			}

			list=svrBld.taskList;
			n=list.length;
			for(i=0;i<n;i++)
			{
				svrTask=list[i];
				if(svrTask.codename=="TaskRepair")
				{

					aisTask={
						hashId:"Mfc"+svrTask.instanceId,startTime:svrTask.startTime,createTime:svrTask.startTime,
						//以下这些从def中读取
						"tgtValue": svrTask.repairTime, "taskCost":{},
						//以下这些计算?
						"endTime":svrTask.repairTime+svrTask.startTime, "curValue": svrTask.repairTime-svrTask.remainMS,
						//TODO:一下这些为常量?
						"valuePerMS": 1, "workRate": 1, "state": 1, "overFunc": "cbk_FixOver","timeTrigger": 0,
					}
					aisBld.workTask=aisTask;
					aisBld.working=1;
				}
			}
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换MechFactory
		window.pxyLogin.bldFunc_MechFactory=function(svrBld,cityVO)
		{
			var aisBld,def,list,i,n,slot,mfcSlots,codeName,svrTask,slotNextIdx,unitCodename,aisTask;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"MechFactory");
			aisBld.slotWorkVal=0;
			aisBld.slotCap=0;

			slotNextIdx=1;
			//TODO: 增加训练槽和
			mfcSlots=aisBld.mfcSlots=[];
			list=svrBld.taskList;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				if(slot.codename=="TaskProduceMech")
				{
					unitCodename=slot.unitCodename;
					def=aisEnv.defLib.part[unitCodename];
					cost=def.levels[slot.unitLevel-1];
					mfcSlots.push({codeName:unitCodename,num:slot.num,level:slot.unitLevel-1,slotIdx:slot.partInstanceId,svrIdx:i});
					if(slot.partInstanceId>=slotNextIdx)slotNextIdx=slot.partInstanceId+1;

					aisBld.slotWorkVal+=cost.time*slot.num;
					aisBld.slotCap+=slot.num*def.storageSize;
				}
			}
			//设置调整当前任务:
			if(mfcSlots[0])
			{
				codeName=mfcSlots[0].codeName;
				def=aisEnv.defLib.part[codeName];
				cost=def.levels[mfcSlots[0].level].cost;
				svrTask=list[mfcSlots[0].svrIdx];
				aisTask={
					hashId:"Mfc"+mfcSlots[0].slotIdx,startTime:svrTask.startTime,createTime:svrTask.startTime,
					prdctCodeName:def.codeName,
					//以下这些从def中读取
					"tgtValue": cost.time, "taskCost":cost,
					//以下这些计算?
					"endTime":cost.time+svrTask.startTime, "curValue": cost.time-svrTask.unitRemainMs,
					//TODO:一下这些为常量?
					"valuePerMS": 1, "workRate": 1, "state": 1, "overFunc": "cbk_MfcOver","timeTrigger": 0,
				}
				aisBld.workTask=aisTask;
				if(aisTask.curValue>aisTask.tgtValue)
				{
					aisBld.working=4;
					aisTask.curValue=aisTask.tgtValue;
					aisTask.state=3;//Task is over, but not done.
				}
				else
				{
					aisBld.working=1;
				}
				aisBld.slotWorkVal-=cost.time;
			}

			//增加部件
			list=svrBld.parts;
			if(list)
			{
				n=list.length;
				for(i=0;i<n;i++)
				{
					slot=list[i];
					if(slot.state>2)continue;
					codeName=slot.instanceId+"@"+slot.codename;
					if(!cityVO.storages["Part"].slots[codeName])
						cityVO.storages["Part"].slots[codeName]={type:slot.codename,subType:slot.instanceId,num:slot.num,lockNum:slot.state>0?1:0,subInfo:{level:slot.level-1}};
					else
						cityVO.storages["Part"].slots[codeName].num+=slot.num;

					if(slot.instanceId>=slotNextIdx)slotNextIdx=slot.instanceId+1;
				}
			}
			list=svrBld.plugs;
			if(list)
			{
				n=list.length;
				for(i=0;i<n;i++)
				{
					slot=list[i];
					if(!cityVO.storages["AddOn"].slots[slot.codename])
						cityVO.storages["AddOn"].slots[slot.codename]={type:slot.codename,num:slot.num};
					else
						cityVO.storages["AddOn"].slots[slot.codename].num+=slot.num;
				}
			}

			aisBld.slotNextIdx=slotNextIdx;
			aisBld.nextPartId=slotNextIdx;
			return aisBld;
		};

		//-------------------------------------------------------------------------
		//转换Fort
		window.pxyLogin.bldFunc_Fort=function(svrBld,cityVO)
		{
			var aisBld,def,list,i,n,slot,mfcSlots,codeName,aisTask,svrTask,slotNextIdx,unitCodename,techCodename;
			//基础信息:
			aisBld=this.genBaseBldVO(svrBld,cityVO,"Fort");
			//增加单位
			list=svrBld.units;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				unitCodename=(slot.level-1)+"@"+slot.codename;
				if(!cityVO.storages["Fort"].slots[unitCodename])
					cityVO.storages["Fort"].slots[unitCodename]={type:slot.codename,subType:(slot.level-1)+"",num:slot.num};
				else
					cityVO.storages["Fort"].slots[unitCodename].num+=slot.num;
			}
			return aisBld;
		};
		//----------------------------------------
		//添加ItemStorages
		window.pxyLogin.addItemStorages=function(cityVO,svrVO)
		{
			var aisBld,def,list,i,n,slot;
			list=svrVO.items;
			if(!list)return;
			n=list.length;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				if(!cityVO.storages["Item"].slots[slot.type])
					cityVO.storages["Item"].slots[slot.type]={type:slot.type,num:slot.num};
				else
					cityVO.storages["Item"].slots[slot.type].num+=slot.num;
			}
		};

	}
}
