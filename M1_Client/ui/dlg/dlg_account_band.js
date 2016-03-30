if(!__Page.dlgAccountBand)
{
	__Page.dlgAccountBand=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,4);
	//指定这个对话框是属于当前Page的启动对话框
	//__Page.pageDialog=__Page.dlgAccountBand;
	__Page.dlgAccountBand.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid;

		var cntW=this.contentW,cntH=this.contentH,cInner=this.contentInner;
		var pic=imgLib.getImg("btn_green_u");

		var inputW=350,inputH=40,inputX=cInner[0];//(cntW-inputW)/2;
		var emailY=cInner[1]/2+5+inputH/2,pwdY=emailY+inputH+10;
		this.inputEmailTipCSS={type:"text",pos:[inputX,emailY,0],w:inputW,h:inputH,text:textLib["InputEmail"]+"：",anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:FS.M,color_r:10,color_g:10,color_b:10,color_a:230}
		emailY=emailY+inputH+10;
		this.inputEmailCSS={pos:[inputX,emailY,0],w:inputW,h:inputH,text:"",tip:textLib["InputEmail"]};
		pwdY=emailY+inputH+10;
		this.inputPwdlTipCSS1={type:"text",pos:[inputX,pwdY,0],w:inputW,h:inputH,text:textLib["InputPwdTip"],anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:FS.M,color_r:10,color_g:10,color_b:10,color_a:230}
		pwdY=pwdY+inputH+10;
		this.inputPwdCSS1={pos:[inputX,pwdY,0],w:inputW,h:inputH,text:"",tip:textLib["InputPwd"]};
		pwdY=pwdY+inputH+10;
		this.inputPwdlTipCSS2={type:"text",pos:[inputX,pwdY,0],w:inputW,h:inputH,text:textLib["RepeatPwd"]+"：",anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:FS.M,color_r:10,color_g:10,color_b:10,color_a:230}
		pwdY=pwdY+inputH+10;
		this.inputPwdCSS2={pos:[inputX,pwdY,0],w:inputW,h:inputH,text:"",tip:textLib["RepeatPwd"]};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onBandClk);
		var bandW=pic.w,bandH=pic.h,bandX=cntW/2,bandY=pwdY+inputH/2+bandH/2+50;
		bandX=inputX+bandW/2;//cntW/2+bandW/2+20;
		this.btnBandCSS={css:cssLib.normalBtn.createCSS([bandX,bandY,0],keyid,0,textLib["BandEmail"])};
	};
	__Page.dlgAccountBand.init=function(appEnv)
	{
		this.name="dlgAccountBand";
		this.viewId="dlgAccountBand";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0,css;

		var homeDlg=this.homeDlg=this.dlgPage.dlgAccount;
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);

		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({css:[this.contentFieldCSS],display:0});
		this.dlgTitle=homeDlg.dlgTitle;

		this.cntBox.appendNewChild({css:this.inputEmailTipCSS});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputEmailClk);
		css=this.inputEmailCSS;
		this.boxInputEmail=this.cntBox.appendNewChild({css:cssLib.inputBox.createCSS(css.pos,css.w,css.h,keyid,css.tip,css.text,50)});

		this.cntBox.appendNewChild({css:this.inputPwdlTipCSS1});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputPwdClk1);
		css=this.inputPwdCSS1;
		this.boxInputPwd1=this.cntBox.appendNewChild({css:cssLib.inputBox.createCSS(css.pos,css.w,css.h,keyid,css.tip,css.text,50,1)});

		this.cntBox.appendNewChild({css:this.inputPwdlTipCSS2});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputPwdClk2);
		css=this.inputPwdCSS2;
		this.boxInputPwd2=this.cntBox.appendNewChild({css:cssLib.inputBox.createCSS(css.pos,css.w,css.h,keyid,css.tip,css.text,50,1)});

		this.btnBand=this.cntBox.appendNewChild({css:this.btnBandCSS});
	};

	__Page.dlgAccountBand.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.dlgTitle._setText(textLib["BandAccount"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgAccountBand.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
	};

	__Page.dlgAccountBand.checkPwd=function(seq,err)
	{
		DBOut("checkPwd");
		var minLen=6, maxLen=20;
		var inputHud=this["boxInputPwd"+seq];
		var textLib=this.page.appEnv.textLib;
		var txt=inputHud.onInput();
		if(txt)
		{
			if(txt.length<minLen || txt.length>maxLen)
			{
				inputHud.setError(textLib["PwdErrorLen"]);
				this.pwd="";
				return;
			}
			for(var i=0;i<txt.length;i++)
			{
				if(txt.charCodeAt(i)>=0xd800)
				{
					inputHud.setError(textLib["PwdErrorStr"]);
					this.pwd="";
					return;
				}
			}
			if(1==seq)
			{
				this.boxInputPwd2._setText("");
				this.pwd2="";
				this.pwd="";
			}
			else if(2==seq)
			{
				if(this.pwd1 && txt!=this.pwd1)
				{
					inputHud.setError(textLib["PwdErrorRe"]);
					this.pwd="";
					return;
				}
			}
			inputHud._setText(txt);
			this["pwd"+seq]=txt;
			if(this.pwd1 && this.pwd2 && this.pwd1==this.pwd2)
				this.pwd=this.pwd1;
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgAccountBand.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//输入要绑定的邮箱地址
		__Page.dlgAccountBand.onInputEmailClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onInputEmailClk");
				var textLib=this.page.appEnv.textLib
				var txt=this.boxInputEmail.onInput();
				if(txt)
				{
					if(txt.indexOf("@")<1 || txt.indexOf(".")<3 || txt.length<5)
					{
						this.boxInputEmail.setError(textLib["InputEmailError"]);
						return;
					}
					this.boxInputEmail._setText(txt);
					this.email=txt;
				}
			}
		};

		//输入要设置的密码第1次
		__Page.dlgAccountBand.onInputPwdClk1=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onInputPwdClk1");
				this.checkPwd(1);
			}
		};

		//输入要设置的密码第2次
		__Page.dlgAccountBand.onInputPwdClk2=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onInputPwdClk2");
				this.checkPwd(2);
			}
		};

		//绑定邮箱
		__Page.dlgAccountBand.onBandClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onBandClk");
				var textLib=this.page.appEnv.textLib
				if(!this.email)
				{
					this.boxInputEmail.setError(textLib["InputEmail"]);
					return;
				}
				if(!this.pwd)
				{
					if(!this.pwd1)
					{
						this.boxInputPwd1.setError(textLib["InputPwd"]);
					}
					else if(!this.pwd2)
					{
						this.boxInputPwd2.setError(textLib["RepeatPwd"]);
					}
				//	DBOut(this.pwd1+" "+this.pwd2+" "+(this.pwd1==this.pwd2)+" "+this.pwd);
					return;
				}
			//	DBOut("callBindEmail");
				this.appEnv.callBindEmail(this.email,this.pwd);
			}
		};
	}
}
