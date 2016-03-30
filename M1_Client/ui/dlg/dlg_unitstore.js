if(!__Page.dlgUnitStore)
{
	__Page.dlgUnitStore=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgUnitStore;
	__Page.dlgUnitStore.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
	};
	__Page.dlgUnitStore.init=function(appEnv)
	{
		this.name="dlgUnitStore";
		this.viewId="dlgUnitStore";
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
		var i,str,hud;
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
	};

	__Page.dlgUnitStore.initBtns=function()
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
		var cntW=this.contentW, cntH=this.contentH;
		var boxw,boxh,btn,defLib,list,i,n,def,x,y,css,btnw,btnh;

		boxw=this.boxW;
		boxh=this.boxH;
		this.btnBox=appEnv.dlgBox;

		//底部提示框:
		this.tipBox=this.cntBox.appendNewChild({
			type:"icon",id:"tipBox",pos:[10,this.cntBox.getH()-80+10,0],css:imgLib.box_green,w:boxw-40,h:70-8,ui_event:1,
		//	css:cssLib.boxSolid,color_r:214,color_g:195,color_b:150
			items:[{css:cssLib.textFineMid.createCSS([0,0,0],"xxx",boxw-40,70-8,0,0,1,1)}]
		});
		this.tipTxt=this.tipBox.firstChild();
		if("clan"==this.exInfo)
			this.tipTxt._setText(textLib["ClickToAddTroopByGem"]);
		else if("fort"==this.exInfo)
			this.tipTxt._setText(textLib["ClickToAddTroop"]);
		//容量显示
		var txtX=70, txtY=10, txtW=100, txtH=30;
		var exStorage=this.exStorage;
		var cur=exStorage.getUsedCap(), total=exStorage.getTotalCap();
		this.capTxt=this.cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([txtX,txtY,0],textLib["TroopCapNum"]+": "+cur+"/"+total,txtW,txtH,0,0,0,0)});
		//兵力列表
		var listX=txtX, listY=txtY+txtH, listW=cntW-listX*2;
		this.lbxTroops=this.cntBox.appendNewChild({css:cssLib.boxStorageUnit.createCSS([listX,listY,0],listW,exStorage)})
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
			keyid=appEnv.hudKeys.getKey(this);
			css=cssLib.btnStoreUnit.createCSS(def,i,120+x,240+y,keyid,this.exInfo);
			btn=this.cntBox.appendNewChild(css);
			btn.def=def;
			btn.dlg=this;
			this.unitBtns.push(btn);
			this.regKeyVO(keyid,btn,this.onUnitClk);
		}
	};

	__Page.dlgUnitStore.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;
		this.dlgTitle._setText(textLib["TroopStation"]);
		var list,i,n,title,btn;

		if(!vo)
		{
			DBOut("UnitStore error: exStorage null!");
			return;
		}
		//根据VO初始化界面:
		var city=this.city=window.aisGame.curCity;
		var exStorage=this.exStorage=vo.storage;//city.clanStorage;
		this.exInfo=vo.info;
		this.freeCap=exStorage.getFreeCap();
		this.totalCap=exStorage.getTotalCap();
		var unitStorage=this.unitStorage=city.unitStorage;
		DBOut("ex - total:"+exStorage.getTotalCap()+", used:"+exStorage.getUsedCap()+", free:"+exStorage.getFreeCap());
		DBOut("unit - total:"+unitStorage.getTotalCap()+", used:"+unitStorage.getUsedCap()+", free:"+unitStorage.getFreeCap());

		appEnv.setDlgAniCall(function(){
			this.initBtns();
			this.updateStorage();
			exStorage.addUIView(this);
			unitStorage.addUIView(this);
			//TODO: 更新按钮
			this.lbxTroops.update(exStorage);
			this.updateAllBtn();
		},this);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgUnitStore.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var list,i,n;
		if(this.holdTimer)
			this.appEnv.layer.clearTimeout(this.holdTimer);
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgUnitStore.getFreeCap=function()
	{
		return this.freeCap;
	};

	//刷新storage
	__Page.dlgUnitStore.updateStorage=function()
	{
	//	if(!this.curUnits)this.curUnits=window.aisEnv.defLib.unit["genlUnits"];
		if(!this.curTabInfo)
		{
			var str="Oil";
			this.curTabInfo=this.tabKeys[str];
		}
		var kvo=this.curTabInfo;
		this.onTabClk(1,kvo.key,1,-1);
	};

	//切换能源训练、能量块训练
	__Page.dlgUnitStore.updateMakeBtn=function()
	{
		this.updateAllBtn();
	};

	__Page.dlgUnitStore.updateAllBtn=function()
	{
		var defLib, units, def;
		defLib=window.aisEnv.defLib.unit;
	//	units=defLib.allUnits;
		units=this.curUnits;
		//TODO: 更新按钮
		var list,i,n,btn,storage,exStorage;
		list=this.unitBtns;
		n=list.length;
		DBOut("更新所有单位的按钮:"+n);
		storage=this.unitStorage;
		exStorage=this.exStorage;
		for(i=0;i<n;i++)
		{
			def=defLib[units[i]];
			btn=list[i];
//			btn.update(storage,exStorage,this.exInfo);
			btn.update(storage,this,this.exInfo,def);
		}
	};

	__Page.dlgUnitStore.aisUpdateView=function()
	{
		var page=this.page;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		//TODO: 更新按钮
		var storage,exStorage;
		storage=this.unitStorage;
		exStorage=this.exStorage;
		this.updateAllBtn();
	//	this.lbxTroops.update(exStorage);
		var cur=exStorage.getUsedCap(), total=exStorage.getTotalCap();
		this.capTxt._setText(textLib["TroopCapNum"]+": "+cur+"/"+total);
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgUnitStore.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgUnitStore.onCloseClk=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onCloseClk.call(this,msg,key,way,extra);
			if(1==msg && 1==way)
			{
				var appEnv=this.appEnv;
				var storage,exStorage;
				storage=this.unitStorage;
				exStorage=this.exStorage;
				storage.removeUIView(this);
				exStorage.removeUIView(this);
			}
			return ret;
		};

		//按住后的重复:
		__Page.dlgUnitStore.onUnitHold=function()
		{
		//	this.holdTimer=null;
			this.holdBtn.holdNum+=1;
		//	if(!this.holdBtn.badToBuild)
			{
				this.timeGap-=40;
				if(this.timeGap<50)
					this.timeGap=50;
				this.holdTimer=this.appEnv.layer.setTimeout(this.timeGap,this.onUnitHold,this);
			}
			this.onUnitClk.call(this.holdBtn,1,0,1,2);
		};

		//建造按钮被点击
		__Page.dlgUnitStore.onUnitClk=function(msg,key,way,extra)
		{
			var self=this.dlg,def;
			var list,i,n,btn,level,resBad;
			var textLib=self.appEnv.textLib;
			var vwHomeStage=self.page.vwHomeStage;
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
				if(self.holdTimer && 2!=extra)
				{
					self.appEnv.layer.clearTimeout(self.holdTimer);
					self.holdTimer=null;
				}
				//TODO: 检查兵营容量是否可以生产

				self.updateAllBtn();
				if((this.resBad || this.numBad || self.freeCap<def.storageSize) && self.holdTimer)
				{
					self.appEnv.layer.clearTimeout(self.holdTimer);
					self.holdTimer=null;
					return;
				}
				//发送开始制造的消息
				level=window.aisGame.king.getUnitLevel(def.codeName);
				var gemNum=window.aisGame.king.gemNum;
				var cost={gem:this.price, cash:0, storage:[]};
				resBad=gemNum<this.price?1:0;
				if(0==resBad)
				{
					this.setEnabled(0);
					this.setEnabled(1);
				}
				this.page.audioObject.playSound("btn_click");
				if(vwHomeStage.checkCost(cost,1))
				{
					vwHomeStage.bldResidence({type:def["codeName"],level:level,num:1,gem:this.price});
					self.freeCap-=def.storageSize;
				}
				//TODO: 更新按钮
				self.updateAllBtn();
				if((this.resBad || this.numBad || self.exStorage.getFreeCap()<def.storageSize) && self.holdTimer)
				{
					self.appEnv.layer.clearTimeout(self.holdTimer);
					self.holdTimer=null;
				}

				//增加动画效果
				pos=[0,0,0];
				this.getPos(pos);
				this.setScale(0.9);
				this.startAniEx(pos,1,1,0,3);
//				else if(this.badToBuild==1)//物资不足
//				{
//					self.appEnv.stateLogs.showLog(textLib["ResNeedForUnit"]);
//				}
			}
		};

		//切换能源训练、能量块训练
		__Page.dlgUnitStore.onTabClk=function(msg,key,way,extra)
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
	}
}
