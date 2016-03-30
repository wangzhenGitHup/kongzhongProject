if(!__Page.stateBattle)
{
	__Page.stateBattle={
		page:__Page,
		name:"GuideBattleState",
		lastLUDT:0,
		lockLUDT:1,
		timerLUDT:null,
		pushMsgs:[],
		curGuide:null,
	};

	//添加至appEnv的自动初始化列表中:
	__Page.appEnv.dynaStates.push(__Page.stateBattle);

	//***************************************************************************
	//初始化相关*****************************************************************
	//***************************************************************************
	{
		//初始化State
		__Page.stateBattle.init=function(appEnv)
		{
			var page;
			var imgLib;
			var cssLib;
			var city;
			var layer,keyid;

			this.appEnv=appEnv;
			appEnv.stateBattle=this;
			page=this.page;
			imgLib=page.imgLib;
			cssLib=page.cssLib;

			this.stage=page.vwBattleStage;

			page.keyStateUtil.call(this);
			this.stage.initStage();

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
			//DBOut("stateBattle.init: "+appEnv);
			this.appEnv.layer.setDisplay(0);
			this.loadImgHud=this.hudTLBox.appendNewChild({type:"icon",pos:[-100,-100,0],tex:"",tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:10, h:10,display:0});
		};

		__Page.stateBattle.enter=function(preState)
		{
			var appEnv=this.appEnv;
			var page=this.page;
			DBOut("stateBattle: Enter");
			if(window.aisGame)
			{
				aisGame.king.addListener(this);
			}
			this.checkVo={};
			var oUserVO = this.page.getCookie("Runtime","UserVO");
			if(oUserVO)
			{
				this.checkVo=fromJSON(oUserVO);
			}
		};

		__Page.stateBattle.leave=function(nextState)
		{
			//TODO:code this:
			if(window.aisGame)
			{
					aisGame.king.removeListener(this);
			}
		};

		//当King执行命令后,会调用这个函数:
		__Page.stateBattle.onExecCom=function(comObj,com,comVO,caller)
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

		__Page.stateBattle.onGameLoaded=function()
		{
			var page=this.page;
			var appEnv=this.appEnv;
			var cssLib=page.cssLib;
			var imgLib=page.imgLib;


			this.hudTLBox.setDisplay(0);
			this.hudTCBox.setDisplay(0);


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
					},{type:"icon",id:"Face_1",pos:[0,0,0],css:imgLib.mark_girl,display:1},
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
						type:"icon",id:"TalkBox",pos:[280,120,0],css:imgLib.getImg("mark_girl_talk"),w:500,h:160,//pos:[180,150,0],
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
				type:"icon",pos:[appEnv.scrSize[0],appEnv.scrSize[1]-imgLib.mark_pirate.h+3,0],css:imgLib.mark_pirate,display:0,fade:1,fade_size:1,fade_alpha:0,anchor_h:2,
				items:[
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

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Up",[100,500,0],180,appEnv.appKeys.debugScaleU);
			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Scale Down",[100,550,0],180,appEnv.appKeys.debugScaleD);

			this.dbBtnSave=cssLib.btnDebug.create(this.hudDBBox,"Exit",[100,600,0],180,appEnv.appKeys.debugExit);


			var savedTxt,gameVO,vo;
			savedTxt=page.getCookie("Runtime","BattleStage");
			page.setCookie("Runtime","BattleStage","",0);
			if(savedTxt)
			{
				gameVO=fromJSON(savedTxt);
				if(gameVO)
				{
					this.stage.proxyBattle(gameVO);
					vo=this.stage.battleInfo;
					this.stage.initCityBlds();
				}
			}
			this.loadUnitsImg(this.page.defGuides["putDownUnit1"].units);
			//this.loadUnitsImg(this.page.defGuides["putDownUnit2"].units);
			//this.loadUnitsImg(this.page.defGuides["putDownUnit3"].units);

			//this.hotBldTool=this.stage.game.hudTools.getHudToolDef("bld_guideFocus");
			this.appEnv.layer.setFrameout(60,function(){
				this.switchGuide(page.defGuides[this.initGuide?this.initGuide:"GuideBattle1"]);
			},this);
		};

	}


	//***************************************************************************
	//说话女孩*******************************************************************
	//***************************************************************************
	{
		__Page.stateBattle.talkGirl={
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
				DBOut("Show girl: "+talkText+" this.isShow:"+this.isShow);
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
				DBOut("Show text isShow: "+self.isShow+" text:"+self.showText);
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
		__Page.stateBattle.talkPirate={
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
		__Page.stateBattle.nextGuide=function()
		{
			this.appEnv.closePmtDlg();
			var king,city,vo,saveTxt;
			var nextGD;
			if(this.curGuide)
			{
				nextGD=this.page.defGuides[this.curGuide.nextGuide];
				if(nextGD && nextGD.putDownUnit)
				{
					this.switchGuide(nextGD);
					//放兵
					this.stage.startPutDownUnits(this.curGuide.units,this.curGuide.focusOrigin);

				}else if(this.curGuide.endGuide)
				{
					//TODO:从这里结束教学
					this.endGuide();
				}
				else
				{
					if(nextGD)
					{
						this.switchGuide(nextGD);
					}
				}
			}
		};

		__Page.stateBattle.endGuide=function()
		{
			var textLib=this.appEnv.textLib;
			if(this.curGuide.endGuide==2)
			{
				this.appEnv.showPmtDlg(this.page.pmtChoose,0,
				{
					title:textLib.ConfirmJumpGuide,info:textLib.sureJumpGuide,
					pmtFunc:this._endGuide,pmtObj:this,
				});
			}else{
				this.bEndGuide=1;
				var text=this.nickName;
				this.saveCity(text);
				this.appEnv.loginGameServer(text);
				this.showLoadAct();
			}
		};
		__Page.stateBattle._endGuide=function(abort)
		{

			if(!abort)
			{
				this.inpuName();
				this.curGuide.nextGuide="JumpInputName";
				var nextGD=this.page.defGuides[this.curGuide.nextGuide];
				this.switchGuide(nextGD);
			}else{
				this.showLoadAct();
				this.bEndGuide=1;
				this.page.setCookie("Runtime","StartGame","GuideLoad",0);
				switchApp(this.page.genPageURL("ui_guide.jml"));
			}
		};

		__Page.stateBattle.inpuName=function(f)
		{
			if(window.Tapjoy)
			{
				Tapjoy.actionComplete("d4c27112-4d36-40d7-8058-d2f91d35ba89");
			}
			//随手推
			DBOut("inputName: "+window.ChannelID+" "+this.promotionCode);
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
		__Page.stateBattle.saveCity=function(name)
		{
			var i,n,list,bld,vo,king,city;
			king={};
			vo={};
			/*
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
			*/

			vo.name=name;
			vo.exp=0;
			vo.gem=50;
			vo.gold=0;
			vo.oil=0;
			vo.bld=[];
			vo.bld.push({instanceId:"136",codename:"GoldMine",level:1,x:26,y:15});
			vo.bld.push({instanceId:"137",codename:"OilWell",level:1,x:26,y:22});
			vo.bld.push({instanceId:"138",codename:"Cannon",level:1,x:19,y:22});

			this.page.setCookie("Runtime","GuideCity",toJSON(vo),0);
		};
		__Page.stateBattle.showLoadAct=function()
		{
			//this.guideMask.fadeIn(10,0);
			this.guideMask.setDisplay(1);
			this.loadBgHud.setDisplay(1);
		};
		__Page.stateBattle.switchGuide=function(guide)
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
				this.guideMask.setDisplay(1);
			}
			else{
				this.guideMask.setDisplay(0);
			}

			if(guide.music)
			{
				audio.playMusic({src:this.page.genPageURL(guide.music),loop:-1});
			}
			if(guide.startGuide)
			{
				guide.startGuide(this,this.stage.level);
			}
			//TODO: 继续初始化指引, 标记热点控件
			this.foucsGuide();
		};

		__Page.stateBattle.clearFoucs=function()
		{
			if(this.focusItem && !this.focusItem.deadOut)
			{
				this.focusItem.getFather().removeChild(this.focusItem);
				this.focusItem=null;
			}
			if(this.focusTool)
			{
				this.stage.game.hudTools.freeTool(this.focusTool);
				this.stage.gameHud.focusObj(null);
				this.focusTool=null;
				this.focusBld=null;
			}
		};

		__Page.stateBattle.foucsGuide=function()
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
					this.stage.gameHud.focusObj(bld.homeBld.cocBld);
					//DBOut("Found focus building: "+bld+", type: "+bld.def.codeName);
					for(i in bld)
					{
						DBOut(i);
					}
					this.clearFoucs();
					//Add Guide Tool
					gameObj=bld.homeBld.gameBld;
					//DBOut("Game bld: "+gameObj);
					this.focusTool=this.stage.game.hudTools.addToolOn(this.hotBldTool,gameObj);
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
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.stateBattle.guideOnKey=function(msg,key,way,extra)
		{
			if(this.bEndGuide)return 1;
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

		__Page.stateBattle.onKey=function(msg,key,way,extra)
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
					city.saveCoCUnitVO(vo,this.stage.level);
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
					return 1;
				}
				{
					if(key==appEnv.appKeys.debugScaleU)
					{
						var scale;
						scale=this.stage.gameHud.getScale();
						this.stage.gameHud.setScale(scale+0.1);
						return 1;
					}
					if(key==appEnv.appKeys.debugScaleD)
					{
						var scale;
						scale=this.this.stage.gameHud.getScale();
						this.stage.gameHud.setScale(scale-0.1);
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
			DBOut("stateBattle.onKey: "+msg+", "+key);
			if(ret)
				return ret;
		};

		__Page.stateBattle.roundOver=function(bend)
		{
			if(bend)this.curGuide.nextGuide="GuideBattle4";
			this.appEnv.layer.setFrameout(50,this.nextGuide,this);
		};
		__Page.stateBattle.loadUnitsImg=function()
		{
			var vo=["chr_UntMarine_img2_32","chr_UntSniper_img2_32","chr_UntCyber_img2_32","chr_UntHacker_img2_32","chr_UntTank_img2_32","chr_UntPEKKA_img0_32","chr_UntTank_img1_32","chr_UntTank_img0_32","chr_UntAvenger_img2_32"];
			if(!vo)return;
			var i,n,u,unit;
			n=vo.length;
			for(i=0;i<n;i++)
			{
				//unit=vo[i];
				//if(unit.group==4 || unit.group==5)continue;
				//u=window.imgPath+"/units/chr_"+unit.type+"_img";
				//this.loadImgHud.appendNewChild({type:"icon",pos:[-100,-100,0],tex:this.page.genURL(u+"0_32.png"),tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:10, h:10,display:0,m1_sp:1});
				//this.loadImgHud.appendNewChild({type:"icon",pos:[-100,-100,0],tex:this.page.genURL(u+"1_32.png"),tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:10, h:10,display:0,m1_sp:1});
				//this.loadImgHud.appendNewChild({type:"icon",pos:[-100,-100,0],tex:this.page.genURL(u+"2_32.png"),tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:10, h:10,display:0,m1_sp:1});

				this.loadImgHud.appendNewChild({type:"icon",pos:[-100,-100,0],tex:this.page.genURL(window.imgPath+"/units/"+vo[i]+".png"),tex_u:0, tex_v:0, tex_w:1, tex_h:1, w:10, h:10,display:0,m1_sp:1});
			}
		};
	}
}
