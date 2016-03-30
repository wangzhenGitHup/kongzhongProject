if(!window.aisPower)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//游戏中产生能量的对象
window.aisTypes.aisPowerGener=function()
{
	var def=this.def;
	if(def)
	{
		this.addValue("powOutput",0,null,null,def.powOutputFactor);
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisPowerGener.getPowerOutput=function()
{
	//DBOut("aisPowerGener.getPowerOutput: "+this.getValue("powOutput"));
	return this.getValue("powOutput");
};

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//游戏中消耗能量的对象
window.aisTypes.aisPowerCoster=function()
{
	var def=this.def;
	var lv;
	if(def)
	{
		this.addValue("powUpKeep",0,null,null,def.powUpKeepFactor);
		this.addValue("powCostPerRate",0,null,null,def.powCostPerRateFactor);
		this.addValue("powCostMax",100,null,null,null);
		this.addValue("powCostMin",0,null,null,null);
		this.addValue("powCurCostRate",0,"powCostMin","powCostMax",null,null);
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisPowerCoster.getPowerUpKeep=function()
{
	//DBOut("aisPowerCoster.getPowerUpKeep: "+this.getValue("powUpKeep"));
	return this.getValue("powUpKeep");
};

//---------------------------------------------------------------------------
window.aisTypes.aisPowerCoster.getPowerWorkCost=function()
{
	return this.getValue("powCostPerRate")*this.getValue("powCurCostRate");
};

//---------------------------------------------------------------------------
window.aisTypes.aisPowerCoster.getFullWorkPower=function()
{
	return 100*this.getValue("powCurCostRate");
};

//---------------------------------------------------------------------------
window.aisTypes.aisPowerCoster.getWorkPowerRate=function()
{
	return this.getValue("powCurCostRate");
};

//---------------------------------------------------------------------------
window.aisTypes.aisPowerCoster.setWorkPowerRate=function(v)
{
	var oldrate;
	oldrate=this.getValueBase("powCurCostRate");
	this.setValue("powCurCostRate",v,1);
	if(oldrate!=v)
	{
		if(this.onPowWorkRate)
		{
			v=this.getValue("powCurCostRate");
			this.onPowWorkRate(v);
		}
		if(this.makeViewsDirty)
		{
			this.makeViewsDirty();
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisPowerCoster.powSetOff=function()
{
	this.setWorkPowerRate(0,1);
};

//---------------------------------------------------------------------------
window.aisTypes.aisPowerCoster.powReduce=function()
{
	var cur;
	if(this.def.powCanReduce)
	{
		cur=this.getValueBase("powCurCostRate");
		this.setWorkPowerRate(cur-10,1);
	}
	if(this.makeViewsDirty)
	{
		this.makeViewsDirty();
	}
};

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的Power对象
window.aisPower=function(env,def,owner,genfactor,ukpfactor,usefactor)
{
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=owner;
		this.type="Power";
		this.def=def;
		aisTypes.applyType(this,aisTypes.aisValueOwner);
		aisTypes.applyType(this,aisTypes.aisViewConnect);
		this.addValue("curOutput",0,null,null,genfactor);
		this.addValue("curAllUsed",0,null,null,null);
		this.addValue("curUpKeep",0,null,null,ukpfactor);
		this.addValue("curWorkCost",0,null,null,usefactor);
		this.geners=[];
		this.costers=[];
		this.lockUpdate=0;
	}
};

window.aisPower.prototype=new aisObj();

//---------------------------------------------------------------------------
window.aisPower.prototype.addGener=function(gener)
{
	//DBOut("LOG>>>aisPower.addGener: "+gener);
	gener.powerObj=this;
	this.geners.push(gener);
	this.update();
}

//---------------------------------------------------------------------------
window.aisPower.prototype.removeGener=function(gener)
{
	var i,n,list;
	if(gener.powerObj!=this)
	{
		//DBOut("Error: aisPower.removeGener, Error 1");
		return;
	}
	list=this.geners;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(list[i]==gener)
		{
			gener.powerObj=null;
			list.splice(i,1);
			this.update();
			return;
		}
	}
}

//---------------------------------------------------------------------------
window.aisPower.prototype.addCoster=function(coster)
{
	//DBOut("LOG>>>aisPower.addCoster: "+coster);
	coster.powerObj=this;
	this.costers.push(coster);
	this.update();
}

//---------------------------------------------------------------------------
window.aisPower.prototype.removeCoster=function(coster)
{
	var i,n,list;
	if(coster.powerObj!=this)
	{
		//DBOut("Error: aisPower.removeGener, Error 1");
		return;
	}
	list=this.costers;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(list[i]==coster)
		{
			coster.powerObj=null;
			list.splice(i,1);
			this.update();
			return;
		}
	}
}

//---------------------------------------------------------------------------
window.aisPower.prototype.getCurFreePower=function()
{
	return this.getValue("curOutput")-this.getValue("curAllUsed");
}

//---------------------------------------------------------------------------
window.aisPower.prototype.update=function()
{
	var i,n,list,item,cost,king;
	var curout,curuse,curuk,curwc;
	var oldout,olduse,olduk,oldwc;
	var oldpout;
	
	if(this.lockUpdate)
		return;
	
	oldout=this.getValue("curOutput");
	olduse=this.getValue("curAllUsed");
	olduk=this.getValue("curUpKeep");
	oldwc=this.getValue("curWorkCost");
	oldpout=olduse>oldout;

	list=this.geners;
	n=list.length;
	curout=0;
	//DBOut(">>>aisPower.update");
	for(i=0;i<n;i++)
	{
		item=list[i];
		if(item.deadOut)
		{
			list.splice(i,1);
			i--;
			n--;
		}
		else
		{
			curout += item.getPowerOutput();
		}
	}
	//DBOut("Total output: "+curout);
	this.setValue("curOutput",curout,1);
	curout = this.getValue("curOutput");
	
	list = this.costers;
	n = list.length;
	curuse = 0;
	curuk = 0;
	curwc = 0;
	
	for(i = 0; i < n; i++)
	{
		item = list[i];
		if(item.deadOut)
		{
			list.splice(i, 1);
			i--;
			n--;
		}
		else
		{
			cost = item.getPowerUpKeep();
			curuse += cost;
			curuk += cost;
			cost = item.getPowerWorkCost();
			curuse += cost;
			curwc += cost;
		}
	}
	
	this.setValue("curAllUsed", curuse, 1);
	curuse = this.getValue("curAllUsed");
	this.setValue("curUpKeep", curuk, 1);
	curuk = this.getValue("curUpKeep");
	this.setValue("curWorkCost", curwc, 1);
	curwc = this.getValue("curWorkCost");
	
	//DBOut("Total use: "+curuse);

	if(olduse != curuse || olduk != curuk || oldwc != curwc || oldout != curout)
	{
		this.makeViewsDirty();

		if(curuse > curout && !oldpout)
		{
			king = this.owner.king;
			if(king)
			{
				//DBOut("addPushMsg!!");
				king.addPushMsg({msg:"ShowNotify",uniqTag:"NoPower",title:"Waring",text:"We don't have enough power, we have to suspend some works.",icon:""});
			}
			//DBOut("Power out!");
			if(curuk >= curout)//能源已经不够给基础需求的了，需要关闭所有生产、研究等额外能源
			{
				//DBOut("Power upkeep out!");
				list = this.costers;
				n = list.length;
				for(i = 0; i < n; i++)
				{
					item = list[i];
					item.powSetOff();
				}
			}
			else//降低生产、研究的能源消耗
			{
				//DBOut("Power work out!");
				do
				{
					oldwc = curwc;
					list = this.costers;
					n = list.length;
					curuse = curuk;
					curwc = 0;
					for(i = 0; i < n; i++)
					{
						item = list[i];
						item.powReduce();
						cost = item.getPowerWorkCost();
						curuse += cost;
						curwc += cost
					}
					this.setValue("curAllUsed", curuse, 1);
					curuse = this.getValue("curAllUsed");
					this.setValue("curWorkCost", curwc, 1);
					curwc = this.getValue("curWorkCost");
				}while(curuse > curout && oldwc > curwc);
				if(curuse > curout)//通过降低生产能耗仍然不能满足当前能量消耗
				{
					list = this.costers;
					n = list.length;
					for(i = 0; i < n; i++)
					{
						item = list[i];
						item.powSetOff();
					}
				}
			}
		}
	}
	//DBOut("<<<aisPower.update");
};

}
