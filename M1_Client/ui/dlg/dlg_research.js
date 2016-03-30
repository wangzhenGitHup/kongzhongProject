if(!__Page.dlgResearch)
{
	__Page.dlgResearch=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgResearch;
	__Page.dlgResearch.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;
		
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		
		var pic=imgLib.getIcon("Unit1",128);
		var infoX=this.infoBoxX=this.contentInner[0];
		var infoY=this.infoBoxY=this.contentInner[1];
		var infoW=this.infoBoxW=this.contentW-this.contentInner[0]*2;
		var infoH=this.infoBoxH=pic.h;
		this.infoBoxCSS={id:"infoBox",type:"div3x3",pos:[infoX,infoY,0],w:infoW,h:infoH,css:imgLib.getImg("box_green"),};
		var techX=this.techListX=infoX;
		var techY=this.techListY=infoY+infoH+this.dt;
		var techW=this.techListW=infoW;
		var techH=this.techListH=this.contentH-techY-this.contentInner[1];
		this.techListCSS={
			type:"listbox",id:"lbx-tech",pos:[techX,techY,0],w:techW,h:techH,anchor_h:0,anchor_v:0,arrange:1,item_w:64+this.dt*2,item_h:(64+this.dt*2)*2,
			ui_event:1,sub_event:1,dlg:this,
			item_alpha_down:1.0,item_alpha_dimmed:1.00,item_size_down:1.0,item_size_check:1.10,end_gap:1,move_gap:20,fast_scroll:1,show_fx:0,
			display:0,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		this.techBoxCSS={id:"techBox",type:"icon",pos:[techX,techY-infoH,0],w:techW,h:techH,anchor_h:0,anchor_v:0,ui_event:1};
	};
	__Page.dlgResearch.init=function(appEnv)
	{
		this.name="dlgResearch";
		this.viewId="dlgResearch";
		this.slotVsn=0;
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
			hud=this.dlgFrame.appendNewChild({id:"tab-"+str,css:cssLib.normalBtn.createCSS([x,y,0],keyid,2,textLib["Research"+str]),display:0,fade:1,fade_pos:[x,y,0],fade_size:1,fade_alpha:0});
			hud.appendNewChild({id:"res",type:"icon",pos:[btnW/2,0,0],w:resSize,h:resSize,anchor_h:2,anchor_v:1,css:imgLib.getIcon("Oil"==str?"res_oil":"res_cube",64)});
			hud.firstChild().setPos([-10,0,0]);
			this.tabBtns.push(hud);
			this.tabKeys[keyid+""]=this.tabKeys[str]={tab:str,key:keyid,hud:hud};
		}
	};

	__Page.dlgResearch.initBtns=function()
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
		var btn,defLib,list,i,n,def,x,y,css,btnw,btnh;
		
	//	this.infoBox=this.cntBox.appendNewChild({css:[this.infoBoxCSS]});
		this.techBox=this.cntBox.appendNewChild({css:[this.techBoxCSS]});
		
	//	keyid=appEnv.hudKeys.getKey();
	//	this.lbItems=this.cntBox.appendNewChild({css:[this.techListCSS],key:keyid});
	//	this.regKeyVO(keyid,this,this.onItemClk);
		//标签按钮
		for(i=0; i<this.tabBtns.length; i++)
		{
			appEnv.hudIn(this.tabBtns[i],0);
		}
		
		//初始化单位按钮
		btnw=150+this.dt*2;
		btnh=150+this.dt*2;
		var bx=(this.techListW-btnw*5)/2;
		var by=this.dt;
		
		this.techBtns=[];
		defLib=window.aisEnv.defLib.tech;
		list=defLib.genlTechs;
		n=list.length;
		for(i=0;i<n;i++)
		{
			def=defLib[list[i]];
			x=bx+(i%5)*btnw+btnw/2;
			y=Math.floor(i/5)*btnh+btnh/2;
			keyid=appEnv.appKeys.bldTrainUnit_1-(i?i:0)*2;
			css=cssLib.btnResearch.createCSS(def,x,y,keyid);
			btn=this.techBox.appendNewChild(css);
			btn.def=def;
			btn.dlg=this;
			this.techBtns.push(btn);
			this.regKeyVO(keyid,btn,this.onTechClk);
		}
		//Init sub-states:
		this.dlgPage.dlgResearchInfo.init(appEnv);
	};

	__Page.dlgResearch.enter=function(preState,vo)
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
		if(vo)
		{
			this.infoVO=vo;
			bld=vo.aisBld;
			title=window.aisEnv.textLib.bldName[this.infoVO.aisDef.codeName];//textLib.barracksDlgTitle(bld);
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

	__Page.dlgResearch.leave=function(nextState)
	{
		var appEnv=this.appEnv;
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
		}
		else
		{
		}
		appEnv.clearDlgAniCall();
	};

	//切换兵营bld
	__Page.dlgResearch.updateStorage=function()
	{
		if(!this.curTabInfo)
		{
			var str="Oil";
			this.curTabInfo=this.tabKeys[str];
		}
		var kvo=this.curTabInfo;
		this.onTabClk(1,kvo.key,1,-1);
		var bld=this.infoVO.aisBld;
		this.cocBld=this.infoVO;
		this.aisBld=bld;
		this.updateAllBtn();
	};

	//切换能源训练、能量块训练
	__Page.dlgResearch.updateMakeBtn=function()
	{
		this.updateAllBtn();
	};

	__Page.dlgResearch.updateAllBtn=function()
	{
		var defLib, units, def;
		defLib=window.aisEnv.defLib.tech;
	//	units=defLib.allUnits;
		units=this.curUnits;
		//TODO: 更新按钮
		DBOut("更新所有制造单位的按钮");
		var list,i,n,btn,bld;
		list=this.techBtns;
		n=list.length;
		bld=this.aisBld;
		for(i=0;i<n;i++)
		{
			def=defLib[units[i]];
			btn=list[i];
			btn.update(bld,def);
		}
	};
	
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgResearch.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
		
		//建造按钮被点击
		__Page.dlgResearch.onTechClk=function(msg,key,way,extra)
		{
			var self,def;
			var list,i,n,btn,bld;
			self=this.dlg;
			if(msg==1 && way==1 && extra==1)
			{
				//if(!this.badToStart)
				{
					def=this.def;
					bld=self.aisBld;
					self.appEnv.switchDlg(self.dlgPage.dlgResearchInfo,0,{def:def,bld:bld});
					//self.appEnv.closeDlg(null,null,0);
				}
				/*else if(this.badToStart==1)
				{
					//TODO: 改为正确的提示
					self.appEnv.stateLogs.showLog("Not enough resouces!");
				}*/
			}
		};

		//切换能源训练、能量块研究
		__Page.dlgResearch.onTabClk=function(msg,key,way,extra)
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
				var defLib=window.aisEnv.defLib.tech;
				if("Oil"==this.curTabInfo.tab)
					this.curUnits=defLib["genlTechs"];
				else if("Cube"==this.curTabInfo.tab)
					this.curUnits=defLib["cubeTechs"].concat(defLib["gemTechs"]);
				if(-1!=extra)
					this.updateMakeBtn();
			//	this.appEnv.switchDlg(this,0,this.infoVO);
			}
		};
	}
}
