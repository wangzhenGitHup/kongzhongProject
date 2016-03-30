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
		this.lineCSS={
			w:boxw,h:50,
			createCSS:function(pos,num,icon)
			{
				var iconCSS=imgLib.getIcon(icon,64);
				iconCSS.w=iconCSS.h=48;
				var lineW=this.w, lineH=this.h;
				var iconX=iconCSS.w/2+3;
				var txtX=-3;
				var itemY=lineH/2;
				return {type:"shape",pos:pos,w:lineW,h:lineH,anchor_h:1,anchor_v:0,face_a:0,items:[
					{type:"icon",pos:[iconX,itemY,0],css:iconCSS,anchor_h:1,anchor_v:1},
					{css:cssLib.textFineMid.createCSS([txtX,itemY,0],""+num,lineW,lineH,2,1,2,1,num<0?[200,0,0,255]:[255,255,255,255]),font_size:FS.XXL},
				//	{type:"icon",pos:[0,lineH,0],css:imgLib.getImg("pic_line"),anchor_h:1,anchor_v:1}
				]};
			}
		};
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onBackHomeClk);
		pic=imgLib.getImg("btn_green_u");
		var btnW=pic.w, btnH=pic.h;
		var btnX=lightX, btnY=boxh-10-btnH/2+5;
		this.btnBackHome=this.dlgBox.appendNewChild({css:cssLib.normalBtn.createCSS([btnX,btnY,0],keyid,0,textLib["BackHome"],btnW,btnH),button:1});
		var listW=508, listH=64;
		var listX=lightX, listY=btnY-btnH/2-10-listH/2+5;
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
		var lostTxtX=lightX, lostTxtY=listY-listH/2-14, lostTxtW=gainTxtW, lostTxtH=gainTxtH;
		this.lostTxt=this.dlgBox.appendNewChild({type:"text",css:cssLib.textFineMid.createCSS([lostTxtX,lostTxtY,0],textLib["ArmyConsume"],lostTxtW,lostTxtH,1,1,1,1)});

		var rdmSize=64, rdmGap=12;
		var lootH=rdmSize, lootW=rdmSize*8+rdmGap*7, lootX=(boxw-lootW)/2, lootY=lostTxtY-16;
		this.rdmW=this.rdmH=rdmSize, this.rdmGap=rdmGap;
		this.lootH=lootH, this.lootW=lootW, this.lootX=lootX, this.lootY=lootY;

		var btnRdmX=lootX+lootW+90, btnRdmY=lootY-lootH/2;
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onRdmClk);
		this.btnRdm=this.dlgBox.appendNewChild({css:cssLib.normalBtn.createCSS([btnRdmX,btnRdmY,0],keyid,0,textLib["Lottery"]),display:0});
		this.txtAgain=this.dlgBox.appendNewChild({css:cssLib.textFineMid.createCSS([btnRdmX,btnRdmY-45,0],textLib["Again"],200,30,1,2,1,2),display:0});

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
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onRdmClk_gem);
			this.btnRdm_gem=this.dlgBox.appendNewChild({css:cssLib.btnResGo.createCSS([btnRdmX,btnRdmY,0],160,"gem",1,0,keyid),display:0});

			var repairConsume=this.repairConsume=0;//this.page.vwBattleStage.recoverUnitGem;
			var bad=repairConsume>this.gvo.gemNum?1:0;
			keyid=appEnv.hudKeys.getKey(this);
			this.regKeyVO(keyid,this,this.onRepairClk);
			var repairW=160, repairH=68, repairX=listX+listW/2+repairW/2+10, repairY=listY;
			this.btnRepair=this.dlgBox.appendNewChild({css:cssLib.btnResGo.createCSS([repairX,repairY,0],160,"gem",repairConsume,bad,keyid,0,repairH),display:repairConsume?1:0});
			this.btnRepair.bad=bad;
			this.repairDesc=this.btnRepair.appendNewChild({css:cssLib.textFineSmall.createCSS([-repairW/2,-repairH/2,0],textLib["OneClickRepair"],100,20,0,1,0,1),font_size:FS.L});
		//	this.btnRdm_gem.setResNum("gem",num,bad);
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

		appEnv.addRotate_z(this.bgLight,0.005);
		page.stateLogs.clearLogs();

		var i,army=[],units=[],icon;
		var rew=[{type:"Res_Gold",num:9},{type:"Res_Oil",num:9},{type:"medal",num:"+"+9}];
		var army1=[{codename:"UntMarine",num:9,level:3,type:"unit"},{codename:"UntSniper",num:9,level:3,type:"unit"},{codename:"UntHacker",num:9,level:3,type:"unit"}];
		var honor=0,star=0,rate=0;
		//DBOut("vo="+vo);
		if(vo)
		{
			rew=vo.remainRes();
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
					icon="badge"+page.getCookie(cookieDomain,"ClanFlag");
				}else if("mech"==army1[i].type){
					icon=army1[i].icon;
					army1[i].level=-1;
				}
				army.push({codename:i,num:army1[i].num,level:army1[i].level,icon:icon,clan:("clan"==army1[i].type)?1:0});
			}
		//	DBOut("army="+toJSON(army));
			star=vo.stage.star;
		//	DBOut("star="+star);
			rate=Math.floor(vo.stage.deadRate);
		//	DBOut("rate="+rate);
		}
		if(honor)
		{
			rew.push({type:"medal",num:honor>0?"+"+honor:""+honor});
		}
		if(!army)
		{
			army=[];
		}
		var x=this.dlgW/2;
		var y=this.gainTxtY+this.gainTxtH/2+5;
		var x1,y1;
		for(var i=0; i<rew.length; i++)
		{
			if("Res_Gold"==rew[i].type){
				icon="res_gold";
			}else if("Res_Oil"==rew[i].type){
				icon="res_oil";
			}else{
				icon=rew[i].type;
			}
			if(this.page.vwBattleStage)// && vo.stage.star
			{
				if(0==i){
					x1=x-120;
					y1=y;
				}else if(1==i){
					x1=x+120;
					y1=y;
				}else if(2==i){
					x1=x;
					y1=y+5+this.lineCSS.h;
				}//x,y+(5+this.lineCSS.h)*i
			}
			else
			{
				x1=x;
				y1=y+(5+this.lineCSS.h)*i;
			}
			this.dlgBox.appendNewChild({css:this.lineCSS.createCSS([x1,y1,0],rew[i].num,icon)});
			this.dlgBox.appendNewChild({type:"icon",pos:[x,y1+this.lineCSS.h,0],css:imgLib.getImg("pic_line"),anchor_h:1,anchor_v:1});
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
		if(this.page.audioObject && this.page.audioObject._init)
		{
			this.page.audioObject.playMp3(star>0?"winwinwin":"battle_lost",0);
		}
		if(this.page.vwBattleStage && vo)// && vo.stage.star
		{
			this.curPrice=0;
			this.lootBox=this.dlgBox.appendNewChild({type:"shape",pos:[this.lootX,this.lootY,0],w:this.lootW,h:this.lootH,anchor_h:0,anchor_v:2,display:0,
				face_r:200,face_g:200,face_b:200,face_a:0});
			this.btnRdm.setDisplay(1);
			this.lootBox.setDisplay(1);
			this.addLoots(vo);
		}

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
		if(!loots || !loots.length)
		{
			DBOut("no loot!!!");
			this.btnRdm.setDisplay(0);
			var txt=textLib["HowToLottery"];
			if(this.gvo)
			{
				DBOut("gvo:"+toJSON(this.gvo));
				if(!this.gvo.mfLv)
					txt=textLib["LootNeedMechFactory"];
				else if(this.gvo.medal<this.gvo.medalReq)
					txt=textLib.getTextEx("LootNeedMedal",{level:this.gvo.thLv,medal:this.gvo.medalReq});
			}
			this.lootBox.appendNewChild({css:cssLib.textFineMid.createCSS([0,0,0],txt,this.lootW,this.lootH,0,2,1,1),flash:2});
			return;
		}
		DBOut("loots: "+toJSON(loots));
		this.loots=loots[vo.stage.star-1];
		if(!this.loots || !this.loots.length)
		{
			DBOut("no loot!!! add fake loot");
		//	return;
			this.loots=loots[loots.length-1];
		}
		this.lootBtns=[];
		var loots=this.loots;
		var vo, type, num, icon=imgLib.getIcon("icon_res_gold64_32"), hud;
		var x, y, rw=this.rdmW, rh=this.rdmH, rg=this.rdmGap;
		for(var i=0; i<8; i++)
		{
			type=loots[i].type;
			num=loots[i].num;
			if(type.indexOf("plu")>-1 || type.indexOf("par")>-1)
			{
				icon=imgLib.getIcon(type+"_32");
			}
			else if("tok1"==type)
			{
				icon=imgLib.getIcon("icon_res_chip64_32");
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
			x=rw/2+(rw+rg)*i;
			y=-rh/2;
			hud=this.lootBox.appendNewChild({type:"div3x3",pos:[x,y,0],w:rw,h:rh,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_unit_white"),//face_r:10,face_g:10,face_b:10,face_a:160,
				items:[
					{id:"icon",type:"icon",pos:[0,0,0],w:rw,h:rh,css:icon,anchor_h:1,anchor_v:1},
					{id:"name",css:cssLib.textFineSmall.createCSS([0,0,0],"x"+num,rw,rh,1,1,2,2)},
				],
			});
			this.lootBtns.push(hud);
		}
		this.selFrame=this.lootBox.appendNewChild({type:"icon",pos:[0,0,0],w:rw+(rw-42),h:rh+(rh-42),anchor_h:1,anchor_v:1,css:imgLib.getImg("box_lottery"),display:0,//face_r:100,face_g:100,face_b:100,face_a:160,
			items:[
				{id:"double",type:"icon",pos:[0,-rh/2,0],anchor_h:1,anchor_v:2,css:imgLib.getImg("pic_double"),display:0}
			]
		});
		this.curPos=0;
		this.aniTimes=0;
		this.okTimes=0;
		this.svrTime=-1;
		this.svrRdm=0;
	};

	//
	__Page.dlgBattleOver.showAni=function()
	{
	//	DBOut("************* pos:"+this.curPos+", at:"+this.aniTimes+", ot:"+this.okTimes);
		this.aniTimer=null;
		var pos=[], dis;
		if(8==this.curPos)
			this.curPos=0;
/**针对两次抽奖结果都保留**/
		if(this.lootBtns[this.curPos].used)
		{
			this.curPos++;
			this.showAni();
			return;
		}
/**/
		this.lootBtns[this.curPos].getPos(pos);
		this.selFrame.setPos(pos);
		this.selFrame.setDisplay(1);
		var gap=100;
		if(0==this.aniTimes)
			gap=500;
		else if(1==this.aniTimes)
			gap=400;
		else if(2==this.aniTimes)
			gap=300;
		else if(3==this.aniTimes)
			gap=200;
		else if(4==this.aniTimes)
			gap=100;
		else
			gap=50;
		if(30==this.aniTimes)
		{
			this.okTimes=1;
		}
		this.page.audioObject.playSound("boxclick");
		if(this.okTimes)
		{
		//	gap=gap+this.okTimes*gap/2;
			this.okTimes++;
			if(this.svo && this.svo.idx>=0)
			{
				if(-1==this.svrTime)
				{
					this.svrOk=0;
					this.svrRdm=Math.floor(Math.random()*4)+3;
					dis=this.svo.idx-this.svrRdm;
					if(dis<0)dis=8+dis;
					if(this.lootBtns[dis].used)
						this.svrRdm+=1;
					this.svrTime=this.curPos;
				}
				else
				{
					dis=this.svo.idx-this.curPos;
					if(dis<0)dis=8+dis;
					if(dis==this.svrRdm)
					{
						this.svrOk++;
						gap=50+100*(this.svrRdm-dis);
					}
					else if(dis<this.svrRdm && this.svrOk)
					{
						this.svrOk++;
						gap=50+100*(this.svrRdm-dis);
					}
					else
						gap=50;
				//	DBOut("===== curPos="+this.curPos+", aim="+this.svo.idx);
				//	DBOut("dis="+dis+", svrOk="+this.svrOk+", svrRdm="+this.svrRdm);
					if(this.svrOk>=this.svrRdm)
					{
						if(this.curPos==this.svo.idx)
						{
							this.showResult();
							return;
						}
					}
				}
			}
		}
		this.curPos++;
		this.aniTimes++;
		this.aniTimer=setTimeout(gap,this.showAni,this);
	};

	__Page.dlgBattleOver.onSvrTimeout=function()
	{
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		appEnv.stateLogs.showLog(textLib["ConnectTimeoutDesc"]);
		if(this.aniTimer)
		{
			clearTimeout(this.aniTimer);
			this.aniTimer=null;
			this.selFrame.setDisplay(0);
			this.btnBackHome.setEnabled(1);
		}
		this.longTimer=null;
	};

	__Page.dlgBattleOver.doRandom=function()
	{
		var num=this.repairConsume;
		var bad=num>(this.gvo.gemNum-this.curPrice)?1:0;
		this.btnRepair.bad=bad;
		this.btnRepair.setResNum("gem",num,bad);

		if(this.longTimer)
		{
			clearTimeout(this.longTimer);
			this.longTimer=null;
		}
		this.longTimer=setTimeout(1000*30,this.onSvrTimeout,this);
		if(this.curBtn)
			this.curBtn.scaleAni.stop();
		this.selFrame.getItemById("double").setDisplay(0);
		this.sendMsg();
		this.rdmTimes++;
		this.updateRdmBtn();
		this.curPos=0;
		this.aniTimes=0;
		this.okTimes=0;
		this.svrTime=-1;
		this.svrRdm=0;
		this.svo=null;
		this.showAni();
	};

	__Page.dlgBattleOver.showResult=function()
	{
		this.aniTimer=null;
		if(this.longTimer)
		{
			clearTimeout(this.longTimer);
			this.longTimer=null;
		}
		this.curPos=0;
		this.aniTimes=0;
		this.okTimes=0;
		this.svrRdm=0;
		this.svrTime=-1;
		this.curBtn=this.lootBtns[this.svo.idx];
		this.curBtn.used=1;
		this.curBtn.getItemById("icon").setColor([255,255,255,128]);
		this.appEnv.addLoopScale(this.curBtn,0.1,{maxX:1.05,minX:0.9,maxY:1.05,miniY:0.9});
		DBOut("get item: "+toJSON(this.loots[this.svo.idx]));
		if(2==this.svo.doubleReward)
		{
			this.selFrame.getItemById("double").setDisplay(1);
		}
		if(this.rdmTimes==this.gvo.times)
		{
			this.txtAgain.setDisplay(0);
			this.btnRdm_gem.setDisplay(0);
		}
		else
		{
			this.txtAgain.setDisplay(1);
			this.btnRdm_gem.setDisplay(1);
		}
		this.btnBackHome.setEnabled(1);
		this.gvo.gemNum-=this.curPrice;
	};

	//更新钻石抽奖按钮
	__Page.dlgBattleOver.updateRdmBtn=function()
	{
		if(this.rdmTimes>0)
			this.btnRdm.setDisplay(0);
		this.txtAgain.setDisplay(0);
		this.btnRdm_gem.setDisplay(0);
		var num=this.gvo.price[this.rdmTimes-1];
		var bad=num>this.gvo.gemNum?1:0;
		this.bad=bad;
		this.curPrice=num;
		this.btnRdm_gem.setResNum("gem",num,bad);
		this.btnBackHome.setEnabled(0);
	};

	__Page.dlgBattleOver.sendMsg=function()
	{
		if(window.aisNTEngine)
		{
			var time=0;
			var gem=0;
			if(this.rdmTimes)
			{
				gem=this.gvo.price[this.rdmTimes-1];
			}
			DBOut("++++ gem="+gem);
			window.aisNTEngine.execFakeCmd(null,"GetBtReward",{gem:gem,callBack:this.onSvrOK,callObj:this},null,time);
		}
	};

	//抽奖服务器回调
	__Page.dlgBattleOver.onSvrOK=function(svo,err,exInfo)
	{
		DBOut("++++++++ onSvrOK:"+svo+", err:"+err+", "+exInfo);
	//	Dialogs.alert("++++++++ onSvrOK:"+svo+", err:"+err+", "+exInfo);
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		if(this.longTimer)
		{
			clearTimeout(this.longTimer);
			this.longTimer=null;
		}
		if(-1==svo)
		{
			appEnv.stateLogs.showLog(textLib["LotteryErr"]);
			if(this.aniTimer)
			{
				clearTimeout(this.aniTimer);
				this.aniTimer=null;
				this.selFrame.setDisplay(0);
				this.btnBackHome.setEnabled(1);
			}
		}
		else
		{
			//svo+="#$#2";
			svo+="";
			svo=svo.split("#$#");
			var vo={idx:svo[0],doubleReward:svo[1]};
			this.svo=vo;
		}
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
				DBOut("dlgBattleOver.onKey: "+key+", "+msg+", "+extra);
			}
			ret=this.autoOnKey(msg,key,way,extra);
			if(ret)
				return ret;
			//DO other stuffs:
		};

		//成就列表被点击
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

		//免费抽奖
		__Page.dlgBattleOver.onRdmClk=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onRdmClk");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(!this.mainState.stage.star)
				{
					appEnv.stateLogs.showLog(textLib["LootNeedWin"]);
					return;
				}
				if(!this.loots || !this.loots.length)
				{
					appEnv.stateLogs.showLog(textLib["LotteryErr1"]);
					return;
				}
				if(-1==this.page.stateBattle.canbet)//主本等级不符
				{
					appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["CanNotLottery"],info:textLib["CityLvNotMatch"],
						pmtFunc:"",pmtObj:"",pmtParam:""});
					return;
				}
				else if(-2==this.page.stateBattle.canbet)//没有机甲工厂
				{
					appEnv.showPmtDlg(this.page.pmtInfo,0,{title:textLib["CanNotLottery"],info:textLib["NeedMechFactory"],
						pmtFunc:"",pmtObj:"",pmtParam:""});
					return;
				}
				this.doRandom();
			}
		};

		//花钻抽奖
		__Page.dlgBattleOver.onRdmClk_gem=function(msg,key,way,extra)
		{
			if(1==way && 1==msg)
			{
				DBOut("onRdmClk_gem");
				var appEnv=this.appEnv;
				var textLib=appEnv.textLib;
				if(this.bad)
				{
					appEnv.stateLogs.showLog(textLib["NotEnougGem"]);
					return;
				}
				if(1==this.rdmTimes)
				{
					appEnv.showPmtDlg(this.page.pmtChoose,0,
						{
							title:textLib["AskGemBuyBox"],info:textLib["AskGemBuyBoxDesc"],
							pmtFunc:function(ok){
								if(ok)
								{
									this.doRandom();
								}
							},pmtObj:this
						}
					);
				}
				else
				{
					this.doRandom();
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
					window.aisNTEngine.execFakeCmd(null,"RecoveryEnemy",{gemNum:this.repairConsume,callBack:null,callObj:null},null,0);
					this.btnRepair.setDisplay(0);
					this.picRepair.setDisplay(1);
				}
			}
		};
	}
}
