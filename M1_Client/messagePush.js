
/* 消息推送*/

	if(!__Page.messagePush){
		__Page.messagePush = function(page)
		{
			this.page = page;
			/* 造兵列表满 */
			this.trainFullList = [];
			/* 升级列表 */
			this.upgradeList = [];
			/* 训练兵完成列表 */
			this.trainFinishList = [];
			/* 科技列表 */
			this.techList = [];
			/* 钻石矿产钻列表 */
			this.diamondList=[];
			/* 开关 */
			this.isOpen= true;
			/* 允许时间误差 */
			this.timeOffset= 0;
			this.tempMax=[{},{},{},{},{},{},{},{}];
			this.removeAllPush();
			this.fo = [];
		}
		__Page.messagePush.prototype.setTimeOffset = function(time)
		{
			this.timeOffset=time;
		}
		/* 添加消息推送 */
		__Page.messagePush.prototype.addPushList = function(TempCodeName,type,leftTime1,tip)//建筑codeName，类型（建造，升级，收矿，人口）。完成剩余时间
		{
			 DBOut("***addPushList:"+TempCodeName+" time="+leftTime1);
			var temTime = this.getNowTime();
			var leftTime = temTime+leftTime1;
			var k =0;
			switch(type)
			{
				case 0://造兵列表满
					k=0;
					for(var i=0; i<this.trainFullList.length;i++)
					{
						if(this.trainFullList[i].codeName==TempCodeName)
						{
							this.trainFullList[i].leftTime = leftTime1;
							this.trainFullList[i].time = leftTime;
							this.trainFullList[i].type = 0;
							this.trainFullList[i].tip=tip;
							k=1;
							break;
						}
					}
					if(!k)this.trainFullList.push({codeName:TempCodeName,time:leftTime,leftTime:leftTime1,type:0,tip:tip});
					break;
				case 1://升级
					k=0;
					for(var i=0; i<this.upgradeList.length;i++)
					{
						if(this.upgradeList[i].codeName==TempCodeName)
						{
							this.upgradeList[i].leftTime = leftTime1;
							this.upgradeList[i].time = leftTime;
							this.upgradeList[i].type = 1;
							this.upgradeList[i].tip=tip;
							k=1;
							break;
						}
					}
					if(!k)this.upgradeList.push({codeName:TempCodeName,time:leftTime,leftTime:leftTime1,type:1,tip:tip});
					break;
				case 2://训练完成
					k=0;
					for(var i=0; i<this.trainFinishList.length;i++)
					{
						if(this.trainFinishList[i].codeName==TempCodeName)
						{
							this.trainFinishList[i].leftTime = leftTime1;
							this.trainFinishList[i].time = leftTime;
							this.trainFinishList[i].type = 2;
							this.trainFinishList[i].tip=tip;
							k=1;
							break;
						}
					}
					if(!k)this.trainFinishList.push({codeName:TempCodeName,time:leftTime,leftTime:leftTime1,type:2,tip:tip});

					break;
				case 3://科技
					k=0;
					for(var i=0; i<this.techList.length;i++){
						if(this.techList[i].codeName==TempCodeName)
						{
							this.techList[i].leftTime = leftTime1;
							this.techList[i].time = leftTime;
							this.techList[i].type = 3;
							k=1;
							break;
						}
					}
					if(!k)this.techList.push({codeName:TempCodeName,time:leftTime,leftTime:leftTime1,type:3,tip:tip});
					break;
				case 4:
					this.addPush({codeName:TempCodeName,time:leftTime,type:4,leftTime:leftTime1,tip:tip});
					break;
				case 5:
					this.addPush({codeName:TempCodeName,time:leftTime,type:5,leftTime:leftTime1,tip:tip});
					break;
				case 6:
					this.addPush({codeName:TempCodeName,time:leftTime,type:6,leftTime:leftTime1,tip:tip});
					break;
				case 7://钻石矿
					k=0;
					for(var i=0; i<this.diamondList.length;i++){
						if(this.diamondList[i].codeName==TempCodeName)
						{
							this.diamondList[i].leftTime = leftTime1;
							this.diamondList[i].time = leftTime;
							this.diamondList[i].type = 7;
							k=1;
							break;
						}
					}
					if(!k)this.diamondList.push({codeName:TempCodeName,time:leftTime,leftTime:leftTime1,type:7,tip:tip});
					break;
				default:
					break;
			}
			this.autoFindNew(type,temTime);
		}
		/* 删除消息推送 */
		__Page.messagePush.prototype.removePushList = function(TempCodeName,type/* ,leftTime */)//建筑codeName，类型（建造，升级，收矿，人口）。完成剩余时间
		{
		 DBOut("**removePushList*:"+TempCodeName);
			switch(type)
			{
				case 0://造兵列表满
					if(this.trainFullList.length>=1){
						for(var i=0; i<this.trainFullList.length;i++)
							if(this.trainFullList[i].codeName==TempCodeName)
								this.trainFullList.splice(i,1)
					}
					break;
				case 1://升级
					if(this.upgradeList.length>=1){
						for(var i=0; i<this.upgradeList.length;i++)
							if(this.upgradeList[i].codeName==TempCodeName)
								{this.upgradeList.splice(i,1);break;}
					}
					break;
				case 2://训练完成
					if(this.trainFinishList.length>=1){
						for(var i=0; i<this.trainFinishList.length;i++)
							if(this.trainFinishList[i].codeName==TempCodeName)
								{this.trainFinishList.splice(i,1);break;}
					}
					break;
				case 3://科技
					if(this.techList.length>=1){
						for(var i=0; i<this.techList.length;i++)
							if(this.techList[i].codeName==TempCodeName)
								{this.techList.splice(i,1);break;}
					}
					break;
				case 7://钻石矿
					if(this.diamondList.length>=1){
						for(var i=0; i<this.diamondList.length;i++)
							if(this.diamondList[i].codeName==TempCodeName)
								{this.diamondList.splice(i,1);break;}
					}
					break;
				default:
					break;
			}
			var temTime = this.getNowTime();
			this.autoFindNew(type,temTime);
		}
		/* 设置开关 */
		__Page.messagePush.prototype.setting = function(type)
		{
			this.isOpen = type;
		}
		/* 自动从新找出更改之后 新的push  */
		__Page.messagePush.prototype.autoFindNew = function(type,nowTime)
		{
			if(this.tempMax[type])
				this.removePush(this.tempMax[type]);
			switch(type)
			{
				case 0://造兵列表满
					if(this.trainFullList.length>0){
						for(var i=1; i<this.trainFullList.length;i++)
						{
							this.tempMax[type].codeName =  this.trainFullList[0].codeName;
							this.tempMax[type].time =  this.trainFullList[0].time;
							this.tempMax[type].type =  this.trainFullList[0].type;
							this.tempMax[type].leftTime =  this.trainFullList[0].leftTime;
							this.tempMax[type].tip =  this.trainFullList[0].tip;

							if(!this.trainFullList[i])return;
							if(nowTime>this.trainFullList[i].time)
							{
								this.trainFullList.splice(i,1);
								i--;
								continue;
							}
							if(this.trainFullList[i].time>(this.trainFullList[i-1].time+this.timeOffset))
							{
								this.tempMax[type].codeName =  this.trainFullList[i].codeName;
								this.tempMax[type].time =  this.trainFullList[i].time;
								this.tempMax[type].type =  this.trainFullList[i].type;
								this.tempMax[type].leftTime =  this.trainFullList[i].leftTime;
								this.tempMax[type].tip =  this.trainFullList[i].tip;
							}
						}
					}
					else  this.tempMax[type]=null;
					break;
				case 1://升级 //建造合并
					if(this.upgradeList.length>0)
					{
						this.tempMax[type].codeName =  this.upgradeList[0].codeName;
						this.tempMax[type].time =  this.upgradeList[0].time;
						this.tempMax[type].type =  this.upgradeList[0].type;
						this.tempMax[type].leftTime =  this.upgradeList[0].leftTime;
						this.tempMax[type].tip =  this.upgradeList[0].tip;
						for(var i=1; i<this.upgradeList.length;i++)
						{
							if(!this.upgradeList[i])return;
							if(nowTime>this.upgradeList[i].time)
							{
								this.upgradeList.splice(i,1);
								i--;
								continue;
							}
							if(this.upgradeList[i].time>(this.upgradeList[i-1].time+this.timeOffset))
							{
								this.tempMax[type].codeName =  this.upgradeList[i].codeName;
								this.tempMax[type].time =  this.upgradeList[i].time;
								this.tempMax[type].type =  this.upgradeList[i].type;
								this.tempMax[type].leftTime =  this.upgradeList[i].leftTime;
								this.tempMax[type].tip =  this.upgradeList[i].tip;
							}
						}
					}
					else  this.tempMax[type]=null;
					// DBOut("***upgradeList:"+toJSON(this.upgradeList));
					break;
				case 2://训练兵完成
				// DBOut("**1trainFinishList:"+toJSON(this.trainFinishList));
					if(this.trainFinishList.length>0){
						this.tempMax[type].codeName =  this.trainFinishList[0].codeName;
						this.tempMax[type].time =  this.trainFinishList[0].time;
						this.tempMax[type].type =  this.trainFinishList[0].type;
						this.tempMax[type].leftTime =  this.trainFinishList[0].leftTime;
						this.tempMax[type].tip =  this.trainFinishList[0].tip;
						for(var i=1; i<this.trainFinishList.length;i++)
						{
							if(!this.trainFinishList[i])return;
							if(nowTime>this.trainFinishList[i].time)
							{
								this.trainFinishList.splice(i,1);
								i--;
								continue;
							}

							if(this.trainFinishList[i].time>(this.trainFinishList[i-1].time+this.timeOffset))
							{
								this.tempMax[type].codeName =  this.trainFinishList[i].codeName;
								this.tempMax[type].time =  this.trainFinishList[i].time;
								this.tempMax[type].type =  this.trainFinishList[i].type;
								this.tempMax[type].leftTime =  this.trainFinishList[i].leftTime;
								this.tempMax[type].tip =  this.trainFinishList[i].tip;
							}
						}
					}
					else  this.tempMax[type]=null;
					// DBOut("***trainFinishList:"+toJSON(this.trainFinishList));
					break;
				case 3://科技
					if(this.techList.length>0){
						this.tempMax[type].codeName =  this.techList[0].codeName;
						this.tempMax[type].time =  this.techList[0].time;
						this.tempMax[type].type =  this.techList[0].type;
						this.tempMax[type].leftTime =  this.techList[0].leftTime;
						this.tempMax[type].tip =  this.techList[0].tip;
						for(var i=1; i<this.techList.length;i++)
						{
							if(!this.techList[i])return;
							if(nowTime>this.techList[i].time)
							{
								this.techList.splice(i,1);
								i--;
								continue;
							}
							if(this.techList[i].time>(this.techList[i-1].time+this.timeOffset))
							{
								this.tempMax[type].codeName =  this.techList[i].codeName;
								this.tempMax[type].time =  this.techList[i].time;
								this.tempMax[type].type =  this.techList[i].type;
								this.tempMax[type].leftTime =  this.techList[i].leftTime;
								this.tempMax[type].tip =  this.techList[i].tip;
							}
						}
					}
					else  this.tempMax[type]=null;
					// DBOut("***techList:"+toJSON(this.techList));
					break;
				case 7://钻石矿
					if(this.diamondList.length>0){
						this.tempMax[type].codeName =  this.diamondList[0].codeName;
						this.tempMax[type].time =  this.diamondList[0].time;
						this.tempMax[type].type =  this.diamondList[0].type;
						this.tempMax[type].leftTime =  this.diamondList[0].leftTime;
						this.tempMax[type].tip =  this.diamondList[0].tip;
						for(var i=1; i<this.diamondList.length;i++)
						{
							if(!this.diamondList[i])return;
							if(nowTime>this.diamondList[i].time)
							{
								this.diamondList.splice(i,1);
								i--;
								continue;
							}
							if(this.diamondList[i].time>(this.diamondList[i-1].time+this.timeOffset))
							{
								this.tempMax[type].codeName =  this.diamondList[i].codeName;
								this.tempMax[type].time =  this.diamondList[i].time;
								this.tempMax[type].type =  this.diamondList[i].type;
								this.tempMax[type].leftTime =  this.diamondList[i].leftTime;
								this.tempMax[type].tip =  this.diamondList[i].tip;
							}
						}
					}
					else  this.tempMax[type]=null;
					// DBOut("***diamondList:"+toJSON(this.diamondList));
					break;
				default:
					break;
			}
			this.addPush(this.tempMax[type]);
			if(this.tempMax[type]==null)this.tempMax[type]={};
		}
		/* 添加消息推送 */
		__Page.messagePush.prototype.addPush = function(obj)
		{
			// DBOut("***:**-------"+toJSON(obj));
			if(!this.isOpen)return;
			if(!obj)return;
			// DBOut("***:*obj.codeName-:"+obj.codeName);
			// DBOut("***:///");
			var interval =obj.leftTime;
			var textLib = this.page.appEnv.textLib;
			var strTip= "";
			if(obj.type==0)strTip = textLib.PushMsgTrainFull;
			else if(obj.type==1)strTip = textLib.PushMsgBuild;
			else if(obj.type==2)strTip = textLib.PushMsgTrainFinish;
			else if(obj.type==3)strTip = textLib.PushMsgTech;
			else if(obj.type==4)strTip = textLib.PushMsgOneDay;
			else if(obj.type==5)strTip = textLib.PushMsgThreeDay;
			else if(obj.type==6)strTip = textLib.PushMsgShield;
			else if(obj.type==7)strTip = textLib.PushMsgDiamond;
			else strTip = "hello!";
			if(obj.tip)
				strTip=obj.tip
			if(interval>0)DBOut("***:"+interval+"type"+obj.type);
			if(typeof PushService=="undefined")return;
			PushService.startTrace(null,null);
			PushService.setBadgeCount(0);
			if(interval>0)
				PushService.scheduleLocal({interval:interval,message:strTip,action:strTip,
				todokey:obj.codeName,userdata:"",badge:1});
			//提前10s 吧已经到时的消息去掉
			//if(this.fo[obj.type]){clearTimeout(this.fo[obj.type]);this.fo[obj.type] = null;}
			//var temp =obj.time-this.getNowTime()-this.timeOffset*1000;
			//DBOut("temp="+temp);
			//if(temp<0)temp =0;
			//	this.fo[obj.type] = setTimeout(temp,function(){this.removePushList(obj.codeName,obj.type);this.fo[obj.type] = null;} ,this);

		};
		/* 删除某个消息推送 */
		__Page.messagePush.prototype.removePush = function(obj)
		{
			// DBOut("**removePush*:"+obj.codeName);
			if(typeof PushService=="undefined")return;
			PushService.cancelLocal(obj.codeName);
			if(this.fo[obj.type]){clearTimeout(this.fo[obj.type]);this.fo[obj.type] = null;}
		};
		/* 删除全部消息推送 */
		__Page.messagePush.prototype.removeAllPush = function()
		{
			DBOut("**removeAllPush*:");
			if(typeof PushService=="undefined")return;
			PushService.cancelAllLocal();
		};
		__Page.messagePush.prototype.getNowTime= function()
		{
			return new Date().getTime();//当前time
        }
		__Page.messagePush.prototype.setOption= function(str)
		{
		DBOut("***:------setOption-----"+str);
			this.isOpen = str;
			if(!this.isOpen){
				this.removeAllPush();
				if(this.fo[0]){clearTimeout(this.fo[0]);this.fo[0] = null;}
				if(this.fo[1]){clearTimeout(this.fo[1]);this.fo[1] = null;}
				if(this.fo[2]){clearTimeout(this.fo[2]);this.fo[2] = null;}
				if(this.fo[3]){clearTimeout(this.fo[3]);this.fo[3] = null;}
			}
			else{
			//从新加载消息
				this.autoFindNew2(this.upgradeList,1);
				this.autoFindNew2(this.trainFinishList,2);
				this.autoFindNew2(this.techList,3);
				/*1天 3天消息推送  初始化添加*/
				this.addPushList("oneDay",4,24*60*60);
				this.addPushList("threeDay",5,72*60*60);
				this.addPushList("shieldOut",6,72*60*60);//需要修改
				this.autoFindNew2(this.diamondList,7);
			}
		}
		__Page.messagePush.prototype.getOption= function()
		{
			return this.isOpen;
		}
		__Page.messagePush.prototype.autoFindNew2 = function(list,type)
		{
			if(this.tempMax[type])
				this.removePush(this.tempMax[type]);
			if(list.length>1){
						this.tempMax[type].codeName =  list[0].codeName;
						this.tempMax[type].time =  list[0].time;
						this.tempMax[type].type =  list[0].type;
						this.tempMax[type].leftTime =  list[0].leftTime;
						for(var i=1; i<list.length;i++)
							{
								if(!list[i])return;
								if(this.getNowTime()>list[i].time)
									{list.splice(i,1);continue}
								if(list[i].time>(list[i-1].time+this.timeOffset))
								{
									this.tempMax[type].codeName =  list[i].codeName;
									this.tempMax[type].time =  list[i].time;
									this.tempMax[type].type =  list[i].type;
									this.tempMax[type].leftTime =  list[i].leftTime;
								}
							}
					}
					else if(list.length==1)
					{
						this.tempMax[type].codeName =  list[0].codeName;
						this.tempMax[type].time =  list[0].time;
						this.tempMax[type].type =  list[0].type;
						this.tempMax[type].leftTime =  list[0].leftTime;
					}
					else  this.tempMax[type]=null;
			this.addPush(this.tempMax[type]);
			if(this.tempMax[type]==null)this.tempMax[type]={};
		}
	}
	window.MP  = new __Page.messagePush(__Page);