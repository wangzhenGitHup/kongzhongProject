if(!__Page.dlgBattleOver)
{
	__Page.dlgBattleOver={
		dlgPage:__Page,
		page:null,
		name:"dlgBattleOver",
		viewId:"dlgBattleOver",
		slotVsn:0,
		rmCap:0,
	};
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgBattleOver;
	__Page.dlgBattleOver.init=function(appEnv)
	{
		this.name="dlgBattleOver";
		this.viewId="dlgBattleOver";

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		page.keyStateUtil.call(this);

		var i,pic,dt,keyid=0;
		var boxw=this.dlgW=appEnv.scrSize[0];
		var boxh=this.dlgH=appEnv.scrSize[1];
		this.dlgBox=appEnv.dlgBox;
		this.dlgFrame=this.dlgBox.appendNewChild({type:"icon",pos:[0,0,0],w:boxw,h:boxh,ui_event:1,});
		pic=imgLib.getImg("pic_shadow_left");
		this.dlgBox.appendNewChild({type:"icon",pos:[0,boxh,0],anchor_h:0,anchor_v:2,css:pic,color_a:200});
		pic=imgLib.getImg("pic_shadow_right");
		this.dlgBox.appendNewChild({type:"icon",pos:[boxw,boxh,0],anchor_h:2,anchor_v:2,css:pic,color_a:200});
		pic=imgLib.getImg("pic_backlight");
		var lightX=boxw/2, lightY=190, lightW=500, lightH=500;
		this.bgLight=this.dlgBox.appendNewChild({type:"icon",pos:[lightX,lightY,0],w:lightW,h:lightH,css:pic,anchor_h:1,anchor_v:1});
		pic=imgLib.getImg("pic_battle_star_bg");
		this.bgStar=this.dlgBox.appendNewChild({type:"icon",pos:[lightX,lightY,0],css:pic,anchor_h:1,anchor_v:1});
		pic=imgLib.getImg("pic_battle_star_dark");
		dt=5;
		var starX=lightX, starY=pic.h/2+dt, starW=pic.w, starH=pic.h;
		var starW_s=starW*0.7, starH_s=starH*0.7;
		dt=starW-10;
		var starX_l=starX-dt, starY_l=starY+38;
		var starX_r=starX+dt, starY_r=starY_l;
		this.starDark_l=this.dlgBox.appendNewChild({type:"icon",pos:[starX_l,starY_l,0],w:starW_s,h:starH_s,css:pic,anchor_h:1,anchor_v:1});
		this.starDark_m=this.dlgBox.appendNewChild({type:"icon",pos:[starX,starY,0],w:starW,h:starH,css:pic,anchor_h:1,anchor_v:1});
		this.starDark_r=this.dlgBox.appendNewChild({type:"icon",pos:[starX_r,starY_r,0],w:starW_s,h:starH_s,css:pic,anchor_h:1,anchor_v:1});
		pic=imgLib.getImg("pic_battle_star");
		this.star_l=this.dlgBox.appendNewChild({type:"icon",display:0,pos:[starX_l,starY_l,0],w:starW_s,h:starH_s,css:pic,anchor_h:1,anchor_v:1});
		this.star_m=this.dlgBox.appendNewChild({type:"icon",display:0,pos:[starX,starY,0],w:starW,h:starH,css:pic,anchor_h:1,anchor_v:1});
		this.star_r=this.dlgBox.appendNewChild({type:"icon",display:0,pos:[starX_r,starY_r,0],w:starW_s,h:starH_s,css:pic,anchor_h:1,anchor_v:1});
		var totalTxtX=lightX, totalTxtY=starY-6, totalTxtW=50, totalTxtH=30;
		this.totalTxt=this.dlgBox.appendNewChild({type:"text",css:cssLib.textFineMid.createCSS([totalTxtX,totalTxtY,0],textLib["TotalDmg"]+":",totalTxtW,totalTxtH,1,1,1,1)});
		this.rateX=totalTxtX, this.rateY=totalTxtY+24;
		pic=imgLib.getImg("pic_battle_win");
		this.resultIcon=this.dlgBox.appendNewChild({type:"icon",pos:[lightX,lightY,0],css:pic,anchor_h:1,anchor_v:1});
		var gainTxtX=lightX, gainTxtY=this.gainTxtY=lightY+72, gainTxtW=100, gainTxtH=this.gainTxtH=24;
		this.gainTxt=this.dlgBox.appendNewChild({type:"text",css:cssLib.textFineMid.createCSS([gainTxtX,gainTxtY,0],textLib["YouGain"],gainTxtW,gainTxtH,1,1,1,1),font_size:FS.XXL});
		pic=imgLib.getImg("pic_line");
		var self=this;
		this.lineCSS={
			w:boxw,h:50,
			createCSS:function(pos,num,exNum,icon,isDouble)
			{
				DBOut("icon:"+icon+", num:"+num+", exNum:"+exNum);
				var iconCSS=imgLib.getIcon(icon,64);
				var iconSize=48;
				iconCSS.w=iconCSS.h=iconSize;
				var lineW=this.w, lineH=this.h;
				var iconX=iconCSS.w/2+3;
				var txtX=-3;
				var itemY=lineH/2;
				var itemY1=itemY2=itemY;
				if(exNum){
					itemY1-=12;
					itemY2+=12;
				}
				var numTxt=""+num, numFont=FS.XXL, useScore=1;
				/**
				if(0==num && "res_chip"==icon && self.mainState && self.mainState.stage && self.mainState.stage.battleInfo)
				{
					numTxt=textLib.getTextEx("ChipReq",{num:self.mainState.stage.battleInfo.minHonor});
					numFont=18;//FS.L;
					useScore=0;
				}
				/**/
				var fix="";
				if("medal"==icon)
				{
					if(num>0)
						fix="+";
					else if(num<0)
						fix="-";
				}
				return {type:"shape",pos:pos,w:lineW,h:lineH,anchor_h:1,anchor_v:0,face_a:0,useScore:useScore,aimNum:Math.abs(num),items:[
					{type:"icon",pos:[iconX,itemY,0],css:iconCSS,anchor_h:1,anchor_v:1},
					{id:"double",type:"icon",pos:[iconX,lineH-8,0],css:imgLib.getImg("pic_double"),anchor_h:1,anchor_v:1,display:isDouble?1:0},
					{css:cssLib.textFineMid.createCSS([txtX,itemY1,0],numTxt,180,lineH,2,1,2,1,num<0?[200,0,0,255]:[255,255,255,255]),font_size:numFont,wrap:1,display:useScore?0:1},
					{id:"score",css:cssLib.textScoreMid.createCSS([txtX,itemY1,0],num,200,lineH,2,1,2,1,num<0?[200,0,0,255]:[255,255,255,255]),
						font_size:numFont,wrap:1,display:useScore?1:0,
						score:0,value_type:1,digit:1,show_add:0,grow:0.2,fake_zero:0,prefix:fix
					},
					{css:cssLib.textFineMid.createCSS([txtX,itemY2,0],(exNum>0?"+":"")+exNum,lineW,lineH,2,1,2,1,exNum<0?[255,0,0,255]:[0,255,0,255]),font_size:FS.L,display:exNum?1:0},
					{id:"mult",css:cssLib.textFineMid.createCSS([iconX+iconSize/2+6,itemY,0],"",10,10,0,1,0,1,[255,255,255,255]),font_size:FS.XXL,fade:1,fade_size:2,fade_alpha:0.5},
				]};
			}
		};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onBackHomeClk);
		pic=imgLib.getImg("btn_green_u");
		var btnW=pic.w, btnH=pic.h;
		var btnX=lightX, btnY=boxh-10-btnH/2+5;
		this.btnBackHome=this.dlgBox.appendNewChild({css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["BackHome"],btnW,btnH),button:1});

		//留言按钮
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onLevelMsgClk);
		pic=imgLib.getImg("btn_msg");
		var btnW=pic.w, btnH=pic.h;
		var btnX=lightX, btnY=boxh-10-btnH/2+5;
		var btnCSS1 =
		{
			type:"key",id:"imageBtn",pos:[this.dlgBox.getW()-btnW-btnW/4,360-btnH-btnH/4,0],key:keyid,css:pic,anchor_h:0,anchor_v:1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{css:pic},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{css:pic,w:btnW,h:btnH},
			state_gray:{css:pic,color_a:128},
			items:[
				{type:"icon",pos:[0,0,0],css:pic,w:btnW,h:btnH,anchor_h:0,anchor_v:1,display:1},
			],
		}
		this.levelMsgBtn=this.dlgBox.appendNewChild(btnCSS1);
		this.levelMsgBtn.setDisplay(0);


		//分享按钮
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onShareClk);
		pic=imgLib.getImg("btn_share");
		var btnW=pic.w, btnH=pic.h;
		var btnX=lightX, btnY=boxh-10-btnH/2+5;
		var btnCSS1 =
		{
			type:"key",id:"imageBtn",pos:[this.dlgBox.getW()-btnW-btnW/4,340,0],key:keyid,css:pic,anchor_h:0,anchor_v:1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{css:pic},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{css:pic,w:btnW,h:btnH},
			state_gray:{css:pic,color_a:63},
			items:[
				{type:"icon",pos:[0,0,0],css:pic,w:btnW,h:btnH,anchor_h:0,anchor_v:1,display:1},
			],
		}
		this.shareBtn=this.dlgBox.appendNewChild(btnCSS1);
		this.shareBtn.setDisplay(0);

		//代币掉落显示
		var rewardFieldX=this.dlgBox.getW()-btnW-btnW/4-206;
		var rewardFieldY=365-btnH-btnH/4;
		var rewardFieldW=this.rewardFieldW=136;
		var rewardFieldH=this.rewardFieldH=72;
		this.rewardField=this.dlgBox.appendNewChild(
			{
				type:"icon",id:"rewardField",pos:[rewardFieldX,rewardFieldY,0],w:rewardFieldW,h:rewardFieldH,display:0,
				items:[
					{type:"text",css:cssLib.textFineMid.createCSS([rewardFieldW>>1,rewardFieldH>>1,0],textLib["BeyondRewardLimit"],rewardFieldW,rewardFieldH,1,1,0,1,[255,255,255,255],1)},
					cssLib.iconText.createCSS([rewardFieldW>>1,(rewardFieldH>>1)+25,0],imgLib.getIcon("icon_itm_token1_32"),1+"",2,[255,255,255,255],24,0)
				]
			}
		);
		this.rewardLimitTxt=this.rewardField.firstChild();
		this.rewardIconText=this.rewardField.getItemById("iconText");
		var listW=508, listH=64;
		var listX=lightX, listY=btnY-btnH/2-10-listH/2+5+10;
		var subW=50, subH=listH, subCW=subCH=46;
		this.lbxTroop=this.dlgBox.appendNewChild({type:"listbox",id:"lbx-troop",pos:[listX,listY,0],w:listW,h:listH,anchor_h:1,anchor_v:1,ui_event:1,sub_event:1,
			arrange:1,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:subW,item_h:subH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,
		});
		this.troopIcon={
			createCSS:function(pos,num,lv,icon,clan)
			{
				var iconSize=128;
				if(clan)iconSize=64;
				var iconCSS=imgLib.getIcon(icon,iconSize);
				var tier="";
				if(icon && icon.indexOf("par")>-1)
				{
					var list=icon.split("_");
					list[2]=list[2].replace("0","");
					tier=imgLib.getIcon("bg_tier"+list[2]+"_32");
					iconCSS=imgLib.getIcon(list[0]+"_"+list[1]+"_32");
				}
				if(iconCSS)
					iconCSS.w=iconCSS.h=subCW;
				var scale=2/3;
				var lvPic=imgLib.getImg("pic_lv1");
				var lvW=lvPic.w*scale, lvH=lvPic.h*scale;
				return {type:"div3x3",pos:pos,w:subCW,h:subH,css:imgLib["box_unit_white"],items:[//face_r:255,face_g:255,face_b:255,face_a:120,
					{type:"tier",type:"icon",pos:[0,0,0],css:tier,w:subCW,h:subH},
					{type:"icon",pos:[0,subH-subCH,0],css:iconCSS},
					{type:"text",css:cssLib.textFineSmall.createCSS([0,0,0],num?"x"+num:"",subCW,subH-subCH,0,0,0,0),display:clan?0:1},
				//	{type:"text",css:cssLib.textFineSmall.createCSS([0,subCW,0],lv?"Lv"+lv:"",subCW,subH-subCH,0,0,1,0)},
					{type:"icon",id:"LvIcon",pos:[lvW/2,subH-lvH/2,0],w:lvW,h:lvH,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_lv"+(lv)),display:clan?0:1},
				]}
			}
		};
		var lostTxtX=listX-listW/2-4, lostTxtY=listY+listH/2, lostTxtW=gainTxtW, lostTxtH=gainTxtH;
		this.lostTxt=this.dlgBox.appendNewChild({type:"text",css:cssLib.textFineMid.createCSS([lostTxtX,lostTxtY,0],textLib["ArmyConsume"],lostTxtW,lostTxtH,2,2,2,2)});

		pic=imgLib.getImg("pic_loot");
		var rdmSize=64;
		var rdmW=this.rdmW=62;//pic.w;
		var rdmH=this.rdmH=76;//pic.h;
		var rdmGap=this.rdmGap=12;
		var lootNum=this.lootNum=10;
		var lootH=rdmW, lootW=rdmW*lootNum+rdmGap*(lootNum-1), lootX=(boxw-lootW)/2, lootY=listY-listH/2-14-16;
		this.lootH=lootH, this.lootW=lootW, this.lootX=lootX, this.lootY=lootY;
		this.cpX=this.lootW/2;
		this.cpY=-100;//-this.rdmH/2;
		var againX=this.againX=lootX+lootW+56, againY=this.againY=lootY-lootH/2, againW=this.againW=120, againH=this.againH=50;

		if(this.page.vwBattleStage)
		{
			var gvo=page.getCookie("GlobalInfo","info");
			//DBOut("========gvo: "+gvo);
			if(!gvo)
			{
				Dialogs.alert("get global info error!!!");
				return;
			}
			this.gvo=fromJSON(gvo);
			this.rdmTimes=0;
			var selTxtX=lightX, selTxtY=listY-listH/2-14, selTxtW=gainTxtW, selTxtH=gainTxtH;
			this.selTxt=this.dlgBox.appendNewChild({type:"text",css:cssLib.textFineMid.createCSS([selTxtX,selTxtY,0],textLib.getTextEx("SelCard",{num:this.gvo.price[this.rdmTimes]}),
				selTxtW,selTxtH,1,1,1,1)});
			this.selTxt.setFlash(2,0.3);

			this.TrainingCost=this.page.vwBattleStage.TrainingCost;
			var repairConsume=this.repairConsume=0;//this.page.vwBattleStage.recoverUnitGem;
			var bad=repairConsume>this.gvo.gemNum?1:0;
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onRepairClk);
			var repairW=160, repairH=68, repairX=listX+listW/2+repairW/2+10, repairY=listY;
			var repairDisp = (repairConsume && !this.page.stateBattle.sameClanFlag)?1:0;
			this.btnRepair=this.dlgBox.appendNewChild({css:cssLib.btnResGo.createCSS([repairX,repairY,0],160,"gem",repairConsume,bad,keyid,0,repairH),display:repairDisp});
			var scale=this.btnRepair.addAdTMFirst("scale");
			scale.startAni(3,[0.8,0.8,1],0);
			this.btnRepair.bad=bad;
			this.repairDesc=this.btnRepair.appendNewChild({css:cssLib.textFineSmall.createCSS([-repairW/2,-repairH/2,0],textLib["OneClickRepair"],100,20,0,1,0,1),font_size:FS.L});
			this.picRepair=this.dlgBox.appendNewChild({type:"icon",pos:[repairX,repairY,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_repaired"),display:0});
			//如果不上一键恢复兵力，就把this.btnRepair和this.picRepair设为display:0
		}
	};

	__Page.dlgBattleOver.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		this.mainState=vo;
	//	this.stage=vo.stage;

		var layer=appEnv.dlgLayer;
		var time=60;
		appEnv.showPlayTimeCheck(0);
		this.checkTimer=layer.setTimeout(1000*time,function(){
			this.checkTimer=null;
			appEnv.showPlayTimeCheck(1);
		},this);

		appEnv.addRotate_z(this.bgLight,0.005);
		page.stateLogs.clearLogs();

		this.resHud={};
		var i,army=[],units=[],icon;
		var rew=[{type:"Res_Gold",num:9},{type:"Res_Oil",num:9},{type:"medal",num:"+"+9}];
		var exRew={"Res_Gold":0,"Res_Oil":0};
		var army1=[{codename:"UntMarine",num:9,level:3,type:"unit"},{codename:"UntSniper",num:9,level:3,type:"unit"},{codename:"UntHacker",num:9,level:3,type:"unit"}];
		var honor=0,star=0,rate=0,mainBaseDead=0,dailyRewardItemCount=0;
		var rewardItem;//掉落代币codename
		//当天可掠夺代币上限
		var totalRewardCount=0;
		if(appEnv.curState.name=="BattleState")
			totalRewardCount=window.aisEnv.defLib.globals.TOWNHALL_DAILY_REWARD_COUNT;
		//DBOut("vo="+vo);
		if(vo)
		{
			rew=vo.remainRes();
			if(vo.stage && vo.stage.advMC15Res)
			{
				var exNum=vo.stage.advMC15Res;
				for(i=0; i<exNum.length; i++)
				{
					exRew[exNum[i].type]=Math.floor(exNum[i].num);
				}
			}
		//	DBOut("rew="+toJSON(rew));
		}
		if(!rew)
		{
			rew=[];
		}
		if(vo && vo.stage)
		{
			if(vo.stage.getHonor){
				honor=vo.stage.getHonor();
			//	DBOut("honor="+honor);
			}
			army1=vo.stage.cmdUnits;
		//	DBOut("cmdUnits="+toJSON(army1));
			for(i in army1)
			{
				if("unit"==army1[i].type){
					icon="chr_"+i;
				}else if("spell"==army1[i].type){
					icon="spell_"+i;
				}else if("clan"==army1[i].type){
					icon="badge"+page.getCookie("Runtime","ClanFlag");
				}else if("mech"==army1[i].type){
					icon=army1[i].icon;
					army1[i].level=-1;
				}
				army.push({codename:i,num:army1[i].num,level:army1[i].level,icon:icon,clan:("clan"==army1[i].type)?1:0});
			}
		//	DBOut("army="+toJSON(army));
			star=vo.stage.star;
			mainBaseDead=vo.stage.mainBaseDead;
			rewardItem=vo.stage.battleInfo.rewardItem;
			dailyRewardItemCount=vo.stage.battleInfo.dailyRewardItemCount;
			DBOut("mainBaseDead"+mainBaseDead);
			DBOut("rewardItem"+rewardItem);
			DBOut("dailyRewardItemCount"+dailyRewardItemCount);
		//	DBOut("star="+star);
			rate=Math.floor(vo.stage.deadRate);
		//	DBOut("rate="+rate);
		}
		if(this.page.vwBattleStage)
		{
			DBOut(this.page.vwBattleStage.clanIntegral+" ------ "+(star && !this.page.stateBattle.sameClanFlag && this.gvo && this.gvo.isFormal));
			if(this.page.vwBattleStage.battleInfo.isClanCup)
				rew.push({type:"res_clanpoint",num:(star && !this.page.stateBattle.sameClanFlag && this.gvo && this.gvo.isFormal)?this.page.vwBattleStage.clanIntegral:0});
			/**
			if(this.page.stateBattle.loots)
				DBOut("chip: "+this.page.stateBattle.loots[1]);
			if(this.page.stateBattle.sameClanFlag)
			{
				rew.push({type:"res_chip",num:0});
			}
			else if(star && this.page.stateBattle.loots && this.page.stateBattle.loots[1] && this.page.stateBattle.loots[1][star-1])
			{
				var tokDouble=this.page.stateBattle.doublePower;
				DBOut("tokDouble="+tokDouble);
				var tokNum=this.page.stateBattle.loots[1][star-1].num;
				if(tokDouble>1)tokNum=tokNum/2;
				rew.push({type:"res_chip",num:tokNum,isDouble:tokDouble>1?1:0});
			}
			else
				rew.push({type:"res_chip",num:0});
			/**/
			rew.push({type:"medal",num:honor});//honor>0?"+"+honor:""+honor
		}
//		if(honor)
//		{
//			rew.push({type:"medal",num:honor});//honor>0?"+"+honor:""+honor
//		}
		if(!army)
		{
			army=[];
		}
		var x=this.dlgW/2;
		var y=this.gainTxtY+this.gainTxtH/2+5;
		var x1,y1,hud;
		this.scoreHuds=[];
		for(var i=0; i<rew.length; i++)
		{
			if("Res_Gold"==rew[i].type){
				icon="res_gold";
			}else if("Res_Oil"==rew[i].type){
				icon="res_oil";
			}else if("Res_Cube"==rew[i].type){
				icon="res_cube";
			}else{
				icon=rew[i].type;
			}
			if(this.page.vwBattleStage)// && vo.stage.star
			{
				if(this.page.vwBattleStage.battleInfo.isClanCup)
				{
					if(0==i || 3==i){
						x1=x-240;
					}else if(1==i || 4==i){
						x1=x;
					}else{
						x1=x+240;
					}
					if(0==i || 1==i || 2==i){
						y1=y;
					}else{
						y1=y+5+this.lineCSS.h;
					}
				}
				else
				{
					if(0==i || 2==i){
						x1=x-120;
					}else{
						x1=x+120;
					}
					if(0==i || 1==i){
						y1=y;
					}else{
						y1=y+5+this.lineCSS.h;
					}
				}
			}
			else
			{
				x1=x;
				y1=y+(5+this.lineCSS.h)*i;
			}
			if(0==i || 2==i)
				this.dlgBox.appendNewChild({type:"icon",pos:[x,y1+this.lineCSS.h,0],css:imgLib.getImg("pic_line"),anchor_h:1,anchor_v:1});
			hud=this.dlgBox.appendNewChild({css:this.lineCSS.createCSS([x1,y1,0],rew[i].num,exRew[rew[i].type],icon,rew[i].isDouble)});
			this.scoreHuds.push(hud);
//			if(hud.useScore)
//				hud.getItemById("score").setScore(hud.aimNum);
			if("Res_Gold"==rew[i].type)
				this.resHud["Gold"]=hud;
			else if("Res_Oil"==rew[i].type)
				this.resHud["Elixir"]=hud;
			else if("Res_Cube"==rew[i].type)
				this.resHud["Cube"]=hud;
		}
		for(var i=0; i<10; i++)
		{
		//	DBOut("--- army["+i+"]"+toJSON(army[i]));
			units.push(this.troopIcon.createCSS([0,0,0],army[i]?army[i].num:"",army[i]?army[i].level:"",army[i]?army[i].icon:"",army[i]?army[i].clan:0));
		}
		this.lbxTroop.addItems(units);
		this.star_m.setDisplay(star>0?1:0);
		this.star_l.setDisplay(star>1?1:0);
		this.star_r.setDisplay(star>2?1:0);
		this.rateTxt=this.dlgBox.appendNewChild({type:"text",css:cssLib.textFineMid.createCSS([this.rateX,this.rateY,0],rate+"%",50,30,1,1,1,1,[0,200,0,255])});
		var pic=imgLib.getImg(star>0?"pic_battle_win":"pic_battle_lost");
		this.resultIcon.setTexUV([pic.tex_u,pic.tex_v,pic.tex_w,pic.tex_h]);
	//	audio.playMusic({src:this.page.genPageURL("sfx/"+(star>0?"winwinwin":"battle_lost")+".mp3"),loop:0});
		//掉落代币显示
		if(mainBaseDead)//主基地被摧毁
		{
			if(dailyRewardItemCount>=totalRewardCount)//达到上限
			{
				this.rewardLimitTxt.setDisplay(1);
				this.rewardIconText.setDisplay(0);
				this.rewardField.setDisplay(1);
			}else//没达到上限
			{
				if(rewardItem)//有掉落
				{
					this.rewardLimitTxt.setDisplay(0);
					// this.rewardIconText.setDisplay(1);
					var pic=imgLib.getIcon("icon_"+rewardItem+"_32");
					pic.w=48;
					pic.h=48;
					if(this.rewardIconText)
					{
						this.rewardField.removeChild(this.rewardIconText);
						this.rewardIconText=this.rewardField.appendNewChild(
							cssLib.iconText.createCSS([this.rewardFieldW>>1,this.rewardFieldH>>1,0],pic,1+"",2,[255,255,255,255],24,0)
						);
					}
					
					this.rewardField.setDisplay(1);
				}else
					this.rewardField.setDisplay(0);
			}
		}
		if(this.page.audioObject && this.page.audioObject._init)
		{
			this.page.audioObject.playMp3(star>0?"winwinwin":"battle_lost",0);
		}
		if(this.page.vwBattleStage && vo)// && vo.stage.star
		{
			var stage=vo.stage;
			this.star=0;
			if(star > 0)//赢了才能分享和留言
			{
				this.star=star;
				this.shareBtn.setDisplay(1);
				this.levelMsgBtn.setDisplay(1);
			}
			if(stage.battleInfo.userBCCFlag || stage.battleInfo.oppBCCFlag)
			{
				var pic=imgLib.getImg("pic_cube_bg");
				var w=pic.w, h=pic.h, x=64+w/2+10, y=y1+this.lineCSS.h-pic.h+16;
				var txtY=33, txtH=20, txtX=40-15, txtX1=74, txtY1=txtY+txtH+10, txtY2=txtY1+txtH+3, txtY3=txtY2+txtH+8;
				var atk=stage.battleInfo.userBCCFlag?stage.battleInfo.userBCCRate*100:0;
				var def=stage.battleInfo.oppBCCFlag?stage.battleInfo.oppBCCRate*100:0;
				def*=-1;
				var total=atk+def;
				DBOut("atk="+atk+", def="+def+", total="+total);
				var getStr=function(num)
				{
					var str="", sign, abs;
					DBOut("num="+num);
					num=Math.floor(num);
					DBOut("floor num="+num);
					abs=Math.abs(num);
					sign=(abs==num)?1:-1;
					if(-1==sign)
						str="-";
					else
						str="+";
					if(abs<10)
						str+="";
					str+=abs;
					str+="%";
					return str;
				}
				var cubePic=this.cubePic=this.dlgBox.appendNewChild({id:"cube-bg",type:"icon",pos:[x,y-55,0],css:pic,fade:1,fade_alpha:1,fade_size:1,fade_pos:[-pic.w,y-55,0],display:0,
					items:[
					//	{type:"icon",pos:[w/2,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_backlight"),w:130,h:130},
						{type:"icon",pos:[w/2,0,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon("cubecard2",64),w:64,h:64},
						{css:cssLib.textFineSmall.createCSS([w/2,txtY,0],textLib["CubeCardAddition"],20,txtH,1,0,1,0),font_size:FS.L},
						{css:cssLib.textFineSmall.createCSS([txtX,txtY1,0],textLib["SAttacker"],20,txtH,0,0,0,0),font_size:FS.L},
						{css:cssLib.textFineSmall.createCSS([txtX,txtY2,0],textLib["SDefender"],20,txtH,0,0,0,0),font_size:FS.L},
						{css:cssLib.textFineSmall.createCSS([txtX,txtY3,0],textLib["STotal"],20,txtH,0,0,0,0),font_size:FS.L},
						{css:cssLib.textFineSmall.createCSS([txtX1,txtY1,0],getStr(atk),20,txtH,0,0,0,0),font_size:FS.L},//,atk<0?[255,0,0,255]:[0,255,0,255]
						{css:cssLib.textFineSmall.createCSS([txtX1,txtY2,0],getStr(def),20,txtH,0,0,0,0),font_size:FS.L},//,def<0?[255,0,0,255]:[0,255,0,255]
						{css:cssLib.textFineSmall.createCSS([txtX1,txtY3,0],getStr(total),20,txtH,0,0,0,0,total<0?[255,0,0,255]:[0,255,0,255]),font_size:FS.L},
					]
				});
			}
			if(stage.battleInfo.userMC15Flag || stage.battleInfo.oppMC15Flag)
			{
				var pic=imgLib.getImg("pic_extra_bg");
				var w=pic.w, h=pic.h, x=64, y=y1+this.lineCSS.h-pic.h+3;
				var txtY=20, txtH=20, txtX=40-7, txtX1=74+7, txtY1=txtY+txtH+10, txtY2=txtY1+txtH+3, txtY3=txtY2+txtH+8;
				var atk=stage.battleInfo.userMC15Flag?stage.battleInfo.userMC15Rate*100:0;
				var def=stage.battleInfo.oppMC15Flag?stage.battleInfo.oppMC15Rate*100:0;
				def*=-1;
			//	atk=20, def=-6;
				var total=atk+def;
			//	DBOut("atk="+atk+", def="+def+", total="+total);
				var getStr=function(num)
				{
					var str="", sign, abs;
				//	DBOut("num="+num);
					num=Math.floor(num);
				//	DBOut("floor num="+num);
					abs=Math.abs(num);
					sign=(abs==num)?1:-1;
					if(-1==sign)
						str="-";
					else
						str="+";
					if(abs<10)
						str+="";
					str+=abs;
					str+="%";
					return str;
				}
				var exPic=this.exPic=this.dlgBox.appendNewChild({id:"ex-bg",type:"icon",pos:[x,y-55,0],css:pic,fade:1,fade_alpha:1,fade_size:1,fade_pos:[-pic.w,y-55,0],display:0,
					items:[
					//	{type:"icon",pos:[w/2,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_backlight"),w:130,h:130},
						{type:"icon",pos:[w/2,0,0],anchor_h:1,anchor_v:1,css:imgLib.getIcon("goldcard2",64),w:64,h:64},
						{css:cssLib.textFineSmall.createCSS([w/2,txtY,0],textLib["GoldCardAddition"],20,txtH,1,0,1,0),font_size:FS.L},
						{css:cssLib.textFineSmall.createCSS([txtX,txtY1,0],textLib["SAttacker"],20,txtH,0,0,0,0),font_size:FS.L},
						{css:cssLib.textFineSmall.createCSS([txtX,txtY2,0],textLib["SDefender"],20,txtH,0,0,0,0),font_size:FS.L},
						{css:cssLib.textFineSmall.createCSS([txtX,txtY3,0],textLib["STotal"],20,txtH,0,0,0,0),font_size:FS.L},
						{css:cssLib.textFineSmall.createCSS([txtX1,txtY1,0],getStr(atk),20,txtH,0,0,0,0),font_size:FS.L},//,atk<0?[255,0,0,255]:[0,255,0,255]
						{css:cssLib.textFineSmall.createCSS([txtX1,txtY2,0],getStr(def),20,txtH,0,0,0,0),font_size:FS.L},//,def<0?[255,0,0,255]:[0,255,0,255]
						{css:cssLib.textFineSmall.createCSS([txtX1,txtY3,0],getStr(total),20,txtH,0,0,0,0,total<0?[255,0,0,255]:[0,255,0,255]),font_size:FS.L},
					]
				});
//				exPic.fadeIn(10,0);
//				exPic.onFadeDone=function(show)
//				{
//					if(show)
//					{
//						var pos=[];
//						exPic.getPos(pos);
//						var mAni=exPic.addAdTMFirst("move");
//						mAni.startAni(1,[-50,0,0],50);
//					}
//				}
			}

			this.curPrice=0;
			this.lootBox=this.dlgBox.appendNewChild({type:"shape",pos:[this.lootX,this.lootY,0],w:this.lootW,h:this.lootH,anchor_h:0,anchor_v:2,display:0,ui_event:1,
				face_r:200,face_g:200,face_b:200,face_a:0});
			var keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onAgainClk);
			this.btnAgain=this.dlgBox.appendNewChild({css:cssLib.btnResGo.createCSS([this.againX,this.againY,0],146,"gem",0,0,keyid,0,76),display:0,
				fade:1,fade_alpha:0,fade_size:2,fade_pos:[this.againX,this.againY,0]});
			var scale=this.btnAgain.addAdTMFirst("scale");
			scale.startAni(3,[0.7,0.7,1],0);
			this.btnAgain.appendNewChild({css:cssLib.textFineMid.createCSS([0,-43,0],textLib["Again"],10,10,1,1,1,1),font_size:FS.FM+6});
			this.lootBox.setDisplay(1);
			this.addLoots(vo);
		}

		this.showAni();

		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgBattleOver.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(this.aniTimer)
		{
			clearTimeout(this.aniTimer);
			this.aniTimer=null;
		}
		if(this.longTimer)
		{
			clearTimeout(this.longTimer);
			this.longTimer=null;
		}
		if(nextState)
		{
		}
		else
		{
		}
		appEnv.clearDlgAniCall();
	};

	//添加抽奖控件
	__Page.dlgBattleOver.addLoots=function(vo)
	{
		DBOut("addLoots");
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

//		this.page.stateBattle.loots=[[{type:"Gold",num:10},{type:"Elixir",num:10},{type:"Gem",num:10},{type:"tok1",num:10},
//			{type:"par_body01_01",num:10},{type:"plu_L1_01",num:10},{type:"Oil",num:10},{type:"Gold",num:10}]];

		var loots=this.page.stateBattle.loots;
		DBOut("loots: "+toJSON(loots));
		if(!loots || !loots.length)
		{
			DBOut("no loot!!!");
			var txt=textLib["HowToLottery"];
			if(this.gvo)
			{
			//	DBOut("gvo:"+toJSON(this.gvo));
				if(!this.gvo.mfLv)
					txt=textLib["LootNeedMechFactory"];
				else if(this.gvo.medal<this.gvo.medalReq)
					txt=textLib.getTextEx("LootNeedMedal",{level:this.gvo.thLv,medal:this.gvo.medalReq});
			}
			this.lootBox.appendNewChild({id:"loot-box",css:cssLib.textFineMid.createCSS([0,0,0],txt,this.lootW,this.lootH,0,2,1,1),flash:2});
			return;
		}
		this.loots=loots[0];
		this.lootIdx=this.page.stateBattle.lootIndexs;
	//	DBOut("==== this.lootIdx:"+this.lootIdx);
		if(!this.loots || !this.loots.length)
		{
			DBOut("no loot!!! add fake loot");
		//	return;
			this.loots=loots[loots.length-1];
		}
		this.lootBtns=[];
		this.keyVO={};
		var self=this;
		var loots=this.loots;
		var vo, type, num, icon=imgLib.getIcon("icon_res_gold64_32"), hud;
		var x, y, rw=this.rdmW, rh=this.rdmH, rg=this.rdmGap, keyid=0;
		this.selFrame=this.lootBox.appendNewChild({id:"sel",type:"icon",pos:[0,0,0],w:rw+(rw-42),h:rh+(rh-50),anchor_h:1,anchor_v:1,css:imgLib.getImg("box_lottery"),display:0,//face_r:100,face_g:100,face_b:100,face_a:160,
			items:[
				{id:"double",type:"icon",pos:[0,-rh/2,0],anchor_h:1,anchor_v:2,css:imgLib.getImg("pic_double"),display:0}
			]
		});
		var lootShape, lootLisght;
		var lx=this.lootX+this.cpX, ly=this.lootY-this.rdmH/2+this.cpY;
		for(var i=0; i<loots.length; i++)
		{
			type=loots[i].type;
			num=loots[i].num;
			icon=this.getRewIcon(type);
			x=rw/2+(rw+rg)*i;
			y=-rh/2;
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onLootClk);

			lootShape=this.dlgBox.appendNewChild({type:"shape",pos:[0,0,0],w:this.dlgW,h:this.dlgH,face_r:0,face_g:0,face_b:0,face_a:220,display:0,
				fade:1,fade_alpha:0,fade_pos:[0,0,0],fade_size:1});
			lootLight=lootShape.appendNewChild({type:"icon",pos:[lx,ly,0],w:300,h:300,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_backlight"),display:0,
				fade:1,fade_alpha:0,fade_pos:[lx,ly,0],fade_size:1});

			hud=this.lootBox.appendNewChild({id:"loot-"+i,type:"key",pos:[x,y,0],w:rw,h:rh,anchor_h:1,anchor_v:1,ui_event:1,down_scale:0.9,key:keyid,offX:this.cpX-x,curFlag:0,
				//css:imgLib.getImg("box_unit_white"),//face_r:10,face_g:10,face_b:10,face_a:160,
				state_up:{w:rw,h:rh,css:imgLib.getImg("box_unit_white")},
				state_down:{w:rw,h:rh,css:imgLib.getImg("box_unit_white")},
				state_gray:{w:rw,h:rh,css:imgLib.getImg("box_unit_white")},
				items:[
				//	{id:"cover",type:"icon",pos:[0,0,0],w:rw,h:rh,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_loot"),display:0,fade:1,fade_size:1,fade_alpha:0},
				//	{id:"back",type:"icon",pos:[0,0,0],w:rw,h:rh,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_loot_back"),display:1,fade:1,fade_size:1,fade_alpha:0},
					{id:"bg",type:"icon",pos:[0,0,0],w:rw,h:rh,anchor_h:1,anchor_v:1,css:imgLib.getImg("pic_loot_back"),display:1,fade:1,fade_size:1,fade_alpha:0,items:[
						{id:"icon",type:"icon",pos:[0,0,0],w:rw,h:rw,css:icon,anchor_h:1,anchor_v:1,display:1,fade:1,fade_size:1,fade_alpha:0},
						{id:"name",css:cssLib.textFineSmall.createCSS([0,0,0],"x"+num,rw,rh,1,1,2,2),display:1,font_size:FS.L,fade:1,fade_size:1,fade_alpha:0},
					]},
				],
				setBG:function(flag)//flag  0：显示背景和内容， 1：显示牌面
				{
				//	DBOut(this.curFlag+" vs "+flag);
					if(flag==this.curFlag)
						return;
					this.curFlag=flag;
					var bg=this.getItemById("bg");
					var icon=bg.getItemById("icon");
					var name=bg.getItemById("name");
				//	DBOut(bg+" "+icon+" "+name);
					var bgPic=imgLib.getImg("pic_loot_back");
					if(flag)
					{
						bgPic=imgLib.getImg("pic_loot");
						appEnv.hudOut(icon,5);
						appEnv.hudOut(name,5);
					}
					else
					{
						bgPic=imgLib.getImg("pic_loot_back");
						appEnv.hudIn(icon,5);
						appEnv.hudIn(name,5);
					}
					bg.setTexUV([bgPic.tex_u,bgPic.tex_v,bgPic.tex_w,bgPic.tex_h]);
				},
				showSide:function(move,flag,main)//flag  0：显示背景和内容， 1：显示牌面
				{
					var hud=this;
					var bg=this.getItemById("bg");
					var icon=this.getItemById("icon");
					var name=this.getItemById("name");
					var rot=bg.rot=bg.addAdTMFirst("rotate");
					rot.owner=this;
					rot.move=move;
					rot.main=main;
					rot.setCurValue([0,0,0]);
					rot.startAni(3,[0,Math.PI/2,0],15);
					rot.onAniDone=function()
					{
					//	DBOut("rot.onAniDone, flag:"+flag);
						hud.setBG(flag);
						rot.setCurValue([0,Math.PI*3/2]);
						rot.startAni(3,[0,Math.PI*2,0],15);
						rot.onAniDone=function()
						{
							if(rot.move)
							{
								rot.move=0;
								hud.move2pos();
							}
							if(rot.main)
							{
								rot.main=0;
								hud.lightAni=hud.appendNewChild({type:"coc_sp",id:"flash",pos:[0,0,0],game:appEnv.cocGameMode,sprite:"pokerlight"});
								page.audioObject.playSound("card_flash");
							}
						};
					};
				},
				move2pos:function(flag)//flag  0：往中间移， 1：回归原位
				{
					var hud=this;
					var x=this.offX;
					if(flag)
					{
						x*=-1;
					}
					var move=this.addAdTMFirst("move");
					move.startAni(3,[x,0,0],15);//5
					move.onAniDone=function()
					{
						if(flag)
						{
							hud.setEnabled(1);
						}
						else
						{
							hud.shake2pos();
						}
					};
				},
				shake2pos:function()
				{
					appEnv.dlgLayer.setFrameout(0,function(){
						var hud=this;
						var move=this.addAdTMFirst("move");
						move.setMaxLimit(0,[20,10,0]);
						move.setMaxLimit(1,[-20,-10,0]);
						move.setCurValue([0,0,0]);
						move.startAni(4,[0,0,0],25);
						move.onAniDone=function()
						{
							hud.move2pos(1);
						};
						page.audioObject.playSound("card_shake");
					},this);
				},
				mrs:function(flag)//移动，旋转，缩放   flag: 0 - 去中间， 1 - 归位
				{
					var hud=this, time=40, pos=[];
					this.getPos(pos);
					var move=this.addAdTMFirst("move");
					var rot=this.addAdTMFirst("rotate");
					var scale=this.addAdTMFirst("scale");
					var x=this.offX, y=self.cpY, s=1.6;//1.6  1.25
					if(!flag)
					{
					//	x-=(x*0.6);//x=x-(x*0.6)=x*(1-0.6);
					//	y-=(y*0.6);
						x=x+pos[0];
						y=y+pos[1];
					}
					else if(flag)
					{
						s=1;
						x=pos[0]-x;
						y=pos[1]-y;
					}
					this.startAniEx([x,y,0],s,s,time);
					if(!flag)
					{
					//	appEnv.hudIn(this.lootShape,time);
					//	appEnv.hudIn(this.lootLight,time);
					//	appEnv.addRotate_z(this.lootLight,0.008);
						this.onAniDone=function()
						{
							hud.showSide(0,0,1);//move,flag,main
							appEnv.dlgLayer.setFrameout(60,function(){
								hud.mrs(1);
							},hud);
						};
					}
					else if(flag)
					{
					//	appEnv.hudOut(hud.lootShape,time);
					//	appEnv.hudOut(hud.lootLight,time);
						this.onAniDone=function()
						{
							appEnv.dlgLayer.setFrameout(0,function(){
								hud.getPos(pos);
								self.selFrame.setPos(pos);
								self.selFrame.setDisplay(1);
								appEnv.addLoopScale(hud,0.09,{maxX:1.02,minX:0.96,maxY:1.02,miniY:0.96});
								self.onAniComp();
							},hud)
						}
					}
				},
				onClick:function(info,main)
				{
					if(info)
						this.setInfo(info);
					if(main)
					{
						this.mrs();
					}
					else
					{
						this.showSide(0,0,main);//move,flag,main
					}
					if(main)
					{
						this.used=1;
						self.curLoot=this;
						self.updateLootInfo();
					}
				},
				setInfo:function(info)
				{
					var bg=this.getItemById("bg");
					var icon=bg.getItemById("icon");
					var name=bg.getItemById("name");
				//	DBOut(bg+" "+icon+" "+name);

					var css=self.getRewIcon(info.type);
					var num=info.num;
					icon.setTexURL(css.tex);
					name._setText("x"+num);
				}
			});
			hud.lootShape=lootShape;
			hud.lootLight=lootLight;
			this.lootBtns.push(hud);
			this.keyVO[keyid+""]=hud;
		}
	};

	__Page.dlgBattleOver.getRewIcon=function(type)
	{
		var imgLib=this.page.imgLib;
		var icon;
		if(type.indexOf("plu")>-1 || type.indexOf("par")>-1)
		{
			icon=imgLib.getIcon(type+"_32");
		}
		else if("tok1"==type)
		{
			icon=imgLib.getIcon("icon_res_chip64_32");
		}
		else if("cube"==type || "Cube"==type)
		{
			icon=imgLib.getIcon("icon_res_cube64_32");
		}
		else if("Gem"==type)
		{
			icon=imgLib.getIcon("icon_res_gem64_32");
		}
		else if("Gold"==type)
		{
			icon=imgLib.getIcon("icon_res_gold64_32");
		}
		else if("Elixir"==type || "Oil"==type)
		{
			icon=imgLib.getIcon("icon_res_oil64_32");
		}
		return icon;
	};

	__Page.dlgBattleOver.showAni=function()
	{
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var layer=appEnv.dlgLayer;
	//	this.page.audioObject.playSound("boxclick");
		var vo=this.mainState, i, hud;
		if(this.lootBtns && this.lootBtns.length)
		{
			for(i=0; i<this.lootBtns.length; i++)
			{
				hud=this.lootBtns[i];
				hud.setEnabled(0);
			}
		}
		appEnv.setDlgAniCall(function(){
			if(this.page.vwBattleStage && vo)
			{
				var stage=vo.stage;
			}
			if(this.cubePic)
			{
				var cubePic=this.cubePic;
				cubePic.fadeIn(10,0);
				cubePic.onFadeDone=function(show)
				{
					if(show)
					{
						var pos=[];
						cubePic.getPos(pos);
						var mAni=cubePic.addAdTMFirst("move");
						mAni.startAni(1,[-50,0,0],50);
					}
				}
			}
			if(this.exPic)
			{
				var exPic=this.exPic;
				exPic.fadeIn(10,0);
				exPic.onFadeDone=function(show)
				{
					if(show)
					{
						var pos=[];
						exPic.getPos(pos);
						var mAni=exPic.addAdTMFirst("move");
						mAni.startAni(1,[-50,0,0],50);
					}
				}
			}
			if(this.lootBtns && this.lootBtns.length)
			{
				layer.setFrameout(25*0.6,function(){
					for(i=0; i<this.lootBtns.length; i++)
					{
						hud=this.lootBtns[i];
						hud.showSide(1,1,0);//move,flag,main
					}
				},this)
			}
			if(this.scoreHuds && this.scoreHuds.length)
			{
				for(i=0; i<this.scoreHuds.length; i++)
				{
					hud=this.scoreHuds[i];
					if(hud.useScore)
					{
						hud.getItemById("score").setScore(hud.aimNum);
					}
				}
			}
		},this);
	};

	//检测抽奖前置条件
	__Page.dlgBattleOver.checkRequire=function()
	{
		DBOut("checkRequire");
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		if(!this.mainState.stage.star)
		{
			appEnv.stateLogs.showLog(textLib["LootNeedWin"]);
			return 0;
		}
		if(!this.loots || !this.loots.length)
		{
			appEnv.stateLogs.showLog(textLib["LotteryErr1"]);
			return 0;
		}
//		if(-1==this.page.stateBattle.canbet)//主本等级不符
//		{
//			appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["CanNotLottery"],info:textLib["CityLvNotMatch"],
//				pmtFunc:"",pmtObj:"",pmtParam:""});
//			return 0;
//		}
//		else if(-2==this.page.stateBattle.canbet)//没有机甲工厂
//		{
//			appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["CanNotLottery"],info:textLib["NeedMechFactory"],
//				pmtFunc:"",pmtObj:"",pmtParam:""});
//			return 0;
//		}
		var gem=this.gvo.price[this.rdmTimes];
		if(gem>this.gvo.gemNum)
		{
			appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["NotEnougGem"],info:textLib.getTextEx("LackGem",{num:gem-this.gvo.gemNum}),
				pmtFunc:"",pmtObj:"",pmtParam:""});
			return 0;
		}
		return 1;
	};

	//第一次抽奖完成
	__Page.dlgBattleOver.onAniComp=function()
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		if(this.rdmTimes<this.gvo.price.length)
		{
			var num=this.gvo.price[this.rdmTimes];
			var bad=num>this.gvo.gemNum?1:0;
			this.btnAgain.setResNum("gem",num,bad);
			this.btnAgain.bad=bad;
		//	this.btnAgain.setDisplay(1);
			appEnv.dlgLayer.setFrameout(15,function(){
				appEnv.hudIn(this.btnAgain,20,function(){
				//	appEnv.addZoomScale(this.btnAgain,[1.0,1.0,1.0],[1.2,1.2,1.0],0.3);
				},this);
			},this);
			this.selTxt._setText(textLib["WantAgain"]);
			this.selTxt.setDisplay(1);
		}
	};

	//多次抽奖
	__Page.dlgBattleOver.showAniNext=function()
	{
		var i, hud;
		for(i=0; i<this.lootBtns.length; i++)
		{
			hud=this.lootBtns[i];
			hud.showSide(1,1,0);//move,flag,main
		//	hud.used=0;
		}
		this.curLoot.used=0;
		this.curLoot.scaleAni.setCurValue([1,1,1]);
		this.curLoot.scaleAni.stop();
		this.selFrame.setDisplay(0);
		this.btnAgain.setDisplay(0);
		this.curMult.setDisplay(0);
	};

	//发送抽奖消息
	__Page.dlgBattleOver.sendMsg=function()
	{
		if(window.aisNTEngine)
		{
			var time=0;
			var gem=this.gvo.price[this.rdmTimes];
			DBOut("++++ gem="+gem);
			window.aisNTEngine.execFakeCmd(null,"GetBtReward",{gem:gem,callBack:this.onSvrOK,callObj:this},null,time);

			this.rdmTimes++;
			this.gvo.gemNum-=gem;

			var num=this.repairConsume;
			var bad=num>this.gvo.gemNum?1:0;
			this.btnRepair.bad=bad;
			this.btnRepair.setResNum("gem",num,bad);
		}
	};

	//抽奖服务器回调
	__Page.dlgBattleOver.onSvrOK=function(svo,err,exInfo)
	{
		DBOut("++++++++ onSvrOK:"+svo+", err:"+err+", "+exInfo);
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
	};

	//刷新牌面信息
	__Page.dlgBattleOver.updateLootInfo=function()
	{
		DBOut("updateLootInfo:"+this.rdmTimes);
		var loots=toJSON(this.loots);
		loots=fromJSON(loots);
		var times=this.rdmTimes;
		var idx=this.lootIdx[times];
		var loot=loots[idx];
		var btns=this.lootBtns;
		var btn=this.curLoot;
		btn.setInfo(loot);
		loots.splice(idx,1);
		var i=0, j=0, rdm;
//		DBOut("curLoot:"+toJSON(loot));
//		DBOut("remainLoot:"+toJSON(loots));
//		DBOut("idx:"+idx+", btn:"+btn.getId());
//		DBOut("btn num="+btns.length);
		for(i=0; i<btns.length; i++)
		{
			if(btns[i]==btn)continue;
			rdm=Math.floor(Math.random()*loots.length);
		//	DBOut("loots.length="+loots.length+", rdm="+rdm);
			btns[i].setInfo(loots[rdm]);
		//	DBOut("=== setInfo:"+toJSON(loots[rdm]));
			loots.splice(rdm,1);
		}
		var hud=this.resHud[loot.type].getItemById("mult");
		hud._setText("x"+loot.num);
		hud.setDisplay(0);
		this.curMult=hud;
		this.appEnv.dlgLayer.setFrameout(180,function(){
			hud.fadeIn(20,0);
			for(var i=0; i<this.lootBtns.length; i++)
			{
				if(!this.lootBtns[i].used)
					this.lootBtns[i].onClick(null,0);
			}
		},this);
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgBattleOver.onKey=function(msg,key,way,extra)
		{
			var ret;
			if(way)
			{
			//	DBOut("dlgBattleOver.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//fake function
		__Page.dlgBattleOver.onCloseClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
			}
		};

		//回城
		__Page.dlgBattleOver.onBackHomeClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onBackHomeClk");
				if(this.aniTimer)
				{
					clearTimeout(this.aniTimer);
					this.aniTimer=null;
				}
				if(this.longTimer)
				{
					clearTimeout(this.longTimer);
					this.longTimer=null;
				}
				this.appEnv.closeDlg(null,null,0);
				if(this.mainState)
					this.mainState.go2Home();
			}
		};

		//分享视频
		__Page.dlgBattleOver.onShareClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var textLib=this.appEnv.textLib;
				if(this.page.stateBattle.sameClanFlag)
				{
					this.appEnv.stateLogs.showLog(textLib["SameClanNoReward"]);
					return;
				}
				var nowTime = Date.now(),starTime;
				var page=this.page;
				var canShare=false;
				if(page.getCookie("M1","ShareVideoTime"))
				{
					starTime=fromJSON(page.getCookie("M1","ShareVideoTime"));
					if((nowTime - starTime)>600000)
					{
						canShare=true;
					}
				}
				else
				{
					canShare=true;
				}
				if(canShare)
				{
					this.appEnv.showPmtDlg(this.page.pmtShare,0,
						{
							title:textLib["ShareVideo"],info:"",
							ui:"share",
							pmtFunc:function(ok,info){
								if(ok)
								{
									if(page.getCookie("Runtime","CityAllianceId")!="0")
									{
										this.appEnv.stateLogs.showLog(textLib["ShareOk"]);
										this.page.setCookie(cookieDomain,"ShareWords",this.page.pmtShare.txtMsg,0);
										this.page.setCookie("M1","ShareVideoTime",toJSON(nowTime),0);
										window.aisNTEngine.execFakeCmd(null,"AtkShareBattle",{words:this.page.pmtShare.txtMsg},null,0);
									}else
										this.appEnv.stateLogs.showLog(textLib["ShareBattleError"]);
								}
							},pmtObj:this,pmtParam:"XXXXXX"
						}
					);
				}else
				{
					var cdTime = 600000 -(nowTime-starTime);
					this.appEnv.stateLogs.showLog(this.appEnv.textLib["ShareCDTime"](cdTime));
				}
			}
		};

		//留言按钮点击事件
		__Page.dlgBattleOver.onLevelMsgClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				var textLib=this.appEnv.textLib;
				if(this.page.stateBattle.sameClanFlag)
				{
					this.appEnv.stateLogs.showLog(textLib["SameClanNoReward"]);
					return;
				}
				this.appEnv.showPmtDlg(this.page.pmtShare,0,
					{
						title:textLib["EnterToInputForLoser"],info:"",
						ui:"levelMsg",
						star:this.star,
						pmtFunc:function(ok,info){
							if(ok)
							{
								this.levelMsgBtn.setEnabled(0);
								this.appEnv.stateLogs.showLog(textLib["LevelMsgOk"]);
								this.page.setCookie(cookieDomain,"LevelMsgWords",this.page.pmtShare.txtMsg,0);
								window.aisNTEngine.execFakeCmd(null,"AtkWords",{words:this.page.pmtShare.txtMsg},null,0);
							}
						},pmtObj:this,pmtParam:"XXXXXX"
					}
				);
			}
		};


		//抽奖
		__Page.dlgBattleOver.onLootClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onLootClk");
				var vo=this.keyVO[key+""];
				var btn=vo;
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(this.page.stateBattle.sameClanFlag)
				{
					appEnv.stateLogs.showLog(textLib["SameClanNoReward"]);
					return;
				}
				if(this.checkRequire())
				{
					btn.onClick(null,1);
					this.selTxt.setDisplay(0);
					this.sendMsg();
					for(var i=0; i<this.lootBtns.length; i++)
					{
						this.lootBtns[i].setEnabled(0);
					}
					/**
					appEnv.showPmtDlg(this.page.pmtChoose,0,
						{
							title:textLib["AskGemBuyBox"],info:textLib["AskGemBuyBoxDesc"],
							pmtFunc:function(ok){
								if(ok)
								{
									vo.onClick(null,1);
									this.sendMsg();
								}
							},pmtObj:this
						}
					);
					/**/
				}
			}
		};

		//一键修兵
		__Page.dlgBattleOver.onRepairClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onRepairClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(this.btnRepair.bad)
				{
					appEnv.stateLogs.showLog(textLib["NotEnougGem"]);
				}
				else
				{
					//battle msg
					window.aisNTEngine.execFakeCmd(null,"RecoveryEnemy",{gemNum:this.repairConsume,cost:this.TrainingCost,callBack:null,callObj:null},null,0);
					appEnv.stateLogs.showLog(textLib["TroopsRepaired"]);
					this.btnRepair.setDisplay(0);
					this.picRepair.setDisplay(1);
					this.gvo.gemNum-=this.repairConsume;
				}
			}
		};

		//再次抽奖
		__Page.dlgBattleOver.onAgainClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onAgainClk");
				var page=this.page;
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
//				if(this.btnAgain.bad)
//				{
//					page.stateLogs.showLot(textLib["NotEnougGem"]);
//					return;
//				}
				this.showAniNext();
			}
		};
	}
}
