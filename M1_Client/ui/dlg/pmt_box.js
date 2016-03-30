if(!__Page.pmtBox)
{
	__Page.pmtBox=new __Page.gamePage.pmtBase(__Page,__Page.gamePage.appEnv,3,0);
	__Page.pmtBox.loadConfig=function()
	{
		this.dlgPage.gamePage.pmtBase.prototype.loadConfig.call(this);
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var cntW=this.contentW, cntH=this.contentH, cInner=this.contentInner;
		this.descTxtCSS={css:cssLib.textFineMid.createCSS([cntW/2,80,0],"撒旦发射点发生的发生",cntW-20,cntH,1,0,1,0,null,1),display:0};
		/**************** 宝箱信息 ****************/
		var lbxX=cInner[0]/2, lbxY=cInner[1]/2, lbxW=cntW-lbxX*2, lbxH=cntH-lbxY*2;
		var itemW=lbxW, itemH=lbxH/4, subW=itemW/2-6, subH=itemH-4;
		this.lbxCSS={css:cssLib.multiList.createCSS([lbxX,lbxY,0],lbxW,lbxH,0,itemW,itemH,subW,subH,0,30),clip:1};

		var self=this, dt=5;
		var subX=subW/2, subY=itemH/2, iconW=subH-4, iconH=iconW, iconX=-subW/2+dt, iconY=0, nameX=iconX+iconW+dt, nameY=0, nameW=subW-nameX-dt, nameH=iconH;
		var itemIcon=imgLib.getIcon("plu_L4_08_32");
		itemIcon.w=itemIcon.h=iconH;
		this.boxCSS={
			createCSS:function(idx)
			{
				var css={type:"shape",pos:[subX,subY,0],anchor_h:1,anchor_v:1,w:subW,h:subH,//ui_event:1,key:itemKey,down_scale:0.95,css:imgLib.getImg("box_shopitem"),
				//	state_up:{w:subW,h:subH,css:imgLib.getImg("box_shopitem"),},state_down:{w:subW,h:subH,css:imgLib.getImg("box_shopitem"),},
				//	state_gray:{w:subW,h:subH,css:imgLib.getImg("box_shopitem_g"),},audio:page.audioObject.genFileURL("btn_click"),
					face_r:10,face_g:10,face_b:10,face_a:80,
					items:[
						{type:"icon",id:"Icon",pos:[iconX,iconY,0],w:iconW,h:iconH,anchor_h:0,anchor_v:1,tex:imgLib.genIconPath("plu_L4_08_32"),tex_u:0,tex_v:0,tex_w:1,tex_h:1,},
						{type:"text",id:"Qual",css:cssLib.textFineMid.createCSS([iconX,iconY,0],"???",iconW,iconH,0,1,0,0),},
						{type:"text",id:"Name",css:cssLib.textFineMid.createCSS([nameX,nameY,0],"???",nameW,nameH,0,1,0,1),},
					],
					dlg:self,update:this.update,appEnv:appEnv,
				};
				return css;
			},
			update:function(vo)
			{
				var itemIcon=this.getItemById("Icon");
				var nameTxt=this.getItemById("Name");
				var qTxt=this.getItemById("Qual");

				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var page=appEnv.page;
				var imgLib=page.imgLib;

				if(vo)
				{
					var resURL, name, q="";
					var info=appEnv.getItemInfo(vo);
					resURL=info.url;
					name=info.name;
					if(info.q>0)
						q=appEnv.getAddOnLv(info.q);
					itemIcon.setTexURL(resURL);
					nameTxt._setText(name+" x"+vo.num);
					qTxt._setText(q);
					if("Item"==vo.catalog && !this.getItemById("bg"))
						this.insertNewBefore({
							type:"icon",id:"bg",pos:[iconX,iconY,0],w:iconW,h:iconH,anchor_h:0,anchor_v:1,tex:imgLib.genIconPath("bg_tier4_32"),tex_u:0,tex_v:0,tex_w:1,tex_h:1
						},itemIcon);
				}
				else
				{
					
				}
			}
		};
		/**************** 宝箱开启 ****************/
		var pic=imgLib.getImg("pic_joint_bg");
		var boxX=38, boxY=70, boxW=pic.w, boxH=pic.h;
		this.boxFieldCSS={type:"icon",pos:[boxX,boxY,0],css:pic,anchor_h:0,anchor_v:0,items:[
			{id:"pic",type:"icon",pos:[boxW/2,boxH/2],css:imgLib.getIcon("gemPack8",256),anchor_h:1,anchor_v:1}
		]};
		var rx=boxX+boxW+18, rw=cntW-rx-boxX;
		var txtX=rx, txtW=rw, txtY=10, txtH=50;
		this.topTxtCSS={css:cssLib.textFineMid.createCSS([txtX,txtY,0],textLib["WaitingRadonm"],txtW,txtH,0,0,1,1,null,1)};
		var fieldX=rx, fieldY=boxY, fieldW=rw, fieldH=boxH, getIconX=fieldW/2, getIconY=10, getIconSize=128, getX=getIconX, getY=fieldH-2, getW=fieldW, getH=20;
		this.fieldCSS={type:"div3x3",pos:[fieldX,fieldY,0],w:fieldW,h:fieldH,css:imgLib.getImg("box_green"),items:[
			{id:"icon",type:"icon",pos:[getIconX,getIconY,0],w:getIconSize,h:getIconSize,anchor_h:1,anchor_v:0,css:imgLib.getIcon("plu_L7_08_32")},
			{id:"get",css:cssLib.textFineMid.createCSS([getX,getY,0],textLib["GetItem"]+"???",getW,getH,1,2,1,2)}
		]};
		var btnX=this.btnX1=cntW/2;
		var btnY=this.btnY1=cntH-35;
		this.againCSS={css:cssLib.textFineSmall.createCSS([btnX-80,btnY-30,0],textLib["Again"],100,20,1,1,1,1),font_size:FS.L,display:0};
	};
	__Page.pmtBox.init=function(appEnv)
	{
		this.name="pmtBox";
		this.boxesInfo=[];
	};

	__Page.pmtBox.enter=function(preState,vo)
	{
		this.dlgPage.gamePage.pmtBase.prototype.init.call(this,this.appEnv);
		this.dlgPage.gamePage.pmtBase.prototype.enter.call(this,preState,vo);
		this.infoText.setAlignH(1);
		this.descTxt=this.cntBox.appendNewChild({css:this.descTxtCSS});

		this.infoText.setDisplay(0);
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=appEnv.page;
		var cssLib=page.cssLib;
		var imgLib=page.imgLib;
		var keyid;
		this.infoVO=vo;
		if(vo)
		{
			if("info"==vo.showType)
			{
				if(vo.def)
				{
					this.lbxBox=this.cntBox.appendNewChild({css:this.lbxCSS});
					var i, btn, boxs=vo.def.boxs, items=[];
					for(i=0; i<boxs.length; i++)
					{
						if(boxs[i]["rare"] || "undefined"==typeof(boxs[i]["rare"]))
						{
							items.push(boxs[i]);
						}
					}
					for(i=0; i<items.length; i++)
					{
						btn=this.lbxBox._addItem(i,this.boxCSS.createCSS(i));
					}
					this.lbxBox.update(items);
				}
				else
				{
					this.infoText.setDisplay(1);
					this.infoText._setText(textLib["WillOpenDesc"]);
				}
			}
			else if("random"==vo.showType)
			{
				this.hold=1;
				DBOut(toJSON(vo.def));
				this.aisBld=vo.aisBld;
				var i, boxes=[], haveVO={}, list=vo.def.boxs;
				for(i=0; i<list.length; i++)
				{
					if(haveVO[list[i]["type"]])
						continue;
					haveVO[list[i]["type"]]=1;
					boxes.push(appEnv.getItemInfo(list[i]));
				}
				this.boxesInfo=boxes;
				this.curIdx=0;

				this.btnClose.setDisplay(0);
				this.boxField=this.cntBox.appendNewChild({css:this.boxFieldCSS});
				this.boxPic=this.boxField.getItemById("pic");
				this.topTxt=this.cntBox.appendNewChild({css:this.topTxtCSS});
				this.itemField=this.cntBox.appendNewChild({css:this.fieldCSS});
				this.itemObj=this.itemField.getItemById("icon");
				this.getText=this.itemField.getItemById("get");
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onRandomClk);
				this.btnFree=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS([this.btnX1,this.btnY1,0],keyid,0,textLib["ForFree"]),display:0});
				this.btnGo=this.cntBox.appendNewChild({css:cssLib.btnResGo.createCSS([this.btnX1,this.btnY1,0],160,"gem",0,0,keyid),display:0});
				this.btnGo.setStateStyle(0,{h:68});this.btnGo.setStateStyle(1,{h:68});this.btnGo.setStateStyle(2,{h:68});
				this.againTxt=this.cntBox.appendNewChild({css:this.againCSS});
				//确认按钮:
				keyid=this.appEnv.hudKeys.getKey(this);
				this.btnOK=this.cntBox.appendNewChild({css:cssLib.btnDlgOK.createCSS([this.btnX1,this.btnY1,0],keyid),display:0});
				this.regKeyVO(keyid,this,this.onOkClk);

				var scrSize=appEnv.scrSize, w=scrSize[0], h=scrSize[1];
				this.shapeBox=this.pmtBox.appendNewChild({type:"shape",id:"dlgMask",pos:[0,0,0],w:w,h:h,border_a:0,face_r:0,face_g:0,face_b:0,face_a:128,
					display:0,fade_pos:[0,0,0],fade_size:1,fade:1,fade_alpha:0,fade:1,fade_size:1,fade_alpha:0,fade_pos:[0,0,0],ui_event:1,items:[
					{type:"icon",id:"blocker",pos:[0,0,0],w:w,h:h,block_touch:1,ui_event:1},
					{type:"icon",id:"pic",pos:[w/2,h/2,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_getbox"),fade:1,fade_size:0,fade_alpha:0,fade_pos:[w/2,h/2,0],display:0}
				]});
				this.ehPic=this.shapeBox.getItemById("pic");
				this.ehPic.onFadeDone=function(fade)
				{
					if(fade)
					{
						appEnv.addZoomScale(this,[1.0,1.0,1.0],[1.2,1.2,1.0],0.3);
					}
				};

				this.boxPic.setTexURL(vo.url);
				this.updateCost();
				this.startRandom(1);
			}
		}
	};

	__Page.pmtBox.leave=function(nextState)
	{
	//	this.dlgPage.gamePage.prototype.leave.call(this,nextState);
		this.pmtFrame.getItemById("dlgCloseKey").setKey(0);
		this.btnClose.setKey(0);
		var appEnv=this.appEnv;
		appEnv.hudOut(this.pmtFrame,0,function(){
			this.pmtFrame.getFather().removeChild(this.pmtFrame);
		},this);
		this.svrVO=null;
		if(this.timer)
		{
			appEnv.layer.clearTimeout(this.timer);
			this.timer=null;
		}
		if(this.longTimer)
		{
			appEnv.layer.clearTimeout(this.longTimer);
			this.longTimer=null;
		}
		if(this.rdmTimer)
		{
			appEnv.layer.clearTimeout(this.rdmTimer);
			this.rdmTimer=null;
		}
		if(this.ehTimer)
		{
			appEnv.layer.clearTimeout(this.ehTimer);
			this.ehTimer=null;
		}
	};

	__Page.pmtBox.checkRare=function(vo)
	{
	//	vo.type="ResGold";vo.num=2000000;
		var def=this.infoVO.def;
		var boxes=def.boxs;
		vo=cloneToObj(vo);
		if("Gold"==vo.type)
			vo.type="ResGold";
		else if("Elixir"==vo.type || "Oil"==vo.type)
			vo.type="ResOil";
	//	else if("Gem"==vo.type)
	//		vo.type="gem";
		else if("tok1"==vo.type)
			vo.type="cash";
		else if("cube"==vo.type || "Cube"==vo.type)
			vo.type="ResCube";
		var i, box;
		for(i=0; i<boxes.length; i++)
		{
			box=boxes[i];
			DBOut("type: "+vo.type+" vs "+box["type"]+", num: "+vo.num+" vs "+box["num"]);
			if(vo.type==box["type"] && vo.num==box["num"])
				return box["rare"];
		}
		return 0;
	};

	__Page.pmtBox.updateCost=function()
	{
		var page=this.page;
		var def=this.infoVO.def;
		var bad=0, cost=0, res, cvo=def.cost, svo;
		if(def["FreeTimes"]-def.dailyTimes>0)
		{
			cvo={cash:0,gem:0,storage:[]};
		}
		else
		{
			if(cvo["cash"])
			{
				cost=cvo["cash"];
				res="chip";
			}
			else if(cvo["gem"])
			{
				cost=cvo["gem"];
				res="gem";
			}
			else if(cvo["storage"] && cvo["storage"][0])
			{
				svo=cvo["storage"][0];
				if("Oil"==svo["store"])
				{
					cost=svo["num"];
					res="oil";
				}
				else if("Gold"==svo["store"])
				{
					cost=svo["num"];
					res="gold";
				}
				else if("Cube"==svo["store"])
				{
					cost=svo["num"];
					res="cube";
				}
			}
			DBOut("&&&& "+toJSON(cvo));
			if(!page.vwHomeStage.checkCost(cvo,0))
			{
				bad=1;
			}
		}
		this.btnGo.setResNum(res,cost,bad);
		this.cvo=cvo;
		this.cost=cost;
		this.bad=bad;
	};

	__Page.pmtBox.startRandom=function(first)
	{
		if(!this.page.vwHomeStage.checkCost(this.cvo,1,this.startRandom,this,[]))
		{
			return;
		}
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var vo=this.infoVO;
		var def=vo.def;
		var appEnv=this.appEnv;
		DBOut("==== "+def.dailyTimes);
		this.infoVO.def=appEnv.setBoxTimes(this.infoVO.def["codeName"]);
		DBOut("==== "+def.dailyTimes);

		if(!first)
		{
			var free=def["FreeTimes"]-def.dailyTimes;
			var aisBld=this.aisBld;
			window.aisGame.king.execCmd(aisBld,"GetBoxReward",{boxId:def["codeName"],isFree:free>0?0:1,callBack:this.onSvrOK,callObj:this},aisBld);
		}

	//	this.curIdx=0;
		this.topTxt._setText(textLib["WaitingRadonm"]);
		this.btnClose.setDisplay(0);
		this.boxField.setDisplay(1);
		this.topTxt.setDisplay(1);
		this.itemField.setDisplay(1);
		this.btnFree.setDisplay(0);
		this.btnGo.setDisplay(0);
		this.againTxt.setDisplay(0);
		this.btnOK.setDisplay(0);

		this.showRandom();
		this.updateCost();
		this.timer=appEnv.layer.setTimeout(3000,this.checkResult,this);
		this.longTimer=appEnv.layer.setTimeout(1000*30,this.onSvrTimeout,this);
	};

	__Page.pmtBox.showRandom=function()
	{
		this.hold=1;
		this.page.audioObject.playSound("boxclick");
		var appEnv=this.appEnv;
		this.rdmTimer=null;
		var boxes=this.boxesInfo;
		if(this.curIdx==boxes.length)
			this.curIdx=0;
		var info=boxes[this.curIdx];
		this.itemObj.setTexURL(info.url);
		this.getText._setText(info.name);
		this.curIdx++;
		this.rdmTimer=appEnv.layer.setTimeout(60,this.showRandom,this);
	};

	__Page.pmtBox.onSvrOK=function(vo)
	{
		DBOut("pmtBox, onSvrOK:"+toJSON(vo));
		this.svrVO=vo;
	};

	__Page.pmtBox.onSvrTimeout=function()
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		if(this.timer)
		{
			appEnv.layer.clearTimeout(this.timer);
			this.timer=null;
		}
		if(this.rdmTimer)
		{
			appEnv.layer.clearTimeout(this.rdmTimer);
			this.rdmTimer=null;
		}
		this.svrVO=null;
		this.hold=0;

		this.btnClose.setDisplay(1);
		this.boxField.setDisplay(0);
		this.topTxt.setDisplay(0);
		this.itemField.setDisplay(0);
		this.btnFree.setDisplay(0);
		this.btnGo.setDisplay(0);
		this.againTxt.setDisplay(0);
		this.btnOK.setDisplay(1);
		this.pmtTitle.fadeIn(5,0);
		this.descTxt.fadeIn(5,0);
		this.pmtTitle._setText(textLib["ConnectTimeout"]);
		this.descTxt._setText(textLib["ConnectTimeoutDesc"]);
		this.longTimer=null;
	};

	__Page.pmtBox.checkResult=function()
	{
		this.timer=null;
		var appEnv=this.appEnv;
		if(this.svrVO)
		{
			if(this.longTimer)
			{
				appEnv.layer.clearTimeout(this.longTimer);
				this.longTimer=null;
			}
			if(this.rdmTimer)
			{
				appEnv.layer.clearTimeout(this.rdmTimer);
				this.rdmTimer=null;
			}
			this.hold=0;
			var vo=this.svrVO;
			this.btnOK.setDisplay(1);
			if(vo && vo.length)
			{
				this.openBoxOK(vo);
			}
			else
				this.openBoxErr();
		}
		else
		{
			this.timer=appEnv.layer.setTimeout(500,this.checkResult,this);
		}
	};
	//--------------------------------------------------------------------------
	//结果处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtBox.openBoxOK=function(vo)
		{
			//TODO: Call bld's command:
			var subVo=vo[0];
//			if("Elixir"==subVo.type || "Oil"==subVo.type)
//				subVo.type="ResOil";
//			else if("Gold"==subVo.type)
//				subVo.type="ResGold";
//			else if("Gem"==subVo.type)
//				subVo.type="gem";
//			else if("tok1"==subVo.type)
//				subVo.type="cash";
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;

			this.topTxt.fadeIn(5,0);
			this.topTxt._setText(textLib["OpenBoxOK"]);
			this.btnClose.setDisplay(1);
			var info=appEnv.getItemInfo(subVo);
			this.itemObj.setTexURL(info.url);
			this.getText._setText(textLib["GetItem"]+info.name+"x"+subVo.num);

			this.btnClose.setDisplay(1);
			if(this.cost)
			{
				this.btnFree.setDisplay(0);
				this.btnGo.setDisplay(1);
			}
			else
			{
				this.btnFree.setDisplay(1);
				this.btnGo.setDisplay(0);
			}
			this.againTxt.setDisplay(1);
			this.btnOK.setDisplay(0);

			var city=window.aisGame.curCity;
			DBOut("*** vo="+toJSON(vo));
			var lvo=city.svrCost2localCost(vo);
			DBOut("*** lvo="+toJSON(lvo));
			if(lvo.havePart)
			{
				this.topTxt._setText(textLib["BoxGetPart"]);
			}
			else
			{
				city.returnCost(lvo,1);
			}
			this.svrVO=null;

			var rare=this.checkRare(subVo);
			DBOut("=== rare="+rare);
			this.page.audioObject.playSound(rare?"bigreward":"com_success");
			var pic=this.page.imgLib.getImg(rare?"pic_getboxbig":"pic_getbox")
			this.ehPic.setTexUV([pic.tex_u,pic.tex_v,pic.tex_w,pic.tex_h]);

			this.shapeBox.fadeIn(1,0);
			this.ehPic.fadeIn(5,0);
			this.ehTimer=appEnv.layer.setTimeout(1000*1.5,function(){
				this.ehTimer=null;
				this.shapeBox.fadeOut(5,0);
				this.ehPic.fadeOut(5,0);
			},this);
		};

		__Page.pmtBox.openBoxErr=function()
		{
			//TODO: Call bld's command:
			this.page.audioObject.playSound("com_fail");
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;

			this.btnClose.setDisplay(1);
			this.boxField.setDisplay(0);
			this.topTxt.setDisplay(0);
			this.itemField.setDisplay(0);
			this.btnFree.setDisplay(0);
			this.btnGo.setDisplay(0);
			this.againTxt.setDisplay(0);
			this.btnOK.setDisplay(1);
			this.descTxt.fadeIn(5,0);
			this.descTxt._setText(textLib["OpenBoxErr"]);
			this.svrVO=null;
		}
	}

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtBox.onRandomClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.startRandom();
			}
		};

		__Page.pmtBox.onCloseClk=function(msg,key,way,extra)
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

		__Page.pmtBox.onOkClk=function(msg,key,way,extra)
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
	}
}
