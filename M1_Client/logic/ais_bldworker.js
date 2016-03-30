if(!window.aisBldWorker)
{
//---------------------------------------------------------------------------
//拥有建筑工人的对象
window.aisTypes.aisBldWorkerOwner=function()
{
	this.bldWorkers=[];
	this.bldWorkerHub={env:this.env};
	aisTypes.applyType(this.bldWorkerHub,aisTypes.aisViewConnect);
	this.freeBldWorkerNum=0;
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorkerOwner.saveBuilders=function(voObj)
{
	var list,i,n,vo;
	voObj.bldWorkers=[];
	list=this.bldWorkers;
	n=list.length;
	for(i=0;i<n;i++)
	{
		vo={};
		list[i].saveToVO(this.king,vo);
		voObj.bldWorkers[i]=vo;
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorkerOwner.loadBuilders=function(voObj)
{
	var ilist,tlist,i,n,worker;

	tlist=this.bldWorkers=[];
	ilist=voObj.bldWorkers;
	if(ilist)
	{
		n=ilist.length;
		for(i=0;i<n;i++)
		{
			worker=new aisTypes.aisBldWorker(this.env,null);
			worker.readFmVO(this.king,ilist[i]);
			this.king.addHashObj(worker);
			tlist[i]=worker;
			if(!worker.busy)
			{
				this.freeBldWorkerNum++;
			}
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorkerOwner.linkBuiler2Bld=function()
{
	var list,i,n;
	list=this.bldWorkers;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].linkBld(this.king);
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorkerOwner.addBldWorker=function(owner)
{
	var worker;
	worker=new aisTypes.aisBldWorker(this.env,owner);
	this.bldWorkers.push(worker);
	this.freeBldWorkerNum+=1;
	//给工人增加HashCode
	this.king.addHashObj(worker);
	this.bldWorkerHub.makeViewsDirty();
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorkerOwner.useBldWorker=function(workBld)
{
	var list,i,n;
	list=this.bldWorkers;
	if(!this.freeBldWorkerNum)
	{
		DBOut("Error: no free worker!");
		return null;
	}
	this.bldWorkerHub.makeViewsDirty();
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(!list[i].busy)
		{
			list[i].busy=1;
			list[i].workBld=workBld;
			this.freeBldWorkerNum--;
			return list[i];
		}
	}
	//TODO: Report error!
	return null;
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorkerOwner.freeBldWorker=function(worker)
{
	if(!worker)
	{
		DBOut("Error: no worker!!");
		//TODO: Throw Error Here!
	}
	worker.busy=0;
	worker.workBld=null;
	this.freeBldWorkerNum+=1;
	this.bldWorkerHub.makeViewsDirty();
};

//***************************************************************************
//***************************************************************************
//建筑工人对象
window.aisTypes.aisBldWorker=function(env,owner)
{
	var date;
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=owner;
		this.type="BldWorker";
		this.busy=0;
		this.workBld=null;
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorker.prototype=new aisObj();

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorker.prototype.saveToVO=function(king,voObj)
{
	aisObj.prototype.saveToVO.call(this,voObj);
	voObj.busy=this.busy;
	voObj.owner=this.owner.hashId;
	voObj.workBld=this.workBld?this.workBld.hashId:0;
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorker.prototype.readFmVO=function(king,vo)
{
	aisObj.prototype.readFmVO.call(this,vo);
	this.busy=vo.busy;
	this.owner=vo.owner;
	this.workBld=vo.workBld;
};

//---------------------------------------------------------------------------
window.aisTypes.aisBldWorker.prototype.linkBld=function(king)
{
	if(typeof(this.owner)=="string")
	{
		this.owner=king.getHashObj(this.owner);
	}
	if(typeof(this.workBld)=="string")
	{
		this.workBld=king.getHashObj(this.workBld);
		DBOut("Will assign constructWorker: "+this.workBld.hashId);
		this.workBld.constructWorker=this;
	}
};

}
