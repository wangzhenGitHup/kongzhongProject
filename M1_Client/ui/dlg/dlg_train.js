if(!__Page.dlgTrain)
{
	__Page.dlgTrain=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgTrain;
	__Page.dlgTrain.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//加速按钮
		pic=imgLib.getImg("btn_green_u");
		var gemW=this.gemW=pic.w;
		var gemH=this.gemH=pic.h;
		var gemX=this.gemX=cntW-cntInner[0]-gemW/2;
		var gemY=this.gemY=cntInner[1]+gemH/2;
		var gemCSS=this.gemCSS={id:"btnGemDone",type:"icon",pos:[gemX,gemY,0],w:gemW,h:gemH,};
		//训练队列底图
		pic=imgLib.getImg("pic_queue");
		var queneX=cntInner[0];
		var queueW=cntW-cntInner[0]*2-gemW;
		var tipW=this.tipW=cntW-cntInner[0]*2;
	//	var tipH=70;

	};
	__Page.dlgTrain.init=function(appEnv)
	{
		this.name="dlgTrain";
		this.viewId="dlgTrain";
		this.slotVsn=0;
		this.rmCap=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
	//	this.dlgFrame.removeChild(this.dlgTitle);
		//对话框标题:
		this.dlgTitleEx=cssLib.textFineBig.create(this.dlgFrame,[this.titleX,this.titleY,0],"",this.titleW,this.titleH,0,1,0,1);
		//兵种标签
		var btnPic=imgLib.getImg("btn_blue_u");
		var btnW=btnPic.w, btnH=btnPic.h, x=12+btnW/2, y=this.titleY, resSize=46;
		this.tabs=["Oil","Cube"];
		this.tabBtns=[];
		this.tabKeys={};
		var i,str,hud,pic;
		for(i=0; i<this.tabs.length; i++)
		{
			x+=(6+btnW)*i;
			str=this.tabs[i];
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onTabClk);
			hud=this.dlgFrame.appendNewChild({id:"tab-"+str,css:cssLib.normalBtn.createCSS([x,y,0],keyid,2,textLib["Train"+str]),display:0,fade:1,fade_pos:[x,y,0],fade_size:1,fade_alpha:0});
			hud.appendNewChild({id:"res",type:"icon",pos:[btnW/2,0,0],w:resSize,h:resSize,anchor_h:2,anchor_v:1,css:imgLib.getIcon("Oil"==str?"res_oil":"res_cube",64)});
			hud.firstChild().setPos([-10,0,0]);
			this.tabBtns.push(hud);
			this.tabKeys[keyid+""]=this.tabKeys[str]={tab:str,key:keyid,hud:hud};
			DBOut("-- str:"+str+", key:"+keyid);
		}
		//切换建筑的按钮
		pic=imgLib.getImg("arrow_blue_left");
		btnW=60, btnH=40;
		btnW=pic.w, btnH=pic.h;
		this.storeKeys={};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSwitchStorageClk);
		x=0, y=this.boxH/2;
		this.storeBtnL=hud=this.dlgFrame.appendNewChild({id:"pre",type:"key",pos:[x,y,0],ui_event:1,anchor_h:1,anchor_v:1,w:btnW,h:btnH,key:keyid,display:0,down_scale:0.9,items:[
		//	{type:"shape",pos:[0,0,0],w:btnW,h:btnH,anchor_h:1,anchor_v:1,face_r:0,face_g:0,face_b:0,face_a:180},
		//	{css:cssLib.textFineMid.createCSS([0,0,0],"←",btnW,btnH,1,1,1,1)}
			{type:"icon",pos:[0,0,0],w:btnW,h:btnH,anchor_h:1,anchor_v:1,css:pic}
		]});
		this.storeKeys[keyid+""]={key:keyid,hud:hud,type:0};
		pic=imgLib.getImg("arrow_blue_right");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSwitchStorageClk);
		x=this.boxW, y=this.boxH/2;
		this.storeBtnR=hud=this.dlgFrame.appendNewChild({id:"next",type:"key",pos:[x,y,0],ui_event:1,anchor_h:1,anchor_v:1,w:btnW,h:btnH,key:keyid,display:0,down_scale:0.9,items:[
		//	{type:"shape",pos:[0,0,0],w:btnW,h:btnH,anchor_h:1,anchor_v:1,face_r:0,face_g:0,face_b:0,face_a:180},
		//	{css:cssLib.textFineMid.createCSS([0,0,0],"→",btnW,btnH,1,1,1,1)}
			{type:"icon",pos:[0,0,0],w:btnW,h:btnH,anchor_h:1,anchor_v:1,css:pic}
		]});
		this.storeKeys[keyid+""]={key:keyid,hud:hud,type:1};
	};

	__Page.dlgTrain.initBtns=function()
	{
		if(this._init)return;
		this._init=1;
		var appEnv=this.appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid;
		var boxw,boxh,btn,defLib,list,i,n,def,x,y,css,btnw,btnh;

		boxw=this.boxW;
		boxh=this.boxH;
		this.btnBox=appEnv.dlgBox;

		this.cntBoxEx=this.cntBox.appendNewChild({id:"move-box",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,fade:1,fade_size:1,fade_alpha:0,fade_pos:[0,0,0]});
		//底部提示框:
		this.tipBox=this.cntBoxEx.appendNewChild({
			type:"icon",id:"tipBox",pos:[10,this.contentH-80+10,0],css:imgLib.box_green,w:boxw-40,h:70-8,ui_event:1,
		//	css:cssLib.boxSolid,color_r:214,color_g:195,color_b:150
		});

		//对话框提示:
		this.dlgTip=cssLib.textFineMid.create(this.tipBox,[0,0,0],textLib["Battle Shop"],this.tipBox.getW(),70,0,0,1,1);

		//建造队列底图:
		this.picQue=this.cntBoxEx.appendNewChild({
			type:"icon",id:"picQue",pos:[0,10,0],css:cssLib.picQueue,w:boxw-20-200,h:120,color_a:200
		});

		//建造完成后兵营容量提示:
		this.capTip=cssLib.textSmall.create(this.cntBoxEx,[boxw-260,110,0],"Cap tip xxxxx",boxw-30,80,2,0,2,1,[80,80,80]);

		//时间提示小字:
		this.timeTip=cssLib.textSmall.create(this.cntBoxEx,[boxw-80,20,0],textLib["RemainTime"],150,80,2,1,1,1,[80,80,80]);//"Time to fininish"

		//时间提示大字:
	//	this.timeTipBig=cssLib.textFineBig.create(this.cntBox,[boxw-80,50,0],"30m 40s",150,80,2,1,1,1);
		this.timeTipBig=this.cntBoxEx.appendNewChild({css:cssLib.textFineBig.createCSS([boxw-80,50,0],"30m 40s",150,80,2,1,1,1),font_size:36});

		//花钻提示小字:
		this.gemTip=cssLib.textSmall.create(this.cntBoxEx,[boxw-80,80,0],textLib["FinishNow"],150,80,2,1,1,1,[80,80,80]);//"Finish now:"
		//标签按钮
		for(i=0; i<this.tabBtns.length; i++)
		{
			appEnv.hudIn(this.tabBtns[i],0);
		}

		//初始化单位按钮
		btnw=(boxw-20-240-4*150)/4+150;
		btnh=(boxh-80-240-150-150)+150;
		this.unitBtns=[];
		defLib=window.aisEnv.defLib.unit;
		list=defLib.genlUnits;
		n=list.length;
		for(i=0;i<n;i++)
		{
			def=defLib[list[i]];
			x=(i%5)*btnw;
			y=Math.floor(i/5)*btnh;
			keyid=appEnv.appKeys.bldTrainUnit_1-(i?i:0)*2;
			css=cssLib.btnTrainUnit.createCSS(def,i,120+x,240+y,keyid);
			btn=this.cntBoxEx.appendNewChild(css);
			btn.def=def;
			btn.dlg=this;
			this.unitBtns.push(btn);
			this.regKeyVO(keyid,btn,this.onUnitClk);
			this.regKeyVO(keyid-1,btn,this.onUnitInfoClk);
		}

		btnw=180;
		keyid=appEnv.appKeys.btnGemFin;
		this.btnGemDone=cssLib.btnResGo.create(this.cntBoxEx,[730,130,0],btnw*0.8,"gem",200,1,keyid,
			appEnv.getVipCapStatus("vipTrainTimeDiscount")?window.aisGame.curCity.vipLevel:0);
		this.regKeyVO(keyid,this,this.onGemClk);
		var bw=this.btnGemDone.getW()*0.8, bh=this.btnGemDone.getH()*0.8;
		this.btnGemDone.setStateStyle(0,{h:bh});
		this.btnGemDone.setStateStyle(1,{h:bh});
		this.btnGemDone.setStateStyle(2,{h:bh});
		//Init sub-states:
		this.dlgPage.dlgTrainInfo.init(appEnv);
		this.dlgPage.dlgMiniUnitInfo.init(appEnv);
	};

	__Page.dlgTrain.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;
		var list,i,n,title;
		var bld,btn;

		//根据VO初始化界面:
		this.dlgTitle.setDisplay(0);
		this.dlgTitleEx.setDisplay(1);
		this.slotVsn=-1;
		if(vo)
		{
			this.infoVO=vo;
			bld=vo.aisBld;
			title=textLib.barracksDlgTitle(bld);
			this.dlgTitleEx._setText(title);
			appEnv.setDlgAniCall(function(){
				this.initBtns();
				this.updateStorage();
			},this);
		}
		if(this.aisBld)
		{
			this.updateStorage();
		}
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
			for(var i=0; i<this.tabBtns.length; i++)
			{
				appEnv.hudIn(this.tabBtns[i],0);
			}
		}
		/*if(!this.btnFrame.getDisplay())
		{
		}*/
	};

	__Page.dlgTrain.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		this.cancelAllUpdate();
		if(nextState)
		{
			this.dlgTitle.setDisplay(1);
			this.dlgTitleEx.setDisplay(0);
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
			for(var i=0; i<this.tabBtns.length; i++)
			{
				appEnv.hudOut(this.tabBtns[i],0);
			}
			this.storeBtnL.setDisplay(0);
			this.storeBtnR.setDisplay(0);
		}
		else
		{
		}
		appEnv.clearDlgAniCall();
	};

	//切换兵营bld
	__Page.dlgTrain.updateStorage=function()
	{
	//	if(!this.curUnits)this.curUnits=window.aisEnv.defLib.unit["genlUnits"];
		if(!this.curTabInfo)
		{
			var str="Oil";
			this.curTabInfo=this.tabKeys[str];
		}
		var kvo=this.curTabInfo;
		this.onTabClk(1,kvo.key,1,-1);
		var bld=this.infoVO.aisBld;
		this.aisBld=bld;
		this.slotVsn=-1;
		bld.addUIView(this);
		if(window.aisGame.curCity["bldAll"+bld.def.codeName].length)
		{
			this.storeBtnL.setDisplay(1);
			this.storeBtnR.setDisplay(1);
		}
	};

	//切换能源训练、能量块训练
	__Page.dlgTrain.updateMakeBtn=function()
	{
		this.updateAllBtn();
	};

	//取消所有相关更新
	__Page.dlgTrain.cancelAllUpdate=function()
	{
		var appEnv=this.appEnv;
		if(this.updateTimeTimer)
		{
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
			this.updateTimeTimer=null;
		}
		if(this.holdTimer)
		{
			this.appEnv.layer.clearTimeout(this.holdTimer);
			this.holdTimer=null;
		}

		var bld,list,i,n,btn;
		bld=this.aisBld;
		bld.removeUIView(this);
		list=bld.mfcSlots;
		n=list.length;
		for(i=0;i<n;i++)
		{
			btn=null;
			if(list[i].btn)
			{
				list[i].removeUIView(list[i].btn);
				btn=list[i].btn;
			}
			list[i].btn=null;
			if(btn)
				this.cntBoxEx.removeChild(btn);
		}
	};

	__Page.dlgTrain.updateAllBtn=function()
	{
		var defLib, units, def;
		defLib=window.aisEnv.defLib.unit;
	//	units=defLib.allUnits;
		units=this.curUnits;
		//TODO: 更新按钮
		DBOut("更新所有制造单位的按钮");
		var list,i,n,btn,bld;
		list=this.unitBtns;
		n=list.length;
		bld=this.aisBld;
		for(i=0;i<n;i++)
		{
			def=defLib[units[i]];
			btn=list[i];
			btn.update(bld,def);
		}
	};

	__Page.dlgTrain.updateAllWorkTime=function()
	{
		var bld=this.aisBld;
		var time,updateTime,nowTime,taskTime,gemNum,oTime;
		if(this.updateTimeTimer){
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
			this.updateTimeTimer=null;
		}
		if(bld)
		{
			var rate=window.aisGame.curCity.getClanTecReviseRate(bld,"Barrack","TrainingTime");
			time=0;
			if(bld.workTask)
			{
				oTime=bld.workTask.getRemainTime();
				//taskTime=bld.workTask.getRemainTime();
				taskTime=bld.workTask.getRemainTimeByReviseRate(rate);
				if(bld.working==1)
				{
					updateTime=aisGame.king.lastUpdate;
					nowTime=aisEnv.dateTime();
					oTime-=(nowTime+aisGame.king.debugTimeGap)-updateTime;
					taskTime-=(nowTime+aisGame.king.debugTimeGap)-updateTime;
				}
				oTime=oTime<0?0:oTime;
				taskTime=taskTime<0?0:taskTime;
				time+=taskTime;
			}
			oTime+=(bld.slotWorkVal/bld.getValue("mfcSpeed"));
			oTime=oTime<0?0:oTime;
			//time+=(bld.slotWorkVal/bld.getValue("mfcSpeed"));
			time+=(bld.slotWorkVal*rate/bld.getValue("mfcSpeed"));
			time=time<0?0:time;
			gemNum=aisGame.king.convertTime2Gem(time);

			//计算vip打折后的消耗
		//	DBOut("vip gemNum: "+gemNum+" vs "+this.appEnv.getVipTrainGem(gemNum));
			gemNum=this.appEnv.getVipTrainGem(gemNum);

			this.timeTipBig._setText(this.appEnv.textLib.getTimeText(oTime));
			this.btnGemDone.setResNum("gem",gemNum,gemNum>aisGame.king.gemNum);
		//	DBOut("Remain Cap: "+this.rmCap);
			if(this.rmCap<0)
			{
				this.btnGemDone.setEnabled(0);
			}
			else
			{
				this.btnGemDone.setEnabled(1);
			}
		}
		this.updateTimeTimer=this.appEnv.layer.setTimeout(1000,this.updateAllWorkTime,this);
	};

	__Page.dlgTrain.aisUpdateView=function()
	{
		var list,i,n,x,y,slot,btn,keyid,title,time;
		var appEnv=this.appEnv;
		var cssLib=this.page.cssLib;
		var textLib=appEnv.textLib;
		var bld,city,allCap;

		bld=this.aisBld;
		title=textLib.barracksDlgTitle(bld);
		this.dlgTitleEx._setText(title);

		city=aisGame.curCity;
		if(!bld.working)
		{
			this.picQue.setDisplay(0);
			this.capTip.setDisplay(0);
			this.timeTip.setDisplay(0);
			this.timeTipBig.setDisplay(0);
			this.btnGemDone.setDisplay(0);
			this.gemTip.setDisplay(0);
			this.tipBox.setColor([214,195,150,255]);
			this.dlgTip._setText(textLib["TrainTip"]);
		}
		else
		{
			this.picQue.setDisplay(1);
			allCap=0;

			list=city["bldAll"+bld.def.codeName];
			n=list.length;
			for(i=0;i<n;i++)
			{
				allCap+=list[i].slotCap;
			}
			//TODO: 改成字符串表的:
		//	this.capTip.setText("Troop capapcity after trainning: "+(allCap+city.unitStorage.getValue("curLoad"))+"/"+city.unitStorage.getValue("maxLoad"));
			var cur=allCap+city.unitStorage.getValue("curLoad"), max=city.unitStorage.getValue("maxLoad");
			this.capTip.setText(textLib["RemainTroopCap"](cur,max));

			var bld=this.aisBld;
			allCap=0;
			if(bld)
			{
				allCap+=bld.slotCap;
			}
			this.rmCap=city.unitStorage.getValue("maxLoad")-(allCap+city.unitStorage.getValue("curLoad"));
			DBOut("++++maxLoad="+city.unitStorage.getValue("maxLoad")+" curLoad="+city.unitStorage.getValue("curLoad")+" allCap="+allCap);


			this.updateAllWorkTime();
			if(bld.working==4)//卡住了...
			{
				this.capTip.setDisplay(0);
				this.timeTip.setDisplay(0);
				this.timeTipBig.setDisplay(0);
				this.btnGemDone.setDisplay(0);
				this.gemTip.setDisplay(0);
				this.tipBox.setColor([200,100,100,255]);
				this.dlgTip._setText(textLib["TrainCampFull"]);
			}
			else
			{
				this.capTip.setDisplay(1);
				this.timeTip.setDisplay(1);
				this.timeTipBig.setDisplay(1);
				this.btnGemDone.setDisplay(1);
				this.gemTip.setDisplay(1);
				this.tipBox.setColor([214,195,150,255]);
				this.dlgTip._setText(textLib["TrainTip"]);
			}
		}
		if(this.slotVsn!=bld.slotVsn)
		{
			//更新上部的XXX:
			this.slotVsn=bld.slotVsn;
			list=bld.mfcSlots;
			n=list.length;
			n=n>6?6:n;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				x=this.boxW-335-i*95;
				y=70;
				btn=slot.btn;
				keyid=appEnv.appKeys.btnTraining_1+i;
				if(!btn)
				{
					//创建一个新的Btn:
					btn=cssLib.btnTraining.create(this.cntBoxEx,bld,slot,x,y,keyid);
					slot.btn=btn;
					btn.dlg=this;
				}
				btn.setKey(keyid);
				this.regKeyVO(keyid,btn,this.onSubUnitClk);
				btn.update();
				btn.startAniEx([x,y,0],1,1,0,3);
			}
			//TODO: 更新按钮
			this.updateAllBtn();
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgTrain.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgTrain.onCloseClk=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onCloseClk.call(this,msg,key,way,extra);
			if(1==msg && 1==way)
			{
				var appEnv=this.appEnv;
				var bld,list,i,n;
				bld=this.aisBld;
				{
					bld.removeUIView(this);
					list=bld.mfcSlots;
					n=list.length;
					for(i=0;i<n;i++)
					{
						if(list[i].btn)
							list[i].removeUIView(list[i].btn);
						list[i].btn=null;
					}
				}
			}
			return ret;
		};

		//按住后的重复:
		__Page.dlgTrain.onUnitHold=function()
		{
		//	this.holdTimer=null;
			this.holdBtn.holdNum+=1;
		//	if(!this.holdBtn.badToBuild)
			{
				this.timeGap-=40;
				if(this.timeGap<30)
					this.timeGap=30;
				this.holdTimer=this.appEnv.layer.setTimeout(this.timeGap,this.onUnitHold,this);
			}
			this.onUnitClk.call(this.holdBtn,1,0,1,2);
		};

		//建造按钮被点击
		__Page.dlgTrain.onUnitClk=function(msg,key,way,extra)
		{
			var self=this.dlg,def;
			var list,i,n,btn,bld,level,resBad;
			var textLib=self.appEnv.textLib;
			if(msg==0 && way==1)
			{
				if(!self.holdTimer)
				{
					self.timeGap=200;
					self.holdBtn=this;
					self.holdTimer=self.appEnv.layer.setTimeout(self.timeGap,self.onUnitHold,self);
					this.holdNum=0;
				}
			}
			else if(msg==1 && way==1)
			{
				def=this.def;
				bld=self.aisBld;
				if(self.holdTimer && 2!=extra)
				{
					self.appEnv.layer.clearTimeout(self.holdTimer);
					self.holdTimer=null;
				}
				//TODO: 检查兵营容量是否可以生产

				//发送开始制造的消息
				if(2!=this.badToBuild && (!this.holdNum || key==0))
				{
					level=aisGame.king.getUnitLevel(def.codeName);
				//	window.aisGame.king.execCmd(self.aisBld,"NewMfc",{codeName:def.codeName,level:level,num:1},self.aisBld);
					resBad=this.page.vwHomeStage.newMfc({bld:self.aisBld,codeName:def.codeName,level:level,num:1},self.updateAllBtn,self);
					if(0==resBad)
					{
						this.setEnabled(0);
						this.setEnabled(1);
					}
					this.page.audioObject.playSound("btn_click");
					if((this.resBad || this.badToBuild) && self.holdTimer)
					{
						self.appEnv.layer.clearTimeout(self.holdTimer);
						self.holdTimer=null;
					}
					//TODO: 更新按钮
					self.updateAllBtn();

					//增加动画效果
					pos=[0,0,0];
					this.getPos(pos);
					this.setScale(0.9);
					this.startAniEx(pos,1,1,0,3);
				}
//				else if(this.badToBuild==1)//物资不足
//				{
//					self.appEnv.stateLogs.showLog(textLib["ResNeedForUnit"]);
//				}
				else if(this.badToBuild==2)//兵营等级不够
				{
					self.appEnv.stateLogs.showLog(textLib["ResNeedForUnit"]);
				}
			}
		};

		//单位信息被点击
		__Page.dlgTrain.onUnitInfoClk=function(msg,key,way,extra)
		{
			var def,self;
			self=this.dlg;
			if(msg==1 && way==1)
			{
				def=this.def;
				self.appEnv.switchDlg(self.dlgPage.dlgTrainInfo,0,def);
			}
		};

		//按住后的重复:
		__Page.dlgTrain.onSubUnitHold=function()
		{
		//	this.holdTimer=null;
			this.holdBtn.holdNum+=1;
			this.onSubUnitClk.call(this.holdBtn,1,0,1,1);
			if(!this.holdBtn.deadOut)
			{
				this.timeGap-=40;
				if(this.timeGap<30)
					this.timeGap=30;
				this.holdTimer=this.appEnv.layer.setTimeout(this.timeGap,this.onSubUnitHold,this);
			}
		};

		//取消建造按钮被点击
		__Page.dlgTrain.onSubUnitClk=function(msg,key,way,extra)
		{
			var list,i,n,btn;
			var self,def,bld;
			self=this.dlg;
			if(msg==0 && way==1)
			{
				if(!self.holdTimer)
				{
					self.timeGap=200;
					self.holdBtn=this;
					self.holdTimer=self.appEnv.layer.setTimeout(self.timeGap,self.onSubUnitHold,self);
					this.holdNum=0;
				}
			}
			else if(msg==1 && way==1)
			{
				def=this.def;
				bld=self.aisBld;
				if(self.holdTimer)
				{
					self.appEnv.layer.clearTimeout(self.holdTimer);
					self.holdTimer=null;
				}
				//发送取消制造的消息
				if(this.slot && this.slot.num>0)
				{
					window.aisGame.king.execCmd(bld,"AbortMfc",{codeName:def.codeName,num:1},bld);
					this.page.audioObject.playSound("btn_click");
				}
				//TODO: 更新按钮
				self.updateAllBtn();
			}
		};

		__Page.dlgTrain.onGemClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var bld=this.aisBld;
				var allCap=bld.slotCap;
				DBOut("++++max="+aisGame.curCity.unitStorage.getValue("maxLoad")+" cur="+aisGame.curCity.unitStorage.getValue("curLoad")+" all="+allCap);
				this.rmCap=aisGame.curCity.unitStorage.getValue("maxLoad")-(allCap+aisGame.curCity.unitStorage.getValue("curLoad"));
				if(this.rmCap<0)
				{
					this.btnGemDone.setEnabled(0);
					return;
				}
				this.page.vwHomeStage.gemMfcDone(this.infoVO.aisBld);
			}
		};

		//切换能源训练、能量块训练
		__Page.dlgTrain.onTabClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
			//	if(this.curTabInfo && key==this.curTabInfo.key)
			//		return;
				var i, kvo;
				for(i in this.tabKeys)
				{
					kvo=this.tabKeys[i];
					if(i==key)
					{
						kvo.hud.setEnabled(0);
						this.curTabInfo=kvo;
					}
					else
					{
						kvo.hud.setEnabled(1);
					}
				}
				var defLib=window.aisEnv.defLib.unit;
				if("Oil"==this.curTabInfo.tab)
					this.curUnits=defLib["genlUnits"];
				else if("Cube"==this.curTabInfo.tab)
					this.curUnits=defLib["cubeUnits"].concat(defLib["gemUnits"]);
				if(-1!=extra)
					this.updateMakeBtn();
			//	this.appEnv.switchDlg(this,0,this.infoVO);
			}
		};

		//切换兵营
		__Page.dlgTrain.onSwitchStorageClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var bld, list, i, len;
				bld=this.aisBld;
				list=window.aisGame.curCity["bldAll"+bld.def.codeName];
				len=list.length;
				if(!(this.curStoreIdx>=0))
				{
					for(i=0; i<len; i++)
					{
						DBOut(bld==list[i]);
						if(bld==list[i])
						{
							this.curStoreIdx=i;
							break;
						}
					}
				}
				var outPos=[0,0,0], inPos=[0,0,0], dis=64, t=5;
				var newIdx=-1, keyVO=this.storeKeys[key+""];
				if(0==keyVO.type)//左
				{
					newIdx=--this.curStoreIdx;
					if(newIdx<0)
						newIdx=len-1;
					outPos=[-dis,0,0];
					inPos=[dis,0,0];
				}
				else if(1==keyVO.type)//右
				{
					newIdx=++this.curStoreIdx;
					if(newIdx>len-1)
						newIdx=0;
					outPos=[dis,0,0];
					inPos=[-dis,0,0];
				}
				this.curStoreIdx=newIdx;
				this.infoVO={aisBld:list[newIdx]};
				this.cancelAllUpdate();
				var self=this;
				if(this.cntBoxEx.timer)
				{
					clearTimeout(this.cntBoxEx.timer);
					this.cntBoxEx.timer=null;
				}
				this.cntBoxEx.setFadePos(outPos);
				this.cntBoxEx.fadeOut(t,0);
				this.cntBoxEx.onFadeDone=function(io)
				{
					if(0==io)
					{
						self.updateStorage();
						this.setFadePos(inPos);
						this.timer=setTimeout(100,function(){
							this.fadeIn(t,0);
						},this)
					}
					else if(1==io)
					{

					}
				};
			}
		};
	}
}
