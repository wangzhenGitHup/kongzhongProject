this.cssLib.boxMFCBar=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv,textLib;
		var css;
		appEnv=page.appEnv;
		textLib=appEnv.textLib;
		css={
			type:"icon","pos":pos,id:"MFCBar","css":imgLib.busybar_dock,"anchor_h":1,"anchor_v":1,
			items:[
				{
					type:"icon",id:"ItemPic",pos:[-Math.floor(imgLib.busybar_bar.w/2)-25,0,0],w:40,h:40,anchor_h:1,anchor_v:1,tex_u:0,tex_v:0,tex_w:1,tex_h:1,
				},
				{type:"bar",id:"BarFace",pos:[0,0,0],css:imgLib.busybar_bar,anchor_h:1,anchor_v:1,filter:1,v_full:10,v_init:10,back_a:0,face_r:255,face_g:255,face_b:255,face_a:255},
				{
					type:"text",id:"TimeText",pos:[0,-10,0],font_size:20,w:100,h:20,align_h:1,align_v:1,anchor_h:1,anchor_v:1,
					edge:1,egde_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:241,color_b:211,
				},
				{
					type:"txt_score",id:"BarText",pos:[0,-10,0],font_size:20,w:100,h:20,align_h:1,align_v:1,anchor_h:1,anchor_v:1,
					edge:1,egde_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:241,color_b:211,
					timer:6,time_pause:0,time_val:100000,count_down:1,msec:0,symb_d:textLib["StrDay"],symb_dm:textLib["StrDay"],symb_h:textLib["StrHour"],symb_m:textLib["StrMin"],symb_s:textLib["StrSec"]
				},
			],
			page:page,appEnv:appEnv,
			setTimer:this.setTimer,
			update:this.update,
		};
		return css;
	},
	setTimer:function(full,cur)
	{
		var bar,timer,timeText;
		bar=this.barItem;
		bar.startTimer(Math.floor(full),Math.floor(cur));

		timer=this.timeItem;
		timeText=this.getItemById("TimeText");
		var dist=Math.floor(full)-Math.floor(cur);
		if(dist > 1073741824-1)
		{
			timer.setDisplay(0);
			timeText.setDisplay(1);
			timeText.setText(this.appEnv.textLib.getTimeText(dist));
		}
		else
		{
			timer.setDisplay(1);
			timeText.setDisplay(0);
			timer.setTime(dist);
		}
	},
	update:function()
	{
		var bld,def,fullTime,time;
		bld=this.aisBld;
		if(!this.picItem)//第一次执行Update
		{
			this.picItem=this.getItemById("ItemPic");
			this.barItem=this.getItemById("BarFace");
			this.timeItem=this.getItemById("BarText");
		}
		if(bld.workTask)
		{
			fullTime=Math.floor(bld.workTask.getTotalTime());
			time=Math.floor(bld.workTask.getRemainTime());
			//DBOut("Work time remain: "+time+"/ "+fullTime);
			this.setTimer(fullTime,fullTime-time);
			//更新提示图标
			def=bld.workTask.prdctDef;
			if(def)
			{
				DBOut("Item icon: "+def.icon);
				if(def.type=="MacPart")
					this.picItem.setTexURL(this.page.genPageURL(window.imgPath+"/icon/"+def.icon+"_m_32.png"));
				else
					this.picItem.setTexURL(this.page.genPageURL(window.imgPath+"/icon/icon_"+def.icon+"128_32.png"));
			}else if(bld.def.groupId=="ClanBld")
			{
				this.picItem.setTexURL(this.page.genPageURL(window.imgPath+"/icon/icon_badge"+aisGame.curCity.allianceFlag+"64_32.png"));
			}
		}
	}
};
