if(!__Page.dlgShopBld)
{
	__Page.dlgShopBld=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,0);
	__Page.dlgShopBld.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	};
	__Page.dlgShopBld.init=function(appEnv)
	{
		this.name="dlgShopBld";
		this.viewId="dlgShopBld";
		this.slotVsn=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgShop;
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);

		var keyid;
		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.btnFrame=this.dlgFrame.appendNewChild({
			type:"shape",id:"btnFrame-shopBld",pos:[0,0,0],w:this.boxW,h:this.boxH,border_r:0,border_g:0,border_b:0,border_a:0,face_r:100,face_g:100,face_b:100,face_a:0,ui_event:1,
			display:0,fade_pos:[appEnv.scrSize[0],0,0],fade:1,fade_alpha:0,fade_size:1,
		});
		this.btns=[];

		keyid=appEnv.appKeys.lbShopItems;
		this.lbItems=this.dlgFrame.appendNewChild({
			type:"listbox",id:"lbItems-shopBld",pos:[Math.floor(appEnv.scrSize[0]/2),Math.floor(appEnv.scrSize[1]/2),0.00],w:appEnv.scrSize[0],h:appEnv.scrSize[1]-220,anchor_h:1,anchor_v:1,arrange:1,item_w:300,item_h:appEnv.scrSize[1]-220,item_alpha_down:0.75,ui_event:1,
			key:keyid,anchor_h:1,anchor_v:1,item_alpha_down:1.0,item_alpha_dimmed:1.00,item_size_down:0.95,item_size_check:1.10,end_gap:0,sub_event:2,move_gap:20,fast_scroll:1,show_fx:0,
			display:0,fade:1,fade_size:1,fade_alpha:0,clip:1,
			dlg:this,
		});
		this.regKeyVO(keyid,this,this.onItemClk);
	};
	__Page.dlgShopBld.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg;
		var list,i,n,keyid,btn,css;
		var items,itemx,itemy,item;

		itemx=150;itemy=(appEnv.scrSize[1]-220)/2;//+10;
		//根据VO初始化界面:
		this.infoVO=vo;
		this.lbxResponse=0;
		if(vo)
		{
			homeDlg.dlgTitle._setText(textLib[vo.title]);
			this.lbItems.clearItems();//清除当前的列表
			items=[];
			//DBOut("Catalog: "+vo.catalog);
			list=aisEnv.defLib.bld["catalog"+vo.catalog];
			n=list.length;
			this.infoKeys={};
			for(i=0;i<n;i++)
			{
				items.push(cssLib.btnShopBldItem.createCSS([itemx,itemy,0],list[i],0,appEnv.scrSize[1]-220,"BtnBld_"+list[i]));
			}
			this.lbItems.addItems(items);
		//	n=this.lbItems.getItemNum();
			for(i=0;i<n;i++)
			{
				keyid=appEnv.hudKeys.getKey();
				item=this.lbItems.itemAt(i);
				item.dlg=this;
				item=item.getItemById("InfoBtn");
				item.setKey(keyid);
				this.regKeyVO(keyid,item,this.onInfoClk);
				this.infoKeys[""+keyid]=aisEnv.defLib.bld[list[i]];
			}
		}
		if(!this.btnFrame.getDisplay())
		{
			appEnv.hudIn(this.btnFrame,10);
		}
		appEnv.hudIn(this.lbItems,10);
		appEnv.hudIn(homeDlg.bottomBox,10);
	};
	__Page.dlgShopBld.leave=function(nextState)
	{
		var i,list,n;
		list=this.btns;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.btnFrame.removeChild(list[i]);
		}
		this.lbItems.clearItems();//清除当前的列表
		list.splice(0,n);
		this.appEnv.hudOut(this.btnFrame,10);
		if(!this.homeDlg.btmShow)
			this.appEnv.hudOut(this.dlgPage.dlgShop.bottomBox,10);
		this.appEnv.hudOut(this.dlgPage.dlgShop.btnBack,5);
		this.appEnv.hudOut(this.lbItems,5);

		var appEnv=this.appEnv;
		if(nextState)
		{
		}
		else
		{
			DBOut(this.homeDlg.gemBox+" will deadOut");
			this.homeDlg.gemBox.fadeOut(0,0);
		}
	};
	__Page.dlgShopBld.addButton=function(pos,pic,text,func)
	{
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgShopBld.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
		//建造按钮被点击
		__Page.dlgShopBld.onItemClk=function(msg,key,way,extra)
		{
			var page=this.page;
			var list,cocDefId,aisDef,textLib,item,def;
			textLib=this.appEnv.textLib;
			//this.onClick(msg,way);
		//	DBOut("++++msg="+msg+" key="+key+" extra="+extra+" way="+way);
			if(1==way)
			{
				if(0==msg)
				{
					this.lbxResponse=1;
				}
				else if(2==msg)
				{
					if(this.lbxResponse)
					{
						DBOut("Do lbx reponse!");
						item=this.lbItems.itemAt(extra);
						this.page.audioObject.playSound("btn_click");
						if(item.special==1)
						{
							this.appEnv.stateLogs.showLog(textLib["SpecialItemDesc"]);
						}
						else if(item.badToBld==1)
						{
							if(item.isMax)
								this.appEnv.stateLogs.showLog(textLib["BadBuildMaxCap_WorkerHud"]);
							else
								this.appEnv.stateLogs.showLog(textLib["BadBuildMaxCap"]);
						}
						else if(item.badToBld==2)
						{
						//	this.appEnv.stateLogs.showLog(textLib["ReqNeedForBld"]);
							this.appEnv.stateLogs.showLog(item.numTip);
						}
						else if(item.badToBld==3)
						{
							this.appEnv.stateLogs.showLog(textLib["BadBuildMaxCap_WorkerHud"]);
						}
						else if(item.badToBld==7)
						{//格纳库
							this.appEnv.stateLogs.showLog(textLib["BadBuildMaxCap_WorkerHud"]);
						}
						else if(item.badToBld==0)
						{
							list=aisEnv.defLib.bld["catalog"+this.infoVO.catalog];
							def=aisEnv.defLib.bld[list[extra]];
							if(def)
							{
								DBOut("Will build: "+def.name);
								cocDefId=def.levels[0].cocDefName;
								cocDefId=page.vwHomeStage.level.getObjDefIdx(cocDefId);
								if(cocDefId>=0)
								{
									this.page.vwHomeStage.askNewBldPos(cocDefId,0,2);
								}
								this.appEnv.closeDlg(null,null,0);
							}
						}
					}
					this.lbxResponse=0;
				}
			}
		};
		//信息按钮被点击
		__Page.dlgShopBld.onInfoClk=function(msg,key,way,extra)
		{
			var dlg=this.getFather().dlg;
			dlg.lbxResponse=0;
			var appEnv=dlg.appEnv;
			var page=dlg.page;
			//this.onClick(msg,way);
			if(1==way && 1==msg)
			{
				DBOut("Will show info: "+extra);
				var def=dlg.infoKeys[key];
			//	DBOut(toJSON(def));
				appEnv.showPmtDlg(page.pmtInfo,0,{title:def["name"],info:def["desc"]});
			}
		};
	}
}
