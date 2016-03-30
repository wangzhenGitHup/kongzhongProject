this.cssLib.btnBtmRqstForce=
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
		var def,level,levelDef;
		appEnv=page.appEnv;
		def=bld.def;
		level=bld.level;
		levelDef=def.levels[level];
		DBOut("---levelDef.reinforceTime="+levelDef.reinforceTime);
		var pic=imgLib.getImg("btn_btmrqstforce"),picInfo=imgLib.getImg("btn_btminfo"),picW=picInfo.w,picH=picInfo.h;

		var vip=appEnv.getVipCapStatus("vipRequestUnitsWaitTime")?window.aisGame.curCity.vipLevel:0;
		if(!vip)vip=0;
		var vipPic=imgLib.getImg("pic_VIP"+vip),vipW=46,vipH=vipPic.h*vipW/vipPic.w;

		var css={
			//TODO: 换图:
			type:"key",id:"BtmBtnInfo",pos:[0,0,0],key:appEnv.appKeys.bldRequsetUnit,css:pic,anchor_h:1,anchor_v:1,ui_event:1,filter:1,button:1,down_scale:0.95,
			items:[
				{id:"vip",type:"icon",pos:[-picW/2+vipW/2-10,0,0],css:vipPic,w:vipW,h:vipH,anchor_h:1,anchor_v:1,display:0},
				{id:"gem",css:cssLib.textFineMid.createCSS([0,Math.floor(-imgLib.btn_upgrade.h/2+8),0],"",68,16,1,0,1,0,[255,255,255])},
				/*
				{
					type:"txt_score",id:"Score-Cur",pos:[0,Math.floor(picH/3),0],font_size:16,w:100,h:50,align_h:1,align_v:1,anchor_h:1,anchor_v:1,
					edge:1,edge_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:255,color_b:255,color_a:255,
					timer:6,time_pause:0,time_val:0,count_down:1,msec:0,symb_d:textLib.Day,symb_dm:textLib.Day,symb_h:textLib.Hour,symb_m:textLib.Minute,symb_s:textLib.Second
				}
				*/
			],
			state_up:{css:pic},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{css:pic,w:picW,h:picH},
			state_gray:{css:imgLib.btn_btmrqstcd},
			update:this.update,
			aisUpdateView:this.update,
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			page:page,appEnv:appEnv,bld:bld,vipStatus:vip,
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
	update:function(bld)
	{
		var bld=bld?bld:this.bld;
		var vip=this.getItemById("vip");
		//var score=this.getItemById("Score-Cur");
		var gemhud=this.getItemById("gem");
		var storage=bld.city.clanStorage;
		if(!storage.getFreeCap())
		{
			//score.setDisplay(0);
			gemhud.setDisplay(0);
			this.setTexURL(window.imgPath+"/ui/all_0_32.png");
			this.setStateStyle(2,{css:imgLib.btn_btmrqstfull});
			this.setEnabled(0);
			vip.setDisplay(0);
			return;
		}
		if(bld.working)
		{
			var task,time,num;
			task=bld.workTask;
			time=task.getRemainTime();
			num=bld.king.convertTime2Gem(time);
			var city=window.aisGame.curCity;
			//if(city.vipLevel)
			{
				var defLib=window.aisEnv.defLib.vipPrivilege;
				var def=defLib["vipBLDTimeDiscount"];
				if(def && def.levels[city.vipLevel])
				num=Math.round(num*def.levels[city.vipLevel].modifyValue/100);
			}
			num=Math.round(num*window.aisEnv.defLib.globals["CLAN_TIME_GEM_MODFIY"]);
			//score.setDisplay(1);
			//score.setTime(this.bld.workTask.getRemainTime());
			//this.setStateStyle(2,{css:imgLib.btn_btmrqstcd});
			gemhud.setDisplay(1);
			gemhud._setText(num+"");
			if(num>bld.king.gemNum)
			{
				gemhud._setColor(255,0,0,255);
			}
			else
			{
				gemhud._setColor(200,255,200,255);
			}

			this.setTexURL(window.imgPath+"/ui/add2_0_32.png");
			this.setStateStyle(0,{css:imgLib.btn_btmgemrqstcd});
			this.setStateStyle(1,{css:imgLib.btn_btmgemrqstcd});

			//this.setStateStyle(2,{css:imgLib.btn_btmgemrqstcd});
			//this.setEnabled(0);
			if(this.vipStatus)
				vip.setDisplay(1);
		}else{
			//score.setDisplay(0);
			gemhud.setDisplay(0);
			this.setEnabled(1);
			vip.setDisplay(0);
		}
	},
	isOK2Show:function(bld)
	{
		var def,level,bufName;

		if(!bld.constructing && bld.city.allianceId)//
		{
			return 1;
		}
		return 0;
	}
};
