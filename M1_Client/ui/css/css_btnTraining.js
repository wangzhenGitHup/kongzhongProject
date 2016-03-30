this.cssLib.btnTraining=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld,slot,x,y,keyid)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var def,level,levelDef,res,num,resDef,url,picURL;
		var store,textColor,css;
		appEnv=page.appEnv;
		def=slot.def;
		level=0;//TODO: 增加单位等级机制
		levelDef=def.levels[level];
		if(levelDef.cost.gem)
		{
			res="ResGem";
			num=levelDef.cost.gem;
		}else
		{
			res=levelDef.cost.storage[0].type;
			num=levelDef.cost.storage[0].num
		}
		resDef=aisEnv.defLib.prdct[res];

		picURL=page.genPageURL(window.imgPath+"/icon/icon_"+def.icon+"128_32.png");
		css={
			type:"key",id:"BtnTraining","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,"anchor_h":1,key:keyid,"anchor_v":1,ui_event:1,filter:1,down_scale:0.95,
			state_up:{"css":imgLib.box_shopitem,w:100,h:100},//audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:100,h:100},
			state_gray:{"css":imgLib.box_shopitem,w:100,h:100,color_r:128,color_g:128,color_b:128,color_a:128},
			display:1,fade:1,fade_alpha:0,fade_size:1,
			items:[
				{
					type:"icon",id:"UnitIcon",pos:[-32,-32,0],w:64,h:64,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1,
					items:[
					//	{type:"key",css:cssLib.btnInfo.createCSS([60,4,0],0),w:30,h:30},//减少按钮
						{type:"icon",pos:[60,4,0],w:30,h:30,anchor_h:1,anchor_v:1,css:imgLib.getImg("btn_sub")},
						{type:"text",id:"TXT_Num",css:cssLib.textFineMid.createCSS([-4,72,0],"10x",68,16,0,2,0,2)},//数量
						//Progress bar:
						{
							type:"icon",id:"BarDock","pos":[32,-20,0],"css":imgLib.busybar_dock,"anchor_h":1,"anchor_v":1,w:90,h:16,filter:1,
							display:0,
							items:[
								{type:"bar",id:"BarFace",pos:[0,0,0],css:imgLib.busybar_bar,w:90,h:16,anchor_h:1,anchor_v:1,filter:1,v_full:10,v_init:10,back_a:0,face_r:255,face_g:255,face_b:255,face_a:255},
							],
						},
					],
				},
			],
			page:page,appEnv:appEnv,slot:slot,bld:bld,
			update:this.update,
			aisUpdateView:this.update,
			onFadeDone:this.onFadeDone,
			delSelf:this.delSelf,
		};
		return css;
	},
	create:function(box,bld,slot,x,y,keyid)
	{
		var css,btn;
		css=this.createCSS(bld,slot,x,y,keyid);
		btn=box.appendNewChild(css);
		btn.txtNum=btn.getItemById("TXT_Num");
		btn.barTrn=btn.getItemById("BarFace");
		btn.boxTrn=btn.getItemById("BarDock");
		btn.slot=slot;
		btn.def=slot.def;
		btn.viewId="TrainingBtn";
		slot.addUIView(btn);
		slot.btn=btn;
		//TODO: Set progress bar value:
		btn.update();
		return btn;
	},
	update:function()
	{
		var slot=this.slot;
		var bld=this.bld;
		var num,time,fullTime;

		num=slot.num;
		if(num>0)
		{
			//设置数量
			this.txtNum._setText(""+num+"x");
			//设置进度条:
			if(bld.mfcSlots[0]==slot && bld.workTask)
			{
				this.boxTrn.setDisplay(1);
				fullTime=Math.floor(bld.workTask.getTotalTime());
				time=Math.floor(bld.workTask.getRemainTime());
				//DBOut("Set Time: "+fullTime+" by "+time);
				this.barTrn.startTimer(fullTime,fullTime-time);
			}
		}
		else
		{
			var pos=[0,0,0];
			//DBOut("Delete training button!");
			this.getPos(pos);
			if(slot.aborted)
			{
				pos[1]-=50;
			}
			else
			{
				pos[0]+=150;
			}
			this.setFadePos(pos);
			this.appEnv.hudOut(this,5);
		}
	},
	onFadeDone:function()
	{
		this.appEnv.layer.setFrameout(0,this.delSelf,this);
	},
	delSelf:function()
	{
		this.deadOut=1;
		this.getFather().removeChild(this);
	},
};
