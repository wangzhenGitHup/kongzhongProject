this.cssLib.btnBtmHarvest=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib,css;
		var def,level,levelDef,res,resDef,url;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;
		def=bld.def;
		level=bld.level;
		levelDef=def.levels[level];
		res=def.mineRes;
		resDef=aisEnv.defLib.prdct[res];
		url=page.genPageURL(window.imgPath+"/icon/icon_"+resDef.icon+"64_32.png");
		css={
			//TODO: 换图:
			type:"key",id:"BtmBtnHarvest","pos":[0,0,0],key:appEnv.appKeys.bldHarvest,"css":imgLib.btn_btmharvest,"anchor_h":1,"anchor_v":1,ui_event:1,filter:1,button:1,down_scale:0.95,
			items:[
				{type:"icon","anchor_h":1,"anchor_v":1,"ch_align":0,"cv_align":0,pos:[0,-8,0],w:64,h:64,tex:url,tex_u:0,tex_v:0,tex_w:1,tex_h:1},
				{
					type:"txt_score",id:"Score-Cur",pos:[0,-Math.floor(imgLib.btn_btmrqstforce.h/3),0],font_size:16,w:100,h:50,align_h:1,align_v:1,anchor_h:1,anchor_v:1,
					edge:1,edge_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:255,color_b:255,color_a:255,display:0,
					timer:6,time_pause:0,time_val:0,count_down:1,msec:0,symb_d:textLib.Day,symb_dm:textLib.Day,symb_h:textLib.Hour,symb_m:textLib.Minute,symb_s:textLib.Second
				}
			],
			state_up:{"css":imgLib.btn_btmharvest},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{"css":imgLib.btn_btmharvest,w:imgLib.btn_btminfo.w,h:imgLib.btn_btminfo.h},
			state_gray:{"css":imgLib.btn_btmharvest,color_r:100,color_g:100,color_b:100,color_a:200},
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			page:page,appEnv:appEnv,bld:bld,
			update:this.update,
			aisUpdateView:this.update,
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
		var bld=bld?bld:this.bld;
		var icon=this.firstChild();
		if(!icon)return;
		if(bld.harvestable!=0)
		{
			icon.setColor([255,255,255,200]);
			this.setEnabled(1);
		}else{
			icon.setColor([100,100,100,100]);
			this.setEnabled(0);
		}
		var score=this.getItemById("Score-Cur");
		score.setDisplay(0);
		if("DiamondMine"==bld.def.codeName)
		{
			var num=bld.getValue("mineCurNum");
			var maxNum=bld.getValue("mineMaxNum");
			if(num>maxNum)
				return;;
			num=maxNum-num;
			var time=Math.floor(num/bld.getValue("mineSpeed"));
			if(time>0)
			{
				score.setDisplay(1);
				score.setTime(time*1000);
			}
		}
	},
	isOK2Show:function(bld)
	{
		if(!bld.constructing)
		{
			return 1;
		}else
			return 0;
	}
};
