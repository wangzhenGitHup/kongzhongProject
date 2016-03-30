this.cssLib.boxShield=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,city,keyid)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var textLib=appEnv.textLib;
		var def;
		var box=imgLib.getImg("box_resbox");
		var boxW=150;
		var boxH=box.h;
		var resIcon=imgLib.getIcon("shield",64);
		resIcon.w=resIcon.h=60;
		var btnSize=40,bcSize=btnSize+24;
		var css={
			type:"shape",id:"ResBar",pos:pos,w:boxW,h:40,anchor_h:1,anchor_v:1,border_a:0,face_a:0,ui_event:1,
			items:[
				{
					type:"icon",id:"BarBox",pos:[-boxW/2,0,0],w:boxW,h:boxH,css:cssLib.expBox,anchor_h:0,anchor_v:1,
					items:[
						{type:"icon",id:"Pic-Res",pos:[box.mgL/2,0,0],css:resIcon,anchor_h:1,anchor_v:1},//资源图标
					]
				},
				{type:"text",id:"Title",css:cssLib.textFineMid.createCSS([0,-15,0],textLib["_Shield"],200,16,1,2,1,2),font_size:18},//提示

				{type:"text",id:"Text-Cur",css:cssLib.textFineMid.createCSS([15,0,0],"",200,16,1,1,1,1)},//当前数量
				{
					type:"txt_score",id:"Score-Cur",pos:[15,0,0],font_size:20,w:100,h:50,align_h:1,align_v:1,anchor_h:1,anchor_v:1,
					edge:1,edge_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:255,color_b:255,color_a:255,
					timer:6,time_pause:0,time_val:0,count_down:1,msec:0,symb_d:textLib.Day,symb_dm:textLib.Day,symb_h:textLib.Hour,symb_m:textLib.Minute,symb_s:textLib.Second
				},
				{type:"key",id:"btn",pos:[boxW/2+btnSize/2-15,0],anchor_h:1,anchor_v:1,w:bcSize,h:bcSize,ui_event:1,button:1,key:keyid,down_scale:0.9,audio:page.audioObject.genFileURL("btn_click"),
					state_up:{w:bcSize,h:bcSize,},state_down:{w:bcSize,h:bcSize},display:keyid?1:0,items:[
					{type:"icon",pos:[0,0,0],anchor_h:1,anchor_v:1,css:imgLib.getImg("btn_add"),w:btnSize,h:btnSize}
				]},
			],
			page:page,appEnv:appEnv,city:city,
			update:this.update,viewId:"UIShieldBar",
			aisUpdateView:this.update,
		};
		return css;
	},
	create:function(box,pos,city,keyid)
	{
		var css,bar;
		css=this.createCSS(pos,city,keyid);
		bar=box.appendNewChild(css);
		bar.txtCur=bar.getItemById("Text-Cur");
		bar.scoreCur=bar.getItemById("Score-Cur");
		bar.scoreCur.owner=bar;
		bar.picRes=bar.getItemById("Pic-Res");
		city.addUIView(bar);
		return bar;
	},
	update:function()
	{
		var buff=this.city.getBuff("Shield");
		if(buff)
		{
			this.picRes.setTexURL(this.page.imgLib.genIconPath("shield",64));
			buff=this.city.buffs["Shield"];
			var dt=buff.endTime-this.city.env.dateTime();
			if(dt>0)
			{
				if(dt > 1073741824-1)
				{
					this.txtCur._setText(this.appEnv.textLib.getTimeText(dt));
					this.scoreCur.setDisplay(0);
					this.txtCur.setDisplay(1);
				}
				else
				{
					this.scoreCur.setTime(dt);
					this.scoreCur.onTimer=function(){
						this.owner.update();
					};
					this.scoreCur.setDisplay(1);
					this.txtCur.setDisplay(0);
				}
				return;
			}
		}
		this.picRes.setTexURL(this.page.imgLib.genIconPath("shield_none",64));
		this.txtCur._setText(this.appEnv.textLib.NoShield);
		this.scoreCur.setDisplay(0);
		this.txtCur.setDisplay(1);
	}
};
