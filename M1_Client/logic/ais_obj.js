if(!window.aisObj)
{
window.aisObj=function(env)
{
	var date;
	if(env)
	{
		this.env=env;
		this.owner=null;
		this.def=null;
		this.type="Object";
		this.createTime=env.dateTime();
		this.deadOut=0;
	}
};

window.aisObj.prototype=new Object();

//---------------------------------------------------------------------------
window.aisObj.prototype.readFmVO=function(voObj)
{
	var codename;
	codename=voObj.codeName;
	if(!this.def && codename)
	{
		this.def=this.env.defLib[codename];
	}
	if(voObj.hashId)
	{
		this.hashId=voObj.hashId;
	}
	if(voObj.createTime)
	{
		this.createTime=voObj.createTime;
	}
};

//---------------------------------------------------------------------------
window.aisObj.prototype.saveToVO=function(voObj)
{
	DBOut("Save obj: "+this.type);
	if(this.def)
	{
		voObj.codeName=this.def.codeName;
	}
	if(this.hashId)
	{
		voObj.hashId=this.hashId;
	}
	DBOut("this.createTime: "+this.createTime);
	voObj.createTime=this.createTime;
};

//---------------------------------------------------------------------------
window.aisObj.prototype.getUpperScope=function(typeName)
{
	var cur;
	cur=this;
	while(cur)
	{
		if(cur.type==typeName)
			return cur;
		cur=cur.owner;
	}
	return null;
};

}
