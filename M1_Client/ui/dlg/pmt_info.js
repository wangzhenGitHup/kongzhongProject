if(!__Page.pmtInfo)
{
	__Page.pmtInfo=new __Page.pmtBase(__Page,__Page.appEnv,3,0);
	//添加至AppEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.pmtInfo);
	__Page.pmtInfo.init=function(appEnv)
	{
		this.name="pmtInfo";
	};

	__Page.pmtInfo.enter=function(preState,vo)
	{
		this.page.pmtBase.prototype.init.call(this,this.appEnv);
		this.page.pmtBase.prototype.enter.call(this,preState,vo);
		if(vo.align)
			this.infoText.setAlignH(1);
		if(vo.ui)
		{
			this.infoText.setAlignH(1);
			this["showUI_"+vo.ui]();
		}
		else
		{
			if(vo.pmtFunc && vo.pmtObj)
			{
				var keyid=this.appEnv.hudKeys.getKey(this);
				this.curBtn=this.page.cssLib.btnDlgOK.create(this.cntBox,this.btnPos_m,keyid);
				this.regKeyVO(keyid,this,this.onOKClk);
			}
		}
	};

	__Page.pmtInfo.leave=function(nextState)
	{
		this.page.pmtBase.prototype.leave.call(this,nextState);
	};

	__Page.pmtInfo.showUI_gem2res=function()
	{
		var vo=this.pmtVO.svo;
		if(!(vo && vo.storage))
			return;
		//TODO:取资源可能需要调整
		var buyStorage=vo.storage[0];
		//DBOut("buyStorage="+toJSON(buyStorage));//{"name": "Gold", "type": "ResGold", "num": 1000}
		//这里需要处理钻石消耗的问题
		var buyName=buyStorage.name;
		var buyType=buyStorage.type;
		var buyNum=Math.abs(buyStorage.num);
		var gemNum=0;
		if("ResGold"==buyType){
			gemNum=aisGame.king.convertGodl2Gem(buyNum);
			buyName="Gold";
		}else if("ResOil"==buyType){
			gemNum=aisGame.king.convertOil2Gem(buyNum);
			buyName="Oil";
		}else if("ResCube"==buyType){
			gemNum=aisGame.king.convertCube2Gem(buyNum);
			buyName="Cube";
		}
	//	buyName=nameFormat(buyName)
		this.comVO={codeName:buyType,num:buyNum,gem:gemNum,store:buyName,subType:""};

		var keyid=this.appEnv.hudKeys.getKey(this);
		this.curBtn=this.btnBuy=this.page.cssLib.btnResGo.create(this.cntBox,this.btnPos_m,240,"gem",gemNum,0,keyid);
		this.regKeyVO(keyid,this,this.onGemClk_res);
	};

	__Page.pmtInfo.showUI_gem2token=function()
	{
		var vo=this.pmtVO.svo;
		if(!(vo && vo.storage))
			return;
		DBOut("pmt vo:"+toJSON(vo));
		//这里需要处理钻石消耗的问题
		var buyName="Token";
		var buyType="cash";
		var buyNum=Math.abs(vo.cash);
		var gemNum=0;
		gemNum=aisGame.king.convertToken2Gem(vo.cash);
		this.comVO={codeName:buyType,num:buyNum,gem:gemNum,store:"",subType:""};
		DBOut("pmt comVO:"+toJSON(this.comVO));

		var keyid=this.appEnv.hudKeys.getKey(this);
		this.curBtn=this.btnBuy=this.page.cssLib.btnResGo.create(this.cntBox,this.btnPos_m,240,"gem",gemNum,0,keyid);
		this.regKeyVO(keyid,this,this.onGemClk_token);
	};

	__Page.pmtInfo.showUI_gem2freeWorker=function()
	{
		var vo=this.pmtVO.svo;
		if(!(vo))
			return;
		var keyid=this.appEnv.hudKeys.getKey(this);

		//计算vip打折后的消耗
		DBOut("vip gemNum: "+vo.gem+" vs "+this.appEnv.getVipBuildGem(vo.gem));
		var gem=this.appEnv.getVipBuildGem(vo.gem);

		this.curBtn=this.btnFreeWorker=this.page.cssLib.btnResGo.create(this.cntBox,this.btnPos_m,240,"gem",gem,0,keyid,
			this.appEnv.getVipCapStatus("vipBLDTimeDiscount")?window.aisGame.curCity.vipLevel:0);
		this.regKeyVO(keyid,this,this.onGemClk_worker);
	};

	__Page.pmtInfo.showUI_go2shop=function()
	{
		var keyid=this.appEnv.hudKeys.getKey(this);
		this.curBtn=this.btnShop=this.page.cssLib.normalBtn.create(this.cntBox,this.btnPos_m,keyid,0,this.appEnv.textLib["EnterShop"]);
		this.regKeyVO(keyid,this,this.onShopClk);
	};

	__Page.pmtInfo.showUI_gem2force=function()
	{
		var vo=this.pmtVO.svo;
		DBOut("pmt vo:"+toJSON(vo));
		//这里需要处理钻石消耗的问题
		var gemNum=vo.gemNum;
		var bad=gemNum>window.aisGame.king.gemNum ? 1:0;

		var keyid=this.appEnv.hudKeys.getKey(this);
		this.curBtn=this.btnBuy=this.page.cssLib.btnResGo.create(this.cntBox,this.btnPos_m,240,"gem",gemNum,bad,keyid);
		this.regKeyVO(keyid,this,this.onGemClk_force);
	};

	__Page.pmtInfo.showUI_gem2normal=function()
	{
		var vo=this.pmtVO.svo;
		DBOut("pmt vo:"+toJSON(vo));
		//这里需要处理钻石消耗的问题
		var gemNum=vo.gemNum;
		var bad=gemNum>window.aisGame.king.gemNum ? 1:0;

		var keyid=this.appEnv.hudKeys.getKey(this);
		this.curBtn=this.btnBuy=this.page.cssLib.btnResGo.create(this.cntBox,this.btnPos_m,240,"gem",gemNum,bad,keyid);
		this.regKeyVO(keyid,this,this.onOKClk);
	};

	__Page.pmtInfo.showInfo=function(title,info)
	{
		this.infoText._setText(info);
		this.pmtTitle._setText(title);
		this.curBtn.setDisplay(0);
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtInfo.onOKClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.appEnv.closePmtDlg();
				var pmtVO=this.pmtVO;
				if(pmtVO && pmtVO.pmtObj && pmtVO.pmtFunc)
				{
					pmtVO.pmtFunc.apply(pmtVO.pmtObj,pmtVO.pmtParam);
				}
			}
		};

		__Page.pmtInfo.onGemClk_res=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.appEnv.closePmtDlg();
				var vo=this.pmtVO;
				this.page.vwHomeStage.gemTrade(this.comVO,vo.pmtFunc,vo.pmtObj,vo.pmtParam);
			}
		};

		__Page.pmtInfo.onGemClk_token=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.appEnv.closePmtDlg();
				var vo=this.pmtVO;
				this.page.vwHomeStage.gem2token(this.comVO,vo.pmtFunc,vo.pmtObj,vo.pmtParam);
			}
		};

		__Page.pmtInfo.onGemClk_worker=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.appEnv.closePmtDlg();
				var vo=this.pmtVO;
				this.page.vwHomeStage.gemFinWorker(vo.svo.aisBld,vo.svo.gem,vo.pmtFunc,vo.pmtObj,vo.pmtParam);
			}
		};

		__Page.pmtInfo.onShopClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.appEnv.closePmtDlg();
				if(msg==1 && way==1)
				{
					DBOut("Will open shop!");
					var url=this.page.genPageURL("ui/dlg/dlg_shop.jml");
					this.appEnv.openPageDlg(url,{title:"SpecialSupply",catalog:"Gem"});
				}
			}
		};

		__Page.pmtInfo.onGemClk_force=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.appEnv.closePmtDlg();
				var vo=this.pmtVO.svo;
				this.page.vwHomeStage.gemForceRevenge(vo);
			}
		};
	}
}