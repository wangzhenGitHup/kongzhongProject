if(!__Page.dlgGifts)
{
	__Page.dlgGifts=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgGifts;
	__Page.dlgGifts.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var listX=this.listX=this.contentInner[0];
		var listY=this.listY=this.contentInner[1];
		var listW=this.listW=this.contentW-this.contentInner[0]*2;
		var listH=this.listH=this.contentH-this.contentInner[1]*2;
		var itemW=this.itemW=listW;
		var itemH=this.itemH=90;
		this.listCSS={type:"listbox",id:"lbx-ach",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=this.itemX=itemW/2;
		var itemY=this.itemY=itemH/2;
		var pic=imgLib.getImg("box_achieve");
		var centerW=this.centerW=itemW;
		var centerH=this.centerH=82;
		var centerX=this.centerX=-centerW/2;
		var centerY=this.centerY=-centerH/2;
		var centerInner=this.centerInner=[pic.mgL,pic.mgU];

		var dt=this.dt;
		var iconW=iconH=64;
		var iconX=centerInner[0]+iconW/2, iconY=0;

		var nameW=210, nameH=centerH/2;
		var nameX=iconX+iconW/2+dt*4, nameY=-nameH;

		var resW=150, resH=30;
		var resX_l=nameX+nameW, resX_r=resX_l+resW;
		var resY_u=-18, resY_m=0, resY_d=18;

		pic=imgLib.getImg("btn_green_u");
		var btnW=pic.w*0.8, btnH=pic.h*0.8;
		var btnX=centerW-centerInner[0]-dt-btnW/2, btnY=0;

		this.lineCSS={
			createCSS:function(vo,keyid)
			{
				var haveItem=0;
				if(vo.reses && vo.reses.length)haveItem=1;
				if(vo.reqs && vo.reqs.length)haveItem=1;
				var css={type:"div3x3",id:"item",pos:[0,itemY,0],w:centerW,h:centerH,anchor_h:0,anchor_v:1,ui_event:1,css:imgLib.getImg("box_achieve"),items:[
					{type:"icon",pos:[iconX,iconY,0],css:imgLib.getImg("pic_backlight"),w:iconW*1.3,h:iconH*1.3,anchor_h:1,anchor_v:1},
					{type:"icon",pos:[iconX,iconY,0],css:imgLib.getIcon("gift"+(vo.type+1),64),w:iconW,h:iconH,anchor_h:1,anchor_v:1},
					{css:cssLib.textFineMid.createCSS([nameX,nameY+4,0],vo.name,nameW,nameH,0,0,0,1)},
					{css:cssLib.textFineMid.createCSS([nameX,0-4,0],textLib["RemainTime"]+textLib["getTimeText"](vo.expire-window.aisEnv.dateTime()),nameW,nameH,0,0,0,1),font_size:FS.L},
					{css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,haveItem?textLib["ReceiveReward"]:textLib["ViewGift"],btnW,btnH)}
				],info:vo};
				if(vo.reses && vo.reses.length)
				{
					var rLen=vo.reses.length, rx, ry, resIcon=imgLib.getIcon("level",64), resNum=0;
					for(var i=0; i<rLen; i++)
					{
						rx=(i%2)?resX_r:resX_l;
						if(rLen<3)
							ry=resY_m;
						else
							ry=(Math.floor(i/2))?resY_d:resY_u;
						resNum=vo.reses[i].num;
						if("Gold"==vo.reses[i].type)
							resIcon=imgLib.getIcon("res_gold",64);
						else if("Oil"==vo.reses[i].type || "Elixir"==vo.reses[i].type)
							resIcon=imgLib.getIcon("res_oil",64);
						else if("Gem"==vo.reses[i].type)
							resIcon=imgLib.getIcon("res_gem",64);
						else if("tok1"==vo.reses[i].type)
							resIcon=imgLib.getIcon("res_chip",64);
						else if("Cube"==vo.reses[i].type || "cube"==vo.reses[i].type)
							resIcon=imgLib.getIcon("res_cube",64);
						else if("tok2"==vo.reses[i].type){
							resIcon=imgLib.getIcon("res_cuttime",64);
							resNum=Math.floor(resNum/60);
						}else if("Rmb"==vo.reses[i].type)
						{
							resIcon=imgLib.getIcon("vip",64);
							resNum/=100;
						}else if("itm_"+vo.reses[i].type.substr(0,4))
						{
							continue;
						}
						resIcon.w=resIcon.h=resH;
						css.items.push({css:cssLib.iconText.createCSS([rx,ry,0],resIcon,resNum)});
					}
				}
				return css;
			}
		};
	};
	__Page.dlgGifts.init=function(appEnv)
	{
		this.name="dlgGifts";
		this.viewId="dlgGifts";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onGiftClk);
		this.lbxGifts=this.cntBox.appendNewChild({css:this.listCSS,key:keyid});
	};

	__Page.dlgGifts.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid;

		var i, items, css;
	//	DBOut("gifts vo:"+toJSON(vo));
		//根据VO初始化界面:
		if(!vo)
		{
			vo=[
				{id:0,userId:1010203,type:1,icon:0,name:"礼包1",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
				{id:0,userId:1010203,type:2,icon:0,name:"礼包2",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
				{id:0,userId:1010203,type:3,icon:0,name:"礼包3",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
				{id:0,userId:1010203,type:4,icon:0,name:"礼包4",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
				{id:0,userId:1010203,type:5,icon:0,name:"礼包5",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
				{id:0,userId:1010203,type:6,icon:0,name:"礼包6",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
				{id:0,userId:1010203,type:6,icon:0,name:"礼包6",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
				{id:0,userId:1010203,type:6,icon:0,name:"礼包6",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
				{id:0,userId:1010203,type:6,icon:0,name:"礼包6",info:"asdfasdf",reses:[{type:"Gold",num:100},{type:"Oil",num:100},{type:"Gem",num:100}],addTime:"",expire:"",},
			];
		}
		this.infoVO=vo;
		this.giftKeys={};
	//	for(i in vo.achvmnts.goldstoragelevel)DBOut(i+":"+vo.achvmnts.goldstoragelevel[i]);
	//	this.timer=setFrameout(window.DelayLoad,function(){
		appEnv.setDlgAniCall(function(){
			if(vo)
			{
				for(i=0; i<vo.length; i++)
				{
					keyid=appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.onRewardClk);
					this.giftKeys[keyid+""]=vo[i];
					css=this.lineCSS.createCSS(vo[i],keyid);
					this.lbxGifts.addItem(css);
				}
			//	this.lbxGifts.addItems(items);
			}
			this.timer=null;
		},this);
		this.dlgTitle._setText(textLib["Gift"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgGifts.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		this.page.stateHome.updateNGBtns();
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgGifts.showGiftInfo=function(vo)
	{
		if(vo.info)
		{
			var appEnv=this.appEnv;
			var page=this.page;
			var textLib=appEnv.textLib;
			var title, desc;
			title=textLib["GiftInfo"]//vo.name?vo.name:"";
			desc=vo.info;
			appEnv.showPmtDlg(page.pmtInfo,0,{title:title,info:desc});
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgGifts.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//礼包列表被点击
		__Page.dlgGifts.onGiftClk=function(msg,key,way,extra)
		{
			if(1==way)
			{
				if(0==msg)
				{
				//	DBOut("onMemberClk down");
					this.lbxResponse=1;
				}
				else if(2==msg)
				{
				//	DBOut("onMemberClk check");
					if(this.lbxResponse)
					{
						DBOut("onGiftClk");
						var lbx=this.lbxGifts;
						var item=lbx.itemAt(extra);
						var info=item.info;
						this.showGiftInfo(info);
					}
					this.lbxResponse=0;
				}
			}
		};

		//领奖按钮被点击onRewardClk
		__Page.dlgGifts.onRewardClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onRewardClk");
				var textLib=this.appEnv.textLib;
				var gift=this.giftKeys[key];
				var king=aisGame.king;
				var city=aisGame.curCity;
				DBOut("Will get gift "+toJSON(gift));
				if(gift.type==0 || 2==gift.type || 4==gift.type || 3==gift.type)
				{
					king.execCmd(city,"GiftUses",{giftId:gift.id},city);
					if(gift.reses && gift.reses.length)
					{
						for(var i=0; i<gift.reses.length; i++)
						{
							if("Gold"==gift.reses[i].type)
							{
								this.page.audioObject.playSound("coin_collect");
							}
							else if("Oil"==gift.reses[i].type || "Elixir"==gift.reses[i].type)
							{
								this.page.audioObject.playSound("fuel_collect");
							}
							else if("Cube"==gift.reses[i].type)
							{
								this.page.audioObject.playSound("fuel_collect");
							}
							else if("Gem"==gift.reses[i].type)
							{

							}
							else
							{
								this.page.audioObject.playSound("get_giftbag");
							}
						}
					}

					var lv,old=city.vipLevel;
					lv=window.pxyLogin.initVIPLevel(city.vipExp);
					if(old<lv)
					{
						city.vipLevel=lv;
						Dialogs.alert(textLib.getText(textLib.VipLvUpNeedReload,{lv:lv}));
						this.appEnv.sureReloadGame();
					}

				}else if(gift.type==1){
					var cocDefId=gift.reses[0].type+"1";
					cocDefId=this.page.vwHomeStage.level.getObjDefIdx(cocDefId);
					if(cocDefId>=0)
					{
						var homeBld=this.page.vwHomeStage.askNewBldPos(cocDefId,0,2);
						homeBld.giftId=gift.id;
					}
				}else if(6==gift.type){
					this.showGiftInfo(gift);
					return;
				}else if(7==gift.type){
					this.page.audioObject.playSound("get_giftbag");
					if(city.aisMacShop)
					{
						var i,n,k,reqs,store,curLoad,maxLoad;
						reqs=gift.reqs;
						store=city.aisMacShop.tgtStorage;
						curLoad=store.getValue("curLoad");
						maxLoad=store.getValue("maxLoad");
						if(city.aisMacShop.working)curLoad++;
						for(i=0;i<reqs.length;i++)
						{
							if(reqs[i].type.indexOf("par_")!=-1)
								curLoad+=reqs[i].num;
						}
						if(curLoad<=maxLoad)
						{
							DBOut("========= "+textLib.getMechOk);
							king.execCmd(city,"GiftUses",{giftId:gift.id},city);
							Dialogs.alert(textLib.getMechOk);
							this.appEnv.sureReloadGame();
						}else{
							Dialogs.alert(textLib.getMechFull);
							return;
						}
					}else{
						Dialogs.alert(textLib.noHaveMacshop);
						return;
					}
				}
				this.appEnv.closeDlg(null,null,0);
			}
		};
	}
}
