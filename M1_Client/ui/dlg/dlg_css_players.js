{//玩家列表相关css
	this.PlayersCSS_loadUI=function()
	{
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var listX=this.contentInner[0];
		var listY=this.contentInner[1];
		var listW=this.contentW-this.contentInner[0]*2;
		var listH=this.contentH-this.contentInner[1]*2;
		var itemW=listW;
		var itemH=66;
		this.lbxPlayerCSS={type:"listbox",id:"lbx-player",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,//dlg:state,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
		var itemX=itemW/2;
		var itemY=itemH/2;
		var pic=imgLib.getImg("box_achieve");
		var centerW=itemW;
		var centerH=56;
		var centerX=-centerW/2;
		var centerY=-centerH/2;
		var centerInner=[pic.mgL,pic.mgU];

		var rankW=92;
		var rankH=centerH-16;
		var rankX=centerInner[0]/2+rankW/2;
		var rankY=centerH/2-2;

		var udSize=36;
		var udX=rankX+rankW/2+this.dt*2+udSize/2;
		var udY=rankY;

		var iconSize=48;
		var iconX=udX+udSize/2+this.dt*2;//rankX+rankW/2+this.dt*2;
		var iconY=rankY;

		var nameX=iconX+iconSize+this.dt*2;
		var nameY=15;//centerH/3;
		var nameW=340;
		var nameH=centerH*2/3;
		var positionX=nameX;
		var positionY=centerH*5/6-7;
		var positionW=nameW;
		var positionH=centerH*2/6;

		var medalW=136;
		var medalX=centerW-centerInner[0]-medalW;
		var medalY=centerH/2;

		this.playerLineCSS={
			w:centerW,h:centerH,
			createCSS:function(vo,rank,rankType)//diamond
			{
				//{allianceFlag:0,allianceId:0,exp:0,move:0,rank:0,score:0,userId:0,userName:"name"+i}
				//DBOut("playerLineCSS, vo:"+toJSON(vo)+", rank:"+rank);
				if(1!=rankType)
					rank=vo.rank+1;
				var rankCSS, iconCSS, clanCSS, udCSS;
				if(rank<4){
					rankCSS=imgLib.getImg("box_clan_rank"+(rank));
				}else{
					rankCSS=imgLib.getImg("box_clan_rank4");
				}

				udCSS=imgLib.getImg("icon_rank_up");
				if(vo.move<0)
					udCSS=imgLib.getImg("icon_rank_down");
				else if(0==vo.move)
					udCSS=imgLib.getImg("icon_rank_draw");

				var bgCSS=(vo.userId==window.USERID)?imgLib.getImg("box_self"):imgLib.getImg("box_achieve");
				iconCSS=imgLib.getIcon("level",64);
				iconCSS.w=iconCSS.h=iconSize;
				clanCSS=imgLib.getIcon("badge1",64);
				if(vo.allianceFlag)
					clanCSS=imgLib.getIcon("badge"+vo.allianceFlag,64);
				clanCSS.w=clanCSS.h=22;

				var vip=vo.vipLevel, vipScale=0.5, vipPic=imgLib.getImg("pic_VIP"+vip);
				var vipW=Math.floor(vipPic.w*vipScale), vipH=Math.floor(vipPic.h*vipScale);
				var vipCSS={css:vipPic,w:vipW,h:vipH};
				if(!vip)vipCSS={w:0,h:0};

				var lineW=this.w, lineH=this.h;
				return {type:"div3x3",pos:[0,0,0],w:lineW,h:lineH,anchor_h:0,anchor_v:0,css:bgCSS,items:[
					{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:1,anchor_v:1,items:[cssLib.textFineMid.createCSS([0,0,0],rank,rankW,rankH,1,1,1,1)]},
					
					{type:"icon",pos:[udX,udY,0],anchor_h:1,anchor_v:1,css:udCSS,display:vo.move?0:1},
					{type:"icon",pos:[udX,udY-11,0],anchor_h:1,anchor_v:1,css:udCSS,display:vo.move?1:0},
					{css:cssLib.textFineMid.createCSS([udX,udY+11,0],Math.abs(vo.move),udCSS.w,udCSS.h,1,1,1,1,vo.move>0?[117,183,10,255]:[231,68,42,255]),font_size:FS.M,display:vo.move?1:0},
					
					{css:cssLib.iconText.createCSS([iconX,iconY,0],iconCSS,appEnv.getLevelByExp(vo.exp),1,null,0,-2)},
				//	{css:cssLib.textFineMid.createCSS([nameX,nameY,0],vo.userName?vo.userName:(vo.userId+""),nameW,nameH,0,1,0,1,(vo.userId==window.USERID)?[10,200,255,255]:null)},
					{css:cssLib.iconText.createCSS([nameX,nameY,0],vipCSS,vo.userName?vo.userName:(vo.userId+""),2,(vo.userId==window.USERID)?[10,200,255,255]:null,FS.FM)},
					{css:cssLib.iconText.createCSS([positionX,positionY,0],clanCSS,vo.allianceName,0),display:vo.allianceId?1:0},
					{type:"div3x3",pos:[medalX,medalY,0],w:medalW,h:lineH-12*2,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
						{type:"text",pos:[5,0,0],text:vo.score+"",anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.S},
						{type:"icon",pos:[medalW-36,0,0],anchor_h:1,anchor_v:1,w:40,h:40,css:imgLib.getIcon("medal",64)}
					]},
					///////////////测试用
					{id:"view",css:cssLib.normalBtn.createCSS([lineW-200,lineH/2,0],0,0,textLib["ViewClan"],90,40),display:0},
				]};
			}
		};
	};
	this.PlayersCSS_loadUI();

	this.addPlayerBox=function(state,box,boxY)
	{
		if(!boxY)boxY=0;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onPlayerClk);
		var css=this.lbxPlayerCSS, x=css.pos[0], y=css.pos[1]+boxY, h=css.h-boxY+5;
		state.lbxPlayer=box.appendNewChild({css:this.lbxPlayerCSS,key:keyid,pos:[x,y,0],h:h});
	};

	this.addPlayers=function(state,lbx,vo,rankType)
	{
		var i,item,css,items=[],keyid;
		this.lbxResponse=0;
		if(!vo)
		{
//			for(i=0; i<10; i++)
//			{
//				item=this.playerLineCSS.createCSS({allianceFlag:0,allianceId:0,exp:0,move:0,rank:0,score:0,userId:0,userName:"name"+i},i+1);
//				lbx.addItem(item);
//			}
		}
		else
		{
			//DBOut("addPlayers:"+toJSON(vo));
			var players=vo;
			if(!this.viewKeys)
				this.viewKeys={};
			this.logKeys={};
			//	DBOut("position:"+this.clanInitVO.rankLevel+", leader:"+this.msgObj.CLAN_RANK_LEADER+", selfCID:"+this.clanInitVO.clanVO.id+", viewCID:"+vo.id);
			for(i=0; i<players.length; i++)
			{
				if("blank"==players[i])
					item={type:"icon"};
				else if(0==rankType || 1==rankType)
					item=this.playerLineCSS.createCSS(players[i],i+1,rankType);//0==rankType?1:0
				else if(2==rankType || 3==rankType)//"resSingle"==rankType || "resAvg"==rankType
					item=this.resLineCSS.createCSS(players[i],i+1,2==rankType?1:0);
				else if(5==rankType)//"macPve"==rankType
					item=this.macLineCSS.createCSS(players[i],i+1,rankType);
				item.info=players[i];
				var idx=lbx.addItem(item);

				if(players[i].battleLogId && 2==rankType)
				{
					keyid=appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.onLogClk);
					this.logKeys[keyid+""]={id:players[i].battleLogId,lbx:lbx,idx:i};
					lbx.itemAt(idx).getItemById("replay").setKey(keyid);
					lbx.itemAt(idx).getItemById("replay").setDisplay(1);
				}
				//////////////测试用
				if(players[i].allianceId && 5!=rankType)
				{
					keyid=appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.onViewClk);
					this.viewKeys[keyid+""]={id:players[i].allianceId,lbx:lbx,idx:i};
					lbx.itemAt(idx).getItemById("view").setKey(keyid);
					lbx.itemAt(idx).getItemById("view").setDisplay(1);
				}
			}
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		this.onPlayerClk=function(msg,key,way,extra)
		{
			if(1==way)
			{
				if(0==msg)
				{
				//	DBOut("onLogClk down");
					this.lbxResponse=1;
				}
				else if(2==msg)
				{
					DBOut("this.onPlayerClk");
					if(this.lbxResponse)
					{
						var stateStr=this.states[this.curStateId];
						var curState=this["state_"+stateStr];
						DBOut("Str:"+stateStr+",State:"+curState);
						var lbx=curState.lbxPlayer;
						var item=lbx.itemAt(extra);
						var info=item.info;
						DBOut("visit:"+toJSON(info));
						if(!info.userId || info.userId==window.USERID)
							return;
						var appEnv=this.appEnv;
						var textLib=appEnv.textLib;
						appEnv.showPmtDlg(this.page.pmtChoose,0,
							{
								title:textLib["ConfirmVisit"],info:textLib["ConfirmVisitDesc"](info.userName),
								pmtFunc:function(ok,info){
									if(ok)
									{
										this.appEnv.closeDlg(null,null,0);
										this.page.stateHome.onVisitClick(info.userId);
									}
								},pmtObj:this,pmtParam:info
							}
						);
					}
					this.lbxResponse=0;
				}
			}
		};

		this.onViewClk=function(msg,key,way,extra)
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