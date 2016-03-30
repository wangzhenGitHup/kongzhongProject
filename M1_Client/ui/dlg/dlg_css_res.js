{//玩家列表相关css
	this.ResCSS_loadUI=function()
	{
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var itemW=this.contentW-this.contentInner[0]*2;
		var itemH=66;
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

		var iconSize=48;
		var iconX=rankX+rankW/2+this.dt*2;
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

		this.resLineCSS={
			w:centerW,h:centerH,
			createCSS:function(vo,rank,replay)
			{
				//{allianceFlag:0,allianceId:0,exp:0,move:0,rank:0,score:0,userId:0,userName:"name"+i}
				//DBOut("resLineCSS, vo:"+toJSON(vo)+", rank:"+rank);
			//	rank=vo.rank+1;
				var rankCSS, iconCSS, clanCSS, dtX=replay?90:0;
				if(rank<4){
					rankCSS=imgLib.getImg("box_clan_rank"+(rank));
				}else{
					rankCSS=imgLib.getImg("box_clan_rank4");
				}

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
				if(!vo.totalAttackCount)
					vo.totalAttackCount=1;
				var score=Math.ceil(vo.totalGold/vo.totalAttackCount);
				if(replay)
					score=vo.gold+vo.oil;
				return {type:"div3x3",pos:[0,0,0],w:lineW,h:lineH,anchor_h:0,anchor_v:0,css:bgCSS,items:[
					{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:1,anchor_v:1,items:[cssLib.textFineMid.createCSS([0,0,0],rank,rankW,rankH,1,1,1,1)]},
					
					{css:cssLib.iconText.createCSS([iconX,iconY,0],iconCSS,appEnv.getLevelByExp(vo.exp),1,null,0,-2)},
				//	{css:cssLib.textFineMid.createCSS([nameX,nameY,0],vo.userName?vo.userName:(vo.userId+""),nameW,nameH,0,1,0,1,(vo.userId==window.USERID)?[10,200,255,255]:null)},
					{css:cssLib.iconText.createCSS([nameX,nameY,0],vipCSS,vo.userName?vo.userName:(vo.userId+""),2,(vo.userId==window.USERID)?[10,200,255,255]:null,FS.FM)},
					{css:cssLib.iconText.createCSS([positionX,positionY,0],clanCSS,vo.allianceName,0),display:vo.allianceId?1:0},
					{type:"div3x3",pos:[medalX,medalY,0],w:medalW,h:lineH-12*2,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
						{type:"text",pos:[5,0,0],text:score+"",anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.S},
						{type:"icon",pos:[medalW-36,0,0],anchor_h:1,anchor_v:1,w:40,h:40,css:imgLib.getIcon(replay?"res_all":"res_gold",64)}
					]},
					///////////////测试用
					{id:"replay",type:"key",pos:[lineW-200,lineH/2,0],css:imgLib.getImg("btn_replay_u"),state_down:imgLib.getImg("btn_replay_d"),anchor_h:1,anchor_v:1,ui_event:1,display:replay?1:0},
					{id:"view",css:cssLib.normalBtn.createCSS([lineW-200-dtX,lineH/2,0],0,0,textLib["ViewClan"],90,40),display:0},
				]};
			}
		};
	};
	this.ResCSS_loadUI();

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		this.onResViewClk=function(msg,key,way,extra)
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