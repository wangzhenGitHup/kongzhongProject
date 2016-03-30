if(!__Page.dlgNotice)
{
	__Page.dlgNotice=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,2);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgNotice;
	__Page.dlgNotice.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var imgLib=this.page.imgLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;

		//信息区域内的文字
		var subCntTxtX=this.contentInner[0];
		var subCntTxtY=this.contentInner[1];
		var subCntTxtW=this.contentFieldCSS.w-this.contentInner[0]*2;
		var subCntTxtH=this.contentFieldCSS.h-this.contentInner[1]*2;
		this.subCntTxtCSS={id:"subCntTxt",type:"memo",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,align_h:0,align_v:0,wrap:1,font_size:FS.L,color_r:10,color_g:10,color_b:10};
		this.subCntKeyCSS={id:"subCntKey",type:"key",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,display:0};
	};
	__Page.dlgNotice.init=function(appEnv)
	{
		this.name="dlgNotice";
		this.viewId="dlgNotice";
		this.page.dlgBase.prototype.init.call(this,appEnv);
		this.noticeText=this.cntBox.appendNewChild({css:this.subCntTxtCSS,line_h:23,ui_event:1,show_fx:1,end_gap:0,
		//	text:""
		});

		var keyid=this.appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onNoticeClk);
		this.noticeKey=this.cntBox.appendNewChild({css:this.subCntKeyCSS,ui_event:1,key:keyid});
	};
	__Page.dlgNotice.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;
		textLib=aisEnv.textLib;
		var list,i,n,title;
		var bld,def;

		this.data=vo;
		//根据VO初始化界面:
		this.infoVO=vo.noticeList;
		//DBOut("+++this.infoVO="+toJSON(this.infoVO));

		this.initUI();
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};
	__Page.dlgNotice.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		var i,n;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
			this.data.removeUIView(this);
		}
	};
	__Page.dlgNotice.initUI=function()
	{
		var textLib=this.appEnv.textLib;
		this.dlgTitle._setText(textLib.Notice);
		if(this.infoVO && this.infoVO.length)
		{
			if(this.infoVO[0].contents.indexOf("http://")>-1)
			{
				this.noticeKey.setDisplay(1);
				this.noticeURL=this.infoVO[0].contents;
			}
			this.noticeText.setText(this.infoVO[0].contents+"\r\n"+this.infoVO[0].createTime);
			this.data.readNoticeById(this.infoVO[0].id);
		}
	};
	__Page.dlgNotice.aisUpdateView=function()
	{

	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgNotice.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
		__Page.dlgNotice.onNoticeClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
				shellExec(this.noticeURL);
		};
	}
}
