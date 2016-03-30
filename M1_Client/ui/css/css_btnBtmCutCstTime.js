this.cssLib.btnBtmCutCstTime=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib,css;
		var def,level,levelDef,res,num,resDef,url;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;

		res="ResGem";
		num=window.aisEnv.defLib.globals["TIME_BUTTON_COST_GEM"];
		resDef=aisEnv.defLib.prdct[res];

		if(window.aisGame.king.gemNum>=num)
			textColor=[255,255,255];
		else
			textColor=[255,0,0];

		url=page.genPageURL(window.imgPath+"/icon/icon_"+resDef.icon+"64_32.png");
		css={
			type:"key",id:"BtmBtnInfo","pos":[0,0,0],key:appEnv.appKeys.bldCutCstTime,"css":imgLib.btn_btm4hour,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":imgLib.btn_btm4hour},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btm4hour,w:imgLib.btn_btm4hour.w,h:imgLib.btn_btm4hour.h},
			state_gray:{"css":imgLib.btn_btm4hour,color_a:63},
			items:[
				//{type:"icon",id:"ResIcon",pos:[Math.floor(imgLib.btn_upgrade.w/2-28),Math.floor(-imgLib.btn_upgrade.h/2+2),0],w:24,h:24,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
				//{css:cssLib.textFineSmall.createCSS([Math.floor(imgLib.btn_upgrade.w/2-30),Math.floor(-imgLib.btn_upgrade.h/2+4),0],""+num,68,16,2,0,2,0,textColor),font_size:18},
			],
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			page:page,appEnv:appEnv,
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
		var time=(window.aisGame.curCity.timeButtonCoolDown)-window.aisGame.king.kingTime();
		if(time<=0)
		{
			css.items.push({type:"icon",id:"ResIcon",pos:[Math.floor(imgLib.btn_upgrade.w/2-28),Math.floor(-imgLib.btn_upgrade.h/2+2),0],w:24,h:24,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1});
			css.items.push({css:cssLib.textFineSmall.createCSS([Math.floor(imgLib.btn_upgrade.w/2-30),Math.floor(-imgLib.btn_upgrade.h/2+4),0],""+num,68,16,2,0,2,0,textColor),font_size:18});
		}else{
			var btn=imgLib.btn_btmboost;
			var btnSize=btn.w;
			var clock=imgLib.pic_clock;
			var clockSize=24;
			css.gray=1;
			css.items.push({id:"clock",type:"icon",pos:[-btnSize/2+clockSize/2+4,-btn.h/2+clockSize/2+2,0],css:clock,w:clockSize,h:clockSize,anchor_h:1,anchor_v:1});
			css.items.push(
			{
				type:"txt_score",id:"Score-Cur",pos:[-btnSize/2+clockSize/2+4+clockSize/2,-btn.h/2+clockSize/2+2,0],font_size:16,w:100,h:50,align_h:0,align_v:1,anchor_h:0,anchor_v:1,
				edge:1,edge_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:255,color_b:255,color_a:255,
				timer:6,time_pause:0,time_val:time,count_down:1,msec:0,symb_d:textLib.Day,symb_dm:textLib.Day,symb_h:textLib.Hour,symb_m:textLib.Minute,symb_s:textLib.Second
			});
		}
		return css;
	},
	isOK2Show:function(bld)
	{
		if(bld.constructing && page.appEnv.bShowBtmCutCstTime())
		{
			if(bld.constructTask && bld.constructTask.getRemainTime()<=window.aisEnv.defLib.globals["TIME_BUTTON_COST_TIME"]*60*1000)return 0;

			return 1;
		}else
			return 0;
	}
};
