if(!window.aisDailyTask)
{
//---------------------------------------------------------------------------
//拥有Achvmnt的对象
window.aisTypes.aisDailyTasks=function(env,owner)
{
	if(env)
	{
		this.env=env;
		this.owner=owner;
		this.king=owner;
		this.achvmnts={};
		this.bonusNum=0;

		aisTypes.applyType(this,aisTypes.aisViewConnect);
	}
};

window.aisTypes.aisDailyTasks.prototype=new Object();

//---------------------------------------------------------------------------
window.aisTypes.aisDailyTasks.prototype.addAchvmnt=function(def)
{
	var achvmnt;
//	DBOut("Add achievment: "+def.codeName);
	achvmnt=new window.aisDailyTask(def,this.env,this);
	this.achvmnts[def.codeName]=achvmnt;
};

//---------------------------------------------------------------------------
window.aisTypes.aisDailyTasks.prototype.saveAchvmnts=function(voObj)
{
	var i,list,achvmnt,vo;

	voObj.achvmnts={};
	list=this.achvmnts;
	for(i in list)
	{
		achvmnt=list[i];
		if(achvmnt)
		{
			vo={};
			achvmnt.saveToVO(vo);
			voObj.achvmnts[i]=vo;
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisDailyTasks.prototype.loadAchvmnts=function(voObj)
{
	var i,list,achvmnt,vo,def;
	this.bonusNum=0;
	list=voObj.dailyTasks;
	for(i in list)
	{
		vo=list[i];
		if(vo)
		{
			//TODO: Code this:
			def=aisEnv.defLib.dailytasks[vo.codeName];
			if(def)
			{
				achvmnt=aisDailyTask.createAchvmnt(def,this.env,this);
				achvmnt.readFmVO(vo);
				this.achvmnts[def.codeName]=achvmnt;
			}
			else
			{
				DBOut("<<<Warning>>>: Can't find achvment def: "+vo.codeName);
			}
		}
		if(achvmnt && (achvmnt.bonusRcved<achvmnt.level))
		{
			this.bonusNum+=achvmnt.level-achvmnt.bonusRcved;
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisDailyTasks.prototype.getAchvmnt=function(codename)
{
	return this.achvmnts[codename];
};

//---------------------------------------------------------------------------
window.aisTypes.aisDailyTasks.prototype.onExecCom=function(comObj,com,comVO)
{
	var list,i,achvmnt,def,cost,time;

	list=this.achvmnts;
	for(i in list)
	{
		achvmnt=list[i];
		if(achvmnt.onExecCom)achvmnt.onExecCom(comObj,com,comVO);
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisDailyTasks.prototype.getBonus=function(defName)
{
	var achvmnt,bonus;
	achvmnt=this.achvmnts[defName];
	if(!achvmnt)
	{
		DBOut("ERROR: can't find achvmnt: "+defName);
		return;
	}
	if(achvmnt.bonusRcved>=achvmnt.level)
	{
		DBOut("ERROR: Achvmnt has no bonus left: "+defName);
		return;
	}
	/*
	bonus=achvmnt.def.levels[achvmnt.bonusRcved].bonus;
	if(bonus)
	{
		//DBOut("Add bonus: "+toJSON(bonus));
		this.king.citys[0].returnCost(bonus,1);
	}
	*/
	achvmnt.bonusRcved++;
	this.bonusNum--;
	this.makeViewsDirty();
};

//---------------------------------------------------------------------------
window.aisTypes.aisDailyTasks.prototype.getProgress=function()
{
	//TODO:Code this:
	var i,ach,def,level,levels,bonusRcved,starScore;
	var total=0,cur=0;
	var achs=this.achvmnts;
	for(i in achs)
	{
		ach=achs[i];
		def=ach.def;
		levels=def.levels;
		total+=levels.length;
		level=ach.level;
		bonusRcved=ach.bonusRcved;
		cur+=bonusRcved;
	//	DBOut("level="+level+", bonusRcved="+bonusRcved);
	//	DBOut("============total="+total+", cur="+cur);
	}
	return {total:total,cur:cur};
};
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的Achvmnt对象
window.aisDailyTask=function(def,env,owner)
{
	var date;
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=owner;
		this.type="Achvmnt";
		this.def=def;//aisDef
		this.level=0;//星数
		this.tgtScore=def.levels[0].score;//下一级需要达到的目标
		this.curScore=0;//当前进度
		this.bonusRcved=0;
		this.onExecCom=window.aisDailyTask["onCom_"+def.type];
	}
};

//---------------------------------------------------------------------------
window.aisDailyTask.createAchvmnt=function(def,env,owner)
{
	var func;
	func=def.createFunc;
	if(func)
	{
		func=aisDailyTask.createFuncs[func];
		if(func)
			return new func(def,env,owner);
	}
	return new aisDailyTask(def,env,owner);
};

//---------------------------------------------------------------------------
window.aisDailyTask.prototype=new aisObj();

//---------------------------------------------------------------------------
window.aisDailyTask.prototype.onExecCom=function(comObj,com,comVO)
{
};

//---------------------------------------------------------------------------
window.aisDailyTask.prototype.readFmVO=function(voObj)
{
	var i,n,list;
	aisObj.prototype.readFmVO.call(this,voObj);
	this.level=voObj.level;//0,1,2,3
	this.curScore=voObj.score;
	if(this.level>=this.def.levels.length)
		this.tgtScore=this.def.levels[this.def.levels.length-1].score;
	else
		this.tgtScore=this.def.levels[this.level].score;
	this.bonusRcved=voObj.bonusRcved;//last Receive rewards level
	this.updateScore();
};

//---------------------------------------------------------------------------
window.aisDailyTask.prototype.saveToVO=function(voObj)
{
	aisObj.prototype.saveToVO.call(this,voObj);
	voObj.level=this.level;
	voObj.score=this.curScore;
	voObj.bonusRcved=this.bonusRcved;
};

//---------------------------------------------------------------------------
window.aisDailyTask.prototype.getBonus=function()
{
	//TODO:Code this:
};

//---------------------------------------------------------------------------
window.aisDailyTask.prototype.getProgress=function()
{
	//TODO:Code this:

};

//---------------------------------------------------------------------------
//更新分数
window.aisDailyTask.prototype.updateScore=function()
{
	if(this.level<this.def.levels.length)
	{
		if(this.curScore>=this.tgtScore)
		{
			DBOut("<<<<Achievment>>>>: "+this.def.codeName+", "+(this.level+1));
			this.level++;
			if(this.level>=this.def.levels.length)
				this.tgtScore=this.def.levels[this.def.levels.length-1].score;
			else
				this.tgtScore=this.def.levels[this.level].score;
			this.owner.bonusNum+=1;
			this.owner.makeViewsDirty();
			//TODO: com send to server?
		}
	}
};

//***************************************************************************
//***************************************************************************
//各种类型的消息过滤函数:
{
	//---------------------------------------------------------------------------
	//升级建筑:
	window.aisDailyTask.onCom_upgrade=function(comObj,com,comVO)
	{
		/*
		DBOut("On Achievment com: "+com);
		if((com=="ConstructDone" || com=="GemConstructDone") && comObj.def.codeName==this.def.bldType && comObj.level>this.curScore)
		{
			this.curScore=comObj.level;
			this.updateScore();
		}
		*/
	};

	//---------------------------------------------------------------------------
	//NPC战斗:
	window.aisDailyTask.onCom_npc_stars=function(comObj,com,comVO)
	{
		//TODO: 根据实际消息编写这个:
		if(com=="PVEBattle")
		{
		}
	};

	//---------------------------------------------------------------------------
	//消除障碍物
	window.aisDailyTask.onCom_clear_obstacles=function(comObj,com,comVO)
	{
		/*
		if((com=="RemoveDone"|| com=="GemRemoveDone") && comObj.def.posFixed)
		{
			this.curScore+=1;
			this.updateScore();
		}
		*/
	};
	//---------------------------------------------------------------------------
	//PVP资源获得
	window.aisDailyTask.onCom_loot=function(comObj,com,comVO)
	{
		//TODO: 根据实际消息编写这个:
		if(com=="PVPBattle")
		{
		}
	};

	//---------------------------------------------------------------------------
	//奖杯数
	window.aisDailyTask.onCom_victory_points=function(comObj,com,comVO)
	{
		//TODO: 根据实际消息编写这个:
		if(com=="PVPBattle")
		{
		}
	};

	//---------------------------------------------------------------------------
	//PVP攻击获胜
	window.aisDailyTask.onCom_win_pvp_attack=function(comObj,com,comVO)
	{
		//TODO: 根据实际消息编写这个:
		if(com=="PVPBattle")
		{
		}
	};

	//---------------------------------------------------------------------------
	//PVP防守获胜, 这个只能在服务器端发生:
	//window.aisDailyTask.onCom_win_pvp_defense=function(comObj,com,comVO)

	//---------------------------------------------------------------------------
	//PVP攻击获胜
	window.aisDailyTask.onCom_donate_units=function(comObj,com,comVO)
	{
		var list,i,n,unit,def;
		if(com=="DonateClan")
		{
			list=comVO.units;
			n=list.length;
			for(i=0;i<n;i++)
			{
				unit=list[i];
				def=aisEnv.defLib.unit[unit.type];
				if(def)
				{
					this.curScore+=def.storageSize*unit.num;
				}
			}
			this.updateScore();
		}
	};
}
}