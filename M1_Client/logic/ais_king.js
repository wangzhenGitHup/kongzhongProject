if(!window.aisKing)
{
window.aisKing=function(env,isClient)
{
	var date;
	if(env)
	{
		window.aisObj.call(this,env);
		this.name="King";
		this.type="King";
		this.isClient=isClient;
		this.king=this;
		this.userName="NewUser";
		this.gemNum=0;
		this.cashNum=0;
		this.gemCharged=0;
		this.gemSpend=0;
		this.listeners=[];
		this.citys=[];
		this.triggerTime=0;
		this.lastUpdate=0;
		this.debugTimeGap=0;
		this.curUpdateTime=0;
		this.nowTime=0;
		this.bufs=[];
		this.items=[];
		this.modifers=[];
		this.features=[];
		this.tasks=[];
		this.pushMsgIdx=0;
		this.pushMsgs=[];
		this.vsbTechs={};
		this.vsbMfcs={};
		this.vsbBlds={};
		window.aisTypes.applyType(this,window.aisTypes.aisObjHashOwner);
		window.aisTypes.applyType(this,window.aisTypes.aisValueOwner);
		window.aisTypes.applyType(this,window.aisTypes.aisBuffOwner);
		window.aisTypes.applyType(this,window.aisTypes.opFactorOwner);
		window.aisTypes.applyType(this,window.aisTypes.aisFeatureOwner);
		window.aisTypes.applyType(this,window.aisTypes.aisTechOwner);
		window.aisTypes.applyType(this,window.aisTypes.aisViewConnect);
		this.addHashObj(this);
		this.achvmnts=new aisTypes.aisAchvmnts(env,this);
		this.dailytasks=new aisTypes.aisDailyTasks(env,this);
	}
};

window.aisKing.prototype=new aisObj();
window.aisKing.ERR_NoCmd={level:100,error:"Command not found in command-obj.","class":"aisKing",code:"ERR_NoCmd"};
window.aisKing.ERR_ObjNotHashed={level:100,error:"Command not found in command-obj.","class":"aisKing",code:"ERR_ObjNotHashed"};

//---------------------------------------------------------------------------
window.aisKing.newInstance=function(env,isClient)
{
	return new aisKing(env,isClient);
};

//---------------------------------------------------------------------------
//TODO: 把这个函数移走
window.aisKing.prototype.initNewKing=function(cityVO)
{
	var city,time;

	time=this.env.dateTime();
	this.createTime=time;
	city=this.newCityInstance();
	DBOut("Will read new city, createTime: "+this.createTime);
	cityVO.createTime=time;
	this.gemNum=50;
	city.readFmVO(this,cityVO);
	this.citys.push(city);
	this.addHashObj(city);
	this.updateStatic();

	//增加初始能看到的科技、建筑和制品
	this.vsbTechs["tchSolar"]=1;
	//this.vsbTechs["tchHe3"]=1;
	this.updateStatic();
	DBOut("New king created!!");
};

//---------------------------------------------------------------------------
//创建一个针对游戏的城市对象实例, 具体游戏实现需要重载这个函数
window.aisKing.prototype.newCityInstance=function()
{
	return new aisCity(this.env,this);
};

//---------------------------------------------------------------------------
//对象I/O相关的函数----------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	//保存King信息
	window.aisKing.prototype.readFmVO=function(voObj,resume,pauseUpdate)
	{
		var i,n,list,dlist;
		DBOut(">>>>>>>>>aisKing.readFmVO");
		aisObj.prototype.readFmVO.call(this,voObj);
		DBOut("aisKing.readFmVO1");
		this.name=voObj.name;
		this.gemNum=voObj.gemNum;
		this.cashNum=voObj.cashNum;
		this.userName=voObj.userName;
		this.lastUpdate=voObj.lastUpdate;
		this.triggerTime=voObj.triggerTime;
		this.debugTimeGap=voObj.debugTimeGap?voObj.debugTimeGap:0;
		this.debugTime=voObj.debugTime;

		//读出Hash
		this.readObjHash(voObj);

		this.loadBuffs(this,voObj);
		this.loadTechs(voObj);

		DBOut("aisKing.readFmVO2");
		list=voObj.citys;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.citys[i]=this.newCityInstance();
			this.citys[i].readFmVO(this,list[i]);
			this.addHashObj(this.citys[i]);
		}
		DBOut("aisKing.readFmVO3");
		//this.readBuffs(voObj);
		DBOut("aisKing.readFmVO4");
		//this.readPushMsgs(voObj);

		this.achvmnts.loadAchvmnts(voObj);
		this.dailytasks.loadAchvmnts(voObj);


		//读取三个可见性列表:
		this.vsbBlds={};
		dlist=this.vsbBlds;
		list=voObj.vsbBlds;
		for(i in list)
		{
			dlist[i]=list[i];
		}

		this.vsbTechs={};
		dlist=this.vsbTechs;
		list=voObj.vsbTechs;
		for(i in list)
		{
			dlist[i]=list[i];
		}

		this.vsbMfcs={};
		dlist=this.vsbMfcs;
		list=voObj.vsbMfcs;
		for(i in list)
		{
			dlist[i]=list[i];
		}
		if(resume)
		{
			this.debugTimeGap-=aisEnv.dateTime()+this.debugTimeGap-this.lastUpdate;
		}
		if(!pauseUpdate)
		{
			this.miniUpdate();
		}
		DBOut("<<<<<<<<aisKing.readFmVO");
	};

	//---------------------------------------------------------------------------
	//读取King信息
	window.aisKing.prototype.saveToVO=function(voObj)
	{
		var i,n,list,dlist,vo;
		DBOut(">>>>>>>>>aisKing.saveToVO");
		aisObj.prototype.saveToVO.call(this,voObj);
		voObj.name=this.name;
		voObj.gemNum=this.gemNum;
		voObj.cashNum=this.cashNum;
		voObj.userName=this.userName;
		voObj.lastUpdate=this.lastUpdate;
		voObj.triggerTime=this.triggerTime;
		voObj.debugTimeGap=this.debugTimeGap;
		voObj.debugTime=this.debugTime;
		//读出Hash
		this.saveObjHash(voObj);

		this.saveTechs(voObj);

		list=this.citys;
		voObj.citys=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			vo={};
			list[i].saveToVO(this,vo);
			voObj.citys[i]=vo;
		}
		this.saveBuffs(this,voObj);
		this.savePushMsgs(voObj);

		this.achvmnts.saveAchvmnts(voObj);
		this.dailytasks.saveAchvmnts(voObj);


		//存储三个可见性列表:
		voObj.vsbBlds={};
		dlist=voObj.vsbBlds;
		list=this.vsbBlds;
		for(i in list)
		{
			dlist[i]=list[i];
		}

		voObj.vsbTechs={};
		dlist=voObj.vsbTechs;
		list=this.vsbTechs;
		for(i in list)
		{
			dlist[i]=list[i];
		}

		voObj.vsbMfcs={};
		dlist=voObj.vsbMfcs;
		list=this.vsbMfcs;
		for(i in list)
		{
			dlist[i]=list[i];
		}
		DBOut("<<<<<<<<<<aisKing.saveToVO");
	};
}

//---------------------------------------------------------------------------
//时间、更新相关的函数-------------------------------------------------------
//---------------------------------------------------------------------------
{
	//---------------------------------------------------------------------------
	window.aisKing.prototype.kingTime=function()
	{
		return this.nowTime;
	};

	//---------------------------------------------------------------------------
	//设置非线性更新节点
	window.aisKing.prototype.setTriggerTime=function(time)
	{
		//DBOut("aisKing.setTriggerTime: "+time+" vs "+this.triggerTime);
		if(time<this.triggerTime || !this.triggerTime)
		{
			if(time>this.lastUpdate && (time>this.curUpdateTime || !this.curUpdateTime))
			{
				this.triggerTime=time;
			}
		}
	};

	//---------------------------------------------------------------------------
	//更新全部静态参数
	window.aisKing.prototype.updateStatic=function()
	{
		var i,n,list;
		this.updateHash();
		this.updateOpFactors();
		this.updateValues();
		list=this.citys;
		n=list.length;
		for(i=0;i<n;i++)
		{
			list[i].updateStatic();
		}
	};

	//---------------------------------------------------------------------------
	//根据时间更新整个King
	window.aisKing.prototype.update=function(nowTime,sub)
	{
		var i,n,list,gap,triggerTime;
		if(!sub)
			nowTime+=this.debugTimeGap;
		this.curUpdateTime=nowTime;
		//DBOut("Solve trigger, time: "+nowTime+" vs "+this.triggerTime+", last: "+this.lastUpdate);
		while(this.triggerTime && this.triggerTime<nowTime)
		{
			//DBOut("Run a trigger time!!");
			triggerTime=this.triggerTime;
			this.triggerTime=0;
			this.update(triggerTime,1);
		}
		this.nowTime=nowTime;
		if(this.lastUpdate)
		{
			gap=nowTime-this.lastUpdate;
		}
		else
		{
			gap=0;
		}
		//DBOut("King update, time gap: "+gap);
		this.updateStatic();
		//DBOut("King update static done");
		this.lastUpdate=nowTime;
		list=this.citys;
		n=list.length;
		for(i=0;i<n;i++)
		{
			list[i].updateByKing(this,nowTime,gap);
		}
		this.updateBuffs(this,nowTime,gap);
		if(!sub)
		{
			//通知监听对象
			list=this.listeners;
			n=list.length;
			for(i=0;i<n;i++)
			{
				list[i].onKingUpdate();
			}
		}
		//DBOut("King update done");
	};
}


//---------------------------------------------------------------------------
//计算加速需要钻石数的函数
window.aisKing.prototype.convertTime2Gem=function(time)
{
	var def=window.aisEnv.defLib.globals;
	var gemNum;
	time/=1000;
//	gemNum=Math.floor(time*def["GEM_PER_SEC"]);
//	gemNum=(gemNum<=0)?1:gemNum;
//	return gemNum;

	var sec=60;
	if(!time || time<0){
		gemNum=0;
	}else if(time<=60){
		gemNum=def["SPEED_UP_DIAMOND_COST_60_SECOND"];
	}else if(time<=3600){
		gemNum=def["SPEED_UP_DIAMOND_COST_60_SECOND"]+Math.round((time-60)/def["SPEED_UP_DIAMOND_DIVISOR_60_SECOND"]/sec);
	}else if(time<=86400){
		gemNum=def["SPEED_UP_DIAMOND_COST_3600_SECOND"]+Math.round((time-3600)/def["SPEED_UP_DIAMOND_DIVISOR_3600_SECOND"]/sec);
	}else if(time<=604800){
		gemNum=def["SPEED_UP_DIAMOND_COST_86400_SECOND"]+Math.round((time-86400)/def["SPEED_UP_DIAMOND_DIVISOR_86400_SECOND"]/sec);
	}else{
		gemNum=def["SPEED_UP_DIAMOND_COST_604800_SECOND"]+Math.round((time-604800)/def["SPEED_UP_DIAMOND_DIVISOR_604800_SECOND"]/sec);
	}
	gemNum=(gemNum<=0)?1:gemNum;
	return gemNum;
};

//---------------------------------------------------------------------------
//计算买资源需要钻石数的函数
window.aisKing.prototype.convertRes2Gem=function(res)
{
	var def=window.aisEnv.defLib.globals;
	var gemNum;
	if(!res || res<0){
		gemNum=0;
	}else if(res<=100){
		gemNum=def["RESOURCE_DIAMOND_COST_100"];
	}else if(res<=1000){
		gemNum=def["RESOURCE_DIAMOND_COST_100"]+Math.round((res-100)/def["RESOURCE_DIAMOND_DIVISOR_100"]);
	}else if(res<=10000){
		gemNum=def["RESOURCE_DIAMOND_COST_1000"]+Math.round((res-1000)/def["RESOURCE_DIAMOND_DIVISOR_1000"]);
	}else if(res<=100000){
		gemNum=def["RESOURCE_DIAMOND_COST_10000"]+Math.round((res-10000)/def["RESOURCE_DIAMOND_DIVISOR_10000"]);
	}else if(res<=1000000){
		gemNum=def["RESOURCE_DIAMOND_COST_100000"]+Math.round((res-100000)/def["RESOURCE_DIAMOND_DIVISOR_100000"]);
	}else if(res<=10000000){
		gemNum=def["RESOURCE_DIAMOND_COST_1000000"]+Math.round((res-1000000)/def["RESOURCE_DIAMOND_DIVISOR_1000000"]);
	}else{
		gemNum=def["RESOURCE_DIAMOND_COST_10000000"]+Math.round((res-10000000)/def["RESOURCE_DIAMOND_DIVISOR_10000000"]);
	}
	gemNum=(gemNum<=0)?1:gemNum;
	return gemNum;
};

//---------------------------------------------------------------------------
//计算买gold需要钻石数的函数
window.aisKing.prototype.convertGodl2Gem=window.aisKing.prototype.convertRes2Gem;

//---------------------------------------------------------------------------
//计算买oil需要钻石数的函数
window.aisKing.prototype.convertOil2Gem=window.aisKing.prototype.convertRes2Gem;

//---------------------------------------------------------------------------
//计算买黑水需要钻石数的函数
window.aisKing.prototype.convertToken2Gem=function(token)
{
	var def=window.aisEnv.defLib.globals;
	var gemNum;
	if(!token || token<0){
		gemNum=0;
	}else if(token<=1){
		gemNum=def["CUBE_DIAMOND_COST_1"];
	}else if(token<10){
		gemNum=def["CUBE_DIAMOND_COST_1"]+Math.round((token-1)/def["CUBE_DIAMOND_DIVISOR_1"]);
	}else if(token<100){
		gemNum=def["CUBE_DIAMOND_COST_10"]+Math.round((token-10)/def["CUBE_DIAMOND_DIVISOR_10"]);
	}else if(token<1000){
		gemNum=def["CUBE_DIAMOND_COST_100"]+Math.round((token-100)/def["CUBE_DIAMOND_DIVISOR_100"]);
	}else if(token<10000){
		gemNum=def["CUBE_DIAMOND_COST_1000"]+Math.round((token-1000)/def["CUBE_DIAMOND_DIVISOR_1000"]);
	}else if(token<100000){
		gemNum=def["CUBE_DIAMOND_COST_10000"]+Math.round((token-10000)/def["CUBE_DIAMOND_DIVISOR_10000"]);
	}else{
		gemNum=def["CUBE_DIAMOND_COST_100000"]+Math.round((token-100000)/def["CUBE_DIAMOND_DIVISOR_100000"]);
	}
	gemNum=(gemNum<=0)?1:gemNum;
	return gemNum;
};

//---------------------------------------------------------------------------
//计算买cube需要钻石数的函数
window.aisKing.prototype.convertCube2Gem=window.aisKing.prototype.convertToken2Gem;

//---------------------------------------------------------------------------
//执行一个“小的”Update操作，考虑是否让服务器知道
window.aisKing.prototype.miniUpdate=function()
{
	var nowTime;
	nowTime=this.env.dateTime();
	this.update(nowTime);
	this.env.updateViews();
};

//---------------------------------------------------------------------------
//执行一个操作，如果是客户端模式，则发起一个向服务器的远程调用
window.aisKing.prototype.execCmd=function(comObj,com,comVO,caller,comTime)
{
	var func,ret;
	var nowTime;
	var i,n,list;
	//DBOut("aisKing.execCmd("+comObj+"["+comObj.hashId+"], "+com+", "+toJSON(comVO)+", "+caller+"["+caller.hashId+"]);");
	if(!comObj.hashId|| (!comObj.hashOwner) || (comObj.hashOwner!=this) )
	{
		DBOut("aisKing.execCommand Error1 :"+com);
		throw aisKing.ERR_ObjNotHashed;
	}
	func=comObj["com_"+com];
	if(!func)
	{
		DBOut("aisKing.execCommand Error2 :"+com);
		throw aisKing.ERR_NoCmd;
	}
	comVO.comNTsended=0;
	//DBOut("Func: "+func);
	if(comTime)
	{
		nowTime=comTime;
	}
	else
	{
		nowTime=this.env.dateTime();
	}
	this.update(nowTime);
	ret=func.call(comObj,comVO,caller);
	//DBOut("execCmd: func done.");
	this.update(nowTime);

	if((!comVO.comNTsended) && this.isClient && window.aisNTEngine)
	{
		aisNTEngine.execCmd(comObj,com,comVO,caller,this.nowTime);
	}
	if(this.achvmnts)
	{
		this.achvmnts.onExecCom(comObj,com,comVO);
	}
	if(this.dailytasks)
	{
		this.dailytasks.onExecCom(comObj,com,comVO);
	}
	//通知监听对象
	list=this.listeners;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].onKingExecCom(comObj,com,comVO,caller);
	}
	//DBOut("execCmd: done.");
	this.env.updateViews();
	return ret;
};

//---------------------------------------------------------------------------
//将消息提交到服务器
window.aisKing.prototype.sendNTCmd=function(comObj,com,comVO,caller)
{
	if(this.isClient && window.aisNTEngine)
	{
		aisNTEngine.execCmd(comObj,com,comVO,caller,this.nowTime);
		comVO.comNTsended=1;
	}
};

//---------------------------------------------------------------------------
//执行一个虚拟操作,只是通知服务器:
window.aisKing.prototype.execFakeCmd=function(comObj,com,comVO,caller)
{
	var i,n,list;
	if(this.achvmnts)
	{
		this.achvmnts.onExecCom(comObj,com,comVO);
	}
	if(this.dailytasks)
	{
		this.dailytasks.onExecCom(comObj,com,comVO);
	}
	if(window.aisNTEngine)//客户端模式下, 向服务器发送这个消息
	{
		aisNTEngine.execFakeCmd(comObj,com,comVO,caller,this.nowTime);
	}
	//通知监听对象
	list=this.listeners;
	n=list.length;
	for(i=0;i<n;i++)
	{
		list[i].onKingExecCom(comObj,com,comVO,caller);
	}
};

//---------------------------------------------------------------------------
//检查当前的所有任务，有没有可以完成的
window.aisKing.prototype.checkQuests=function()
{
	//TODO: go through all quest, check if any is completed?
};

//---------------------------------------------------------------------------
//增加一个监听对象
window.aisKing.prototype.addListener=function(listener)
{
	var i,n,list;
	list=this.listeners;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(list[i]==listener)
			return;
	}
	list.push(listener);
};

//---------------------------------------------------------------------------
//删除一个监听对象
window.aisKing.prototype.removeListener=function(listener)
{
	var i,n,list;
	list=this.listeners;
	n=list.length;
	for(i=0;i<n;i++)
	{
		if(list[i]==listener)
		{
			list.splice(i,1);
			return;
		}
	}
};

//---------------------------------------------------------------------------
//命令处理消息---------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisKing.prototype.com_AddDebugTime=function(comVO)
	{
		this.debugTimeGap+=comVO.time;
		DBOut("King.debugTimeGap changed to: "+this.debugTimeGap);
	};

	window.aisKing.prototype.com_GetAvhmntBonus=function(comVO)
	{
		var achvmntName;
		DBOut("King will get achievment bonus: "+comVO.codeName);
		achvmntName=comVO.codeName;
		this.achvmnts.getBonus(achvmntName);
	};

	//---------------------------------------------------------------------------
	//增加一个
	window.aisKing.prototype.com_AddPushMsg=function(comVO)
	{
		var list,i,n,tag;
		if(!this.isClient)//只有服务器才处理这个
		{
			if(comVO.top)
			{
				tag=comVO.uniqTag;
				if(tag)//消除之前的消息
				{
					list=this.pushMsgs;
					n=list.length;
					for(i=0;i<n;i++)
					{
						if(list[i].uniqTag==tag)
						{
							comVO.seqComVO=list[i];
							list.splice(i,1);
							break;
						}
					}
				}
				this.pushMsgs.unshift(vo);
			}
			else
			{
				tag=comVO.uniqTag;
				if(tag)//消除之前的消息
				{
					list=this.pushMsgs;
					n=list.length;
					for(i=0;i<n;i++)
					{
						if(list[i].uniqTag==tag)
						{
							comVO.seqComVO=list[i];
							list.splice(i,1,comVO);
							return;
						}
					}
				}
				this.pushMsgs.push(vo);
			}
		}
	};

	//---------------------------------------------------------------------------
	//增加一个
	window.aisKing.prototype.com_DelPushMsg=function(comVO)
	{
		var i,n,list;
		if(!this.isClient)//只有服务器才处理这个
		{
			list=this.pushMsgs;
			n=list.length;
			for(i=0;i<n;i++)
			{
				if(list[i].msgIdx==comVO.msgIdx)
				{
					list.splice(i,1);
					return;
				}
				else if(!comVO.single)
				{
					list.splice(i,1);
					i--;n--;
				}
			}
		}
	}
}

//---------------------------------------------------------------------------
//PushMsg处理消息------------------------------------------------------------
//---------------------------------------------------------------------------
{
	window.aisKing.prototype.addPushMsg=function(vo)
	{
		var msgIdx;
		var list,i,n,tag;
		msgIdx=this.pushMsgIdx;
		this.pushMsgIdx++;
		vo.msgIdx=msgIdx;
		if(vo.top)
		{
			tag=vo.uniqTag;
			if(tag)//消除之前的消息
			{
				list=this.pushMsgs;
				n=list.length;
				for(i=0;i<n;i++)
				{
					if(list[i].uniqTag==tag)
					{
						vo.seqComVO=list[i];
						list.splice(i,1);
						break;
					}
				}
			}
			this.pushMsgs.unshift(vo);
		}
		else
		{
			AddMsg:
			{
				tag=vo.uniqTag;
				if(tag)//消除之前的消息
				{
					list=this.pushMsgs;
					n=list.length;
					for(i=0;i<n;i++)
					{
						if(list[i].uniqTag==tag)
						{
							vo.seqComVO=list[i];
							list.splice(i,1,vo);
							break AddMsg;
						}
					}
				}
				this.pushMsgs.push(vo);
			}
		}
		//如果有uiEnv，说明是运行在客户端，申请立刻弹出pushMsg。
		if(this.env.uiEnv)
		{
			this.env.uiEnv.signUpdate();
		}
		if(this.isClient && window.aisNTEngine)
		{
			aisNTEngine.execCmd(this,"AddPushMsg",comVO,this,this.lastUpdate);
		}
	};

	//---------------------------------------------------------------------------
	//读取最早的一条pushMsg
	window.aisKing.prototype.getPushMsg=function()
	{
		var vo;
		vo=this.pushMsgs.shift();
		while(vo)
		{
			//TODO：是否是应该和lastUpdate比较？
			if(!vo.expire || vo.expire>this.lastUpdate)
			{
				if(this.isClient && window.aisNTEngine)
				{
					aisNTEngine.execCmd(this,"DelPushMsg",{msgIdx:vo.msgIdx},this,this.lastUpdate);
				}
				return vo;
			}
			vo=this.pushMsgs.shift();
		}
		return null;
	};

	//---------------------------------------------------------------------------
	//持久化当前的pushMsg列表
	window.aisKing.prototype.savePushMsgs=function(voObj)
	{
		var list,i,n;

		voObj.pushMsgs=[];
		voObj.pushMsgIdx=this.pushMsgIdx;
		list=this.pushMsgs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			//TODO：是否是应该和lastUpdate比较？
			if(list[i].save && (!list[i].expire || list[i].expire<this.lastUpdate))
			{
				voObj.pushMsgs.push(list[i]);
			}
		}
	};

	//---------------------------------------------------------------------------
	//读取当前保存的pushMsg列表
	window.aisKing.prototype.readPushMsgs=function(voObj)
	{
		var list,i,n;
		this.pushMsgs.splice(0,this.pushMsgs.length);
		if(voObj.pushMsgIdx)
			this.pushMsgIdx=voObj.pushMsgIdx;
		list=voObj.pushMsgs;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				this.pushMsgs.push(list[i]);
			}
		}
	};

}

//---------------------------------------------------------------------------
//建筑建造、科研、物品生产可见性机制函数
//---------------------------------------------------------------------------
{
	window.aisKing.prototype.checkDefUnlockVsb=function(vsbItem)
	{
		var list,i,n,item;
		if(!vsbItem)
			return;
		//查看科技
		list=vsbItem.tech;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				item=list[i];
				if(!this.vsbTechs[item])//新增
				{
					this.vsbTechs[item]=1;
					//增加通知消息
					//DBOut("Will add push message.");
					this.addPushMsg({msg:"NewVsbTech",uniqTag:"NewTech",codeName:item});
					//测试多个消息连发
					/*this.addPushMsg({msg:"NewVsbTech",uniqTag:"NewTech",codeName:item});
					this.addPushMsg({msg:"NewVsbTech",uniqTag:"NewTech",codeName:item});
					this.addPushMsg({msg:"NewVsbTech",uniqTag:"NewTech",codeName:item});
					this.addPushMsg({msg:"NewVsbTech",uniqTag:"NewTech",codeName:item});
					this.addPushMsg({msg:"NewVsbTech",uniqTag:"NewTech",codeName:item});*/
				}
			}
		}
		//查看制品
		list=vsbItem.mfc;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				item=list[i];
				if(!this.vsbMfcs[item])//新增
				{
					this.vsbMfcs[item]=1;
					//TODO:增加通知
					this.addPushMsg({msg:"NewVsbMfc",uniqTag:"NewMfc",codeName:item});
				}
			}
		}
		//查看建筑
		list=vsbItem.bld;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				item=list[i];
				if(!this.vsbBlds[item])//新增
				{
					this.vsbBlds[item]=1;
					//TODO:增加通知
					this.addPushMsg({msg:"NewVsbBld",uniqTag:"NewBld",codeName:item});
				}
			}
		}
	};

	window.aisKing.prototype.addVsbBld=function(item)
	{
		var ret;
		ret=this.vsbBlds[item];
		this.vsbBlds[item]=1;
		return !ret;
	};

	window.aisKing.prototype.addVsbTech=function(item)
	{
		var ret;
		ret=this.vsbTechs[item];
		this.vsbTechs[item]=1;
		return !ret;
	};

	window.aisKing.prototype.addVsbMfc=function(item)
	{
		var ret;
		ret=this.vsbMfcs[item];
		this.vsbMfcs[item]=1;
		return !ret;
	};

	window.aisKing.prototype.filterVsbBlds=function(list)
	{
		var i,n;
		var rlist;
		rlist=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(this.vsbBlds[list[i].def])
			{
				rlist.push(list[i]);
			}
		}
		return rlist;
	};

	window.aisKing.prototype.filterVsbPrdcts=function(list)
	{
		var i,n;
		var rlist;
		rlist=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(this.vsbMfcs[list[i].def])
			{
				rlist.push(list[i]);
			}
		}
		return rlist;
	};

	window.aisKing.prototype.filterVsbTechs=function(list)
	{
		var i,n;
		var rlist;
		rlist=[];
		n=list.length;
		for(i=0;i<n;i++)
		{
			//DBOut("Filter tech: "+list[i].def);
			if(this.vsbTechs[list[i].def])
			{
				rlist.push(list[i]);
			}
		}
		return rlist;
	};
}
}
