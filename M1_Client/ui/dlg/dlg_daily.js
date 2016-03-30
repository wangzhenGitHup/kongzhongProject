if(!__Page.dlgDaily)
{
	__Page.dlgDaily=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgDaily;
	__Page.dlgDaily.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;

		this.topTipW=this.contentW-this.contentInner[0]*2;
		this.topTipH=48;
		this.topTipX=this.contentW/2;
		this.topTipY=35;
		this.rankBoxY=this.topTipH;

		var listX=this.listX=this.contentInner[0];
		var listY=this.listY=this.rankBoxY+this.contentInner[0];//this.contentInner[1];
		var listW=this.listW=this.contentW-this.contentInner[0]*2;
		var listH=this.listH=this.contentH-this.contentInner[1]-listY;//this.contentH-this.contentInner[1]*2;
		var itemW=this.itemW=listW;
		var itemH=this.itemH=128;
		this.listCSS={type:"listbox",id:"lbx-ach",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
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

		var star2X_l=this.star2X_l=lightX-starW/2;
		var star2X_r=this.star2X_r=lightX+starW/2;

		var star4X_1=this.star4X_1=lightX-19-38;
		var star4X_2=this.star4X_2=lightX-19;
		var star4X_3=this.star4X_3=lightX+19;
		var star4X_4=this.star4X_4=lightX+19+38;

		var starY=this.starY=lightY+6;

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
	__Page.dlgDaily.init=function(appEnv)
	{
		this.name="dlgDaily";
		this.viewId="dlgDaily";
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
		this.cntBox.appendNewChild({type:"div3x3",pos:[this.topTipX,this.topTipY,0],w:this.topTipW,h:this.topTipH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
			{type:"text",pos:[0,0,0],w:this.topTipW,h:this.topTipH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,
				text:textLib["DialyTaskTip"],font_size:FS.M,wrap:1}
		]});
		this.lbxAch=this.cntBox.appendNewChild({css:this.listCSS,key:keyid});
	};

	__Page.dlgDaily.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var i,achs,ach,def,level,bonusRcved,levelVO,icon,star,starDark,items=[],maxLv,starBox;
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
				var oilIcon=imgLib.getIcon("res_oil",64);
				var goldIcon=imgLib.getIcon("res_gold",64);
				var cashIcon=imgLib.getIcon("res_chip",64);
				var cubeIcon=imgLib.getIcon("res_cube",64);
				expIcon.w=expIcon.h=gemIcon.w=gemIcon.h=oilIcon.w=oilIcon.h=goldIcon.w=goldIcon.h=cashIcon.w=cashIcon.h=cubeIcon.w=cubeIcon.h=32;
				star=imgLib.getImg("pic_star");
				starDark=imgLib.getImg("pic_star_dark");
				var btnDisp=0,barDisp,keyid=0;
				var starScore,gain1,gain2,gainIcon1,gainIcon2,scale,j;
				for(i in achs)
				{
					ach=achs[i];
					def=ach.def;
					level=ach.level;
					bonusRcved=ach.bonusRcved;
					starScore=bonusRcved;
				//	DBOut("level="+level+", bonus="+bonusRcved);
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
					maxLv=def.levels.length;
					if(maxLv==bonusRcved){
						barDisp=0;
						btnDisp=0;
					}
					btnDisp=0;
					levelVO=def.levels[bonusRcved>(maxLv-1)?(maxLv-1):bonusRcved];
					gain1=gain2=0;
					gainIcon1=gainIcon2=expIcon
					gain1=levelVO.Reward[0];
					if(gain1)
					{
						if("Gold"==gain1.RewardType)
							gainIcon1=goldIcon;
						else if("Elixir"==gain1.RewardType)
							gainIcon1=oilIcon;
						else if("Gem"==gain1.RewardType)
							gainIcon1=gemIcon;
						else if("tok1"==gain1.RewardType)
							gainIcon1=cashIcon;
						else if("Cube"==gain1.RewardType || "cube"==gain1.RewardType)
							gainIcon1=cubeIcon;
						gain1=gain1.RewardRes;
					}
					gain2=levelVO.Reward[1];
					if(gain2)
					{
						if("Gold"==gain2.RewardType)
							gainIcon1=goldIcon;
						else if("Elixir"==gain2.RewardType)
							gainIcon1=oilIcon;
						else if("Gem"==gain2.RewardType)
							gainIcon1=gemIcon;
						else if("tok1"==gain2.RewardType)
							gainIcon1=cashIcon;
						else if("Cube"==gain1.RewardType || "cube"==gain1.RewardType)
							gainIcon1=cubeIcon;
						gain2=gain2.RewardRes;
					}
				//	DBOut("name:"+def.name+", desc:"+def.desc);
					DBOut("bonusRcved:"+bonusRcved+", maxLv:"+maxLv);

					starBox=[
						{type:"icon",id:"backlight",pos:[this.lightX,this.lightY,0],w:this.lightW,h:this.lightH,css:imgLib.getImg("pic_backlight"),anchor_h:1,anchor_v:1},
						{type:"icon",id:"exp",css:cssLib.iconText.createCSS([this.expX,this.centerInner[1]+this.dt,0],gainIcon1,gain1),display:(bonusRcved>maxLv-1 || !gain1)?0:1},
						{type:"icon",id:"gem",css:cssLib.iconText.createCSS([this.gemX,this.centerInner[1]+this.dt,0],gainIcon2,gain2),display:(bonusRcved>maxLv-1 || !gain2)?0:1},
						{type:"icon",id:"star-bg",pos:[this.starBgX,this.starBgY,0],css:imgLib.getImg("pic_star_bg"),anchor_h:0,anchor_v:2},
					];
					if(1==maxLv)
					{
						scale=1.2;
						starBox.push({type:"icon",id:"star-d",pos:[this.starX_m,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star",pos:[this.starX_m,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:star,display:starScore>0?1:0});
					}
					else if(2==maxLv)
					{
						scale=1.0;
						starBox.push({type:"icon",id:"star-2dl",pos:[this.star2X_l,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-2dr",pos:[this.star2X_r,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-2l",pos:[this.star2X_l,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:star,display:starScore>0?1:0});
						starBox.push({type:"icon",id:"star-2r",pos:[this.star2X_r,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:star,display:starScore>1?1:0});
					}
					else if(3==maxLv)
					{
						starBox.push({type:"icon",id:"star-dl",pos:[this.starX_l,this.starY_l,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-dr",pos:[this.starX_r,this.starY_r,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-dm",pos:[this.starX_m,this.starY_m,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-l",pos:[this.starX_l,this.starY_l,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:star,display:starScore>0?1:0});
						starBox.push({type:"icon",id:"star-r",pos:[this.starX_r,this.starY_r,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:star,display:starScore>2?1:0});
						starBox.push({type:"icon",id:"star-m",pos:[this.starX_m,this.starY_m,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:star,display:starScore>1?1:0});
					}
					else if(4==maxLv)
					{
						scale=0.9;
						starBox.push({type:"icon",id:"star-4d4",pos:[this.star4X_4,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-4d3",pos:[this.star4X_3,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-4d2",pos:[this.star4X_2,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-4d1",pos:[this.star4X_1,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:starDark});
						starBox.push({type:"icon",id:"star-44",pos:[this.star4X_4,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:star,display:starScore>3?1:0});
						starBox.push({type:"icon",id:"star-43",pos:[this.star4X_3,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:star,display:starScore>2?1:0});
						starBox.push({type:"icon",id:"star-42",pos:[this.star4X_2,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:star,display:starScore>1?1:0});
						starBox.push({type:"icon",id:"star-41",pos:[this.star4X_1,this.starY,0],w:this.starW*scale,h:this.starH*scale,anchor_h:1,anchor_v:1,css:star,display:starScore>0?1:0});
					}

					icon=imgLib.getIcon("daily_"+i,iconW);
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
									{type:"icon",id:"comp",pos:[this.compX,this.compY,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_compelete"),display:(bonusRcved>maxLv-1)?1:0},
									{type:"key",id:"btn",css:cssLib.normalBtn.createCSS([this.btnX,this.btnY,0],keyid,0,textLib["ReceiveReward"]),display:btnDisp,codename:i,audio:page.audioObject.genFileURL("btn_click"),},//按钮
									{type:"icon",id:"starField",pos:[this.starFieldX,this.starFieldY,0],w:this.starFieldW,h:this.starFieldH,ui_event:1,
										items:starBox/*[
											{type:"icon",id:"backlight",pos:[this.lightX,this.lightY,0],w:this.lightW,h:this.lightH,css:imgLib.getImg("pic_backlight"),anchor_h:1,anchor_v:1},
											{type:"icon",id:"exp",css:cssLib.iconText.createCSS([this.expX,this.centerInner[1]+this.dt,0],expIcon,gain1),display:(bonusRcved>2 || !gain1)?0:1},
											{type:"icon",id:"gem",css:cssLib.iconText.createCSS([this.gemX,this.centerInner[1]+this.dt,0],gemIcon,gain2),display:(bonusRcved>2 || !gain2)?0:1},
											{type:"icon",id:"star-bg",pos:[this.starBgX,this.starBgY,0],css:imgLib.getImg("pic_star_bg"),anchor_h:0,anchor_v:2},

											{type:"icon",id:"star-dl",pos:[this.starX_l,this.starY_l,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:starDark},
											{type:"icon",id:"star-dr",pos:[this.starX_r,this.starY_r,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:starDark},
											{type:"icon",id:"star-dm",pos:[this.starX_m,this.starY_m,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:starDark},
											{type:"icon",id:"star-l",pos:[this.starX_l,this.starY_l,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:star,display:starScore>0?1:0},
											{type:"icon",id:"star-r",pos:[this.starX_r,this.starY_r,0],w:this.starW_s,h:this.starH_s,anchor_h:1,anchor_v:1,css:star,display:starScore>2?1:0},
											{type:"icon",id:"star-m",pos:[this.starX_m,this.starY_m,0],w:this.starW,h:this.starH,anchor_h:1,anchor_v:1,css:star,display:starScore>1?1:0},
										]*/
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
		this.dlgTitle._setText(textLib["DailyTasks"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgDaily.leave=function(nextState)
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
		__Page.dlgDaily.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//成就列表被点击
		__Page.dlgDaily.onAchClk=function(msg,key,way,extra)
		{
//			if(1==way && 2==msg)
//			{
//				DBOut("onAchClk");
//			}
		};

		//领奖按钮被点击onRewardClk
		__Page.dlgDaily.onRewardClk=function(msg,key,way,extra)
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
			}
		};
	}
}
