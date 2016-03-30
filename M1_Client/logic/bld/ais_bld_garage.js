if(!window.aisGarage)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的制造所的对象类型
window.aisGarage=function(env,city,def)
{
	if(env)
	{
		window.aisBuilding.call(this,env,city,def);
		this.craft=null;
		this.craftIdx=0;
		if(!this.city["bldAll"+def.codeName])
		{
			this.city["bldAll"+def.codeName]=[];
		}
	}
};

window.aisGarage.ERR_NoCraft={level:100,error:"Can't find craft to fix!","class":"aisGarage",code:"ERR_NoCraft"};
window.aisGarage.ERR_HasCraft={level:100,error:"Already has craft, can't have more!","class":"aisGarage",code:"ERR_HasCraft"};
window.aisGarage.ERR_Busy={level:100,error:"Can't start fix, garage is busy!","class":"aisGarage",code:"ERR_Busy"};
window.aisGarage.ERR_NoPow={level:100,error:"No power to start research!","class":"aisGarage",code:"ERR_NoPow"};
window.aisGarage.ERR_MissPart={level:100,error:"Missing major part!","class":"aisGarage",code:"ERR_MissPart"};
window.aisGarage.ERR_MfcNotOn={level:100,error:"Research is not done yet!","class":"aisGarage",code:"ERR_MfcNotOn"};
window.aisGarage.ERR_MfcNotPause={level:100,error:"Research is not done yet!","class":"aisGarage",code:"ERR_MfcNotPause"};
window.aisGarage.ERR_NoCap={level:100,error:"No cap to start MFC.!","class":"aisGarage",code:"ERR_NoCap"};

window.aisGarage.nextCraftIdx=1;

//---------------------------------------------------------------------------
window.aisGarage.prototype=new window.aisBuilding();

//---------------------------------------------------------------------------
//I/O函数--------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//从voObj中读出建筑数据
	window.aisGarage.prototype.readFmVO=function(king,voObj,def)
	{
		var slist,tlist,i,n,slotDef,vo;
		aisBuilding.prototype.readFmVO.call(this,king,voObj,def);
		this.slotCap=voObj.slotCap?voObj.slotCap:0;
		if(voObj.craft)
		{
			//保存机甲信息
			this.craft=aisCraft.readCraft(this,voObj.craft);
			//读取维修情况
			if(this.working)
			{
				//读取当前任务:
				this.workTask=new aisTask(this.env,this,king);
				this.workTask.readFmVO(king,voObj.workTask);
				this.tasks.push(this.workTask);
			}
		}
		this.readValue(voObj,"powCurCostRate");
		if(!this.craftIdx)
		{
			this.craftIdx=aisGarage.nextCraftIdx;
			aisGarage.nextCraftIdx++;
		}
		this.city["bldAll"+def.codeName].push(this);
	};

	//---------------------------------------------------------------------------
	//将建筑数据存入voObj
	window.aisGarage.prototype.saveToVO=function(king,voObj)
	{
		var taskVO,slotDef;
		aisBuilding.prototype.saveToVO.call(this,king,voObj);
		voObj.slotCap=this.slotCap;
		if(this.craft)
		{
			//保存机甲信息
			voObj.craft={};
			this.craft.saveToVO(this,voObj.craft);
			//保存维修情况
			if(this.working && this.workTask)
			{
				taskVO={};
				this.workTask.saveToVO(king,taskVO);
				voObj.workTask=taskVO;
			}
		}
		this.saveValue(voObj,"powCurCostRate");
	};
}

//---------------------------------------------------------------------------
//内部函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//重载aisBuilding的开始建造, 给city的工厂列表增加自己
	window.aisGarage.prototype.startBuild=function(comVO)
	{
		window.aisBuilding.prototype.startBuild.call(this,comVO);
		this.city["bldAll"+this.def.codeName].push(this);
	};
	//---------------------------------------------------------------------------
	//更新建筑数据
	window.aisGarage.prototype.updateByKing=function(king,nowTime,timeGap)
	{
		var pow;
		if(this.workTask)
		{
			this.workTask.valuePerMS=1;//this.getValue("mfcSpeed");
			if(this.working==4)//停滞状态下,试试仓库容量有没有变化能放得下
			{
				//DBOut("Storage was full, paused, try agin now!");
				this.cbk_MfcOver(null,this.workTask,1);
			}
		}
		this.updateBuffs(king,nowTime,timeGap);
		this.updateTasks(king,nowTime,timeGap);
		this.updateValues(nowTime,timeGap);
	};
}

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//发起制造一个或多个物品
	window.aisGarage.prototype.com_NewMac=function(comVO)
	{
		var craft;
		if(this.craft)
		{
			DBOut("aisGarage.com_NewMac ERROR1: already has craft");
			throw aisGarage.ERR_HasCraft;
		}
		if(!comVO.body || !comVO.leg)
		{
			DBOut("aisGarage.com_NewMac ERROR2: no part: "+comVO.body+", "+comVO.leg);
			throw aisGarage.ERR_MissPart;
		}
		craft=new aisCraft(this.env,this);
		DBOut("Set craft body part: "+comVO.body.type+", "+comVO.body.subType);
		DBOut("Set craft leg part: "+comVO.leg.type+", "+comVO.leg.subType);
		craft.setPart("body",comVO.body.type,comVO.body.subType,comVO.body.level);
		craft.setPart("leg",comVO.leg.type,comVO.leg.subType,comVO.body.level);
		craft.state=1;
		if(comVO.addOn)
		{
			craft.setAddOn(comVO.addOn);
		}
		this.craft=craft;
		if(!this.craftIdx)
		{
			this.craftIdx=aisGarage.nextCraftIdx;
			aisGarage.nextCraftIdx++;
		}
	};

	//---------------------------------------------------------------------------
	//修改一个Mac
	window.aisGarage.prototype.com_ChangeMac=function(comVO)
	{
		var craft;
		if(!this.craft)
		{
			DBOut("aisGarage.com_ChangeMac ERROR1: no craft");
			throw aisGarage.ERR_NoCraft;
		}
		if(this.working)
		{
			DBOut("aisGarage.com_DismissMac ERROR2: in fixing");
			throw aisGarage.ERR_Busy;
		}
		craft=this.craft;
		if(comVO.body)
		{
			DBOut("Set craft body part: "+comVO.body.type+", "+comVO.body.subType);
			craft.setPart("body",comVO.body.type,comVO.body.subType);
		}
		if(comVO.leg)
		{
			DBOut("Set craft leg part: "+comVO.leg.type+", "+comVO.leg.subType);
			craft.setPart("leg",comVO.leg.type,comVO.leg.subType);
		}
		if(comVO.addOn)
		{
			if(comVO.addOn.type)
			{
				craft.setAddOn(comVO.addOn.type);
			}
			else
			{
				craft.removeAddOn();
			}
		}
		if(!this.craftIdx)
		{
			this.craftIdx=aisGarage.nextCraftIdx;
			aisGarage.nextCraftIdx++;
		}
	};

	//---------------------------------------------------------------------------
	//拆掉一个Mac
	window.aisGarage.prototype.com_DismissMac=function(comVO)
	{
		var craft;
		if(!this.craft)
		{
			DBOut("aisGarage.com_DismissMac ERROR1: no craft");
			throw aisGarage.ERR_NoCraft;
		}
		if(this.working)
		{
			DBOut("aisGarage.com_DismissMac ERROR2: in fixing");
			throw aisGarage.ERR_Busy;
		}
		craft=this.craft;
		craft.demolish();
		this.craft=null;
	};

	//---------------------------------------------------------------------------
	//开始维修
	window.aisGarage.prototype.com_StartFix=function(comVO)
	{
		var task,tech,time,speed,level;
		var fpow,wpow;
		DBOut("Will start fix: "+toJSON(comVO));
		if(this.working)
		{
			DBOut("aisGarage.com_StartFix Error 1");
			throw aisGarage.ERR_Busy;
		}
		if(this.constructing)
		{
			DBOut("aisGarage.com_StartFix Error 2");
			throw aisGarage.ERR_Busy;
		}
		if(!this.craft)
		{
			DBOut("aisGarage.com_StartFix Error 3");
			throw aisGarage.ERR_NoCraft;
		}
		//TODO:正常操作会出现下面这个异常，应该是研究对话框没有仔细看。
		fpow=this.city.power.getCurFreePower();
		wpow=this.getValue("powCostPerRate")*100;
		if(fpow<wpow)
		{
			DBOut("aisGarage.com_StartFix Error 4!");
			throw aisGarage.ERR_NoPow;
		}
		time=vo.time;
		speed=this.getValue("techSpeed");
		task=this.newTask(this.king.nowTime,"cbk_FixOver",null,time,speed,1.0);
		this.workTask=task;
		this.working=1;
		this.setWorkPowerRate(100);
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//完成维修
	window.aisGarage.prototype.com_FixDone=function(comVO)
	{

	};

	//---------------------------------------------------------------------------
	//用钻石瞬间完成维修:
	window.aisGarage.prototype.com_GemFixDone=function(comVO)
	{
		var gem,time,gemNum;
		comVO.hashId=this.hashId;
		if(!this.working)
		{
			DBOut("aisGarage.com_GemFixDone Error 1: Building is not working!!");
			return;
			//throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisGarage.com_GemFixDone Error 2: Can't find construction task!");
			return;
			//throw aisBuilding.ERR_NoWorkTask;
		}
		comVO.taskHashId=this.workTask.hashId;
		if(this.workTask.isDone())
		{
			DBOut("aisGarage.com_GemFixDone Error 3!");
			//throw aisTechLab.ERR_CaseNotPause;
			return;
		}
		time=this.workTask.getRemainTime();
		gemNum=this.king.convertTime2Gem(time);

		var body=this.craft.slots.body;
		var bdef=window.aisEnv.defLib.part[body.type];
		var rate=bdef.levels[body.level].RepairCoefficient;
		gemNum=Math.floor(gemNum*rate);

		if(this.king.gemNum<gemNum)
		{
			DBOut("aisGarage.com_GemFixDone Error 3: Not enough gems: "+gemNum+" vs "+this.king.gemNum);
			throw aisBuilding.ERR_NoGem;
		}
		this.rushTask=1;
		this.workTask.rushOver(1);
		this.rushTask=0;
		this.king.gemNum-=gemNum;
		comVO.gemNum=gemNum;
		this.city.makeViewsDirty();
		this.king.makeViewsDirty();
	};
	//---------------------------------------------------------------------------
	//切换机甲状态:
	window.aisGarage.prototype.com_StatusMac=function(comVO)
	{
		if(!this.craft)
		{
			DBOut("aisGarage.com_StatusMac ERROR1: no craft");
			throw aisGarage.ERR_NoCraft;
		}
		if(this.working)
		{
			DBOut("aisGarage.com_StatusMac Error 1: Building is working!!");
			return;
			//throw aisBuilding.ERR_NoWorkTask;
		}
		var craft=this.craft;
		craft.state=1-craft.state;
		comVO.state=craft.state;
	};
}

//---------------------------------------------------------------------------
//回调函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisGarage.prototype.cbk_FixOver=function(vo,task,fakeCall)
	{
		this.workTask.taskDone();
		if(!this.rushTask)
		{
			this.king.execFakeCmd(this,"FixDone",{taskHashId:this.workTask.hashId},this,this.king.nowTime);
		}
		this.workTask=null;
		this.working=0;

		var craft=this.craft;
		craft.state=1;

		this.setWorkPowerRate(0);
		this.makeViewsDirty();
	};
}

}
