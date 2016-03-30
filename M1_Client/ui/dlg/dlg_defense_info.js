if(!__Page.dlgDefense)
{
	__Page.dlgDefense=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,2);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgDefense;
	__Page.dlgDefense.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var pic, icon, dt=this.dt, cntW=this.contentW, cntH=this.contentH, cntInner=this.contentInner;
		//解说图
		pic=imgLib.getImg("pic_girl");
		var girlX=cntInner[0]/2+pic.w/2;
		var girlY=cntH/2;
		var girlW=pic.w;
		var girlH=pic.h;
		this.girlCSS={id:"pic-girl",type:"icon",pos:[girlX,girlY,0],anchor_h:1,anchor_v:1,css:pic};
		pic=imgLib.getImg("btn_green_u");
		var btnW=this.btnW=pic.w;
		var btnH=this.btnH=pic.h;
		var btnX=this.btnX=cntW-cntInner[0]/2-10-btnW/2;
		var btnY=this.btnY=cntH-cntInner[1]/2-10-btnH/2;
		var subCntX=girlX+girlW/2+dt;
		var subCntY=cntInner[1];
		var subCntW=cntW-subCntX-cntInner[0];
		var subCntH=btnY-btnH/2-30-subCntY;
		this.subCntCSS={id:"subCnt",type:"div3x3",pos:[subCntX,subCntY,0],w:subCntW,h:subCntH,css:imgLib.getImg("box_solid"),ui_event:1,color_r:220,color_g:220,color_b:220};
		this.cenW=subCntW-cntInner[0];
		this.cenH=subCntH-cntInner[1];
		this.cenX=cntInner[0]/2;
		this.cenY=cntInner[1]/2;
		this.lineCSS={
			lw:this.cenW,lh:50,page:this,
			createCSS:function(vo)
			{
				var size=this.lh;
				var iconLv=imgLib.getIcon("level",64);
				iconLv.w=iconLv.h=size;
				var lineY=size/2;
				var lvX=size/2;
				var nameX=size+6;
				var medalX=this.lw-size/2;
				var scoreX=this.lw-size-6;
				var color=vo.rewardHonor>0?[10,255,10,255]:[255,10,10,255];
				var iconMedal=imgLib.getIcon("medal",64);
				iconMedal.w=iconMedal.h=size;
				var typeCSS;
				if(!vo.raidType){
					typeCSS=imgLib.getImg("pic_atk_normal");
				}else if(1==vo.raidType){
					typeCSS=imgLib.getImg("pic_atk_revenge");
				}else if(2==vo.raidType){
					typeCSS=imgLib.getImg("pic_atk_force");
				}else if(3==vo.raidType){
					typeCSS=imgLib.getImg("pic_atk_foe");
				}
				return {type:"icon",pos:[0,0,0],w:this.lw,h:this.lh,items:[
					{css:cssLib.iconText.createCSS([0,lineY,0],iconLv,vo.attackerLevel,1,null,0,-1)},
					{css:cssLib.textFineMid.createCSS([nameX,lineY-12,0],vo.attackerName,100,this.lh,0,1,0,1)},
					{type:"icon",pos:[nameX,lineY+12,0],anchor_h:0,anchor_v:1,css:typeCSS},
					{css:cssLib.textFineMid.createCSS([scoreX,lineY,0],vo.rewardHonor,100,this.lh,2,1,2,1,color)},
					{type:"icon",pos:[medalX,lineY,0],css:iconMedal,anchor_h:1,anchor_v:1}
				]};
			}
		};
		this.topTxtH=50;
		this.btmLineCSS={
			lx:this.cenX,ly:this.cenH-30+20,lw:this.cenW,lh:40,
			createCSS:function(score)
			{
				var size=this.lh;
				var color=score>0?[10,255,10,255]:[255,10,10,255];
				return {type:"icon",pos:[this.lx,this.ly,0],w:this.lw,h:size,anchor_h:0,anchor_v:1,items:[
					{type:"icon",pos:[this.lw-size/2,0],w:size,h:size,css:imgLib.getIcon("medal",64),anchor_h:1,anchor_v:1},
					{css:cssLib.textFineMid.createCSS([this.lw-size-3,0,0],score+"",100,this.lh,2,1,2,1,color)},
					{css:cssLib.textFineMid.createCSS([this.lw-size-50,0,0],textLib["TotalScore"],100,this.lh,2,1,2,1)}
				]}
			}
		};
		this.lbxLogCSS={type:"listbox",id:"lbx-log",pos:[this.cenX,50,0],w:this.cenW,h:this.cenH-this.topTxtH-this.btmLineCSS.lh-28+30,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:this.cenW,item_h:this.lineCSS.lh+4,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1
		};
	};
	__Page.dlgDefense.init=function(appEnv)
	{
		this.name="dlgDefense";
		this.viewId="dlgDefense";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;
		var keyid=0;

		this.dlgTitle._setText(textLib["UBeAttack"]);
		this.picGirl=this.cntBox.appendNewChild({css:this.girlCSS});
		this.subCnt=this.cntBox.appendNewChild({css:this.subCntCSS});
		keyid=appEnv.hudKeys.getKey(this);
		this.regKeyVO(keyid,this,this.onOkClk);
		this.btn=this.cntBox.appendNewChild({id:"btn-ok",css:cssLib.normalBtn.createCSS([this.btnX,this.btnY,0],keyid,0,textLib["OK"])});
		this.topTxt=this.subCnt.appendNewChild({css:cssLib.textFineSmall.createCSS([this.cenX,this.cenY,0],textLib["UBeAttackDesc"],this.cenW,this.topTxtH,0,0,0,0,"",1)});
		this.lbxLog=this.subCnt.appendNewChild({css:this.lbxLogCSS});
	};
	__Page.dlgDefense.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var cssLib=this.page.cssLib;
		var textLib=appEnv.textLib;
	//	textLib=aisEnv.textLib;

		//根据VO初始化界面:
		this.infoVO=vo;
		if(!vo)
		{
			vo=[
				{attackerLevel:9,attackerName:"attacker",rewardHonor:9,raidType:0},
				{attackerLevel:9,attackerName:"attacker",rewardHonor:-8,raidType:1},
				{attackerLevel:9,attackerName:"attacker",rewardHonor:9,raidType:2},
				{attackerLevel:9,attackerName:"attacker",rewardHonor:9,raidType:3},
				{attackerLevel:9,attackerName:"attacker",rewardHonor:9,raidType:0},
			];
		}
		var i,item,honor=0;
		for(var i=0; i<vo.length; i++)
		{
			honor+=vo[i].rewardHonor;
			item=this.lineCSS.createCSS(vo[i]);
			this.lbxLog.addItem(item);
		}
		this.btmLine=this.subCnt.appendNewChild({css:this.btmLineCSS.createCSS(honor)});
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
		if(this.page.audioObject && this.page.audioObject._init)
		{
			this.page.audioObject.playMusic("beAttack",0);
		}
	};
	__Page.dlgDefense.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
	//	window.aisGame.curCity.leaveAttacked=[];
		this.city=window.aisGame.curCity;
		var noticeList=this.city.noticeList;
		DBOut("*** noticeList="+noticeList);
		if(noticeList && noticeList.length)
		{
			var cookie=this.page.getCookie("M1NoticeReaded","NoticeReaded");
			if(!noticeList[0].state || !cookie)
				this.page.stateHome.onKey(1,appEnv.appKeys.bldNotice,1,-1);
		}
	};
	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgDefense.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
	}
}
