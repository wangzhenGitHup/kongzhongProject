{//创建军团
	__Page.dlgClan.Create_loadUI=function(state,param)
	{
		if(!this.state_Create)
			this.state_Create={name:"Create"};
		var state=this.state_Create;
		if(state.loaded)return;
		state.loaded=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var t=30;
		var dt=150+t;
		var cntW=state.cntW=this.contentW-dt*2;
		var textX=state.textX=280+t-19;
		var textW=state.textW=textX-dt;
		var textH=state.textH=28;
		var hudW=state.hudW=350;
		var hudX=state.hudX=this.contentW-dt-hudW-19;
		dt=12;
		var nameH=state.nameH=40;
		var nameY=state.nameY=this.contentInner[1]+10+nameH/2;
		var pic=imgLib.getImg("pic_backbadge");
		var badgeH=state.badgeH=pic.h;
		var badgeY=state.badgeY=nameY+nameH/2+dt+badgeH/2;
		var declareH=state.declareH=120;
		var declareY=state.declareY=badgeY+badgeH/2+dt;
		pic=imgLib.getImg("btn_select_l");
		var modeH=state.modeH=pic.h;
		var modeY=state.modeY=declareY+declareH+dt+modeH/2;
		var requireH=state.requireH=pic.h;
		var requireY=state.requireY=modeY+modeH/2+dt+requireH/2;
		var lineY=state.lineY=requireY+requireH/2+dt;
		pic=imgLib.getImg("btn_green_u");
		state.btnSubmitY=lineY+dt*2+pic.h/2;

		state.joinMode=[textLib["ClanType0"],textLib["ClanType1"],textLib["ClanType2"],textLib["ClanType3"]];
		state.minMode=0;
		state.maxMode=state.joinMode.length-1;
		state.curFlag=1;
		state.curJoinMode=0;
		state.minMedal=0;
		state.maxMedal=3000;
		state.curJoinMedal=0;
	};
	__Page.dlgClan.Create_loadUI();

	__Page.dlgClan.Create_initUI=function(state,param)
	{
		var state=this.state_Create;
		if(state.inited)return;
		state.inited=1;
		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		var cvo;
		if(this.clanInitVO)
		{
			cvo=this.clanInitVO.clanVO;
			state.clanName=cvo.name;
			state.clanDeclare=cvo.description;
			state.curFlag=cvo.flag;
			state.curJoinMode=cvo.clanType;
			state.curJoinMedal=cvo.honorScore;
		}
		state.badgeBox=this.cntBox.appendNewChild({id:"Create-badge",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0],display:0});
		var cntBox=state.cntBox=this.cntBox.appendNewChild({id:"clanCreate",type:"icon",pos:[0,0,0],w:this.contentW,h:this.contentH,ui_event:1,display:0,fade:1,fade_alpah:0,fade_size:1,fade_pos:[0,0,0]});
		state.txtName=cssLib.textFineMid.create(cntBox,[state.textX,state.nameY,0],textLib["ClanName"]+":",state.textW,state.textH,2,1,2,1);
		if(!cvo)
		{
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.Create_onInputNameClk);
			state.boxInputName=cntBox.appendNewChild({type:"div3x3",id:"inputBox",pos:[state.hudX,state.nameY,0],w:state.hudW,h:state.nameH,css:imgLib.getImg("box_chat_input"),anchor_h:0,anchor_v:1,ui_event:1,
				items:[
					{type:"key",pos:[0,0,0],w:state.hudW,h:state.nameH,anchor_h:0,anchor_v:1,key:keyid,button:1,ui_event:1,state_up:{w:state.hudW,h:state.nameH},audio:this.page.audioObject.genFileURL("btn_click"),},
					{type:"text",id:"txt",pos:[0,3,0],w:state.hudW,h:state.nameH,anchor_h:0,anchor_v:1,align_h:1,align_v:1,text:textLib["InputClanName"],color_r:60,color_g:60,color_b:60,color_a:160,font_size:FS.FM}
				]
			});
			state.txtInputName=state.boxInputName.getItemById("txt");
		}
		else
		{
			cntBox.appendNewChild({css:cssLib.textFineMid.createCSS([state.hudX,state.nameY,0],cvo.name,state.textW,state.textH,0,1,0,1)});
		}

		state.txtBadge=cssLib.textFineMid.create(cntBox,[state.textX,state.badgeY,0],textLib["ClanBadge"]+":",state.textW,state.badgeH,2,1,2,1);
		state.bgBadge=cntBox.appendNewChild({type:"icon",pos:[state.hudX+90,state.badgeY,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_select"),
			items:[
				{type:"icon",id:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon("badge"+state.curFlag,64)}
			]
		});
		state.iconBadge=state.bgBadge.getItemById("icon");

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.Create_onModifyClk);
		state.btnModify=cssLib.normalBtn.create(cntBox,[state.hudX+236,state.badgeY,0],keyid,0,textLib["ClanModify"],124,50);
		state.txtDeclare=cssLib.textFineMid.create(cntBox,[state.textX,state.declareY,0],textLib["ClanDeclare"]+":",state.textW,state.textH,2,0,2,0);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.Create_onInputDeclareClk);
		state.boxInputDeclare=cntBox.appendNewChild({type:"div3x3",id:"inputBox",pos:[state.hudX,state.declareY,0],w:state.hudW,h:state.declareH,css:imgLib.getImg("box_chat_input"),anchor_h:0,anchor_v:0,ui_event:1,
			items:[
				{type:"key",pos:[0,0,0],w:state.hudW,h:state.declareH,anchor_h:0,anchor_v:0,key:keyid,button:1,ui_event:1,state_up:{w:state.hudW,h:state.declareH},audio:this.page.audioObject.genFileURL("btn_click"),},
				{type:"text",id:"txt",pos:[7,9,0],w:state.hudW,h:state.nameH,anchor_h:0,anchor_v:0,align_h:0,align_v:0,text:state.clanDeclare?state.clanDeclare:textLib["InputClanDeclare"],wrap:1,color_r:60,color_g:60,color_b:60,color_a:160,font_size:FS.FM}
			]
		});
		state.txtInputDecalre=state.boxInputDeclare.getItemById("txt");
		
		state.txtJoinMode=cssLib.textFineMid.create(cntBox,[state.textX,state.modeY,0],textLib["JoinMode"]+":",state.textW,state.textH,2,1,2,1);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.Create_onModeLClk);
		var pic=imgLib.getImg("btn_select_l");
		state.btnModeL=cntBox.appendNewChild({type:"key",pos:[state.hudX+pic.w/2,state.modeY,0],css:pic,anchor_h:1,anchor_v:1,key:keyid,button:1,ui_event:1,down_scale:0.95,
			state_up:{css:pic},state_down:{css:pic,color_a:160},state_gray:{css:pic,color_a:60},audio:this.page.audioObject.genFileURL("btn_click"),});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.Create_onModeRClk);
		pic=imgLib.getImg("btn_select_r");
		state.btnModeR=cntBox.appendNewChild({type:"key",pos:[state.hudX+state.hudW-pic.w/2,state.modeY,0],css:pic,anchor_h:1,anchor_v:1,key:keyid,button:1,ui_event:1,down_scale:0.95,
			state_up:{css:pic},state_down:{css:pic,color_a:160},state_gray:{css:pic,color_a:60},audio:this.page.audioObject.genFileURL("btn_click"),});
		state.txtMode=cntBox.appendNewChild({type:"text",pos:[state.hudX,state.modeY,0],w:state.hudW,h:state.modeH,anchor_h:0,anchor_v:1,align_h:1,align_v:1,text:textLib["ClanType"+state.curJoinMode],wrap:1,color_r:60,color_g:60,color_b:255,color_a:160,font_size:FS.FM});
	//	state.curJoinMode=0;

		state.txtScoreRequire=cssLib.textFineMid.create(cntBox,[state.textX,state.requireY,0],textLib["ScoreRequire"]+":",state.textW,state.textH,2,1,2,1);
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.Create_onRequireLClk);
		var pic=imgLib.getImg("btn_select_l");
		state.btnModeL=cntBox.appendNewChild({type:"key",pos:[state.hudX+pic.w/2,state.requireY,0],css:pic,anchor_h:1,anchor_v:1,key:keyid,button:1,ui_event:1,down_scale:0.95,
			state_up:{css:pic},state_down:{css:pic,color_a:160},state_gray:{css:pic,color_a:60},audio:this.page.audioObject.genFileURL("btn_click"),});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.Create_onRequireRClk);
		pic=imgLib.getImg("btn_select_r");
		state.btnModeR=cntBox.appendNewChild({type:"key",pos:[state.hudX+state.hudW-pic.w/2,state.requireY,0],css:pic,anchor_h:1,anchor_v:1,key:keyid,button:1,ui_event:1,down_scale:0.95,
			state_up:{css:pic},state_down:{css:pic,color_a:160},state_gray:{css:pic,color_a:60},audio:this.page.audioObject.genFileURL("btn_click"),});
		state.txtMedal=cntBox.appendNewChild({type:"text",pos:[state.hudX,state.requireY,0],w:state.hudW,h:state.modeH,anchor_h:0,anchor_v:1,align_h:1,align_v:1,text:state.curJoinMedal+"",wrap:1,color_r:60,color_g:60,color_b:255,color_a:160,font_size:FS.FM});

	//	cntBox.appendNewChild({type:"div3x3",pos:[this.contentW/2,state.lineY,0],w:state.cntW,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green_line")});

		//底部区域
		var cntW=this.contentW, cntH=this.contentH;
		var btmBoxW=cntW-10, btmBoxH=66-4, btmBoxX=cntW/2, btmBoxY=cntH-6-btmBoxH/2;
		state.btmBoxCSS={id:"btmBox",type:"div3x3",pos:[btmBoxX,btmBoxY+2,0],w:btmBoxW,h:btmBoxH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_green"),
			color_r:184,color_g:189,color_b:115,color_a:180,
		};
		state.btmBox=cntBox.appendNewChild({css:state.btmBoxCSS});
		keyid=appEnv.hudKeys.getKey(this);
		var btnW=186, btnH=62;//68
		if(!cvo)
		{
			this.regKeyVO(keyid,this,this.Create_onCreateClk);
			var bad=0;
			if(!this.page.vwHomeStage.checkCost({storage:[{store:"Gold",type:"ResGold",num:window.aisEnv.defLib.globals["CREATE_CLAN_RES"]}]},0))
				bad=1;
			cssLib.btnResGo.create(cntBox,[this.contentW/2,state.btnSubmitY+44,0],btnW,"gold",window.aisEnv.defLib.globals["CREATE_CLAN_RES"],bad,keyid,0,btnH);
		}
		else
		{
			this.regKeyVO(keyid,this,this.Create_onSubmitClk);
			cssLib.normalBtn.create(cntBox,[this.contentW/2,state.btnSubmitY+44,0],keyid,0,textLib["Submit"],btnW-26,btnH);
		}
	};

	__Page.dlgClan.Create_enter=function(state,param)
	{
		var state=this.state_Create;
		state.cntBox.fadeIn(5,0);
	};
	
	__Page.dlgClan.Create_leave=function()
	{
		var state=this.state_Create;
		state.cntBox.fadeOut(5,0);
		state.badgeBox.fadeOut(5,0);
	};
	
	__Page.dlgClan.Create_showBadge=function()
	{
		var state=this.state_Create;
		state.cntBox.fadeOut(5,0);
		state.badgeBox.fadeIn(10,0);
		var appEnv=this.appEnv;
		var keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.Create_onBackClk);
		this.btnBack.setDisplay(1);
		this.btnBack.setKey(keyid);

		if(!state.badgeAdded)
		{
			state.badgeKeys={};
			DBOut("firt time to add badge");
			state.badgeAdded=1;
			var imgLib=this.page.imgLib;
			var cssLib=this.page.cssLib;
			var textLib=appEnv.textLib;

			var cntW=this.contentW, cntH=this.contentH;
			DBOut("cntW="+cntW+", cntH="+cntH);
			cssLib.textFineMid.create(state.badgeBox,[cntW/2,30,0],textLib["SltBadge"],cntW,20,1,1,1,1);
			var i,css,x,y,dt=20;
			var bg=imgLib.getImg("pic_backbadge");
			bg.w=bg.h=68;
			var boxW=cntW-40;
			var boxH=cntH-70;
			var lw=Math.floor(boxW/(bg.w+dt));
			boxW=(bg.w+dt)*lw;
			var lh=Math.floor(boxH/(bg.h+dt));
			boxH=(bg.h+dt)*lh;
			var badgeNum=lw*lh;
			DBOut("lw="+lw+", lh="+lh+", badgeNum="+badgeNum);
			var have=1;
			for(i=0; i<badgeNum; i++)
			{
				have=(i+1)<=40?1:0;
				keyid=0;
				x=(cntW-boxW)/2+(bg.w+dt)/2+(bg.w+dt)*(i%lw);
				y=30+(cntH-boxH-70)/2+(bg.h+dt)/2+(bg.h+dt)*Math.floor(i/lw);
			//	DBOut(have);
				if(have)
				{
					keyid=appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this.Create_onBadgeClk);
					state.badgeKeys[keyid+""]=(i+1);
				}
				css={type:"key",pos:[x,y,0],key:keyid,css:bg,anchor_h:1,anchor_v:1,ui_event:1,button:1,down_scale:0.98,state_up:bg,state_down:bg,items:[
					{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:have?imgLib.getIcon("badge"+(i+1),64):""}
				],audio:this.page.audioObject.genFileURL("btn_click"),};
				state.badgeBox.appendNewChild({css:css});
			}
		}
	};
	
	__Page.dlgClan.Create_leaveBadge=function()
	{
		var state=this.state_Create;
		state.cntBox.fadeOut(5,0);
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgClan.Create_onInputNameClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onInputNameClk");
				var textLib=this.appEnv.textLib;
				var maxStrLen=24;
				var txtTip=textLib["InputClanName"], txtDefault="";
				if(-1==extra)
					txtTip=textLib["IllegalInput"];
				if(state.clanName)
					txtDefault=state.clanName;
				var txt=Dialogs.getText(txtTip,txtDefault);
				if(txt)
				{
					//检测输入是否含有非法字符
					if(this.appEnv.isNameValid4CJK(txt))
					{
						this.appEnv.layer.setFrameout(10,function(){this.Create_onInputNameClk(1,0,1,-1);},this);
						return;
					}

					if(txt.length>maxStrLen)
					{
						//substr(start,lengt), substring(start,stop)
						txt=txt.substr(0,maxStrLen);
					}
					state.txtInputName.setText(txt);
					state.txtInputName.setColor(0,0,0,200);
					state.clanName=txt;
				}
			}
		};
		
		__Page.dlgClan.Create_onModifyClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onModifyClk");

				this.Create_showBadge();
			}
		};
		
		__Page.dlgClan.Create_onInputDeclareClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				var textLib=this.appEnv.textLib;
				DBOut("Create_onInputDeclareClk");
				var maxStrLen=50;
				var txtTip=textLib["InputClanDeclare"], txtDefault="";
				if(-1==extra)
					txtTip=textLib["IllegalInput"];
				if(state.clanDeclare)
					txtDefault=state.clanDeclare;
				var txt;
			//	if(!Dialogs.asyncInputLine)
				if(1 || !Dialogs.asyncInputLine)
				{
					txt=Dialogs.getText(txtTip,txtDefault);
					if(txt)
					{
						//检测输入是否含有非法字符
						if(this.appEnv.isNameValid4CJK(txt))
						{
							this.appEnv.layer.setFrameout(10,function(){this.Create_onInputDeclareClk(1,0,1,-1);},this);
							return;
						}

						if(txt.length>maxStrLen)
						{
							txt=txt.substr(0,maxStrLen);
						}
						state.txtInputDecalre.setText(txt);
						state.txtInputDecalre.setColor(0,0,0,200);
						state.clanDeclare=txt;
					}
				}
				else
				{
					Dialogs.asyncInputLine(textLib["InputClanDeclare"], textLib["OK"], textLib["Cancel"], function(code, text)
					{
						if(code)
						{
							txt=text;
							if(txt)
							{
								if(txt.length>maxStrLen)
								{
									txt=txt.substr(0,maxStrLen);
								}
								state.txtInputDecalre.setText(txt);
								state.txtInputDecalre.setColor(0,0,0,200);
								state.clanDeclare=txt;
							}
						}
					}, this);
				}
			}
		};
		
		__Page.dlgClan.Create_onModeLClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onModeLClk");
				state.curJoinMode--;
				if(1==state.curJoinMode)state.curJoinMode--;
				state.curJoinMode=state.curJoinMode<state.minMode?state.maxMode:state.curJoinMode;
				/**
				//没有邀请加入，只剩自由加入、关闭加入
				if(0==state.curJoinMode)
					state.curJoinMode=2;
				else if(2==state.curJoinMode)
					state.curJoinMode=0;
				/**/
				state.txtMode.setText(state.joinMode[state.curJoinMode]);
			};
		};
		
		__Page.dlgClan.Create_onModeRClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onModeRClk");
				state.curJoinMode++;
				if(1==state.curJoinMode)state.curJoinMode++;
				state.curJoinMode=state.curJoinMode>state.maxMode?state.minMode:state.curJoinMode;
				/**
				//没有邀请加入，只剩自由加入、关闭加入
				if(0==state.curJoinMode)
					state.curJoinMode=2;
				else if(2==state.curJoinMode)
					state.curJoinMode=0;
				/**/
				state.txtMode.setText(state.joinMode[state.curJoinMode]);
			};
		};
		
		__Page.dlgClan.Create_onRequireLClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onRequireLClk");
				var a=state.curJoinMedal<=1000?200:100;
				state.curJoinMedal-=a;
				state.curJoinMedal=state.curJoinMedal<state.minMedal?state.maxMedal:state.curJoinMedal;
				state.txtMedal.setText(state.curJoinMedal+"");
			};
		};
		
		__Page.dlgClan.Create_onRequireRClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onRequireRClk");
				var a=state.curJoinMedal<1000?200:100;
				state.curJoinMedal+=a;
				state.curJoinMedal=state.curJoinMedal>state.maxMedal?state.minMedal:state.curJoinMedal;
				state.txtMedal.setText(state.curJoinMedal+"");
			};
		};
		
		__Page.dlgClan.Create_onCreateClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onCreateClk, dec:"+state.clanDeclare+", name:"+state.clanName);
				if(!state.clanName)
				{
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["InputClanName"]);
					return;
				}
				this.appEnv.closeDlg(null,null,0);
				setFrameout(1,function(){this.appEnv.prePmtLayer=this.appEnv.layer;},this);
				if(this.page.stateHome.clanInitVO)
				{
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["YouHaveClan"]);
					return;
				}
				var comVO={clanName:state.clanName,clanFlag:state.curFlag,clanDeclare:state.clanDeclare,joinMode:state.curJoinMode,joinMedal:state.curJoinMedal};
				if(!this.page.vwHomeStage.checkCost(
					{storage:[{store:"Gold",type:"ResGold",num:window.aisEnv.defLib.globals["CREATE_CLAN_RES"]}]},
					1,
					this.page.stateHome.createClan,
					this.page.stateHome,[comVO]))
				{
					return;
				}
				this.page.stateHome.createClan(comVO);
			};
		};
		
		__Page.dlgClan.Create_onBackClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onBackClk");
				state.badgeBox.fadeOut(5,0);
				state.cntBox.fadeIn(10,0);

				var stateStr=this.states[this.curStateId];
				var curState=this["state_"+stateStr];
				DBOut("Str:"+stateStr+",State:"+curState+",statue:"+curState.status);
				if(state!=curState && curState.status=="Edit")
				{
					var keyid=this.appEnv.hudKeys.getKey(this);
					this.regKeyVO(keyid,this,this["onEditBackClk"]);
					this.btnBack.setKey(keyid);
				}
				else
				{
					this.btnBack.setDisplay(0);
				}
			}
		};
		
		__Page.dlgClan.Create_onBadgeClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onBadgeClk");
				this.Create_onBackClk(msg,key,way,extra);
				state.curFlag=state.badgeKeys[key+""];
				state.iconBadge.setTexURL(this.page.imgLib.genIconPath("badge"+state.curFlag,64));
			}
		};
		
		__Page.dlgClan.Create_onSubmitClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var state=this.state_Create;
				DBOut("Create_onSubmitClk, dec:"+state.clanDeclare+", name:"+state.clanName);
				if(!state.clanName)
				{
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["InputClanName"]);
					return;
				}
				this.appEnv.closeDlg(null,null,0);
				setFrameout(1,function(){this.appEnv.prePmtLayer=this.appEnv.layer;},this);
				var comVO={clanFlag:state.curFlag,clanDeclare:state.clanDeclare,joinMode:state.curJoinMode,joinMedal:state.curJoinMedal};
				this.page.stateHome.editClan(comVO);
			}
		};
	}
}