if(!window.aisCoCCity)
{
window.aisCoCCity=function(env,king)
{
	var date;
	var factor,list,i,n,def;
	if(env)
	{
		window.aisCity.call(this,env,king);
		//建筑区域最大尺寸，这个和具体游戏设定有关
		this.bldBoxSize=[40,40];

		//金库
		factor=new aisOpFactor(this.env,this);
		factor.addFactor=0;
		this.addOpFactor("MAX_GOLDSTORE",factor);
		this.goldStorage=new aisStorage(env,this,"MAX_GOLDSTORE");
		this.goldStorage.storeMark="Gold";
		this.allStorages["Gold"]=this.goldStorage;
		this.storageList.push(this.goldStorage);

		//油库
		factor=new aisOpFactor(this.env,this);
		factor.addFactor=0;
		this.addOpFactor("MAX_OILSTORE",factor);
		this.oilStorage=new aisStorage(env,this,"MAX_OILSTORE");
		this.oilStorage.storeMark="Oil";
		this.allStorages["Oil"]=this.oilStorage;
		this.storageList.push(this.oilStorage);

		//能量块库
		factor=new aisOpFactor(this.env,this);
		factor.addFactor=0;
		this.addOpFactor("MAX_CUBESTORE",factor);
		this.cubeStorage=new aisStorage(env,this,"MAX_CUBESTORE");
		this.cubeStorage.storeMark="Cube";
		this.allStorages["Cube"]=this.cubeStorage;
		this.storageList.push(this.cubeStorage);

		//屯兵场
		this.unitStorage=new aisStorage(env,this,"MAX_UNITSTORE",aisEnv.defLib.unit);
		this.unitStorage.storeMark="Unit";
		this.allStorages["Unit"]=this.unitStorage;
		this.storageList.push(this.unitStorage);

		//法术库
		this.spellStorage=new aisStorage(env,this,"MAX_SPELLSTORE",aisEnv.defLib.spell);
		this.spellStorage.storeMark="Spell";
		this.allStorages["Spell"]=this.spellStorage;
		this.storageList.push(this.spellStorage);

		//联盟城堡
		this.clanStorage=new aisStorage(env,this,"MAX_CLANSTORE",aisEnv.defLib.unit);
		this.clanStorage.storeMark="Clan";
		this.allStorages["Clan"]=this.clanStorage;
		this.storageList.push(this.clanStorage);

		this.clanMsgs=new aisTypes.aisClanMessages(env,this);
		//机甲部件
		this.partStorage=new aisStorage(env,this,"MAX_PARTSTORE",aisEnv.defLib.part);
		this.partStorage.storeMark="Part";
		this.allStorages["Part"]=this.partStorage;
		this.storageList.push(this.partStorage);

		//机甲模块
		this.addOnStorage=new aisStorage(env,this,"MAX_ADDONSTORE",aisEnv.defLib.addon);
		this.addOnStorage.storeMark="AddOn";
		this.allStorages["AddOn"]=this.addOnStorage;
		this.storageList.push(this.addOnStorage);

		//时间碎片库
		factor=new aisOpFactor(this.env,this);
		factor.addFactor=aisEnv.defLib.globals["MAX_TOKEN2"];
		this.addOpFactor("MAX_CUTTIMESTORE",factor);
		this.cuttimeStorage=new aisStorage(env,this,"MAX_CUTTIMESTORE");
		this.cuttimeStorage.storeMark="CutTime";
		this.allStorages["CutTime"]=this.cuttimeStorage;
		this.storageList.push(this.cuttimeStorage);

		//防御哨所
		this.fortStorage=new aisStorage(env,this,"MAX_FORTSTORE",aisEnv.defLib.unit);
		this.fortStorage.storeMark="Fort";
		this.allStorages["Fort"]=this.fortStorage;
		this.storageList.push(this.fortStorage);

		//物品背包
		factor=new aisOpFactor(this.env,this);
		factor.addFactor=99999999999;
		this.addOpFactor("MAX_ITEMSTORE",factor);
		this.itemStorage=new aisStorage(env,this,"MAX_ITEMSTORE",aisEnv.defLib.item);
		this.itemStorage.storeMark="Item";
		this.allStorages["Item"]=this.itemStorage;
		this.storageList.push(this.itemStorage);

	}
};

window.aisCoCCity.prototype=new aisCity();

//保存建筑物至快照
window.aisCoCCity.prototype.saveCoCVO=function(voObj)
{
	var slist,tlist,i,n,cocBld;

	voObj.bunkerunits=[];
	tlist=voObj.objs=[];
	slist=this.buildings;
	n=slist.length;
	for(i=0;i<n;i++)
	{
		cocBld=slist[i].cocBld;
//		if(cocBld && cocBld.objDefIdx>=0)
//		{
//			tlist.push({def:cocBld.objDefIdx,group:2,x:slist[i].pos[0],y:slist[i].pos[1]});
//		}
		if(cocBld && cocBld.homeBld && cocBld.homeBld.cocDef && cocBld.homeBld.cocDefIdx>=0)
		{
			tlist.push({defName:cocBld.homeBld.cocDef.def_name,def:cocBld.objDefIdx,group:2,x:slist[i].pos[0],y:slist[i].pos[1]});
		}
	}
};

//保存战斗单位:
window.aisCoCCity.prototype.saveCoCUnitVO=function(voObj,cocLevel)
{
	var slist,tlist,i,n,slot,def,idx;
	var store,level;
	store=this.unitStorage;
	slist=store.slots;
	tlist=voObj.units=[];
	for(i in slist)
	{
		slot=slist[i];
		def=slot.def;
		level=this.king.getUnitLevel(def.codeName);//获得正确的单位等级
		idx=cocLevel.getObjDefIdx(def.levels[level].cocDefName);
		tlist.push({"icon":def.icon, "defIdx":idx,"num":slot.num});
	}
	//TODO: 保存Spell列表:
	//TODO: 保存Clan单位列表:
};

//收到其它玩家的捐赠:
window.aisCoCCity.prototype.com_GetDonated=function(comVO)
{
	var store,slist,tlist,i,n,slot;
	//DBOut("Get donate: "+toJSON(comVO));
	slist=comVO.units;
	tlist=[];
	n=slist.length;
	for(i=0;i<n;i++)
	{
		slot=slist[i];
		tlist.push({type:slot.type,subType:""+slot.level,num:slot.num,store:"Clan"});
	}
	//DBOut("Will put in storage: "+toJSON(comVO));
	store=this.clanStorage;
	store.putItemsIn(tlist);

	//TODO: 启用通知系统?
	//this.king.addPushMsg(comVO);
};


//取出向其它玩家捐赠的单位,并给单位增加等级:
window.aisCoCCity.prototype.com_DonateClan=function(comVO)
{
	var store,def,num,prc,slist,tlist,i,n,slot;

	slist=comVO.units;
	tlist=[];
	n=slist.length;
	for(i=0;i<n;i++)
	{
		slot=slist[i];
		slot.level=this.king.getUnitLevel(slot.type);
		tlist.push({type:slot.type,num:slot.num,store:"Unit"});
	}

	if(!this.checkTakeOut(tlist))
	{
		//DBOut("aisCoCCity.com_DonateClan ERROR 2: "+toJSON(tlist));
		throw aisCity.ERR_SellTooMuch;
	}
	this.doTakeOut(tlist);

	if(this.king.achvmnts)
	{
		this.king.achvmnts.onExecCom(this,"DonateClan",comVO);
	}
	if(this.king.dailytasks)
	{
		this.king.dailytasks.onExecCom(this,"DonateClan",comVO);
	}
};

window.aisCoCCity.prototype.com_ClanDonatePoints_PS=function(comVO)
{
	var def,vo;
	var bld=this.king.getHashObj("Obj0");
	if(!bld)return;

	def=window.aisEnv.defLib.clan;

	if(comVO.type==0)
	{
		if(!comVO.bSucceed)
			if(comVO.bSelf)
				bld.dailyDonateTimes--;
		vo=def.genDonate;
	}else if(comVO.type==1)
	{
		vo=def.powerDonate;
	}
	if(!comVO.bSucceed)return;

	if(comVO.bSelf)
		this.useCost(vo.cost,1);
	var clanVO=this.clanVO;
	if(clanVO)
		clanVO.point+=vo.exp;
};
window.aisCoCCity.prototype.com_ClanSignIn_PS=function(comVO)
{
	var bld=this.king.getHashObj("Obj0");
	if(!bld)return;
	if(comVO.bSelf)
		bld.signIn=1;
	var clanVO=this.clanVO;
	if(clanVO)
		clanVO.point+=window.aisEnv.defLib.clan.signinPoints;
};
window.aisCoCCity.prototype.com_ClanUpgrade_PS=function(comVO)
{
	var clanVO=this.clanVO;
	if(clanVO)
	{
		clanVO.point-=comVO.point;
		clanVO.level++;
	}
	this.allianceLevel++;

	var appEnv=window.aisGame.appEnv;
	var i,j,def,tech,bld,m,n,buffName,_buffName,list,level,lv,_lv;
	n=clanVO.techs.length;
	for(i=0;i<n;i++)
	{
		tech=clanVO.techs[i];
		if(tech.status!=this.clanMsgs.CLAN_TECH_STATUS_ED)continue;
		def=window.aisEnv.defLib.clanTec[tech.codename];
		lv=appEnv.getClanTechLv(tech.codename);
		_lv=appEnv.getClanTechLvByClanLv(clanVO.level-1,tech.codename);
		if(_lv>=lv)continue;
		level=def.levels[lv-1];
		if(!def || !level)continue;
		if(level.scope=="Barrack" && level.scopeVar=="TrainingTime")
		{
			list=this["bldAllBarrack"];
			if(!list)continue;
			buffName=tech.codename+lv;
			_buffName=tech.codename+_lv;
			if(!window.aisEnv.defLib.buff[buffName])continue;

			for(j=0;j<list.length;j++)
			{
				bld=list[j];
				bld.removeBuff(_buffName);
				bld.bindBuff(buffName);
				bld.buffs[buffName].endTime=tech.expireTimes;
				bld.makeViewsDirty();
			}
		}
	}
};
window.aisCoCCity.prototype.com_ClanAllotRes_PS=function(comVO)
{
	var clanVO=this.clanVO;
	if(clanVO && comVO.resType=="Gem")
	{
		//if(!comVO.bSelf)
		//this.useClanRes({type:comVO.resType,num:comVO.resNum});
		//if(comVO.bSelf)
		//	this.returnCost({gem:comVO.resNum},1);
	}

};
window.aisCoCCity.prototype.com_ClanAllotRes=function(comVO)
{
	var clanVO=this.clanVO;
	if(clanVO && comVO.resType=="Gem")
	{
		this.useClanRes({type:comVO.resType,num:comVO.resNum});
		//if(comVO.receiveUid==window.USERID)
		//	this.returnCost({gem:comVO.resNum},1);
	}
};
window.aisCoCCity.prototype.com_ClanCallOn_PS=function(comVO)
{
	var i,vo,tecvo,clanVO=this.clanVO;
	if(clanVO)
	{
		vo=clanVO.techs;
		tecvo=comVO.tecvo;
		if(!tecvo)return;
		for(i=0;i<vo.length;i++)
		{
			if(vo[i].codename==tecvo.codename)
			{
				vo[i]=tecvo;
				return;
			}
		}
		vo.push(tecvo);
	}
};
window.aisCoCCity.prototype.com_ClanRespondCall_PS=function(comVO)
{
	var i,vo,def,lv,tecvo,clanVO=this.clanVO;
	if(clanVO)
	{
		vo=clanVO.techs;
		tecvo=comVO.tecvo;
		if(!tecvo)return;

		if(comVO.bSelf)
		{
			lv=tecvo.level;
			def=window.aisEnv.defLib.clanTec[tecvo.codename];
			if(def && def.levels[lv-1])
			this.useCost(def.levels[lv-1].callCost,1);
		}

		for(i=0;i<vo.length;i++)
		{
			if(vo[i].codename==tecvo.codename)
			{
				vo[i]=tecvo;
				this.initClanTech(vo[i]);
				return;
			}
		}
		this.initClanTech(tecvo);
		vo.push(tecvo);
	}
};
window.aisCoCCity.prototype.com_ClanDeclareWar_PS=function(comVO)
{
	var i,vo;
	if(this.clanLoginVO)
	{
		this.clanLoginVO.targetDomainId=comVO.domainId;
	}
};
window.aisCoCCity.prototype.com_ClanCallGem_PS=function(comVO)
{
	var i,vo,def,lv,tecvo,clanVO=this.clanVO;
	if(clanVO)
	{
		vo=clanVO.techs;
		tecvo=comVO.tecvo;
		if(!tecvo)return;

		if(comVO.bSelf)
		{
			lv=tecvo.level;
			def=window.aisEnv.defLib.clanTec[tecvo.codename];
			if(def && def.levels[lv-1])
			this.useCost(def.levels[lv-1].cost,1);
		}

		for(i=0;i<vo.length;i++)
		{
			if(vo[i].codename==tecvo.codename)
			{
				vo[i]=tecvo;
				this.initClanTech(vo[i]);
				return;
			}
		}
		this.initClanTech(tecvo);
		vo.push(tecvo);
	}
};

//推送消息
window.aisCoCCity.prototype.addTrainFinishPushMsg=function()
{
	if(!window.MP)return;
	var n,i,bld,def,time,updateTime,nowTimetime,taskTime,maxtime=0;
	n=this.buildings.length;
	for(i=0;i<n;i++)
	{
		bld=this.buildings[i];
		def=bld.def;
		if(def.codeName!="Barrack")continue;
		time=0;
		if(bld.workTask)
		{
			taskTime=bld.workTask.getRemainTime();
			if(bld.working==1)
			{
				updateTime=aisGame.king.lastUpdate;
				nowTime=aisEnv.dateTime();
				taskTime-=(nowTime+aisGame.king.debugTimeGap)-updateTime;
			}
			taskTime=taskTime<0?0:taskTime;
			time+=taskTime;
		}
		time+=(bld.slotWorkVal/bld.getValue("mfcSpeed"));
		time=time<0?0:time;
		if(time>maxtime)maxtime=time;
	}
	if(maxtime>0)
		window.MP.addPushList("TrainFinish",2,Math.floor(maxtime/1000));
	else
		window.MP.removePushList("TrainFinish",2);
};

window.aisCoCCity.prototype.addTrainFullPushMsg=function()
{
	if(!window.MP)return;
	var n,i,bld,def,time,updateTime,nowTimetime,taskTime,maxtime=0,list,allCap;

	list=this["bldAllBarrack"];
	n=list.length;
	allCap=0;
	for(i=0;i<n;i++)
	{
		allCap+=list[i].slotCap;
	}
	if((allCap+this.unitStorage.getValue("curLoad"))<this.unitStorage.getValue("maxLoad"))
	{
		window.MP.removePushList("TrainFull",0);
		return;
	}
	n=this.buildings.length;
	for(i=0;i<n;i++)
	{
		bld=this.buildings[i];
		def=bld.def;
		if(def.codeName!="Barrack")continue;
		time=0;
		if(bld.workTask)
		{
			taskTime=bld.workTask.getRemainTime();
			if(bld.working==1)
			{
				updateTime=aisGame.king.lastUpdate;
				nowTime=aisEnv.dateTime();
				taskTime-=(nowTime+aisGame.king.debugTimeGap)-updateTime;
			}
			taskTime=taskTime<0?0:taskTime;
			time+=taskTime;
		}
		time+=(bld.slotWorkVal/bld.getValue("mfcSpeed"));
		time=time<0?0:time;
		if(time>maxtime)maxtime=time;
	}
	if(maxtime>0)
		window.MP.addPushList("TrainFull",0,Math.floor(maxtime/1000));
	else
		window.MP.removePushList("TrainFull",0);
};
window.aisCoCCity.prototype.addDiamondminePushMsg=function()
{
	if(!window.MP)return;
	var n,i,bld,def,time,list,num;

	list=this["bldAllDiamondMine"];
	if(!list)return;
	n=list.length;
	for(i=0;i<n;i++)
	{
		bld=list[i];
		num=bld.getValue("mineCurNum");
		if(num>1)continue;
		num=1-num;
		time=Math.floor(num/bld.getValue("mineSpeed"));
		window.MP.addPushList("Diamondmine",7,time);
	}

};

//---------------------------------------------------------------------------
//购买护盾
window.aisCoCCity.prototype.com_BuyShield=function(comVO)
{
	if(!comVO)return;
	var buff=this.getBuff("Shield");
	var def=this.env.defLib.buff[comVO.codeName];
	if(buff)
	{
		buff=this.buffs["Shield"];
		buff.endTime+=def.durTime;
	}else{
		this.bindBuff("Shield");
		buff=this.buffs["Shield"];
		buff.endTime=buff.startTime+def.durTime;
	}
	this.useCost(def.cost,1);
	this.makeViewsDirty();
	this.king.makeViewsDirty();
};

//---------------------------------------------------------------------------
//使用礼包
window.aisCoCCity.prototype.com_GiftUses=function(comVO)
{
	if(!comVO)return;
	if(!this.gifts)return;
	var i,j,gift,res;
	for(i=0;i<this.gifts.length;i++)
	{
		gift=this.gifts[i];
		if(gift.id==comVO.giftId)
		{
			if(gift.expire<=this.env.dateTime())
			{
				this.gifts.splice(i,1);
				this.makeViewsDirty();
				if(this.aisTownHall){
					this.aisTownHall.makeViewsDirty();
				}
				return;
			}
			for(j=0;j<gift.reses.length;j++)
			{
				res=gift.reses[j];
				if(res.type=="Gem")
					this.returnCost({gem:res.num},1);
				else if(res.type=="Gold")
					this.returnCost({storage:[{store:"Gold",type:"ResGold",num:res.num}]},1);
				else if(res.type=="Elixir")
					this.returnCost({storage:[{store:"Oil",type:"ResOil",num:res.num}]},1);
				else if(res.type=="Cube")
					this.returnCost({storage:[{store:"Cube",type:"ResCube",num:res.num}]},1);
				else if(res.type=="tok1")
					this.returnCost({cash:res.num},1);
				else if(res.type=="tok2")
					this.returnCost({storage:[{store:"CutTime",type:"CutTime",num:res.num}]},1);
				else if(res.type=="Rmb"){
					this.vipExp+=res.num;
					this.charge+=res.num;
				}else if(window.aisEnv.defLib.item[res.type])
					this.returnCost({storage:[{store:"Item",type:res.type,num:res.num}]},1);

			}
			this.gifts.splice(i,1);
			this.makeViewsDirty();
			if(this.aisTownHall){
				this.aisTownHall.makeViewsDirty();
			}
			return;
		}
	}
};

//---------------------------------------------------------------------------
//解锁仇人列表槽
window.aisCoCCity.prototype.com_UnlockEnemySlot=function(comVO)
{
	if(!comVO)return;
	if(comVO.gemNum)
	{
		this.useCost({gem:comVO.gemNum},1);
		this.makeViewsDirty();
		this.king.makeViewsDirty();
	}
};

window.aisCoCCity.prototype.com_AddEnemy=function(comVO)
{
	/*
	if(!comVO)return;
	if(this.enemys && this.enemys.length>=comVO.pos)
	{
		this.enemys[comVO.pos]={oppUserId:comVO.userId,};
	}
	*/
};

window.aisCoCCity.prototype.com_ShopSpecialMall_PS=function(comVO)
{
	if(!comVO)return;
	var defLib=window.aisEnv.defLib.shopSpecial;
	var cost=defLib[comVO.itemId].cost;
	if(cost)
		this.useCost(cost,1);
	if(!this.times)this.times=[];
	for(var i=0;i<this.times.length;i++)
	{
		if(this.times[i].codename==comVO.itemId)
		{
			this.times[i].times++;
			this.times[i].dailyTimes++;
			this.times[i].globalTimes++;
			return;
		}
	}
	this.times.push({codename:comVO.itemId,times:1,dailyTimes:1,globalTimes:1});
};

window.aisCoCCity.prototype.com_PackageOpenBox_PS=function(comVO)
{
	if(!comVO)return;
	var defLib=window.aisEnv.defLib.item;
	var cost=defLib[comVO.itemId].cost;
	this.useCost({storage:[{store:"Item",type:comVO.itemId,num:1}]},1);
	if(cost)
		this.useCost(cost,1);
};


window.aisCoCCity.prototype.updateGifts=function()
{
	if(!this.gifts)return;
	var i,j,gift,res;
	for(i=0;i<this.gifts.length;i++)
	{
		gift=this.gifts[i];
		if(gift.expire<=this.env.dateTime())
		{
			this.gifts.splice(i,1);
			i--;
		}
	}
};
//-----------------Notice---------------------------
window.aisCoCCity.prototype.cbGetSysNotice=function(vo)
{
	if(!vo)return;
	if(!vo.length)return;
	if(!this.noticeList)this.noticeList=[];

	for(var i=vo.length-1;i>=0;i--)
		this.addNotice(vo[i],this.noticeRead["id"+vo[i].id]);
	this.noticeRead={};
	for(var i=0;i<this.noticeList.length;i++)
	{
		if(this.noticeList[i].state)
			this.noticeRead["id"+this.noticeList[i].id]=1;
	}
	this.saveReadNotice();
	//this.page.uiStateHome.addFlagNum("note",this.getUnreadNum());
	this.makeViewsDirty();
	if(this.aisTownHall){
		this.aisTownHall.makeViewsDirty();
	}
};
window.aisCoCCity.prototype.loadReadNotice=function()
{
	var vo=UIBody.getCookie("notice","readlist");
	if(!vo)
	{
		this.noticeRead={};
		this.saveReadNotice();
	}else{
		this.noticeRead=fromJSON(vo);
	}
};
window.aisCoCCity.prototype.saveReadNotice=function()
{
	UIBody.setCookie("notice","readlist",toJSON(this.noticeRead),0);
};
window.aisCoCCity.prototype.addNotice=function(vo,state)
{
	var i;
	vo.state=state;//flag new 0, read 1
	this.noticeList.unshift(vo);
};
window.aisCoCCity.prototype.resetNotice=function(vo)
{
	var i;
	for(i=0;i<this.noticeList.length;i++)
	{
		if(this.noticeList[i].id==vo.id){
			this.noticeList[i]=vo;
			return;
		}
	}
};
window.aisCoCCity.prototype.delNotice=function(vo)
{
	var i;
	for(i=0;i<this.noticeList.length;i++)
	{
		if(this.noticeList[i].id==vo.id){
			this.noticeList.splice(i,1);
			return;
		}
	}
};
window.aisCoCCity.prototype.readNoticeById=function(id)
{
	var i;
	for(i=0;i<this.noticeList.length;i++)
	{
		if(this.noticeList[i].id==id){
			this.noticeList[i].state=1;
			this.noticeRead["id"+id]=1;
			this.saveReadNotice();
			//this.page.uiStateHome.addFlagNum("note",this.getUnreadNum());
			this.makeViewsDirty();
			if(this.aisTownHall){
				this.aisTownHall.makeViewsDirty();
			}
			return;
		}
	}
};
window.aisCoCCity.prototype.getUnreadNum=function()
{
	var i,n=0;
	for(i=0;i<this.noticeList.length;i++)
	{
		if(!this.noticeList[i].state)
			n++;
	}
	return n;
};

window.aisCoCCity.prototype.getOnslaughtCityInfo=function()
{
	var i,n,list,aisbld,bld,group,vo,city,sbf,ammo,instance,lv;
	vo={};
	city={instances:[],scoreBuildingNum:0};
	this.saveToVO(this.king,vo);

	list=vo.buildings;
	n=list.length;
	for(i=0;i<n;i++)
	{
		bld=list[i];

		aisbld=this.king.getHashObj(bld.hashId);
		if(!aisbld)continue;
		group=aisbld.def.groupId;
		sbf=(group=="Obstacle" || group=="Decorate" || group=="Traps" || group=="Wall")?-1:0;

		instance={id:parseInt(bld.hashId.substring(3),10),c:bld.codeName,l:bld.level?bld.level:1,s:bld.constructing,sg:[],u:[],pos:{x:bld.pos[0],y:bld.pos[1]},sbf:sbf};

		if(aisbld.def && aisbld.def.multiFireMode && aisbld.def.multiFireMode==2)
		{
			instance.attackType=bld.fireMode;
		}
		if(aisbld.name=="AmmoGun")
		{
			instance.ammo=bld.curAmmo;
			instance.maxAmmo=bld.curAmmo;
		}
		if(bld.codeName=="ClanBld")
		{
			if(vo.storages.Clan && vo.storages.Clan.slots)
			{
				for(j in vo.storages.Clan.slots)
				{
					lv=vo.storages.Clan.slots[j].subType?parseInt(vo.storages.Clan.slots[j].subType,10)+1:1;
					instance.u.push({codename:vo.storages.Clan.slots[j].type,level:lv,num:vo.storages.Clan.slots[j].num});
				}
			}
		}
		if(bld.codeName=="Fort")
		{
			if(vo.storages.Fort && vo.storages.Fort.slots)
			{
				for(j in vo.storages.Fort.slots)
				{
					lv=vo.storages.Fort.slots[j].subType?parseInt(vo.storages.Fort.slots[j].subType,10)+1:1;
					instance.u.push({codename:vo.storages.Fort.slots[j].type,level:lv,num:vo.storages.Fort.slots[j].num});
				}
			}
		}
		if(sbf==0)city.scoreBuildingNum++;

		city.instances.push(instance);
	}
	return city;
};
window.aisCoCCity.prototype.svrCost2localCost=function(vo)
{
	var i,n,cost;
	cost={storage:[]};
	if(!vo)return cost;
	n=vo.length;
	for(i=0;i<n;i++)
	{
		if(vo[i].type=="tok1")
			cost.cash=vo[i].num;
		else if(vo[i].type=="Gem")
			cost.gem=vo[i].num;
		else if(vo[i].type=="Gold")
			cost.storage.push({store:"Gold",type:"ResGold",num:vo[i].num});
		else if(vo[i].type=="Elixir")
			cost.storage.push({store:"Oil",type:"ResOil",num:vo[i].num});
		else if(vo[i].type=="Cube")
			cost.storage.push({store:"Cube",type:"ResCube",num:vo[i].num});
		else if(vo[i].type=="tok2")
			cost.storage.push({store:"CutTime",type:"CutTime",num:vo[i].num});
		else if(vo[i].type.indexOf("plu_")!=-1)
			cost.storage.push({store:"AddOn",type:vo[i].type,num:vo[i].num});
		else if(vo[i].type.indexOf("par_")!=-1){
			cost.storage.push({store:"Part",type:vo[i].type,num:vo[i].num});
			cost.havePart=1;
		}else if(vo[i].type.indexOf("itm_")!=-1)
			cost.storage.push({store:"Item",type:vo[i].type,num:vo[i].num});
	}
	return cost;
};
window.aisCoCCity.prototype.initClanTechs=function()
{
	var i,j,def,tech,bld,m,n,buffName,list,level,lv;
	var appEnv=window.aisGame.appEnv;
	n=this.clanVO.techs.length;
	for(i=0;i<n;i++)
	{
		tech=this.clanVO.techs[i];
		this.initClanTech(tech);
	}
};
window.aisCoCCity.prototype.initClanTech=function(tech)
{
	var def,lv,level,list,buffName,j,bld;
	var appEnv=window.aisGame.appEnv;
	if(tech.status!=this.clanMsgs.CLAN_TECH_STATUS_ED)return;
	def=window.aisEnv.defLib.clanTec[tech.codename];
	lv=appEnv.getClanTechLv(tech.codename);
	level=def.levels[lv-1];
	if(!def || !level)return;
	if(level.scope=="Barrack" && level.scopeVar=="TrainingTime")
	{
		list=this["bldAllBarrack"];
		if(!list)return;
		buffName=tech.codename+lv;
		if(!window.aisEnv.defLib.buff[buffName])return;
		for(j=0;j<list.length;j++)
		{
			bld=list[j];
			bld.removeBuff(buffName);
			bld.bindBuff(buffName);
			bld.buffs[buffName].endTime=tech.expireTimes;
			bld.makeViewsDirty();
		}
	}
};
window.aisCoCCity.prototype.initClanTechsByBld=function(bld)
{
	var i,j,def,tech,bld,m,n,buffName,list,level,lv;
	var appEnv=window.aisGame.appEnv;
	if(!this.clanVO)return;
	n=this.clanVO.techs.length;
	for(i=0;i<n;i++)
	{
		tech=this.clanVO.techs[i];
		if(tech.status!=this.clanMsgs.CLAN_TECH_STATUS_ED)continue;
		def=window.aisEnv.defLib.clanTec[tech.codename];
		lv=appEnv.getClanTechLv(tech.codename);
		level=def.levels[lv-1];
		if(!def || !level)continue;
		if(level.scope=="Barrack" && level.scopeVar=="TrainingTime" && bld.def.codeName==level.scope)
		{
			buffName=tech.codename+lv;
			if(!window.aisEnv.defLib.buff[buffName])continue;
			bld.removeBuff(buffName);
			bld.bindBuff(buffName);
			bld.buffs[buffName].endTime=tech.expireTimes;
			bld.makeViewsDirty();
		}
	}
};

window.aisCoCCity.prototype.removeClanTechsBuff=function()
{
	var i,j,def,tech,bld,m,n,buffName,list,level,lv;
	var appEnv=window.aisGame.appEnv;
	if(!this.clanVO)return;
	n=this.clanVO.techs.length;
	for(i=0;i<n;i++)
	{
		tech=this.clanVO.techs[i];
		this.removeClanTechBuff(tech);
	}
};
window.aisCoCCity.prototype.removeClanTechBuff=function(tech)
{
	var def,lv,level,list,buffName,j,bld;
	var appEnv=window.aisGame.appEnv;
	if(tech.status!=this.clanMsgs.CLAN_TECH_STATUS_ED)return;
	def=window.aisEnv.defLib.clanTec[tech.codename];
	lv=appEnv.getClanTechLv(tech.codename);
	level=def.levels[lv-1];
	if(!def || !level)return;
	if(level.scope=="Barrack" && level.scopeVar=="TrainingTime")
	{
		list=this["bldAllBarrack"];
		if(!list)return;
		buffName=tech.codename+lv;
		if(!window.aisEnv.defLib.buff[buffName])return;
		for(j=0;j<list.length;j++)
		{
			bld=list[j];
			bld.removeBuff(buffName);
			bld.makeViewsDirty();
		}
	}
};

window.aisCoCCity.prototype.getClanTecReviseRate=function(bld,scope,scopeVar)
{
	if(!this.clanVO)return 1;
	var i,n,tech,def,lv,level,group;
	var appEnv=window.aisGame.appEnv;
	group=bld.def.groupId;
	if(scope!=group)return 1;
	n=this.clanVO.techs.length;
	for(i=0;i<n;i++)
	{
		tech=this.clanVO.techs[i];
		if(appEnv.getClanTechStatus(tech.codename)!=1)continue;
		def=window.aisEnv.defLib.clanTec[tech.codename];
		lv=appEnv.getClanTechLv(tech.codename);
		level=def.levels[lv-1];
		if(!def || !level)continue;
		if(level.scope==group && level.scopeVar==scopeVar)
		{
			if(scopeVar=="TrainingTime")
				return 100/level.scopeValue;
			else
				return level.scopeValue;
		}
	}
	return 1;
};
window.aisCoCCity.prototype.useClanRes=function(vo)
{
	var clanVO=this.clanVO;
	var i,stg=clanVO.storage;
	if(!stg)return;
	for(i=0;i<stg.length;i++)
	{
		if(vo.type==stg[i].type)
		{
			stg[i].num-=vo.num;
			return;
		}
	}
};

}
