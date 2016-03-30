if(!window.aisDiamondMine)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//基础的产矿的对象类型
window.aisDiamondMine=function(env,city,def)
{
	var vname,pname,factor;
	if(env)
	{
		window.aisBuilding.call(this,env,city,def);
		this.name="DiamondMine";

		this.harvestable=0;

		this.mineRes=aisEnv.defLib.prdct[def.mineRes];

		//矿的最大已开采资源存贮量
		this.addValue("mineMaxNum",0,null,null,def.mineMaxFactor);
		//矿的当前已开采资源量
		this.addValue("mineCurNum",0,null,"mineMaxNum",null);
		//矿的可由用户收集的最小已开采资源量
		this.addValue("harvestNum",0,null,null,def.mineHarvestFactor);
		//矿的可由用户收集的最小已开采资源量
		this.addValue("mineSpeed",0,null,null,def.mineSpeedFactor);
		this.addValue("mineSpeedByPow",0,null,null,def.mineSpeedByPowFactor);

		//给City增加“开采总速度”这个参数
		vname="hvst"+def.mineRes+"Rate";
		pname="Hvst"+def.mineRes+"Rate";
		this.cityHvstVal=vname;
		if(!this.city.hasValue(vname))
		{
			this.city.addValue(vname,0,null,null,pname);
		}
		//增加用于修正总产量的OPF
		this.hvstCityOPF=factor=new aisOpFactor(this.env,this);
		factor.addFactor=0;
		city.addOpFactor(pname,factor);

		if(!this.city["bldAll"+def.codeName])
		{
			this.city["bldAll"+def.codeName]=[];
		}
	}
};

window.aisDiamondMine.ERR_NoHarvest={level:100,error:"No res to harvest!","class":"aisDiamondMine",code:"ERR_NoHarvest"};
window.aisDiamondMine.ERR_BadPower={level:100,error:"Power rate is out of range!","class":"aisDiamondMine",code:"ERR_BadPower"};

//---------------------------------------------------------------------------
window.aisDiamondMine.prototype=new window.aisBuilding();

//---------------------------------------------------------------------------
//用于UI的函数---------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisDiamondMine.prototype.ui_onClick=function(uiEnv,state)
	{
		var page=uiEnv.page;
		var tech,level;
		DBOut("Auto Mine on click: "+state+","+page+","+this.king);
		switch(state)
		{
		case 0://空闲
		case 1://正在研究中
		case 3://建造中
		case 7://低能量模式（工作暂停）
			uiEnv.openPageDlg(page.genURL("states/dlg_bldinfo_mine.jml"),this);
			break;
		case 4://建造完成
			break;
		case 5://可以收获
			break;
		case 6://资源产量已满可以收获
			break;
		}
	};
}

//---------------------------------------------------------------------------
window.aisDiamondMine.prototype.readDef=function()
{
	var def=this.def;
	var levelInfo=this.def.levels[this.level];
	//矿的最大已开采资源存贮量
	this.setValue("mineMaxNum",levelInfo.mineMaxNum,1);
	//矿的当前已开采资源量
	this.setValue("mineCurNum",this.getValueBase("mineCurNum"),1);
	//矿的可由用户收集的最小已开采资源量
	this.setValue("harvestNum",levelInfo.harvestNum,1);
	//矿的可由用户收集的最小已开采资源量
	this.setValue("mineSpeed",levelInfo.mineSpeed?levelInfo.mineSpeed:0,1);
	this.setValue("mineSpeedByPow",levelInfo.mineSpeedByPow?levelInfo.mineSpeedByPow:0,1);
	this.setValue("powCostPerRate",levelInfo.powCostPerRate,1);

	//TODO:这个写的有点不太好，暂时先这样
	this.onPowWorkRate(this.getValue("powCurCostRate"));
};

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//从Building继承来的函数:
{
	//---------------------------------------------------------------------------
	//从voObj中读出建筑数据
	window.aisDiamondMine.prototype.readFmVO=function(king,voObj,def)
	{
		aisBuilding.prototype.readFmVO.call(this,king,voObj,def);
		this.readDef();
		this.readValue(voObj,"powCurCostRate");
		this.readValue(voObj,"mineCurNum");
		this.city["bldAll"+def.codeName].push(this);
	};

	//---------------------------------------------------------------------------
	//将建筑数据存入voObj
	window.aisDiamondMine.prototype.saveToVO=function(king,voObj)
	{
		aisBuilding.prototype.saveToVO.call(this,king,voObj);
		this.saveValue(voObj,"powCurCostRate");
		this.saveValue(voObj,"mineCurNum");
	};

	//---------------------------------------------------------------------------
	//更新建筑数据
	window.aisDiamondMine.prototype.updateByKing=function(king,nowTime,timeGap)
	{
		aisBuilding.prototype.updateByKing.call(this,king,nowTime,timeGap);
		this.updateMine(king,nowTime,timeGap);
	};
}

//---------------------------------------------------------------------------
window.aisDiamondMine.prototype.updateMine=function(king,nowTime,timeGap)
{
	var rate,num,maxnum,oldnum,oldhv;
	if(this.level<1 || this.constructing)
	{
		return;
	}
	oldnum=this.getValue("mineCurNum");

	//无需能量的资源增长:
	if(!this.constructing)
	{
		rate=this.getValue("mineSpeed");
		num=oldnum+rate*timeGap/1000;
		//DBOut("More mine: "+rate+", "+num);

		//需能量的资源增长:
		/*{
			//DBOut("Work more mine: "+this.getWorkPowerRate()+", "+this.getValue("mineSpeedByPow")+", "+timeGap);
			rate=this.getWorkPowerRate()*this.getValue("mineSpeedByPow")/100;
			num+=rate*timeGap/1000;
		}*/
		//DBOut("Get more mine: "+num);
		this.setValue("mineCurNum",num,1);
		//DBOut("Cur mine: "+this.def.mineRes+", "+num);
	}

	//更新当前状态:
	maxnum=this.getValue("mineMaxNum");
	num=this.getValue("mineCurNum");
	//DBOut("Cur mine: "+num+" vs "+this.getValue("harvestNum")+" maxnum="+maxnum);
	oldhv=this.harvestable;
	if(num>=maxnum)
	{
		this.harvestable=2;
	}
	else if(num>=this.getValue("harvestNum"))
	{
		//DBOut("Can harvest");
		this.harvestable=1;
	}
	//else if(num>=1)
	//{
	//	this.harvestable=-1;
	//}
	else
	{
		this.harvestable=0;
	}
	if(oldhv!=this.harvestable)
	{
		this.makeViewsDirty();
	}
};

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//收取资源
	window.aisDiamondMine.prototype.com_PowerCostRate=function(comVO)
	{
		var rate,pow,freePow;
		rate=comVO.rate;
		if(rate<0 || rate>100)
		{
			DBOut("aisDiamondMine.com_PowerCostRage Error 1: bad rate: "+rate);
			throw aisDiamondMine.ERR_BadPower;
		}
		pow=rate*this.getValue("powCostPerRate")
		freePow=this.city.power.getCurFreePower()+this.getPowerWorkCost()-pow;
		if(freePow<0)
		{
			DBOut("aisDiamondMine.com_PowerCostRage Error 2: not enough city power.");
			throw aisDiamondMine.ERR_BadPower;
		}
		this.setWorkPowerRate(rate);
	};

	//---------------------------------------------------------------------------
	//收取资源
	window.aisDiamondMine.prototype.com_Harvest=function(comVO)
	{
		var num;
		if(!this.harvestable)
		{
			//DBOut("aisDiamondMine.com_Harvest Error 1: no res to harvest: "+this.getValue("mineCurNum")+" vs "+this.getValue("harvestNum"));
			throw aisDiamondMine.ERR_NoHarvest;
		}
		//DBOut("Will harvest: "+comVO.harvestNum);
		num=this.harvestMine(comVO.harvestNum);
		comVO.harvestNum=num;
	};

	//---------------------------------------------------------------------------
	//建造/升级完成
	window.aisDiamondMine.prototype.com_ConstructDone=function()
	{
		var freePow,pctgPow,pow;
		//调用基类的函数:
		window.aisBuilding.prototype.com_ConstructDone.call(this);
		this.readDef();
		//设置工作能量消耗：
		/*freePow=this.city.power.getCurFreePower();
		pctgPow=this.getValue("powCostPerRate");
		pow=Math.floor((freePow/pctgPow)/10)*10;
		pow=pow>100?100:pow;
		pow=pow<0?0:pow;
		this.setWorkPowerRate(pow);
		*/
		this.setWorkPowerRate(100);

		var time=Math.floor(1/this.getValue("mineSpeed"));
		if(window.MP)window.MP.addPushList("Diamondmine",7,time);
	};
	window.aisDiamondMine.prototype.onConstructDone=function()
	{
		this.readDef();
		this.setWorkPowerRate(100);
	};
}
//---------------------------------------------------------------------------
window.aisDiamondMine.prototype.getMineNum=function()
{
	return this.getValue("mineCurNum");
};

//---------------------------------------------------------------------------
window.aisDiamondMine.prototype.getMineCapRate=function()
{
	return this.getValue("mineCurNum")/this.getValue("mineMaxNum");
};

//---------------------------------------------------------------------------
window.aisDiamondMine.prototype.isHarvestOverload=function()
{
	var num,vo;
	return 0;
};

//---------------------------------------------------------------------------
window.aisDiamondMine.prototype.harvestMine=function(voNum)
{
	var num,vo,rate;
	num=Math.floor(this.getValue("mineCurNum"));
	if(voNum)//这是服务器，需要比对数量是否差距过大
	{
		rate=num/voNum;
		if(rate<0.9 || rate>1.1)
		{
			//TODO：报错，数据未能同步
		}
		num=voNum;
	}
	vo={gem:num};
	this.city.returnCost(vo,1);

	this.setValue("mineCurNum",0);
	this.makeViewsDirty();
	this.harvestable=0;

	var time=Math.floor(1/this.getValue("mineSpeed"));
	if(window.MP)window.MP.addPushList("Diamondmine",7,time);

	return num;
};

//---------------------------------------------------------------------------
//工作能量变化的回调
window.aisDiamondMine.prototype.onPowWorkRate=function(v)
{
	var rate;
	//DBOut("Auto Mine Power change: "+v);
	rate=this.getWorkPowerRate()*this.getValue("mineSpeedByPow")/100;
	rate+=this.getValue("mineSpeed");
	this.hvstCityOPF.addFactor=rate;
};

}
