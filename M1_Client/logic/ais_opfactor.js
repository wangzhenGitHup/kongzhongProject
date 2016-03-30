if(!window.aisOpFactor)
{
//---------------------------------------------------------------------------
//拥有OpFactor的对象
//---------------------------------------------------------------------------
{
	window.aisTypes.opFactorOwner=function()
	{
		this.opFactors=[];
		this.opFactorsNum=0;
	};

	//---------------------------------------------------------------------------
	window.aisTypes.opFactorOwner.addOpFactor=function(name,factor)
	{
		factor._addLinkToObj(this.opFactors,name);
		this.opFactorsNum++;
	};

	//---------------------------------------------------------------------------
	window.aisTypes.opFactorOwner.applyOpFactors=function(value)
	{
		var op;
		op=this.opFactors[value.factorName];
		if(op)
		{
			op.calValue(value);
		}
	};
	
	//---------------------------------------------------------------------------
	window.aisTypes.opFactorOwner.updateOpFactors=function()
	{
		var i,cur,list,next;
		list=this.opFactors;
		for(i in list)
		{
			cur=list[i];
			while(cur)
			{
				next=cur.next;
				if(!cur.owner || cur.owner.deadOut)
				{
					cur._removeLinkFmObj(list,i);
					this.opFactorsNum--;
				}
				cur=next;
			}
		}
	}
}

//---------------------------------------------------------------------------
//OpFactor对象
//---------------------------------------------------------------------------
{
	window.aisOpFactor=function(env,owner)
	{
		var date;
		if(env)
		{
			window.aisObj.call(this,env);
			this.name="OpFactor";
			this.type="OpFactor";
			this.owner=owner;
			this.host=null;
			this.mulBFactor=1.0;
			this.mulVFactor=1.0;
			this.addFactor=0.0;
			//增加链表功能
			//DBOut("Will add link type: "+aisTypes.link);
			aisTypes.applyType(this,aisTypes.link);
		}
	};

	window.aisOpFactor.prototype=new aisObj();

	//---------------------------------------------------------------------------
	//计算一个Value的修正值，value包括两个成员变量value.curVal是当前修正后的值，value.baseVal是没有修正过的基础值
	window.aisOpFactor.prototype.calValue=function(value,sub)
	{
		var cur;
		var i;
		if(this.owner && !this.owner.deadOut)
		{
			//DBOut("OpFactor.calValue: "+this.addFactor+", "+this.owner.hashId);
			value.calVMul*=this.mulVFactor;
			value.calBMul*=this.mulBFactor;
			value.curVal+=this.addFactor;
		}
		if(!sub)
		{
			cur=this.next;
			while(cur)
			{
				cur.calValue(value,1);
				cur=cur.next;
			}
		}
	};

	//---------------------------------------------------------------------------
	//经过Value绑定后的计算一个Value的修正值,当Factor对象被Bind后会修改自己的calValue函数入口到这个函数上
	window.aisOpFactor.prototype.bindedCalValue=function(value)
	{
		var cur,owner;
		var i;
		owner=this.owner;
		if(this.owner && !this.owner.deadOut)
		{
			value.calVMul*=this.mulVBind?owner.getValue(this.mulVBind):this.mulVFactor;
			value.calBMul*=this.mulBBind?owner.getValue(this.mulBBind):this.mulBFactor;
			value.calVal+=this.addBind?owner.getValue(this.addBind):this.addFactor;
		}
		cur=this.next;
		while(cur)
		{
			cur.calValue(value);
			cur=cur.next;
		}
	};

	//---------------------------------------------------------------------------
	//将修正值与owner的value进行绑定，注意这个函数将导致对象更换calValue函数
	window.aisOpFactor.prototype.bind2Value=function(addVal,mulBVal,mulVVal)
	{
		this.calValue=window.aisOpFactor.prototype.bindedCalValue;
		this.addBind=addVal;
		this.mulBBind=mulBVal;
		this.mulVBind=mulVVal;
	};

	//---------------------------------------------------------------------------
	window.aisOpFactor.prototype.readFmVO=function(voObj){};

	//---------------------------------------------------------------------------
	window.aisOpFactor.prototype.saveToVO=function(voObj){};

	//---------------------------------------------------------------------------
	window.aisOpFactor.prototype.update=function(nowTime){};
	}
}