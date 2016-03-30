if(!__Page.dlgMacBattleOver)
{
	__Page.dlgMacBattleOver={
		dlgPage:__Page,
		page:null,
		name:"dlgMacBattleOver",
		viewId:"dlgMacBattleOver",
		slotVsn:0,
		rmCap:0,
	};
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgMacBattleOver;
	__Page.dlgMacBattleOver.init=function(appEnv)
	{
		this.name="dlgMacBattleOver";
		this.viewId="dlgMacBattleOver";

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		page.keyStateUtil.call(this);

		var i,pic,dt,keyid=0;
		var boxw=this.dlgW=appEnv.scrSize[0];
		var boxh=this.dlgH=appEnv.scrSize[1];
		this.dlgBox=appEnv.dlgBox;
		this.dlgFrame=this.dlgBox.appendNewChild({type:"shape",pos:[0,0,0],w:boxw,h:boxh,ui_event:1,face_r:0,face_g:0,face_b:0,face_a:180});
		pic=imgLib.getImg("pic_shadow_left");
		this.dlgBox.appendNewChild({type:"icon",pos:[0,boxh,0],anchor_h:0,anchor_v:2,css:pic,color_a:200});
		pic=imgLib.getImg("pic_shadow_right");
		this.dlgBox.appendNewChild({type:"icon",pos:[boxw,boxh,0],anchor_h:2,anchor_v:2,css:pic,color_a:200});
		pic=imgLib.getImg("pic_backlight");
		var lightX=boxw/2, lightY=86, lightW=400, lightH=400;
		this.bgLight=this.dlgBox.appendNewChild({type:"icon",pos:[lightX,lightY,0],w:lightW,h:lightH,anchor_h:1,anchor_v:1,css:pic,});
		pic=imgLib.getImg("pic_battle_win");
		this.picResult=this.dlgBox.appendNewChild({type:"icon",pos:[lightX,lightY,0],anchor_h:1,anchor_v:1,css:pic,});

		var midW=640, midH=226, midX=(boxw-midW)/2, midY=lightY+pic.h/2+54;
		var dataX=midX, dataY=midY, dataW=334, dataH=midH, lineBoxH=160, lineOneH=160/4;
		var dataLineW=50, dataLineH=dataH, dataSubW=38, subX=(dataLineW-dataSubW)/2;
		this.lbxData=this.dlgBox.appendNewChild({type:"listbox",id:"lbx-data",pos:[dataX,dataY,0],w:dataW,h:dataH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:dataLineW,item_h:dataLineH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		});
		pic=imgLib.getImg("pic_line");
		var line, dt=6;
		for(i=0; i<5; i++)
		{
			line={type:"shape",pos:[0,i*lineOneH+1,0],w:dataW,h:1,face_r:255,face_g:255,face_b:255,face_a:180};
			this.lbxData.appendNewChild(line);
		}
		var columnY=lineBoxH, columnW=16;
		var numW=dataLineW, numH=14, numY=columnY+6+numH/2;
		var iconSize=dataSubW, iconY=numY+numH/2+6+iconSize/2;
		this.dataLineCSS={
			createCSS:function(vo,max)
			{
				var mx=dataSubW/2, dh=Math.floor(vo.score/max*lineBoxH);
				var css={
					type:"icon",pos:[0,0,0],w:dataLineW,h:dataLineH,anchor_h:0,anchor_v:0,items:[
						{id:"column",type:"div3x3",pos:[mx,columnY+1,0],w:columnW,h:dh,anchor_h:1,anchor_v:2,css:imgLib.getImg("box_column"),face_r:255,face_g:255,face_b:255,face_a:180},
						{id:"num",css:cssLib.textFineSmall.createCSS([mx,numY,0],vo.score,numW,numH,1,1,1,1)},
						{id:"unit",type:"icon",pos:[mx,iconY,0],w:iconSize,h:iconSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("chr_"+vo.codename,128),filter:0}
					]
				};
				return css;
			}
		};
		var subCSS;
		for(i=0; i<7; i++)
		{
			subCSS=this.dataLineCSS.createCSS({codename:"UntMarine",num:94+i},100);
			this.lbxData.addItem(subCSS);
		}

		var rx1=dataX+dataW+120, rx2=rx1+36, rx3=rx2+36, rIconSize=36;
		var dty=42, ry1=dataY+6, ry2=ry1+dty, ry3=ry2+dty, ry4=ry3+dty, ry5=ry4+dty, ry6=ry5+dty;

		var txtTotal=this.dlgBox.appendNewChild({id:"Total-txt",css:cssLib.textFineMid.createCSS([rx1,ry1,0],textLib["TotalScore1"],10,10,2,1,2,1),font_size:FS.XXL});
		var scoreTotal=this.scoreTotal=this.dlgBox.appendNewChild({id:"Total-score",css:cssLib.textFineMid.createCSS([rx3,ry1,0],"99999",10,10,0,1,0,1,[10,255,10,255]),font_size:FS.XXL});

		var txtKillNum=this.dlgBox.appendNewChild({id:"KillNum-txt",css:cssLib.textFineMid.createCSS([rx1,ry2,0],textLib["TotalKill1"],10,10,2,1,2,1),font_size:FS.L});
		var iconKillNum=this.dlgBox.appendNewChild({id:"KillNum-icon",type:"icon",pos:[rx2,ry2,0],w:rIconSize,h:rIconSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("kill",64)});
		var scoreKillNum=this.scoreKillNum=this.dlgBox.appendNewChild({id:"KillNum-score",css:cssLib.textFineMid.createCSS([rx3,ry2,0],"99999",10,10,0,1,0,1),font_size:FS.L});

		var txtKillScore=this.dlgBox.appendNewChild({id:"KillScore-txt",css:cssLib.textFineMid.createCSS([rx1,ry3,0],textLib["KillScore"],10,10,2,1,2,1),font_size:FS.L});
		var iconKillScore=this.dlgBox.appendNewChild({id:"KillScore-icon",type:"icon",pos:[rx2,ry3,0],w:rIconSize,h:rIconSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("star",64)});
		var scoreKillScore=this.scoreKillScore=this.dlgBox.appendNewChild({id:"KillScore-score",css:cssLib.textFineMid.createCSS([rx3,ry3,0],"99999",10,10,0,1,0,1),font_size:FS.L});

		var txtHPScore=this.dlgBox.appendNewChild({id:"HPScore-txt",css:cssLib.textFineMid.createCSS([rx1,ry4,0],textLib["HPScore"],10,10,2,1,2,1),font_size:FS.L});
		var iconHPScore=this.dlgBox.appendNewChild({id:"HPScore-icon",type:"icon",pos:[rx2,ry4,0],w:rIconSize,h:rIconSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("cap_hp",64)});
		var scoreHPScore=this.scoreHPScore=this.dlgBox.appendNewChild({id:"HPScore-score",css:cssLib.textFineMid.createCSS([rx3,ry4,0],"99999",10,10,0,1,0,1),font_size:FS.L});

		var txtTimeScore=this.dlgBox.appendNewChild({id:"TimeScore-txt",css:cssLib.textFineMid.createCSS([rx1,ry5,0],textLib["TimeScore"],10,10,2,1,2,1),font_size:FS.L});
		var iconTimeScore=this.dlgBox.appendNewChild({id:"TimeScore-icon",type:"icon",pos:[rx2,ry5,0],w:rIconSize,h:rIconSize,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_clock")});
		var scoreTimeScore=this.scoreTimeScore=this.dlgBox.appendNewChild({id:"TimeScore-score",css:cssLib.textFineMid.createCSS([rx3,ry5,0],"99999",10,10,0,1,0,1),font_size:FS.L});

		var txtGetRes=this.dlgBox.appendNewChild({id:"GetRes-txt",css:cssLib.textFineMid.createCSS([rx1,ry6,0],textLib["GetRes"],10,10,2,1,2,1),font_size:FS.L});
		var iconGetRes=this.iconGetRes=this.dlgBox.appendNewChild({id:"GetRes-icon",type:"icon",pos:[rx2,ry6,0],w:rIconSize,h:rIconSize,anchor_h:1,anchor_v:1,css:imgLib.getIcon("res_oil",64)});
		var scoreGetRes=this.scoreGetRes=this.dlgBox.appendNewChild({id:"GetRes-score",css:cssLib.textFineMid.createCSS([rx3,ry6,0],"99999",10,10,0,1,0,1),font_size:FS.L});

		var gainX=boxw/2, gainY=midY+midH+20, gainW=100, gainH=22;
		var gainTxt=this.dlgBox.appendNewChild({id:"Gain-txt",css:cssLib.textFineMid.createCSS([gainX,gainY,0],textLib["YouGain"],gainW,gainH,1,0,1,0)});

		var listW=508, listH=64;
		var listX=gainX, listY=gainY+gainH+20+listH/2;
		var subW=76, subH=listH, subCW=subCH=64;
		this.lbxDrop=this.dlgBox.appendNewChild({type:"listbox",id:"lbx-troop",pos:[listX,listY,0],w:listW,h:listH,anchor_h:1,anchor_v:1,ui_event:1,sub_event:1,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:1,//hot_check:1,
			item_w:subW,item_h:subH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,//clip:1,//css:imgLib.getImg("box_dlginner")
		});
		this.dropSubCSS={
			createCSS:function(vo,over)
			{
				var exPic=imgLib.getImg("pic_clearStage_s");
				var css={type:"icon",pos:[0,0,0],w:subCW,h:subCW,anchor_h:0,anchor_v:0,css:vo?appEnv.getItemIcon(vo.type,128):imgLib.getIcon("res_oil",128),items:[
					{type:"icon",pos:[subCW/2,0,0],anchor_h:1,anchor_v:1,css:exPic,display:over?1:0}
				]};
				return css;
			}
		};
		for(i=0; i<8; i++)
		{
			subCSS=this.dropSubCSS.createCSS();
			this.lbxDrop.addItem(subCSS);
		}

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onBackHomeClk);
		pic=imgLib.getImg("btn_green_u");
		var btnW=pic.w, btnH=pic.h;
		var btnX=lightX, btnY=boxh-10-btnH/2+5;
		this.btnBackHome=this.dlgBox.appendNewChild({css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["BackHome"],btnW,btnH),button:1});
	};

	__Page.dlgMacBattleOver.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.mainState=vo;
	//	this.stage=vo.stage;

		if(!vo)
		{
			vo={};
			vo.stage={
				winner:1, foeDeadNum:968, foeScore:765, macScore:652, timeScore:365, stageReward:{codename:"oil", num:1560},
				foeDeads:{
					"UntMarine":{codename:"UntMarine", num:306, score:90},"UntSniper":{codename:"UntSniper", num:256, score:190},"UntTank":{codename:"UntTank", num:216, score:260},
					"UntTNTMac":{codename:"UntTNTMac", num:190, score:110}},
				foeLoot:[{type:"gem",num:1},{type:"oil",num:999}],
				stageLoot:[{type:"gem",num:1},{type:"oil",num:999}],
			};
		}
		if(vo)
		{
			var stage=vo.stage;
			var pic=imgLib.getImg(stage.winner?"pic_battle_win":"pic_battle_lost");
			this.picResult.setTexUV([pic.tex_u,pic.tex_v,pic.tex_w,pic.tex_h]);
			this.scoreTotal._setText(stage.foeScore+stage.macScore+stage.timeScore);
			this.scoreKillNum._setText(stage.foeDeadNum);
			this.scoreKillScore._setText(stage.foeScore);
			this.scoreHPScore._setText(stage.macScore);
			this.scoreTimeScore._setText(stage.timeScore);
			var rvo=stage.stageReward;
			var res=rvo.codename;
			this.iconGetRes.setTexURL(imgLib.genIconPath("res_"+res,64));
			this.scoreGetRes._setText(rvo.num);
			var i, css, foe=stage.foeDeads, maxNum=0;
			for(i in foe)
			{
				if(foe[i].score>maxNum)
					maxNum=foe[i].score;
			}
			this.lbxData.clearItems();
			for(i in foe)
			{
				css=this.dataLineCSS.createCSS(foe[i],maxNum);
				this.lbxData.addItem(css);
			}
			this.lbxDrop.clearItems();
			var loot=stage.foeLoot;
			if(loot && loot.length)
			{
				for(i=0; i<loot.length; i++)
				{
					css=this.dropSubCSS.createCSS(loot[i]);
					this.lbxDrop.addItem(css);
				}
			}
			loot=stage.stageLoot;
			if(loot && loot.length)
			{
				for(i=0; i<loot.length; i++)
				{
					css=this.dropSubCSS.createCSS(loot[i],1);
					this.lbxDrop.addItem(css);
				}
			}

			this.bgLight.setDisplay(stage.winner?1:0);
			if(this.page.audioObject && this.page.audioObject._init)
			{
				this.page.audioObject.playMp3(stage.winner?"winwinwin":"battle_lost",0);
			}
		}

		appEnv.addRotate_z(this.bgLight,0.005);
		page.stateLogs.clearLogs();
	};

	__Page.dlgMacBattleOver.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(this.aniTimer)
		{
			clearTimeout(this.aniTimer);
			this.aniTimer=null;
		}
		if(this.longTimer)
		{
			clearTimeout(this.longTimer);
			this.longTimer=null;
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgMacBattleOver.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
			{
				DBOut("dlgMacBattleOver.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		__Page.dlgMacBattleOver.onBackHomeClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onBackHomeClk");
				if(this.aniTimer)
				{
					clearTimeout(this.aniTimer);
					this.aniTimer=null;
				}
				if(this.longTimer)
				{
					clearTimeout(this.longTimer);
					this.longTimer=null;
				}
				this.appEnv.closeDlg(null,null,0);
				if(this.mainState)
					this.mainState.go2Home();
			}
		};

		__Page.dlgMacBattleOver.onCloseClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.appEnv.closeDlg(null,null,0);
			}
		};
	}
}
