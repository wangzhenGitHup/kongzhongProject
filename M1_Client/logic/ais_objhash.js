if(!window.aisTypes.aisObjHashOwner)
{
//---------------------------------------------------------------------------
//拥有Buff的对象
window.aisTypes.aisObjHashOwner=function()
{
	this.objHash={nextHashId:100};//前100个留给新创建的King
};

//---------------------------------------------------------------------------
window.aisTypes.aisObjHashOwner.updateHash=function()
{
	//TODO: code this;
};

//---------------------------------------------------------------------------
window.aisTypes.aisObjHashOwner.getHashObj=function(hashId)
{
	var obj;
	obj=this.objHash[hashId];
	if(!obj)
	{
		DBOut("Error: aisObjHashOwner.getHashObj, Error 1: "+hashId);
		return null;
	}
	return obj;
};

//---------------------------------------------------------------------------
window.aisTypes.aisObjHashOwner.addHashObj=function(obj)
{
	//TODO: code this;
	if(obj.hashOwner)
	{
		DBOut("Error: aisObjHashOwner.addHashObj, Error 1");
		return;
	}
	obj.hashOwner=this;
	if(!obj.hashId)
	{
		obj.hashId="Obj"+this.objHash.nextHashId;
		this.objHash.nextHashId++;
	}
	this.objHash[obj.hashId]=obj;
};

//---------------------------------------------------------------------------
window.aisTypes.aisObjHashOwner.removeHashObj=function(obj)
{
	//TODO: code this;
	if(obj.hashOwner!=this)
	{
		DBOut("Error: aisObjHashOwner.removeHashObj, Error 1");
		return;
	}
	if(!obj.hashId)
	{
		DBOut("Error: aisObjHashOwner.removeHashObj, Error 2");
		return;
	}
	if(!this.objHash[obj.hashId])
	{
		DBOut("Error: aisObjHashOwner.removeHashObj, Error 3");
		return;
	}
	obj.hashOwner=null;
	obj.hashId=0;
	this.objHash[obj.hashId]=null;
	delete this.objHash[obj.hashId];
};

//---------------------------------------------------------------------------
window.aisTypes.aisObjHashOwner.saveObjHash=function(voObj)
{
	voObj.nextHashId=this.objHash.nextHashId;
};

//---------------------------------------------------------------------------
window.aisTypes.aisObjHashOwner.readObjHash=function(voObj)
{
	if(voObj.nextHashId)
	{
		this.objHash.nextHashId=voObj.nextHashId;
	}
};

}
