﻿this.cssLib.btnBtmPart=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib,css;
		var def;
		appEnv=page.appEnv;
		css={
			type:"key",id:"BtmBtnPart","pos":[0,0,0],key:appEnv.appKeys.bldMakePart,"css":imgLib.btn_btmpart,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.btn_btmpart},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmpart,w:imgLib.btn_btmpart.w,h:imgLib.btn_btmpart.h},
			state_gray:{"css":imgLib.btn_btmpart,color_a:63},
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
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
				this.getFather().removeChild(this);
			}
		};
		return css;
	},
};