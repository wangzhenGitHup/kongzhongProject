if(!__Page.dlgAchieve)
{
	__Page.dlgAchieve=new __Page.gamePage.dlgBase(__Page,__Page.gamePage.appEnv,1);
	//指定这个对话框是属于当前Page的启动对话框
	__Page.pageDialog=__Page.dlgAchieve;
	__Page.dlgAchieve.loadConfig=function()
	{
		this.page.dlgBase.prototype.loadConfig.call(this);
	//	this.contentFieldCSS.clip=1;

		var imgLib=this.page.imgLib;
		var cssLib=this.page.cssLib;
		var appEnv=this.appEnv;
		var textLib=appEnv.textLib;

		var cntW=this.contentW, cntH=this.contentH, cInner=this.contentInner, dt=this.dt;
		var rw=270, lw=cntW-rw-dt*2-cInner[0]*2;
		var lx=cInner[0], rx=lx+lw+dt*2;
		var totalY=cInner[1]/2;
		var totalH=this.totalH=186;
		var totalFieldCSS=this.totalFieldCSS={id:"totalField",type:"div3x3",pos:[lx,totalY,0],w:lw,h:totalH,css:imgLib.getImg("box_achieve"),items:[]};
		var atkY=totalY+totalH+dt*2;
		var atkH=186;
		var atkFieldCSS=this.atkFieldCSS={id:"atkField",type:"div3x3",pos:[lx,atkY,0],w:lw,h:atkH,css:imgLib.getImg("box_achieve"),items:[]};
		var defY=atkY+atkH+dt*2;
		var defH=cntH-defY-cInner[1]/2;
		var defFieldCSS=this.defFieldCSS={id:"defField",type:"div3x3",pos:[lx,defY,0],w:lw,h:defH,css:imgLib.getImg("box_achieve"),items:[]};
		this.getTitleLineCSS=function(css,title,count,rate)
		{
			var totalTitle,subTitle,rateName;
			if("total"==title){
				totalTitle=textLib["TotalRecord"];
				subTitle=textLib["TotalCount"];
				rateName=textLib["WinRate"];
			}else if("atk"==title){
				totalTitle=textLib["AtkRecord"];
				subTitle=textLib["AtkCount"];
				rateName=textLib["AtkWinRate"];
			}else if("def"==title){
				totalTitle=textLib["DefRecord"];
				subTitle=textLib["DefCount"];
				rateName=textLib["DefWinRate"];
			}
			var items=css.items;
			var totalX=10,totalY=22,totalW=100,totalH=28;
			items.push({css:cssLib.textFineBig.createCSS([totalX,totalY,0],totalTitle,totalW,totalH,0,1,0,1),font_size:30});
			var subX=totalX+2,subH=24,subY=totalY+totalH/2+dt+subH/2,subW=120;
		//	items.push({css:cssLib.textFineMid.createCSS([subX,subY,0],subTitle,subW,subH,0,1,0,1)});
			items.push({type:"text",pos:[subX,subY,0],text:subTitle,w:subW,h:subH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200});
			var numX=subX+subW,numH=24,numY=subY,numW=115;
			items.push({css:cssLib.textFineMid.createCSS([numX,numY,0],count,numW,numH,0,1,0,1,[255,224,100,255])});
			var barW=lw-numX-numW-5,barX=lw-barW,barH=26,barY=subY;
			items.push({id:"bar",css:cssLib.boxAchBar.createCSS([barX,barY,0],rate,1,1)});
			rate=Math.floor(rate*100)+"%";
			items.push({id:"rate",css:cssLib.textFineMid.createCSS([barX+barW/2,barY-25,0],rateName+": "+rate,barW,barH,1,1,1,1)});
			css.curY=barY+barH/2+3;
		};
		this.getStarLineCSS=function(css,list,mode)
		{
			css.curY+=6;
			var dt2=8, j=0;
			var boxW=(lw-dt2*5)/4, boxH=34;
			for(var i=0; i<list.length; i++)
			{
				if(list[i] && (list[i].star>=0 && list[i].star<=3)){
					css.items.push(this.getStarBoxCSS(dt2+(boxW+dt2)*j,css.curY,boxW,boxH,list[i].star,list[i].count,mode));
					j++;
				}else{
					DBOut("getStarLineCSS error!");
				}
			}
			css.curY+=boxH;
		};
		this.getStarBoxCSS=function(x,y,w,h,star,times,mode)
		{
			var bg=imgLib.getImg("box_achieveBar_bg");
			var dt2=4, starW=18;
			var css={type:"div3x3",pos:[x,y,0],w:w,h:h,css:bg,items:[
				{id:"times",css:cssLib.textFineSmall.createCSS([w-10,h/2,0],times,w,h,2,1,2,1)}
			]};
			if("atk"==mode && 0==star)
			{
				css.items.push({css:cssLib.textFineSmall.createCSS([10,h/2,0],textLib["BattleFailed"],w,h,0,1,0,1)});
			}
			else if("def"==mode && 0==star)
			{
				css.items.push({css:cssLib.textFineSmall.createCSS([10,h/2,0],textLib["BattleWin"],w,h,0,1,0,1)});
			}
			else
			{
				for(var i=0; i<3; i++)
				{
					css.items.push({type:"icon",pos:[dt2+starW/2+(starW+dt2)*i,h/2,0],w:starW,h:starW,anchor_h:1,anchor_v:1,css:imgLib.getImg((i<star)?"pic_star":"pic_star_dark")});
				}
			}
			return css;
		};
		this.getTextLineCSS=function(css,txt,num,end)
		{
			var lineX=25, lineH=28, lineY=css.curY+lineH/2, lineW=lw-10-lineX, textW=260;
			css.items.push({type:"text",pos:[lineX,lineY,0],text:textLib[txt],w:textW,h:lineH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200});
			css.items.push({type:"text",pos:[textW,lineY,0],text:num+"",w:lineW-textW,h:lineH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200});
			if(!end)
				css.items.push({type:"div3x3",pos:[lineX,lineY+lineH/2,0],w:lineW,css:imgLib.getImg("box_blue_line")});
			css.curY+=lineH;
		};
		this.getResLineCSS=function(css,txt,gold,oil,end)
		{
			css.curY+=8;
			var lineX=25, lineH=28, lineY=css.curY+lineH/2, lineW=lw-10-lineX, textW=120, iconW=32, numW=120, iconX=lineX+textW+iconW/2, resX=iconX+iconW/2+3;
			css.items.push({type:"text",pos:[lineX,lineY,0],text:textLib[txt],w:textW,h:lineH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200});
			css.items.push({type:"icon",pos:[iconX,lineY,0],w:iconW,h:iconW,anchor_h:1,anchor_v:1,css:imgLib.getIcon("res_gold",64)});
			css.items.push({type:"text",pos:[resX,lineY,0],text:gold+"",w:numW,h:lineH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200});
			iconX=resX+numW, resX=iconX+iconW/2+3;
			css.items.push({type:"icon",pos:[iconX,lineY,0],w:iconW,h:iconW,anchor_h:1,anchor_v:1,css:imgLib.getIcon("res_oil",64)});
			css.items.push({type:"text",pos:[resX,lineY,0],text:oil+"",w:textW,h:lineH,anchor_h:0,anchor_v:1,align_h:0,align_v:1,font_size:20,color_r:0,color_g:0,color_b:0,color_a:200});
			if(!end)
				css.items.push({type:"div3x3",pos:[lineX,lineY+lineH/2,0],w:lineW,css:imgLib.getImg("box_blue_line")});
			css.curY+=lineH;
		};

		var listX=this.listX=rx;
		var listY=this.listY=totalY;
		var listW=this.listW=rw;
		var listH=this.listH=cntH-cInner[1];
		var itemW=this.itemW=listW;
		var itemH=this.itemH=90;
		this.listCSS={type:"listbox",id:"lbx-troops",pos:[listX,listY,0],w:listW,h:listH,anchor_h:0,anchor_v:0,ui_event:1,sub_event:1,dlg:this,
			arrange:0,end_gap:0,move_gap:20,fast_scroll:1,show_fx:0,show_align:0,//hot_check:1,
			item_w:itemW,item_h:itemH,item_alpha_down:1.0,item_alpha_dimmed:1.0,item_size_down:1.0,item_size_check:1.0,
			display:1,fade:1,fade_size:1,fade_alpha:0,clip:1,
		};
		var itemX=this.itemX=itemW/2;
		var itemY=this.itemY=itemH/2;
		var pic=imgLib.getImg("box_achieve");
		var centerW=this.centerW=itemW;
		var centerH=this.centerH=86;
		var centerX=this.centerX=-centerW/2;
		var centerY=this.centerY=-centerH/2;
		var centerInner=this.centerInner=[pic.mgL,pic.mgU];

		this.itemCSS={
			appEnv:appEnv,dlg:this,
			createCSS:function(rank,codeName,rate,num)
			{
				rank=rank?rank:1;
			//	codeName=codeName?codeName:"UntMarine";
			//	DBOut(codeName+" "+rate+" "+num);
				rate=Math.round(rate*1000);
				rate=(rate/10)+"%"
				var rankW=68,iconW=48,iconX=rankW+10+iconW/2,iconH=centerH-cInner[1],textX=iconX+iconW/2+10,textW=centerW-cInner[0]/2-textX;
				var css={type:"icon",pos:[itemX,itemY,0],w:itemW,h:itemH,anchor_h:1,anchor_v:1,items:[
					{type:"div3x3",pos:[centerX,centerY,0],w:centerW,h:centerH,anchor_h:0,anchor_v:0,css:imgLib.getImg("box_achieve"),items:[
						{id:"rank",css:cssLib.textFineBig.createCSS([rankW/2,centerH/2,0],rank,rankW,centerH,1,1,1,1)},
						{type:"div3x3",pos:[rankW,centerH/2-2,0],h:centerH-10,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_line")},
						{type:"div3x3",pos:[iconX,centerH/2,0],w:iconW,h:iconH,anchor_h:1,anchor_v:1,css:imgLib.getImg("box_dark")},
						{type:"icon",pos:[iconX,centerH/2+(iconH-iconW)/2,0],w:iconW,h:iconW,anchor_h:1,anchor_v:1,css:imgLib.getIcon("chr_"+codeName,128)},
						{id:"rate",css:cssLib.textFineMid.createCSS([textX,8+10,0],textLib["ActiveRate"]+": "+rate,textW,centerH/3,0,1,0,1,[70,130,180,255]),font_size:20},
						{css:cssLib.textFineSmall.createCSS([textX,8+10*2+12,0],textLib["TrainNum"],textW,centerH/3,0,1,0,1)},
						{id:"num",css:cssLib.textFineMid.createCSS([textX,8+10*2+12*2+12,0],num,textW,centerH/3,0,1,0,1)},
					]}
				]};
				return css;
			}
		};
	};
	__Page.dlgAchieve.init=function(appEnv)
	{
		this.name="dlgAchieve";
		this.viewId="dlgAchieve";
		this.page.dlgBase.prototype.init.call(this,appEnv);

		this.appEnv=appEnv;
		this.page=appEnv.page;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;
		var keyid=0;
//		keyid=appEnv.hudKeys.getKey(this);
//		this.regKeyVO(keyid,this,this.onAchClk);
		this.lbxTroops=this.cntBox.appendNewChild({css:this.listCSS,key:keyid});
	};

	__Page.dlgAchieve.enter=function(preState,vo)
	{
		//TODO:code this:
		var appEnv=this.appEnv;
		var page=this.page;
		var imgLib=page.imgLib;
		var cssLib=page.cssLib;
		var textLib=appEnv.textLib;

		var i,j,k,list,total=0,win=0,atkTimes=0,atkWin=0,defTimes=0,defWin=0,attacks,defenses,useUnits,trainUnits,totalUse=0,totalTrain=0,useRate,trainNum;
		this.infoVO=vo;
	//	DBOut(toJSON(vo));
		//根据VO初始化界面:
		if(vo)
		{
		//	DBOut("fightCount:"+vo.fightCount+",atk:"+vo.attacks.length+",def:"+vo.defenses.length);
			attacks=vo.attacks, defenses=vo.defenses;
			var atkStars={}, defStars={};
			for(i=0; i<attacks.length; i++)
			{
				atkStars[attacks[i].star+""]=1;
				atkTimes+=attacks[i].count;
				total+=attacks[i].count;
				if(attacks[i].star>0)
				{
					atkWin+=attacks[i].count;
					win+=attacks[i].count;
				}
			}
			for(i=0; i<defenses.length; i++)
			{
				defStars[defenses[i].star+""]=1;
				defTimes+=defenses[i].count;
				total+=defenses[i].count;
				if(0==defenses[i].star)
				{
					defWin+=defenses[i].count;
					win+=defenses[i].count;
				}
			}
			for(i=0; i<4; i++)
			{
				if(!atkStars[i+""])
					attacks.push({count:0,star:i});
				if(!defStars[i+""])
					defenses.push({count:0,star:i});
			}
			attacks.sort(function(a,b){return b.star-a.star});
			defenses.sort(function(a,b){return a.star-b.star});
		//	DBOut("attacks:"+toJSON(attacks));
		//	DBOut("defenses:"+toJSON(defenses));

			this.getTitleLineCSS(this.totalFieldCSS,"total",total,(win&&total)?(win/total):0);
			this.getTitleLineCSS(this.atkFieldCSS,"atk",atkTimes,(atkWin&&atkTimes)?(atkWin/atkTimes):0);
			this.getTitleLineCSS(this.defFieldCSS,"def",defTimes,(defWin&&defTimes)?(defWin/defTimes):0);
			this.getStarLineCSS(this.atkFieldCSS,attacks,"atk");
			this.getStarLineCSS(this.defFieldCSS,defenses,"def");
			this.getTextLineCSS(this.totalFieldCSS,"WinningStreak",vo.maxWinCount);
		//	this.getTextLineCSS(this.totalFieldCSS,"HighestRank",vo.maxRank);
			this.getTextLineCSS(this.totalFieldCSS,"TotalKill",vo.killEnemy);
			this.getTextLineCSS(this.totalFieldCSS,"TotalDestroy",vo.destroyBuildCount,1);
			this.getResLineCSS(this.atkFieldCSS,"TotalRob",vo.goldGainsTotal,vo.oilGainsTotal);
			this.getResLineCSS(this.atkFieldCSS,"HighestRob",vo.maxGoldGains,vo.maxOilGains,1);

			useUnits=vo.attackArmys, trainUnits=vo.trainArmys;
			useUnits.sort(function(a,b){return b.num-a.num;});
		//	DBOut("useUnits:"+useUnits.length+", trainUnits:"+trainUnits.length);
			var useVO={}, trainVO={};
			for(i=0; i<useUnits.length; i++)
			{
		//		DBOut("useUnits[i]:"+toJSON(useUnits[i]));
				totalUse+=useUnits[i].num;
				useVO[useUnits[i].codename]=useUnits[i].num;
			}
		//	DBOut("******************");
			for(i=0; i<trainUnits.length; i++)
			{
		//		DBOut("trainUnits[i]:"+toJSON(trainUnits[i]));
				totalTrain+=trainUnits[i].num;
				trainVO[trainUnits[i].codename]=trainUnits[i].num;
				if(!useVO[trainUnits[i].codename])
					useVO[trainUnits[i].codename]=0;
			}
			j=0;
		//	this.timer=setFrameout(window.DelayLoad,function(){
			appEnv.setDlgAniCall(function(){
				this.totalField=this.cntBox.appendNewChild({css:this.totalFieldCSS});
				this.atkField=this.cntBox.appendNewChild({css:this.atkFieldCSS});
				this.defField=this.cntBox.appendNewChild({css:this.defFieldCSS});

				for(i in useVO)
				{
					j++;
					useRate=(useVO[i]&&totalUse)?(useVO[i]/totalUse):0;
					trainNum=trainVO[i];
					this.lbxTroops.addItem(this.itemCSS.createCSS(j,i,useRate,trainNum));
				}
				this.timer=null;
			},this);
		}
		this.dlgTitle._setText(textLib["TechCount"]);
		if(preState)
		{
			appEnv.hudIn(this.cntBox);
			appEnv.hudOut(this.btnBack,10);
		}
	};

	__Page.dlgAchieve.leave=function(nextState)
	{
		var appEnv=this.appEnv;
		if(nextState)
		{
			appEnv.hudIn(this.btnBack,10);
			appEnv.hudOut(this.cntBox);
		}
		else
		{
		}
		if(this.timer)
		{
			clearTimeout(this.timer);
			this.timer=null;
		}
		appEnv.clearDlgAniCall();
	};

	//--------------------------------------------------------------------------
	//按键处理函数
	//--------------------------------------------------------------------------
	{
		__Page.dlgAchieve.onKey=function(msg,key,way,extra)
		{
			var ret;
			ret=this.page.dlgBase.prototype.onKey.call(this,msg,key,way,extra);
			return ret;
		};
	}
}
