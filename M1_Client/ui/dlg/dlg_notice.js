if(!__Page.dlgNotice)
{
	__Page.dlgNotice=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgNotice;
	__Page.dlgNotice.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var appEnv=this.appEnv;
		var imgLib=this.page.imgLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;

		//标签栏
		var menuW=178, menuH=140;
		this.menuW=170, this.menuH=134, this.menuX=menuW/2, this.menuY=menuH/2;
		var topListX=cntInner[0], topListY=cntInner[1]/2, topListW=cntW-topListX*2, topListH=menuH;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMenuClk);
		this.lbxMenuCSS={type:"listbox",id:"lbx-menu",pos:[topListX,topListY,0],w:topListW,h:topListH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,key:keyid,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,//hot_item:0,
			item_w:menuW,item_h:menuH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:0.9,item_size_check:1.2,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		this.lbxBgCSS={type:"div3x3",pos:[topListX,topListY,0],w:topListW,h:topListH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,face_g:0,face_a:0,css:imgLib.getImg("box_green")};
		//信息区域内的文字
		var subCntTxtX=cntInner[0], subCntTxtY=topListY+topListH+10, subCntTxtW=cntW-subCntTxtX*2, subCntTxtH=cntH-subCntTxtY-cntInner[1]+2;
		this.subCntTxtCSS={id:"subCntTxt",type:"memo",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,align_h:0,align_v:0,wrap:1,font_size:FS.XL,color_r:10,color_g:10,color_b:10};
		this.subCntKeyCSS={id:"subCntKey",type:"key",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,display:0};
		var dtW=8, dtH=8, cntBgX=subCntTxtX-dtW/2, cntBgY=subCntTxtY-dtH/2, cntBgW=subCntTxtW+dtW, cntBgH=subCntTxtH+dtH;
		this.cntBgCSS={type:"div3x3",pos:[cntBgX,cntBgY,0],w:cntBgW,h:cntBgH+6,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_dlgcontent"),ui_event:1,sub_event:1,face_g:0,face_a:255};
		pic=imgLib.getImg("arrow_up");
		var sx=subCntTxtW-pic.w+20;
		this.sIconCSS_u={type:"icon",pos:[sx,0,0],anchor_h:2,anchor_v:0,css:pic};
		pic=imgLib.getImg("arrow_down");
		this.sIconCSS_d={type:"icon",pos:[sx,subCntTxtH+6,0],anchor_h:2,anchor_v:2,css:pic};
	};
	__Page.dlgNotice.init=function(appEnv)
	{
		this.name="dlgNotice";
		this.viewId="dlgNotice";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.infoVO=[];

		this.lbxBg=this.cntBox.appendNewChild({css:this.lbxBgCSS});
		this.lbxMenu=this.cntBox.appendNewChild({css:this.lbxMenuCSS});
		this.cntBg=this.cntBox.appendNewChild({css:this.cntBgCSS});
		this.noticeText=this.cntBox.appendNewChild({css:this.subCntTxtCSS,line_h:28,ui_event:1,show_fx:1,end_gap:0,
		//	text:""
		});
		this.sIconU=this.noticeText.appendNewChild({css:this.sIconCSS_u});
		this.sIconD=this.noticeText.appendNewChild({css:this.sIconCSS_d});
		this.noticeText.setSideIcon(0,this.sIconU);
		this.noticeText.setSideIcon(1,this.sIconD);

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
		{
			this.infoVO=vo.noticeList;
			if(!vo.noticeOrder)
			{
				this.infoVO.sort(function(a,b){return a.seq-b.seq;});
				vo.noticeOrder=1;
			}
		}
	//	DBOut("+++this.infoVO="+toJSON(this.infoVO));

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
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var css,w=this.menuW,h=this.menuH,x=this.menuX,y=this.menuY;
		for(var i=0; i<this.infoVO.length; i++)
		{
			css={type:"div3x3",pos:[x,y,0],w:w,h:h,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_shopitem"),ui_event:1,items:[
				{type:"icon",id:"light",pos:[0,0,0],w:w,h:h,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_backlight"),color_a:128},
				{type:"icon",id:"catalog",pos:[0,0,0],w:h,h:h,anchor_h:1,anchor_v:1,css:imgLib.getIcon("notice_"+this.infoVO[i].icon,128)},
				{type:"div3x3",id:"sel",pos:[0,0,0],w:w+20,h:h+20,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_sel"),display:0},
			//	{type:"text",pos:[0,0,0],w:w,h:h,text:this.infoVO[i].title,anchor_h:1,anchor_v:1,align_h:1,align_v:1},
				{css:cssLib.textFineMid.createCSS([0,0,0],this.infoVO[i].title,w,h-20,1,1,1,2)}
			]};
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
		return msg.split("#$#");
	};
	__Page.dlgNotice.getColorTextCSS=function(msg)
	{
		if(!msg || !msg.length)return [];
		if(msg.length==1)return [{text:msg[0],r:0,g:0,b:0}];
		var i,j,color,subMsg,vo=[];
		for(i=0;i<msg.length;i++)
		{
			subMsg=msg[i].split("##");
			if(1==subMsg.length)
			{
				vo.push({text:subMsg[0]});
			}
			else if(2==subMsg.length)
			{
			//	subMsg[0]+="xxx";
			//	color=fromJSON(subMsg[0]);
				color=fromjson(subMsg[0]);
				if(!color)
				{
					color={r:150,g:150,b:150};
				}
				vo.push({text:subMsg[1],css:color});
			}
			else
			{
				vo.push({text:msg,r:150,g:150,b:150});
			}
		}
		return vo;
	};
	__Page.dlgNotice.showNotice=function(idx)
	{
		if(idx==this.curIdx)return;
		if(idx>=this.lbxMenu.getItemNum())return;
		if(this.curIdx>=0)
		{
			this.lbxMenu.itemAt(this.curIdx).getItemById("sel").setDisplay(0);
		}
		this.noticeText.showLine(0);
		this.curIdx=idx;
		var curSel=this.lbxMenu.itemAt(this.curIdx).getItemById("sel");
		curSel.setDisplay(1);
		this.appEnv.addLoopScale(curSel,0.22,{minX:0.95,minY:0.95,maxX:1.0,maxY:1.0});
		var vo, msg, i;
		if(this.infoVO && this.infoVO.length && this.infoVO[idx])
		{
			vo=this.infoVO[idx];
			if(!vo.analyzed)
			{
			//	vo.contents="{r:100,g:100,b:100,a:100}$"+vo.contents+"$";
				msg=this.analyzeNotice(vo.contents);
				msg=this.getColorTextCSS(msg);
				vo.contents=msg;
				vo.analyzed=1;
			}
			if(vo.contents.indexOf("http://")>-1)
			{
			//	this.noticeKey.setDisplay(1);
				this.noticeURL=vo.contents;
			}
		//	this.noticeText.setText(vo.contents+"\r\n"+vo.createTime);
			this.noticeText.setTextEx(vo.contents.concat([{text:"\r\n\r\n"+vo.createTime}]));//,r:0,g:0,b:0,a:200
		//	this.noticeText.setTextEx([{text:"aaa",r:100,g:100,b:100,a:255},{text:"bbb",r:200,g:100,b:100,a:255},{text:"ccc",r:100,g:200,b:100,a:255},{text:"\nddd",r:100,g:100,b:200,a:255}]);
			this.data.readNoticeById(vo.id);
			for(i=0; i<this.infoVO.length; i++)
			{
				this.data.readNoticeById(this.infoVO[i].id);
			}
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
