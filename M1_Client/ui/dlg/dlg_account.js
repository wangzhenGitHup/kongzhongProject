if(!__Page.dlgAccount)
{
	__Page.dlgAccount=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,4);
	//指定这个对话框是属于当前Page的启动对话框
	//__Page.pageDialog=__Page.dlgAccount;
	__Page.dlgAccount.loadConfig=function()
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

		var txtX=cInner[0], txtY=cInner[1], txtW=cntW-txtX*2, txtH=appEnv.getTextSize(textLib["BandDesc"],FS.M,1,txtW).h+20;
		this.txtFieldCSS={type:"text",pos:[txtX,txtY,0],w:txtW,h:txtH,anchor_h:0,anchor_v:0,align_h:0,align_v:0,font_size:FS.M,color_r:10,color_g:10,color_b:10,color_a:230,wrap:1,l_space:5};

		var dt=30;
		var btnW=pic.w, btnH=pic.h, btnX=txtX*2+btnW/2, btnY1=txtY+txtH+dt+btnH/2, btnY2=btnY1+dt+btnH, btnY3=btnY2+dt+btnH;
		this.btnPos1=[btnX,btnY1,0];
		this.btnPos2=[btnX,btnY2,0];
		this.btnPos3=[btnX,btnY3,0];
		this.btnServerPos=[cntW/2+btnX,btnY1,0];
	};
	__Page.dlgAccount.init=function(appEnv)
	{
		this.name="dlgAccount";
		this.viewId="dlgAccount";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid;

		var homeDlg=this.homeDlg=this.dlgPage.dlgSetting;
		//制定关闭/返回按钮的行为
		this.regKeyVO(homeDlg.btnCloseKeyId,homeDlg,homeDlg.onCloseClk);
		this.regKeyVO(homeDlg.btnBackKeyId,homeDlg,homeDlg.onBackClk);

		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=homeDlg.dlgFrame;
		this.cntBox=this.dlgFrame.appendNewChild({css:[this.contentFieldCSS],display:0});
		this.dlgTitle=homeDlg.dlgTitle;

		var email=appEnv.getBindEmail();
	//	email=toJSON(email:"zhouzheng@kongzhong.com",password:"abc");
		if("xunlei"!=window.ChannelType)//渠道迅雷-只显示切服
		{
			if(email)
			{
				email=fromJSON(email).email;
				this.email=email;
				this.txtField=this.cntBox.appendNewChild({css:this.txtFieldCSS,text:textLib.getText(textLib["BandedDesc"],{id:window.USERID,email:email})});
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onChgUserClk);//账号绑定、更改用户 | 更改用户、重置密码 | 找回密码、注销
				this.btn1=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS(this.btnPos1,keyid,0,textLib["ChangeUser"])});
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onResetPwdClk);
				this.btn2=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS(this.btnPos2,keyid,0,textLib["ResetPssaword"])});
			//	keyid=appEnv.hudKeys.getKey(this);
			//	this.regKeyVO(keyid,this,this.onLogoutClk);
			//	this.btn3=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS(this.btnPos3,keyid,0,textLib["Logout"])});
			}
			else
			{
				this.txtField=this.cntBox.appendNewChild({css:this.txtFieldCSS,text:textLib["BandDesc"]});
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onBandClk);//账号绑定、更改用户 | 更改用户、重置密码 | 找回密码、注销
				this.btn1=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS(this.btnPos1,keyid,0,textLib["BandAccount"])});
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onChgUserClk);
				this.btn2=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS(this.btnPos2,keyid,0,textLib["ChangeUser"])});
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onResetPwdClk);
				this.btn3=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS(this.btnPos3,keyid,0,textLib["ResetPssaword"])});
			}
		}
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onServerClk);
		this.btnServer=this.cntBox.appendNewChild({css:cssLib.normalBtn.createCSS(this.btnServerPos,keyid,0,textLib["SwitchServer"])});
	};

	__Page.dlgAccount.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.dlgTitle._setText(textLib["AccountManage"]);
		if(vo)
			this.infoVO=vo;
		if(this.infoVO)
		{
			appEnv.hudOut(this.homeDlg.btnBack,5);
			this.appEnv.switchDlg(this.dlgPage.dlgAccountLogin,0);
			return;
		}

		if(preState)
		{
			appEnv.hudIn(this.cntBox,0);
		//	appEnv.hudOut(this.btnBack,5);
		}
	};

	__Page.dlgAccount.leave=function(nextState)
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
		this.dlgPage.dlgAccountBand.init(appEnv);
		this.dlgPage.dlgAccountLogin.init(appEnv);
		this.dlgPage.dlgAccountReset.init(appEnv);
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgAccount.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//账号绑定
		__Page.dlgAccount.onBandClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onBandClk");
				this.appEnv.switchDlg(this.dlgPage.dlgAccountBand,0);
			}
		};

		//更改用户
		__Page.dlgAccount.onChgUserClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onChgUserClk");
				this.appEnv.switchDlg(this.dlgPage.dlgAccountLogin,0);
			}
		};

		//重置密码
		__Page.dlgAccount.onResetPwdClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onResetPwdClk");
				var textLib=this.page.appEnv.textLib
				this.appEnv.switchDlg(this.dlgPage.dlgAccountReset,0,this.email);
			}
		};
		//切换服务器
		__Page.dlgAccount.onServerClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onServerClk");
				var url=this.page.genPageURL("ui/dlg/dlg_switch_server.jml");
				this.appEnv.openPageDlg(url,{title:"SwitchServer"});
			}
		};
//
//		//注销
//		__Page.dlgAccount.onLogoutClk=function(msg,key,way,extra)
//		{
//			if(1==way && 1==msg)
//			{
//				DBOut("onLogoutClk");
//			}
//		};
	}
}
