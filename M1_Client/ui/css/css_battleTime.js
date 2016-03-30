this.cssLib.battleTime=
{
	cssLib:this.cssLib,
	imgLib:this.imgLib,
	createCSS:function(pos,cur)
	{
		var imgLib=this.imgLib;
		var cssLib=this.cssLib;
		var page=cssLib.page;
		var appEnv=page.appEnv;
		var textLib=appEnv.textLib;

		var css={
			type:"shape",id:"battleTime",pos:pos,w:100,h:50,anchor_h:1,anchor_v:1,border_a:0,face_a:0,
			items:[
				{type:"text",id:"Text-Title",css:cssLib.textFineMid.createCSS([0,-35,0],textLib.BattleStartIn,100,50,1,1,1,1)},
				//{type:"text",id:"Text-Cur",css:cssLib.textFineBig.createCSS([0,0,0],"00",100,50,1,1,1,1)},
				{
					type:"txt_score",id:"Text-Cur",pos:[0,0,0],font_size:40,w:100,h:50,align_h:1,align_v:1,anchor_h:1,anchor_v:1,
					edge:1,egde_r:0,edge_g:0,edge_b:0,edge_a:255,color_r:255,color_g:241,color_b:211,
					timer:6,time_pause:0,time_val:0,count_down:1,msec:0,symb_d:textLib.Day,symb_dm:textLib.Day,symb_h:textLib.Hour,symb_m:textLib.Minute,symb_s:textLib.Second
				},
			],
			page:page,appEnv:appEnv,
			start:this.start,setTitle:this.setTitle,
			update:this.update,
			setTimerFactor:this.setTimerFactor,
			setCallBack:this.setCallBack,
			getTime:this.getTime
		};
		return css;
	},
	create:function(box,pos,cur)
	{
		var css,bar;
		css=this.createCSS(pos,cur);
		bar=box.appendNewChild(css);
		bar.txtCur=bar.getItemById("Text-Cur");
		bar.txtTitle=bar.getItemById("Text-Title");
		bar.cur=cur;
		return bar;
	},
	setTitle:function(title)
	{
		this.txtTitle.setText(title);
	},
	start:function(time)
	{
		this.cur=time;
		this.txtCur.setTime(this.cur*1000);
	},
	setTimerFactor:function(spt)
	{
		if(this.txtCur.setTimerFactor)
		this.txtCur.setTimerFactor(spt);
	},
	setCallBack:function(fun,obj)
	{
		this.txtCur.onTimer=fun;
		this.txtCur.obj=obj;
	},
	getTime:function()
	{
		return this.txtCur.getTime();
	}
};
