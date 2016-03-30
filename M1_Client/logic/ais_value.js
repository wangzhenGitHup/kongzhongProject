if(!window.aisTypes.aisValue)
{
//---------------------------------------------------------------------------
//游戏中拥有动态数值的对象
window.aisTypes.aisValueOwner=function()
{
	this.values={};
	this.valuesNum=0;
};

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.hasValue=function(name)
{
	return this.values[name]?1:0;
};

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.getValueObj=function(name)
{
	return this.values[name];
};

//---------------------------------------------------------------------------
//TODO: name2是干嘛的？
window.aisTypes.aisValueOwner.addValue=function(name,v,minvn,maxvn,factorn,name2)
{
	var val,maxv,minv;
	if(!this.values[name] && name)
	{
		this.valuesNum++;
	}
	minv=this.values[minvn];
	maxv=this.values[maxvn];
	val=new aisTypes.aisValue(this.env,this,v,minv,maxv,factorn,name);
	this.values[name]=val;
};

//---------------------------------------------------------------------------
//TODO: name2是干嘛的？
window.aisTypes.aisValueOwner.removeValue=function(name)
{
	if(this.values[name] && name)
	{
		this.valuesNum--;
	}
	this.values[name]=null;
};

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.getValue=function(name)
{
	var val;
	val=this.values[name];
	if(val)
	{
		return val.curVal;
	}
}

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.getValueBase=function(name)
{
	var val;
	val=this.values[name];
	if(val)
	{
		return val.baseVal;
	}
}

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.setValue=function(name,v,update)
{
	var val;
	val=this.values[name];
	if(val)
	{
		val.baseVal=v;
		if(update)
			val.update();
	}
}

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.updateValues=function()
{
	var i,list;
	list=this.values;
	for(i in list)
	{
		if(list[i])
			list[i].update();
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.saveValues=function(voObj)
{
	var i,list;
	list=this.values;
	voObj.values={};
	for(i in list)
	{
		if(list[i])
		{
			voObj.values[i]={"cur":list[i].curVal,"base":list[i].baseVal};
		}
	}
}

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.saveValue=function(voObj,valName)
{
	var i,list;
	list=this.values;
	if(!voObj.values)
		voObj.values={};
	voObj.values[valName]={"cur":list[valName].curVal,"base":list[valName].baseVal};
}

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.readValues=function(voObj)
{
	var i,list,vlist;
	list=voObj.values;
	vlist=this.values;
	if(list)
	{
		for(i in list)
		{
			if(vlist[i])
			{
				vlist[i].curVal=list[i].cur;
				vlist[i].baseVal=list[i].base;
			}
		}
	}
}

//---------------------------------------------------------------------------
window.aisTypes.aisValueOwner.readValue=function(voObj,valName)
{
	var valVO,valObj,list;
	list=voObj.values;
	if(list)
	{
		valObj=this.getValueObj(valName);
		valVO=list[valName];
		if(valObj && valVO)
		{
			valObj.curVal=valVO.cur;
			valObj.baseVal=valVO.base;
		}
	}
}

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//游戏中一个可修正，可带值域的数值对象
window.aisTypes.aisValue=function(env,owner,v,minv,maxv,factorName,name)
{
	if(env)
	{
		this.owner=owner;
		this.name=name;
		this.curVal=v;
		this.baseVal=v;
		this.minVal=minv;//最小值的动态值
		this.maxVal=maxv;//最大值的动态值
		this.capByMax=1;
		this.capByMin=1;
		this.factorName=factorName;
	}
};

window.aisTypes.aisValue.prototype=new Object();

//---------------------------------------------------------------------------
//得到修正后的值
window.aisTypes.aisValue.prototype.getCurVal=function()
{
	return this.curVal;
};

//---------------------------------------------------------------------------
//得到修正后的值
window.aisTypes.aisValue.prototype.getBaseVal=function()
{
	return this.baseVal;
};

//---------------------------------------------------------------------------
//得到修正后的值
window.aisTypes.aisValue.prototype.setBaseVal=function(v,update)
{
	this.baseVal=v;
	if(update)
	{
		this.update();
	}
};

//---------------------------------------------------------------------------
//是否超过界限了？
window.aisTypes.aisValue.prototype.isOverLoad=function()
{
	if(this.minVal && this.curVal<this.minVal)
	{
		return -1;
	}
	if(this.maxVal && this.curVal>this.maxVal)
	{
		return 1;
	}
	return 0;
}

//---------------------------------------------------------------------------
//是否满了？
window.aisTypes.aisValue.prototype.isFull=function()
{
	if(this.maxVal && this.curVal>=this.maxVal)
	{
		return 1;
	}
	return 0;
}

//---------------------------------------------------------------------------
//是否空了？
window.aisTypes.aisValue.prototype.isEmpty=function()
{
	if(this.minVal && this.curVal<=this.minVal)
	{
		return -1;
	}
	return 0;
}

//---------------------------------------------------------------------------
//更新值
window.aisTypes.aisValue.prototype.update=function()
{
	var owner,oldVal;
	oldVal=this.curVal;
	this.curVal=this.baseVal;
	if(this.factorName)
	{
		owner=this.owner;
		this.calVMul=1;
		this.calBMul=1;
		while(owner)
		{
			if(owner.applyOpFactors)
			{
				owner.applyOpFactors(this);
			}
			owner=owner.owner;
		}
		this.curVal+=this.baseVal*(this.calBMul-1.0);
		this.curVal*=this.calVMul;
	}
	if(this.minVal && this.capByMin)
	{
		if(this.curVal<this.minVal.curVal)
		{
			this.curVal=this.minVal.curVal;
		}
	}
	if(this.maxVal && this.capByMax)
	{
		if(this.curVal>this.maxVal.curVal)
		{
			this.curVal=this.maxVal.curVal;
		}
	}
	if(this.name && this.curVal!=oldVal)
	{
		owner= this.owner;
		if(owner.onValueChange)
		{
			owner.onValueChange(this.name,this.curVal);
		}
	}
};

}
