this.cssLib.btnMakingPrt=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld,slot,x,y,keyid)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var def,res,num,resDef,url,picURL;
		var store,textColor,css;
		appEnv=page.appEnv;
		def=slot.def;
		resDef=aisEnv.defLib.prdct[res];
		
		picURL=page.genPageURL(window.imgPath+"/icon/"+def.codeName+"_m_32.png");
		css={
			type:"key",id:"BtnMakingPrt","pos":[x,y,0],"css":imgLib.box_shopitem,mode3x3:1,anchor_h:1,anchor_v:1,key:keyid,ui_event:1,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.box_shopitem,w:100,h:100},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.box_shopitem,w:100,h:100},
			state_gray:{"css":imgLib.box_shopitem,w:100,h:100,color_r:128,color_g:128,color_b:128,color_a:128},
			display:1,fade:1,fade_alpha:0,fade_size:1,
			items:[
				{
					type:"icon",id:"UnitIcon",pos:[0,0,0],w:100,h:100,tex:picURL,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:1,anchor_v:1,filter:1,
					items:[
						{type:"text",id:"TXT_Num",css:cssLib.textFineSmall.createCSS([2,-2,0],"10x",100,100,1,1,0,2),font_size:FS.FM},//数量
						//Progress bar:
						{
							type:"icon",id:"BarDock","pos":[0,-54,0],css:imgLib.busybar_dock,anchor_h:1,anchor_v:1,w:100,h:16,filter:1,
							display:0,
							items:[
								{type:"bar",id:"BarFace",pos:[0,0,0],css:imgLib.busybar_bar,w:100,h:16,anchor_h:1,anchor_v:1,filter:1,v_full:10,v_init:10,back_a:0,face_r:255,face_g:255,face_b:255,face_a:255},
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
		this.getFather().removeChild(this);
	},
};
