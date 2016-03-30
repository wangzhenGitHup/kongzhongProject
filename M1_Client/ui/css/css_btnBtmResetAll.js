this.cssLib.btnBtmResetAll=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld1)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var def,level,levelDef,res,num,resDef,url;
		var store,textColor,css,i,list,bld,allstg;
		appEnv=page.appEnv;

		list=window.aisGame.curCity.crashedTrapsHash;
		num=0;
		allstg={storage:[{}]}

		for(i=0;i<list.length;i++)
		{
			bld=window.aisGame.king.getHashObj(list[i]);
			def=bld.def;
			level=bld.level-1;
			levelDef=def.levels[level];

			if(levelDef.cost.storage[0])
			{
				if(list[i]==bld1.hashId)
				{
					res=levelDef.cost.storage[0].type;
					resDef=aisEnv.defLib.prdct[res];
					allstg.storage[0].store=levelDef.cost.storage[0].store;
					allstg.storage[0].type=levelDef.cost.storage[0].type;
				}
				num+=levelDef.cost.storage[0].num;
			}
		}
		textColor=[255,255,255];
		store=window.aisGame.curCity.allStorages[allstg.storage[0].store];
		allstg.storage[0].num=num;
		if(store)
		{
			if(!store.checkTakeOut(allstg.storage[0]))
			{
				textColor=[255,0,0];
			}
		}
		url=page.genPageURL(window.imgPath+"/icon/icon_"+resDef.icon+"64_32.png");//16

		css={
			type:"key",id:"BtmBtnResetAll","pos":[0,0,0],key:appEnv.appKeys.bldResetAll,"css":imgLib.btn_btmresetall,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{"css":imgLib.btn_btmresetall},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmresetall,w:imgLib.btn_btmresetall.w,h:imgLib.btn_btmresetall.h},
			state_gray:{"css":imgLib.btn_btmresetall,color_r:128,color_g:128,color_b:128,color_a:128},
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
		if(!bld.constructing && bld.status==2 && window.aisGame.curCity.crashedTrapsHash.length>1)
		{
			return 1;
		}
		return 0;
	}
};
