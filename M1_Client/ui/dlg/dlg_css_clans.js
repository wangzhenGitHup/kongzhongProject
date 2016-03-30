{//军团列表
	this.ClansCSS_loadUI=function()
	{
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var page=this.page;

		var listX=this.contentInner[0];
		var listY=this.contentInner[1];
		var listW=this.contentW-this.contentInner[0]*2;
		var listH=this.contentH-this.contentInner[1]*2;
		var itemW=listW;
		var itemH=66;
		this.lbxClanCSS={type:"listbox",id:"lbx-clan",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,
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

		var iconSize=48;
		var iconX=centerInner[0]+iconSize/2;
		var iconY=centerH/2;
		var nameX=iconX+iconSize/2+this.dt*2;
		var nameY=iconY;

		var medalW=136;
		var medalX=centerW-centerInner[0]-medalW;
		var medalY=centerH/2;

		var modeX=medalX-110;
		var modeY=centerH/4+3;
		var numX=modeX;
		var numY=centerH*3/4-5;

		this.clanLineCSS={
			w:centerW,h:centerH,
			createCSS:function(vo,rank,needRank)
			{
				var rankCSS, dtX=needRank?(rankX+rankW/2):0;
				//rank=vo.ranking+1;
				if(rank<4){
					rankCSS=imgLib.getImg("box_clan_rank"+(rank));
				}else{
					rankCSS=imgLib.getImg("box_clan_rank4");
				}

				var bgCSS=(vo.id==window.aisGame.curCity.allianceId)?imgLib.getImg("box_self"):imgLib.getImg("box_achieve");
				var iconCSS=imgLib.getIcon("badge"+vo.flag,64);
			//	iconCSS=imgLib.getIcon("level",64);
				iconCSS.w=iconCSS.h=iconSize;
				var diamondCSS=imgLib.getIcon("res_gem",64);
				var diamondSize=0;
				if(1==rank)
					diamondSize=48;
				else if(2==rank)
					diamondSize=42;
				else if(3==rank)
					diamondSize=36;
				var lineW=this.w, lineH=this.h;
				return {type:"div3x3",pos:[0,0,0],w:lineW,h:lineH,anchor_h:0,anchor_v:0,css:bgCSS,items:[
					{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:1,anchor_v:1,items:[
					//	{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:diamondCSS,w:diamondSize,h:diamondSize,display:(needRank && rank<4)?1:0},
						cssLib.textFineMid.createCSS([0,0,0],rank,rankW,rankH,1,1,1,1)],display:needRank?1:0
					},

					{type:"icon",pos:[iconX+dtX,iconY,0],css:iconCSS,anchor_h:1,anchor_v:1,items:[
						{css:cssLib.textFineSmall.createCSS([0,0,0],"Lv."+(vo.level?vo.level:1),iconSize,iconSize,1,1,2,2,[248,246,102,0])}
					]},
					{css:cssLib.textFineMid.createCSS([nameX+dtX,nameY,0],vo.name,lineW,lineH,0,1,0,1)},
					{css:cssLib.textFineSmall.createCSS([modeX,modeY,0],textLib["ClanType"+vo.clanType],120,lineH,1,1,1,1)},
					{css:cssLib.textFineSmall.createCSS([numX,numY,0],vo.memberNum+"/"+appEnv.getClanMemberMax(vo.level?vo.level:1),120,lineH,1,1,1,1)},//window.aisEnv.defLib.globals["MAX_CLAN_MEMBERS"]
					{type:"div3x3",pos:[medalX,medalY,0],w:medalW,h:lineH-12*2,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
						{type:"text",pos:[5,0,0],text:vo.score+"",anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.S},
						{type:"icon",pos:[medalW-36,0,0],anchor_h:1,anchor_v:1,w:40,h:40,css:imgLib.getIcon("medal",64)}
					]}
				]};
			}
		};
	};
	this.ClansCSS_loadUI();

	this.addClanBox=function(state,box)
	{
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onClanClk);
		state.lbxClan=box.appendNewChild({css:state.lbxClanCSS?state.lbxClanCSS:this.lbxClanCSS,key:keyid});
	};

	this.addClans=function(state,lbx,vo,rankType)
	{
		var page=this.page;
		lbx.setDisplay(1);
		var i,item,items=[];
		//rankType --- 0:rank   1:recommend   2:search
		//DBOut("addClans: "+toJSON(vo));
		if(vo)
		{
			for(i=0; i<vo.length; i++)
			{
				if(0==rankType && window.aisGame.curCity.allianceId && vo[i].id==window.aisGame.curCity.allianceId && page.stateHome.clanInitVO)
				{
					page.stateHome.clanInitVO.rank=i;//vo[i].ranking;
				}
				if(1==rankType && 2==vo[i].clanType)
				{
					vo.splice(i,1);
					i--
					continue;
				}
				item=this.clanLineCSS.createCSS(vo[i],i+1,0==rankType?1:0);
				lbx.addItem(item);
			}
		}
		else
		{
//			for(i=0; i<10; i++)
//			{
//				item=this.clanLineCSS.createCSS({clanType:0, flag:"level", honorScore:3000, id:9, memberNum:1, name:"Clan"+i, ranking:4, score:0});
//				lbx.addItem(item);
//			}
		}
		this.clansVO=vo;
	};

	this.getClanById=function(clanId)
	{
		var stateName=this.states[this.curStateId];
		var state=this["state_"+stateName];
		if(this.dwrObj)
			return;
		this.dwrObj=this.appEnv.newMsg(["ClanDwr","getClanById",clanId],{cb:function(vo){
			//DBOut("getClanById: "+toJSON(vo));
			this.dwrObj=null;
			if(!vo){
				this.appEnv.stateLogs.showLog(this.appEnv.textLib["ClanInfoError"]);
				return;
			}
			this.visitClanVO=vo;
			var keyid=this.appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this[stateName+"_onBackClk"]);
			this.btnBack.setKey(keyid);
			this.btnBack.setDisplay(1);
			state.clanBox.setDisplay(0);
			state.memberBox.setDisplay(1);
			this.setClanInfo(state,vo);
			this.addMembers(state,state.lbxMember,vo);
		},cbobj:this,eh:function(){this.dwrObj=null;},ehobj:this},window.ClanDWRUrl);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		this.onClanClk=function(msg,key,way,extra)
		{
			if(1==way && 2==msg)
			{
				var clanVO=this.clansVO[extra];
				//DBOut("this.onClanClk, clanVO:"+toJSON(clanVO));
				this.getClanById(clanVO.id);
			}
		};
	}
}