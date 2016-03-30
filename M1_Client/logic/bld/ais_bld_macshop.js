if(!window.aisMacShop)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//机甲的工厂的对象类型
window.aisMacShop=function(env,city,def)
{
	if(env)
	{
		window.aisWorkshop.call(this,env,city,def);
		this.addOnDefList=env.defLib.addon;
		this.nextPartId=1;
		city.aisMacShop=this;
	}
};

window.aisMacShop.ERR_NoPrdct={level:100,error:"Can't find prdct!","class":"aisMacShop",code:"ERR_NoPrdct"};
window.aisMacShop.ERR_OneWorkRule={level:100,error:"Can't research more!","class":"aisMacShop",code:"ERR_OneWorkRule"};
window.aisMacShop.ERR_LabBusy={level:100,error:"Can't start research, lab is busy!","class":"aisMacShop",code:"ERR_LabBusy"};
window.aisMacShop.ERR_NoPow={level:100,error:"No power to start research!","class":"aisMacShop",code:"ERR_NoPow"};
window.aisMacShop.ERR_MfcNotDone={level:100,error:"Research is not done yet!","class":"aisMacShop",code:"ERR_MfcNotDone"};
window.aisMacShop.ERR_MfcNotOn={level:100,error:"Research is not done yet!","class":"aisMacShop",code:"ERR_MfcNotOn"};
window.aisMacShop.ERR_MfcNotPause={level:100,error:"Research is not done yet!","class":"aisMacShop",code:"ERR_MfcNotPause"};
window.aisMacShop.ERR_NoCap={level:100,error:"No cap to start MFC.!","class":"aisMacShop",code:"ERR_NoCap"};
window.aisMacShop.ERR_NoBox={level:100,error:"Can't find box!","class":"aisMacShop",code:"ERR_NoBox"};

//---------------------------------------------------------------------------
window.aisMacShop.prototype=new window.aisWorkshop();

//---------------------------------------------------------------------------
//I/O函数--------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//从voObj中读出建筑数据
	window.aisMacShop.prototype.readFmVO=function(king,voObj,def)
	{
		var slist,tlist,i,n,slotDef,vo;
		aisWorkshop.prototype.readFmVO.call(this,king,voObj,def);
		this.nextPartId=voObj.nextPartId?voObj.nextPartId:1;
	};

	//---------------------------------------------------------------------------
	//将建筑数据存入voObj
	window.aisMacShop.prototype.saveToVO=function(king,voObj)
	{
		var taskVO,slotDef;
		aisWorkshop.prototype.saveToVO.call(this,king,voObj);
		voObj.nextPartId=this.nextPartId;
	};
}

//---------------------------------------------------------------------------
//内部函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//更新建筑数据
	window.aisMacShop.prototype.updateByKing=function(king,nowTime,timeGap)
	{
		var pow;
		aisWorkshop.prototype.updateByKing.call(this,king,nowTime,timeGap);
	};
}

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//生产模块:
	window.aisMacShop.prototype.com_BuyAddOn=function(comVO)
	{
		var def,cost,speed,task;
		def=this.addOnDefList[comVO.codeName];
		DBOut("Will buy addon: "+comVO.codeName+" x "+comVO.num);
		if(!def)
		{
			DBOut("aisMacShop.com_NewMfc Error 3: "+comVO.codeName);
			throw aisWorkshop.ERR_NoPrdct;
		}
		cost=def.cost;
		comVO.cost=cost;
		this.city.useCost(cost,comVO.num,0);
		this.city.addOnStorage.putIn({type:def.codeName,num:comVO.num});
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//升级零件:
	window.aisMacShop.prototype.com_EnhancePart=function(comVO)
	{
		var def,cost,speed,task,subType,storage,slot,level,levelDef;

		storage=this.tgtStorage;
		def=window.aisEnv.defLib.part[comVO.codeName];
		subType=comVO.subType;
		DBOut("Will enhance part: "+comVO.codeName+" x "+comVO.subType);
		if(!def)
		{
			DBOut("aisMacShop.com_EnhancePart Error 1: "+comVO.codeName+"/"+comVO.subType);
			throw aisWorkshop.ERR_NoPrdct;
		}
		slot=storage.slots[subType+"@"+comVO.codeName];
		if(!slot)
		{
			DBOut("aisMacShop.com_EnhancePart Error 2: "+comVO.codeName+"/"+comVO.subType);
			throw aisWorkshop.ERR_NoPrdct;
		}
		if(slot.subInfo && slot.subInfo.level)
		{
			level=slot.subInfo.level;
		}
		else
		{
			level=0;
		}
		levelDef=def.levels[level+1];
		if(!levelDef)
		{
			DBOut("aisMacShop.com_EnhancePart Error 3: "+comVO.codeName+"/"+comVO.subType+", "+level);
			throw aisWorkshop.ERR_NoPrdct;
		}
		cost=levelDef.cost;
		this.city.useCost(cost,1,0);
		slot.subInfo.level=level+1;
		comVO.level=slot.subInfo.level+1;
		comVO.cost=cost;
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//删除零件:
	window.aisMacShop.prototype.com_RemovePart=function(comVO)
	{
		var def,cost,speed,task,subType,storage,slot,level,levelDef;

		storage=this.tgtStorage;
		def=window.aisEnv.defLib.part[comVO.codeName];
		subType=comVO.subType;
		DBOut("Will RemovePart part: "+comVO.codeName+" x "+comVO.subType);
		if(!def)
		{
			DBOut("aisMacShop.com_RemovePart Error 1: "+comVO.codeName+"/"+comVO.subType);
			throw aisMacShop.ERR_NoPrdct;
		}
		storage.takeOut({type:comVO.codeName,subType:comVO.subType,num:comVO.num});
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//融合模块:
	window.aisMacShop.prototype.com_JointAddOn=function(comVO)
	{
		//TODO:啥也不干？直接发给服务器?
	};

	//---------------------------------------------------------------------------
	//抽宝箱:
	window.aisMacShop.prototype.com_GetBoxReward=function(comVO)
	{
		var def,cost;
		def=window.aisEnv.defLib.box[comVO.boxId];
		if(!def)
		{
			throw aisMacShop.ERR_NoBox;
		}
		if(comVO.isFree)
		{
			cost=def.cost;
			comVO.cost=cost;
			//this.city.useCost(cost,1,0);
		}
	};
	window.aisMacShop.prototype.com_CommitBoxReward=function(comVO)
	{
		var def,cost;
		def=window.aisEnv.defLib.box[comVO.boxId];
		if(!def)
		{
			throw aisMacShop.ERR_NoBox;
		}
		if(comVO.isFree)
		{
			cost=def.cost;
			comVO.cost=cost;
			this.city.useCost(cost,1,0);
		}
	};
}

//---------------------------------------------------------------------------
//回调函数-------------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisMacShop.prototype.cbk_MfcOver=function(vo,task,fakeCall)
	{
		var slot,list,store,vo,speed,task,cost,def,level;
		//DBOut("Mfc done: "+vo+", "+task);
		list=this.mfcSlots;
		slot=list[0];

		//检查仓库能不能放得下
		def=slot.def;
		vo={type:slot.def.codeName,num:1,subType:this.nextPartId,subInfo:{level:0}};
		store=this.tgtStorage;
		if(!fakeCall)
		{
			this.slotVsn++;
			this.makeViewsDirty();
		}
		if(store.checkPutIn(vo))
		{
			if(!this.rushTask)
			{
				this.king.execFakeCmd(this,"MfcDone",{codeName:def.codeName,svrCodeName:def.svrCodeName,slotIdx:slot.slotIdx,num:1},this,this.king.nowTime);
			}

			//调整建造容量
			this.slotCap-=def.storageSize;

			//把物品放入仓库
			store.putIn(vo,this);
			this.nextPartId++;

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
		if(this.working!=4)
		{
			this.working=4;//当前进入"停滞"状态
			this.makeViewsDirty();
		}
	};

	//合成成功：
	window.aisMacShop.prototype.cbk_JointDone=function(vo)
	{
		var storage;
		storage=this.city.addOnStorage;
		if(vo.base1)
			storage.takeOut({type:vo.base1.type,num:1});
		if(vo.base2)
			storage.takeOut({type:vo.base2.type,num:1});
		if(vo.fuseOil)
			storage.takeOut({type:vo.fuseOil.type,num:1});
		if(vo.newAddOn)
			storage.putIn({type:vo.newAddOn.type,num:1});
	};

	//合成失败：
	window.aisMacShop.prototype.cbk_JointFailed=function(vo)
	{
		var storage;
		storage=this.city.addOnStorage;
		if(vo.base1)
			storage.takeOut({type:vo.base1.type,num:1});
		if(vo.base2)
			storage.takeOut({type:vo.base2.type,num:1});
		if(vo.fuseOil)
			storage.takeOut({type:vo.fuseOil.type,num:1});
	};
}

}
