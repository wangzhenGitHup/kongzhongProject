if(!window.aisBuilding)
{
/*Building的DEF设定:
defBuilding={
	codeName:"Bld_ComPod"
	sizeW:5,sizeH:5,
};
*/
window.aisBuilding=function(env,city,def)
{
	var i,n,list,obj;
	//DBOut("New aisBuilding: "+env+","+def);
	if(env)
	{
		aisObj.call(this,env);
		this.owner=city;
		this.city=city;
		this.king=city.king;
		this.type="Building";
		this.name="Building";
		this.def=def;
		this.pos=[0,0,0];
		this.level=0;
		this.working=0;
		this.constructing=0;
		this.constructWorker=null;
		this.constructTask=null;
		this.defFactors=[];

		if(def.forceHashId)
		{
			obj=this.king.getHashObj(def.forceHashId);
			if(!obj || obj.deadOut)
			{
				this.hashId=def.forceHashId;
			}
		}
		this.dummyUpdate=def.dummyUpdate;

		//增加拥有功能（Feature）的接口
		aisTypes.applyType(this,aisTypes.aisFeatureOwner);
		//增加动态数据修正器的功能
		aisTypes.applyType(this,aisTypes.opFactorOwner);
		//增加拥有动态数值的接口
		aisTypes.applyType(this,aisTypes.aisValueOwner);
		//增加拥有task的接口
		aisTypes.applyType(this,aisTypes.aisTaskOwner);
		//增加拥有task的接口
		aisTypes.applyType(this,aisTypes.aisBuffOwner);
		//增加与UI控件关联的接口
		aisTypes.applyType(this,aisTypes.aisViewConnect);

		//默认既是消耗电的，也是产生电的
		aisTypes.applyType(this,aisTypes.aisPowerCoster);
		aisTypes.applyType(this,aisTypes.aisPowerGener);
		if(typeof(def.levels[0].powUpKeep)=="number")//消耗能量的建筑
		{
			//DBOut("Will add power coster type");
			city.power.addCoster(this);
		}
		if(typeof(def.levels[0].powOutput)=="number")//产生能源的建筑
		{
			//DBOut("Will add power gener type");
			city.power.addGener(this);
		}
	}
};

window.aisBuilding.prototype=new aisObj();

//这个是取消建造、升级的材料返还模式。TODO:增加全局参数控制这个
window.aisBuilding.constructRefund=0.5;
//取消拆除的材料返还
window.aisBuilding.removeRefund=1;

window.aisBuilding.ERR_CanNotBuild={level:100,error:"Can't start build!","class":"aisBuilding",code:"ERR_CanNotBuild"};
window.aisBuilding.ERR_InConstruct={level:100,error:"Building is under construct!","class":"aisBuilding",code:"ERR_InConstruct"};
window.aisBuilding.ERR_Busy={level:100,error:"Building is busy!","class":"aisBuilding",code:"ERR_Busy"};
window.aisBuilding.ERR_NotInConstruct={level:100,error:"Building is not under construct!","class":"aisBuilding",code:"ERR_NotInConstruct"};
window.aisBuilding.ERR_NoConstructTask={level:100,error:"Building is missing construct task!","class":"aisBuilding",code:"ERR_NoConstructTask"};
window.aisBuilding.ERR_NoDestruct={level:100,error:"Can't destruct a none-destructable building","class":"aisBuilding",code:"ERR_NoDestruct"};
window.aisBuilding.ERR_TaskNotOver={level:100,error:"Building task is not finish yet!","class":"aisBuilding",code:"ERR_TaskNotOver"};
window.aisBuilding.ERR_NoWorkTask={level:100,error:"Can't find building's work task or wrong work state!","class":"aisBuilding",code:"ERR_NoWorkTask"};
window.aisBuilding.ERR_NoPow2Resume={level:100,error:"Not enough power to resume work!","class":"aisBuilding",code:"ERR_NoPow2Resume"};
window.aisBuilding.ERR_BadPos={level:100,error:"Not good pos for building!!!","class":"aisBuilding",code:"ERR_BadPos"};
window.aisBuilding.ERR_NoGem={level:100,error:"Not enough gems!","class":"aisBuilding",code:"ERR_NoGem"};

//---------------------------------------------------------------------------
//根据VO创建一个建筑并读出该建筑
window.aisBuilding.readBuilding=function(king,city,voObj)
{
	var def,bld,i,n,list;
	//DBOut(">>>aisBuilding.readBuilding: "+king+", "+city+", "+voObj);
	def=aisEnv.defLib.bld[voObj.codeName];
	if(!def)
	{
		DBOut("aisBuilding.readBuilding Error 1: "+voObj.codeName);
		return null;
	}
	if(def.createFunc)
	{
		//DBOut("aisBuilding.readBuilding create custom building: "+def.codeName);
		bld=new window[def.createFunc](king.env,city,def);
	}
	else
	{
		//DBOut("aisBuilding.readBuilding create default building: "+def.codeName);
		bld=new aisBuilding(king.env,city,def);
	}
	bld.readFmVO(king,voObj,def);
	//DBOut(">>>aisBuilding.readBuilding.");
	return bld;
};

//---------------------------------------------------------------------------
//从voObj中读出建筑数据
window.aisBuilding.prototype.readFmVO=function(king,voObj,def)
{
	var levelInfo,hasPower=0;
	aisObj.prototype.readFmVO.call(this,voObj);
	king.addHashObj(this);

	this.pos=[voObj.pos[0],voObj.pos[1],voObj.pos[2]];
	this.level=voObj.level;
	this.working=voObj.working;
	this.applyFeatures();
	this.addDefFactors();
	this.constructing=voObj.constructing;
	if(this.constructing)
	{
		this.constructTask=new aisTask(this.env,this,king);
		this.constructTask.readFmVO(king,voObj.constructTask);
		this.tasks.push(this.constructTask);
		//TODO: Read worker out!
	}
	this.loadBuffs(king,voObj);
	this.status=voObj.status;

	this.applyPower();
};

//---------------------------------------------------------------------------
//将建筑数据存入voObj
window.aisBuilding.prototype.saveToVO=function(king,voObj)
{
	var taskVO;
	aisObj.prototype.saveToVO.call(this,voObj);
	voObj.pos=[this.pos[0],this.pos[1],this.pos[2]];
	voObj.level=this.level;
	voObj.working=this.working;
	voObj.constructing=this.constructing;
	if(this.constructing)
	{
		taskVO={};
		this.constructTask.saveToVO(king,taskVO);
		voObj.constructTask=taskVO;
	}
	this.saveBuffs(king,voObj);

	//this.saveTasks(king,voObj);
	//this.saveValues(voObj);//TODO: 验证这个的必要性，如果有必要，转换为对单个数值的写入
};

//---------------------------------------------------------------------------
//更新全部静态参数
window.aisBuilding.prototype.updateStatic=function()
{
	if(this.opFactorsNum>0)
		this.updateOpFactors();
	if(this.valuesNum>0)
		this.updateValues();
};

//---------------------------------------------------------------------------
//更新建筑数据
window.aisBuilding.prototype.updateByKing=function(king,nowTime,timeGap)
{
	if(this.buffsNum>0)
		this.updateBuffs(king,nowTime,timeGap);
	if(this.tasks.length)
		this.updateTasks(king,nowTime,timeGap);
	if(this.opFactorsNum>0)
		this.updateOpFactors();
	if(this.valuesNum>0)
		this.updateValues();
};

//---------------------------------------------------------------------------
//添加建筑的所有功能
window.aisBuilding.prototype.applyFeatures=function()
{
	var i,list,n,def;
	var city,king;
	def=this.def;
	city=this.city;
	king=this.king;
	list=def.levels[this.level].features;
	if(list)
	{
		n=list.length;
		for(i=0;i<n;i++)
		{
			//DBOut("Add Bld Feature: "+list[i]);
			this.addFeature(list[i],this);
		}
	}
	list=def.levels[this.level].cityFeatures;
	if(list)
	{
		n=list.length;
		for(i=0;i<n;i++)
		{
			//DBOut("Add City Feature: "+list[i]);
			city.addFeature(list[i],this);
		}
	}
	list=def.levels[this.level].kingFeatures;
	if(list)
	{
		n=list.length;
		for(i=0;i<n;i++)
		{
			//DBOut("Add King Feature: "+list[i]);
			king.addFeature(list[i],this);
		}
	}
};

//---------------------------------------------------------------------------
//移除建筑的所有功能
window.aisBuilding.prototype.removeFeatures=function()
{
	var i,list,n,def;
	def=this.def;
	list=def.levels[this.level].features;
	if(list)
	{
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.removeFeature(list[i],this);
		}
	}
	list=def.levels[this.level].cityFeatures;
	if(list)
	{
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.city.removeFeature(list[i],this);
		}
	}
	list=def.levels[this.level].kingFeatures;
	if(list)
	{
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.king.removeFeature(list[i],this);
		}
	}
};

//---------------------------------------------------------------------------
//根据DEF增加Factors
window.aisBuilding.prototype.addDefFactors=function()
{
	var def,list,i,n,host,item,factor;
	def=this.def;
	list=def.levels[this.level].factors;
	if(!list)
		return;
	//DBOut("AddDefFctors: "+this.hashId);
	n=list.length;
	for(i=0;i<n;i++)
	{
		item=list[i];
		host=this.getUpperScope(item.scope);
		if(host)
		{
			factor=new aisOpFactor(this.env,this);
			if(item.add)
				factor.addFactor=item.add;
			if(item.mulV)
				factor.mulVFactor=item.mulV;
			if(item.mulB)
				factor.mulBFactor=item.mulB;
			//DBOut("Add DefFctor: "+item.name);
			host.addOpFactor(item.name,factor);
			this.defFactors.push(factor);
		}
	}
};

//---------------------------------------------------------------------------
//删除根据DEF增加的Factors
window.aisBuilding.prototype.delDefFactors=function()
{
	var list,i,n;

	//DBOut("DelDefFctors!");
	list=this.defFactors;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].owner=null;
	}
	list.splice(0,n);
};

//---------------------------------------------------------------------------
//根据建筑当前的情况，设定能量
window.aisBuilding.prototype.applyPower=function()
{
	var levelInfo,hasPower;
	var city=this.city;
	levelInfo=this.def.levels[this.level];
	//取消自己当前的能源消耗/产出
	city.power.removeGener(this);
	city.power.removeCoster(this);
	if(this.constructing)//建筑物在建造、升级中
	{
		if(levelInfo.req.power)
		{
			//DBOut("Will add build power: "+levelInfo.req.power+", "+levelInfo.powCostPerRate);
			city.power.addCoster(this);
			this.setValue("powUpKeep",levelInfo.req.power,1);
			this.setValue("powCostPerRate",levelInfo.powCostPerRate,1);
			city.power.update();
		}
	}
	else//建筑物正常状态,包括工作中
	{
		if(levelInfo.powUpKeep)//消耗能量的建筑
		{
			//DBOut("Building upKeep: "+levelInfo.powUpKeep);
			this.setValue("powUpKeep",levelInfo.powUpKeep,1);
			this.setValue("powCostPerRate",levelInfo.powCostPerRate,1);
			city.power.addCoster(this);
			hasPower=1;
		}
		if(levelInfo.powOutput)//产生能量的建筑
		{
			this.setValue("powOutput",levelInfo.powOutput,1);
			city.power.addGener(this);
			hasPower=1;
		}
		if(hasPower)
		{
			city.power.update();
		}
	}
};

//---------------------------------------------------------------------------
//开始建造
window.aisBuilding.prototype.startBuild=function(comVO)
{
	var task,cost;
	var def,levelInfo;
	var speed,timeCost;
	def=this.def;
	var level=0;
	levelInfo=def.levels[this.level];
	if(this.level>0)
	{
		DBOut("aisBuilding.com_Build Error 1: building already has level, can't build!");
		throw aisBuilding.ERR_CanNotBuild;
	}
	if(this.constructing)
	{
		DBOut("aisBuilding.com_Build Error 2: building already under building!");
		throw aisBuilding.ERR_InConstruct;
	}
	if(this.working)
	{
		DBOut("aisBuilding.com_Build Error 3: building is busy!");
		throw aisBuilding.ERR_Busy;
	}
	//Fist check if meet req
	//TODO: Code for check the req and take the cost:

	//2nd: set building's position and start the build task:;
	this.pos[0]=comVO.x;
	this.pos[1]=comVO.y;
	cost=this.def.levels[0].cost;
	timeCost=cost.time;
	this.king.addHashObj(this);
	if(timeCost)
	{
		//DBOut("Will issue build task, now: "+this.king.nowTime+", time: "+this.def.levels[0].cost.time);
		speed=this.city.getValue("bldSpeed");
		//DBOut("Build speed: "+speed);
		task=this.newTask(this.king.nowTime,"cbk_constructOver",null,this.def.levels[0].cost.time,speed,1.0);
		task.taskCost=cost;
		this.constructWorker=this.city.useBldWorker(this);
		comVO.wokerId=this.constructWorker.owner.hashId;
		//DBOut("Get worker: "+this.constructWorker);
		this.constructing=1;
		this.constructTask=task;
		this.applyPower();
		this.applyFeatures();
		this.addDefFactors();
		if(window.MP)
			window.MP.addPushList(this.hashId,1,Math.floor(timeCost/1000));
	}
	else//瞬间完成的建筑
	{
		this.level=1;
		this.applyFeatures();//Apply all features at the new level
		this.king.checkQuests();
		this.makeViewsDirty();

		//检测是否触发任何的解锁？
		this.king.checkDefUnlockVsb(def.levels[this.level].unlockVsb);
		if(!def.buildNotNeedWorker)
		{
			this.constructWorker=this.city.useBldWorker(this);
			comVO.wokerId=this.constructWorker.owner.hashId;
			this.city.freeBldWorker(this.constructWorker);
		}
		this.constructWorker=null;
		this.constructing=0;
		this.constructTask=null;
		this.applyPower();
		this.addDefFactors();

		if(this.onConstructDone)
		{
			this.onConstructDone();
		}
	}

};

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//开始升级
	window.aisBuilding.prototype.com_Upgrade=function(comVO)
	{
		var task,cost,newLevel,speed,timeCost;
		var def;
		def=this.def;
		//DBOut("Will start upgrade by command!!");
		if(this.constructing)
		{
			DBOut("aisBuilding.com_Build Error 2: building already under building!");
			throw aisBuilding.ERR_InConstruct;
		}
		if(this.working)
		{
			DBOut("aisBuilding.com_Build Error 3: building is busy!");
			throw aisBuilding.ERR_Busy;
		}
		comVO.level=this.level;
		cost=def.levels[this.level].cost;
		this.city.useCost(cost,1,0);
		newLevel=this.level+1;

		//Fist check if meet req
		//TODO: Code for check the req:
		timeCost=cost.time
		if(timeCost)
		{
			//2nd: set building's position and start the build task:;
			speed=this.city.getValue("bldSpeed");
			//DBOut("Build speed: "+speed);
			task=this.newTask(this.king.nowTime,"cbk_constructOver",null,cost.time,speed,1.0);
			task.taskCost=cost;
			this.constructWorker=this.city.useBldWorker(this);
			comVO.wokerId=this.constructWorker.owner.hashId;
			this.constructing=1;
			this.constructTask=task;
			if(window.MP)
				window.MP.addPushList(this.hashId,1,Math.floor(timeCost/1000));
		}
		else
		{
			this.removeFeatures();//Remove all features at old level
			this.delDefFactors();
			this.level=newLevel;
			this.applyFeatures();//Apply all features at the new level
			this.king.checkQuests();

			//检测是否触发任何的解锁？
			this.king.checkDefUnlockVsb(def.levels[this.level].unlockVsb);

			if(!def.buildNotNeedWorker)
			{
				this.constructWorker=this.city.useBldWorker(this);
				comVO.wokerId=this.constructWorker.owner.hashId;
				this.city.freeBldWorker(this.constructWorker);
			}

			this.constructing=0;
			this.constructTask=null;
			this.applyPower();
			this.addDefFactors();

			if(this.onConstructDone)
			{
				this.onConstructDone();
			}
		}
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//取消建造/升级
	window.aisBuilding.prototype.com_AbortConstruct=function(comVO)
	{
		comVO.hashId=this.hashId;
		if(!this.constructing)
		{
			DBOut("aisBuilding.cancelConstruct Error 1: Building is not in construct!!");
			throw aisBuilding.ERR_NotInConstruct;
		}
		if(!this.constructTask)
		{
			DBOut("aisBuilding.cancelConstruct Error 2: Can't find construction task!");
			throw aisBuilding.ERR_NoConstructTask;
		}
		if(this.def.levels[this.level].costs)
		{
			var num=this.city.getValue("numBld"+this.def.codeName);
			var cost=this.def.levels[this.level].costs[num-1];
			this.constructTask.taskCost=cost;
		}
		this.giveUpTask(this.constructTask,aisBuilding.constructRefund);
		//this.constructTask.giveUp(aisBuilding.constructRefund);
		//DBOut("Will free worker: "+this.constructWorker+", "+this.hashId);
		this.city.freeBldWorker(this.constructWorker);
		this.constructing=0;
		this.constructTask=null;

		if(window.MP)
			window.MP.removePushList(this.def.codeName,1);

		if(this.level==0)//取消的是建造
		{
			this.city.removeBuilding(this);
			this.king.removeHashObj(this);
			this.deadOut=1;
		}
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//建造/升级完成
	window.aisBuilding.prototype.com_ConstructDone=function()
	{
		var def;
		var levelInfo;
		def=this.def;
		//DBOut("com_ConstructDone:1");
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
		//DBOut("com_ConstructDone:2");
		this.constructTask.taskDone();
		//if(this.level>0)
		{
			this.removeFeatures();//Remove all features at old level
			this.delDefFactors();
		}
		//DBOut("com_ConstructDone:3");
		this.level+=1;
		levelInfo=def.levels[this.level];

		if(levelInfo.attackCost)
			this.city.attackCost=levelInfo.attackCost;

		this.applyFeatures();//Apply all features at the new level
		this.king.checkQuests();
		this.makeViewsDirty();

		//检测是否触发任何的解锁？
		this.king.checkDefUnlockVsb(def.levels[this.level].unlockVsb);
		//DBOut("Will free worker: "+this.constructWorker+", "+this.hashId);
		this.city.freeBldWorker(this.constructWorker);
		this.constructing=0;
		this.constructTask=null;
		this.constructWorker=null;
		this.applyPower();
		this.addDefFactors();

		if(this.onConstructDone)
		{
			this.onConstructDone();
		}
		if(this.def.codeName=="Barrack")
		{
			this.city.addTrainFullPushMsg();
		}
	};

	//---------------------------------------------------------------------------
	//拆除当前建筑
	window.aisBuilding.prototype.com_Destruct=function()
	{
		if(this.constructing)
		{
			DBOut("aisBuilding.com_Build Error 2: building already under building!");
			throw aisBuilding.ERR_InConstruct;
		}
		if(this.working)
		{
			DBOut("aisBuilding.com_Build Error 3: building is busy!");
			throw aisBuilding.ERR_Busy;
		}
		if(this.def.noDestruct)
		{
			DBOut("aisBuilding.com_Destruct Error 1: Can't destruct a must have building: "+this.def.codeName);
			throw aisBuilding.ERR_NoConstructTask;
		}
		this.removeFeatures();//Remove all features at level
		this.city.removeBuilding(this);
		this.deadOut=1;
		this.king.removeHashObj(this);
		this.level=0;
		if(this.level>0)
		{
			if(def.powUpKeep)//消耗能量的建筑
			{
				this.city.power.removeCoster(this);
			}
			else if(def.powOutput)//产生能量的建筑
			{
				this.city.power.removeGener(this);
			}
		}
	};

	//---------------------------------------------------------------------------
	//移动
	window.aisBuilding.prototype.com_MovePos=function(vo)
	{
		/*if(!this.city.checkBuildingPos(this.def,vo.x,vo.y,this))
		{
			DBOut("aisBuilding.com_MovePos Error 1: Can't move a building: "+this.def.codeName);
			throw aisBuilding.ERR_BadPos;
		}*/
		this.pos[0]=vo.x;
		this.pos[1]=vo.y;
		this.pos[2]=vo.z;
	};

	//---------------------------------------------------------------------------
	//暂停工作
	window.aisBuilding.prototype.com_PauseWork=function(comVO)
	{
		//TODO: 检查状态
		this.pauseWork();
	};

	//---------------------------------------------------------------------------
	//继续工作
	window.aisBuilding.prototype.com_ResumeWork=function(comVO)
	{
		//TODO: 检查状态
		this.resumeWork();
	};

	//---------------------------------------------------------------------------
	//增加Buff
	window.aisBuilding.prototype.com_AddBuff=
	window.aisBuilding.prototype.com_AddBuffTrain=function(comVO)
	{
		var task,cost,newLevel,speed,timeCost;
		var def;
		//DBOut("Will add a buff: "+comVO.codeName);
		if(this.constructing)
		{
			DBOut("aisBuilding.com_AddBuff Error 1: building under building!");
			throw aisBuilding.ERR_InConstruct;
		}
		def=aisEnv.defLib.buff[comVO.codeName];
		if(!def)
		{
			DBOut("aisBuilding.com_AddBuff Error 2: can't find Buff: "+comVO.codeName);
			throw aisBuilding.ERR_InConstruct;
		}

		cost=def.cost;
		comVO.gemNum=cost.gem;
		this.city.useCost(cost,1,0);
		this.bindBuff(comVO.codeName);
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//取消一个Buff:
	window.aisBuilding.prototype.com_RemoveBuff=function(comVO)
	{
		this.removeBuff(comVO.codeName);
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//用钻石瞬间完成升级/建造:
	window.aisBuilding.prototype.com_GemConstructDone=function(comVO)
	{
		var gem,time,gemNum;
		comVO.hashId=this.hashId;
		if(!this.constructing)
		{
			DBOut("aisBuilding.com_GemConstructDone Error 1: Building is not in construct!!");
			return;
			//throw aisBuilding.ERR_NotInConstruct;
		}
		if(!this.constructTask)
		{
			DBOut("aisBuilding.com_GemConstructDone Error 2: Can't find construction task!");
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
				DBOut("aisBuilding.com_GemConstructDone Error 3: Not enough gems: "+gemNum+" vs "+this.king.gemNum);
				throw aisBuilding.ERR_NoGem;
			}
			this.king.gemNum-=gemNum;
			comVO.gemNum=gemNum;
			this.king.sendNTCmd(this,"GemConstructDone",comVO,this);
			this.constructTask.rushOver(1);
			this.city.makeViewsDirty();
			this.king.makeViewsDirty();
		}
		if(window.MP)
			window.MP.removePushList(this.def.codeName,1);
	};
	//---------------------------------------------------------------------------
	//消减升级/建造时间:
	window.aisBuilding.prototype.com_CutConstructTimeByGem=
	window.aisBuilding.prototype.com_CutConstructTime=function(comVO)
	{
		var task;
		comVO.hashId=this.hashId;
		if(!this.constructing)
		{
			DBOut("aisBuilding.com_CutConstructTime Error 1: Building is not in construct!!");
			return;
		}
		if(!this.constructTask)
		{
			DBOut("aisBuilding.com_CutConstructTime Error 2: Can't find construction task!");
			return;
		}
		task=this.constructTask;
		task.cutRemainTime(comVO.time);
		if(comVO.type=="gem")
			this.city.useCost({gem:comVO.gem},1,0);
		else
			this.city.useCost({storage:[{store:"CutTime",type:"CutTime",num:Math.floor(comVO.time/60000)}]},1,0);
		comVO.flag=0;
		if(!this.constructTask.getRemainTime())
		{
			comVO.flag=1;
			this.constructTask.rushOver(1);
			if(this.king.achvmnts)
			{
				this.king.achvmnts.onExecCom(this,"ConstructDone",{});
			}
			if(this.king.dailytasks)
			{
				this.king.dailytasks.onExecCom(this,"ConstructDone",{});
			}
		}

	};
}

//---------------------------------------------------------------------------
//工作暂停、函数-------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//暂停当前工作
	window.aisBuilding.prototype.pauseWork=function()
	{
		if(!this.working)
		{
			DBOut("aisBuilding.pauseWork Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisBuilding.pauseWork Error 2!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(this.workTask.isOn())
		{
			this.workTask.pause();
			this.setWorkPowerRate(0);
			this.working=3;
			this.makeViewsDirty();
		}
	};
	//---------------------------------------------------------------------------
	//继续当前暂停的工作
	window.aisBuilding.prototype.resumeWork=function()
	{
		var fpow,wpow;
		if(this.working!=3)
		{
			DBOut("aisBuilding.resumeWork Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisBuilding.resumeWork Error 2!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		fpow=this.city.power.getCurFreePower();
		wpow=this.getValue("powCostPerRate")*100;
		if(fpow<wpow)
		{
			DBOut("aisBuilding.resumeWork Error 3!");
			throw aisBuilding.ERR_NoPow2Resume;
		}
		if(this.workTask.isPaused())
		{
			this.workTask.resume();
			this.setWorkPowerRate(100);
			this.working=1;
			this.makeViewsDirty();
		}
	};
}
//---------------------------------------------------------------------------
//回调函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisBuilding.prototype.cbk_constructOver=function(vo,task)
	{
		//DBOut("Construct done: "+vo+", "+task);
		this.constructing=2;
		this.makeViewsDirty();
		//自动完成建造?
		if(this.env.cfg.bldAutoConstructDone)
		{
			this.com_ConstructDone();
			if(task && task.isRushed)
			{
				return;
			}
			if(1)//客户端模式下, 向服务器发送这个消息
			{
				this.king.execFakeCmd(this,"ConstructDone",{},this,this.king.nowTime);
			}
		}
	};

	//Buff消失的回调
	window.aisBuilding.prototype.onBuffOver=function(buff)
	{
		this.makeViewsDirty();
		if(1)//客户端模式下, 向服务器发送这个消息
		{
			this.king.execFakeCmd(this,"BuffOver",{codeName:buff.codeName},this,this.king.kingTime());
		}
	};
}

//---------------------------------------------------------------------------
//界面点击操作---------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisBuilding.prototype.ui_onClick=function(uiEnv,state)
	{
		var page=uiEnv.page;
		//DBOut("Building on click: "+state+","+page);
		switch(state)
		{
		case 0:
			if(this.def.dlg_info)
			{
				//DBOut("Open certain info dialog.");
				uiEnv.openPageDlg(page.genURL("states/dlg_bldinfo_"+this.def.dlg_info+".jml"),this);
			}
			else
			{
				uiEnv.openPageDlg(page.genURL("states/dlg_bldinfo.jml"),this);
			}
			break;
		};
	};
}


//---------------------------------------------------------------------------
//buff---------------------------------------------------------------
//---------------------------------------------------------------------------
window.aisBuilding.prototype.getBuffRemainTime=function(codename)
{
	var buff=this.buffs[codename];
	if(!buff)return 0;
	if(buff.deadOut)return 0;

	return buff.endTime-this.king.nowTime;
};

}
