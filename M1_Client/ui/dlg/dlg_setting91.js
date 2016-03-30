if(!__Page.dlgSetting)
{
	__Page.dlgSetting=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,4);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgSetting;
	__Page.dlgSetting.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid;

		var cntW=this.contentW,cntH=this.contentH,cInner=this.contentInner;

		var dt=30;
		var pic=imgLib.getImg("btn_setBG_u"),pic1=imgLib.getImg("btn_setBG_d"),pic2=imgLib.getImg("btn_set_91");
		pic.w=pic1.w=166;
		pic.h=pic1.h=128;
		var bigW=pic.w, bigH=pic.h, bigX_l=cntW/2-dt-bigW/2, bigX_r=cntW/2+dt+bigW/2, bigY=cInner[1]+10+bigH/2;

		if("UC"==window.ChannelType)
		{
			pic2=imgLib.getImg("btn_set_uc");
			bigX_l=cntW/2;
		}
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onBigLClk);
		this.btnBigCSS_l={type:"key",pos:[bigX_l,bigY,0],anchor_h:1,anchor_v:1,ui_event:1,key:keyid,css:pic,state_up:pic,state_down:pic1,down_scale:0.98,items:[
			{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic2}
		]};

		pic2=imgLib.getImg("btn_set_18183");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onBigRClk);
		this.btnBigCSS_r={type:"key",pos:[bigX_r,bigY,0],anchor_h:1,anchor_v:1,ui_event:1,key:keyid,css:pic,state_up:pic,state_down:pic1,down_scale:0.98,items:[
			{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic2}
		]};

		var lineX=cntW/2,lineY=bigY+bigH/2+20,lineW=cntW-20;
		this.boxLineCSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};

		pic=imgLib.getImg("btn_green_u");
		var btnW=pic.w,btnH=pic.h;
		var btnY=lineY+btnH/2+20,dt=20;
		var soundX=cntW/2-btnW/2-dt,musicX=cntW/2+btnW/2+dt;

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSoundClk);
		this.btnSoundCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["SetSound"](0))};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMusicClk);
		this.btnMusicCSS={css:cssLib.normalBtn.createCSS([musicX,btnY,0],keyid,0,textLib["SetMusic"](0))};

		lineX=cntW/2,lineY=btnY+btnH/2+20,lineW=cntW-20;
		this.boxLine1CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};

		btnY=lineY+btnH/2+20;

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onCopyrightClk);
		this.btnCopyrightCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["Copyright"])};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onFeedBackClk);
		this.btnFeedbackCSS={css:cssLib.normalBtn.createCSS([musicX,btnY,0],keyid,0,textLib["Feedback"])};

		lineX=cntW/2,lineY=btnY+btnH/2+20,lineW=cntW-20;
		this.boxLine2CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};

		var kfW=btnW,kfH=btnH,kfX=soundX-btnW/2,kfY=lineY+dt+kfH/2;
		this.kfCSS={type:"text",pos:[kfX,kfY,0],w:kfW,h:kfH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:190,text:textLib["ServiceEmail"]+":"};
		this.kfMailCSS={type:"text",pos:[cntW-kfX,kfY,0],w:kfW,h:kfH,anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:12,color_g:133,color_b:227,color_a:190,syele:"u"};//color_r:80,color_g:255,color_b:255

		var webW=kfW,webH=kfH,webX=kfX,webY=kfY+dt/2+kfH/2;
		this.webCSS={type:"text",pos:[webX,webY,0],w:webW,h:webH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:190,text:textLib["OfficialWebsite"]+":"};
		this.siteCSS={type:"text",pos:[cntW-webX,webY,0],w:webW,h:webH,anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:12,color_g:133,color_b:227,color_a:190,syele:"u"};

		var idW=260,idH=50,idX=cntW/2,idY=cntH-idH/2;
		this.idCSS={type:"div3x3",pos:[idX,idY,0],w:idW,h:idH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_resBar_bg"),color_a:0,items:[
		//	{id:"id",css:cssLib.textFineBig.createCSS([0,0,0],textLib["UserId"]+": "+window.USERID,idW,idH,1,1,1,1)}
			{id:"id",type:"text",pos:[0,0,0],w:idW,h:idH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,font_size:26,color_r:0,color_g:0,color_b:0,color_a:190,text:textLib["UserId"]+": "+window.USERID}
		]};
	};
	__Page.dlgSetting.init=function(appEnv)
	{
		this.name="dlgSetting";
		this.viewId="dlgSetting";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0,css,item,itemW,itemH,itemX,itemY;

		this.btnBig_l=this.cntBox.appendNewChild({css:this.btnBigCSS_l});
		if("UC"!=window.ChannelType)
			this.btnBig_r=this.cntBox.appendNewChild({css:this.btnBigCSS_r});

		this.cntBox.appendNewChild({css:this.boxLineCSS});

		this.btnSound=this.cntBox.appendNewChild({css:this.btnSoundCSS});
		this.btnMusic=this.cntBox.appendNewChild({css:this.btnMusicCSS});

		this.cntBox.appendNewChild({css:this.boxLine1CSS});

		this.cntBox.appendNewChild({css:this.kfCSS});
		css=this.kfMailCSS;
		item=this.cntBox.appendNewChild({css:this.kfMailCSS,text:ServiceMail,display:0});
		itemW=item.getTextW()+12;
		itemH=item.getTextH();//+16
		itemX=css.pos[0]+6;
		itemY=css.pos[1];
		if("91"!=window.ChannelType)
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onMailClk);
			this.cntBox.appendNewChild({type:"shape",pos:[itemX,itemY+itemH/2,0],anchor_h:2,anchor_v:1,w:itemW,h:1,face_r:12,face_g:133,face_b:227,face_a:255});
			this.cntBox.appendNewChild({type:"key",pos:[itemX,itemY,0],anchor_h:2,anchor_v:1,w:itemW,h:itemH,key:keyid,ui_event:1,button:1,
				state_up:{w:itemW,h:itemH},items:[
			//	{type:"div3x3",pos:[0,0,0],anchor_h:2,anchor_v:1,w:itemW,h:itemH,css:imgLib.getImg("box_dark"),}
			]});
		}
		item=this.cntBox.appendNewChild({css:this.kfMailCSS,text:ServiceMail});

		if("cn"==window.LanguageStr && "UC"!=window.ChannelType)
		{
			this.cntBox.appendNewChild({css:this.webCSS});
			css=this.siteCSS;
			item=this.cntBox.appendNewChild({css:this.siteCSS,text:Website,display:0});
			itemW=item.getTextW()+12;
			itemH=item.getTextH();//+16
			itemX=css.pos[0]+6;
			itemY=css.pos[1];
			if("91"!=window.ChannelType)
			{
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onSiteClk);
				this.cntBox.appendNewChild({type:"shape",pos:[itemX,itemY+itemH/2,0],anchor_h:2,anchor_v:1,w:itemW,h:1,face_r:12,face_g:133,face_b:227,face_a:255});
				this.cntBox.appendNewChild({type:"key",pos:[itemX,itemY,0],anchor_h:2,anchor_v:1,w:itemW,h:itemH,key:keyid,ui_event:1,button:1,
					state_up:{w:itemW,h:itemH},items:[
				//	{type:"div3x3",pos:[0,0,0],anchor_h:2,anchor_v:1,w:itemW,h:itemH,css:imgLib.getImg("box_dark"),}
				]});
			}
			item=this.cntBox.appendNewChild({css:this.siteCSS,text:Website});
		}

		this.btnCopyright=this.cntBox.appendNewChild({css:this.btnCopyrightCSS});
		this.btnFeedback=this.cntBox.appendNewChild({css:this.btnFeedbackCSS});

		this.cntBox.appendNewChild({css:this.boxLine2CSS});

		this.idBox=this.cntBox.appendNewChild({css:this.idCSS});
		this.idTxt=this.idBox.getItemById("id");
	};

	__Page.dlgSetting.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.btnSound.setText(textLib["SetSound"](page.audioObject.option.sound));
		this.btnMusic.setText(textLib["SetMusic"](page.audioObject.option.music));
		this.dlgTitle._setText(textLib["Setting"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgSetting.leave=function(nextState)
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

	__Page.dlgSetting.getAtkLog=function()
	{
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgSetting.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		__Page.dlgSetting.onBigLClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("91中心");
				if(window.NDPlatform)
					NDPlatform.enter();
				else if(window.UCPlatform)
					UCPlatform.enterUserCenter();
			}
		};

		__Page.dlgSetting.onBigRClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("18183论坛");
				if(window.NDPlatform)
					NDPlatform.enterBBS();
			}
		};

		__Page.dlgSetting.onCopyrightClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onCopyrightClk");
				var textLib=this.appEnv.textLib;
				this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["Copyright"],info:textLib["CopyrightDesc"],align:1});
			}
		};

		__Page.dlgSetting.onFeedBackClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onFeedBackClk");
				if(window.NDPlatform)
					NDPlatform.feedback();
				else
					this.onMailClk(msg,key,way,extra);
			}
		};

		__Page.dlgSetting.onBandClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onBandClk");
				if(!this.email)
					return;
				if(!this.pwd)
					return;
				this.appEnv.callBindEmail(this.email,this.pwd);
			}
		};

		//声音开关
		__Page.dlgSetting.onSoundClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				//DBOut("onSoundClk:"+this.page.audioObject._init);
				var status=this.page.audioObject.setSound();
				this.btnSound.setText(this.appEnv.textLib["SetSound"](status));
			}
		};

		//音乐开关
		__Page.dlgSetting.onMusicClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				//DBOut("onMusicClk:"+this.page.audioObject._init);
				var status=this.page.audioObject.setMusic();
				this.btnMusic.setText(this.appEnv.textLib["SetMusic"](status));
			}
		};

		//发送邮件
		__Page.dlgSetting.onMailClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onMailClk");
				var url = "mailto:"+window.ServiceMail+"?subject=ID"+encodeURIComponent(":"+window.USERID+" "+this.appEnv.textLib["UserName"]+":"+window.aisGame.king.name+" "+this.appEnv.textLib["ServerName"]+":"+this.appEnv.getServerNameByID(this.appEnv.getServerID()));
				shellExec(url);
			}
		};

		//访问官网
		__Page.dlgSetting.onSiteClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onSiteClk");
				var url=window.Website;
				shellExec(url);
			}
		};

		//账号管理
		__Page.dlgSetting.onAccountClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onAccountClk");
				DBOut(this.btnBack);
			}
		};
	}
}
