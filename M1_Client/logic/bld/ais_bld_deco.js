if(!window.aisDecoBld)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//障碍物,装饰物的对象类型
window.aisDecoBld=function(env,city,def)
{
	var vname,pname,factor;
	if(env)
	{
		window.aisBuilding.call(this,env,city,def);
		this.name="DecoBld";
	}
};

window.aisDecoBld.ERR_NoHarvest={level:100,error:"No res to harvest!","class":"aisDecoBld",code:"ERR_NoHarvest"};
window.aisDecoBld.ERR_BadPower={level:100,error:"Power rate is out of range!","class":"aisDecoBld",code:"ERR_BadPower"};

//---------------------------------------------------------------------------
window.aisDecoBld.prototype=new window.aisBuilding();

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//从Building继承来的函数:
{
	//---------------------------------------------------------------------------
	//从voObj中读出建筑数据
	window.aisDecoBld.prototype.readFmVO=function(king,voObj,def)
	{
		aisBuilding.prototype.readFmVO.call(this,king,voObj,def);
		//读出拆掉后获取的奖励, 这个不在def里, 由服务器或者创建的时候决定
		if(voObj.removeResultVO)
		{
			this.removeResultVO=voObj.removeResultVO;
		}
		if(voObj.boxInfo)
		{
			this.boxInfo=voObj.boxInfo;
		}
		if(voObj.boxReward)
		{
			this.boxReward=voObj.boxReward;
		}
		if(voObj.rewardReq)
			this.rewardReq=voObj.rewardReq;
		if(voObj.openCostGem)
			this.openCostGem=voObj.openCostGem;
		if(voObj.boxId)
			this.boxId=voObj.boxId;
	};

	//---------------------------------------------------------------------------
	//将建筑数据存入voObj
	window.aisDecoBld.prototype.saveToVO=function(king,voObj)
	{
		aisBuilding.prototype.saveToVO.call(this,king,voObj);
		//保存拆掉后获取的奖励, 这个不在def里, 由服务器或者创建的时候决定
		if(this.removeResultVO)
		{
			voObj.removeResultVO=this.removeResultVO;
		}
		if(this.boxInfo)
		{
			voObj.boxInfo=this.boxInfo;
		}
		if(this.boxReward)
		{
			voObj.boxReward=this.boxReward;
		}
		if(this.rewardReq)
			voObj.rewardReq=this.rewardReq;
		if(this.openCostGem)
			voObj.openCostGem=this.openCostGem;
		if(this.boxId)
			voObj.boxId=this.boxId;
	};
}

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//开始拆除
	window.aisDecoBld.prototype.com_Remove=function(comVO)
	{
		var task,cost,newLevel,speed,timeCost;
		var def;
		def=this.def;
		comVO.hashId=this.hashId;
		DBOut("Will start remove by command!!");
		if(this.constructing)
		{
			DBOut("aisBuilding.com_Remove Error 1: building already under building!");
			throw aisBuilding.ERR_InConstruct;
		}
		if(this.working)
		{
			DBOut("aisBuilding.com_Remove Error 2: building is busy!");
			throw aisBuilding.ERR_Busy;
		}
		if(this.level<1)
		{
			DBOut("aisBuilding.com_Remove Error 3, level is not 1!");
			throw aisBuilding.ERR_Busy;
		}
		var level=this.level;
		cost=def.levels[level].cost;
		this.city.useCost(cost,1,0);
		//TODO: Code for check the req:
		timeCost=cost.time
		if(timeCost)
		{
			speed=this.city.getValue("bldSpeed");
			task=this.newTask(this.king.nowTime,"cbk_removeOver",null,cost.time,speed,1.0);
			task.taskCost=cost;
			this.constructWorker=this.city.useBldWorker(this);
			this.constructing=1;
			this.constructTask=task;
			comVO.wokerId=this.constructWorker.owner.hashId;
		}
		else
		{
			this.removeFeatures();//Remove all features at old level
			this.delDefFactors();
			//this.level=newLevel;
			//检测是否触发任何的解锁？
			this.king.checkDefUnlockVsb(def.levels[level].unlockVsb);
			if(!def.buildNotNeedWorker)
			{
				this.constructWorker=this.city.useBldWorker(this);
				comVO.wokerId=this.constructWorker.owner.hashId;
				this.city.freeBldWorker(this.constructWorker);
			}
			this.constructing=0;
			this.constructTask=null;
			this.deadOut=1;
			this.city.removeBuilding(this);
			this.king.removeHashObj(this);
			this.city.power.removeCoster(this);
			this.city.power.removeGener(this);
			//发东西
			if(this.status!=2)
			{
				if(def.levels[level].removeResult)
				{
					this.city.returnCost(def.levels[level].removeResult,1);
					comVO.removeResult=def.levels[level].removeResult;
				}
				if(this.removeResultVO)
				{
					this.city.returnCost(this.removeResultVO,1);
				}
			}else{
				var i,list;
				list=this.city.crashedTrapsHash;
				for(i=0;i<list.length;i++)
				{
					if(list[i]==comVO.hashId)
					{
						this.city.crashedTrapsHash.splice(i,1);
						break;
					}
				}
			}
			this.level=0;
		}
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//拆除完成
	window.aisDecoBld.prototype.com_RemoveDone=function(comVO)
	{
		var def=this.def;
		if(this.constructing!=2)
		{
			DBOut("aisBuilding.cancelConstruct Error 1: Building is not in construct!!");
			throw aisBuilding.ERR_NotInConstruct;
		}
		if(!this.constructTask)
		{
			DBOut("aisBuilding.cancelConstruct Error 2: Can't find construction task!");
			throw aisBuilding.ERR_NoConstructTask;
		}
		if(!this.constructTask.isOver())
		{
			DBOut("aisBuilding.cancelConstruct Error 3: Construction task not over!");
			throw aisBuilding.ERR_TaskNotOver;
		}
		this.constructTask.taskDone();
		this.city.freeBldWorker(this.constructWorker);
		this.removeFeatures();//Remove all features at old level
		this.delDefFactors();
		//检测是否触发任何的解锁？
		this.king.checkDefUnlockVsb(def.levels[this.level].unlockVsb);
		this.constructing=0;
		this.constructTask=null;
		this.deadOut=1;
		this.city.removeBuilding(this);
		this.king.removeHashObj(this);
		this.city.power.removeCoster(this);
		this.city.power.removeGener(this);
		//发东西
		if(this.status!=2)
		{
			if(def.levels[this.level].removeResult)
			{
				this.city.returnCost(def.levels[this.level].removeResult,1);
			}
			if(this.removeResultVO)
			{
				this.city.returnCost(this.removeResultVO,1);
			}
		}
		this.level=0;
		DBOut("Remove done!!");
		this.makeViewsDirty();
	}
	//---------------------------------------------------------------------------
	//用钻秒拆除
	window.aisDecoBld.prototype.com_GemRemoveDone=function(comVO)
	{
		var gem,time,gemNum;
		comVO.hashId=this.hashId;
		comVO.level=this.level;
		if(!this.constructing)
		{
			DBOut("aisBuilding.com_GemRemoveDone Error 1: Building is not in construct!!");
			return;
			//throw aisBuilding.ERR_NotInConstruct;
		}
		if(!this.constructTask)
		{
			DBOut("aisBuilding.com_GemRemoveDone Error 2: Can't find construction task!");
			return;
			//throw aisBuilding.ERR_NoConstructTask;
		}
		time=this.constructTask.getRemainTime();
		gemNum=this.king.convertTime2Gem(time);

		if(comVO.discountGemNum)
			gemNum=comVO.discountGemNum;
		if(gemNum)
		{
			comVO.gemNum=gemNum;
			if(this.king.gemNum<gemNum)
			{
				DBOut("aisBuilding.com_GemRemoveDone Error 3: Not enough gems: "+gemNum+" vs "+this.king.gemNum);
				throw aisBuilding.ERR_NoGem;
			}
			this.constructTask.rushOver(1);
			this.king.gemNum-=gemNum;
			comVO.gemNum=gemNum;
			this.city.makeViewsDirty();
			this.king.makeViewsDirty();
		}
	};

	window.aisDecoBld.prototype.cbk_removeOver=function(vo,task)
	{
		//DBOut("Construct done: "+vo+", "+task);
		DBOut("Remove done command!!");
		var level=this.level;
		var hashId=this.hashId;
		this.constructing=2;
		this.makeViewsDirty();
		//自动完成建造?
		if(this.env.cfg.bldAutoConstructDone)
		{
			this.com_RemoveDone();
			if(task && task.isRushed)
			{
				return;
			}
			if(1)//客户端模式下, 向服务器发送这个消息
			{
				this.king.execFakeCmd(this,"RemoveDone",{def:this.def,level:level,hashId:hashId},this,this.king.nowTime);
			}
		}
	};

	//window.aisDecoBld.prototype.com_AbortRemove=function(comVO)
	window.aisDecoBld.prototype.com_AbortConstruct=function(comVO)
	{
		comVO.hashId=this.hashId;
		if(!this.constructing)
		{
			DBOut("aisDecoBld.com_AbortRemove Error 1: Building is not in construct!!");
			return;
		}
		if(!this.constructTask)
		{
			DBOut("aisDecoBld.com_AbortRemove Error 2: Can't find construction task!");
			return;
		}
		this.giveUpTask(this.constructTask,aisBuilding.removeRefund);
		this.city.freeBldWorker(this.constructWorker);
		this.constructing=0;
		this.constructTask=null;
		if(this.level==0)//取消的是建造
		{
			this.city.removeBuilding(this);
			this.king.removeHashObj(this);
			this.deadOut=1;
		}
		this.makeViewsDirty();

	};

	window.aisDecoBld.prototype.com_RemoveAll=function(comVO)
	{
		var task,cost,newLevel,speed;
		var def;

		comVO.hashId=this.hashId;
		DBOut("Will start remove by command!!");
		if(this.constructing)
		{
			DBOut("aisBuilding.com_Remove Error 1: building already under building!");
			throw aisBuilding.ERR_InConstruct;
		}
		if(this.working)
		{
			DBOut("aisBuilding.com_Remove Error 2: building is busy!");
			throw aisBuilding.ERR_Busy;
		}
		if(this.level<1)
		{
			DBOut("aisBuilding.com_Remove Error 3, level is not 1!");
			throw aisBuilding.ERR_Busy;
		}

		var i,n,bld,level;
		n=this.city.tombStoneHash?this.city.tombStoneHash.length:0;
		for(i=0;i<n;i++)
		{
			bld=this.king.getHashObj(this.city.tombStoneHash[i]);
			level=bld.level;
			def=bld.def;
			bld.removeFeatures();//Remove all features at old level
			bld.delDefFactors();
			//检测是否触发任何的解锁？
			bld.king.checkDefUnlockVsb(def.levels[level].unlockVsb);
			if(!def.buildNotNeedWorker)
			{
				bld.constructWorker=bld.city.useBldWorker(bld);
				comVO.wokerId=bld.constructWorker.owner.hashId;
				bld.city.freeBldWorker(bld.constructWorker);
			}
			bld.constructing=0;
			bld.constructTask=null;
			bld.deadOut=1;
			bld.city.removeBuilding(bld);
			bld.king.removeHashObj(bld);
			bld.city.power.removeCoster(bld);
			bld.city.power.removeGener(bld);
			//发东西
			if(def.levels[level].removeResult)
			{
				bld.city.returnCost(def.levels[level].removeResult,1);
			}
			if(bld.removeResultVO)
			{
				bld.city.returnCost(bld.removeResultVO,1);
			}
			bld.level=0;

			bld.makeViewsDirty();
		}
	};

	//---------------------------------------------------------------------------
	//开启宝箱类障碍物
	window.aisDecoBld.prototype.com_ObsOpenBox=function(comVO)
	{
		var task,cost,newLevel,speed,timeCost;
		var def;
		def=this.def;
		comVO.hashId=this.hashId;
		DBOut("Will start remove by command!!");
		if(this.constructing)
		{
			DBOut("aisBuilding.com_Remove Error 1: building already under building!");
			throw aisBuilding.ERR_InConstruct;
		}
		if(this.working)
		{
			DBOut("aisBuilding.com_Remove Error 2: building is busy!");
			throw aisBuilding.ERR_Busy;
		}
		if(this.level<1)
		{
			DBOut("aisBuilding.com_Remove Error 3, level is not 1!");
			throw aisBuilding.ERR_Busy;
		}
		var level=this.level;
		comVO.gem=this.openCostGem;
		this.city.useCost({gem:this.openCostGem},1,0);
		//TODO: Code for check the req:

			this.removeFeatures();//Remove all features at old level
			this.delDefFactors();
			//this.level=newLevel;
			//检测是否触发任何的解锁？
			this.king.checkDefUnlockVsb(def.levels[level].unlockVsb);

			this.constructing=0;
			this.constructTask=null;
			this.deadOut=1;
			this.city.removeBuilding(this);
			this.king.removeHashObj(this);
			this.city.power.removeCoster(this);
			this.city.power.removeGener(this);
			//发东西
			if(this.boxReward)
			{
				var i,k;
				for(i=0;i<this.boxReward.storage.length;i++)
				{
					if(this.boxReward.storage[i].type.indexOf("plu_")!=-1)
					{
						k=1;
						break;
					}
				}
				if(!k)
					this.city.returnCost(this.boxReward,1);
			}
			this.level=0;

		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//恢复陷阱
	window.aisDecoBld.prototype.com_ResetTraps=function(comVO)
	{
		var i,k,bld,cost,res={storage:[{}]},resNum,list=[];
		if(!comVO.repairType)
			list.push(this.hashId);
		else
			list=this.city.crashedTrapsHash;

		resNum=0;
		for(i=0;i<list.length;i++)
		{
			bld=this.king.getHashObj(list[i]);
			cost=bld.def.levels[bld.level-1].cost;
			resNum+=cost.storage[0].num;
			if(list[i]==this.hashId)
			{
				res.storage[0].store=cost.storage[0].store;
				res.storage[0].type=cost.storage[0].type;
			}
			bld.status=0;
			bld.bCrashed=0;
			bld.makeViewsDirty();
		}
		if(!comVO.repairType)
		{
			list=this.city.crashedTrapsHash;
			for(i=0;i<list.length;i++)
			{
				if(list[i]==this.hashId)
				{
					this.city.crashedTrapsHash.splice(i,1);
					break;
				}
			}
		}

		res.storage[0].num=resNum;
		comVO.resNum=resNum;
		this.city.useCost(res,1,0);
	};
}
}
