if(!window.aisWorkshop)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的制造所的对象类型
window.aisWorkshop=function(env,city,def)
{
	if(env)
	{
		window.aisBuilding.call(this,env,city,def);
		this.productDefList=env.defLib[def.productDefList];
		this.productCatalog=def.productCatalog;
		this.tgtStorage=this.city.allStorages[def.targetStorage];
		this.addValue("mfcSpeed",1,null,null,def.mfcSpeedFactor?def.mfcSpeedFactor:"MFCSpeed");
		this.addValue("mfcCap",0,null,null,def.mfcCapFactor?def.mfcCapFactor:"MFCCap");
		this.mfcSlots=[];
		this.workTask=null;
		this.slotVsn=0;
		this.slotCap=0;
		this.slotWorkVal=0;
		this.slotNextIdx=1;
		if(!this.city["bldAll"+def.codeName])
		{
			this.city["bldAll"+def.codeName]=[];
		}
	}
};

window.aisWorkshop.ERR_NoPrdct={level:100,error:"Can't find prdct!","class":"aisWorkshop",code:"ERR_NoPrdct"};
window.aisWorkshop.ERR_OneWorkRule={level:100,error:"Can't research more!","class":"aisWorkshop",code:"ERR_OneWorkRule"};
window.aisWorkshop.ERR_LabBusy={level:100,error:"Can't start research, lab is busy!","class":"aisWorkshop",code:"ERR_LabBusy"};
window.aisWorkshop.ERR_NoPow={level:100,error:"No power to start research!","class":"aisWorkshop",code:"ERR_NoPow"};
window.aisWorkshop.ERR_MfcNotDone={level:100,error:"Research is not done yet!","class":"aisWorkshop",code:"ERR_MfcNotDone"};
window.aisWorkshop.ERR_MfcNotOn={level:100,error:"Research is not done yet!","class":"aisWorkshop",code:"ERR_MfcNotOn"};
window.aisWorkshop.ERR_MfcNotPause={level:100,error:"Research is not done yet!","class":"aisWorkshop",code:"ERR_MfcNotPause"};
window.aisWorkshop.ERR_NoCap={level:100,error:"No cap to start MFC.!","class":"aisWorkshop",code:"ERR_NoCap"};

//---------------------------------------------------------------------------
window.aisWorkshop.prototype=new window.aisBuilding();

//---------------------------------------------------------------------------
//用于UI的函数---------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisWorkshop.prototype.ui_onClick=function(uiEnv,state)
	{
		var page=uiEnv.page;
		var prdct,level;
		//DBOut("Workshop on click: "+state+","+page+","+this.king);
		switch(state)
		{
		case 0://空闲
		case 1://正在制造中
		case 3://建造中
			uiEnv.openPageDlg(page.genURL("states/dlg_bldinfo_wkshp.jml"),this);
			break;
		case 2://制造完成
			DBOut("Will compete mfc!");
			prdct=this.workTask.prdctDef;
			num=this.workTask.prdctNum;
			uiEnv.dlgDone_Wkshp.setPrdct(prdct,num,this);
			uiEnv.openPageDlg(page.genURL("states/dlg_done.jml"),uiEnv.dlgDone_Wkshp);
			break;
		case 4://建造完成
			break;
		case 5://可以收获
			break;
		case 6://资源产量已满可以收获
			break;
		case 7://低能量模式（工作暂停）
			uiEnv.openPageDlg(page.genURL("states/dlg_bldinfo_wkshp.jml"),this);
			break;
		}
	};
}

//---------------------------------------------------------------------------
//I/O函数--------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//从voObj中读出建筑数据
	window.aisWorkshop.prototype.readFmVO=function(king,voObj,def)
	{
		var slist,tlist,i,n,slotDef,vo;
		aisBuilding.prototype.readFmVO.call(this,king,voObj,def);
		this.slotCap=voObj.slotCap?voObj.slotCap:0;
		if(this.working)
		{
			//读取当前任务:
			this.workTask=new aisTask(this.env,this,king);
			this.workTask.readFmVO(king,voObj.workTask);
			this.workTask.prdctDef=this.productDefList[voObj.workTask.prdctCodeName];
			this.workTask.prdctNum=voObj.workTask.prdctNum;
			this.tasks.push(this.workTask);

			//读取任务队列:
			if(voObj.mfcSlots)
			{
				slist=voObj.mfcSlots;
				tlist=this.mfcSlots;
				tlist.splice(0,tlist.length);
				n=slist.length;
				for(i=0;i<n;i++)
				{
					slotDef=this.productDefList[slist[i].codeName];
					if(slotDef)
					{
						vo={env:this.env,def:slotDef,num:slist[i].num,deadOut:0,level:slist[i].level,slotIdx:slist[i].slotIdx};
						aisTypes.applyType(vo,aisTypes.aisViewConnect);
						tlist.push(vo);
					}
				}
			}
		}
		this.readValue(voObj,"powCurCostRate");
		this.city["bldAll"+def.codeName].push(this);
		this.slotWorkVal=voObj.slotWorkVal?voObj.slotWorkVal:0;
		this.slotNextIdx=voObj.slotNextIdx;
	};

	//---------------------------------------------------------------------------
	//将建筑数据存入voObj
	window.aisWorkshop.prototype.saveToVO=function(king,voObj)
	{
		var taskVO,slotDef,i;
		aisBuilding.prototype.saveToVO.call(this,king,voObj);
		voObj.slotCap=this.slotCap;
		if(this.working && this.workTask)
		{
			taskVO={};
			this.workTask.saveToVO(king,taskVO);
			voObj.workTask=taskVO;
			taskVO.prdctCodeName=this.workTask.prdctDef.codeName;
			taskVO.prdctNum=this.workTask.prdctNum;

			//存储任务队列:
			voObj.mfcSlots=[];
			if(this.mfcSlots.length)
			{
				slist=this.mfcSlots;
				tlist=voObj.mfcSlots;
				n=slist.length;
				for(i=0;i<n;i++)
				{
					if(slist[i].def)
					{
						tlist.push({codeName:slist[i].def.codeName,num:slist[i].num,deadOut:0,level:slist[i].level,slotIdx:slist[i].slotIdx});
					}
				}
			}
		}
		voObj.slotWorkVal=this.slotWorkVal;
		this.saveValue(voObj,"powCurCostRate");
		voObj.slotNextIdx=this.slotNextIdx;
	};
}

//---------------------------------------------------------------------------
//内部函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//更新建筑数据
	window.aisWorkshop.prototype.updateByKing=function(king,nowTime,timeGap)
	{
		var pow;
		if(this.workTask)
		{
			this.workTask.valuePerMS=this.getValue("mfcSpeed");
			DBOut(">>>>>>>>>valuePerMS: "+this.workTask.valuePerMS);
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

	//---------------------------------------------------------------------------
	//调整制造能量消耗，必须由用户发起（开始制造，调整其它建筑的能量等等）
	window.aisWorkshop.prototype.onPowWorkRate=function(oldv,newv)
	{
		var rate;
		if(newv==0 && oldv>0)//Power been shut down, task should be paused
		{
			this.pauseWork();
		}
	};
}

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//重载aisBuilding的开始建造, 给city的工厂列表增加自己
	window.aisWorkshop.prototype.startBuild=function(comVO)
	{
		window.aisBuilding.prototype.startBuild.call(this,comVO);
		this.city["bldAll"+this.def.codeName].push(this);
	};

	//---------------------------------------------------------------------------
	//重载aisBuilding的取消建造/升级, 从city的工厂列表中删除自己
	window.aisWorkshop.prototype.com_AbortConstruct=function(comVO)
	{
		var list,i,n;
		window.aisBuilding.prototype.com_AbortConstruct.call(this,comVO);
		list=this.city["bldAll"+this.def.codeName];
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i]==this)
			{
				list.splice(i,1);
				break;
			}
		}
	};

	//---------------------------------------------------------------------------
	//重载aisBuilding的拆除当前建筑, 从city的工厂列表中删除自己
	window.aisWorkshop.prototype.com_Destruct=function()
	{
		var list,i,n;
		window.aisBuilding.prototype.com_Destruct.call(this);
		list=this.city["bldAll"+def.codeName];
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i]==this)
			{
				list.splice(i,1);
				break;
			}
		}
	};

	//---------------------------------------------------------------------------
	//发起制造一个或多个物品
	window.aisWorkshop.prototype.com_NewMfc=function(comVO)
	{
		var def,task,prdct,cost,time,speed,level;
		var fpow,wpow,num,list,i,n,slot;
		//DBOut("Will start a new Mfc: "+toJSON(comVO));
		if(this.constructing)
		{
			DBOut("aisWorkshop.com_NewMfc Error 2");
			throw aisWorkshop.ERR_LabBusy;
		}
		def=this.productDefList[comVO.codeName];
		num=comVO.num;
		if(!def)
		{
			DBOut("aisWorkshop.com_NewMfc Error 3: "+comVO.codeName);
			throw aisWorkshop.ERR_NoPrdct;
		}
		comVO.svrCodeName=def.svrCodeName;
		level=comVO.level?comVO.level:0;

		fpow=this.city.power.getCurFreePower();
		wpow=this.getValue("powCostPerRate")*100;
		if(fpow<wpow)
		{
			DBOut("aisBuilding.com_NewMfc Error 4!");
			throw aisWorkshop.ERR_NoPow;
		}

		if(def.levels)
		{
			cost=def.levels[level].cost;
		}
		else
		{
			cost=def.cost;
		}
		comVO.cost=cost;
		//TODO:需要检测req和cost?


		//调整当前的建造容量:
		this.slotCap+=def.storageSize*num;
		//DBOut("Slot Cap: "+this.slotCap+"="+def.storageSize+"*"+num);
		if(this.slotCap>this.getValue("mfcCap"))
		{
			//DBOut("aisBuilding.com_NewMfc Error 5: "+this.slotCap+"/"+this.getValue("mfcCap"));
			throw aisWorkshop.ERR_NoCap;
		}

		//调整当前建造时间
		this.slotWorkVal+=cost.time*num;

		//查看这次的制造是否可以并入现有的制造队列
		list=this.mfcSlots;
		n=list.length;
		for(i=0;i<n;i++)
		{
			slot=list[i];
			if(slot.def==def)//可以并入
			{
				//DBOut("Add MFC on Slot: "+def.name);
				slot.num+=num;
				slot.level=level;
				slot.makeViewsDirty();
				this.makeViewsDirty();
				this.city.useCost(cost,num,0);
				comVO.slotIdx=slot.slotIdx;
				if(this.def.codeName=="Barrack")
				{
					this.city.addTrainFinishPushMsg();
					this.city.addTrainFullPushMsg();
				}
				return;
			}
		}

		//为这个新的制造新建一个slot, 加入slot队列
		//DBOut("New MFC Slot for: "+def.name);
		this.city.useCost(cost,num,0);
		slot={env:this.env,def:def,num:num,deadOut:0,level:level,slotIdx:this.slotNextIdx};
		this.slotNextIdx++;
		aisTypes.applyType(slot,aisTypes.aisViewConnect);

		list.push(slot);
		this.slotVsn++;
		comVO.slotIdx=slot.slotIdx;

		if(!this.working)//启动制造!
		{
			//DBOut("Start MCT: "+def.name);
			speed=this.getValue("mfcSpeed");
			task=this.newTask(this.king.nowTime,"cbk_MfcOver",null,cost.time,speed,1.0);
			task.taskCost=cost;
			task.prdctDef=def;
			task.prdctNum=1;
			this.workTask=task;
			this.working=1;
			this.setWorkPowerRate(100);
			//调整当前建造时间
			this.slotWorkVal-=cost.time;
		}
		this.makeViewsDirty();

		if(this.def.codeName=="Barrack")
		{
			this.city.addTrainFinishPushMsg();
			this.city.addTrainFullPushMsg();
		}
	};

	//---------------------------------------------------------------------------
	//放弃制造某一个东西
	window.aisWorkshop.prototype.com_AbortMfc=function(comVO)
	{
		var def,prdct,num,level,cost,speed,task,i;
		if(!this.working)
		{
			DBOut("aisWorkshop.com_AbortMfc Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisWorkshop.com_AbortMfc Error 2!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		def=this.productDefList[comVO.codeName];
		if(!def)
		{
			DBOut("aisWorkshop.com_AbortMfc Error 3: "+comVO.codeName);
			throw aisBuilding.ERR_NoWorkTask;
		}
		comVO.svrCodeName=def.svrCodeName;
		num=comVO.num;

		//调整建造容量
		this.slotCap-=def.storageSize*num;

		//查找需要取消的东西的生产队列:
		list=this.mfcSlots;
		n=list.length;
		for(i=0;i<n;i++)
		{
			slot=list[i];
			if(slot.def==def)//从这里取消
			{
				//DBOut("Cancel MFC on Slot: "+def.name);
				slot.num-=num;
				if(def.levels)
				{
					cost=def.levels[slot.level].cost;
				}
				else
				{
					cost=def.cost;
				}
				//返还资源
				this.city.returnCost(cost,"Spell"==def.type?(num*window.aisEnv.defLib.globals.SPELL_CANCEL_MULTIPLIER):num);

				//调整当前建造时间
				this.slotWorkVal-=cost.time*num;
				comVO.slotIdx=slot.slotIdx;
				if(slot.num<=0)
				{
					list.splice(i,1);
					slot.aborted=1;
					this.slotVsn++;
					if(i==0)//正在制造的槽...
					{
						if(!list.length)//全部完成:
						{
							this.workTask.giveUp(0);
							this.setWorkPowerRate(0);
							this.working=0;
							this.workTask=null;
							//调整当前建造时间,正在制造的东西的时间之前减掉了,补回来
							this.slotWorkVal+=cost.time;
						}
						else//启动新的制造:
						{
							//调整当前建造时间,正在制造的东西的时间之前减掉了,补回来
							this.slotWorkVal+=cost.time;
							this.workTask.giveUp(0);
							slot.makeViewsDirty();
							slot=list[0];
							level=slot.level;
							def=slot.def;
							if(def.levels)
							{
								cost=def.levels[level].cost;
							}
							else
							{
								cost=def.cost;
							}
							speed=this.getValue("mfcSpeed");
							task=this.newTask(this.king.nowTime,"cbk_MfcOver",null,cost.time,speed,1.0);
							task.taskCost=cost;
							task.prdctDef=def;
							task.prdctNum=1;
							this.workTask=task;
							this.working=1;
							this.setWorkPowerRate(100);
							//调整当前建造时间
							this.slotWorkVal-=cost.time;
							this.makeViewsDirty();
						}
					}
				}
				slot.makeViewsDirty();
				this.makeViewsDirty();
				if(this.def.codeName=="Barrack")
				{
					this.city.addTrainFinishPushMsg();
					this.city.addTrainFullPushMsg();
				}
				return;
			}
		}
		//DBOut("aisWorkshop.com_AbortMfc Error 4: "+def.name);
		throw aisBuilding.ERR_NoWorkTask;
	};

	//---------------------------------------------------------------------------
	//完成制造一个物品
	window.aisWorkshop.prototype.com_MfcDone=function(comVO)
	{
		/*var def,prdct;
		if(!this.working)
		{
			DBOut("aisWorkshop.com_MfcDone Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisWorkshop.com_MfcDone Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask.isOver())
		{
			DBOut("aisBuilding.resumeWork Error 4!");
			throw aisWorkshop.ERR_MfcNotDone;
		}
		def=this.workTask.prdctDef;

		this.working=0;
		this.setWorkPowerRate(0);
		this.workTask.taskDone();
		//TODO: 将制品存入仓库
		this.city.genStorage.putIn({type:def.codeName,num:this.workTask.prdctNum});
		this.workTask=null;
		this.makeViewsDirty();*/
	};

	//---------------------------------------------------------------------------
	//暂停制造任务
	window.aisWorkshop.prototype.com_PauseMfc=function(comVO)
	{
		var def,prdct;
		if(!this.working)
		{
			DBOut("aisWorkshop.com_PauseMfc Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisWorkshop.com_PauseMfc Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask.isOn())
		{
			if(this.workTask.isOver())
			{
				DBOut("aisWorkshop.com_PauseMfc Waring: try to pause a done Mfc!");
			}
			else
			{
				DBOut("aisWorkshop.com_PauseMfc Error 4!");
				throw aisWorkshop.ERR_MfcNotOn;
			}
		}
		this.pauseWork();
	};

	//---------------------------------------------------------------------------
	//继续被暂停的制造任务
	window.aisWorkshop.prototype.com_ResumeMfc=function(comVO)
	{
		var def,prdct;
		if(!this.working)
		{
			DBOut("aisWorkshop.com_ResumeMfc Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisWorkshop.com_ResumeMfc Error 2!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask.isPaused())
		{
			DBOut("aisWorkshop.com_ResumeMfc Error 3!");
			throw aisWorkshop.ERR_MfcNotPause;
		}
		this.resumeWork();
	};


	//---------------------------------------------------------------------------
	//用钻石瞬间完成生产:
	window.aisWorkshop.prototype.com_GemMfcDone=function(comVO)
	{
		var gem,time,gemNum;
		comVO.hashId=this.hashId;
		if(!this.working)
		{
			DBOut("aisBuilding.com_GemMfcDone Error 1: Building is not working!!");
			return;
		}
		if(!this.workTask)
		{
			DBOut("aisBuilding.com_GemMfcDone Error 2: Can't find construction task!");
			return;
		}
		var rate=this.city.getClanTecReviseRate(this,"Barrack","TrainingTime");

		//time=this.workTask.getRemainTime()+(this.slotWorkVal/this.getValue("mfcSpeed"));
		time=this.workTask.getRemainTimeByReviseRate(rate)+(this.slotWorkVal*rate/this.getValue("mfcSpeed"));
		gemNum=this.king.convertTime2Gem(time);

		if(comVO.discountGemNum)
			gemNum=comVO.discountGemNum;

		if(gemNum>0)
		{
			if(this.king.gemNum<gemNum)
			{
				//DBOut("aisWorkshop.com_GemMfcDone Error 3: Not enough gems: "+gemNum+" vs "+this.king.gemNum);
				throw aisBuilding.ERR_NoGem;
			}
			this.rushTask=1;
			while(this.working && this.working!=4)
			{
				this.workTask.rushOver(1);
			}
			this.rushTask=0;
			this.king.gemNum-=gemNum;
			comVO.gemNum=gemNum;
			this.city.makeViewsDirty();
			this.king.makeViewsDirty();
		}
		if(this.def.codeName=="Barrack")
		{
			this.city.addTrainFinishPushMsg();
			this.city.addTrainFullPushMsg();
		}
	};
}

//---------------------------------------------------------------------------
//回调函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisWorkshop.prototype.cbk_MfcOver=function(vo,task,fakeCall)
	{
		var slot,list,store,vo,speed,task,cost,def,level;
		//DBOut("Mfc done: "+vo+", "+task);
		list=this.mfcSlots;
		slot=list[0];

		//检查仓库能不能放得下
		def=slot.def;
		vo={type:slot.def.codeName,num:1};
		store=this.tgtStorage;
		if(!fakeCall)
		{
			this.slotVsn++;
			this.makeViewsDirty();
		}
		if(store.checkPutIn(vo))
		{
			//客户端模式下, 通知服务器完成
			if(!this.rushTask)
			{
				this.king.execFakeCmd(this,"MfcDone",{codeName:def.codeName,svrCodeName:def.svrCodeName,slotIdx:slot.slotIdx,num:1},this,this.king.nowTime);
			}

			//调整建造容量
			this.slotCap-=def.storageSize;

			//把物品放入仓库
			store.putIn(vo,this);

			//TODO:完成当前的任务
			this.workTask.taskDone();
			this.workTask=null;
			this.working=0;
			slot.makeViewsDirty();

			//查看是否要继续生产?
			slot.num--;
			if(slot.num<=0)//这槽的东西都造完了,查看是不是有其它槽可以启动
			{
				slot.deadOut=1;
				list.shift();
				slot=list[0];
				if(!slot)
				{
					//生产顺利结束!
					this.makeViewsDirty();
					return;
				}
				def=slot.def;
				level=slot.level;
				slot.deadOut=1;
			}
			else
			{
				def=slot.def;
				level=slot.level;
				slot.makeViewsDirty();
			}
			if(def.levels)
			{
				cost=def.levels[level].cost;
			}
			else
			{
				cost=def.cost;
			}
			speed=this.getValue("mfcSpeed");
			task=this.newTask(this.king.nowTime,"cbk_MfcOver",null,cost.time,speed,1.0);
			task.taskCost=cost;
			task.prdctDef=def;
			task.prdctNum=1;
			//调整当前建造时间
			this.slotWorkVal-=cost.time;
			this.workTask=task;
			this.working=1;
			this.setWorkPowerRate(100);
			this.makeViewsDirty();
			return;
		}
		//DBOut("Storage can't put more, we pause MFC!");
		if(this.working!=4)
		{
			if(window.MP)
				window.MP.removePushList("TrainFinish",2);
			this.working=4;//当前进入"停滞"状态
			this.makeViewsDirty();
		}
		//DBOut("My state: "+this.working+", "+this.constructing);
	};
}

}
