if(!__Page.dlgPartStorage)
{
	__Page.dlgPartStorage=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgPartStorage.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var textLib=this.appEnv.textLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//底部区域
		var btmBoxW=this.btmBoxW=cntW-20;
		var btmBoxH=this.btmBoxH=66-4;
		var btmBoxX=this.btmBoxX=cntW/2;
		var btmBoxY=this.btmBoxY=cntH-cntInner[1]/2-btmBoxH/2;
		this.btmBoxCSS={id:"btmBox",type:"div3x3",pos:[btmBoxX,btmBoxY+2,0],w:btmBoxW,h:btmBoxH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green"),
			color_r:184,color_g:189,color_b:115,color_a:180,
			items:[{css:cssLib.textFineMid.createCSS([0,0,0],textLib["SelMechToRemove"],btmBoxW,btmBoxH,1,1,1,1)}]
		};
		//
		this.trainX=40, this.trainY=60;
		var listX=this.trainX;
		var listY=this.trainY;
		var listW=this.contentW-listX*2;
		var listH=320;
		var itemW=listW;
		var itemH=150;
		this.lbxPartsCSS={type:"listbox",id:"lbx-parts",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,//dlg:state,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		this.lbxPartsLineCSS={type:"icon",id:"lbx-line",pos:[0,0,0],w:itemW,h:itemH,ui_event:1};
	};
	__Page.dlgPartStorage.init=function(appEnv)
	{
		this.name="dlgPartStorage";
		this.viewId="dlgPartStorage";
		this.slotVsn=0;
		this.rmCap=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgPart;
		var keyid=0;
		//制定关闭/返回按钮的行为
	//	this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);
		//生产入口按钮
		keyid=homeDlg.menuPart.getKey();
		this.regKeyVO(keyid,homeDlg,homeDlg.onProductionClk);
		//强化入口按钮
		keyid=homeDlg.menuEnhance.getKey();
		this.regKeyVO(keyid,homeDlg,homeDlg.onEnhanceClk);

		var boxw,boxh,btn,slots,slotName,list,i,n,x,y,css,btnw,btnh,listn,lbxLine;

		DBOut("dlgPartStorage.init: "+appEnv);

		boxw=this.boxW;
		boxh=this.boxH;
		var cntW=this.contentW;

		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({id:"contentField-info",css:[this.contentFieldCSS],display:0});

	//	this.cntBox.appendNewChild({type:"text",pos:[10,10,0],color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["MechPart"],font_size:FS.M});
		this.cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([10,20,0],textLib["MechPart"],100,30,0,0,0,0)});
		this.cntBox.appendNewChild({type:"text",pos:[42,400,0],color_r:0,color_g:0,color_b:0,color_a:160,text:textLib["RemoveInfo"],w:580,h:40,wrap:1,font_size:FS.M});
		this.lbxParts=this.cntBox.appendNewChild(this.lbxPartsCSS);
		//初始化单位按钮
		btnw=(boxw-20-240-4*150)/4+150;
		btnh=(boxh-80-240-150-150)+150;

		storage=window.aisGame.curCity.partStorage;
		list=[];
		slots=storage.slots;
		for(slotName in slots)
		{
		//	DBOut(slotName+", "+slots[slotName].num);
			if(slots[slotName].num>0)
				list.push(slots[slotName]);
		}
		this.prtBoxes=[];
		n=parseInt(storage.getValue("maxLoad"));
		listn=Math.ceil(n/5);
		listn=listn<2?2:listn;
		for(i=0;i<listn;i++)
		{
			this.lbxParts.addItem(this.lbxPartsLineCSS);
		}
		for(i=0;i<n;i++)
		{
			x=(i%5)*btnw+btnw/2;
			y=btnh/2;//Math.floor(i/5)*btnh;
			keyid=appEnv.appKeys.bldTrainUnit_1-(i?i:0)*2;
			css=this.dlgPage.dlgCSSBoxPrt.createCSS(page,appEnv,x,y,keyid);
		//	DBOut("pos: "+css.pos[0]+", "+css.pos[1]);
			lbxLine=this.lbxParts.itemAt(Math.floor(i/5));
			btn=lbxLine.appendNewChild(css);
			btn.sel=btn.appendNewChild({type:"div3x3",pos:[0,0,0],w:168,h:168,css:imgLib.getImg("box_sel"),anchor_h:1,anchor_v:1,display:0});
			btn.dlg=this;
			this.prtBoxes.push(btn);
			this.regKeyVO(keyid,btn,this.onPartClk);
			this.regKeyVO(keyid-1,btn,this.onPartInfoClk);
		}
		for(;i<10;i++)
		{
			x=(i%5)*btnw+btnw/2;
			y=btnh/2;
			lbxLine=this.lbxParts.itemAt(Math.floor(i/5));
			lbxLine.appendNewChild({
				type:"icon",pos:[x,y,0],css:cssLib.boxSolid,w:150,h:150,color_r:120,color_g:120,color_b:120,color_a:128,anchor_h:1,anchor_v:1
			});
		}
		this.btmBox=this.cntBox.appendNewChild({css:this.btmBoxCSS});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onRemoveClk);
		this.btnRemove=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS([740,416,0],keyid,1,textLib["Delete"])});
		// this.selFrame=this.lbxParts.appendNewChild({type:"div3x3",pos:[0,0,0],w:168,h:168,css:imgLib.getImg("box_sel"),anchor_h:1,anchor_v:1,display:0});
	};

	__Page.dlgPartStorage.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var list,i,n,title;
		var textLib=appEnv.textLib;
		var bld,btn;

		this.homeDlg.menuPart.setEnabled(1);
		this.homeDlg.menuStorage.setEnabled(0);
		this.homeDlg.menuEnhance.setEnabled(1);
		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			bld=vo.aisBld;
			this.cocBld=vo;
			this.aisBld=bld;
			this.slotVsn=-1;
			list=this.prtBoxes;
			n=list.length;
			for(i=0;i<n;i++)
			{
				btn=list[i];
			//	btn.update(bld);
			}
		}
		this.aisBld=this.homeDlg.aisBld;
	//	this.aisBld.addUIView(this);
		this.updateView();
		if(preState)
		{
			appEnv.hudIn(this.cntBox,20);
		}
	};

	__Page.dlgPartStorage.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
	//	bld.removeUIView(this);
		if(this.updateTimeTimer)
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
		if(nextState)
		{
			appEnv.hudOut(this.cntBox,10);
		}
		else
		{
			this.dlgPage.dlgPart.removeUIView();
		}
	};

	__Page.dlgPartStorage.cleanPrtBoxesSel=function()
	{
		if(!this.prtBoxes)
			return;
		for(var i=0;i<this.prtBoxes.length;i++)
		{
			this.prtBoxes[i].sel.setDisplay(0);
		}
	};
	__Page.dlgPartStorage.aisUpdateView=function()
	{
		this.updateView(1);
	};

	__Page.dlgPartStorage.updateView=function(hold)
	{
		var storage;
		var list,slots,slotName,i,n;
		storage=aisGame.curCity.partStorage;
		list=[];
		slots=storage.slots;
		for(slotName in slots)
		{
		//	DBOut(slotName+", "+slots[slotName].num+", "+(slots[slotName].num>0));
			if(slots[slotName].num>0)
				list.push(slots[slotName]);
		}
		n=list.length;
		DBOut("Storate slot num: "+n+"  "+this.prtBoxes);
		for(i=0;i<n;i++)
		{
			this.prtBoxes[i].update(list[i].def,list[i].subType,list[i].lockNum,list[i].subInfo.level);
		}
		list=this.prtBoxes;
		n=list.length;
		for(;i<n;i++)
		{
			list[i].update(null,null,0);
		}
	//	if(!hold)
			this.onPartClk.call(this.prtBoxes[0],1,0,1,1);
	//	else
	//		this.btnRemove.setEnabled(0);
	};
	
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgPartStorage.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
			{
				//DBOut("dlgPartStorage.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//建造按钮被点击
		__Page.dlgPartStorage.onPartClk=function(msg,key,way,extra)
		{
			var self,def;
			var list,i,n,btn,bld;
			self=this.dlg;
			if(msg==1 && way==1)
			{
				self=this.dlg;
				def=this.part;
				self.selPart=this;

				// var pos=[];
				// this.getPos(pos);
				// pos[1]+=150*Math.floor(this.index/5);
				// self.selFrame.setPos(pos);
				// self.selFrame.setDisplay(1);
			//	DBOut("=== "+this.part+" "+this.locked);
				self.cleanPrtBoxesSel();
				this.sel.setDisplay(1);
				if(this.part && !this.locked)
					self.btnRemove.setEnabled(1);
				else
					self.btnRemove.setEnabled(0);
			}
		};

		//部件信息被点击
		__Page.dlgPartStorage.onPartInfoClk=function(msg,key,way,extra)
		{
			var self,def;
			var list,i,n,btn,bld;
			self=this.dlg;
			if(msg==1 && way==1)
			{
			//	DBOut("onPartInfoClk");
				self=this.dlg;
				def=this.part;
				self.appEnv.switchDlg(self.dlgPage.dlgPartInfo,0,{dlg:self,def:def,instance:this.subType,level:this.level,type:1});
			}
		};

		//回收部件
		__Page.dlgPartStorage.onRemoveClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("onRemoveClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var prt=this.selPart;
				var def=prt.part;
				var aisBld=this.aisBld;
				appEnv.showPmtDlg(this.page.pmtChoose,0,
					{
						title:textLib["ConfirmDelPart"],info:textLib.getTextEx("ConfirmDelPartDesc",{name:def.name}),
						pmtFunc:function(ok){
							if(ok)
							{
								window.aisGame.king.execCmd(aisBld,"RemovePart",{codeName:def.codeName,subType:prt.subType,num:1},aisBld);
								this.updateView();
							}
						},pmtObj:this
					}
				);
			}
		};
	}
}
