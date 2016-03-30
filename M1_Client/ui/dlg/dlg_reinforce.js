if(!__Page.dlgCase)
{
	__Page.dlgCase=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,6);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgCase;
	__Page.dlgCase.init=function(appEnv)
	{
		this.name="dlgCase";
		this.viewId="dlgCase";
		this.page.dlgBase.prototype.init.call(this,appEnv);
		
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var cntW=this.contentW,cntH=this.contentH,cInner=this.contentInner;
		var inputX=this.inputX=cInner[0]/2;
		var inputY=this.inputY=cInner[1]/2;
		var inputW=this.inputW=cntW-inputX*2;
		var inputH=this.inputH=200;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputClk);
		this.inputCSS={type:"div3x3",id:"inputBox",pos:[inputX,inputY,0],w:inputW,h:inputH,css:imgLib.getImg("box_chat_input"),anchor_h:0,anchor_v:0,ui_event:1,
			items:[
				{type:"key",pos:[0,0,0],w:inputW,h:inputH,anchor_h:0,anchor_v:0,key:keyid,button:1,ui_event:1,state_up:{w:inputW,h:inputH},audio:this.page.audioObject.genFileURL("btn_click"),},
				{type:"text",id:"txt",pos:[7,9,0],w:inputW-14,h:inputH-18,anchor_h:0,anchor_v:0,align_h:0,align_v:0,text:textLib["NeedReinforce"],wrap:1,color_r:60,color_g:60,color_b:60,color_a:160,font_size:FS.FM}
			]
		};
		this.inputBox=this.cntBox.appendNewChild({css:this.inputCSS});
		this.inputTxt=this.inputBox.getItemById("txt");

		this.btnGap=120;
		this.btnX_ok=this.contentW/2-this.btnGap;
		this.btnY_ok=this.contentH-50;
		this.btnX_cancel=this.contentW/2+this.btnGap;
		this.btnY_cancel=this.contentH-50;
		//取消按钮:
		keyid=appEnv.appKeys.pmtCancel;
		this.btnCancel=cssLib.btnDlgCancel.create(this.cntBox,[this.btnX_ok,this.btnY_ok,0],keyid);
		this.regKeyVO(keyid,this,this.onCloseClk);
		//确认按钮:
		keyid=appEnv.appKeys.pmtOk;
		this.btnOK=cssLib.btnDlgOK.create(this.cntBox,[this.btnX_cancel,this.btnY_cancel,0],keyid);
		this.regKeyVO(keyid,this,this.onOkClk);
	};

	__Page.dlgCase.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=this.page.imgLib;
		var textLib=appEnv.textLib;

		this.dlgTitle._setText(textLib["ClanReqTroops"]);
		var cookie=page.getCookie(cookieDomain,"ReqWords");
		if(cookie)
		{
			this.txtMsg=cookie;
			this.inputTxt.setText(cookie);
			this.inputTxt.setColor(0,0,0,200);
		}
		else
		{
			this.txtMsg=textLib["NeedReinforce"];
		}

		if(preState)
		{
			appEnv.hudIn(this.cntBox);
		}
	};

	__Page.dlgCase.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(nextState)
		{
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
	};
	
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgCase.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgCase.onInputClk=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("onInputClk "+extra);
				var page=this.page;
				var textLib=this.appEnv.textLib;
				var maxStrLen=20;
				//Dialog.getText(tip, default, max, type)
				var txtTip=textLib["ClanReqTroops"], txtDefault=textLib["NeedReinforce"];
				if(-1==extra)
					txtTip=textLib["IllegalInput"];
				if(this.txtMsg)
					txtDefault=this.txtMsg;
				var txt=Dialogs.getText(txtTip,txtDefault);
				if(txt)
				{
					//检测输入是否含有非法字符
					if(this.appEnv.isNameValid4CJK(txt))
					{
						this.appEnv.layer.setFrameout(10,function(){this.onInputClk(1,0,1,-1);},this);
						return;
					}

					if(txt.length>maxStrLen)
					{
						txt=txt.substr(0,maxStrLen);
					}
					page.setCookie(cookieDomain,"ReqWords",txt,0);
					this.inputTxt.setText(txt);
					this.inputTxt.setColor(0,0,0,200);
					this.txtMsg=txt;
				}
				else
				{
					
				}
			}
		};

		__Page.dlgCase.onCloseClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("onCloseClk");
				this.appEnv.closeDlg(null,null,0);
			}
		}

		__Page.dlgCase.onOkClk=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("onOkClk");
				this.page.vwHomeStage.requsetUnit({words:this.txtMsg});
				this.appEnv.closeDlg(null,null,0);
			}
		}
	}
}
