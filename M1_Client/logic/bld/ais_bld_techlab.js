if(!window.aisTechLab)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的研究所的对象类型
window.aisTechLab=function(env,city,def)
{
	if(env)
	{
		window.aisBuilding.call(this,env,city,def);
		this.addValue("techSpeed",1,null,null,"TechSpeed");
		this.workTask=null;
		city.aisTechLab=this;
	}
};

window.aisTechLab.ERR_NoTech={level:100,error:"Can't find tech!","class":"aisTechLab",code:"ERR_NoTech"};
window.aisTechLab.ERR_OneWorkRule={level:100,error:"Can't research more!","class":"aisTechLab",code:"ERR_OneWorkRule"};
window.aisTechLab.ERR_LabBusy={level:100,error:"Can't start research, lab is busy!","class":"aisTechLab",code:"ERR_LabBusy"};
window.aisTechLab.ERR_NoPow={level:100,error:"No power to start research!","class":"aisTechLab",code:"ERR_NoPow"};
window.aisTechLab.ERR_CaseNotDone={level:100,error:"Research is not done yet!","class":"aisTechLab",code:"ERR_CaseNotDone"};
window.aisTechLab.ERR_CaseNotOn={level:100,error:"Research is not done yet!","class":"aisTechLab",code:"ERR_CaseNotOn"};
window.aisTechLab.ERR_CaseNotPause={level:100,error:"Research is not done yet!","class":"aisTechLab",code:"ERR_CaseNotPause"};

//---------------------------------------------------------------------------
window.aisTechLab.prototype=new window.aisBuilding();

//---------------------------------------------------------------------------
//用于UI的函数---------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisTechLab.prototype.ui_onClick=function(uiEnv,state)
	{
		var page=uiEnv.page;
		var tech,level;
		//DBOut("Tech Lab on click: "+state+","+page+","+this.king);
		switch(state)
		{
		case 0://空闲
		case 1://正在研究中
		case 3://建造中
			uiEnv.dlgBuild_Tech.setTechLab(this);
			uiEnv.openPageDlg(page.genURL("states/dlg_bldinfo_tech.jml"),this);
			break;
		case 2://研究完成
			DBOut("Will compete case!");
			tech=this.workTask.prdctDef;
			level=this.workTask.techLevel;
			uiEnv.dlgDone_Tech.setTech(tech,level,this);
			uiEnv.openPageDlg(page.genURL("states/dlg_done.jml"),uiEnv.dlgDone_Tech);
			break;
		case 4://建造完成
			break;
		case 5://可以收获
			break;
		case 6://资源产量已满可以收获
			break;
		case 7://低能量模式（工作暂停）
			uiEnv.dlgBuild_Tech.setTechLab(this);
			uiEnv.openPageDlg(page.genURL("states/dlg_bldinfo_tech.jml"),this);
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
	window.aisTechLab.prototype.readFmVO=function(king,voObj,def)
	{
		aisBuilding.prototype.readFmVO.call(this,king,voObj,def);
		if(this.working)
		{
			this.workTask=new aisTask(this.env,this,king);
			this.workTask.readFmVO(king,voObj.workTask);
			this.workTask.prdctDef=aisEnv.defLib.tech[voObj.workTask.techCodeName];
			this.workTask.techLevel=voObj.workTask.techLevel;
			this.tasks.push(this.workTask);
		}
		this.readValue(voObj,"powCurCostRate");
	};

	//---------------------------------------------------------------------------
	//将建筑数据存入voObj
	window.aisTechLab.prototype.saveToVO=function(king,voObj)
	{
		var taskVO;
		aisBuilding.prototype.saveToVO.call(this,king,voObj);
		if(this.working && this.workTask)
		{
			taskVO={};
			this.workTask.saveToVO(king,taskVO);
			voObj.workTask=taskVO;
			taskVO.techCodeName=this.workTask.prdctDef.codeName;
			taskVO.techLevel=this.workTask.techLevel;
		}
		this.saveValue(voObj,"powCurCostRate");
	};
}

//---------------------------------------------------------------------------
//内部函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//更新建筑数据
	window.aisTechLab.prototype.updateByKing=function(king,nowTime,timeGap)
	{
		var pow;
		if(this.workTask)
		{
			pow=this.getValue("powCurCostRate");
		}
		this.updateBuffs(king,nowTime,timeGap);
		this.updateTasks(king,nowTime,timeGap);
		this.updateValues(nowTime,timeGap);
	};

	//---------------------------------------------------------------------------
	//调整研究能量消耗，必须由用户发起（开始研究，调整其它建筑的能量等等）
	window.aisTechLab.prototype.onPowWorkRate=function(oldv,newv)
	{
		var rate;
		if(newv==0 && oldv>0)//Power been shut down, task should be paused
		{
			this.pauseWork();
		}
	}

}

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//发起研究一个科技
	window.aisTechLab.prototype.com_NewCase=function(comVO)
	{
		var def,task,tech,cost,time,speed,level;
		var fpow,wpow;
		//DBOut("Will start a new case: "+toJSON(comVO));
		if(this.working)
		{
			DBOut("aisTechLab.com_NewCase Error 1");
			throw aisTechLab.ERR_OneWorkRule;
		}
		if(this.constructing)
		{
			DBOut("aisTechLab.com_NewCase Error 2");
			throw aisTechLab.ERR_LabBusy;
		}
		def=aisEnv.defLib.tech[comVO.tech];
		if(!def)
		{
			DBOut("aisTechLab.com_NewCase Error 3");
			throw aisTechLab.ERR_NoTech;
		}
		//TODO:正常操作会出现下面这个异常，应该是研究对话框没有仔细看。
		fpow=this.city.power.getCurFreePower();
		wpow=this.getValue("powCostPerRate")*100;
		if(fpow<wpow)
		{
			DBOut("aisBuilding.com_NewCase Error 4!");
			throw aisTechLab.ERR_NoPow;
		}

		var unit=this.king.getUnitByTechCodeName(comVO.tech);
		if(unit)comVO.unitSvrCodeName=unit.svrCodeName;

		//TODO:需要检测req和cost?

		tech=this.king.getTech(def.codeName);
		if(tech)//这是一个升级的研究
		{
			cost=def.levels[tech.level].cost;
			level=tech.level+1;
		}
		else//这是一个全新的研究
		{
			cost=def.levels[0].cost;
			level=1;
		}
		this.city.useCost(cost,1,0);
		speed=this.getValue("techSpeed");
		task=this.newTask(this.king.nowTime,"cbk_caseOver",null,cost.time,speed,1.0);
		task.taskCost=cost;
		task.prdctDef=def;
		task.techLevel=level;
		this.king.addCase(def.codeName,tech?tech.level:0);
		this.workTask=task;
		this.working=1;
		this.setWorkPowerRate(100);
		comVO.techLevel=level+1;
		this.makeViewsDirty();
		if(window.MP)
			window.MP.addPushList(def.codeName,3,Math.floor(cost.time/1000));
	};

	//---------------------------------------------------------------------------
	//完成研究一个科技
	window.aisTechLab.prototype.com_CaseDone=function(comVO)
	{
		var def,tech;
		if(!this.working)
		{
			DBOut("aisTechLab.com_CaseDone Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisTechLab.com_CaseDone Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask.isOver())
		{
			DBOut("aisBuilding.resumeWork Error 4!");
			throw aisTechLab.ERR_CaseNotDone;
		}
		def=this.workTask.prdctDef;
		tech=this.king.getTech(def.codeName);
		if(!tech)
		{
			tech=this.king.addTech(def.codeName,0);
		}
		tech.level+=1;
		this.king.caseDone(def.codeName);
		this.workTask.taskDone();
		this.workTask=null;
		this.working=0;
		this.setWorkPowerRate(0);

		//检查unlock的情况
		this.king.checkDefUnlockVsb(def.levels[tech.level].unlockVsb);

		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//暂停研究任务
	window.aisTechLab.prototype.com_PauseCase=function(comVO)
	{
		var def,tech;
		if(!this.working)
		{
			DBOut("aisTechLab.com_CaseDone Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisTechLab.com_CaseDone Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask.isOn())
		{
			if(this.workTask.isOver())
			{
				DBOut("aisTechLab.com_CaseDone Waring: try to pause a done case!");
			}
			else
			{
				DBOut("aisTechLab.com_CaseDone Error 4!");
				throw aisTechLab.ERR_CaseNotOn;
			}
		}
		this.pauseWork();
	};

	//---------------------------------------------------------------------------
	//继续被暂停的研究任务
	window.aisTechLab.prototype.com_ResumeCase=function(comVO)
	{
		var def,tech;
		if(!this.working)
		{
			DBOut("aisTechLab.com_CaseDone Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisTechLab.com_CaseDone Error 2!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask.isPaused())
		{
			DBOut("aisTechLab.com_CaseDone Error 3!");
			throw aisTechLab.ERR_CaseNotPause;
		}
		this.resumeWork();
	};

	//---------------------------------------------------------------------------
	//放弃当前研究任务
	window.aisTechLab.prototype.com_AbortCase=function(comVO)
	{
		var def,tech;
		if(!this.working)
		{
			DBOut("aisTechLab.com_CaseDone Error 1!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisTechLab.com_CaseDone Error 2!");
			throw aisBuilding.ERR_NoWorkTask;
		}
		if(this.workTask.isDone())
		{
			DBOut("aisTechLab.com_CaseDone Error 3!");
			throw aisTechLab.ERR_CaseNotPause;
		}
		def=this.workTask.prdctDef;
		this.king.caseDone(def.codeName);
		this.workTask.giveUp(0);
		this.setWorkPowerRate(0);
		this.working=0;
		this.workTask=null;
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//用钻石瞬间完成升级/建造:
	window.aisTechLab.prototype.com_GemCaseDone=function(comVO)
	{
		var gem,time,gemNum;
		comVO.hashId=this.hashId;
		if(!this.working)
		{
			DBOut("aisBuilding.com_GemCaseDone Error 1: Building is not working!!");
			return;
			//throw aisBuilding.ERR_NoWorkTask;
		}
		if(!this.workTask)
		{
			DBOut("aisBuilding.com_GemCaseDone Error 2: Can't find construction task!");
			return;
			//throw aisBuilding.ERR_NoWorkTask;
		}
		if(this.workTask.isDone())
		{
			DBOut("aisTechLab.com_GemCaseDone Error 3!");
			//throw aisTechLab.ERR_CaseNotPause;
			return;
		}
		time=this.workTask.getRemainTime();
		gemNum=this.king.convertTime2Gem(time);

		if(comVO.discountGemNum)
			gemNum=comVO.discountGemNum;

		if(this.king.gemNum<gemNum)
		{
			DBOut("aisTechLab.com_GemCaseDone Error 3: Not enough gems: "+gemNum+" vs "+this.king.gemNum);
			throw aisBuilding.ERR_NoGem;
		}
		this.workTask.rushOver(1);
		this.king.gemNum-=gemNum;
		comVO.gemNum=gemNum;
		this.city.makeViewsDirty();
		this.king.makeViewsDirty();

		if(window.MP)
			window.MP.removePushList(this.def.codeName,3);
	};
}

//---------------------------------------------------------------------------
//回调函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisTechLab.prototype.cbk_caseOver=function(vo,task)
	{
		var codeName=this.workTask.prdctDef.codeName;
		//DBOut("Case done: "+vo+", "+task);
		if(this.env.cfg.bldAutoTechDone)
		{
			DBOut("Research will auto done!");
			this.com_CaseDone();
		}
		else
		{
			this.working=2;
			this.makeViewsDirty();
		}
		if(task && task.isRushed)
		{
			//这种情况不发送消息
			return;
		}
		//客户端模式下, 通知服务器完成
		if(1)
		{
			this.king.execFakeCmd(this,"CaseDone",{codeName:codeName},this,this.king.nowTime);
		}
	};

	window.aisTechLab.prototype.onValueChange=function(name,val)
	{
		switch(name)
		{
		case "powCurCostRate":
			break;
		}
	}
}

}
