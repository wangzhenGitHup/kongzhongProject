{//玩家列表相关css
	this.MacCSS_loadUI=function()
	{
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;

		var listX=cntInner[0];
		var listY=cntInner[1];
		var listW=this.contentW-listX*2;
		var listH=this.contentH-listY*2;
		var itemW=listW;
		var itemH=128+8;
		this.lbxMacCSS={type:"listbox",id:"lbx-mac",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=itemW/2;
		var itemY=itemH/2;
		var pic=imgLib.getImg("box_achieve");
		var centerW=itemW;
		var centerH=128;
		var centerX=(itemW-centerW)/2;
		var centerY=(itemH-centerH)/2;
		var centerInner=[pic.mgL,pic.mgU];
		var dlg=this;

		var iconSize=this.iconSize=40;
		var dt1=6;
		var rankW=90, rankH=40, rankX=dt1, rankY=10+rankH/2;
	//	pic=imgLib.getImg("");
		var resultW=rankW, resultH=50, resultX=rankX, resultY=rankY+rankH/2+6;
		var lineX_l=rankX+rankW+dt1, lineY=centerInner[1]/2, lineH=centerH-lineY*2;

		var scoreBoxW=176, scoreW=scoreBoxW/2, scoreH=centerH/2, scoreX=centerW-scoreW, scoreY=scoreH/2;
		var btnW=136, btnH=58, replayX=scoreX, replayY=80;
		var lineX_r=centerW-scoreBoxW;

		var midBoxW=lineX_r-lineX_l;

		pic=imgLib.getIcon("level",64);
		pic.w=pic.h=44;
		var iconCSS_exp=pic;
		var blankW=10;
		var expW=pic.w, expH=pic.h, expX=lineX_l+dt1, expY=expH/2;

		var nameW=100, nameH=36, nameX=expX+expW+dt1, nameY=nameH/2;
		var iconCSS_info=imgLib.getImg("pic_info");
		pic=imgLib.getIcon("medal",64);
		pic.w=pic.h=iconSize;

		var resX1=lineX_r-232, resY=iconSize/2, resX2=lineX_r-116;
		var iconCSS_medals=pic;

		var clanW=100, clanH=16, clanX=nameX, clanY=nameY+nameH/2+clanH/2;

		var subH=this.subH=56;//62;
		var subCW=this.subCW=46;

		var curY=clanY+clanH/2;
		var macTxtW=expW, macTxtH=56, macTxtX=expX+expW, macTxtY=curY+(centerH-curY)/2;//expY+expH/2+dt*2+macTxtH/2;
		var macListX=nameX, macListY=macTxtY, macListW=170, macListH=macTxtH;
		var subMacW=52, subMacH=macListH, subMacCW=46;
		var lbxMacCSS={type:"listbox",id:"lbx-mac",pos:[macListX,macListY,0],w:macListW,h:macListH,anchor_h:0,anchor_v:1,ui_event:1,sub_event:1,dlg:this,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:subMacW,item_h:subMacH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0, //css:imgLib.getImg("box_dlginner"),
		};

		var rewardTxtW=macTxtW, rewardTxtH=macTxtH, rewardTxtX=macListX+macListW+rewardTxtW+dt1*4, rewardTxtY=macTxtY;
		var rewardListX=rewardTxtX+dt1, rewardListY=macTxtY, rewardListW=252, rewardListH=macTxtH;
		var subDrawW=66, subDrawH=60, subDrawCW=60;
		var lbxDrawCSS={type:"listbox",id:"lbx-reward",pos:[rewardListX,rewardListY,0],w:rewardListW,h:rewardListH,anchor_h:0,anchor_v:1,ui_event:1,sub_event:1,dlg:this,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:subDrawW,item_h:subDrawW,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0, //css:imgLib.getImg("box_dlginner"),
		};

		this.getMechIcon=function(icon)
		{
			var imgLib=this.page.imgLib;
			var list, tier={}, iconCSS={};
			if(icon && icon.indexOf("par")>-1)
			{
				list=icon.split("_");
				list[2]=list[2].replace("0","");
				tier=imgLib.getIcon("bg_tier"+list[2]+"_32");
				iconCSS=imgLib.getIcon(list[0]+"_"+list[1]+"_32");
				return {bg:tier, icon:iconCSS};
			}
		};

		this.replayKeys={};
		this.macLineCSS={
			createCSS:function(vo,rank)
			{
				var css, rankCSS, iconCSS, clanCSS, udCSS, keyID, replayCSS, keyid;
				if(rank<4){
					rankCSS=imgLib.getImg("box_clan_rank"+(rank));
				}else{
					rankCSS=imgLib.getImg("box_clan_rank4");
				}
				rankCSS=toJSON(rankCSS);
				rankCSS=fromJSON(rankCSS);
				rankCSS.w=rankW, rankCSS.h=rankH;
				clanCSS=vo.allianceId?imgLib.getIcon("badge"+vo.allianceFlag,64):imgLib.getIcon("badge1",64);
				//clanIcon=imgLib.getIcon("btn_friend",64);
				clanCSS.w=clanCSS.h=28;

//				keyID=appEnv.hudKeys.getKey(this);
//				dlg.regKeyVO(keyID,dlg,dlg.onLogClk);
//				dlg.replayKeys[""+keyID]=vo;

				var unit, spell, mech;
				var armyItems=[], replayShow=0, rewardItems=[];
				if(vo.units)
				{
					for(j=0; j<vo.units.length; j++)
					{
						unit=vo.units[j];
						armyItems.push({type:"div3x3",id:"unit-"+unit.codename,pos:[0,0,0],w:subCW,h:subH,css:imgLib["box_unit_dark"],items:[//face_r:0,face_g:0,face_b:0,face_a:160
							{type:"icon",id:"icon",pos:[0,subH-subCW,0],w:subCW,h:subCW,css:imgLib.getIcon((unit.codename.indexOf("Unt")>-1?"chr_":"spell_")+unit.codename,128),},
							{id:"num",css:cssLib.textFineSmall.createCSS([0,0,0],"x"+unit.num,subCW,subH-subCW,0,0,0,0)},
							{type:"icon",id:"LvIcon",pos:[lvW/2,subH-lvH/2,0],w:lvW,h:lvH,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_lv"+(unit.level))},
						]});
					}
				}
				if(vo.spells)
				{
					for(j=0; j<vo.spells.length; j++)
					{
						spell=vo.spells[j];
						armyItems.push({type:"div3x3",id:"spell-"+spell.codename,pos:[0,0,0],w:subCW,h:subH,css:imgLib["box_unit_dark"],items:[//face_r:0,face_g:0,face_b:0,face_a:160,
							{type:"icon",id:"icon",pos:[0,subH-subCW,0],w:subCW,h:subCW,css:imgLib.getIcon("spell_"+spell.codename,128),},
							{id:"num",css:cssLib.textFineSmall.createCSS([0,0,0],"x"+spell.num,subCW,subH-subCW,0,0,0,0)},
							{type:"icon",id:"LvIcon",pos:[lvW/2,subH-lvH/2,0],w:lvW,h:lvH,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_lv"+(spell.level))},
						]});
					}
				}
				if(vo.mechs)
				{
					var mechIcon, mechBg, mechCSS, up, down;
					var picBody=imgLib.getImg("pic_part_body"), picLeg=imgLib.getImg("pic_part_leg");
					var partX=2, partY=2, partW=picBody.w, partH=picBody.h, plvX=partX+partW, plvY=partY, plvW=subCW-partX-partW, plvH=partH, gap=partH+2;
					for(j=0; j<vo.mechs.length; j++)
					{
						mech=vo.mechs[j].up?vo.mechs[j].up:vo.mechs[j];
						up=vo.mechs[j].up?vo.mechs[j].up:vo.mechs[j];
						down=vo.mechs[j].down?vo.mechs[j].down:"";
						mechCSS=dlg.getMechIcon(mech.codename);
						if(mechCSS)
						{
							armyItems.push({type:"div3x3",id:"mech-"+mech.codename,pos:[0,0,0],w:subCW,h:subH,css:imgLib["box_unit_dark"],items:[//face_r:0,face_g:0,face_b:0,face_a:160,
								{type:"icon",id:"bg",pos:[0,0,0],w:subCW,h:subH,css:mechCSS.bg,},
								{type:"icon",id:"icon",pos:[0,subH-subCW,0],w:subCW,h:subCW,css:mechCSS.icon},
								{id:"num",css:cssLib.textFineSmall.createCSS([0,0,0],"x"+mech.num,subCW,subH-subCW,0,0,0,0),display:0},
								{type:"icon",id:"body",pos:[partX,partY,0],css:picBody,display:up?1:0},
								{id:"body-lv",css:cssLib.textFineSmall.createCSS([plvX,plvY,0],up?(up.level):"",plvW,plvH,0,0,0,1)},
								{type:"icon",id:"leg",pos:[partX,partY+gap,0],css:picLeg,display:down?1:0},
								{id:"leg-lv",css:cssLib.textFineSmall.createCSS([plvX,plvY+gap,0],down?(down.level):"",plvW,plvH,0,0,0,1)},
							]});
						}
					}
				}
				if((vo.clanFlag || vo.isClanFlag) && ((this.LogDefence==this.curLog && vo.alliance) || this.LogAttack==this.curLog))
				{
					if(this.LogDefence==this.curLog)
						clanIcon=vo.alliance.flag;
					else
						clanIcon=page.getCookie("Runtime","ClanFlag");
					armyItems.push({type:"div3x3",id:"clanFlag",pos:[0,0,0],w:subCW,h:subH,css:imgLib["box_unit_dark"],items:[//face_r:0,face_g:0,face_b:0,face_a:160,
						{type:"icon",id:"icon",pos:[0,subH-subCW,0],w:subCW,h:subCW,css:imgLib.getIcon("badge"+clanIcon,64),},
					]});
				}
			//	lbxUnits={type:"listbox",css:this.lbxTroopCSS,line_items:armyItems};
			//	DBOut("replayVersion:"+vo.replayVersion+", gVersion:"+window.aisEnv.defLib.globals["BATTLE_REPLAY_DEF_VERSION"]);
				if( ((window.KernelVersion && vo.replayVersion2==window.KernelVersion) || !window.KernelVersion) &&
					(vo.replayVersion==window.aisEnv.defLib.globals["BATTLE_REPLAY_DEF_VERSION"]) &&
					(vo.replayVersion3==window.aisEnv.defLib.globals["WAVE_BATTLE_REPLAY_DEF_VERSION"])
				)
				{
					replayShow=1;
					keyid=appEnv.hudKeys.getKey(dlg);
					dlg.regKeyVO(keyid,dlg,dlg.onReplayClk);
					dlg.replayKeys[""+keyid]=vo;//vo;
					replayCSS={id:"replay",css:cssLib.normalBtn.createCSS([replayX,replayY,0],keyid,0,textLib["Replay"],btnW,btnH),button:1};
				}
				if(vo.loots)
				{
					var loots={}, lootSize=60;
					for(j=0; j<vo.loots.length; j++)
					{
						if(!loots[vo.loots[j].type])
						{
							loots[vo.loots[j].type]=vo.loots[j].num;
						}
						else
						{
							loots[vo.loots[j].type]+=vo.loots[j].num;
						}
					}
					for(j in loots)
					{
						rewardItems.push({type:"icon",pos:[0,(subH-lootSize)/2,0],w:lootSize,h:lootSize,css:appEnv.getItemIcon(j),items:[
							{css:cssLib.textFineSmall.createCSS([56,56,0],"x"+loots[j],10,10,2,2,2,2)}
						]});
					}
				}

				var rvo1=null, rvo2=null, resIcon1={}, resIcon2={};
				if(vo.reqs && vo.reqs.length)
				{
					rvo1=vo.reqs[0];
					resIcon1=appEnv.getItemIcon(rvo1.type);
					resIcon1.w=resIcon1.h=iconSize;
					if(2==vo.reqs.length)
					{
						rvo2=vo.reqs[1];
						resIcon2=appEnv.getItemIcon(rvo2.type);
						resIcon2.w=resIcon2.h=iconSize;
					}
				}
				css={
					type:"div3x3",pos:[centerX,centerY,0],w:centerW,h:centerH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_achieve"),ui_event:1,sub_event:1,items:[
						{id:"rank",type:"div3x3",css:cssLib.iconText.createCSS([rankX,rankY,0],rankCSS,rank,1,null,FS.FM)},
						{id:"result",type:"icon",pos:[resultX,resultY,0],w:resultW,h:resultH,anchor_h:0,anchor_v:0,css:imgLib.getImg(vo.passFlag?"pic_stageClear":"pic_stageLost")},
						{id:"line_l",type:"div3x3",pos:[lineX_l,lineY,0],h:lineH,css:imgLib.getImg("box_line")},
						{id:"level",css:cssLib.iconText.createCSS([expX,expY,0],iconCSS_exp,appEnv.getLevelByExp(vo.exp),1,null,0,-2)},
						{id:"name",css:cssLib.iconText.createCSS([nameX,nameY,0],iconCSS_info,vo.userName,2)},
						{id:"res1",css:cssLib.iconText.createCSS([resX1,resY,0],resIcon2,rvo2?rvo2.num:0,0),display:rvo2?1:0},
						{id:"res2",css:cssLib.iconText.createCSS([resX2,resY,0],resIcon1,rvo1?rvo1.num:0,0),display:rvo1?1:0},
						{id:"clan",css:cssLib.iconText.createCSS([clanX,clanY,0],clanCSS,vo.allianceName,0,null,16),display:vo.allianceId?1:0},//
						{id:"macTxt",type:"text",pos:[macTxtX,macTxtY,0],w:macTxtW,h:macTxtH,text:textLib["Mac"]+":",anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200},
						{id:"macList",css:lbxMacCSS,line_items:armyItems},
						{id:"rewardTxt",type:"text",pos:[rewardTxtX,rewardTxtY,0],w:rewardTxtW,h:rewardTxtH,text:textLib["Reward"]+":",anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200},
						{id:"rewardList",css:lbxDrawCSS,line_items:rewardItems},
						{id:"line_r",type:"div3x3",pos:[lineX_r,lineY,0],h:lineH,css:imgLib.getImg("box_line")},
						{id:"scoreTxt",type:"text",pos:[scoreX-3,scoreY,0],w:scoreW,h:scoreH,text:textLib["TotalPoints"]+":",anchor_h:2,anchor_v:1,align_h:2,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200},
						{id:"score",css:cssLib.textFineMid.createCSS([scoreX+3,scoreY,0],vo.totleScore,scoreW,scoreH,0,1,0,1)},
						{id:"replay",css:replayCSS,display:replayShow?1:0},
						{id:"expired",type:"text",pos:[replayX,replayY,0],w:btnW,h:btnH,anchor_h:1,anchor_v:1,align_h:1,align_v:1,text:textLib["Expired"],display:replayShow?0:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:160,},
					]
				};
				return css;
			}
		};
	};
	this.MacCSS_loadUI();

	this.addMacBox=function(state,box,boxY)
	{
		if(!boxY)boxY=0;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onPlayerClk);
		var css=this.lbxMacCSS, x=css.pos[0], y=css.pos[1]+boxY, h=css.h-boxY+5;
		state.lbxPlayer=box.appendNewChild({css:this.lbxMacCSS,key:keyid,pos:[x,y,0],h:h});
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		this.onReplayClk=function(msg,key,way,extra)
		{
				DBOut("this.onReplayClk");
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("this.onReplayClk");
				var keyVO=this.replayKeys[key];
				DBOut("keyVO:"+toJSON(keyVO));
				this.appEnv.closeDlg(null,null,0);
				this.page.stateHome.onReplayMacDefenseClick(keyVO.battleLogId,keyVO.stageID,keyVO.stageName);
			}
		};

		this.onMacViewClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("this.onViewClk");
				var keyVO=this.viewKeys[key];
				//DBOut("keyVO:"+toJSON(keyVO));
				this.getClanById(keyVO.id);
			}
		};
	}
}