﻿this.cssLib.btnBtmGraveRemove=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var def,level,levelDef,res,num,resDef,url;
		var store,textColor,css;
		appEnv=page.appEnv;
		def=bld.def;
		level=bld.level;
		levelDef=def.levels[1];
		num=0;

		css={
			type:"key",id:"BtmBtnUpgrade","pos":[0,0,0],key:appEnv.appKeys.bldGraveRemove,"css":imgLib.btn_btmremove,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":imgLib.btn_btmremove},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmremove,w:imgLib.btn_btmremove.w,h:imgLib.btn_btmremove.h},
			state_gray:{"css":imgLib.btn_btmremove,color_r:128,color_g:128,color_b:128,color_a:128},
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			items:res?[
				{type:"icon",id:"ResIcon",pos:[Math.floor(imgLib.btn_upgrade.w/2-24),Math.floor(-imgLib.btn_upgrade.h/2+8),0],w:16,h:16,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
				cssLib.textFineSmall.createCSS([Math.floor(imgLib.btn_upgrade.w/2-26),Math.floor(-imgLib.btn_upgrade.h/2+8),0],""+num,68,16,2,0,2,0,textColor),
			]:null,
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
		return css;
	},
	isOK2Show:function(bld)
	{
		var def,level,bufName;
		if(!bld.constructing)
		{
			return 1;
		}
		return 0;
	}
};