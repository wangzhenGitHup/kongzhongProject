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
			var city=window.aisGame.curCity;
			DBOut("cd:"+city.cooldownTime);
			var cdTime=city.cooldownTime-city.env.dateTime();
			if(cdTime<0)
				cdTime=0;
			var bad=0;
			if(cdTime>0)
				bad=3;
			this.infoVO={title:textLib["Shield"],def:[]};
			list=window.aisEnv.defLib.buff["catalog"+vo.catalog];
			j=0;
			for(i=0; i<list.length; i++)
			{
				j++;
				def=window.aisEnv.defLib.buff[list[i]];
			//	DBOut(toJSON(def));
				this.infoVO.def.push({name:def["name"],desc:def["desc"],codeName:def["codeName"],costRes:"Gem",costValue:def["cost"]["gem"],rewardRes:"",rewardValue:"",icon:"shield"+j,
					bad:bad,cd:cdTime,cooldown:def["cooldown"]});
			}
			this.addButton();
		}
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
			var pvo,pVO=[];
			var n=1;
			DBOut("AppVersion="+window.AppVersion+" "+(window.AppVersion<1.06));
			for(i in pvos)
			{
				pvo=pvos[i];
				if(!pvo["PayID"] || pvo["UnDispaly"])
					continue;
				if("IPHONE"==window.DeviceType && window.AppVersion<1.06 && "M1_gift_token00_6"==pvo["PayID"])
					continue;
				pVO.push({name:pvo["ItemName"],codeName:pvo["PayID"],costRes:pvo["CostType"],costValue:(pvo["CostNumber"]/100),
					rewardRes:pvo["ResType"],rewardValue:pvo["ResNumber"],icon:pvo["Icon"],bad:0,payVO:pvo});//icon:"gemPack"+n,
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
		if(rate<=1)
		{
			if(rate)
				resNum=Math.floor(maxCap*rate);
			else
				resNum=maxCap-curCap;
			if(resNum>remainCap || 0==resNum)
				bad=1;
			gemNum=aisGame.king.convertRes2Gem(resNum);
		}
		else
		{
			resNum=rate;
			vip=1;
			if(resNum>remainCap || 0==resNum)
				vipBad=1;
			if( ("Oil"==storage.storeMark && !appEnv.checkVipResBuy("oil")) || ("Gold"==storage.storeMark &&  !appEnv.checkVipResBuy("gold")) )
			{
				bad=5;
			}
			gemNum=Math.round(aisGame.king.convertRes2Gem(resNum)*0.5);
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
		var items,itemx,itemy,item;

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
				items.push(cssLib.btnShopGemItem.createCSS([itemx,itemy,0],list[i],0,appEnv.scrSize[1]-220));
			}
			this.lbItems.addItems(items);
//			n=this.lbItems.getItemNum();
//			for(i=0;i<n;i++)
//			{
//				keyid=appEnv.hudKeys.getKey();
//				item=this.lbItems.itemAt(i);
//				item.dlg=this;
//				item=item.getItemById("InfoBtn");
//				item.setKey(keyid);
//				this.regKeyVO(keyid,item,this.onInfoClk);
//			}
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

		var itemx=150;
		var itemy=(appEnv.scrSize[1]-220)/2;

		var i,defLen,itemLen,item,css;
		var vo=this.infoVO;
		defLen=vo.def.length;
		itemLen=this.lbItems.getItemNum();

		DBOut("defLen:"+defLen+" itemLen:"+itemLen);
		for(i=0; i<defLen; i++)
		{
			if(i<itemLen)
			{
				item=this.lbItems.itemAt(i);
				item.update(vo.def[i]);
			}
			else
			{
				css=cssLib.btnShopGemItem.createCSS([itemx,itemy,0],vo.def[i],0,appEnv.scrSize[1]-220);
				this.lbItems.addItem(css);
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

	__Page.dlgShopGem.showUI=function(extra)
	{
		DBOut("showUI:"+extra);
		this.infoVO.def=[];
		var vo=this.infoVO;
		this.getPayVO(vo,extra);
	//	this.getWebVO(vo,extra);
		this.getTokenVO(vo,extra);
		this.getVipVO(vo);
		this.getSpecialVO(vo);
		this.updateButton();
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgShopGem.onKey=function(msg,key,way,extra)
		{
			var ret;
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
			DBOut("onItemClk");
			//this.onClick(msg,way);
			if(msg==2 && way==1)
			{
				var appEnv=this.appEnv;
				var page=this.page;
				var textLib=appEnv.textLib;

				var item=this.lbItems.itemAt(extra);
				var info,comVO,title,desc;
				this.page.audioObject.playSound("btn_click");
				if(!item.needPay)
				{
					info=this.infoVO.def[extra];
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
				//	Dialogs.alert("payVO:"+toJSON(item.payVO));
				//	DBOut("payVO:"+toJSON(item.payVO));
					info=item.payVO;
				//	DBOut(toJSON(info));
					if(!window.aisGame.curCity.charge && !appEnv.beingPaid)
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
				else if(2==item.needPay)
				{
					
				}
			}
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
						}
						else
							DBOut("no pay");
					},pmtObj:this,pmtParam:info
				}
			);
		};
	}
}
