if(!window.aisAchvmnt)
{
//---------------------------------------------------------------------------
//拥有Achvmnt的对象
window.aisTypes.aisAchvmnts=function(env,owner)
{
	if(env)
	{
		this.env=env;
		this.owner=owner;
		this.king=owner;
		this.achvmnts={};
		this.bonusNum=0;

		//经验值系统:
		this.exp=0;
		this.expLevel=1;
		this.initExp=0;
		this.tgtExp=aisEnv.defLib.achvmnt.EXPLevels[this.expLevel-1].exp;

		aisTypes.applyType(this,aisTypes.aisViewConnect);
	}
};

window.aisTypes.aisAchvmnts.prototype=new Object();

//---------------------------------------------------------------------------
window.aisTypes.aisAchvmnts.prototype.addAchvmnt=function(def)
{
	var achvmnt;
//	DBOut("Add achievment: "+def.codeName);
	achvmnt=new window.aisAchvmnt(def,this.env,this);
	this.achvmnts[def.codeName]=achvmnt;
};

//---------------------------------------------------------------------------
window.aisTypes.aisAchvmnts.prototype.saveAchvmnts=function(voObj)
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
	voObj.expPoints=this.exp;
	voObj.expLevel=this.expLevel;
};

//---------------------------------------------------------------------------
window.aisTypes.aisAchvmnts.prototype.loadAchvmnts=function(voObj)
{
	var i,list,achvmnt,vo,def;
	this.bonusNum=0;
	list=voObj.achvmnts;
	for(i in list)
	{
		vo=list[i];
		if(vo)
		{
			//TODO: Code this:
			def=aisEnv.defLib.achvmnt[vo.codeName];
			if(def)
			{
				achvmnt=aisAchvmnt.createAchvmnt(def,this.env,this);
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
	this.exp=voObj.expPoints;
	this.expLevel=voObj.expLevel;
	this.initExp=0;
	if(this.expLevel>1)
	{
		this.initExp=aisEnv.defLib.achvmnt.EXPLevels[this.expLevel-2].exp;
	}
	if(this.expLevel<=aisEnv.defLib.achvmnt.EXPLevels.length)
	{
		this.tgtExp=aisEnv.defLib.achvmnt.EXPLevels[this.expLevel-1].exp;
	}
	else
	{
		this.initExp=aisEnv.defLib.achvmnt.EXPLevels[aisEnv.defLib.achvmnt.EXPLevels.length-2].exp;
		this.expLevel=parseInt(aisEnv.defLib.achvmnt.EXPLevels[aisEnv.defLib.achvmnt.EXPLevels.length-1].title,10);
		this.exp=aisEnv.defLib.achvmnt.EXPLevels[aisEnv.defLib.achvmnt.EXPLevels.length-1].exp;
		this.tgtExp=0;//0就不能升级了
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisAchvmnts.prototype.getAchvmnt=function(codename)
{
	return this.achvmnts[codename];
};

//---------------------------------------------------------------------------
window.aisTypes.aisAchvmnts.prototype.onExecCom=function(comObj,com,comVO)
{
	var list,i,achvmnt,def,cost,time;

	list=this.achvmnts;
	for(i in list)
	{
		achvmnt=list[i];
		if(achvmnt.onExecCom)achvmnt.onExecCom(comObj,com,comVO);
	}
	//TODO:检查是否升级
	if(com=="ConstructDone" || com=="GemConstructDone")
	{
		def=comObj.def;
		cost=def.levels[comObj.level-1].cost;
		if(cost && cost.time)
		{
			time=Math.floor(Math.sqrt(cost.time/1000));
			this.getExp(time);
		}
	}else if(com=="RemoveDone" || com=="GemRemoveDone"){
		def=comObj.def;
		cost=def.levels[comVO.level].cost;
		if(cost && cost.time)
		{
			time=Math.floor(Math.sqrt(cost.time/1000));
			this.getExp(time);
		}
	}else	if(com=="DonateClan"){
		var list,i,n,unit,def,exp=0;
		list=comVO.units;
		n=list.length;
		for(i=0;i<n;i++)
		{
			unit=list[i];
			def=aisEnv.defLib.unit[unit.type];
			if(def)
			{
				exp+=def.storageSize*unit.num;
			}
		}
		this.getExp(exp);
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisAchvmnts.prototype.getExp=function(expNum)
{
	if(this.tgtExp)
		this.exp+=expNum;
	DBOut("Get exp points: "+expNum+", "+this.exp+", "+this.tgtExp);
	while(this.tgtExp && this.exp>=this.tgtExp)
	{
		//升级!!
		this.expLevel++;
		DBOut("Level Up: "+(this.expLevel));
		this.initExp=0;
		if(this.expLevel>1)
		{
			this.initExp=aisEnv.defLib.achvmnt.EXPLevels[this.expLevel-2].exp;
		}
		if(this.expLevel<=aisEnv.defLib.achvmnt.EXPLevels.length)
		{
			this.tgtExp=aisEnv.defLib.achvmnt.EXPLevels[this.expLevel-1].exp;
		}
		else
		{
			this.initExp=aisEnv.defLib.achvmnt.EXPLevels[aisEnv.defLib.achvmnt.EXPLevels.length-2].exp;
			this.expLevel=parseInt(aisEnv.defLib.achvmnt.EXPLevels[aisEnv.defLib.achvmnt.EXPLevels.length-1].title,10);
			this.exp=aisEnv.defLib.achvmnt.EXPLevels[aisEnv.defLib.achvmnt.EXPLevels.length-1].exp;
			this.tgtExp=0;//0就不能升级了
		}
		this.king.execFakeCmd(this.king,"LevelUp",{level:this.expLevel},this.king);
	}
	this.makeViewsDirty();
};

//---------------------------------------------------------------------------
window.aisTypes.aisAchvmnts.prototype.getBonus=function(defName)
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
	bonus=achvmnt.def.levels[achvmnt.bonusRcved].bonus;
	if(bonus)
	{
		//DBOut("Add bonus: "+toJSON(bonus));
		this.king.citys[0].returnCost(bonus,1);
		if(bonus.exp)
			this.getExp(bonus.exp);
	}//
	achvmnt.bonusRcved++;
	this.bonusNum--;
	this.makeViewsDirty();
};
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的Achvmnt对象
window.aisAchvmnt=function(def,env,owner)
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
		this.onExecCom=window.aisAchvmnt["onCom_"+def.type];
	}
};

//---------------------------------------------------------------------------
window.aisAchvmnt.createAchvmnt=function(def,env,owner)
{
	var func;
	func=def.createFunc;
	if(func)
	{
		func=aisAchvmnt.createFuncs[func];
		if(func)
			return new func(def,env,owner);
	}
	return new aisAchvmnt(def,env,owner);
};

//---------------------------------------------------------------------------
window.aisAchvmnt.prototype=new aisObj();

//---------------------------------------------------------------------------
window.aisAchvmnt.prototype.onExecCom=function(comObj,com,comVO)
{
};

//---------------------------------------------------------------------------
window.aisAchvmnt.prototype.readFmVO=function(voObj)
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
window.aisAchvmnt.prototype.saveToVO=function(voObj)
{
	aisObj.prototype.saveToVO.call(this,voObj);
	voObj.level=this.level;
	voObj.score=this.curScore;
	voObj.bonusRcved=this.bonusRcved;
};

//---------------------------------------------------------------------------
window.aisAchvmnt.prototype.getBonus=function()
{
	//TODO:Code this:
};

//---------------------------------------------------------------------------
//更新分数
window.aisAchvmnt.prototype.updateScore=function()
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
	window.aisAchvmnt.onCom_upgrade=function(comObj,com,comVO)
	{
		DBOut("On Achievment com: "+com);
		if((com=="ConstructDone" || com=="GemConstructDone") && comObj.def.codeName==this.def.bldType && comObj.level>this.curScore)
		{
			this.curScore=comObj.level;
			this.updateScore();
		}
	};

	//---------------------------------------------------------------------------
	//NPC战斗:
	window.aisAchvmnt.onCom_npc_stars=function(comObj,com,comVO)
	{
		//TODO: 根据实际消息编写这个:
		if(com=="PVEBattle")
		{
		}
	};

	//---------------------------------------------------------------------------
	//消除障碍物
	window.aisAchvmnt.onCom_clear_obstacles=function(comObj,com,comVO)
	{
		if((com=="RemoveDone"|| com=="GemRemoveDone") && comObj.def.posFixed)
		{
			this.curScore+=1;
			this.updateScore();
		}
	};

	//---------------------------------------------------------------------------
	//解锁单位, 这个貌似就是升级兵营:
	//window.aisAchvmnt.onCom_unit_unlock=function(comObj,com,comVO)

	//---------------------------------------------------------------------------
	//PVP资源获得
	window.aisAchvmnt.onCom_loot=function(comObj,com,comVO)
	{
		//TODO: 根据实际消息编写这个:
		if(com=="PVPBattle")
		{
		}
	};

	//---------------------------------------------------------------------------
	//奖杯数
	window.aisAchvmnt.onCom_victory_points=function(comObj,com,comVO)
	{
		//TODO: 根据实际消息编写这个:
		if(com=="PVPBattle")
		{
		}
	};

	//---------------------------------------------------------------------------
	//PVP攻击获胜
	window.aisAchvmnt.onCom_win_pvp_attack=function(comObj,com,comVO)
	{
		//TODO: 根据实际消息编写这个:
		if(com=="PVPBattle")
		{
		}
	};

	//---------------------------------------------------------------------------
	//PVP防守获胜, 这个只能在服务器端发生:
	//window.aisAchvmnt.onCom_win_pvp_defense=function(comObj,com,comVO)

	//---------------------------------------------------------------------------
	//PVP攻击获胜
	window.aisAchvmnt.onCom_donate_units=function(comObj,com,comVO)
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

	//---------------------------------------------------------------------------
	//充值获得钻石矿
	window.aisAchvmnt.onCom_charge=function(comObj,com,comVO)
	{
		if((com=="Charge"))
		{
			this.curScore+=1;
			this.updateScore();
		}
	};

	//---------------------------------------------------------------------------
	//强化机甲组件
	window.aisAchvmnt.onCom_strengthen=function(comObj,com,comVO)
	{
		var group,lv;
		if(com=="GemMfcDone" || com=="MfcDone")
		{
			if(comObj.def)
					group=comObj.def.groupId;
			lv=1;
		}else{
			lv=comVO.level;
		}
		if((com=="EnhancePart"||(com=="MfcDone"&& group=="MechFactory") ||(com=="GemMfcDone"&& group=="MechFactory")) && lv>this.curScore)
		{
			this.curScore=lv;
			this.updateScore();
		}
	};
}
}