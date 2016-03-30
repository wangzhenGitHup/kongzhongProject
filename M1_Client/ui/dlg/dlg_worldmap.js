if(!__Page.dlgMap)
{
	__Page.dlgMap=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,0);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgMap;
	__Page.dlgMap.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		this.dotCSS={
			imgLib:imgLib,cssLib:cssLib,textLib:textLib,state:this,page:this.page,
			createCSS:function(pos,key,vo,unlock)
			{
			//	DBOut("dot createCSS:"+toJSON(vo));
				var imgLib=this.imgLib;
				var dotPic, starPic;
				if(unlock)
					dotPic=imgLib.getImg("pic_level_u");
				else
					dotPic=imgLib.getImg("pic_level_g");
				starPic=imgLib.getImg("pic_pve_star");
				var css={id:"dot",type:"key",pos:pos,anchor_h:1,anchor_v:1,ui_event:1,key:key,css:dotPic,fade:1,fade_alpha:0,fade_size:1,fade_pos:pos,
					state_up:dotPic,state_down:dotPic,state_gray:dotPic,audio:this.page.audioObject.genFileURL("btn_click"),
					items:[
						{id:"name",css:cssLib.textFineMid.createCSS([0,-(dotPic.h/2+starPic.h/2+15),0],vo.name,100,20,1,1,1,1)}
					],
					imgLib:this.imgLib,cssLib:this.cssLib,textLib:this.textLib,state:this.state,info:vo,unlock:unlock,
					onSelect:this.onSelect,clearSelect:this.clearSelect,addAtk:this.addAtk
				};
				var sx=[-starPic.w+5,0,starPic.w-5];
				var y=-(dotPic.h/2+starPic.h/2-8);
				var sy=[y+2,y-2,y+2];
				for(var i=0; i<3; i++)
				{
					css.items.push({id:"star"+i,type:"icon",pos:[sx[i],sy[i],0],anchor_h:1,anchor_v:1,css:starPic,display:vo.star?1:0,color_a:(!vo.star || i>=vo.star)?100:255});
				}
				return css;
			},
			create:function(box,pos,key,vo,unlock)
			{
				return box.appendNewChild(this.createCSS(pos,key,vo,unlock));
			},
			onSelect:function()
			{
				if(this.state.curDot==this)
					return;
				if(this.state.curDot)
					this.state.curDot.clearSelect();
				this.state.curDot=this;
				this.addAtk();
				this.state.resGold._setText(""+this.info.gold);
				this.state.resOil._setText(""+this.info.oil);
				if(this.unlock)
				{
					var selCSS=imgLib.getImg("pic_level_d");
					this.setStateStyle(0,selCSS);
					this.setStateStyle(1,selCSS);
					this.setStateStyle(2,selCSS);
				}
			},
			clearSelect:function()
			{
				var atk=this.getItemById("btn-"+this.getId());
				if(atk)
					this.removeChild(atk);
				this.state.curDot=null;
				if(this.unlock)
				{
					var selCSS=imgLib.getImg("pic_level_u");
					this.setStateStyle(0,selCSS);
					this.setStateStyle(1,selCSS);
					this.setStateStyle(2,selCSS);
				}
			},
			addAtk:function()
			{
				if(!this.unlock)return;
				var state=this.state, info=this.info, keyid, btnId=this.getId();
				if("pve1"==btnId)
					keyid=state.appEnv.appKeys.btnAttackPve;
				else
					keyid=state.appEnv.hudKeys.getKey(this);
				state.regKeyVO(keyid,state,state.onChallengeClk);
				state.pveKeys[""+keyid]={codeName:info["codeName"], name:info["name"], resRemainGold:info.gold, resRemainOil:info.oil, ExpLevel:info["ExpLevel"], LevelFile:info["LevelFile"]};

				var dotPic=this.imgLib.getImg("pic_level_u");
				var btnPic=this.imgLib.getImg("btn_green_u");
				var atkCSS={id:"btn-"+btnId,css:cssLib.normalBtn.createCSS([0,dotPic.h/2+btnPic.h/2,0],keyid,0,this.textLib["Challenge"],btnPic.w,btnPic.h),button:1};
				this.appendNewChild(atkCSS);
			}
		};
	};
	__Page.dlgMap.init=function(appEnv)
	{
		this.name="dlgMap";
		this.viewId="dlgMap";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		var img=imgLib.getImg("pic_searchbg");
		this.searchW=img.w;//448
		this.searchH=img.h;//640
		var scale=appEnv.scrSize[1]/this.searchH;
		this.searchW*=scale;
		this.mapW=this.boxW-this.searchW;

		this.rangeMinX=this.searchW;
		this.rangeMaxX=this.boxW;
		this.rangeMinY=0;
		this.rangeMaxY=this.boxH;

		this.dlgBox.removeChild(this.dlgFrame);
		this.dlgFrame=this.dlgBox.appendNewChild({
		//	type:"shape",id:"dlgFrame",pos:[0,0,0],w:this.boxW,h:this.boxH,border_r:0,border_g:0,border_b:0,border_a:0,face_r:60,face_g:67,face_b:72,face_a:255,ui_event:1,
			type:"div3x3",id:"dlgFrame",pos:[0,0,0],w:this.boxW,h:this.boxH,css:imgLib.getImg("box_dlginner"),ui_event:1,
		});

		this.cntBox_l=this.dlgFrame.appendNewChild({type:"icon",id:"box-find",pos:[0,0,0],w:this.searchW,h:this.boxH,css:imgLib.getImg("pic_searchbg"),ui_event:1});
		this.cntBox_r=this.dlgFrame.appendNewChild({type:"icon",id:"box-pve",pos:[this.searchW,0,0],w:this.mapW,h:this.boxH,clip:1,ui_event:1});

		var mapW=256, mapH=1024;
		var mapScale=this.mapW/mapW;
		mapW*=mapScale, mapH*=mapScale;
		var totalH=mapH*3;

		this.navBox=this.cntBox_r.appendNewChild({
			type:"nav_box",id:"navBox",pos:[0,0,0],w:this.mapW,h:this.boxH,ui_event:1,display:1,csm_pos:0,edge_factor:0,
			min_pos:[0,-totalH+this.boxH,0],max_pos:[0,0,0],drag_enabled:1,pinch_enabled:0,//key:appEnv.appKeys.navBox,
		});

		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onClearClk);
		this.pveBox=this.cntBox_r.appendNewChild({type:"icon",id:"map",pos:[0,0,0],w:mapW,h:totalH,ui_event:1,css:imgLib.getIcon("map_pve_32"),clip:1,items:[
			{type:"icon",id:"map-1",pos:[0,0,0],w:mapW,h:mapH,css:imgLib.getIcon("map_pve_32")},
			{type:"icon",id:"map-2",pos:[0,mapH,0],w:mapW,h:mapH,css:imgLib.getIcon("map_pve_32")},
			{type:"icon",id:"map-3",pos:[0,mapH*2,0],w:mapW,h:mapH,css:imgLib.getIcon("map_pve_32")},
		//	{type:"key",id:"big-key",pos:[0,0,0],w:mapW,h:mapH*3,ui_event:1,button:1,key:keyid,state_up:{w:mapW,h:mapH*3}}
		]});

		//this.navBox.setNavItem(this.pveBox);
//		this.setNavBoxRangeByScale(1);
//		this.setNavBoxRangeByScale=function(scale)
//		{
//			var w,h,appEnv=this.appEnv;
//			var scrSize=appEnv.scrSize;
//			w=72;h=54;
//			this.navBox.setMinNavPos([scrSize[0]-(3000/2)*scale,scrSize[1]-(2500+8)*scale,0]);
//			this.navBox.setMaxNavPos([(3000/2)*scale,-8*scale,0]);
//		};

		var bx=this.bx=10,bh=68,bw=this.mapW-bx*2,by=this.boxH-bh/2-5;
		var iconSize=48;
		var ix=120,tx=ix-6-iconSize/2,th=48,ty=(bh-th)/2;
		this.resBox=this.cntBox_r.appendNewChild({id:"box-res",type:"div3x3",pos:[bx,by,0],w:bw,h:bh,anchor_h:0,anchor_v:1,css:imgLib.getImg("box_dark"),//face_r:0,face_g:0,face_b:0,face_a:200,
			fade:1,fade_pos:[bx,by+bh+10,0],fade_size:1,fade_alpha:1,display:0,items:[
			{id:"tip",css:cssLib.textFineSmall.createCSS([bw/2,-bh/2+10,0],textLib["RemainRes"]+":",100,th,1,1,1,1),font_size:FS.M},
			{id:"gold",css:cssLib.textFineSmall.createCSS([tx,ty,0],"???",100,th,2,1,2,1),font_size:FS.M},
			{type:"icon",pos:[ix,ty,0],css:imgLib.getIcon("res_gold",64),w:iconSize,h:iconSize,anchor_h:1,anchor_v:1},
			{id:"oil",css:cssLib.textFineSmall.createCSS([bw/2+tx,ty,0],"???",100,th,2,1,2,1),font_size:FS.M},
			{type:"icon",pos:[bw/2+ix,ty,0],css:imgLib.getIcon("res_oil",64),w:iconSize,h:iconSize,anchor_h:1,anchor_v:1},
		]});
		this.resGold=this.resBox.getItemById("gold");
		this.resOil=this.resBox.getItemById("oil");

		var btnBG=this.dlgFrame.appendNewChild({type:"icon",id:"bg-btn",pos:[this.boxW,0,0],css:imgLib.getImg("pic_closebg"),anchor_h:2,anchor_v:0});
		var btnPic=imgLib.getImg("btn_close_u");
		//关闭对话框的按钮:
		this.btnCloseKeyId=keyid=appEnv.appKeys.btnClose;
		this.btnClose=cssLib.btnCloseDlg.create(this.dlgFrame,[this.boxW-btnPic.w/2,btnPic.w/2,0],keyid);
		this.regKeyVO(keyid,this,this.onCloseClk);

//		keyid=appEnv.hudKeys.getKey(this);
//		this.regKeyVO(keyid,this,this.onLogClk);
//		this.lbxLog=this.cntBox_r.appendNewChild({pos:[0,0,0],w:this.boxW/2,h:this.boxH,css:this.listCSS,key:keyid});

		var bgPic=imgLib.getImg("pic_waropen");
		var disp=0;
		var clanInitVO=page.stateHome.clanInitVO;
		if(clanInitVO && clanInitVO.targetDomainId)
			disp=1;
		this.landWarBG=this.cntBox_l.appendNewChild({id:"landwar-bg",type:"icon",pos:[18*scale,120*scale,0],w:bgPic.w*scale,h:bgPic.h*scale,css:bgPic,display:disp});
		var titleX=this.searchW/2, titleY=30;
		this.cntBox_l.appendNewChild({css:cssLib.textFineBig.createCSS([titleX,titleY,0],textLib["MultMode"],100,20,1,1,1,1)});
		var scoreX=titleX-40, scoreY=titleY+40;
		this.cntBox_l.appendNewChild({css:cssLib.textFineMid.createCSS([scoreX,scoreY,0],textLib["CurMedal"],100,20,2,1,2,1)});
		var curHonor=window.aisGame.curCity.honor;
		var medalBox=this.cntBox_l.appendNewChild({css:cssLib.boxGem.createCSS([scoreX+80,scoreY,0],null,"",curHonor?curHonor:0)});
		medalBox.getItemById("Pic-Res").setTexURL(imgLib.genIconPath("medal",64));

		this.cntBox_r.appendNewChild({css:cssLib.textFineBig.createCSS([titleX,titleY,0],textLib["PveBtn"],100,20,1,1,1,1)});
		this.cntBox_r.appendNewChild({css:cssLib.textFineMid.createCSS([scoreX,scoreY,0],textLib["CurStar"],100,20,2,1,2,1)});
		var starBox=this.starBox=this.cntBox_r.appendNewChild({css:cssLib.boxGem.createCSS([scoreX+80,scoreY,0],null,"",0)});
		var star=imgLib.getImg("pic_star"), starItem=starBox.getItemById("Pic-Res"), starTxt=starBox.getItemById("Text-Cur"), starPos=[];
		starItem.setTexURL(star.tex);
		starItem.setTexUV([star.tex_u,star.tex_v,star.tex_w,star.tex_h]);
	//	starItem.setW(62*0.8);
	//	starItem.setH(58*0.8);
		starItem.getPos(starPos);
		starItem.setPos([starPos[0],starPos[1]-5,0]);
		starTxt.getPos(starPos);
		starTxt.setPos([starPos[0]-5,starPos[1],0]);

		var btnPic=imgLib.getImg("btn_green_u");
		var btnX=this.searchW-btnPic.w/2-30;
		var btnY=this.boxH-btnPic.h/2-90;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onSearchClk);
		this.btnMatch=this.cntBox_l.appendNewChild({id:"btnMatch",css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["Match"])});
		if(window.USERID<20000)
		{
			this.btnMatch.firstChild()._setColor(255,0,0,255);
		}
		this.cntBox_l.appendNewChild({css:cssLib.textFineMid.createCSS([15,btnY,0],textLib["SearchCost"],100,20,0,1,0,1)});
		var atkCost=window.aisGame.curCity.attackCost;
		var color=[255,255,255,255];
		if(!window.aisGame.guideMode)
			color=this.page.vwHomeStage.checkCost({storage:[{store:"Gold",type:"ResGold",num:atkCost}]},0)?[255,255,255,255]:[200,0,0,255];
		this.cntBox_l.appendNewChild({css:cssLib.textFineMid.createCSS([180,btnY,0],atkCost?atkCost:0,100,20,2,1,2,1,color)});
		this.cntBox_l.appendNewChild({type:"icon",pos:[200,btnY,0],css:imgLib.getIcon("res_gold",64),w:32,h:32,anchor_h:1,anchor_v:1});
		if(disp)
		{
			var def=window.aisEnv.defLib.clanCupDomains[clanInitVO.targetDomainId], area="N/A", score=0;
			if(def)area=def["name"];
			score=appEnv.getWarScoreByUserId(window.USERID);
			this.cntBox_l.appendNewChild({css:cssLib.textFineMid.createCSS([15,btnY+10+30,0],textLib["LandWarTarget"],100,20,0,1,0,1),font_size:FS.L});
			this.cntBox_l.appendNewChild({css:cssLib.textFineMid.createCSS([250,btnY+10+30,0],area,100,20,2,1,2,1),font_size:FS.L});
			this.cntBox_l.appendNewChild({css:cssLib.textFineMid.createCSS([15,btnY+10+30*2,0],textLib["LandWarSelfScore"],100,20,0,1,0,1),font_size:FS.L});
			this.cntBox_l.appendNewChild({css:cssLib.textFineMid.createCSS([250,btnY+10+30*2,0],score,100,20,2,1,2,1),font_size:FS.L});
		}
	};

	__Page.dlgMap.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.mainState=vo;
		this.dots=[];

		appEnv.setDlgAniCall(function()
		{
			var bx=this.bx;
			var img_pve=imgLib.getImg("pic_pve");
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onOltClk);
			this.oltHud=this.cntBox_r.appendNewChild({type:"icon",id:"oltHud",pos:[0,img_pve.h,0],ui_event:1,css:imgLib.getImg("pic_olt"),//clip:1,touch_block:1,
				fade:1,fade_pos:[0,img_pve.h<<1,0],fade_alpha:0,fade_size:1,items:[
				{type:"text",id:"oltlv",css:cssLib.textFineMid.createCSS([bx+105,img_pve.h-130,0],textLib.getText(textLib["OltLevel"],{cur:1,max:50}),100,20,1,1,1,1)},
				{type:"key",id:"btnOltMode",css:cssLib.normalBtn.createCSS([bx+105,img_pve.h-75,0],keyid,0,textLib["OltBtn"])}
			]});

			keyid=appEnv.appKeys.btnPve;
			this.regKeyVO(keyid,this,this.onOpenPveClk);
			this.pveHud=this.cntBox_r.appendNewChild({type:"icon",id:"pveHud",pos:[0,0,0],ui_event:1,css:img_pve,//clip:1,touch_block:1,
				fade:1,fade_pos:[0,-img_pve.h,0],fade_alpha:0,fade_size:1,items:[
				{type:"key",id:"btnPveMode",css:cssLib.normalBtn.createCSS([bx+105,img_pve.h-75,0],keyid,0,textLib["PveBtn"])}
			]});

			btnPic=imgLib.getImg("btn_back_u");
			keyid=appEnv.hudKeys.getKey(this);
			this.btnPveClose=cssLib.btnBackDlg.create(this.cntBox_r,[btnPic.w>>1,btnPic.h/2,0],keyid);
			this.regKeyVO(keyid,this,this.onClosePveClk);
			this.btnPveClose.setDisplay(0);

			var city=aisGame.curCity;
			if(city && city.pve2VO)
			{
				var txt=window.aisEnv.defLib.globals.MAX_PVE2_STAGE_ID;
				if(!txt)txt=50;
				var cur=city.pve2VO.stageId;
				if(cur<txt && city.pve2VO.result==1)cur++;
				this.oltHud.getItemById("oltlv").setText(textLib.getText(textLib["OltLevel"],{cur:cur,max:txt}));
			}else{
				this.oltHud.getItemById("btnOltMode").setDisplay(0);
			}
			this.pveHud.fadeIn(20,0);
			this.oltHud.fadeIn(20,0);
		},this);
	};
	__Page.dlgMap.setDotsDisplay=function(f)
	{
		var i;
		for(i=0;i<this.dots.length;i++)
		{
			this.dots[i].setDisplay(f);
		}
	};
	__Page.dlgMap.showPveStage=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;
		var defLib=window.aisEnv.defLib.npcs;
		this.defLib=defLib;
		var vo=aisGame.curCity.pveVOs;

		if(this.dots.length)
		{
			this.setDotsDisplay(1);
			return;
		}
		//DBOut("pveVos:"+toJSON(vo));
		var first={},i,j,info,depInfo,dotList;
		var dotPath=window.mapPath;
//		var cookie=this.page.getCookie("Save","Path");
//		if(cookie)
//			dotPath=fromJSON(cookie);
		//根据VO初始化PVE界面:
		if(!vo || !vo.length)
		{
			j=0;
			for(i in defLib)
			{
				if(j)break;
				j++;
				first=defLib[i];
			}
			//DBOut(toJSON(first));
			vo=[
				{stageId:first["codeName"],lastStageId:0,star:0,resRemainGold:first["Gold"],resRemainOil:first["Oil"],},
			];
		}
		var pveInfoVO={};
		for(i=0; i<vo.length; i++)
		{
			pveInfoVO[vo[i].stageId]=vo[i];
		}
		this.infoVO=vo;
		this.pveInfoVO=pveInfoVO;
		this.dotKeys={};
		this.pveKeys={};
		this.lbxResponse=0;

		var pveUnlock, keyid, dot, picDot=imgLib.getImg("pic_dot");
		var firstDot, k=0, totalStar=0, gainStar=0;
		var lastUnlock=0,lastDot=0;
		this.timer=setFrameout(window.DelayLoad,function(){
			for(i in defLib)
			{
				info=defLib[i];
				if(!info["codeName"])
					continue;
				totalStar+=3;
				pveInfo=pveInfoVO[i];
				pveUnlock=0;
				star=0;
				goldLost=info["Gold"];
				oilLost=info["Oil"];
				if(info["MapDependencies"])
				{
					depInfo=defLib[info["MapDependencies"]];
					if(dotPath && dotPath[info["codeName"]])
					{
					//	DBOut("use exit path!!!");
					//	dotList=dotPath[info["codeName"]];
						dotList=[];
					}
					else
					{
					//	DBOut("create new path!!!");
						dotList=[];
					//	cssLib.genPoints([info["x"],info["y"]],[depInfo["x"],depInfo["y"]],50,dotList);
					//	dotPath[info["codeName"]]=dotList;
					}
					for(j=0; j<dotList.length; j++)
					{
						this.pveBox.appendNewChild({type:"icon",pos:[dotList[j][0],dotList[j][1],0],anchor_h:1,anchor_v:1,css:picDot});
					}
				}
				if(this.checkMapUnlock(info["MapDependencies"]))
				{
					pveUnlock=1;
					if(pveInfo)
					{
						star=pveInfo.star;
						goldLost=pveInfo.resRemainGold;
						oilLost=pveInfo.resRemainOil;
						gainStar+=star;
					}
						lastUnlock=[info["x"],info["y"],0];
						this.lastUnlock=lastUnlock;
						DBOut("lastUnlock="+lastUnlock);
				}
				else
				{
					if(!this.lastUnlock)
					{
					}
				}
				if(!k)
					keyid=appEnv.appKeys.btnPve1;
				else
					keyid=appEnv.hudKeys.getKey(this);
				k++;
				lastDot=[info["x"],info["y"],0];
				this.regKeyVO(keyid,this,this.onDotClk);
				dot=this.dotCSS.create(this.pveBox,[info["x"],info["y"],0],keyid,{codeName:info["codeName"],name:info["name"],ExpLevel:info["ExpLevel"],LevelFile:info["LevelFile"],
					star:star,gold:goldLost,oil:oilLost},pveUnlock);
				dot.setId("pve"+k);
			//	dot.setDisplay(0);
				this.dots.push(dot);
				this.dotKeys[""+keyid]=dot;
				if(pveUnlock)
				{
					this.lastUnlockItem=dot;
				}
			}
			this.starBox.getItemById("Text-Cur")._setText(gainStar+"/"+totalStar);
			var newH=lastDot[1]+100;
			this.pveBox.setH(newH);
			this.navBox.setMinNavPos([0,-(newH-this.appEnv.scrSize[1]),0]);
			this.navBox.setMaxNavPos([0,0,0]);
			this.page.setCookie("Save","Path",toJSON(dotPath),0);
		//	this.delayShowDot();
			this.onShowDone();
			this.timer=null;
		},this);
	//	this.dlgTitle._setText(textLib["Battle"]);
		//if(preState)
		//{
		//}
	};

	__Page.dlgMap.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(nextState)
		{
		}
		else
		{
		}
		this.pveBox.setDisplay(0);
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	__Page.dlgMap.delayShowDot=function()
	{
		DBOut("delayShowDot: "+this.curIdx);
		this.timer=null;
		if(!(this.curIdx>=0))
			this.curIdx=0;
		if(this.curIdx==this.dots.length){
			this.onShowDone();
			return;
		}
		this.dots[this.curIdx].fadeIn(20,0);
		this.curIdx++;
		this.timer=setFrameout(10,this.delayShowDot,this);
	};

	__Page.dlgMap.onShowDone=function()
	{
		this.resBox.fadeIn(10,0);
		if(this.lastUnlockItem)
		{
			this.lastUnlockItem.onSelect();
		}
		if(this.lastUnlock)
		{
			var scrH=this.appEnv.scrSize[1];
			var pos=[];
			this.pveBox.getPos(pos);
			var x=pos[0];
			var y=this.lastUnlock[1];
			var h=this.pveBox.getH();
			var minY=scrH-h;
			var maxY=0;
			var dt=150;
			if(y>scrH)
			{
				y=scrH-y-dt;
				if(y<minY)
					y=minY;
				this.pveBox.setPos([x,y,0]);
			}
		}
	};

	__Page.dlgMap.checkMapUnlock=function(codeName)
	{
		if(!codeName)//一关未打，infoVO为空，则开放第一关
			return -1;
	//	DBOut("==============");
		for(var i =0; i<this.infoVO.length; i++)
		{
	//		DBOut(toJSON(this.infoVO[i]));
			if(codeName==this.infoVO[i].stageId && this.infoVO[i].star>0)
				return 1;
		}
		return 0;
	};

	__Page.dlgMap.doSearch=function(ok)
	{
		if(!ok)return;
		var city=aisGame.curCity;
		this.appEnv.closeDlg(null,null,0);
		setFrameout(1,function(){this.appEnv.prePmtLayer=this.appEnv.layer;},this);
		var comVO={userId:-1};
		if(!this.page.vwHomeStage.checkCost(
			{storage:[{store:"Gold",type:"ResGold",num:city.attackCost}]},
			1,
			this.mainState.SearchOpponents,
			this.mainState,[comVO]))
		{
			return;
		}
		this.mainState.SearchOpponents(comVO);

//				if(city.goldStorage.getUsedCap()<city.attackCost)
//				{
//					this.appEnv.stateLogs.showLog(this.appEnv.textLib.NotEnoughGold);
//					return;
//				}
//				window.aisGame.king.execFakeCmd(city,"Search_opponents",{userId:-1,callBack:this.mainState.go2Battle,callObj:this.mainState},city);
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgMap.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(1==msg && 1==way && -6==key){
				DBOut("clear path-----");
				this.page.setCookie("Save","Path","",0);
//				var cookie=this.page.getCookie("Save","Path");
//				Dialogs.saveToFile("window.mapPath="+cookie,"MapPath.js");
			}
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};

		//关卡被点击
		__Page.dlgMap.onDotClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onDotClk");
				var dot=this.dotKeys[key];
				//DBOut("dot.info:"+toJSON(dot.info));
				dot.onSelect();
				return 0;
			}
			return 0;
		};

		//清除按钮点击
		__Page.dlgMap.onClearClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onClearClk");
				if(this.curDot)
				{
					this.curDot.clearSelect();
				}
			}
		};

		//挑战
		__Page.dlgMap.onChallengeClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onChallengeClk");
				var info=this.pveKeys[key];
				var city=aisGame.curCity;
				window.aisGame.king.execFakeCmd(city,"PVE_InitUnit",{stageId:info.codeName,callBack:function(data,error){
					this.go2Pve(data,error,info);
				},callObj:this.mainState},city);
				this.appEnv.closeDlg(null,null,0);
			}
		};

		//搜索
		__Page.dlgMap.onSearchClk=function(msg,key,way,extra)
		{
			this.lbxResponse=0;
			if(1==way && 1==msg)
			{
				DBOut("onSearchClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				var city=aisGame.curCity;
				if(window.USERID<20000)
				{
					appEnv.stateLogs.showLog(textLib["CanNotSearch"]);
					return;
				}
				if(city.getBuff("Shield"))
				{
					this.appEnv.showPmtDlg(this.page.pmtChoose,0,
						{
							title:textLib["InShield"],info:textLib["InShieldDesc"],
							pmtFunc:this.doSearch,pmtObj:this
						}
					);
				}
				else
					this.doSearch(1);
			}
		};
		//打开pve模式
		__Page.dlgMap.onOpenPveClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.navBox.setNavItem(this.pveBox);
				this.pveHud.fadeOut(20,0);
				this.oltHud.fadeOut(20,0);
				setFrameout(20,function(){
					//this.btnPveClose.fadeIn(0,0);
					this.btnPveClose.setDisplay(1);
				},this);
				this.showPveStage();

			}
		};
		//关闭pve模式
		__Page.dlgMap.onClosePveClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				this.setDotsDisplay(0);
				this.navBox.setNavItem(null);
				this.pveHud.fadeIn(20,0);
				this.oltHud.fadeIn(20,0);
				//this.btnPveClose.fadeOut(10,0);
				this.btnPveClose.setDisplay(0);
			}
		};
		//进入守城模式
		__Page.dlgMap.onOltClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var city=aisGame.curCity;
				var txt=window.aisEnv.defLib.globals.MAX_PVE2_STAGE_ID;
				if(!txt)txt=50;
				var cur=city.pve2VO.stageId;
				if(cur<txt && city.pve2VO.result==1)cur++;

				if(this.page.stateHome && this.page.stateHome.go2Onslaught)
				this.page.stateHome.go2Onslaught(cur,txt);
			}
		};

	}

	//--------------------------------------------------------------------------
	//触摸消息函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgMap.onMouse=function(msg,key,x,y,penSize,way)
		{
			//msg总是0，penSize总是1，way总是1
			//key：移动时为1、摁下为0、抬起为2变1
			if(1==way && x>=0 && x<=Screen.w && y>=0 && y<=Screen.h)
			{
				/**
				DBOut("*********** "+x+", "+y);
				DBOut(x>=this.rangeMinX);
				DBOut(x<=this.rangeMaxX);
				DBOut(y>=this.rangeMinY);
				DBOut(y<=this.rangeMaxY);
				/**/
			}
			if(1==way && x>=this.rangeMinX && x<=this.rangeMaxX && y>=this.rangeMinY && y<=this.rangeMaxY)
			{
			//	DBOut("msg="+msg+",key="+key+",penSize="+penSize+",way="+way);
				var pos=[];
				if(0==key){
					this.beginX=x;
					this.beginY=y;
				//	this.icon_map.getPos(pos);
					this.beginPos=pos;
					this.startMove=1;

				//	this.aimIndex=this.checkDotPos(x,y);
				//	DBOut("begin");
				}else if(2==key || (1==key && (this.rangeMinX==x || this.rangeMaxX==x || this.rangeMinY==y || this.rangeMaxY==y))){
					this.startMove=0;
					var offX=x-this.beginX;
					if(Math.abs(offX)>50)return;
					DBOut("aimIndex="+this.aimIndex);
					if(this.aimIndex>=0 && this.aimIndex==this.checkDotPos(x,y)){
						var pos=[];
					//	var hud=this.dotHud[this.aimIndex];
					//	hud.getPos(pos);
					//	if(hud.unlock){
					//		this.onDotEvent(hud);
					//	}else{
					//	//	this.showLocked();
					//		DBOut("dot is not unlocked");
					//	}
					}
				//	this.aimIndex=-1;
				//	DBOut("end");
				}else if(1==key){
					if(this.startMove){
					//	DBOut("move");
						pos=this.beginPos;
						var offX=x-this.beginX;
						var offY=y-this.beginY;
						var newX=pos[0]+offX;
						if(newX<this.minX)newX=this.minX;
						if(newX>this.maxX)newX=this.maxX;
						var newY=pos[1]+offY;
						if(newY<this.minY)newY=this.minY;
						if(newY>this.maxY)newY=this.maxY;
					//	this.icon_map.setPos([newX,newY,0]);
					}
				}
				return 1;
			}
			return 0;
		};
	}
}
