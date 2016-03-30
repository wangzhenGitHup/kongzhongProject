if(!window.aisCraft)
{
window.aisCraft=function(env,garage)
{
	var i,n,list,city;
	if(env)
	{
		DBOut("New aisCraft: ");
		aisObj.call(this,env);
		this.def=null;
		city=garage.city;
		this.owner=garage;
		this.garage=garage;
		this.city=city;
		this.king=city.king;
		this.type="Craft";
		this.name="Craft";
		this.showName="NewMac";
		this.slots={body:null,leg:null};
		this.addOn=null;
		this.hp=0;
		this.state=0;//警戒状态  0：待机  1：警戒
		//战斗记录：
		this.warLog={msnNum:0,scsNum:0,killNum:0,killedNum:0};

		//增加拥有功能（Feature）的接口
		aisTypes.applyType(this,aisTypes.aisFeatureOwner);
		//增加动态数据修正器的功能
		aisTypes.applyType(this,aisTypes.opFactorOwner);
		//增加拥有动态数值的接口
		aisTypes.applyType(this,aisTypes.aisValueOwner);
		//增加与UI控件关联的接口
		aisTypes.applyType(this,aisTypes.aisViewConnect);
	}
};

window.aisCraft.prototype=new aisObj();

window.aisCraft.ERR_DupSlot={level:100,error:"The slot already exist!","class":"aisCraft",code:"ERR_DupSlot"};
window.aisCraft.ERR_SlotAlreadyHasPart={level:100,error:"Slot is already used by another part!","class":"aisCraft",code:"ERR_SlotAlreadyHasPart"};
window.aisCraft.ERR_NoSlot={level:100,error:"Can't find slot for part!","class":"aisCraft",code:"ERR_NoSlot"};
window.aisCraft.ERR_NoSlotPart={level:100,error:"No part found on slot!","class":"aisCraft",code:"ERR_NoSlotPart"};
window.aisCraft.ERR_NoPart={level:100,error:"Can't find part on given slot to remove!","class":"aisCraft",code:"ERR_NoPart"};

//---------------------------------------------------------------------------
//根据VO创建一个单位并读出该单位
window.aisCraft.readCraft=function(garage,voObj)
{
	var def,unit,i,n,list;
	var king,city;
	king=garage.king;
	city=garage.city;
	unit=new aisCraft(king.env,garage);
	unit.readFmVO(king,voObj,def);
	return unit;
};

//---------------------------------------------------------------------------
//从voObj中读出单位数据
window.aisCraft.prototype.readFmVO=function(king,voObj,def)
{
	var slist,dlist,part,i,n,slots;
	aisObj.prototype.readFmVO.call(this,voObj);
	this.showName=voObj.showName;

	//Add Parts:
	slist=voObj.slots;
	if(slist)
	{
		slots=this.slots;
		if(slist.body)
		{
			slots.body={type:slist.body.type, subType:slist.body.subType,level:slist.body.level};
		}
		if(slist.leg)
		{
			slots.leg={type:slist.leg.type, subType:slist.leg.subType,level:slist.leg.level};
		}
	}
	//Add AddOn
	if(voObj.addOn)
	{
		this.addOn={type:voObj.addOn};
	}

	this.hp=voObj.hp;
	this.state=voObj.state;
	//TODO: Do we need setup?
	//this.setupCraft();
	if(voObj.warLog)
	{
		this.warLog.msnNum=voObj.warLog.msnNum;
		this.warLog.scsNum=voObj.warLog.scsNum;
		this.warLog.killNum=voObj.warLog.killNum;
	}
};

//---------------------------------------------------------------------------
//将单位数据存入voObj
window.aisCraft.prototype.saveToVO=function(king,voObj)
{
	var slots;
	aisObj.prototype.saveToVO.call(this,voObj);
	voObj.showName=this.showName;
	slots=this.slots;
	if(slots)
	{
		voObj.slots={};
		voObj.slots.body=slots.body?{type:slots.body.type,subType:slots.body.subType,level:slots.body.level}:null;
		voObj.slots.leg=slots.leg?{type:slots.leg.type,subType:slots.leg.subType,level:slots.leg.level}:null;
	}
	if(this.addOn)
	{
		voObj.addOn=this.addOn.type;
	}
	voObj.hp=this.hp;
	voObj.state=this.state;
	voObj.warLog={msnNum:this.msnNum,scsNum:this.scsNum,killNum:this.killNum};
};

//---------------------------------------------------------------------------
//拆散一个单位
window.aisCraft.prototype.demolish=function()
{
	var storage,slots;
	storage=this.city.partStorage;
	slots=this.slots;
	if(slots.body)
	{
		storage.unlockItem({type:slots.body.type, subType:slots.body.subType, num:1});
		slots.body=null;
	}
	if(slots.leg)
	{
		storage.unlockItem({type:slots.leg.type, subType:slots.leg.subType, num:1});
		slots.leg=null;
	}
	storage=this.city.addOnStorage;
	if(this.addOn)
	{
		storage.putIn({type:this.addOn.type,num:1},null);
		this.addOn=null;
	}
	this.deadOut=1;
};

//---------------------------------------------------------------------------
//增加一个部件，
window.aisCraft.prototype.setPart=function(slotName,type,subType,level)
{
	var storage;
	storage=this.city.partStorage;
	if(slotName=="body")
	{
		if(this.slots.body)
		{
			this.removePart(slotName);
		}
		storage.lockItem({type:type,subType:subType,num:1});
		this.slots.body={type:type,subType:subType,level:level};
	}
	else if(slotName=="leg")
	{
		if(this.slots.leg)
		{
			this.removePart(slotName);
		}
		storage.lockItem({type:type,subType:subType,num:1});
		this.slots.leg={type:type,subType:subType,level:level};
	}
};

//---------------------------------------------------------------------------
//移除一个部件
window.aisCraft.prototype.removePart=function(slotName)
{
	var storage,slots;
	storage=this.city.partStorage;
	slots=this.slots;
	if(slotName=="body"&&slots.body)
	{
		storage.unlockItem({type:slots.body.type, subType:slots.body.subType, num:1});
		slots.body=null;
	}
	if(slotName=="leg"&&slots.leg)
	{
		storage.unlockItem({type:slots.leg.type, subType:slots.leg.subType, num:1});
		slots.leg=null;
	}
};

//---------------------------------------------------------------------------
//设置模块
window.aisCraft.prototype.setAddOn=function(type)
{
	var storage;
	storage=this.city.addOnStorage;
	if(this.addOn)
	{
		storage.putIn({type:this.addOn.type,num:1},null);
	}
	storage.takeOut({type:type,num:1});
	this.addOn={type:type};
};

//---------------------------------------------------------------------------
//移除模块
window.aisCraft.prototype.removeAddOn=function()
{
	var storage;
	storage=this.city.addOnStorage;
	if(this.addOn)
	{
		storage.putIn({type:this.addOn.type,num:1},null);
	}
	this.addOn=null;
};

//---------------------------------------------------------------------------
//更新全部静态参数
window.aisCraft.prototype.updateStatic=function()
{
	var i,n,list;
	this.updateOpFactors();
	this.updateValues();
};

//---------------------------------------------------------------------------
//更新单位数据
window.aisCraft.prototype.updateByKing=function(king,nowTime,timeGap)
{
	this.updateValues(nowTime,timeGap);
};
}
