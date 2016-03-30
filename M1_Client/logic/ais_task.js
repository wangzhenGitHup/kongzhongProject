if(!window.aisTask)
{
//---------------------------------------------------------------------------
//游戏中拥有动态数值的对象
window.aisTypes.aisTaskOwner=function()
{
	this.tasks=[];
};

//---------------------------------------------------------------------------
window.aisTypes.aisTaskOwner.addTask=function(task)
{
	if(task.owner!=this)
	{
		DBOut("aisTaskOwner.addTask Error 1: "+task);
		return;
	}
	this.tasks.push(task);
};

//---------------------------------------------------------------------------
window.aisTypes.aisTaskOwner.newTask=function(nowTime,cmd,cmdvo,value,speed,rate)
{
	var task;
	task=new aisTask(this.env,this,this.king);
	task.start(nowTime,cmd,cmdvo,value,speed,rate);
	this.tasks.push(task);
	return task;
};

//---------------------------------------------------------------------------
window.aisTypes.aisTaskOwner.giveUpTask=function(task,refund)
{
	var i,n,list;
	if(task.owner!=this)
	{
		DBOut("aisTaskOwner.cancelTask Error 1: "+task);
		return;
	}
	list=this.tasks;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(list[i]==task)
		{
			task.giveUp(refund);
			return;
		}
	}
	DBOut("aisTaskOwner.cancelTask Error 2: "+task);
};

//---------------------------------------------------------------------------
window.aisTypes.aisTaskOwner.updateTasks=function(king,nowTime,gap)
{
	var i,n,list;
	list=this.tasks;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].updateByKing(king,nowTime,gap);
		if(list[i].state==aisTask.STATE_DONE || list[i].state==aisTask.STATE_CANCELED)
		{
			list.splice(i,1);
			i--;
			n--;
		}
	}
}

//---------------------------------------------------------------------------
window.aisTypes.aisTaskOwner.saveTasks=function(king,voObj)
{
	var i, n, list;
	list = this.tasks;
	voObj.tasks = [];
	n = list.length;
	for(i = 0; i < n; i++)
	{
		voObj.tasks[i] = {};
		list[i].saveToVO(king, voObj.tasks[i]);
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisTaskOwner.readTasks=function(king,voObj)
{
	var i,n,list;
	list=this.tasks;
	n=voObj.tasks.length;
	for(i=0;i<n;i++)
	{
		list[i]=new aisTask(this.env,this,king);
		list[i].readFmVO(king,voObj.tasks[i]);
	}
}

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
window.aisTask=function(env,owner,king)
{
	var date;
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=owner;
		this.king=king;
		this.name="Task";
		this.type="Task";
		this.startTime=0;
		this.endTime=0;
		this.tgtValue=0;
		this.curValue=0;
		this.valuePerMS=1;
		this.workRate=1;
		this.state=0;
		this.overFunc=null;
		this.overFuncVO=null;
		this.taskCost=null;
		this.timeTrigger=1;
		this.isRushed=0;
	}
};
window.aisTask.STATE_NEW=0;
window.aisTask.STATE_ON=1;
window.aisTask.STATE_PAUSED=2;
window.aisTask.STATE_OVER=3;
window.aisTask.STATE_CANCELED=4;
window.aisTask.STATE_DONE=5;

window.aisTask.prototype=new aisObj();

//---------------------------------------------------------------------------
window.aisTask.prototype.readFmVO=function(king,voObj)
{
	var i,n,list,def;
	aisObj.prototype.readFmVO.call(this,voObj);
	this.startTime=voObj.startTime;
	this.endTime=voObj.endTime;
	this.tgtValue=voObj.tgtValue;
	this.curValue=voObj.curValue;
	this.valuePerMS=voObj.valuePerMS;
	this.workRate=voObj.workRate;
	this.state=voObj.state;
	this.overFunc=voObj.overFunc;
	this.timeTrigger=voObj.timeTirgger;
	this.overFuncVO=voObj.overFuncVO;
	this.taskCost=voObj.taskCost;
	/*list=voObj.taskCost;
	if(list && list.length>0)
	{
		this.taskCost=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.taskCost[i]={type:list[i].type,num:list[i].num,subType:list[i].subType};
		}
	}*/
	//king.addHashObj(this);
};

//---------------------------------------------------------------------------
window.aisTask.prototype.saveToVO = function(king, voObj)
{
	var i,n,list;
	aisObj.prototype.saveToVO.call(this, voObj);
	voObj.startTime = this.startTime;
	voObj.endTime = this.endTime;
	voObj.tgtValue = this.tgtValue;
	voObj.curValue = this.curValue;
	voObj.valuePerMS = this.valuePerMS;
	voObj.workRate = this.workRate;
	voObj.state = this.state;
	voObj.overFunc = this.overFunc;
	voObj.timeTrigger = this.timeTirgger;
	voObj.overFuncVO = this.overFuncVO;
	if(this.taskCost)
	{
		voObj.taskCost = this.taskCost;
	}
};

//---------------------------------------------------------------------------
window.aisTask.prototype.start = function(nowTime, cmd, cmdvo, value, speed, rate)
{
	if(!value>0)
	{
		DBOut("aisTask.start Error 1: "+value);
		return;
	}
	this.startTime = nowTime;
	this.tgtValue = value;
	this.curValue = 0;
	this.valuePerMS = speed;
	this.workRate = rate;
	this.overFunc = cmd;
	this.overFuncVO = cmdvo;
	this.state = aisTask.STATE_ON;
	this.updateTime(this.king, nowTime);
	//this.king.addHashObj(this);
}

//---------------------------------------------------------------------------
window.aisTask.prototype.isOn = function()
{
	if(this.state === aisTask.STATE_ON)
	{
		return 1;
	}
	return 0;
};

//---------------------------------------------------------------------------
window.aisTask.prototype.isOver = function()
{
	if(this.state === aisTask.STATE_OVER)
	{
		return 1;
	}
	return 0;
};

//---------------------------------------------------------------------------
window.aisTask.prototype.isDone = function()
{
	if(this.state === aisTask.STATE_DONE)
	{
		return 1;
	}
	return 0;
};

//---------------------------------------------------------------------------
window.aisTask.prototype.isPaused = function()
{
	if(this.state === aisTask.STATE_PAUSED)
	{
		return 1;
	}
	return 0;
};

//---------------------------------------------------------------------------
window.aisTask.prototype.pause = function()
{
	if(this.state != aisTask.STATE_ON)
	{
		DBOut("aisTask.pause Error 1!");
		return;
	}
	this.state = aisTask.STATE_PAUSED;
};

//---------------------------------------------------------------------------
window.aisTask.prototype.resume = function()
{
	if(this.state != aisTask.STATE_PAUSED)
	{
		DBOut("aisTask.resume Error 1!");
		return;
	}
	this.state = aisTask.STATE_ON;
};

//---------------------------------------------------------------------------
window.aisTask.prototype.setWorkRate = function(nowTime, rate)
{
	if(this.state != aisTask.STATE_ON)
	{
		DBOut("aisTask.setWorkRate Error 1!");
		return;
	}
	if(rate <= 0)
	{
		DBOut("aisTask.setWorkRate Error 2!");
		return;
	}
	this.workRate = rate;
	this.updateTime(this.king, nowTime);
};

//---------------------------------------------------------------------------
window.aisTask.prototype.getWorkRate = function()
{
	return this.workRate;
}

//---------------------------------------------------------------------------
window.aisTask.prototype.getProgress = function()
{
	var v;
	if(this.state == aisTask.STATE_ON || this.state == aisTask.STATE_PAUSED)
	{
		v = (this.curValue) / this.tgtValue;
		v = v < 0 ? 0 : v;
		v = v > 1 ? 1 : v;
		return v;
	}
	return 0;
}

//---------------------------------------------------------------------------
window.aisTask.prototype.getRemainTime = function()
{
	var left, time;
	if(this.state == aisTask.STATE_ON || this.state == aisTask.STATE_PAUSED)
	{
		return (this.tgtValue - this.curValue) / (this.valuePerMS * this.workRate);
	}
	return 0;
}

//---------------------------------------------------------------------------
window.aisTask.prototype.getRemainTimeByReviseRate = function(rate)
{
	var left, time;
	if(this.state == aisTask.STATE_ON || this.state == aisTask.STATE_PAUSED)
	{
		return (this.tgtValue - this.curValue) * rate / (this.valuePerMS * this.workRate);
	}
	return 0;
}

//---------------------------------------------------------------------------
window.aisTask.prototype.getTotalTime = function()
{
	return (this.tgtValue) / (this.valuePerMS * this.workRate);
}

//---------------------------------------------------------------------------
window.aisTask.prototype.cutRemainTime=function(ctime)
{
	if(this.state==aisTask.STATE_ON || this.state==aisTask.STATE_PAUSED)
	{
		this.curValue=Math.min(this.tgtValue,this.curValue+ctime*(this.valuePerMS*this.workRate));
	}
}

//---------------------------------------------------------------------------
window.aisTask.prototype.updateTime=function(king,nowTime)
{
	var left,time;
	if(this.state==aisTask.STATE_ON)
	{
		left=this.tgtValue-this.curValue;
		time=Math.floor(left/(this.valuePerMS*this.workRate));
		this.endTime=nowTime+time;
		if(this.timeTrigger)
		{
			//DBOut("setTriggerTime: "+(this.endTime+10));
			king.setTriggerTime(this.endTime-10);//少10毫秒，保证不能完成
			king.setTriggerTime(this.endTime+10);//多10毫秒，保证肯定完成
		}
	}
	else
	{
		this.endTime=0;
	}
};

//---------------------------------------------------------------------------
window.aisTask.prototype.updateByKing=function(king,nowTime,timeGap)
{
	if(this.state==aisTask.STATE_ON)//On going
	{
		this.curValue+=timeGap*this.valuePerMS*this.workRate;
		this.updateTime(king,nowTime);
		if(this.curValue>=(this.tgtValue))
		{
			DBOut("Task will done!");
			this.curValue=this.tgtValue;
			this.state=aisTask.STATE_OVER;
			if(this.overFunc)
			{
				this.owner[this.overFunc](this.overFuncVO,this);
			}
		}
	}
};

//---------------------------------------------------------------------------
//放弃任务，只可能来自用户的操作，不会来自Update等.
window.aisTask.prototype.giveUp=function(refund)
{
	var cost,owner,list,i,n,store,city,item,svo;
	if(this.state!=aisTask.STATE_ON && this.state!=aisTask.STATE_PAUSED)
	{
		DBOut("aisTask.giveUp Error 1!");
		return;
	}
	this.state=aisTask.STATE_CANCELED;
	if(refund)
	{
		//返还任务所消耗的资源:
		cost=this.taskCost;
		city=this.getUpperScope("City");
		if(cost.cash)
		{
			this.king.cashNum+=Math.floor(cost.cash*refund);
		}
		if(cost.gem)
		{
			this.king.gemNum+=Math.floor(cost.gem*refund);
			city.makeViewsDirty();
		}

		list=cost.storage;
		n=list.length;
		svo={};
		for(i=0;i<n;i++)
		{
			item=list[i];
			store=city.allStorages[item.store];
			if(store)
			{
				svo.type=item.type;
				svo.num=Math.floor(item.num*refund);
				if(svo.num>0)
					store.putIn(svo);
			}
		}
	}
	//this.king.removeHashObj(this);
	if(this.owner.onTaskGiveUp)
	{
		this.owner.onTaskGiveUp(this);
	}
	this.deadOut=1;
};

//---------------------------------------------------------------------------
//任务瞬间完成, 通常用于钻石加速
window.aisTask.prototype.rushOver=function(callback)
{
	if(this.state==aisTask.STATE_ON)//On going
	{
		this.curValue=this.tgtValue;
		this.state=aisTask.STATE_OVER;
		this.isRushed=1;
		if(callback && this.overFunc)
		{
			this.owner[this.overFunc](this.overFuncVO,this);
		}
	}
};

//---------------------------------------------------------------------------
//任务完成，只可能来自用户的操作，不会来自Update等.
window.aisTask.prototype.taskDone=function()
{
	if(this.state==aisTask.STATE_OVER)//can be done
	{
		this.state=aisTask.STATE_DONE;
		this.deadOut=1;
	}
};

}
