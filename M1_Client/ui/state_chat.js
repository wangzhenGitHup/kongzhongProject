if(!__Page.stateChat)
{
	__Page.stateChat={
		page:__Page,
		name:"stateChat",
		lastLUDT:0,
		lockLUDT:1,
		timerLUDT:null,
		pushMsgs:[],
		viewId:"stateChat",
		curStatus:0,
		STATUS_TECH:1,
		STATUS_CLAN:2
	};

	//添加至appEnv的自动初始化列表中:
//	__Page.appEnv.dynaStates.push(__Page.stateChat);
	__Page.stateChat.loadConfig=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.dt=5;
		var sw=appEnv.scrSize[0], sh=appEnv.scrSize[1];
		var chatW=this.chatW=362;
		var chatH=this.chatH=sh;
		this.chatX=-chatW;
		this.chatY=0;
		var pic=imgLib.getImg("btn_sideBG");
		var sideW=this.sideW=pic.w;
		var sideH=this.sideH=pic.h;
		var sideX=this.sideX=chatW+sideW/2;
		var sideY=this.sideY=sh/2-sideH/2;
		this.chatKey=9999;
		this.sideCSS={id:"side-bg",type:"key",pos:[sideX,sideY,0],css:pic,anchor_h:1,anchor_v:1,ui_event:1,key:this.chatKey,state_up:{css:pic},state_down:{css:pic},
			audio:this.page.audioObject.genFileURL("btn_click"),items:[
			{id:"side-obj",type:"icon",pos:[0,0,0],css:imgLib.getImg("btn_sideIn"),anchor_h:1,anchor_v:1},
			{type:"icon",id:"NewMark",pos:[8,-40,0],css:imgLib.getImg("mark_newchvmnt"),anchor_h:1,anchor_v:1,w:24,h:24,display:0}
		]}
		var topBoxX=this.topBoxX=0;
		var topBoxY=this.topBoxY=40;
		var topBY=this.topBY=26;
		var topBoxW=this.topBoxW=chatW;
		var topBoxH=this.topBoxH=90;
		var topBoxH_clan=this.topBoxH_clan=140;
		this.topBoxCSS={id:"top-box",type:"div3x3",pos:[topBoxX,topBoxY,0],w:topBoxW,ui_event:1,css:imgLib.getImg("box_chat_top")};
		var cntW=this.cntW=chatW;
		var cntH=this.cntH=chatH-topBoxY-topBoxH;
		var cntH_clan=this.cntH_clan=chatH-topBoxY-topBoxH_clan;
		var cntX=this.cntX=0;
		var cntY=this.cntY=topBoxY+topBoxH;
		var cntY_clan=this.cntY_clan=topBoxY+topBoxH_clan;
	//	this.cntBoxCSS={id:"cnt-box",type:"div3x3",pos:[topBoxX,topBoxY,0],w:cntW,ui_event:1,clip:1,css:imgLib.getImg("box_achieve")};
		var itemH=this.itemH=116;
		this.cntBoxCSS={type:"listbox",id:"lbx-chat",pos:[0,0,0],w:chatW,h:cntH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:chatW,item_h:this.itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,
		};
		pic=imgLib.getImg("btn_blue_u");
		var btnW=this.btnW=Math.floor(pic.w*1);//1.5
		var btnH=this.btnH=Math.floor(pic.h*1);//0.85
		var btnY=this.btnY=5+btnH/2;
		var btnX_m=this.btnX_m=chatW/2;
		var btnX_l=this.btnX_l=chatW/2-btnW/2;
		var btnX_r=this.btnX_r=chatW/2+btnW/2;
		var iconSize=48;
		pic=imgLib.getIcon("level",64);
		pic.w=pic.h=iconSize;
		var clanLineW=chatW;
		var clanLineH=iconSize;
		var clanLineY=this.clanLineY=topBY+5+clanLineH/2;
		var dt=5;
		this.clanLineCSS={
			page:page,
			createCSS:function(vo)
			{
				var flag=imgLib.getIcon(vo.clanVO.flag,64);
				if(!flag)flag=imgLib.getIcon("level",64);
				var info=imgLib.getImg("btn_info");
				var disp=0==vo.responseStatusCode?1:0;
				return {id:"line-clan",type:"icon",pos:[0,clanLineY,0],w:clanLineW,h:clanLineH,anchor_h:0,anchor_v:1,ui_event:1,
					items:[
						{id:"clan-flag",type:"icon",pos:[dt+iconSize/2,0,0],css:flag,w:iconSize,h:iconSize,anchor_h:1,anchor_v:1,display:disp},
						{id:"clan-name",css:cssLib.textFineMid.createCSS([dt*2+iconSize,0,0],vo.clanVO.name,iconSize,iconSize,0,1,0,1),display:disp},
						{id:"clan-btn",type:"key",pos:[chatW-dt-info.w/2,0,0],anchor_h:1,anchor_v:1,css:info,ui_event:1,button:1,down_scale:0.95,state_up:info,state_down:info,
							audio:this.page.audioObject.genFileURL("btn_click"),}
					],
					update:function(vo)
					{
						//DBOut("clanLineCSS update: "+toJSON(vo));
						var flag=this.getItemById("clan-flag");
						var name=this.getItemById("clan-name");
					//	flag.setTexURL(imgLib.genIconPath(vo.clanVO.flag,64));
						var disp=0;
						if(vo)
						{
							flag.setTexURL(imgLib.genIconPath("badge"+vo.clanVO.flag,64));
							name._setText(vo.clanVO.name);
							disp=0==vo.responseStatusCode?1:0;
							flag.setDisplay(disp);
							name.setDisplay(disp);
						}
						else
						{
							flag.setDisplay(disp);
							name.setDisplay(disp);
						}
					}
				};
			}
		};
		pic=imgLib.getImg("pic_chat");
		var inputLineW=chatW;
		var inputLineH=pic.h;//48
		var inputLineY=this.inputLineY=topBY+5+inputLineH/2;
		var inputLineY_clan=this.inputLineY_clan=clanLineY+clanLineH/2+5+inputLineH/2;
		var inputBoxW=chatW-this.dt*3-pic.w;
		var chatBtnX=chatW-this.dt-pic.w/2;
		dt=5;
		this.inputLineCSS={id:"line-input",type:"icon",pos:[0,inputLineY_clan,0],w:inputLineW,h:inputLineH,anchor_h:0,anchor_v:1,ui_event:1,items:[
			{id:"input-box",type:"div3x3",pos:[dt,0,0],w:inputBoxW,h:inputLineH,css:imgLib.getImg("box_chat_input"),anchor_h:0,anchor_v:1},
			{id:"input-btn",type:"key",pos:[dt,0,0],w:inputBoxW,h:inputLineH,anchor_h:0,anchor_v:1,key:0,ui_event:1,button:1,state_up:{w:inputBoxW,h:inputLineH},audio:this.page.audioObject.genFileURL("btn_click"),},
			{id:"input-text",type:"text",pos:[dt*3,0,0],w:inputBoxW-dt*3,h:inputLineH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,dotcut:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:255},
			{id:"input-send",type:"key",pos:[chatBtnX,0,0],css:pic,anchor_h:1,anchor_v:1,ui_event:1,button:1,down_scale:0.95,state_up:pic,state_down:pic,audio:this.page.audioObject.genFileURL("btn_click"),}
		]};

		iconSize=40;
		pic=imgLib.getIcon("level",64);
		pic.w=pic.h=iconSize;
		this.nameLineCSS={
			lw:chatW,lh:iconSize,page:this,ly:iconSize/2,
			createCSS:function(vo)
			{
				this.lx=0;
				this.ly=iconSize/2;

				var vip=this.page.getVipLevel(vo.userId), vipScale=0.5, vipPic=imgLib.getImg("pic_VIP"+vip);
				var vipW=Math.floor(vipPic.w*vipScale), vipH=Math.floor(vipPic.h*vipScale);
				var vipCSS={css:vipPic,w:vipW,h:vipH};
				if(!vip)vipCSS={w:0,h:0};//imgLib.getImg("pic_info");

				return {id:"nameLine",type:"icon",pos:[this.lx,this.ly,0],w:this.lw,h:this.lh,anchor_h:0,anchor_v:1,items:[
					{id:"lv",css:cssLib.iconText.createCSS([dt,0,0],pic,appEnv.getLevelByExp(vo.userExp),1,null,0,-1)},
					{id:"info",css:cssLib.iconText.createCSS([dt*2+iconSize,0,0],vipCSS,vo.userName,2,(vo.userId==window.USERID)?[10,200,255,255]:null)},
				//	{id:"time",type:"text",pos:[this.lw-dt,0,0],anchor_h:2,anchor_v:1,align_h:2,align_v:1,w:this.lw,h:iconSize,text:vo.time+"",font_size:20,color_r:100,color_g:100,color_b:100,color_a:160}
				]};
			}
		};
		var wordsFont=FS.S;
		this.rTroopCSS={
			lw:chatW,lh:75,page:this,
			createCSS:function(vo,keyid)
			{
				var page=this.page;
				this.lx=dt*2+page.nameLineCSS.lh;
				this.ly=page.nameLineCSS.ly+page.nameLineCSS.lh/2;
				this.lw=chatW-this.lx*2;
				var barW=100,barH=10;
				var barX=this.lw/2-barW/2,barY=23;
				var curPlace=vo.totalPlace-vo.remainPlace;
				var totalDonate=this.page.getDonateNum(vo);
				return {id:"rTroopField",type:"icon",pos:[this.lx,this.ly,0],w:this.lw,h:this.lh,ui_event:1,
					items:[
						{css:cssLib.textFineSmall.createCSS([0,2,0],vo.words?vo.words:textLib["ClanReqTroops"],this.lw,10,0,1,0,1),font_size:wordsFont},
						{id:"num",css:cssLib.textFineSmall.createCSS([barX-dt,barY-2,0],curPlace+"/"+vo.totalPlace,40,10,2,1,2,1),font_size:wordsFont},
						{type:"shape",pos:[barX,barY,0],w:barW,h:barH,anchor_h:0,anchor_v:1,face_r:10,face_g:10,face_b:10,face_a:255},
						{id:"bar",type:"bar",pos:[barX,barY,0],w:barW,h:barH,anchor_h:0,anchor_v:1,mode:0,value_full:vo.totalPlace,value_init:curPlace,
							face_r:50,face_g:200,face_b:50,face_a:255,
							border_r:0,border_g:0,border_b:0,border_a:255,
						//	back_r:50,back_g:50,back_b:50,back_a:255
						},
						{id:"btn",css:cssLib.normalBtn.createCSS([barX+barW/2,barY+28,0],keyid,0,textLib["Donate"],100,40),
							display:((vo.userId==window.USERID) || (!vo.remainPlace) || (window.aisEnv.defLib.globals["MAX_DONATE_UNITS"]<=totalDonate))?0:1},
					],
					update:function(vo)
					{
						//DBOut("rTroopCSS update:"+toJSON(vo));
						this.getFather().msg=vo;
						var curPlace=vo.totalPlace-vo.remainPlace;
						var bar=this.getItemById("bar");
						bar.setValue(curPlace);
						var num=this.getItemById("num");
						num._setText(curPlace+"/"+vo.totalPlace);
						if(!vo.remainPlace)
							this.getItemById("btn").setDisplay(0);
					}
				};
			}
		};
		this.rJoinCSS={
			lw:chatW,lh:75,page:this,
			createCSS:function(vo,keyid1,keyid2,btnShow)
			{
				var page=this.page;
				this.lx=dt*2+page.nameLineCSS.lh;
				this.ly=page.nameLineCSS.ly+page.nameLineCSS.lh/2;
				this.lw=chatW-this.lx*2;
				var barW=100,barH=10;
				var barX=this.lw/2-barW/2,barY=23;
				if(!btnShow)btnShow=0;
				return {id:"rJoinField",type:"icon",pos:[this.lx,this.ly,0],w:this.lw,h:this.lh,ui_event:1,
					items:[
						{id:"txt",css:cssLib.textFineSmall.createCSS([0,2,0],textLib["ClanReqJoin"],this.lw,10,0,1,0,1),font_size:wordsFont},
						{id:"refuse",css:cssLib.normalBtn.createCSS([barX+barW/2-52,barY+28,0],keyid1,1,textLib["Refuse"],100,40),display:btnShow},
						{id:"agree" ,css:cssLib.normalBtn.createCSS([barX+barW/2+52,barY+28,0],keyid2,0,textLib["Agree"],100,40),display:btnShow},
					],
					showBtn:function(disp)
					{
						this.getItemById("refuse").setDisplay(disp);
						this.getItemById("agree").setDisplay(disp);
					},
					update:function(vo)
					{
						//DBOut("rJoinCSS update:"+toJSON(vo));
						var disp=0, str="";
						this.getItemById("refuse").setDisplay(disp);
						this.getItemById("agree").setDisplay(disp);
						if(0 == vo.appendMsg)
							str=textLib.getTextEx("RefuseJoinClan",{name1:vo.words, name2:vo.userName});
						else if(1 == vo.appendMsg)
							str=textLib.getTextEx("AgreeJoinClan",{name1:vo.words, name2:vo.userName});
						this.getItemById("txt")._setText(str);
					},
				};
			}
		};
		this.txtLineCSS={
			lw:chatW,lh:65,page:this,
			createCSS:function(str,color)
			{
				var page=this.page;
				this.lx=dt*2+page.nameLineCSS.lh;
				this.ly=page.nameLineCSS.ly+page.nameLineCSS.lh/2-dt;
				this.lw=chatW-this.lx-dt;
				return {id:"txtLine",type:"icon",pos:[this.lx,this.ly,0],w:this.lw,h:this.lh,ui_event:1,items:[
					{css:cssLib.textFineSmall.createCSS([0,0,0],str,//"maxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmaxmax",
						this.lw,this.lh-10,0,0,0,0,color,1),font_size:wordsFont},
				]};
			}
		};
		this.shareCSS={
			lw:chatW,lh:75,page:this,
			createCSS:function(vo,keyid)
			{
				//DBOut("shareCSS: "+toJSON(vo));
				var page=this.page;
				this.lx=dt*2+page.nameLineCSS.lh;
				this.ly=page.nameLineCSS.ly+page.nameLineCSS.lh/2;
				this.lw=chatW-this.lx*2;
				var barW=100,barH=10;
				var barX=this.lw/2-barW/2,barY=23;
				return {id:"shareField",type:"icon",pos:[this.lx,this.ly,0],w:this.lw,h:this.lh,ui_event:1,
					items:[
						{css:cssLib.textFineSmall.createCSS([0,2,0],textLib["ShareBattle"]+":",this.lw,10,0,1,0,1),font_size:wordsFont},
						{id:"words",css:cssLib.textFineSmall.createCSS([0,barY,0],vo.words?vo.words:"",40,10,0,1,0,1),font_size:wordsFont},
						{id:"btn",css:cssLib.normalBtn.createCSS([barX+barW/2,barY+28,0],keyid,0,textLib["ViewReplay"],100,40)},
					],
					update:function(vo)
					{
						//DBOut("shareCSS update:"+toJSON(vo));
						this.getFather().msg=vo;
					}
				};
			}
		};
		this.donateLineCSS={//暂时没用
			lw:chatW,lh:65,page:this,
			createCSS:function(str1,str2,color1,color2)
			{
				var page=this.page;
				this.lx=dt*2+page.nameLineCSS.lh;
				this.ly=page.nameLineCSS.ly+page.nameLineCSS.lh/2-dt;
				this.lw=chatW-this.lx-dt;
				if(!color1)color1=[101,186,226,255];
				if(!color2)color2=[219,220,13,255];
				return {id:"donateLine",type:"icon",pos:[this.lx,this.ly,0],w:this.lw,h:this.lh,ui_event:1,items:[
					{css:cssLib.textFineSmall.createCSS([0,0,0],str1,this.lw,16,0,0,0,0,color1,0),font_size:wordsFont},
					{css:cssLib.textFineSmall.createCSS([0,0,0],str2,this.lw,16,0,0,0,0,color2,0),font_size:wordsFont},
				]};
			}
		};
		var self=this;
		this.techLineCSS={//联盟科技
			lw:chatW,lh:75,page:this,
			createCSS:function(vo,keyid)
			{
				this.getTechInfo(vo);
				var page=this.page;
				this.lx=dt*2+page.nameLineCSS.lh;
				this.ly=page.nameLineCSS.ly+page.nameLineCSS.lh/2;
				this.lw=chatW-this.lx*2;
				var barW=100,barH=10;
				var barX=this.lw/2-barW/2,barY=23;
				var techSize=46, techX=this.lw, techY=-this.ly+techSize/2;//barY;
				var gemX=100/2-6, gemSize=36, numX=gemX-gemSize-3;
				var curPlace=this.curPlace, totalPlace=this.totalPlace;
				var item={type:"icon",pos:[0,0,0],w:chatW,h:itemH,fade:1,fade_alpha:0,fade_size:1,fade_pos:[0,0,0],ui_event:1,tech:vo,
					items:[
						{id:"tech",css:cssLib.iconText.createCSS([dt,iconSize/2,0],{w:chatW,h:iconSize},this.name,2)},//this.def["name"]
						{id:"callTechField",type:"icon",pos:[this.lx,this.ly,0],w:this.lw,h:this.lh,ui_event:1,
							items:[
							//	{css:cssLib.textFineSmall.createCSS([0,2,0],vo.words?vo.words:textLib.getTextEx("ReqClanTech",{tech:"name"}),this.lw,10,0,1,0,1),font_size:wordsFont},
								{id:"info",css:cssLib.textFineSmall.createCSS([0,-3,0],this.info,this.lw,10,0,0,0,0),font_size:wordsFont,wrap:1},
								{id:"num",css:cssLib.textFineSmall.createCSS([barX-dt,barY-2,0],curPlace+"/"+totalPlace,40,10,2,1,2,1),font_size:wordsFont,display:0==this.status?1:0},
								{id:"bar-bg",type:"shape",pos:[barX,barY,0],w:barW,h:barH,anchor_h:0,anchor_v:1,face_r:10,face_g:10,face_b:10,face_a:255,display:0==this.status?1:0},
								{id:"bar",type:"bar",pos:[barX,barY,0],w:barW,h:barH,anchor_h:0,anchor_v:1,mode:0,value_full:totalPlace,value_init:curPlace,display:0==this.status?1:0,
									face_r:50,face_g:200,face_b:50,face_a:255,
									border_r:0,border_g:0,border_b:0,border_a:255,
								},
								{id:"btn",css:cssLib.normalBtn.createCSS([barX+barW/2,barY+28,0],keyid,0,"",100,40),
									items:[
										{id:"gem",type:"icon",pos:[gemX,0,0],w:gemSize,h:gemSize,anchor_h:2,anchor_v:1,css:imgLib.getIcon("res_gem",64)},
										{id:"cost",css:cssLib.textFineMid.createCSS([numX,0,0],this.cost,20,10,2,1,2,1,this.bad?[255,0,0,255]:null)}
									],display:0==this.status?1:0
								},
								{id:"icon",type:"icon",pos:[techX,techY,0],w:techSize,h:techSize,anchor_h:0,anchor_v:1,css:imgLib.getIcon(vo.codename,64)},
							],
						},
						{id:"time",css:cssLib.textFineSmall.createCSS([chatW-5,itemH-10,0],this.time,chatW,10,2,1,2,1)},
						{type:"div3x3",pos:[5,itemH-3,0],css:imgLib.getImg("box_chat_line"),w:chatW-10}
					],
					update:this.update,
					getTechInfo:this.getTechInfo
				};
				return item;
			},
			update:function(vo)
			{
				//DBOut("rTroopCSS update:"+toJSON(vo));
				this.getTechInfo(vo);
				var techName=this.getItemById("tech");
				var infoText=this.getItemById("info");
				var numInfo=this.getItemById("num");
				var barBG=this.getItemById("bar-bg");
				var barObj=this.getItemById("bar");
				var btnCost=this.getItemById("btn");
				var numCost=btnCost.getItemById("cost");
				var techIcon=this.getItemById("icon");
				var time=this.getItemById("time");
				techName._setText(this.name);
				infoText._setText(this.info);
				techIcon.setTexURL(imgLib.genIconPath(vo.codename,64));
				time._setText(this.time);
				if(0==this.status)//号召中
				{
					var curPlace=this.curPlace;
					var totalPlace=this.totalPlace;
					barObj.setValue(curPlace);
					numInfo._setText(curPlace+"/"+totalPlace);

					numInfo.setDisplay(1);
					barBG.setDisplay(1);
					barObj.setDisplay(1);
					btnCost.setDisplay(1);
					numCost._setText(this.cost);
					if(this.bad)
						numCost.setColor(255,0,0,255);
					else
						numCost.setColor(255,255,255,255);
				}
				else if(1==this.status)//已开启
				{
					numInfo.setDisplay(0);
					barBG.setDisplay(0);
					barObj.setDisplay(0);
					btnCost.setDisplay(0);
				}
				else if(2==this.status)//解锁未启用
				{
					numInfo.setDisplay(0);
					barBG.setDisplay(0);
					barObj.setDisplay(0);
					btnCost.setDisplay(0);
				}
				else if(-1==this.status)//未解锁
				{
					DBOut("tech error: "+vo.codename);
				}
			},
			getTechInfo:function(vo)
			{
				var defLib=window.aisEnv.defLib.clanTec;
				var def=defLib[vo.codename];
				var techLv=appEnv.getClanTechLv(vo.codename);
				if(!techLv){
					Dialogs.alert("clan tech error: "+vo.codename);
					return {};
				}
				var levelVO=def["levels"][techLv-1];
				var total=levelVO["cost"].gem;
				var cost=levelVO["callCost"].gem;
				this.def=def;
				this.levelVO=levelVO;
				this.curPlace=vo.res?vo.res.num:0;
				this.totalPlace=total;
				this.remainPlace=this.totalPlace-this.curPlace;
				this.cost=cost;
				this.bad=cost>window.aisGame.king.gemNum?1:0;
				this.codename=vo.codename;
				this.status=appEnv.getClanTechStatus(vo.codename);

				var name=levelVO["name"], info="", time="";
				if(0==this.status){
					info=textLib["InCall"];
					time="";
				}else if(1==this.status){
					info=this.levelVO["desc"];
					time=textLib["RemainTime"]+textLib.getTimeText(vo.expireTimes+window.aisGame.king.debugTime-window.aisEnv.dateTime());
				}else if(2==this.status){
					info=textLib["ClanTechExpired"];
					time=textLib.getTimeDistance(vo.expireTimes+window.aisGame.king.debugTime);
				}
				this.name=name;
				this.info=info;
				this.time=time;
			}
		};
	};

	//初始化State
	__Page.stateChat.init=function(appEnv)
	{
		this.appEnv=appEnv;
		appEnv.stateChat=this;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		page.keyStateUtil.call(this);

		var keyid=0;
		this.loadConfig();
		this.msgObj=window.aisGame.curCity.clanMsgs;
		//创建State专署UI控件:
		{
			var layer=this.appEnv.layer;
			var sw=appEnv.scrSize[0], sh=appEnv.scrSize[1];
			this.hudBaseBox=appEnv.hudBaseBox;
			//调试控件底盘:
			this.chatDock=this.hudBaseBox.appendNewChild({
				type:"shape",id:"chat-bock",ch_align:0,cv_align:0,pos:[this.chatX,this.chatY,0],w:200,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
				fade:1,fade_size:1,fade_alpha:0,state:this,
				onAniDone:function(a){
					if(this.hiding)
					{
						this.getItemById("chat-box").setDisplay(0);
						this.state.cntBox.clearItems();
						this.state.cntBox.removeAllChild();
					}
					this.showing=0;
					this.hiding=0;
					DBOut("ani done: "+a);
				}
			});
			var chatBox=this.chatBox=this.chatDock.appendNewChild({
				type:"div3x3",id:"chat-box",css:imgLib.getImg("box_chat"),ch_align:0,cv_align:0,pos:[0,0,0],w:this.chatW,h:sh,ui_event:1,block_touch:1,
				display:0,fade:1,fade_size:1,fade_alpha:1,items:[{type:"icon",id:"blocker",pos:[0,0,0],w:this.chatW,h:sh,block_touch:1}]
			});
		}
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.switchChat);
		this.btnSide=this.chatDock.appendNewChild({css:this.sideCSS,key:keyid});
		this.sideObj=this.btnSide.getItemById("side-obj");

		var topBox=this.topBox=chatBox.appendNewChild({css:this.topBoxCSS,h:this.topBoxH_clan});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onMsgClk);
		var cntBox=this.cntBox=chatBox.appendNewChild({css:this.cntBoxCSS,pos:[this.cntX,this.cntY_clan],h:this.cntH_clan,key:keyid,clip:1});

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.showBox_Clan);
		this.topBtnL=cssLib.normalBtn.create(chatBox,[this.btnX_l,this.btnY,0],keyid,2,textLib["ClanMsg"],this.btnW,this.btnH);
		this.tipHudL=this.topBtnL.appendNewChild({type:"icon",pos:[46,0,0],w:20,h:20,anchor_h:0,anchor_v:1,css:imgLib.getImg("mark_newchvmnt"),display:0});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.showBox_Tech);
//		this.topBtnR=cssLib.normalBtn.create(chatBox,[this.btnX_m,this.btnY,0],keyid,2,textLib["ClanMsg"],this.btnW,this.btnH);
		this.topBtnR=cssLib.normalBtn.create(chatBox,[this.btnX_r,this.btnY,0],keyid,2,textLib["ClanTech"],this.btnW,this.btnH);
		this.tipHudR=this.topBtnR.appendNewChild({type:"icon",pos:[46,0,0],w:20,h:20,anchor_h:0,anchor_v:1,css:imgLib.getImg("mark_newchvmnt"),display:0});

		this.clanLine=topBox.appendNewChild({css:this.clanLineCSS.createCSS({clanVO:{clanName:"clan test",clanFlag:"level"}})});
		this.clanBtn=this.clanLine.getItemById("clan-btn");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onClanInfoClk);
		this.clanBtn.setKey(keyid);
		this.inputLine=topBox.appendNewChild({css:this.inputLineCSS});
		this.inputTxt=this.inputLine.getItemById("input-text");
		this.inputBtn=this.inputLine.getItemById("input-btn");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onInputClk);
		this.inputBtn.setKey(keyid);
		this.btnSend=this.inputLine.getItemById("input-send");
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSendMsgClk);
		this.btnSend.setKey(keyid);

		appEnv.chatInited=1;
		this.lbxResponse=0;
		this.donateKeys={};
		this.donateUnitKeys={};
		this.joinKeys={};
		this.shareKeys={};
		this.techResponseKeys={};
		//DBOut("stateChat.init: "+appEnv);

		this.msgObj.addUIView(this);

	//	if(window.aisGame.curCity.allianceId)
			this.showBox_Clan(1,0,1,0);
	//	else
	//		this.showBox_Tech(1,0,1,0);
	};

	__Page.stateChat.enter=function(preState)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		DBOut("stateChat: Enter");

	};

	__Page.stateChat.leave=function(nextState)
	{
		//TODO:code this:
	};

	__Page.stateChat.getItemCSS=function(vo)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		if(!this.clanInitVO)return {};
		var i,list,item,css,keyid1,keyid2,btnShow;
		item={type:"icon",pos:[0,0,0],w:this.chatW,h:this.itemH,fade:1,fade_alpha:0,fade_size:1,fade_pos:[0,0,0],items:[],msg:vo};
		item.items.push({css:this.nameLineCSS.createCSS(vo)});
		var msgObj=this.msgObj;
/**
	//联盟官阶========================================================
	this.CLAN_RANK_MEMBER = 	0;//成员
	this.CLAN_RANK_LEADER = 	1;//盟主
	this.CLAN_RANK_OFFICER = 	2;//官员
	//聊天信息类型======================================================
	this.CHAT_MSG_CREATE = 		0;//创建联盟
	this.CHAT_MSG_WORDS = 		1;//聊天信息
	this.CHAT_MSG_REINFORCE = 	2;//增援申请
	this.CHAT_MSG_DONATE = 		3;//捐赠
	this.CHAT_MSG_JOIN = 		4;//加入
	this.CHAT_MSG_LEAVE = 		5;//离开
	this.CHAT_MSG_KICK = 		6;//踢人
	this.CHAT_MSG_APPOINT = 	7;//委任
	this.CHAT_MSG_DISMISE = 	8;//禅让
	this.CHAT_MSG_EDIT = 		9;//编辑
	this.CHAT_MSG_ShareBattleReport = 10;	//分享战报
	this.CHAT_MSG_DONATE_TO_SELF = 11;		//给自己联盟捐兵
/**/
		if(msgObj.CHAT_MSG_REINFORCE == vo.type || msgObj.CHAT_MSG_DONATE == vo.type || msgObj.CHAT_MSG_DONATE_TO_SELF == vo.type)//要兵 || 捐兵 || 自捐
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onDonateClk);
			item.items.push({css:this.rTroopCSS.createCSS(vo,keyid)});
			this.donateKeys[""+keyid]=vo;
		}
		else if(msgObj.CHAT_MSG_JOIN == vo.type && msgObj.JOIN_CLAN_TYPE_APPLY == vo.appendMsg)//(msgObj.CHAT_MSG_REQJOIN == vo.type)//申请入盟
		{
			btnShow=0;
			if(
				this.clanInitVO.rankLevel==msgObj.CLAN_RANK_LEADER ||
				this.clanInitVO.rankLevel==msgObj.CLAN_RANK_OFFICER ||
				this.clanInitVO.rankLevel==msgObj.CLAN_RANK_DEPUTY_LEADER
			)
			{
				btnShow=1;
			}
			keyid1=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid1,this,this.onRefuseClk);
			keyid2=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid2,this,this.onAgreeClk);
			item.items.push({css:this.rJoinCSS.createCSS(vo,keyid1,keyid2,btnShow)});
			this.joinKeys[""+keyid1]=this.joinKeys[""+keyid2]=vo;
		}
		else if(msgObj.CHAT_MSG_ShareBattleReport == vo.type)//分享战报
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onShareClk);
			item.items.push({css:this.shareCSS.createCSS(vo,keyid)});
			this.shareKeys[""+keyid]=vo;
		}
		else//文字
		{
			var str, color="";
			if(msgObj.CHAT_MSG_CREATE == vo.type)//创建联盟
			{
				str=textLib["ClanCreated"];
			}
			else if(msgObj.CHAT_MSG_WORDS == vo.type)//聊天信息
			{
				str=vo.words;
			}
			else if(msgObj.CHAT_MSG_JOIN == vo.type && msgObj.JOIN_CLAN_TYPE_ANYONE == vo.appendMsg)//自由加入
			{
				str=textLib["ClanJoin"];
			}
			else if(msgObj.CHAT_MSG_JOIN == vo.type && msgObj.JOIN_CLAN_TYPE_CLOSE == vo.appendMsg)//申请时已关闭加入
			{
				str=textLib["TryJoinClan"];
			}
			else if(msgObj.CHAT_MSG_LEAVE == vo.type)//离开
			{
				str=textLib["ClanLeave"];
			}
			else if(msgObj.CHAT_MSG_KICK == vo.type)//踢人
			{
				str=textLib["ClanKicked"];
			}
			else if(msgObj.CHAT_MSG_APPOINT == vo.type)//委任
			{
				str=textLib.getTextEx("ClanPromoted",{position:textLib["ClanPosition"+vo.rankLevel]});
			}
			else if(msgObj.CHAT_MSG_DISMISE == vo.type)//禅让
			{
				str=textLib["NewLeader"](vo.userName);
			}
			else if(msgObj.CHAT_MSG_JOIN_RESULT == vo.type)//加入结果
			{
				if(0 == vo.appendMsg)
					str=textLib.getTextEx("RefuseJoinClan",{name1:vo.words, name2:vo.userName});
				else if(1 == vo.appendMsg)
					str=textLib.getTextEx("AgreeJoinClan",{name1:vo.words, name2:vo.userName});
			}
			else if(msgObj.CHAT_MSG_DONATE_GET_POINTS == vo.type)//捐献
			{
				var defLib=window.aisEnv.defLib.clan;
				if(vo.remainPlace)//花钻
				{
					str=textLib.getTextEx("DonateClanByGem",{gem:defLib["powerDonate"]["cost"]["gem"]});
					str+="\n";
					str+=textLib["ClanPoint"]+"+"+defLib["powerDonate"]["exp"];
				}
				else//免费
				{
					str=textLib["DonateClanByRes"];
					str+="\n";
					str+=textLib["ClanPoint"]+"+"+defLib["genDonate"]["exp"];
				}
			}
//			else if(msgObj.CHAT_MSG_SIGN_IN == vo.type)//联盟签到
//			{
//				str=textLib.getTextEx("ClanAllotGemTo",{name:"", gem:0});
//			}
			else if(msgObj.CHAT_MSG_DECLAREWAR == vo.type)//联盟领土争夺战，对领地宣战
			{
				var defLib=window.aisEnv.defLib.clanCupDomains;
				var areaDef=defLib[vo.appendMsg];
				str=textLib.getTextEx("ClanDeclareWar",{area:areaDef["name"]});
			}
//			else if(msgObj.CHAT_MSG_ALLOT_RES == vo.type)//分配资源
//			{
//				str=textLib.getTextEx("ClanAllotGemTo",{name:"", gem:0});
//			}
			else if(msgObj.CHAT_MSG_UPGRADE == vo.type)//联盟升级
			{
				str=textLib.getTextEx("ClanLevelUp",{level:vo.appendMsg});
			}
			else if(msgObj.CHAT_MSG_CALL_ON == vo.type)//联盟号召
			{
				var defLib=window.aisEnv.defLib.clanTec;
				var appendMsg=fromJSON(vo.appendMsg);
				var codename=appendMsg.codename;
				var techDef=defLib[codename];
				var techLv=appEnv.getClanTechLv(codename);
				var lvo=techDef["levels"][techLv-1];
				str=textLib.getTextEx("ClanCallTech",{tech:lvo["name"]});
			}
			else if(msgObj.CHAT_MSG_RESPOND_CALL == vo.type)//响应联盟号召
			{
				var defLib=window.aisEnv.defLib.clanTec;
				var appendMsg=fromJSON(vo.appendMsg);
				var codename=appendMsg.codename;
				var techDef=defLib[codename];
				var techLv=appEnv.getClanTechLv(codename);
				var lvo=techDef["levels"][techLv-1];
				str=textLib.getTextEx("ClanTechResponse",{tech:lvo["name"]});
			}
			else if(msgObj.CHAT_MSG_CALL_GEM == vo.type)//钻石秒科技
			{
				var defLib=window.aisEnv.defLib.clanTec;
				var appendMsg=fromJSON(vo.appendMsg);
				var codename=appendMsg.codename;
				var techDef=defLib[codename];
				var techLv=appEnv.getClanTechLv(codename);
				var lvo=techDef["levels"][techLv-1];
				str=textLib.getTextEx("ClanTechGemDone",{tech:lvo["name"]});
			}
			item.items.push({css:this.txtLineCSS.createCSS(str,color)});
		}
		item.items.push({id:"time",css:cssLib.textFineSmall.createCSS([this.chatW-5,this.itemH-10,0],textLib.getTimeDistance(vo.time+window.aisGame.king.debugTime),this.chatW,10,2,1,2,1)});
		item.items.push({type:"div3x3",pos:[5,this.itemH-3,0],css:imgLib.getImg("box_chat_line"),w:this.chatW-10});
		return item;
	};

	__Page.stateChat.updateMsgItems=function(vo)
	{
		//DBOut("updateMsgItems: "+toJSON(vo));
		var item, subItem, msg, i, idx;

		if(!this.clanInitVO)return;
		if(this.msgObj.CHAT_MSG_LEAVE == vo.type || this.msgObj.CHAT_MSG_KICK == vo.type)
		{
			for(i=0; i<this.cntBox.getItemNum(); i++)
			{
				item=this.cntBox.itemAt(i);
				msg=item.msg;
				if((this.msgObj.CHAT_MSG_REINFORCE == msg.type || this.msgObj.CHAT_MSG_DONATE == msg.type || this.msgObj.CHAT_MSG_DONATE_TO_SELF == msg.type) &&
					vo.userId==msg.userId)//退盟 || 被踢	清除要兵消息
				{
					this.page.setCookie("Runtime","ClanFlag","",0);
					this.page.setCookie("Runtime","ClanCookie","",0);
					this.page.setCookie("Runtime","CityAllianceId","",0);
				//	DBOut("removeMsg:"+i+","+toJSON(msg));
					this.removeMsgItem(i);
					i--;
				}
			}
		}
		for(i=0; i<this.cntBox.getItemNum(); i++)
		{
			item=this.cntBox.itemAt(i);
			msg=item.msg;
			if(msg.id==vo.id)
			{
				subItem=item.firstChild().getNextItem();
				if(subItem.update){
					subItem.update(vo);
				}else{
					DBOut("subItem have no update func.");
				}
				return;
			}
			if(this.msgObj.checkMessage(vo, msg))
			{
				idx=i;
				if(item.getItemById("btn"))
					item.getItemById("btn").setEnabled(0);
			//	item.fadeOut(10,0);
			//	this.timer=setFrameout(10,function(){
			//		this.cntBox.removeItem(idx);
			//	},this);
				this.removeMsgItem(i);
				if((msg.type==this.msgObj.CHAT_MSG_REINFORCE || msg.type==this.msgObj.CHAT_MSG_DONATE || msg.type==this.msgObj.CHAT_MSG_DONATE_TO_SELF) && !vo.remainPlace)
					return;
				break;
			}
		}

		var css=this.getItemCSS(vo);
		var id=this.cntBox.insertItemAt(css,0);
		this.cntBox.itemAt(id).setDisplay(0);
		this.cntBox.itemAt(id).fadeIn(10,0);
	};

	__Page.stateChat.removeMsgItem=function(idx)
	{
		this.cntBox.itemAt(idx).fadeOut(9,0);
	//	this.timer=setFrameout(10,function(){
			this.cntBox.removeItem(idx);
	//	},this);
	};

	__Page.stateChat.addItems_Tech=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.tipHudR.setDisplay(0);
		var vo=this.page.stateHome.clanInitVO;
		if(!this.page.vwHomeStage.checkClan(0) || !window.aisGame.curCity.allianceId || !vo)
		{
			return;
		}
		else
		{
		//	this.clanLine.update(vo);
			var msgs=this.msgObj.msgs;
			var techs=appEnv.getClanTechs();
			DBOut("addItems_Tech: "+toJSON(techs));
			var i ,keyid;
			for(i=0; i<techs.length; i++)
			{
				this.cntBox.addItem(this.getTechItemCSS(techs[i]));
			}
		}
	};

	__Page.stateChat.getTechItemCSS=function(vo)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onTechResponseClk);
		this.techResponseKeys[keyid+""]=vo;
		item=this.techLineCSS.createCSS(vo,keyid);
		return item;
	};

	__Page.stateChat.updateTechItems=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var vo=this.page.stateHome.clanInitVO;
		if(!this.page.vwHomeStage.checkClan(0) || !window.aisGame.curCity.allianceId || !vo)
		{
			return;
		}
		else
		{
		//	this.clanLine.update(vo);
		}
		if(this.chatBox.getDisplay())//showing
		{
			var i, n=this.cntBox.getItemNum();
			var techs=appEnv.getClanTechs();
			for(i=0; i<techs.length; i++)
			{
				if(i<n)
				{
					this.cntBox.itemAt(i).update(techs[i]);
				}
				else
				{
					this.cntBox.addItem(this.getTechItemCSS(techs[i]));
				}
			}
			if(n>=techs.length)
			{
				for(i=techs.length; i<n; i++)
				{
					this.cntBox.removeItem(i);
					i--;
					n--;
				}
			}
		}
		else//hiding
		{
			DBOut("will show num on sideBtn ");
			this.btnSide.getItemById("NewMark").setDisplay(1);
		}
	};

	__Page.stateChat.addItems_Clan=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.tipHudL.setDisplay(0);
		var vo=this.page.stateHome.clanInitVO;
		this.clanInitVO=vo;
		if(!this.page.vwHomeStage.checkClan(0))
		{
			this.cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([this.chatW/2,100,0],textLib["ClanNeedBld"](),this.chatW,20,1,1,1,1)});
		}
		else if(!window.aisGame.curCity.allianceId)
		{
			this.cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([this.chatW/2,100,0],textLib["ClanNotJoin"],this.chatW,20,1,1,1,1)});
		}
		else if(!vo)
		{
			this.cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([this.chatW/2,100,0],textLib["ClanNotLogin"],this.chatW,20,1,1,1,1)});
		}
		else
		{
			this.clanLine.update(vo);
			var msgs=this.msgObj.msgs;
			//DBOut("addItems_Clan, msgs="+toJSON(msgs));
			var i;
			if(msgs && msgs.length)
			{
				this.firstMsg=msgs[0];
				for(i=0; i<msgs.length; i++)
				{
					if(this.msgObj.CHAT_MSG_JOIN_RESULT == msgs[i].type && 1==msgs[i].appendMsg && -2==msgs[i].responseStatusCode)
					{
						msgs.splice(i,1);
						i--;
						continue;
					}
					this.cntBox.addItem(this.getItemCSS(msgs[i]));
				}
			}
//			else
//			{
//				for(i=0; i<7; i++)
//				{
//					this.cntBox.addItem(this.getItemCSS({type:i,id:0,
//						userId:1001,userName:"ak",userExp:999,userScore:1010,rankLevel:1,time:1366626000000,
//						words:"haha",
//						remainPlace:2,totalPlace:10,
//						donateUnit:{},
//						donateUserId:1002
//					}));
//				}
//			}
		}
	};

	//获取给某个玩家的特定要兵请求的捐兵信息
	__Page.stateChat.getDonateNum=function(vo,codeName)
	{
		var appEnv=this.appEnv;
		var page=this.page;

		var cookieName="DonateTo"+vo.userId+"@"+vo.time;
		var cookie=page.getCookie("M1Donate",cookieName);
		if(!cookie)
		{
			cookie={};
		}
		else
		{
			cookie=fromJSON(cookie);
		}
		if(codeName)//获取单个兵种数量
		{
			if(!cookie[codeName])
			{
				return 0;
			}
			else
			{
				return cookie[codeName];
			}
		}
		else
		{
			var totalDonate=0;
			for(var i in cookie)
				totalDonate+=cookie[i];
			return totalDonate;
		}
	};

	//存储给某个玩家的特定要兵请求的捐兵信息
	__Page.stateChat.setDonateCookie=function(vo)
	{
		var appEnv=this.appEnv;
		var page=this.page;

		var cookieName="DonateTo"+vo.userId+"@"+vo.time;
		var cookie=page.getCookie("M1Donate",cookieName);
		if(!cookie)
		{
			cookie={};
		}
		else
		{
			cookie=fromJSON(cookie);
		}
		var unitVO=vo.donateUnit;
		if(!cookie[unitVO.codename])
		{
			cookie[unitVO.codename]=1;
		}
		else
		{
			cookie[unitVO.codename]++;
		}
		page.setCookie("M1Donate",cookieName,toJSON(cookie),3*24*60*60);
	};

	__Page.stateChat.getUnitNum=function(codeName)
	{
		var unitStorage=window.aisGame.curCity.unitStorage;
		var slot,def,num;
		for(var i in unitStorage.slots)
		{
			slot=unitStorage.slots[i];
			def=slot.def;
			if(codeName==def.codeName)
			{
				num=slot.num;
				return num;
			}
		}
		return 0;
	};

	__Page.stateChat.getDonateListCSS=function(vo)
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var keyid;
		this.donateUnitKeys={};
		var def=window.aisEnv.defLib.unit;
		var maxDonate=window.aisEnv.defLib.globals["MAX_DONATE_UNITS"];
		var units=def.allUnits;
		if(units && units.length)
		{
			var len=units.length;
			var iconW=80,iconH=102,dt=2;
			var bx=3,by=30;
			var hNum=2;
			var wNum=Math.ceil(len/hNum);
			var totalDonate=this.getDonateNum(vo);
			var arrow=imgLib.getImg("pic_menu_arrow");
			var boxW=(iconW+dt*2)*wNum+20, boxH=by+(iconH+dt*2)*hNum+23;
			var css={id:"donateBox",type:"div3x3",w:boxW,h:boxH,ui_event:1,css:imgLib.getImg("box_menu"),size3x3:[10,10,10,13],totalDonate:totalDonate,items:[
					{id:"arrow",type:"icon",pos:[2,boxH/2,0],css:arrow,anchor_h:2,anchor_v:2},
					{id:"donateNum",type:"text",pos:[bx+10,by/2+10,0],w:iconW,h:by,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,text:textLib["DonateNum"](totalDonate,maxDonate),color_r:0,color_g:0,color_b:0,color_a:200}
				],
				state:this,
				update:function(codeName)
				{
				//	DBOut("donateBox update: "+codeName);
				//	if(codeName)
				//	{
				//		this.getItemById(codeName).update(codeName);
				//	}
				//	else
					{
						var i, hud, msg=this.state.donateBox.msg;
						for(i in this.state.donateUnitKeys)
						{
							if(this.state.donateBox)
							{
								hud=this.getItemById(this.state.donateUnitKeys[i]);
								hud.update(codeName);
							}
						}
					}
				}
			};
			var i,x,y,items,css,unit,unitNum,donateNum;
			var level, lvPic=imgLib.getImg("pic_lv1");
			for(i=0; i<units.length; i++)
			{
				unit=def[units[i]];
				level=window.aisGame.king.getUnitLevel(unit.codeName);
				lvPic=imgLib.getImg("pic_lv"+(level+1));
				x=iconW/2+i%wNum*(iconW+dt*2)+dt+10;
				y=by+iconH/2+Math.floor(i/wNum)*(iconH+dt*2)+dt+10;
				keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.onDonateUnitClk);
				this.donateUnitKeys[keyid+""]=unit.codeName;
				unitNum=this.getUnitNum(unit.codeName);
				donateNum=this.getDonateNum(vo,unit.codeName);
			//	totalDonate+=donateNum;
			//	css.totalDonate=totalDonate;
				css.items.push({id:unit.codeName,type:"key",pos:[x,y,0],w:iconW,h:iconH,anchor_h:1,anchor_v:1,ui_event:1,button:1,down_scale:0.98,key:keyid,
					state_up:{w:iconW,h:iconH},audio:this.page.audioObject.genFileURL("btn_click"),//enable:(0==unitNum || window.aisEnv.defLib.globals["MAX_DONATE_UNITS"]<=totalDonate)?0:1,
					items:[
						{id:"chr-bg",type:"div3x3",pos:[0,0,0],w:iconW,h:iconH,css:imgLib.getImg("box_shopitem"),size3x3:[10,10,10,10],anchor_h:1,anchor_v:1,},//box_unit_bg
						{id:"chr-icon",type:"icon",pos:[0,(iconW-iconH)/2,0],w:iconW,h:iconW,css:imgLib.getIcon("chr_"+unit.codeName,128),anchor_h:1,anchor_v:1},
						{id:"num-donate",type:"text",pos:[5,5,0],w:iconW,h:iconH,anchor_h:1,anchor_v:1,align_h:0,align_v:0,text:donateNum+"",font_size:FS.S,color_a:255},
						{id:"remain-bg",type:"div3x3",pos:[0,iconH/2,0],w:iconW,h:iconH-iconW,anchor_h:1,anchor_v:2,css:imgLib.getImg("box_dark")},
						{id:"icon-lv",type:"icon",pos:[dt+lvPic.w/2-iconW/2,iconH/2-(iconH-iconW)-lvPic.h/2,0],css:lvPic,anchor_h:1,anchor_v:1},
						{id:"num-left",type:"text",pos:[0,0,0],w:iconW-8,h:iconH-8,anchor_h:1,anchor_v:1,align_h:2,align_v:2,text:textLib.getRemainNum(unitNum),font_size:FS.S,color_a:255}
					],
					state:this,unitNum:unitNum,donateNum:donateNum,def:unit,
					_setEnabled:function()
					{

					},
					update:function(codeName)
					{
						if(codeName==this.def["codeName"])
						{
							this.getFather().totalDonate++;
							this.donateNum++;
							this.unitNum--;
						//	this.unitNum=this.state.getUnitNum(codeName)
						}
						this.getItemById("num-donate").setText(this.donateNum+"");
						this.getItemById("num-left").setText(textLib.getRemainNum(this.unitNum));
						//DBOut("+++ donate "+codeName+", totalDonate="+this.getFather().totalDonate+", donateNum="+this.donateNum);
						//DBOut("=== "+this.def.codeName+" storageSize="+this.def["storageSize"]+", remainPlace="+this.state.donateBox.msg.remainPlace);
						//DBOut("*** maxDonate="+maxDonate+",totalDonate="+this.getFather().totalDonate);
						this.getFather().getItemById("donateNum").setText(textLib["DonateNum"](this.getFather().totalDonate,maxDonate));
						if(0==this.unitNum || this.def["storageSize"]>this.state.donateBox.msg.remainPlace){
							this.setKey(0);
							this.getItemById("chr-icon").setColor([50,50,50,128]);
							if(0==this.unitNum)
								this.getItemById("num-left").setColor(255,0,0,255);
						}if(maxDonate<=this.getFather().totalDonate){
							this.state.selItem.getItemById("btn").setDisplay(0);
							this.state.removeDonate(1,0,1,0);
						}else{
							this.state.selItem.getItemById("btn").setEnabled(1);
						}
					}
				})
			}
			return css;
		}
	};

	__Page.stateChat.getVipLevel=function(userId)
	{
		var members=[], member;
		if(this.clanInitVO)
			members=this.clanInitVO.clanVO.members;
		var i, vipLevel;
		for(i=0; i<members.length; i++)
		{
			if(userId==members[i].userId)
			{
				vipLevel=members[i].vipLevel;
				break;
			}
		}
		if(!vipLevel)
		{
			member=this.getLeaveMembers(userId);
			if(member && member.vipLevel)
				vipLevel=member.vipLevel;
		}
		vipLevel=vipLevel?vipLevel:0;
		return vipLevel;
	};

	__Page.stateChat.getLeaveMembers=function(mvo)
	{
		var members=[], i;
		var cookie=this.page.getCookie(cookieDomain+"ClanLeave","Members");
		if(cookie)
		{
			members=fromJSON(cookie);
		}
		if(!mvo)
		{
			return members;
		}
		if("object"==typeof(mvo))
		{
			members.unshift(mvo);
			this.page.setCookie(cookieDomain+"ClanLeave","Members",toJSON(members),60*60*24*5);
		}
		else
		{
			for(i=0; i<members.length; i++)
			{
				if(mvo==members[i].userId)
					return members[i];
			}
			return 0;
		}
	};

	//--------------------------------------------------------------------------
	//逻辑更新相关的函数
	//--------------------------------------------------------------------------
	{
		__Page.stateChat.aisUpdateView=function()
		{
			var page=this.page;
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;

			var newMsg=this.msgObj.msgs[0];
			if(newMsg && this.firstMsg && this.firstMsg!=newMsg)
				appEnv.showClanTechLog(newMsg);
			if(!this.clanInitVO && this.curStatus==this.STATUS_CLAN)
				this.showBox_Clan(1,0,1,0);
			var i,item;
			var members=[];
			if(this.clanInitVO)
				members=this.clanInitVO.clanVO.members;
			//DBOut("=====stateChat.aisUpdateView \r\n###"+toJSON(newMsg));
			if(newMsg && this.firstMsg!=newMsg)
			{
				if(this.msgObj.CHAT_MSG_LEAVE == newMsg.type || this.msgObj.CHAT_MSG_KICK == newMsg.type)//退盟 || 被踢
				{
					if(appEnv.curDlg)
					{
						var curDlg=appEnv.curDlg;
						if("dlgClan"==curDlg.name || "dlgClanTech"==curDlg.name)
						{
							appEnv.closePmtDlg(null,null,0);
							appEnv.closeDlg(null,null,0);
						}
					}
					if(newMsg.userId==window.USERID)
					{
						window.aisGame.curCity.allianceFlag=0;
						window.aisGame.curCity.allianceId=0;
						appEnv.landWarInfo=null;
						appEnv.landWarDetail=null;
						this.msgObj.msgs=[];
						this.firstMsg=null;
						page.stateHome.clanInitVO=this.clanInitVO=null;
						if(this.curStatus==this.STATUS_CLAN)
							this.showBox_Clan(1,0,1,0);
						this.clanLine.update(null);
						if(this.msgObj.CHAT_MSG_LEAVE == newMsg.type)
							appEnv.stateLogs.showLog(textLib["ULeaveClan"]);
						else
							appEnv.stateLogs.showLog(textLib["UBeKick"]);
						return;
					}
					else
					{
						DBOut("msg, userId="+newMsg.userId);
						for(i=0; i<members.length; i++)
						{
							//DBOut("member id="+members[i].userId+", "+toJSON(members[i]));
							if(members[i].userId==newMsg.userId)
							{
								members.splice(i,1);
								this.getLeaveMembers(members[i]);
								break;
							}
						}
						if(this.msgObj.CHAT_MSG_LEAVE == newMsg.type && "leader"==newMsg.words)
						{
							appEnv.stateLogs.showLog(textLib["LeaderLeaveClan"](newMsg.userName));
						}
					}
					if(this.donateBox && (newMsg.userId==this.donateBox.msg.userId))
					{
						this.removeDonate(1,0,1,0);
					}
				}
				else if(this.msgObj.CHAT_MSG_DISMISE == newMsg.type)//禅让
				{
					if(newMsg.userId==window.USERID)
					{
						this.clanInitVO.rankLevel=this.msgObj.CLAN_RANK_LEADER;
						appEnv.stateLogs.showLog(textLib["UBeLeader"]);
					}
					else
					{
						appEnv.stateLogs.showLog(textLib["NewLeader"](newMsg.userName));
					}
					for(i=0; i<members.length; i++)
					{
						//DBOut("member id="+members[i].userId+", "+toJSON(members[i]));
						if(members[i].userId==newMsg.userId)
						{
							members[i].rankLevel=this.msgObj.CLAN_RANK_LEADER;
						}
					}
				}
//				else if(this.msgObj.CHAT_MSG_KICK == newMsg.type)//被踢
//				{
//					if(newMsg.userId==window.USERID)
//					{
//						window.aisGame.curCity.allianceId=0;
//						this.msgObj.msgs=[];
//						page.stateHome.clanInitVO=this.clanInitVO=null;
//						this.showBox_Clan(1,0,1,0);
//						this.clanLine.update(null);
//						appEnv.stateLogs.showLog(textLib["UBeKick"]);
//						return;
//					}
//					else
//					{
//						for(i=0; i<members.length; i++)
//						{
//							if(members[i].userId==newMsg.userId)
//							{
//								members.splice(i,1);
//								break;
//							}
//						}
//					}
//				}
				else if(
					(this.msgObj.CHAT_MSG_JOIN == newMsg.type && this.msgObj.JOIN_CLAN_TYPE_ANYONE == newMsg.appendMsg) ||
					(this.msgObj.CHAT_MSG_JOIN_RESULT == newMsg.type && 1==newMsg.appendMsg)
				)//入盟
				{
					if(!newMsg.responseStatusCode)//-2!=
					{
						if(newMsg.userId==window.USERID)
						{
							this.msgObj.msgs=[];//由于在loginLcan时会再一次添加联盟消息，包含此入盟消息，所以在这里置空一次。
							page.stateHome.loginClan();
							appEnv.stateLogs.showLog(textLib["UJoinClan"]);
							var bld=aisGame.king.getHashObj("Obj0");
							if(bld)
							{
								this.page.vwHomeStage.updateBld(bld.homeBld,1);
							}
							return;
						}
						else
						{
							members.push({donateUnits:0,name:newMsg.userName,rankLevel:newMsg.rankLevel,score:newMsg.userScore,totalUnitPlace:newMsg.totalPlace,units:[],
								userExp:newMsg.userExp,userId:newMsg.userId,curClanCupScore:0,receiveUnits:0,joinClanTime:newMsg.time,//window.aisEnv.dateTime()-window.aisGame.king.debugTime,
								internshipTime:window.aisEnv.defLib.globals["CLAN_MEMBER_INTERNSHIP_HOUR"]*window.hourMS,
								tmpContributionGems:0,tmpContributionTimes:0,tmpTechGems:0,tmpTechTimes:0,tmpTotalGems:0,tmpTotalTimes:0});
						}
					}
					else
					{
						if(this.msgObj.CHAT_MSG_JOIN == newMsg.type && this.msgObj.JOIN_CLAN_TYPE_ANYONE == newMsg.appendMsg)
							appEnv.stateLogs.showLog(textLib["JoinClanError"]);
						else if(this.msgObj.CHAT_MSG_JOIN_RESULT == newMsg.type && 1==newMsg.appendMsg)
						{
							appEnv.stateLogs.showLog(textLib["UserJoinedClan"]);
							var x, hud, hudMsg;
							for(x=0; x<this.cntBox.getItemNum(); x++)
							{
								hud=this.cntBox.itemAt(x);
								hudMsg=hud.msg;
								if(newMsg.id == hudMsg.id)// && -2==msg.responseStatusCode
								{
									this.removeMsgItem(x);
									return;
								}
							}
						}
					}
				}
				else if(this.msgObj.CHAT_MSG_APPOINT == newMsg.type)//委任
				{
					if(newMsg.userId==window.USERID)
					{
						page.stateHome.clanInitVO.rankLevel=newMsg.rankLevel;//this.msgObj.CLAN_RANK_OFFICER;
						appEnv.stateLogs.showLog(textLib["UBePromote"]);
					}
					if(this.msgObj.CLAN_RANK_LEADER==newMsg.rankLevel)
					{
						for(i in members)
						{
							if(members[i].rankLevel==this.msgObj.CLAN_RANK_LEADER)
							{
								if(members[i].userId==window.USERID)
									page.stateHome.clanInitVO.rankLevel=this.msgObj.CLAN_RANK_MEMBER;
								members[i].rankLevel=this.msgObj.CLAN_RANK_MEMBER;
								break;
							}
						}
					}
					for(i in members)
					{
						if(members[i].userId==newMsg.userId)
						{
							members[i].rankLevel=newMsg.rankLevel;//this.msgObj.CLAN_RANK_OFFICER;
							break;
						}
					}
				}
				else if(this.msgObj.CHAT_MSG_DONATE == newMsg.type || this.msgObj.CHAT_MSG_DONATE_TO_SELF == newMsg.type)//捐兵 || 自捐
				{
					var donateName,words=newMsg.words.split("#!$#");
					if(2==words.length)
					{
						donateName=words[0];
						newMsg.words=words[1];
					}
					else
					{
						donateName=newMsg.words;
					}
					if(newMsg.donateUserId==window.USERID)
					{
						DBOut("will setDonateCookie");
						this.setDonateCookie(newMsg);
//						if(this.donateBox && (newMsg.id==this.donateBox.msg.id))
//						{
//							DBOut("will handle donateBox");
//							if(!newMsg.remainPlace)
//								this.removeDonate(1,0,1,0);
//							this.donateBox.getItemById("donateBox").update(newMsg.donateUnit.codename);
//						}
					}
					else if(newMsg.userId==window.USERID)
					{
						var unitname=window.aisEnv.defLib.unit[newMsg.donateUnit.codename].name;
						var unitlevel=newMsg.donateUnit.level;
						appEnv.stateLogs.showLog(textLib.Donate2U(donateName,unitname,unitlevel));
					}
					if(this.donateBox && (newMsg.id==this.donateBox.msg.id))
					{
						if(!newMsg.remainPlace)
							this.removeDonate(1,0,1,0);
						else if(newMsg.donateUserId!=window.USERID){
							var storageSize=window.aisEnv.defLib.unit[newMsg.donateUnit.codename].storageSize;
							this.donateBox.msg.remainPlace-=storageSize;
							this.donateBox.getItemById("donateBox").update();
						}
					}
				}
				else if(this.msgObj.CHAT_MSG_REINFORCE == newMsg.type)//要兵
				{
					//DBOut("要兵了");
					if(this.donateBox)
					{
						//DBOut("正在捐");
						var dntMsg=this.donateBox.msg;
						DBOut(newMsg.userId+" vs "+dntMsg.userId);
						if(newMsg.userId==dntMsg.userId)
						{
							this.removeDonate(1,0,1,0);
						}
					}
				}
				else if(this.msgObj.CHAT_MSG_DECLAREWAR == newMsg.type && !newMsg.responseStatusCode)
				{
					var defLib=window.aisEnv.defLib.clanCupDomains;
					var areaDef=defLib[newMsg.appendMsg];
					var str=textLib.getTextEx("ClanDeclareWar",{area:areaDef["name"]});
					if(window.aisGame.curCity.allianceId)
						appEnv.stateLogs.showLog(str);
				}
				else if(this.msgObj.CHAT_MSG_DONATE_GET_POINTS == newMsg.type || this.msgObj.CHAT_MSG_RESPOND_CALL == newMsg.type || this.msgObj.CHAT_MSG_CALL_GEM == newMsg.type)//捐献 || 响应联盟号召 || 钻秒科技
				{
					appEnv.updateMemberDevote(newMsg);
				}
				if(this.chatBox.getDisplay())//showing
				{
//					if(this.firstMsg && (this.firstMsg.id==newMsg.id))
//					{
//						DBOut("will update msg item");
//						for(i in this.donateKeys)
//						{
//							if(this.msgObj.checkMessage(newMsg, this.donateKeys[i]))
//								this.donateKeys[i]=newMsg;
//						}
//						item=this.cntBox.itemAt(0).firstChild().getNextItem();
//						if(item.update)
//							item.update(newMsg);
//						else
//							DBOut(" have no update func.");
//					}
//					else
					{
						if(this.msgObj.CHAT_MSG_CALL_ON == newMsg.type || this.msgObj.CHAT_MSG_RESPOND_CALL == newMsg.type || this.msgObj.CHAT_MSG_CALL_GEM == newMsg.type)//联盟号召 || 响应联盟号召 || 钻秒科技
						{
							if(this.curStatus==this.STATUS_CLAN)
								this.tipHudR.setDisplay(1);
						}
						else
						{
							if(this.curStatus==this.STATUS_TECH)
								this.tipHudL.setDisplay(1);
						}
						DBOut("will handle new msg");
						this.firstMsg=newMsg;
						if(this.curStatus==this.STATUS_CLAN)
						{
							this.updateMsgItems(newMsg);//.msg
						}
						else if(this.curStatus==this.STATUS_TECH)
						{
							this.updateTechItems();
						}
					}
				}
				else//hiding
				{
					DBOut("will show num on sideBtn ");
					this.btnSide.getItemById("NewMark").setDisplay(1);
				}
			}
			else
			{
				DBOut("no new msg!");
			}
		};
	}

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.stateChat.onKey=function(msg,key,way,extra)
		{
			var ret, css;
			var page=this.page;
			var appEnv=this.appEnv;
			var imgLib=page.imgLib;
			if(1==msg && 1==way)
			{
			//	DBOut("stateChat.onKey: "+msg+", "+key);
			}
			//Default:
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
		};

		__Page.stateChat.switchChat=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				var page=this.page;
				var appEnv=this.appEnv;
				var cssLib=page.cssLib;
				var imgLib=page.imgLib;
				if(this.chatBox.getDisplay())//hide
				{
				//	appEnv.hudOut(this.chatBox,10);
					this.chatDock.hiding=1;
					this.chatDock.startAniEx([this.chatX,0,0],1,1,0,3);
					css=imgLib.getImg("btn_sideIn");
					this.sideObj.setTexUV([css.tex_u,css.tex_v,css.tex_w,css.tex_h]);
				}
				else//show
				{
					this.btnSide.getItemById("NewMark").setDisplay(0);
				//	appEnv.hudIn(this.chatBox,10);
					this.chatBox.setDisplay(1);
					this.chatDock.showing=1;
					this.chatDock.startAniEx([this.chatX+this.chatW,0,0],1,1,0,3);
					css=imgLib.getImg("btn_sideOut")
					this.sideObj.setTexUV([css.tex_u,css.tex_v,css.tex_w,css.tex_h]);
					if(this.STATUS_CLAN==this.curStatus)
						this.showBox_Clan(1,0,1,0);
					else if(this.STATUS_TECH==this.curStatus)
						this.showBox_Tech(1,0,1,0);
				}
				return 1;
			}
		};

		__Page.stateChat.showBox_Tech=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("showBox_Tech");
				var page=this.page;
				var appEnv=this.appEnv;
				var cssLib=page.cssLib;
				var imgLib=page.imgLib;

				this.topBtnL.setEnabled(1);
				this.topBtnR.setEnabled(0);

			//	this.clanLine.setDisplay(0);
			//	this.inputLine.setPos([0,this.inputLineY,0]);
				this.inputLine.setDisplay(0);
				this.topBox.setH(this.topBoxH);
				this.cntBox.setPos([this.cntX,this.cntY,0]);
				this.cntBox.setH(this.cntH);

				this.curStatus=this.STATUS_TECH;

				this.cntBox.removeAllChild();
				this.cntBox.clearItems();
				this.inputTxt.setText("");
				this.txtMsg="";
				this.addItems_Tech();
			}
		};

		__Page.stateChat.showBox_Clan=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("showBox_Clan");
				var page=this.page;
				var appEnv=this.appEnv;
				var cssLib=page.cssLib;
				var imgLib=page.imgLib;

				this.topBtnL.setEnabled(0);
				this.topBtnR.setEnabled(1);

			//	this.clanLine.setDisplay(1);
			//	this.inputLine.setPos([0,this.inputLineY_clan,0]);
				this.inputLine.setDisplay(1);
				this.topBox.setH(this.topBoxH_clan);
				this.cntBox.setPos([this.cntX,this.cntY_clan,0]);
				this.cntBox.setH(this.cntH_clan);

				this.curStatus=this.STATUS_CLAN;

				this.cntBox.removeAllChild();
				this.cntBox.clearItems();
				this.inputTxt.setText("");
				this.txtMsg="";
				this.addItems_Clan();
			}
		};

		__Page.stateChat.onInputClk=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("onInputClk "+extra);
				var textLib=this.appEnv.textLib;
				var maxStrLen=60;
				//Dialog.getText(tip, default, max, type)
				var txtTip=textLib["InputChatMsg"], txtDefault="";
				if(-1==extra)
					txtTip=textLib["IllegalInput"];
				if(this.txtMsg)
					txtDefault=this.txtMsg;
				var txt=Dialogs.getText(txtTip,txtDefault);
				if(txt)
				{
					//检测输入是否含有非法字符
//					if(this.appEnv.isNameValid4CJK(txt,"chat"))
//					{
//						this.appEnv.layer.setFrameout(10,function(){this.onInputClk(1,0,1,-1);},this);
//						return;
//					}
					txt=this.appEnv.isNameValid4CJK(txt,"chat");

					if(txt.length>maxStrLen)
					{
						txt=txt.substr(0,maxStrLen);
					}
					this.inputTxt.setText(txt);
					this.inputTxt.setColor(0,0,0,200);
					this.txtMsg=txt;
					this.onSendMsgClk(1,0,1,0);
				}
				else
				{

				}
			}
		};

		__Page.stateChat.onSendMsgClk=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("onSendMsgClk");
				if(!window.aisGame.curCity.allianceId)
				{
					this.page.stateLogs.showLog(this.appEnv.textLib["ClanNotJoin"]);
					return;
				}
				if(!this.txtMsg)
					return;
				if(this.STATUS_TECH==this.curStatus)
				{
					DBOut("send tech msg: "+this.txtMsg);
				}
				else if(this.STATUS_CLAN==this.curStatus)
				{
					DBOut("send clan msg: "+this.txtMsg);
					if(!this.clanInitVO)
						return;
					this.inputTxt.setText("");
					window.aisGame.king.sendNTCmd(window.aisGame.king,"ClanWords",{words:this.txtMsg},window.aisGame.king);
					this.txtMsg="";
				}
			}
		};

		__Page.stateChat.onClanInfoClk=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("onClanInfoClk");

				if(this.clanInitVO || this.page.vwHomeStage.checkClan())
					this.page.stateHome.onAllianceClick(msg,key,way,extra);
				else
					return;
			}
		};

		__Page.stateChat.onMsgClk=function(msg,key,way,extra)
		{
			if(1==way)
			{
				if(0==msg)
				{
					DBOut("onMsgClk down");
					this.lbxResponse=1;
					this.selMsg=extra;
					this.selItem=this.cntBox.itemAt(extra);
				}
				else if(2==msg)
				{
					DBOut("onMsgClk check");
					if(this.lbxResponse)
					{
						DBOut("Do lbx reponse!");
					}
				}
			}
		};

		__Page.stateChat.onDonateClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==msg && 1==way)
			{
				DBOut("onDonateClk, selMsg="+this.selMsg);
				var appEnv=this.appEnv;
				var sw=appEnv.scrSize[0], sh=appEnv.scrSize[1];
				var lbxPos=[], pos=[];
				this.cntBox.getPos(lbxPos);
				var item=this.selItem;
				var btn=item.getItemById("btn");
				var y=this.cntBox.getCurPos();
				y+=(this.itemH*this.selMsg);
				pos=[lbxPos[0]+this.cntW,lbxPos[1]+y,0];
				var css=this.getDonateListCSS(this.donateKeys[key]);
				if(pos[1]+css.h>sh)
				{
					pos[1]=sh-css.h;
				}
				DBOut("add pos "+pos);
				var layer=this.appEnv.layer;
				var keyid=appEnv.hudKeys.getKey(this);
				this.regKeyVO(keyid,this,this.removeDonate);
				this.donateBox=this.chatDock.appendNewChild({type:"icon",pos:[0,0,0],w:sw,h:sh,ui_event:1,items:[
					{type:"key",pos:[0,0,0],ui_event:1,button:1,key:keyid,state_up:{w:sw,h:sh},},
					{css:css,pos:pos}
				],msg:item.msg});
				this.donateBox.getItemById("donateBox").update();
			}
		};

		__Page.stateChat.onRefuseClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==msg && 1==way)
			{
				DBOut("onRefuseClk");//comVO:{clanId:0,result:0,msgId:0}
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var selfRank=-3;
				if(this.clanInitVO)selfRank=this.clanInitVO.rankLevel;
				var msgObj=this.msgObj;
				if(!msgObj || (selfRank!=msgObj.CLAN_RANK_LEADER && selfRank!=msgObj.CLAN_RANK_OFFICER && selfRank!=msgObj.CLAN_RANK_DEPUTY_LEADER))
				{
					appEnv.stateLogs.showLog(textLib["UHaveNoJurisdiction"]);
					return;
				}
				var vo=this.joinKeys[key+""];
				var comVO={clanId:this.clanInitVO.clanVO.id, result:0, msgId:vo.id};
				window.aisGame.king.sendNTCmd(window.aisGame.king,"ClanJoin4Approval",comVO,window.aisGame.king);
			}
		};

		__Page.stateChat.onAgreeClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==msg && 1==way)
			{
				DBOut("onAgreeClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var selfRank=-3;
				if(this.clanInitVO)selfRank=this.clanInitVO.rankLevel;
				var msgObj=this.msgObj;
				if(!msgObj || (selfRank!=msgObj.CLAN_RANK_LEADER && selfRank!=msgObj.CLAN_RANK_OFFICER && selfRank!=msgObj.CLAN_RANK_DEPUTY_LEADER))
				{
					appEnv.stateLogs.showLog(textLib["UHaveNoJurisdiction"]);
					return;
				}
				var membersNum=this.clanInitVO.clanVO.members.length;
				if(membersNum>=appEnv.getClanMemberMax())
				{
					appEnv.stateLogs.showLog(textLib["ClanMembersMax"]);
					return;
				}
				var vo=this.joinKeys[key+""];
				var comVO={clanId:this.clanInitVO.clanVO.id, result:1, msgId:vo.id};
				window.aisGame.king.sendNTCmd(window.aisGame.king,"ClanJoin4Approval",comVO,window.aisGame.king);
			}
		};

		__Page.stateChat.removeDonate=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("removeDonate");
				if(!this.donateBox)return;
				this.chatDock.removeChild(this.donateBox);
				this.donateUnitKeys={};
				this.donateBox=null;
			}
		};

		__Page.stateChat.onDonateUnitClk=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				var item=this.selItem;
				var msgId=item.msg.id;
				var codeName=this.donateUnitKeys[key];
				var unitNum=this.getUnitNum(codeName);
				DBOut("onDonateUnitClk, msgId="+msgId+", codeName="+codeName);
				if(!unitNum)
				{
					DBOut("have no unit: "+codeName);
					return;
				}
				window.aisGame.king.sendNTCmd(window.aisGame.king,"ClanDonate",{reinforceMsgId:msgId,unitCodename:codeName},window.aisGame.king);

				{
				//	DBOut("will setDonateCookie");
				//	this.setDonateCookie(this.donateBox.msg);
					DBOut("will handle donateBox");
					var msg=this.donateBox.msg;
					var def=window.aisEnv.defLib.unit[codeName];
					var storageSize=def["storageSize"];
					msg.remainPlace-=storageSize;
					this.donateBox.getItemById("donateBox").update(codeName);
					if(msg.remainPlace<=0)
					{
						this.removeDonate(1,0,1,0);
						item.getItemById("btn").setDisplay(0);
					}
				}
			}
		};

		__Page.stateChat.onShareClk=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("onShareClk, selMsg="+this.selMsg);
				var appEnv=this.appEnv;
			//	var item=this.selItem;
			//	var btn=item.getItemById("btn");
				var info=this.shareKeys[key];
				DBOut("share: "+toJSON(info));
				this.page.stateHome.onReplayClick(info.appendMsg);
			}
		};

		__Page.stateChat.onTechResponseClk=function(msg,key,way,extra)
		{
			if(1==msg && 1==way)
			{
				DBOut("onTechResponseClk, selMsg="+this.selMsg);
				var appEnv=this.appEnv;
				var info=this.techResponseKeys[key];
				DBOut("Tech: "+toJSON(info));
				var comVO={codeName:info.codename, techLevel:appEnv.getClanTechLv(info.codename)};//info.level
				this.page.vwHomeStage.clanTechDonate(comVO);
			}
		};
	}
}
