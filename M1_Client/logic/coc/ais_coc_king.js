if(!window.aisCoCKing)
{
window.aisCoCKing=function(env,isClient)
{
	var date,list,i,achvmnt;
	if(env)
	{
		window.aisKing.call(this,env,isClient);
		this.name="CoCKing";
		list=aisEnv.defLib.achvmnt;
		for(i in list)
		{
			if(list[i].codeName)
			{
			//	DBOut("Find achievment: "+i);
				this.achvmnts.addAchvmnt(list[i]);
			}
		}
	}
};

window.aisCoCKing.prototype=new aisKing();
window.aisCoCKing.ERR_NoCmd={level:100,error:"Command not found in command-obj.","class":"aisCoCKing",code:"ERR_NoCmd"};
window.aisCoCKing.ERR_ObjNotHashed={level:100,error:"Command not found in command-obj.","class":"aisCoCKing",code:"ERR_ObjNotHashed"};

//---------------------------------------------------------------------------
//重载aisKing的创建函数
window.aisKing.newInstance=function(env,isClient)
{
	return new aisCoCKing(env,isClient);
};

//---------------------------------------------------------------------------
//创建一个针对游戏的城市对象实例, 具体游戏实现需要重载这个函数
window.aisCoCKing.prototype.newCityInstance=function()
{
	return new aisCoCCity(this.env,this);
};

//---------------------------------------------------------------------------
//获得一种单位的级别:
window.aisCoCKing.prototype.getUnitLevel=function(codeName)
{
	var def,techName,tech;
	def=aisEnv.defLib.unit[codeName];
	techName=def.levelTech;
	tech=this.getTech(techName);
	if(tech)
	{
		return tech.level;
	}
	return 0;
};

//---------------------------------------------------------------------------
//获得一种法术的级别:
window.aisCoCKing.prototype.getSpellLevel=function(codeName)
{
	var def,techName,tech;
	def=aisEnv.defLib.spell[codeName];
	techName=def.levelTech;
	tech=this.getTech(techName);
	if(tech)
	{
		return tech.level;
	}
	return 0;
};
//---------------------------------------------------------------------------
//通过科技codename获得单位或者法术:
window.aisCoCKing.prototype.getUnitByTechCodeName=function(codeName)
{
	var i,list;
	list=aisEnv.defLib.unit;
	for(i in list)
	{
		if(list[i].levelTech==codeName)
			return list[i];
	}
	list=aisEnv.defLib.spell;
	for(i in list)
	{
		if(list[i].levelTech==codeName)
			return list[i];
	}
};
//---------------------------------------------------------------------------
//该等级的建筑物是否达到研究上限
window.aisCoCKing.prototype.isTechFull=function(level)
{
	var i,def,techs,lv,tech;
	def=aisEnv.defLib.tech;
	techs=def.allTechs;
	for(i=0;i<techs.length;i++)
	{
		tech=this.getTech(techs[i]);
		lv=(!tech)?0:tech.level;
		if(def[techs[i]].levels[lv] && def[techs[i]].levels[lv].req && def[techs[i]].levels[lv].req.bldLv<=level)
		{
			return 0;
		}
	}
	return 1;
};


}