this.cssLib.btnBtmSwitchMode=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var def,level,levelDef,res,num,url;
		var css;
		appEnv=page.appEnv;
		def=bld.def;
		level=bld.level;
		levelDef=def.levels[level];
		var img_css;
		if(bld.def.codeName=="InfernoTower")
		{
			if(bld.fireMode)
				img_css=imgLib.btn_btmsingleatk;
			else
				img_css=imgLib.btn_btmmultiatk;
		}else{
			if(bld.fireMode)
				img_css=imgLib.btn_btmgnd;
			else
				img_css=imgLib.btn_btmairgnd;
		}

		css={
			type:"key",id:"BtmBtnAmmoReload","pos":[0,0,0],key:appEnv.appKeys.bldSwitchMode,"css":img_css,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":img_css},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":img_css,w:img_css.w,h:img_css.h},
			state_gray:{"css":img_css,color_r:128,color_g:128,color_b:128,color_a:200},
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			items:[

			],
			update:this.update,
			aisUpdateView:this.update,//viewId:"UIBar",
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
		bld=bld?bld:this.bld;
		var def=bld.def;
		if(bld.def.codeName=="InfernoTower")
		{
			if(bld.fireMode)
				this.setStateStyle(2,{css:imgLib.btn_btmmultiatk});
			else
				this.setStateStyle(2,{css:imgLib.btn_btmsingleatk});
		}else{
			if(bld.fireMode)
				this.setStateStyle(2,{css:imgLib.btn_btmairgnd});
			else
				this.setStateStyle(2,{css:imgLib.btn_btmgnd});
		}
	},
	isOK2Show:function(bld)
	{
		var def,level;
		def=bld.def;
		level=bld.level;

		if(bld.constructing)
		{
			return 0;
		}
		return 1;
	}
};
