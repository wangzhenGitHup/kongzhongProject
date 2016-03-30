if(!__Page.dlgAddOnJoint)
{
	__Page.dlgAddOnJoint=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgAddOnJoint.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	};
	__Page.dlgAddOnJoint.init=function(appEnv)
	{
		this.name="dlgAddOnJoint";
		this.viewId="dlgAddOnJoint";
		this.slotVsn=0;
		this.rmCap=0;
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgAddOnBuy;
		var keyid=0;
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);
		//生产入口按钮
		keyid=homeDlg.menuBuy.getKey();
		this.regKeyVO(keyid,homeDlg,homeDlg.onPurchaseClk);
		//仓库入口按钮
		keyid=homeDlg.menuStorage.getKey();
		this.regKeyVO(keyid,homeDlg,homeDlg.onStorageClk);

		var boxw,boxh,btn,defLib,list,i,n,def,x,y,css,btnw,btnh;

		boxw=this.boxW;
		boxh=this.boxH;
		var cntW=this.contentW, cntH=this.contentH;

		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({id:"contentField-info",css:[this.contentFieldCSS],display:0});

		var pic=imgLib.getImg("bg_addon"), picW=pic.w, picH=pic.h;
		var jointW=800, jointH=344, jointX=(cntW-jointW)/2, jointY=6;
		this.jointBox=this.cntBox.appendNewChild({type:"icon",pos:[jointX,jointY,0],w:jointW,h:jointH,css:pic,ui_event:1,face_r:100,face_g:100,face_b:100,face_a:100});
		var addOnSize=150, sAddOnSize=100;
		//左合成原件按钮：
		keyid=appEnv.hudKeys.getKey(this);
		this.btnJoinL=this.jointBox.appendNewChild(
			this.dlgPage.btnAddOnJoin.createCSS(page,appEnv,picW/2-20-addOnSize/2,30+addOnSize/2,keyid,textLib["MajorAddOn"])
		);
		this.regKeyVO(keyid,this,this.onBtnJoinLClk);

		//右合成原件按钮：
		keyid=appEnv.hudKeys.getKey(this);
		this.btnJoinR=this.jointBox.appendNewChild(
			this.dlgPage.btnAddOnJoin.createCSS(page,appEnv,picW/2+20+addOnSize/2,30+addOnSize/2,keyid,textLib["SecondaryAddOn"])
		);
		this.regKeyVO(keyid,this,this.onBtnJoinRClk);

		//合成宝石按钮：
		keyid=appEnv.hudKeys.getKey(this);
		this.btnFuseOil=this.jointBox.appendNewChild(
			this.dlgPage.dlgCSSBtnFuseOil.createCSS(page,appEnv,picW/2,190+sAddOnSize/2,keyid,textLib["CrystalAddOn"])
		);
		this.regKeyVO(keyid,this,this.onBtnFuseOilClk);
	//	this.btnFuseOil.setDisplay(0);

		this.rateTxt=this.jointBox.appendNewChild({type:"text",pos:[542,308,0],w:126,h:30,anchor_h:1,anchor_v:1,align_h:1,align_v:1,font_size:FS.FM,text:"%"});

		var btnX=26, btnY=20, btnW=144, btnH=64;
		keyid=appEnv.hudKeys.getKey(this);
		this.btnJointReset=this.jointBox.appendNewChild(
			cssLib.normalBtn.createCSS([btnX+btnW/2,jointH-btnY-btnH/2,0],keyid,0,textLib["Reset"],btnW,btnH)
		);
		this.regKeyVO(keyid,this,this.onJointResetClk);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnJointOK=this.jointBox.appendNewChild(
			cssLib.normalBtn.createCSS([jointW-btnX-btnW/2,jointH-btnY-btnH/2,0],keyid,0,textLib["Joint"],btnW,btnH)
		);
		this.regKeyVO(keyid,this,this.onJointClk);

		keyid=appEnv.hudKeys.getKey(this);
		this.btnJointFail=this.jointBox.appendNewChild(
			{css:cssLib.normalBtn.createCSS([740,160,0],keyid,0,"Failed",btnW,btnH),display:0}
		);
		this.regKeyVO(keyid,this,this.onJointFailedClk);

		var descX=jointX, descY=jointY+jointH+10, descW=jointW, descH=cntH-descY-10, txtX=6;
		this.subBox=this.cntBox.appendNewChild({type:"div3x3",pos:[descX,descY,0],w:descW,h:descH,css:imgLib.getImg("box_dlgcontent"),items:[
			{id:"desc",type:"text",pos:[txtX,txtX,0],w:descW-txtX*2,h:descH-txtX*2,anchor_h:0,anchor_v:0,align_h:0,align_v:0,wrap:1,font_size:FS.M,color_r:10,color_g:10,color_b:10,color_a:180}
		]});
		this.descTxt=this.subBox.getItemById("desc");
		this.descTxt.setText(textLib["JointInfo"]);
	};

	__Page.dlgAddOnJoint.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var list,i,n,title;
		var textLib=appEnv.textLib;
		var bld,btn;

		this.homeDlg.menuBuy.setEnabled(1);
		this.homeDlg.menuJoint.setEnabled(0);
		this.homeDlg.menuStorage.setEnabled(1);
		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			bld=vo.aisBld;
			this.cocBld=vo;
			this.aisBld=bld;
			this.slotVsn=-1;
			this.slots=[];
		}
		if(this.aisBld)
		{
			bld=this.aisBld;
			title="Combine Mech Plug-in";
			this.homeDlg.dlgTitle._setText(title);
		}
		this.updateView();
		if(preState)
		{
			appEnv.hudIn(this.cntBox,20);
		}
	};

	__Page.dlgAddOnJoint.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(this.updateTimeTimer)
			this.appEnv.layer.clearTimeout(this.updateTimeTimer);
		if(nextState)
		{
			appEnv.hudOut(this.cntBox,10);
		}
	};

	__Page.dlgAddOnJoint.updateView=function()
	{
		var defL,defR;
		defL=this.btnJoinL.def;
		defR=this.btnJoinR.def;
		if(!defL)
		{
			this.btnJoinR.update(null,0);
			this.btnJoinR.setEnabled(0);
		}
		else
		{
			this.btnJoinR.setEnabled(1);
		}
		if(defL && defR)
		{
			this.btnJointOK.setEnabled(1);
			this.btnJointFail.setEnabled(1);
			this.btnJointReset.setEnabled(1);
			this.btnFuseOil.setEnabled(1);

			var qd=defL.quality-defR.quality;
			var q=defL.quality, rate="?";
			var defLib=window.aisEnv.defLib.compound;
			if(0==qd)
			{
				defLib=defLib["SameLevel"];
				if(q>0 && q<9)
					rate=defLib[q-1];
			}
			else if(qd>0 && qd<3)
			{
				defLib=defLib["DiffLevel"];
				if(q>1 && q<=9)
					rate=defLib[q-2];
			}
			if(this.btnFuseOil.def)
			{
				rate+=this.btnFuseOil.def["effect"]["compose"];
			}
			rate*=100;
			rate=Math.round(rate);
			this.rateTxt.setText(rate+"%");
		}
		else
		{
			this.btnJointOK.setEnabled(0);
			this.btnJointFail.setEnabled(0);
			this.btnFuseOil.setEnabled(0);
			if(!defL && !defR)
			{
				this.btnJointReset.setEnabled(0);
			}
			else
			{
				this.btnJointReset.setEnabled(1);
			}
			this.rateTxt.setText("%");
		}
	};

	__Page.dlgAddOnJoint.onJoint=function(vo)
	{
		DBOut("onJoint:"+toJSON(vo));
		this.dlgPage.pmtJoint.svrVO=vo;
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgAddOnJoint.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
			{
				//DBOut("dlgAddOnJoint.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//左按钮点击
		__Page.dlgAddOnJoint.onBtnJoinLClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("左按钮点击");
				this.appEnv.switchDlg(this.dlgPage.dlgChooseJointAddOn,0,{aisBld:this.aisBld,major:1,filterType:"AddOn",dlgType:0,dlg:this});
			}
		};

		//右按钮点击
		__Page.dlgAddOnJoint.onBtnJoinRClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("右按钮点击");
				this.appEnv.switchDlg(this.dlgPage.dlgChooseJointAddOn,0,{aisBld:this.aisBld,major:0,def:this.btnJoinL.def,filterType:"AddOn",dlgType:0,dlg:this});
			}
		};

		//中按钮点击
		__Page.dlgAddOnJoint.onBtnFuseOilClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("中按钮点击");
				this.appEnv.switchDlg(this.dlgPage.dlgChooseJointAddOn,0,{aisBld:this.aisBld,major:2,filterType:"FuseOil",dlgType:0,dlg:this});
			}
		};

		__Page.dlgAddOnJoint.resetJoint=function(msg,key,way,extra)
		{
			DBOut("****** resetJoint");
			this.btnJoinL.update(null,0);
			this.btnJoinR.update(null,0);
			this.btnFuseOil.update(null,0);
			this.updateView();
		};

		__Page.dlgAddOnJoint.onJointResetClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.resetJoint();
			}
		};

		__Page.dlgAddOnJoint.onJointClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var textLib=this.appEnv.textLib;
				var main, sub, special;
				main=this.btnJoinL.def;//.quality;
				sub=this.btnJoinR.def;
				special=this.btnFuseOil.def;
				if(!main || !sub)return;
//				main=main.codeName;
//				sub=sub.codeName;
				special=special?special.codeName:"";
				var aisBld=this.aisBld;

				var textLib=this.appEnv.textLib;
				var q,list;
				q=this.btnJoinL.def.quality;
				DBOut(main.quality+" vs "+sub.quality);
				if(9==main.quality && 9==sub.quality)
				{
					this.appEnv.stateLogs.showLog(textLib["AddOnLvMax"]);
					return;
				}
				if(main.quality==sub.quality)
					list=window.aisEnv.defLib.addon.addOnQualitys[q];
				else if(main.quality>sub.quality)
					list=window.aisEnv.defLib.addon.addOnQualitys[q-1];
				if(list)
				{
					this.appEnv.showPmtDlg(this.dlgPage.pmtJoint,0,
						{
							title:textLib["NoResTitle"],info:"XXXXX",
							done:0,bld:this.aisBld,
							addon1:this.btnJoinL.def,
							addon2:this.btnJoinR.def,
							addon3:this.btnFuseOil.def,
							addon4:"",
							pmtFunc:this.resetJoint,
							pmtObj:this,
							icon:this.page.imgLib.genIconPath("plu_L4_09_32")
						}
					);
					window.aisGame.king.execCmd(aisBld,"JointAddOn",{mainCodeName:main.codeName,subCodeName:sub.codeName,specialCodeName:special},aisBld);
				}
				else
				{
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["NoMatchAddOn"]);
				}
			}
		};

		__Page.dlgAddOnJoint.onJointOKClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				var textLib=this.appEnv.textLib;
				var q,newAddon,list,n;
				q=this.btnJoinL.def.quality;
				list=aisEnv.defLib.addon.addOnQualitys[q];
				if(list)
				{
					n=list.length;
					newAddon=list[Math.floor(n*Math.random())];
					DBOut("New Addon: "+newAddon);
					this.appEnv.showPmtDlg(this.dlgPage.pmtJoint,0,
						{
							title:textLib["NoResTitle"],info:"XXXXX",
							done:1,bld:this.aisBld,
							addon1:this.btnJoinL.def,
							addon2:this.btnJoinR.def,
							addon3:this.btnFuseOil.def,
							addon4:aisEnv.defLib.addon[newAddon],
							pmtFunc:this.resetJoint,
							pmtObj:this,
						}
					);
				}
			}
		};

		__Page.dlgAddOnJoint.onJointFailedClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				this.appEnv.showPmtDlg(this.dlgPage.pmtJoint,0,
					{
						title:textLib["NoResTitle"],info:"XXXXX",
						done:0,bld:this.aisBld,
						addon1:this.btnJoinL.def,
						addon2:this.btnJoinR.def,
						addon3:this.btnFuseOil.def,
						pmtFunc:this.resetJoint,
						pmtObj:this,
					}
				);
			}
		};
	}
	//--------------------------------------------------------------------------
	//逻辑回调函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgAddOnJoint.dlgChooseMajor=function(def)
		{
			//TODO: Code this:
			this.btnJoinL.update(def);
			this.btnJoinR.update(null);
			this.updateView();
		};

		__Page.dlgAddOnJoint.dlgChooseSecondary=function(def)
		{
			//TODO: Code this:
			this.btnJoinR.update(def);
			this.updateView();
		};

		__Page.dlgAddOnJoint.dlgChooseFuseOil=function(def)
		{
			//TODO: Code this:
			this.btnFuseOil.update(def);
			this.updateView();
		};

		__Page.dlgAddOnJoint.dlgJointDone=function(vo)
		{
			//TODO: Code this:
		};

		__Page.dlgAddOnJoint.dlgJointFailed=function(vo)
		{
			//TODO: Code this:
		};
	}
}
