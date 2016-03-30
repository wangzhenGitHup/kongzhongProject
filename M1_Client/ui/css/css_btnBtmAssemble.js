this.cssLib.btnBtmAssemble=
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
			type:"key",id:"BtmBtnAssemble","pos":[0,0,0],key:appEnv.appKeys.bldAssemble,"css":imgLib.btn_btmassemble,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.9,
			state_up:{"css":imgLib.btn_btmassemble},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmassemble,w:imgLib.btn_btmassemble.w,h:imgLib.btn_btmassemble.h},
			state_gray:{"css":imgLib.btn_btmassemble,color_a:63},
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
	isOK2Show:function(bld)
	{
		var def,level;
		def=bld.def;
		level=bld.level;

		if(bld.constructing || bld.working)
		{
			return 0;
		}
		return 1;
	}
};
