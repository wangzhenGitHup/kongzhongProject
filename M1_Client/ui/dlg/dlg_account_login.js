if(!__Page.dlgAccountLogin)
{
	__Page.dlgAccountLogin=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,4);
	//指定这个对话框是属于当前Page的启动对话框
	//__Page.pageDialog=__Page.dlgAccountLogin;
	__Page.dlgAccountLogin.loadConfig=function()
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
		this.inputEmailTipCSS={type:"text",pos:[inputX,emailY,0],w:inputW,h:inputH,text:textLib["LoginMail"]+"：",anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:FS.M,color_r:10,color_g:10,color_b:10,color_a:230}
		emailY=emailY+inputH+10;
		this.inputEmailCSS={pos:[inputX,emailY,0],w:inputW,h:inputH,text:"",tip:textLib["LoginMail"]};
		pwdY=emailY+inputH+10;
		this.inputPwdlTipCSS={type:"text",pos:[inputX,pwdY,0],w:inputW,h:inputH,text:textLib["LoginPwd"],anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:FS.M,color_r:10,color_g:10,color_b:10,color_a:230}
		pwdY=pwdY+inputH+10;
		this.inputPwdCSS={pos:[inputX,pwdY,0],w:inputW,h:inputH,text:"",tip:textLib["LoginPwd"]};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onLoginClk);
		var bandW=pic.w,bandH=pic.h,bandX=cntW/2,bandY=pwdY+inputH/2+bandH/2+50;
		bandX=inputX+bandW/2;//cntW/2+bandW/2+20;
		this.btnBandCSS={css:cssLib.normalBtn.createCSS([bandX,bandY,0],keyid,0,textLib["Login"])};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onResetPwdClk);
		this.btnResetCSS={css:cssLib.normalBtn.createCSS([cntW-bandX,bandY,0],keyid,0,textLib["ResetPssaword"])};
	};
	__Page.dlgAccountLogin.init=function(appEnv)
	{
		this.name="dlgAccountLogin";
		this.viewId="dlgAccountLogin";
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

		this.cntBox.appendNewChild({css:this.inputPwdlTipCSS});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputPwdClk);
		css=this.inputPwdCSS;
		this.boxInputPwd=this.cntBox.appendNewChild({css:cssLib.inputBox.createCSS(css.pos,css.w,css.h,keyid,css.tip,css.text,50,1)});

		this.btnBand=this.cntBox.appendNewChild({css:this.btnBandCSS});
	};

	__Page.dlgAccountLogin.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.dlgTitle._setText(textLib["ChangeUser"]);
		if(this.homeDlg.infoVO)
		{
			this.dlgTitle._setText(textLib["EmailLogin"]);
			this.btnReset=this.cntBox.appendNewChild({css:this.btnResetCSS});
			var pos=[],dt=20;
			this.btnBand.getPos(pos);
			pos[0]+=dt;
			this.btnBand.setPos(pos);
			this.btnReset.getPos(pos);
			pos[0]-=dt;
			this.btnReset.setPos(pos);
		}
		if(preState)
		{
			appEnv.hudIn(this.cntBox,0);
		//	appEnv.hudOut(this.btnBack,5);
		}
	};

	__Page.dlgAccountLogin.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(this.homeDlg.infoVO)
			appEnv.hudIn(this.homeDlg.homeDlg.btnBack,5);
		if(nextState)
		{
		//	appEnv.hudIn(this.btnBack,5);
			appEnv.hudOut(this.cntBox,0);
		}
		else
		{
		}
	};

	__Page.dlgAccountLogin.checkPwd=function(seq,err)
	{
		DBOut("checkPwd");
		var minLen=6, maxLen=20;
		var inputHud=this.boxInputPwd;
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
			inputHud._setText(txt);
			this.pwd=txt;
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgAccountLogin.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//输入登陆邮箱
		__Page.dlgAccountLogin.onInputEmailClk=function(msg,key,way,extra)
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

		//输入登陆密码
		__Page.dlgAccountLogin.onInputPwdClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onInputPwdClk");
				this.checkPwd(1);
			}
		};

		//更改用户，检测更改登陆的邮箱和密码
		__Page.dlgAccountLogin.onLoginClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onLoginClk");
				var textLib=this.page.appEnv.textLib
				if(!this.email)
				{
					this.boxInputEmail.setError(textLib["InputEmail"]);
					return;
				}
				if(!this.pwd)
				{
					this.boxInputPwd.setError(textLib["InputPwd"]);
					return;
				}
				if(this.homeDlg.infoVO)
				{
					this.page.setCookie(cookieDomain,"email",toJSON({email:this.email,password:this.pwd}),0);
					this.appEnv.login();
				//	this.appEnv.closeDlg(null,null,0);
					return;
				}
				this.appEnv.newMsg(["UserBean","verifyEmailPasswd",this.email,this.pwd],{cb:function(flag){
					DBOut("verifyEmailPasswd :"+flag);
					if(-1==flag)//email不存在
					{
						this.appEnv.stateLogs.showLog(textLib["MailPwdErr"]);
					}
					else if(-2==flag)//email和密码不匹配
					{
						this.appEnv.stateLogs.showLog(textLib["MailPwdErr"]);
					}
					else if(0==flag)//email和密码匹配
					{
						this.page.setCookie(cookieDomain,"email",toJSON({email:this.email,password:this.pwd}),0);
						this.appEnv.reStartGame("ChangeUser");
					}
				},cbobj:this,eh:function(err,msg){
					this.appEnv.stateLogs.showLog(textLib["LoginEh"]);
				},ehobj:this},window.UserDWRUrl);
			}
		};

		//重置密码
		__Page.dlgAccountLogin.onResetPwdClk=function(msg,key,way,extra)
		{
			this.homeDlg.onResetPwdClk(msg,key,way,extra);
		};
	}
}
