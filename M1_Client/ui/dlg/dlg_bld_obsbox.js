if(!__Page.dlgBldObsBox)
{
	__Page.dlgBldObsBox=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,2);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgBldObsBox;
	__Page.dlgBldObsBox.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//上部文字
		var txtX=cntInner[0], txtY=8, txtW=cntW, txtH=30;
		this.gainTxtCSS={id:"gain-txt",css:cssLib.textFineMid.createCSS([txtX,txtY,0],textLib["MayGain"],txtW,txtH,0,0,0,0)};
		//奖励列表区域
		pic=imgLib.getImg("pic_backlight");
		var topH=pic.h;
		var gBoxX=txtX, gBoxY=txtY+txtH, gBoxW=cntW-gBoxX*2, gBoxH=116;
		this.gBoxCSS={id:"gBox-box",type:"div3x3",pos:[gBoxX,gBoxY,0],w:gBoxW,h:gBoxH,css:imgLib.getImg("box_dlgcontent"),ui_event:1};
		//
		var itemW=116, itemH=100, subW=100, subH=itemH, iconSize=80;
		var listX=30, listY=gBoxH/2, listW=gBoxW-listX*2, listH=gBoxH;
		this.lbxGainCSS={type:"listbox",id:"lbx-gain",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:1,ui_event:1,sub_event:1,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		//信息区域
		pic=imgLib.getImg("box_dlgcontent");
		var subCntX=this.subCntX=cntInner[0];
		var subCntY=this.subCntY=cntInner[1]+topH+dt;
		var subCntW=this.subCntW=cntW-cntInner[0]*2;
		var subCntH=this.subCntH=cntH-cntInner[1]*2-topH-dt;
		this.subCntFieldCSS={id:"subCntField",type:"div3x3",pos:[subCntX,subCntY,0],w:subCntW,h:subCntH,css:pic,ui_event:1,items:[]};
		var subCntInner=this.subCntInner=[pic.mgL,pic.mgU];
		//信息区域内的文字
		var subCntTxtX=this.subCntTxtX=subCntInner[0];
		var subCntTxtY=this.subCntTxtY=subCntInner[1];
		var subCntTxtW=this.subCntTxtW=subCntW-subCntInner[0]*2;
	//	var subCntTxtH=this.subCntTxtH=subCntH-subCntInner[1]*2;
		var subCntTxtH=this.subCntTxtH=10;
		this.subCntTxtCSS={id:"subCntTxt",type:"text",pos:[subCntTxtX,subCntTxtY,0],w:subCntTxtW,h:subCntTxtH,anchor_v:1,align_h:0,align_v:0,wrap:1,font_size:FS.M,color_r:10,color_g:10,color_b:10};

		//单个奖品css
		var self=this;
		this.itemCSS={
			createCSS:function()
			{
				var css={type:"icon",pos:[subW/2,listH/2,0],anchor_h:1,anchor_v:1,w:subW,h:subH,css:imgLib.getImg("pic_box_normal"),ui_event:1,
					items:[
						{id:"Icon",type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,w:iconSize,h:iconSize,tex:imgLib.genIconPath("oil",256),tex_u:0,tex_v:0,tex_w:1,tex_h:1,filter:1},
						{id:"Name",type:"text",css:cssLib.textFineMid.createCSS([0,0,0],"???",subW,subH,1,1,0,0),font_size:FS.M,wrap:1},
						{id:"Num",type:"text",css:cssLib.textFineMid.createCSS([0,0,0],"???",subW,subH,1,1,2,2),font_size:FS.M},
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
				var numTxt=this.getItemById("Num");

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
					nameTxt._setText(name+q);
					numTxt._setText("x"+vo.num);
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
	};
	__Page.dlgBldObsBox.init=function(appEnv)
	{
		this.name="dlgBldObsBox";
		this.viewId="dlgBldObsBox";
		this.page.dlgBase.prototype.init.call(this,appEnv);
	};
	__Page.dlgBldObsBox.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var textLib=appEnv.textLib;

		this.dlgTitle._setText(textLib["SurpriseObs"]);
		if(vo)
		{
			this.aisBld=vo.aisBld;
			this.bldLevel=vo.aisLevel;
			this.levels=vo.aisDef.levels;
			this.curLevel=this.levels[this.bldLevel];
			this.boxInfo=this.aisBld.boxInfo;
			this.boxId=this.aisBld.boxId;
			if(this.boxId)
			{
				this.boxDef=window.aisEnv.defLib.box[this.boxId];
				this.dlgTitle._setText(this.boxDef["name"]);
			}
		}

		appEnv.setDlgAniCall(function(){
			this.gainTxt=this.cntBox.appendNewChild({css:this.gainTxtCSS});
			this.gainBox=this.cntBox.appendNewChild({css:this.gBoxCSS});
			this.lbxGain=this.gainBox.appendNewChild({css:this.lbxGainCSS});
			this.subCntField=this.cntBox.appendNewChild({css:[this.subCntFieldCSS]});
			this.subText=this.subCntField.appendNewChild({css:[this.subCntTxtCSS]});

			this.initUI();
		},this,0,0);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};
	__Page.dlgBldObsBox.leave=function(nextState)
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
		appEnv.clearDlgAniCall();
	};
	__Page.dlgBldObsBox.initUI=function()
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		this.subText.setText(textLib["SurpriseObs"]);
		if(this.boxDef)
			this.subText.setText(this.boxDef["desc"]);
		this.initStoreLbx();
	};
	__Page.dlgBldObsBox.initStoreLbx=function()
	{
		var list=window.aisEnv.defLib.box["box1"]["boxs"];
		if(this.boxInfo)
			list=this.boxInfo;
		var i, idx, hud;
		for(i=0; i<list.length; i++)
		{
			idx=this.lbxGain.addItem(this.itemCSS.createCSS());
			hud=this.lbxGain.itemAt(idx);
			hud.update(list[i]);
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgBldObsBox.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
	}
}
