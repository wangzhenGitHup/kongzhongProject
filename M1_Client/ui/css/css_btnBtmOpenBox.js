this.cssLib.btnBtmOpenBox=
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
		levelDef=def.levels[level];
		num=0;
		if(bld.openCostGem)
		{
			res="Gem";
			num=bld.openCostGem;

			textColor=[255,255,255];
			if(window.aisGame.king.gemNum<bld.openCostGem)
			{
				textColor=[255,0,0];
			}
			url=page.genPageURL(window.imgPath+"/icon/icon_res_gem64_32.png");//16
		}

		css={
			type:"key",id:"BtmBtnOpenBox","pos":[0,0,0],key:appEnv.appKeys.bldOpenBox,"css":imgLib.btn_btmfindbox,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":imgLib.btn_btmfindbox},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmfindbox,w:imgLib.btn_btmfindbox.w,h:imgLib.btn_btmfindbox.h},
			state_gray:{"css":imgLib.btn_btmfindbox,color_r:128,color_g:128,color_b:128,color_a:128},
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			items:res?[
				{type:"icon",id:"ResIcon",pos:[Math.floor(imgLib.btn_upgrade.w/2-28),Math.floor(-imgLib.btn_upgrade.h/2+2),0],w:24,h:24,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
				{css:cssLib.textFineSmall.createCSS([Math.floor(imgLib.btn_upgrade.w/2-30),Math.floor(-imgLib.btn_upgrade.h/2+4),0],""+num,68,16,2,0,2,0,textColor),font_size:18},
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
