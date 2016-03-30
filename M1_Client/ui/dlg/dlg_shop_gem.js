if(!__Page.dlgShopGem)
{
	__Page.dlgShopGem=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,0);
	__Page.dlgShopGem.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	};
	__Page.dlgShopGem.init=function(appEnv)
	{
		this.name="dlgShopGem";
		this.viewId="dlgShopGem";
		this.slotVsn=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgShop;
		//DBOut("homeDlg="+homeDlg);
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);

		var keyid;
		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.btnFrame=this.dlgFrame.appendNewChild({
			type:"shape",id:"btnFrame-shopGem",pos:[0,0,0],w:this.boxW,h:this.boxH,border_r:0,border_g:0,border_b:0,border_a:0,face_r:100,face_g:100,face_b:100,face_a:0,ui_event:1,
			display:0,fade_pos:[appEnv.scrSize[0],0,0],fade:1,fade_alpha:0,fade_size:1,
		});
		this.btns=[];

		keyid=appEnv.hudKeys.getKey();
		this.lbItems=this.dlgFrame.appendNewChild({
			type:"listbox",id:"lbItems-shopGem",pos:[Math.floor(appEnv.scrSize[0]/2),Math.floor(appEnv.scrSize[1]/2),0.00],w:appEnv.scrSize[0],h:appEnv.scrSize[1]-220,anchor_h:1,anchor_v:1,arrange:1,item_w:300,item_h:appEnv.scrSize[1]-220,item_alpha_down:0.75,ui_event:1,
			key:keyid,anchor_h:1,anchor_v:1,item_alpha_down:1.0,item_alpha_dimmed:1.00,item_size_down:0.95,item_size_check:1.10,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,
			display:0,fade:1,fade_size:1,fade_alpha:0,sub_event:1,clip:1,
			dlg:this,
		});
		this.regKeyVO(keyid,this,this.onItemClk);

		var picBG=imgLib.getImg("pic_plan"),picMenu=this.picMenu=imgLib.getImg("btn_type_u"),picMenu_d=this.picMenu_d=imgLib.getImg("btn_type_d");
		var menuW=this.menuW=picMenu.w+1,menuH=this.menuH=picMenu.h;
		this.menuBox=this.dlgFrame.appendNewChild({type:"icon",pos:[(this.boxW-picBG.w)/2,0,0],ui_event:1,css:picBG,display:0});
		var lbxW=menuW*4,lbxH=menuH,lbxX=Math.floor((picBG.w-lbxW)/2)+lbxW/2,lbxY=lbxH/2;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMenuClk);
		this.lbxMenu=this.menuBox.appendNewChild({
			type:"listbox",id:"lbx-menu",pos:[lbxX,lbxY,0],w:lbxW,h:lbxH,arrange:1,item_w:menuW,item_h:menuH,item_alpha_down:0.75,ui_event:1,clip:1,
			key:keyid,anchor_h:1,anchor_v:1,item_alpha_down:1.0,item_alpha_dimmed:1.00,item_size_down:1,item_size_check:1.10,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,
			display:1,fade:1,fade_size:1,fade_alpha:0,sub_event:1,
		});
	};

	__Page.dlgShopGem.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg;

		var king=window.aisGame.king;
	//	king.gemNum=0;/////////////////
		var i,j,list,def;
		//根据VO初始化界面:
		if("Gem"==vo.catalog)
		{
			this.infoVO=vo={title:textLib["SpecialSupply"],def:[]};

			this.payTypes=[];
			//DBOut("DeviceType:"+window.DeviceType+",KZPurchase:"+window.KZPurchase);
//			for( var i in window.PUR._purchase)
//				Dialogs.alert(i+":"+window.PUR._purchase[i]);
/**/
			for(i in window.PUR._purchase)
			{
//				DBOut(i+":::"+window.PUR._purchase[i]);
				this.payTypes.push(i);
			}
//			DBOut("_purchase="+toJSON(window.PUR._purchase));
			DBOut("payTypes="+this.payTypes);
			if(this.payTypes.length<=1)
			{
				this.showUI(0);
			}
			else if(this.payTypes.length>1)
			{
				this.menuBox.setDisplay(1);
				this.curStateId=-1;
				for(var i=0; i<this.payTypes.length; i++)
				{
					this.lbxMenu.addItem({type:"key",pos:[this.menuW/2,this.menuH/2,0],anchor_h:1,anchor_v:1,css:this.picMenu,ui_event:1,button:1,down_scale:0.98,
						state_up:this.picMenu,state_down:this.picMenu_d,state_gray:this.picMenu_d,items:[
							{css:cssLib.textFineMid.createCSS([0,0,0],textLib["Pay"+this.payTypes[i]],this.menuW,this.menuH,1,1,1,1)}
						]});
				}
				this.onMenuClk(2,0,1,0);
			}
/**/
		}
		else if("Shields"==vo.catalog)
		{
			homeDlg.btnBack.setDisplay(0);
			var city=window.aisGame.curCity;
			DBOut("cd:"+city.cooldownTime);//shieldTime
			var cdTime=city.cooldownTime-city.env.dateTime();
			if(cdTime<0)
				cdTime=0;
			var bad=0;
		//	if(cdTime>0)
		//		bad=3;
			this.infoVO={title:textLib["Shield"],def:[]};
			list=window.aisEnv.defLib.buff["catalog"+vo.catalog];
			j=0;
			for(i=0; i<list.length; i++)
			{
				j++;
				bad=0;
				def=window.aisEnv.defLib.buff[list[i]];
			//	DBOut(toJSON(def));
				cdTime=this.getShieldCD(def["codeName"]);
				if(cdTime>0)
					bad=3;
				this.infoVO.def.push({name:def["name"],desc:def["desc"],codeName:def["codeName"],costRes:"Gem",costValue:def["cost"]["gem"],rewardRes:"",rewardValue:"",icon:"shield"+j,
					bad:bad,cd:cdTime,cooldown:def["cooldown"]});
			}
			this.addButton();
		}else if("Special"==vo.catalog)
		{
			this.infoVO={title:textLib["Special"],def:[],catalog:"Special"};
			this.showLoading(0);
			this.dwrObj=this.appEnv.newMsg(["M1UserCenterDwr","getCounterVO"],{cb:function(vo){
			DBOut("getCounterVO: "+toJSON(vo));
			this.closeLoading();
			this.dwrObj=null;
			list=window.aisEnv.defLib.shopSpecial.catalogShopSpecial;
			var times=window.aisGame.curCity.times;
			var curTimes,curDaliyTimes,curGlobalTimes,
			j=0;
			for(i=0; i<list.length; i++)
			{
				def=window.aisEnv.defLib.shopSpecial[list[i]];
				curTimes=0;
				curDaliyTimes=0;
				curGlobalTimes=0;
				if(times)
					for(j=0;j<times.length;j++)
					{
						if(times[j].codename==def.codeName)
						{
							curTimes=times[j].times;
							curDaliyTimes=times[j].dailyTimes;
							// curGlobalTimes=times[j].globalTimes;
						}
					}
				if(vo)
					for(j=0;j<vo.length;j++)
					{
						if(vo[j].codename==def.codeName)
							curGlobalTimes=def.globalTimes-vo[j].num;
					}
				this.infoVO.def.push({
					name:def.ItemName,desc:def.ItemDesc,codeName:def.codeName,
					icon:def.Icon,personalTimes:def.personalTimes,personalDailyTimes:def.personalDailyTimes,globalTimes:def.globalTimes,
					reqs:def.cost,needGem:def.cost.gem,curTimes:curTimes?curTimes:0,curDaliyTimes:curDaliyTimes?curDaliyTimes:0,curGlobalTimes:curGlobalTimes?curGlobalTimes:0,
				});
			}
			this.addButton();
		},cbobj:this,eh:function(){this.dwrObj=null;this.txtLoading.setText(this.appEnv.textLib["GetInfoError"]);},ehobj:this},window.UserCenter);
		
			
		};
		homeDlg.dlgTitle._setText(this.infoVO.title);
		if(!this.btnFrame.getDisplay())
		{
			appEnv.hudIn(this.btnFrame,10);
		}
		appEnv.hudIn(this.lbItems,10);
		appEnv.hudIn(homeDlg.bottomBox,10);
	};

	__Page.dlgShopGem.leave=function(nextState)
	{
		var i,list,n;
		list=this.btns;
		n=list.length;
		for(i=0;i<n;i++)
		{
			this.btnFrame.removeChild(list[i]);
		}
		list.splice(0,n);
		this.appEnv.hudOut(this.btnFrame,10);
		if(!this.homeDlg.btmShow)
			this.appEnv.hudOut(this.dlgPage.dlgShop.bottomBox,10);
		this.appEnv.hudOut(this.dlgPage.dlgShop.btnBack,5);
		this.appEnv.hudOut(this.lbItems,5);
		this.menuBox.setDisplay(0);
		this.lbxMenu.clearItems();
		this.lbItems.clearItems();
		this.closeLoading();
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

	__Page.dlgShopGem.getPayVO=function(vo,extra)
	{
		DBOut("getPayVO:"+extra);
		this.pVO=[];
		if(!window.aisEnv.defLib.pay)
			return;
		var cat=this.payTypes[extra];
		DBOut("cat="+cat);
		var pvos=window.aisEnv.defLib.pay.catalog[cat];
		if(pvos)
		{
			var city=window.aisGame.curCity, mvo=city.monthCardVO;
		//	DBOut("monthCardVO:"+toJSON(mvo));
			var cdTime=mvo.expire-city.env.dateTime();
			if(cdTime<0 || !cdTime)
				cdTime=0;
			var dayMs=1000*60*60*24;
		//	cdTime=dayMs+1000*60*60*9.3;
			if(cdTime>dayMs)
				cdTime=cdTime-cdTime%dayMs;
		//	DBOut("=== "+(cdTime%dayMs));
			var thTime=this.appEnv.getBuffRemainTimeByName();
			var resCardCD=0;

			var pvo,pVO=[],info;
			var n=1;
			DBOut("AppVersion="+window.AppVersion+" "+(window.AppVersion<1.06));
			for(i in pvos)
			{
				pvo=pvos[i];
				if(("MonthCard"==pvo["Action"] || "WeekCardRes12"==pvo["Action"] || "WeekCardRes68"==pvo["Action"] || "WeekCardCube68"==pvo["Action"]) && window.USERID<20000)
					continue;
				if(!pvo["PayID"] || pvo["UnDispaly"])
					continue;
				if("IPHONE"==window.DeviceType && window.AppVersion<1.06 && "M1_gift_token00_6"==pvo["PayID"])
					continue;
				info={name:pvo["ItemName"],codeName:pvo["PayID"],costRes:pvo["CostType"],costValue:(pvo["CostNumber"]/100),
					rewardRes:pvo["ResType"],rewardValue:pvo["ResNumber"],icon:pvo["Icon"],bad:0,payVO:pvo};//icon:"gemPack"+n,
			//	if("Rmb"==info.costRes && 30==info.costValue)
				if("MonthCard"==pvo["Action"])
				{
					info.monthCard=1;
					info.cardRemain=cdTime;
				//	info.bad=1;
				}
				else if("MonthCard15"==pvo["Action"])
				{
					info.msgCard=1;
				}
				else if("TH"==pvo["Action"])
				{
					info.thCard=1;
					info.cardRemain=thTime;
				}
				else if("CubeCard"==pvo["Action"])
				{
					info.thCard=2;
					info.cardRemain=thTime;
				}
				else if("WeekCardRes12"==pvo["Action"] || "WeekCardRes68"==pvo["Action"] || "WeekCardCube68"==pvo["Action"])
				{
					resCardCD=this.appEnv.getBuffRemainTimeByName(pvo["Action"]);
				//	resCardCD=1368475;
					if("WeekCardRes68"==pvo["Action"])
						info.resCard=1;
					else if("WeekCardCube68"==pvo["Action"])
						info.resCard=3;//超级能量卡
					else
						info.resCard=2;
					
					info.cardRemain=resCardCD;
					if(resCardCD)
						info.bad=1;
				}
				else if("Gift"==pvo["Action"] || "Gift2"==pvo["Action"])
				{
					info.giftCard=1;
					info.rewardValue="";
				//	if(pvo["CostNumber"]>window.aisGame.king.gemNum)
				//		info.bad=1;
				}
				pVO.push(info);
			//	if(2==n)
			//		n++;
				n++;
			}
			this.pVO=pVO;
		}
		if(pVO)
		{
			//DBOut("pvo len:"+pVO.length);
			vo.def=vo.def.concat(this.pVO);
		}
	};

	__Page.dlgShopGem.getSpecialVO=function(vo)
	{
		DBOut("getSpecialVO");
		this.sVO=[];
		var cVO,store,sVO=[];
		var textLib=this.appEnv.textLib;
/**/
		var num=window.aisGame.curCity.getValue("numBldCubeCan");
		if(num)
		{
			store=window.aisGame.curCity.cubeStorage;
		//	for(var i in store)DBOut("*** "+i+":"+store[i]);
			cVO=this.getResCostVO(store,0.1);
			sVO.push({name:textLib["FillRes"]("Cube",10),codeName:"cube1",costRes:"Gem",costValue:cVO.gem,rewardRes:"Cube",rewardValue:cVO.res,icon:"token1",bad:cVO.bad});
			cVO=this.getResCostVO(store,0.5);
			sVO.push({name:textLib["FillRes"]("Cube",50),codeName:"cube2",costRes:"Gem",costValue:cVO.gem,rewardRes:"Cube",rewardValue:cVO.res,icon:"token2",bad:cVO.bad});
			cVO=this.getResCostVO(store,0);
			sVO.push({name:textLib["FillRes"]("Cube",100),codeName:"cube3",costRes:"Gem",costValue:cVO.gem,rewardRes:"Cube",rewardValue:cVO.res,icon:"token3",bad:cVO.bad});
		//	sVO.push({name:this.appEnv.textLib["TokenName"+i],codeName:token,costRes:"Gem",costValue:gemNum,rewardRes:"cash",rewardValue:num,icon:"token"+(i+1),token:1});
		}
/**/
		store=window.aisGame.curCity.goldStorage;
		cVO=this.getResCostVO(store,0.1);
		sVO.push({name:textLib["FillRes"]("Gold",10),codeName:"gold1",costRes:"Gem",costValue:cVO.gem,rewardRes:"Gold",rewardValue:cVO.res,icon:"gold1",bad:cVO.bad});
		cVO=this.getResCostVO(store,0.5);
		sVO.push({name:textLib["FillRes"]("Gold",50),codeName:"gold2",costRes:"Gem",costValue:cVO.gem,rewardRes:"Gold",rewardValue:cVO.res,icon:"gold2",bad:cVO.bad});
		cVO=this.getResCostVO(store,0);
		sVO.push({name:textLib["FillRes"]("Gold",100),codeName:"gold3",costRes:"Gem",costValue:cVO.gem,rewardRes:"Gold",rewardValue:cVO.res,icon:"gold3",bad:cVO.bad});

		store=window.aisGame.curCity.oilStorage;
		cVO=this.getResCostVO(store,0.1);
		sVO.push({name:textLib["FillRes"]("Oil",10),codeName:"oil1",costRes:"Gem",costValue:cVO.gem,rewardRes:"Oil",rewardValue:cVO.res,icon:"oil1",bad:cVO.bad});
		cVO=this.getResCostVO(store,0.5);
		sVO.push({name:textLib["FillRes"]("Oil",50),codeName:"oil2",costRes:"Gem",costValue:cVO.gem,rewardRes:"Oil",rewardValue:cVO.res,icon:"oil2",bad:cVO.bad});
		cVO=this.getResCostVO(store,0);
		sVO.push({name:textLib["FillRes"]("Oil",100),codeName:"oil3",costRes:"Gem",costValue:cVO.gem,rewardRes:"Oil",rewardValue:cVO.res,icon:"oil3",bad:cVO.bad});

		this.sVO=sVO;
		vo.def=vo.def.concat(this.sVO);
	};

	__Page.dlgShopGem.getVipVO=function(vo)
	{
		DBOut("getVipVO");
		var appEnv=this.appEnv;
		this.vipVO=[];
		var cVO,store,sVO=[],resNum=0;
		var textLib=this.appEnv.textLib;
		if(window.aisGame.curCity.vipLevel)
		{
			if(appEnv.getVipCapStatus("vipLimitedSalesGold"))
			{
				store=window.aisGame.curCity.goldStorage;
				resNum=this.appEnv.getVipRes("gold");
				cVO=this.getResCostVO(store,resNum);
				sVO.push({name:textLib["VipGold"],codeName:"gold1",costRes:"Gem",costValue:cVO.gem,rewardRes:"Gold",rewardValue:cVO.res,icon:"gold1",bad:cVO.bad,vip:cVO.vip,vipBad:cVO.vipBad});
			}

			if(appEnv.getVipCapStatus("vipLimitedSalesElixir"))
			{
				store=window.aisGame.curCity.oilStorage;
				resNum=this.appEnv.getVipRes("oil");
				cVO=this.getResCostVO(store,resNum);
				sVO.push({name:textLib["VipOil"],codeName:"oil1",costRes:"Gem",costValue:cVO.gem,rewardRes:"Oil",rewardValue:cVO.res,icon:"oil1",bad:cVO.bad,vip:cVO.vip,vipBad:cVO.vipBad});
			}

			if(appEnv.getVipCapStatus("vipLimitedSalesCube"))
			{
				store=window.aisGame.curCity.cubeStorage;
				resNum=this.appEnv.getVipRes("cube");
				cVO=this.getResCostVO(store,resNum);
				sVO.push({name:textLib["VipCube"],codeName:"cube1",costRes:"Gem",costValue:cVO.gem,rewardRes:"Cube",rewardValue:cVO.res,icon:"cube1",bad:cVO.bad,vip:cVO.vip,vipBad:cVO.vipBad});
			}
		}

		this.vipVO=sVO;
		vo.def=vo.def.concat(this.vipVO);
	};

	__Page.dlgShopGem.getResCostVO=function(storage,rate)
	{
		var appEnv=this.appEnv;
		var maxCap,curCap,remainCap,resNum,gemNum,bad=0,vip=0,vipBad=0;
		maxCap=storage.getTotalCap();
		curCap=storage.getUsedCap();
		remainCap=maxCap-curCap;
		if("Cube"==storage.storeMark)
		{
			DBOut("maxCap: "+maxCap+", curCap:"+curCap+", remainCap:"+remainCap);
		}
		if(rate<=1)
		{
			if(rate)
				resNum=Math.floor(maxCap*rate);
			else
				resNum=maxCap-curCap;
			if(resNum>remainCap || 0==resNum)
				bad=1;
			gemNum=window.aisGame.king.convertRes2Gem(resNum);
			if("Cube"==storage.storeMark)
			{
				gemNum=window.aisGame.king.convertCube2Gem(resNum);
			}
		}
		else
		{
			resNum=rate;
			vip=1;
			if(resNum>remainCap || 0==resNum)
				vipBad=1;
			if( ("Oil"==storage.storeMark && !appEnv.checkVipResBuy("oil")) || ("Gold"==storage.storeMark &&  !appEnv.checkVipResBuy("gold")) || ("Cube"==storage.storeMark &&  !appEnv.checkVipResBuy("cube")) )
			{
				bad=5;
			}
			gemNum=window.aisGame.king.convertRes2Gem(resNum);
			if("Cube"==storage.storeMark)
			{
				gemNum=window.aisGame.king.convertCube2Gem(resNum);
			}
			gemNum=Math.round(gemNum*0.5);
		}
		return {res:resNum,gem:gemNum,bad:bad,vip:vip,vipBad:vipBad};
	};

	__Page.dlgShopGem.addButton=function(pos,pic,text,func)
	{
		DBOut("addButton");
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg;
		var list,i,n,keyid,btn,css;
		var items,itemx,itemy,item,idx;

		var vo=this.infoVO;
		if(vo)
		{
			DBOut("homeDlg+"+homeDlg);
		//	homeDlg.dlgTitle._setText(vo.title);
			this.lbItems.clearItems();//清除当前的列表
			items=[];
			DBOut("Catalog: "+vo.catalog);
			list=vo.def;
			n=list.length;

			itemx=150;
			itemy=(appEnv.scrSize[1]-220)/2;
			for(i=0;i<n;i++)
			{
				if(vo.catalog && "Special"==vo.catalog)
				{
					keyid=appEnv.hudKeys.getKey();
					idx=this.lbItems.addItem(cssLib.btnShopSpecialItem.createCSS([itemx,itemy,0],list[i],keyid,appEnv.scrSize[1]-220));
				}
				else
					idx=this.lbItems.addItem(cssLib.btnShopGemItem.createCSS([itemx,itemy,0],list[i],0,appEnv.scrSize[1]-220));
				item=this.lbItems.itemAt(idx);
				item.def=list[idx]
				item.dlg=this;
				if(keyid)
				{
					this.regKeyVO(keyid,item,this.onSpecialInfoClk);
				}
			}
			// n=this.lbItems.getItemNum();
			/* for(i=0;i<n;i++)
			{
				keyid=appEnv.hudKeys.getKey();
				item=this.lbItems.itemAt(i);
				item.dlg=this;
				item=item.getItemById("InfoBtn");
				if(item)
				{
					item.setKey(keyid);
					this.regKeyVO(keyid,item,this.onInfoClk);
				}
			} */
		}
	};

	__Page.dlgShopGem.updateButton=function()
	{
		DBOut("updateButton");
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg;
		var keyid;

		var itemx=150;
		var itemy=(appEnv.scrSize[1]-220)/2;

		var i,defLen,itemLen,item,css,idx;
		var vo=this.infoVO;
		defLen=vo.def.length;
		itemLen=this.lbItems.getItemNum();

		this.infoKeys={};
		this.giftInfoKeys={}
		DBOut("defLen:"+defLen+" itemLen:"+itemLen);
		for(i=0; i<defLen; i++)
		{
			keyid=0;
			if(vo.def[i].monthCard || vo.def[i].msgCard || vo.def[i].thCard || vo.def[i].resCard)
			{
				keyid=appEnv.hudKeys.getKey();
				this.infoKeys[""+keyid]=vo.def[i];
			//	DBOut(toJSON(vo.def[i]));
			}
			else if(vo.def[i].giftCard)
			{
				keyid=appEnv.hudKeys.getKey();
				this.giftInfoKeys[""+keyid]=vo.def[i];
			}
			if(i<itemLen)
			{
				item=this.lbItems.itemAt(i);
				item.update(vo.def[i]);
				item.getItemById("InfoBtn").setKey(keyid);
			}
			else
			{
				css=cssLib.btnShopGemItem.createCSS([itemx,itemy,0],vo.def[i],keyid,appEnv.scrSize[1]-220);
				idx=this.lbItems.addItem(css);
				item=this.lbItems.itemAt(idx);
			}
			item.dlg=this;
			if(keyid)
			{
				this.regKeyVO(keyid,item,this.onInfoClk);
			}
		}
		for(i=itemLen-1; i>=0; i--)
		{
			if(i>=defLen)
			{
				this.lbItems.removeItem(i);
			}
		}
	};

	__Page.dlgShopGem.getWebVO=function(vo)
	{
		var sVO=[];
		var textLib=this.appEnv.textLib;
		sVO.push({name:"网页充值",codeName:"web",costRes:"Web",costValue:"",rewardRes:"",rewardValue:"",icon:"gemWeb",bad:0});
		vo.def=vo.def.concat(sVO);
	};

	__Page.dlgShopGem.getTokenVO=function(vo)
	{
	//	window.aisGame.king.gemNum=0;
		var def=window.aisEnv.defLib.globals;
		var sVO=[], token, num, gemNum, i, bad=0;
		for(i=0; i<3; i++)
		{
			token="BUY_TOKEN_"+(i+1);
			num=def[token];
			if(num)
			{
				if(num.indexOf && num.indexOf("#")>-1)
					num=num.substr(0,num.indexOf("#"));
				num=parseInt(num,10);
				gemNum=window.aisGame.king.convertToken2Gem(num);
				sVO.push({name:this.appEnv.textLib["TokenName"+i],codeName:token,costRes:"Gem",costValue:gemNum,rewardRes:"cash",rewardValue:num,icon:"token"+(i+1),token:1});
			}
		}
		vo.def=vo.def.concat(sVO);
	};

	__Page.dlgShopGem.getGoldCardVO=function(vo)
	{
		DBOut("getGoldCardVO");
		var appEnv=this.appEnv;
		this.thVO=[];
		var sVO=[], gemNum, price, bad=0;
		var textLib=this.appEnv.textLib;

		gemNum=window.aisGame.king.gemNum;
		price=parseInt(window.aisEnv.defLib.globals["TH_CARD_COST_GEM"],10);
		bad=gemNum<price?1:0;
		var name=textLib["ShowpTh"], desc=textLib["ShowpThDesc"];
		var thTime=this.appEnv.getBuffRemainTimeByName();
		var addTime=parseInt(window.aisEnv.defLib.globals["TH_CARD_DATE"],10)*60*60*1000;
		sVO.push({name:name,codeName:"TH",desc:desc,costRes:"Gem",costValue:price,rewardRes:"",rewardValue:"",icon:"gemPack10",bad:0,th:1,addTime:addTime,
			thCard:1,cardRemain:thTime,payVO:{ItemName:name,ItemDesc:desc}});
		price=parseInt(window.aisEnv.defLib.globals["CUBE_CARD_COST_GEM"],10);
		bad=gemNum<price?1:0;
		name=textLib["ShowpCubeCard"],desc=textLib["ShowpCubeCardDesc"];
		thTime=this.appEnv.getBuffRemainTimeByName("CubeCard");
		addTime=parseInt(window.aisEnv.defLib.globals["CUBE_CARD_DATE"],10)*60*60*1000;
		sVO.push({name:name,codeName:"CubeCard",desc:desc,costRes:"Gem",costValue:price,rewardRes:"",rewardValue:"",icon:"gemPack17",bad:0,th:1,addTime:addTime,
			thCard:2,cardRemain:thTime,payVO:{ItemName:name,ItemDesc:desc}});
//
//		PayID:"M1_gift_token10_6_TH",PayID_Alias:"M1_gift_token10_6",CostType:"Rmb",CostNumber:1200,ResType:"Gem",ResNumber:0,
//		ItemName:textLib.payName["M1_gift_token10_6_TH"],ItemDesc:textLib.payInfo["M1_gift_token10_6_TH"],
//		PayType:"5010",ChannelType:"DCZFB",OnSale:false,Hot:false,Icon:"gemPack10",UnDispaly:false,Action:"TH"

		this.thVO=sVO;
		vo.def=vo.def.concat(this.thVO);
	};

	__Page.dlgShopGem.getShieldCD=function(codeName)
	{
		var i=0, city=window.aisGame.curCity, shieldTime=city.shieldTime;
		if(shieldTime && shieldTime.length)
		{
			for(i=0; i<shieldTime.length; i++)
			{
				if(codeName==shieldTime[i].codename && shieldTime[i].cooldownTime>city.env.dateTime())
					return shieldTime[i].cooldownTime-city.env.dateTime();
			}
		}
		return; 0;
	};

	__Page.dlgShopGem.showUI=function(extra)
	{
		DBOut("showUI:"+extra);
		this.infoVO.def=[];
		var vo=this.infoVO;
		if(System.getProperty("ChannelType")!="CNTelecom")// && window.USERID>=20000
			this.getGoldCardVO(vo);
		this.getPayVO(vo,extra);
	//	this.getWebVO(vo,extra);
	//	this.getTokenVO(vo,extra);
		this.getVipVO(vo);
		this.getSpecialVO(vo);
		this.updateButton();
	};

	__Page.dlgShopGem.setOnceItemCookie=function(codeName)
	{
		var page=this.page;
		var name=codeName?codeName:"Gift";
		name+=window.USERID;
		page.setCookie("OnceItem",name,"1",5*60);
	};

	__Page.dlgShopGem.getOnceItemCookie=function(codeName)
	{
		if("IPHONE"!=window.DeviceType)return 0;//避免安卓cookie的时间bug
		var page=this.page;
		var name=codeName?codeName:"Gift";
		name+=window.USERID;
		if(page.getCookie("OnceItem",name))
			return 1;
		else
			return 0;
	};
	__Page.dlgShopGem.showLoading=function(type)//type:0-可以关闭,1-死等
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var king=window.aisGame.king;
		var city=window.aisGame.curCity;
		if(this.loadBgHud)
		{
			this.dlgFrame.removeChild(this.loadBgHud);
			this.loadBgHud=null;
			this.loadingType=null;
		}
		this.loadingType=type;
		this.loadBgHud=this.dlgFrame.appendNewChild({
			type:"shape",id:"loadBoard",pos:[0,0,0],w:this.boxW,h:this.boxH,border_r:0,border_g:0,border_b:0,border_a:0,face_r:0,face_g:0,face_b:0,face_a:128,ui_event:1,
			display:1,items:[
				{type:"icon",pos:[this.boxW>>1,this.boxH>>1,0],id:"load",css:imgLib.pic_radar_light,anchor_v:1,anchor_h:1,filter:1,},//w:Math.floor(imgLib.pic_radar_light.w*960/Screen.w),h:Math.floor(imgLib.pic_radar_light.h*640/Screen.h)
				{type:"icon",pos:[this.boxW>>1,this.boxH>>1,0],css:imgLib.pic_wreaths,anchor_v:1,anchor_h:1,filter:1,display:1}
			]
		});
		this.loadHud=this.loadBgHud.getItemById("load");
		this.appEnv.addRotate_z(this.loadHud);
		
	};
	__Page.dlgShopGem.closeLoading=function()
	{
		if(this.loadBgHud)
		{
			this.dlgFrame.removeChild(this.loadBgHud);
			this.loadBgHud=null;
			this.loadingType=null;
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgShopGem.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(this.loadBgHud && this.loadBgHud.getDisplay())
			{
				if(this.loadingType==1)
					return;
				else if(this.loadingType==0)
				{
					if(key!=this.homeDlg.btnCloseKeyId && key!=this.homeDlg.btnBackKeyId)
						return;
				}
			}
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//点击顶部菜单
		__Page.dlgShopGem.onMenuClk=function(msg,key,way,extra)
		{
		//	DBOut("onMenuClk, way="+way+", msg="+msg);
			if(1==way && 2==msg)
			{
			//	DBOut("onMenuClk");
				if(extra==this.curStateId)return;
				this.lbxMenu.itemAt(extra).setEnabled(0);
				if(this.curStateId>-1)
				{
					this.lbxMenu.itemAt(this.curStateId).setEnabled(1);
				}
				this.curStateId=extra;
				this.showUI(extra);
			}
		};

		//购买按钮被点击
		__Page.dlgShopGem.onItemClk=function(msg,key,way,extra)
		{
			// DBOut("onItemClk");
			//this.onClick(msg,way);
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
						var appEnv=this.appEnv;
						var page=this.page;
						var textLib=appEnv.textLib;

						var item=this.lbItems.itemAt(extra);
						var info,comVO,title,desc;
						this.page.audioObject.playSound("btn_click");
						if(this.infoVO.catalog=="Special")
						{
							this.onSpecialItemClk(msg,key,way,extra);
							return;
						}
						if(!item.needPay)
						{
							info=this.infoVO.def[extra];
							if(info.thCard)
							{
								if(1==info.thCard)
								{
									title=textLib["BuyThCard"];
									desc=textLib["BuyThCardDesc"];
								}else if(2==info.thCard)
								{
									title=textLib["BuyCubeCard"];
									desc=textLib["BuyCubeCardDesc"];
								}
							}
							else
							{
								if(!item.vip)
								{
									if(1==item.bad){
										this.appEnv.stateLogs.showLog(this.appEnv.textLib["NotEnoughStorage"]);
										return;
									}else if(3==item.bad){
										this.appEnv.stateLogs.showLog(this.appEnv.textLib["ShieldCD"]);
										return;
									}
									title=textLib["ConfirmGemBuy"];
									desc=textLib["ConfirmBuyItem"](info.costValue,info.rewardRes?info.rewardRes:"Shield",info.rewardValue,info.name);
								}
								else
								{
									if(5==item.bad){
										this.appEnv.stateLogs.showLog(this.appEnv.textLib["VipResFull"]);
										return;
									}
									title=textLib["ConfirmVipBuy"];
									desc=textLib["ConfirmVipBuyItem"];
								}
							}
							//DBOut("extra="+extra+", info="+toJSON(info));

							this.appEnv.showPmtDlg(this.page.pmtChoose,0,
								{
									title:title,info:desc,
									pmtFunc:function(ok,info){
										if(ok)
										{
											if(info.rewardRes)
											{
												if(info.token)
												{
													//{"codeName": "cash", "num": 300, "gem": 27, "store": "", "subType": ""}
													comVO={codeName:info.rewardRes,num:info.rewardValue,gem:info.costValue,store:"",subType:"",vip:info.vip?1:0};
													this.page.vwHomeStage.gem2token(comVO);
												}
												else
												{
													comVO={codeName:"Res"+info.rewardRes,num:info.rewardValue,gem:info.costValue,store:info.rewardRes,subType:"",vip:info.vip?1:0};
													this.page.vwHomeStage.gemTrade(comVO);
												}
											}
											else if(info.thCard)
											{
												comVO={buff:1,codeName:info.codeName,gem:info.costValue,addTime:info.addTime,num:0};
											//	DBOut(toJSON(comVO));return;
												this.page.vwHomeStage.gemTrade(comVO);
											}
											else
											{
												comVO={codeName:info.codeName,gem:info.costValue,cooldown:info.cooldown};
												this.page.vwHomeStage.buyShield(comVO);
											}
											this.appEnv.closeDlg(null,null,0);
										}
									},pmtObj:this,pmtParam:info
								}
							);
						}
						else if(1==item.needPay)
						{
							this.appEnv.resetPlayTime();
						//	Dialogs.alert("payVO:"+toJSON(item.payVO));
						//	DBOut("payVO:"+toJSON(item.payVO));
							info=item.payVO;
						//	DBOut(toJSON(info));
							if(item.monthCard)
							{
							//	this.appEnv.stateLogs.showLog(textLib["MonthCardNotAvailable"]);
							//	return;
							}
							if(item.resCard && (1==item.bad || appEnv.getBuffRemainTimeByName(info["Action"])))
							{
								this.appEnv.stateLogs.showLog(textLib["ResCardInCD"]);
								return;
							}
							/**if(item.resCard && appEnv.payingObj[info["Action"]])
							{
								this.appEnv.stateLogs.showLog(textLib["ResCardInProcess"]);
								return;
							}/**/
							var opFlags=window.aisGame.curCity.opFlags;
							DBOut("**** opFlags="+opFlags);
							var flag=0;
							for(var i=0;i<opFlags.length;i++)
							{
								if(opFlags[i]==info["_ResType"])
								{
									flag=1;
									break;
								}
							}
							//去掉机甲福袋，中国好机甲购买显示
							/* if(item.giftCard && (this.getOnceItemCookie(info["Action"]) || flag))
							{
								this.appEnv.stateLogs.showLog(textLib["ItemOnlyBuyOnce"]);
								return;
							} */
							if(item.monthCard || item.thCard || item.resCard || item.giftCard)
							{
								title=textLib["BuyMonthCard"];
								desc=textLib["BuyMonthCardDesc"];
								if(item.thCard)
								{
									title=textLib["BuyThCard"];
									desc=textLib["BuyThCardDesc"];
								}
								if(1==item.resCard)
								{
									title=textLib["BuyResCard1"];
									desc=textLib["BuyResCardDesc1"];
								}
								else if(2==item.resCard)
								{
									title=textLib["BuyResCard2"];
									desc=textLib["BuyResCardDesc2"];
								}
								else if(3==item.resCard)
								{
									title=textLib["BuyResCard3"];
									desc=textLib["BuyResCardDesc3"];
								}
								else if(item.giftCard)
								{
									title=item.def.payVO.ItemName;//textLib["BuyGiftCard"];
									desc=item.def.payVO.ItemDesc;//textLib["BuyGiftCardDesc"];
								}
								this.appEnv.showPmtDlg(this.page.pmtChoose,0,
									{
										title:title,info:desc,
										pmtFunc:function(ok,info){
											if(ok)
											{
												DBOut("do pay month card");
												this.buyItem(info);
											}
											else
												DBOut("no pay month card");
										},pmtObj:this,pmtParam:info
									}
								);
							}
							else if(item.msgCard)
							{
								if(this.appEnv.isAdvMonthCard())
								{
									this.appEnv.stateLogs.showLog(textLib["URTuHao"]);
									return;
								}
								this.appEnv.showPmtDlg(this.page.pmtChoose,0,
									{
										title:textLib["BuyGoldCard"],info:"",ui:"inputNum",//textLib["BuyMonthCardDesc"]
										pmtFunc:function(ok,info){
											if(ok)
											{
												DBOut("do pay gold card: "+this.phoneNum);
											//	this.buyItem(info);
												if(!this.phoneNum)
												{
													this.appEnv.stateLogs.showLog(textLib["InputPhoneNum"]);
												}
												else
												{
													PUR.requestMSG(info,this.phoneNum,function(vo){
														if(vo)
														{
															PUR.buyMSGItem(vo);
															this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["BuyGoldCard"],info:textLib["GoldCardOnBuy"]});
														}
														else
														{
															this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["BuyGoldCard"],info:textLib["GoldCardEh"]});
														}
														this.phoneNum="";
													},this);
												}
											}
											else
											{
												DBOut("no pay gold card");
												this.phoneNum="";
											}
										},pmtObj:this,pmtParam:info
									}
								);
							}
							else if(!window.aisGame.curCity.charge && !appEnv.beingPaid)
							{
								this.appEnv.showPmtDlg(this.page.pmtChoose,0,
									{
										title:textLib["FirstCharge"],info:textLib["FirstChargeReward"](info.ItemName, info.ResNumber),
										pmtFunc:function(ok,info){
											if(ok)
											{
												DBOut("do pay");
												this.buyItem(info);
											}
											else
												DBOut("no pay");
										},pmtObj:this,pmtParam:info
									}
								);
							}
							else if(page.stateHome.DOUBLEVIP && !appEnv.beingPaid)
							{
								this.appEnv.showPmtDlg(this.page.pmtChoose,0,
									{
										title:textLib["DoubleVip"],info:textLib["DoubleVipReward"](info.ItemName, info.ResNumber),
										pmtFunc:function(ok,info){
											if(ok)
											{
												DBOut("do pay");
												this.buyItem(info);
											}
											else
												DBOut("no pay");
										},pmtObj:this,pmtParam:info
									}
								);
							}
							else
							{
							//	DBOut(info==item.payVO);
								this.buyItem(info);
							}
						}
						else if(2==item.needPay)//web pay?
						{

						}
					}
					this.lbxResponse=0;
				}
			}
		};
		//信息按钮被点击
		__Page.dlgShopGem.onInfoClk=function(msg,key,way,extra)
		{
			var dlg=this.dlg;
			dlg.lbxResponse=0;
			var appEnv=dlg.appEnv;
			var textLib=appEnv.textLib;
			var page=dlg.page;
			//this.onClick(msg,way);
			if(1==way && 1==msg)
			{
				DBOut("Will show info: "+extra);
				var def=dlg.infoKeys[key];
				if(def)
				{
				//	DBOut(toJSON(def));
					appEnv.showPmtDlg(page.pmtInfo,0,{title:def.payVO["ItemName"],info:def.payVO["ItemDesc"]});
				}
				else
				{
					def=dlg.giftInfoKeys[key];
						DBOut(toJSON(def));
					def=toJSON(def);
					def=fromJSON(def);
					def.boxs=def.rewardRes;
					appEnv.showPmtDlg(dlg.dlgPage.pmtBox,0,{
						title:def.name,//textLib["GiftCardTitle"],
					//	info:textLib.getText(textLib["MechNo2AtkInfo"],{num:2}),
						align:1,
						showType:"info",
						def:def,
						pmtFunc:function(){},pmtObj:dlg,pmtParam:null
					});
				}
			}
		};
		//代币商城信息按钮被点击
		__Page.dlgShopGem.onSpecialInfoClk=function(msg,key,way,extra)
		{
			var dlg=this.dlg;
			dlg.lbxResponse=0;
			var appEnv=dlg.appEnv;
			var textLib=appEnv.textLib;
			var page=dlg.page;
			//this.onClick(msg,way);
			if(1==way && 1==msg)
			{
				DBOut("Will show info: "+extra);
				var def=this.def;
				if(def)
				{
				//	DBOut(toJSON(def));
					appEnv.showPmtDlg(page.pmtInfo,0,{title:def.name,info:def.desc});
				}
			}
		};
		__Page.dlgShopGem.onSpecialItemClk=function(msg,key,way,extra)
		{
			var item;
			var textLib=this.appEnv.textLib;
			item=this.lbItems.itemAt(extra);
			var def=item.def;
			DBOut("onClk:"+toJSON(item.def));
			if(item.enable)//判断资源
			{
				if(item.personalIsMax || item.personalDailyIsMax || item.globalIsMax)//判断次数是否达到上限
					this.appEnv.stateLogs.showLog(textLib["TimesOver"]);
				else
				{
					this.appEnv.showPmtDlg(this.page.pmtChoose,0,
					{
						title:textLib["SpecialBuy"],info:textLib["SureSpecialBuy"],
						pmtFunc:function(ok,info){
							if(ok)
							{
								DBOut("do pay");
								this.sureBuySpecial(def);
								// this.appEnv.closeDlg(null,null,0);
							}
							else
								DBOut("no pay");
							},pmtObj:this,pmtParam:def
					});
				}
			}
			else
			{
				this.appEnv.stateLogs.showLog(textLib["NotEnougRes"]);
			}
		};
		__Page.dlgShopGem.sureBuySpecial=function(info)
		{
			var appEnv=this.appEnv;
			var page=this.page;
			var textLib=appEnv.textLib;
			var king=window.aisGame.king;
			var city=window.aisGame.curCity;
			this.showLoading(1);
			
			king.execFakeCmd(city,"ShopSpecialMall",{itemId:info.codeName,callBack:function(data){
					DBOut("data+"+toJSON(data));
					this.closeLoading();
					if(data==0)//成功
					{
						city.com_ShopSpecialMall_PS({itemId:info.codeName});
						appEnv.stateLogs.showLog(textLib["SpecialGiftBuyOk"](""));
						appEnv.closeDlg(null,null,0);
					}else if(data==-1)//数量不足，全服次数已到
					{
						appEnv.stateLogs.showLog(textLib["SpecialBuyFail"]);
					}
				},callObj:this},city);
		};
		__Page.dlgShopGem.buyItem=function(info)
		{
			var appEnv=this.appEnv;
			var page=this.page;
			var textLib=appEnv.textLib;

			this.appEnv.showPmtDlg(this.page.pmtChoose,0,
				{
					title:textLib["buyItem"],info:textLib.getText(textLib["buyTip"],{number:info.ResNumber}),
					pmtFunc:function(ok,info){
						if(ok)
						{
							PUR.buyItem(info);
						//	window.aisGame.curCity.charge=-1;//info.CostNumber;
							appEnv.beingPaid=1;
							if(info["Action"].indexOf("WeekCardRes")>-1)
								appEnv.payingObj[info["Action"]]=1;
							else if("Gift"==info["Action"] || "Gift2"==info["Action"])
								this.setOnceItemCookie(info["Action"]);
						}
						else
							DBOut("no pay");
					},pmtObj:this,pmtParam:info
				}
			);
		};
	}
}
