if(!__Page.pmtClan)
{
	__Page.pmtClan=new __Page.gamePage.pmtBase(__Page,__Page.gamePage.appEnv,3,0);
	__Page.pmtClan.loadConfig=function()
	{
		this.dlgPage.gamePage.pmtBase.prototype.loadConfig.call(this);
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var cntW=this.contentW, cntH=this.contentH, cInner=this.contentInner;
		this.descTxtCSS={css:cssLib.textFineMid.createCSS([cntW/2,80,0],"说明信息",cntW-20,cntH,1,0,1,0,null,1),display:0};
	};
	__Page.pmtClan.init=function(appEnv)
	{
		this.name="pmtClan";
	};

	__Page.pmtClan.enter=function(preState,vo)
	{
		this.dlgPage.gamePage.pmtBase.prototype.init.call(this,this.appEnv);
		this.dlgPage.gamePage.pmtBase.prototype.enter.call(this,preState,vo);
	//	this.infoText.setAlignH(1);
		this.infoText.setDisplay(0);
		this.descTxt=this.cntBox.appendNewChild({css:this.descTxtCSS});

		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=appEnv.page;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var keyid;
		this.infoVO=vo;
		if(vo)
		{
			this.initByUI(vo);
		}
	};

	__Page.pmtClan.leave=function(nextState)
	{
	//	this.dlgPage.gamePage.prototype.leave.call(this,nextState);
		this.pmtFrame.getItemById("dlgCloseKey").setKey(0);
		this.btnClose.setKey(0);
		var appEnv=this.appEnv;
		appEnv.hudOut(this.pmtFrame,0,function(){
			this.pmtFrame.getFather().removeChild(this.pmtFrame);
		},this);
	};

	__Page.pmtClan.initByUI=function(vo)
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=appEnv.page;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var keyid;
		var cntW=this.contentW, cntH=this.contentH, cInner=this.contentInner;
		var param=vo.pmtParam;
		var gemNum=appEnv.getClanResNum();
		//底部区域
		var btmW=cntW-20, btmH=36, btmX=cntW/2, btmY=cntH-10-btmH/2;
		this.btmCSS={id:"btm",type:"div3x3",pos:[btmX,btmY,0],w:btmW,h:btmH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green"),display:0,
		//	color_r:184,color_g:189,color_b:115,color_a:180,
			items:[{css:cssLib.textFineMid.createCSS([0,0,0],"",btmW,btmH,1,1,1,1)}]
		};
		this.btmBox=this.cntBox.appendNewChild({css:this.btmCSS});
		if("GemAllot"==vo.ui)//分配钻石
		{
			this.dlgTitle._setText(textLib["AllotGemTitle"]);
			var fontDesc=FS.L, fontLbx=FS.S;
			//top box
			var tbX=6, tbY=5, tbW=cntW-tbX*2, tbH=86;
			this.topBox=this.cntBox.appendNewChild({id:"top",type:"div3x3",pos:[tbX,tbY,0],w:tbW,h:tbH,css:imgLib.getImg("box_green"),ui_event:1});
			//仓库剩余
			var remainX=8, remainY=6, remainW=tbW-remainX*2, remainH=30;
			this.remainTxt=this.topBox.appendNewChild({id:"remain",css:cssLib.textFineMid.createCSS([remainX,remainY,0],textLib["ClanGemRemain"],remainW,remainH,0,0,0,0,null,1),font_size:fontDesc});
			//钻石条
			var textSize=appEnv.getTextSize(textLib["ClanGemRemain"],fontDesc), bgPic=imgLib.getImg("box_resboxMirror"), bgMR=bgPic.mgR;
			var gemBoxX=remainX+textSize.w, gemBoxY=remainY+textSize.h/2, gemBoxW=160, gemBoxH=32;
			var iconX=gemBoxW-bgMR/2, iconSize=46, numX=(gemBoxW-bgMR)/2;
			this.gemBox=this.topBox.appendNewChild({id:"gem-box",type:"div3x3",pos:[gemBoxX,gemBoxY,0],w:gemBoxW,h:gemBoxH,anchor_h:0,anchor_v:1,css:bgPic,color_a:200,items:[
				{id:"gem-icon",type:"icon",pos:[iconX,0,0],w:iconSize,h:iconSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("res_gem",64)},
				{id:"gem-num",css:cssLib.textFineSmall.createCSS([numX,0,0],gemNum,10,10,1,1,1,1),font_size:fontDesc}
			]});
			//分配给
			var allotX=remainX, allotY=remainY+remainH, allotW=remainW, allotH=remainH;
			this.allotToTxt=this.topBox.appendNewChild({id:"allotTo",css:cssLib.textFineMid.createCSS([allotX,allotY,0],textLib.getTextEx("AllotGemDesc",{name:param.name}),allotW,allotH,0,0,0,0),font_size:fontDesc});
			//数字输入
			var inputW=250, inputH=46, inputX=(cntW-inputW)/2, inputY=tbY+tbH+40+inputH/2;//inputY=allotY+allotH+20+inputH/2;
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onInputClk);
			this.inputBox=this.cntBox.appendNewChild({id:"input",css:cssLib.inputBox.createCSS([inputX,inputY,0],inputW,inputH,keyid,textLib["InputAllotGemNum"])});
			//确认按钮
			var scale=0.8, btnW=152*scale, btnH=64*scale, btnX=cntW/2, btnY=inputY+inputH/2+26+btnH/2;
			var uvInfo={uv3x3:[25/1024,20/1024,22/1024,24/1024],size3x3:[18,15,18,15]};
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onGemAllotClk);
			this.btnOK1=this.cntBox.appendNewChild({id:"ok1",css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["OK"],btnW,btnH,0,uvInfo)});
			//底部
			this.btmBox.setDisplay(1);
			this.btmBox.firstChild()._setText(textLib["AllotGemTip"]);
		}
		else if("GemInfo"==vo.ui)//钻石详情
		{
			this.dlgTitle._setText(textLib["GemStorageTitle"]);
			var fontDesc=FS.L, fontLbx=FS.S;
			//top box
			var tbX=6, tbY=5, tbW=cntW-tbX*2, tbH=86;
			this.topBox=this.cntBox.appendNewChild({id:"top",type:"div3x3",pos:[tbX,tbY,0],w:tbW,h:tbH,css:imgLib.getImg("box_green"),ui_event:1});
			//仓库剩余
			var remainX=8, remainY=6, remainW=tbW-remainX*2, remainH=30;
		//	this.remainTxt=this.topBox.appendNewChild({id:"remain",css:cssLib.textFineMid.createCSS([remainX,remainY,0],textLib.getTextEx("GemRemain",{num:gemNum}),remainW,remainH,0,0,0,0,null,1),font_size:fontDesc});
			this.remainTxt=this.topBox.appendNewChild({id:"remain",css:cssLib.textFineMid.createCSS([remainX,remainY,0],textLib["ClanGemRemain"],remainW,remainH,0,0,0,0,null,1),font_size:fontDesc});
			//钻石条
			var textSize=appEnv.getTextSize(textLib["ClanGemRemain"],fontDesc), bgPic=imgLib.getImg("box_resboxMirror"), bgMR=bgPic.mgR;
			var gemBoxX=remainX+textSize.w, gemBoxY=remainY+textSize.h/2, gemBoxW=160, gemBoxH=32;
			var iconX=gemBoxW-bgMR/2, iconSize=46, numX=(gemBoxW-bgMR)/2;
			this.gemBox=this.topBox.appendNewChild({id:"gem-box",type:"div3x3",pos:[gemBoxX,gemBoxY,0],w:gemBoxW,h:gemBoxH,anchor_h:0,anchor_v:1,css:bgPic,color_a:200,items:[
				{id:"gem-icon",type:"icon",pos:[iconX,0,0],w:iconSize,h:iconSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("res_gem",64)},
				{id:"gem-num",css:cssLib.textFineSmall.createCSS([numX,0,0],gemNum,10,10,1,1,1,1),font_size:fontDesc}
			]});
			//获得方式
			var gainX=remainX, gainY=remainY+remainH, gainW=remainW, gainH=remainH;
			this.gainTip=this.topBox.appendNewChild({id:"tip",css:cssLib.textFineMid.createCSS([gainX,gainY,0],textLib["ClanGemGetTip"],gainW,gainH,0,0,0,0,null,1),font_size:fontDesc});
			//bottom box
			var bbX=tbX-2, bbY=tbY+tbH+2, bbW=cntW-bbX*2, bbH=cntH-bbY-2;
			this.bottomBox=this.cntBox.appendNewChild({id:"bottom",type:"div3x3",pos:[bbX,bbY,0],w:bbW,h:bbH,css:imgLib.getImg("box_dlgcontent"),ui_event:1});
			//分配记录
			var recordX=remainX, recordY=12, recordW=bbW-recordX*2, recordH=remainH;
			this.recordTxt=this.bottomBox.appendNewChild({id:"record",css:cssLib.textFineMid.createCSS([recordX,recordY,0],textLib["AllotRecord"],recordW,recordH,0,0,0,0),font_size:fontDesc});
			//时间
			var timeW=136, timeH=recordH, timeX=bbW-recordX, timeY=recordY;
			this.timeTxt=this.bottomBox.appendNewChild({id:"time",css:cssLib.textFineMid.createCSS([timeX,timeY,0],textLib["Time"],timeW,timeH,2,0,1,0),font_size:fontDesc});
			//分配记录list
			var listX=0, listY=recordY+recordH+3, listW=bbW-listX*2, listH=bbH-listY-6;
			var itemW=listW, itemH=recordH;
			var detailX=recordX, detailY=0, detailW=recordW, detailH=recordH;
			var i, items=[];
			var detail=param.clanVO.awardMsgs;
		//	DBOut(toJSON(param));

			if(this.dwrObj)
				return;
			this.dwrObj=this.appEnv.newMsg(["ClanDwr","getAwardMsgByClanId",param.clanVO.id],{cb:function(vo){
				DBOut("getAwardMsgByClanId: "+toJSON(vo));
				this.dwrObj=null;
				if(vo && vo.length)
				{
					detail=vo;
				}
				var detailStr="";
				for(i=0; i<detail.length; i++)
				{
					if(-100==detail[i].userId)
					{
						detailStr=textLib.getTextEx("LandWarRewardDesc",{area:window.aisEnv.defLib.clanCupDomains[detail[i].userName]["name"],num:detail[i].res.num});
					}
					else
					{
						detailStr=textLib.getTextEx("AllotGemDetail",{position:textLib["ClanPosition"+detail[i].rankLevel],name:detail[i].userName,num:detail[i].res.num});
					}
					items.push({id:"item"+i,type:"icon",pos:[0,0,0],w:itemW,h:itemH,ui_event:1,items:[
						{id:"detail",css:cssLib.textFineSmall.createCSS([detailX,detailY,0],detailStr,detailW,detailH,0,0,0,1),font_size:fontLbx},
						{id:"time",css:cssLib.textFineSmall.createCSS([timeX,detailY,0],textLib.getTimeDistance(detail[i].time),timeW,timeH,2,0,1,1),font_size:fontLbx},
					]});
				}
				this.lbxAllot=this.bottomBox.appendNewChild({id:"detail",type:"listbox",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,
					arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
					item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
					display:1,fade:1,fade_size:1,fade_alpha:0,clip:1,line_items:items
				});
			},cbobj:this,eh:function(){this.dwrObj=null;},ehobj:this},window.ClanDWRUrl);
		}
		else if("Donate"==vo.ui)//捐献
		{
			this.dlgTitle._setText(textLib["ClanDonate"]);
			//捐献说明
			var pos=[];
			this.infoText.getPos(pos);
			pos[1]-=5;
			this.infoText.setPos(pos);
			this.infoText.setDisplay(1);
			this.infoText._setText(textLib["DonateDesc"]);
			//缺少提示
			var lackX=cntW/2, lackY=65, lackW=cntW, lackH=23;
			this.lackTxt=this.cntBox.appendNewChild({id:"lack",type:"text",pos:[lackX,lackY,0],w:lackW,h:lackH,anchor_h:1,anchor_v:0,align_h:1,align_v:0,text:textLib["DonateResLack"],
				color_r:255,color_g:0,color_b:0,color_a:255,font_size:FS.L,display:0});
			//捐献box
			var boxW=236, boxH=190-12, boxY=lackY+lackH;
			var lbX=28, rbX=cntW-lbX-boxW;
			var bgSize=150, bgX=boxW/2, bgY=bgSize/2-6;
			var resX=boxW/2, resY=20-13, resW=boxW, resH=40;
			var pointX=resX, pointY=resY+resH+46+15, pointW=resW, pointH=36;
			var btnW=164*0.7, btnH=64*0.7, btnX=resX, btnY=boxH-10-btnH/2+6, fontBtn=FS.L;//btnY=pointY+pointH+btnH/2;
			var uvInfo={uv3x3:[25/1024,20/1024,22/1024,24/1024],size3x3:[18,15,18,15]};
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onDonateFreeClk);
			this.leftBox=this.cntBox.appendNewChild({id:"left-box",type:"div3x3",pos:[lbX,boxY,0],w:boxW,h:boxH,css:imgLib.getImg("box_dlgcontent"),ui_event:1,items:[
				{id:"bg",type:"icon",pos:[bgX,bgY,0],w:bgSize,h:bgSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("donate_res",128)},
				{id:"res",type:"text",pos:[resX,resY,0],w:resW,h:resH,anchor_h:1,anchor_v:0,align_h:1,align_v:0,text:textLib["DonateResNum"],
					color_r:0,color_g:0,color_b:0,color_a:255,font_size:FS.L},
				{id:"point",type:"text",pos:[pointX,pointY,0],w:pointW,h:pointH,anchor_h:1,anchor_v:0,align_h:1,align_v:0,text:textLib.getTextEx("DonateClanPoint",{num:window.aisEnv.defLib.clan["genDonate"]["exp"]}),
					color_r:0,color_g:0,color_b:0,color_a:255,font_size:FS.L},
				{id:"donate",css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["DonateClan"],btnW,btnH,fontBtn,uvInfo)}
			]});
			this.donateFree=this.leftBox.getItemById("donate");
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onDonateGemClk);
			this.rightBox=this.cntBox.appendNewChild({id:"left-box",type:"div3x3",pos:[rbX,boxY,0],w:boxW,h:boxH,css:imgLib.getImg("box_dlgcontent"),ui_event:1,items:[
				{id:"bg",type:"icon",pos:[bgX,bgY,0],w:bgSize,h:bgSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("donate_gem",128)},
				{id:"res",type:"text",pos:[resX,resY,0],w:resW,h:resH,anchor_h:1,anchor_v:0,align_h:1,align_v:0,text:textLib["DonateResNum"],
					color_r:0,color_g:0,color_b:0,color_a:255,font_size:FS.L},
				{id:"point",type:"text",pos:[pointX,pointY,0],w:pointW,h:pointH,anchor_h:1,anchor_v:0,align_h:1,align_v:0,text:textLib.getTextEx("DonateClanPoint",{num:window.aisEnv.defLib.clan["powerDonate"]["exp"]}),
					color_r:0,color_g:0,color_b:0,color_a:255,font_size:FS.L},
				{id:"donate",css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,"",btnW,btnH,0,uvInfo)}
			]});
			this.donateGem=this.rightBox.getItemById("donate");
			var iconX=btnW/2-3, iconSize=38, numX=iconX-iconSize-3;
			this.donateGem.appendNewChild({id:"gem",type:"icon",pos:[iconX,0,0],w:iconSize,h:iconSize,anchor_h:2,anchor_v:1,css:imgLib.getIcon("res_gem",64)});
			var gemCost=window.aisEnv.defLib.globals["CLAN_DONATE_COST_GEM"];
			var bad=gemCost>window.aisGame.king.gemNum?1:0;
			var color=bad?[255,0,0,255]:[255,255,255,255];
			this.donateGem.appendNewChild({id:"donate-num",css:cssLib.textFineMid.createCSS([numX,0,0],textLib["DonateClanGem"]+" "+gemCost,10,10,2,1,2,1,color),font_size:fontBtn});
			//底部
			this.btmBox.setDisplay(1);
			this.btmBox.firstChild()._setText(textLib["DonateClanDesc"]);
		}
	};

	__Page.pmtClan.checkRare=function(vo)
	{
	};

	//--------------------------------------------------------------------------
	//结果处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtClan.openBoxOK=function(vo)
		{
		};

		__Page.pmtClan.openBoxErr=function()
		{
		};
	}

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtClan.onClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{

			}
		};

		__Page.pmtClan.onCloseClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.dlgPage.gamePage.pmtBase.prototype.onCloseClk.call(this,msg,key,way,extra);
				var pmtVO=this.pmtVO;
				if(pmtVO && pmtVO.pmtObj && pmtVO.pmtFunc)
				{
					pmtVO.pmtFunc.call(pmtVO.pmtObj,0,pmtVO.pmtParam);
				}
			}
		};

		__Page.pmtClan.onOkClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.dlgPage.gamePage.pmtBase.prototype.onCloseClk.call(this,msg,key,way,extra);
				var pmtVO=this.pmtVO;
				if(pmtVO && pmtVO.pmtObj && pmtVO.pmtFunc)
				{
					pmtVO.pmtFunc.call(pmtVO.pmtObj,1,pmtVO.pmtParam);
				}
			}
		};

		__Page.pmtClan.onInputClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var num=this.inputBox.onInput();
				this.allotNum=0;
				if(!num)return;
				if(num)
					num=parseInt(num,10);
				if(num>0 && num<=appEnv.getClanResNum())
				{
					this.inputBox._setText(num);
					this.allotNum=num;
				}
				else
				{
					this.inputBox.setError(textLib["InputErrorIllegal"]);
				}
			}
		};

		__Page.pmtClan.onGemAllotClk=function(msg,key,way,extra)//钻石分配
		{
			if(1==way && 1==msg)
			{
				DBOut("onGemAllotClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(this.allotNum)
				{
					this.pmtVO.pmtObj.allotGem(this.pmtVO.pmtParam,this.allotNum);
					this.appEnv.closePmtDlg(null,null,0);
				//	this.pmtVO.state.clanGem._setText(appEnv.getClanResNum());
					this.pmtVO.dlg.updateClanPoint();
					appEnv.stateLogs.showLog(textLib["AllotGemSuccess"]);
				}
				else
				{
					this.appEnv.stateLogs.showLog(textLib["InputGemNum"]);
				}
			}
		};

		__Page.pmtClan.onDonateFreeClk=function(msg,key,way,extra)//联盟捐献，免费
		{
			if(1==way && 1==msg)
			{
				DBOut("onDonateFreeClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;

				if(appEnv.getClanFreeDonate())
				{
					var bld=window.aisGame.king.getHashObj("Obj0");
					if(bld)bld.dailyDonateTimes++;
					this.page.vwHomeStage.clanDonate(0,function(){
						this.appEnv.stateLogs.showLog(textLib.getTextEx("ClanDonateSuccess",{num:window.aisEnv.defLib.clan["genDonate"]["exp"]}));
						this.appEnv.closePmtDlg(null,null,0);
					//	this.pmtVO.state.clanPoint._setText(appEnv.getClanPoint());
						this.pmtVO.dlg.updateClanPoint();
					},this);
				}
				else
				{
					this.appEnv.stateLogs.showLog(textLib["NoClanDonateTimes"]);
				}
			}
		};

		__Page.pmtClan.onDonateGemClk=function(msg,key,way,extra)//联盟捐献，钻石
		{
			if(1==way && 1==msg)
			{
				DBOut("onDonateGemClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				this.page.vwHomeStage.clanDonate(1,function(){
					this.appEnv.stateLogs.showLog(textLib.getTextEx("ClanDonateSuccess",{num:window.aisEnv.defLib.clan["powerDonate"]["exp"]}));
					this.appEnv.closePmtDlg(null,null,0);
				//	this.pmtVO.state.clanPoint._setText(appEnv.getClanPoint());
					this.pmtVO.dlg.updateClanPoint();
				},this);
			}
		};
	}
}
