if(!__Page.dlgPart)
{
	__Page.dlgPart=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgPart;
	__Page.dlgPart.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;

		var pic, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		pic=imgLib.getImg("btn_blue_u");
		var topListX=this.toplistX=this.closeBtnW+10;
		var topListY=this.toplistY=this.closeBtnY;
		var topListW=this.topListW=this.dlgW-this.closeBtnW-topListX-16;
		var topListH=this.topListH=this.closeBtnH;
		var menuW=this.menuW=pic.w+10;
		var menuH=this.menuH=pic.h;
		var menuX=this.menuX=menuW/2;
		var menuY=this.menuY=menuH/2;
		this.topMenuCSS={type:"shape",id:"box-menu",pos:[topListX,topListY,0],w:topListW,h:topListH,anchor_h:0,anchor_v:1,ui_event:1,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};

		this.menus=[];
		this.menuKeys={};
		this.stateKeys={};
		this.curStateId=-1;
		this.tagBtns=[];
		this.tagKeys={};
		this.tagList=[];
		this.curTag=-1;
	};
	__Page.dlgPart.init=function(appEnv)
	{
		this.name="dlgPart";
		this.viewId="dlgPart";
		this.slotVsn=0;
		this.rmCap=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		var appEnv=this.appEnv;
		var page=appEnv.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.topMenuBox=this.dlgFrame.appendNewChild({css:this.topMenuCSS});
		this.states=["","Storage","Enhance"];
		var i,x,y,state,item,items=[];
		for(i=0; i<this.states.length; i++)
		{
			x=this.menuW/2+this.menuW*i;
			y=0;
			state=this.states[i];
			item=this.topMenuBox.appendNewChild({id:"Part"+state,css:cssLib.normalBtn.createCSS([x,y,0],keyid,2,textLib["Part"+state]),idx:i});
		//	item.setEnabled(0);
			this.menus.push(item);
			this.menuKeys[keyid+""]=item;
			this.stateKeys[state]=keyid;
		}
		this.menuPart=this.topMenuBox.getItemById("Part");
		this.menuStorage=this.topMenuBox.getItemById("PartStorage");
		this.menuEnhance=this.topMenuBox.getItemById("PartEnhance");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onProductionClk);
		this.menuPart.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onStorageClk);
		this.menuStorage.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onEnhanceClk);
		this.menuEnhance.setKey(keyid);
	};

	__Page.dlgPart.initBtns=function()
	{
		this._init=1;
		var appEnv=this.appEnv;
		var page=appEnv.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		var boxw,boxh,btn,defLib,list,i,n,def,x,y,css,btnw,btnh;
		DBOut("dlgPart.init: "+appEnv);

		boxw=this.boxW;
		boxh=this.boxH;
		var cntW=this.contentW;

		//分类按钮底图:
		var tagW=cntW, tagH=60, tagY=10;;
		this.tagBox=this.cntBox.appendNewChild({type:"shape",id:"tagBox",pos:[0,tagY,0],w:tagW,h:tagH,face_r:0,face_a:255,face_a:0,ui_event:1});

		var tagBtnW=328;//238;
		var tagBtnH=48;
		var tagBtnDt=10;
		var tagBtnX=tagW/2-tagBtnDt-tagBtnW/2;//tagW/2-tagBtnDt-tagBtnW
		var tagBtnY=tagH/2;

		var boxU=imgLib.getImg("box_btn_u"), boxD=imgLib.getImg("box_btn_d"), hud;
		for(i=0; i<2; i++)
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onTagClk);
			x=tagBtnX+(tagBtnDt+tagBtnW)*i, y=tagBtnY;
			this["btnTag"+i]=hud=this.tagBox.appendNewChild({type:"key",pos:[x,y,0],w:tagBtnW,h:tagBtnH,css:boxU,ui_event:1,key:keyid,down_scale:0.99,anchor_h:1,anchor_v:1,
				state_up:{css:boxU,w:tagBtnW,h:tagBtnH},state_down:{css:boxD,w:tagBtnW,h:tagBtnH},state_gray:{css:boxD,w:tagBtnW,h:tagBtnH},items:[
					{css:cssLib.textFineMid.createCSS([0,0,0],textLib["Tier"+(i+1)],tagBtnW,tagBtnH,1,1,1,1)}
				],audio:page.audioObject.genFileURL("btn_click"),
			});
			this.tagBtns.push(hud);
			this.tagKeys[keyid+""]={tag:i,hud:hud,key:keyid};
			this.tagList.push(this.tagKeys[keyid+""]);
			if(0==i)
				this.onTagClk(1,keyid,1,0);
		}

		//建造队列底图:
		var queW=boxw-20-200, queH=120, queY=tagY+tagH+10;
		this.picQue=this.cntBox.appendNewChild({type:"icon",id:"picQue",pos:[0,queY,0],css:cssLib.picQueue,w:queW,h:queH,color_a:200});
		this.trainningX=boxw-335, this.trainningY=queY+queH/2;

		//建造完成后兵营容量提示:
		var tipW=boxw-30, tipH=80, tipX=boxw-260, tipY=queY+queH-26;
		this.capTip=cssLib.textSmall.create(this.cntBox,[tipX,tipY,0],"Cap tip xxxxx",tipW,tipH,2,0,2,1,[80,80,80]);
		this.slotTip=cssLib.textSmall.create(this.cntBox,[tipX-426,tipY,0],"Cap tip xxxxx",tipW,tipH,2,0,2,1,[80,80,80]);

		//时间提示小字:
		var timeW=150, timeH=80, timeX=boxw-80, timeY=tagY+tagH+10;
		this.timeTip=cssLib.textSmall.create(this.cntBox,[timeX,timeY,0],textLib["RemainTime"],timeW,timeH,2,1,1,1,[80,80,80]);//"Time to fininish"

		//时间提示大字:
		timeY+=30;
		this.timeTipBig=this.cntBox.appendNewChild({css:cssLib.textFineBig.createCSS([timeX,timeY,0],"30m 40s",timeW,timeH,2,1,1,1),font_size:36});

		//花钻提示小字:
		timeY+=30;
		this.gemTip=cssLib.textSmall.create(this.cntBox,[timeX,timeY,0],textLib["FinishNow"],timeW,timeH,2,1,1,1,[80,80,80]);//"Finish now:"
		var btnGemX=timeX-timeW/2, btnGemY=timeY+50;

		//初始化单位按钮
		btnw=(boxw-20-240-4*150)/4+150;
		btnh=(boxh-80-240-150-150)+150;
		this.trainX=120, this.trainY=btnGemY+btnh/2+36;
		this.prtBtns=[];
		defLib=window.aisEnv.defLib.part;
	//	defLib=window.aisEnv.defLib.;
		list=defLib.partTiers[0];
		n=list.length;
		for(i=0;i<10;i++)
		{
			def=defLib[list[i]];
		//	DBOut("def: "+list[i]+": "+def);
			x=(i%5)*btnw;
			y=Math.floor(i/5)*btnh;
			keyid=appEnv.appKeys.bldTrainUnit_1-(i?i:0)*2;
			css=cssLib.btnMakePart.createCSS(def,i,this.trainX+x,this.trainY+y,keyid);
		//	DBOut("pos: "+css.pos[0]+", "+css.pos[1]);
			btn=this.cntBox.appendNewChild(css);
			btn.def=def;
			btn.dlg=this;
			this.prtBtns.push(btn);
			this.regKeyVO(keyid,btn,this.onPartClk);
		}

		btnw=180;
		keyid=appEnv.appKeys.btnGemFin;
		this.btnGemDone=cssLib.btnResGo.create(this.cntBox,[btnGemX,btnGemY,0],btnw*0.8,"gem",200,1,keyid,0);
		//	appEnv.getVipCapStatus("vipTrainTimeDiscount")?window.aisGame.curCity.vipLevel:0);
		this.regKeyVO(keyid,this,this.onGemClk);
		var bw=this.btnGemDone.getW()*0.8, bh=this.btnGemDone.getH()*0.8;
		this.btnGemDone.setStateStyle(0,{h:bh});
		this.btnGemDone.setStateStyle(1,{h:bh});
		this.btnGemDone.setStateStyle(2,{h:bh});
		this.dlgTitle.setDisplay(0);
		//Init sub-states:
		this.dlgPage.dlgPartStorage.init(appEnv);
		this.dlgPage.dlgPartEnhance.init(appEnv);
		this.dlgPage.dlgPartInfo.init(appEnv);
	};

	__Page.dlgPart.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;
		var list,i,n,title;
		var bld,btn,exInfo;

		this.dlgTitle.setDisplay(0);
		this.menuPart.setEnabled(0);
		this.menuStorage.setEnabled(1);
		this.menuEnhance.setEnabled(1);
		//根据VO初始化界面:
	//	this.infoVO=vo;
		if(vo)
		{
			exInfo=vo.info;
			vo=vo.bld;
		//	bld=vo.aisBld;
			bld=window.aisGame.curCity.aisMacShop;
		//	this.cocBld=vo;
			this.aisBld=bld;
			this.slotVsn=-1;
			appEnv.setDlgAniCall(function(){
				if(!this._init)
					this.initBtns();
				bld.addUIView(this);
				if(exInfo)
				{
					this.onTagClk(1,this.tagList[1].key,1,1);
				}
				//TODO: 更新按钮
			//	this.updateAllBtn();
				this.timer=null;
			},this);
		}
		else
		{
			if(this.aisBld)
				this.aisUpdateView();
		}
		if(this.aisBld)
		{
			bld=this.aisBld;
			title=textLib.partDlgTitle(bld);
		//	this.dlgTitle._setText("");
		}
		//TODO: 更新按钮
		appEnv.hudOut(this.btnBack,10);
		if(preState)
		{
			appEnv.hudIn(this.cntBox,20);
		//	appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgPart.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(this.updateTimeTimer)
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
		if(nextState)
		{
		//	this.menuPart.setEnabled(1);
		//	this.menuStorage.setEnabled(0);
			if(nextState!=this.dlgPage.dlgPartMakeStorage)
			{
			//	appEnv.hudIn(this.btnBack,10);
			}
			appEnv.hudOut(this.cntBox,10);
		}
		else
		{
			this.removeUIView();
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgPart.removeUIView=function()
	{
		var bld, list, n, i;
		bld=this.aisBld;
		bld.removeUIView(this);
		list=bld.mfcSlots;
		n=list.length;
		for(i=0;i<n;i++)
		{
			if(list[i].btn)
				list[i].removeUIView(list[i].btn);
			list[i].btn=null;
		}
		if(this.updateTimeTimer)
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
	};

	__Page.dlgPart.switchCatalog=function()
	{
		
	};

	__Page.dlgPart.updateAllBtn=function()
	{
		//TODO: 更新按钮
		DBOut("更新所有制造单位的按钮");
		var defLib=window.aisEnv.defLib.part;
		var defs=defLib.partTiers[this.curTag];
		var list,i,n,btn,bld;
		list=this.prtBtns;
		n=list.length;
		bld=this.aisBld;
		for(i=0;i<n;i++)
		{
			btn=list[i];
			btn.def=defLib[defs[i]];
			btn.update(bld);
		}
	};

	__Page.dlgPart.updateAllWorkTime=function()
	{
		var bld=this.aisBld;
		var time,updateTime,nowTime,taskTime,gemNum;
		if(this.updateTimeTimer)
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
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
			time+=bld.slotWorkVal;
			time=time<0?0:time;
			gemNum=aisGame.king.convertTime2Gem(time);
			this.timeTipBig._setText(this.appEnv.textLib.getTimeText(time));
			this.btnGemDone.setResNum("gem",gemNum,gemNum>aisGame.king.gemNum);
		}
		this.updateTimeTimer=this.appEnv.layer.setTimeout(1000,this.updateAllWorkTime,this);
	};

	__Page.dlgPart.aisUpdateView=function()
	{
		DBOut("===aisUpdateView");
		var list,i,n,x,y,slot,btn,keyid,title,time;
		var appEnv=this.appEnv;
		var cssLib=this.page.cssLib;
		var textLib=appEnv.textLib;
		var bld,tstore,city,allCap,totalCap,usedCap, freeCap;
		
		title=textLib.partDlgTitle(this.aisBld);
	//	this.dlgTitle._setText(title);

		bld=this.aisBld;
		tstore=bld.tgtStorage;
		totalCap=tstore.getTotalCap(), usedCap=tstore.getUsedCap(), freeCap=tstore.getFreeCap();
	//	DBOut(freeCap+" "+usedCap+" "+totalCap+" "+bld.slotCap+" "+bld.getValue("mfcCap"));
		var storage=window.aisGame.curCity.partStorage;
		city=aisGame.curCity;

		if(bld.slotCap == bld.getValue("mfcCap"))
		{
			this.seqFull=1;
		}
		else
		{
			this.seqFull=0;
		}
		DBOut("==== seqFull="+this.seqFull);

		this.slotTip.setText(textLib["PrdSeq"]+bld.slotCap+"/"+bld.getValue("mfcCap"));
		this.rmCap=storage.getValue("maxLoad")-storage.getValue("curLoad");
		if(!bld.working)
		{
			this.picQue.setDisplay(0);
			this.capTip.setText(textLib["StorageCap"]+usedCap+"/"+totalCap);
			this.timeTip.setDisplay(0);
			this.timeTipBig.setDisplay(0);
			this.btnGemDone.setDisplay(0);
			this.gemTip.setDisplay(0);
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
			this.capTip.setText(textLib["StorageRemainCap"]+(usedCap+allCap)+"/"+totalCap);

			this.rmCap-=allCap;
			this.updateAllWorkTime();
			if(bld.working==4)//卡住了...
			{
				this.capTip.setDisplay(0);
				this.timeTip.setDisplay(0);
				this.timeTipBig.setDisplay(0);
				this.btnGemDone.setDisplay(0);
				this.gemTip.setDisplay(0);
			}
			else
			{
				this.capTip.setDisplay(1);
				this.timeTip.setDisplay(1);
				this.timeTipBig.setDisplay(1);
				this.btnGemDone.setDisplay(1);
				this.gemTip.setDisplay(1);
			}
		}
		if(this.slotVsn!=bld.slotVsn)
		{
			this.slotVsn=bld.slotVsn;
			list=bld.mfcSlots;
			n=list.length;
			n=n>6?6:n;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				x=this.trainningX-i*95;
				y=this.trainningY;
				btn=slot.btn;
				if(!btn)
				{
					//创建一个新的Btn:
					keyid=appEnv.hudKeys.getKey(this);
					btn=cssLib.btnMakingPrt.create(this.cntBox,bld,slot,x,y,keyid);
					slot.btn=btn;
					btn.dlg=this;
				}
				btn.setKey(keyid);
				this.regKeyVO(keyid,btn,this.onSubPartClk);
				btn.update();
				btn.startAniEx([x,y,0],1,1,0,3);
			}
		}
		//TODO: 更新按钮
		this.updateAllBtn();
	};
	
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgPart.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgPart.onCloseClk=function(msg,key,way,extra)
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

		__Page.dlgPart.onTagClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var info=this.tagKeys[key+""];
				var hud=info.hud;
				var tag=info.tag;
				var old=this.curTag;
				if(tag==old)
					return;
				if(old>=0)
					this.tagBtns[old].setEnabled(1);
				this.tagBtns[tag].setEnabled(0);
				this.curTag=tag;
				if(old>=0 && this.prtBtns)
					this.updateAllBtn();
			}
		};

		//建造按钮被点击
		__Page.dlgPart.onPartClk=function(msg,key,way,extra)
		{
			var self,def;
			var list,i,n,btn,bld;
			if(msg==0 && way==1)
			{
				self=this.dlg;
			}
			else if(msg==1 && way==1)
			{
				self=this.dlg;
				bld=self.aisBld;
				var appEnv=self.appEnv;
				var textLib=appEnv.textLib;

				if(bld.constructing)
				{
					appEnv.stateLogs.showLog(textLib["MFConstructing"]);
					return;
				}

				def=this.def;
				// if(this.haveNum && def.weight)
				// {
					// appEnv.stateLogs.showLog(textLib["UniquePart"]);
					// return;
				// }
				self.appEnv.switchDlg(self.dlgPage.dlgPartInfo,0,{dlg:self,def:def,level:0,type:0});

//				bld=self.aisBld;
//				//发送开始制造的消息
//				if(!this.badToBuild && (!this.holdNum || key==0))
//				{
//					DBOut("Will MFC: "+def.codeName);
//					window.aisGame.king.execCmd(self.aisBld,"NewMfc",{codeName:def.codeName,num:1},self.aisBld);
//					//TODO: 更新按钮
//					self.updateAllBtn();
//				}
//				else if(this.badToBuild==1)//物资不足
//				{
//					self.appEnv.stateLogs.showLog(textLib["ResNeedForPart"]);
//				}
//				else if(this.badToBuild==2)//兵营等级不够
//				{
//					self.appEnv.stateLogs.showLog(textLib["ResNeedForPart"]);
//				}
			}
		};

		//取消建造按钮被点击
		__Page.dlgPart.onSubPartClk=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				appEnv.stateLogs.showLog(textLib["PrtCanNotCancel"]);
				return;
			}
//			var list,i,n,btn;
//			var self,def,bld;
//			self=this.dlg;
//			if(msg==0 && way==1)
//			{
//			}
//			else if(msg==1 && way==1)
//			{
//				def=this.def;
//				bld=self.aisBld;
//				//发送取消制造的消息
//				if(this.slot && this.slot.num>0)
//				{
//					window.aisGame.king.execCmd(bld,"AbortMfc",{codeName:def.codeName,num:1},bld);
//					this.page.audioObject.playSound("btn_click");
//				}
//				//TODO: 更新按钮
//				self.updateAllBtn();
//			}
		};

		__Page.dlgPart.onGemClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				aisGame.king.execCmd(this.aisBld,"GemMfcDone",{},this.aisBld);
			}
		};

		//切换至生产界面
		__Page.dlgPart.onProductionClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgPart,0,null);
			}
		};

		//切换至仓库界面
		__Page.dlgPart.onStorageClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgPartStorage,0,null);
			}
		};

		//切换至强化界面
		__Page.dlgPart.onEnhanceClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgPartEnhance,0,null);
			}
		};
	}
}
