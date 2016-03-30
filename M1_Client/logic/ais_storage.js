if(!window.aisStorage)
{
//---------------------------------------------------------------------------
//仓储槽，每个槽放一种资源---------------------------------------------------
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
//仓储对象，一个仓储对象可以有多个槽-----------------------------------------
//---------------------------------------------------------------------------
window.aisStorage=function(env,owner,maxfactorName,defLib)
{
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=owner;
		this.name="Storage";
		this.type="Storage";
		if(defLib)
		{
			this.defLib=defLib;
		}
		else
		{
			this.defLib=aisEnv.defLib.prdct;
		}

		this.subStorages=[];

		aisTypes.applyType(this,aisTypes.aisValueOwner);
		aisTypes.applyType(this,aisTypes.aisViewConnect);

		this.addValue("maxLoad",0,null,null,maxfactorName);
		this.addValue("curLoad",0,null,"maxLoad",null);
		this.slots={};
		this.setValue("maxLoad",0,1);
		this.setValue("curLoad",0,1);
	}
};

window.aisStorage.prototype=new aisObj();
window.aisStorage.Err_NoItemType={level:100,error:"Argument error","class":"aisStorage",code:"Err_NoItemType"};

//---------------------------------------------------------------------------
window.aisStorage.prototype.filterItems=function(catlog)
{
	var i,list,slot,rlist,type;

	rlist=[];
	list=this.slots;
	for(i in list)
	{
		type=list[i].def.storeType?list[i].def.storeType:list[i].def.type;
		//DBOut("Check type: "+type+" vs "+catlog);
		if(type==catlog)
		{
			rlist.push({type:list[i].def.codeName,def:list[i].def,idx:i,subType:list[i].subType,subInfo:list[i].subInfo});
		}
	}
	return rlist;
};

//---------------------------------------------------------------------------
window.aisStorage.prototype.filterItemsEx=function(pname,catlog)
{
	var i,list,slot,rlist,type;

	rlist=[];
	list=this.slots;
	for(i in list)
	{
		type=list[i].def[pname];
		if(type==catlog)
		{
			rlist.push({type:list[i].def.codeName,def:list[i].def,idx:i,subType:list[i].subType,subInfo:list[i].subInfo});
		}
	}
	return rlist;
};

//---------------------------------------------------------------------------
//vo的例子:{type:"gold",num:100}
window.aisStorage.prototype.checkPutIn=function(vo)
{
	var cap,slot,curLoad,maxLoad,num,rcap,def;
	if(!vo.type)
	{
		//TODO: reporet error!
		DBOut("aisStorage.checkPutIn Error 1: "+vo.type);
		return 0;
	}
	if(!(vo.num>0))
	{
		//TODO: reporet error!
		DBOut("aisStorage.checkPutIn Error 2: "+vo.type+", "+vo.num);
		return 0;
	}
	num=vo.num;
	curLoad=this.getValue("curLoad");
	maxLoad=this.getValue("maxLoad");
	slot=this.slots[vo.type];
	if(!slot)
	{
		//def=aisEnv.defLib[vo.type];
		def=this.defLib[vo.type];
		if(!def)
		{
			DBOut("aisStorage.putIn Error 3: "+vo.type);
			return;
		}
		if(!(def.storageSize>0))
		{
			DBOut("aisStorage.checkPutIn checkPutIn 1! "+def.storageSize);
		}
		slot={def:def,perSize:def.storageSize?def.storageSize:1,num:0};
	}
	cap=slot.perSize*num;
	//DBOut("Check put in: "+cap+", "+curLoad+", "+maxLoad);
	if(cap+curLoad<=maxLoad)
	{
		return 1;
	}
	rcap=maxLoad-curLoad;
	//DBOut("Remain capacity: "+rcap+", persize: "+slot.perSize);
	num=Math.floor(rcap/slot.perSize);
	vo.storeNum=num;
	return 0;
};

//---------------------------------------------------------------------------
//vo的例子:{type:"gold",num:100}
window.aisStorage.prototype.putIn=function(vo,fromBld,slient)
{
	var cap,slot,curLoad,maxLoad,num,rcap,def,slotName;
	if(!vo.type)
	{
		DBOut("aisStorage.putIn Error 1: "+vo.type+", "+vo.num);
		throw aisEnv.Err_WrongArg;
	}
	if(!(vo.num>0))
	{
		//TODO: reporet error!
		DBOut("aisStorage.putIn Error 2: "+vo.type+", "+vo.num);
		throw aisEnv.Err_WrongArg;
	}
	num=vo.num;
	curLoad=this.getValue("curLoad");
	maxLoad=this.getValue("maxLoad");
	//DBOut("Will put: "+vo.type+" x "+num+", "+curLoad+", "+maxLoad+" sbuType="+vo.subType);
	if(vo.subType)
	{
		slotName=vo.subType+"@"+vo.type;
	}
	else
	{
		slotName=vo.type;
	}

	slot=this.slots[slotName];
	def=this.defLib[vo.type];
	if(!slot)
	{
		if(!def)
		{
			DBOut("aisStorage.putIn Error 3: "+vo.type);
			throw aisEnv.Err_DefNotFound;
		}
		if(!(def.storageSize>-1))
		{
			DBOut("aisStorage.putIn Error 1!"+def.storageSize);
			throw aisEnv.Err_WrongArg;
		}
		slot={slotIdx:slotName,def:def,perSize:(def.storageSize>-1)?def.storageSize:1,num:0};
		if(vo.subType)
		{
			slot.subType=vo.subType;
			if(vo.subInfo)
			{
				slot.subInfo=vo.subInfo;
			}
		}
		this.slots[slotName]=slot;
	}
	cap=slot.perSize*num;
	if(cap+curLoad<=maxLoad)
	{
	}
	else
	{
		rcap=maxLoad-curLoad;
		num=Math.floor(rcap/slot.perSize);
		cap=num*slot.perSize;
	}
	slot.num+=num;
	vo.putNum=num;
	curLoad+=cap;
	this.setValue("curLoad",curLoad,1);

	if(1)//TODO:检查是否是客户端,只有客户端才需要往子存储里放:
	{
		//DBOut("Will put in sub: "+vo.type+"x"+vo.putNum);
		this.putInSub({type:vo.type,num:vo.putNum,subType:vo.subType},fromBld,slient);
	}

	//检测是否触发任何的解锁？
	//DBOut("this.owner: "+this.owner+", "+this.owner.type);
	this.owner.king.checkDefUnlockVsb(def.unlockVsb);
	this.makeViewsDirty();
};

//---------------------------------------------------------------------------
//list的例子:[{type:"gold",num:100},{type:"gass",num:30}]
window.aisStorage.prototype.putItemsIn=function(list,slient)
{
	var i,n;
	n=list.length;
	for(i=0;i<n;i++)
	{
		this.putIn(list[i],0,slient);
	}
};

//---------------------------------------------------------------------------
window.aisStorage.prototype.checkTakeOut=function(vo)
{
	var slot,num;
	if(!vo.type)
	{
		DBOut("aisStorage.takeOut Error 1!");
		throw aisEnv.Err_WrongArg;
	}
	if(!(vo.num>0))
	{
		DBOut("aisStorage.checkTakeOut Error 2: "+vo.num);
		throw aisEnv.Err_WrongArg;
	}
	num=vo.num;
	slot=this.slots[vo.type];
	if(!slot)
	{
		DBOut("aisStorage.takeOut Waring 1: "+vo.type);
		vo.gap=num;
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
window.aisStorage.prototype.takeOut=function(vo,go2aisBld)
{
	var cap,slot,curLoad,num,slotName;
	if(!vo.type)
	{
		//TODO: reporet error!
		DBOut("aisStorage.takeOut Error 1!");
		throw aisEnv.Err_WrongArg;
	}
	if(!(vo.num>0))
	{
		//TODO: reporet error!
		DBOut("aisStorage.takeOut Error 2: "+vo.num);
		throw aisEnv.Err_WrongArg;
	}
	if(vo.subType)
	{
		slotName=vo.subType+"@"+vo.type;
	}
	else
	{
		slotName=vo.type;
	}
	num=vo.num;
	curLoad=this.getValue("curLoad");
	slot=this.slots[slotName];
	if(!slot)
	{
		DBOut("aisStorage.takeOut Error 3: "+slotName);
		throw aisStorage.Err_NoItemType;
	}
	cap=slot.perSize*num;
	if(!(slot.num>=num))
	{
		DBOut("aisStorage.takeOut Error 4!");
		throw aisEnv.Err_WrongArg;
	}
	slot.num-=num;
	curLoad-=num*slot.perSize;
	this.setValue("curLoad",curLoad,1);

	if(1)//TODO:检查是否是客户端,只有客户端才需要从子存储里取:
	{
		this.takeOutSub({type:vo.type,num:num,subType:vo.subType},go2aisBld);
	}

	this.makeViewsDirty();
	return 1;
};

//---------------------------------------------------------------------------
window.aisStorage.prototype.lockItem=function(vo)
{
	var cap,slot,num,slotName,freeNum;
	if(!vo.type)
	{
		//TODO: reporet error!
		DBOut("aisStorage.lockItem Error 1!");
		throw aisEnv.Err_WrongArg;
	}
	if(!(vo.num>0))
	{
		//TODO: reporet error!
		DBOut("aisStorage.lockItem Error 2: "+vo.num);
		throw aisEnv.Err_WrongArg;
	}
	if(vo.subType)
	{
		slotName=vo.subType+"@"+vo.type;
	}
	else
	{
		slotName=vo.type;
	}
	num=vo.num;
	slot=this.slots[slotName];
	if(!slot)
	{
		DBOut("aisStorage.lockItem Error 3: "+slotName);
		throw aisStorage.Err_NoItemType;
	}
	freeNum=slot.num;
	if(slot.lockNum>0)
	{
		freeNum-=slot.lockNum;
	}
	if(!(freeNum>=num))
	{
		DBOut("aisStorage.takeOut Error 4: "+slotName+", "+num+" vs "+freeNum);
		throw aisStorage.Err_NoItemType;
	}
	if(slot.lockNum>0)
	{
		slot.lockNum+=num;
	}
	else
	{
		slot.lockNum=num;
	}
	if(vo.stubObj)
	{
		if(!slot.lockStubs)
		{
			slot.lockStubs=[{obj:vo.stubObj,num:num}];
		}
		else
		{
			slot.lockStubs.push({obj:vo.stubObj,num:num});
		}
	}
	this.makeViewsDirty();
	return 1;
};

//---------------------------------------------------------------------------
window.aisStorage.prototype.unlockItem=function(vo)
{
	var cap,slot,num,slotName,lockNum,list,i,n;
	if(!vo.type)
	{
		//TODO: reporet error!
		DBOut("aisStorage.takeOut Error 1!");
		throw aisEnv.Err_WrongArg;
	}
	if(!(vo.num>0))
	{
		//TODO: reporet error!
		DBOut("aisStorage.takeOut Error 2: "+vo.num);
		throw aisEnv.Err_WrongArg;
	}
	if(vo.subType)
	{
		slotName=vo.subType+"@"+vo.type;
	}
	else
	{
		slotName=vo.type;
	}
	num=vo.num;
	slot=this.slots[slotName];
	if(!slot)
	{
		DBOut("aisStorage.takeOut Error 3: "+slotName);
		throw aisStorage.Err_NoItemType;
	}
	lockNum=slot.lockNum;
	if(!(lockNum>=num))
	{
		DBOut("aisStorage.takeOut Error 4: "+slotName+", "+num+" vs "+lockNum);
		throw aisStorage.Err_NoItemType;
	}
	slot.lockNum-=num;
	if(vo.stubObj && slot.lockStubs)
	{
		list=slot.lockStubs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i].obj==vo.stubObj)
			{
				list[i].num-=vo.num;
				if(list[i].num<=0)
				{
					list.splice(i,1);
					break;
				}
			}
		}
	}
	this.makeViewsDirty();
	return 1;
};

//---------------------------------------------------------------------------
window.aisStorage.prototype.getItemNum=function(type)
{
	var slot;
	slot=this.slots[type];
	if(!slot)
		return 0;
	return slot.num;
}

//---------------------------------------------------------------------------
//得到当前的剩余空间
window.aisStorage.prototype.getFreeCap=function()
{
	return this.getValue("maxLoad")-this.getValue("curLoad");
};

//---------------------------------------------------------------------------
//得到当前的已使用空间
window.aisStorage.prototype.getUsedCap=function()
{
	return this.getValue("curLoad");
};

//---------------------------------------------------------------------------
//得到当前的已使用空间(包括超过上限的)
window.aisStorage.prototype.getUsedBaseCap=function()
{
	return this.getValueBase("curLoad");
};

//---------------------------------------------------------------------------
//得到当前的总空间
window.aisStorage.prototype.getTotalCap=function()
{
	return this.getValue("maxLoad");
};

//---------------------------------------------------------------------------
//得到当前库存中某样东西占用的空间
window.aisStorage.prototype.getItemCap=function(name)
{
	var slot;
	slot=this.slots[name];
	if(!slot)
		return 0;
	return slot.num*slot.perSize;
}

//---------------------------------------------------------------------------
//获得一定数量（num）的某样东西（type）占用的空间
window.aisStorage.prototype.getItemRoom=function(type,num)
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
//获得多个东西的尺寸，list的格式是:[{type:itemCodeName,num:number of item},...]
window.aisStorage.prototype.getItemsRoom=function(list)
{
	var def,i,n,size;
	var totalSize=0;
	n=list.length;
	for(i=0;i<n;i++)
	{
		//def=aisEnv.defLib[list[i].type];
		def=this.defLib[list[i].type];
		if(!def || !def.storageSize)
		{
			totalSize+=list[i].num;
		}
		else
		{
			totalSize+=def.storageSize*list[i].num;
		}
	}
	return totalSize;
}


//---------------------------------------------------------------------------
window.aisStorage.prototype.readFmVO=function(king,voObj)
{
	var i,list,def,voSlot,slot,slotName,slist;
	aisObj.prototype.readFmVO.call(this,voObj);
	list=this.slots;
	slist=voObj.slots;
	for(i in slist)
	{
		voSlot=slist[i];
		//def=aisEnv.defLib[voSlot.type];
		def=this.defLib[voSlot.type];
		if(!def)
		{
			DBOut("aisStorage.readFmVO Error 1: "+toJSON(voSlot));
		}
		if(!(def.storageSize>0))
		{
			DBOut("aisStorage.readFmVO Warning 1!"+def.storageSize);
		}
		slotName=voSlot.subType?(voSlot.subType+"@"+voSlot.type):voSlot.type;
		slot={def:def,perSize:def.storageSize?def.storageSize:1,num:voSlot.num,slotIdx:slotName,lockNum:voSlot.lockNum};
		if(voSlot.subType)
		{
			slot.subType=voSlot.subType;
			if(voSlot.subInfo)
				slot.subInfo=voSlot.subInfo;
		}
		list[slotName]=slot;
		if(1)//TODO:检查是否是客户端,只有客户端才需要往子存储里放:
		{
			this.putInSub({type:voSlot.type,num:voSlot.num,subType:voSlot.subType});
		}
	}
	this.update();
};

//---------------------------------------------------------------------------
window.aisStorage.prototype.saveToVO=function(king,voObj)
{
	var i,list,def,slot,dlist,num;
	aisObj.prototype.saveToVO.call(this,voObj);
	dlist={};
	list=this.slots;
	for(i in list)
	{
		slot=list[i];
		num=slot.num;
		if(num || slot.def.storageSave)
		{
			dlist[i]={type:slot.def.codeName,num:num,lockNum:slot.lockNum};
			if(slot.subType)
			{
				dlist[i].subType=slot.subType;
				if(slot.subInfo)
				{
					dlist[i].subInfo=slot.subInfo;
				}
			}
		}
	}
	voObj.slots=dlist;
};

//---------------------------------------------------------------------------
window.aisStorage.prototype.update=function()
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
	this.setValue("maxLoad",0,1);//更新最大值
	this.setValue("curLoad",cap,1);//更新当前值
	if(oldmax!=this.getValue("maxLoad") || oldcap!=this.getValue("curLoad"))
	{
		this.makeViewsDirty();
	}
};

//***************************************************************************
//与子仓库相关的函数:
//***************************************************************************
{
	//---------------------------------------------------------------------------
	//把东西放进子仓库,尽量平均放
	window.aisStorage.prototype.putInSub=function(vo,fromBld,slient)
	{
		var list,total,i,n;
		var subvo,evenNum,putNum,fullNum,maxRm,maxId,rm;

		//DBOut("putInSub: "+vo.type+" x "+vo.num+", @"+vo.subType);
		if(!fromBld)
		{
			//DBOut("Will put even in storages!!");
			total=vo.num;
			list=this.subStorages;
			n=list.length;
			if(n>0)
			{

				putNum=0;
				subvo={type:vo.type,num:vo.num,putNum:0,subType:vo.subType};
				if(total>=n)//数量多的时候,试图平均分配
				{
					fullNum=0;
					//试图均匀的放进去
					//DBOut("put num: "+total);//调试!!!!
					while(putNum<total && fullNum<n)
					{
						evenNum=Math.floor((total-putNum)/(n-fullNum));
						//DBOut("Event num: "+evenNum);
						if(!evenNum>0)
							break;
						for(i=0;i<n;i++)
						{
							//DBOut("Event put to sub: "+evenNum);
							subvo.putNum=0;
							subvo.num=evenNum;
							list[i].putIn(subvo,0,null,slient);
							putNum+=subvo.putNum;
							//DBOut("Total put: "+putNum);
							if(!subvo.putNum)
							{
								fullNum+=1;
							}
						}
					}
				}
				//while(putNum<total)//数量少或者平均分配后还没放完,平均塞进去
				if(putNum<total)//暂时往存量最小的子仓库里塞
				{
					maxRm=-1;
					maxId=-1;
					for(i=0;i<n;i++)
					{
						rm=list[i].getFreeCap();
						if(rm>maxRm)
						{
							maxRm=rm;
							maxId=i;
						}
					}
					//subvo.num=1;
					subvo.num=total-putNum;
					list[maxId].putIn(subvo,1,null,slient);//必须放进去
					//putNum+=1;
				}
			}
		}
		else//挑选距离最近的容器放置
		{
			var sub,minSub,minDis,dx,dy;
			//DBOut("Will find nearest storage!!");
			total=vo.num;
			list=this.subStorages;
			n=list.length;
			if(n>0)
			{
				putNum=vo.num;
				subvo={type:vo.type,num:putNum,subType:vo.subType};
				while(putNum>0)
				{
					minSub=null;
					minDis=10000;
					subvo.putNum=putNum;
					for(i=0;i<n;i++)
					{
						sub=list[i];
						dx=sub.owner.pos[0]-fromBld.pos[0];
						dy=sub.owner.pos[1]-fromBld.pos[1];
						dx=dx<0?-dx:dx;
						dy=dy<0?-dy:dy;
						dx+=dy;
						if(!(dx>=minDis))
						{
							vo.storeNum=0;
							if(sub.checkPutIn(subvo) || vo.storeNum>0)
							{
								minDis=dx;
								minSub=sub;
							}
						}
					}
					if(minSub)
					{
						subvo.putNum=0;
						minSub.putIn(subvo,0,fromBld,slient);
						putNum-=subvo.putNum;
					}
					else//All Full!
					{
						break;
					}
				}
				if(putNum>0)//还剩下没放下的:
				{
					minSub=null;
					minDis=-1000;
					for(i=0;i<n;i++)
					{
						sub=list[i];
						rm=sub.getFreeCap();
						if(rm>minDis)
						{
							minDis=rm;
							minSub=sub;
						}
					}
					if(minSub)
					{
						subvo.num=putNum;
						minSub.putIn(subvo,1,fromBld,slient);
					}
				}
			}
		}
	};

	//---------------------------------------------------------------------------
	//把东西取出子仓库,尽量平均取
	window.aisStorage.prototype.takeOutSub=function(vo,go2aisBld)
	{
		var list,total,i,n,allFull;
		var subvo,evenNum,takeNum,fullNum,maxRm,maxId,rm;

		total=vo.num;
		list=this.subStorages;
		n=list.length;
		if(n>0)
		{
			takeNum=0;
			subvo={type:vo.type,num:vo.num,takeNum:0,subType:vo.subType};
			if(total>=n)//数量多的时候,试图平均分配
			{
				fullNum=0;
				//试图均匀的取出
				while(takeNum<total && fullNum<n)
				{
					allFull=1;
					evenNum=Math.floor((total-takeNum)/(n-fullNum));
					if(!evenNum>0)
						break;
					for(i=0;i<n;i++)
					{
						subvo.takeNum=0;
						subvo.num=evenNum;
						list[i].takeOut(subvo,0,go2aisBld);
						takeNum+=subvo.takeNum;
						if(!subvo.takeNum)
						{
							fullNum+=1;
						}
					}
				}
			}
			while(takeNum<total)//数量少或者平均分配后还没放完,平均取
			{
				maxRm=-1;
				maxId=-1;
				for(i=0;i<n;i++)
				{
					rm=list[i].getItemNum(vo.type);
					if(rm>maxRm)
					{
						maxRm=rm;
						maxId=i;
					}
				}
				if(maxRm>0)
				{
					subvo.num=1;
					list[maxId].takeOut(subvo,1,go2aisBld);
					takeNum+=1;
				}
				else
				{
					//TODO: Report warning?
					break;//Error!!
				}
			}
		}
	};
}

}
