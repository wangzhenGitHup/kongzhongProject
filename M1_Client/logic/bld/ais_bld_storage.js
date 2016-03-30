if(!window.aisBldStorage)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//普通仓库的对象类型
window.aisBldStorage=function(env,city,def)
{
	var vname,pname,factor,store;
	//DBOut("Create a Storage building.");
	if(env)
	{
		window.aisBuilding.call(this,env,city,def);
		this.name="BldStorage";
		
		store=city.allStorages[def.cityStorage];
		//DBOut("City Storage: "+store);
		this.cityStorage=store?store:null;
		this.subStorage=new aisSubStorage(env,this,store,def.capOPFName,def.useNewSlots,def.useTakenSlots);
	}
};

window.aisBldStorage.ERR_NoHarvest={level:100,error:"No res to harvest!","class":"aisBldStorage",code:"ERR_NoHarvest"};
window.aisBldStorage.ERR_BadPower={level:100,error:"Power rate is out of range!","class":"aisBldStorage",code:"ERR_BadPower"};

//---------------------------------------------------------------------------
window.aisBldStorage.prototype=new window.aisBuilding();

//---------------------------------------------------------------------------
//更新全部静态参数
window.aisBldStorage.prototype.updateStatic=function()
{
	var i,n,list;
	this.updateOpFactors();
	this.updateValues();
	this.subStorage.update();
};

//---------------------------------------------------------------------------
//更新建筑数据
window.aisBldStorage.prototype.updateByKing=function(king,nowTime,timeGap)
{
	this.subStorage.update();
	this.updateTasks(king,nowTime,timeGap);
	this.updateValues(nowTime,timeGap);
};

//---------------------------------------------------------------------------
window.aisBldStorage.prototype.getCapacity=function()
{
	return this.subStorage.getValue("maxLoad");
};

//---------------------------------------------------------------------------
window.aisBldStorage.prototype.getCurLoad=function()
{
	return this.subStorage.getValue("curLoad");
};

//---------------------------------------------------------------------------
window.aisBldStorage.prototype.getLoadRate=function()
{
	var full,cur;
	full=this.subStorage.getValue("maxLoad");
	cur=this.subStorage.getValue("curLoad");
	if(full>0)
		return cur/full;
	return 0;
};

}
