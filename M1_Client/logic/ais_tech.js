if(!window.aisTech)
{
//---------------------------------------------------------------------------
//拥有Tech的对象
window.aisTypes.aisTechOwner=function()
{
	this.techs={};
	this.techCases={};
};

//---------------------------------------------------------------------------
window.aisTypes.aisTechOwner.saveTechs=function(voObj)
{
	var i,list,tech,vo;

	voObj.techs={};
	list=this.techs;
	for(i in list)
	{
		tech=list[i];
		if(tech)
		{
			vo={};
			tech.saveToVO(vo);
			voObj.techs[i]=vo;
		}
	}
	voObj.techCases={};
	list=this.techCases;
	for(i in list)
	{
		tech=list[i];
		if(tech)
		{
			vo={tech:tech.tech,level:tech.level};
			voObj.techCases[i]=vo;
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisTechOwner.loadTechs=function(voObj)
{
	var i,list,tech,vo,def;
	list=voObj.techs;
	for(i in list)
	{
		vo=list[i];
		if(vo)
		{
			tech=this.addTech(vo.codeName,1);
			if(tech)
			{
				tech.readFmVO(vo);
			}
		}
	}
	list=voObj.techCases;
	for(i in list)
	{
		tech=list[i];
		this.techCases[i]={tech:tech.tech,level:tech.level};
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisTechOwner.getCase=function(codename)
{
	return this.techCases[codename];
}

//---------------------------------------------------------------------------
window.aisTypes.aisTechOwner.addCase=function(codename,level)
{
	if(this.techCases[codename])
	{
		//TODO:report error!!
	}
	this.techCases[codename]={tech:codename,level:level};
};

//---------------------------------------------------------------------------
window.aisTypes.aisTechOwner.caseDone=function(codename)
{
	var tech;
	tech=this.techCases[codename];
	if(!tech)
	{
		//TODO: report error
	}
	this.techCases[codename]=null;
	delete this.techCases[codename];
};

//---------------------------------------------------------------------------
window.aisTypes.aisTechOwner.addTech=function(codeName,load)
{
	var def,tech;
	def=this.env.defLib.tech[codeName];
	if(!def)
	{
		//TODO: Report Error!!
	}
	tech=this.techs[def.codeName];
	if(tech)
	{
		//TODO: Report Waring!!
		return tech;
	}
	else
	{
		tech=aisTech.createTech(def,this.env,this);
		this.techs[def.codeName]=tech;
		tech.startTime=this.king.kingTime();
		tech.applyFactors();
		tech.applyFeatures();
	}
	return tech;
};

//---------------------------------------------------------------------------
window.aisTypes.aisTechOwner.getTech=function(codename)
{
	return this.techs[codename];
};

//---------------------------------------------------------------------------
window.aisTypes.aisTechOwner.filterTechs=function(list)
{
	var rlist=[],i,n,lv,tech,def;
	n=list.length;
	for(i=0;i<n;i++)
	{
		tech=this.techCases[list[i]];
		if(!tech)
		{
			tech=this.techs[list[i]];
			if(!tech)
			{
				rlist.push({def:list[i],level:0});
			}
			else
			{
				lv=tech.level;
				def=tech.def;
				if(lv+1<def.levels.length)
				{
					rlist.push({def:list[i],level:lv});
				}
			}
		}
	}
	return rlist;
};

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的Tech对象
window.aisTech=function(def,env,owner)
{
	var date;
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=owner;
		this.type="Tech";
		this.def=def;
		this.startTime=0;
		this.level=0;
		this.factors=[];
	}
};

//---------------------------------------------------------------------------
window.aisTech.createTech=function(def,env,owner)
{
	switch(def.codeName)
	{
	case "Super Odd":
		return null;
	default:
		return new aisTech(def,env,owner);
	}
};

//---------------------------------------------------------------------------
window.aisTech.prototype=new aisObj();

//---------------------------------------------------------------------------
window.aisTech.prototype.readFmVO=function(voObj)
{
	var i,n,list;
	aisObj.prototype.readFmVO.call(this,voObj);
	this.startTime=voObj.startTime;
	this.level=voObj.level;
};

//---------------------------------------------------------------------------
window.aisTech.prototype.saveToVO=function(voObj)
{
	aisObj.prototype.saveToVO.call(this,voObj);
	voObj.startTime=this.startTime;
	voObj.level=this.level;
};

//---------------------------------------------------------------------------
window.aisTech.prototype.applyFactors=function()
{
	var list,i,n,op,tgt,def,op;
	def=this.def;
	//首先把之前的factors都弄歇菜了
	list=this.factors;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].owner=null;
	}
	list=def.levels[this.level].factors;
	this.factors=[];
	for(i in list)
	{
		tgt=this.owner.getUpperScope(list[i].tgt);
		if(tgt)
		{
			op=new aisOpFactor(this.env,this);
			op.mulBFactor=list[i].mbf;
			op.mulVFactor=list[i].mvf;
			op.addFactor=list[i].af;
			tgt.addOpFactor(list[i].cn,op);
			this.factors.push(op);
		}
	}
};

//---------------------------------------------------------------------------
//添加建筑的所有功能
window.aisTech.prototype.applyFeatures=function()
{
	var i,list,n,def;
	var owner;
	def=this.def;
	owner=this.owner;
	list=def.levels[this.level].features;
	if(list)
	{
		n=list.length;
		for(i=0;i<n;i++)
		{
			//DBOut("Add Bld Feature: "+list[i]);
			owner.addFeature(list[i],this);
		}
	}
};

//---------------------------------------------------------------------------
//移除建筑的所有功能
window.aisTech.prototype.removeFeatures=function()
{
	var i,list,n,def;
	var owner;
	owner=this.owner;
	def=this.def;
	list=def.levels[this.level].features;
	if(list)
	{
		n=list.length;
		for(i=0;i<n;i++)
		{
			owner.removeFeature(list[i],this);
		}
	}
};

}
