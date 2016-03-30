if ("CMGC" != System.getProperty("ChannelType")) {
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
		var pic=imgLib.getImg("btn_setBG_u"),pic1=imgLib.getImg("btn_setBG_d"),pic2=imgLib.getImg("btn_set_account");
		pic.w=pic1.w=166;
		pic.h=pic1.h=128;
		var bigW=pic.w, bigH=pic.h, bigX_l=cntW/2-dt-bigW/2, bigX_r=cntW/2+dt+bigW/2, bigY=cInner[1]+10+bigH/2;
		if("UC"==window.ChannelType)
			bigY=cInner[1]+bigH/2
		if("91"==window.ChannelType)
		{
			pic2=imgLib.getImg("btn_set_91");
		}
		else if("UC"==window.ChannelType)
		{
			pic2=imgLib.getImg("btn_set_uc");
			bigX_l=cntW/2;
		}
		if("cn"!=window.LanguageStr)
		{
			bigX_l=cntW/2;
		}
		if("CNwdj"==window.ChannelType)
			bigX_l=cntW/2;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onAccountClk);
		this.btnBigCSS_l={type:"key",pos:[bigX_l,bigY,0],anchor_h:1,anchor_v:1,ui_event:1,key:keyid,css:pic,state_up:pic,state_down:pic1,down_scale:0.98,items:[
			{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic2}
		]};

		pic2=imgLib.getImg("btn_set_bbs");
		if("91"==window.ChannelType)
		{
			pic2=imgLib.getImg("btn_set_18183");
		}
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onBBSClk);
		this.btnBigCSS_r={type:"key",pos:[bigX_r,bigY,0],anchor_h:1,anchor_v:1,ui_event:1,key:keyid,css:pic,state_up:pic,state_down:pic1,down_scale:0.98,items:[
			{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic2}
		]};

		var lineX=cntW/2,lineY=bigY+bigH/2+20,lineW=cntW-20;
		if("UC"==window.ChannelType)
			lineY=bigY+bigH/2+10;
		this.boxLineCSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};

		if("QH"==window.ChannelType)
			lineY=cInner[0];
		pic=imgLib.getImg("btn_green_u");
		var btnW=pic.w,btnH=pic.h;
		var btnY=lineY+btnH/2+20,dt=20;
		if("UC"==window.ChannelType)
			btnY=lineY+btnH/2+10;
		var soundX=cntW/2-btnW/2-dt,musicX=cntW/2+btnW/2+dt;

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSoundClk);
		this.btnSoundCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["SetSound"](0))};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMusicClk);
		this.btnMusicCSS={css:cssLib.normalBtn.createCSS([musicX,btnY,0],keyid,0,textLib["SetMusic"](0))};

		lineX=cntW/2,lineY=btnY+btnH/2+20,lineW=cntW-20;
		if("UC"==window.ChannelType)
			lineY=btnY+btnH/2+10;
		this.boxLine1CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};

		btnY=lineY+btnH/2+20;
		if("UC"==window.ChannelType)
			btnY=lineY+btnH/2+10;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onCopyrightClk);
		this.btnCopyrightCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["Copyright"])};
		if("91"==window.ChannelType)
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onChangeServerClk);
			this.btnChangeServerCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["SwitchServer"])};
		}
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onFeedBackClk);
		this.btnFeedbackCSS={css:cssLib.normalBtn.createCSS([musicX,btnY,0],keyid,0,textLib["Feedback"])};
		if("CNwdj"==window.ChannelType)
			this.btnFeedbackCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["Feedback"])};
		lineX=cntW/2,lineY=btnY+btnH/2+20,lineW=cntW-20;
		if("UC"==window.ChannelType)
			lineY=btnY+btnH/2+10;
		this.boxLine2CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};
		//联运平台切换服务器按钮
		if("UC"==window.ChannelType)
		{
			btnY=lineY+btnH/2+10;
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onChangeServerClk);
			this.btnChangeServerCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["SwitchServer"])};
			lineY=btnY+btnH/2+10;
			this.boxLine3CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};
		}
		var kfW=btnW,kfH=btnH,kfX=soundX-btnW/2,kfY=lineY+dt+kfH/2;
		if("UC"==window.ChannelType)
			kfY=lineY+kfH/2;
		this.kfCSS={type:"text",pos:[kfX,kfY,0],w:kfW,h:kfH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:190,text:textLib["ServiceEmail"]+":"};
		this.kfMailCSS={type:"text",pos:[cntW-kfX,kfY,0],w:kfW,h:kfH,anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:12,color_g:133,color_b:227,color_a:190,syele:"u"};//color_r:80,color_g:255,color_b:255

		var webW=kfW,webH=kfH,webX=kfX,webY=kfY+dt/2+kfH/2;
		this.webCSS={type:"text",pos:[webX,webY,0],w:webW,h:webH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:190,text:textLib["OfficialWebsite"]+":"};
		this.siteCSS={type:"text",pos:[cntW-webX,webY,0],w:webW,h:webH,anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:12,color_g:133,color_b:227,color_a:190,syele:"u"};

		var idW=260,idH=50,idX=cntW/2,idY=cntH-idH/2;
		this.idCSS={type:"div3x3",pos:[idX,idY,0],w:idW,h:idH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_resBar_bg"),color_a:0,items:[
		//	{id:"id",css:cssLib.textFineBig.createCSS([0,0,0],textLib["UserId"]+": "+window.USERID,idW,idH,1,1,1,1)}
			{id:"id",type:"text",pos:[0,0,0],w:idW,h:idH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,font_size:26,color_r:0,color_g:0,color_b:0,color_a:190,text:textLib["UserId"]+": "+window.USERID},
			{id:"ver",type:"text",pos:[230,3,0],w:idW,h:idH,anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:16,color_r:0,color_g:0,color_b:0,color_a:190,text:"Ver "+(window.AppVersion||"1.10")}
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

		if("QH"!=window.ChannelType)
		{
			this.btnBig_l=this.cntBox.appendNewChild({css:this.btnBigCSS_l});
			if("UC"!=window.ChannelType && "cn"==window.LanguageStr && "CNwdj"!=window.ChannelType)
				this.btnBig_r=this.cntBox.appendNewChild({css:this.btnBigCSS_r});

			this.cntBox.appendNewChild({css:this.boxLineCSS});
		}

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
		if("CNwdj"!=window.ChannelType && "91"!=window.ChannelType)
			this.btnCopyright=this.cntBox.appendNewChild({css:this.btnCopyrightCSS});
		this.btnFeedback=this.cntBox.appendNewChild({css:this.btnFeedbackCSS});

		this.cntBox.appendNewChild({css:this.boxLine2CSS});
		
		if("91"==window.ChannelType || "UC"==window.ChannelType)
		{
			this.btnChangeServer=this.cntBox.appendNewChild({css:this.btnChangeServerCSS});
			this.cntBox.appendNewChild({css:this.boxLine3CSS});
		}
		
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

		this.dlgPage.dlgAccount.init(appEnv);

		if(vo)
		{
			this.infoVO=vo;
			appEnv.hudOut(this.btnClose,0);
			setFrameout(0,function(){
				appEnv.switchDlg(this.dlgPage.dlgAccount,0,vo);
			},this);
			return;
		}
		this.btnSound.setText(textLib["SetSound"](page.audioObject.option.sound));
		this.btnMusic.setText(textLib["SetMusic"](page.audioObject.option.music));
		this.dlgTitle._setText(textLib["Setting"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox,0);
			appEnv.hudOut(this.btnBack,5);
		}
	};

	__Page.dlgSetting.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,5);
			appEnv.hudOut(this.cntBox,0);
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

		//账号管理
		__Page.dlgSetting.onAccountClk=function(msg,key,way,extra)
		{
			if("CNwdj"==window.ChannelType)
			{
				this.onChangeServerClk(msg,key,way,extra);
				return;
			}
			if(1==way && 1==msg)
			{
				DBOut("onAccountClk, 91:"+window.NDPlatform+",UC:"+window.UCPlatform);
				if(window.NDPlatform)
					NDPlatform.enter();
				else if(window.UCPlatform)
					UCPlatform.enterUserCenter();
				else
					this.appEnv.switchDlg(this.dlgPage.dlgAccount,0);
			}
		};

		//访问论坛
		__Page.dlgSetting.onBBSClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onBBSClk, 91:"+window.NDPlatform+",UC:"+window.UCPlatform);
				if(window.NDPlatform)
					NDPlatform.enterBBS();
				else
				{
					var url="http://tieba.baidu.com/f?ie=utf-8&kw=%E5%8F%A3%E8%A2%8B%E6%88%98%E4%BA%89";
					shellExec(url);
				}
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

		//版权信息
		__Page.dlgSetting.onCopyrightClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onCopyrightClk");
				var textLib=this.appEnv.textLib;
				this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["Copyright"],info:textLib["CopyrightDesc"],align:1});
			}
		};

		//用户反馈
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

		//切服
		__Page.dlgSetting.onChangeServerClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onChangeServerClk");
				var url=this.page.genPageURL("ui/dlg/dlg_switch_server.jml");
				this.appEnv.openPageDlg(url,{title:"SwitchServer"});
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
	}
}

} else {

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
		DBOut("dlg_setting:contentw:"+this.contentW+",contenth:"+this.contentH+",contentinner:"+this.contentInner);

		var dt=30;
		var pic=imgLib.getImg("btn_setBG_u"),pic1=imgLib.getImg("btn_setBG_d"),pic2=imgLib.getImg("btn_set_account");
		// pic.w=pic1.w=166;
		// pic.h=pic1.h=128;
		pic.w=pic1.w=128;
		pic.h=pic1.h=40;
		var bigW=pic.w, bigH=pic.h-10, bigX_l=cntW/2-dt-bigW/2, bigX_r=cntW/2+dt+bigW/2, bigY=cInner[1]+10+bigH/2;

		if("91"==window.ChannelType)
		{
			pic2=imgLib.getImg("btn_set_91");
		}
		else if("UC"==window.ChannelType)
		{
			pic2=imgLib.getImg("btn_set_uc");
			bigX_l=cntW/2;
		}
		if("cn"!=window.LanguageStr)
		{
			bigX_l=cntW/2;
		}
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onAccountClk);
		this.btnBigCSS_l={type:"key",pos:[bigX_l,bigY,0],anchor_h:1,anchor_v:1,ui_event:1,key:keyid,css:pic,state_up:pic,state_down:pic1,down_scale:0.98,items:[
			{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic2}
		]};

		pic2=imgLib.getImg("btn_set_bbs");
		if("91"==window.ChannelType)
		{
			pic2=imgLib.getImg("btn_set_18183");
		}
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onBBSClk);
		this.btnBigCSS_r={type:"key",pos:[bigX_r,bigY,0],anchor_h:1,anchor_v:1,ui_event:1,key:keyid,css:pic,state_up:pic,state_down:pic1,down_scale:0.98,items:[
			{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:pic2}
		]};

		var lineX=cntW/2,lineY=bigY+bigH/2+40,lineW=cntW-20;
		this.boxLineCSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};

		if("QH"==window.ChannelType)
			lineY=cInner[0];
		pic=imgLib.getImg("btn_green_u");
		var btnW=pic.w,btnH=pic.h;
		var btnY=lineY+btnH/2+5,dt=20;
		var soundX=cntW/2-btnW/2-dt,musicX=cntW/2+btnW/2+dt;

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSoundClk);
		this.btnSoundCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["SetSound"](0))};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMusicClk);
		this.btnMusicCSS={css:cssLib.normalBtn.createCSS([musicX,btnY,0],keyid,0,textLib["SetMusic"](0))};

		lineX=cntW/2,lineY=btnY+btnH/2+5,lineW=cntW-20;
		this.boxLine1CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};

		btnY=lineY+btnH/2+5;

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onCopyrightClk);
		this.btnCopyrightCSS={css:cssLib.normalBtn.createCSS([soundX,btnY,0],keyid,0,textLib["Copyright"])};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onFeedBackClk);
		this.btnFeedbackCSS={css:cssLib.normalBtn.createCSS([musicX,btnY,0],keyid,0,textLib["Feedback"])};
		// lineX=cntW/2,lineY=btnY+btnH/2+35,lineW=cntW-10;
		// this.boxLine2CSS={type:"div3x3",pos:[lineX,lineY+40,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};


		//此处为新加
		if(ChannelType=="CMGC"){
			lineX=cntW/2,lineY=btnY+btnH/2-35,lineW=cntW-20;
			this.boxLine2CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};
			btnY=lineY+btnH/2+30;
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onAboutClk);
			this.btnAboutCSS={css:cssLib.normalBtn.createCSS([soundX,btnY+25,0],keyid,0,textLib["About"])};
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onHelpClk);
			this.btnHelpCSS={css:cssLib.normalBtn.createCSS([soundX+200,btnY+25,0],keyid,0,textLib["Help"])};

			lineX=cntW/2,lineY=btnY+btnH/2-50,lineW=cntW-20;
			this.boxLine3CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};
			btnY=lineY+btnH/2+65;
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onMoreGamesClk);
			this.btnMoreGamesCSS={css:cssLib.normalBtn.createCSS([soundX,btnY+20,0],keyid,0,textLib["MoreGames"])};
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onQuitGameClk);
			this.btnQuitGameCSS={css:cssLib.normalBtn.createCSS([soundX+200,btnY+20,0],keyid,0,textLib["QuitGame"])};

		}



		lineX=cntW/2,lineY=btnY+btnH/2+40,lineW=cntW-20;
		this.boxLine2CSS={type:"div3x3",pos:[lineX,lineY,0],w:lineW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")};

		var kfW=btnW,kfH=btnH,kfX=soundX-btnW/2,kfY=lineY+dt+kfH/2-25;
		this.kfCSS={type:"text",pos:[kfX,kfY,0],w:kfW,h:kfH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:190,text:textLib["ServiceEmail"]+":"};
		this.kfMailCSS={type:"text",pos:[cntW-kfX,kfY,0],w:kfW,h:kfH,anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:12,color_g:133,color_b:227,color_a:190,syele:"u"};//color_r:80,color_g:255,color_b:255

		var webW=kfW,webH=kfH,webX=kfX,webY=kfY+dt/2+kfH/2;
		this.webCSS={type:"text",pos:[webX,webY-10,0],w:webW,h:webH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:190,text:textLib["OfficialWebsite"]+":"};
		this.siteCSS={type:"text",pos:[cntW-webX,webY-10,0],w:webW,h:webH,anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:12,color_g:133,color_b:227,color_a:190,syele:"u"};

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

		if("QH"!=window.ChannelType)
		{
			this.btnBig_l=this.cntBox.appendNewChild({css:this.btnBigCSS_l});
			if("UC"!=window.ChannelType && "cn"==window.LanguageStr)
				this.btnBig_r=this.cntBox.appendNewChild({css:this.btnBigCSS_r});

			this.cntBox.appendNewChild({css:this.boxLineCSS});
		}

		this.btnSound=this.cntBox.appendNewChild({css:this.btnSoundCSS});
		this.btnMusic=this.cntBox.appendNewChild({css:this.btnMusicCSS});

		this.cntBox.appendNewChild({css:this.boxLine1CSS});
		// this.cntBox.appendNewChild({css:this.boxLine1CSS});
		// this.cntBox.appendNewChild({css:this.boxLine1CSS});

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
		//此处为新加
		if(ChannelType=="CMGC")
		{
			this.cntBox.appendNewChild({css:this.boxLine2CSS});
			this.btnAbout=this.cntBox.appendNewChild({css:this.btnAboutCSS});
			this.btnHelp=this.cntBox.appendNewChild({css:this.btnHelpCSS});
			this.cntBox.appendNewChild({css:this.boxLine3CSS});
			this.btnMoreGames=this.cntBox.appendNewChild({css:this.btnMoreGamesCSS});
			this.btnQuitGame=this.cntBox.appendNewChild({css:this.btnQuitGameCSS});
		}



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

		this.dlgPage.dlgAccount.init(appEnv);

		if(vo)
		{
			this.infoVO=vo;
			appEnv.hudOut(this.btnClose,0);
			setFrameout(0,function(){
				appEnv.switchDlg(this.dlgPage.dlgAccount,0,vo);
			},this);
			return;
		}
		this.btnSound.setText(textLib["SetSound"](page.audioObject.option.sound));
		this.btnMusic.setText(textLib["SetMusic"](page.audioObject.option.music));
		this.dlgTitle._setText(textLib["Setting"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox,0);
			appEnv.hudOut(this.btnBack,5);
		}
	};

	__Page.dlgSetting.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var bld,list,i,n;
		bld=this.aisBld;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,5);
			appEnv.hudOut(this.cntBox,0);
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

		//账号管理
		__Page.dlgSetting.onAccountClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onAccountClk, 91:"+window.NDPlatform+",UC:"+window.UCPlatform);
				if(window.NDPlatform)
					NDPlatform.enter();
				else if(window.UCPlatform)
					UCPlatform.enterUserCenter();
				else
					this.appEnv.switchDlg(this.dlgPage.dlgAccount,0);
			}
		};

		//访问论坛
		__Page.dlgSetting.onBBSClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onBBSClk, 91:"+window.NDPlatform+",UC:"+window.UCPlatform);
				if(window.NDPlatform)
					NDPlatform.enterBBS();
				else
				{
					var url="http://tieba.baidu.com/f?ie=utf-8&kw=%E5%8F%A3%E8%A2%8B%E6%88%98%E4%BA%89";
					shellExec(url);
				}
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

		//版权信息
		__Page.dlgSetting.onCopyrightClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onCopyrightClk");
				var textLib=this.appEnv.textLib;
				this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["Copyright"],info:textLib["CopyrightDesc"],align:1});
			}
		};

		//用户反馈
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
		//关于
		__Page.dlgSetting.onAboutClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onAboutClk");
				var textLib=this.appEnv.textLib;
				this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["About"],info:textLib["AboutDesc"],align:1});
			}
		};

		//帮助
		__Page.dlgSetting.onHelpClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onHelpClk");
				var textLib=this.appEnv.textLib;
				this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["Help"],info:textLib["HelpDesc"],align:1});
			}
		};

		//更多游戏
		__Page.dlgSetting.onMoreGamesClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onMoreGamesClk");
				var url = "http://g.10086.cn/a/";
				shellExec(url);
				// var textLib=this.appEnv.textLib;
				// this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["MoreGames"],info:textLib["HelpDesc"],align:1});
			}
		};

		//退出游戏
		__Page.dlgSetting.onQuitGameClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onQuitGameClk");

				if(Dialogs.prompt(this.appEnv.textLib.AskExit))
					{

						//setTimeout(1000,function(){
							//if(Dialogs.prompt(this.appEnv.textLib.QuitContent)){
					//		exitApp();
					//		shellExec("http://g.10086.cn/a/");
						//}else{
						//	exitApp();
						//}
						//},this);

						exitApp();
						shellExec("http://g.10086.cn/a/");

					}
				// var textLib=this.appEnv.textLib;
				// this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["MoreGames"],info:textLib["HelpDesc"],align:1});
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
	}
}
}