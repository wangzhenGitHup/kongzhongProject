if(!__Page.dlgVip)
{
	__Page.dlgVip=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgVip;
	__Page.dlgVip.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		var listX=this.listX=cntInner[0]/2;
		var listY=this.listY=cntInner[1]/2 +3;
		var listW=this.listW=300;
		var listH=this.listH=cntH-listY*2;
		var itemW=this.itemW=listW;
		var itemH=this.itemH=90;
		this.listCSS={type:"listbox",id:"lbx-vip",pos:[listX,listY,0],w:listW +10,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:0.95,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=this.itemX=itemW/2 +5;
		var itemY=this.itemY=itemH/2;
		var pic=imgLib.getImg("box_achieve");
		var centerW=this.centerW=itemW;
		var centerH=this.centerH=86;
		var centerX=this.centerX=-centerW/2;
		var centerY=this.centerY=-centerH/2;
		var centerInner=this.centerInner=[pic.mgL,pic.mgU];

		var dlg=this;
		pic=imgLib.getImg("pic_VIP1");
		var iconX=54, iconY=centerH/2, lineX=iconX*2, lineY=centerH/2, txtW=centerW-lineX, txtH=centerH;
		this.itemCSS={
			createCSS:function(lvVO)
			{
				var vipIcon=imgLib.getImg("pic_VIP"+lvVO["title"]);
				var t=10;
				var css={type:"icon",pos:[itemX,itemY,0],w:itemW,h:itemH,anchor_h:1,anchor_v:1,vo:lvVO,items:[
					{type:"div3x3",pos:[centerX,centerY,0],w:centerW,h:centerH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_achieve"),items:[
						{id:"self",type:"div3x3",pos:[0,0,0],w:centerW,h:centerH,css:imgLib.getImg("box_self"),display:lvVO["title"]==dlg.vipLevel?1:0},
						{id:"gain",type:"icon",pos:[0,0,0],css:imgLib.getImg("pic_passed"),display:lvVO["title"]<=dlg.vipLevel?1:0},
						{id:"vip",type:"icon",pos:[iconX,iconY,0],css:vipIcon,anchor_h:1,anchor_v:1},
						{type:"div3x3",pos:[lineX,lineY-2,0],h:centerH-10,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_line")},
						{css:cssLib.textFineBig.createCSS([lineX,0,0],lvVO.name,txtW,txtH,0,0,1,1)},
						{id:"sel",type:"div3x3",pos:[-t,-t,0],w:centerW+t*2,h:centerH+t*2,css:imgLib.getImg("box_sel"),display:0},
					]}
				],
				setSel:this.setSel,clearSel:this.clearSel
				};
				return css;
			},
			setSel:function()
			{
				this.getItemById("sel").setDisplay(1);
			},
			clearSel:function()
			{
				this.getItemById("sel").setDisplay(0);
			}
		};

		var rx=listX+listW+8 +5, rw=cntW-rx-listX -5;
		var rcX=16, rcY=16, rcW=rw-rcX*2;

		var rtY=listY, rtH=186, lineH=32, lineDT=12;
		var lvY=rcY+lineH/2, expY=lvY+lineDT+lineH, nextY=expY+lineDT+lineH, barX=rcX+appEnv.getTextSize(textLib["ToNextLv"],FS.FM).w, barY=nextY+lineH;
		pic=imgLib.getImg("btn_green_u");
		var btnX=rw-rcX-pic.w/2, btnY=rcY+pic.h/2;
		this.rtBoxCSS={
			createCSS:function(lv,curExp,nextExp,realExp,keyid)
			{
				var css={id:"box-rt",type:"div3x3",pos:[rx,rtY,0],w:rw,h:rtH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_achieve"),ui_event:1,items:[
					{id:"lv",css:cssLib.iconText.createCSS([rcX,lvY,0],imgLib.getImg("pic_VIP"+lv),textLib["CurVipLv"],2,"",FS.FM),display:lv?1:0},
					{id:"lv0",css:cssLib.textFineMid.createCSS([rcX,lvY,0],textLib["CurVipLv"]+textLib["None"],rw,lineH,0,1,0,1),display:lv?0:1},
					{id:"exp",css:cssLib.textFineMid.createCSS([rcX,expY,0],textLib["VipExp"]+realExp,rw,lineH,0,1,0,1)},
					{id:"next",css:cssLib.textFineMid.createCSS([rcX,nextY,0],textLib["ToNextLv"]+curExp+"/"+nextExp,rw,lineH,0,1,0,1)},
					{id:"bar",css:cssLib.boxAchBar.createCSS([barX,barY,0],curExp,nextExp,1)},
					{id:"btn",css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["QuickRecharge"]),display:window.aisGame.bVisit?0:1}
				]}
				return css;
			}
		};

		var rbY=rtY+rtH+8, rbH=cntH-rbY-listY;
		var vipY=rcY+lineH/2, iconBoxX=rcX+appEnv.getTextSize(textLib.getTextEx("VipPrivilege",{level:1}),FS.FM).w, iconBoxY=vipY, descY=vipY+lineDT+lineH/2, descH=rbH-rcY*2-lineH-lineDT;
		this.rbBoxCSS={
			createCSS:function(lv,desc,list)
			{
				var items=[], x, i, iconSize=32, dt=10;
				items=this.getIconList(list);
				var css={id:"box-rb",type:"div3x3",pos:[rx,rbY,0],w:rw,h:rbH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_achieve"),ui_event:1,items:[
					{id:"tq",css:cssLib.textFineMid.createCSS([rcX,vipY,0],textLib.getTextEx("VipPrivilege",{level:lv}),rw,lineH,0,1,0,1)},
					{id:"iconBox",type:"icon",pos:[iconBoxX,iconBoxY,0],anchor_h:0,anchor_v:1,items:items},
					{id:"desc",type:"memo",pos:[rcX,descY,0],w:rcW,h:descH,align_h:0,align_v:0,wrap:1,font_size:FS.L,color_r:10,color_g:10,color_b:10,
						line_h:23,ui_event:1,show_fx:1,end_gap:0,text:"aa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa"
					},
				],
				getIconList:this.getIconList,update:this.update
				}
				return css;
			},
			getIconList:function(list,hud)
			{
				var items=[], x, i, iconSize=32, dt=10, item;
				if(list && list.length)
				{
					for(i=0; i<list.length; i++)
					{
						x=iconSize/2+(iconSize+dt)*i;
						item={type:"icon",pos:[x,0,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon(list[i]),w:iconSize,h:iconSize};
						items.push(item);
						if(hud)
							hud.appendNewChild(item);
					}
				}
				return items;
			},
			update:function(lv,desc,list)
			{
				this.getItemById("tq").setText(textLib.getTextEx("VipPrivilege",{level:lv}));
				var iconBox=this.getItemById("iconBox");
				iconBox.removeAllChild();
				this.getIconList(list,iconBox);
				this.getItemById("desc").setText(desc);
			}
		}
	};
	__Page.dlgVip.init=function(appEnv)
	{
		this.name="dlgVip";
		this.viewId="dlgVip";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.curIdx=-1;
	};

	__Page.dlgVip.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		var i,achs,ach,def,level,bonusRcved,levelVO,icon,star,starDark,items=[];
		var dt=this.dt,dt2=this.dt*2,iconW=64;;

		//根据VO初始化界面:
		this.vipLevel=window.aisGame.curCity.vipLevel;
		if(!this.vipLevel)this.vipLevel=0;
		this.curExp=window.aisGame.curCity.vipExp;
		if(!this.curExp)this.curExp=0;
		var expInfo=appEnv.getVipExp();

		vo=window.aisEnv.defLib.vipPrivilege["VIPLevels"];
		this.infoVO=vo;
	//	this.timer=setFrameout(window.DelayLoad,function(){
		appEnv.setDlgAniCall(function(){
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onVipClk);
			this.lbxVip=this.cntBox.appendNewChild({css:this.listCSS,key:keyid});
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onChargeClk);
			this.rtBox=this.cntBox.appendNewChild(this.rtBoxCSS.createCSS(this.vipLevel,expInfo.cur,expInfo.next,expInfo.real,keyid));
			this.rbBox=this.cntBox.appendNewChild(this.rbBoxCSS.createCSS(1,"????",["ach_npcstars","ach_npcstars","ach_npcstars","ach_npcstars"]));
			if(vo)
			{
				var i,hud,info;
				for(i=0; i<vo.length-1; i++)
				{
					this.lbxVip.addItem(this.itemCSS.createCSS(vo[i+1]));
				}
			}
			var idx=this.vipLevel?this.vipLevel-1:0;
			this.lbxVip.showItem(idx);
			this.onVipClk(2,0,1,idx);
			this.timer=null;
		},this);
		this.dlgTitle._setText(textLib["SuperVip"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgVip.leave=function(nextState)
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
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgVip.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//跳转到商店
		__Page.dlgVip.onChargeClk=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will open shop!");
				url=this.page.genPageURL("ui/dlg/dlg_shop.jml");
				this.appEnv.openPageDlg(url,{title:"SpecialSupply",catalog:"Gem"});
			}
		};

		//vip列表被点击
		__Page.dlgVip.onVipClk=function(msg,key,way,extra)
		{
			if(1==way && 2==msg)
			{
				DBOut("onVipClk");
				this.page.audioObject.playSound("diamonds_collect");
				if(extra==this.curIdx)return;
				var hud=this.lbxVip.itemAt(extra);
				var vo=hud.vo;
				hud.setSel();
				var info=this.appEnv.getVipInfo(vo["title"]);
				this.rbBox.update(vo["title"],info.txt,info.icon);
				if(this.curIdx>-1)
					this.lbxVip.itemAt(this.curIdx).clearSel();
				this.curIdx=extra;
			}
		};
	}
}
