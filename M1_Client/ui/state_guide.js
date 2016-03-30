if(!__Page.stateHome)
{
	__Page.stateHome={
		page:__Page,
		name:"GuideState",
		lastLUDT:0,
		lockLUDT:1,
		timerLUDT:null,
		pushMsgs:[],
		curGuide:null,
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateHome);

	//***************************************************************************
	//初始化相关*****************************************************************
	//***************************************************************************
	{
		//初始化State
		__Page.stateHome.init=function(appEnv)
		{
			var page;
			var imgLib;
			var cssLib;
			var city;
			var layer,keyid;

			this.appEnv=appEnv;
			appEnv.stateHome=this;
			page=this.page;
			imgLib=page.imgLib;
			cssLib=page.cssLib;
			if(window.aisGame)
			{
				if(aisGame.king)
				{
					this.king=aisGame.king;
					city=this.city=aisGame.curCity;
					aisGame.guideMode=1;
				}
			}
			page.keyStateUtil.call(this);
			page.vwHomeStage.initStage();

			//创建State专署UI控件:
			{
				layer=this.appEnv.layer;
				appEnv.hudBaseBox=this.hudBaseBox=layer.addHudItem({type:"shape",pos:[0,0,0],w:20,h:20,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
				this.hudTLBox=this.hudBaseBox.appendNewChild({
					type:"shape",ch_align:0,cv_align:0,pos:[0,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
					fade:1,fade_size:1,fade_alpha:0
				});
				this.hudTCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
				this.hudTRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[appEnv.scrSize[0]-300,0,0],w:300,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
				this.hudBLBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[0,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
				this.hudBCBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300)/2,appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});
				this.hudBRBox=this.hudBaseBox.appendNewChild({type:"shape",pos:[(appEnv.scrSize[0]-300),appEnv.scrSize[1]-300,0],w:300,h:300,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,fade:1,fade_size:1,fade_alpha:0});

				var dt=10, iconBtnW=64;;
				var keyBG=imgLib.getImg("btn_shop");

				var shopX=dt+keyBG.w/2;
				var shopY=appEnv.scrSize[1]-dt-keyBG.h/2;
				keyid=appEnv.appKeys.btnAttack;
				this.btnAttack=cssLib.btnMain.create(this.hudBaseBox,[shopX,shopY,0],keyid,"btn_attack","BtnAttack");
				this.regKeyVO(keyid,this,this.onAttackClick);


				var attackX=appEnv.scrSize[0]-shopX;
				var attackY=shopY;
				keyid=appEnv.appKeys.btnShop;
				this.btnShop=cssLib.btnMain.create(this.hudBaseBox,[attackX,attackY,0],keyid,"btn_shop","BtnShop");
				this.regKeyVO(keyid,this,this.onShopClick);

				var achievementX=dt+iconBtnW/2;
				var achievementY=shopY-keyBG.w/2-dt-iconBtnW/2-dt-iconBtnW;
				keyid=appEnv.appKeys.btnAchievement;
				this.achvmntBtn=cssLib.btnAchvmnt.create(this.hudBaseBox,[achievementX,achievementY,0],keyid);
				this.regKeyVO(keyid,this,this.onAchvClick);


				//调试控件底盘:
				this.hudDBDock=this.hudBaseBox.appendNewChild({
					type:"shape",ch_align:0,cv_align:0,pos:[-200,0,0],w:200,h:200,face_r:255,face_g:255,face_b:255,face_a:0,border_a:0,ui_event:1,
					fade:1,fade_size:1,fade_alpha:0,display:window.DEBUGMODE?1:0
				});
				this.hudDBBox=this.hudDBDock.appendNewChild({
					type:"shape",ch_align:0,cv_align:0,pos:[0,0,0],w:200,h:appEnv.scrSize[1],face_r:0,face_g:0,face_b:0,face_a:64,border_a:0,ui_event:1,
					display:0,fade:1,fade_size:1,fade_alpha:0
				});

			}
			//DBOut("stateHome.init: "+appEnv);
			this.appEnv.layer.setDisplay(0);
		};

		__Page.stateHome.enter=function(preState)
		{
			var appEnv=this.appEnv;
			var page=this.page;
			DBOut("StateHome: Enter");
			if(window.aisGame)
			{
				this.resumeLUDT();
				aisGame.king.addListener(this);
			}
			this.checkVo={};
			var oUserVO = this.page.getCookie("Runtime","UserVO");
			if(oUserVO)
			{
				this.checkVo=fromJSON(oUserVO);
			}
		};

		__Page.stateHome.leave=function(nextState)
		{
			//TODO:code this:
			if(window.aisGame)
			{
				this.pauseLUDT();
				aisGame.king.removeListener(this);
			}
		};

		//当King执行命令后,会调用这个函数:
		__Page.stateHome.onKingExecCom=function(comObj,com,comVO,caller)
		{
			this.updateLUDTTimer();
			if(this.curGuide && this.curGuide.triggerCom)
			{
				if(this.curGuide.triggerCom(comObj,com,comVO,caller))
				{
					this.nextGuide();
				}
			}
		};

		__Page.stateHome.onKingUpdate=function()
		{
			var king;
			king=aisGame.king;
			if(this.debugTime)
			{
				var kingTime,timeText;
				kingTime=king.lastUpdate;
				timeText=this.appEnv.textLib.getDebugTimeText(kingTime-king.createTime);
				this.debugTime.setText(timeText);
			}
		};

		__Page.stateHome.onGameLoaded=function()
		{
			var page=this.page;
			var appEnv=this.appEnv;
			var cssLib=page.cssLib;
			var imgLib=page.imgLib;

			this.resBoxGold=cssLib.boxResBar.create(this.hudTRBox,[175,40,0],aisGame.curCity.goldStorage,aisEnv.defLib.prdct.ResGold,[255,240,80]);
			this.resBoxOil=cssLib.boxResBar.create(this.hudTRBox,[175,90,0],aisGame.curCity.oilStorage,aisEnv.defLib.prdct.ResOil,[55,100,30]);
			this.gemBox=cssLib.boxGem.create(this.hudTRBox,[200,140,0],aisGame.curCity,"",0);

			this.hudTLBox.setDisplay(0);
			this.hudTCBox.setDisplay(0);
			this.expBox=cssLib.boxExpBar.create(this.hudTLBox,[130,40,0],[30,180,255]);

			this.workerBox=cssLib.boxWorkers.create(this.hudTCBox,[60,40,0],aisGame.curCity);
			this.shieldBox=cssLib.boxShield.create(this.hudTCBox,[240,40,0],aisGame.curCity);


			//添加用于解说时阻挡的控件
			var keyid;
			keyid=appEnv.appKeys.uiGuideMask;
			this.guideMask=appEnv.hudBaseBox.appendNewChild({
				type:"icon",pos:[-5,-5,0],css:imgLib.guide_mask,w:appEnv.scrSize[0]+10,h:appEnv.scrSize[1]+10,filter:1,border_a:0,face_r:0,face_g:0,face_b:0,face_a:128,ui_event:1,
				display:0,fade:1,fade_size:1,fade_alpha:0,
				items:[
					{type:"key",pos:[0,0,0],w:appEnv.scrSize[0],h:appEnv.scrSize[1],ui_event:1,key:keyid,audio:this.page.audioObject.genFileURL("btn_click"),}
				]
			});

			//解说女孩的控件:
			this.girlHud=appEnv.hudBaseBox.appendNewChild({
				//type:"icon",pos:[0,appEnv.scrSize[1]-imgLib.mark_girl.h+3,0],css:imgLib.mark_girl,display:0,fade:1,fade_size:1,fade_alpha:0,
				type:"icon",pos:[0,appEnv.scrSize[1]-imgLib.mark_girl.h+3,0],w:imgLib.mark_girl.w,h:imgLib.mark_girl.h,display:0,fade:1,fade_size:1,fade_alpha:0,
				items:[
					{type:"icon",id:"sd1",pos:[-130,82,0],tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:512, h:512, tex:page.genURL(window.imgPath+"/icon/icon_chr_UntPEKKA512_32.png"),
						fade:1,fade_pos:[-500,82,0],fade_size:1,fade_alpha:0,filter:1,color_r:0,color_g:0,color_b:0,color_a:200,display:1,
					},
					{type:"icon",id:"sd2",pos:[-6,-5,0],tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:512, h:512, tex:page.genURL(window.imgPath+"/icon/icon_shop_5256_32.png"),
						fade:1,fade_pos:[-100,-5,0],filter:1,fade_size:1,fade_alpha:0,color_r:0,color_g:0,color_b:0,color_a:100,display:1,
					},
					{type:"icon",id:"Face_1",pos:[0,0,0],css:imgLib.mark_girl,display:1},
					{type:"icon",id:"Face_2",pos:[0,0,0],css:imgLib.mark_girl2,display:1},
				/*
					{type:"icon",id:"Face_1",pos:[138,88,0],css:imgLib.mm_face_cry_1,display:1},
					{type:"icon",id:"Face_2",pos:[138,88,0],css:imgLib.mm_face_cry_2,display:1},
					{type:"icon",id:"Face_3",pos:[138,88,0],css:imgLib.mm_face_cry_3,display:1},
					{type:"icon",id:"Face_4",pos:[138,88,0],css:imgLib.mm_face_laugh_1,display:1},
					{type:"icon",id:"Face_5",pos:[138,88,0],css:imgLib.mm_face_laugh_2,display:1},
					{type:"icon",id:"Face_6",pos:[138,88,0],css:imgLib.mm_face_laugh_3,display:1},
					*/
					{
						type:"icon",id:"TalkBox",pos:[280,120,0],css:imgLib.getImg("mark_girl_talk"),w:500,h:160,//pos:[220,186,0],
					//	mode3x3:1,size3x3:[64,60,24,24],uv3x3:[64/1024,60/512,24/1024,24/512],
						display:1,
						items:[
							{type:"text",id:"TalkText",css:cssLib.textFineMid.createCSS([60,20,0],"Hello sir!",420,150,0,0,0,0,[255,255,255],1)}
						]
					},
				]
			});
			this.girlShadow1=this.girlHud.getItemById("sd1");
			this.girlShadow2=this.girlHud.getItemById("sd2");

			this.talkGirl.init(this,this.girlHud);

			//解说海盗的控件:
			this.pirateHud=appEnv.hudBaseBox.appendNewChild({
				type:"icon",pos:[appEnv.scrSize[0],appEnv.scrSize[1]-imgLib.mark_pirate.h+3,0],w:imgLib.mark_pirate.w,h:imgLib.mark_pirate.h,display:0,fade:1,fade_size:1,fade_alpha:0,anchor_h:2,
				items:[
					{type:"icon",id:"sd1",pos:[-421,-49,0],tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:512, h:512, tex:page.genURL(window.imgPath+"/icon/icon_shop_2256_32.png"),
						fade:1,filter:1,fade_pos:[-200,-49,0],fade_size:1,fade_alpha:0,filter:1,color_r:0,color_g:0,color_b:0,color_a:200,display:1,
					},
					{type:"icon",id:"sd2",pos:[-546,-32,0],tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:512, h:512, tex:page.genURL(window.imgPath+"/icon/icon_oil2256_32.png"),
						fade:1,filter:1,fade_pos:[-200,-32,0],fade_size:1,fade_alpha:0,filter:1,color_r:0,color_g:0,color_b:0,color_a:100,display:1,
					},
					{type:"icon",pos:[-341,0,0],css:imgLib.mark_pirate,display:1},
					{
						type:"icon",id:"TalkBox",pos:[-281,216-83,0],css:imgLib.getImg("mark_pirate_talk"),w:500,h:160,anchor_h:2,//pos:[-180,150,0],
					//	mode3x3:1,size3x3:[24,60,64,24],uv3x3:[24/1024,60/512,64/1024,24/512],
						display:1,
						items:[
							{type:"text",id:"TalkText",css:cssLib.textFineMid.createCSS([-60,20,0],"Hello sir!",420,150,2,0,0,0,[255,255,255],1)}
						]
					},
				]
			});
			this.pirateShadow1=this.pirateHud.getItemById("sd1");
			this.pirateShadow2=this.pirateHud.getItemById("sd2");
			this.talkPirate.init(this,this.pirateHud);

			this.loadBgHud=appEnv.hudBaseBox.appendNewChild({type:"icon",css:imgLib.pic_radar,pos:[appEnv.scrSize[0]>>1,appEnv.scrSize[1]>>1,0],anchor_v:1,anchor_h:1,display:0,
				items:[
				{type:"icon",id:"load",css:imgLib.pic_radar_light,anchor_v:1,anchor_h:1},
				{type:"icon",css:imgLib.pic_wreaths,anchor_v:1,anchor_h:1,filter:1,}
				]});
			this.loadHud=this.loadBgHud.getItemById("load");
			this.appEnv.addRotate_z(this.loadHud);

			//下面这些按钮是为调试增加的:
			this.dbBtnOpen=cssLib.btnDebug.create(this.hudDBDock,">",[224,appEnv.scrSize[1]/2,0],50,appEnv.appKeys.debugSwitch);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Save",[100,50,0],180,appEnv.appKeys.debugSave);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Time>>30s",[100,100,0],180,appEnv.appKeys.debugTimeGap1);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Time>>5m",[100,150,0],180,appEnv.appKeys.debugTimeGap2);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Time>>30m",[100,200,0],180,appEnv.appKeys.debugTimeGap3);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Time>>6h",[100,250,0],180,appEnv.appKeys.debugTimeGap4);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Fake Donated",[100,350,0],180,appEnv.appKeys.debugDonated);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Fake Donate",[100,400,0],180,appEnv.appKeys.debugDonate);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Up",[100,500,0],180,appEnv.appKeys.debugScaleU);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Down",[100,550,0],180,appEnv.appKeys.debugScaleD);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.debugExit);

			this.debugTime=cssLib.textMid.create(this.hudDBBox,[100,20,0],"0d 0h 0m 0s",180,20,1,1,0,1,[255,128,0]);

			this.hotBldTool=page.vwHomeStage.game.hudTools.getHudToolDef("bld_guideFocus");
			this.foucsBld({bldType:"TownHall",bldLevel:1});
			this.switchGuide(page.defGuides[this.initGuide?this.initGuide:"Greeting2"]);
		};

	}


	//***************************************************************************
	//说话女孩*******************************************************************
	//***************************************************************************
	{
		__Page.stateHome.talkGirl={
			init:function(state,hud)
			{
				this.state=state;
				this.showPos=[0,0,0];
				this.talkPos=[0,0,0];
				hud.getPos(this.showPos);
				hud.girlObj=this;
				this.page=state.page;
				this.appEnv=state.appEnv;
				this.girlHud=hud;
				hud.onAniDone=this.onAniDone;

				this.girlFaces=[];
				this.girlFaces.push(hud.getItemById("Face_1"));
				this.girlFaces.push(hud.getItemById("Face_2"));
				/*this.girlFaces.push(hud.getItemById("Face_3"));
				this.girlFaces.push(hud.getItemById("Face_4"));
				this.girlFaces.push(hud.getItemById("Face_5"));
				this.girlFaces.push(hud.getItemById("Face_6"));
				*/
				this.talkBox=hud.getItemById("TalkBox");
				this.talkBox.getPos(this.talkPos);
				this.talkBox.adRot=this.talkBox.addAdTMFirst("rotate");
				this.talkText=hud.getItemById("TalkText");
				this.isShow=0;
				//this.setFace(1);
				//this.show(-1,"Have a nice day!");
			},
			setFace:function(face)
			{
				var i;
				//for(i=0;i<6;i++)
				for(i=0;i<2;i++)
				{
					this.girlFaces[i].setDisplay(face==i?1:0);
				}
			},
			show:function(face,talkText)
			{
				this.setFace(face);
				DBOut("Show girl: "+talkText);
				this.showText=talkText;
				this.talkText._setText(talkText);
				if(!this.isShow)
				{
					this.girlHud.setDisplay(1);
					this.girlHud.setPos([-300,this.showPos[1],0]);
					this.girlHud.startAniEx(this.showPos,1,1,20,0);

					this.state.girlShadow1.fadeIn(30);
					this.state.girlShadow2.fadeIn(35);
					this.talkBox.setDisplay(0);
					this.isShow=1;
				}
				else
				{
					this.onAniDone.call(this.girlHud,1);
				}
			},
			hide:function()
			{
				if(this.isShow)
				{
					this.isShow=0;
					this.state.girlShadow1.fadeOut(5);
					this.state.girlShadow2.fadeOut(10);
					this.girlHud.startAniEx([-300,this.showPos[1],0],1,0,20,0);
				}
			},
			onAniDone:function(show)
			{
				var self=this.girlObj;
				DBOut("Show text: "+self.showText);
				if(self.isShow && self.showText)
				{
					self.showTalk(self.showText);
				}
			},
			showTalk:function(text)
			{
				if(text)
				{
					this.showText=text;
					this.talkText._setText(text);
				}
				this.talkBox.adRot.setCurValue([0,0,-3.1415926/4]);
				this.talkBox.adRot.startAni(1,[0,0,0],0);
				this.talkBox.setDisplay(1);
				this.talkBox.setScale(0.5);
				this.talkBox.startAniEx(this.talkPos,1,1,20,3);
			}
		}
	}

	//***************************************************************************
	//说话海盗*******************************************************************
	//***************************************************************************
	{
		__Page.stateHome.talkPirate={
			init:function(state,hud)
			{
				this.state=state;
				this.showPos=[0,0,0];
				this.talkPos=[0,0,0];
				hud.getPos(this.showPos);
				hud.pirateObj=this;
				this.page=state.page;
				this.appEnv=state.appEnv;
				this.pirateHud=hud;
				hud.onAniDone=this.onAniDone;
				this.pirateFaces=[];
				/*this.manFaces.push(hud.getItemById("Face_1"));
				this.manFaces.push(hud.getItemById("Face_2"));
				this.manFaces.push(hud.getItemById("Face_3"));
				this.manFaces.push(hud.getItemById("Face_4"));
				this.manFaces.push(hud.getItemById("Face_5"));
				this.manFaces.push(hud.getItemById("Face_6"));*/
				this.talkBox=hud.getItemById("TalkBox");
				this.talkBox.getPos(this.talkPos);
				this.talkBox.adRot=this.talkBox.addAdTMFirst("rotate");
				this.talkText=hud.getItemById("TalkText");
				this.isShow=0;
				//this.setFace(1);
				//this.show(-1,"Have a nice day!");
			},
			setFace:function(face)
			{
			},
			show:function(face,talkText)
			{
				this.setFace(face);
				this.showText=talkText;
				this.talkText._setText(talkText);
				if(!this.isShow)
				{
					this.pirateHud.setDisplay(1);
					this.pirateHud.setPos([this.appEnv.scrSize[0]+300,this.showPos[1],0]);
					this.pirateHud.startAniEx(this.showPos,1,1,20,0);

					this.state.pirateShadow1.fadeIn(30);
					this.state.pirateShadow2.fadeIn(35);
					this.talkBox.setDisplay(0);
					this.isShow=1;
				}
				else
				{
					this.onAniDone.call(this.pirateHud,1);
				}
			},
			hide:function()
			{
				if(this.isShow)
				{
					this.isShow=0;
					this.pirateHud.startAniEx([this.appEnv.scrSize[0]+300,this.showPos[1],0],1,0,20,0);
					this.state.pirateShadow1.fadeOut(10);
					this.state.pirateShadow2.fadeOut(5);
				}
			},
			onAniDone:function(show)
			{
				var self=this.pirateObj;
				if(self.isShow && self.showText)
				{
					self.showTalk(self.showText);
				}
			},
			showTalk:function(text)
			{
				if(text)
				{
					this.showText=text;
					this.talkText._setText(text);
				}
				this.talkBox.adRot.setCurValue([0,0,3.1415926/4]);
				this.talkBox.adRot.startAni(1,[0,0,0],0);
				this.talkBox.setDisplay(1);
				this.talkBox.setScale(0.5);
				this.talkBox.startAniEx(this.talkPos,1,1,20,3);
			}
		}
	}

	//***************************************************************************
	//教学阶段演进***************************************************************
	//***************************************************************************
	{
<include check="0">"crypto_md5.js"</include>
		__Page.stateHome.nextGuide=function()
		{
			this.appEnv.closePmtDlg();
			var king,city,vo,saveTxt;
			var nextGD;
			if(this.curGuide)
			{
				nextGD=this.page.defGuides[this.curGuide.nextGuide];
				if(this.curGuide.startBattle)
				{
					if(nextGD)
					{
						this.page.setCookie("COC","NextGuide",nextGD.codeName,0);
					}
					//TODO:从这里切换到战斗UI
					this.startBattle(this.curGuide.npcName,this.curGuide.units);
				}else if(this.curGuide.startGuideBattle)
				{
					if(nextGD)
					{
						this.page.setCookie("COC","NextGuide",nextGD.codeName,0);
					}
					this.startGuideBattle(this.curGuide.npcName);
				}
				else if(nextGD && nextGD.inputName)
				{
					this.inpuName();
					this.switchGuide(nextGD);
				}
				else if(this.curGuide.endGuide)
				{
					//TODO:从这里结束教学
					this.endGuide();
				}
				else
				{
					if(this.curGuide.saveGuide)
					{
						//保存教学进度
						king=aisGame.king;
						vo={};
						king.saveToVO(vo);
						saveTxt=toJSON(vo);
						this.page.setCookie("COC","SaveGuideLoad",saveTxt,0);
						if(nextGD)
						{
							this.page.setCookie("COC","NextGuide",nextGD.codeName,0);
						}
					}
					if(nextGD)
					{
						this.switchGuide(nextGD);
					}
				}
			}
		};
		__Page.stateHome.saveCity=function(name)
		{
			var i,n,list,bld,vo,king,city;
			king={};
			vo={};
			aisGame.king.saveToVO(king);
			city=king.citys[0];

			vo.name=name;
			vo.exp=0;
			vo.gem=king.gemNum;
			vo.gold=city.storages.Gold.slots.ResGold.num;
			vo.oil=city.storages.Oil.slots.ResOil.num;
			vo.bld=[];
			list=city.buildings;
			n=list.length;
			for(i=0;i<n;i++)
			{
				bld=list[i];
				if(bld.codeName=="GoldMine" || bld.codeName=="OilWell" || bld.codeName=="Cannon")
				{
					vo.bld.push({instanceId:bld.hashId.substring(3),codename:bld.codeName,level:bld.level,x:bld.pos[0],y:bld.pos[1]});
				}
			}

			this.page.setCookie("Runtime","GuideCity",toJSON(vo),0);
		};
		__Page.stateHome.inpuName=function(f)
		{
			if(window.Tapjoy)
			{
				Tapjoy.actionComplete("d4c27112-4d36-40d7-8058-d2f91d35ba89");
			}
			//随手推
			if("118103190"==window.ChannelID && !this.promotionCode)
			{
				this.promotionCode=Dialogs.getText("请输入推广码");
				if(this.promotionCode)
				{
					var code=this.promotionCode, rid=this.checkVo.userId, apiuser="kdzz", secret="kdzz123";
					sendHttp("http://kongzhong.digilinx.cn/api/Index/checkCoupon", {
						code:code,//C30007
						rid:rid,//12344
						apiuser:apiuser,//kongzhong1
						key:hex_md5(apiuser+secret+rid+code),//abcdefg
						mac:window.Imei
					}, function(r, content){
						DBOut("****** send response:"+toJSON({r:r, content:content}));
					});

					{
						var code=this.promotionCode, rid=this.checkVo.userId, apiuser="kdzz", secret="kdzz123";
						sendHttp("http://kongzhong.digilinx.cn/api/Index/checkTask", {
							code:code,//C30007
							rid:rid,//12344
							apiuser:apiuser,//kongzhong1
							key:hex_md5(apiuser+secret+rid+code),//abcdefg
							task:"creatname",
							mac:window.Imei
						}, function(r, content){
							DBOut("****** send response:"+toJSON({r:r, content:content}));
						});
					}
				}
				else
				{
					this.promotionCode="no code";
				}
			}

			this.appEnv.layer.setTimeout(100,function(){
				var str=this.appEnv.textLib.InputName;
				if(f){
					str=(f<0)?this.appEnv.textLib.SameName:this.appEnv.textLib.NullName;
					if(f==2)str=this.appEnv.textLib.IllName;
				}
				var text = Dialogs.getText(str);
				if(!text)
				{
					this.appEnv.layer.setFrameout(10,function(){this.inpuName(1);},this);
					return;
				}else{
					text=text.substring(0,window.NameLen-1);

					//检测用户名是否含有非法字符
					if(this.appEnv.isNameValid4CJK(text))
					{
						this.appEnv.layer.setFrameout(10,function(){this.inpuName(2);},this);
						return;
					}

					for(var i=0;i<text.length;i++)
					{
						if(text.charCodeAt(i)>=0xd800)
						{
							this.appEnv.layer.setFrameout(10,function(){this.inpuName(2);},this);
							return;
						}
					}
				}
				this.appEnv.updateNickName(text,function(flag){
					DBOut("----------------updateNickName flag="+flag);
					if(flag==1)
					{
						this.nickName=text;
						this.nextGuide();
					}else if(flag==-1){
						this.inpuName(-1);
					}else if(flag==-2){
						Dialogs.alert(this.appEnv.textLib.NotExistName);
						this.appEnv.sureReloadGame();
					}else if(flag==-3){
						Dialogs.alert(this.appEnv.textLib.SignFailed);
						this.appEnv.sureReloadGame();
					}
				},this);
			},this);
		};
		__Page.stateHome.endGuide=function()
		{
			this.bEndGuide=1;
			var text=this.nickName;
			this.saveCity(text);
			this.appEnv.loginGameServer(text);
			this.showLoadAct();
		};
		__Page.stateHome.showLoadAct=function()
		{
			//this.guideMask.fadeIn(10,0);
			this.guideMask.setDisplay(1);
			this.loadBgHud.setDisplay(1);
		};
		__Page.stateHome.startBattle=function(npcName,units)
		{
			var i,list,king,vo,lv,battleinfo,tech,saveTxt;
			king=aisGame.king;
			vo={};
			king.saveToVO(vo);

			battleinfo={selfAttackUnits:[],selfSpellUnits:[],clanUnits:[],oppCity:{}};

			tech=vo.techs;
			list=units?units:vo.citys[0].storages["Unit"].slots;
			for(i in list)
			{
				lv=tech[i]?tech[i].level:1;
				battleinfo.selfAttackUnits.push({codename:i,level:lv,num:list[i].num});
			}

			//把兵清除:
			vo.citys[0].storages["Unit"].slots={};
			saveTxt=toJSON(vo);
			this.page.setCookie("COC","SaveGuideLoad",saveTxt,0);

			var defLib=aisEnv.defLib.npcs;
			vo=defLib[npcName?npcName:"TutorialNPC"];//TutorialNPC
			this.page.appEnv.loadFile(UIBody.genPageURL("levels/"+vo.LevelFile+".json"),function(levelVO){
				battleinfo.oppCity={Gold:vo.Gold,Oil:vo.Oil,level:vo.ExpLevel,name:vo.name,instances:levelVO};
				this.page.setCookie("Runtime","PveStage",toJSON(battleinfo),0);
				this.page.setCookie("Runtime","guides","1",0);
				switchApp(this.page.genPageURL((this.page.DWRBase)?"ui_pve.jml":"ui_single_pve.jml"));
			},this);
		};
		__Page.stateHome.startGuideBattle=function(npcName)
		{
			var king,vo,saveTxt;
			king=aisGame.king;
			vo={};
			king.saveToVO(vo);
			saveTxt=toJSON(vo);
			this.page.setCookie("COC","SaveGuideLoad",saveTxt,0);

			npcName=npcName?npcName:"guideBattle";
			var data={};
			this.page.appEnv.loadFile(UIBody.genPageURL("levels/"+npcName+".json"),function(levelVO){
				data.oppCity={Gold:100,Oil:100,level:1,name:"Mark",instances:levelVO};

				this.page.setCookie("Runtime","BattleStage",toJSON(data),0);
				this.page.setCookie("Runtime","StartGame","GuideBattle",0);
				switchApp(this.page.genPageURL("ui_guideBattle.jml"));
			},this);
		};
		__Page.stateHome.switchGuide=function(guide)
		{
			this.curGuide=guide;
			if(this.page.appEnv.saveGuideStep)
			this.page.appEnv.saveGuideStep(this.curGuide.codeName);
			if(guide.showGirl){
				this.talkGirl.show(guide.girlFace?guide.girlFace:0,guide.talk);
			}
			else{
				this.talkGirl.hide();
			}
			if(guide.showPirate){
				this.talkPirate.show(guide.pirateFace?guide.pirateFace:0,guide.talk);
			}
			else{
				this.talkPirate.hide();
			}
			if(guide.mask){
				//this.appEnv.hudIn(this.guideMask,10);//TODO: 检查指引快速切换的情况下的正确性
				//this.guideMask.fadeIn(10,0);
				this.guideMask.setDisplay(1);
			}
			else{
				//this.appEnv.hudOut(this.guideMask,10);
				//this.guideMask.fadeOut(10,0);
				this.guideMask.setDisplay(0);
			}
			if(guide.shop)
			{
				this.btnShop.setDisplay(1);
			}
			else
			{
				this.btnShop.setDisplay(0);
			}

			if(guide.atk)
			{
				this.btnAttack.setDisplay(1);
			}
			else
			{
				this.btnAttack.setDisplay(0);
			}

			if(guide.achvmnt)
			{
				this.achvmntBtn.setDisplay(1);
			}
			else
			{
				this.achvmntBtn.setDisplay(0);
			}

			if(guide.music)
			{
				audio.playMusic({src:this.page.genPageURL(guide.music),loop:-1});
			}
			if(guide.startGuide)
			{
				guide.startGuide(this,this.page.vwHomeStage.level);
			}
			//TODO: 继续初始化指引, 标记热点控件
			this.foucsGuide();
		};

		__Page.stateHome.clearFoucs=function()
		{
			if(this.focusItem && !this.focusItem.deadOut)
			{
				this.focusItem.getFather().removeChild(this.focusItem);
				this.focusItem=null;
			}
			if(this.focusTool)
			{
				this.page.vwHomeStage.game.hudTools.freeTool(this.focusTool);
				this.page.vwHomeStage.gameHud.focusObj(null);
				this.focusTool=null;
				this.focusBld=null;
			}
		};

		__Page.stateHome.foucsGuide=function()
		{
			var list,i,n,item,def,bld,bldList,j,m,gameObj;
			var appEnv,cssLib,imgLib;
			var page=this.page;
			appEnv=page.appEnv;
			imgLib=page.imgLib;
			cssLib=page.cssLib;

			if(this.guideFocusTimer)
			{
				appEnv.layer.clearTimeout(this.guideFocusTimer);
				this.guideFocusTimer=null;
			}
			list=this.curGuide.hotHud;
			if(list)
			{
				item=null;
				bld=null;
				findItem:
				{
					n=list.length;
					for(i=0;i<n;i++)
					{
						def=list[i];
						//DBOut("Check :"+def.id);
						if(def.id)
						{
							item=appEnv.layer.getHudItem(def.id);
							if(item && item.isShowing())
								break findItem;
							item=appEnv.dlgLayer.getHudItem(def.id);
							if(item && item.isShowing())
								break findItem;
							item=appEnv.pmtLayer.getHudItem(def.id);
							if(item && item.isShowing())
								break findItem;
						}
						else if(def.bldType)
						{
							bldList=aisGame.curCity.buildings;
							m=bldList.length;
							for(j=0;j<m;j++)
							{
								if(bldList[j].def.codeName==def.bldType &&bldList[j].level>=def.bldLevel)
								{
									bld=bldList[j];
									break findItem;
								}
							}
						}
					}
				}
				if(bld && bld.homeBld)
				{
					if(this.focusBld && this.focusBld==bld)//Same building:
					{
						this.guideFocusTimer=appEnv.layer.setFrameout(5,this.foucsGuide,this);
						return;
					}
					this.page.vwHomeStage.gameHud.focusObj(bld.homeBld.cocBld);
					//DBOut("Found focus building: "+bld+", type: "+bld.def.codeName);
					for(i in bld)
					{
						DBOut(i);
					}
					this.clearFoucs();
					//Add Guide Tool
					gameObj=bld.homeBld.gameBld;
					//DBOut("Game bld: "+gameObj);
					this.focusTool=page.vwHomeStage.game.hudTools.addToolOn(this.hotBldTool,gameObj);
					this.focusTool.fadeIn(0.2);
					item=this.focusTool.getSubItem(0).getHudItem();
					this.focusItem=item.appendNewChild({
						type:"icon",pos:def.pos,css:imgLib.mark_focus,anchor_h:1,anchor_v:2,filter:1,
						state:this,
						onFree:function()
						{
							this.deadOut=1;
						}
					});
					this.focusBld=bld
					this.focusItem.adMove=this.focusItem.addAdTMFirst("move");
					this.focusItem.adMove.setFilter(1);
					this.focusItem.adMove.setMaxLimit(0,[0,10,0]);
					this.focusItem.adMove.setMinLimit(0,[0,-20,0]);
					this.focusItem.adMove.startAni(2,[0,0.15,0],0);
					this.focusItem.adRot=this.focusItem.addAdTMFirst("rotate");
					this.focusItem.adRot.setCurValue([0,0,3.1415926*def.dit/4]);
					if(def.text)
					{
						this.focusItem.tipText=this.focusItem.appendNewChild({
							type:"text",css:cssLib.textFineMid.createCSS([0,-113,0],def.text,20,30,1,1,1,1),
						});
						this.focusItem.tipText.adRot=this.focusItem.tipText.addAdTMFirst("rotate");
						this.focusItem.tipText.adRot.setCurValue([0,0,-3.1415926*def.dit/4]);
					}
				}
				else if(item)
				{
					if(this.focusItem && !this.focusItem.deadOut && this.focusItem.getFather()==item)
					{
						this.guideFocusTimer=appEnv.layer.setFrameout(5,this.foucsGuide,this);
						return;
					}
					//DBOut("Found focus item: "+list[i]);
					this.clearFoucs();
					this.focusItem=item.appendNewChild({
						type:"icon",pos:def.pos,css:imgLib.mark_focus,anchor_h:1,anchor_v:2,filter:1,
						state:this,
						onFree:function()
						{
							this.deadOut=1;
						}
					});
					this.focusItem.adMove=this.focusItem.addAdTMFirst("move");
					this.focusItem.adMove.setFilter(1);
					this.focusItem.adMove.setMaxLimit(0,[0,10,0]);
					this.focusItem.adMove.setMinLimit(0,[0,-20,0]);
					this.focusItem.adMove.startAni(2,[0,0.15,0],0);
					this.focusItem.adRot=this.focusItem.addAdTMFirst("rotate");
					this.focusItem.adRot.setCurValue([0,0,3.1415926*def.dit/4]);
					if(def.text)
					{
						this.focusItem.tipText=this.focusItem.appendNewChild({
							type:"text",css:cssLib.textFineMid.createCSS([0,-113,0],def.text,20,30,1,1,1,1),
						});
						this.focusItem.tipText.adRot=this.focusItem.tipText.addAdTMFirst("rotate");
						this.focusItem.tipText.adRot.setCurValue([0,0,-3.1415926*def.dit/4]);
					}
				}
			}
			this.guideFocusTimer=appEnv.layer.setFrameout(5,this.foucsGuide,this);
		};
	}

	//--------------------------------------------------------------------------
	//逻辑更新相关的函数
	//--------------------------------------------------------------------------
	{
		//启动逻辑更新机制
		__Page.stateHome.resumeLUDT=function()
		{
			this.lockLUDT-=1;
			if(this.lockLUDT<=0)
			{
				this.timerLUDT=this.appEnv.layer.setFrameout(0,this._logicUpdate,this);
			}
			DBOut("resumeLUDT: "+this.lockLUDT);
		};

		//暂停逻辑更新机制
		__Page.stateHome.pauseLUDT=function()
		{
			this.lockLUDT+=1;
			if(this.timerLUDT)
			{
				this.appEnv.layer.clearTimeout(this.timerLUDT);
				this.timerLUDT=null;
			}
			DBOut("pauseLUDT: "+this.lockLUDT);
		};

		//建议进行逻辑更新
		__Page.stateHome.aboutLUDT=function()
		{
			if(this.lockLUDT<=0)
			{
				if(this.timerLUDT)
				{
					this.appEnv.layer.clearTimeout(this.timerLUDT);
					this.timerLUDT=null;
				}
				this.timerLUDT=this.appEnv.layer.setFrameout(0,this._logicUpdate,this);
			}
			DBOut("aboutLUDT: "+this.lockLUDT);
		};

		//执行一次逻辑更新
		__Page.stateHome._logicUpdate=function()
		{
			var curTime,trgTime,gapTime;
			var king;
			var pushMsg=null;
			king=this.king;

			DBOut("Logic update by cityState!");
			//TODO: 检查是否有需要处理的Push消息.
			if(this.lockLUDT<=0)
			{
				pushMsg=this.king.getPushMsg();
				if(pushMsg)
				{
					//DBOut("Found a push message1: "+toJSON(pushMsg));
					this.appEnv.handlePushMsg(pushMsg);
				}
			}
			if(this.lockLUDT<=0)
			{
				//Update the king
				king.miniUpdate();

				//检查是否有需要处理的Push消息.
				if(!pushMsg)
				{
					pushMsg=this.king.getPushMsg();
					if(pushMsg)
					{
						//DBOut("Found a push message2: "+toJSON(pushMsg));
						this.appEnv.handlePushMsg(pushMsg);
					}
				}

				//部署下一次更新时间.
				if(this.lockLUDT<=0)
				{
					gapTime=1000*10;//默认10秒一次Update
					curTime=king.env.dateTime()+king.debugTimeGap;
					trgTime=king.triggerTime;
					if(trgTime)
					{
						//DBOut("TriggerTime: "+trgTime);
						//DBOut("curTime: "+curTime);
						//DBOut("DebugTime: "+king.debugTimeGap);
						gapTime=trgTime-(curTime);
						if(gapTime>0)
						{
							gapTime+=200;//向后扩一些时间.
						}
					}
					gapTime=gapTime<200?200:gapTime;
					DBOut("gapTime: "+gapTime);
					this.timerLUDT=this.appEnv.layer.setTimeout(gapTime,this._logicUpdate,this);
				}
			}
		};

		//更新下次逻辑更新的时间
		__Page.stateHome.updateLUDTTimer=function()
		{
			var curTime,trgTime,gapTime;
			var king;
			king=this.king;
			//部署下一次更新时间.
			if(this.timerLUDT)
			{
				this.appEnv.layer.clearTimeout(this.timerLUDT);
				this.timerLUDT=null;
			}
			if(this.lockLUDT<=0)
			{
				gapTime=1000*10;//默认10秒一次Update
				curTime=king.env.dateTime()+king.debugTimeGap;
				trgTime=king.triggerTime;
				if(trgTime)
				{
					gapTime=trgTime-curTime;
					if(gapTime>0)
					{
						gapTime+=200;//向后扩一些时间.
					}
				}
				this.timerLUDT=this.appEnv.layer.setTimeout(gapTime,this._logicUpdate,this);
			}
		};
	}

	//--------------------------------------------------------------------------
	//改变模式状态的函数
	//--------------------------------------------------------------------------
	{
		__Page.stateHome.showBldMenu=function(hotId)
		{
			var i,n,list;
			var appEnv=this.appEnv;
			list=this.menuBtns;
			n=list.length;
			for(i=0;i<n;i++)
			{
				appEnv.hudIn(list[i],5+Math.abs((i-hotId)*1));
			}
		};

		__Page.stateHome.hideBldMenu=function(hotId)
		{
			var i,n,list;
			var appEnv=this.appEnv;
			list=this.menuBtns;
			n=list.length;
			for(i=0;i<n;i++)
			{
				appEnv.hudOut(list[i],5+Math.abs((i-hotId)*1));
			}
		};

		__Page.stateHome.newPosBld=function(def,level)
		{
		};

		__Page.stateHome.endChooseBldPos=function(def,level,pos)
		{
		};
	}

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.stateHome.guideOnKey=function(msg,key,way,extra)
		{
			if(this.curGuide)
			{
				filterKey:
				{
					list=this.curGuide.keyFilter;
					if(list)
					{
						n=list.length;
						for(i=0;i<n;i++)
						{
							if(list[i].key==key && (!list[i].checkExtra || list[i].extra==extra))
							{
								break filterKey;
							}
						}
						return 0;
					}
				}
				if(this.curGuide.trigerKey==key && this.curGuide.trigerKeyMsg==msg && way==1)
				{
					this.nextGuide();
				}
			}
			return 1;
		};

		__Page.stateHome.onKey=function(msg,key,way,extra)
		{
			var ret,appEnv,url,list,i,n;
			appEnv=this.appEnv;
			if(this.bEndGuide)return;
			if(key==-1)
			{
				if(msg==2)//Start move
				{
					this.hudBaseBox.fadeOut(3,0);
				}
				else if(msg==1)//End move
				{
					appEnv.hudIn(this.hudBaseBox,3);
				}
				return;
			}
			if(msg==1 && way==1 && key<0)
			{
				if(key==-7)
				{
					if(window.PUR)
					{
						if(PUR.exitGame())
							return 1;
					}
					if(Dialogs.prompt(appEnv.textLib.AskExit))
					{
						if(window.aisNTEngine)window.aisNTEngine.onFree();
						exitApp();
					}
				}
				//确认新建建筑位置:
				if(key==-3)
				{
					DBOut("Build pos confirmed!")
					this.page.vwHomeStage.confirmNewBld();
					return 1;
				}
				//取消新建建筑:
				if(key==-4)
				{
					DBOut("Will abort new building!!");
					this.page.vwHomeStage.abortNewBld();
					return 1;
				}
				//升级建筑:
				if(key==appEnv.appKeys.bldUpgrade)
				{
					this.page.vwHomeStage.clearBtmBtns();
					this.page.vwHomeStage.upgradeBld();
					if(this.page.vwHomeStage.selBld)this.page.vwHomeStage.clearSelBld();
					return 1;
				}
				//打开训练单位对话框:
				if(key==appEnv.appKeys.bldTrain)
				{
					DBOut("Will show train dialog!");
					//this.page.vwHomeStage.upgradeBld();
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_train.jml");
					this.appEnv.openPageDlg(url,this.page.vwHomeStage.selBld);
					return 1;
				}
				//打开制造Spell对话框
				if(key==appEnv.appKeys.bldMakeSpell)
				{
					DBOut("Will show spell dialog!");
					//this.page.vwHomeStage.upgradeBld();
					this.aboutLUDT();
					url=this.page.genPageURL("ui/dlg/dlg_spell.jml");
					this.appEnv.openPageDlg(url,this.page.vwHomeStage.selBld);
					return 1;
				}
				//打开科研对话框:
				if(key==appEnv.appKeys.bldResearch)
				{
					var bld;
					DBOut("Will show research dialog!");
					//this.page.vwHomeStage.upgradeBld();
					this.aboutLUDT();
					bld=this.page.vwHomeStage.selBld;
					if(bld.aisBld)
					{
						if(bld.aisBld.working)
						{
							url=this.page.genPageURL("ui/dlg/dlg_case_info.jml");
							this.appEnv.openPageDlg(url,bld);
						}
						else
						{
							url=this.page.genPageURL("ui/dlg/dlg_research.jml");
							this.appEnv.openPageDlg(url,bld);
						}
					}
					return 1;
				}
				//取消建筑升级
				if(key==appEnv.appKeys.abortBuild)
				{
					DBOut("Will abort construction!");
					this.page.vwHomeStage.abortConstuction();
					return 1;
				}
				//加速按钮
				if(key==appEnv.appKeys.bldBoost)
				{
					DBOut("Will boost!!");
					this.page.vwHomeStage.boostBld();
					return 1;
				}
				//移除按钮
				if(key==appEnv.appKeys.bldRemove)
				{
					DBOut("Will remove!!");
					this.page.vwHomeStage.removeBld();
					return 1;
				}
				//钻石加速完成建造:
				if(key==appEnv.appKeys.bldGemDone)
				{
					DBOut("Will gem finish!!");
					this.page.vwHomeStage.gemFinBld();
					return 1;
				}
				//钻石加速完成建造:
				if(key==appEnv.appKeys.uiAchvmnt)
				{
					var king;
					DBOut("Will get Achvmnt bonus!!");
					king=aisGame.king;
					king.execCmd(king,"GetAvhmntBonus",{codeName:"GoldStorage"},king);
					return 1;
				}
				//持久化存盘
				if(key==appEnv.appKeys.debugSave)
				{
					DBOut("Will save king!");
					var king,city,vo,saveTxt;
					king=aisGame.king;
					vo={};
					king.saveToVO(vo);
					saveTxt=toJSON(vo);
					this.page.setCookie("COC","SaveGuideLoad",saveTxt,0);
					DBOut("King VO:");
					DBOut(saveTxt);
					//存贮战斗快照:
					vo={};
					city=aisGame.curCity;
					city.saveCoCVO(vo);
					saveTxt=toJSON(vo);
					this.page.setCookie("COC","Snap",saveTxt,0);
					DBOut("City Snap VO:");
					DBOut(saveTxt);
					//存储战斗Units:
					vo={};
					city=aisGame.curCity;
					city.saveCoCUnitVO(vo,this.page.vwHomeStage.level);
					saveTxt=toJSON(vo);
					this.page.setCookie("COC","BattleUnits",saveTxt,0);
					DBOut("City Battle Units VO:");
					DBOut(saveTxt);
					return 1;
				}
				//开关调试面板:
				if(key==appEnv.appKeys.debugSwitch)
				{
					if(this.hudDBBox.getDisplay())
					{
						appEnv.hudOut(this.hudDBBox,10);
						this.hudDBDock.startAniEx([-200,0,0],1,1,0,3);
						this.dbBtnOpen.setText(">");
					}
					else
					{
						appEnv.hudIn(this.hudDBBox,10);
						this.hudDBDock.startAniEx([0,0,0],1,1,0,3);
						this.dbBtnOpen.setText("<");
					}
					this.onKingUpdate();
					return 1;
				}
				//时间增量:
				{
					if(key==appEnv.appKeys.debugTimeGap1)
					{
						var king;
						king=aisGame.king;
						king.execCmd(king,"AddDebugTime",{time:30*1000},king);
						return 1;
					}
					if(key==appEnv.appKeys.debugTimeGap2)
					{
						var king;
						king=aisGame.king;
						king.execCmd(king,"AddDebugTime",{time:5*60*1000},king);
						return 1;
					}
					if(key==appEnv.appKeys.debugTimeGap3)
					{
						var king;
						king=aisGame.king;
						king.execCmd(king,"AddDebugTime",{time:30*60*1000},king);
						return 1;
					}
					if(key==appEnv.appKeys.debugTimeGap4)
					{
						var king;
						king=aisGame.king;
						king.execCmd(king,"AddDebugTime",{time:6*60*60*1000},king);
						return 1;
					}
				}
				{
					if(key==appEnv.appKeys.debugDonated)
					{
						var city;
						city=aisGame.curCity;
						//模拟捐赠消息:
						aisGame.king.execCmd(city,"GetDonated",{owner:"Avdpro",units:[{type:"UntMarine",num:5,level:1},{type:"UntMarine",num:2,level:2},{type:"UntSniper",num:5,level:1}]},city);
						return 1;
					}
					if(key==appEnv.appKeys.debugDonate)
					{
						var city;
						city=aisGame.curCity;
						//模拟捐赠消息:
						aisGame.king.execCmd(city,"DonateClan",{owner:"YPP",units:[{type:"UntMarine",num:2},{type:"UntSniper",num:1}]},city);
						return 1;
					}
				}
				{
					if(key==appEnv.appKeys.debugScaleU)
					{
						var scale;
						scale=this.page.vwHomeStage.gameHud.getScale();
						this.page.vwHomeStage.gameHud.setScale(scale+0.1);
						return 1;
					}
					if(key==appEnv.appKeys.debugScaleD)
					{
						var scale;
						scale=this.page.vwHomeStage.gameHud.getScale();
						this.page.vwHomeStage.gameHud.setScale(scale-0.1);
						return 1;
					}
				}
				//退出
				if(key==appEnv.appKeys.debugExit)
				{
					switchApp(this.page.genPageURL("ui_debug.jml"));
					return 1;
				}
			}
			//Default:
			ret=this.autoOnKey(msg,key,way,extra);
			DBOut("stateHome.onKey: "+msg+", "+key);
			if(ret)
				return ret;
		};

		__Page.stateHome.onShopClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				DBOut("Will open shop!");
				url=this.page.genPageURL("ui/dlg/dlg_shop.jml");
				this.appEnv.openPageDlg(url,null);
			}
		};

		__Page.stateHome.onAchvClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				var king;
				king=aisGame.king;
			//	this.aboutLUDT();
				url=this.page.genPageURL("ui/dlg/dlg_achieve.jml");
				this.appEnv.openPageDlg(url,king.achvmnts);
				return 1;
			}
		};

		__Page.stateHome.onAttackClick=function(msg,key,way,extra)
		{
			var url;
			if(msg==1 && way==1)
			{
				var king;
				king=aisGame.king;
				if(!aisGame.curCity.allStorages["Unit"].getUsedCap())
				{
					this.appEnv.stateLogs.showLog(this.page.appEnv.textLib.NotUnit);
					return;
				}
				url=this.page.genPageURL("ui/dlg/dlg_worldmap.jml");
				this.appEnv.openPageDlg(url,this);
				return 1;
			}
		};


		__Page.stateHome.onGuideMaskClick=function(msg,key,way,extra)
		{
			if(msg==1 && way==1)
			{
				DBOut("Guide Mask clicked!");
			}
		};

		__Page.stateHome.onBuildingClk=function(msg,key,way,extra)
		{
		};

		//管理Power，目前暂时用作Update。。。
		__Page.stateHome.onPowerClk=function(msg,key,way,extra)
		{
		};

		//管理库存，目前暂时用作测试建造建筑
		__Page.stateHome.onStoreClk=function(msg,key,way,extra)
		{
		};

		__Page.stateHome.onCaravanClk=function(msg,key,way,extra)
		{
		};

		__Page.stateHome.foucsBld=function(def)
		{
			var i,mbldList,bld;
			bldList=aisGame.curCity.buildings;
			m=bldList.length;
			for(i=0;i<m;i++)
			{
				if(bldList[i].def.codeName==def.bldType &&bldList[i].level==def.bldLevel)
				{
					bld=bldList[i];
					break;
				}
			}
			if(bld)
			{
				if(bld.homeBld){
					this.page.vwHomeStage.gameHud.focusObj(bld.homeBld.cocBld);
					this.appEnv.layer.setFrameout(5,function(){
						this.page.vwHomeStage.gameHud.focusObj(null);
					},this);
				}else
					this.appEnv.layer.setFrameout(0,function(){
						this.page.vwHomeStage.gameHud.focusObj(bld.homeBld.cocBld);
						this.appEnv.layer.setFrameout(5,function(){
							this.page.vwHomeStage.gameHud.focusObj(null);
						},this);
					},this);
			}
		};
	}
}
