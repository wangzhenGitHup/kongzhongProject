this.cssLib.btnBtmUpgrade=
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

		textColor=[255,255,255];

		if(levelDef.cost.gem)
		{
			res="ResGem";
			num=levelDef.cost.gem;
			if(window.aisGame.king.gemNum<num)
				textColor=[255,0,0];
		}else{
			res=levelDef.cost.storage[0].type;
			num=levelDef.cost.storage[0].num;
			store=window.aisGame.curCity.allStorages[levelDef.cost.storage[0].store];
			if(store)
			{
				if(!store.checkTakeOut(levelDef.cost.storage[0]))
				{
					textColor=[255,0,0];
				}
			}
		}

		resDef=aisEnv.defLib.prdct[res];

		url=page.genPageURL(window.imgPath+"/icon/icon_"+resDef.icon+"64_32.png");
		css={
			type:"key",id:"BtmBtnUpgrade","pos":[0,0,0],key:appEnv.appKeys.bldUpgrade,"css":imgLib.btn_upgrade,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":imgLib.btn_upgrade},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_upgrade,w:imgLib.btn_upgrade.w,h:imgLib.btn_upgrade.h},
			state_gray:{"css":imgLib.btn_upgrade,color_r:128,color_g:128,color_b:128,color_a:128},
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			items:[
				{type:"icon",id:"ResIcon",pos:[Math.floor(imgLib.btn_upgrade.w/2-28),Math.floor(-imgLib.btn_upgrade.h/2+2),0],w:24,h:24,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1,anchor_h:0,anchor_v:0,filter:1},
				{css:cssLib.textFineSmall.createCSS([Math.floor(imgLib.btn_upgrade.w/2-30),Math.floor(-imgLib.btn_upgrade.h/2+4),0],""+num,68,16,2,0,2,0,textColor),font_size:18},
			],
			page:page,appEnv:appEnv,postCreate:this.postCreate,
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
		if(level>=def.levels.length-1 || bld.constructing)
		{
			css.gray=1;
			css.items=null;
		}
		if(def.discount && def.discount<100)
		{
			css.items.push({type:"icon",id:"discount",pos:[0,5,0],css:imgLib["icon_discount"+def.discount+"s"],anchor_h:1,anchor_v:1,filter:1});
		}
		return css;
	},
	isOK2Show:function(bld)
	{
		var def,level;
		def=bld.def;
		level=bld.level;
		if(aisGame.guideMode && bld.def.codeName!="TownHall")return 0;
		if(bld.def.groupId=="Obstacle" || bld.def.groupId=="Decorate")
		{
			return 0;
		}
		if(level>=def.levels.length-1 || bld.constructing || bld.working)
		{
			return 0;
		}
		return 1;
	},
	postCreate:function()
	{
		var d,hud=this.getItemById("discount");
		if(hud)
		{
			if(hud.getDisplay())
				this.appEnv.addLoopScale(hud,0.1,{minX:0.95,maxX:1.05,minY:0.95,maxY:1.05});
		}
	}
};
