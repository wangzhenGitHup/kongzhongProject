if(!window.aisAmmoGun)
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//障碍物,装饰物的对象类型
window.aisAmmoGun=function(env,city,def)
{
	var vname,pname,factor;
	if(env)
	{
		window.aisBuilding.call(this,env,city,def);
		this.name="AmmoGun";
		this.curAmmo=0;
		this.fireMode=0;
	}
};

window.aisAmmoGun.ERR_NoHarvest={level:100,error:"No res to harvest!","class":"aisAmmoGun",code:"ERR_NoHarvest"};
window.aisAmmoGun.ERR_BadPower={level:100,error:"Power rate is out of range!","class":"aisAmmoGun",code:"ERR_BadPower"};

//---------------------------------------------------------------------------
window.aisAmmoGun.prototype=new window.aisBuilding();

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//从Building继承来的函数:
{
	//---------------------------------------------------------------------------
	//从voObj中读出建筑数据
	window.aisAmmoGun.prototype.readFmVO=function(king,voObj,def)
	{
		aisBuilding.prototype.readFmVO.call(this,king,voObj,def);
		this.curAmmo=Math.floor(voObj.curAmmo);
		this.fireMode=voObj.fireMode;
	};

	//---------------------------------------------------------------------------
	//将建筑数据存入voObj
	window.aisAmmoGun.prototype.saveToVO=function(king,voObj)
	{
		aisBuilding.prototype.saveToVO.call(this,king,voObj);
		voObj.curAmmo=Math.floor(this.curAmmo);
		voObj.fireMode=this.fireMode;
	};
}

//---------------------------------------------------------------------------
//用户发起的Command函数------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//装弹药
	window.aisAmmoGun.prototype.com_Reload=function(comVO)
	{
		var cost,num;
		var def;
		def=this.def;
		DBOut("Will reload ammo for ammoGun!");
		if(this.constructing)
		{
			DBOut("aisBuilding.com_Reload Error 1: building already under building!");
			throw aisBuilding.ERR_InConstruct;
		}
		if(this.level<1)
		{
			DBOut("aisBuilding.com_Reload Error 3, level is not 1!");
			throw aisBuilding.ERR_Busy;
		}
		num=def.levels[this.level].maxAmmo-this.curAmmo;
		num*=def.levels[this.level].res2AmmoRate;
		if(num>0 && num<1)
			num=1;
		else
			num=Math.ceil(num);

		comVO.resType=def.levels[this.level].ammoRes.type;
		comVO.resNum=num;
		//DBOut("-----com_Reload----comVO="+toJSON(comVO));

		cost={storage:[{store:def.levels[this.level].ammoRes.storage,type:def.levels[this.level].ammoRes.type,num:num}]};
		this.city.useCost(cost,1,0);
		this.curAmmo=def.levels[this.level].maxAmmo;
		this.makeViewsDirty();
	};

	//---------------------------------------------------------------------------
	//更换模式
	window.aisAmmoGun.prototype.com_SwitchMode=function(comVO)
	{
		var def=this.def;
		if(this.constructing)
		{
			DBOut("aisBuilding.cancelConstruct Error 1: Building is not in construct!!");
			throw aisBuilding.ERR_NotInConstruct;
		}

		this.fireMode=this.fireMode?0:1;
		comVO.fireMode=this.fireMode;
		this.makeViewsDirty();
	}
}
}
