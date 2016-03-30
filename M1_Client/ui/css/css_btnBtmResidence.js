this.cssLib.btnBtmResidence=
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
		css={
			type:"key",id:"BtmBtnResidence","pos":[0,0,0],key:appEnv.appKeys.bldResidence,"css":imgLib.btn_btmresidence,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":imgLib.btn_btmresidence},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmresidence,w:imgLib.btn_btmresidence.w,h:imgLib.btn_btmresidence.h},
			state_gray:{"css":imgLib.btn_btmresidence,color_a:63},
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
		return css;
	},
	isOK2Show:function(bld)
	{
		if(bld.def.groupId=="ClanBld" && !window.aisGame.curCity.allianceId)
			return 0;
		if(!bld.constructing)
		{
			return 1;
		}else
			return 0;
	}
};
