if(!__Page.dlgBox)
{
	__Page.dlgBox=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgBox;
	__Page.dlgBox.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var pic, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//底部区域
		var btmBoxW=cntW-20, btmBoxH=66-4, btmBoxX=cntW/2, btmBoxY=cntH-cntInner[1]/2-btmBoxH/2;
		this.btmBoxCSS={id:"btmBox",type:"div3x3",pos:[btmBoxX,btmBoxY+2,0],w:btmBoxW,h:btmBoxH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green"),
			color_r:184,color_g:189,color_b:115,color_a:180,
			items:[{css:cssLib.textFineMid.createCSS([0,0,0],textLib["SelBox"],btmBoxW,btmBoxH,1,1,1,1)}]
		};
		//顶部区域
		var topTxtW=cntW-30, topTxtH=56, topTxtX=cntW/2, topTxtY=20;
		topTxtH=appEnv.getTextSize(textLib["SuperSupplyDesc"],FS.FM,1,topTxtW,topTxtH).h;
		this.topTxtCSS={id:"topTxt",css:cssLib.textFineMid.createCSS([topTxtX,topTxtY,0],textLib["SuperSupplyDesc"],topTxtW,topTxtH,1,0,0,0,null,1)};
		//宝箱区域
		var gap=20;
		var lbxX=30, lbxH=btmBoxY-btmBoxH/2-topTxtY-topTxtH-gap*2, lbxW=cntW-lbxX*2, lbxY=topTxtY+topTxtH+gap;
		var itemW=Math.floor(lbxW/3), itemH=lbxH, subW=itemW-6, subH=lbxH;
		this.lbxCSS={css:cssLib.multiList.createCSS([lbxX,lbxY,0],lbxW,lbxH,0,itemW,itemH,subW,subH,1,3)};
		//宝箱css
		var self=this;
		var subX=subW/2, subY=subH/2, iconW=subW, iconH=subW;
		var infoX=subX-24, infoY=-subY+24;
		var nameFont=FS.XXL, nameW=subW, nameH=appEnv.getTextSize(textLib["SuperSupply1"],nameFont).h, nameX=0, nameY=infoY;
		var priceSize=64, priceFont=FS.FM, priceTxtW=appEnv.getTextSize(textLib["SupplyCost"]+99,priceFont).w, priceW=priceSize+priceTxtW, priceX=-priceW/2;
		var priceIcon=imgLib.getIcon("res_gem",64);
		priceIcon.w=priceIcon.h=priceSize;
		this.boxCSS={
			createCSS:function(idx,itemKey,infoKey)
			{
				var url=imgLib.genIconPath("icon_box"+(idx+1)+"_32");
				var css={type:"key",pos:[subX,subY,0],anchor_h:1,anchor_v:1,w:subW,h:subH,ui_event:1,key:itemKey,down_scale:0.95,css:imgLib.getImg("box_shopitem"),
					state_up:{w:subW,h:subH,css:imgLib.getImg("box_shopitem"),},state_down:{w:subW,h:subH,css:imgLib.getImg("box_shopitem"),},
					state_gray:{w:subW,h:subH,css:imgLib.getImg("box_shopitem_g"),},audio:page.audioObject.genFileURL("btn_click"),
					items:[
					//	{type:"div3x3",id:"BG",pos:[0,-subY,0],w:subW,h:subH,anchor_h:1,anchor_v:0,css:imgLib.getImg("box_shopitem")},
						{id:"Info",css:cssLib.btnInfo.createCSS([infoX,infoY,0],infoKey)},
						{id:"Name",css:cssLib.textFineMid.createCSS([nameX+8,nameY,0],textLib["SuperSupply"+(idx+1)],nameW,nameH,1,1,0,1),font_size:nameFont},
						{type:"icon",id:"Icon",pos:[0,0,0],w:iconW,h:iconH,anchor_h:1,anchor_v:1,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,},
						{type:"text",id:"NoTip",css:cssLib.textFineBig.createCSS([0,0,0],textLib["WillOpen"],nameW,nameH,1,1,1,1),font_size:FS.FB,display:1},
						{type:"text",id:"FreeTip",css:cssLib.textFineMid.createCSS([0,140,0],textLib["TodayFreeTimes"]+2,nameW,nameH,1,1,1,1),font_size:priceFont,display:0},
						{id:"Price",css:cssLib.iconText.createCSS([priceX,140,0],priceIcon,textLib["SupplyCost"]+99,2,null,priceFont),display:1},
					//	{type:"div3x3",id:"sel",pos:[0,-5,0],w:subW+8,h:subH+8,css:imgLib.getImg("box_sel"),anchor_h:1,anchor_v:1,display:0}
					],
					dlg:self,update:this.update,appEnv:appEnv,url:url
				};
				return css;
			},
			update:function(vo)
			{
				var infoBtn=this.getItemById("Info");
				var nameTxt=this.getItemById("Name");
				var itemIcon=this.getItemById("Icon");
				var noTxt=this.getItemById("NoTip");
				var freeTxt=this.getItemById("FreeTip");
				var priceItem=this.getItemById("Price");

				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;

				this.def=vo;
				this.free=0;
				if(vo)
				{
				//	DBOut(toJSON(vo));
					this.setEnabled(1);
					nameTxt._setText(vo.name);
					noTxt.setDisplay(0);
					var free=vo["FreeTimes"]-vo.dailyTimes;
					this.free=free;
					DBOut("=== "+vo["codeName"]+" free dailyTimes: "+free);
					if(free>0)
					{
						freeTxt._setText(textLib["TodayFreeTimes"]+textLib["GetTimes"](free));
						freeTxt.setDisplay(1);
						priceItem.setDisplay(0);
					}
					else
					{
						freeTxt.setDisplay(0);
						priceItem.setDisplay(1);
						priceItem._setText(textLib["SupplyCost"]+vo["cost"]["gem"]);
					}
					itemIcon.setColor([255,255,255,255]);
				}
				else
				{
					this.setEnabled(0);
					freeTxt.setDisplay(0);
					noTxt.setDisplay(1);
					priceItem.setDisplay(0);
					itemIcon.setColor([255,255,255,120]);
				}
			}
		};
	};
	__Page.dlgBox.init=function(appEnv)
	{
		this.name="dlgBox";
		this.viewId="dlgBox";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;
		DBOut("dlgBox.init: "+appEnv);

		var boxw=this.boxW;
		var boxh=this.boxH;
		var cntW=this.contentW;

		this.topTxt=this.cntBox.appendNewChild({css:this.topTxtCSS});
		this.btmBox=this.cntBox.appendNewChild({css:this.btmBoxCSS});
		this.lbxBox=this.cntBox.appendNewChild({css:this.lbxCSS});
		//Init sub-states:
		this.dlgPage.pmtBox.init(appEnv);
		this.dlgPage.dlgBoxOpen.init(appEnv);
	};

	__Page.dlgBox.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;

		this.dlgTitle._setText(textLib["SuperSupply"]);
		//根据VO初始化界面:
		this.infoVO=vo;
		if(vo)
		{
			this.aisBld=vo;//.aisBld;
			var i, j, keyid1, keyid2, btn, box=[];

			var defLib=window.aisEnv.defLib.box;
			var boxTimes=window.aisGame.curCity.openBoxTimesDaily;
		//	DBOut("=== "+boxTimes);
			for(i in defLib)
			{
				if(defLib[i]["codeName"] && defLib[i]["IsShow"])
				{
					box.push(defLib[i]);
				}
			}
			this.boxDef=box;

			appEnv.setDlgAniCall(function(){
				for(i=0; i<3; i++)
				{
					keyid1=appEnv.hudKeys.getKey(this);
					keyid2=appEnv.hudKeys.getKey(this);
					btn=this.lbxBox._addItem(i,this.boxCSS.createCSS(i,keyid1,keyid2));
					this.regKeyVO(keyid1,btn,this.onBoxClk);
					this.regKeyVO(keyid2,btn,this.onBoxInfoClk);
				}
				this.lbxBox.fadeIn(5,0);
				this.lbxBox.update(box);
			//	this.updateView();
			},this);
		}
		else
		{
			this.updateView();
		}
		if(preState)
		{
			appEnv.hudIn(this.cntBox,20);
		}
	};

	__Page.dlgBox.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(nextState)
		{
			appEnv.hudOut(this.cntBox,10);
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgBox.onSvrOK=function(vo)
	{
		DBOut("onSvrOK:"+toJSON(vo));
		this.dlgPage.pmtBox.svrVO=vo;
	};

	__Page.dlgBox.aisUpdateView=function()
	{
		this.updateView(1);
	};

	__Page.dlgBox.updateView=function(hold)
	{
		this.lbxBox.update(this.boxDef);
	};

	__Page.dlgBox.openBox=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;

		var url=this.selItem.url;
		var def=this.selItem.def;
//		var free=this.selItem.free;
//		var cvo=def.cost;
//		DBOut("*** cvo:"+toJSON(cvo));
//		if(free>0)
//		{
//			cvo={cash:0,gem:0,storage:[]};
//		}
//
//		if(!this.page.vwHomeStage.checkCost(cvo,1,this.openBox,this,[]))
//		{
//			return;
//		}
//
//		var aisBld=this.aisBld;
//		appEnv.showPmtDlg(this.dlgPage.pmtBox,0,{
//			title:def?def["name"]:textLib["WillOpen"],
//			align:1,
//			showType:"random",
//			def:def,aisBld:aisBld,url:url,
//			pmtFunc:this.updateView,pmtObj:this,pmtParam:null
//		});
//		window.aisGame.king.execCmd(aisBld,"GetBoxReward",{boxId:def["codeName"],isFree:this.free>0?0:1,callBack:this.onSvrOK,callObj:this},aisBld);

		appEnv.switchDlg(this.dlgPage.dlgBoxOpen,0,def);
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgBox.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
			{
				//DBOut("dlgBox.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//建造按钮被点击
		__Page.dlgBox.onBoxClk=function(msg,key,way,extra)
		{
			var self,def,cvo,free;
			self=this.dlg;
			var appEnv=self.appEnv;
			var page=self.page;
			var textLib=appEnv.textLib;
			if(msg==1 && way==1)
			{
				DBOut("onBoxClk, "+self);
				def=this.def;
				self.selItem=this;
				cvo=def.cost;
				free=this.free;
				self.free=free;
				var title, desc;
				title=textLib["OpenBox"](def["name"]);
				desc=textLib["OpenBoxDesc"](def["name"],free,def["cost"]["gem"]);

//				appEnv.showPmtDlg(page.pmtChoose,0,
//					{
//						title:title,info:desc,
//						pmtFunc:function(ok)
//						{
//							if(ok)
//							{
//								self.openBox();
//							}
//						},pmtObj:this,pmtParam:null
//					}
//				);

				self.openBox();
			}
		};

		//部件信息被点击
		__Page.dlgBox.onBoxInfoClk=function(msg,key,way,extra)
		{
			var self,def;
			self=this.dlg;
			var appEnv=self.appEnv;
			var page=self.page;
			var textLib=appEnv.textLib;
			if(msg==1 && way==1)
			{
				DBOut("onBoxInfoClk");
				def=this.def;
				appEnv.showPmtDlg(self.dlgPage.pmtBox,0,{
					title:def?textLib["RareSupply"]:textLib["WillOpen"],
				//	info:textLib.getText(textLib["MechNo2AtkInfo"],{num:2}),
					align:1,
					showType:"info",
					def:def,
					pmtFunc:function(){},pmtObj:self,pmtParam:null
				});
			}
		};
	}
}
