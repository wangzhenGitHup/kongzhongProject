if(!__Page.pmtCheck)
{
	__Page.pmtCheck={
		pmtPage:__Page,
		page:null,
		name:"pmtCheck"
	};
	//添加至AppEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.pmtCheck);
	__Page.pmtCheck.init=function(appEnv)
	{
		this.appEnv=appEnv;
		this.page=appEnv.page;
		this.pmtBox=appEnv.pmtBox;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		page.keyStateUtil.call(this);

		var keyid=0,boxW,boxH;
		this.boxW=boxW=700;//500;
		this.boxH=boxH=560;//360;

		var scrW=appEnv.scrSize[0], scrH=appEnv.scrSize[1];
		this.minX=0, this.maxX=scrW-boxW, this.minY=0, this.maxY=scrH-boxH;

		this.pmtCSS={type:"div3x3",w:boxW,h:boxH,css:imgLib.getImg("box_dlgbox"),ui_event:1};
		var titleX=boxW>>1, titleY=40, titleW=boxW, titleH=68;
		this.titleCSS=cssLib.textFineBig.createCSS([titleX,titleY,0],textLib["OLCkeck"],titleW,titleH,1,1,1,1);
		var cntX=10, cntY=70, cntW=boxW-cntX*2, cntH=boxH-cntY-10;
		this.cntCSS={type:"div3x3",pos:[cntX,cntY,0],w:cntW,h:cntH,css:imgLib.getImg("box_solid"),ui_event:1};
/**
		var btnGap=110;
		var btnX_ok=cntW/2-btnGap;
		var btnY_ok=cntH-50;
		var btnX_cancel=cntW/2+btnGap;
		var btnY_cancel=cntH-50;
		//取消按钮:
		keyid=appEnv.appKeys.pmtCancel;
		this.cancelCSS={css:cssLib.btnDlgCancel.createCSS([btnX_ok,btnY_ok,0],keyid),id:"BtnPmt_Cancel"};
		this.regKeyVO(keyid,this,this.onCloseClk);
		//确认按钮:
		keyid=appEnv.appKeys.pmtOk;
		this.okCSS={css:cssLib.btnDlgOK.createCSS([btnX_cancel,btnY_cancel,0],keyid),id:"BtnPmt_OK"};
		this.regKeyVO(keyid,this,this.onOkClk);
/**/
		var descX=cntW/2, descY=48, descW=cntW-40, descH=56;
		this.descCSS={type:"text",id:"desc",pos:[descX,descY,0],w:descW,h:descH,anchor_h:1,anchor_v:1,align_h:0,align_v:1,font_size:FS.XL,wrap:1,text:textLib["OLCkeckDesc"],
			color_r:10,color_g:10,color_b:10,color_a:255
		};
		var midX=0, midY=descY+descH/2+14, midW=cntW, midH=68;
		this.midBoxCSS={type:"icon",id:"mid-box",pos:[midX,midY,0],w:midW,h:midH,ui_event:1};
		var checkW=256, checkH=midH, checkX=(midW-checkW)/2, checkY=0;
		this.checkCSS={type:"icon",id:"check-box",pos:[checkX,checkY,0],w:checkW,h:checkH,css:imgLib.getImg("pic_captcha_bg5"),fade:1,fade_alpha:0,fade_size:1,
			face_r:10,face_g:10,face_b:10,face_a:200};
		this.numCSS=[];
		var i, numW=checkW/4, numH=checkH, numX, numY=checkH/2;
		for(i=0; i<4; i++)
		{
			numX=numW/2+numW*i;
			this.numCSS.push({type:"text",id:"check-num"+i,font_size:FS.XXXL+10,
			//	pos:[numX,numY,0],w:numW,h:numH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,
			//	color_r:10,color_g:10,color_b:10,color_a:255
				css:cssLib.textFineBig.createCSS([numX,numY,0],"",numW,numH,1,1,1,1,[255,255,255,255]),
				fade:1,fade_alpha:0,fade_size:1,fade_pos:[numX,numY,0]
			});
		}

		var btnW=102, btnH=50;
		var uv3x3=[25/1024,20/1024,22/1024,24/1024], size3x3=[12,10,12,10];
		var btnCSS=this.btnCSS=cssLib.normalBtn.createCSS([0,0,0],keyid,0,"",btnW,btnH,FS.XL);
		btnCSS.state_up.uv3x3=btnCSS.state_down.uv3x3=btnCSS.state_gray.uv3x3=uv3x3;
		btnCSS.state_up.size3x3=btnCSS.state_down.size3x3=btnCSS.state_gray.size3x3=size3x3;

		var reW=btnW, reH=btnH, reX=checkX+checkW+16+reW/2, reY=checkY+checkH/2;
		this.reCSS={css:btnCSS,pos:[reX,reY,0]};

		this.times=5;
		var errX=midW/2, errY=midY+midH+20, errW=midW, errH=midH;
		this.errCSS={id:"err",css:cssLib.textFineMid.createCSS([errX,errY,0],textLib.getTextEx("OLCkeckErr",{num:this.times}),errW,errH,1,1,1,1,[255,0,0,255],1),flash:2,display:0};

		var subX=12, subY=midY+midH+36, subW=cntW-subX*2, subH=cntH-subY-14;
		this.subCSS={type:"div3x3",id:"sub-box",pos:[subX,subY,0],w:subW,h:subH,css:imgLib.getImg("box_dlgcontent"),ui_event:1};

		this.curCheck=0;
		this.inputCSS=[];
		var dtX=20, dtY=16, bx=subW/2, by=12;
		var ipW=btnW, ipH=btnH;
		var x1=bx, x0=x1-ipW-dtX, x2=bx+ipW+dtX;
		var y0=by+ipH/2, y1=y0+ipH+dtY, y2=y1+ipH+dtY;
		var inputX=[x0, x1, x2], inputY=[y0, y1, y2];
		var ix, iy;
		for(i=0; i<9; i++)
		{
			ix=inputX[i%3];
			iy=inputY[Math.floor(i/3)];
			this.inputCSS.push({id:"key"+i,css:btnCSS,pos:[ix,iy,0]});
		}

		var cdW=subW, cdH=38, cdX=subW/2, cdY=subH-cdH/2-16;//countdown
		this.cdCSS={type:"text",id:"countdown",pos:[cdX,cdY,0],w:cdW,h:cdH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,font_size:FS.XXXL,text:"60",
			color_r:255,color_g:0,color_b:0,color_a:255,
		};
		this.cdCSS={type:"txt_score",id:"countdown",pos:[cdX,cdY,0],w:cdW,h:cdH,align_h:1,align_v:1,anchor_h:1,anchor_v:1,font_size:FS.XXXL,owner:this,
			edge:1,egde_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:241,color_b:211,
			timer:6,time_pause:0,time_val:0,count_down:1,msec:0,symb_d:textLib["Day"],symb_dm:textLib["Day"],symb_h:textLib["Hour"],symb_m:textLib["Minute"],symb_s:textLib["Second"]
		};
		//防止有旧文件问题进行空更新。
	};

	__Page.pmtCheck.enter=function(preState,vo)
	{
		var def,level,url;
		var appEnv=this.appEnv;
		var page=this.page;
		var txtw,txth,boxW,boxH;
		DBOut("pmtCheck.enter: "+appEnv);

		this.pmtVO=vo;
		if(vo)
		{
		}
		this.checkCode={};
		this.inputCode={};
		this.timeLen=59*1000;

		this.times=5;
		this.curCheck=0;
		this.checkNum=[];

		this.checkTxts=[];
		this.numBtns=[];

		this.showUI();
	//	appEnv.hudIn(this.pmtFrame,10);
	};

	__Page.pmtCheck.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		appEnv.hudOut(this.pmtFrame,20);
		if(this.leaveInfoBox)
		{
			this.leaveInfoBox(nextState);
		}
		this.pmtFrame.getFather().removeChild(this.pmtFrame);
	};

	__Page.pmtCheck.showUI=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.pmtFrame=this.pmtBox.appendNewChild({css:this.pmtCSS,pos:this.getRandomPos()});
		this.pmtTitle=this.pmtFrame.appendNewChild({css:this.titleCSS});
		this.cntBox=this.pmtFrame.appendNewChild({css:this.cntCSS});
/**
		this.btnCancel=this.cntBox.appendNewChild({css:this.cancelCSS});
		this.btnCancel.firstChild()._setText(textLib["HaveRest"]);
		this.btnOk=this.cntBox.appendNewChild({css:this.okCSS});
		this.btnOk.firstChild()._setText(textLib["GoOnPlay"]);
/**/
		this.descTxt=this.cntBox.appendNewChild({css:this.descCSS});
		this.midBox=this.cntBox.appendNewChild({css:this.midBoxCSS});
		this.checkBox=this.midBox.appendNewChild({css:this.checkCSS});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onRefreshClk);
		this.btnRe=this.midBox.appendNewChild({css:this.reCSS,key:keyid});
		var i=0, btn;
		for(i=0; i<this.numCSS.length; i++)
		{
			btn=this.checkBox.appendNewChild({css:this.numCSS[i]});
			btn.setText(0);
			this.checkTxts.push(btn);
		}
		this.btnRe.setText(textLib["Refresh"]);
		this.errTxt=this.cntBox.appendNewChild({css:this.errCSS});
		this.errTxt.setFlash(2,0.5);
		this.subBox=this.cntBox.appendNewChild({css:this.subCSS});
		for(i=0; i<this.inputCSS.length; i++)
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onKeyboardClk);
			btn=this.subBox.appendNewChild({css:this.inputCSS[i],key:keyid});
			btn.setText(i+1);
			btn.num=i+1;
			this.inputCode[""+keyid]={btn:btn, key:keyid, num:btn.num};
			this.numBtns.push(btn);
		}
		this.cdTxt=this.subBox.appendNewChild({css:this.cdCSS});
		this.cdTxt.setTime(this.timeLen);
		this.cdTxt.onTimer=function()
		{
			setTimeout(0,function(){
				this.owner.kickUser(1);
			},this);
		};

		this.resetCheckNum();
	};

	__Page.pmtCheck.resetCheckNum=function()
	{
		this.checkNum=[];
		this.curCheck=0;
		var i, rdm, css;
		rdm=Math.floor(Math.random()*5+1);
		css=this.page.imgLib.getImg("pic_captcha_bg"+rdm);
		this.checkBox.setTexUV([css.tex_u,css.tex_v,css.tex_w,css.tex_h]);
		this.checkBox.fadeIn(5,0);
		for(i=0; i<4; i++)
		{
			rdm=Math.floor(Math.random()*9+1);
			this.checkTxts[i].setText(rdm+"");
			this.checkNum.push(rdm);
			this.checkTxts[i].fadeIn(5,0);
			this.checkTxts[i].setColor(255,255,255,255);
		}
	};

	__Page.pmtCheck.resetKeyboard=function()
	{
		
	};

	__Page.pmtCheck.getRandomPos=function()
	{
		var x=Math.floor(Math.random()*this.maxX);
		var y=Math.floor(Math.random()*this.maxY);
		x=this.maxX/2, y=this.maxY/2;
		return [x,y,0];
	};

	__Page.pmtCheck.kickUser=function(to)
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		if(window.aisNTEngine)
		{
			window.aisNTEngine.onFree(1);
		}
		var txt=to?textLib["WillBeKick1"]:textLib["WillBeKick"];
		Dialogs.alert(txt);
		var ptVo=appEnv.getPlayTime();
		ptVo.status=-1;
		appEnv.setPlayTime(ptVo);
		appEnv.closePmtDlg();
		exitApp();
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtCheck.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way && msg)
				DBOut("pmtCheck.onKey: "+key+", "+msg+", "+extra);
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
		};
		
		__Page.pmtCheck.onCloseClk=function(msg,key,way,extra)
		{
			var state;
			if(msg==1 && way==1 && extra==1)
			{
				state=this;
				DBOut("pmtCheck.onCloseClk");
				state.appEnv.closePmtDlg();
				if(state.pmtVO && state.pmtVO.pmtObj && state.pmtVO.pmtFunc)
				{
					state.pmtVO.pmtFunc.call(state.pmtVO.pmtObj,0);
				}
			}
		};
		
		__Page.pmtCheck.onOkClk=function(msg,key,way,extra)
		{
			var state;
			if(msg==1 && way==1 && extra==1)
			{
				state=this;
				DBOut("pmtCheck.onOkClk");
				state.appEnv.closePmtDlg();
				if(state.pmtVO && state.pmtVO.pmtObj && state.pmtVO.pmtFunc)
				{
					state.pmtVO.pmtFunc.call(state.pmtVO.pmtObj,1);
				}
			}
		};
		
		__Page.pmtCheck.onRefreshClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				DBOut("onRefreshClk");
				this.appEnv.hudOut(this.errTxt,0);
				this.resetCheckNum();
			}
		};
		
		__Page.pmtCheck.onKeyboardClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1 && extra==1)
			{
				DBOut("onKeyboardClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var inputVO=this.inputCode;
				var vo=this.inputCode[""+key];
				DBOut("input "+vo.num);
				var cur=this.checkNum[this.curCheck];
				DBOut("cur "+cur);
				appEnv.hudOut(this.errTxt,0);
				if(vo.num==cur)
				{
					this.checkTxts[this.curCheck].setColor(96,182,0,255);
					this.curCheck++;
					if(4==this.curCheck)
					{
						DBOut("验证通过");
						appEnv.resetPlayTime();
						appEnv.closePmtDlg();
						if(this.pmtVO.fun && this.pmtVO.obj)
						{
							this.pmtVO.fun.call(this.pmtVO.obj);
						}
						else
						{
							appEnv.checkPlayTime();
						}
					}
				}
				else
				{
					this.times--;
					if(0==this.times)
					{
						DBOut("5次验证失败，下线");
						this.kickUser();
						return;
					}
				//	this.checkBox.fadeOut(5,0);
					this.resetCheckNum();
					this.errTxt.fadeIn(5,0);
					this.errTxt.setText(textLib.getTextEx("OLCkeckErr",{num:this.times}));
				}
			}
		};
	}
}
