if(!window.aisCity)
{
window.aisCity=function(env,king)
{
	var date;
	var factor;
	var i,n,list,def;
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=king;
		this.name="City";
		this.type="City";
		this.king=king;
		this.bufs=[];
		this.floors=[];
		this.buildings=[];
		this.crafts=[];
		this.fleets=[];
		this.events=[];
		//this.king.addHashObj(this);
		//建筑区域最大尺寸，这个和具体游戏设定有关
		this.bldBoxSize=[40,40];

		this.power=new aisPower(env,null,this,"POWER_GEN","POWER_UPKEEP","POWER_WORKCOST");

		//增加动态数据修正器的功能
		aisTypes.applyType(this,aisTypes.opFactorOwner);
		//增加动态数值的功能
		aisTypes.applyType(this,aisTypes.aisValueOwner);
		//增加Feature拥有者功能
		aisTypes.applyType(this,aisTypes.aisFeatureOwner);
		//增加与UI控件关联的接口
		aisTypes.applyType(this,aisTypes.aisViewConnect);
		//增加可以拥有Buff接口
		aisTypes.applyType(this,aisTypes.aisBuffOwner);
		//增加可以拥有建造工人的接口
		aisTypes.applyType(this,aisTypes.aisBldWorkerOwner);

		//建筑建造速度
		this.addValue("bldSpeed",1.0,null,null,"BldSpeed");

		//初始化关于建筑物上限的数值/修正
		list=aisEnv.defLib.bld;
		for(i in list)
		{
			def=list[i];
			if(def.codeName)
			{
				this.addValue("numCap"+i,def.maxCap?def.maxCap:0,null,null,"NumCap"+i);
				this.addValue("numBld"+i,0,null,null,"NumBld"+i);
				this.addValue("maxCap"+i,def.maxCap?def.maxCap:0,null,null,"MaxCap"+i);
			}
		}
		this.storageList=[];
		this.allStorages={};
		this.honor=0;
	}
};

window.aisCity.prototype=new aisObj();
window.aisCity.ERR_BldNoDef={level:100,error:"Can't find building def","class":"aisCity",code:"ERR_BldNoDef"};
window.aisCity.ERR_BadBldPos={level:0,error:"Wrong building pos.","class":"aisCity",code:"ERR_BadBldPos"};
window.aisCity.ERR_NotEnoughCost={level:100,error:"Not enough cost.","class":"aisCity",code:"ERR_NotEnoughCost"};
window.aisCity.ERR_SellTooMuch={level:100,error:"Try to sell/give up more than have.","class":"aisCity",code:"ERR_SellTooMuch"};
window.aisCity.ERR_NoStorage={level:100,error:"Can't find a storage.","class":"aisCity",code:"ERR_NoStorage"};
window.aisCity.ERR_NoGem={level:100,error:"Not enough gems.","class":"aisCity",code:"ERR_NoGem"};

//---------------------------------------------------------------------------
//更新全部静态参数
window.aisCity.prototype.updateStatic=function()
{
	var i,n,list;
	this.updateOpFactors();
	this.updateValues();
	this.power.update();

	list=this.storageList;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].update();
	}
	//更新全部结构楼层的静态参数
	list=this.floors;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].updateStatic();
	}
	//更新全部建筑的静态参数
	list=this.buildings;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(!list[i].dummyUpdate)
		{
			list[i].updateStatic();
		}
	}
	//更新全部飞船的静态参数
	list=this.crafts;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].updateStatic();
	}
};

//---------------------------------------------------------------------------
window.aisCity.prototype.updateByKing=function(king,nowTime,timeGap)
{
	//TODO: code this
	var i,n,list;

	//更新所有的结构楼层
	list=this.floors;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].updateByKing(king,nowTime,timeGap);
		if(list[i].deadOut)
		{
			list.splice(i,1);i--;n--;
		}
	}

	//更新所有的建筑
	list=this.buildings;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(!list[i].dummyUpdate)
		{
			list[i].updateByKing(king,nowTime,timeGap);
		}
		if(list[i].deadOut)
		{
			list.splice(i,1);i--;n--;
		}
	}

	//更新所有的舰船
	list=this.crafts;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].updateByKing(king,nowTime,timeGap);
		if(list[i].deadOut)
		{
			list.splice(i,1);i--;n--;
		}
	}

	//更新所有的舰队
	list=this.fleets;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].updateByKing(king,nowTime,timeGap);
		if(list[i].deadOut)
		{
			list.splice(i,1);i--;n--;
		}
	}

	//更新所有的事件
	list=this.fleets;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].updateByKing(king,nowTime,timeGap);
		if(list[i].deadOut)
		{
			list.splice(i,1);i--;n--;
		}
	}

	//更新Buffs
	this.updateBuffs(king,nowTime,timeGap);
};

//---------------------------------------------------------------------------
//对象I/O相关的函数-----------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//将City的信息保存到voObj中
	window.aisCity.prototype.saveToVO=function(king,voObj)
	{
		var i,n,list,vo;
		DBOut(">>>>>>>>>aisCity.saveToVO");
		aisObj.prototype.saveToVO.call(this,voObj);
		voObj.name=this.name;
		voObj.honor=this.honor;
		voObj.raidedRecord=this.raidedRecord;
		voObj.gifts=this.gifts;
		voObj.record=this.record;
		voObj.cooldownTime=this.cooldownTime;
		voObj.allianceFlag=this.allianceFlag;
		voObj.allianceLevel=this.allianceLevel;
		voObj.charge=this.charge;
		voObj.pve2VO=this.pve2VO;

		voObj.tombStoneHash=this.tombStoneHash;//墓碑hash数组
		voObj.crashedTrapsHash=this.crashedTrapsHash;
		voObj.pveVOs=this.pveVOs;
		voObj.allianceId=this.allianceId;
		voObj.attackCost=this.attackCost;
		voObj.leaveAttacked=this.leaveAttacked;
		voObj.vipLevel=this.vipLevel;
		voObj.resetDailyTasksTime=this.resetDailyTasksTime;
		voObj.vipBuyGold=this.vipBuyGold;
		voObj.vipBuyOil=this.vipBuyOil;
		voObj.vipBuyCube=this.vipBuyCube;
		voObj.vipExp=this.vipExp;
		voObj.openBoxTimesDaily=this.openBoxTimesDaily;
		voObj.monthCardVO=this.monthCardVO;
		voObj.timeButtonCoolDown=this.timeButtonCoolDown;
		voObj.enemys=this.enemys;
		voObj.shieldTime=this.shieldTime;
		voObj.nextDayZeroTime=this.nextDayZeroTime;
		voObj.opFlags=this.opFlags;
		voObj.times=this.times;
		//存储所有的结构楼层
		list=this.floors;
		voObj.floors=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			voObj.floors[i]=vo={};
			this.floors[i].saveToVO(king,vo);
		}

		DBOut("aisCity.saveToVO2");
		//存储所有的建筑
		list=this.buildings;
		voObj.buildings=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			voObj.buildings[i]=vo={};
			this.buildings[i].saveToVO(king,vo);
		}

		DBOut("aisCity.saveToVO3");

		//存储所有的仓库
		this.saveStorages(king,voObj);

		//存储所有的舰队
		DBOut("aisCity.saveToVO4");
		list=this.fleets;
		voObj.fleets=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			voObj.fleets[i]=vo={};
			this.fleets[i].saveToVO(king,vo);
		}

		//存储所有的事件（任务）
		DBOut("aisCity.saveToVO5");
		list=this.events;
		voObj.events=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			voObj.events[i]=vo={};
			this.events[i].saveToVO(king,vo);
		}

		this.saveBuffs(king,voObj);
		this.saveBuilders(voObj);
		DBOut("<<<<<<<<<<<<<aisCity.saveToVO");
	};

	//---------------------------------------------------------------------------
	//从voObj中读出City信息
	window.aisCity.prototype.readFmVO=function(king,voObj)
	{
		var i,n,list;
		//DBOut("aisCity.prototype.readFmVO 1: "+king+", "+voObj);
		aisObj.prototype.readFmVO.call(this,voObj);
		this.name=voObj.name?voObj.name:this.name;
		this.honor=voObj.honor;
		this.raidedRecord=voObj.raidedRecord;
		this.gifts=voObj.gifts;
		this.record=voObj.record;
		this.cooldownTime=voObj.cooldownTime;
		this.allianceFlag=voObj.allianceFlag;
		this.allianceLevel=voObj.allianceLevel;
		this.charge=voObj.charge;
		this.pve2VO=voObj.pve2VO;

		this.power.lockUpdate=1;

		this.tombStoneHash=voObj.tombStoneHash;//墓碑hash数组
		this.crashedTrapsHash=voObj.crashedTrapsHash;
		this.pveVOs=voObj.pveVOs;
		this.allianceId=voObj.allianceId;
		this.attackCost=voObj.attackCost;
		this.leaveAttacked=voObj.leaveAttacked;
		this.vipLevel=voObj.vipLevel;
		this.resetDailyTasksTime=voObj.resetDailyTasksTime;
		this.vipBuyGold=voObj.vipBuyGold;
		this.vipBuyOil=voObj.vipBuyOil;
		this.vipBuyCube=voObj.vipBuyCube;
		this.vipExp=voObj.vipExp;
		this.openBoxTimesDaily=voObj.openBoxTimesDaily;
		this.monthCardVO=voObj.monthCardVO;
		this.timeButtonCoolDown=voObj.timeButtonCoolDown;
		this.enemys=voObj.enemys;
		this.shieldTime=voObj.shieldTime;
		this.nextDayZeroTime=voObj.nextDayZeroTime;
		this.opFlags=voObj.opFlags;
		this.times=voObj.times;

		//DBOut("aisCity.prototype.readFmVO 2: "+this.type+", "+this.name);

		this.loadBuilders(voObj);

		//读出所有的建筑结构层
		list=voObj.floors;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				this.floors[i]=aisBuilding.readBuilding(king,this,list[i]);
			}
		}

		//DBOut("aisCity.prototype.readFmVO 3: ");
		//读出所有的建筑
		list=voObj.buildings;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.buildings[i]=aisBuilding.readBuilding(king,this,list[i]);
		}

		//DBOut("aisCity.prototype.readFmVO 4: ");
		this.loadStorages(king,voObj);

		//DBOut("aisCity.prototype.readFmVO 6: ");
		//读出所有的舰队
		list=voObj.fleets;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.fleets[i]=aisFleet.readFleet(king,this,list[i]);
		}

		//DBOut("aisCity.prototype.readFmVO 7: ");
		//读出所有的事件（任务）
		list=voObj.events;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.events[i]=aisEvent.readEvent(king,this,list[i]);
		}

		//DBOut("aisCity.prototype.readFmVO 8: ");
		//读出所有的增效
		this.loadBuffs(king,voObj);
		//链接建筑工人
		this.linkBuiler2Bld();

		this.power.lockUpdate=0;
		this.power.update();
	};

	//---------------------------------------------------------------------------
	//将Storage保存至voObj, 派生类需要重写?
	window.aisCity.prototype.saveStorages=function(king,voObj)
	{
		var i,list,vo;
		voObj.storages={};
		list=this.allStorages;
		for(i in list)
		{
			vo={};
			list[i].saveToVO(king,vo);
			voObj.storages[i]=vo;
		}
	};

	//---------------------------------------------------------------------------
	//从voObj读出Storages, 派生类需要重写?
	window.aisCity.prototype.loadStorages=function(king,voObj)
	{
		var list,i,vo;
		list=voObj.storages;
		for(i in list)
		{
			this.allStorages[i].readFmVO(king,list[i]);
		}
	}
}

//---------------------------------------------------------------------------
//与制造、研究、建造需求以及仓储功能相关的函数-------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//测试产生某个东西需要的物资消耗是否满足
	window.aisCity.prototype.checkReq=function(def)
	{
		var req,i,n,list,pow,item,itemvo,store;
		req=def.req;
		list=req.features;
		if(list)
		{
			if(this.getMissingFeatures(list,1))
				return 0;
		}
		if(req.power)
		{
			pow=this.power.getValue("curOutput")-this.power.getValue("curAllUsed");
			if(pow<req.power)
				return 0;
		}
		//TODO: 改写这个部分,支持各种仓库存取
		list=req.storage;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				item=list[i];
				store=this.allStorages[item.store];
				if(!store)
				{
					DBOut("Can't find storage: "+item.store);
					return 0;
				}
				itemvo={type:item.type,num:item.num};
				if(!store.checkTakeOut(vo))
					return 0;
			}
		}
		return 1;
	}

	//---------------------------------------------------------------------------
	//测试创造某个东西需要的物资消耗是否满足
	window.aisCity.prototype.checkCost=function(cost,num,shortVO)
	{
		var cstore,i,n,item,cnt,maxcnt,itemvo,store,def;
		maxcnt=num;
		if(cost.cash)//检查货币是否够
		{
			maxcnt=Math.floor(this.king.cashNum/(cost.cash*num));
			if(!maxcnt)
			{
				if(!shortVO)
					return 0;
				shortVO.cash=(cost.cash*num)-this.king.cashNum;
			}

		}
		if(cost.gem)//检查魔钻是否够
		{
			cnt=Math.floor(this.king.gemNum/(cost.gem*num));
			maxcnt=cnt<maxcnt?cnt:maxcnt;
			if(!cnt)
			{
				if(!shortVO)
					return 0;
				shortVO.gem=(cost.gem*num)-this.king.gemNum;
			}
		}
		//TODO:改写这个, 支持多种Storage
		if(shortVO)
		{
			shortVO.storage=[];
		}
		cstore=cost.storage;
		n=cstore.length;
		for(i=0;i<n;i++)
		{
			item=cstore[i];
			store=this.allStorages[item.store];
			if(store)
			{
				itemvo={type:item.type,num:item.num*num};
				cnt=store.checkTakeOut(itemvo);
				maxcnt=cnt<maxcnt?cnt:maxcnt;
				if(!cnt)
				{
					if(!shortVO)
						return 0;
					def=store.defLib[item.type];
					shortVO.storage.push({name:def?def.name:item.type,type:item.type,num:itemvo.gap});
				}
			}
			else
			{
				if(!shortVO)
					return 0;
				shortVO.storage.push({name:item.type,type:item.type,num:item.num*num});
			}
		}
		DBOut("Cost OK: "+maxcnt);
		return maxcnt;
	};

	//---------------------------------------------------------------------------
	//消减创造某个东西的物资消耗，不够的用钻补齐
	window.aisCity.prototype.useCost=function(cost,num,gem)
	{
		var cstore,i,n,item,cnt,maxcnt,itemvo,store;
		//TODO: 编写用钻补齐资源的代码
		if(cost.cash)//检查货币是否够
		{
			if(this.king.cashNum<cost.cash*num)
			{
				DBOut("aisCity.useCost Error, cash not enough");
				throw aisCity.ERR_NotEnoughCost;
			}
			this.king.cashNum-=cost.cash*num;
			this.king.makeViewsDirty();
		}
		if(cost.gem)//检查魔钻是否够
		{
			if(this.king.gemNum<cost.gem*num)
			{
				DBOut("aisCity.useCost Error, cash not enough");
				throw aisCity.ERR_NotEnoughCost;
			}
			this.king.gemNum-=cost.gem*num;
			this.king.makeViewsDirty();
		}
		//TODO:改写这个, 支持多种Storage
		cstore=cost.storage;
		if(cstore)
		{
			n=cstore.length;
			for(i=0;i<n;i++)
			{
				item=cstore[i];
				store=this.allStorages[item.store];
				if(store)
				{
					itemvo={type:item.type,num:item.num*num};
					store.takeOut(itemvo);
				}
				else
				{
					//TODO: Report Error:
					DBOut("Can't find storage: "+item.store);
				}
			}
		}
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//返还某个东西的物资消耗
	window.aisCity.prototype.returnCost=function(cost,num)
	{
		var cstore,i,n,item,cnt,maxcnt,itemvo,store;
		if(cost.cash)//检查货币是否够
		{
			this.king.cashNum+=Math.floor(cost.cash*num);
			this.king.makeViewsDirty();
		}
		if(cost.gem)//检查魔钻是否够
		{
			this.king.gemNum+=Math.floor(cost.gem*num);
			this.king.makeViewsDirty();
		}
		//TODO:改写这个, 支持多种Storage
		cstore=cost.storage;
		if(cstore)
		{
			n=cstore.length;
			for(i=0;i<n;i++)
			{
				item=cstore[i];
				store=this.allStorages[item.store];
				if(store)
				{
					itemvo={type:item.type,num:Math.floor(item.num*num),subType:item.subType};
					store.putIn(itemvo);
				}
				else
				{
					//TODO: Report Error:
					DBOut("Can't find storage: "+item.store);
				}
			}
		}
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//测试是否可以取出足够的物资
	window.aisCity.prototype.checkTakeOut=function(itemList,shortVO)
	{
		var cstore,i,n,item,cnt,maxcnt,itemvo,store,def;
		cstore=itemList;
		n=cstore.length;
		maxcnt=-1;
		for(i=0;i<n;i++)
		{
			item=cstore[i];
			store=this.allStorages[item.store];
			if(store)
			{
				itemvo={type:item.type,num:item.num,subType:item.subType};
				cnt=store.checkTakeOut(itemvo);
				maxcnt=maxcnt<0?cnt:(cnt<maxcnt?cnt:maxcnt);
				if(!cnt)
				{
					DBOut("No enough: "+itemvo.type);
					if(!shortVO)
						return 0;
					def=store.defLib[item.type];
					shortVO.storage.push({name:def?def.name:item.type,type:item.type,num:itemvo.gap,subType:item.subType});
				}
			}
			else
			{
				DBOut("Can't find: "+itemvo.store+" storage!");
				if(!shortVO)
					return 0;
				shortVO.storage.push({name:item.type,type:item.type,num:item.num,subType:item.subType});
			}
		}
		return maxcnt;
	};

	//---------------------------------------------------------------------------
	//测试是否可以取出足够的物资
	window.aisCity.prototype.doTakeOut=function(itemList,shortVO,go2aisBld)
	{
		var cstore,i,n,item,cnt,maxcnt,itemvo,store,def;
		cstore=itemList;
		n=cstore.length;
		maxcnt=0;
		for(i=0;i<n;i++)
		{
			item=cstore[i];
			store=this.allStorages[item.store];
			if(store)
			{
				itemvo={type:item.type,num:item.num,subType:item.subType};
				store.takeOut(itemvo,go2aisBld);
			}
			else
			{
				DBOut("aisCity.doTakeOut Error, can't find storage: "+item.store);
				throw aisCity.ERR_NotEnoughCost;
			}
		}
	};

	//---------------------------------------------------------------------------
	//过虑、生成可造建筑物列表
	window.aisCity.prototype.filterBuildins=function(list)
	{
		var rlist=[],i,n,lv,tech,def,b,blist;
		n=list.length;
		blist=this.buildings;
		for(i=0;i<n;i++)
		{
			def=aisEnv.defLib.bld[list[i]];
			if(def.uniqFeature)
			{
				if(!this.hasFeature(def.uniqFeature,1))
				{
					rlist.push({def:list[i],level:0});
				}
			}
			else
			{
				rlist.push({def:list[i],level:0});
			}
		}
		return rlist;
	};

}

//---------------------------------------------------------------------------
//与建筑相关的函数-----------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//得到某个坐标对应的建筑
	window.aisCity.prototype.getBuilding=function(x,y)
	{
		var i,n,list,bld;
		list=this.buildings;
		n=list.length;
		for(i=0;i<n;i++)
		{
			bld=list[i];
			if(x>=bld.pos[0] && x<bld.pos[0]+bld.def.sizeW &&
				y>=bld.pos[1] && y<bld.pos[1]+bld.def.sizeH)
			{
				return bld;
			}
		}
		return null;
	};

	//---------------------------------------------------------------------------
	//自动生成某个建筑的初始位置
	window.aisCity.prototype.autoBuildingPos=function(def)
	{
		var w,h,x,y;
		w=this.bldBoxSize[0];
		h=this.bldBoxSize[1];
		for(y=0;y<h;y++)
		{
			for(x=0;x<w;x++)
			{
				if(this.checkBuildingPos(def,x,y))
				{
					return [x,y];
				}
			}
		}
		return [0,0];
	};

	//---------------------------------------------------------------------------
	//检查某个建筑是否可以建造在某个位置
	window.aisCity.prototype.checkBuildingPos=function(def,x,y,curBld)
	{
		var i,n,list,bld,w,h;
		var minx,maxx,miny,maxy;
		list=this.buildings;
		n=list.length;
		for(i=0;i<n;i++)
		{
			bld=list[i];
			if(bld!=curBld)
			{
				minx=bld.pos[0]<x?x:bld.pos[0];
				miny=bld.pos[1]<y?y:bld.pos[1];
				maxx=bld.pos[0]+bld.def.sizeW>x+def.sizeW?x+def.sizeW:bld.pos[0]+bld.def.sizeW;
				maxy=bld.pos[1]+bld.def.sizeH>y+def.sizeH?y+def.sizeH:bld.pos[1]+bld.def.sizeH;
				w=maxx-minx;
				h=maxy-miny;
				if(w>0 && h>0)//与其他建筑重叠
				{
					return 0;
				}
			}
		}
		//TODO: 检查接口是否匹配

		return 1;
	};

	//---------------------------------------------------------------------------
	//拆除某个建筑
	window.aisCity.prototype.removeBuilding=function(bld)
	{
		this.makeViewsDirty();
	};
}

//---------------------------------------------------------------------------
//Command命令----------------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//新建一个建筑
	window.aisCity.prototype.com_NewBuilding=function(comVO)
	{
		var bld,def,list,i,n,view;
		def=aisEnv.defLib.bld[comVO.def];
		if(!def)
		{
			DBOut("aisCity.com_NewBuilding Error1 can't find building def: "+comVO.codeName);
			throw aisCity.ERR_BldNoDef;
		}
		if(!this.checkBuildingPos(def,comVO.x,comVO.y))
		{
			DBOut("aisCity.com_NewBuilding Error2 can't build at: "+comVO.x+", "+comVO.y);
			throw aisCity.ERR_BadBldPos;
		}
		if(def.createFunc)
		{
			//bld=new def.createFunc(this.env,this,def);
			bld=new window[def.createFunc](this.env,this,def);
		}
		else
		{
			bld=new aisBuilding(this.env,this,def);
		}
		if(!comVO.noNeedCost)
			this.useCost(def.levels[0].cost,1,0);
		bld.startBuild(comVO);
		this.buildings.push(bld);

		//通知UI部分，增加了新建筑
		{
			list=this.uiViews;
			for(i in list)
			{
				view=list[i];
				if(view.vcnNewBld)
				{
					view.vcnNewBld(this,bld);
				}
			}
		}
		comVO.newBldHashId=bld.hashId;
		this.makeViewsDirty();

		this.initClanTechsByBld(bld);//初始新建筑的联盟科技buff
		return bld;
	};

	//---------------------------------------------------------------------------
	//卖出、丢弃物品
	window.aisCity.prototype.com_SellStorage=function(comVO)
	{
		var store,idx,def,num,prc;
		//TODO:改写这个, 支持多种Storage
		store=this.allStorages[comVO.store];
		if(!store)
		{
			DBOut("Can't find storage: "+comVO.store);
			DBOut("aisCity.com_SellStorage ERROR 1: "+comVO.store);
			throw aisCity.ERR_SellTooMuch;
		}
		def=aisEnv.defLib.prdct[comVO.def];
		idx=comVO.idx;
		num=comVO.num;
		if(!(num<=store.getItemNum(idx)))
		{
			//TODO: 报错
			DBOut("aisCity.com_SellStorage ERROR 2: "+idx+","+num+","+store.getItemNum(idx)+", "+comVO.store);
			throw aisCity.ERR_SellTooMuch;
		}
		prc=0;
		if(def.hashFactors && def.hashFactors.prc_sell && def.hashFactors.prc_sell.val>0)
		{
			prc=def.hashFactors.prc_sell.val;
		}
		prc*=num;
		store.takeOut({type:idx,num:num});
		this.king.cashNum+=prc;
		this.king.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//购买资源
	window.aisCity.prototype.com_GemTrade=function(comVO)
	{
		var store,gem;
		gem=comVO.gem;
		if(gem>this.king.gemNum)
		{
			DBOut("Not enough gem: "+gem);
			throw aisCity.ERR_NoGem;
		}
		//TODO:改写这个, 支持多种Storage
		if(comVO.store)
		{
			store=this.allStorages[comVO.store];
			if(!store)
			{
				DBOut("Can't find storage: "+comVO.store);
				DBOut("aisCity.com_SellStorage ERROR 1: "+comVO.store);
				throw aisCity.ERR_SellTooMuch;
			}
			store.putIn({type:comVO.codeName,num:comVO.num,subType:comVO.subType});
		}else if(comVO.buff){
			var buff=this.getBuff(comVO.codeName);
			if(!buff)
			{
				this.bindBuff(comVO.codeName);
			}
			buff=this.buffs[comVO.codeName];
			if(!buff.endTime)
				buff.endTime=this.env.dateTime()+comVO.addTime;
			else
				buff.endTime+=comVO.addTime;
		}
		this.king.gemNum-=gem;

		this.makeViewsDirty();
		this.king.makeViewsDirty();
	};
	//购买黑水
	window.aisCity.prototype.com_GemBuyTokens=function(comVO)
	{
		if(comVO.codeName=="ResCube")
			this.com_GemTrade(comVO);
	};

}
}
