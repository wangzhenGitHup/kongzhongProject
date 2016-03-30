{
	__Page.dlgLog.initFoeBox=function(appEnv)
	{
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var cntW=this.contentW, cntH=this.contentH, cInner=this.contentInner;
		var pic, keyid=0, dlg=this;
		this.foeBox=this.cntBox.appendNewChild({type:"icon",pos:[0,0,0],w:cntW,h:cntH,ui_event:1,display:0,fade:1,fade_alpha:0,fade_size:1,fade_pos:[0,0,0]});

		var titleW=768, titleH=110, titleX=cntW/2, titleY=titleH/2;
		this.foeTitle=this.foeBox.appendNewChild({css:cssLib.textFineMid.createCSS([titleX,titleY,0],textLib["FoeTitle"],titleW,titleH,1,1,0,1),wrap:1});
		var btmX=10, btmY=cntH-70, btmW=cntW-btmX*2, btmH=62;
		this.btmBox=this.foeBox.appendNewChild({type:"div3x3",pos:[btmX,btmY,0],w:btmW,h:btmH,css:imgLib.getImg("box_green")});
		this.btmTxt=this.btmBox.appendNewChild({css:cssLib.textFineMid.createCSS([0,0,0],textLib["SelFoeBeat"],btmW,btmH,0,0,1,1)});
		var listX=10, listY=titleY+titleH/2, listW=cntW-listX*2, listH=btmY-listY;
		var itemW=listW, itemH=90, subW=itemW, subH=itemH-6;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onFoeClk);
		this.lbxFoe=this.foeBox.appendNewChild({type:"listbox",id:"lbx-foe",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,key:keyid,ui_event:1,sub_event:1,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1,//css:imgLib.getImg("box_dlginner"),
			fade:1,fade_alpha:0,fade_size:1,fade_pos:[listX+cntW,listY,0]
		});
		var rankW=92, rankH=44, rankX=8, rankY=(subH-rankH)/2, rankCSS=imgLib.getImg("box_clan_rank5");
		var lineX1=rankX+rankW+12, lineY=4, lineH=subH-12;
		var lvSize=56, lvX=lineX1+6, lvY=subH/2, lvCSS=imgLib.getIcon("level",64);
		lvCSS.w=lvCSS.h=lvSize;
	//	var nameX=lvX+lvSize+4, nameY=subH/4;
		var nameX=lineX1+8, nameY=subH/4;

		var vip=2, vipScale=0.8, vipPic=imgLib.getImg("pic_VIP"+vip);
		var vipW=Math.floor(vipPic.w*vipScale), vipH=Math.floor(vipPic.h*vipScale);
		var vipCSS={css:vipPic,w:vipW,h:vipH};
		if(!vip)vipCSS={w:0,h:0};

		var clanX=nameX, clanY=subH/4*3;
		var clanCSS=imgLib.getIcon("badge1",64);
	//	if(vo.allianceFlag)
	//		clanCSS=imgLib.getIcon("badge"+vo.allianceFlag,64);
		clanCSS.w=clanCSS.h=30;

		var medalW=56, medalH=38, medalX=subW-medalW, medalY=subH/2;
		var btnW=118, btnH=50, btnX=medalX-btnW/2, btnY=subH/2;
		var uv3x3=[25/1024,20/1024,22/1024,24/1024], size3x3=[18,15,18,15];
		var stateCSS={w:btnW,h:btnH,uv3x3:uv3x3,size3x3:size3x3};
		var smallBtnCSS={type:"key",pos:[btnX,btnY],w:btnW,h:btnH,anchor_h:1,anchor_v:1,css:imgLib.getImg("btn_green_u"),ui_event:1,
			audio:this.page.audioObject.genFileURL("btn_click"),
			state_up:{css:imgLib.getImg("btn_green_u"),w:btnW,h:btnH,uv3x3:uv3x3,size3x3:size3x3},
			state_down:{css:imgLib.getImg("btn_green_d"),w:btnW,h:btnH,uv3x3:uv3x3,size3x3:size3x3},
			state_gray:{css:imgLib.getImg("btn_green_g"),w:btnW,h:btnH,uv3x3:uv3x3,size3x3:size3x3},
		};
		var iconSize=40, iconX=btnW/2-12-iconSize/2, iconY=0, priceX=iconX-iconSize/2-6, priceY=0;
		var sTipX=-btnW/2, sTipY=-btnH/2;

		this.modifyKeys={};
		this.unlockKeys={};
		this.replaceKeys={};
		this.fireKeys={};

		var txtW=130, txtH=subH, txtX=btnX-btnW/2-60-txtW/2, txtY=subH/2;
		var lineX2=txtX-txtW/2-8, midW=lineX2-lineX1;
		this.foeLine={
			createCSS:function(vo,rank,replace)
			{
			//	var uv3x3=[25/1024,20/1024,22/1024,24/1024],size3x3=[12,10,12,10]
			//	var btnCSS=cssLib.normalBtn.createCSS([this.foeX,this.foeY,0],keyid,0,textLib["SetFoe"],94,38,FS.M);
			//	btnCSS.state_up.uv3x3=btnCSS.state_down.uv3x3=btnCSS.state_gray.uv3x3=uv3x3;
			//	btnCSS.state_up.size3x3=btnCSS.state_down.size3x3=btnCSS.state_gray.size3x3=size3x3;
				keyid=0;
				var css, btnCSS, desc, gemNum, kingGem=window.aisGame.king.gemNum, bad=0, badNum=0;
				if(vo && vo.oppUserId)
				{
					if(!replace)
					{
						if(vo.attackTimeMS && vo.attackTimeMS>window.aisEnv.dateTime())
						{
							btnCSS={css:smallBtnCSS,display:0};
							desc=textLib["RemainBattleCD"]+":\n"+textLib["getTimeText"](vo.attackTimeMS-window.aisEnv.dateTime());
						}
						else
						{
							keyid=appEnv.hudKeys.getKey(dlg);
							dlg.regKeyVO(keyid,dlg,dlg.onFireClk);
							dlg.fireKeys[""+keyid]=vo;
							gemNum=dlg.getForceCost();
							bad=gemNum>kingGem?1:0;
							if(bad)badNum=gemNum-kingGem;
							btnCSS={css:smallBtnCSS,key:keyid,items:[
								{css:cssLib.textFineMid.createCSS([sTipX,sTipY,0],textLib["FireFoe"],10,10,0,1,0,1)},
								{type:"icon",pos:[iconX,iconY,0],anchor_h:1,anchor_v:1,w:iconSize,h:iconSize,css:imgLib.getIcon("res_gem",64)},
								{css:cssLib.textFineMid.createCSS([priceX,priceY,0],gemNum,10,10,2,1,2,1,bad?[255,0,0,255]:[255,255,255,255])}
							]};
							desc=textLib["BattleCDOK"];
						}
					}
					else
					{
						keyid=appEnv.hudKeys.getKey(dlg);
						dlg.regKeyVO(keyid,dlg,dlg.onReplaceClk);
						dlg.replaceKeys[""+keyid]=vo;
						btnCSS={css:smallBtnCSS,key:keyid,items:[
							{css:cssLib.textFineMid.createCSS([0,0,0],textLib["Replace"],10,10,1,1,1,1)},
						]};
						if(vo.attackTimeMS && vo.attackTimeMS>window.aisEnv.dateTime())
						{
							desc=textLib["RemainBattleCD"]+":\n"+textLib["getTimeText"](vo.attackTimeMS-window.aisEnv.dateTime());
						}
						else
						{
							desc=textLib["BattleCDOK"];
						}
					}
					if(vo.clanFlag)
					{
						clanCSS.tex=imgLib.genIconPath("badge"+vo.clanFlag,64);
					}
					vipPic=imgLib.getImg("pic_VIP"+vo.vipLevel), vipW=Math.floor(vipPic.w*vipScale), vipH=Math.floor(vipPic.h*vipScale);
					vipCSS={css:vipPic,w:vipW,h:vipH};
					if(!vo.vipLevel)vipCSS={w:0,h:0};
					css={
						type:"div3x3",pos:[0,0,0],w:subW,h:subH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_achieve"),ui_event:1,info:vo,badNum:badNum,items:[
							{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:0,anchor_v:0,items:[//color_r:70,color_g:90,color_b:100,color_a:255,
								{css:cssLib.textFineMid.createCSS([0,0,0],rank+1,rankW,rankH,0,0,1,1)}
							]},
							{type:"div3x3",pos:[lineX1,lineY,0],h:lineH,css:imgLib.getImg("box_line")},
//							{css:cssLib.iconText.createCSS([lvX,lvY,0],lvCSS,appEnv.getLevelByExp(961),1)},
							{css:cssLib.iconText.createCSS([nameX,nameY+5,0],vipCSS,vo.nickName,2,null,FS.XXL)},
							{css:cssLib.iconText.createCSS([clanX,clanY-5,0],clanCSS,vo.clanName,0,null,FS.XXL),display:vo.clanId?1:0},
							{type:"div3x3",pos:[lineX2,lineY,0],h:lineH,css:imgLib.getImg("box_line")},
							{id:"txt",css:cssLib.textFineMid.createCSS([txtX,txtY,0],desc,txtW,txtH,1,1,1,1)},
							{id:"btn",css:btnCSS},
//							{type:"div3x3",pos:[medalX,medalY,0],w:medalW,h:medalH,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),items:[
//								{type:"text",pos:[5,0,0],text:"30621",anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:FS.S},
//								{type:"icon",pos:[medalW-36,0,0],anchor_h:1,anchor_v:1,w:40,h:40,css:imgLib.getIcon("medal",64)}
//							]},
						]
					};
				}
				else if(vo && !vo.oppUserId)
				{
					css={
						type:"div3x3",pos:[0,0,0],w:subW,h:subH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_achieve"),ui_event:1,info:vo,items:[
							{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:0,anchor_v:0,items:[//color_r:70,color_g:90,color_b:100,color_a:255,
								{css:cssLib.textFineMid.createCSS([0,0,0],rank+1,rankW,rankH,0,0,1,1)}
							]},
							{id:"txt",css:cssLib.textFineMid.createCSS([lineX1+20,txtY,0],textLib["NeedSetFoe"],txtW,txtH,0,1,0,1)},
						]
					};
				}
				else if(!vo)
				{
					keyid=appEnv.hudKeys.getKey(dlg);
					dlg.regKeyVO(keyid,dlg,dlg.onUnlockClk);
					dlg.fireKeys[""+keyid]=vo;
					gemNum=dlg.getUnlockCost();
					bad=gemNum>kingGem?1:0;
					if(bad)badNum=gemNum-kingGem;
					btnCSS={css:smallBtnCSS,key:keyid,items:[
						{css:cssLib.textFineMid.createCSS([sTipX,sTipY,0],textLib["Unlock"],10,10,0,1,0,1)},
						{type:"icon",pos:[iconX,iconY,0],anchor_h:1,anchor_v:1,w:iconSize,h:iconSize,css:imgLib.getIcon("res_gem",64)},
						{css:cssLib.textFineMid.createCSS([priceX,priceY,0],gemNum,10,10,2,1,2,1,bad?[255,0,0,255]:[255,255,255,255])}
					]};
					css={
						type:"div3x3",pos:[0,0,0],w:subW,h:subH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_achieve"),ui_event:1,info:vo,badNum:badNum,
							color_r:66,color_g:73,color_b:82,color_a:255,items:[
							{type:"div3x3",pos:[rankX,rankY,0],css:rankCSS,w:rankW,h:rankH,anchor_h:0,anchor_v:0,items:[//
								{css:cssLib.textFineMid.createCSS([0,0,0],rank+1,rankW,rankH,0,0,1,1)}
							]},
							{id:"txt",css:cssLib.textFineMid.createCSS([lineX1+20,txtY,0],textLib["NeedUnlockFoe"],txtW,txtH,0,1,0,1)},
							{id:"btn",css:btnCSS},
						]
					};
				}
				return css;
			}
		};
	};

	__Page.dlgLog.showFoeBox=function(replace,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		appEnv.hudOut(this.lbxLog,7);
		appEnv.hudIn(this.foeBox,7);
		this.descTxt.setDisplay(0);

		this.lbxFoe.clearItems();
		var i,foe,css;
		for(i=0; i<3; i++)
		{
			foe=this.foeVO[i];
			css=this.foeLine.createCSS(foe?foe:null,i,replace);
			this.lbxFoe.addItem(css);
		}
		this.lbxFoe.fadeIn(16,0)
		this.replaceVO=vo;
	};

	__Page.dlgLog.hideFoeBox=function(nextState)
	{
		var appEnv=this.appEnv;

		appEnv.hudIn(this.lbxLog,7);
		appEnv.hudOut(this.foeBox,7);
	};

	__Page.dlgLog.showFoes=function(extra)
	{
	};

	__Page.dlgLog.updateFoeVO=function(vo,idx)
	{
		var index, cur={};
		DBOut("updateFoeVO: "+toJSON(vo));
		if(vo && vo.attackerId)
		{
			if(!(idx>=0))//添加仇敌
			{
				index=this.getEmptyFoe();
			}
			else//替换仇敌
			{
				index=idx;
				cur=this.foeVO[index];
			}
			DBOut("index="+index);
		//	DBOut(toJSON(vo));
			this.sendSetFoeMsg(vo.attackerId,index);
			this.foeVO[index]=this.switchLog2Foe(vo,cur);
			this.updateLogFoeStatus(vo.attackerId);//设置新的仇敌
			this.updateLogFoeStatus(cur.oppUserId,1);//撤销被替换的仇敌
		}
		else if(vo && !vo.attackerId)//解锁栏位
		{
			this.sendUnlockMsg();
			this.foeVO.push({});
		}
	};

	__Page.dlgLog.switchLog2Foe=function(log,cur)
	{
		var foe={}, time=cur.attackTimeMS?cur.attackTimeMS:0;
		foe={oppUserId:log.attackerId, nickName:log.attackerName, vipLevel:0, clanId:0, clanFlag:0, clanName:"", attackTimeMS:time, battleTotalTimes:0, battleWinTimes:0};
		if(log.alliance)
		{
			foe.clanId=log.alliance.id;
			foe.clanFlag=log.alliance.flag;
			foe.clanName=log.alliance.name;
		}
		return foe;
	};

	__Page.dlgLog.getEmptyFoe=function()
	{
		var i, empty=0;
		for(i=0; i<this.foeVO.length; i++)
		{
			if(!this.foeVO[i].oppUserId)
			{
				return i;
			}
		}
		return -1;
	};

	__Page.dlgLog.getUnlockCost=function()
	{
		var idx=this.foeVO.length+1;
		var gemNum=window.aisEnv.defLib.globals["PVP_UNLOCK_ENEMY_LIST_"+idx];
		return gemNum;
	};

	__Page.dlgLog.getForceCost=function()
	{
		var gemNum=window.aisEnv.defLib.globals["FORCE_REVENGE_ATTACK_GEM"];
		return gemNum;
	};

	__Page.dlgLog.sendSetFoeMsg=function(userId,pos)//设置仇敌
	{
		var city, king;
		city=window.aisGame.curCity;
		king=window.aisGame.king;
		king.execFakeCmd(city,"AddEnemy",{userId:userId,pos:pos,callBack:function(){},callObj:this},city);
	};

	__Page.dlgLog.sendForceFoeMsg=function(comVO)//攻击仇敌
	{
		var city, king, gemNum;
		city=window.aisGame.curCity;
		king=window.aisGame.king;
		gemNum=this.getForceCost();
		king.execFakeCmd(city,"BattleEnemy",{userId:comVO.userId,pos:comVO.pos,gemNum:comVO.gemNum,callBack:function(data,error,exInfo){
			this.onGetForceMsg(data,error,exInfo);
		},callObj:this},city);
	};

	__Page.dlgLog.sendUnlockMsg=function()//解锁栏位
	{
		if(this.foeVO.length>=window.aisEnv.defLib.globals["PVP_MAX_ENEMY_COUNT"])
			return;
		var city, king, gemNum;
		city=window.aisGame.curCity;
		king=window.aisGame.king;
		gemNum=this.getUnlockCost();
		king.execCmd(city,"UnlockEnemySlot",{gemNum:gemNum,callBack:function(){},callObj:this},city);
	};

	__Page.dlgLog.tryForceFoe=function(info,idx)//攻打仇敌
	{
		var page=this.page;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var item=this.lbxFoe.itemAt(this.curSelFoe);
		if(item.badNum)
		{
			appEnv.showPmtDlg(page.pmtInfo,0,{title:textLib["NotEnougGem"],info:textLib["NeedGemNum"](item.badNum),ui:"go2shop"});
		}
		else
		{
			var gemNum=this.getForceCost();
			appEnv.showPmtDlg(page.pmtInfo,0,{title:textLib["ConfirmForce"],info:textLib.getTextEx("ConfirmForceDesc",{name:info.nickName}),
			svo:{gemNum:gemNum},ui:"gem2normal",pmtFunc:function(){
				this.sendForceFoeMsg({userId:info.oppUserId, pos:idx, gemNum:gemNum});
				this.appEnv.closeDlg(null,null,0);
			},pmtObj:this});
		}
	};

	__Page.dlgLog.onGetForceMsg=function(data,error,exInfo)//收到攻打消息的回调
	{
		if(error==-5)
		{
			var page=this.page;
			var appEnv=this.appEnv;
			var textLib=appEnv.textLib;
			var txt="";
			if(exInfo=="0")//不存在
				txt=textLib.NotUser;
			else if(exInfo=="-1")//在线
				txt=textLib.UserOnline;
			else if(exInfo=="-2")//被保护
			{
				this.doForceFoe(data);//需修改
			}
			else if(exInfo=="-3")//被攻击
				txt=textLib.UserAttack;
			else if(exInfo=="-4")//同盟
				txt=textLib.UserClan;
			else
				txt=textLib.NotUser;
			this.appEnv.stateLogs.showLog(txt);
		}else{
			this.doForceFoe(data);
		}
	};

	__Page.dlgLog.doForceFoe=function(data)//
	{
		this.page.vwHomeStage.setNavBoxRangeByScale(1);
		this.page.appEnv.addScale(this.page.vwHomeStage.gameHud,[1,1,1],[0.8,0.8,1]);
		this.appEnv.showSearchAni(function(){
			this.page.setCookie("Runtime","Revenge","1",0);
			this.page.stateHome.go2Battle(data);
		},this);
		if(this.page.audioObject && this.page.audioObject._init)
		{
			this.page.audioObject.playMp3("search",-1);
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		//仇敌列表被点击
		__Page.dlgLog.onFoeClk=function(msg,key,way,extra)
		{
			if(1==way)
			{
				if(0==msg)
				{
				//	DBOut("onLogClk down");
					this.lbxResponse=1;
					this.curSelFoe=extra;
				}
				else if(2==msg)
				{
				//	DBOut("onFoeClk check");
					if(this.lbxResponse)
					{
						DBOut("Do lbx reponse!");
						DBOut("this.onFoeClk:"+extra);
						var info=this.lbxFoe.itemAt(extra).info;
						if(!info || !info.oppUserId)
							return;
						if(info.oppUserId==window.USERID)
							return;
						var appEnv=this.appEnv;
						var textLib=appEnv.textLib;
						appEnv.showPmtDlg(this.page.pmtChoose,0,
							{
								title:textLib["ConfirmVisit"],info:textLib["ConfirmVisitDesc"](info.nickName),
								pmtFunc:function(ok,info){
									if(ok)
									{
										this.appEnv.closeDlg(null,null,0);
										this.page.stateHome.onVisitClick(info.oppUserId);
									}
								},pmtObj:this,pmtParam:info
							}
						);
					}
					this.lbxResponse=0;
				}
			}
		};

		//开战按钮被点击
		__Page.dlgLog.onFireClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onFireClk");
				var info=this.fireKeys[key];

				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var city=window.aisGame.curCity;
				if(!city.allStorages["Unit"].getUsedCap())
				{
					appEnv.stateLogs.showLog(textLib["NotUnit"]);
					return;
				}
				if(city.getBuff("Shield"))
				{
					this.appEnv.showPmtDlg(this.page.pmtChoose,0,
						{
							title:textLib["InShield"],info:textLib["InShieldDesc"],
							pmtFunc:function(ok)
							{
								if(ok)
								{
									this.tryForceFoe(info,this.curSelFoe);
								}
							},pmtObj:this,pmtParam:info
						}
					);
				}
				else
					this.tryForceFoe(info,this.curSelFoe);
			}
		};

		//解锁按钮被点击
		__Page.dlgLog.onUnlockClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onUnlockClk");
			//	var idx=this.curSelFoe;
			//	var css=this.foeLine.createCSS({},idx);
			//	this.lbxFoe.removeItem(idx);
			//	this.lbxFoe.insertItemAt(css,idx);
				var page=this.page;
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var item=this.lbxFoe.itemAt(this.curSelFoe);
				if(item.badNum)
				{
					appEnv.showPmtDlg(page.pmtInfo,0,{title:textLib["NotEnougGem"],info:textLib["NeedGemNum"](item.badNum),ui:"go2shop"});
				}
				else
				{
					var gemNum=this.getUnlockCost();
					appEnv.showPmtDlg(page.pmtInfo,0,{title:textLib["ConfirmUnlock"],info:textLib["ConfirmUnlockDesc"],svo:{gemNum:gemNum},ui:"gem2normal",pmtFunc:function(){
						this.updateFoeVO({});
						DBOut("replaceVO: "+toJSON(this.replaceVO));
						if(this.replaceVO)
						{
							this.replaceVO.isFoe=1;
							this.updateFoeVO(this.replaceVO);
							this.showFoeBox();
						}
						else
						{
							this.showFoeBox();
						}
					},pmtObj:this});
				}
			}
		};

		//替换按钮被点击
		__Page.dlgLog.onReplaceClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onReplaceClk: "+this.curSelFoe);
				var page=this.page;
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;

				var idx=this.curSelFoe;
				var selVo=this.lbxFoe.itemAt(idx).info;
				var replaceVO=this.replaceVO;
				appEnv.showPmtDlg(this.page.pmtChoose,0,
					{
						title:textLib["ConfirmReplaceFoe"],info:textLib.getTextEx("ConfirmReplaceFoeDesc",{name1:selVo.nickName, name2:replaceVO.attackerName}),
						pmtFunc:function(ok){
							if(ok)
							{
							//	var css=this.foeLine.createCSS(this.switchLog2Foe(replaceVO),idx);
							//	this.lbxFoe.removeItem(idx);
							//	this.lbxFoe.insertItemAt(css,idx);
								this.replaceVO.isFoe=1;
								this.updateFoeVO(replaceVO,idx);
								this.showFoeBox();
							}
						},pmtObj:this,pmtParam:replaceVO
					}
				);
			}
		};
	}
}
