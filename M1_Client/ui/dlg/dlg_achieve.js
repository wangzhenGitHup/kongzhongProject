if(!__Page.dlgAchieve)
{
	__Page.dlgAchieve=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgAchieve;
	__Page.dlgAchieve.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;

		var listX=this.listX=this.contentInner[0];
		var listY=this.listY=this.contentInner[1];
		var listW=this.listW=this.contentW-this.contentInner[0]*2;
		var listH=this.listH=this.contentH-this.contentInner[1]*2;
		var itemW=this.itemW=listW;
		var itemH=this.itemH=128;
		this.listCSS={type:"listbox",id:"lbx-ach",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=this.itemX=itemW/2;
		var itemY=this.itemY=itemH/2;
		var pic=imgLib.getImg("box_achieve");
		var centerW=this.centerW=itemW;
		var centerH=this.centerH=114;
		var centerX=this.centerX=-centerW/2;
		var centerY=this.centerY=-centerH/2;
		var centerInner=this.centerInner=[pic.mgL,pic.mgU];
		var iconW=this.iconW=64;
		var iconH=this.iconH=64;
		var iconX=this.iconX=centerInner[0]+iconW/2;
		var iconY=this.iconY=centerH/2;
		var nameW=this.nameW=286;
		var nameH=this.nameH=30+this.dt/2;
		var nameX=this.nameX=iconX+iconW/2+this.dt*2;
		var nameY=this.nameY=centerInner[1]-10;
		var descW=this.descW=335;
		var descH=this.descH=centerH-nameH;
		var descX=this.descX=nameX;
		var descY=this.descY=nameY+nameH;
		var barW=this.barW=nameW;
		var barH=this.barH=24;
		var barX=this.barX=nameX;
		var barY=this.barY=centerH-centerInner[1]/2-barH/2;

		pic=imgLib.getImg("pic_star_bg");
		var starFieldW=this.starFieldW=pic.w;
		var starFieldH=this.starFieldH=centerH;
		var starFieldX=this.starFieldX=centerW-centerInner[0]-starFieldW;
		var starFieldY=this.starFieldY=0;
		var starBgX=this.starBgX=0;
		var starBgY=this.starBgY=starFieldH-centerInner[1]/2;
		pic=imgLib.getImg("pic_backlight");
		var lightW=this.lightW=starFieldW>starFieldH?starFieldH:starFieldW;
		var lightH=this.lightH=lightW;
		var lightX=this.lightX=starFieldW/2;
		var lightY=this.lightY=starFieldH/2;
		pic=imgLib.getImg("pic_star");
		var starW=this.starW=pic.w;//大星星
		var starH=this.starH=pic.h;
		var starW_s=this.starW_s=pic.w*0.9;//小星星
		var starH_s=this.starH_s=pic.h*0.9;
		var starX_m=this.starX_m=lightX;//中间的星星
		var starY_m=this.starY_m=lightY+6;
		var starX_l=this.starX_l=starX_m-starW+6;//左边的星星
		var starY_l=this.starY_l=starY_m+2;
		var starX_r=this.starX_r=starX_m+starW-6;//右边的星星
		var starY_r=this.starY_r=starY_m+4;
		this.starCSS=imgLib.getImg("pic_star");
		this.starDarkCSS=imgLib.getImg("pic_star_dark");
		this.expX=starX_l-36;
		this.gemX=starX_r-36;

		pic=imgLib.getImg("btn_green_u");
		var compX=this.compX=starFieldX-pic.w/2-15;//barX+barW+(starFieldX-(barX+barW))/2;
		var compY=this.compY=centerH/2;//barY;
		var compW=this.compW=barW;
		var compH=this.compH=barH;
		var btnW=this.btnW=pic.w;
		var btnH=this.btnH=pic.h;
		var btnX=this.btnX=compX;
		var btnY=this.btnY=centerH-centerInner[1]/2-btnH/2-3;
	};
	__Page.dlgAchieve.init=function(appEnv)
	{
		this.name="dlgAchieve";
		this.viewId="dlgAchieve";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;
//		keyid=appEnv.hudKeys.getKey(this);
//		this.regKeyVO(keyid,this,this.onAchClk);
		this.lbxAch=this.cntBox.appendNewChild({css:this.listCSS,key:keyid});
	};

	__Page.dlgAchieve.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var i,achs,ach,def,level,bonusRcved,levelVO,icon,star,starDark,items=[];
		var dt=this.dt,dt2=this.dt*2,iconW=64;;

		//根据VO初始化界面:
		this.infoVO=vo;
		this.achKeys={};
	//	for(i in vo.achvmnts.goldstoragelevel)DBOut(i+":"+vo.achvmnts.goldstoragelevel[i]);
	//	this.timer=setFrameout(window.DelayLoad,function(){
		appEnv.setDlgAniCall(function(){
			if(vo)
			{
				var achs=this.achvmnts=vo.achvmnts;
				var expIcon=imgLib.getIcon("level",64);
				var gemIcon=imgLib.getIcon("res_gem",64);
				var tokIcon=imgLib.getIcon("res_chip",64);
				expIcon.w=expIcon.h=gemIcon.w=gemIcon.h=tokIcon.w=tokIcon.h=32;
				star=imgLib.getImg("pic_star");
				starDark=imgLib.getImg("pic_star_dark");
				var btnDisp=0,barDisp,keyid=0;
				var starScore,gainExp,gainGem,gainTok,gainNum;
				for(i in achs)
				{
					ach=achs[i];
					def=ach.def;
					level=ach.level;
					bonusRcved=ach.bonusRcved;
					if("91"==window.ChannelType && "bindemail"==def.codeName)
						continue;
					if("chargemoney"==def.codeName || "bindemail"==def.codeName)
					{
						DBOut("level="+level+", bonus="+bonusRcved);
						if(level>0)
						{
							level=3;
							if(0==bonusRcved)
							{
								bonusRcved=2;
							}
							else if(1==bonusRcved)
							{
								bonusRcved=3;
							}
						}
						DBOut("level="+level+", bonus="+bonusRcved);
					}
					starScore=bonusRcved;
					if(0==level || (level==bonusRcved)){
						barDisp=1;
						btnDisp=0;
						keyid=0;
					}else{
						barDisp=0;
						btnDisp=1;
						keyid=appEnv.hudKeys.getKey(this);
						this.regKeyVO(keyid,this,this.onRewardClk);
						this.achKeys[""+keyid]=ach;
						starScore+=1;
					}
					if(3==bonusRcved){
						barDisp=0;
						btnDisp=0;
					}
					levelVO=def.levels[bonusRcved>2?2:bonusRcved];
					gainExp=levelVO.bonus.exp;
					gainGem=levelVO.bonus.gem;
					gainTok=levelVO.bonus.cash;
					gainCube=levelVO.bonus.cube;
					gainNum=0;
					if(gainExp)gainNum++;
					if(gainGem)gainNum++;
					if(gainTok)gainNum++;
					icon=imgLib.getIcon("ach_"+i,iconW);
					items.push({
						type:"icon",id:"item",pos:[this.itemX,this.itemY,0],w:this.itemW,h:this.itemH,anchor_h:1,anchor_v:1,ui_event:1,
						items:[
							{type:"div3x3",id:"center",pos:[this.centerX,this.centerY,0],w:this.centerW,h:this.centerH,ui_event:1,css:imgLib.getImg("box_achieve"),
								items:[
									{type:"icon",id:"bg-icon",pos:[this.iconX,this.iconY,0],w:this.iconW*1.3,h:this.iconH*1.3,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_backlight"),items:[
										{type:"icon",id:"icon",pos:[0,0,0],css:icon,anchor_h:1,anchor_v:1}]
									},
									{type:"text",id:"name",pos:[this.nameX,this.nameY,0],w:this.nameW,h:this.nameH,text:def.name,font_size:30,color_r:0,color_g:0,color_b:0,color_a:255},
									{type:"text",id:"desc",pos:[this.descX,this.descY,0],w:this.descW,h:this.descH,text:textLib.AchNeed(def.desc,levelVO.score),font_size:20,color_r:0,color_g:0,color_b:0,color_a:255,wrap:1},
									{id:"bar",css:cssLib.boxAchBar.createCSS([this.barX,this.barY,0],ach.curScore,ach.tgtScore),display:barDisp},
								//	{type:"text",id:"comp",css:cssLib.textFineMid.createCSS([this.compX,this.compY,0],textLib["AchieveComplete"],this.compW,this.compH,1,1,1,1,[255,224,100,100],1),display:bonusRcved>2?1:0},
									{type:"icon",id:"comp",pos:[this.compX,this.compY,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_compelete"),display:bonusRcved>2?1:0},
									{type:"key",id:"btn",css:cssLib.normalBtn.createCSS([this.btnX,this.btnY,0],keyid,0,textLib["ReceiveReward"]),display:btnDisp,codename:i,audio:page.audioObject.genFileURL("btn_click"),},//按钮
									{type:"icon",id:"starField",pos:[this.starFieldX,this.starFieldY,0],w:this.starFieldW,h:this.starFieldH,ui_event:1,
										items:[
											{type:"icon",id:"backlight",pos:[this.lightX,this.lightY,0],w:this.lightW,h:this.lightH,css:imgLib.getImg("pic_backlight"),anchor_h:1,anchor_v:1},
											{type:"icon",id:"exp",css:cssLib.iconText.createCSS([this.expX,this.centerInner[1]+this.dt,0],expIcon,gainExp),display:(bonusRcved>2 || !gainExp)?0:1},
											{type:"icon",id:"gem",css:cssLib.iconText.createCSS([this.gemX,this.centerInner[1]+this.dt,0],gemIcon,gainGem),display:(bonusRcved>2 || !gainGem)?0:1},
											{type:"icon",id:"tok",css:cssLib.iconText.createCSS([this.gemX,this.centerInner[1]+this.dt,0],tokIcon,gainTok),display:(bonusRcved>2 || !gainTok)?0:1},
										//	{type:"icon",id:"cube",css:cssLib.iconText.createCSS([this.gemX,this.centerInner[1]+this.dt,0],tokIcon,gainCube),display:(bonusRcved>2 || !gainCube)?0:1},
											{css:cssLib.textFineMid.createCSS([this.starX_m,this.centerInner[1]+this.dt,0],"chargemoney"==def.codeName?textLib["Bld_X1"]("DiamondMine"):textLib["EmailAch"],100,10,1,1,1,1),
												display:(("chargemoney"==def.codeName || "bindemail"==def.codeName) && bonusRcved<3)?1:0},
											{type:"icon",id:"star-bg",pos:[this.starBgX,this.starBgY,0],css:imgLib.getImg("pic_star_bg"),anchor_h:0,anchor_v:2},
											{type:"icon",id:"star-dl",pos:[this.starX_l,this.starY_l,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:starDark},
											{type:"icon",id:"star-dr",pos:[this.starX_r,this.starY_r,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:starDark},
											{type:"icon",id:"star-dm",pos:[this.starX_m,this.starY_m,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:starDark},
											{type:"icon",id:"star-l",pos:[this.starX_l,this.starY_l,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:star,display:starScore>0?1:0},
											{type:"icon",id:"star-r",pos:[this.starX_r,this.starY_r,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:star,display:starScore>2?1:0},
											{type:"icon",id:"star-m",pos:[this.starX_m,this.starY_m,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:star,display:starScore>1?1:0},
										]
									}
								]
							}
						]
					});
				}
				this.lbxAch.addItems(items);
			}
			this.timer=null;
		},this);
		this.dlgTitle._setText(textLib["Achieve"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgAchieve.leave=function(nextState)
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
		__Page.dlgAchieve.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//成就列表被点击
		__Page.dlgAchieve.onAchClk=function(msg,key,way,extra)
		{
//			if(1==way && 2==msg)
//			{
//				DBOut("onAchClk");
//			}
		};

		//领奖按钮被点击onRewardClk
		__Page.dlgAchieve.onRewardClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onRewardClk");
				var ach=this.achKeys[key];
				var def=ach.def;
				var king=aisGame.king;
				DBOut("Will get Achvmnt bonus!!"+ach);
				king.execCmd(king,"GetAvhmntBonus",{codeName:def.codeName},king);
				this.appEnv.closeDlg(null,null,0);
				var textLib=this.appEnv.textLib;
				if("chargemoney"==def.codeName || "bindemail"==def.codeName)
				{
					var title=textLib["GetDiamondMine"];
					var desc=textLib["GetDiamondGift"];
					if("bindemail"==def.codeName)
					{
						title=textLib["GetEmailAch"];
						desc=textLib["GetEmailAchGift"];
					}
					this.appEnv.showPmtDlg(this.page.pmtInfo,0,{title:title,info:desc,align:1,
						pmtFunc:function(){
						//	var url=this.page.genPageURL("ui/dlg/dlg_gifts.jml");
						//	this.appEnv.openPageDlg(url,window.aisGame.curCity.gifts);
						},pmtObj:this,pmtParam:null});
				}
			}
		};
	}
}
