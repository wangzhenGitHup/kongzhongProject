if(!__Page.dlgShop)
{
	__Page.dlgShop=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,0);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgShop;
	__Page.dlgShop.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	};
	__Page.dlgShop.init=function(appEnv)
	{
		this.name="dlgShop";
		this.viewId="dlgShop";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid;
		var btnShop1,btnShop2,btnShop3,btnShop4,btnShop5,btnShop6;

		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=this.dlgBox.appendNewChild({
		//	type:"shape",id:"dlgFrame",pos:[0,0,0],w:this.boxW,h:this.boxH,border_r:0,border_g:0,border_b:0,border_a:0,face_r:60,face_g:67,face_b:72,face_a:255,ui_event:1,
			type:"div3x3",id:"dlgFrame",pos:[0,0,0],w:this.boxW,h:this.boxH,css:imgLib.getImg("box_dlginner"),ui_event:1,
		});

		var titlePic=imgLib.getImg("box_dlgtitle");
		var boxY=titlePic.h/2;
		//对话框标题栏:
		this.titleBox=this.dlgFrame.appendNewChild({
			type:"icon",id:"TitleBox",pos:[0,boxY,0],w:this.boxW,anchor_v:1,ui_event:1,css:cssLib.dlgTitleBox,
		});

		var titleH=imgLib.box_dlgtitle.h;
		var folderH=236;
		var folderBoxH=this.boxH-titleH*2;
		var folderDT=(folderBoxH-folderH*2)/3;
		if(folderDT<16){
			folderBoxH=this.boxH-titleH;
			folderDT=(folderBoxH-folderH*2)/3;
		}
		var folderY1=titleH+folderDT+folderH/2;
		var folderY2=folderY1+folderH+folderDT;
		this.btmShow=0;
		if(this.boxH >= (folderY2+folderH/2+folderDT + titleH))
			this.btmShow=1;

		boxY=appEnv.scrSize[1]-titlePic.h/2+2;
		//对话框底栏:
		var picCharge=imgLib.getImg("pic_charge"), picCharge2=imgLib.getImg("pic_charge2"), dt=8, picX=dt+picCharge.w/2;
		var disp=0;//(!window.aisGame.curCity.charge && !appEnv.beingPaid)?1:0;
		if(!appEnv.beingPaid && (!window.aisGame.curCity.charge || page.stateHome.DOUBLEVIP))
		{
			disp=1;
		}
		if(page.stateHome.DOUBLEVIP)
		{
			picCharge=imgLib.getImg("pic_doublevip");
			picCharge2=imgLib.getImg("pic_doublevip2");
		}
		this.bottomBox=this.dlgFrame.appendNewChild({
			type:"icon",id:"BottomBox",pos:[0,boxY,0],w:this.boxW,anchor_v:1,ui_event:1,css:cssLib.dlgTitleBox,//cv_align:2,
			display:this.btmShow,fade:1,fade_size:1,fade_alpha:0,
			items:[
				{css:cssLib.boxGem.createCSS([this.boxW/2-200,0,0],null,"gold",window.aisGame.curCity.goldStorage.getUsedCap())},
				{css:cssLib.boxGem.createCSS([this.boxW/2,0,0],null,"oil",window.aisGame.curCity.oilStorage.getUsedCap())},
			//	{css:cssLib.boxGem.createCSS([this.boxW/2+200,0,0],null,"gem",window.aisGame.curCity.king.gemNum)},
				{type:"icon",pos:[picX,0,0],anchor_h:1,anchor_v:1,css:picCharge,display:disp},
				{type:"icon",pos:[this.boxW-picX,0,0],anchor_h:1,anchor_v:1,css:picCharge2,display:disp},
			]
		});
		this.gemBox=cssLib.boxGem.create(this.bottomBox,[this.boxW/2+200,0,0],aisGame.curCity,"gem",0);

		//对话框标题:
		this.dlgTitle=cssLib.textFineBig.create(this.titleBox,[this.boxW/2,0,0],textLib["Battle Shop"],this.boxW,100,1,1,1,1);

		var btnPic=imgLib.getImg("btn_close_u");
		var btnX=titlePic.mgR/2+btnPic.w/2;
		//关闭对话框的按钮:
		this.btnCloseKeyId=keyid=appEnv.appKeys.btnClose;
		this.btnClose=cssLib.btnCloseDlg.create(this.titleBox,[this.boxW-btnX,0,0],keyid);
		this.regKeyVO(keyid,this,this.onCloseClk);

		//返回对话框的按钮:
		this.btnBackKeyId=keyid=appEnv.appKeys.btnNext;
		this.btnBack=cssLib.btnBackDlg.create(this.titleBox,[btnX,0,0],keyid);
		this.btnBack.setDisplay(0);
		this.regKeyVO(keyid,this,this.onBackClk);

		//TODO:
		this.btnFrame=this.dlgFrame.appendNewChild({
			type:"shape",id:"btnFrame",pos:[0,0,0],w:this.boxW,h:this.boxH,border_r:0,border_g:0,border_b:0,border_a:0,face_r:100,face_g:100,face_b:100,face_a:0,ui_event:1,
			display:1,fade_pos:[-this.boxW,0,0],fade:1,fade_alpha:0,fade_size:1,
		});
	};

	__Page.dlgShop.initBtns=function()
	{
		this._init=1;
		var appEnv=this.appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid;
		var btnShop1,btnShop2,btnShop3,btnShop4,btnShop5,btnShop6;

		var titleH=imgLib.box_dlgtitle.h;
		var folderH=236;
		var folderBoxH=this.boxH-titleH*2;
		var folderDT=(folderBoxH-folderH*2)/3;
		if(folderDT<16){
			folderBoxH=this.boxH-titleH;
			folderDT=(folderBoxH-folderH*2)/3;
		}
		var folderY1=titleH+folderDT+folderH/2;
		var folderY2=folderY1+folderH+folderDT;

		keyid=appEnv.appKeys.bldShopType_1;
		btnShop1=cssLib.btnShopFolder.create(this.btnFrame,[this.boxW/2-300,folderY1,0],keyid,imgLib.getIcon("shop_1",256),textLib["Treasure"],"Btn_ShopTreasure");
		btnShop1.dlg=this;
		btnShop1.folderId=1;
		btnShop1.shopType=0;//Cash
		this.regKeyVO(keyid,btnShop1,this.onFloderClk);

		keyid=appEnv.appKeys.bldShopType_2;
		btnShop2=cssLib.btnShopFolder.create(this.btnFrame,[this.boxW/2,folderY1,0],keyid,imgLib.getIcon("shop_2",256),textLib["Resources"],"Btn_ShopResources");
		btnShop2.dlg=this;
		btnShop2.folderId=2;
		btnShop2.shopType=1;//bld
		btnShop2.shopCatalog="Res";
		this.regKeyVO(keyid,btnShop2,this.onFloderClk);

		keyid=appEnv.appKeys.bldShopType_3;
		btnShop3=cssLib.btnShopFolder.create(this.btnFrame,[this.boxW/2+300,folderY1,0],keyid,imgLib.getIcon("shop_3",256),textLib["Decorations"],"Btn_ShopDecorations");
		btnShop3.dlg=this;
		btnShop3.folderId=3;
		btnShop3.shopType=1;//bld
		btnShop3.shopCatalog="Deco";//"Decorate";
		this.regKeyVO(keyid,btnShop3,this.onFloderClk);

		keyid=appEnv.appKeys.bldShopType_4;
		btnShop4=cssLib.btnShopFolder.create(this.btnFrame,[this.boxW/2-300,folderY2,0],keyid,imgLib.getIcon("shop_4",256),textLib["Army"],"Btn_ShopTreasure");
		btnShop4.dlg=this;
		btnShop4.folderId=4;
		btnShop4.shopType=1;//bld
		btnShop4.shopCatalog="Army";
		this.regKeyVO(keyid,btnShop4,this.onFloderClk);

		keyid=appEnv.appKeys.bldShopType_5;
		btnShop5=cssLib.btnShopFolder.create(this.btnFrame,[this.boxW/2,folderY2,0],keyid,imgLib.getIcon("shop_5",256),textLib["Defense"],"Btn_ShopDefenses");
		btnShop5.dlg=this;
		btnShop5.folderId=5;
		btnShop5.shopType=1;//bld
		btnShop5.shopCatalog="Defense";
		this.regKeyVO(keyid,btnShop5,this.onFloderClk);

		keyid=appEnv.appKeys.bldShopType_6;
		btnShop6=cssLib.btnShopFolder.create(this.btnFrame,[this.boxW/2+300,folderY2,0],keyid,imgLib.getIcon("shop_6",256),textLib["Special"],"Btn_ShopSpecial");
		btnShop6.dlg=this;
		btnShop6.folderId=6;
		btnShop6.shopType=2;//Special
		btnShop6.shopCatalog="Special";
		this.regKeyVO(keyid,btnShop6,this.onFloderClk);

		var btns=[btnShop1,btnShop2,btnShop3,btnShop4,btnShop5,btnShop6];
		for(var i=0; i<btns.length; i++)
			btns[i].fadeIn(3,0);

		//Init sub-states:
		this.dlgPage.dlgShopBld.init(appEnv);
		this.dlgPage.dlgShopGem.init(appEnv);
		this.dlgPage.pmtBox.init(appEnv);
	};

	__Page.dlgShop.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;
		var imgLib=page.imgLib;
		var list,i,n;

		this.dlgTitle._setText(textLib[vo?vo.title:"Battle Shop"]);
		//根据VO初始化界面:
		this.infoVO=vo;
	//	this.timer=setFrameout(window.DelayLoad,function(){
		appEnv.setDlgAniCall(function(){
			if(!this._init)
				this.initBtns();
			if(vo)
			{
				this.btnFrame.setDisplay(0);
				setFrameout(0,function(){
					if("Worker"==vo.catalog)
						appEnv.switchDlg(this.dlgPage.dlgShopBld,0,{title:vo.title,catalog:vo.catalog});
					else
						appEnv.switchDlg(this.dlgPage.dlgShopGem,0,{catalog:vo.catalog});
				//	appEnv.switchDlg(this.dlgPage.dlgShopGem,0,{catalog:"Gem"});
				//	appEnv.switchDlg(this.dlgPage.dlgShopGem,0,{catalog:"Shields"});
				//	appEnv.switchDlg(this.dlgPage.dlgShopBld,0,{title:"Builder",catalog:"Worker"});
				},this);
			}
			this.timer=null;
		},this);
		if(this.btnFrame && !this.btnFrame.getDisplay())
		{
			appEnv.hudOut(this.btnBack,10);
			appEnv.hudIn(this.btnFrame,10);
		}
		/*******************/
		if(window.Adways && !vo)
		{
			keyid=appEnv.hudKeys.getKey();
			this.regKeyVO(keyid,this,this.onAdwaysClick);
			var pic=imgLib.getImg("pic_adways2"), warW=Math.floor(pic.w*0.9), warH=Math.floor(pic.h*0.9);
			pic=cloneToObj(pic);
			pic.w=warW, pic.h=warH;
			this.btnAdways=this.dlgFrame.appendNewChild({type:"key",pos:[this.backBtnX+100,this.backBtnY+30,0],anchor_h:1,anchor_v:1,css:pic,ui_event:1,key:keyid,diwn_scale:0.95,
				state_up:pic,state_down:pic,state_grage:pic,audio:this.page.audioObject.genFileURL("btn_click"),button:1,
				startScale:function()
				{
					appEnv.addLoopScale(this,0.1,{minX:0.95,maxX:1.05,minY:0.95,maxY:1.05});
				},
				stopScale:function()
				{
					if(this.scaleAni)
					{
						this.scaleAni.setCurValue([1,1,1]);
						this.scaleAni.stop();
					}
				}
			});
			this.btnAdways.startScale();
		}
	};

	__Page.dlgShop.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(this.btnAdways)
			this.dlgFrame.removeChild(this.btnAdways);
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.btnFrame,5);
		}
		else
		{
			DBOut(this.gemBox+" will deadOut");
			this.gemBox.fadeOut(0,0);
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgShop.addButton=function(pos,pic,text,func)
	{
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgShop.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//建造按钮被点击
		__Page.dlgShop.onFloderClk=function(msg,key,way,extra)
		{
			var dlg;
			dlg=this.dlg;
			this.onClick(msg,way);
			if(msg==1)
			{
				//TODO: Open sub-list
				DBOut("Will open sub-list");
				switch(this.folderId)
				{
				case 1:
					dlg.appEnv.switchDlg(dlg.dlgPage.dlgShopGem,0,{title:"SpecialSupply",catalog:"Gem"});
					break;
				case 2:
					dlg.appEnv.switchDlg(dlg.dlgPage.dlgShopBld,0,{title:"Resources",catalog:this.shopCatalog});
					break;
				case 3:
					dlg.appEnv.switchDlg(dlg.dlgPage.dlgShopBld,0,{title:"Decorations",catalog:this.shopCatalog});
					break;
				case 4:
					dlg.appEnv.switchDlg(dlg.dlgPage.dlgShopBld,0,{title:"Army",catalog:this.shopCatalog});
					break;
				case 5:
					dlg.appEnv.switchDlg(dlg.dlgPage.dlgShopBld,0,{title:"Defense",catalog:this.shopCatalog});
					break;
				case 6:
					dlg.appEnv.switchDlg(dlg.dlgPage.dlgShopGem,0,{title:"Special",catalog:this.shopCatalog});
					break;
				default:
					break;
				}
			}
		};
		__Page.dlgShop.onAdwaysClick=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var defLib=window.aisEnv.defLib.pay;
				var vo=defLib.AdWays;
				if(vo)
				{
					this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["AdwaysTitle"],info:textLib["AdwaysInfo"],align:1,force:1,
					pmtFunc:function(){
							window.PUR.showAdways(vo);
					},pmtObj:this,pmtParam:null});
				}
			}
		};
	}
}
