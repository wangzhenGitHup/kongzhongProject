if(!__Page.dlgBoxOpen)
{
	__Page.dlgBoxOpen=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	__Page.dlgBoxOpen.loadConfig=function()
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
			items:[{css:cssLib.textFineMid.createCSS([0,0,0],textLib["BeginOpenBox"],btmBoxW,btmBoxH,1,1,1,1)}]
		};
		//抽奖区域
		var pic=imgLib.getImg("pic_box_bg"), rdmW=pic.w, rdmH=pic.h, rdmX=(cntW-rdmW)/2, rdmY=(btmBoxY-btmBoxH/2-rdmH)/2;//rdmW=800, rdmH=426, 
		this.rdmBoxCSS={id:"rdmBox",type:"icon",pos:[rdmX,rdmY,0],w:rdmW,h:rdmH,ui_event:1,css:pic};
		//获奖区域
		var itemSize=94, iconSize=80;
		var getW=550, getH=180, getX=(rdmW-getW)/2, getY=(rdmH-getH)/2+7;
		var itemW=94, itemH=94, itemX=70+itemW/2, itemY=32+itemH/2, txtX=itemX, txtY=itemY+itemH/2+6, txtW=itemW, txtH=20;
		var rTxtW=238, rTxtH=76, rTxtX=384, rTxtY=20, btnX=rTxtX, btnY=130;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onRandomClk);
		this.getBoxCSS={id:"getBox",type:"div3x3",pos:[getX,getY,0],w:getW,h:getH,ui_event:1,css:imgLib.getImg("box_solid"),color_a:0,
			items:[
				{id:"ItemBg",type:"icon",pos:[itemX,itemY,0],anchor_h:1,anchor_v:1,w:itemW,h:itemH,css:imgLib.getImg("pic_box_normal")},
				{id:"ItemPic",type:"icon",pos:[itemX,itemY,0],anchor_h:1,anchor_v:1,w:iconSize,h:iconSize,tex:"",tex_u:0,tex_v:0,tex_w:1,tex_h:1},
				{id:"GetText",css:cssLib.textFineMid.createCSS([txtX,txtY,0],textLib["GetItem"]+"???",txtW,txtH,1,0,1,0),font_size:FS.L},
				{id:"InfoText",css:cssLib.textFineMid.createCSS([rTxtX,rTxtY,0],textLib["BeginOpenBox"],rTxtW,rTxtH,1,0,1,1),wrap:1},
				{id:"BtnFree",css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["ForFree"]),display:0},
				{id:"BtnGo",css:cssLib.btnResGo.createCSS([btnX,btnY,0],160,"gem",0,0,keyid),display:0}
			]
		};
		//箱子坐标
		var lineNum=7;
		var bx=20, by=20, dt=Math.round((rdmW-bx*2-itemSize*lineNum)/6);
		var i, x=[], y=[];//x1, x2, x3, x4, x5, x6, x7, y1, y2, y3, 
		for(i=0; i<lineNum; i++)
		{
			x[i]=bx+itemSize/2+itemSize*i+dt*i;
			y[i]=by+itemSize/2;
		}
	//	DBOut(i);
		x[i]=x[6];
		y[i]=rdmH/2;
		i++;
		var cur=i, next;
		for(; i<cur+lineNum; i++)
		{
			next=cur-2-(i-cur);
		//	DBOut("== "+i+" vs "+next);
			x[i]=x[next];
			y[i]=rdmH-by-itemSize/2;
		}
	//	DBOut(i);
		x[i]=x[0];
		y[i]=rdmH/2;
		this.posX=x;
		this.posY=y;
		//单个图标
		var self=this, txtW=itemSize, txtH=itemSize, txtX=0, txtY=0;
		this.itemCSS={
			createCSS:function(idx)
			{
				var px=x[idx], py=y[idx];
			//	DBOut(idx+" "+px+" "+py);
				var css={type:"icon",pos:[px,py,0],anchor_h:1,anchor_v:1,w:itemSize,h:itemSize,css:imgLib.getImg("pic_box_normal"),ui_event:1,
					items:[
						{id:"Sel",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_box_sel"),display:0},
						{id:"Icon",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,w:iconSize,h:iconSize,tex:imgLib.genIconPath("oil",256),tex_u:0,tex_v:0,tex_w:1,tex_h:1,filter:1},
						{id:"Name",type:"text",css:cssLib.textFineMid.createCSS([0,0,0],"???",txtW,txtH,1,1,0,0),font_size:FS.M},
						{id:"Num",type:"text",css:cssLib.textFineMid.createCSS([0,0,0],"???",txtW,txtH,1,1,2,2),font_size:FS.M},
					],
					dlg:self,appEnv:appEnv,update:this.update,
				};
				return css;
			},
			update:function(vo,idx)
			{
			//	DBOut("=== update:"+toJSON(vo));
				var itemIcon=this.getItemById("Icon");
				var nameTxt=this.getItemById("Name");
				var numTxt=this.getItemById("Num");

				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var page=appEnv.page;
				var imgLib=page.imgLib;

				var picNormal=imgLib.getImg("pic_box_normal");
				var picRare=imgLib.getImg("pic_box_rare");
				var curPic=picNormal;
				this.idx=idx;
				if(vo)
				{
					var resURL, name, q="";
					var info=appEnv.getItemInfo(vo);
					resURL=info.url;
					name=info.name;
					if(info.q>0)
						q="("+appEnv.getAddOnLv(info.q)+")";
					itemIcon.setTexURL(resURL);
					nameTxt._setText(name+q);
					numTxt._setText("x"+vo.num);
					if(vo["rare"])
					{
						curPic=picRare;
					}
					else
					{
						curPic=picNormal;
					}
					this.setW(curPic.w);
					this.setH(curPic.h);
					this.setTexUV([curPic.tex_u,curPic.tex_v,curPic.tex_w,curPic.tex_h]);
				}
				else
				{
					
				}
			}
		};
		//特效区域
		pic=imgLib.getImg("pic_getbox");
		var scrSize=appEnv.scrSize, w=scrSize[0], h=scrSize[1], picPos=[w/2,h/2-getH/2-pic.h/2,0];
		this.shapeBoxCSS={type:"shape",id:"dlgMask",pos:[0,0,0],w:w,h:h,border_a:0,face_r:0,face_g:0,face_b:0,face_a:128,
			display:0,fade_pos:[0,0,0],fade_size:1,fade:1,fade_alpha:0,fade:1,fade_size:1,fade_alpha:0,fade_pos:[0,0,0],ui_event:1,items:[
			{type:"icon",id:"blocker",pos:[0,0,0],w:w,h:h,block_touch:1,ui_event:1},
			{type:"icon",id:"pic",pos:picPos,anchor_h:1,anchor_v:1,css:pic,fade:1,fade_size:0,fade_alpha:0,fade_pos:picPos,display:0}
		]};
	};
	__Page.dlgBoxOpen.init=function(appEnv)
	{
		this.name="dlgBoxOpen";
		this.viewId="dlgBoxOpen";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg=this.dlgPage.dlgBox;
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);

		var keyid, i, hud;
		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({css:[this.contentFieldCSS],display:0});

		this.btmBox=this.cntBox.appendNewChild({css:this.btmBoxCSS});
		this.rdmBox=this.cntBox.appendNewChild({css:this.rdmBoxCSS});
		this.getBox=this.rdmBox.appendNewChild({css:this.getBoxCSS});
		this.getBg=this.getBox.getItemById("ItemBg");
		this.getPic=this.getBox.getItemById("ItemPic");
		this.getTxt=this.getBox.getItemById("GetText");
		this.infoTxt=this.getBox.getItemById("InfoText");
		this.btnFree=this.getBox.getItemById("BtnFree");
		this.btnGo=this.getBox.getItemById("BtnGo");
		this.btnGo.setStateStyle(0,{h:68});this.btnGo.setStateStyle(1,{h:68});this.btnGo.setStateStyle(2,{h:68});

		this.shapeBox=this.dlgBox.appendNewChild({css:this.shapeBoxCSS});
		this.ehPic=this.shapeBox.getItemById("pic");
		this.ehPic.onFadeDone=function(fade)
		{
			if(fade)
			{
				appEnv.addZoomScale(this,[1.0,1.0,1.0],[1.2,1.2,1.0],0.3);
			}
		};

		this.boxCnt=16;
		this.boxList=[];
		this.boxSeq={};
		for(i=0; i<this.boxCnt; i++)
		{
			hud=this.rdmBox.appendNewChild({css:this.itemCSS.createCSS(i)});
			this.boxList.push(hud);
		}

		this.selFrame=this.rdmBox.appendNewChild({id:"sel",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_box_sel"),display:0});//,w:110,h:110
	};
	__Page.dlgBoxOpen.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var homeDlg=this.homeDlg;
		var keyid;

		homeDlg.dlgTitle._setText(vo["name"]);
		this.infoVO=vo;
		this.aisBld=homeDlg.aisBld;
		var i, j, k, lvo, boxes=[], haveVO={}, list=vo.boxs;
		if(this.boxCnt!=list.length)
		{
			Dialogs.alert("box length error: "+list.length);
			return;
		}
		list=toJSON(list);
		list=fromJSON(list)
		for(i=0; i<list.length; i++)
		{
			list[i].idx=i;
		}
		k=0;
		for(i=0; i<list.length; i++)
		{
			j=Math.floor(Math.random()*list.length);
			lvo=list[j];
			this.boxList[k].update(lvo);
			this.boxSeq[lvo.idx+"a"]=k;
			k++;
			list.splice(j,1);
			i--;

			if(haveVO[lvo["type"]])
				continue;
			haveVO[lvo["type"]]=1;
			boxes.push(appEnv.getItemInfo(lvo));
		}
	//	DBOut("boxSeq="+toJSON(this.boxSeq));
		this.boxesInfo=boxes;
		this.curIdx=0;
		this.selFrame.setDisplay(0);

		this.updateCost();
		var free=vo["FreeTimes"]-vo.dailyTimes;
		if(free>0)
		{
			this.btnFree.setDisplay(1);
			this.btnGo.setDisplay(0);
		}
		else
		{
			this.btnFree.setDisplay(0);
			this.btnGo.setDisplay(1);
		}

		this.infoTxt._setText(textLib["BeginOpenBox"]);
		this.getTxt._setText("");
		this.getPic.setTexURL("");
		var pic=imgLib.getImg("pic_box_normal");
		this.getBg.setTexUV([pic.tex_u,pic.tex_v,pic.tex_w,pic.tex_h]);
		this.getBg.setW(pic.w);
		this.getBg.setH(pic.h);

		appEnv.hudIn(homeDlg.btnBack,10);
		appEnv.hudIn(this.cntBox,10);
	};
	__Page.dlgBoxOpen.leave=function(nextState)
	{
		var appEnv=this.appEnv;
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
		if(this.curSelHud)
			this.curSelHud.setFlash(0,0);

		var homeDlg=this.homeDlg;
		appEnv.hudOut(homeDlg.btnBack,5);
		appEnv.hudOut(this.cntBox,5);
	};

	__Page.dlgBoxOpen.checkRare=function(vo)
	{
	//	vo.type="ResGold";vo.num=2000000;
		var def=this.infoVO;
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
			box.idx=i;
		//	DBOut("*** "+toJSON(box));
		//	DBOut("type: "+vo.type+" vs "+box["type"]+", num: "+vo.num+" vs "+box["num"]);
			if(vo.type==box["type"] && vo.num==box["num"])
				return box;
		}
		return 0;
	};


	__Page.dlgBoxOpen.updateCost=function()
	{
		var page=this.page;
		var def=this.infoVO;
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
		//	DBOut("updateCost, cvo:"+toJSON(cvo));
			if(!page.vwHomeStage.checkCost(cvo,0))
			{
				bad=1;
			}
		}
		this.btnGo.setResNum(res,cost,bad);
		this.cvo=cvo;
		this.cost=cost;
		this.bad=bad;
	//	DBOut("cvo:"+toJSON(cvo)+", cost:"+cost);
	};

	__Page.dlgBoxOpen.startRandom=function(first)
	{
		if(!this.page.vwHomeStage.checkCost(this.cvo,1,this.startRandom,this,[]))
		{
			return;
		}
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;
		var imgLib=page.imgLib;

		if(this.curSelHud)
			this.curSelHud.setFlash(0,0);
		this.curSelHud=null;
		this.svrVO=null;
		this.rand=0;
		this.slow=0;
		this.homeDlg.btnClose.setEnabled(0);
		this.homeDlg.btnBack.setEnabled(0);
		this.btnFree.setDisplay(0);
		this.btnGo.setDisplay(0);

		this.infoTxt.setFlash(2,0);
		this.infoTxt._setText(textLib["WaitingRadonm"]);
		this.getTxt._setText("");
		this.getPic.setTexURL("");
		var pic=imgLib.getImg("pic_box_normal");
		this.getBg.setTexUV([pic.tex_u,pic.tex_v,pic.tex_w,pic.tex_h]);
		this.getBg.setW(pic.w);
		this.getBg.setH(pic.h);

		var vo=this.infoVO;
		var def=vo;
		var appEnv=this.appEnv;
		DBOut("==== before:"+def.dailyTimes);

		if(!first)
		{
			var free=def["FreeTimes"]-def.dailyTimes;
			var aisBld=this.aisBld;
			this.timeStr=window.aisEnv.dateTime()+"";
			DBOut("free="+free);
			window.aisGame.king.execCmd(aisBld,"GetBoxReward",{boxId:def["codeName"],isFree:free>0?0:1,messageSign:this.timeStr,callBack:this.onSvrOK,callObj:this},aisBld);
		}

	//	this.curIdx=0;

		this.timer=appEnv.layer.setTimeout(3000,this.checkResult,this);
		this.longTimer=appEnv.layer.setTimeout(1000*30,this.onSvrTimeout,this);
		this.showRandom();
	};

	__Page.dlgBoxOpen.showRandom=function()
	{
		this.hold=1;
		this.page.audioObject.playSound("boxclick");
		var appEnv=this.appEnv;
		this.rdmTimer=null;
		var boxes=this.boxesInfo;
	//	if(this.curIdx==boxes.length)
		if(this.curIdx==this.boxCnt)
			this.curIdx=0;
		var info=boxes[this.curIdx];
	//	this.itemObj.setTexURL(info.url);
	//	this.getText._setText(info.name);

		this.selFrame.setDisplay(1);
		var pos=[];
		var hud=this.boxList[this.curIdx];
		hud.getPos(pos);
		this.selFrame.setPos(pos);

		var t=60;
		if(null==this.timer && this.svrVO)
		{
			var vo=this.svrVO;
			if(vo && vo.length)
			{
				var idx=vo.idx;
				idx=this.boxSeq[idx+"a"];
			//	DBOut("idx="+idx);
				var dis=idx-this.curIdx;
				if(!this.rand)
				{
					this.rand=Math.floor(Math.random()*5)+6;
				}
			//	DBOut("***** cur:"+this.curIdx+" vs aim:"+idx+", rand="+this.rand);
			//	DBOut("dis="+dis);
				if(dis<0)
				{
					dis=this.boxCnt-this.curIdx+idx;
				}
			//	DBOut("dis="+dis);
				if(!this.slow && dis<this.rand)
				{
					dis=dis+this.boxCnt;
				}
				if(dis==this.rand)
				{
					this.slow=1;
				}
			//	DBOut("dis="+dis+", slow="+this.slow);
				if(this.slow)
				{
					t=t+30*this.slow;
					this.slow++;
				}
			//	DBOut("t="+t);
				if(this.slow && idx==this.curIdx)
				{
					this.openBoxOK(vo,hud);
					return;
				}
			}
			else
			{
				this.openBoxErr();
				return;
			}
		}

		this.curIdx++;
		this.rdmTimer=appEnv.layer.setTimeout(t,this.showRandom,this);
	};

	__Page.dlgBoxOpen.onSvrOK=function(vo)
	{
		var appEnv=this.appEnv;
		if(this.longTimer)
		{
			appEnv.layer.clearTimeout(this.longTimer);
			this.longTimer=null;
		}
		DBOut("dlgBoxOpen, onSvrOK:"+toJSON(vo));
	//	vo=[{"catalog": "", "extend": "", "extend2": "", "num": 2000000, "type": "ResGold"}];
		this.svrVO=vo;
		var subVo=vo[0];
		if(subVo)
		{
			if(subVo.extend==this.timeStr)
			{
				var idx=this.checkRare(subVo).idx;
				this.svrVO.idx=idx;

				var def=this.infoVO;
				var free=this.cost?0:1;
				var aisBld=this.aisBld;
				DBOut("get free="+free+", "+def["codeName"]+" -> "+subVo.type+" x "+subVo.num);
				window.aisGame.king.execCmd(aisBld,"CommitBoxReward",{boxId:def["codeName"],isFree:free>0?0:1,messageSign:this.timeStr,resType:subVo.type,resNum:subVo.num},aisBld);
				this.timeStr="";
			}
			else
			{
				this.svrVO=null;
			}
		}
	};

	__Page.dlgBoxOpen.onSvrTimeout=function()
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

		this.longTimer=null;

		this.selFrame.setDisplay(0);
		this.curIdx=0;
		appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["OpenBoxTimeout"],info:textLib["OpenBoxTimeoutDesc"],pmtFunc:function(){},pmtObj:this});
		this.infoTxt.setFlash(0,0);
		this.infoTxt.fadeIn(5,0);
		this.infoTxt._setText(textLib["BeginOpenBox"]);//ConnectTimeoutDesc
		this.homeDlg.btnClose.setEnabled(1);
		this.homeDlg.btnBack.setEnabled(1);

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
	};

	__Page.dlgBoxOpen.checkResult=function()
	{
		this.timer=null;
	};
	//--------------------------------------------------------------------------
	//结果处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgBoxOpen.openBoxOK=function(vo,hud)
		{
			var appEnv=this.appEnv;

			this.curSelHud=hud;
			hud.setFlash(2,0.3);

			this.infoVO=appEnv.setBoxTimes(this.infoVO["codeName"]);
			DBOut("==== after:"+this.infoVO.dailyTimes);
			this.updateCost();

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

			var subVo=vo[0];
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;
			var page=this.page;
			var imgLib=page.imgLib;

			this.infoTxt.setFlash(0,0);
			this.infoTxt.fadeIn(5,0);
			this.infoTxt._setText(textLib["OpenBoxOK"]);
			this.homeDlg.btnClose.setEnabled(1);
			this.homeDlg.btnBack.setEnabled(1);
			var info=appEnv.getItemInfo(subVo);
			this.getPic.setTexURL(info.url);
			this.getTxt._setText(textLib["GetItem"]+info.name+"x"+subVo.num);
		//	DBOut("checkRare: "+toJSON(this.checkRare(subVo)));
			var rare=this.checkRare(subVo)["rare"];
			var pic=imgLib.getImg(rare?"pic_box_rare":"pic_box_normal");
			this.getBg.setTexUV([pic.tex_u,pic.tex_v,pic.tex_w,pic.tex_h]);
			this.getBg.setW(pic.w);
			this.getBg.setH(pic.h);
			appEnv.addZoomScale(this.getBg,[1,1,1],[1.3,1.3,1],0.3);
			appEnv.addZoomScale(this.getPic,[1,1,1],[1.3,1.3,1],0.3);

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
		//	this.againTxt.setDisplay(1);

			var city=window.aisGame.curCity;
		//	DBOut("*** vo="+toJSON(vo));
			var lvo=city.svrCost2localCost(vo);
		//	DBOut("*** lvo="+toJSON(lvo));
			if(lvo.havePart)
			{
				this.infoTxt._setText(textLib["BoxGetPart"]);
			}
			else
			{
				city.returnCost(lvo,1);
			}
			this.svrVO=null;

			DBOut("=== rare="+rare);
			this.page.audioObject.playSound(rare?"bigreward":"com_success");
			var pic=imgLib.getImg(rare?"pic_getboxbig":"pic_getbox")
			this.ehPic.setTexUV([pic.tex_u,pic.tex_v,pic.tex_w,pic.tex_h]);

			var tb=0.5, te=tb+1.5;
			this.ehTimer=appEnv.layer.setTimeout(1000*tb,function(){
				this.shapeBox.fadeIn(1,0);
				this.ehPic.fadeIn(5,0);
			},this);
			this.ehTimer=appEnv.layer.setTimeout(1000*te,function(){
				this.ehTimer=null;
				this.shapeBox.fadeOut(5,0);
				this.ehPic.fadeOut(5,0);
			},this);
		};

		__Page.dlgBoxOpen.openBoxErr=function()
		{
			var appEnv=this.appEnv;
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

			this.page.audioObject.playSound("com_fail");
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;

			this.selFrame.setDisplay(0);
			this.curIdx=0;
			appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["OpenBoxErr"],info:textLib["OpenBoxErrDesc"],pmtFunc:function(){},pmtObj:this});
			this.infoTxt.setFlash(0,0);
			this.infoTxt.fadeIn(5,0);
			this.infoTxt._setText(textLib["BeginOpenBox"]);
			this.homeDlg.btnClose.setEnabled(1);
			this.homeDlg.btnBack.setEnabled(1);
			this.btnFree.setDisplay(0);
			this.btnGo.setDisplay(0);
			this.svrVO=null;

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
		};
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgBoxOpen.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgBoxOpen.onCloseClk=function(msg,key,way,extra)
		{
			return this.homeDlg.onCloseClk(msg,key,way,extra);
		};

		__Page.dlgBoxOpen.onRandomClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.startRandom();
			}
		};
	}
}
