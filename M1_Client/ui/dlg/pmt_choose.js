if(!__Page.pmtChoose)
{
	__Page.pmtChoose=new __Page.pmtBase(__Page,__Page.appEnv,3,2);
	//添加至AppEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.pmtChoose);
	__Page.pmtChoose.init=function(appEnv)
	{
		this.name="pmtChoose";
	};

	__Page.pmtChoose.enter=function(preState,vo)
	{
		this.page.pmtBase.prototype.init.call(this,this.appEnv);
		this.page.pmtBase.prototype.enter.call(this,preState,vo);
		this.infoText.setAlignH(1);
		if(vo.ui)
		{
			this["showUI_"+vo.ui]();
		}
	};

	__Page.pmtChoose.leave=function(nextState)
	{
		this.page.pmtBase.prototype.leave.call(this,nextState);
	};

	__Page.pmtChoose.showUI_inputNum=function()
	{
		DBOut("pmtChoose.showUI_inputNum");
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.infoText.setAlignH(0);
		this.resetPmtSize({w:540,h:290});
		var cntW=this.contentW, cntH=this.contentH;
		var inputX=140, inputY=40, inputW=cntW-inputX*2, inputH=40;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputClk);
		this.inputBox=this.cntBox.appendNewChild({css:cssLib.inputBox.createCSS([inputX,inputY,0],inputW,inputH,keyid,textLib["InputPhoneNum"],textLib["InputPhoneNum"],11,0,1)});
		var descX=16, descY=inputY+inputH/2+16, descW=cntW-descX*2, descH=10;
		this.cardDesc=this.cntBox.appendNewChild({type:"text",pos:[descX,descY,0],w:descW,h:descH,anchor_h:0,anchor_v:0,align_h:0,align_v:0,text:textLib["GoldCardDesc"],wrap:1,
			color_r:10,color_g:10,color_b:10,color_a:160,font_size:FS.L});
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtChoose.onCloseClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.page.pmtBase.prototype.onCloseClk.call(this,msg,key,way,extra);
				var pmtVO=this.pmtVO;
				if(pmtVO && pmtVO.pmtObj && pmtVO.pmtFunc)
				{
					pmtVO.pmtFunc.call(pmtVO.pmtObj,0,pmtVO.pmtParam);
				}
			}
		};

		__Page.pmtChoose.onOkClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.page.pmtBase.prototype.onCloseClk.call(this,msg,key,way,extra);
				var pmtVO=this.pmtVO;
				if(pmtVO && pmtVO.pmtObj && pmtVO.pmtFunc)
				{
					pmtVO.pmtFunc.call(pmtVO.pmtObj,1,pmtVO.pmtParam);
				}
			}
		};

		__Page.pmtChoose.onInputClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var num=this.inputBox.onInput();
				if(11!=num.length)
				{
					this.inputBox.setError(textLib["PhoneNumErr"]);
					return;
				}
				else
				{
					if("1"!=num[0] || ("0"==num[1] || "1"==num[1] || "2"==num[1] || "7"==num[1] || "9"==num[1]))
					{
						this.inputBox.setError(textLib["PhoneNumErr"]);
						return;
					}
					for(var i=0; i<num.length; i++)
					{
						if(!(num[i]>=0 && num[i]<=9))
						{
							this.inputBox.setError(textLib["PhoneNumErr"]);
							return;
						}
					}
					this.inputBox._setText(num);
				//	this.phoneNum=num;
					this.pmtVO.pmtObj.phoneNum=num;
				}
			}
		};	
	}
}
if(!__Page.pmtShare)
{
	__Page.pmtShare=new __Page.pmtBase(__Page,__Page.appEnv,3,2);
	//添加至AppEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.pmtShare);
	__Page.pmtShare.init=function(appEnv)
	{
		this.name="pmtShare";
	};

	__Page.pmtShare.enter=function(preState,vo)
	{
		this.page.pmtBase.prototype.init.call(this,this.appEnv);
		this.page.pmtBase.prototype.enter.call(this,preState,vo);
		this.infoText.setAlignH(1);
		this.star=0;
		if(vo.star)
			this.star=vo.star;
		if(vo.ui)
		{
			this.ui = vo.ui;
			this["showUI_"+vo.ui]();
		}
	};

	__Page.pmtShare.leave=function(nextState)
	{
		this.page.pmtBase.prototype.leave.call(this,nextState);
	};

	__Page.pmtShare.showUI_share=function()
	{
		DBOut("pmtShare.showUI_share");
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.infoText.setAlignH(0);
		this.resetPmtSize({w:540,h:290});
		var cookie=page.getCookie(cookieDomain,"ShareWords");
		if(cookie)
		{
			DBOut("cookie ="+cookie);
			this.txtMsg=cookie;
		}else
			this.txtMsg=textLib["DontWorshipMe"];
		this.txtTip=textLib["ShareVideo"];
		// var cntW=this.contentW, cntH=this.contentH;
		// var inputX=40, inputY=60, inputW=cntW-inputX*2, inputH=cntH-inputY*2-10;
		var cntW=this.contentW,cntH=this.contentH;
		var inputX=this.inputX=5;
		var inputY=this.inputY=5;
		var inputW=this.inputW=cntW-inputX*2;
		var inputH=this.inputH=200;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputTxtClk);
		this.inputCSS={type:"div3x3",id:"inputBox",pos:[inputX,inputY,0],w:inputW,h:inputH,css:imgLib.getImg("box_chat_input"),anchor_h:0,anchor_v:0,ui_event:1,
			items:[
				{type:"key",pos:[0,0,0],w:inputW,h:inputH,anchor_h:0,anchor_v:0,key:keyid,button:1,ui_event:1,state_up:{w:inputW,h:inputH},audio:this.page.audioObject.genFileURL("btn_click"),},
				{type:"text",id:"txt",pos:[7,9,0],w:inputW-14,h:inputH-18,anchor_h:0,anchor_v:0,align_h:0,align_v:0,text:this.txtMsg,wrap:1,color_r:60,color_g:60,color_b:60,color_a:160,font_size:FS.FM}
			]
		};
		this.inputBox=this.cntBox.appendNewChild(this.inputCSS);
		this.inputTxt=this.inputBox.getItemById("txt");
	};
	
	__Page.pmtShare.showUI_levelMsg=function()
	{
		DBOut("pmtShare.showUI_levelMsg");
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.infoText.setAlignH(0);
		this.resetPmtSize({w:540,h:290});
		var cookie=page.getCookie(cookieDomain,"LevelMsgWords");
		if(cookie)
		{
			this.txtMsg=cookie;
		}else
		{
			if(this.star==1)
				this.txtMsg=textLib["LevelMsg1Star"];
			else if(this.star==2)
				this.txtMsg=textLib["LevelMsg2Star"];
			else if(this.star==3)
				this.txtMsg=textLib["LevelMsg3Star"];	
		}
		this.txtTip=textLib["EnterToInputForLoser"];
		var cntW=this.contentW,cntH=this.contentH;
		var inputX=this.inputX=5;
		var inputY=this.inputY=5;
		var inputW=this.inputW=cntW-inputX*2;
		var inputH=this.inputH=200;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputTxtLevelClk);
		this.inputCSS={type:"div3x3",id:"inputBox",pos:[inputX,inputY,0],w:inputW,h:inputH,css:imgLib.getImg("box_chat_input"),anchor_h:0,anchor_v:0,ui_event:1,
			items:[
				{type:"key",pos:[0,0,0],w:inputW,h:inputH,anchor_h:0,anchor_v:0,key:keyid,button:1,ui_event:1,state_up:{w:inputW,h:inputH},audio:this.page.audioObject.genFileURL("btn_click"),},
				{type:"text",id:"txt",pos:[7,9,0],w:inputW-14,h:inputH-18,anchor_h:0,anchor_v:0,align_h:0,align_v:0,text:this.txtMsg,wrap:1,color_r:60,color_g:60,color_b:60,color_a:160,font_size:FS.FM}
			]
		};
		this.inputBox=this.cntBox.appendNewChild(this.inputCSS);
		this.inputTxt=this.inputBox.getItemById("txt");
	};	
	
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.pmtShare.onCloseClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.page.pmtBase.prototype.onCloseClk.call(this,msg,key,way,extra);
				var pmtVO=this.pmtVO;
				if(pmtVO && pmtVO.pmtObj && pmtVO.pmtFunc)
				{
					pmtVO.pmtFunc.call(pmtVO.pmtObj,0,pmtVO.pmtParam);
				}
			}
		};

		__Page.pmtShare.onOkClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.page.pmtBase.prototype.onCloseClk.call(this,msg,key,way,extra);
				var pmtVO=this.pmtVO;
				if(pmtVO && pmtVO.pmtObj && pmtVO.pmtFunc)
				{
					pmtVO.pmtFunc.call(pmtVO.pmtObj,1,pmtVO.pmtParam);
				}
			}
		};

		__Page.pmtShare.onInputTxtClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(-1==extra)
					this.txtTip=textLib["IllegalInput"];
				var txt=Dialogs.getText(this.txtTip,this.txtMsg);
//				if(this.appEnv.isNameValid4CJK(txt))
//				{
//					this.onInputTxtClk(msg,key,way,extra);
//					return;
//				}
				if(txt)
					txt=this.appEnv.isNameValid4CJK(txt,"chat");
				if(txt.length==0)
				{
					txt=textLib["DontWorshipMe"];
				}
				if(txt.length>20)
					txt=txt.substring(20);
				this.inputTxt.setText(txt);
				this.txtMsg=txt;
			}
		};	
		
		__Page.pmtShare.onInputTxtLevelClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(-1==extra)
					this.txtTip=textLib["IllegalInput"];
				var txt=Dialogs.getText(this.txtTip,this.txtMsg);
//				if(this.appEnv.isNameValid4CJK(txt))
//				{
//					this.onInputTxtLevelClk(msg,key,way,extra);
//					return;
//				}
				if(txt)
					txt=this.appEnv.isNameValid4CJK(txt,"chat");
				if(txt.length==0)
				{
					if(this.star==1)
						txt=textLib["LevelMsg1Star"];
					else if(this.star==2)
						txt=textLib["LevelMsg2Star"];
					else if(this.star==3)
						txt=textLib["LevelMsg3Star"];
				}
				if(txt.length>20)
					txt=txt.substring(20);
				this.inputTxt.setText(txt);
				this.txtMsg=txt;
			}
		};
	}
}