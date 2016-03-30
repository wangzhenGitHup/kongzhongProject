this.cssLib.btnBtmBstRes=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var textLib=appEnv.textLib;
		var btn=imgLib.btn_btmboost;
		var btnSize=btn.w;
		var clock=imgLib.pic_clock;
		var clockSize=24;

//		var boostBuff=bld.def.levels[bld.level].boostBuff;
//		var def=window.aisEnv.defLib.buff[boostBuff];
//		var cost=def.cost;//{gem:def.cost};
//		var num=cost.gem;
//		var bad=window.aisGame.king.gemNum<num?1:0;
//		var url=page.genPageURL(window.imgPath+"/icon/icon_res_gem64_32.png");
//		var textColor=bad?[255,0,0]:[255,255,255];

		css={
			type:"key",id:"BtmBtnBoost",pos:[0,0,0],key:appEnv.appKeys.bldBoost,css:imgLib.btn_btmboost,anchor_h:1,anchor_v:1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":imgLib.btn_btmboost},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmboost,w:imgLib.btn_btminfo.w,h:imgLib.btn_btminfo.h},
			state_gray:{"css":imgLib.btn_btmboost,color_a:86},
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			items:[
				{id:"clock",type:"icon",pos:[-btnSize/2+clockSize/2+4,-btn.h/2+clockSize/2+2,0],css:clock,w:clockSize,h:clockSize,anchor_h:1,anchor_v:1,display:0},
				{
					type:"txt_score",id:"Score-Cur",pos:[-btnSize/2+clockSize/2+4+clockSize/2,-btn.h/2+clockSize/2+2,0],font_size:16,w:100,h:50,align_h:0,align_v:1,anchor_h:0,anchor_v:1,display:0,
					edge:1,edge_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:255,color_b:255,color_a:255,
					timer:6,time_pause:0,time_val:0,count_down:1,msec:0,symb_d:textLib.Day,symb_dm:textLib.Day,symb_h:textLib.Hour,symb_m:textLib.Minute,symb_s:textLib.Second
				},
//				{type:"icon",id:"ResIcon",pos:[Math.floor(imgLib.btn_upgrade.w/2-28),Math.floor(-imgLib.btn_upgrade.h/2+2),0],w:24,h:24,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
//				{css:cssLib.textFineSmall.createCSS([Math.floor(imgLib.btn_upgrade.w/2-30),Math.floor(-imgLib.btn_upgrade.h/2+4),0],""+num,68,16,2,0,2,0,textColor),font_size:18},
			],
			update:this.update,
			aisUpdateView:this.update,
			page:page,appEnv:appEnv,bld:bld,
			onFadeDone:function(v)
			{
				if(!v)
				{
					this.appEnv.layer.setFrameout(0,this.delSelf,this);
				}
			},
			delSelf:function()//删除当前按钮
			{
				this.deadOut=1;
				this.getFather().removeChild(this);
			}
		};
		return css;
	},
	update:function(bld)
	{
		var bld=bld?bld:this.bld;
		var clock=this.getItemById("clock");
		var score=this.getItemById("Score-Cur");
		var def,level,bufName;
		def=bld.def;
		bufName=def.levels[bld.level].boostBuff;
		if(bld.getBuff(bufName))
		{
			clock.setDisplay(1);
			score.setDisplay(1);
			//DBOut("BuffRemainTime:"+bld.getBuffRemainTime(bufName)+"\r\n\t"+this.appEnv.textLib.getTimeText(bld.getBuffRemainTime(bufName)));
			score.setTime(bld.getBuffRemainTime(bufName));
			this.setEnabled(0);
		}else{
			clock.setDisplay(0);
			score.setDisplay(0);
			this.setEnabled(1);
		}
	},
	isOK2Show:function(bld)
	{
		var def,level,bufName;
		def=bld.def;
		bufName=def.levels[bld.level].boostBuff;
		if(!bld.constructing && bufName)// && !bld.getBuff(bufName)
		{
			return 1;
		}
		return 0;
	}
};
