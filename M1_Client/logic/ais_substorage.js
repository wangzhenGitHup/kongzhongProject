if(!window.aisSubStorage)
{
//---------------------------------------------------------------------------
//子仓储对象,用来扩大主仓库的容量上限,根据策略调整当前的容量-----------------
//---------------------------------------------------------------------------
window.aisSubStorage=function(env,owner,mainStore,maxfactorName,useNewSlots,useTakenSlots)
{
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=owner;
		this.name="SubStorage";
		this.type="SubStorage";
		this.mainStore=mainStore;
		this.defLib=mainStore.defLib;

		this.useNewSlots=useNewSlots;
		this.useTakenSlots=useTakenSlots;

		mainStore.subStorages.push(this);

		aisTypes.applyType(this,aisTypes.aisValueOwner);
		aisTypes.applyType(this,aisTypes.aisViewConnect);

		this.addValue("maxLoad",0,null,null,maxfactorName);
		this.addValue("curLoad",0,null,"maxLoad",null);
		this.slots={};
		this.setValue("maxLoad",0,1);
		this.setValue("curLoad",0,1);
	}
};

window.aisSubStorage.prototype=new aisObj();
window.aisSubStorage.Err_NoItemType={level:100,error:"Argument error","class":"aisSubStorage",code:"Err_NoItemType"};

//---------------------------------------------------------------------------
window.aisSubStorage.prototype.checkPutIn=function(vo)
{
	var cap,slot,curLoad,maxLoad,num,rcap,def,slotName;
	if(!vo.type)
	{
		//TODO: reporet error!
		DBOut("aisSubStorage.putIn Error 1!");
		return 0;
	}
	if(!(vo.num>0))
	{
		//TODO: reporet error!
		DBOut("aisSubStorage.putIn Error 2!");
		return 0;
	}
	slotName=vo.subType?(vo.subType+"@"+vo.type):vo.type;
	num=vo.num;
	curLoad=this.getValue("curLoad");
	maxLoad=this.getValue("maxLoad");
	slot=this.slots[slotName];
	if(!slot)
	{
		//def=aisEnv.defLib[vo.type];
		def=this.defLib[vo.type];
		if(!def)
		{
			DBOut("aisSubStorage.putIn Error 3!");
			return;
		}
		if(!(def.storageSize>0))
		{
			DBOut("aisSubStorage.readFmVO Warning 1!");
		}
		slot={def:def,perSize:def.storageSize?def.storageSize:1,num:0};
	}
	cap=slot.perSize*num;
	if(cap+curLoad<=maxLoad)
	{
		vo.storeNum=num;
		return 1;
	}
	rcap=maxLoad-curLoad;
	num=Math.floor(rcap/slot.perSize);
	vo.storeNum=num;
	return 0;
};

//---------------------------------------------------------------------------
//vo的例子:{type:"gold",num:100}
window.aisSubStorage.prototype.putIn=function(vo,ignoreCap,fromBld,slient)
{
	var cap,slot,curLoad,maxLoad,num,rcap,def,slotName,list,i,n;
	if(!vo.type)
	{
		DBOut("aisSubStorage.putIn Error 1!");
		throw aisEnv.Err_WrongArg;
	}
	if(!(vo.num>0))
	{
		//TODO: reporet error!
		DBOut("aisSubStorage.putIn Error 2!");
		throw aisEnv.Err_WrongArg;
	}
	num=vo.num;
	this.setValue("maxLoad",this.getValueBase("maxLoad"),1);
	this.setValue("curLoad",this.getValueBase("curLoad"),1);
	curLoad=this.getValue("curLoad");
	maxLoad=this.getValue("maxLoad");
	//DBOut("Sub storage will put: "+vo.type+"@"+vo.subType+": "+num+", "+curLoad+", "+maxLoad+", ");
	if(vo.subType)
	{
		slotName=vo.subType+"@"+vo.type;
	}
	else
	{
		slotName=vo.type;
	}
	slot=this.slots[slotName];
	//def=aisEnv.defLib[vo.type];
	def=this.defLib[vo.type];
	if(!slot)
	{
		if(!def)
		{
			DBOut("aisSubStorage.putIn Error 3: "+vo.type);
			throw aisEnv.Err_DefNotFound;
		}
		if(!(def.storageSize>0))
		{
			DBOut("aisSubStorage.readFmVO Warning 1!");
			throw aisEnv.Err_WrongArg;
		}
		slot={def:def,perSize:def.storageSize?def.storageSize:1,num:0};
		if(vo.subType)
		{
			slot.subType=vo.subType;
			slot.slotIdx=slotName;
			if(vo.subInfo)
			{
				slot.subInfo=vo.subInfo;
			}
		}
		this.slots[slotName]=slot;
	}
	cap=slot.perSize*num;
	if(!ignoreCap)
	{
		if(cap+curLoad<=maxLoad)
		{
		}
		else
		{
			rcap=maxLoad-curLoad;
			num=Math.floor(rcap/slot.perSize);
			cap=num*slot.perSize;
		}
	}
	slot.num+=num;
	vo.putNum=num;
	curLoad+=cap;
	this.setValue("curLoad",curLoad,1);

	if(!slient)
	{
		if(this.useNewSlots||fromBld)//有来自的建筑, 或者指定必须有newSlot, 更新新增槽列表
		{
			if(!this.newSlots)
			{
				this.newSlots=[];
			}
			list=this.newSlots;
			n=list.length;
			putNewSlot:
			{
				for(i=0;i<n;i++)//检查是否可以合并槽
				{
					if(list[i].fromBld==fromBld && list[i].slotName==slotName)
					{
						list[i].num+=num;
						break putNewSlot;
					}
				}
				//没有可以合并的槽,建新的
				list.push({type:vo.type,def:def,level:vo.level,slotName:slotName,num:num,fromBld:fromBld,subType:vo.subType});
			}
		}
	}
	//检测是否触发任何的解锁？
	this.owner.king.checkDefUnlockVsb(def.unlockVsb);
	this.makeViewsDirty();
	this.owner.makeViewsDirty();
};

//---------------------------------------------------------------------------
//vo的例子:{type:"gold",num:100}
window.aisSubStorage.prototype.putItemsIn=function(list,slient)
{
	var i,n;
	n=list.length;
	for(i=0;i<n;i++)
	{
		this.putIn(list[i],0,0,slient);
	}
};

//---------------------------------------------------------------------------
window.aisSubStorage.prototype.checkTakeOut=function(vo)
{
	var slot,num,slotName;
	if(!vo.type)
	{
		DBOut("aisSubStorage.takeOut Error 1!");
		throw aisEnv.Err_WrongArg;
	}
	if(!(vo.num>0))
	{
		DBOut("aisSubStorage.checkTakeOut Error 2: "+vo.num);
		throw aisEnv.Err_WrongArg;
	}
	slotName=vo.subType?(vo.subType+"@"+vo.type):vo.type;
	num=vo.num;
	slot=this.slots[slotName];
	if(!slot)
	{
		DBOut("aisSubStorage.takeOut Waring 1: "+vo.type);
		return 0;
	}
	if(!(slot.num>=num))
	{
		vo.gap=slot.num-num;
		return 0;
	}
	return Math.floor(slot.num/num);
};

//---------------------------------------------------------------------------
window.aisSubStorage.prototype.takeOut=function(vo,a,go2aisBld)
{
	var cap,slot,curLoad,num,slotName,list,i,n,def;
	if(!vo.type)
	{
		//TODO: reporet error!
		DBOut("aisSubStorage.takeOut Error 1!");
		throw aisEnv.Err_WrongArg;
	}
	if(!(vo.num>0))
	{
		//TODO: reporet error!
		DBOut("aisSubStorage.takeOut Error 2: "+vo.num);
		throw aisEnv.Err_WrongArg;
	}
	slotName=vo.subType?(vo.subType+"@"+vo.type):vo.type;
	num=vo.num;
	curLoad=this.getValue("curLoad");
	slot=this.slots[slotName];
	if(!slot)
	{
		vo.takeNum=0;
		return 1;
	}
	cap=slot.perSize*num;
	def=slot.def;
	if(!(slot.num>=num))
	{
		num=slot.num;
	}
	vo.takeNum=num;
	slot.num-=num;
	curLoad-=num*slot.perSize;
	this.setValue("curLoad",curLoad,1);
	if(this.useTakenSlots)
	{
		if(!this.takenSlots)
		{
			this.takenSlots=[];
		}
		list=this.takenSlots;
		n=list.length;
		takeNewSlot:
		{
			for(i=0;i<n;i++)//检查是否可以合并槽
			{
				if(list[i].slotName==slotName)
				{
					list[i].num+=num;
					break takeNewSlot;
				}
			}
			//没有可以合并的槽,建新的
			list.push({type:vo.type,def:def,level:vo.level,slotName:slotName,num:num,subType:vo.subType,go2aisBld:go2aisBld});
		}
	}
	this.makeViewsDirty();
	this.owner.makeViewsDirty();
	return 1;
};

//---------------------------------------------------------------------------
window.aisSubStorage.prototype.getItemNum=function(name)
{
	var slot;
	slot=this.slots[name];
	if(!slot)
		return 0;
	return slot.num;
}

//---------------------------------------------------------------------------
//得到当前的剩余空间
window.aisSubStorage.prototype.getFreeCap=function()
{
	return this.getValue("maxLoad")-this.getValue("curLoad");
};

//---------------------------------------------------------------------------
//得到当前的已使用空间
window.aisSubStorage.prototype.getUsedCap=function()
{
	return this.getValue("curLoad");
};

//---------------------------------------------------------------------------
//得到当前的总空间
window.aisSubStorage.prototype.getTotalCap=function()
{
	return this.getValue("maxLoad");
};

//---------------------------------------------------------------------------
//得到当前库存中某样东西占用的空间
window.aisSubStorage.prototype.getItemCap=function(name)
{
	var slot;
	slot=this.slots[name];
	if(!slot)
		return 0;
	return slot.num*slot.perSize;
}

//---------------------------------------------------------------------------
//获得一定数量（num）的某样东西（type）占用的空间
window.aisSubStorage.prototype.getItemRoom=function(type,num)
{
	var def;
	//def=aisEnv.defLib[type];
	def=this.defLib[type];
	num=num?num:1;
	if(!def || !def.storageSize)
	{
		return num;
	}
	return def.storageSize*num;
}

//---------------------------------------------------------------------------
window.aisSubStorage.prototype.update=function()
{
	var i,list,slot,cap,oldmax,oldcap;
	cap=0;
	oldmax=this.getValue("maxLoad");
	oldcap=this.getValue("curLoad");
	list=this.slots;
	for(i in list)
	{
		slot=list[i];
		cap+=slot.num*slot.perSize;
	}
	this.setValue("curLoad",cap,1);//更新当前值
	this.updateValues();
	if(oldmax!=this.getValue("maxLoad") || oldcap!=this.getValue("curLoad"))
	{
		this.makeViewsDirty();
	}
};
}
