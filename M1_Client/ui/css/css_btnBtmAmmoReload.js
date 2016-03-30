this.cssLib.btnBtmAmmoReload=
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
		res=levelDef.ammoRes.type;
		num=levelDef.maxAmmo-bld.curAmmo;
		num*=levelDef.res2AmmoRate;
		if(num>0 && num<1)
			num=1;
		else
			num=Math.ceil(num);
		resDef=aisEnv.defLib.prdct[res];

		textColor=[255,255,255];
		store=window.aisGame.curCity.allStorages[levelDef.ammoRes.storage];
		if(store)
		{
			if(num && !store.checkTakeOut({store:levelDef.ammoRes.storage,type:res,num:num}))
			{
				textColor=[255,0,0];
			}
		}
		var img_css,gray_css;
		if(bld.def.codeName=="InfernoTower")
		{
			img_css=imgLib.btn_cubereload;
			gray_css=imgLib.btn_cubereloadfull;
		}else{
			img_css=imgLib.btn_ammoreload;
			gray_css=imgLib.btn_ammoreloadfull;
		}

		url=page.genPageURL(window.imgPath+"/icon/icon_"+resDef.icon+"64_32.png");
		css={
			type:"key",id:"BtmBtnAmmoReload","pos":[0,0,0],key:appEnv.appKeys.bldAmmoRelod,"css":img_css,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":img_css},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":img_css,w:img_css.w,h:img_css.h},
			state_gray:{"css":gray_css,color_r:128,color_g:128,color_b:128,color_a:200},
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			items:[
				{type:"icon",id:"ResIcon",pos:[Math.floor(imgLib.btn_upgrade.w/2-28),Math.floor(-imgLib.btn_upgrade.h/2+2),0],w:24,h:24,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
				{id:"ResNum",css:cssLib.textFineSmall.createCSS([Math.floor(imgLib.btn_upgrade.w/2-30),Math.floor(-imgLib.btn_upgrade.h/2+4),0],""+num,68,16,2,0,2,0,textColor),font_size:18}
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
		var levelDef=def.levels[level];
		var num=levelDef.maxAmmo-bld.curAmmo;
		if(!num)
		{
			css.gray=1;
			css.items=null;
		}
		return css;
	},
	update:function(bld)
	{
		bld=bld?bld:this.bld;
		var def=bld.def;
		var level=bld.level;
		var levelDef=def.levels[level];
		var num=levelDef.maxAmmo-bld.curAmmo;
		if(!num)
		{
			this.setEnabled(0)
			if(this.getItemById("ResIcon"))this.getItemById("ResIcon").setDisplay(0);
			if(this.getItemById("ResNum"))this.getItemById("ResNum").setDisplay(0);
		}
		else
		{
			this.setEnabled(1);
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
