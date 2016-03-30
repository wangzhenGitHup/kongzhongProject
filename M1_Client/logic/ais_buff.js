if(!window.aisBuff)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//Buff的Def对象格式
/*
*/
//---------------------------------------------------------------------------
//拥有Buff的对象
window.aisTypes.aisBuffOwner=function()
{
	this.buffs={};
	this.buffsNum=0;
};

//---------------------------------------------------------------------------
window.aisTypes.aisBuffOwner.updateBuffs=function(king,nowTime,timeGap)
{
	var i,list,buff;
	list=this.buffs;
	for(i in list)
	{
		buff=list[i];
		if(buff)
		{
			buff.updateByKing(king,nowTime);
			if(buff.deadOut)
			{
				//DBOut("Buff over: "+buff.def.codeName);
				if(this.onBuffEnd)
				{
					this.onBuffEnd(list[i]);
				}
				list[i]=null;
				delete list[i];
				if(this.onBuffOver)
				{
					this.onBuffOver(buff.def.codeName);
				}
			}
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBuffOwner.saveBuffs=function(king,voObj)
{
	var i,list,buff,vo;
	
	voObj.buffs={};
	list=this.buffs;
	for(i in list)
	{
		buff=list[i];
		if(buff && !buff.deadOut)
		{
			vo={};
			buff.saveToVO(king,vo);
			voObj.buffs[i]=vo;
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBuffOwner.loadBuffs=function(king,voObj)
{
	var i,list,buff,vo,def;
	this.buffs={};
	list=voObj.buffs;
	if(list)
	{
		for(i in list)
		{
			vo=list[i];
			if(vo)
			{
				def=this.env.defLib.buff[vo.codeName];
				if(def)
				{
					buff=aisBuff.createBuff(def,this.env,this);
					buff.readFmVO(king,vo);
					this.buffs[def.shareName]=buff;
					buff.bindBuffFactors();
					this.buffsNum++;
				}
			}
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBuffOwner.bindBuff=function(codeName)
{
	var def,buff;
	def=this.env.defLib.buff[codeName];
	if(def)
	{
		buff=this.buffs[def.shareName];
		if(buff)
		{
			buff.deadOut=0;
			buff.endTime+=def.durTime;
		}
		else
		{
			buff=aisBuff.createBuff(def,this.env,this);
			this.buffs[def.shareName]=buff;
			buff.startTime=this.king.kingTime();
			buff.endTime=buff.startTime+def.durTime;
			buff.bindBuffFactors();
			this.buffsNum++;
		}
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBuffOwner.removeBuff=function(codeName)
{
	var def,buff;
	def=this.env.defLib.buff[codeName];
	if(def)
	{
		buff=this.buffs[def.shareName];
		if(buff)
		{
			buff.deadOut=1;
			this.buffsNum--;
		}
		this.buffs[def.shareName]=null;
	}
};

//---------------------------------------------------------------------------
window.aisTypes.aisBuffOwner.getBuff=function(codeName)
{
	var i,list,buff;
	list=this.buffs;
	for(i in list)
	{
		buff=list[i];
		if(buff && buff.def.codeName==codeName)
		{
			return buff.deadOut!=1;
		}
	}
	return 0;
};

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的Buff对象
window.aisBuff=function(def,env,owner)
{
	var date;
	if(env)
	{
		window.aisObj.call(this,env);
		this.owner=owner;
		this.type="Buff";
		this.def=def;
		this.startTime=0;
		this.endTime=0;
	}
};

window.aisBuff.createBuff=function(def,env,owner)
{
	switch(def.codeName)
	{
	case "Super Odd":
		return null;
	default:
		return new aisBuff(def,env,owner);
	}
};

window.aisBuff.prototype=new aisObj();

//---------------------------------------------------------------------------
window.aisBuff.prototype.readFmVO=function(king,voObj)
{
	var i,n,list;
	//aisObj.prototype.readFmVo.call(this,voObj);
	this.def=this.env.defLib.buff[voObj.codeName];
	this.startTime=voObj.startTime;
	this.endTime=voObj.endTime;
};

//---------------------------------------------------------------------------
window.aisBuff.prototype.saveToVO=function(king,voObj)
{
	voObj.codeName=this.def.codeName;
	voObj.startTime=this.startTime;
	voObj.endTime=this.endTime;
};

//---------------------------------------------------------------------------
window.aisBuff.prototype.updateByKing=function(king,nowTime)
{
	var dtime;
	dtime=this.endTime-nowTime;
	if(this.endTime && dtime<0)
	{
		this.deadOut=1;
	}
	else
	{
		if(dtime>0)
		{
			king.setTriggerTime(this.endTime);
		}
		else
		{
			king.setTriggerTime(this.endTime+1);
		}
	}
};

//---------------------------------------------------------------------------
window.aisBuff.prototype.bindBuffFactors=function()
{
	var list,i,op,tgt,def,op;
	def=this.def;
	list=def.factors;
	for(i in list)
	{
		tgt=this.owner.getUpperScope(list[i].scope);
		if(tgt)
		{
			op=new aisOpFactor(this.env,this);
			if(list[i].mbf)
			{
				op.mulBFactor=list[i].mbf;
			}
			if(list[i].mvf)
			{
				op.mulVFactor=list[i].mvf;
			}
			if(list[i].add)
			{
				op.addFactor=list[i].add;
			}
			tgt.addOpFactor(list[i].name,op);
		}
	}
};

}
