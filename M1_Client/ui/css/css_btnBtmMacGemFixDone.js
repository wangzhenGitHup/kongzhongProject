this.cssLib.btnBtmMacGemFixDone=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(bld)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib,css;
		var task,time,textColor,def,num;
		appEnv=page.appEnv;
		def=bld.def;
		task=bld.workTask;
		time=task.getRemainTime();
		num=bld.king.convertTime2Gem(time);
		var body=bld.craft.slots.body;
		var bdef=window.aisEnv.defLib.part[body.type];
		var rate=bdef.levels[body.level].RepairCoefficient;
		num=Math.floor(num*rate);

		//计算vip打折后的消耗
//		DBOut("vip gemNum: "+num+" vs "+appEnv.getVipBuildGem(num));
//		num=appEnv.getVipBuildGem(num);

		if(num>bld.king.gemNum)
		{
			textColor=[255,0,0];
		}
		else
		{
			textColor=[200,255,200];
		}
		var pic=imgLib.getImg("btn_btmgemfix"),picInfo=imgLib.getImg("btn_btminfo"),picW=picInfo.w,picH=picInfo.h;

//		var vip=appEnv.getVipCapStatus("vipBLDTimeDiscount")?window.aisGame.curCity.vipLevel:0;
//		if(!vip)vip=0;
//		var vipPic=imgLib.getImg("pic_VIP"+vip),vipW=46,vipH=vipPic.h*vipW/vipPic.w;

		css={
			//TODO: 换图:
			type:"key",id:"BtmBtnGemDone",pos:[0,0,0],key:appEnv.appKeys.bldGemFix,css:pic,anchor_h:1,anchor_v:1,ui_event:1,filter:1,button:1,down_scale:0.95,
			state_up:{css:pic},audio:page.audioObject.genFileURL("btn_click"),
			state_down:{css:pic,w:picW,h:picH},
			state_gray:{css:pic,color_a:63},
			items:[
//				{type:"icon",pos:[-picW/2+vipW/2-10,-picH/2+vipH/2-5,0],css:vipPic,w:vipW,h:vipH,anchor_h:1,anchor_v:1,display:vip?1:0},
				cssLib.textFineMid.createCSS([0,Math.floor(-imgLib.btn_upgrade.h/2+8),0],""+num,68,16,1,0,1,0,textColor),
			],
			display:0,fade:1,fade_pos:[0,0,0],fade_size:1,fade_alpha:0,
			page:page,appEnv:appEnv,postCreate:this.postCreate,
			onFadeDone:function(v)
			{
				DBOut("Fade done: "+v);
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
		var def,level;
		def=bld.def;
		if(bld.constructing==1 || !bld.working)
		{
			return 0;
		}
		return 1;
	},
	postCreate:function()
	{
		DBOut("========== postCreate ==========");
	}
};
