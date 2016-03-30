if(!__Page.dlgAccountReset)
{
	__Page.dlgAccountReset=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,4);
	//指定这个对话框是属于当前Page的启动对话框
	//__Page.pageDialog=__Page.dlgAccountReset;
	__Page.dlgAccountReset.loadConfig=function()
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
		var txtX=cInner[0], txtY=pwdY, txtW=cntW-txtX*2, txtH=appEnv.getTextSize(textLib["ResetPwdTip"],FS.M,1,txtW).h+10;
		this.txtFieldCSS={type:"text",pos:[txtX,txtY,0],w:txtW,h:txtH,anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:FS.M,color_r:10,color_g:10,color_b:10,color_a:230,wrap:1,l_space:5};

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onResetPwdClk);
		var bandW=pic.w,bandH=pic.h,bandX=cntW/2,bandY=pwdY+txtH+bandH/2+20;
		bandX=inputX+bandW/2;//cntW/2+bandW/2+20;
		this.btnBandCSS={css:cssLib.normalBtn.createCSS([bandX,bandY,0],keyid,0,textLib["ResetPssaword"])};
	};
	__Page.dlgAccountReset.init=function(appEnv)
	{
		this.name="dlgAccountReset";
		this.viewId="dlgAccountReset";
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

		this.cntBox.appendNewChild({css:this.txtFieldCSS,text:textLib["ResetPwdTip"]});
		this.btnBand=this.cntBox.appendNewChild({css:this.btnBandCSS});
	};

	__Page.dlgAccountReset.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.dlgTitle._setText(textLib["ResetPssaword"]);
		this.email="";
		if(vo)
			this.email=vo;
		this.boxInputEmail._setText(this.email);
		if(preState)
		{
			appEnv.hudIn(this.cntBox,0);
		//	appEnv.hudOut(this.btnBack,5);
		}
	};

	__Page.dlgAccountReset.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(nextState)
		{
		//	appEnv.hudIn(this.btnBack,5);
			appEnv.hudOut(this.cntBox,0);
		}
		else
		{
		}
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgAccountReset.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//输入登陆邮箱
		__Page.dlgAccountReset.onInputEmailClk=function(msg,key,way,extra)
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

		//重置密码
		__Page.dlgAccountReset.onResetPwdClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onResetPwdClk");
				var textLib=this.page.appEnv.textLib
				if(!this.email)
				{
					this.boxInputEmail.setError(textLib["InputEmail"]);
					return;
				}
				this.appEnv.newMsg(["UserBean","resetPassword",this.email],{cb:function(flag){
					DBOut("resetPwd ok, flag:"+flag);
				//	if(flag)
						this.appEnv.stateLogs.showLog(textLib["ResetPwdSuccess"]);
				//	else
				//		this.appEnv.stateLogs.showLog(textLib["ResetPwdEh"]);
				},cbobj:this,eh:function(err,msg){
					DBOut("resetPassword err, msg:"+msg);
					if(msg.indexOf("1055")>-1)
						this.appEnv.stateLogs.showLog(textLib["ResetPwdEh1055"]);
					else
						this.appEnv.stateLogs.showLog(textLib["ResetPwdEh"]);
				},ehobj:this},window.UserDWRUrl);
			}
		};
	}
}
