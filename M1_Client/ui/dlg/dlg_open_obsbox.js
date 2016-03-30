if(!__Page.dlgOpenObsBox)
{
	__Page.dlgOpenObsBox=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,7);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgOpenObsBox;
	__Page.dlgOpenObsBox.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//上部文字
		var txtX=cntInner[0], txtY=8, txtW=cntW-txtX*2, txtH=50;
		this.descTxtCSS={id:"gain-txt",css:cssLib.textFineMid.createCSS([txtX,txtY,0],textLib["GainSurpriseDesc"],txtW,txtH,0,0,0,0),wrap:1};
		//奖励区域
		var subW=100, subH=100, iconSize=80;
		var gBoxX=txtX, gBoxY=txtY+txtH, gBoxW=cntW-gBoxX*2, gBoxH=126;
		this.gBoxCSS={id:"gBox-box",type:"div3x3",pos:[gBoxX,gBoxY,0],w:gBoxW,h:gBoxH,css:imgLib.getImg("box_green"),ui_event:1};
		var gainX=gBoxW/2, gainY=subH/2;
		this.gainBgCSS={id:"gain-bg",type:"icon",pos:[gainX,gainY,0],css:imgLib.getImg("pic_goldlight"),anchor_h:1,anchor_v:1};
		//单个奖品css
		var self=this;
		this.itemCSS={
			createCSS:function()
			{
				var css={type:"icon",pos:[gainX,gainY,0],anchor_h:1,anchor_v:1,w:subW,h:subH,css:imgLib.getImg("pic_box_normal"),ui_event:1,
					items:[
						{id:"Icon",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,w:iconSize,h:iconSize,tex:imgLib.genIconPath("oil",256),tex_u:0,tex_v:0,tex_w:1,tex_h:1,filter:1},
						{id:"Name",type:"text",css:cssLib.textFineMid.createCSS([0,70,0],"???",subW,subH,1,1,1,1),font_size:FS.FM},
					],
					dlg:self,appEnv:appEnv,update:this.update,
				};
				return css;
			},
			update:function(vo)
			{
			//	DBOut("=== update:"+toJSON(vo));
				var itemIcon=this.getItemById("Icon");
				var nameTxt=this.getItemById("Name");

				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var page=appEnv.page;
				var imgLib=page.imgLib;

				var picNormal=imgLib.getImg("pic_box_normal");
				var picRare=imgLib.getImg("pic_box_rare");
				var curPic=picNormal;
				if(vo)
				{
					var resURL, name, q="";
					var info=appEnv.getItemInfo(vo);
					resURL=info.url;
					name=info.name;
					if(info.q>0)
						q="("+appEnv.getAddOnLv(info.q)+")";
					itemIcon.setTexURL(resURL);
					nameTxt._setText(name+q+"x"+vo.num);
					if(vo["rare"])
					{
						curPic=picRare;
					}
					else
					{
						curPic=picNormal;
					}
					this.setW(curPic.w);
					this.setH(curPic.h);
					this.setTexUV([curPic.tex_u,curPic.tex_v,curPic.tex_w,curPic.tex_h]);
				}
				else
				{
					
				}
			}
		};
		//确认按钮
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onOkClk);
		var btnX=cntW/2, btnY=gBoxY+gBoxH+46;
		this.btnCSS=cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["Confirm"]);
	};
	__Page.dlgOpenObsBox.init=function(appEnv)
	{
		this.name="dlgOpenObsBox";
		this.viewId="dlgOpenObsBox";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.dlgFrame.removeChild(this.dlgTitle);
		this.dlgFrame.removeChild(this.btnClose);
		this.dlgFrame.removeChild(this.btnBack);
		this.dlgFrame.removeChild(this.contentField);
	//	this.dlgFrame.setColor([255,255,255,0]);
		this.centerFrame=this.dlgFrame.appendNewChild({type:"icon",id:"centerFrame",pos:[this.dlgW/2,this.dlgH/2,0],anchor_h:1,anchor_v:1,ui_event:1});
		this.newFrame=this.centerFrame.appendNewChild({type:"icon",id:"newDlgFrame",pos:[-this.dlgW/2,-this.dlgH/2,0],css:[this.dlgFrameCSS]});
		//对话框标题:
		this.dlgTitle=cssLib.textFineBig.create(this.newFrame,[this.titleX,this.titleY,0],textLib["Battle Shop"],this.titleW,this.titleH,1,1,1,1);
		//内容区域
		this.contentField=this.newFrame.appendNewChild({css:[this.contentFieldCSS]});
		this.cntBox=this.contentField;
		//关闭对话框的按钮:
		this.btnCloseKeyId=keyid=appEnv.appKeys.btnClose;
		this.btnClose=cssLib.btnCloseDlg.create(this.newFrame,[this.closeBtnX,this.closeBtnY,0],keyid);
		this.regKeyVO(keyid,this,this.onCloseClk);
	};
	__Page.dlgOpenObsBox.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;

		if(vo)
		{
			this.aisBld=vo.aisBld;
			this.bldLevel=vo.aisLevel;
			this.levels=vo.aisDef.levels;
			this.curLevel=this.levels[this.bldLevel];
			this.boxInfo=this.aisBld.boxInfo;
			this.rewardReq=this.aisBld.rewardReq;
		}

		this.dlgTitle._setText(textLib["GainSurprise"]);
		this.dlgFrame.setDisplay(0);
		this.hold=1;
		this.initTreasureBox();
		appEnv.setDlgAniCall(function(){
			this.descTxt=this.cntBox.appendNewChild({css:this.descTxtCSS});
			this.gainBox=this.cntBox.appendNewChild({css:this.gBoxCSS});
			this.gainBg=this.gainBox.appendNewChild({css:this.gainBgCSS});
			this.gainItem=this.gainBox.appendNewChild({css:this.itemCSS.createCSS()});
			this.btnOk=this.cntBox.appendNewChild({css:[this.btnCSS]});

			var scrW=appEnv.scrSize[0], scrH=appEnv.scrSize[1];
			this.dlgFrame.setFadePos([scrW/2,scrH/2,0]);
			this.dlgFrame.setFadeSize(0);
			if(this.rewardReq && this.rewardReq[0])
				this.gainItem.update(this.rewardReq[0]);
//			appEnv.hudIn(this.dlgFrame,10,function(){
//				appEnv.addZoomScale(this.centerFrame,[1.0,1.0,1.0],[1.1,1.1,1.0],0.3);
//			},this);
//			this.hold=0;
		},this,0,0);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};
	__Page.dlgOpenObsBox.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.dlgLayer.removeHudItem(this.tBoxBg);
		appEnv.clearDlgAniCall();
	};
	__Page.dlgOpenObsBox.initTreasureBox=function()
	{
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var layer=appEnv.dlgLayer;
		//礼盒
		var scrW=appEnv.scrSize[0], scrH=appEnv.scrSize[1];
		var x=scrW/2, y=scrH/2+100;
		var picT=imgLib.getImg("pic_treasure"), picC=imgLib.getImg("pic_treasurcovere");
		this.tBoxBg=layer.addHudItem({id:"treasuer-bg",type:"icon",pos:[x,y+picT.h/2,0],w:picT.w,h:picT.h,anchor_h:1,anchor_v:2,fade:1,fade_size:1,fade_alpha:0,fade_pos:[x,y-300,0],display:1});
		var tBox=this.tBox=this.tBoxBg.appendNewChild({id:"treasuer",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:2,css:picT,fade:1,fade_size:1,fade_alpha:0,fade_pos:[0,300,0]});
		var tCover=this.tCover=this.tBoxBg.appendNewChild({id:"cover",type:"icon",pos:[17.5,-picT.h-38,0],anchor_h:1,anchor_v:1,css:picC,fade:1,fade_size:1,fade_alpha:0,fade_pos:[17.5,-picT.h-38-300,0]});
		var self=this;
		appEnv.hudIn(this.tBoxBg,15,function(){
			appEnv.addZoomScale(this.tBoxBg,[1.0,1.0,1.0],[1.1,1.1,1.0],0.28);
			var scaleAni=this.tBoxBg.scaleAni;
			scaleAni.onAniDone=function()
			{
				DBOut("ani done");
				appEnv.hudOut(tBox,15);
				appEnv.hudOut(tCover,15);

				appEnv.hudIn(self.dlgFrame,15,function(){
					appEnv.addZoomScale(self.centerFrame,[1.0,1.0,1.0],[1.1,1.1,1.0],0.3);
				},self);
				self.hold=0;
			}
		},this);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgOpenObsBox.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
	}
}
