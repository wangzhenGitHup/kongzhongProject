if(!__Page.dlgAddOnBuy)
{
	__Page.dlgAddOnBuy=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgAddOnBuy;
	__Page.dlgAddOnBuy.loadConfig=function()
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
	};
	__Page.dlgAddOnBuy.init=function(appEnv)
	{
		this.name="dlgAddOnBuy";
		this.viewId="dlgAddOnBuy";
		this.slotVsn=0;
		this.queVsn=0;
		this.rmCap=0;
		this.slots=[];//要购买的Addon的列表
		this.page.dlgBase.prototype.init.call(this,appEnv);

		var appEnv=this.appEnv;
		var page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.topMenuBox=this.dlgFrame.appendNewChild({css:this.topMenuCSS});
		this.states=["Buy","Joint","Storage"];
		var i,x,y,state,item,items=[];
		for(i=0; i<this.states.length; i++)
		{
			x=this.menuW/2+this.menuW*i;
			y=0;
			state=this.states[i];
			item=this.topMenuBox.appendNewChild({id:"AddOn"+state,css:cssLib.normalBtn.createCSS([x,y,0],keyid,2,textLib["AddOn"+state]),idx:i});
		//	item.setEnabled(0);
			this.menus.push(item);
			this.menuKeys[keyid+""]=item;
			this.stateKeys[state]=keyid;
		}
		this.menuBuy=this.topMenuBox.getItemById("AddOnBuy");
		this.menuJoint=this.topMenuBox.getItemById("AddOnJoint");
		this.menuStorage=this.topMenuBox.getItemById("AddOnStorage");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onPurchaseClk);
		this.menuBuy.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onJointClk);
		this.menuJoint.setKey(keyid);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onStorageClk);
		this.menuStorage.setKey(keyid);
	};

	__Page.dlgAddOnBuy.initBtns=function()
	{
		this._init=1;
		var appEnv=this.appEnv;
		var page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		var boxw,boxh,btn,defLib,list,i,n,def,x,y,css,btnw,btnh;

		boxw=this.boxW;
		boxh=this.boxH;
		var cntW=this.contentW;

		//底部提示框:
		this.tipBox=this.cntBox.appendNewChild({
			type:"icon",id:"tipBox",pos:[10,this.cntBox.getH()-80+10,0],css:imgLib.box_green,w:boxw-40,h:70-8,ui_event:1,
		//	css:cssLib.boxSolid,color_r:214,color_g:195,color_b:150
		});

		//对话框提示:
		this.dlgTip=cssLib.textFineMid.create(this.tipBox,[0,0,0],textLib["Battle Shop"],this.tipBox.getW(),70,0,0,1,1);

		//建造队列底图:
		this.picQue=this.cntBox.appendNewChild({
			type:"icon",id:"picQue",pos:[0,10,0],css:cssLib.picQueue,w:boxw-20-200,h:120,color_a:200
		});

		//提示小字:
		this.getTip=this.cntBox.appendNewChild({css:cssLib.textSmall.createCSS([46,136,0],textLib["WayToGetToken"],boxw-132,30,0,0,0,1,[80,80,80]),font_size:FS.M});

		//初始化模块按钮
		btnw=(boxw-20-240-4*150)/4+150;
		btnh=(boxh-80-240-150-150)+150;
		this.addOnBtns=[];
		defLib=window.aisEnv.defLib.addon;
		list=defLib.buyAddOns;
		n=list.length;
		for(i=0;i<n;i++)
		{
			def=defLib[list[i]];
			x=(i%5)*btnw;
			y=Math.floor(i/5)*btnh;
			keyid=appEnv.appKeys.bldTrainUnit_1-(i?i:0)*2;
			css=this.dlgPage.btnBuyAddOn.createCSS(page,appEnv,def,i,120+x,240+y,keyid);
			btn=this.cntBox.appendNewChild(css);
			btn.def=def;
			btn.dlg=this;
			this.addOnBtns.push(btn);
			this.regKeyVO(keyid,btn,this.onAddOnClk);
			this.regKeyVO(keyid-1,btn,this.onAddOnInfoClk);
		}
		for(;i<10;i++)
		{
			x=(i%5)*btnw;
			y=Math.floor(i/5)*btnh;
			this.cntBox.appendNewChild({
				type:"icon",pos:[120+x,240+y,0],css:cssLib.boxSolid,w:150,h:150,color_r:120,color_g:120,color_b:120,color_a:128,anchor_h:1,anchor_v:1
			});
		}

		//花钻提示小字:
		this.gemTip=this.cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([boxw-80,70,0],textLib["MakeAddOnCost"],150,80,2,1,1,1),font_size:FS.XXL,display:0});//"Finish now:"

		btnw=220;
		keyid=appEnv.appKeys.btnGemFin;
		this.btnBuyAddon=cssLib.btnResGo.create(this.cntBox,[730,130,0],btnw*0.8,"chip",200,1,keyid);
		this.regKeyVO(keyid,this,this.onBuyClk);
		var bw=this.btnBuyAddon.getW()*0.8, bh=this.btnBuyAddon.getH()*0.8;
		this.btnBuyAddon.setStateStyle(0,{h:bh});
		this.btnBuyAddon.setStateStyle(1,{h:bh});
		this.btnBuyAddon.setStateStyle(2,{h:bh});

	//	this.cashBox=this.dlgPage.boxCash.create(page,appEnv,this.cntBox,[760,40,0],aisGame.curCity);

		this.dlgTitle.setDisplay(0);
		//Init sub-states:
		this.dlgPage.dlgAddOnJoint.init(appEnv);
		this.dlgPage.dlgChooseJointAddOn.init(appEnv);
		this.dlgPage.pmtJoint.init(appEnv);
	};

	__Page.dlgAddOnBuy.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var list,i,n,title;
		var textLib=appEnv.textLib;
		var bld,btn;

		this.menuBuy.setEnabled(0);
		this.menuJoint.setEnabled(1);
		this.menuStorage.setEnabled(1);
		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			bld=vo.aisBld;
			this.cocBld=vo;
			this.aisBld=bld;
			this.slotVsn=-1;
			if(!this.slots)
				this.slots=[];
			appEnv.setDlgAniCall(function(){
				if(!this._init)
					this.initBtns();
				//TODO: 更新按钮
				this.updateView();
				this.timer=null;
			},this);
		}
		else
		{
			this.updateView();
		}
		if(this.aisBld)
		{
			bld=this.aisBld;
			title=textLib.barracksDlgTitle(bld);
			this.dlgTitle._setText("");
		}
		if(preState)
		{
			appEnv.hudIn(this.cntBox,20);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgAddOnBuy.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(this.updateTimeTimer)
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
		if(this.holdTimer)
			this.appEnv.layer.clearTimeout(this.holdTimer);
		if(nextState)
		{
		//	if(nextState!=this.dlgPage.dlgAddOnJoint)
		//		appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox,10);
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgAddOnBuy.updateAllCost=function(cost,store,type)
	{
		var king,bad=0,cvo;
		if("cash"==type)
			cvo={cash:cost,storage:[]};
		else if("gem"==type)
			cvo={gem:cost,storage:[]};
		else
			cvo={storage:[{store:store,type:type,num:cost}]};
		if(!this.page.vwHomeStage.checkCost(cvo,0))
			bad=1;
		this.cost=cvo;
//		king=aisGame.king;
//		bad=cost>king.cashNum;
		this.btnBuyAddon.setResNum(store.toLowerCase(),cost,bad);
		if(bad)
		{
		//	this.btnBuyAddon.setEnabled(0);
		}
		else
		{
		//	this.btnBuyAddon.setEnabled(1);
		}
	};
	
	__Page.dlgAddOnBuy.updateView=function()
	{
		var list,i,n,x,y,slot,btn,keyid,title,time;
		var appEnv=this.appEnv;
		var cssLib=this.page.cssLib;
		var textLib=appEnv.textLib;
		var bld,city,allCost,cvo,resStore,resType;
		var slots;
		
	//	DBOut("DB1");
		bld=this.aisBld;
		title=textLib.barracksDlgTitle(bld);
		this.dlgTitle._setText(title);
		
	//	DBOut("DB2");
		city=aisGame.curCity;
		slots=this.slots;
		if(!slots.length)//没有要购买的模块
		{
			this.curCost="";
			this.picQue.setDisplay(0);
			this.btnBuyAddon.setDisplay(0);
			this.gemTip.setDisplay(0);
			this.dlgTip._setText(textLib["MakeAddOnDesc"]);
		//	this.updateAllCost(0);
		//	this.tipBox.fadeIn(20,0);
		}
		else
		{
			this.picQue.setDisplay(1);
			n=slots.length;
			allCost=0;
			for(i=0;i<n;i++)
			{
				cvo=slots[i].def.cost;
				if(cvo.cash){
					allCost+=cvo.cash*slots[i].num;
					resStore="chip";
					resType="cash";
				}else if(cvo.gem){
					allCost+=cvo.gem*slots[i].num;
					resStore="gem";
					resType="gem";
				}else if(cvo.storage && cvo.storage.length){
					allCost+=cvo.storage[0].num*slots[i].num;
					resStore=cvo.storage[0].store;
					resType=cvo.storage[0].type;
				}else{
					Dialogs.alert("cost def error:"+slots[i].def.codeName);
					throw "";
				}
			}
			this.curCost=resType;
			this.updateAllCost(allCost,resStore,resType);
			{
				this.btnBuyAddon.setDisplay(1);
				this.gemTip.setDisplay(1);
				this.dlgTip._setText(textLib["MakeAddOnDesc"]);
			}
		//	this.tipBox.fadeOut(10,0);
		}
	//	DBOut("DB3");
		if(this.slotVsn!=this.queVsn)
		{
			this.slotVsn=this.queVsn;
			list=this.slots;
			n=list.length;
			n=n>6?6:n;
			for(i=0;i<n;i++)
			{
				slot=list[i];
				x=this.boxW-335-i*101;
				y=70;
				btn=slot.btn;
				keyid=appEnv.appKeys.btnTraining_1+i;
				if(!btn)
				{
					//创建一个新的Btn:
					btn=this.dlgPage.btnAddOnQ.create(this.page,this.appEnv,this.cntBox,slot,x,y,keyid);
					slot.btn=btn;
					btn.dlg=this;
				}
				btn.setKey(keyid);
				this.regKeyVO(keyid,btn,this.onSubAddOnClk);
				btn.update();
				btn.startAniEx([x,y,0],1,1,0,3);
			}
		}
	};

	__Page.dlgAddOnBuy.buyAddOn=function()
	{
		if(!this.page.vwHomeStage.checkCost(this.cost,1,this.buyAddOn,this,[]))
		{
			return;
		}
		var slots,i,n;
		slots=this.slots;
		n=slots.length;
		for(i=0;i<n;i++)
		{
			window.aisGame.king.execCmd(this.aisBld,"BuyAddOn",
				{codeName:slots[i].def.codeName,num:slots[i].num}
			,this.aisBld);
			slots[i].num=0;
			slots[i].btn.update();
		}
		this.slots=[];
		this.updateView();
	//	this.cashBox.update();
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgAddOnBuy.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
			{
				//DBOut("dlgAddOnBuy.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};
		
		//按住后的重复:
		__Page.dlgAddOnBuy.onAddOnHold=function()
		{
		//	this.holdTimer=null;
			this.holdBtn.holdNum+=1;
		//	if(!this.holdBtn.badToBuild)
			{
				this.timeGap-=40;
				if(this.timeGap<30)
					this.timeGap=30;
				this.holdTimer=this.appEnv.layer.setTimeout(this.timeGap,this.onAddOnHold,this);
			}
			this.onAddOnClk.call(this.holdBtn,1,0,1,2);
		};

		//建造按钮被点击
		__Page.dlgAddOnBuy.onAddOnClk=function(msg,key,way,extra)
		{
			var self,def;
			var list,i,n,btn,bld,slot,pos;
			if(msg==0 && way==1)
			{
				self=this.dlg;
				if(!self.holdTimer)
				{
					self.timeGap=200;
					self.holdBtn=this;
					self.holdTimer=self.appEnv.layer.setTimeout(self.timeGap,self.onAddOnHold,self);
					this.holdNum=0;
				}
			}
			else if(msg==1 && way==1)
			{
				self=this.dlg;
				var appEnv=self.appEnv;
				var textLib=appEnv.textLib;
				def=this.def;
				bld=self.aisBld;
				if(self.holdTimer && 2!=extra)
				{
					self.appEnv.layer.clearTimeout(self.holdTimer);
					self.holdTimer=null;
				}
				if((!this.holdNum || key==0))
				{
					//调整购买队列
					MakeQ:
					{
						//首先看看能不能合并进入现有队列：
						list=self.slots;
						n=list.length;
						for(i=0;i<n;i++)
						{
							if(list[i].def==this.def)//合并?
							{
								list[i].num++;
								list[i].btn.update();
								self.updateView();
								break MakeQ;
							}
						}
						if(self.curCost)
						{
							if(!this.def.cost[self.curCost])
							{
								appEnv.stateLogs.showLog(textLib["CanNotMakeDif"]);
								return;
							}
						}
						//创建新的队列项
						slot={def:this.def,num:1,btn:null};
						list.push(slot);
						self.queVsn++;
						self.updateView();
					}
					this.page.audioObject.playSound("btn_click");
					//增加动画效果
					pos=[0,0,0];
					this.getPos(pos);
					this.setScale(0.9);
					this.startAniEx(pos,1,1,0,3);
				}
			}
		};

		//单位信息被点击
		__Page.dlgAddOnBuy.onAddOnInfoClk=function(msg,key,way,extra)
		{
			var def,self;
			if(msg==1 && way==1)
			{
				DBOut("onAddOnInfoClk");
				self=this.dlg;
				def=this.def;
				var page=self.page;
				var appEnv=self.appEnv;
				var textLib=appEnv.textLib;
				appEnv.showPmtDlg(page.pmtInfo,0,{title:def.name,info:def.desc,
					pmtFunc:"",pmtObj:"",pmtParam:"",});
			}
		};

		//切换至购买界面：
		__Page.dlgAddOnBuy.onPurchaseClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgAddOnBuy,0,{aisBld:this.aisBld});
			}
		};

		//切换至合成界面：
		__Page.dlgAddOnBuy.onJointClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.switchDlg(this.dlgPage.dlgAddOnJoint,0,{aisBld:this.aisBld});
			}
		};

		//切换至仓库界面：
		__Page.dlgAddOnBuy.onStorageClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("onStorageClk");
				if(this.appEnv.curDlg==this.dlgPage.dlgChooseJointAddOn){
					this.appEnv.hudOut(this.btnBack,10);
					this.dlgPage.dlgChooseJointAddOn.enter(this,{aisBld:this.aisBld,dlgType:1,dlg:this});
				}else
					this.appEnv.switchDlg(this.dlgPage.dlgChooseJointAddOn,0,{aisBld:this.aisBld,dlgType:1,dlg:this});
			}
		};

		//按住后的重复:
		__Page.dlgAddOnBuy.onSubAddOnHold=function()
		{
		//	this.holdTimer=null;
			this.holdBtn.holdNum+=1;
			this.onSubAddOnClk.call(this.holdBtn,1,0,1,1);
			if(!this.holdBtn.deadOut)
			{
				this.timeGap-=40;
				if(this.timeGap<30)
					this.timeGap=30;
				this.holdTimer=this.appEnv.layer.setTimeout(this.timeGap,this.onSubAddOnHold,this);
			}
		};

		//取消建造按钮被点击
		__Page.dlgAddOnBuy.onSubAddOnClk=function(msg,key,way,extra)
		{
			var self,def,list,i,n;
			self=this.dlg;
			if(msg==0 && way==1)
			{
				if(!self.holdTimer)
				{
					self.timeGap=200;
					self.holdBtn=this;
					self.holdTimer=self.appEnv.layer.setTimeout(self.timeGap,self.onSubAddOnHold,self);
					this.holdNum=0;
				}
			}
			else if(msg==1 && way==1)
			{
				def=this.def;
				if(self.holdTimer)
				{
					self.appEnv.layer.clearTimeout(self.holdTimer);
					self.holdTimer=null;
				}
				//发送取消制造的消息
				if(this.slot && this.slot.num>0)
				{
					this.slot.num--;
					this.page.audioObject.playSound("btn_click");
					if(this.slot.num<=0)
					{
						this.slot.aborted=1;
						list=self.slots;
						n=list.length;
						for(i=0;i<n;i++)
						{
							if(list[i]==this.slot)
							{
								list.splice(i,1);
								self.queVsn++;
								break;
							}
						}
					}
					this.update();
					self.updateView();
				}
			}
		};

		__Page.dlgAddOnBuy.onBuyClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.buyAddOn();
			}
		};
	}
}
