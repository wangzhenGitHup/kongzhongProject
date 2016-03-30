if(!window.aisBldClan)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
window.aisBldClan=function(env,city,def)
{
	var vname,pname,factor,store;
	if(env)
	{
		window.aisBldStorage.call(this,env,city,def);
		this.name="BldClan";
	}
};
window.aisBldClan.ERR_LabBusy={level:100,error:"Can't start research, lab is busy!","class":"aisBldClan",code:"ERR_LabBusy"};
//---------------------------------------------------------------------------
window.aisBldClan.prototype=new window.aisBldStorage();

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//从Building继承来的函数:
{
	//---------------------------------------------------------------------------
	//从voObj中读出建筑数据
	window.aisBldClan.prototype.readFmVO=function(king,voObj,def)
	{
		aisBuilding.prototype.readFmVO.call(this,king,voObj,def);

		this.signIn=voObj.signIn;
		this.dailyDonateTimes=voObj.dailyDonateTimes;
		//读出拆掉后获取的奖励, 这个不在def里, 由服务器或者创建的时候决定
		if(this.working)
		{
			//读取当前任务:
			this.workTask=new aisTask(this.env,this,king);
			this.workTask.readFmVO(king,voObj.workTask);
			this.tasks.push(this.workTask);
		}
	};

	//---------------------------------------------------------------------------
	//将建筑数据存入voObj
	window.aisBldClan.prototype.saveToVO=function(king,voObj)
	{
		var taskVO;
		aisBuilding.prototype.saveToVO.call(this,king,voObj);

		voObj.signIn=this.signIn;
		voObj.dailyDonateTimes=this.dailyDonateTimes;
		//保存拆掉后获取的奖励, 这个不在def里, 由服务器或者创建的时候决定
		if(this.working && this.workTask)
		{
			taskVO={};
			this.workTask.saveToVO(king,taskVO);
			voObj.workTask=taskVO;
		}
	};
	//--------------------------------------------------------------
	//申请增援
	window.aisBldClan.prototype.com_ClanReinforce=function(comVO)
	{
		var def,task,cost,time,speed;
		if(this.constructing)
		{
			DBOut("aisBldClan.com_ClanReinforce Error 2");
			throw aisBldClan.ERR_LabBusy;
		}
		if(this.working)
		{
			DBOut("aisBldClan.com_ClanReinforce Error 3");
			throw aisBldClan.ERR_LabBusy;
		}
		time=this.def.levels[this.level].reinforceTime;
		if(comVO.cdRequestTime)
			time-=comVO.cdRequestTime;

		//speed=this.getValue("mfcSpeed");
		speed=1;
		task=this.newTask(this.king.nowTime,"cbk_ReinforceOver",null,time,speed,1.0);
		this.workTask=task;
		this.working=1;
		this.makeViewsDirty();
	};

	//--------------------------------------------------------------
	//钻秒增援CD
	window.aisBldClan.prototype.com_GemFinReinforce=function(comVO)
	{
		if(!this.working)
		{
			DBOut("aisBldClan.com_GemFinReinforce Error 3");
			return;
		}
		if(!this.workTask)
		{
			DBOut("aisBldClan.com_GemFinReinforce Error 3");
			return;
		}
		if(comVO.gemNum)
			this.city.useCost({gem:comVO.gemNum},1);
		this.workTask.rushOver(1);
	};

	//--------------------------------------------------------------
	//驻扎
	window.aisBldClan.prototype.com_FortAddUnit=function(comVO)
	{
		var tlist,slist,i,n,slot,store;

		if(this.constructing)
		{
			DBOut("aisBldClan.com_ClanReinforce Error 2");
			throw aisBldClan.ERR_LabBusy;
		}
		tlist=[{type:comVO.type,num:comVO.num,store:"Unit"}];
		if(!this.city.checkTakeOut(tlist))
		{
			//DBOut("aisCoCCity.com_DonateClan ERROR 2: "+toJSON(tlist));
			throw aisCity.ERR_SellTooMuch;
		}

		var task=this.newTask(this.king.nowTime,"cbk_FortAddUnitOver",null,1,1,1.0);
		this.fortTask=task;
		task.tlist=tlist;
		task.slist=[{type:comVO.type,subType:""+comVO.level,num:comVO.num,store:this.def.cityStorage}];

		if(comVO.gem)
			this.city.useCost({gem:comVO.gem},1,0);

		this.makeViewsDirty();
		this.city.makeViewsDirty();
	};
//---------------------------------------------------------------------------
//回调函数-------------------------------------------------------------------
//---------------------------------------------------------------------------

	window.aisBldClan.prototype.cbk_ReinforceOver=function(vo,task,fakeCall)
	{
		this.workTask.taskDone();
		this.workTask=null;
		this.working=0;
		this.makeViewsDirty();
	};

	window.aisBldClan.prototype.cbk_FortAddUnitOver=function(vo,task,fakeCall)
	{
		this.city.doTakeOut(this.fortTask.tlist,{},this);
		var store=this.cityStorage;
		store.putItemsIn(this.fortTask.slist,1);

		this.fortTask.taskDone();
		this.fortTask=null;
	};
}
}
