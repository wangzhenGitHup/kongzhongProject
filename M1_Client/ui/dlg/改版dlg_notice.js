if(!__Page.dlgNotice)
{
	__Page.dlgNotice=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,2);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgNotice;
	__Page.dlgNotice.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var appEnv=this.appEnv;
		var imgLib=this.page.imgLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;

		//标签栏
		pic=imgLib.getImg("btn_blue_u");
		var topListX=cntInner[0], topListY=cntInner[1], topListW=cntW-topListX*2, topListH=50;
		var menuW=pic.w+10, menuH=pic.h, menuX=menuW/2, menuY=menuH/2;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMenuClk);
		this.lbxMenuCSS={type:"listbox",id:"lbx-menu",pos:[topListX,topListY,0],w:topListW,h:topListH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,key:keyid,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:1,//hot_check:1,//hot_item:0,
			item_w:110,item_h:menuH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:0.9,item_size_check:1.2,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		this.lbxBgCSS={type:"shape",pos:[topListX,topListY,0],w:topListW,h:topListH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,face_g:0,face_a:255};
		//信息区域内的文字
		var subCntTxtX=cntInner[0], subCntTxtY=topListY+topListH+10, subCntTxtW=cntW-subCntTxtX*2, subCntTxtH=cntH-subCntTxtY-cntInner[1];
		this.subCntTxtCSS={id:"subCntTxt",type:"memo",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,align_h:0,align_v:0,wrap:1,font_size:FS.L,color_r:10,color_g:10,color_b:10};
		this.subCntKeyCSS={id:"subCntKey",type:"key",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,display:0};
	};
	__Page.dlgNotice.init=function(appEnv)
	{
		this.name="dlgNotice";
		this.viewId="dlgNotice";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.infoVO=[];

		this.lbxBg=this.cntBox.appendNewChild({css:this.lbxBgCSS});
		this.lbxMenu=this.cntBox.appendNewChild({css:this.lbxMenuCSS});
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
		if(vo && vo.noticeList)
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
		var css,w=100,h=50;
		for(var i=0; i<3; i++)
		{
			css={type:"text",pos:[w/2,h/2,0],w:w,h:h,text:"test",anchor_h:1,anchor_v:1,align_h:1,align_v:1};
			this.lbxMenu.addItem(css);
		}
		this.onMenuClk(2,0,1,0);//msg,key,way,extra

		var textLib=this.appEnv.textLib;
		this.dlgTitle._setText(textLib.Notice);
	};
	__Page.dlgNotice.aisUpdateView=function()
	{

	};
	__Page.dlgNotice.analyzeNotice=function(msg)
	{
		if(!msg)return [];
		return msg.split("$");
	};
	__Page.dlgNotice.getColorTextCSS=function(msg)
	{
		if(!msg || !msg.length)return [];
		if(msg.length==1)return [{text:msg[0],r:255,g:255,b:255}];
		var i,color,vo=[];
		for(i=0;i<msg.length;i+=2)
		{
			if(!msg[i+1])break;
			vo.push({text:msg[i+1],css:fromJSON(msg[i])});
		}
		return vo;
	};
	__Page.dlgNotice.showNotice=function(idx)
	{
		var vo, msg;
		if(this.infoVO && this.infoVO.length && this.infoVO[i])
		{
			vo=this.infoVO[i];
			if(!vo.analyzed)
			{
				msg=this.analyzeNotice(vo.content);
				msg=this.getColorTextCSS(msg);
				vo.content=msg;
				vo.analyzed=1;
			}
			if(vo.contents.indexOf("http://")>-1)
			{
			//	this.noticeKey.setDisplay(1);
				this.noticeURL=vo.contents;
			}
			this.noticeText.setText(vo.contents+"\r\n"+vo.createTime);
		//	this.noticeText.setTextEx([{text:"aaa",r:100,g:100,b:100,a:255},{text:"bbb",r:200,g:100,b:100,a:255},{text:"ccc",r:100,g:200,b:100,a:255},{text:"\nddd",r:100,g:100,b:200,a:255}]);
			this.data.readNoticeById(vo.id);
		}
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
		__Page.dlgNotice.onMenuClk=function(msg,key,way,extra)
		{
			if(1==way && 2==msg)
			{
				DBOut("onMenuClk");
				this.showNotice(extra);
			}
		};
	}
}
