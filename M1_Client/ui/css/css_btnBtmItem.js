this.cssLib.btnBtmItem=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var textLib=appEnv.textLib;
		var def,level,levelDef,city;
		appEnv=page.appEnv;
		city=bld.city;
		def=bld.def;
		level=bld.level;
		levelDef=def.levels[level];
		var css={
			//TODO: 换图:
			type:"key",id:"BtmBtnItem","pos":[0,0,0],key:appEnv.appKeys.bldMakeItem,"css":imgLib.btn_btmitem,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			items:[],
			state_up:{"css":imgLib.btn_btmitem},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmitem,w:imgLib.btn_btmitem.w,h:imgLib.btn_btmitem.h},
			state_gray:{"css":imgLib.btn_btmitem},
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
				this.deadOut=1;
				this.getFather().removeChild(this);
				this.deadOut=1;
			}
		};
		return css;
	},
	isOK2Show:function(bld)
	{
		var def,level,bufName;
		var imgLib=this.imgLib;
		if(!imgLib.btn_btmitem)return 0;//新手不显示
/*
		if(bld.city.noticeList && bld.city.noticeList.length)
		{
			return 1;
		} */
		return 1;
	}
};
