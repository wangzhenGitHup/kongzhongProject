if(!__Page.dlgSpell)
{
	__Page.dlgSpell=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgSpell;
	__Page.dlgSpell.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	};
	__Page.dlgSpell.init=function(appEnv)
	{
		this.name="dlgSpell";
		this.viewId="dlgSpell";
		this.slotVsn=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);
	};

	__Page.dlgSpell.initBtns=function()
	{
		this._init=1;
		var appEnv=this.appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid;

		boxw=this.boxW;
		boxh=this.boxH;

		//底部提示框:
		this.tipBox=this.cntBox.appendNewChild({
			type:"icon",id:"tipBox",pos:[10,this.cntBox.getH()-80+10,0],css:imgLib.box_green,w:boxw-40,h:70-8,ui_event:1,
		//	css:cssLib.boxSolid,color_r:214,color_g:195,color_b:150
			items:[{css:cssLib.textFineMid.createCSS([0,0,0],textLib["MakePower"],boxw-40,70-8,0,0,1,1)}]
		});

		//建造队列底图:
		this.picQue=this.cntBox.appendNewChild({
			type:"icon",pos:[0,10,0],css:cssLib.picQueue,w:boxw-20-200,h:120,color_a:200
		});

		//对话框提示:
		//this.dlgTip=cssLib.textFineMid.create(this.tipBox,[0,0,0],textLib["Battle Shop"],this.tipBox.getW(),70,0,0,1,1);

		//建造完成后兵营容量提示:
		//this.capTip=cssLib.textSmall.create(this.cntBox,[boxw-240,110,0],"Cap tip xxxxx",boxw-30,80,2,0,2,1,[80,80,80]);

		//时间提示小字:
		this.timeTip=cssLib.textSmall.create(this.cntBox,[boxw-80,20,0],textLib["RemainTime"],150,80,2,1,1,1,[80,80,80]);

		//时间提示大字:
		this.timeTipBig=cssLib.textFineBig.create(this.cntBox,[boxw-80,50,0],"30m 40s",150,80,2,1,1,1);

		//花钻提示小字:
		this.gemTip=cssLib.textSmall.create(this.cntBox,[boxw-80,80,0],textLib["FinishNow"],150,80,2,1,1,1,[80,80,80]);

		btnw=200;
		keyid=appEnv.hudKeys.getKey(this);
		this.btnGemDone=cssLib.btnResGo.create(this.cntBox,[730,130,0],180,"gem",200,1,keyid,
			appEnv.getVipCapStatus("vipTrainTimeDiscount")?window.aisGame.curCity.vipLevel:0);
		this.regKeyVO(keyid,this,this.onGemClk);

		//初始化单位按钮
		btnw=(boxw-20-240-4*150)/4+150;
		btnh=(boxh-80-240-150-150)+150;
		this.unitBtns=[];
		defLib=window.aisEnv.defLib.spell;
		list=defLib.allSpells;
		n=list.length;
		var i;
		for(i=0;i<n;i++)
		{
			def=defLib[list[i]];
			//DBOut("def: "+list[i]+": "+def);
			x=(i%5)*btnw;
			y=Math.floor(i/5)*btnh;
			keyid=appEnv.appKeys.bldTrainUnit_1-(i?i:0)*2;
			css=cssLib.btnMakeSpell.createCSS(def,i,120+x,240+y,keyid);
			DBOut("pos: "+css.pos[0]+", "+css.pos[1]);
			btn=this.cntBox.appendNewChild(css);
			btn.def=def;
			btn.dlg=this;
			this.unitBtns.push(btn);
			this.regKeyVO(keyid,btn,this.onSpellClk);
			this.regKeyVO(keyid-1,btn,this.onSpellInfoClk);
		}

		//初始化仓库信息控件:
		var y=this.cntBox.getH()-130-50;
		this.lbStoreInfo=cssLib.boxStorage.create(this.cntBox,[10,y,0],this.cntBox.getW()-20,null);
		this.infoTxt=this.cntBox.appendNewChild({type:"text",pos:[35,y-26,0],w:100,h:20,anchor_h:0,anchor_v:0,align_h:0,align_v:0,color_r:10,color_g:10,color_b:10,color_a:255,
			text:textLib["ReadyMagic"],font_size:FS.FM});

		//Init sub-states:
		this.dlgPage.dlgSpellInfo.init(appEnv);
	};

	__Page.dlgSpell.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var list,i,n,title;
		var textLib=appEnv.textLib;
		var bld,btn;

		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			bld=vo.aisBld;
			this.cocBld=vo;
			this.aisBld=bld;
			this.slotVsn=-1;
		//	this.timer=setFrameout(window.DelayLoad,function(){
			appEnv.setDlgAniCall(function(){
				if(!this._init)
					this.initBtns();
				bld.addUIView(this);
				//TODO: 更新按钮
				this.updateAllBtn();
				if(this.aisBld)
				{
					this.lbStoreInfo.update(this.aisBld.tgtStorage);
					//this.lbStoreInfo.update(aisGame.curCity.clanStorage);
					this.infoTxt.setText(textLib["ReadyMagic"]+bld.tgtStorage.getUsedCap()+"/"+bld.tgtStorage.getTotalCap());
				}
				this.timer=null;
			},this);
		}
		else
		{
			if(this.aisBld)
				this.aisUpdateView();
		}
		bld=this.aisBld;
		title=textLib.mdwDlgTitle(bld);
		this.dlgTitle._setText(title);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
		/*if(!this.btnFrame.getDisplay())
		{
		}*/
	};

	__Page.dlgSpell.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(this.updateTimeTimer){
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
			this.updateTimeTimer=null;
		}
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
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
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgSpell.updateAllBtn=function()
	{
		//TODO: 更新按钮
	//	DBOut("更新所有制造魔法的按钮");
		var list,i,n,btn,bld;
		list=this.unitBtns;
		n=list.length;
		bld=this.aisBld;
		for(i=0;i<n;i++)
		{
			btn=list[i];
			btn.update(bld);
		}
	};

	__Page.dlgSpell.updateAllWorkTime=function()
	{
		var bld=this.aisBld;
		var time,updateTime,nowTime,taskTime,gemNum;
		if(this.updateTimeTimer){
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
			this.updateTimeTimer=null;
		}
		if(bld)
		{
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
			gemNum=aisGame.king.convertTime2Gem(time);

			//计算vip打折后的消耗
		//	DBOut("vip gemNum: "+gemNum+" vs "+this.appEnv.getVipTrainGem(gemNum));
			gemNum=this.appEnv.getVipTrainGem(gemNum);

			this.timeTipBig._setText(this.appEnv.textLib.getTimeText(time));
			this.btnGemDone.setResNum("gem",gemNum,gemNum>aisGame.king.gemNum);
		}
		this.updateTimeTimer=this.appEnv.layer.setTimeout(1000,this.updateAllWorkTime,this);
	};

	__Page.dlgSpell.aisUpdateView=function()
	{
		DBOut("dlgSpell.aisUpdateView");
		var list,i,n,x,y,slot,btn,keyid,title,time;
		var appEnv=this.appEnv;
		var cssLib=this.page.cssLib;
		var textLib=appEnv.textLib;
		var bld,city,allCap;

		title=textLib.mdwDlgTitle(this.aisBld);
		this.dlgTitle._setText(title);

		bld=this.aisBld;
		city=aisGame.curCity;
		this.infoTxt.setText(textLib["ReadyMagic"]+bld.tgtStorage.getUsedCap()+"/"+bld.tgtStorage.getTotalCap());
		if(!bld.working)
		{
			this.picQue.setDisplay(0);
			//this.capTip.setDisplay(0);
			this.timeTip.setDisplay(0);
			this.timeTipBig.setDisplay(0);
			this.btnGemDone.setDisplay(0);
			this.gemTip.setDisplay(0);
			//this.tipBox.setColor([214,195,150,255]);
			//this.dlgTip._setText(textLib["TrainTip"]);
		}
		else
		{
			this.picQue.setDisplay(1);
			list=city["bldAll"+bld.def.codeName];
			n=list.length;
			allCap=0;
			for(i=0;i<n;i++)
			{
				allCap+=list[i].slotCap;
			}
			//TODO: 改成字符串表的:
			//this.capTip.setText("Troop capapcity after trainning: "+(allCap+city.unitStorage.getValue("curLoad"))+"/"+city.unitStorage.getValue("maxLoad"));
			this.updateAllWorkTime();
			if(bld.working==4)//卡住了...
			{
				//this.capTip.setDisplay(0);
				this.timeTip.setDisplay(0);
				this.timeTipBig.setDisplay(0);
				this.btnGemDone.setDisplay(0);
				this.gemTip.setDisplay(0);
				//this.tipBox.setColor([200,100,100,255]);
				//this.dlgTip._setText(textLib["TrainCampFull"]);
			}
			else
			{
				//this.capTip.setDisplay(1);
				this.timeTip.setDisplay(1);
				this.timeTipBig.setDisplay(1);
				this.btnGemDone.setDisplay(1);
				this.gemTip.setDisplay(1);
				//this.tipBox.setColor([214,195,150,255]);
				//this.dlgTip._setText(textLib["TrainTip"]);
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
				if(!btn)
				{
					//创建一个新的Btn:
					keyid=appEnv.hudKeys.getKey(this);
					btn=cssLib.btnTraining.create(this.cntBox,bld,slot,x,y,keyid);
					this.regKeyVO(keyid,btn,this.onSubSpellClk);
					slot.btn=btn;
					btn.dlg=this;
				}
				//TODO: 更新按钮
				btn.update();
				btn.startAniEx([x,y,0],1,1,0,3);
			}
			this.updateAllBtn();
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgSpell.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgSpell.onCloseClk=function(msg,key,way,extra)
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
		__Page.dlgSpell.onSpellHold=function()
		{
			this.holdTimer=null;
			this.holdBtn.holdNum+=1;
			this.onSpellClk.call(this.holdBtn,1,0,1,1);
			if(!this.holdBtn.badToBuild)
			{
				this.holdTimer=this.appEnv.layer.setTimeout(500,this.onSpellHold,this);
			}
		};

		//建造按钮被点击
		__Page.dlgSpell.onSpellClk=function(msg,key,way,extra)
		{
			var self,def;
			var list,i,n,btn,bld,level;
			self=this.dlg;
			var textLib=self.appEnv.textLib;
			if(msg==0 && way==1)
			{
				if(!self.holdTimer)
				{
					self.holdBtn=this;
					self.holdTimer=self.appEnv.layer.setTimeout(500,self.onSpellHold,self);
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
				//TODO: 检查兵营容量是否可以生产

				//发送开始制造的消息
				if(2!=this.badToBuild && (!this.holdNum || key==0))
				{
					level=aisGame.king.getSpellLevel(def.codeName);
				//	window.aisGame.king.execCmd(self.aisBld,"NewMfc",{codeName:def.codeName,level:level,num:1},self.aisBld);
					this.page.vwHomeStage.newMfc({codeName:def.codeName,level:level,num:1},self.updateAllBtn,self);
					//TODO: 更新按钮
					self.updateAllBtn();
				}
//				else if(this.badToBuild==1)//物资不足
//				{
//					DBOut("物资不足 "+textLib["ResNeedForSpell"]);
//					self.appEnv.stateLogs.showLog(textLib["ResNeedForSpell"]);
//				}
				else if(this.badToBuild==2)//兵营等级不够
				{
					DBOut("兵营等级不够");
					self.appEnv.stateLogs.showLog(textLib["ResNeedForSpell"]);
				}
			}
		};

		//单位信息被点击
		__Page.dlgSpell.onSpellInfoClk=function(msg,key,way,extra)
		{
			var def,self;
			self=this.dlg;
			if(msg==1 && way==1)
			{
				def=this.def;
				self.appEnv.switchDlg(self.dlgPage.dlgSpellInfo,0,def);
			}
		};

		//取消建造按钮被点击
		__Page.dlgSpell.onSubSpellClk=function(msg,key,way,extra)
		{
			var list,i,n,btn;
			var self,def,i;
			self=this.dlg;
			if(msg==1 && way==1)
			{
				def=this.def;
				bld=self.aisBld;
				//发送取消制造的消息
				if(this.slot && this.slot.num>0)
				{
				//	window.aisGame.king.execCmd(self.aisBld,"AbortMfc",{codeName:def.codeName,num:1},self.aisBld);
					self.page.vwHomeStage.abortSpell({
						comVO:{codeName:def.codeName,num:1},
						fun:self.updateAllBtn,obj:self
					});
				}
			}
		};

		__Page.dlgSpell.onGemClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.page.vwHomeStage.gemMfcDone();
			}
		};
	}
}
