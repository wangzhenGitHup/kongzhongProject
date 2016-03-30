//--------------------------------------------------------------------------
//与2级对话框相关的函数
//--------------------------------------------------------------------------
{
	//显示一个2级对话框
	__Page.appEnv.showPmtDlg=function(dlg,now,param)
	{
		DBOut("appEnv.showPmtDlg:"+(dlg?dlg.name:"null"));
		if(dlg && (this.nextPmt==dlg || this.curPmt==dlg))
		{
			DBOut("same pmt, next:"+(this.nextPmt==dlg)+", cur:"+(this.curPmt==dlg));
		//	return;
		}
		this.nextPmt=dlg;
		this.pmtParam=param;

		this._showPmtDlg();

		if(this.page.vwHomeStage && this.page.vwHomeStage.clearBtmBtns)
			this.page.vwHomeStage.clearBtmBtns();
	};

	//关闭对话框
	__Page.appEnv.closePmtDlg=function()
	{
		DBOut("appEnv.closePmtDlg");
		if(!this.curPmt)return;
		if(this.curPmt && this.curPmt.closeItem)
			this.curPmt.closeItem.setEnabled(0);
		this.showPmtDlg(null,0,null);
	};

	__Page.appEnv._showPmtDlg=function()
	{
		var preLayer;
		DBOut("appEnv._showPmtDlg, cur:"+(this.curPmt?this.curPmt.name:"null")+", next:"+(this.nextPmt?this.nextPmt.name:"null"));
		var old=this.curPmt;
		var pmt=this.nextPmt;
		if(old)
		{
			old.leave(pmt);
			if(old.pmtPage)
			{
				old.pmtPage.pmtUsage=0;
			}
		}
		else
		{
			if(!this.curPmt)//show new pmt
			{
				DBOut("will de-maketop dlgLayer");
				preLayer=this.pmtLayer.getTopLayer();
				if(preLayer!=this.prePmtLayer)
				{
					this.prePmtLayer=preLayer;
				}
				else
				{
					this.prePmtLayer=this.layer;
				}
				if(this.page.stateCity)
				{
					this.page.stateCity.pauseLUDT();
				}
				this.pmtLayer.makeTop();
				//this.pmtLayer.setDisplay(1);
				this.pmtBoxDock.setDisplay(1);
				this.pmtBoxDock.adRot.setCurValue([-3.1415926535*0.52,0,0]);
				this.pmtBoxDock.adSize.setCurValue([1,1,1]);
				this.pmtBoxDock.adRot.startAni(1,[0,0,0],0);
				this.pmtBoxDock.adSize.startAni(1,[1,1,1],0);
				this.pmtMask.fadeIn(10,0);
			}
		}
		this.curPmt=pmt;
		if(pmt)
		{
		//	DBOut("*** set closePmt 0");
			this.closePmt=0;
			pmt.enter(old,this.pmtParam);
			this.nextPmt=null;
		}
		else//close pmt
		{
		//	DBOut("*** set closePmt 1");
			this.closePmt=1;
			setFrameout(0,function(){
				if(!this.curDlg && !this.curPmt && this.page.vwHomeStage && this.page.vwHomeStage.addBtmBtns)
					this.page.vwHomeStage.addBtmBtns();
		//		DBOut("*** check closePmt:"+this.closePmt);
				if(!this.closePmt)return;
				this.pmtBoxDock.adSize.startAni(1,[1,0,1],0);
				this.pmtLayer.setFrameout(5,function(){this.pmtBoxDock.adSize.startAni(1,[0,0,1],0);},this);
				this.pmtLayer.setFrameout(10,this._pmtClosed,this);
				this.pmtMask.fadeOut(10,0);
			},this);
		}
	};

	__Page.appEnv._pmtClosed=function()
	{
		var i,n,list;
		if(this.nextPagePmtURL)
		{
			this.openPagePmt(this.nextPagePmtURL,this.nextPagePmtParam);
			this.nextPagePmtURL=null;
			this.nextPagePmtParam=null;
		}
		else
		{
			if(!this.curDlg)//【zz】添加判断
			{
				this.layer.makeTop();
			}
			else
			{
				this.dlgLayer.makeTop();
			}
			//this.pmtLayer.setDisplay(0);
			this.pmtBoxDock.setDisplay(0);
			this.prePmtLayer=null;
			if(this.page.stateCity)
			{
				this.page.stateCity.resumeLUDT();
			}
		}

		list=this.subPmtPages;
		if(list)
		{
			n=list.length;
			for(i=0;i<n;i++)
			{
				DBOut("Will close dialog's page");
				if(list[i].pmtUsage<1)
				{
					this.page.removeChild(list[i]);
					list.splice(i,1);
					i--;n--;
				}
			}
		}
	};
}
//--------------------------------------------------------------------------
//挂机检测
//--------------------------------------------------------------------------
{
	__Page.appEnv.initPlayTime=function(doCheck,showCheck,fun,obj)
	{
		var page=this.page;
		this.doCheck=doCheck;
		this.showCheck=showCheck;
		var minuteMS=this.minuteMS=1000*60;//分钟的毫秒
		this.checkGap=minuteMS*0.1;
		var legalTime=this.legalTime=minuteMS*60;
		var cookie=page.getCookie("COC","Rank");
		var ptVo;
		if(cookie)
		{
			DBOut("check time:"+cookie);
			ptVo=fromJSON(cookie);
		}
		else
		{
			ptVo={len:0,status:0};
		}
		this.ptVo=ptVo;
		if(doCheck)
		{
			this.layer.setTimeout(1000*30,function(){
				this.checkPlayTime(fun,obj);
			},this);
		}
		else if(ptVo.status && this.showCheck)
		{
			this.showOnlineCheck(fun,obj);
		}
	};
	__Page.appEnv.doPlayTimeCheck=function(flag)
	{
		var cur=this.doCheck;
		this.doCheck=flag;
		if(!cur && flag && !this.checkTimer)
		{
			this.checkPlayTime();
		}
	};
	__Page.appEnv.showPlayTimeCheck=function(flag)
	{
		var cur=this.showCheck;
		this.showCheck=flag;
		if(!cur && flag)
		{
			if(this.ptVo.status && this.showCheck)
			{
				this.showOnlineCheck();
			}
		}
	};
	__Page.appEnv.getPlayTime=function()
	{
		var ptVo=this.ptVo;
		return ptVo;
	};
//	__Page.appEnv.updatePlayTime=function()
//	{
//		var vo;
//		this.setPlayTime(vo);
//	};
	__Page.appEnv.resetPlayTime=function()
	{
		var vo={len:0,status:0};
		this.setPlayTime(vo);
	};
	__Page.appEnv.setPlayTime=function(vo)
	{
		if(!vo)
		{
			vo=this.ptVo;
		}
		else
		{
			this.ptVo=vo;
		}
		this.page.setCookie("COC","Rank",toJSON(vo),this.minuteMS*30);
	};
	__Page.appEnv.checkPlayTime=function(fun,obj)
	{
	//	return;
		this.checkTimer=null;
		var textLib=this.textLib;
		var page=this.page;
		var layer=this.layer;
		//登录时间：window.aisEnv.svrTime
		//当前时间：window.aisEnv.dateTime()
		var ptVo=this.ptVo;
		DBOut(""+textLib.getTimeText(ptVo.len)+", show:"+this.showCheck);
		ptVo.len+=this.checkGap;
		if(ptVo.len>this.legalTime)
		{
			ptVo.status=-1;
		}
		this.setPlayTime();
		if(ptVo.status && this.showCheck)
		{
			this.showOnlineCheck(fun,obj);
			return;
		}
		if(this.doCheck)
		{
			this.checkTimer=layer.setTimeout(this.checkGap,this.checkPlayTime,this);
		}
	};
	__Page.appEnv.showOnlineCheck=function(fun,obj)
	{
		DBOut("显示挂机检测");
		if(this.checkTimer)
		{
			clearTimeout(this.checkTimer);
			this.checkTimer=null;
		}
		var page=this.page;
		this.showPmtDlg(page.pmtCheck,0,
			{
				title:"",info:"",
				fun:fun,obj:obj,
				pmtFunc:function(ok)
				{
					if(ok)
					{
						DBOut("ok click");
					}
					else
					{
						DBOut("cancel click");
					}
				},pmtObj:this,pmtParam:null
			}
		);
	};
}