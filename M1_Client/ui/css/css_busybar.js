this.cssLib.boxBusyBar=
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
			type:"icon","pos":pos,"css":imgLib.busybar_dock,"anchor_h":1,"anchor_v":1,id:"BusyBar",
			items:[
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
			appEnv:appEnv,
			setTimer:this.setTimer,
		};
		return css;
	},
	setTimer:function(full,cur)
	{
		var bar,timer,timeText;
		bar=this.getItemById("BarFace");
		bar.startTimer(Math.floor(full),Math.floor(cur));

		timer=this.getItemById("BarText");
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
	}
};
