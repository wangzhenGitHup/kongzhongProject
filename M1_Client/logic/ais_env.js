if(!window.aisEnv)
{
window.aisEnv={
	allKings:[],
	liveKings:[],
	defLib:{
		buff:{},
		city:{},
		bld:{},
		tech:{},
		feature:{},
		prdct:{},
		unit:{},
		spell:{},
		achvmnt:{},
		globals:{},
		npcs:{},
		pay:{},
		dailytasks:{},
		vipPrivilege:{},
		part:{},
		addon:{},
		compound:{},
		box:{},
		clan:{},
		clanTec:{},
		clanCupDomains:{},
		item:{},
		shopSpecial:{},
	},
	textLib:{
		bldName:{},
		bldInfo:{},
		unitName:{},
		unitInfo:{},
		partName:{},
		partInfo:{},
		addOnName:{},
		addOnInfo:{},
		spellName:{},
		spellInfo:{},
		ftuName:{},
		ftuInfo:{},
		tchName:{},
		tchInfo:{},
		fetName:{},
		fetInfo:{},
		prdctName:{},
		prdctInfo:{},
		cftName:{},
		cftInfo:{},
		buffName:{},
		buffInfo:{},
		msg:{},
		achvmntName:{},
		achvmntInfo:{},
		npcsName:{},
		payName:{},
		payInfo:{},
		dailytasksName:{},
		dailytasksInfo:{},
		vipPrivilegeName:{},
		vipPrivilegeInfo:{},
		boxName:{},
		boxInfo:{},
		clantecName:{},
		clantecInfo:{},
		clanCupDomainsName:{},
		clanCupDomainsInfo:{},
		itemName:{},
		itemInfo:{},
		shopSpecialName:{},
		shopSpecialInfo:{},
	},
	cfg:{
		bldAutoConstructDone:1,
		bldAutoTechDone:1,
		time2Gem:1/(60*5),//5分钟一个钻
		gold2Gem:1/2000,
		oil2Gem:1/2000,
	},
	funcDefLib:{},
	name:"AIS Server",
	createTime:0,
	debugTimeGap:0,
	updateVer:0,

	//Client only:
	uiEnv:null,
	dirtyViews:[],
};

//---------------------------------------------------------------------------
//Global Error Object
window.aisEnv.Err_DefNotFound={level:100,error:"Can't find def-object","class":"aisEnv",code:"Err_DefNotFound"};
window.aisEnv.Err_WrongArg={level:100,error:"Argument error","class":"aisEnv",code:"Err_WrongArg"};
window.aisEnv.Err_WrongType={level:100,error:"Type error","class":"aisEnv",code:"Err_WrongType"};

//---------------------------------------------------------------------------
//获取当前时间,可以通过debugTime"调表"
window.aisEnv.dateTime=function()
{
	return Date.now()+this.debugTimeGap;
};
window.aisEnv.reviseTime=function(logintime)
{
	this.debugTimeGap=logintime-Date.now();
};

//---------------------------------------------------------------------------
//读取当前环境,这个恐怕用不到
window.aisEnv.readFmVO=function(voObj)
{
	this.name==voObj.name;
	this.maxKing=voObj.maxKing;
	this.createTime=voObj.createTime;
};

//---------------------------------------------------------------------------
//持久化当前环境,这个应该用不到...
window.aisEnv.saveToVO=function(voObj)
{
	voObj.name=this.name;
	voObj.maxKing=this.maxKing;
	voObj.createTime=this.createTime;
};

//---------------------------------------------------------------------------
//启动当前环境
window.aisEnv.start=function()
{
	this.startTime=Date.now();
};

//---------------------------------------------------------------------------
//初始化环境
window.aisEnv.initEnv=function()
{
};

//---------------------------------------------------------------------------
//通知所有的需要更新的View对象更新内容
window.aisEnv.updateViews=function()
{
	var i,n,list,view;

	this.updateVer+=1;

	//In client mode, update all views that be marked as dirty
	list=this.dirtyViews;
	n=list.length;
	for(i=0;i<n;i++)
	{
		view=list[i];
		if(view.aisUpdateVer!=this.updateVer && !view.deadOut)
		{
			if(view.aisUpdateView && typeof view.aisUpdateView =="function")
			{
				view.aisUpdateView();
				view.aisUpdateVer=this.updateVer;
			}
		}
	}
	list.splice(0,n);
};

//---------------------------------------------------------------------------
//增加一个需要更新的View对象
window.aisEnv.addDirtyView=function(view)
{
	this.dirtyViews.push(view);
};

//---------------------------------------------------------------------------
//用于归整数值
window.aisEnv.filterValue=function(val,type)
{
	switch(type)
	{
	case "int":
		val=Math.floor(val);
		break;
	case "pctg":
		val=Math.floor(val*100);
		break;
	}
	return val;
};

//---------------------------------------------------------------------------
//用于def的初始化：
window.aisEnv.defLib.hashFactors=function(def)
{
	var list,i,hash,name;
	hash={};
	list=def.factors;
	for(i in list)
	{
		name=list[i].codeName;
		if(name)
		{
			hash[name]=list[i];
		}
	}
	def.hashFactors=hash;
};

}
