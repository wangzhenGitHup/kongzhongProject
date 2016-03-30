if(!__Page.dlgCase)
{
	__Page.dlgCase=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,5);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgCase;
	__Page.dlgCase.init=function(appEnv)
	{
		this.name="dlgCase";
		this.viewId="dlgCase";
		this.page.dlgBase.prototype.init.call(this,appEnv);
		
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		//兵种图标区域
		var pic=imgLib.getIcon("chr_UntMarine",128);
		var picW=this.picW=pic.w*2;
		picW=357;
		var picH=this.picH=pic.h*2;
		picH=357;
		var picX=this.picX=this.contentInner[0]+picW/2+10;
		var picY=this.picY=this.contentInner[1]+picH/2+10;
	//	pic=imgLib.getImg("bld_TownHall_b");
		this.picFieldCSS={id:"picField",type:"icon",pos:[picX,picY,0],w:picW,h:picH,anchor_h:1,anchor_v:1,
			items:[{id:"pic-obj",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic,w:picW,h:picH}]
		};

		var boxw=this.boxW;
		//时间提示小字:
	//	this.timeTip=cssLib.textSmall.create(this.cntBox,[boxw-80,20,0],textLib["RemainTime"],150,80,2,1,1,1,[80,80,80]);
		this.timeTip=this.cntBox.appendNewChild({css:cssLib.textSmall.createCSS([boxw-80-14,20+110,0],textLib["RemainTime"],150,80,2,1,1,1,[80,80,80]),font_size:24});

		//时间提示大字:
		this.timeTipBig=cssLib.textFineBig.create(this.cntBox,[boxw-80-2,50+118,0],"30m 40s",150,80,2,1,1,1);

		//花钻提示小字:
	//	this.gemTip=cssLib.textSmall.create(this.cntBox,[boxw-80,80,0],textLib["FinishNow"],150,80,2,1,1,1,[80,80,80]);
		this.gemTip=this.cntBox.appendNewChild({css:cssLib.textSmall.createCSS([boxw-80-14,80+130,0],textLib["FinishNow"],150,80,2,1,1,1,[80,80,80]),font_size:24});

		this.picField=this.cntBox.appendNewChild({css:[this.picFieldCSS]});
		this.picObj=this.picField.getItemById("pic-obj");

		var btnw=200;
		var keyid=appEnv.hudKeys.getKey(this);
		this.btnGemDone=cssLib.btnResGo.create(this.cntBox,[boxw-160-10,130+143,0],180,"gem",btnw,1,keyid,
			appEnv.getVipCapStatus("vipBLDTimeDiscount")?window.aisGame.curCity.vipLevel:0);
		this.regKeyVO(keyid,this,this.onGemClk);

		//Init sub-states:
		//this.dlgPage.dlgCaseInfo.init(appEnv);
	};

	__Page.dlgCase.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=this.page.imgLib;
		var list,i,n,title;
		var textLib=appEnv.textLib;
		var bld,btn,time,gemNum;
		var def,level;
		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			bld=vo.aisBld;
			this.cocBld=vo;
			this.aisBld=bld;
			//这里更新状态:
			time=0;
			gemNum=0;
			if(bld.working)
			{
				time=bld.workTask.getRemainTime();
				gemNum=aisGame.king.convertTime2Gem(time);

				//计算vip打折后的消耗
				DBOut("vip gemNum: "+gemNum+" vs "+this.appEnv.getVipBuildGem(gemNum));
				gemNum=this.appEnv.getVipBuildGem(gemNum);

				def=bld.workTask.prdctDef;
				this.techDef=def;
				level=bld.workTask.techLevel;
				this.techLevel=level;
			}
			this.timeTipBig._setText(this.appEnv.textLib.getTimeText(time));
			this.dlgTitle._setText(def.name);
			if(def.codeName.indexOf("Unit")>-1)
				this.picObj.setTexURL(imgLib.genIconPath(def.icon,512));
			else if(def.codeName.indexOf("Spell")>-1)
				this.picObj.setTexURL(imgLib.genIconPath(def.icon,128));
			this.btnGemDone.setResNum("gem",gemNum,gemNum>aisGame.king.gemNum);
		}
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
		}
	};

	__Page.dlgCase.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(nextState)
		{
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
	};
	
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgCase.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
		
		//建造按钮被点击
		__Page.dlgCase.onTechClk=function(msg,key,way,extra)
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
					self.appEnv.switchDlg(self.dlgPage.dlgCaseInfo,0,{def:def,bld:bld});
					//self.appEnv.closeDlg(null,null,0);
				}
				/*else if(this.badToStart==1)
				{
					//TODO: 改为正确的提示
					self.appEnv.stateLogs.showLog("Not enough resouces!");
				}*/
			}
		};

		__Page.dlgCase.onGemClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var textLib=this.appEnv.textLib;
				var txt=textLib["FinishNow"];
				var time=this.aisBld.workTask.getRemainTime();
				var gemNum=window.aisGame.king.convertTime2Gem(time);

				//计算vip打折后的消耗
				DBOut("vip gemNum: "+gemNum+" vs "+this.appEnv.getVipBuildGem(gemNum));
				gemNum=this.appEnv.getVipBuildGem(gemNum);

				this.appEnv.showPmtDlg(this.page.pmtChoose,0,
					{
						title:txt.substr(0,txt.length-1)+"!",info:textLib.getText(textLib["ConfirmGemFinish"],{gem:gemNum}),
						pmtFunc:function(ok)
						{
							if(ok)
							{
								this.page.vwHomeStage.gemCaseDone();
								this.appEnv.closeDlg(null,null,0);
							}
						},pmtObj:this,pmtParam:null
					}
				);
			}
		}
	}
}
