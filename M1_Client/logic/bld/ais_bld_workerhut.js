if(!window.aisBldWorkerHut)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//普通仓库的对象类型
window.aisBldWorkerHut=function(env,city,def)
{
	var vname,pname,factor,store;
	if(env)
	{
		window.aisBuilding.call(this,env,city,def);
		this.name="BldWorkerHut";
	}
};

//---------------------------------------------------------------------------
window.aisBldWorkerHut.prototype=new window.aisBuilding();

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//建造/升级完成的回调, 创建工人对象给City
	window.aisBldWorkerHut.prototype.onConstructDone=function()
	{
		this.city.addBldWorker(this);
	};
}
}
